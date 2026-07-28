import os
from dotenv import load_dotenv
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI,HTTPException,status,Depends
from fastapi.security import OAuth2PasswordRequestForm
from starlette.responses import RedirectResponse
from model import URL,UserAccount
from validation import email_password_validation,validate_account,login_verification
from database import (create_mapping,get_original_url,map_user_customized_code,
                      delete_mapping,list_mappings,update_click_count,update_custom_code,
                      check_custom_code_exist,fetch_all_details,create_table)
from security import encode_jwt,decode_jwt
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
DOMAIN=os.getenv("DOMAIN")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app:FastAPI):
    create_table()
    logger.info("Table Created")
    yield


app=FastAPI(lifespan=lifespan)

orgins=[
    "http://localhost:5174",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=orgins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)


@app.get("/",status_code=status.HTTP_200_OK)
def health_check():
    return {"status":"ok"}


@app.post("/create-account",status_code=status.HTTP_201_CREATED)
async def create_account(user:UserAccount):
    is_valid=email_password_validation(user)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success":False,
                "error":{
                    "code": "INCORRECT_FORMAT",
                    "message": "Email or password is  in wrong format"
                }

            }
        )

    account_created=validate_account(user)
    if not account_created:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success":False,
                "error":{
                    "code": "ACCOUNT_EXIST",
                    "message": "Requested account already exists"
                }

            }

        )
    return {
        "success":True,
        "data":{
            "name":user.name
        },
        "message":"Account created successfully",
    }

@app.post("/login",status_code=status.HTTP_201_CREATED)
async def login(form_data:OAuth2PasswordRequestForm=Depends()):
    email=form_data.username
    password=form_data.password
    is_valid=login_verification(email,password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success":False,
                "error":{
                    "code": "INVALID_CREDENTIALS",
                    "message": "Invalid credentials"
                }
            }
        )
    jwt_token=encode_jwt(email)
    return {
        "success":True,
       "access_token":jwt_token,
        "token_type":"bearer",
        "message":"Login successful",
    }


@app.get("/my-urls",status_code=status.HTTP_200_OK)
async def get_urls(payload=Depends(decode_jwt)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success":False,
                "error":{
                    "code":"UNAUTHORIZED",
                    "message":"Unauthorized access. login"
                }
            }
        )
    user_id=payload["user_id"]
    url_mappings=list_mappings(user_id)
    if not url_mappings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success":False,
                "error":{
                    "code": "NOT_FOUND",
                    "message": "No url found"
                }
            }
        )

    return {
        "success":True,
        "data":url_mappings,
        "message":"All urls retrieved",
     }


@app.post("/shorten-url",status_code=status.HTTP_201_CREATED)
async def shorten_url(data: URL,payload=Depends(decode_jwt)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success":False,
                "error":{
                    "code":"UNAUTHORIZED",
                    "message":"Unauthorized access. login"
                }
            }
        )
    #data is pydantic object, data.url will access the value(url)
    user_id=payload["user_id"]
    short_code=create_mapping(user_id,data.url)

    if not short_code:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success":False,
                "error":{
                    "code":"SHORTCODE_GENERATION_FAILED",
                    "message":"Could not generate short code. Please try again"
                }
            }
        )
    short_url = f"{DOMAIN}/{short_code}"
    return{
        "success": True,
        "data":{
            "short_url": short_url
        },
        "message":"Short Url created",

    }

@app.post("/customize-url",status_code=status.HTTP_201_CREATED)
async def customized_url(custom_code:str,original_url:URL,payload=Depends(decode_jwt)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success":False,
                "error":{
                    "code":"UNAUTHORIZED",
                    "message":"Unauthorized access. login"
                }
            }
        )
    user_id=payload["user_id"]
    custom_url_created=map_user_customized_code(user_id,custom_code,original_url.url,)
    if  not custom_url_created:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success":False,
                "error":{
                    "code":"CUSTOM_URL_EXIST",
                    "message":"Requested custom url already exist"
                }
            }
        )
    full_url=f"{DOMAIN}/{custom_code}"
    return {
        "success": True,
        "data":{
            "custom_url": full_url
        },
        "message":"Custom Url created",

    }

# display top 5 records
@app.get("/dashboard",status_code=status.HTTP_200_OK)
async def dashboard(payload=Depends(decode_jwt)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success":False,
                "error":{
                    "code":"UNAUTHORIZED",
                    "message":"Unauthorized access. login"
                }
            }
        )
    user_id=payload["user_id"]
    name=payload["name"]
    dashboard_details=fetch_all_details(user_id)
    if dashboard_details is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success":False,
                "error":{
                    "code":"NOT_FOUND",
                    "message":"Requested user not found"
                }
            }
        )

    return {
        "success": True,
        "data":{
            "name":name,
            "dashboard":dashboard_details
        },
        "message":"Dashboard data retrieved successfully"
    }




@app.get("/{short_code}",status_code=status.HTTP_200_OK)
#GET method has no body. and the path is a string value. so str used instead of pydantic
# coz pydantic will look for url data type, but that doesnt exist. as GET doesnt give body
async def retrieve_url(short_code: str):


    original_url=get_original_url(short_code)
    if not original_url:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success":False,
                "error":{
                    "code":"NOT_FOUND",
                    "message":"Requested url not found"
                }
            }
        )
    update_click_count(short_code)

    return RedirectResponse(url=original_url,status_code=status.HTTP_302_FOUND)



@app.delete("/{custom_code}",status_code=status.HTTP_202_ACCEPTED)
# custom_code refers to both customized url and short code
async def delete_url(custom_code:str,payload=Depends(decode_jwt)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success":False,
                "error":{
                    "code":"UNAUTHORIZED",
                    "message":"Unauthorized access. login"
                }
            }
        )
    user_id=payload["user_id"]
    # use the url parser to extract the short code alone
    #short_code=extract_short_code(custom_code)
    deletion_successful=delete_mapping(custom_code,user_id)
    if not deletion_successful:
        raise  HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success":False,
                "error":{
                    "code":"NOT_FOUND",
                    "message":"Requested url not found"
                }
            }
        )
    return {
        "success": True,
        "data":{},
        "message":"Url deleted"
    }

@app.patch("/{old_custom_code}",status_code=status.HTTP_202_ACCEPTED)
async def update_url(old_custom_code:str,new_custom_code:str,payload=Depends(decode_jwt)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success":False,
                "error":{
                    "code":"UNAUTHORIZED",
                    "message":"Unauthorized access. login"
                }
            }
        )
    user_id=payload["user_id"]
    #old_short_code=extract_short_code(old_custom_code)

    old_custom_code_exist=check_custom_code_exist(user_id,old_custom_code)
    if  not old_custom_code_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success":False,
                "error":{
                    "code":"NOT_FOUND",
                    "message":" custom url does not exist"
                }
            }
        )
    new_custom_code_exist=check_custom_code_exist(user_id,new_custom_code)
    if new_custom_code_exist:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success":False,
                "error":{
                    "code":"CUSTOM_URL_EXIST",
                    "message":"Requested custom url already exist"
                }
            }
        )

    success=update_custom_code(user_id,old_custom_code,new_custom_code)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success":False,
                "error":{
                    "code":"INTERNAL_SERVER_ERROR",
                    "message":"Internal Server Error"
                }
            }
        )
    return {
        "success": True,
        "data":{},
        "message":"Custom URL successfully updated"
    }


## TODO: dash board is showing NOT_FOUND error. but the error msg is having requested url not found
## THis msg belongs to retrive_url adn delete url enpoint. so check ti

## TODO : DOne -> error fixed.. just moved the dashboard endpoitn up.
# isseu was that delete, retrive, update had/{} so dashboard into this.

## TODO: The custom code size should be atleast 6 chars
import datetime
import logging
import os
import jwt
from dotenv import load_dotenv
from database import fetch_name,fetch_user_id
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends


logger=logging.getLogger(__name__)

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
oauth2_scheme=OAuth2PasswordBearer(tokenUrl="login")

def encode_jwt(email):
    user_id=fetch_user_id(email)
    name=fetch_name(email)
    expiry_time=datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(minutes=30)

    payload={
        "user_id":user_id,
        "name":name,
        "exp":expiry_time
    }
    token=jwt.encode(payload,SECRET_KEY,algorithm="HS256")
    return token

def decode_jwt(token: str =Depends(oauth2_scheme)):
    print(f"recieved token: {token}")
    try:
        decoded_payload=jwt.decode(token,SECRET_KEY,algorithms=["HS256"])
        return decoded_payload
    except jwt.ExpiredSignatureError:
        logger.error("Signature expired. Please log in again.")
        return None
    except jwt.InvalidTokenError:
        logger.error("Invalid token. Please log in again.")
        return None




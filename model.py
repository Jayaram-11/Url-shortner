from pydantic import BaseModel,HttpUrl

class URL(BaseModel):
    url: HttpUrl

class UserAccount(BaseModel):
    name: str
    email: str
    password: str


class LoginAccount(BaseModel):
    email:str
    password:str


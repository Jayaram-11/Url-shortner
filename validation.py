import re
from email_validator import validate_email,EmailNotValidError
import logging
import bcrypt
from database import (insert_user_credentials,check_user_exist,
                      fetch_hashed_password)
logger=logging.getLogger(__name__)


def password_validation(password)-> bool:
    if re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%*^])[A-Za-z\d@#$%^]{5,}$", password):
        return True
    return False

def email_validation(email)-> bool:
    try:
        validate_email(email,check_deliverability=False)
        return True
    except EmailNotValidError as e:
        logger.error(f"Email not valid: {e}")
        return False

def hash_password(password:str)-> bytes:
    return bcrypt.hashpw(password.encode("utf-8"),bcrypt.gensalt())

def check_password(password:str,hashed_password:bytes)-> bool:
    return bcrypt.checkpw(password.encode("utf-8"),hashed_password)

def email_password_validation(user)-> bool:
    return email_validation(user.email) and password_validation(user.password)

def validate_account(user)-> bool:
    email=user.email
    hashed_password=hash_password(user.password)
    name=user.name
    user_not_exist=check_user_exist(email)
    if user_not_exist:
        return False
    success=insert_user_credentials(email,hashed_password,name)
    return success


def login_verification(email,password)-> bool:
    user_exist=check_user_exist(email)
    if not user_exist:
        return False
    hashed_password=fetch_hashed_password(email)
    valid_user=check_password(password,hashed_password)
    if not valid_user:
        return False
    return True



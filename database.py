
import sqlite3
import logging
from dotenv import load_dotenv
import os
from utils import generate_short_code,create_qr_code


DB_NAME='Mappings.db'

load_dotenv()
DOMAIN=os.getenv('DOMAIN')
logger=logging.getLogger(__name__)

def create_connection():
    return sqlite3.connect(DB_NAME)

def create_table():
    #when using with .commit() and close() not reqd. when with ends .close() automatically excuted.
    # .commit() is automatically called if exception block not there. if except is there then it rollsback
    #.commit() mannualy called when we want to save something and then conitnue with other operation in same block
    with create_connection() as conn:

        cursor = conn.cursor()
        conn.execute("PRAGMA FOREIGN_KEYS=ON")
        cursor.execute(
            """CREATE TABLE IF NOT EXISTS USERS (
            UID INTEGER PRIMARY KEY AUTOINCREMENT,
            NAME TEXT NOT NULL,
            EMAIL TEXT NOT NULL,
            PASSWORD BLOB NOT NULL);"""
        )

        cursor.execute(
        '''CREATE TABLE IF NOT EXISTS URL_MAPPING (
        UID INTEGER REFERENCES USERS (UID),
        CUSTOMIZED_CODE TEXT PRIMARY KEY ,
        ORIGINAL_URL  TEXT NOT NULL ,
        CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CLICK_COUNT INTEGER NOT NULL DEFAULT 0
                    );''')


def check_user_exist(email)-> bool:
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor=conn.cursor()
            cursor.execute("""SELECT * FROM USERS WHERE EMAIL=?;""",
                           (email,))
            result=cursor.fetchone()
            if result:
                return True
            return False
    except sqlite3.OperationalError as e:
        logger.error(f"Error while checking duplicate email: {e}")
        return False


def insert_user_credentials(email,password,name):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()


            cursor.execute("""
            INSERT INTO USERS (NAME, EMAIL, PASSWORD)
            VALUES (?,?,?);""",
                           (name,email,password))
            return True
    except sqlite3.OperationalError as e:
        logger.error(f"Error while storing user credentials: {e}")
        return False

def fetch_hashed_password(email):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT PASSWORD FROM USERS WHERE EMAIL=?;""",
                           (email,))
            result=cursor.fetchone()
            return result[0]
    except sqlite3.OperationalError as e:
        logger.error(f"Error while retrieving password: {e}")
        return None
def fetch_user_id(email):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"""SELECT UID FROM USERS WHERE EMAIL=?;""",
                           (email,))
            result=cursor.fetchone()
            return result[0]
    except sqlite3.OperationalError as e:
        logger.error(f"Error while retrieving userid:{e}")
        return None

def fetch_name(email):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"""SELECT NAME FROM USERS WHERE EMAIL=?;""",
                           (email,))
            result = cursor.fetchone()
            return result[0]

    except sqlite3.OperationalError as e:
        logger.error(f"Error while retrieving userid:{e}")
        return None


# while loop runs till unique customized url is generated
def create_mapping(user_id,original_url):
    while True:
        short_code = generate_short_code()


        try:
            with create_connection() as conn:

                cursor = conn.cursor()

                cursor.execute(f'''INSERT INTO URL_MAPPING (UID,CUSTOMIZED_CODE, ORIGINAL_URL)
                                    VALUES (?,?,?);''',
                               (user_id,short_code, str(original_url))) # sqlite cant store httpurl obj.so covert to str

            return short_code
        except sqlite3.IntegrityError:
            pass
        except Exception as e:
            logger.error(f"Error while creating mapping: {e}")
            return False




def get_original_url(short_code):
    try:
        with create_connection() as conn:

            cursor = conn.cursor()
            cursor.execute("SELECT ORIGINAL_URL FROM URL_MAPPING WHERE CUSTOMIZED_CODE = ?;",
                           (short_code,))
            # result is a tuple
            result=cursor.fetchone()

            if result:
                return result[0]
            else:
                return None
    except sqlite3.OperationalError as e:
        logger.error(f"Error while retriving Original Url: {e}")
        return None

# query param is the custom url/short code that users wishes to delete
def delete_mapping(custom_code,user_id):
    code_exist=check_custom_code_exist(user_id,custom_code)
    if not code_exist:
        return False
    try:
        with create_connection() as conn:
            cursor=conn.cursor()
            cursor.execute(f'''DELETE FROM URL_MAPPING WHERE UID = ? AND CUSTOMIZED_CODE = ?;''',
                           (user_id,custom_code))
        return True
    except sqlite3.OperationalError as e:
        logger.error(f"Error occured while deleting mapping: {e}")
        return False
def list_mappings(user_id):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""SELECT  ORIGINAL_URL, CUSTOMIZED_CODE, CREATED_AT FROM URL_MAPPING WHERE UID=?""",
                           (user_id,))
            records=cursor.fetchall()

            url_mappings=[]
            for row in records:
                url_mappings.append({
                    "original_url":row[0],
                    "custom_code":row[1],
                    "custom_url": f"{DOMAIN}/{row[1]}",
                    "created_at": row[2],
                    "qr_url": f"{DOMAIN}/QR_codes/{row[1]}_qrcode.png"
                })
            return url_mappings

    except sqlite3.OperationalError as oe:
        logger.error(f"Error occured while retriving all urls: {oe}")
        return False




def map_user_customized_code(user_id,custom_code,original_url):

    with create_connection() as conn:
        try:


            cursor = conn.cursor()
            cursor.execute(f'''INSERT INTO URL_MAPPING (UID,CUSTOMIZED_CODE, ORIGINAL_URL)
                                                VALUES (?,?,?);''',
                           (user_id,custom_code, str(original_url)))

            return custom_code

        except sqlite3.IntegrityError as ie:
            logger.error(f"Custom url already exist {ie}")
            return False
        except sqlite3.OperationalError as e:
            logger.error(f"Error while creating custom url mapping: {e}")
            return False

def update_click_count(custom_code): #custom url means both short code and custom url
    with create_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        UPDATE URL_MAPPING SET CLICK_COUNT= CLICK_COUNT+1  WHERE CUSTOMIZED_CODE = ?;""",
                       (custom_code,))

def check_custom_code_exist(user_id,custom_code):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT * FROM URL_MAPPING WHERE UID=? AND CUSTOMIZED_CODE = ?;""",
                           (user_id,custom_code))
            record=cursor.fetchone()
            if record:
                return True
        return False
    except sqlite3.OperationalError as e:
        logger.error(f"Error occured while checking custom url exist: {e}")
        return False


def update_custom_code(user_id,old_custom_code,new_custom_code):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            UPDATE URL_MAPPING SET CUSTOMIZED_CODE=? WHERE UID=? AND CUSTOMIZED_CODE = ?;""",
                           (new_custom_code,user_id,old_custom_code))
            return True
    except sqlite3.OperationalError as e:
        logger.error(f"Error occured while updating custom url: {e}")
        return False


def fetch_all_details(user_id):
    try:
        with create_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT  ORIGINAL_URL, CUSTOMIZED_CODE, CLICK_COUNT, CREATED_AT FROM URL_MAPPING WHERE UID =? ORDER BY CLICK_COUNT DESC LIMIT 5;""",
                           (user_id,))
            record=cursor.fetchall()
            user_details=[]
            for row in record:
                user_details.append({
                    "original_url": row[0],
                    "custom_code": row[1],
                    "custom_url": f"{DOMAIN}/{row[1]}",
                    "click_count": row[2],
                    "created_at": row[3],
                    "qr_url":f"{DOMAIN}/QR_codes/{row[1]}_qrcode.png"
                })
            return user_details

    except sqlite3.OperationalError as e:
        logger.error(f"Error occured while fetching all details of given user: {e}")
        return None


def delete_table():
    with create_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''DROP TABLE URL_MAPPING;''')
        cursor.execute('''DROP TABLE USERS;''')
    logger.warning("table deleted")


def debug_url_table():
    try:
        with create_connection() as conn:

            cursor = conn.cursor()
            cursor.execute('''
            SELECT * FROM URL_MAPPING;''')
            record=cursor.fetchall()
            print(record)
    except sqlite3.OperationalError as e:
        logging.debug("Debug functn -url")

def debug_user_table():
    try:
        with create_connection() as conn:

            cursor = conn.cursor()
            cursor.execute('''
            SELECT * FROM USERS;''')
            record=cursor.fetchall()
            print(record)
    except sqlite3.OperationalError as e:
        logging.debug("Debug functn-users")

#create_table()
#delete_table()

#debug_url_table()
#debug_user_table()
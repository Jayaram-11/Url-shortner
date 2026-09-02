import os
import random
import string
from urllib.parse import urlparse
import qrcode
import logging

logger=logging.getLogger(__name__)

SHORT_CODE_LENGTH=7
DOMAIN=os.getenv('DOMAIN')

def generate_short_code():
    return "".join(random.choice(string.ascii_letters+string.digits) for i in range(SHORT_CODE_LENGTH))

def extract_short_code(custom_url:str):
    custom_url=custom_url.strip()
    parsed_url = urlparse(custom_url)
    if parsed_url.scheme in ['http', 'https']:
        if parsed_url.netloc != DOMAIN:
            return None
        return parsed_url.path.lstrip('/')
    return custom_url

def create_qr_code(custom_url:str,short_code:str):
    qr=qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4
    )
    qr.add_data(custom_url)
    qr.make(fit=True)
    qr_image=qr.make_image(fill_color="black",back_color="white")
    path=f"QR_codes/{short_code}_qrcode.png"
    qr_image.save(path)


def delete_qr_code(short_code:str):
    path = f"QR_codes/{short_code}_qrcode.png"

    if os.path.exists(path):
        os.remove(path)
    logger.info("Deleted QR code")


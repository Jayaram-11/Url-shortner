import os
import random
import string
from urllib.parse import urlparse

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



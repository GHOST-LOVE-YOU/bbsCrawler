# import uuid
import uuid
from crawlee.playwright_crawler import PlaywrightCrawler
from crawlee.models import BaseRequestData
from crawler.route import router
from dotenv import load_dotenv
from crawlee.configuration import Configuration
import os

load_dotenv()
AUTH_USERNAME = os.getenv("AUTH_USERNAME")
AUTH_PASSWORD = os.getenv("AUTH_PASSWORD")

# 简单的认证函数
def authenticate(username: str, password: str) -> bool:
    print('username:',username)
    print('password:',password)
    print('AUTH_USERNAME:',AUTH_USERNAME)
    print('AUTH_PASSWORD:',AUTH_PASSWORD)
    return username == AUTH_USERNAME and password == AUTH_PASSWORD

async def run_crawler():
    config = Configuration(
        persist_storage=False,
        purge_on_start=True,
    )
    crawler = PlaywrightCrawler(
        max_requests_per_crawl=500,
        request_handler=router,
        configuration=config,
    )
    print('ij:',crawler._configuration)
    unique_key = str(uuid.uuid4())
    request = BaseRequestData(url='https://bbs.byr.cn/#!board/IWhisper', unique_key=unique_key)
    
    await crawler.run([request])
    # await crawler.run(['https://bbs.byr.cn/#!board/IWhisper'])
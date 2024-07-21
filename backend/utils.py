# import uuid
import uuid
from crawlee.playwright_crawler import PlaywrightCrawler
from crawlee.models import BaseRequestData
from crawler.route import router
from dotenv import load_dotenv
import os

load_dotenv()
AUTH_USERNAME = os.getenv("AUTH_USERNAME")
AUTH_PASSWORD = os.getenv("AUTH_PASSWORD")

# 简单的认证函数
def authenticate(username: str, password: str) -> bool:
    return username == AUTH_USERNAME and password == AUTH_PASSWORD

async def run_crawler():
    crawler = PlaywrightCrawler(
        max_requests_per_crawl=500,
        request_handler=router,
    )
    unique_key = str(uuid.uuid4())
    # print(unique_key)
    # await crawler.run([{'url': 'https://bbs.byr.cn/#!board/IWhisper', 'uniqueKey': "145"}])
    # await crawler.run([f'https://bbs.byr.cn/#!board/IWhisper/{unique_key}'])
    request = BaseRequestData(url='https://bbs.byr.cn/#!board/IWhisper', unique_key=unique_key)
    await crawler.run([request])

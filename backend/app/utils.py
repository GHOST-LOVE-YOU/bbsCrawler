# import uuid
import uuid
from crawlee.playwright_crawler import PlaywrightCrawler
from crawlee.models import BaseRequestData
from crawler.route import router
from dotenv import load_dotenv
from crawlee.configuration import Configuration
import os
from crawlee.storages.request_queue import RequestQueue

load_dotenv()
AUTH_USERNAME = os.getenv("AUTH_USERNAME")
AUTH_PASSWORD = os.getenv("AUTH_PASSWORD")

# 简单的认证函数
def authenticate(username: str, password: str) -> bool:
    return username == AUTH_USERNAME and password == AUTH_PASSWORD

async def run_crawler():
    # 生成唯一的请求ID
    request_id = str(uuid.uuid4())
    config = Configuration(
        persist_storage=False,
    )
    crawler = PlaywrightCrawler(
        max_requests_per_crawl=500,
        request_handler=router,
        configuration=config,
        request_provider=await RequestQueue.open(name=request_id),
    )
    
    unique_key = str(uuid.uuid4())
    request = BaseRequestData(url='https://bbs.byr.cn/#!board/IWhisper', unique_key=unique_key)
    
    await crawler.run([request])
    # await crawler.run(['https://bbs.byr.cn/#!board/IWhisper'])
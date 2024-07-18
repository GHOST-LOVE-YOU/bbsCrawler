from crawlee.playwright_crawler import PlaywrightCrawler
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
    await crawler.run(['https://bbs.byr.cn/#!board/IWhisper'])
    return
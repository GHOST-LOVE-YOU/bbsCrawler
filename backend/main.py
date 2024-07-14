# from fastapi import FastAPI

# app = FastAPI()


# @app.get("/")
# async def root():
#     return {"message": "Hello World"}



import asyncio

from crawlee.playwright_crawler import PlaywrightCrawler

from crawler.route import router

async def main() -> None:
    crawler = PlaywrightCrawler(
        # max_requests_per_crawl=50,
        headless=False,
        request_handler=router,
    )

    await crawler.run(['https://bbs.byr.cn/#!board/IWhisper'])


if __name__ == '__main__':
    asyncio.run(main())
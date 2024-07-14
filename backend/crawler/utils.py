from crawlee.playwright_crawler import PlaywrightCrawlingContext
from datetime import datetime
from dotenv import load_dotenv
import os
import json

# 保存和加载 Cookies 的文件路径
COOKIES_FILE_PATH = 'cookies.json'

# 加载.env文件
load_dotenv()
# 读取环境变量
USERNAME = os.getenv("USERNMAE")
PASSWORD = os.getenv("PASSWORD")

# 定义时间格式解析函数
def parse_time(time_str):
    try:
        if ':' in time_str:
            return datetime.strptime(time_str, "%H:%M:%S")
        else:
            return datetime.strptime(time_str, "%Y-%m-%d")
    except ValueError:
        return None
    
async def save_cookies_to_file(page):
    cookies = await page.context.cookies()
    with open(COOKIES_FILE_PATH, 'w') as f:
        json.dump(cookies, f)

async def load_cookies_from_file(page):
    try:
        with open(COOKIES_FILE_PATH, 'r') as f:
            cookies = json.load(f)
            await page.context.add_cookies(cookies)
    except FileNotFoundError:
        print("没有找到cookies文件, 将要重新登录")

async def handle_request(context):
    page = context.page
    await load_cookies_from_file(page)
    await page.goto(context.request.url)

    # 假设需要重新登录
    is_login_page = await page.query_selector('#u_login_form')
    if is_login_page:
        print('需要登陆')
        await page.fill('#u_login_id', USERNAME)
        print('填充用户名')
        await page.fill('#u_login_passwd', PASSWORD)
        print('填充密码')
        await page.click('#u_login_submit')
        print('点击登陆')
        await page.wait_for_load_state('networkidle')
        print('登陆成功')
        # 保存cookies
        await save_cookies_to_file(page)

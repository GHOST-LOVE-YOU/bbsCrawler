from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import json
import re
from crawlee.playwright_crawler import PlaywrightCrawlingContext

# 保存和加载 Cookies 的文件路径
COOKIES_FILE_PATH = 'cookies.json'

load_dotenv()
USERNAME = os.getenv("USERNMAE")
PASSWORD = os.getenv("PASSWORD")

# 时间字符串转换函数
def convert_to_datetime(time_str):
    try:
        time_format = "%a %b %d %H:%M:%S %Y"
        datetime_obj = datetime.strptime(time_str, time_format)
        return datetime_obj
    except ValueError as e:
        print(f"Error converting time string: {e}")
        return None

# 定义时间格式解析函数
def parse_time(time_str):
    try:
        if ':' in time_str:
            return datetime.strptime(time_str, "%H:%M:%S")
        else:
            return datetime.strptime(time_str, "%Y-%m-%d")
    except ValueError:
        return None

# 保存cookies到文件
async def save_cookies_to_file(page):
    cookies = await page.context.cookies()
    with open(COOKIES_FILE_PATH, 'w') as f:
        json.dump(cookies, f)

# 从文件加载cookies
async def load_cookies_from_file(page):
    try:
        with open(COOKIES_FILE_PATH, 'r') as f:
            cookies = json.load(f)
            await page.context.add_cookies(cookies)
    except FileNotFoundError:
        print("没有找到cookies文件, 将要重新登录")

# 处理登录问题
async def handle_auth(context):
    page = context.page
    await load_cookies_from_file(page)
    await page.goto(context.request.url)

    # 如果需要重新登录
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
        await page.goto(context.request.url)

async def add_posts(context:PlaywrightCrawlingContext):
    # 获取当前时间
    current_time = datetime.now()
    overpage = False

    posts = await context.page.evaluate('''() => {
        return Array.from(document.querySelectorAll('tr')).map(row => {
            const replyTimeText = row.querySelector('td.title_10 a[title="跳转至最后回复"]')?.textContent.trim();
            const url = row.querySelector('td.title_9 a[href^="/article/IWhisper/"]')?.getAttribute('href');
            return { replyTimeText, url };
        });
    }''')

    # 输出获取到的帖子信息
    for post in posts:
        if post['replyTimeText'] and post['url']:
            post_time = parse_time(post['replyTimeText'])
            if post_time:
                if '-' in post['replyTimeText']:
                    continue
                # 对于只有时间信息的情况，假设是当天的时间
                if ':' in post['replyTimeText']:
                    post_time = post_time.replace(year=current_time.year, month=current_time.month, day=current_time.day)
                
                time_difference = current_time - post_time
                print(f"回复时间: {post['replyTimeText']}, URL: {post['url']}, 时间差: {time_difference}")
                if time_difference <= timedelta(minutes=8):
                    print(f"最近60分钟的内容: 回复时间: {post['replyTimeText']}, URL: {post['url']}")
                    # 将帖子详情页面加入队列
                    await context.enqueue_links(
                        selector=f"a[href='{post['url']}']",
                        label='DETAIL',
                        strategy='all',
                    )
                else:
                    overpage = True
                    break
    return overpage

# 处理帖子列表页
async def get_detail(page):
    posts = []
    post_elements =await page.query_selector_all('div.b-content.corner div.a-wrap.corner table.article tbody')
    for wrap in post_elements:
        floor_element = await wrap.query_selector('tr.a-head td a.a-func-collect span.a-pos')
        if not floor_element:
            floor_element = await wrap.query_selector('tr.a-head td span.a-pos')
        floor = await floor_element.inner_text()

        wrap_element = await wrap.query_selector('tr.a-body td.a-content div.a-content-wrap')
        if not wrap_element:
            # 无头浏览器应该不会出现hide的状态, 不用处理
            pass
            # print('进入了隐藏状态')
            # # 太多人踩触发了隐藏按钮
            # await wrap.click('tr.a-body td.a-content2 div.a-background button.a-func-dispCai.button')
            # wrap_element = await wrap.query_selector('tr.a-body td.a-content div.a-content-wrap')
            # if not wrap_element:
            #     print('隐藏状态解除')
            # else:
            #     print('隐藏状态解除失败')
        wrap_element = await wrap_element.inner_html()
        author = re.search(r'发信人: (.+?) \(', wrap_element).group(1)
        section = re.search(r'信区: (\w+)', wrap_element).group(1)
        time_str = re.search(r'发信站: .*? \((.*?)\)', wrap_element).group(1)
        time = convert_to_datetime(time_str)
        
        content_element = re.search(r'<br><br>(.+?)<br>--', wrap_element)
        if content_element:
            content = content_element.group(1)
        else:
            # 有人发帖不发内容...
            content = ' '

        if floor == '楼主':
            likes_element = await wrap.query_selector('tr.a-bottom td ul.a-status li a.a-func-support')
            likes_element = await likes_element.inner_text()
            dislikes_element = await wrap.query_selector('tr.a-bottom td ul.a-status li a.a-func-oppose')
            dislikes_element = await dislikes_element.inner_text()
        else:
            likes_element = await wrap.query_selector('tr.a-bottom td ul.a-status li a.a-func-like')
            likes_element = await likes_element.inner_text()
            dislikes_element = await wrap.query_selector('tr.a-bottom td ul.a-status li a.a-func-cai')
            dislikes_element = await dislikes_element.inner_text()
        likes = re.search(r'\((?:\+)?(\d+)\)', likes_element)
        if likes:
            likes = likes.group(1)
        else:
            likes = 0
            print('like error')
        dislikes = re.search(r'\((?:\+)?(\d+)\)', dislikes_element)
        if dislikes:
            dislikes = dislikes.group(1)
        else:
            dislikes = 0
            print('dislike error')

        post_data = {
            '楼层': floor,
            '发信人': author,
            '信区': section,
            '内容': content,
            '赞': likes,
            '踩': dislikes,
            '时间': time,
        }
        posts.append(post_data)
    return posts
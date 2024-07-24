from crawler.utils import add_posts, get_detail, handle_auth
from crawlee.basic_crawler import Router
from crawlee.playwright_crawler import PlaywrightCrawlingContext
from typing import List, Dict
import re

router = Router[PlaywrightCrawlingContext]()

crawl_results: List[Dict] = []
# --------------------------------- DEFAULT ---------------------------------
@router.default_handler
async def default_handler(context: PlaywrightCrawlingContext) -> None:
    print(f'将页面加入队列: {context.request.url}');
    await handle_auth(context)
    overpage = await add_posts(context)
    
    # 增加下一页
    if not overpage:
        await context.enqueue_links(
            selector='li.page-normal a[title="下一页"]',
            label='DEFAULT',
        )

# --------------------------------- DETAIL ---------------------------------
@router.handler('DETAIL')
async def detail_handler(context: PlaywrightCrawlingContext) -> None:
    print(f'正在处理详情页: {context.request.url}')
    await handle_auth(context)

    # 获取页面实例
    page = context.page
    post_datas = {}

    post_id = re.search(r'/article/IWhisper/(\d+)', context.request.url).group(1)
    post_page = re.search(r'/article/IWhisper/\d+\?p=(\d+)', context.request.url)
    post_page = post_page.group(1) if post_page else '1'
    post_topic_text = await (await page.query_selector('div.b-head.corner span.n-left')).inner_text()
    post_topic = re.search(r'文章主题: (.+)', post_topic_text).group(1)
    
    post_datas['byr_id'] = post_id
    post_datas['topic'] = post_topic
    post_datas['page'] = post_page

    # 提取内容信息
    posts = await get_detail(page)
    post_datas['author'] = post_page=='1' and posts[0]['author'] or 'unknow'
    post_datas['time'] = post_page=='1' and posts[0]['time'] or 'unknow'
    post_datas['comments'] = posts

    crawl_results.append(post_datas)

    await context.enqueue_links(
        selector='li.page-normal a[title="下一页"]',
        label='DETAIL',
    )
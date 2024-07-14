from crawler.utils import parse_time, handle_request
from datetime import datetime, timedelta
from crawlee.basic_crawler import Router
from crawlee.playwright_crawler import PlaywrightCrawlingContext


router = Router[PlaywrightCrawlingContext]()

@router.default_handler
async def default_handler(context: PlaywrightCrawlingContext) -> None:
    print(f'将页面加入队列: {context.request.url}');
    await handle_request(context)
    
    

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
                if time_difference <= timedelta(minutes=60):
                    print(f"最近60分钟的内容: 回复时间: {post['replyTimeText']}, URL: {post['url']}")
                    # 将帖子详情页面加入队列
                    # absolute_url = f"https://bbs.byr.cn{post['url']}"
                    await context.enqueue_links(
                        selector=f"a[href='{post['url']}']",
                        label='DETAIL',
                    )
                else:
                    overpage = True
                    break


    # await context.page.wait_for_selector('.collection-block-item')

    # await context.enqueue_links(
    #     selector='.collection-block-item',
    #     label='CATEGORY',
    # )




@router.handler('DETAIL')
async def detail_handler(context: PlaywrightCrawlingContext) -> None:
    # This replaces the context.request.label == DETAIL branch of the if clause.
    # context.log.info(f'detail_handler is processing {context.request.url}')
    print(f'正在处理详情页: {context.request.url}')

    await handle_request(context)

    

    # 爬取数据
    # 提取帖子信息
    page = context.page
    title = await page.locator('.a-content-wrap br').text_content() or ''
    title = title.split('题: ')[1] if '题: ' in title else title
    print(f'title: {title}')
    floor = await page.locator('.a-pos').text_content()
    author = await page.locator('.a-content-wrap').text_content()
    author = author.split('发信人: ')[1].split(' ')[0] if '发信人: ' in author else author
    section = await page.locator('.a-content-wrap').text_content()
    section = section.split('信区: ')[1].split('标')[0] if '信区: ' in section else section
    post_station = await page.locator('.a-content-wrap').text_content()
    post_station = post_station.split('发信站: ')[1].split(', 站内')[0] if '发信站: ' in post_station else post_station
    content_element = await page.locator('.a-content .a-content-wrap').inner_html() or ''
    content_parts = content_element.split('<br>')
    content = content_parts[-2] if len(content_parts) > 2 else ''
    likes = await page.locator('#list6653250').text_content() or '0'
    likes = int(likes.split('+')[1]) if '+' in likes else 0
    dislikes = await page.locator('#list_oppose6653250').text_content() or '0'
    dislikes = int(dislikes.split('+')[1]) if '+' in dislikes else 0
    url = page.url

    post_data = {
        '帖子': {
            '楼层': floor,
            '发信人': author,
            '信区': section,
            '标题': title,
            '发信站': post_station,
            '内容': content,
            '楼主好评': likes,
            '踩': dislikes,
            '地址': url,
        }
    }
    print(post_data)
    # data = await context.page.evaluate('''() => {
    #     const postData = {};

    #     // 获取帖子信息
    #     postData['帖子'] = {
    #         楼层: document.querySelector('.a-pos')?.textContent,
    #         发信人: document.querySelector('.a-content-wrap').textContent.match(/发信人: (.+) \(我爱北邮人\!\)/)[1],
    #         信区: document.querySelector('.a-content-wrap').textContent.match(/信区: (.+)标/)[1],
    #         标题: document.querySelector('.a-content-wrap br').nextSibling?.textContent.match(/题: (.+)/)[1],
    #         发信站: document.querySelector('.a-content-wrap').textContent.match(/发信站: (.+), 站内/)[1],
    #         内容: document.querySelector('.a-content .a-content-wrap').innerHTML.match(/<br>(.*?)<br>(.*?)<br>(.*?)<br>(.*?)--/)[4],
    #         楼主好评: parseInt(document.querySelector('#list6653250')?.textContent.match(/\\+(\\d+)/)[1] || '0'),
    #         踩: parseInt(document.querySelector('#list_oppose6653250')?.textContent.match(/\\+(\\d+)/)[1] || '0'),
    #         地址: window.location.href
    #     };

    #     // 获取回复信息
    #     const replies = [];
    #     document.querySelectorAll('.a-wrap').forEach((wrap, index) => {
    #         if (!postData['帖子']['标题'].includes("Re") && index === 0){
    #             return;
    #         } else if (index === 0) {
    #             postData['帖子']['标题'] = postData['帖子']['标题'].substring(4);
    #         }
    #         const replyData = {
    #             楼层: wrap.querySelector('.a-pos')?.textContent,
    #             发信人: wrap.querySelector('.a-u-name')?.innerText.trim(),
    #             信区: wrap.querySelector('.a-content-wrap').textContent.match(/信区: (.+)标/)[1],
    #             标题: wrap.querySelector('.a-content-wrap br').nextSibling?.textContent.match(/题: (.+)/)[1],
    #             发信站: wrap.querySelector('.a-content-wrap').textContent.match(/发信站: (.+), 站内/)[1],
    #             内容: wrap.querySelector('.a-content .a-content-wrap').innerHTML.match(/<br>(.*?)<br>(.*?)<br>(.*?)<br>(.*?)--/)[4],
    #             赞: parseInt(wrap.querySelector('.a-func-like')?.textContent.match(/赞\\((\\d+)\\)/)[1] || '0'),
    #             踩: parseInt(wrap.querySelector('.a-func-cai')?.textContent.match(/踩\\((\\d+)\\)/)[1] || '0')
    #         };
    #         replies.push(replyData);
    #     });

    #     postData['回复'] = replies;
    #     return postData;
    # }''')


    # title = await context.page.locator('.product-meta h1').text_content()

    # sku = await context.page.locator('span.product-meta__sku-number').text_content()

    # price_element = context.page.locator('span.price', has_text='$').first
    # current_price_string = await price_element.text_content() or ''
    # raw_price = current_price_string.split('$')[1]
    # price = float(raw_price.replace(',', ''))

    # in_stock_element = context.page.locator(
    #     selector='span.product-form__inventory',
    #     has_text='In stock',
    # ).first
    # in_stock = await in_stock_element.count() > 0

    # data = {
    #     'manufacturer': manufacturer,
    #     'title': title,
    #     'sku': sku,
    #     'price': price,
    #     'in_stock': in_stock,
    # }

    # await context.push_data(data)
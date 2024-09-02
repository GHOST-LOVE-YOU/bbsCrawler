import { autoAddComment } from "@/lib/comments/server-utils";
import { autoGetPost } from "@/lib/posts/server-utils";
import { Log, Session } from "crawlee";
import { Page } from "playwright";

const USERNAME = process.env.BBS_USERNAME || "";
const PASSWORD = process.env.BBS_PASSWORD || "";

export const handleAuth = async (page: Page, log: Log, session: Session) => {
  const isLoginPage = await page.$("#u_login_form").then(Boolean);
  if (isLoginPage) {
    await page.fill("#u_login_id", USERNAME);
    await page.fill("#u_login_passwd", PASSWORD);
    await page.click("#u_login_submit");

    await Promise.race([
      page.waitForSelector(".a-content-wrap"),
      page.waitForTimeout(10000),
    ]);

    // Save cookies to the session after successful login
    const cookies = await page.context().cookies();
    session.setCookies(cookies, page.url());
  }
};

export const addPostsToQueue = async (page: Page, enqueueLinks: any) => {
  const currentDateTime = new Date();
  const posts = await page.$$eval("tr", (rows) =>
    rows.map((row) => {
      const replyTimeText =
        row
          .querySelector('td.title_10 a[title="跳转至最后回复"]')
          ?.textContent?.trim() || "";
      const url =
        row
          .querySelector('td.title_9 a[href^="/article/IWhisper/"]')
          ?.getAttribute("href") || "";
      return { replyTimeText, url };
    })
  );

  let overpage = false;

  for (const post of posts) {
    if (post.url && post.replyTimeText) {
      const replyTime = new Date(
        `${currentDateTime.toDateString()} ${post.replyTimeText}`
      );
      const timeDifferenceMs = currentDateTime.getTime() - replyTime.getTime();
      const timeDifferenceMinutes = timeDifferenceMs / 60000;

      if (isNaN(timeDifferenceMinutes)) {
        continue;
      }

      if (timeDifferenceMinutes <= 8) {
        const absoluteUrl = new URL(post.url, "https://bbs.byr.cn").toString();
        await enqueueLinks({
          urls: [absoluteUrl],
          label: "DETAIL",
          transformRequestFunction: (request: {
            url: string;
            uniqueKey?: string;
          }) => {
            request.uniqueKey = `${request.url}#${Date.now()}`;
            return request;
          },
        });
      } else {
        overpage = true;
        break;
      }
    }
  }

  return overpage;
};

export const getPostDetails = async (page: Page) => {
  const postDatas: crawlPost = {
    byr_id: "",
    topic: "",
    author: "",
    time: "",
    page: "",
    comments: [],
  };

  const postId = page.url().match(/\/#!article\/IWhisper\/(\d+)/)?.[1] || "";

  const postTopicElement = await page.$("div.b-head.corner span.n-left");
  const postTopicText = (await postTopicElement?.innerText()) || "";
  const postTopic = postTopicText.replace(/^文章主题:\s*/, "").trim();

  const urlMatch = page.url().match(/\/article\/IWhisper\/\d+\?p=(\d+)/);
  const postPage = urlMatch ? urlMatch[1] : "1";

  postDatas.byr_id = postId;
  postDatas.topic = postTopic;
  postDatas.page = postPage;

  const comments = await getComments(page);
  postDatas.author = postPage === "1" ? comments[0]?.author : "unknown";
  postDatas.time = postPage === "1" ? comments[0]?.time : "unknown";
  postDatas.comments = comments;

  return postDatas;
};

export const getComments = async (page: Page) => {
  const comments: crawlComment[] = [];
  const commentElements = await page.$$(
    "div.b-content.corner div.a-wrap.corner table.article tbody"
  );

  for (const wrap of commentElements) {
    let floorElement = await wrap.$("tr.a-head td a.a-func-collect span.a-pos");
    if (!floorElement) {
      floorElement = await wrap.$("tr.a-head td span.a-pos");
    }
    const floor = (await floorElement?.innerText()) || "";

    let wrapElement = await wrap.$("tr.a-body td.a-content div.a-content-wrap");
    if (!wrapElement) {
      // 无头浏览器应该不会出现hide的状态, 不用处理
      continue;
    }
    const wrapHtml = await wrapElement.innerHTML();

    const author = wrapHtml.match(/发信人: (.+?) \(/)?.[1] || "";
    const section = wrapHtml.match(/信区: (\w+)/)?.[1] || "";
    const timeStr = wrapHtml.match(/发信站: .*? \((.*?)\)/)?.[1] || "";

    let content = wrapHtml.match(/<br><br>(.+?)<br>--/)?.[1] || " ";

    let likesElement, dislikesElement;
    if (floor === "楼主") {
      likesElement = await wrap.$(
        "tr.a-bottom td ul.a-status li a.a-func-support"
      );
      dislikesElement = await wrap.$(
        "tr.a-bottom td ul.a-status li a.a-func-oppose"
      );
    } else {
      likesElement = await wrap.$(
        "tr.a-bottom td ul.a-status li a.a-func-like"
      );
      dislikesElement = await wrap.$(
        "tr.a-bottom td ul.a-status li a.a-func-cai"
      );
    }

    const likesText = (await likesElement?.innerText()) || "";
    const dislikesText = (await dislikesElement?.innerText()) || "";

    const likes = parseInt(likesText.match(/\((?:\+)?(\d+)\)/)?.[1] || "0");
    const dislikes = parseInt(
      dislikesText.match(/\((?:\+)?(\d+)\)/)?.[1] || "0"
    );

    const commentData = {
      floor,
      author,
      section,
      content,
      like: likes,
      dislike: dislikes,
      time: timeStr,
    };
    comments.push(commentData);
  }
  return comments;
};

export const storePost = async (postDatas: crawlPost) => {
  const result = await autoGetPost({
    byr_id: postDatas.byr_id,
    topic: postDatas.topic,
    createdAt: postDatas.time,
    userName: postDatas.author,
  });

  const post = result.post;
  const comments = postDatas.comments;

  for (const comment of comments) {
    await autoAddComment(
      {
        userName: comment.author,
        content: comment.content,
        floor: comment.floor,
        like: comment.like,
        dislike: comment.dislike,
        time: comment.time,
      },
      post.id
    );
  }
};

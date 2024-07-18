"use client";

import Image from "next/image";

export default function ReplyList() {
  const reply =
    "刷到掉粉榜有个叫凉风的up一直在稳定掉，搜了一下发现粉丝还挺多。看评论区说是因为原来做动漫区的后面转型了，再加上“这里是b站，该走的是你们二次元吧”.jpg。。看到好多次这个说法了<br>有点难理解，我2013年有的账号，到现在也11年了，也当6级萌新好久了，当时除了入站的时候答题答了一些二次元相关的，还有刷到一些混剪以外，真正刷到的相关内容不多，当时多的好像都是各种游戏解说之类的还有鬼畜，元首啊梁非凡之类的。问了问舍友是15年注册的，据他说上来就是为了看恐怖游戏的，也对二次元不太关心，反倒是我高中那几年经常能刷到标题带文艺复兴的剪辑<br>总说b站变味了，有点好奇那是啥时候变味的？<br>";
  return (
    <div className="flex flex-col py-2 border-stone-800 border-b-2 shadow-md">
      <div className="flex flex-row">
        <div className="flex-none">
          <Image
            src="https://minio-img.nezuko.me/img/2024/04/14/661b58ab8fae1.png"
            alt="1"
            width={48}
            height={48}
            className="rounded-md"
          />
        </div>
        <div className="px-2 flex-1 text-zinc-300">
          <div className="flex flex-row">
            <div className="inline-flex">
              <div className="pt-0.5 font-mono text-xl font-semibold hover:text-zinc-50 cursor-pointer">
                IWhisper#380
              </div>
              <div className="ml-1 px-1 border-2 border-stone-500 rounded h-7 text-stone-500 text-sm flex items-center justify-center">
                楼主
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-zinc-400 text-sm">
            <p className="relative bottom-0.5">52s</p>
            <p className="relative bottom-0.5">ago</p>
          </div>
        </div>
        <div className="flex-none"># 1</div>
      </div>
      <div
        className="pt-5 text-neutral-400 leading-8 text-xl"
        dangerouslySetInnerHTML={{ __html: reply }}
      />
      <div className="flex flex-1 justify-end text-zinc-400">
        <div className="flex space-x-10">
          <div className="inline-flex">
            <span className="icon-[iconoir--thumbs-up] text-2xl mr-1" />
            赞(5)
          </div>
          <div className="inline-flex">
            <span className="icon-[iconoir--thumbs-down] text-2xl mr-1" />
            踩(0)
          </div>
          <div className="inline-flex">
            <span className="icon-[ph--star-bold] text-2xl mr-1" />
            {/* <span className="icon-[solar--star-bold] text-2xl mr-1" /> */}
            收藏(0)
          </div>
        </div>
      </div>
    </div>
  );
}

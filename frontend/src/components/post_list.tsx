"use client";

import Image from "next/image";

export default function PostList() {
  return (
    <div className="py-2 border-zinc-900 border-b-2">
      <li>
        <div className="flex flex-row">
          <div className="flex-none pt-1">
            <Image
              src="https://minio-img.nezuko.me/img/2024/04/14/661b58ab8fae1.png"
              alt="1"
              width={40}
              height={40}
              className="rounded-md"
            />
          </div>
          <div className="px-2 flex-1">
            <div className="flex flex-col">
              <p className="pt-0.5 font-mono text-lg font-semibold">
                健身一段时间了感觉自己越来越像mini版常熟阿诺了
              </p>
            </div>
            <div className="inline-flex font-sans text-slate-200 space-x-4">
              <div className="flex items-center space-x-1">
                <span className="icon-[ph--user]" />
                <p className="relative bottom-0.5">IWhisper#380</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="icon-[clarity--eye-show-line]" />
                <p className="relative bottom-0.5">000</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="icon-[tabler--message]" />
                <p className="relative bottom-0.5">000</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="icon-[carbon--user-activity]" />
                <p className="relative bottom-0.5">IWhisper#118</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="icon-[bx--time-five]" />
                <p className="relative bottom-0.5">52s</p>
                <p className="relative bottom-0.5">ago</p>
              </div>
            </div>
          </div>
        </div>
      </li>
    </div>
  );
}

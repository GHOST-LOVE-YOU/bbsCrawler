import Pagination from "@components/pagination";
import ReplyList from "@components/reply_list";
import SideBar from "@components/sidebar";

export default function Home() {
  return (
    <div className="grid-background pt-4">
      <div className="container mx-auto max-w-5xl bg-nodedark border-black border-2 rounded-xl shadow-2xl px-6 ">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <div className="flex flex-row">
              <div className="pb-2 text-zinc-300 text-2xl hover:text-zinc-50 cursor-pointer font-extrabold">
                疑惑，b站什么时候变味的？
              </div>
            </div>
            <ReplyList />
            <div className="flex justify-end">
              <Pagination maxPage={4} currentPage={1} />
            </div>
            <ReplyList />
            <ReplyList />
            <ReplyList />
            <div className="flex justify-end pt-2">
              <Pagination maxPage={4} currentPage={2} />
            </div>
          </div>
          <div className="flex-none w-60 hidden md:block">
            <SideBar />
          </div>
        </div>
      </div>
    </div>
  );
}

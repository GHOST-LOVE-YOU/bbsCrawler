import PostList from "@components/post_list";
import Pagination from "@components/pagination";
import Sortby from "@components/sortby";
import SideBar from "@components/sidebar";

export default function Home() {
  return (
    <div className="justify-between">
      <div className="container mx-auto max-w-5xl bg-nodedark border-black border-2 rounded-xl shadow-2xl my-4 px-6 ">
        <div className="flex flex-row py-4">
          <div className="flex-1">
            <ul>
              <li className="flex justify-between">
                <Sortby />
                <Pagination maxPage={100} currentPage={10} />
              </li>
              <PostList />
              <PostList />
              <PostList />
              <PostList />
            </ul>
            <div className="flex justify-end pt-2">
              <Pagination maxPage={100} currentPage={10} />
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

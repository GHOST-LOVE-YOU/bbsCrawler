export default function Footer() {
  return (
    <footer className="w-full pt-4 bg-nodedark justify-center fixed bottom-0">
      <div className="block justify-center mx-auto max-w-5xl">
        <div className="text-center border-b-2 border-black shadow-sm pb-2">
          UI完全
          <span className="line-through text-gray-600"> 参考 </span>
          抄袭{" "}
          <a href="https://www.nodeseek.com/" className="text-green-400">
            nodeseek
          </a>
          , 仅作学习用处
        </div>
        <div className="block justify-center mx-auto max-w-5xl">
          <div className="text-center text-gray-600 pt-0">
            Copyright © 2024 - 2024 All rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

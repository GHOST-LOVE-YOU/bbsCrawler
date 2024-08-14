export default function Footer() {
  return (
    <footer className="w-full pt-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          UI完全
          <span className="line-through text-gray-600 dark:text-gray-400">
            {" "}
            参考{" "}
          </span>
          抄袭{" "}
          <a
            href="https://www.nodeseek.com/"
            className="text-green-400 dark:text-green-500 hover:underline"
          >
            nodeseek
          </a>
          , 仅作学习用处
        </div>
        <div className="text-center text-gray-600 dark:text-gray-400 pt-2">
          Copyright © 2024 - 2024 All rights Reserved
        </div>
      </div>
    </footer>
  );
}

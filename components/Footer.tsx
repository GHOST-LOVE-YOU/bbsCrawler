export default function Footer() {
    return (
      <footer className="w-full mt-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
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
  
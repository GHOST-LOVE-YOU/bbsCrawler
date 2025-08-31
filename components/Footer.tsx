export default function Footer() {
  return (
    <footer
      className={`
        mt-4 w-full border-t border-slate-200 bg-slate-50
        dark:border-slate-700 dark:bg-slate-900
      `}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          UI完全
          <span
            className={`
              text-gray-600 line-through
              dark:text-gray-400
            `}
          >
            {" "}
            参考{" "}
          </span>
          抄袭{" "}
          <a
            href="https://www.nodeseek.com/"
            className={`
              text-green-400
              hover:underline
              dark:text-green-500
            `}
          >
            nodeseek
          </a>
          , 仅作学习用处
        </div>
        <div
          className={`
            pt-2 text-center text-gray-600
            dark:text-gray-400
          `}
        >
          Copyright © 2024 - 2024 All rights Reserved
        </div>
      </div>
    </footer>
  );
}

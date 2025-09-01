export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="text-text-secondary">
            <p className="text-sm">
              UI设计灵感来源于{" "}
              <a
                href="https://www.nodeseek.com/"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline underline-offset-4 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                nodeseek
              </a>
              {" "}，仅作学习用途
            </p>
          </div>
          <div className="text-text-tertiary text-xs">
            Copyright © 2024 - {new Date().getFullYear()} All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

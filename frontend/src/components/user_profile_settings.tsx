"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/settings/introduction", label: "个人信息" },
  { href: "/settings/notification-rule", label: "通知规则" },
  { href: "/settings/notification-overview", label: "通知预览" },
  { href: "/settings/block", label: "屏蔽用户[x]" },
  { href: "/settings/preferences", label: "常用偏好[x]" },
  { href: "/settings/home", label: "首页版块[x]" },
  { href: "/settings/extensions", label: "论坛扩展[x]" },
];

const UserProfileSettings = () => {
  const [selectedLink, setSelectedLink] = useState("");
  const router = useRouter();

  useEffect(() => {
    setSelectedLink(window.location.pathname);
  }, []);

  const handleLinkClick = (href: string) => {
    setSelectedLink(href);
    router.push(href);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark p-2 rounded-lg">
      <nav>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <div
                onClick={() => handleLinkClick(link.href)}
                className={`block p-2 cursor-pointer ${
                  selectedLink === link.href ? "text-green-500" : ""
                }`}
              >
                {link.label}
              </div>
              {selectedLink === link.href && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 top-0 h-full w-1 bg-green-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserProfileSettings;
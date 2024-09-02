"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/settings/introduction", label: "个人信息" },
  { href: "/settings/notification-rule", label: "通知规则" },
  { href: "/settings/notification-overview", label: "通知预览" },
  { href: "#1", label: "屏蔽用户[x]" },
  { href: "#2", label: "常用偏好[x]" },
  { href: "#3", label: "首页版块[x]" },
  { href: "#4", label: "论坛扩展[x]" },
];

const SettingsNav = () => {
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
    <div className=" p-2 rounded-lg">
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

export default SettingsNav;

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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

const UserProfileSettings = ({ children }: { children: React.ReactNode }) => {
  const [selectedLink, setSelectedLink] = useState("");

  useEffect(() => {
    setSelectedLink(window.location.pathname);
  }, []);

  const handleLinkClick = (href: string) => {
    setSelectedLink(href);
  };

  return (
    <div className="bg-gray-800 text-gray-200 p-2 rounded-lg max-w-4xl mx-auto">
      <div className="flex mb-0">
        <div className="w-1/6 relative">
          <nav>
            <ul className="space-y-2 mb-6">
              {navLinks.map((link) => (
                <li key={link.href} className="relative">
                  <Link href={link.href}>
                    <div
                      onClick={() => handleLinkClick(link.href)}
                      className={`block p-2 cursor-pointer ${
                        selectedLink === link.href ? "text-green-500" : ""
                      }`}
                    >
                      {link.label}
                    </div>
                  </Link>
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
        <div className="w-5/6 space-y-6">
          <motion.div
            key={selectedLink}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;
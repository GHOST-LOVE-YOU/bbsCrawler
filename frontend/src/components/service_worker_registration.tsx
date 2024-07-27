'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service worker registration successful");
        })
        .catch((error) => {
          console.log("Service worker registration failed", error);
        });
    }
  }, []);

  return null;
}
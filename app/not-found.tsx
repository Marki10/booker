"use client";

import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      window.location.href = "/booker/";
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <p className="text-sm text-gray-500 mb-4">
          Redirecting to home page...
        </p>
        <a
          href="/booker/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

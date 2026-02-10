"use client";

import { Mail, Info } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Copyright */}
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            <p>
              © {currentYear} Booking App. All rights reserved.
            </p>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <a
              href="#contact"
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100/50 touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to contact section or show contact modal
                // For now, just prevent default
              }}
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Contact</span>
            </a>
            <a
              href="#about"
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100/50 touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to about section or show about modal
                // For now, just prevent default
              }}
            >
              <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>About</span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

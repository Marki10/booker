import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, CheckCircle, Smartphone, Zap, Shield, ArrowLeft, Mail, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "About - Booking App",
  description: "Learn more about the Booking App - A modern solution for managing appointments",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all">
                  Booking App
                </h1>
                <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                  Manage your appointments
                </p>
              </div>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-100/50 touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            About Booking App
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Your ultimate solution for seamless appointment management. Designed
            with efficiency and user-friendliness in mind, our app helps you
            organize your schedule effortlessly.
          </p>
        </div>

        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8 sm:mb-10">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Intuitive Calendar
              </h3>
              <p className="text-sm text-gray-600">
                Easily view and manage your bookings with a clear calendar interface.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Real-time Availability
              </h3>
              <p className="text-sm text-gray-600">
                Check and book available time slots instantly, avoiding conflicts.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Effortless Booking
              </h3>
              <p className="text-sm text-gray-600">
                Streamlined process for creating, editing, and deleting appointments.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <Smartphone className="w-8 h-8 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Mobile-Friendly
              </h3>
              <p className="text-sm text-gray-600">
                Access and manage your schedule on any device, anywhere.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Fast & Performant
              </h3>
              <p className="text-sm text-gray-600">
                Built with modern technologies for a snappy user experience.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <Shield className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-sm text-gray-600">
                Your data is handled with care, ensuring privacy and integrity.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8 sm:mb-10">
            Technology Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <span className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full shadow-md">
              React 19
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-full shadow-md">
              Next.js 15
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-full shadow-md">
              TypeScript
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-full shadow-md">
              Tailwind CSS 4
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-full shadow-md">
              Lucide React
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-full shadow-md">
              Local Storage
            </span>
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-base sm:text-lg touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span>Back to Home</span>
          </Link>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              <p>
                © {new Date().getFullYear()} Booking App. All rights reserved.
              </p>
            </div>

            <nav className="flex items-center gap-3 sm:gap-6">
              <a
                href="#contact"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100/50 touch-manipulation"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Contact</span>
              </a>
              <Link
                href="/about/"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100/50 touch-manipulation"
              >
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>About</span>
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

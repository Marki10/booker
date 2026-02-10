import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Mail, Phone, MapPin, Send, ArrowLeft, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - Booking App",
  description: "Get in touch with us - Contact information and support for Booking App",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help! Reach out to us
            through any of the following channels.
          </p>
        </div>

        {/* Contact Information Cards */}
        <section className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Email
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Send us an email anytime
              </p>
              <a
                href="mailto:support@bookingapp.com"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                support@bookingapp.com
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Phone
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Call us during business hours
              </p>
              <a
                href="tel:+1234567890"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                +1 (234) 567-890
              </a>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg md:col-span-2 lg:col-span-1">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Address
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Visit us at our office
              </p>
              <p className="text-green-600 font-medium text-sm">
                123 Booking Street
                <br />
                Suite 100
                <br />
                City, State 12345
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Send us a Message
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="What is this regarding?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-base sm:text-lg touch-manipulation"
                >
                  <Send className="w-5 h-5 flex-shrink-0" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Business Hours Section */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
              Business Hours
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="font-semibold text-gray-800 mb-1">Monday - Friday</p>
                <p className="text-gray-600">9:00 AM - 6:00 PM</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="font-semibold text-gray-800 mb-1">Saturday</p>
                <p className="text-gray-600">10:00 AM - 4:00 PM</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm sm:col-span-2">
                <p className="font-semibold text-gray-800 mb-1">Sunday</p>
                <p className="text-gray-600">Closed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action / Back to Home */}
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

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-lg mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Copyright */}
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              <p>
                © {new Date().getFullYear()} Booking App. All rights reserved.
              </p>
            </div>

            {/* Navigation Menu */}
            <nav className="flex items-center gap-3 sm:gap-6">
              <Link
                href="/contact/"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100/50 touch-manipulation"
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Contact</span>
              </Link>
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

"use client";

import { useState } from "react";
import type { Booking } from "../../types/interfaces";
import type { BookingCalendarProps } from "../../types/interfaces";
import { formatDate, getTodayDate } from "../../utils/dateUtils";
import { monthNames, dayNames } from "../../data/calendarData";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BookingCalendar = ({
  bookings,
  selectedDate,
  onDateSelect,
}: BookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = getTodayDate();
  const selected = selectedDate || today;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const getBookingsForDate = (date: string): Booking[] => {
    return bookings.filter((booking) => booking.date === date);
  };

  const formatDateString = (day: number): string => {
    const date = new Date(year, month, day);
    return date.toISOString().split("T")[0];
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const dateString = formatDateString(day);
    if (onDateSelect) {
      onDateSelect(dateString);
    }
  };

  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div
      className="bg-white/90 backdrop-blur-sm border-2 border-gray-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl"
      data-testid="booking-calendar"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
        <button
          onClick={goToPreviousMonth}
          className="p-2.5 sm:p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center px-2">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2.5 sm:p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-3">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-bold text-gray-500 py-2 sm:py-3 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateString = formatDateString(day);
          const dayBookings = getBookingsForDate(dateString);
          const isSelected = dateString === selected;
          const isToday = dateString === today;
          const isPast = dateString < today;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isPast && !isToday}
              className={`aspect-square p-1 sm:p-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 relative group min-h-[44px] touch-manipulation ${
                isSelected
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-110 z-10"
                  : isToday
                    ? "bg-gradient-to-br from-blue-100 to-purple-100 text-blue-900 border-2 border-blue-300 shadow-md"
                    : isPast
                      ? "text-gray-300 cursor-not-allowed bg-gray-50"
                      : "text-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-105 border-2 border-transparent hover:border-blue-200 active:scale-95"
              }`}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={isSelected ? "text-white" : ""}>{day}</span>
                {dayBookings.length > 0 && (
                  <span
                    className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-bold px-1 sm:px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/30 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    }`}
                  >
                    {dayBookings.length}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Bookings for {formatDate(selected)}
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              {getBookingsForDate(selected).length}{" "}
              {getBookingsForDate(selected).length === 1
                ? "booking"
                : "bookings"}
            </span>
          </div>
          {getBookingsForDate(selected).length === 0 ? (
            <div className="text-center py-4 sm:py-6 text-gray-500">
              <p className="text-sm">No bookings for this date</p>
            </div>
          ) : (
            <div className="space-y-2">
              {getBookingsForDate(selected).map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900 block sm:inline">
                      {booking.name}
                    </span>
                    <span className="text-gray-600 mx-2 hidden sm:inline">
                      •
                    </span>
                    <span className="text-gray-600 text-sm sm:text-base">
                      {booking.time}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-white rounded-lg text-xs font-semibold text-gray-700 self-start sm:self-auto">
                    {booking.duration} min
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

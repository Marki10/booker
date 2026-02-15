"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { BookingFormData, BookingFormProps } from "../../types/interfaces";
import { bookingService } from "../../services/bookingService";
import { getTodayDate, isPastDateTime } from "../../utils/dateUtils";
import { validateBookingForm } from "../../utils/validation";
import { ERROR_MESSAGES } from "../../constants/validation";
import { timeSlots, durationOptions } from "../../data/bookingFormData";
import { Calendar, Clock, User, Mail, FileText } from "lucide-react";
import { FormField } from "./FormField";
import { TextInput } from "./TextInput";
import { SelectInput } from "./SelectInput";
import { TextareaInput } from "./TextareaInput";
import { FormButtons } from "./FormButtons";

export const BookingForm = ({
  onSubmit,
  onCancel,
  initialData,
  excludeBookingId,
}: BookingFormProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    date: initialData?.date || getTodayDate(),
    time: initialData?.time || "09:00",
    duration: initialData?.duration || 60,
    notes: initialData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateBookingForm(
      formData.name,
      formData.email,
      formData.date,
      formData.time,
      formData.duration,
    );

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message;
      });
      setErrors(errorMap);
      return;
    }

    const isAvailable = await bookingService.isTimeSlotAvailable(
      formData.date,
      formData.time,
      formData.duration,
      excludeBookingId,
    );

    if (!isAvailable) {
      setErrors({
        time: ERROR_MESSAGES.TIME_SLOT_BOOKED,
      });
      return;
    }

    if (isPastDateTime(formData.date, formData.time)) {
      setErrors({
        date: ERROR_MESSAGES.PAST_DATE_TIME,
      });
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (
    field: keyof BookingFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const timeSlotOptions = timeSlots.map((slot) => ({
    value: slot,
    label: slot,
  }));

  const durationSelectOptions = durationOptions.map((duration) => ({
    value: duration,
    label: `${duration} minutes`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
      <FormField
        id="name"
        label="Name"
        icon={<User className="w-4 h-4 text-blue-600" />}
        iconBgColor="bg-blue-100"
        error={errors.name}
        required
        testId="booking-form-name"
      >
        <TextInput
          id="name"
          value={formData.name}
          onChange={(value) => handleChange("name", value)}
          placeholder="Enter your full name"
          error={errors.name}
          required
          autoComplete="name"
          testId="booking-form-name"
        />
      </FormField>

      <FormField
        id="email"
        label="Email"
        icon={<Mail className="w-4 h-4 text-purple-600" />}
        iconBgColor="bg-purple-100"
        error={errors.email}
        required
        testId="booking-form-email"
      >
        <TextInput
          id="email"
          type="email"
          value={formData.email}
          onChange={(value) => handleChange("email", value)}
          placeholder="your.email@example.com"
          error={errors.email}
          required
          autoComplete="email"
          inputMode="email"
          testId="booking-form-email"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <FormField
          id="date"
          label="Date"
          icon={<Calendar className="w-4 h-4 text-green-600" />}
          iconBgColor="bg-green-100"
          error={errors.date}
          required
          testId="booking-form-date"
        >
          <TextInput
            id="date"
            type="date"
            value={formData.date}
            onChange={(value) => handleChange("date", value)}
            error={errors.date}
            required
            min={getTodayDate()}
            testId="booking-form-date"
          />
        </FormField>

        <FormField
          id="time"
          label="Time"
          icon={<Clock className="w-4 h-4 text-orange-600" />}
          iconBgColor="bg-orange-100"
          error={errors.time}
          required
          testId="booking-form-time"
        >
          <SelectInput
            id="time"
            value={formData.time}
            onChange={(value) => handleChange("time", value)}
            options={timeSlotOptions}
            error={errors.time}
            required
            testId="booking-form-time"
          />
        </FormField>
      </div>

      <FormField
        id="duration"
        label="Duration"
        icon={<Clock className="w-4 h-4 text-indigo-600" />}
        iconBgColor="bg-indigo-100"
        testId="booking-form-duration"
      >
        <SelectInput
          id="duration"
          value={formData.duration}
          onChange={(value) => handleChange("duration", value)}
          options={durationSelectOptions}
          testId="booking-form-duration"
        />
      </FormField>

      <FormField
        id="notes"
        label="Notes (optional)"
        icon={<FileText className="w-4 h-4 text-pink-600" />}
        iconBgColor="bg-pink-100"
        testId="booking-form-notes"
      >
        <TextareaInput
          id="notes"
          value={formData.notes || ""}
          onChange={(value) => handleChange("notes", value)}
          placeholder="Any additional notes or special requirements..."
          testId="booking-form-notes"
        />
      </FormField>

      <FormButtons
        submitLabel={initialData ? "Update Booking" : "Create Booking"}
        onCancel={onCancel}
      />
    </form>
  );
};

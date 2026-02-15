"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";
import {
  ContactFormField,
  ContactTextInput,
  ContactTextarea,
} from "../../src/components/ContactForm";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <ContactFormField
          id="name"
          label="Name"
          error={errors.name}
          required
          testId="contact-form-name"
        >
          <ContactTextInput
            id="name"
            value={formData.name}
            onChange={(value) => handleChange("name", value)}
            placeholder="Your name"
            error={errors.name}
            required
            autoComplete="name"
            testId="contact-form-name"
          />
        </ContactFormField>
        <ContactFormField
          id="email"
          label="Email"
          error={errors.email}
          required
          testId="contact-form-email"
        >
          <ContactTextInput
            id="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            placeholder="your.email@example.com"
            error={errors.email}
            required
            autoComplete="email"
            testId="contact-form-email"
          />
        </ContactFormField>
      </div>
      <ContactFormField
        id="subject"
        label="Subject"
        error={errors.subject}
        required
        testId="contact-form-subject"
      >
        <ContactTextInput
          id="subject"
          value={formData.subject}
          onChange={(value) => handleChange("subject", value)}
          placeholder="What is this regarding?"
          error={errors.subject}
          required
          testId="contact-form-subject"
        />
      </ContactFormField>
      <ContactFormField
        id="message"
        label="Message"
        error={errors.message}
        required
        testId="contact-form-message"
      >
        <ContactTextarea
          id="message"
          value={formData.message}
          onChange={(value) => handleChange("message", value)}
          placeholder="Tell us how we can help..."
          rows={6}
          error={errors.message}
          required
          testId="contact-form-message"
        />
      </ContactFormField>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-base sm:text-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Send className="w-5 h-5 flex-shrink-0" />
          <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
        </button>
      </div>
    </form>
  );
};

"use client";

import { useState, FormEvent } from "react";
import LocsFaqChatWidget from "@/components/LocsFaqChatWidget";

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  isNewClient: boolean;
}

export default function Home() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: "",
    isNewClient: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    // Studio hours: Thu-Fri 5-10 PM, Sat-Sun 9 AM-9 PM
    // For simplicity, showing common slots - can be made dynamic
    const morningSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
    const afternoonSlots = ["12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];
    const eveningSlots = ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];
    
    return [...morningSlots, ...afternoonSlots, ...eveningSlots];
  };

  const timeSlots = generateTimeSlots();

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Client-side validation
    if (!formData.name || !formData.email || !formData.phone || !formData.service || !formData.date || !formData.time) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      // Success
      setSubmitStatus({
        type: "success",
        message: "Booking submitted successfully! Check your email for confirmation.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        notes: "",
        isNewClient: false,
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred. Please try again or call 310-892-4874.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B0F13] via-[#050609] to-[#0B0F13] text-[#F9FAFB]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] bg-clip-text text-transparent">
            Locs by Nya
          </h1>
          <p className="text-xl md:text-2xl text-[#9CA3AF] mb-8 font-sans">
            Professional loctician services in Los Angeles
          </p>
          <p className="text-lg text-[#9CA3AF] font-sans">
            Located at RVM Twists and Cuts • 5373 Wilshire Blvd, Los Angeles, CA
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="book" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0B0F13] rounded-3xl p-8 md:p-10 border border-[#8B5A3C]/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <h2 className="text-3xl font-serif font-bold mb-2 text-[#F9FAFB]">Book Your Appointment</h2>
            <p className="text-[#9CA3AF] mb-8 font-sans">
              A $25 security deposit is required to secure your appointment and goes toward your total.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#F9FAFB] mb-2 font-sans">
                  Full Name <span className="text-[#14B8A6]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/60 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F9FAFB] mb-2 font-sans">
                  Email <span className="text-[#14B8A6]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/60 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#F9FAFB] mb-2 font-sans">
                  Phone Number <span className="text-[#14B8A6]">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/60 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all"
                  placeholder="(310) 555-1234"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-[#F9FAFB] mb-2 font-sans">
                  Service <span className="text-[#14B8A6]">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all"
                >
                  <option value="">Select a service</option>
                  <option value="Starter locs">Starter locs</option>
                  <option value="Retwist / Maintenance">Retwist / Maintenance</option>
                  <option value="Loc repair / re-attachment">Loc repair / re-attachment</option>
                  <option value="Other service">Other service</option>
                </select>
              </div>

              {/* Date Picker */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-[#F9FAFB] mb-2 font-sans">
                  Appointment Date <span className="text-[#14B8A6]">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all"
                />
              </div>

              {/* Time Picker */}
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-[#F9FAFB] mb-2 font-sans">
                  Appointment Time <span className="text-[#14B8A6]">*</span>
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* New Client Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNewClient"
                  name="isNewClient"
                  checked={formData.isNewClient}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-[#8B5A3C]/30 bg-[#050609] text-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/40"
                />
                <label htmlFor="isNewClient" className="ml-2 text-sm text-[#F9FAFB] font-sans">
                  I am a new client (please upload photos/video of your hair when possible)
                </label>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-[#F9FAFB] mb-2 font-sans">
                  Special Requests or Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/60 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all resize-none"
                  placeholder="Any special requests, hair length/density info, or questions..."
                />
              </div>

              {/* Status Message */}
              {submitStatus.type && (
                <div
                  className={`p-4 rounded-2xl ${
                    submitStatus.type === "success"
                      ? "bg-[#14B8A6]/20 border border-[#14B8A6]/40 text-[#14B8A6]"
                      : "bg-red-500/20 border border-red-500/40 text-red-400"
                  }`}
                >
                  <p className="text-sm font-sans">{submitStatus.message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-br from-[#14B8A6] to-[#0FA1B2] text-white rounded-2xl px-6 py-4 font-medium font-sans hover:from-[#11BFD0] hover:to-[#14B8A6] transition-all duration-300 shadow-lg hover:shadow-[0_8px_24px_rgba(20,184,166,0.4)] hover:scale-[1.02] border border-[#14B8A6]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Submitting..." : "Book Appointment"}
              </button>

              <p className="text-xs text-[#9CA3AF] text-center font-sans">
                By submitting, you agree to the cancellation policy (24-hour notice required).
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold mb-4 text-[#F9FAFB]">Questions?</h2>
          <p className="text-lg text-[#9CA3AF] mb-4 font-sans">
            Call or text Nya at{" "}
            <a href="tel:3108924874" className="text-[#14B8A6] hover:text-[#0FA1B2] transition-colors">
              310-892-4874
            </a>
          </p>
          <p className="text-sm text-[#9CA3AF] font-sans">
            Studio hours: Thursday–Friday 5:00–10:00 PM, Saturday–Sunday 9:00 AM–9:00 PM
          </p>
        </div>
      </section>

      {/* FAQ Chat Widget */}
      <LocsFaqChatWidget />
    </main>
  );
}

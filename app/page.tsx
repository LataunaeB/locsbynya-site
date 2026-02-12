"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import Image from "next/image";
import LocsFaqChatWidget from "@/components/LocsFaqChatWidget";

// TODO: Replace with actual Stripe payment link when received
// IMPORTANT: Configure Stripe payment link to redirect to: https://www.locsbynya.com?payment=success
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/placeholder-link";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clientType: "",
    service: "",
    preferredTimes: "",
    hairNotes: "",
    depositAgreed: false,
  });

  const [animatedText, setAnimatedText] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const phrases = ["Strong Roots.", "Clean Parts.", "Healthy Locs."];
  
  // Refs for scroll animations
  const servicesRef = useRef<HTMLElement>(null);
  const bookingRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setAnimatedText((prev) => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 200); // Midpoint of transition for smooth crossfade
    }, 1200); // Change every 1.2 seconds

    return () => clearInterval(interval);
  }, [phrases.length]);

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, observerOptions);

    const sections = [servicesRef.current, bookingRef.current, faqRef.current].filter(Boolean);
    sections.forEach((section) => {
      if (section) {
        section.classList.add('fade-in');
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  // Check for Stripe payment success redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    
    if (paymentStatus === "success") {
      setDepositPaid(true);
      const savedFormData = localStorage.getItem("bookingFormData");
      if (savedFormData) {
        try {
          const parsed = JSON.parse(savedFormData);
          setFormData(parsed);
          localStorage.removeItem("bookingFormData");
        } catch (e) {
          console.error("Error restoring form data:", e);
        }
      }
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleDepositPayment = () => {
    localStorage.setItem("bookingFormData", JSON.stringify(formData));
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Check if deposit is paid
    if (!depositPaid) {
      setSubmitError("Please complete the $25 security deposit payment before submitting your booking.");
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.clientType || !formData.service || !formData.preferredTimes) {
      setSubmitError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Map old form fields to new API format
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        date: "", // Old form doesn't have date picker
        time: formData.preferredTimes,
        notes: formData.hairNotes + (formData.clientType ? `\nClient Type: ${formData.clientType}` : ""),
        isNewClient: formData.clientType === "new",
      };

      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit booking");
      }

      // Success
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        clientType: "",
        service: "",
        preferredTimes: "",
        hairNotes: "",
        depositAgreed: false,
      });
      setDepositPaid(false);
      localStorage.removeItem("bookingFormData");
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred. Please try again or call 310-892-4874.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <main 
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(135deg, #1a1816 0%, #2a2520 50%, #1a1816 100%)',
      }}
    >
      {/* Subtle texture overlay for dark background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.02) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }}
      />
      <div className="max-w-5xl mx-auto px-4 py-10 relative z-10">
        {/* HERO SECTION */}
        <section id="hero" className="mb-20 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-7">
              <p className="text-xs md:text-sm font-medium text-[#c0a996] uppercase tracking-[0.15em] letter-spacing-wider">
                Los Angeles | Loctician
              </p>
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight relative"
                style={{ 
                  fontFamily: "var(--font-playfair), serif",
                  color: '#f5f4f4',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  display: 'inline-block',
                }}
              >
                {/* Continuous sophisticated premium shimmer effect with caramel palette - Layer 1 */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(110deg, transparent 0%, transparent 10%, rgba(169, 133, 108, 0.5) 38%, rgba(192, 169, 150, 0.6) 42%, rgba(255, 255, 255, 0.55) 50%, rgba(192, 169, 150, 0.6) 58%, rgba(169, 133, 108, 0.5) 62%, rgba(131, 99, 80, 0.4) 70%, transparent 90%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 12s linear infinite',
                    mixBlendMode: 'screen',
                    zIndex: 1,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                {/* Layer 2 - Subtle depth with caramel tones */}
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(110deg, transparent 0%, transparent 12%, rgba(169, 133, 108, 0.35) 40%, rgba(245, 244, 244, 0.4) 50%, rgba(169, 133, 108, 0.35) 60%, transparent 88%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 12s linear infinite 0.5s',
                    mixBlendMode: 'soft-light',
                    zIndex: 2,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
                <span
                  key={animatedText}
                  className="relative inline-block z-10"
                  style={{ 
                    opacity: isVisible ? 1 : 0,
                    minWidth: 'max-content',
                    transition: 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {phrases[animatedText]}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#d4c4b0] leading-[1.7] font-normal">
                Book your next session with confidence.
              </p>
              <ul className="space-y-3.5 text-[#d4c4b0] text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#a9856c] mt-0.5 text-lg">✔</span>
                  <span className="leading-[1.6]">Private, one-on-one appointments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#a9856c] mt-0.5 text-lg">✔</span>
                  <span className="leading-[1.6]">Focus on scalp health and longevity</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#a9856c] mt-0.5 text-lg">✔</span>
                  <span className="leading-[1.6]">Simple booking with upfront pricing</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => scrollToSection("booking")}
                  className="bg-[#a9856c] hover:bg-[#836350] text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#a9856c]/30 hover:scale-[1.03] transform"
                >
                  Book Your Appointment
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-[#c0a996] hover:text-[#a9856c] font-medium px-8 py-4 rounded-lg transition-colors duration-200 underline decoration-2 underline-offset-4"
                >
                  View services & pricing
                </button>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative" style={{ perspective: '1000px' }}>
              <div 
                className="rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
                style={{
                  transform: 'perspective(1000px) rotateY(-2deg) rotateX(2deg)',
                  boxShadow: `
                    0 25px 50px -12px rgba(45, 39, 39, 0.25),
                    0 15px 30px -8px rgba(45, 39, 39, 0.15),
                    0 8px 16px -4px rgba(45, 39, 39, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  border: '1px solid transparent',
                  background: 'linear-gradient(135deg, rgba(169, 133, 108, 0.1), rgba(192, 169, 150, 0.05)) padding-box, linear-gradient(135deg, rgba(169, 133, 108, 0.3), rgba(192, 169, 150, 0.2)) border-box',
                }}
              >
                <div 
                  className="relative"
                  style={{
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <Image
                    src="/hero-image.png"
                    alt="Locs by Nya"
                    width={600}
                    height={450}
                    className="w-full h-auto object-cover relative z-10"
                    priority
                  />
                  {/* Subtle gradient overlay for depth */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      background: 'linear-gradient(135deg, rgba(169, 133, 108, 0.03) 0%, transparent 50%, rgba(45, 39, 39, 0.02) 100%)',
                    }}
                  />
                </div>
              </div>
              {/* Decorative glow behind */}
              <div 
                className="absolute -inset-4 rounded-3xl -z-10 blur-2xl opacity-30"
                style={{
                  background: 'radial-gradient(circle, rgba(169, 133, 108, 0.4) 0%, transparent 70%)',
                  transform: 'perspective(1000px) rotateY(-2deg) rotateX(2deg)',
                }}
              />
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="my-20 md:my-32">
          <div className="h-px bg-gradient-to-r from-transparent via-[#3d3630] to-transparent"></div>
        </div>

        {/* SERVICES SECTION */}
        <section id="services" ref={servicesRef} className="mb-20 md:mb-32">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f5f4f4] mb-5 leading-tight tracking-tight">
              Signature Loc Services
            </h2>
            <p className="text-lg text-[#d4c4b0] max-w-2xl mx-auto leading-[1.7]">
              Clear options, clear pricing. Choose what fits your loc journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Service Card 1 */}
            <div className="bg-[#2a2520] rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#a9856c]/20 hover:-translate-y-1 transition-all duration-300 p-8 border border-[#3d3630] hover:border-[#a9856c]/30 group">
              <div className="mb-5">
                <span className="inline-block bg-[#3d3630] text-[#c0a996] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
                  New clients welcome
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#f5f4f4] mb-4 leading-tight tracking-tight">
                Starter Locs
              </h3>
              <p className="text-[#d4c4b0] mb-5 leading-[1.7] text-base">
                Consultation-based install to match your hair, lifestyle, and goals.
              </p>
              <p className="text-lg font-semibold text-[#a9856c] tracking-wide">
                From $XXX
              </p>
            </div>

            {/* Service Card 2 */}
            <div className="bg-[#2a2520] rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#a9856c]/20 hover:-translate-y-1 transition-all duration-300 p-8 border border-[#3d3630] hover:border-[#a9856c]/30 group">
              <div className="mb-5">
                <span className="inline-block bg-[#3d3630] text-[#c0a996] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
                  Existing locs
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#f5f4f4] mb-4 leading-tight tracking-tight">
                Loc Retwist & Maintenance
              </h3>
              <p className="text-[#d4c4b0] mb-5 leading-[1.7] text-base">
                Clean parts, healthy tension, and scalp care for existing locs.
              </p>
              <p className="text-lg font-semibold text-[#a9856c] tracking-wide">
                From $XXX
              </p>
            </div>

            {/* Service Card 3 */}
            <div className="bg-[#2a2520] rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#a9856c]/20 hover:-translate-y-1 transition-all duration-300 p-8 border border-[#3d3630] hover:border-[#a9856c]/30 group">
              <div className="mb-5">
                <span className="inline-block bg-[#3d3630] text-[#c0a996] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
                  Repair & restoration
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#f5f4f4] mb-4 leading-tight tracking-tight">
                Loc Repair & Reconstruction
              </h3>
              <p className="text-[#d4c4b0] mb-5 leading-[1.7] text-base">
                Strengthening weak spots, repairing breakage, and restoring structure.
              </p>
              <p className="text-lg font-semibold text-[#a9856c] tracking-wide">
                From $XXX
              </p>
            </div>

            {/* Service Card 4 */}
            <div className="bg-[#2a2520] rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#a9856c]/20 hover:-translate-y-1 transition-all duration-300 p-8 border border-[#3d3630] hover:border-[#a9856c]/30 group">
              <div className="mb-5">
                <span className="inline-block bg-[#3d3630] text-[#c0a996] text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
                  Styling
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#f5f4f4] mb-4 leading-tight tracking-tight">
                Styles & Add-Ons
              </h3>
              <p className="text-[#d4c4b0] mb-5 leading-[1.7] text-base">
                Barrel twists, rope twists, updos, and finishing touches.
              </p>
              <p className="text-lg font-semibold text-[#a9856c] tracking-wide">
                From $XXX
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-[#c0a996] italic leading-relaxed">
            Full service descriptions will be confirmed during your consultation.
          </p>
        </section>

        {/* Section Divider */}
        <div className="my-20 md:my-32">
          <div className="h-px bg-gradient-to-r from-transparent via-[#3d3630] to-transparent"></div>
        </div>

        {/* TESTIMONIALS SECTION */}
        <section className="mb-20 md:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f5f4f4] mb-5 leading-tight tracking-tight">
              What Clients Say
            </h2>
            <p className="text-lg text-[#d4c4b0] max-w-2xl mx-auto leading-[1.7]">
              Real experiences from clients who trust Locs by Nya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-[#2a2520] rounded-xl shadow-lg p-6 border border-[#3d3630]">
              <div className="mb-4">
                <div className="flex text-[#a9856c] mb-2">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="text-[#d4c4b0] mb-4 leading-relaxed italic">
                "Nya's attention to detail is unmatched. My locs have never looked better, and the booking process was so simple."
              </p>
              <p className="text-sm text-[#c0a996] font-medium">— Sarah M.</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#2a2520] rounded-xl shadow-lg p-6 border border-[#3d3630]">
              <div className="mb-4">
                <div className="flex text-[#a9856c] mb-2">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="text-[#d4c4b0] mb-4 leading-relaxed italic">
                "Professional, clean, and my starter locs are exactly what I wanted. Highly recommend!"
              </p>
              <p className="text-sm text-[#c0a996] font-medium">— Jessica T.</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#2a2520] rounded-xl shadow-lg p-6 border border-[#3d3630]">
              <div className="mb-4">
                <div className="flex text-[#a9856c] mb-2">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <p className="text-[#d4c4b0] mb-4 leading-relaxed italic">
                "The retwist service is amazing. My locs feel healthy and look fresh every time."
              </p>
              <p className="text-sm text-[#c0a996] font-medium">— Maya K.</p>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="my-20 md:my-32">
          <div className="h-px bg-gradient-to-r from-transparent via-[#3d3630] to-transparent"></div>
        </div>

        {/* BOOKING SECTION */}
        <section id="booking" ref={bookingRef} className="mb-20 md:mb-32">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#f5f4f4] mb-5 leading-tight tracking-tight">
                Book Your Appointment
              </h2>
              <p className="text-lg text-[#d4c4b0] leading-[1.7] max-w-xl mx-auto">
                New clients start with a quick consult so I can see your hair and recommend the best service.
              </p>
            </div>

            <div className="bg-[#2a2520] rounded-xl shadow-lg p-8 md:p-10 border border-[#3d3630]">
              {/* Form Progress Indicator */}
              <div className="mb-8">
                {(() => {
                  const requiredFields = ['name', 'email', 'phone', 'clientType', 'service', 'preferredTimes'];
                  const completedFields = requiredFields.filter(field => {
                    return formData[field as keyof typeof formData] !== '';
                  }).length;
                  // Add deposit to completion if paid
                  const totalFields = requiredFields.length + 1;
                  const totalCompleted = completedFields + (depositPaid ? 1 : 0);
                  const completionPercentage = Math.round((totalCompleted / totalFields) * 100);
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#c0a996]">Form Progress</span>
                        <span className="text-xs text-[#c0a996]">{completionPercentage}% Complete</span>
                      </div>
                      <div className="w-full bg-[#1a1816] rounded-full h-2">
                        <div 
                          className="bg-[#a9856c] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {showSuccess ? (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-[#a9856c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#a9856c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#f5f4f4] mb-3">Request Received!</h3>
                    <p className="text-[#d4c4b0] leading-relaxed max-w-md mx-auto">
                      Thank you! Your request has been received. Nya will email or text you to confirm your time and send the deposit link.
                    </p>
                  </div>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition bg-[#1a1816] text-[#f5f4f4] text-base leading-relaxed"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition bg-[#1a1816] text-[#f5f4f4] text-base leading-relaxed"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition bg-[#1a1816] text-[#f5f4f4] text-base leading-relaxed"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Client Type */}
                <div>
                  <label htmlFor="clientType" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide">
                    Are you a new or existing client?
                  </label>
                  <select
                    id="clientType"
                    name="clientType"
                    required
                    value={formData.clientType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition bg-[#1a1816] text-[#f5f4f4] text-base leading-relaxed"
                  >
                    <option value="">Select one</option>
                    <option value="new">New client</option>
                    <option value="existing">Existing client</option>
                  </select>
                </div>

                {/* Desired Service */}
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide">
                    Desired service
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition bg-[#1a1816] text-[#f5f4f4] text-base leading-relaxed"
                  >
                    <option value="">Select a service</option>
                    <option value="starter-locs">Starter Locs</option>
                    <option value="retwist">Loc Retwist & Maintenance</option>
                    <option value="repair">Loc Repair & Reconstruction</option>
                    <option value="styles">Styles & Add-Ons</option>
                  </select>
                </div>

                {/* Preferred Days/Times */}
                <div>
                  <label htmlFor="preferredTimes" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide">
                    Preferred days/times
                  </label>
                  <textarea
                    id="preferredTimes"
                    name="preferredTimes"
                    rows={3}
                    required
                    value={formData.preferredTimes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition resize-none bg-[#1a1816] text-[#f5f4f4] text-base leading-relaxed"
                    placeholder="e.g., Weekday mornings, Saturday afternoons, etc."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label htmlFor="hairPhotos" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide leading-relaxed">
                    Upload 1–3 photos or a short video of your hair (optional but recommended)
                  </label>
                  <input
                    type="file"
                    id="hairPhotos"
                    name="hairPhotos"
                    accept="image/*,video/*"
                    multiple
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition bg-[#1a1816] text-[#f5f4f4] text-base file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#3d3630] file:text-[#c0a996] hover:file:bg-[#4a423a]"
                  />
                </div>

                {/* Hair Notes */}
                <div>
                  <label htmlFor="hairNotes" className="block text-sm font-medium text-[#f5f4f4] mb-2.5 tracking-wide">
                    Anything I should know about your hair or locs?
                  </label>
                  <textarea
                    id="hairNotes"
                    name="hairNotes"
                    rows={4}
                    value={formData.hairNotes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[#3d3630] rounded-lg focus:ring-2 focus:ring-[#a9856c] focus:border-[#a9856c] outline-none transition resize-none bg-[#1a1816] text-[#f5f4f4] text-base leading-relaxed"
                    placeholder="Share any relevant details about your hair type, current loc condition, or specific concerns..."
                  />
                </div>

                {/* Deposit Payment Section */}
                <div className="border-t border-[#3d3630] pt-6">
                  <div className="bg-[#1a1816] rounded-lg p-6 border border-[#3d3630]">
                    <h3 className="text-lg font-semibold text-[#f5f4f4] mb-2">
                      Security Deposit Required
                    </h3>
                    <p className="text-sm text-[#d4c4b0] mb-4 leading-[1.7]">
                      A $25 security deposit is required to secure your appointment. This deposit goes toward your total service cost.
                    </p>
                    
                    {depositPaid ? (
                      <div className="bg-[#a9856c]/20 border border-[#a9856c]/40 rounded-lg p-4 flex items-center gap-3">
                        <svg className="w-6 h-6 text-[#a9856c] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-[#a9856c] font-semibold">Payment Verified</p>
                          <p className="text-xs text-[#a9856c]/80">Your $25 deposit has been confirmed.</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDepositPayment}
                        className="w-full bg-[#a9856c] hover:bg-[#836350] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Pay $25 Security Deposit
                      </button>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 text-red-400 text-sm">
                    {submitError}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !depositPaid}
                  className="w-full bg-[#a9856c] hover:bg-[#836350] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? "Submitting..." : depositPaid ? "Request Booking" : "Complete Deposit to Book"}
                </button>
              </form>
              )}
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="my-20 md:my-32">
          <div className="h-px bg-gradient-to-r from-transparent via-[#3d3630] to-transparent"></div>
        </div>

        {/* FAQ / POLICIES SECTION */}
        <section id="faq" ref={faqRef} className="mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f5f4f4] mb-10 text-center leading-tight tracking-tight">
              Quick Policies & FAQs
            </h2>

            <div className="space-y-6 mb-10">
              {/* FAQ 1 */}
              <div className="bg-[#2a2520] rounded-xl shadow-lg p-6 border border-[#3d3630]">
                <h3 className="text-lg font-semibold text-[#f5f4f4] mb-3 leading-tight tracking-tight">
                  Do you require a deposit?
                </h3>
                <p className="text-[#d4c4b0] leading-[1.7] text-base">
                  Yes, a $25 security deposit is required for all bookings. The remaining balance is paid at your appointment.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-[#2a2520] rounded-xl shadow-lg p-6 border border-[#3d3630]">
                <h3 className="text-lg font-semibold text-[#f5f4f4] mb-3 leading-tight tracking-tight">
                  Where will my appointment be?
                </h3>
                <p className="text-[#d4c4b0] leading-[1.7] text-base">
                  Exact location and instructions are sent after your booking is confirmed.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-[#2a2520] rounded-xl shadow-lg p-6 border border-[#3d3630]">
                <h3 className="text-lg font-semibold text-[#f5f4f4] mb-3 leading-tight tracking-tight">
                  What if I need to cancel or reschedule?
                </h3>
                <p className="text-[#d4c4b0] leading-[1.7] text-base">
                  Please give at least 24–48 hours notice. Deposits are non-refundable but may be transferable depending on notice.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-[#2a2520] rounded-xl shadow-lg p-6 border border-[#3d3630]">
                <h3 className="text-lg font-semibold text-[#f5f4f4] mb-3 leading-tight tracking-tight">
                  New client consultation?
                </h3>
                <p className="text-[#d4c4b0] leading-[1.7] text-base">
                  New clients may be asked to hop on a 10-minute FaceTime or Zoom call so I can see your hair and recommend the right service.
                </p>
              </div>
            </div>

            {/* Promo Line */}
            <div className="bg-[#2a2520] rounded-xl p-6 text-center border border-[#3d3630] mb-10">
              <p className="text-[#d4c4b0] mb-2 leading-[1.7] text-base">
                Leave a review on Google or Yelp and receive $10 off a future service.
              </p>
              <p className="text-sm text-[#c0a996] leading-relaxed">
                Review links coming soon.
              </p>
            </div>

            {/* Footer */}
            <footer className="text-center pt-8 border-t border-[#3d3630]">
              <div className="mb-6">
                <p className="text-lg font-semibold text-[#f5f4f4] mb-2">Locs by Nya</p>
                <p className="text-sm text-[#c0a996] mb-4">Los Angeles, CA</p>
                <div className="flex justify-center gap-4 mb-6">
                  <a href="#" className="text-[#c0a996] hover:text-[#a9856c] transition-colors" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-[#c0a996] hover:text-[#a9856c] transition-colors" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <p className="text-sm text-[#c0a996] leading-relaxed">
                © {currentYear} Locs by Nya. All rights reserved.
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

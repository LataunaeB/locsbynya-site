"use client";

/**
 * DARK CINEMATIC LUXURY BOOKING SITE - Locs by Nya
 * 
 * Single-page, dark-themed booking experience inspired by Hairy demo
 * Sections: Hero, About, Services, Gallery, Booking, Policies, Contact, Footer
 * 
 * COLOR PALETTE:
 * - Backgrounds: #050609 (main), #0B0F13 (sections/cards)
 * - Text: #F9FAFB (primary), #9CA3AF (muted)
 * - Brown accents: #8B5A3C (primary), #4B2B1A (deeper)
 * - Teal accents: #14B8A6 (secondary highlights)
 */

import { FormEvent, useState, useEffect, useRef } from "react";
import Image from "next/image";
import LocsFaqChatWidget from "@/components/LocsFaqChatWidget";

const galleryImages = [
  { src: "/images/teen-locs.png", alt: "Teen locs by Nya", caption: "Teen locs" },
  { src: "/images/Kid locs.png", alt: "Kids locs by Nya", caption: "Kids locs" },
  { src: "/images/Barrell locs.PNG", alt: "Barrel locs style", caption: "Barrel locs" },
  { src: "/images/barrell locs2.png", alt: "Barrel locs close-up", caption: "Barrel locs" },
  { src: "/images/shoulder locs.png", alt: "Shoulder length locs", caption: "Shoulder length locs" },
  { src: "/images/Longest locs (no bg).PNG", alt: "Long mature locs", caption: "Long mature locs" },
];

export default function Home() {
  const [showPromoBar, setShowPromoBar] = useState(true);
  const [formData, setFormData] = useState({
    clientType: "",
    service: "",
    date: "",
    timeWindow: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [addOns, setAddOns] = useState<string[]>([]);
  const [depositAgreed, setDepositAgreed] = useState(false);
  const [hairFiles, setHairFiles] = useState<FileList | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setHairFiles(e.target.files);
    }
  };

  const handleAddOnChange = (addOnValue: string, checked: boolean) => {
    if (checked) {
      setAddOns([...addOns, addOnValue]);
    } else {
      setAddOns(addOns.filter((item) => item !== addOnValue));
    }
  };

  const isNewClient = formData.clientType === "new";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate new client requirements: must upload photos/videos
    if (isNewClient && !hairFiles) {
      alert('New clients must upload photos/video of their hair so Nya can see your hair texture and condition.');
      return;
    }

    try {
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('clientType', formData.clientType);
      formDataToSend.append('service', formData.service);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('timeWindow', formData.timeWindow);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('notes', formData.notes || '');
      formDataToSend.append('hasFiles', hairFiles && hairFiles.length > 0 ? 'true' : 'false');
      formDataToSend.append('addOns', JSON.stringify(addOns));

      // Append all files
      if (hairFiles) {
        for (let i = 0; i < hairFiles.length; i++) {
          formDataToSend.append('hairFiles', hairFiles[i]);
        }
      }

      const response = await fetch('/api/book', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Appointment confirmed! You will receive a confirmation email shortly.');
        // Reset form
      setFormData({
          clientType: "",
          service: "",
          date: "",
          timeWindow: "",
        name: "",
        email: "",
        phone: "",
          notes: "",
        });
        setAddOns([]);
        setDepositAgreed(false);
        setHairFiles(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to confirm appointment'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again or contact us directly.');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Scroll reveal hook
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    // Set current year in footer
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#050609] text-[#F9FAFB] relative">
      {/* Global Pattern Overlay - Subtle dark pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-[url('/images/locs-pattern-bw.png')] bg-[length:110px_110px] bg-center opacity-[0.03] mix-blend-overlay"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050609]/98 via-[#050609] to-[#0B0F13]/98"></div>
      </div>
      {/* PROMO ANNOUNCEMENT BAR */}
      {showPromoBar && (
        <div className="bg-[#4B2B1A] text-[#F9FAFB] py-2 px-4 relative z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-center text-sm text-center">
            <span>
              Promo: Get $10 off your next service when you leave a review on{" "}
              <a href="http://yelp.com/biz/locs-by-nya-los-angeles?hrid=YT2S-SVV5iLIyvKTvloiCg&utm_campaign=bizapp_ios_review_share_popup&utm_medium=copy_link&utm_source=(direct)" className="underline text-[#14B8A6] hover:text-[#14B8A6]/80 transition-colors">
                Yelp Reviews
              </a>
              {" "}after your appointment.
            </span>
            <button
              onClick={() => setShowPromoBar(false)}
              className="absolute right-4 text-[#F9FAFB] hover:text-[#9CA3AF] transition-colors text-xl leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-[#050609]/80 backdrop-blur-md border-b border-[#0B0F13] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Block */}
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <Image
                  src="/images/locs-logo.png"
                  alt="Locs by Nya Logo"
                  width={64}
                  height={64}
                  className="object-contain brightness-110"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[#F9FAFB] font-semibold text-lg leading-tight">
                  Locs by Nya
                </span>
                <span className="font-sans text-[#9CA3AF] text-xs leading-tight">
                  RVM Twists and Cuts
                </span>
              </div>
            </div>

            {/* Main Nav */}
            <nav className="hidden md:flex items-center gap-8">
                <button
                onClick={() => scrollToSection("home")}
                className="font-sans text-[#F9FAFB] text-sm font-medium hover:text-[#8B5A3C] transition-colors relative group"
                >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-full"></span>
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                className="font-sans text-[#F9FAFB] text-sm font-medium hover:text-[#8B5A3C] transition-colors relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("gallery")}
                className="font-sans text-[#F9FAFB] text-sm font-medium hover:text-[#8B5A3C] transition-colors relative group"
              >
                Gallery
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("book")}
                className="font-sans text-[#8B5A3C] text-sm font-semibold hover:text-[#8B5A3C]/80 transition-colors relative border-b-2 border-[#8B5A3C] pb-1"
              >
                Book
              </button>
              <button
                onClick={() => scrollToSection("policies")}
                className="font-sans text-[#F9FAFB] text-sm font-medium hover:text-[#8B5A3C] transition-colors relative group"
              >
                Policies
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="font-sans text-[#F9FAFB] text-sm font-medium hover:text-[#8B5A3C] transition-colors relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#14B8A6] transition-all group-hover:w-full"></span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-[#F9FAFB]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
                </button>
              </div>
            </div>
      </header>

      {/* HERO SECTION - Full Screen Banner */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
                  <Image
            src="/images/New Hero Image.jpg"
            alt="Luxury locs by Nya - precise parts and impeccable styling"
            fill
                    priority
            className="object-cover object-center"
            quality={90}
            sizes="100vw"
          />
        </div>
        
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050609]/85 via-[#050609]/70 to-[#050609]/90 z-10"></div>
        
        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 z-[11] opacity-[0.03] mix-blend-overlay"
                    style={{
            backgroundImage: "url('/images/locs-pattern-bw.png')",
            backgroundSize: '110px 110px',
            backgroundPosition: 'center',
          }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9CA3AF] font-sans font-medium opacity-0 animate-hero-fade-delay-1 mb-4">
              Los Angeles · RVM Twists and Cuts
            </p>
            
            {/* H1 */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-[#F9FAFB] leading-tight tracking-tight mb-6 opacity-0 animate-hero-fade-delay-2">
              Impeccable locs and precise parts at every visit.
            </h1>
            
            {/* Subtext paragraph */}
            <p className="font-sans text-base md:text-lg text-[#9CA3AF] leading-relaxed max-w-2xl mb-6 opacity-0 animate-hero-fade-delay-3">
              Starter locs, retwists, and long-term maintenance focused on clean parts, healthy tension, and a scalp that can breathe.
            </p>
            
            {/* Byline */}
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF] font-sans font-medium mb-4 opacity-0 animate-hero-fade-delay-4">
              By Nya · Loctician & Loc Care Specialist · By appointment only
            </p>
            
            {/* Promise Pills */}
            <div className="flex flex-wrap gap-2 mb-6 opacity-0 animate-hero-fade-delay-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#8B5A3C]/40 bg-[#0B0F13]/50 text-xs font-sans text-[#F9FAFB] tracking-wide">
                Healthy tension only
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#8B5A3C]/40 bg-[#0B0F13]/50 text-xs font-sans text-[#F9FAFB] tracking-wide">
                Clean, consistent parts
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#8B5A3C]/40 bg-[#0B0F13]/50 text-xs font-sans text-[#F9FAFB] tracking-wide">
                Respect for your time
              </span>
            </div>
            
            {/* Button + Microcopy */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 opacity-0 animate-hero-fade-delay-5">
              <button
                onClick={() => scrollToSection("book")}
                className="bg-gradient-to-r from-[#4B2B1A] to-[#8B5A3C] text-white rounded-full px-8 py-4 text-sm font-medium font-sans hover:shadow-lg hover:shadow-[#8B5A3C]/30 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Book Your Appointment
              </button>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#9CA3AF] font-sans">
                Limited availability · Early booking recommended
              </p>
            </div>
          </div>
        </div>

        {/* Micro Image Card - Overlay on Banner */}
        <div className="absolute bottom-10 right-8 z-20 hidden md:block opacity-0 animate-hero-fade-delay-5">
          <div className="relative w-56 aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-slate-700/60 shadow-xl shadow-black/40">
            <Image
              src="/images/New Hero Image.jpg"
              alt="Close-up of precise loc parts"
              fill
              className="object-cover object-top"
              quality={90}
              sizes="(max-width: 768px) 0vw, 224px"
            />
            {/* Teal accent line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14B8A6] to-transparent"></div>
            {/* Brown accent border effect */}
            <div className="absolute inset-0 border-2 border-[#8B5A3C]/30 pointer-events-none"></div>
                </div>
              </div>

        {/* Mobile: Micro Image Card - Below Text */}
        <div className="relative z-20 md:hidden mt-8 mx-auto opacity-0 animate-hero-fade-delay-5">
          <div className="relative w-40 aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-slate-700/60 shadow-xl shadow-black/40">
            <Image
              src="/images/New Hero Image.jpg"
              alt="Close-up of precise loc parts"
              fill
              className="object-cover object-top"
              quality={90}
              sizes="160px"
            />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14B8A6] to-transparent"></div>
            <div className="absolute inset-0 border-2 border-[#8B5A3C]/30 pointer-events-none"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="animate-bounce-slow">
          <button
            onClick={() => scrollToSection("services")}
            className="flex flex-col items-center gap-2 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors group"
            aria-label="Scroll down"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans">Scroll</span>
            <svg 
              className="w-5 h-5 group-hover:translate-y-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
            </div>
          </div>
        </section>

      {/* ABOUT / INTRO SECTION */}
      <section className="py-16 md:py-24 bg-[#0B0F13] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="font-sans text-lg md:text-xl text-[#9CA3AF] leading-relaxed max-w-3xl mx-auto reveal-on-scroll">
            Comprehensive loc care for every stage of your journey. Expert guidance and meticulous attention to detail ensure your locs thrive from day one through long-term maintenance.
          </p>
        </div>
      </section>

        {/* SERVICES SECTION */}
      <section id="services" className="py-20 md:py-32 bg-[#050609] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="text-center mb-16 reveal-on-scroll">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
              Services & Pricing
            </h2>
            <p className="font-sans text-lg text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed">
              My work is centered on scalp health, clean parting, and styles that mature beautifully over time. All services include a wash, blow dry, and style unless otherwise noted.
            </p>
          </header>

          {/* KIDS LOC SERVICES (AGES 2-12) */}
          <div className="mb-20 reveal-on-scroll">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-8 text-center md:text-left">
              Kids Loc Services <span className="text-[#14B8A6]">(Ages 2–12)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Starter Locs - Kids */}
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all group">
                <div className="h-1 w-16 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] mb-4"></div>
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-2xl font-bold text-[#0B0F13] mb-3">Starter Locs</h4>
                <p className="font-sans text-[#14B8A6] font-semibold mb-4">Starting at $165+</p>
                <p className="font-sans text-[#4B5563] leading-relaxed mb-4 text-sm">
                  This service establishes a strong and healthy loc foundation for your child. Pricing varies based on hair texture, density, length, desired loc size, and total loc count.
                </p>
                <div className="mt-4">
                  <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Pricing considerations:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Hair length and thickness</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Desired loc size (small, medium, or large)</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Total number of locs</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Full head versus half head installation</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Retwist + Style - Kids */}
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all group">
                <div className="h-1 w-16 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] mb-4"></div>
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-2xl font-bold text-[#0B0F13] mb-3">Retwist + Style</h4>
                <p className="font-sans text-[#14B8A6] font-semibold mb-4">Starting at $135+</p>
                <p className="font-sans text-[#4B5563] leading-relaxed mb-4 text-sm">
                  This service refreshes the roots and finishes with an age-appropriate, protective style. It is ideal for maintaining starter locs or mature locs on children.
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">What to know:</p>
                    <p className="font-sans text-xs text-[#4B5563] leading-relaxed">
                      I prefer that you arrive with a reference photo or clear idea of the style you are requesting so expectations and timing are aligned.
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Style options may include:</p>
                    <ul className="space-y-1.5">
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Two strand twist styles</span>
                      </li>
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Barrel twists</span>
                      </li>
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Simple updos or ponytail styles</span>
                      </li>
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Protective braided or twisted loc styles suitable for children</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Loc Take Down + Detangle - Kids */}
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all group">
                <div className="h-1 w-16 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] mb-4"></div>
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-2xl font-bold text-[#0B0F13] mb-3">Loc Take Down + Detangle</h4>
                <p className="font-sans text-[#14B8A6] font-semibold mb-4">Starting at $120+ for shoulder length</p>
                <p className="font-sans text-[#4B5563] leading-relaxed mb-4 text-sm">
                  This service involves carefully removing locs and detangling the hair using moisture and gentle techniques to preserve hair integrity. Final pricing depends on hair length, how long the locs have been installed, and the level of locking or matting present.
                </p>
                <div className="mt-4">
                  <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Best for:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Children restarting their loc journey</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Temporary loc installations</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Partially locked or early stage matting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Add-On Services for Kids */}
            <div className="mt-8">
              <p className="font-sans text-lg font-semibold text-[#F9FAFB] mb-6 text-center md:text-left">Add-On Services for Kids</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                  <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                  <h4 className="font-serif text-xl font-bold text-[#0B0F13] mb-3">Loc Detox</h4>
                  <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                    A loc detox is a deep cleansing treatment that removes product buildup, lint, sweat residue, and environmental debris trapped within the locs. I use a clarifying process that may include baking soda, followed by a moisturizing reset to maintain softness and scalp comfort.
                  </p>
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Recommended when:</p>
                    <ul className="space-y-1.5">
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Locs feel heavy or dull</span>
                      </li>
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Visible buildup is present</span>
                      </li>
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Your child swims frequently or uses multiple products</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                  <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                  <h4 className="font-serif text-xl font-bold text-[#0B0F13] mb-3">Scalp or Oil Treatment</h4>
                  <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                    This treatment targets dryness, itchiness, and scalp irritation. I apply a focused scalp routine followed by a light oil seal when appropriate to restore balance and comfort.
                  </p>
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Recommended when:</p>
                    <ul className="space-y-1.5">
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>The scalp appears dry or flaky</span>
                      </li>
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>There is itchiness or tightness</span>
                      </li>
                      <li className="font-sans text-xs text-[#4B5563] flex items-start">
                        <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                        <span>Additional moisture support is needed between visits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TEENS & ADULTS (AGES 13+) */}
          <div className="mb-20 reveal-on-scroll">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-8 text-center md:text-left">
              Teens & Adults <span className="text-[#14B8A6]">(Ages 13 and Older)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Starter Locs - Teens & Adults */}
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all group">
                <div className="h-1 w-16 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] mb-4"></div>
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-2xl font-bold text-[#0B0F13] mb-3">Starter Locs</h4>
                <div className="space-y-2 mb-4">
                  <p className="font-sans text-[#14B8A6] font-semibold">Short length starting at $165+</p>
                  <p className="font-sans text-xs text-[#4B5563]">For hair approximately 4 inches to ear length.</p>
                  <p className="font-sans text-[#14B8A6] font-semibold">Shoulder length starting at $185+</p>
                </div>
                <p className="font-sans text-[#4B5563] leading-relaxed mb-4 text-sm">
                  Pricing is influenced by hair density, length beyond shoulder, and loc size selection.
                </p>
                <div className="mt-4">
                  <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Important notes before your appointment:</p>
                  <p className="font-sans text-xs text-[#4B5563] leading-relaxed mb-3">
                    Please come with a preferred loc size reference, either photos or a clear description of the look you are aiming to achieve.
                  </p>
                  <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Factors that affect final pricing:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Loc width and size preference</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Parting style selection</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Full head or half head coverage</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Hairline and forehead preference</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Total loc count</span>
                    </li>
                  </ul>
                </div>
                <p className="font-sans text-xs text-[#4B5563] leading-relaxed mt-4 italic">
                  This ensures your install reflects your vision and sets your locs up to mature exactly how you want them to.
                </p>
              </div>

              {/* Retwist & Maintenance - Adults */}
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-1 w-16 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] mb-4"></div>
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-2xl font-bold text-[#0B0F13] mb-3">Retwist & Maintenance</h4>
                <p className="font-sans text-[#14B8A6] font-semibold mb-4">Starting at $135+</p>
                <p className="font-sans text-[#4B5563] leading-relaxed mb-4 text-sm">
                  Clean parts, healthy tension, and scalp care for existing locs. Regular maintenance to keep your locs thriving and looking their best.
                </p>
              </div>

              {/* Repair / Deep Care - Adults */}
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all md:col-span-2">
                <div className="h-1 w-16 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] mb-4"></div>
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-2xl font-bold text-[#0B0F13] mb-3">Repair / Deep Care</h4>
                <p className="font-sans text-[#14B8A6] font-semibold mb-4">Pricing varies</p>
                <p className="font-sans text-[#4B5563] leading-relaxed text-sm">
                  Strengthening weak spots, repairing breakage, and restoring structure. Specialized care when your locs need extra attention.
                </p>
              </div>
            </div>
          </div>

          {/* ADD-ON TREATMENTS & STYLE UPGRADES */}
          <div className="mb-20 reveal-on-scroll">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4 text-center md:text-left">
              Add-On Services
            </h3>
            <p className="font-sans text-lg text-[#9CA3AF] mb-8 max-w-3xl leading-relaxed">
              These services can be added to any appointment unless otherwise noted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-xl font-bold text-[#0B0F13]">Loc Detox</h4>
                  <span className="px-3 py-1 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] text-sm font-semibold font-sans">+ $30.00</span>
                </div>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                  A deep cleansing treatment that removes buildup, lint, sweat residue, and environmental debris trapped inside the locs. I typically use a clarifying method that may include baking soda, followed by a balancing rinse and moisture reset.
                </p>
                <div>
                  <p className="font-sans text-xs font-semibold text-[#0B0F13] mb-2">Recommended for:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Heavy product users</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Active lifestyles or swimmers</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Locs that appear dull or stiff</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-xl font-bold text-[#0B0F13]">Loc Oil Treatment</h4>
                  <span className="px-3 py-1 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] text-sm font-semibold font-sans">+ $25.00</span>
                </div>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                  This treatment focuses on restoring moisture and sealing hydration into the loc and scalp using lightweight oils appropriate for loc maintenance.
                </p>
                <div>
                  <p className="font-sans text-xs font-semibold text-[#0B0F13] mb-2">Helps with:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Dryness</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Dullness</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Scalp comfort between retwists</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-xl font-bold text-[#0B0F13]">Scalp Treatment</h4>
                  <span className="px-3 py-1 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] text-sm font-semibold font-sans">+ $30.00</span>
                </div>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed">
                  A targeted scalp service designed to address dryness, itchiness, tightness, and mild flaking. This service supports long term scalp health and comfort.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-xl font-bold text-[#0B0F13]">Loc Repair and Maintenance</h4>
                  <span className="px-3 py-1 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] text-sm font-semibold font-sans">+ $15.00 each reattachment</span>
                </div>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed">
                  This includes reinforcing weak locs, thinning areas, or early stage separation, as well as completely detached locs. I will tool the hair and repair or reattach the loc with durability.
                </p>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all md:col-span-2 lg:col-span-1">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-xl font-bold text-[#0B0F13] mb-3">Style Add Ons</h4>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                  I offer style flexibility depending on hair length, loc maturity, and desired outcome. Any style may be requested as long as it is appropriate for the hair's condition and stage.
                </p>
                <div>
                  <p className="font-sans text-xs font-semibold text-[#0B0F13] mb-2">Examples include:</p>
                  <ul className="space-y-1.5 mb-3">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Upstyles</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Barrel twists</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Two strand twists</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Special occasion styles</span>
                    </li>
                  </ul>
                  <p className="font-sans text-xs text-[#14B8A6] font-semibold">Pricing varies by complexity and time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* EXTENDED SERVICES & CONVENIENCE OPTIONS */}
          <div className="mb-20 reveal-on-scroll">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4 text-center md:text-left">
              Extended Services & Convenience Options
            </h3>
            <p className="font-sans text-lg text-[#9CA3AF] mb-8 max-w-3xl leading-relaxed">
              I understand that families, teens, and adults all have different schedules and needs. I offer flexible options designed to support consistency, comfort, and long term loc health.
            </p>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="font-serif text-2xl font-bold text-[#0B0F13]">Late Night / Early Morning Service Availability</h4>
                  <span className="px-3 py-1 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] text-xs font-semibold font-sans">By request only</span>
                </div>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                  I offer limited late night and early morning appointment availability for clients who work nontraditional hours or need flexibility. These appointments are scheduled in advance and are priced based on the service requested, time, and complexity of the style.
                </p>
                <div>
                  <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Please note:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Late night/early morning availability is not walk-in</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Confirmation is required prior to booking</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Pricing varies depending on service type and duration</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <h4 className="font-serif text-2xl font-bold text-[#0B0F13] mb-4">Free Tours and Consultations</h4>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                  I offer free tours and brief consultations for new clients who want to see the space, ask questions, or better understand the loc process before committing. This is especially helpful for parents starting children on their loc journey or for clients beginning their first install.
                </p>
                <div>
                  <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Tours are ideal for:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>First time loc clients</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Parents of younger children</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Clients transitioning from loose natural hair</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Clients planning a long term loc journey</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-6 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all">
                <div className="h-0.5 w-8 bg-[#14B8A6] mb-4"></div>
                <div className="flex items-center gap-3 mb-4">
                  <h4 className="font-serif text-2xl font-bold text-[#0B0F13]">House Calls</h4>
                  <span className="px-3 py-1 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] text-xs font-semibold font-sans">Additional $60+ depending on range and accessibility</span>
                </div>
                <p className="font-sans text-sm text-[#4B5563] leading-relaxed mb-4">
                  I offer house call appointments for clients who need in-home service. This fee is added on top of the selected service and covers travel, setup, and time.
                </p>
                <div>
                  <p className="font-sans text-sm font-semibold text-[#0B0F13] mb-2">Please note:</p>
                  <ul className="space-y-1.5">
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>House calls must be scheduled in advance</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>Location and parking availability may affect booking approval</span>
                    </li>
                    <li className="font-sans text-xs text-[#4B5563] flex items-start">
                      <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                      <span>All house calls require confirmation prior to the appointment date</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* LOC COLOR SERVICES */}
          <div className="mb-20 reveal-on-scroll">
            <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-8 text-center md:text-left">
              Loc Color Services
            </h3>
            <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 p-8 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/20 transition-all max-w-3xl">
              <div className="h-1 w-16 bg-gradient-to-r from-[#14B8A6] to-[#0FA1B2] mb-4"></div>
              <div className="h-0.5 w-8 bg-[#14B8A6] mb-6"></div>
              <h4 className="font-serif text-3xl font-bold text-[#0B0F13] mb-4">Color Enhancement for Locs</h4>
              <p className="font-sans text-[#14B8A6] font-semibold text-lg mb-4">Starting at $40+</p>
              <p className="font-sans text-[#4B5563] leading-relaxed mb-6">
                This service includes color enhancement or magnet-style color placement for locs. Pricing varies based on hair length, desired look, color placement, and number of locs being colored.
              </p>
              <div>
                <p className="font-sans text-base font-semibold text-[#0B0F13] mb-3">Important notes:</p>
                <ul className="space-y-2">
                  <li className="font-sans text-sm text-[#4B5563] flex items-start">
                    <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                    <span>Color services are add-ons and must be booked in advance</span>
                  </li>
                  <li className="font-sans text-sm text-[#4B5563] flex items-start">
                    <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                    <span>Final pricing is determined by length, density, and design choice</span>
                  </li>
                  <li className="font-sans text-sm text-[#4B5563] flex items-start">
                    <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                    <span>Photos or inspiration are strongly recommended to ensure accuracy</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FINAL NOTES */}
          <div className="reveal-on-scroll">
            <div className="bg-white rounded-xl border-2 border-[#14B8A6]/40 border-t-4 border-t-[#14B8A6] p-8 md:p-10">
              <p className="font-sans text-base md:text-lg text-[#4B5563] leading-relaxed max-w-4xl mx-auto text-center">
                I aim to provide a calm, professional, and supportive experience for every client. My goal is not just styling, but long term loc health, comfort, and confidence. If you are unsure which service to book, I recommend starting with a consultation or tour so we can align on expectations before your appointment.
              </p>
            </div>
          </div>
        </div>
        </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-20 md:py-32 bg-[#0B0F13] text-[#F9FAFB] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="text-center mb-16 reveal-on-scroll">
            <p className="text-xs uppercase tracking-wide text-[#14B8A6] font-sans font-semibold mb-2">
              WORK BY NYA
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
              Gallery
            </h2>
            <p className="font-sans text-lg text-[#9CA3AF] max-w-2xl mx-auto">
              Clean parts. Sharp lines. Healthy locs.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <figure
                key={image.src}
                className="group aspect-[4/5] rounded-xl overflow-hidden border-2 border-[#14B8A6]/40 bg-white relative hover:border-[#14B8A6] hover:scale-[1.02] transition-all duration-300 reveal-on-scroll"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050609]/80 to-transparent p-3">
                  <p className="text-[#14B8A6] font-sans text-[10px] font-semibold uppercase tracking-wide">
                    {image.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
              </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="book" className="py-20 md:py-32 bg-[#050609] relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-[#0B0F13] rounded-3xl border border-[#8B5A3C]/30 border-t-4 border-t-[#14B8A6] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] reveal-on-scroll">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wide text-[#14B8A6] font-sans font-semibold mb-2">
                BOOK AN APPOINTMENT
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-2">
                Tell Nya what you need
              </h2>
            </div>

            {/* Deposit Notice */}
            <div className="mb-6 p-4 rounded-xl bg-[#050609] border border-[#8B5A3C]/30 border-l-4 border-l-[#14B8A6]">
              <p className="font-sans text-sm text-[#F9FAFB] leading-relaxed">
                <strong className="text-[#8B5A3C]">$25 Security Deposit Required:</strong> A <span className="text-[#14B8A6] font-semibold">$25 security deposit</span> is required to hold your appointment. The deposit goes toward your total and is non-refundable for late cancellations or no-shows.
              </p>
            </div>

            {/* Appointment Expectations & Cancellation Policy */}
            <div className="mb-8 p-6 rounded-xl bg-[#050609] border border-[#8B5A3C]/20">
              <h3 className="font-serif text-2xl font-bold text-[#F9FAFB] mb-6">
                Appointment Expectations & Cancellation Policy
              </h3>
              
              {/* Appointment Expectations */}
              <div className="mb-6">
                <h4 className="font-sans text-base font-semibold text-[#F9FAFB] mb-3">
                  Appointment Expectations
                </h4>
                <p className="font-sans text-sm text-[#9CA3AF] leading-relaxed mb-3">
                  To keep everyone's time respected and your service running smoothly:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="font-sans text-sm text-[#9CA3AF] leading-relaxed flex items-start">
                    <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                    <span>Please arrive 15 minutes early</span>
                  </li>
                  <li className="font-sans text-sm text-[#9CA3AF] leading-relaxed flex items-start">
                    <span className="text-[#14B8A6] mr-2 mt-1.5">•</span>
                    <span>No extra guests or children unless they are receiving a service (we do accept walk-ins)</span>
                  </li>
                </ul>
            </div>

              {/* Cancellation Policy */}
                  <div className="mb-6">
                <h4 className="font-sans text-base font-semibold text-[#F9FAFB] mb-3">
                  Cancellation Policy
                </h4>
                <p className="font-sans text-sm text-[#9CA3AF] leading-relaxed">
                  You may cancel or reschedule up to 24 hours before your appointment. Any cancellation after that window, as well as no-shows, will require a 50% service fee before booking your next appointment. This ensures fairness to all clients and protects my time.
                </p>
                    </div>

              {/* Gratitude Message */}
              <p className="font-sans text-sm text-[#9CA3AF] leading-relaxed italic border-t border-[#8B5A3C]/20 pt-4">
                Thank you for choosing me to care for your locs. My goal is to make sure every client leaves confident, refreshed, and fully satisfied with their service.
                    </p>
                  </div>

              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Type */}
                <div>
                <label htmlFor="clientType" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                  Client Type
                  </label>
                <select
                  id="clientType"
                  name="clientType"
                    required
                  value={formData.clientType}
                    onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                >
                  <option value="">Select client type</option>
                  <option value="new">New client</option>
                  <option value="returning">Returning client</option>
                </select>
                {isNewClient && (
                  <p className="mt-2 text-sm text-[#9CA3AF] leading-relaxed">
                    New clients must upload photos/video of their hair so Nya can see your hair texture and condition.
                  </p>
                )}
                </div>

              {/* Primary Service */}
                <div>
                <label htmlFor="service" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                  Primary Service
                  </label>
                <select
                  id="service"
                  name="service"
                    required
                  value={formData.service}
                    onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                >
                  <option value="">Select a service</option>
                  {isNewClient && (
                    <option value="new-client-consultation">New Client Consultation</option>
                  )}
                  <option value="kids-starter-locs">Kids · Starter Locs (Ages 2–12)</option>
                  <option value="kids-retwist-style">Kids · Retwist + Style</option>
                  <option value="kids-takedown">Kids · Loc Take Down + Detangle</option>
                  <option value="teens-adults-starter-locs">Teens & Adults · Starter Locs (13+)</option>
                  <option value="teens-adults-retwist">Teens & Adults · Retwist & Maintenance</option>
                  <option value="teens-adults-repair">Teens & Adults · Repair / Deep Care</option>
                </select>
              </div>

              {/* New Client File Upload */}
              {isNewClient && (
                <div>
                  <label htmlFor="hairFiles" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                    Upload photos/videos <span className="text-xs font-normal normal-case text-[#9CA3AF]">(Multiple files allowed • Required for new clients)</span>
                  </label>
                  <input
                    type="file"
                    id="hairFiles"
                    name="hairFiles"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#8B5A3C] file:text-white hover:file:bg-[#8B5A3C]/80"
                  />
                  {hairFiles && hairFiles.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-[#050609] border border-[#8B5A3C]/30">
                      <p className="text-sm font-semibold text-[#F9FAFB] mb-2">
                        {hairFiles.length} file{hairFiles.length > 1 ? 's' : ''} selected:
                      </p>
                      <ul className="space-y-1">
                        {Array.from(hairFiles).map((file, index) => (
                          <li key={index} className="text-xs text-[#9CA3AF] flex items-center gap-2">
                            <span className="text-[#14B8A6]">•</span>
                            <span className="truncate">{file.name}</span>
                            <span className="text-[#9CA3AF]/60">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </li>
                        ))}
                      </ul>
                </div>
                  )}
                </div>
              )}

              {/* Add-ons & Extras */}
              <div>
                <label className="block text-sm font-semibold text-[#F9FAFB] mb-3 font-sans uppercase tracking-wide">
                  Add-ons & Extras <span className="text-xs font-normal normal-case text-[#9CA3AF]">(optional)</span>
                </label>
                <div className="space-y-3 p-4 rounded-lg bg-[#050609] border border-[#8B5A3C]/30">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('loc-detox')}
                      onChange={(e) => handleAddOnChange('loc-detox', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">Loc Detox</span>
                      <span className="font-sans text-sm text-[#14B8A6] ml-2">(+$30)</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('loc-oil-treatment')}
                      onChange={(e) => handleAddOnChange('loc-oil-treatment', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">Loc Oil Treatment</span>
                      <span className="font-sans text-sm text-[#14B8A6] ml-2">(+$25)</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('scalp-treatment')}
                      onChange={(e) => handleAddOnChange('scalp-treatment', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">Scalp Treatment</span>
                      <span className="font-sans text-sm text-[#14B8A6] ml-2">(+$30)</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('loc-repair')}
                      onChange={(e) => handleAddOnChange('loc-repair', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">Loc Repair / Re-attachment</span>
                      <span className="font-sans text-sm text-[#14B8A6] ml-2">(+$15 each)</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('style-add-ons')}
                      onChange={(e) => handleAddOnChange('style-add-ons', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">Style Add Ons</span>
                      <span className="font-sans text-xs text-[#9CA3AF] ml-2">(upstyles, barrel twists, two strand twists, special occasion styles)</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('loc-color')}
                      onChange={(e) => handleAddOnChange('loc-color', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">Loc Color Enhancement</span>
                      <span className="font-sans text-sm text-[#14B8A6] ml-2">(starting at $40+)</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('house-call')}
                      onChange={(e) => handleAddOnChange('house-call', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">House Call</span>
                      <span className="font-sans text-sm text-[#14B8A6] ml-2">(+$60+, depending on range and accessibility)</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={addOns.includes('late-night-early-morning')}
                      onChange={(e) => handleAddOnChange('late-night-early-morning', e.target.checked)}
                      className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                    />
                    <div className="flex-1">
                      <span className="font-sans text-sm text-[#F9FAFB]">Late Night / Early Morning Slot</span>
                      <span className="font-sans text-xs text-[#14B8A6] ml-2">(by request only)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Date and Time Window - Inline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                    Preferred date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="time-window" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                    Preferred day & time
                  </label>
                  <select
                    id="time-window"
                    name="timeWindow"
                    required
                    value={formData.timeWindow}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                  >
                    <option value="">Select a day & time</option>
                    <option value="thursday-5pm-10pm">Thursday (5pm-10pm)</option>
                    <option value="friday-5pm-10pm">Friday (5pm-10pm)</option>
                    <option value="saturday-9am-9pm">Saturday (9am-9pm)</option>
                    <option value="sunday-9am-9pm">Sunday (9am-9pm)</option>
                  </select>
                </div>
                </div>

              {/* Name and Email - Inline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="First & last name"
                    className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/50 font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/50 font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                  />
                </div>
                </div>

              {/* Phone */}
                <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                  Mobile number
                  </label>
                  <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(xxx) xxx-xxxx"
                  className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/50 font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
                  />
                </div>

              {/* Notes */}
                <div>
                <label htmlFor="notes" className="block text-sm font-semibold text-[#F9FAFB] mb-2 font-sans uppercase tracking-wide">
                  Notes
                  </label>
                  <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                    onChange={handleChange}
                  placeholder="Share any important details (age, hair length, loc condition, how many locs need repair, color ideas, etc.)."
                  className="w-full px-4 py-3 rounded-lg border border-[#8B5A3C]/30 bg-[#050609] text-[#F9FAFB] placeholder-[#9CA3AF]/50 font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors resize-none"
                  />
                </div>

              {/* Deposit Agreement Checkbox */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-[#050609] border border-[#8B5A3C]/30">
                  <input
                    type="checkbox"
                    id="depositAgreed"
                    name="depositAgreed"
                    required
                  checked={depositAgreed}
                  onChange={(e) => setDepositAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 border border-[#8B5A3C]/30 rounded focus:ring-2 focus:ring-[#14B8A6] text-[#8B5A3C] bg-[#0B0F13]"
                />
                <label htmlFor="depositAgreed" className="text-sm text-[#F9FAFB] leading-relaxed cursor-pointer">
                  I understand and agree to the <span className="text-[#14B8A6] font-semibold">$25 security deposit</span> and booking policy.
                  </label>
                </div>

              {/* Policy Acknowledgment */}
              <p className="text-xs text-center text-[#9CA3AF] font-sans leading-relaxed -mt-2">
                By booking, you acknowledge the appointment expectations and cancellation policy above.
              </p>

                {/* Submit Button */}
                <button
                  type="submit"
                disabled={!depositAgreed}
                className="w-full bg-gradient-to-r from-[#4B2B1A] to-[#8B5A3C] text-white rounded-2xl px-6 py-3 font-semibold font-sans hover:shadow-lg hover:shadow-[#8B5A3C]/30 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:ring-offset-2 focus:ring-offset-[#0B0F13] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                >
                Continue to Details
                </button>

              {/* Fine Print */}
              <p className="text-xs text-center text-[#9CA3AF] font-sans leading-relaxed">
                You'll receive a text or email once your appointment is confirmed.
                </p>
              </form>
            </div>
          </div>
        </section>

      {/* POLICIES SECTION */}
      <section id="policies" className="py-20 md:py-32 bg-[#050609] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="text-center mb-12 reveal-on-scroll">
            <p className="text-xs uppercase tracking-wide text-[#14B8A6] font-sans font-semibold mb-2">
              BEFORE YOU BOOK
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
              Policies & what to know
            </h2>
          </header>

          <div className="space-y-4">
            {/* Policy 1 - Deposit */}
            <details className="rounded-xl bg-[#0B0F13] border border-[#8B5A3C]/20 px-6 py-4 group hover:border-[#8B5A3C]/40 transition-colors reveal-on-scroll">
              <summary className="font-sans font-bold text-[#F9FAFB] cursor-pointer list-none">
                <span className="flex items-center justify-between">
                  <span>Is there a deposit to book?</span>
                  <span className="text-lg text-[#14B8A6] group-open:rotate-180 transition-transform">▼</span>
                </span>
              </summary>
              <p className="mt-4 font-sans text-[#9CA3AF] leading-relaxed">
                Yes, a $25 security deposit is required to hold your appointment. The deposit goes toward your total service cost. The deposit is non-refundable if you cancel or reschedule less than 24 hours before your appointment time.
              </p>
            </details>

            {/* Policy 2 - New Clients */}
            <details className="rounded-xl bg-[#0B0F13] border border-[#8B5A3C]/20 px-6 py-4 group hover:border-[#8B5A3C]/40 transition-colors reveal-on-scroll">
              <summary className="font-sans font-bold text-[#F9FAFB] cursor-pointer list-none">
                <span className="flex items-center justify-between">
                  <span>I'm a new client—how do I book?</span>
                  <span className="text-lg text-[#14B8A6] group-open:rotate-180 transition-transform">▼</span>
                </span>
              </summary>
              <p className="mt-4 font-sans text-[#9CA3AF] leading-relaxed">
                New clients should select "New Client Consultation" when booking. You'll be asked to upload photos or a short video of your hair so Nya can see your hair texture and condition. After reviewing your photos/video, Nya will recommend the best service for you.
              </p>
            </details>

            {/* Policy 3 */}
            <details className="rounded-xl bg-[#0B0F13] border border-[#8B5A3C]/20 px-6 py-4 group hover:border-[#8B5A3C]/40 transition-colors reveal-on-scroll">
              <summary className="font-sans font-bold text-[#F9FAFB] cursor-pointer list-none">
                <span className="flex items-center justify-between">
                  <span>Do you accept new clients?</span>
                  <span className="text-lg text-[#14B8A6] group-open:rotate-180 transition-transform">▼</span>
                </span>
              </summary>
              <p className="mt-4 font-sans text-[#9CA3AF] leading-relaxed">
                Yes – new clients are accepted based on availability. If no slots show for your preferred date, you can join the waitlist and you'll be contacted as openings come up.
              </p>
            </details>

            {/* Policy 4 */}
            <details className="rounded-xl bg-[#0B0F13] border border-[#8B5A3C]/20 px-6 py-4 group hover:border-[#8B5A3C]/40 transition-colors reveal-on-scroll">
              <summary className="font-sans font-bold text-[#F9FAFB] cursor-pointer list-none">
                <span className="flex items-center justify-between">
                  <span>What is your late / no-show policy?</span>
                  <span className="text-lg text-[#14B8A6] group-open:rotate-180 transition-transform">▼</span>
                </span>
              </summary>
              <p className="mt-4 font-sans text-[#9CA3AF] leading-relaxed">
                There is a 10-minute grace period. After that, your appointment may be shortened or canceled to respect the next guest's time. Deposits may be non-refundable for late arrivals or no-shows.
              </p>
            </details>

            {/* Policy 5 */}
            <details className="rounded-xl bg-[#0B0F13] border border-[#8B5A3C]/20 px-6 py-4 group hover:border-[#8B5A3C]/40 transition-colors reveal-on-scroll">
              <summary className="font-sans font-bold text-[#F9FAFB] cursor-pointer list-none">
                <span className="flex items-center justify-between">
                  <span>How do reschedules or cancellations work?</span>
                  <span className="text-lg text-[#14B8A6] group-open:rotate-180 transition-transform">▼</span>
                </span>
              </summary>
              <p className="mt-4 font-sans text-[#9CA3AF] leading-relaxed">
                You may reschedule or cancel up to 24 hours before your appointment. Inside that window, your deposit may be forfeited. Please reach out as soon as possible if something changes.
              </p>
            </details>
              </div>
        </div>
      </section>

      {/* CONTACT / HOURS SECTION */}
      <section id="contact" className="py-20 md:py-32 bg-[#0B0F13] text-[#F9FAFB] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <header className="text-center mb-12 reveal-on-scroll">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#F9FAFB] mb-4">
              Contact & Hours
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Hours */}
            <div className="bg-[#050609] rounded-xl border border-[#8B5A3C]/20 p-6 shadow-lg reveal-on-scroll">
              <div className="h-0.5 w-12 bg-[#14B8A6] mb-6"></div>
              <h3 className="font-serif text-2xl font-bold text-[#F9FAFB] mb-4">
                Hours
                </h3>
              <p className="font-sans text-[#9CA3AF] mb-2">
                <strong className="text-[#F9FAFB]">Thursday–Friday</strong>
              </p>
              <p className="font-sans text-[#9CA3AF] mb-4">
                5pm–10pm
              </p>
              <p className="font-sans text-[#9CA3AF] mb-2">
                <strong className="text-[#F9FAFB]">Saturday–Sunday</strong>
              </p>
              <p className="font-sans text-[#9CA3AF]">
                9am–9pm
              </p>
            </div>

            {/* Location */}
            <div className="bg-[#050609] rounded-xl border border-[#8B5A3C]/20 p-6 shadow-lg reveal-on-scroll">
              <div className="h-0.5 w-12 bg-[#14B8A6] mb-6"></div>
              <h3 className="font-serif text-2xl font-bold text-[#F9FAFB] mb-4">
                Location
              </h3>
              <p className="font-sans text-[#9CA3AF] mb-2">
                <strong className="text-[#F9FAFB]">RV Twists & Cuts</strong>
              </p>
              <p className="font-sans text-[#9CA3AF] mb-2">
                5373 Wilshire Blvd<br />
                Los Angeles, CA
              </p>
            </div>

            {/* Contact */}
            <div className="bg-[#050609] rounded-xl border border-[#8B5A3C]/20 p-6 shadow-lg reveal-on-scroll">
              <div className="h-0.5 w-12 bg-[#14B8A6] mb-6"></div>
              <h3 className="font-serif text-2xl font-bold text-[#F9FAFB] mb-4">
                Contact
              </h3>
              <p className="font-sans text-[#9CA3AF] mb-2">
                <strong className="text-[#F9FAFB]">Phone</strong>
              </p>
              <a 
                href="tel:310-892-4874" 
                className="font-sans text-[#14B8A6] hover:text-[#11BFD0] transition-colors text-lg"
              >
                310-892-4874
              </a>
              <p className="font-sans text-sm text-[#9CA3AF]/70 mt-4">
                Call or text for specific questions
              </p>
                </div>
              </div>

          <div className="mt-8 text-center">
            <p className="font-sans text-[#9CA3AF] mb-4">
              Street and/or lot parking available at RV Twists & Cuts (5373 Wilshire Blvd). Please arrive a few minutes early for check-in.
            </p>
            <button
              onClick={() => scrollToSection("book")}
              className="bg-gradient-to-r from-[#4B2B1A] to-[#8B5A3C] text-white rounded-full px-8 py-3 text-sm font-medium font-sans hover:shadow-lg hover:shadow-[#8B5A3C]/30 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#8B5A3C] focus:ring-offset-2 focus:ring-offset-[#0B0F13]"
            >
              Book Your Appointment
            </button>
          </div>
          </div>
        </section>

      {/* FOOTER */}
      <footer className="border-t border-[#0B0F13] bg-[#050609] py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-sans text-[#9CA3AF]">
            <span>© <span id="year"></span> Locs by Nya. All rights reserved.</span>
            <span className="text-[#9CA3AF]/60">Powered by Intelllx Booking</span>
      </div>
        </div>
      </footer>

      {/* FAQ Chat Widget */}
      <LocsFaqChatWidget />
    </main>
  );
}

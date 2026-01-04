"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  ctaType?: 'booking';
  ctaLabel?: string;
}

interface FAQ {
  id: string;
  label: string;
  keywords: string[];
  answer: string;
  ctaType?: 'booking';
  ctaLabel?: string;
}

const faqs: FAQ[] = [
  {
    id: "starter-locs",
    label: "Starter locs",
    keywords: ["starter locs", "start locs", "start my locs", "starting locs", "loc start", "loc journey", "do you do starter locs", "do you start locs"],
    answer: "Yes, I offer starter locs for new clients. During your first visit we'll look at your hair and talk about your goals so we can choose the best way to start your locs and set up a maintenance plan. You can view starter loc options and pricing on the booking page and reserve your spot with a $25 security deposit that goes toward your total. To get started, fill out the booking form on this page or call/text Nya at 310-892-4874 if you have questions before booking."
  },
  {
    id: "loc-repair",
    label: "Loc repair & re-attachment",
    keywords: [
      // Loc variations - fell out (including misspellings)
      "loc fell out", "loc feel out", "locs fell out", "locs feel out", "my loc fell out", "my loc feel out", "one of my locs fell out", "one of my locs feel out",
      // Loc variations - came out
      "loc came out", "locs came out", "my loc came out", "one of my locs came out",
      // Loc variations - pulled out
      "loc pulled out", "locs pulled out", "my loc pulled out",
      // Loc variations - yanked out
      "loc yanked out", "locs yanked out", "my loc yanked out", "loc got yanked out",
      // Loc variations - snatched out
      "loc snatched out", "locs snatched out", "my loc snatched out",
      // Loc variations - ripped out
      "loc ripped out", "locs ripped out", "my loc ripped out",
      // Loc variations - broke off
      "loc broke off", "locs broke off", "my loc broke off", "my loc got broke off",
      // Loc variations - popped off
      "loc popped off", "locs popped off", "my loc popped off", "a few of my locs popped off",
      // Dread variations - fell out (including misspellings)
      "dread fell out", "dread feel out", "dreads fell out", "dreads feel out", "dreds fell out", "dreds feel out", "my dread fell out", "my dread feel out", "my dred fell out", "my dred feel out", "one of my dreads fell out", "one of my dreads feel out", "one of my dreds fell out", "one of my dreds feel out",
      // Dread variations - came out
      "dread came out", "dreads came out", "my dread came out",
      // Dread variations - pulled out
      "dread pulled out", "dreads pulled out", "my dread pulled out",
      // Dread variations - yanked out
      "dread yanked out", "dreads yanked out", "my dread yanked out",
      // Dread variations - snatched out
      "dread snatched out", "dreads snatched out", "my dread snatched out",
      // Dread variations - ripped out
      "dread ripped out", "dreads ripped out", "my dread ripped out",
      // Dread variations - broke off
      "dread broke off", "dreads broke off", "my dread broke off", "my dread got broke off",
      // Dread variations - popped off
      "dread popped off", "dreads popped off", "my dread popped off",
      // Fix/repair variations - loc
      "fix my loc", "fix my locs", "can you fix my loc", "can you fix a loc", "repair my loc", "repair my locs", "can you repair my loc",
      // Fix/repair variations - dread
      "fix my dread", "fix my dreads", "can you fix my dread", "can you fix a dread", "repair my dread", "repair my dreads", "can you repair my dread",
      // Reattach variations - loc
      "reattach my loc", "reattach my locs", "re-attach my loc", "re-attach my locs", "can you reattach my loc", "can you reattach my locs",
      // Reattach variations - dread
      "reattach my dread", "reattach my dreads", "re-attach my dread", "re-attach my dreads", "can you reattach my dread", "can you reattach my dreads",
      // Replace variations
      "can you replace my loc", "can you replace my dread", "replace my loc", "replace my dread",
      // Reconstruction variations
      "loc reconstruction", "dread reconstruction", "reconstruction on one loc", "single loc repair", "one loc repair", "single dread repair", "one dread repair",
      // Generic repair terms
      "loc repair", "locs repair", "dread repair", "dreads repair", "broken loc", "broken dread", "damaged loc", "damaged dread",
      // Reattachment terms
      "loc reattachment", "dread reattachment", "reattach loc", "re-attach loc", "reattach dreads",
      // Can you fix it variations
      "can you fix it", "can you fix them"
    ],
    answer: "Yes, I can usually repair or re-attach a loc that has slipped or fallen out. Reattachment or re-strengthening is $15 per loc. Because every loc is different, it's best to send a clear photo so I can see what's going on.\n\nTo get started, choose a \"Loc repair / re-attachment\" option when you book, or call/text Nya at 310-892-4874 so we can talk through your situation and give you the best recommendation."
  },
  {
    id: "new-client",
    label: "New client policy",
    keywords: ["new client", "new clients", "new client policy", "new client procedure", "first time client", "first-time client", "first appointment", "first visit", "I'm new", "I am new", "new to you"],
    answer: "New clients are welcome. For your first visit, please book through the online form and upload clear photos or a short video of your hair so I can see your length, density, and current condition. That's usually all I need to recommend the right service.\n\nIf I need more detail after reviewing your photos or video, I may offer a quick FaceTime call.\n\nA $25 security deposit is required to secure your first appointment and goes toward your total. For any specific questions before booking, you can call or text Nya at 310-892-4874."
  },
  {
    id: "cancellation",
    label: "Reschedule / cancel",
    keywords: ["cancel", "cancellation", "cancellation policy", "reschedule", "rescheduling", "no show", "no-show", "late cancel", "cancellation fee", "rescheduling policy", "change appointment"],
    answer: "You may cancel or reschedule up to 24 hours before your appointment. Any cancellation after that window, as well as no-shows, will require a 50% service fee before booking your next appointment. This ensures fairness to all clients and protects my time.\n\nTo reschedule or change details, please contact Nya at 310-892-4874 or follow any instructions provided in your confirmation message."
  },
  {
    id: "deposit",
    label: "Deposit",
    keywords: ["deposit", "security deposit", "25 deposit", "twenty five deposit", "25 dollars", "pay deposit", "down payment", "hold my appointment", "hold my spot", "booking fee"],
    answer: "A $25 security deposit is required to hold your appointment. The deposit goes toward your total and is non-refundable for late cancellations or no-shows.\n\nTo secure your spot, it's best to complete the booking form on this page. For specific questions, please call or text Nya at 310-892-4874."
  },
  {
    id: "walk-ins",
    label: "Walk-ins",
    keywords: ["walk in", "walk-in", "walkins", "walk ins", "walk in appointments", "walk-in appointments", "do you accept walk-ins", "take walk-ins", "walk-in policy", "can I walk in", "just walk in"],
    answer: "Yes, I accept walk-ins during my studio hours: Thursday–Friday 5:00–10:00 PM and Saturday–Sunday 9:00 AM–9:00 PM, as time allows. Walk-ins are first-come, first-served based on availability that day. For a guaranteed spot, it's best to book online, and for same-day availability you can call or text Nya at 310-892-4874."
  },
  {
    id: "expectations",
    label: "Appointment expectations",
    keywords: ["expectations", "rules", "before my appointment", "what should I know", "appointment expectations", "studio rules", "early", "arrive", "arrival", "guests", "children", "extra guest", "bring someone"],
    answer: "To keep everyone's time respected and your service running smoothly:\n• Please arrive 15 minutes early.\n• No extra guests or children unless they are receiving a service (we do accept walk-ins).\n\nFor any questions about expectations or policies, please call or text Nya at 310-892-4874."
  },
  {
    id: "review-discount",
    label: "Review discount",
    keywords: ["review", "discount", "10", "ten", "yelp", "google", "save", "off", "promo", "promotion"],
    answer: "Get $10 off your next service when you leave a review on Yelp! After your appointment, simply leave a review and mention it during your next booking to receive the discount.\n\nTo take advantage of this offer, use the booking form on this page or call/text Nya at 310-892-4874 when scheduling your next appointment."
  },
  {
    id: "pricing",
    label: "Pricing & services",
    keywords: ["price", "pricing", "cost", "how much", "how much is it", "how much do you charge", "what do you charge", "rates", "pricing info", "service prices", "price list"],
    answer: "Pricing varies based on hair length, density, and service type (starter locs, retwist, maintenance, repair, etc.).\n\nFor exact pricing, please check the Services section on this page or use the booking form where you can select your service. For specific pricing questions, it's best to call or text Nya directly at 310-892-4874."
  },
  {
    id: "hours",
    label: "Hours & availability",
    keywords: ["hours", "open", "close", "availability", "available", "time", "days", "when", "schedule"],
    answer: "Studio hours may vary by day. The booking form on this page will show available times when you select your preferred date.\n\nNya works at RVM Twists and Cuts located at 5373 Wilshire Blvd, Los Angeles, CA.\n\nFor specific time requests or to check same-day availability, please use the booking form or call/text Nya at 310-892-4874."
  },
  {
    id: "booking",
    label: "How do I book?",
    keywords: ["book", "booking", "appointment", "schedule", "how to book", "make appointment", "reserve", "i want to book", "schedule an appointment"],
    answer: "Perfect. You can start your booking online — just tap the button below to open the booking form and choose your service and time.",
    ctaType: 'booking',
    ctaLabel: 'Book an appointment'
  },
  {
    id: "contact",
    label: "Contact Nya",
    keywords: ["contact", "call", "text", "phone", "number", "reach", "speak", "talk"],
    answer: "You can call or text Nya at 310-892-4874.\n\nNya works at RVM Twists and Cuts located at 5373 Wilshire Blvd, Los Angeles, CA.\n\nFor anything specific like exact pricing, last-minute availability, or special requests, calling or texting is best.\n\nFor booking appointments, please use the booking form on this page to secure your spot."
  },
  {
    id: "location",
    label: "Location & address",
    keywords: ["location", "address", "where", "studio", "salon", "rv twists", "rvm twists", "wilshire", "directions"],
    answer: "Nya works at RVM Twists and Cuts located at:\n\n5373 Wilshire Blvd\nLos Angeles, CA\n\nStreet and/or lot parking is available. Please arrive a few minutes early for check-in.\n\nFor directions or parking questions, you can call or text Nya at 310-892-4874."
  }
];

const fallbackAnswer = "I'm a simple FAQ assistant for Locs by Nya. I can help with general questions about services, pricing, hours, policies, and how to book. For anything specific or detailed, please use the booking form on this page or call/text Nya directly at 310-892-4874.";

const initialMessage: Message = {
  role: "assistant",
  content: "Hi! I'm Nya's booking assistant. I can help with services, pricing, policies, hours, and how to book. What would you like to know?"
};

export default function LocsFaqChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const findBestMatch = (question: string): FAQ | null => {
    const lowerQuestion = question.toLowerCase();
    let bestMatch: FAQ | null = null;
    let maxScore = 0;

    // Score each FAQ based on keyword matches
    // Multi-word keywords get higher weight (2 points) than single words (1 point)
    for (const faq of faqs) {
      let score = 0;
      
      for (const keyword of faq.keywords) {
        const lowerKeyword = keyword.toLowerCase();
        if (lowerQuestion.includes(lowerKeyword)) {
          // Multi-word keywords (phrases) get 2 points, single words get 1 point
          const weight = keyword.includes(' ') ? 2 : 1;
          score += weight;
        }
      }
      
      // If this FAQ has a higher score, it's the new best match
      // If scores are equal, prefer the one that appears earlier in the array (more specific)
      if (score > maxScore) {
        maxScore = score;
        bestMatch = faq;
      }
    }

    // Only return a match if we found at least one keyword match
    return maxScore > 0 ? bestMatch : null;
  };

  const scrollToBooking = () => {
    const element = document.getElementById('book');
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Close the chat widget after scrolling
      setIsOpen(false);
    }
  };

  const handleSend = (question: string) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: question };
    setMessages(prev => [...prev, userMessage]);

    // Find best matching FAQ
    const matchedFAQ = findBestMatch(question);
    const answer = matchedFAQ ? matchedFAQ.answer : fallbackAnswer;

    // Add assistant response after a brief delay for natural feel
    setTimeout(() => {
      const assistantMessage: Message = { 
        role: "assistant", 
        content: answer,
        ctaType: matchedFAQ?.ctaType,
        ctaLabel: matchedFAQ?.ctaLabel
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSend(inputValue);
      setInputValue("");
    }
  };


  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#14B8A6] to-[#0FA1B2] text-white rounded-full w-16 h-16 shadow-[0_8px_32px_rgba(20,184,166,0.4)] hover:shadow-[0_12px_40px_rgba(20,184,166,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center group backdrop-blur-sm border border-[#14B8A6]/30"
          aria-label="Open chat"
        >
          <svg
            className="w-7 h-7 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[600px] max-h-[85vh] bg-[#0B0F13] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col border border-[#8B5A3C]/20 overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#050609] via-[#0B0F13] to-[#050609] text-[#F9FAFB] p-5 flex items-center justify-between border-b border-[#8B5A3C]/20 relative">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14B8A6]/50 to-transparent"></div>
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-xl text-[#F9FAFB] mb-1">Nya's Booking Assistant</h3>
              <p className="text-xs text-[#9CA3AF] font-sans">Ask about services, pricing, policies, or how to book</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-4 text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors p-2 hover:bg-[#050609]/50 rounded-lg"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#050609] to-[#0B0F13]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-[#8B5A3C] to-[#6B4528] text-[#F9FAFB] border border-[#8B5A3C]/30"
                      : "bg-[#050609] text-[#F9FAFB] border border-[#8B5A3C]/20 backdrop-blur-sm"
                  }`}
                >
                  <p className={`text-sm leading-relaxed whitespace-pre-line font-sans ${message.role === "assistant" && message.ctaType === 'booking' ? 'mb-3' : ''}`}>{message.content}</p>
                  {message.role === "assistant" && message.ctaType === 'booking' && message.ctaLabel && (
                    <button
                      onClick={scrollToBooking}
                      className="w-full bg-gradient-to-br from-[#14B8A6] to-[#0FA1B2] text-white rounded-xl px-5 py-3 font-medium font-sans hover:from-[#11BFD0] hover:to-[#14B8A6] transition-all duration-300 shadow-lg hover:shadow-[0_8px_24px_rgba(20,184,166,0.4)] hover:scale-[1.02] border border-[#14B8A6]/30 text-sm"
                    >
                      {message.ctaLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-5 border-t border-[#8B5A3C]/20 bg-[#050609] backdrop-blur-sm">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question about services, pricing, or policies…"
                className="flex-1 px-5 py-3.5 rounded-2xl border border-[#8B5A3C]/30 bg-[#0B0F13] text-[#F9FAFB] placeholder-[#9CA3AF]/60 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6]/50 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="bg-gradient-to-br from-[#14B8A6] to-[#0FA1B2] text-white rounded-2xl px-6 py-3.5 hover:from-[#11BFD0] hover:to-[#14B8A6] transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-[0_8px_24px_rgba(20,184,166,0.4)] hover:scale-105 border border-[#14B8A6]/30"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}


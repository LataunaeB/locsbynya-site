import Link from 'next/link';

export default function BookSuccessPage() {
  return (
    <main className="min-h-screen bg-[#050609] text-[#F9FAFB] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-[#0B0F13] rounded-3xl border border-[#8B5A3C]/30 border-t-4 border-t-[#14B8A6] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center">
        <p className="text-xs uppercase tracking-wide text-[#14B8A6] font-sans font-semibold mb-2">
          Payment received
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#F9FAFB] mb-4">
          Thank you for your deposit
        </h1>
        <p className="font-sans text-[#9CA3AF] leading-relaxed mb-6">
          Your $25 security deposit was successful. A confirmation email will arrive shortly with your appointment details.
        </p>
        <p className="font-sans text-sm text-[#9CA3AF] leading-relaxed mb-8">
          If you do not see the email within a few minutes, check your spam folder or contact Nya at{' '}
          <a href="tel:310-892-4874" className="text-[#14B8A6] hover:text-[#11BFD0] transition-colors">
            310-892-4874
          </a>
          .
        </p>
        <Link
          href="/#book"
          className="inline-block bg-gradient-to-r from-[#4B2B1A] to-[#8B5A3C] text-white rounded-full px-8 py-3 text-sm font-medium font-sans hover:shadow-lg hover:shadow-[#8B5A3C]/30 transition-all"
        >
          Back to site
        </Link>
      </div>
    </main>
  );
}

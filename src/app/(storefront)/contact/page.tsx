import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | Variety Vista',
  description: 'Get in touch with the Variety Vista support team.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#FAFAF9] text-[#0A0A0A] py-16 md:py-24 page-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
            Support & Inquiries
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] mb-4 leading-[0.9]">
            Get in Touch
          </h1>
          <p className="text-base text-[#8B8680] max-w-xl mx-auto leading-relaxed">
            Have a question about sizing, an order, or just want to say hello? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-[#F5F4F2] p-8 md:p-10 border border-[rgba(10,10,10,0.06)]">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] mb-1.5">First Name</label>
                  <input type="text" id="firstName" className="w-full px-4 py-2.5 border border-[rgba(10,10,10,0.12)] bg-[#FAFAF9] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] mb-1.5">Last Name</label>
                  <input type="text" id="lastName" className="w-full px-4 py-2.5 border border-[rgba(10,10,10,0.12)] bg-[#FAFAF9] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] mb-1.5">Email Address</label>
                <input type="email" id="email" className="w-full px-4 py-2.5 border border-[rgba(10,10,10,0.12)] bg-[#FAFAF9] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]" />
              </div>

              <div>
                <label htmlFor="order" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] mb-1.5">Order Number (Optional)</label>
                <input type="text" id="order" className="w-full px-4 py-2.5 border border-[rgba(10,10,10,0.12)] bg-[#FAFAF9] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] mb-1.5">Message</label>
                <textarea id="message" rows={5} className="w-full px-4 py-2.5 border border-[rgba(10,10,10,0.12)] bg-[#FAFAF9] text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A] resize-none" />
              </div>
              
              <button type="button" className="w-full py-4 bg-[#0A0A0A] text-[#FAFAF9] font-bold uppercase tracking-[0.15em] text-xs hover:bg-[#B8913A] transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F5F4F2] text-[#B8913A] border border-[rgba(10,10,10,0.06)]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0A0A0A] mb-1 uppercase tracking-wider">Email</h3>
                    <p className="text-[#8B8680] text-sm mb-1">varietryvista@gmail.com</p>
                    <p className="text-xs text-[#8B8680]">We aim to reply within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F5F4F2] text-[#B8913A] border border-[rgba(10,10,10,0.06)]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0A0A0A] mb-1 uppercase tracking-wider">Phone</h3>
                    <p className="text-[#8B8680] text-sm mb-1">+91 99202 55905</p>
                    <p className="text-xs text-[#8B8680]">Mon-Fri from 9am to 6pm IST.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F5F4F2] text-[#B8913A] border border-[rgba(10,10,10,0.06)]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0A0A0A] mb-1 uppercase tracking-wider">Headquarters</h3>
                    <p className="text-[#8B8680] text-sm leading-relaxed">
                      Variety Vista Denim Studios<br />
                      Mumbai Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#F5F4F2] border border-[rgba(10,10,10,0.06)]">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#0A0A0A] mb-2">Frequently Asked Questions</h3>
              <p className="text-[#8B8680] mb-4 text-xs leading-relaxed">
                Need answers right away? Check our FAQ page for information about shipping, returns, and sizing.
              </p>
              <Link href="/faq" className="text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] hover:text-[#B8913A] underline underline-offset-4 transition-colors">
                Visit our FAQ →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

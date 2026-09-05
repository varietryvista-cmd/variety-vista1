import { Metadata } from 'next';
import Link from 'next/link';
import Accordion from '@/components/ui/Accordion';

export const metadata: Metadata = {
  title: 'FAQ | Variety Vista',
  description: 'Frequently asked questions about shipping, returns, and fit.',
};

const FAQS = [
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Same-day delivery in Mumbai. 2-4 business days for pan-India delivery. You will receive real-time tracking updates via SMS and email.'
      },
      {
        q: 'Do you offer Cash on Delivery?',
        a: 'Yes, Cash on Delivery (COD) is available across all serviceable pincodes in India alongside UPI, Cards, and Netbanking.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched, you will receive a tracking link via email and WhatsApp. You can also track directly from your Account page.'
      }
    ]
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day hassle-free, no-questions-asked return and exchange policy for unworn items with tags intact.'
      },
      {
        q: 'How do I start a return?',
        a: 'You can initiate a return from your Account dashboard or by contacting our support team. We will arrange a doorstep pickup.'
      },
      {
        q: 'Is exchange for a different size free?',
        a: 'Yes, size exchanges are 100% complimentary. We will dispatch your new size as soon as the return pickup is confirmed.'
      }
    ]
  },
  {
    category: 'Product & Fit',
    questions: [
      {
        q: 'How do I find my size?',
        a: 'Check out our comprehensive Size Guide for exact waist and inseam measurements, or use our interactive Fit Finder on any product page.'
      },
      {
        q: 'Will my jeans stretch out?',
        a: 'Our comfort stretch denim retains its shape through daily wear. Rigid raw denim will mold to your body over time, relaxing naturally by about half an inch.'
      },
      {
        q: 'How should I care for my denim?',
        a: 'Wash inside out in cold water with mild detergent and hang dry. For raw denim, wash minimally to achieve authentic personalized fading.'
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="bg-[#FAFAF9] text-[#0A0A0A] py-16 md:py-24 page-container">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] mb-4 leading-[0.9]">
            Frequently Asked Questions
          </h1>
          <p className="text-base text-[#8B8680] leading-relaxed max-w-xl mx-auto">
            Find quick answers to common questions about orders, sizing, and shipping.
          </p>
        </div>

        <div className="space-y-16">
          {FAQS.map((group, index) => (
            <div key={index} className="border-b border-[rgba(10,10,10,0.06)] pb-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8913A] block mb-2">0{index + 1}</span>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-6">{group.category}</h2>
              <Accordion 
                items={group.questions.map(q => ({
                  title: q.q,
                  content: <p className="text-sm text-[#8B8680] py-3 leading-relaxed">{q.a}</p>
                }))} 
              />
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-[rgba(10,10,10,0.06)] text-center">
          <h3 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-3">Still have questions?</h3>
          <p className="text-[#8B8680] mb-8 text-sm max-w-md mx-auto">
            We&apos;re here to help. Reach out to our support team and we&apos;ll get back to you as soon as possible.
          </p>
          <Link href="/contact" className="inline-flex items-center justify-center bg-[#0A0A0A] text-[#FAFAF9] px-10 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#B8913A] transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

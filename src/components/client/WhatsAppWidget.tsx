'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function WhatsAppWidget() {
  const whatsappNumber = "919920255905";
  const defaultMessage = "Hi Variety Vista! I need help with an order.";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </Link>
    </div>
  );
}

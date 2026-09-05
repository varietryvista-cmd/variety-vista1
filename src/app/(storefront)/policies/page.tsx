'use client';

import { useState } from 'react';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState('returns');

  return (
    <div className="bg-[#FAFAF9] text-[#0A0A0A] py-16 md:py-24 page-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
            Customer Information
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] mb-4 leading-[0.9]">
            Legal & Policies
          </h1>
          <p className="text-base text-[#8B8680] max-w-xl mx-auto leading-relaxed">
            Everything you need to know about our terms, how we protect your data, and our hassle-free return process.
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-12">
          <div className="md:w-64 flex-shrink-0">
            <div className="flex flex-col bg-transparent w-full space-y-1.5 border-l border-[rgba(10,10,10,0.08)] pl-4">
              <button 
                onClick={() => setActiveTab('returns')}
                className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === 'returns' 
                    ? 'bg-[#0A0A0A] text-[#FAFAF9]' 
                    : 'text-[#8B8680] hover:text-[#0A0A0A] hover:bg-[#F5F4F2]'
                }`}
              >
                Return Policy
              </button>
              <button 
                onClick={() => setActiveTab('privacy')}
                className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === 'privacy' 
                    ? 'bg-[#0A0A0A] text-[#FAFAF9]' 
                    : 'text-[#8B8680] hover:text-[#0A0A0A] hover:bg-[#F5F4F2]'
                }`}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setActiveTab('terms')}
                className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === 'terms' 
                    ? 'bg-[#0A0A0A] text-[#FAFAF9]' 
                    : 'text-[#8B8680] hover:text-[#0A0A0A] hover:bg-[#F5F4F2]'
                }`}
              >
                Terms of Service
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-0 bg-[#F5F4F2] p-8 md:p-12 border border-[rgba(10,10,10,0.06)]">
            {activeTab === 'returns' && (
              <div className="space-y-6 text-[#0A0A0A]">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-2">Return & Exchange Policy</h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B8680]">Last updated: August 2026</p>
                
                <h3 className="text-base font-bold uppercase tracking-wide mt-6">7-Day Easy Returns</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  We want you to love your Variety Vista denim. If you are not completely satisfied with your purchase, you may return the item(s) within 7 days of the delivery date for a full refund or exchange.
                </p>

                <h3 className="text-base font-bold uppercase tracking-wide mt-6">Conditions</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-[#8B8680]">
                  <li>Items must be unworn, unwashed, and in their original pristine condition.</li>
                  <li>All original brand tags must still be attached.</li>
                  <li>Customized or altered items cannot be returned.</li>
                </ul>

                <h3 className="text-base font-bold uppercase tracking-wide mt-6">How to Return</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  To initiate a return, please log into your account and navigate to your Orders page, or reach out to our support team via WhatsApp or email. A free doorstep pickup will be arranged.
                </p>

                <h3 className="text-base font-bold uppercase tracking-wide mt-6">Complimentary Exchanges</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  We offer 100% free exchanges for different sizes of the same item. Your replacement will be dispatched as soon as the pickup is scheduled.
                </p>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 text-[#0A0A0A]">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-2">Privacy Policy</h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B8680]">Last updated: August 2026</p>
                
                <h3 className="text-base font-bold uppercase tracking-wide mt-6">Information We Collect</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  We collect information that you provide directly to us, such as when you create an account, place an order, subscribe to our newsletter, or contact customer support. This may include your name, email address, shipping address, and phone number. Payment data is processed securely through PCI-DSS certified gateways (Razorpay).
                </p>

                <h3 className="text-base font-bold uppercase tracking-wide mt-6">How We Use Your Information</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-[#8B8680]">
                  <li>Process, fulfill, and track your orders.</li>
                  <li>Send order updates and service notifications.</li>
                  <li>Provide customer assistance and size guidance.</li>
                  <li>Maintain secure transactions and prevent fraud.</li>
                </ul>

                <h3 className="text-base font-bold uppercase tracking-wide mt-6">Zero Third-Party Data Selling</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  We never sell, rent, or trade your personal data. We only share essential delivery information with verified logistics partners (Shiprocket) to ensure accurate fulfillment.
                </p>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-6 text-[#0A0A0A]">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-2">Terms of Service</h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B8680]">Last updated: August 2026</p>
                
                <h3 className="text-base font-bold uppercase tracking-wide mt-6">Agreement to Terms</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  By accessing or using the Variety Vista website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, please do not access or use our services.
                </p>

                <h3 className="text-base font-bold uppercase tracking-wide mt-6">Products and Pricing</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  All denim products and prices displayed are subject to availability. We reserve the right to correct any typographical errors or inaccuracies and to update product information at any time without prior notice.
                </p>

                <h3 className="text-base font-bold uppercase tracking-wide mt-6">Intellectual Property</h3>
                <p className="text-sm text-[#8B8680] leading-relaxed">
                  All designs, logos, images, text, and digital assets on Variety Vista are the exclusive property of Variety Vista and protected under copyright and trademark laws.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

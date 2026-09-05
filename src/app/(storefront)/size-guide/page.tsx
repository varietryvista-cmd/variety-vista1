'use client';

import { useState } from 'react';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState('women');

  return (
    <div className="bg-[#FAFAF9] text-[#0A0A0A] py-16 md:py-24 page-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8B8680] block mb-3">
            Measurements & Fit
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[-0.04em] text-[#0A0A0A] mb-4 leading-[0.9]">
            Size Guide
          </h1>
          <p className="text-base text-[#8B8680] max-w-xl mx-auto leading-relaxed">
            Use our measurement charts below to find your perfect fit. If you&apos;re between sizes, we recommend sizing up for rigid denim and sizing down for stretch denim.
          </p>
        </div>

        <div className="w-full">
          <div className="flex justify-center mb-12">
            <div className="bg-[#F5F4F2] p-1 border border-[rgba(10,10,10,0.08)] inline-flex">
              <button 
                onClick={() => setActiveTab('women')}
                className={`px-10 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all ${activeTab === 'women' ? 'bg-[#0A0A0A] text-[#FAFAF9]' : 'text-[#8B8680] hover:text-[#0A0A0A]'}`}
              >
                Women&apos;s
              </button>
              <button 
                onClick={() => setActiveTab('men')}
                className={`px-10 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all ${activeTab === 'men' ? 'bg-[#0A0A0A] text-[#FAFAF9]' : 'text-[#8B8680] hover:text-[#0A0A0A]'}`}
              >
                Men&apos;s
              </button>
            </div>
          </div>

          <div className="space-y-16">
            {activeTab === 'women' && (
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-6">Denim Bottoms (Inches)</h2>
                <div className="overflow-x-auto border border-[rgba(10,10,10,0.06)] bg-[#FAFAF9]">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#0A0A0A] bg-[#F5F4F2]">
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">Size</th>
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">Waist (in)</th>
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">Hip (in)</th>
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">EU Size</th>
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">UK Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: '24', waist: '24-25', hip: '34-35', eu: '34', uk: '6' },
                        { size: '25', waist: '25-26', hip: '35-36', eu: '34/36', uk: '6/8' },
                        { size: '26', waist: '26-27', hip: '36-37', eu: '36', uk: '8' },
                        { size: '27', waist: '27-28', hip: '37-38', eu: '36/38', uk: '8/10' },
                        { size: '28', waist: '28-29', hip: '38-39', eu: '38', uk: '10' },
                        { size: '29', waist: '29-30', hip: '39-40', eu: '38/40', uk: '10/12' },
                        { size: '30', waist: '30-31', hip: '40-41', eu: '40', uk: '12' },
                        { size: '31', waist: '31-32', hip: '41-42', eu: '40/42', uk: '12/14' },
                        { size: '32', waist: '32-33', hip: '42-43', eu: '42', uk: '14' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[rgba(10,10,10,0.06)] hover:bg-[#F5F4F2] transition-colors">
                          <td className="py-4 px-4 font-bold text-xs text-[#0A0A0A]">{row.size}</td>
                          <td className="py-4 px-4 text-xs font-medium text-[#8B8680]">{row.waist}</td>
                          <td className="py-4 px-4 text-xs font-medium text-[#8B8680]">{row.hip}</td>
                          <td className="py-4 px-4 text-xs font-medium text-[#8B8680]">{row.eu}</td>
                          <td className="py-4 px-4 text-xs font-medium text-[#8B8680]">{row.uk}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'men' && (
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-6">Men&apos;s Waist & Inseam (Inches)</h2>
                <div className="overflow-x-auto border border-[rgba(10,10,10,0.06)] bg-[#FAFAF9]">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#0A0A0A] bg-[#F5F4F2]">
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">Waist Size</th>
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">Actual Waist (in)</th>
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">Hip (in)</th>
                        <th className="py-4 px-4 font-bold text-xs uppercase tracking-[0.15em] text-[#0A0A0A]">Thigh (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: '28', waist: '28-29', hip: '35-36', thigh: '20-21' },
                        { size: '30', waist: '30-31', hip: '37-38', thigh: '21-22' },
                        { size: '32', waist: '32-33', hip: '39-40', thigh: '22-23' },
                        { size: '34', waist: '34-35', hip: '41-42', thigh: '23-24' },
                        { size: '36', waist: '36-37', hip: '43-44', thigh: '24-25' },
                        { size: '38', waist: '38-39', hip: '45-46', thigh: '25-26' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-[rgba(10,10,10,0.06)] hover:bg-[#F5F4F2] transition-colors">
                          <td className="py-4 px-4 font-bold text-xs text-[#0A0A0A]">W{row.size}</td>
                          <td className="py-4 px-4 text-xs font-medium text-[#8B8680]">{row.waist}</td>
                          <td className="py-4 px-4 text-xs font-medium text-[#8B8680]">{row.hip}</td>
                          <td className="py-4 px-4 text-xs font-medium text-[#8B8680]">{row.thigh}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* How to Measure */}
            <div className="bg-[#F5F4F2] p-8 md:p-12 border border-[rgba(10,10,10,0.06)]">
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#0A0A0A] mb-6">How to Measure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-[0.15em] text-[#B8913A] mb-2">1. Waist</h4>
                  <p className="text-xs text-[#8B8680] leading-relaxed">
                    Measure around the narrowest part of your waist, keeping the tape comfortably snug.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-[0.15em] text-[#B8913A] mb-2">2. Hips</h4>
                  <p className="text-xs text-[#8B8680] leading-relaxed">
                    Stand with feet together and measure around the fullest part of your hips and rear.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-[0.15em] text-[#B8913A] mb-2">3. Inseam</h4>
                  <p className="text-xs text-[#8B8680] leading-relaxed">
                    Measure from the crotch point along the inside leg down to the ankle bone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

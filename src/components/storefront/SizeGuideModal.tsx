'use client';

import * as React from 'react';
import Modal from '@/components/ui/Modal';
import { Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gender?: string;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  // Simple static size chart for jeans
  const sizeChart = [
    { waist: 28, inseam: 30, hip: 36, thigh: 21 },
    { waist: 30, inseam: 30, hip: 38, thigh: 22 },
    { waist: 32, inseam: 32, hip: 40, thigh: 23 },
    { waist: 34, inseam: 32, hip: 42, thigh: 24 },
    { waist: 36, inseam: 34, hip: 44, thigh: 25 },
    { waist: 38, inseam: 34, hip: 46, thigh: 26 },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Size Guide" size="lg">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <Ruler className="w-6 h-6 text-[#111]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#111] mb-1">How to measure</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              For the best fit, measure your waist where you naturally wear your jeans. 
              The inseam is measured from the crotch seam to the hem. If you&apos;re between sizes, 
              we recommend sizing up for a more relaxed fit.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">Waist (Inches)</th>
                <th className="px-4 py-3">Inseam (Inches)</th>
                <th className="px-4 py-3">Hip (Inches)</th>
                <th className="px-4 py-3">Thigh (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sizeChart.map((row) => (
                <tr key={row.waist} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#111]">{row.waist}</td>
                  <td className="px-4 py-3 text-gray-600">{row.inseam}</td>
                  <td className="px-4 py-3 text-gray-600">{row.hip}</td>
                  <td className="px-4 py-3 text-gray-600">{row.thigh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded flex items-start gap-2">
          <span className="font-bold">Note:</span>
          Measurements are approximate and can vary slightly depending on the style and fabric (rigid vs. stretch denim).
        </div>
      </div>
    </Modal>
  );
}

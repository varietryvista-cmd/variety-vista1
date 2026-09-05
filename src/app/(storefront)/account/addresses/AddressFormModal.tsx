'use client';

import * as React from 'react';
import type { Address } from '@/types';
import { addAddress, updateAddress } from '@/app/actions/address';
import Button from '@/components/ui/CustomButton';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit: Address | null;
  onSuccess: (address: Address, isNew: boolean) => void;
}

export default function AddressFormModal({ isOpen, onClose, addressToEdit, onSuccess }: AddressFormModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const [formData, setFormData] = React.useState({
    full_name: addressToEdit?.full_name || '',
    phone: addressToEdit?.phone || '',
    address_line1: addressToEdit?.address_line1 || '',
    address_line2: addressToEdit?.address_line2 || '',
    city: addressToEdit?.city || '',
    state: addressToEdit?.state || '',
    pincode: addressToEdit?.pincode || '',
    country: addressToEdit?.country || 'India',
    is_default: addressToEdit?.is_default || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (addressToEdit) {
      const { success, error: apiError } = await updateAddress(addressToEdit.id, formData);
      if (apiError) {
        setError(apiError);
      } else if (success) {
        onSuccess({ ...addressToEdit, ...formData } as Address, false);
      }
    } else {
      const { success, error: apiError } = await addAddress(formData);
      if (apiError) {
        setError(apiError);
      } else if (success) {
        onSuccess({ ...formData, id: 'temp-id' } as Address, true);
      }
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {addressToEdit ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto">
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}

            <form id="address-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                <input
                  type="text"
                  name="address_line1"
                  required
                  placeholder="House No, Building, Street, Area"
                  value={formData.address_line1}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="address_line2"
                  placeholder="Locality / Town (Optional)"
                  value={formData.address_line2}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-[#111] focus:ring-[#111] sm:text-sm"
                    readOnly
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center">
                <input
                  id="is_default"
                  name="is_default"
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#111] focus:ring-[#111]"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Make this my default address
                </label>
              </div>
            </form>
          </div>

          <div className="p-4 border-t border-gray-100 shrink-0 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" form="address-form" loading={loading}>
              {addressToEdit ? 'Save Changes' : 'Save Address'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

'use client';

import * as React from 'react';
import type { Address } from '@/types';
import Button from '@/components/ui/CustomButton';
import { Plus, Edit2, Trash2, StarOff } from 'lucide-react';
import { deleteAddress, setDefaultAddress } from '@/app/actions/address';
import AddressFormModal from './AddressFormModal';

export default function AddressesView({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = React.useState<Address[]>(initialAddresses);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [loadingAction, setLoadingAction] = React.useState<string | null>(null);

  const handleAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    setLoadingAction(`delete-${id}`);
    const { success, error } = await deleteAddress(id);
    setLoadingAction(null);

    if (error) {
      alert(error);
    } else if (success) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = async (id: string) => {
    setLoadingAction(`default-${id}`);
    const { success, error } = await setDefaultAddress(id);
    setLoadingAction(null);

    if (error) {
      alert(error);
    } else if (success) {
      setAddresses(addresses.map(a => ({
        ...a,
        is_default: a.id === id
      })));
    }
  };

  const handleSaveSuccess = (savedAddress: Address, isNew: boolean) => {
    if (isNew) {
      // Re-fetch or manually add. For simplicity, if it's default we need to map others to false
      setAddresses(prev => {
        const newArr = savedAddress.is_default ? prev.map(a => ({...a, is_default: false})) : [...prev];
        return [savedAddress, ...newArr];
      });
    } else {
      setAddresses(prev => {
        let newArr = [...prev];
        if (savedAddress.is_default) {
          newArr = newArr.map(a => ({...a, is_default: false}));
        }
        return newArr.map(a => a.id === savedAddress.id ? savedAddress : a);
      });
    }
    setIsModalOpen(false);
    // Alternatively, we could router.refresh() here to pull from server
    window.location.reload(); 
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Manage your shipping and billing addresses.</p>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">You haven&apos;t added any addresses yet.</p>
          <Button variant="outline" onClick={handleAdd}>Add your first address</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className={`border rounded-lg p-5 relative transition-all ${address.is_default ? 'border-[#111] shadow-sm bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
              
              {address.is_default && (
                <span className="absolute top-0 right-0 bg-[#111] text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                  Default
                </span>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900">{address.full_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-6">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p>{address.country}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(address)}
                  className="flex-1 sm:flex-none text-xs h-8"
                >
                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(address.id)}
                  loading={loadingAction === `delete-${address.id}`}
                  className="flex-1 sm:flex-none text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>

                {!address.is_default && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSetDefault(address.id)}
                    loading={loadingAction === `default-${address.id}`}
                    className="flex-1 sm:flex-none text-xs h-8 text-gray-600"
                  >
                    <StarOff className="w-3 h-3 mr-1" /> Set Default
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddressFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          addressToEdit={editingAddress}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}

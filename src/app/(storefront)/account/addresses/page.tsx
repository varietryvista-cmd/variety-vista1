import { Metadata } from 'next';
import { getUserAddresses } from '@/app/actions/address';
import AddressesView from './AddressesView';

export const metadata: Metadata = {
  title: 'My Addresses | Variety Vista',
  description: 'Manage your shipping and billing addresses.',
};

export default async function AddressesPage() {
  const { data: addresses, error } = await getUserAddresses();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Addresses</h2>
      
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <AddressesView initialAddresses={addresses || []} />
      )}
    </div>
  );
}

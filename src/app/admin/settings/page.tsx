import { Metadata } from 'next';
import Button from '@/components/ui/CustomButton';

export const metadata: Metadata = {
  title: 'Settings | Admin',
};

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage global store settings.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Store Profile</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input type="text" defaultValue="Variety Vista" className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input type="email" defaultValue="support@varietyvista.com" className="w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="pt-2">
              <Button type="button">Save Profile</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

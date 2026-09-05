import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Customers | Admin',
};

export default function AdminCustomersPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <input 
            type="text"
            placeholder="Search customers..."
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full max-w-xs focus:ring-2 focus:ring-[#111] focus:border-transparent outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Total Spent</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="text-gray-900">
                <td className="px-6 py-4 font-medium">John Doe</td>
                <td className="px-6 py-4 text-gray-500">john.doe@example.com</td>
                <td className="px-6 py-4">3</td>
                <td className="px-6 py-4">₹12,497</td>
                <td className="px-6 py-4">
                  <Link href="#" className="text-sm text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

interface ChartData {
  name: string;
  total: number;
  orders?: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface ProductData {
  name: string;
  revenue: number;
  orders: number;
}

interface DashboardChartsProps {
  chartData: ChartData[];
  statusData?: StatusData[];
  topProducts?: ProductData[];
}

const COLORS = ['#111111', '#524036', '#8B8680', '#C4BFB6', '#E6E2DD', '#1F1C1B'];

export default function DashboardCharts({ 
  chartData, 
  statusData = [], 
  topProducts = [] 
}: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState<'revenue' | 'orders' | 'status' | 'products'>('revenue');

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="text-center text-gray-500">
          <p className="font-medium mb-2">No data available yet</p>
          <p className="text-sm">Charts will appear after orders are placed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200" role="tablist">
        {[
          { key: 'revenue', label: 'Revenue' },
          { key: 'orders', label: 'Orders' },
          { key: 'status', label: 'Order Status' },
          { key: 'products', label: 'Top Products' },
        ].map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.key
                ? 'bg-black text-white border-b-2 border-black -mb-px'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Content */}
      <div className="h-[350px] w-full" role="tabpanel">
        {activeTab === 'revenue' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                tickFormatter={(value) => formatPrice(value)}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip 
                formatter={(value: number | string | readonly (number | string)[] | undefined) => [formatPrice(Number(Array.isArray(value) ? value[0] : value) || 0), 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#111111" 
                strokeWidth={2}
                dot={{ r: 4, fill: '#111111', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#111111', stroke: '#fff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#524036" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#524036', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#524036', stroke: '#fff', strokeWidth: 2 }}
                yAxisId="right"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'orders' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                tickFormatter={(value) => value.toString()}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip 
                formatter={(value: number | string | readonly (number | string)[] | undefined) => [Array.isArray(value) ? value[0] : value, 'Orders']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="orders" 
                fill="#111111" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'status' && statusData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
                startAngle={90}
                endAngle={270}
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number | string | readonly (number | string)[] | undefined) => [Array.isArray(value) ? value[0]?.toString() ?? '' : value?.toString() ?? '', 'Orders']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                wrapperStyle={{ paddingRight: 20 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'products' && topProducts.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                width={100}
              />
              <XAxis 
                tickFormatter={(value) => formatPrice(value)}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number | string | readonly (number | string)[] | undefined) => [formatPrice(Number(Array.isArray(value) ? value[0] : value) || 0), 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="top"
                iconType="circle"
                wrapperStyle={{ paddingRight: 20 }}
              />
              <Bar 
                dataKey="revenue" 
                name="Revenue"
                fill="#111111" 
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="orders" 
                name="Orders"
                fill="#524036" 
                radius={[0, 4, 4, 0]}
                yAxisId="right"
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'status' && statusData.length === 0 && (
          <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-xl">
            <p className="text-gray-500">No status data available</p>
          </div>
        )}

        {activeTab === 'products' && topProducts.length === 0 && (
          <div className="h-[350px] flex items-center justify-center bg-gray-50 rounded-xl">
            <p className="text-gray-500">No product data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
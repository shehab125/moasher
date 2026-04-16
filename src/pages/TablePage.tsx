import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2 } from
'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface TransactionRow {
  id: number;
  district: string;
  price: string;
  pricePerM: string;
  area: string;
  date: string;
  type: string;
}

export function TablePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTableData();
  }, []);

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const { data: transactions, count, error } = await supabase
        .from('transactions')
        .select(`
          *,
          districts (name_ar),
          property_types (name_ar)
        `, { count: 'exact' })
        .order('transaction_date', { ascending: false });

      if (error) throw error;

      const formatted = transactions.map(item => ({
        id: item.id,
        district: item.districts?.name_ar || 'غير معروف',
        price: new Intl.NumberFormat('ar-SA').format(item.total_price),
        pricePerM: new Intl.NumberFormat('ar-SA').format(item.price_per_meter),
        area: item.area_sqm.toString(),
        date: new Date(item.transaction_date).toLocaleDateString('ar-SA'),
        type: item.property_types?.name_ar || 'عقار'
      }));

      setData(formatted);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'سكني':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'تجاري':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'أرض':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredData = data.filter(row => 
    row.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              بيانات الصفقات
            </h1>
            <p className="text-slate-500 text-sm">
              استعرض وحلل تفاصيل جميع الصفقات العقارية
            </p>
          </div>

          <div className="flex w-full md:w-auto items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <Download size={18} />
              <span className="hidden sm:inline">تصدير</span>
            </button>
            <button className="flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 px-4 py-2.5 rounded-xl font-medium hover:bg-brand-100 transition-colors shadow-sm">
              <Filter size={18} />
              <span>تصفية</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={20} />
            
            <input
              type="text"
              placeholder="ابحث عن حي، مدينة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow" />
            
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['الكل', 'الرياض', 'جدة', 'الدمام'].map((city, i) =>
            <button
              key={city}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              
                {city}
              </button>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-right border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      الحي <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      السعر (ر.س) <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      سعر المتر <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 whitespace-nowrap">
                    المساحة (م²)
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                      التاريخ <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 whitespace-nowrap">
                    النوع
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 whitespace-nowrap text-center">
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-brand-600" size={32} />
                        <p className="text-slate-500 font-medium">جاري تحميل البيانات...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-slate-500 font-medium">
                      لا توجد بيانات تطابق بحثك
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <motion.tr
                      initial={{
                        opacity: 0,
                        y: 10
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.05
                      }}
                      key={row.id}
                      className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      
                      <td className="py-4 px-6 text-sm font-bold text-slate-900">
                        {row.district}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-700">
                        {row.price}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-700">
                        {row.pricePerM}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">
                        {row.area}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        {row.date}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${getTypeColor(row.type)}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Link
                          to={`/details/${row.id}`}
                          className="inline-flex items-center justify-center text-brand-600 hover:text-brand-800 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          التفاصيل
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
            <span className="text-sm text-slate-500">
              عرض <span className="font-bold text-slate-900">١</span> إلى{' '}
              <span className="font-bold text-slate-900">٨</span> من{' '}
              <span className="font-bold text-slate-900">١,٢٤٧</span> صفقة
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">
                <ChevronRight size={18} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center">
                ١
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 font-medium flex items-center justify-center transition-colors">
                ٢
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 font-medium flex items-center justify-center transition-colors">
                ٣
              </button>
              <span className="text-slate-400">...</span>
              <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}
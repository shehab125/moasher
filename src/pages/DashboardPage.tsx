import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/DashboardLayout';
import { KPICard } from '../components/KPICard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar } from
'recharts';
import {
  TrendingUp,
  Banknote,
  Activity,
  Building2,
  Map,
  TableProperties,
  ChevronDown,
  Loader2 } from
'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const trendData = [
{
  month: 'يناير',
  price: 3100
},
{
  month: 'فبراير',
  price: 3150
},
{
  month: 'مارس',
  price: 3200
},
{
  month: 'أبريل',
  price: 3180
},
{
  month: 'مايو',
  price: 3250
},
{
  month: 'يونيو',
  price: 3300
}];

const areaData = [
{
  area: 'النرجس',
  transactions: 450
},
{
  area: 'الياسمين',
  transactions: 380
},
{
  area: 'الملقا',
  transactions: 320
},
{
  area: 'العليا',
  transactions: 210
},
{
  area: 'حطين',
  transactions: 190
}];

export function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState('الرياض');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    avgPrice: '٠',
    totalTransactions: '٠',
    totalValue: '٠',
    activeListings: '٨,٤٣٢' // Simulation placeholder
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const { data, count, error } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' });

      if (error) throw error;

      if (data && data.length > 0) {
        const totalValue = data.reduce((acc, curr) => acc + Number(curr.total_price), 0);
        const avgPrice = data.reduce((acc, curr) => acc + Number(curr.price_per_meter), 0) / data.length;

        setStats({
          avgPrice: new Intl.NumberFormat('ar-SA').format(Math.round(avgPrice)) + ' ر.س',
          totalTransactions: new Intl.NumberFormat('ar-SA').format(count || 0),
          totalValue: (totalValue / 1000000).toFixed(1) + ' مليون ر.س',
          activeListings: '١,٢٤٧'
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              مرحباً بك في مؤشر 👋
            </h1>
            <p className="text-slate-500 text-sm">
              نظرة عامة على أداء السوق العقاري
            </p>
          </div>

          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-10 pr-4 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm cursor-pointer">
              
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
            </select>
            <ChevronDown
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={18} />
            
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 relative min-h-[140px]">
          {loading && (
            <div className="absolute inset-0 z-10 bg-slate-50/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
              <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
          )}
          <KPICard
            title="متوسط سعر المتر"
            value={stats.avgPrice}
            icon={Banknote}
            trend={{
              value: '٥.٢٪',
              isPositive: true
            }}
            delay={0.1} />
          
          <KPICard
            title="عدد الصفقات"
            value={stats.totalTransactions}
            icon={Activity}
            trend={{
              value: '٢.١٪',
               isPositive: true
            }}
            delay={0.2} />
          
          <KPICard
            title="إجمالي القيمة"
            value={stats.totalValue}
            icon={TrendingUp}
            trend={{
              value: '١.٥٪',
              isPositive: false
            }}
            delay={0.3} />
          
          <KPICard
            title="العقارات المعروضة"
            value={stats.activeListings}
            icon={Building2}
            delay={0.4} />
          
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.4,
              delay: 0.5
            }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              متوسط سعر المتر (٦ أشهر)
            </h3>
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{
                    top: 5,
                    right: 20,
                    bottom: 5,
                    left: 0
                  }}>
                  
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9" />
                  
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />
                  
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />
                  
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{
                      color: '#0d9488',
                      fontWeight: 'bold'
                    }} />
                  
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#0d9488',
                      strokeWidth: 2,
                      stroke: '#fff'
                    }}
                    activeDot={{
                      r: 6
                    }} />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.4,
              delay: 0.6
            }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              أكثر الأحياء نشاطاً (عدد الصفقات)
            </h3>
            <div className="h-[300px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={areaData}
                  margin={{
                    top: 5,
                    right: 20,
                    bottom: 5,
                    left: 0
                  }}>
                  
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9" />
                  
                  <XAxis
                    dataKey="area"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />
                  
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#64748b',
                      fontSize: 12
                    }} />
                  
                  <Tooltip
                    cursor={{
                      fill: '#f8fafc'
                    }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} />
                  
                  <Bar
                    dataKey="transactions"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={32} />
                  
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.4,
              delay: 0.7
            }}>
            
            <Link
              to="/map"
              className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
              
              <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <Map size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  استكشف الخريطة
                </h3>
                <p className="text-slate-500 text-sm">
                  عرض الصفقات العقارية على الخريطة التفاعلية
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.4,
              delay: 0.8
            }}>
            
            <Link
              to="/table"
              className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
              
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <TableProperties size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  جدول البيانات
                </h3>
                <p className="text-slate-500 text-sm">
                  تصفح وبحث في تفاصيل جميع الصفقات
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>);

}
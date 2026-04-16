import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Calendar,
  Building2,
  Maximize,
  Banknote,
  Download,
  Lock,
  Share2,
  Loader2 } from
'lucide-react';
import { supabase } from '../lib/supabase';

interface PropertyDetails {
  id: string | number;
  type: string;
  district: string;
  city: string;
  price: string;
  pricePerM: string;
  area: string;
  date: string;
  status: string;
  coordinates: string;
  deedNumber: string;
  plotNumber: string;
  planNumber: string;
}

export function DetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchDetails(id);
  }, [id]);

  const fetchDetails = async (transactionId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          districts (name_ar, regions (name_ar)),
          property_types (name_ar)
        `)
        .eq('id', transactionId)
        .single();

      if (error) throw error;

      setProperty({
        id: data.id,
        type: data.property_types?.name_ar || 'عقار',
        district: data.districts?.name_ar || 'غير معروف',
        city: data.districts?.regions?.name_ar || 'الرياض',
        price: new Intl.NumberFormat('ar-SA').format(data.total_price),
        pricePerM: new Intl.NumberFormat('ar-SA').format(data.price_per_meter),
        area: data.area_sqm.toString(),
        date: new Date(data.transaction_date).toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'مكتملة',
        coordinates: `${data.latitude}° N, ${data.longitude}° E`,
        deedNumber: '٣١٠١٢٣٤٥٦٧٨٩', // Mock placeholder for deeds
        plotNumber: data.parcel_number || 'غير متوفر',
        planNumber: data.plan_number || 'غير متوفر'
      });
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-brand-600" size={48} />
            <p className="text-slate-500 font-bold">جاري تحميل تفاصيل الصفقة...</p>
          </div>
        ) : !property ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold text-slate-800 mb-4">الصفقة غير موجودة</h2>
            <Link to="/table" className="text-brand-600 font-bold hover:underline">العودة للبيانات</Link>
          </div>
        ) : (
          <>
            {/* Top Navigation */}
            <div className="mb-6">
              <Link
                to="/table"
                className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-medium">
                
                <ArrowRight size={18} />
                <span>العودة للبيانات</span>
              </Link>
            </div>

            {/* Header Section */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-sm font-bold">
                    {property.type}
                  </span>
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {property.date}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  صفقة عقارية في حي {property.district}
                </h1>
                <p className="text-slate-500 flex items-center gap-1.5">
                  <MapPin size={16} />
                  {property.city}، المملكة العربية السعودية
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
                  <Share2 size={18} />
                  مشاركة
                </button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm group relative overflow-hidden">
                  <Download size={18} />
                  تحميل التقرير
                  <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                    <Lock size={18} className="text-white" />
                  </div>
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Key Metrics */}
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
                    delay: 0.1
                  }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Banknote size={18} />
                      <span className="text-sm font-medium">السعر الإجمالي</span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-slate-900">
                      {property.price}{' '}
                      <span className="text-sm font-normal text-slate-500">
                        ر.س
                      </span>
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Maximize size={18} />
                      <span className="text-sm font-medium">المساحة</span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-slate-900">
                      {property.area}{' '}
                      <span className="text-sm font-normal text-slate-500">م²</span>
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Building2 size={18} />
                      <span className="text-sm font-medium">سعر المتر</span>
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-brand-600">
                      {property.pricePerM}{' '}
                      <span className="text-sm font-normal text-brand-600/70">
                        ر.س/م²
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Detailed Info Card */}
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
                    delay: 0.2
                  }}
                  className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
                  
                  <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
                    تفاصيل العقار والصفقة
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">رقم الصك</p>
                      <p className="font-semibold text-slate-900">
                        {property.deedNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">رقم المخطط</p>
                      <p className="font-semibold text-slate-900">
                        {property.planNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">رقم القطعة</p>
                      <p className="font-semibold text-slate-900">
                        {property.plotNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">حالة الصفقة</p>
                      <p className="font-semibold text-emerald-600">
                        {property.status}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar / Map Preview */}
              <div className="space-y-6">
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
                    delay: 0.3
                  }}
                  className="bg-white rounded-3xl p-2 border border-slate-100 shadow-sm overflow-hidden">
                  
                  <div className="h-48 bg-slate-100 rounded-2xl relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-lg relative z-10 animate-bounce">
                      <MapPin size={24} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-1">
                      الموقع الجغرافي
                    </h3>
                    <p className="text-sm text-slate-500 mb-3" dir="ltr">
                      {property.coordinates}
                    </p>
                    <Link
                      to="/map"
                      className="block w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-brand-600 font-bold text-center rounded-xl transition-colors text-sm">
                      
                      عرض على الخريطة
                    </Link>
                  </div>
                </motion.div>

                {/* Premium Upsell */}
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
                    delay: 0.4
                  }}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-700 shadow-lg text-white relative overflow-hidden">
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-bl-full -mr-10 -mt-10 blur-2xl" />
                  <Lock className="text-brand-400 mb-4" size={28} />
                  <h3 className="font-bold text-lg mb-2">تحليلات متقدمة</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    اشترك في الباقة المميزة للحصول على تقييم دقيق للعقار، وتاريخ
                    الصفقات المجاورة، وتوقعات الأسعار.
                  </p>
                  <Link
                    to="/subscription"
                    className="block w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-center rounded-xl transition-colors shadow-md">
                    
                    ترقية الحساب
                  </Link>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>);

}
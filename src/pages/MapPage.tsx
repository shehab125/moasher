import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl } from
'react-leaflet';
import { Filter, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Property {
  id: number;
  lat: number;
  lng: number;
  type: string;
  price: string;
  pricePerM: string;
  area: string;
  date: string;
  district: string;
  color: string;
}

const typeColors: Record<string, string> = {
  'سكني': '#10b981',
  'تجاري': '#3b82f6',
  'أرض': '#f59e0b',
  'Default': '#0d9488'
};

export function MapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          districts (name_ar),
          property_types (name_ar)
        `)
        .order('transaction_date', { ascending: false });

      if (error) throw error;

      const formattedData: Property[] = data.map(item => ({
        id: item.id,
        lat: item.latitude,
        lng: item.longitude,
        type: item.property_types?.name_ar || 'عقار',
        price: new Intl.NumberFormat('ar-SA').format(item.total_price),
        pricePerM: new Intl.NumberFormat('ar-SA').format(item.price_per_meter),
        area: item.area_sqm.toString(),
        date: new Date(item.transaction_date).toLocaleDateString('ar-SA'),
        district: item.districts?.name_ar || 'حي غير معروف',
        color: typeColors[item.property_types?.name_ar] || typeColors.Default
      }));

      setProperties(formattedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="relative w-full h-full flex flex-col">
        {/* Map Header (Mobile only) */}
        <div className="md:hidden bg-white p-4 border-b border-slate-200 z-10 flex justify-between items-center shadow-sm">
          <h1 className="font-bold text-slate-900">الخريطة التفاعلية</h1>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2 bg-slate-50 rounded-lg text-slate-600">
            
            <Filter size={20} />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative z-0">
          {loading ? (
            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-brand-600" size={40} />
                <p className="text-slate-600 font-bold">جاري تحميل البيانات...</p>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="absolute inset-0 z-10 bg-white flex items-center justify-center">
              <p className="text-slate-500 font-bold text-lg">لا توجد بيانات متاحة حالياً</p>
            </div>
          ) : null}

          <MapContainer
            center={[24.7742, 46.6753]} // Riyadh center
            zoom={12}
            zoomControl={false}
            className="w-full h-full">
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            
            <ZoomControl position="bottomleft" />

            {properties.map((prop) =>
            <Marker key={prop.id} position={[prop.lat, prop.lng]}>
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]" dir="rtl">
                    <div className="flex justify-between items-start mb-3">
                      <span
                      className={`text-xs font-bold px-2 py-1 rounded-md text-white`}
                      style={{
                        backgroundColor: prop.color
                      }}>
                      
                        {prop.type}
                      </span>
                      <span className="text-slate-500 text-xs">
                        {prop.date}
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-xl font-bold text-slate-900 mb-1">
                        {prop.price}{' '}
                        <span className="text-sm font-normal text-slate-500">
                          ر.س
                        </span>
                      </p>
                      <p className="text-sm text-slate-600">{prop.district}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50 p-2 rounded-lg">
                      <div>
                        <p className="text-[10px] text-slate-500">سعر المتر</p>
                        <p className="font-semibold text-sm text-slate-900">
                          {prop.pricePerM}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">المساحة</p>
                        <p className="font-semibold text-sm text-slate-900">
                          {prop.area} م²
                        </p>
                      </div>
                    </div>

                    <Link
                    to={`/details/${prop.id}`}
                    className="block w-full text-center bg-brand-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
                    
                      عرض التفاصيل
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Floating Filter Button (Desktop) */}
        <button
          onClick={() => setShowFilters(true)}
          className="hidden md:flex absolute bottom-8 right-8 z-10 bg-white shadow-lg border border-slate-100 px-4 py-3 rounded-xl items-center gap-2 text-slate-700 hover:text-brand-600 hover:border-brand-200 transition-all font-semibold">
          
          <Filter size={20} />
          <span>تصفية النتائج</span>
        </button>

        {/* Filter Drawer / Modal */}
        <AnimatePresence>
          {showFilters &&
          <>
              <motion.div
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-20" />
            
              <motion.div
              initial={{
                x: '100%'
              }}
              animate={{
                x: 0
              }}
              exit={{
                x: '100%'
              }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200
              }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-30 flex flex-col">
              
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="font-bold text-lg text-slate-900">
                    تصفية النتائج
                  </h2>
                  <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">
                  
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      المدينة
                    </label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
                      <option>الرياض</option>
                      <option>جدة</option>
                      <option>الدمام</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      نوع العقار
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['الكل', 'سكني', 'تجاري', 'أرض'].map((type, i) =>
                    <button
                      key={type}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
                      
                          {type}
                        </button>
                    )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                      نطاق السعر (ر.س)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                      type="text"
                      placeholder="من"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-center" />
                    
                      <span className="text-slate-400">-</span>
                      <input
                      type="text"
                      placeholder="إلى"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-center" />
                    
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                  <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl shadow-sm hover:bg-brand-700 transition-colors">
                  
                    تطبيق الفلاتر
                  </button>
                </div>
              </motion.div>
            </>
          }
        </AnimatePresence>
      </div>
    </DashboardLayout>);

}
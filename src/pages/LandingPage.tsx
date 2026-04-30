import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Search,
  MapPin,
  Home,
  Maximize2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

// هاردكود لبعض الأحياء كـ Fallback في حال فشل الـ API أو التأخر في التحميل
const DEFAULT_NEIGHBORHOODS = [
  "الياقوت", "الرياض", "أبحر الشمالية", "الحمدانية", "جوهرة العروس", 
  "المنار", "الزهراء", "السلامة", "المحمدية", "البساتين", "السامر", "النعيم"
];

const DEFAULT_TYPES = ["قطعة أرض", "شقة"];

export function LandingPage() {
  const [neighborhoods, setNeighborhoods] = useState<string[]>(DEFAULT_NEIGHBORHOODS);
  const [propertyTypes, setPropertyTypes] = useState<string[]>(DEFAULT_TYPES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Form State
  const [form, setForm] = useState({
    neighborhood: '',
    property_type: '',
    area: ''
  });

  // Result State
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [nRes, tRes, sRes] = await Promise.all([
        fetch(`${API_BASE_URL}/neighborhoods`),
        fetch(`${API_BASE_URL}/property-types`),
        fetch(`${API_BASE_URL}/market-stats`)
      ]);

      const nData = await nRes.json();
      const tData = await tRes.json();
      const sData = await sRes.json();

      if (nData.neighborhoods && nData.neighborhoods.length > 0) {
        setNeighborhoods(nData.neighborhoods);
      }
      if (tData.property_types && tData.property_types.length > 0) {
        setPropertyTypes(tData.property_types);
      }
      setStats(sData);
    } catch (err) {
      console.error('Failed to fetch data from API, using defaults', err);
    }
  };

  const handleValuate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.neighborhood || !form.property_type || !form.area) {
      setError('يرجى إكمال جميع الحقول');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/valuate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          neighborhood: form.neighborhood,
          property_type: form.property_type,
          area: parseFloat(form.area)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'حدث خطأ في التقييم');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-cairo text-right" dir="rtl">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-600/20">
                <BarChart3 size={24} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                مؤشر <span className="text-brand-600 text-sm font-bold uppercase tracking-widest bg-brand-50 px-2 py-1 rounded-lg mr-2">AI</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="hidden md:block text-slate-500 font-medium text-sm">
                المحرك العقاري الأذكى في جدة
              </span>
              <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
              <div className="flex items-center gap-2 text-brand-600 font-bold">
                <ShieldCheck size={20} />
                <span className="text-sm">بيانات موثوقة</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Right Side: Title & Info */}
            <div className="lg:col-span-5 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-bold mb-6 border border-brand-100">
                  <TrendingUp size={16} />
                  <span>متاح الآن لمدينة جدة</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.2] mb-6">
                  قيّم عقارك <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-600 to-brand-400">
                    بذكاء اصطناعي دقيق
                  </span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                  أدخل بيانات العقار واحصل على تقييم فوري بناءً على آخر صفقات السوق في جدة، مع توقعات سعرية للسنة القادمة بنسبة دقة عالية.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-3xl font-black text-brand-600 mb-1">
                      {stats ? `${(stats.total_transactions / 1000).toFixed(1)}k+` : '...'}
                    </div>
                    <div className="text-sm text-slate-500 font-bold">صفقة عقارية</div>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-3xl font-black text-brand-600 mb-1">
                      {stats ? stats.total_neighborhoods : '...'}
                    </div>
                    <div className="text-sm text-slate-500 font-bold">حي مدعوم</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Left Side: Tool */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 opacity-50" />
                
                <form onSubmit={handleValuate} className="space-y-6 relative z-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Neighborhood Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 mr-2">الحي في جدة</label>
                      <div className="relative group">
                        <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                        <select
                          value={form.neighborhood}
                          onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                          className="w-full bg-slate-50 border-2 border-slate-100 focus:border-brand-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 text-slate-900 font-bold appearance-none outline-none transition-all cursor-pointer"
                        >
                          <option value="">اختر الحي...</option>
                          {neighborhoods.map((n) => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                      </div>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-black text-slate-700 mr-2">نوع العقار</label>
                      <div className="relative group">
                        <Home className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                        <select
                          value={form.property_type}
                          onChange={(e) => setForm({ ...form, property_type: e.target.value })}
                          className="w-full bg-slate-50 border-2 border-slate-100 focus:border-brand-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 text-slate-900 font-bold appearance-none outline-none transition-all cursor-pointer"
                        >
                          <option value="">اختر النوع...</option>
                          {propertyTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Area Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 mr-2">المساحة (متر مربع)</label>
                    <div className="relative group">
                      <Maximize2 className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                      <input
                        type="number"
                        placeholder="مثال: 500"
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-100 focus:border-brand-500 focus:bg-white rounded-2xl py-4 pr-12 pl-4 text-slate-900 font-bold outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 hover:bg-brand-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl hover:shadow-brand-600/30 flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <span>احسب القيمة الآن</span>
                        <ArrowRight size={22} className="group-hover:-translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-bold border border-red-100"
                      >
                        <AlertCircle size={20} />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                {/* Results Section */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 pt-12 border-t border-slate-100 grid md:grid-cols-2 gap-8"
                    >
                      <div className="space-y-6">
                        <div>
                          <div className="text-slate-500 font-bold text-sm mb-1">السعر التقديري الحالي</div>
                          <div className="text-5xl font-black text-slate-900">
                            {result.total_current_price.toLocaleString()} <span className="text-xl text-brand-600">ر.س</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-10">
                          <div>
                            <div className="text-slate-500 font-bold text-xs mb-1">سعر المتر</div>
                            <div className="text-xl font-black text-slate-800">{result.current_price_per_meter.toLocaleString()} ر.س</div>
                          </div>
                          <div>
                            <div className="text-slate-500 font-bold text-xs mb-1">درجة الثقة</div>
                            <div className={`text-xl font-black ${result.confidence === 'عالية جداً' ? 'text-green-600' : 'text-amber-500'}`}>
                              {result.confidence}
                            </div>
                          </div>
                          <div className="border-r border-slate-100 pr-10">
                            <div className="text-slate-500 font-bold text-xs mb-1">نطاق سعر الحي</div>
                            <div className="text-md font-black text-slate-700">
                              {result.market_min_price_per_meter.toLocaleString()} - {result.market_max_price_per_meter.toLocaleString()}
                              <span className="text-xs text-slate-400 mr-1">ر.س</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-brand-600 p-6 rounded-3xl text-white shadow-xl shadow-brand-600/20 flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={20} className="text-brand-200" />
                            <span className="font-black text-sm uppercase tracking-wider opacity-90">توقعات السنة القادمة</span>
                          </div>
                          <div className="text-sm font-bold opacity-80 mb-1">السعر المتوقع (أبريل 2027)</div>
                          <div className="text-3xl font-black mb-2">
                            {result.total_predicted_price_1year.toLocaleString()} ر.س
                          </div>
                          <div className="text-xs font-medium bg-white/20 inline-block px-3 py-1 rounded-full">
                            {stats?.annual_growth_rate > 0 ? 'ارتفاع' : 'تذبذب'} متوقع بنسبة {(((result.total_predicted_price_1year - result.total_current_price) / result.total_current_price) * 100).toFixed(1)}% لعام 2027
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <BarChart3 size={18} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">مؤشر</span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-2">
            منصة "مؤشر" تعتمد على نماذج تعلم آلي متطورة. النتائج هي تقديرات استرشادية ولا تغني عن المثمن العقاري المعتمد.
          </p>
          <div className="text-slate-400 text-xs">
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة مؤشر
          </div>
        </div>
      </footer>
    </div>
  );
}

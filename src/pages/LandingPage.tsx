import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Map as MapIcon,
  Database,
  TrendingUp,
  CheckCircle2,
  ArrowLeft } from
'lucide-react';
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-cairo">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                <BarChart3 size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                مؤشر
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                
                الرئيسية
              </a>
              <a
                href="#features"
                className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                
                المميزات
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                
                الأسعار
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="hidden sm:block text-slate-600 hover:text-brand-600 font-medium transition-colors">
                
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md">
                
                ابدأ الآن
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
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
                duration: 0.5
              }}>
              
              <span className="inline-block py-1.5 px-4 rounded-full bg-brand-50 text-brand-600 font-semibold text-sm mb-6 border border-brand-100">
                المنصة الأولى للبيانات العقارية
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                منصة البيانات العقارية{' '}
                <span className="text-brand-600">الذكية</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
                اكتشف اتجاهات السوق العقاري، حلل الصفقات، واتخذ قرارات استثمارية
                مبنية على بيانات دقيقة ومحدثة لحظياً.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-brand-600/20 hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5">
                  
                  ابدأ تجربتك المجانية
                  <ArrowLeft size={20} />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm">
                  
                  تسجيل الدخول
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Abstract Dashboard Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.7,
              delay: 0.2
            }}
            className="mt-20 relative max-w-5xl mx-auto">
            
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 h-full w-full bottom-0" />
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
                <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <div className="w-10 h-10 bg-brand-100 rounded-lg mb-4" />
                  <div className="w-24 h-4 bg-slate-200 rounded mb-2" />
                  <div className="w-32 h-6 bg-slate-300 rounded" />
                </div>
                <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg mb-4" />
                  <div className="w-24 h-4 bg-slate-200 rounded mb-2" />
                  <div className="w-32 h-6 bg-slate-300 rounded" />
                </div>
                <div className="h-32 bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg mb-4" />
                  <div className="w-24 h-4 bg-slate-200 rounded mb-2" />
                  <div className="w-32 h-6 bg-slate-300 rounded" />
                </div>
                <div className="md:col-span-2 h-64 bg-slate-50 rounded-xl border border-slate-100" />
                <div className="h-64 bg-slate-50 rounded-xl border border-slate-100" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              كل ما تحتاجه لتحليل السوق العقاري
            </h2>
            <p className="text-lg text-slate-600">
              أدوات متقدمة مصممة خصيصاً للمستثمرين والمهتمين بالقطاع العقاري
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-6">
                <MapIcon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                خريطة تفاعلية
              </h3>
              <p className="text-slate-600 leading-relaxed">
                استعرض الصفقات العقارية على خريطة تفاعلية مع إمكانية التصفية حسب
                الحي، نوع العقار، والسعر.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Database size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                بيانات شاملة
              </h3>
              <p className="text-slate-600 leading-relaxed">
                قاعدة بيانات ضخمة ومحدثة باستمرار تضم تفاصيل الصفقات، الأسعار،
                والمساحات بدقة عالية.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                تحليلات ذكية
              </h3>
              <p className="text-slate-600 leading-relaxed">
                رسوم بيانية ومؤشرات أداء تساعدك على فهم اتجاهات السوق وتوقع
                التغيرات المستقبلية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              خطط تناسب احتياجاتك
            </h2>
            <p className="text-lg text-slate-600">
              اختر الباقة المناسبة للبدء في تحليل السوق العقاري
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                الباقة المجانية
              </h3>
              <p className="text-slate-500 mb-6">
                مثالية للمبتدئين والمهتمين بالسوق
              </p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">٠ ر.س</span>
                <span className="text-slate-500">/ شهر</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 size={20} className="text-brand-500" />
                  <span>الوصول للوحة التحكم الأساسية</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 size={20} className="text-brand-500" />
                  <span>عرض الصفقات على الخريطة (محدود)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 size={20} className="text-brand-500" />
                  <span>بيانات آخر ٣٠ يوم</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-center rounded-xl transition-colors border border-slate-200">
                
                ابدأ مجاناً
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-brand-600 p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10" />
              <div className="relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-brand-500 text-white text-xs font-bold mb-4 border border-brand-400">
                  الأكثر طلباً
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">
                  باقة بريميوم
                </h3>
                <p className="text-brand-100 mb-6">
                  للمستثمرين والمحترفين العقاريين
                </p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">٩٩ ر.س</span>
                  <span className="text-brand-100">/ شهر</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={20} className="text-brand-200" />
                    <span>وصول غير محدود لجميع البيانات</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={20} className="text-brand-200" />
                    <span>تحميل التقارير التفصيلية (PDF/Excel)</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={20} className="text-brand-200" />
                    <span>بيانات تاريخية حتى ٥ سنوات</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 size={20} className="text-brand-200" />
                    <span>تحليلات متقدمة وتوقعات السوق</span>
                  </li>
                </ul>
                <Link
                  to="/register"
                  className="block w-full py-3 px-4 bg-white hover:bg-slate-50 text-brand-600 font-bold text-center rounded-xl transition-colors shadow-md">
                  
                  اشترك الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <BarChart3 size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                مؤشر
              </span>
            </div>
            <div className="text-slate-400 text-sm">
              جميع الحقوق محفوظة © {new Date().getFullYear()} منصة مؤشر
            </div>
          </div>
        </div>
      </footer>
    </div>);

}
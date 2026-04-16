import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { CheckCircle2, X, Lock, Zap } from 'lucide-react';
export function SubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              اختر خطتك
            </h1>
            <p className="text-lg text-slate-500">
              ارتقِ بتحليلاتك العقارية مع ميزات متقدمة تساعدك على اتخاذ قرارات
              استثمارية أفضل.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm relative">
            
            <div className="absolute top-0 right-8 -mt-3.5">
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                خطتك الحالية
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">مجاني</h3>
            <p className="text-slate-500 mb-6">
              الأساسيات للبدء في استكشاف السوق
            </p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-slate-900">٠ ر.س</span>
              <span className="text-slate-500">/ شهر</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span>الوصول للوحة التحكم الأساسية</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span>عرض الصفقات على الخريطة (محدود)</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                <span>بيانات آخر ٣٠ يوم</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <X size={20} className="shrink-0" />
                <span>تحميل التقارير التفصيلية</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <X size={20} className="shrink-0" />
                <span>تاريخ الصفقات (٥ سنوات)</span>
              </li>
            </ul>

            <button className="w-full py-3.5 px-4 bg-slate-50 text-slate-400 font-bold text-center rounded-xl border border-slate-200 cursor-not-allowed">
              مفعل حالياً
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{
              opacity: 0,
              x: -20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              delay: 0.2
            }}
            className="bg-brand-600 p-8 rounded-3xl shadow-xl relative overflow-hidden border-2 border-brand-500">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full -mr-10 -mt-10 blur-xl" />
            <div className="absolute top-0 right-8 -mt-3.5 z-10">
              <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Zap size={12} />
                الأكثر طلباً
              </span>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">بريميوم</h3>
              <p className="text-brand-100 mb-6">
                للمستثمرين والمحترفين العقاريين
              </p>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">٩٩ ر.س</span>
                <span className="text-brand-100">/ شهر</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={20} className="text-brand-200 shrink-0" />
                  <span>وصول غير محدود لجميع البيانات</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={20} className="text-brand-200 shrink-0" />
                  <span>عرض الصفقات على الخريطة (غير محدود)</span>
                </li>
                <li className="flex items-center gap-3 text-white">
                  <CheckCircle2 size={20} className="text-brand-200 shrink-0" />
                  <span>بيانات تاريخية حتى ٥ سنوات</span>
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 size={20} className="text-brand-200 shrink-0" />
                  <span>تحميل التقارير التفصيلية (PDF/Excel)</span>
                </li>
                <li className="flex items-center gap-3 text-white font-medium">
                  <CheckCircle2 size={20} className="text-brand-200 shrink-0" />
                  <span>تحليلات متقدمة وتوقعات السوق</span>
                </li>
              </ul>

              <button className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-brand-600 font-bold text-center rounded-xl transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                ترقية الآن
              </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Comparison Table (Desktop mostly) */}
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
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hidden md:block">
          
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">
              مقارنة الميزات التفصيلية
            </h3>
          </div>
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 px-6 font-medium text-slate-500 w-1/2">
                  الميزة
                </th>
                <th className="py-4 px-6 font-bold text-slate-900 text-center w-1/4">
                  مجاني
                </th>
                <th className="py-4 px-6 font-bold text-brand-600 text-center w-1/4">
                  بريميوم
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
              {
                name: 'تحديث البيانات',
                free: 'يومي',
                premium: 'لحظي'
              },
              {
                name: 'تصدير البيانات',
                free: false,
                premium: true
              },
              {
                name: 'تحليل الأحياء المتقدم',
                free: false,
                premium: true
              },
              {
                name: 'تنبيهات الأسعار',
                free: false,
                premium: true
              },
              {
                name: 'دعم فني',
                free: 'عبر البريد',
                premium: 'أولوية 24/7'
              }].
              map((feature, i) =>
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-medium">
                    {feature.name}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {typeof feature.free === 'boolean' ?
                  feature.free ?
                  <CheckCircle2
                    size={20}
                    className="text-emerald-500 mx-auto" /> :


                  <Lock size={18} className="text-slate-300 mx-auto" /> :


                  <span className="text-slate-600 text-sm">
                        {feature.free}
                      </span>
                  }
                  </td>
                  <td className="py-4 px-6 text-center">
                    {typeof feature.premium === 'boolean' ?
                  feature.premium ?
                  <CheckCircle2
                    size={20}
                    className="text-brand-500 mx-auto" /> :


                  <Lock size={18} className="text-slate-300 mx-auto" /> :


                  <span className="text-brand-600 font-bold text-sm">
                        {feature.premium}
                      </span>
                  }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </div>
    </DashboardLayout>);

}
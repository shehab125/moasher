import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { User, Mail, Shield, CreditCard, LogOut, Loader2, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: profile.full_name })
        .eq('id', profile.id);

      if (error) throw error;
      alert('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('حدث خطأ أثناء التحديث');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="animate-spin text-brand-600" size={48} />
          <p className="text-slate-500 font-bold">جاري تحميل الملف الشخصي...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">الملف الشخصي</h1>
          <p className="text-slate-500 text-sm">إدارة حسابك وتفضيلاتك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-brand-600" />
                المعلومات الشخصية
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-10 py-2.5 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    حفظ التغييرات
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 text-red-600">
                <Shield size={20} />
                منطقة الأمان
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                يمكنك تسجيل الخروج من حسابك الحالي أو تصفير كلمة المرور.
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
                تسجيل الخروج
              </button>
            </motion.div>
          </div>

          {/* Subscription Card */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-brand-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-10 -mt-10" />
              <CreditCard className="mb-4 text-brand-200" size={32} />
              <h3 className="text-lg font-bold mb-1">باقة الاشتراك</h3>
              <p className="text-brand-100 text-sm mb-6">أنت حالياً على الباقة:</p>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-6">
                <span className="text-2xl font-bold capitalize">
                  {profile?.subscription_plan === 'free' ? 'المجانية' : 'المميزة'}
                </span>
              </div>
              <button
                onClick={() => navigate('/subscription')}
                className="w-full py-3 bg-white text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-md"
              >
                {profile?.subscription_plan === 'free' ? 'ترقية الحساب' : 'إدارة الاشتراك'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { TablePage } from './pages/TablePage';
import { DetailsPage } from './pages/DetailsPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { ProfilePage } from './pages/ProfilePage';
import { supabase } from './lib/supabase';

export function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/map" replace /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/map" replace /> : <RegisterPage />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={session ? <DashboardPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/map" 
          element={session ? <MapPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/table" 
          element={session ? <TablePage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/details/:id" 
          element={session ? <DetailsPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/subscription" 
          element={session ? <SubscriptionPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={session ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
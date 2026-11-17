import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Heart, LayoutDashboard, Upload, Activity, Clock, LogOut, Loader2 } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { useApp } from '../context/AppContext';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setSelectedMemberId } = useApp();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setIsLoggingOut(false);
    }
  }, [location.pathname]);

  if (location.pathname === "/") return <>{children}</>;

  const handleLogout = () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    window.setTimeout(() => {
      setSelectedMemberId('primary');
      dispatch(logout());
      navigate('/', { replace: true });
    }, 1500);
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Add Vitals', href: '/vitals', icon: Activity },
    { name: 'Timeline', href: '/timeline', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2 text-teal-600 font-bold text-xl tracking-tight">
                <Heart className="h-6 w-6 fill-current text-teal-500 animate-pulse" />
                <span>HealthMate <span className="text-xs text-slate-400 font-normal">Smarter Sehat</span></span>
              </Link>
            </div>
            <div className="flex space-x-1 sm:space-x-4 items-center">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-teal-50 text-teal-600 shadow-sm border border-teal-100' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                aria-busy={isLoggingOut}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-wait disabled:opacity-70 transition-all duration-200"
              >
                {isLoggingOut
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <LogOut className="h-4 w-4" />}
                <span className="hidden md:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 mt-12 text-center text-xs text-slate-400">
        <p className="font-medium text-amber-600">⚠️ Disclaimer: AI is for understanding only, not for medical advice.</p>
        <p className="mt-1">Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi. </p>
      </footer>
    </div>
  );
}
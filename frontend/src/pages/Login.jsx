import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, registerUser } from '../features/auth/authThunk';
import { _isLogin } from '../features/auth/authSlice';

export default function Login() {
  // const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { isLogin, loading } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // navigate('/dashboard');

    if (!isLogin) {
      const newUser = { name, email, password }
      dispatch(registerUser(newUser))
        .unwrap()
        .then((payload) => {
          alert(payload.message || "Registration successful. Please sign in.");
          setName("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          alert(error || "Failed to register");
        });
    } else {
      // dispatch(loginUser({ email, password }))
      dispatch(loginUser({ email, password }))
        .unwrap() // Extracts the payload on success, or throws an error on failure
        .then((payload) => {
          // This block runs ONLY if loginUser.fulfilled happens
          alert(payload.message || "Login successful!");
          navigate("/dashboard"); // 4. Redirect the user here
        })
        .catch((error) => {
          // This block runs if loginUser.rejected happens
          alert(error || "Failed to log in");
        });

      setName("");
      setEmail("");
      setPassword("");
    }


  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-teal-950 to-emerald-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_45%)]" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10"
      >
        <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-4 shadow-xl">
          <Heart className="h-10 w-10 text-emerald-400 fill-emerald-400/20" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">HealthMate</h2>
        <p className="mt-2 text-sm text-emerald-200/70">Health ka Smart Dost [cite: 1]</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10"
      >
        <div className="bg-white/95 backdrop-blur-md py-8 px-4 shadow-2xl rounded-3xl sm:px-10 border border-white/50">
          <div className="flex border-b border-slate-200 mb-6 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => dispatch(_isLogin(true))}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Login
            </button>
            <button
              onClick={() => dispatch(_isLogin(false))}
              className={`w-1/2 py-2 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Register
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                <input type="text" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" placeholder="Muhammad usama" onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
              <input type="email" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" placeholder="you@domain.com" onChange={e => setEmail(e.target.value)}  value={email}/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Password</label>
              <input type="password" required className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" placeholder="••••••••" onChange={e => setPassword(e.target.value)} value={password}/>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-semibold text-white transition-all
    ${loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 hover:-translate-y-0.5"
                }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>

                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-2 text-xs text-slate-400 border-t border-slate-100 pt-4">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
              <span>Secure cloud encryption enabled </span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span>Powered by Gemini 1.5 Multimodal</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
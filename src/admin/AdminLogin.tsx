import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';
import { ProductPilotLogo, ProductPilotIcon } from '../components/brand/ProductPilotLogo';

interface AdminLoginProps {
  onReturnToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onReturnToSite }) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed');
      }
    } catch {
      setErrorMsg('A network error occurred. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 sm:p-6 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Return to website floating link */}
      <button
        onClick={onReturnToSite}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Public Website</span>
      </button>

      {/* Card Container */}
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl space-y-6 ring-1 ring-white/10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <ProductPilotIcon size="xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white font-sans">
              Product<span className="text-blue-500">Pilot</span> CMS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Commercial Enterprise Content & Affiliate Manager
            </p>
          </div>
        </div>



        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/60 p-3.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@productpilot.com"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Master Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-blue-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-blue-900/40 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating Authority...</span>
              </>
            ) : (
              <>
                <span>Sign In to ProductPilot CMS</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800">
          <span>Protected by AES-256 encryption. Unauthorized access attempts are monitored and IP-logged.</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Password Recovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For security, administrator password resets must be executed directly via server environment secrets (`ADMIN_MASTER_KEY`) or through your cloud infrastructure console.
            </p>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

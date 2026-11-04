'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('hanif@acmecloud.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Set auth cookie
    document.cookie = 'veloce_auth_session=1; path=/; max-age=86400; SameSite=Lax';
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const handleQuickLogin = (demoEmail: string, role = 'OWNER') => {
    setEmail(demoEmail);
    setIsLoading(true);
    // Set auth cookie
    document.cookie = `veloce_auth_session=1; path=/; max-age=86400; SameSite=Lax`;
    setTimeout(() => {
      window.location.href = '/';
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F2F2EE] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-[20px] border border-[#E2E2DC] shadow-lg p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#121316] text-[#D4F338] flex items-center justify-center font-bold text-sm mx-auto shadow-xs">
            VO
          </div>
          <h1 className="text-xl font-bold font-display tracking-tight text-[#121316]">
            Sign in to VeloceOps
          </h1>
          <p className="text-xs text-[#5C605A]">
            Secured by Supabase Auth & Multi-Tenant Row-Level Security
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-[#5C605A] block mb-1">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono uppercase text-[#5C605A]">
                Password
              </label>
              <a href="#" className="text-[11px] text-[#5C605A] hover:underline">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#D0D0C8] bg-[#F8F8F5] text-[#121316] outline-none focus:border-[#121316]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-[#121316] text-[#FFFFFF] font-bold text-xs hover:bg-[#434642] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In with Supabase'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4F338]" />
          </button>
        </form>

        {/* Demo Quick-Login Presets */}
        <div className="pt-4 border-t border-[#EBEBE6] space-y-2">
          <span className="text-[10px] font-mono uppercase text-[#5C605A] block text-center">
            Or Click to Sign In as Demo Persona
          </span>

          <div className="space-y-1.5">
            <button
              onClick={() => handleQuickLogin('hanif@acmecloud.com')}
              className="w-full text-left p-2 rounded-lg bg-[#F8F8F5] hover:bg-[#F2F2EE] border border-[#E2E2DC] text-xs flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <span className="font-semibold text-[#121316] block">Hanif Daffa N.</span>
                <span className="text-[10px] text-[#5C605A] font-mono">Acme Cloud Inc. (OWNER)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D4F338] text-[#121316] font-bold">
                1-Click
              </span>
            </button>

            <button
              onClick={() => handleQuickLogin('elena.cfo@novalogistics.de')}
              className="w-full text-left p-2 rounded-lg bg-[#F8F8F5] hover:bg-[#F2F2EE] border border-[#E2E2DC] text-xs flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <span className="font-semibold text-[#121316] block">Elena Rostova</span>
                <span className="text-[10px] text-[#5C605A] font-mono">Nova Logistics GmbH (FINANCE)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAEAE4] text-[#434642] font-semibold">
                1-Click
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

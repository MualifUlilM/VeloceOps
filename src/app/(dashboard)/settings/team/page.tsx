'use client';

import { AppFrame } from '@/components/layout/app-frame';
import { Users2, Shield, Plus, Check } from 'lucide-react';

export default function TeamSettingsPage() {
  const members = [
    {
      name: 'Hanif Daffa N.',
      email: 'hanif@acmecloud.com',
      role: 'OWNER',
      status: 'Active',
      twoFactor: true,
    },
    {
      name: 'Elena Rostova',
      email: 'elena.cfo@acmecloud.com',
      role: 'FINANCE',
      status: 'Active',
      twoFactor: true,
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.v@acmecloud.com',
      role: 'VIEWER',
      status: 'Active',
      twoFactor: false,
    },
  ];

  return (
    <AppFrame
      title="Team & Role-Based Access Control (RBAC)"
      subtitle="Manage tenant organization members and cryptographic role permissions."
      renderCanvasContent={({ currentTenant }) => {
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#121316] font-display">
                  Organization Members ({currentTenant.name})
                </h2>
                <p className="text-xs text-[#5C605A] mt-0.5">
                  Permissions enforced at the PostgreSQL row level via JWT claim verification.
                </p>
              </div>

              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D4F338] text-[#121316] border border-[#B5D618] hover:bg-[#C5E627]">
                <Plus className="w-3.5 h-3.5" />
                <span>Invite Teammate</span>
              </button>
            </div>

            <div className="border border-[#EBEBE6] rounded-xl overflow-hidden bg-[#FFFFFF]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F8F5] border-b border-[#EBEBE6] font-mono text-[11px] uppercase tracking-wider text-[#5C605A]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">User</th>
                    <th className="py-3 px-4 font-semibold">Role</th>
                    <th className="py-3 px-4 font-semibold">2FA Enforced</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEBE6]">
                  {members.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#F8F8F5]/80 bg-[#FFFFFF]">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#121316]">{m.name}</div>
                        <div className="text-[11px] font-mono text-[#5C605A]">{m.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-[#121316] bg-[#F2F2EE] px-2 py-0.5 rounded">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {m.twoFactor ? (
                          <span className="text-[#0B6B41] font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Hardware YubiKey / TOTP
                          </span>
                        ) : (
                          <span className="text-[#8C4608]">Optional</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0B6B41] font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B41]"></span>
                          <span>{m.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }}
    />
  );
}

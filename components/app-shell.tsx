'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Brain, ClipboardList, LayoutDashboard, Library, Menu, Settings, Users, X, QrCode, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const links = [
  ['/', 'Overview', LayoutDashboard],
  ['/catalogue', 'Book Catalogue', Library],
  ['/learning', 'Learning Centre', Brain],
  ['/librarian', 'Librarian Desk', ClipboardList],
  ['/learner', 'Learner Portal', Users],
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-slate-50 text-slate-950">
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between"><Link href="/" className="flex items-center gap-3 font-black"><span className="rounded-xl bg-blue-600 p-2 text-white"><BookOpen size={20}/></span><span>AMG FOUNDATION</span></Link><button className="lg:hidden" onClick={()=>setOpen(false)} aria-label="Close menu"><X/></button></div>
      <p className="mb-7 mt-2 pl-12 text-xs text-slate-400">Community Library</p>
      <nav className="space-y-1">{links.map(([href,label,Icon]) => <Link key={href as string} href={href as string} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${pathname===href ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><Icon size={19}/>{label as string}</Link>)}</nav>
      <div className="mt-8 border-t pt-6"><p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Management</p><Side href="/analytics" label="Analytics" Icon={BarChart3}/><Side href="/qr" label="QR Scanner" Icon={QrCode}/><Side href="/settings" label="Settings" Icon={Settings}/></div>
      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-slate-900 p-4 text-white"><p className="text-xs text-slate-300">Library status</p><div className="mt-2 flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-emerald-400"/>Open today</div></div>
    </aside>
    {open && <button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur"><button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu/></button><div className="hidden text-sm font-semibold text-slate-500 sm:block">AMG FOUNDATION Community Library</div><div className="flex items-center gap-3"><span className="hidden text-right sm:block"><b className="block text-sm">Library Admin</b><small className="text-slate-400">Librarian</small></span><div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">A</div></div></header><main>{children}</main></div>
  </div>
}
function Side({href,label,Icon}:{href:string;label:string;Icon:React.ComponentType<{size?:number}>}) { return <Link href={href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"><Icon size={19}/>{label}</Link> }

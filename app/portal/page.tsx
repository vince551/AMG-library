'use client';

import Link from 'next/link';
import { BookOpen, GraduationCap, Library, LogIn, ShieldCheck, Users } from 'lucide-react';

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><div className="flex items-center gap-3 font-black"><div className="rounded-xl bg-blue-600 p-2 text-white"><BookOpen /></div> AMG FOUNDATION Community Library</div><Link href="/learner/login" className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white">Learner Sign In</Link></div></header>
      <section className="mx-auto max-w-7xl px-6 py-20 text-center"><span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">WELCOME TO THE COMMUNITY LIBRARY</span><h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Read. Learn. <span className="text-blue-600">Grow.</span></h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">Discover books, learning resources, quizzes and study tools. Learners can create an account and manage their own library experience.</p><div className="mt-9 flex justify-center gap-3"><Link href="/learner/login" className="rounded-xl bg-blue-600 px-7 py-3 font-bold text-white">Sign in to my library</Link><Link href="/learner/register" className="rounded-xl border bg-white px-7 py-3 font-bold">Create account</Link></div></section>
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-20 md:grid-cols-3"><Feature icon={<GraduationCap />} title="Learner Portal" text="Borrow books, track due dates, save resources, take quizzes and build reading achievements."/><Feature icon={<Library />} title="Explore the Library" text="Search the catalogue, discover resources and find books by subject, form, topic and category."/><Feature icon={<Users />} title="Community Learning" text="Access notes, past papers, study tools and educational activities in one place."/></section>
      <section className="border-t bg-slate-900 px-6 py-14 text-white"><div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-300">Library staff</p><h2 className="mt-2 text-3xl font-black">Librarian Desk</h2><p className="mt-2 max-w-xl text-slate-300">Secure staff area for learner check-in/check-out, attendance and library operations.</p></div><Link href="/librarian/login" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900"><ShieldCheck size={20}/> Librarian Sign In</Link></div></section>
    </main>
  );
}
function Feature({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <article className="rounded-2xl border bg-white p-7 shadow-sm"><div className="w-fit rounded-xl bg-blue-50 p-3 text-blue-600">{icon}</div><h2 className="mt-5 text-xl font-black">{title}</h2><p className="mt-2 leading-7 text-slate-500">{text}</p></article>; }

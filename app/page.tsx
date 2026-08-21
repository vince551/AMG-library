import { BookOpen, Brain, Library, Search, Users } from 'lucide-react';

const features = [
  ['Library Management', 'Books, borrowers, returns, inventory and overdue tracking.', Library],
  ['Learning Centre', 'Notes, past papers, quizzes, study tools and digital resources.', Brain],
  ['Smart Search', 'Find books and learning resources by subject, form, topic or type.', Search],
  ['Community', 'Connect learners, teachers, parents and librarians around learning.', Users],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3 font-bold">
          <div className="rounded-xl bg-blue-600 p-2 text-white"><BookOpen size={22} /></div>
          <span>AMG FOUNDATION</span>
        </div>
        <div className="hidden gap-6 text-sm md:flex"><a href="#library">Library</a><a href="#learning">Learning</a><a href="#about">About</a></div>
        <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">Sign in</button>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:items-center">
        <div>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">SMART LIBRARY & LEARNING HUB</span>
          <h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">A library built for <span className="text-blue-600">learning.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">AMG FOUNDATION Community Library brings library management and digital learning together—helping librarians work smarter and learners discover more.</p>
          <div className="mt-8 flex flex-wrap gap-3"><button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">Explore Library</button><button className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold">Learning Centre</button></div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
          <div className="mb-6 flex items-center justify-between"><span className="font-semibold">Library Overview</span><span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs text-emerald-300">Live</span></div>
          <div className="grid grid-cols-2 gap-4"><Stat label="Books" value="1,248" /><Stat label="Learners" value="327" /><Stat label="Available" value="1,164" /><Stat label="Overdue" value="12" /></div>
        </div>
      </section>

      <section id="library" className="mx-auto max-w-7xl px-6 py-20"><div className="grid gap-5 md:grid-cols-4">{features.map(([title, text, Icon]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><Icon className="text-blue-600" size={26} /><h2 className="mt-5 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}</div></section>

      <section id="learning" className="bg-white px-6 py-20"><div className="mx-auto max-w-7xl"><h2 className="text-3xl font-black">Everything learners need to keep growing.</h2><p className="mt-3 max-w-2xl text-slate-500">Study smarter with structured resources, interactive quizzes, reading tools and a future AI learning assistant.</p></div></section>
      <footer id="about" className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500">© {new Date().getFullYear()} AMG FOUNDATION Community Library</footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-white/10 p-5"><div className="text-3xl font-black">{value}</div><div className="mt-1 text-sm text-slate-300">{label}</div></div>;
}

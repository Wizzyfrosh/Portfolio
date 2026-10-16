import { Braces, Code2, GitBranch, Terminal, Workflow } from "lucide-react";

/** Decorative desktop-only artwork. No code execution or claimed live telemetry. */
export default function DeveloperVisual() {
  return (
    <div aria-label="Decorative programming illustration" className="relative isolate hidden min-w-0 self-stretch overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-[0_18px_60px_-35px_rgba(15,23,42,.18)] dark:border-slate-800 dark:bg-slate-900/70 lg:flex lg:flex-col lg:justify-center xl:p-7">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative mb-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-blue-700 dark:text-blue-300"><Code2 size={16}/> Built with code</span>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400"><GitBranch size={13}/> develop</div>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#101827] shadow-xl shadow-slate-950/15">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[.045] px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-rose-400"/><span className="h-2.5 w-2.5 rounded-full bg-amber-400"/><span className="h-2.5 w-2.5 rounded-full bg-emerald-400"/></div>
          <span className="flex items-center gap-2 text-[11px] text-slate-400"><Braces size={13}/> portfolio.tsx</span>
          <Terminal size={14} className="text-slate-500"/>
        </div>
        <div className="overflow-hidden px-3 py-5 font-mono text-[11px] leading-[1.9] text-slate-300 sm:px-5 xl:text-xs">
          <div className="flex gap-4"><span className="select-none text-slate-600">01</span><span><span className="text-violet-300">const</span> <span className="text-sky-300">developer</span> = {"{"}</span></div>
          <div className="flex gap-4"><span className="select-none text-slate-600">02</span><span className="pl-3">focus: <span className="text-emerald-300">&quot;Build great products&quot;</span>,</span></div>
          <div className="flex gap-4"><span className="select-none text-slate-600">03</span><span className="pl-3">skills: [<span className="text-emerald-300">&quot;React&quot;</span>, <span className="text-emerald-300">&quot;Node.js&quot;</span>],</span></div>
          <div className="flex gap-4"><span className="select-none text-slate-600">04</span><span className="pl-3">mindset: <span className="text-emerald-300">&quot;Always learning&quot;</span>,</span></div>
          <div className="flex gap-4"><span className="select-none text-slate-600">05</span><span>{"};"}</span></div>
          <div className="mt-2 flex gap-4"><span className="select-none text-slate-600">06</span><span><span className="text-violet-300">export default</span> developer<span className="animate-pulse text-cyan-300 motion-reduce:animate-none">▋</span></span></div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 bg-white/[.03] px-4 py-2.5 text-[10px] text-slate-500">
          <span>TypeScript · UTF-8</span><span className="text-emerald-400">● Clean build</span>
        </div>
      </div>
      <div className="relative mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-slate-800 dark:text-blue-300"><Code2 size={13}/> Frontend</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-slate-800 dark:text-blue-300"><Workflow size={13}/> Backend</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-slate-800 dark:text-blue-300"><Terminal size={13}/> APIs</span>
      </div>
    </div>
  );
}

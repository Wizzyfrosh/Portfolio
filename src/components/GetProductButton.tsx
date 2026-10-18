"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, ShieldCheck, ArrowUpRight } from "lucide-react";
import BuyTemplateButton from "@/components/BuyTemplateButton";

type Props = {
  id: string;
  title: string;
  productType?: "ebook" | "template";
  priceKobo: number;
  children?: ReactNode;
  className?: string;
  label?: string;
};

export default function GetProductButton({ id, title, productType, priceKobo, children, className, label }: Props) {
  const [open, setOpen] = useState(false);
  const dialogTitleId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const productLabel = productType === "ebook" ? "Ebook" : "Template";

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ) || []);
    const focusTimeout = window.setTimeout(() => {
      dialog.current?.querySelector<HTMLInputElement>('input[type="email"]')?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault(); items[items.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
        e.preventDefault(); items[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimeout);
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button type="button" ref={trigger} className={className ||
        "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"}
        aria-haspopup="dialog" aria-expanded={open}
        onClick={() => setOpen(true)}>
        {children ?? <>{label || `Get ${productLabel}`} <ArrowUpRight size={16} /></>}
      </button>
      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-[3px]"
          onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={dialogTitleId}
            className="relative my-auto w-full max-w-md rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-8">
            <button type="button" aria-label="Close checkout" onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300">
              <X size={18}/>
            </button>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[.17em] text-blue-600">Secure checkout</p>
            <h2 id={dialogTitleId} className="max-w-[90%] text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Get {productLabel}
            </h2>
            <p className="mt-2 break-words font-semibold text-slate-700 dark:text-slate-200">{title}</p>
            <div className="my-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <span className="text-sm text-slate-500 dark:text-slate-300">Current listed price</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">₦{(priceKobo / 100).toLocaleString("en-NG")}</span>
            </div>
            <BuyTemplateButton id={id} buttonLabel="Proceed to Paystack" />
            <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-blue-600" />
              The final amount is retrieved securely from the database before payment. Digital files are released only after payment verification.
            </p>
          </div>
        </div>, document.body
      )}
    </>
  );
}

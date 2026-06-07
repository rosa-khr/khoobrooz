"use client";

import Image from "next/image";
import { Calculator, NotebookPen, NotepadText, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import baleLogo from "@/assets/images/bale-logo.png";
import { contact } from "@/core/lib/site";
import { Button } from "@/shared/components/Button";

type FloatingTool = "notes" | "calculator" | null;
type TradeNote = {
  id: string;
  text: string;
  createdAt: string;
};

const notesStorageKey = "khoobrooz.trade.notes";
const numberButtons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "="];
const operatorButtons = [
  { label: "÷", value: "/" },
  { label: "×", value: "*" },
  { label: "−", value: "-" },
  { label: "+", value: "+" }
];

function formatNoteDate(value: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function calculate(stored: string, current: string, operator: string | null) {
  const first = Number(stored);
  const second = Number(current);

  if (!operator || Number.isNaN(first) || Number.isNaN(second)) {
    return current;
  }

  switch (operator) {
    case "+":
      return String(first + second);
    case "-":
      return String(first - second);
    case "*":
      return String(first * second);
    case "/":
      return second === 0 ? "0" : String(first / second);
    default:
      return current;
  }
}

export function FloatingCta() {
  const [activeTool, setActiveTool] = useState<FloatingTool>(null);
  const [notes, setNotes] = useState<TradeNote[]>([]);
  const [draftNote, setDraftNote] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [calculatorDisplay, setCalculatorDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState("");
  const [operator, setOperator] = useState<string | null>(null);
  const [resetDisplay, setResetDisplay] = useState(false);

  useEffect(() => {
    try {
      const savedNotes = window.localStorage.getItem(notesStorageKey);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes) as TradeNote[]);
      }
    } catch {
      setNotes([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(notesStorageKey, JSON.stringify(notes));
    }
  }, [hydrated, notes]);

  const orderedNotes = useMemo(() => [...notes].sort((first, second) => second.createdAt.localeCompare(first.createdAt)), [notes]);

  const saveNote = () => {
    const text = draftNote.trim();
    if (!text) {
      return;
    }

    setNotes((items) => [
      {
        id: crypto.randomUUID(),
        text,
        createdAt: new Date().toISOString()
      },
      ...items
    ]);
    setDraftNote("");
  };

  const handleNumber = (value: string) => {
    if (value === "=") {
      const result = calculate(storedValue, calculatorDisplay, operator);
      setCalculatorDisplay(result);
      setStoredValue("");
      setOperator(null);
      setResetDisplay(true);
      return;
    }

    setCalculatorDisplay((current) => {
      if (resetDisplay) {
        setResetDisplay(false);
        return value === "." ? "0." : value;
      }

      if (value === "." && current.includes(".")) {
        return current;
      }

      if (current === "0" && value !== ".") {
        return value;
      }

      return `${current}${value}`;
    });
  };

  const handleOperator = (nextOperator: string) => {
    if (operator && storedValue) {
      setStoredValue(calculate(storedValue, calculatorDisplay, operator));
    } else {
      setStoredValue(calculatorDisplay);
    }

    setOperator(nextOperator);
    setResetDisplay(true);
  };

  const clearCalculator = () => {
    setCalculatorDisplay("0");
    setStoredValue("");
    setOperator(null);
    setResetDisplay(false);
  };

  return (
    <>
      {activeTool && (
        <div className="fixed inset-x-4 bottom-[14.5rem] z-50 max-h-[calc(100vh-16.5rem)] overflow-y-auto sm:inset-x-auto sm:bottom-6 sm:left-[4.5rem] sm:w-[320px] sm:max-h-[calc(100vh-3rem)]">
          <div className="overflow-hidden rounded-khoobrooz border border-white/65 bg-[#fff8e9]/94 text-primary shadow-[0_18px_42px_rgba(11,31,58,0.14)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#f4b23e]/35 bg-primary px-3 py-2 text-white">
              <strong className="inline-flex items-center gap-2 text-sm font-black">
                {activeTool === "notes" ? <NotebookPen className="size-4 text-accent" aria-hidden="true" /> : <Calculator className="size-4 text-accent" aria-hidden="true" />}
                {activeTool === "notes" ? "یادداشت تجارت" : "ماشین‌حساب سریع"}
              </strong>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-[4px] text-white/75 transition hover:bg-white/10 hover:text-white"
                aria-label="بستن ابزار"
                onClick={() => setActiveTool(null)}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {activeTool === "notes" && (
              <div className="relative overflow-hidden bg-[#fff8e9]/96 p-3.5 backdrop-blur">
                <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(244,178,62,0.08)_1px,transparent_1px)] [background-size:100%_30px]" aria-hidden="true" />
                <div className="relative grid gap-3.5">
                  <div className="grid gap-2">
                    <textarea
                      value={draftNote}
                      onChange={(event) => setDraftNote(event.target.value)}
                      placeholder="یادداشت کوتاه، عدد حواله، شماره بارنامه..."
                      className="min-h-24 resize-none rounded-[6px] border border-[#e1bd5d] bg-[#fff3c8]/88 p-3 text-sm leading-7 text-[#0b1f3a] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] outline-none transition placeholder:text-[#8d6a20]/80 focus:border-accent focus:bg-[#fff8de]"
                    />
                    <button
                      type="button"
                      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[6px] bg-primary px-3 text-xs font-black text-white shadow-[0_8px_18px_rgba(11,31,58,0.12)] transition hover:bg-[#12345f]"
                      onClick={saveNote}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      نوت جدید
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border-t border-[#e1bd5d]/70 pt-3 sm:max-h-56">
                  {orderedNotes.length === 0 ? (
                    <p className="rounded-[6px] border border-[#e1bd5d] bg-[#fff1bd] p-3 text-sm font-black text-[#0b1f3a]">هنوز یادداشتی ثبت نشده.</p>
                  ) : (
                    <div className="grid gap-3">
                      {orderedNotes.map((note) => (
                        <article key={note.id} className="rounded-[6px] border border-[#ddb34d] bg-[#fff1bd] p-3.5 shadow-[0_10px_22px_rgba(141,106,32,0.12)]">
                          <div className="mb-2.5 flex items-center justify-between gap-3">
                            <time className="text-xs font-black text-[#6f5014]">{formatNoteDate(note.createdAt)}</time>
                            <button
                              type="button"
                              className="grid size-6 shrink-0 place-items-center rounded-[4px] bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700"
                              aria-label="حذف یادداشت"
                              onClick={() => setNotes((items) => items.filter((item) => item.id !== note.id))}
                            >
                              <Trash2 className="size-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <p className="whitespace-pre-wrap text-sm font-bold leading-7 text-[#0b1f3a]">{note.text}</p>
                        </article>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            )}

            {activeTool === "calculator" && (
              <div className="grid gap-3 bg-[#fff8e9]/96 p-3.5 text-primary backdrop-blur">
                <div className="min-h-14 overflow-hidden rounded-[6px] border border-[#d9bf7a] bg-[#102a4d] px-3 py-2 text-left font-mono text-3xl font-black leading-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" dir="ltr">
                  {calculatorDisplay}
                </div>
                <div className="grid grid-cols-[1fr_48px] gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    {numberButtons.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`grid min-h-10 place-items-center rounded-[6px] border font-mono text-base font-black tracking-normal transition ${
                          item === "=" ? "border-[#d8931f] bg-accent text-[#09203d] shadow-[0_8px_16px_rgba(244,178,62,0.18)] hover:bg-[#ffd166]" : "border-[#17375f] bg-primary text-white shadow-[0_7px_14px_rgba(11,31,58,0.12)] hover:bg-[#12345f]"
                        }`}
                        onClick={() => handleNumber(item)}
                      >
                        {item}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="col-span-3 grid min-h-9 place-items-center rounded-[6px] border border-[#ead7ae] bg-[#f4ead2] font-mono text-sm font-black text-[#09203d] shadow-[0_7px_14px_rgba(11,31,58,0.06)] transition hover:bg-[#fff3c8]"
                      onClick={clearCalculator}
                    >
                      AC
                    </button>
                  </div>
                  <div className="grid gap-2">
                    {operatorButtons.map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        className="grid min-h-10 place-items-center rounded-[6px] border border-[#d8931f] bg-accent font-mono text-lg font-black text-[#09203d] shadow-[0_8px_16px_rgba(244,178,62,0.18)] transition hover:bg-[#ffd166]"
                        onClick={() => handleOperator(item.value)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-20 left-4 z-50 grid gap-1.5 sm:bottom-6 sm:left-6">
        <button
          type="button"
          aria-label={orderedNotes.length > 0 ? "باز کردن یادداشت‌های موجود" : "باز کردن یادداشت تجارت"}
          title={orderedNotes.length > 0 ? "یادداشت‌های موجود" : "یادداشت"}
          className={`relative grid size-10 place-items-center rounded-full border bg-[#07172b]/82 text-accent/90 shadow-[0_12px_28px_rgba(11,31,58,0.16)] backdrop-blur transition hover:-translate-y-0.5 ${
            activeTool === "notes" ? "border-accent ring-2 ring-accent/25" : "border-white/70"
          }`}
          onClick={() => setActiveTool((value) => (value === "notes" ? null : "notes"))}
        >
          {orderedNotes.length > 0 ? <NotepadText className="size-4" aria-hidden="true" /> : <NotebookPen className="size-4" aria-hidden="true" />}
          {orderedNotes.length > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full border border-primary bg-accent" aria-hidden="true" />}
        </button>
        <button
          type="button"
          aria-label="باز کردن ماشین‌حساب سریع"
          title="ماشین‌حساب"
          className={`grid size-10 place-items-center rounded-full border bg-[#07172b]/82 text-accent/90 shadow-[0_12px_28px_rgba(11,31,58,0.16)] backdrop-blur transition hover:-translate-y-0.5 ${
            activeTool === "calculator" ? "border-accent ring-2 ring-accent/25" : "border-white/70"
          }`}
          onClick={() => setActiveTool((value) => (value === "calculator" ? null : "calculator"))}
        >
          <Calculator className="size-4" aria-hidden="true" />
        </button>
        <a
          href={contact.baleUrl}
          aria-label="ارسال پیام در بله"
          title="بله خوبروز"
          target="_blank"
          rel="noreferrer"
          className="grid size-10 place-items-center overflow-hidden rounded-full border border-white/70 bg-white/86 shadow-[0_12px_28px_rgba(11,31,58,0.16)] backdrop-blur transition hover:-translate-y-0.5"
        >
          <Image src={baleLogo} alt="" width={40} height={40} className="size-full object-cover" />
        </a>
      </div>

      <div className="fixed inset-x-4 bottom-4 z-50 grid grid-cols-2 gap-2 sm:hidden">
        <Button href={contact.generalWhatsappUrl}>واتساپ</Button>
        <Button href={contact.clearancePhoneUrl} variant="secondary">ترخیص</Button>
      </div>
    </>
  );
}

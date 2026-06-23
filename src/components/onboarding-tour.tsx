"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Shield } from "lucide-react";

const STORAGE_KEY = "mms_tour_dismissed";

interface Step {
  target: string;
  title: string;
  body: string;
  position: "bottom" | "top" | "left" | "right";
}

const STEPS: Step[] = [
  {
    target: "[data-tour='sidebar']",
    title: "Portal Navigation",
    body: "Use the sidebar to navigate between your Dashboard, Courses, Certificates, Documents, and more.",
    position: "right",
  },
  {
    target: "[data-tour='courses']",
    title: "Your Courses",
    body: "View all your enrolled courses, track progress, and continue learning right from the Courses page.",
    position: "bottom",
  },
  {
    target: "[data-tour='certificates']",
    title: "Certificates",
    body: "Download your certificates once you complete a course. They are industry-recognized and verifiable online.",
    position: "bottom",
  },
  {
    target: "[data-tour='refer']",
    title: "Refer & Earn",
    body: "Refer fellow students to MMS and earn rewards. Every referral helps build the mining community.",
    position: "right",
  },
  {
    target: "[data-tour='support']",
    title: "Support",
    body: "Need help? Our support team and AI assistant are ready to answer your questions 24/7.",
    position: "right",
  },
  {
    target: "[data-tour='dashboard']",
    title: "Dashboard Overview",
    body: "Your dashboard shows your progress at a glance — active courses, stats, and quick access to everything you need.",
    position: "top",
  },
];

export function OnboardingTour() {
  const [dismissed, setDismissed] = useState(true);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val !== "true") {
      setDismissed(false);
      setTimeout(() => setActive(true), 800);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = document.querySelector(STEPS[step].target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setCoords({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    }
  }, [active, step]);

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }

  function prev() {
    if (step > 0) setStep((s) => s - 1);
  }

  function finish() {
    setActive(false);
    setDismissed(true);
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
  }

  function skip() {
    setActive(false);
    setDismissed(true);
  }

  if (dismissed) return null;

  const s = STEPS[step];
  const overlayZ = 60;
  const tooltipZ = 61;

  return (
    <>
      {/* Semi-transparent overlay */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/60"
          style={{ zIndex: overlayZ }}
          onClick={skip}
        />
      )}

      {/* Highlight box */}
      {active && coords.width > 0 && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl border-2 border-gold shadow-[0_0_0_4px_rgba(217,164,0,0.15)] transition-all duration-300"
          style={{
            top: coords.top - 4,
            left: coords.left - 4,
            width: coords.width + 8,
            height: coords.height + 8,
            zIndex: overlayZ + 1,
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 w-80 rounded-2xl border border-white/10 bg-surface p-5 shadow-2xl"
            style={{ zIndex: tooltipZ }}
          >
            {/* Position tooltip below the target */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: s.position === "bottom" ? -8 : "auto",
                bottom: s.position === "top" ? -8 : "auto",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: s.position === "bottom" ? "8px solid #1A1A1A" : "none",
                borderTop: s.position === "top" ? "8px solid #1A1A1A" : "none",
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gold/20">
                  <Shield className="size-4 text-gold" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {step + 1} of {STEPS.length}
                </span>
              </div>
              <button onClick={skip} className="text-muted-foreground hover:text-off-white">
                <X size={16} />
              </button>
            </div>

            <h3 className="mt-3 font-heading text-base font-bold text-off-white">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
              <label className="flex cursor-pointer items-center gap-1.5 text-[10px] text-muted-foreground hover:text-off-white">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="accent-gold"
                />
                Don&apos;t show next time
              </label>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={prev}
                    className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:border-gold/30 hover:text-gold"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-xs font-bold text-black transition-all hover:bg-gold-light"
                >
                  {step < STEPS.length - 1 ? (
                    <>
                      Next <ChevronRight size={14} />
                    </>
                  ) : (
                    "Done"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

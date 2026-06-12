"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/locales";

type TicketClass = "1AC_EC" | "2AC_FC" | "3AC_CC" | "SL" | "2S";
type TicketStatus = "CNF" | "RAC_WL";
type CancellationTime = "GT_48H" | "48H_12H" | "12H_4H" | "LT_4H" | "AFTER_DEP";
type TatkalType = "NONE" | "CNF_TATKAL" | "WL_TATKAL";

export function RailwayCalculatorClient({ locale }: { locale: Locale }) {
  const [ticketClass, setTicketClass] = useState<TicketClass>("SL");
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>("CNF");
  const [cancellationTime, setCancellationTime] = useState<CancellationTime>("GT_48H");
  const [tatkalType, setTatkalType] = useState<TatkalType>("NONE");
  const [ticketFare, setTicketFare] = useState<number>(300);

  // Helper translations dictionary
  const t = {
    kn: {
      title: "ಭಾರತೀಯ ರೈಲ್ವೆ ಟಿಕೆಟ್ ಮರುಪಾವತಿ ಮತ್ತು ರದ್ದತಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್ 🎫",
      subtitle: "ರದ್ದತಿ ಸಮಯ, ಟಿಕೆಟ್ ವರ್ಗ ಮತ್ತು ಶುಲ್ಕವನ್ನು ಆಧರಿಸಿ ನಿಮ್ಮ ನಿಖರವಾದ ಮರುಪಾವತಿಯನ್ನು ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ.",
      fareLabel: "ಒಟ್ಟು ಟಿಕೆಟ್ ಶುಲ್ಕ (₹):",
      classLabel: "ರೈಲು ಸೌಲಭ್ಯ ವರ್ಗ (Class):",
      statusLabel: "ಟಿಕೆಟ್ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ (Status):",
      timeLabel: "ರದ್ದು ಮಾಡುತ್ತಿರುವ ಸಮಯ (ರೈಲು ಹೊರಡುವ ಮುನ್ನ):",
      tatkalLabel: "ಇದು ತತ್ಕಾಲ್ (Tatkal) ಟಿಕೆಟ್ ಆಗಿದೆಯೇ?",
      calculateBtn: "ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ",
      resultTitle: "ಮರುಪಾವತಿ ವಿವರಗಳು",
      resultRefund: "ನಿಮಗೆ ಸಿಗುವ ಮರುಪಾವತಿ ಮೊತ್ತ:",
      resultDeduction: "ಕಡಿತವಾಗುವ ರದ್ದತಿ ಶುಲ್ಕ (Cancellation Fee):",
      resultDisclaimer: "ಸೂಚನೆ: ಇದು ಅಧಿಕೃತ ಭಾರತೀಯ ರೈಲ್ವೆ ಸಚಿವಾಲಯದ ನಿಯಮಗಳ ಪ್ರಕಾರ ಲೆಕ್ಕಹಾಕಲಾದ ಅಂದಾಜು ಮೊತ್ತವಾಗಿದೆ. ಬ್ಯಾಂಕ್ ಸೇವಾ ಶುಲ್ಕಗಳು ಮತ್ತು GST ಮೊತ್ತವು ಹೆಚ್ಚುವರಿಯಾಗಿ ಅನ್ವಯಿಸಬಹುದು.",
      statusCNF: "ಖಚಿತಪಟ್ಟ ಸೀಟು (Confirmed - CNF)",
      statusRAC_WL: "ಆರ್.ಎ.ಸಿ / ವೇಟ್‌ಲಿಸ್ಟ್ (RAC / WL)",
      timeGT_48H: "೪೮ ಗಂಟೆಗಿಂತ ಮೊದಲು",
      time48H_12H: "೪೮ ಗಂಟೆಯಿಂದ ೧೨ ಗಂಟೆಯ ನಡುವೆ",
      time12H_4H: "೧೨ ಗಂಟೆಯಿಂದ ೪ ಗಂಟೆಯ ನಡುವೆ (ಚಾರ್ಟ್ ತಯಾರಿಕೆಗೆ ಮುನ್ನ)",
      timeLT_4H: "೪ ಗಂಟೆಗಿಂತ ಕಡಿಮೆ (ಚಾರ್ಟ್ ತಯಾರಿಕೆಗೆ ನಂತರ)",
      timeAFTER_DEP: "ರೈಲು ಹೊರಟ ನಂತರ",
      tatkalNo: "ಇಲ್ಲ (ಸಾಮಾನ್ಯ ಕೋಟಾ)",
      tatkalYesCnf: "ಹೌದು, ಕನ್ಫರ್ಮ್ ಆದ ತತ್ಕಾಲ್ ಟಿಕೆಟ್",
      tatkalYesWl: "ಹೌದು, ವೇಟ್‌ಲಿಸ್ಟ್ ತತ್ಕಾಲ್ ಟಿಕೆಟ್",
      actionOnline: "ನೀವು ಇದನ್ನು ಆನ್‌ಲೈನ್ ಮೂಲಕ ನೇರವಾಗಿ ರದ್ದುಗೊಳಿಸಬಹುದು ಮತ್ತು ಸಂಪೂರ್ಣ ಮರುಪಾವತಿ ಪಡೆಯಬಹುದು.",
      actionTDR: "ಚಾರ್ಟ್ ತಯಾರಾದ ಕಾರಣ ಆನ್‌ಲೈನ್ ರದ್ದತಿ ಸಾಧ್ಯವಿಲ್ಲ. ಮರುಪಾವತಿ ಪಡೆಯಲು ಐಆರ್‌ಸಿಟಿಸಿಯಲ್ಲಿ ತಕ್ಷಣವೇ ಟಿಡಿಆರ್ (TDR - Ticket Deposit Receipt) ಸಲ್ಲಿಸಿ.",
      actionNoRefund: "ನಿಯಮಗಳ ಪ್ರಕಾರ ಈ ಟಿಕೆಟ್‌ಗೆ ಯಾವುದೇ ಮರುಪಾವತಿ ಸಿಗುವುದಿಲ್ಲ.",
      actionTatkalNoRefund: "ಖಚಿತಪಟ್ಟ ತತ್ಕಾಲ್ ಟಿಕೆಟ್‌ಗೆ ಯಾವುದೇ ಮರುಪಾವತಿ ಲಭ್ಯವಿರುವುದಿಲ್ಲ (೧೦೦% ಕಡಿತ).",
      actionWLAuto: "ವೇಟ್‌ಲಿಸ್ಟ್ ಇ-ಟಿಕೆಟ್ ಚಾರ್ಟ್ ತಯಾರಿಕೆಯ ನಂತರ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರದ್ದಾಗುತ್ತದೆ ಮತ್ತು ಕೇವಲ ₹೬೦ ಕಡಿತದೊಂದಿಗೆ ಪೂರ್ತಿ ಹಣ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.",
      backLink: "🏛️ ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
      ruleBookTitle: "ಭಾರತೀಯ ರೈಲ್ವೆ ರದ್ದತಿ ಶುಲ್ಕಗಳ ಕೋಷ್ಟಕ (ಕನಿಷ್ಠ ಕಡಿತ)",
      ruleClass: "ವರ್ಗ",
      ruleMinFee: "ಕನಿಷ್ಠ ರದ್ದತಿ ಶುಲ್ಕ (>೪೮ ಗಂಟೆಗಳ ಮೊದಲು)",
      class1AC: "ಎಸಿ ಫಸ್ಟ್ ಕ್ಲಾಸ್ / ಎಕ್ಸಿಕ್ಯೂಟಿವ್",
      class2AC: "ಎಸಿ ೨ ಟೈರ್ / ಫಸ್ಟ್ ಕ್ಲಾಸ್",
      class3AC: "ಎಸಿ ೩ ಟೈರ್ / ಚೇರ್ ಕಾರ್",
      classSL: "ಸ್ಲೀಪರ್ ಕ್ಲಾಸ್ (Sleeper)",
      class2S: "ಸೆಕೆಂಡ್ ಕ್ಲಾಸ್ (Second Seating)",
      helplineTitle: "ರೈಲ್ವೆ ಸಹಾಯವಾಣಿಗಳು 📞"
    },
    en: {
      title: "Indian Railways Ticket Refund & Cancellation Calculator 🎫",
      subtitle: "Calculate your exact refund amount based on cancellation time, ticket class, and fare.",
      fareLabel: "Total Ticket Fare (₹):",
      classLabel: "Ticket Booking Class:",
      statusLabel: "Current Ticket Status:",
      timeLabel: "Time of Cancellation (Before Train Departure):",
      tatkalLabel: "Is this a Tatkal Ticket?",
      calculateBtn: "Calculate Refund",
      resultTitle: "Refund Breakdown",
      resultRefund: "Estimated Refund Amount:",
      resultDeduction: "Cancellation Fee Deduction:",
      resultDisclaimer: "Disclaimer: This calculation is based on current Ministry of Railways tariff rules. Online transaction charges, payment gateway fees, and GST for AC classes may apply separately.",
      statusCNF: "Confirmed Seat (CNF)",
      statusRAC_WL: "RAC / Waitlisted (WL)",
      timeGT_48H: "More than 48 Hours before departure",
      time48H_12H: "Between 48 Hours and 12 Hours",
      time12H_4H: "Between 12 Hours and 4 Hours (Before Chart Prep)",
      timeLT_4H: "Less than 4 Hours (After Chart Prep)",
      timeAFTER_DEP: "After actual departure of train",
      tatkalNo: "No (General Quota)",
      tatkalYesCnf: "Yes, Confirmed Tatkal Ticket",
      tatkalYesWl: "Yes, Waitlisted Tatkal Ticket",
      actionOnline: "You can cancel this ticket online directly to get your refund credited back.",
      actionTDR: "Online cancellation is closed since chart is prepared. File a TDR (Ticket Deposit Receipt) immediately on IRCTC to claim refund.",
      actionNoRefund: "Under standard rules, no refund is admissible for this ticket.",
      actionTatkalNoRefund: "No refund is granted on confirmed Tatkal tickets under any circumstances.",
      actionWLAuto: "Waitlisted e-tickets are automatically cancelled after chart preparation with only ₹60 clerkage charge deducted.",
      backLink: "🏛️ Back to Government Services Directory",
      ruleBookTitle: "Indian Railways Minimum Cancellation Fee Table",
      ruleClass: "Booking Class",
      ruleMinFee: "Minimum Flat Fee (Cancelled >48 Hrs Before)",
      class1AC: "AC First Class / Executive (1AC/EC)",
      class2AC: "AC 2 Tier / First Class (2AC/FC)",
      class3AC: "AC 3 Tier / Chair Car (3AC/CC)",
      classSL: "Sleeper Class (SL)",
      class2S: "Second Class (2S)",
      helplineTitle: "Railway Helplines 📞"
    }
  }[locale];

  // Flat cancellation fee for confirmed tickets cancelled > 48 hours before departure
  const getFlatFee = (cl: TicketClass): number => {
    switch (cl) {
      case "1AC_EC": return 240;
      case "2AC_FC": return 200;
      case "3AC_CC": return 180;
      case "SL": return 120;
      case "2S": return 60;
      default: return 60;
    }
  };

  // Main calculation engine
  const calculateRefund = () => {
    let fee = 0;
    let actionText = t.actionOnline;

    // Waitlisted/RAC or Waitlisted Tatkal tickets have standard rules
    if (ticketStatus === "RAC_WL" || tatkalType === "WL_TATKAL") {
      if (cancellationTime === "AFTER_DEP" || cancellationTime === "LT_4H") {
        fee = 60;
        actionText = t.actionTDR;
      } else {
        fee = 60;
        actionText = t.actionOnline;
      }
    } 
    // Confirmed Tatkal tickets get 0 refund
    else if (tatkalType === "CNF_TATKAL") {
      fee = ticketFare;
      actionText = t.actionTatkalNoRefund;
    } 
    // Confirmed tickets under general quota
    else {
      const flatFee = getFlatFee(ticketClass);

      switch (cancellationTime) {
        case "GT_48H":
          fee = flatFee;
          actionText = t.actionOnline;
          break;
        case "48H_12H":
          // 25% of fare, subject to flat minimum
          fee = Math.max(flatFee, Math.round(ticketFare * 0.25));
          actionText = t.actionOnline;
          break;
        case "12H_4H":
          // 50% of fare, subject to flat minimum
          fee = Math.max(flatFee, Math.round(ticketFare * 0.5));
          actionText = t.actionOnline;
          break;
        case "LT_4H":
          fee = ticketFare;
          actionText = t.actionTDR;
          break;
        case "AFTER_DEP":
          fee = ticketFare;
          actionText = t.actionNoRefund;
          break;
        default:
          fee = flatFee;
      }
    }

    // Ensure fee doesn't exceed ticket fare
    fee = Math.min(fee, ticketFare);
    const refund = Math.max(0, ticketFare - fee);

    return { fee, refund, actionText };
  };

  const { fee, refund, actionText } = calculateRefund();

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4" id="railway-refund-calculator">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/${locale}/services`}
          className="text-xs font-bold text-[var(--secondary)] hover:underline inline-flex items-center gap-1.5"
        >
          {t.backLink}
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-8 border-b-2 border-[var(--secondary)] pb-4">
        <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-[var(--primary)] leading-tight">
          {t.title}
        </h1>
        <p className="text-xs md:text-sm text-[var(--muted)]">
          {t.subtitle}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Inputs Form */}
        <div className="lg:col-span-7 bg-white border border-[var(--border)]/70 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Input: Fare */}
          <div className="space-y-2">
            <label htmlFor="ticket-fare" className="block text-xs md:text-sm font-bold text-[var(--primary)]">
              {t.fareLabel}
            </label>
            <div className="relative rounded-xl shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[var(--muted)] font-serif font-bold text-sm">
                ₹
              </span>
              <input
                id="ticket-fare"
                type="number"
                min="60"
                max="10000"
                value={ticketFare}
                onChange={(e) => setTicketFare(Math.max(0, parseInt(e.target.value) || 0))}
                className="block w-full pl-8 pr-4 py-3 border border-[var(--border)] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]/20 focus:border-[var(--secondary)] transition-all"
              />
            </div>
            <input
              type="range"
              min="60"
              max="5000"
              step="10"
              value={ticketFare}
              onChange={(e) => setTicketFare(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[var(--surface-soft)] rounded-lg appearance-none cursor-pointer accent-[var(--secondary)] mt-2"
            />
          </div>

          {/* Input: Tatkal Status */}
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-[var(--primary)]">
              {t.tatkalLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setTatkalType("NONE")}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  tatkalType === "NONE"
                    ? "bg-[var(--secondary)]/5 border-[var(--secondary)] text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                    : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/30"
                }`}
              >
                {t.tatkalNo}
              </button>
              <button
                onClick={() => {
                  setTatkalType("CNF_TATKAL");
                  setTicketStatus("CNF");
                }}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  tatkalType === "CNF_TATKAL"
                    ? "bg-[var(--secondary)]/5 border-[var(--secondary)] text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                    : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/30"
                }`}
              >
                {t.tatkalYesCnf}
              </button>
              <button
                onClick={() => {
                  setTatkalType("WL_TATKAL");
                  setTicketStatus("RAC_WL");
                }}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  tatkalType === "WL_TATKAL"
                    ? "bg-[var(--secondary)]/5 border-[var(--secondary)] text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                    : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/30"
                }`}
              >
                {t.tatkalYesWl}
              </button>
            </div>
          </div>

          {/* Input: Ticket Status */}
          {tatkalType === "NONE" && (
            <div className="space-y-2">
              <label className="block text-xs md:text-sm font-bold text-[var(--primary)]">
                {t.statusLabel}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTicketStatus("CNF")}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    ticketStatus === "CNF"
                      ? "bg-[var(--secondary)]/5 border-[var(--secondary)] text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                      : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/30"
                  }`}
                >
                  {t.statusCNF}
                </button>
                <button
                  onClick={() => setTicketStatus("RAC_WL")}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    ticketStatus === "RAC_WL"
                      ? "bg-[var(--secondary)]/5 border-[var(--secondary)] text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                      : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/30"
                  }`}
                >
                  {t.statusRAC_WL}
                </button>
              </div>
            </div>
          )}

          {/* Input: Ticket Class */}
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-[var(--primary)]">
              {t.classLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {(["1AC_EC", "2AC_FC", "3AC_CC", "SL", "2S"] as TicketClass[]).map((cl) => {
                const isActive = ticketClass === cl;
                const label = {
                  "1AC_EC": "1AC / EC",
                  "2AC_FC": "2AC / FC",
                  "3AC_CC": "3AC / CC",
                  "SL": "SL (Sleeper)",
                  "2S": "2S (Second)"
                }[cl];
                return (
                  <button
                    key={cl}
                    onClick={() => setTicketClass(cl)}
                    className={`py-2.5 px-2 rounded-xl border text-[11px] sm:text-xs font-bold transition-all text-center cursor-pointer ${
                      isActive
                        ? "bg-[var(--secondary)]/5 border-[var(--secondary)] text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                        : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/30"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input: Cancellation Time */}
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-bold text-[var(--primary)]">
              {t.timeLabel}
            </label>
            <div className="space-y-2.5">
              {([
                { key: "GT_48H", label: t.timeGT_48H },
                { key: "48H_12H", label: t.time48H_12H },
                { key: "12H_4H", label: t.time12H_4H },
                { key: "LT_4H", label: t.timeLT_4H },
                { key: "AFTER_DEP", label: t.timeAFTER_DEP }
              ] as { key: CancellationTime; label: string }[]).map((time) => {
                const isActive = cancellationTime === time.key;
                return (
                  <button
                    key={time.key}
                    onClick={() => setCancellationTime(time.key)}
                    className={`w-full py-3 px-4 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? "bg-[var(--secondary)]/5 border-[var(--secondary)] text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                        : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-[var(--secondary)]/30"
                    }`}
                  >
                    <span>{time.label}</span>
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isActive ? "border-[var(--secondary)] bg-[var(--secondary)]" : "border-slate-300"
                    }`}>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Results & Breakdown Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Result Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--secondary)]/10 rounded-full blur-2xl"></div>
            
            <h2 className="font-serif text-lg font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
              <span>📊</span> {t.resultTitle}
            </h2>

            <div className="space-y-4">
              {/* Calculated Refund */}
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">
                  {t.resultRefund}
                </span>
                <span className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-serif">
                  ₹{refund}
                </span>
              </div>

              {/* Calculated Deduction */}
              <div className="space-y-1">
                <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">
                  {t.resultDeduction}
                </span>
                <span className="text-xl font-bold text-rose-400 font-serif">
                  ₹{fee}
                </span>
              </div>
            </div>

            {/* Dynamic Advice/Action Banner */}
            <div className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-4 text-xs md:text-sm leading-relaxed text-slate-200">
              <span className="font-bold text-[var(--secondary)] block mb-1">
                💡 {locale === "kn" ? "ಸೂಚಿಸಿದ ಪ್ರಕ್ರಿಯೆ:" : "Action Plan:"}
              </span>
              {actionText}
            </div>

            <p className="text-[10px] text-slate-500 leading-normal border-t border-slate-800 pt-3">
              {t.resultDisclaimer}
            </p>
          </div>

          {/* Quick Helpline Numbers */}
          <div className="bg-white border border-[var(--border)]/70 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-sm md:text-base font-bold text-[var(--primary)] mb-4 border-b border-[var(--border)]/50 pb-2">
              {t.helplineTitle}
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a href="tel:139" className="p-3 bg-[var(--surface-soft)] rounded-xl border border-[var(--border)]/30 hover:border-[var(--secondary)]/30 transition-colors font-bold text-center block">
                📞 139
                <span className="block text-[10px] font-normal text-[var(--muted)] mt-1">
                  {locale === "kn" ? "ಎಲ್ಲಾ ರೈಲ್ವೆ ಪ್ರಶ್ನೆಗಳು" : "All Enquiry Helpline"}
                </span>
              </a>
              <a href="tel:182" className="p-3 bg-[var(--surface-soft)] rounded-xl border border-[var(--border)]/30 hover:border-[var(--secondary)]/30 transition-colors font-bold text-center block">
                🚨 182
                <span className="block text-[10px] font-normal text-[var(--muted)] mt-1">
                  {locale === "kn" ? "ರೈಲ್ವೆ ಭದ್ರತೆ" : "Railway Security"}
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Information Section */}
      <div className="mt-12 bg-white border border-[var(--border)]/70 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <h3 className="font-serif text-lg font-bold text-[var(--primary)] border-b border-[var(--border)]/50 pb-3">
          📚 {t.ruleBookTitle}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--muted)]">
                <th className="py-3 px-4 font-bold">{t.ruleClass}</th>
                <th className="py-3 px-4 font-bold text-right">{t.ruleMinFee}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50 text-[var(--primary)] font-medium">
              <tr>
                <td className="py-3.5 px-4">{t.class1AC} (1AC/EC)</td>
                <td className="py-3.5 px-4 text-right font-bold font-serif">₹240</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4">{t.class2AC} (2AC/FC)</td>
                <td className="py-3.5 px-4 text-right font-bold font-serif">₹200</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4">{t.class3AC} (3AC/CC/3E)</td>
                <td className="py-3.5 px-4 text-right font-bold font-serif">₹180</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4">{t.classSL} (SL)</td>
                <td className="py-3.5 px-4 text-right font-bold font-serif">₹120</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4">{t.class2S} (2S)</td>
                <td className="py-3.5 px-4 text-right font-bold font-serif">₹60</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Informational Bullets */}
        <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-5 text-xs md:text-sm text-amber-900 space-y-3">
          <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
            ⚠️ {locale === "kn" ? "ಪ್ರಮುಖ ತತ್ಕಾಲ್ ಮತ್ತು ವೈಟಿಂಗ್ ಲಿಸ್ಟ್ ನಿಯಮಗಳು:" : "Crucial Waitlist & Tatkal Rules:"}
          </h4>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            {locale === "kn" ? (
              <>
                <li><strong>ತತ್ಕಾಲ್ ಕನ್ಫರ್ಮ್ ಟಿಕೆಟ್</strong>: ಕನ್ಫರ್ಮ್ ಆದ ತತ್ಕಾಲ್ ಟಿಕೆಟ್ ರದ್ದು ಮಾಡಿದರೆ ಯಾವುದೇ ಹಣ ವಾಪಸ್ ಸಿಗುವುದಿಲ್ಲ (೧೦೦% ಕಡಿತ).</li>
                <li><strong>ವೇಟ್‌ಲಿಸ್ಟ್ ತತ್ಕಾಲ್</strong>: ವೇಟ್‌ಲಿಸ್ಟ್ ತತ್ಕಾಲ್ ಟಿಕೆಟ್‌ಗೆ ಕೇವಲ ₹೬೦ ಕ್ಲರ್ಕೇಜ್ ಶುಲ್ಕ ಕಡಿತವಾಗಿ ಉಳಿದ ಹಣ ಮರುಪಾವತಿಯಾಗುತ್ತದೆ.</li>
                <li><strong>ರೈಲು ತಡವಾಗಿ ಬಂದರೆ</strong>: ರೈಲು ೩ ಗಂಟೆಗಿಂತ ಹೆಚ್ಚು ತಡವಾಗಿ ಚಲಿಸುತ್ತಿದ್ದರೆ, ಪ್ರವಾಸ ಆರಂಭವಾಗುವ ಮುನ್ನ ಆನ್‌ಲೈನ್ ಟಿಡಿಆರ್ (TDR) ಸಲ್ಲಿಸಿ ಪೂರ್ಣ ಹಣವನ್ನು ರದ್ದತಿ ಶುಲ್ಕವಿಲ್ಲದೆ ಪಡೆಯಬಹುದು.</li>
                <li><strong>ಆಟೋ ರದ್ದತಿ</strong>: ಕನ್ಫರ್ಮ್ ಆಗದ ಚಾರ್ಟ್ ತಯಾರಾದ ನಂತರದ ಇ-ವೇಟ್‌ಲಿಸ್ಟ್ ಟಿಕೆಟ್‌ಗಳು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರದ್ದಾಗಿ ನಿಮ್ಮ ಖಾತೆಗೆ ಹಣ ಜಮೆಯಾಗುತ್ತದೆ.</li>
              </>
            ) : (
              <>
                <li><strong>Confirmed Tatkal Tickets</strong>: No refund is granted on cancellation of confirmed Tatkal tickets.</li>
                <li><strong>Waitlisted Tatkal Tickets</strong>: Refunded after deducting standard clerkage charges of ₹60 per passenger.</li>
                <li><strong>Train Delayed &gt; 3 Hours</strong>: Full refund (without any cancellation charge) can be claimed by filing TDR online before the actual departure of the train.</li>
                <li><strong>Auto Cancellation</strong>: Fully waitlisted e-tickets after chart preparation are automatically cancelled by the system, and refunds are credited to the booking bank account automatically.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

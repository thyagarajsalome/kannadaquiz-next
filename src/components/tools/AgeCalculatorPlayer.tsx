"use client";

import { useState } from "react";
import { type Locale } from "@/lib/locales";

interface ExamConfig {
  id: string;
  nameKn: string;
  nameEn: string;
  deptKn: string;
  deptEn: string;
  minAge: number;
  maxAgeGM: number;
  maxAgeOBC: number;
  maxAgeSCST: number;
  referenceDate: string; // e.g. "2026-01-01"
  qualificationKn: string;
  qualificationEn: string;
}

const EXAM_RULES: ExamConfig[] = [
  {
    id: "ksp-constable",
    nameKn: "KSP ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್ (Civil / CAR / DAR)",
    nameEn: "KSP Police Constable (Civil / CAR / DAR)",
    deptKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
    deptEn: "Karnataka State Police",
    minAge: 19,
    maxAgeGM: 25,
    maxAgeOBC: 27,
    maxAgeSCST: 27,
    referenceDate: "2026-01-01",
    qualificationKn: "PUC / 12th ತೇರ್ಗಡೆ",
    qualificationEn: "PUC / 12th Pass",
  },
  {
    id: "ksp-psi",
    nameKn: "KSP ಪೊಲೀಸ್ ಸಬ್-ಇನ್‌ಸ್ಪೆಕ್ಟರ್ (PSI)",
    nameEn: "KSP Police Sub-Inspector (PSI)",
    deptKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್",
    deptEn: "Karnataka State Police",
    minAge: 21,
    maxAgeGM: 30,
    maxAgeOBC: 32,
    maxAgeSCST: 32,
    referenceDate: "2026-01-01",
    qualificationKn: "ಯಾವುದೇ ಪದವಿ (Degree)",
    qualificationEn: "Any Bachelor's Degree",
  },
  {
    id: "kpsc-kas",
    nameKn: "KPSC KAS (ಗೆಜೆಟೆಡ್ ಪ್ರೊಬೇಷನರ್ಸ್)",
    nameEn: "KPSC KAS (Gazetted Probationers)",
    deptKn: "ಕರ್ನಾಟಕ ಲೋಕಸೇವಾ ಆಯೋಗ",
    deptEn: "KPSC",
    minAge: 21,
    maxAgeGM: 38,
    maxAgeOBC: 41,
    maxAgeSCST: 43,
    referenceDate: "2026-01-01",
    qualificationKn: "ಯಾವುದೇ ಪದವಿ (Degree)",
    qualificationEn: "Any Bachelor's Degree",
  },
  {
    id: "kpsc-fda",
    nameKn: "KPSC FDA (ಪ್ರಥಮ ದರ್ಜೆ ಸಹಾಯಕ)",
    nameEn: "KPSC FDA (First Division Assistant)",
    deptKn: "ಕರ್ನಾಟಕ ಲೋಕಸೇವಾ ಆಯೋಗ",
    deptEn: "KPSC",
    minAge: 21,
    maxAgeGM: 35,
    maxAgeOBC: 38,
    maxAgeSCST: 40,
    referenceDate: "2026-01-01",
    qualificationKn: "ಪದವಿ + ಕನ್ನಡ ಟೈಪಿಂಗ್ ಜ್ಞಾನ",
    qualificationEn: "Degree + Kannada Typing",
  },
  {
    id: "kpsc-sda",
    nameKn: "KPSC SDA (ದ್ವಿತೀಯ ದರ್ಜೆ ಸಹಾಯಕ)",
    nameEn: "KPSC SDA (Second Division Assistant)",
    deptKn: "ಕರ್ನಾಟಕ ಲೋಕಸೇವಾ ಆಯೋಗ",
    deptEn: "KPSC",
    minAge: 18,
    maxAgeGM: 35,
    maxAgeOBC: 38,
    maxAgeSCST: 40,
    referenceDate: "2026-01-01",
    qualificationKn: "PUC / 12th + ಕನ್ನಡ ಟೈಪಿಂಗ್",
    qualificationEn: "PUC / 12th + Kannada Typing",
  },
  {
    id: "kea-vao",
    nameKn: "KEA ಗ್ರಾಮ ಆಡಳಿತಾಧಿಕಾರಿ (VAO - Village Accountant)",
    nameEn: "KEA Village Administrative Officer (VAO)",
    deptKn: "ಕರ್ನಾಟಕ ಪರೀಕ್ಷಾ ಪ್ರಾಧಿಕಾರ (KEA)",
    deptEn: "Karnataka Examination Authority",
    minAge: 18,
    maxAgeGM: 35,
    maxAgeOBC: 38,
    maxAgeSCST: 40,
    referenceDate: "2026-01-01",
    qualificationKn: "PUC / 12th (CBSE / ICSE / State)",
    qualificationEn: "PUC / 12th Pass",
  },
  {
    id: "rdpr-pdo",
    nameKn: "RDPR ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (PDO)",
    nameEn: "RDPR Panchayat Development Officer (PDO)",
    deptKn: "ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಮತ್ತು ಪಂಚಾಯತ್ ರಾಜ್",
    deptEn: "Rural Development & Panchayat Raj",
    minAge: 18,
    maxAgeGM: 35,
    maxAgeOBC: 38,
    maxAgeSCST: 40,
    referenceDate: "2026-01-01",
    qualificationKn: "ಯಾವುದೇ ಪದವಿ (Degree)",
    qualificationEn: "Any Bachelor's Degree",
  },
];

type Category = "GM" | "OBC" | "SC_ST";

export function AgeCalculatorPlayer({ locale }: { locale: Locale }) {
  const [dob, setDob] = useState("");
  const [category, setCategory] = useState<Category>("GM");
  const [targetDate, setTargetDate] = useState("2026-01-01");
  const [calculated, setCalculated] = useState(false);
  const [ageDetails, setAgeDetails] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = (birthDateStr: string, refDateStr: string) => {
    const birthDate = new Date(birthDateStr);
    const refDate = new Date(refDateStr);

    if (isNaN(birthDate.getTime()) || isNaN(refDate.getTime()) || birthDate > refDate) {
      return null;
    }

    let years = refDate.getFullYear() - birthDate.getFullYear();
    let months = refDate.getMonth() - birthDate.getMonth();
    let days = refDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return { years, months, days };
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob) return;

    const age = calculateAge(dob, targetDate);
    if (!age) {
      alert(locale === "kn" ? "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಜನ್ಮ ದಿನಾಂಕವನ್ನು ನಮೂದಿಸಿ." : "Please enter a valid date of birth.");
      return;
    }

    setAgeDetails(age);
    setCalculated(true);
  };

  const isEligible = (exam: ExamConfig, years: number) => {
    const maxAge =
      category === "SC_ST" ? exam.maxAgeSCST : category === "OBC" ? exam.maxAgeOBC : exam.maxAgeGM;
    return years >= exam.minAge && years <= maxAge;
  };

  const getMaxAge = (exam: ExamConfig) => {
    return category === "SC_ST" ? exam.maxAgeSCST : category === "OBC" ? exam.maxAgeOBC : exam.maxAgeGM;
  };

  const shareText = ageDetails
    ? locale === "kn"
      ? `ನನ್ನ ವಯಸ್ಸು ${ageDetails.years} ವರ್ಷ ${ageDetails.months} ತಿಂಗಳು. ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳ ವಯಸ್ಸಿನ ಅರ್ಹತೆಯನ್ನು ಕನ್ನಡಕ್ವಿಜ್ ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿದೆ: https://kannadaquiz.in/kn/tools/age-calculator`
      : `I checked my eligibility for Karnataka Govt Jobs (Age: ${ageDetails.years} yrs ${ageDetails.months} mos) on KannadaQuiz: https://kannadaquiz.in/en/tools/age-calculator`
    : "";

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="bg-[var(--background)] min-h-screen py-8 md:py-12">
      <div className="kq-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-blue-200 mb-3">
            <span>🎯</span>
            <span>{locale === "kn" ? "ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಅರ್ಹತೆ" : "Govt Job Eligibility"}</span>
          </div>
          <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-[var(--primary)] leading-tight">
            {locale === "kn"
              ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳ ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್ 2026"
              : "Karnataka Govt Exams Age & Eligibility Calculator 2026"}
          </h1>
          <p className="text-[var(--muted)] text-sm md:text-base mt-2 max-w-2xl mx-auto">
            {locale === "kn"
              ? "ನಿಮ್ಮ ಜನ್ಮ ದಿನಾಂಕ (DOB) ಮತ್ತು ಪ್ರವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. KSP, KPSC KAS, FDA, SDA, PDO ಮತ್ತು KEA ಪರೀಕ್ಷೆಗಳಿಗೆ ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು 1 ಸೆಕೆಂಡಿನಲ್ಲಿ ತಿಳಿಯಿರಿ."
              : "Enter your Date of Birth & Category to instantly check your age eligibility for KSP, KPSC KAS, FDA, SDA, PDO, and KEA examinations."}
          </p>
        </div>

        {/* Input Card */}
        <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs mb-8">
          <form onSubmit={handleCalculate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-2">
                  {locale === "kn" ? "ನಿಮ್ಮ ಜನ್ಮ ದಿನಾಂಕ (DOB) *" : "Your Date of Birth *"}
                </label>
                <input
                  type="date"
                  value={dob}
                  max={targetDate}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-2">
                  {locale === "kn" ? "ಮೀಸಲಾತಿ ಪ್ರವರ್ಗ (Category) *" : "Reservation Category *"}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                >
                  <option value="GM">{locale === "kn" ? "ಸಾಮಾನ್ಯ ವರ್ಗ (General / GM)" : "General Merit (GM)"}</option>
                  <option value="OBC">{locale === "kn" ? "ಹಿಂದುಳಿದ ವರ್ಗಗಳು (2A, 2B, 3A, 3B)" : "OBC (2A, 2B, 3A, 3B)"}</option>
                  <option value="SC_ST">{locale === "kn" ? "ಪರಿಶಿಷ್ಟ ಜಾತಿ / ಪಂಗಡ (SC / ST / Cat-1)" : "SC / ST / Category-1"}</option>
                </select>
              </div>

              {/* Reference Cutoff Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-2">
                  {locale === "kn" ? "ಲೆಕ್ಕಾಚಾರದ ದಿನಾಂಕ (Cutoff Date)" : "Reference Cutoff Date"}
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-sm"
            >
              {locale === "kn" ? "ವಯಸ್ಸು ಮತ್ತು ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ ➔" : "Calculate Age & Check Eligibility ➔"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {calculated && ageDetails && (
          <div className="space-y-6">
            {/* Age Summary Card */}
            <div className="kq-card p-6 md:p-8 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-blue-50 shadow-sm text-center">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {locale === "kn" ? "ನಿಮ್ಮ ನಿಖರ ವಯಸ್ಸು" : "Your Exact Age"}
              </span>
              <div className="mt-3 text-3xl md:text-5xl font-black text-[var(--primary)] tracking-tight">
                {ageDetails.years} <span className="text-lg md:text-2xl font-bold text-[var(--muted)]">{locale === "kn" ? "ವರ್ಷ" : "Years"}</span>{" "}
                {ageDetails.months} <span className="text-lg md:text-2xl font-bold text-[var(--muted)]">{locale === "kn" ? "ತಿಂಗಳು" : "Months"}</span>{" "}
                {ageDetails.days} <span className="text-lg md:text-2xl font-bold text-[var(--muted)]">{locale === "kn" ? "ದಿನ" : "Days"}</span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">
                {locale === "kn" ? `ದಿನಾಂಕ ${targetDate} ರ ಅನ್ವಯ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ.` : `Calculated as of ${targetDate}.`}
              </p>

              {/* WhatsApp Share Button */}
              <div className="mt-5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.185 1.564 5.939l-1.564 5.889 6.088-1.597c1.706.924 3.659 1.449 5.732 1.449 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>{locale === "kn" ? "ರಿಸಲ್ಟ್ ಅನ್ನು WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ" : "Share Result on WhatsApp"}</span>
                </a>
              </div>
            </div>

            {/* Eligibility Breakdown Table */}
            <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)] mb-4">
                {locale === "kn"
                  ? "ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳ ವಯೋಮಿತಿ ಮತ್ತು ನಿಮ್ಮ ಅರ್ಹತೆ"
                  : "Major Karnataka Exams Eligibility Status"}
              </h2>

              <div className="space-y-3">
                {EXAM_RULES.map((exam) => {
                  const eligible = isEligible(exam, ageDetails.years);
                  const maxAge = getMaxAge(exam);

                  return (
                    <div
                      key={exam.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        eligible
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-rose-50/40 border-rose-200 opacity-80"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              eligible
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-rose-100 text-rose-800 border border-rose-300"
                            }`}
                          >
                            {eligible
                              ? locale === "kn"
                                ? "ಅರ್ಹರು ✅"
                                : "Eligible ✅"
                              : locale === "kn"
                              ? "ವಯೋಮಿತಿ ಮೀರಿದೆ ❌"
                              : "Not Eligible ❌"}
                          </span>
                          <span className="text-xs text-[var(--muted)]">
                            {locale === "kn" ? exam.deptKn : exam.deptEn}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm md:text-base text-[var(--foreground)]">
                          {locale === "kn" ? exam.nameKn : exam.nameEn}
                        </h3>
                        <p className="text-xs text-[var(--muted)]">
                          {locale === "kn" ? "ಅಗತ್ಯ ವಿದ್ಯಾರ್ಹತೆ: " : "Qualification: "}
                          <span className="font-semibold text-[var(--foreground)]">
                            {locale === "kn" ? exam.qualificationKn : exam.qualificationEn}
                          </span>
                        </p>
                      </div>

                      <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-[var(--border)]">
                        <div className="text-xs text-[var(--muted)]">
                          {locale === "kn" ? "ನಿಗದಿಪಡಿಸಿದ ವಯೋಮಿತಿ" : "Allowed Age Limit"}
                        </div>
                        <div className="text-sm font-bold text-[var(--primary)]">
                          {exam.minAge} - {maxAge} {locale === "kn" ? "ವರ್ಷಗಳು" : "Years"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SEO Guide Section */}
        <div className="mt-10 kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--primary)] mb-4">
            {locale === "kn"
              ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ನೌಕರಿಗಳ ವಯೋಮಿತಿ ಸಡಿಲಿಕೆ ನಿಯಮಗಳು"
              : "Karnataka Government Jobs Age Relaxation Rules"}
          </h2>
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-[var(--foreground)] space-y-4">
            {locale === "kn" ? (
              <>
                <p>
                  ಕರ್ನಾಟಕ ರಾಜ್ಯ ನಾಗರಿಕ ಸೇವೆಗಳ ನಿಯಮಾವಳಿಗಳ ಪ್ರಕಾರ, ಸರ್ಕಾರಿ ನೇಮಕಾತಿಗಳಲ್ಲಿ ವಿವಿಧ ಮೀಸಲಾತಿ ಪ್ರವರ್ಗಗಳಿಗೆ ವಯೋಮಿತಿ ಸಡಿಲಿಕೆಯನ್ನು ನೀಡಲಾಗುತ್ತದೆ:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>ಸಾಮಾನ್ಯ ವರ್ಗ (General Merit - GM):</strong> ಗರಿಷ್ಠ 35 ವರ್ಷಗಳು (KSP ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್‌ಗೆ 25 ವರ್ಷ).</li>
                  <li><strong>ಹಿಂದುಳಿದ ವರ್ಗಗಳು (OBC - 2A, 2B, 3A, 3B):</strong> 3 ವರ್ಷಗಳ ವಯೋಮಿತಿ ಸಡಿಲಿಕೆ (ಗರಿಷ್ಠ 38 ವರ್ಷಗಳು).</li>
                  <li><strong>ಪರಿಶಿಷ್ಟ ಜಾತಿ / ಪಂಗಡ (SC / ST / Cat-1):</strong> 5 ವರ್ಷಗಳ ವಯೋಮಿತಿ ಸಡಿಲಿಕೆ (ಗರಿಷ್ಠ 40 ವರ್ಷಗಳು).</li>
                  <li><strong>ಮಾಜಿ ಸೈನಿಕರು (Ex-Servicemen):</strong> ಸೇವೆ ಸಲ್ಲಿಸಿದ ಅವಧಿ + 3 ವರ್ಷಗಳ ಹೆಚ್ಚುವರಿ ಸಡಿಲಿಕೆ.</li>
                </ul>
                <p className="text-xs text-[var(--muted)]">
                  ಗಮನಿಸಿ: ಪ್ರತಿ ಅಧಿಕೃತ ಅಧಿಸೂಚನೆಯಲ್ಲಿ (Notification) ಪ್ರಕಟವಾಗುವ ಕೊನೆಯ ದಿನಾಂಕದ ಆಧಾರದ ಮೇಲೆ ಅಂತಿಮ ವಯಸ್ಸನ್ನು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.
                </p>
              </>
            ) : (
              <>
                <p>
                  As per Karnataka State Civil Services Rules, age relaxations are provided across reservation categories for government recruitments:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>General Merit (GM):</strong> Standard age ceiling up to 35 years (25 years for KSP Constable).</li>
                  <li><strong>OBC (Categories 2A, 2B, 3A, 3B):</strong> 3 years relaxation (up to 38 years).</li>
                  <li><strong>SC / ST / Category-1:</strong> 5 years relaxation (up to 40 years).</li>
                  <li><strong>Ex-Servicemen & PwD:</strong> Additional relaxations as per government order guidelines.</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

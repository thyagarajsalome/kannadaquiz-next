"use client";

import React, { useState } from "react";
import type { Locale } from "@/lib/locales";

interface EduItem {
  id: string;
  name: string;
  nameKn: string;
  desc: string;
  descKn: string;
  link?: string;
}

interface EduCategory {
  id: string;
  title: string;
  titleKn: string;
  items: EduItem[];
}

const EDUCATION_DATA: EduCategory[] = [
  {
    id: "school",
    title: "School Education",
    titleKn: "ಶಾಲಾ ಶಿಕ್ಷಣ",
    items: [
      { id: "preschool", name: "Preschool & Nursery", nameKn: "ಪೂರ್ವ ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣ (ನರ್ಸರಿ)", desc: "Early childhood education focused on play-based learning and basic social skills.", descKn: "ಮಕ್ಕಳ ಆಟದ ಮೂಲಕ ಕಲಿಕೆ ಮತ್ತು ಮೂಲಭೂತ ಸಾಮಾಜಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ಬೆಳೆಸುವ ಆರಂಭಿಕ ಶಿಕ್ಷಣ." },
      { id: "lkg-ukg", name: "LKG & UKG", nameKn: "ಎಲ್.ಕೆ.ಜಿ (LKG) & ಯು.ಕೆ.ಜಿ (UKG)", desc: "Kindergarten stages preparing children for primary school with alphabets and numbers.", descKn: "ಪ್ರಾಥಮಿಕ ಶಾಲೆಗೆ ಮಕ್ಕಳನ್ನು ಸಿದ್ಧಪಡಿಸುವ, ಅಕ್ಷರಗಳು ಮತ್ತು ಸಂಖ್ಯೆಗಳನ್ನು ಕಲಿಸುವ ಹಂತ." },
      { id: "primary", name: "Primary School (Class 1–5)", nameKn: "ಪ್ರಾಥಮಿಕ ಶಾಲೆ (1 ರಿಂದ 5ನೇ ತರಗತಿ)", desc: "Foundational education focusing on reading, writing, mathematics, and environmental science.", descKn: "ಓದುವಿಕೆ, ಬರವಣಿಗೆ, ಗಣಿತ ಮತ್ತು ಪರಿಸರ ವಿಜ್ಞಾನದತ್ತ ಗಮನಹರಿಸುವ ಬುನಾದಿ ಶಿಕ್ಷಣ.", link: "https://schooleducation.karnataka.gov.in/" },
      { id: "middle", name: "Middle School (Class 6–8)", nameKn: "ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ (6 ರಿಂದ 8ನೇ ತರಗತಿ)", desc: "Introduction to specialized subjects like Science, Social Studies, and multiple languages.", descKn: "ವಿಜ್ಞಾನ, ಸಮಾಜ ವಿಜ್ಞಾನ ಮತ್ತು ಬಹು ಭಾಷೆಗಳಂತಹ ನಿರ್ದಿಷ್ಟ ವಿಷಯಗಳ ಪರಿಚಯ." },
      { id: "high", name: "High School (Class 9–10) / SSLC", nameKn: "ಪ್ರೌಢಶಾಲೆ (9 ಮತ್ತು 10ನೇ ತರಗತಿ) / ಎಸ್‌ಎಸ್‌ಎಲ್‌ಸಿ (SSLC)", desc: "Crucial secondary education culminating in the first major board examination (SSLC/10th).", descKn: "ವಿದ್ಯಾರ್ಥಿ ಜೀವನದ ಅತ್ಯಂತ ಪ್ರಮುಖ ಹಂತ. ಇದು 10ನೇ ತರಗತಿಯ ಬೋರ್ಡ್ ಪರೀಕ್ಷೆಯೊಂದಿಗೆ (SSLC) ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ.", link: "https://kseab.karnataka.gov.in/" },
      { id: "puc", name: "Senior Secondary (11th–12th) / PUC", nameKn: "ಪದವಿಪೂರ್ವ ಶಿಕ್ಷಣ (11 ಮತ್ತು 12ನೇ ತರಗತಿ) / ಪಿಯುಸಿ (PUC)", desc: "Pre-University Course offering streams like Science (PCMB/PCMC), Commerce, and Arts.", descKn: "ವಿಜ್ಞಾನ, ವಾಣಿಜ್ಯ ಮತ್ತು ಕಲಾ ವಿಭಾಗಗಳಲ್ಲಿ ಮುಂದಿನ ವೃತ್ತಿಜೀವನದ ದಾರಿಯನ್ನು ನಿರ್ಧರಿಸುವ ಎರಡು ವರ್ಷಗಳ ಪ್ರಮುಖ ಕೋರ್ಸ್.", link: "https://kseab.karnataka.gov.in/" },
    ]
  },
  {
    id: "diploma",
    title: "Diploma & Certificate",
    titleKn: "ಡಿಪ್ಲೊಮಾ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರ ಕೋರ್ಸ್‌ಗಳು",
    items: [
      { id: "iti", name: "ITI (Industrial Training Institute)", nameKn: "ಐ.ಟಿ.ಐ (ITI - ಕೈಗಾರಿಕಾ ತರಬೇತಿ ಸಂಸ್ಥೆ)", desc: "Vocational training programs for students after 8th, 10th, or 12th standard focused on technical trades like fitter, electrician, etc.", descKn: "8ನೇ, 10ನೇ ಅಥವಾ 12ನೇ ತರಗತಿಯ ನಂತರ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಫಿಟ್ಟರ್, ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ ಮುಂತಾದ ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ಕಲಿಸುವ ವೃತ್ತಿಪರ ತರಬೇತಿ.", link: "https://dgt.gov.in/" },
      { id: "polytechnic", name: "Polytechnic Diploma", nameKn: "ಪಾಲಿಟೆಕ್ನಿಕ್ ಡಿಪ್ಲೊಮಾ", desc: "3-year technical diploma courses in engineering and non-engineering fields after 10th standard.", descKn: "10ನೇ ತರಗತಿಯ ನಂತರ ಇಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ಇತರೆ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ನೀಡಲಾಗುವ 3 ವರ್ಷಗಳ ತಾಂತ್ರಿಕ ಕೋರ್ಸ್.", link: "https://cetonline.karnataka.gov.in/kea/" },
      { id: "adv-diploma", name: "Advanced Diploma / Post Diploma", nameKn: "ಸುಧಾರಿತ ಡಿಪ್ಲೊಮಾ / ಪೋಸ್ಟ್ ಡಿಪ್ಲೊಮಾ", desc: "Specialized skill-oriented courses for individuals who have already completed a basic diploma or degree.", descKn: "ಮೂಲ ಡಿಪ್ಲೊಮಾ ಅಥವಾ ಪದವಿ ಪೂರ್ಣಗೊಳಿಸಿದವರಿಗೆ ನಿರ್ದಿಷ್ಟ ಕೌಶಲ್ಯ ಆಧಾರಿತ ಸುಧಾರಿತ ಕೋರ್ಸ್‌ಗಳು." },
      { id: "apprentice", name: "Apprenticeship & Vocational Training", nameKn: "ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ ಮತ್ತು ವೃತ್ತಿಪರ ತರಬೇತಿ", desc: "On-the-job training programs provided by industries to impart practical skills.", descKn: "ಪ್ರಾಯೋಗಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ನೀಡಲು ಕೈಗಾರಿಕೆಗಳು ಒದಗಿಸುವ ಉದ್ಯೋಗ-ಆಧಾರಿತ (On-the-job) ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳು.", link: "https://www.apprenticeshipindia.gov.in/" }
    ]
  },
  {
    id: "ug",
    title: "Undergraduate (Bachelor's Degrees)",
    titleKn: "ಪದವಿ ಕೋರ್ಸ್‌ಗಳು (Undergraduate)",
    items: [
      { id: "ba", name: "BA (Bachelor of Arts)", nameKn: "ಬಿ.ಎ (Bachelor of Arts)", desc: "3 to 4-year degree focusing on humanities, social sciences, literature, and languages. Subjects include History, Political Science, Economics, Sociology, Psychology, and Languages. Graduates can pursue careers in civil services (UPSC/KPSC), teaching, journalism, public administration, social work, content writing, and human resources. It provides a strong foundation for competitive exams and creative professions.", descKn: "ಮಾನವಿಕ ವಿಷಯಗಳು, ಸಮಾಜ ವಿಜ್ಞಾನ, ಸಾಹಿತ್ಯ ಮತ್ತು ಭಾಷೆಗಳ ಮೇಲೆ ಕೇಂದ್ರೀಕೃತವಾದ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪ್ರಮುಖ ವಿಷಯಗಳಲ್ಲಿ ಇತಿಹಾಸ, ರಾಜ್ಯಶಾಸ್ತ್ರ, ಅರ್ಥಶಾಸ್ತ್ರ, ಸಮಾಜಶಾಸ್ತ್ರ, ಮತ್ತು ಮನೋವಿಜ್ಞಾನ ಸೇರಿವೆ. ಪದವೀಧರರು ಐಎಎಸ್ (UPSC), ಕೆಎಎಸ್ (KPSC), ಶಿಕ್ಷಕ ವೃತ್ತಿ, ಪತ್ರಿಕೋದ್ಯಮ, ಸಾರ್ವಜನಿಕ ಆಡಳಿತ, ಮತ್ತು ಮಾನವ ಸಂಪನ್ಮೂಲ ವಿಭಾಗಗಳಲ್ಲಿ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು. ಇದು ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ಬುನಾದಿ ಒದಗಿಸುತ್ತದೆ." },
      { id: "bsc", name: "BSc (Bachelor of Science)", nameKn: "ಬಿ.ಎಸ್ಸಿ (Bachelor of Science)", desc: "3 to 4-year degree in pure sciences or applied sciences. Subjects include Physics, Chemistry, Mathematics, Botany, Zoology, and Computer Science. Graduates can find jobs in research laboratories, healthcare, pharmaceuticals, biotechnology, agriculture, and IT sectors. It is ideal for students aiming for scientific research, teaching, or specialized technical roles.", descKn: "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ (Pure Science) ಅಥವಾ ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್, ಕೃಷಿ (Applied Science) ಮುಂತಾದ ವಿಷಯಗಳನ್ನು ಒಳಗೊಂಡಿರುವ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪದವೀಧರರು ಸಂಶೋಧನಾ ಪ್ರಯೋಗಾಲಯಗಳು, ಆರೋಗ್ಯ ವಲಯ, ಫಾರ್ಮಾಸ್ಯುಟಿಕಲ್ಸ್, ಐಟಿ ಮತ್ತು ಕೃಷಿ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು. ವಿಜ್ಞಾನ, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಬೋಧನಾ ವೃತ್ತಿಗೆ ಸೇರಬಯಸುವವರಿಗೆ ಇದು ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ." },
      { id: "bcom", name: "BCom (Bachelor of Commerce)", nameKn: "ಬಿ.ಕಾಂ (Bachelor of Commerce)", desc: "3 to 4-year degree focused on commerce, accounting, finance, and business studies. Core subjects include Financial Accounting, Corporate Law, Taxation, Auditing, and Economics. Graduates are highly sought after for roles like accountants, tax consultants, financial analysts, banking professionals, and auditors. It is the primary stepping stone for professional courses like CA, CS, and CMA.", descKn: "ವಾಣಿಜ್ಯ, ಲೆಕ್ಕಪತ್ರ ನಿರ್ವಹಣೆ (Accounting), ಹಣಕಾಸು ಮತ್ತು ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪ್ರಮುಖ ವಿಷಯಗಳಲ್ಲಿ ಆರ್ಥಿಕ ಲೆಕ್ಕಪತ್ರ, ಕಾರ್ಪೊರೇಟ್ ಕಾನೂನು, ತೆರಿಗೆ ಮತ್ತು ಆಡಿಟಿಂಗ್ ಸೇರಿವೆ. ಬಿ.ಕಾಂ ಪದವೀಧರರು ಬ್ಯಾಂಕಿಂಗ್, ಆಡಿಟರ್, ಅಕೌಂಟೆಂಟ್, ಮತ್ತು ಫೈನಾನ್ಷಿಯಲ್ ಅನಾಲಿಸ್ಟ್ ಆಗಿ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು. ಸಿ.ಎ (CA) ಮತ್ತು ಸಿ.ಎಸ್ (CS) ನಂತಹ ವೃತ್ತಿಪರ ಕೋರ್ಸ್‌ಗಳಿಗೆ ಇದು ಪ್ರಮುಖ ಅಡಿಪಾಯ." },
      { id: "bca", name: "BCA (Bachelor of Computer Applications)", nameKn: "ಬಿ.ಸಿ.ಎ (BCA)", desc: "3 to 4-year undergraduate degree focused heavily on software and application development. Subjects cover Programming (Java, C++, Python), Database Management, Web Development, and Networking. Graduates can easily secure high-paying jobs in the IT industry as software developers, web designers, system analysts, and database administrators, competing directly with engineering graduates.", descKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ಅಪ್ಲಿಕೇಶನ್ ಅಭಿವೃದ್ಧಿಯ ಬಗ್ಗೆ ಆಳವಾದ ಜ್ಞಾನ ನೀಡುವ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪ್ರೋಗ್ರಾಮಿಂಗ್ (Java, Python), ಡೇಟಾಬೇಸ್, ಮತ್ತು ವೆಬ್ ಡೆವಲಪ್ಮೆಂಟ್ ಪ್ರಮುಖ ವಿಷಯಗಳು. ಬಿ.ಸಿ.ಎ ಪದವೀಧರರು ಐಟಿ ಕಂಪನಿಗಳಲ್ಲಿ ಸಾಫ್ಟ್‌ವೇರ್ ಡೆವಲಪರ್, ವೆಬ್ ಡಿಸೈನರ್, ಮತ್ತು ಸಿಸ್ಟಮ್ ಅನಾಲಿಸ್ಟ್ ಆಗಿ ಇಂಜಿನಿಯರಿಂಗ್ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಮಾನವಾಗಿ ಉತ್ತಮ ವೇತನದ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು." },
      { id: "bba", name: "BBA (Bachelor of Business Administration)", nameKn: "ಬಿ.ಬಿ.ಎ (BBA)", desc: "3 to 4-year degree focused on business management, entrepreneurship, and corporate leadership. Subjects include Marketing, Human Resources, Business Analytics, and Organizational Behavior. Graduates can find entry-level management jobs as HR executives, marketing managers, sales executives, and business consultants. It is the perfect foundational course for an MBA.", descKn: "ವ್ಯಾಪಾರ ನಿರ್ವಹಣೆ, ಕಾರ್ಪೊರೇಟ್ ನಾಯಕತ್ವ ಮತ್ತು ಉದ್ಯಮಶೀಲತೆಯ ಮೇಲಿನ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಮಾರುಕಟ್ಟೆ (Marketing), ಮಾನವ ಸಂಪನ್ಮೂಲ (HR), ಮತ್ತು ಬಿಸಿನೆಸ್ ಅನಾಲಿಟಿಕ್ಸ್ ಪ್ರಮುಖ ವಿಷಯಗಳು. ಪದವೀಧರರು ಕಾರ್ಪೊರೇಟ್ ಕಂಪನಿಗಳಲ್ಲಿ ಹೆಚ್.ಆರ್ ಎಕ್ಸಿಕ್ಯೂಟಿವ್, ಮಾರ್ಕೆಟಿಂಗ್ ಮ್ಯಾನೇಜರ್, ಮತ್ತು ಬಿಸಿನೆಸ್ ಕನ್ಸಲ್ಟೆಂಟ್ ಆಗಿ ಕೆಲಸ ಮಾಡಬಹುದು. ಇದು ಎಂ.ಬಿ.ಎ (MBA) ಮಾಡಲು ಅತ್ಯುತ್ತಮ ಬುನಾದಿ." },
      { id: "be-btech", name: "BE / BTech (Engineering)", nameKn: "ಬಿ.ಇ / ಬಿ.ಟೆಕ್ (ಇಂಜಿನಿಯರಿಂಗ್)", desc: "4-year professional engineering degree across multiple branches like CS, EC, Civil, Mechanical.", descKn: "ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್, ಸಿವಿಲ್, ಮೆಕ್ಯಾನಿಕಲ್ ಮುಂತಾದ ವಿಭಾಗಗಳಲ್ಲಿ ನೀಡಲಾಗುವ 4 ವರ್ಷಗಳ ವೃತ್ತಿಪರ ಇಂಜಿನಿಯರಿಂಗ್ ಪದವಿ.", link: "https://vtu.ac.in/" },
      { id: "mbbs", name: "MBBS / BDS (Medical)", nameKn: "ಎಂಬಿಬಿಎಸ್ / ಬಿಡಿಎಸ್ (ವೈದ್ಯಕೀಯ)", desc: "Highly competitive medical degrees to become a certified doctor or dentist.", descKn: "ವೈದ್ಯರಾಗಲು ಅಥವಾ ದಂತ ವೈದ್ಯರಾಗಲು ಓದಬೇಕಾದ ಅತ್ಯಂತ ಬೇಡಿಕೆಯುಳ್ಳ ವೈದ್ಯಕೀಯ ಪದವಿಗಳು.", link: "https://nmc.org.in/" },
      { id: "llb", name: "LLB (Law)", nameKn: "ಎಲ್.ಎಲ್.ಬಿ (ಕಾನೂನು ಪದವಿ)", desc: "Undergraduate degree in law, available as a 3-year course after graduation or a 5-year integrated course after 12th.", descKn: "ಕಾನೂನು ವೃತ್ತಿ ಅಥವಾ ವಕೀಲರಾಗಲು ಅಗತ್ಯವಿರುವ ಪದವಿ. (ಪದವಿಯ ನಂತರ 3 ವರ್ಷ ಅಥವಾ 12ನೇ ತರಗತಿಯ ನಂತರ 5 ವರ್ಷ).", link: "https://barcouncilofindia.org/" },
      { id: "bed", name: "BEd (Bachelor of Education)", nameKn: "ಬಿ.ಇಡಿ (ಶಿಕ್ಷಕರ ತರಬೇತಿ ಪದವಿ)", desc: "Professional degree required to take up teaching as a profession in schools.", descKn: "ಶಾಲೆಗಳಲ್ಲಿ ಶಿಕ್ಷಕ ವೃತ್ತಿಯನ್ನು ಕೈಗೊಳ್ಳಲು ಕಡ್ಡಾಯವಾಗಿ ಬೇಕಾಗಿರುವ ವೃತ್ತಿಪರ ಶಿಕ್ಷಣ ಪದವಿ.", link: "https://ncte.gov.in/" }
    ]
  },
  {
    id: "pg",
    title: "Postgraduate (Master's Degrees)",
    titleKn: "ಸ್ನಾತಕೋತ್ತರ ಪದವಿಗಳು (Postgraduate)",
    items: [
      { id: "ma", name: "MA (Master of Arts)", nameKn: "ಎಂ.ಎ (Master of Arts)", desc: "Advanced studies in arts, humanities, and social sciences.", descKn: "ಕಲಾ ವಿಭಾಗ ಮತ್ತು ಮಾನವಿಕ ವಿಷಯಗಳಲ್ಲಿ ಉನ್ನತ ಮಟ್ಟದ ಅಧ್ಯಯನ." },
      { id: "msc", name: "MSc (Master of Science)", nameKn: "ಎಂ.ಎಸ್ಸಿ (Master of Science)", desc: "Master's degree in pure and applied sciences offering deeper specialization.", descKn: "ವಿಜ್ಞಾನ ವಿಷಯಗಳಲ್ಲಿ ನಿರ್ದಿಷ್ಟ ವಿಷಯದ ಮೇಲೆ ಆಳವಾದ ಅಧ್ಯಯನ ನಡೆಸುವ ಸ್ನಾತಕೋತ್ತರ ಪದವಿ." },
      { id: "mba", name: "MBA (Master of Business Administration)", nameKn: "ಎಂ.ಬಿ.ಎ (MBA)", desc: "Highly sought-after corporate management degree offering specializations in HR, Marketing, Finance.", descKn: "ಮಾನವ ಸಂಪನ್ಮೂಲ (HR), ಮಾರುಕಟ್ಟೆ, ಮತ್ತು ಹಣಕಾಸು ನಿರ್ವಹಣೆಯಲ್ಲಿ ಉನ್ನತ ಹುದ್ದೆಗೇರಲು ನೆರವಾಗುವ ಕಾರ್ಪೊರೇಟ್ ಮ್ಯಾನೇಜ್ಮೆಂಟ್ ಪದವಿ.", link: "https://iimcat.ac.in/" },
      { id: "mtech", name: "ME / MTech", nameKn: "ಎಂ.ಇ / ಎಂ.ಟೆಕ್", desc: "Postgraduate engineering degree for research, development, and advanced technical knowledge.", descKn: "ಸಂಶೋಧನೆ, ಅಭಿವೃದ್ಧಿ ಮತ್ತು ಉನ್ನತ ತಾಂತ್ರಿಕ ಜ್ಞಾನಕ್ಕಾಗಿ ಇಂಜಿನಿಯರಿಂಗ್ ವಿದ್ಯಾರ್ಥಿಗಳು ಮಾಡುವ ಸ್ನಾತಕೋತ್ತರ ಪದವಿ." },
      { id: "mca", name: "MCA (Master of Computer Applications)", nameKn: "ಎಂ.ಸಿ.ಎ (MCA)", desc: "Advanced degree focusing on software engineering, database management, and programming.", descKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳಲ್ಲಿ ಉನ್ನತ ತಾಂತ್ರಿಕ ಜ್ಞಾನ ಒದಗಿಸುವ ಕೋರ್ಸ್." }
    ]
  },
  {
    id: "research",
    title: "Doctoral & Research",
    titleKn: "ಸಂಶೋಧನೆ ಮತ್ತು ಡಾಕ್ಟರೇಟ್ (PhD)",
    items: [
      { id: "mphil", name: "MPhil (Master of Philosophy)", nameKn: "ಎಂ.ಫಿಲ್ (MPhil)", desc: "A pre-doctorate degree offering advanced research training (being phased out under NEP).", descKn: "ಪಿಎಚ್‌ಡಿ (PhD) ಗೂ ಮುನ್ನ ಸಂಶೋಧನಾ ತರಬೇತಿ ನೀಡುವ ಹಂತ (ಹೊಸ ರಾಷ್ಟ್ರೀಯ ಶಿಕ್ಷಣ ನೀತಿಯಡಿ ಇದನ್ನು ಕೈಬಿಡಲಾಗುತ್ತಿದೆ)." },
      { id: "phd", name: "PhD (Doctorate)", nameKn: "ಪಿಎಚ್‌ಡಿ (ಡಾಕ್ಟರೇಟ್)", desc: "The highest academic degree awarded for original and significant contribution to a specific field.", descKn: "ನಿರ್ದಿಷ್ಟ ವಿಷಯದಲ್ಲಿ ಸ್ವತಂತ್ರ ಸಂಶೋಧನೆ ನಡೆಸಿ ಮೂಲ ಕೊಡುಗೆ ನೀಡಿದವರಿಗೆ ನೀಡಲಾಗುವ ಅತ್ಯುನ್ನತ ಶೈಕ್ಷಣಿಕ ಪದವಿ." },
      { id: "postdoc", name: "Postdoctoral Research", nameKn: "ಪೋಸ್ಟ್-ಡಾಕ್ಟರಲ್ ಸಂಶೋಧನೆ", desc: "Professional research conducted after completing a doctoral degree, often in universities or national labs.", descKn: "ಪಿಎಚ್‌ಡಿ ಪೂರ್ಣಗೊಳಿಸಿದ ನಂತರ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು ಅಥವಾ ರಾಷ್ಟ್ರೀಯ ಪ್ರಯೋಗಾಲಯಗಳಲ್ಲಿ ನಡೆಸುವ ವೃತ್ತಿಪರ ಸಂಶೋಧನೆ." }
    ]
  },
  {
    id: "professional",
    title: "Professional Courses & Certifications",
    titleKn: "ವೃತ್ತಿಪರ ಕೋರ್ಸ್‌ಗಳು",
    items: [
      { id: "ca", name: "CA (Chartered Accountant)", nameKn: "ಸಿ.ಎ (Chartered Accountant)", desc: "Prestigious professional course in accounting, taxation, and financial auditing.", descKn: "ಅಕೌಂಟಿಂಗ್, ತೆರಿಗೆ ಮತ್ತು ಆಡಿಟಿಂಗ್ (Auditing) ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ದೇಶದ ಅತ್ಯುನ್ನತ ವೃತ್ತಿಪರ ಕೋರ್ಸ್.", link: "https://www.icai.org/" },
      { id: "cs", name: "CS (Company Secretary)", nameKn: "ಸಿ.ಎಸ್ (Company Secretary)", desc: "Course focusing on corporate governance, company law, and business compliance.", descKn: "ಕಾರ್ಪೊರೇಟ್ ಆಡಳಿತ, ಕಂಪನಿ ಕಾನೂನುಗಳು ಮತ್ತು ವ್ಯವಹಾರ ನಿಯಮಗಳ ಪಾಲನೆಗೆ ಸಂಬಂಧಿಸಿದ ಕೋರ್ಸ್.", link: "https://www.icsi.edu/" },
      { id: "cloud", name: "AWS / Microsoft / Google Certifications", nameKn: "ಕ್ಲೌಡ್ ಮತ್ತು ಐಟಿ ಸರ್ಟಿಫಿಕೇಶನ್‌ಗಳು", desc: "Industry-recognized global certifications in Cloud Computing, DevOps, and IT infrastructure.", descKn: "ಕ್ಲೌಡ್ ಕಂಪ್ಯೂಟಿಂಗ್ (Cloud Computing) ಮತ್ತು ಐಟಿ ಮೂಲಸೌಕರ್ಯದಲ್ಲಿ ಉದ್ಯಮ-ಮಾನ್ಯತೆ ಪಡೆದ ಜಾಗತಿಕ ಪ್ರಮಾಣಪತ್ರಗಳು." }
    ]
  },
  {
    id: "tech",
    title: "Technical & Skill Development",
    titleKn: "ತಾಂತ್ರಿಕ ಮತ್ತು ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ",
    items: [
      { id: "dev", name: "Software Development (Full Stack / Mobile)", nameKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಡೆವಲಪ್ಮೆಂಟ್", desc: "Learning coding languages to build websites, frontend/backend architecture, and mobile apps.", descKn: "ವೆಬ್‌ಸೈಟ್‌ಗಳು ಮತ್ತು ಮೊಬೈಲ್ ಆಪ್‌ಗಳನ್ನು ನಿರ್ಮಿಸಲು ಅಗತ್ಯವಿರುವ ಕೋಡಿಂಗ್ ಕೌಶಲ್ಯಗಳು." },
      { id: "ai", name: "Data Science, AI & Machine Learning", nameKn: "ಡೇಟಾ ಸೈನ್ಸ್ ಮತ್ತು ಆರ್ಟಿಫಿಶಿಯಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್ (AI)", desc: "Advanced tech skills focusing on analyzing large datasets and building intelligent algorithms.", descKn: "ದೊಡ್ಡ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸುವ ಮತ್ತು ಬುದ್ಧಿವಂತ AI ಅಲ್ಗಾರಿದಮ್‌ಗಳನ್ನು ನಿರ್ಮಿಸುವ ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನ." },
      { id: "design", name: "UI/UX, Graphic Design & Animation", nameKn: "ಗ್ರಾಫಿಕ್ ಡಿಸೈನ್ ಮತ್ತು ಅನಿಮೇಷನ್", desc: "Creative skills for designing software interfaces, digital marketing materials, and video content.", descKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಟರ್‌ಫೇಸ್‌ಗಳು, ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್ ವಿನ್ಯಾಸ ಮತ್ತು ವಿಡಿಯೋ ಎಡಿಟಿಂಗ್ ಕೌಶಲ್ಯಗಳು." }
    ]
  },
  {
    id: "exams",
    title: "Competitive Exam Preparation",
    titleKn: "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಸಿದ್ಧತೆ",
    items: [
      { id: "upsc", name: "UPSC (Civil Services)", nameKn: "ಯು.ಪಿ.ಎಸ್.ಸಿ (UPSC - ನಾಗರಿಕ ಸೇವೆಗಳು)", desc: "The premier exam for IAS, IPS, and IFS posts in the Indian government.", descKn: "ಐಎಎಸ್ (IAS), ಐಪಿಎಸ್ (IPS) ನಂತಹ ಉನ್ನತ ಕೇಂದ್ರ ಸರ್ಕಾರಿ ಅಧಿಕಾರಿ ಹುದ್ದೆಗಳಿಗಾಗಿ ನಡೆಯುವ ದೇಶದ ಅತಿ ದೊಡ್ಡ ಪರೀಕ್ಷೆ.", link: "https://upsc.gov.in/" },
      { id: "kpsc", name: "KPSC / SSC / Banking", nameKn: "ಕೆ.ಪಿ.ಎಸ್.ಸಿ (KPSC) / ಬ್ಯಾಂಕಿಂಗ್", desc: "State exams (KAS, FDA), Staff Selection Commission, and IBPS banking exams for government jobs.", descKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯದ ಹುದ್ದೆಗಳು (KAS, FDA, SDA), ಕೇಂದ್ರ ಸರ್ಕಾರದ SSC, ಮತ್ತು ಬ್ಯಾಂಕ್ (IBPS) ಹುದ್ದೆಗಳ ನೇಮಕಾತಿ ಪರೀಕ್ಷೆಗಳು.", link: "https://kpsc.kar.nic.in/" },
      { id: "medical-engg", name: "JEE, NEET, CET, GATE", nameKn: "ನೀಟ್ (NEET), ಜೆಇಇ (JEE), ಸಿಇಟಿ (CET)", desc: "National and state level entrance exams for premier Engineering, Medical, and Postgraduate institutes.", descKn: "ಇಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ವೈದ್ಯಕೀಯ ಸೀಟುಗಳಿಗಾಗಿ ನಡೆಯುವ ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ ಮಟ್ಟದ ಪ್ರವೇಶ ಪರೀಕ್ಷೆಗಳು.", link: "https://nta.ac.in/" },
      { id: "abroad", name: "Study Abroad (IELTS, TOEFL, GRE)", nameKn: "ವಿದೇಶಿ ವ್ಯಾಸಂಗ (IELTS, GRE)", desc: "Language and aptitude tests required for pursuing higher education in foreign universities.", descKn: "ವಿದೇಶಿ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳಲ್ಲಿ ಉನ್ನತ ಶಿಕ್ಷಣ ಪಡೆಯಲು ಉತ್ತೀರ್ಣರಾಗಬೇಕಾದ ಇಂಗ್ಲಿಷ್ ಭಾಷೆ ಮತ್ತು ಪ್ರವೇಶ ಪರೀಕ್ಷೆಗಳು." }
    ]
  }
];

export function EducationClient({ locale }: { locale: Locale }) {
  const [openCategory, setOpenCategory] = useState<string | null>(EDUCATION_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = EDUCATION_DATA.map((category) => {
    const items = category.items.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.nameKn.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.descKn.toLowerCase().includes(q)
      );
    });
    return { ...category, items };
  }).filter((category) => category.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <div className="mb-8">
        <input
          type="text"
          placeholder={locale === "kn" ? "ಕೋರ್ಸ್‌ಗಳು ಅಥವಾ ಪರೀಕ್ಷೆಗಳನ್ನು ಹುಡುಕಿ..." : "Search for courses, degrees, or exams..."}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted)]">
            <span className="text-4xl mb-4 block">🔍</span>
            <p>{locale === "kn" ? "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ." : "No categories or courses found matching your search."}</p>
          </div>
        ) : (
          filteredData.map((category) => {
            const isOpen = openCategory === category.id || searchQuery.length > 0;
            return (
              <div key={category.id} className="kq-card rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpenCategory(isOpen ? null : category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-[var(--card)] hover:bg-[var(--background)] transition-colors text-left"
                >
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--primary)]">
                    {locale === "kn" ? category.titleKn : category.title}
                  </h2>
                  <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <svg className="w-6 h-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 grid gap-6 border-t border-[var(--border)] bg-[var(--background)]/50">
                    {category.items.map((item) => (
                      <div key={item.id} className="relative pl-4 border-l-4 border-[var(--secondary)]">
                        <h3 className="font-bold text-base md:text-lg text-[var(--foreground)] mb-1">
                          {locale === "kn" ? item.nameKn : item.name}
                        </h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">
                          {locale === "kn" ? item.descKn : item.desc}
                        </p>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[var(--secondary)] hover:underline"
                          >
                            <span>{locale === "kn" ? "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್" : "Official Website"}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

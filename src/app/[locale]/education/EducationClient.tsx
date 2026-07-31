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
  colleges?: { name: string; url: string; }[];
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
      { id: "iti", name: "ITI (Industrial Training Institute)", nameKn: "ಐ.ಟಿ.ಐ (ITI - ಕೈಗಾರಿಕಾ ತರಬೇತಿ ಸಂಸ್ಥೆ)", desc: "Vocational training programs ranging from 6 months to 2 years for students after 8th, 10th, or 12th standard. It focuses entirely on practical technical trades like Fitter, Electrician, Welder, and Mechanic. Graduates get immediate employment in manufacturing plants, railways, defense sectors, and automobile industries as skilled technicians.", descKn: "8ನೇ, 10ನೇ ಅಥವಾ 12ನೇ ತರಗತಿಯ ನಂತರ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ 6 ತಿಂಗಳಿಂದ 2 ವರ್ಷಗಳವರೆಗೆ ನೀಡಲಾಗುವ ತಾಂತ್ರಿಕ ತರಬೇತಿ. ಫಿಟ್ಟರ್, ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ವೆಲ್ಡರ್ ಮತ್ತು ಮೆಕ್ಯಾನಿಕ್ ಮುಂತಾದ ಪ್ರಾಯೋಗಿಕ ಕೌಶಲ್ಯಗಳಿಗೆ ಇಲ್ಲಿ ಆದ್ಯತೆ. ಐ.ಟಿ.ಐ ಮುಗಿಸಿದ ತಕ್ಷಣವೇ ರೈಲ್ವೆ, ರಕ್ಷಣಾ ವಲಯ, ಕಾರ್ಖಾನೆಗಳು ಮತ್ತು ಆಟೋಮೊಬೈಲ್ ಕೈಗಾರಿಕೆಗಳಲ್ಲಿ ತಂತ್ರಜ್ಞರಾಗಿ ಉದ್ಯೋಗ ಲಭ್ಯವಿದೆ.", link: "https://dgt.gov.in/" },
      { id: "polytechnic", name: "Polytechnic Diploma", nameKn: "ಪಾಲಿಟೆಕ್ನಿಕ್ ಡಿಪ್ಲೊಮಾ", desc: "3-year technical diploma courses pursued directly after 10th standard in engineering (Civil, CS, Mechanical) and non-engineering fields. It is a highly practical alternative to standard PUC. Graduates can directly enter the workforce as Junior Engineers (JE) in government and private sectors, or join the 2nd year of a BTech degree via lateral entry.", descKn: "10ನೇ ತರಗತಿಯ ನಂತರ ಸಿವಿಲ್, ಮೆಕ್ಯಾನಿಕಲ್, ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ ವಿಭಾಗಗಳಲ್ಲಿ ನೀಡಲಾಗುವ 3 ವರ್ಷಗಳ ತಾಂತ್ರಿಕ ಡಿಪ್ಲೊಮಾ ಕೋರ್ಸ್. ಇದು ಪಿಯುಸಿ (PUC) ಗೆ ಅತ್ಯುತ್ತಮ ಪರ್ಯಾಯವಾಗಿದೆ. ಡಿಪ್ಲೊಮಾ ಮುಗಿಸಿದವರು ಸರ್ಕಾರಿ ಮತ್ತು ಖಾಸಗಿ ವಲಯದಲ್ಲಿ ಜೂನಿಯರ್ ಇಂಜಿನಿಯರ್ (JE) ಆಗಿ ಕೆಲಸ ಮಾಡಬಹುದು ಅಥವಾ ನೇರವಾಗಿ ಇಂಜಿನಿಯರಿಂಗ್ (BTech) 2ನೇ ವರ್ಷಕ್ಕೆ ಪ್ರವೇಶ ಪಡೆಯಬಹುದು.", link: "https://cetonline.karnataka.gov.in/kea/" },
      { id: "adv-diploma", name: "Advanced Diploma / Post Diploma", nameKn: "ಸುಧಾರಿತ ಡಿಪ್ಲೊಮಾ / ಪೋಸ್ಟ್ ಡಿಪ್ಲೊಮಾ", desc: "1 to 2-year specialized skill-oriented courses designed for individuals who have already completed a basic diploma or undergraduate degree. Focus areas include Industrial Automation, Tool Design, and Fire Safety. It helps professionals upgrade their niche skills for rapid promotions in the manufacturing sector.", descKn: "ಮೂಲ ಡಿಪ್ಲೊಮಾ ಅಥವಾ ಪದವಿ ಪೂರ್ಣಗೊಳಿಸಿದವರಿಗೆ 1 ರಿಂದ 2 ವರ್ಷಗಳ ನಿರ್ದಿಷ್ಟ ಕೌಶಲ್ಯ ಆಧಾರಿತ ಸುಧಾರಿತ ಕೋರ್ಸ್‌ಗಳು. ಇಂಡಸ್ಟ್ರಿಯಲ್ ಆಟೊಮೇಷನ್, ಟೂಲ್ ಡಿಸೈನ್ ಮತ್ತು ಫೈರ್ ಸೇಫ್ಟಿಯಂತಹ ವಿಷಯಗಳಲ್ಲಿ ತರಬೇತಿ. ಇದು ಕಾರ್ಖಾನೆಗಳಲ್ಲಿ ಉದ್ಯೋಗಿಗಳಿಗೆ ಶೀಘ್ರ ಬಡ್ತಿ ಪಡೆಯಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ." },
      { id: "apprentice", name: "Apprenticeship & Vocational Training", nameKn: "ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ ಮತ್ತು ವೃತ್ತಿಪರ ತರಬೇತಿ", desc: "On-the-job training programs provided directly by industries to impart practical skills. Apprentices receive a monthly stipend while working and learning simultaneously. It bridges the gap between academic knowledge and industry requirements, often leading to a permanent job offer in the same company upon completion.", descKn: "ಪ್ರಾಯೋಗಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ನೀಡಲು ಕೈಗಾರಿಕೆಗಳು ಒದಗಿಸುವ ಉದ್ಯೋಗ-ಆಧಾರಿತ (On-the-job) ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳು. ತರಬೇತಿ ಪಡೆಯುತ್ತಿರುವಾಗಲೇ ಮಾಸಿಕ ಭತ್ಯೆ (Stipend) ಸಿಗುತ್ತದೆ. ಇದು ಶೈಕ್ಷಣಿಕ ಜ್ಞಾನ ಮತ್ತು ಕೈಗಾರಿಕಾ ಅಗತ್ಯಗಳ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ, ಜೊತೆಗೆ ತರಬೇತಿ ಮುಗಿದ ನಂತರ ಅದೇ ಕಂಪನಿಯಲ್ಲಿ ಖಾಯಂ ಉದ್ಯೋಗ ಪಡೆಯುವ ಅವಕಾಶ ಹೆಚ್ಚಿರುತ್ತದೆ.", link: "https://www.apprenticeshipindia.gov.in/" }
    ]
  },
  {
    id: "ug",
    title: "Undergraduate (Bachelor's Degrees)",
    titleKn: "ಪದವಿ ಕೋರ್ಸ್‌ಗಳು (Undergraduate)",
    items: [
      { 
        id: "ba", 
        name: "BA (Bachelor of Arts)", 
        nameKn: "ಬಿ.ಎ (Bachelor of Arts)", 
        desc: "3 to 4-year degree focusing on humanities, social sciences, literature, and languages. Subjects include History, Political Science, Economics, Sociology, Psychology, and Languages. Graduates can pursue careers in civil services (UPSC/KPSC), teaching, journalism, public administration, social work, content writing, and human resources. It provides a strong foundation for competitive exams and creative professions.", 
        descKn: "ಮಾನವಿಕ ವಿಷಯಗಳು, ಸಮಾಜ ವಿಜ್ಞಾನ, ಸಾಹಿತ್ಯ ಮತ್ತು ಭಾಷೆಗಳ ಮೇಲೆ ಕೇಂದ್ರೀಕೃತವಾದ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪ್ರಮುಖ ವಿಷಯಗಳಲ್ಲಿ ಇತಿಹಾಸ, ರಾಜ್ಯಶಾಸ್ತ್ರ, ಅರ್ಥಶಾಸ್ತ್ರ, ಸಮಾಜಶಾಸ್ತ್ರ, ಮತ್ತು ಮನೋವಿಜ್ಞಾನ ಸೇರಿವೆ. ಪದವೀಧರರು ಐಎಎಸ್ (UPSC), ಕೆಎಎಸ್ (KPSC), ಶಿಕ್ಷಕ ವೃತ್ತಿ, ಪತ್ರಿಕೋದ್ಯಮ, ಸಾರ್ವಜನಿಕ ಆಡಳಿತ, ಮತ್ತು ಮಾನವ ಸಂಪನ್ಮೂಲ ವಿಭಾಗಗಳಲ್ಲಿ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು. ಇದು ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ಬುನಾದಿ ಒದಗಿಸುತ್ತದೆ.",
        colleges: [
          { name: "Christ University", url: "https://christuniversity.in/" },
          { name: "St. Joseph's University", url: "https://www.sju.edu.in/" },
          { name: "Mount Carmel College", url: "https://mccblr.edu.in/" }
        ]
      },
      { id: "bsc", name: "BSc (Bachelor of Science)", nameKn: "ಬಿ.ಎಸ್ಸಿ (Bachelor of Science)", desc: "3 to 4-year degree in pure sciences or applied sciences. Subjects include Physics, Chemistry, Mathematics, Botany, Zoology, and Computer Science. Graduates can find jobs in research laboratories, healthcare, pharmaceuticals, biotechnology, agriculture, and IT sectors. It is ideal for students aiming for scientific research, teaching, or specialized technical roles.", descKn: "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ (Pure Science) ಅಥವಾ ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್, ಕೃಷಿ (Applied Science) ಮುಂತಾದ ವಿಷಯಗಳನ್ನು ಒಳಗೊಂಡಿರುವ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪದವೀಧರರು ಸಂಶೋಧನಾ ಪ್ರಯೋಗಾಲಯಗಳು, ಆರೋಗ್ಯ ವಲಯ, ಫಾರ್ಮಾಸ್ಯುಟಿಕಲ್ಸ್, ಐಟಿ ಮತ್ತು ಕೃಷಿ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು. ವಿಜ್ಞಾನ, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಬೋಧನಾ ವೃತ್ತಿಗೆ ಸೇರಬಯಸುವವರಿಗೆ ಇದು ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ." },
      { 
        id: "bcom", 
        name: "BCom (Bachelor of Commerce)", 
        nameKn: "ಬಿ.ಕಾಂ (Bachelor of Commerce)", 
        desc: "3 to 4-year degree focused on commerce, accounting, finance, and business studies. Core subjects include Financial Accounting, Corporate Law, Taxation, Auditing, and Economics. Graduates are highly sought after for roles like accountants, tax consultants, financial analysts, banking professionals, and auditors. It is the primary stepping stone for professional courses like CA, CS, and CMA.", 
        descKn: "ವಾಣಿಜ್ಯ, ಲೆಕ್ಕಪತ್ರ ನಿರ್ವಹಣೆ (Accounting), ಹಣಕಾಸು ಮತ್ತು ವ್ಯಾಪಾರ ಅಧ್ಯಯನಗಳ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪ್ರಮುಖ ವಿಷಯಗಳಲ್ಲಿ ಆರ್ಥಿಕ ಲೆಕ್ಕಪತ್ರ, ಕಾರ್ಪೊರೇಟ್ ಕಾನೂನು, ತೆರಿಗೆ ಮತ್ತು ಆಡಿಟಿಂಗ್ ಸೇರಿವೆ. ಬಿ.ಕಾಂ ಪದವೀಧರರು ಬ್ಯಾಂಕಿಂಗ್, ಆಡಿಟರ್, ಅಕೌಂಟೆಂಟ್, ಮತ್ತು ಫೈನಾನ್ಷಿಯಲ್ ಅನಾಲಿಸ್ಟ್ ಆಗಿ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು. ಸಿ.ಎ (CA) ಮತ್ತು ಸಿ.ಎಸ್ (CS) ನಂತಹ ವೃತ್ತಿಪರ ಕೋರ್ಸ್‌ಗಳಿಗೆ ಇದು ಪ್ರಮುಖ ಅಡಿಪಾಯ.",
        colleges: [
          { name: "St. Joseph's College of Commerce", url: "https://www.sjcc.edu.in/" },
          { name: "Jain University", url: "https://www.jainuniversity.ac.in/" },
          { name: "Christ University", url: "https://christuniversity.in/" },
          { name: "Kristu Jayanti College", url: "https://kristujayanti.edu.in/" }
        ]
      },
      { id: "bca", name: "BCA (Bachelor of Computer Applications)", nameKn: "ಬಿ.ಸಿ.ಎ (BCA)", desc: "3 to 4-year undergraduate degree focused heavily on software and application development. Subjects cover Programming (Java, C++, Python), Database Management, Web Development, and Networking. Graduates can easily secure high-paying jobs in the IT industry as software developers, web designers, system analysts, and database administrators, competing directly with engineering graduates.", descKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ಅಪ್ಲಿಕೇಶನ್ ಅಭಿವೃದ್ಧಿಯ ಬಗ್ಗೆ ಆಳವಾದ ಜ್ಞಾನ ನೀಡುವ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಪ್ರೋಗ್ರಾಮಿಂಗ್ (Java, Python), ಡೇಟಾಬೇಸ್, ಮತ್ತು ವೆಬ್ ಡೆವಲಪ್ಮೆಂಟ್ ಪ್ರಮುಖ ವಿಷಯಗಳು. ಬಿ.ಸಿ.ಎ ಪದವೀಧರರು ಐಟಿ ಕಂಪನಿಗಳಲ್ಲಿ ಸಾಫ್ಟ್‌ವೇರ್ ಡೆವಲಪರ್, ವೆಬ್ ಡಿಸೈನರ್, ಮತ್ತು ಸಿಸ್ಟಮ್ ಅನಾಲಿಸ್ಟ್ ಆಗಿ ಇಂಜಿನಿಯರಿಂಗ್ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಮಾನವಾಗಿ ಉತ್ತಮ ವೇತನದ ಉದ್ಯೋಗ ಪಡೆಯಬಹುದು." },
      { id: "bba", name: "BBA (Bachelor of Business Administration)", nameKn: "ಬಿ.ಬಿ.ಎ (BBA)", desc: "3 to 4-year degree focused on business management, entrepreneurship, and corporate leadership. Subjects include Marketing, Human Resources, Business Analytics, and Organizational Behavior. Graduates can find entry-level management jobs as HR executives, marketing managers, sales executives, and business consultants. It is the perfect foundational course for an MBA.", descKn: "ವ್ಯಾಪಾರ ನಿರ್ವಹಣೆ, ಕಾರ್ಪೊರೇಟ್ ನಾಯಕತ್ವ ಮತ್ತು ಉದ್ಯಮಶೀಲತೆಯ ಮೇಲಿನ 3 ರಿಂದ 4 ವರ್ಷಗಳ ಪದವಿ. ಮಾರುಕಟ್ಟೆ (Marketing), ಮಾನವ ಸಂಪನ್ಮೂಲ (HR), ಮತ್ತು ಬಿಸಿನೆಸ್ ಅನಾಲಿಟಿಕ್ಸ್ ಪ್ರಮುಖ ವಿಷಯಗಳು. ಪದವೀಧರರು ಕಾರ್ಪೊರೇಟ್ ಕಂಪನಿಗಳಲ್ಲಿ ಹೆಚ್.ಆರ್ ಎಕ್ಸಿಕ್ಯೂಟಿವ್, ಮಾರ್ಕೆಟಿಂಗ್ ಮ್ಯಾನೇಜರ್, ಮತ್ತು ಬಿಸಿನೆಸ್ ಕನ್ಸಲ್ಟೆಂಟ್ ಆಗಿ ಕೆಲಸ ಮಾಡಬಹುದು. ಇದು ಎಂ.ಬಿ.ಎ (MBA) ಮಾಡಲು ಅತ್ಯುತ್ತಮ ಬುನಾದಿ." },
      { 
        id: "be-btech", 
        name: "BE / BTech (Engineering)", 
        nameKn: "ಬಿ.ಇ / ಬಿ.ಟೆಕ್ (ಇಂಜಿನಿಯರಿಂಗ್)", 
        desc: "4-year professional engineering degree across multiple branches like CS, EC, Civil, Mechanical.", 
        descKn: "ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್, ಸಿವಿಲ್, ಮೆಕ್ಯಾನಿಕಲ್ ಮುಂತಾದ ವಿಭಾಗಗಳಲ್ಲಿ ನೀಡಲಾಗುವ 4 ವರ್ಷಗಳ ವೃತ್ತಿಪರ ಇಂಜಿನಿಯರಿಂಗ್ ಪದವಿ.", 
        link: "https://vtu.ac.in/",
        colleges: [
          { name: "RVCE, Bengaluru", url: "https://www.rvce.edu.in/" },
          { name: "PES University", url: "https://pes.edu/" },
          { name: "NITK Surathkal", url: "https://www.nitk.ac.in/" },
          { name: "BMSCE", url: "https://bmsce.ac.in/" },
          { name: "IIT Dharwad", url: "https://www.iitdh.ac.in/" }
        ]
      },
      { 
        id: "mbbs", 
        name: "MBBS / BDS (Medical)", 
        nameKn: "ಎಂಬಿಬಿಎಸ್ / ಬಿಡಿಎಸ್ (ವೈದ್ಯಕೀಯ)", 
        desc: "Highly competitive medical degrees to become a certified doctor or dentist.", 
        descKn: "ವೈದ್ಯರಾಗಲು ಅಥವಾ ದಂತ ವೈದ್ಯರಾಗಲು ಓದಬೇಕಾದ ಅತ್ಯಂತ ಬೇಡಿಕೆಯುಳ್ಳ ವೈದ್ಯಕೀಯ ಪದವಿಗಳು.", 
        link: "https://nmc.org.in/",
        colleges: [
          { name: "BMCRI (Bangalore Medical College)", url: "https://bmcri.karnataka.gov.in/" },
          { name: "St. John's Medical College", url: "https://stjohns.in/" },
          { name: "KMC Manipal", url: "https://manipal.edu/kmc-manipal.html" },
          { name: "JSS Medical College, Mysuru", url: "https://jssuni.edu.in/" }
        ]
      },
      { id: "llb", name: "LLB (Law)", nameKn: "ಎಲ್.ಎಲ್.ಬಿ (ಕಾನೂನು ಪದವಿ)", desc: "Undergraduate degree in law, available as a 3-year course after graduation or a 5-year integrated course after 12th.", descKn: "ಕಾನೂನು ವೃತ್ತಿ ಅಥವಾ ವಕೀಲರಾಗಲು ಅಗತ್ಯವಿರುವ ಪದವಿ. (ಪದವಿಯ ನಂತರ 3 ವರ್ಷ ಅಥವಾ 12ನೇ ತರಗತಿಯ ನಂತರ 5 ವರ್ಷ).", link: "https://barcouncilofindia.org/" },
      { id: "bed", name: "BEd (Bachelor of Education)", nameKn: "ಬಿ.ಇಡಿ (ಶಿಕ್ಷಕರ ತರಬೇತಿ ಪದವಿ)", desc: "Professional degree required to take up teaching as a profession in schools.", descKn: "ಶಾಲೆಗಳಲ್ಲಿ ಶಿಕ್ಷಕ ವೃತ್ತಿಯನ್ನು ಕೈಗೊಳ್ಳಲು ಕಡ್ಡಾಯವಾಗಿ ಬೇಕಾಗಿರುವ ವೃತ್ತಿಪರ ಶಿಕ್ಷಣ ಪದವಿ.", link: "https://ncte.gov.in/" }
    ]
  },
  {
    id: "pg",
    title: "Postgraduate (Master's Degrees)",
    titleKn: "ಸ್ನಾತಕೋತ್ತರ ಪದವಿಗಳು (Postgraduate)",
    items: [
      { id: "ma", name: "MA (Master of Arts)", nameKn: "ಎಂ.ಎ (Master of Arts)", desc: "2-year postgraduate program focusing on advanced studies in humanities, arts, and social sciences. Specializations include English, History, Economics, and Political Science. Graduates can pursue careers as university professors, senior researchers, journalists, authors, and public policy analysts. It is essential for clearing the NET/SLET exams for lectureship.", descKn: "ಕಲಾ ವಿಭಾಗ ಮತ್ತು ಮಾನವಿಕ ವಿಷಯಗಳಲ್ಲಿ 2 ವರ್ಷಗಳ ಉನ್ನತ ಮಟ್ಟದ ಅಧ್ಯಯನ. ಇತಿಹಾಸ, ಅರ್ಥಶಾಸ್ತ್ರ, ಮತ್ತು ರಾಜ್ಯಶಾಸ್ತ್ರ ಮುಂತಾದ ವಿಷಯಗಳಲ್ಲಿ ಪರಿಣತಿ ಸಾಧಿಸಬಹುದು. ಎಂ.ಎ ಮುಗಿಸಿದವರು ವಿಶ್ವವಿದ್ಯಾಲಯದ ಪ್ರಾಧ್ಯಾಪಕರು (Lecturers), ಹಿರಿಯ ಸಂಶೋಧಕರು, ಪತ್ರಕರ್ತರು, ಮತ್ತು ಸಾರ್ವಜನಿಕ ನೀತಿ ವಿಶ್ಲೇಷಕರಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸಬಹುದು. ಪ್ರಾಧ್ಯಾಪಕರಾಗಲು ಬರೆಯುವ NET/SLET ಪರೀಕ್ಷೆಗಳಿಗೆ ಇದು ಕಡ್ಡಾಯವಾಗಿದೆ." },
      { id: "msc", name: "MSc (Master of Science)", nameKn: "ಎಂ.ಎಸ್ಸಿ (Master of Science)", desc: "2-year Master's degree offering deeper specialization in pure and applied sciences like Physics, Data Science, or Biotechnology. It involves heavy practical and theoretical research work. Graduates secure high-paying jobs as research scientists, data analysts, environmental consultants, and lab directors. It serves as the primary gateway to a Ph.D. program.", descKn: "ವಿಜ್ಞಾನ ವಿಷಯಗಳಲ್ಲಿ (ಉದಾಹರಣೆಗೆ ಭೌತಶಾಸ್ತ್ರ, ಡೇಟಾ ಸೈನ್ಸ್, ಅಥವಾ ಬಯೋಟೆಕ್ನಾಲಜಿ) ಆಳವಾದ ಸಂಶೋಧನೆ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ಜ್ಞಾನ ನೀಡುವ 2 ವರ್ಷಗಳ ಪದವಿ. ಪದವೀಧರರು ವಿಜ್ಞಾನಿಗಳು, ಡೇಟಾ ಅನಾಲಿಸ್ಟ್, ಮತ್ತು ಪ್ರಯೋಗಾಲಯದ ನಿರ್ದೇಶಕರಾಗಿ ಅತ್ಯುತ್ತಮ ವೇತನದ ಉದ್ಯೋಗಗಳನ್ನು ಪಡೆಯಬಹುದು. ಇದು ಪಿಎಚ್‌ಡಿ (Ph.D) ಅಧ್ಯಯನಕ್ಕೆ ಪ್ರಮುಖ ಮೆಟ್ಟಿಲಾಗಿದೆ." },
      { 
        id: "mba", 
        name: "MBA (Master of Business Administration)", 
        nameKn: "ಎಂ.ಬಿ.ಎ (MBA)", 
        desc: "2-year highly sought-after corporate management degree offering specializations in HR, Marketing, Finance, and Operations. It develops leadership, critical thinking, and strategic management skills. Graduates are hired as corporate managers, investment bankers, marketing directors, and startup consultants by top multinational companies globally.", 
        descKn: "ಮಾನವ ಸಂಪನ್ಮೂಲ (HR), ಮಾರುಕಟ್ಟೆ (Marketing), ಮತ್ತು ಹಣಕಾಸು (Finance) ವಿಭಾಗಗಳಲ್ಲಿ ಪರಿಣತಿ ಒದಗಿಸುವ ಅತ್ಯಂತ ಜನಪ್ರಿಯ 2 ವರ್ಷಗಳ ಮ್ಯಾನೇಜ್ಮೆಂಟ್ ಪದವಿ. ಇದು ನಾಯಕತ್ವ ಮತ್ತು ನಿರ್ವಹಣಾ ಕೌಶಲ್ಯಗಳನ್ನು ಬೆಳೆಸುತ್ತದೆ. ಎಂ.ಬಿ.ಎ ಮುಗಿಸಿದವರನ್ನು ಬಹುರಾಷ್ಟ್ರೀಯ ಕಂಪನಿಗಳು ಕಾರ್ಪೊರೇಟ್ ಮ್ಯಾನೇಜರ್, ಇನ್ವೆಸ್ಟ್ಮೆಂಟ್ ಬ್ಯಾಂಕರ್, ಮತ್ತು ಬಿಸಿನೆಸ್ ಕನ್ಸಲ್ಟೆಂಟ್ ಆಗಿ ನೇಮಿಸಿಕೊಳ್ಳುತ್ತವೆ.", 
        link: "https://iimcat.ac.in/",
        colleges: [
          { name: "IIM Bangalore", url: "https://www.iimb.ac.in/" },
          { name: "TAPMI Manipal", url: "https://www.tapmi.edu.in/" },
          { name: "XIME Bangalore", url: "https://xime.org/" }
        ]
      },
      { id: "mtech", name: "ME / MTech", nameKn: "ಎಂ.ಇ / ಎಂ.ಟೆಕ್", desc: "2-year postgraduate engineering degree meant for deep research, specialized development, and advanced technical knowledge. Fields include VLSI, Structural Engineering, and AI. Graduates become lead engineers, system architects, and technical directors in top tech firms or pursue advanced scientific research at national institutions like ISRO or DRDO.", descKn: "ಇಂಜಿನಿಯರಿಂಗ್ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಂಶೋಧನೆ ಮತ್ತು ಉನ್ನತ ತಾಂತ್ರಿಕ ಜ್ಞಾನಕ್ಕಾಗಿ ಇರುವ 2 ವರ್ಷಗಳ ಸ್ನಾತಕೋತ್ತರ ಪದವಿ. ಸಿವಿಲ್, ಕಂಪ್ಯೂಟರ್ ಮತ್ತು ಮೆಕ್ಯಾನಿಕಲ್‌ನ ನಿರ್ದಿಷ್ಟ ವಿಷಯಗಳಲ್ಲಿ ಪರಿಣತಿ ಸಾಧಿಸಬಹುದು. ಎಂ.ಟೆಕ್ ಮುಗಿಸಿದವರು ಟಾಪ್ ಟೆಕ್ ಕಂಪನಿಗಳಲ್ಲಿ ಲೀಡ್ ಇಂಜಿನಿಯರ್ ಆಗಬಹುದು ಅಥವಾ ಇಸ್ರೋ (ISRO), ಡಿಆರ್ಡಿಒ (DRDO) ನಂತಹ ಸಂಸ್ಥೆಗಳಲ್ಲಿ ವಿಜ್ಞಾನಿಗಳಾಗಿ ಸೇರಬಹುದು." },
      { id: "mca", name: "MCA (Master of Computer Applications)", nameKn: "ಎಂ.ಸಿ.ಎ (MCA)", desc: "2-year advanced degree focusing on software engineering, database management, cloud computing, and modern programming languages. It bridges the gap between theoretical computing and practical software applications. MCA graduates are highly valued as Senior Software Engineers, Cloud Architects, and IT Consultants, enjoying salaries at par with premium BTech graduates.", descKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರಿಂಗ್, ಡೇಟಾಬೇಸ್, ಕ್ಲೌಡ್ ಕಂಪ್ಯೂಟಿಂಗ್ ಮತ್ತು ಆಧುನಿಕ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆಗಳಲ್ಲಿ ಉನ್ನತ ತಾಂತ್ರಿಕ ಜ್ಞಾನ ಒದಗಿಸುವ 2 ವರ್ಷಗಳ ಕೋರ್ಸ್. ಎಂ.ಸಿ.ಎ ಪದವೀಧರರು ಐಟಿ ಉದ್ಯಮದಲ್ಲಿ ಸೀನಿಯರ್ ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್, ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಟ್, ಮತ್ತು ಐಟಿ ಕನ್ಸಲ್ಟೆಂಟ್ ಆಗಿ ಉತ್ತಮ ವೇತನ ಪಡೆಯುತ್ತಾರೆ." }
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
      { id: "ca", name: "CA (Chartered Accountant)", nameKn: "ಸಿ.ಎ (Chartered Accountant)", desc: "Highly prestigious and rigorous professional course in accounting, taxation, and financial auditing regulated by ICAI. It involves multiple levels (Foundation, Intermediate, Final) and a mandatory 3-year articleship. CAs are the backbone of the financial sector, securing elite roles as Chief Financial Officers (CFOs), statutory auditors, and tax consultants in top multinational corporations and banks.", descKn: "ಅಕೌಂಟಿಂಗ್, ತೆರಿಗೆ ಮತ್ತು ಆಡಿಟಿಂಗ್ (Auditing) ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ದೇಶದ ಅತ್ಯುನ್ನತ ಮತ್ತು ಅತ್ಯಂತ ಕಠಿಣ ವೃತ್ತಿಪರ ಕೋರ್ಸ್. ಸಿ.ಎ (CA) ಮುಗಿಸಿದವರು ಹಣಕಾಸು ಕ್ಷೇತ್ರದ ಬೆನ್ನೆಲುಬು. ಇವರು ಟಾಪ್ ಬಹುರಾಷ್ಟ್ರೀಯ ಕಂಪನಿಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್‌ಗಳಲ್ಲಿ ಮುಖ್ಯ ಹಣಕಾಸು ಅಧಿಕಾರಿ (CFO), ಶಾಸನಬದ್ಧ ಆಡಿಟರ್ ಮತ್ತು ತೆರಿಗೆ ಸಲಹೆಗಾರರಾಗಿ ಕೆಲಸ ಮಾಡುತ್ತಾರೆ.", link: "https://www.icai.org/" },
      { id: "cs", name: "CS (Company Secretary)", nameKn: "ಸಿ.ಎಸ್ (Company Secretary)", desc: "Professional course focusing heavily on corporate governance, company law, and business compliance. Regulated by ICSI, this course trains experts to ensure companies follow legal frameworks. A Company Secretary acts as a vital link between the board of directors, shareholders, and government regulatory bodies, enjoying highly respected corporate positions and massive salaries.", descKn: "ಕಾರ್ಪೊರೇಟ್ ಆಡಳಿತ, ಕಂಪನಿ ಕಾನೂನುಗಳು ಮತ್ತು ವ್ಯವಹಾರ ನಿಯಮಗಳ ಪಾಲನೆಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರತಿಷ್ಠಿತ ಕೋರ್ಸ್. ಕಂಪನಿಯ ಆಡಳಿತ ಮಂಡಳಿ, ಷೇರುದಾರರು ಮತ್ತು ಸರ್ಕಾರದ ನಡುವಿನ ಪ್ರಮುಖ ಕೊಂಡಿಯಾಗಿ 'ಕಂಪನಿ ಸೆಕ್ರೆಟರಿ' ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಾರೆ. ಇದು ಅತ್ಯುನ್ನತ ಕಾರ್ಪೊರೇಟ್ ಗೌರವ ಮತ್ತು ವೇತನ ತಂದುಕೊಡುತ್ತದೆ.", link: "https://www.icsi.edu/" },
      { id: "cloud", name: "AWS / Microsoft / Google Certifications", nameKn: "ಕ್ಲೌಡ್ ಮತ್ತು ಐಟಿ ಸರ್ಟಿಫಿಕೇಶನ್‌ಗಳು", desc: "Industry-recognized global IT certifications focused on Cloud Computing, DevOps, and scalable web infrastructure. Leading tech companies strictly require these certificates for roles like Cloud Architect, Site Reliability Engineer, and Security Consultant. They are relatively short programs but offer massive boosts to software engineering salaries and global employability.", descKn: "ಕ್ಲೌಡ್ ಕಂಪ್ಯೂಟಿಂಗ್ (Cloud Computing) ಮತ್ತು ಐಟಿ ಮೂಲಸೌಕರ್ಯದಲ್ಲಿ ಉದ್ಯಮ-ಮಾನ್ಯತೆ ಪಡೆದ ಜಾಗತಿಕ ಪ್ರಮಾಣಪತ್ರಗಳು (AWS, Azure, GCP). ಟಾಪ್ ಐಟಿ ಕಂಪನಿಗಳು ಕ್ಲೌಡ್ ಆರ್ಕಿಟೆಕ್ಟ್ ಮತ್ತು ಸೆಕ್ಯುರಿಟಿ ಕನ್ಸಲ್ಟೆಂಟ್ ಹುದ್ದೆಗಳಿಗೆ ಈ ಸರ್ಟಿಫಿಕೇಟ್‌ಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಕೇಳುತ್ತವೆ. ಇದು ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್‌ಗಳ ವೇತನವನ್ನು ಭಾರಿ ಪ್ರಮಾಣದಲ್ಲಿ ಹೆಚ್ಚಿಸುತ್ತದೆ." }
    ]
  },
  {
    id: "tech",
    title: "Technical & Skill Development",
    titleKn: "ತಾಂತ್ರಿಕ ಮತ್ತು ಕೌಶಲ್ಯ ಅಭಿವೃದ್ಧಿ",
    items: [
      { id: "dev", name: "Software Development (Full Stack / Mobile)", nameKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಡೆವಲಪ್ಮೆಂಟ್", desc: "Intensive training in coding languages (JavaScript, Python) and modern frameworks (React, Node.js) to build websites, frontend/backend architecture, and mobile applications. It is the most in-demand technical skill globally. Highly skilled developers secure massive salaries as Full-Stack Engineers, iOS/Android Developers, and Tech Leads in startups and FAANG companies.", descKn: "ವೆಬ್‌ಸೈಟ್‌ಗಳು ಮತ್ತು ಮೊಬೈಲ್ ಆಪ್‌ಗಳನ್ನು ನಿರ್ಮಿಸಲು ಅಗತ್ಯವಿರುವ ಕೋಡಿಂಗ್ ಕೌಶಲ್ಯಗಳು (ಜಾವಾಸ್ಕ್ರಿಪ್ಟ್, ಪೈಥಾನ್) ಮತ್ತು ಫ್ರೇಮ್‌ವರ್ಕ್‌ಗಳ ತರಬೇತಿ. ಇದು ಜಗತ್ತಿನಾದ್ಯಂತ ಅತಿ ಹೆಚ್ಚು ಬೇಡಿಕೆಯಿರುವ ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯ. ಪ್ರತಿಭಾವಂತ ಡೆವಲಪರ್‌ಗಳು ಟಾಪ್ ಐಟಿ ಕಂಪನಿಗಳು ಮತ್ತು ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳಲ್ಲಿ ಫುಲ್-ಸ್ಟ್ಯಾಕ್ ಇಂಜಿನಿಯರ್ ಆಗಿ ಭಾರಿ ವೇತನ ಪಡೆಯುತ್ತಾರೆ." },
      { id: "ai", name: "Data Science, AI & Machine Learning", nameKn: "ಡೇಟಾ ಸೈನ್ಸ್ ಮತ್ತು ಆರ್ಟಿಫಿಶಿಯಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್ (AI)", desc: "Advanced technical domain focusing on analyzing massive datasets, training neural networks, and building intelligent AI algorithms. Mastery in this field leads to the most cutting-edge jobs of the future, including Machine Learning Engineer, Data Scientist, and AI Researcher. It requires strong logical and mathematical foundations.", descKn: "ದೊಡ್ಡ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸುವ, ನ್ಯೂರಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಗೆ ತರಬೇತಿ ನೀಡುವ ಮತ್ತು ಬುದ್ಧಿವಂತ AI ಅಲ್ಗಾರಿದಮ್‌ಗಳನ್ನು ನಿರ್ಮಿಸುವ ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನ. ಭವಿಷ್ಯದ ಅತಿ ಹೆಚ್ಚು ಬೇಡಿಕೆಯಿರುವ ಡೇಟಾ ಸೈಂಟಿಸ್ಟ್ ಮತ್ತು AI ಸಂಶೋಧಕರ ಉದ್ಯೋಗಗಳಿಗೆ ಇದು ದಾರಿ. ಇದಕ್ಕೆ ಉತ್ತಮ ಗಣಿತದ ಜ್ಞಾನ ಅಗತ್ಯ." },
      { id: "design", name: "UI/UX, Graphic Design & Animation", nameKn: "ಗ್ರಾಫಿಕ್ ಡಿಸೈನ್ ಮತ್ತು ಅನಿಮೇಷನ್", desc: "Creative tech skills meant for designing intuitive software interfaces, compelling digital marketing materials, 3D modeling, and video content. Tools used include Figma, Adobe Premiere, and Blender. Professionals work as Product Designers, UX Researchers, and Animators, playing a critical role in how users experience digital products.", descKn: "ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಟರ್‌ಫೇಸ್‌ಗಳು, ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್ ವಿನ್ಯಾಸ ಮತ್ತು ವಿಡಿಯೋ ಎಡಿಟಿಂಗ್‌ಗಾಗಿ ಇರುವ ಸೃಜನಶೀಲ ಕೌಶಲ್ಯಗಳು. ಫಿಗ್ಮಾ (Figma), ಅಡೋಬ್ (Adobe) ನಂತಹ ಟೂಲ್‌ಗಳ ಬಳಕೆ. ಡಿಜಿಟಲ್ ಉತ್ಪನ್ನಗಳನ್ನು ಬಳಕೆದಾರರಿಗೆ ಆಕರ್ಷಕವಾಗಿ ಕಾಣುವಂತೆ ಮಾಡುವ ಪ್ರಾಡಕ್ಟ್ ಡಿಸೈನರ್ ಮತ್ತು ಅನಿಮೇಟರ್ ಆಗಿ ಇವರು ಕೆಲಸ ಮಾಡುತ್ತಾರೆ." }
    ]
  },
  {
    id: "exams",
    title: "Competitive Exam Preparation",
    titleKn: "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಸಿದ್ಧತೆ",
    items: [
      { id: "upsc", name: "UPSC (Civil Services)", nameKn: "ಯು.ಪಿ.ಎಸ್.ಸಿ (UPSC - ನಾಗರಿಕ ಸೇವೆಗಳು)", desc: "The premier and most difficult examination in India for selecting top administrative officers like IAS, IPS, and IFS. It involves a rigorous 3-stage process: Prelims, Mains, and Interview. Passing this exam offers immense power, prestige, and the opportunity to shape national policies and administration.", descKn: "ಐಎಎಸ್ (IAS), ಐಪಿಎಸ್ (IPS) ಮತ್ತು ಐಎಫ್ಎಸ್ (IFS) ನಂತಹ ಉನ್ನತ ಕೇಂದ್ರ ಸರ್ಕಾರಿ ಅಧಿಕಾರಿ ಹುದ್ದೆಗಳಿಗಾಗಿ ನಡೆಯುವ ದೇಶದ ಅತಿ ದೊಡ್ಡ ಮತ್ತು ಕಠಿಣ ಪರೀಕ್ಷೆ. ಇದು ಪೂರ್ವಭಾವಿ (Prelims), ಮುಖ್ಯ ಪರೀಕ್ಷೆ (Mains) ಮತ್ತು ಸಂದರ್ಶನವನ್ನು (Interview) ಒಳಗೊಂಡಿದೆ. ಇದರಲ್ಲಿ ಉತ್ತೀರ್ಣರಾಗುವುದು ಅತ್ಯುನ್ನತ ಗೌರವ ಮತ್ತು ಅಧಿಕಾರದ ಸಂಕೇತವಾಗಿದೆ.", link: "https://upsc.gov.in/" },
      { id: "kpsc", name: "KPSC / SSC / Banking", nameKn: "ಕೆ.ಪಿ.ಎಸ್.ಸಿ (KPSC) / ಬ್ಯಾಂಕಿಂಗ್", desc: "State and central level exams for securing stable government jobs. KPSC conducts exams for state executive roles like KAS, FDA, and SDA. SSC hires for central government ministries, while IBPS conducts exams for nationalized bank jobs like PO and Clerk. These exams offer excellent job security and benefits.", descKn: "ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಪಡೆಯಲು ಇರುವ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳು. ಕರ್ನಾಟಕ ರಾಜ್ಯದ KAS, FDA, SDA ಹುದ್ದೆಗಳಿಗೆ KPSC ಪರೀಕ್ಷೆ ನಡೆಸುತ್ತದೆ. ಕೇಂದ್ರ ಸರ್ಕಾರದ ಹುದ್ದೆಗಳಿಗೆ SSC, ಮತ್ತು ಬ್ಯಾಂಕ್ (PO/Clerk) ಹುದ್ದೆಗಳ ನೇಮಕಾತಿಗೆ IBPS ಪರೀಕ್ಷೆಗಳು ನಡೆಯುತ್ತವೆ. ಇದು ಅತ್ಯುತ್ತಮ ಉದ್ಯೋಗ ಭದ್ರತೆ ಒದಗಿಸುತ್ತದೆ.", link: "https://kpsc.kar.nic.in/" },
      { id: "medical-engg", name: "JEE, NEET, CET, GATE", nameKn: "ನೀಟ್ (NEET), ಜೆಇಇ (JEE), ಸಿಇಟಿ (CET)", desc: "Highly competitive national and state-level entrance exams for securing admissions into premier institutes like IITs, NITs, AIIMS, and top medical/engineering colleges in Karnataka. GATE is specifically for engineering graduates to secure PSU jobs or enter MTech/PhD programs at IISc and IITs.", descKn: "ಇಂಜಿನಿಯರಿಂಗ್ (IIT, NIT) ಮತ್ತು ವೈದ್ಯಕೀಯ (AIIMS, ಸರ್ಕಾರಿ ಮೆಡಿಕಲ್ ಕಾಲೇಜು) ಸೀಟುಗಳಿಗಾಗಿ ನಡೆಯುವ ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ ಮಟ್ಟದ ಪ್ರವೇಶ ಪರೀಕ್ಷೆಗಳು. ಉನ್ನತ ವ್ಯಾಸಂಗ (MTech/PhD) ಅಥವಾ ಸರ್ಕಾರಿ ಸ್ವಾಮ್ಯದ ಕಂಪನಿಗಳಲ್ಲಿ (PSU) ಕೆಲಸ ಪಡೆಯಲು ಗೇಟ್ (GATE) ಪರೀಕ್ಷೆ ಬರೆಯಬೇಕು.", link: "https://nta.ac.in/" },
      { id: "abroad", name: "Study Abroad (IELTS, TOEFL, GRE)", nameKn: "ವಿದೇಶಿ ವ್ಯಾಸಂಗ (IELTS, GRE)", desc: "Mandatory language and aptitude tests required for pursuing higher education in foreign universities in the US, UK, Canada, and Australia. IELTS/TOEFL tests English proficiency, while GRE/GMAT evaluates mathematical and analytical skills for Master's and MBA programs abroad.", descKn: "ಅಮೆರಿಕ, ಯುಕೆ, ಆಸ್ಟ್ರೇಲಿಯಾ ಮುಂತಾದ ವಿದೇಶಿ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳಲ್ಲಿ ಉನ್ನತ ಶಿಕ್ಷಣ ಪಡೆಯಲು ಉತ್ತೀರ್ಣರಾಗಬೇಕಾದ ಪರೀಕ್ಷೆಗಳು. IELTS ಮತ್ತು TOEFL ಇಂಗ್ಲಿಷ್ ಭಾಷೆಯ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿದರೆ, GRE ಮತ್ತು GMAT ಪರೀಕ್ಷೆಗಳು ಸ್ನಾತಕೋತ್ತರ ಮತ್ತು ಎಂಬಿಎ (MBA) ಕೋರ್ಸ್‌ಗಳಿಗೆ ಅಗತ್ಯವಾದ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಕೌಶಲ್ಯಗಳನ್ನು ಪರೀಕ್ಷಿಸುತ್ತವೆ." }
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
                        
                        {item.colleges && item.colleges.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-[var(--border)]">
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2 block">
                              {locale === "kn" ? "ಉನ್ನತ ಕಾಲೇಜುಗಳು / ಸಂಸ್ಥೆಗಳು" : "Top Colleges / Institutions"}
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {item.colleges.map((college, idx) => (
                                <a
                                  key={idx}
                                  href={college.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[var(--border)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] rounded-md text-xs font-medium text-[var(--primary)] transition-colors shadow-sm"
                                >
                                  {college.name}
                                  <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

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

"use client";

import React, { useState } from "react";
import type { Locale } from "@/lib/locales";

interface ServiceItem {
  id: string;
  name: string;
  nameKn: string;
  category: "identity" | "welfare" | "health" | "citizen";
  categoryKn: string;
  categoryEn: string;
  type: "state" | "national";
  typeKn: string;
  typeEn: string;
  agency: string;
  agencyKn: string;
  description: string;
  descriptionKn: string;
  benefits: string[];
  benefitsKn: string[];
  howToObtain: string;
  howToObtainKn: string;
  officialUrl: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "aadhaar",
    name: "Aadhaar Card (UIDAI)",
    nameKn: "ಆಧಾರ್ ಕಾರ್ಡ್ (UIDAI)",
    category: "identity",
    categoryKn: "ಗುರುತಿನ ಚೀಟಿ",
    categoryEn: "Identity Card",
    type: "national",
    typeKn: "ರಾಷ್ಟ್ರೀಯ",
    typeEn: "National",
    agency: "Unique Identification Authority of India (UIDAI), Ministry of Electronics & IT",
    agencyKn: "ಭಾರತೀಯ ವಿಶಿಷ್ಟ ಗುರುತಿನ ಪ್ರಾಧಿಕಾರ (UIDAI), ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಐಟಿ ಸಚಿವಾಲಯ",
    description: "A unique 12-digit random number issued by UIDAI to all residents of India based on their biometric and demographic data.",
    descriptionKn: "ಭಾರತದ ಎಲ್ಲಾ ನಿವಾಸಿಗಳಿಗೆ ಅವರ ಬಯೋಮೆಟ್ರಿಕ್ ಮತ್ತು ಜನಸಂಖ್ಯಾ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ UIDAI ನೀಡುವ 12 ಅಂಕಿಗಳ ವಿಶಿಷ್ಟ ಗುರುತಿನ ಸಂಖ್ಯೆ.",
    benefits: [
      "Official universal proof of identity and address across India.",
      "Mandatory for getting Direct Benefit Transfer (DBT) subsidies directly in bank accounts.",
      "Used for instant paperless e-KYC to open bank accounts, get mobile SIM cards, etc.",
      "Required to access various welfare schemes like PM-Kisan, Ration Cards, and Scholarships."
    ],
    benefitsKn: [
      "ಭಾರತದಾದ್ಯಂತ ಮಾನ್ಯತೆ ಪಡೆದ ಏಕೈಕ ಸಾರ್ವತ್ರಿಕ ವಿಳಾಸ ಮತ್ತು ಗುರುತಿನ ಪುರಾವೆ.",
      "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು ಮತ್ತು ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಹಣವನ್ನು ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪಡೆಯಲು ಕಡ್ಡಾಯ.",
      "ಬ್ಯಾಂಕ್ ಖಾತೆ ತೆರೆಯಲು, ಹೊಸ ಮೊಬೈಲ್ ಸಿಮ್ ಪಡೆಯಲು ತತ್‌ಕ್ಷಣದ ಪೇಪರ್‌ಲೆಸ್ ಇ-ಕೆವೈಸಿ (e-KYC) ಸೌಲಭ್ಯ.",
      "ಪಿಎಂ-ಕಿಸಾನ್, ಉಚಿತ ಪಡಿತರ, ವಿದ್ಯಾರ್ಥಿವೇತನ ಮುಂತಾದ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ಸೌಲಭ್ಯ ಪಡೆಯಲು ಅತ್ಯಗತ್ಯ."
    ],
    howToObtain: "Visit a permanent Aadhaar Enrolment Centre near you with documents proving identity (POI) and address (POA). Submit biometric details (fingerprints and iris scan) along with the application form. You can download a digital copy (e-Aadhaar) online once generated.",
    howToObtainKn: "ನಿಮ್ಮ ಹತ್ತಿರದ ಅಧಿಕೃತ ಆಧಾರ್ ನೋಂದಣಿ ಕೇಂದ್ರಕ್ಕೆ ಗುರುತಿನ ಪುರಾವೆ (POI) ಮತ್ತು ವಿಳಾಸದ ಪುರಾವೆ (POA) ದಾಖಲೆಗಳೊಂದಿಗೆ ಭೇಟಿ ನೀಡಿ. ಅಲ್ಲಿ ನಿಮ್ಮ ಬೆರಳಚ್ಚು ಹಾಗೂ ಕಣ್ಣಿನ ಪಾಪೆಯ ಬಯೋಮೆಟ್ರಿಕ್ ಮಾಹಿತಿ ನೀಡಿ ನೊಂದಾಯಿಸಿಕೊಳ್ಳಿ. ನೊಂದಣಿಯಾದ ಬಳಿಕ ಇ-ಆಧಾರ್ ಪ್ರತಿಯನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು.",
    officialUrl: "https://myaadhaar.uidai.gov.in/"
  },
  {
    id: "ration-card",
    name: "Ration Card (Ahara)",
    nameKn: "ರೇಷನ್ ಕಾರ್ಡ್ (ಪಡಿತರ ಚೀಟಿ)",
    category: "welfare",
    categoryKn: "ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು",
    categoryEn: "Social Welfare",
    type: "state",
    typeKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ",
    typeEn: "Karnataka State",
    agency: "Department of Food, Civil Supplies & Consumer Affairs, Govt. of Karnataka",
    agencyKn: "ಆಹಾರ, ನಾಗರಿಕ ಸರಬರಾಜು ಮತ್ತು ಗ್ರಾಹಕರ ವ್ಯವಹಾರಗಳ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ",
    description: "Official document issued by the state government for purchasing subsidized food grains and essential commodities.",
    descriptionKn: "ಸಹಾಯಧನ ಹೊಂದಿದ ಆಹಾರ ಧಾನ್ಯಗಳು ಮತ್ತು ಅಗತ್ಯ ವಸ್ತುಗಳನ್ನು ಖರೀದಿಸಲು ಕರ್ನಾಟಕ ಸರ್ಕಾರವು ರಾಜ್ಯದ ನಿವಾಸಿಗಳಿಗೆ ನೀಡುವ ಅಧಿಕೃತ ದಾಖಲೆ.",
    benefits: [
      "Get free or highly subsidized rice, wheat, and ragi under the Anna Bhagya scheme.",
      "Acts as official proof of family address and household members.",
      "Required to apply for state-sponsored healthcare benefits (AB-ARK card).",
      "Essential for getting free electricity benefits under the Gruha Jyothi scheme."
    ],
    benefitsKn: [
      "ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆಯ ಅಡಿಯಲ್ಲಿ ಉಚಿತ ಅಥವಾ ಅತ್ಯಂತ ಕಡಿಮೆ ದರದಲ್ಲಿ ಅಕ್ಕಿ, ಗೋಧಿ ಮತ್ತು ರಾಗಿಯಂತಹ ಪಡಿತರ ಧಾನ್ಯಗಳ ಪಡೆಯುವಿಕೆ.",
      "ಕುಟುಂಬದ ಸದಸ್ಯರ ವಿವರಗಳು ಮತ್ತು ವಾಸಸ್ಥಳದ ಅಧಿಕೃತ ಸರ್ಕಾರದ ದೃಢೀಕೃತ ಪುರಾವೆ.",
      "ಆಯುಷ್ಮಾನ್ ಭಾರತ್-ಆರೋಗ್ಯ ಕರ್ನಾಟಕ (AB-ARK) ವಿಮಾ ಸೌಲಭ್ಯ ಪಡೆಯಲು ಪ್ರಮುಖ ದಾಖಲೆ.",
      "ರಾಜ್ಯ ಸರ್ಕಾರದ ಉಚಿತ ವಿದ್ಯುತ್ ನೀಡುವ 'ಗೃಹ ಜ್ಯೋತಿ' ಯೋಜನೆಗೆ ನೋಂದಾಯಿಸಲು ಕಡ್ಡಾಯ."
    ],
    howToObtain: "Eligible citizens can apply for a new Ration Card (APL/BPL) online via the Food Department portal during specific application windows. Alternatively, you can visit the nearest Grama One, Karnataka One, or Bangalore One center with family Aadhaar details.",
    howToObtainKn: "ಅರ್ಹ ನಾಗರಿಕರು ಹೊಸ ರೇಷನ್ ಕಾರ್ಡ್ (APL/BPL) ಗಾಗಿ ಆಹಾರ ಇಲಾಖೆಯ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಿಗದಿತ ಅವಧಿಯಲ್ಲಿ ಆನ್‌ಲೈನ್ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು. ಅಥವಾ ನಿಮ್ಮ ಹತ್ತಿರದ ಗ್ರಾಮ ಒನ್, ಕರ್ನಾಟಕ ಒನ್ ಅಥವಾ ಬೆಂಗಳೂರು ಒನ್ ನಾಗರಿಕ ಸೇವಾ ಕೇಂದ್ರಗಳಿಗೆ ಕುಟುಂಬದ ಸದಸ್ಯರ ಆಧಾರ್ ವಿವರಗಳೊಂದಿಗೆ ಭೇಟಿ ನೀಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು.",
    officialUrl: "https://ahara.kar.nic.in/"
  },
  {
    id: "voter-id",
    name: "Voter ID Card (EPIC)",
    nameKn: "ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ (Voter ID)",
    category: "identity",
    categoryKn: "ಗುರುತಿನ ಚೀಟಿ",
    categoryEn: "Identity Card",
    type: "national",
    typeKn: "ರಾಷ್ಟ್ರೀಯ",
    typeEn: "National",
    agency: "Election Commission of India (ECI)",
    agencyKn: "ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗ (ECI)",
    description: "An identity document issued by the ECI to adult citizens to cast votes in elections and serve as general identification.",
    descriptionKn: "ಭಾರತೀಯ ನಾಗರಿಕರಿಗೆ ಮತದಾನದ ಹಕ್ಕನ್ನು ಚಲಾಯಿಸಲು ಮತ್ತು ಅಧಿಕೃತ ಗುರುತಿಗಾಗಿ ಭಾರತೀಯ ಚುನಾವಣಾ ಆಯೋಗವು ನೀಡುವ ಭಾವಚಿತ್ರವಿರುವ ಗುರುತಿನ ಚೀಟಿ.",
    benefits: [
      "Provides the constitutional right to cast your vote in democratic elections.",
      "Serves as an officially accepted photo identity and age proof.",
      "Enables downloading the digital version of your Voter ID (e-EPIC) from anywhere."
    ],
    benefitsKn: [
      "ಪ್ರಜಾಪ್ರಭುತ್ವದ ಚುನಾವಣೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಅಮೂಲ್ಯವಾದ ಮತ ಚಲಾಯಿಸುವ ಸಾಂವಿಧಾನಿಕ ಹಕ್ಕು ಲಭ್ಯ.",
      "ಸರ್ಕಾರದಿಂದ ಮಾನ್ಯತೆ ಪಡೆದ ಅಧಿಕೃತ ಭಾವಚಿತ್ರವಿರುವ ವಯಸ್ಸು ಮತ್ತು ವಿಳಾಸದ ಪ್ರಮುಖ ಪುರಾವೆ.",
      "ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಇ-ಮತದಾರರ ಗುರುತಿನ ಚೀಟಿ (e-EPIC) ಯನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ಸೌಲಭ್ಯ."
    ],
    howToObtain: "Register online by creating an account on the National Voters Service Portal (Voter Portal). Fill out Form 6 for a new voter registration, upload a passport photo, age proof, and address proof. Once approved, the physical card is printed and delivered by Speed Post.",
    howToObtainKn: "ರಾಷ್ಟ್ರೀಯ ಮತದಾರರ ಸೇವಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ (Voters ECI Portal) ನಾಗರಿಕರ ಖಾತೆಯನ್ನು ರಚಿಸಿಕೊಂಡು ಆನ್‌ಲೈನ್ ಮೂಲಕ ನೋಂದಾಯಿಸಿ. ಹೊಸ ಮತದಾರರ ನೋಂದಣಿಗಾಗಿ ಫಾರ್ಮ್ 6 ಅನ್ನು ಭರ್ತಿ ಮಾಡಿ, ಭಾವಚಿತ್ರ, ವಯಸ್ಸು ಮತ್ತು ವಿಳಾಸದ ಪುರಾವೆ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಅನುಮೋದನೆಯಾದ ನಂತರ ಕಾರ್ಡ್ ಅನ್ನು ಸ್ಪೀಡ್ ಪೋಸ್ಟ್ ಮೂಲಕ ಮನೆಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ.",
    officialUrl: "https://voters.eci.gov.in/"
  },
  {
    id: "pan-card",
    name: "PAN Card",
    nameKn: "ಪ್ಯಾನ್ ಕಾರ್ಡ್ (PAN)",
    category: "identity",
    categoryKn: "ಗುರುತಿನ ಚೀಟಿ",
    categoryEn: "Identity Card",
    type: "national",
    typeKn: "ರಾಷ್ಟ್ರೀಯ",
    typeEn: "National",
    agency: "Income Tax Department, Government of India",
    agencyKn: "ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆ, ಭಾರತ ಸರ್ಕಾರ",
    description: "A 10-character alphanumeric identifier issued by the Income Tax Department to track financial transactions and prevent tax evasion.",
    descriptionKn: "ಹಣಕಾಸು ವಹಿವಾಟುಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲು ಮತ್ತು ತೆರಿಗೆ ಸುಧಾರಣೆಗಾಗಿ ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆಯು ವ್ಯಕ್ತಿಗಳಿಗೆ ನೀಡುವ 10 ಅಕ್ಷರಗಳ ವಿಶಿಷ್ಟ ಆಲ್ಫಾನ್ಯೂಮರಿಕ್ ಸಂಖ್ಯೆ.",
    benefits: [
      "Mandatory for filing Income Tax Returns (ITR).",
      "Required for opening bank accounts, taking loans, and investing in mutual funds or stocks.",
      "Mandatory for financial transactions exceeding ₹50,000.",
      "Serves as a reliable, lifetime valid photo identity proof."
    ],
    benefitsKn: [
      "ಆದಾಯ ತೆರಿಗೆ ರಿಟರ್ನ್ಸ್ (ITR) ಸಕಾಲದಲ್ಲಿ ಸಲ್ಲಿಸಲು ಕಡ್ಡಾಯ ದಾಖಲೆ.",
      "ಹೊಸ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳನ್ನು ತೆರೆಯಲು, ಸಾಲ ಪಡೆಯಲು, ಮ್ಯೂಚುವಲ್ ಫಂಡ್ ಮತ್ತು ಷೇರು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡಲು ಅಗತ್ಯ.",
      "₹50,000 ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಬ್ಯಾಂಕ್ ನಗದು ವ್ಯವಹಾರಗಳಿಗೆ ಕಡ್ಡಾಯ.",
      "ಜೀವಮಾನವಿಡೀ ವ್ಯಾಲಿಡಿಟಿ ಹೊಂದಿರುವ ಅತ್ಯಂತ ನಂಬಿಕಸ್ಥ ಭಾವಚಿತ್ರವಿರುವ ಗುರುತಿನ ಪುರಾವೆ."
    ],
    howToObtain: "Apply online via the NSDL/UTIITSL portal by filling Form 49A and paying a nominal fee. You can also generate an Instant e-PAN for free in just 10 minutes on the Income Tax e-Filing portal using Aadhaar-based OTP verification.",
    howToObtainKn: "NSDL ಅಥವಾ UTIITSL ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಫಾರ್ಮ್ 49A ಭರ್ತಿ ಮಾಡಿ, ಸಣ್ಣ ಶುಲ್ಕ ಪಾವತಿಸುವ ಮೂಲಕ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು. ಅಥವಾ ನಿಮ್ಮ ಆಧಾರ್ ಲಿಂಕ್ ಆದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಬರುವ OTP ಬಳಸಿಕೊಂಡು ಆದಾಯ ತೆರಿಗೆ ಇ-ಫೈಲಿಂಗ್ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಕೇವಲ 10 ನಿಮಿಷಗಳಲ್ಲಿ ಉಚಿತವಾಗಿ ಇನ್‌ಸ್ಟಂಟ್ ಇ-ಪ್ಯಾನ್ (e-PAN) ಪಡೆಯಬಹುದು.",
    officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html"
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    nameKn: "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ (PM-JAY)",
    category: "health",
    categoryKn: "ಆರೋಗ್ಯ",
    categoryEn: "Health & Insurance",
    type: "national",
    typeKn: "ರಾಷ್ಟ್ರೀಯ",
    typeEn: "National",
    agency: "National Health Authority (NHA), Government of India",
    agencyKn: "ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಪ್ರಾಧಿಕಾರ (NHA), ಭಾರತ ಸರ್ಕಾರ",
    description: "The world's largest government-funded healthcare program providing secondary and tertiary care hospitalization cover.",
    descriptionKn: "ದ್ವಿತೀಯ ಮತ್ತು ತೃತೀಯ ಹಂತದ ಆಸ್ಪತ್ರೆ ಚಿಕಿತ್ಸೆಗಳ ವೆಚ್ಚ ಭರಿಸಲು ಭಾರತ ಸರ್ಕಾರವು ನಡೆಸುತ್ತಿರುವ ವಿಶ್ವದ ಅತಿ ದೊಡ್ಡ ಆರೋಗ್ಯ ವಿಮಾ ಯೋಜನೆ.",
    benefits: [
      "Health coverage of up to ₹5 Lakhs per family per year.",
      "Covers over 3 days of pre-hospitalization and 15 days post-hospitalization expenses.",
      "Completely cashless and paperless access to healthcare services at empanelled public and private hospitals."
    ],
    benefitsKn: [
      "ಪ್ರತಿ ಅರ್ಹ ಕುಟುಂಬಕ್ಕೆ ವರ್ಷಕ್ಕೆ ₹5 ಲಕ್ಷಗಳವರೆಗೆ ಉಚಿತ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸಾ ರಕ್ಷಣೆ.",
      "ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲಾಗುವ 3 ದಿನಗಳ ಮುಂಚಿನ ಮತ್ತು ಬಿಡುಗಡೆಯಾದ ನಂತರದ 15 ದಿನಗಳವರೆಗಿನ ಔಷಧ ವೆಚ್ಚದ ಭರಿಸುವಿಕೆ.",
      "ದೇಶಾದ್ಯಂತದ ಯಾವುದೇ ನೊಂದಾಯಿತ ಸರ್ಕಾರಿ ಮತ್ತು ಪ್ರಮುಖ ಖಾಸಗಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ ನಗದು ರಹಿತ (Cashless) ಚಿಕಿತ್ಸೆ."
    ],
    howToObtain: "Check if your family is listed under eligible categories on the PM-JAY Beneficiary Portal. If eligible, complete your Aadhaar e-KYC online, or visit an empanelled hospital or Common Service Centre (CSC) to print your Ayushman Card.",
    howToObtainKn: "ಪಿಎಂ-ಜೇ (PM-JAY) ಬೆನಿಫಿಶಿಯರಿ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ನಿಮ್ಮ ರೇಷನ್ ಕಾರ್ಡ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ. ಅರ್ಹರಾಗಿದ್ದರೆ, ಆಧಾರ್ ಇ-ಕೆವೈಸಿ ಪೂರ್ಣಗೊಳಿಸುವ ಮೂಲಕ ಪೋರ್ಟಲ್‌ನಿಂದ ನೇರವಾಗಿ ಆಯುಷ್ಮಾನ್ ಕಾರ್ಡ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಪ್ರಿಂಟ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು.",
    officialUrl: "https://beneficiary.nha.gov.in/"
  },
  {
    id: "seva-sindhu",
    name: "Seva Sindhu",
    nameKn: "ಸೇವಾ ಸಿಂಧು ಪೋರ್ಟಲ್",
    category: "citizen",
    categoryKn: "ನಾಗರಿಕ ಸೇವೆಗಳು",
    categoryEn: "Citizen Services",
    type: "state",
    typeKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ",
    typeEn: "Karnataka State",
    agency: "Department of Electronic Delivery of Citizen Services, Govt. of Karnataka",
    agencyKn: "ಇ-ಆಡಳಿತ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ",
    description: "An integrated portal designed by the Government of Karnataka to deliver all government department services to the doorsteps of citizens.",
    descriptionKn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಎಲ್ಲಾ ಇಲಾಖೆಗಳ ನಾಗರಿಕ ಸೇವೆಗಳನ್ನು ಒಂದೇ ಸೂರಿನಡಿ ಆನ್‌ಲೈನ್ ಮೂಲಕ ಒದಗಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಏಕೀಕೃತ ಪೋರ್ಟಲ್.",
    benefits: [
      "Access to over 800+ services online from various state departments.",
      "Apply for vital certificates: Caste, Income, Residence, and Land certificates.",
      "Apply for direct benefit social security schemes like Gruha Lakshmi, old-age pensions, and crop compensations."
    ],
    benefitsKn: [
      "ವಿವಿಧ ಇಲಾಖೆಗಳ 800ಕ್ಕೂ ಹೆಚ್ಚು ಸೇವೆಗಳು ಮತ್ತು ಯೋಜನೆಗಳಿಗೆ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ನೇರ ಪ್ರವೇಶ.",
      "ಪ್ರಮುಖ ಪ್ರಮಾಣಪತ್ರಗಳಾದ ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ವಾಸಸ್ಥಳ ದೃಢೀಕರಣ ಪತ್ರಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ.",
      "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ, ವೃದ್ಧಾಪ್ಯ ವೇತನ, ವಿಕಲಚೇತನರ ವೇತನ ಮತ್ತು ಬೆಳೆ ಹಾನಿ ಪರಿಹಾರಕ್ಕೆ ಸುಲಭವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ."
    ],
    howToObtain: "Register as a new user on the Seva Sindhu Citizen Portal. Once registered, log in, search for the service you need, upload required documents (Aadhaar, income details, photo), pay the service fee online (if applicable), and download the certified document.",
    howToObtainKn: "ಸೇವಾ ಸಿಂಧು ನಾಗರಿಕ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಬಳಸಿ ನೂತನ ಸದಸ್ಯರಾಗಿ ನೊಂದಾಯಿಸಿಕೊಳ್ಳಿ. ಲಾಗಿನ್ ಆದ ಬಳಿಕ ನಿಮಗೇ ಬೇಕಾದ ಸೇವೆಯನ್ನು ಹುಡುಕಿ, ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. ಅನುಮೋದನೆಯಾದ ನಂತರ ಪ್ರಮಾಣಪತ್ರವನ್ನು ನೇರವಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು.",
    officialUrl: "https://sevasindhu.karnataka.gov.in/"
  },
  {
    id: "bhoomi",
    name: "Bhoomi (RTC & Land Records)",
    nameKn: "ಭೂಮಿ (ಪಹಣಿ ಮತ್ತು ಜಮೀನು ದಾಖಲೆಗಳು)",
    category: "citizen",
    categoryKn: "ನಾಗರಿಕ ಸೇವೆಗಳು",
    categoryEn: "Citizen Services",
    type: "state",
    typeKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ",
    typeEn: "Karnataka State",
    agency: "Revenue Department, Government of Karnataka",
    agencyKn: "ಕಂದಾಯ ಇಲಾಖೆ, ಕರ್ನಾಟಕ ಸರ್ಕಾರ",
    description: "A prestigious project of the Karnataka Government for online management of land records and land ownership verification.",
    descriptionKn: "ಜಮೀನಿನ ಮಾಲೀಕತ್ವದ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಕಂದಾಯ ಇಲಾಖೆಯ ಮಹತ್ವದ ಆನ್‌ಲೈನ್ ಪೋರ್ಟಲ್.",
    benefits: [
      "View and download RTC (Pahani/Form 16) from anywhere.",
      "Check Mutation (ownership transfer) status and historical land records.",
      "View land dispute statuses and official survey maps of agriculture lands."
    ],
    benefitsKn: [
      "ಎಲ್ಲಿದ್ದರೂ ನಿಮ್ಮ ಜಮೀನಿನ ಆರ್.ಟಿ.ಸಿ (RTC - ಪಹಣಿ/ಫಾರಂ 16) ಯನ್ನು ವೀಕ್ಷಣೆ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡುವ ಸೌಲಭ್ಯ.",
      "ಜಮೀನಿನ ಮ್ಯುಟೇಷನ್ (ಖಾತೆ ಬದಲಾವಣೆ) ಪ್ರಕ್ರಿಯೆಯ ಸ್ಥಿತಿ ಹಾಗೂ ಹಳೆಯ ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ.",
      "ಕೋರ್ಟ್ ವ್ಯಾಜ್ಯಗಳ ವಿವರಗಳು ಹಾಗೂ ಕೃಷಿ ಭೂಮಿಯ ಅಧಿಕೃತ ಸರ್ವೆ ನಕ್ಷೆಗಳ ವೀಕ್ಷಣೆ."
    ],
    howToObtain: "Visit the Bhoomi Online Land Records portal. Choose the land details (District, Taluk, Hobli, Village, Survey Number, and Surnoc). You can view basic details for free, or pay a nominal fee of ₹15 online to download digitally signed, legally valid official RTCs.",
    howToObtainKn: "ಭೂಮಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ. ಅಲ್ಲಿ ಭೂಮಿಯ ವಿವರಗಳಾದ ಜಿಲ್ಲೆ, ತಾಲೂಕು, ಹೋಬಳಿ, ಗ್ರಾಮ ಮತ್ತು ಸರ್ವೆ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ. ಉಚಿತವಾಗಿ ಪಹಣಿ ವಿವರ ವೀಕ್ಷಿಸಬಹುದು ಅಥವಾ ಕೇವಲ ₹15 ಶುಲ್ಕ ಪಾವತಿಸಿ ಡಿಜಿಟಲ್ ಸಹಿ ಹೊಂದಿದ ಕಾನೂನುಬದ್ಧ ಪಹಣಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು.",
    officialUrl: "https://landrecords.karnataka.gov.in/"
  },
  {
    id: "pmsby",
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    nameKn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಸುರಕ್ಷಾ ಬಿಮಾ ಯೋಜನೆ (PMSBY)",
    category: "health",
    categoryKn: "ಆರೋಗ್ಯ",
    categoryEn: "Health & Insurance",
    type: "national",
    typeKn: "ರಾಷ್ಟ್ರೀಯ",
    typeEn: "National",
    agency: "Ministry of Finance, Government of India",
    agencyKn: "ಹಣಕಾಸು ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ",
    description: "An accident insurance scheme offering high coverage at an extremely low annual premium for all bank account holders.",
    descriptionKn: "ಎಲ್ಲಾ ಬ್ಯಾಂಕ್ ಖಾತೆದಾರರಿಗೆ ಅತ್ಯಂತ ಕಡಿಮೆ ವಾರ್ಷಿಕ ಪ್ರೀಮಿಯಂ ದರದಲ್ಲಿ ಹೆಚ್ಚಿನ ವೈಯಕ್ತಿಕ ಅಪಘಾತ ವಿಮಾ ರಕ್ಷಣೆ ನೀಡುವ ಕೇಂದ್ರ ಸರ್ಕಾರದ ಯೋಜನೆ.",
    benefits: [
      "Accidental death insurance coverage of ₹2 Lakhs.",
      "Total and irrecoverable loss of both eyes or loss of hands/feet cover of ₹2 Lakhs.",
      "Partial disability coverage of ₹1 Lakh.",
      "Extremely low premium of just ₹20 per year, auto-debited annually."
    ],
    benefitsKn: [
      "ಅಪಘಾತದಿಂದ ಸಾವು ಸಂಭವಿಸಿದರೆ ಕುಟುಂಬಕ್ಕೆ ₹2 ಲಕ್ಷಗಳ ಪರಿಹಾರ ವಿಮೆ.",
      "ಅಪಘಾತದಿಂದ ಎರಡು ಕಣ್ಣುಗಳು ಅಥವಾ ಎರಡು ಕೈ-ಕಾಲುಗಳು ಶಾಶ್ವತವಾಗಿ ನಿಷ್ಕ್ರಿಯಗೊಂಡರೆ ₹2 ಲಕ್ಷಗಳ ರಕ್ಷಣೆ.",
      "ಅಪಘಾತದಿಂದ ಒಂದು ಕಣ್ಣು ಅಥವಾ ಒಂದು ಕೈ-ಕಾಲು ಕಳೆದುಕೊಂಡರೆ (ಭಾಗಶಃ ಅಂಗವೈಕಲ್ಯ) ₹1 ಲಕ್ಷ ವಿಮೆ.",
      "ವಾರ್ಷಿಕ ಕೇವಲ ₹20 ಪ್ರೀಮಿಯಂ ದರ ಹೊಂದಿದ್ದು, ಪ್ರತಿ ವರ್ಷ ಜೂನ್ ತಿಂಗಳಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆಯಿಂದ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಡಿತಗೊಳ್ಳುತ್ತದೆ."
    ],
    howToObtain: "Any person aged 18 to 70 years holding a savings bank account can enroll. Visit the bank branch where you have a savings account or log in via Net Banking to submit the PMSBY Consent Form for auto-debit.",
    howToObtainKn: "ಉಳಿತಾಯ ಖಾತೆಯನ್ನು ಹೊಂದಿರುವ 18 ರಿಂದ 70 ವರ್ಷ ವಯಸ್ಸಿನ ಯಾರು ಬೇಕಾದರೂ ಸೇರಬಹುದು. ನಿಮ್ಮ ಖಾತೆಯಿರುವ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ನಿಮ್ಮ ಮೊಬೈಲ್ ಬ್ಯಾಂಕಿಂಗ್/ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಕ 'PMSBY' ನೋಂದಣಿ ಫಾರ್ಮ್ ಅನ್ನು ತುಂಬಿ ಆಟೋ-ಡೆಬಿಟ್ ಸೌಲಭ್ಯ ಆಕ್ಟಿವೇಟ್ ಮಾಡಿ.",
    officialUrl: "https://www.jansuraksha.gov.in/"
  },
  {
    id: "pmjjby",
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    nameKn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಜೀವನ ಜ್ಯೋತಿ ಬಿಮಾ ಯೋಜನೆ (PMJJBY)",
    category: "health",
    categoryKn: "ಆರೋಗ್ಯ",
    categoryEn: "Health & Insurance",
    type: "national",
    typeKn: "ರಾಷ್ಟ್ರೀಯ",
    typeEn: "National",
    agency: "Ministry of Finance, Government of India",
    agencyKn: "ಹಣಕಾಸು ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ",
    description: "A one-year life insurance scheme renewable from year to year, offering life cover for death due to any reason.",
    descriptionKn: "ಯಾವುದೇ ಕಾರಣದಿಂದ ಮರಣ ಹೊಂದಿದರೂ ವಿಮಾದಾರರ ಕುಟುಂಬಕ್ಕೆ ಜೀವ ವಿಮಾ ರಕ್ಷಣೆ ಒದಗಿಸುವ ಕೇಂದ್ರ ಸರ್ಕಾರದ ಮಹತ್ವದ ಯೋಜನೆ.",
    benefits: [
      "Life insurance cover of ₹2 Lakhs payable to the nominee in case of death of the subscriber due to any cause.",
      "Available to citizens aged between 18 and 50 years.",
      "Low premium of ₹436 per annum auto-debited from the bank account."
    ],
    benefitsKn: [
      "ವಿಮಾದಾರರು ಯಾವುದೇ ಕಾರಣದಿಂದ ಮರಣ ಹೊಂದಿದರೂ ಅವರ ಕುಟುಂಬದ ನಾಮಿನಿಗೆ ₹2 ಲಕ್ಷ ಜೀವ ವಿಮಾ ಪರಿಹಾರ ಪಾವತಿ.",
      "18 ರಿಂದ 50 ವರ್ಷ ವಯಸ್ಸಿನ ಬ್ಯಾಂಕ್ ಉಳಿತಾಯ ಖಾತೆ ಹೊಂದಿರುವ ಎಲ್ಲಾ ನಾಗರಿಕರಿಗೂ ಲಭ್ಯ.",
      "ವಾರ್ಷಿಕ ಕೇವಲ ₹436 ಪ್ರೀಮಿಯಂ ದರ ಹೊಂದಿದ್ದು ಬ್ಯಾಂಕ್ ಖಾತೆಯಿಂದ ಆಟೋ-ಡೆಬಿಟ್ ಆಗುತ್ತದೆ."
    ],
    howToObtain: "Enroll by contacting your savings bank branch or via Net Banking. Fill out the application and consent form for auto-debit of premium. Ensure sufficient balance in your bank account in May/June for renewal.",
    howToObtainKn: "ನಿಮ್ಮ ಉಳಿತಾಯ ಖಾತೆಯಿರುವ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ ಅಥವಾ ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್ ಮೂಲಕ ನೇರವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. ಪ್ರೀಮಿಯಂ ಮೊತ್ತವನ್ನು ಕಡಿತಗೊಳಿಸಲು ಸ್ವಯಂ-ಕಡಿತದ ಸಮ್ಮತಿ ಫಾರ್ಮ್ ಅನ್ನು ಭರ್ತಿ ಮಾಡಿ ನೀಡಿ.",
    officialUrl: "https://www.jansuraksha.gov.in/"
  },
  {
    id: "parivahan",
    name: "Driving License & Vehicle Services (Parivahan)",
    nameKn: "ಚಾಲನಾ ಪರವಾನಗಿ ಮತ್ತು ವಾಹನ ಸೇವೆಗಳು (ಪರಿವಾಹನ)",
    category: "citizen",
    categoryKn: "ನಾಗರಿಕ ಸೇವೆಗಳು",
    categoryEn: "Citizen Services",
    type: "national",
    typeKn: "ರಾಷ್ಟ್ರೀಯ",
    typeEn: "National",
    agency: "Ministry of Road Transport and Highways (MoRTH), Govt. of India",
    agencyKn: "ರಸ್ತೆ ಸಾರಿಗೆ ಮತ್ತು ಹೆದ್ದಾರಿ ಸಚಿವಾಲಯ (MoRTH), ಭಾರತ ಸರ್ಕಾರ",
    description: "Unified national portal offering driving license tests, vehicle registration certificates (RC), and road tax payment services.",
    descriptionKn: "ಚಾಲನಾ ಪರವಾನಗಿ (DL), ವಾಹನ ನೋಂದಣಿ (RC), ರಸ್ತೆ ತೆರಿಗೆ ಮತ್ತು ವಾಹನ ಮಾಲೀಕತ್ವ ವರ್ಗಾವಣೆಯನ್ನು ನಿರ್ವಹಿಸುವ ದೇಶದ ಏಕೀಕೃತ ಸಾರಿಗೆ ಪೋರ್ಟಲ್.",
    benefits: [
      "Apply online for a Learning License (LL) and permanent Driving License (DL).",
      "Access and download digitally verified registration certificates (RC).",
      "Pay road tax, renewal fees, and check e-challan status online."
    ],
    benefitsKn: [
      "ಕಲಿಕಾ ಪರವಾನಗಿ (LL) ಮತ್ತು ಶಾಶ್ವತ ಚಾಲನಾ ಪರವಾನಗಿ (DL) ಗಾಗಿ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಸರಳ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ.",
      "ನಿಮ್ಮ ವಾಹನದ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ (RC) ಯ ಡಿಜಿಟಲ್ ಪ್ರತಿಯನ್ನು ವೀಕ್ಷಣೆ ಮತ್ತು ಡೌನ್‌ಲೋಡ್.",
      "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ರಸ್ತೆ ತೆರಿಗೆ ಪಾವತಿ ಮತ್ತು ವಾಹನದ ದಂಡದ (e-challan) ಸ್ಥಿತಿ ವೀಕ್ಷಣೆ."
    ],
    howToObtain: "Visit the Sarathi (for DL) or Vahan (for RC) sections on the Parivahan portal. Select 'Karnataka' or your respective state, complete the forms, upload documents (age/address proofs), pay the RTO fee, and schedule your test or inspection appointment online.",
    howToObtainKn: "ಪರಿವಾಹನ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ ಸಾರಥಿ (DL ಗಾಗಿ) ಅಥವಾ ವಾಹನ (RC ಗಾಗಿ) ವಿಭಾಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಕರ್ನಾಟಕ ರಾಜ್ಯವನ್ನು ಆಯ್ದು ಅಗತ್ಯ ಫಾರ್ಮ್ ತುಂಬಿ, ವಯಸ್ಸು ಮತ್ತು ವಿಳಾಸದ ದಾಖಲೆ ಸಲ್ಲಿಸಿ ಶುಲ್ಕ ಪಾವತಿಸಿ. ನಂತರ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಟೆಸ್ಟ್ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ ಆರ್‌ಟಿಒ (RTO) ಕಚೇರಿಗೆ ಭೇಟಿ ನೀಡಿ.",
    officialUrl: "https://parivahan.gov.in/"
  }
];

export function ServicesClient({ locale }: { locale: Locale }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "national" | "state">("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredServices = SERVICES_DATA.filter((service) => {
    // 1. Filter by Tab (Authority)
    if (activeTab !== "all" && service.type !== activeTab) {
      return false;
    }

    // 2. Filter by Category
    if (activeCategory !== "all" && service.category !== activeCategory) {
      return false;
    }

    // 3. Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = service.name.toLowerCase().includes(q) || service.nameKn.toLowerCase().includes(q);
      const matchDesc = service.description.toLowerCase().includes(q) || service.descriptionKn.toLowerCase().includes(q);
      const matchAgency = service.agency.toLowerCase().includes(q) || service.agencyKn.toLowerCase().includes(q);
      return matchName || matchDesc || matchAgency;
    }

    return true;
  });

  const categories = [
    { id: "all", kn: "ಎಲ್ಲಾ ಸೇವೆಗಳು", en: "All Categories" },
    { id: "identity", kn: "ಗುರುತಿನ ಚೀಟಿಗಳು", en: "Identity Cards" },
    { id: "welfare", kn: "ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣ", en: "Social Welfare" },
    { id: "health", kn: "ಆರೋಗ್ಯ ಮತ್ತು ವಿಮೆ", en: "Health & Insurance" },
    { id: "citizen", kn: "ನಾಗರಿಕ ಸೇವೆಗಳು", en: "Citizen Services" }
  ];

  return (
    <article className="kq-container py-8 md:py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)] bg-[var(--secondary)]/10 px-3 py-1 rounded-full select-none">
          {locale === "kn" ? "ಅಧಿಕೃತ ನಾಗರಿಕ ಸೇವೆಗಳು" : "Official Citizen Services"}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[var(--primary)] mt-3 mb-4 leading-tight">
          {locale === "kn" ? "ಸರ್ಕಾರಿ ಸೇವೆಗಳ ಅಧಿಕೃತ ಕೈಪಿಡಿ" : "Official Government Services Directory"}
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
          {locale === "kn"
            ? "ಕೇಂದ್ರ ಹಾಗೂ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ನಾಗರಿಕ ಸೇವೆಗಳ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ. ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಂದ ವಂಚನೆಗೊಳಗಾಗುವುದನ್ನು ತಡೆಯಲು ಕೇವಲ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್ ಲಿಂಕ್‌ಗಳನ್ನು ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನವನ್ನು ಇಲ್ಲಿ ಒದಗಿಸಲಾಗಿದೆ."
            : "A verified directory of primary citizen services provided by the Central and Karnataka State Governments. Find instructions on how to obtain these documents and access direct, secure links to official .gov.in and .kar.nic.in domains."}
        </p>
      </div>

      {/* Safety Alert Block */}
      <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 mb-8 flex gap-3 text-amber-900 max-w-4xl mx-auto">
        <svg className="w-5 h-5 shrink-0 mt-0.5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <div className="text-xs md:text-sm">
          <strong className="font-bold">
            {locale === "kn" ? "ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ:" : "Security Warning:"}
          </strong>{" "}
          {locale === "kn"
            ? "ಆಧಾರ್, ಪ್ಯಾನ್, ಮತ್ತು ಪಡಿತರ ಚೀಟಿಗಳ ಹೆಸರಿನಲ್ಲಿ ಹಲವು ಖಾಸಗಿ ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು ವಂಚಿಸುತ್ತಿವೆ. ಯಾವಾಗಲೂ ವೆಬ್ ವಿಳಾಸದಲ್ಲಿ ಕೊನೆಯಲ್ಲಿ '.gov.in' ಅಥವಾ '.kar.nic.in' ಇರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ. ನಾವು ಒದಗಿಸುವ ಎಲ್ಲಾ ಲಿಂಕ್‌ಗಳು 100% ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮೂಲಗಳಾಗಿವೆ."
            : "Many fraudulent websites mimic official portals for Aadhaar, PAN, and Ration Cards to steal data or charge illegal fees. Always verify that the website URL ends with '.gov.in' or '.nic.in'. All links provided below redirect strictly to official government portals."}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="kq-card p-5 md:p-6 mb-8 max-w-4xl mx-auto shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={locale === "kn" ? "ಸೇವೆ, ಇಲಾಖೆ ಅಥವಾ ಕೀವರ್ಡ್ ಹುಡುಕಿ..." : "Search service, department, or keyword..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--secondary)] text-sm bg-[var(--surface-soft)] text-[var(--foreground)]"
            />
            <svg className="w-5 h-5 absolute left-3 top-3 text-[var(--muted)]/50" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* Authority Tabs */}
          <div className="flex gap-1.5 p-1 bg-[var(--surface-soft)] rounded-lg border border-[var(--border)] self-start">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer select-none ${
                activeTab === "all"
                  ? "bg-white text-[var(--primary)] shadow-sm border border-[var(--border)]/30"
                  : "text-[var(--muted)] hover:text-[var(--primary)]"
              }`}
            >
              {locale === "kn" ? "ಎಲ್ಲಾ ಸೇವೆಗಳು" : "All Authority"}
            </button>
            <button
              onClick={() => setActiveTab("national")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer select-none ${
                activeTab === "national"
                  ? "bg-white text-[var(--primary)] shadow-sm border border-[var(--border)]/30"
                  : "text-[var(--muted)] hover:text-[var(--primary)]"
              }`}
            >
              {locale === "kn" ? "ಕೇಂದ್ರ ಸರ್ಕಾರ" : "Central Gov"}
            </button>
            <button
              onClick={() => setActiveTab("state")}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer select-none ${
                activeTab === "state"
                  ? "bg-white text-[var(--primary)] shadow-sm border border-[var(--border)]/30"
                  : "text-[var(--muted)] hover:text-[var(--primary)]"
              }`}
            >
              {locale === "kn" ? "ಕರ್ನಾಟಕ ರಾಜ್ಯ" : "Karnataka State"}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-5 border-t border-[var(--border)]/40 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none border ${
                activeCategory === cat.id
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-[var(--muted)] border-[var(--border)] hover:bg-[var(--surface-soft)]"
              }`}
            >
              {locale === "kn" ? cat.kn : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="kq-card flex flex-col p-5 md:p-6 hover:shadow-md transition-shadow duration-300 relative border-l-4 border-l-[var(--secondary)]"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  service.type === "state"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-sky-50 text-sky-850 border-sky-200"
                }`}>
                  {locale === "kn" ? service.typeKn : service.typeEn}
                </span>
                <span className="text-[10px] font-extrabold uppercase text-[var(--muted)] bg-[var(--surface-soft)] px-2 py-0.5 rounded border border-[var(--border)]/40">
                  {locale === "kn" ? service.categoryKn : service.categoryEn}
                </span>
              </div>

              {/* Title & Agency */}
              <h2 className="font-serif text-lg md:text-xl font-bold text-[var(--primary)] mb-1">
                {locale === "kn" ? service.nameKn : service.name}
              </h2>
              <p className="text-[11px] font-semibold text-[var(--muted)]/75 mb-4">
                {locale === "kn" ? `ಇಲಾಖೆ: ${service.agencyKn}` : `Provided by: ${service.agency}`}
              </p>

              {/* Description */}
              <p className="text-xs md:text-sm text-[var(--muted)] mb-5 leading-relaxed">
                {locale === "kn" ? service.descriptionKn : service.description}
              </p>

              {/* Benefits Section */}
              <div className="bg-[var(--surface-soft)] rounded-lg p-4 mb-5 flex-1">
                <h3 className="text-xs font-extrabold uppercase text-[var(--primary)] tracking-wider mb-2.5">
                  {locale === "kn" ? "ಪ್ರಮುಖ ಸೌಲಭ್ಯಗಳು / ಸೇವೆಗಳು:" : "Key Benefits / Services:"}
                </h3>
                <ul className="space-y-2">
                  {(locale === "kn" ? service.benefitsKn : service.benefits).map((benefit, i) => (
                    <li key={i} className="flex gap-2 text-xs text-[var(--muted)] leading-relaxed">
                      <span className="text-[var(--secondary)] font-bold shrink-0">•</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How to Obtain */}
              <div className="mb-6">
                <h3 className="text-xs font-extrabold uppercase text-[var(--primary)] tracking-wider mb-2">
                  {locale === "kn" ? "ಪಡೆಯುವುದು ಹೇಗೆ / ಅರ್ಜಿ ವಿಧಾನ:" : "How to Apply / Obtain:"}
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {locale === "kn" ? service.howToObtainKn : service.howToObtain}
                </p>
              </div>

              {/* Action Button & Security Link */}
              <div className="mt-auto border-t border-[var(--border)]/40 pt-4 flex flex-col gap-2.5">
                <a
                  href={service.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                >
                  <span>{locale === "kn" ? "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿ" : "Visit Official Government Portal"}</span>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path>
                  </svg>
                </a>
                <div className="text-[9px] text-[var(--muted)]/50 text-center font-mono truncate">
                  {locale === "kn" ? "ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ:" : "Verify:"} {service.officialUrl}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="kq-card p-10 text-center max-w-md mx-auto shadow-sm">
          <svg className="w-12 h-12 text-[var(--muted)]/30 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="font-serif text-lg font-bold text-[var(--primary)] mb-1">
            {locale === "kn" ? "ಯಾವುದೇ ಸೇವೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ" : "No Services Found"}
          </h3>
          <p className="text-xs text-[var(--muted)]">
            {locale === "kn"
              ? "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಸೇವೆಗಳು ಸಿಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಕೀವರ್ಡ್ ಬಳಸಿ ನೋಡಿ."
              : "We couldn't find any services matching your search criteria. Please try a different keyword."}
          </p>
        </div>
      )}

      {/* Bottom Disclaimer */}
      <div className="text-center text-[11px] text-[var(--muted)]/60 max-w-2xl mx-auto mt-12 border-t border-[var(--border)]/40 pt-6">
        {locale === "kn" ? (
          <p>
            ಹಕ್ಕುತ್ಯಾಗ: ಕನ್ನಡಕ್ವಿಜ್ ಕೇವಲ ಮಾಹಿತಿ ಒದಗಿಸುವ ಶೈಕ್ಷಣಿಕ ವೇದಿಕೆಯಾಗಿದೆ. ನಾವು ಯಾವುದೇ ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ನೇರವಾಗಿ ನೀಡುವುದಿಲ್ಲ ಮತ್ತು ಯಾವುದೇ ನಾಗರಿಕರಿಂದ ಹಣವನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ಭೇಟಿ ನೀಡುವಾಗ ಬಳಕೆದಾರರು ಸುರಕ್ಷತಾ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಲು ಕೋರಲಾಗಿದೆ.
          </p>
        ) : (
          <p>
            Disclaimer: KannadaQuiz is an educational platform providing informational guidance. We do not directly issue certificates or insurance policies, nor do we collect payments from citizens. Users are requested to perform due diligence when visiting official government websites.
          </p>
        )}
      </div>
    </article>
  );
}

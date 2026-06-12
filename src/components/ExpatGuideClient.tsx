"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locales";

type CountryGuide = {
  name: string;
  flag: string; // Will store lowercase country code (e.g. 'us', 'au') for flagcdn
  code: string;
  visaTitle: string;
  visaText: string;
  visaSource: string;
  transitTitle: string;
  transitText: string;
  transitSource: string;
  travelTitle: string;
  travelText: string;
  travelSource: string;
  emergencyTitle: string;
  emergencyText: string;
  emergencySource: string;
  communityTitle: string;
  communityText: string;
  communitySource: string;
};

type FinGuide = {
  question: string;
  answer: string;
  source: string;
  sourceUrl: string;
};

const finGuidesMap: Record<Locale, FinGuide[]> = {
  kn: [
    {
      question: "NRE ಮತ್ತು NRO ಬ್ಯಾಂಕ್ ಖಾತೆಗಳ ನಡುವಿನ ಪ್ರಮುಖ ವ್ಯತ್ಯಾಸಗಳೇನು?",
      answer: "ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ (RBI) ನಿಯಮಗಳ ಪ್ರಕಾರ ಅನಿವಾಸಿ ಭಾರತೀಯರು ಭಾರತದಲ್ಲಿ ಎರಡು ರೀತಿಯ ಪ್ರಮುಖ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳನ್ನು ತೆರೆಯಬಹುದು:\n\n1. **NRE (Non-Resident External) ಖಾತೆ**: ವಿದೇಶದಲ್ಲಿ ಗಳಿಸಿದ ಆದಾಯವನ್ನು ಭಾರತೀಯ ರೂಪಾಯಿಗೆ ಪರಿವರ್ತಿಸಿ ಜಮಾ ಮಾಡಲು ಇದನ್ನು ಬಳಸಲಾಗುತ್ತದೆ. ಈ ಖಾತೆಯಲ್ಲಿರುವ ಮೊತ್ತ ಮತ್ತು ಅದರ ಮೇಲಿನ ಬಡ್ಡಿಗೆ ಭಾರತದಲ್ಲಿ ಸಂಪೂರ್ಣ ತೆರಿಗೆ ವಿನಾಯಿತಿ ಇರುತ್ತದೆ. ಅಲ್ಲದೆ, ಈ ಹಣವನ್ನು ಯಾವುದೇ ಮಿತಿಯಿಲ್ಲದೆ ವಿದೇಶಕ್ಕೆ ಮರಳಿ ವರ್ಗಾಯಿಸಬಹುದು (Fully Repatriable).\n\n2. **NRO (Non-Resident Ordinary) ಖಾತೆ**: ಭಾರತದಲ್ಲಿ ಗಳಿಸಿದ ಆದಾಯವನ್ನು (ಉದಾಹರಣೆಗೆ ಬಾಡಿಗೆ, ಡಿವಿಡೆಂಡ್, ಪಿಂಚಣಿ) ನಿರ್ವಹಿಸಲು ಇದನ್ನು ಬಳಸಲಾಗುತ್ತದೆ. ಈ ಖಾತೆಯಲ್ಲಿ ಜಮೆಯಾಗುವ ಬಡ್ಡಿಗೆ 30% ಕ್ಕಿಂತ ಹೆಚ್ಚು ಮೂಲದಲ್ಲೇ ತೆರಿಗೆ ಕಡಿತ (TDS) ಅನ್ವಯಿಸುತ್ತದೆ. ಈ ಖಾತೆಯಿಂದ ಒಂದು ಹಣಕಾಸು ವರ್ಷದಲ್ಲಿ ಗರಿಷ್ಠ 1 ಮಿಲಿಯನ್ ಅಮೆರಿಕನ್ ಡಾಲರ್ ($1,000,000) ವರೆಗೆ ಮಾತ್ರ ವಿದೇಶಕ್ಕೆ ವರ್ಗಾಯಿಸಲು ಅವಕಾಶವಿರುತ್ತದೆ.",
      source: "ಮೂಲ: ಭಾರತೀಯ ರಿಸರ್ವ್ ಬ್ಯಾಂಕ್ (RBI) ವಿದೇಶಿ ವಿನಿಮಯ ನಿರ್ವಹಣಾ ಕಾಯ್ದೆ (FEMA) ನಿಯಮಗಳು.",
      sourceUrl: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=52"
    },
    {
      question: "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರು ಕರ್ನಾಟಕದಲ್ಲಿ ಕೃಷಿ ಭೂಮಿಯನ್ನು ಖರೀದಿಸಬಹುದೇ?",
      answer: "ಭಾರತದ ವಿದೇಶಿ ವಿನಿಮಯ ನಿಯಮಗಳ (FEMA) ಪ್ರಕಾರ, ಅನಿವಾಸಿ ಭಾರತೀಯರು (NRI) ಅಥವಾ ವಿದೇಶಿ ಭಾರತೀಯ ಪೌರತ್ವ ಹೊಂದಿರುವವರು (OCI) ಕರ್ನಾಟಕ ಸೇರಿದಂತೆ ಭಾರತದ ಯಾವುದೇ ರಾಜ್ಯದಲ್ಲಿ ಕೃಷಿ ಭೂಮಿ (Agricultural Land), ತೋಟಗಾರಿಕಾ ಭೂಮಿ (Plantation Property) ಅಥವಾ ಫಾರ್ಮ್ ಹೌಸ್ ಅನ್ನು ಖರೀದಿಸಲು ಕಾನೂನಿನಲ್ಲಿ ಅವಕಾಶವಿಲ್ಲ.\n\nಆದರೆ, ಅವರು ವಸತಿ ಅಪಾರ್ಟ್‌ಮೆಂಟ್‌ಗಳು (Residential), ವಾಣಿಜ್ಯ ಮಳಿಗೆಗಳು (Commercial) ಮತ್ತು ಖಾಲಿ ನಿವೇಶನಗಳನ್ನು ಮುಕ್ತವಾಗಿ ಖರೀದಿಸಬಹುದು. ಕೃಷಿ ಭೂಮಿಯನ್ನು ಕೇವಲ ಆನುವಂಶಿಕವಾಗಿ (Inheritance) ಉಡುಗೊರೆಯಾಗಿ ಪಡೆಯಲು ಮಾತ್ರ ಅವಕಾಶವಿದೆ ಮತ್ತು ಅದನ್ನು ಕೇವಲ ಭಾರತದ ನಿವಾಸಿಗಳಿಗೆ ಮಾತ್ರ ಮಾರಾಟ ಮಾಡಬಹುದಾಗಿದೆ.",
      source: "ಮೂಲ: ಕರ್ನಾಟಕ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ನಿಯಂತ್ರಣ ಪ್ರಾಧಿಕಾರ (RERA) ಮತ್ತು RBI ನಿಯಮಾವಳಿಗಳು.",
      sourceUrl: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=33"
    },
    {
      question: "NRIs ಭಾರತದಲ್ಲಿ ಗಳಿಸಿದ ಆದಾಯಕ್ಕೆ ತೆರಿಗೆ ಹೇಗೆ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ?",
      answer: "ಭಾರತೀಯ ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆಯ ನಿಯಮಗಳ ಪ್ರಕಾರ, ಅನಿವಾಸಿ ಭಾರತೀಯರು (NRIs) ವಿದೇಶದಲ್ಲಿ ಗಳಿಸುವ ಆದಾಯಕ್ಕೆ ಭಾರತದಲ್ಲಿ ತೆರಿಗೆ ಪಾವತಿಸಬೇಕಾಗಿಲ್ಲ. ಆದರೆ ಅವರು ಭಾರತದಲ್ಲಿ ಗಳಿಸುವ ಕೆಳಗಿನ ಆದಾಯಕ್ಕೆ ಭಾರತದ ತೆರಿಗೆ ದರಗಳ ಅನ್ವಯ ತೆರಿಗೆ ಪಾವತಿಸಬೇಕಾಗುತ್ತದೆ:\n\n* ಭಾರತದಲ್ಲಿರುವ ಆಸ್ತಿಯಿಂದ ಬರುವ ಬಾಡಿಗೆ ಆದಾಯ.\n* ಭಾರತದ ಬ್ಯಾಂಕ್ ಡೆಪಾಸಿಟ್‌ಗಳ ಮೇಲಿನ ಬಡ್ಡಿ.\n* ಭಾರತೀಯ ಕಂಪನಿಗಳ ಷೇರುಗಳು ಅಥವಾ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್‌ಗಳಿಂದ ಬರುವ ಲಾಭ.\n\nತೆರಿಗೆ ವಿನಾಯಿತಿಗಾಗಿ ಭಾರತ ಸರ್ಕಾರವು ವಿವಿಧ ದೇಶಗಳೊಂದಿಗೆ ದ್ವಿಮುಖ ತೆರಿಗೆ ತಡೆ ಒಪ್ಪಂದವನ್ನು (DTAA - Double Taxation Avoidance Agreement) ಮಾಡಿಕೊಂಡಿದ್ದು, ಇದರ ಅಡಿಯಲ್ಲಿ ವಿದೇಶದಲ್ಲೂ ತೆರಿಗೆ ಪಾವತಿಸಿದ್ದರೆ ಭಾರತದಲ್ಲಿ ಸೂಕ್ತ ವಿನಾಯಿತಿ ಪಡೆಯಬಹುದು.",
      source: "ಮೂಲ: ಕೇಂದ್ರ ನೇರ ತೆರಿಗೆಗಳ ಮಂಡಳಿ (CBDT), ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆ, ಭಾರತ ಸರ್ಕಾರ.",
      sourceUrl: "https://www.incometaxindia.gov.in/Pages/international-taxation/nri.aspx"
    }
  ],
  en: [
    {
      question: "What are the key differences between NRE and NRO bank accounts?",
      answer: "Under the Foreign Exchange Management Act (FEMA) guidelines by the Reserve Bank of India (RBI), NRIs can maintain two primary types of rupee accounts in India:\n\n1. **NRE (Non-Resident External) Account**: Used to park foreign earnings in Indian Rupees. The principal amount and the interest earned are **100% tax-free** in India. Both principal and interest are fully repatriable (you can transfer the money back abroad without limit).\n\n2. **NRO (Non-Resident Ordinary) Account**: Used to manage income earned in India (such as rental income, dividends, pension). The interest earned on this account is **subject to Indian Income Tax** (usually a TDS of 30% + applicable surcharge). Repatriation from NRO accounts is limited to **$1 Million USD per financial year**.",
      source: "Source: Reserve Bank of India (RBI) FEMA Regulations.",
      sourceUrl: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=52"
    },
    {
      question: "Can expat Kannadigas buy agricultural land in Karnataka?",
      answer: "No, under FEMA and Karnataka land revenue regulations, NRIs and OCI cardholders **cannot purchase agricultural land, plantation properties, or farmhouses** in India.\n\nHowever, they are fully permitted to purchase residential apartments, independent houses, and commercial properties. Agri-land can only be acquired via inheritance from a resident Indian, and must be sold or gifted only to a resident citizen of India.",
      source: "Source: Real Estate Regulatory Authority (RERA) Karnataka and RBI guidelines.",
      sourceUrl: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=33"
    },
    {
      question: "How is income tax calculated for NRIs on Indian earnings?",
      answer: "According to the Income Tax Department of India, salary earned abroad by an NRI is not taxable in India. However, an NRI is liable to pay tax on income earned or received within India, which includes:\n\n* Rental income from properties owned in India.\n* Capital gains from selling shares, mutual funds, or real estate in India.\n* Interest earned on NRO savings accounts and fixed deposits.\n\nTo prevent expats from paying tax twice on the same income in both their country of residence and India, they can avail benefits under the **Double Taxation Avoidance Agreement (DTAA)** signed by India with over 85 countries.",
      source: "Source: Central Board of Direct Taxes (CBDT), Income Tax Department of India.",
      sourceUrl: "https://www.incometaxindia.gov.in/Pages/international-taxation/nri.aspx"
    }
  ]
};

const countryGuidesMap: Record<Locale, CountryGuide[]> = {
  kn: [
    {
      name: "ಅಮೆರಿಕ ಸಂಯುಕ್ತ ಸಂಸ್ಥಾನ (USA)",
      flag: "us",
      code: "USA",
      visaTitle: "ಅಮೆರಿಕ ವೀಸಾ ಮಾರ್ಗದರ್ಶಿ (USA Visa)",
      visaText: "ಅಮೆರಿಕಕ್ಕೆ ಪ್ರಯಾಣಿಸಲು ಭಾರತೀಯರು ವಿವಿಧ ವೀಸಾಗಳನ್ನು ಹೊಂದಬೇಕಾಗುತ್ತದೆ. ಉದ್ಯೋಗಕ್ಕಾಗಿ ಎಚ್-1ಬಿ (H-1B) ವೀಸಾ ಅತ್ಯಂತ ಜನಪ್ರಿಯವಾಗಿದೆ. ಇದು ವಿಶೇಷ ಕೌಶಲ್ಯ ಹೊಂದಿರುವ ತಂತ್ರಜ್ಞರಿಗೆ ಸಿಗುತ್ತದೆ. ಉನ್ನತ ಶಿಕ್ಷಣಕ್ಕಾಗಿ ಎಫ್-1 (F-1) ವಿದ್ಯಾರ್ಥಿ ವೀಸಾ ಬೇಕಾಗುತ್ತದೆ. ಕಂಪನಿಯ ಆಂತರಿಕ ವರ್ಗಾವಣೆಗೆ ಎಲ್-1 (L-1) ವೀಸಾವನ್ನು ಬಳಸಲಾಗುತ್ತದೆ. ಪ್ರವಾಸಿಗರು ಮತ್ತು ವ್ಯಾಪಾರ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಬಿ-1/ಬಿ-2 (B1/B2) ವೀಸಾಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಬೇಕು.",
      visaSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಯುಎಸ್ ಸಿಟಿಜನ್‌ಶಿಪ್ ಮತ್ತು ಇಮಿಗ್ರೇಷನ್ ಸರ್ವೀಸಸ್ (uscis.gov)",
      transitTitle: "ಅಮೆರಿಕ ನಗರ ಸಾರಿಗೆ ಮಾರ್ಗದರ್ಶಿ (Public Transit)",
      transitText: "ಅಮೆರಿಕದ ಪ್ರಮುಖ ನಗರಗಳಲ್ಲಿ ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ. ನ್ಯೂಯಾರ್ಕ್‌ನಲ್ಲಿ ಸಬ್‌ವೇ ರೈಲಿಗಾಗಿ ಮೆಟ್ರೋಕಾರ್ಡ್ (MetroCard) ಬಳಸಬೇಕು. ಸ್ಯಾನ್ ಫ್ರಾನ್ಸಿಸ್ಕೋ ಕೊಲ್ಲಿ ಪ್ರದೇಶದಲ್ಲಿ ಬಾರ್ಡ್ ಮತ್ತು ಬಸ್‌ಗಳಿಗಾಗಿ ಕ್ಲಿಪ್ಪರ್ ಕಾರ್ಡ್ (Clipper Card) ಅನಿವಾರ್ಯವಾಗಿದೆ. ಶಿಕಾಗೋದಲ್ಲಿ ವೆಂಟ್ರಾ (Ventra) ಕಾರ್ಡ್ ಬಳಸಲಾಗುತ್ತದೆ. ಬಹುತೇಕ ನಗರಗಳಲ್ಲಿ ಈಗ ಮೊಬೈಲ್ ಮತ್ತು ಕಾಂಟ್ಯಾಕ್ಟ್‌ಲೆಸ್ ಕಾರ್ಡ್ ಪಾವತಿ ಲಭ್ಯವಿದೆ.",
      transitSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಯುಎಸ್ ಸಾರಿಗೆ ಇಲಾಖೆ (transportation.gov)",
      travelTitle: "ಅಮೆರಿಕ ಪ್ರವಾಸ ಮತ್ತು ಕಸ್ಟಮ್ಸ್ ಗೈಡ್ (Travel Info)",
      travelText: "ಅಮೆರಿಕಕ್ಕೆ ಪ್ರಯಾಣಿಸುವ ಮುನ್ನ ಕಸ್ಟಮ್ಸ್ ಮತ್ತು ಬಾರ್ಡರ್ ಪ್ರೊಟೆಕ್ಷನ್ (CBP) ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಬೇಕು. ವಿಶೇಷವಾಗಿ ಭಾರತದಿಂದ ಯಾವುದೇ ತಾಜಾ ಹಣ್ಣುಗಳು, ಬೀಜಗಳು, ಹೂವುಗಳು ಅಥವಾ ಡೈರಿ ಉತ್ಪನ್ನಗಳನ್ನು ಒಯ್ಯುವಂತಿಲ್ಲ. ಒಯ್ಯುವ ಎಲ್ಲಾ ಆಹಾರ ಪದಾರ್ಥಗಳನ್ನು ಡಿಕ್ಲೇರ್ ಮಾಡುವುದು ಕಡ್ಡಾಯ. ಪ್ರವಾಸಕ್ಕೆ ಹೆಲ್ತ್ ಇನ್ಶೂರೆನ್ಸ್ ಮಾಡಿಸುವುದು ಅತ್ಯಂತ ಸೂಕ್ತ.",
      travelSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಯುಎಸ್ ಕಸ್ಟಮ್ಸ್ ಮತ್ತು ಬಾರ್ಡರ್ ಪ್ರೊಟೆಕ್ಷನ್ (cbp.gov)",
      emergencyTitle: "ತುರ್ತು ಸಹಾಯವಾಣಿ & ಭಾರತೀಯ ದೂತಾವಾಸ (Helplines)",
      emergencyText: "ಅಮೆರಿಕದಲ್ಲಿ ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ತಕ್ಷಣವೇ 911 ಗೆ ಕರೆ ಮಾಡಿ. ಪಾಸ್‌ಪೋರ್ಟ್ ನವೀಕರಣ, ಒಸಿಐ ಕಾರ್ಡ್ ಮತ್ತು ಭಾರತೀಯ ನಾಗರಿಕರ ತುರ್ತು ನೆರವಿಗಾಗಿ ವಾಷಿಂಗ್ಟನ್ ಡಿಸಿಯಲ್ಲಿರುವ ಭಾರತೀಯ ರಾಯಭಾರ ಕಚೇರಿ ಅಥವಾ ನ್ಯೂಯಾರ್ಕ್, ಸ್ಯಾನ್ ಫ್ರಾನ್ಸಿಸ್ಕೋ, ಚಿಕಾಗೋ, ಹೂಸ್ಟನ್ ಹಾಗೂ ಅಟ್ಲಾಂಟಾದಲ್ಲಿರುವ ಭಾರತೀಯ ದೂತಾವಾಸಗಳನ್ನು (Consulate) ಸಂಪರ್ಕಿಸಬಹುದು.",
      emergencySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಭಾರತೀಯ ರಾಯಭಾರ ಕಚೇರಿ ವಾಷಿಂಗ್ಟನ್ ಡಿಸಿ (indianembassyusa.gov.in)",
      communityTitle: "ಕನ್ನಡ ಸಂಘಟನೆಗಳು & ನೆಟ್‌ವರ್ಕ್ (Kannada Associations)",
      communityText: "ಅಮೆರಿಕದಲ್ಲಿ ನೆಲೆಸಿರುವ ಕನ್ನಡಿಗರನ್ನು ಜೋಡಿಸಲು 'ಅಕ್ಕ' (AKKA - Association of Kannada Kootas of America) ಪ್ರಮುಖ ರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಯಾಗಿದೆ. ಇದರ ಜೊತೆಗೆ ಸ್ಥಳೀಯ ನಗರಗಳಲ್ಲಿ ಕನ್ನಡ ಕೂಟಗಳು (ಉದಾಹರಣೆಗೆ ಕ್ಯಾಲಿಫೋರ್ನಿಯಾದ ಸಿಂಗಾರ ಕನ್ನಡ ಕೂಟ, ಚಿಕಾಗೋದ ಮಲ್ಲಿಗೆ ಕನ್ನಡ ಕೂಟ) ಸಾಂಸ್ಕೃತಿಕ ಚಟುವಟಿಕೆಗಳನ್ನು ಆಯೋಜಿಸುತ್ತವೆ.",
      communitySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಅಕ್ಕ ಅಮೆರಿಕ (akkaonline.org)"
    },
    {
      name: "ಆಸ್ಟ್ರೇಲಿಯಾ (Australia)",
      flag: "au",
      code: "Aus",
      visaTitle: "ಆಸ್ಟ್ರೇಲಿಯಾ ವೀಸಾ ಮಾರ್ಗದರ್ಶಿ (Aus Visa)",
      visaText: "ಆಸ್ಟ್ರೇಲಿಯಾವು ಅನಿವಾಸಿಗಳಿಗೆ ಹಲವು ವೀಸಾ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ಐಟಿ ಮತ್ತು ಎಂಜಿನಿಯರಿಂಗ್ ವೃತ್ತಿಪರರಿಗೆ ಸ್ಕಿಲ್ಡ್ ಇಂಡಿಪೆಂಡೆಂಟ್ ವೀಸಾ (Subclass 189) ಮತ್ತು ಸ್ಕಿಲ್ಡ್ ನಾಮಿನೇಟೆಡ್ ವೀಸಾ (Subclass 190) ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿವೆ. ಇವು ನೇರವಾಗಿ ಕಾಯಂ ವಾಸ್ತವ್ಯಕ್ಕೆ (PR) ದಾರಿ ಮಾಡಿಕೊಡುತ್ತವೆ. ಉನ್ನತ ವ್ಯಾಸಂಗ ಮುಗಿಸಿದ ನಂತರ ಪೋಸ್ಟ್-ಸ್ಟಡಿ ವರ್ಕ್ ವೀಸಾ (Subclass 485) ಪಡೆಯಬಹುದು.",
      visaSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಆಸ್ಟ್ರೇಲಿಯನ್ ಹೋಮ್ ಅಫೇರ್ಸ್ ಇಲಾಖೆ (homeaffairs.gov.au)",
      transitTitle: "ಆಸ್ಟ್ರೇಲಿಯಾ ನಗರ ಸಾರಿಗೆ ಮಾರ್ಗದರ್ಶಿ (Public Transit)",
      transitText: "ಆಸ್ಟ್ರೇಲಿಯಾದ ಸಿಡ್ನಿ ನಗರದಲ್ಲಿ ರೈಲು, ಬಸ್ ಮತ್ತು ಫೆರ್ರಿಗಳಿಗಾಗಿ ಓಪಲ್ ಕಾರ್ಡ್ (Opal Card) ಬಳಸಬೇಕು. ಮೆಲ್ಬೋರ್ನ್‌ನಲ್ಲಿ ಮೈಕಿ ಕಾರ್ಡ್ (Myki Card) ಬಳಕೆಯಲ್ಲಿದೆ. ಬ್ರಿಸ್ಬೇನ್‌ನಲ್ಲಿ ಗೋ ಕಾರ್ಡ್ (Go Card) ಅನ್ನು ಬಳಸಲಾಗುತ್ತದೆ. ಇವುಗಳಲ್ಲಿ ಆಟೋ-ಲೋಡ್ ಸೌಲಭ್ಯವಿದ್ದು ಪ್ರವಾಸಕ್ಕೆ ಅತ್ಯಂತ ಸುಲಭವಾದ ಮಾರ್ಗವಾಗಿದೆ.",
      transitSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಟ್ರಾನ್ಸ್‌ಪೋರ್ಟ್ ಫಾರ್ ಎನ್‌ಎಸ್‌ಡಬ್ಲ್ಯೂ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ ವಿಕ್ಟೋರಿಯಾ",
      travelTitle: "ಆಸ್ಟ್ರೇಲಿಯಾ ಬಯೋಸೆಕ್ಯುರಿಟಿ ನಿಯಮಗಳು (Biosecurity Guide)",
      travelText: "ಆಸ್ಟ್ರೇಲಿಯಾ ದೇಶವು ಪ್ರಪಂಚದಲ್ಲೇ ಅತ್ಯಂತ ಕಠಿಣ ಜೈವಿಕ ಭದ್ರತಾ (Biosecurity) ನಿಯಮಗಳನ್ನು ಹೊಂದಿದೆ. ಭಾರತದಿಂದ ಒಯ್ಯುವ ಎಲ್ಲಾ ಬಗೆಯ ಆಹಾರ ಧಾನ್ಯಗಳು, ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು, ಒಣ ಹಣ್ಣುಗಳು ಮತ್ತು ಮರದ ವಸ್ತುಗಳನ್ನು ಏರ್‌ಪೋರ್ಟ್ ಕಸ್ಟಮ್ಸ್ ಕಾರ್ಡ್‌ನಲ್ಲಿ ಕಡ್ಡಾಯವಾಗಿ ನಮೂದಿಸಬೇಕು. ತಪ್ಪಿದ್ದಲ್ಲಿ ಭಾರಿ ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ.",
      travelSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಆಸ್ಟ್ರೇಲಿಯನ್ ಕೃಷಿ, ನೀರು ಮತ್ತು ಪರಿಸರ ಇಲಾಖೆ (agriculture.gov.au)",
      emergencyTitle: "ತುರ್ತು ಸಹಾಯವಾಣಿ & ಭಾರತೀಯ ದೂತಾವಾಸ (Helplines)",
      emergencyText: "ಆಸ್ಟ್ರೇಲಿಯಾದಲ್ಲಿ ಯಾವುದೇ ತೀವ್ರ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ 000 ಗೆ ಕರೆ ಮಾಡಿ. ಭಾರತೀಯ ನಾಗರಿಕ ಸೇವೆಗಳಿಗಾಗಿ ಕ್ಯಾನ್‌ಬೆರಾದಲ್ಲಿರುವ ಭಾರತೀಯ ಹೈಕಮಿಷನ್ ಕಚೇರಿ ಅಥವಾ ಸಿಡ್ನಿ, ಮೆಲ್ಬೋರ್ನ್ ಹಾಗೂ ಪರ್ತ್ ನಗರಗಳಲ್ಲಿರುವ ಭಾರತೀಯ ದೂತಾವಾಸಗಳನ್ನು (Consulate) ಸಂಪರ್ಕಿಸಬಹುದು.",
      emergencySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಭಾರತೀಯ ಹೈಕಮಿಷನ್ ಆಸ್ಟ್ರೇಲಿಯಾ (hcicanberra.gov.in)",
      communityTitle: "ಕನ್ನಡ ಸಂಘಟನೆಗಳು & ನೆಟ್‌ವರ್ಕ್ (Kannada Associations)",
      communityText: "ಆಸ್ಟ್ರೇಲಿಯಾದಲ್ಲಿ ನೆಲೆಸಿರುವ ಕನ್ನಡಿಗರಿಗಾಗಿ ಮೆಲ್ಬೋರ್ನ್ ಕನ್ನಡ ಸಂಘ (Melbourne Kannada Sangha), ಸಿಡ್ನಿ ಕನ್ನಡ ಸಂಘ ಹಾಗೂ ಕನ್ನಡಿಗರು ಆಸ್ಟ್ರೇಲಿಯಾ ಸಂಘಟನೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ. ಇವು ಯುಗಾದಿ ಮತ್ತು ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಸಮಾರಂಭಗಳನ್ನು ದೊಡ್ಡ ಮಟ್ಟದಲ್ಲಿ ಆಚರಿಸುತ್ತವೆ.",
      communitySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಮೆಲ್ಬೋರ್ನ್ ಮತ್ತು ಸಿಡ್ನಿ ಕನ್ನಡ ಸಂಘಗಳು"
    },
    {
      name: "ಯುನೈಟೆಡ್ ಕಿಂಗ್ಡಮ್ (UK)",
      flag: "gb",
      code: "UK",
      visaTitle: "ಯುನೈಟೆಡ್ ಕಿಂಗ್ಡಮ್ ವೀಸಾ ಮಾರ್ಗದರ್ಶಿ (UK Visa)",
      visaText: "ಯುಕೆ ಪ್ರಸ್ತುತ ಪಾಯಿಂಟ್ಸ್-ಬೇಸ್ಡ್ ವೀಸಾ ವ್ಯವಸ್ಥೆಯನ್ನು ಹೊಂದಿದೆ. ಐಟಿ ಮತ್ತು ವೈದ್ಯಕೀಯ ಕ್ಷೇತ್ರದ ಉದ್ಯೋಗಿಗಳಿಗೆ ಸ್ಕಿಲ್ಡ್ ವರ್ಕರ್ ವೀಸಾ (Skilled Worker Visa) ಮತ್ತು ಹೆಲ್ತ್ & ಕೇರ್ ವರ್ಕರ್ ವೀಸಾ ನೀಡಲಾಗುತ್ತದೆ. ಪದವಿ ಪೂರ್ಣಗೊಳಿಸಿದ ವಿದ್ಯಾರ್ಥಿಗಳು 2 ವರ್ಷ ಕೆಲಸ ಮಾಡಲು ಗ್ರಾಜುಯೇಟ್ ರೂಟ್ ವೀಸಾ (Graduate Route Visa) ಬಳಸಬಹುದು. ಪ್ರವಾಸಿಗರಿಗೆ ಸ್ಟ್ಯಾಂಡರ್ಡ್ ವಿಸಿಟರ್ ವೀಸಾ ಲಭ್ಯವಿದೆ.",
      visaSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಯುಕೆ ವೀಸಾಸ್ ಮತ್ತು ಇಮಿಗ್ರೇಷನ್ (gov.uk/government/organisations/uk-visas-and-immigration)",
      transitTitle: "ಯುಕೆ ಮೆಟ್ರೋ ಮತ್ತು ರೈಲು ಸಾರಿಗೆ (Public Transit)",
      transitText: "ಲಂಡನ್‌ನಲ್ಲಿ ಭೂಗತ ರೈಲು (Tube) ಮತ್ತು ಬಸ್‌ಗಳಿಗಾಗಿ ಆಯ್ಸ್ಟರ್ ಕಾರ್ಡ್ (Oyster Card) ಅತ್ಯಂತ ಜನಪ್ರಿಯವಾಗಿದೆ. ಯುಕೆ ಪೂರ್ತಿ ರೈಲು ಪ್ರಯಾಣಕ್ಕೆ ರೈಲ್‌ಕಾರ್ಡ್ (Railcard) ಬಳಸಿದರೆ 30% ಕ್ಕಿಂತ ಹೆಚ್ಚು ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ. ಲಂಡನ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಸಂಪರ್ಕ ರಹಿತ ಬ್ಯಾಂಕ್ ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಬಳಸಿ ನೇರವಾಗಿ ಟ್ಯಾಪ್ ಮಾಡಿ ಪ್ರಯಾಣಿಸಬಹುದು.",
      transitSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಟ್ರಾನ್ಸ್‌ಪೋರ್ಟ್ ಫಾರ್ ಲಂಡನ್ (tfl.gov.uk)",
      travelTitle: "ಯುಕೆ ಆರೋಗ್ಯ ಸೌಲಭ್ಯ ನಿಯಮಗಳು (NHS Guide)",
      travelText: "ಯುಕೆ ವೀಸಾ ಪಡೆಯುವಾಗ ಅನಿವಾಸಿಗಳು ಇಮಿಗ್ರೇಷನ್ ಹೆಲ್ತ್ ಸರ್ಚಾರ್ಜ್ (IHS) ಪಾವತಿಸಬೇಕಾಗುತ್ತದೆ. ಇದರಿಂದ ಯುಕೆಯ ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಸೇವೆ (NHS) ಅಡಿಯಲ್ಲಿ ಉಚಿತ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆ ಪಡೆಯಬಹುದು. ಆದರೆ ಔಷಧಗಳ ಖರೀದಿಗೆ ಮತ್ತು ಹಲ್ಲಿನ ಚಿಕಿತ್ಸೆಗೆ ಸಣ್ಣ ಶುಲ್ಕ ಪಾವತಿಸಬೇಕು.",
      travelSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಯುಕೆಯ ಎನ್‌ಎಚ್‌ಎಸ್ ಸೇವೆಗಳು (nhs.uk)",
      emergencyTitle: "ತುರ್ತು ಸಹಾಯವಾಣಿ & ಭಾರತೀಯ ದೂತಾವಾಸ (Helplines)",
      emergencyText: "ಯುಕೆಯಲ್ಲಿ ತುರ್ತು ಸಹಾಯಕ್ಕಾಗಿ 999 ಗೆ ಕರೆ ಮಾಡಿ (ತುರ್ತು ಅಲ್ಲದ ವೈದ್ಯಕೀಯ ಸಲಹೆಗೆ 111). ಲಂಡನ್‌ನಲ್ಲಿರುವ ಭಾರತೀಯ ಹೈಕಮಿಷನ್ (High Commission of India, Aldwych) ಮತ್ತು ಬರ್ಮಿಂಗ್ಹ್ಯಾಮ್ ಹಾಗೂ ಎಡಿನ್‌ಬರ್ಗ್‌ನಲ್ಲಿರುವ ದೂತಾವಾಸಗಳು ನಾಗರಿಕ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತವೆ.",
      emergencySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಭಾರತೀಯ ಹೈಕಮಿಷನ್ ಲಂಡನ್ (hcilondon.gov.in)",
      communityTitle: "ಕನ್ನಡ ಸಂಘಟನೆಗಳು & ನೆಟ್‌ವರ್ಕ್ (Kannada Associations)",
      communityText: "ಯುನೈಟೆಡ್ ಕಿಂಗ್ಡಮ್‌ನಲ್ಲಿರುವ ಕನ್ನಡಿಗರನ್ನು ಪ್ರತಿನಿಧಿಸುವ ಪ್ರಮುಖ ಸಂಸ್ಥೆ 'ಕನ್ನಡಿಗರು ಯುಕೆ' (Kannadigaru UK). ಇದು ಯುಕೆಯಾದ್ಯಂತ ಕನ್ನಡ ಶಾಲೆಗಳನ್ನು ನೆಡೆಸಲು ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಆಯೋಜಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      communitySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಕನ್ನಡಿಗರು ಯುಕೆ (kannadigaruuk.com)"
    },
    {
      name: "ಗಲ್ಫ್ ದೇಶಗಳು (UAE/Gulf)",
      flag: "ae",
      code: "Gulf",
      visaTitle: "ಯುಎಇ ಗೋಲ್ಡನ್ ವೀಸಾ ಮತ್ತು ರೆಸಿಡೆನ್ಸಿ (UAE Visa)",
      visaText: "ಗಲ್ಫ್ ಸಹಕಾರ ಮಂಡಳಿ (GCC) ದೇಶಗಳಲ್ಲಿ ದುಬೈ/ಯುಎಇ ಪ್ರಮುಖ ಆಕರ್ಷಣೆಯಾಗಿದೆ. ಉದ್ಯೋಗಿಗಳು ಕಂಪನಿಯ ಪ್ರಾಯೋಜಕತ್ವದ ಅಡಿಯಲ್ಲಿ ಎಂಪ್ಲಾಯ್ಮೆಂಟ್ ವೀಸಾ ಪಡೆಯುತ್ತಾರೆ. ಉನ್ನತ ತಂತ್ರಜ್ಞರು, ವೈದ್ಯರು ಮತ್ತು ಹೂಡಿಕೆದಾರರಿಗಾಗಿ ಯುಎಇ 10 ವರ್ಷ ಅವಧಿಯ ಗೋಲ್ಡನ್ ವೀಸಾ (Golden Visa) ನೀಡುತ್ತದೆ. ಗೃಹಿಣಿಯರು ಮತ್ತು ಮಕ್ಕಳಿಗೆ ಫ್ಯಾಮಿಲಿ ರೆಸಿಡೆನ್ಸಿ ವೀಸಾ ಲಭ್ಯವಿದೆ.",
      visaSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಫೆಡರಲ್ ಅಥಾರಿಟಿ ಫಾರ್ ಐಡೆಂಟಿಟಿ ಅಂಡ್ ಸಿಟಿಜನ್‌ಶಿಪ್ ಯುಎಇ (icp.gov.ae)",
      transitTitle: "ದುಬೈ ಮತ್ತು ಅಬುಧಾಬಿ ಮೆಟ್ರೋ ಸಾರಿಗೆ (Public Transit)",
      transitText: "ದುಬೈ ಮೆಟ್ರೋ, ಬಸ್‌ಗಳು ಮತ್ತು ಜಲ ಸಾರಿಗೆಯಲ್ಲಿ ಪ್ರಯಾಣಿಸಲು ನೋಲ್ ಕಾರ್ಡ್ (Nol Card) ಕಡ್ಡಾಯವಾಗಿದೆ. ಅಬುಧಾಬಿಯಲ್ಲಿ ಹಾಫಿಲಾಟ್ (Hafilat) ಕಾರ್ಡ್ ಬಳಸಲಾಗುತ್ತದೆ. ದುಬೈ ಮೆಟ್ರೋ ವಿಶ್ವದ ಅತ್ಯಂತ ಸುಧಾರಿತ ಸ್ವಯಂಚಾಲಿತ ಚಾಲಕ ರಹಿತ ಮೆಟ್ರೋ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ.",
      transitSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ದುಬೈ ರಸ್ತೆ ಮತ್ತು ಸಾರಿಗೆ ಪ್ರಾಧಿಕಾರ (rta.ae)",
      travelTitle: "ಯುಎಇ ಪ್ರವಾಸಿ ಮತ್ತು ಚಾಲನಾ ಪರವಾನಗಿ ನಿಯಮಗಳು (Driving License)",
      travelText: "ಯುಎಇಯಲ್ಲಿ ಅಂತರರಾಷ್ಟ್ರೀಯ ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಬಳಸಿ ಬಾಡಿಗೆ ಕಾರುಗಳನ್ನು ಓಡಿಸಬಹುದು. ಆದರೆ ರೆಸಿಡೆನ್ಸಿ ವೀಸಾ ಪಡೆದ ನಂತರ ಸ್ಥಳೀಯ ಚಾಲನಾ ಪರವಾನಗಿ (UAE Driving License) ಪಡೆಯುವುದು ಕಡ್ಡಾಯ. ಭಾರತದ ಪರವಾನಗಿ ಹೊಂದಿರುವವರು ಯುಎಇಯಲ್ಲಿ ಥಿಯರಿ ಮತ್ತು ಪ್ರಾಕ್ಟಿಕಲ್ ಪರೀಕ್ಷೆಗಳನ್ನು ಪಾಸ್ ಮಾಡಬೇಕು.",
      travelSource: "ಅಧಿಕೃತ ಲಿಂಕ್: ದುಬೈ ಆರ್‌ಟಿಎ ಲೈಸೆನ್ಸಿಂಗ್ ಸೇವೆಗಳು",
      emergencyTitle: "ತುರ್ತು ಸಹಾಯವಾಣಿ & ಭಾರತೀಯ ದೂತಾವಾಸ (Helplines)",
      emergencyText: "ಯುಎಇಯಲ್ಲಿ ಪೊಲೀಸ್ ಸಹಾಯಕ್ಕಾಗಿ 999 ಮತ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ 998 ಗೆ ಕರೆ ಮಾಡಿ. ಅಬುಧಾಬಿಯಲ್ಲಿರುವ ಭಾರತೀಯ ರಾಯಭಾರ ಕಚೇರಿ ಮತ್ತು ದುಬೈನಲ್ಲಿರುವ ಭಾರತೀಯ ದೂತಾವಾಸಗಳು (Consulate General of India, Al Hamriya) ಕಾರ್ಮಿಕರು ಮತ್ತು ನಾಗರಿಕರ ಸಮಸ್ಯೆಗಳಿಗೆ ತಕ್ಷಣ ಸ್ಪಂದಿಸುತ್ತವೆ.",
      emergencySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಭಾರತೀಯ ದೂತಾವಾಸ ದುಬೈ (cgidubai.gov.in)",
      communityTitle: "ಕನ್ನಡ ಸಂಘಟನೆಗಳು & ನೆಟ್‌ವರ್ಕ್ (Kannada Associations)",
      communityText: "ಗಲ್ಫ್ ರಾಷ್ಟ್ರಗಳಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಕನ್ನಡಿಗರು ವಾಸಿಸುತ್ತಿದ್ದು, ಯುಎಇ ಕನ್ನಡ ಕೂಟ, ದುಬೈ ಕರ್ನಾಟಕ ಸಂಘ, ಅಬುಧಾಬಿ ಕರ್ನಾಟಕ ಸಂಘ ಮತ್ತು ಶಾರ್ಜಾ ಕರ್ನಾಟಕ ಸಂಘಗಳು ಅತ್ಯಂತ ಸಕ್ರಿಯವಾಗಿವೆ. ಇವು ನಿರಂತರವಾಗಿ ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಉದ್ಯೋಗ ಮೇಳಗಳನ್ನು ಆಯೋಜಿಸುತ್ತವೆ.",
      communitySource: "ಅಧಿಕೃತ ಲಿಂಕ್: ಯುಎಇ ಕನ್ನಡ ಸಂಘಟನೆಗಳು"
    }
  ],
  en: [
    {
      name: "United States (USA)",
      flag: "us",
      code: "USA",
      visaTitle: "USA Visa Guidelines",
      visaText: "Indian citizens travelling to the US require appropriate visa status. For skilled professional employment, the H-1B Visa is the most popular cap-subject work visa. Higher education students must apply for the F-1 Student Visa. Intracompany management transfers utilize the L-1 Visa. Short-term business visitors and tourists should apply for the B-1/B-2 Visitor Visa.",
      visaSource: "Official Link: U.S. Citizenship and Immigration Services (uscis.gov)",
      transitTitle: "US Public Transportation Guide",
      transitText: "Public transit varies by US city. In New York City, the subway system uses the MetroCard (transitioning to OMNY contactless). In the San Francisco Bay Area, the Clipper Card is used for BART and local buses. Chicago transit uses the Ventra Card. Most transit networks now accept contactless debit cards and mobile wallets.",
      transitSource: "Official Link: U.S. Department of Transportation (transportation.gov)",
      travelTitle: "US Customs & Border Protection Guide",
      travelText: "US Customs and Border Protection (CBP) enforces strict rules. Travelers must declare all food items upon arrival. Carrying fresh seeds, fruits, dairy products, or meat items from India is strictly prohibited. It is highly recommended to secure travel health insurance, as healthcare is expensive.",
      travelSource: "Official Link: U.S. Customs and Border Protection (cbp.gov)",
      emergencyTitle: "Helpline & Indian Consulates",
      emergencyText: "For emergencies in the US, dial 911 immediately. For passport, OCI, and emergency consular services, contact the Indian Embassy in Washington D.C. or the Consulate Generals of India (CGI) in New York, San Francisco, Chicago, Houston, or Atlanta.",
      emergencySource: "Official Link: Indian Embassy Washington D.C. (indianembassyusa.gov.in)",
      communityTitle: "Kannada Expat Networks",
      communityText: "AKKA (Association of Kannada Kootas of America) is the national umbrella body representing Kannadigas in the US. Additionally, local city associations like KAW (Washington D.C. area), Mallige (Chicago), and Sangama (New England) organize regular cultural programs.",
      communitySource: "Official Link: AKKA America (akkaonline.org)"
    },
    {
      name: "Australia",
      flag: "au",
      code: "Aus",
      visaTitle: "Australia Visa Guidelines",
      visaText: "Australia offers structured pathways for international professionals. Key skilled visas include the Skilled Independent Visa (Subclass 189) and Skilled Nominated Visa (Subclass 190), which lead to permanent residency (PR). Students completing higher education degrees are eligible for the Subclass 485 Temporary Graduate Visa for post-study work rights.",
      visaSource: "Official Link: Australian Department of Home Affairs (homeaffairs.gov.au)",
      transitTitle: "Australian City Transit Cards",
      transitText: "For public transport in Sydney, you must purchase an Opal Card for trains, buses, and ferries. Melbourne public transit uses the Myki Card, while Brisbane uses the Go Card. You can set up auto-load via credit cards for convenient travel.",
      transitSource: "Official Link: Transport for NSW and Public Transport Victoria",
      travelTitle: "Australia Biosecurity Laws",
      travelText: "Australia has some of the strictest biosecurity laws in the world to protect its ecosystem. You must declare all food items, spices, dried fruits, wooden items, and biological materials on your incoming passenger card. Failing to declare can result in immediate fines or visa cancellation.",
      travelSource: "Official Link: Department of Agriculture, Fisheries and Forestry (agriculture.gov.au)",
      emergencyTitle: "Helpline & Indian Consulates",
      emergencyText: "For emergencies in Australia, dial 000. For consular support, passport updates, or OCI cards, contact the High Commission of India in Canberra or the Consulate Generals of India in Sydney, Melbourne, or Perth.",
      emergencySource: "Official Link: Indian High Commission Canberra (hcicanberra.gov.in)",
      communityTitle: "Kannada Expat Networks",
      communityText: "Active networks include Melbourne Kannada Sangha (MKS), Sydney Kannada Sangha, and Kannadigaru Australia. They host cultural events like Ugadi and Kannada Rajyotsava festivals.",
      communitySource: "Official Link: Melbourne & Sydney Kannada Sanghas"
    },
    {
      name: "United Kingdom (UK)",
      flag: "gb",
      code: "UK",
      visaTitle: "United Kingdom Visa Guidelines",
      visaText: "The UK uses a points-based immigration system. Skilled professionals in IT, engineering, and banking apply under the Skilled Worker Visa, while healthcare professionals use the Health and Care Worker Visa. International students completing UK degrees are eligible for the 2-year post-study Graduate Route Visa.",
      visaSource: "Official Link: UK Visas and Immigration (gov.uk/government/organisations/uk-visas-and-immigration)",
      transitTitle: "UK Public Transit & Train Travel",
      transitText: "In London, the Oyster Card and contactless payment are used for the Underground (Tube) and red double-decker buses. For travel across the UK via train, buying a Railcard (e.g., 16-25 Railcard) saves up to 1/3 on fares. Contactless payment is widely accepted across major city networks.",
      transitSource: "Official Link: Transport for London (tfl.gov.uk)",
      travelTitle: "UK National Health Service (NHS) Guide",
      travelText: "Expats applying for visas must pay the Immigration Health Surcharge (IHS). This payment allows them to access the National Health Service (NHS) for free hospital consultations and GP treatments, though prescription medicines carry a small standardized cost.",
      travelSource: "Official Link: NHS England Services (nhs.uk)",
      emergencyTitle: "Helpline & Indian Consulates",
      emergencyText: "For life-threatening emergencies in the UK, dial 999 (for non-emergencies dial 111). The High Commission of India is in Aldwych, London, with Consulate offices serving Birmingham and Edinburgh.",
      emergencySource: "Official Link: High Commission of India London (hcilondon.gov.in)",
      communityTitle: "Kannada Expat Networks",
      communityText: "Kannadigaru UK (KUK) is the largest community group in Great Britain, helping newcomers integrate, celebrating festivals, and hosting Kannada literary meets across England, Scotland, and Wales.",
      communitySource: "Official Link: Kannadigaru UK (kannadigaruuk.com)"
    },
    {
      name: "Gulf Countries (UAE)",
      flag: "ae",
      code: "Gulf",
      visaTitle: "UAE Residence Visa & Golden Visa",
      visaText: "In the Gulf Cooperation Council (GCC) region, the United Arab Emirates (UAE) is a major destination. Expat employees receive employment visas sponsored by their companies. For investors, highly skilled professionals, and researchers, the UAE offers the 10-year Golden Visa which does not require a local sponsor.",
      visaSource: "Official Link: Federal Authority for Identity, Citizenship, Customs and Port Security UAE (icp.gov.ae)",
      transitTitle: "Dubai & Abu Dhabi Metro Card Guides",
      transitText: "For travel in Dubai via Metro and public buses, purchasing a Nol Card is mandatory. In Abu Dhabi, the Hafilat Card is used. Dubai Metro is one of the world's largest automated driverless metro systems.",
      transitSource: "Official Link: Dubai Road and Transport Authority (rta.ae)",
      travelTitle: "UAE Travel & Driving License Rules",
      travelText: "Tourists can drive rental cars using an International Driving Permit. However, once you obtain a UAE residency visa, you must convert your license or pass a UAE driving test to drive. Standard medical insurance is mandatory for all expats residing in the UAE.",
      travelSource: "Official Link: Dubai RTA Licensing Services",
      emergencyTitle: "Helpline & Indian Consulates",
      emergencyText: "For UAE Police, dial 999; for Ambulance, dial 998. The Indian Embassy is in Abu Dhabi, and the Consulate General of India (CGI) is located in Dubai, supporting workers and expats across the Emirate.",
      emergencySource: "Official Link: CGI Dubai (cgidubai.gov.in)",
      communityTitle: "Kannada Expat Networks",
      communityText: "Due to the large population, several regional groups are active, including UAE Kannada Koota, Dubai Karnataka Sangha, Abu Dhabi Karnataka Sangha, and Sharjah Karnataka Sangha, hosting major business and cultural events.",
      communitySource: "Official Link: UAE Kannada Associations"
    }
  ]
};

export function ExpatGuideClient({ locale }: { locale: Locale }) {
  const [activeTab, setActiveTab] = useState<"finance" | "country">("finance");
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const countries = countryGuidesMap[locale] || [];
  const finGuides = finGuidesMap[locale] || [];
  const currentCountry = countries.find((c) => c.code === selectedCountry) || countries[0];

  const handleToggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--border)] mb-8 justify-center gap-4">
        <button
          onClick={() => setActiveTab("finance")}
          className={`pb-4 px-4 font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
            activeTab === "finance"
              ? "border-b-[var(--secondary)] text-[var(--secondary)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--primary)]"
          }`}
        >
          {locale === "kn" ? "ಹಣಕಾಸು & ಆಸ್ತಿ ಮಾರ್ಗದರ್ಶಿ 💰" : "NRI Finance & Property 💰"}
        </button>
        <button
          onClick={() => {
            setActiveTab("country");
            setExpandedIndex(null);
          }}
          className={`pb-4 px-4 font-bold text-sm md:text-base border-b-2 transition-all cursor-pointer ${
            activeTab === "country"
              ? "border-b-[var(--secondary)] text-[var(--secondary)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--primary)]"
          }`}
        >
          {locale === "kn" ? "ದೇಶಾವಾರು ವೀಸಾ & ಸಾರಿಗೆ ಮಾರ್ಗದರ್ಶಿ ✈️" : "Global Visa & Transit ✈️"}
        </button>
      </div>

      {/* Tab 1: Finance Guide (FAQ Accordions) */}
      {activeTab === "finance" && (
        <div className="max-w-3xl mx-auto space-y-4" id="finance-guide-list">
          {finGuides.map((guide, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[var(--border)]/70 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => handleToggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-sm md:text-base text-[var(--primary)] hover:bg-[var(--surface-soft)] transition-colors cursor-pointer"
                >
                  <span>{guide.question}</span>
                  <svg
                    className={`w-5 h-5 text-[var(--muted)] shrink-0 transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[var(--border)]/30 bg-white">
                    <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                      {guide.answer}
                    </p>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]/20 text-[10px] md:text-xs font-semibold">
                      <a
                        href={guide.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--secondary)] hover:underline inline-flex items-center gap-1"
                      >
                        {guide.source}
                        <span className="text-[9px]">↗</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Country Guides (Flag Cards + Section Details) */}
      {activeTab === "country" && (
        <div className="w-full space-y-8" id="country-guide-list">
          {/* Country Selection Flags */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {countries.map((c) => {
              const isSelected = selectedCountry === c.code;
              return (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
                    isSelected
                      ? "bg-white border-[var(--secondary)] shadow-md text-[var(--secondary)] ring-2 ring-[var(--secondary)]/10"
                      : "bg-white border-[var(--border)]/70 text-[var(--primary)] hover:border-[var(--secondary)]/50 hover:bg-[var(--surface-soft)]"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--secondary)] mb-1 bg-[var(--surface-soft)] px-2 py-0.5 rounded-md border border-[var(--border)]/40">
                    {c.code}
                  </span>
                  <span className="text-xs md:text-sm font-bold block">{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Country Details Card */}
          {currentCountry && (
            <div className="max-w-4xl mx-auto bg-white border border-[var(--border)]/70 rounded-2xl p-6 md:p-8 shadow-sm space-y-8 transition-opacity duration-300">
              {/* Country Title */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]/50 flex items-center justify-center text-sm md:text-base font-bold text-[var(--secondary)] select-none shrink-0">
                  {currentCountry.code}
                </div>
                <div>
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--primary)]">
                    {currentCountry.name} - {locale === "kn" ? "ಸಹಾಯ ಕೇಂದ್ರ" : "Info Hub"}
                  </h2>
                  <p className="text-[10px] md:text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">
                    {locale === "kn" ? "ಅನಿವಾಸಿ ಮಾರ್ಗದರ್ಶಿ ಮಾಹಿತಿ" : "Expat Travel & Visa Guidelines"}
                  </p>
                </div>
              </div>

              {/* Top Row: Visa, Transit, Travel */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Visa Guide Card */}
                <div className="bg-[var(--surface-soft)] p-5 rounded-xl border border-[var(--border)]/40 flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🛂</span>
                      <h3 className="font-serif font-bold text-sm md:text-base text-[var(--primary)]">
                        {currentCountry.visaTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {currentCountry.visaText}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)]/20 text-[9px] font-semibold text-[var(--secondary)]">
                    {currentCountry.visaSource}
                  </div>
                </div>

                {/* Public Transit Card */}
                <div className="bg-[var(--surface-soft)] p-5 rounded-xl border border-[var(--border)]/40 flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🚇</span>
                      <h3 className="font-serif font-bold text-sm md:text-base text-[var(--primary)]">
                        {currentCountry.transitTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {currentCountry.transitText}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)]/20 text-[9px] font-semibold text-[var(--secondary)]">
                    {currentCountry.transitSource}
                  </div>
                </div>

                {/* Travel & Customs Card */}
                <div className="bg-[var(--surface-soft)] p-5 rounded-xl border border-[var(--border)]/40 flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">✈️</span>
                      <h3 className="font-serif font-bold text-sm md:text-base text-[var(--primary)]">
                        {currentCountry.travelTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {currentCountry.travelText}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)]/20 text-[9px] font-semibold text-[var(--secondary)]">
                    {currentCountry.travelSource}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Consulates & Emergency, Kannada Associations */}
              <div className="grid gap-6 md:grid-cols-2 mt-6 pt-6 border-t border-[var(--border)]/50">
                {/* Emergency & Consulates Card */}
                <div className="bg-[var(--surface-soft)] p-5 rounded-xl border border-[var(--border)]/40 flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🚨</span>
                      <h3 className="font-serif font-bold text-sm md:text-base text-[var(--primary)]">
                        {currentCountry.emergencyTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed whitespace-pre-line">
                      {currentCountry.emergencyText}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)]/20 text-[9px] font-semibold text-[var(--secondary)]">
                    {currentCountry.emergencySource}
                  </div>
                </div>

                {/* Kannada Expat Community Card */}
                <div className="bg-[var(--surface-soft)] p-5 rounded-xl border border-[var(--border)]/40 flex flex-col justify-between hover:shadow-sm transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🤝</span>
                      <h3 className="font-serif font-bold text-sm md:text-base text-[var(--primary)]">
                        {currentCountry.communityTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed whitespace-pre-line">
                      {currentCountry.communityText}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)]/20 text-[9px] font-semibold text-[var(--secondary)]">
                    {currentCountry.communitySource}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}

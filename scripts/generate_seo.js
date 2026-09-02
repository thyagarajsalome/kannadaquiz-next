const fs = require('fs');
const path = require('path');

const exams = [
  { id: 'kpsc-kas', name: { en: 'KPSC KAS', kn: 'KPSC KAS' } },
  { id: 'police-constable', name: { en: 'Karnataka Police Constable', kn: 'ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ಕಾನ್ಸ್‌ಟೇಬಲ್' } },
  { id: 'psi', name: { en: 'Karnataka PSI', kn: 'ಕರ್ನಾಟಕ PSI' } },
  { id: 'fda', name: { en: 'FDA (First Division Assistant)', kn: 'FDA (ಪ್ರಥಮ ದರ್ಜೆ ಸಹಾಯಕ)' } },
  { id: 'sda', name: { en: 'SDA (Second Division Assistant)', kn: 'SDA (ದ್ವಿತೀಯ ದರ್ಜೆ ಸಹಾಯಕ)' } },
  { id: 'tet', name: { en: 'Karnataka TET', kn: 'ಕರ್ನಾಟಕ TET' } },
  { id: 'pdo', name: { en: 'PDO (Panchayat Development Officer)', kn: 'PDO (ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ)' } },
  { id: 'ktet', name: { en: 'KARTET', kn: 'KARTET' } },
  { id: 'rrb-kannada', name: { en: 'RRB in Kannada', kn: 'RRB (ರೈಲ್ವೆ) ಕನ್ನಡದಲ್ಲಿ' } },
  { id: 'ssc-kannada', name: { en: 'SSC in Kannada', kn: 'SSC ಕನ್ನಡದಲ್ಲಿ' } }
];

const intents = [
  { 
    id: 'syllabus', 
    suffix: { en: 'Syllabus and Exam Pattern 2026', kn: 'ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ಮಾದರಿ 2026' },
    desc: { 
      en: 'Complete detailed syllabus, exam pattern, and marking scheme for', 
      kn: 'ಸಂಪೂರ್ಣ ಪಠ್ಯಕ್ರಮ, ಪರೀಕ್ಷಾ ಮಾದರಿ ಮತ್ತು ಅಂಕಗಳ ವಿವರಣೆಗಾಗಿ'
    }
  },
  { 
    id: 'mock-tests', 
    suffix: { en: 'Free Mock Tests & Practice Questions', kn: 'ಉಚಿತ ಅಣಕು ಪರೀಕ್ಷೆಗಳು (Mock Tests)' },
    desc: { 
      en: 'Take free online mock tests and practice daily questions for', 
      kn: 'ಉಚಿತ ಆನ್‌ಲೈನ್ ಅಣಕು ಪರೀಕ್ಷೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ತಯಾರಿ ನಡೆಸಿ'
    }
  },
  { 
    id: 'previous-papers', 
    suffix: { en: 'Previous Year Question Papers PDF', kn: 'ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು PDF' },
    desc: { 
      en: 'Download previous year question papers with answer keys for', 
      kn: 'ಉತ್ತರಗಳೊಂದಿಗೆ ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
    }
  },
  { 
    id: 'preparation', 
    suffix: { en: 'Preparation Strategy & Books', kn: 'ತಯಾರಿ ತಂತ್ರ ಮತ್ತು ಅತ್ಯುತ್ತಮ ಪುಸ್ತಕಗಳು' },
    desc: { 
      en: 'Best books, study plan, and preparation strategy to crack', 
      kn: 'ಪರೀಕ್ಷೆಯನ್ನು ಭೇದಿಸಲು ಅತ್ಯುತ್ತಮ ಪುಸ್ತಕಗಳು, ಅಧ್ಯಯನ ಯೋಜನೆ ಮತ್ತು ತಯಾರಿ ತಂತ್ರ'
    }
  }
];

const districts = [
  { id: 'bangalore', name: { en: 'Bangalore', kn: 'ಬೆಂಗಳೂರು' } },
  { id: 'mysore', name: { en: 'Mysore', kn: 'ಮೈಸೂರು' } },
  { id: 'hubli', name: { en: 'Hubballi-Dharwad', kn: 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ' } },
  { id: 'mangalore', name: { en: 'Mangalore', kn: 'ಮಂಗಳೂರು' } },
  { id: 'belagavi', name: { en: 'Belagavi', kn: 'ಬೆಳಗಾವಿ' } },
  { id: 'kalaburagi', name: { en: 'Kalaburagi', kn: 'ಕಲಬುರಗಿ' } },
  { id: 'bellary', name: { en: 'Ballari', kn: 'ಬಳ್ಳಾರಿ' } },
  { id: 'bijapur', name: { en: 'Vijayapura', kn: 'ವಿಜಯಪುರ' } },
  { id: 'shimoga', name: { en: 'Shivamogga', kn: 'ಶಿವಮೊಗ್ಗ' } },
  { id: 'tumkur', name: { en: 'Tumakuru', kn: 'ತುಮಕೂರು' } },
  { id: 'raichur', name: { en: 'Raichur', kn: 'ರಾಯಚೂರು' } },
  { id: 'bidar', name: { en: 'Bidar', kn: 'ಬೀದರ್' } },
  { id: 'hassan', name: { en: 'Hassan', kn: 'ಹಾಸನ' } },
  { id: 'udupi', name: { en: 'Udupi', kn: 'ಉಡುಪಿ' } },
  { id: 'chitradurga', name: { en: 'Chitradurga', kn: 'ಚಿತ್ರದುರ್ಗ' } }
];

const generatedPages = [];

// 1. Generic Exam + Intent (e.g. KPSC KAS Syllabus)
for (const exam of exams) {
  for (const intent of intents) {
    generatedPages.push({
      slug: `${exam.id}-${intent.id}`,
      examId: exam.id,
      intentId: intent.id,
      districtId: null,
      title: {
        en: `${exam.name.en} ${intent.suffix.en}`,
        kn: `${exam.name.kn} ${intent.suffix.kn}`
      },
      description: {
        en: `${intent.desc.en} ${exam.name.en} 2026. Get the latest updates and free study materials.`,
        kn: `${exam.name.kn} 2026 ಗಾಗಿ ${intent.desc.kn}. ಇತ್ತೀಚಿನ ಅಪ್ಡೇಟ್ಸ್ ಮತ್ತು ಉಚಿತ ಸ್ಟಡಿ ಮೆಟೀರಿಯಲ್ಸ್ ಪಡೆಯಿರಿ.`
      }
    });
  }
}

// 2. Exam + District specific (e.g. Police Constable Jobs in Bangalore)
for (const exam of exams) {
  for (const district of districts) {
    generatedPages.push({
      slug: `${exam.id}-jobs-in-${district.id}`,
      examId: exam.id,
      intentId: 'jobs',
      districtId: district.id,
      title: {
        en: `${exam.name.en} Recruitment & Coaching Centers in ${district.name.en}`,
        kn: `${district.name.kn} ದಲ್ಲಿ ${exam.name.kn} ನೇಮಕಾತಿ ಮತ್ತು ಕೋಚಿಂಗ್ ಕೇಂದ್ರಗಳು`
      },
      description: {
        en: `Find the best coaching centers, latest job openings, and preparation guides for ${exam.name.en} in ${district.name.en} district.`,
        kn: `${district.name.kn} ಜಿಲ್ಲೆಯಲ್ಲಿ ${exam.name.kn} ಗಾಗಿ ಅತ್ಯುತ್ತಮ ಕೋಚಿಂಗ್ ಕೇಂದ್ರಗಳು, ಉದ್ಯೋಗಾವಕಾಶಗಳು ಮತ್ತು ತಯಾರಿ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಹುಡುಕಿ.`
      }
    });
  }
}

const outPath = path.join(__dirname, '..', 'src', 'data', 'seo-exams.json');
const dir = path.dirname(outPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outPath, JSON.stringify(generatedPages, null, 2));
console.log(`Successfully generated ${generatedPages.length} SEO pages data at src/data/seo-exams.json`);

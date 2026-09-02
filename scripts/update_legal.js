const fs = require('fs');

const updateFile = (path, knSection, enSection) => {
  let code = fs.readFileSync(path, 'utf8');
  let firstMatch = true;
  code = code.replace(/<\/>/g, (match) => {
    if (firstMatch) {
      firstMatch = false;
      return knSection + '\n          </>';
    }
    return enSection + '\n          </>';
  });
  fs.writeFileSync(path, code);
};

const knDisclaimer = `<section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">7. ಡೇಟಾ ಸಂಗ್ರಹಣೆ, AI ಬಳಕೆ ಮತ್ತು ನಿಖರತೆ (Data Collection, AI Usage & Accuracy)</h2>
              <p>
                ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಒದಗಿಸಲಾದ ಮಾಹಿತಿಯು ಈಗಾಗಲೇ ಸಾರ್ವಜನಿಕ ಡೊಮೇನ್‌ನಲ್ಲಿ (Public Domain) ಲಭ್ಯವಿರುವ ಡೇಟಾ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲಗಳಿಂದ ಸಂಗ್ರಹಿಸಲ್ಪಟ್ಟಿದೆ. ಮಾಹಿತಿಯನ್ನು ಕಲೆಹಾಕಲು, ಸಂಶೋಧಿಸಲು ಮತ್ತು ಭಾಷಾಂತರಿಸಲು ನಾವು <strong>AI ಸಹಾಯಕ ತಂತ್ರಜ್ಞಾನಗಳನ್ನು (AI Assistants)</strong> ಬಳಸುತ್ತೇವೆ. ತದನಂತರ, ನಮ್ಮ ತಂಡವು ಮಾಹಿತಿಯನ್ನು ವಿವಿಧ ಹಂತಗಳಲ್ಲಿ ಕೈಯಾರೆ ಪರಿಶೀಲಿಸುತ್ತದೆ (Manual Verification).
              </p>
              <p>
                ನಾವು ಸಾಧ್ಯವಾದಷ್ಟು ನಿಖರವಾದ ಮತ್ತು ದೋಷಮುಕ್ತ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಲು ನಮ್ಮ ಅತ್ಯುತ್ತಮ ಪ್ರಯತ್ನ ಮಾಡುತ್ತೇವೆ. ಆದಾಗ್ಯೂ, ಮೂಲತಾಣಗಳಲ್ಲಿನ ಅಪ್‌ಡೇಟ್‌ಗಳ ಕೊರತೆಯಿಂದಾಗಿ ಅಥವಾ ಮಾಹಿತಿಯ ಕೊರತೆಯಿಂದಾಗಿ, ಕೆಲವೊಮ್ಮೆ ಮಾಹಿತಿ ಅಪೂರ್ಣವಾಗಿರಬಹುದು ಅಥವಾ ಬದಲಾಗಬಹುದು. ಆದ್ದರಿಂದ, ಅತ್ಯಂತ ಇತ್ತೀಚಿನ ಮತ್ತು ಅಧಿಕೃತ ಮಾಹಿತಿಗಾಗಿ ಅಭ್ಯರ್ಥಿಗಳು ಯಾವಾಗಲೂ ಸಂಬಂಧಪಟ್ಟ ಇಲಾಖೆಯ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗಳನ್ನೇ ಉಲ್ಲೇಖಿಸಬೇಕು ಎಂದು ನಾವು ವಿನಂತಿಸುತ್ತೇವೆ.
              </p>
            </section>`;

const enDisclaimer = `<section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">7. Data Collection, AI Usage, & Accuracy</h2>
              <p>
                The information provided on our website is collected from data already available in the public domain and from other credible sources. We utilize <strong>AI assistants and automated tools</strong> to aid in research, data collection, and translation. Following this, our team conducts manual verification at multiple levels to ensure the highest quality possible.
              </p>
              <p>
                While the KannadaQuiz team tries its absolute best to provide accurate and updated information, sometimes due to a lack of full information or delays in updates from the primary sources, the information here might change or appear incomplete. Therefore, for the most recent and authoritative updates, we strongly advise users to always refer to the official websites and government notifications.
              </p>
            </section>`;

updateFile('src/app/[locale]/disclaimer/page.tsx', knDisclaimer, enDisclaimer);
updateFile('src/app/[locale]/terms/page.tsx', knDisclaimer, enDisclaimer);
updateFile('src/app/[locale]/privacy/page.tsx', knDisclaimer, enDisclaimer);

console.log('Updated legal pages.');

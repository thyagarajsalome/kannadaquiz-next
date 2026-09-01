const fs = require('fs');
let lines = fs.readFileSync('src/app/[locale]/page.tsx', 'utf-8').split('\n');

const startIdx = lines.findIndex(l => l.includes('Explore Categories'));
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('Pinned/Featured Articles Section')) {
    endIdx = i;
    break;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const gridStart = lines.findIndex((l, i) => i > startIdx && l.includes('className="space-y-8"'));
  const sectionEnd = lines.findIndex((l, i) => i > gridStart && l.includes('</section>'));
  
  if (gridStart !== -1 && sectionEnd !== -1) {
    const replacement = [
      '          <ExploreCategoriesTabs locale={locale} categoriesInfo={categoriesInfo} />',
      '        </div>',
      '      </section>'
    ];
    lines.splice(gridStart,(sectionEnd - gridStart) + 1, ...replacement);
    fs.writeFileSync('src/app/[locale]/page.tsx', lines.join('\n'));
    console.log('Successfully replaced grid with component in page.tsx');
  } else {
    console.log('Could not find grid bounds');
  }
} else {
  console.log('Could not find section boundaries');
}
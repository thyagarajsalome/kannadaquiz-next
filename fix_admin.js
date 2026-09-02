const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf-8');
const lines = content.split('\n');
const newLines = lines.filter(line => {
  const lower = line.toLowerCase();
  const toRemove = ['value="karnataka"', 'value="national"', 'value="international"', 'value="movies"', 'value="sports"', 'value="bangalore"', 'value="home-design"', 'karnataka:', 'national:', 'international:', 'movies:', 'sports:', 'bangalore:', '"home-design":'];
  return !toRemove.some(term => lower.includes(term));
});
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', newLines.join('\n'));

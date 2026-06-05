const path = require("path");
const fs = require("fs");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      if (line.trim().startsWith("#") || !line.trim()) return;
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val.trim();
      }
    });
  }
}

loadEnvLocal();

const key = process.env.GEMINI_API_KEY;
console.log("Using API Key (first 10 chars):", key ? key.slice(0, 10) : "undefined");

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)
  .then(async (res) => {
    const data = await res.json();
    if (data.error) {
      console.log("API Error:", data.error.message);
      return;
    }
    const names = data.models.map((m) => m.name);
    console.log("Includes gemini-1.5-flash:", names.includes("models/gemini-1.5-flash"));
    console.log("Includes gemini-2.5-flash:", names.includes("models/gemini-2.5-flash"));
    console.log("All flash models in list:", names.filter((n) => n.includes("flash")));
  })
  .catch(err => console.error("Error:", err));

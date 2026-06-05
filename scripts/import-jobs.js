const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "..", "service-account.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Error: Please download your Firebase Service Account private key JSON file,");
  console.error("rename it to 'service-account.json', and place it in the project root directory.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const jsonPath = process.argv[2];

if (!jsonPath) {
  console.log("Usage: node scripts/import-jobs.js <path-to-json-file>");
  console.log("Example: node scripts/import-jobs.js jobs.json");
  process.exit(1);
}

const absoluteJsonPath = path.resolve(jsonPath);
if (!fs.existsSync(absoluteJsonPath)) {
  console.error(`Error: JSON file not found at ${absoluteJsonPath}`);
  process.exit(1);
}

async function importJobs() {
  try {
    const rawData = fs.readFileSync(absoluteJsonPath, "utf8");
    const jobs = JSON.parse(rawData);

    if (!Array.isArray(jobs)) {
      console.error("Error: The JSON file must contain an array of job objects.");
      process.exit(1);
    }

    console.log(`Starting import of ${jobs.length} jobs to Firestore...`);
    let successCount = 0;

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      
      const locale = job.locale;
      const title = job.title;
      const body = job.body || "";
      const organization = job.organization || "KannadaQuiz";
      const deadline = job.deadline || "TBA";
      const applyUrl = job.applyUrl || "";
      
      if (!locale || !title) {
        console.warn(`[Skip Row ${i + 1}] Missing required field: 'locale' or 'title'.`);
        continue;
      }

      if (locale !== "kn" && locale !== "en") {
        console.warn(`[Skip Row ${i + 1}] Invalid locale: '${locale}'. Must be 'kn' or 'en'.`);
        continue;
      }

      // Auto generate slug if not provided
      const slug = job.slug || title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 90);

      const jobDocData = {
        locale,
        title: title.trim(),
        slug: slug.trim(),
        organization: organization.trim(),
        deadline: deadline.trim(),
        body: body.trim(),
        status: "published",
        applyUrl: applyUrl.trim(),
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      console.log(`Uploading [${locale.toUpperCase()}] "${title}"...`);
      await db.collection("jobs").add(jobDocData);
      successCount++;
    }

    console.log(`\nImport complete! Successfully imported ${successCount}/${jobs.length} jobs.`);
  } catch (error) {
    console.error("Error importing jobs:", error.message);
  }
}

importJobs();

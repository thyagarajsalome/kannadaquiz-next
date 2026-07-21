"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebaseAuth, firebaseStorage, firestore, hasFirebaseConfig } from "@/lib/firebase";
import { firestoreCollections } from "@/lib/firestore-schema";

type ContentKind = "posts" | "jobs" | "currentAffairs" | "quizzes";

type AdminQuestion = {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

type PublishedItem = {
  id: string;
  title: string;
  slug?: string;
  locale?: string;
  status?: string;
  isManual?: boolean;
  category?: string;
  updatedAt?: string;
};

const kindLabels: Record<ContentKind, string> = {
  posts: "Article",
  jobs: "Job alert",
  currentAffairs: "Current affair",
  quizzes: "Quiz",
};

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kind, setKind] = useState<ContentKind>("posts");
  const [locale, setLocale] = useState<"kn" | "en">("kn");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("General");
  const [organization, setOrganization] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceName, setSourceName] = useState("");
  
  // Quiz specific states
  const [exam, setExam] = useState("KPSC");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("5");
  const [questions, setQuestions] = useState<AdminQuestion[]>([
    { question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" },
  ]);

  // Edit / Delete states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const [message, setMessage] = useState("");
  const [items, setItems] = useState<PublishedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedLocaleFilter, setSelectedLocaleFilter] = useState("All");
  const [saving, setSaving] = useState(false);

  // Telemetry & Stats states
  const [activeTab, setActiveTab] = useState<"content" | "telemetry">("content");
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [cleaningDb, setCleaningDb] = useState(false);
  const [cleanMessage, setCleanMessage] = useState("");
  const [stats, setStats] = useState({
    posts: 0,
    manualPosts: 0,
    jobs: 0,
    manualJobs: 0,
    currentAffairs: 0,
    quizzes: 0,
  });

  // Speed Performance Metrics
  const [perfMetrics, setPerfMetrics] = useState({
    loadTimeMs: 0,
    ttfbMs: 0,
    domReadyMs: 0,
    renderTimeMs: 0,
  });

  // SEO Analyzer
  const [seoSlug, setSeoSlug] = useState("/");
  const [seoResult, setSeoResult] = useState<any | null>(null);
  const [analyzingSeo, setAnalyzingSeo] = useState(false);
  const [seoError, setSeoError] = useState("");

  const canUseFirebase = hasFirebaseConfig && firebaseAuth && firestore;

  const totalPosts = stats.posts;
  const manualPosts = stats.manualPosts;
  const autoPosts = Math.max(0, totalPosts - manualPosts);
  const manualPct = totalPosts > 0 ? Math.round((manualPosts / totalPosts) * 100) : 0;
  const autoPct = totalPosts > 0 ? 100 - manualPct : 0;

  const syncStats = useMemo(() => {
    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let fourFeeds = 0, fourCalls = 0, fourPosts = 0;
    let twelveFeeds = 0, twelveCalls = 0, twelvePosts = 0;
    let dayFeeds = 0, dayCalls = 0, dayPosts = 0;
    let weekFeeds = 0, weekCalls = 0, weekPosts = 0;

    syncLogs.forEach((log) => {
      const d = log.dateObj;
      if (!d) return;

      if (d >= fourHoursAgo) {
        fourFeeds += log.feedItemsChecked;
        fourCalls += log.geminiCalls;
        fourPosts += log.postsCreated;
      }
      if (d >= twelveHoursAgo) {
        twelveFeeds += log.feedItemsChecked;
        twelveCalls += log.geminiCalls;
        twelvePosts += log.postsCreated;
      }
      if (d >= oneDayAgo) {
        dayFeeds += log.feedItemsChecked;
        dayCalls += log.geminiCalls;
        dayPosts += log.postsCreated;
      }
      if (d >= sevenDaysAgo) {
        weekFeeds += log.feedItemsChecked;
        weekCalls += log.geminiCalls;
        weekPosts += log.postsCreated;
      }
    });

    return {
      fourHours: { feeds: fourFeeds, calls: fourCalls, posts: fourPosts },
      twelveHours: { feeds: twelveFeeds, calls: twelveCalls, posts: twelvePosts },
      day: { feeds: dayFeeds, calls: dayCalls, posts: dayPosts },
      week: { feeds: weekFeeds, calls: weekCalls, posts: weekPosts },
    };
  }, [syncLogs]);

  const failureAlert = useMemo(() => {
    if (syncLogs.length === 0) return null;

    const sortedLogs = [...syncLogs].sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
    const latestLog = sortedLogs[0];

    const now = new Date();
    const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

    const isLatestFailed = latestLog.status === "error";
    const isStale = latestLog.dateObj < twelveHoursAgo;

    if (isLatestFailed) {
      return {
        type: "error",
        title: "Latest Auto-Sync Failed!",
        message: latestLog.errorMessage || "Unknown script execution crash during RSS parsing or database write.",
        timestamp: latestLog.timestamp,
      };
    }

    if (isStale) {
      return {
        type: "stale",
        title: "Sync System Dormant / Stale!",
        message: `The last successful sync occurred on ${latestLog.timestamp}. The system has not executed a sync script in the last 12 hours. Please check GitHub Actions scheduled cron logs.`,
        timestamp: latestLog.timestamp,
      };
    }

    return null;
  }, [syncLogs]);

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      void loadItems(kind);
    }
  }, [kind, user]);

  const generatedSlug = useMemo(
    () =>
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 90),
    [title],
  );

  function handleAddQuestion() {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" },
    ]);
  }

  function handleRemoveQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleQuestionChange(index: number, field: keyof AdminQuestion, value: any) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  }

  function handleOptionChange(qIndex: number, optIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIndex) {
          const nextOptions = [...q.options];
          nextOptions[optIndex] = value;
          return { ...q, options: nextOptions };
        }
        return q;
      })
    );
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firebaseAuth) {
      setMessage("Firebase environment variables are not configured yet.");
      return;
    }

    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      setPassword("");
      setMessage("");
    } catch (error) {
      setMessage(readFirebaseError(error));
    }
  }

  async function loadItems(nextKind: ContentKind) {
    if (!firestore) {
      return;
    }

    try {
      let snapshot;
      try {
        // Fetch up to 600 items ordered by the most recently updated first.
        // This guarantees that newly published or modified drafts are always fetched.
        const docsQuery = query(
          collection(firestore, firestoreCollections[nextKind]),
          orderBy("updatedAt", "desc"),
          limit(600)
        );
        snapshot = await getDocs(docsQuery);
      } catch (indexError) {
        console.warn("Index not found or sorting failed, falling back to unordered fetch:", indexError);
        // Fallback to fetch up to 600 items without sorting at the database level.
        const docsQuery = query(
          collection(firestore, firestoreCollections[nextKind]),
          limit(600)
        );
        snapshot = await getDocs(docsQuery);
      }

      const nextItems = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: String(data.title ?? data.headline ?? "Untitled"),
            slug: typeof data.slug === "string" ? data.slug : undefined,
            locale: typeof data.locale === "string" ? data.locale : undefined,
            status: typeof data.status === "string" ? data.status : undefined,
            isManual: data.isManual === true,
            category: typeof data.category === "string" ? data.category : "General",
            updatedAt:
              typeof data.updatedAt === "string"
                ? data.updatedAt
                : typeof data.updatedAt?.toDate === "function"
                  ? data.updatedAt.toDate().toISOString()
                  : "",
          };
        })
        .filter((item) => item.status === "published" || item.status === "draft")
        .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));

      setItems(nextItems);
    } catch (error) {
      setMessage(readFirebaseError(error));
    }
  }

  async function loadSyncLogs() {
    if (!firestore) return;
    setLoadingLogs(true);
    try {
      const q = query(
        collection(firestore, firestoreCollections.syncLogs),
        orderBy("timestamp", "desc"),
        limit(150)
      );
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let formattedDate = "";
        let dateObj = new Date();
        try {
          const t = data.timestamp;
          if (t && typeof t.toDate === "function") {
            dateObj = t.toDate();
            formattedDate = dateObj.toLocaleString();
          } else if (t && t.seconds) {
            dateObj = new Date(t.seconds * 1000);
            formattedDate = dateObj.toLocaleString();
          }
        } catch {
          formattedDate = "Unknown";
        }
        return {
          id: docSnap.id,
          timestamp: formattedDate,
          dateObj: dateObj,
          status: data.status || "success",
          durationSeconds: Number(data.durationSeconds || 0),
          geminiCalls: Number(data.geminiCalls || 0),
          feedItemsChecked: Number(data.feedItemsChecked || 0),
          postsCreated: Number(data.postsCreated || 0),
          errorMessage: data.errorMessage || "",
        };
      });
      // Sort client-side by timestamp descending
      logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      setSyncLogs(logs);
    } catch (error) {
      console.error("Failed to load sync logs:", error);
    } finally {
      setLoadingLogs(false);
    }
  }

  async function loadStats() {
    if (!firestore) return;
    try {
      const [postsSnap, jobsSnap, caSnap, quizzesSnap] = await Promise.all([
        getDocs(query(collection(firestore, firestoreCollections.posts), limit(1000))),
        getDocs(query(collection(firestore, firestoreCollections.jobs), limit(1000))),
        getDocs(query(collection(firestore, firestoreCollections.currentAffairs), limit(1000))),
        getDocs(query(collection(firestore, firestoreCollections.quizzes), limit(1000))),
      ]);

      const manualPosts = postsSnap.docs.filter((d) => d.data().isManual === true).length;
      const manualJobs = jobsSnap.docs.filter((d) => d.data().isManual === true).length;

      setStats({
        posts: postsSnap.size,
        manualPosts,
        jobs: jobsSnap.size,
        manualJobs,
        currentAffairs: caSnap.size,
        quizzes: quizzesSnap.size,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }

  useEffect(() => {
    if (activeTab === "telemetry" && user) {
      void loadSyncLogs();
      void loadStats();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === "telemetry") {
      const getMetrics = () => {
        setTimeout(() => {
          const navigationEntries = performance.getEntriesByType("navigation");
          const [entry] = navigationEntries.length > 0 ? (navigationEntries as any[]) : [null];
          if (entry) {
            setPerfMetrics({
              loadTimeMs: Math.round(entry.duration),
              ttfbMs: Math.round(entry.responseStart - entry.requestStart),
              domReadyMs: Math.round(entry.domContentLoadedEventEnd - entry.responseStart),
              renderTimeMs: Math.round(entry.loadEventEnd - entry.domContentLoadedEventEnd),
            });
          } else {
            const t = window.performance.timing;
            if (t) {
              setPerfMetrics({
                loadTimeMs: t.loadEventEnd - t.navigationStart,
                ttfbMs: t.responseStart - t.requestStart,
                domReadyMs: t.domContentLoadedEventEnd - t.responseStart,
                renderTimeMs: t.loadEventEnd - t.domContentLoadedEventEnd,
              });
            }
          }
        }, 300);
      };

      if (document.readyState === "complete") {
        getMetrics();
      } else {
        window.addEventListener("load", getMetrics);
        return () => window.removeEventListener("load", getMetrics);
      }
    }
  }, [activeTab]);

  async function analyzeSeoPage() {
    setAnalyzingSeo(true);
    setSeoError("");
    setSeoResult(null);

    let targetUrl = seoSlug.trim();
    if (!targetUrl.startsWith("/")) {
      targetUrl = "/" + targetUrl;
    }

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Title audit
      const title = doc.title || "";
      const titleLength = title.length;
      const titleScore = titleLength > 0 ? (titleLength >= 30 && titleLength <= 65 ? 25 : 18) : 0;

      // Meta description audit
      const metaDescEl = doc.querySelector('meta[name="description"]');
      const metaDesc = metaDescEl ? metaDescEl.getAttribute("content") || "" : "";
      const descLength = metaDesc.length;
      const descScore = descLength > 0 ? (descLength >= 110 && descLength <= 160 ? 25 : 18) : 0;

      // Headings audit (H1)
      const h1s = doc.querySelectorAll("h1");
      const h1Count = h1s.length;
      let h1Score = 0;
      if (h1Count === 1) h1Score = 20;
      else if (h1Count > 1) h1Score = 10;

      // Images alt audit
      const imgs = doc.querySelectorAll("img");
      const imgCount = imgs.length;
      let missingAltCount = 0;
      imgs.forEach((img) => {
        if (!img.hasAttribute("alt") || !img.getAttribute("alt")?.trim()) {
          missingAltCount++;
        }
      });
      const altScore = imgCount > 0 ? Math.max(0, 15 - missingAltCount * 3) : 15;

      // JSON-LD schemas
      const schemas = doc.querySelectorAll('script[type="application/ld+json"]');
      const schemaCount = schemas.length;
      const schemaScore = schemaCount > 0 ? 15 : 0;

      // Calculate total score
      const totalScore = titleScore + descScore + h1Score + altScore + schemaScore;

      // Generate suggestions list
      const suggestions: string[] = [];
      if (titleLength === 0) {
        suggestions.push("Critical: Title tag is missing. Add a descriptive title to rank in search results.");
      } else if (titleLength < 30 || titleLength > 65) {
        suggestions.push(`Warning: Title tag is ${titleLength} characters. Keep it between 30 and 65 characters to avoid truncation in SERPs.`);
      }

      if (descLength === 0) {
        suggestions.push("Critical: Meta description is missing. Add one to describe page summaries in search listings.");
      } else if (descLength < 110 || descLength > 160) {
        suggestions.push(`Warning: Meta description is ${descLength} characters. Keep it between 110 and 160 characters for optimal display.`);
      }

      if (h1Count === 0) {
        suggestions.push("Critical: H1 tag is missing. Every page should have exactly one H1 tag defining the primary heading.");
      } else if (h1Count > 1) {
        suggestions.push(`Warning: Found ${h1Count} H1 tags. Keep exactly one H1 per page and use H2/H3 for sub-sections.`);
      }

      if (missingAltCount > 0) {
        suggestions.push(`Warning: Found ${missingAltCount} image(s) missing 'alt' descriptions. Add 'alt' tags to all images to improve accessibility and image SEO.`);
      }

      if (schemaCount === 0) {
        suggestions.push("Tip: JSON-LD structured data schema not found. Implement Article or FAQ schema markup to enable rich snippets in Google Search.");
      }

      setSeoResult({
        score: totalScore,
        title,
        titleLength,
        metaDesc,
        descLength,
        h1Count,
        imgCount,
        missingAltCount,
        schemaCount,
        suggestions,
      });
    } catch (err: any) {
      setSeoError(err.message || "Failed to analyze page.");
    } finally {
      setAnalyzingSeo(false);
    }
  }

  async function compressToWebp(file: File, maxWidth = 900, quality = 0.75): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get 2D canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Blob conversion failed"));
              }
            },
            "image/webp",
            quality
          );
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  async function uploadImage(file: File, fileSlug: string): Promise<string> {
    if (!firebaseStorage) return "";

    let uploadData: Blob | File = file;
    let fileName = file.name;

    try {
      console.log(`Compressing original image (${(file.size / 1024).toFixed(1)} KB) to optimized WebP...`);
      const compressedBlob = await compressToWebp(file, 900, 0.75);
      uploadData = compressedBlob;
      
      const dotIndex = file.name.lastIndexOf('.');
      const baseName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
      fileName = `${baseName}.webp`;
      
      console.log(`Successfully compressed. New size: ${(compressedBlob.size / 1024).toFixed(1)} KB`);
    } catch (compressionError) {
      console.warn("Image compression failed, uploading original file:", compressionError);
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    const uniqueId = Date.now();
    const storagePath = `public/${kind}/${fileSlug}-${uniqueId}-${cleanFileName}`;
    const fileRef = ref(firebaseStorage, storagePath);

    const metadata = {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000",
    };

    await uploadBytes(fileRef, uploadData, metadata);
    return getDownloadURL(fileRef);
  }

  async function deleteOldImage(oldUrl: string) {
    if (!firebaseStorage || !oldUrl) return;
    try {
      const oldRef = ref(firebaseStorage, oldUrl);
      await deleteObject(oldRef);
    } catch (error) {
      console.warn("Failed to delete old image from storage:", error);
    }
  }

  async function handleEditInit(itemId: string) {
    if (!firestore) return;

    setSaving(true);
    setMessage("");

    try {
      const docRef = doc(firestore, firestoreCollections[kind], itemId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setMessage("Error: Document not found.");
        return;
      }

      const data = docSnap.data();

      setEditingId(itemId);
      setLocale((data.locale as "kn" | "en") ?? "kn");
      setTitle(String(data.title ?? data.headline ?? ""));
      setSlug(String(data.slug ?? ""));
      setExcerpt(String(data.excerpt ?? data.description ?? ""));
      setBody(String(data.body ?? ""));
      setCategory(String(data.category ?? "General"));
      setOrganization(String(data.organization ?? ""));
      setDeadline(String(data.deadline ?? ""));
      setSourceUrl(String(data.sourceUrl ?? ""));
      setSourceName(String(data.sourceName ?? ""));
      setImageUrl(String(data.featuredImageUrl ?? ""));
      setImageFile(null); // Reset new file input

      if (kind === "quizzes") {
        setExam(String(data.exam ?? "KPSC"));
        setSubject(String(data.subject ?? ""));
        setDifficulty((data.difficulty as "Easy" | "Medium" | "Hard") ?? "Easy");
        const minutes = data.timeLimitSeconds ? Math.ceil(Number(data.timeLimitSeconds) / 60) : 5;
        setTimeLimitMinutes(String(minutes));

        const qQuery = query(
          collection(firestore, firestoreCollections.quizQuestions),
          where("quizId", "==", itemId)
        );
        const qSnapshot = await getDocs(qQuery);
        const nextQuestions = qSnapshot.docs
          .map((d) => {
            const qData = d.data();
            return {
              question: String(qData.question ?? ""),
              options: Array.isArray(qData.options) ? qData.options.map(String) : ["", "", "", ""],
              correctOptionIndex: Number(qData.correctOptionIndex ?? 0),
              explanation: String(qData.explanation ?? ""),
              sortOrder: Number(qData.sortOrder ?? 1),
            };
          })
          .sort((a, b) => a.sortOrder - b.sortOrder);

        if (nextQuestions.length > 0) {
          setQuestions(nextQuestions);
        } else {
          setQuestions([{ question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" }]);
        }
      }
    } catch (error) {
      setMessage(readFirebaseError(error));
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setBody("");
    setCategory("General");
    setOrganization("");
    setDeadline("");
    setSourceUrl("");
    setSourceName("");

    setExam("KPSC");
    setSubject("");
    setDifficulty("Easy");
    setTimeLimitMinutes("5");
    setQuestions([
      { question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" },
    ]);
    
    // Reset image states
    setImageFile(null);
    setImageUrl("");
    setMessage("");
  }

  async function handleDelete(itemId: string) {
    if (!firestore) return;

    const confirm = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");
    if (!confirm) return;

    setSaving(true);
    setMessage("");

    try {
      const docRef = doc(firestore, firestoreCollections[kind], itemId);
      
      // Fetch document to delete the image from storage if it exists
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.featuredImageUrl) {
          await deleteOldImage(data.featuredImageUrl);
        }
      }

      await deleteDoc(docRef);

      if (kind === "quizzes") {
        const qQuery = query(
          collection(firestore, firestoreCollections.quizQuestions),
          where("quizId", "==", itemId)
        );
        const qSnapshot = await getDocs(qQuery);
        for (const qDoc of qSnapshot.docs) {
          await deleteDoc(qDoc.ref);
        }
      }

      setMessage("Item deleted successfully.");
      if (editingId === itemId) {
        handleCancelEdit();
      }
      await loadItems(kind);
    } catch (error) {
      setMessage(readFirebaseError(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleCleanAutomatedContent() {
    if (!firestore) return;

    const confirm = window.confirm(
      "⚠️ WARNING: This will permanently and irreversibly delete all automated RSS/translated articles and jobs from your Firestore database.\n\nAre you absolutely sure you want to proceed?"
    );
    if (!confirm) return;

    setCleaningDb(true);
    setCleanMessage("Initializing database cleanup...");

    try {
      let postsDeleted = 0;
      let jobsDeleted = 0;

      // 1. Clean posts
      setCleanMessage("Scanning posts collection for automated articles...");
      const postsSnapshot = await getDocs(
        collection(firestore, firestoreCollections.posts)
      );
      
      const automatedPosts = postsSnapshot.docs.filter(
        (docSnap) => docSnap.data().isManual !== true
      );

      if (automatedPosts.length > 0) {
        setCleanMessage(`Found ${automatedPosts.length} automated posts. Deleting...`);
        for (const docSnap of automatedPosts) {
          await deleteDoc(doc(firestore, firestoreCollections.posts, docSnap.id));
          postsDeleted++;
          if (postsDeleted % 10 === 0 || postsDeleted === automatedPosts.length) {
            setCleanMessage(`Deleting posts: ${postsDeleted}/${automatedPosts.length}...`);
          }
        }
      }

      // 2. Clean jobs
      setCleanMessage("Scanning jobs collection for automated job alerts...");
      const jobsSnapshot = await getDocs(
        collection(firestore, firestoreCollections.jobs)
      );
      
      const automatedJobs = jobsSnapshot.docs.filter(
        (docSnap) => docSnap.data().isManual !== true
      );

      if (automatedJobs.length > 0) {
        setCleanMessage(`Found ${automatedJobs.length} automated jobs. Deleting...`);
        for (const docSnap of automatedJobs) {
          await deleteDoc(doc(firestore, firestoreCollections.jobs, docSnap.id));
          jobsDeleted++;
          if (jobsDeleted % 10 === 0 || jobsDeleted === automatedJobs.length) {
            setCleanMessage(`Deleting jobs: ${jobsDeleted}/${automatedJobs.length}...`);
          }
        }
      }

      setCleanMessage(
        `🎉 Cleanup complete! Successfully deleted ${postsDeleted} automated posts and ${jobsDeleted} automated jobs from Firestore.`
      );
      void loadStats();
      void loadItems(kind);
    } catch (error: any) {
      console.error("Cleanup failed:", error);
      setCleanMessage(`❌ Error during cleanup: ${error.message || error}`);
    } finally {
      setCleaningDb(false);
    }
  }

  async function handleVerifyItem(itemId: string) {
    if (!firestore) return;
    try {
      const docRef = doc(firestore, firestoreCollections[kind], itemId);
      await setDoc(docRef, {
        isManual: true,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, isManual: true } : item))
      );
      void loadStats();
      setMessage("Item successfully verified & marked as manual-reviewed.");
    } catch (error) {
      setMessage(readFirebaseError(error));
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firestore) {
      setMessage("Firestore is not configured yet.");
      return;
    }

    const finalSlug = slug.trim() || generatedSlug;
    setSaving(true);
    setMessage("");

    try {
      let finalImageUrl = imageUrl;

      // Handle image upload / replacement
      if (imageFile) {
        // If editing and has an old image, delete it
        if (editingId && imageUrl) {
          await deleteOldImage(imageUrl);
        }
        finalImageUrl = await uploadImage(imageFile, finalSlug);
      }

      const base = {
        locale,
        title: title.trim(),
        slug: finalSlug,
        status: "published",
        updatedAt: serverTimestamp(),
        // Save image if present
        ...((kind === "posts" || kind === "quizzes") && finalImageUrl
          ? { featuredImageUrl: finalImageUrl }
          : {}),
      };

      if (editingId) {
        const docRef = doc(firestore, firestoreCollections[kind], editingId);
        
        // Retrieve old document to verify if we need to clean up image from storage
        const docSnap = await getDoc(docRef);
        const oldData = docSnap.data();
        const oldImageUrl = oldData?.featuredImageUrl;

        // If the old image URL was cleared or replaced, delete the old image
        if (oldImageUrl && oldImageUrl !== finalImageUrl) {
          await deleteOldImage(oldImageUrl);
        }

        if (kind === "posts") {
          // If the image was removed completely, delete the field or update to empty string
          await setDoc(docRef, {
            ...base,
            excerpt: excerpt.trim(),
            body: body.trim(),
            category: category.trim(),
            featuredImageUrl: finalImageUrl || "",
            isManual: true,
            sourceUrl: sourceUrl.trim() || "",
            sourceName: sourceName.trim() || "",
          }, { merge: true });
        }

        if (kind === "jobs") {
          await setDoc(docRef, {
            ...base,
            organization: organization.trim(),
            deadline: deadline.trim(),
            body: body.trim(),
            isManual: true,
          }, { merge: true });
        }

        if (kind === "currentAffairs") {
          await setDoc(docRef, {
            locale,
            headline: title.trim(),
            status: "published",
            updatedAt: serverTimestamp(),
            isManual: true,
          }, { merge: true });
        }

        if (kind === "quizzes") {
          await setDoc(docRef, {
            ...base,
            description: excerpt.trim(),
            exam: exam.trim(),
            subject: subject.trim(),
            difficulty,
            timeLimitSeconds: Number(timeLimitMinutes) * 60,
            featuredImageUrl: finalImageUrl || "",
          }, { merge: true });

          const qQuery = query(
            collection(firestore, firestoreCollections.quizQuestions),
            where("quizId", "==", editingId)
          );
          const qSnapshot = await getDocs(qQuery);
          for (const qDoc of qSnapshot.docs) {
            await deleteDoc(qDoc.ref);
          }

          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            await addDoc(collection(firestore, firestoreCollections.quizQuestions), {
              quizId: editingId,
              question: q.question.trim(),
              options: q.options.map((opt) => opt.trim()),
              correctOptionIndex: Number(q.correctOptionIndex),
              explanation: q.explanation.trim(),
              sortOrder: i + 1,
            });
          }
        }

        setMessage(`${kindLabels[kind]} updated in Firestore.`);
        setEditingId(null);
      } else {
        const createBase = {
          ...base,
          publishedAt: serverTimestamp(),
        };

        if (kind === "posts") {
          await addDoc(collection(firestore, firestoreCollections.posts), {
            ...createBase,
            excerpt: excerpt.trim(),
            body: body.trim(),
            category: category.trim(),
            isManual: true,
            sourceUrl: sourceUrl.trim() || "",
            sourceName: sourceName.trim() || "",
          });
        }

        if (kind === "jobs") {
          await addDoc(collection(firestore, firestoreCollections.jobs), {
            ...createBase,
            organization: organization.trim(),
            deadline: deadline.trim(),
            body: body.trim(),
            isManual: true,
          });
        }

        if (kind === "currentAffairs") {
          await addDoc(collection(firestore, firestoreCollections.currentAffairs), {
            locale,
            headline: title.trim(),
            status: "published",
            publishedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isManual: true,
          });
        }

        if (kind === "quizzes") {
          const quizDocRef = await addDoc(collection(firestore, firestoreCollections.quizzes), {
            ...createBase,
            description: excerpt.trim(),
            exam: exam.trim(),
            subject: subject.trim(),
            difficulty,
            timeLimitSeconds: Number(timeLimitMinutes) * 60,
          });

          for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            await addDoc(collection(firestore, firestoreCollections.quizQuestions), {
              quizId: quizDocRef.id,
              question: q.question.trim(),
              options: q.options.map((opt) => opt.trim()),
              correctOptionIndex: Number(q.correctOptionIndex),
              explanation: q.explanation.trim(),
              sortOrder: i + 1,
            });
          }
        }

        setMessage(`${kindLabels[kind]} saved to Firestore.`);
      }

      setTitle("");
      setSlug("");
      setExcerpt("");
      setBody("");
      setOrganization("");
      setDeadline("");
      setSourceUrl("");
      setSourceName("");
      setExam("KPSC");
      setSubject("");
      setDifficulty("Easy");
      setTimeLimitMinutes("5");
      setQuestions([
        { question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" },
      ]);
      // Reset image upload states
      setImageFile(null);
      setImageUrl("");
      await loadItems(kind);
    } catch (error) {
      setMessage(readFirebaseError(error));
    } finally {
      setSaving(false);
    }
  }

  if (!authReady) {
    return <AdminFrame>Loading admin...</AdminFrame>;
  }

  if (!canUseFirebase) {
    return (
      <AdminFrame>
        <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Admin setup needed</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
          Add the Firebase web app values to Firebase App Hosting environment variables and to
          `.env.local` for local development.
        </p>
      </AdminFrame>
    );
  }

  if (!user) {
    return (
      <AdminFrame>
        <form onSubmit={handleLogin} className="kq-card max-w-md p-6">
          <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Admin login</h1>
          <label className="mt-5 block text-sm font-bold text-[var(--primary)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              required
            />
          </label>
          <label className="mt-4 block text-sm font-bold text-[var(--primary)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              required
            />
          </label>
          <button className="mt-5 rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white">
            Sign in
          </button>
          {message ? <p className="mt-3 text-sm text-[var(--secondary)]">{message}</p> : null}
        </form>
      </AdminFrame>
    );
  }

  return (
    <AdminFrame>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--secondary)]">KannadaQuiz</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--primary)]">Content admin</h1>
        </div>
        <button
          onClick={() => firebaseAuth && signOut(firebaseAuth)}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-bold"
        >
          Sign out
        </button>
      </div>

      {/* Failure Alert Panel */}
      {failureAlert && (
        <div className={`mt-6 p-4 rounded-xl border flex gap-4 items-start ${
          failureAlert.type === "error"
            ? "bg-rose-50 border-rose-200 text-rose-800 shadow-sm"
            : "bg-amber-50 border-amber-200 text-amber-800 shadow-sm"
        }`}>
          <div className="mt-0.5 shrink-0">
            {failureAlert.type === "error" ? (
              <svg className="w-6 h-6 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-sm uppercase tracking-wide">{failureAlert.title}</h4>
            <p className="text-xs mt-1.5 leading-relaxed font-medium">{failureAlert.message}</p>
            <div className="mt-2.5 flex items-center gap-4 text-[10px] font-bold opacity-80">
              <span>Failed At: {failureAlert.timestamp}</span>
              <span>•</span>
              <button 
                type="button" 
                className="underline cursor-pointer hover:opacity-100 bg-transparent border-0 p-0 text-[10px] font-bold text-inherit" 
                onClick={() => { void loadSyncLogs(); void loadStats(); }}
              >
                Refresh System Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex border-b border-[var(--border)] gap-4 select-none">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`pb-2 text-sm font-bold px-1 transition-colors relative cursor-pointer ${
            activeTab === "content"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] font-black"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Content Manager
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("telemetry")}
          className={`pb-2 text-sm font-bold px-1 transition-colors relative cursor-pointer ${
            activeTab === "telemetry"
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] font-black"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Telemetry & Performance
        </button>
      </div>

      {activeTab === "content" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={handleCreate} className="kq-card p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-bold">
              Type
              <select
                value={kind}
                onChange={(event) => {
                  setKind(event.target.value as ContentKind);
                  handleCancelEdit();
                }}
                className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              >
                <option value="posts">Article</option>
                <option value="jobs">Job alert</option>
                <option value="currentAffairs">Current affair</option>
                <option value="quizzes">Quiz</option>
              </select>
            </label>
            <label className="block text-sm font-bold">
              Language
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value as "kn" | "en")}
                className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              >
                <option value="kn">Kannada</option>
                <option value="en">English</option>
              </select>
            </label>
            <label className="block text-sm font-bold">
              Slug
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder={generatedSlug}
                className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-bold">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              required
            />
          </label>

          {kind === "posts" ? (
            <label className="mt-4 block text-sm font-bold">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2 bg-white"
              >
                <option value="General">General News</option>
                <option value="Karnataka">Karnataka News</option>
                <option value="National">National News</option>
                <option value="International">International News</option>
                <option value="Jobs">Jobs & Careers</option>
                <option value="Current Affairs">Current Affairs</option>
                <option value="Agriculture">Agriculture Info</option>
                <option value="College Guide">College & Education Guide</option>
                <option value="Government Schemes">Government Schemes</option>
                <option value="Heritage & Tourism">Heritage & Tourism</option>
                <option value="Sports News">Sports News</option>
                <option value="Movies">Movies & Cinema</option>
                <option value="Home Design">Home Design & Real Estate</option>
              </select>
            </label>
          ) : null}

          {kind === "posts" || kind === "quizzes" ? (
            <label className="mt-4 block text-sm font-bold">
              {kind === "quizzes" ? "Description" : "SEO excerpt"}
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                className="mt-2 min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
                required={kind === "quizzes"}
              />
            </label>
          ) : null}

          {kind === "posts" || kind === "quizzes" ? (
            <div className="mt-4 p-4 border border-[var(--border)] rounded-md bg-[var(--surface-soft)]">
              <label className="block text-sm font-bold">
                Featured Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                    }
                  }}
                  className="mt-2 w-full text-sm text-[var(--muted)]"
                />
              </label>

              {imageFile ? (
                <p className="mt-2 text-xs text-[var(--secondary)] font-semibold">
                  Selected new file: {imageFile.name} (upload on save)
                </p>
              ) : null}

              {imageUrl ? (
                <div className="mt-3 flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt="Featured preview"
                    className="w-20 h-20 object-cover rounded border border-[var(--border)]"
                  />
                  <div>
                    <p className="text-xs text-[var(--muted)]">Current Image stored</p>
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="mt-1 cursor-pointer text-xs text-[var(--secondary)] font-bold hover:underline block"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {kind === "jobs" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-bold">
                Organization
                <input
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                />
              </label>
              <label className="block text-sm font-bold">
                Deadline
                <input
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                />
              </label>
            </div>
          ) : null}

          {kind === "quizzes" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="block text-sm font-bold">
                Exam
                <input
                  value={exam}
                  onChange={(event) => setExam(event.target.value)}
                  placeholder="e.g. KPSC"
                  className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                  required
                />
              </label>
              <label className="block text-sm font-bold">
                Subject
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="e.g. Current Affairs"
                  className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                  required
                />
              </label>
              <div className="grid gap-2 grid-cols-2">
                <label className="block text-sm font-bold">
                  Difficulty
                  <select
                    value={difficulty}
                    onChange={(event) => setDifficulty(event.target.value as "Easy" | "Medium" | "Hard")}
                    className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </label>
                <label className="block text-sm font-bold">
                  Time Limit (min)
                  <input
                    type="number"
                    value={timeLimitMinutes}
                    onChange={(event) => setTimeLimitMinutes(event.target.value)}
                    className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                    min="1"
                    required
                  />
                </label>
              </div>
            </div>
          ) : null}

          {kind !== "currentAffairs" && kind !== "quizzes" ? (
            <label className="mt-4 block text-sm font-bold">
              Body
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="mt-2 min-h-44 w-full rounded-md border border-[var(--border)] px-3 py-2"
              />
            </label>
          ) : null}

          {kind === "posts" ? (
            <div className="mt-5 p-4 border border-[var(--border)] rounded-md bg-[var(--surface-soft)] shadow-sm">
              <h4 className="text-sm font-bold text-[var(--primary)] mb-3 flex items-center gap-1.5 select-none">
                <span className="text-base">🔗</span> External Reference Link (Optional)
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-[var(--primary)]">
                  External Link URL
                  <input
                    type="url"
                    placeholder="e.g. https://architect.com/project-listing"
                    value={sourceUrl}
                    onChange={(event) => setSourceUrl(event.target.value)}
                    className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2 bg-white font-normal"
                  />
                </label>
                <label className="block text-sm font-semibold text-[var(--primary)]">
                  Link Label / Website Name
                  <input
                    type="text"
                    placeholder="e.g. Visit Architectural Site, View Floor Plan"
                    value={sourceName}
                    onChange={(event) => setSourceName(event.target.value)}
                    className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2 bg-white font-normal"
                  />
                </label>
              </div>
              <p className="mt-2.5 text-xs text-[var(--muted)] leading-relaxed">
                Provide these details so users can easily visit the given external site (e.g., real estate portfolios, interior design services, or product promotions).
              </p>
            </div>
          ) : null}

          {kind === "quizzes" ? (
            <div className="mt-6 border-t border-[var(--border)] pt-6">
              <h3 className="text-lg font-serif font-bold text-[var(--primary)] mb-4">Quiz Questions ({questions.length})</h3>

              <div className="grid gap-6">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-[var(--primary)]">Question {qIndex + 1}</span>
                      {questions.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIndex)}
                          className="text-xs text-[var(--secondary)] font-bold hover:underline"
                        >
                          Remove Question
                        </button>
                      ) : null}
                    </div>

                    <label className="block text-sm font-bold mb-3">
                      Question Text
                      <input
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                        className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
                        required
                      />
                    </label>

                    <div className="grid gap-3 md:grid-cols-2 mb-3">
                      {q.options.map((opt, optIndex) => (
                        <label key={optIndex} className="block text-sm font-semibold">
                          Option {String.fromCharCode(65 + optIndex)}
                          <input
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
                            required
                          />
                        </label>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block text-sm font-bold">
                        Correct Option
                        <select
                          value={q.correctOptionIndex}
                          onChange={(e) => handleQuestionChange(qIndex, "correctOptionIndex", Number(e.target.value))}
                          className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
                        >
                          <option value={0}>Option A</option>
                          <option value={1}>Option B</option>
                          <option value={2}>Option C</option>
                          <option value={3}>Option D</option>
                        </select>
                      </label>

                      <label className="block text-sm font-bold">
                        Explanation
                        <input
                          value={q.explanation}
                          onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                          className="mt-1 w-full rounded-md border border-[var(--border)] bg-white px-3 py-2"
                          placeholder="Why is this option correct?"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-4 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold hover:bg-[var(--surface-soft)]"
              >
                + Add Question
              </button>
            </div>
          ) : null}

          <div className="mt-5 flex gap-3">
            <button className="rounded-md bg-[var(--secondary)] px-5 py-3 text-sm font-bold text-white">
              {saving ? "Saving..." : editingId ? "Save Changes" : "Save published content"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-md border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
          {message ? <p className="mt-3 text-sm font-semibold text-[var(--primary)]">{message}</p> : null}
        </form>

        <aside className="kq-card p-5">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">Published & Draft Content</h2>
              <span className="text-xs bg-[var(--surface-soft)] text-[var(--muted)] border border-[var(--border)] px-2.5 py-1 rounded-full font-bold">
                Pool Size: {items.length}
              </span>
            </div>

            {/* Filter & Search Bar Controls */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-[var(--surface-soft)] p-4 rounded-lg border border-[var(--border)]/60">
              <div className="flex flex-col">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)] mb-1.5">Search Title or Slug</label>
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                />
              </div>

              {kind === "posts" && (
                <div className="flex flex-col">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)] mb-1.5">Filter Category</label>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                  >
                    <option value="All">All Categories</option>
                    <option value="General">General News</option>
                    <option value="Karnataka">Karnataka News</option>
                    <option value="National">National News</option>
                    <option value="International">International News</option>
                    <option value="Jobs">Jobs & Careers</option>
                    <option value="Current Affairs">Current Affairs</option>
                    <option value="Agriculture">Agriculture Info</option>
                    <option value="College Guide">College & Education Guide</option>
                    <option value="Government Schemes">Government Schemes</option>
                    <option value="Heritage & Tourism">Heritage & Tourism</option>
                    <option value="Sports News">Sports News</option>
                    <option value="Movies">Movies & Cinema</option>
                    <option value="Home Design">Home Design & Real Estate</option>
                  </select>
                </div>
              )}

              <div className="flex flex-col">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[var(--muted)] mb-1.5">Filter Language</label>
                <select
                  value={selectedLocaleFilter}
                  onChange={(e) => setSelectedLocaleFilter(e.target.value)}
                  className="rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                >
                  <option value="All">All Languages</option>
                  <option value="kn">Kannada (kn)</option>
                  <option value="en">English (en)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {(() => {
              const filteredItems = items.filter((item) => {
                const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                   (item.slug || "").toLowerCase().includes(searchQuery.toLowerCase());
                
                let categoryMatch = true;
                if (selectedCategoryFilter !== "All" && kind === "posts") {
                  const filterKey = selectedCategoryFilter.toLowerCase().trim();
                  const itemCategory = (item.category || "").toLowerCase().trim();
                  
                  // Define synonyms and mapping groups for robust matching
                  const categoryGroups: Record<string, string[]> = {
                    general: ["general", "general news", "ಸಾಮಾನ್ಯ"],
                    karnataka: ["karnataka", "karnataka news", "ಕರ್ನಾಟಕ", "ಕರ್ನಾಟಕ ಸುದ್ದಿ"],
                    national: ["national", "national news", "ರಾಷ್ಟ್ರೀಯ", "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ"],
                    international: ["international", "international news", "ಅಂತರರಾಷ್ಟ್ರೀಯ", "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ"],
                    jobs: ["jobs", "jobs & careers", "kpsc", "exam notifications", "ಉದ್ಯೋಗಗಳು", "ಉದ್ಯೋಗ"],
                    "current affairs": ["current affairs", "ಚಾಲ್ತಿ ವಿದ್ಯಮಾನಗಳು"],
                    agriculture: ["agriculture", "agriculture info", "ಕೃಷಿ"],
                    "college guide": ["college guide", "education", "education & college guide", "college & education guide", "ಶಿಕ್ಷಣ"],
                    "government schemes": ["government schemes", "schemes", "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು"],
                    "heritage & tourism": ["heritage & tourism", "tourism", "ಪ್ರವಾಸೋದ್ಯಮ"],
                    "sports news": ["sports news", "sports", "ಕ್ರೀಡೆ"],
                    movies: ["movies", "movies & cinema", "cinema", "film", "ಚಲನಚಿತ್ರ"],
                    "home design": ["home design", "real estate", "interior", "house plans", "promotion", "services", "home design & real estate", "ಮನೆ ವಿನ್ಯಾಸ ಮತ್ತು ರಿಯಲ್ ಎಸ್ಟೇಟ್"],
                  };

                  const groupSynonyms = categoryGroups[filterKey] || [filterKey];
                  
                  // Matches if:
                  // 1. Exact or near match of any synonym inside the item category (or vice versa)
                  // 2. The item category contains the filter key or vice versa
                  categoryMatch = groupSynonyms.some(syn => itemCategory.includes(syn) || syn.includes(itemCategory)) ||
                                  itemCategory.includes(filterKey) ||
                                  filterKey.includes(itemCategory);
                }
                
                let localeMatch = true;
                if (selectedLocaleFilter !== "All") {
                  localeMatch = (item.locale || "").toLowerCase() === selectedLocaleFilter.toLowerCase();
                }
                
                return titleMatch && categoryMatch && localeMatch;
              });

              if (filteredItems.length) {
                return (
                  <>
                    <p className="text-xs text-[var(--muted)] font-semibold px-1 mb-1">
                      Showing {filteredItems.length} of {items.length} records
                    </p>
                    {filteredItems.map((item) => (
                      <article key={item.id} className="rounded-md border border-[var(--border)] p-3 flex justify-between items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-bold text-[var(--primary)] flex flex-wrap gap-1.5 items-center">
                            <span>{item.title}</span>
                            {item.status === "draft" && (
                              <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-800 border border-amber-200">
                                Draft
                              </span>
                            )}
                            {(kind === "posts" || kind === "jobs") && (
                              item.isManual ? (
                                <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-emerald-800 border border-emerald-200">
                                  Manual
                                </span>
                              ) : (
                                <span className="inline-block rounded bg-violet-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-violet-800 border border-violet-200">
                                  Auto
                                </span>
                              )
                            )}
                          </p>
                          <p className="mt-1 text-xs text-[var(--muted)]">
                            {item.locale ?? "n/a"} {item.category ? `• ${item.category}` : ""} {item.slug ? `• ${item.slug}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0 items-center">
                          {(kind === "posts" || kind === "jobs") && !item.isManual && (
                            <button
                              type="button"
                              onClick={() => handleVerifyItem(item.id)}
                              className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
                              title="Mark as human reviewed & manual equivalent"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleEditInit(item.id)}
                            className="text-xs text-[var(--primary)] font-bold hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-[var(--secondary)] font-bold hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </>
                );
              }

              return (
                <p className="text-sm leading-6 text-[var(--muted)] bg-[var(--surface-soft)] p-4 rounded-md text-center border border-dashed border-[var(--border)]">
                  No records match your search or filter settings.
                </p>
              );
            })()}
          </div>
        </aside>
      </div>
      ) : (
        <div className="mt-8 grid gap-6">
          {/* Database Maintenance and Cleanup Panel */}
          <div className="kq-card p-6 border border-amber-200 bg-amber-50/45 rounded-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clean Database & Remove Automated Content
                </h3>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Permanently delete all synced RSS articles and automated job alerts from your Firestore database to keep your platform 100% manually curated.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCleanAutomatedContent}
                disabled={cleaningDb}
                className="rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-5 py-2.5 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer"
              >
                {cleaningDb ? "Cleaning Database..." : "Clean Database Now"}
              </button>
            </div>
            {cleanMessage && (
              <div className="mt-4 p-3 bg-white border border-amber-200 rounded-md text-xs font-mono text-amber-900 whitespace-pre-wrap leading-relaxed shadow-inner">
                {cleanMessage}
              </div>
            )}
          </div>

          {/* Stats Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="kq-card p-5 flex flex-col justify-between hover:shadow-sm transition-all border border-[var(--border)]">
              <div>
                <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Total Articles</p>
                <h3 className="mt-2 text-3xl font-serif font-bold text-[var(--primary)]">{stats.posts}</h3>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">Synced news, study material</p>
            </div>
            <div className="kq-card p-5 flex flex-col justify-between hover:shadow-sm transition-all border border-[var(--border)]">
              <div>
                <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Total Quizzes</p>
                <h3 className="mt-2 text-3xl font-serif font-bold text-[var(--primary)]">{stats.quizzes}</h3>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">Practice exam question sets</p>
            </div>
            <div className="kq-card p-5 flex flex-col justify-between hover:shadow-sm transition-all border border-[var(--border)]">
              <div>
                <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Job Alerts</p>
                <h3 className="mt-2 text-3xl font-serif font-bold text-[var(--primary)]">{stats.jobs}</h3>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">KPSC, KEA, state career alerts</p>
            </div>
            <div className="kq-card p-5 flex flex-col justify-between hover:shadow-sm transition-all border border-[var(--border)]">
              <div>
                <p className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">Current Affairs</p>
                <h3 className="mt-2 text-3xl font-serif font-bold text-[var(--primary)]">{stats.currentAffairs}</h3>
              </div>
              <p className="mt-2 text-xs text-[var(--muted)]">Bilingual GK daily highlights</p>
            </div>
          </div>

          {/* Content Balance & API Fetching Data Visualizations */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Card 1: Content Balance Donut Chart */}
            <div className="kq-card p-6 border border-[var(--border)] bg-white flex flex-col items-center justify-between">
              <div className="text-center w-full">
                <h3 className="font-serif text-lg font-bold text-[var(--primary)]">Content Balance</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Manual vs. Automated Article Ratio</p>
              </div>

              <div className="relative my-6 flex items-center justify-center">
                {/* SVG Donut Chart */}
                <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
                  {/* Outer circle track (grey) if no content */}
                  {totalPosts === 0 ? (
                    <circle cx="70" cy="70" r="50" fill="transparent" stroke="#e2e8f0" strokeWidth="14" />
                  ) : (
                    <>
                      {/* Automated content (Purple) */}
                      <circle
                        cx="70"
                        cy="70"
                        r="50"
                        fill="transparent"
                        stroke="#8b5cf6"
                        strokeWidth="14"
                      />
                      {/* Manual content overlay (Orange) */}
                      <circle
                        cx="70"
                        cy="70"
                        r="50"
                        fill="transparent"
                        stroke="#f97316"
                        strokeWidth="14"
                        strokeDasharray="314.16"
                        strokeDashoffset={314.16 - (314.16 * manualPct) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </>
                  )}
                </svg>
                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[var(--primary)]">{manualPct}%</span>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[var(--muted)]">Manual</span>
                </div>
              </div>

              {/* Color Code Labels */}
              <div className="flex gap-4 justify-center text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-orange-500 inline-block"></span>
                  <span className="text-[var(--primary)]">Manual ({manualPosts})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-violet-500 inline-block"></span>
                  <span className="text-[var(--primary)]">Automated ({autoPosts})</span>
                </div>
              </div>
            </div>

            {/* Card 2: API Data Fetching Stats */}
            <div className="kq-card p-6 border border-[var(--border)] bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--primary)]">API Fetching Statistics</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Volume of data fetched & summarized via Gemini API</p>
                
                <div className="mt-4 space-y-4">
                  {/* Last 4 Hours */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[var(--primary)] mb-1">
                      <span>Last 4 Hours</span>
                      <span className="text-violet-600 font-extrabold">{syncStats.fourHours.calls} Gemini calls</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200 overflow-hidden relative">
                      <div className="bg-blue-500 h-full inline-block" style={{ width: `${Math.min(100, (syncStats.fourHours.feeds / 200) * 100)}%` }} title="Scanned feeds"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-[var(--muted)] font-bold mt-1">
                      <span>{syncStats.fourHours.feeds} Items Scanned</span>
                      <span>{syncStats.fourHours.posts} Articles Created</span>
                    </div>
                  </div>

                  {/* Last 12 Hours */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[var(--primary)] mb-1">
                      <span>Last 12 Hours</span>
                      <span className="text-violet-600 font-extrabold">{syncStats.twelveHours.calls} Gemini calls</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200 overflow-hidden relative">
                      <div className="bg-blue-500 h-full inline-block" style={{ width: `${Math.min(100, (syncStats.twelveHours.feeds / 500) * 100)}%` }} title="Scanned feeds"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-[var(--muted)] font-bold mt-1">
                      <span>{syncStats.twelveHours.feeds} Items Scanned</span>
                      <span>{syncStats.twelveHours.posts} Articles Created</span>
                    </div>
                  </div>

                  {/* Last 24 Hours */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[var(--primary)] mb-1">
                      <span>Last 24 Hours</span>
                      <span className="text-violet-600 font-extrabold">{syncStats.day.calls} Gemini calls</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200 overflow-hidden relative">
                      <div className="bg-blue-500 h-full inline-block" style={{ width: `${Math.min(100, (syncStats.day.feeds / 1000) * 100)}%` }} title="Scanned feeds"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-[var(--muted)] font-bold mt-1">
                      <span>{syncStats.day.feeds} Items Scanned</span>
                      <span>{syncStats.day.posts} Articles Created</span>
                    </div>
                  </div>

                  {/* Last 7 Days */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-[var(--primary)] mb-1">
                      <span>Last 7 Days</span>
                      <span className="text-violet-600 font-extrabold">{syncStats.week.calls} Gemini calls</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200 overflow-hidden relative">
                      <div className="bg-blue-500 h-full inline-block" style={{ width: `${Math.min(100, (syncStats.week.feeds / 6000) * 100)}%` }} title="Scanned feeds"></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-[var(--muted)] font-bold mt-1">
                      <span>{syncStats.week.feeds} Items Scanned</span>
                      <span>{syncStats.week.posts} Articles Created</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-center text-[var(--muted)] font-bold border-t border-[var(--border)] pt-3 mt-3">
                Calculated dynamically from {syncLogs.length} logged runs.
              </div>
            </div>

            {/* Card 3: Google Policy & SEO Compliance Advice */}
            <div className="kq-card p-6 border border-[var(--border)] bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--primary)] font-bold">Google & SEO Compliance</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Status of your platform's publisher quality and monetization index</p>
                
                {/* Status Badge */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-[var(--primary)]">Status:</span>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider border ${
                    totalPosts === 0
                      ? "bg-gray-50 border-gray-200 text-gray-800"
                      : manualPct >= 45 && manualPct <= 55
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : manualPct > 55
                          ? "bg-sky-50 border-sky-200 text-sky-800"
                          : "bg-amber-50 border-amber-200 text-amber-800 animate-pulse"
                  }`}>
                    {totalPosts === 0
                      ? "No Data"
                      : manualPct >= 45 && manualPct <= 55
                        ? "Perfect 50/50 Balance"
                        : manualPct > 55
                          ? "High Manual Content (Safe)"
                          : "High Automated Content (Warning)"}
                  </span>
                </div>

                {/* Balance Meter Bar */}
                <div className="mt-4">
                  <div className="w-full bg-slate-100 rounded-full h-3 border border-[var(--border)] relative overflow-hidden">
                    <div className="bg-violet-500 h-full w-full absolute top-0 left-0"></div>
                    <div 
                      className="bg-orange-500 h-full absolute top-0 left-0 transition-all duration-500" 
                      style={{ width: `${manualPct}%` }}
                    ></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white opacity-80" title="50% Target"></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-bold mt-1">
                    <span className="text-orange-600">Manual ({manualPct}%)</span>
                    <span className="text-violet-600">Automated ({autoPct}%)</span>
                  </div>
                </div>

                {/* Health Advice Paragraph */}
                <p className="mt-3 text-xs text-[var(--muted)] leading-relaxed">
                  {totalPosts === 0
                    ? "Upload some articles manually or run the RSS synchronization script to calculate your compliance status."
                    : manualPct >= 45 && manualPct <= 55
                      ? "Excellent! Your site maintains a healthy 50% automated / 50% manual ratio. This satisfies Google's Helpful Content guidelines."
                      : manualPct > 55
                        ? `Good! You have a robust manual ratio of ${manualPct}%. Your site is in a very safe zone for SEO.`
                        : `Warning: Automated content makes up ${autoPct}% of your articles. Google may flag your site for 'Low-value' content. Please manually upload some high-quality articles or guides.`}
                </p>
              </div>

              {/* Quick Checklist */}
              <div className="border-t border-[var(--border)] pt-3 mt-3 grid gap-1.5 grid-cols-2 text-[10px] font-bold text-[var(--muted)]">
                <div className="flex items-center gap-1">
                  <svg className={`w-3.5 h-3.5 shrink-0 ${totalPosts > 0 && manualPct >= 45 ? "text-emerald-500" : "text-amber-500"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Min. 45% Manual</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Bilingual RSS Credit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Speed Loading Performance & Live SEO Analyzer */}
          <div className="grid gap-6 md:grid-cols-[1.2fr_1.8fr]">
            {/* Speed loading dashboard */}
            <div className="kq-card p-6 border border-[var(--border)] bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--primary)]">Speed Performance (RUM)</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Real-User Monitoring from your current session</p>
                
                <div className="mt-5 grid gap-4 grid-cols-2">
                  <div className="p-3 border border-[var(--border)] rounded bg-slate-50 text-center">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase">TTFB (Response)</p>
                    <h4 className={`text-xl font-bold mt-1 ${perfMetrics.ttfbMs === 0 ? "text-slate-400" : perfMetrics.ttfbMs < 200 ? "text-emerald-600" : perfMetrics.ttfbMs < 500 ? "text-amber-600" : "text-rose-600"}`}>
                      {perfMetrics.ttfbMs === 0 ? "Pending" : `${perfMetrics.ttfbMs} ms`}
                    </h4>
                    <span className="text-[9px] text-[var(--muted)] block mt-0.5">
                      {perfMetrics.ttfbMs === 0 ? "Wait..." : perfMetrics.ttfbMs < 200 ? "Fast (Ideal)" : perfMetrics.ttfbMs < 500 ? "Moderate" : "Slow (Optimize)"}
                    </span>
                  </div>
                  <div className="p-3 border border-[var(--border)] rounded bg-slate-50 text-center">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase">DOM Content Loaded</p>
                    <h4 className={`text-xl font-bold mt-1 ${perfMetrics.domReadyMs === 0 ? "text-slate-400" : perfMetrics.domReadyMs < 1000 ? "text-emerald-600" : perfMetrics.domReadyMs < 2500 ? "text-amber-600" : "text-rose-600"}`}>
                      {perfMetrics.domReadyMs === 0 ? "Pending" : `${(perfMetrics.domReadyMs / 1000).toFixed(2)} s`}
                    </h4>
                    <span className="text-[9px] text-[var(--muted)] block mt-0.5">
                      {perfMetrics.domReadyMs === 0 ? "Wait..." : perfMetrics.domReadyMs < 1000 ? "Good" : perfMetrics.domReadyMs < 2500 ? "Needs Improvement" : "Poor"}
                    </span>
                  </div>
                  <div className="p-3 border border-[var(--border)] rounded bg-slate-50 text-center">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase">Page Load Time</p>
                    <h4 className={`text-xl font-bold mt-1 ${perfMetrics.loadTimeMs === 0 ? "text-slate-400" : perfMetrics.loadTimeMs < 1500 ? "text-emerald-600" : perfMetrics.loadTimeMs < 3500 ? "text-amber-600" : "text-rose-600"}`}>
                      {perfMetrics.loadTimeMs === 0 ? "Pending" : `${(perfMetrics.loadTimeMs / 1000).toFixed(2)} s`}
                    </h4>
                    <span className="text-[9px] text-[var(--muted)] block mt-0.5">
                      {perfMetrics.loadTimeMs === 0 ? "Wait..." : perfMetrics.loadTimeMs < 1500 ? "Fast" : perfMetrics.loadTimeMs < 3500 ? "Moderate" : "Slow"}
                    </span>
                  </div>
                  <div className="p-3 border border-[var(--border)] rounded bg-slate-50 text-center">
                    <p className="text-[10px] font-bold text-[var(--muted)] uppercase">UI Rendering Time</p>
                    <h4 className="text-xl font-bold mt-1 text-[var(--primary)]">
                      {perfMetrics.renderTimeMs === 0 ? "Pending" : `${perfMetrics.renderTimeMs} ms`}
                    </h4>
                    <span className="text-[9px] text-[var(--muted)] block mt-0.5">Hydration & Assets</span>
                  </div>
                </div>
              </div>

              {/* Best practices suggestions */}
              <div className="mt-5 border-t border-[var(--border)] pt-4">
                <h4 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2.5">Speed Best Practices</h4>
                <ul className="text-xs space-y-2 text-[var(--muted)] list-disc list-inside">
                  <li><strong>Edge Caching (ISR):</strong> Next.js statically renders pages with a 5-minute cache (`revalidate = 300`). Keep this active to maintain ultra-fast speeds and prevent database costs.</li>
                  <li><strong>Image Optimization:</strong> Utilize Next.js `Image` element or configure responsive aspect ratios to prevent Layout Shifts (CLS).</li>
                  <li><strong>Asset Compression:</strong> Compress all featured images before uploading in Admin panel. Keep sizes under 150 KB.</li>
                </ul>
              </div>
            </div>

            {/* Live SEO Page Analyzer */}
            <div className="kq-card p-6 border border-[var(--border)] bg-white flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[var(--primary)]">On-Page SEO Analyzer</h3>
                <p className="text-xs text-[var(--muted)] mt-1">Audit HTML meta tags, heading hierarchies, alt descriptions, and schemas</p>
                
                {/* Search / Analyzer Input */}
                <div className="mt-4 flex gap-2">
                  <input
                    value={seoSlug}
                    onChange={(e) => setSeoSlug(e.target.value)}
                    placeholder="Enter site relative path (e.g. /kn, /en/category/jobs)"
                    className="flex-1 rounded-md border border-[var(--border)] px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={analyzeSeoPage}
                    disabled={analyzingSeo}
                    className="rounded-md bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-xs font-bold px-4 py-2 cursor-pointer select-none transition-colors"
                  >
                    {analyzingSeo ? "Analyzing..." : "Analyze"}
                  </button>
                </div>

                {seoError && (
                  <p className="mt-3 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded p-2.5">
                    {seoError}
                  </p>
                )}

                {/* Audit Results Dashboard */}
                {seoResult ? (
                  <div className="mt-5 border-t border-[var(--border)] pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[var(--primary)]">SEO Score:</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-black ${seoResult.score >= 80 ? "text-emerald-600" : seoResult.score >= 50 ? "text-amber-500" : "text-rose-600"}`}>
                          {seoResult.score} / 100
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                          seoResult.score >= 80
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : seoResult.score >= 50
                              ? "bg-amber-50 border-amber-200 text-amber-800"
                              : "bg-rose-50 border-rose-200 text-rose-800"
                        }`}>
                          {seoResult.score >= 80 ? "Excellent" : seoResult.score >= 50 ? "Moderate" : "Poor"}
                        </span>
                      </div>
                    </div>

                    {/* Meta Info Snippet Preview */}
                    <div className="mt-4 p-3 border border-[var(--border)] rounded bg-slate-50 text-xs">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Search Engine Snippet Preview</p>
                      <h4 className="text-[#1a0dab] hover:underline font-medium text-base truncate mt-1.5 leading-snug">
                        {seoResult.title || "Missing Title"}
                      </h4>
                      <p className="text-[#006621] truncate mt-0.5 leading-tight">
                        {typeof window !== "undefined" ? window.location.origin : "https://kannadaquiz.in"}{seoSlug}
                      </p>
                      <p className="text-[#545454] mt-1 line-clamp-2 leading-relaxed">
                        {seoResult.metaDesc || "Missing meta description. Search engines will fallback to scrap content from your body text which may degrade CTR."}
                      </p>
                    </div>

                    {/* Metrics Checklist details */}
                    <div className="mt-4 grid gap-2 grid-cols-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] text-center">
                      <div className="p-2 border border-[var(--border)] rounded bg-white">
                        <span>H1 tags</span>
                        <span className={`block text-sm font-bold mt-0.5 ${seoResult.h1Count === 1 ? "text-emerald-600" : "text-amber-500"}`}>
                          {seoResult.h1Count}
                        </span>
                      </div>
                      <div className="p-2 border border-[var(--border)] rounded bg-white">
                        <span>Missing alt</span>
                        <span className={`block text-sm font-bold mt-0.5 ${seoResult.missingAltCount === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {seoResult.missingAltCount} / {seoResult.imgCount}
                        </span>
                      </div>
                      <div className="p-2 border border-[var(--border)] rounded bg-white">
                        <span>Schemas</span>
                        <span className={`block text-sm font-bold mt-0.5 ${seoResult.schemaCount > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                          {seoResult.schemaCount}
                        </span>
                      </div>
                    </div>

                    {/* Suggestions */}
                    {seoResult.suggestions.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-2">Suggestions to Optimize</h4>
                        <ul className="text-xs space-y-1.5 text-[var(--muted)] list-none pl-0">
                          {seoResult.suggestions.map((sug: string, idx: number) => (
                            <li key={idx} className="flex gap-1.5 items-start">
                              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${sug.startsWith("Critical:") ? "bg-rose-500" : sug.startsWith("Warning:") ? "bg-amber-500" : "bg-sky-500"}`}></span>
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-8 text-center text-xs text-[var(--muted)] py-12 border border-dashed border-[var(--border)] rounded">
                    Click "Analyze" to audit the SEO parameters of any URL paths on your site.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sync History Logs Table */}
          <div className="kq-card p-5 border border-[var(--border)]">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[var(--primary)]">API Sync Telemetry</h3>
                <p className="text-xs text-[var(--muted)]">RSS feeds parser, Gemini translation & database write execution logs</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void loadSyncLogs();
                  void loadStats();
                }}
                className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-bold bg-white hover:bg-[var(--surface-soft)] cursor-pointer select-none transition-colors"
              >
                Refresh Data
              </button>
            </div>

            {loadingLogs ? (
              <div className="py-8 text-center text-sm text-[var(--muted)]">Loading telemetry data...</div>
            ) : syncLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                      <th className="pb-3 pr-4">Timestamp</th>
                      <th className="pb-3 px-4">Status</th>
                      <th className="pb-3 px-4">Duration</th>
                      <th className="pb-3 px-4 text-center">Gemini Calls</th>
                      <th className="pb-3 px-4 text-center">Feeds Scanned</th>
                      <th className="pb-3 px-4 text-center">Docs Published</th>
                      <th className="pb-3 pl-4">Details / Errors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {syncLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[var(--surface-soft)] transition-colors">
                        <td className="py-3 pr-4 font-mono text-xs whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-black uppercase tracking-wider ${
                              log.status === "success"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{log.durationSeconds}s</td>
                        <td className="py-3 px-4 text-center font-semibold text-[var(--primary)]">{log.geminiCalls}</td>
                        <td className="py-3 px-4 text-center">{log.feedItemsChecked}</td>
                        <td className="py-3 px-4 text-center font-bold text-[var(--secondary)]">{log.postsCreated}</td>
                        <td className="py-3 pl-4 text-xs text-[var(--muted)] max-w-xs truncate" title={log.errorMessage}>
                          {log.errorMessage || <span className="italic opacity-50">None</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-[var(--muted)]">No execution telemetry logs found. Run the synchronization script to log stats.</div>
            )}
          </div>
        </div>
      )}
    </AdminFrame>
  );
}

function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="kq-container py-8">{children}</div>
    </main>
  );
}

function readFirebaseError(error: unknown) {
  if (typeof error === "object" && error && "code" in error && "message" in error) {
    const code = String((error as { code?: unknown }).code ?? "unknown");
    const message = String((error as { message?: unknown }).message ?? "Unknown Firebase error");
    
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      return "Incorrect email or password. Please verify your administrator credentials.";
    }
    if (code === "auth/too-many-requests") {
      return "Too many failed login attempts. Please try again later.";
    }
    if (code === "storage/unauthorized" || code === "storage/retry-limit-exceeded" || message.includes("unauthorized") || message.includes("permission-denied")) {
      return "Permission Denied: You do not have authorization to upload files or modify this resource. If you recently registered or had permissions updated, please log out and sign back in to refresh your administrative access token.";
    }
    
    return `${code}: ${message}`;
  }

  return "An unexpected error occurred. Please try again.";
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

const kindLabels: Record<ContentKind, { label: string; icon: string; kn: string }> = {
  posts: { label: "Articles", icon: "📰", kn: "ಲೇಖನಗಳು" },
  quizzes: { label: "Quizzes", icon: "🎯", kn: "ರಸಪ್ರಶ್ನೆಗಳು" },
  jobs: { label: "Job Alerts", icon: "💼", kn: "ಉದ್ಯೋಗ ಮಾಹಿತಿ" },
  currentAffairs: { label: "Current Affairs", icon: "🌐", kn: "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ" },
};

const POST_CATEGORIES = [
  { value: "Jobs", label: "Jobs & Recruitment (ಉದ್ಯೋಗ)" },
  { value: "Current Affairs", label: "Current Affairs (ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ)" },
  { value: "College Guide", label: "Education & Guidance (ಶಿಕ್ಷಣ ಮಾರ್ಗದರ್ಶಿ)" },
  { value: "Government Schemes", label: "Govt Schemes (ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು)" },
  { value: "Technology", label: "Technology & AI (ತಂತ್ರಜ್ಞಾನ)" },
  { value: "Syllabus", label: "Syllabus & Pattern (ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ)" },
  { value: "Hall Ticket", label: "Admit Card & Hall Ticket (ಪ್ರವೇಶ ಪತ್ರ)" },
  { value: "General", label: "General Knowledge (ಸಾಮಾನ್ಯ ಜ್ಞಾನ)" },
];

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [kind, setKind] = useState<ContentKind>("posts");
  const [locale, setLocale] = useState<"kn" | "en">("kn");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Jobs");
  const [organization, setOrganization] = useState("");
  const [deadline, setDeadline] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [isFeaturedPost, setIsFeaturedPost] = useState(false);

  // Quiz specific states
  const [exam, setExam] = useState("KPSC");
  const [subject, setSubject] = useState("General Knowledge");
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

  // UI state
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [items, setItems] = useState<PublishedItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Counts summary
  const [counts, setCounts] = useState({ posts: 0, quizzes: 0, jobs: 0, currentAffairs: 0 });

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedLocaleFilter, setSelectedLocaleFilter] = useState("All");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const canUseFirebase = hasFirebaseConfig && firebaseAuth && firestore;

  // Auto-generate safe slug
  const generatedSlug = useMemo(() => {
    const latinized = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);

    if (latinized.length >= 3) {
      return latinized;
    }
    // Fallback if title is purely non-Latin (Kannada)
    return `${kind === "quizzes" ? "quiz" : kind === "jobs" ? "job" : "post"}-${Date.now().toString(36)}`;
  }, [title, kind]);

  // Listen to Auth State
  useEffect(() => {
    if (!firebaseAuth) {
      setAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Load counts summary
  async function loadCounts() {
    if (!firestore) return;
    try {
      const [postsSnap, quizzesSnap, jobsSnap, caSnap] = await Promise.all([
        getDocs(query(collection(firestore, firestoreCollections.posts), limit(1000))),
        getDocs(query(collection(firestore, firestoreCollections.quizzes), limit(1000))),
        getDocs(query(collection(firestore, firestoreCollections.jobs), limit(1000))),
        getDocs(query(collection(firestore, firestoreCollections.currentAffairs), limit(1000))),
      ]);
      setCounts({
        posts: postsSnap.size,
        quizzes: quizzesSnap.size,
        jobs: jobsSnap.size,
        currentAffairs: caSnap.size,
      });
    } catch (e) {
      console.warn("Failed to fetch inventory counts:", e);
    }
  }

  // Load Items when tab or user changes
  useEffect(() => {
    if (user) {
      void loadItems(kind);
      void loadCounts();
    }
  }, [kind, user]);

  async function loadItems(nextKind: ContentKind) {
    if (!firestore) return;
    setLoadingItems(true);

    try {
      let snapshot;
      try {
        const docsQuery = query(
          collection(firestore, firestoreCollections[nextKind]),
          orderBy("updatedAt", "desc"),
          limit(1000)
        );
        snapshot = await getDocs(docsQuery);
      } catch {
        const fallbackQuery = query(
          collection(firestore, firestoreCollections[nextKind]),
          limit(1000)
        );
        snapshot = await getDocs(fallbackQuery);
      }

      const nextItems = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: String(data.title ?? data.headline ?? "Untitled"),
          slug: typeof data.slug === "string" ? data.slug : undefined,
          locale: typeof data.locale === "string" ? data.locale : undefined,
          status: typeof data.status === "string" && data.status ? data.status : "published",
          isManual: data.isManual === true,
          category: typeof data.category === "string" ? data.category : undefined,
          updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toLocaleDateString() : undefined,
        };
      });

      setItems(nextItems);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoadingItems(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firebaseAuth) {
      setAuthError("Firebase Auth is not configured.");
      return;
    }

    setAuthError("");
    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    } catch (error) {
      setAuthError(readFirebaseError(error));
    }
  }

  async function uploadImage(file: File, targetSlug: string): Promise<string> {
    if (!firebaseStorage) return "";
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `featured-images/${targetSlug}-${Date.now()}-${cleanFileName}`;
    const storageRef = ref(firebaseStorage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async function deleteOldImage(url: string) {
    if (!firebaseStorage || !url) return;
    try {
      const storageRef = ref(firebaseStorage, url);
      await deleteObject(storageRef);
    } catch {
      // Image may have already been deleted or be external URL
    }
  }

  function handleAddQuestion() {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" },
    ]);
  }

  function handleRemoveQuestion(index: number) {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleQuestionChange(index: number, field: keyof AdminQuestion, value: any) {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function handleOptionChange(qIndex: number, optIndex: number, value: string) {
    setQuestions((prev) => {
      const updated = [...prev];
      const nextOptions = [...updated[qIndex].options];
      nextOptions[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: nextOptions };
      return updated;
    });
  }

  function resetForm() {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setBody("");
    setOrganization("");
    setDeadline("");
    setSourceUrl("");
    setSourceName("");
    setIsFeaturedPost(false);
    setExam("KPSC");
    setSubject("General Knowledge");
    setDifficulty("Easy");
    setTimeLimitMinutes("5");
    setQuestions([{ question: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" }]);
    setImageFile(null);
    setImageUrl("");
    setEditingId(null);
  }

  async function handleEdit(item: PublishedItem) {
    if (!firestore) return;
    setSaving(true);
    setAlert(null);

    try {
      const docRef = doc(firestore, firestoreCollections[kind], item.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setAlert({ type: "error", text: "Item not found in Firestore." });
        return;
      }

      const data = docSnap.data();
      setEditingId(item.id);
      setTitle(String(data.title ?? data.headline ?? ""));
      setSlug(String(data.slug ?? ""));
      setLocale((data.locale as "kn" | "en") ?? "kn");

      if (data.featuredImageUrl) {
        setImageUrl(String(data.featuredImageUrl));
      } else {
        setImageUrl("");
      }
      setImageFile(null);

      if (kind === "posts") {
        setExcerpt(String(data.excerpt ?? ""));
        setBody(String(data.body ?? ""));
        setCategory(String(data.category ?? "Jobs"));
        setSourceUrl(String(data.sourceUrl ?? ""));
        setSourceName(String(data.sourceName ?? ""));
        setIsFeaturedPost(Boolean(data.isFeatured));
      }

      if (kind === "jobs") {
        setOrganization(String(data.organization ?? ""));
        setDeadline(String(data.deadline ?? ""));
        setBody(String(data.body ?? ""));
      }

      if (kind === "currentAffairs") {
        setExcerpt(String(data.summary ?? ""));
        setSourceUrl(String(data.sourceUrl ?? ""));
        setSourceName(String(data.sourceName ?? ""));
      }

      if (kind === "quizzes") {
        setExcerpt(String(data.description ?? ""));
        setExam(String(data.exam ?? "KPSC"));
        setSubject(String(data.subject ?? "General Knowledge"));
        setDifficulty((data.difficulty as "Easy" | "Medium" | "Hard") ?? "Easy");
        const minutes = data.timeLimitSeconds ? Math.ceil(Number(data.timeLimitSeconds) / 60) : 5;
        setTimeLimitMinutes(String(minutes));

        const qQuery = query(
          collection(firestore, firestoreCollections.quizQuestions),
          where("quizId", "==", item.id)
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

      // Scroll smoothly to form
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setAlert({ type: "error", text: readFirebaseError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itemId: string) {
    if (!firestore) return;
    const confirm = window.confirm("Are you sure you want to delete this item? This action cannot be undone.");
    if (!confirm) return;

    setSaving(true);
    setAlert(null);

    try {
      const docRef = doc(firestore, firestoreCollections[kind], itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.featuredImageUrl) {
          await deleteOldImage(data.featuredImageUrl);
        }
      }

      await deleteDoc(docRef);

      // Clean up quiz questions if kind is quizzes
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

      setAlert({ type: "success", text: "Item permanently deleted." });
      if (editingId === itemId) resetForm();
      await loadItems(kind);
      await loadCounts();
    } catch (error) {
      setAlert({ type: "error", text: readFirebaseError(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firestore) return;

    const finalSlug = (slug.trim() || generatedSlug).trim();
    if (!title.trim()) {
      setAlert({ type: "error", text: "Title is required." });
      return;
    }

    setSaving(true);
    setAlert(null);

    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
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
        ...((kind === "posts" || kind === "quizzes") && finalImageUrl
          ? { featuredImageUrl: finalImageUrl }
          : {}),
      };

      if (editingId) {
        const docRef = doc(firestore, firestoreCollections[kind], editingId);
        if (kind === "posts") {
          await setDoc(
            docRef,
            {
              ...base,
              excerpt: excerpt.trim(),
              body: body.trim(),
              category: category.trim(),
              isManual: true,
              sourceUrl: sourceUrl.trim() || "",
              sourceName: sourceName.trim() || "",
              isFeatured: isFeaturedPost,
            },
            { merge: true }
          );
        } else if (kind === "jobs") {
          await setDoc(
            docRef,
            {
              ...base,
              organization: organization.trim(),
              deadline: deadline.trim(),
              body: body.trim(),
              isManual: true,
            },
            { merge: true }
          );
        } else if (kind === "currentAffairs") {
          await setDoc(
            docRef,
            {
              locale,
              headline: title.trim(),
              summary: excerpt.trim(),
              slug: finalSlug,
              status: "published",
              updatedAt: serverTimestamp(),
              sourceUrl: sourceUrl.trim() || "",
              sourceName: sourceName.trim() || "",
            },
            { merge: true }
          );
        } else if (kind === "quizzes") {
          await setDoc(
            docRef,
            {
              ...base,
              description: excerpt.trim(),
              exam: exam.trim(),
              subject: subject.trim(),
              difficulty,
              timeLimitSeconds: Number(timeLimitMinutes) * 60,
            },
            { merge: true }
          );

          // Overwrite questions
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

        setAlert({ type: "success", text: "Changes saved successfully!" });
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
            isFeatured: isFeaturedPost,
          });
        } else if (kind === "jobs") {
          await addDoc(collection(firestore, firestoreCollections.jobs), {
            ...createBase,
            organization: organization.trim(),
            deadline: deadline.trim(),
            body: body.trim(),
            isManual: true,
          });
        } else if (kind === "currentAffairs") {
          await addDoc(collection(firestore, firestoreCollections.currentAffairs), {
            locale,
            headline: title.trim(),
            summary: excerpt.trim(),
            slug: finalSlug,
            status: "published",
            publishedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            sourceUrl: sourceUrl.trim() || "",
            sourceName: sourceName.trim() || "",
          });
        } else if (kind === "quizzes") {
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

        setAlert({ type: "success", text: `${kindLabels[kind].label} published successfully!` });
      }

      resetForm();
      await loadItems(kind);
      await loadCounts();
    } catch (error) {
      setAlert({ type: "error", text: readFirebaseError(error) });
    } finally {
      setSaving(false);
    }
  }

  // Filter items
  const filteredItems = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search) ||
        (item.slug && item.slug.toLowerCase().includes(search));

      const matchLocale = selectedLocaleFilter === "All" || item.locale === selectedLocaleFilter;
      const matchStatus = selectedStatusFilter === "All" || item.status === selectedStatusFilter;

      let matchCategory = true;
      if (kind === "posts" && selectedCategoryFilter !== "All") {
        matchCategory = (item.category || "").toLowerCase() === selectedCategoryFilter.toLowerCase();
      }

      return matchSearch && matchLocale && matchStatus && matchCategory;
    });
  }, [items, searchQuery, selectedLocaleFilter, selectedStatusFilter, selectedCategoryFilter, kind]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  if (!canUseFirebase) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-8">
        <div className="max-w-md mx-auto kq-card p-6 text-center">
          <p className="text-xl font-bold text-rose-600">Firebase configuration missing</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Please verify your Firebase environment variables.</p>
        </div>
      </main>
    );
  }

  if (!authReady) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-8">
        <div className="flex items-center gap-3 text-[var(--muted)] font-semibold text-sm">
          <div className="w-5 h-5 border-2 border-[var(--secondary)] border-t-transparent rounded-full animate-spin"></div>
          Checking authentication...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="kq-card max-w-md w-full p-8 rounded-2xl shadow-sm border border-[var(--border)]">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--secondary)]">KannadaQuiz</span>
            <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mt-1">Admin Sign In</h1>
            <p className="text-xs text-[var(--muted)] mt-1">Sign in with authorized administrator credentials</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {authError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                placeholder="admin@kannadaquiz.in"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white font-bold py-3 text-sm transition-colors shadow-sm"
            >
              Sign In to Dashboard
            </button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] pb-20">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-30 shadow-xs">
        <div className="kq-container py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--secondary)] text-white flex items-center justify-center font-bold text-sm">
              KQ
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold text-[var(--primary)]">Admin Control Center</h1>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/kn"
              target="_blank"
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-bold hover:bg-[var(--surface-soft)] transition-colors inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--primary)]"
            >
              <span>View Site</span>
              <span>↗</span>
            </Link>
            <Link
              href="/admin/seo"
              className="rounded-lg border border-[var(--secondary)]/30 bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-bold text-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white transition-all inline-flex items-center gap-1.5"
            >
              <span>⚡ SEO Link Checker</span>
            </Link>
            <button
              type="button"
              onClick={() => firebaseAuth && signOut(firebaseAuth)}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-bold hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="kq-container mt-6">
        {/* Quick Inventory Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          <div className="kq-card p-4 rounded-xl border border-[var(--border)] bg-white">
            <span className="text-xs font-bold text-[var(--muted)] block mb-1">📰 Published Articles</span>
            <span className="text-2xl font-black text-[var(--primary)]">{counts.posts}</span>
          </div>
          <div className="kq-card p-4 rounded-xl border border-[var(--border)] bg-white">
            <span className="text-xs font-bold text-[var(--muted)] block mb-1">🎯 Active Quizzes</span>
            <span className="text-2xl font-black text-amber-600">{counts.quizzes}</span>
          </div>
          <div className="kq-card p-4 rounded-xl border border-[var(--border)] bg-white">
            <span className="text-xs font-bold text-[var(--muted)] block mb-1">💼 Job Alerts</span>
            <span className="text-2xl font-black text-emerald-600">{counts.jobs}</span>
          </div>
          <div className="kq-card p-4 rounded-xl border border-[var(--border)] bg-white">
            <span className="text-xs font-bold text-[var(--muted)] block mb-1">🌐 Current Affairs</span>
            <span className="text-2xl font-black text-blue-600">{counts.currentAffairs}</span>
          </div>
        </div>

        {/* Content Type Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-[var(--border)]">
          {(["posts", "quizzes", "jobs", "currentAffairs"] as ContentKind[]).map((tabKind) => {
            const meta = kindLabels[tabKind];
            const isActive = kind === tabKind;
            return (
              <button
                key={tabKind}
                type="button"
                onClick={() => {
                  setKind(tabKind);
                  resetForm();
                  setAlert(null);
                }}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[var(--secondary)] text-white shadow-sm"
                    : "bg-white text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-soft)]"
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[var(--surface-soft)] text-[var(--muted)]"}`}>
                  {meta.kn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Alert Banner */}
        {alert && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 text-sm font-medium ${
              alert.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{alert.type === "success" ? "✅" : "⚠️"}</span>
              <span>{alert.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setAlert(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100"
            >
              ✕ Dismiss
            </button>
          </div>
        )}

        {/* Main 2-Column Editor + Content Pool Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Form (5 cols) */}
          <div className="lg:col-span-5 kq-card p-6 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-[var(--primary)]">
                  {editingId ? `Edit ${kindLabels[kind].label}` : `New ${kindLabels[kind].label}`}
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  {editingId ? "Update existing content and save" : "Publish fresh content to Firestore"}
                </p>
              </div>
              {editingId && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Editing Mode
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Language Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Language
                  </label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as "kn" | "en")}
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white font-semibold"
                  >
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {kind === "posts" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white font-semibold"
                    >
                      {POST_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  {kind === "currentAffairs" ? "Headline" : "Title"} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter clear, compelling title..."
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm bg-white font-medium focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
                  required
                />
              </div>

              {/* Slug Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">URL Slug</label>
                  <span className="text-[10px] text-[var(--muted)]">Auto: {generatedSlug}</span>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={generatedSlug}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white font-mono text-[var(--muted)] focus:text-[var(--foreground)] focus:ring-2 focus:ring-[var(--secondary)] focus:outline-none"
                />
              </div>

              {/* Job specific fields */}
              {kind === "jobs" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Organization / Dept
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. KPSC / Police / KEA"
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                      Deadline
                    </label>
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="e.g. 30 September 2026"
                      className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Quiz specific fields */}
              {kind === "quizzes" && (
                <div className="space-y-4 p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)]">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Exam</label>
                      <input
                        type="text"
                        value={exam}
                        onChange={(e) => setExam(e.target.value)}
                        placeholder="KPSC"
                        className="w-full rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="History"
                        className="w-full rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")}
                        className="w-full rounded-lg border border-[var(--border)] px-2 py-1.5 text-xs bg-white"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Time (mins)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={timeLimitMinutes}
                        onChange={(e) => setTimeLimitMinutes(e.target.value)}
                        className="w-full rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Questions Builder */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                      <span className="text-xs font-bold text-[var(--primary)]">
                        Questions ({questions.length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="text-xs font-bold text-[var(--secondary)] hover:underline"
                      >
                        + Add Question
                      </button>
                    </div>

                    {questions.map((q, qIndex) => (
                      <div key={qIndex} className="p-3.5 bg-white rounded-lg border border-[var(--border)] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--secondary)]">Q{qIndex + 1}</span>
                          {questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestion(qIndex)}
                              className="text-[11px] text-rose-600 font-bold hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                          placeholder="Type question here..."
                          className="w-full rounded border border-[var(--border)] px-2.5 py-1.5 text-xs"
                          required
                        />

                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-1.5">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctOptionIndex === optIndex}
                                onChange={() => handleQuestionChange(qIndex, "correctOptionIndex", optIndex)}
                                className="shrink-0"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                className="w-full rounded border border-[var(--border)] px-2 py-1 text-xs"
                                required
                              />
                            </div>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={q.explanation}
                          onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                          placeholder="Optional explanation / rationale..."
                          className="w-full rounded border border-[var(--border)] px-2 py-1 text-[11px] text-[var(--muted)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  {kind === "currentAffairs" ? "Summary" : kind === "quizzes" ? "Description" : "Short Excerpt"}
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short 1-2 sentence overview..."
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white"
                />
              </div>

              {/* Body Textarea */}
              {(kind === "posts" || kind === "jobs") && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Full Content / Details
                  </label>
                  <textarea
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Full article or job details (supports plain text or paragraphs)..."
                    className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white leading-relaxed"
                  />
                </div>
              )}

              {/* Image Upload & Preview */}
              {(kind === "posts" || kind === "quizzes") && (
                <div className="p-3.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Featured Image
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                        if (file) setImageUrl(URL.createObjectURL(file));
                      }}
                      className="text-xs text-[var(--muted)] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[var(--primary)] file:border file:border-[var(--border)]"
                    />
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImageUrl("");
                        }}
                        className="text-[11px] text-rose-600 font-bold hover:underline shrink-0"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>
                  {imageUrl && (
                    <div className="mt-2 relative w-full h-28 rounded-lg overflow-hidden border border-[var(--border)] bg-black/5">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Source & Home Feature Toggle */}
              {kind === "posts" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      placeholder="Source Name (optional)"
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs bg-white"
                    />
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="Source URL (optional)"
                      className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs bg-white"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[var(--foreground)]">
                    <input
                      type="checkbox"
                      checked={isFeaturedPost}
                      onChange={(e) => setIsFeaturedPost(e.target.checked)}
                      className="rounded border-[var(--border)]"
                    />
                    <span>Highlight / Pin on Homepage</span>
                  </label>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold py-3 text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
                >
                  {saving ? "Saving to Database..." : editingId ? "Save Changes" : `Publish ${kindLabels[kind].label}`}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-xs font-bold text-[var(--muted)] hover:bg-[var(--surface-soft)]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Content Pool & Filters (7 cols) */}
          <div className="lg:col-span-7 kq-card p-6 rounded-2xl border border-[var(--border)] bg-white shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-[var(--primary)]">
                  {kindLabels[kind].label} Pool
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  Found {filteredItems.length} matching {kindLabels[kind].label.toLowerCase()}
                </p>
              </div>

              {/* Refresh items */}
              <button
                type="button"
                onClick={() => loadItems(kind)}
                disabled={loadingItems}
                className="rounded-lg border border-[var(--border)] px-2.5 py-1 text-xs font-semibold bg-white hover:bg-[var(--surface-soft)] text-[var(--muted)]"
              >
                {loadingItems ? "Refreshing..." : "↻ Refresh"}
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-3.5 bg-[var(--surface-soft)] rounded-xl border border-[var(--border)]/60 grid sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Search by title or slug..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                />
              </div>

              {kind === "posts" && (
                <div>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => {
                      setSelectedCategoryFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs bg-white font-medium"
                  >
                    <option value="All">All Categories</option>
                    {POST_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <select
                  value={selectedLocaleFilter}
                  onChange={(e) => {
                    setSelectedLocaleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs bg-white font-medium"
                >
                  <option value="All">All Languages</option>
                  <option value="kn">Kannada (kn)</option>
                  <option value="en">English (en)</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => {
                    setSelectedStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs bg-white font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Content List */}
            {loadingItems ? (
              <div className="py-12 text-center text-xs text-[var(--muted)] flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[var(--secondary)] border-t-transparent rounded-full animate-spin"></div>
                Loading content pool...
              </div>
            ) : paginatedItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--muted)]">
                No matching items found. Try adjusting your search query or filters.
              </div>
            ) : (
              <div className="space-y-2.5">
                {paginatedItems.map((item) => {
                  const liveRoute = kind === "jobs" ? "jobs" : kind === "quizzes" ? "quizzes" : "posts";
                  const liveUrl = item.slug ? `/${item.locale || "kn"}/${liveRoute}/${item.slug}` : `/${item.locale || "kn"}`;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        editingId === item.id
                          ? "bg-amber-50/60 border-amber-300 ring-1 ring-amber-300"
                          : "bg-white border-[var(--border)] hover:border-[var(--secondary)]/50 hover:bg-[var(--surface-soft)]/40"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-xs text-[var(--primary)] hover:text-[var(--secondary)] hover:underline truncate"
                          >
                            {item.title}
                          </a>
                          <span className="text-[10px] text-[var(--secondary)]">↗</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-[10px] text-[var(--muted)]">
                          <span className="uppercase font-mono font-bold bg-[var(--surface-soft)] px-1.5 py-0.2 rounded border border-[var(--border)]">
                            {item.locale || "kn"}
                          </span>
                          {item.category && (
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                              {item.category}
                            </span>
                          )}
                          {item.isManual && (
                            <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                              Manual
                            </span>
                          )}
                          {item.updatedAt && <span>Updated: {item.updatedAt}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-xs font-bold text-[var(--primary)] hover:bg-[var(--secondary)] hover:text-white hover:border-[var(--secondary)] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)]">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded border border-[var(--border)] bg-white font-bold disabled:opacity-40 hover:bg-[var(--surface-soft)]"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded border border-[var(--border)] bg-white font-bold disabled:opacity-40 hover:bg-[var(--surface-soft)]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function readFirebaseError(error: unknown) {
  if (typeof error === "object" && error && "code" in error && "message" in error) {
    const code = String((error as { code: string }).code);
    if (code.includes("auth/invalid-credential")) return "Invalid email or password.";
    if (code.includes("auth/user-not-found")) return "No account found with this email.";
    if (code.includes("auth/wrong-password")) return "Incorrect password.";
    if (code.includes("permission-denied")) return "Permission denied. Check Firestore security rules.";
    return (error as { message: string }).message;
  }
  return String(error ?? "An unexpected error occurred.");
}

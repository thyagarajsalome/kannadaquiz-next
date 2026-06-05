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
  const [organization, setOrganization] = useState("");
  const [deadline, setDeadline] = useState("");
  
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
  const [saving, setSaving] = useState(false);

  // Telemetry & Stats states
  const [activeTab, setActiveTab] = useState<"content" | "telemetry">("content");
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [stats, setStats] = useState({ posts: 0, jobs: 0, currentAffairs: 0, quizzes: 0 });

  const canUseFirebase = hasFirebaseConfig && firebaseAuth && firestore;

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
      const docsQuery = query(collection(firestore, firestoreCollections[nextKind]), limit(25));
      const snapshot = await getDocs(docsQuery);
      const nextItems = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: String(data.title ?? data.headline ?? "Untitled"),
            slug: typeof data.slug === "string" ? data.slug : undefined,
            locale: typeof data.locale === "string" ? data.locale : undefined,
            status: typeof data.status === "string" ? data.status : undefined,
            updatedAt:
              typeof data.updatedAt === "string"
                ? data.updatedAt
                : typeof data.updatedAt?.toDate === "function"
                  ? data.updatedAt.toDate().toISOString()
                  : "",
          };
        })
        .filter((item) => item.status === "published" || item.status === "draft")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 15);

      setItems(nextItems);
    } catch (error) {
      setMessage(readFirebaseError(error));
    }
  }

  async function loadSyncLogs() {
    if (!firestore) return;
    setLoadingLogs(true);
    try {
      const q = query(collection(firestore, firestoreCollections.syncLogs), limit(25));
      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let formattedDate = "";
        try {
          const t = data.timestamp;
          if (t && typeof t.toDate === "function") {
            formattedDate = t.toDate().toLocaleString();
          } else if (t && t.seconds) {
            formattedDate = new Date(t.seconds * 1000).toLocaleString();
          }
        } catch {
          formattedDate = "Unknown";
        }
        return {
          id: docSnap.id,
          timestamp: formattedDate,
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
      setStats({
        posts: postsSnap.size,
        jobs: jobsSnap.size,
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

  async function uploadImage(file: File, fileSlug: string): Promise<string> {
    if (!firebaseStorage) return "";
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const uniqueId = Date.now();
    const storagePath = `public/${kind}/${fileSlug}-${uniqueId}-${cleanFileName}`;
    const fileRef = ref(firebaseStorage, storagePath);
    await uploadBytes(fileRef, file);
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
      setOrganization(String(data.organization ?? ""));
      setDeadline(String(data.deadline ?? ""));
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
    setOrganization("");
    setDeadline("");

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
            category: "General",
            featuredImageUrl: finalImageUrl || "",
          }, { merge: true });
        }

        if (kind === "jobs") {
          await setDoc(docRef, {
            ...base,
            organization: organization.trim(),
            deadline: deadline.trim(),
            body: body.trim(),
          }, { merge: true });
        }

        if (kind === "currentAffairs") {
          await setDoc(docRef, {
            locale,
            headline: title.trim(),
            status: "published",
            updatedAt: serverTimestamp(),
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
            category: "General",
          });
        }

        if (kind === "jobs") {
          await addDoc(collection(firestore, firestoreCollections.jobs), {
            ...createBase,
            organization: organization.trim(),
            deadline: deadline.trim(),
            body: body.trim(),
          });
        }

        if (kind === "currentAffairs") {
          await addDoc(collection(firestore, firestoreCollections.currentAffairs), {
            locale,
            headline: title.trim(),
            status: "published",
            publishedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
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
          <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">Latest Content</h2>
          <div className="mt-4 grid gap-3">
            {items.length ? (
              items.map((item) => (
                <article key={item.id} className="rounded-md border border-[var(--border)] p-3 flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-[var(--primary)]">
                      {item.title}
                      {item.status === "draft" && (
                        <span className="ml-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-800 border border-amber-200">
                          Draft
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {item.locale ?? "n/a"} {item.slug ? `• ${item.slug}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditInit(item.id)}
                      className="text-xs text-[var(--primary)] font-bold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-[var(--secondary)] font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-[var(--muted)]">No published records found.</p>
            )}
          </div>
        </aside>
      </div>
      ) : (
        <div className="mt-8 grid gap-6">
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
    return `${code}: ${message}`;
  }

  return "Unexpected error while saving to Firestore.";
}

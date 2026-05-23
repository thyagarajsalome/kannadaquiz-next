# KannadaQuiz Firebase Plan

## Hosting Choice

Use Firebase App Hosting for the Next.js frontend. Public SEO pages should stay static or cacheable whenever possible. Keep heavy dynamic behavior inside small client components, such as the quiz player and admin editor.

## Firebase Services

- Firebase App Hosting: Next.js frontend deployment
- Firebase Auth: admin login now, user login later
- Firestore: posts, quizzes, jobs, current affairs, quiz attempts
- Firebase Storage: featured images, PDFs, notification files

## Content Upload Workflow

Phase 1 keeps public sample content in `src/data/content.ts` while the UI is built.

Phase 2 adds `/admin`:

1. Developer/admin signs in with Firebase Auth.
2. Admin creates draft content in Firestore.
3. Public pages read published content.
4. Important SEO pages use static rendering or revalidation where possible.

## Admin Setup

1. In Firebase Authentication, create your admin user with email/password.
2. Copy that user's UID from Authentication.
3. In Firestore, create this document:

```text
admins/{YOUR_AUTH_UID}
```

Example fields:

```json
{
  "email": "your-email@example.com",
  "role": "owner"
}
```

The included `firestore.rules` file allows writes to content collections only when the signed-in user has this admin document.

## Environment Variables

Add these in Firebase App Hosting backend environment variables and in local `.env.local`:

```text
NEXT_PUBLIC_SITE_URL=https://kannadaquiz.in
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Get these values from Firebase Console -> Project settings -> General -> Your apps -> Web app.

## Suggested Firestore Collections

```text
posts
quizzes
quizQuestions
jobs
currentAffairs
subjects
profiles
quizAttempts
leaderboard
```

## Document Shape

`posts/{id}`

```json
{
  "slug": "kpsc-preparation-strategy",
  "locale": "kn",
  "title": "KPSC ಪರೀಕ್ಷೆಗೆ ದೈನಂದಿನ ಅಧ್ಯಯನ ಯೋಜನೆ",
  "excerpt": "Short SEO description",
  "body": "Article body or MDX-like markdown",
  "category": "KPSC",
  "status": "published",
  "publishedAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

`quizzes/{id}`

```json
{
  "slug": "karnataka-current-affairs-basics",
  "locale": "kn",
  "title": "Quiz title",
  "description": "SEO description",
  "exam": "KPSC",
  "subject": "Current Affairs",
  "difficulty": "Easy",
  "timeLimitSeconds": 300,
  "status": "published",
  "publishedAt": "server timestamp"
}
```

`quizQuestions/{id}`

```json
{
  "quizId": "quizzes document id",
  "question": "Question text",
  "options": ["A", "B", "C", "D"],
  "correctOptionIndex": 1,
  "explanation": "Answer explanation",
  "sortOrder": 1
}
```

`jobs/{id}`

```json
{
  "slug": "teacher-eligibility-alert",
  "locale": "kn",
  "title": "Job alert title",
  "organization": "Department name",
  "deadline": "2026-06-30",
  "status": "published",
  "body": "Job details",
  "applyUrl": "https://example.com",
  "publishedAt": "server timestamp"
}
```

## Security Rules Direction

- Anyone can read `published` content.
- Only admin users can create, update, or delete content.
- Users can read/write only their own profile and quiz attempts.
- Storage uploads should be restricted to admins for public assets.

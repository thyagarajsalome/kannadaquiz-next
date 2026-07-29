import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/kn");

  return (
    <html lang="kn">
      <head>
        <meta httpEquiv="refresh" content="0;url=/kn" />
        <link rel="canonical" href="https://kannadaquiz.in/kn" />
        <title>KannadaQuiz</title>
      </head>
      <body>
        <p>Redirecting to <a href="/kn">kannadaquiz.in/kn</a>...</p>
      </body>
    </html>
  );
}

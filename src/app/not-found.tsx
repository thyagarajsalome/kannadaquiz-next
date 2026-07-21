import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="kn">
      <body className="min-h-full flex flex-col items-center justify-center bg-slate-50 py-20 text-center font-sans">
        <div className="bg-red-50 text-red-600 p-4 rounded-full mb-6">
          <svg className="w-12 h-12 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        
        {/* Kannada version */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ</h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            ಕ್ಷಮಿಸಿ, ನೀವು ಹುಡುಕುತ್ತಿರುವ ಪುಟವು ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಅಳಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.
          </p>
        </div>

        <div className="w-16 h-[1px] bg-slate-200 my-4"></div>

        {/* English version */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-700">Page Not Found</h2>
          <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Sorry, the page you are looking for does not exist or has been removed. Please go back to the home page.
          </p>
        </div>

        <Link
          href="/kn"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow hover:bg-indigo-700 transition-all text-sm cursor-pointer select-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
          </svg>
          <span>ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ / Back to Home</span>
        </Link>
      </body>
    </html>
  );
}

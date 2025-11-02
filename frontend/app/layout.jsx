import "./globals.css";

export const metadata = {
  title: "HELIOS — AI Visibility Architect",
  description: "Optimize how AI models perceive and cite your brand online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}


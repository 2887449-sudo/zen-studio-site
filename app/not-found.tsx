import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="subpage-hero container">
        <p className="eyebrow">404</p>
        <h1 className="display">Page Not Found</h1>
        <p>The page has moved, or the project is not published yet.</p>
        <Link href="/" className="btn dark" style={{ marginTop: 30 }}>Return Home</Link>
      </section>
    </main>
  );
}

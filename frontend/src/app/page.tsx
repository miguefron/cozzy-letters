import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <main className="flex flex-col items-center gap-8 px-8 text-center">
        <div className="rounded-2xl bg-warm-white p-12 shadow-md">
          <h1 className="text-5xl font-bold tracking-tight text-terracotta">
            CozyLetters
          </h1>
          <p className="mt-4 max-w-md text-lg text-foreground/70">
            Send warm letters to random souls around the world. Write from the
            heart, and let a cozy surprise land in someone&apos;s mailbox.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/write-letter" className="rounded-2xl bg-terracotta px-6 py-3 font-medium text-warm-white transition-colors hover:bg-terracotta/90">
              Write a Letter
            </Link>
            <button className="rounded-2xl border-2 border-moss px-6 py-3 font-medium text-moss transition-colors hover:bg-moss/10">
              Learn More
            </button>
          </div>
        </div>
        <p className="text-sm text-wood">
          Made with warmth and care
        </p>
      </main>
    </div>
  );
}

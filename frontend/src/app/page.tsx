import HomeActions from "@/components/cozy/HomeActions";
import CozyCard from "@/components/cozy/CozyCard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <main className="flex flex-col items-center gap-8 px-8 text-center">
        <CozyCard variant="hero">
          <h1 className="text-5xl font-bold tracking-tight text-terracotta">
            CozyLetters
          </h1>
          <p className="mt-4 max-w-md text-lg text-foreground/70">
            Send warm letters to random souls around the world. Write from the
            heart, and let a cozy surprise land in someone&apos;s mailbox.
          </p>
          <HomeActions />
        </CozyCard>
        <p className="text-sm text-wood">
          Made with warmth and care
        </p>
      </main>
    </div>
  );
}

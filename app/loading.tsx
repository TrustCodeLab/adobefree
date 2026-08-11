import CardSkeleton from "./components/CardSkeleton";
import Header from "./components/Header";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <CardSkeleton />
        </div>
      </main>
    </div>
  );
}


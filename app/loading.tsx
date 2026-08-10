import CardSkeleton from "./components/CardSkeleton";

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <CardSkeleton />
      </div>
    </div>
  );
}

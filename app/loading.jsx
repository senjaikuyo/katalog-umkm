export default function Loading() {
  return (
    <div className="flex flex-col gap-6 py-10 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-garis" />
      <div className="h-5 w-72 rounded-lg bg-garis" />

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-permukaan">
            <div className="aspect-square w-full bg-garis" />
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-16 rounded bg-garis" />
              <div className="h-5 w-32 rounded bg-garis" />
              <div className="mt-2 h-6 w-20 rounded bg-garis" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


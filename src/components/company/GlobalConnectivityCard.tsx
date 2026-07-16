export function GlobalConnectivityCard() {
  return (
    <section className="group relative h-44 overflow-hidden rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Plain <img>, not next/image — no remotePatterns config required. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=70"
        alt=""
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-sm font-bold text-white">Global Connectivity</p>
        <p className="mt-1 max-w-[85%] text-xs leading-relaxed text-white/80">
          Expanding your talent network across 40+ countries and counting.
        </p>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="w-full mt-24 pb-10 pt-6 flex items-center justify-between font-mono text-[10px] text-muted-foreground/40 tracking-wide">
      <span>© 2026 Tayyab Khan</span>
      <span className="flex items-center gap-1.5">
        <span className="relative flex size-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
          <span className="relative inline-flex rounded-full size-1.5 bg-brand" />
        </span>
        built with Next.js
      </span>
    </footer>
  );
}

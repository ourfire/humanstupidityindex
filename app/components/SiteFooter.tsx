export function SiteFooter() {
  return (
    <footer className="border-rule font-utility text-mute mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-6 pb-16 text-xs tracking-[0.08em] uppercase">
      <a href="/data/hsi.json" className="underline underline-offset-2">
        /data/hsi.json
      </a>
      <span>CC BY 4.0</span>
      <span>HSI v1.0 · methodology v1.0</span>
    </footer>
  );
}

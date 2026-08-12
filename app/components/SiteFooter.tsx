export function SiteFooter() {
  return (
    <footer className="border-rule mt-16 border-t pt-6 pb-16">
      <div className="font-utility text-mute flex flex-wrap items-center justify-between gap-4 text-xs tracking-[0.08em] uppercase">
        <a href="/data/hsi.json" className="underline underline-offset-2">
          /data/hsi.json
        </a>
        <span>CC BY 4.0</span>
        <span>HSI v1.0 · methodology v1.0</span>
      </div>
      <p className="font-body text-mute mt-6 max-w-[62ch] text-sm leading-[1.6]">
        This first reading was assembled on a compressed timeline by{" "}
        <a
          href="https://futurable.now"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          futurable.now
        </a>
        . A v2 is planned that will let readers propose additional data
        sources for the index.
      </p>
    </footer>
  );
}

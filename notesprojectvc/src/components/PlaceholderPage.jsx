import Link from "next/link";
import Card from "@/components/ui/Card";

export default function PlaceholderPage({ title, description, items = [], children }) {
  return (
    <div className="py-6 md:py-10">
      <header className="max-w-2xl">
        <h1 className="font-head text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)] sm:text-base">
          {description}
        </p>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <Card className="min-h-[220px]">
          <p className="font-head text-lg font-semibold text-[var(--ink)]">
            Halaman ini sedang disiapkan
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
            Kerangka layout, navigasi, dan gaya visual sudah aktif. Isi halaman akan
            menyusul pada tahap berikutnya.
          </p>
          {items.length ? (
            <ul className="mt-5 space-y-2.5 text-sm text-[var(--ink-soft)]">
              {items.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {children}
        </Card>

        <Card className="flex flex-col justify-between bg-white/30">
          <div>
            <p className="font-head text-lg font-semibold text-[var(--ink)]">
              Sementara itu
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
              Kamu bisa kembali ke beranda untuk melihat tampilan dasar aplikasi.
            </p>
          </div>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-11 w-fit items-center justify-center rounded-xl bg-[var(--green)] px-4 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[#19a849] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-2"
          >
            Kembali ke beranda
          </Link>
        </Card>
      </div>
    </div>
  );
}

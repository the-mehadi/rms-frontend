export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_600px_at_15%_0%,rgba(255,107,53,0.22)_0%,transparent_55%),radial-gradient(700px_500px_at_90%_15%,rgba(99,102,241,0.18)_0%,transparent_55%)]" />
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6 py-16">
        <div className="glass-strong lux-card p-10">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/40 px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground">
            <span className="size-2 rounded-full bg-rms-gradient" />
            Premium Restaurant Management System
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Run your restaurant like a{" "}
            <span className="text-rms-gradient">5‑star experience</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Luxurious, responsive, and lightning-smooth UI built with Next.js App
            Router + shadcn/ui, designed for cashiers, kitchen, and admins.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-rms-gradient px-6 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
            >
              Sign In
            </a>
            <a
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-2xl border bg-background px-6 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Enter dashboard
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Glass surfaces", d: "Frosted depth with soft gradients." },
            { t: "Motion-first UI", d: "Micro-interactions and page transitions." },
            { t: "Dark mode", d: "True-black ambience with elevated cards." },
          ].map((f) => (
            <div key={f.t} className="glass lux-card lux-card-hover p-6">
              <div className="text-sm font-semibold">{f.t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface AuthCardProps {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

/** Shared frame of the Account creation and Sign in screens. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center pt-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 sm:pt-14">
      <h1 className="text-center text-3xl font-bold tracking-tight text-balance text-navy sm:text-4xl">{title}</h1>
      <p className="mt-3 text-center text-base text-muted-foreground sm:text-lg">{subtitle}</p>
      <div className="mt-8 w-full">{children}</div>
      <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
    </section>
  );
}

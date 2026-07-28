type PageHeroProps = {
  title: string;
  subhead?: string;
};

export function PageHero({ title, subhead }: PageHeroProps) {
  return (
    <header className="space-y-4 border-b border-blacksage-border pb-10">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-blacksage-text-primary md:text-5xl">
        {title}
      </h1>
      {subhead ? <p className="prose-body text-lg">{subhead}</p> : null}
    </header>
  );
}

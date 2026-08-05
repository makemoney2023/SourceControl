import Image from "next/image";

type PageHeroProps = {
  title: string;
  subhead?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function PageHero({
  title,
  subhead,
  imageSrc,
  imageAlt = "",
}: PageHeroProps) {
  return (
    <header className="space-y-4 border-b border-blacksage-border pb-10">
      {imageSrc ? (
        <div className="relative mb-6 aspect-[21/9] w-full overflow-hidden bg-blacksage-elevated">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}
      <h1 className="font-display text-4xl font-semibold tracking-tight text-blacksage-text-primary md:text-5xl">
        {title}
      </h1>
      {subhead ? <p className="prose-body text-lg">{subhead}</p> : null}
    </header>
  );
}

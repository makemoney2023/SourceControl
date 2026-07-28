import type { InquirePackage } from "@/lib/site-config";
import { PACKAGE_COPY } from "@/lib/site-config";

type PackageModeHeaderProps = {
  packageMode: InquirePackage;
};

export function PackageModeHeader({ packageMode }: PackageModeHeaderProps) {
  const copy = PACKAGE_COPY[packageMode];

  return (
    <div className="space-y-2 border-b border-blacksage-border pb-8">
      <p className="section-overline">Inquiry mode</p>
      <h2 className="font-display text-2xl font-semibold text-blacksage-text-primary">
        {copy.headline}
      </h2>
      <p className="prose-body">{copy.subhead}</p>
    </div>
  );
}

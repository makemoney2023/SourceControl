import { HomeScrollStage } from "@/components/home/HomeScrollStage";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata("home", "/");

export default function HomePage() {
  return <HomeScrollStage />;
}

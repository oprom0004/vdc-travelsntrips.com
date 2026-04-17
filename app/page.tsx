import HomePage from "@/components/home-page";
import { getHomeContent } from "@/lib/content";

export default function Page() {
  const homeContent = getHomeContent();
  return <HomePage homeContent={homeContent} />;
}
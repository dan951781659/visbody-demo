import { useLocalSearchParams } from "expo-router";
import { ContentDetailScreen } from "@/components/content/ContentDetailScreen";
import type { LibraryTab } from "@/types/content";

export default function ContentDetailRoute() {
  const { type, id } = useLocalSearchParams<{ type: LibraryTab; id: string }>();

  if (!type || !id) return null;

  return <ContentDetailScreen type={type} id={id} />;
}

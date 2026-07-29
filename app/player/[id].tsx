import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { VideoPlayerScreen } from "@/components/content/VideoPlayerScreen";
import { getItemById } from "@/data/exploreLibrary";
import type { LibraryTab } from "@/types/content";

export default function PlayerRoute() {
  const router = useRouter();
  const { id, type, title } = useLocalSearchParams<{
    id: string;
    type?: LibraryTab;
    title?: string;
  }>();

  const item = useMemo(() => {
    if (!id || !type) return undefined;
    return getItemById(type, id);
  }, [id, type]);

  return (
    <VideoPlayerScreen
      title={title ?? item?.name ?? "训练"}
      mediaUri={item?.mediaUri}
      immersive
      onClose={() => router.back()}
    />
  );
}

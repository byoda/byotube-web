import { useVideo } from "@/composables";
import { computed, ref } from "vue";
import { useWatch } from "../watch/useWatch";

export const useShorts = () => {
  const { getSegmentedVideos } = useVideo();
  const { getVideo } = useWatch();

  const reloadkey = ref(0)
  const shorts = ref({
    title: "",
    key: "",
    loading: true,
    videos: [],
    after: null,
    has_next_page: null,
    videoOptions: null,
  });

  const getVideos = async (section, first) => {
    try {
      section.loading = true;
      const videosData = await getSegmentedVideos(
        section?.key,
        section?.after,
        first
      );

      section.videos?.push(...videosData.edges);
      section.has_next_page = videosData?.page_info?.has_next_page;
      if (section.has_next_page) {
        section.after = videosData?.page_info.end_cursor;
      }
      section.videos.forEach(async (video) => {
        const videoData = await getVideo(video.node.asset_id, video.origin, video.cursor, false);
        video.videoOptions = videoData
      });
      console.log("Sections", section);
      section.loading = false;
      shorts.value = section;
      setTimeout(() => {
        reloadkey.value += 1
      }, 2000)
    } catch (error) {
      console.error("Error watch", error);
    }
  };

  return {
    shorts,
    reloadkey,
    getVideos,
  };
};

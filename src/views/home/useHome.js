import { useVideo } from "@/composables";
import { useAuthStore } from "@/store";
import moment from "moment";
import { computed, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify/lib/framework.mjs";

export const useHome = (props) => {
  const router = useRouter();
  const { width: windowWidth } = useDisplay();

  const { isAuthenticated } = toRefs(useAuthStore());

  const { getSegmentedVideos, getMemberAllVideos } = useVideo();

  const options = [
    { name: "YouTube Hosted", value: "external" },
    { name: "BYODA Hosted", value: "published" },
  ];

  const ingestStatus = ref([]);

  const RECENT_UPLOADS = "recent_uploads";

  const sections = ref(
    props.sectionNames
      ? props.sectionNames
      : [
          {
            title: "Recent Uploads",
            key: "recent_uploads",
            loading: true,
            videos: [],
            after: null,
            has_next_page: null,
          },
          {
            title: "Recommended",
            key: "Recommended",
            loading: true,
            videos: [],
            after: null,
            has_next_page: null,
          },
          {
            title: "Entertainment",
            key: "entertainment",
            loading: true,
            videos: [],
            after: null,
            has_next_page: null,
          },
          {
            title: "Education",
            key: "education",
            loading: true,
            videos: [],
            after: null,
            has_next_page: null,
          },
          {
            title: "Comedy",
            key: "comedy",
            loading: true,
            videos: [],
            after: null,
            has_next_page: null,
          },
        ]
  );

  const videosAccordingToSize = computed(() => {
    return windowWidth.value >= 1800 && windowWidth.value < 2100
      ? 10
      : windowWidth.value > 2100
      ? 12
      : 9;
  });

  const loadAllVideos = ref(false);

  const dateFormatter = (date) => {
    return moment(date).fromNow();
  };

  const getAllSegmentedVideos = () => {
    loadAllVideos.value = true;
    sections?.value.forEach(async (section, index) => {
      await mapSegmentedVideos(section, index);
      loadAllVideos.value = false;
    });
  };

  const mapSegmentedVideos = async (section, index, first, event) => {
    try {
      section.loading = true;
      const videosData =
        isAuthenticated.value && section.key === RECENT_UPLOADS
          ? await getMemberAllVideos(
              section?.after,
              first ? first : videosAccordingToSize.value,
              ingestStatus.value,
              options
            )
          : await getSegmentedVideos(
              section?.key,
              section?.after,
              first ? first : videosAccordingToSize.value,
              ingestStatus.value,
              options
            );

      const sortedThumbnails = videosData?.edges?.map((video) => {
        video.node.video_thumbnails = video.node.video_thumbnails.sort(
          (a, b) => {
            return a.width - b.width;
          }
        );
        return video;
      });

      if (videosData?.length) event?.done("ok");
      section.videos?.push(...videosData?.edges);
      section.has_next_page = videosData?.page_info?.has_next_page;
      if (section.has_next_page) {
        section.after = videosData?.page_info.end_cursor;
        event?.done("ok");
      } else {
        event?.done("empty");
      }
      section.loading = false;
      sections.value[index] = section;
    } catch (error) {
      console.error("Error", error);
      event?.done("error");
    }
  };

  const emptySectionVideos = () => {
    sections.value.forEach((section) => {
      section.videos = [];
      section.after = null;
      section.has_next_page = null;
    });
  };

  const moveToWatch = (video) => {
    let query = "";
    if (video?.node?.asset_id || video?.origin) {
      query = {
        asset_id: video?.node?.asset_id,
        member_id: video?.origin,
      };
    } else {
      query = {
        cursor: video?.cursor,
      };
    }
    router.push({ name: "Watch", query });
  };

  return {
    options,
    sections,
    loadAllVideos,
    ingestStatus,
    dateFormatter,
    getAllSegmentedVideos,
    emptySectionVideos,
    mapSegmentedVideos,
    moveToWatch,
  };
};

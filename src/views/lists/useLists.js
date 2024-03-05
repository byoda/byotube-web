import { useHelper, useVideo } from "@/composables";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useLists = () => {
  const { getSegmentedVideos } = useVideo();
  const route = useRoute();
  const router = useRouter();

  const { toCapitalCase } = useHelper();

  const listName = ref(route.query.list_name);

  const sections = ref({
    title: toCapitalCase(decodeURI(listName.value)?.replace("_", " ")),
    key: encodeURIComponent(listName.value),
    loading: true,
    videos: [],
    after: null,
    has_next_page: null,
  });

  const getListVideos = async (load) => {
    try {
      if (!listName.value) router.push({ name: "Home" });

      const data = await getSegmentedVideos(
        sections.value.key,
        sections.value.after,
        9
      );

      if (!data?.edges.length) return;

      sections.value.videos.push(...data?.edges);
      sections.value.after = data?.page_info?.end_cursor;

      if (!data?.page_info?.has_next_page) {
        load?.done("empty");
      }

      load?.done("ok");
    } catch (error) {
      load?.done("error");
    }
  };

  const changeSection = (name) => {
    listName.value = name;
    sections.value = {
      title: toCapitalCase(
        decodeURIComponent(listName.value)?.replace("_", " ")
      ),
      key: listName.value,
      loading: true,
      videos: [],
      after: null,
      has_next_page: null,
    };
  };

  return {
    listName,
    sections,
    changeSection,
    getListVideos,
  };
};

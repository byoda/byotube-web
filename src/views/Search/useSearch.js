import { useVideoService } from "@/services";
import { nextTick, ref } from "vue";
import { useRoute } from "vue-router";

export const useSearch = () => {
  const route = useRoute();
  const { searchAssets } = useVideoService();

  const videos = ref([]);
  const offset = ref(0);
  const num = ref(30);
  const text = ref(route.query?.search_query);
  const loaded = ref(true);
  const queryChangeLoaded = ref(null);
  const noMoreResults = ref(false);

  const getSearchResults = async (load) => {
    try {
      const filter = {
        text: text.value,
        offset: offset.value,
        num: num.value,
      };
      loaded.value = true;
      const { data, status } = await searchAssets(filter);
      if(!data?.length){
        loaded.value = false
        load?.done('empty')
        return
      }
      if (data?.length && status) {
        load?.done("ok");
        offset.value = offset.value + 30;
        const currentScrollPosition = window.scrollY;
        window.scrollBy(currentScrollPosition, -100);
        await nextTick(() => {
          videos.value.push(...data);
        });
      }
    } catch (error) {
      console.error("Error", error);
      load?.done("error");
    } finally {
      loaded.value = false;
      queryChangeLoaded.value = false;
    }
  };

  return {
    videos,
    offset,
    num,
    text,
    loaded,
    queryChangeLoaded,
    noMoreResults,
    getSearchResults,
  };
};

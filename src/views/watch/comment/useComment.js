import { ref } from "vue";
import { useAssetReactionService } from "@/services";
import { uuid } from "vue-uuid";
import { constants } from "@/globals/constants";
import { useLoader } from "@/composables";
import { useRoute } from "vue-router";

export const useComment = () => {

  const route = useRoute()

  const { appendMessage, getMessages, appendBtLiteMessage, getBtLiteMessages } = useAssetReactionService();
  const { loader: commentLoader, showLoader: showCommentLoader, hideLoader: hideCommentLoader } = useLoader()
  const { loader: replyLoader, showLoader: showReplyLoader, hideLoader: hideReplyLoader } = useLoader()

  const comment = ref("");
  const asesetMemberId = route?.query.member_id
  const showActions = ref(false);
  const memberId = localStorage.getItem("member_id");
  const domain = localStorage.getItem("domain");
  const service_id = constants.BYOTUBE_SERVICE_ID;
  const comments = ref([])
  const user = JSON.parse(localStorage.getItem('user'))


  const getComments = async ( asset ) => {
    try {
      const { origin, asset_id } = asset
      const body = {
        depth: 1,
        query_id: uuid.v4(),
        remote_member_id: asesetMemberId,
        data_filter:{
          message_asset_class: 'public_assets',
          message_asset_id: asset_id
        }
      };

      const { data } = await getMessages(domain, service_id, body);
      comments.value = data?.edges?.reduce((prev,curr, index) => {
        if(index == 0) return [curr]
        if(prev.find(edge => edge?.node?.message_id == curr?.node?.message_id)){
          const edge =   prev.find(edge => edge?.node?.message_id == curr?.node?.message_id)
          if(!edge.node.replyThread){
            edge.node.replyThread = []
          }
          edge.node.replyThread.push(curr?.node)
          return [...prev]
        }
        return [...prev, curr]
      },[])
    } catch (error) {
        console.error("Errrrr", error)
    }
  };

  const getBtLiteComments = async ( asset ) => {
    try {
      const { origin, asset_id } = asset
      const body = {
        query_id: uuid.v4(),
        remote_member_id: asesetMemberId,
        data_class:'messages',
        first:100,
        after:null,
        filter:{
          message_asset_class:{
            eq:'public_assets'
          },
          message_asset_id: {
            eq: asset_id
          }
        }
      };

      const { data } = await getBtLiteMessages(body);
      comments.value = data?.edges?.reduce((prev,curr, index) => {
        if(index == 0) return [curr]
        if(prev.find(edge => edge?.node?.message_id == curr?.node?.message_id)){
          const edge =   prev.find(edge => edge?.node?.message_id == curr?.node?.message_id)
          if(!edge.node.replyThread){
            edge.node.replyThread = []
          }
          edge.node.replyThread.push(curr?.node)
          return [...prev]
        }
        return [...prev, curr]
      },[])
    } catch (error) {
        console.error("Errrrr", error)
    }
  };

  const addComment = async (desc, asset, origin) => {
    try {
      asset?.message_id ? showReplyLoader() : showCommentLoader()
      console.log("USer", user);
      const body = {
        data: {
          created_timestamp: new Date(),
          message_id: asset?.message_id || uuid.v4(),
          sender_id: memberId,
          creator: user.nick,
          creator_thumbnail: user?.avatar_url,
          thread_id: asset?.thread_id || uuid.v4(),
          in_response_to_id: asset?.message_id || null,
          subject: null,
          contents: desc,
          message_asset_id: asset?.asset_id,
          message_asset_class: 'public_assets',
        },
        depth: 1,
        query_id: uuid.v4(),
        remote_member_id: origin
      };
      const { data } = await appendMessage(domain, service_id, body);
      await getComments(asset)
    } catch (error) {
        console.error("Errrrr", error)
    } finally {
      hideCommentLoader()
      hideReplyLoader()
      comment.value = null
    }
  };

  const addBtLiteComment = async (desc, asset, origin) => {
    try {
      asset?.message_id ? showReplyLoader() : showCommentLoader()
      const body = {
        data: {
          created_timestamp: new Date(),
          message_id: asset?.message_id || uuid.v4(),
          sender_id: memberId,
          creator: user?.nick,
          creator_thumbnail: asset?.creator_thumbnail,
          thread_id: asset?.thread_id || uuid.v4(),
          in_response_to_id: asset?.message_id || null,
          subject: null,
          contents: desc,
          message_asset_id: asset?.asset_id,
          message_asset_class: 'public_assets',
        },
        data_class:'messages',
        query_id: uuid.v4(),
        remote_member_id: origin
      };
      const { data } = await appendBtLiteMessage(body);
      await getBtLiteComments(asset)
    } catch (error) {
        console.error("Errrrr", error)
    } finally {
      hideCommentLoader()
      hideReplyLoader()
      comment.value = null
    }
  };

  return {
    user,
    comment,
    comments,
    commentLoader,
    replyLoader,
    showActions,
    addComment,
    getComments,
    addBtLiteComment,
    getBtLiteComments
  };
};

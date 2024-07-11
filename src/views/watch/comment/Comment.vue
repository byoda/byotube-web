<template>
    <div>
        <h3>
            {{ comments?.length }} Comments 
        </h3>
        <AddCommentInput v-model="comment" :comment-loader="commentLoader"
            @add-comment="isAuthenticated ? (isBtLiteAccount ? addBtLiteComment(comment, asset, asset.origin) : addComment(comment, asset, asset.origin)) : coreStore.OpenDialog(nonAuthSubscriptionDialog)" />
        <div v-if="loader" class="text-center">
            <BaseSpinner color="black" />
        </div>
        <template v-else>
            <div v-for="(edge, index) in comments" :key="index" class="d-flex align-items-center mt-4 pb-5">
                <div>
                    <img class="rounded-circle" :src="edge?.node?.creator_thumbnail" height="40" width="40" alt=""
                        srcset="">
                </div>
                <div class="w-100 pl-4 mt-n2">
                    <div>
                        <div class="d-flex align-center">
                            <h5>
                                @{{ edge?.node?.creator }}
                            </h5>
                            <p class="text-caption ml-2">
                                {{ convertDateToDuration(edge?.node?.created_timestamp) }}
                            </p>
                        </div>
                        <p class="text-body-2 mt-1">{{ edge?.node?.contents }}</p>
                        <BaseBtn @click="edge.node.reply = true" color="black" variant="text" density="compact"
                            class="rounded-pill text-caption px-0 font-weight-medium mr-2">
                            Reply
                        </BaseBtn>
                        <div v-if="edge?.node?.reply" class="ml-3">
                            <AddCommentInput v-model="edge.node.comment"
                                @add-comment=" isBtLiteAccount ? addBtLiteComment(edge?.node?.comment, edge?.node, edge?.origin) : addComment(edge?.node?.comment, edge?.node, edge?.origin)" :comment-loader="replyLoader" button-text="Reply"  />
                        </div>
                    </div>
                    <BaseBtn v-if="edge?.node?.replyThread?.length" color="blue-darken-2" variant="text" density="comfortable" class="rounded-pill px-3 font-weight-medium text-body-2 mr-2" @click="edge.node.openReply = !edge.node.openReply">
                        {{edge?.node?.replyThread?.length}} {{ edge?.node?.replyThread?.length > 1 ? 'replies' : 'reply' }} 
                        <template #prepend>
                            <div class="mr-n1">
                                <v-icon>
                                    {{ edge.node.openReply ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                </v-icon>
                            </div>
                        </template>
                    </BaseBtn>
                    <template v-if="edge?.node?.replyThread?.length && edge.node.openReply">
                        <div v-for="(reply, replyIndex) in edge?.node?.replyThread" :key="replyIndex" class="ml-3">
                            <div class="d-flex align-items-center mt-4 pb-5">
                                <div class="pt-1">
                                    <img class="rounded-circle" :src="edge?.node?.creator_thumbnail" height="24" width="24"
                                        alt="" srcset="">
                                </div>
                                <div class="pl-3">
                                    <div class="d-flex align-center">
                                        <h5>
                                            @{{ reply.creator }}
                                        </h5>
                                        <p class="text-caption ml-2">
                                            {{ convertDateToDuration(reply?.created_timestamp) }}
                                        </p>
                                    </div>
                                    <p class="text-body-2 mt-1">{{ reply?.contents }}</p>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
                <!-- <div>
                    <v-icon>
                        mdi-dots-vertical
                    </v-icon>
                </div> -->
            </div>
        </template>
    </div>
</template>

<script setup>
import { BaseTextfield, BaseBtn, BaseSpinner } from "@/components/base";
import { useComment } from "./useComment"
import { onMounted } from "vue";
import { useHelper, useLoader } from "@/composables";
import AddCommentInput from './add-comment-input/AddCommentInput.vue'
import { ref } from "vue";
import { useAuthStore, useCoreStore } from "@/store";
import { toRefs } from "vue";

const props = defineProps({
    asset: {
        type: String,
        default: null
    }
})

const { comment, comments, commentLoader, showActions, user, replyLoader, addComment, addBtLiteComment, getComments, getBtLiteComments } = useComment()
const { convertDateToDuration } = useHelper();
const { loader, showLoader, hideLoader } = useLoader()
const { isAuthenticated, isBtLiteAccount } = toRefs(useAuthStore())
const coreStore = useCoreStore()
const nonAuthSubscriptionDialog = 'nonAuthSubscription'

const reply = ref(false)

onMounted(async () => {
    showLoader()
    isBtLiteAccount.value ? await getBtLiteComments(props.asset) : await getComments(props.asset)
    hideLoader()
})
</script>
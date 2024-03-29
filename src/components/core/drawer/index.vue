<template>
    <v-navigation-drawer v-model="coreStore.isDrawerOpen" mobile-breakpoint="sm" app :border="0" id="nav" class="pb-5">
        <div tag="div" style="width: 100%;" class="v-navigation-drawer__content" v-bar>
            <v-list density="compact" nav rounded class="py-0 mt-2" tag="div">
                <!-- <v-list-item rounded="xl" :class="{
                    'hidden-lg-and-up': $route.name === 'Watch' ? false : true
                }">
                    <v-app-bar-nav-icon @click="coreStore.setDrawer(!coreStore.isDrawerOpen)"
                        class="mr-5"></v-app-bar-nav-icon>
                    <p class="font-weight-bold">BYO.Tube</p>
                </v-list-item> -->
                <!-- <v-divider class="hidden-lg-and-up"></v-divider> -->
                <div v-for="parentItem in drawerItems" :key="parentItem.header" class="pr-4">
                    <v-list-subheader v-if="parentItem.header" class="pl-3 py-4 text-uppercase">
                        <template #default>
                            <div class="font-weight-bold text-body-2">
                                {{
                                    parentItem.header
                                }}
                            </div>
                        </template>
                    </v-list-subheader>
                    <v-list-item
                        v-for="(item, index) in parentItem.header == 'Following' ? parentItem?.pages?.filter((_, ind) => ind < channelLength) : parentItem.pages"
                        :key="index" rounded="xl" class="mb-0" :to="item.link && (item.link)
                            " exact :href="item.href" :target="item.target" :value="item.link" color="primary"
                        @click="item.method">
                        <template #prepend>
                            <v-icon v-if="parentItem.header !== 'Following'">{{ item.icon }}</v-icon>
                            <v-avatar v-else size="30" color="red">
                                <span class="white--text">
                                    {{
                                        item.title.split('')[0].toUpperCase()
                                    }}</span>
                            </v-avatar>
                        </template>
                        <v-list-item-title>
                            <template #default>
                                <p class="font-weight-medium text-body-2">
                                    {{ item.title }}
                                </p>
                            </template>
                        </v-list-item-title>
                    </v-list-item>

                    <BaseBtn variant="text" id="showBtn" @click="moreChannels" v-if="parentItem.header === 'Following' &&
                        isAuthenticated &&
                        items[2].pages.length > 3
                        " class="text-none mt-1 rounded-pill"
                        :prepend-icon="channelLength === 3 ? 'mdi-chevron-down' : 'mdi-chevron-up'">
                        {{
                            channelLength === 3
                            ? `Show ${items[2].pages.length - channelLength} more `
                            : 'Show less'
                        }}
                    </BaseBtn>
                    <BaseBtn class="pl-4" v-else-if="parentItem.header === 'Following' && !isAuthenticated" size="small"
                        variant="text" prepend-icon="mdi-shield-lock-outline"
                        @click="coreStore.OpenDialog(nonAuthSubscriptionDialog)">
                        Login needed
                    </BaseBtn>
                </div>
            </v-list>
        </div>
    </v-navigation-drawer>
    <NonAuthDialog />
</template>

<script setup>
import { BaseBtn } from '@/components/base'
import { NonAuthDialog } from '@/components/shared'
import { computed, onMounted, ref, onUnmounted, toRefs } from "vue";
import { useEmitter, useFollow, useVideo, useHelper } from "@/composables";
import { useAuthStore, useCoreStore } from '@/store';

const emits = defineEmits(['search'])
const emitter = useEmitter()

const coreStore = useCoreStore()
const { isAuthenticated } = toRefs(useAuthStore())

const { getFollowedChannels } = useFollow()
const { service_id } = useVideo()
const { uniqueArrayOfObjects } = useHelper()


const nonAuthSubscriptionDialog = 'nonAuthSubscription'
const items = [
    {
        header: null,
        pages: [
            { title: "Home", link: "/", icon: "mdi-home", method: () => { } },
            { title: "About", link: null, target: "_blank", href: 'https://about.byo.tube/', icon: "mdi-information-variant-circle-outline", method: () => { } },
            { title: "FAQ", link: null, target: "_blank", href: 'https://about.byo.tube/faq', icon: "mdi-frequently-asked-questions", method: () => { } },
            // { title: "Trending", link: "/trending", icon: "mdi-fire", method: () => { } },
            {
                title: "Following",
                link: '/following',
                icon: "mdi-youtube-subscription",
                method: () => {
                    if (!isAuthenticated.value) {
                        coreStore.OpenDialog(nonAuthSubscriptionDialog)
                    }
                }
            },
        ],
    },
    {
        header: null,
        pages: [
            {
                title: "History",
                link: '/history',
                icon: "mdi-history",
                method: () => {
                    if (!isAuthenticated.value) {
                        coreStore.OpenDialog(nonAuthSubscriptionDialog)
                    }
                }
            },
        ],
    },
    {
        header: "Following",
        pages: [
        ],
    },
    {
        header: "MORE FROM BYO.Tube",
        pages: [
            {
                title: "Gaming",
                link: "/lists?list_name=gaming",
                icon: "mdi-youtube-gaming",
            },
            {
                title: "Comedy",
                link: "/lists?list_name=comedy",
                icon: "mdi-drama-masks",
            },
            {
                title: "Sports",
                link: "/lists?list_name=sports",
                icon: "mdi-trophy-variant-outline",
            },
            {
                title: "News & Politics",
                link: "/lists?list_name=news %26 politics",
                icon: "mdi-newspaper-variant-outline",
            },
            {
                title: "Film & Animation",
                link: "/lists?list_name=film %26 animation",
                icon: "mdi-movie-play-outline",
            },
            {
                title: "Travel & Events",
                link: "/lists?list_name=travel %26 events",
                icon: "mdi-wallet-travel",
            },
            {
                title: "How to & Style",
                link: "/lists?list_name=howto %26 style",
                icon: "mdi-face-man-shimmer-outline",
            },
            {
                title: "Science & Technology",
                link: "/lists?list_name=science %26 technology",
                icon: "mdi-rocket-launch-outline",
            },
            {
                title: "Nonprofits & Activism",
                link: "/lists?list_name=nonprofits %26 activism",
                icon: "mdi-crowd",
            },
            {
                title: "All Channels",
                link: null,
                href: "https://www.byoda.tube/pages/creators/",
                icon: "mdi-account-group",
            },
        ],
    },
]

const channelLength = ref(0)

const drawerItems = computed(() => {
    return [...items]
})


const moreChannels = () => {
    if (channelLength.value === 3)
        channelLength.value = items[2].pages.length;
    else channelLength.value = 3;
}

const mapChannelToPages = (channelArr) => {
    return channelArr?.map(channel => {
        return {
            title: channel.node.annotations[0],
            link: `/channels?member_id=${channel?.node?.member_id}&channel=${channel.node.annotations[0]}`,
            icon: null

        }
    })
}

const getUniqueFollowing = (array) => {
    return array.filter((obj, index) => {
        return array.findIndex(o => o?.node?.member_id === obj?.node?.member_id) === index
    })
}

const getFollowData = async () => {
    const { data } = await getFollowedChannels(service_id)
    items[2].pages = mapChannelToPages(getUniqueFollowing(data.edges))
}

onMounted(async () => {
    if (isAuthenticated.value) {
        await getFollowData()
    }
    channelLength.value = 3
    emitter.on('channel-followed', async () => {
        await getFollowData()
    })
})

onUnmounted(() => {
    coreStore.CloseDialog(nonAuthSubscriptionDialog)
})


</script>

<style lang="scss" scoped></style>
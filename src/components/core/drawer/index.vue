<template>
    <v-navigation-drawer v-model="coreStore.isDrawerOpen" mobile-breakpoint="sm" app :border="0" id="nav">
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
                        :key="index" rounded="xl" exact class="mb-0" :to="item.link && (item.link)
        "  :href="item.href" :target="item.target" :value="item.link" color="primary" @click="item.method">
                        <template #prepend>
                            <v-icon v-if="parentItem.header !== 'Following'">{{ item.icon }}</v-icon>
                            <v-avatar v-else size="30" :image="item?.icon">
                                <v-icon v-if="!item?.icon" size="30">mdi-account-circle</v-icon>
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
        items[2]?.pages?.length > 3
        " class="text-none mt-1 rounded-pill"
                        :prepend-icon="channelLength === 3 ? 'mdi-chevron-down' : 'mdi-chevron-up'">
                        {{
        channelLength === 3
            ? `Show ${items[2]?.pages?.length - channelLength} more `
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
        <template #append v-if="smAndDown">
            <v-sheet :elevation="10" class="pa-2" color="grey-lighten-3">
                <div v-if="!isAuthenticated" class="text-center">
                    <v-btn-toggle variant="elevated" density="compact" class="text- bg-white" dense :border="true"
                        divided>
                        <v-btn @click="$router.push({ name: 'SignIn' })">
                            Signin
                        </v-btn>
                        <v-btn @click="$router.push({ name: 'AccountOptions' })">
                            Signup
                        </v-btn>
                    </v-btn-toggle>
                </div>
                <BaseBtn variant="outlined" color="secondary"
                    class="font-weight-bold auth-btn bg-white w-100 secondary--text" v-else-if="isAuthenticated"
                    @click="logout">
                    <v-icon left size="26">mdi-account-circle</v-icon> Sign out
                </BaseBtn>
            </v-sheet>
        </template>
    </v-navigation-drawer>
    <NonAuthDialog />
</template>

<script setup>
import { BaseBtn } from '@/components/base'
import { NonAuthDialog } from '@/components/shared'
import { computed, onMounted, ref, onUnmounted, toRefs } from "vue";
import { useEmitter, useFollow, useVideo, useHelper } from "@/composables";
import { useAuthStore, useCoreStore } from '@/store';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useChannel } from '@/views/channel/useChannel';
import { all } from 'axios';
import { onBeforeRouteUpdate } from 'vue-router';
import router from '@/router';

const emits = defineEmits(['search'])
const emitter = useEmitter()

const coreStore = useCoreStore()
const { isAuthenticated, isByotubeAccount } = toRefs(useAuthStore())

const { getFollowedChannels } = useFollow()
const { getChannel } = useChannel()
const { service_id, getChannelData } = useVideo()
const { uniqueArrayOfObjects } = useHelper()
const { smAndDown } = useDisplay()
const memberId = localStorage.getItem('member_id')


const nonAuthSubscriptionDialog = 'nonAuthSubscription'
const items = [
    {
        header: null,
        pages: [
            { title: "Home", link: "/", icon: "mdi-home", method: () => { } },
            { title: "About", link: null, target: "_blank", href: 'https://about.byo.tube/', icon: "mdi-information-variant-circle-outline", method: () => { } },
            { title: isByotubeAccount.value ? 'My Channel' : "For Creators", link: isByotubeAccount.value ? '/channels' : null, target: isByotubeAccount.value ? null : "_self", href: isByotubeAccount.value ? null : 'https://about.byo.tube/creators', icon: "mdi-account-outline", method: async() => { 
                const { data } = await getChannelData()
                const channelName = data?.edges[0]?.node?.creator
                isByotubeAccount.value && router.push(`/channels?member_id=${memberId}&channel=${channelName}`) 
            } 
            },
            { title: "FAQ", link: null, target: "_blank", href: 'https://about.byo.tube/faq', icon: "mdi-frequently-asked-questions", method: () => { } },
            {
                title: "Following",
                link: isAuthenticated.value ? '/following' : null,
                icon: "mdi-youtube-subscription",
                method: () => {
                    if (!isAuthenticated.value) {
                        coreStore.OpenDialog(nonAuthSubscriptionDialog)
                        return
                    }
                    router.push('/following')
                }
            },
        ],
    },
    {
        header: null,
        pages: [
            {
                title: "History",
                link: isAuthenticated.value ? '/history' : null,
                icon: "mdi-history",
                method: () => {
                    if (!isAuthenticated.value) {
                        coreStore.OpenDialog(nonAuthSubscriptionDialog)
                        return
                    }
                    router.push('/history')
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

const mapChannelToPages = async (channelArr) => {
    const getAllChannels = channelArr?.map(channel => channel?.node?.annotations?.map(channelAnnotation => getChannel(channel?.node?.member_id, channelAnnotation)))?.flat()
    const allData = await Promise.allSettled(getAllChannels)
    const urls = allData?.filter((curr) => {
        return curr.status == "fulfilled"
    })

    return channelArr?.reduce((prev, channel, index) => {
        if (channel) {
            return [
                ...prev,
                channel?.node?.annotations?.reduce((prevChannel, channelAnnotation, innerIndex) => {
                    return [...prevChannel, {
                        title: channelAnnotation,
                        link: `/channels?member_id=${channel?.node?.member_id}&channel=${channelAnnotation}`,
                        icon: findUrl(urls, channelAnnotation)
                    }]
                }, [])
            ]
        }
    }, [])?.flat()
}

const findUrl = (allChannels, creator) => {
    return allChannels?.find(channel => channel?.value?.node?.creator === creator)?.value?.node?.channel_thumbnails?.[0]?.url
}

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("domain");
    window.location.reload();
}

const getUniqueFollowing = (array) => {
    return array?.filter((obj, index) => {
        return array?.findIndex(o => o?.node?.member_id === obj?.node?.member_id) === index
    })
}

const getFollowData = async () => {
    const res = await getFollowedChannels(service_id)
    items[2].pages = await mapChannelToPages(getUniqueFollowing(res?.data.edges))
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
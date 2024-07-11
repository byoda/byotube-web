<template>
  <nav id="navbar">
    <v-app-bar class="white" flat app clipped-left :height="mdAndUp ? 64 : 110">
      <div class="d-flex justify-space-between toolbar-container px-4 pt-1">
        <div class="d-flex align-center cursor-pointer">
          <img src="@/assets/byotube-logo.png" :width="170" :height="39" contain
            @click="$router.push({ name: 'Home' })" />
        </div>
        <div v-if="mdAndUp" class="search-field d-flex align-center">
          <BaseTextfield v-model="searchText" color="primary" variant="outlined" rounded hide-details
            append-inner-icon="mdi-magnify" placeholder="Search" label="Search" outlined density="compact"
            @click:appendInner="search" @keyup.enter="search" />
        </div>
        <div class="d-flex align-center">
          <v-menu v-if="route.name == 'Home'" offset-y transition="slide-x-transition" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <BaseBtn v-bind="props" class="ma-2" variant="outlined" icon="mdi-tune-variant" color="secondary"
                size="small" />
            </template>
            <BaseCard class="pt-3 pl-4 pr-7 rounded-lg shadow-smooth">
              <v-radio-group v-model="coreStore.filter"
                @update:model-value="emitter.emit('filter-changed', coreStore.filter)">
                <v-radio v-for="(item, index) in options" :key="index" :value="item" class="mt-0" hide-details
                  :label="item.name">
                </v-radio>
              </v-radio-group>
            </BaseCard>
          </v-menu>
          <div class="mr-5 ml-2 mt-1 cursor-pointer"
            @click="isAuthenticated ? $router.push({ name: 'Transactions' }) : coreStore.OpenDialog(nonAuthSubscriptionDialog)">
            <v-tooltip text="Tooltip " location="bottom" content-class="bg-transparent">
              <template v-slot:activator="{ props }">
                <img v-bind="props" height="45" src="@/assets/Burst_icon.png" alt="" srcset="">
              </template>
              <template #default>
                <BaseCard v-if="!loader" class="pa-3 rounded-lg elevation-5">
                  Burst: {{ balance ? addTrailingCommas(balance) + ' points' : 'Buy more!' }}
                </BaseCard>
              </template>
            </v-tooltip>
          </div>
          <template v-if="mdAndUp">
            <div v-if="!isAuthenticated" class="auth-toggle-btn-class">
              <v-btn-toggle variant="outlined" density="compact" dense rounded="xl" :border="true" divided>
                <v-btn @click="$router.push({ name: 'SignIn' })">
                  Signin
                </v-btn>
                <v-btn @click="$router.push({ name: 'AccountOptions' })">
                  Signup
                </v-btn>
              </v-btn-toggle>
            </div>
            <v-menu v-else-if="isAuthenticated" offset-y transition="slide-x-transition" :close-on-content-click="true">
              <template v-slot:activator="{ props }">
                <BaseBtn v-bind="props" class="ma-2" variant="outlined" icon="mdi-account" color="secondary"
                  size="small" />
              </template>
              <BaseCard class="py-3 px-2 rounded-lg shadow-smooth">
                <v-list density="compact">
                  <v-list-item v-for="(item, index) in accountMenuItems" :key="index" :value="index" color="primary"
                    @click="item.method">
                    <template #prepend>
                      <v-icon>
                        {{ item.icon }}
                      </v-icon>
                    </template>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </BaseCard>
            </v-menu>
            <!-- <BaseBtn variant="outlined" color="secondary" class="font-weight-bold auth-btn secondary--text"
              v-else-if="isAuthenticated" @click="logout">
              <v-icon left size="26">mdi-account-circle</v-icon> Sign out
            </BaseBtn> -->
          </template>
          <BaseBtn class="ma-2 hidden-lg-and-up" variant="outlined" icon="mdi-menu" color="secondary"
            @click="coreStore.setDrawer(!coreStore.isDrawerOpen)" size="small" />
        </div>
      </div>
      <div v-if="smAndDown" class="search-field d-flex align-center">
        <BaseTextfield v-model="searchText" color="primary" variant="outlined" rounded hide-details
          append-inner-icon="mdi-magnify" placeholder="Search" label="Search" outlined density="compact"
          @click:appendInner="search" @keyup.enter="search" />
      </div>
    </v-app-bar>
    <Drawer />
    <NonAuthDialog content-type="feature" />
  </nav>
</template>

<script setup>
import { BaseTextfield, BaseBtn, BaseCard } from '@/components/base'
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useEmitter, useHelper } from "@/composables";
import Drawer from '../drawer/index.vue'
import { useAuthStore, useCoreStore } from '@/store';
import { toRefs } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { NonAuthDialog } from '@/components/shared';
import { useTransactions } from '@/views/transactions/useTransactions';
import { onBeforeMount } from 'vue';

const emits = defineEmits(['search','filter-changed'])

const { isAuthenticated, setAuth } = toRefs(useAuthStore())
const coreStore = useCoreStore()
const { addTrailingCommas } = useHelper()

const { mdAndUp, smAndDown } = useDisplay()

const route = useRoute()
const router = useRouter()
const emitter = useEmitter()
const { balance, loader, getBalance } = useTransactions()

const nonAuthSubscriptionDialog = 'nonAuthSubscription'
const videoFilter = JSON.parse(localStorage.getItem('videos-filter')) 

// const filter = ref({ name: "All", value: "" })

const options = [
  { name: "All", value: "" },
  { name: "YouTube Hosted", value: "external" },
  { name: "BYODA Hosted", value: "published" },
]

const searchText = ref("")

const logout = () => {
  localStorage.clear()
  if (route.name !== 'Home') {
    router.push({ name: 'Home' })
    setAuth.value()
  } else {
    window.location.reload()
  }
}

const accountMenuItems = [
  {
    title: 'Logout',
    icon: 'mdi-logout',
    method: logout
  },
  {
    title: 'Settings',
    icon: 'mdi-cog-outline',
    method: () => {
      router.push({ name: 'Settings' })
    }
  },
]




const search = async () => {
  if (!searchText.value) return;
  if (searchText.value == route.query["search_query"]) return;
  emits('search')
  router.push({
    name: "Search",
    query: { "search_query": searchText.value },
  });
}
const getUser = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.show_external_assets) {
    coreStore.filter = { "name": "BYODA Hosted", "value": "published" }
  }
  emitter.emit('filter-changed', coreStore.filter, user)
}

onMounted(() => {
  if (isAuthenticated.value) {
    getBalance()
  }
  if(videoFilter){
    coreStore.filter = videoFilter 
  }
  getUser()
 
})


onBeforeRouteUpdate((to, from) => {
  if (from.name === 'Search' && to.name !== 'Search') {
    searchText.value = null
  }
})

</script>

<style lang="scss">
.auth-toggle-btn-class {
  .v-btn {
    color: #00579d;
    padding-inline: 10px !important;
  }

  .v-btn-group--density-compact.v-btn-group {
    height: 38px;
  }

  .v-btn-group--border {
    border: none !important;
  }

  .v-btn__overlay {
    background-color: #f2f2f2 !important;
  }

  .v-btn__content {
    font-size: 12px;
  }

  .v-btn-group--divided .v-btn:not(:last-child) {
    border-inline-end-color: #00579d;
  }
}

.v-list-item__avatar {
  justify-content: center !important;
}

#showBtn {
  .v-btn__content {
    justify-content: flex-start;

    i {
      margin-right: 30px;
    }
  }
}

#navbar {
  .active-item {
    .v-list-item__icon {
      color: #f29716 !important;
    }
  }

  .v-navigation-drawer__border {
    width: 0 !important;
  }

  .vuebar-element {
    height: 250px;
    width: 100%;
    max-width: 500px;
    background: #dfe9fe;
  }

  .vb>.vb-dragger {
    z-index: 5;
    width: 5px;
    right: 0;
  }

  .auth-btn {
    height: 40px;
    border-radius: 4px;
  }

  .search-field {
    min-width: 600px;
  }



  .toolbar-container {
    width: 100%;
  }

  .v-toolbar__content {
    display: block;
  }
}

@media (max-width: 440px) {

  .search-field {
    // background-color: red;
    margin-top: 5px;
    padding-inline: 10px;
    ;
    min-width: 200px !important;
    display: inline-block;
  }
}
</style>

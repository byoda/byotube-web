<template>
  <nav id="navbar">
    <v-app-bar class="white" flat app clipped-left>

      <div class="d-flex justify-space-between toolbar-container px-4">

        <div class="d-flex align-center cursor-pointer">
          <img src="@/assets/byotube-logo.png" :width="170" :height="39" contain
            @click="$router.push({ name: 'Home' })" />
        </div>
        <!-- <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom
            color="primary"></v-progress-linear> -->
        <div v-if="mdAndUp" class="search-field d-flex align-center">
          <BaseTextfield v-model="searchText" color="primary" variant="outlined" rounded hide-details
            append-inner-icon="mdi-magnify" placeholder="Search" label="Search" outlined density="compact"
            @click:appendInner="search" @keyup.enter="search" />
        </div>
        <div>
          <v-menu v-if="route.name == 'Home'" offset-y transition="slide-x-transition" :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <BaseBtn v-bind="props" class="ma-2" variant="outlined" icon="mdi-tune-variant" color="secondary"
                size="small" />
            </template>
            <v-list>
              <v-list-item v-for="(item, index) in options" :key="index">
                <v-list-item-title>
                  <v-checkbox :key="index" v-model="filter" :value="item" class="mt-0" hide-details :label="item.name"
                    @change="emitter.emit('filter-changed', filter)" />
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <template v-if="mdAndUp">
            <BaseBtn variant="outlined" color="secondary" class="font-weight-bold auth-btn secondary--text"
              v-if="!isAuthenticated" @click="$router.push({name:'SignIn'})">
              <v-icon left size="26">mdi-account-circle</v-icon> Sign in
            </BaseBtn>
            <BaseBtn variant="outlined" color="secondary" class="font-weight-bold auth-btn secondary--text"
              v-else-if="isAuthenticated" @click="logout">
              <v-icon left size="26">mdi-account-circle</v-icon> Sign out
            </BaseBtn>
          </template>

          <BaseBtn class="ma-2 hidden-lg-and-up" variant="outlined" icon="mdi-menu" color="secondary"
            @click="coreStore.setDrawer(!coreStore.isDrawerOpen)"  size="small" />
        </div>
      </div>
    </v-app-bar>

    <Drawer />
  </nav>
</template>

<script setup>
import { BaseTextfield, BaseBtn } from '@/components/base'
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEmitter } from "@/composables";
import Drawer from '../drawer/index.vue'
import { useAuthStore, useCoreStore } from '@/store';
import { toRefs } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const emits = defineEmits(['search'])

const { isAuthenticated } = toRefs(useAuthStore())
const coreStore = useCoreStore()

const { mdAndUp } = useDisplay()

const route = useRoute()
const router = useRouter()
const emitter = useEmitter()

const filter = ref([])

const options = [
  { name: "YouTube Hosted", value: "external" },
  { name: "BYODA Hosted", value: "published" },
]

const searchText = ref("")

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("domain");
  window.location.reload();
}


const search = async () => {
  if (!searchText.value) return;
  if (searchText.value == route.query["search_query"]) return;
  emits('search')
  router.push({
    name: "Search",
    query: { "search_query": searchText.value },
  });
}

onMounted(()=>{
  filter.value = JSON.parse(localStorage.getItem('videos-filter')) || []
})

</script>

<style lang="scss">
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

  // .vb>.vb-dragger>.vb-dragger-styler {
  //   -webkit-backface-visibility: hidden;
  //   backface-visibility: hidden;
  //   -webkit-transform: rotate3d(0, 0, 0, 0);
  //   transform: rotate3d(0, 0, 0, 0);
  //   -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
  //     height 100ms ease-out;
  //   transition: background-color 100ms ease-out, margin 100ms ease-out,
  //     height 100ms ease-out;

  //   margin: 5px 0px 0px 0;
  //   border-radius: 20px;
  //   height: calc(100% - 10px);
  //   display: block;
  // }

  // .v-navigation-drawer__content:hover .vb>.vb-dragger>.vb-dragger-styler {
  //   width: 5px;
  //   background-color: #e0e0e0;
  // }

  // .vb.vb-scrolling-phantom>.vb-dragger>.vb-dragger-styler {
  //   background-color: rgba(48, 121, 244, 0.3);
  //   background-color: rgba(255, 255, 255, 0.3);
  // }

  // .vb>.vb-dragger:hover>.vb-dragger-styler {
  //   margin: 0px;
  //   width: 10px;
  // }

  // .vb.vb-dragging>.vb-dragger>.vb-dragger-styler {
  //   background-color: rgba(48, 121, 244, 0.5);
  //   margin: 0px;
  //   height: 100%;
  // }

  // .vb.vb-dragging-phantom>.vb-dragger>.vb-dragger-styler {
  //   background-color: rgba(48, 121, 244, 0.5);
  // }

  // .vb::-webkit-scrollbar-thumb{
  //   background-color: red !important;
  // }

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
}
</style>

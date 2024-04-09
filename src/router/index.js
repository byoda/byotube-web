import { createRouter, createWebHistory } from "vue-router";
import NonAuth from "@/views/non-auth/NonAuth.vue";
import Home from "@/views/home/Home.vue";
import Watch from "@/views/watch/Watch.vue";
import Search from "@/views/Search/Search.vue";
import Channel from "@/views/channel/Channel.vue";
import Following from "@/views/following/Following.vue";
import History from "@/views/history/History.vue";
import Signin from "@/views/Auth/signin/SignIn.vue";
import SignUp from "@/views/Auth/signup/SignUp.vue";
import AccountOptions from "@/views/Auth/account-options/AccountOptions.vue";
import Lists from "@/views/lists/Lists.vue";
import { useAuthStore } from "@/store";
import VerifyEmail from "@/views/verify-email/VerifyEmail.vue";

const routes = [
  {
    path: "/",
    alias: "/byotube",
    name: "NonAuth",
    component: NonAuth,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
      },
      {
        path: "results",
        name: "Search",
        component: Search,
      },
      {
        path: "channels",
        name: "Channels",
        component: Channel,
      },
      {
        path: "channels",
        name: "Channels",
        component: Channel,
      },
      {
        path: "lists",
        name: "Lists",
        component: Lists,
      },
      {
        path: "watch",
        name: "Watch",
        component: Watch,
      },
      {
        path: "following",
        name: "Following",
        component: Following,
      },
      {
        path: "history",
        name: "History",
        component: History,
      },
    ],
  },
  {
    path: "/features",
    name: "AccountOptions",
    component: AccountOptions,
    meta: { requiresVisitor: true },
  },
  {
    path: "/signin",
    name: "SignIn",
    component: Signin,
    meta: { requiresVisitor: true },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
  },
  {
    path: "/verify-email",
    name: "VerifyEmail",
    component: VerifyEmail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  mode: "history",
  routes,
  base: import.meta.env.BASE_URL,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem("token");
  if (token) authStore.setAuth(true);
  const nonAuthRoutes = [
    "SignIn",
    "Signup",
    "Home",
    "Watch",
    "Search",
    "Gaming",
    "Channels",
  ];
  const authRoutes = ["Host"];
  const authPages = ["SignIn", "Signup"];
  const isAuthPages = authPages.includes(to.name);
  const isAuthRoute = authRoutes.includes(to.name);
  const isNonAuthRoute = nonAuthRoutes.includes(to.name);

  if (authStore.isAuthenticated && isAuthPages) {
    next("home");
  } else if (!authStore.isAuthenticated && isAuthRoute) {
    next("signin");
  } else {
    next();
  }
});

export default router;

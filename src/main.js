import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/styles/main.scss";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { theme } from "@/plugins/vuetify";
import { createPinia } from "pinia";
import * as AllRules from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";
import { localize } from "@vee-validate/i18n";
import mitt from "mitt";

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

configure({
  generateMessage: localize("en", {
    messages: {
      required: "The {field} field is required",
      alpha: "Only alphabetic values allowed",
      alpha_num: "Only alphabetic and numeric values allowed",
      alpha_spaces: "Only alphabetic values allowed",
      confirmed: "The entered passwords don't match. Try again!",
      email: "This field must be a valid email address",
      integer: "This {field} must be an integer",
      max: "This {field} not be greater than 0:{max} values",
      min: "This {field} must be at least 0:{min} values",
      numeric: "This {field} may only contain numeric values",
    },
  }),
});

const vuetify = createVuetify({
  theme,
});

const emitter = mitt();

const pinia = createPinia();
const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.use(vuetify);
app.use(router);
app.use(pinia);
app.use(VueSweetalert2);

app.mount("#app");

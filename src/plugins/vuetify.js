import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#f29716",
        secondary: "#00579d",
        accent: "#8e7dc3",
        "light-gray": "#9a9a9a",
        error: "#b71c1c",
      },
    },
  },
});

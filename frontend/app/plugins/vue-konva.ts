import VueKonva from "vue-konva";

export default defineNuxtPlugin({
  name: "vue-konva",
  setup(nuxtApp) {
    nuxtApp.vueApp.use(VueKonva);
  },
});

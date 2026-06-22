import ShortKey from "vue3-shortkey";

export default defineNuxtPlugin({
  name: "vue-shortkey",
  setup(nuxtApp) {
    nuxtApp.vueApp.use(ShortKey, { prevent: ["input", "textarea"] });
  },
});

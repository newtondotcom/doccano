import ShortKey from "vue-shortkey";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ShortKey, { prevent: ["input", "textarea"] });
});

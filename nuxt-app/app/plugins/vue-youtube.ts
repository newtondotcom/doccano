import VueYoutube from "vue-youtube";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueYoutube);
});

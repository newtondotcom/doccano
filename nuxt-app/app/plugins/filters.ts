export const truncate = function (text, length, clamp) {
    text = text || "";
    clamp = clamp || "...";
    length = length || 30;

    if (text.length <= length) {
        return text;
    }

    return text.substring(0, length) + clamp;
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.filter("truncate", truncate);
});

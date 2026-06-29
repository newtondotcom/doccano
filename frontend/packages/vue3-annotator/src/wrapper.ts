import type { App } from "vue";
import VAnnotator from "./components/VAnnotator.vue";

export function install(app: App) {
  if (install.installed) return;
  install.installed = true;
  app.component("VAnnotator", VAnnotator);
}

install.installed = false;

const plugin = {
  install,
};

let GlobalVue: App | undefined;
if (typeof window !== "undefined") {
  GlobalVue = (window as Window & { Vue?: App }).Vue;
} else if (typeof globalThis !== "undefined") {
  GlobalVue = (globalThis as typeof globalThis & { Vue?: App }).Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

export { VAnnotator };
export default plugin;

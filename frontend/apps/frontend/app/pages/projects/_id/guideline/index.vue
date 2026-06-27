<template>
  <editor
    ref="toastuiEditor"
    :initial-value="project.guideline"
    :options="editorOptions"
    preview-style="vertical"
    height="inherit"
    @change="updateProject"
  />
</template>

<script setup>
import "@/assets/style/editor.css";
import { Editor } from "@toast-ui/vue-editor";
import "codemirror/lib/codemirror.css";
import _ from "lodash";
// import 'tui-editor/dist/tui-editor-contents.css'
// import 'tui-editor/dist/tui-editor.css'

definePageMeta({
  layout: "project",
  middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
  validate(route) {
    return /^\d+$/.test(route.params.id);
  },
});

const route = useRoute();
const { t } = useI18n();
const { $services } = useNuxtApp();

const toastuiEditor = ref();
const editorOptions = {
  language: t("toastui.localeCode"),
};
const project = ref({});
const mounted = ref(false);

onMounted(async () => {
  const projectId = route.params.id;
  project.value = await $services.project.findById(projectId);
  toastuiEditor.value.invoke("setMarkdown", project.value.guideline);
  mounted.value = true;
});

const updateProject = _.debounce(() => {
  if (mounted.value) {
    project.value.guideline = toastuiEditor.value.invoke("getMarkdown");
    $services.project.update(route.params.id, project.value);
  }
}, 1000);
</script>

<style>
.te-md-container .CodeMirror,
.tui-editor-contents {
  font-size: 20px;
}
</style>

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

<script setup lang="ts">
import "@/assets/style/editor.css";
import { Editor } from "@toast-ui/vue-editor";
import "codemirror/lib/codemirror.css";
import _ from "lodash";
import "tui-editor/dist/tui-editor-contents.css";
import "tui-editor/dist/tui-editor.css";

definePageMeta({
    layout: "project",
    middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
    validate({ params }) {
        return /^\d+$/.test(params.id);
    },
});

const toastuiEditor = ref<any>(null);
const editorOptions = {
    language: useI18n().t("toastui.localeCode"),
};
const project = ref<any>({});
const isMounted = ref(false);
const route = useRoute();
const { $services } = useNuxtApp() as any;

onMounted(async () => {
    const projectId = route.params.id;
    project.value = await $services.project.findById(projectId);
    toastuiEditor.value?.invoke("setMarkdown", project.value.guideline);
    isMounted.value = true;
});

const updateProject = _.debounce(() => {
    if (isMounted.value && toastuiEditor.value) {
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

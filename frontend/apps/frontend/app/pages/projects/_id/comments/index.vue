<template>
  <v-card>
    <v-card-title>
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t("generic.delete") }}
      </v-btn>
      <v-dialog v-model="dialogDelete">
        <CommentFormDelete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>
    <CommentList
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
  </v-card>
</template>

<script setup lang="ts">
import { debounce } from "@/utils/debounce";
import { useMainStore as useProjectsStore } from "@/store/projects";
import { CommentItem } from "@/domain/models/comment/comment";
import { Page } from "@/domain/models/page";
import { getLinkToAnnotationPage } from "@/presenter/linkToAnnotationPage";

definePageMeta({
  layout: "project",
  middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
  validate(route) {
    return /^\d+$/.test(route.params.id);
  },
});

const route = useRoute();
const router = useRouter();
const { localePath } = useI18n();
const { $repositories } = useNuxtApp();
const projectsStore = useProjectsStore();

const dialogDelete = ref(false);
const item = ref({} as Page<CommentItem>);
const selected = ref([] as CommentItem[]);
const isLoading = ref(false);

const project = computed(() => projectsStore.project);
const canDelete = computed(() => selected.value.length > 0);
const projectId = computed(() => route.params.id as string);

async function load() {
  isLoading.value = true;
  item.value = await $repositories.comment.listAll(projectId.value, route.query);
  isLoading.value = false;
}

watch(
  () => route.query,
  debounce(() => {
    load();
  }, 1000),
  { immediate: true, deep: true },
);

async function remove() {
  await $repositories.comment.deleteBulk(projectId.value, selected.value);
  await load();
  dialogDelete.value = false;
  selected.value = [];
}

function updateQuery(query: object) {
  router.push(query);
}

function movePage(query: object) {
  const link = getLinkToAnnotationPage(projectId.value, project.value.projectType);
  updateQuery({
    path: localePath(link),
    query,
  });
}
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>

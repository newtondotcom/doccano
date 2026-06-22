<template>
  <v-card>
    <v-card-title v-if="isProjectAdmin">
      <ExampleActionMenu
        @upload="$router.push('dataset/import')"
        @download="$router.push('dataset/export')"
        @assign="dialogAssignment = true"
        @reset="dialogReset = true"
      />
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t("generic.delete") }}
      </v-btn>
      <v-spacer />
      <v-btn
        :disabled="!item.count"
        class="text-capitalize"
        color="error"
        @click="dialogDeleteAll = true"
      >
        {{ $t("generic.deleteAll") }}
      </v-btn>
      <v-dialog v-model="dialogDelete">
        <ExampleFormDelete
          :selected="selected"
          :item-key="itemKey"
          @cancel="dialogDelete = false"
          @remove="remove"
        />
      </v-dialog>
      <v-dialog v-model="dialogDeleteAll">
        <ExampleFormDeleteBulk @cancel="dialogDeleteAll = false" @remove="removeAll" />
      </v-dialog>
      <v-dialog v-model="dialogAssignment">
        <ExampleFormAssignment @assigned="assigned" @cancel="dialogAssignment = false" />
      </v-dialog>
      <v-dialog v-model="dialogReset">
        <ExampleFormResetAssignment @cancel="dialogReset = false" @reset="resetAssignment" />
      </v-dialog>
    </v-card-title>
    <ExampleImageList
      v-if="project.isImageProject"
      v-model="selected"
      :items="item.items"
      :is-admin="user.isProjectAdmin"
      :is-loading="isLoading"
      :members="members"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
      @assign="assign"
      @unassign="unassign"
    />
    <ExampleAudioList
      v-else-if="project.isAudioProject"
      v-model="selected"
      :items="item.items"
      :is-admin="user.isProjectAdmin"
      :is-loading="isLoading"
      :members="members"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
      @assign="assign"
      @unassign="unassign"
    />
    <ExampleDocumentList
      v-else
      v-model="selected"
      :items="item.items"
      :is-admin="user.isProjectAdmin"
      :is-loading="isLoading"
      :members="members"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
      @edit="editItem"
      @assign="assign"
      @unassign="unassign"
    />
  </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import { useMainStore as useProjectsStore } from "@/store/projects";
import { getLinkToAnnotationPage } from "@/presenter/linkToAnnotationPage";
import { ExampleDTO, ExampleListDTO } from "@/services/application/example/exampleData";
import { MemberItem } from "@/domain/models/member/member";

definePageMeta({
  layout: "project",
  middleware: ["check-auth", "auth", "setCurrentProject"],
  validate(route) {
    return (
      /^\d+$/.test(route.params.id as string) &&
      /^\d+|$/.test(route.query.limit as string) &&
      /^\d+|$/.test(route.query.offset as string)
    );
  },
});

const route = useRoute();
const router = useRouter();
const { localePath } = useI18n();
const { $services, $repositories } = useNuxtApp();
const projectsStore = useProjectsStore();

const dialogDelete = ref(false);
const dialogDeleteAll = ref(false);
const dialogAssignment = ref(false);
const dialogReset = ref(false);
const item = ref({} as ExampleListDTO);
const selected = ref([] as ExampleDTO[]);
const members = ref([] as MemberItem[]);
const user = ref({} as MemberItem);
const isLoading = ref(false);
const isProjectAdmin = ref(false);

const project = computed(() => projectsStore.project);
const canDelete = computed(() => selected.value.length > 0);
const projectId = computed(() => route.params.id as string);
const itemKey = computed(() => {
  if (project.value.isImageProject || project.value.isAudioProject) {
    return "filename";
  }
  return "text";
});

async function load() {
  isLoading.value = true;
  item.value = await $services.example.list(projectId.value, route.query);
  user.value = await $repositories.member.fetchMyRole(projectId.value);
  if (user.value.isProjectAdmin) {
    members.value = await $repositories.member.list(projectId.value);
  }
  isLoading.value = false;
}

watch(
  () => route.query,
  _.debounce(() => {
    load();
  }, 1000),
  { immediate: true, deep: true },
);

onMounted(async () => {
  const member = await $repositories.member.fetchMyRole(projectId.value);
  isProjectAdmin.value = member.isProjectAdmin;
});

async function remove() {
  await $services.example.bulkDelete(projectId.value, selected.value);
  await load();
  dialogDelete.value = false;
  selected.value = [];
}

async function removeAll() {
  await $services.example.bulkDelete(projectId.value, []);
  await load();
  dialogDeleteAll.value = false;
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

function editItem(example: ExampleDTO) {
  router.push(`dataset/${example.id}/edit`);
}

async function assign(exampleId: number, userId: number) {
  await $repositories.assignment.assign(projectId.value, exampleId, userId);
  item.value = await $services.example.list(projectId.value, route.query);
}

async function unassign(assignmentId: string) {
  await $repositories.assignment.unassign(projectId.value, assignmentId);
  item.value = await $services.example.list(projectId.value, route.query);
}

async function assigned() {
  dialogAssignment.value = false;
  item.value = await $services.example.list(projectId.value, route.query);
}

async function resetAssignment() {
  dialogReset.value = false;
  await $repositories.assignment.reset(projectId.value);
  item.value = await $services.example.list(projectId.value, route.query);
}
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>

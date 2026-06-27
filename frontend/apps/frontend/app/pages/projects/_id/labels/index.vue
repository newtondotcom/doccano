<template>
  <v-card>
    <v-tabs v-if="hasMultiType" v-model="tab">
      <template v-if="isIntentDetectionAndSlotFilling">
        <v-tab class="text-capitalize">Category</v-tab>
        <v-tab class="text-capitalize">Span</v-tab>
      </template>
      <template v-else>
        <v-tab class="text-capitalize">Span</v-tab>
        <v-tab class="text-capitalize">Relation</v-tab>
      </template>
    </v-tabs>
    <v-card-title>
      <LabelActionMenu
        :add-only="canOnlyAdd"
        @create="$router.push('labels/add?type=' + labelType)"
        @upload="$router.push('labels/import?type=' + labelType)"
        @download="download"
      />
      <v-btn
        v-if="!canOnlyAdd"
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t("generic.delete") }}
      </v-btn>
      <v-dialog v-model="dialogDelete">
        <LabelFormDelete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>
    <LabelList
      v-model="selected"
      :items="items"
      :is-loading="isLoading"
      :disable-edit="canOnlyAdd"
      @edit="editItem"
    />
  </v-card>
</template>

<script setup lang="ts">
import { useMainStore as useProjectsStore } from "@/store/projects";
import { LabelDTO } from "@/services/application/label/labelData";
import { MemberItem } from "@/domain/models/member/member";

definePageMeta({
  layout: "project",
  middleware: ["check-auth", "auth", "set-current-project", "can-access-labels"],
  validate(route) {
    return /^\d+$/.test(route.params.id as string);
  },
});

const route = useRoute();
const router = useRouter();
const { $services, $repositories } = useNuxtApp();
const projectsStore = useProjectsStore();

const dialogDelete = ref(false);
const items = ref([] as LabelDTO[]);
const selected = ref([] as LabelDTO[]);
const isLoading = ref(false);
const tab = ref(0);
const member = ref({} as MemberItem);

const project = computed(() => projectsStore.project);

const canOnlyAdd = computed(() => {
  if (member.value.isProjectAdmin) {
    return false;
  }
  return project.value.allowMemberToCreateLabelType;
});

const canDelete = computed(() => selected.value.length > 0);
const projectId = computed(() => route.params.id as string);

const hasMultiType = computed(() => {
  if ("projectType" in project.value) {
    return isIntentDetectionAndSlotFilling.value || !!project.value.useRelation;
  }
  return false;
});

const isIntentDetectionAndSlotFilling = computed(
  () => project.value.projectType === "IntentDetectionAndSlotFilling",
);

const labelType = computed(() => {
  if (hasMultiType.value) {
    if (isIntentDetectionAndSlotFilling.value) {
      return ["category", "span"][tab.value!];
    }
    return ["span", "relation"][tab.value!];
  }
  if (project.value.canDefineCategory) {
    return "category";
  }
  return "span";
});

const service = computed(() => {
  if (!("projectType" in project.value)) {
    return;
  }
  if (hasMultiType.value) {
    if (isIntentDetectionAndSlotFilling.value) {
      return [$services.categoryType, $services.spanType][tab.value!];
    }
    return [$services.spanType, $services.relationType][tab.value!];
  }
  if (project.value.canDefineCategory) {
    return $services.categoryType;
  }
  return $services.spanType;
});

watch(tab, () => {
  list();
});

onMounted(async () => {
  member.value = await $repositories.member.fetchMyRole(projectId.value);
  await list();
});

async function list() {
  isLoading.value = true;
  items.value = await service.value.list(projectId.value);
  isLoading.value = false;
}

async function remove() {
  await service.value.bulkDelete(projectId.value, selected.value);
  list();
  dialogDelete.value = false;
  selected.value = [];
}

async function download() {
  await service.value.export(projectId.value);
}

function editItem(item: LabelDTO) {
  router.push(`labels/${item.id}/edit?type=${labelType.value}`);
}
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>

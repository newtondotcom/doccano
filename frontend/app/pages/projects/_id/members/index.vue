<template>
  <v-card>
    <v-card-title>
      <v-btn class="text-capitalize" color="primary" @click.stop="dialogCreate = true">
        {{ $t("generic.add") }}
      </v-btn>
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t("generic.delete") }}
      </v-btn>
      <v-dialog v-model="dialogCreate">
        <MemberFormCreate
          v-model="editedItem"
          :error-message="errorMessage"
          @cancel="close"
          @save="save"
        />
      </v-dialog>
      <v-dialog v-model="dialogDelete">
        <MemberFormDelete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>
    <MemberList v-model="selected" :items="items" :is-loading="isLoading" @edit="editItem" />
  </v-card>
</template>

<script setup lang="ts">
import { MemberItem } from "@/domain/models/member/member";

definePageMeta({
  layout: "project",
  middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
  validate(route) {
    return /^\d+$/.test(route.params.id);
  },
});

const route = useRoute();
const router = useRouter();
const { $repositories } = useNuxtApp();

const dialogCreate = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  user: -1,
  role: -1,
  username: "",
  rolename: "annotator",
} as MemberItem);
const defaultItem = {
  user: -1,
  role: -1,
  username: "",
  rolename: "annotator",
} as MemberItem;
const items = ref([] as MemberItem[]);
const selected = ref([] as MemberItem[]);
const isLoading = ref(false);
const errorMessage = ref("");

const canDelete = computed(() => selected.value.length > 0);
const projectId = computed(() => route.params.id as string);

async function load() {
  isLoading.value = true;
  try {
    items.value = await $repositories.member.list(projectId.value);
  } catch (e) {
    router.push(`/projects/${projectId.value}`);
  } finally {
    isLoading.value = false;
  }
}

onMounted(load);

async function create() {
  try {
    await $repositories.member.create(projectId.value, editedItem.value);
    close();
    await load();
  } catch (e: any) {
    errorMessage.value = e.response.data.detail;
  }
}

async function update() {
  try {
    await $repositories.member.update(projectId.value, editedItem.value);
    close();
    await load();
  } catch (e: any) {
    errorMessage.value = e.response.data.detail;
  }
}

function save() {
  if (editedIndex.value > -1) {
    update();
  } else {
    create();
  }
}

function close() {
  dialogCreate.value = false;
  errorMessage.value = "";
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem);
    editedIndex.value = -1;
  });
}

async function remove() {
  await $repositories.member.bulkDelete(projectId.value, selected.value);
  await load();
  dialogDelete.value = false;
  selected.value = [];
}

function editItem(item: MemberItem) {
  editedIndex.value = items.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialogCreate.value = true;
}
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>

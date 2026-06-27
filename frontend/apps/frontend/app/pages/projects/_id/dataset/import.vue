<template>
  <v-card>
    <v-card-title>
      {{ $t("dataset.importDataTitle") }}
    </v-card-title>
    <v-card-text>
      <v-overlay :value="isImporting">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
      <v-select
        v-model="selected"
        :items="catalog"
        item-text="displayName"
        label="File format"
        outlined
      />
      <v-form v-model="valid">
        <v-text-field
          v-for="(item, key) in textFields"
          :key="key"
          v-model="option[key]"
          :label="item.title"
          :rules="requiredRules"
          outlined
        />
        <v-select
          v-for="(val, key) in selectFields"
          :key="key"
          v-model="option[key]"
          :items="val.enum"
          :label="val.title"
          outlined
        >
          <template #selection="{ item }">
            {{ toVisualize(item) }}
          </template>
          <template #item="{ item }">
            {{ toVisualize(item) }}
          </template>
        </v-select>
      </v-form>
      <v-sheet
        v-if="selected"
        :dark="!$vuetify.theme.dark"
        :light="$vuetify.theme.dark"
        class="mb-5 pa-5"
      >
        <pre>{{ example }}</pre>
      </v-sheet>
      <div v-if="selected === 'JSONL(Relation)'">
        <p class="body-1">For readability, the above format can be displayed as follows:</p>
        <v-sheet :dark="!$vuetify.theme.dark" :light="$vuetify.theme.dark" class="mb-5 pa-5">
          <pre>{{ JSON.stringify(JSON.parse(example.replaceAll("'", '"')), null, 4) }}</pre>
        </v-sheet>
      </div>
      <file-pond
        v-if="selected && acceptedFileTypes !== '*'"
        ref="pond"
        chunk-uploads="true"
        label-idle="Drop files here..."
        :allow-multiple="true"
        :accepted-file-types="acceptedFileTypes"
        :server="server"
        :files="myFiles"
        @processfile="handleFilePondProcessFile"
        @removefile="handleFilePondRemoveFile"
      />
      <file-pond
        v-if="selected && acceptedFileTypes === '*'"
        ref="pond"
        chunk-uploads="true"
        label-idle="Drop files here..."
        :allow-multiple="true"
        :server="server"
        :files="myFiles"
        @processfile="handleFilePondProcessFile"
        @removefile="handleFilePondRemoveFile"
      />
      <v-data-table
        v-if="errors.length > 0"
        :headers="headers"
        :items="errors"
        class="elevation-1"
      ></v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-btn class="text-capitalize ms-2 primary" :disabled="isDisabled" @click="importDataset">
        {{ $t("generic.import") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import Cookies from "js-cookie";
import vueFilePond from "vue-filepond";

const FilePond = vueFilePond(FilePondPluginFileValidateType);

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

const catalog = ref([]);
const selected = ref(null);
const myFiles = ref([]);
const option = ref({ column_data: "", column_label: "", delimiter: "" });
const taskId = ref(null);
const polling = ref(null);
const errors = ref([]);
const headers = [
  { text: "Filename", value: "filename" },
  { text: "Line", value: "line" },
  { text: "Message", value: "message" },
];
const requiredRules = [(v) => !!v || "Field value is required"];
const server = {
  url: "/v1/fp",
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
  process: {
    url: "/process/",
    method: "POST",
  },
  patch: "/patch/",
  revert: "/revert/",
  restore: "/restore/",
  load: "/load/",
  fetch: "/fetch/",
};
const uploadedFiles = ref([]);
const valid = ref(false);
const isImporting = ref(false);

const isDisabled = computed(
  () => uploadedFiles.value.length === 0 || taskId.value !== null || !valid.value,
);

const properties = computed(() => {
  const item = catalog.value.find((item) => item.displayName === selected.value);
  if (item) {
    return item.properties;
  }
  return {};
});

const textFields = computed(() => {
  const asArray = Object.entries(properties.value);
  const fields = asArray.filter(([_, value]) => !("enum" in value));
  return Object.fromEntries(fields);
});

const selectFields = computed(() => {
  const asArray = Object.entries(properties.value);
  const fields = asArray.filter(([_, value]) => "enum" in value);
  return Object.fromEntries(fields);
});

const acceptedFileTypes = computed(() => {
  const item = catalog.value.find((item) => item.displayName === selected.value);
  if (item) {
    return item.acceptTypes;
  }
  return "";
});

const example = computed(() => {
  const item = catalog.value.find((item) => item.displayName === selected.value);
  if (item) {
    const column_data = "column_data";
    const column_label = "column_label";
    if (column_data in option.value && column_label in option.value) {
      return item.example
        .replaceAll(column_data, option.value[column_data])
        .replaceAll(column_label, option.value[column_label])
        .trim();
    }
    return item.example.trim();
  }
  return "";
});

watch(selected, () => {
  const item = catalog.value.find((item) => item.displayName === selected.value);
  for (const [key, value] of Object.entries(item.properties)) {
    option.value[key] = value.default;
  }
  myFiles.value = [];
  for (const file of uploadedFiles.value) {
    $repositories.parse.revert(file.serverId);
  }
  uploadedFiles.value = [];
  errors.value = [];
});

onMounted(async () => {
  catalog.value = await $repositories.catalog.list(route.params.id);
  pollData();
});

onBeforeUnmount(() => {
  clearInterval(polling.value);
});

function handleFilePondProcessFile(error, file) {
  console.log(error);
  uploadedFiles.value.push(file);
  nextTick();
}

function handleFilePondRemoveFile(error, file) {
  console.log(error);
  const index = uploadedFiles.value.findIndex((item) => item.id === file.id);
  if (index > -1) {
    uploadedFiles.value.splice(index, 1);
    nextTick();
  }
}

async function importDataset() {
  isImporting.value = true;
  const item = catalog.value.find((item) => item.displayName === selected.value);
  taskId.value = await $repositories.parse.analyze(
    route.params.id,
    item.name,
    item.taskId,
    uploadedFiles.value.map((item) => item.serverId),
    option.value,
  );
}

function pollData() {
  polling.value = setInterval(async () => {
    if (taskId.value) {
      const res = await $repositories.taskStatus.get(taskId.value);
      if (res.ready) {
        taskId.value = null;
        errors.value = res.result.error;
        myFiles.value = [];
        uploadedFiles.value = [];
        isImporting.value = false;
        if (errors.value.length === 0) {
          router.push(`/projects/${route.params.id}/dataset`);
        }
      }
    }
  }, 3000);
}

function toVisualize(text) {
  if (text === "\t") {
    return "Tab";
  }
  if (text === " ") {
    return "Space";
  }
  if (text === "") {
    return "None";
  }
  return text;
}
</script>

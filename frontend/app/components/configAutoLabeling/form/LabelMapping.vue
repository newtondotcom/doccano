<template>
  <v-data-table :headers="headers" :items="value">
    <template #top>
      <v-dialog v-model="dialog" max-width="800px">
        <template #activator="{ props }">
          <v-btn color="primary" dark class="text-none" v-bind="props"> Add </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Add a new mapping</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid">
                <v-row>
                  <v-col cols="12" sm="12" class="pa-0">
                    <v-text-field
                      v-model="editedItem.from"
                      label="From"
                      :rules="labelNameRules(tm('rules.labelNameRules'))"
                      outlined
                    />
                  </v-col>
                  <v-col cols="12" sm="12" class="pa-0">
                    <v-select
                      v-model="editedItem.to"
                      :items="items"
                      :rules="labelNameRules(tm('rules.labelNameRules'))"
                      label="To"
                      outlined
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" class="text-capitalize" text @click="close">
              Cancel
            </v-btn>
            <v-btn
              :disabled="!valid"
              color="blue darken-1"
              class="text-capitalize"
              text
              @click="save"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        {{ mdiPencil }}
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        {{ mdiDelete }}
      </v-icon>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { mdiPencil, mdiDelete } from "@mdi/js";
import { labelNameRules } from "@/rules/index";

const { tm } = useI18n();

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits(["input"]);

const route = useRoute();
const { $services } = useNuxtApp();

const dialog = ref(false);
const headers = [
  {
    text: "From",
    align: "left",
    value: "from",
    sortable: false,
  },
  {
    text: "To",
    align: "left",
    value: "to",
    sortable: false,
  },
  {
    text: "Actions",
    value: "actions",
    sortable: false,
  },
];
const valid = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  from: "",
  to: "",
});
const defaultItem = {
  from: "",
  to: "",
};
const items = ref<string[]>([]);

const project = await $services.project.findById(route.params.id as string);
if (project.projectType.endsWith("Classification")) {
  const labels = await $services.categoryType.list(route.params.id as string);
  items.value = labels.map((item) => item.text);
} else {
  const labels = await $services.spanType.list(route.params.id as string);
  items.value = labels.map((item) => item.text);
}

function editItem(item: { from: string; to: string }) {
  editedIndex.value = props.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

function deleteItem(item: { from: string; to: string }) {
  editedIndex.value = props.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  const list = Object.assign([], props.value);
  list.splice(editedIndex.value, 1);
  editedItem.value = Object.assign({}, defaultItem);
  editedIndex.value = -1;
  emit("input", list);
}

function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem);
    editedIndex.value = -1;
  });
}

function save() {
  const list = Object.assign([], props.value);
  if (editedIndex.value > -1) {
    Object.assign(list[editedIndex.value], editedItem.value);
  } else {
    list.push(editedItem.value);
  }
  emit("input", list);
  close();
}
</script>

<template>
  <v-data-table :headers="headers" :items="value">
    <template #top>
      <v-toolbar class="toolbar-control" flat>
        <v-toolbar-title class="text-capitalize">
          {{ title }}
        </v-toolbar-title>
        <v-spacer />
        <v-dialog v-model="dialog" max-width="800px">
          <template #activator="{ props }">
            <v-btn color="primary" dark class="text-none" v-bind="props"> Add </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Add a new field</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form ref="form" v-model="valid">
                  <v-row>
                    <v-col cols="12" sm="12" class="pa-0">
                      <v-text-field v-model="editedItem.key" label="Key" outlined />
                    </v-col>
                    <v-col cols="12" sm="12" class="pa-0">
                      <v-text-field v-model="editedItem.value" label="Value" outlined />
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
      </v-toolbar>
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

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
    required: true,
  },
  title: {
    type: String,
    default: "",
    required: true,
  },
});

const emit = defineEmits(["input"]);

const headers = [
  {
    text: "Key",
    align: "left",
    value: "key",
    sortable: false,
  },
  {
    text: "Value",
    align: "left",
    value: "value",
    sortable: false,
  },
  {
    text: "Actions",
    value: "actions",
    sortable: false,
  },
];
const dialog = ref(false);
const valid = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  key: "",
  value: "",
});
const defaultItem = {
  key: "",
  value: "",
};

function editItem(item: { key: string; value: string }) {
  editedIndex.value = props.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}

function deleteItem(item: { key: string; value: string }) {
  editedIndex.value = props.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  const items = Object.assign([], props.value);
  items.splice(editedIndex.value, 1);
  editedItem.value = Object.assign({}, defaultItem);
  editedIndex.value = -1;
  emit("input", items);
}

function close() {
  dialog.value = false;
  nextTick(() => {
    editedItem.value = Object.assign({}, defaultItem);
    editedIndex.value = -1;
  });
}

function save() {
  const items = Object.assign([], props.value);
  if (editedIndex.value > -1) {
    Object.assign(items[editedIndex.value], editedItem.value);
  } else {
    items.push(editedItem.value);
  }
  close();
  emit("input", items);
}
</script>

<style scoped>
.toolbar-control >>> .v-toolbar__content {
  padding: 0px !important;
}
</style>

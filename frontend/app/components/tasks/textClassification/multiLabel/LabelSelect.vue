<template>
  <v-combobox
    v-model="annotatedLabels"
    chips
    :items="labels"
    item-text="text"
    hide-details
    hide-selected
    multiple
    class="pt-0"
    :search-input.sync="search"
    @change="search = ''"
  >
    <template #selection="{ attrs, item, select, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        :color="item.backgroundColor"
        :text-color="$contrastColor(item.backgroundColor)"
        close
        @click="select"
        @click:close="remove(item)"
      >
        <v-avatar v-if="item.suffixKey" left color="white" class="black--text font-weight-bold">
          {{ item.suffixKey }}
        </v-avatar>
        {{ item.text }}
      </v-chip>
    </template>
    <template #item="{ item }">
      <v-chip :color="item.backgroundColor" :text-color="$contrastColor(item.backgroundColor)">
        <v-avatar v-if="item.suffixKey" left color="white" class="black--text font-weight-bold">
          {{ item.suffixKey }}
        </v-avatar>
        {{ item.text }}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script setup>
const props = defineProps({
  labels: {
    type: Array,
    default: () => [],
    required: true,
  },
  annotations: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const emit = defineEmits(["add", "remove"]);

const search = ref("");

const annotatedLabels = computed({
  get() {
    const labelIds = props.annotations.map((item) => item.label);
    return props.labels.filter((item) => labelIds.includes(item.id));
  },
  set(newValue) {
    if (newValue.length > props.annotations.length) {
      const label = newValue[newValue.length - 1];
      if (typeof label === "object") {
        add(label);
      } else {
        newValue.pop();
      }
    } else {
      const label = annotatedLabels.value.find((x) => !newValue.some((y) => y.id === x.id));
      if (typeof label === "object") {
        remove(label);
      }
    }
  },
});

function add(label) {
  emit("add", label.id);
}

function remove(label) {
  const annotation = props.annotations.find((item) => item.label === label.id);
  emit("remove", annotation.id);
}
</script>

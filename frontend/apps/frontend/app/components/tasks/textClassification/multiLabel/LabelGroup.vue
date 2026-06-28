<template>
  <v-chip-group :value="annotatedLabel" column multiple @change="addOrRemove">
    <v-chip
      v-for="item in labels"
      :key="item.id"
      :color="item.backgroundColor"
      filter
      :text-color="$contrastColor(item.backgroundColor)"
    >
      {{ item.text }}
      <v-avatar v-if="item.suffixKey" right color="white" class="black--text font-weight-bold">
        {{ item.suffixKey }}
      </v-avatar>
    </v-chip>
  </v-chip-group>
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

const annotatedLabel = computed(() => {
  const labelIds = props.annotations.map((item) => item.label);
  return labelIds.map((id) => props.labels.findIndex((item) => item.id === id));
});

function addOrRemove(indexes) {
  if (indexes.length > annotatedLabel.value.length) {
    const index = indexes.find((i) => !annotatedLabel.value.includes(i));
    const label = props.labels[index];
    add(label);
  } else {
    const index = annotatedLabel.value.find((i) => !indexes.includes(i));
    const label = props.labels[index];
    remove(label);
  }
}

function add(label) {
  emit("add", label.id);
}

function remove(label) {
  const annotation = props.annotations.find((item) => item.label === label.id);
  emit("remove", annotation.id);
}
</script>

<template>
  <v-menu :value="opened" :position-x="x" :position-y="y" absolute offset-y @input="close">
    <v-list dense min-width="150" max-height="400" class="overflow-y-auto">
      <v-list-item>
        <v-autocomplete
          ref="autocomplete"
          v-model="value"
          :items="labels"
          autofocus
          dense
          deletable-chips
          hide-details
          item-text="text"
          item-value="id"
          label="Select a label"
          small-chips
        />
      </v-list-item>
      <v-list-item v-for="(label, i) in labels" :key="i" @click="onLabelSelected(label.id)">
        <template v-if="hasAnySuffixKey" #prepend>
          <v-chip
            v-if="label.suffixKey"
            :color="label.backgroundColor"
            variant="outlined"
            size="small"
            v-text="label.suffixKey"
          />
          <span v-else class="mr-8" />
        </template>
        <v-list-item-title v-text="label.text" />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const props = defineProps<{
  labels: any[];
  opened: boolean;
  selectedLabel?: any;
  x: number;
  y: number;
}>();

const emit = defineEmits<{
  close: [];
  "click:label": [labelId: number];
}>();

const autocomplete = ref<{ selectedItems: any[] }>();

const hasAnySuffixKey = computed(() => props.labels.some((label: any) => label.suffixKey !== null));

const value = computed({
  get() {
    return props.selectedLabel;
  },
  set(labelId: number) {
    onLabelSelected(labelId);
  },
});

function close() {
  // Todo: a bit hacky. I want to fix this problem.
  // https://github.com/vuetifyjs/vuetify/issues/10765
  nextTick(() => {
    if (autocomplete.value) {
      autocomplete.value.selectedItems = [];
    }
  });
  emit("close");
}

function onLabelSelected(labelId: number) {
  emit("click:label", labelId);
  close();
}
</script>

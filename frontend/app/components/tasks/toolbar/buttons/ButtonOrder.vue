<template>
  <v-menu>
    <template #activator="{ props: menuProps }">
      <v-tooltip bottom>
        <template #activator="{ props: tooltipProps }">
          <v-btn icon v-bind="{ ...menuProps, ...tooltipProps }">
            <v-icon>
              {{ mdiSort }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t("annotation.selectFilterTooltip") }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :active="selected === i"
        @click="selected = i"
      >
        <template #prepend>
          <v-icon v-if="selected === i">{{ mdiCheck }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { mdiSort, mdiCheck } from "@mdi/js";

const props = defineProps({
  value: {
    type: String,
    default: "",
    required: true,
  },
});

const emit = defineEmits(["click:order"]);

const items = [
  { title: "Lowest score first", param: "score" },
  { title: "Highest score first", param: "-score" },
];

const selected = computed({
  get() {
    const index = items.findIndex((item) => item.param === props.value);
    return index === -1 ? undefined : index;
  },
  set(value) {
    console.log(value);
    if (value !== undefined) {
      emit("click:order", items[value].param);
    } else {
      emit("click:order", "");
    }
  },
});
</script>

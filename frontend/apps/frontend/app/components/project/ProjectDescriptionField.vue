<template>
  <v-text-field
    v-bind="$attrs"
    :value="value"
    :rules="descriptionRules"
    :label="$t('generic.description')"
    required
    @input="$emit('input', $event)"
  />
</template>

<script setup lang="ts">
import { validateMinLength } from "@/domain/models/project/project";

defineProps({
  value: {
    type: String,
    default: "",
    required: true,
  },
});

defineEmits<{
  input: [value: string];
}>();

const { t } = useI18n();

const descriptionRules = [
  (text: string) => validateMinLength(text) || t("rules.description.required"),
];
</script>

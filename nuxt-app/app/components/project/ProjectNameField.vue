<template>
    <v-text-field
        v-bind="$attrs"
        :value="value"
        :rules="projectNameRules"
        :label="$t('overview.projectName')"
        required
        @input="$emit('input', $event)"
    />
</template>

<script setup lang="ts">
import {
    validateMinLength,
    validateNameMaxLength,
} from "@/domain/models/project/project";

defineProps({
    value: {
        type: String,
        default: "",
        required: true,
    },
});

const projectNameRules = [
    (text: string) => validateMinLength(text) || $t("rules.projectName.required"),
    (text: string) => validateNameMaxLength(text) || $t("rules.projectName.maxLength"),
];
</script>

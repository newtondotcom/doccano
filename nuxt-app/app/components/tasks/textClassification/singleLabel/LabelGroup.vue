<template>
    <v-chip-group :value="annotatedLabel" column @change="addOrRemove">
        <v-chip
            v-for="item in labels"
            :key="item.id"
            :color="item.backgroundColor"
            filter
            :text-color="$contrastColor(item.backgroundColor)"
        >
            {{ item.text }}
            <v-avatar
                v-if="item.suffixKey"
                right
                color="white"
                class="black--text font-weight-bold"
            >
                {{ item.suffixKey }}
            </v-avatar>
        </v-chip>
    </v-chip-group>
</template>

<script setup>
import { computed } from "vue";

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
    return props.labels.findIndex((item) => labelIds.includes(item.id));
});

function addOrRemove(index) {
    if (index === undefined) {
        const label = props.labels[annotatedLabel.value];
        emit("remove", label);
    } else {
        const label = props.labels[index];
        emit("add", label);
    }
}
</script>

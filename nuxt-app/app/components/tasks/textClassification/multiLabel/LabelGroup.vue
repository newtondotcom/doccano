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
import _ from "lodash";

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
    return labelIds.map((id) =>
        props.labels.findIndex((item) => item.id === id),
    );
});

function addOrRemove(indexes) {
    if (indexes.length > annotatedLabel.value.length) {
        const index = _.difference(indexes, annotatedLabel.value);
        const label = props.labels[index];
        emit("add", label);
    } else {
        const index = _.difference(annotatedLabel.value, indexes);
        const label = props.labels[index];
        emit("remove", label);
    }
}
</script>

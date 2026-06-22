<template>
    <v-select
        :value="annotatedLabel"
        chips
        :items="labels"
        item-text="text"
        hide-details
        hide-selected
        return-object
        class="pt-0"
        @change="addOrRemove"
    >
        <template #selection="{ attrs, item, select, selected }">
            <v-chip
                v-if="item.backgroundColor"
                v-bind="attrs"
                :input-value="selected"
                :color="item.backgroundColor"
                :text-color="$contrastColor(item.backgroundColor)"
                close
                @click="select"
                @click:close="remove(item)"
            >
                <v-avatar
                    v-if="item.suffixKey"
                    left
                    color="white"
                    class="black--text font-weight-bold"
                >
                    {{ item.suffixKey }}
                </v-avatar>
                {{ item.text }}
            </v-chip>
        </template>
        <template #item="{ item }">
            <v-chip
                :color="item.backgroundColor"
                :text-color="$contrastColor(item.backgroundColor)"
            >
                <v-avatar
                    v-if="item.suffixKey"
                    left
                    color="white"
                    class="black--text font-weight-bold"
                >
                    {{ item.suffixKey }}
                </v-avatar>
                {{ item.text }}
            </v-chip>
        </template>
    </v-select>
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
    return props.labels.find((item) => labelIds.includes(item.id));
});

function addOrRemove(val) {
    if (val) {
        add(val);
    } else {
        remove(annotatedLabel.value);
    }
}

function add(label) {
    emit("add", label.id);
}

function remove(label) {
    const annotation = props.annotations.find(
        (item) => item.label === label.id,
    );
    emit("remove", annotation.id);
}
</script>

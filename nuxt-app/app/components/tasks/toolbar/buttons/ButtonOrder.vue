<template>
    <v-menu>
        <template #activator="{ on: menu }">
            <v-tooltip bottom>
                <template #activator="{ on: tooltip }">
                    <v-btn icon v-on="{ ...tooltip, ...menu }">
                        <v-icon>
                            {{ mdiSort }}
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{ $t("annotation.selectFilterTooltip") }}</span>
            </v-tooltip>
        </template>
        <v-list>
            <v-list-item-group v-model="selected">
                <v-list-item v-for="(item, i) in items" :key="i">
                    <v-list-item-icon>
                        <v-icon v-if="selected === i">
                            {{ mdiCheck }}
                        </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.title }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-menu>
</template>

<script setup>
import { computed } from "vue";
import { mdiSort, mdiCheck } from "@mdi/js";

const props = defineProps({
    value: {
        type: String,
        default: "",
        required: true,
    },
});

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
        if (value !== undefined) {
            $emit("click:order", items[value].param);
        } else {
            $emit("click:order", "");
        }
    },
});
</script>

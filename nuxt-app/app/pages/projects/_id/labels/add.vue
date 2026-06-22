<template>
    <form-create v-slot="slotProps" v-bind.sync="editedItem" :items="items">
        <v-btn
            :disabled="!slotProps.valid"
            color="primary"
            class="text-capitalize"
            @click="save"
        >
            Save
        </v-btn>

        <v-btn
            :disabled="!slotProps.valid"
            color="primary"
            style="text-transform: none"
            outlined
            @click="saveAndAnother"
        >
            Save and add another
        </v-btn>
    </form-create>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import FormCreate from "@/components/label/FormCreate.vue";
import { Project } from "@/domain/models/project/project";
import { LabelDTO } from "@/services/application/label/labelData";

definePageMeta({
    layout: "project",
    middleware: ["check-auth", "auth", "setCurrentProject"],
    validate({ params, query, store }) {
        if (!["category", "span", "relation"].includes(query.type as string)) {
            return false;
        }
        if (/^\d+$/.test(params.id)) {
            const project = store.getters["projects/project"] as Project;
            return project.canDefineLabel;
        }
        return false;
    },
});

const editedItem = ref({
    text: "",
    prefixKey: null,
    suffixKey: null,
    backgroundColor: "#73D8FF",
    textColor: "#ffffff",
} as LabelDTO);
const defaultItem = {
    text: "",
    prefixKey: null,
    suffixKey: null,
    backgroundColor: "#73D8FF",
    textColor: "#ffffff",
} as LabelDTO;
const items = ref<LabelDTO[]>([]);
const route = useRoute();
const router = useRouter();
const { $services } = useNuxtApp() as any;

const projectId = computed(() => route.params.id as string);

const service = computed(() => {
    const type = route.query.type;
    if (type === "category") {
        return $services.categoryType;
    } else if (type === "span") {
        return $services.spanType;
    } else {
        return $services.relationType;
    }
});

const loadItems = async () => {
    items.value = await service.value.list(projectId.value);
};

const save = async () => {
    await service.value.create(projectId.value, editedItem.value);
    router.push(`/projects/${projectId.value}/labels`);
};

const saveAndAnother = async () => {
    await service.value.create(projectId.value, editedItem.value);
    editedItem.value = Object.assign({}, defaultItem);
    items.value = await service.value.list(projectId.value);
};

onMounted(loadItems);
</script>

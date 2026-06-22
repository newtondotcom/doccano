<template>
    <v-card>
        <v-tabs v-if="hasMultiType" v-model="tab">
            <template v-if="isIntentDetectionAndSlotFilling">
                <v-tab class="text-capitalize">Category</v-tab>
                <v-tab class="text-capitalize">Span</v-tab>
            </template>
            <template v-else>
                <v-tab class="text-capitalize">Span</v-tab>
                <v-tab class="text-capitalize">Relation</v-tab>
            </template>
        </v-tabs>
        <v-card-title>
            <action-menu
                :add-only="canOnlyAdd"
                @create="router.push('labels/add?type=' + labelType)"
                @upload="router.push('labels/import?type=' + labelType)"
                @download="download"
            />
            <v-btn
                v-if="!canOnlyAdd"
                class="text-capitalize ms-2"
                :disabled="!canDelete"
                outlined
                @click.stop="dialogDelete = true"
            >
                {{ $t("generic.delete") }}
            </v-btn>
            <v-dialog v-model="dialogDelete">
                <form-delete
                    :selected="selected"
                    @cancel="dialogDelete = false"
                    @remove="remove"
                />
            </v-dialog>
        </v-card-title>
        <label-list
            v-model="selected"
            :items="items"
            :is-loading="isLoading"
            :disable-edit="canOnlyAdd"
            @edit="editItem"
        />
    </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import ActionMenu from "@/components/label/ActionMenu.vue";
import FormDelete from "@/components/label/FormDelete.vue";
import LabelList from "@/components/label/LabelList.vue";
import { LabelDTO } from "@/services/application/label/labelData";
import { MemberItem } from "@/domain/models/member/member";
import { useMainStore as useProjectStore } from "@/store/projects";

definePageMeta({
    layout: "project",
    middleware: ["check-auth", "auth", "setCurrentProject"],
    validate({ params, app, store }) {
        if (/^\d+$/.test(params.id)) {
            const project = store.getters["projects/project"];
            if (!project.canDefineLabel) {
                return false;
            }
            return app.$repositories.member
                .fetchMyRole(params.id)
                .then((member: MemberItem) => {
                    if (member.isProjectAdmin) {
                        return true;
                    }
                    return project.allowMemberToCreateLabelType;
                });
        }
        return false;
    },
});

const dialogDelete = ref(false);
const items = ref<LabelDTO[]>([]);
const selected = ref<LabelDTO[]>([]);
const isLoading = ref(false);
const tab = ref(0);
const member = ref({} as MemberItem);
const route = useRoute();
const router = useRouter();
const { $repositories, $services } = useNuxtApp() as any;
const projectStore = useProjectStore();

const project = computed(() => projectStore.project as any);
const projectId = computed(() => route.params.id as string);

const canOnlyAdd = computed(() => {
    if (member.value.isProjectAdmin) {
        return false;
    }
    return project.value.allowMemberToCreateLabelType;
});

const canDelete = computed(() => selected.value.length > 0);

const hasMultiType = computed(() => {
    if ("projectType" in project.value) {
        return isIntentDetectionAndSlotFilling.value || !!project.value.useRelation;
    }
    return false;
});

const isIntentDetectionAndSlotFilling = computed(() => {
    return project.value.projectType === "IntentDetectionAndSlotFilling";
});

const labelType = computed(() => {
    if (hasMultiType.value) {
        if (isIntentDetectionAndSlotFilling.value) {
            return ["category", "span"][tab.value];
        }
        return ["span", "relation"][tab.value];
    }
    if (project.value.canDefineCategory) {
        return "category";
    }
    return "span";
});

const service = computed(() => {
    if (!("projectType" in project.value)) {
        return undefined;
    }
    if (hasMultiType.value) {
        if (isIntentDetectionAndSlotFilling.value) {
            return [$services.categoryType, $services.spanType][tab.value];
        }
        return [$services.spanType, $services.relationType][tab.value];
    }
    if (project.value.canDefineCategory) {
        return $services.categoryType;
    }
    return $services.spanType;
});

const list = async () => {
    isLoading.value = true;
    items.value = await service.value.list(projectId.value);
    isLoading.value = false;
};

const remove = async () => {
    await service.value.bulkDelete(projectId.value, selected.value);
    await list();
    dialogDelete.value = false;
    selected.value = [];
};

const download = async () => {
    await service.value.export(projectId.value);
};

const editItem = (item: LabelDTO) => {
    router.push(`labels/${item.id}/edit?type=${labelType.value}`);
};

watch(tab, () => {
    list();
});

onMounted(async () => {
    member.value = await $repositories.member.fetchMyRole(projectId.value);
    await list();
});
</script>

<style scoped>
::v-deep .v-dialog {
    width: 800px;
}
</style>
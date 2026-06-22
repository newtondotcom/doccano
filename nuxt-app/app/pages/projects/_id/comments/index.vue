<template>
    <v-card>
        <v-card-title>
            <v-btn
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
        <comment-list
            v-model="selected"
            :items="item.items"
            :is-loading="isLoading"
            :total="item.count"
            @update:query="updateQuery"
            @click:labeling="movePage"
        />
    </v-card>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, onMounted, ref, watch } from "vue";
import CommentList from "@/components/comment/CommentList.vue";
import FormDelete from "@/components/comment/FormDelete.vue";
import { CommentItem } from "@/domain/models/comment/comment";
import { Page } from "@/domain/models/page";
import { getLinkToAnnotationPage } from "@/presenter/linkToAnnotationPage";
import { useMainStore as useProjectStore } from "@/store/projects";

definePageMeta({
    layout: "project",
    middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
    validate({ params }) {
        return /^\d+$/.test(params.id);
    },
});

const dialogDelete = ref(false);
const item = ref({} as Page<CommentItem>);
const selected = ref<CommentItem[]>([]);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
const { $repositories, localePath } = useNuxtApp() as any;
const projectStore = useProjectStore();

const project = computed(() => projectStore.project as any);
const canDelete = computed(() => selected.value.length > 0);
const projectId = computed(() => route.params.id as string);

const loadComments = async () => {
    isLoading.value = true;
    item.value = await $repositories.comment.listAll(projectId.value, route.query);
    isLoading.value = false;
};

const remove = async () => {
    await $repositories.comment.deleteBulk(projectId.value, selected.value);
    await loadComments();
    dialogDelete.value = false;
    selected.value = [];
};

const updateQuery = (query: object) => {
    router.push(query);
};

const movePage = (query: object) => {
    const link = getLinkToAnnotationPage(projectId.value, project.value.projectType);
    updateQuery({
        path: localePath(link),
        query,
    });
};

watch(
    () => route.query,
    _.debounce(() => {
        loadComments();
    }, 1000),
);

onMounted(loadComments);
</script>

<style scoped>
::v-deep .v-dialog {
    width: 800px;
}
</style>

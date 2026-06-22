<template>
    <v-card>
        <v-card-title>
            <v-btn
                class="text-capitalize"
                color="primary"
                @click.stop="dialogCreate = true"
            >
                {{ $t("generic.add") }}
            </v-btn>
            <v-btn
                class="text-capitalize ms-2"
                :disabled="!canDelete"
                outlined
                @click.stop="dialogDelete = true"
            >
                {{ $t("generic.delete") }}
            </v-btn>
            <v-dialog v-model="dialogCreate">
                <form-create
                    v-model="editedItem"
                    :error-message="errorMessage"
                    @cancel="close"
                    @save="save"
                />
            </v-dialog>
            <v-dialog v-model="dialogDelete">
                <form-delete
                    :selected="selected"
                    @cancel="dialogDelete = false"
                    @remove="remove"
                />
            </v-dialog>
        </v-card-title>
        <member-list
            v-model="selected"
            :items="items"
            :is-loading="isLoading"
            @edit="editItem"
        />
    </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import FormDelete from "@/components/member/FormDelete.vue";
import MemberList from "@/components/member/MemberList.vue";
import FormCreate from "@/components/member/FormCreate.vue";
import { MemberItem } from "@/domain/models/member/member";

definePageMeta({
    layout: "project",
    middleware: ["check-auth", "auth", "setCurrentProject", "isProjectAdmin"],
    validate({ params }) {
        return /^\d+$/.test(params.id);
    },
});

const dialogCreate = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
    user: -1,
    role: -1,
    username: "",
    rolename: "annotator",
} as MemberItem);
const defaultItem = {
    user: -1,
    role: -1,
    username: "",
    rolename: "annotator",
} as MemberItem;
const items = ref<MemberItem[]>([]);
const selected = ref<MemberItem[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");
const route = useRoute();
const router = useRouter();
const { $repositories } = useNuxtApp() as any;

const canDelete = computed(() => selected.value.length > 0);
const projectId = computed(() => route.params.id as string);

const loadMembers = async () => {
    isLoading.value = true;
    try {
        items.value = await $repositories.member.list(projectId.value);
    } catch {
        router.push(`/projects/${projectId.value}`);
    } finally {
        isLoading.value = false;
    }
};

const create = async () => {
    try {
        await $repositories.member.create(projectId.value, editedItem.value);
        close();
        await loadMembers();
    } catch (e: any) {
        errorMessage.value = e.response.data.detail;
    }
};

const update = async () => {
    try {
        await $repositories.member.update(projectId.value, editedItem.value);
        close();
        await loadMembers();
    } catch (e: any) {
        errorMessage.value = e.response.data.detail;
    }
};

const save = () => {
    if (editedIndex.value > -1) {
        update();
    } else {
        create();
    }
};

const close = () => {
    dialogCreate.value = false;
    errorMessage.value = "";
    editedItem.value = Object.assign({}, defaultItem);
    editedIndex.value = -1;
};

const remove = async () => {
    await $repositories.member.bulkDelete(projectId.value, selected.value);
    await loadMembers();
    dialogDelete.value = false;
    selected.value = [];
};

const editItem = (item: MemberItem) => {
    editedIndex.value = items.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialogCreate.value = true;
};

onMounted(loadMembers);
</script>

<style scoped>
::v-deep .v-dialog {
    width: 800px;
}
</style>

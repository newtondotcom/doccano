<template>
    <v-data-table
        v-model="selected"
        :headers="headers"
        :items="items.toArray()"
        :loading="isLoading"
        :no-data-text="$t('vuetify.noDataAvailable')"
        item-key="id"
        :loading-text="$t('generic.loading')"
        show-select
    >
        <template #top>
            <div class="ma-4">
                <v-btn
                    class="primary text-capitalize"
                    @click="dialogCreate = true"
                >
                    {{ $t("generic.create") }}
                </v-btn>
                <v-btn
                    class="text-capitalize ms-2"
                    :disabled="!isDeletable()"
                    outlined
                    @click="dialogDelete = true"
                >
                    {{ $t("generic.delete") }}
                </v-btn>
                <v-dialog v-model="dialogCreate">
                    <config-creation-form
                        @onCreate="
                            onCreate();
                            dialogCreate = false;
                        "
                    />
                </v-dialog>
                <v-dialog v-model="dialogDelete">
                    <confirm-form
                        :items="selected"
                        title="Delete Config"
                        message="Are you sure you want to delete these configs?"
                        item-key="modelName"
                        @ok="
                            remove();
                            dialogDelete = false;
                        "
                        @cancel="dialogDelete = false"
                    />
                </v-dialog>
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import ConfigCreationForm from "./ConfigCreationForm.vue";
import ConfirmForm from "@/components/utils/ConfirmForm.vue";
import { ConfigItemResponse } from "@/repositories/autoLabeling/config/apiConfigRepository";
import { ConfigItemList } from "@/domain/models/autoLabeling/config";

const dialogCreate = ref(false);
const dialogDelete = ref(false);
const isLoading = ref(false);
const items = ref(ConfigItemList.valueOf([]) as ConfigItemList);
const selected = ref<ConfigItemResponse[]>([]);
const headers = [
    {
        text: "Model name",
        align: "left",
        value: "modelName",
        sortable: false,
    },
];
const route = useRoute();
const { $repositories } = useNuxtApp() as any;

const loadConfigs = async () => {
    isLoading.value = true;
    items.value = await $repositories.config.list(route.params.id);
    isLoading.value = false;
};

const remove = async () => {
    isLoading.value = true;
    const projectId = route.params.id;
    for (const item of selected.value) {
        await $repositories.config.delete(projectId, item.id);
    }
    items.value = await $repositories.config.list(projectId);
    selected.value = [];
    isLoading.value = false;
};

const isDeletable = () => selected.value.length > 0;

const onCreate = async () => {
    isLoading.value = true;
    items.value = await $repositories.config.list(route.params.id);
    isLoading.value = false;
};

onMounted(loadConfigs);
</script>

<style scoped>
::v-deep .v-dialog {
    width: 800px;
}
</style>

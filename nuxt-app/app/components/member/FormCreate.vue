<template>
    <base-card
        :disabled="!valid"
        :title="$t('members.addMember')"
        :agree-text="$t('generic.save')"
        :cancel-text="$t('generic.cancel')"
        @agree="emit('save')"
        @cancel="emit('cancel')"
    >
        <template #content>
            <v-form v-model="valid">
                <v-autocomplete
                    v-model="user"
                    :items="users"
                    :loading="isLoading"
                    :search-input.sync="username"
                    hide-no-data
                    item-text="username"
                    :label="$t('members.userSearchAPIs')"
                    :placeholder="$t('members.userSearchPrompt')"
                    :prepend-icon="mdiAccount"
                    :rules="[rules.userRequired]"
                    return-object
                />
                <v-select
                    v-model="role"
                    :items="roles"
                    item-text="name"
                    item-value="id"
                    :label="$t('members.role')"
                    :rules="[rules.roleRequired]"
                    return-object
                    :prepend-icon="mdiCreditCardOutline"
                >
                    <template #item="props">
                        {{
                            $translateRole(props.item.name, $t("members.roles"))
                        }}
                    </template>
                    <template #selection="props">
                        {{
                            $translateRole(props.item.name, $t("members.roles"))
                        }}
                    </template>
                </v-select>
                <v-alert v-show="errorMessage" prominent type="error">
                    <v-row align="center">
                        <v-col class="grow">
                            {{ errorMessage }}
                        </v-col>
                    </v-row>
                </v-alert>
            </v-form>
        </template>
    </base-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { mdiAccount, mdiCreditCardOutline } from "@mdi/js";
import type { PropType } from "vue";
import BaseCard from "@/components/utils/BaseCard.vue";
import { MemberItem } from "@/domain/models/member/member";
import { RoleItem } from "@/domain/models/role/role";
import { UserItem } from "@/domain/models/user/user";

const emit = defineEmits(["input"]);
const emit = defineEmits(['input', 'save', 'cancel'])

const props = defineProps({
    value: {
        type: Object as PropType<MemberItem>,
        required: true,
    },
    errorMessage: {
        type: String,
        default: "",
    },
});

const isLoading = ref(false);
const valid = ref(false);
const users = ref<UserItem[]>([]);
const roles = ref<RoleItem[]>([]);
const username = ref("");
const { $repositories } = useNuxtApp() as any;

const rules = {
    userRequired: (v: UserItem) => (!!v && !!v.username) || "Required",
    roleRequired: (v: RoleItem) => (!!v && !!v.name) || "Required",
};

const user = computed({
    get(): UserItem {
        return {
            id: props.value.user,
            username: props.value.username,
            isStaff: false,
            isSuperuser: false,
        };
    },
    set(val: MemberItem) {
        if (val === undefined) return;
        const nextUser = { user: val.id, username: val.username };
        emit("input", { ...props.value, ...nextUser });
    },
});

const role = computed({
    get(): RoleItem {
        return {
            id: props.value.role,
            name: props.value.rolename,
        };
    },
    set(val: RoleItem) {
        const nextRole = { role: val.id, rolename: val.name };
        emit("input", { ...props.value, ...nextRole });
    },
});

const loadUsers = async () => {
    isLoading.value = true;
    users.value = await $repositories.user.list(username.value);
    isLoading.value = false;
};

watch(username, () => {
    if (users.value.length > 0) return;
    if (isLoading.value) return;
    loadUsers();
});

onMounted(async () => {
    roles.value = await $repositories.role.list();
});
</script>

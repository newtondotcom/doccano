<template>
  <UtilsBaseCard
    :disabled="!valid"
    :title="$t('members.addMember')"
    :agree-text="$t('generic.save')"
    :cancel-text="$t('generic.cancel')"
    @agree="$emit('save')"
    @cancel="$emit('cancel')"
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
            {{ $translateRole(props.item.name, $t('members.roles')) }}
          </template>
          <template #selection="props">
            {{ $translateRole(props.item.name, $t('members.roles')) }}
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
  </UtilsBaseCard>
</template>

<script setup lang="ts">
import { mdiAccount, mdiCreditCardOutline } from '@mdi/js'
import type { PropType } from 'vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { MemberItem } from '@/domain/models/member/member'
import { RoleItem } from '@/domain/models/role/role'
import { UserItem } from '@/domain/models/user/user'

const props = defineProps({
  value: {
    type: Object as PropType<MemberItem>,
    required: true
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  input: [value: MemberItem]
  save: []
  cancel: []
}>()

const { $repositories } = useNuxtApp()

const isLoading = ref(false)
const valid = ref(false)
const users = ref<UserItem[]>([])
const roles = ref<RoleItem[]>([])
const username = ref('')
const rules = {
  userRequired: (v: UserItem) => (!!v && !!v.username) || 'Required',
  roleRequired: (v: RoleItem) => (!!v && !!v.name) || 'Required'
}

const user = computed({
  get(): UserItem {
    return {
      id: props.value.user,
      username: props.value.username,
      isStaff: false,
      isSuperuser: false
    }
  },
  set(val: UserItem) {
    if (val === undefined) return
    const userData = { user: val.id, username: val.username }
    emit('input', { ...props.value, ...userData })
  }
})

const role = computed({
  get(): RoleItem {
    return {
      id: props.value.role,
      name: props.value.rolename
    }
  },
  set(val: RoleItem) {
    const roleData = { role: val.id, rolename: val.name }
    emit('input', { ...props.value, ...roleData })
  }
})

async function fetchUsers() {
  isLoading.value = true
  users.value = await $repositories.user.list(username.value)
  isLoading.value = false
}

watch(username, () => {
  if (users.value.length > 0) return
  if (isLoading.value) return
  fetchUsers()
})

onBeforeMount(async () => {
  roles.value = await $repositories.role.list()
})
</script>

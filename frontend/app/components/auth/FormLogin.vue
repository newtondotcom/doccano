<template>
  <UtilsBaseCard
    :disabled="!valid"
    :title="$t('user.login')"
    :agree-text="$t('user.login')"
    @agree="tryLogin"
  >
    <template #content>
      <v-form v-model="valid">
        <v-alert v-show="showError" v-model="showError" type="error" dismissible>
          {{ $t("errors.invalidUserOrPass") }}
        </v-alert>
        <v-text-field
          v-model="username"
          :rules="userNameRules(tm('rules.userNameRules'))"
          :label="$t('user.username')"
          name="username"
          :prepend-icon="mdiAccount"
          type="text"
          autofocus
          @keyup.enter="tryLogin"
        />
        <v-text-field
          id="password"
          v-model="password"
          :rules="passwordRules(tm('rules.passwordRules'))"
          :label="$t('user.password')"
          name="password"
          :prepend-icon="mdiLock"
          type="password"
          @keyup.enter="tryLogin"
        />
      </v-form>
    </template>
  </UtilsBaseCard>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { ref } from "vue";
import { mdiAccount, mdiLock } from "@mdi/js";
import { userNameRules, passwordRules } from "@/rules/index";

const props = defineProps({
  login: {
    type: Function as PropType<
      (credentials: { username: string; password: string }) => Promise<void>
    >,
    default: () => Promise.resolve(),
  },
});

const router = useRouter();
const localePath = useLocalePath();
const { tm } = useI18n();

const valid = ref(false);
const username = ref("");
const password = ref("");
const showError = ref(false);

async function tryLogin() {
  try {
    await props.login({
      username: username.value,
      password: password.value,
    });
    router.push(localePath("/projects"));
  } catch {
    showError.value = true;
  }
}
</script>

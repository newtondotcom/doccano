<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <form-login :login="authenticateUser" />
            <social-login :fetch-social-link="fetchSocialLink" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import FormLogin from '@/components/auth/FormLogin.vue'
import SocialLogin from '@/components/auth/SocialLogin.vue'
import { useMainStore as useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const authenticateUser = (payload: { username: string; password: string }) =>
  authStore.authenticateUser(payload)

const fetchSocialLink = () => authStore.fetchSocialLink()
</script>

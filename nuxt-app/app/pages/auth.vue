<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <AuthFormLogin :login="authenticateUser" />
            <AuthSocialLogin :fetch-social-link="fetchSocialLink" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useMainStore as useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const authenticateUser = (authData: { username: string; password: string }) =>
  authStore.authenticateUser(authData)

const fetchSocialLink = () => authStore.fetchSocialLink()
</script>

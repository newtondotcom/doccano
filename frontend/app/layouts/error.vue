<template>
  <v-app dark>
    <v-container class="fill-height d-flex align-center" style="height: calc(100vh - 58px)">
      <v-row justify="center" class="w-100">
        <v-col class="text-center">
          <h1 class="text-h3 text-primary">Whoops, 404</h1>
          <p>The page you were looking for does not exist</p>
          <v-btn to="/" variant="outlined" color="primary"> Get me out of here! </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: Object,
    default: null
  }
})

const pageNotFound = '404 Not Found'
const otherError = "The page you were looking for wasn't allowed to access."

useHead({
  title: computed(() =>
    props.error?.statusCode === 404 ? pageNotFound : otherError
  )
})
</script>

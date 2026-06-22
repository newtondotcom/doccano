<template>
  <v-bottom-navigation app absolute hide-on-scroll>
    <v-btn :disabled="isFirstPage" @click="updatePage(page - 1)">
      <span>Prev</span>
      <v-icon>{{ mdiChevronLeft }}</v-icon>
    </v-btn>

    <v-btn :disabled="isLastPage" @click="updatePage(page + 1)">
      <span>Next</span>
      <v-icon>{{ mdiChevronRight }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

const props = defineProps({
  total: {
    type: Number,
    default: 1,
    required: true
  }
})

const route = useRoute()
const router = useRouter()

const page = computed(() => parseInt(route.query.page as string, 10))
const isFirstPage = computed(() => page.value === 1)
const isLastPage = computed(() => page.value === props.total || props.total === 0)

function updatePage(pageNum: number) {
  router.push({ query: { page: pageNum.toString() } })
}
</script>

<template>
  <v-app-bar app clipped-left>
    <slot name="leftDrawerIcon" />
    <nuxt-link v-if="!isAuthenticated" to="/" style="line-height: 0">
      <img src="~/assets/icon.png" height="48" />
    </nuxt-link>
    <v-toolbar-title v-if="!isAuthenticated" class="ml-2 d-none d-sm-flex">
      doccano
    </v-toolbar-title>
    <v-btn
      v-if="isAuthenticated && isIndividualProject"
      text
      class="d-none d-sm-flex"
      style="text-transform: none"
    >
      <v-icon small class="mr-1">
        {{ mdiHexagonMultiple }}
      </v-icon>
      <span> {{ currentProject.name }}</span>
    </v-btn>
    <div class="flex-grow-1" />
    <LayoutTheColorModeSwitcher />
    <LayoutLocaleMenu />
    <v-btn
      v-if="isAuthenticated"
      text
      class="text-capitalize"
      @click="$router.push(localePath('/projects'))"
    >
      {{ $t('header.projects') }}
    </v-btn>
    <v-menu v-if="!isAuthenticated" open-on-hover offset-y>
      <template #activator="{ props }">
        <v-btn text v-bind="props">
          {{ $t('home.demoDropDown') }}
          <v-icon>{{ mdiMenuDown }}</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="$router.push('/demo/' + item.link)"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-if="!isAuthenticated" outlined @click="$router.push(localePath('/auth'))">
      {{ $t('user.login') }}
    </v-btn>
    <v-menu v-if="isAuthenticated" offset-y z-index="200">
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>{{ mdiDotsVertical }}</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-subheader>{{ getUsername }}</v-list-subheader>
        <v-list-item>
          <v-switch
            :model-value="isRTL"
            :label="direction"
            class="ms-1"
            hide-details
            @update:model-value="setRTL"
          />
        </v-list-item>
        <v-list-item @click="signout">
          <template #prepend>
            <v-icon>{{ mdiLogout }}</v-icon>
          </template>
          <v-list-item-title>
            {{ $t('user.signOut') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { mdiLogout, mdiDotsVertical, mdiMenuDown, mdiHexagonMultiple } from '@mdi/js'
import { useMainStore as useAuthStore } from '@/store/auth'
import { useMainStore as useProjectsStore } from '@/store/projects'
import { useMainStore as useConfigStore } from '@/store/config'

const router = useRouter()
const route = useRoute()
const { localePath, t } = useI18n()

const authStore = useAuthStore()
const projectsStore = useProjectsStore()
const configStore = useConfigStore()
const { isAuthenticated, getUsername } = storeToRefs(authStore)
const { currentProject } = storeToRefs(projectsStore)
const { isRTL } = storeToRefs(configStore)
const { logout } = authStore
const { setRTL } = configStore

const items = computed(() => [
  { title: t('home.demoNER'), link: 'named-entity-recognition' },
  { title: t('home.demoSent'), link: 'sentiment-analysis' },
  { title: t('home.demoTranslation'), link: 'translation' },
  {
    title: t('home.demoIntenDetectSlotFil'),
    link: 'intent-detection-and-slot-filling'
  },
  { title: t('home.demoTextToSQL'), link: 'text-to-sql' },
  { title: t('home.demoImageClas'), link: 'image-classification' },
  { title: t('home.demoImageCapt'), link: 'image-caption' },
  { title: t('home.demoObjDetect'), link: 'object-detection' },
  { title: t('home.demoPolygSegm'), link: 'segmentation' },
  { title: t('home.demoSTT'), link: 'speech-to-text' }
])

const isIndividualProject = computed(
  () => route.name && String(route.name).startsWith('projects-id')
)

const direction = computed(() => (isRTL.value ? 'RTL' : 'LTR'))

function signout() {
  logout()
  router.push(localePath('/'))
}
</script>

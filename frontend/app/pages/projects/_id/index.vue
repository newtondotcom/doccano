<template>
  <v-card>
    <v-card-title>
      {{ $t('projectHome.welcome') }}
    </v-card-title>
    <v-stepper v-model="e6" vertical non-linear>
      <div v-for="(item, index) in items" :key="index">
        <v-stepper-step :complete="e6 > index + 1" :step="index + 1" editable>
          {{ item.title }}
        </v-stepper-step>
        <v-stepper-content :step="index + 1">
          <v-card v-if="e6 === index + 1" class="mb-12" width="560" height="315">
            <Youtube ref="youtube" :video-id="item.videoId" />
          </v-card>
          <v-btn color="primary mt-5" @click="next">
            {{ $t('generic.continue') }}
          </v-btn>
          <v-btn class="mt-5" text @click="prev">
            {{ $t('generic.cancel') }}
          </v-btn>
        </v-stepper-content>
      </div>
    </v-stepper>
  </v-card>
</template>

<script setup>
definePageMeta({
  layout: 'project',
  middleware: ['check-auth', 'auth', 'setCurrentProject'],
  validate(route) {
    return /^\d+$/.test(route.params.id)
  }
})

const { t } = useI18n()

const e6 = ref(1)

const items = computed(() => [
  { title: t('projectHome.importData'), videoId: 'dA4ID1DSxCE' },
  { title: t('projectHome.createLabels'), videoId: '1bSML270quU' },
  { title: t('projectHome.addMembers'), videoId: 'NI09dcBz-qA' },
  { title: t('projectHome.defineGuideline'), videoId: 'AvvX3Xs32nA' },
  { title: t('projectHome.annotateDataset'), videoId: 'F3XoSdyiMhA' },
  { title: t('projectHome.viewStatistics'), videoId: 'kfRpa0mNQMY' },
  { title: t('projectHome.exportDataset'), videoId: 'Pfy_QcHEeQ4' }
])

function next() {
  e6.value = Math.max(1, (e6.value + 1) % (items.value.length + 1))
}

function prev() {
  e6.value = Math.max(1, e6.value - 1)
}
</script>

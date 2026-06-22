<template>
  <v-card>
    <v-card-title v-text="$t('labels.importLabels')" />
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <h3>{{ $t('labels.importMessage1') }}</h3>
        <v-sheet
          v-if="exampleFormat"
          :dark="!$vuetify.theme.dark"
          :light="$vuetify.theme.dark"
          class="mb-5 pa-5"
        >
          <pre>{{ exampleFormat }}</pre>
        </v-sheet>
        <v-file-input
          v-model="file"
          accept=".json"
          :error-messages="errorMessage"
          :label="$t('labels.filePlaceholder')"
          :rules="uploadSingleFileRules($t('rules.uploadFileRules'))"
          outlined
          prepend-icon=""
          @change="$emit('clear')"
          @click:clear="$emit('clear')"
        />
        <v-btn
          :disabled="!valid"
          color="primary"
          class="text-capitalize"
          @click="$emit('upload', file)"
        >
          Import
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadSingleFileRules } from '@/rules/index'

defineProps({
  errorMessage: {
    type: String,
    default: ''
  }
})

const file = ref(null)
const valid = ref(false)

const exampleFormat = JSON.stringify(
  [
    {
      text: 'Dog',
      suffix_key: 'a',
      background_color: '#FF0000',
      text_color: '#ffffff'
    },
    {
      text: 'Cat',
      suffix_key: 'c',
      background_color: '#FF0000',
      text_color: '#ffffff'
    }
  ],
  null,
  4
)
</script>

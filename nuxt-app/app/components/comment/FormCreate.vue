<template>
  <v-form v-model="valid">
    <v-textarea
      v-model="message"
      auto-grow
      hide-details
      outlined
      rows="1"
      name="CommentInput"
      :label="$t('comments.message')"
      :rules="commentRules"
    />
    <v-btn
      class="white--text text-capitalize mt-3"
      color="primary"
      depressed
      :disabled="!valid"
      @click="addComment"
    >
      {{ $t('comments.send') }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['add-comment'])
const commentRules = [(v: string) => !!v.trim() || 'Comment is required']
const message = ref('')
const valid = ref(false)

const addComment = () => {
  emit('add-comment', message.value)
  message.value = ''
}
</script>

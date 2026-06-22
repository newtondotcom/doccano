<template>
  <v-card class="elevation-0">
    <v-card-title>
      <v-list-item class="grow ps-0">
        <template #prepend>
          <v-avatar>
            <v-icon size="large">{{ mdiAccountCircle }}</v-icon>
          </v-avatar>
        </template>

        <v-list-item-title>{{ comment.username }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ formatDate(comment.createdAt) }}
        </v-list-item-subtitle>

        <v-row align="center" justify="end">
          <v-menu v-if="comment.user == userId" bottom left>
            <template #activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>{{ mdiDotsVertical }}</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title @click="showEdit = true"> Edit </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="$emit('delete-comment', comment)">
                  Delete
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-list-item>
    </v-card-title>

    <v-card-text class="body-1">
      <span v-if="!showEdit">
        {{ comment.text }}
      </span>
      <v-form v-else v-model="valid">
        <v-row>
          <v-textarea v-model="editText" auto-grow rows="1" solo :rules="commentRules" />
        </v-row>
        <v-row justify="end">
          <v-btn text class="text-capitalize" @click="cancel"> Cancel </v-btn>
          <v-btn
            :disabled="!valid"
            color="primary"
            class="text-capitalize"
            @click="updateComment(editText)"
          >
            Update
          </v-btn>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider />
  </v-card>
</template>

<script setup lang="ts">
import { mdiAccountCircle, mdiDotsVertical } from "@mdi/js";
import type { PropType } from "vue";
import { ref } from "vue";
import { CommentItem } from "@/domain/models/comment/comment";
import { COMMENT_DATETIME_FORMAT, formatApiDateTime } from "@/utils/date";

const props = defineProps({
  comment: {
    required: true,
    type: Object as PropType<CommentItem>,
  },
  userId: {
    required: true,
    type: Number,
  },
});

const emit = defineEmits<{
  "update-comment": [comment: CommentItem];
  "delete-comment": [comment: CommentItem];
}>();

const showEdit = ref(false);
const editText = ref(props.comment.text);
const commentRules = [(v: string) => !!v.trim() || "Comment is required"];
const valid = ref(false);

function formatDate(date: string) {
  return formatApiDateTime(date, COMMENT_DATETIME_FORMAT);
}

function updateComment(newText: string) {
  showEdit.value = false;
  const comment = { ...props.comment, text: newText };
  emit("update-comment", comment);
}

function cancel() {
  showEdit.value = false;
  editText.value = props.comment.text;
}
</script>

<template>
  <UtilsBaseCard
    :title="$t('comments.comments')"
    :cancel-text="$t('generic.close')"
    @cancel="$emit('click:cancel')"
  >
    <template v-if="user.id" #content>
      <CommentFormCreate @add-comment="add" />
      <comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :user-id="user.id"
        @delete-comment="remove"
        @update-comment="maybeUpdate"
      />
    </template>
  </UtilsBaseCard>
</template>

<script setup lang="ts">
import type { CommentItem } from "@/domain/models/comment/comment";
import type { UserItem } from "@/domain/models/user/user";

const props = defineProps({
  exampleId: {
    type: Number,
    required: true,
  },
});

defineEmits(["click:cancel"]);

const route = useRoute();
const { $repositories } = useNuxtApp();

const user = ref({} as UserItem);
const comments = ref([] as CommentItem[]);

watch(
  () => props.exampleId,
  (val) => {
    if (val !== undefined) {
      list();
    }
  },
  { immediate: true, deep: true },
);

user.value = await $repositories.user.getProfile();

async function list() {
  comments.value = await $repositories.comment.list(route.params.id as string, props.exampleId);
}

async function add(message: string) {
  await $repositories.comment.create(route.params.id as string, props.exampleId, message);
  list();
}

async function remove(item: CommentItem) {
  await $repositories.comment.delete(route.params.id as string, item);
  list();
}

async function maybeUpdate(item: CommentItem) {
  await $repositories.comment.update(route.params.id as string, item);
  list();
}
</script>

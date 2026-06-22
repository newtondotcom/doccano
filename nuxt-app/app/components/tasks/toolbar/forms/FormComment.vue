<template>
    <base-card
        :title="$t('comments.comments')"
        :cancel-text="$t('generic.close')"
        @cancel="$emit('click:cancel')"
    >
        <template v-if="user.id" #content>
            <form-create @add-comment="add" />
            <comment
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                :user-id="user.id"
                @delete-comment="remove"
                @update-comment="maybeUpdate"
            />
        </template>
    </base-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Comment from "@/components/comment/Comment.vue";
import FormCreate from "@/components/comment/FormCreate.vue";
import BaseCard from "@/components/utils/BaseCard.vue";
import { CommentItem } from "@/domain/models/comment/comment";
import { UserItem } from "@/domain/models/user/user";

const props = defineProps({
    exampleId: {
        type: Number,
        required: true,
    },
});
const emit = defineEmits<["click:cancel"]>();

const user = ref({} as UserItem);
const comments = ref([] as CommentItem[]);
const route = useRoute();
const { $repositories } = useNuxtApp() as any;

const list = async () => {
    comments.value = await $repositories.comment.list(
        route.params.id,
        props.exampleId,
    );
};

const add = async (message: string) => {
    await $repositories.comment.create(route.params.id, props.exampleId, message);
    await list();
};

const remove = async (item: CommentItem) => {
    await $repositories.comment.delete(route.params.id, item);
    await list();
};

const maybeUpdate = async (item: CommentItem) => {
    await $repositories.comment.update(route.params.id, item);
    await list();
};

watch(
    () => props.exampleId,
    (val) => {
        if (val !== undefined) {
            void list();
        }
    },
    { immediate: true },
);

onMounted(async () => {
    user.value = await $repositories.user.getProfile();
});
</script>

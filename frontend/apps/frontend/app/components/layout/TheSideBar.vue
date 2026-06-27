<template>
  <v-list density="compact" nav>
    <v-list-item class="px-2">
      <v-btn color="primary" class="text-capitalize" @click="toLabeling">
        <v-icon start>{{ mdiPlayCircleOutline }}</v-icon>
        {{ $t("home.startAnnotation") }}
      </v-btn>
    </v-list-item>
    <v-list-item
      v-for="(item, i) in filteredItems"
      :key="i"
      :active="selected === i"
      @click="selectItem(i, item)"
    >
      <template #prepend>
        <v-icon>{{ item.icon }}</v-icon>
      </template>
      <v-list-item-title>{{ item.text }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  mdiAccount,
  mdiBookOpenOutline,
  mdiChartBar,
  mdiCog,
  mdiCommentAccountOutline,
  mdiDatabase,
  mdiHome,
  mdiLabel,
  mdiPlayCircleOutline,
} from "@mdi/js";
import { getLinkToAnnotationPage } from "@/presenter/linkToAnnotationPage";

const props = defineProps({
  isProjectAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  project: {
    type: Object,
    default: () => {},
    required: true,
  },
});

const router = useRouter();
const route = useRoute();
const { localePath, t } = useI18n();
const { $services } = useNuxtApp();

const selected = ref(0);

const filteredItems = computed(() => {
  const items = [
    {
      icon: mdiHome,
      text: t("projectHome.home"),
      link: "",
      isVisible: true,
    },
    {
      icon: mdiDatabase,
      text: t("dataset.dataset"),
      link: "dataset",
      isVisible: true,
    },
    {
      icon: mdiLabel,
      text: t("labels.labels"),
      link: "labels",
      isVisible:
        (props.isProjectAdmin || props.project.allowMemberToCreateLabelType) &&
        props.project.canDefineLabel,
    },
    {
      icon: mdiLabel,
      text: "Relations",
      link: "links",
      isVisible:
        (props.isProjectAdmin || props.project.allowMemberToCreateLabelType) &&
        props.project.canDefineRelation,
    },
    {
      icon: mdiAccount,
      text: t("members.members"),
      link: "members",
      isVisible: props.isProjectAdmin,
    },
    {
      icon: mdiCommentAccountOutline,
      text: "Comments",
      link: "comments",
      isVisible: props.isProjectAdmin,
    },
    {
      icon: mdiBookOpenOutline,
      text: t("guideline.guideline"),
      link: "guideline",
      isVisible: props.isProjectAdmin,
    },
    {
      icon: mdiChartBar,
      text: t("statistics.statistics"),
      link: "metrics",
      isVisible: props.isProjectAdmin,
    },
    {
      icon: mdiCog,
      text: t("settings.title"),
      link: "settings",
      isVisible: props.isProjectAdmin,
    },
  ];
  return items.filter((item) => item.isVisible);
});

function selectItem(index, item) {
  selected.value = index;
  router.push(localePath(`/projects/${route.params.id}/${item.link}`));
}

function toLabeling() {
  const query = $services.option.findOption(route.params.id);
  const link = getLinkToAnnotationPage(route.params.id, props.project.projectType);
  router.push({
    path: localePath(link),
    query,
  });
}
</script>

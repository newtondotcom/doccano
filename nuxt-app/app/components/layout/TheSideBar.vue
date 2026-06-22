<template>
    <v-list dense>
        <v-btn
            color="ms-4 my-1 mb-2 primary text-capitalize"
            nuxt
            @click="toLabeling"
        >
            <v-icon left>
                {{ mdiPlayCircleOutline }}
            </v-icon>
            {{ $t("home.startAnnotation") }}
        </v-btn>
        <v-list-item-group v-model="selected" mandatory>
            <v-list-item
                v-for="(item, i) in filteredItems"
                :key="i"
                @click="
                    $router.push(
                        localePath(
                            `/projects/${$route.params.id}/${item.link}`,
                        ),
                    )
                "
            >
                <v-list-item-action>
                    <v-icon>
                        {{ item.icon }}
                    </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        {{ item.text }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
        default: () => ({}),
        required: true,
    },
});

const selected = ref(0);
const route = useRoute();
const router = useRouter();
const { localePath, $services } = useNuxtApp() as any;

const filteredItems = computed(() => {
    const items = [
        {
            icon: mdiHome,
            text: $t("projectHome.home"),
            link: "",
            isVisible: true,
        },
        {
            icon: mdiDatabase,
            text: $t("dataset.dataset"),
            link: "dataset",
            isVisible: true,
        },
        {
            icon: mdiLabel,
            text: $t("labels.labels"),
            link: "labels",
            isVisible:
                (props.isProjectAdmin ||
                    (props.project as any).allowMemberToCreateLabelType) &&
                (props.project as any).canDefineLabel,
        },
        {
            icon: mdiLabel,
            text: "Relations",
            link: "links",
            isVisible:
                (props.isProjectAdmin ||
                    (props.project as any).allowMemberToCreateLabelType) &&
                (props.project as any).canDefineRelation,
        },
        {
            icon: mdiAccount,
            text: $t("members.members"),
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
            text: $t("guideline.guideline"),
            link: "guideline",
            isVisible: props.isProjectAdmin,
        },
        {
            icon: mdiChartBar,
            text: $t("statistics.statistics"),
            link: "metrics",
            isVisible: props.isProjectAdmin,
        },
        {
            icon: mdiCog,
            text: $t("settings.title"),
            link: "settings",
            isVisible: props.isProjectAdmin,
        },
    ];
    return items.filter((item) => item.isVisible);
});

const toLabeling = () => {
    const query = $services.option.findOption(route.params.id);
    const link = getLinkToAnnotationPage(
        route.params.id,
        (props.project as any).projectType,
    );
    router.push({
        path: localePath(link),
        query,
    });
};
</script>

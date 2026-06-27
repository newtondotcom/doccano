<template>
  <v-container>
    <v-row class="my-5" align="center">
      <v-col cols="12" sm="4" class="my-3">
        <div class="text-center">
          <h2 class="text-h5">
            {{ $t("home.featuresTitle") }}
          </h2>
        </div>
      </v-col>
      <v-col cols="12">
        <v-container>
          <v-row align="center">
            <v-col v-for="(item, index) in featureCards" :key="index" cols="12" md="4">
              <LayoutFeatureCard
                :image-src="`~/assets/${item.imageSrc}.png`"
                :title="item.title"
                :text="item.text"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";

const { t } = useI18n();

const featureCards = computed(() => [
  {
    imageSrc: "feature3.png",
    title: t("home.featuresTitle1"),
    text: t("home.featuresText1"),
  },
  {
    imageSrc: "feature2.png",
    title: t("home.featuresTitle2"),
    text: t("home.featuresText2"),
  },
  {
    imageSrc: "feature1.png",
    title: t("home.featuresTitle3"),
    text: t("home.featuresText3"),
  },
]);
</script>

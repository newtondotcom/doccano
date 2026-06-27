<template>
  <section>
    <v-parallax src="~/assets/vbanner.jpg" height="400" dark>
      <v-container>
        <v-row align="center" justify="center" class="text-white">
          <v-col cols="12" md="7">
            <v-img src="~/assets/ner_demo.png" max-height="380" contain class="ma-5" />
          </v-col>
          <v-col cols="12" md="5">
            <h1 class="mb-2 display-1 text-xs-center">
              {{ $t("home.footerTitle") }}
            </h1>
            <div class="mt-4">
              <v-menu open-on-hover offset-y>
                <template #activator="{ props }">
                  <v-btn class="blue lighten-2" dark large v-bind="props">
                    {{ $t("home.demoDropDown") }}
                    <v-icon>{{ mdiMenuDown }}</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                    @click="$router.push(localePath('/demo/' + item.link))"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { mdiMenuDown } from "@mdi/js";

const localePath = useLocalePath();
const { t } = useI18n();

const items = computed(() => [
  { title: t("home.demoNER"), link: "named-entity-recognition" },
  { title: t("home.demoSent"), link: "sentiment-analysis" },
  { title: t("home.demoTranslation"), link: "translation" },
  { title: t("home.demoTextToSQL"), link: "text-to-sql" },
]);
</script>

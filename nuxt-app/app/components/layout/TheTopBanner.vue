<template>
  <section>
    <v-parallax src="~/assets/vbanner.jpg" height="400" dark>
      <v-row align="center" justify="center" class="text-white">
        <v-col class="text-right mr-5">
          <img src="~/assets/icon.png" alt="doccano" height="200" />
        </v-col>
        <v-col>
          <h1 class="mb-2 display-1 text-xs-center">
            {{ $t('home.mainTitle') }}
          </h1>
          <div class="mt-4">
            <v-btn large outlined color="white" href="https://github.com/doccano/doccano">
              <v-icon left>
                {{ mdiGithub }}
              </v-icon>
              GitHub
            </v-btn>
            <v-btn class="blue lighten-2 ml-5" dark large :href="localePath('/auth')">
              {{ $t('home.getStarted') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-parallax>
  </section>
</template>

<script setup lang="ts">
import { mdiGithub } from '@mdi/js'

const localePath = useLocalePath()
</script>

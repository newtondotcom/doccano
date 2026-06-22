<template>
  <v-card>
    <v-card-text v-if="!!project">
      <v-form ref="form" v-model="valid" :disabled="!isEditing">
        <v-row>
          <v-col cols="12" sm="12" md="6" lg="6" xl="6">
            <ProjectNameField v-model="project.name" />
            <ProjectDescriptionField v-model="project.description" />
            <ProjectTagList v-model="tags" />
            <ProjectRandomOrderField v-model="project.enableRandomOrder" />
            <ProjectSharingModeField v-model="project.enableSharingMode" />
            <v-checkbox
              v-if="project.canDefineLabel"
              v-model="project.allowMemberToCreateLabelType"
              label="Allow project members to create label types"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions class="ps-4 pt-0">
      <v-btn v-if="!isEditing" color="primary" class="text-capitalize" @click="isEditing = true">
        Edit
      </v-btn>
      <v-btn
        v-show="isEditing"
        color="primary"
        :disabled="!valid || isUpdating"
        class="mr-4 text-capitalize"
        @click="save"
      >
        {{ $t('generic.save') }}
      </v-btn>
      <v-btn v-show="isEditing" :disabled="isUpdating" class="text-capitalize" @click="cancel">
        {{ $t('generic.cancel') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Project } from '@/domain/models/project/project'

const route = useRoute()
const { $services } = useNuxtApp()

const project = ref({} as Project)
const tags = ref<string[]>([])
const valid = ref(false)
const isEditing = ref(false)
const isUpdating = ref(false)

async function loadProject() {
  const projectId = route.params.id as string
  project.value = await $services.project.findById(projectId)
  tags.value = project.value.tags.map((item) => item.text)
  isEditing.value = false
}

function cancel() {
  loadProject()
}

async function save() {
  isUpdating.value = true
  await $services.project.update(project.value.id, project.value)
  await $services.tag.bulkUpdate(project.value.id, tags.value)
  await loadProject()
  isUpdating.value = false
}

onMounted(() => {
  loadProject()
})
</script>

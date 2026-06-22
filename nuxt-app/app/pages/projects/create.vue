<template>
  <v-card>
    <v-card-title>{{ $t('overview.createProjectTitle') }}</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <ProjectTypeField v-model="editedItem.projectType" />
        <ProjectNameField v-model="editedItem.name" outlined autofocus />
        <ProjectDescriptionField v-model="editedItem.description" outlined />
        <ProjectTagList v-model="editedItem.tags" outlined />
        <v-checkbox
          v-if="showExclusiveCategories"
          v-model="editedItem.exclusiveCategories"
          :label="$t('overview.allowSingleLabel')"
        />
        <v-checkbox
          v-if="_canDefineLabel"
          v-model="editedItem.allowMemberToCreateLabelType"
          label="Allow project members to create label types"
        />
        <template v-if="isSequenceLabelingProject">
          <v-checkbox v-model="editedItem.allowOverlappingSpans" label="Allow overlapping spans" />
          <v-img
            :src="require('@/assets/project/creation.gif')"
            height="200"
            position="left"
            contain
          />
          <v-checkbox v-model="editedItem.useRelation" label="Use relation labeling" />
          <v-checkbox v-model="editedItem.enableGraphemeMode">
            <template #label>
              <div>
                Count
                <v-tooltip bottom>
                  <template #activator="{ props }">
                    <a
                      target="_blank"
                      href="https://unicode.org/reports/tr29/"
                      @click.stop
                      v-bind="props"
                    >
                      grapheme clusters
                    </a>
                  </template>
                  Like emoji(🌷, 💩, and 👍), CRLF(\r\n), and so on.
                </v-tooltip>
                as one character
              </div>
            </template>
          </v-checkbox>
        </template>
        <ProjectRandomOrderField v-model="editedItem.enableRandomOrder" />
        <ProjectSharingModeField v-model="editedItem.enableSharingMode" />
      </v-form>
    </v-card-text>
    <v-card-actions class="ps-4">
      <v-btn
        :disabled="!valid"
        color="primary"
        style="text-transform: none"
        outlined
        @click="create"
      >
        {{ $t('generic.create') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import {
  DocumentClassification,
  ImageClassification,
  SequenceLabeling,
  canDefineLabel
} from '@/domain/models/project/project'

definePageMeta({
  layout: 'projects',
  middleware: ['check-auth', 'auth']
})

const router = useRouter()
const { $services } = useNuxtApp()

const initializeProject = () => ({
  name: '',
  description: '',
  projectType: DocumentClassification,
  enableRandomOrder: false,
  enableSharingMode: false,
  exclusiveCategories: false,
  allowOverlappingSpans: false,
  enableGraphemeMode: false,
  useRelation: false,
  tags: [] as string[],
  guideline: '',
  allowMemberToCreateLabelType: false
})

const valid = ref(false)
const editedItem = ref(initializeProject())

const showExclusiveCategories = computed(() =>
  [DocumentClassification, ImageClassification].includes(editedItem.value.projectType)
)

const isSequenceLabelingProject = computed(
  () => editedItem.value.projectType === SequenceLabeling
)

const _canDefineLabel = computed(() => canDefineLabel(editedItem.value.projectType as any))

async function create() {
  const project = await $services.project.create(editedItem.value)
  router.push(`/projects/${project.id}`)
  nextTick(() => {
    editedItem.value = initializeProject()
  })
}
</script>

<template>
  <v-toolbar class="toolbar-control" dense flat>
    <v-row no-gutters>
      <v-btn-toggle>
        <TasksToolbarButtonsButtonReview :is-reviewd="isReviewd" @click:review="$emit('click:review')" />

        <TasksToolbarButtonsButtonFilter :value="filterOption" @click:filter="changeFilter" />

        <TasksToolbarButtonsButtonOrder :value="orderOption" @click:order="changeOrder" />

        <TasksToolbarButtonsButtonGuideline @click:guideline="dialogGuideline = true" />
        <v-dialog v-model="dialogGuideline">
          <TasksToolbarFormsFormGuideline :guideline-text="guidelineText" @click:close="dialogGuideline = false" />
        </v-dialog>

        <TasksToolbarButtonsButtonComment @click:comment="dialogComment = true" />
        <v-dialog v-model="dialogComment">
          <TasksToolbarFormsFormComment :example-id="docId" @click:cancel="dialogComment = false" />
        </v-dialog>

        <TasksToolbarButtonsButtonAutoLabeling @click:auto="dialogAutoLabeling = true" />
        <v-dialog v-model="dialogAutoLabeling">
          <TasksToolbarFormsFormAutoLabeling
            :is-enabled="enableAutoLabeling"
            :error-message="errorMessage"
            @click:cancel="dialogAutoLabeling = false"
            @input="updateAutoLabeling"
          />
        </v-dialog>

        <TasksToolbarButtonsButtonClear @click:clear="dialogClear = true" />
        <v-dialog v-model="dialogClear">
          <TasksToolbarFormsFormClearLabel
            @click:ok="confirmClear"
            @click:cancel="dialogClear = false"
          />
        </v-dialog>

        <TasksToolbarButtonsButtonKeyboardShortcut @click:open="dialogShortcut = true" />
        <v-dialog v-model="dialogShortcut">
          <TasksToolbarFormsFormKeyboardShortcut @click:close="dialogShortcut = false" />
        </v-dialog>
      </v-btn-toggle>
      <slot />
      <v-spacer />
      <TasksToolbarButtonsButtonPagination
        :value="page"
        :total="total"
        @click:prev="updatePage(page - 1)"
        @click:next="updatePage(page + 1)"
        @click:first="updatePage(1)"
        @click:last="updatePage(total)"
        @click:jump="updatePage($event)"
      />
    </v-row>
  </v-toolbar>
</template>

<script setup lang="ts">
const props = defineProps({
  docId: {
    type: Number,
    required: true
  },
  enableAutoLabeling: {
    type: Boolean,
    default: false,
    required: true
  },
  guidelineText: {
    type: String,
    default: '',
    required: true
  },
  isReviewd: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['click:review', 'click:clear-label', 'update:enable-auto-labeling'])

const route = useRoute()
const router = useRouter()

const dialogAutoLabeling = ref(false)
const dialogClear = ref(false)
const dialogComment = ref(false)
const dialogGuideline = ref(false)
const dialogShortcut = ref(false)
const errorMessage = ref('')

const page = computed(() => parseInt(route.query.page as string, 10))
const filterOption = computed(() => route.query.isChecked as string)
const orderOption = computed(() => route.query.ordering as string)

function updatePage(pageNum: number) {
  router.push({
    query: {
      page: pageNum.toString(),
      isChecked: filterOption.value,
      ordering: route.query.ordering,
      q: route.query.q
    }
  })
}

function changeFilter(isChecked: string) {
  router.push({
    query: {
      page: '1',
      isChecked,
      ordering: route.query.ordering,
      q: route.query.q
    }
  })
}

function changeOrder(ordering: string) {
  router.push({
    query: {
      page: '1',
      isChecked: filterOption.value,
      q: route.query.q,
      ordering
    }
  })
}

function updateAutoLabeling(isEnable: boolean) {
  emit('update:enable-auto-labeling', isEnable)
}

function confirmClear() {
  emit('click:clear-label')
  dialogClear.value = false
}
</script>

<style scoped>
.toolbar-control {
  position: sticky;
  top: 68px;
  z-index: 100;
}

.toolbar-control >>> .v-toolbar__content {
  padding: 0px !important;
}

::v-deep .v-dialog {
  width: 800px;
}
</style>

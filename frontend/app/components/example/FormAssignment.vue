<template>
  <v-card>
    <v-toolbar color="primary white--text" flat>
      <v-toolbar-title>Assign examples to members</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-card-title class="pb-0 pl-3">Select assignment strategy</v-card-title>
          <v-col cols="12">
            <v-select
              v-model="selectedStrategy"
              :items="strategies"
              item-text="displayName"
              item-value="value"
              outlined
              dense
              hide-details
            ></v-select>
            {{ strategies.find((strategy) => strategy.value === selectedStrategy)?.description }}
            The project managers have access to all examples, regardless of whether they are
            assigned or not.
          </v-col>
        </v-row>
        <v-row>
          <v-card-title class="pb-0 pl-3">Allocate weights</v-card-title>
          <v-col v-for="(member, i) in members" :key="member.id" cols="12" class="pt-0 pb-0">
            <div class="text-subtitle-2 pl-0">{{ member.username }}</div>
            <v-slider v-model="workloadAllocation[i]" :max="100" class="align-center">
              <template #append>
                <v-text-field
                  v-model="workloadAllocation[i]"
                  class="mt-0 pt-0"
                  type="number"
                  style="width: 60px"
                ></v-text-field>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn class="text-capitalize" text color="primary" data-test="cancel-button" @click="cancel">
        Cancel
      </v-btn>
      <v-btn
        class="text-none"
        text
        :disabled="!validateWeight || isWaiting"
        data-test="delete-button"
        @click="agree"
      >
        Assign
      </v-btn>
    </v-card-actions>
    <v-overlay :value="isWaiting">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { MemberItem } from '@/domain/models/member/member'

const emit = defineEmits<{
  assigned: []
  cancel: []
}>()

const route = useRoute()
const { $repositories } = useNuxtApp()

const members = ref<MemberItem[]>([])
const workloadAllocation = ref<number[]>([])
const selectedStrategy = ref('weighted_sequential')
const isWaiting = ref(false)

const projectId = computed(() => route.params.id as string)

const strategies = computed(() => [
  {
    displayName: 'Weighted sequential',
    value: 'weighted_sequential',
    description:
      'Assign examples to members in order of their workload. The total weight must equal 100.'
  },
  {
    displayName: 'Weighted random',
    value: 'weighted_random',
    description:
      'Assign examples to members randomly based on their workload. The total weight must equal 100.'
  },
  {
    displayName: 'Sampling without replacement',
    value: 'sampling_without_replacement',
    description: 'Assign examples to members randomly without replacement.'
  }
])

const validateWeight = computed((): boolean => {
  if (selectedStrategy.value === 'sampling_without_replacement') {
    return true
  } else {
    return workloadAllocation.value.reduce((acc, cur) => acc + cur, 0) === 100
  }
})

async function loadMembers() {
  members.value = await $repositories.member.list(projectId.value)
  workloadAllocation.value = members.value.map(() => Math.round(100 / members.value.length))
}

onMounted(() => {
  loadMembers()
})

async function agree() {
  isWaiting.value = true
  const workloads = workloadAllocation.value.map((weight, i) => ({
    weight,
    member_id: members.value[i].id
  }))
  await $repositories.assignment.bulkAssign(projectId.value, {
    strategy_name: selectedStrategy.value,
    workloads
  })
  isWaiting.value = false
  emit('assigned')
}

function cancel() {
  emit('cancel')
}
</script>

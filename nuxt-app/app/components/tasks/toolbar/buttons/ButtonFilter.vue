<template>
  <v-menu>
    <template #activator="{ props: menuProps }">
      <v-tooltip bottom>
        <template #activator="{ props: tooltipProps }">
          <v-btn icon v-bind="{ ...menuProps, ...tooltipProps }">
            <v-icon>
              {{ mdiFilter }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('annotation.selectFilterTooltip') }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :active="selected === i"
        @click="selected = i"
      >
        <template #prepend>
          <v-icon v-if="selected === i">{{ mdiCheck }}</v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { mdiFilter, mdiCheck } from '@mdi/js'

const props = defineProps({
  value: {
    type: String,
    default: '',
    required: true
  }
})

const emit = defineEmits(['click:filter'])

const instance = getCurrentInstance()

const items = computed(() => [
  { title: instance?.proxy?.$t('annotation.filterOption1'), param: '' },
  { title: instance?.proxy?.$t('annotation.filterOption2'), param: 'true' },
  { title: instance?.proxy?.$t('annotation.filterOption3'), param: 'false' }
])

const selected = computed({
  get() {
    const index = items.value.findIndex((item) => item.param === props.value)
    return index === -1 ? 0 : index
  },
  set(value) {
    emit('click:filter', items.value[value].param)
  }
})
</script>

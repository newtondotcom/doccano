<template>
  <div>
    <div id="waveform" />
    <v-row no-gutters align="center" class="mb-3 mt-1">
      <v-col md="8">
        <v-slider
          v-model="zoom"
          min="0"
          max="500"
          step="10"
          :append-icon="mdiMagnifyPlusOutline"
          :prepend-icon="mdiMagnifyMinusOutline"
          hide-details
          @click:append="zoomIn"
          @click:prepend="zoomOut"
          @change="onChangeZoom"
        />
      </v-col>
      <v-col md="2">
        <v-slider
          v-model="volume"
          min="0"
          max="1"
          step="0.1"
          :append-icon="mdiVolumeHigh"
          hide-details
          @change="onChangeVolume"
        />
      </v-col>
      <v-col md="2">
        <v-select
          v-model="speed"
          :items="speeds"
          label="Speed"
          dense
          outlined
          hide-details
          @change="onChangeSpeed"
        />
      </v-col>
    </v-row>
    <v-btn color="primary" class="text-capitalize" @click="play">
      <v-icon v-if="!isPlaying" left>
        {{ mdiPlayCircleOutline }}
      </v-icon>
      <v-icon v-else left>
        {{ mdiPauseCircleOutline }}
      </v-icon>
      <span v-if="!isPlaying">Play</span>
      <span v-else>Pause</span>
    </v-btn>
  </div>
</template>

<script setup>
import WaveSurfer from 'wavesurfer.js'
import {
  mdiPlayCircleOutline,
  mdiPauseCircleOutline,
  mdiVolumeHigh,
  mdiMagnifyPlusOutline,
  mdiMagnifyMinusOutline
} from '@mdi/js'

const props = defineProps({
  source: {
    type: String,
    default: '',
    required: true
  }
})

const wavesurfer = ref(null)
const isPlaying = ref(false)
const zoom = ref(0)
const volume = ref(0.6)
const speed = ref(1)
const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

watch(
  () => props.source,
  () => {
    load()
    isPlaying.value = false
  }
)

onMounted(() => {
  wavesurfer.value = WaveSurfer.create({
    container: '#waveform',
    backend: 'MediaElement'
  })
  load()
})

function load() {
  wavesurfer.value?.load(props.source)
}

function play() {
  isPlaying.value = !isPlaying.value
  wavesurfer.value?.playPause()
}

function zoomOut() {
  zoom.value = zoom.value - 10 || 0
  onChangeZoom(zoom.value)
}

function zoomIn() {
  zoom.value = zoom.value + 10 || 500
  onChangeZoom(zoom.value)
}

function onChangeVolume(value) {
  wavesurfer.value?.setVolume(value)
}

function onChangeZoom(value) {
  wavesurfer.value?.zoom(value)
}

function onChangeSpeed(value) {
  wavesurfer.value?.setPlaybackRate(value)
}
</script>

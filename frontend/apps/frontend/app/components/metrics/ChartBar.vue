<template>
  <canvas ref="chartCanvas" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Legend } from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend);

const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const options = {
  indexAxis: "y" as const,
  scales: {
    y: {
      barPercentage: 0.3,
    },
    x: {
      ticks: {
        beginAtZero: true,
        min: 0,
      },
    },
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
};

function renderChart() {
  if (!chartCanvas.value) return;
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(chartCanvas.value, {
    type: "bar",
    data: props.chartData as any,
    options,
  });
}

onMounted(() => {
  renderChart();
});

watch(
  () => props.chartData,
  () => {
    if (chartInstance) {
      chartInstance.data = props.chartData as any;
      chartInstance.update();
    } else {
      renderChart();
    }
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

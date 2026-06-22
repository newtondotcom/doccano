<script setup>
import { ref, onMounted } from "vue";
import { HorizontalBar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

const props = defineProps({
    chartData: {
        type: Object,
        default: () => ({}),
        required: true,
    },
});

const options = ref({
    scales: {
        yAxes: [
            {
                barPercentage: 0.3,
            },
        ],
        xAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    min: 0,
                },
            },
        ],
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
});

onMounted(() => {
    // Chart rendering handled by vue-chartjs mixin
});
</script>

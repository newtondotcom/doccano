<template>
  <file-pond
    ref="pond"
    chunk-uploads="true"
    label-idle="Drop files here..."
    :allow-multiple="false"
    :server="server"
    :files="myFiles"
    @processfile="handleFilePondProcessfile"
    @removefile="handleFilePondRemovefile"
  />
</template>

<script setup>
import Cookies from "js-cookie";
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

const FilePond = vueFilePond(FilePondPluginFileValidateType);

defineProps({
  value: {
    type: String,
    default: "",
    required: true,
  },
});

const emit = defineEmits(["input"]);

const myFiles = ref([]);
const server = {
  url: "/v1/fp",
  headers: {
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
  process: {
    url: "/process/",
    method: "POST",
  },
  patch: "/patch/",
  revert: "/revert/",
  restore: "/restore/",
  load: "/load/",
  fetch: "/fetch/",
};

function handleFilePondProcessfile(error, file) {
  console.log(error);
  emit("input", file.serverId);
}

function handleFilePondRemovefile() {
  emit("input", "");
}
</script>

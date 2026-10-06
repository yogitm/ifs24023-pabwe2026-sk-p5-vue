<template>
  <div class="toastui-editor-wrapper">
    <textarea
      :data-testid="textareaTestId"
      :value="modelValue"
      @input="onTextareaInput"
      class="hidden"
      tabindex="-1"
      aria-hidden="true"
    />
    <div ref="editorContainer" data-testid="markdown-editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Tulis deskripsi spesifikasi barang lelang...",
  },
  height: {
    type: String,
    default: "240px",
  },
  textareaTestId: {
    type: String,
    default: "markdown-editor-textarea",
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const editorContainer = ref(null);
let editorInstance = null;

onMounted(() => {
  editorInstance = new Editor({
    el: editorContainer.value,
    height: props.height,
    initialEditType: "markdown",
    previewStyle: "tab",
    initialValue: props.modelValue || "",
    placeholder: props.placeholder,
    usageStatistics: false,
    hideModeSwitch: false,
    events: {
      change: () => {
        const markdown = editorInstance.getMarkdown();
        emit("update:modelValue", markdown);
        emit("change", markdown);
      },
    },
  });
});

watch(
  () => props.modelValue,
  (newVal) => {
    const currentVal = editorInstance.getMarkdown();
    if (newVal !== currentVal) {
      editorInstance.setMarkdown(newVal || "");
    }
  }
);

function onTextareaInput(e) {
  emit("update:modelValue", e.target.value);
  emit("change", e.target.value);
  editorInstance.setMarkdown(e.target.value);
}

onBeforeUnmount(() => {
  editorInstance.destroy();
  editorInstance = null;
});
</script>

<style>
.toastui-editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.toastui-editor-wrapper > div[data-testid="markdown-editor-container"] {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

const props = defineProps<{
  content: string
  loading?: boolean
}>()

const htmlContent = ref('')

// 配置marked
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  langPrefix: 'hljs language-',
  gfm: true,
  breaks: true,
})

// 渲染Markdown内容
const renderMarkdown = () => {
  if (props.content) {
    htmlContent.value = marked.parse(props.content)
  } else {
    htmlContent.value = ''
  }
}

onMounted(() => {
  renderMarkdown()
})

// 监听内容变化
watch(
  () => props.content,
  () => {
    renderMarkdown()
  },
)
</script>

<template>
  <div class="markdown-preview">
    <div v-if="loading" class="loading">
      <el-skeleton :rows="10" animated />
    </div>
    <div v-else class="markdown-body" v-html="htmlContent"></div>
  </div>
</template>

<style scoped>
.markdown-preview {
  width: 100%;
}

.markdown-body {
  color: var(--text-color);
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    Helvetica,
    Arial,
    sans-serif;
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word;
  padding: 0;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  color: var(--heading-color);
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body :deep(h1) {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--border-color);
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--border-color);
}

.markdown-body :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body :deep(blockquote) {
  margin: 0;
  padding: 0 1em;
  color: var(--text-color-light);
  border-left: 0.25em solid var(--border-color);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-body :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: var(--background-mute);
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-body :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: var(--background-mute);
  border-radius: 3px;
}

.markdown-body :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  box-sizing: border-box;
  display: block;
  margin: 16px auto;
}

.markdown-body :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: var(--border-color);
  border: 0;
}

.loading {
  padding: 20px;
}
</style>

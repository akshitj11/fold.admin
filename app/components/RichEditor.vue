<script setup lang="ts">
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { Bold, Heading2, Italic, List, ListOrdered, Quote } from 'lucide-vue-next';

const props = defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3] } }),
    Placeholder.configure({ placeholder: props.placeholder || 'Writing content…' })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (newVal) => {
  if (editor.value && editor.value.getHTML() !== newVal) {
    editor.value.commands.setContent(newVal, false)
  }
})

onBeforeUnmount(() => { editor.value?.destroy() })
</script>

<template>
  <div class="editor-wrap">
    <div v-if="editor" class="toolbar">
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ active: editor.isActive('heading', { level: 2 }) }" title="Heading 2">
        <Heading2 :size="15" />
      </button>
      <div class="divider"></div>
      <button type="button" @click="editor.chain().focus().toggleBold().run()"
        :class="{ active: editor.isActive('bold') }" title="Bold">
        <Bold :size="15" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()"
        :class="{ active: editor.isActive('italic') }" title="Italic">
        <Italic :size="15" />
      </button>
      <div class="divider"></div>
      <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ active: editor.isActive('bulletList') }" title="Bullet List">
        <List :size="15" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ active: editor.isActive('orderedList') }" title="Ordered List">
        <ListOrdered :size="15" />
      </button>
      <div class="divider"></div>
      <button type="button" @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ active: editor.isActive('blockquote') }" title="Quote">
        <Quote :size="15" />
      </button>
    </div>
    <EditorContent :editor="editor" class="editor-content" />
  </div>
</template>

<style scoped>
.editor-wrap {
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.15s;
}

.editor-wrap:focus-within {
  border-color: var(--text-muted);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}

.toolbar button {
  background: transparent;
  border: none;
  color: var(--text-muted);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar button:hover {
  background: var(--bg-hover);
  color: var(--text-secondary);
}

.toolbar button.active {
  background: var(--accent-dim);
  color: var(--text-primary);
}

.divider {
  width: 1px;
  height: 16px;
  background: var(--border);
  margin: 0 4px;
}

.editor-content {
  padding: 12px;
  min-height: 200px;
  cursor: text;
}

/* Tiptap prose styles */
:deep(.tiptap) {
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
}

:deep(.tiptap p.is-editor-empty:first-child::before) {
  color: var(--text-muted);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.tiptap p) {
  margin-bottom: 0.75em;
}

:deep(.tiptap h2) {
  font-size: 1.3em;
  font-weight: 600;
  margin: 1.2em 0 0.5em;
  line-height: 1.3;
}

:deep(.tiptap ul),
:deep(.tiptap ol) {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}

:deep(.tiptap blockquote) {
  border-left: 3px solid var(--border);
  padding-left: 1em;
  margin-left: 0;
  margin-bottom: 0.75em;
  color: var(--text-secondary);
  font-style: italic;
}
</style>

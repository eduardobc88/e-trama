<template lang="html">
  <div>
    <VMarkdownEditor
      v-if="!readOnly"
      v-bind:modelValue="mdContent"
      locale="en"
      :upload-action="handleUpload"
      @update:modelValue="onUpdate"/>
    <VMarkdownView
      v-if="readOnly"
      :content="mdContent"/>
  </div>
</template>
<script>

// NOTE: example
//  <MDEditor
//    v-bind:model="modelInstance"
//    prop="content"
//    v-bind:readOnly="true"/>

import { ref, refs } from 'vue'
import {
  VMarkdownEditor,
  VMarkdownView,
} from 'vue3-markdown'
import 'vue3-markdown/dist/vue3-markdown.css'

export default {
  props: {
    model: {
      type: Object,
      default: {},
    },
    prop: {
      type: String,
      default: '',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VMarkdownEditor,
    VMarkdownView,
  },
  data () {
    return {
      mdContent: '',
    }
  },
  created () {
    this.mdContent = this.content
  },
  methods: {
    handleUpload (file) {
      console.log('== handleUpload ==', file)
    },
    onUpdate (data) {
      this.mdContent = data
    },
  },
}
</script>

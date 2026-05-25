<template>
  <div class="markdown">
    <perfect-scrollbar
      v-bind:style="{
        height: MDHeight,
      }">
      <div v-html="md.render(MDText)" />
    </perfect-scrollbar>
  </div>
</template>

<script setup>
import {
  defineProps,
} from 'vue'

import markdownit from 'markdown-it'
const md = markdownit({
  breaks: true,
})


defineProps({
  MDText: {
    type: String,
    default: '',
    required: true,
  },
  MDHeight: {
    type: String,
    default: '100%',
    required: true,
  }
})

</script>

<style scoped>
.markdown {
  display: block;
}
</style>
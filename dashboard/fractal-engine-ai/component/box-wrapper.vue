<template>
  <div
    id="box-wrapper"
    v-bind:style="customHeight"
    v-bind:class="{
      'no-box-bkg': noBkg,
    }">
    <SectionHeader
      v-if="sectionTitle"
      v-bind:sectionTitle="sectionTitle"
      v-bind:sectionDescription="sectionDescription"
      customPaddingStyle="0 6px"
      customMarginStyle="6px 0"
      v-bind:highlight="true"/>
    <perfect-scrollbar
      v-bind:style="{
        height: ((sectionTitle)?'calc(100% - 36px)':'100%')
      }"
      class="scroll-area">
      <div
        id="content"
        v-bind:style="customPadding">
        <slot></slot>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import SectionHeader from './section-header.vue'

export default {
  props: {
    customPaddingStyle: { default: '' },
    sectionTitle: { default: '' },
    sectionDescription: { default: '' },
    noBkg: { default: false },
  },
  components: {
    SectionHeader,
  },
  data () {
    return {
      customHeight: 'height: 0',
      headerHeight: 132,
      customPadding: 'padding: 0 12px 40px 12px',
    }
  },
  created () {
    this.setcustomHeight()
    this.setCustomPaddingStyle()
  },
  methods: {
    setcustomHeight () {
      let height = window.innerHeight - this.headerHeight
      this.customHeight = `height: ${ height }px;`
    },
    setCustomPaddingStyle () {
      if (this.customPaddingStyle)
        this.customPadding = `padding: ${ this.customPaddingStyle };`
    },
  },
}
</script>

<style scoped lang="css">
#box-wrapper {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  box-shadow: var(--main-box-shadow);
  margin: 0 6px;
  position: relative;
  transition-duration: 500ms;
}

#content {
  padding: 10px;
  position: relative;
}

#box-wrapper.no-box-bkg {
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
  padding: 0;
}
</style>

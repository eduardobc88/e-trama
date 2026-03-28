<template>
  <div
    id="section-header"
    v-bind:class="{
      top: isTop,
      highlight: highlight,
      division: isDivision,
      expanded: expanded,
    }">
    <p>
      <i
        v-if="sectionIcon"
        id="icon"
        class="material-symbols-rounded icon">
        {{ sectionIcon }}
      </i>
      {{ $t(sectionTitle) }}
    </p>
    <p>
      {{ $t(sectionDescription) }}
    </p>
    <LoadingBar
      v-bind:isLoading="isLoading"
      v-bind:isFull="true"/>
  </div>
</template>

<script>
import LoadingBar from './loading-bar.vue'


export default {
  props: {
    sectionTitle: {
      type: String,
      default: '',
    },
    sectionDescription: {
      type: String,
      default: '',
    },
    isTop: {
      type: Boolean,
      default: false,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    isDivision: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    sectionIcon: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    LoadingBar,
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  },
}
</script>

<style scoped lang="css">

#icon {
  font-size: 24px;
  display: flex;
  align-self: center;
  margin: 0 6px 0 0;
}

#section-header {
  border-radius: 10px;
  margin: 0;
  overflow: hidden;
  padding: 10px;
  position: relative;
}

#section-header.expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

#section-header.division {
  padding: 6px 0;
}

#section-header.highlight {
  background-color: var(--main-box-bg-color);
}

#section-header.highlight:before {
  content: "";
  height: calc(100% + 12px);
  left: 0;
  position: absolute;
  top: -6px;
  width: 100%;
}

#section-header.top {
  margin: 0;
}

#section-header p {
  position: relative;
}

#section-header p:first-child {
  align-self: center;
  color: var(--main-accent-color);
  display: flex;
  flex-grow: 1;
  font-size: calc(var(--main-accent-font-size) + 4px);
  font-weight: 600;
  letter-spacing: .8px;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  z-index: 1;
}

#section-header p:nth-child(2) {
  color: var(--main-secondary-text-color);
  font-size: var(--main-accent-font-size);
  font-weight: 600;
  line-height: 1;
  margin: 0;
  position: relative;
  text-transform: uppercase;
  width: 100%;
  z-index: 1;
}
</style>

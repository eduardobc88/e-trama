<template>
  <div
    id="wrapper"
    v-bind:style="{
      'width': width,
      'max-width': maxWidth,
    }"
    v-bind:class="{
      center: alignSelfCenter,
      'card': isCard,
      'full-width': fullWidth,
    }">
    <div
      id="box-content-wrapper"
      v-bind:class="{
        'box-shadow': !hideMinBtn,
        'flat': isFlat,
      }">
      <div
        id="box-wrapper"
        v-bind:class="{
          embeded: isEmbeded,
          'no-expanded': !isExpanded,
          'box-shadow': hideMinBtn,
        }">
        <div
          id="box-header">
          <SectionHeader
            v-if="sectionTitle"
            v-bind:sectionIcon="sectionIcon"
            v-bind:sectionTitle="sectionTitle"
            v-bind:sectionDescription="sectionDescription"
            v-bind:highlight="!hideMinBtn"
            v-bind:expanded="isExpanded"
            v-bind:isLoading="isLoading"/>
          <div
            v-if="!hideMinBtn"
            id="btn-wrapper">
            <ButtonIcon
              v-bind:buttonIcon="((isExpanded)?'expand_less':'expand_more')"
              v-bind:buttonAction="onClick"/>
          </div>
        </div>
        <template v-if="hideMinBtn">
          <div
            id="content"
            v-bind:class="((noPadding)?'no-padding':'')"
            v-bind:style="{
              'min-height': minHeight,
              'max-height': maxHeight,
              'height': ((isExpanded)?'auto':'0'),
            }">
            <slot></slot>
          </div>
        </template>
        <template v-if="!hideMinBtn">
          <div
            v-bind:style="{
              height: ((isExpanded)?'auto':((sectionTitle)?'0':'100%')),
              overflow: ((isExpanded)?'inherit':'hidden'),
            }">
            <div
              id="content"
              v-bind:style="{
                'min-height': minHeight,
                'max-height': maxHeight,
                'height': ((isExpanded)?'auto':'0'),
              }">
              <slot></slot>
            </div>
            <!-- <template
              v-if="modelError !== undefined && !!Object.keys(modelError.errors).length">
              <div
                id="errors-model"
                v-bind:style="{
                  height: '200px',
                }"
                v-bind:class="{
                  errors: !!Object.keys(modelError.errors).length,
                }">
                <div
                  id="errors"
                  v-if="modelError !== undefined && Object.keys(modelError.errors).length">
                  <template
                    v-for="(error, key) of modelError.errors">
                    <div
                      v-if="error !== ''"
                      class="item">
                      {{ key.replaceAll('_', ' ') }}: {{ error }}
                    </div>
                  </template>
                </div>
              </div>
            </template> -->
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SectionHeader from './section-header.vue'
import ButtonIcon from './button-icon.vue'


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
    minHeight: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: String,
      default: '',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    alignSelfCenter: {
      type: Boolean,
      default: false,
    },
    hideMinBtn: {
      type: Boolean,
      default: false,
    },
    isEmbeded: {
      type: Boolean,
      default: false,
    },
    onlyWrapper: {
      type: Boolean,
      default: false,
    },
    modelError: {
      type: Object,
      default: {},
    },
    sectionIcon: {
      type: String,
      default: '',
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
    isCard: {
      type: Boolean,
      default: false,
    },
    isFlat: {
      type: Boolean,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ButtonIcon,
    SectionHeader,
  },
  data () {
    return {
      isExpanded: true,
    }
  },
  created () {
  },
  methods: {
    onClick () {
      this.isExpanded = !this.isExpanded
    },
  },
}
</script>

<style scoped lang="css">

#wrapper {
  position: relative;
  max-width: 480px;
}

#wrapper.full-width {
  max-width: 100%;
}

#box-content-wrapper.flat #box-wrapper {
  box-shadow: none;
  border: none;
}

#wrapper.center {
  align-self: center;
}

#box-wrapper {
  background-color: var(--main-box-bg-color);
  border-radius: 10px;
  border: var(--main-border);
  box-shadow: var(--main-box-shadow);
  margin: 0;
  position: relative;
  transition-duration: 100ms;
}

#box-wrapper.no-expanded {
  overflow: hidden;
}

#box-wrapper.embeded {
  box-shadow: none;
  background-color: transparent;
}

#content {
  padding: 10px;
  position: static;
}

#content.no-padding {
  padding: 10px;
}

#btn-wrapper {
  position: absolute;
  top: 11px;
  right: 10px;
  z-index: 3;
}

#errors-model {
  background-color: var(--main-box-bg-color);
  position: relative;
  width: 100%;
}

#errors-model.errors {
  background-color: #ffefef;
}

#errors {
  padding: 10px;
}

#errors .item {
  color: var(--main-color-error);
  font-size: var(--main-font-size);
  text-transform: uppercase;
  font-weight: 600;
}

.card {
  width: 100%;
  max-width: 480px;
}

</style>

<template>
  <div id="file-wrapper">
      <div
        id="shape"
        v-if="id !== undefined && id !== 0"
        v-bind:style="getFileImageURL()">
      </div>
      <div
        id="shape"
        v-if="id !== undefined && id !== 0"
        v-bind:style="getColor(false, 50, 75, 100)">
        <span
          id="letter"
          v-bind:style="{
            'font-size': letterSize,
            color: getColor(true, 75, 25, 100),
          }">
          {{ getFileFirstLetter() }}
        </span>
      </div>
      <div
        id="shape"
        v-if="!id">
        <span
          id="empty-icon"
          v-bind:style="getColor(false, 50, 75, 100)">
          <transition name="bounce">
            <template>
              <span
                v-if="letter !== undefined && letter !== ''"
                id="letter"
                v-bind:style="{
                  'font-size': letterSize,
                  'color': '#ffffff',
                  'font-weight': weight,
                }">
                {{ getLetter() }}
              </span>
              <span
                v-if="!letter"
                class="material-symbols-rounded"
                v-bind:style="{
                  'font-size': iconSize,
                  'font-weight': weight,
                }">
                insert_drive_file
              </span>
            </template>
          </transition>
        </span>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { default: 0 },
    letter: { default: '' },
    iconSize: { default: '' },
    letterSize: { default: '' },
    weight: { default: '' },
    size: { default: '' },
  },
  data () {
    return {
      file: new this.$model.FileMC.model(),
    }
  },
  watch: {
    'id' (newVal, oldVal) {
      if (newVal !== oldVal)
        this.setup()
    },
  },
  created () {
    this.setup()
  },
  methods: {
    setup () {
      this.file.clear()
      if (this.id !== undefined && this.id !== null && this.id !== 0) {
        this.file.set('id', this.id)
        this.getData()
      }
    },
    async getData () {
      try {
        await this.file.fetch()
      } catch (err) {
        console.error(err)
      }
    },
    getFileImageURL () {
      let fileURL = this.file.getPreviewURL(this.size)
      let style = ''
      style += `background-image: url('${ fileURL }');`
      style += 'background-size: cover;'
      style += 'background-position: center;'
      return style
    },
    getFileFirstLetter () {
      if (!this.file.get('file_title'))
        return  '-'

      return this.file.get('file_title')[0]
    },
    getLetter () {
      return this.letter[0]
    },
    getColor (plain, l, s, opacity) {
      return this.$getHexColor(this.letter, plain, l, s, opacity)
    },
  },
}
</script>

<style scoped lang="css">

#file-wrapper {
  width: 100%;
  height: 100%;
}

#shape {
  display: flex;
  width: 100%;
  height: 100%;
}

#empty-icon,
#letter {
  margin: auto;
}

#empty-icon {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: var(--main-division-color);
}

#empty-icon > span {
  color: var(--main-text-color);
  margin: auto;
}

#letter {
  color: var(--main-text-color);
  font-weight: 100;
  text-transform: uppercase;
}

</style>

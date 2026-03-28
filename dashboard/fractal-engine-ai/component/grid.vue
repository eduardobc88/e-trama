<template lang="html">
  <div
    v-bind:class="{
      grid: true,
      center: justifyCenter,
      'grid-1': ((slots.length === 1)?true:false),
      'grid-2': ((slots.length === 2)?true:false),
      'grid-3': ((slots.length === 3)?true:false),
      'grid-4': ((slots.length === 4)?true:false),
    }">
    <slot v-for="(slotName, slotIndex) in slots" v-bind:name="slotName"></slot>
  </div>
</template>

<script>

// NOTE: example
// <Grid>
//   <template slot="localization one">
//     <h1>Slot content one</h1>
//   </template>
//   <template slot="classification two">
//     <h1>Slot content two</h1>
//   </template>
//   <template slot="financial three">
//     <h1>Slot content three</h1>
//   </template>
//   <template slot="address four">
//     <h1>Slot content four</h1>
//   </template>
// </Grid>

export default {
  props: {
    justifyCenter: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      slots: [],
    }
  },
  mounted () {
    this.slots = Object.keys(this.$slots)
  },
}
</script>

<style scoped lang="css">

.grid {
  column-gap: 12px;
  row-gap: 12px;
}

.grid.center {
  justify-items: center;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 4)), 1fr));
  justify-content: space-between;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 3)), 1fr));
  justify-content: space-between;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 2)), 1fr));
  justify-content: space-between;
}

.grid-1 {
  display: grid;
  grid-template-columns: 100%;
  justify-content: space-between;
}

.content {
  position: relative;
}

@media screen and (max-width: 1200px) {
  .grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 4)), 1fr));
  }

  .grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 3)), 1fr));
  }

  .grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 2)), 1fr));
  }
}


@media screen and (max-width: 1080px) {
  .grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 3)), 1fr));
  }

  .grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 2)), 1fr));
  }

  .grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 1)), 1fr));
  }
}

@media screen and (max-width: 720px) {
  .grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 3)), 1fr));
  }

  .grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 2)), 1fr));
  }

  .grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(100% / 1)), 1fr));
  }
}

@media screen and (max-width: 600px) {
  .grid-4 {
    grid-template-columns: 100%;
  }

  .grid-3 {
    grid-template-columns: 100%;
  }

  .grid-2 {
    grid-template-columns: 100%;
  }
}


</style>

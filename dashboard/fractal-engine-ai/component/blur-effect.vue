<template lang="html">
  <div class="blur-effect">
    <div></div>
    <div></div>
  </div>
</template>

<style scoped lang="css">
.blur-effect {
  background-color: var(--main-box-bg-color-op);
  height: 100%;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;
}

.blur-effect div {
  backdrop-filter: blur(8px);
  bottom: 0;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-backdrop-filter: blur(8px);
  z-index: 1;
}

.blur-effect div:first-child {
  //top: -6px;
}

.blur-effect div:last-child {
  //bottom: -6px;
}

</style>

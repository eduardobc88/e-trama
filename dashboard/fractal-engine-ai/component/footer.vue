<template>
  <div id="footer-wrapper">
    <slot></slot>
  </div>
</template>

<style scoped lang="css">
#footer-wrapper {
  bottom: 22px;
  box-sizing: border-box;
  display: flex;
  position: absolute;
  right: 16px;
  z-index: 1;
}

#footer-wrapper > div {
  margin-left: 4px;
}

#footer-wrapper > div:first-child {
  margin-left: 0;
}

.data {
  align-self: center;
  color: var(--main-text-color);
  display: flex;
  font-size: var(--main-accent-font-size);
  font-weight: 500;
  margin: 4px;
}

</style>
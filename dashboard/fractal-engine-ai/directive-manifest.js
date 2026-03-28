import CONFIG_MANIFEST from './config-manifest.js'


const GLOBAL_DIRECTIVES = [
  {
    name: 'click-outside',
    actions: {
      mounted: function (el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
          if (!(el == event.target || el.contains(event.target))) {
            binding.value(event, el)
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted: function (el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      },
    }
  },
  {
    name: 'window-resize',
    actions: {
      mounted: function (el, binding, vnode) {
        el.__vueResize__ = CONFIG_MANIFEST.app.config.globalProperties.$_.throttle(binding.value, 500)
        window.addEventListener('resize', el.__vueResize__)
      },
      unmounted: function (el) {
        window.removeEventListener('resize', el.__vueResize__)
        el.__vueResize__ = null
      },
    },
  },
]

export default GLOBAL_DIRECTIVES

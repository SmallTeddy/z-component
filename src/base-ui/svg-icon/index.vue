<template>
  <svg :class="svgClass">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
import { defineComponent, computed } from "vue";
export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    return {
      iconName: computed(() => `#icon-${props.icon}`),
      svgClass: computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`;
        }
        return "svg-icon";
      }),
    };
  },
});
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  position: relative;
  display: inline-block;
  margin-right: 12px;
  font-size: 15px;
}

.svg-icon {
  position: relative;
  width: 1em;
  height: 1em;
  fill: currentcolor;
  vertical-align: -2px;
}
</style>

<template>
  <div>
    <img :src="propValue">
  </div>
</template>

<script lang="ts">
export default {
  props: {
    propValue: {
      type: String,
      require: true,
      default:'',
    },
  },
}
</script>

<style lang="scss" scoped>
img {
    width: 100%;
    height: 100%;
}
</style>
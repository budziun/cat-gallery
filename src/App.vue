<template>
  <div id="app">
    <CatGallery />
  </div>
</template>

<script>
import CatGallery from './CatGalery.vue'

export default {
  name: 'App',
  components: {
    CatGallery
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>

<template>
  <div id="app">
    <div class="toolbar">Toolbar</div>
    <div class="sidebar">Sidebar</div>
    <router-view></router-view>
  </div>
</template>

<script>
require('@/assets/semantic/dist/semantic.min.css')


window.$ = window.jQuery = require('jquery')
require('@/assets/semantic/dist/semantic.min.js')
export default {
  name: 'App'
}
</script>

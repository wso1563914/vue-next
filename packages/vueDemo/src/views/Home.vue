<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <Custom :pageSize="2"></Custom> -->
    <ArticalAction></ArticalAction>
  </div>
</template>

<script>
// import Custom from '@/views/custom.vue'
import ArticalAction from '@/views/articalAction'

export default {
  name: 'Home',
  components: {
    ArticalAction
  },
  data() {
    return {
      ab: true
    }
  },
}
</script>

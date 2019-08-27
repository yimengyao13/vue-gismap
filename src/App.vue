<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <vheader />
      </el-header>
      <el-container>
        <el-main class="el-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from '@/components/Header'

export default {
  name: 'app',
  components: {
    'vheader': Header
  }
}

</script>
<style>
.header {
  background-color: #c00000;
  color: #fff;
  line-height: 60px;
  height: 1000px;
}
.el-main {
  padding: 0px;
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
  height: 100vh;
}
/*更改全局的滚动条样式*/
/*非标准，注释掉*/
/*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #fff;
}

::-webkit-scrollbar-thumb {
  // border-radius:5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: rgba(0, 0, 0, .1)
}*/
</style>

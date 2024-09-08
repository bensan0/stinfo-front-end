<template>
  <div class="left-panel">
    <div class="top">
      人恐我貪
      <!-- <img :src="getAssets('images/stareofdora.jpeg')" class="pic" /> -->
       <img :src="stareofdora" class="pic" />
    </div>
    <div class="center">
      <nav>
        <p><router-link to="/main">主頁</router-link></p>
        <p><router-link to="/real-time">即時頁</router-link></p>
        <p><router-link to="/me">我的頁面</router-link></p>
      </nav>
    </div>
    <br>
    <div class="bottom">
      <div><p class="bold-text">用戶: {{ username }}</p></div>
      <button @click="handleLogout" class="button">登出</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { logout } from '@/utils/AuthUtils';
import { useRouter } from 'vue-router';
import stareofdora from '@/assets/images/stareofdora.jpeg';

export default {
  name: 'SideBar',
  setup() {
    const router = useRouter()

    const username = ref(localStorage.getItem('username'))

    function getAssets(file) {
      return new URL(`../assets/${file}`, import.meta.url).href;
    }

    function handleLogout() {
      logout()
      router.push('/login')
    }

    return {
      handleLogout,
      getAssets,
      stareofdora,
      username
    }
  }
}
</script>

<style scoped>
.left-panel {
  height: 100vh;
  width: 100%;
  /*使用 100% 寬度，實際寬度將由父元素控制*/
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
  /* 添加一些上下內邊距 */
  align-items: center;
  bottom: 0;
}

.top{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.center {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.bottom {
  /* margin-top: auto; */
  /* 將底部元素推到面板底部 */
  padding: 0 10px;
  /* 添加一些左右內邊距 */
  align-items: center
}

nav {
  text-align: center;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  display: block;
  margin-bottom: 15px;
  /* 增加連結之間的間距 */
  text-decoration: none;
  /* 移除下劃線 */
}

nav a.router-link-exact-active {
  color: #42b983;
}

.button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  /* 添加背景顏色 */
  color: white;
  /* 文字顏色設為白色 */
  border: none;
  /* 移除邊框 */
  cursor: pointer;
  /* 滑鼠懸停時顯示指針 */
}

.button:hover {
  background-color: #3aa876;
  /* 滑鼠懸停時的顏色 */
}

.pic{
  width: 70%;
}

.bold-text{
  font-weight: bold;
}
</style>
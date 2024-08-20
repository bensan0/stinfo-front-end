<template>
    <div class="container">
        <div class="middle">
            <input type="text" placeholder="帳號" v-model="username">
            <input type="password" placeholder="密碼" v-model="password">
            <div class="button - group">
                <button @click="handleLogin">登入</button>
                <button @click="clear">清除</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { login } from '@/utils/AuthUtils';

export default {
    name: 'LoginPage',
    setup() {

        const router = useRouter()
        const username = ref(null)
        const password = ref(null)

        async function handleLogin() {
            try {
                const response = await login(username.value, password.value)
            
                if (response.data.status === '200' && response.data.data !== null) {
                    localStorage.setItem('token', response.data.data)
                    router.push("/main")
                } else {
                    alert(response.data.msg)
                }
            } catch (error) {
                console.log('login error: ' + error)
                alert('登入失敗, 服務不可用')
                return
            }
        }

        function clear() {
            username.value = null
            password.value = null
        }

        return {
            username,
            password,
            handleLogin,
            clear
        }
    }
}
</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}

.middle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

input {
    width: 200px;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.button-group {
    display: flex;
    gap: 10px;
}

button {
    padding: 10px 20px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    /* border: none; */
    border-radius: 4px;
}

button:hover {
    background-color: #45a049;
}
</style>
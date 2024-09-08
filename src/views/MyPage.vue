<template>
    <div class="main-container">
        <SideBar class="sidebar" />
        <div class="content">
            <div class="changePass-container">
                <div>變更密碼</div>
                <div>現在密碼: <input type="password" v-model="nowPassword" /></div>
                <div>新密碼: <input type="password" v-model="newPassword" /></div>
                <button @click="changePassword" class="button">變更</button>
            </div>
        </div>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import { reactive, ref, toRefs, onBeforeMount, watchEffect, onUnmounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: 'MyPage',
    components: {
        SideBar
    },
    setup() {
        const router = useRouter()

        const nowPassword = ref(null)

        const newPassword = ref(null)

        async function changePassword() {
            try {
                let apiUrl = import.meta.env.VITE_STINFO_BACKEND_API_URL
                const response = await axios.post(
                    `${apiUrl}/gw/auth/sign/change-password`,
                    {
                        nowPassword: nowPassword.value,
                        newPassword: newPassword.value,
                        username: localStorage.getItem('username')
                    }
                );

                if (response.data.status === '200') {
                    localStorage.removeItem('token')
                    router.push('/login')
                } else {
                    alert(response.data.msg)
                }
            } catch (error) {
                alert(error.message)
            }

        }

        return {
            nowPassword,
            newPassword,
            changePassword
        }
    }
}
</script>

<style scoped>
.main-container {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 10%;
    /* 設置側邊欄寬度為螢幕的十分之一 */
    background-color: gray;
    /* 添加背景色以區分側邊欄 */
}

.content {
    width: 90%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    /* 添加間距 */
    align-items: center;
    justify-content: center;
}

.changePass-container {
    background-color: antiquewhite;
    flex-direction: column;
    align-items: center;
}
</style>
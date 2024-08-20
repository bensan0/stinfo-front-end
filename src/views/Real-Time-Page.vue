<template>
    <div class="main-container">
        <SideBar class="sidebar" />
        <div class="content">
            <div class="inputs-container">
                <div class="input">
                    交易量(張)
                    <input type="number" v-model="tradingVolumePieceStart">
                </div>

                <div class="input">
                    漲跌幅(%)
                    <input type="number" v-model="priceGapPercent">
                </div>
            </div>

            <div class="tag-container">
                標籤
                <div class="tag-panel">
                    <div v-for="tag in tags" :key="tag" class="tag-item">
                        <input type="checkbox" :value="tag" v-model="selectedTags"> {{ tag }} </input>
                    </div>
                </div>
            </div>

            <div class="last-container">
                <button @click="submit">查詢</button>
            </div>

            <div class="table-container">
                <table v-if="tableData.length">
                    <thead>
                        <tr>
                            <th>股票代碼</th>
                            <th>股票名稱</th>
                            <th>價格</th>
                            <th>差額</th>
                            <th>漲跌幅</th>
                            <th>交易量</th>
                            <th>標籤</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in tableData" :key="item.stockId">
                            <td :class="[{ redfont: item.priceGap > 0, greenfont: item.priceGap < 0 },'small-text']">{{ item.stockId }}</td>
                            <td :class="[{ redfont: item.priceGap > 0, greenfont: item.priceGap < 0 },'small-text']">{{ item.stockName }}</td>
                            <td>{{ item.todayClosingPrice }}</td>
                            <td :class="[{ redfont: item.priceGap > 0, greenfont: item.priceGap < 0 },'small-text']">{{ item.priceGap }}</td>
                            <td :class="[{ redfont: item.priceGapPercent > 0, greenfont: item.priceGapPercent < 0 },'small-text']">{{ item.priceGapPercent }}</td>
                            <td>{{ item.todayTradingVolumePiece }}</td>
                            <td>{{ item.tags }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue';
import { reactive, ref, toRefs, onBeforeMount } from 'vue';
import axios from 'axios';

export default {
    name: 'SidePage',
    components: {
        SideBar
    },
    setup() {
        const tags = ref([])
        const tableData = ref([])
        const selectedTags = ref([])

        const formData = reactive({
            tradingVolumePieceStart: null,
            priceGapPercent: null,
            selectedTags: []
        })

        async function submit() {
            try {
                const response = await axios.post('http://localhost:8999/gw/stock/v1/stock/condition/real-time/list', formData);
                if (response.data.data.status === '200') {
                    tableData.value = response.data.data.list
                } else {
                    console.error('Invalid response:', response.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        onBeforeMount(async () => {
            try {
                const response = await axios.get('http://localhost:8999/gw/report/util/tags', { timeout: 2000 });
                if (response.data.status === '200' && response.data.data !== null) {
                    tags.value = response.data.data;
                } else {
                    alert(response.data.msg)
                }
            } catch (error) {
                alert('服務暫時不可用，請稍後再試。')
            }
        })

        return {
            tags,
            tableData,
            selectedTags,
            ...toRefs(formData),
            submit
        }
    }
}
</script>

<style scoped>
.main-container {
    display: flex;
    height: 100vh;
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
}

.inputs-container,
.tag-container,
.last-container {
    width: 100%;
}

.inputs-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
}

.input {
    justify-content: flex-start
}

.tag-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* background-color: blue; */
}

.tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    /* background-color: red; */
}

.tag-item {
    width: calc(20% - 10px);
    font-size: x-small;
    /* 每行5個，考慮間距 */
}

.last-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

button {
    padding: 5px 10px;
}

.redfont {
    color: red;
}

.greenfont {
    color: green;
}

.small-text {
    font-size: x-small;
}
</style>
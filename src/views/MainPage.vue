<template>
    <div class="main-container">
        <SideBar class="sidebar" />
        <div class="content">
            <div class="dashbord">
                <div class="inputs-container">
                    <div class="input">
                        交易量(張)
                        <input type="number" v-model="tradingVolumePieceStart"> ~
                        <input type="number" v-model="tradingVolumePieceEnd">
                    </div>

                    <div class="input">
                        漲跌幅(%)
                        <input type="number" v-model="priceGapPercent">
                    </div>
                </div>
                <div class="dashbord-item" v-if="listed !== null">
                    加權指數
                    <span>日期:{{ listed.date }}</span>
                    <span>成交:{{ listed.todayClosing }}</span>
                    <span>昨日成交:{{ listed.yesterdayClosing }}</span>
                    <span :class="{ redfont: listed.gap > 0, greenfont: listed.gap < 0 }">漲跌:{{ listed.gap }}</span>
                    <span :class="{ redfont: listed.gapPercent > 0, greenfont: listed.gapPercent < 0 }">漲跌幅:{{
                        listed.gapPercent }}%</span>
                    <span>開盤:{{ listed.opening }}</span>
                    <span>最高:{{ listed.highest }}</span>
                    <span>最低:{{ listed.lowest }}</span>
                    <span>成交量:{{ listed.todayTradingVolume }}</span>
                    <span>成交金額:{{ formatAmount(listed.todayTradingAmount) }}</span>
                </div>
                <div class="dashbord-item" v-if="otc !== null">
                    櫃買指數
                    <span>日期:{{ otc.date }}</span>
                    <span>成交:{{ otc.todayClosing }}</span>
                    <span>昨日成交:{{ otc.yesterdayClosing }}</span>
                    <span :class="{ redfont: otc.gap > 0, greenfont: otc.gap < 0 }">漲跌:{{ otc.gap }}</span>
                    <span :class="{ redfont: otc.gapPercent > 0, greenfont: otc.gapPercent < 0 }">漲跌幅:{{ otc.gapPercent
                        }}%</span>
                    <span>開盤:{{ otc.opening }}</span>
                    <span>最高:{{ otc.highest }}</span>
                    <span>最低:{{ otc.lowest }}</span>
                    <span>成交量:{{ otc.todayTradingVolume }}</span>
                    <span>成交金額:{{ formatAmount(otc.todayTradingAmount) }}</span>
                </div>
            </div>


            <div class="tag-container">
                標籤
                <div class="tag-panel">
                    <div v-for="tag in tags" :key="tag" class="tag-item">
                        <input type="checkbox" :value="tag" v-model="extraTags"> {{ tag }} </input>
                    </div>
                </div>
            </div>

            <div class="last-container">
                <button @click="submit">查詢</button>
                <select v-model="pageSize" @change="submit">
                    <option :value="10">10條/页</option>
                    <option :value="30">30條/页</option>
                    <option :value="50">50條/页</option>
                </select>

            </div>
            <br>

            <div class="table-container">
                <table v-if="tableData.length">
                    <thead>
                        <tr>
                            <th>代碼</th>
                            <th>名稱</th>
                            <th>日期</th>
                            <th>收盤</th>
                            <th>昨收</th>
                            <th>價差</th>
                            <th>張跌幅</th>
                            <th>成交量</th>
                            <th>昨成交量</th>
                            <th>交易額</th>
                            <th>昨交易額</th>
                            <th>標籤</th>
                            <th>histock</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in tableData" :key="item.stockId">
                            <td :class="[{ redfont: item.priceGap > 0, greenfont: item.priceGap < 0 }, 'small-text']">{{
                                item.stockId }}</td>
                            <td :class="[{ redfont: item.priceGap > 0, greenfont: item.priceGap < 0 }, 'small-text']">{{
                                item.stockName }}</td>
                            <td>{{ item.date }}</td>
                            <td>{{ item.todayClosingPrice }}</td>
                            <td>{{ item.yesterdayClosingPrice }}</td>
                            <td :class="[{ redfont: item.priceGap > 0, greenfont: item.priceGap < 0 }, 'small-text']">{{
                                item.priceGap }}</td>
                            <td
                                :class="[{ redfont: item.priceGapPercent > 0, greenfont: item.priceGapPercent < 0 }, 'small-text']">
                                {{ item.priceGapPercent }}</td>
                            <td
                                :class="{ redfont: item.todayTradingVolumePiece > item.yesterdayTradingVolumePiece, greenfont: item.todayTradingVolumePiece < item.yesterdayTradingVolumePiece }">
                                {{ item.todayTradingVolumePiece }}</td>
                            <td>{{ item.yesterdayTradingVolumePiece }}</td>
                            <td
                                :class="{ redfont: item.todayTradingVolumeMoney > item.yesterdayTradingVolumeMoney, greenfont: item.todayTradingVolumeMoney < item.yesterdayTradingVolumeMoney }">
                                {{
                                    formatAmount(item.todayTradingVolumeMoney) }}</td>
                            <td>{{ formatAmount(item.yesterdayTradingVolumeMoney) }}</td>
                            <td>{{ item.tags.extraTags }}</td>
                            <td>
                                <a :href="genHistockLink(item.stockId)" target="_blank">
                                    其他資訊
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="totalPage > 0" class="pagination">
                <button @click="changePage(prePage)" :disabled="currentPage === 1">上一页</button>
                <button v-for="page in displayedPages" :key="page" @click="changePage(page)"
                    :class="{ active: page === currentPage }">
                    {{ page }}
                </button>
                <button @click="changePage(nextPage)" :disabled="currentPage === totalPage">下一页</button>
            </div>
        </div>
    </div>

</template>


<script>
import SideBar from '@/components/SideBar.vue';
import { reactive, ref, toRefs, onBeforeMount, watchEffect, onUnmounted } from 'vue';
import axios from 'axios';

export default {
    name: 'MainPage',
    components: {
        SideBar
    },
    setup() {
        const tags = ref([])

        const formData = reactive({
            tradingVolumePieceStart: null,
            tradingVolumePieceEnd: null,
            priceGapPercent: null,
            extraTags: []
        })

        const tableData = ref([])
        const prePage = ref(1)
        const currentPage = ref(1)
        const nextPage = ref(1)
        const totalPage = ref(0)
        const pageSize = ref(10)
        const displayedPages = ref([])
        const otc = ref(null)
        const listed = ref(null)
        const apiUrl = ref(import.meta.env.VITE_STINFO_BACKEND_API_URL)

        function changePage(page) {
            if (page >= 1 && page <= totalPage.value) {
                currentPage.value = page;
                submit();
            }
        }

        async function submit() {
            try {
                const response = await axios.post(`${apiUrl.value}/gw/stock/v1/stock/condition/list?current=${currentPage.value}&size=${pageSize.value}`, formData);
                if (response.data.status === '200') {
                    tableData.value = response.data.data.list
                    for (let data of tableData.value) {
                        data.tags = JSON.parse(data.tags)
                    }
                    prePage.value = response.data.data.prePage
                    currentPage.value = response.data.data.pageNum
                    nextPage.value = response.data.data.nextPage
                    totalPage.value = response.data.data.pages;
                    displayedPages.value = response.data.data.navigatepageNums
                } else {
                    console.error('Invalid response:', response.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        function formatAmount(amount) {
            const units = ['', '萬', '億', '兆'];
            let result = '';
            let unitIndex = 0;

            while (amount > 0) {
                let part = amount % 10000;
                if (part === 0) {
                    part = ''
                }
                amount = Math.floor(amount / 10000);

                if (part > 0 || unitIndex === 0) {
                    result = part + units[unitIndex] + result;
                }

                unitIndex++;
            }

            return result;
        }

        function genHistockLink(stockId) {

            return 'https://histock.tw/stock/' + stockId

        }

        async function getIndex() {
            const index = await axios.get(`${apiUrl.value}/gw/stock/v1/stock/index/latest`)
            if (index.data.status === '200' && index.data.data !== null) {
                if (index.data.data[0].indexName === '加權指數') {
                    listed.value = index.data.data[0]
                    otc.value = index.data.data[1]
                } else {
                    listed.value = index.data.data[1]
                    otc.value = index.data.data[0]
                }
            }
        }

        onBeforeMount(async () => {
            try {
                const response = await axios.get(`${apiUrl.value}/gw/report/util/tags`);
                if (response.data.status === '200' && response.data.data !== null) {
                    tags.value = response.data.data;
                } else {
                    alert(response.data.msg)
                }

                getIndex()

            } catch (error) {
                alert('服務暫時不可用，請稍後再試。')
            }
        })

        let intervalId;

        watchEffect(() => {
            intervalId = setInterval(getIndex, 30000);
        });

        onUnmounted(() => {
            clearInterval(intervalId);
        });

        return {
            tags,
            ...toRefs(formData),
            submit,
            tableData,
            prePage,
            currentPage,
            nextPage,
            totalPage,
            pageSize,
            displayedPages,
            changePage,
            formatAmount,
            genHistockLink,
            listed,
            otc
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
}

.dashbord {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.dashbord-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    /* border: solid; */
    background-color: antiquewhite;
}

.inputs-container {
    /* width: 50%; */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    background-color: antiquewhite;
}

.input {
    justify-content: flex-start
}

.tag-container,
.last-container {
    width: 100%;
}

.tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    background-color: antiquewhite;
}

.tag-item {
    /* width: calc(20% - 10px); */
    font-size: x-small;
    /* 每行5個，考慮間距 */
}

.last-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* .table-container {
    flex-grow: 1;
    overflow-y: auto;
    // 如果表格太長，允許滾動 
} */

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

.pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
}

button,
select {
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

.active {
    text-decoration: underline;
    font-weight: bold;
    color: blue;
}
</style>
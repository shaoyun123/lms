/**sort通道模块 */
var sortAreaTemplate = `
    <div class="planSort" v-if="sortAreaShow">
        <table  v-if="regiondata">
            <tr v-for="(tr, tri) in regiondata" :key="tri">
               <td v-for="(item,tdi) in tr" :key="tdi">
                    <ul>
                        <li
                            :key="item.regionId"
                            @click="getRegionShelvesHandle(item.regionId,item.floorX,item.floorY,item.regionCode)"
                            ref="regionLi"
                            :data-li="item.regionId"
                            v-loading.fullscreen.lock="liLoading"
                            element-loading-text="拼命加载中"
                            element-loading-spinner="el-icon-loading"
                            element-loading-background="rgbaColor"
                            v-if="item.regionId">
                             {{ item.regionCode }}
                             ({{ item.floorX }},{{item.floorY}})
                        </li>
                    </ul>
               </td>
            </tr>
        </table>
        <div style="padding:20px;font-size:20px" v-else>
           该楼层暂无通道...
        </div>
    </div>
`

var SortArea = {
    template: sortAreaTemplate,
    data () {
        return {
            displayAreaShow: false,
            liLoading: false
        }
    },
    computed: {
        regiondata () {
            return this.$store.state.regionData
        },
        rgbaColor () {
            return this.$store.state.rgbaColor
        },
        sortAreaShow () {
            return this.$store.state.sortAreaShow
        }
    },
    methods: {
        getRegionShelvesHandle(val,x,y,name) { //点击对应的通道获取到通道的内容
            this.liLoading = true
            // 1.将点击的dom元素传递给货架命名函数
            var lis = this.$refs.regionLi,
                liTxt = '' //dom innerText
            lis.forEach(function(item){
                if (item.dataset.li == val) {
                    liTxt = item.innerText
                }
            })
            this.$http.post('/lms/warehouseRegion/getWarehouseRegionShelfByRegionId.html',{
                regionId: val
            },{emulateJSON:true})
            .then((res) => {
                var res = res.data
                // console.log('-----------下面是根据通道id返回的数据-----------')
                if (res.code == "0000"){
                    this.liLoading = false
                    this.$store.commit('changeDisplayAreaStatus', true) //展示通道内的货架
                    this.$store.commit('getShelvesData', res.data) //获取所有的货架数据
                    this.$store.commit('getRegionTxt', name+'('+x+','+y+')')
                    this.$store.commit('getRegionId', val)
                }else{
                    this.liLoading = false
                    this.$message({
                      message: res.msg,
                      type: 'error'
                    });
                }
            })
        }
    }
}
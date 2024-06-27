
var datavisionSearchTemplate = `
    <div class="datavisionSearch">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="仓库" :required="true">
                <el-select v-model="warehouse" placeholder="仓库" class="searchSel">
                    <el-option
                    v-for="item in warehouseArr"
                    :key="item.id"
                    :label="item.warehouseName"
                    :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="楼层" :required="true">
                <el-select v-model="floor" placeholder="楼层"  class="searchSel">
                    <el-option
                    v-for="item in floorArr"
                    :key="item.id"
                    :label="item.floor"
                    :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="通道编码" :required="true">
                <el-select v-model="regionCode" placeholder="全部" class="searchSel"  filterable multiple>
                    <el-option
                    v-for="item in regionCodeArr"
                    :key="item.regionId"
                    :label="item.regionCode"
                    :value="item.regionId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品状态">
                <el-select v-model="status" class="searchSel">
                     <el-option label="全部" value=""></el-option>
                    <el-option label="在售" value="1"></el-option>
                    <el-option label="停售" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入内容" v-model="skuInput" class="input-with-select">
                    <el-select v-model="skuSel" slot="prepend" placeholder="请选择" class="searchSku">
                        <el-option label="子SKU" value="1"></el-option>
                        <el-option label="父SKU" value="2"></el-option>
                        <el-option label="子SKU精确" value="3"></el-option>
                        <el-option label="父SKU精确" value="4"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>
            <el-form-item label="展示维度" :required="true">
                <el-select v-model="dimension" class="searchSel">
                    <el-option label="日均销量" value="WH_DAY_AVG_SALES"></el-option>
                    <el-option label="可用库存" value="WH_AVAIABLE_STOCK"></el-option>
                    <el-option label="开发时间" value="WH_DEVELOP_TIME"></el-option>
                    <el-option label="库存周转天数" value="WH_INVENTORY_TURNOVER_DAYS"></el-option>
                    <el-option label="商品状态" value="WH_PRODUCT_STATUS"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.stop="datavisionSearchHandle"
                v-loading.fullscreen.lock="searchLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(130,130,130,0.9)">搜索</el-button>
                <el-button @click.stop="resetHandle">清空</el-button>
                <el-button @click.stop="exportHandle" element-loading-background="rgba(130,130,130,0.9)">导出</el-button>
            </el-form-item>
        </el-form>
    </div>
`

var datavisionSearch = {

    template: datavisionSearchTemplate,
    data () {
        return {
            warehouse: '', // 仓库
            warehouseArr: '', //仓库数组
            floor: '', // 楼层
            floorArr: '', //楼层数组
            regionCode: [], // 区域编码
            regionCodeArr: '', //区域编码数组
            status: '', // 商品状态
            skuInput: '', // sku输入框
            skuSel: '', // sku选项
            dimension: '', // 维度
            searchLoading: false ,//loading
            datas:{
                warehouseId: "",
                floorId: "",
                configType: "",
                isSale: "",
                regionId: "",
                skuType: "",
                skus: ""
            },
        }
    },
    methods: {
        exportHandle(){ //导出功能
            //获得查询后数据
            if (!this.warehouse || !this.floor || !this.dimension) {
                this.$message({
                    message: '仓库/楼层/通道编码/维度一个都不能少!',
                    type: 'warning',
                    showClose: true
                })
                return false;
            }
            if(this.regionCode.length >10){
                this.$message({
                    message: '通道最多只允许选择10个哦!',
                    type: 'warning',
                    showClose: true
                })
                return false;
            }
            this.searchLoading = true

            axios({
                method: 'post',
                url: '/lms/warehouseData/getExportData.html',
                data: {
                    warehouseId: this.warehouse,
                    floorId: this.floor,
                    configType: this.dimension,
                    isSale: this.status,
                    regionId: this.regionCode.join(','),
                    skuType: this.skuSel,
                    skus: this.skuInput
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                responseType: 'blob'
            }).then((res) => { // 处理返回的文件流
                console.log(res);
                this.searchLoading = false;
                let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
                let url = window.URL.createObjectURL(blob)
                const link = document.createElement('a') // 创建a标签
                link.href = url
                link.download = '仓库数据'+Date.now()+'.xlsx' // 重命名文件
                link.click()
                URL.revokeObjectURL(url);
            })

        },
        warehouseRender () { //渲染仓库
            this.vueAjax('/lms/prodWarehouse/getAllProdWarehouse.html','',(res)=>{
                var res = res.data
                if (res.code == "0000" && res.data) {
                    this.warehouseArr = res.data
                }
            })
        },
        floorRender (val) { //楼层渲染
            this.vueAjax('/lms/warehouseFloor/getWarehouseFloor.html',{warehouseId: val}, (res)=>{
                var res = res.data
                if (res.code == "0000" && res.data) {
                    this.floorArr = res.data
                }
            })
        },
        regionCodeRender (val) { //区域编码渲染
            this.vueAjax('/lms/warehouseRegion/getWarehouseFloorRegion.html',{
                warehouseId: this.warehouse,
                floorId: val
            }, (res) => {
                var res = res.data
                if (res.code =="0000" &&res.data) {
                    // res.data.unshift({'regionCode': '全部', 'regionId': ''})
                    this.regionCodeArr = res.data
                }
            })
        },
        datavisionSearchHandle () { //搜索功能
            if (!this.warehouse || !this.floor || !this.dimension) {
              this.$message({
                message: '仓库/楼层/通道编码/维度一个都不能少!',
                type: 'warning',
                showClose: true
              })
              return false;
            }
            if(this.regionCode.length >10){
                this.$message({
                    message: '通道最多只允许选择10个哦!',
                    type: 'warning',
                    showClose: true
                })
                return false;
            }
            this.searchLoading = true
            this.vueAjax('/lms/warehouseData/getWarehouseLocationData.html',{
                warehouseId: this.warehouse,
                floorId: this.floor,
                configType: this.dimension,
                isSale: this.status,
                regionId: this.regionCode.join(','),
                skuType: this.skuSel,
                skus: this.skuInput
            }, (res) => {
                var res = res.data
                if (res.code="0000") {
                    this.searchLoading = false;
                    var data = this.shelvesDataHandle(res.data);
                    this.$store.commit('setRegionAndShelvesdata', data)  //把修改后的数据对象传递给区域货架显示页面
                }
            })
        },
        shelvesDataHandle (data) { //货架数据按坐标处理
           /**
            * 1.首先把区域按坐标排列(获取到最大行和列,然后进行坐标相等替换)
            * 2.把货架按坐标排列
            * 3.区域和货架的坐标相互独立
            */
            if (data) {
                for (var g=0; g<data.length; g++) {
                    var shelfdata = data[g].shelfList,
                    formatShelfdata = this.shelfCoordinateHandle(shelfdata)
                    data[g].shelfList = formatShelfdata
                }
                var floorXMax = Math.max.apply(null, data.map(function(item){
                    return item.floorX
                })),
                floorYMax = Math.max.apply(null, data.map(function(item){
                    return item.floorY
                })),
                regionCoordinateArr = [] //区域坐标数组
                for (var i=1; i <= floorXMax; i++) {
                    var trArr = []
                    for (var j=1; j <= floorYMax; j++) {
                        trArr.push({floorX: i, floorY: j})
                    }
                    regionCoordinateArr.push(trArr)
                }
                //区域坐标相等替换
                for (var k=0; k<regionCoordinateArr.length; k++) {
                    var tdArr = regionCoordinateArr[k]
                    for (var l=0; l<data.length; l++) {
                        for (var m=0; m<tdArr.length; m++) {
                            if (data[l].floorX == tdArr[m].floorX  && data[l].floorY == tdArr[m].floorY) {
                                tdArr[m] = data[l]
                            }
                        }
                       
                    }
                }
                return regionCoordinateArr
            }
        },
        shelfCoordinateHandle (data) {
            if (data) {
                var shelfXMax = Math.max.apply(null, data.map(function(item){
                    return item.regionX
                })),
                shelfYMax = Math.max.apply(null, data.map(function(item){
                    return item.regionY
                })),
                shelfCoordinateArr = [] //货架坐标数组
                for (var i=1; i<=shelfXMax; i++) {
                    var trArr = []
                    for (var j=1; j<=shelfYMax; j++) {
                        trArr.push({regionX: i, regionY: j})
                    }
                    shelfCoordinateArr.push(trArr)
                }
                //货架坐标相等替换
                for (var k=0; k<shelfCoordinateArr.length; k++) {
                    var tdArr = shelfCoordinateArr[k]
                    for (var l=0; l<data.length; l++) {
                        for (var m=0; m<tdArr.length; m++) {
                            if (data[l].regionX == tdArr[m].regionX  && data[l].regionY == tdArr[m].regionY) {
                                tdArr[m] = data[l]
                            }
                        }
                       
                    }
                }
                return shelfCoordinateArr
            }
        },
        resetHandle () { //清空选项
           this.warehouse = ''
           this.status = ''
           this.skuInput = ''
           this.skuSel = ''
           this.dimension = ''
        },
        getIntervalColorConfig (val) { //获取指标颜色配置信息
            this.vueAjax('/lms/sysIntervalColorConfig/getIntervalColorConfig.html',{
                configType: val
            }, (res) =>{
                var res = res.data
                if (res.code == '0000') {
                    if (res.data.length == 1){
                        var data = res.data[0].interval
                        this.$store.commit('setColorConfigData', data)
                    }else {
                        this.$store.commit('setColorConfigData', [])
                    }
                }
            })
        },
        vueAjax (url, params, callback) { //vue-resource简单封装
            if (!params){
                params = ''
            }
            this.$http.post(url,params,{emulateJSON:true}).then(callback)
        }
    },
    watch: {
        warehouse (val) {
            if (!val) {
                this.floor = ''
                return false
            }
            this.floor = ''
            this.floorRender(val)
        },
        floor (val) {
            if (!val) {
                this.regionCode = []
                return false
            }
            this.regionCode = []
            this.regionCodeRender(val)
        },
        dimension (val) { //切换维度显示色值对应的值
            // console.log(val)
           this.getIntervalColorConfig(val)
        }
    },
    mounted () {
       this.warehouseRender()
    }
}
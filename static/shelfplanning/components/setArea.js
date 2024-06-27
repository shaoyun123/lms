/**set通道模块 */
var setAreaTemplate = `
<div class='planSet'>
        <div class='setBox'>
          <div class="setQuery lh32">
            仓库
            <el-select v-model="warehouseVal" placeholder="必选" size='small'  @change="getWareHouseFloorData">
                <el-option
                v-for="item in warehouseArr"
                :key="item.id"
                :label="item.warehouseName"
                :value="item.id">
                </el-option>
            </el-select>
          </div>
          <div class="setQuery lh32">
            楼层
            <el-select v-model="wareHouseFloorVal" placeholder="先选仓库,必选" size='small' @change="getWarehouseFloorRegion">
                <el-option
                v-for="item in wareHouseFloorArr"
                :key="item.id"
                :label="item.floor"
                :value="item.id">
                </el-option>
            </el-select>
          </div>
          <div class="setQuery">
            <el-button 
                type="danger" 
                size="small"
                @click="setWarehouseFloorStop"
                v-loading.fullscreen.lock="searchLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgbaColor">
                停用
            </el-button>
            <el-button 
                type="primary" 
                size='small' 
                @click="getWarehouseFloorRegion"
                v-loading.fullscreen.lock="searchLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgbaColor">
                查询
            </el-button>
          </div>
        </div>
        <div class="setBox">
            <el-row :gutter="5" class="lh32">
                <el-col :span="4">楼层</el-col>
                <el-col :span="14"><div><el-input v-model="addtWarehouseFloor"  size="small"></el-input></div></el-col>
                <el-col :span="4"><div><el-button type="primary" size="small" @click="addtWarehouseFloorHandle"
                v-loading.fullscreen.lock="addFloorLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgbaColor">新增</el-button></div></el-col>
            </el-row>
        </div>
        <div class="setBox">
            <el-row :gutter="5" class="lh32">
                <el-col :span="24"><el-tag type="success" class="mb10">通道位置 </el-tag></el-col>
                <el-col :span="2">横</el-col>
                <el-col :span="10"><div><el-input v-model="positionRow"  size="small"></el-input></div></el-col>
                <el-col :span="2">竖</el-col>
                <el-col :span="10"><div><el-input v-model="positionCol"  size="small"></el-input></div></el-col>
            </el-row>
            <el-row :gutter="5" class="lh32 mt10">
                <el-col :span="8">通道编号</el-col>
                <el-col :span="10"><div><el-input v-model="regionCode"  size="small"></el-input></div></el-col>
                <el-col :span="4"><div><el-button type="primary" size="small" @click="addtWarehouseRegionHandle"
                v-loading.fullscreen.lock="addRegionLoading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgbaColor">新增</el-button></div></el-col>
            </el-row>
        </div>
    </div>`


/* 设置通道逻辑*/
var SetArea = {
        template:setAreaTemplate,
        data () {
            return {
                warehouseArr: [], //仓库数组
                wareHouseFloorArr: [], //楼层数组
                wareHouseFloorVal: '', //选中的楼层ID
                wareHouseFloorLabel: '', //选中的楼层文本
                warehouseVal: '', //选中的仓库
                regionCode: '', //新增通道
                wareHouseRegionArr: [], //通道数组(根据仓库和楼层获取)
                wareHouseRegionVal: '', //选中的通道的值
                addtWarehouseFloor: '', //添加楼层
                batchAddShelvesRow: '', //批量增加货架数排
                batchAddShelvesCol: '', //批量增加货架数列
                positionRow: '', //通道位置-横
                positionCol: '', //通道位置-竖
                shelvesName: '', //货架命名
                removeShelvesVal: '', //删除货架
                removeWarehouseVal: '', //删除库位
                searchLoading: false, //搜索loading
                addFloorLoading: false, //新增楼层loading
                addRegionLoading: false, //新增通道loading
                addShelvesLoading: false, //新增货架loading
                nameLoading: false, //命名loading
                batchWarehouseLoading: false, //批量生成库位loading
                isHaveShelf: false //是否有货架
            }
        },
        computed: {
            rgbaColor () {
                return this.$store.state.rgbaColor
            },
            shelfid () { //货架id
                return this.$store.state.shelfId
            },
            shelfrow () { //货架行
                return this.$store.state.shelfRow
            },
            shelfcol () { //货架列
                return this.$store.state.shelfCol
            },
            positiveDataArray () { //从左到右库位
                var dataArray = []
                var shelvesName = this.shelvesName //货架名
                for (var i=0; i<this.shelfrow; i++) {
                    for (var j=0; j<this.shelfcol; j++) {
                        if ((j+1)<10){
                            var locationCode = shelvesName+'-L'+(i+1)+'-0'+(j+1)
                        }else {
                            var locationCode = shelvesName+'-L'+(i+1)+'-'+(j+1)
                        }
                        dataArray.push({warehouseId: this.warehouseVal, shelfId: this.shelfid, locationCode: locationCode})
                    }
                }
                return dataArray
            },
            negetiveArray () { //从右到左库位
                var dataArray = []
                var shelvesName = this.shelvesName //货架名
                for (var i=0; i<this.shelfrow; i++) {
                    for (var j=this.shelfcol; j>0; j--) {
                        if (j <10){
                            var locationCode = shelvesName+'-L'+(i+1)+'-0'+j
                        }else {
                            var locationCode = shelvesName+'-L'+(i+1)+'-'+j
                        }
                        dataArray.push({warehouseId: this.warehouseVal, shelfId: this.shelfid, locationCode: locationCode})
                    }
                }
                return dataArray
            }
        },
        methods: {
            getWareHouseData () { //获取仓库数据
                this.$http.post('/lms/prodWarehouse/getAllProdWarehouse.html',{emulateJSON:true})
                .then((res) => {
                   var res = res.data
                //    console.log('-----------下面是获取的仓库数据-----------')
                //    console.log(res)
                   if (res.code == "0000" && res.data) {
                    this.warehouseArr = res.data
                   }
                });
            },
            getWareHouseFloorData () {  //根据仓库获取楼层信息
                if (this.warehouseVal) {
                    this.wareHouseFloorVal = ''
                    this.$http.post('/lms/warehouseFloor/getWarehouseFloor.html',{'warehouseId': this.warehouseVal},{emulateJSON:true})
                    .then((res) => {
                        var res = res.data
                        // console.log('-----------下面是根据仓库获取的楼层数据-----------')
                        // console.log(res)
                        if (res.code == '0000' && res.data) {
                            this.wareHouseFloorArr = res.data
                        }
                    })
                }
            
            },
            addtWarehouseFloorHandle () { //新增楼层
                if (!this.warehouseVal) {
                    this.$message({
                        message: '仓库是必须选择的哦!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false
                }
                if (!this.addtWarehouseFloor) {
                    this.$message({
                        message: '别忘了填写楼层呀!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false
                }
                console.log(this.addtWarehouseFloor);
                this.addFloorLoading = true //显示loading
                this.$http.post('/lms/warehouseFloor/addBatchWarehouseFloor.html',{
                    warehouseId: this.warehouseVal,
                    dataArray: JSON.stringify([this.addtWarehouseFloor])
                },{emulateJSON:true}).then((res) => {
                    var res = res.data
                    // console.log('-----------下面是新增楼层返回的数据-----------')
                    // console.log(res)
                    if (res.code == "0000") {
                        // this.$store.commit('changeDisplayAreaStatus', false) //隐藏displayArea
                        this.addFloorLoading = false //隐藏loading
                        this.$notify({
                            title: '成功',
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                        })
                        // this.wareHouseFloorVal = ''
                        this.addtWarehouseFloor = ''
                        this.getWareHouseFloorData () //重新获取楼层
                    }else {
                        this.addFloorLoading = false //隐藏loading
                        this.$notify({
                            title: '失败',
                            message: res.msg,
                            type: 'error',
                            duration: 2000
                        })
                    }
                })

            },
            addtWarehouseRegionHandle () { // 新增通道
                if (!this.warehouseVal || !this.wareHouseFloorVal || !this.regionCode) {
                    this.$message({
                        message: '仓库,楼层和通道编号是必填项哦!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false;
                }
                if (!this.positionRow || !this.positionCol) {
                    this.$message({
                        message: '通道位置不能为空!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false
                }
                if (this.positionRow==0 || this.positionCol==0) {
                    this.$message({
                        message: '坐标是从1开始的!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false
                }
                this.addRegionLoading = true //显示loading
                this.$http.post('/lms/warehouseRegion/addBatchWarehouseRegion.html',{
                    dataArray: JSON.stringify([{"warehouseId": this.warehouseVal, "floorId": this.wareHouseFloorVal, "regionCode": this.regionCode,"floorX": this.positionRow,"floorY":this.positionCol}])
                },{emulateJSON:true})
                .then((res) => {
                    var res = res.data
                    // console.log('-----------下面是新增通道返回的数据-----------')
                    // console.log(res)
                    if (res.code == "0000") {
                        this.addRegionLoading = false //隐藏loading
                        this.getWarehouseFloorRegion() //渲染出通道模块
                        this.getWarehouseregionData() //重新渲染通道select
                        this.$notify({
                            title: '成功',
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                        })
                        this.regionCode = ''
                        this.positionRow= ''
                        this.positionCol= ''
                    }else {
                        this.addRegionLoading = false //隐藏loading
                        this.$notify({
                            title: '失败',
                            message: res.msg,
                            type: 'error',
                            duration: 2000
                        })
                    }
                })
            },
            getWarehouseFloorRegion () { //根据仓库和楼层查询通道,并渲染出来
                if (!this.warehouseVal || !this.wareHouseFloorVal) {
                    this.$message({
                        message: '仓库,楼层是必填项哦!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false
                }
                var wareHouseFloorVal = this.wareHouseFloorVal
                var floorLabelText = this.wareHouseFloorArr.find((item)=>{
                    return item.id === wareHouseFloorVal
                })
                this.wareHouseFloorLabel = floorLabelText.floor
                this.searchLoading = true //增加loading
                if (this.warehouseVal && this.wareHouseFloorVal) {
                    this.$http.post('/lms/warehouseRegion/getWarehouseFloorRegion.html',{
                        warehouseId: this.warehouseVal,
                        floorId: this.wareHouseFloorVal
                     },{emulateJSON:true})
                    .then((res) => {
                       var res = res.data
                    //    console.log('-----------下面是根据仓库和楼层查询返回的通道数据-----------')
                    //    console.log(res)
                       if (res.code == '0000'){
                           this.searchLoading = false //关闭loading
                           var regionDatas = regionCoordinateHandle(res.data)
                           this.$store.commit('changeSortStatus', true)
                           this.$store.commit('changeDisplayAreaStatus', false)
                           this.$store.commit('getRegionData', regionDatas)
                       }
                    })
                }
            },
            setWarehouseFloorStop(){//根据仓库和楼层停用楼层
                if (!this.warehouseVal || !this.wareHouseFloorVal) {
                    this.$message({
                        message: '请先选择要停用的仓库楼层!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false
                }
                var wareHouseFloorLabel = this.wareHouseFloorLabel || '';
                if (this.warehouseVal && this.wareHouseFloorVal) {
                    this.$confirm('确定要停用该楼层吗？').then(()=>{
                        this.searchLoading = true //增加loading
                        this.$http.post('/lms/warehouseFloor/deleteBatchWarehouseFloor.html',{
                            warehouseId: this.warehouseVal,
                            dataArray: JSON.stringify([wareHouseFloorLabel])
                         },{emulateJSON:true})
                        .then((res) => {
                           var res = res.data
                        //    console.log('-----------下面是根据仓库和楼层查询返回的通道数据-----------')
                        //    console.log(res)
                            if (res.code == '0000'){
                                this.searchLoading = false //关闭loading
                                this.$notify({
                                    title: '成功',
                                    message: res.msg || '停用操作成功!',
                                    type: 'success',
                                    duration: 2000
                                })
                                //重新获取楼层
                                this.getWareHouseFloorData()
                                this.$store.commit('changeSortStatus', false)
                            }
                        }).catch((err)=> {
                            this.$message({
                                message: err,
                                type: 'error',
                                showClose: true,
                                duration: 2000
                            })
                        })
                    })
                }
            },
            addWarehouseShelvesInfo () { //新增货架信息
                if (!this.warehouseVal || !this.wareHouseFloorVal ||!this.wareHouseRegionVal || !this.batchAddShelvesRow || !this.batchAddShelvesCol) {
                    this.$message({
                        message: '必须选择仓库/楼层/通道/批量增加货架!',
                        type: 'warning',
                        showClose: true,
                        duration: 2000
                    })
                    return false
                }
                if (this.isHaveShelf) {
                    this.$message({
                        message: '该通道已经增加过货架了,暂时不允许继续增加',
                        type: 'error',
                        showClose: true,
                        duration: 3000
                    })
                    return false
                }
                var batchAddShelvesRow = this.batchAddShelvesRow, //行
                    batchAddShelvesCol = this.batchAddShelvesCol //列
                if(batchAddShelvesRow > 3) {
                    this.$message({
                        message: '只允许输入1,2,3排!',
                        type: 'error',
                        showClose: true,
                        duration: 3000
                    })
                    return false
                }
                //循环生成批量数据
                var dataArray = [] //定义一个空数组用来存放批量的数据
                if (batchAddShelvesRow && batchAddShelvesCol) {
                    for(var i =0; i<batchAddShelvesRow; i++) {
                        for (var j=0; j<batchAddShelvesCol; j++) {
                            var data = {
                                "warehouseId": this.warehouseVal,
                                "regionId": this.wareHouseRegionVal,
                                "regionX" : i+1,
                                "regionY" : j+1
                            }
                            dataArray.push(data)
                        }
                    }
                }
                // console.log('该通道的id是:' + this.wareHouseRegionVal)
                this.addShelvesLoading = true //显示loading
                this.$http.post('/lms/warehouseShelf/addBatchWarehouseShelf.html',{
                    dataArray:JSON.stringify(dataArray)
                },{emulateJSON:true})
                .then((res) => {
                    var res = res.data
                    // console.log('-----------下面是新增货架信息返回的数据-----------')
                    // console.log(res)
                    if (res.code == "0000") {
                        this.addShelvesLoading = false //隐藏loading
                        this.$store.commit('changeDisplayAreaStatus', true) //显示displayArea
                        this.$store.commit('getRegionId', this.wareHouseRegionVal)//传递通道id
                        this.getShelvesData() //刷新displayArea视图
                        this.$notify({
                            title: '成功',
                            message: res.msg,
                            type: 'success',
                            duration: 2000
                        })
                        // this.warehouseVal = ''
                        // this.wareHouseFloorVal = ''
                        this.batchAddShelvesRow = ''
                        this.batchAddShelvesCol = ''
                    }else {
                        this.addShelvesLoading = false //隐藏loading
                        this.$notify({
                            title: '失败',
                            message: res.msg,
                            type: 'error',
                            duration: 2000
                        })
                    }
                })
            },
            getWarehouseregionData() { //根据仓库和楼层获取通道
                this.$http.post('/lms/warehouseRegion/getWarehouseFloorRegion.html',{
                    warehouseId: this.warehouseVal,
                    floorId: this.wareHouseFloorVal
                 },{emulateJSON:true})
                .then((res) => {
                   var res = res.data
                   if (res.code == '0000'){
                       this.wareHouseRegionArr = res.data
                   }
                })
            },
            getShelvesData () { //根据通道id获取到货架数据
                var wareHouseRegionArr = this.wareHouseRegionArr,
                    txt = ''
                for (var i=0; i<wareHouseRegionArr.length; i++) {
                    var regionS = wareHouseRegionArr[i]
                    if (regionS.regionId == this.wareHouseRegionVal) {
                         txt = regionS.regionCode+'('+regionS.floorX+','+regionS.floorY+')'
                    }
                }
                this.$http.post('/lms/warehouseRegion/getWarehouseRegionShelfByRegionId.html',{
                    regionId: this.wareHouseRegionVal
                },{emulateJSON:true})
                .then((res) => {
                    var res = res.data
                    // console.log('-----------下面是根据通道id返回的数据-----------')
                    // console.log(res)
                    if (res.code == "0000"){
                       this.$store.commit('getShelvesData', res.data)
                       this.$store.commit('getRegionTxt', txt)
                    //    console.log(res.data)
                    }
                })
            }
        },
        watch: {
            warehouseVal (val) {
                this.$store.commit('getWarehouseId', val) //传入仓库id
                if (!val) {
                    this.wareHouseFloorVal = ''
                }
            },
            wareHouseFloorVal (val) { //监听楼层来渲染通道选择框
                this.wareHouseRegionVal = ''
                this.$store.commit('getFloorId', val) //传入楼层id
                if (!val) {
                    this.wareHouseRegionVal = ''
                    this.wareHouseRegionArr = []
                    return false
                }
                this.$http.post('/lms/warehouseRegion/getWarehouseFloorRegion.html',{
                    warehouseId: this.warehouseVal,
                    floorId: val
                 },{emulateJSON:true})
                .then((res) => {
                   var res = res.data
                   if (res.code == '0000'){
                       this.wareHouseRegionArr = res.data
                   }
                })
            },
            wareHouseRegionVal (val) { //判断该通道下有没有货架
                var wareHouseRegionArr = this.wareHouseRegionArr
                for (var i=0; i<wareHouseRegionArr.length; i++) {
                    var region = wareHouseRegionArr[i]
                    if (region.regionId == val) {
                        if (region.shelfCount) {
                            this.isHaveShelf = true //有货架
                            this.$message({
                                message: '该通道已经增加过货架了,暂时不允许继续增加',
                                type: 'error',
                                showClose: true,
                                duration: 3000
                            })
                        }else {
                            this.isHaveShelf = false //无货架
                        }
                    }
                }
            }
        },
        mounted () {
            this.getWareHouseData()
        }
};
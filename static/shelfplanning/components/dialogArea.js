var dialogAreaTemplate = `
<div class="planDialog">
  <el-dialog
  title="修改通道"
  :visible.sync="modifyRegionVisible"
  :show-close="false"
  width="300px">
  <div>
    <el-row :gutter="8" class="lh32">
        <el-col :span="8">通道名称</el-col>
        <el-col :span="16"><div class="mb10"><el-input v-model="regionName"  size="small"></el-input></div></el-col>
        <el-col :span="8">通道坐标</el-col>
        <el-col :span="2">X</el-col>
        <el-col :span="6"><div><el-input v-model="regionX"  size="small"></el-input></div></el-col>
        <el-col :span="2">Y</el-col>
        <el-col :span="6"><div><el-input v-model="regionY"  size="small"></el-input></div></el-col>
    </el-row>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelBtnHandle('modifyRegionStatus')" size="small">取 消</el-button>
    <el-button type="primary" @click="submitBtnHandle('modifyRegionStatus')" size="small"
    v-loading.fullscreen.lock="regionLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgbaColor">确 定</el-button>
  </span>
  </el-dialog>


  <el-dialog
  title="新增货架"
  :visible.sync="newlyAddShelfVisible"
  :show-close="false"
  width="350px">
  <div>
    <el-row :gutter="8" class="lh32">
        <el-col :span="8">货架名称</el-col>
        <el-col :span="16"><div class="mb10"><el-input v-model="shelfName"  size="small"></el-input></div></el-col>
        <el-col :span="8">货架坐标</el-col>
        <el-col :span="6"><div class="mb10"><el-input v-model="shelfX"  size="small"></el-input></div></el-col>
        <el-col :span="2">横</el-col>
        <el-col :span="6"><div class="mb10"><el-input v-model="shelfY"  size="small"></el-input></div></el-col>
        <el-col :span="2">竖</el-col>
        <el-col :span="8">库位排序</el-col>
        <el-col :span="16">
          <el-switch
            v-model="cellRule"
            class="cellRuleSwitch"
            active-color="#13ce66"
            inactive-color="#409eff"
            active-text="从左到右"
            inactive-text="从右到左">
          </el-switch>
        </el-col>
    </el-row>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelBtnHandle('newlyAddShelfStatus')" size="small">取 消</el-button>
    <el-button type="primary" @click="submitBtnHandle('newlyAddShelfStatus')" size="small"
    v-loading.fullscreen.lock="shelfLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgbaColor">确 定</el-button>
  </span>
  </el-dialog>


  <el-dialog
  title="新增库位(必须先点击一个货架)"
  :visible.sync="newlyAddCellVisible"
  :show-close="false"
  width="350px">
  <div>
    <el-row :gutter="8" class="lh32">
        <el-col :span="8">增加库位</el-col>
        <el-col :span="16">
          <!--<div class="mb10"><el-input v-model="addCellLine"  size="small"></el-input></div>-->
          在选中货架下添加一行库位
        </el-col>
        <el-col :span="8">库位规则</el-col>
        <el-col :span="16">
          <el-switch
            v-model="addCellRule"
            class="cellRuleSwitch"
            active-color="#13ce66"
            inactive-color="#409eff"
            active-text="从左到右"
            inactive-text="从右到左">
          </el-switch>
        </el-col>
    </el-row>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelBtnHandle('newlyAddCellStatus')" size="small">取消</el-button>
    <el-button type="primary" @click="submitBtnHandle('newlyAddCellStatus')" size="small"
    v-loading.fullscreen.lock="addCellLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgbaColor">新增并生成库位</el-button>
  </span>
  </el-dialog>


  <el-dialog
  title="删除库位"
  :visible.sync="deleteCellVisible"
  :show-close="false"
  width="300px">
  <div>
    <el-row :gutter="8" class="lh32">
        <el-col :span="8">库位号</el-col>
        <el-col :span="16"><div class="mb10"><el-input v-model="deleteCellName"  size="small"></el-input></div></el-col>
    </el-row>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancelBtnHandle('deleteCellStatus')" size="small">取 消</el-button>
    <el-button type="primary" @click="submitBtnHandle('deleteCellStatus')" size="small"
    v-loading.fullscreen.lock="deleteCellLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgbaColor">确 定</el-button>
  </span>
  </el-dialog>
</div>
`

var dialogArea = {
  template: dialogAreaTemplate,
  data () {
    return {
      regionName:'', //通道名称
      regionX: '', //通道横坐标
      regionY: '', //通道纵坐标
      regionLoading: false, //通道loading
      shelfName: '', //货架名称
      shelfX: '', //货架横坐标
      shelfY: '', //货架纵坐标
      cellRule: true, //库位规则
      shelfLoading: false, //货架loading
      // addCellLine: '', //新增库位行
      addCellRule: true, //新增库位规则
      addCellLoading: false, // 新增库位loading
      deleteCellName: '', //要删除的库位号
      deleteCellLoading: false //删除库位loading
    }
  },
  computed: {
    regionObj () {
       return this.$store.state.regionTxt
    },
    warehouseId () { //获取到仓库id
      return  this.$store.state.warehouseId
    },
    regionId () { //获取到通道的id
      return  this.$store.state.regionId 
    },
    floorId () { //获取到楼层id
      return this.$store.state.floorId
    },
    shelfId () { //获取到被点击的货架的id
      return  this.$store.state.shelfId
    },
    shelfRow () { //获取到被点击货架的行
      return this.$store.state.shelfRow
    },
    shelfCol () { //获取到被点击货架的列
      return this.$store.state.shelfCol
    },
    shelfCode () { //获取到被点击的货架名
      return this.$store.state.shelfCode
    },
    cellData () { //获取到库位数据
      return this.$store.state.cellData
    },
    rgbaColor () { //加载框的背景色
      return this.$store.state.rgbaColor
    },
    modifyRegionVisible () { //修改通道弹框
      return this.$store.state.modifyRegionVisible
    },
    newlyAddShelfVisible () { //新增货架弹框
      return this.$store.state.newlyAddShelfVisible
    },
    newlyAddCellVisible () {  //新增库位弹框
      return this.$store.state.newlyAddCellVisible
    },
    deleteCellVisible () { //删除库位弹框
      return this.$store.state.deleteCellVisible
    },

  },
  methods: {
    submitBtnHandle (val) { //弹框确定处理
      switch(val) {
        case 'modifyRegionStatus': //修改通道
          this.modifyRegionHandle();
          break;
        case 'newlyAddShelfStatus': //新增货架
          this.newlyAddShelfHandle();
          break;
        case 'newlyAddCellStatus': //新增库位
          this.newlyAddCellHandle();
          break;
        case 'deleteCellStatus': //删除库位
          this.deleteCellNameHandle();
          break;
      }
    },
    cancelBtnHandle (val) { //弹框取消处理
      switch(val) {
        case 'modifyRegionStatus': //修改通道
          // this.regionName = this.regionX = this.regionY = ''
          this.$store.commit('modifyRegionStatus', false);
          break;
        case 'newlyAddShelfStatus': //新增货架
          //清空输入框
          this.shelfName = this.shelfX = this.shelfY = '';
          this.cellRule = true;
          this.$store.commit('newlyAddShelfStatus', false);
          break;
        case 'newlyAddCellStatus': //新增库位
          this.$store.commit('newlyAddCellStatus', false);
          break;
        case 'deleteCellStatus': //删除库位
          this.deleteCellName = '';
          this.$store.commit('deleteCellStatus', false);
          break;
      }
    },
    modifyRegionHandle () { //修改通道逻辑处理
      if (!this.regionName || !this.regionX || !this.regionY) {
        this.promptBox('通道名称和坐标不能为空!','warning');
        return false;
      }
      if (this.regionX == 0 || this.regionY==0) {
        this.promptBox('坐标必须从1开始!','warning');
        return false;
      }
      this.regionLoading = true //开启loading
      // 需要传给接口的数据
      var dataArray = [{
        regionCode: this.regionName, 
				   floorId: this.floorId,
            floorX: this.regionX,
				    floorY: this.regionY,
				        id: this.regionId
      }]
      //发送请求
      this.vueAjax('/lms/warehouseRegion/updateBatchWarehouseRegion.html',{dataArray: JSON.stringify(dataArray)},
        (res) => {
            var res = res.data
            if (res.code == "0000") {
              this.regionLoading = false //关闭loading
              this.promptNotice('成功', res.msg, 'success')
              this.reRenderRegion() //重新渲染通道模块
              this.$store.commit('getRegionTxt', this.regionName+'('+this.regionX+','+this.regionY+')');
              this.reRenderShelf('modifyRegion') //重新渲染货架模块
              this.$store.commit('modifyRegionStatus', false) //修改通道弹框隐藏
              this.regionName = this.regionX = this.regionY = '' //清空选项
            }else {
              this.regionLoading = false //关闭loading
              this.promptNotice('失败', res.msg, 'error')
            }
        }
      )
    },
    newlyAddShelfHandle () { //新增货架逻辑处理
      var warehouseId = this.warehouseId,
             regionId = this.regionId,
            shelfCode = this.shelfName,
               shelfX = this.shelfX,
               shelfY = this.shelfY,
             cellRule = this.cellRule
      //非空判断
      if (!shelfCode || !shelfX || !shelfY) {
        this.promptBox('货架名/货架坐标不能为空!', 'warning')
        return false
      }
      if (this.shelfX == 0 || this.shelfY == 0) {
        this.promptBox('坐标必须从1开始!','warning');
        return false;
      }
      this.shelfLoading = true //加载层
      //params
      var dataArray = [
        {
          "warehouseId": warehouseId, //仓库id
             "regionId": regionId, //通道id
            "shelfCode": shelfCode, //货架名
             "regionX" : shelfX, //货架横坐标
             "regionY" : shelfY, //货架纵坐标
           "direction" : cellRule ? 1 : 2 //方向1 从左到右 2从右到左
        }
      ]
      //发送请求
      this.vueAjax('/lms/warehouseShelf/addBatchWarehouseShelf.html',{dataArray: JSON.stringify(dataArray)},
      (res) => {
        var res = res.data
        if (res.code == "0000") {
          //获取到新添加的货架对象
          var newShelf = res.data[0]
           //重新获取货架数据
          // this.reRenderShelf('newlyAddShelf')
           //设置并传递shelfId的值
          this.$store.commit('getshelfId', newShelf.id)
            //关闭模态框
            //关闭弹框
            this.$store.commit('newlyAddShelfStatus', false)
            //关闭模态框
            this.shelfLoading = false
            //清空输入框
            this.shelfName = this.shelfX = this.shelfY = ''
            this.cellRule = true
            this.reRenderShelf('newlyAddShelf') //重新获取货架数据
           //创建库位并更新视图
          // this.createStoreHouse(cellRule,shelfCode,newShelf.sepcRowNum,newShelf.sepcColumnNum,warehouseId, newShelf.id,(res) => {
          //     //关闭弹框
          //     this.$store.commit('newlyAddShelfStatus', false)
          //     //关闭模态框
          //     this.shelfLoading = false
          //     //清空输入框
          //     this.shelfName = this.shelfX = this.shelfY = this.shelfSpecsTr = this.shelfSpecsTd = ''
          //     this.cellRule = true
          // })
        }else{
          this.shelfLoading = false
          this.promptNotice('失败', res.msg, 'error')
        }
      })
    },
    createStoreHouse (bol,shelfName,shelfRow,shelfCol,warehouseId,shelfId,fn) { //生成库位并更新视图
        var dataArray = []
        if (bol == true) { //默认从左到右
          for (var i=0; i<shelfRow; i++) {
              for (var j=0; j<shelfCol; j++) {
                if ((j+1)<10){
                  var locationCode = shelfName+'-L'+(i+1)+'-0'+(j+1)
                }else {
                  var locationCode = shelfName+'-L'+(i+1)+'-'+(j+1)
                }
                  
                  dataArray.push({warehouseId: warehouseId, shelfId: shelfId, locationCode: locationCode})
              }
          }
        }else { //选择从右到左
          for ( var i=0; i<shelfRow; i++) {
              for (var j=shelfCol; j>0; j--) {
                if (j <10){
                  var locationCode = shelfName+'-L'+(i+1)+'-0'+j
                }else {
                  var locationCode = shelfName+'-L'+(i+1)+'-'+j
                }
                dataArray.push({warehouseId: warehouseId, shelfId: shelfId, locationCode: locationCode})
              }
          }
        }
        this.vueAjax('/lms/warehouseProdLocation/addBatchWarehouseLocation.html',{dataArray: JSON.stringify(dataArray)},(res)=>{
          var res = res.data
          if (res.code == '0000') {
            this.reRenderShelf('newlyAddShelf') //重新获取货架数据
            fn()
          }else {
            this.promptNotice('失败',res.msg, 'error')
            //关闭模态框
            this.shelfLoading = false
            //删除货架
            this.vueAjax('/lms/warehouseShelf/delBatchWarehouseShelfByCode.html', {
              warehouseId: warehouseId,
              regionId: this.regionId,
              dataArray: JSON.stringify([shelfName])
            },(res)=>{
              if (res.code =="0000") {
                this.reRenderShelf('newlyAddShelf') //重新获取货架数据
              }
            })
            return false
          }
        })
    },
    newlyAddCellHandle () { //新增库位的逻辑处理
      var addCellRule = this.addCellRule, //新增加行的库位规则
          warehouseId = this.warehouseId, //获取仓库id
             regionId = this.regionId, //获取通道id
             shelfRow = this.shelfRow, //原货架行
             shelfCol = this.shelfCol, //原货架列
              shelfId = this.shelfId, //被选中货架的id
            shelfCode = this.shelfCode, //被选中的货架名
             cellData = this.cellData.map((item) => {//获取到被点击货架的库位数据
                return Object.assign(item, {'warehouseId': warehouseId})
              }),
              // newRow = this.addCellLine //增加的货架行
              newRow = shelfRow + 1
      if (!shelfId) {
        this.promptBox('请先选中一个货架', 'warning')
        return false
      }
      this.addCellLoading = true
      this.vueAjax('/lms/warehouseShelf/updateBatchWarehouseShelf.html', { //首先修改货架
        dataArray: JSON.stringify([{ id:shelfId, sepcRowNum:newRow,regionId: regionId}])
      },(res) => {
        var res = res.data
        if (res.code == '0000') { //表示修改货架成功
          this.newlyAddCellLine(warehouseId, shelfId, newRow,shelfCol,addCellRule,shelfCode,cellData)
          this.vueAjax('/lms/warehouseProdLocation/addBatchWarehouseLocation.html',{
            dataArray: JSON.stringify(cellData)
          }, (res) => {
            var res = res.data
            if (res.code == "0000"){
               this.$store.commit('newlyAddCellStatus', false);
               this.promptNotice('成功',shelfCode+'货架'+ res.msg, 'success');
               this.reRenderShelf('newlyAddCell');
               this.addCellLoading = false //关闭模态框
               //清空选项
              //  this.addCellLine = ''
               this.addCellRule = true
            }else {
              this.promptNotice('失败', shelfCode+'货架'+ res.msg, 'error')
              this.addCellLoading = false
            }
          })
        }else {
          this.promptNotice('失败', res.msg, 'error')
          this.addCellLoading = false
        }
      })
    },
    newlyAddCellLine (warehouseId, shelfId, newRow,shelfCol,addCellRule,shelfCode,data) { //新增的库位数据
      if (addCellRule == true) { //从左到右
          for (var i=0; i<1; i++){
            for (var j=0; j<shelfCol; j++){
              if ((j+1)<10){
                var locationCode = shelfCode+'-L'+newRow+'-0'+(j+1)
              }else {
                var locationCode = shelfCode+'-L'+newRow+'-'+(j+1)
              }
              data.push({'warehouseId': warehouseId, 'shelfId': shelfId, 'locationCode': locationCode}) 
            }
          }
      }else { //从右到左
        for (var i=1; i>0; i--){
          for (var j=shelfCol; j>0; j--){
            if (j <10){
              var locationCode = shelfCode+'-L'+newRow+'-0'+j
            }else {
                var locationCode = shelfCode+'-L'+newRow+'-'+j
            }
            data.push({'warehouseId': warehouseId, 'shelfId': shelfId, 'locationCode': locationCode}) 
          }
        }
      } 
    },
    deleteCellNameHandle () { //删除库位处理
      var deleteCellName = this.deleteCellName
      if (!deleteCellName) {
        this.promptBox('要删除的库位不能为空', 'warning')
        return false
      }
      this.deleteCellLoading = true //修改loading为true
      this.vueAjax('/lms/warehouseProdLocation/delWarehouseLocationByCode.html',{
        dataArray: JSON.stringify([deleteCellName])
      }, (res) => {
        var res = res.data
        if (res.code == "0000") {
          this.reRenderShelf('deleteCell') //重新渲染货架视图
          this.$store.commit('deleteCellStatus', false)
          this.promptNotice('成功', res.msg, 'success')
          this.deleteCellLoading = false //修改loading为false
          this.deleteCellName = '' //清空库位值
        }else {
          this.promptNotice('错误', res.msg, 'error')
          this.deleteCellLoading = false //修改loading为false
        }
      })
    },
    reRenderRegion () { //重新渲染通道
      this.vueAjax('/lms/warehouseRegion/getWarehouseFloorRegion.html',{
        warehouseId: this.warehouseId,
        floorId: this.floorId
      },(res)=>{
        var res = res.data
        if (res.code == '0000'){
          var regionDatas = regionCoordinateHandle(res.data)
          this.$store.commit('changeSortStatus', true)
          this.$store.commit('changeDisplayAreaStatus', false)
          this.$store.commit('getRegionData', regionDatas)
        }
      })
    },
    reRenderShelf (val) { //重新渲染货架(根据传入的值不同,执行不同的逻辑)
      var regionId = this.regionId
      this.vueAjax('/lms/warehouseRegion/getWarehouseRegionShelfByRegionId.html',{regionId: regionId}, (res) => {
        var res = res.data
        if (res.code == "0000"){
          switch(val){
            case 'modifyRegion':
              this.$store.commit('getShelvesData', res.data);
              this.$store.commit('changeDisplayAreaStatus', true);
              break;
            case 'newlyAddShelf':
              this.$store.commit('getShelvesData', res.data); //把新的货架数据传递给store.js
              this.$store.commit('changeDisplayAreaStatus', true);
              break;
            case 'deleteCell':
              this.$store.commit('getShelvesData', res.data); //把新的货架数据传递给store.js
              this.$store.commit('changeDisplayAreaStatus', true);
              break;
            case 'newlyAddCell':
              this.$store.commit('getShelvesData', res.data); //把新的货架数据传递给store.js
              this.$store.commit('changeDisplayAreaStatus', true);
              break;
          }
       }
      })
    },
    promptBox (msg, type) { //消息提示框,悬浮在页面中间
      this.$message({
        message: msg,
        type: type,
        showClose: true,
        duration: 2000
      })
    },
    promptNotice (title, msg, type) { //通知提示框,悬浮在页面右侧
      this.$notify({
        title: title,
        message: msg,
        type: type,
        duration: 2000
      })
    },
    vueAjax (url, params, fn) { //vue-resource简单处理
      this.$http.post(url,params,{emulateJSON:true})
          .then(fn)
    }
  },
  watch : {
    regionObj:{
      handler(val,newVal){
        // console.log('原值是',val)
        this.regionName = val.replace(/\(|\)|\,/g,'-').split('-')[0]
        this.regionX = val.replace(/\(|\)|\,/g,'-').split('-')[1]
        this.regionY = val.replace(/\(|\)|\,/g,'-').split('-')[2]
      },
      immediate: true
    }
  }
}
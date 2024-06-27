var store = new Vuex.Store({
    state: {
      displayShow: false, //displayArea区域是否显示
      sortAreaShow: false, //sortArea区域是否显示
      warehouseId: '', //仓库id
      floorId: '', //楼层id
      regionData: [], //区域的值
      regionTxt: '', //区域文本值
      regionId: '', //区域的id
      shelvesData: [], //货架信息
      shelfId: '', //货架id
      shelfRow: '', //货架行
      shelfCol: '', //货架列
      shelfCode: '', //货架名
      cellData: [], //库位数据
      rgbaColor: 'rgba(130,130,130,0.9)', //loading颜色
       modifyRegionVisible: false, //修改区域弹框显示和隐藏
      newlyAddShelfVisible: false, //新增货架弹框显示和隐藏
       newlyAddCellVisible: false, //新增库位弹框显示和隐藏
         deleteCellVisible: false  //删除库位弹框显示和隐藏
    },
    mutations: {
      changeDisplayAreaStatus (state,bol) { //改变displayArea区域显示状态
        state.displayShow = bol
      },
      changeSortStatus (state, bol) { //改变sortArea区域显示状态
        state.sortAreaShow = bol
      },
      getWarehouseId (state, str) { //获取仓库id
         state.warehouseId = str
      },
      getFloorId (state, str) { //获取楼层id
         state.floorId = str
      },
      getRegionData (state, data) { //获取区域的值
         state.regionData = data
      },
      getShelvesData (state, data) { //获取货架的值
        state.shelvesData = data
      },
      getRegionId (state, str) { //获取到区域的id值
         state.regionId = str
      },
      getRegionTxt (state, str) { //获取区域的文本值 
        state.regionTxt = str
      },
      getshelfId (state, num) { //获取货架id
        state.shelfId = num
      },
      getshelfRow (state, num) { //获取货架行
        state.shelfRow = num
      },
      getshelfCol (state, num) { //获取货架列
        state.shelfCol = num
      },
      getShelfCode (state, str) { //获取到货架名
        state.shelfCode = str
      },
      getCellData (state, str) { //设置库位数据
         state.cellData = str
      },
      modifyRegionStatus (state, bol) { //修改区域弹框显隐藏
         state.modifyRegionVisible = bol
      },
      newlyAddShelfStatus (state, bol) {//新增货架弹框显隐藏
         state.newlyAddShelfVisible = bol
      },
      newlyAddCellStatus (state, bol) {//新增库位弹框显隐藏
        state.newlyAddCellVisible = bol
      },
      deleteCellStatus (state, bol) {//删除库位弹框显隐藏
        state.deleteCellVisible = bol
      }
    }
})
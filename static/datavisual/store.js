var store = new Vuex.Store({
    state: {
      regionAndShelvesdata: [], //区域和货架信息
      colorConfigData: [], //颜色配置数组
      DimensionVal: '' //维度的值
    },
    mutations: {
      setRegionAndShelvesdata (state,data) { //设置货架的数据
        state.regionAndShelvesdata = data
      },
      setColorConfigData (state, data) { //设置颜色配置数组
        state.colorConfigData = data
      },
      setDimensionVal(state, str){ //设置维度的值
         state.DimensionVal = str
      }
    }
})
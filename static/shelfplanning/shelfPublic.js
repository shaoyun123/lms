//1. 区域坐标处理
var regionCoordinateHandle = function(data) { 
    if (data) {
        var maxX = '', //最大x值
        maxY = '' //最大y值
        maxX = Math.max.apply(null, data.map(function(item){
            return item.floorX
        }))
        maxY = Math.max.apply(null, data.map(function(item){
            return item.floorY
        }))

        // 根据最大x坐标和最大y坐标确定表格有x行y列,获取到一个坐标数组
        var regionCoordinateArr = []
        for (var j=1; j<=maxX; j++) { //遍历行
            var trArr = []
            for (var k=1; k<=maxY; k++) { //遍历列
                trArr.push({'floorX': j, 'floorY': k})
            }
            regionCoordinateArr.push(trArr)
        }
        //循环该坐标数组.把data的值对应替换
        for (var m=0; m<regionCoordinateArr.length; m++) {
            var tdArr = regionCoordinateArr[m]
            for (var n=0; n<data.length; n++) {
                for (var p=0; p<tdArr.length; p++) {
                if (data[n].floorX == tdArr[p].floorX && data[n].floorY == tdArr[p].floorY) {
                    tdArr[p] = data[n]
                }
                }
            }
        }
        return regionCoordinateArr
    }
}
/**
 * 数组去重处理
 * 定义一个空对象,利用对象的属性不能重复来判断
 */
var arrDistinct = function(arr){
    var obj = {},
        result = []
    for(var i of arr){
      if (!obj[i]){
        result.push(i)
        obj[i] = 1
      }
    }
    return result
}

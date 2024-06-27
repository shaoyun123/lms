/**
 * 通用的另外打开页签，打印表格数据
 * Created by huangpeng on 2020-11-13.
 */
/**
 * 打开页签展示表格数据
 * @param title 表格名
 * @param colNameArr 列名
 * @param data 表格数据
 */
function openPrintTab(title,colNameArr,data){
    // // 精简数据，仅传递需要展示的列数据
    // let pageData = data
    // console.log(data)
    // console.log(data.length)
    // for (let i = 0; i < data.length; ++i) {
    //     let one = {}
    //     for (let j = 0; j < colNameArr.length; ++j) {
    //         if (colNameArr[j].type && colNameArr[j].type === 'time') {
    //             one[colNameArr[j].field] = Format(data[i][colNameArr[j].field],'yyyy-MM-dd hh:mm:ss')
    //         } else {
    //             one[colNameArr[j].field] = data[i][colNameArr[j].field]
    //         }
    //     }
    //     pageData.push(one)
    // }
    // 获取当前时间戳作为数据key
    let dataKey = new Date().getTime()

    let Adata = {
        title: title,
        tableColumns: colNameArr,
        pageData: data
    }
    console.log(Adata)
    sessionStorage.setItem(dataKey,JSON.stringify(Adata))
    window.open("/lms/static/html/generatePrint.html?dataKey=" + dataKey, "_blank");
}
/**
 * 导出xls文件
 * @param jsonData  数据列表
 * @param header 表头列表
 *  [{title: '姓名', field: 'name'}，{title: '年龄', field: 'age'}]
 * @param fileName 文件名
 *
 */
function tableToExcel (jsonData,header,fileName) {
    // 列标题
    let str = `<tr>`
    for (let i = 0; i < header.length; ++i) {
        str += `<td>`+ (header[i].title || '') +`</td>`
    }
    str += `</tr>`
    // 循环遍历，每行加入tr标签，每个单元格加td标签
    for(let i = 0 ; i < jsonData.length ; i++ ){
        str+='<tr>';
        for (let j = 0; j < header.length; ++j) {
            let key = header[j].field
            // 增加\t为了不让表格显示科学计数法或者其他格式
            str+=`<td>${ (jsonData[i][key] != null ? jsonData[i][key] : '') + '\t'}</td>`;
        }
        str+='</tr>';
    }
    // Worksheet名
    const worksheet = 'Sheet1'
    const uri = 'data:application/vnd.ms-excel;base64,'

    // 下载的表格模板数据
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
        xmlns:x="urn:schemas-microsoft-com:office:excel" 
        xmlns="http://www.w3.org/TR/REC-html40">
        <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
    // 下载模板
    // window.location.href = uri + base64(template);

    var link = document.createElement("A");
    link.href = uri + base64(template);
    link.download = fileName || 'Workbook.xls';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// 输出base64编码
const base64 = s => window.btoa(unescape(encodeURIComponent(s)))

/**
 * time: 2018/01/02
 */
var fbapurchaseconfig_dynamicBtn
layui.use(["admin", "form", "table", "layer"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        $ = layui.$;
    form.render('select');
    form.render('radio');
    form.render('checkbox');

    function searchDynamicConfig() {
        oneAjax.post({
            url: '/whSalesParam/queryDynamicParam',
            data: {pageName: 'fbapurchaseconfig'},
            success: function (res) {
                if (res.code !== '0000') {
                    layer.msg('查询动态参数失败')
                    return
                }
                let list = res.data
                // 动态添加表格
                let tableElementList = ''
                for (let i = 0; i < list.length; ++i) {
                    let param = list[i]
                    let oneTable = `<div class="fl fbapurchaseconfig_dynamicConfig" style="width: 50%">
                                        <input type="hidden" class="fbapurchaseconfig_dynamicConfig_id" value="`+ param.id +`">
                                        <input type="hidden" class="fbapurchaseconfig_isArray" value="`+ param.isArray +`">
                                        <div class="fbapurchaseconfig_dynamicConfig_name">`+ param.paramName +`</div>
                                        <form autocomplete="off">
                                            <div class="layui-card-body">
                                                <table class="layui-table" id="dynamicParam`+ param.paramType + `Table" lay-filter="dynamicParam`+ param.paramType + `Table"></table>
                                            </div>
                                        </form>
                                    </div>`
                    tableElementList += oneTable
                }
                tableElementList += ` <div class="clearLeft"></div>`
                let containsElement = $("#fbapurchaseconfig_dynamicConfigContains")
                containsElement.html('')
                containsElement.append(tableElementList)
                // 渲染表格数据
                for (let i = 0; i < list.length; ++i) {
                    let param = list[i]
                    renderDynamicParamTable(param)
                }
            }
        })
    }

    function renderDynamicParamTable(dynamicParam) {
        let tableId = 'dynamicParam' + dynamicParam.paramType + 'Table'
        let data = JSON.parse(dynamicParam.totalJson)
        let cols = JSON.parse(dynamicParam.layuiCol)
        cols[0].push({ title: '操作', align: 'center', toolbar: '#dynamicParamTool_fbapurchaseconfig',width:150, rowspan: cols.length })
        if (!dynamicParam.isArray) {
            data = [data]
        }
        // 旧数据赋值id
        for (let i = 0; i < data.length; ++i) {
            data[i].id = i + 1
        }
        if (dynamicParam.ifAddPermit) {
            data.push({})
        }
        table.render({
            elem: "#" + tableId,
            id: tableId,
            data: data,
            cols: cols,
            limit: 10000,
            unFixedTableHead: true, // 不固定表头
            page: false //是否显示分页
        });
    }
    searchDynamicConfig()

    fbapurchaseconfig_dynamicBtn = function(operType,self) {
        // 当前参数容器
        let configElem = $(self).closest('.fbapurchaseconfig_dynamicConfig')
        // 当前参数数据
        let data = {
            id : configElem.find('.fbapurchaseconfig_dynamicConfig_id').val()
        }
        let isArray = configElem.find('.fbapurchaseconfig_isArray').val()
        // 表格数据
        let tableElem = $(self).closest('tbody')
        let totalJson
        let newOne = {}
        // 获取旧数据


        switch (operType){
            case 1:
                totalJson = getTableData(tableElem,false,null,isArray)
                break;
            case 2:
                // 获取当前行
                let curId = $(self).closest('tr').find('[dname=id]').val()
                totalJson = getTableData(tableElem,false,curId,isArray)
                break;
            case 3:
                totalJson = getTableData(tableElem,true,null,isArray)
                break;
        }
        console.log(totalJson)
        data.totalJson = JSON.stringify(totalJson)
        oneAjax.post({
            url: '/whSalesParam/updateDynamicParam',
            data: data,
            success: function (res) {
                if (res.code === '0000') {
                    layer.msg('操作成功')
                    searchDynamicConfig()
                }
            }
        })
    }


    /**
     * 获取表格数据
     * @param tableElem 数据所在表格元素, 这是个jquery对象
     * @param pushWithoutId 是否获取 无id的数据行
     * @param excludeId 需要排除的id
     * @param isArray 是否数组
     */
    function getTableData(tableElem, pushWithoutId, excludeId,isArray) {
        let trList = tableElem.find('tr')
        let data = []
        if (!trList) {
            return data
        }
        for (let i = 0; i < trList.length; ++i) {
            let tr = trList[i]
            let id = $(tr).find('[dname]').val()
            if (!pushWithoutId && !id) {
                continue
            }
            if (excludeId && excludeId === id) {
                continue
            }
            let filedInpList = $(tr).find('[name]')
            let one = {}
            for (let j = 0; j < filedInpList.length; ++j) {
                let filedInp = filedInpList[j]
                one[filedInp.getAttribute('name')] = filedInp.value
            }
            data.push(one)
        }
        if (isArray === 'false') {
            return data[0]
        }
        return data;
    }

});

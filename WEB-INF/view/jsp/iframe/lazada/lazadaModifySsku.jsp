<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <title>一键新增子SKU</title>
    <style>
        .dis_flex {
            display: flex;
            justify-content: space-between;
        }

        .w_100 {
            width: 100px;
        }

        .numCount {
            border: 1px solid #e8e8e8;
            border-bottom: none;
            display: inline-block;
            padding: 0 5px;
            text-align: center;
            line-height: 30px;
        }

        .mg_10 {
            margin: 0 10px;
        }
    </style>
    <div class="layui-fluid" id="LAY_lazadaModifySsku">
        <div class="layui-row layui-col-space15">
            <div style="color:red;">
                <p> 提示：</p>
                <p>1.列表初始化时显示的子SKU为所选listing关联的基础模板中新增的子SKU(可编辑)，和所选listing下已有的子SKU(不可编辑)。无子OA属性(未分层)、平台属性分两层的listing会被过滤掉不显示在列表中；</p>
                <p>2.子SKU信息列表中，仅输入框中的数值支持修改；</p>
                <p>3.点击“提交”按钮则将列表中选中的子SKU新增至对应的listing，列表中无子SKU数据的父SKU将会过滤，不新增子SKU</p>
            </div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <div style="display:flex;width:400px;">
                            <div style="width:130px;">商品SKU</div>
                            <input class="layui-input lazadaMS-addSku-input" placeholder="支持添加父，子SKU，用逗号分隔"/>
                            <button type="button" id="lazadaMS_addSku" class="layui-btn layui-btn-normal layui-btn-sm">新增变种</button>
                        </div>
                    </div>
                    <div class="dis_flex layui-card-body">
                        <div class="w_100 numCount" style="text-align:center;padding:0 5px;">数量(<span
                                id="tolnum_span_lazada_modifyssku"></span>)
                        </div>
                        <div class="dis_flex mg_10">
                            <button type="button" id="modifyStockButtn" class="layui-btn layui-btn-normal layui-btn-sm">
                                批量修改提交
                            </button>
                        </div>
                    </div>
                    <div class="layui-card-body">
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table" id="lazadaModifySskuTable" lay-filter="lazadaModifySskuTable">
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <%-- 子sku详情 --%>
    <script type="text/html" id="lazada_online_modifySsku_tpl">
        <table class="layui-table colspantable tableid_{{d.id}}" lay-skin="line" data-tabledata='{{JSON.stringify(d)}}' style="margin-left:
        -5px;font-size: 12px;width: 100%">
            {{# layui.each(d.allResDTOS, function(index, item){ }}
                <tr data-trdata='{{JSON.stringify(item)}}' data-index='{{index}}'><td style="width:150px;text-align: left;padding-left: 5px;color:
                #000;word-break: break-all;font-size: 12px;">
                <p>{{item.storeSSku || item.subSSku}}</p>
                </td>
                <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                <p>{{ item.oacolor || '-'}}</p>
                </td>
                <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                <p>{{ item.oasize || '-'}}</p>
                </td>
                <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                <p>{{ item.oastyle || '-'}}</p>
                </td>
                <td style="width:170px;text-align: center;color: #000;font-size: 12px;padding:10px;">
                    <div style="display:flex;justify-content:center;align-items:center;">
                        <div style="width:75px">{{item.oa[0]?item.oa[0].name:''}}</div>
                        {{# if(!item.ifExist){ }}
                            <input class="layui-input oa0" style="width:75px" value="{{item.oa[0]?item.oa[0].val:''}}"/>
                        {{# } else { }}
                            <div style="width:75px" class="oa0Text">{{item.oa[0]?item.oa[0].val:''}}</div>
                        {{#} }}
                    </div>
                </td>
                <td style="width:120px;text-align: center;color: #000;font-size: 12px;padding:10px;">
                    {{# if(!item.ifExist){ }}
                        <input class="layui-input specialPrice" value="{{item.specialPrice||''}}"/>
                    {{# } else { }}
                        <div class="specialPriceText">{{item.specialPrice || ''}}</div>
                    {{#} }}
                </td>
                <td style="width:100px;text-align: center;color: #000;font-size: 12px;"><img width="60" height="60" class="img_show_hide lazy" data-original="{{item.thumbnail}}" src="{{item.thumbnail}}!size=60x60" data-onerror="layui.admin.img_noFind()"> </td>
                <td style="width:80px;text-align: center;font-size: 12px;">
                {{# if(!item.ifExist){ }}
                    <span style="color: red;cursor:pointer" onClick="delete_lazadaModifySsku({{d.id}},{{index}})">移除</span>
                {{# } else { }}
                    -
                {{#} }}
                </td>
                <td class="result" style="text-align: center;color: #000;font-size: 12px;"></td>
                </tr>
            {{# }); }}
        </table>
        <a class="toggleText{{d.id}}" href="javascript:" style="width:860px;float: right;color: #428bca" onClick="toggle_lazadaModifySsku({{d.id}}, this)">+显示原子sku</a>
    </script>
        <script>
            let lazadaMT_thSelect = [];
            let lazadaMT_tableData;
            layui.use(['admin', 'form', 'layer', 'table', 'element'], function () {
                let form = layui.form,
                    layer = layui.layer,
                    table = layui.table,
                    $ = layui.$,
                    tableIns = {};

                //表格渲染结果
                //展示已知数据
                let checkTableData = layui.table.checkStatus("lazada_online_data_table").data;
                if (checkTableData.length > 0) {
                    checkTableData.forEach(item => {
                        item.storeSubSkus = item.sub ? item.sub.map(item => item.storeSubSku):[]
                        item.subId = item.sub ? item.sub[0].id : ''
                        item.storeSubSku = item.sub ? item.sub[0].storeSubSku : ''
                        item.storeSubId = item.sub ? item.sub[0].storeSubId : ''
                    })
                    commonReturnPromise({
                        isLoading: false,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        url: `${ctx}/onlineProductLazada/getItemAddSkus`,
                        params: JSON.stringify(checkTableData)
                    }).then(res => {
                        if (res) {
                            res.forEach(item => {
                                item.existResDTOS?.forEach(item => {
                                    item.ifExist = true;
                                    let attrKeyVal = JSON.parse(item.attrKeyVal), arr = [];
                                    for (let key in attrKeyVal) {
                                        arr.push({ 'name': key, 'val': attrKeyVal[key] })
                                    }
                                    item['oa'] = arr
                                })
                                item.subResDTOS && item.subResDTOS.forEach(cItem => {
                                    let attrKeyVal = JSON.parse(cItem.attrKeyVal), arr = [];
                                    for (let key in attrKeyVal) {
                                        arr.push({ 'name': key, 'val': attrKeyVal[key] })
                                    }
                                    cItem['oa'] = arr
                                })
                                item.allResDTOS = item.subResDTOS ? item.subResDTOS.concat(item.existResDTOS || []): item.existResDTOS
                             })
                            tableReload(res);
                        }else{
                            tableReload([]);
                        }
                    })
                }

                //批量修改提交
                $('#modifyStockButtn').click(function () {
                    //获取表格行对象
                    let trObj = $('#lazadaModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                    let arr = new Array();
                    let errMsg = '';
                    for (let i = 0; i < trObj.length; i++) {
                        let checkState = trObj.eq(i).find('td[data-field="checkedbox"]').find('input').is(":checked");
                        //只修改选中的
                        if (checkState) {
                            let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                            let obj = new Object();
                            obj = trObj.eq(i).find("table").data("tabledata")
                            obj.subResDTOS = []
                            for (let j = 0; j < trObj_sku.length; j++) {
                                let trData = trObj_sku.eq(j).data("trdata"),newObj={};
                                trData.specialPrice = $.trim(trObj_sku.eq(j).find('.specialPrice').val()) || $.trim(trObj_sku.eq(j).find('.specialPriceText').text());
                                trData.specialPrice == ''?errMsg = "请将数据填写完整":''
                                trData.oa[0] ? trData.oa[0].val = $.trim(trObj_sku.eq(j).find('.oa0').val()) || $.trim(trObj_sku.eq(j).find('.oa0Text').text()) : '';
                                newObj[trData.oa[0].name] = trData.oa[0].val
                                trData.oa[0].val == ''?errMsg = "请将数据填写完整":''
                                trData.attrKeyVal = JSON.stringify(newObj)
                                obj.subResDTOS.push(trData)
                            }
                            arr.push(obj)
                        }
                    }
                    arr?.forEach(item => {
                        let existResDTOSskus = item.existResDTOS?.map(cItem => cItem.subSSku)
                        item.subResDTOS = item.subResDTOS?.filter(cItem => !existResDTOSskus?.includes(cItem.storeSSku) && !existResDTOSskus.includes(cItem.subSSku))
                    })
                    if (arr == null || arr.length == 0) {
                        layer.msg("请选择需要修改的商品！");
                        return;
                    }
                    if (errMsg != '') {
                        layer.msg(errMsg);
                        return;
                    }
                    commonReturnPromise({
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        url: `${ctx}/onlineProductLazada/updateItemAddSkus`,
                        params: JSON.stringify(arr)
                    }).then(res => {
                        let result = {}
                        res.forEach(item => {
                            item.subResDTOS.forEach(cItem => {
                                result[cItem.storeSSku] = cItem.message
                            })
                        })
                        let trObj = $('#lazadaModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                        for (let i = 0; i < trObj.length; i++) {
                            let checkState = trObj.eq(i).find('td[data-field="checkedbox"]').find('input').is(":checked");
                            //只修改选中的
                            if (checkState) {
                                let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                                let obj = new Object();
                                obj = trObj.eq(i).find("table").data("tabledata")
                                for (let j = 0; j < trObj_sku.length; j++) {
                                    let trData = trObj_sku.eq(j).data("trdata")
                                    if (!trData.ifExist) {
                                        if (result[trData.storeSSku]) {
                                            trObj_sku.eq(j).find('.result').html("<div style='color:red'>" + result[trData.storeSSku] + "</div>");
                                        } else {
                                            trObj_sku.eq(j).find('.result').html("<div style='color:green'>操作成功</div>");
                                        }
                                    }
                                }
                            }
                        }
                    })
                });

                <%--    新增变种--%>
                $("#lazadaMS_addSku").click(function(){
                    let skus = $(".lazadaMS-addSku-input").val();
                    let checkTableData = layui.table.checkStatus("lazadaModifySskuTable").data;
                    if(skus == ''||checkTableData.length == 0){
                        return layer.msg('请输入sku，并选择需要添加的数据',{icon:7})
                    }
                    let checkTableData_p = layui.table.checkStatus("lazada_online_data_table").data,idObj = {};
                    checkTableData.forEach(item => {
                        idObj[item.id] = item.subResDTOS?item.subResDTOS.map(item => item?.subSSku):[];
                    })
                    let params = checkTableData_p.filter(item => {
                        item.storeSubSkus = item.sub ? item.sub.map(item => item.storeSubSku):[]
                        item.subId = item.sub ? item.sub[0].id : ''
                        item.storeSubSku = item.sub ? item.sub[0].storeSubSku : ''
                        item.storeSubId = item.sub ? item.sub[0].storeSubId : ''
                        if(idObj[item.id]){
                            item['prodSSkus'] = idObj[item.id]
                        }
                        return idObj[item.id]
                    })

                    // 新增之前先保存可能修改的子sku 把input当中修改的复制到data中
                    //获取表格行对象
                    let trObj = $('#lazadaModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                    let arr = new Array();
                    let errMsg = '';
                    for (let i = 0; i < trObj.length; i++) {
                        let checkState = trObj.eq(i).find('td[data-field="checkedbox"]').find('input').is(":checked");
                        //只修改选中的
                        if (checkState) {
                            let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                            let obj = new Object();
                            obj = trObj.eq(i).find("table").data("tabledata") || {}
                            obj.subResDTOS = []
                            
                            for (let j = 0; j < trObj_sku.length; j++) {
                                let trData = trObj_sku.eq(j).data("trdata"),newObj={};
                                if (!trData.ifExist) {
                                    trData.specialPrice = $.trim(trObj_sku.eq(j).find('.specialPrice').val());
                                    let newObj = {}
                                    trData.oa[0] ? trData.oa[0].val = $.trim(trObj_sku.eq(j).find('.oa0').val()) : '';
                                    newObj[trData.oa[0].name] = trData.oa[0].val
                                    trData.attrKeyVal = JSON.stringify(newObj)
                                    obj.subResDTOS.push(trData)
                                }
                            }
                            arr.push(obj)
                        }
                    }
                    lazadaMT_tableData?.forEach(item => {
                        arr?.forEach(cItem => {
                            if(item.id == cItem.id && cItem.subResDTOS) {
                                item.subResDTOS = cItem.subResDTOS;
                                item.allResDTOS = item.subResDTOS?.concat(item.existResDTOS || [])
                            }
                        })
                    })

                    commonReturnPromise({
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        url: `${ctx}/onlineProductLazada/getItemAddSkusBySkus?skus=` + skus,
                        params: JSON.stringify(params)
                    }, false).then(res => {
                        if (!res.data) {
                            return layer.msg('没有可新增的子sku', { icon: 5 });
                        }

                        let id_sub = {};
                        <%--    转换key-val结构--%>
                        res.data?.forEach(item => {
                            item.subResDTOS && item.subResDTOS.forEach(cItem => {
                                let attrKeyVal = JSON.parse(cItem.attrKeyVal), arr = [];
                                for (let key in attrKeyVal) {
                                    arr.push({ 'name': key, 'val': attrKeyVal[key] })
                                }
                                cItem['oa'] = arr
                            })
                            id_sub[item.id] = item.subResDTOS
                        })
                        <%--    将数据塞到表, 格整体的数据中，重新渲染整个表格--%>
                            lazadaMT_tableData.forEach(item => {
                                res.data?.forEach(cItem => {
                                    if(item.id == cItem.id && id_sub[item.id]){
                                        item['subResDTOS'] = item.subResDTOS?item.subResDTOS.concat(id_sub[item.id]):id_sub[item.id];
                                        item.allResDTOS = item.subResDTOS?.concat(item.existResDTOS || [])
                                    }
                                })
                            })
                        tableReload(lazadaMT_tableData)
                        layer.msg("新增成功",{icon:1})
                    })
                })

            });
            function toggle_lazadaModifySsku(id, self) {
                let current = $('.toggleText' + id).text();
                saveEditData()
                if (current == '+显示原子sku') {
                    $('.toggleText' + id).html('-隐藏原子sku')
                    // 展开
                    $('.tableid_' + id).find('td')?.each(function (index, item) { 
                        let trData = $(item).parent('tr').data("trdata");
                        if (trData.ifExist) {
                            $(item).show()
                        }
                    })
                } else {
                    $('.tableid_' + id).find('td')?.each(function (index, item) { 
                        let trData = $(item).parent('tr').data("trdata");
                        if (trData.ifExist) {
                            $(item).css('display', 'none')
                        }
                    })
                    $('.toggleText' + id).html('+显示原子sku')
                }
            }

            function delete_lazadaModifySsku(id, index) {
                let layeroIndex = layer.confirm('确认删除子SKU吗', { btn: ['确认', '取消'] },
                    function () {
                        $(".tableid_" + id).find(`tr[data-index=${'${index}'}]`).remove()
                        layer.close(layeroIndex)
                        // 删除lazadaMT_tableData中的数据
                        lazadaMT_tableData?.forEach(item => {
                            if (item.id == id) {
                                //item.subResDTOS = item.subResDTOS?.filter((cItem, cIndex) => cIndex !== index);
                                item.allResDTOS = item.allResDTOS?.filter((cItem, cIndex) => cIndex !== index);
                                let itemId = item.allResDTOS[index]?.id
                                item.subResDTOS = item.subResDTOS?.filter((cItem, cIndex) => cItem.id !== itemId);
                            }
                        })
                    })
            }

            function saveEditData() {
                // 保存可能修改的子sku 把input当中修改的复制到data中
                //获取表格行对象
                let trObj = $('#lazadaModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                let arr = new Array();
                let errMsg = '';
                for (let i = 0; i < trObj.length; i++) {
                        let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                        let obj = new Object();
                        obj = trObj.eq(i).find("table").data("tabledata") || {}
                        obj.subResDTOS = []
                        for (let j = 0; j < trObj_sku.length; j++) {
                            let trData = trObj_sku.eq(j).data("trdata"),newObj={};
                            trData.specialPrice = $.trim(trObj_sku.eq(j).find('.specialPrice').val()) || $.trim(trObj_sku.eq(j).find('.specialPriceText').text());
                            trData.oa[0].val = $.trim(trObj_sku.eq(j).find('.oa0').val()) || $.trim(trObj_sku.eq(j).find('.oa0Text').text());
                            obj.subResDTOS.push(trData)
                        }
                        arr.push(obj)
                }
                lazadaMT_tableData?.forEach(item => {
                    arr?.forEach(cItem => {
                        if(item.id == cItem.id && cItem.subResDTOS) {
                            item.subResDTOS = cItem.subResDTOS;
                        }
                    })
                })
            }

            function tableReload(data, callback) {
                lazadaMT_tableData = data;
                tableIns = layui.table.render({
                    elem: "#lazadaModifySskuTable",
                    cols: [[
                        { type: "checkbox", field: "checkedbox" },
                        { field: "storeAcctName", title: "店铺", width: 150 },
                        { field: "prodPSku", title: "父SKU", width: 120 },
                        {
                            unresize: true, field: "ssku", title: `<div style='width:150px;float: left;'>子SKU</div>
                            <div style='width:80px;float: left;'>oa颜色</div>
                            <div style='width:80px;float: left;'>oa尺寸</div>
                            <div style='width:80px;float: left;'>oa款式</div>
                            <div style='width:170px;float: left;'>平台属性</div>
                            <div style='width:120px;float: left;'>促销价(当地币种)</div>
                            <div style='width:100px;float: left;'>子属性图</div>
                            <div style='width:80px;float: left;'>操作</div>
                            <div>提交结果</div>` ,
                            style: "vertical-align: top;", templet: '#lazada_online_modifySsku_tpl'
                        }
                    ]],
                    page: false,
                    height: 500,
                    id: "lazadaModifySskuTable",
                    limit: data.length,
                    data: data,
                    done: function (res, curr, count) {
                        $("#tolnum_span_lazada_modifyssku").text("共 " + count + " 条");
                        $("#lazadaModifySskuTable").next().find(".layui-table-header").css('overflow', 'visible')
                        callback && callback()
                        //获取表格行对象
                        let trObj = $('#lazadaModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                        for (let i = 0; i < trObj.length; i++) {
                                let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                                obj = trObj.eq(i).find("table").data("tabledata")
                                for (let j = 0; j < trObj_sku.length; j++) {
                                    let trData = trObj_sku.eq(j).data("trdata");
                                    if (trData.ifExist) {
                                        $(trObj_sku.eq(j)).find('td')?.each(function (index, item) { 
                                            $(item).css('color', '#aaa')
                                            $(item).css('display', 'none')
                                        })
                                        
                                    }
                                }
                        }
                    }
                });
            }
            
        </script>
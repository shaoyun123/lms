<%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <title>编辑子SKU</title>
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
       .red_warning{
            color: red;
            border: 1px solid red;
        }
        .red_warning:hover,
        .red_warning:focus{
            border: 1px solid red!important;
        }
    </style>
    <div class="layui-fluid" id="LAY_shopeeModifySsku">
        <div class="layui-row layui-col-space15">
            <div style="color:red;">
                <p> 提示：</p>
                <p>1.listing无子属性(未分层）、listing两层属性、一对多的listing会被过滤掉不显示在列表中</p>
                <p>2.子SKU信息列表中，仅输入框中的数值支持修改</p>
                <p>3.点击“一键提交”按钮则将列表中选中的子SKU新增至对应的listing</p>
            </div>
            <div class="layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body" style="display:flex;justify-content: space-between;">
                        <div style="display:flex;width:400px;">
                            <div style="width:130px;">商品SKU</div>
                            <input class="layui-input shopeeMS-addSku-input" placeholder="支持添加父，子SKU，用英文逗号分隔" value=""/>
                            <button type="button" id="shopeeMS_addSku" class="layui-btn layui-btn-normal layui-btn-sm">新增属性</button>
                        </div>
                        <div>
                            <button type="button" id="shopeeModifyStockButtn" class="layui-btn layui-btn-normal layui-btn-sm">
                                一键提交
                            </button>
                        </div>
                    </div>
                    <div class="layui-card-body">
                        <!-- 表格的数据渲染 -->
                        <table class="layui-table" id="shopeeModifySskuTable" lay-filter="shopeeModifySskuTable">
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/html" id="shopee_online_psku_tpl">
        <div style="text-align:center;">
            <div>{{d.storeAcct}}</div>
            <div>[item_id:{{d.itemId}}]</div>
        </div>
    </script>
    <script type="text/html" id="shopee_online_modifyRes_tpl">
        <div class="result" style="text-align: center;color: #000;font-size: 12px">
        </div>
    </script>
    <%-- 子sku详情 --%>
    <script type="text/html" id="shopee_online_modifySsku_tpl">
            <table class="layui-table colspantable tableid_{{d.itemId}}" lay-skin="line" data-tabledata='{{JSON.stringify(d)}}' style="margin-left:
            -5px;font-size: 12px;">
                {{# layui.each(d.allResDTOS, function(index, item){ }}
                    <tr data-trdata='{{JSON.stringify(item)}}' data-index='{{index}}'>
                        <td style="width:170px;text-align: left;padding-left: 5px;color:
                        #000;word-break: break-all;font-size: 12px;">
                            <p>{{item.storeProdSSku}}</p>
                        </td>
                        <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                            <p>{{ item.oaColor || '-'}}</p>
                        </td>
                        <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                            <p>{{ item.oaSize || '-'}}</p>
                        </td>
                        <td style="width:80px;text-align: center;color: #000;font-size: 12px;">
                            <p>{{ item.oaStyle || '-'}}</p>
                        </td>
                        <td style="width:170px;text-align: center;color: #000;font-size: 12px;padding:10px;">
                            <div style="display:flex;justify-content:center;align-items:center;">
                                <div style="width:75px">{{d.platAttributeKey||''}}</div>
                                    <input class="layui-input oa0" style="width:75px" value="{{item.platAttributeValue}}"/>
                            </div>
                        </td>
                        <td style="width:120px;text-align: center;color: #000;font-size: 12px;padding:10px;">
                            {{# if(!item.ifExist){ }}
                                <input class="layui-input localPromotionPrice {{item.overLimit ? 'red_warning' : ''}}" onblur="verify_shopeePriceDifference({{d.itemId}},this)" value="{{item.localPromotionPrice||''}}"/>
                            {{# } else { }}
                                <div class="localPromotionPriceText {{item.overLimit ? 'fRed' : ''}}">{{item.localPromotionPrice || ''}}</div>
                            {{#} }}
                        </td>
                        <td style="width:100px;text-align: center;color: #000;font-size: 12px;">
                            <img width="60" height="60" class="img_show_hide lazy" data-original="{{item.attributeImage}}" src="{{item.attributeImage}}!size=60x60" data-onerror="layui.admin.img_noFind()">
                        </td>
                        <td style="width:100px;text-align: center;font-size: 12px">
                            <span style="color: red;cursor:pointer" onClick="delete_shopeeModifySsku({{d.itemId}},{{item.prodSId}},{{item.ifExist}},{{index}})">移除</span>
                        </td>
                    </tr>
                {{# }); }}
            </table>
        <a class="toggleText{{d.itemId}}" href="javascript:" style="width:860px;float: right;color: #428bca;margin-right: 20px;text-align: right;" onClick="toggle_shopeeModifySsku({{d.itemId}}, this)">+显示原子sku</a>
    </script>
        <script>
            let shopeeMT_thSelect = [];
            let shopeeMT_tableData;
            layui.use(['admin', 'form', 'layer', 'table', 'element'], function () {
                let form = layui.form,
                    layer = layui.layer,
                    table = layui.table,
                    $ = layui.$,
                    tableIns = {};

                //表格渲染结果
                //展示已知数据
                let checkTableData = layui.table.checkStatus("shopee_online_data_table").data;
                if (checkTableData.length > 0) {
                    let itemIdList = checkTableData?.map(item => item.itemId) || []
                    // tableReload(mockData)
                    commonReturnPromise({
                        isLoading: false,
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        url: `${ctx}/shopee/onlineProductShopee/queryNewAddSku`,
                        params: JSON.stringify(itemIdList)
                    }).then(res => {
                        if (res) {
                            res.forEach(item => {
                                item.listingExistSSkuList?.forEach(v => {
                                    v.ifExist = true;
                                })
                                item.allResDTOS = (item.newAddTempSSkuList || []).concat(item.listingExistSSkuList || [])
                                calculate_shopeeModifySsku(item)
                             })
                            tableReload(res);
                        }else{
                            tableReload([]);
                        }
                    })
                }

                function tableReload(data) {
                    shopeeMT_tableData = data;
                    tableIns = table.render({
                        elem: "#shopeeModifySskuTable",
                        cols: [[
                            { type: "checkbox", field: "checkedbox" },
                            { title: "店铺/产品", width: 150, templet: '#shopee_online_psku_tpl' },
                            { field: "prodPSku", title: "父SKU", width: 120 },
                            {
                                unresize: true, field: "ssku", title: `<div style="display: flex;"><div style='width:170px;'>子SKU</div>
                                <div style='width:80px;'>OA颜色</div>
                                <div style='width:80px;'>OA尺寸</div>
                                <div style='width:80px;'>OA款式</div>
                                <div style='width:170px;'>平台属性</div>
                                <div style='width:120px;'>促销价(当地币种)</div>
                                <div style='width:100px;'>子属性图</div>
                                <div style='width:100px;'>操作</div></div>` ,
                                style: "vertical-align: middle;", templet: '#shopee_online_modifySsku_tpl'
                            },
                            { field: "", title: "提交结果", width: 250, templet: '#shopee_online_modifyRes_tpl' },
                        ]],
                        page: false,
                        height: 500,
                        id: "shopeeModifySskuTable",
                        limit: data.length,
                        data: data,
                        done: function (res, curr, count) {
                            $("#tolnum_span_shopee_modifyssku").text("共 " + count + " 条");
                            $("#shopeeModifySskuTable").next().find(".layui-table-header").css('overflow', 'visible')
                            //获取表格行对象
                            let trObj = $('#shopeeModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                            for (let i = 0; i < trObj.length; i++) {
                                let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                                obj = trObj.eq(i).find("table").data("tabledata")
                                for (let j = 0; j < trObj_sku.length; j++) {
                                    let trData = trObj_sku.eq(j).data("trdata");
                                    if (trData.ifExist) {
                                        $(trObj_sku.eq(j)).find('td')?.each(function (index, item) { 
                                            $(item).css('display', 'none')
                                        })
                                    }
                                }
                            }
                        }
                    });
                }

                //批量修改提交
                $('#shopeeModifyStockButtn').click(function () {
                    //获取表格行对象
                    let trObj = $('#shopeeModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                    let arr = new Array();
                    let errMsg = '';
                    for (let i = 0; i < trObj.length; i++) {
                        let checkState = trObj.eq(i).find('td[data-field="checkedbox"]').find('input').is(":checked");
                        //只修改选中的
                        if (checkState) {
                            let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                            let obj = new Object();
                            obj = trObj.eq(i).find("table").data("tabledata") || {}
                            obj.newAddTempSSkuList = []
                            obj.listingExistSSkuList = []
                            for (let j = 0; j < trObj_sku.length; j++) {
                                let trData = trObj_sku.eq(j).data("trdata"),newObj={};
                                <!-- 促销商品 -->
                                if(obj.isPromotion && trData.overLimit){
                                    errMsg = "存在子属性商品促销价超过价差限制的listing"
                                }
                                trData.platAttributeValue = $.trim(trObj_sku.eq(j).find('.oa0').val());
                                trData.platAttributeValue == ''?errMsg = "请将数据填写完整":''
                                if(!trData.ifExist){
                                    trData.localPromotionPrice = $.trim(trObj_sku.eq(j).find('.localPromotionPrice').val());
                                    trData.localPromotionPrice == ''?errMsg = "请将数据填写完整":''
                                    obj.newAddTempSSkuList.push(trData)
                                }else{
                                    obj.listingExistSSkuList.push(trData)
                                }
                            }
                            arr.push(obj)
                        }
                    }
                    if (arr == null || arr.length == 0) {
                        layer.msg("请选择需要修改的商品！");
                        return;
                    }
                    if (errMsg != '') {
                        layer.msg(errMsg);
                        return;
                    }
                    if(arr.some(v=>!v.listingExistSSkuList.length)){
                        layer.msg("存在选中listing下没已有的子属性商品，请重新选择");
                        return;
                    }
                    commonReturnPromise({
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        url: `${ctx}/shopee/onlineProductShopee/submitNewAddSSku`,
                        params: JSON.stringify(arr)
                    }).then(res => {
                        let result = {}
                        res.forEach(item => {
                            result[item.itemId] = item.operationLog
                        })
                        console.log('result', result)
                        let trObj = $('#shopeeModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                        
                        
                        $(trObj)?.each((index, item) => {
                            let trData = $(item).find("table").data("tabledata")
                            console.log("🚀 ~ trData:", trData);
                            let checkState = $(item).find('td[data-field="checkedbox"]').find('input').is(":checked");
                            if (checkState) {
                                $(item).find('.result').html("<div style='color:red'>" + result[trData.itemId] + "</div>")
                            }
                        })
                    })
                });

                <%--    新增变种--%>
                $("#shopeeMS_addSku").click(function(){
                    let skus = $(".shopeeMS-addSku-input").val();
                    let checkTableData = layui.table.checkStatus("shopeeModifySskuTable").data;
                    if(skus == ''){
                        return layer.msg('请输入SKU',{icon:7})
                    }
                    if(checkTableData.length == 0){
                        return layer.msg('请选择需要添加子SKU的数据',{icon:7})
                    }
                    let params = {
                        itemIdList: checkTableData.map(item => item.itemId) || [],
                        skuList: skus.split(',') || []
                    }
                    // 新增之前先保存可能修改的子sku 把input当中修改的复制到data中
                    //获取表格行对象
                    let trObj = $('#shopeeModifySskuTable').next().find('.layui-table-body tbody').find('tr');
                    let arr = new Array();
                    let errMsg = '';
                    for (let i = 0; i < trObj.length; i++) {
                        let checkState = trObj.eq(i).find('td[data-field="checkedbox"]').find('input').is(":checked");
                        //只修改选中的
                        if (checkState) {
                            let trObj_sku = trObj.eq(i).find('td[data-field="ssku"] tr')
                            let obj = new Object();
                            obj = trObj.eq(i).find("table").data("tabledata") || {}
                            obj.allResDTOS = []
                            obj.newAddTempSSkuList = []
                            obj.listingExistSSkuList = []
                            for (let j = 0; j < trObj_sku.length; j++) {
                                let trData = trObj_sku.eq(j).data("trdata"),newObj={};
                                trData.platAttributeValue = $.trim(trObj_sku.eq(j).find('.oa0').val());
                                if(!trData.ifExist){
                                    trData.localPromotionPrice = $.trim(trObj_sku.eq(j).find('.localPromotionPrice').val());
                                    obj.newAddTempSSkuList.push(trData)
                                }else{
                                    obj.listingExistSSkuList.push(trData)
                                }
                            }
                            arr.push(obj)
                        }
                    }
                    shopeeMT_tableData?.forEach(item => {
                        arr?.forEach(cItem => {
                            if(item.itemId == cItem.itemId) {
                                if(cItem.newAddTempSSkuList){
                                    item.newAddTempSSkuList =cItem.newAddTempSSkuList
                                }
                                if(cItem.listingExistSSkuList){
                                    item.listingExistSSkuList =cItem.listingExistSSkuList
                                }
                            }
                        })
                    })

                    commonReturnPromise({
                        type: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        url: `${ctx}/shopee/onlineProductShopee/addAttributeSku`,
                        params: JSON.stringify(params)
                    }).then(res => {
                        // 将数据塞到表格整体的数据中，重新渲染整个表格
                        let allNewAddTempSSkuList = [];
                        shopeeMT_tableData.forEach(item => {
                            res?.forEach(cItem => {
                                if(item.itemId == cItem.itemId){
                                    item['newAddTempSSkuList'] = item.newAddTempSSkuList ? cItem.newAddTempSSkuList ? item.newAddTempSSkuList.concat(cItem.newAddTempSSkuList): item.newAddTempSSkuList : cItem.newAddTempSSkuList;
                                    item.newSkuSize = cItem.newSkuSize;
                                    allNewAddTempSSkuList = cItem.newAddTempSSkuList ? allNewAddTempSSkuList.concat(cItem.newAddTempSSkuList) : allNewAddTempSSkuList;
                                }
                            })
                        })
                        // 去重 子sku
                        shopeeMT_tableData.forEach(obj => {
                            obj.newAddTempSSkuList = obj.newAddTempSSkuList?.filter((item, index, self) => {
                                let prodSIds = self.map(i => i.prodSId);
                                return !prodSIds.slice(0, index).includes(item.prodSId);
                            });
                            obj.listingExistSSkuList = obj.listingExistSSkuList?.filter((item, index, self) => {
                                let prodSIds = self.map(i => i.prodSId);
                                return !prodSIds.slice(0, index).includes(item.prodSId);
                            });
                            obj.allResDTOS = obj.newAddTempSSkuList?.concat(obj.listingExistSSkuList || [])
                            calculate_shopeeModifySsku(obj)
                        });

                        tableReload(shopeeMT_tableData)
                        if (allNewAddTempSSkuList?.length === 0) {
                            layer.msg("没有可新增的子SKU", { icon: 2 })
                        } else {
                            layer.msg("新增成功",{icon:1})
                        }
                    })
                })
            });

            function delete_shopeeModifySsku(itemId, prodSId, ifExist,index) {
                <!-- listingExistSSkuList里至少要有一条数据 -->
                let listingExistSSkuListLength;
                shopeeMT_tableData?.forEach(item => {
                    if (item.itemId == itemId) {
                        listingExistSSkuListLength = item.listingExistSSkuList.length;
                    }
                })
                if(listingExistSSkuListLength === 1 && ifExist){
                    layer.msg('原子sku至少存在一条数据')
                }else{
                    let layeroIndex = layer.confirm('确认删除该子SKU吗', { btn: ['确认', '取消'] },
                        function () {
                            $(".tableid_" + itemId).find(`tr[data-index=${'${index}'}]`).remove()
                            layer.close(layeroIndex)
                            verify_shopeePriceDifference(itemId)
                            // 删除shopeeMT_tableData中的数据
                            shopeeMT_tableData?.forEach(item => {
                                if (item.itemId == itemId) {
                                    item.newAddTempSSkuList = item.newAddTempSSkuList?.filter((cItem, cIndex) =>cItem.prodSId != prodSId);
                                    item.listingExistSSkuList = item.listingExistSSkuList?.filter((cItem, cIndex) =>cItem.prodSId != prodSId);
                                }
                            })
                        })
                }
            }

            <!--促销商品需要判断差价,子属性商品刊登价超过对应站点的价差倍数限制时，最高和最低价格信息标红  -->
            function verify_shopeePriceDifference(itemId, curThis=''){
                const trTableDom = $('.tableid_' + itemId)
                const { mutiNum, isPromotion } = trTableDom.data('tabledata') || {}
                if(!Number($(curThis).val()) || Number($(curThis).val()<0)){
                    $(curThis).val('')
                }
                <!-- 不支持填写0 -->
                if(isPromotion){
                    const arr = []
                    trTableDom.find('tr')?.each(function (index, item) { 
                        const trData = $(this).data('trdata')||{}
                        let localPromotionPrice = $(this).find('.localPromotionPrice').val() || ''
                        if(trData.ifExist){
                            localPromotionPrice = trData.localPromotionPrice
                        }
                        arr.push(localPromotionPrice)
                    }) 
                    <!-- 最大值，最小值 -->
                    const _arr = arr.filter(v=>!!Number(v))
                    const min = Math.min(..._arr)
                    const max = Math.max(..._arr)
                    const overLimit = max / min > mutiNum
                    trTableDom.find('tr')?.each(function (index, item) { 
                        const trData = $(this).data('trdata')||{}
                        const localPromotionPriceDom = $(this).find('.localPromotionPrice')
                        const localPromotionPriceTextDom = $(this).find('.localPromotionPriceText')
                        const localPromotionPrice = localPromotionPriceDom.val() || ''
                        <!-- 改文本和边框样式 -->
                        let price = localPromotionPrice
                        let curDom = localPromotionPriceDom
                        let redClass = 'red_warning'
                        if(trData.ifExist){
                            price = trData.localPromotionPrice || ''
                            curDom = localPromotionPriceTextDom
                            redClass = 'fRed'
                        }
                        const isEqual = price == min || price == max
                        if(overLimit && isEqual){
                            curDom.addClass(redClass)
                        }else{
                            curDom.removeClass(redClass)
                        }
                        <!-- 更新 overLimit-->
                        trData.overLimit = overLimit
                        $(this).data('trdata',trData)
                        shopeeMT_tableData?.forEach(item => {
                            if (item.itemId == itemId) {
                                item.overLimit = overLimit
                            }
                        })
                    })
                }
            }

            function calculate_shopeeModifySsku(obj){
                <!-- 促销商品需要判断差价 -->
                if(obj.isPromotion){
                    const arr = (obj.listingExistSSkuList || []).concat(obj.newAddTempSSkuList || []).map(v=>v.localPromotionPrice||'').filter(v=>!!Number(v))
                    const min = Math.min(...arr)
                    const max = Math.max(...arr)
                    const overLimit = max / min > obj.mutiNum
                    if(overLimit){
                        (obj.listingExistSSkuList || []).forEach(v=>{
                            const localPromotionPrice = v.localPromotionPrice || ''
                            if(localPromotionPrice == min || localPromotionPrice == max){
                                v.overLimit = true
                            }else{
                                v.overLimit = false
                            }
                        });
                        (obj.newAddTempSSkuList || []).forEach(v=>{
                            const localPromotionPrice = v.localPromotionPrice || ''
                            if(localPromotionPrice == min || localPromotionPrice == max){
                                v.overLimit = true
                            }else{
                                v.overLimit = false
                            }
                        })
                    }
                }
            }

            function toggle_shopeeModifySsku(itemId, self) {
                let current = $('.toggleText' + itemId).text();
                if (current == '+显示原子sku') {
                    $('.toggleText' + itemId).html('-隐藏原子sku')
                    // 展开
                    $('.tableid_' + itemId).find('td')?.each(function (index, item) { 
                        let trData = $(item).parent('tr').data("trdata");
                        if (trData.ifExist) {
                            $(item).show()
                        }
                    })
                } else {
                    $('.tableid_' + itemId).find('td')?.each(function (index, item) { 
                        let trData = $(item).parent('tr').data("trdata");
                        if (trData.ifExist) {
                            $(item).css('display', 'none')
                        }
                    })
                    $('.toggleText' + itemId).html('+显示原子sku')
                }
            }

        </script>
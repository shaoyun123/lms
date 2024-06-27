<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<style>
    #sskuContent .layui-table-body {
        max-height: 250px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .combination-tag {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-left: 10px;
        background-color: rgb(255, 87, 34);
        border-radius: 4px;
        color: white;
        text-align: center;
        line-height: 20px;
    }
</style>
<!--补充采购信息弹出框 -->
<script type="text/html" id="addPurchaseMsgLayer">
  <div class="p20">
      <form class="layui-form" id="addPurchaseMsg" onsubmit="return false">
          <input type="hidden" name="prodId" class="layui-input" lay-verify="required">
          <div class="layui-form-item">
              <div class="layui-col-md6 layui-col-lg6" notNull>
                <label class="layui-form-label"><span style="color: red">*</span>商品父sku：</label>
                <div class="layui-input-block">
                    <input name="psku" type="text" class="layui-input">
                </div>
              </div>
              <div class="layui-col-lg1 layui-col-md1">
                <button class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left: 20px" type="button" onclick="searchSSkuList()">查询</button>
              </div>
          </div>
          <div class="layui-form-item" id="sskuContent">
            <label class="layui-form-label">商品子sku：</label>
            <div class="layui-input-block">
              <table class="layui-table" id="sampleInfoSskuTable" lay-filter="sampleInfoSskuTable" style="max-height: 400px"></table>
            </div>
        </div>
          <div class="layui-form-item">
              <label class="layui-form-label">开发备注：</label>
              <div class="layui-input-block">
                  <textarea class="layui-textarea" class="layui-input" name="samplingNote"></textarea>
              </div>
          </div>
      </form>
  </div>
</script>

<script type="text/html" id="sampleInfoSskuTable_num">
    <input name="num" class="layui-input purchaseNumber" prodSId="{{d.prodSId}}" value="{{d.purchaseNum != null ? d.purchaseNum : ''}}" onchange="changeSSkuInp(this)" onblur="getTotal('one', this)"/>
</script>

<script type="text/html" id="sampleInfoSskuTable_amount">
    <span name="amount"></span>
</script>

<script type="text/html" id="sampleInfoSskuTable_img">
    <img width="60" height="60" src="${tplIVP}/{{ d.image }}" onerror='layui.admin.img_noFind()'
     class="img_show_hide lazy b1">
</script>

<script type="text/html" id="sampleInfoSskuTable_prodSSku">
    <span>{{ d.prodSSku }}</span>
    {{# if(d.isCombination){ }}
        <span class="combination-tag"> 组 </span>
    {{# } }}
</script>


<script>
  layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'laydate', 'element', 'upload', 'formSelects'], function() {
    var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        $ = layui.$,
        laydate = layui.laydate
    form.render()

  })
  var sampleInfoSSkuList = []
  function addSampleInfo(type, data) {
     var index = layer.open({
        type: 1,
        title: '补充采样信息',
        shade: 0, // 遮罩透明度
        area: ['65%', '650px'],
        content: $('#addPurchaseMsgLayer').html(),
        success: function(layero ) {
            if(type === 'newdevelop') {
                $('#addPurchaseMsg [name=\'prodId\']').val(data.id)
                // 弹框底边栏样式
                let $target = layero.find('.layui-layer-btn.layui-layer-btn-')
                let $html = `<button class="layui-btn layui-btn-sm layui-btn-normal" style="position: absolute;left: 30px;margin-top: 5px" id="noNeedSample">无需采样</button>`
                $($target).append($html)
                // 无需采样
                $('#noNeedSample').on('click', function() {
                    noNeedSampleFn(data)
                })
            }
            let searchInput = $('#addPurchaseMsg').find('[name=psku]')
            searchInput[0].addEventListener('keydown', function(event) {
                event = event || window.event;
                if (event.keyCode === 13) { // 回车键的键码为 13
                    searchSSkuList()
                    event.preventDefault()
                    event.stopPropagation()
                }
            });
        },
        btn: ['采样提交', '关闭'],
        yes: function(index, layero) {
            var datas = layui.table.checkStatus('sampleInfoSskuTable').data
            if (!datas.length) {
                layer.msg('请先选择需要采样的商品')
                return false
            }
            let formElem = $('#addPurchaseMsg')
            let purNewProductSamplingDtoList = []
            $('#sskuContent').find('.layui-table-body tr')?.each((index, item) => {
                let params = {
                    prodSId: '',
                    purchaseNum: '',
                    samplingNote: ''
                }
                if ($(item).find('[name=layTableCheckbox]').is(':checked')) {
                    params.prodSId = $(item).find('td[data-field=purchaseNum] input').attr('prodSId') || ''
                    params.purchaseNum = $(item).find('td[data-field=purchaseNum] input').val() || ''
                    params.samplingNote = $('#addPurchaseMsg').find('[name=samplingNote]').val() || ''
                    purNewProductSamplingDtoList.push(params)
                }
            })
            let purchaseNum = purNewProductSamplingDtoList?.map(item => item.purchaseNum)
            if (purchaseNum.some(item => item === ''))
                return layer.msg('请填写勾选数据的采样数量')

            let obj = {}
            if (type === 'newdevelop') {
                obj = {
                    msgPreDevId: data.id,
                    purNewProductSamplingDtoList
                }
            }
            loading.show()
            // 采样提交
            $.ajax({
                type: 'post',
                url: type === 'newdevelop' ? ctx + '/newProductSampling/savePurNewProductSamplingOnPreDev' : ctx + '/newProductSampling/savePurNewProductSampling',
                dataType: 'json',
                data: type === 'newdevelop' ? JSON.stringify(obj) : JSON.stringify(purNewProductSamplingDtoList),
                contentType: 'application/json;charset=UTF-8',
                success: function(returnData) {
                    loading.hide()
                    if (returnData.code == '0000') {
                        layer.closeAll()
                        layer.msg('采样提交成功')
                        // 刷新页面
                        //if(type === 'newdevelop') {
                        //    $('#pd_searchBtn').click()
                        //} else {
                        //    $('[lay-filter=purchaseDemand_submit]').trigger('click')
                        //}
                        refreshTable()
                    } else {
                        layer.msg(returnData.msg)
                    }
                },
                error: function() {
                    loading.hide()
                    layer.msg('发送请求失败')
                }
            })
        }
    })
  }

  function noNeedSampleFn(data) {
    let params = {
        prodId: data.id,
        psku: $('#addPurchaseMsg').find('[name=psku]').val() || '',
        purchaseNote: $('#addPurchaseMsg').find('[name=samplingNote]').val() || ''
    }
    loading.show()
    $.ajax({
        type: 'post',
        url: ctx + '/preProdDev/addPurchase.html',
        dataType: 'json',
        data: params,
        success: function(returnData) {
            loading.hide()
            if (returnData.code == '0000') {
                layer.closeAll()
                layer.msg('操作成功')
                refreshTable()
            } else {
                layer.msg(returnData.msg)
            }
        },
        error: function() {
            loading.hide()
            layer.msg('发送请求失败')
        }
    })
  }
  
    let prodSIdChecked = [];
    //展示 商品子sku
    function searchSSkuList() {
        // 获取父 SKU
        let prodPSku = $('#addPurchaseMsg').find('[name="psku"]').val()
        if (!prodPSku) {
            return layer.msg('请先输入父SKU')
        }
        layui.table.render({
            elem: "#sampleInfoSskuTable",
            id: 'sampleInfoSskuTable',
            method: "post",
            url: ctx + "/newProductSampling/queryByProdPSku",
            totalRow: true, // 开启合计行
            where: { prodPSku },
            contentType: 'application/json',
            cols: [
                [
                    { checkbox: true, width: 30 },
                    {title: "商品子SKU", templet: '#sampleInfoSskuTable_prodSSku', totalRowText: '总计'},
                    {title: "图片",templet: '#sampleInfoSskuTable_img'},
                    {title: "款式", field: 'style'},
                    {title: "采购单价（￥）", field: 'purchasePrice'},
                    {title: `<div style='text-align: left;width:150px'>采样数量</div>
                        <div style="text-align: left">
                            <input id="addSample_batchSet_purchaseNum" style='width:80px;float: left;' class="layui-input" value="0" min="0" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                            <div class="layui-btn layui-btn-normal layui-btn-sm" style='float: right;' id="addSample_batchSet_purchaseNum_btn">批量设置</div>
                        </div>
                    `, field: 'purchaseNum', templet: '#sampleInfoSskuTable_num'},
                    {title: "采购金额", field: 'amount', templet: '#sampleInfoSskuTable_amount'}
                ],
            ],
            limit: 10000,
            unFixedTableHead: true, // 不固定表头
            page: false, //是否显示分页
            done: function(res, curr, count) {
                sampleInfoSSkuList = res.data || []
                getTotal();
                // 监听表格checkbox勾选，获取 prodSId
                // 用于勾选数据数量和金额的合计
                $('#addSample_batchSet_purchaseNum_btn').click(function() {
                    let applyNum = $('#addSample_batchSet_purchaseNum').val()
                    if (!applyNum) {
                        return layer.msg('请输入采购数量', { icon: 2 });
                    }
                    //获取所有的
                    var datas = layui.table.checkStatus('sampleInfoSskuTable').data
                    if (!datas.length) {
                        layer.msg('请先选择需要批量设置的商品')
                        return false
                    }
                    
                    let formElem = $('#addPurchaseMsg')
                    $('#sskuContent').find('.layui-table-body tr')?.each((index, item) => {
                        if ($(item).find('[name=layTableCheckbox]').is(':checked')) {
                            $(item).find('.purchaseNumber').val($('#addSample_batchSet_purchaseNum').val());
                            let currentNum = $(item).find('.purchaseNumber').val()
                            if (currentNum && !/^[-]?\d+$/.test(currentNum)) {
                                return layer.msg('请输入正确格式的采购数量', { icon: 2 });
                            }
                            // 采购数量校验 根据采购成本价
                            let currentPrice = $(item).find('td[data-field=purchasePrice] div').text() || 0
                            if (currentPrice <= 0.5 && currentNum > 10) {
                                layer.msg('采购成本价小于等于0.5时，采购数量不能大于10', { icon: 2 });
                                commonCalcVal()
                                return false
                            }
                            if (currentPrice > 0.5 && currentPrice <= 2 && currentNum > 5) {
                                $(item).find('.purchaseNumber').val('')
                                layer.msg('采购成本价大于0.5小于等于2时，采购数量不能大于5', { icon: 2 });
                                commonCalcVal()
                                return false
                            }
                            if (currentPrice > 2 && currentPrice <= 5 && currentNum > 3) {
                                $(item).find('.purchaseNumber').val('')
                                layer.msg('采购成本价大于2小于等于5时，采购数量不能大于3', { icon: 2 });
                                commonCalcVal()
                                return false
                            }
                            if (currentPrice > 5 && currentPrice <= 10 && currentNum > 2) {
                                $(item).find('.purchaseNumber').val('')
                                layer.msg('采购成本价大于5小于等于10时，采购数量不能大于2', { icon: 2 });
                                commonCalcVal()
                                return false
                            }
                            if (currentPrice > 10 && currentPrice <= 30 && currentNum > 1) {
                                $(item).find('.purchaseNumber').val('')
                                layer.msg('采购成本价大于10小于等于30时，采购数量不能大于1', { icon: 2 });
                                commonCalcVal()
                                return false
                            }
                            if (currentPrice > 30 && currentNum > 0) {
                                $(item).find('.purchaseNumber').val('')
                                layer.msg('采购成本价大于30时，采购数量不能大于0', { icon: 2 });
                                commonCalcVal()
                                return false
                            }
                            commonCalcVal()
                        }
                    })
                });
                layui.table.on('checkbox(sampleInfoSskuTable)', function(obj){
                    if (obj.type === 'one') {
                        let prodSId  = obj.data.prodSId;
                        if (obj.checked) {
                            prodSIdChecked.push(prodSId);
                        } else {
                            prodSIdChecked.splice(prodSIdChecked.indexOf(prodSId), 1);
                        }
                    }
                    if (obj.type === 'all') {
                        if (obj.checked) {
                            prodSIdChecked = res.data?.map(item => item.prodSId);
                        } else {
                            prodSIdChecked = [];
                        }
                    }
                    getTotal();
                });

            }
        });
    }


    // 表格数据采样数量和采购金额 合计
    function getTotal(type, self) {
        if (type === 'one') { // 单个填充采样数量时
            let currentNum = $(self).val()
            if (currentNum && !/^[-]?\d+$/.test(currentNum)) {
                return layer.msg('请输入正确格式的采购数量', { icon: 2 });
            }
            // 采购数量校验 根据采购成本价
            let currentPrice = Number($(self).parents('tr').find('td[data-field=purchasePrice] div').text()) || 0
            if (currentPrice <= 0.5 && currentNum > 10) {
                $(self).val('')
                layer.msg('采购成本价小于等于0.5时，采购数量不能大于10', { icon: 2 });
            }
            if (currentPrice > 0.5 && currentPrice <= 2 && currentNum > 5) {
                $(self).val('')
                layer.msg('采购成本价大于0.5小于等于2时，采购数量不能大于5', { icon: 2 });
            }
            if (currentPrice > 2 && currentPrice <= 5 && currentNum > 3) {
                $(self).val('')
                layer.msg('采购成本价大于2小于等于5时，采购数量不能大于3', { icon: 2 });
            }
            if (currentPrice > 5 && currentPrice <= 10 && currentNum > 2) {
                $(self).val('')
                layer.msg('采购成本价大于5小于等于10时，采购数量不能大于2', { icon: 2 });
            }
            if (currentPrice > 10 && currentPrice <= 30 && currentNum > 1) {
                $(self).val('')
                layer.msg('采购成本价大于10小于等于30时，采购数量不能大于1', { icon: 2 });
            }
            if (currentPrice > 30 && currentNum > 0) {
                $(self).val('')
                layer.msg('采购成本价大于30时，采购数量不能大于0', { icon: 2 });
            }
        }
        commonCalcVal()
    }

    function changeSSkuInp(obj) {
        $(obj).attr("value",$(obj).val())
    }

    function commonCalcVal() {
        let sampleNumSum = 0
        let purchaseAmountSum = 0
        let samplePriceum = 0
        // 勾选的表格tr
        let checkedTr = $('#sskuContent').find('.layui-table-body').find('[name=layTableCheckbox]:checked')
        $('#sskuContent').find('.layui-table-body tr')?.each((index, item) => {
            let num = $(item).find('td[data-field=purchaseNum] input').val() || 0;
            let purchasePrice = $(item).find('td[data-field=purchasePrice]').text() || 0;
            let decimalPlaces = purchasePrice.toString().split('.')[1]?.length;
            let purchaseAmountSum = decimalPlaces ? Number(purchasePrice) * Math.pow(10, decimalPlaces) * Number(num) / Math.pow(10, decimalPlaces) : Number(purchasePrice) * Number(num) // 采购金额 = 采购单价 * 采样数量
            
            let decimalPlacesSum = purchaseAmountSum.toString().split('.')[1]?.length;
            purchaseAmountSum = (decimalPlacesSum > 2 ? purchaseAmountSum.toFixed(2) : purchaseAmountSum)|| ''
            
            $(item).find('td[data-field=amount] div').text(purchaseAmountSum)
            // 用于显示合计金额和数量
            if ($(item).find('[name=layTableCheckbox]').is(':checked')) {
                sampleNumSum = sampleNumSum + Number(num)
                samplePriceum = samplePriceum + Number(purchaseAmountSum)
            }
        })
        
        $('#sskuContent').find('.layui-table-total td[data-field=purchaseNum]>div').html(checkedTr?.length ? sampleNumSum : '');
        $('#sskuContent').find('.layui-table-total td[data-field=amount]>div').html(checkedTr?.length ? samplePriceum : '');
    }

</script>
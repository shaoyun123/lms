<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>物流退货查询</title>
            <style>
                .dis_flex{
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                }
                #queryRejectedGoodsTagForm span {
                    position: relative;
                }
                .rejectedGoods-tagSearchTop {
                    top: 10px
                }
                .rejectGoodsTag-minW{
                    width: 110px;
                }

            </style>
            <div class="layui-fluid" id="LAY-rejectedGoodsTag">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-row layui-col-space15">
                                    <div class="layui-col-lg9 layui-col-md9">
                                        <form class="layui-form" id="queryRejectedGoodsTagForm" lay-filter="queryRejectedGoodsTagForm">
                                          <input type="hidden" name="limit" value="500" />
                                          <input type="hidden" name="page" value="1" />     
                                            <div class="layui-form-item">
                                              <div class="layui-col-md3 layui-col-lg3">
                                                <label class="layui-form-label">创建时间</label>
                                                <div class="layui-input-block">
                                                    <input name="createTime" class="layui-input" id="creatorTime_tortbrand">
                                                </div>
                                              </div>
                                              <div class="layui-col-md2 layui-col-lg2">
                                                <label class="layui-form-label">仓库类型</label>
                                                <div class="layui-input-block">
                                                <select name="warehouseType" id="queryRejectedGoodsTag_warehouseType">
                                                </select>
                                              </div>     
                                              </div>
                                              <div class="layui-col-lg3 layui-col-md3">
                                                <label class="layui-form-label">平台</label>
                                                <div class="layui-input-block">
                                                    <select name="platform" id="logsRules_platform" lay-filter="platCodes" lay-search></select>
                                                </div>
                                              </div>
                                              <div class="layui-col-m4 layui-col-lg4">
                                                <div class="layui-input-block">
                                                    <input class="layui-input" name="queryId" placeholder="订单号/跟踪号/店铺单号">
                                                </div>
                                              </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div class="layui-col-lg3 layui-col-md3">
                                      <button type="button" class="layui-btn layui-btn-normal layui-btn-sm ml20" lay-submit id="queryRejectedGoodsTagSearch" lay-filter="queryRejectedGoodsTagSearch">查询</button>
                                          <button class="layui-btn layui-btn-sm" id="queryrejectedGoodsTag_exportBtn">导出</button>
                                          <span class="layui-btn layui-btn-sm"  id="queryrejectedGoodsTag_temuReturnImport">平台仓退货导入</span>
                                          <span class="layui-btn layui-btn-sm"  id="queryrejectedGoodsTag_importTempDownload">导入模板下载</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div id="queryProductListContainer" class="dis_flex"></div>
                                <table class="layui-table layui-hide" id="queryProductListContainerTable" lay-filter="queryProductListContainerTable_Filter"></table>
                                <!-- <div class="pageSortfix" id="hasBedeliveredPage"></div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
<!-- 表格渲染模板 -->
<script>
    layui.use(['admin','form', 'layer', 'laytpl','laydate', 'table', 'upload'], function() {
    var form = layui.form,
    admin = layui.admin,
    laytpl = layui.laytpl,
    laydate = layui.laydate,
    table = layui.table,
    upload = layui.upload,
    layer = layui.layer;
    var goodsDatas = [];
    var exportCount = 0;

    laydate.render({
      elem: '#creatorTime_tortbrand',
      type: 'datetime',
      inputAuto: true,
      range: true
    });

    form.render()

    getPageEnum();

        //temu退货导入-20230802
    upload.render({
      elem: '#queryrejectedGoodsTag_temuReturnImport',
      url: '/lms/returnorder/label/plat/upload',
      accept: 'file', //允许上传的文件类型
      field: 'file',
      field: 'multipartFile',
      before: function(){
          loading.show();
      },
      done: function (res, index, upload) { //上传后的回调
          loading.hide();
        //   经测试提醒，目前仅改9999的提示
          if(res.code !== '9999'){
              admin.batchResultAlert("平台仓退货导入:", res.data, function () {
                  res.successNum && $('#queryRejectedGoodsTagSearch').click()
              }, false);
          }else{
            layer.alert(res.msg, { icon: 2 });
          }
      },
      error: function(index,upload){
        loading.hide()
      }
    });


    var limit = 50;
    var page = 1;
    var nowdate = new Date(new Date().toLocaleDateString()).getTime()
    var endDate = Format(nowdate + 24 * 60 * 60 * 1000 - 1, 'yyyy-MM-dd hh:mm:ss')
    var onemonth = Format(new Date(nowdate - 30 * 24 * 3600 * 1000), 'yyyy-MM-dd hh:mm:ss')
    $('#creatorTime_tortbrand').val(onemonth + ' - ' + endDate)

    form.on('submit(queryRejectedGoodsTagSearch)',function(){
      let createTime = $("#queryRejectedGoodsTagForm input[name=createTime]").val();
      let startTime = createTime.split(" - ")[0];
      let endTime = createTime.split(" - ")[1];
      let queryId = $('#queryRejectedGoodsTagForm input[name=queryId]').val();
      let platCode = $('#queryRejectedGoodsTagForm select[name=platform]').val();
      let warehouseType = $('#queryRejectedGoodsTagForm select[name=warehouseType]').val();
      let warehouseTypeName = $('#queryRejectedGoodsTagForm select[name=warehouseType]>option:selected').text();
      let QueryKey = warehouseTypeName.indexOf('平台仓')> -1 ? 'barcode': 'queryId'
      let params = {
        startTime,
        endTime,
        queryId,
        platCode,
        warehouseType
      }
      rejectedGoodsTableRender(params);
    })

    // 导出
  $(document).on('click', '#queryrejectedGoodsTag_importTempDownload', function () {
    transBlob({
      fileName: '平台仓退货模版下载.xls',
      url: ctx + '/returnorder/label/downloadTpl',
    }, 'get').then(function (result) {
      layer.alert(result, { icon: 1 })
    }).catch(function (err) {
      layer.alert(err, { icon: 2 })
    })
  })

    //  获取页面枚举数
    function getPageEnum() {
        initAjax('/unauditorder/listenum.html', 'post', {}, function(returnData) {
            let platCode = returnData.data.platCodes
            appendSelect($('#queryRejectedGoodsTagForm').find('select[name="platform"]'), platCode, 'name', 'value')
            form.render()
        })
    }

    //填充下拉框
    function appendSelect(aDom, data, code, label, attachment,otherAttr) {
        aDom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                attachment ?
                    data[i].code = data[i][code] + '_' + data[i][attachment] :
                    data[i].code = data[i][code].toString() || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            const _otherAttr=otherAttr?`data-${otherAttr}="${data[i][otherAttr]}"`:''
            option += '<option '+_otherAttr+' value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        if(Array.isArray(data)){
            let acctIds = data.map(item=> item.code !== undefined ? item.code : item)
            aDom.attr('acct_ids', acctIds.join(','))
        }
        aDom.append(option)
    }

    //渲染表格
    function rejectedGoodsTableRender(data){
        $('#queryProductListContainer').empty();
        table.render({
            elem: '#queryProductListContainerTable',
            method: 'get',
            url: ctx + '/returnorder/label/list',
            where: data,
            cols: [
                [
                    {title: '订单号', field: 'allRootPNid'},
                    {title: '平台', field: 'platformName'},
                    {title: '店铺', field: 'shopName'},
                    {title: '订单状态',field: 'orderStatus'},
                    {title: '平台订单号',field: 'orderId'},
                    {title: '跟踪号/包裹号',field: 'trackNo'},
                    {title: '总货值',field: 'goodsCost'},
                    {title: '退货类型',field: 'tagType'},
                    {title: '是否还库',field: 'returnGoods',templet: `<div>{{d.returnGoods ? '是': '否'}}</div>`},
                    {title: '创建人',field: 'creator'},
                    {title: '创建时间',field: 'createTime',templet: `<div>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>`},
                    {title: '修改人',field: 'modifier'}
                ]
            ],
            data: data,
            page: true,
            limits: [50, 200, 500],
            limit: 50,
            done: function(res, curr, count) {
              exportCount = count;
            }
        })
    }

    function getrejectedData(queryParams,func){
      initAjax('/returnorder/label/list','get',{...queryParams},function(returnData){
          goodsDatas = returnData.data;
          if(func){
              func(returnData)
          }
      })
    }

    //获取仓库类型
    getQueryWarehouseType();
    function getQueryWarehouseType() {
      initAjax('/enum/list/WAREHOUSE_TYPE','get',{},function(returnData){
          let res = returnData.data;
          commonRenderSelect('queryRejectedGoodsTag_warehouseType', res,{str: '<option value="">仓库类型</option>',name:'name', code: 'code'}).then(()=> {
              form.render('select');
          })
      })
    }

    function initAjax(url, method, data, func, contentType, isLoad, func2, func3) { //初始化ajax请求
        if (!isLoad) {
            loading.show()
        }
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            beforeSend: function(returnData) {
                if (func2) {
                    func2(returnData)
                }
            },
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
            complete: function(returnData) {
                loading.hide()
                if (func3) {
                    func3(returnData)
                }
            }
        })
    }

    //日期范围
    laydate.render({
        elem: '#rejectedGoodsTag_timerange_input'
        ,range: true
        ,trigger: 'click'
    });

    // 进入页面获取焦点
    $('#queryId').focus();

    // 扫描单号触发回车事件
    $('#queryId').keydown(function(e) {
        if (e.keyCode == 13) {
            $('#queryRejectedGoodsTagSearch').click()
                return false;
        }
    });

  // 导出
  $('#queryrejectedGoodsTag_exportBtn').on('click', function(){
    let data = {}
    let createTime = $("#queryRejectedGoodsTagForm input[name=createTime]").val();
    let queryId = $('#queryRejectedGoodsTagForm input[name=queryId]').val();
    let platCode = $('#queryRejectedGoodsTagForm select[name=platform]').val();
    let warehouseType = $('#queryRejectedGoodsTagForm select[name=warehouseType]').val();
    let warehouseTypeName = $('#queryRejectedGoodsTagForm select[name=warehouseType]>option:selected').text();
    let QueryKey = warehouseTypeName.indexOf('平台仓')> -1 ? 'barcode': 'queryId'
    if (createTime && createTime.trim() != '') {
      let startTime = createTime.split(" - ")[0];
      let endTime = createTime.split(" - ")[1];
      data.startTime = startTime;
      data.endTime = endTime;
      data.page = 1;
      data.limit = exportCount;
      data.queryId = queryId;
      data.warehouseType = warehouseType;
      data.platCode = platCode;
      console.log('data', data);
      submitForm(data, ctx + '/returnorder/label/exportScanLog.html');
    }
  });

})
</script>

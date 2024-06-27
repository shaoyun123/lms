<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>速卖通刊登统计</title>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="aepc_searchForm" class="layui-form" lay-filter="component-form-group">
                        <div class="layui-form-item">
                            <!--<div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="sellerId" lay-filter="aepc_sellerId" lay-search>
                                       <option value="">请选择</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" lay-search>
                                       <option value=""></option>
                                    </select>
                                </div>
                            </div>-->
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="aepc_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="smt专员" lay-filter="aepc_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" data-platcode="aliexpress" xm-select-search lay-filter="aepc_storeFilter"
                                        xm-select="smt_statistics_storeAcctId" xm-select-search-type="dl" class="store_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input aliexpressPublishStatisticTime"/>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                                <button id="aepc_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                                
                                <button id="aepc_exportBtn" class="layui-btn layui-btn-sm layui-btn-danger" type="button">导出</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 表格渲染 -->
            <div class="layui-card" id="smtStatisticsCard">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="smt_statistics_tab">
                      <div class="disflex">
                        <ul class="layui-tab-title">
                          <li class="layui-this"></li>
                        </ul>
                      </div>
                      <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show">
                            <table id="aepc_table" lay-filter="aepc_tablefilter" class="layui-table"></table>
                        </div>
                      </div>
                    </div>
                  </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="smt_statistics_salesperson_store_template_layout_id">
    <div style="padding:20px 50px 0 20px">
        <div class="layui-tab-item layui-show">
            <form lay-filter="listingPriceForm_ptb" class="layui-form" id="smt_statistics_salesperson_store_template_form" autocomplete="false">
                <input hidden name="prodSId">
                <input hidden name="prodSTempId">
                <div class="layui-col-md2 layui-col-lg4">
                    <label class="layui-form-label">刊登时间</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input store_listing_time"/>
                    </div>
                </div>
                <div class="layui-col-md2 layui-col-lg3">
                <div class="layui-input-block">
                    <span class="layui-btn layui-btn-sm" onclick="queryStoreDetail()">查询</span>
                </div>
                </div>
                <table class="layui-table" id="smt_statistics_salesperson_store_template_table" lay-filter="smt_statistics_salesperson_store_template_table_filter">
                </table>
            </form>
        </div>
    </div>
</script>
<script type="text/html" id="smt_statistics_salesperson_store_template_id">
    <a href="javascript:;" style="color:#01AAED;" onclick="smt_statistics_salesperson_store_detail({{d.salePersonId}})">{{ d.salePerson }}</a>
</script>
<script>
layui.use(['admin', 'form','table', 'layer','laydate','element'], function() {
    var admin = layui.admin,
        form = layui.form,
        laydate = layui.laydate,
      element = layui.element,
        table = layui.table,
        layer = layui.layer;
        
    laydate.render({
       elem: '#aepc_searchForm .aliexpressPublishStatisticTime'
        ,range: true
    });

    render_hp_orgs_users("#aepc_searchForm");
    
    form.render();

    element.on("tab(smt_statistics_tab)", function (data) {
        $("#aepc_searchBtn").click()
    })
    
    function getSearchData(){
        var data = {};
        data.platCode = "aliexpress";
        var time = $("#aepc_searchForm .aliexpressPublishStatisticTime").val();
        if(time != ""){
            data.startTime = Date.parse(time.split(" - ")[0] +" 00:00:00");
            data.endTime = Date.parse(time.split(" - ")[1] +" 23:59:59");
        }else{
            data.startTime  ="";
            data.endTime = "";
        }
        //人员
        data.orgId = $("#aepc_searchForm select[name=orgId]").val();
        data.salePersonId = $("#aepc_searchForm select[name=salePersonId]").val();
        const storeAcctIds = layui.formSelects.value('smt_statistics_storeAcctId','val')
        storeAcctIds.length ? data.storeAcctIds =storeAcctIds:''
        data.roleNames= "smt专员";
        data.orderField = "totalListingNum";
        data.orderDirection = "desc";
        return data;
    }

    function renderCols(){
        const storeAcctIdList =layui.formSelects.value('smt_statistics_storeAcctId','val')
        const storeCols=[[
            { field: 'orgName', title: '部门', sort:true},
            { field: 'salePerson', title: '销售员', sort:true,templet:"#smt_statistics_salesperson_store_template_id"},
            { field: 'storeAcct', title: '店铺名称',  sort:true},
            { field: 'systemListingNum', title: '系统刊登数量',sort:true},
            { field: 'salePersonListingNum', title: '销售刊登数量', sort:true},
            { field: 'totalListingNum', title: '累计刊登数量', sort:true},
            { field: 'avgListingNum', title: '日均刊登量', sort:true},
            { field: 'deletedListingNum', title: 'oa下架数量',  sort:true}
        ]]
        const salesCols = [[
            { field: 'orgName', title: '部门', sort:true},
            { field: 'salePerson', title: '销售员', sort:true,templet:"#smt_statistics_salesperson_store_template_id"},
            { field: 'systemListingNum', title: '系统刊登数量',sort:true},
            { field: 'salePersonListingNum', title: '销售刊登数量', sort:true},
            { field: 'totalListingNum', title: '累计刊登数量', sort:true},
            { field: 'avgListingNum', title: '日均刊登量', sort:true},
            { field: 'deletedListingNum', title: 'oa下架数量',  sort:true}
        ]]

        return storeAcctIdList.length ? storeCols : salesCols
    }

    $("#aepc_searchBtn").click(function(){
        const storeAcctIdList =layui.formSelects.value('smt_statistics_storeAcctId','val')
        const tabDom = $('#smtStatisticsCard').find('ul .layui-this')
        tabDom.text(storeAcctIdList.length ? '按店铺':'按销售')
        //表格渲染
        table.render({
            elem:'#aepc_table',
            url: '${ctx}/listingstatistics/smt/list.html', // 数据接口
            where: getSearchData(),
            method:'post',
            contentType:'application/json;charset=UTF-8',
            cols: renderCols(),
            page: false
        });
    });
    //监听排序
    table.on('sort(aepc_tablefilter)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
    //   console.log(obj.field); //当前排序的字段名
    //   console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
    //   console.log(this); //当前排序的 th 对象
      //尽管我们的 table 自带排序功能，但并没有请求服务端。
      //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
      var searchData = getSearchData();
      searchData.orderField = obj.field;
      searchData.orderDirection = obj.type;
      table.reload('aepc_table', {
          initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
          where: searchData
      });
    });
    
//  //加载销售
//  $(function(){
//      $.ajax({
//         type: "post",
//         url: ctx + "/salesplat/listsalesperson.html",
//         dataType: "json",
//         data:{platCode:"aliexpress"},
//         success: function(returnData) {
//             if (returnData.code == "0000") {
//                 $(returnData.data).each(function() {
//                     $("#aepc_searchForm select[name=sellerId]").append("<option  value='" + this.salespersonId + "'>" + this.salesperson + "</option>");
//                 });
//                 $("#aepc_searchForm select[name=sellerId]").next('div').find('dd:first').trigger('click')
//                 form.render('select');
//             } else {
//                 layer.msg("组织部门加载失败" + returnData.msg);
//             }
//         }
//     });
//  });
//  
//  form.on('select(aepc_sellerId)', function (data) {
//      var salespersonId=data.value;
//      $.ajax({
//          type: "post",
//          data:{
//              salespersonId:salespersonId,
//              platCode : "aliexpress"
//          },
//          url: ctx + "/salesplat/listbysalesperson.html",
//          dataType: "json",
//          success: function (returnData) {
//              if (returnData.code == "0000") {
//                  var str = "<option value=''></option>";
//                  currentStoreAccts=[]
//                  $.each(returnData.data,function (i,v) {
//                      str += "<option value='" + v.id + "'>" + v.storeAcct + "</option>";
//                      currentStoreAccts.push(v.id);
//                  });
//                  $("#aepc_searchForm select[name=storeAcctId]").html(str);
//                  form.render('select');
//              } else {
//                  layer.msg(returnData.msg);
//              }
//          }
//      })
//  });
    
    //导出普源SKU映射
    $("#aepc_exportBtn").click(function() {
        layer.confirm('导出速卖通刊登统计', {icon:3},function(index){
            var url = ctx + "/listingstatistics/smt/export.html";
            var data = getSearchData();
            submitForm(data,url,"_blank");
            layer.close(index);
        });
    });

})

let salePersonId;
function smt_statistics_salesperson_store_detail(inputSalePersonId) {
    salePersonId = inputSalePersonId;
    const layer = layui.layer;
    var index = layer.open({
        type: 1,
        title: '销售员详情',
        area: ['880px', '480px'],
        content:$('#smt_statistics_salesperson_store_template_layout_id').html(),
        btn: ['关闭'],
        success: function (layero) {
            layui.laydate.render({
                elem: '.store_listing_time'
                ,range: true
            });
        },
    });
}

function queryStoreDetail() {
    if (typeof(salePersonId) === undefined) {
        return;
    }
    var data = {};
    data.platCode = "aliexpress";
    var time = $("#aepc_searchForm .aliexpressPublishStatisticTime").val();
    var time2 = $(".store_listing_time").val();
    if(time2){
        data.startTime = Date.parse(time2.split(" - ")[0] +" 00:00:00");
        data.endTime = Date.parse(time2.split(" - ")[1] +" 00:00:00");
    }else if(time){
        data.startTime = Date.parse(time.split(" - ")[0] +" 00:00:00");
        data.endTime = Date.parse(time.split(" - ")[1] +" 00:00:00");
    }else{
        data.startTime  ="";
        data.endTime = "";
    }
    //人员
    data.orgId = $("#aepc_searchForm select[name=orgId]").val();
    data.roleNames= "smt专员";
    data.orderField = "totalListingNum";
    data.orderDirection = "desc";

    data.salePersonId = salePersonId;
    loading.show();
    $.ajax({
        type: 'post',
        url: ctx + '/listingstatistics/smt/store/list.html',
        data: data,
        dataType: 'json',
        success: function (res) {
            //debugger;
            loading.hide();
            const myCols = [];
            if (res.code === '0000') {
                if (res.data) {
                    let titles = res.data.title;
                    let col = [];
                    let field_first = {};
                    field_first.field = "storeAcct";
                    field_first.title = "店铺";
                    col.push(field_first);
                    for (let i = 0; i <titles.length; i++) {
                        let field = {};
                        field.field = titles[i];
                        field.title = titles[i];
                        col.push(field);
                    }
                    let field_last = {};
                    field_last.field = "avgListingNum";
                    field_last.title = "日均刊登数量";
                    col.push(field_last);

                    myCols.push(col);

                    layui.table.render({
                        elem: "#smt_statistics_salesperson_store_template_table",
                        id: 'smt_statistics_salesperson_store_template_table',
                        data: res.data.list,
                        cols:myCols,
                        page: false,
                        limit: res.data.list.length,
                        done: function() {
                        }
                    })
                }
            } else {
                layer.msg(res.msg)
            }

        },
        error: function () {
            loading.hide();
            layer.msg('发送请求失败')
        }
    })
}
</script>
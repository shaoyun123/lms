<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>INR提醒</title>

<style>
    #LAY-Ebayinr .layui-card-body{
    padding: 0 15px !important;
}
 
</style>

<div class="layui-fluid" id="LAY-Ebayinr">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="ei_searchForm" class="layui-form" lay-filter="component-form-group">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="ei_orgFilter" class="orgs_hp_custom"  lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="ebay客服专员" lay-filter="ei_sellerFilter" data-type="customservicer" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId" class="store_hp_custom" data-platcode="ebay" lay-filter="ei_storeFilter" lay-search="" >
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">交易时间</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input transDate">
                                </div>
                            </div>
                            
                            <div class="layui-col-md6 layui-col-lg6">
                            </div>
                            
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">发送message</label>
                                <div class="layui-input-block">
                                    <select name="isSendMessage"  lay-search>
                                        <option value="">全部</option>
                                        <option value="true">已发送</option>
                                        <option value="false">未发送</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">联系买家</label>
                                <div class="layui-input-block">
                                    <select name="isContactBuyer"  lay-search>
                                        <option value="">全部</option>
                                        <option value="true">已联系</option>
                                        <option selected value="false">未联系</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderByStr"  lay-search>
                                        <option value="trans_date asc">交易时间正序</option>
                                        <option selected value="trans_date desc">交易时间倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label"></label>
                                <button id="ei_searchBtn" class="layui-btn layui-btn-sm keyHandle" type="button">搜索</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <!-- 表格渲染 -->
            <div class="layui-card">
            	<div class="layui-card-header">
                  <span class="numCount">数量(<span id="ei_num"></span>)</span>
                  <button id="ei_sendMessageBtn" class="layui-btn layui-btn-sm" type="button" style="float: right;margin-top:10px">联系买家</button>
                </div>
                <div class="layui-card-body">
                    <table id="ei_table" lay-filter="ei_tablefilter" class="layui-table"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/html" id="isContactBuyerTpl">
	{{#  if(d.isContactBuyer==1){ }}
		<span style="color: green;">已联系</span>
	{{# } else{ }}
		<span style="color: red;">未联系</span>
	{{# } }}
</script>
<script type="text/html" id="isSendMessageTpl">
	{{#  if(d.isSendMessage==1){ }}
		<span style="color: green;">已发送</span>
	{{# } else{ }}
         {{#  if(d.sendFailMsg){ }}
            <span style="color: red;">{{d.sendFailMsg}}</span>
        {{# } else{ }}
            <span style="color: red;">未发送</span>
        {{# } }}
	{{# } }}
</script>
<script>
console.log("ei");
layui.use(['admin', 'form','table', 'layer','laydate'], function() {
    var admin = layui.admin,
        form = layui.form,
        laydate = layui.laydate,
        table = layui.table,
        layer = layui.layer;
        
    laydate.render({
       elem: '#ei_searchForm .transDate',
       range: true
    });
    
    form.render();
    //初始化部门-用户-店铺
    render_hp_orgs_users("#ei_searchForm");
    function getSearchData(){
        var data = {};
        var transDate = $("#ei_searchForm .transDate").val();
        if(transDate != ""){
            data.transDate1 = Date.parse(transDate.split(" - ")[0].replace(/\-/g, "/") +" 00:00:00");
            data.transDate2 = Date.parse(transDate.split(" - ")[1].replace(/\-/g, "/")+" 23:59:59");
        }else{
            data.transDate1  ="";
            data.transDate2 = "";
        }
        //人员
        data.orgId = $("#ei_searchForm select[name=orgId]").val();
        data.salePersonId = $("#ei_searchForm select[name=salePersonId]").val();
        data.storeAcctId = $("#ei_searchForm select[name=storeAcctId]").val();
        //roleNames
        data.roleNames = $("#ei_searchForm select[name=salePersonId]").data('rolelist');
        //person-type
        data.personType = $("#ei_searchForm select[name=salePersonId]").attr("data-type");
        
        data.isSendMessage = $("#ei_searchForm select[name=isSendMessage]").val();
        data.isContactBuyer = $("#ei_searchForm select[name=isContactBuyer]").val();
        //排序
        data.orderByStr = $("#ei_searchForm select[name=orderByStr]").val();
        return data;
    }
    //表格渲染
    table.render({
        elem:'#ei_table',
        method:'post',
        url: ctx+'/ebaysellerinr/list.html',
        where:getSearchData(),
        cols: [
            [ //表头
            	{type: 'checkbox', width: '3%'}, 
                { field: 'storeAcctName', title: '店铺', width: '8%'},
                { field: 'title', title: '标题', width: '16%'},
                { field: 'itemId', title: 'ItemID', width: '8%'},
                { field: 'isSale', title: 'listing状态', width: '5%',templet:'<div>{{#  if(d.isSale==1){ }}<span style="color: green;">在线</span>{{# } else if(d.isSale==0) { }}<span style="color: gray;">已下架</span>{{# }else{ }} {{# } }}</div>'},
                { field: 'transDate', title: '交易时间', width: '10%',templet:'<div>{{ Format(d.transDate, "yyyy-MM-dd hh:mm:ss")}}</div>'},
              { field: 'estDlvryDate', title: '买家反映时间', width: '10%',templet:'<div>{{ Format(d.buyerAtmptInrDate, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                { field: 'estDlvryDate', title: '预计最迟送货时间', width: '10%',templet:'<div>{{ Format(d.estDlvryDate, "yyyy-MM-dd hh:mm:ss")}}</div>'},
                { field: 'buyerName', title: '买家账号', width: '10%'},
                { field: 'isSendMessage', title: '是否发送message', width: '10%',templet:'#isSendMessageTpl'},
                { field: 'isContactBuyer', title: '是否联系买家', width: '10%',templet:'#isContactBuyerTpl'}
            ]
        ],
        page: true,
        limits: [50, 100, 200], // 每页条数的选择项
        limit: 50, //默认显示50条
        done: function(res, curr, count){
	        if (res.code == '0000') {
	            $("#ei_num").html(count);
	        }else{
	            $("#ei_num").html(0);
	        }
	    },
    });
    
    $("#ei_searchBtn").click(function(){
        //执行重载
        table.reload('ei_table', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            url: ctx+'/ebaysellerinr/list.html', // 数据接口
            where: getSearchData()
        });
    });
    
    $("#ei_sendMessageBtn").click(function(){
    	var checkStatus = table.checkStatus('ei_table');
        var data = checkStatus.data;
        if (data.length == 0) {
            layer.msg("未选中数据", {icon:7});
        }else {
        	var ids = [];
        	for(var i=0; i<data.length; i++){
        		if(data[i].isContactBuyer){
        			layer.msg("已联系的买家不能发送message", {icon:7});
        			return;
        		}
        		ids.push(data[i].id);
        	}
            layer.confirm('发message给买家', {icon:3},function(index){
            	layui.admin.load.show();
	            $.ajax({
	                type: "post",
	                url: ctx + "/ebaysellerinr/contactbuyer.html",
	                dataType: "json",
	                data: { ids: ids.join(",") },
	                success: function(returnData) {
	                	layui.admin.load.hide();
	                    if (returnData.code == "0000") {
	                    	if(returnData.data == 0){
	                    		layer.msg("发送message成功", {icon:1});
	                    	}else{
	                    		layer.msg("发送message完毕,失败:"+returnData.data+"个", {icon:7});
	                    	}
	                        table.reload('ei_table', { where: getSearchData()});
	                    } else {
	                        layer.msg(returnData.msg, {icon:5});
	                    }
	                }
	            })
	        });
        }
    });
    
//  //监听排序
//  table.on('sort(ei_tablefilter)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
//    console.log(obj.field); //当前排序的字段名
//    console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
//    console.log(this); //当前排序的 th 对象
//    //尽管我们的 table 自带排序功能，但并没有请求服务端。
//    //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
//    var searchData = getSearchData();
//    searchData.orderField = obj.field;
//    searchData.orderDirection = obj.type;
//    table.reload('ss_table', {
//        page: {
//            curr: 1 //重新从第 1 页开始
//        },
//        initSort: obj, //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
//        where: searchData
//    });
//  });
    

})
</script>
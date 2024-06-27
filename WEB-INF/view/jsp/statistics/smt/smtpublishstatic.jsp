<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>smt定向刊登统计</title>
<style>
        .label_reset{
        padding: 0 10px !important;
    }
    .w_40{
        width: 40% !important;
    }
    .flex_between{
        display: flex;
        justify-content: space-between;
    }
    .pl_10{
        padding-left: 10px !important;   
    }
    .fr{
        float: right;
    }
    .mr_10{
        margin-right: 10px;
    }
    .m_20{
        margin: 20px !important;
    }
</style>
<div class="layui-fluid" id="LAY-smtpublishstaics">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="smtps_searchForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="orgId" lay-filter="smtps_orgFilter" class="orgs_hp_custom" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">销售人员</label>
                                <div class="layui-input-block">
                                    <select name="salePersonId"  class="users_hp_custom" data-rolelist="smt专员" lay-filter="smtps_sellerFilter" lay-search="">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">可刊登时间</label>
                                <div class="layui-input-block">
                                    <input name="listingTime" type="text" class="layui-input"/>
                                </div>
                            </div>
                                <div class="layui-col-md3 layui-col-lg3 pl_10">
                                    <button id="smtps_searchBtn" class="layui-btn layui-btn-sm" type="button">查询</button>
                                    <button type="reset" id="smtps_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="smt_publish_statistics_card">
                <div class="layui-card-body">
                    <div class="layui-card-header" id="layui-card-gsmt_publish_statistics" style="background:#fff;position:relative;display:flex;justify-content:space-between;">
                        <div class="layui-tab" lay-filter="smt_publish_statistics_tab" id="smt_publish_statistics_tab_id">
                            <div style="height:40px;line-height:40px;">
                                <ul class="layui-tab-title">
                                    <li id="smt_publish_statistics_tab_salesperson" data-value="1" class="layui-this">按销售员</li>
                                    <li id="smt_publish_statistics_tab_bizz_owner" data-value="2">按开发专员</li>
                                    <li id="smt_publish_statistics_tab_cate" data-value="3">按类目</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="layui-card-body">
                        <table class="layui-table" id="smtpspublish_table" lay-filter="smtpspublish_table"></table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<script type="text/html" id="smt_statistics_salesperson_template_layout_id">
    <div style="padding:20px 50px 0 20px">
        <div class="layui-tab-item layui-show">
            <form lay-filter="listingPriceForm_ptb" class="layui-form" id="smt_statistics_salesperson_template_form" autocomplete="true">
                <table class="layui-table" id="smt_statistics_salesperson_template_table"
                       lay-filter="smt_statistics_salesperson_template_table">
                </table>
            </form>
        </div>
    </div>
</script>
<script type="text/html" id="smt_statistics_salesperson_template_id">
    <a href="javascript:;" style="color:#01AAED;" onclick="smt_statistics_salesperson_detail({{d.salePersonId}})">{{ d.salePerson }}</a>
</script>

<!-- 表格渲染模板 -->
<script type="text/javascript">
layui.use(['admin', 'form', 'layer', 'formSelects', 'element', 'table', 'laypage','laydate'], function () {
    var admin = layui.admin,
        form = layui.form,
        element = layui.element,
        table=layui.table,
        layer = layui.layer,
        formSelects = layui.formSelects,
        laydate = layui.laydate,
        type =1,
        $ = layui.$;
        form.render();
        laydate.render({
            elem: '#smtps_searchForm input[name="listingTime"]', //指定元素
            range:true,
            type: 'date'
        });
        //初始化部门
        render_hp_orgs_users("#smtps_searchForm");
        //表单查询
        $('#smtps_searchBtn').click(function(){
            var data = getSearchData();
            if(data.startTime!=""){
                smtpstablerender(getSearchData());
            }else{
                layer.msg('请选择时间')
            }
        });
        $(function(){
            var endTime = new Date(new Date().getTime() - 24*3600*1000);
            var startTime = new Date(new Date().getTime() - 7*24*3600*1000);
            var timeStr = Format(startTime,"yyyy-MM-dd")+" - "+Format(endTime,"yyyy-MM-dd");
            $('#smtps_searchBtn input[name=listingTime]').val(timeStr);
        });

    element.on('tab(smt_publish_statistics_tab)', function(data) {
        type = $(this).attr("data-value");
        $("#smtps_searchBtn").trigger("click");
    });

    function getSearchData(){
        var data = serializeObject($('#smtps_searchForm'));
        data.startTime = data.listingTime.split(' - ')[0]?data.listingTime.split(' - ')[0]:"";
        data.endTime = data.listingTime.split(' - ')[1]?data.listingTime.split(' - ')[1]:"";
        delete data.listingTime;
        return data;
    }

    function smtpstablerender(data){
        if(type == 3){
           smtCaterender(data)
        }else if(type == 2){
            smtBizzrender(data);
        }else {
            smtpstableSalemanrender(data);
        }
    }

    function smtpstableSalemanrender(data){
       var tableIns = table.render({
        elem: "#smtpspublish_table",
            method: 'post',
            url: ctx + "/aliexpresslisting/statistics.html",
            cols: [
                [
                    { field: "orgName",title: "部门"},
                    { field: "salePerson",title: "销售员",templet: "#smt_statistics_salesperson_template_id",},
                    { field: "bizzOwner",title: "开发专员"},
                    { field: "realPublishAbleNum",title: '实际可刊登数量',sort:true},
                    { field: "upStandardNum",title: '覆盖达标数(部门)',sort:true},
                    { field: "timeUpStandardNum",title: '时效达标数(部门)',sort:true},
                    { field: "salespersonUpStandardNum",title: '覆盖达标数(销售)',sort:true},
                    { field: "salespersonTimeUpStandardNum",title: '时效达标数(销售)',sort:true},
                ],
            ],
            id: "smtpspublish_table",
            page:true,
            limits:[100,200,500,1000],
            limit:100,
            where:data,
       });
    }

    function smtBizzrender(data){
        var tableIns = table.render({
            elem: "#smtpspublish_table",
            method: 'post',
            url: ctx + "/aliexpresslisting/statistics/business/owner.html",
            cols: [
                [
                    { field: "bizzOwner",title: "开发专员"},
                    { field: "realPublishAbleNum",title: '实际可刊登数量',sort:true},
                    { field: "upStandardNum",title: '覆盖达标数(部门)',sort:true},
                    { field: "timeUpStandardNum",title: '时效达标数(部门)',sort:true}
                ],
            ],
            id: "smtpspublish_table",
            page:true,
            limits:[100,200,500,1000],
            limit:100,
            where:data,
        });
    }

    function smtCaterender(data){
        var tableIns = table.render({
            elem: "#smtpspublish_table",
            method: 'post',
            url: ctx + "/aliexpresslisting/statistics/cate.html",
            cols: [
                [
                    { field: "cateName",title: "类目"},
                    { field: "realPublishAbleNum",title: '实际可刊登数量',sort:true},
                    { field: "upStandardNum",title: '覆盖达标数(部门)',sort:true},
                    { field: "timeUpStandardNum",title: '时效达标数(部门)',sort:true},
                ],
            ],
            id: "smtpspublish_table",
            page:true,
            limits:[100,200,500,1000],
            limit:100,
            where:data,
        });
    }
});

function serializeObject(form) {
        var o = {};
        $.each(form.serializeArray(), function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }


function smt_statistics_salesperson_detail(salePersonId) {
    if (typeof(salePersonId) === undefined) {
        return;
    }
    let data = serializeObject($('#smtps_searchForm'));
    data.startTime = data.listingTime.split(' - ')[0]?data.listingTime.split(' - ')[0]:"";
    data.endTime = data.listingTime.split(' - ')[1]?data.listingTime.split(' - ')[1]:"";
    data.salePersonId = salePersonId;
    const layer = layui.layer;

    var index = layer.open({
        type: 1,
        title: '销售员详情',
        area: ['880px', '480px'],
        content:$('#smt_statistics_salesperson_template_layout_id').html(),
        btn: ['关闭'],
        success: function (layero) {
            loading.show();
            $.ajax({
                type: 'post',
                url: ctx + '/aliexpresslisting/statistics/business/owner.html',
                data: data,
                dataType: 'json',
                success: function (res) {
                    loading.hide();
                    if (res.code === '0000') {
                        if (res.data) {
                            layui.table.render({
                                elem: "#smt_statistics_salesperson_template_table",
                                id: 'smt_statistics_salesperson_template_table',
                                data: res.data,
                                cols: [ [{field: "bizzOwner", title: "开发专员"},
                                    {field: "realPublishAbleNum", title: '实际可刊登数量', sort: true},
                                    {field: "upStandardNum", title: '覆盖达标数(部门)', sort: true},
                                    {field: "timeUpStandardNum", title: '时效达标数(部门)', sort: true},
                                    {field: "salespersonUpStandardNum", title: '覆盖达标数(销售)', sort: true},
                                    {field: "salespersonTimeUpStandardNum", title: '时效达标数(销售)', sort: true},
                                ],
                                ],
                                page: false,
                                limit: res.data.length,
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
        },
    })


}
</script>

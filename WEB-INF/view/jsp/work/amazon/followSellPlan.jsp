<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>跟卖计划</title>
<style>
    .b1 {
        border: 1px solid #ccc
    }
    .text_l {
        text-align: left;
    }
    .gray {
        color: gray;
    }
    .skyblue {
        color: skyblue;
    }
    .red_font{
        color:red
    }
    .mg_20{
        margin:20px
    }
    .pageSort{
            display: block;
            width: 100%;
            background:#fff;
            position: fixed;
            left: 100px;
            bottom: 0;
        }
</style>

<div class="layui-fluid" id="LAY-followSellPlan">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="followSellPlanForm" lay-filter="followSellPlanForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">计划状态</label>
                                <div class="layui-input-block">
                                    <select name="status" class="layui-select">
                                        <option value="">全部</option>
                                        <option value="true" selected>启用</option>
                                        <option value="false">停用</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">计划名称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="planName" class="layui-input">
                                </div>
                            </div>

                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit
                                            id="followSellPlanSearch" lay-filter="followSellPlanSearch">查询
                                    </button>
                                    <button class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div style="width:100%;height:30px;line-height:30px">
                        <div class="deliveryBtn">
                            <button type="button"
                                    class="layui-btn layui-btn-normal layui-btn-sm fr" id="followSellPlannew">
                                创建跟卖计划
                            </button>
                        </div>
                    </div>

                    <table lay-filter="followSellPlan_table" class="layui-table"
                           id="followSellPlan_table"></table>
                    <div id="followSellPlanPage" class="pageSort"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="followSellPlan_rule">
    <div><span>上线时间:{{d.onlineTime}}</span></div>
    <div><span>下线时间:{{d.offlineTime}}</span></div>
</script>

<script type="text/html" id="followSellPlan_createTime">
    <div><span>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div><span>修改:{{Format(d.modifyTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
</script>

<script type="text/html" id="followSellPlan_status">
    {{#  if(d.status){ }}
    <div><span>启用</span></div>
    {{#  }else{   }}
    <div><span class="red_font">停用</span></div>
    {{# }  }}
</script>

<script type="text/html" id="followSellPlan_tool">
    <button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="followsellplan_modify">编辑</button>
    <br/>
    {{# if(d.status){ }}
    <button type="button" class="layui-btn layui-btn-xs layui-btn-danger" lay-event="followsellplan_off">停用</button>
    <br/>
    {{# }else{ }}
    <button type="button" class="layui-btn layui-btn-xs layui-btn-normal" lay-event="followsellplan_on">启用</button>
    <br/>
    {{# } }}
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="followsellplan_del">删除</button>
</script>


<script type="text/html" id="followSellPlan_modifyPop">
    <form class="layui-form mg_20" id="followSellPlaneditForm" lay-filter="followSellPlaneditForm">
        <input type="hidden" name="id" >
        <div class="layui-form-item">
            <div class="layui-col-lg12 layui-col-md12">
                <label class="layui-form-label">计划名称</label>
                <div class="layui-input-block">
                    <input type="text" name="planName" lay-verify="required" class="layui-input">
                </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12">
                 <label class="layui-form-label">跟卖时间</label>
                 <div class="layui-input-block">
                    <input type="text" name="onlineTime" id="onlineTime" lay-verify="required" class="layui-input">
                </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12">
                <label class="layui-form-label">取消跟卖时间</label>
                <div class="layui-input-block">
                    <input type="text" name="offlineTime" id="offlineTime" lay-verify="required" class="layui-input">
                </div>
            </div>
        </div>
        <button type="button" class="disN" lay-submit=""
                id="followSellPlaneditSubmit" lay-filter="followSellPlaneditSubmit">提交
        </button>
    </form>
</script>

<script src="${ctx}/static/js/work/amazon/followSellPlan.js"></script>
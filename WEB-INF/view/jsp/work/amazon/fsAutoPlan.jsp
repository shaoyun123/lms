<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<title>amazon跟卖池计划</title>
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
</style>

<div class="layui-fluid" id="LAY-AmazonFsAutoPlan">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="AmazonFsAutoPlanForm" lay-filter="AmazonFsAutoPlanForm">
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

                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                            id="AmazonFsAutoPlanSearch" lay-filter="AmazonFsAutoPlanSearch">查询
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
                                    class="layui-btn layui-btn-normal layui-btn-sm fr" id="AmazonFsAutoPlan_btn_createPlan">
                                创建跟卖计划
                            </button>
                        </div>
                    </div>

                    <table lay-filter="AmazonFsAutoPlan_table" class="layui-table"
                           id="AmazonFsAutoPlan_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="AmazonFsAutoPlan_Time_tpl">
    <div class="text_l"><span>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm')}}</span></div>
    <div class="text_l"><span>更新:{{Format(d.modifyTime,'yyyy-MM-dd hh:mm')}}</span></div>
</script>

<script type="text/html" id="AmazonFsAutoPlan_status_tpl">
    {{#  if(d.status){ }}
    <div class="text_l"><span>启用</span></div>
    {{#  }else{   }}
    <div class="text_l"><span class="red">停用</span></div>
    {{# }  }}
</script>

<script type="text/html" id="AmazonFsAutoPlan_planInfo_tpl">
    <div class="text_l"><span>开始:{{Format(d.startTime,'yyyy-MM-dd')}}</span></div>
    <div class="text_l"><span>结束:{{Format(d.endTime,'yyyy-MM-dd')}}</span></div>
    <div class="text_l"><span>上线时间:{{d.onlineTime||''}}</span></div>
    <div class="text_l"><span>下线时间:{{d.offlineTime||''}}</span></div>
    <div class="text_l"><span>重复周期:{{d.repeateDay||''}}</span></div>

</script>

<script type="text/html" id="AmazonFsAutoPlan_op">
    <button class="layui-btn layui-btn-xs " lay-event="AmazonFsAutoPlan_event_edit">编辑</button>
    {{#  if(d.status){ }}
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="AmazonFsAutoPlan_event_close">停用</button>
    {{# }else{   }}
    <button class="layui-btn layui-btn-xs " lay-event="AmazonFsAutoPlan_event_open">启用</button>
    {{# }  }}
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="AmazonFsAutoPlan_event_delete">删除</button>
</script>

<script type="text/html" id="AmazonFsAutoPlan_follwArea_tpl">
    <span>{{d.beginFollowDays||'0'}}</span><a> - </a><span>{{d.endFollowDays||''}}</span>
</script>


<script type="text/html" id="AmazonFsAutoPlan_layer">
    <form class="layui-form" id="editAmazonFsAutoPlanForm" lay-filter="editAmazonFsAutoPlanForm">
        <input type="hidden" name="id" >
        <div class="layui-form-item">
            <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">计划名称</label>
                <div class="layui-input-block">
                    <input type="text" name="planName" lay-verify="required" class="layui-input">
                </div>
            </div>
        </div>
        <label class="layui-form-label">计划策略</label>
        <div class="layui-form-item">
            <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">开始时间</label>
                <div class="layui-input-block">
                    <input type="text" name="startTime" lay-verify="required"  class="layui-input">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">结束时间</label>
                <div class="layui-input-block">
                    <input type="text" name="endTime"  lay-verify="required" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">上线时间</label>
                <div class="layui-input-block">
                    <input type="text" name="onlineTime" lay-verify="required"  class="layui-input">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                    <label class="layui-form-label">下线时间</label>
                <div class="layui-input-block">
                    <input type="text" name="offlineTime"  lay-verify="required" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">重复周期：</label>
            <input type="checkbox" class="weekDayCheckebox" name="weekOf1" value="true" title="星期一" lay-skin="primary" >
            <input type="checkbox" class="weekDayCheckebox" name="weekOf2" value="true" title="星期二" lay-skin="primary" >
            <input type="checkbox" class="weekDayCheckebox" name="weekOf3" value="true" title="星期三" lay-skin="primary" >
            <input type="checkbox" class="weekDayCheckebox" name="weekOf4" value="true" title="星期四" lay-skin="primary" >
            <input type="checkbox" class="weekDayCheckebox" name="weekOf5" value="true" title="星期五" lay-skin="primary" >
            <input type="checkbox" class="weekDayCheckebox" name="weekOf6" value="true" title="星期六" lay-skin="primary" >
            <input type="checkbox" class="weekDayCheckebox" name="weekOf7" value="true" title="星期日" lay-skin="primary" >
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">投诉次数</label>
                <div class="layui-input-block">
                    <input type="text" name="voteTimes" lay-verify="required" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">跟卖天数</label>
                <div class="layui-input-block">
                    <input type="number" name="beginFollowDays" lay-verify="required" class="layui-input">
                </div>
            </div>
            <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-input-block">
                    <input type="number" name="endFollowDays" lay-verify="required" class="layui-input">
                </div>
            </div>
        </div>
        <button type="button" class="disN" lay-submit=""
                id="editAmazonFsAutoPlanSubmit" lay-filter="editAmazonFsAutoPlanSubmit">提交
        </button>
    </form>
</script>

<script src="${ctx}/static/js/work/amazon/fsAutoPlan.js"></script>
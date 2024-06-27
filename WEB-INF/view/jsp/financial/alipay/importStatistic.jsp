<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>导入统计</title>
<style>
    #LAY-financial-alipay-importStatistic input {
        display: inline-block;
        width: 200px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
    }
    #LAY-financial-alipay-importStatistic input:focus{
        outline: 0;
        box-shadow: 0 0 0 2px rgba(45,140,240,.2);
    }
    #LAY-financial-alipay-importStatistic input:focus, #LAY-financial-alipay-importStatistic input:hover {
    border-color: #57a3f3;
    } 
</style>
<div class="layui-fluid" id="LAY-financial-alipay-importStatistic">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card" style="overflow-x: scroll">
                <div class="layui-card-header">
                    <h2 style="font-weight:bold;">支付宝账单导入确认统计<span style="font-size:16px;">(默认统计当月数据)</span></h2>
                    <div style="position:absolute;top:0;right: 15px">
                        <label>活动结束时间</label>
                        <input type="text" id="alipay_activeEndTime">
                    </div>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="importStatistic_table">
                       <thead><tr></tr></thead>
                       <tbody> </tbody>
                    </table>
                </div>
            </div>
        </div>
	</div>
</div>
<script type="text/javascript" src="${ctx}/static/js/financial/alipay/importStatistic.js"></script>
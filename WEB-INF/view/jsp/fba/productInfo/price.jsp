<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>定价</title>

<style>
    .priceFlex {
        display: flex;
    }
    .priceFlex>input {
        width:80%;
    }
    .priceFlex>span {
        height: 32px;
        line-height: 32px;
        padding-left: 5px;
        box-sizing: border-box;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="fbaPriceForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">国家</label>
                                <div class="layui-input-block">
                                    <select name="countryCode" 
                                    lay-search 
                                    id="fbaPrice_countryCode" 
                                    lay-filter="fbaPrice_countryCode"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="logisAttr" lay-search id="fbaPrice_logisAttr"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">长(cm)</label>
                                <div class="layui-input-block priceFlex">
                                    <input type="number" class="layui-input" name="lengthOfcm">
                                    <span>0.000英寸</span>
                                    <input type="hidden" name="length">
                                </div>
                            </div>
                            
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">月份</label>
                                <div class="layui-input-block">
                                    <select name="month" id="fbaPrice_month"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">商品成本(¥)</label>
                                <div class="layui-input-block">
                                    <input type="number" class="layui-input" name="prodCost">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">宽(cm)</label>
                                <div class="layui-input-block priceFlex">
                                    <input type="number" class="layui-input" name="widthOfcm">
                                    <span>0.000英寸</span>
                                    <input type="hidden" name="width">
                                </div>
                            </div>
                           
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">佣金分类名称</label>
                                <div class="layui-input-block">
<%--                                    <select name="cate" lay-search id="fbaPrice_cate"></select>--%>
                                    <select name="fbaPlatCommisionRuleId" lay-search id="fbaPrice_cate"></select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">商品重量(g)</label>
                                <div class="layui-input-block priceFlex">
                                    <input type="number" class="layui-input" name="prodWeightOfg">
                                    <span>0.000磅</span>
                                    <input type="hidden" name="prodWeight">
                                </div>
                            </div>
                             <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">高(cm)</label>
                                <div class="layui-input-block priceFlex">
                                    <input type="number" class="layui-input" name="heightOfcm">
                                    <span>0.000英寸</span>
                                    <input type="hidden" name="height">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">币种/汇率</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="currencyShow" disabled>
                                    <input type="hidden" name="currency">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">售价(<span id="switchCurrencySymbol">$</span>)</label>
                                <div class="layui-input-block">
                                    <input type="number" class="layui-input" name="sellPrice">
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4" style="padding-left:54px;">
                                <span class="layui-btn layui-btn-sm" lay-submit lay-filter="fbaPrice_submit">定价</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                   <div id="fbaPriceTableContainer"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 渲染表格 --%>
<script type="text/html" id="fbaPriceTableContainerTpl">
    <%-- 基本信息 --%>
    <div class="fbaPrice_baseInfo">
        <table class="layui-table">
            <tbody>
                <tr>
                    <td>仓储尺寸规格</th>
                    <td>{{d.dimension || ''}}</th>
                </tr>
                <tr>
                    <td>体积重量</td>
                    {{# if(d.countryCode == 'US'){ }}
                        <td>{{d.volumeWeight*16 || 0}}盎司({{d.volumeWeight || 0}}磅)</td>
                    {{# }else{ }}
                        <td>{{d.volumeWeight || 0}}g({{d.volumeWeight/1000 || 0}}kg)</td>
                    {{# } }}
                </tr>
                <tr>
                    <td>发货重量</td>
                    {{# if(d.countryCode == 'US'){ }}
                        <td>{{d.deliverWeightByAngSi || 0}}盎司({{d.deliverWeight || 0}}磅)</td>
                    {{# }else{ }}
                        <td>{{d.deliverWeight || 0}}g({{d.deliverWeight/1000 || 0}}kg)</td>
                    {{# } }}
                </tr>
                <tr>
                    <td>FBA派送规格尺寸</td>
                    <td>{{d.fbaChargeDimension || ''}}</td>
                </tr>
                <tr>
                    <td>FBA派送费</td>
                    <td><strong>{{d.currency || ''}}</strong>{{d.fbaCharge || 0}}</td>
                </tr>
                <tr>
                    <td>月度仓储费</td>
                    <td>
                        <div class="fabPrice_monthWarehouseCharge" data-tips="{{d.currency || '币种'}} {{d.monthWarehouseChargePerCF}}*{{d.cubeFoot}} {{d.countryCode !== 'JP' ? '立方英尺': '立方米' }}"><strong>{{d.currency || ''}}</strong>{{d.monthWarehouseCharge || 0}}</div>
                    </td>
                </tr>
                <tr>
                    <td>平台佣金</td>
                    <td><strong>{{d.currency || ''}}</strong>{{d.platCommision || 0}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <%-- 定价信息 --%>
    <div class="fbaPrice_setprice">
        <table class="layui-table">
            <thead>
                <tr>
                    <th>头程物流</th>
                    <th>FBA销售头程</th>
                    <th>头程费用(¥)</th>
                    <th>利润(¥)</th>
                    <th>利润率</th>
                </tr>
            </thead>
            <tbody>
                {{# if(d.profitList.length){ }}
                    {{# layui.each(d.profitList, function(index,item){ }}
                    <tr>
                        <td>{{item.logisticsType}}</td>
                        <td>{{item.fbaSaleLogisticsType}}</td>
                        <td>{{item.headLogisticsPrice}}</td>
                        <td>{{item.profit}}</td>
                        <td>{{(item.profitRate *100).toFixed(3)}}%</td>
                    </tr>
                    {{# }) }}
                {{# }else{ }}
                    <tr>
                        <td colspan="4">暂无数据</td>
                    </tr>
                {{# } }}
            </tbody>
        </table>
    </div>
</script>
<%-- 
英寸和厘米 1厘米=0.3937008英寸
克和英镑转换 1克=0.0022046磅
 --%>


<script src="${ctx}/static/js/fba/price.js"></script>

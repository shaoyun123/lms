<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>运营总览</title>
<style>
    .label_reset{
        padding: 0 10px !important;
    }
    .w_40{
        width: 40% !important;
    }
    .w_80{
        width: 80% !important;
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

    .m_10{
        margin: 10px 10px 0!important;
    }
    .pointer{
        cursor: pointer;
    }
    .red{
        color:red !important;
    }
    .p_10{
        padding: 10px 10px 0!important;
    }


</style>
<div class="layui-fluid" id="LAY-handlepandect">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="pandectForm"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺类型</label>
                                <div class="layui-input-block">
                                    <select name="acctTypeS" id="sysBizDictDetailList">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">销售主管</label>
                                <div class="layui-input-block">
                                    <select name="sellLeaderId" lay-filter="sellLeaderId" id="sysUserList">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctIdS" id="sysSalesPlatAcctList" xm-select="storeAcctIdS" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='storeAcctIdS'>
                                    </select>        
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">注册时间</label>
                                    <div class="layui-input-block">
                                        <input name="registerTime" type="text" class="layui-input" id="registerTime"/>
                                    </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">当前达标状态</label>
                                <div class="layui-input-block">
                                    <select name="isStandard">
                                        <option value="">全部</option>
                                        <option value="true">达标</option>
                                        <option value="false">未达标</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">仓库属性</label>
                                <div class="layui-input-block">
                                    <select name="storeWarehousesS">
                                        <option value="">全部</option>
                                        <option value="0">国内仓</option>
                                        <option value="1">海外仓</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">主站点</label>
                                <div class="layui-input-block">
                                    <select name="siteListS" id="siteList" xm-select="ebay_acct_templat">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <div class="layui-input-block">
                                <button id="pandect_searchBtn" class="layui-btn layui-btn-sm" type="button">查询</button>
                                <button type="reset" id="pandect_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card table_tab">
                    <div class="layui-tab"  id="handlepandectCard">
                        <div class="layui-card-header">
                            <ul class="layui-tab-title" style="display:inline-block;">                
                                <li class="layui-this" data-title="handle_pandect">运营总览(<span id="pandect_num"></span>)</li>
                                <li data-title="sell_amount">可刊登商品数量额度趋势(<span id="sellamount_num"></span>)</li>
                                <li data-title="store_tostandard">店铺达标率(<span id="standardrate_num"></span>)</li>
                            </ul>
                        </div>
                        <div class="layui-tab-content layui-card-body" style="padding:0 10px 10px;">
                            <div class="layui-tab-item layui-show">
                                <table class="layui-table" id="handle_pandect" lay-filter="handle_pandect">
                                </table>
                            </div>
                            <div class="layui-tab-item">
                                <table class="layui-table" id="sell_amount" lay-filter="sell_amount">
                                </table>
                            </div>
                            <div class="layui-tab-item">
                                <table class="layui-table" id="store_tostandard" lay-filter="store_tostandard">
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</div>

<!-- 备注弹框 -->
<script type="text/html" id="store_detail_layer">
        <textarea name="" id="remark" class="layui-textarea m_20 w_80" required lay-verify="required"></textarea>
</script>

<!-- 表格渲染模板 -->
<script type="text/html" id="pl_registerTime">
    {{# if(d.registrationDate){ }}
    <div style="{{getmonths(d.registrationDate)>12?'':'color:red'}}">
    {{Format(d.registrationDate,'yyyy-MM-dd')}}
    <span>(到手月份:{{getmonths(d.registrationDate)}})</span>
    </div>
    {{# }}}
</script>

<script type="text/html" id="pl_storeWarehouses">
    {{# if(d.storeWarehouses){ }}
    {{formatWareHouse(d.storeWarehouses)}}
    {{# }}}
</script>
<script type="text/html" id="pl_storeis">
    {{# if(d.ebayOperationSummarySaleList[0].isStatistical){ }}
        <div style="{{d.isStandard?'':'color:red'}}">
            <div style="{{d.isStandard?'color:green':''}}">
                {{d.isStandard?'达标':'未达标'}}
            </div>
        </div>
    {{# }else {}}
        未考核
    {{# }}}
</script>
<script type="text/html" id="pl_isStatistical">
    <input type="checkbox" data-store="{{d.storeAcctId}}" lay-skin="primary" {{ d.ebayOperationSummarySaleList[0].isStatistical ? 'checked' : '' }}><br>
</script>

<script type="text/html" id="pl_successRate">
    {{d.successRate+'%'}}
</script>

<script type="text/html" id="pl_notice">
    <div>
        {{# if(d.remark){ }}
            <span>{{d.remark}}</span>
        {{# }}}
        <i class="layui-icon layui-icon-edit pointer" data-id="{{d.storeAcctId}}" data-text="{{d.remark}}">&#xe642;</i></div>
</script>

<script type="text/html" id="pl_useStatus">
    {{d.isUsed?'<span style="color: grey;">已使用</span>':'<span style="color: green;">未使用</span>'}}
</script>
<!-- 表格渲染模板 -->
<script src="${ctx}/static/js/publishs/ebay/handlepandect.js"></script>

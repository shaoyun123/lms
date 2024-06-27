<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>货件存取</title>
<style>
    .text_l {
        text-align: left;
    }
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="FbaCheckBox">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="FbaCheckBox_Form" lay-filter="FbaCheckBox_Form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">货件编号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="shipmentId">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">箱子编号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="boxCode">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">存箱状态</label>
                                <div class="layui-input-block">
                                    <select type="text" class="layui-input" name="whBoxStatus">
                                        <option value="" selected>全部</option>
                                        <option value="0">未存</option>
                                        <option value="1">已存</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">箱子状态</label>
                                <div class="layui-input-block">
                                    <select type="text" class="layui-input" name="whBoxPurStatus">
                                        <option value="" selected>全部</option>
                                        <option value="1">未可取</option>
                                        <option value="2">可取</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品sku</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="prodSSkuStr">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">FNSKU</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="fnSkuStr">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderByType" lay-search>
                                        <option value="1">按创建时间正序</option>
                                        <option value="2">按创建时间倒序</option>
                                        <option value="3">按盒子号正序</option>
                                        <option value="4">按可取时间正序</option>
                                        <option value="5">按可取时间倒序</option></select>
                                </div>
                            </div>
                            <!--<input class="disN" type="text" name="limit" value="10">-->
                            <!--<input class="disN" type="text" name="page" value="1">-->

                            <div class="layui-col-lg1 layui-col-md1">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                            id="FbaCheckBox_Search" lay-filter="FbaCheckBox_Search">查询
                                    </button>
                                </div>
                            </div>
                            <div class="layui-col-lg1 layui-col-md1">
                                <span id="FbaCheckBox_total_use_num"></span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header toFixedContain">
                        <div class="fl">
                            <span style="background-color:deepskyblue">    正常盒子已用/总    </span><span id="FbaCheckBox_showInfo_num"></span>
                        </div>
                        <button type="button" class="layui-btn layui-btn-warm layui-btn-sm fr ml200"
                                id="FbaCheckBox_printBtn">
                            打印
                        </button>

                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="FbaCheckBox_putInBox">
                            存箱
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="FbaCheckBox_takeOutBox">
                            取箱
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"
                                id="FbaCheckBox_divideBox">
                            分配
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fl"
                                id="FbaCheckBox_exportBtn">
                            导出
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <div class=" toFixedContain">数量(<span id="fbaCheckBox_curNum"></span>)</div>
                    <table lay-filter="FbaCheckBox_table" class="layui-table" id="FbaCheckBox_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- 表格渲染-弹窗 -->

<!--存箱-->
<script type="text/html" id="FbaCheckBox_putInBox_Form_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaCheckBox_putInBox_Form" lay-filter="FbaCheckBox_putInBox_Form">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">货品SKU</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="fnSku"
                                   id="FbaCheckBox_putInBox_Form_fnSku">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3"></div>
                        <label class="layui-form-label">仓库箱号</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="boxCode">
                        </div>
                </div>
                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal disN" lay-submit=""
                        id="FbaCheckBox_putInBox_Form_submit" lay-filter="FbaCheckBox_putInBox_Form_submit">提交事件
                </button>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">结果</div>
        <div class="layui-card-body">
            <span id="FbaCheckBox_putInBox_result"  style="font-size: 16px;font-weight: bold;color: red;"></span>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">推荐存入箱子</div>
        <div class="layui-card-body">
            <div>
                <table lay-filter="FbaCheckBox_recomPutInBox_table" class="layui-table"
                       id="FbaCheckBox_recomPutInBox_table"></table>
            </div>
        </div>
    </div>
</script>

<!--取箱-->
<script type="text/html" id="FbaCheckBox_takeOutBox_Form_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaCheckBox_takeOutBox_Form" lay-filter="FbaCheckBox_takeOutBox_Form">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">扫描箱号</label>
                        <div class="layui-inline">
                            <input type="text" class="layui-input" name="boxCode">
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-normal disN" lay-submit=""
                                    id="FbaCheckBox_takeOutBox_Form_submit"
                                    lay-filter="FbaCheckBox_takeOutBox_Form_submit">
                                提交事件
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="layui-card">
        <div class="layui-card-header">结果</div>
        <div class="layui-card-body">
            <span id="FbaCheckBox_takeOutBox_result" style="font-size: 16px;font-weight: bold;color: red;"></span>
        </div>
    </div>
</script>

<!--补充子商品信息-->
<script type="text/html" id="FbaCheckBox_complete_psi_info_Form_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="FbaCheckBox_complete_psi_info_Form" lay-filter="FbaCheckBox_complete_psi_info_Form">
                <input type="hidden" class="layui-input" name="id">
                <div class="layui-form-item">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">子商品SKU</label>
                        <div class="layui-inline">
                            <input type="tesx" class="layui-input" name="sSku" disabled>
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">外箱长(cm)</label>
                        <div class="layui-inline">
                            <input type="number" class="layui-input" required lay-verify="required" name="outerBoxLength">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">外箱宽(cm)</label>
                        <div class="layui-inline">
                            <input type="number" class="layui-input" required lay-verify="required" name="outerBoxWidth">
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">外箱高(cm)</label>
                        <div class="layui-inline">
                            <input type="number" class="layui-input" required lay-verify="required" name="outerBoxHeight">
                        </div>
                    </div>
                </div>

                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal disN" lay-submit=""
                        id="FbaCheckBox_complete_psi_info_Form_submit" lay-filter="FbaCheckBox_complete_psi_info_Form_submit">提交事件
                </button>
            </form>
        </div>
    </div>
</script>

<!-- 表格渲染-td内容格式 -->
<script type="text/html" id="FbaCheckBox_time_tpl">
    <div class="text_l"><span>创建：</span><span>{{Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>审核：</span><span>{{Format(d.auditTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>修改：</span><span>{{Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
</script>

<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="FbaCheckBox_Option">
    {{# if(d.useStatus){ }}
        <button class="layui-btn layui-btn-sm" lay-event="printAllInfo">导出</button>
    {{# } }}
</script>

<script type="text/html" id="FbaCheckBox_subSkuInfo_tpl">
   {{# if(d.relSkuList){ }}
        <table class="layui-table" style="width:100%;text-align: center;color: #000;">
            {{#   layui.each(d.relSkuList, function(index, item){ }}
            <tr>
                <td style="width:15%;">{{item.prodSSku}}</td>
                <td style="width:15%;">{{item.sellerSku}}</td>
                <td style="width:15%;">{{item.fnSku}}</td>
                <td style="width:15%;">{{item.locationCode || ''}}</td>
                <td style="width:3%;">{{item.planQuality}}</td>

                {{#   if(item.matchStatus==1){ }}
                <td style="width:3%;color: greenyellow">已包</td>
                {{#  }else{ }}
                <td style="width:3%;;color: indianred">未包</td>
                {{# } }}
                {{#   if(item.whBoxStatus==1){ }}
                    <td style="width:3%;;color: greenyellow">已存</td>
                {{#  }else{ }}
                    <td style="width:3%;;color: indianred">未存</td>
                {{# } }}
                <td style="width:3%;">{{item.skuAmt}}</td>

                <td style="width:28%;">
                    <div class="clearLeft">
                    <div class="fl">
                            <span class="secondary">配货：</span>
                            {{# if(item.planMatchStatus === 6){ }}
                            <span style="color:red">缺货;{{item.lackMatcher}};{{Format(item.lackMatchTime,'yyyy-MM-dd hh:mm:ss')}}</span>
                            {{# } else if(item.planMatcher) {}}
                            <span>
                            {{item.planMatcher}}
                        </span>
                            {{# } }}
                            {{# if(item.planMatchTime){}}
                            &nbsp;{{Format(item.planMatchTime,'yyyy-MM-dd hh:mm:ss')}}
                            {{# } }}
                        </div>
                    </div>
                    <div class="clearLeft">
                        <div class="fl">
                            <span class="secondary">包装：</span>
                            {{# if(item.matcher){}}
                            <span>
                        {{item.matcher}}
                             </span>
                            {{# } }}
                            {{# if(item.matchTime){}}
                            &nbsp;{{Format(item.matchTime,'yyyy-MM-dd hh:mm:ss')}}
                            {{# } }}
                        </div>
                    </div>

                </td>

<%--                <td style="width:28%;">--%>
<%--                    <div class="fl"><span class="secondary">配货：</span>黄鹏&nbsp;2023-07-25 17:09:33</div>--%>
<%--                    <div class="fl"><span class="secondary">包装：</span>付春幸&nbsp;2023-07-25 17:09:56</div>--%>
<%--                </td>--%>

            </tr>
            {{# }) }}

        </table>
   {{# } }}
</script>
<script type="text/html" id="FbaCheckBox_subSkuInfo_title_tpl">
    <div style='text-aligh:center;border-bottom:1px solid #e6e6e6'>商品信息</div>
    <div style='display:flex;justify-content:space-between'>
    <div style='width:15%;text-aligh:center;border-right:1px solid #e6e6e6'>商品SKU</div>
    <div style='width:15%;text-aligh:center;border-right:1px solid #e6e6e6'>店铺SKU</div>
    <div style='width:15%;text-aligh:center;border-right:1px solid #e6e6e6'>fnSKU</div>
    <div style='width:15%;text-aligh:center;border-right:1px solid #e6e6e6'>库位</div>
    <div style='width:3%;text-aligh:center;border-right:1px solid #e6e6e6'>数量</div>
    <div style='width:3%;text-aligh:center'>包装</div>
    <div style='width:3%;text-aligh:center'>存箱</div>
    <div style='width:3%;text-aligh:center'>sku种类</div>
    <div style='width:28%;text-aligh:center'>操作详情</div>
    </div>
 </script>

<script type="text/html" id="FbaCheckBox_shipmentId_tpl">
    {{# if(d.shipmentId){ }}
    <div class="text_l">「{{ d.storeName }}」</div>
    <div class="text_l">{{ d.shipmentId }}</div>
    <div class="text_l">{{ d.storeAcct }}--{{ d.salesSite }}</div>
    <div class="text_l"><span class="secondary">种类：</span>{{d.relSkuList ? d.relSkuList.length : 0}}</div>
    <div class="text_l"><span class="secondary">状态：</span>
        {{# if(d.whBoxPurStatus == 0){ }}
        <span>未分配</span>
        {{# }else if(d.whBoxPurStatus == 1){ }}
        <span>不可取</span>
        {{# }else if(d.whBoxPurStatus == 2){ }}
        <span>可取</span>
        {{# }else if(d.whBoxPurStatus == 3){ }}
        <span>已取</span>
        {{# } }}
    </div>
    {{# } }}
</script>


<script type="text/html" id="FbaCheckBox_whBoxPurStatus_tpl">
    {{# if(d.whBoxPurStatus == 0){ }}
    <span>未分配</span>
    {{# }else if(d.whBoxPurStatus == 1){ }}
    <span>不可取</span>
    {{# }else if(d.whBoxPurStatus == 2){ }}
    <span>可取</span>
    {{# }else if(d.whBoxPurStatus == 3){ }}
    <span>已取</span>
    {{# } }}
</script>

<script type="text/html" id="FbaCheckBox_editRemark_tpl">
    <div>
        <span>{{ d.whRemark||'' }}</span>
        <img src="${ctx}/static/img/edit.png" title="编辑">
        <input type="hidden" name="fbaBox_whRemark" value="{{d.whRemark|| '' }}">
    </div>
</script>

<script type="text/html" id="FbaCheckBox_timeTpl">
    {{# if (d.shipCreateTime) {}}
    <div><span class="secondary">创建: </span>{{Format(d.shipCreateTime,"yyyy-MM-dd hh:mm:ss")}}</div>
    {{#}}}
    {{# if (d.takeAbleTime) {}}
    <div><span class="secondary">可取: </span>{{d.takeAbleTime.substring(0,19)}}</div>
    {{# } }}
</script>

<script src="${ctx}/static/js/warehouse/fbaCheckBox.js"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>
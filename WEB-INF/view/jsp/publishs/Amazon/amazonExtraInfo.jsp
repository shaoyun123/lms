<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>亚马逊商品补充信息</title>
<style>
#amazonProdEtraInfoEdit_Form.layui-form-pane .layui-form-label {
    width: 250px
}
#amazonProdEtraInfoEdit_Form.layui-form-pane .layui-input-block {
    margin-left: 250px
}
</style>
<div class="layui-fluid" id="amazonProdEtraInfo"> <!--容器-->
    <div class="layui-row layui-col-space15"><!--行-->
        <div class="layui-col-lg12 layui-col-md12"><!--偏移-->
            <div class="layui-card"><!--card-->
                <div class="layui-card-body"><!--card.body-->

                    <form class="layui-form" id="amazonProdEtraInfo_SearchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">选择类目</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button"
                                            id="amazonProdExtraInfo_item">选择类目
                                    </button>
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('LAY-amazon-prod-etra-info-div','LAY-amazon-prod-etra-info-hidden')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" id="LAY-amazon-prod-etra-info-hidden" name="cateId">
                                </div>
                            </div>

                            <!--精确select-->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwner" id="amazonExtraInfo_bizzOwner" xm-select="amazonExtraInfo_bizzOwner" xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value=""></option>
                                        <c:forEach items="${bizzOwners}" var="bizzOwner">
                                            <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <!--精确select-->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">补充信息</label>
                                <div class="layui-input-block">
                                    <select name="haveExtraflag">
                                        <option value="">全部</option>
                                        <option value="true">已添加</option>
                                        <option value="false">未添加</option>
                                    </select>
                                </div>
                            </div>

                            <!--精确select-->
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="salesSite">
                                        <c:forEach items="${amazonMakets}" var="amazonMaket">
                                            <option value="${amazonMaket.getMarketName()}">${amazonMaket.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md4 layui-col-lg4">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="amazonProdExtraInfo_showHideVagueFlag">
                                        <option value="pSkus">父SKU</option>
                                        <option value="sSkus">模板子SKU</option>
                                        <option value="cnTitle">商品中文</option>
                                        <option value="enTitle">商品英文</option>
                                    </select>
                                </div>
                                <div class="layui-input-block inputAndSelect">
                                    <div class="layui-col-md9 layui-col-lg9">
                                        <input name="searchText" type="text" class="layui-input" placeholder="">
                                    </div>
                                    <div id="amazonExtraInfo_skuVagueFlag_div" class="layui-col-md3 layui-col-lg3">
                                        <select name="skuVagueFlag">
                                            <option value="false">精确</option>
                                            <option value="true">模糊</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">在售状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="">全部</option>
                                        <option value="true" selected>在售</option>
                                        <option value="false">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType">
                                        <option value="CREATE_TIME" selected>创建时间</option>
                                        <option value="AUDIT_TIME">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="time" autocomplete="off" class="layui-input"
                                           id="amazonProdExtraInfoTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">侵权状态</label>
                                <div class="layui-input-block">
                                    <select name="tortBanListing">
                                        <%--<c:forEach items="${tortBanListings}" var="tortBanListing">--%>
                                            <%--&lt;%&ndash;<c:if test="${tortBanListing.getText() != '全部'}">&ndash;%&gt;--%>
                                            <%--<option value="${tortBanListing.name()}">${tortBanListing.getText().replace("该平台","amazon")}</option>--%>
                                            <%--&lt;%&ndash;</c:if>&ndash;%&gt;--%>
                                        <%--</c:forEach>--%>
                                            <option value="CURRENT_PLAT">amazon不侵权</option>
                                            <option value="ANY_PLAT">所有平台都不侵权</option>
                                            <option value="ALL">全部</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 pl20">
                                <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button"
                                        id="amazonProdEtraInfo_search">搜索
                                </button>
                            </div>
                        </div>
                    </form>
                    <div id="LAY-amazon-prod-etra-info-div"></div>
                </div>
            </div>
            <div class="layui-card" id="amazonProdExtraInfoCard">
                <div class="layui-card-body" id="amazonProdEtraInfoTableDiv">
                    <permTag:perm funcCode="amazon_extra_info_property_setting">
                        <div>
                            <a class="layui-btn layui-btn-normal propertySetting" style="float: right;">属性设置</a>
                        </div>
                    </permTag:perm>
                    <permTag:perm funcCode="amazon_extra_info_setting">
                        <div>
                            <a class="layui-btn layui-btn-normal attrSetting" style="float: right;margin-right:20px;">类目模板维护</a>
                        </div>
                    </permTag:perm>
                    <!-- 表格你自己渲染 -->
                    <table class="layui-table" id="amazonProdEtraInfoTable"
                           lay-filter="amazonProdEtraInfoTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>


<!-- 编辑按钮-->
<script type="text/html" id="amazonProdEtraInfoEditBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
</script>

<!-- 弹窗 :编辑 -->
<script type="text/html" id="amazonProdEtraInfoEdit_Layer">
    <div class="p20">
        <form action="" class="layui-form layui-form-pane" id="amazonProdEtraInfoEdit_Form">
            <input type="text" name="prodPId" required hidden>
            <input type="text" name="salesSite" required hidden>

            <div class="layui-card-body layui-row">
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit lay-filter="updateAmazonExtraInfo"
                            id="updateAmazonExtraInfo">提交
                    </button>
                </div>
            </div>
        </form>
    </div>
</script>


<script type="text/html" id="amazonExtraInfo_platTortTpl">
    <div style="width: 300px;text-align:left;" class="layui-form">
        {{#  if(d.isWishTort){ }}
        <input type="checkbox" checked disabled title="wish" lay-skin="primary">
        {{#  } else { }}
        <input type="checkbox" disabled  title="wish" lay-skin="primary">
        {{#  } }}
        <span class="w120 inline_table hv20">{{ d.wishTortReason ? d.wishTortReason : ''}}</span>
        <br>
        {{#  if(d.isJoomTort){ }}
        <input type="checkbox" disabled checked title="joom" lay-skin="primary">
        {{#  } else { }}
        <input type="checkbox" disabled  title="joom" lay-skin="primary">
        {{#  } }}
        <span class="w120 inline_table hv20">{{ d.joomTortReason ? d.joomTortReason : ''}}</span>
        <br>
        {{#  if(d.isEbayTort){ }}
        <input type="checkbox" disabled checked title="ebay" lay-skin="primary">
        {{#  } else { }}
        <input type="checkbox" disabled  title="ebay" lay-skin="primary">
        {{#  } }}
        <span class="w120 inline_table hv20">{{ d.ebayTortReason ? d.ebayTortReason : ''}}</span>
        <br>
        {{#  if(d.isAmazonTort){ }}
        <input type="checkbox" disabled checked title="amazon" lay-skin="primary">
        {{#  } else { }}
        <input type="checkbox" disabled  title="amazon" lay-skin="primary">
        {{#  } }}
        <span class="w120 inline_table hv20">{{ d.amazonTortReason ? d.amazonTortReason : ''}}</span>
        <br>
        {{#  if(d.isSmtTort){ }}
        <input type="checkbox" disabled checked title="smt" lay-skin="primary">
        {{#  } else { }}
        <input type="checkbox" disabled  title="smt" lay-skin="primary">
        {{#  } }}
        <span class="w120 inline_table hv20">{{ d.smtTortReason ? d.smtTortReason : ''}}</span>
        <br>
        {{#  if(d.isShopeeTort){ }}
        <input type="checkbox" disabled checked title="shopee" lay-skin="primary">
        {{#  } else { }}
        <input type="checkbox" disabled  title="shopee" lay-skin="primary">
        {{#  } }}
        <span class="w120 inline_table hv20">{{ d.shopeeTortReason ? d.shopeeTortReason : ''}}</span>
        <br>

    </div>
</script>

<script type="text/html" id="amazonExtraInfo_kvTpl">
    {{# if(d.attrKeyVal){d.attrKeyVal.split("#,#").forEach(function(kvStr){ }}
            <span>{{kvStr}}</span><br>
    {{#    });} }}
</script>

<!-- 弹窗 :修改属性设置 -->
<script type="text/html" id="amazonEtraInfoPropertySetting">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="amazonEtraInfoPropertySettingForm">
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">站点</label>
                        <div class="layui-input-block">
                            <select name="salesSite" lay-filter="amazonEtraInfoSalesSite" lay-search>
                                <option></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">模板名称</label>
                        <div class="layui-input-block">
                            <select name="tempFileName" lay-filter="amazonEtraInfoTempFileName" lay-search>
                                <option></option></select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">产品类型</label>
                        <div class="layui-input-block">
                            <select name="feedProductType" lay-filter="amazonEtraInfoFeedProductType" lay-search>
                                <option></option></select>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            <a class="layui-btn layui-btn-normal layui-btn-sm" id="amazonEtraInfoLayerFormSearch">查询</a>
                        </div>
                    </div>
                </div>
            </form>
            <input type="hidden" name="amazonExtraInfoSalesSite">
            <input type="hidden" name="amazonExtraInfoTempFileName">
            <input type="hidden" name="amazonExtraInfoFeedProductType">
            <span>类目固定值：修改相同“站点”和“模板名称”下的所有商品的该字段值；产品类型固定值：修改相同“站点”、“模板名称”和“产品类型”下的所有商品的该字段值；</span>
            <a class="layui-btn layui-btn-normal layui-btn-sm" id="amazonEtraInfoLayerDeleteRequired">一键清除必填项</a>
            <table class="layui-table" lay-filter="amazonExtraInfoPropertySettingTable"
                   id="amazonExtraInfoPropertySettingTable"></table>
        </div>
    </div>
</script>

<!-- 弹窗 :修改属性设置 -->
<script type="text/html" id="amazonEtraInfoAttrSetting">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="amazonEtraInfoAttrSettingForm">
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">站点</label>
                        <div class="layui-input-block">
                            <select name="salesSite" lay-filter="amazonSettingSalesSite" lay-search>
                                <option></option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
            <div class="layui-upload">
                <button type="button" class="layui-btn layui-btn-normal" id="amazonEIList">选择文件</button>
                <div class="layui-upload-list" style="max-width: 1000px;">
                    <table class="layui-table">
                        <colgroup>
                            <col>
                            <col width="150">
                            <col width="260">
                            <col width="150">
                        </colgroup>
                        <thead>
                        <tr><th>文件名</th>
                            <th>大小</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr></thead>
                        <tbody id="amazonEIDemoList"></tbody>
                    </table>
                </div>
                <button type="button" class="layui-btn" id="amazonEIListAction">开始上传</button>
            </div>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/commodity/template/productTplButton.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
<script src="${ctx}/static/js/publishs/amazon/amazonExtraInfo.js"></script>
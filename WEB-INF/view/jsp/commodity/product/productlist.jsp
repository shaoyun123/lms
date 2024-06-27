<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>商品列表</title>
<style>


    /* 弹框表单的样式调整 */
    #addSSkuForm .layui-form-label{
        padding: 9px;
    }
    .productlist_header_button {
        position:absolute;
        right: 20px;
    }
    .productlist_header_button_smallScreen {
        position:absolute;
        right: 20px;
        /* top: 36px; */
        /* z-index: 20199527; */
    }
    #opl_searchForm .layui-form-switch {
        margin-top: 5px;
    }
    #ali1688SkuInfo {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    #ali1688SkuInfo .layui-form-radio {
        margin: 0;
    }
    #ali1688SkuInfoBox {
        padding: 0 20px;
    }
    .skuInfoItem1 {
        width: 16%;
        height: 240px;
        display: flex;
        flex-direction: column;
        margin-top: 5px;
        padding: 5px;
        box-shadow: 1px 1px 15px 1px #e7e3e3;
        box-sizing: border-box;
    }
    .skuInfoItem1 img {
        width: 140px;
        height: 140px;
    }
    .countInput {
        width: 140px;
        margin-top: 5px;
        position: relative;
        left: 50%;
        margin-left: -70px;
    }
    .img-content1 {
        position: relative;
        width: 140px;
        left: 50%;
        margin-left: -70px;
    }
    .mulSpec {
        padding-left: 10px;
        color: #000;
    }
    .mulSpec i {
        vertical-align: middle;
        padding-right: 10px;
    }
    .img-content1 .layui-form-radio, 
    .img-content1 .layui-form-checkbox {
        position: absolute;
        top: 5px;
        left: -30px;
    }
    .fontBold {
        font-weight: bold;
    }
    #subSkuPop_product_card .layui-table-view {
        max-height: 200px;
        overflow-y: auto;
    }
    .expandIcon {
        width: 30px;
        height: 30px;
        margin-left: 10px;
        border-radius: 50%;
        border: 1px solid #bbb;
        color: #bbb;
        font-size: 20px;
        text-align: center;
        line-height: 30px;
        background-color: #fff;
        cursor: pointer;
    }
</style>
<div class="layui-fluid" id="LAY-work-develop-pl">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="opl_searchForm" id="opl_searchForm"
                          autocomplete="off">
                          <div id="product_Form_channelDiv" class="disN">
                            <option value="">全部</option>
                            <c:forEach items="${channelList}" var="channel">
                                <option value="${channel.channel}" data-plat="${channel.platCode}">${channel.channel}</option>
                            </c:forEach>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">新类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="plat_choose_outside_prodlist">选择分类
                                    </button>
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary catePresetsBtn" data-show="prodOnline_pl_search_cate">预设分类
                                    </button>
                                    <i id="prod_clearPlat_outside_prodlist" class="layui-icon layui-icon-delete"
                                       style="cursor: pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="organize" lay-filter="productlist_orgs_hp_devPerson" class="orgs_hp_custom" data-id="productlist_orgs_hp_devPerson" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label labelSel">
                                    <select name="userType" lay-search>
                                        <option value="bizzOwnerIdList">开发专员</option>
                                        <option value="responsorIdList">责任人</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <select name="userId" class="users_hp_custom"
                                            xm-select="productlist_users_hp_devPerson"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter='productlist_users_hp_devPerson'
                                            data-id="productlist_users_hp_devPerson" data-roleList="开发专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购员</label>
                                 <div class="layui-input-block" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${buyers}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <%--<input hidden name="buyerId" hp-select-value>--%>
                                    <input class="layui-input" name="buyer" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="prodAttrListStr" xm-select="prodAttrList"
                                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                            lay-filter='productlist_prodAttrList'>
                                        <option value=""></option>
                                        <c:forEach items="${prodTags}" var="tag">
                                            <option value="${tag.name}">${tag.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="logisAttrRelation" lay-search>
                                        <option value="and">物流属性(与)</option>
                                        <option value="or">物流属性(或)</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="logisAttr" xm-select="logisAttr_productlist" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='logisAttr_productlist'>
                                        <option value=""></option>
                                        <c:forEach items="${logisAttrList}" var="logisAttr">
                                            <option value="${logisAttr.name}"
                                                    alias="${logisAttr.alias}">${logisAttr.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                                <div hidden id="pl_logisAttrList">
                                    <c:forEach items="${logisAttrList}" var="logisAttr">
                                        <option value="${logisAttr.name}"
                                                alias="${logisAttr.alias}">${logisAttr.name}</option>
                                    </c:forEach>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchType" lay-search>
                                        <option value="sSku">子SKU</option>
                                        <option value="pSku">父SKU</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="display: flex;">
                                    <input name="searchValue" style="width:70%" type="text" class="layui-input" placeholder="支持10000个SKU">
                                    <input name="switchSearchValue" type="checkbox" lay-skin="switch" lay-text="精确|模糊">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品名称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="title" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devType" xm-select="devType_productlist" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='devType_productlist'>
                                        <option value="">全部</option>
                                        <c:forEach items="${devTypeEnums}" var="devTypeEnum">
                                            <option value="${devTypeEnum.getName()}">${devTypeEnum.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="supplierId">
                                    <div>
                                        <input id="pl_searchSupplier"  name="supplierName" class="layui-input"/>
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchTimeType" lay-search>
                                        <option value="1">创建时间</option>
                                        <option value="2">停售时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="searchTime" id="productlistTime">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">默认发货仓</label>
                                <div class="layui-input-block">
                                    <select name="defaultDlvrWhId" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${wareHouseList}" var="wareHouse">
                                            <option value="${wareHouse.id}">${wareHouse.warehouseName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label" style="padding: 0 15px">
                                    <select name="avgReceiveDayLastThreeMonthWarehouseName" lay-search>
                                        <option value="义乌仓">义乌实到天数</option>
                                        <option value="自建南宁仓">南宁实到天数</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="avgReceiveDayLastThreeMonthMin" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                    <div class="layui-col-lg5 layui-col-md5">
                                        <input type="number" name="avgReceiveDayLastThreeMonthMax" autocomplete="off" class="layui-input" placeholder="包含">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderByType" lay-search>
                                        <option value="1">创建时间倒序</option>
                                        <option value="2">创建时间正序</option>
                                        <option value="3">审核时间倒序</option>
                                        <option value="4">审核时间正序</option>
                                        <option value="5">直邮30天销量倒序</option>
                                        <option value="6">直邮30天销量正序</option>
                                        <option value="8">义乌30天销量倒序</option>
                                        <option value="7">义乌30天销量正序</option>
                                        <option value="10">南宁30天销量倒序</option>
                                        <option value="9">南宁30天销量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="isCombination" lay-search>
                                    <option value="">组合品</option>
                                    <option value="1">是组合品</option>
                                    <option value="0">非组合品</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="isSale" lay-search="">
                                    <option value="">商品状态</option>
                                    <option value="1">在售</option>
                                    <option value="0">停售</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="auditStatus" lay-search>
                                    <option value="">审核状态</option>
                                    <option value="1">待审核</option>
                                    <option value="3">审核通过</option>
                                    <option value="4">审核失败</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="hasImage" lay-search>
                                    <option value="">图片</option>
                                    <option value="true">有图片</option>
                                    <option value="false">无图片</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <select name="serverType" lay-search>
                                    <option value="">默认链接类型</option>
                                    <option value="1688">1688</option>
                                    <option value="淘宝">淘宝</option>
                                </select>
                            </div>
                            <div class="layui-col-md1 layui-col-lg1">
                                <div class="externalBox" id="showMoreSearchCondition_productlist">更多查询条件
                                    <span id="hide_icon_processlist" class="fr mr10 disN">︽</span>
                                    <span id="show_icon_processlist" class="fr mr10">︾</span>
                                </div>
                            </div>
                            <div class="externalContain disN">
                                <div class="externalPop">
                                        <div class="layui-form-item">
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">是否定制</label>
                                                <div class="layui-input-block">
                                                    <select name="isSpecialMake" lay-search>
                                                        <option value=""></option>
                                                        <option value="1">是</option>
                                                        <option value="0">否</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">是否独立包装</label>
                                                <div class="layui-input-block">
                                                    <select name="isAlonePack" lay-search>
                                                        <option value=""></option>
                                                        <option value="1">是</option>
                                                        <option value="0">否</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">是否匹配1688</label>
                                                <div class="layui-input-block">
                                                    <select name="isMatch1688" lay-search>
                                                        <option value=""></option>
                                                        <option value="1">是</option>
                                                        <option value="0">否</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">清仓商品</label>
                                                <div class="layui-input-block">
                                                    <select name="prodUnsoldProcessStatusList" 
                                                    xm-select="devType_prodUnsoldProcessStatusList" xm-select-search xm-select-search-type="dl"
                                                    xm-select-skin="normal" lay-filter='devType_prodUnsoldProcessStatusList' lay-search>
                                                        <option value="">请选择(多选)</option>
                                                        <option value="待审核">待审核</option>
                                                        <option value="打折清仓">打折清仓</option>
                                                        <option value="待打包清仓">待打包清仓</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">默认供应商链接状态</label>
                                                <div class="layui-input-block">
                                                    <select name="supplierUrlValidStatus" lay-search>
                                                        <option value=""></option>
                                                        <option value="0">失效</option>
                                                        <option value="1">有效</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">需要质检</label>
                                                <div class="layui-input-block">
                                                    <select name="ifNeedQualityCheck" lay-search>
                                                        <option value=""></option>
                                                        <option value="1">是</option>
                                                        <option value="0">否</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <div class="layui-form-label" style="padding: 0 15px">
                                                    <select name="searchType1" lay-search>
                                                        <option value="model">型号</option>
                                                        <option value="specification">规格</option>
                                                    </select>
                                                </div>
                                                <div class="layui-input-block">
                                                    <input name="searchValue1" type="text" class="layui-input" placeholder="多个逗号分隔" maxlength="2000">
                                                </div>
                                            </div>
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">液体(ml)</label>
                                                <div class="layui-input-block">
                                                    <div class="layui-col-lg5 layui-col-md5">
                                                        <input name="liquidNetContentMlStart" type="text" class="layui-input">
                                                    </div>
                                                    <div class="layui-col-lg2 layui-col-md2" style="text-align: center">-</div>
                                                    <div class="layui-col-lg5 layui-col-md5">
                                                        <input name="liquidNetContentMlEnd" type="text" class="layui-input">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <div class="layui-col-md5 layui-col-lg5">
                                                <label class="layui-form-label">按父SKU同步尺寸和重量</label>
                                                <div class="layui-input-block">
                                                    <select name="ifSycSizeWeight" lay-search>
                                                        <option value=""></option>
                                                        <option value="true">是</option>
                                                        <option value="false">否</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>

                            <div class="layui-col-md1 layui-col-lg1" style="padding-left:32px;margin-top:2px">
                                <button id="pl_searchBtn" class="layui-btn layui-btn-sm keyHandle layui-btn-normal" type="button" data-type="reload">查询</button>
                                <button type="reset" id="pl_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="prodOnline_pl_search_cate"></div>
                        <input type="hidden" name="cateOaId" value="" id="plat_chooseid_inp_outside_prodlist"/>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="productlistCard">
                <div class="layui-card-header">
                    <span class="numCount">商品数量<span id="sSkuNum"></span></span>
                    <permTag:perm funcCode="downTemp_productlist">
                        <div class="layui-input-inline w100 layui-form ml10" >
                            <select lay-filter="downTempBtn_productlist"  lay-search>
                                <option value="" disabled selected>下载模板</option>
                                <option value="1">修改模板</option>
                                <!-- <option value="2">新增模板</option> -->
<%--                                <option value="4">修改供应商模板</option>--%>
                            </select>
                        </div>
                    </permTag:perm>
                    <permTag:perm funcCode="updateByExcel_productlist">
                        <button type="button" class="layui-btn layui-btn-danger layui-btn-sm ml10" onclick="document.getElementById('sInfoExcel_productlist').click()">导入Excel修改</button>
                        <input type="file" name="sInfoExcel" id="sInfoExcel_productlist" hidden>
                    </permTag:perm>
<%--                    <permTag:perm funcCode="updateSupplierByExcel_productlist">--%>
<%--                        <button type="button" class="layui-btn layui-btn-danger layui-btn-sm ml10" onclick="document.getElementById('updateSupplierByExcel_productlist').click()">导入Excel修改供应商</button>--%>
<%--                        <input type="file" name="sInfoExcel" id="updateSupplierByExcel_productlist" hidden>--%>
<%--                    </permTag:perm>--%>
                    <!-- <permTag:perm funcCode="addByExcel_productlist">
                        <button type="button" class="layui-btn layui-btn-warm layui-btn-sm ml10" onclick="document.getElementById('sInfoExcel_add_productlist').click()">导入Excel新增</button>
                        <input type="file" name="sInfoExcel" id="sInfoExcel_add_productlist" hidden>
                    </permTag:perm> -->
                    <permTag:perm funcCode="exportSSku_productlist">
                        <button type="button" class="layui-btn layui-btn-sm ml10" id="exportSSku_productlist">导出</button>
                    </permTag:perm>
                    <button type="button" class="layui-btn layui-btn-sm" id="productlist_printData">SKU标签打印</button>

                    <span class="productlist_header_button">
                        <permTag:perm funcCode="productlist_updateProdPInfoListBtn">
                            <button type="button" class="layui-btn layui-btn-sm" id="productlist_updateProdPInfoListBtn">批量修改父商品</button>
                        </permTag:perm>
                        <permTag:perm funcCode="winitregist_addProd">
                            <button type="button" class="layui-btn layui-btn-sm" id="productlist_addWinitProd">新增海外仓商品</button>
                        </permTag:perm>
                        <%--<permTag:perm funcCode="importValunteer_productlist">--%>
                            <%--<button type="button" class="layui-btn layui-btn-sm" id="productlist_importValunteer">导入志愿</button>--%>
                            <%--<input type="file" hidden id="productlist_valunteerFile">--%>
                        <%--</permTag:perm>--%>
                        <permTag:perm funcCode="createSSku_productlist">
                            <button type="button" class="layui-btn layui-btn-sm" id="productlist_addProduct">新增商品</button>
                        </permTag:perm>
                        <permTag:perm funcCode="createSSku_productlist">
                            <button type="button" class="layui-btn layui-btn-sm" id="productlist_batchAddProduct">批量创建</button>
                        </permTag:perm>
                          <permTag:perm funcCode="match1688Info_productlist">
                              <button type="button" class="layui-btn layui-btn-warm layui-btn-sm" id="productlist_match1688Info">批量匹配1688</button>
                          </permTag:perm>
                        <permTag:perm funcCode="update_productlistOld">
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" id="productlist_updateList">批量修改</button>
                        </permTag:perm>
                        <permTag:perm funcCode="update_productlist">
                            <button type="button" class="layui-btn layui-btn-danger layui-btn-sm" id="productlist_updateListNew">批量修改（新）</button>
                        </permTag:perm>
                        <permTag:perm funcCode="audit_productlist">
                            <button type="button" class="layui-btn layui-btn-warm layui-btn-sm" id="productlist_auditListBtn">批量审核</button>
                        </permTag:perm><%--审核权限--%>
                        <permTag:perm funcCode="createCombSSku_productlist">
                            <button type="button" class="layui-btn layui-btn-sm" id="productlist_addGroupList">新增组合品</button>
                        </permTag:perm>

                    </span>
                </div>
                <div class="layui-card-body">
                    <table class="layui-table" id="sProdTable" lay-filter="sProdTable"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<permTag:perm funcCode="audit_productlist"><input hidden id="ifCheck_produclist"></permTag:perm><%--审核权限--%>
<permTag:perm funcCode="update_productlist"><input hidden id="ifUpdate_produclist"></permTag:perm><%--商品修改权限--%>
<permTag:perm funcCode="updateComb_productlist"><input hidden id="ifUpdateComb_produclist"></permTag:perm><%--修改权限--%>
<permTag:perm funcCode="add_prodSupplier"><input hidden id="ifAddSupplier_produclist"></permTag:perm><%--新增供应商权限--%>
<div hidden id="cateOption_productlist">
    <c:forEach items="${secondCateList}" var="secondCate">
        <option value="${secondCate.id}">${secondCate.cateCnName}</option>
    </c:forEach>
</div>
<!-- 新增商品 -->
<script type="text/html" id="productlist_addProductLayer">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title isCreateHidden">
                <li class="layui-this">详情</li>
                <li>操作日志</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="addSSkuForm"
                          autocomplete="off" onsubmit="return false;">
                        <div class="layui-col-md6 layui-col-lg6">
                        <div class="layui-form-item">
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label w90">商品父SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="prodPSku" class="layui-input" >
                                    <ul class="supplierUl productlistSearch"></ul>
                                    <input type="hidden" name="pId" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline" style="height:32px">
                                <button class="layui-btn layui-btn-sm" type="button" data-id="getPskuDetail">获取</button>
                            </div>
                            <div class="layui-inline" style="height:32px">
                                <label class="layui-form-label w90">独立包装</label>
                                <input id="isAlonePack_prodsDetail" type="checkbox" data-id="isAlonePack" title="" lay-skin="primary" disabled>
                            </div>
                            <div class="layui-inline" style="height:32px">
                                <label class="layui-form-label w90">特殊包装</label>
                                <input id="isSpecialPack_prodsDetail" type="checkbox" data-id="isSpecialPack" title="" lay-skin="primary" disabled>
                            </div>

                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label w90">开发专员</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="bizzOwner" class="layui-input" disabled placeholder="根据父关联">
                                </div>
                            </div>
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label w90">责任人</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="responsor" class="layui-input" disabled
                                           placeholder="根据父关联">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">新类目</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="newCate" class="layui-input" placeholder="根据父关联" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">旧类目</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="cate" class="layui-input" placeholder="根据父关联" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">商品标签</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="tags" class="layui-input" placeholder="根据父关联" disabled>
                                </div>
                            </div>
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">开发管理类目</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input type="text" data-id="devCate" class="layui-input" placeholder="根据父关联" disabled>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                        </div>
                        </div>
                            <div class="layui-col-md4 layui-col-lg4">
                            <label class="layui-form-label"><font color='red'>*</font>图片</label>
                            <div class="layui-input-block" id="productlist_imageDiv">
                                <div class="layui-col-md6 layui-col-lg6">
                                    <div in='innerImage' class="productlist_imageEditDiv" id="image_edit0" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                    <div><span class="layui-btn layui-btn-xs searchSupply">查找货源</span></div>
                                </div>
                            </div>
                            </div>
                        <div class="layui-col-md2 layui-col-lg2">
                            <div class="fr">
                                <button type="button" class="layui-btn layui-btn-sm" data-id="addParentSku">新增父SKU</button>
                                <button type="button" class="layui-btn layui-btn-sm" data-id="editParentSku">修改父SKU</button>
                            </div>
                        </div>
                        <hr class="layui-bg-gray">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">商品子SKU</label>
                                <div class="layui-input-block" style="display:flex;align-items: center;">
                                    <input type="text" name="sSku" class="layui-input" maxlength="16" id="productlist_sSkuInput">
                                    <span><span id="productlist_inputCount">0</span>/16</span>
                                    <input type="hidden" name="id" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">采购员</label>
                                <div class="layui-input-block" hp-select>
                                    <div hidden id="buyers_productlist" hp-select-data>
                                        <c:forEach items="${buyers}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <%--<input hidden name="buyerId" hp-select-value>--%>
                                    <input class="layui-input" name="buyer" hp-select-text value="${defaultBuyer == null ? "" : defaultBuyer}">
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">采购成本(¥)</label>
                                <div class="layui-input-block">
                                    <input name="purchaseCostPrice" readonly class="layui-input disAbleInp" min='0' placeholder="采购默认供应商报价">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">内包装成本(¥)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="innerPackCost" class="layui-input disAbleInp" readonly placeholder="采购默认供应商仓库包装费">
                                    <input type="hidden" name="packWeight" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">销售状态</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="isSale" lay-skin="primary" title="停售">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90"><font color="red">*</font>停售原因</label>
                                <div class="layui-input-block">
                                    <select name="notSaleReason" id="stopSaleTag" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${offSaleReasons}" var="reason">
                                            <option value="${reason.name}">${reason.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">停售时间</label>
                                <div class="layui-input-block">
                                    <input type="text" id="notSaleTimeStr" class="layui-input disAbleInp"
                                           placeholder="停售时间,停售状态时显示" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" id="discountPriceFormItem">
                                <label class="layui-form-label w90">打折成本(￥)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="discountPrice" class="layui-input disAbleInp" disabled>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">库存状态</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="isOutOfStock" lay-skin="primary" title="缺货">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">缺货备注</label>
                                <div class="layui-input-block">
                                    <input type="text" name="note" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">库位</label>
                                <div class="layui-input-block">
                                    <input type="text" name="stockLocation" class="layui-input disAbleInp" readonly="readonly" placeholder="库位">
                                    <div style="position: relative;width: 0;height: 0;left: 120px;top: -25px;">
                                        <div style="width: 200px;color:red" name="receiveAddressName"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">入库要求</label>
                                <div class="layui-input-block">
                                    <input type="text" name="packDesc" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-block" notnull>
                                <label class="layui-form-label w90">物流属性</label>
                                <div class="layui-block" id="logisAttr">
                                    <c:forEach items="${logisAttrList}" var="logisAttr">
                                        <%--<c:if test="${logisAttr.name != '普货'}">--%>
                                            <input type='checkbox' lay-skin='primary' name='logisAttrList' title='${logisAttr.name}' value='${logisAttr.name}'>
                                        <%--</c:if>--%>
                                    </c:forEach>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">液体净含量(ml)</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="liquidNetContentMl" lay-skin="primary" title="液体净含量(ml)">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">是否带插头</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="ifWithPlug" lay-skin="primary" title="带插头">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md6 layui-col-lg6 pora" notNull>
                                <label class="layui-form-label w90">商品名称</label>
                                <div class="layui-input-inline" style="width: 55%;">
                                    <input type="text" name="title" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">产品简称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="purchaseChannel" class="layui-input" placeholder=""
                                           maxlength="6" onblur="productlist_getCustomCode(this)">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">款式</label>
                                <div class="layui-input-block">
                                    <input type="text" name="style" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
<%--                            <div class="layui-col-md3 layui-col-lg3">--%>
<%--                                <label class="layui-form-label w90">品牌</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <input type="text" name="brand" class="layui-input">--%>
<%--                                </div>--%>
<%--                            </div>--%>
<%--                            <div class="layui-col-md3 layui-col-lg3">--%>
<%--                                <label class="layui-form-label w90">规格</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <input type="text" name="specification" class="layui-input">--%>
<%--                                </div>--%>
<%--                            </div>--%>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">材质</label>
                                <div class="layui-input-block">
                                    <input type="text" name="material" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">默认发货库</label>
                                <div class="layui-input-block">
                                    <select name="defaultDlvrWhId" id="wareHouseTag">
                                        <c:forEach items="${wareHouseList}" var="wareHouse">
                                            <option value="${wareHouse.id}" ${wareHouse.storeType ==1 and wareHouse.isDefault ? 'selected' : ''}>${wareHouse.warehouseName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">海关编码</label>
                                <div class="layui-input-block">
                                    <input name="customsCode" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">单位</label>
                                <div class="layui-input-block">
                                    <select name="unit" lay-search>
                                        <option></option>
                                        <c:forEach items="${unitList}" var="tag">
                                        <option value="${tag.name}">${tag.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">商品净重(g)</label>
                                <div class="layui-input-block">
                                    <input name="suttleWeight" class="layui-input" min="0" onkeyup="checktNumPositive(this)"
                                           onblur="getTotalWeight('#packspectag option:selected', '#addSSkuForm', '#totalWeight')">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">包装规格</label>
                                <div class="layui-input-block">
                                    <select name="packSpecification" id="packspectag" lay-filter="packspectag" lay-search>
                                        <option value="">请选择</option>
                                        <c:forEach items="${packSpecList}" var="packSpec">
                                            <option value='${packSpec.id}' cost='${packSpec.unitCost}'
                                                    weight='${packSpec.weight}'>${packSpec.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">含包装重量(g)</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input disAbleInp" placeholder="净重+包装重量" id="totalWeight"
                                           readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">是否定制</label>
                                <div class="layui-input-block">
                                    <select name="isSpecialMake" >
                                        <option></option>
                                        <option value="1">是</option>
                                        <option value="0" selected="selected">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">定制产品<br/>到货天数</label>
                                <div class="layui-input-block">
                                    <input type="text" name="purchaseDlvrDays" class="layui-input"  value="5">
                                </div>
                            </div>

                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label w90">定制产品<br/>预警周期</label>
                                <div class="layui-input-block">
                                    <input name="stockWarnCycle" class="layui-input" placeholder="" min="0" value="5">
                                </div>
                            </div>
                        </div>

                        <div class="layui-form-item">
<%--                            <div class="layui-col-md3 layui-col-lg3">--%>
<%--                                <label class="layui-form-label w90">最小包装数</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <input name="minPackingNums" class="layui-input" min="0">--%>
<%--                                </div>--%>
<%--                            </div>--%>
<%--                            <div class="layui-col-md3 layui-col-lg3">--%>
<%--                                <label class="layui-form-label w90">样品数量</label>--%>
<%--                                <div class="layui-input-block">--%>
<%--                                    <input name="sampleNums" class="layui-input" min="0">--%>
<%--                                </div>--%>
<%--                            </div>--%>
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label w90">包装难度</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input name="packDifficulty" class="layui-input" placeholder=""--%>
                                           <%--min="0">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                        </div>

                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">7日销量</label>
                                <div class="layui-input-block">
                                    <input name="sevenSales" class="layui-input disAbleInp" placeholder="" min="0" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">15日销量</label>
                                <div class="layui-input-block">
                                    <input name="fifteenSales" class="layui-input disAbleInp" placeholder="" min="0" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">30日销量</label>
                                <div class="layui-input-block">
                                    <input name="thirtySales" class="layui-input disAbleInp" placeholder="" min="0" disabled>
                                </div>
                            </div>
                        </div>
                        <hr class="layui-bg-gray">
                        <div class="layui-form-item">
                            <p class="taRight">
                                <button type="button" class="layui-btn layui-btn-sm disN addsupplierBtn_productlist">新增供应商</button>
                            </p>
                            <table class="layui-table supplierRefTab_productlist">
                                <thead>
                                <tr>

                                    <th width="8%">供应商<font color="red">*</font></th>
                                    <th width="8%">采购URL<font color="red">*</font></th>
                                    <th width="5%">最小订货量</th>
                                    <th width="5%"><span title="供应商报价(不可编辑,自动计算)=供应商商品报价 + 供应商包装费用">供应商报价(¥)<font color="red">*</font><i class="layui-icon layui-icon-about" ></i></span></th>
                                    <th width="15px">货号标记</th>
                                    <th width="15px">物理分割</th>
                                    <th width="5%">货号</th>
                                    <th width="5%"><span title="一键生成1688订单时，采购数量将乘以该值，并向上取整">采购基数<font color="red">*</font><i class="layui-icon layui-icon-about" ></i></span></th>
                                    <th width="5%"><span>供应商商品报价(¥)</span><font color="red">*</font></th>
                                    <th width="5%"><span>供应商包装</span></th>
                                    <th width="5%"><span>供应商包装费用(¥)</span></th>
                                    <th width="5%"><span>仓库包装费用(¥)</span></th>
                                    <%--<th width="12%"><span title="创建采购订单时，将自动加上以'【prodSId】【商品名】【1688属性】:自动留言内容' 形式的买家留言">自动留言 <i class="layui-icon layui-icon-about" ></i></span></th>--%>
                                    <th width="8%">下单备注</th>
                                    <th width="8%"><span  title="商品对应的1688属性">1688属性<i class="layui-icon layui-icon-about"></i></span></th>
                                    <th width="15px">默认</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody class="layui-form"  id="supplierRefTab_productlist" lay-filter="prodSupplierRef_productlistDetailPop" style="text-align: center">
                                </tbody>
                            </table>
                            <div class="taRight">
                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal addOneLine_productlist">
                                    添加一行
                                </button>
                            </div>
                        </div>
                        <hr class="layui-bg-gray">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品长(cm)</label>
                                <div class="layui-input-block">
                                    <input min="0" name="productLength" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品宽(cm)</label>
                                <div class="layui-input-block">
                                    <input min="0" name="productWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">商品高(cm)</label>
                                <div class="layui-input-block">
                                    <input min="0" name="productHeight" oninput="countThrowWeight(this)"  class="layui-input">
                                </div>
                            </div>
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">压缩高(cm)</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input name="compressHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">叠加高(cm)</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input name="superpositionHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">报关中文</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="baoguan_cn" class="layui-input disAbleInp" disabled
                                           placeholder="根据父关联">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">报关英文</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="baoguan_en" class="layui-input disAbleInp" disabled
                                           placeholder="根据父关联">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">申报价值</label>
                                <div class="layui-input-block">
                                    <input data-id="baoguan_value" class="layui-input disAbleInp" min="0" disabled placeholder="根据父关联">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">原产国</label>
                                <div class="layui-input-block">
                                    <input type="text" name="origin" value="China" class="layui-input disAbleInp" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label">外箱长(cm)</label>
                                <div class="layui-input-block">
                                    <input name="outerBoxLength" min="0" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label">外箱宽(cm)</label>
                                <div class="layui-input-block">
                                    <input name="outerBoxWidth" min="0" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label">外箱高(cm)</label>
                                <div class="layui-input-block">
                                    <input name="outerBoxHeight" min="0" oninput="countThrowWeight(this)"  class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">叠高(cm)</label>
                                <div class="layui-input-block">
                                    <input min="0" name="superpositionHeight" class="layui-input" onkeyup="checktNumPositive(this)">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">抛重(g)</label>
                                <div class="layui-input-block">
                                    <input name="throwWeight" class="layui-input" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">万邑通长(cm)</label>
                                <div class="layui-input-block">
                                    <input name="winitLength" class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">万邑通宽(cm)</label>
                                <div class="layui-input-block">
                                    <input name="winitWidth" class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">万邑通高(cm)</label>
                                <div class="layui-input-block">
                                    <input name="winitHeight" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                        <%--<legend style="font-size:14px">商品状态</legend>--%>
                        <%--</fieldset>--%>

                        <div class="layui-form-item" style="display: none">
                            <div class="layui-input-block taRight">
                                <button class="layui-btn" lay-submit="" lay-filter="addSSku" id="submitSSku">提交</button>
                                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="layui-tab-item p20">
                    <div class="layui-tab layui-tab-brief">
                        <div class="layui-show">
                            <table class="layui-table">
                                <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>描述人</th>
                                    <th>日志</th>
                                </tr>
                                </thead>
                                <tbody id="pl_subLogTbody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<!-- 新增组合品 -->
<script type="text/html" id="addGroupListLayer">
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title isCreateHidden">
                <li class="layui-this">详情</li>
                <li>操作日志</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form action="" lay-filter="component-form-group" class="layui-form" id="addCombForm">
                        <div class="layui-form-item pora">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">商品父SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="prodPSku" class="layui-input">
                                    <ul class="supplierUl productlistSearch"></ul>
                                    <input type="hidden" name="pId" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">开发专员</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="bizzOwner" class="layui-input" disabled
                                           placeholder="根据父关联">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" style="margin-left:40px">
                                <button class="layui-btn layui-btn-sm" type="button" data-id="getPskuDetail">获取</button>
                                <button type="button" class="layui-btn layui-btn-sm" data-id="addParentSku">新增父SKU
                                </button>
                                <button type="button" class="layui-btn layui-btn-sm" data-id="editParentSku">修改父SKU
                                </button>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">责任人</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="responsor" class="layui-input" disabled
                                           placeholder="根据父关联">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">新类目</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="newCate" class="layui-input" placeholder="根据父关联" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">旧类目</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="cate" class="layui-input" placeholder="根据父关联" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">商品标签</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="tags" class="layui-input" placeholder="根据父关联" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">开发管理类目</label>
                                <div class="layui-input-block">
                                    <input type="text" data-id="devCate" class="layui-input" placeholder="根据父关联"
                                           disabled>
                                </div>
                            </div>
                        </div>
                        <hr class="layui-bg-gray">
                        <input type="hidden" name="id">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">组合子SKU</label>
                                <div class="layui-input-block" style="display:flex;align-items:center;">
                                    <input type="text" name="sSku" class="layui-input" maxlength="16" id="productlist_sSkuInputBind">
                                    <span><span id="productlist_inputBindCount">0</span>/16</span>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">产品简称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="purchaseChannel" class="layui-input" maxlength="6" onblur="productlist_getCustomCode(this)">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">材质</label>
                                <div class="layui-input-block">
                                    <input type="text" name="material" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">海关编码</label>
                                <div class="layui-input-block">
                                    <input type="text" name="customsCode" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item" notNull>
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label ">商品名称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="title" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <%--<div class="layui-form-item">--%>
                        <%--<label class="layui-form-label">商品标签</label>--%>
                        <%--<div class="layui-input-block">--%>
                        <%--<input type="text" id="tags_comb2" class="layui-input" placeholder="继承父的,值展示,无法修改">--%>
                        <%--</div>--%>
                        <%--</div>--%>
                        <hr class="layui-bg-gray">
                        <div class="layui-form-item pora" style="padding-left:25px">
                            <p>组合明细</p>
                            <p style="position:absolute;top:-5px;right:10px">
                                <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="addAline">
                                    添加一行
                                </button>
                            </p>
                            <table class="layui-table" id="groupTable">
                                <thead>
                                <tr>
                                    <th width="80%">商品子SKU<font color="red">*</font></th>
                                    <th>数量<font color="red">*</font></th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>

                                </tbody>
                            </table>
                        </div>
                        <hr class="layui-bg-gray">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">物流属性</label>
                                <div class="layui-input-block" style="width:858px" id="logisAttr_comb">
                                    <c:forEach items="${logisAttrList}" var="logisAttr">
                                        <%--<c:if test="${logisAttr.name != '普货'}">--%>
                                            <input type='checkbox' lay-skin='primary' name='logisAttrList' title='${logisAttr.name}' value='${logisAttr.name}' disabled>
                                        <%--</c:if>--%>
                                    </c:forEach>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">液体净含量(ml)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="liquidNetContentMl" class="layui-input" placeholder="根据组合明细计算，不可修改" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">商品净重(g)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="suttleWeight" class="layui-input" placeholder="根据组合明细计算，不可修改" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label ">包装规格</label>
                                <div class="layui-input-block">
                                    <select name="packSpecification" id="packspectag_comb"
                                            lay-filter="packspectag_comb" lay-search>
                                        <option value="">请选择</option>
                                        <c:forEach items="${packSpecList}" var="packSpec">
                                            <option value='${packSpec.id}' cost='${packSpec.unitCost}'
                                                    weight='${packSpec.weight}'>${packSpec.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">含包装重量(g)</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="totalWeight_comb" placeholder="根据组合明细计算，不可修改" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">入库要求</label>
                                <div class="layui-input-block">
                                    <input type="text" name="packDesc" class="layui-input">
                                </div>
                            </div>
                        </div>
                        
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">采购成本价(¥)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="purchaseCostPrice" class="layui-input disAbleInp" placeholder="根据组合明细计算，不可修改" readonly>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">内包装成本(¥)</label>
                                <div class="layui-input-block">
                                    <input type="text" name="innerPackCost" class="layui-input disAbleInp" placeholder="根据组合明细计算，不可修改">
                                    <input type="hidden" name="packWeight" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">包装难度</label>
                                <div class="layui-input-block">
                                    <input type="text" name="packDifficulty" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">默认发货库</label>
                                <div class="layui-input-block">
                                    <select name="defaultDlvrWhId" id="wareHouseTag_comb" lay-search>
                                        <c:forEach items="${wareHouseList}" var="wareHouse">
<%--                                            <option value="${wareHouse.id}">${wareHouse.warehouseName}</option>--%>
                                            <option value="${wareHouse.id}" ${wareHouse.storeType ==1 and wareHouse.isDefault ? 'selected' : ''}>${wareHouse.warehouseName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">销售状态</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="isSale" lay-skin="primary" title="停售" disabled>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label ">库存状态</label>
                                <div class="layui-input-block">
                                    <input type="checkbox" name="isOutOfStock" name="like1[read]" lay-skin="primary"
                                           title="缺货" disabled>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label">外箱长(cm)</label>
                                <div class="layui-input-block">
                                    <input name="outerBoxLength" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label">外箱宽(cm)</label>
                                <div class="layui-input-block">
                                    <input name="outerBoxWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" notNull>
                                <label class="layui-form-label">外箱高(cm)</label>
                                <div class="layui-input-block">
                                    <input name="outerBoxHeight" oninput="countThrowWeight(this)"  class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label">抛重(g)</label>
                                <div class="layui-input-block">
                                    <input name="throwWeight" class="layui-input" placeholder="根据外箱长宽高计算，不可修改" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3" >
                                <label class="layui-form-label">商品长(cm)</label>
                                <div class="layui-input-block">
                                    <input name="productLength" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" >
                                <label class="layui-form-label">商品宽(cm)</label>
                                <div class="layui-input-block">
                                    <input name="productWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3" >
                                <label class="layui-form-label">商品高(cm)</label>
                                <div class="layui-input-block">
                                    <input name="productHeight" oninput="countThrowWeight(this)"  class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">万邑通长(cm)</label>
                                    <div class="layui-input-block">
                                        <input name="winitLength" class="layui-input" >
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">万邑通宽(cm)</label>
                                    <div class="layui-input-block">
                                        <input name="winitWidth" class="layui-input" >
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">万邑通高(cm)</label>
                                    <div class="layui-input-block">
                                        <input name="winitHeight" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">压缩高(cm)</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input name="compressHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-col-md3 layui-col-lg3">--%>
                                <%--<label class="layui-form-label">叠加高(cm)</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<input name="superpositionHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                        </div>
                    </form>
                </div>
                <div class="layui-tab-item p20">
                    <div class="layui-tab layui-tab-brief">
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <table class="layui-table">
                                    <thead>
                                    <tr>
                                        <th>时间</th>
                                        <th>描述人</th>
                                        <th>日志</th>
                                    </tr>
                                    </thead>
                                    <tbody id="pl_combLogTbody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<%--新增海外仓商品弹窗--%>
<script id="productlist_addWinitProdLayer" type="text/html">
    <div class="p20">
    <form class="layui-form" id="productlist_addProdForm" lay-filter="productlist_addProdForm">
        <div class="layui-col-lg8 layui-col-md8">
            <label class="layui-form-label">子sku</label>
            <div class="layui-input-block">
                <input class="layui-input" name="sSkuSearch" placeholder="多个子sku以逗号隔开。精确查询" maxlength="2000">
            </div>
        </div>
        <div class="layui-col-lg8 layui-col-md8">
            <label class="layui-form-label">父sku</label>
            <div class="layui-input-block">
                <input class="layui-input" name="pSkuSearch" placeholder="一次只能输入一个父sku。精确查询" maxlength="50">
            </div>
        </div>
        <div class="layui-col-lg2 layui-col-md2">
            <div class="layui-btn layui-btn-sm" id="winitregist_searchPsku">查询</div>
        </div>
        <input type="hidden" name="prodPId">
        <input type="hidden" name="pSku">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-lg12 layui-col-md12">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <table class="layui-table" id="productlist_prodSInfoTable"  lay-filter="productlist_prodSInfoTable" ></table>
                    </div>
                </div>
                <div>
                    <table class="layui-table winitregist_addProd_compTable">
                        <thead>
                        <tr>
                            <th width="150px">销售渠道<font color="red">*</font></th>
                            <th>链接<font color="red">*</font></th>
                            <th width="150px">操作</th>
                        </tr>
                        </thead>
                        <tbody class="layui-form compTab_addProductLayer" lay-filter="compTab_addProductLayer" style="text-align: center">
                        </tbody>
                    </table>
                    <div class="fr">
                        <div class="layui-btn layui-btn-sm winitregist_addMoreCompBtn">新增链接</div>
                    </div>
                </div>
                <div class="layui-col-lg12 layui-col-md12" notNull>
                    <label class="layui-form-label">推荐理由</label>
                    <div class="layui-input-block">
                        <textarea placeholder="请输入内容" class="layui-textarea" name="recommendReason" maxlength="255"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </form>
    </div>

</script>

<script type="text/html" id="product_addProd_channel">
    <table width="100%">
        {{# for(var i = 0; i < d.suggestAmtInfoList.length; ++i){ }}
        <tr>
            <td>{{ d.suggestAmtInfoList[i].channel }}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="product_addProd_suggestSendAmt">
    <table width="100%">
        {{# for(var i = 0; i < d.suggestAmtInfoList.length; ++i){ }}
        <tr>
            <td><input name="suggestSendAmt" data-prodSId="{{d.suggestAmtInfoList[i].prodSId}}" data-channel="{{d.suggestAmtInfoList[i].channel}}" value="{{ d.suggestAmtInfoList[i].suggestSendAmt }}"></td>
        </tr>
        {{# } }}
    </table>
</script>

<!-- 新增&修改商品父SKU -->

<%-- xtree弹框 --%>
<script type="text/html" id="xtreeAddLayer">
    <form class="layui-form">
        <div id="xtreeAdd1" style="width:100%;padding: 10px 0 25px 5px;box-sizing:border-box;"></div>
    </form>
</script>

<!-- 新增供应商 -->
<script type="text/html" id="addsupplierLayer">
    <div class="p20">
        <form action="" lay-filter="component-form-group" class="layui-form" id="addSuppFrom">
            <div class="layui-form-item">
                <label class="layui-form-label">商品链接</label>
                <div class="layui-input-inline" style="width:415px">
                    <input type="text" class="layui-input" name="1688url" placeholder="请填写1688链接">
                </div>
                <!-- <div id="productList_collectInfo" class="layui-form-mid" style="color: #1714d8;cursor: pointer;">采集信息</div> -->
                <div id="productList_collectInfo" class="layui-btn layui-btn-sm" style="margin-left: 20px">跳转链接</div>
                <div id="productList_copyInfo" class="layui-btn layui-btn-sm">粘贴信息</div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                <label class="layui-form-label"><font color="red">*</font>所属类目</label>
                <div class="layui-input-inline">
                    <button class="layui-btn layui-btn-sm layui-btn-primary" id="xtreeAddBtn" type="button">选择类目</button>
                    <i class="layui-icon layui-icon-delete" onclick="clearCate('xtreeAddDiv','xtreeAddHidden ')" style="cursor:pointer" title="删除产品类目"></i>
                    <input type="hidden" id="xtreeAddHidden" name="supportCateIds">
<%--                    <div id="xtreeAddDiv"></div>--%>
                </div>
                </div>
                <div class="layui-inline" notNull>
                    <label class="layui-form-label">LoginID</label>
                    <div class="layui-input-inline">
                        <input type="text" name="aliLoginId" class="layui-input">
                        <input type="hidden" name="isCollect" class="layui-input" value="false">
                    </div>
                </div>
            </div>
            <div class="layui-form-item" style="padding: 0 20px">
                <div id="xtreeAddDiv"></div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline" notNull>
                    <label class="layui-form-label">名称</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supplier" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">编码</label>
                    <div class="layui-input-inline">
                        <input type="text" name="supplierCode" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline" notNull>
                    <label class="layui-form-label">类型</label>
                    <div class="layui-input-inline">
                        <select name="type" id="supplierTypeTag" lay-search>
                            <option value="1">工厂</option>
                            <option value="2">经销商</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">&nbsp;</label>
                    <div class="layui-input-inline">
                        <input type="checkbox" name="isSupportCust" lay-skin="primary" title="支持定制" id="isSupportCust">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline" notNull>
                    <label class="layui-form-label">供应商来源</label>
                    <div class="layui-input-inline">
                        <select name="serverType" lay-search>
                            <option value=""></option>
                            <option value="1688">1688</option>
                            <option value="淘宝">淘宝</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">货号标记</label>
                    <div class="layui-input-inline">
                        <select name="provideIdentification" lay-search>
                            <option value=""></option>
                            <option value="true">是</option>
                            <option value="false">否</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">物理分割</label>
                    <div class="layui-input-inline">
                        <select name="ifDivision" lay-search>
                            <option value=""></option>
                            <option value="true">是</option>
                            <option value="false">否</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">联系人</label>
                    <div class="layui-input-inline">
                        <input type="text" name="contact" class="layui-input">
                    </div>
                </div>
                
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">电话</label>
                    <div class="layui-input-inline">
                        <input type="text" name="mobile" class="layui-input">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">QQ</label>
                    <div class="layui-input-inline">
                        <input type="text" name="qq" class="layui-input">
                    </div>
                </div>
                
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">邮箱</label>
                    <div class="layui-input-inline">
                        <input type="text" name="email" class="layui-input">
                    </div>
                </div>
                
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">公司账号</label>
                <div class="layui-input-block" style="width:515px">
                    <input type="text" class="layui-input" name="companyAcct">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">公司网址</label>
                <div class="layui-input-block" style="width:515px">
                    <input type="text" class="layui-input" name="companySite">
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">公司地址</label>
                <div class="layui-input-block" style="width:515px">
                    <input type="text" class="layui-input" name="companyAddr">
                </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">发货省份</label>
              <div class="layui-input-block" style="width:515px">
                  <select name="province">
                      <option value=""></option>
                  </select>
              </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">状态</label>
                    <div class="layui-input-inline">
                        <input type="checkbox" name="isCooperate" lay-skin="primary" title="不合作" id="isCooperate">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">原因</label>
                    <div class="layui-input-inline">
                        <select name="uncooperativeReason" id="uncoopReasonTag" lay-search>
                            <option value=""></option>
                            <c:forEach items="${notCoopReasons}" var="reason">
                                <option value="${reason.name}">${reason.name}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">不合作时间</label>
                <div class="layui-input-block" style="width:515px">
                    <input type="text" class="layui-input" placeholder="不合作时显示" name="uncooperativeTime"
                           id="pl_UncoopTime">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block" style="width:515px">
                    <textarea placeholder="请输入内容" class="layui-textarea" name="remark"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="pl_imageTpl">
    <div>
    {{#  if(typeof(d.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.image }}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()" onclick="toSetImg(this)"  title="点击可设置图片"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()" onclick="toSetImg(this)" title="点击可设置图片"/>
    {{# } }}
    <input data-id="{{ d.id }}" type="file" hidden name="skuImg" onchange="ajaxToUpdateImg(this)">
    <div><span class="layui-btn layui-btn-xs searchSupply">查找货源</span></div>
  </div>
</script>
<script type="text/html" id="pl_sSku">
    <div style="text-align: left">
        <span>{{d.sSku}}</span>
        <span style="float: right; position: relative;top: 15px;">
        {{#  if(d.isSpecialMake == '1'){ }}
        <span class="hp-badge layui-bg-red fr" title="定制产品">定</span>
        {{#  } }}
        {{#  if(d.isCombination == '1'){ }}
        <span class="hp-badge layui-bg-blue pointHand fr" title="组合品" lay-event="show_combDetail">组</span>
        {{#  } }}
        {{#  if(d.auditStatus == '1'){ }}
        <span class="hp-badge layui-bg-orange pointHand fr" title="待审核" lay-event="audit_log">待</span>
        {{#  } }}
        {{#  if(d.auditStatus == '3'){ }}
        <span class="hp-badge layui-bg-green pointHand fr" title="审核通过" lay-event="audit_log">通</span>
        {{#  } }}
        {{#  if(d.auditStatus == '4'){ }}
        <span class="hp-badge layui-bg-gray pointHand fr" title="审核失败" lay-event="audit_log" onmouseover="showTip(`{{d.auditDesc || ''}}`, this)" onmouseleave="removeTip(this)">拒</span>
        {{#  } }}
            {{# if (d.parent.devType) {}}
            <span class="hp-badge layui-bg-blue  fr layTitle" lay-title="{{d.parent.devType}}">{{getAliasOfDevType(d.parent.devType)}}</span>
            {{# } }}
        </span>
    </div>
    <div style="text-align: left"><span style="color:grey">父:</span>{{d.parent.pSku}}</div>
    <div style="text-align: left;color:#999;font-size: 12px">
        {{d.parent.prodAttrList}}
    </div>
</script>
<script type="text/html" id="pl_totalCost">
    {{#  if(d.purchaseCostPrice){ }}
    <div style="text-align: left"><span style="color: #999;">采购:</span>{{d.purchaseCostPrice}}</div>
    {{#  } }}
    {{#  if(d.innerPackCost){ }}
    <div style="text-align: left"><span style="color: #999;">包装:</span>{{d.innerPackCost}}</div>
    {{#  } }}
    {{#  if(d.discountPrice){ }}
    <div style="text-align: left"><span style="color: #999;">打折:</span>{{d.discountPrice}}</div>
    {{#  } }}
</script>

<script type="text/html" id="pl_specifications">
    <div style="text-align: left">
        {{# if(d.purchaseChannel){ }}
        <div><span style="color: grey; float: left">简称:</span>{{d.purchaseChannel}}<div style="clear: left"></div></div>
        {{# } }}
        {{# if(d.unit){ }}
        <div><span style="color: grey; float: left">单位:</span>{{d.unit}}<div style="clear: left"></div></div>
        {{# } }}
        {{# if(d.style){ }}
        <div><span style="color: grey; float: left">款式:</span>{{d.style}}<div style="clear: left"></div></div>
        {{# } }}
    </div>
</script>

<script type="text/html" id="pl_title">
    <div style="text-align: left">
    {{#  if(d.isCombination == '1'){ }}
        <a href="javascript:;" style="color:cornflowerblue" lay-event="show_combDetail">{{d.title + (d.packDesc ? ('(' + d.packDesc + ')') : '')}}</a>
    {{#  } else {}}
    <a href="javascript:;" style="color:cornflowerblue" lay-event="show_subDetail">{{d.title + (d.packDesc ? ('(' + d.packDesc + ')') : '')}}</a>
    {{# } }}
    </div>
    <div style="color:#999;">
        <span class="fl">分类:

        {{d.newCate && d.newCate.cateName ? d.newCate.cateName : d.parent.cateName}}

        </span>
        <span class="fr">
            {{#  if(d.logisAttrList!=undefined && d.logisAttrList!=''){ }}
            {{# var logisAttrArr = d.logisAttrList.split(',')}}
            {{# var alia}}
            {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
            {{# alia = getColorOfLogis(logisAttrArr[i])}}
            {{#  if(alia && alia != '普'){ }}
            <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span>
            {{#}}}
            {{#}}}
            {{#  } }}
        </span>
    </div>


</script>
<script type="text/html" id="pl_isSale">
    <input type="checkbox" lay-skin="primary" disabled {{ d.isSale ? 'checked' : '' }}><br>
</script>
<script type="text/html" id="pl_timeTpl">
    <%--{{ layui.admin.Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}<br>--%>
    <div>
        <span style="color:grey">创建:</span>{{ layui.admin.Format( d.createTime, "yyyy-MM-dd")}}
    </div>
    {{#  if(d.auditTime){ }}
    <div>
        <span style="color:grey">审核:</span>{{ layui.admin.Format( d.auditTime, "yyyy-MM-dd")}}
    </div>
    {{#  } }}
</script>
<script type="text/html" id="pl_editBar">
    <a class="layui-btn layui-btn-xs" lay-event="pl_detail">详情</a>
</script>
<!-- 产品类目弹出框 -->
<script type="text/html" id="addPskuCateLayer">
    <div class="p20" id="innerAddPskuCate"></div>
</script>

<script type="text/html" id="pl_WHL">
    <div style="text-align: left">
        <span style="color: grey">长:</span>{{d.outerBoxLength||''}}
    </div>
    <div style="text-align: left">
        <span style="color: grey">宽:</span>{{d.outerBoxWidth||''}}
    </div>
    <div style="text-align: left">
        <span style="color: grey">高:</span>{{d.outerBoxHeight||''}}
    </div>
</script>
<script type="text/html" id="pl_weight">
    <div style="text-align: left">
        <span style="color: grey">净重:</span>{{d.suttleWeight}}
    </div>
    <div style="text-align: left">
        <span style="color: grey">毛重:</span>{{accAdd(d.suttleWeight, (d.packWeight?d.packWeight : 0))}}
    </div>
    <div style="text-align: left">
        <span style="color: grey">抛重:</span>{{d.throwWeight||''}}
    </div>
    <div style="text-align: left">
        <span style="color: grey">液体(ml):</span>{{d.liquidNetContentMl || ''}}
    </div>
</script>
<script type="text/html" id="pl_owner">
    {{#  if(d.parent.bizzOwner){ }}
    <div style="text-align: left"><span style="color:grey">开发:</span><span {{checkIfLeave(d.parent.bizzOwner) ? 'class="fontGainsboro" title="已离职"' : ''}}>{{d.parent.bizzOwner}}</span> </div>
    {{#  } }}
    {{#  if(d.buyer){ }}
    <div style="text-align: left"><span style="color:grey">采购:</span><span {{checkIfLeave(d.buyer) ? 'class="fontGainsboro" title="已离职"' : ''}}>{{d.buyer}}</span> </div>
    {{#  } }}
    {{#  if(d.parent.responsor){ }}
    <div style="text-align: left"><span style="color:grey">责任:</span><span {{checkIfLeave(d.parent.responsor) ? 'class="fontGainsboro" title="已离职"' : ''}}>{{d.parent.responsor}}</span> </div>
    {{#  } }}
</script>
<script type="text/html" id="pl_stock">
    <div>
       {{# if(d.whStockWarning && d.whStockWarning.stockNum != null) {}}
        义乌： {{ (d.whStockWarning.stockNum - d.whStockWarning.reservationNum) + '/' + d.whStockWarning.orderNotInNum + '/' + d.whStockWarning.lackUnPaiNum}}
       {{# } }}
    </div>
    <div>
        {{# if(d.nanNingWhStockWarning && d.nanNingWhStockWarning.stockNum != null) {}}
         南宁： {{ (d.nanNingWhStockWarning.stockNum - d.nanNingWhStockWarning.reservationNum) + '/' + d.nanNingWhStockWarning.orderNotInNum + '/' + d.whStockWarning.lackUnPaiNum}}
        {{# } }}
     </div>
</script>

<script type="text/html" id="audit_desc_productlist">
    <div class="showMultiRow">
        {{# if (d.auditDesc) {}}
        {{d.auditDesc}}
        {{# } }}
    </div>
</script>
<script type="text/html" id="pl_sales_num">
    <div style="text-align: left">
        <div class="canClickEl mb10" onmouseenter=showSaleCountTab(this,`{{JSON.stringify(d.prodPlatSalesCountDtoList)}}`) data-tipId=""
        onmouseleave="removeTip(this,1000)" data-warehouseName="直邮" data-prodSId="{{d.id}}">
            <span style="color: grey">直邮:</span>
            {{d.zhiyouProdWhSalesCount?.sales7 || 0}} / {{ d.zhiyouProdWhSalesCount?.sales15 || 0}} / {{d.zhiyouProdWhSalesCount?.sales30 || 0}}
        </div>
        <div class="canClickEl mb10" onmouseenter=showSaleCountTab(this,`{{JSON.stringify(d.yiwuProdPlatSalesCountDtoList)}}`) data-tipId=""
        onmouseleave="removeTip(this,1000)" data-warehouseName="义乌仓" data-prodSId="{{d.id}}">
            <span style="color: grey">义乌:</span>
            {{d.yiwuProdWhSalesCount?.sales7 || 0}} / {{ d.yiwuProdWhSalesCount?.sales15 || 0}} / {{d.yiwuProdWhSalesCount?.sales30 || 0}}
        </div>
        <div class="canClickEl mb10" onmouseenter=showSaleCountTab(this,`{{JSON.stringify(d.nanNingPlatSalesCountDtoList)}}`) data-tipId=""
        onmouseleave="removeTip(this,1000)" data-warehouseName="自建南宁仓" data-prodSId="{{d.id}}">
            <span style="color: grey">南宁:</span>
            {{d.nanNingProdWhSalesCount?.sales7 || 0}} / {{ d.nanNingProdWhSalesCount?.sales15 || 0}} / {{d.nanNingProdWhSalesCount?.sales30 || 0}}
        </div>

    </div>
</script>
<script type="text/html" id="saleCountPop_productList">
    <div class="layui-card">
        <div class="layui-card-body" style="display: flex;align-items: center">
            <div style="flex: 1;overflow: auto">
                <table class="layui-table" id="saleCountPop_productListTable" lay-filter="saleCountPop_productListTable"></table>
            </div>
            <div class="expandIcon" onclick="expandTable(this)">></div>
        </div>
    </div>
</script>

<script type="text/html" id="countrySaleCountPop_productList">
    <div class="layui-card">
        <div class="layui-card-body" style="display: flex;align-items: center">
            <div style="flex: 1;overflow: auto">
                <table class="layui-table" id="countrySaleCountPop_productListTable" lay-filter="countrySaleCountPop_productListTable"></table>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="pl_pruchase_param">
    <div style="text-align: left">
    <div>
            {{# if (d.stockWarnCycle) { }}
            <span style="color: grey">预警周期:</span>{{d.stockWarnCycle}}
            {{# } }}
        {{# if (d.whStockWarning.ebayStockWarnCycle) { }}
        「<span title="ebay虚拟仓预警周期" class="fRed">{{d.whStockWarning.ebayStockWarnCycle}}</span>」
        {{# } }}
        </div>
        <div>
            {{# if (d.purchaseDlvrDays) { }}
            <span style="color: grey">到货天数:</span>{{d.purchaseDlvrDays}}
            {{# } }}
            {{# if (d.whStockWarning.ebayPurchaseDlvrDays) { }}
            「<span title="ebay虚拟仓到货天数" class="fRed">{{d.whStockWarning.ebayPurchaseDlvrDays}}</span>」
            {{# } }}
        </div>
        <div>
            {{# if (d.prodSupplierCount && d.prodSupplierCount?.avgReceiveDayLastThreeMonth > 0) { }}
            <span style="color: grey">实际到货天数:</span>{{d.prodSupplierCount.avgReceiveDayLastThreeMonth}}
            {{# } }}
        </div>
        <div>
            {{# if (d.prodSupplierCount && d.prodSupplierCount?.prodSupplierCount?.avgReceiveDayLastThreeMonth > 0) { }}
            <span style="color: grey">义乌实到天数:</span>{{d.prodSupplierCount.prodSupplierCount.avgReceiveDayLastThreeMonth}}
            {{# } }}
        </div>
        <div>
            {{# if (d.prodSupplierCount && d.prodSupplierCount?.nanNingProdSupplierCout?.avgReceiveDayLastThreeMonth > 0) { }}
            <span style="color: grey">南宁实到天数:</span>{{d.prodSupplierCount.nanNingProdSupplierCout.avgReceiveDayLastThreeMonth}}
            {{# } }}
        </div>
    </div>
</script>

<script type="text/html" id="pl_purchase_url">

    <div>
        {{# if (d.supplier && d.supplier.length > 0) {}}
            {{# for (var i = 0; i < d.supplier.length; ++i) {}}
                <div>
                    {{# if (d.supplier[i].aliLoginId) {}}
                    <a target="_blank" href="http://amos.alicdn.com/getcid.aw?v=2&uid={{d.supplier[i].aliLoginId}}&site=cnalichn&s=2&groupid=0&charset=utf-8"><img border="0" src="${ctx}/static/img/aliLogo.gif" title="联系卖家" /></a>
                    {{#}}}
                    <a href="{{ d.supplier[i].purchaseUrl }}"  style="color:cornflowerblue" target="_blank">
                        {{ d.supplier[i].supplierName }}
                        {{# if (d.supplier[i].urlType) {}}
                        「{{d.supplier[i].urlType}}」
                        {{# } }}
                    </a>
                    {{# if (d.supplier[i].offerId && d.supplier[i].attrStr) {}}
                    <i class="layui-icon layui-icon-face-smile" style="font-size: 15px; color: cornflowerblue;" title="已经匹配1688信息">&#xe6af;</i>
                    {{#}}}
                </div>

            {{# } }}
        {{# } }}
    </div>
</script>

<script type="text/javascript">
    // 获取物流属性的简称
    function getColorOfLogis(name) {
        var totalLogis = $('#pl_logisAttrList option')
        var alias = ''
        if (!name) {
            return alias
        }
        for (var i = 0; i < totalLogis.length; ++i) {
            if (name == totalLogis[i].value) {
                alias = totalLogis[i].getAttribute('alias')
                alias = alias ? alias : '#999999'
            }
        }
        return alias
    }
</script>
<script>
    var cateArray = new Array();
    <c:forEach items="${secondCateList}" var="secondCate">
    var obj = {};
    obj['name'] = '${secondCate.cateCnName}';
    obj['value'] = ${secondCate.id};
    cateArray.push(obj);
    </c:forEach>
</script>
<!--审核日志弹出框 -->
<script type="text/html" id="pl_auditLogLayer">
    <div style="padding:20px 50px 0 20px">
        <div class="layui-tab-item layui-show">
            <table class="layui-table">
                <thead>
                <tr>
                    <th>时间</th>
                    <th>操作人</th>
                    <th>审核结果</th>
                    <th>备注</th>
                </tr>
                </thead>
                <tbody id="pl_auditLogTbody">
                </tbody>
            </table>
        </div>
    </div>
</script>

<%--批量修改弹窗--%>
<script type="text/html" id="updateList_productlist">

    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="updateListForm_productlist"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">销售状态</label>
                                <div class="layui-input-inline">
                                    <select name="isSale" lay-search>
                                        <option value=""></option>
                                        <option value="false">停售</option>
                                        <option value="true">在售</option>
                                    </select>

                                    <%--<input type="checkbox" name="isSale" lay-skin="primary" title="停售">--%>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">停售原因</label>
                                <div class="layui-input-inline">
                                    <select name="notSaleReason" lay-search>
                                        <option value=""></option>
                                        <c:forEach items="${offSaleReasons}" var="reason">
                                            <option value="${reason.name}">${reason.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">库存状态</label>
                                <div class="layui-input-inline">
                                    <select name="isOutOfStock" lay-search>
                                        <option value=""></option>
                                        <option value="true">缺货</option>
                                        <option value="false">有货</option>
                                    </select>
                                    <%--<input type="checkbox" name="isOutOfStock" lay-skin="primary" title="缺货">--%>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">缺货备注</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="note" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">入库要求</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="packDesc" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">物流属性</label>
                                <div class="layui-input-inline" style="width:700px">
                                    <c:forEach items="${logisAttrList}" var="logisAttr">
                                        <%--<c:if test="${logisAttr.name != '普货'}">--%>
                                            <input type='checkbox' lay-skin='primary' name='logisAttrList' title='${logisAttr.name}' value='${logisAttr.name}'>
                                        <%--</c:if>--%>
                                    </c:forEach>
                                </div>
                                <%--<input type='checkbox' lay-skin='primary' id='ifNullLogisAttrList_productlist'--%>
                                       <%--title='无属性' value='false'>--%>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">液体净含量(ml)</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="layui-input" name="liquidNetContentMl" lay-skin="primary" title="液体净含量(ml)">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg3">
                                <label class="layui-form-label w90">是否带插头</label>
                                <div class="layui-input-inline">
                                    <select name="ifWithPlug" lay-search>
                                        <option value=""></option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <hr class="layui-bg-gray">

                        <div class="layui-form-item">
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">采购员</label>
                                <div class="layui-input-inline" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${buyers}" var="developer">
                                            <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                        </c:forEach>
                                    </div>
                                    <%--<input hidden name="buyerId" hp-select-value>--%>
                                    <input class="layui-input" name="buyer" hp-select-text>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">品牌</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="brand" class="layui-input">
                                </div>
                            </div>
                            <%--<div class="layui-inline">--%>
                                <%--<label class="layui-form-label w90">包装难度</label>--%>
                                <%--<div class="layui-input-inline">--%>
                                    <%--<input type="text" name="packDifficulty" class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">海关编码</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="customsCode" class="layui-input">
                                </div>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">产品简称</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="purchaseChannel" class="layui-input" placeholder="" maxlength="6" onblur="productlist_getCustomCode(this)">
                                </div>
                            </div>
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">单位</label>
                                <div class="layui-input-inline" hp-select>
                                    <div hidden hp-select-data>
                                        <c:forEach items="${unitList}" var="tag">
                                            <li data-value="${tag.name}" hp-select-li>${tag.name}</li>
                                        </c:forEach>
                                    </div>
                                    <%--<input hidden hp-select-value>--%>
                                    <input class="layui-input" name="unit" hp-select-text autocomplete="off"
                                           disableautocomplete>
                                    <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                                </div>
                            </div>
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">款式</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="style" class="layui-input">
                                </div>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">预警周期</label>
                                <div class="layui-input-inline">
                                    <input name="stockWarnCycle" class="layui-input" placeholder="" min="0">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">采购到货天数</label>
                                <div class="layui-input-inline">
                                    <input name="purchaseDlvrDays" class="layui-input" min='0'>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">规格</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="specification" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">包装规格</label>
                                <div class="layui-input-inline">
                                    <select name="packSpecification" lay-filter="packspectag_updatelist" lay-search>
                                        <option value="">请选择</option>
                                        <c:forEach items="${packSpecList}" var="packSpec">
                                            <option value='${packSpec.id}' cost='${packSpec.unitCost}'
                                                    weight='${packSpec.weight}'>${packSpec.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <%--<div class="layui-inline">--%>
                                <%--<label class="layui-form-label w90">内包装成本(¥)</label>--%>
                                <%--<div class="layui-input-inline">--%>
                                    <%--<input type="text" name="innerPackCost" class="layui-input">--%>

                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">商品净重(g)</label>
                                <div class="layui-input-inline">
                                    <input name="suttleWeight" class="layui-input" min="0"
                                           onblur="getTotalWeight('#packspectag option:selected', '#addSSkuForm', '#totalWeight')">
                                    <input type="hidden" name="packWeight" class="layui-input">
                                </div>
                            </div>
                        </div>

                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">型号</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="model" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">最小包装数</label>
                                <div class="layui-input-inline">
                                    <input name="minPackingNums" class="layui-input" min="0">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">样品数量</label>
                                <div class="layui-input-inline">
                                    <input name="sampleNums" class="layui-input" min="0">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">材质</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="material" class="layui-input">
                                </div>
                            </div>
                            <%--<div class="layui-inline">--%>
                                <%--<label class="layui-form-label w90">采购成本(¥)</label>--%>
                                <%--<div class="layui-input-inline">--%>
                                    <%--<input name="purchaseCostPrice" class="layui-input" min='0'>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">是否定制</label>
                                <div class="layui-input-inline">
                                    <select name="isSpecialMake" lay-search>
                                        <option></option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-inline">
                                <label class="layui-form-label w90">抛重(g)</label>
                                <div class="layui-input-inline">
                                    <input name="throwWeight" class="layui-input" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">外箱长(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="outerBoxLength" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">外箱宽(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="outerBoxWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">外箱高(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="outerBoxHeight" oninput="countThrowWeight(this)"  class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">商品长(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="productLength" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">商品宽(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="productWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-inline" notNull>
                                <label class="layui-form-label w90">商品高(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="productHeight" oninput="countThrowWeight(this)"  class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">万邑通长(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="winitLength" class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">万邑通宽(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="winitWidth" class="layui-input" >
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">万邑通高(cm)</label>
                                <div class="layui-input-inline">
                                    <input name="winitHeight" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <%--<div class="layui-form-item">--%>
                            <%--<div class="layui-inline">--%>
                                <%--<label class="layui-form-label w90">压缩高(cm)</label>--%>
                                <%--<div class="layui-input-inline">--%>
                                    <%--<input name="compressHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div class="layui-inline">--%>
                                <%--<label class="layui-form-label w90">叠加高(cm)</label>--%>
                                <%--<div class="layui-input-inline">--%>
                                    <%--<input name="superpositionHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                        <%--</div>--%>

                        <hr class="layui-bg-gray">

                        <div class="layui-form-item">
                            <div class="layui-inline">
                                <label class="layui-form-label w90">采购URL1</label>
                                <div class="layui-input-inline">
                                    <input name="purchaseUrl1" class="layui-input" min='0' placeholder="默认供应商的">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">采购URL2</label>
                                <div class="layui-input-inline">
                                    <input name="purchaseUrl2" class="layui-input" min='0'placeholder="第二供应商的">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">采购URL3</label>
                                <div class="layui-input-inline">
                                    <input name="purchaseUrl3" class="layui-input" min='0'placeholder="第三供应商的">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">采购基数</label>
                                <div class="layui-input-inline">
                                    <input name="purBaseNum" class="layui-input" min='0'placeholder="默认供应商的">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">供应商商品报价</label>
                                <div class="layui-input-inline">
                                    <input name="prodPriceOfDefaultOnline" class="layui-input" min='0'placeholder="默认供应商的" >
                                </div>
                            </div>

                            <div class="layui-inline">
                                <label class="layui-form-label w90">供应商包装</label>
                                <div class="layui-input-inline">
                                    <select name="ifSupplierPackOfDefaultOnline" lay-search>
                                        <option value="">默认供应商的</option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-inline">
                                <label class="layui-form-label w90">供应商包装费用</label>
                                <div class="layui-input-inline">
                                    <input name="packFeeOfDefaultOnline" class="layui-input" min='0'placeholder="默认供应商的">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">仓库包装费用</label>
                                <div class="layui-input-inline">
                                    <input name="stockPackFeeOfDefaultOnline" class="layui-input" min='0'placeholder="默认供应商的">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label w90">下单备注</label>
                                <div class="layui-input-inline">
                                    <input type="text" name="defaultSupplierNote" class="layui-input" placeholder="默认供应商备注">
                                </div>
                            </div>
                        </div>

                        <hr class="layui-bg-gray">

                        <div class="layui-form-item">
                            <div class="fl">
                                <span title="勾选此项，下面变更供应商信息时，会删除原有的供应商信息，仅保留本次修改的供应商信息">
                                <input type="checkbox" name="removeOldSupplier" title="移除原有供应商" lay-skin="primary">
                                </span>
                            </div>
                            <p class="taRight">
                                <button type="button" class="layui-btn layui-btn-sm disN addsupplierBtn_productlist">新增供应商</button>
                            </p>
                            <table class="layui-table supplierRefTab_productlist">
                                <thead>
                                <tr>
                                    <th width="20%">供应商<font color="red">*</font></th>
                                    <th width="20%">采购URL<font color="red">*</font></th>
                                    <th>最小订货量<font color="red">*</font></th>
                                    <th>供应商报价(¥)<font color="red">*</font></th>
                                    <th>货号</th>
                                    <th>采购基数<font color="red">*</font></th>
                                    <th><span>供应商商品报价<font color="red">*</font></span></th>
                                    <th><span>供应商包装</span></th>
                                    <th><span>供应商包装费用(¥)</span></th>
                                    <th><span>仓库包装费(¥)</span></th>
                                    <th>备注</th>
                                    <th>默认</th>
                                    <th width="15%">操作</th>
                                </tr>
                                </thead>
                                <tbody class="layui-form" lay-filter="prodSupplierRef_productlistDetailPop">
                                </tbody>
                            </table>
                            <div class="taRight">
                                <button type="button" class="layui-btn layui-btn-sm layui-btn-normal addOneLine_productlist">
                                    添加一行
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</script>

<script type="text/html" id="productlist_auditListPop">
    <div class="p20">
        <div class="layui-tab">
            <div class="layui-tab-item layui-show">
                <form class="layui-form" action="" lay-filter="auditListForm_productlist" id="auditListForm_productlist" autocomplete="off">
                    <div class="layui-form-item" notNull>
                        <label class="layui-form-label">审核结果</label>
                        <div class="layui-input-block">
                            <select name="auditStatus" lay-search>
                                <option value=""></option>
                                <option value="3">通过</option>
                                <option value="4">失败</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">审核备注</label>
                        <div class="layui-input-block">
                            <textarea name="auditDesc" class="layui-textarea"></textarea>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="productlist_exportSSkuPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_exportySSku_productlist"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="exportSSkuForm_productlist">
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">基本信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" title="子sku" disabled lay-skin="primary" checked></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品名称" title="商品名称" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="是否组合品" title="是否组合品" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品图片" title="商品图片" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="是否在售" title="是否在售" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="停售原因" title="停售原因" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="停售时间" title="停售时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="停售人" title="停售人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="产品简称" title="产品简称" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购成本价" title="采购成本价" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="内包装成本" title="内包装成本" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购员" title="采购员" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="审核状态" title="审核状态" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="审核备注" title="审核备注" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="审核人" title="审核人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="审核时间" title="审核时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="物流属性" title="物流属性" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="品牌" title="品牌" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="款式" title="款式" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="规格" title="规格" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="材质" title="材质" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="型号" title="型号" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="单位" title="单位" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="最小包装数" title="最小包装数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="样品数量" title="样品数量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="滞销下限" title="滞销下限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库存数量" title="库存数量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="是否缺货" title="是否缺货" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库存上限" title="库存上限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库存下限" title="库存下限" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="预警周期" title="预警周期" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="到货天数" title="到货天数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="开发日期" title="开发日期" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品净重" title="商品净重" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="包装重量" title="包装重量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="毛重" title="毛重" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="包装规格" title="包装规格" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="入库要求" title="入库要求" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="外盒长" title="外盒长" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="外盒宽" title="外盒宽" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="外盒高" title="外盒高" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="抛重" title="抛重" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="包装难度" title="包装难度" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="默认仓库" title="默认仓库" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库位" title="库位" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="是否定制" title="是否定制" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="创建时间" title="创建时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="创建人名称" title="创建人名称" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="海关编码" title="海关编码" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品长" title="商品长" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品宽" title="商品宽" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品高" title="商品高" lay-skin="primary"></div>
                        <%--<div class="fieldBox"><input type="checkbox" name="baseField" value="压缩高" title="压缩高" lay-skin="primary"></div>--%>
                        <%--<div class="fieldBox"><input type="checkbox" name="baseField" value="叠加高" title="叠加高" lay-skin="primary"></div>--%>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="是否带插头" title="是否带插头" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="万邑通长" title="万邑通长" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="万邑通宽" title="万邑通宽" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="万邑通高" title="万邑通高" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="液体净含量(ml)" title="液体净含量(ml)" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">库存预警信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="可用库存" title="可用库存" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="在途库存" title="在途库存" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="未派单" title="未派单" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="7日销量" title="7日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="15日销量" title="15日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="30日销量" title="30日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓7日销量" title="ebay虚拟仓7日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓15日销量" title="ebay虚拟仓15日销量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="ebay虚拟仓30日销量" title="ebay虚拟仓30日销量" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">父sku信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="父sku" title="父sku" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="业绩归属人" title="开发专员" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="责任归属人" title="责任人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="开发类型" title="开发类型" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="需要质检" title="需要质检" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="质检要求" title="质检要求" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="商品标签" title="商品标签" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="类目" title="类目" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="独立包装" title="独立包装" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="独立包装备注" title="独立包装备注" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="特殊包装" title="特殊包装" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="特殊包装备注" title="特殊包装备注" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="报关中文" title="报关中文" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="报关英文" title="报关英文" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="pSkuField" value="报关价值$" title="报关价值$" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                        <fieldset class="layui-elem-field layui-field-title site-demo-button">
                            <legend style="font-size:14px">供应商信息</legend>
                        </fieldset>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="供应商名称" title="供应商名称" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="采购Url1" title="采购Url1" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="采购Url2" title="采购Url2" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="采购Url3" title="采购Url3" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="采购Url4" title="采购Url4" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="采购Url5" title="采购Url5" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="最小订货量" title="最小订货量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="供应商商品报价" title="供应商商品报价" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="供应商包装费" title="供应商包装费" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="下单备注" title="下单备注" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="采购基数" title="采购基数" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="货号" title="货号" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="1688属性" title="1688属性" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="offerId" title="offerId" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="supplierField" value="specId" title="specId" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<%--1688商品信息展示列表--%>
<script type="text/html" id="ali1688SkuInfoShowPop">
    <div class="p20 layui-form">
        <div>
          <div lay-filter="batchAliSkuInfoForm" id="aliSkuInfoForm">
            <div id="ali1688SkuInfoBox">
            </div>
          </div>
        </div>
      </div>
</script>

<script type="text/html" id="ali1688SkuInfoList">
    <div style="display: flex" id="mulSpecTips">
        <input type="checkbox" id="ifMulSpec" lay-skin="primary" lay-filter="ifMulSpec">
        <span class="mulSpec"><i class="layui-icon layui-icon-tips"></i>多属性组合下单，供应商包好后发货</span>
    </div>
    <div id="ali1688SkuInfo">
        {{# layui.each(d, function(index, item) { }}
            <div class="skuInfoItem1">
            <div>
                <span class="fontBold">{{ item.attrStr }}</span>
                </div>
                <div style="margin: 5px 0">
                    <span>采购价(￥): <span>{{ item.price }}</span></span>
                    <span style="padding-left: 20px">可售数量: <span>{{ item.amountOnSale }}</span></span>
                </div>
                <div style="text-align:center" class="img-content1">
                    <div style="position: absolute">
                        <div class="skuRadio">
                            <input type="radio" lay-skin="primary" name="skuCheck"
                            attrStr="{{item.attrStr}}" minOrderQuantity="{{item.minOrderQuantity}}"
                            offerId="{{item.offerId}}" specId="{{item.specId}}" articleNo="{{item.articleNo}}">
                        </div>
                        
                        <div style="display: none" class="skuRCheckbox">
                            <input type="checkbox" lay-skin="primary" name="skuCheck"
                            attrStr="{{item.attrStr}}" minOrderQuantity="{{item.minOrderQuantity}}"
                            offerId="{{item.offerId}}" specId="{{item.specId}}" price="{{item.price}}" articleNo="{{item.articleNo}}">
                        </div>
                    </div>
                    <img src="{{item.imgUrl ? (`https://cbu01.alicdn.com/` + item.imgUrl) : (ctx + `/static/img/kong.png`)}}" class="pointHand img_show_hide lazy" onclick="setChooseRadio(this)" />
                </div>
                <div class="purchaseCount" style="display: none">
                    <input type="text" class="countInput layui-input" placeholder="采购基数" oninput="changePurchaseNum(this)" />
                </div>
            </div>
        {{#}) }}
        <div style="width: 16%;"></div>
        <div style="width: 16%;"></div>
        <div style="width: 16%;"></div>
        <div style="width: 16%;"></div>
    </div>
  </script>

<%--1688商品批量匹配--%>
<script type="text/html" id="match1688InfoForListPop">
    <div class="p20">
        <p>Tips:</p>
        <p>1、自动匹配，匹配款式和1688属性完全相等</p>
        <p>2、模糊匹配，匹配款式中包含1688属性所有词汇，不包括分隔符'-'</p>
        <p>3、为了减少匹配1688属性的工作，请尽量填写款式时，使用原1688的描写，多个属性用字符'-'隔开</p>
        <p style="color: red;">4、已经匹配的行(即已经有1688属性的行)，不会被自动匹配和模糊匹配功能影响到,但会被强制自动匹配以自动匹配的规则进行匹配</p>
        <div class="layui-card-header">
            <button type="button" class="layui-btn layui-btn-sm" id="autoMatch_Ali1688Info">自动匹配</button>
            <button type="button" class="layui-btn layui-btn-sm" id="autoMatchByLike_Ali1688Info">模糊匹配</button>
            <button type="button" class="layui-btn layui-btn-sm" id="forceToAutoMatchByLike_Ali1688Info">强制自动匹配</button>
            <div class="fr">
                <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" id="clear1688Info_Ali1688Info">清空匹配信息</button>
            </div>
        </div>
        <div class="layui-card-body">
            <table class="layui-table" id="match1688InfoForListTable" lay-filter="match1688InfoForListTable"></table>
        </div>
    </div>

</script>

<script type="text/html" id="subSkuPop_product">
    <div class="layui-card" id="subSkuPop_product_card">
        <div class="layui-card-body" style="display: flex;align-items: center">
            <div style="flex: 1">
                <table class="layui-table" id="subSkuPop_productTable" lay-filter="subSkuPop_productTable"></table>
            </div>
        </div>
    </div>
    </script>

<script type="text/html" id="ali1688InfoBox">
    <div>
        <input  class="layui-input" attrStr readonly value="{{d.attrStr || ''}}">
        <input  hidden offerId value="{{d.offerId}}">
        <input  hidden specId value="{{d.specId || ''}}">
        <input  hidden articleNo value="{{d.articleNo || ''}}">
    </div>
</script>

<script type="text/html" id="matchAli1688ForListToolBar">
    <div>
        <button type="button" class="layui-btn layui-btn-sm" lay-event="match">匹配</button>
        <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" lay-event="del">暂不匹配</button>
    </div>
</script>
<-- 打印SKU标签弹框 -->
<script type="text/html" id="pl_printLabelData">
    <form id="pl_printLabelDataForm"  class="layui-form" style="padding: 20px;">
        <div class="layui-form-item">
            <button id="pl_printLabelDataSmall" lay-submit lay-filter="pl_printLabelDataFormFilter" type="button" class="layui-btn layui-btn-md layui-btn-normal">打印小标签</button>
            <button id="pl_printLabelDataLarge" lay-submit lay-filter="pl_printLabelDataFormFilter" type="button" class="layui-btn layui-btn-md layui-btn-normal" style="float:right">打印大标签</button>
        </div>
        <div class="layui-form-item">
            <table class="layui-table">
                <thead>
                    <th>商品SKU</th>
                    <th>
                        <span class="printNumberTh-text">打印数量</span>
                        <i class="layui-icon printNumberTh-text" id="pl_editPrintNumberBatchBtn" style="color: #009688;cursor: pointer;">&#xe642;</i>
                        <span class="printNumberTh-edit" style="display:none;">
                            <input id="pl_editPrintNumberBatchInput" class="layui-input">
                        </span>
                    </th>
                    <th>商品名称</th>
                    <th>操作</th>
                </thead>
                <tbody>
                    {{#  layui.each(d, function(index, item){ }}
                    <tr>
                        <td>{{ item.prodSSku }}</td>
                        <td>
                            <input name="printNumber" data-index="{{index}}" lay-verify="printNumber" value="{{ item.printNumber }}" class="layui-input">
                        </td>
                        <td>{{ item.prodName}}</td>
                        <td><a type="button" class="layui-btn layui-btn-xs layui-btn-danger"  id="pl_removeLabelRowData">移除</a></td>
                    </tr>
                    {{#  }); }}
                </tbody>
            </table>
        </div>
    </form>
</script>

<%--批量修改父商品 --%>
<script type="text/html" id="productlist_updateProdPInfoListPop">
    <div class="p20">
        <form class="layui-form" id="productlist_updateProdPInfoListForm" lay-filter="productlist_updateProdPInfoListForm">
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">pSku</label>
                    <div class="layui-input-block" style="height: 300px">
                        <textarea placeholder="多个以英文逗号或换行隔开" name="pSkuListStr" class="layui-textarea" style="height: 280px"></textarea>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12" notNull>
                    <label class="layui-form-label">商品标签</label>
                    <div class="layui-input-block">
                        <div class="fl w300">
                            <input name="opType" type="radio" value="新增单个" title="新增单个" checked>
                            <input name="opType" type="radio" value="删除单个" title="删除单个">
                        </div>
                        <div class="layui-col-md4 layui-col-lg4">
                            <select name="prodAttr" lay-search>
                                <option></option>
                                <c:forEach items="${prodTags}" var="tag">
                                    <option value="${tag.name}">${tag.name}</option>
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="layer_work_prodlist_pl">
    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <input type="text" id="itemCat_input_prodlist" />
                <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
            </div>
        </div>
    </div>
</script>
<style>
    .fieldBox{
        float: left;
        width: 12.5%;
        height: 25px;
    }

    .attrBox{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        float: left;
        width: 33%;
        height: 60px;
    }
    .notOverShow{
        width: 100%;
        height: 25px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        float: left;
    }
    .fontGainsboro{
        color: gainsboro;
    }

</style>

<iframe id="productlist_customCodeIframe" scrolling="yes" class="disN" >
</iframe>

<%--富文本编辑器--%>
<%--<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>--%>
<script type="text/javascript" src="${ctx}/static/request.js"></script>
<script src="${ctx}/static/util/we.js"></script>

<script src="${ctx}/static/UploadImage.js"></script>
<script type="text/javascript" src="${ctx}/static/js/commodity/product/productlist.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js?v=${ver}"></script>
<script type="text/javascript" src="${ctx}/static/js/ireport/print.js?v=${ver}"></script>

<%@ include file="/WEB-INF/view/jsp/commodity/product/addprodpinfo.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/batchCreateProd.jsp" %>
<jsp:include page="/WEB-INF/view/jsp/commodity/template/batchUpdateProd.jsp" />
<%@ include file="/WEB-INF/view/jsp/commodity/template/catePresets.jsp" %>


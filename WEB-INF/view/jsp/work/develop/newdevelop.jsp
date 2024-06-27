<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<link rel="stylesheet" href="${ctx}/static/cropper.css" />
<title>新品开发</title>
<style>
     #compList_editTbody td {
         padding:5px;
         text-align: center
     }
    #newdevelop_detail_fbaProdTbody td{
        padding: 5px;
        text-align: center;
    }
    .lineHeight36{
        line-height: 36px;
        padding-left: 10px;
    }
    #newdevelop_preproduct_fail_reasonId{
        overflow: visible !important;
    }
    .disN_ellipsis {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
    }
    #LAY-iframe-itemCat .layui-col-md3,
    #LAY-iframe-itemCat .layui-col-xs3 {
        width: 24%;
        height: 305px;
        overflow-y: scroll;
        box-sizing: border-box;
        padding: 2px 10px;
        border: 1px solid #ccc;
    }

    #LAY-iframe-itemCat ul li {
        position: relative;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 20px;
    }

    #LAY-iframe-itemCat .layui-col-xs12 ul li {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    #LAY-iframe-itemCat .layui-col-xs3 ul li i {
        position: absolute;
        top: 4px;
        right: 5px;
    }

    #LAY-iframe-itemCat ul li:hover {
        background-color: #f4f6f7;
        color: #438eb9;
    }

    #LAY-iframe-itemCat ul li.cat_active:hover {
        background-color: #6fb3e0;
        color: #fff;
    }

    #LAY-iframe-itemCat input {
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

    #LAY-iframe-itemCat input:focus {
        outline: 0;
        box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }

    #LAY-iframe-itemCat input:focus,
    #LAY-iframe-itemCat input:hover {
        border-color: #57a3f3;
    }

    #preProdEditFrom_cateName {
        padding: 17px 15px;
    }

    .catechoose_Form {
        margin: 15px 0 0;
    }

    .catechoose_Form h3 {
        margin: -15px 25px 15px;
    }

    .preProdEditFrom_cateName {
        margin: 5px 20px;
    }
    .cat_common {
        padding: 3px;
        margin: 3px auto;
        border: 1px solid #f8f8f8;
        box-sizing: border-box;
        font-weight: 700;
        background-color: #f8faff;
        color: #7c9eb2;
        cursor: pointer;
    }

    .cat_active {
        background-color: #6fb3e0;
        color: #fff;
    }
    .calItem .layui-form-label {
        width: 70px;
    }
    .expand {
        color: #438eb9;
        cursor: pointer;
        text-align: center;
    }
</style>


<div class="layui-fluid" id="LAY-work-develop-newdevelop">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body layui-card-body-fixed">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="pd_searchForm">
                        <div class="layui-form-item layui-row">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">新类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="plat_choose_outside_newdevelop">选择分类
                                    </button>
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary catePresetsBtn" data-show="pd_searchForm_cateName">预设分类
                                    </button>
                                    <i id="prod_clearPlat_outside_newdevelop" class="layui-icon layui-icon-delete"
                                       style="cursor: pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="organize" lay-filter="orgs_hp_devPerson_newdevelop" class="orgs_hp_custom" data-id="newDevelop_devPerson">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label labelSel">
                                    <select name="creatorIdType">
                                        <option value="creatorIdStr">开发人员</option>
                                        <option value="prodSInfoCreator">创建人</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <select name="devPersonCreator" lay-filter="users_hp_devPerson_newdevelop" lay-search="" class="users_hp_custom" data-id="newDevelop_devPerson" data-roleList="开发专员">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">初审专员</label>
                                <div class="layui-input-block">
                                    <select name="auditorId" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${auditers}" var="auditer">
                                            <option value="${auditer.id}">${auditer.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <%--<div class="layui-col-md2 layui-col-lg2">--%>
                                <%--<label class="layui-form-label">初审专员</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<select name="searchAudId" lay-search="">--%>
                                        <%--<option value=""></option>--%>
                                        <%--<c:forEach items="${auditers}" var="auditer">--%>
                                            <%--<option value="${auditer.id}">${auditer.userName}</option>--%>
                                        <%--</c:forEach>--%>
                                    <%--</select>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">采购助理</label>
                                <div class="layui-input-block">
                                    <select name="searchPurId" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${purchasers}" var="purchaser">
                                            <option value="${purchaser.id}">${purchaser.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发超时</label>
                                <div class="layui-input-block">
                                    <select name="devOverTime">
                                        <option value=""></option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">自拍图状态</label>
                                <div class="layui-input-block">
                                    <select name="selfPhotoStatus" lay-search="">
                                        <option value=""></option>
                                        <c:forEach items="${selfPhotoStatusEnums}" var="selfPhotoStatusEnum">
                                            <option value="${selfPhotoStatusEnum.code}">${selfPhotoStatusEnum.value}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="typeStr" xm-select="typeStr_newdevelop" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="typeStr_newdevelop">
                                        <option value=""></option>
                                        <c:forEach items="${devTypeEnums}" var="devTypeEnum">
                                            <option value="${devTypeEnum.getCode()}">${devTypeEnum.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label">流程状态</label>
                                <div class="layui-input-block">
                                    <select name="currentStatusStr"  xm-select="currentStatus_newdevelop" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter="currentStatus_newdevelop">
                                        <option value=""></option>
                                        <c:forEach items="${flowStatusEnums}" var="flowStatusEnum">
                                            <option value="${flowStatusEnum.getCode()}">${flowStatusEnum.getName()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg2">
                                <div class="layui-form-label" style="padding: 0 15px">
                                    <select name="searchType" lay-filter="" lay-search="">
                                        <c:forEach items="${searchTypeEnums}" var="searchTypeEnum">
                                            <option value="${searchTypeEnum.getCode()}">${searchTypeEnum.getValue()}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" name="searchValue" placeholder='请输入搜索内容,父SKU查询多个以","分隔'
                                           class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg2">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input type="text" name="createTimeStr" class="layui-input" id="pd_searchTime" placeholder="请选择">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">老板审核</label>
                                <div class="layui-input-block">
                                    <select name="bossAuditStatus" >
                                        <option value=""></option>
                                        <option value="0">待审核</option>
                                        <option value="1">审核成功</option>
                                        <option value="2">审核失败</option>
                                        <option value="3">无需审核</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">主管审核</label>
                                <div class="layui-input-block">
                                    <select name="managerAuditStatus" >
                                        <option value=""></option>
                                        <option value="0">待审核</option>
                                        <option value="1">审核成功</option>
                                        <option value="2">审核失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">发货请求</label>
                                <div class="layui-input-block">
                                    <select name="requireDeliver" >
                                        <option value=""></option>
                                        <option value="false">未提交</option>
                                        <option value="true">已提交</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品库id</label>
                                <div class="layui-input-block">
                                    <input name="prodHotSaleIdListStr" class="layui-input" placeholder="多个用逗号隔开">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序类型</label>
                                <div class="layui-input-block">
                                    <select name="orderByString" lay-filter="" lay-search="">
                                        <option value="dev.create_time desc">创建时间倒序</option>
                                        <option value="dev.create_time asc">创建时间正序</option>
                                        <option value="dev.last_oper_time desc">更新时间倒序</option>
                                        <option value="dev.last_oper_time asc">更新时间正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">有供应商图</label>
                                <div class="layui-input-block">
                                    <select name="hasSupplierImg">
                                        <option value=""></option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">商品标签</label>
                              <div class="layui-input-block">
                                <select
                                    name="prodTagList"
                                    xm-select="newdevelop_prodTagsSearch"
                                    id="newdevelop_prodTagsSearch"
                                    xm-select-search
                                    xm-select-search-type="dl"
                                    xm-select-skin="normal"
                                ></select>
                              </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20" style="float: right;">
                                <button class="layui-btn layui-btn-sm keyHandle" type="button" id="pd_searchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="clearForm">清空</button>
                            </div>
                        </div>
                        <div id="pd_searchForm_cateName"></div>
                        <input type="hidden" name="cateOaId" value="" id="plat_chooseid_inp_outside_newdevelop">
                        <div class="disN">
                            <div id="newdevelop_fbaCountryList">
                                <c:forEach items="${fbaCountryList}" var="country">
                                    <li data-value="${country.code}">${country.country}</li>
                                </c:forEach>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="newdevelopCard">
                <div class="layui-card-header pora" id="newdevelopFixed" style="background:#fff">
                    <permTag:perm funcCode="newdevelop_NewdevelopBtn">
                        <button class="layui-btn layui-btn-sm" id="newdevelop_NewdevelopBtn" type="button">新增新品</button>
                    </permTag:perm>
                    <permTag:perm funcCode="newdevelop_changeDevBtn">
                        <button class="layui-btn layui-btn-sm" id="newdevelop_changeDevBtn" type="button">产品转移</button>
                    </permTag:perm>
                    <permTag:perm funcCode="newdevelop_exportBtn">
                        <button class="layui-btn layui-btn-sm" id="newdevelop_exportBtn" type="button">导出</button>
                    </permTag:perm>
                    <permTag:perm funcCode="newdevelop_searchImageBtn">
                        <button class="layui-btn layui-btn-sm" id="newdevelop_searchImgBtn" type="button">以图搜图</button>
                    </permTag:perm>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="newTable" lay-filter="pd_table_filter"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 更改开发弹出框 -->
<script type="text/html" id="newdevelop_changeDevLayer">
    <div style="padding:20px 50px 0 0">
        <form class="layui-form" id="pd_changeDev">
            <div class="layui-form-item">
                <label class="layui-form-label">开发</label>
                <div class="layui-input-block">
                    <select id="pd_newCreator" lay-search="" lay-verify="required">
                            <option value=""></option>
                            <c:forEach items="${developers_newdevelop}" var="developer">
                                <c:if test="${developer.status}">
                                    <option value="${developer.id}">${developer.userName}</option>
                                </c:if>
                            </c:forEach>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 更改开发弹出框 -->
<script type="text/html" id="newdevelop_exportSelTimeLayer">
    <div style="padding:20px 50px 0 20px">
            <div class="layui-form-item">
                <label class="layui-form-label">导出起止时间</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" id="newdevelop_exportTime" placeholder="请选择">
                </div>
            </div>
    </div>
</script>
<!-- 新增新品弹出框 -->
<!-- 摄影完成弹出框 -->
<script type="text/html" id="newdevelop_PhotographyLayer">
    <div style="padding:20px 50px 0 20px">
        <form class="layui-form" id="pd_photo">
            <div class="layui-form-item">
                <label class="layui-form-label">摄影专员</label>
                <div class="layui-input-block">
                    <select name="personId" lay-search="" lay-verify="required">
                        <option value="">请选择</option>
                        <c:forEach items="${photos}" var="photo">
                            <option value="${photo.id}">${photo.userName}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">父SKU</label>
                <div class="layui-input-block">
                    <textarea name="skus" class="layui-textarea" lay-verify="required"
                              placeholder="多个SKU请换行分隔"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 美工完成弹出框 -->
<script type="text/html" id="newdevelop_artLayer">
    <div style="padding:20px 50px 0 20px">
        <form class="layui-form" id="pd_art">
            <div class="layui-form-item">
                <label class="layui-form-label">美工专员</label>
                <div class="layui-input-block">
                    <select name="personId" lay-search="" lay-verify="required">
                        <option value="">请选择</option>
                        <c:forEach items="${arts}" var="art">
                            <option value="${art.id}">${art.userName}</option>
                        </c:forEach>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">父SKU</label>
                <div class="layui-input-block">
                    <textarea name="skus" class="layui-textarea" lay-verify="required"
                              placeholder="多个SKU请换行分隔"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<!--开发完成弹出框 -->
<script type="text/html" id="finishPurOrDevLayer">
    <div class="p20">
        <form class="layui-form" id="finishPurOrDev">
            <input type="hidden" name="ids" class="layui-input" lay-verify="required">
            <input type="hidden" id="pd_type" class="layui-input" lay-verify="required">
            <div class="layui-form-item">
                <label class="layui-form-label">状态：</label>
                <div class="layui-input-block">
                    <input type="radio" name="success" value="1" title="成功" checked>
                    <input type="radio" name="success" value="0" title="失败">
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="submitPurOrDev" id="submitPurOrDev">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>
<!--采样完成弹出框 -->
<script type="text/html" id="finishPurLayer">
    <div class="p20">
        <form class="layui-form" id="finishPurForm" lay-filter="finishPurForm">
            <div class="layui-form-item">
                <label class="layui-form-label">状态：</label>
                <div class="layui-input-block">
                    <input type="radio" name="success" value="1" title="成功">
                    <input type="radio" name="success" value="0" title="失败">
                </div>
            </div>
        </form>
    </div>
</script>
<%--提交拍图需求--%>
<script type="text/html" id="newdevelop_requirePicture">
    <div class="p20">
        <form class="layui-form" id="newdevelop_requirePictureForm" lay-filter="newdevelop_requirePictureForm">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="fRed">*</span>模版类型：</label>
                <div class="layui-input-block">
                    <select name="tplType">
                        <option value=""></option>
                        <option value="0">直邮</option>
                        <option value="1">亚马逊精品</option>
                        <option value="2">亚马逊精铺</option>
                        <option value="3">亚马逊铺货</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">需求文件夹：</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="pictureRequireDir">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">拍图需求：</label>
                <div class="layui-input-block">
                    <table>
                        <tr>
                            <td>
                                <input type="checkbox" name="ifAll_selfPhoto" lay-filter="ifAll_selfPhoto" lay-skin="primary">
                            </td>
                            <td id="sub_need_box">

                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="cateLayer_newdevelop">
    <div class="layui-form">
        <div style="margin: 10px">
            <span style="width: 60%;float: left;margin-right: 20px">
                <input class="layui-input" id="cateSearchInp_newdevelop" placeholder="类目搜索">
            </span>
            <span class="layui-btn layui-btn-sm" id="searchCateBtn_newdevelop">搜索</span>
        </div>
        <div id="cateXTree_newdevelop"></div>
    </div>
</script>

<script type="text/html" id="xiangqingLayer">
    <div style="padding: 20px 5px 0 0;">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title" id="newdevelop_detail_layer_tab">
                <li class="layui-this">商品详情</li>
                <li>操作日志</li>
                <li id="selfImgLogSwitch" onclick="toGetSelfImgLog()">自拍图</li>
                <li id="showProcessFbaDevBtn">销售进度</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <!-- 新增新品表单 -->
                    <form class="layui-form" id="preProdEditFrom" lay-filter="preProdEditFrom" onsubmit="return false">
                        <input type="hidden" name="id">
                        <!-- 图片 -->
                        <div class="layui-form-item">
                            <div class="layui-col-md7 layui-col-lg7">
                                <div class="layui-form-item">
                                    <div class="layui-col-md8 layui-col-lg8">
                                        <label class="layui-form-label">采集链接</label>
                                        <div class="layui-input-block">
                                            <input class="layui-input" placeholder="支持eBay/速卖通/1688链接" id="newDevUrl" name="newDevUrl">
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4" style="display: flex;">
                                        <input name="aliexpressCateForecast" type="hidden">
                                        <!-- <a class="layui-btn layui-btn-sm" style="margin-left: 5px" disabled id="newDevGetInfomation">采集信息</a> -->
                                        <a class="layui-btn layui-btn-sm" style="margin-left: 5px" id="newDevGet1688Infomation">链接跳转</a>
                                        <div onmouseenter="showTip(`支持1688,ebay,aliexpress,shopee`,this)" onmouseleave="removeTip(this)">
                                            <a class="layui-btn layui-btn-sm" style="margin-left: 5px" id="newDevCopy1688Infomation">信息粘贴
                                                <!-- <i id="syncIcon" class="layui-icon layui-icon-tips"></i> -->
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <!-- 产品类目 -->
                                <div class="layui-form-item">
                                    <div class="layui-col-md12 layui-col-lg12 catechoose_Form">

                                        <label class="layui-form-label"><font color='red'>*</font>新类目</label>
                                        <div class="layui-input-block">
                                            <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                                id="xtreeDetailBtn">选择类目
                                            </button>
                                            <input type="hidden" name="cateId" value="" id="preProdEditFrom_cateId" />
                                            <i class="layui-icon layui-icon-delete"
                                                onclick="clearCate('preProdEditFrom_cateName','preProdEditFrom_cateId')"
                                                style="cursor:pointer" title="删除产品类目"></i>
                                            <span class="layui-btn layui-btn-sm layui-btn-primary" onclick="searchNewProdCate()">
                                                <i class="layui-icon layui-icon-search"></i>
                                            </span>
                                            <span id="preProdEditFrom_cateName"></span>
                                        </div>
                                    </div>

                                </div>
                                <!-- 开发类型 -->
                                <div class="layui-form-item">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label"><font color='red'>*</font>开发类型</label>
                                        <div class="layui-input-block">
                                            <select name="type" lay-verify="required" lay-search="" lay-filter="preProdEditFrom_devtype">
                                                <option value="">请选择</option>
                                                <c:forEach items="${devTypeEnums}" var="devTypeEnum">
                                                    <option value="${devTypeEnum.getCode()}">${devTypeEnum.getName()}</option>
                                                </c:forEach>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                      <label class="layui-form-label">商品标签</label>
                                      <div class="layui-input-block">
                                        <select
                                            name="prodTags"
                                            xm-select="newdevelop_prodTags"
                                            id="newdevelop_prodTags"
                                            xm-select-search
                                            xm-select-search-type="dl"
                                            xm-select-skin="normal"
                                        ></select>
                                      </div>
                                  </div>
                                </div>

                                <!-- 父sku -->
                                <div class="layui-form-item">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">商品父SKU</label>
                                        <div class="layui-input-block">
                                            <input type="hidden" name="prodPId">
                                            <input type="text" name="pSku" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">产品库id</label>
                                        <div class="layui-input-block">
                                            <input name="prodHotSaleId" class="layui-input">
                                        </div>
                                    </div>
                                </div>
                                <!-- 中文名称 -->
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font color='red'>*</font>中文名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="cnName" lay-verify="title" placeholder="请输入中文名"
                                               class="layui-input">
                                    </div>
                                </div>
                                <!-- 英文名称 -->
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font color='red'>*</font>英文名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="enName" lay-verify="required" placeholder="请输入英文名"
                                               class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item" notNull>
                                    <label class="layui-form-label "><font color='red'>*</font>物流属性</label>
                                    <div class="layui-input-block" id="newdevelop_logisticAttr">
                                        <c:forEach items="${logisAttrList}" var="logisAttr">
                                            <input type='checkbox' lay-skin='primary' name='logisticAttr' lay-filter="logisticAttr" title='${logisAttr.name}' value='${logisAttr.name}'>
                                        </c:forEach>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label"><font color='red'>*</font>图片</label>
                                <div class="layui-input-block" id="newdevelop_imageDiv">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevelop_imageEditDiv" id="image_edit0" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                        <div><span class="layui-btn layui-btn-xs searchSupply">查找货源</span></div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevelop_imageEditDiv" id="image_edit1" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                        <div><span class="layui-btn layui-btn-xs searchSupply">查找货源</span></div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevelop_imageEditDiv" id="image_edit2" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                        <div><span class="layui-btn layui-btn-xs searchSupply">查找货源</span></div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevelop_imageEditDiv" id="image_edit3" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                        <div><span class="layui-btn layui-btn-xs searchSupply">查找货源</span></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md7 layui-col-lg7">
                                <div class="layui-form-item calItem">
                                    <label class="layui-form-label">成本(￥)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="cost" class="layui-input" style="width: 120px" oninput="changeTotalValue(this)">
                                    </div>
                                    <label class="layui-form-label">重量(g)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="weight" class="layui-input" style="width: 120px" oninput="changeTotalValue(this)">
                                    </div>
                                    <label class="layui-form-label">产品价值</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="totalValue" class="layui-input" style="width: 120px">
                                    </div>
                                    <label class="layui-form-label">毛利率(%)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="grossProfitRate" id="grossProfitRateInput" class="layui-input" value="15" style="width: 120px">
                                    </div>
                                </div>
                                <div class="layui-form-item calItem">
                                    <label class="layui-form-label">外箱长(cm)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="outerBoxLength" class="layui-input" style="width: 120px">
                                    </div>
                                    <label class="layui-form-label">外箱宽(cm)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="outerBoxWidth" class="layui-input" style="width: 120px">
                                    </div>
                                    <label class="layui-form-label">外箱高(cm)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="outerBoxHeight" class="layui-input" style="width: 120px">
                                    </div>
                                    <a class="layui-btn layui-btn-sm" style="margin-left: 5px" id="newDevCalculate">计算</a>
                                </div>
                                <div id="priceTable">
                                    <table class='layui-table'>
                                        <thead>
                                        <tr>
                                            <th>平台</th>
                                            <th>站点</th>
                                            <th>计费重(g)</th>
                                            <th>毛利率</th>
                                            <th>销售价(当地币种)</th>
                                            <th>销售价($)</th>
                                            <th>竞品价($)</th>
                                            <th>差异(%)</th>
                                            <th>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody id="priceList_Tbody" class="layui-form" lay-filter="priceList_Tbody">
            
                                        </tbody>
                                    </table>
                                    <div class="expand" onclick="expandAll()">展开所有</div>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                
                                <!-- 备注 -->
                                <div class="layui-form-item layui-form-text">
                                    <label class="layui-form-label">开发备注</label>
                                    <div class="layui-input-block">
                                        <textarea name="devNote" placeholder="开发备注" class="layui-textarea" style="height: 100px"></textarea>
                                    </div>
                                </div>
                                <div id="firstAuditNote" class="layui-form-item layui-form-text disN">
                                    <label class="layui-form-label">初审备注</label>
                                    <div class="layui-input-block">
                                        <textarea name="firstAuditNote" placeholder="初审备注" disabled class="layui-textarea disAbleInp" style="height: 100px"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <%-- fba定价--%>
                        <permTag:perm funcCode="newdevelop_fbaProd">
                            <fieldset class="layui-elem-field layui-field-title pointHand" title="点击展开或者收缩" id="newdevelop_fbaProdTitle">
                                <legend style="font-size:14px;font-weight:700">fba定价<span class="secondary">(点击展开或者收缩)</span></legend>
                            </fieldset>
                            <div id="newdevelop_fbaProdContains" class="hidden">
                                <div class="layui-form-item layui-row">
<%--                                    <div class="layui-col-md3 layui-col-lg3">--%>
<%--                                        <label class="layui-form-label">类目</label>--%>
<%--                                        <div class="layui-input-block">--%>
<%--                                            <select name="priceCate" id="newdevelop_priceCate" lay-filter="newdevelop_priceCate" lay-search></select>--%>
<%--                                        </div>--%>
<%--                                    </div>--%>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label"><font color='red'>*</font>物流属性</label>
                                        <div class="layui-input-block">
                                            <select name="priceLogisticsAttr" id="newdevelop_priceLogisticsAttr" lay-filter="newdevelop_priceLogisticsAttr" lay-search>

                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md3 layui-col-lg3">
                                        <label class="layui-form-label"></label>
                                        <div class="layui-input-block">
                                           <div class="layui-btn layui-btn-xs" id="newdevelop_calculateProfitRateForFba">计算毛利率</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="layui-form-item layui-row">
                                    <div class="layui-col-md8 layui-col-lg8">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">总数量</label>
                                            <div class="layui-input-block lineHeight36" id="newdevelop_totalFbaProdDeliverAmount">0</div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">总商品成本￥</label>
                                            <div class="layui-input-block lineHeight36" id="newdevelop_totalFbaProdCost">0</div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">总运费成本￥</label>
                                            <div class="layui-input-block lineHeight36" id="newdevelop_totalFbaFreightFee">0</div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">总成本￥</label>
                                            <div class="layui-input-block lineHeight36" id="newdevelop_totalFbaCost">0</div>
                                        </div>
                                    </div>
                                    <div class="layui-col-md4 layui-col-lg4">
                                        <div class="fr">
                                            <permTag:perm funcCode="newdevelop_saveAndReuqireDeliver">
                                                <div class="layui-btn layui-btn-sm" id="newdevelop_saveAndReuqireDeliver">保存并提交发货需求</div>
                                            </permTag:perm>
                                            <div class="layui-btn layui-btn-sm" id="newdevelop_addOneFbaProd">新增</div>
                                            <div class="layui-btn layui-btn-sm" id="newdevelop_addOneFbaProdByCopy">复制新增</div>
                                        </div>
                                    </div>
                                </div>
                                <table class='layui-table'>
                                    <thead>
                                    <tr>
                                        <th width="10px"></th>
                                        <th width="100px">子sku</th>
                                        <th width="100px"><span class="fRed">*</span>款式名称</th>
                                        <th width="100px">包装方式</th>
                                        <th><span class="fRed">*</span>成本￥</th>
                                        <th><span class="fRed">*</span>重量g</th>
                                        <th><span class="fRed">*</span>发货长cm</th>
                                        <th><span class="fRed">*</span>发货宽cm</th>
                                        <th><span class="fRed">*</span>发货高cm</th>
                                        <th width="40px">发货国家</th>
                                        <th width="100px"><span class="fRed">*</span>佣金分类名称</th>
                                        <th><span class="fRed">*</span>预估定价</th>
                                        <th>派送费</th>
                                        <th>快递单个头程￥</th>
                                        <th><span class="fRed"></span>快递利润率%</th>
                                        <th>空派利润率%</th>
                                        <th>海运利润率%</th>
                                        <th><span class="fRed">*</span>发货数量</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody id="newdevelop_detail_fbaProdTbody" class="layui-form" lay-filter="newdevelop_detail_fbaProdTbody">

                                    </tbody>
                                </table>

                            </div>
                        </permTag:perm>
                        <!-- 表单提交 -->
                        <div class="layui-form-item tRight disN">
                            <div class="layui-input-block">
                                <div class="layui-footer">
                                    <button class="layui-btn" lay-submit="" lay-filter="preProdSubmit_add">立即提交</button>
                                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                                </div>
                            </div>
                        </div>
                    </form>
                    <!-- 竞品数据 -->
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend style="font-size:14px;font-weight:700">竞品数据</legend>
                    </fieldset>
                    <div id="edit_competitionData">
                        <table class='layui-table'>
                            <thead>
                            <tr>
                                <th><span class="fRed">*</span>平台</th>
                                <th><span class="fRed">*</span>站点</th>
                                <th><span class="fRed">*</span>链接</th>
                                <th><span class="fRed">*</span>销量</th>
                                <th>销售额</th>
                                <th><span class="fRed">*</span>价格</th>
                                <th><span class="fRed">*</span>币种</th>
                                <th>是否相似品</th>
                                <%--<th>毛利率</th>--%>
                                <th>评论数</th>
                                <th>评分</th>
                                <th>类目排名</th>
                                <th>上架时间</th>
                                <th>提交人</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody id="compList_editTbody" class="layui-form" lay-filter="compList_editTbody">

                            </tbody>
                        </table>
                        <div class="taRight mb10">
                            <button class="layui-btn layui-btn-sm" id="add_competitionData_edit">新增链接</button>
                        </div>
                    </div>
                </div>
                <div class="layui-tab-item p20">
                    <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
                        <div class="layui-tab-content">
                            <div class="layui-tab-item layui-show">
                                <table class="layui-table">
                                    <thead>
                                    <tr>
                                        <th>时间</th>
                                        <th>描述</th>
                                        <th>操作人</th>
                                    </tr>
                                    </thead>
                                    <tbody id="preprodLogTbody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="layui-tab-item p20">
                    <form class="layui-form" id="newdevelop_pictureRequireAuditForm" lay-filter="newdevelop_pictureRequireAuditForm">
                        <fieldset class="layui-elem-field layui-field-title">
                            <legend style="font-size:14px;font-weight:700">图片需求</legend>
                        </fieldset>
                        <input type="hidden" name="id">
                        <div class="layui-tab layui-tab-brief">
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-md6 layui-col-lg6">
                                    <label class="layui-form-label">需求文件夹</label>
                                    <div class="layui-input-block">
                                        <input class="layui-input" name="pictureRequireDir">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-btn layui-btn-sm ml20" id="updatePictureRequireDirBtn">重新提交图片需求</div>
                                </div>
                            </div>
                            <fieldset class="layui-elem-field layui-field-title">
                                <legend style="font-size:14px;font-weight:700">图片需求审核流程</legend>
                            </fieldset>
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-md6 layui-col-lg6">
                                    <label class="layui-form-label" style="padding: 0;">
                                        <select name="leaderAuditStatus">
                                            <option value="">审核结果</option>
                                            <option value="1">通过</option>
                                            <option value="2">失败</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block">
                                        <input class="layui-input" name="leaderAuditRemark">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-btn layui-btn-sm ml20" id="newdevelop_leaderAuditBtn">开发组长审核</div>
                                </div>
                            </div>
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-md6 layui-col-lg6">
                                    <label class="layui-form-label" style="padding: 0;">
                                        <select name="managerAuditStatus">
                                            <option value="">审核结果</option>
                                            <option value="1">通过</option>
                                            <option value="2">失败</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block">
                                        <input class="layui-input" name="managerAuditRemark">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-btn layui-btn-sm ml20" id="newdevelop_managerAuditBtn">开发主管审核</div>
                                </div>
                            </div>
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-md6 layui-col-lg6">
                                    <label class="layui-form-label" style="padding: 0;">
                                        <select name="artManagerAuditStatus">
                                            <option value="">审核结果</option>
                                            <option value="1">通过</option>
                                            <option value="2">失败</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block">
                                        <input class="layui-input" name="artManagerAuditRemark">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">摄影专员</label>
                                    <div class="layui-input-block">
                                        <select name="photographerId" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${photos}" var="photo">
                                                <option value="${photo.id}">${photo.userName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">摄影难度</label>
                                    <div class="layui-input-block">
                                        <input name="photoDifficulty" class="layui-input">
                                    </div>
                                </div>
                            </div>
                            <div class="layui-form-item layui-row">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">美工专员</label>
                                    <div class="layui-input-block">
                                        <select name="artDesignerId" lay-search>
                                            <option value=""></option>
                                            <c:forEach items="${arts}" var="art">
                                                <option value="${art.id}">${art.userName}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">美工难度</label>
                                    <div class="layui-input-block">
                                        <input name="designerDifficulty" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-btn layui-btn-sm ml20" id="newdevelop_artManagerAuditBtn">美工主管审核</div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend style="font-size:14px;font-weight:700">拍图日志</legend>
                    </fieldset>
                    <div class="layui-tab layui-tab-brief">
                        <input type="hidden" id="ifLoading">
                        <div class="layui-tab-content">
                            <table class="layui-table" id="selfImgTab_newdevelop" lay-filter="selfImgTab_newdevelop"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</script>

<script id="priceTableContainer" type="text/html">
    {{# layui.each(d ||[], function(index, item){ }}
        <tr>
            <td>{{item.platCode || ''}}</td>
            <td>{{item.siteCode || ''}}</td>
            <td name="weight1">{{item.weight }}</td>
            <td>
                <input type="text" style="width: 100px" name="grossProfitRate" class="layui-input" value="{{item.grossProfitRate || ''}}">
            </td>
            <td name="currencyPrice">{{item.currencyPrice || ''}}</td>
            <td name="salePrice">{{item.price || ''}}</td>
            // 竞品价 每个平台不同
            <td>
                <input type="text" style="width: 100px" name="comPrice" class="layui-input" value="{{item.comPrice}}" oninput="changeComPrice(this)">
            </td>
            <td>{{ item.diffVal || ''}}</td>
            <td>
                <button type="button" class="layui-btn layui-btn-xs" onclick="newDevCalculateRow(this)">计算</button>
            </td>
            <td style="display: none" name="priceName">{{ item.priceName }}</td>
            <td style="display: none" name="comPriceName">{{ item.comPriceName }}</td>
            <td style="display: none" name="cost1">{{ item.cost }}</td>
        </tr>
        {{# }); }}

</script>

<!-- 详情弹框页面 -->

<%--站点可选选项--%>
<div>
    <div class="disN" id="salesSite_newdevelop_wish">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_newdevelop_amazon">
        <option value=""></option>
        <c:forEach items="${amazonSiteEnum}" var="site">
            <option value="${site.marketName}">${site.name}</option>
        </c:forEach>
    </div>
    <div class="disN" id="salesSite_newdevelop_lazada">
        <option value=""></option>
        <c:forEach items="${lazadaSiteEnum}" var="site">
            <option value="${site.code}">${site.name}</option>
        </c:forEach>
    </div>
    <div class="disN" id="salesSite_newdevelop_aliexpress">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_newdevelop_joom">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_newdevelop_smt">
        <option value=""></option>
    </div>
    <div class="disN" id="salesSite_newdevelop_ebay">
        <option value=""></option>
        <c:forEach items="${ebaySiteEnum}" var="site">
            <option value="${site.siteId}">${site.cnTitle}</option>
        </c:forEach>
    </div>
    <div class="disN" id="salesSite_newdevelop_shopee">
        <option value=""></option>
        <c:forEach items="${shopeeSiteEnum}" var="site">
            <option value="${site.code}">${site.name}</option>
        </c:forEach>
    </div>
</div>

<script type="text/html" id="tpl_devNote">
  <div class="disN_ellipsis" onmouseover="showTip(`{{untransface(d.devNote) || ''}}`, this)" data-tipId="" onmouseout="removeTip(this)">{{untransface(d.devNote) || ''}}</div>
</script>

<script type="text/html" id="repeat_sku_tpl">
    <div>
        {{d.pSku}}
        <span onclick="layui.admin.onlyCopyTxt('{{d.pSku}}')" style="z-index:200;vertical-align: middle;display: {{d.pSku ? 'inline-block':'none'}}; cursor:pointer">
            <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
        </span>
    </div>
</script>
<script type="text/html" id="status_selfImg_nd">
    {{# if (d.selfStatus == 0) {}}
        <div style="color: orange;">未到货</div>
    {{#}}}
    {{# if (d.selfStatus == 1) {}}
        <div style="color: orange;">摄影未完成</div>
    {{#}}}
    {{# if (d.selfStatus == 2) {}}
        <div style="color: orange;">美工未完成</div>
    {{#}}}
    {{# if (d.selfStatus == 3) {}}
        <div style="color: green;">拍图完成</div>
    {{#}}}
</script>
<script type="text/html" id="needer_selfImg_nd">
    <div>{{d.creator}}</div>
    <div>{{format(new Date(d.createTime), 'yyyy-MM-dd hh:mm:ss')}}</div>
</script>
<script type="text/html" id="receiver_selfImg_nd">
    {{# if(d.receiveTime) { }}
    <div>{{d.receiver}}</div>
    <div>{{format(new Date(d.receiveTime), 'yyyy-MM-dd hh:mm:ss')}}</div>
    {{# } }}
</script>
<script type="text/html" id="photoer_selfImg_nd">
    {{# if(d.photographTime) { }}
    <div>{{d.photographer}}</div>
    <div>{{format(new Date(d.photographTime), 'yyyy-MM-dd hh:mm:ss')}}</div>
    {{# } }}
</script>
<script type="text/html" id="arter_selfImg_nd">
    {{# if(d.artDesignTime) { }}
    <div>{{d.artDesigner}}</div>
    <div>{{format(new Date(d.artDesignTime), 'yyyy-MM-dd hh:mm:ss')}}</div>
    {{# } }}
</script>

<script>
    var reasonArray = [];
    var currencyArray = [];
    <c:forEach items="${auditFailReason}" var="item">
    reasonArray.push("${item.name}");
    </c:forEach>
    <c:forEach items="${currencyEnums}" var="currency">
    currencyArray.push("${currency.name}");
    </c:forEach>
</script>
<script type="text/html" id="pd_editBar">
    <permTag:perm funcCode="newdevelop_newDevDetailBtn">
    <a class="layui-btn layui-btn-xs mb5" lay-event="pd_detail">详情</a><br/>
    </permTag:perm>
    {{# if (d.managerAuditStatus === 2 || d.bossAuditStatus === 2) { }}
        <a class="layui-btn layui-btn-normal layui-btn-xs mb5" lay-event="publishToManager">提交给主管</a><br/>
    {{# } }}
    {{# if(d.currentStatus == 31){ }}
    <a class="layui-btn layui-btn-warm layui-btn-xs mb5" lay-event="addPurchase">补充采样信息</a><br/>
    {{#  } }}
    {{# if(d.currentStatus == 0){ }}
    <a class="layui-btn layui-btn-normal layui-btn-xs mb5" lay-event="publish">发布</a><br/>
    <a class="layui-btn layui-btn-danger layui-btn-xs mb5" lay-event="del">删除</a><br/>
    {{#  } }}
    {{# if(d.currentStatus == 11 && d.firstAuditTime == null){ }}
    <a class="layui-btn layui-btn-danger layui-btn-xs mb5" lay-event="del">删除</a><br/>
    {{#  } }}
    {{# if(d.currentStatus == 12 || d.currentStatus == 22){ }}
    <a class="layui-btn layui-btn-normal layui-btn-xs mb5" lay-event="publish">发布</a><br/>
    {{#  } }}
    {{# if(d.currentStatus == 41){ }}
    <a class="layui-btn layui-btn-xs mb5" lay-event="markSample">已采样</a><br/>
    {{#  } }}
    {{# if(d.currentStatus == 43 || d.currentStatus == 42){ }}
    <a class="layui-btn  layui-btn-xs mb5" lay-event="sampleOK">采样完成</a><br/>
    {{#  } }}
    {{# if(d.currentStatus > 31 && d.selfPhotoStatus == 0){ }}
    <a class="layui-btn layui-btn-xs mb5" lay-event="requirePicture">提交拍图需求</a>
    {{#  } }}
    {{# if(d.currentStatus == 62){ }}
    <a class="layui-btn layui-btn-xs mb5" lay-event="restartDev">继续开发</a>
    {{#  } }}
    {{# if(d.currentStatus < 62){ }}
    <a class="layui-btn layui-btn-danger layui-btn-xs mb5" lay-event="devFail">开发失败</a>
    {{#  } }}
</script>
<script type="text/html" id="pd_imageTpl">
  <div style="overflow:hidden;white-space:nowrap;text-overflow: ellipsis;">
    {{#  if(typeof(d.image) !="undefined"){ }}
    <div>
        {{# if (d.image.indexOf('||') > 0) {}}
        <img width="60" height="60" data-original="${prepIVP}{{ d.image.substring(0,d.image.indexOf('||')) }}!size=60x60" class="img_show_hide b1 lazy"
             data-onerror="layui.admin.img_noFind()">
        {{# }else {}}
        <img width="60" height="60" data-original="${prepIVP}{{ d.image }}!size=60x60" class="img_show_hide b1 lazy"
             data-onerror="layui.admin.img_noFind()">
        {{# } }}
    </div>
    <div><span class="layui-btn layui-btn-xs searchSupply" data-image="${prepIVP}{{ d.image.split('||')[0] }}">查找货源</span></div>
    {{#  } }}

    {{# if (d.currentStatus !=71 && d.devUseTime > 864000){}}
    <span class="devOverTime"></span>
    {{# } }}
    {{# if (d.prodTags){ }}
    <span title="{{d.prodTags}}">{{d.prodTags}}</span>
    {{# } }}
  </div>
</script>
<script type="text/html" id="pd_work_develop_pl">
    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <input type="text" id="itemCat_input"/>
                <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="pd_titleTpl">
    {{ d.cnName }}<br/>
    <span style="color:#999;">分类:</span>
    {{#  if(d.cateId!=undefined){ }}
    {{ d.cateName }}
    {{#  } }}
</script>
<script type="text/html" id="pd_devTypeTpl">
    <c:forEach items="${devTypeEnums}" var="devTypeEnum">
        {{# if(d.type ==${devTypeEnum.getCode()}){ }}
        ${devTypeEnum.getName()}
        {{# } }}
    </c:forEach>
</script>
<script type="text/html" id="pd_currentStatusTpl">
    <div class="alignLeft">
        <div>
            <span class="secondary">流程: </span>
            <c:forEach items="${flowStatusEnums}" var="flowStatusEnum">
                {{# if(d.currentStatus ==${flowStatusEnum.getCode()}){ }}
                {{# if(d.currentStatus == 0){ }}
                <span class="layui-yellow">${flowStatusEnum.getName()}</span>
                {{# } }}
                {{# if(d.currentStatus == 11 || d.currentStatus == 21|| d.currentStatus == 44|| d.currentStatus == 46|| d.currentStatus == 48){ }}
                <span class="layui-orange">${flowStatusEnum.getName()}</span>
                {{# } }}
                {{# if(d.currentStatus == 31 || d.currentStatus == 41 || d.currentStatus == 43){ }}
                <span class="layui-cyan">${flowStatusEnum.getName()}</span>
                {{# } }}
                {{# if(d.currentStatus == 51 || d.currentStatus == 52 || d.currentStatus == 61){ }}
                <span class="layui-skyblue">${flowStatusEnum.getName()}</span>
                {{# } }}
                {{# if(d.currentStatus == 12 || d.currentStatus == 22 || d.currentStatus == 42 || d.currentStatus == 62|| d.currentStatus == 45|| d.currentStatus == 47|| d.currentStatus == 49){ }}
                <span class="layui-gray" >${flowStatusEnum.getName()}</span>
                {{# } }}
                {{# if(d.currentStatus == 71){ }}
                <span class="layui-green">${flowStatusEnum.getName()}</span>
                {{# } }}
                {{# } }}
            </c:forEach>
        </div>
        {{# if ((d.currentStatus == 42 || d.currentStatus == 62|| d.currentStatus == 45|| d.currentStatus == 47|| d.currentStatus == 49 )&& d.devFailType) {}}
        <div style="color: orange; font-size: 10px">{{d.devFailType}}</div>
        {{# }}}
        {{# if ((d.currentStatus == 12 || d.currentStatus == 22 )&& d.failReason) {}}
        <div style="color: orange; font-size: 10px">{{d.failReason}}</div>
        {{# }}}
        <div>
            <span class="secondary">拍图: </span>
            {{# if (d.selfPhotoStatus == 0) {}} 未申请 {{# } }}
            {{# if (d.selfPhotoStatus == 44) {}} 图片待组长审核 {{# } }}
            {{# if (d.selfPhotoStatus == 45) {}} 组长审核图片失败 {{# } }}
            {{# if (d.selfPhotoStatus == 46) {}} 图片待主管审核 {{# } }}
            {{# if (d.selfPhotoStatus == 47) {}} 图片主管审核失败 {{# } }}
            {{# if (d.selfPhotoStatus == 48) {}} 图片待美工主管审核 {{# } }}
            {{# if (d.selfPhotoStatus == 49) {}} 美工主管审核图片失败 {{# } }}
            {{# if (d.selfPhotoStatus == 1 ) { }} 摄影未完成 {{# } }}
            {{# if (d.selfPhotoStatus == 2 ) { }} 美工未完成 {{# } }}
            {{# if (d.selfPhotoStatus == 3 ) { }} 拍图完成 {{# } }}
        </div>
        <div>
            <span class="secondary">主管: </span>
            {{# if (d.managerAuditStatus == 0 ) { }}
            待审核
            {{# } }}
            {{# if (d.managerAuditStatus == 1 ) { }}
            审核通过
            {{# } }}
            {{# if (d.managerAuditStatus == 2 ) { }}
            审核失败
            {{# } }}
        </div>
        <div>
            <span class="secondary">老板: </span>
            {{# if (d.bossAuditStatus == 0 ) { }}
            待审核
            {{# } }}
            {{# if (d.bossAuditStatus == 1 ) { }}
            审核通过
            {{# } }}
            {{# if (d.bossAuditStatus == 2 ) { }}
            审核失败
            {{# } }}
            {{# if (d.bossAuditStatus == 3 ) { }}
            无需审核
            {{# } }}
        </div>
        <div>
            <span class="secondary">发货: </span>
            {{# if (d.requireDeliver == 0 ) { }}
            未提交
            {{# } }}
            {{# if (d.requireDeliver == 1 ) { }}
            已提交
            {{# } }}
        </div>
    </div>
</script>
<script type="text/html" id="pd_timeTpl">
    <span style="color:#999;">创建:</span>{{ layui.admin.Format( d.createTime, "yyyy-MM-dd")}}<br>
    <span style="color:#999;">更新:</span>{{ layui.admin.Format( d.lastOperTime, "yyyy-MM-dd")}}<br>
</script>

<script type="text/html" id="newdevelop_personTpl">
    <div class="alignLeft" >
        <div><span class="secondary">开发: </span>{{d.creator}}</div>
        <div><span class="secondary">初审: </span>{{d.auditor}}</div>
        <div><span class="secondary">主管: </span>{{d.managers || ''}}</div>
    </div>
</script>

<script type="text/html" id="layer_work_newdevelop_pl">
    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <input type="text" id="itemCat_input_newdevelop" />
                <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
            </div>
        </div>
    </div>
</script>

<script src="${ctx}/static/UploadImage.js"></script>
<script src="${ctx}/static/utils.js"></script>
<script src="${ctx}/static/js/work/develop/newdevelop.js"></script>
<script src="${ctx}/static/js/work/develop/enum.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script>var prepIVP = '${prepIVP}';</script>
<script src="${ctx}/static/Cropper.js"></script>
<script src="${ctx}/static/jquery-cropper.js"></script>

<%--请求发货确认弹窗--%>
<script type="text/html" id="newdevelop_requireDeliverConfirmPop">
    <div class="layui-tab layui-tab-card">
        <div id="newdevelop_requireDeliverConfirm_skuDiv">

        </div>
    </div>

    <div class="layui-tab layui-tab-card">
        <div id="newdevelop_auditStatusDiv" class="layui-card">
            <div class="layui-card-body">
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label secondary">组长审核:</label>
                        <div class="layui-input-block lineHeight36" data-name="teamLeaderNote">
                        </div>
                    </div>
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label secondary">主管审核:</label>
                        <div class="layui-input-block lineHeight36" data-name="managerAuditRemark">
                        </div>
                    </div>
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label secondary">老板审核:</label>
                        <div class="layui-input-block lineHeight36" data-name="bossAuditRemark">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="layui-tab layui-tab-card">
        <div class="layui-form-item">
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label secondary">给销售的备注</label>
                <div class="layui-input-block">
                    <textarea class="layui-textarea" id="newdevelop_salesRemark"></textarea>
                </div>
            </div>
        </div>
    </div>
</script>
<!-- 开发失败原因 -->
<script type="text/html" id="newdevelop_preproduct_fail_reason">
<form class="layui-form" action="" style="padding:10px">
    <div class="layui-form-item">
        <label class="layui-form-label">
            <font color="red">*</font>
            失败原因
        </label>
        <div class="layui-input-block">
            <select name="reason_options" id="preproduct_fail_reason_options" >
            </select>
        </div>
    </div>
</form>
</script>

<script type="text/html" id="newdevelop_comp_prover_repeat_tip">
<div class="layui-card">
    <div class="layui-card-body">
        <table class="layui-table" id="newdevelop_comp_prover_repeat_tip_table" lay-filter="newdevelop_comp_prover_repeat_tip_table"></table>
    </div>
</div>
</script>

<%@ include file="/WEB-INF/view/jsp/common/processFbaSalesTable.jsp" %>
<script type="text/javascript" src="${ctx}/static/request.js"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/product/addprodpinfo.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/addSampleInfo.jsp" %>
<%@ include file="/WEB-INF/view/jsp/commodity/template/catePresets.jsp" %>

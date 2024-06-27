<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>侵权品牌</title>

<style>
    .tortbrandDetailDefault {
        text-align:left;
    }
    .tortbrandDetailHidden{
        overflow:hidden;
        max-height:120px;
    }
    .tortbrandDetailShow{
        overflow:inherit;
        max-height:10000px;
    }
    .tortbrand_expand {
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
        box-sizing: border-box;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="tb_SearchForm" class="layui-form">
                        <div class="layui-form-item" style="margin-bottom:0">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" type="button" id="xtreeSearchBtn_tortbrand">选择类目</button>
                                    <i class="layui-icon layui-icon-delete" onclick="clearCate('xtreeSearchDiv_tortbrand','xtreeSearchHidden_tortbrand')" style="cursor:pointer" title="删除产品类目"></i>
                                    <input type="hidden" name="cateIdStr" id="xtreeSearchHidden_tortbrand">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">搜索品牌</label>
                                <div class="layui-input-block">
                                    <input name="brand" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">品牌拥有者</label>
                                <div class="layui-input-block">
                                    <input name="owner" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">检测类型</label>
                                <div class="layui-input-block">
                                    <select name="checkType" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">常规模糊</option>
                                        <option value="2">分词半模糊</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select name="creatorId" lay-search>
                                        <option></option>
                                        <c:forEach items="${creatorList}" var="creator">
                                            <option value="${creator.id}">${creator.userName}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">创建时间</label>
                                <div class="layui-input-block">
                                    <input name="createTime" class="layui-input" id="creatorTime_tortbrand">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">适用平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-filter="plateCode_searchForm" lay-search>
                                        <option></option>
                                        <c:forEach items="${salesPlatList}" var="salesPlat">
                                            <option value="${salesPlat.name}">${salesPlat.name}</option>
                                        </c:forEach>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">适用站点</label>
                                <div class="layui-input-block">
                                    <select name="siteCode" lay-search>
                                        <option value=""></option>
                                    </select>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_wish">
                                        <option value=""></option>
                                    </div>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_amazon">
                                        <option value=""></option>
                                        <c:forEach items="${amazonSiteEnum}" var="site">
                                            <option value="${site.marketName}">${site.name}</option>
                                        </c:forEach>
                                    </div>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_lazada">
                                        <option value=""></option>
                                        <c:forEach items="${lazadaSiteEnum}" var="site">
                                            <option value="${site.code}">${site.name}</option>
                                        </c:forEach>
                                    </div>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_aliexpress">
                                        <option value=""></option>
                                    </div>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_joom">
                                        <option value=""></option>
                                    </div>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_smt">
                                        <option value=""></option>
                                    </div>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_ebay">
                                        <option value=""></option>
                                        <c:forEach items="${ebaySiteEnum}" var="site">
                                            <option value="${site.siteId}">${site.cnTitle}</option>
                                        </c:forEach>
                                    </div>
                                    <div class="disN" id="tortBrand_salesSite_searchForm_shopee">
                                        <option value=""></option>
                                        <c:forEach items="${shopeeSiteEnum}" var="site">
                                            <option value="${site.code}">${site.name}</option>
                                        </c:forEach>
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2 pl20">
                               <button class="layui-btn layui-btn-sm keyHandle" type="button" data-type="reload" id="tb_SearchBtn">搜索</button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="tb_ResetBtn">清空</button>
                            </div>
                        </div>
                        <input name="status" type="hidden" value="1">
                        <input name="ifComplete" type="hidden" value="0">
                        <div id="xtreeSearchDiv_tortbrand"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="tortbrandCard">
                <div class="layui-card-header">
                        <ul class="layui-tab-title fl" style="border-bottom: none;">
                                <li class="layui-this" onclick="queryPage2_tortbrand(1,0)">待完善(<span id="noCompleteNum_tortbrand"></span>)</li>
                                <li class="" onclick="queryPage2_tortbrand(1,1)">需检测(<span id="needCheckNum_tortbrand"></span>)</li>
                                <li onclick="queryPage2_tortbrand(0,'')">已删除(<span id="hadDelNum_tortbrand"></span>)</li>
                            </ul>
                            <div class="fr">
                                <permTag:perm funcCode="importTortBrand_tortBrand" >
                                    <a class="layui-btn layui-btn-sm" href="${ctx}/static/templet/prodTortBrandAddTemplate.xlsx">下载导入模板</a>
                                    <a class="layui-btn layui-btn-sm" onclick="document.getElementById('importFile_tortbrand').click()">导入</a>
                                    <input type="file" hidden id="importFile_tortbrand">
                                </permTag:perm>
                                <permTag:perm funcCode="exportTortBrand_tortBrand" >
                                    <a class="layui-btn layui-btn-sm" id="exportBtn_tortbrand">导出</a>
                                </permTag:perm>
                                <permTag:perm funcCode="add_tortBrand" >
                                    <button id="tb_addBtn" class="layui-btn layui-btn-sm" type="button">添加</button>
                                </permTag:perm>
                            </div>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="tortBrandTable" lay-filter="tortBrandTable"></table>
                    <script type="text/html" id="tb_brandTpl">
                        <input type="text" class="layui-input" style="height:28px"   value="{{ d.brand }}">
                    </script>
                    <script type="text/html" id="checkType_line_tortBrand">
                        {{# if(d.checkType == 1) { }}
                        <div>常规模糊</div>
                        {{# } else if (d.checkType == 2) { }}
                        <div>分词半模糊</div>
                        {{# } }}
                    </script>
                    <script type="text/html" id="tb_createTime">
                        {{ format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}
                    </script>
                    <script type="text/html" id="tortBrandBar">
                        <permTag:perm funcCode="save_tortBrand">
                            <a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>
                        </permTag:perm>
                        <permTag:perm funcCode="del_tortBrand">
                            {{# if(d.status) { }}
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
                            {{# } else if (!d.status) { }}
                            <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="reback">恢复</a>
                            {{# } }}
                        </permTag:perm>
                        <a class="layui-btn layui-btn-xs" lay-event="showLog">日志</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 添加品牌弹出框 -->
<script type="text/html" id="tb_addBrandLayer">
    <div style="padding:20px 50px 0 20px">
        <form class="layui-form" id="addOrEditBrandForm_tortbrand" lay-filter="addOrEditBrandForm_tortbrand">
            <input type="hidden" name="id">
            <div class="layui-form-item">
              <p>标题：New Google cardboard VR BOX II 2.0 Version VR Virtual Reality 3D Glasses</p>
              <p style="font-size: 10px;">常规模糊: 包含整个词组.搜索VR BOX可以搜到标题,搜索BOX VR搜不到</p>
              <p style="font-size: 10px;">分词半模糊:将词组按空格拆开,每个单词前面包含.搜索BOX VR可以搜到.搜索OX VR则搜不到,因为标题里没有OX开头的单词</p>
              <br>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">检测类型</label>
                <div class="layui-input-block">
                    <select name="checkType" lay-search>
                        <option></option>
                        <option value="1">常规模糊</option>
                        <option value="2">分词半模糊</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item" notNull>
                <label class="layui-form-label">品牌拥有者</label>
                <div class="layui-input-block">
                    <input name="owner" class="layui-input"/>
                </div>
            </div>

            <div class="layui-form-item">
                <label class="layui-form-label">适用类目</label>
                <div class="layui-input-block">
                    <%-- <select name="supportCateIds" id="ps_supportCateIds"  xm-select="ps_select_add" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select> --%>
                    <button class="layui-btn layui-btn-sm layui-btn-primary" id="tortbrand_xtreeBtn" type="button">选择类目</button>
                    <i class="layui-icon layui-icon-delete" onclick="clearCate('xtreeDiv','xtreeHidden')" style="cursor:pointer" title="删除产品类目"></i>
                    <input type="hidden" id="xtreeHidden" name="cateIds">
                    <div id="xtreeDiv"></div>
                </div>
            </div>

            <div class="layui-card">
                <div class="layui-card-body" style="border: 1px solid black">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">平台</label>
                            <div class="layui-input-inline">
                                <select name="platCode" lay-filter="plateCode_componentForm" lay-search>
                                    <option></option>
                                    <c:forEach items="${salesPlatList}" var="salesPlat">
                                        <option value="${salesPlat.name}">${salesPlat.name}</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">站点</label>
                            <div class="layui-input-inline">
                                <select name="siteCode"  lay-search>
                                    <option value=""></option>
                                </select>
                                <div class="disN" id="salesSite_componentForm_wish">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_componentForm_amazon">
                                    <option value=""></option>
                                    <c:forEach items="${amazonSiteEnum}" var="site">
                                        <option value="${site.marketName}">${site.name}</option>
                                    </c:forEach>
                                </div>
                                <div class="disN" id="salesSite_componentForm_lazada">
                                    <option value=""></option>
                                    <c:forEach items="${lazadaSiteEnum}" var="site">
                                        <option value="${site.code}">${site.name}</option>
                                    </c:forEach>
                                </div>
                                <div class="disN" id="salesSite_componentForm_aliexpress">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_componentForm_joom">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_componentForm_smt">
                                    <option value=""></option>
                                </div>
                                <div class="disN" id="salesSite_componentForm_ebay">
                                    <option value=""></option>
                                    <c:forEach items="${ebaySiteEnum}" var="site">
                                        <option value="${site.siteId}">${site.cnTitle}</option>
                                    </c:forEach>
                                </div>
                                <div class="disN" id="salesSite_componentForm_shopee">
                                    <option value=""></option>
                                    <c:forEach items="${shopeeSiteEnum}" var="site">
                                        <option value="${site.code}">${site.name}</option>
                                    </c:forEach>
                                </div>
                            </div>
                            <button class="layui-btn layui-btn-sm layui-btn-primary" id="addPlatSite_tortbrand" type="button">增加</button>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">适用平台站点</label>
                        <div id="platSiteDiv_tortbrandForm"></div>
                    </div>
                </div>
            </div>

            <div class="layui-card">
                <div class="layui-card-body" style="border: 1px solid black">
                    <div class="layui-form-item">
                        <div class="layui-inline">
                            <label class="layui-form-label">平台</label>
                            <div class="layui-input-inline">
                                <select name="platCodeUn" lay-filter="plateCode_componentFormUn"  lay-search>
                                    <option></option>
                                    <c:forEach items="${salesPlatList}" var="salesPlat">
                                        <option value="${salesPlat.name}">${salesPlat.name}</option>
                                    </c:forEach>
                                </select>
                            </div>
                        </div>
                        <div class="layui-inline">
                            <label class="layui-form-label">站点</label>
                            <div class="layui-input-inline">
                                <select name="siteCodeUn"  lay-search>
                                    <option value=""></option>
                                </select>
                            </div>
                            <button class="layui-btn layui-btn-sm layui-btn-primary" id="addPlatSite_tortbrandUn" type="button">增加</button>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">不处理平台站点</label>
                        <div id="platSiteDiv_tortbrandFormUn"></div>
                    </div>
                </div>
            </div>

            <div class="layui-form-item" notNull>
                <label class="layui-form-label">侵权品牌</label>
                <div class="layui-input-block">
                    <textarea name="brand" id="tb_tortBrand" class="layui-textarea" lay-verify="required" placeholder="多个品牌请换行分隔" style="height:200px"></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="tb_logListLayer">
    <div style="padding:20px 50px 0 20px">
        <table class="layui-table" id="tortBrand_logTable" lay-filter="tortBrand_logTable">
        </table>
    </div>
</script>

<script type="text/html" id="platSiteTemp_tortBrand">
    <div>
        {{# for(var i = 0; i < d.platSiteList.length; ++i){}}
            {{# if (d.platSiteList[i].requireCheck) {}}
            {{d.platSiteList[i].platCode + (d.platSiteList[i].siteName ? ('_' + d.platSiteList[i].siteName) : '')}}
            {{#}}}
        {{# } }}
    </div>
</script>


<script type="text/html" id="platSiteTemp_tortBrandUn">
    <div>
        {{# for(var i = 0; i < d.platSiteList.length; ++i){}}
            {{# if (!d.platSiteList[i].requireCheck) {}}
            {{d.platSiteList[i].platCode + (d.platSiteList[i].siteName ? ('_' + d.platSiteList[i].siteName) : '')}}
            {{#}}}
        {{# } }}
    </div>
</script>


<script type="text/html" id="tortbrand_cateNames">
  <div class="tortbrandDetailDefault tortbrandDetailHidden">
        <div class="tortbrandDetailDiv">
           {{d.cateNames || '' }}
        </div>
  </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/commodity/prodtort/tortbrand.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<style type="text/css">
    .platSiteBox{
        float: left;
        margin-right: 10px;
    }
</style>
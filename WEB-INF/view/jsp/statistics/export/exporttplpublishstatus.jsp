<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>模板刊登统计</title>
<style>
    /*select2样式*/
    .label_reset{
        padding: 0 10px !important;
    }
    .w_40{
        width: 40% !important;
    }
    .flex_between{
        display: flex;
        justify-content: space-between;
    }
    .pl_10{
        padding-left: 10px !important;
    }
    #LAY_templateStatistics .layui-form-label{
        width: 85px !important;
    }
    #LAY_templateStatistics .layui-input-block{
        margin-left:120px !important;
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
</style>
<div class="layui-fluid" id="LAY_templateStatistics">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form layui-clear" lay-filter="component-form-grup" id="searchForm_exporttplpublishstatus"
                          autocomplete="off">
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="ChooseCate_exporttplpublishstatus">选择分类
                                    </button>
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('cateDiv_exporttplpublishstatus','cateInp-exporttplpublishstatus')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                    <input name="cateId" type="hidden" id="cateInp-exporttplpublishstatus">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">开发专员</label>
                                <div class="layui-input-block" hp-select>
                                   <select name="bizzOwnerId" lay-search>
                                       <option></option>
                                       <c:forEach items="${bizzOwners_export}" var="bizzOwner">
                                           <option value="${bizzOwner.id}">${bizzOwner.userName}</option>
                                       </c:forEach>
                                   </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">审核状态</label>
                                <div class="layui-input-block">
                                    <select name="auditStatus">
                                        <option value="3">审核通过</option>
                                        <option value="0">待发布</option>
                                        <option value="1">待审核</option>
                                        <option value="4">审核失败</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="1">在售</option>
                                        <option value="0">停售</option>
                                        <option value="">全部</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="timeType">
                                        <option value="1">创建时间</option>
                                        <option value="2">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input class="layui-input" autocomplete="off" id="searchTime_exporttplpublishstatus" name="searchTime" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">

                            <div class="layui-col-lg2 layui-col-md2" notNull>
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select name="platCode" lay-search>
                                        <option value="ebay">ebay</option>
                                        <option value="wish">wish</option>
                                        <option value="shopee">shopee</option>
                                        <option value="amazon">amazon</option>
                                        <option value="joom">joom</option>
                                        <option value="aliexpress">aliexpress</option>
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">平台侵权</label>
                                <div class="layui-input-block">
                                    <select name="isTort" lay-search>
                                        <option value=""></option>
                                        <option value="1">侵权</option>
                                        <option value="0">不侵权</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" name="storeAcct">
                                </div>
                            </div>

                            <div class="layui-col-lg2 layui-col-md2" >
                                <label class="layui-form-label labelSel">
                                    <button class="layui-btn layui-btn-sm" type="button" id="export_exporttplpublishstatus" lay-filter="export_exporttplpublishstatus">导出</button>
                                </label>
                                <div class="layui-input-block">
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="reSetBtn_exporttplpublishstatus">清空</button>
                                </div>
                            </div>
                            <div class="layui-col-l12 layui-col-md12" id="cateDiv_exporttplpublishstatus"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>


<script type="text/javascript" src="${ctx}/static/js/statistics/export/exporttplpublishstatus.js"></script>

<script type="text/html" id="fileDownPop_exporttplpublishstatus">
    <div style="text-align: center">
        <div id="downTip" style="margin-top: 20px">文件正在准备中，请稍等...</div>
        <div class="fl" >
            <div style="margin: 30px 200px;" id="toDownFileBtn" class="layui-btn layui-btn-sm disN">下载文件</div>
        </div>
    </div>
</script>

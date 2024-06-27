<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>供应商</title>

<%-- html代码 --%>

<div class="layui-fluid" id="LAY-configuration-purchase-productSupplier">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                        <form action="" class="layui-form" id="productSupplierSearchForm">
                            <div class="layui-inline">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="supplier" placeholder="供应商名称" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="supplierCode" placeholder="供应商编码" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="aliLoginId" placeholder="loginID" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <select name="type">
                                        <option value="">类型</option>
                                        <option value="1">工厂</option>
                                        <option value="2">经销商</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <select name="searchCateId" id="ps_searchCateId">
                                        <option value="">全部</option>
                                        <option value="4246">其它</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline w100">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <select name="isCooperate" >
                                        <option value="">是否合作</option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline layui-form" lay-filter="component-form-element">
                                    <input type="text" name="searchTime" placeholder="创建时间" class="layui-input" id="ps_searchTime">
                                </div>
                            </div>
                            <div class="layui-inline">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-inline layui-form">
                                    <select name="orderBy">
                                        <option value=""></option>
                                        <option value="1" selected>供应商创建时间倒序</option>
                                        <option value="2">在售子SKU数倒序</option>
                                        <option value="3">在售子SKU数正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-inline">
                                <div class="layui-input-inline">
                                    <button class="layui-btn ml20 layui-btn-sm keyHandle" type="button" data-type="reload" id="productSupplierSearch">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                                </div>
                            </div>
                            <div class="layui-inline" style="float:right">
                                <div class="layui-input-inline">
                                    <permTag:perm funcCode="add_productSupplier">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="addProductSupplier">
                                                新增供应商
                                        </button>
                                    </permTag:perm>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
            <div class="layui-card" id="productSupplierPursCard">
                <div class="layui-card-body">
                    <permTag:perm funcCode="productSupplier_updateByExcel">
                        <a style="float:left;" type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="productSupplier_downloadUpdTemplate">
                            修改模版下载
                        </a>
                        <button style="float:left;" type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="productSupplier_updateByExcel">
                            导入修改
                        </button>
                        <input type="file" id="productSupplier_updateFile" hidden>
                    </permTag:perm>
                    <permTag:perm funcCode="export_productSupplier">
                        <button style="float:right;" type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="exportProductSupplier">
                            导出
                        </button>
                    </permTag:perm>
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="prodSupplierTable" lay-filter="prodSupplierTable"></table>
                    <script type="text/html" id="prodSupplierTableBar">
                        <permTag:perm funcCode="edit_prodSupplier">
                            <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a><br/>
                        </permTag:perm>
                        <%--{{#  if(d.isCooperate){ }}--%>
                        <%--<permTag:perm funcCode="stop_prodSupplier">--%>
                            <%--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">停用</a>--%>
                        <%--</permTag:perm>--%>
                        <%--{{# } }}--%>
                    </script>

                    <script type="text/html" id="productSupplierTypeTpl">
                        {{# if(d.type == 1){ }}
                        工厂
                        {{# } else if(d.type == 2) { }}
                        经销商
                        {{# } }}
                    </script>

                    <script type="text/html" id="isSupportCustTpl">
                        {{# if(d.isSupportCust == true){ }}
                        是
                        {{# } else { }}
                        否
                        {{# } }}
                    </script>

                    <script type="text/html" id="isCooperateTpl">
                        {{# if(d.isCooperate == true){ }}
                        合作
                        {{# } else { }}
                        不合作
                        {{# } }}
                    </script>

                    <script type="text/html" id="isNetworkTpl">
                        <a href="{{d.companySite}}"  target="_Blank" class="layui-btn layui-btn-xs">链接</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- template代码 -->
<script type="text/html" id="addSupplierPop">
    <div style="padding: 20px 20px 0 0" id="addProductSupplierLayer">
        <form action="" class="layui-form" id="addProductSupplierForm" lay-filter="addProductSupplierForm">
            <input type="hidden" name="id">
            <div class="layui-form-item">
                <label class="layui-form-label">商品链接</label>
                <div class="layui-input-inline" style="width:415px">
                    <input id="itemUrl" type="text" class="layui-input" name="1688url" placeholder="请填写1688链接">
                </div>
                <!-- <div id="productSupplier_collectInfo" class="layui-form-mid" style="color: #1714d8;cursor:pointer">采集信息</div> -->
                <div id="productSupplier_collectInfo" class="layui-btn layui-btn-sm" style="margin-left: 20px">跳转链接</div>
                <div id="productSupplier_copyInfo" class="layui-btn layui-btn-sm">粘贴信息</div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline" notNull>
                    <label class="layui-form-label">所属类目</label>
                    <div class="layui-input-inline">
                        <%-- <select name="supportCateIds" id="ps_supportCateIds"  xm-select="ps_select_add" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select> --%>
                            <button class="layui-btn layui-btn-sm layui-btn-primary" id="xtreeBtn" type="button">选择类目</button>
                            <i class="layui-icon layui-icon-delete" onclick="clearCate('xtreeDiv','xtreeHidden')" style="cursor:pointer" title="删除产品类目"></i>
                            <input type="hidden" id="xtreeHidden" name="supportCateIds">
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
                <div id="xtreeDiv"></div>
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
                        <select name="type" id="supplier_TypeTag_copy">
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
                        <select name="serverType">
                            <option value=""></option>
                            <option value="1688">1688</option>
                            <option value="淘宝">淘宝</option>
                        </select>
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">货号标记</label>
                    <div class="layui-input-inline">
                        <select name="provideIdentification">
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
                        <select name="ifDivision">
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
                <label class="layui-form-label">服务评分</label>
                <div class="layui-input-block" style="width:200px">
                    <input type="text" class="layui-input" name="score" placeholder="范围0-100整数(不填默认100)">
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
                        <select name="uncooperativeReason" id="ps_uncoopReasonTag">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">不合作时间</label>
                <div class="layui-input-block" style="width:515px">
                    <input type="text" class="layui-input" placeholder="不合作时显示" name="uncooperativeTime"
                        id="supplierUncooperativeTime">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block" style="width:515px">
                    <textarea placeholder="请输入内容" class="layui-textarea" name="remark"></textarea>
                </div>
            </div>
            <div class="layui-form-item disN">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit="" lay-filter="addProductSupplierInfo" id="addProductSupplierInfo">
                        提交
                    </button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="ps_timeTpl">
    {{ layui.admin.Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}<br>
</script>
<%-- 引入的js文件 --%>
<script type="text/javascript" src="${ctx}/static/js/purchases/productSupplier.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
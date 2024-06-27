<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>速卖通刊登规则</title>
            <style>
                .smtRules-line-height {
                    line-height: 32px;
                }
            </style>
            <div class="layui-fluid">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form action="" class="layui-form" id="smtRules_search_form">
                                    <div class="layui-form-item layui-row">
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">规则名称</label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" name="ruleName">
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block">
                                                <select id="smtRules_storeAcctIds" name="storeAcctIds"
                                                    xm-select="smtRules_storeAcctIds" xm-select-search=""
                                                    xm-select-search-type="dl" xm-select-skin="normal">
                                                    <option></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">状态</label>
                                            <div class="layui-input-block">
                                                <select name="status">
                                                    <option value=""></option>
                                                    <option value="true">已开启</option>
                                                    <option value="false">已关闭</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">创建人</label>
                                            <div class="layui-input-block">
                                                <select id="smtRules_creator" name="creatorId" lay-search>
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">刊登方式</label>
                                            <div class="layui-input-block">
                                                <select name="ruleType" lay-search>
                                                    <option value="">请选择</option>
                                                    <option value="1">按店铺刊登</option>
                                                    <option value="2">按模板刊登</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <div class="layui-input-block">
                                                <button id="smtRules_searchBtn" class="layui-btn layui-btn-sm"
                                                    type="button">查询
                                                </button>

                                                <button id="smtRules_resetBtn"
                                                    class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <div class="layui-tab">
                                    <div class="fixTab">
                                        <div>
                                            <permTag:perm funcCode="smtRules_add_rule">
                                                <button class="layui-btn layui-btn-sm" type="button"
                                                    onclick="smtRules_addRule(false)">添加规则</button>
                                            </permTag:perm>
                                        </div>
                                    </div>
                                    <div class="layui-tab-content">
                                        <table id="smtRules_tpl_table" lay-filter="smtRules_tpl_table"
                                            class="layui-table"></table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 状态 -->
            <script id="smtRules_table_status" type="text/html">
                <permTag:perm funcCode="smtRules_list_status_edit">
                    <div class="layui-form-item">
                        <input type="checkbox" lay-skin="switch" class="trCheckbox{{d.id}}"
                            lay-filter="smtRules_changeStatus" value="{{d.id}}" {{d.status?'checked':''}}>
                    </div>
                </permTag:perm>
                <permTag:lacksPerm funcCode="smtRules_list_status_edit">
                    <div class="layui-form-item">
                        <input type="checkbox" lay-skin="switch" class="trCheckbox{{d.id}}" value="{{d.id}}" {{d.status?'checked':''}} disabled>
                    </div>
                </permTag:lacksPerm>
            </script>

            <script type="text/html" id="smtRules_table_storeCount">
                <a lay-event="storeCount" style="color:#1E90FF;cursor:pointer;">{{d.storeNums}}</a>
            </script>

            <!-- 操作项 -->
            <script type="text/html" id="smtRules_toolbar">
                <button class="layui-btn layui-btn-xs" lay-event="update" style="padding: 0 6px;">
                    <i class="layui-icon">&#xe642;</i>
                </button>
                <button class="layui-btn layui-btn-xs layui-btn-danger" style="padding: 0 6px;" lay-event="delete">
                    <i class="layui-icon">&#xe640;</i>
                </button>
                <button class="layui-btn layui-btn-xs" lay-event="log">日志</button>
            </script>

            <!-- 添加规则 -->
            <script type="text/html" id="smtRules_addRules_modal">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form action="" class="layui-form" id="smtRules_addRules_form">
                            <div class="layui-form-item">
                                <label class="layui-form-label"><font style="color: red;">*</font>规则名称</label>
                                <div class="layui-input-block">
                                    <input type="text" name="ruleName"  class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">备注</label>
                                <div class="layui-input-block">
                                    <textarea name="remark"  class="layui-textarea"></textarea>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
                                    <input type="radio" name="status" value="true" title="已启用"  >
                                    <input type="radio" name="status" value="false" title="已停用" >
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label"><font style="color: red;">*</font>刊登日期</label>
                                <div class="layui-input-block smtRules_executionWeekTime_checkbox">
                                    <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="1" title="周一">
                                    <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="2" title="周二">
                                    <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="3" title="周三">
                                    <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="4" title="周四">
                                    <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="5" title="周五">
                                    <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="6" title="周六">
                                    <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="0" title="周日">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">速卖通类目</label>
                                <div class="layui-input-block">
                                    <div class="{{d.autoPublishCateIds == 0 ? 'disN': ''}} lazadaCateTreeIsShow">
                                        <ul id="smtRulesCateTree" class="ztree"></ul>
                                   </div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">开发类型</label>
                                <div class="layui-input-block">
                                    <select name="devType" lay-search id="smtRules_devType">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">商品标签</label>
                                <div class="layui-input-block">
                                    <select name="prodAttrList" lay-search id="smtRules_prodAttrList"
                                    xm-select="smtRules_prodAttrList" xm-select-search=""
                                    xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">物流属性</label>
                                <div class="layui-input-block">
                                    <select name="logisAttrList" lay-search id="smtRules_logisAttrList"
                                    xm-select="smtRules_logisAttrList" xm-select-search=""
                                    xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">商品归属人</label>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdList" lay-search id="smtRules_bizzOwnerIdList"
                                    xm-select="smtRules_bizzOwnerIdList" xm-select-search=""
                                    xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">模板SKU</label>
                                <div class="layui-input-block">
                                    <textarea class="layui-textarea" placeholder="英文逗号分隔"
                                              name="prodPSkuListStr"></textarea>
                                </div>
                            </div>
                            <div class="layui-form-item disFCenter">
                                <div>
                                    <label class="layui-form-label">模板时间审核</label>
                                    <div class="layui-input-block disflex">
                                        <div class="w60">
                                            <input type="number" name="auditDays" class="layui-input" min="0"
                                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            >
                                        </div>
                                        <div class="ml10 smtRules-line-height">天内</div>
                                    </div>
                                </div>
                                <div>
                                    <label class="layui-form-label w120 ">速卖通模板创建时间</label>
                                    <div class="layui-input-block disflex" style="align-items: center;">
                                        <div class="w60">
                                            <input type="number" name="modelCreateMaxDays" class="layui-input" min="0"
                                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            >
                                        </div>
                                        <div class="ml10 smtRules-line-height">天前</div>
                                        <div class="ml5 mr5">~</div>
                                        <div class="w60">
                                            <input type="number" name="modelCreateMinDays" class="layui-input" min="0"
                                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            >
                                        </div>
                                        <div class="ml10 smtRules-line-height">天前</div>
                                    </div> 
                                </div>
                                <div>
                                    <label class="layui-form-label w60">30天销量</label>
                                    <div class="layui-input-block disflex ml60">
                                        <div class="w180 disflex">
                                            <input type="number" name="thirtySalesStart" class="layui-input " min="0"
                                                placeholder="大于等于"
                                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            >
                                            <input type="number" name="thirtySalesEnd" class="layui-input" min="0"
                                                placeholder="小于"
                                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            >
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">预估刊登价($)</label>
                                <div class="layui-input-block disflex">
                                    <input type="number" name="costMin" min="0" class="layui-input" placeholder="大于等于">
                                    <input type="number" name="costMax" min="0" class="layui-input" placeholder="小于等于">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">重量(克)</label>
                                <div class="layui-input-block disflex">
                                    <input type="number" name="weightMin" min="0" class="layui-input" placeholder="大于等于">
                                    <input type="number" name="weightMax" min="0" class="layui-input" placeholder="小于等于">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <div class="layui-form-label labelSel" style="display:flex;width: 270px;">
                                    <select name="expectedStockType" lay-search="">
                                        <option value="expectedStockOnway">预计可用含在途</option>
                                        <option value="expectedStockExway">预计可用不含在途</option>
                                    </select>
                                    <select name="preAvailableAllSku">
                                        <option value="false">部分属性</option>
                                        <option value="true">全部属性</option>
                                    </select>
                                </div>
                                <div class="layui-input-block" style="margin-left: 270px;">
                                    <div class="layui-form-mid layui-word-aux">≥</div>
                                    <input type="number" class="layui-input w150" 
                                    placeholder="≥，请输入整数" name="expectedStockNum" onkeypress="smtRules_inputInt(event)">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">默认条件</label>
                                <div class="layui-input-block">
                                    <div>来源速卖通基础模板，禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，侵权状态=SMT不侵权，图片状态=有图+部分</div>
                                    <div>店铺刊登状态=未刊登，店铺生成状态=未生成</div>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">获取数据顺序</label>
                                <div class="layui-input-block">
                                    <select name="orderField" lay-search>
                                        <option value="1" >审核时间倒序</option>
                                        <option value="2" >审核时间正序</option>
                                        <option value="3" >全平台七天销量倒序</option>
                                        <option value="4" >全平台30天销量倒序</option>
                                        <option value="5" >速卖通七天销量倒序</option>
                                        <option value="6" >速卖通30天销量倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label"><font class="fRed">*</font>刊登方式</label>
                                <div class="layui-input-block smtRules_ruleType_radio">
                                    <input type="radio" name="ruleType" value="1" title="刊登店铺配置数量" lay-filter="smtRules_addRule_ruleType" >
                                    <input type="radio" name="ruleType" value="2" title="刊登模板配置数量" lay-filter="smtRules_addRule_ruleType">
                                </div>
                            </div>
                            <div class="layui-form-item disFCenter" id="smtRules_listingNum">
                                <div>
                                    <label class="layui-form-label"><font class="fRed">*</font>刊登模板数</label>
                                    <div class="layui-input-block w100">
                                        <input type="number" class="layui-input" name="listingTemplateNum" title="刊登店铺配置数量" 
                                            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            min="0"
                                        >
                                    </div>
                                </div>
                                <div>
                                    <label class="layui-form-label w130"><font class="fRed">*</font>每个模板刊登店铺数</label>
                                    <div class="layui-input-block w100 ml160">
                                        <input type="number" class="layui-input" name="listingStoreNum" title="刊登店铺配置数量" 
                                            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                        >
                                    </div>
                                </div>
                                <div>
                                    <label class="layui-form-label">模板在线上限</label>
                                    <div class="layui-input-block w200 disflex">
                                        <div>
                                            <select name="listingMaxNumType">
                                                <option value="1">平台在线上限</option>
                                                <option value="2">规则店铺在线上限</option>
                                            </select>
                                        </div>
                                        <div>
                                            <input type="number" class="layui-input" name="listingMaxNum" title="刊登店铺配置数量" 
                                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>以下配置规则为排除不刊登设置</div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">不刊登SKU</label>
                                <div class="layui-input-block">
                                    <textarea class="layui-textarea" placeholder="英文逗号分隔"
                                        name="notPublishedProdPSkuListStr"
                                    ></textarea>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label" style="padding: 9px 5px; width:100px">不刊登商品标签</label>
                                <div class="layui-input-block">
                                    <select name="notPublishedProdAttrList" lay-search id="smtRules_notPublishedProdAttrList"
                                    xm-select="smtRules_notPublishedProdAttrList" xm-select-search=""
                                    xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </script>

            <!-- 设置店铺 -->
            <script type="text/html" id="smtRules_storeInfo_modal">
                <div class="layui-card">
                    <div class="layui-card-header">
                        <div>刊登规则：{{d.ruleName}}</div>
                        <div id="smtRules_storeInfo_id" class="hidden">{{d.id}}</div>
                    </div>
                    <div class="layui-card-body">
                        <form class="layui-form" id="">
                            <div class="layui-form-item">
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">在线库存</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="stock" class="layui-input" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}" >
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">刊登量</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="dailyPublishNums" class="layui-input" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}" >
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">上架开始时间</label>
                                    <div class="layui-input-block">
                                        <select name="publishTime"> </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">上架间隔时间</label>
                                    <div class="layui-input-block">
                                        <select name="publishInterval"> </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2">
                                    <a class="layui-btn layui-btn-sm layui-btn-normal batchApply" type="button">一键应用</a>
                                </div>
                                <div class="layui-col-md2" style="display:flex;justify-content:right;">
                                    <a class="layui-btn layui-btn-sm layui-btn-normal" type="button" onclick="smtRules_addstore(false)">添加店铺</a>
                                    <a class="layui-btn layui-btn-sm layui-btn-danger batchDel" type="button">批量移除</a>
                                </div>
                            </div>
                        </form>
                        <div class="layui-tab">
                            <div class="fixTab">
                                <ul class="layui-tab-title">
                                    <li data-value="-2" class="layui-this" id="smtRules_storeTotalNum">
                                        总数(<span>0</span>)</li>
                                </ul>
                                <div>
                                    <%--<permTag:perm funcCode="smtRules_add_store">--%>
<%--                                        <button class="layui-btn layui-btn-sm" type="button"--%>
<%--                                            onclick="smtRules_addstore(false)">添加店铺</button>--%>
                                    <%--</permTag:perm>--%>
                                </div>
                            </div>
                            <div class="layui-tab-content">
                                <table id="smtRules_store_table" lay-filter="smtRules_store_table"
                                    class="layui-table"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </script>

            <!-- 添加店铺 -->
            <script type="text/html" id="smtRules_addStores_modal">
                <div class="layui-card">
                    <div class="layui-card-body">
                        <form action="" class="layui-form" id="smtRules_addStore_form">
                            <div class="layui-form-item">
                                <label class="layui-form-label">店铺名</label>
                                <div class="layui-input-block">
                                    <select name="storeAcctId"  xm-select-search
                                    xm-select="smtRules_addStore_store"
                                    id="smtRules_addStore_store"
                                    xm-select-search-type="dl" xm-select-skin="normal">
                                </select>
                                <select name="storeAcctId"  xm-select-search
                                    xm-select="smtRules_editStore_store"
                                    id="smtRules_editStore_store"
                                    xm-select-search-type="dl" xm-select-skin="normal">
                                </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">在线库存</label>
                                <div class="layui-input-block">
                                    <input type="number" name="stock" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">每天刊登量</label>
                                <div class="layui-input-block">
                                    <input type="text" name="dailyPublishNums" min="0" max="500"  class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label"><font class="fRed">*</font>上架开始时间</label>
                                <div class="layui-input-block">
                                    <select name="publishTime">
                                        <option value="" >请选择</option>
                                        <option value="1" >1点</option>
                                        <option value="2"  >2点</option>
                                        <option value="3" >3点</option>
                                        <option value="4" >4点</option>
                                        <option value="5" >5点</option>
                                        <option value="6" >6点</option>
                                        <option value="7" >7点</option>
                                        <option value="8" >8点</option>
                                        <option value="9" >9点</option>
                                        <option value="10" >10点</option>
                                        <option value="11" >11点</option>
                                        <option value="12" >12点</option>
                                        <option value="13" >13点</option>
                                        <option value="14" >14点</option>
                                        <option value="15" >15点</option>
                                        <option value="16" >16点</option>
                                        <option value="17" >17点</option>
                                        <option value="18" >18点</option>
                                        <option value="19" >19点</option>
                                        <option value="20" >20点</option>
                                        <option value="21" >21点</option>
                                        <option value="22" >22点</option>
                                        <option value="23" >23点</option>
                                        <option value="24" >24点</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">上架间隔时间</label>
                                <div class="layui-input-block">
                                   <select name="publishInterval" >
                                       <option value="1">1分钟</option>
                                       <option value="2">2分钟</option>
                                       <option value="3">3分钟</option>
                                       <option value="4">4分钟</option>
                                       <option value="5">5分钟</option>
                                       <option value="10">10分钟</option>
                                       <option value="15">15分钟</option>
                                       <option value="20">20分钟</option>
                                       <option value="25">25分钟</option>
                                       <option value="30">30分钟</option>
                                   </select>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </script>


            <script src="${ctx}/static/js/customer/smtlisting/smtRules.js"></script>
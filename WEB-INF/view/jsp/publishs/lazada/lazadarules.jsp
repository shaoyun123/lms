<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>lazada刊登规则</title>
<style>
    .lazadarules_dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .lazadarules_width45 {
        width: 45%;
    }

    .redStar:before{
        content: "*";
        color: red;
        font-size: 20px;
        position: relative;
        top: 7px;
        right: 10px;
    }
    
    .lazadaRulesSaleSiteHide {
        display: none;
    }

    .lazadarules_batchModify_checkboxCon {
        width:150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis
    }
</style>
<div class="layui-fluid" id="">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="lazadarules_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md4 layui-col-lg3">
                                <label class="layui-form-label">规则名称</label>
                                <div class="layui-input-block" style="display: flex;">
                                    <input class="layui-input" name="ruleName" placeholder="请输入规则名称">
                                    <select name="concat">
                                        <option value=""></option>
                                        <option value="true" selected>包含</option>
                                        <option value="false">不包含</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg3">
                                <label class="layui-form-label">规则ID</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="ruleIdList" placeholder="英文逗号隔开多个规则id，限制1000个" onblur="commChangeInputVal(this.value, event)">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="storeAcctIds" name="storeAcctIds" xm-select="storeAcctIds"
                                            xm-select-search="" xm-select-search-type="dl" xm-select-skin="normal">
                                        <option></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
                                    <select id="status" name="status">
                                        <option value=""></option>
                                        <option value="1" selected>已开启</option>
                                        <option value="0">已关闭</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select id="creatorIds" name="creatorIds" lay-search>
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">刊登方式</label>
                                <div class="layui-input-block">
                                    <select name="ruleType">
                                        <option value=""></option>
                                        <option value="1">按店铺刊登</option>
                                        <option value="2">按模板刊登</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="saleSite">
                                        <option value=""></option>
                                        <option value="SG">新加坡</option>
                                        <option value="MY">马来西亚</option>
                                        <option value="ID">印尼</option>
                                        <option value="TH">泰国</option>
                                        <option value="PH">菲律宾</option>
                                        <option value="VN">越南</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <div class="layui-input-block">
                                    <button id="lazadarules_searchBtn" class="layui-btn layui-btn-sm" type="button">查询
                                    </button>

                                    <button id="lazadarules_resetBtn" class="layui-btn layui-btn-primary layui-btn-sm"
                                            type="reset">清空
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="lazadarules_dis_flex">
                    <div>
                    <permTag:perm funcCode="lazada_rules_list_edit">
                    <a class="layui-btn layui-btn-sm" id="lazadarules_btn_addrules">添加规则</a>
                    </permTag:perm>
                    <a class="layui-btn layui-btn-sm" id="lazadarules_btn_batchModify">批量修改</a></div>
                        <form class="layui-form lazadarules_dis_flex">
                            <select lay-filter="lazada_rules_patch">
                                <option value="" data-title="">批量操作</option>
                                <permTag:perm funcCode="lazada_rules_on"><option value="1">批量开启</option></permTag:perm>
                                <permTag:perm funcCode="lazada_rules_off"><option value="2">批量关闭</option></permTag:perm>
                            </select>
                            <permTag:perm funcCode="lazada_rules_export"><a class="layui-btn layui-btn-sm" target="_blank" href="/lms/static/templet/lazadaAutoListingRuleStoreEditTemplate.xlsx">下载模板</a></permTag:perm>
                            <permTag:perm funcCode="lazada_rules_import"><a class="layui-btn layui-btn-sm" id="lazadarules_btn_import">导入修改</a></permTag:perm>
                        </form>
                    </div>
                    <table class="layui-table" id="lazadarules_table_addrules"
                           lay-filter="lazadarules_table_addrules"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<%--<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>--%>
<script type="text/javascript" src="${ctx}/static/js/publishs/lazada/lazadarules.js"></script>
<%--添加规则弹框--%>
<script type="text/html" id="lazadarules_layer_batchModify">
    <div style="display:flex;">
        <div style="border-right:1px solid #ccc;padding:10px;">
            <p>请点击选中要修改的字段，仅非必填项支持修改为空</p>
            <h2 style="color:#000;margin: 10px 0;">校验条件</h2>
            <form class="layui-form checkForm" style="display: flex; width: 300px; flex-wrap: wrap;">
            </form>
            <h2 style="color:#000;margin: 10px 0;">过滤条件</h2>
            <form class="layui-form filterForm">
                <input type="checkbox" lay-skin="primary" title="不刊登商品标签" value="unProdAttrList" lay-filter="lazadarules_layer_batchModify_checkbox" name="lazadarules_layer_batchModify_checkbox">
            </form>
        </div>
        <div class="layui-card" style="height:500px;overflow-y:scroll">
            <div class="layui-card-body">
                <form class="layui-form" lay-filter="_lazadarules_form_batchModify" id="_lazadarules_form_batchModify">
                    <div class="layui-form-item remark">
                        <div class="layui-col-md6">
                            <label class="layui-form-label">备注</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="remark">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item status">
                        <div class="layui-col-md6">
                            <label class="layui-form-label redStar">状态</label>
                            <div class="layui-input-block">
                                <input type="radio" name="status" value="true" title="已启用" checked>
                                <input type="radio" name="status" value="false" title="已停用">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item executionWeekTime">
                        <div class="layui-col-md12 layui-col-lg12">
                            <label class="layui-form-label redStar">刊登日期</label>
                            <div class="layui-input-block lazadarules_executionWeekTime_checkbox">
                                <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="1" title="周一">
                                <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="2" title="周二">
                                <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="3" title="周三">
                                <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="4" title="周四">
                                <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="5" title="周五">
                                <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="6" title="周六">
                                <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="0" title="周日">
                            </div>
                        </div>
                    </div>
<%--                    <div class="layui-form-item">--%>
<%--                        <div class="layui-col-md6 globalListing">--%>
<%--                            <label class="layui-form-label redStar">刊登类型</label>--%>
<%--                            <div class="layui-input-block">--%>
<%--                                <select name="globalListing" lay-verify="required" lay-filter="lazadarulesGlobalListing">--%>
<%--                                    <option value="false">单站点刊登</option>--%>
<%--                                    <option value="true">GSP刊登</option>--%>
<%--                                </select>--%>
<%--                            </div>--%>
<%--                        </div>--%>
<%--                        <div class="layui-col-md6 saleSite">--%>
<%--                            <label class="layui-form-label redStar">Lazada站点</label>--%>
<%--                            <div class="layui-input-block ">--%>
<%--                                <select id="saleSite" name="saleSite" lay-filter="lazadarules_saleSite">--%>
<%--                                    <option></option>--%>
<%--                                </select>--%>
<%--                            </div>--%>
<%--                        </div>--%>
<%--                    </div>--%>
<%--                    <div class="layui-form-item lazadaRulesSaleSiteHide">--%>
<%--                        <div class="layui-col-md12 layui-col-lg12">--%>
<%--                            <label class="layui-form-label redStar">刊登站点</label>--%>
<%--                            <div class="layui-input-block" id="lazadaRulesSaleSite">--%>

<%--                            </div>--%>
<%--                        </div>--%>
<%--                    </div>--%>
<%--                    <div class="layui-form-item lazadarulesCateTreeRadioChecked">--%>
<%--                        <div class="layui-col-md12 layui-col-lg12">--%>
<%--                            <label class="layui-form-label redStar">站点类目</label>--%>
<%--                            <div class="layui-input-block">--%>
<%--                                <input type="radio" title="全部类目" name="lazadarulesCateTreeRadioChecked" lay-filter="lazadaCateTreeAllChecked" value="0">--%>
<%--                                <input type="radio" title="指定类目" name="lazadarulesCateTreeRadioChecked" lay-filter="lazadaCateTreeAllChecked" value="1" checked>--%>
<%--                                    <div class="lazadaCateTreeIsShow">--%>
<%--                                        <ul id="lazadarulesCateTree" class="ztree"></ul>--%>
<%--                                    </div>--%>
<%--                            </div>--%>
<%--                        </div>--%>
<%--                    </div>--%>
                    <div class="layui-col-md12 layui-col-lg12 devType">
                        <label class="layui-form-label">开发类型</label>
                        <div class="layui-input-block">
                            <%--<input class="layui-input" name="devType">--%>
                            <select name="devType" id="devType" xm-select="devType" xm-select-search xm-select-search-type="dl"
                                    xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md12 layui-col-lg12 prodAttrList">
                        <label class="layui-form-label">商品标签</label>
                        <div class="layui-input-block">
                            <select name="prodAttrList" id="prodAttrList" xm-select="prodAttrList" xm-select-search xm-select-search-type="dl"
                                    xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md12 layui-col-lg12 logisAttrList">
                        <label class="layui-form-label">物流属性</label>
                        <div class="layui-input-block">
                            <select name="logisAttrList" id="logisAttrList" xm-select="logisAttrList" xm-select-search xm-select-search-type="dl"
                                    xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md12 layui-col-lg12 bizzOwnerList">
                        <label class="layui-form-label">商品归属人</label>
                        <div class="layui-input-block">
                            <input class="layui-input" id="bizzOwnerList" name="bizzOwnerList" placeholder="英文逗号分隔"
                                   onblur="handleSku(this.value,event)">
                        </div>
                    </div>
                    <div class="layui-col-md12 layui-col-lg12 modelPSku">
                        <label class="layui-form-label">模板SKU</label>
                        <div class="layui-input-block">
                            <textarea class="layui-textarea" placeholder="英文逗号分隔"
                                      name="modelPSku"></textarea>
                        </div>
                    </div>
                    <div class="layui-form-item moduleType">
                        <div class="layui-col-md6">
                            <label class="layui-form-label redStar">lazada模板类型</label>
                            <div class="layui-input-block">
                                <select name="moduleType">
                                    <option value="2">全部</option>
                                    <option value="1">组合模板</option>
                                    <option value="0" selected>非组合模板</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item ">
                        <div class="layui-col-md6 createDays">
                            <label class="layui-form-label">lazada模板创建时间</label>
                            <div class="layui-input-block lazadarules_dis_flex">
                                <input class="layui-input" name="createDays" type="number" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}" min="0">
                                <div style="width:130%;margin-top: 5px;">天内</div>
                            </div>
                        </div>
                        <div class="layui-col-md6 thirtySalesStart">
                            <label class="layui-form-label">30天销量</label>
                            <div class="layui-input-block lazadarules_dis_flex">
                                <input class="layui-input lazadarules_width45" placeholder="大于等于" name="thirtySalesStart" type="number" min="0"
                                       onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                <input class="layui-input lazadarules_width45" placeholder="小于" name="thirtySalesEnd" type="number" min="0"
                                       onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-md6 costMin">
                            <label class="layui-form-label">成本(RMB)</label>
                            <div class="layui-input-block lazadarules_dis_flex">
                                <input class="layui-input lazadarules_width45" placeholder="大于等于" name="costMin" type="number" min="0"
                                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                <input class="layui-input lazadarules_width45" placeholder="小于等于" name="costMax" type="number" min="0"
                                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                            </div>
                        </div>
                        <div class="layui-col-md6 weightMin">
                            <label class="layui-form-label">重量(克)</label>
                            <div class="layui-input-block lazadarules_dis_flex">
                                <input class="layui-input lazadarules_width45" placeholder="大于等于" name="weightMin" type="number" min="0"
                                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                                <input class="layui-input lazadarules_width45" placeholder="小于等于" name="weightMax" type="number" min="0"
                                       onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item preAvailableStockType">
                        <div class="layui-col-md12">
                            <div class="layui-form-label labelSel" style="width: 200px;">
                                <select name="preAvailableStockType">
                                    <option value="1">预计可用库存含在途大于</option>
                                    <option value="2">预计可用库存不含在途大于</option>
                                </select>
                            </div>
                            <div class="layui-input-block" style="margin-left: 230px;">
                                <input type="number" class="layui-input" placeholder="预计可用库存数" name="preAvailableStockNum" onkeyup="if(this.value && ! /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(this.value)){alert('只能输入整数');this.value='';}">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item listingMin">
                        <div class="layui-col-md6">
                            <div class="layui-form-label">刊登量</div>
                            <div class="layui-input-block lazadarules_dis_flex">
                                <input class="layui-input lazadarules_width45" placeholder="大于等于" name="listingMin" type="number" min="0"
                                       onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                                <input class="layui-input lazadarules_width45" placeholder="小于等于" name="listingMax" type="number" min="0"
                                       onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-col-md12 layui-col-lg12">
                            <label class="layui-form-label">默认条件</label>
                            <div class="layui-input-block">
                                <input type="hidden" name="isProhibit">
                                <input type="hidden" name="isSale">
                                <input type="hidden" name="tortPlat">
                                <input type="hidden" name="isListing">
                                <input type="hidden" name="creatorId">
                                <input type="hidden" name="createTime">
                                <input type="hidden" name="creator">
                                <p>
                                    来源Lazada模板，禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，侵权状态=Lazada不侵权，类目禁售状态=不禁售，店铺刊登状态=未刊登，店铺生成状态=未生成
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item orderField">
                        <div class="layui-col-md6">
                            <label class="layui-form-label redStar">获取数据顺序</label>
                            <div class="layui-input-block">
                                <select name="orderField">
                                    <option value="1">审核时间倒序</option>
                                    <option value="2">审核时间正序</option>
                                    <option value="3">7天销量倒序</option>
                                    <option value="4">30天销量倒序</option>
                                    <option value="5">lazada7天销量倒序</option>
                                    <option value="6">lazada30天销量倒序</option>
                                    <option value="7">Shopee7天销量倒序</option>
                                    <option value="8">Shopee30天销量倒序</option>
                                    <option value="9">tiktok7天销量倒序</option>
                                    <option value="10">tiktok30天销量倒序</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item ruleType">
                        <label class="layui-form-label redStar">刊登方式</label>
                        <div class="layui-input-block lazadarules_ruleType_radio">
                            <input type="radio" name="ruleType" value="1" title="刊登店铺配置数量" lay-filter="lazadarules_addRule_ruleType" >
                            <input type="radio" name="ruleType" value="2" title="刊登模板配置数量" lay-filter="lazadarules_addRule_ruleType">
                        </div>
                    </div>
                    <div class="layui-form-item disN" id="lazadarules_listingNum">
                        <div>
                            <label class="layui-form-label redStar">刊登模板数</label>
                            <div class="layui-input-block">
                                <input type="number" class="layui-input" name="listingTemplateNum" title="刊登店铺配置数量"
                                    onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                    onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                    min="0"
                                >
                            </div>
                        </div>
                        <div>
                            <label class="layui-form-label w130 redStar">每个模板刊登店铺数</label>
                            <div class="layui-input-block ml160">
                                <input type="number" class="layui-input" name="listingStoreNum" title="刊登店铺配置数量"
                                    onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                    onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                >
                            </div>
                        </div>
                        <div>
                            <label class="layui-form-label w130 redStar">模板在线上限</label>
                            <div class="layui-input-block ml160">
                                <input type="number" class="layui-input" name="listingMaxNum" title="刊登模板上限"
                                       onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                       onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                >
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        过滤条件
                    </div>
                    <div class="layui-form-item unProdAttrList disN">
                        <label class="layui-form-label">不刊登商品标签</label>
                        <div class="layui-input-block">
                            <select name="unProdAttrList" id="unProdAttrList" xm-select="unProdAttrList" xm-select-search xm-select-search-type="dl"
                            xm-select-skin="normal">
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</script>
<%--添加规则弹框--%>
<script type="text/html" id="lazadarules_layer_addrules">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" lay-filter="lazadarules_form_addrules" id="lazadarules_form_addrules">
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label redStar">规则名称</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="ruleName">
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">备注</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="remark">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label redStar">状态</label>
                        <div class="layui-input-block">
                            <input type="radio" name="status" value="true" title="已启用" checked>
                            <input type="radio" name="status" value="false" title="已停用">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label redStar">刊登日期</label>
                        <div class="layui-input-block lazadarules_executionWeekTime_checkbox">
                            <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="1" title="周一">
                            <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="2" title="周二">
                            <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="3" title="周三">
                            <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="4" title="周四">
                            <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="5" title="周五">
                            <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="6" title="周六">
                            <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="0" title="周日">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label redStar">刊登类型</label>
                        <div class="layui-input-block">
                            <select name="globalListing" lay-verify="required" lay-filter="lazadarulesGlobalListing">
                                <option value="false">单站点刊登</option>
                                <option value="true">GSP刊登</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label redStar">Lazada站点</label>
                        <div class="layui-input-block ">
                            <select id="saleSite" name="saleSite" lay-filter="lazadarules_saleSite">
                                <option></option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item lazadaRulesSaleSiteHide">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label redStar">刊登站点</label>
                        <div class="layui-input-block" id="lazadaRulesSaleSite">

                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label redStar">站点类目</label>
                        <div class="layui-input-block">
                            <input type="radio" title="全部类目" name="lazadarulesCateTreeRadioChecked" lay-filter="lazadaCateTreeAllChecked" value="0">
                            <input type="radio" title="指定类目" name="lazadarulesCateTreeRadioChecked" lay-filter="lazadaCateTreeAllChecked" value="1" checked>
                                <div class="lazadaCateTreeIsShow">
                                    <ul id="lazadarulesCateTree" class="ztree"></ul>
                                </div>
                        </div>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">开发类型</label>
                    <div class="layui-input-block">
                        <%--<input class="layui-input" name="devType">--%>
                        <select name="devType" id="devType" xm-select="devType" xm-select-search xm-select-search-type="dl"
                                xm-select-skin="normal">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">商品标签</label>
                    <div class="layui-input-block">
                        <select name="prodAttrList" id="prodAttrList" xm-select="prodAttrList" xm-select-search xm-select-search-type="dl"
                                xm-select-skin="normal">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">物流属性</label>
                    <div class="layui-input-block">
                        <select name="logisAttrList" id="logisAttrList" xm-select="logisAttrList" xm-select-search xm-select-search-type="dl"
                                xm-select-skin="normal">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">商品归属人</label>
                    <div class="layui-input-block">
                        <input class="layui-input" id="bizzOwnerList" name="bizzOwnerList" placeholder="英文逗号分隔"
                               onblur="handleSku(this.value,event)">
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">模板SKU</label>
                    <div class="layui-input-block">
                        <textarea class="layui-textarea" placeholder="英文逗号分隔"
                                  name="modelPSku"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label redStar">lazada模板类型</label>
                        <div class="layui-input-block">
                            <select name="moduleType">
                                <option value="2">全部</option>
                                <option value="1">组合模板</option>
                                <option value="0" selected>非组合模板</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">lazada模板创建时间</label>
                        <div class="layui-input-block lazadarules_dis_flex">
                            <input class="layui-input" name="createDays" type="number" onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}" min="0">
                            <div style="width:130%;margin-top: 5px;">天内</div>
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">30天销量</label>
                        <div class="layui-input-block lazadarules_dis_flex">
                            <input class="layui-input lazadarules_width45" placeholder="大于等于" name="thirtySalesStart" type="number" min="0"
                                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                            <input class="layui-input lazadarules_width45" placeholder="小于" name="thirtySalesEnd" type="number" min="0"
                                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">成本(RMB)</label>
                        <div class="layui-input-block lazadarules_dis_flex">
                            <input class="layui-input lazadarules_width45" placeholder="大于等于" name="costMin" type="number" min="0"
                                   onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                            <input class="layui-input lazadarules_width45" placeholder="小于等于" name="costMax" type="number" min="0"
                                   onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">重量(克)</label>
                        <div class="layui-input-block lazadarules_dis_flex">
                            <input class="layui-input lazadarules_width45" placeholder="大于等于" name="weightMin" type="number" min="0"
                                   onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                            <input class="layui-input lazadarules_width45" placeholder="小于等于" name="weightMax" type="number" min="0"
                                   onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <div class="layui-form-label labelSel" style="width: 200px;">
                            <select name="preAvailableStockType">
                                <option value="1">预计可用库存含在途大于</option>
                                <option value="2">预计可用库存不含在途大于</option>
                            </select>
                        </div>
                        <div class="layui-input-block" style="margin-left: 230px;">
                            <input type="number" class="layui-input" placeholder="预计可用库存数" name="preAvailableStockNum" onkeyup="if(this.value && ! /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/.test(this.value)){alert('只能输入整数');this.value='';}">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <div class="layui-form-label">刊登量</div>
                        <div class="layui-input-block lazadarules_dis_flex">
                            <input class="layui-input lazadarules_width45" placeholder="大于等于" name="listingMin" type="number" min="0"
                                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                            <input class="layui-input lazadarules_width45" placeholder="小于等于" name="listingMax" type="number" min="0"
                                   onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">默认条件</label>
                        <div class="layui-input-block">
                            <input type="hidden" name="isProhibit">
                            <input type="hidden" name="isSale">
                            <input type="hidden" name="tortPlat">
                            <input type="hidden" name="isListing">
                            <input type="hidden" name="creatorId">
                            <input type="hidden" name="createTime">
                            <input type="hidden" name="creator">
                            <p>
                                来源Lazada模板，禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，侵权状态=Lazada不侵权，类目禁售状态=不禁售，店铺刊登状态=未刊登，店铺生成状态=未生成
                            </p>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label redStar">获取数据顺序</label>
                        <div class="layui-input-block">
                            <select name="orderField">
                                <option value="1">审核时间倒序</option>
                                <option value="2">审核时间正序</option>
                                <option value="3">7天销量倒序</option>
                                <option value="4">30天销量倒序</option>
                                <option value="5">lazada7天销量倒序</option>
                                <option value="6">lazada30天销量倒序</option>
                                <option value="7">Shopee7天销量倒序</option>
                                <option value="8">Shopee30天销量倒序</option>
                                <option value="9">tiktok7天销量倒序</option>
                                <option value="10">tiktok30天销量倒序</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">刊登方式</label>
                    <div class="layui-input-block lazadarules_ruleType_radio">
                        <input type="radio" name="ruleType" value="1" title="刊登店铺配置数量" lay-filter="lazadarules_addRule_ruleType" >
                        <input type="radio" name="ruleType" value="2" title="刊登模板配置数量" lay-filter="lazadarules_addRule_ruleType">
                    </div>
                </div>
                <div class="layui-form-item disFCenter" id="lazadarules_listingNum">
                    <div>
                        <label class="layui-form-label redStar">刊登模板数</label>
                        <div class="layui-input-block">
                            <input type="number" class="layui-input" name="listingTemplateNum" title="刊登店铺配置数量"
                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                min="0"
                            >
                        </div>
                    </div>
                    <div>
                        <label class="layui-form-label w130 redStar">每个模板刊登店铺数</label>
                        <div class="layui-input-block ml160">
                            <input type="number" class="layui-input" name="listingStoreNum" title="刊登店铺配置数量"
                                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            >
                        </div>
                    </div>
                    <div>
                        <label class="layui-form-label w130 redStar">模板在线上限</label>
                        <div class="layui-input-block ml160">
                            <input type="number" class="layui-input" name="listingMaxNum" title="刊登模板上限"
                                   onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                   onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            >
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    过滤条件
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">不刊登商品标签</label>
                    <div class="layui-input-block">
                        <select name="unProdAttrList" id="unProdAttrList" xm-select="unProdAttrList" xm-select-search xm-select-search-type="dl"
                        xm-select-skin="normal">
                        </select>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>
<%--设置店铺--%>
<script type="text/html" id="lazadarules_layer_storemanage">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="lazadarules_dis_flex">
                <div>刊登规则：<span class="storemanage_name"></span></div>
                <div>
                <button class="layui-btn" id="lazadarules_storemanage_exportbtn">导出</button>
                <button class="layui-btn" id="lazadarules_storemanage_removebtn">批量移除店铺</button>
                <%--<permTag:perm funcCode="lazada_rules_list_edit">--%>
                <button class="layui-btn" id="lazadarules_storemanage_storeaddbtn">添加店铺</button>
                <%--</permTag:perm>--%>
                 <input type="hidden" value="" class="storemanage_id" id="lazadarules_id">
                </div>
            </div>
            <table class="layui-table" lay-filter="lazadarules_table_storemanage"
                   id="lazadarules_table_storemanage"></table>
        </div>
    </div>
</script>
<%--添加店铺--%>
<script type="text/html" id="lazadarules_layer_storeadd">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" lay-filter="lazadarules_layer_storeadd" id="lazadarules_storeadd">
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">店铺名</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="storeAccts" lay-verify="required">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">在线库存</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="stock" lay-verify="required" type="number" min="0"
                               onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">每天刊登量</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="dailyPublishNums" type="number" min="0" max="500"
                               lay-verify="required"
                               onkeyup="if(this.value && ! /^(500|[1-4]{0,1}\d{0,1}\d)$/.test(this.value)){alert('只能输入0-500之间的数字');this.value='';}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">上架开始时间</label>
                    <div class="layui-input-block">
                        <select name="publishTime" lay-verify="required">
                            <option value=""></option>
                            <option value="1">1点</option>
                            <option value="2">2点</option>
                            <option value="3">3点</option>
                            <option value="4">4点</option>
                            <option value="5">5点</option>
                            <option value="6">6点</option>
                            <option value="7">7点</option>
                            <option value="8">8点</option>
                            <option value="9">9点</option>
                            <option value="10">10点</option>
                            <option value="11">11点</option>
                            <option value="12">12点</option>
                            <option value="13">13点</option>
                            <option value="14">14点</option>
                            <option value="15">15点</option>
                            <option value="16">16点</option>
                            <option value="17">17点</option>
                            <option value="18">18点</option>
                            <option value="19">19点</option>
                            <option value="20">20点</option>
                            <option value="21">21点</option>
                            <option value="22">22点</option>
                            <option value="23">23点</option>
                            <option value="24">24点</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">上架间隔时间</label>
                    <div class="layui-input-block">
                        <select name="publishInterval" lay-verify="required">
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
<%--移除店铺--%>
<script type="text/html" id="lazadarules_layer_removestore">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="lazadarules_layer_removestore_form">
                <div class="layui-form-item">
                    <label class="layui-form-label">卖家简称列表</label>
                    <div class="layui-input-block">
                        <textarea class="layui-textarea" placeholder="请输入需要删除的店铺名，多个店铺用回车换行" id="allStoreName"></textarea>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>
<!--规则状态的开启和关闭-->
<script type="text/html" id="lazadarules_tabletemplet_type">
    <permTag:perm funcCode="lazada_rules_list_edit">
    <div class="layui-form-item">
        {{# if(d.status){ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="lazadarules_orderDownloadStatus" value="{{d.id}}" checked>
        {{# }else{ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="lazadarules_orderDownloadStatus" value="{{d.id}}">
        {{# } }}
    </div>
    </permTag:perm>
    <permTag:lacksPerm funcCode="lazada_rules_list_edit">
    <div class="layui-form-item">
    {{# if(d.status){ }}
    <input type="checkbox" lay-skin="switch"
    lay-filter="orderDownloadStatus" value="{{d.id}}" checked disabled>
    {{# }else{ }}
    <input type="checkbox" lay-skin="switch"
    lay-filter="orderDownloadStatus" value="{{d.id}}" disabled>
    {{# } }}
    </div>
    </permTag:lacksPerm>
</script>

<!-- 表格操作按钮 -->
<script type="text/html" id="lazadarules_tabletemplet_optionbtn">
    <permTag:perm funcCode="lazada_rules_list_edit">
    <button class="layui-btn layui-btn-sm" lay-event="edit" style="padding: 0 6px;" title="编辑"><i class="layui-icon">&#xe642;</i>
    </button>
        <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="copy" style="padding:0 10px;" title="复制"><img width="15" src="${ctx}/static/img/copy.png">
        </button>
    <button class="layui-btn layui-btn-sm layui-btn-danger" style="padding: 0 6px;" lay-event="delete" title="删除"><i
            class="layui-icon">&#xe640;</i>
    </button>
    </permTag:perm>
    <permTag:lacksPerm funcCode="lazada_rules_list_edit">
    <button class="layui-btn layui-btn-sm layui-btn-disabled" disabled  style="padding: 0 6px;"><i class="layui-icon">&#xe642;</i>
    </button>
        <button class="layui-btn layui-btn-sm layui-btn-disabled" disabled style="padding:0 10px;"><img width="15" src="${ctx}/static/img/copy.png">
        </button>
    <button class="layui-btn layui-btn-sm layui-btn-danger layui-btn-disabled" disabled style="padding: 0 6px;"><i class="layui-icon">&#xe640;</i>
    </button>
    </permTag:lacksPerm>
    <button class="layui-btn layui-btn-sm" lay-event="log">日志</button>
</script>
<!-- 表格操作按钮 -->
<script type="text/html" id="lazadarules_tabletemplet_storeoptionbtn">
        <button class="layui-btn layui-btn-sm" lay-event="edit" style="padding: 0 6px;"><i class="layui-icon">&#xe642;</i>
        </button>
        <button class="layui-btn layui-btn-sm layui-btn-danger" style="padding: 0 6px;" lay-event="delete"><i
                class="layui-icon">&#xe640;</i>
        </button>
</script>


<script type="text/html" id="lazadarules_tabletemplet_count">
    <a lay-event="lazadarules_tabletemplet_count" style="color:#1E90FF;cursor:pointer;">{{d.storeNums}}</a>
</script>






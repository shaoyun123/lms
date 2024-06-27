<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
            <title>shopee刊登规则</title>
            <style>
                .shopeerules_dis_flex {
                    display: flex;
                    justify-content: space-between;
                }

                .shopeerules_width45 {
                    width: 45%;
                }

                .redStar:before {
                    content: "*";
                    color: red;
                    font-size: 20px;
                    position: relative;
                    top: 7px;
                    right: 10px;
                }
                #shopeerules_page .layui-checkbox-disbaled{
                    background-color: #e2e2e2;
                }
                #shopeerules_page .line-feet{
                    white-space: break-spaces;
                    text-align: left;
                }
            </style>
            <div class="layui-fluid" id="shopeerules_page">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-lg12 layui-col-md12">
                        <!-- 搜索条件 -->
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <form class="layui-form" id="shopeerules_searchForm">
                                    <div class="layui-form-item">
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">部门</label>
                                            <div class="layui-input-block">
                                                <select id="shopeeRules_depart_sel" lay-search
                                                    lay-filter="shopeeRules_depart_sel" class="orgs_hp_custom">
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg2 layui-col-md2">
                                            <label class="layui-form-label">销售人员</label>
                                            <div class="layui-input-block">
                                                <select id="shopeeRules_salesman_sel" lay-search
                                                    lay-filter="shopeeRules_salesman_sel" class="users_hp_custom"
                                                    data-rolelist="shopee专员">
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-lg3 layui-col-md3">
                                            <label class="layui-form-label">店铺</label>
                                            <div class="layui-input-block" style="font-size: 12px;">
                                                <select id="shopeeRules_store_sel" lay-filter="shopeeRules_store_sel"
                                                    name="storeAcctIdList" xm-select="shopeeRules_store_sel"
                                                    class="users_hp_store_multi" xm-select-search
                                                    xm-select-search-type="dl" xm-select-skin="normal"
                                                    data-platcode="shopee"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg2">
                                            <label class="layui-form-label">规则名称</label>
                                            <div class="layui-input-block disflex">
                                                <div class="w100">
                                                    <select name="queryRuleNameInclude">
                                                        <option value="true">包含</option>
                                                        <option value="false">不包含</option>
                                                    </select>
                                                </div>
                                                <input class="layui-input" name="ruleName">
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg2">
                                            <label class="layui-form-label">状态</label>
                                            <div class="layui-input-block">
                                                <select name="status">
                                                    <option value=""></option>
                                                    <option value="1" selected>已开启</option>
                                                    <option value="0">已关闭</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg2">
                                            <label class="layui-form-label">创建人</label>
                                            <div class="layui-input-block">
                                                <select id="shopeerules_creatorId" name="creatorId" lay-search>
                                                    <option value=""></option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg2">
                                            <label class="layui-form-label">刊登规则</label>
                                            <div class="layui-input-block">
                                                <select name="ruleType">
                                                    <option value=""></option>
                                                    <option value="1">按店铺刊登</option>
                                                    <option value="2">按模板刊登</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">站点</label>
                                            <div class="layui-input-block">
                                                <select id="shopeerules_site_sel" name="siteIdList"
                                                    lay-filter="shopeerules_site_sel" xm-select="shopeerules_site_sel"
                                                    class="salesSite_hp_custom" xm-select-search
                                                    xm-select-search-type="dl" xm-select-skin="normal"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">规则ID</label>
                                            <div class="layui-input-block">
                                                <input class="layui-input" name="ruleIds" onblur="commChangeInputVal(this.value, event)">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">OA类目</label>
                                            <div class="layui-input-block">
                                                <input id="shopeerules_cateIds">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <label class="layui-form-label">CNSC类目</label>
                                            <div class="layui-input-block">
                                                <input id="shopeerules_cnscCateIds">
                                            </div>
                                        </div>
                                        <div class="layui-col-md2 layui-col-lg2">
                                            <div class="layui-input-block">
                                                <button id="shopeerules_searchBtn" class="layui-btn layui-btn-sm"
                                                    type="button">查询
                                                </button>

                                                <button id="shopeerules_resetBtn"
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
                                <div class="layui-tab" lay-filter="shopee_rules_tab">
                                    <div class="fixTab layui-form">
                                        <div>
                                            <ul class="layui-tab-title"  id="shopee_rules_tab_header">
                                                <li data-status="" class="layui-this">数量(<span></span>)</li>
                                                <li data-status="2"> 已删除规则(<span></span>)</li>
                                            </ul>
                                            <div class="ml20 shopeerules_showNomal">
                                                <permTag:perm funcCode="shopee_rules_list_edit">
                                                    <a class="layui-btn" id="shopeerules_btn_addrules">添加规则</a>
                                                </permTag:perm>
                                            </div>
                                        </div>
                                        <div class="shopeerules_showNomal">
                                            <div class="w150">
                                                <select name="" lay-filter="shopee_rules_batchOp">
                                                    <option value="">批量操作</option>
                                                    <permTag:perm funcCode="shopee_rules_bacthOnRule">
                                                        <option value="0">批量开启规则</option>
                                                    </permTag:perm>
                                                    <permTag:perm funcCode="shopee_rules_bacthOffRule">
                                                        <option value="1">批量关闭规则</option>
                                                    </permTag:perm>
                                                </select>
                                            </div>
                                            <permTag:perm funcCode="shopee_store_list_edit">
                                                <a class="layui-btn ml10" id="shopeerules_btn_downLoad" target="_blank" href="/lms/static/templet/ShopeeListingRuleStoreTemplate.xlsx">下载模板</a>
                                                <a class="layui-btn" id="shopeerules_btn_exportEdit">导入修改</a>
                                            </permTag:perm>
                                        </div>
                                    </div>
                                    <table class="layui-table" id="shopeerules_table_addrules"
                                        lay-filter="shopeerules_table_addrules"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="disN" id="salesSite_shopee_options">
                    <option value=""></option>
                    <c:forEach items="${shopeeSiteEnum}" var="site">
                        <option value="${site.code}">${site.name}</option>
                    </c:forEach>
                </div>
            </div>
            <script type="text/javascript" src="${ctx}/static/request.js" />
            <script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
            <script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
            <script type="text/javascript" src="${ctx}/static/js/publishs/shopee/shopeeRules.js"></script>
            <%--添加规则弹框--%>
                <script type="text/html" id="shopeerules_layer_addrulesLayerCreatAndEdit">
<div id="shopeerules_layer_addrulesView"></div>
</script>

                <script type="text/html" id="shopeerules_layer_addrulesDemo">
<div class="layui-card">
    <div class="layui-card-body">
        <form class="layui-form" lay-filter="shopeerules_form_addrules" id="shopeerules_form_addrules">
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label redStar">规则名称</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="ruleName" value="{{d.ruleName||''}}">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">备注</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="remark" value="{{d.remark||''}}">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label redStar">状态</label>
                    <div class="layui-input-block">
                        {{# if(d.status == 0){ }}
                        <input type="radio" name="status" value="1" title="已启用">
                        <input type="radio" name="status" value="0" title="已停用" checked>
                        {{# }else { }}
                        <input type="radio" name="status" value="1" title="已启用" checked>
                        <input type="radio" name="status" value="0" title="已停用">
                        {{# } }}
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label redStar">刊登日期</label>
                    <div class="layui-input-block">
                        <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="1" title="周一"
                               {{d.executionWeekTime== undefined&& 'checked'}} {{(d.executionWeekTime||'').indexOf('1')
                        != -1 && 'checked'}}>
                        <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="2" title="周二"
                               {{d.executionWeekTime== undefined&& 'checked'}} {{(d.executionWeekTime||'').indexOf('2')
                        != -1 && 'checked'}}>
                        <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="3" title="周三"
                               {{d.executionWeekTime== undefined&& 'checked'}} {{(d.executionWeekTime||'').indexOf('3')
                        != -1 && 'checked'}}>
                        <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="4" title="周四"
                               {{d.executionWeekTime== undefined&& 'checked'}} {{(d.executionWeekTime||'').indexOf('4')
                        != -1 && 'checked'}}>
                        <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="5" title="周五"
                               {{d.executionWeekTime== undefined&& 'checked'}} {{(d.executionWeekTime||'').indexOf('5')
                        != -1 && 'checked'}}>
                        <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="6" title="周六"
                               {{d.executionWeekTime== undefined&& 'checked'}} {{(d.executionWeekTime||'').indexOf('6')
                        != -1 && 'checked'}}>
                        <input type="checkbox" name="executionWeekTime" lay-skin="primary" value="0" title="周日"
                               {{d.executionWeekTime== undefined&& 'checked'}} {{(d.executionWeekTime||'').indexOf('日')
                        != -1 && 'checked'}}>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label redStar">站点</label>
                    <div class="layui-input-block">
                        <select id="saleSite" name="saleSite">
                            <option></option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label redStar">刊登类目</label>
                    <div class="layui-input-block" style="margin-left: 20px;">
                        <div class="layui-form-item">
                        <div class="layui-col-md12 layui-col-lg12">
                            <label class="layui-form-label">OA类目</label>
                            <div class="layui-input-block">
                                <input id="shopeerules_form_addrules_oaCate">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md6 layui-col-lg6">
                                <label class="layui-form-label"></label>
                                <div class="layui-input-block">
                                <select name="cateAndOr" >
                                        <option value="true" selected>and</option>
                                        <option value="false"  {{d.cateAndOr === false&& 'selected'}}>or</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md12 layui-col-lg12">
                                <label class="layui-form-label">CNSC类目</label>
                                <div class="layui-input-block disflex">
                                    <input id="shopeerules_form_addrules_cnscCate">
                                    <div class="w300 ml40 disflex">
                                        <div>
                                            <input type="checkbox" name="cnscAssiDataOnly" lay-skin="primary" value="true" title="仅取值自商品补充信息"
                                                {{d.cnscAssiDataOnly== true&& 'checked'}} />
                                        </div>
                                        <div class="mt05" lay-tips="选中后将不会根据CNSC类目映射关系查找对应OA类目商品">
                                            <svg t="1682217595408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3545" width="18" height="18"><path d="M512 888c207.66 0 376-168.34 376-376S719.66 136 512 136 136 304.34 136 512s168.34 376 376 376z m0 72C264.576 960 64 759.424 64 512S264.576 64 512 64s448 200.576 448 448-200.576 448-448 448z" fill="#5090F1" p-id="3546"></path><path d="M480 760m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z" fill="#5090F1" p-id="3547"></path><path d="M512 612v68a8 8 0 0 1-8 8h-48a8 8 0 0 1-8-8v-68c0-35.346 28.654-64 64-64 71.797 0 130-58.203 130-130S583.797 288 512 288 382 346.203 382 418H318C318 310.857 404.857 224 512 224s194 86.857 194 194-86.857 194-194 194z" fill="#5090F1" p-id="3548"></path></svg>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">开发类型</label>
                <div class="layui-input-block">
                    <select id="devType" xm-select="devType" xm-select-search xm-select-search-type="dl"
                            xm-select-skin="normal">
                    </select>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">商品标签</label>
                <div class="layui-input-block">
                    <select id="prodAttrList" xm-select="prodAttrList" xm-select-search xm-select-search-type="dl"
                            xm-select-skin="normal">
                    </select>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                    <select id="logisAttrList" xm-select="logisAttrList" xm-select-search xm-select-search-type="dl"
                            xm-select-skin="normal">
                    </select>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">商品归属人</label>
                <div class="layui-input-block">
                    <textarea class="layui-textarea" placeholder="中文逗号分隔"
                              name="bizzOwnerList">{{d.bizzOwnerList||''}}</textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">模板SKU</label>
                <div class="layui-input-block">
                    <textarea class="layui-textarea" placeholder="英文逗号分隔"
                              name="prodPSkuListStr">{{d.prodPSkuListStr||''}}</textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">商品审核时间</label>
                    <div class="layui-input-block shopeerules_dis_flex">
                        <input class="layui-input" name="auditDays" value="{{d.auditDays||''}}"
                               onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                        <div style="width:130%;margin-top: 5px;">天内</div>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">30天销量</label>
                    <div class="layui-input-block shopeerules_dis_flex">
                        <input class="layui-input shopeerules_width45" name="thirtySalesStart" type="number" min="0"
                               value="{{d.thirtySalesStart||''}}" placeholder="大于等于"
                               onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                        <input class="layui-input shopeerules_width45" name="thirtySalesEnd" type="number" min="0"
                               value="{{d.thirtySalesEnd||''}}" placeholder="小于"
                               onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">成本(RMB)</label>
                    <div class="layui-input-block shopeerules_dis_flex">
                        <input class="layui-input shopeerules_width45" value="{{d.costMin||''}}" name="costMin"
                               type="number" min="0" placeholder="大于等于"
                               onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                        <input class="layui-input shopeerules_width45" value="{{d.costMax||''}}" name="costMax"
                               type="number" min="0" placeholder="小于等于"
                               onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">重量(克)</label>
                    <div class="layui-input-block shopeerules_dis_flex">
                        <input class="layui-input shopeerules_width45" value="{{d.weightMin||''}}" name="weightMin"
                               type="number" min="0" placeholder="大于等于"
                               onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                        <input class="layui-input shopeerules_width45" value="{{d.weightMax||''}}" name="weightMax"
                               type="number" min="0" placeholder="小于等于"
                               onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <div class="layui-form-label labelSel" style="width: 200px;">
                            <select name="preAvailableStockType">
                                <option value="1">预计可用库存含在途大于</option>
                                <option value="2" {{d.preAvailableStockType==2 ? 'selected' : ''}}>预计可用库存不含在途大于</option>
                            </select>
                        </div>
                        <div class="layui-input-block" style="margin-left: 230px;">
                            <input type="number" class="layui-input" placeholder="预计可用库存数" name="preAvailableStockNum" value="{{d.preAvailableStockNum!=undefined ? d.preAvailableStockNum:''}}" onkeypress="shopeeRules_inputInt(event)">
                        </div>
                    </div>
                </div>
            <div class="layui-form-item">
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">默认条件</label>
                    <div class="layui-input-block">
                        <p>
                            来源shopee模板，禁售状态=未禁售，在售状态=在售，侵权状态=shopee不侵权，类目禁售状态=不禁售，店铺刊登状态=未刊登，店铺生成状态=未生成
                        </p>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label redStar">获取顺序</label>
                    <div class="layui-input-block">
                        <select name="orderField">
                            <option value="1" {{d.orderField== 1&&
                            'selected'}}>审核时间倒序</option>
                            <option value="2" {{d.orderField== 2&&
                            'selected'}}>审核时间正序</option>
                            <option value="3" {{d.orderField== 3&&
                            'selected'}}>7天销量倒序</option>
                            <option value="4" {{d.orderField== 4&&
                            'selected'}}>30天销量倒序</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label redStar">刊登规则</label>
                <div class="layui-input-block lazadarules_ruleType_radio">
                    <input type="radio" name="ruleType" {{d.ruleType !=2&&'checked'}} value="1" title="刊登店铺配置数量"
                           lay-filter="shopeerules_addRule_ruleType">
                    <input type="radio" name="ruleType" {{d.ruleType== 2&&'checked'}} value="2" title="刊登模板配置数量"
                    lay-filter="shopeerules_addRule_ruleType">
                </div>
            </div>
            <div class="layui-form-item hidden" id="shopeerules_listingNum">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label redStar">刊登模板数</label>
                    <div class="layui-input-block">
                        <input type="number" class="layui-input" name="listingTemplateNum" title="刊登店铺配置数量"
                               value="{{d.listingTemplateNum||''}}"
                               onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                               min="0"
                        >
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label w130 redStar">每个模板刊登店铺数</label>
                    <div class="layui-input-block ml160">
                        <input type="number" class="layui-input" name="listingStoreNum" title="刊登店铺配置数量"
                               value="{{d.listingStoreNum||''}}"
                               onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}"
                               min="0"
                        >
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label w130">模板在线上限</label>
                    <div class="layui-input-block ml160">
                        <input type="number" class="layui-input" name="listingMaxNum" title="刊登模板上限"
                               value="{{d.listingMaxNum||''}}"
                               onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                               onblur="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        >
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
</script>
                <%--设置店铺--%>
<script type="text/html" id="shopeerules_layer_storemanage">
<div class="layui-card">
    <div class="layui-card-body">
        <form action="" id="shopeerules_storemanage_searchForm" class="layui-form">
            <div class="layui-form-item">
                <div class="layui-col-lg3 layui-col-md3">
                    <label class="layui-form-label">部门</label>
                    <div class="layui-input-block">
                        <select id="shopeerules_storemanage_depart_sel" lay-search lay-filter="shopeerules_storemanage_depart_sel"
                                class="orgs_hp_custom">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3">
                    <label class="layui-form-label">销售人员</label>
                    <div class="layui-input-block">
                        <select id="shopeerules_storemanage_salesman_sel" lay-search
                                lay-filter="shopeerules_storemanage_salesman_sel" class="users_hp_custom"
                                data-rolelist="shopee专员">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-lg3 layui-col-md3 hidden">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block" style="font-size: 12px;">
                        <select id="shopeerules_storemanage_store_sel" lay-filter="shopeerules_storemanage_store_sel"
                                name="storeAcctIdList"
                                xm-select="shopeerules_storemanage_store_sel" class="users_hp_store_multi"
                                xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                data-platcode="shopee"></select>
                    </div>
                </div>
                <div class="layui-col-lg2 layui-col-md2">
                    <div class="layui-input-block">
                        <button id="shopeerules_storemanage_searchBtn" class="layui-btn layui-btn-sm" type="button">查询
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <div class="shopeerules_dis_flex">
            <div class="layui-col-lg3 layui-col-md3">
            刊登规则：<span class="shopeerules_storemanage_name"></span></div>
            <div class="layui-col-lg4 layui-col-md4">
                <div class="layui-col-lg8 layui-col-md8 shopeerules_showNomal" >
                    <label class="layui-form-label">每日刊登量</label>
                    <div class="layui-input-block">
                        <input class="layui-input" id="shopeeRules_batchSetDailyListing">
                    </div>
                </div>
                <div class="layui-col-lg4 layui-col-md4 shopeerules_showNomal">
                        <button id="shopeeRules_batchSetDailyListingBtn" class="layui-btn layui-btn-sm" type="button">一键应用</button>
                </div>
            </div>
            <permTag:perm funcCode="shopee_store_list_edit">
                <div class="layui-col-lg5 layui-col-md5">
                    <div class="fr">
                        <button class="layui-btn shopeerules_showNomal" id="shopeerules_storemanage_batchSaveBtn">批量保存</button>
                        <button class="layui-btn" id="shopeerules_storemanage_exportbtn">导出</button>
                        <button class="layui-btn shopeerules_showNomal" id="shopeerules_storemanage_removebtn">批量移除店铺</button>
                        <button class="layui-btn shopeerules_showNomal" id="shopeerules_storemanage_storeaddbtn">添加店铺</button>
                    </div>
                </div>
            </permTag:perm>
            <input type="hidden" value="" class="shopeerules_storemanage_id">
        </div>
        <table class="layui-table" lay-filter="shopeerules_table_storemanage"
               id="shopeerules_table_storemanage"></table>
    </div>
</div>
</script>
                    <%--添加店铺弹框--%>
                        <script type="text/html" id="shopeerules_layer_storeAddEdit">
<div id="shopeerules_layer_storeaddView"></div>
</script>

                        <script type="text/html" id="shopeerules_layer_storeaddDemo">
<div class="layui-card">
    <div class="layui-card-body">
        <form class="layui-form" lay-filter="shopeerules_layer_storeadd" id="shopeerules_storeadd">
            <div class="layui-form-item">
                <label class="layui-form-label">店铺名</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="storeNameStr" value="{{d.storeAcct||''}}"
                           placeholder="多个店铺请使用英文逗号分隔" {{d.storeAcct==undefined?'':'readonly'}}>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">在线库存</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="stock" value="{{d.stock==undefined?'':d.stock}}"
                           lay-verify="required" type="number" min="0"
                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">每天刊登量</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="dailyPublishNums"
                           value="{{d.dailyPublishNums==undefined?'':d.dailyPublishNums}}" type="number" min="0"
                           max="3000" lay-verify="required"
                           onkeyup="if(this.value && ! /^[+]{0,1}(\d+)$/.test(this.value)){alert('只能输入正整数');this.value='';}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font class="fRed">*</font>上架开始时间</label>
                <div class="layui-input-block">
                    <select name="publishTime">
                        <option value="">请选择</option>
                        <option value="1" {{d.publishTime== 1&&
                        'selected'}}>1点</option>
                        <option value="2" {{d.publishTime== 2&&
                        'selected'}}>2点</option>
                        <option value="3" {{d.publishTime== 3&&
                        'selected'}}>3点</option>
                        <option value="4" {{d.publishTime== 4&&
                        'selected'}}>4点</option>
                        <option value="5" {{d.publishTime== 5&&
                        'selected'}}>5点</option>
                        <option value="6" {{d.publishTime== 6&&
                        'selected'}}>6点</option>
                        <option value="7" {{d.publishTime== 7&&
                        'selected'}}>7点</option>
                        <option value="8" {{d.publishTime== 8&&
                        'selected'}}>8点</option>
                        <option value="9" {{d.publishTime== 9&&
                        'selected'}}>9点</option>
                        <option value="10" {{d.publishTime== 10&&
                        'selected'}}>10点</option>
                        <option value="11" {{d.publishTime== 11&&
                        'selected'}}>11点</option>
                        <option value="12" {{d.publishTime== 12&&
                        'selected'}}>12点</option>
                        <option value="13" {{d.publishTime== 13&&
                        'selected'}}>13点</option>
                        <option value="14" {{d.publishTime== 14&&
                        'selected'}}>14点</option>
                        <option value="15" {{d.publishTime== 15&&
                        'selected'}}>15点</option>
                        <option value="16" {{d.publishTime== 16&&
                        'selected'}}>16点</option>
                        <option value="17" {{d.publishTime== 17&&
                        'selected'}}>17点</option>
                        <option value="18" {{d.publishTime== 18&&
                        'selected'}}>18点</option>
                        <option value="19" {{d.publishTime== 19&&
                        'selected'}}>19点</option>
                        <option value="20" {{d.publishTime== 20&&
                        'selected'}}>20点</option>
                        <option value="21" {{d.publishTime== 21&&
                        'selected'}}>21点</option>
                        <option value="22" {{d.publishTime== 22&&
                        'selected'}}>22点</option>
                        <option value="23" {{d.publishTime== 23&&
                        'selected'}}>23点</option>
                        <option value="24" {{d.publishTime== 24&&
                        'selected'}}>24点</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">上架间隔时间</label>
                <div class="layui-input-block">
                    <select name="publishInterval">
                        <option value="1" {{d.publishInterval== 1&&
                        'selected'}}>1分钟</option>
                        <option value="2" {{d.publishInterval== 2&&
                        'selected'}}>2分钟</option>
                        <option value="3" {{d.publishInterval== 3&&
                        'selected'}}>3分钟</option>
                        <option value="4" {{d.publishInterval== 4&&
                        'selected'}}>4分钟</option>
                        <option value="5" {{d.publishInterval== 5&&
                        'selected'}}>5分钟</option>
                        <option value="10" {{d.publishInterval== 10&&
                        'selected'}}>10分钟</option>
                        <option value="15" {{d.publishInterval== 15&&
                        'selected'}}>15分钟</option>
                        <option value="20" {{d.publishInterval== 20&&
                        'selected'}}>20分钟</option>
                        <option value="25" {{d.publishInterval== 25&&
                        'selected'}}>25分钟</option>
                        <option value="30" {{d.publishInterval== 30&&
                        'selected'}}>30分钟</option>
                    </select>
                </div>
            </div>
        </form>
    </div>
</div>
</script>
<!--规则状态的开启和关闭-->
<script type="text/html" id="shopeerules_tabletemplet_type">
<permTag:perm funcCode="shopee_store_list_edit">
    <div class="layui-form-item">
        {{# if(d.status==1){ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="orderDownloadStatus" value="{{d.id}}" checked>
        {{# }else{ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="orderDownloadStatus" value="{{d.id}}">
        {{# } }}
    </div>
</permTag:perm>
<permTag:lacksPerm funcCode="shopee_store_list_edit">
    <div class="layui-form-item" disabled>
        {{# if(d.status==1){ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="orderDownloadStatus" value="{{d.id}}" checked disabled>
        {{# }else{ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="orderDownloadStatus" value="{{d.id}}" disabled>
        {{# } }}
    </div>
</permTag:lacksPerm>
</script>

<script type="text/html" id="shopeerules_tabletemplet_Deltype">
    <div class="layui-form-item" disabled>
        {{# if(d.status==1){ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="orderDownloadStatus" value="{{d.id}}" checked disabled>
        {{# }else{ }}
        <input type="checkbox" lay-skin="switch"
               lay-filter="orderDownloadStatus" value="{{d.id}}" disabled>
        {{# } }}
    </div></script>

<!-- 表格操作按钮 -->
<script type="text/html" id="shopeerules_tabletemplet_optionbtn">
    <input type="hidden" class="shopeeRules_IdInp" value="{{d.id}}">
    <button type="button" lay-event="readonly" class="layui-btn layui-btn-sm" style="background-color: #35a9ff">查看</button>
    <!-- 复制按钮只在规则table里面有 -->
    {{# if(!d.publishInterval){ }}
    <permTag:perm funcCode="shopeeRules_addCopyBtn">
        <button type="button" id="shopeeRules_addCopyBtn" lay-event="addCopy"
                class="layui-btn layui-btn-sm" style="background-color: #35a9ff">复制
        </button>
    </permTag:perm>
    {{# } }}
    <permTag:perm funcCode="shopee_rules_list_edit">
        <button class="layui-btn layui-btn-sm" lay-event="remark" style="padding: 0 6px;"><i
                class="layui-icon">&#xe642;</i>
        </button>
        <!-- 删除按钮只在店铺table里面有 -->
        {{# if(d.publishInterval){ }}
            <button class="layui-btn layui-btn-sm layui-btn-danger" style="padding: 0 6px;"
                    lay-event="delete"><i class="layui-icon">&#xe640;</i>
            </button>
        {{# } }}
    </permTag:perm>
    <permTag:lacksPerm funcCode="shopee_rules_list_edit">
        <button class="layui-btn layui-btn-sm layui-btn-disabled" disabled lay-event="remark"
                style="padding: 0 6px;"><i class="layui-icon">&#xe642;</i>
        </button>
        <!-- 删除按钮只在店铺table里面有 -->
        {{# if(d.publishInterval){ }}
            <button class="layui-btn layui-btn-sm layui-btn-danger layui-btn-disabled" disabled
                    style="padding: 0 6px;" lay-event="delete"><i class="layui-icon">&#xe640;</i>
            </button>
        {{# } }}
        </permTag:lacksPerm>
        <!-- 关闭状态下才能删除 规则删除 -->
        {{# if(d.status ==0 && !d.publishInterval){ }}
            <permTag:perm funcCode="shopee_rules_list_edit">
                <button type="button" id="shopeeRules_addCopyBtn" lay-event="ruleDel"
                        class="layui-btn layui-btn-sm layui-btn-danger">删除
                </button>
            </permTag:perm>
        {{# } }}
</script>

// 已删除规则
<script type="text/html" id="shopeerules_tabletemplet_deloptionbtn">
    <input type="hidden" class="shopeeRules_IdInp" value="{{d.id}}">
    <button type="button" lay-event="readonly" class="layui-btn layui-btn-sm" style="background-color: #35a9ff">查看</button>
    <permTag:perm funcCode="shopeeRules_addCopyBtn">
        <button type="button" id="shopeeRules_addCopyBtn" lay-event="addCopy"
                class="layui-btn layui-btn-sm" style="background-color: #35a9ff">复制
        </button>
    </permTag:perm>
</script>

<script type="text/html" id="shopeerules_tabletemplet_count">
<a lay-event="shopeerules_tabletemplet_count" style="color:#1E90FF;cursor:pointer;">{{d.storeNums}}</a>
</script>

                        <%--移除店铺--%>
                            <script type="text/html" id="shopee_layer_removestore">
<div class="layui-card">
    <div class="layui-card-body">
        <form class="layui-form" id="shopee_layer_removestore_form">
            <div class="layui-form-item">
                <label class="layui-form-label">卖家简称列表</label>
                <div class="layui-input-block">
                    <textarea class="layui-textarea allStoreName" placeholder="请输入需要删除的店铺名，多个店铺用回车换行"></textarea>
                </div>
            </div>
        </form>
    </div>
</div>
</script>

                            <script type="text/html" id="shopeeRules_addCopy_layer">
<div class="p20">
    <div class="layui-tab-content">
        <div class="layui-tab-item layui-show p20">
            <form class="layui-form" lay-filter="shopeeRules_addCopy_form" id="shopeeRules_addCopy_form"
                  autocomplete="off">
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">站点</label>
                        <div class="layui-input-inline">
                            <select id="shopeeRules_addCopy_salesSite_sel"  name="siteIdList" xm-select="shopeeRules_addCopy_salesSite_sel" xm-select-search
                                    xm-select-search-type="dl" xm-select-skin="normal"
                                    lay-filter='shopeeRules_addCopy_salesSite_sel'>
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</script>
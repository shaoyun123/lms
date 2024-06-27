<%--
  Created by IntelliJ IDEA.
  User: shaohuiyun
  Date: 2021/6/18
  Time: 14:22
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>wish&joom刊登规则</title>
<style>
    .wishrules_dis_flex {
        display: flex;
        justify-content: space-between;
    }

    .wishrules_width45 {
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

</style>
<div class="layui-fluid" id="">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="wishrules_searchForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">规则名称</label>
                                <div class="layui-input-block">
                                    <input class="layui-input" name="ruleName">
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select id="wishrules_storeAcctIds" name="storeAcctIds" xm-select="storeAcctIds" xm-select-search="" xm-select-search-type="dl" xm-select-skin="normal">
                                        <option></option>
                                    </select>
                                </div>
                            </div>
                            <%--<div class="layui-col-md3 layui-col-lg2">--%>
                                <%--<label class="layui-form-label">站点</label>--%>
                                <%--<div class="layui-input-block">--%>
                                    <%--<select id="siteIds" name="siteIds">--%>
                                        <%--<option></option>--%>
                                    <%--</select>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
                                    <select name="status">
                                        <option value=""></option>
                                        <option value="true">已开启</option>
                                        <option value="false">已关闭</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md3 layui-col-lg2">
                                <label class="layui-form-label">创建人</label>
                                <div class="layui-input-block">
                                    <select id="wishrules_creator" name="creator">
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
                                <div class="layui-input-block">
                                    <button id="wishrules_searchBtn" class="layui-btn layui-btn-sm" type="button">查询
                                    </button>

                                    <button id="wishrules_resetBtn" class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-body">
                    <permTag:perm funcCode="wish_rules_list_edit">
                        <a class="layui-btn layui-btn-sm" id="wishrules_btn_addrules">添加规则</a>
                    </permTag:perm>
                    <table class="layui-table" id="wishrules_table_addrules"
                           lay-filter="wishrules_table_addrules"></table>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="${ctx}/static/tagsinput/tagsinput.js"></script>
<script type="text/javascript" src="${ctx}/static/layui/layui-xtree.js"></script>
<script type="text/javascript" src="${ctx}/static/js/publishs/wish/wishrules.js"></script>
<%--添加规则弹框--%>
<script type="text/html" id="wishrules_layer_addrules">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" lay-filter="wishrules_form_addrules" id="wishrules_form_addrules">
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">规则名称</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="ruleName">
                        </div>
                    </div>
                    <%--<div class="layui-col-md4 layui-col-lg4">--%>
                        <%--<label class="layui-form-label">WISH站点</label>--%>
                        <%--<div class="layui-input-block">--%>
                            <%--<select id="siteCode" name="siteCode">--%>
                                <%--<option></option>--%>
                            <%--</select>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">状态</label>
                        <div class="layui-input-block">
                            <input type="radio" name="status" value="true" title="已启用" checked>
                            <input type="radio" name="status" value="false" title="已停用">
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
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">刊登日期</label>
                        <div class="layui-input-block">
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
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">商品类目</label>
                        <div class="layui-input-block">
                            <div class="wishCateTreeIsShow">
                                <ul id="wishrulesCateTree" class="ztree"></ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">商品标签</label>
                    <div class="layui-input-block">
                        <select id="prodAttrList" xm-select="prodAttrList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">物流属性</label>
                    <div class="layui-input-block">
                        <select id="logisAttrList" xm-select="logisAttrList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12">
                    <label class="layui-form-label">商品归属人</label>
                    <div class="layui-input-block">
                        <%--<select id="bizzOwnerIdList" xm-select="bizzOwnerIdList" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">--%>
                        <%--</select>--%>
                        <input class="layui-input" id="bizzOwnerIdList" name="bizzOwnerIdList" placeholder="英文逗号分隔" onblur="handleSku(this.value,event)">
                    </div>
                </div>
                <div class="layui-col-md12 layui-col-lg12 mb10">
                    <label class="layui-form-label">模板SKU</label>
                    <div class="layui-input-block">
                        <textarea class="layui-textarea" placeholder="英文逗号分隔"
                                  name="modelPSku"></textarea>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">模板审核时间</label>
                        <div class="layui-input-block wishrules_dis_flex">
                            <input class="layui-input" name="auditDays">
                            <div style="width:130%;margin-top: 5px;">天内</div>
                        </div>
                    </div>
                    <div class="layui-col-md6 layui-col-lg6">
                        <label class="layui-form-label">30天销量</label>
                        <div class="layui-input-block disflex">
                            <div class="w200 disflex">
                                <input type="number" name="thirtySalesStart" class="layui-input " min="0" placeholder="大于等于"
                                    onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                    onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                >
                                <input type="number" name="thirtySalesEnd" class="layui-input" min="0" placeholder="小于"
                                    onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                    onblur="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                                >
                            </div>
                        </div> 
                    </div>
                </div>
                <div class="layui-form-item">
                    
                </div>
                <%--<div class="layui-form-item">--%>
                    <%--<div class="layui-col-md4 layui-col-lg4">--%>
                        <%--<label class="layui-form-label">仓库</label>--%>
                        <%--<div class="layui-input-block wishrules_dis_flex">--%>
                            <%--<select name="warehouseId">--%>
                                <%--<option value="0">国内仓</option>--%>
                                <%--<option value="1">虚拟仓</option>--%>
                            <%--</select>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                <%--</div>--%>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">成本(RMB)</label>
                        <div class="layui-input-block wishrules_dis_flex">
                            <input class="layui-input wishrules_width45" placeholder="大于等于" name="costMin" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                            <input class="layui-input wishrules_width45" placeholder="小于等于" name="costMax" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                        </div>
                    </div>
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">重量(克)</label>
                        <div class="layui-input-block wishrules_dis_flex">
                            <input class="layui-input wishrules_width45" placeholder="大于等于" name="weightMin" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                            <input class="layui-input wishrules_width45" placeholder="小于等于" name="weightMax" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <div class="wishrules_dis_flex">
                            <select name="wishrules_sel_expectedStock" lay-filter="wishrules_sel_expectedStock" lay-search="">
                                <option value="0">预计可用含在途大于</option>
                                <option value="1">预计可用不含在途大于</option>
                            </select>
                            <input class="layui-input wishrules_dis_flex" name="expectedStockOnway">
                            <input class="layui-input wishrules_dis_flex" name="expectedStockExway">
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
                                禁售状态=未禁售，在售状态：仅过滤停售且预计可用库存含在途小于等于0的sku，侵权状态=所有平台都不侵权，店铺刊登状态=未刊登
                            </p>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md4 layui-col-lg4">
                        <label class="layui-form-label">获取数据顺序</label>
                        <div class="layui-input-block">
                            <select name="orderField">
                                <option value="1">审核时间倒序</option>
                                <option value="2">审核时间正序</option>
                                <option value="3">7天销量倒序</option>
                                <option value="4">30天销量倒序</option>
                                <option value="5">shopee30天销量倒序</option>
                                <option value="6">SMT30天销量倒序</option>
                                <option value="7">joom30天销量倒序</option>
                                <option value="8">wish30天销量倒序</option>
                                <option value="9">joom主流国家7天销量倒序</option>
                                <option value="10">joom主流国家30天销量倒序</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="layui-form-item">
                    <label class="layui-form-label redStar">刊登方式</label>
                    <div class="layui-input-block wishrules_ruleType_radio">
                        <input type="radio" name="ruleType" value="1" title="刊登店铺配置数量" lay-filter="wishrules_addRule_ruleType">
                        <input type="radio" name="ruleType" value="2" title="刊登模板配置数量" lay-filter="wishrules_addRule_ruleType">
                    </div>
                </div>
                <div class="layui-form-item disFCenter" id="wishrules_listingNum">
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
                        <label class="layui-form-label">模板在线上限</label>
                        <div class="layui-input-block w100">
                            <input type="number" class="layui-input" name="listingMaxNum" title="模板在线上限" 
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
<%--移除店铺--%>
<script type="text/html" id="wish_layer_removestore">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="wish_layer_removestore_form">
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
<%--设置店铺--%>
<script type="text/html" id="wishrules_layer_storemanage">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="wishrules_dis_flex">
                <div>刊登规则：<span class="storemanage_name"></span></div>
                <div class="wishrules_dis_flex"><permTag:perm funcCode="wish_rules_list_store">
                    <button class="layui-btn layui-btn-sm" id="wishrules_storemanage_storeaddbtn">添加店铺</button>
                </permTag:perm>
                <input type="hidden" value="" class="wishrules_storemanage_id">
                <permTag:perm funcCode="wish_rules_list_store">
                    <button class="layui-btn layui-btn-sm" id="wishrules_storemanage_removebtn" style="margin: 0 10px;">批量移除店铺</button></div>
                </permTag:perm>
            </div>
            <table class="layui-table" lay-filter="wishrules_table_storemanage"
                   id="wishrules_table_storemanage"></table>
        </div>
    </div>
</script>
<%--添加店铺--%>
<script type="text/html" id="wishrules_layer_storeadd">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" lay-filter="wishrules_layer_storeadd" id="wishrules_storeadd">
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">店铺名</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="storeNameStr">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">在线库存</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="stock" lay-verify="required" type="number" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                    </div>
                </div>
                <%--<div class="layui-form-item">--%>
                    <%--<label class="layui-form-label">是否开启引流</label>--%>
                    <%--<div class="layui-input-block">--%>
                        <%--<input type="checkbox" name="allowAttract" lay-skin="primary" title="开启引流">--%>
                    <%--</div>--%>
                <%--</div>--%>
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">每天刊登量</label>
                    <div class="layui-input-block">
                        <input class="layui-input" name="dailyPublishNums" type="number" min="0" max="500" lay-verify="required" onkeyup="if(this.value && ! /^(500|[1-4]{0,1}\d{0,1}\d)$/.test(this.value)){alert('只能输入0-500之间的数字');this.value='';}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label redStar">上架开始时间</label>
                    <div class="layui-input-block">
                        <select name="publishTime">
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
                    <label class="layui-form-label">上架间隔时间</label>
                    <div class="layui-input-block">
                        <select name="publishInterval">
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
<!--规则状态的开启和关闭-->
<script type="text/html" id="wishrules_tabletemplet_type">
    <permTag:perm funcCode="wish_rules_list_edit">
        <div class="layui-form-item">
            {{# if(d.status){ }}
            <input type="checkbox" lay-skin="switch"
                   lay-filter="wishrules_orderDownloadStatus" value="{{d.id}}" checked>
            {{# }else{ }}
            <input type="checkbox" lay-skin="switch"
                   lay-filter="wishrules_orderDownloadStatus" value="{{d.id}}">
            {{# } }}
        </div>
    </permTag:perm>
    <permTag:lacksPerm funcCode="wish_rules_list_edit">
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
<script type="text/html" id="wishrules_tabletemplet_optionbtn">
    <permTag:perm funcCode="wish_rules_list_edit">
        <button class="layui-btn layui-btn-sm" lay-event="copy" style="padding: 0 6px;" title="复制"><img width="15" src="${ctx}/static/img/copy.png">
        </button>
        <button class="layui-btn layui-btn-sm" lay-event="remark" style="padding: 0 6px;" title="编辑"><i class="layui-icon">&#xe642;</i>
        </button>
        <button class="layui-btn layui-btn-sm layui-btn-danger" style="padding: 0 6px;" lay-event="delete" title="删除"><i class="layui-icon">&#xe640;</i>
        </button>
    </permTag:perm>
    <permTag:lacksPerm funcCode="wish_rules_list_edit">
        <button class="layui-btn layui-btn-sm layui-btn-disabled" disabled lay-event="copy" style="padding: 0 6px;"><img width="15" src="${ctx}/static/img/copy.png"></button>
        <button class="layui-btn layui-btn-sm layui-btn-disabled" disabled lay-event="remark" style="padding: 0 6px;"><i class="layui-icon">&#xe642;</i>
        </button>
        <button class="layui-btn layui-btn-sm layui-btn-danger layui-btn-disabled" disabled lay-event="delete" style="padding: 0 6px;"><i class="layui-icon">&#xe640;</i>
        </button>
    </permTag:lacksPerm>
    <button class="layui-btn layui-btn-sm" lay-event="log" style="padding: 0 6px;" title="日志">日志</button>
</script>


<script type="text/html" id="wishrules_tabletemplet_count">
    <a lay-event="wishrules_tabletemplet_count" style="color:#1E90FF;cursor:pointer;">{{d.storeNums}}</a>
</script>



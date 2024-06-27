<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>商品注册</title>

<div class="layui-fluid" id="LAY-winitregist">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="winitregistForm" lay-filter="winitregistForm" onsubmit="return false">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">产品类目</label>
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-primary"
                                            id="winitregist_searchCate_btn">选择分类
                                    </button>
                                    <input type="hidden" name="cateId" value="" id="winitregist_cateId_search_inp">
                                    <i class="layui-icon layui-icon-delete"
                                       onclick="clearCate('winitregist_search_cate','winitregist_cateId_search_inp')"
                                       style="cursor:pointer" title="删除产品类目"></i>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchType" lay-filter="skuTypeSelect_winitregist" class="hiddenContent">
                                        <option value="sSku">子SKU</option>
                                        <option value="sSku2">子SKU(精确)</option>
                                        <option value="pSku">父SKU</option>
                                        <option value="pSku2">父SKU(精确)</option>
                                        <option value="cnName">中文名称</option>
                                        <option value="enName">英文名称</option>
                                        <option value="recommendReason">推荐理由</option>
                                        <option value="registFailMsg">失败原因</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" maxlength="2000" name="searchValue" id="product_tpl_searchSKU_input" autocomplete="off">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="isSale">
                                        <option value="">全部</option>
                                        <option value="true">在售</option>
                                        <option value="false">停售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2" id="orgs_hp_devPerson_winitregistForm">
                                <div class="layui-form-label labelSel">
                                    <select name="bizzOwnerOrganize" lay-filter="orgs_hp_devPerson_winitregist" class="orgs_hp_custom" data-id="winitregist_devPerson" data-title="开发专员部门" >
                                        <option value="">开发专员部门</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <select name="bizzOwnerIdListStr" lay-filter="users_hp_devPerson_winitregist" lay-search="" class="users_hp_custom" data-title="开发专员" data-id="winitregist_devPerson" data-roleList="开发专员" xm-select="users_hp_devPerson_winitregist" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                        <option value="">开发专员</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-form-label labelSel">
                                    <select name="searchTimeType" class="hiddenContent">
                                        <option value="1">创建时间</option>
                                        <option value="2">发布时间</option>
                                        <option value="3">审核时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" autocomplete="off" id="winitregist_time"
                                           name="searchTime">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="orderBy" class="hiddenContent">
                                        <option value="t1.id desc">创建时间倒序</option>
                                        <option value="t1.id asc">创建时间正序</option>
                                        <option value="t1.audit_time desc">审核时间倒序</option>
                                        <option value="t1.audit_time asc">审核时间正序</option>
                                        <option value="t2.thirty_sales desc">30天销量倒序</option>
                                        <option value="t2.thirty_sales asc">30天销量正序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2 auditSearchCondition">
                                <label class="layui-form-label">尺寸信息</label>
                                <div class="layui-input-block">
                                    <select name="ifHasSize">
                                        <option value=""></option>
                                        <option value="true">有</option>
                                        <option value="false">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">组合品</label>
                                <div class="layui-input-block">
                                    <select name="isCombination">
                                        <option value=""></option>
                                        <option value="true">是</option>
                                        <option value="false">否</option>
                                    </select>
                                </div>
                            </div>
                            <div id="registSearchCondition" class="disN">
                                <div class="layui-col-md2 layui-col-lg2" id="orgs_hp_saler_winitregistForm">
                                    <div class="layui-form-label labelSel">
                                        <select name="salerOrganize" lay-filter="orgs_hp_saler_winitregist" class="orgs_hp_custom" data-id="winitregist_saler" data-title="销售员部门">
                                            <option value="">销售员部门</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <select name="salerIdListStr" lay-filter="users_hp_saler_winitregist" lay-search="" class="users_hp_custom" data-title="万邑通专员" data-id="winitregist_saler" data-roleList="万邑通专员"  xm-select="users_hp_saler_winitregist" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                            <option value="">万邑通专员</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">销售渠道</label>
                                    <div class="layui-input-block">
                                        <select name="channelListStr" xm-select="winitregist_searchForm_channelListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='winitregist_searchForm_channelListStr'>
                                            <option value="">全部</option>
                                            <c:forEach items="${channelList}" var="channel">
                                                <option value="${channel.channel}" data-plat="${channel.platCode}">${channel.channel}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div id="winitregister_Form_channelDiv" class="disN">
                                    <option value="">全部</option>
                                    <c:forEach items="${channelList}" var="channel">
                                        <option value="${channel.channel}" data-plat="${channel.platCode}">${channel.channel}</option>
                                    </c:forEach>
                                </div>

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">服务商</label>
                                    <div class="layui-input-block">
                                        <select name="serviceTypeListStr" xm-select="winitregist_searchForm_serviceTypeListStr" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-filter='winitregist_searchForm_serviceTypeListStr'>
                                            <option value="">全部</option>
                                            <option value="1">万邑通</option>
                                            <option value="2">谷仓</option>
                                            <option value="3">递四方</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">商品有效</label>
                                    <div class="layui-input-block">
                                        <select name="ifEffective">
                                            <option value="">全部</option>
                                            <option value="true">是</option>
                                            <option value="false">否</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">禁止入库</label>
                                    <div class="layui-input-block">
                                        <select name="ifProhibitInStock">
                                            <option value=""></option>
                                            <option value="true">是</option>
                                            <option value="false">否</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">注册失败原因</label>
                                    <div class="layui-input-block">
                                       <input class="layui-input" name="registerRemark">
                                    </div>
                                </div>
                                <div class="layui-col-lg2 layui-col-md2">
                                    <div class="layui-form-label labelSel">
                                        <select name="registSearchTimeType" class="hiddenContent">
                                            <option value="1">万邑通审核时间</option>
                                            <option value="2">万邑通更新时间</option>
                                            <option value="3">失效时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" autocomplete="off" id="winitregist_time2"
                                               name="registSearchTime">
                                    </div>
                                </div>
                            </div>

                            <input class="disN hiddenContent" type="text" name="auditStatus" value="0">
                            <input class="disN hiddenContent" type="text" name="registStatus" value="">
                            <div class="layui-col-md2 layui-col-lg2" style="padding-left:32px;margin-top:2px">
                                <button id="winitregist_searchBtn" class="layui-btn layui-btn-sm keyHandle">搜索</button>
                                <button id="winitregist_searchReset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                            </div>
                        </div>
                        <div class="layui-col-l12 layui-col-md12" id="winitregist_search_cate"></div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header">
                    <div class="">
                        <div class="fl">
                            <div class="layui-tab" lay-filter="winitregist_Tab" id="winitregist_Tab">
                                <ul class="layui-tab-title">
                                    <li data-type="auditStatus" data-status="0" class="layui-this">待发布<span></span></li>
                                    <li data-type="auditStatus" data-status="1">待审核<span></span></li>
                                    <li data-type="auditStatus" data-status="2">审核通过<span></span></li>
                                    <li data-type="auditStatus" data-status="3">审核失败<span></span></li>
                                    <li data-type="registStatus" data-status="1">注册中<span></span></li>
                                    <li data-type="registStatus" data-status="2">注册成功<span></span></li>
                                    <li data-type="registStatus" data-status="3">注册失败<span></span></li>
                                </ul>
                            </div>
                        </div>
                        <div class="fr">
                            <%--<div class="layui-btn layui-btn-sm" id="winitregist_initDataBtn">初始化数据</div>--%>
                            <div id="winitregist_auditBtn">
                                <permTag:perm funcCode="winitregist_updateBatteryInfo">
                                    <div class="layui-btn layui-btn-sm" id="winitregist_updateBatteryInfoBtn">修改电池信息</div>
                                </permTag:perm>

                                <permTag:perm funcCode="winitregist_addProd">
                                    <input type="file" class="disN" id="winitregist_addProdExcel">
                                    <div class="layui-btn layui-btn-sm" id="winitregist_downTemplateBtn" onclick="window.location.href = ctx + '/static/templet/addWinitProdTemplate.xlsx'">下载模板</div>
                                    <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitregist_addProdByExcelBtn">导入新增</div>
                                    <div class="layui-btn layui-btn-sm" id="winitregist_addProdBtn">新增商品</div>
                                </permTag:perm>
                                <permTag:perm funcCode="winitregist_releaseProd">
                                    <div class="layui-btn layui-btn-sm" id="winitregist_releaseListBtn">批量发布</div>
                                </permTag:perm>
                                <permTag:perm funcCode="winitregist_deleteProd">
                                    <div class="layui-btn layui-btn-sm layui-btn-danger" id="winitregist_deleteListBtn">批量删除</div>
                                </permTag:perm>
                                <permTag:perm funcCode="winitregist_auditProd">
                                    <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitregist_auditListBtn">批量审核</div>
                                </permTag:perm>
                            </div>
                            <div class="disN" id="winitregist_registBtn">
                                <permTag:perm funcCode="winitregist_changeEffective">
                                    <div class="layui-btn layui-btn-sm layui-btn-warm" id="winitregist_setUnEffectiveByListBtn">有效变更</div>
                                </permTag:perm>
                                <permTag:perm funcCode="winitregist_registerWinit">
                                    <div class="layui-btn layui-btn-sm" id="winitregist_registerWinitBtn">注册海外仓</div>
                                </permTag:perm>
                                <permTag:perm funcCode="winitregist_syncRegisterResult">
                                    <div class="layui-btn layui-btn-sm" id="winitregist_syncRegisterResultBtn">同步注册结果</div>
                                </permTag:perm>
                                <permTag:perm funcCode="winitregist_syncWinitProdInfo">
                                    <div class="layui-btn layui-btn-sm" id="winitregist_syncWinitProdInfoBtn">同步海外仓商品信息</div>
                                </permTag:perm>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-card-body">
                    <table lay-filter="winitregist_table" class="layui-table" id="winitregist_table"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script id="winitregist_tab_image" type="text/html">
    {{#  if(typeof(d.prodSInfo.image) !="undefined"){ }}
    <img width="60" height="60" data-original="${tplIVP}{{ d.prodSInfo.image }}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{#  } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()" />
    {{# } }}
</script>

<script id="winitregist_tab_sku" type="text/html">
    <div>{{d.prodSInfo.sSku}}</div>
    <div><span class="secondary">父:</span>{{d.prodPInfo.pSku}}</div>
    {{#  if(d.prodSInfo.logisAttrList!=undefined && d.prodSInfo.logisAttrList!=''){ }}
    {{# var logisAttrArr = d.prodSInfo.logisAttrList.split(',')}}
    {{# var alia}}
    {{# for (var i = 0; i < logisAttrArr.length; ++i) { }}
    {{# alia = winitregist_getColorOfLogis(logisAttrArr[i])}}
    {{#  if(alia && alia != '普'){ }}
    <span class="layui-bg-red hp-badge ml5" title="物流属性: {{logisAttrArr[i]}}">{{alia}}</span>
    {{#}}}
    {{#}}}
    {{#  } }}
</script>

<script id="winitregist_tab_isSale" type="text/html">
    <input type="checkbox" lay-skin="primary" disabled {{ d.prodSInfo.isSale ? 'checked' : '' }}><br>
</script>

<script id="winitregist_tab_desc" type="text/html">
    <div>{{d.prodSInfo.purchaseChannel}}</div>
    <div><span class="secondary">分类: </span>{{d.prodCate.cateCnName}}</div>
    <div><div class="canClickEl" lay-event="editCompAndRecommendReason">竞品链接</div></div>
</script>

<script id="winitregist_tab_desc_forRegist" type="text/html">
    <div>{{d.prodSInfo.purchaseChannel}}</div>
    <div><span class="secondary">分类: </span>{{d.prodCate.cateCnName}}</div>
    <div><div class="canClickEl" lay-event="editCompAndRecommendReasonForRegisterFail">竞品链接</div></div>
</script>

<script id="winitregist_tab_responsor" type="text/html">
    <div class="alignLeft">
        <div><span class="secondary">开发: </span>{{d.prodPInfo.bizzOwner || ''}}({{d.bizzOwnerOrg || ''}})</div>
        <div><span class="secondary">采购: </span>{{d.prodSInfo.buyer || ''}}</div>
    </div>
</script>

<script id="winitregist_tab_sales" type="text/html">
    <div class="alignLeft">
        <div><span class="secondary">7日: </span>{{d.prodSInfo.sevenSales || ''}}</div>
        <div><span class="secondary">15日: </span>{{d.prodSInfo.fifteenSales || ''}}</div>
        <div><span class="secondary">30日: </span>{{d.prodSInfo.thirtySales || ''}}</div>
    </div>
</script>

<script id="winitregist_tab_cost" type="text/html">
    <div lay-event="showPrePublishPrice" class="canClickEl">{{accAdd(d.prodSInfo.purchaseCostPrice,d.prodSInfo.innerPackCost)}}</div>
</script>

<script id="winitregist_tab_weight" type="text/html">
    <div class="alignLeft">
        <div><span class="secondary">实重: </span>{{accAdd(d.prodSInfo.suttleWeight, d.prodSInfo.packWeight)}}</div>
        <div><span class="secondary">抛重(5): </span>{{accDiv(accMul(accMul(d.prodSInfo.winitLength || 0, d.prodSInfo.winitWidth || 0), d.prodSInfo.winitHeight),5).toFixed(2)}}</div>
        <div><span class="secondary">抛重(6): </span>{{accDiv(accMul(accMul(d.prodSInfo.winitLength || 0, d.prodSInfo.winitWidth || 0), d.prodSInfo.winitHeight),6).toFixed(2)}}</div>
        <div><span class="secondary">抛重(8): </span>{{accDiv(accMul(accMul(d.prodSInfo.winitLength || 0, d.prodSInfo.winitWidth || 0), d.prodSInfo.winitHeight),8).toFixed(2)}}</div>
    </div>
</script>

<script id="winitregist_tab_size" type="text/html">
    <div class="alignLeft">
        <div><span class="secondary">包裹长: </span>{{d.prodSInfo.winitLength || ''}}</div>
        <div><span class="secondary">包裹宽: </span>{{d.prodSInfo.winitWidth || ''}}</div>
        <div><span class="secondary">包裹高: </span>{{d.prodSInfo.winitHeight || ''}}</div>
        <%--<div><span class="secondary">压缩高: </span>{{d.prodSInfo.compressHeight || ''}}</div>--%>
        <%--<div><span class="secondary">叠加高: </span>{{d.prodSInfo.superpositionHeight || ''}}</div>--%>
        </div>
</script>

<script id="winitregist_tab_recommendReason" type="text/html">
    <div class="followRemarkBox"  onmouseover="showTip(`{{d.prodPInfo.recommendReason || ''}}`, this)" onmouseleave="removeTip(this)" >{{d.prodPInfo.recommendReason || '' }}</div>
</script>
<script id="winitregist_tab_auditRemark" type="text/html">
    <div class="followRemarkBox"  onmouseover="showTip(`{{d.auditRemark || ''}}`, this)" onmouseleave="removeTip(this)" >{{d.auditRemark || '' }}</div>
</script>

<script id="winitregist_tab_registerFailReason" type="text/html">
    <div class="followRemarkBox"  onmouseover="showTip(`{{d.siteInfo.syncProdInfo.registerRemark || ''}}`, this)" onmouseleave="removeTip(this)" >{{d.siteInfo.syncProdInfo.registerRemark || '' }}</div>
</script>
<script id="winitregist_tab_suggestSendAmt" type="text/html">
    <div class="alignLeft">
    {{#for (let i = 0; i < d.suggestAmtInfoList.length; ++i) {}}
        {{# if (d.suggestAmtInfoList[i].suggestSendAmt) {}}
            <div><span>{{d.suggestAmtInfoList[i].channel}}: </span>{{d.suggestAmtInfoList[i].suggestSendAmt}}</div>
        {{# } }}
    {{# } }}
    </div>
    <div title="编辑建议发货数量" lay-event="editSuggestSendAmt"><i class="layui-icon layui-icon-edit" style="color: #009688;cursor: pointer;">&#xe642;</i></div>
</script>

<script id="winitregist_tab_stockNum" type="text/html">
    {{# if (d.whStock) {}}
    <div>{{accSub(d.whStock.currentStock || 0,d.whStock.reservationStock || 0)}}/{{d.whStock.onwayStock || 0}}/{{d.whStock.lackUnreservationStock || 0}}</div>
    {{# } }}
</script>

<script id="winitregist_tab_time" type="text/html">
    <div class="alignLeft">
        <div><span class="secondary">创建:</span>{{Format(d.createTime,'yyyy-MM-dd')}}</div>
        <div><span class="secondary">发布:</span>{{Format(d.releaseTime,'yyyy-MM-dd')}}</div>
        <div><span class="secondary">审核:</span>{{Format(d.auditTime,'yyyy-MM-dd')}}</div>
    </div>
</script>

<script type="text/html" id="winitRegist_updateBatteyInfoPop">
    <div class="layui-card">
        <div class="layui-card-body">
            <form class="layui-form" id="winitRegist_updateBatteyInfoForm" lay-filter="winitRegist_updateBatteyInfoForm">
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">电池种类</label>
                        <div class="layui-input-block">
                            <select name="batteryTypeId">
                                <option></option>
                                <c:forEach items="${baterryTypeIdList}" var="type">
                                    <option value="${type.code}" >${type.name}</option>
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">电池包装</label>
                        <div class="layui-input-block">
                            <select name="batteryPackId">
                                <option></option>
                                <c:forEach items="${baterryPackIdList}" var="pack">
                                    <option value="${pack.code}" >${pack.name}</option>
                                </c:forEach>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-md12 layui-col-lg12">
                        <label class="layui-form-label">电池功率</label>
                        <div class="layui-input-block">
                           <input class="layui-input" name="batteryPower" type="number">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</script>

<script id="winitregist_tab_toolBar_audit" type="text/html">
    {{# if (d.auditStatus === 0 || d.auditStatus === 3) {}}
    <permTag:perm funcCode="winitregist_releaseProd">
        <div class="mb5"><div class="layui-btn layui-btn-sm" lay-event="release">发布</div></div>
    </permTag:perm>
    {{# } }}
    {{# if (d.auditStatus === 0) {}}
    <permTag:perm funcCode="winitregist_deleteProd">
    <div class="mb5"><div class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</div></div>
    </permTag:perm>
    {{# } }}
    <%--<permTag:perm funcCode="winitregist_updateProd">--%>
    <%--<div class="mb5"><div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="editCompAndRecommendReason">修改</div></div>--%>
    <%--</permTag:perm>--%>
    {{# if (d.auditStatus > 0) {}}
    <permTag:perm funcCode="winitregist_auditProd">
    <div class="mb5"><div class="layui-btn layui-btn-sm" lay-event="audit">审核</div></div>
    </permTag:perm>
    {{# } }}
    <div class="mb5"><div class="layui-btn layui-btn-sm" lay-event="getLogs">日志</div></div>
    <div class="mb5"><span class="layui-btn layui-btn-sm layui-btn-normal" lay-event="setprice">定价</span></div>
</script>

<permTag:perm funcCode="winitregist_updateProd">
    <div id="winitregist_updateProdPower"></div>
</permTag:perm>

<script id="winitregist_tab_toolBar_register" type="text/html">
    {{# if (d.siteInfo.ifEffective) {}}
    <permTag:perm funcCode="winitregist_changeEffective">
        <div class="mb5"><div class="layui-btn layui-btn-sm layui-btn-warm" lay-event="uneffective">失效</div></div>
    </permTag:perm>
    {{# } }}
    {{# if (!d.siteInfo.ifEffective) {}}
    <permTag:perm funcCode="winitregist_changeEffective">
        <div class="mb5"><div class="layui-btn layui-btn-sm" lay-event="effective">有效</div></div>
    </permTag:perm>
    {{# } }}
    {{# if (d.siteInfo.syncProdInfo.registerStatus === 3) {}}
    <permTag:perm funcCode="winitregist_registerWinit">
        <div class="mb5"><div class="layui-btn layui-btn-sm" lay-event="register">注册</div></div>
    </permTag:perm>
    {{# } }}
    {{# if (d.siteInfo.syncProdInfo.registerStatus === 2) { }}
    <span class="layui-btn layui-btn-sm layui-btn-normal" lay-event="setprice">定价</span>
    {{# } }}
</script>

<%--新增商品弹窗--%>
<script id="winitregist_addProductLayer" type="text/html">
    <div class="p20">
    <form class="layui-form" id="winitregist_addProdForm" lay-filter="winitregist_addProdForm">
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
                        <table class="layui-table" id="winitregist_prodSInfoTable"  lay-filter="winitregist_prodSInfoTable" ></table>
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
                        <tbody class="layui-form winitregist_compTab_addProductLayer" lay-filter="winitregist_compTab_addProductLayer" style="text-align: center">
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

<script id="winitregist_editCompLayer" type="text/html">
    <div class="p20">
        <form class="layui-form" id="winitregist_editCompForm">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div>
                        <table class="layui-table winitregist_addProd_compTable">
                            <thead>
                            <tr>
                                <th width="150px">销售渠道<font color="red">*</font></th>
                                <th>链接<font color="red">*</font></th>
                                <th width="150px">操作</th>
                            </tr>
                            </thead>
                            <tbody class="layui-form winitregist_compTab_addProductLayer" lay-filter="winitregist_compTab_addProductLayer" style="text-align: center">
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
                    <div class="layui-col-lg12 layui-col-md12 disN" notNull id="declareValueEditDiv">
                        <label class="layui-form-label">申报价值</label>
                        <div class="layui-input-block">
                            <input class="layui-input" name="importDeclareValue">
                        </div>
                    </div>
                    <div class="layui-col-lg12 layui-col-md12 disN" id="winitDescriptionDiv">
                        <label class="layui-form-label">注册备注</label>
                        <div class="layui-input-block">
                            <textarea placeholder="请输入内容" class="layui-textarea" name="winitDescription" maxlength="255"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<script id="winitregist_editSuggestSendAmtLayer" type="text/html">
    <div class="p20">
        <form class="layui-form" id="winitregist_editSuggestSendAmtForm" lay-filter="winitregist_editSuggestSendAmtForm">
            <div class="layui-row layui-col-space15">
                <div class="layui-form-item">
                    <div class="layui-col-lg12 layui-col-md12">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <table class="layui-table" id="winitregist_suggestSendAmtTable"  lay-filter="winitregist_suggestSendAmtTable" ></table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">计划德国信件</label>
                        <div class="layui-input-block">
                            <input type="checkbox" lay-skin="primary" name="ifDELetterMeasure" />
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">计划英国信件</label>
                        <div class="layui-input-block">
                            <input type="checkbox" lay-skin="primary" name="ifUKLetterMeasure" />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="winitregist_addProd_channel">
    <table width="100%">
        {{# for(var i = 0; i < d.suggestAmtInfoList.length; ++i){ }}
        <tr>
            <td>{{ d.suggestAmtInfoList[i].channel }}</td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/html" id="winitregist_addProd_suggestSendAmt">
    <table width="100%">
        {{# for(var i = 0; i < d.suggestAmtInfoList.length; ++i){ }}
        <tr>
            <td><input type="number" name="suggestSendAmt" data-prodSId="{{d.suggestAmtInfoList[i].prodSId}}" data-channel="{{d.suggestAmtInfoList[i].channel}}" value="{{ d.suggestAmtInfoList[i].suggestSendAmt }}"></td>
        </tr>
        {{# } }}
    </table>
</script>

<script type="text/javascript" src="${ctx}/static/js/wyt/info/winitregist.js?v=${ver}"></script>

<div class="disN" id="winitregist_logisAttrList">
    <c:forEach items="${logisAttrList}" var="logisAttr">
        <option value="${logisAttr.name}" alias="${logisAttr.alias}">${logisAttr.name}</option>
    </c:forEach>
</div>

<script type="text/html" id="winitregist_auditPop">
    <div class="p20">
        <form class="layui-form" id="winitregist_auditForm" lay-filter="winitregist_auditForm">
            <div class="layui-col-lg12 layui-col-md12" notNull>
                <label class="layui-form-label">审核结果</label>
                <div class="layui-input-block">
                    <div class="layui-col-lg5 layui-col-md5">
                        <input name="auditStatus" type="radio" title="审核通过" value="true">
                    </div>
                    <div class="layui-col-lg5 layui-col-md5">
                        <input name="auditStatus" type="radio" title="审核失败" value="false">
                    </div>
                </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12">
                <label class="layui-form-label">审核备注</label>
                <div class="layui-input-block">
                <textarea placeholder="审核失败必填" class="layui-textarea" name="remark"></textarea>
                </div>
            </div>
        </form>
        <div class="clearLeft pt30 ml20">
            <div><span class="secondary">注意: </span><span class="fRed">第一次审核通过后，将记录此时的商品数据。之后向万邑通注册/修改商品时会一直使用该数据</span></div>
        </div>
    </div>
</script>

<script type="text/html" id="winitregist_effctivePop">
    <div class="p20">
        <form class="layui-form" id="winitregist_effectiveForm" lay-filter="winitregist_effectiveForm">
            <div class="layui-col-lg12 layui-col-md12" notNull>
                <label class="layui-form-label">商品状态</label>
                <div class="layui-input-block">
                    <div class="layui-col-lg5 layui-col-md5">
                        <input name="ifEffective" type="radio" title="有效" value="true">
                    </div>
                    <div class="layui-col-lg5 layui-col-md5">
                        <input name="ifEffective" type="radio" title="失效" value="false">
                    </div>
                </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12">
                <label class="layui-form-label">失效原因</label>
                <div class="layui-input-block">
                    <textarea placeholder="失效必填" class="layui-textarea" name="remark"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>

<script type="text/html" id="winitregist_UKLetterBox">
    {{# if (d.prodSInfo && d.prodSInfo.suttleWeight != null && d.prodSInfo.packWeight != null && d.prodSInfo.winitHeight && d.prodSInfo.winitLength
    && d.prodSInfo.winitWidth) {}}
    {{# if (d.prodSInfo.winitHeight < 2.5 && d.prodSInfo.winitWidth < 25 && d.prodSInfo.winitLength < 35.3
    && (d.prodSInfo.suttleWeight + d.prodSInfo.packWeight) < 750) {}}
    <input type="checkbox" lay-skin="primary" disabled checked>
    {{# }else{}}
    <input type="checkbox" lay-skin="primary" disabled>
    {{# }}}
    {{# } }}
</script>

<script type="text/html" id="winitregist_DELetterBox">
    {{# if (d.prodSInfo && d.prodSInfo.suttleWeight != null && d.prodSInfo.packWeight != null && d.prodSInfo.winitHeight && d.prodSInfo.winitLength
    && d.prodSInfo.winitWidth) {}}
    {{# if (d.prodSInfo.winitHeight < 2 && d.prodSInfo.winitWidth < 25 && d.prodSInfo.winitLength < 35.3
    && (d.prodSInfo.suttleWeight + d.prodSInfo.packWeight) < 500) {}}
    <input type="checkbox" lay-skin="primary" disabled checked>
    {{# }else{}}
    <input type="checkbox" lay-skin="primary" disabled>
    {{# }}}
    {{# } }}
</script>

<script id="winitregist_prodLogPop" type="text/html">
    <div class="p20">
        <div class="layui-card">
            <div class="layui-card-body">
                <table class="layui-table" id="winitregist_prodLogTable"  lay-filter="winitregist_prodLogTable" ></table>
            </div>
        </div>
    </div>
</script>

<script type="text/javascript">
    // 获取物流属性的简称
    function winitregist_getColorOfLogis(name) {
        let totalLogis = $('#winitregist_logisAttrList').find('option')
        let alias = ''
        if (!name) {
            return alias
        }
        for (let i = 0; i < totalLogis.length; ++i) {
            if (name === totalLogis[i].value) {
                alias = totalLogis[i].getAttribute('alias')
                alias = alias ? alias : '#999999'
            }
        }
        return alias
    }

    let firstWayTypeJson
    // 获取头程类型名
    function winitregist_getFirstWayTypeName(type) {
        if (!firstWayTypeJson) {
            firstWayTypeJson = {}
            let options = $('#winitregist_firstWayTypeBox').find('option')
            for (let i = 0; i < options.length; ++i) {
                firstWayTypeJson[options[i].value] = options[i].text
            }
        }
        return firstWayTypeJson[type]
    }
</script>

<script type="text/html" id="winitregist_tab_channel">
    <div>{{d.siteInfo.channel}}</div>
    <div>
        {{# if (d.serviceType === 1) {}}
        万邑通
        {{#} }}
        {{# if (d.serviceType === 2) {}}
        谷仓
        {{#} }}
        {{# if (d.serviceType === 3) {}}
        递四方
        {{#} }}
    </div>
</script>
<script type="text/html" id="winitregist_tab_winitData">
    <div>
        <div class="alignLeft">
            <div><span class="secondary">申报价值：</span>{{d.siteInfo.importDeclareValue || ''}}</div>
            <div><span class="secondary">进口税率：</span>{{d.siteInfo.syncProdInfo.importRate || ''}}</div>
            <div><span class="secondary">允许存储：</span>{{d.siteInfo.syncProdInfo.allowSave ? '是' : '否'}}</div>
        </div>
    </div>
    <div class="clearLeft canClickEl" onmouseover="showTip(`{{d.siteInfo.winitDescription}}`, this)" onmouseleave="removeTip(this)">备注</div>
</script>
<script type="text/html" id="winitregist_tab_ifEffective">
    <div class="{{d.siteInfo.ifEffective || 'fRed'}}" onmouseover="showTip(`{{d.siteInfo.unEffectiveReason}}`, this)" onmouseleave="removeTip(this)">{{d.siteInfo.ifEffective ? '有效' : '失效'}}</div>
</script>
<style type="text/css">
    .clickToUrl{
        height: 32px;
        line-height: 32px;
        text-align: center;
    }
    .secondary{
        color: grey;
    }
</style>

<script type="text/javascript" src="${ctx}/static/js/commodity/template/productTplButton.js?v=${ver}"></script>
<%@ include file="/WEB-INF/view/jsp/commodity/template/productTplButton.jsp" %>
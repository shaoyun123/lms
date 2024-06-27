<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>  

<title>公共模板</title>
<style>
.layui-table-body .layui-table-cell {
	height: auto;
}
#LAY-ebay-publicModule .leftSideBar {
    width: 150px;
    position: fixed;
}

#LAY-ebay-publicModule .leftSideBar .layui-nav-item {
    cursor: pointer;
}

#LAY-ebay-publicModule .rightContent {
    margin-left: 170px;
    overflow: hidden;
}

.disN {
    display: none;
}

.p20 {
    padding: 20px 40px 0 0;
}

.wp90 {
    width: 90px;
    padding: 9px
}
.w92{
     width: 92px;
    padding: 9px;
}
.red {
        color: #FF5722
    }
</style>
<div class="layui-fluid" id="LAY-ebay-publicModule">
    <div id="et_leftSideBar" class="leftSideBar">
        <ul class="layui-nav layui-nav-tree" style="width:100%">
            <li class="layui-nav-item" style="background-color: #282b33;color: #fff;cursor: auto;"><a>公共模块</a></li>
            <li class="layui-nav-item layui-this" data-id="et_default"><a>默认刊登数据</a></li>
            <li class="layui-nav-item" data-id="et_logistics"><a>物流</a></li>
            <li class="layui-nav-item" data-id="et_goodLocal"><a>商品所在地</a></li>
            <li class="layui-nav-item" data-id="et_excludeCountries"><a>不寄送国家</a></li>
            <li class="layui-nav-item" data-id="et_return_policy"><a>退货政策</a></li>
            <li class="layui-nav-item" data-id="et_info"><a>销售模板</a></li>
        </ul>
    </div>
	<div class="rightContent">
        <div class="layui-card not_et_info">
            <div class="layui-card-body">
				<form class="layui-form" lay-filter="ebay_tactics_search_form" id="ebay_tactics_search_form">
					<div id="ebay_tactics_div_show">
						<div class="layui-col-md2 layui-col-lg2">
							<label class="layui-form-label">站点</label>
							<div class="layui-input-block">
								<select name="siteId" lay-search="" id="ebay_tactics_site_id" class="orgs_hp_custom">
									<option value="" selected>全部</option>
									<c:forEach items="${ebaySites}" var="ebaySite">
										<option value="${ebaySite.getSiteId()}">${ebaySite.getSite().getSiteChineseName()}</option>
									</c:forEach>
								</select>
							</div>
						</div>
						<div class="layui-col-md2 layui-col-lg2">
							<label class="layui-form-label">是否虚拟仓</label>
							<div class="layui-input-block">
								<select name="isOverseasWh" lay-search="" id="ebay_tactics_site_is_overseas_wh"
										class="orgs_hp_custom">
									<option value="" selected>全部</option>
									<option value="1">是</option>
									<option value="0">否</option>
								</select>
							</div>
						</div>
						<div class="layui-col-lg3 layui-col-md3 pl20">
							<span class="layui-btn layui-btn-sm" lay-submit lay-filter="ebay_tactics_form_submit"
								  id="ebay_tactics_form_submit">查询</span>
						</div>
					</div>
				</form>
                <div id="et_tableDiv">
                <button id="et_addBtn" type="button" style="float: right;" class="layui-btn layui-btn-sm layui-btn-normal">新增</button>
                <!--主要内容:一个表格,一个弹框-->
                <table id="et_table" class="layui-table" lay-filter='et_table-filter'></table>
        </div>
            </div>
        </div>
        <div class="layui-card et_info_show disN">
            <div class="layui-card-header">
                <button class="layui-btn layui-btn-sm layui-btn-normal et_addModuleInfo" type="button">添加信息</button>
            </div>
            <div class="layui-card-body">
                <table class="layui-table et_allModuleInfo">
                    <thead>
                        <tr>
                           <th>编号</th>
                           <th>模板</th>
                           <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                           <td>1</td>
                           <td>默认模板1</td>
                           <td>
                              <button class="layui-btn layui-btn-xs et_editModuleInfo" type="button">修改</button>
                              <button class="layui-btn layui-btn-xs layui-btn-primary" type="button">删除</button>
                           </td>
                        </tr>
                        <tr>
                           <td>2</td>
                           <td>默认模板2</td>
                           <td>
                              <button class="layui-btn layui-btn-xs et_editModuleInfo" type="button">修改</button>
                              <button class="layui-btn layui-btn-xs layui-btn-primary" type="button">删除</button>
                           </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<!--物流规则模板-->
<script type="text/html" id="et_ruleFormTpl">
	<div class="layui-form assiFieldRuleForm">
		<input type="hidden" name='id'>
  		<div class="layui-form-item">
           <div class="layui-inline">
		        <label class="layui-form-label">优先级</label>
		        <div class="layui-input-inline">
		        	<input type="number" name="priority" lay-verify="required|number" autocomplete="off" class="layui-input">
		        </div>
		    </div>
        </div>
        <div class="layui-form-item">
		    <label class="layui-form-label">适用站点</label>
		    <div class="layui-input-block">
		    	<c:forEach items = "${ebaySites}" var = "ebaySite" >
                    <input type="radio" name="siteIds" lay-skin="primary" lay-filter="et_siteIdFilter"
                        value="${ebaySite.getSiteId()}"
                        title="${ebaySite.getSite().getSiteChineseName()}">
                </c:forEach>
		    </div>
		</div>
        <div class="layui-form-item">
            <div class="layui-inline">
		        <label class="layui-form-label">刊登金额:</label>
		        <div class="layui-input-inline" style="width: 100px;">
		        	<input type="number" name="minPrice" autocomplete="off" class="layui-input">
			    </div>
			    <div class="layui-form-mid">-</div>
			    <div class="layui-input-inline" style="width: 100px;">
		        	<input type="number" name="maxPrice" autocomplete="off" class="layui-input">
			    </div>
				<div class="layui-form-mid layui-word-aux">站点币种</div>
		    </div>
        </div>
		<div class="layui-form-item">
			<div class="layui-inline">
				<label class="layui-form-label">商品重量(g):</label>
				<div class="layui-input-inline" style="width: 100px;">
					<input type="number" name="minWeight" autocomplete="off" class="layui-input">
				</div>
				<div class="layui-form-mid">-</div>
				<div class="layui-input-inline" style="width: 100px;">
					<input type="number" name="maxWeight" autocomplete="off" class="layui-input">
				</div>
			</div>
		</div>
        <div class="layui-form-item">
		    <label class="layui-form-label">仓库</label>
		    <div class="layui-input-block">
		    	<input type="radio" name="isOverseasWh" value="false" title="国内仓" checked>
		    	<input type="radio" name="isOverseasWh" value="true" title="虚拟仓" >
		    </div>
	    </div>
        <div class="layui-form-item">
		    <label class="layui-form-label">物流属性</label>
		    <div class="layui-input-block">
		    	<c:forEach items = "${logisAttrs}" var = "logisAttr" >
                    <input type="checkbox" name="logisAttrList" lay-skin="primary"
                        value="${logisAttr.getName()}"
                         title="${logisAttr.getName()}">
                </c:forEach>
		    </div>
		</div>
	    <div class="layui-form-item">
		    <label class="layui-form-label">适用店铺</label>
		    <div class="layui-input-block">
		    	<div class="layui-inline">
                	<input type="checkbox" name="storeAcctIds" lay-filter="et_storeAcctAll"
                		title="全部店铺"
                		value="0"
                		lay-skin="primary">
            	</div>
                <div class="layui-inline">
                    <c:forEach items = "${storeAccts}" var = "storeAcct" >
                        <input type="checkbox" name="storeAcctIds" lay-filter="et_storeAcctOne"
                            value="${storeAcct.getId()}"
                            title="${storeAcct.getStoreAcct()}"
                            lay-skin="primary">
                    </c:forEach>
                </div>
		    </div>
		</div>
    </div>
</script>
<!--默认模板弹框-->
<script type="text/html" id="et_defaultEditLayer">
    <div style="padding: 20px">
    	<div class="layui-collapse">
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">模板规则</h2>
			    <div class="layui-colla-content layui-show">
			        <!--待初始化-->
			        :rule
			    </div>
		    </div>
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">默认刊登模板</h2>
			    <div class="layui-colla-content layui-show">
			    	<form class="layui-form">
			            <input name="id" type="hidden">
			            <div class="layui-form-item">
			                <label class="layui-form-label wp90">模块名称</label>
			                <div class="layui-input-block">
			                    <input name="name" type="text" autocomplete="off" class="layui-input">
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label"><span class="red">*</span>刊登天数</label>
			                <div class="layui-input-block">
			                    <select name="listingDays">
			                      <c:forEach items="${listingDays}" var="listingDay">  
			                            <option value="${listingDay.value()}" <c:if test="${listingDay.value() == 'GTC' }">selected</c:if>>${listingDay.name()}</option>
			                      </c:forEach>
			                    </select>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label"><span class="red">*</span>处理时间</label>
			                <div class="layui-input-block">
			                <input type="text" name="dispatchTimeMax" required  lay-verify="required" class="layui-input">
			                <span style="position: absolute;right: -20px;top:10px">天</span>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label"><span class="red">*</span>物品所在地</label>
			                <div class="layui-input-block">
			                   <input type="text" name="goodsLocation" required  lay-verify="required" class="layui-input">
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label"><span class="red">*</span>物品所在国</label>
			                <div class="layui-input-block">
			                   <input type="text" name="goodsCountry" required  lay-verify="required" class="layui-input">
			                </div>
			            </div>
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label"><span class="red">*</span>站点国家运输方式1</label>
			                <div class="layui-input-block">
			                    <input type="text" name="shipSrv1" required lay-verify="required" class="layui-input">
			                    <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv1Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv1AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">站点国家运输方式2</label>
			                <div class="layui-input-block">
			                   <input type="text" name="shipSrv2" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv2Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv2AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">站点国家运输方式3</label>
			                <div class="layui-input-block">
			                   <input type="text" name="shipSrv3" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv3Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv3AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">站点国家运输方式4</label>
			                <div class="layui-input-block">
			                   <input type="text" name="shipSrv4" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv4Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv4AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%; margin-top: 30px;">
			                <label class="layui-form-label"><span class="red">*</span>非站点国家运输方式1</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv1" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv1Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv1AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label"><span class="red">*</span>非站点国家运输方式1运送国家</label>
			                <div class="layui-input-block ebayShipTo1">
			                </div>
			            </div>
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式2</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv2" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv2Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv2AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式2运送国家</label>
			                <div class="layui-input-block ebayShipTo2">
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式3</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv3" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv3Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv3AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式3运送国家</label>
			                <div class="layui-input-block ebayShipTo3">
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式4</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv4" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv4Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv4AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式4运送国家</label>
			                <div class="layui-input-block ebayShipTo4">
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式5</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv5" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv5Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv5AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式5运送国家</label>
			                <div class="layui-input-block ebayShipTo5">
			                </div>
			            </div>
			            
			             <div class="layui-form-item">
			                <label class="layui-form-label" style="display:flex;flex-direction:column;flex-wrap: wrap-reverse;">
							不寄送国家
							 <a id="ebay_exclude_country_applay_on_specified_site" class="layui-btn layui-btn-sm layui-btn-normal">应用到当前站点</a><br>
							 <a id="ebay_exclude_country_applay_on_all_site" class="layui-btn layui-btn-sm">应用到所有站点</a>
							</label>
							
			                <div class="layui-input-block">
			                     <textarea id="ebay_default_notShipToCountries_textarea" name="notShipToCountries"  placeholder="请输入内容" class="layui-textarea"></textarea>
			                </div>
			            </div>
			            
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>国内退货</label>
			                        <div class="layui-input-block">
			                            <select name="returnsAcceptedOption">
			                                <c:forEach items = "${returnsAcceptedOptions}" var = "returnsAcceptedOption" >
			                                    <option value="${returnsAcceptedOption.value()}">${returnsAcceptedOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>退货方式</label>
			                        <div class="layui-input-block">
			                            <select name="refundOption">
			                                <c:forEach items = "${refundOptions}" var = "refundOption" >
			                                    <option value="${refundOption.value()}">${refundOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>退货期限</label>
			                        <div class="layui-input-block">
			                            <select name="returnsWithinOption">
			                                <c:forEach items = "${returnsWithinOptions}" var = "returnsWithinOption" >
			                                    <option value="${returnsWithinOption.value()}">${returnsWithinOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>运费承担</label>
			                        <div class="layui-input-block">
			                            <select name="shippingCostPaidBy">
			                                <c:forEach items = "${shippingCostPaidBys}" var = "shippingCostPaidBy" >
			                                    <option value="${shippingCostPaidBy.value()}">${shippingCostPaidBy.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md12">
			                        <label class="layui-form-label wp90">退货说明</label>
			                        <div class="layui-input-block">
			                            <textarea name="returnDescription" class="layui-textarea"></textarea>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货</label>
			                        <div class="layui-input-block">
			                            <select name="internationalReturnsAcceptedOption">
			                                <c:forEach items = "${returnsAcceptedOptions}" var = "returnsAcceptedOption" >
			                                    <option value="${returnsAcceptedOption.value()}">${returnsAcceptedOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货方式</label>
			                        <div class="layui-input-block">
			                            <select name="internationalRefundOption">
			                                <c:forEach items = "${refundOptions}" var = "refundOption" >
			                                    <option value="${refundOption.value()}">${refundOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货期限</label>
			                        <div class="layui-input-block">
			                            <select name="internationalReturnsWithinOption">
			                                <c:forEach items = "${returnsWithinOptions}" var = "returnsWithinOption" >
			                                    <option value="${returnsWithinOption.value()}">${returnsWithinOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货运费承担</label>
			                        <div class="layui-input-block">
			                            <select name="internationalShippingCostPaidBy">
			                                <c:forEach items = "${shippingCostPaidBys}" var = "shippingCostPaidBy" >
			                                    <option value="${shippingCostPaidBy.value()}">${shippingCostPaidBy.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </form>
			    </div>
		    </div>
		</div>
        
    </div>
</script>
<!-- 物流弹框 -->
<script type="text/html" id="et_logisticsEditLayer">
    <div  style="padding: 20px 40px 10px 10px">
    	<div class="layui-collapse">
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">模板规则</h2>
			    <div class="layui-colla-content layui-show">
			        <!--待初始化-->
			        :rule
			    </div>
		    </div>
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">物流模板</h2>
			    <div class="layui-colla-content layui-show">
			        <form action="" class="layui-form">
			            <input name="id" type="hidden">
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md12">
			                        <label class="layui-form-label wp90">模块名称</label>
			                        <div class="layui-input-block">
			                            <input name="name" type="text" autocomplete="off" class="layui-input">
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label"><span class="red">*</span>站点国家运输方式1</label>
			                <div class="layui-input-block">
			                    <input type="text" name="shipSrv1" required lay-verify="required" class="layui-input">
			                    <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv1Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv1AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			             <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">站点国家运输方式2</label>
			                <div class="layui-input-block">
			                   <input type="text" name="shipSrv2" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv2Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv2AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">站点国家运输方式3</label>
			                <div class="layui-input-block">
			                   <input type="text" name="shipSrv3" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv3Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv3AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">站点国家运输方式4</label>
			                <div class="layui-input-block">
			                   <input type="text" name="shipSrv4" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv4Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="shipSrv4AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%; margin-top: 30px;">
			                <label class="layui-form-label"><span class="red">*</span>非站点国家运输方式1</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv1" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv1Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv1AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label"><span class="red">*</span>非站点国家运输方式1运送国家</label>
			                <div class="layui-input-block ebayShipTo1">
			                </div>
			            </div>
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式2</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv2" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv2Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv2AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式2运送国家</label>
			                <div class="layui-input-block ebayShipTo2">
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式3</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv3" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv3Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv3AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式3运送国家</label>
			                <div class="layui-input-block ebayShipTo3">
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式4</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv4" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv4Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv4AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式4运送国家</label>
			                <div class="layui-input-block ebayShipTo4">
			                </div>
			            </div>
			            
			            <div class="layui-form-item" style="width:50%">
			                <label class="layui-form-label">非站点国家运输方式5</label>
			                <div class="layui-input-block">
			                   <input type="text" name="intlShipSrv5" required  lay-verify="required" class="layui-input">
			                   <div style="position: absolute;right: -375px;top: 0px">
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>运费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv5Cost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                        <div class="layui-inline">
			                            <label class="layui-form-label"><span class="red">*</span>附加费</label>
			                            <div class="layui-input-inline" style="width:50px">
			                                <input name="intlShipSrv5AddedCost" min="0" required lay-verify="required" class="layui-input">
			                            </div>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label">非站点国家运输方式5运送国家</label>
			                <div class="layui-input-block ebayShipTo5">
			                </div>
			            </div>
			        </form>
			    </div>
		    </div>
		</div>
    </div>
</script>
<!-- 商品所在地弹框 -->
<script type="text/html" id="et_goodLocalEditLayer">
    <div style="padding: 20px">
    	<div class="layui-collapse">
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">模板规则</h2>
			    <div class="layui-colla-content layui-show">
			        <!--待初始化-->
			        :rule
			    </div>
		    </div>
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">商品所在地模板</h2>
			    <div class="layui-colla-content layui-show">
			        <form action="" class="layui-form">
			            <input name="id" type="hidden">
			            <div class="layui-form-item">
			                <label class="layui-form-label wp90">模块名称</label>
			                <div class="layui-input-block">
			                    <input name="name" type="text" autocomplete="off" class="layui-input">
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label wp90">商品所在地</label>
			                <div class="layui-input-block">
			                    <input name="goodsLocation" type="text" autocomplete="off" class="layui-input">
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label wp90">商品所在国家</label>
			                <div class="layui-input-block">
			                    <input name="goodsCountry" type="text" autocomplete="off" class="layui-input">
			                </div>
			            </div>
			        </form>
			    </div>
		    </div>
		</div>
    </div>
</script>
<!-- 不寄送国家弹框 -->
<script type="text/html" id="et_excludeCountriesEditLayer">
    <div style="padding: 20px">
    	<div class="layui-collapse">
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">模板规则</h2>
			    <div class="layui-colla-content layui-show">
			        <!--待初始化-->
			        :rule
			    </div>
		    </div>
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">不寄送国家模板</h2>
			    <div class="layui-colla-content layui-show">
			        <form action="" class="layui-form">
			            <input name="id" type="hidden">
			            <div class="layui-form-item">
			                <label class="layui-form-label wp90">模块名称</label>
			                <div class="layui-input-block">
			                    <input name="name" type="text" autocomplete="off" class="layui-input">
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <label class="layui-form-label wp90">不寄送国家</label>
			                <div class="layui-input-block">
			                   <textarea name="notShipToCountries" class="layui-textarea"></textarea>
			                </div>
			            </div>
			        </form>
			    </div>
		    </div>
		</div>
    </div>
</script>
<script type="text/html" id="et_returnPolicyLayer">
    <div style="padding: 20px">
    	<div class="layui-collapse">
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">模板规则</h2>
			    <div class="layui-colla-content layui-show">
			        <!--待初始化-->
			        :rule
			    </div>
		    </div>
		    <div class="layui-colla-item">
			    <h2 class="layui-colla-title">默认刊登模板</h2>
			    <div class="layui-colla-content layui-show">
			        <form action="" class="layui-form">
			            <input name="id" type="hidden">
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md12">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>模块名称</label>
			                        <div class="layui-input-block">
			                            <input name="name" type="text" autocomplete="off" class="layui-input">
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>国内退货</label>
			                        <div class="layui-input-block">
			                            <select name="returnsAcceptedOption">
			                                <c:forEach items = "${returnsAcceptedOptions}" var = "returnsAcceptedOption" >
			                                    <option value="${returnsAcceptedOption.value()}">${returnsAcceptedOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>退货方式</label>
			                        <div class="layui-input-block">
			                            <select name="refundOption">
			                                <c:forEach items = "${refundOptions}" var = "refundOption" >
			                                    <option value="${refundOption.value()}">${refundOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>退货期限</label>
			                        <div class="layui-input-block">
			                            <select name="returnsWithinOption">
			                                <c:forEach items = "${returnsWithinOptions}" var = "returnsWithinOption" >
			                                    <option value="${returnsWithinOption.value()}">${returnsWithinOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90"><span style="color: red">*</span>运费承担</label>
			                        <div class="layui-input-block">
			                            <select name="shippingCostPaidBy">
			                                <c:forEach items = "${shippingCostPaidBys}" var = "shippingCostPaidBy" >
			                                    <option value="${shippingCostPaidBy.value()}">${shippingCostPaidBy.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md12">
			                        <label class="layui-form-label wp90">退货说明</label>
			                        <div class="layui-input-block">
			                            <textarea name="returnDescription" class="layui-textarea"></textarea>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货</label>
			                        <div class="layui-input-block">
			                            <select name="internationalReturnsAcceptedOption">
			                                <c:forEach items = "${returnsAcceptedOptions}" var = "returnsAcceptedOption" >
			                                    <option value="${returnsAcceptedOption.value()}">${returnsAcceptedOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货方式</label>
			                        <div class="layui-input-block">
			                            <select name="internationalRefundOption">
			                                <c:forEach items = "${refundOptions}" var = "refundOption" >
			                                    <option value="${refundOption.value()}">${refundOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			            <div class="layui-form-item">
			                <div class="layui-row">
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货期限</label>
			                        <div class="layui-input-block">
			                            <select name="internationalReturnsWithinOption">
			                                <c:forEach items = "${returnsWithinOptions}" var = "returnsWithinOption" >
			                                    <option value="${returnsWithinOption.value()}">${returnsWithinOption.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                    <div class="layui-col-md6">
			                        <label class="layui-form-label wp90">国际退货运费承担</label>
			                        <div class="layui-input-block">
			                            <select name="internationalShippingCostPaidBy">
			                                <c:forEach items = "${shippingCostPaidBys}" var = "shippingCostPaidBy" >
			                                    <option value="${shippingCostPaidBy.value()}">${shippingCostPaidBy.value()}</option>
			                                </c:forEach>
			                            </select>
			                        </div>
			                    </div>
			                </div>
			            </div>
			        </form>
			    </div>
		    </div>
		</div>
    </div>
</script>
<%-- 销售模板弹框 --%>
<script type="text/html" id="et_infoLayer">
    <div class="p20">
        <form action="" class="layui-form">
            <input type="hidden" name="id">
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">备注/别名</label>
                    <div class="layui-input-block">
                        <input name="name"  type="text" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
				    <label class="layui-form-label">适用站点</label>
				    <div class="layui-input-block">
				    	<c:forEach items = "${ebaySites}" var = "ebaySite" >
		                    <input type="checkbox" name="siteIds" lay-skin="primary"
		                        value="${ebaySite.getSiteId()}"
		                        title="${ebaySite.getSite().getSiteChineseName()}">
		                </c:forEach>
				    </div>
                </div>
				<div class="layui-form-item layui-inline" id="ebayAcctType" style="z-index: 99999">
					<label class="layui-form-label">适用账号类型</label>
					<div class="layui-input-inline" style="width:300px">
						<select name="acctType"  xm-select="ebay-acct-type">
							<option></option>
						</select>
					</div>
				</div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">帖子介绍前缀</label>
                    <div class="layui-input-block">
                        <div id="et_discriptionHead"></div>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">快递方式<br>[Shipping]</label>
                    <div class="layui-input-block">
                        <div id="et_shipping"></div>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">付款方式<br>[Payment]</label>
                    <div class="layui-input-block">
                        <div id="et_payment"></div>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label" style="word-break: break-word;">销售规则<br>[TERMS_OF_SALE]</label>
                    <div class="layui-input-block">
                        <div id="et_teamsofsale"></div>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">退货条款<br>[Return_Policy]</label>
                    <div class="layui-input-block">
                        <div id="et_returnpolicy"></div>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">评价<br>[Feedback]</label>
                    <div class="layui-input-block">
                        <div id="et_feedback"></div>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">关于我们<br>[ABOUT_ME]</label>
                    <div class="layui-input-block">
                        <div id="et_aboutus"></div>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">联系我们<br>[CONTACT_US]</label>
                    <div class="layui-input-block">
                        <div id="et_contactus"></div>
                    </div>
                </div>
        </form>
    </div>
</script>
<script type="text/html" id="et_ruleTpl">
	<div style="text-align: initial; margin-left: 5px;">
		{{#  if(d.rule){ }}
		  <span style="color:#999;">优先级:</span>{{d.rule.priority}}<br>
		  
		  <span style="color:#999;">站点:</span>
		  <c:forEach items = "${ebaySites}" var = "ebaySite" >
                {{#  if(d.rule.siteIds.split(",").indexOf("${ebaySite.getSiteId()}")>-1 ){ }}
	                ${ebaySite.getSite().getSiteChineseName()}
			    {{#  } }}
          </c:forEach>
          <br>
          
		  <span style="color:#999;">是否虚拟仓:</span>{{#  if(d.rule.isOverseasWh){ }}是{{#  } else { }}否{{#  } }}<br>
		  
		  <span style="color:#999;">金额:</span>{{d.rule.minPrice}} - {{d.rule.maxPrice}}<br>
          <span style="color:#999;">重量(g):</span>{{d.rule.minWeight}} - {{d.rule.maxWeight}}<br>
		  <span style="color:#999;">店铺:</span>
		  {{#  if(d.rule.storeAcctIds.split(",").indexOf("0")>-1){ }}
		  	全部店铺
		  {{#  } else if(d.rule.storeAcctIds == "") { }}
		  	<span style="color: red;">无</span>
	  	  {{#  } else { }}
	  	   	{{d.rule.storeAcctIds.split(",").length}}个店铺
	  	  {{#  } }}
		{{#  } else { }}
			<span style="color: red;">无规则</span>
		{{#  } }}  
	</div>
</script>
<script src="${ctx}/static/js/publishs/ebay/ebaytactics.js"></script>
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>

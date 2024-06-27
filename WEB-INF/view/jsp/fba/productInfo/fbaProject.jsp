<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>FBA项目</title>
<div class="layui-fluid" id="LAY-fbaProject">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="fbaProject_search_form" lay-filter="fbaProject_search_form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">部门</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonOrgId" id="fbaProject_online_depart_sel" lay-search
                                        lay-filter="fbaProject_online_depart_sel" class="orgs_hp_custom">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">负责人</label>
                                <div class="layui-input-block">
                                    <select name="salesPersonId" id="fbaProject_online_salesman_sel" lay-search
                                        lay-filter="fbaProject_online_salesman_sel" class="users_hp_custom"
                                        data-rolelist="amazon专员">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">站点</label>
                                <div class="layui-input-block">
                                    <select name="site" lay-search id="site"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label"></label>
                                    <button type="button"
                                    class="layui-btn layui-btn-primary layui-btn-sm"
                                    id="LAY-amazon-fba-project-manager-btton">选择类目</button>
                                <i class="layui-icon layui-icon-delete" onclick="clearCate('LAY-amazon-fba-project-manager-div','LAY-fbaProject-hidden1')" style="cursor:pointer" title="删除产品类目"></i>
                                <input type="hidden" name="cateId" id="LAY-fbaProject-hidden1">
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">刊登店铺</label>
                                <div class="layui-input-block" style="font-size: 12px;">
                                    <select 
                                        id="fbaProject_online_store_sel"
                                        xm-select="fbaProject_online_store_sel" 
                                        class="users_hp_store_multi"
                                        xm-select-search 
                                        xm-select-search-type="dl" 
                                        xm-select-skin="normal"
                                        data-platcode="amazon" 
                                        name="storeAcctIdList"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="queryTimeType" lay-filter="aihao" lay-search="">
                                        <option value="auditTime">审核时间</option>
                                        <option value="createTime">创建时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="timerange" id="FBAprotimerange" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">项目进度</label>
                                <div class="layui-input-block">
                                    <select name="processStatus" lay-search id="site"></select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="queryDataType" lay-filter="aihao" lay-search="">
                                        <option value="pSku">父SKU</option>
                                        <option value="asin">子ASIN</option>
                                        <option value="shipmentId">货件编号</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input  type="text" name="queryDataTypeStr" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <div class="layui-form-label labelSel">
                                    <select name="queryProjectType" lay-filter="aihao" lay-search="">
                                        <option value="projectName">项目名称</option>
                                        <option value="remark">备注</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input  type="text" name="queryProjectStr" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序</label>
                                <div class="layui-input-block">
                                    <select name="orderBy" lay-filter="aihao" lay-search="">
                                    <option value="create_time desc">创建时间倒序</option>
                                    <option value="create_time asc">创建时间正序</option>
                                    <option value="audit_prod_amout desc">审批发货数量倒序</option>
                                    <option value="audit_prod_amout asc">审批发货时间正序</option>
                                    <option value="audit_money desc">审批发货金额倒序</option>
                                    <option value="audit_money asc">审批发货金额正序</option>
                                    <option value="avg_price desc">货件发货金额倒序</option>
                                    <option value="avg_price asc">货件发货金额正序</option>
                                </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">审核结果</label>
                                <div class="layui-input-block">
                                    <select name="auditResult" lay-filter="auditResult" lay-search="auditResult">
                                        <option value=""></option>
                                        <option value="1">通过</option>
                                        <option value="2">失败</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">项目跟卖店铺</label>
                                <div class="layui-input-block">
                                    <select 
                                        name="storeFollowAcctIdList" 
                                        id="storeFollowAcctIdList"
                                        lay-filter="storeFollowAcctIdList" 
                                        xm-select="storeFollowAcctIdList"
                                        xm-select-search 
                                        xm-select-search-type="dl"
                                        xm-select-skin="normal"
                                        xm-select-type="1">
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label"></label>
                                <button id="fbaProject_searchBtn" class="layui-btn layui-btn-sm"
                                        type="button" lay-filter="">搜索
                                </button>
                                <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="amazon_fba_project_manager_reset">清空</button>
                            </div>
                        </div>  
                        
                    </form>
                    <div id="LAY-amazon-fba-project-manager-div"></div>
                </div>
            </div>
            <div class="layui-card" id="fbaProject_listCard">
                <div class="layui-card-header">
                    <permTag:perm funcCode="fbaProject_addList">
                        <button type="button" class="layui-btn layui-btn-sm" id="fbaProject_List">创建项目</button>
                    </permTag:perm>
                    <permTag:perm funcCode="fbaProject_outList">
                        <button type="button" class="layui-btn layui-btn-sm" id="fbaProject_outList">导出</button>
                    </permTag:perm>
                    <permTag:perm funcCode="fbaProject_modification">
                        <button type="button" class="layui-btn layui-btn-sm" id="fbaProject_modification">批量修改责任人</button>
                    </permTag:perm>
                </div>
                <table class="layui-table" lay-filter="fbaProjectTable" id="fbaProjectTable"></table>
            </div>


        </div>
    </div>
</div>

<script type="text/html" id="fl_projectName">
    <div>{{d.projectName}}</div>
    <div class="layui-row">
        <div class="layui-col-md5">
            {{#  if( d.auditResult == 1  ){ }}
                <span class="hp-badge layui-bg-blue fr layTitle" lay-title="已审核">通</span>
            {{#  } }}
            {{#  if(d.auditResult == 0 ){ }}
                <span class="hp-badge layui-bg-gray fr layTitle" lay-title="未审核">未</span>
            {{#  } }}
            {{#  if( d.auditResult == 2  ){ }}
            <span class="hp-badge layui-bg-red fr layTitle" lay-title="审核失败">败</span>
            {{#  } }}
        </div>
        <div class="layui-col-md5">
            <a class="layui-btn layui-btn-xs">{{d.projectType}}</a>
        </div>
    </div>
</script>
<script type="text/html" id="f1_shipmentIdList">
    <div>
        <div>
            <a href="javascript:void(0);" lay-event="fbaProjectDeliveryClick"
                    class="layui-table-link">{{ d.shipmentIdList }}</a>
            <a href="#/route/fba/deliver/FBAdelivery" hidden id="fbaProjectDeliveryClick_{{ d.id }}"/>
        </div>
    </div>
    <div class="layui-row">
        {{#  if (d.firstVessel != '') { }}
        {{#  layui.each(d.firstVessel.split(','), function(index, item){ }}
        <div class="layui-col-md4">
            <a class="layui-btn layui-btn-xs">{{item}}</a>
        </div>
        {{# }) }}
        {{#  } }}
    </div>
</script>
<script type="text/html" id="fl_imageTpl">
    {{#  if(typeof(d.image) !="undefined"){ }}
    <div>
        <img width="60" height="60" data-original="{{d.image}}!size=60x60" class="img_show_hide b1 lazy"
             data-onerror="layui.admin.img_noFind()">
    </div>
    {{#  } }}
</script>
<script type="text/html" id="f1_Approval">
    <div style="text-align: left"><span style="color: #999;">金额(￥):</span>{{d.auditMoney}}</div>
    <div style="text-align: left"><span style="color: #999;">数量:</span>{{d.auditProdAmout}}</div>
</script>
<script type="text/html" id="fl_remark">
    <div style="text-align: left"><span style="color: #999;">项目:</span>{{d.remark}}</div>
    <div style="text-align: left"><span style="color: #999;">审核:</span>{{d.auditRemark}}</div>
</script>
<script type="text/html" id="fl_timeTpl">
    <div style="text-align: left"><span style="color: #999;">创建:</span>{{format(d.createTime,"yyyy-MM-dd")}}</div>
    <div style="text-align: left"><span style="color: #999;">审核:</span>{{format(d.auditTime,"yyyy-MM-dd")}}</div>
</script>

<script type="text/html" id="fl_title">
    <div style="text-align: left">{{d.prodPSkuList}}</div>
    <div style="text-align: left"><span style="color: #999;">类目:</span>{{d.cateName}}</div>
</script>
<!-- 操作 -->
<script type="text/html" id="f1_purchase_url">
    <permTag:perm funcCode="fbaProject_detail">
        <a class="layui-btn layui-btn-normal layui-btn-xs mb5" lay-event="fbaProject_edit">详情</a><br/>
    </permTag:perm>
    <permTag:perm funcCode="fbaProject_toexamine">
        <a class="layui-btn layui-btn-normal layui-btn-xs mb5" lay-event="fbaProject_toexamine">审核</a><br/>
    </permTag:perm>
    <permTag:perm funcCode="fbaProject_modify">
        <a class="layui-btn layui-btn-warm layui-btn-xs mb5" lay-event="fbaProject_modify">修改专员</a><br/>
    </permTag:perm>
    <permTag:perm funcCode="fbaProject_del">
        <a class="layui-btn layui-btn-danger layui-btn-xs mb5" lay-event="fbaProject_del">删除</a><br/>
    </permTag:perm>

    <permTag:perm funcCode="fbaProject_up">
        <a class="layui-btn layui-btn-xs" id="fbaProject_up_{{d.id}}" title ='最大上传20M文件'>上传附件</a><br/>
    </permTag:perm>
    <permTag:perm funcCode="fbaProject_download">
    {{#  if(d.fileName || d.saveFileName != ''){ }}
        <a class="layui-btn layui-btn-xs" lay-event="fbaProject_download">附件下载</a><br/>
    {{#  } }}
    </permTag:perm>

</script>
<!-- 新增新品 -->
<script type="text/html" id="newfbaProject_list">
    <div style="padding:20px 5px 0 5px">
        <form class="layui-form" id="fbaProjectAddFrom">
            <div class="layui-form-item">
                <label class="layui-form-label"><font color='red'>*</font>项目名称</label>
                <div class="layui-input-block">
                    <input type="text" name="projectName" value="" class="layui-input">
                </div>

            </div>
            <div class="layui-form-item">
                <div class="layui-col-md6 layui-col-lg6">
                    <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                    <select name="site" lay-filter="site" lay-search="">
                    </select>
                </div>
                </div>
                <div class="layui-col-md6 layui-col-lg6">
                    <label class="layui-form-label"></label>
                    <button type="button"
                        class="layui-btn layui-btn-primary layui-btn-sm"
                        id="LAY-amazon-fba-project-manager-btton2">选择类目</button>
                    <i class="layui-icon layui-icon-delete" onclick="clearCate('LAY-amazon-fba-project-manager-div1','LAY-fbaProject-hidden2')" style="cursor:pointer" title="删除产品类目"></i>
                    <input type="hidden" name="cateId" id="LAY-fbaProject-hidden2">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"></label>
            <div id="LAY-amazon-fba-project-manager-div1"></div>

            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">分配店铺</label>
                <div class="layui-input-block" style="font-size: 12px;">
                    <select 
                        id="fbaProjectadd_online_store_sel"
                        xm-select="fbaProject_online_store_seladd" 
                        class="users_hp_store_multi"
                        xm-select-search 
                        xm-select-search-type="dl" 
                        xm-select-skin="normal"
                        data-platcode="amazon" 
                        name="storeAcctIdList">
                        <option value=""></option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">项目跟卖店铺</label>
                <div class="layui-input-block">
                    <select 
                        name="storeFollowAcctIdList" 
                        id="addstoreFollowAcctIdList"
                        lay-filter="addstoreFollowAcctIdList"
                        xm-select="addstoreFollowAcctIdList"
                        xm-select-search 
                        xm-select-search-type="dl"
                        xm-select-skin="normal"
                        xm-select-type="1">
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">头程类型</label>
                <div class="layui-input-block">
                    <select name="firstVessel" id="firstVessel" lay-filter="firstVessel" xm-select="firstVessel" xm-select-type="1">
                        <option value="海运">海运</option>
                        <option value="空运">空运</option>
                        <option value="陆运">陆运</option>
                    </select>
                </div>
            </div>
                                
            <!-- 开发类型 -->
            <div class="layui-form-item">
                <label class="layui-form-label">项目进度</label>
                <div class="layui-input-block">
                    <select name="processStatus" lay-search></select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><font color='red'>*</font>项目类型</label>
                <div class="layui-input-block">
                    <select name="projectType" lay-search >
                        <option value=""></option>
                        <option value="分配">分配</option>
                        <option value="自选">自选</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md6 layui-col-lg6">
                    <label class="layui-form-label">审批发货金额￥</label>
                    <div class="layui-input-block">
                        <input  type="number" name="auditMoney" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md6 layui-col-lg6">
                    <label class="layui-form-label">审批发货数量</label>
                    <div class="layui-input-block">
                        <input  type="number" name="auditProdAmout" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-col-md6 layui-col-lg6">
                    <label class="layui-form-label"><font color='red'>*</font>产品平均售价（$）</label>
                    <div class="layui-input-block">
                        <input type="number" name="avgPrice" value="" class="layui-input">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商品父SKU</label>
                <div class="layui-input-block">
                    <input  type="text" name="prodPSkuList" class="layui-input" placeholder="多个用逗号分隔">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">父ASIN</label>
                <div class="layui-input-block">
                    <input  type="text" name="pAsinList" class="layui-input" placeholder="多个用逗号分隔">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">货件计划</label>
                <div class="layui-input-block">
                    <input  type="text" name="shipmentIdList" class="layui-input" placeholder="多个用逗号分隔">
                </div>
            </div>

            <!-- 图片 -->
            <div class="layui-form-item">
                <label class="layui-form-label"><font color='red'>*</font>图片</label>
                <div class="layui-input-inline">
                    <button type="button" class="layui-btn layui-btn-primary layui-btn-sm mb5" id="delete_pasteImg">删除图片</button>
                    <input type="hidden" name="image">
                    <div in='innerImage' id="add_image" style='width:300px;height:300px;border:1px solid #ccc'
                        contenteditable='true'></div>
                </div>
            </div>
            <!-- 备注 -->
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注</label>
                <div class="layui-input-block">
                    <textarea name="remark" id="devNote" class="layui-textarea"></textarea>
                </div>
            </div>

        </form>
    </div>

</script>
<!-- 审核项目 -->
<script type="text/html" id="newfbaProject_toexaminelist">
    <div>
        <form class="layui-form" id="fbaProjecttoexaminelFrom">
            <div class="layui-form-item">
                <label class="layui-form-label">审核结果</label>
                <div class="layui-input-block">
                    <input type="radio" name="auditResult" value="1" title="通过">
                    <input type="radio" name="auditResult" value="2" title="失败">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">审核备注</label>
                <div class="layui-input-block">
                    <textarea name="auditRemark" class="layui-textarea" style="width:550px"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 修改负责人 -->
<script type="text/html" id="fbaProject_modify">
    <div style="padding:20px 0px 0px 0px">
        <form class="layui-form" id="fbaProjectmodify" lay-filter="fbaProjectmodify">
            <div class="layui-form-item">
                <label class="layui-form-label">新责任人</label>
                <div class="layui-input-block">
                    <select name="responsorId" lay-search layfilter = "fbaProject_responsor" id="fbaProject_responsor">
                        <option value=""></option>
                    </select>
                </div>
            </div>
        </form>
    </div>
</<script>

</script>
<script src="${ctx}/static/js/publishs/amazon/fbaProject.js"></script>
<script src="${ctx}/static/UploadImage.js"></script>


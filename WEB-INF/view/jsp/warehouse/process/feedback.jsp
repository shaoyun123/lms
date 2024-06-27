<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>产品问题反馈</title>
<style>
    #LAY-product-feedback .layui-form-item .layui-input-inline {
            float: left;
            width: 150px;
            margin-right: 10px;
    }
	#LAY-product-feedback td .layui-table-cell {
	    white-space: normal;
        overflow: visible;
	    word-wrap: break-word;
	    font-size: 13px;
	    height: inherit;
    }
    #LAY-product-feedback td .layui-table-cell{
        text-align:left;
    }

    #LAY-product-feedback td:nth-child(1) .layui-table-cell{
        text-align:center !important;
    }
	#gh_detail_layer td .layui-table-cell {
	    line-height: 26px;
	}
	#LAY-product-feedback .layui-form-item {
	    margin-bottom: 0
	}

    .flex_center{
        display: flex;
        justify-content: center;
        flex-wrap:wrap;
    }
    .d-none {
        display: none;
    }

    .flex_start{
        display: flex;
        justify-content: start;        
    }
    .sm_img{
        width: 40px;
        height: 40px;
        border:1px solid #ccc;
    }
    .ml_img{
        width: 80px;
        height: 80px;
        margin:5px;
        border:1px solid #ccc;
    }

    .img_list li{
        margin: 3px;
    }
    .w_50{
        width: 50%;
    }
    .w_70{
        width: 70%;
    }
    .w_90{
        width: 90%;
    }
    .mg_t{
        margin-top:10px;
    }
    .deleteIcon{
        background: #ccc;
        border-radius: 15px;
        width: 15px;
        height: 15px;
        line-height: 15px;
        text-align: center;
        opacity: .8;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
    }
    .deleteIcon:hover{
        background: #aaa;
    }
    .img_box{
        position: relative;
        display: inline-block;
    }
    .success{
        color:green !important;
    }
    .fail{
        color:red !important;
    }
    .note_high{
        font-weight: 600!important;
        font-size: 14px !important;
    }
    .layui-btn+.layui-btn{
        margin:5px 0 !important;
    }
</style>
<div class="layui-fluid" id="LAY-product-feedback">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="fb_searchForm" class="layui-form" action="" lay-filter="component-form-group">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" style="padding:0 15px">
                                    <select name="" lay-filter="feedback-skus" lay-search="" id="search_sku_type_f">
                                        <option value="0" selected>子SKU</option>
                                        <option value="1">父SKU</option>
                                        <option value="2">子SKU精确</option>
                                        <option value="3">父SKU精确</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="search_prod_sku_f">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">开发部门</label>
                              <div class="layui-input-block">
                                  <select name="feedbackOrganize" class="orgs_hp_custom" lay-filter="feedbackOrganizeFilter">
                                      <option value=""></option>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">开发专员</label>
                              <div class="layui-input-block">
                                  <select name="feedbackDeverId" class="users_hp_custom" lay-search data-roleList="开发专员">
                                  </select>
                              </div>
                          </div>
                            <!-- <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">开发专员</label>
                                    <div class="layui-input-block" hp-select>
                                        <div hidden hp-select-data id="bizzOwnerList">
                                        </div>
                                        <%--<input hidden name="buyerId" hp-select-value>--%>
                                        <input class="layui-input" name="bizzOwner_f" hp-select-text>
                                        <ul hp-select-optionContain class="supplierUl productlistSearch">
                                        </ul>
                                    </div>
                            </div> -->
                            <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">采购专员</label>
                                    <div class="layui-input-block" hp-select>
                                        <div hidden hp-select-data id="buyerList">
                                        </div>
                                        <%--<input hidden name="buyerId" hp-select-value>--%>
                                        <input class="layui-input" name="buyer_f" hp-select-text>
                                        <ul hp-select-optionContain class="supplierUl productlistSearch">
                                        </ul>
                                    </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">反馈人</label>
                                    <div class="layui-input-block" hp-select>
                                        <div hidden hp-select-data id="creaorList">
                                        </div>
                                        <%--<input hidden name="buyerId" hp-select-value>--%>
                                        <input class="layui-input" name="creaor_f" hp-select-text>
                                        <ul hp-select-optionContain class="supplierUl productlistSearch">
                                        </ul>
                                    </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">责任人</label>
                                    <div class="layui-input-block" hp-select>
                                        <div hidden hp-select-data id="responsorList">
                                        </div>
                                        <%--<input hidden name="buyerId" hp-select-value>--%>
                                        <input class="layui-input" name="responsor_f" hp-select-text>
                                        <ul hp-select-optionContain class="supplierUl productlistSearch">
                                        </ul>
                                    </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">实际处理人</label>
                                    <div class="layui-input-block" hp-select>
                                        <div hidden hp-select-data id="handlerList">
                                        </div>
                                        <%--<input hidden name="buyerId" hp-select-value>--%>
                                        <input class="layui-input" name="handler_f" hp-select-text>
                                        <ul hp-select-optionContain class="supplierUl productlistSearch">
                                        </ul>
                                    </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label" style="padding:0 15px">
                                    <select name="" lay-filter="notice" lay-search="" id="search_test_type_f">
                                        <option value="0" selected>商品名称</option>
                                        <option value="1">问题备注</option>
                                        <option value="2">处理备注</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="search_test_val_f">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">问题类型</label>
                                    <div class="layui-input-block" hp-select>
                                        <div hidden hp-select-data id="issueTypeList">
                                        </div>
                                        <%--<input hidden name="buyerId" hp-select-value>--%>
                                        <input class="layui-input" name="issueType" hp-select-text>
                                        <ul hp-select-optionContain class="supplierUl productlistSearch">
                                        </ul>
                                    </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">处理状态</label>
                                <div class="layui-input-block">
                                    <select name="purcase-pro" lay-filter="purcase-pro" lay-search="" id="prod_is_handle">
                                        <option value="">全部</option>
                                        <option value="0">未处理</option>
                                        <option value="1">供应商包装</option>
                                        <option value="2">仓库包装</option>
                                        <option value="3">转开发</option>
                                        <option value="4">不用处理</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">商品状态</label>
                                <div class="layui-input-block">
                                    <select name="purcase-pro" lay-filter="purcase-pro" lay-search="" id="prod_is_seales">
                                        <option value="">全部</option>
                                        <option value="false">停售</option>
                                        <option value="true">在售</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">供应商</label>
                                <div class="layui-input-block dimSearchContent">
                                    <input type="hidden" name="feed_supplierId" id="feed_supplierId">
                                    <div>
                                        <input id="feed_searchSupplier"  name="supplierName" class="layui-input"/>
                                    </div>
                                    <div class="dimResultDiv"></div>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">排序方式</label>
                                <div class="layui-input-block">
                                    <select name="purcase-pro" lay-filter="purcase-pro" lay-search="" id="prod_sort_type">
                                        <option value="">默认</option>
                                        <option value="1">需求时间正序</option>
                                        <option value="2">需求时间倒序</option>
                                        <option value="3">第一供应商正序</option>
                                        <option value="4">第一供应商倒序</option>
                                        <option value="5">子SKU正序</option>
                                        <option value="6">子SKU倒序</option>
                                        <option value="7">7天入库数量正序</option>
                                        <option value="8">7天入库数量倒序</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4 ">
                                <label class="layui-form-label" style="padding:0 15px">
                                    <select name="" lay-filter="feedback-skus" lay-search="" id="search_time_type_f">
                                        <option value="1" selected>反馈时间</option>
                                        <option value="2">商品创建时间</option>
                                        <option value="3">审核时间</option>
                                        <option value="4">处理时间</option>
                                    </select>
                                </label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="reqire_time" placeholder=" - ">
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">入库要求</label>
                                <div class="layui-input-block">
                                    <select name="packDesc" lay-filter="packDesc" lay-search="" id="packDesc">
                                        <option value="">请选择</option>
                                        <option value="1">有</option>
                                        <option value="0">无</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                            <div class="layui-input-block">
                                <button class="layui-btn layui-btn-sm" id="fb_search_form">查询</button>
                                <button class="layui-btn layui-btn-sm layui-btn-primary" id="fb_clean">清空</button>
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="feedbackCard">
                <div class="layui-card-header" id="layui-card-feedback">
                    <div style="float:right">
                        <%-- <permTag:perm funcCode="main_modify_chuli_btn">
                        </permTag:perm> --%>
                        <permTag:perm funcCode="feedback_main_modify_btn_cencel">
                            <button class="layui-btn layui-btn-sm" id="feedback_main_modify_btn_cencel">取消</button>
                        </permTag:perm>
                        <button class="layui-btn layui-btn-sm d-none" id="main_modify_btn_f">批量处理</button>
                        <button class="layui-btn layui-btn-sm" id="main_modify_btn_problem">批量修改反馈</button>
                        <%-- <button class="layui-btn layui-btn-sm" id="fb_feedback_btn_f">反馈问题</button> --%>
                        <permTag:perm funcCode="feedback_main_modify_audit_btn">
                            <button class="layui-btn layui-btn-sm" id="fb_feedback_btn_audit">批量审核</button>
                        </permTag:perm>
                        <button class="layui-btn layui-btn-sm" id="export_matchCateBtn_f">导出</button>
                    </div>
                </div>
                <div class="layui-tab" lay-filter="feedback_tab_filter">
                    <ul class="layui-tab-title">
                        <li class="layui-this" auditStatus="0">未审核(<span id="feedback_notAuditNum"></span>)</li>
                        <li auditStatus="1" title="点击统计下线数量">已审核(<span id="feedback_auditNum"></span>)</li>
                        <li auditStatus="2">取消(<span id="feedback_cancelNum"></span>)</li>
                    </ul>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="feedback_table_f"  lay-filter="feedback-table-filter"></table>
                </div>
            </div>
        </div>
    </div>
    </div>
<!-- 表格渲染模板 -->
<script type="text/html" id="fb_imageTpl">
    <div>
    <img width="60" height="60" data-original="${tplIVP}{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
    </div>
</script>
<script type="text/html" id="fb_sku">
    <div>
        {{#  if(d.isSale == '0'){ }}
        <span class="hp-badge layui-bg-red fr">停</span>
        {{#  } }}
        <span>子：</span><span class="feedback_fbsku_prodSSku">{{d.prodSSku}}</span>
    </div>
    <div><span>父：</span>{{d.pSku}}</div>
    <!-- 停用图标 -->
</script>
<script type="text/html" id="amaonz_purchase_url">
    <div>
        {{# if (d.supplierList && d.supplierList.length > 0) {}}
        {{# for (var i = 0; i < d.supplierList.length; ++i) {}}
        <div><a href="{{ d.supplierList[i].purchaseUrl }}"  style="color:cornflowerblue" target="_blank">{{ d.supplierList[i].supplierName }}</a></div>
        {{# } }}
        {{# } }}
    </div>
</script>

<script type="text/html" id="fb_employee">
    <div><span>开发：</span>{{d.bizzOwner}}</div>
    <div><span>采购：</span>{{d.buyer}}</div>
    <div><span>反馈：</span>{{d.creator}}</div>
    <div><span>责任：</span>{{d.responsor}}</div>
</script>

<script type="text/html" id="fb_style">
    <div><span>简称：</span>{{d.purchaseChannel?d.purchaseChannel:''}}</div>
    <div><span>单位：</span>{{d.unit?d.unit:''}}</div>
    <div><span>款式：</span>{{d.style?d.style:''}}</div>
    <div><span>包装类型：</span>{{d.inPackType?d.inPackType:''}}</div>
</script>

<script type="text/html" id="fb_price">
    <div><span>采购成本：</span>{{d.purchaseCostPrice?d.purchaseCostPrice:''}}</div>
    <div><span>内包装成本：</span>{{d.innerPackCost?d.innerPackCost:''}}</div>
    <div><span>仓库：</span><span class="feedback_fbprice_PackageFee">{{d.warehousePackageFee?d.warehousePackageFee:''}}</span></div>
    <div><span>供应商：</span>{{d.extraPackingCharge?d.extraPackingCharge:''}}</div>
</script>

<script type="text/html" id="fb_sales">
    <div><span>7日：</span>{{d.sevenSales?d.sevenSales:''}}</div>
    <div><span>15日：</span>{{d.fifteenSales?d.fifteenSales:''}}</div>
    <div><span>30日：</span>{{d.thirtySales?d.thirtySales:''}}</div>
</script>

<script type="text/html" id="fb_storage_num">
    <div><span>7日：</span>{{d.storageNumSeven?d.storageNumSeven:''}}</div>
    <div><span>15日：</span>{{d.storageNumFifteen?d.storageNumFifteen:''}}</div>
    <div><span>30日：</span>{{d.storageNumThirty?d.storageNumThirty:''}}</div>
</script>

<script type="text/html" id="fb_time">
    <div><span>商品：</span>{{layui.admin.Format(d.createTimeInfoS,"yyyy-MM-dd")}}</div>
    <div><span>反馈：</span>{{layui.admin.Format(d.createTime,"yyyy-MM-dd")}}</div>
    <div><span>审核：</span>{{layui.admin.Format(d.auditTime,"yyyy-MM-dd")}}</div>
    <div><span>处理：</span>{{layui.admin.Format(d.handleTime,"yyyy-MM-dd")}}</div>
</script>

<script type="text/html" id="fb_handleRemark">
    <div><span>处理人：</span>{{d.handler?d.handler:''}}</div>
    <div><span>状态：</span>
            {{# if(d.handleStatus == 0){ }}
                <span>未处理</span>
            {{# } }}
            {{# if(d.handleStatus == 1){ }}
                <span class="success">供应商包装</span>
            {{# } }}
            {{# if(d.handleStatus == 2){ }}
                <span class="fail">仓库包装</span>
            {{# } }}
            {{# if(d.handleStatus == 3){ }}
                <span>转开发</span>
            {{# } }} 
            {{# if(d.handleStatus == 4){ }}
                <span>不用处理</span>
            {{# } }}
    </div>
    <div><span>备注：</span><span class="note_high">{{d.handleRemark?d.handleRemark:''}}</span></div>
</script>

<script type="text/html" id="fb_operation">
    {{# if ( d.auditStatus!=2){ }}
        <button class="layui-btn layui-btn-sm layui-btn-primary" lay-event="modify">修改</button>
        <permTag:perm funcCode="feedback_detail_modify_btn">
            <button class="layui-btn layui-btn-sm layui-btn-primary" lay-event="modifyWarehouseFee">修改仓库操作费</button>
        </permTag:perm>
        {{# if ( d.auditStatus == 1){ }}
        <button class="layui-btn layui-btn-sm layui-btn-primary" lay-event="handle">处理</button>
        {{# } }}
    {{# } }}
</script>

<script type="text/html" id="feedback_img">
    <ul class="flex_center img_list">
        {{# if(d.issueImgs != null && d.issueImgs != ''){ }}
            {{#  var img = JSON.parse(d.issueImgs) }}
            {{#  for(var i = 0; i < img.length; i++){ }}
                {{# var imgs = img[i].trim(" ") }}
                    <li><img class="sm_img img_show_hide b1 lazy" data-original="{{d.urlPrefix}}{{imgs}}" data-onerror="layui.admin.img_noFind()"></li>
                {{# } }}
        {{# } }}
    </ul>
</script>

<script type="text/html" id="fb_productName_f">
    <div>名称：{{d.title}}</div>
    <div>入库要求：{{d.packDesc || ''}}</div>
    <div>下单备注：{{d.note || ''}}</div>
</script>
<!-- 问题反馈弹出模态框 -->
<script type="text/html" id="feedback_layer_f">
    <div class='w_50 mg_t'>
            <form class="layui-form" action="">
                    <div class="layui-form-item">
                      <label class="layui-form-label">问题类型</label>
                      <div class="layui-input-block">
                        <select name="issue_type" lay-verify="required">
                        </select>
                      </div>
                    </div>
                    <div class="layui-form-item layui-form-text">
                        <label class="layui-form-label">子SKU</label>
                        <div class="layui-input-block">
                            <textarea name="sku_textarea" placeholder="一行一个" class="layui-textarea"></textarea>
                        </div>
                    </div>
                    <div class="layui-form-item layui-form-text">
                        <label class="layui-form-label">问题备注</label>
                        <div class="layui-input-block">
                            <textarea name="issue_remark" placeholder="" class="layui-textarea"></textarea>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">问题类型<br/>(最多三张)</label>
                        <div class="layui-input-block">
                            <button type="button" class="layui-btn" id="upload_btn"><i class="layui-icon"></i>选择图片</button>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-input-block">
                            <div id='div_prev' title=''></div>
                        </div>
                    </div>
        </form>
    </div>
</script>
<!-- 处理方案弹框 -->
<script type="text/html" id="warehouse_feedback_handle_layer">
    <div class='w_70 mg_t' id="warehouse_feedback_handle_container">
    </div>    
</script>
<script type="text/html" id="warehouse_feedback_handle_containerTpl">
    <form class="layui-form" id="warehouse_feedback_handle_form">
        <div class="layui-form-item">
            <label class="layui-form-label">处理方案</label>
            <div class="layui-input-block">
                <input type="radio" lay-filter="handle_status" name="handleStatus" value="0" title="未处理" {{d.handleStatus == 0 ? 'checked': ''}} 
                 disabled>
                <input type="radio" lay-filter="handle_status" name="handleStatus" value="1" title="供应商包装" {{d.handleStatus == 1 ? 'checked': ''}}>
                <input type="radio" lay-filter="handle_status" name="handleStatus" value="2" title="需要仓库包装" {{d.handleStatus == 2 ? 'checked': ''}}>
                <input type="radio" lay-filter="handle_status" name="handleStatus" value="3" title="转开发" {{d.handleStatus == 3 ? 'checked': ''}}>
                <input type="radio" lay-filter="handle_status" name="handleStatus" value="4" title="不用处理" {{d.handleStatus == 4 ? 'checked': ''}}>
            </div>
        </div>
        <div class="layui-form-item" id="operateEl">
            <div class="layui-inline">
                <label class="layui-form-label">供应商操作费(￥)</label>
                <div class="layui-input-inline">
                    <input type="text" name="extraPackingCharge" autocomplete="off" class="layui-input" value="{{d.extraPackingCharge || ''}}">
                </div>
            </div>
            {{# if(!d.isBatch){ }}
            <div class="layui-inline">
                <label class="layui-form-label">采购基数</label>
                <div class="layui-input-inline">
                    <input type="text" class="layui-input" value="{{d.purBaseNum || ''}}" disabled>
                    <span style="color:#f00;position:absolute;top:7px;right:-110px;">注意采购基数的影响！</span>
                </div>
            </div>
            {{# } }}
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">处理备注</label>
            <div class="layui-input-block">
                <textarea name="handleRemark" class="layui-textarea">{{d.handleRemark || ''}}</textarea>
            </div>
        </div>
    </form> 
</script>
<!-- 修改方案弹框 -->
<script type="text/html" id="mofidy_layer">
    <div class='w_50 mg_t'>
        <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label">问题类型</label>
                <div class="layui-input-block">
                    <select name="issue_type_one" lay-verify="required">
                    </select>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">子SKU</label>
                <div class="layui-input-block">
                    <%--<textarea name="sku_textarea" placeholder="一行一个" class="layui-textarea"></textarea>--%>
                    <input type="text" class="layui-input" id="sku_textarea" disabled/>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">问题备注</label>
                <div class="layui-input-block">
                    <textarea name="issue_remark_one" placeholder="" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">问题类型<br/>(最多三张)</label>
                <div class="layui-input-block">
                    <button type="button" class="layui-btn" id="upload_btn_m"><i class="layui-icon"></i>选择图片</button>
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <div id='div_prev_m' title=''></div>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 批量修改方案弹框 -->
<script type="text/html" id="main_modify_problem">
    <div class='w_50 mg_t'>
        <form class="layui-form" action="">
            <div class="layui-form-item">
                <label class="layui-form-label">问题类型</label>
                <div class="layui-input-block">
                    <select name="issue_type_main" lay-verify="required">
                    </select>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">问题备注</label>
                <div class="layui-input-block">
                    <textarea name="issue_remark_main" placeholder="" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<%--修改仓储费--%>
<script type="text/html" id="modify_warehouse_fee">
    <div class='w_50 mg_t'>
        <form class="layui-form" action="">
            <input hidden id="modifyWarehouseFeeId" >
            <div class="layui-form-item">
                <label class="layui-form-label">子sku</label>
                <div class="layui-input-block">
                   <input type="text" name="feedbackProdSSku"  class="layui-input" />
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">当前金额</label>
                <div class="layui-input-block">
                    <input type="text" name="oldWarehouseFee" value="" readonly class="layui-input" />
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">修改后的金额</label>
                <div class="layui-input-block">
                    <input type="text" name="warehouseFee" value="" class="layui-input" />
                </div>
            </div>
        </form>
    </div>
</script>

<script src="${ctx}/static/js/warehouse/feedback.js"></script>
<script src="${ctx}/static/template.js"></script>
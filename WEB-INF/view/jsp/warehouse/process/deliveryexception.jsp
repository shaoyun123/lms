<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>发货异常反馈</title>
<style>
    .fieldBox{
        float: left;
        width: 12.5%;
        height: 25px;
    }

    .flex_center{
        display: flex;
        justify-content: center;
        flex-wrap:wrap;
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
    .mg_t{
        margin-top:10px;
    }
    .mg{
        margin:0 10px;
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
    /* .layui-btn+.layui-btn{
        margin:5px 0 !important;
    } */
</style>
<div class="layui-fluid" id="LAY-deliveryexception">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form id="dexcept_searchForm" class="layui-form" action="" lay-filter="component-form-group">
                        <input type="hidden" id="deliveryexception_hidden_mark" value="0">
                        <div class="layui-form-item">
                           <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">平台</label>
                                <div class="layui-input-block">
                                    <select lay-filter="publish_dexcept_platList_sel" id="publish_dexcept_platList_sel" name="platCodeStr">
                                        
                                    </select>
                                </div>
                            </div>
                            <%--<div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">店铺</label>
                                <div class="layui-input-block">
                                    <select lay-filter="publish_dexcept_storeAcct_sel" id="publish_dexcept_storeAcct_sel" xm-select="publish_dexcept_storeAcct_sel"   xm-select-search
                                            xm-select-search-type="dl" xm-select-skin="normal"></select>
                                </div>
                            </div>--%>
                            <%-- <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">平台</label>
                                    <div class="layui-input-block">
                                        <input name="platCodeStr" class="layui-input" autocomplete="off">
                                    </div>
                                </div>--%>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <input name="storeAcctStr" class="layui-input" autocomplete="off">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label" style="padding:0 15px">
                                            <select name="searchType" lay-filter="delexception-skus" lay-search="" id="delexception_sku_type_f">
                                                <option value="s" selected>子SKU</option>
                                                <option value="p">父SKU</option>
                                                <option value="st">子SKU精确</option>
                                                <option value="pt">父SKU精确</option>
                                            </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input name="skuStr" type="text" class="layui-input" id="delexception_prod_sku_f">
                                        </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">异常类型</label>
                                    <div class="layui-input-block">
                                        <select name="issueType" >
                                            <option value="">请选择</option>
                                            <c:forEach items="${issueTypes}" var="issueItem">
                                                <option value="${issueItem.name}">${issueItem.name}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label" style="padding:0 15px">
                                     <select name="operatorType" lay-search="" lay-filter="de_search_form_operatorType_filter">
                                         <option value="bizzOwner" selected>开发</option>
                                         <option value="creator">创建人</option>
                                     </select>
                                    </label>
                                    <div class="layui-input-block">
                                        <select name="operator" id="de_search_form_operator"  lay-search=""></select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">包装员</label>
                                    <div class="layui-input-block">
                                        <select name="packager" lay-filter="" lay-search="" id="packager">
                                            <option value="">请选择</option>
                                            <c:forEach items="${packagers}" var="packager">
                                                <option value="${packager}">${packager}</option>
                                            </c:forEach>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <div class="layui-form-label" style="padding:0 15px">
                                        <select name="orderIdType" lay-search="" >
                                            <option value="1" selected>订单号</option>
                                            <option value="2">店铺单号</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input name="allrootNidStr" class="layui-input" autocomplete="off">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">问题描述</label>
                                    <div class="layui-input-block">
                                        <input name="issueRemark" class="layui-input" autocomplete="off">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2">
                                    <label class="layui-form-label">排序方式</label>
                                    <div class="layui-input-block">
                                        <select name="orderByStr" lay-filter="" lay-search="">
                                            <option value="pdi.create_time desc" selected>按录入时间倒序</option>
                                            <option value="pdi.create_time asc">按录入时间正序</option>
                                            <option value="pdi.delivery_time desc">按发货时间倒序</option>
                                            <option value="pdi.delivery_time asc">按发货时间正序</option>
                                            <option value="wsw.stock_location desc">按库位倒序</option>
                                            <option value="wsw.stock_location asc">按库位正序</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md4 layui-col-lg4">
                                    <div class="layui-form-label" style="padding:0 15px">
                                        <select name="dateType" lay-search="" >
                                            <option value="1" selected>录入时间</option>
                                            <option value="2">订单时间</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block">
                                        <input name="searchTime" class="layui-input" autocomplete="off" id="search_time">
                                    </div>
                                </div>
                                <div class="layui-col-md2 layui-col-lg2 pl20">
                                    <button class="layui-btn layui-btn-sm" id="de_search_form" type="button">查询</button>
                                    <button class="layui-btn layui-btn-sm layui-btn-primary" id="de_clean" type="reset">清空</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card" id="dexceptionCard">
              <div class="fixHigh">
                <div class="layui-card-header">
                    <div class="fixTab">
                        <div class="layui-tab" lay-filter="deliveryexception_mark_div">
                            <ul class="layui-tab-title">
                                <li class="layui-this">待处理(<span id="deliveryexception_need_number">0</span>)</li>
                                <li>已处理(<span id="deliveryexception_number">0</span>)</li>
                            </ul>
                        </div>
                        <div>
                          <%-- <button class="layui-btn layui-btn-sm primary" id="exception_downLoadTemplet">下载模板</button>
                          <button class="layui-btn layui-btn-sm primary" onclick="document.getElementById('import_issuelist').click()">excel导入</button> --%>
                          <input type="file" name="" id="import_issuelist" hidden>
                          <%-- <button class="layui-btn layui-btn-sm primary" id="inputexceptions">录入异常</button> --%>
                          <button class="layui-btn layui-btn-sm primary" type="button" id="export_issuelist">导出</button>
                        </div>
                    </div>
                </div>
              </div>
              <div class="layui-card-body">
                  <!-- 表格的数据渲染 -->
                  <table class="layui-table" id="deliveryexception_table"  lay-filter="deliveryexception_table"></table>
              </div>
            </div>
        </div>
    </div>
</div>

<script>
    <%--异常类型--%>
    var issueArray = new Array();
    <c:forEach items="${deliveryIssueTypes}" var="item">
    issueArray.push('${item.name}');
    </c:forEach>
    <%--包装员--%>
    var packagers = new Array();
    <c:forEach items="${packagers}" var="item">
    packagers.push( '${item}');
    </c:forEach>
</script>
<!-- 表格渲染模板 -->
<script type="text/html" id="tpl_orderNo">
    <div style="text-align: left">
        <div>订单：{{# if(d.allrootNid != null && d.allrootNid != ''){ }}<span>{{d.allrootNid}}</span>{{# } }}</div>
        <div>店铺单号：{{# if(d.orderId != null && d.orderId != ''){ }}<span>{{d.orderId}}</span>{{# } }}</div>
        <div>店铺：{{# if(d.storeAcct != null && d.storeAcct != ''){ }}<span>{{d.storeAcct}}</span>{{# } }}</div>
    </div>
</script>
<script type="text/html" id="tpl_sku_status">
    <div style="text-align: left">
        <div style="white-space: nowrap;">实发：{{# if(d.deliverySku != null && d.deliverySku != ''){ }}<span>{{d.deliverySku}}</span>{{# } }}</div>
        <div style="white-space: nowrap;">异常：{{# if(d.issueSku != null && d.issueSku != ''){ }}<span>{{d.issueSku}}</span>{{# } }}</div>
        <div style="white-space: nowrap;">库位：{{# if(d.stockLocation != null && d.stockLocation != ''){ }}<span>{{d.stockLocation}}</span>{{# } }}</div>
    </div>
</script>
<script type="text/html" id="tpl_stuff">
    <div style="text-align: left">
        <div style="white-space: nowrap;">采购：{{# if(d.buyer != null && d.buyer != ''){ }}<span>{{d.buyer}}</span>{{# } }}</div>
        <div style="white-space: nowrap;">开发：{{# if(d.bizzOwner != null && d.bizzOwner != ''){ }}<span>{{d.bizzOwner}}</span>{{# } }}</div>
        <div style="white-space: nowrap;">创建：{{# if(d.creator != null && d.creator != ''){ }}<span>{{d.creator}}</span>{{# } }}</div>
    </div>
</script>
<script type="text/html" id="tpl_specifications">
    <div style="text-align: left">
        <div>简称：{{# if(d.purchaseChannel != null && d.purchaseChannel != ''){ }}<span>{{d.purchaseChannel}}</span>{{# } }}</div>
        <div>单位：{{# if(d.unit != null && d.unit != ''){ }}<span>{{d.unit}}</span>{{# } }}</div>
        <div>款式：{{# if(d.style != null && d.style != ''){ }}<span>{{d.style}}</span>{{# } }}</div>
    </div>
</script>
<script type="text/html" id="tpl_quality">
    <div style="text-align: left">
        <div>数量：{{# if(d.issueNum != null && d.issueNum != ''){ }}<span>{{d.issueNum}}</span>{{# } }}</div>
        <div>重量：{{# if(d.issueWeight != null && d.issueWeight != ''){ }}<span>{{d.issueWeight}}(g)</span>{{# } }}</div>
    </div>
</script>

<script type="text/html" id="tpl_money">
    <div>
      <span>{{d.issueAmount || ''}}</span>
    </div>
</script>
<script type="text/html" id="tpl_issue">
    <div><span>[{{ d.issueType }}]</span><span>{{ d.issueRemark }}</span></div>
</script>
<%--仓库处理人--%>
<script type="text/html" id="tpl_packager">
    <div style="text-align: left">
        <div style="white-space: nowrap;">配货：{{ d.pickUserName || '' }}</div>
        <div style="white-space: nowrap;">投篮：{{ d.checkUserName || '' }}</div>
        <div style="white-space: nowrap;">包装：{{ d.packager || '' }}</div>
        {{# if(d.dealPerson){ }}
            <div style="white-space: nowrap;">处理：{{d.dealPerson || ''}}</div>
        {{# } }}
    </div>
</script>
<script type="text/html" id="tpl_time">
    <div style="text-align: left">
        <div style="white-space: nowrap;">录入：<span>{{ d.createTime }}</span></div>
        <div style="white-space: nowrap;">发货：{{# if(d.deliveryTime != null && d.deliveryTime != ''){ }}<span>{{d.deliveryTime}}</span>{{# } }}</div>
        {{# if(d.dealTime){ }}
            <div style="white-space: nowrap;">处理：<span>{{ layui.admin.Format( d.dealTime, "yyyy-MM-dd hh:mm:ss")}}</span></div>
        {{#  } }}
    </div>
</script>

<script type="text/html" id="tpl_operation">
    <div class="layui-table-cell">
        {{# if(d.processStatus=='0'){ }}
            <button class="layui-btn layui-btn-xs layui-btn-primary" lay-event="deal">处理</button>
            <br>
        {{# } }}
        <button class="layui-btn layui-btn-xs layui-btn-primary" lay-event="modify">修改</button>
    </div>
</script>

<script type="text/html" id="tpl_img">
    <ul class="flex_center img_list">
        {{# if(d.issueImgs != null && d.issueImgs != ''){ }}
        {{#  var imgArr = d.issueImgs.split(',') }}
        {{#  for(var i = 0; i < imgArr.length; i++){ }}
        {{# var img = imgArr[i].trim(" ") }}
        <li><img class="sm_img img_show_hide b1 lazy" data-original="{{img}}" data-onerror="layui.admin.img_noFind()"></li>
        {{# } }}
        {{# } }}
    </ul>
</script>

<!-- 问题反馈弹出模态框 -->
<script type="text/html" id="layer_inputexcept">
    <div class='mg_t'>
        <form class="layui-form mg" action="" id="issue_addForm">
            <div class="layui-col-md12 layui-col-lg12">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">问题类型</label>
                    <div class="layui-input-block">
                        <select name="issueType" lay-verify="required" id="layer_issue_select" >
                            <%--<option value="">请选择</option>--%>
                            <c:forEach items="${issueTypes}" var="issueItem">
                                <option value="${issueItem.name}">${issueItem.name}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">普源订单号</label>
                    <div class="layui-input-block">
                        <input name="allrootNid" class="layui-input" lay-verify="required" placeholder="必填">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <div style="min-height: 36px;"><i class="layui-icon layui-icon-refresh-1" style="line-height: 36px;margin-left:5px;" id="layer_nid_refresh"></i></div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">平台</label>
                    <div class="layui-input-block">
                        <input name="platCode" class="layui-input " lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                        <input name="storeAcct" class="layui-input " lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">店铺单号</label>
                    <div class="layui-input-block">
                        <input name="orderId" class="layui-input " lay-verify="required" >
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常sku</label>
                    <div class="layui-input-block">
                        <input name="issueSku" class="layui-input" placeholder="商品子sku,必填" lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常数量</label>
                    <div class="layui-input-block">
                        <input name="issueNum" class="layui-input" >
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常重量(g)</label>
                    <div class="layui-input-block">
                        <input name="issueWeight" class="layui-input" >
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">实发sku</label>
                    <div class="layui-input-block">
                        <input name="deliverySku" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">金额</label>
                    <div class="layui-input-block">
                        <div class="layui-col-md6 layui-col-lg6">
                            <select name="issueCurrency">
                                <c:forEach items="${currencyEnums}" var="item">
                                    <option value="${item}">${item}</option>
                                </c:forEach>
                            </select>
                        </div>
                        <div class="layui-col-md6 layui-col-lg6">
                            <input name="issueAmount" class="layui-input" placeholder="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">包装员</label>
                    <div class="layui-input-block">
                        <input name="packager" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">发货时间</label>
                    <div class="layui-input-block">
                        <input name="deliveryTime" class="layui-input" id="delivery_time_str" placeholder="请选择">
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">问题描述</label>
                <div class="layui-input-block">
                    <textarea name="issueRemark" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12 mg_t">
                <label class="layui-form-label">图片URL</label>
                <div class="layui-input-block">
                    <textarea name="issueImgs" class="layui-textarea" placeholder="多个以换行分隔"></textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12 mg_t">
                <div class="layui-input-block">
                <button type="button" class="layui-btn layui-btn-sm" id="delivery_issue_upload">上传图片</button>
                </div>
            </div>
            <!-- <div class="layui-form-item layui-form-text">
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
            </div> -->
        </form>
    </div>
</script>
<!-- 处理方案弹框 -->
<script type="text/html" id="handle_layer">
    <div class='w_50 mg_t'>
        <form class="layui-form" id="handle_form_f">
            <div class="layui-form-item">
                <label class="layui-form-label">处理方案</label>
                <div class="layui-input-block">
                    <input type="radio" name="handle_state" value="0" title="未处理" id="is_handle">
                    <input type="radio" name="handle_state" value="1" title="处理成功" id="deliverException_is_handle1">
                    <input type="radio" name="handle_state" value="2" title="处理失败" id="deliverException_is_handle2">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">责任人转开发</label>
                <div class="layui-input-block">
                    <input type="radio" name="is_modify_handler" value="false" title="否" id="is_modify_handler_no">
                    <input type="radio" name="is_modify_handler"  value="true" title="是" id="is_modify_handler_yes_unused">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">额外包装费(￥)</label>
                <div class="layui-input-block">
                    <input  class="layui-input" autocomplete="off" id="extra_pack_money">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">处理备注</label>
                <div class="layui-input-block">
                    <textarea name="note_text" placeholder="" class="layui-textarea"></textarea>
                </div>
            </div>
        </form>
    </div>
</script>
<!-- 修改方案弹框 -->
<script type="text/html" id="mofidy_layer">
    <div class='mg_t'>
        <form class="layui-form mg" action="" id="issue_mofidy_form">
            <div class="layui-col-md12 layui-col-lg12">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">问题类型</label>
                    <div class="layui-input-block">
                        <select name="issueType" lay-verify="required" id="layer_issue_select">
                            <c:forEach items="${issueTypes}" var="issueItem">
                                <option value="${issueItem.name}">${issueItem.name}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">订单号</label>
                    <div class="layui-input-block">
                        <input name="allrootNid" class="layui-input" lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <div style="min-height: 36px;"></div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">平台</label>
                    <div class="layui-input-block">
                        <input name="platCode" class="layui-input" lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block">
                        <input name="storeAcct" class="layui-input" lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">店铺单号</label>
                    <div class="layui-input-block">
                        <input name="orderId" class="layui-input" lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常sku</label>
                    <div class="layui-input-block">
                        <input name="issueSku" class="layui-input" placeholder="子sku,必填" lay-verify="required">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常数量</label>
                    <div class="layui-input-block">
                        <input name="issueNum" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">异常重量(g)</label>
                    <div class="layui-input-block">
                        <input name="issueWeight" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">实发sku</label>
                    <div class="layui-input-block">
                        <input name="deliverySku" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">金额</label>
                    <div class="layui-input-block">
                      <input name="issueAmount" class="layui-input" readonly>
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">包装员</label>
                    <div class="layui-input-block">
                        <input name="packager" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md4 layui-col-lg4">
                    <label class="layui-form-label">发货时间</label>
                    <div class="layui-input-block">
                        <input name="deliveryTime" class="layui-input" id="delivery_time_str" placeholder="请选择">
                    </div>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12">
                <label class="layui-form-label">问题描述</label>
                <div class="layui-input-block">
                    <textarea name="issueRemark" class="layui-textarea"></textarea>
                </div>
            </div>
            <div class="layui-col-md12 layui-col-lg12 mg_t">
                <label class="layui-form-label">图片URL</label>
                <div class="layui-input-block">
                    <textarea name="issueImgs" class="layui-textarea"></textarea>
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

<script type="text/html" id="issue_exportPop">
    <form class="layui-form">
        <div><input type="checkbox" title="全选" lay-filter="selectAll_issuelist"></div>
    </form>
    <div class="p20">
        <div class="layui-tab layui-tab-card">
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show p20">
                    <form class="layui-form" action="" lay-filter="component-form-group" id="exportForm_issuelist">
                        <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                            <%--<legend style="font-size:14px">基本信息</legend>--%>
                        <%--</fieldset>--%>
                        <%--<div class="fieldBox"><input type="checkbox" title="子sku" disabled lay-skin="primary" checked></div>--%>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="普源订单号" title="普源订单号" disabled checked lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="店铺订单号" title="店铺订单号" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="平台" title="平台" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="店铺" title="店铺" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="异常sku" title="异常sku" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="库位" title="库位" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="商品名称" title="商品名称" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="采购人员" title="采购人员" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="开发人员" title="开发人员" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="简称" title="简称" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="单位" title="单位" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="款式" title="款式" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="实发sku" title="实发sku" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="异常数量" title="异常数量" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="异常重量(g)" title="异常重量(g)" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="币种" title="币种" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="金额" title="金额" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="问题类型" title="问题类型" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="问题描述" title="问题描述" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="反馈图片" title="反馈图片" lay-skin="primary"></div>
<%--                        <div class="fieldBox"><input type="checkbox" name="baseField" value="包装员" title="包装员" lay-skin="primary"></div>--%>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="配货人" title="配货人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="投篮人" title="投篮人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="包装人" title="包装人" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="录入时间" title="录入时间" lay-skin="primary"></div>
                        <div class="fieldBox"><input type="checkbox" name="baseField" value="发货时间" title="发货时间" lay-skin="primary"></div>
                        <div style="clear:left"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</script>

<script src="${ctx}/static/js/warehouse/deliveryexception.js"></script>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>  
<title>ebay侵权通知</title>
<style>
      .layui-form-item .layui-input-inline {
            float: left;
            width: 150px;
            margin-right: 10px;
       }
       .layui-form-radio{
           padding-right: 0
       }
      .layui-table-cell {
          height:auto;
          overflow:visible;
          text-overflow:inherit;
          white-space:normal;
      }
</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-md12 layui-col-lg12">
            <div class="layui-card">
                <%--<div class="layui-card-header">搜索列表</div>--%>
                <div class="layui-card-body">
                        <form class="layui-form"  id="ebayTortSearchForm">
                            <div class="layui-form-item">
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">侵权类型</label>
                                    <div class="layui-input-block">
                                        <select name="tortType" id="ebayTortTypeSearchSel" lay-search>
                                           <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">部门</label>
                                    <div class="layui-input-block">
                                        <select id="ebayTortSearchDepartSel" lay-search lay-filter="ebayTortSearchDepartSel" class="orgs_hp_custom" name="ebayTortSearchDepartSel">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">销售人员</label>
                                    <div class="layui-input-block">
                                        <select id="ebayTortSearchSalesmanSel" lay-search lay-filter="ebayTortSearchSalesmanSel" class="users_hp_custom" data-rolelist="ebay专员" name="ebayTortSearchSalesmanSel">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">店铺</label>
                                    <div class="layui-input-block">
                                        <select id="ebayTortSearchAcctSel" lay-filter="ebayTortSearchAcctSel" xm-select="ebayTortSearchAcctSel" unlimited-select="all_store_can_sel" class="users_hp_store_multi" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" data-platcode="ebay" name="ebayTortSearchAcctSel"></select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">产品归属人</label>
                                    <div class="layui-input-block">
                                        <select name="bizzOwnerId" lay-search id="ebayTortSearchOwnerIdSel">
                                            <option value="">请选择</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">开发建议</label>
                                    <div class="layui-input-block">
                                        <select id="ebayTortSearchDevProcSel" lay-search>
                                            <option value="">全部</option>
                                            <option value="0">未处理</option>
                                            <option value="1">已处理</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">销售处理</label>
                                    <div class="layui-input-block">
                                        <select id="ebayTortSearchSellProcSel" lay-search="">
                                            <option value="">全部</option>
                                            <option value="0">未处理</option>
                                            <option value="1">已处理</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">邮件接收时间</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" id="ebayTortStartTime">
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">邮件结束时间</label>
                                    <div class="layui-input-block">
                                        <input type="text" class="layui-input" id="ebayTortEndTime">
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">同步侵权库</label>
                                    <div class="layui-input-block">
                                        <select id="ebaySyncTortSel" lay-search>
                                            <option value="">全部</option>
                                            <option value="1">是</option>
                                            <option value="0">否</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">搜索类型</label>
                                    <div class="layui-input-block">
                                        <select id="ebayTortSearchTypeSel" lay-search>
                                            <option value="1">itemID</option>
                                            <option value="2">商品父SKU</option>
                                            <option value="3">店铺父SKU</option>
                                            <option value="4">投诉人</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2">
                                    <label class="layui-form-label">搜索内容</label>
                                    <div class="layui-input-block">
                                        <input type="text" id="ebayTortSearchVal" class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg2 pl20">
                                    <button type="button" class="layui-btn layui-btn-sm keyHandle" data-type="reload" id="ebayTortSearchBtn">搜索</button>
                                    <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm" id="ebayTortResetBtn">清空</button>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
            <div class="layui-card" id="ebaytorttipsCard">
                <div class="layui-card-header toFixedContain">
                    <span class="numCount">侵权数量(<span class="red" id="ebayTortNumSp"></span>)</span>
                    <button class="layui-btn layui-btn-sm fr"  id="updateEbayTortType" style="margin-top:5px">修改侵权类型</button>
                    <button class="layui-btn layui-btn-sm fr" id="addEbayTortMsg" style="margin-top:5px">新增侵权</button>
                    <button class="layui-btn layui-btn-sm fr" id="devSuggestBatch" style="margin-top:5px">开发建议</button>
                    <button class="layui-btn layui-btn-sm fr" id="saleHandleBatch" style="margin-top:5px">销售处理</button>
                </div>
                <div class="layui-card-body">
                    <!-- 表格的数据渲染 -->
                    <table class="layui-table" id="ebayTortTable" lay-filter="ebayTortTable"></table>
                    <!-- 工具条模板,写在script里面，使用laytpl -->
                    <script type="text/html" id="ebayTortImageBar">
                        {{# if(d.imgUri != undefined && d.imgUri !=''){ }}
                        <img class="layui-upload-img img_show_hide lazy b1"   style="width:64px;height:64px;display:inline-block" data-original= '${tplIVP}{{ d.imgUri }}' data-onerror="layui.admin.img_noFind()">
                        {{# } }}
                    </script>
                    <script type="text/html" id="ebayTortItemIdBar">
                        <a href="https://www.ebay.com/itm/{{ d.itemId}}" target='_blank' style="color: #428bca;" title="查看item详情">{{ d.itemId || '' }}</a>
                    </script>
                    <script type="text/html" id="ebayTortTimeBar">
                        <div style="text-align: left;padding-left: 5px;line-height:20px">
                            <span style="color:#999">邮件: </span>{{ Format( d.emailTime, "yyyy-MM-dd hh:mm:ss")}}<br/>
                            <span style="color:#999">创建: </span>{{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}}<br/>
                            <span style="color:#999">开发: </span>{{ Format( d.devProcTime, "yyyy-MM-dd hh:mm:ss")}}<br/>
                            <span style="color:#999">销售: </span>{{ Format( d.sellerProcTime, "yyyy-MM-dd hh:mm:ss")}}<br/>
                        </div>
                    </script>
                    <script type="text/html" id="ebayTortDeveAdviceBar">
                        <span style="color:#999">{{ d.developer || '' }}: </span>{{ d.devSuggestions || '' }}<br/>
                    </script>
                    <script type="text/html" id="ebayTortSaleOperBar">
                        <span style="color:#999">{{ d.seller || ''}}: </span>{{ d.sellerHandling || ''}}<br/>
                    </script>
                    <script type="text/html" id="ebayTortOperBar">
                        <a class="layui-btn layui-btn-xs" lay-event="detail">详情</a><br/>
                        <a class="layui-btn layui-btn-xs" lay-event="syncTort">同步到侵权库</a><br/>
                        <a class="layui-btn layui-btn-xs" lay-event="devSuggest">开发建议</a><br/>
                        <a class="layui-btn layui-btn-xs" lay-event="saleHandle">销售处理</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- 弹出框信息 -->
<!-- 新增侵权弹出框 -->
<script type="text/html" id="addEbayTortLayer">
    <div class="p20">
        <form class="layui-form" id="addEbayTortForm">
                <div class="layui-form-item">
                  <label class="layui-form-label">Item ID</label>
                  <div class="layui-input-block">
                    <input type="text" name="itemId" id="ebay_tort_itemId" class="layui-input" style="display:inline-block;width:500px">
                    <button type="button" class="layui-btn layui-btn-xs laui-btn-normal" id="addEbayTortSyncInfoBtn">查询</button>
                  </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">店铺</label>
                    <div class="layui-input-block" style="width:500px">
                        <select name="storeAcctId" lay-search id="addEbayTortStoreAcctSel">
                            <option value="">请选择</option>
                        </select>
                    </div>
                </div>
                <div class="layui-form-item">
                        <label class="layui-form-label">产品归属人</label>
                        <div class="layui-input-block" style="width:500px">
                            <select name="bizzOwnerId" lay-search id="addEbayTortOwnerIdSel">
                                <option value="">请选择</option>
                            </select>
                        </div>
                </div>
                <div class="layui-form-item">
                        <label class="layui-form-label">店铺父SKU</label>
                        <div class="layui-input-block">
                          <input type="text" name="storePSku" id="ebay_tort_storePSku" class="layui-input" style="display:inline-block;width:500px">
                        </div>
                </div>
                <input type="hidden" name="imgUri" id="ebay_tort_imgUri" class="layui-input" style="display:inline-block;width:500px">
                <div class="layui-form-item">
                            <label class="layui-form-label">商户父SKU</label>
                            <div class="layui-input-block">
                              <input type="text" name="pSku" id="ebay_tort_pSku"  class="layui-input" style="width:500px">
                            </div>
                </div>
                <div class="layui-form-item">
                        <label class="layui-form-label">侵权类型</label>
                        <div class="layui-input-block" style="width:500px" >
                            <select name="tortType" lay-search id="addEbayTortTypeSel">
                                <option value="">请选择</option>
                            </select>
                        </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">侵权品牌</label>
                    <div class="layui-input-block">
                        <input type="text" class="layui-input" id="ebay_tort_brand"  name="tortBrand" placeholder="录入品牌或侵权商标名称.不要录入：N/A，中文字段，公司名称，品牌投诉人等非商标字段.">
                    </div>
                </div>
                <div class="layui-form-item">
                        <label class="layui-form-label">投诉人</label>
                        <div class="layui-input-block">
                          <input type="text" name="complainant" id="ebay_tort_complainant"  class="layui-input" style="width:500px">
                        </div>
                </div>
                <div class="layui-form-item">
                        <label class="layui-form-label">邮件时间</label>
                        <div class="layui-input-block">
                          <input type="text" name="emailTime" class="layui-input" style="width:500px" id="addEbayTortEmatilTime">
                        </div>
                </div>
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">客服备注</label>
                    <div class="layui-input-block" style="width:500px;min-height: 0px;">
                        <textarea name="customerSrvNote" id="ebay_tort_customerSrvNote"  class="layui-textarea" rows="2"></textarea>
                    </div>
                </div>
                <div class="layui-form-item layui-form-text">
                  <label class="layui-form-label">邮件正文</label>
                  <div class="layui-input-block" style="width:500px">
                    <textarea name="emailContent" id="ebay_tort_emailContent"  class="layui-textarea" rows="8"></textarea>
                  </div>
                </div>
                <div class="layui-form-item" style="display: none;">
                    <div class="layui-input-block taRight">
                        <button class="layui-btn"  lay-filter="submitAddEbayTortMsg" id="submitAddEbayTortMsgBtn">提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                    </div>
                </div>
        </form>
    </div>
</script>
<%-- <div id="addEbayTortLayer" class="disN p20"></div> --%>

<!-- 侵权详情弹出框 -->
<script type="text/html" id="editEbayTortLayer">
    <div class="p20">
        <form class="layui-form" id="editEbayTortForm">
            <input type="hidden" name="id" class="layui-input" lay-verify="required" >
            <div class="layui-form-item">
                <label class="layui-form-label">Item ID</label>
                <div class="layui-input-block">
                    <input type="text" name="itemId" class="layui-input" style="display:inline-block;width:500px">
                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="editEbayTortSyncInfoBtn">查询</button>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block" style="width:500px">
                    <select name="storeAcctId" lay-search id="editEbayTortStoreAcctSel">
                        <option value="">请选择</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">产品归属人</label>
                <div class="layui-input-block" style="width:500px">
                    <select name="bizzOwnerId" lay-search id="editEbayTortOwnerIdSel">
                        <option value="">请选择</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">店铺父SKU</label>
                <div class="layui-input-block">
                    <input type="text" name="storePSku" class="layui-input" style="display:inline-block;width:500px">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">商户父SKU</label>
                <div class="layui-input-block">
                    <input type="text" name="pSku" class="layui-input" style="width:500px">
                </div>
            </div>
            <input type="hidden" name="imgUri" class="layui-input" style="width:500px">
            <div class="layui-form-item">
                <label class="layui-form-label">侵权类型</label>
                <div class="layui-input-block" style="width:500px" >
                    <select name="tortType" lay-search id="editEbayTortTypeSel">
                        <option value="">请选择</option>
                    </select>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">侵权品牌</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" name="tortBrand" placeholder="录入品牌或侵权商标名称.不要录入：N/A，中文字段，公司名称，品牌投诉人等非商标字段.">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">投诉人</label>
                <div class="layui-input-block">
                    <input type="text" name="complainant" class="layui-input" style="width:500px">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">邮件时间</label>
                <div class="layui-input-block">
                    <input type="text" name="emailTime" class="layui-input" style="width:500px" id="editEbayTortEmatilTime">
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">客服备注</label>
                <div class="layui-input-block" style="width:500px;min-height: 0px;">
                    <textarea name="customerSrvNote"  class="layui-textarea" rows="2"></textarea>
                </div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">邮件正文</label>
                <div class="layui-input-block" style="width:500px">
                    <textarea name="emailContent"  class="layui-textarea" rows="8"></textarea>
                </div>
            </div>
            <div class="layui-form-item" style="display: none;">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="submitEditEbayTortMsg" id="submitEditEbayTortMsgBtn">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                </div>
            </div>
        </form>
    </div>
</script>
<%-- <div id="editEbayTortLayer" class="disN p20"></div> --%>

<%--批量修改侵权类型--%>
<script type="text/html" id="updateEbayTortTypeLayer">
    <div class="p20">
        <form class="layui-form" id="updateEbayTortTypeForm">
            <div class="layui-form-item">
                <label class="layui-form-label">侵权类型</label>
                <div class="layui-input-block" style="width:500px" >
                    <select name="tortType" lay-search id="updateEbayTortTypeSel">
                        <option value="">请选择</option>
                    </select>
                </div>
            </div>
        </form>
    </div>
</script>

<!-- 开发建议 -->
<script type="text/html" id="ebayTortDevSuggestLayer">
    <div class="p20">
        <form class="layui-form" id="ebayTortDevSuggestForm">
            <input type="hidden" name="id" class="layui-input" lay-verify="required" >
            <div class="layui-form-item">
                <label class="layui-form-label">建议：</label>
                <div class="layui-input-block">
                    <input type="text" name="devSuggestions" class="layui-input" lay-verify="required">
                </div>
            </div>

            <div class="layui-form-item" style="display: none;">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="ebayTortDevSug" id="submitEbayTortDevSuggest">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                </div>
            </div>
        </form>
    </div>
</script>
<%-- <div class="disN p20" id="ebayTortDevSuggestLayer"></div> --%>

<!-- 销售处理 -->
<script type="text/html" id="ebayTortSaleHandleLayer">
    <div class="p20">
        <form class="layui-form" id="ebayTortSaleHandleForm">
            <input type="hidden" name="id" class="layui-input" lay-verify="required" >
            <div class="layui-form-item">
                <label class="layui-form-label">处理状态：</label>
                <div class="layui-input-block">
                    <input type="radio" name="sellerProcStatus" value="1" title="已处理" checked>
                    <input type="radio" name="sellerProcStatus" value="0" title="未处理" >
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">处理备注：</label>
                <div class="layui-input-block">
                    <input type="text" name="sellerHandling" class="layui-input" >
                </div>
            </div>

            <div class="layui-form-item" style="display: none;">
                <div class="layui-input-block taRight">
                    <button class="layui-btn" lay-submit="" lay-filter="ebayTortSaleHandle" id="submitEbaySaleHandleSuggest">提交</button>
                    <button type="reset" class="layui-btn layui-btn-primary">清空</button>
                </div>
            </div>
        </form>
    </div>
</script>
<script type="text/html" id="ebay_sync_tort_tpl">
    <div style="text-align: left;font-size: 12px;">
        {{d.pSku || ''}}
        {{# if(d.syncTortBrand){ }}
        <span class="hp-badge layui-bg-orange fr layTitle" lay-title="已同步到侵权库">同</span>
        {{# } }}
    </div>
</script>
<%-- <div class="disN p20" id="ebayTortSaleHandleLayer"></div> --%>
<script type="text/javascript" src="${ctx}/static/js/commodity/prodtort/ebaytort.js"></script>

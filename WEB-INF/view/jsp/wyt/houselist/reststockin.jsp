<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<!-- 海外仓   -->
<title>海外仓其他入库单</title>
<style type="text/css">
  .dis_flex {
    display: flex;
    justify-content: space-between;
  }

  .fieldBox_purchaseOrder {
    float: left;
    width: 20%;
    height: 25px;
  }

  .dis_flex_start {
    display: flex;
    justify-content: flex-start;
  }

  .stockin_title {
    line-height: 31px;
    font-size: 16px;
    font-weight: 600;
    margin: 0 10px;
  }

  .font_color {
    color: #aaa !important;
  }

  .text_l {
    text-align: left;
  }

  /* 操作按钮对齐 */
  #LAY-reststockin .layui-btn+.layui-btn {
    margin-left: 0px !important;
  }
</style>
<div class="layui-fluid" id="LAY-reststockin">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form class="layui-form" id="reststockin_search_form">
            <div class="layui-form-item">
              <div class="layui-col-md3 layui-col-lg3">
                <div class="layui-form-label labelSel">
                  <select name="registerSkuSearchType">
                    <option value="1">子SKU</option>
                    <option value="3">子SKU(精)</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="registerSkus" />
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">仓库</label>
                <div class="layui-input-block">
                  <select name="overseasStorageId" id="overseas_restinwarehouseList"></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">经办人</label>
                <div class="layui-input-block">
                  <select name="directorId" lay-search="" id="overseas_restindirectorList"></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">入库类别</label>
                <div class="layui-input-block">
                  <select name="overseaStorageType" id="overseas_restinstorageTypeList">
                  </select>
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">入库单</label>
                <div class="layui-input-block">
                  <input name="overseasOtherStorageNumbers" type="text" placeholder="支持多个精确查询" class="layui-input" />
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">入库单备注</label>
                <div class="layui-input-block">
                  <input name="problemRemark" type="text" class="layui-input" />
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <div class="layui-form-label labelSel">
                  <select name="timeType">
                    <option value="0">制单时间</option>
                    <option value="1">审核时间</option>
                  </select>
                </div>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="timeRange" id="overseas_restintimerange" readonly />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2 pl20">
                <button type="button" class="layui-btn layui-btn-sm" id="overseas_restinorder_search_btn">
                  搜索
                </button>
                <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">
                  清空
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="layui-card">
        <div class="layui-tab" id="overseas_reststockin_data_count_tab"
          lay-filter="overseas_reststockin_data_count_tab">
          <div class="layui-card-header dis_flex">
            <div>
              <ul class="layui-tab-title">
                <li class="layui-this" data-index="0">未审核(<span class="num" id="overseas_reststockin_data_count_span0"
                    data-index="0"></span>)</li>
                <li data-index="1">已审核(<span class="num" id="overseas_reststockin_data_count_span1"
                    data-index="1"></span>)</li>
                <li data-index="3">作废(<span class="num" id="overseas_reststockin_data_count_span3"
                    data-index="3"></span>)</li>
              </ul>
            </div>
            <%--暂时不使用此功能--%>
            <%-- <div>
              <a href="${ctx}/static/templet/importOverseasOtherStorageInTemplate.xlsx">下载导入模板</a>
              <button type="button" class="layui-btn layui-btn-danger layui-btn-sm"
                id="overseas_reststockin_import_button">导入Excel新增</button>
              <input type="file" name="otherStorageInExcel" id="overseas_reststockin_storageInList_file" hidden>
            </div>--%>
            <div class="btn-group">
              <permTag:perm funcCode="add_overseas_purchaserOtherStorage">
                <button type="button" class="layui-btn layui-btn-sm"
                  id="overseas_restinorder_otherlistAdd_btn">新增</button>
              </permTag:perm>
              <permTag:perm funcCode="audit_overseas_purchaserOtherStorage">
                <button type="button" class="layui-btn layui-btn-sm tex_0"
                  id="overseas_restinorder_batchcheckBtn">批量审核</button>
              </permTag:perm>
              <%--暂时不使用此功能--%>
              <%--              <button type="button" class="layui-btn layui-btn-sm" id="overseas_reststockin_exportOtherStorageBtn">导出</button>--%>
            </div>
          </div>
          <table class="layui-table" lay-filter="overseas_reststockin_data_table" id="overseas_reststockin_data_table">
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- 新增编辑弹框内容 -->
<script type="text/html" id="reststockin_addEdit_layer">
  <div class="layui-row" style="padding: 20px 40px 40px 0">
      <div class="layui-tab" lay-filter="reststockin_detail_tab_filter">
          <ul class="layui-tab-title">
              <li class="layui-this">详情</li>
              <li isLog="1">日志</li>
          </ul>
          <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                  <div class="layui-col-md12 layui-col-lg12">
                      <div class="layui-form">
                          <form class="layui-form" id="oversaes_reststockin_addEdit_from">
                              <div class="layui-col-md3 layui-col-lg3">
                                  <label class="layui-form-label">单号</label>
                                  <div class="layui-input-block">
                                      <input type="text" class="layui-input" style="background-color: #cccccc"
                                             id="reststockin_otherStorageNumber_add" placeholder="新建后生成" name="overseasOtherStorageNumber" readonly>
                                  </div>
                              </div>
                              <div class="layui-col-md3 layui-col-lg3">
                                  <label class="layui-form-label">入库类型</label>
                                  <div class="layui-input-block">
                                      <select name="overseaStorageType" id="layer_overseas_storageTypeList"></select>
                                  </div>
                              </div>
                              <div class="layui-col-md3 layui-col-lg3">
                                  <label class="layui-form-label">仓库</label>
                                  <div class="layui-input-block">
                                      <select name="overseasStorageId" id="layer_overseas_warehouseList"></select>
                                  </div>
                              </div>
                              <div class="layui-col-md3 layui-col-lg3">
                                  <label class="layui-form-label">经办人</label>
                                  <div class="layui-input-block">
                                      <select name="directorId" id="layer_overseas_directorList" lay-search=""></select>
                                  </div>
                              </div>
                              <div class="layui-col-md12 layui-col-lg12">
                                  <label class="layui-form-label">问题备注</label>
                                  <div class="layui-input-block">
                                      <textarea placeholder="请输入内容" class="layui-textarea" id="reststockin_problemRemark" name="problemRemark"></textarea>
                                  </div>
                              </div>
                          </form>
                          <div class="layui-col-md12 layui-col-lg12 dis_flex_start pd">
                              <div class="stockin_title">入库商品</div>
                              <button type="button" class="layui-btn layui-btn-sm" id="reststockin_addItem_btn">添加商品</button>
                          </div>
                          <div class="layui-col-md12 layui-col-lg12 pd">
                              <table class="layui-table" id="overseas_reststockin_addItem_table" lay-filter="overseas_reststockin_addItem_table"></table>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="layui-tab-item p20">
                  <div class="layui-tab layui-tab-brief">
                      <div class="layui-show">
                          <table class="layui-table" id="restockin_logTab" lay-filter="restockin_logTab"></table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</script>
<!-- 添加商品弹框 -->
<script type="text/html" id="reststockin_additem_layer">
    <div class="layui-row  layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <form class="layui-form  pd" >
                <div class="layui-form-item">
                    <div class="layui-col-lg3 layui-col-md3">
                        <label class="layui-form-label">商品SKU</label>
                        <div class="layui-input-block">
                            <input type="text"  id="reststockin_additem_sku_input" class="layui-input">
                            <input hidden>
                        </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                        <div class="layui-input-block">
                            <button  type="button" class="layui-btn layui-btn-sm" id="reststockin_searchItem_btn">查询</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="layui-col-lg12 layui-col-md12">
            <div class="pd">
                <table class="layui-table" id="reststockin_additem_data_table" lay-filter="reststockin_additem_data_table"></table>
            </div>
        </div>
    </div>
</script>

<!-- 表格渲染数据 -->
<script type="text/html" id="overseas_reststockin_sku_image_tpl">
  <div>
      <img width="60" height="60" data-original="{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
  </div>
</script>
<script type="text/html" id="overseas_reststockin_sku_operate_tpl">
  {{# if( d.overseasOtherStorageNumber == null || d.overseasOtherStorageNumber == ''){ }}
  <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
  {{# }}}
</script>
<script type="text/html" id="overseas_layer_restin_buyer_price">
  <input  class="layui-input" name="buyerPrice" value="{{d.buyerPrice}}" min="1">
</script>
<script type="text/html" id="overseas_layer_restinstorageNum">
  <input type="number" class="layui-input" name="storageNum" value="{{d.storageNum}}" min="0">
</script>
<script type="text/html" id="tpl_restinorderNo">
  <div class="text_l"><span class="font_color">入库:</span>
    <span class="canClickEl showSpan clcikRoutTo pora copySpan">
      <a>{{d.overseasOtherStorageNumber || ''}}</a>
      <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt"
        onclick="layui.admin.copyTxt(this,event)">复制</button>
    </span>
  </div>
</script>
<script type="text/html" id="restin_tpl_creator">
  <div class="text_l"><span class="font_color">经办:</span>{{d.director || ''}}</div>
  <div class="text_l"><span class="font_color">制单:</span>
      {{# if(d.creator){ }}
          <span>{{d.creator}}</span>
      {{# }}}
  </div>
  {{# if(d.processStatus == 1 || d.processStatus == 3){ }}
      <div class="text_l"><span class="font_color">审核:</span>
          <span>{{d.auditor || ''}}</span>
      </div>
  {{# }}}
  {{# if(d.processStatus == 3){ }}
      <div class="text_l"><span class="font_color">作废:</span>
          <span>{{d.invalidUser || ''}}</span>
      </div>
  {{# }}}
</script>
<script type="text/html" id="restin_tpl_createTime">
  <div class="text_l"><span class="font_color">制单:</span><span>{{Format((d.createTime),'yyyy-MM-dd hh:mm:ss')}}</span></div>
  {{# if(d.auditTime){ }}
  <div class="text_l"><span class="font_color">审核:</span>:
      <span>{{Format(d.auditTime,'yyyy-MM-dd hh:mm:ss')}}</span>
  </div>
  {{# }}}
  {{# if(d.invalidTime){ }}
  <div class="text_l"><span class="font_color">作废:</span>:
      <span>{{Format(d.invalidTime,'yyyy-MM-dd hh:mm:ss')}}</span>
  </div>
  {{# }}}
</script>
<script type="text/html" id="restin_tpl_option">
        <permTag:perm funcCode="show_overseas_purchaserOtherStorage">
              <a class="layui-btn layui-btn-xs" lay-event="edit">详情</a>
        </permTag:perm>
      {{# if(d.processStatus=="0"){}}
            <permTag:perm funcCode="delete_overseas_purchaserOtherStorage">
                 <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="abodon">作废</a>
            </permTag:perm>
      {{# }}}
      <a class="layui-btn layui-btn-xs"  href="${ctx}/static/html/overseas_storage_other_print.html?overseasOtherStorageNumber={{d.overseasOtherStorageNumber}}" target="_blank"  lay-tips="预览打印">打印</a><br>
  <!--20190828普源不支持取消审核-->
  <%--{{# if(d.processStatus=="1"){}}--%>
      <%--<permTag:perm funcCode="cancel_purchaserOtherStorage">--%>
          <%--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="transferabodon">取消审核</a>--%>
      <%--</permTag:perm>--%>
  <%--{{# }}}--%>
</script>


<!--导出其它入库单--->
<script type="text/html" id="reststockin_exportOtherStorageOrderPop">
  <form class="layui-form">
    <div><input type="checkbox" title="全选" lay-filter="reststockin_exportOtherStorageInfo_selectAll"></div>
  </form>
  <div class="p20">
    <div class="layui-tab layui-tab-card">
      <div class="layui-tab-content">
        <div class="layui-tab-item layui-show p20">
          <form class="layui-form" id="reststockin_exportOtherStorageInfoForm"
            lay-filter="reststockin_exportOtherStorageInfoForm">
            <fieldset class="layui-elem-field layui-field-title site-demo-button">
              <legend style="font-size:14px">基本信息</legend>
            </fieldset>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库单号" title="入库单号" disabled
                lay-skin="primary" checked></div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库类别" title="入库类别" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="经办人" title="经办人" lay-skin="primary"></div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="仓库" title="仓库" lay-skin="primary"></div>
            <div style="clear:left"></div>
            <fieldset class="layui-elem-field layui-field-title site-demo-button">
              <legend style="font-size:14px">子表信息</legend>
            </fieldset>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="子SKU" title="子SKU" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="商品名称" title="商品名称  " lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="父SKU" title="父SKU" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购价格" title="采购价格" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="库位" title="库位" lay-skin="primary"></div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库数量" title="入库数量" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="入库金额" title="入库金额" lay-skin="primary">
            </div>
            <div style="clear:left"></div>
            <fieldset class="layui-elem-field layui-field-title site-demo-button">
              <legend style="font-size:14px">基本信息</legend>
            </fieldset>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次入库数量" title="本次入库数量" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次入库金额" title="本次入库金额" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="问题备注" title="入库备注" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="流程状态" title="流程状态" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="创建人" title="创建人" lay-skin="primary"></div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="创建时间" title="创建时间" lay-skin="primary">
            </div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="审核人" title="审核人" lay-skin="primary"></div>
            <div class="fieldBox_purchaseOrder"><input type="checkbox" value="审核时间" title="审核时间" lay-skin="primary">
            </div>
            <div style="clear:left"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</script>


<script src="${ctx}/static/js/wyt/houselist/reststockin.js"></script>
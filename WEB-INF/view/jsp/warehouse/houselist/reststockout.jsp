<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
        <title>其他出库单</title>
        <style type="text/css">
            .dis_flex {
                display: flex;
                justify-content: space-between;
            }
            .hidden {
                display: none!important;
            }
            .stockin_title {
                line-height: 31px;
                font-size: 16px;
                font-weight: 600;
                margin: 0 10px;
            }
            
            .pd {
                padding: 10px!important;
            }
            
            .dis_flex_start {
                display: flex;
                justify-content: flex-start;
            }
            
            .text_l {
                text-align: left;
            }
            
            .font_color {
                color: #aaa!important;
            }
            
            .font_weight {
                font-weight: 600 !important;
            }
            
            #LAY-reststockout .canClickEl {
                color: #000!important;
            }
            
            #LAY-reststockout .layui-btn+.layui-btn {
                margin-left: 0px!important;
            }
            
            .hide {
                display: none;
            }
            
            .fieldBox_purchaseOrder {
                float: left;
                width: 20%;
                height: 25px;
            }
        </style>
        <div class="layui-fluid" id="LAY-reststockout">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <!-- 搜索条件 -->
                    <div class="layui-card">
                        <div class="layui-card-body">
                            <form class="layui-form" id="reststockout_search_form">
                                <div class="layui-form-item">
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label labelSel">
                                            <select name="timeType">
                                                <option value="0">制单时间</option>
                                                <option value="1">审核时间</option>
                                             </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="reststockout_timerange_input" id="reststockout_timerange_input" readonly>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <div class="layui-form-label labelSel">
                                            <select name="skuSearchType">
                                                <option value="1">子SKU</option>
                                                <option value="2">父SKU</option>
                                                <option value="3">子SKU(精)</option>
                                                 <option value="4">父SKU(精)</option>
                                             </select>
                                        </div>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="skuList">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">仓库</label>
                                        <div class="layui-input-block">
                                            <select name="storeId" class="warehouseId" id="restoutwarehouseList" lay-search="" lay-filter="reststockout_warehouseId"></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">出库单</label>
                                        <div class="layui-input-block">
                                            <input name="otherStorageOutNumberList" type="text" placeholder="支持多个精确查询" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">出库类别</label>
                                        <div class="layui-input-block">
                                            <select name="outType" id="restoutoutTypeList" lay-search=""></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">经办人</label>
                                        <div class="layui-input-block">
                                            <select name="directorId" id="restoutdirectorList" lay-search=""></select>
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">创建批次号</label>
                                        <div class="layui-input-block">
                                            <!-- <select 
                                              name="createBatchNumberList" 
                                              id="restoutcreateBatchNumberList"
                                              xm-select="restoutcreateBatchNumberList"
                                              xm-select-search
                                              xm-select-search-type="dl"
                                              xm-select-skin="normal"
                                              xm-select-create
                                            >
                                            </select> -->
                                            <input type="text" class="layui-input" name="createBatchNumberList" placeholder="多个英文逗号隔开">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">配货批次号</label>
                                        <div class="layui-input-block">
                                            <input type="text" class="layui-input" name="pickBatchNumberList" placeholder="多个英文逗号隔开">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label">出库单备注</label>
                                        <div class="layui-input-block">
                                            <input name="problemRemark" type="text" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md2 layui-col-lg2">
                                        <label class="layui-form-label" style="width: 108px;">是否生成配货批次</label>
                                        <div class="layui-input-block" style="margin-left: 138px;">
                                            <select name="hasPickBatch">
                                                <option value=""></option>
                                                <option value="true">是</option>
                                                <option value="false">否</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">楼栋</label>
                                        <div class="layui-input-block">
                                            <select name="buildingNoList" class="buildNo" id="reststockout_buildNo" xm-select="reststockout_buildNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="layui-col-lg2 layui-col-md2">
                                        <label class="layui-form-label">楼层</label>
                                        <div class="layui-input-block">
                                            <select name="floorNoList" class="floorNo" id="reststockout_floorNo" xm-select="reststockout_floorNo" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                                            </select>
                                        </div>
                                    </div>  
                                    <div class="layui-col-md-offset10 layui-col-md2 layui-col-lg2" style="text-align: right;">
                                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="restoutSearch">查询</button>
                                        <button type="reset" class="layui-btn layui-btn-sm layui-btn-primary">清空</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="layui-card">
                        <div class="layui-tab" id="reststockout_data_count_tab"  lay-filter="reststockout_data_count_tab">
                            <div class="layui-card-header dis_flex">
                                <div style="float:left;" >
                                    <ul class="layui-tab-title fl">
                                        <li class="layui-this" data-index="0">未审核(<span class="num" id="reststockout_data_count_span0" data-index="0"></span>)</li>
                                        <li data-index="4">已配货(<span class="num" id="reststockout_data_count_span4"  data-index="4"></span>)</li>
                                        <li data-index="5">仓库缺货(<span class="num" id="reststockout_data_count_span5"  data-index="5"></span>)</li>
                                        <li data-index="1">已审核(<span class="num" id="reststockout_data_count_span1"  data-index="1"></span>)</li>
                                        <li data-index="3">作废(<span class="num" id="reststockout_data_count_span3" data-index="3"></span>)</li>
                                    </ul>
                                </div>
                                <div>
                                    <%-- <permTag:perm funcCode="add_purchaserOtherStorageOut">
                                        <button type="button" class="layui-btn layui-btn-danger layui-btn-sm ml10" id="reststockout_import_button">导入Excel新增</button>
                                        <input type="file" name="sInfoExcel" id="reststockout_storageOutList_file" hidden>
                                    </permTag:perm> --%>
                                </div>
                                <div class="btn-group">
                                    <permTag:perm funcCode="reststockout_batchupdate">
                                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="reststockout_batchupdate_btn">
                                            批量备注
                                        </span>
                                    </permTag:perm>
                                    <permTag:perm funcCode="reststockout_cleanBatchNumPermTag">
                                        <span class="layui-btn layui-btn-sm layui-btn-danger" id="reststockout_cleanBatchNum">
                                          清空批次号
                                        </span>
                                    </permTag:perm>
                                    <permTag:perm funcCode="batch_invalid_purchaserOtherStorageOut">
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-danger tex_0" id="reststockout_abodon_purchaserOtherStorage">批量作废</button>
                                        </permTag:perm>
                                    <permTag:perm funcCode="reststockout_batchuploadExcelPermTag">
                                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="reststockout_batchuploadExcel">
                                            批量上传
                                        </span>
                                    </permTag:perm>
                                    <permTag:perm funcCode="reststockout_generateBatchNumPermTag">
                                      <span class="layui-btn layui-btn-sm layui-btn-normal" id="reststockout_generateBatchNum">
                                        生成配货批次
                                      </span>
                                    </permTag:perm>
                                    <permTag:perm funcCode="audit_purchaserOtherStorageOut">
                                          <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="reststockout_batchcheckrestoutorder">批量审核</button>
                                    </permTag:perm>
                                    <permTag:perm funcCode="reststockout_turnDownPermTag">
                                        <span class="layui-btn layui-btn-sm layui-btn-normal" id="reststockout_turnDown">
                                          驳回
                                        </span>
                                    </permTag:perm>
                                    <permTag:perm funcCode="add_purchaserOtherStorageOut">
                                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="reststockout_otherlistoutAdd">新增</button>
                                    </permTag:perm>
                                    <a class="layui-btn layui-btn-sm" href="${ctx}/static/templet/importOtherStorageTemplate.xlsx">下载导入模板</a>
                                    <permTag:perm funcCode="export_purchaserOtherStorageOut">
                                        <button type="button" class="layui-btn layui-btn-sm" id="reststockout_exportOtherStorageOutBtn">导出</button>
                                    </permTag:perm>
                                </div>
                            </div>
                            <div class="layui-card-body">
                              <table class="layui-table" id="reststockout_dataTable" lay-filter="reststockout_dataTable" style="margin-top: 0px;"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/html" id="reststockout_batchUpdateTpl">
            <div>
                <textarea id="reststockout_problemRemark_input" name="problemRemark" placeholder="请输入内容" class="layui-textarea"></textarea>
            </div>
        </script>
        <!-- 渲染表格数据 -->
        <script type="text/html" id="rebackorder_imageTpl">
            <div>
                <img width="60" height="60" src="${tplIVP}{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
<%--                <img width="60" height="60" data-original="${tplIVP}{{d.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">--%>
            </div>
        </script>
        <script type="text/html" id="reststockout_imageTpl">
            <div>
                <img width="60" height="60" src="${tplIVP}{{d.detailDtos[0].image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
            </div>
        </script>
        <script type="text/html" id="restockout_isSale_Tpl">
            {{# if(d.isSale ){ }}
                    <div style="color: forestgreen;">在售</div>
            {{# }else {}}
                <div style="color: red;">停售</div>
            {{# }}}
        </script>

        <script type="text/html" id="layer_rebackitemoption">
            {{# if(d.otherStorageOutNumber == null || d.otherStorageOutNumber == '' ){ }}
                <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
            {{# }}}
        </script>

        <script type="text/html" id="layer_restoutNum">
            <input type="number" class="layui-input" name="outNum" value="{{d.outNum}}" min="0">
        </script>

        <script type="text/html" id="tpl_restoutorderNo">
            <div class="text_l"><span class="font_color">出库:</span>
                <span class="showSpan">{{d.stockOutNumber || ''}}</span>
                <span onclick="layui.admin.onlyCopyTxt('{{d.stockOutNumber}}')" style="display: {{d.stockOutNumber ? 'inline-block':'none'}}" class="copy-icon">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            </div>
            <div class="text_l"><span class="font_color">创建批次:</span>
                <span class="showSpan">{{d.createBatchNumber || ''}}</span>
                <span onclick="layui.admin.onlyCopyTxt('{{d.createBatchNumber}}')" style="display: {{d.createBatchNumber ? 'inline-block':'none'}}" class="copy-icon">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
            </div>
            <div class="text_l"><span class="font_color">配货批次:</span>
                <span class="showSpan">{{d.pickBatchNumber || ''}}</span>
                <span onclick="layui.admin.onlyCopyTxt('{{d.pickBatchNumber}}')" style="display: {{d.pickBatchNumber ? 'inline-block':'none'}}" class="copy-icon">
                    <svg t="1710754196184" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2392" width="16" height="16"><path d="M768 832q-0.992 54.016-37.504 90.496T640 960H192q-54.016-0.992-90.496-37.504T64 832V384q0.992-54.016 37.504-90.496T192 256v64q-27.008 0.992-44.992 19.008T128 384v448q0.992 27.008 19.008 44.992T192 896h448q27.008-0.992 44.992-19.008T704 832h64zM384 128q-27.008 0.992-44.992 19.008T320 192v448q0.992 27.008 19.008 44.992T384 704h448q27.008-0.992 44.992-19.008T896 640V192q-0.992-27.008-19.008-44.992T832 128H384z m0-64h448q54.016 0.992 90.496 37.504T960 192v448q-0.992 54.016-37.504 90.496T832 768H384q-54.016-0.992-90.496-37.504T256 640V192q0.992-54.016 37.504-90.496T384 64z" p-id="2393" fill="#aaaaaa"></path></svg>
                </span>
              </div>
        </script>

        <script type="text/html" id="tpl_restoutlocation">
            {{# if(d.warehouseName){ }}
            <div>{{d.stockLocation||''}}</div>
            <div>[<span class="font_weight">{{d.warehouseName||''}}</span>]</div>
            {{# }}}
        </script>

        <script type="text/html" id="restout_tpl_creator">
            <div class="text_l"><span class="font_color">经办:</span><span>{{d.director}}</span></div>
            <div class="text_l"><span class="font_color">制单:</span> {{# if(d.creator){ }}<span>{{d.creator}}</span> {{# }}}</div>
            {{# if(d.auditor){ }}
                <div class="text_l"><span class="font_color">审核:</span><span>{{d.auditor}}</span></div>
            {{# }}}
            {{# if(d.invalidUser){ }}
                <div class="text_l"><span class="font_color">作废:</span><span>{{d.invalidUser}}</span></div>
            {{# }}}
        </script>

        <script type="text/html" id="restout_tpl_createTime">
            <div class="text_l"><span class="font_color">制单:</span><span>{{Format((d.createTime),'yyyy-MM-dd hh:mm:ss')}}</span></div>
            {{# if(d.auditTime){ }}
                <div class="text_l"><span class="font_color">审核:</span><span>{{Format(d.auditTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
            {{# }}}
            {{# if(d.invalidTime){ }}
            <div class="text_l"><span class="font_color">作废:</span><span>{{Format(d.invalidTime,'yyyy-MM-dd hh:mm:ss')}}</span></div>
            {{# }}}
        </script>

        <script type="text/html" id="reststockout_tpl_option">
            <div style="text-align:left;">
                {{# if(d.processStatus=="0"){}}
                <permTag:perm funcCode="delete_purchaserOtherStorageOut">
                    <a class="layui-btn layui-btn-primary layui-btn-xs" lay-event="abodon">作废</a>
                    <br>
                </permTag:perm>
                {{# }}}
                <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="edit">详情</a>
                <br>
                <permTag:perm funcCode="add_purchaserOtherStorageOut">
                    <a class="layui-btn layui-btn-xs"  href="${ctx}/static/html/storageout_other_print.html?stockOutNumber={{d.stockOutNumber}}" target="_blank"  lay-tips="预览打印">打印</a><br>
                </permTag:perm>
                <%--{{# if(d.processStatus=="1"){}}--%>
                    <%--<permTag:perm funcCode="cancel_purchaserOtherStorageOut">--%>
                        <%--<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="transferabodon">取消审核</a>--%>
                    <%--</permTag:perm>--%>
                <%--{{# }}}--%>
            </div>
        </script>
        <!-- 添加商品弹框 -->
        <script type="text/html" id="layer_additem">
            <div class="layui-row  layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <form  class="layui-form  pd" id="">
                        <div class="layui-form-item">
                            <div class="layui-col-lg3 layui-col-md3">
                                <label class="layui-form-label">商品SKU</label>
                                <div class="layui-input-block">
                                    <input type="text" name="layer_sku" id="layer_sku" class="layui-input" placeholder="">
                                </div>
                            </div>
                            <div class="layui-col-lg3 layui-col-md3">
                                <div class="layui-input-block">
                                    <button class="layui-btn layui-btn-sm" id="reststockout_layer_searchItem_btn">查询</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="pd">
                        <table class="layui-table" id="layer_itemtable" lay-filter="layer_itemtable"></table>
                    </div>
                </div>
            </div>
        </script>

        <!-- 新增编辑弹框 -->
        <script type="text/html" id="otherlistoutAddEdit">
            <div class="layui-row" style="padding: 20px 40px 40px 0">
                <div class="layui-tab" lay-filter="reststockout_detail_tab_filter">
                    <ul class="layui-tab-title">
                        <li class="layui-this">详情</li>
                        <li isLog="1">日志</li>
                    </ul>
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show">
                            <div class="layui-col-md12 layui-col-lg12">
                                <div class="layui-form">
                                    <form class="layui-form" id="newrestoutForm">
                                        <input type="text" name="storeId" hidden>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">单号</label>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" id="restoutNo" style="background-color: #cccccc" name="stockOutNumber" readonly>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">出库类型</label>
                                            <div class="layui-input-block">
                                                <select name="outType" id="layeroutTypeList"></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">仓库</label>
                                            <div class="layui-input-block">
                                                <select name="storeId" id="layerwarehouseList" lay-filter="layerwarehouseList" lay-search=""></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md3 layui-col-lg3">
                                            <label class="layui-form-label">经办人</label>
                                            <div class="layui-input-block">
                                                <select name="directorId" id="layerdirectorList" lay-search=""></select>
                                            </div>
                                        </div>
                                        <div class="layui-col-md12 layui-col-lg12">
                                            <label class="layui-form-label">问题备注</label>
                                            <div class="layui-input-block">
                                                <textarea placeholder="请输入内容" class="layui-textarea" id="reststockout_problemRemark" name="problemRemark"></textarea>
                                            </div>
                                        </div>
                                    </form>
                                    <div class="layui-col-md12 layui-col-lg12 dis_flex_start pd" style="justify-content:space-between;">
                                        <div style="display:flex;">
                                            <div class="stockin_title">出库商品</div>
                                            <button type="button" class="layui-btn layui-btn-sm" id="reststockout_addItem_btn">添加商品</button>
                                            <!-- <span class="layui-btn layui-btn-sm" id="reststockout_addItem_import">导入Excel表格</span> -->
                                            <input type="file" name="sInfoExcel" id="reststockout_addItem_import_input" class="hidden">
                                            <span style="margin-left:10px;"><font size="4" color="red">请使用Ctrl+F快捷键进行查找功能!</font></span>
                                        </div>
                                        <!-- <div>
                                            <span class="layui-btn layui-btn-sm layui-btn-normal" id="reststockout_allCount">
                                                计数
                                            </span>
                                        </div> -->
                                    </div>
                                    <div class="layui-col-md12 layui-col-lg12 pd">
                                        <%-- <table class="layui-table" id="reststockout_add_table" lay-filter="reststockout_add_table"></table> --%>
                                        <table class="layui-table">
                                            <thead>
                                                <tr>
                                                    <th width="80">图片</th>
                                                    <th>
                                                        商品sku 
                                                        <!-- <font color="red" id="prodSku_btn">数量:0</font> -->
                                                    </th>
                                                    <th>商品名称</th>
                                                    <th width="80">含税单价(￥)</th>
                                                    <th>可用库存</th>
                                                    <th>
                                                        出库数量
                                                        <!-- <font color="red" id="outNumber_btn">总计:0</font> -->
                                                    </th>
                                                    <th>
                                                        出库金额
                                                        <!-- <font color="red" id="outMoney_btn">总额:0</font> -->
                                                    </th>
                                                    <th width="80">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody id="reststockout_productsDetail">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-item p20">
                            <div class="layui-tab layui-tab-brief">
                                <div class="layui-show">
                                    <table class="layui-table" id="reststockout_logTab" lay-filter="reststockout_logTab"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </script>

        <script type="text/html" id="reststockout_productsDetailTpl">
            {{# if(d){  }}
                {{#  layui.each(d, function(index, item){ }}
                <tr data-index = "{{item.prodSId||0}}">
                    <%-- 图片 --%>
                    <td data-field="image" data-image="{{item.image || ''}}">
<%--                        <img width="60" height="60" data-original="${tplIVP}{{item.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">--%>
                        <img width="60" height="60" src="${tplIVP}{{item.image}}" class="img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()">
                        <input type="hidden" value="{{item.prodPId || ''}}">
                    </td>
                    <%-- 商品SKU --%>
                    <td data-field="prodSSku">{{item.prodSSku||''}}</td>
                    <%-- 商品名称 --%>
                    <td data-field="title">
                        {{item.title||""}}
                        <input type="hidden" value="{{item.prodPSku || ''}}">
                    </td>
                    <%-- 含税单价 --%>
                    <td data-field="buyerPrice">{{item.buyerPrice|| 0 }}</td>
                    <%-- 可用库存 --%>
                    <td data-field="avaiableStock">{{item.avaiableStock||""}}</td>
                    <%-- 出库数量 --%>
                    <td data-field="outNum">
                        <input class="layui-input" type="number" value="{{item.outNum||0}}" min="0" name="outNum">
                    </td>
                    <%-- 出库金额 --%>
                    <td data-field="storageOutMoney">{{item.storageOutMoney || ''}}</td>
                    <%-- 操作 --%>
                    <td data-field="delete">
                        <span class="layui-btn layui-btn-danger layui-btn-xs" onclick="commonDelTr(this)">移除</span>
                    </td>
                </tr>
                {{#  }) }}
                {{# } }}
        </script>

        <!--导出其它出库单--->
        <script type="text/html" id="reststockout_exportOtherStorageOutPop">
            <form class="layui-form">
                <div><input type="checkbox" title="全选" lay-filter="reststockout_exportOtherStorageOutInfo_selectAll"></div>
            </form>
            <div class="p20">
                <div class="layui-tab layui-tab-card">
                    <div class="layui-tab-content">
                        <div class="layui-tab-item layui-show p20">
                            <form class="layui-form" id="reststockout_exportOtherStorageOutInfoForm" lay-filter="reststockout_exportOtherStorageOutInfoForm">
                                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                    <legend style="font-size:14px">基本信息</legend>
                                </fieldset>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库单号" title="出库单号" disabled lay-skin="primary" checked></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库类别" title="出库类别" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="经办人" title="经办人" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="仓库" title="仓库" lay-skin="primary"></div>
                                <div style="clear:left"></div>
                                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                    <legend style="font-size:14px">子表信息</legend>
                                </fieldset>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="子SKU" title="子SKU" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="商品名称" title="商品名称  " lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="父SKU" title="父SKU" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="采购价格" title="采购价格" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="库位" title="库位" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库数量" title="出库数量" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="出库金额" title="出库金额" lay-skin="primary"></div>
                                <div style="clear:left"></div>
                                <fieldset class="layui-elem-field layui-field-title site-demo-button">
                                    <legend style="font-size:14px">基本信息</legend>
                                </fieldset>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次出库数量" title="本次出库数量" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="本次出库金额" title="本次出库金额" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="问题备注" title="入库备注" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="流程状态" title="流程状态" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="创建人" title="创建人" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="创建时间" title="创建时间" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="审核人" title="审核人" lay-skin="primary"></div>
                                <div class="fieldBox_purchaseOrder"><input type="checkbox" value="审核时间" title="审核时间" lay-skin="primary"></div>
                                <div style="clear:left"></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </script>
        <!-- 详情的保存按钮权限 -->
        <script type="text/html" id="reststockout_layerDetailSaveBtn">
          <permTag:perm funcCode="reststockout_layerDetailSaveBtnPermTag"><span>保存</span></permTag:perm>
        </script>
        <script src="${ctx}/static/js/warehouse/reststockout.js"></script>
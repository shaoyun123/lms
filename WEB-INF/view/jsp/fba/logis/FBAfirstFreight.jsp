<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>头程运费</title>
<style>
    .text_l {
        text-align: left;
    }
    #FBAfreight_page {
        position: fixed;
        background: #fff;
        width: 100%;
        z-index: 99999;
        bottom: 0;
        left: 100px;
        border-top: 1px solid #ccc;
    }
</style>
<!-- 主页面 -->
<div class="layui-fluid" id="FBAfreight">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="FBAfreight_Form" lay-filter="FBAfreight_Form">
                        <div class="layui-form-item">
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">运单号</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="freightNumListStr">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">物流公司</label>
                              <div class="layui-input-block">
                                <select
                                  name="companyNameList"
                                  id="FBAfreight_companyNameList"
                                  xm-select="FBAfreight_companyNameList"
                                  xm-select-search
                                  xm-select-search-type="dl"
                                  xm-select-skin="normal"
                                ></select>
                              </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                              <label class="layui-form-label">物流方式</label>
                              <div class="layui-input-block">
                                <select
                                  name="logisticsTypeList"
                                  id="FBAfreight_logisticsTypeList"
                                  xm-select="FBAfreight_logisticsTypeList"
                                  xm-select-search
                                  xm-select-search-type="dl"
                                  xm-select-skin="normal"
                                ></select>
                              </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                              <label class="layui-form-label">货件编号</label>
                              <div class="layui-input-block">
                                  <input type="text" class="layui-input" name="shipmentIdList">
                              </div>
                          </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">状态</label>
                                <div class="layui-input-block">
                                    <select name="auditStatus" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">已审核</option>
                                        <option value="0">未审核</option>
                                        <option value="2">作废</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-lg4 layui-col-md4">
                                <div class="layui-form-label" style="padding:0px 0px 0px 5px">
                                    <select name="timeType">
                                        <option value="审核时间">审核时间</option>
                                        <option value="创建时间">创建时间</option>
                                        <option value="修改时间">修改时间</option>
                                    </select>
                                </div>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="time" id="FBAfreight_Form_time">
                                </div>
                            </div>

                            <input type="hidden" name="limit" value="10">
                            <input  type="hidden" name="page" value="1">

                            <div class="layui-col-lg2 layui-col-md2">
                                <label class="layui-form-label">是否异常</label>
                                <div class="layui-input-block">
                                    <select name="exceptionStatus" lay-search>
                                        <option value="">全部</option>
                                        <option value="1">是</option>
                                        <option value="0">否</option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md2 layui-col-lg2">
                                <label class="layui-form-label">FBA仓库代码</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" name="fnCenterId">
                                </div>
                            </div>
                            <div class="layui-col-lg2 layui-col-md2">
                                <div class="layui-input-block">
                                    <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" lay-submit=""
                                            id="FBAfreight_Search" lay-filter="FBAfreight_Search">查询
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div style="height:42px;line-height:42px;">
                    <div class="layui-card-header" style="display: flex;justify-content: space-between;align-items: center;">
<%--                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm fr"--%>
<%--                                id="FBAfreight_createFreight">--%>
<%--                            创建运单--%>
<%--                        </button>--%>
                    <div>
                        <permTag:perm funcCode="FBAfreight_perm_audit">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                    id="FBAfreight_auditSuccBatch">
                                批量审核
                            </button>
                        </permTag:perm>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                            id="FBAfreight_searchNotset_btn">
                            查询未导入运费运单
                        </button>
                    </div>
                    <div>
                        <permTag:perm funcCode="download_import_template">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                    id="FBAfreight_exportTemplate">
                                下载导入模板
                            </button>
                        </permTag:perm>
                        <permTag:perm funcCode="import_freight_fee">
                            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm"
                                    id="FBAfreight_importFreight">
                                导入运单费用
                            </button>
                        </permTag:perm>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="FBAfreight_exportErr_FreightNum">导出异常SKU运单</button>
                        <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="FBAfreight_query_FreightNum">导出运单</button>
                    </div>
                    </div>
                </div>
                <div class="layui-card-body">

                    <table lay-filter="FBAfreight_table" class="layui-table" id="FBAfreight_table"></table>
                </div>
            </div>
            <div id="FBAfreight_page"></div>
        </div>
    </div>
</div>

<!-- 表格渲染-弹窗 -->
<script type="text/html" id="FBAfreight_log_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <table lay-filter="FBAfreight_log_sku_table" class="layui-table" id="FBAfreight_log_sku_table"></table>
        </div>
    </div>
</script>

<!-- 表格渲染-td内容格式 -->
<script type="text/html" id="FBAfreight_time_tpl">
    <div class="text_l"><span>创建：</span><span>{{Format(d.createTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>审核：</span><span>{{Format(d.auditTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
    <div class="text_l"><span>修改：</span><span>{{Format(d.modifyTime||"",'yyyy-MM-dd hh:mm:ss')}}</span></div>
</script>

<!-- 表格渲染-操作按钮 -->
<script type="text/html" id="FBAfreight_Option">
    {{# if(d.auditStatus==0){ }}
    <%--<permTag:perm funcCode="FBAfreight_perm_edit">--%>
        <%--<button class="layui-btn layui-btn-xs" lay-event="edit">修改</button>--%>
    <%--</permTag:perm>--%>
<permTag:perm funcCode="FBAfreight_perm_audit">
        <button class="layui-btn layui-btn-primary layui-btn-xs" lay-event="auditSucc" style="margin-top:5px">审核</button>
</permTag:perm>
    {{# } }}
    {{# if(d.auditStatus==1){ }}
        <button class="layui-btn layui-btn-primary layui-btn-xs" style="margin-top:5px" lay-event="showAuditSuccLog">审核日志</button>
<permTag:perm funcCode="FBAfreight_perm_audit">
        <button class="layui-btn layui-btn-primary layui-btn-xs" lay-event="auditNotSucc" style="margin-top:5px">反审核</button>
</permTag:perm>
    {{# } }}
<permTag:perm funcCode="FBAfreight_perm_cancle">
    {{# if(d.auditStatus==0){ }}
    <div>
        <button class="layui-btn layui-btn-primary layui-btn-xs" lay-event="auditUnUse" style="margin-top:5px">作废</button>
    </div>
    {{# } }}
    {{# if(d.auditStatus==2){ }}
        <button class="layui-btn layui-btn-primary layui-btn-xs" lay-event="auditCancleUnUse" style="margin-top:5px">取消作废</button>
    {{# } }}
</permTag:perm>
    <permTag:perm funcCode="mark_exception">
        <div>
            {{# if(d.isException){ }}
                <button class="layui-btn layui-btn-primary layui-btn-xs" style="margin-top:5px" lay-event="cancelAbnormal">取消异常</button>
            {{# } else { }}
                <button class="layui-btn layui-btn-primary layui-btn-xs" style="margin-top:5px" lay-event="markAbnormal">标记异常</button>
            {{# } }}
        </div>
    </permTag:perm>
</script>

<%-- 异常弹框 --%>
<script type="text/html" id="FBAAbnormalLayer">
    <div class="layui-form" style="padding: 20px 60px 0 0;">
       <div class="layui-form-item">
          <div class="layui-form-label">
            异常备注
          </div>
          <div class="layui-input-block">
            <textarea class="layui-textarea" id="FBAAbnormal_textarea"></textarea>
          </div>
       </div>
    </div>
</script>

<script type="text/html" id="FBAfreight_searchNotset_tpl">
    <div class="layui-card">
        <div class="layui-card-body">
            <div class="layui-form" id="FBAfreight_searchNotset_Form">
                <textarea name="freightNumList" class="layui-textarea"></textarea>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="FBAfreight_log_sku_tpl">
    <div class="text_l"><span class="gray">商品:</span>{{d.prodSSku||''}}</div>
    <div class="text_l"><span class="gray"> 店铺:</span>{{d.sellerSku||''}}</div>
</script>

<script type="text/html" id="FBAfreight_log_psi_tpl">
    <div class="text_l"><span class="gray"> 商品长(cm):</span>{{d.psiLength||''}}</div>
    <div class="text_l"><span class="gray"> 商品宽(cm):</span>{{d.psiWidth||''}}</div>
    <div class="text_l"><span class="gray"> 商品高(cm):</span>{{d.psiHeight||''}}</div>
    <div class="text_l"><span class="gray"> 商品净重(g):</span>{{d.psiSuttleWeight||''}}</div>
    <div class="text_l"><span class="gray"> 商品包装重(g):</span>{{d.psiPackWeight||''}}</div>
</script>

<script type="text/html" id="FBAfreight_log_carton_tpl">
    <div class="text_l"><span class="gray"> 箱号(cm):</span>{{d.indexNum||''}}</div>
    <div class="text_l"><span class="gray"> 箱子长(cm):</span>{{d.cartonLength||''}}</div>
    <div class="text_l"><span class="gray"> 箱子宽(cm):</span>{{d.cartonWidth||''}}</div>
    <div class="text_l"><span class="gray"> 箱子高(cm):</span>{{d.cartonHeight||''}}</div>
    <div class="text_l"><span class="gray"> 箱子重(kg):</span>{{d.cartonWeight||''}}</div>
</script>


<script src="${ctx}/static/js/publishs/amazon/FBAfirstFreight.js"></script>
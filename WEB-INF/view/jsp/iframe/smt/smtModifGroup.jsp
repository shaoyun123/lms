<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>调整分组</title>
<style>
  #LAY_adjustPriceProcess .layui-form-label {
    padding: 9px 5px;
  }
  #LAY_adjustPriceProcess .layui-form-item .layui-col-lg2 layui-col-md2 {
    margin-right: 0;
  }

  .dis_flex {
    display: flex;
    justify-content: space-between;
  }

  #LAY_adjustPriceProcess .layui-form {
    margin: 0 10px;
  }
  #LAY_adjustPriceProcess .layui-form-checkbox span {
    line-height: inherit;
  }

  #LAY_adjustPriceProcess .layui-form-checkbox {
    line-height: 30px !important;
  }

  .numCount {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    display: inline-block;
    padding: 0 5px;
    text-align: center;
    line-height: 30px;
  }
  .mg_10 {
    margin: 0 10px;
  }
</style>

<div class="layui-fluid" id="smtadjustPriceProcess">
  <div class="layui-row layui-col-space15">
    <div class="layui-tab">
      <ul class="layui-tab-title">
        <li class="layui-this">重新匹配</li>
        <li>导入修改</li>
      </ul>
      <div class="layui-tab-content">
        <div class="layui-tab-item layui-show">
          <div class="layui-col-md12">
            <div class="layui-card">
              <div class="layui-card-body">
                <form
                  id="smt_theShelves_searchForm"
                  lay-filter="prod_search_form"
                  class="layui-form"
                >
                  <div class="layui-form-item" style="margin-bottom: 0">
                    <div class="layui-col-lg1 layui-col-md1">
                      <select id="group_pAnds_sku">
                        <option value="0">商品子SKU</option>
                        <option value="1">商品父SKU</option>
                      </select>
                    </div>
                    <div class="layui-col-md1 layui-col-lg1">
                      <input
                        type="text"
                        name="groups_skuList"
                        class="layui-input"
                        placeholder="默认模糊查询"
                      />
                    </div>
                    <div class="layui-col-md1 layui-col-lg1">
                      <select id="smt_groups_idEnable_skuSearchType">
                        <option value="0">模糊</option>
                        <option value="1" selected>精确</option>
                      </select>
                    </div>

                    <div class="layui-col-lg2 layui-col-md2">
                      <label class="layui-form-label">部门</label>
                      <div class="layui-input-block">
                        <select
                          id="smt_online_depart_sel"
                          lay-search
                          lay-filter="smt_online_depart_sel"
                          class="orgs_hp_custom"
                        >
                          <option value=""></option>
                        </select>
                      </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                      <label class="layui-form-label">销售人员</label>
                      <div class="layui-input-block">
                        <select
                          name="saleName"
                          id="smt_online_salesman_sel"
                          lay-search
                          lay-filter="smt_online_salesman_sel"
                          class="users_hp_custom"
                          data-rolelist="smt专员"
                        >
                          <option value=""></option>
                        </select>
                      </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                      <label class="layui-form-label">店铺</label>
                      <div class="layui-input-block">
                        <select
                          id="smt_group_online_store_sel_modifyGroup"
                          lay-search
                          lay-filter="smt_group_online_store_sel_modifyGroup"
                          class="store_hp_custom"
                          data-platcode="aliexpress"
                        >
                          <option value=""></option>
                        </select>
                      </div>
                    </div>
                    <div
                      class="layui-col-lg2 layui-col-md2"
                      style="text-align: right"
                    >
                      <button
                        class="layui-btn layui-btn-sm keyHandle"
                        type="button"
                        data-type="reload"
                        id="smtModifyGroupsSearchBtn"
                      >
                        搜索
                      </button>
                      <button
                        type="reset"
                        class="layui-btn layui-btn-primary layui-btn-sm"
                        id="smtModifyGroupsResetBtn"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                </form>
                <form id="amt_applyForm" class="layui-form">
                  <div class="layui-form-item" style="margin-bottom: 0">
                    <div class="layui-col-md4 layui-col-lg4 pl_110">
                      <label class="layui-form-label">选择分组</label>
                      <div class="layui-input-block">
                        <select
                          id="smt_group_templat"
                          xm-select="smt_group_templat"
                        >
                          <option value="">请选择</option>
                        </select>
                      </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2 pl_110">
                      <button
                        id="smt_product_group_sync"
                        class="layui-btn layui-btn-sm keyHandle"
                        type="button"
                      >
                        同步最新产品分组
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="layui-card">
              <div class="dis_flex layui-card-body">
                <div
                  class="w100 numCount"
                  style="text-align: center; padding: 0 5px"
                >
                  数量(<span id="tolnum_span_smt_templat"></span>)
                </div>
                <div class="disFCenter mg_10 w_100">
                  <button
                    type="button"
                    id="modifyAddGroupsButtn"
                    class="layui-btn layui-btn-normal layui-btn-sm ml20"
                  >
                    批量增加
                  </button>
                  <button
                    type="button"
                    id="modifyGroupsButtn"
                    class="layui-btn layui-btn-danger layui-btn-sm"
                  >
                    批量调整
                  </button>
                </div>
              </div>
              <div class="layui-card-body">
                <!-- 表格的数据渲染 -->
                <table
                  class="layui-table"
                  id="smtModifyGroupsTable"
                  lay-filter="smtModifyGroupsTable"
                ></table>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-tab-item">
          <div class="layui-card">
            <div class="layui-card-body">
              <div>
                <button
                  class="layui-btn ml20 layui-btn-sm layui-btn-normal"
                  type="button"
                  data-type="reload"
                  id="smt_modifyGroup_export"
                >
                  下载模板
                </button>
                <button
                  class="layui-btn ml20 layui-btn-sm layui-btn-normal"
                  type="button"
                  data-type="reload"
                  id="smt_modifyGroup_uplaod"
                >
                  上传文件
                </button>
                <i
                  class="layui-icon ml20 layui-icon-help blue"
                  lay-tips="导入修改数据无需选中在线商品。仅支持 xlsx格式"
                ></i>
                <i
                  class="layui-icon ml60 layui-icon-refresh-3"
                  id="smt_modifyGroup_refreshResult"
                  lay-tips="点击刷新操作日志"
                ></i>
              </div>
              <div>
                <table
                  class="layui-table"
                  id="smt_modifyGroup_log_table"
                  lay-filter="smt_modifyGroup_log_table"
                ></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<script type="text/html" id="group_g_name">
  <div>
    {{# if (d.groupSmtList != null && d.groupSmtList.length > 0) {}} {{# for(var
    i = 0; i < d.groupSmtList.length; i++) {}}
    <div>{{d.groupSmtList[i].groupName}}</div>
    {{# }}} {{# }}}
  </div>
</script>
<!-- 操作日志弹窗 文件名称 -->
<script type="text/html" id="smt_modifyGroup_filePath">
    {{# if(d.operateResultFileUri){ }}
        <div style="padding: 10px;">
            <a href="{{d.operateResultFileUri}}" target="_blank"  class="ztt-a">{{Format(d.createTime,'yyyy-MM-dd')}}smt在线商品导入Excel修改分组失败文件.xlsx</a>
        </div>
    {{# } }}
</script>
<script
  type="text/javascript"
  src="${ctx}/static/js/publishs/aliexpress/smtModifyGroup.js"
></script>

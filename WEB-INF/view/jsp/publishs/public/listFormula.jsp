<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>定价公式</title>

<style>
  .public-tips-icon-size {
    font-size: 14px;
  }
  .public-listFormula-icon-size {
    font-size: 20px;
  }
  #public_listFormula_edit_form .layui-form-label {
    width: 100px;
  }
  #public_listFormula_edit_form .layui-input-block {
    margin-left: 130px;
  }
  #public_listFormula_edit_form .small-width {
    width: 55px;
  }
  #public_listFormula_edit_form .small-ml {
    margin-left: 85px;
  }
  .fieldBox_public_listFormula {
    float: left;
    width: 20%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .showLine4{
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="public_listFormula_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">平台</label>
                <div class="layui-input-block">
                  <select
                    name="platCode"
                    lay-search
                    lay-filter="listFormula_form_platCode"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                  <select name="salesSite" lay-search lay-filter="listFormula_form_salesSite"></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">仓库类型</label>
                <div class="layui-input-block">
                  <select name="storeWarehousesType" lay-search></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">账号类型</label>
                <div class="layui-input-block">
                  <select name="storeAcctType" lay-search></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                  <select
                    name="logisAttrList"
                    xm-select="public_listFormula_form_logisAttrList"
                    xm-select-search
                    xm-select-skin="normal"
                    xm-select-search-type="dl"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">适用店铺</label>
                <div class="layui-input-block">
                  <select
                    name="storeAcctIdList"
                    id="public_listFormula_form_storeAcctIdList"
                    xm-select="public_listFormula_form_storeAcctIdList"
                    xm-select-search
                    xm-select-skin="normal"
                    xm-select-search-type="dl"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-input-block">
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm"
                    id="public_listFormula_search"
                    >查询</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-primary"
                    type="reset"
                    id="public_listFormula_reset"
                    >重置</a
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="public_listFormula_tab">
            <div class="disflex">
              <ul class="layui-tab-title">
                <li class="layui-this">
                  数量(<span id="public_listFormula_total">0</span>)
                </li>
              </ul>
              <div
                class="ml20 disflex"
                style="flex: 1; justify-content: flex-end"
              >
                <a
                  href="javascript:;"
                  class="layui-btn layui-btn-sm"
                  id="public_listFormula_addBtn"
                  >新增</a
                >
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table
                  class="layui-table"
                  id="public_listFormula_table"
                  lay-filter="public_listFormula_table"
                ></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!--  -->
<script type="text/html" id="public_listFormula_toolbar">
  <span class="layui-btn layui-btn-xs" lay-event="matchStore">匹配店铺</span>
  <span class="layui-btn layui-btn-xs" lay-event="edit">编辑</span>
  <span class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</span>
  <span class="layui-btn layui-btn-xs layui-btn-normal" lay-event="log">日志</span>
</script>

<!-- 编辑弹窗 -->
<script type="text/html" id="public_listFormula_editModal">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form" id="public_listFormula_edit_form">
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"
              ><font class="fRed">*</font>定价公式名称</label
            >
            <div class="layui-input-block">
              <input type="text" name="formula" class="layui-input" />
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"
              ><font class="fRed">*</font>平台</label
            >
            <div class="layui-input-block">
              <select
                name="platCode"
                id="list_platCode"
                lay-filter="listFormula_edit_form_platCode"
              >
                <option value="">请选择</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">站点</label>
            <div class="layui-input-block">
              <select name="salesSite" id="list_salesSite">
                <option value="">请选择</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">仓库类型</label>
            <div class="layui-input-block">
              <select name="storeWarehousesType" lay-search>
                <option value="">请选择</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">账号类型</label>
            <div class="layui-input-block">
              <select name="storeAcctType">
                <option value="">请选择</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">物流属性</label>
            <div class="layui-input-block">
              <select
                name="logisAttrList"
                xm-select="public_listFormula_edit_form_logisAttrList"
                xm-select-search
              ></select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">定价区间(单位为各站点币种)</label>
            <div class="layui-input-block">
              <div class="disflex">
                <input
                  type="number"
                  name="listingPriceMin"
                  class="layui-input"
                  placeholder="包含该数值"
                  onkeypress="commonKeyPressInputFloat(event)"
                />
                <span class=" ml20">-</span>
                <input
                  type="number"
                  name="listingPriceMax"
                  class="layui-input ml20"
                  placeholder="不包含该数值"
                  onkeypress="commonKeyPressInputFloat(event)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"
              ><font class="fRed">*</font>定价公式
              <div style="color: rgb(30, 159, 255)">
                <span style="display: none;" id="promotionPrice">(促销价)</span>
                <span style="display: none;" id="originPrice">(原价)</span>
              </div></label
            >
            <div class="layui-input-block">
              <div class="disFCenter">
                <i
                  class="layui-icon blue public-listFormula-icon-size"
                  id="public_listFormula_edit_addPriceFormula_btn"
                  >&#xe654;</i
                >
                <div style="width: 140px;">
                  <i
                    class="layui-icon public-listFormula-icon-size"
                    lay-tips="如有多个公式，取计算结果最大值"
                    >&#xe702;</i
                  >
                </div>
              </div>
              <div id="public_listFormula_edit_priceFormula_list">
                <div class="disFCenter mb5">
                  <input
                    type="text"
                    name="listingPriceFormula"
                    class="layui-input mr10"
                    style="flex: 1;"
                    onchange="public_listFormula_change_listingPriceFormula(this)"
                  />
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal mr10 public-listFormula-delPriceFormula-btn"
                    >删除</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-normal mr10 public-listFormula-testPriceFormula-btn"
                    >TEST</a
                  >
                  <div style="width: 30px;">
                    <i
                      class="layui-icon fGreen public-listFormula-icon-size hidden rightFormula"
                      >&#xe605;</i
                    >
                    <i
                      class="layui-icon fRed public-listFormula-icon-size hidden wrongFormula"
                      >&#x1006;</i
                    >
                  </div>
                </div>
              </div>
              <div style="font-size: 12px;">
                <i
                class="layui-icon public-tips-icon-size"
                lay-tips="商品成本：（商品列表内采购成本+内包装成本）* 商品数量<br>
                平均成本：（库存信息内平均单价+内包装成本）*商品数量；<br>
                当平均单价为空或不存在时，平均成本取商品价值<br>
                商品价值：预估国内运费*商品数量+商品成本；<br>
                预估国内运费：用预估运费设置页面续费计算<br>
                最小成本：平均成本与商品价值取小值<br>"
                >&#xe702;</i
              >
                公式可填写： 商品成本 平均成本 最小成本 运费 汇率 毛利率
                平台提成 最低毛利 固定手续费 优惠幅度 商品价值
                <span id="AeTips"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label"
              ><font class="fRed">*</font>平均成本取值仓库</label
            >
            <div class="layui-input-block">
              <select
                name="prodWarehouseId"
                lay-verify="required"
                lay-search
              ></select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label"
            >匹配物流方式</label
          >
          <div class="layui-input-block"></div>
          <div class="layui-input-block" style="margin-left: 60px!important;">
            <div class="layui-col-lg12 layui-col-md12">
              <label class="layui-form-label small-width">物流商</label>
              <div class="layui-input-block small-ml">
                <select
                  name="logisticCompanyName"
                  lay-filter="public_listFormula_editModal_logisticCompanyName"
                >
                  <option value="">请选择</option>
                </select>
              </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12">
              <label class="layui-form-label small-width">物流方式</label>
              <div class="layui-input-block small-ml">
                <select
                  name="logisticTypeName"
                  lay-filter="public_listFormula_editModal_logisticTypeName"
                >
                  <option value="">请选择</option>
                </select>
              </div>
            </div>
            <div class="layui-col-lg12 layui-col-md12">
              <label class="layui-form-label small-width">计费国</label>
              <div class="layui-input-block small-ml">
                <select name="logisticChargingCountry">
                  <option value="">请选择</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">浮动区间</label>
            <div class="layui-input-block">
              <div class="disflex">
                <input
                  type="number"
                  name="floatRateMin"
                  class="layui-input"
                  placeholder="包含该数值"
                  onkeypress="commonKeyPressInputInt(event)"
                />
                <span>%</span>
                <span class="ml20">-</span>
                <input
                  type="number"
                  name="floatRateMax"
                  class="layui-input ml20"
                  placeholder="包含该数值"
                  onkeypress="commonKeyPressInputInt(event)"
                />
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">定价精度</label>
            <div class="layui-input-block disflex">
              <select name="priceAccuracy">
                <option value="0.01">0.01</option>
                <option value="0.1">0.1</option>
                <option value="1">1</option>
                <option value="10">10</option>
                <option value="100">100</option>
                <option value="1000">1000</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">匹配店铺</label>
            <div class="layui-input-block">
                <a class="layui-btn layui-btn-xs" id="showMatchStore"
                >匹配店铺</a
              >
              <div id="matchStoreInfo"></div>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="layui-col-lg12 layui-col-md12">
            <label class="layui-form-label">备注</label>
            <div class="layui-input-block">
              <textarea name="remark" placeholder="请输入备注" class="layui-textarea"></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script type="text/html" id="public_listFormula_matchStorePop">
  <div class="p10" style="display: flex;justify-content: space-between;flex-direction: column;">
      <div class="layui-tab layui-tab-card">
          <%--<div class="layui-tab-content">--%>
              <%--<div class="layui-tab-item layui-show p20">--%>
                  <form class="layui-form" lay-filter="matchStoreForm_public_listFormula" id="matchStoreForm_public_listFormula">
                      <div class="layui-form-item layui-row" style="padding: 5px 0;">
                          <div class="layui-col-md4 layui-col-lg4">
                              <label class="layui-form-label">全选</label>
                              <div class="layui-input-block" style="line-height: 30px!important;">
                                  <input type="checkbox" lay-skin="primary" title="" lay-filter="matchStoreForm_public_listFormula_checkAll">
                              </div>
                          </div>
                          <div class="layui-col-md4 layui-col-lg4">
                              <label class="layui-form-label">店铺</label>
                              <div class="layui-input-block">
                                  <input type="text" lay-skin="primary" title="" name="storeAcct" placeholder="单个模糊，多个精确逗号分隔" autocomplete="off" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md4 layui-col-lg4">
                              <div class="layui-input-block" style="line-height: 30px!important;">
                                  <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" lay-submit lay-filter="matchStoreForm_public_listFormula_submit">搜索</button>
                              </div>
                          </div>
                      </div>
                      <%--<div class="fieldBox"><input type="checkbox" title="子sku" disabled lay-skin="primary" checked></div>--%>
                  </form>
              <%--</div>--%>
          <%--</div>--%>
      </div>
      <div class="layui-tab layui-tab-card">
              <div class="layui-card-header" style="color: #468847;background-color: #dff0d8">已选择店铺
                  <button type="button" class="layui-btn ml20 layui-btn-xs" name="public_listFormulaCopy" id="public_listFormulaCopy" style="margin-left:100px;">一键复制</button>
              </div>
              <div class="layui-card-body">
                  <form class="layui-form" id="matchStoreForm_public_listFormula_checked" lay-filter="matchStoreForm_public_listFormula_checked">

                  </form>
              </div>
          </div>
  </div>
</script>

<!-- 日志弹框 -->
<script type="text/html" id="public_listFormula_logsLayer">
  <div style="padding:20px;">
    <div class="layui-form-item">
      <div class="layui-inline">
        <div class="layui-form-label">操作时间</div>
        <div class="layui-input-inline" style="width: 300px;">
          <input class="layui-input" type="text" readonly id="public_listFormula_logsTime" name="logsTime">
        </div>
      </div>
      <div class="layui-inline">
        <span class="layui-btn layui-btn-sm search">查询</span>
      </div>
    </div>
    <table class="layui-table">
      <thead>
        <tr>
          <th>操作时间</th>
          <th>操作人</th>
          <th>定价公式名称</th>
          <th>事件</th>
          <th>原值</th>
          <th>调整值</th>
          <th>结果</th>
        </tr>
      </thead>
      <tbody id="public_listFormula_logsTbody"></tbody>
    </table>
  </div>
</script>

<script src="${ctx}/static/js/publishs/public/listFormula.js"></script>

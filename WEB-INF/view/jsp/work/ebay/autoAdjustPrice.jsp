<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>定时调价规则</title>

<style>
  .ebay-autoAdjustPrice-title {
    color: #111;
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="ebay_autoAdjustPrice_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">规则名称</label>
                <div class="layui-input-block disflex">
                  <input type="text" class="layui-input" name="ruleName" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block disflex">
                  <select name="storeAcctIdList" id="ebay_autoAdjustPrice_storeAcctId" lay-search></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">状态</label>
                <div class="layui-input-block disflex">
                  <select name="status">
                    <option value="">请选择</option>
                    <option value="true">已开启</option>
                    <option value="false">已关闭</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">创建人</label>
                <div class="layui-input-block disflex">
                  <select name="creatorId" id="ebay_autoAdjustPrice_creator" lay-search></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">备注站点</label>
                <div class="layui-input-block disflex">
                  <select name="remarkSiteNameList" xm-select="ebay_autoAdjustPrice_site" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-input-block">
                  <a href="javascript:;" class="layui-btn layui-btn-sm" id="ebay_autoAdjustPrice_search">查询</a>
                  <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary" type="reset" id="ebay_autoAdjustPrice_reset">清空</a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="ebay_autoAdjustPrice_tab">
            <div class="disFCenter">
              <ul class="layui-tab-title">
                <li class="layui-this">数量(<span id="ebay_autoAdjustPrice_total">0</span>)</li>
              </ul>
              <div>
                <permTag:perm funcCode="ebay_autoAdjustPrice_rule_edit">
                  <a href="javascript:;" class="layui-btn layui-btn-sm" id="ebay_autoAdjustPrice_add">添加模板</a>
                </permTag:perm>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table class="layui-table" id="ebay_autoAdjustPrice_table" lay-filter="ebay_autoAdjustPrice_table"></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!--规则状态的开启和关闭-->
<script type="text/html" id="ebay_autoAdjustPrice_status">
    <permTag:perm funcCode="ebay_autoAdjustPrice_rule_edit_status">
      <div class="layui-form-item">
          {{# if(d.status){ }}
          <input type="checkbox" lay-skin="switch"
                 lay-filter="ebay_autoAdjustPrice_status_checkbox" value="{{d.id}}" checked>
          {{# }else{ }}
          <input type="checkbox" lay-skin="switch"
                 lay-filter="ebay_autoAdjustPrice_status_checkbox" value="{{d.id}}">
          {{# } }}
      </div>
  </permTag:perm>
  <permTag:lacksPerm funcCode="ebay_autoAdjustPrice_rule_edit_status">
      <div class="layui-form-item">
          {{# if(d.status){ }}
          <input type="checkbox" lay-skin="switch"
                 lay-filter="ebay_autoAdjustPrice_status_checkbox" value="{{d.id}}" checked disabled>
          {{# }else{ }}
          <input type="checkbox" lay-skin="switch"
                 lay-filter="ebay_autoAdjustPrice_status_checkbox" value="{{d.id}}" disabled>
          {{# } }}
      </div>
  </permTag:lacksPerm>
</script>

<script type="text/html" id="ebay_autoAdjustPrice_toolbar">
  <a href="javascript:;" class="layui-btn layui-btn-sm" lay-event="viewHistory">修改记录</a>
  <permTag:perm funcCode="ebay_autoAdjustPrice_rule_edit">
    <button class="layui-btn layui-btn-sm" style="padding: 0 6px;" lay-event="edit"><i class="layui-icon">&#xe642;</i></button>
  </permTag:perm>
  <permTag:lacksPerm funcCode="ebay_autoAdjustPrice_rule_edit">
    <button class="layui-btn layui-btn-sm layui-btn-disabled" style="padding: 0 6px;" disabled lay-event="edit"><i class="layui-icon">&#xe642;</i></button>
  </permTag:lacksPerm>
  <permTag:perm funcCode="ebay_autoAdjustPrice_rule_del">
    <button class="layui-btn layui-btn-sm layui-btn-danger" style="padding: 0 6px;" lay-event="delete"><i class="layui-icon">&#xe640;</i></button>
  </permTag:perm>
  <permTag:lacksPerm funcCode="ebay_autoAdjustPrice_rule_del">
    <button class="layui-btn layui-btn-sm layui-btn-danger layui-btn-disabled" style="padding: 0 6px;" disabled lay-event="delete"><i class="layui-icon">&#xe640;</i></button>
  </permTag:lacksPerm>
</script>

<script type="text/html" id="ebay_autoAdjustPrice_storeCount">
  <a lay-event="store" style="color:#1E90FF;cursor:pointer;">{{d.storeNums}}</a>
</script>

<!-- 规则弹窗 -->
<script type="text/html" id="ebay_autoAdjustPrice_addrules">
  <div class="layui-card">
    <div class="layui-card-body">
      <form class=" layui-form" id="ebay_autoAdjustPrice_addrules_form">
        <div class="layui-form-item">
          <label class="layui-form-label ebay-autoAdjustPrice-title"><font class="fRed">*</font>规则名称</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="ruleName" value="{{d.ruleName !== undefined ? d.ruleName : '' }}" placeholder="请输入规则名称，最长20字" />
          </div>
        </div>
        <div class="layui-form-label ebay-autoAdjustPrice-title mt10">调价策略</div>
        <div class="layui-form-item ml40">
          <div class="disflex">
            <div>
              <label class="layui-form-label"><font class="fRed">*</font>调价方式</label>
              <div class="layui-input-block disflex">
                <input type="radio" class="layui-input" name="floatType" value="1" title="执行数值" lay-filter="ebay_autoAdjustPrice_type" {{d.floatType == 1 && 'checked' }}/>
                <input type="radio" class="layui-input" name="floatType" value="2" title="执行比例" lay-filter="ebay_autoAdjustPrice_type" {{d.floatType == 2 && 'checked' }} />
              </div>
            </div>
            <div>
              <label class="layui-form-label"><font class="fRed">*</font>调价幅度</label>
              <div class="layui-input-block disflex" style="align-items: center;">
                <div>
                  <select name="floatPositive">
                    <option value=true {{d.floatPositive === true && 'selected' }}>自动递增</option>
                    <option value=false {{d.floatPositive ===false && 'selected' }}>自动递减</option>
                  </select>
                </div>
                <input type="text" class="layui-input" name="floatNum" value="{{d.floatNum !== undefined ? d.floatNum : '' }}" onkeypress="commonKeyPressInputFloat(event)"/>
                <span class="percentUnit">%</span>
              </div>
            </div>
          </div>
          <div class="disflex">
            <div>
              <label class="layui-form-label"><font class="fRed">*</font>毛利率上限</label>
              <div class="layui-input-block disflex" style="align-items: center;">
                <input class="layui-input" name="grossProfitRateMax" value="{{d.grossProfitRateMax !== undefined ? d.grossProfitRateMax : '' }}" onkeypress="commonKeyPressInputFloat(event)"/>
                <span>%</span>
              </div>
            </div>
            <div style="margin-left: 25px;">
              <label class="layui-form-label"><font class="fRed">*</font>毛利率下限</label>
              <div class="layui-input-block disflex" style="align-items: center;">
                <input class="layui-input" name="grossProfitRateMin" value="{{d.grossProfitRateMin !== undefined ? d.grossProfitRateMin : '' }}" onkeypress="commonKeyPressInputFloat(event)"/>
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-form-item mt10">
          <label class="layui-form-label ebay-autoAdjustPrice-title">调价对象一</label>
          <div class="ml40">
            <div style="line-height: 32px;"><i class="layui-icon mr10">&#xe702;</i>此处是并列条件，多少天内未售出和刊登时间是父sku级条件，其余条件均为子sku级。</div>
            <div>
              <label class="layui-form-label w90" style="padding: 9px 5px;"><font class="fRed">*</font>调价对象名称</label>
              <div class="layui-input-block ml120">
                <select name="remarkTargetsName" id="ebay_autoAdjustPrice_addrules_remarkTargetsName" lay-search></select>
              </div>
            </div>
            <div class="disFCenter">
              <div>
                <label class="layui-form-label">多少天未售出</label>
                <div class="layui-input-block w180">
                  <input type="text" value="{{d.notSoldDays !== undefined ? d.notSoldDays : '' }}" name="notSoldDays" class="layui-input" onkeypress="commonKeyPressInputInt(event)"/>
                </div>
              </div>
              <div>
                <label class="layui-form-label">刊登时间</label>
                <div class="layui-input-block w180">
                  <input class="layui-input" name="listingTime" id="ebay_autoAdjustPrice_addrules_listingtime" />
                </div>
              </div>
              <div>
                <label class="layui-form-label">listing总销量</label>
                <div class="layui-input-block disflex w180">
                  <input type="text" name="soldNumsMin" value="{{d.soldNumsMin !== undefined ? d.soldNumsMin : '' }}" class="layui-input" onkeypress="commonKeyPressInputInt(event)"/>
                  <input type="text" name="soldNumsMax" value="{{d.soldNumsMax !== undefined ? d.soldNumsMax : '' }}" class="layui-input" onkeypress="commonKeyPressInputInt(event)"/>
                </div>
              </div>
            </div>
            <div class="disFCenter">
              <div>
                <label class="layui-form-label">近7日销量</label>
                <div class="layui-input-block disflex w180">
                  <input type="text" name="currentSevenDaysSalesMin" value="{{d.currentSevenDaysSalesMin !== undefined ? d.currentSevenDaysSalesMin : '' }}" class="layui-input" onkeypress="commonKeyPressInputInt(event)"/>
                  <input type="text" name="currentSevenDaysSalesMax" value="{{d.currentSevenDaysSalesMax !== undefined ? d.currentSevenDaysSalesMax : '' }}" class="layui-input" onkeypress="commonKeyPressInputInt(event)"/>
                </div>
              </div>
              <div>
                <label class="layui-form-label">在线库存</label>
                <div class="layui-input-block disflex w180">
                  <input type="text" name="stockMin" value="{{d.stockMin !== undefined ? d.stockMin : '' }}" class="layui-input" onkeypress="commonKeyPressInputInt(event)"/>
                  <input type="text" name="stockMax" value="{{d.stockMax !== undefined ? d.stockMax : '' }}" class="layui-input" onkeypress="commonKeyPressInputInt(event)"/>
                </div>
              </div>
              <div>
                <label class="layui-form-label">价格</label>
                <div class="layui-input-block disflex w180">
                  <input type="text" name="priceMin" value="{{d.priceMin !== undefined ? d.priceMin : '' }}" class="layui-input" onkeypress="commonKeyPressInputFloat(event)"/>
                  <input type="text" name="priceMax" value="{{d.priceMax !== undefined ? d.priceMax : '' }}" class="layui-input" onkeypress="commonKeyPressInputFloat(event)"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-layui-form-item mt10">
          <label class="layui-form-label ebay-autoAdjustPrice-title">调价对象二</label>
          <div class="ml40">
            <div style="line-height: 32px;"><i class="layui-icon mr10">&#xe702;</i>与调价对象一满足一个即可。</div>
            <label class="layui-form-label">itemID</label>
            <div class="layui-input-block">
              <textarea name="itemIdStr" class="layui-textarea" placeholder="以英文逗号分割"></textarea>
            </div>
          </div>
        </div>
        <div class="layui-form-label ebay-autoAdjustPrice-title mt10">执行日期</div>
        <div class="layui-form-item">
          <div class="ml40">
            <div>
              <label class="layui-form-label"><font class="fRed">*</font>每周</label>
              <div class="layui-input-block">
                <input type="checkbox" name="weekDay" lay-skin="primary" value="2" title="周一" {{d.weekDay && d.weekDay.includes(2) && 'checked' }} />
                <input type="checkbox" name="weekDay" lay-skin="primary" value="3" title="周二" {{d.weekDay && d.weekDay.includes(3) && 'checked' }} />
                <input type="checkbox" name="weekDay" lay-skin="primary" value="4" title="周三" {{d.weekDay && d.weekDay.includes(4) && 'checked' }} />
                <input type="checkbox" name="weekDay" lay-skin="primary" value="5" title="周四" {{d.weekDay && d.weekDay.includes(5) && 'checked' }} />
                <input type="checkbox" name="weekDay" lay-skin="primary" value="6" title="周五" {{d.weekDay && d.weekDay.includes(6) && 'checked' }} />
                <input type="checkbox" name="weekDay" lay-skin="primary" value="7" title="周六" {{d.weekDay && d.weekDay.includes(7) && 'checked' }} />
                <input type="checkbox" name="weekDay" lay-skin="primary" value="1" title="周日" {{d.weekDay && d.weekDay.includes(1) && 'checked' }} />
              </div>
            </div>
            <div class="disflex">
              <div>
                <label class="layui-form-label w100" style="padding: 9px 0;"><font class="fRed">*</font>每次执行时间</label>
                <div class="layui-input-block">
                  <select name="excecuteTime" id="ebay_autoAdjustPrice_addrules_executTime"  lay-search></select>
                </div>
              </div>
              <div>
                <label class="layui-form-label w100" style="padding: 9px 0;"><font class="fRed">*</font>周期起止时间</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="day" id="ebay_autoAdjustPrice_addrules_timeLimit" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="layui-form-label ebay-autoAdjustPrice-title mt10">模板备注</div>
        <div class="layui-form-item ml40">
          <div></div>
          <label class="layui-form-label">仓库类型</label>
          <div class="layui-input-block">
            <select name="remarkWarehouseId">
              <option value="">全部</option>
              <option value="0" {{d.remarkWarehouseId === 0 && 'selected' }}>国内仓</option>
              <option value="1" {{d.remarkWarehouseId === 1 && 'selected' }}>虚拟仓</option>
              <option value="2" {{d.remarkWarehouseId === 2 && 'selected' }}>海外仓</option>
            </select>
          </div>
          <label class="layui-form-label">站点</label>
          <div class="layui-input-block">
            <select name="remarkSiteName" xm-select="ebay_autoAdjustPrice_addrules_site" xm-select-search xm-select-search-type="dl" xm-select-skin="normal"></select>
          </div>
          <label class="layui-form-label">说明</label>
          <div class="layui-input-block">
            <textarea name="remark" class="layui-textarea"></textarea>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script type="text/html" id="ebay_autoAdjustPrice_historyTpl">
  <div class="layui-card">
    <div class="layui-card-body" style="padding-bottom: 30px;">
      <table class="layui-table" id="ebay_autoAdjustPrice_history_table" lay-filter="ebay_autoAdjustPrice_history_table"></table>
    </div>
  </div>
</script>

<script type="text/html" id="ebay_autoAdjustPrice_history">
  <a lay-event="viewHistory" style="color:#1E90FF;cursor:pointer;">{{d.ruleName}}</a>
</script>

<script type="text/html" id="ebay_autoAdjustPrice_storeTpl">
  <div class="layui-card">
    <div class="layui-card-header disFCenter">
      <div>规则名称:<span class="rulename ml10"></span></div>
      <div>
        <permTag:perm funcCode="ebay_autoAdjustPrice_store_edit">
          <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-danger" id="ebay_autoAdjustPrice_store_del">批量删除</a>
          <a href="javascript:;" class="layui-btn layui-btn-sm" id="ebay_autoAdjustPrice_store_add">添加店铺</a>
        </permTag:perm>
      </div>
    </div>
    <div class="layui-card-body" style="padding-bottom: 30px;">
      <table class="layui-table" id="ebay_autoAdjustPrice_store_table" lay-filter="ebay_autoAdjustPrice_store_table"></table>
    </div>
  </div>
</script>

<script type="text/html" id="ebay_autoAdjustPrice_store_toolbar">
  <permTag:perm funcCode="ebay_autoAdjustPrice_store_edit">
    <button class="layui-btn layui-btn-sm layui-btn-danger" style="padding: 0 6px;" lay-event="delete"><i class="layui-icon">&#xe640;</i></button>
  </permTag:perm>
  <permTag:lacksPerm funcCode="ebay_autoAdjustPrice_store_edit">
    <button class="layui-btn layui-btn-sm layui-btn-danger layui-btn-disabled" style="padding: 0 6px;" lay-event="delete" disabled><i class="layui-icon">&#xe640;</i></button>
  </permTag:lacksPerm>
</script>

<script type="text/html" id="ebay_autoAdjustPrice_add_storeTpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <form class="layui-form">
        <div class="layui-form-item">
          <label class="layui-form-label">店铺名称</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="storeAcctStr" placeholder="支持批量输入，以英文逗号分隔" />
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/autoAdjustPrice.js"></script>

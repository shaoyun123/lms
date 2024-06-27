<%@ page language='java' import='java.util.*' contentType='text/html;charset=UTF-8' %> <%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core' %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>自动调价</title>
<style>
  #autoAdPrice_ruleForm .layui-form-label{
    width: 110px;
  }
  #autoAdPrice_ruleForm .layui-input-block{
    margin-left: 140px;
  }
  .fieldBox_autoAdjustPrice{
    float: left;
    width: 20%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
    text-overflow:ellipsis;
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
          <form action="" class="layui-form" id="autoAdPrice_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">平台</label>
                <div class="layui-input-block">
                  <select name="platCode" lay-search id="autoAdPrice_form_platCode" lay-filter="autoAdPrice_form_platCode"></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                  <select name="salesSite" lay-search id="autoAdPrice_form_salesSite" lay-filter="autoAdPrice_form_salesSite"></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">适用店铺</label>
                <div class="layui-input-block">
                  <select
                  name="storeAcctId"
                  id="public_autoAdPrice_form_storeAcctIdList"
                  xm-select="public_autoAdPrice_form_storeAcctIdList"
                  xm-select-search
                  xm-select-skin="normal"
                  xm-select-search-type="dl"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-input-block">
                  <a href="javascript:;" class="layui-btn layui-btn-sm" id="autoAdPrice_search">查询</a>
                  <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary" type="reset" id="autoAdPrice_reset">清空</a>
                </div>
              </div>
            </div>
            <div class="layui-form-item layui-row aliexpressIsShow disN" style="color:red;">
                 提示：速卖通默认的调价规则需用于自动打”待调价“标签，请谨慎修改
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="autoAdPrice_tab">
            <div class="disFCenter">
              <div>
                <ul class="layui-tab-title">
                  <li class="layui-this">数量(<span id="autoAdPrice_total">0</span>)</li>
                </ul>
              </div>
              <div>
                <permTag:perm funcCode="autoAdPrice_rule_add">
                  <a href="javascript:;" class="layui-btn layui-btn-sm" id="autoAdPrice_add">新增</a>
                </permTag:perm>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table class="layui-table" id="autoAdPrice_table" lay-filter="autoAdPrice_table"></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script type="text/html" id="autoAdPrice_toolbar">
  <permTag:perm funcCode="autoAdPrice_rule_edit">
    <button class="layui-btn layui-btn-sm" lay-event="edit">修改</button>
  </permTag:perm>
  <button class="layui-btn layui-btn-sm" lay-event="matchStore">匹配店铺</button>
  <button class="layui-btn layui-btn-sm" lay-event="setAsDefault">设为默认</button>
  <permTag:lacksPerm funcCode="autoAdPrice_rule_edit">
    <button class="layui-btn layui-btn-sm layui-btn-disabled" lay-event="edit" disabled>修改</button>
  </permTag:lacksPerm>
</script>

<!--规则状态的开启和关闭-->
<script type="text/html" id="autoAdPrice_status_tpl">
  <permTag:perm funcCode="autoAdPrice_rule_edit">
    <div class="layui-form-item">
      {{# if(d.status==1){ }}
      <input type="checkbox" lay-skin="switch" lay-filter="autoAdPrice_status" value="{{d.id}}" data-arr="{{d}}" checked />
      {{# }else{ }}
      <input type="checkbox" lay-skin="switch" lay-filter="autoAdPrice_status" value="{{d.id}}" />
      {{# } }}
    </div>
  </permTag:perm>
  <permTag:lacksPerm funcCode="autoAdPrice_rule_edit">
    <div class="layui-form-item" disabled>
      {{# if(d.status==1){ }}
      <input type="checkbox" lay-skin="switch" lay-filter="autoAdPrice_status" value="{{d.id}}" checked disabled />
      {{# }else{ }}
      <input type="checkbox" lay-skin="switch" lay-filter="autoAdPrice_status" value="{{d.id}}" disabled />
      {{# } }}
    </div>
  </permTag:lacksPerm>
</script>
<%--  默认--%>
  <script type="text/html" id="autoAdPrice_ifDefault_tpl">
    <div class="layui-form-item" disabled>
    {{# if(d.ifDefault==true){ }}
    <input type="checkbox" lay-skin="primary" checked disabled />
    {{# }else{ }}
    <input type="checkbox" lay-skin="primary" disabled />
    {{# } }}
    </div>
  </script>
  <script type="text/html" id="autoAdPrice_storeAcctStr_tpl">
    <div class="showLine4">
      <span class="pora copySpan">
        <a> {{d.storeAcctStr||''}} </a>
        <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this)">复制</button>
      </span>
    </div>
  </script>
<!-- 添加/修改 -->
<script type="text/html" id="autoAdPrice_rule_tpl">
  <div class="layui-card">
    <div class="layui-card-body">
      <form class="layui-form" id="autoAdPrice_ruleForm">
        <div class="layui-form-item">
          <label class="layui-form-label"><font class="fRed">*</font>平台</label>
          <div class="layui-input-block w300">
            {{# if(d.type==='update'){ }}
            <div style="line-height: 32px;">{{d.platCode}}</div>
            {{# }else{ }}
            <select name="platCode" lay-search id="autoAdPrice_rule_platCode" lay-filter="autoAdPrice_rule_platCode"></select>
            {{# } }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">站点</label>
          <div class="layui-input-block w300">
            {{# if(d.type==='update'){ }}
            <div style="line-height: 32px;" class="salesSiteText">{{d.salesSite===undefined ? '暂无站点' : d.salesSite}}</div>
            {{# }else{ }}
            <select name="salesSite" lay-search id="autoAdPrice_rule_salesSite">
              <option value=""></option>
            </select>
            {{# } }}
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label priceDifferenceRange">差价幅度</label>
          <div class="layui-input-block disflex">
            <div class="w150">
              <input
                class="layui-input"
                value="{{d.priceDifferenceRangeGte!==undefined ?d.priceDifferenceRangeGte :''}}"
                name="priceDifferenceRangeGte"
                type="number"
                placeholder="&ge;"
              />
            </div>
            <div class="w150">
              <input
                class="layui-input"
                value="{{d.priceDifferenceRangeLte!==undefined ?d.priceDifferenceRangeLte :''}}"
                name="priceDifferenceRangeLte"
                type="number"
                placeholder="&le;"
              />
            </div>
            <span>（0.1表示10%）</span>
          </div>
        </div>
        <div class="layui-form-item onlyShopee hidden">
          <label class="layui-form-label">促销价差价范围(&yen;)</label>
          <div class="layui-input-block disflex">
            <div class="w150">
              <input class="layui-input" name="priceDifferenceGte" value="{{d.priceDifferenceGte!==undefined ?d.priceDifferenceGte :''}}" onblur="commonBlurFloatTwo(event)" />
            </div>
            <div class="w150">
              <input class="layui-input" name="priceDifferenceLte" value="{{d.priceDifferenceLte!==undefined ?d.priceDifferenceLte :''}}" onblur="commonBlurFloatTwo(event)" />
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label salesType">listing销量</label>
          <div class="layui-input-block disflex">
            <div class="w150">
              <select name="salesDay" id="autoAdPrice_rule_salesDay">
              </select>
            </div>
            <div class="w150">
              <input class="layui-input" name="salesLte" value="{{d.salesLte!==undefined ?d.salesLte :''}}" onkeypress="commonKeyPressInputNotNega(event)" />
            </div>
          </div>
        </div>
        <div class="ml40">提示：满足以上设置条件的商品子SKU系统自动调价。</div>
        <div class="ml40">差价幅度：（新促销价-原促销价）/原促销价，取绝对值。</div>
        <div class="ml40 onlyShopee hidden">促销价差价范围：新促销价-原促销价，取绝对值，币种为人民币。所有调价参数取交集。</div>
      </form>
    </div>
  </div>
</script>
<script type="text/html" id="matchStorePop_autoAdjustPrice">
  <div class="p10" style="display: flex;justify-content: space-between;flex-direction: column;">
    <div class="layui-tab layui-tab-card">
      <form class="layui-form" lay-filter="matchStoreForm_autoAdjustPrice" id="matchStoreForm_autoAdjustPrice">
        <div class="layui-form-item layui-row" style="padding: 5px 0;">
          <div class="layui-col-md4 layui-col-lg4">
            <label class="layui-form-label">全选</label>
            <div class="layui-input-block" style="line-height: 30px!important;">
              <input type="checkbox" lay-skin="primary" title="" lay-filter="matchStoreForm_autoAdjustPrice_checkAll">
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
              <button type="button" class="layui-btn ml20 layui-btn-sm keyHandle" lay-submit lay-filter="matchStoreForm_autoAdjustPrice_submit">搜索</button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="layui-tab layui-tab-card">
      <div class="layui-card-header" style="color: #468847;background-color: #dff0d8">已选择店铺
        <button type="button" class="layui-btn ml20 layui-btn-xs" name="autoAdjustPriceCopy" style="margin-left:100px;">一键复制</button>
      </div>
      <div class="layui-card-body">
        <form class="layui-form" id="matchStoreForm_autoAdjustPrice_checked" lay-filter="matchStoreForm_autoAdjustPrice_checked">
        </form>
      </div>
    </div>
  </div>
</script>
<script src="${ctx}/static/js/publishs/public/autoAdjustPrice.js"></script>

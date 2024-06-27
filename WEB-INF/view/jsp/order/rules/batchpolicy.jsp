<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<title>批次策略</title>

<style>
.batchpolicyOpen {
  color: #1e9fff;
  border-bottom: 1px solid #1e9fff;
}
.batchpolicyClose {
  color: #ff5722;
  border-bottom: 1px solid #ff5722;
}
#batchpolicy_LayerId,
#batchpolicy_groupLayerId {
  padding:20px;
}
.batchpolicy_group {
  line-height: 32px;
}
.groupingSequence {
  height: 32px;
  border-bottom: 1px solid #4bb2ff;
  color: #4bb2ff;
}
.batchpolicy_a{
    color: #428bd4 !important;
    text-decoration: none;
  }
  .country_countainer_search {
        width: 270px;
        position: absolute;
        z-index: 999;
        top: 35px;
        right: 45px;
    }
    #batchpolicy_country_container .country_countainer_content .layui-form-checkbox,
    #batchpolicy_country_container .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox{
    width: 200px;
    padding: 5px;
    }
    #batchpolicy_country_container .country_countainer_content .layui-form-checkbox span,
    #batchpolicy_country_container .country_countainer_selected .country_countainer_selected_content .layui-form-checkbox span {
    position: absolute;
    left: 15px;
    }
    #batchpolicy_country_container .country_countainer_selected {
        border: 1px solid #d6e9c6;
        border-radius: 2px;
    }
    #batchpolicy_country_container .country_countainer_selected .country_countainer_selected_title{
    height:40px;
    line-height: 40px;
    background-color:#dff0d8;
    padding-left: 20px;
    position: relative;
    }
    #batchpolicy_country_container .country_countainer_selected .country_countainer_selected_title h3{
    color: #468847;
    }
    #batchpolicy_country_container .country_countainer_selected .country_countainer_selected_content {
        padding: 5px 20px;
    }
</style>

<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <div class="layui-card">
              <div class="layui-card-body">
                <div> 1.按照优先级顺序生成批次，优先级相同的策略对应的订单一起生成批次</div>
                <div>2.相同优先级，容量上下限和分组顺序都取最早的配置值</div>
                <div>3.分组顺序不设置时，默认按照库位正序生成批次，多品订单取第一个商品对应的库位排序</div>
                <div>4.同一楼层的多品订单，都会优先同一通道生成订单(如果同一通道不足容量上限，会找临近的下一通道凑够数量)</div>
                <div>5.排除“待对接物流”下的所有物流方式</div>
              </div>
            </div>
            <!-- 表格-->
            <div class="layui-card">
                <div class="layui-card-header" style="display:flex;justify-content: flex-end;align-items: center;">
                  <span class="layui-btn layui-btn-sm layui-btn-normal" id="batchpolicy_addBtn">新增</span>
                </div>
                <div class="layui-card-body">
                   <table class="layui-table" id="batchpolicy_table" lay-filter="batchpolicy_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<%-- 操作栏 --%>
<script type="text/html" id="batchpolicy_tableIdBar">
    <a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">删除</a>
</script>

<%-- 表格渲染 --%>
<script type="text/html" id="batchpolicy_orderType">
  <div>
  {{d.orderType == 0 ? '单品': '多品'}}
  </div>
</script>

<%-- 表格渲染 --%>
<script type="text/html" id="batchpolicy_capacity">
<div>
  {{d.capacityMin}} - {{d.capacityMax}}
  </div>
</script>

<%-- 表格渲染 --%>
<script type="text/html" id="batchpolicy_orderProcessDay">
    {{# if(d.orderProcessDayMin != undefined && d.orderProcessDayMax != undefined){ }}
    <div>
        {{d.orderProcessDayMin}} - {{d.orderProcessDayMax}}
    </div>
    {{# }else{ }}
    <div></div>
    {{# } }}
</script>

<%-- 表格渲染 --%>
<script type="text/html" id="batchpolicy_status">
 <!-- <span class="{{d.status == 0 ? 'layui-btn-normal': 'layui-btn-danger'}} layui-btn layui-btn-xs" lay-event="setStatu">{{d.status == 0 ? '启用': '关闭'}}</span> -->
 <div class="layui-form status" lay-event="setStatu">
  <input type="checkbox" name="status" lay-skin="switch" lay-filter="batchpolicy_status_switchFilter" lay-text="开启|关闭" {{d.status ? 'checked': ''}}>
</div>
</script>

<%-- 新增弹框 --%>
<script type="text/html" id="batchpolicy_Layer">
<div class="layui-col-lg12 layui-col-md12">
<form class="layui-form" id="batchpolicy_LayerForm"></form>
</div>
</script>
<script type="text/html" id="batchpolicy_LayerFormTpl">
  {{# if(d.id){ }}
  <input type="hidden" name="id" value="{{d.id}}">
  {{# } }}
  <fieldset class="layui-elem-field layui-field-title"><legend style="font-size: 16px;">筛选规则</legend></fieldset> 
  <div class="layui-form-item">
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">波次名称<font color="red">*</font></label>
      <div class="layui-input-block">
        <select name="waveName">
          {{# layui.each(d.waveNames, function(index, item){ }}
            {{# if(d.waveName == item){ }}
            <option value="{{item}}" selected>{{item}}</option>
            {{# }else{ }}
            <option value="{{item}}">{{item}}</option>
            {{# } }}
          {{# }) }}
        </select>
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">策略名称<font color="red">*</font></label>
      <div class="layui-input-block">
        <input type="text" class="layui-input" name="ruleName" value="{{d.ruleName}}">
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">优先级<font color="red">*</font></label>
      <div class="layui-input-block">
        <input type="text" class="layui-input" name="priority" value="{{d.priority}}">
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">订单类型<font color="red">*</font></label>
      <div class="layui-input-block">
        <select name="orderType" lay-filter="batchpolicy_orderTypeFilter">
          <option value="0" {{d.orderType == 0 ? 'selected': ''}}>单品</option>
          <option value="1" {{d.orderType == 1 ? 'selected': ''}}>多品</option>
        </select>
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">平台</label>
      <div class="layui-input-block">
        <select name="platCode" xm-select="batchpolicy_platCode" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
          {{# layui.each(d.platCodes, function(index, item){ }}
            <option value="{{item}}">{{item}}</option>
          {{# }) }}
        </select>
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">剩余天数≤</label>
      <div class="layui-input-block">
        <input type="number" class="layui-input" name="remainingDays" value="{{d.remainingDays}}" oninput="numberCheck(value, 'remainingDays')">
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">物流方式集</label>
      <div class="layui-input-block">
        <select name="logisCollectionId"  xm-select="batchpolicy_logisCollectionId" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
          {{# layui.each(d.logisMaps, function(index, item){ }}
            <option value="{{item.name}}">{{item.value}}</option>
          {{# }) }}
        </select>
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label">标记发货</label>
      <div class="layui-input-block">
        <select name="markShippingStatus">
          {{# if(d.markShippingStatus=='' || d.markShippingStatus==undefined){ }}
          <option value="">请选择</option>
          <option value="1">已标记</option>
          <option value="0,2,3">未标记</option>
          {{# }else{ }}
          <option value="">请选择</option>
          <option value="1" {{d.markShippingStatus==1 ? 'selected': ''}}>已标记</option>
          <option value="0,2,3" {{d.markShippingStatus!=1 ? 'selected': ''}}>未标记</option>
          {{# } }}

        </select>
      </div>
    </div>
    <div class="layui-col-lg4 layui-col-md4">
        <label class="layui-form-label">订单处理时间</label>
        <div class="layui-input-block" style="display:flex;margin-left:120px;">
            <input type="number" class="layui-input" name="orderProcessDayMin" value="{{d.orderProcessDayMin}}" oninput="numberCheck(value, 'orderProcessDayMin')">
            <span style="line-height:32px;margin:0 10px; display:inline-block">-</span>
            <input type="number" class="layui-input" name="orderProcessDayMax" value="{{d.orderProcessDayMax}}" oninput="numberCheck(value, 'orderProcessDayMax')">
        </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <div style="margin-left:33px;">
        <input type="checkbox" name="mergeSameSku" title="相同SKU的订单合并生成批次" lay-skin="primary" {{d.mergeSameSku ? 'checked': ''}}  {{d.orderType==1?'disabled': ''}}> 
      </div>
    </div>
  </div>
  <div class="layui-col-md12 layui-col-lg12" style="margin-bottom:20px;">
    <div class="layui-form-label" style="width: 90px;">订单国家/地区</div>
    <div class="layui-input-block">
      <div data-type="countryCode" style="line-height: 32px;">
        <a href="javascript:;" class="batchpolicy_a">{{d.countryExclude == true ? '排除以下国家/地区:' : '包含以下国家/地区:'}}</a>
        <span style="word-break: break-all;" class="batchpolicy_span">{{d.countryName || ''}}</span>
        <input type="hidden" name="countryCode" value="{{d.countryCode || ''}}">
        <input type="hidden" name="countryExclude" value="false">
      </div>
    </div>
  </div>
  <fieldset class="layui-elem-field layui-field-title"><legend style="font-size: 16px;">生成规则</legend></fieldset> 
  <div class="layui-form-item">
    <div class="layui-col-lg4 layui-col-md4">
      <label class="layui-form-label" style="width: 90px;">容量上下限制<font color="red">*</font></label>
      <div class="layui-input-block" style="display:flex;margin-left:120px;">
        <input type="text" class="layui-input" name="capacityMin" value="{{d.capacityMin}}">
        <span style="line-height:32px;margin:0 10px; display:inline-block">-</span>
        <input type="text" class="layui-input" name="capacityMax" value="{{d.capacityMax}}">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg12 layui-col-md12">
      <label class="layui-form-label">分组顺序</label>
      <div class="layui-input-block batchpolicy_group">
        <span class="layui-btn layui-btn-xs layui-btn-normal" id="batchpolicy_groupBtn">新增分组顺序</span>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-col-lg12 layui-col-md12">
      <label class="layui-form-label">分组顺序</label>
      <div class="layui-input-block batchpolicy_group">
        <div class="groupingSequence">{{d.groupingSequence}}</div>
        <input type="hidden" name="groupingSequence" value="{{d.groupingSequence}}">
      </div>
    </div>
  </div>
  <div class="layui-form-item" style="margin-left:30px;">
    <div class="layui-col-lg12 layui-col-md12">
      <input type="checkbox" name="assignPickUser" title="按指定配货规则设置分拣人" lay-skin="primary" {{d.assignPickUser ? 'checked': ''}}> 
    </div>
  </div>
</script>


<%-- 分组顺序弹框 --%>
<script type="text/html" id="batchpolicy_groupLayer">
<div style="display: flex;">
  <input type="text" class="layui-input" placeholder="多个逗号隔开,如2,3,4">
  <span class="layui-btn-sm layui-btn add" style="margin-left:10px;">添加</span>
</div>
<div>
  <table class="layui-table">
    <thead>
      <tr>
        <th>顺序</th>
        <th>楼层号</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>
</script>

<%-- 国家或区域弹框 --%>
<script type="text/html" id="batchpolicy_countryLayer">
    <div id="batchpolicy_country_container" style="padding:20px;">
    </div>
</script>
<script type="text/html" id="batchpolicy_country_containerTpl">
    <div class="country_countainer_search disflex">
       <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-normal mr10" id="batchpolicy_country_checkSelect_btn">一键选择</a >
       <input type="text" class="layui-input" placeholder="回车搜索,多个搜索逗号隔开;" name="country_search">
    </div>
    <div class="country_countainer_content">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title">
                <li class="layui-this">A-E</li>
                <li>F-J</li>
                <li>K-O</li>
                <li>P-T</li>
                <li>U-Z</li>
            </ul>
            <div class="layui-tab-content allCountryContainer">
                <div class="layui-tab-item layui-show">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary" lay-filter="aeCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['A-E'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary" lay-filter="fjCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['F-J'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" 
                    lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary"  lay-filter="koCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['K-O'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary" lay-filter="ptCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['P-T'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form">
                       <input type="checkbox" title="全选" lay-skin="primary"  lay-filter="uzCountries">
                    </div>
                    <div class="layui-form">
                    {{#  layui.each(d['U-Z'], function(index, item){ }}
                    <input type="checkbox" title="{{item.name}}({{item.abbr}})" name="{{item.abbr}}&auto" lay-skin="primary" lay-filter="conditionCountriesFilter">
                    {{#  }) }}
                    </div>
                </div>
            </div>
            <div class="layui-tab-content allCountrySearchContainer disN">
               <div class="layui-form">
                  
               </div>
            </div>
        </div>
    </div>
    <div class="country_countainer_selected">
       <div class="country_countainer_selected_title">
            <h3>已选择国家或区域</h3>
            <div class="layui-form" style="position:absolute;top:0;right:0;">
              <input type="checkbox" title="排除以下国家/地区" lay-skin="primary" name="excludeCountry">
            </div>
       </div>
       <div class="country_countainer_selected_content layui-form">
       </div>
    </div>
</script>




<script src="${ctx}/static/js/order/batchpolicy.js"></script>
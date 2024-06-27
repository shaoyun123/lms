<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<title>下架Listing</title>
<style>
  .text-log {
    max-width: 400px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
  }
  #detailTest {
    position: absolute;
    width: 300px;
    height: 300px;
    background-color: #fff;
    border: 1px solid red;
  }
  .switch-input .layui-disabled {
    background-color: #bbb;
  }
  .text-tag {
    padding: 0px 5px;
    height: 30px;
    line-height: 30px;
    background: rgb(236,245,255);
    color: rgb(64, 158, 255);
    border-radius: 4px;
    margin-right: 10px;
  }
</style>
<div class="layui-fluid" v-cloak>
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
            <form action="" class="layui-form" id="eaby_listing_form" autocomplete="off">
                <div class="layui-form-item layui-row">
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">任务名称</label>
                        <div class="layui-input-block">
                          <input type="text" class="layui-input" id="ruleName" />
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2">
                        <label class="layui-form-label">创建人</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" id="creatorStr" />
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label"><span style="color: red">*</span>任务类型</label>
                        <div class="layui-input-block">
                            <select name="executeType" lay-filter="executeType">
                              <option value="">请选择</option>
                              <option value="0">手动执行</option>
                              <option value="1">自动执行</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <label class="layui-form-label">周期起止时间</label>
                        <div class="layui-input-block">
                            <input type="text" class="layui-input" id="eaby_task_time" name="time" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                      <label class="layui-form-label">执行时间</label>
                      <div class="layui-input-block" id="ebay_excute_time_content">
                          <input type="text" class="layui-input" id="eaby_excute_time" autocomplete="off"
                              name="excuteTime">
                      </div>
                      <div class="layui-input-block disN" id="ebay_week_time_content">
                        <select name="executeDayList" xm-select="ebay_week_time" id="ebay_week_time" xm-select-search xm-select-search-type="dl" xm-select-skin="normal" lay-search>
                          <option value="">请选择</option>
                          <option value="2">周一</option>
                          <option value="3">周二</option>
                          <option value="4">周三</option>
                          <option value="5">周四</option>
                          <option value="6">周五</option>
                          <option value="7">周六</option>
                          <option value="1">周日</option>
                        </select>
                      </div>
                  </div>
                    <div class="layui-col-lg2 layui-col-md2">
                        <div class="layui-input-block clearfix">
                          <button id="ebaylisitng_searchBtn" class="layui-btn layui-btn-sm" type="button">查询
                          </button>

                          <button id="ebaylisitng_resetBtn" class="layui-btn layui-btn-primary layui-btn-sm" type="reset">清空
                          </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
      </div>

      <div class="layui-card">
        <div class="layui-card-body">
          <button class="layui-btn layui-btn-sm fr" style="margin: 10px 15px" id="ebaylisting_create">新建任务</button>
          <table class="layui-table" id="ebaylisting_table"
                  lay-filter="ebaylisting_table"></table>
        </div>
    </div>
    </div>
  </div>
</div>

<script type="text/html" id="ebaylisting_status">
    <div class="switch-input">
      {{# if(d.executeType == '0' || new Date(d.ruleEndTime).getTime() < new Date().getTime()){ }}
        {{# if(d.status) { }}
          <input type="checkbox" name="status" idValue="{{d.id}}" lay-skin="switch"
            disabled class="disabled" checked
            value="{{ d.status }}" lay-filter="status" />
        {{# }else { }}
          <input type="checkbox" name="status" idValue="{{d.id}}" lay-skin="switch"
            disabled class="disabled" value="{{ d.status }}" lay-filter="status" />
        {{# } }}
      {{# } else {  }}
        {{# if(d.status) { }}
        <input type="checkbox" name="status" idValue="{{d.id}}" lay-skin="switch" checked value="{{ d.status }}" lay-filter="status" />
        {{# }else { }}
        <input type="checkbox" name="status" idValue="{{d.id}}" lay-skin="switch" value="{{ d.status }}" lay-filter="status" />
        {{# } }}
        
      {{# } }}
    </div>
      
</script>


<script type="text/html" id="ebaylisting_executeType">
  {{# if(d.executeType == '1'){ }}
    自动执行
  {{# } }}
  {{# if(d.executeType == '0'){ }}
    手动执行
  {{# } }}
</script>

<script type="text/html" id="ebaylisting_time">
  {{ d.ruleStartTime || '' }} - {{ d.ruleEndTime || '' }} 
</script>

<script type="text/html" id="ebaylisting_excute_time">
  {{# if(d.executeType == '1'){ }}
    {{ d.autoExecuteTimeDesc || '' }}
  {{# } }}
  {{# if(d.executeType == '0'){ }}
    {{ Format(d.lastExecuteTime || '', 'yyyy-MM-dd hh:mm:ss') }}
  {{# } }}
</script>

<script type="text/html" id="ebaylisting_optionbtn">
  <a class="layui-btn layui-btn-xs mb" lay-event="ebaylisting_view">查看</a>
  <a class="layui-btn layui-btn-xs mb" lay-event="ebaylisting_edit">编辑</a>
  <a class="layui-btn layui-btn-xs mb" lay-event="ebaylisting_log">执行日志</a>
</script>


<script type="text/html" id="ebaylisting_create_layer">
  <form action="" class="layui-form" id="eaby_listing_create_form">
    <div class="layui-form-item" style="margin-top: 15px">
        <div class="layui-col-md8 layui-col-lg8">
            <label class="layui-form-label"><span style="color:red">*</span>任务名称</label>
            <div class="layui-input-block">
              <input type="text" class="layui-input" id="taskName" autocomplete="off" />
            </div>
        </div>
    </div>
    <h2 class="mb10" style="margin-left: 45px"><span style="color: red">*</span>筛选方式</h2>
    <div style="color: red;margin-left: 45px;margin-bottom: 10px">提示：以下四种方式至少选择一种</div>

    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
          <label class="layui-form-label">销售员</label>
          <div class="layui-input-block">
            <select name="salespersonIdStr" id="ebay_listing_userList"
                    class="users_hp_custom" lay-filter="ebay_listing_userList"
                    data-rolelist="ebay专员" xm-select="ebay_listing_userList" xm-select-search
                    xm-select-search-type="dl" xm-select-skin="normal" lay-search>
            </select>
          </div>
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">店铺</label>
        <div class="layui-input-block">
          <select name="storeAcctIdStr" id="ebay_listing_store_sel" lay-filter="ebay_listing_store_sel"
              xm-select="ebay_listing_store_sel" class="users_hp_store_multi" xm-select-search
              xm-select-search-type="dl" xm-select-skin="normal" data-platcode="ebay"
              name="ebay_listing_store_sel_name"></select>
        </div>
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">站点</label>
        <div class="layui-input-block">
            <select id="ebay_listing_site" lay-filter="ebay_listing_site"
                    name="siteIdStr"
                    xm-select="ebay_listing_site" class="salesSite_hp_custom_multi" xm-select-search
                    xm-select-search-type="dl" xm-select-skin="normal"></select>
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">刊登方式</label>
        <div class="layui-input-block">
          <select name="listingMethod" id="ebay_listing_lisitingMethod_sel" lay-search>
            <option value="">请选择</option>
            <option value="0">系统刊登</option>
            <option value="1">人工刊登</option>
          </select>
        </div>
      </div>
    </div>
    <h2 class="mb10" style="margin-left: 45px">筛选条件</h2>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>商品状态</label>
        <div class="layui-input-block">
          <select id="ebay_listing_productStatus" name="saleStatusList" lay-search lay-filter="ebay_listing_productStatus"
           xm-select="ebay_listing_productStatus" xm-select-search
           xm-select-search-type="dl" xm-select-skin="normal">
            <option value=""></option>
            <option value="2">在售</option>
            <option value="1">部分在售</option>
            <option value="0">停售</option>
            <option value="-1">无映射</option>
          </select>
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">刊登时间</label>
        <div class="layui-input-block">
          <input type="text" class="layui-input" id="eaby_publish_time" name="time" autocomplete="off">
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">刊登天数≥</label>
        <div class="layui-input-block">
          <input type="number" class="layui-input" id="eaby_publish_days" name="listingDays" autocomplete="off">
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>销量</label>
        <div class="layui-input-block">
          <select id="ebay_listing_soldnumtype_sel" name="notSoldDays" lay-search>
              <option value="">请选择</option>
              <option value="-1">历史销量等于0</option>
              <option value="30">30天等于0</option>
              <option value="60">60天等于0</option>
              <option value="90">90天等于0</option>
              <option value="180">180天等于0</option>
          </select>
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">商品类型</label>
        <div class="layui-input-block">
          <select name="isMultiSku" id="ebay_listing_producttype_sel"
            lay-filter="ebay_listing_producttype_sel">
            <option value=""></option>
            <option value="false">单属性</option>
            <option value="true">多属性</option>
        </select>
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">侵权状态</label>
        <div class="layui-input-block">

        <select name="tortBanListing" id="tortBanListing"
            lay-filter="ebayListing_tortPlat">
            <option value=""></option>
            <option value="CURRENT_PLAT">ebay侵权</option>
            <option value="ANY_PLAT">任一平台侵权</option>
        </select>
        </div>
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label">禁售站点</label>
        <div class="layui-input-block">
          <select name="prohibitSalesSiteIdStr" id="prohibitSalesSiteIdStr"
              lay-filter="ebayListing_prohibitSalesSiteId"
                xm-select="ebayListing_prohibitSalesSiteId" xm-select-search xm-select-skin="normal"
                xm-select-search-type="dl">
        </select>
        </div>
      </div>
    </div>
    <h2 class="mb10" style="margin-left: 45px">执行设置</h2>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>任务类型</label>
        <div class="layui-input-block">
          <input type="radio" value="0" lay-skin="primary" name="executeType" lay-filter="type_chk" title="手动执行">
          <input type="radio" value="1" lay-skin="primary" name="executeType" lay-filter="type_chk" title="定时任务">
        </div>
      </div>
    </div>
    <div class="layui-form-item disN" id="rangeTime">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>周期起止时间</label>
        <div class="layui-input-block">
          <input type="text" class="layui-input" id="eaby_range_time" name="time" autocomplete="off">
        </div>
      </div>
    </div>
    <div class="layui-form-item disN" id="dayRules">
      <div class="layui-col-md10 layui-col-lg10">
        <label class="layui-form-label"><span style="color:red">*</span>循环规则</label>
        <div class="layui-input-block">
          <input type="checkbox" value="2" lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周一">
          <input type="checkbox" value="3" lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周二">
          <input type="checkbox" value="4" lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周三">
          <input type="checkbox" value="5" lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周四">
          <input type="checkbox" value="6" lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周五">
          <input type="checkbox" value="7" lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周六">
          <input type="checkbox" value="1" lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周日">
        </div>
        <div style="color:red; margin-left: 100px">请至少选择一天</div>
      </div>
    </div>
    <div class="layui-form-item disN" id="excuteTime">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>执行时间</label>
        <div class="layui-input-block">
          <input type="text" class="layui-input" id="eaby_excute_create_time" name="time" autocomplete="off">
        </div>
      </div>
    </div>
    <div class="layui-form-item disN" id="listingNum">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>每天下架数量限制</label>
        <div class="layui-input-block">
          <input type="number" class="layui-input" id="eaby_listing_num" autocomplete="off">
        </div>
      </div>
    </div>
</form>
</script>


<script type="text/html" id="ebaylisting_view_layer">
  <form action="" class="layui-form" id="eaby_listing_create_form">
  </form>
</script>

<script type="text/html" id="ebaylisting_view_content_layer">
    <div class="layui-form-item" style="margin-top: 15px">
        <div class="layui-col-md12 layui-col-lg12">
            <label class="layui-form-label"><span style="color:red">*</span>任务名称:</label>
            <div class="layui-input-block" style="line-height: 32px">
              <span>{{d.ruleName}}</span>
            </div>
        </div>
    </div>

    <h2 class="mb10" style="margin-left: 40px"><span style="color: red">*</span>筛选方式</h2>

    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
          <label class="layui-form-label">销售员:</label>
          <div class="layui-input-block" style="display: flex;flex-wrap: wrap">
            {{# layui.each(d.salesPersonList||[], function(index, item){ }}
              <div class="text-tag">{{item}}</div>
            {{# }); }}
          </div>
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label">店铺:</label>
        <div class="layui-input-block" style="display: flex;flex-wrap: wrap">
          {{# layui.each(d.storeAcctList||[], function(index, item){ }}
            <div class="text-tag">{{item}}</div>
          {{# }); }}
        </div>
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label">站点:</label>
        <div class="layui-input-block" style="display: flex;flex-wrap: wrap">
          {{# layui.each(d.siteList||[], function(index, item){ }}
            <div class="text-tag">{{item}}</div>
          {{# }); }}
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label">刊登方式:</label>
        <div class="layui-input-block" style="line-height: 32px">
          <span>{{d.listingMethod == '0' ? '系统刊登' : d.listingMethod == '1' ? '人工刊登' : ''}}</span>
        </div>
      </div>
    </div>
    <h2 class="mb10" style="margin-left: 40px">筛选条件</h2>
    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label"><span style="color:red">*</span>商品状态:</label>
        <div class="layui-input-block" style="line-height: 32px">
          {{# if(d.isSale == '2'){ }}
            <div>在售</div>
          {{#} }}
          {{# if(d.isSale == '1'){ }}
            <div>部分在售</div>
          {{#} }}
          {{# if(d.isSale == '0'){ }}
            <div>停售</div>
          {{#} }}
          {{# if(d.isSale == '-1'){ }}
            <div>无映射</div>
          {{#} }}
          {{# if(d.isSale == ''){ }}
            <div></div>
          {{#} }}
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label"><span style="color:red">*</span>刊登时间:</label>
        <div class="layui-input-block" style="line-height: 32px">
          {{d.listingTime}}
          <!-- <input type="text" class="layui-input" disabled id="eaby_publish_time" name="time" autocomplete="off"> -->
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label"><span style="color:red">*</span>销量:</label>
        <div class="layui-input-block" style="line-height: 32px"> 
          {{# if(d.notSoldDays == '-1'){ }}
            <div>历史销量等于0</div>
          {{#} }}
          {{# if(d.notSoldDays == '30'){ }}
            <div>30天等于0</div>
          {{#} }}
          {{# if(d.notSoldDays == '60'){ }}
            <div>60天等于0</div>
          {{#} }}
          {{# if(d.notSoldDays == '90'){ }}
            <div>90天等于0</div>
          {{#} }}
          {{# if(d.notSoldDays == '180'){ }}
            <div>180天等于0</div>
          {{#} }}
          {{# if(d.notSoldDays == ''){ }}
            <div></div>
          {{#} }}
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label">商品类型:</label>
        <div class="layui-input-block" style="line-height: 32px">
          {{# if(d.isMultiSku == true){ }}
            <div>多属性</div>
          {{#} }}
          {{# if(d.isMultiSku == false){ }}
            <div>单属性</div>
          {{#} }}
          {{# if(d.isMultiSku == ''){ }}
            <div></div>
          {{#} }}
        </div>
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label">侵权状态:</label>
        <div class="layui-input-block" style="line-height: 32px">
          {{# if(d.tortBanListing == 'CURRENT_PLAT'){ }}
            <div>ebay侵权</div>
          {{#} }}
          {{# if(d.tortBanListing == 'ANY_PLAT'){ }}
            <div>任一平台侵权</div>
          {{#} }}
          {{# if(d.tortBanListing == ''){ }}
            <div></div>
          {{#} }}
        </div>
      </div>
    </div>

    <div class="layui-form-item">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label">禁售站点:</label>
        <div class="layui-input-block" style="display: flex;flex-wrap: wrap">
          {{# layui.each(d.prohibitSalesSiteList||[], function(index, item){ }}
            <div class="text-tag">{{item}}</div>
          {{# }); }}
        </div>
      </div>
    </div>
    <h2 class="mb10" style="margin-left: 40px">执行设置</h2>
    <div class="layui-form-item">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>任务类型:</label>
        <div class="layui-input-block">
          <input type="radio" value="0" disabled lay-skin="primary" name="executeType" lay-filter="type_chk" title="手动执行">
          <input type="radio" value="1" disabled lay-skin="primary" name="executeType" lay-filter="type_chk" title="定时任务">
        </div>
      </div>
    </div>
    <div class="layui-form-item disN" id="rangeTime">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label" style="width: 120px"><span style="color:red">*</span>周期起止时间:</label>
        <div class="layui-input-block" style="line-height: 32px">
          {{d.ruleStartTime}}
        </div>
      </div>
    </div>
    <div class="layui-form-item disN" id="dayRules">
      <div class="layui-col-md12 layui-col-lg12">
        <label class="layui-form-label"><span style="color:red">*</span>循环规则:</label>
        <div class="layui-input-block">
          <input type="checkbox" value="2" disabled lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周一">
          <input type="checkbox" value="3" disabled lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周二">
          <input type="checkbox" value="4" disabled lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周三">
          <input type="checkbox" value="5" disabled lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周四">
          <input type="checkbox" value="6" disabled lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周五">
          <input type="checkbox" value="7" disabled lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周六">
          <input type="checkbox" value="1" disabled lay-skin="primary" name="executeDay" lay-filter="day_chk" title="周日">
        </div>
        <!-- <div style="color:red; margin-left: 100px">请至少选择一天</div> -->
      </div>
    </div>
    <div class="layui-form-item disN" id="excuteTime">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>执行时间:</label>
        <div class="layui-input-block" style="line-height: 32px">
          {{d.executeTime}}
        </div>
      </div>
    </div>

    <div class="layui-form-item disN" id="listingNum">
      <div class="layui-col-md8 layui-col-lg8">
        <label class="layui-form-label"><span style="color:red">*</span>每天下架数量限制</label>
        <div class="layui-input-block" style="line-height: 32px">
          {{ d.endNumLimit }}
        </div>
      </div>
    </div>

</script>

<script type="text/html" id="ebaylisting_log_layer">
  <button class="layui-btn layui-btn-sm fr" style="margin: 10px 15px" id="ebaylisting_create" onclick="exportAll()">全部导出</button>
  <table class="layui-table" id="ebaylisting_log_table"
                  lay-filter="ebaylisting_log_table"></table>
</script>

<script type="text/html" id="ebaylisting_log_time">
  {{ Format(d.createTime || '', 'yyyy-MM-dd hh:mm:ss') }}
</script>

<script type="text/html" id="listing_content">
  <div class="text-log" onmouseenter="showDetail(this)" data-text="{{d.ruleDetail}}" onmouseleave="hideDetail(this)">{{ d.ruleDetailShort }}</div>

</script>

<script type="text/html" id="ebaylisting_log_optionbtn">
  <a class="layui-btn layui-btn-xs mb" lay-event="ebaylisting_export">导出</a>
</script>

<script type="text/javascript" src="${ctx}/static/js/publishs/ebay/offShelfListing.js"></script>
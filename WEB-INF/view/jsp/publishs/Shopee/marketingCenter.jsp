<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %><%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %> <%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>营销中心</title>
<link rel="stylesheet" href="${ctx}/static/vue/css/element-ui@2.13.0.css" />
<link
  rel="stylesheet"
  href="${ctx}/static/font_iconfont/iconfont.css"
  media="all"
/>
<style>
  #shopee_marketCenter .layui-col-md3 {
    margin-bottom: 10px;
  }

  .w_50 {
    width: 50%;
  }

  .m20 {
    margin: 20px;
  }

  .dis_flex {
    display: flex;
    justify-content: space-between;
  }

  .pt_5 {
    padding-top: 5px;
  }

  .shopee-marketing-center-label {
    width: 110px;
    padding: 0;
  }

  .shopee-marketCenter-radio-layout {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100px;
  }

  .shopee-marketCenter-btn-center {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .shopee_marketCenter_upload_parent {
    width: 110px;
    height: 30px;
    overflow: hidden;
  }

  .shopee_marketCenter_upload_file {
    opacity: 0;
    position: relative;
    z-index: 1;
  }

  .shopee_marketCenter_upload_btn {
    position: relative;
    top: -23px;
    z-index: 0;
  }

  .shopee_marketCenter_modal_scroll {
    overflow-y: scroll;
    height: 700px;
  }
  #shopee_marketCenter_newActivty_form .layui-input-block {
    width: 330px !important;
  }
  #shopee_marketCenter_newActivty_form_left .layui-input-block {
    width: 330px !important;
  }
  #shopee_marketCenter_card .layui-table-cell .hp-badge {
    overflow: hidden;
  }
  .shopee_marketCenter_none{
    flex: none;
  }
</style>
<div class="layui-fluid" v-cloak>
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shopee_marketCenter">
            <div class="layui-form-item layui-row">
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select
                    name="orgId"
                    lay-filter="orgs_hp_marketCenter"
                    lay-search
                    class="orgs_hp_custom"
                  >
                    <option value=""></option>
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-block">
                  <select
                    name="salespersonId"
                    class="users_hp_custom"
                    lay-search
                    data-rolelist="shopee专员"
                    lay-filter="users_hp_marketCenter"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select id="shopee_marketCenter_store" name="storeAcctIdList" lay-filter="shopee_marketCenter_store"
                      xm-select="shopee_marketCenter_store" class="users_hp_store_multi" xm-select-search 
                      xm-select-search-type="dl" xm-select-skin="normal" data-platcode="shopee">
                  </select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                  <select
                    id="shopee_marketCenter_site_sel"
                    name="siteIdList"
                    xm-select="shopee_marketCenter_site_sel"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">排序</label>
                <div class="layui-input-block">
                  <select lay-search name="orderCode">
                    <option value="">选择排序</option>
                    <option value="start_time asc">开始时间升序</option>
                    <option value="start_time desc">开始时间降序</option>
                    <option value="end_time asc">结束时间升序</option>
                    <option value="end_time desc">结束时间降序</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">优惠名称</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    placeholder="优惠名称"
                    autocomplete="off"
                    name="discountName"
                    class="layui-input"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">开始时间</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    name="startTime"
                    placeholder="开始时间"
                    autocomplete="off"
                    class="layui-input"
                    id="shopee_marketCenter_start"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">结束时间</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    name="endTime"
                    placeholder="结束时间"
                    autocomplete="off"
                    class="layui-input"
                    id="shopee_marketCenter_end"
                  />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">优惠类型</label>
                <div class="layui-input-block">
                  <select
                    lay-search
                    id="shopee_marketCenter_discount_type"
                    name="marketCenterType"
                    lay-filter="shopee_marketCenter_discount_type"
                  >
                    <!-- <option value="1">促销</option> -->
                    <option value="2">优惠券</option>
                    <option value="3">捆绑销售</option>
                    <!-- <option value="4">add-on</option> -->
                    <option value="5">关注有礼</option>
                  </select>
                </div>
              </div>
              <div id="shopee_marketCenter_search_linkage"></div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">活动类型</label>
                <div class="layui-input-block">
                  <select name="autoRenew" lay-search>
                    <option value="">请选择</option>
                    <option value="false">单次活动</option>
                    <option value="true">连续活动</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label labelSel">
                  <select
                    name="personType"
                    lay-filter="shopee_marketCenter_personType"
                  >
                    <option value="creator">创建人</option>
                    <option value="modifier">修改人</option>
                  </select>
                </label>
                <div class="layui-input-block">
                  <select
                    name="personName"
                    id="shopee_marketCenter_creator"
                    lay-search
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label labelSel">
                  <select name="timeType">
                    <option value="createTime">创建时间</option>
                    <option value="modifyTime">修改时间</option>
                  </select>
                </label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    id="shopee_marketCenter_timeTypeVal"
                    class="layui-input"
                    name="timeTypeVal"
                  />
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">店铺标签</label>
                <div class="layui-input-block">
                  <select
                    name="storeTagList"
                    xm-select="shopee_marketCenter_storeTagList"
                    lay-filter="shopee_marketCenter_storeTagList"
                    xm-select-search
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-input-block">
                  <button
                    class="layui-btn layui-btn-sm"
                    type="button"
                    id="shopee_marketCenter_search"
                  >
                    查询
                  </button>
                  <button
                    class="layui-btn layui-btn-sm layui-btn-primary"
                    type="reset"
                    id="shopee_marketCenter_reset"
                  >
                    清空
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card" id="shopee_marketCenter_card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="shopee_marketCenter_tab">
            <div class="layui-card-header">
              <div class="fixTab">
                <ul class="layui-tab-title" style="display: inline-block">
                  <li data-value="draft" status="draft" style="display: none">
                    未添加商品id(<span
                      id="shopee_marketCenter_draft_num_span"
                    ></span
                    >)
                  </li>
                  <li
                    data-value="upcoming"
                    class="layui-this"
                    status="upcoming"
                  >
                    未开始(<span
                      id="shopee_marketCenter_upcoming_num_span"
                    ></span
                    >)
                  </li>
                  <li data-value="ongoing" status="ongoing">
                    进行中(<span
                      id="shopee_marketCenter_ongoing_num_span"
                    ></span
                    >)
                  </li>
                  <li data-value="expired" status="expired">
                    结束(<span id="shopee_marketCenter_expired_num_span"></span
                    >)
                  </li>
                </ul>
                <div class="pt_5" id="shopee_marketCenter_right_linkage"></div>
              </div>
            </div>
            <!-- <div class="layui-tab-content"> -->
            <table
              class="layui-table"
              id="shopee_marketCenter_table"
              lay-filter="shopee_marketCenter_table"
            ></table>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 优惠类型联动 查询-->
<script type="text/html" id="shopee_marketCenter_addition_search">
  <!-- <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label shopee-marketing-center-label">
                    <select name="discountType">
                        {{# if(d.discountType=='3'){ }}
                            <option value="1">套装特价</option>
                            <option value="2">折扣百分比</option>
                            <option value="3">折扣金额</option>
                        {{# }else if(d=='1'){ }}
                               <option value="1">优惠比例</option>
                        {{#  }else if(d=='4'){ }}
                                <option value="1">折扣百分比</option>
                        {{# }else{ }}
                            <option value="1">优惠金额</option>
                            <option value="2">优惠比例</option>
                            <option value="3">金币返回比例</option>
                        {{# } }}
                    </select>
                </label>
                <div class="layui-input-block">
                    <div class="layui-col-lg6 layui-col-md6">
                        <input type="number" name="minValue" placeholder="最小值" class="layui-input">
                    </div>
                    <div class="layui-col-lg6 layui-col-md6">
                        <input type="number" name="maxValue" placeholder="最大值" class="layui-input">
                    </div>
                </div>
            </div> -->
  {{# if( d.discountType == '2' ){ }}
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">优惠券id</label>
    <div class="layui-input-block">
      <input
        type="text"
        name="voucherIds"
        placeholder="支持输入多个,英文逗号分隔"
        autocomplete="off"
        class="layui-input"
        onblur="shopeeMarketCenter_handleids(this.value,event)"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">优惠券类型</label>
    <div class="layui-input-block">
      <select name="voucherType" lay-search>
        <option value="">请选择</option>
        {{# layui.each(d.voucherTypeList,function(index,item){ }}
        <option value="{{item.code}}" {{item.code==1 && 'selected'}}>{{item.type}}</option>
        {{# }) }}
      </select>
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">展示类型</label>
    <div class="layui-input-block">
      <select
        name="displayChannelList"
        id="shopee_marketCenter_search_displayChannel"
        xm-select="shopee_marketCenter_search_displayChannel"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal"
      ></select>
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">优惠方式</label>
    <div class="layui-input-block">
      <select
        name="rewardTypeList"
        id="shopee_marketCenter_rewardTypeList"
        xm-select="shopee_marketCenter_rewardTypeList"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal"
      >
        <option value="1">折扣金额</option>
        <option value="2">优惠百分比</option>
        <option value="3">金币返还</option>
      </select>
    </div>
  </div>
  {{# }else if(d.discountType == '3' ){ }}
  <!-- <div class="layui-col-lg2 layui-col-md2">
            <div class="layui-form-label">SKU</div>
            <div class="layui-input-block">
                <input type="text" class="layui-input" name="" placeholder="逗号分隔查询">
            </div>
        </div> -->
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">捆绑销售id</label>
    <div class="layui-input-block">
      <input
        type="text"
        name="bundleDealIds"
        placeholder="支持输入多个,英文逗号分隔"
        autocomplete="off"
        class="layui-input"
        onblur="shopeeMarketCenter_handleids(this.value,event)"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">CNSC类目</label>
    <div class="layui-input-block disflex">
      <select
        name="isAllCate"
        lay-filter="shopeeMarketCenter_bundleDeal_isAllCate"
      >
        <option value="">请选择</option>
        <option value="true">全部分类</option>
        <option value="false">指定分类</option>
      </select>
      <input
        type="text"
        name="cateIds"
        placeholder="支持输入多个,英文逗号分隔"
        autocomplete="off"
        class="layui-input"
        onblur="shopeeMarketCenter_handleids(this.value,event)"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">销量</label>
    <div class="layui-input-block disflex" style="align-items: center">
      <input
        type="number"
        name="minSales"
        autocomplete="off"
        class="layui-input"
        onkeypress="commonKeyPressInputNotNega(event)"
      />
      <span class="ml10 mr10">-</span>
      <input
        type="number"
        name="maxSales"
        autocomplete="off"
        class="layui-input"
        onkeypress="commonKeyPressInputNotNega(event)"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label w100" style="padding: 9px 5px 9px 5px"
      >listing最小利润</label
    >
    <div class="layui-input-block disflex" style="align-items: center">
      <input
        type="number"
        name="minProfitGte"
        autocomplete="off"
        class="layui-input"
      />
      <span class="ml10 mr10">-</span>
      <input
        type="number"
        name="minProfitLte"
        autocomplete="off"
        class="layui-input"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label w100" style="padding: 9px 5px 9px 5px"
      >listing最小利率</label
    >
    <div class="layui-input-block disflex" style="align-items: center">
      <input
        type="number"
        name="minRateGte"
        autocomplete="off"
        class="layui-input"
      />
      <span class="ml10 mr10">-</span>
      <input
        type="number"
        name="minRateLte"
        autocomplete="off"
        class="layui-input"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label w100" style="padding: 9px 5px 9px 5px"
      >listing最大成本</label
    >
    <div class="layui-input-block disflex" style="align-items: center">
      <input
        type="number"
        name="maxCostGteCny"
        autocomplete="off"
        class="layui-input"
      />
      <span class="ml10 mr10">-</span>
      <input
        type="number"
        name="maxCostLteCny"
        autocomplete="off"
        class="layui-input"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label w100" style="padding: 9px 5px 9px 5px"
      >listing最大重量</label
    >
    <div class="layui-input-block disflex" style="align-items: center">
      <input
        type="number"
        name="maxWeightGte"
        autocomplete="off"
        class="layui-input"
      />
      <span class="ml10 mr10">-</span>
      <input
        type="number"
        name="maxWeightLte"
        autocomplete="off"
        class="layui-input"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">自动添加商品</label>
    <div class="layui-input-block">
      <select name="enableAutoAddItem">
        <option value="">请选择</option>
        <option value="true">已开启</option>
        <option value="false">已关闭</option>
      </select>
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">优惠方式</label>
    <div class="layui-input-block">
      <select
        name="ruleTypeList"
        id="shopee_marketCenter_ruleTypeList"
        xm-select="shopee_marketCenter_ruleTypeList"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal"
      >
        <option value="1">套装特价</option>
        <option value="2">折扣百分比</option>
        <option value="3">折扣金额</option>
      </select>
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">优惠层级</label>
    <div class="layui-input-block">
      <select
        name="tierTypeList"
        id="shopee_marketCenter_tierTypeList"
        xm-select="shopee_marketCenter_tierTypeList"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal"
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </div>
  </div>
  {{# }else if(d.discountType == '4' ){ }}
  <div class="layui-col-lg2 layui-col-md2">
    <div class="layui-form-label">主SKU</div>
    <div class="layui-input-block">
      <input
        type="text"
        class="layui-input"
        name=""
        placeholder="逗号分隔查询"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <div class="layui-form-label">父SKU</div>
    <div class="layui-input-block">
      <input
        type="text"
        class="layui-input"
        name=""
        placeholder="逗号分隔查询"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">加购id</label>
    <div class="layui-input-block">
      <input
        type="text"
        name="addOnIds"
        placeholder="支持输入多个,英文逗号分隔"
        autocomplete="off"
        class="layui-input"
        onblur="shopeeMarketCenter_handleids(this.value,event)"
      />
    </div>
  </div>
  {{# }else if(d.discountType == '5'){ }}
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">关注有礼id</label>
    <div class="layui-input-block">
      <input
        type="text"
        name="campaignIds"
        placeholder="支持输入多个,英文逗号分隔"
        autocomplete="off"
        class="layui-input"
        onblur="shopeeMarketCenter_handleids(this.value,event)"
      />
    </div>
  </div>
  <div class="layui-col-lg2 layui-col-md2">
    <label class="layui-form-label">优惠方式</label>
    <div class="layui-input-block">
      <select
        name="rewardTypeList"
        id="shopee_marketCenter_rewardTypeList"
        xm-select="shopee_marketCenter_rewardTypeList"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal"
      >
        <option value="1">折扣金额</option>
        <option value="2">优惠百分比</option>
        <option value="3">金币返还</option>
      </select>
    </div>
  </div>
  {{# } }}
</script>

<!-- 优惠类型联动 右侧操作按钮 -->
<script type="text/html" id="shopee_marketCenter_right_operation">
  <div class="layui-input-inline ml5"></div>
  <div class="layui-input-inline ml5">
    <button
      type="button"
      class="layui-btn layui-btn-sm layui-btn-normal"
      data-type="{{d.discountType}}"
      id="shopee_marketCenter_exportList"
    >
      导出
    </button>
  </div>
  <div class="layui-input-inline ml5">
    <button
      type="button"
      class="layui-btn layui-btn-sm layui-btn-normal"
      data-type="{{d.discountType}}"
      id="shopee_marketCenter_importVoucherOperateLog"
    >
      操作日志
    </button>
  </div>
  <!-- 导入 -->
  <div class="layui-input-inline ml5">
    <button
      type="button"
      class="layui-btn layui-btn-sm layui-btn-normal"
      data-type="{{d.discountType}}"
      id="shopee_marketCenter_upload"
    >
      {{d.exportName}}
    </button>
  </div>
  <div class="layui-input-inline ml5">
    <button
      type="button"
      class="layui-btn layui-btn-sm layui-btn-normal"
      id="shopee_marketCenter_download_type"
      data-type="{{d.discountType}}"
    >
      下载模板
    </button>
  </div>
  <div class="layui-form w150 ml5">
    <select
      name=""
      lay-filter="shopee_marketCenter_batchOperation"
      data-type="{{d.discountType}}"
    >
      <option value="">批量操作</option>
      <option value="syncStore">店铺同步</option>
      <!-- 终止 -->
      <option value="batchEnd">{{d.batchEndName}}</option>
      <!-- 同步 -->
      <option value="sync">{{d.syncName}}</option>
      <!-- 重建捆绑销售 -->
      {{# if(d.discountType == '3'){}}
      <option value="resetBuild">重建捆绑销售</option>
      <permTag:perm funcCode="shopee_marketCenter_batchAutoAdd">
        <option value="onAdd">开启自动添加商品</option>
      </permTag:perm>
      <permTag:perm funcCode="shopee_marketCenter_batchAutoAdd">
        <option value="offAdd">关闭自动添加商品</option>
      </permTag:perm>
      {{# }}}
    </select>
  </div>
  <!-- 新增 -->
  <div class="layui-input-inline ml5">
    <button
      class="layui-btn layui-btn-normal layui-btn-sm"
      type="button"
      id="shopeeMarketCenter_newActivty"
      data-type="{{d.discountType}}"
    >
      {{d.AddNewActivityName}}
    </button>
  </div>
</script>

<!-- 下载选择类型 -->
<script type="text/html" id="shopee_marketCenter_download_modal">
  <div class="layui-card">
    <div class="layui-card-body">
      <form class="layui-form" id="shopee_marketCenter_download">
        <div class="layui-form-item">
          {{# if(d=='2'){ }}
          <div style="font-size: 14px;color: #333;">选择优惠券类型</div>
          <div class="disflex mt10">
            <input
              type="radio"
              name="voucherType"
              value="1"
              title="店铺优惠券"
            />
            <input
              type="radio"
              name="voucherType"
              value="2"
              title="商品优惠券"
            />
          </div>
          <div class="mt30" style="font-size: 14px;color: #333;">选择优惠方式</div>
          <div class="shopee-marketCenter-radio-layout mt10" style="height: 30px;">
            <input
              type="radio"
              name="downloadType"
              value="1"
              title="折扣金额"
            />

            <input
              type="radio"
              name="downloadType"
              value="2"
              title="优惠百分比"
            />
            <input
              type="radio"
              name="downloadType"
              value="3"
              title="金币返还"
            />
          </div>
          {{# }else if(d=='5'){ }}
          <div class="shopee-marketCenter-radio-layout">
            <input
              type="radio"
              name="downloadType"
              value="1"
              title="折扣金额"
            />
            <input
              type="radio"
              name="downloadType"
              value="2"
              title="优惠百分比"
            />
            <input
              type="radio"
              name="downloadType"
              value="3"
              title="金币返还"
            />
          </div>
          {{# }else if(d=='3'){ }}
          <div class="shopee-marketCenter-radio-layout">
            <input
              type="radio"
              name="downloadType"
              value="1"
              title="套装特价"
            />
            <input
              type="radio"
              name="downloadType"
              value="2"
              title="折扣百分比"
            />
            <input
              type="radio"
              name="downloadType"
              value="3"
              title="折扣金额"
            />
          </div>
          {{# }else if(d=='4'){ }}
          <div class="shopee-marketCenter-radio-layout">
            <input type="radio" name="downloadType" value="折扣" title="折扣" />
            <input type="radio" name="downloadType" value="赠品" title="赠品" />
          </div>
          {{# } }}
          <div class="shopee-marketCenter-btn-center">
            <button
              class="layui-btn layui-btn-normal"
              type="button"
              id="shopee_marketCenter_download_tpl"
            >
              下载模板
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<!--新增弹框-->
<script type="text/html" id="shopee_marketCenter_newActivty">
  <div class="layui-fluid">
      <div class="layui-row">
          <div class="layui-col-lg12 layui-col-md12">
              <form action="" class="layui-form" id="shopee_marketCenter_newActivty_form">
                <input type="text" class="hidden" name="type" value="{{d.type}}" id="shopee_marketCenter_newActivty_type">
               {{# if(d.type==2){ }}
                  <div class="layui-form-item">
                    <label class="layui-form-label"><font class="fRed">*</font>优惠券类型</label>
                    <div class="layui-input-block w_50 shopee_marketCenter_voucherType">
                      {{# layui.each(d.voucherTypeList,function(_,item){ }}
                        <input type="radio" name="voucherType" value="{{item.code}}" title="{{item.type}}" lay-filter="shopee_marketCenter_choose_voucherType" {{d.voucherType != undefined && d.voucherType==item.code&&'checked'}} {{!d.isAdd && 'disabled'}}/>
                        {{#   }) }}
                    </div>
                  </div>
                  {{# } }}
                <div class="disflex">
                  <!-- 左侧 -->
                  {{#   if(d.type==2){}}
                    <div id="shopee_marketCenter_newActivty_form_left">
                      <div class="layui-form-item">
                        <label class="layui-form-label"><font class="fRed">*</font>item_id:</label>
                        <div class="layui-input-block w_50">
                          <textarea name="itemIdList" placeholder="英文逗号分割" class="layui-textarea"  value="{{d.itemIdList}}"></textarea>
                        </div>
                      </div>
                      <!-- <div class="layui-form-item">
                        <label class="layui-form-label">CNSC类目:</label>
                        <div class="layui-input-block w_50">
                          <input id="shopee_marketCenter_newActivty_cnscCate" />
                        </div>
                      </div> -->
                    </div>
                    {{#  } }}
                  <!-- 右侧 -->
                  <div>
                    {{# if(!d.isReset){ }}
                    <div class="layui-form-item">
                        <label class="layui-form-label"><font class="fRed">*</font>店铺名称</label>
                        <div class="layui-input-block w_50">
                            <select name="storeAcctId" lay-search id="shopee_marketCenter_newActivty_storeAcct" lay-filter="shopee_marketCenter_active_store" {{d.isAdd ? '':'disabled'}} lay-verify="storeAcct">
                                {{# if(!d.isAdd){ }}
                                    <option value="{{d.storeAcctId}}">{{d.storeAcct}}</option>
                                {{#  } }}
                            </select>
                        </div>
                    </div>
                 {{# } }}
                  <div class="layui-form-item">
                      <label class="layui-form-label"><font class="fRed">*</font>开始时间</label>
                      <div class="layui-input-block w_50">
                          <input type="text" name="startTime" placeholder="开始时间"
                              class="layui-input {{(!d.isAdd && d.currentTab == 'ongoing' && d.type == 5) || (!d.isAdd && d.type == 3 ) || (!d.isAdd && d.currentTab == 'ongoing' && d.type == 2 ) ? 'layui-disabled': ''}}"
                              {{(!d.isAdd && d.currentTab == 'ongoing' && d.type == 5) || (!d.isAdd && d.type == 3 )|| (!d.isAdd && d.currentTab == 'ongoing' && d.type == 2 )  ? 'readonly' : ''}}
                              id="shopee_marketCenter_newActivty_startTime"
                          >
                      </div>
                  </div>
                  <div class="layui-form-item">
                      <label class="layui-form-label"><font class="fRed">*</font>结束时间</label>
                      <div class="layui-input-block w_50">
                          <input type="text" name="endTime" placeholder="结束时间"
                              class="layui-input {{!d.isAdd && d.type == 3 ? 'layui-disabled' : ''}}"
                              {{!d.isAdd && d.type == 3 ? 'readonly' : ''}}
                              id="shopee_marketCenter_newActivty_endTime"
                          >
                      </div>
                  </div>
                  {{# if(d.type==2){ }}
                      <div class="layui-form-item">
                          <label class="layui-form-label"><font class="fRed">*</font>优惠名称</label>
                          <div class="layui-input-block w_50">
                              <input type="text" name="voucherName" placeholder="优惠名称" value="{{d.voucherName || ''}}" class="layui-input" >
                          </div>
                      </div>
                      <!-- <div class="layui-form-item">
                          <label class="layui-form-label"><font class="fRed">*</font>折扣码</label>
                          <div class="layui-input-block w_50">
                              <input type="text" name="voucherCode" placeholder="长度为5,数字+字母"
                                  {{!d.isAdd ? 'readonly' :'' }} value="{{d.voucherCode  || ''}}"
                                  class="layui-input {{!d.isAdd ? 'layui-disabled': ''}}"
                              >
                          </div>
                      </div> -->
                      {{# if(d.isAdd){ }}
                          <div class="layui-form-item">
                              <label class="layui-form-label"><font class="fRed">*</font>活动类型</label>
                              <div class="layui-input-block w_50 shopee_marketCenter_autoRenenw">
                                  <input type="radio" name="autoRenew" title="单次活动"  value=false {{d.autoRenew != undefined && d.autoRenew==false&&'checked'}}>
                                  <input type="radio" name="autoRenew" title="连续活动"  value=true  {{d.autoRenew != undefined && d.autoRenew==true&&'checked'}}>
                              </div>
                          </div>
                      {{# } }}
                  {{# }else if(d.type==3){ }}
                      <div class="layui-form-item">
                          <label class="layui-form-label"><font class="fRed">*</font>活动名称</label>
                          <div class="layui-input-block w_50">
                              <input type="text" name="bundleDealName" placeholder="活动名称" value="{{d.bundleDealName  || ''}}" class="layui-input">
                          </div>
                      </div>
                      {{# if(d.isAdd){ }}
                      <div class="layui-form-item">
                        <label class="layui-form-label"><font class="fRed">*</font>活动类型</label>
                        <div class="layui-input-block w_50 shopee_marketCenter_autoRenenw">
                          <input type="radio" name="autoRenew" title="单次活动"  value=false {{d.autoRenew != undefined && d.autoRenew==false&&'checked'}}>
                          <input type="radio" name="autoRenew" title="连续活动"  value=true  {{d.autoRenew != undefined && d.autoRenew==true&&'checked'}}>
                        </div>
                      </div>
                      {{# } }}
                  {{# }else if(d.type==4){ }}
                      <div class="layui-form-item">
                          <label class="layui-form-label"><font class="fRed">*</font>活动名称</label>
                          <div class="layui-input-block w_50">
                              <input type="text" name="addOnDealName" placeholder="活动名称" value="{{d.addOnDealName || ''}}" class="layui-input">
                          </div>
                      </div>
                  {{# }else if(d.type==5){ }}
                      <div class="layui-form-item">
                          <label class="layui-form-label"><font class="fRed">*</font>活动名称</label>
                          <div class="layui-input-block w_50">
                              <input type="text" name="followPrizeName" placeholder="活动名称" value="{{d.followPrizeName || ''}}"
                                  {{!d.isAdd && d.currentTab == 'ongoing' && d.type == 5 ? 'readonly' : ''}}
                                  class="layui-input {{!d.isAdd && d.currentTab == 'ongoing' && d.type == 5 ? 'layui-disabled': ''}}"
                               >
                          </div>
                      </div>
                  {{# if(d.isAdd){ }}
                          <div class="layui-form-item">
                              <label class="layui-form-label"><font class="fRed">*</font>活动类型</label>
                              <div class="layui-input-block w_50 shopee_marketCenter_autoRenenw">
                                  <input type="radio" name="autoRenew" title="单次活动"  value=false {{d.autoRenew != undefined && d.autoRenew==false&&'checked'}}>
                                  <input type="radio" name="autoRenew" title="连续活动"  value=true  {{d.autoRenew != undefined && d.autoRenew==true&&'checked'}}>
                              </div>
                          </div>
                      {{# } }}
                  {{# } }}
                  <!--优惠券 展示类型 -->
                  {{# if(d.type == 2){ }}
                  <div class="layui-form-item">
                    <label class="layui-form-label"><font class="fRed">*</font>展示类型</label>
                    <div class="layui-input-block w_50">
                      <select name="displayChannel" id="shopee_marketCenter_displayChannel" lay-filter="shopee_marketCenter_displayChannel" {{d.isAdd ? '':'disabled'}}>
                      </select>
                    </div>
                  </div>
                    {{#  } }}
                  <div class="layui-card">
                      <div class="layui-card-header">
                        <span>选择优惠类型</span>
                        {{# if(d.type==3){  }}
                        <span class="ml20">！优惠力度保证层级3>层级2>层级1</span>
                        {{# }  }}
                      </div>
                      <div class="layui-card-body">
                          {{# if(d.type==2 || d.type==5){ }}
                              <div class="layui-form-item">
                                  <div class="layui-input-block shopee_marketCenter_radioType">
                                      <input type="radio" name="rewardType"  {{!d.isAdd ? 'disabled' :'' }} value="1" {{d.rewardType=='1'&&'checked'}} title="折扣金额" lay-filter="shopee_marketCenter_newActivty_discountType">
                                      <input type="radio" name="rewardType"  {{!d.isAdd ? 'disabled' :'' }} value="2" {{d.rewardType=='2'&&'checked'}} title="优惠百分比" lay-filter="shopee_marketCenter_newActivty_discountType">
                                      <input type="radio" name="rewardType"  {{!d.isAdd ? 'disabled' :'' }} value="3" {{d.rewardType=='3'&&'checked'}} title="金币返还" lay-filter="shopee_marketCenter_newActivty_discountType">
                                  </div>
                              </div>
                              <div class="layui-form-item">
                                  <label class="layui-form-label">
                                      <font class="fRed">*</font>{{d.type==2?'优惠券数量':'数量'}}
                                  </label>
                                  <div class="layui-input-block w_50">
                                      <input type="number" min="0" name="usageQuantity" value="{{d.usageQuantity}}"
                                          onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                                          class="layui-input">
                                  </div>
                              </div>
                              <div class="layui-form-item">
                                  <label class="layui-form-label">
                                      <font class="fRed">*</font>最低消费金额
                                  </label>
                                  {{#if(d.type == 2){ }}
                                      <div class="layui-input-block w_50">
                                          <input type="number" min="0" name="minBasketPrice"  value="{{d.minBasketPrice}}"
                                          onkeyup="comMoneyVertify(this, event)"
                                              placeholder="最低消费金额" class="layui-input">
                                      </div>
                                  {{#}else{ }}
                                      <div class="layui-input-block w_50">
                                          <input type="number" min="0" name="minSpend" value="{{d.minSpend}}"
                                          onkeyup="comMoneyVertify(this, event)"
                                              placeholder="最低消费金额"
                                              class="layui-input {{!d.isAdd && d.currentTab == 'ongoing' && d.type == 5 ? 'layui-disabled': ''}}"
                                              {{!d.isAdd && d.currentTab == 'ongoing' && d.type == 5 ? 'readonly' : ''}}
                                          >
                                      </div>
                                  {{#} }}
                              </div>
                              <div id="shopee_marketCenter_linkage_rewardType_rest"></div>
                          {{# }else if(d.type==3){  }}
                              <div class="layui-form-item">
                                  <div class="layui-input-block shopee_marketCenter_radioType">
                                      <input type="radio" name="ruleType" value="1" title="套装特价" {{!d.isAdd ? 'disabled' :'' }} {{d.ruleType=='1'&&'checked'}} lay-filter="shopee_marketCenter_newActivty_discountType">
                                      <input type="radio" name="ruleType" value="2" title="折扣百分比" {{!d.isAdd ? 'disabled' :'' }} {{d.ruleType=='2'&&'checked'}} lay-filter="shopee_marketCenter_newActivty_discountType">
                                      <input type="radio" name="ruleType" value="3" title="折扣金额" {{!d.isAdd ? 'disabled' :'' }} {{d.ruleType=='3'&&'checked'}} lay-filter="shopee_marketCenter_newActivty_discountType">
                                  </div>
                              </div>
                              <!-- <div class="layui-form-item">
                                  <label class="layui-form-label">
                                      <font class="fRed">*</font>起购
                                  </label>
                                  <div class="layui-input-block w_50">
                                      <input type="number" name="minAmount" value="{{d.minAmount}}" min="0"
                                          onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                                          class="layui-input {{!d.isAdd ? 'layui-disabled':''}}"
                                          {{!d.isAdd ? 'readonly':''}}
                                      >
                                  </div>
                              </div> -->
                              <div id="shopee_marketCenter_linkage_ruleType_rest"></div>
                              <div class="layui-form-item">
                                  <label class="layui-form-label">
                                      <font class="fRed">*</font>限购
                                  </label>
                                  <div class="layui-input-block w_50">
                                      <input type="number" min="0" name="purchaseLimit" value="{{d.purchaseLimit}}"
                                      onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
                                      class="layui-input">
                                  </div>
                              </div>
                              {{# if(!d.isAdd){ }}
                              <div class="layui-form-item">
                                  <div class="layui-input-block w_50">
                                      <input type="radio" name="isAddItem" lay-filter="shopee_marketCenter_isAddItem" value="true" title="修改商品"/>
                                  </div>
                              </div>
                                  {{# } }}
                               {{# if(!d.isReset){ }}
                                <div class="layui-form-item">
                                    <label class="layui-form-label">
                                        商品id
                                    </label>
                                    <div class="layui-input-block w_50">
                                        <textarea class="layui-textarea {{!d.isAdd ? 'layui-disabled' :'' }}" name="newItemIds" value="{{d.oldItemIds}}"
                                            placeholder="用逗号分隔" onblur="shopeeMarketCenter_handleids(this.value,event)"
                                            {{d.isAdd ? '' :'readonly' }}
                                        ></textarea>
                                    </div>
                                </div>
                                {{# } }}
                                <div class="layui-form-item">
                                  <label class="layui-form-label" style="width: 90px;padding:9px 5px">listing最小利润</label>
                                  <div class="layui-input-block disflex" style="align-items: center">
                                    <div class="w_50 disflex" style="align-items: center">
                                      <input type="number" class="layui-input" name="minProfitGte" value="{{d.minProfitGte===undefined ? '' : d.minProfitGte}}" onblur="commonBlurFloatTwo(event)"/>
                                      <span class="ml10 mr10">-</span>
                                      <input type="number" class="layui-input" name="minProfitLte" value="{{d.minProfitLte===undefined ? '' : d.minProfitLte}}" onblur="commonBlurFloatTwo(event)"/>
                                      </div>
                                    <div class="ml10 localcurrency"></div>
                                  </div>
                                </div>
                                  <div class="layui-form-item">
                                    <label class="layui-form-label" style="width: 90px;padding:9px 5px">listing最小利率</label>
                                    <div class="layui-input-block disflex" style="align-items: center">
                                      <div class="w_50 disflex" style="align-items: center">
                                        <input type="number" class="layui-input" name="minRateGte" value="{{d.minRateGte===undefined ? '' : d.minRateGte}}" onblur="commonBlurFloatTwo(event)"/>
                                        <span class="ml10 mr10">-</span>
                                        <input type="number" class="layui-input" name="minRateLte" value="{{d.minRateLte===undefined ? '' : d.minRateLte}}" onblur="commonBlurFloatTwo(event)"/>
                                        </div>
                                      <div class="ml10">%</div>
                                    </div>
                                  </div>
                                    <div class="layui-form-item">
                                      <label class="layui-form-label" style="width: 90px;padding:9px 5px">listing最大成本</label>
                                      <div class="layui-input-block disflex" style="align-items: center">
                                        <div class="w_50 disflex" style="align-items: center">
                                          <input type="number" class="layui-input" name="maxCostGteCny" value="{{d.maxCostGteCny===undefined ? '' : d.maxCostGteCny}}" onblur="commonBlurPositiveFloat(event)">
                                          <span class="ml10 mr10">-</span>
                                          <input type="number" class="layui-input" name="maxCostLteCny" value="{{d.maxCostLteCny===undefined ? '' : d.maxCostLteCny}}" onblur="commonBlurPositiveFloat(event)">
                                          </div>
                                        <div class="ml10">CNY</div>
                                      </div>
                                    </div>
                                <div class="layui-form-item">
                                  <label class="layui-form-label" style="width: 90px;padding:9px 5px">listing最大重量</label>
                                  <div class="layui-input-block disflex" style="align-items: center">
                                    <div class="w_50 disflex" style="align-items: center">
                                      <input type="number" class="layui-input" name="maxWeightGte" value="{{d.maxWeightGte===undefined ? '' : d.maxWeightGte}}" onkeypress="commonKeyPressInputNotNega(event)">
                                      <span class="ml10 mr10">-</span>
                                      <input type="number" class="layui-input" name="maxWeightLte" value="{{d.maxWeightLte===undefined ? '' : d.maxWeightLte}}"  onkeypress="commonKeyPressInputNotNega(event)">
                                      </div>
                                    <div class="ml10">(单位：g)</div>
                                  </div>
                                </div>
                                <div class="layui-form-item">
                                  <label class="layui-form-label">
                                      选择分类
                                  </label>
                                  <div class="layui-input-block w_50">
                                    <input type="radio" name="isAllCate" value="true" title="全部分类" lay-filter="shopee_marketCenter_cateId"
                                      {{(!d.cateIds || (d.cateIds && d.cateIds.length == 0 )) && 'checked' }}>
                                    <input type="radio" name="isAllCate" value="false" title="指定分类" lay-filter="shopee_marketCenter_cateId"
                                      {{d.cateIds && (d.cateIds.length !=0 ) && 'checked' }}>
                                    <div class="layui-input-block" id="shopee_marketCenter_CateTree_div">
                                      <input id="shopee_marketCenter_CateTree">
                                  </div>
                              </div>
                          {{# }else if(d.type==4){ }}
                              <div class="layui-form-item">
                                  <div class="layui-input-block shopee_marketCenter_radioType">
                                      <input type="radio" name="promotionType" value="0" title="折扣" {{d.promotionType=='1'&&'checked'}} lay-filter="shopee_marketCenter_newActivty_discountType">
                                      <input type="radio" name="promotionType" value="1" title="赠品" {{d.promotionType=='2'&&'checked'}} lay-filter="shopee_marketCenter_newActivty_discountType">
                                  </div>
                              </div>
                              <div id="shopee_marketCenter_linkage_promotionType_rest"></div>
                              <div class="layui-form-item">
                                  <label class="layui-form-label">添加主商品</label>
                                  <div class="layui-input-block w_50">
                                      <input type="text" name="psku" value="{{d.psku || ''}}" class="layui-input">
                                  </div>
                              </div>
                              <div class="layui-form-item">
                                  <label class="layui-form-label">添加副商品</label>
                                  <div class="layui-input-block w_50">
                                      <input type="text" name="ssku" value="{{d.ssku || ''}}" class="layui-input">
                                  </div>
                              </div>
                          {{#  }  }}
                                </div>
                        </div>
                  </div>
                  </div>
                </div>
              </form>
          </div>
      </div>
  </div>
</script>

<!-- 优惠券 -->
<!-- 关注有礼 -->
<script type="text/html" id="shopee_marketCenter_rewardType_rest">
  {{# if(d.chooseType=='1'){ }}
  <div class="layui-form-item">
    <label class="layui-form-label"><font class="fRed">*</font>优惠金额</label>
    <div class="layui-input-block w_50">
      <input type="number" min="0" name="discountAmount"
      value="{{d.discountAmount || ''}}" placeholder="优惠金额" {{!d.isAdd &&
      (d.currentTab == 'upcoming' || d.currentTab == 'ongoing') && d.type == 5 ?
      'readonly' : ''}} onkeyup="comMoneyVertify(this, event)"
      class="layui-input {{!d.isAdd && ((d.currentTab == 'upcoming' ||
      d.currentTab == 'ongoing') || d.currentTab == 'ongoing') && d.type == 5 ?
      'layui-disabled' : ''}}" >
    </div>
  </div>
  {{# }else if(d.chooseType=='2'||d.chooseType=='3'){ }}
  <div class="layui-form-item">
    <label class="layui-form-label"
      ><font class="fRed">*</font
      >{{d.chooseType==2?'优惠百分比':'返回百分比'}}</label
    >
    <div class="layui-input-block w_50">
      <input type="number" min="0" name="percentage" value="{{d.percentage}}"
      placeholder="例如：20%,输入20" {{!d.isAdd && d.currentTab =='upcoming' &&
      d.type == 5 ? 'readonly' : ''}}
      onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
      class="layui-input {{!d.isAdd && (d.currentTab == 'upcoming' ||
      d.currentTab == 'ongoing') && d.type == 5 ? 'layui-disabled' : ''}}" >
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">最高优惠金额</label>
    <div class="layui-input-block w_50">
      <input type="number" min="0" name="maxPrice" value="{{d.maxPrice}}"
      placeholder="不填规则不设限" {{!d.isAdd && (d.currentTab == 'upcoming' ||
      d.currentTab == 'ongoing') && d.type == 5 ? 'readonly' : ''}}
      onkeyup="comMoneyVertify(this, event)" class="layui-input {{!d.isAdd &&
      (d.currentTab == 'upcoming' || d.currentTab == 'ongoing') && d.type == 5 ?
      'layui-disabled' : ''}}" >
    </div>
  </div>
  {{# } }}
</script>

<!-- 捆绑销售 -->
<script type="text/html" id="shopee_marketCenter_ruleType_rest">
  <div class="layui-form-item">
    <label class="layui-form-label"> <font class="fRed">*</font>层级1 </label>
    <div class="layui-input-block disflex" style="align-items: center;">
      <span class="mr10 shopee_marketCenter_none">购买</span>
      <input type="number" name="minAmount" value="{{d.minAmount}}" min="0"
      onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
      class="layui-input w100 {{!d.isAdd ? 'layui-disabled':''}}" {{!d.isAdd ?
      'readonly':''}} >
      <span class="ml10 mr10 shopee_marketCenter_none"
        >{{d.chooseType == 1 ? '个商品共' : '个商品优惠'}}</span
      >
      {{# if(d.chooseType=='1'){}} <input type="number" min="0" name="fixPrice"
      value="{{d.fixPrice }}" class="layui-input w100 {{d.isAdd
      ?'':'layui-disabled'}}" {{d.isAdd ? '':'readonly'}}
      onkeyup="comMoneyVertify(this, event)" > {{# }else if(d.chooseType ==
      '2'){}} <input type="number" name="discountPercentage"
      value="{{d.discountPercentage}}" class="layui-input w100 {{d.isAdd
      ?'':'layui-disabled'}}" min="0" {{d.isAdd ? '':'readonly'}}
      onkeyup="commonKeyPressInputFloat(event)" > {{# }else{}} <input
      type="number" min="0" name="discountValue" value="{{d.discountValue}}"
      class="layui-input w100 {{!!d.isAdd ?'':'layui-disabled'}}" {{d.isAdd ?
      '':'readonly'}} onkeyup="comMoneyVertify(this, event)" > {{# } }}
      <span class="ml10 shopee_marketCenter_none"
        >{{d.chooseType == 2 ? '%' : d.localCurrency||''}}</span
      >
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">层级2</label>
    <div class="layui-input-block disflex" style="align-items: center;">
      <span class="mr10 shopee_marketCenter_none">购买</span>
      <input type="number" name="minAmountTierTwo"
      value="{{d.minAmountTierTwo}}" min="0"
      onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
      class="layui-input w100 {{!d.isAdd ? 'layui-disabled':''}}" {{!d.isAdd ?
      'readonly':''}} >
      <span class="ml10 mr10 shopee_marketCenter_none"
        >{{d.chooseType == 1 ? '个商品共' : '个商品优惠'}}</span
      >
      {{# if(d.chooseType=='1'){}} <input type="number" min="0"
      name="fixPriceTierTwo" value="{{d.fixPriceTierTwo }}" class="layui-input
      w100 {{d.isAdd ?'':'layui-disabled'}}" {{d.isAdd ? '':'readonly'}}
      onkeyup="comMoneyVertify(this, event)" > {{# }else if(d.chooseType ==
      '2'){}} <input type="number" name="discountPercentageTierTwo"
      value="{{d.discountPercentageTierTwo}}" class="layui-input w100 {{d.isAdd
      ?'':'layui-disabled'}}" min="0" {{d.isAdd ? '':'readonly'}}
      onkeyup="commonKeyPressInputFloat(event)" > {{# }else{}} <input
      type="number" min="0" name="discountValueTierTwo"
      value="{{d.discountValueTierTwo}}" class="layui-input w100 {{!!d.isAdd
      ?'':'layui-disabled'}}" {{d.isAdd ? '':'readonly'}}
      onkeyup="comMoneyVertify(this, event)" > {{# } }}
      <span class="ml10 shopee_marketCenter_none"
        >{{d.chooseType == 2 ? '%' : d.localCurrency||''}}</span
      >
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">层级3</label>
    <div class="layui-input-block disflex" style="align-items: center;">
      <span class="mr10 shopee_marketCenter_none">购买</span>
      <input type="number" name="minAmountTierThree"
      value="{{d.minAmountTierThree}}" min="0"
      onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
      class="layui-input w100 {{!d.isAdd ? 'layui-disabled':''}}" {{!d.isAdd ?
      'readonly':''}} >
      <span class="ml10 mr10 shopee_marketCenter_none"
        >{{d.chooseType == 1 ? '个商品共' : '个商品优惠'}}</span
      >
      {{# if(d.chooseType=='1'){}} <input type="number" min="0"
      name="fixPriceTierThree" value="{{d.fixPriceTierThree }}"
      class="layui-input w100 {{d.isAdd ?'':'layui-disabled'}}" {{d.isAdd ?
      '':'readonly'}} onkeyup="comMoneyVertify(this, event)" > {{# }else
      if(d.chooseType == '2'){}} <input type="number"
      name="discountPercentageTierThree"
      value="{{d.discountPercentageTierThree}}" class="layui-input w100
      {{d.isAdd ?'':'layui-disabled'}}" min="0" {{d.isAdd ? '':'readonly'}}
      onkeyup="commonKeyPressInputFloat(event)"> {{# }else{}} <input
      type="number" min="0" name="discountValueTierThree"
      value="{{d.discountValueTierThree}}" class="layui-input w100 {{!!d.isAdd
      ?'':'layui-disabled'}}" {{d.isAdd ? '':'readonly'}}
      onkeyup="comMoneyVertify(this, event)" > {{# } }}
      <span class="ml10 shopee_marketCenter_none"
        >{{d.chooseType == 2 ? '%' : d.localCurrency||''}}</span
      >
    </div>
  </div>
</script>

<!-- 加购 -->
<script type="text/html" id="shopee_marketCenter_promotionType_rest">
  {{# if(d.chooseType=='0'){ }}
  <div class="layui-form-item">
    <label class="layui-form-label">起购</label>
    <div class="layui-input-block w_50">
      <input
        type="text"
        name="purchaseMin"
        value="{{d.purchaseMin || ''}}"
        onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
        class="layui-input"
      />
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">折扣百分比</label>
    <div class="layui-input-block w_50">
      <input
        type="text"
        name="percentage"
        value="{{d.percentage || ''}}"
        class="layui-input"
      />
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">限购</label>
    <div class="layui-input-block w_50">
      <input
        type="text"
        name="promotionpurchaseLimit"
        value="{{d.promotionpurchaseLimit || ''}}"
        onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
        class="layui-input"
      />
    </div>
  </div>
  {{# }else if(d.chooseType=='1'){ }}
  <div class="layui-form-item">
    <label class="layui-form-label">订单满</label>
    <div class="layui-input-block w_50">
      <input
        type="text"
        name="purchaseMinSpend"
        value="{{d.purchaseMinSpend || ''}}"
        class="layui-input"
      />
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">赠品数量</label>
    <div class="layui-input-block w_50">
      <input
        type="number"
        name="perGiftNum"
        value="{{d.perGiftNum || ''}}"
        onkeyup="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')"
        class="layui-input"
      />
    </div>
  </div>
  {{# } }}
</script>

<!-- 操作栏 -->
<script type="text/html" id="shopee_marketCenter_toolbar">
  <div>
    <button
      class="layui-btn layui-btn-xs layui-btn-normal"
      lay-event="duplicate"
    >
      复制
    </button>
  </div>
  {{# if((!!d.voucherStatus && d.voucherStatus != 'expired') ||
  (!!d.followPrizeStatus && d.followPrizeStatus != 'expired')|| (!!d.timeStatus
  && d.timeStatus != '4')){ }}
  <div>
    <button class="layui-btn layui-btn-xs" lay-event="edit">修改</button>
  </div>
  {{# } }} {{# if(d.timeStatus == '2'){ }}
  <div>
    <button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="delete">
      删除
    </button>
  </div>
  {{# } }} {{# if(d.voucherStatus == 'ongoing' || d.followPrizeStatus ==
  'ongoing' || d.timeStatus == '3'){ }}
  <div>
    <button class="layui-btn layui-btn-xs" lay-event="end">终止</button>
  </div>
  {{# } }}
</script>

<!-- 连续活动 -->
<script type="text/html" id="shopee_marketCenter_autoRenenw_row">
  <div class="layui-form-item">
    <input type="checkbox" lay-skin="switch"
    lay-filter="shopee_marketCenter_changeStatus" data-id="{{d.id}}"
    lay-text="连续|单次" value="{{d.autoRenew}}" {{d.autoRenew?'checked':''}}>
  </div>
</script>

<!--bundleDeal 自动添加商品 -->
<script type="text/html" id="shopee_marketCenter_isAutoAdd">
  <div class="layui-form-item">
    <permTag:perm funcCode="shopee_marketCenter_batchAutoAdd">
      <input type="checkbox" lay-skin="switch"
      lay-filter="shopee_marketCenter_isAutoAdd" data-id="{{d.id}}"
      data-bundledealid="{{d.bundleDealId}}" value="{{d.enableAutoAddItem}}"
      {{d.enableAutoAddItem?'checked':''}}>
    </permTag:perm>
    <permTag:lacksPerm funcCode="shopee_marketCenter_batchAutoAdd">
      <input type="checkbox" lay-skin="switch"
      lay-filter="shopee_marketCenter_isAutoAdd" data-id="{{d.id}}" disabled
      data-bundledealid="{{d.bundleDealId}}" value="{{d.enableAutoAddItem}}"
      {{d.enableAutoAddItem?'checked':''}}>
    </permTag:lacksPerm>
  </div>
</script>

<!--优惠券 优惠情况 -->
<script type="text/html" id="shopee_marketCenter_vocherInfo">
  {{# if(d.rewardType == 1){ }}
  <span>{{d.minBasketPrice}}-{{d.discountAmount}}</span>
  {{# }else if(d.rewardType == 2){ }}
  {{# if(d.maxPrice == undefined || d.maxPrice==''){ }}
      <span>{{d.minBasketPrice}}-{{d.percentage}}%</span>
      {{#}else{ }}
      <span>{{d.minBasketPrice}}-{{d.percentage}}</span><span>%,$</span><span></span>{{d.maxPrice}}封顶</span>
      {{#} }}
  {{# }else if(d.rewardType == 3){ }}
  <span>{{d.minBasketPrice}}返{{d.percentage}}%</span>
  {{# } }}
</script>
<!--优惠券 关注有利 优惠类型 -->
<script type="text/html" id="shopee_marketCenter_voucherType_follow">
  {{# if(d.rewardType == 1){ }}
  <span>折扣金额</span>
  <br />
  {{# }else if(d.rewardType == 2){ }}
  <span>优惠百分比</span>
  <br />
  {{# }else if(d.rewardType == 3){ }}
  <span>金币返还</span>
  <br />
  {{# } }}
</script>

<!-- 捆绑销售的优惠类型 -->
<script type="text/html" id="shopee_marketCentre_bundleDealType">
  {{# if(d.ruleType == 1){ }}
  <span>套装特价</span>
  <br />
  {{# }else if(d.ruleType == 2){ }}
  <span>折扣百分比</span>
  <br />
  {{# }else if(d.ruleType == 3){ }}
  <span>折扣金额</span>
  <br />
  {{# } }} {{# if(d.ruleType == 1){ }}
  <span>{{d.minAmount}}件<span>$</span>{{d.fixPrice}},</span>
  {{# if(d.minAmountTierTwo!=undefined || d.fixPriceTierTwo!=undefined){ }}
  <span>{{d.minAmountTierTwo}}件<span>$</span>{{d.fixPriceTierTwo}},</span>
  {{# } }} {{# if(d.minAmountTierThree!=undefined ||
  d.fixPriceTierThree!=undefined){ }}
  <span>{{d.minAmountTierThree}}件<span>$</span>{{d.fixPriceTierThree}},</span>
  {{# } }}
  <div>限购{{d.purchaseLimit}}</div>
  {{# }else if(d.ruleType == 2){ }}
  <span>{{d.minAmount}}件{{d.discountPercentage}}%</span>
  {{# if(d.minAmountTierTwo!=undefined ||
  d.discountPercentageTierTwo!=undefined){ }}
  <span>{{d.minAmountTierTwo}}件{{d.discountPercentageTierTwo}}%</span>
  {{# } }} {{# if(d.minAmountTierThree!=undefined ||
  d.discountPercentageTierThree!=undefined){ }}
  <span>{{d.minAmountTierThree}}件{{d.discountPercentageTierThree}}%</span>
  {{# } }}
  <div>
    限购{{d.purchaseLimit}}
    <div>
      {{# }else if(d.ruleType == 3){ }}
      <span>{{d.minAmount}}件减<span>$</span>{{d.discountValue}},</span>
      {{# if(d.minAmountTierTwo!=undefined ||
      d.discountValueTierTwo!=undefined){ }}
      <span
        >{{d.minAmountTierTwo}}件减<span>$</span>{{d.discountValueTierTwo}},</span
      >
      {{# } }} {{# if(d.minAmountTierThree!=undefined ||
      d.discountValueTierThree!=undefined){ }}
      <span
        >{{d.minAmountTierThree}}件减<span>$</span>{{d.discountValueTierThree}},</span
      >
      {{# } }}
      <div>限购{{d.purchaseLimit}}</div>
      {{# } }}
    </div>
  </div>
</script>

<!--捆绑销售的优惠情况 -->
<script type="text/html" id="shopee_marketCentre_bundleDealInfo">
  {{# if(d.ruleType == 1){ }}
  <span>{{d.minAmount}}</span><span>件$</span
  ><span>{{d.fixPrice}},限购{{d.purchaseLimit}}</span>
  {{# }else if(d.ruleType == 2){ }}
  <span
    >{{d.minAmount}}件{{d.discountPercentage}}%,限购{{d.purchaseLimit}}</span
  >
  {{# }else if(d.ruleType == 3){ }}
  <span>{{d.minAmount}}</span><span>件减$</span
  ><span>{{d.discountValue}},限购{{d.purchaseLimit}}</span>
  {{# } }}
</script>

<!-- 捆绑销售的listing数量 -->
<script type="text/html" id="shopee_marketCentre_bundleDealCount">
  {{# if(!!d.itemRefList && Array.isArray(d.itemRefList)){ }}
  <div>{{d.itemRefList.length}}</div>
  {{# } }}
</script>

<!--关注有礼 优惠情况 -->
<script type="text/html" id="shopee_marketCenter_followInfo">
  {{# if(d.rewardType == 1){ }}
  <span>{{d.minSpend}}-{{d.discountAmount}}</span>

  {{# }else if(d.rewardType == 2){ }} {{# if(d.maxPrice == undefined ||
  d.maxPrice==''){ }}
  <span>{{d.minSpend}}-{{d.percentage}}%</span>
  {{#}else{ }}
  <span>{{d.minSpend}}-{{d.percentage}}</span><span>%,$</span
  ><span>{{d.maxPrice}}封顶</span>
  {{#} }} {{# }else if(d.rewardType == 3){ }}
  <span>{{d.minSpend}}返{{d.percentage}}%</span>
  {{# } }}
</script>

<!-- 同步结果 -->
<script type="text/html" id="shopee_marketCenter_sync_result">
  <div class="layui-card">
    <div class="layui-card-header disFCenter mr10">
      <div>总数(<span class="total"></span>)</div>
      <div class="disflex">
        <div class="fail">
          <button
            class="layui-btn layui-btn-sm"
            onclick="shopee_marketCenter_sync_copy(this,event)"
          >
            复制失败id
          </button>
          <!-- 失败数据id -->
          <span class="layui-hide"></span>
        </div>
        <div class="succ ml10">
          <button
            class="layui-btn layui-btn-sm"
            onclick="shopee_marketCenter_sync_copy(this,event)"
          >
            复制成功id
          </button>
          <!-- 成功数据id -->
          <span class="layui-hide"></span>
        </div>
      </div>
    </div>
    <div class="layui-card-body shopee_marketCenter_modal_scroll">
      <table
        class="layui-table"
        id="shopee_marketCenter_sync_result_table"
      ></table>
    </div>
  </div>
</script>

<!-- 同步结果info -->
<script type="text/html" id="shopee_marketCenter_sync_result_info">
  <div class="{{d.result == 1? 'fGreen' : 'fRed'}}">{{d.resultMsg}}</div>
</script>

<!-- 操作日志弹窗 -->
<script type="text/html" id="shopee_marketCenter_report_log">
  <div class="layui-card">
    <div class="layui-card-header disFCenter mr10">
      <div>总数(<span class="total"></span>)</div>
      <div class="disflex">
        <!-- 刷新按钮 -->
        <div
          class="w30 h30 disFCenter"
          id="shopee_marketCenter_report_log_refresh"
        >
          <i class="layui-icon layui-icon-refresh"></i>
        </div>
      </div>
    </div>
    <div class="layui-card-body shopee_marketCenter_modal_scroll">
      <table
        class="layui-table"
        id="shopee_marketCenter_report_log_table"
        lay-filter="shopee_marketCenter_report_log_table"
      ></table>
    </div>
    <div id="logPageId"></div>
  </div>
</script>
<!-- 操作日志弹窗 文件名称 -->
<script type="text/html" id="shopee_marketCenter_viewReport_filePath">
  {{# if(d.oldFileName != undefined){ }}
  <div style="padding: 10px;">
    <a class="ztt-a" lay-event="downloadDetail" href="javascript:void(0);"
      >{{d.oldFileName}}</a
    >
  </div>
  {{# } }}
</script>
<!-- 操作日志弹窗 -->
<script type="text/html" id="shopee_marketCenter_viewReport_result">
  <div>
    {{# if(d.failNumber != undefined){ }}
    <span class="fRed">{{d.failNumber}}</span>
    <span>个不成功,</span>
    {{# } }} {{# if(d.successNumber !=undefined){ }}
    <span class="ml10 fGreen">{{d.successNumber}}</span>
    <span>个成功</span>
    {{# } }}
  </div>
</script>

<!-- 修改捆绑销售活动 成功与否 -->
<script type="text/html" id="shopee_marketCenter_edit_activity_result">
  <div class="layui-card p10">
    {{# if(d.update_bundle_deal.resultType == 2){ }}
    <div class="layui-card-header">{{d.update_bundle_deal.errMsg}}</div>
    {{# }else if(d.update_bundle_deal.resultType == 1){ }} {{#
    if(d.update_bundle_deal_item &&
    d.update_bundle_deal_item.add_bundle_deal_item &&
    d.update_bundle_deal_item.add_bundle_deal_item.result_type==1){ }}
    <div class="layui-card-hedaer mb10" style="font-size: 16px;color: #000;">
      添加数据
    </div>
    <div class="layui-card-content">
      <div>
        请求关联商品共{{d.update_bundle_deal_item.add_bundle_deal_item.item_add_result.total}}条，
        成功<span class="fGreen"
          >{{d.update_bundle_deal_item.add_bundle_deal_item.item_add_result.success}}</span
        >条, 失败<span class="fRed"
          >{{d.update_bundle_deal_item.add_bundle_deal_item.item_add_result.fail}}</span
        >条
      </div>
      <table
        class="layui-table"
        id="shopee_marketCenter_edit_activity_result_addTable"
      ></table>
    </div>
    {{# }else if(d.update_bundle_deal_item &&
    d.update_bundle_deal_item.add_bundle_deal_item &&
    d.update_bundle_deal_item.add_bundle_deal_item.err_msg){ }}
    <div>
      错误：<span class="fRed"
        >{{d.update_bundle_deal_item.add_bundle_deal_item.err_msg}}</span
      >
    </div>
    {{# } }} {{# if(d.update_bundle_deal_item &&
    d.update_bundle_deal_item.del_bundle_deal_item &&
    d.update_bundle_deal_item.del_bundle_deal_item.result_type==1){ }}
    <div
      class="layui-card-hedaer mb10 mt20"
      style="font-size: 16px;color: #000;"
    >
      删除数据
    </div>
    <div class="layui-card-content">
      <div>
        请求关联商品共{{d.update_bundle_deal_item.del_bundle_deal_item.item_add_result.total}}条，
        成功<span class="fGreen"
          >{{d.update_bundle_deal_item.del_bundle_deal_item.item_add_result.success}}</span
        >条, 失败<span class="fRed"
          >{{d.update_bundle_deal_item.del_bundle_deal_item.item_add_result.fail}}</span
        >条
      </div>
      <table
        class="layui-table"
        id="shopee_marketCenter_edit_activity_result_delTable"
      ></table>
    </div>
    {{# }else if(d.update_bundle_deal_item &&
    d.update_bundle_deal_item.del_bundle_deal_item
    &&d.update_bundle_deal_item.del_bundle_deal_item.err_msg ){ }}
    <div>
      错误：<span class="fRed"
        >{{d.update_bundle_deal_item.del_bundle_deal_item.err_msg}}</span
      >
    </div>
    {{# } }} {{# } }}
  </div>
</script>

<!-- 添加捆绑销售活动 成功与否 -->
<script type="text/html" id="shopee_marketCenter_add_activity_result">
  <div class="layui-card p10">
    {{# if(d.result_type == 2){ }}
    <div class="layui-card-header">{{d.err_msg}}</div>
    {{# }else if(d.result_type == 1){ }}
    <div class="layui-card-hedaer mb10" style="font-size: 16px;color: #000;">
      添加数据
    </div>
    <div class="layui-card-content">
      <div>
        请求关联商品共{{d.item_add_result.total}}条， 成功<span class="fGreen"
          >{{d.item_add_result.success}}</span
        >条, 失败<span class="fRed">{{d.item_add_result.fail}}</span>条
      </div>
      <table
        class="layui-table"
        id="shopee_marketCenter_add_activity_result_addTable"
      ></table>
    </div>
    {{# } }}
  </div>
</script>
<script type="text/html" id="shopee_marketCenter_del_activity_result">
  <table
    class="layui-table"
    id="shopee_marketCenter_del_activity_result_Table"
  ></table>
</script>
<script type="text/html" id="shopee_marketCenter_del_activity_result_Table_msg">
  <div class="{{d.isSucc ? 'fGreen':'fRed'}}">{{d.msg}}</div>
</script>
<script src="${ctx}/static/js/publishs/shopee/marketingCenter.js"></script>

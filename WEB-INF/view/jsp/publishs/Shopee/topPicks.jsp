<%@ page language='java' import='java.util.*' contentType='text/html;charset=UTF-8' %> <%@ taglib prefix='c' uri='http://java.sun.com/jsp/jstl/core' %><%@ taglib prefix="permTag"
uri="/WEB-INF/tld/permTag.tld" %>
<title>热门精选</title>
<style>
  .shop_topPicks_imgCss {
    width: auto;
    height: auto;
    width: 40px;
    padding: 1px;
    margin: auto;
  }
  .shop_topPicks_label {
    padding: 9px 10px;
    width: 85px;
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form action="" class="layui-form" id="shop_topPicks_form">
            <div class="layui-form-item layui-row">
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">部门</label>
                <div class="layui-input-block">
                  <select id="shop_topPicks_group_sel" name="orgId" lay-filter="shop_topPicks_group_sel" class="orgs_hp_custom" lay-search></select>
                </div>
              </div>
              <div class="layui-col-md3 layui-col-lg3">
                <label class="layui-form-label">销售员</label>
                <div class="layui-input-block">
                  <select
                    id="shop_topPicks_salesman_sel"
                    name="sellerId"
                    lay-filter="shop_topPicks_salesman_sel"
                    class="users_hp_custom"
                    data-roleList="shopee专员"
                    xm-select-search
                    xm-select="shop_topPicks_salesman_sel"
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">店铺</label>
                <div class="layui-input-block">
                  <select
                    name="storeAcctIds"
                    data-platcode="shopee"
                    lay-search
                    class="store_hp_custom"
                    xm-select-search
                    lay-filter="shop_topPicks_storeAcct_sel"
                    xm-select="shop_topPicks_storeAcct_sel"
                    xm-select-search-type="dl"
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">精选ID</label>
                <div class="layui-input-block disflex">
                  <input type="text" name="topPicksIds" class="layui-input" placeholder="" onblur="commChangeInputVal(this.value,event)" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">精选名称</label>
                <div class="layui-input-block disflex">
                  <input type="text" name="topPicksName" class="layui-input" placeholder="模糊搜索" />
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <label class="layui-form-label">精选活动状态</label>
                <div class="layui-input-block disflex">
                  <select name="active" lay-search>
                    <option value="">请选择</option>
                    <option value="true">开启</option>
                    <option value="false">关闭</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg2 layui-col-md2">
                <div class="layui-input-block">
                  <a href="javascript:;" class="layui-btn layui-btn-sm" id="shop_topPicks_search">查询</a>
                  <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary" type="reset" id="shop_topPicks_reset">清空</a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="shop_topPicks_tab">
            <div class="disFCenter">
              <ul class="layui-tab-title">
                <li class="layui-this">数量(<span id="shop_topPicks_total">0</span>)</li>
              </ul>
              <div class="disflex layui-form">
                <div class="disflex">
                  <input type="text" class="layui-input" name="removeItems" id="shop_topPicks_removeItems" placeholder="支持输入多个,英文逗号隔开" onblur="commonBlurMoreNum(event)"/>
                  <button type="button" class="layui-btn layui-btn-sm" id="shop_topPicks_remove">一键移除listing</button>
                </div>
                <button type="button" class="layui-btn layui-btn-sm ml10" id="shop_topPicks_add">新增精选活动</button>
                <button type="button" class="layui-btn layui-btn-sm" id="shop_topPicks_export">导出精选活动</button>
                <div class="w150 ml10">
                  <select name="batchOperations" lay-filter="shop_topPicks_batchBtn_filter">
                    <option value="">批量操作</option>
                    <permTag:perm funcCode="shop_topPicks_batchOnBtn">
                      <option value="1">批量开启精选活动</option>
                    </permTag:perm>
                    <permTag:perm funcCode="shop_topPicks_batchOffBtn">
                      <option value="2">批量关闭精选活动</option>
                    </permTag:perm>
                    <permTag:perm funcCode="shop_topPicks_batchDelBtn">
                      <option value="3">批量删除精选活动</option>
                    </permTag:perm>
                  </select>
                </div>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table class="layui-table" id="shop_topPicks_table" lay-filter="shop_topPicks_table"></table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 状态 -->
<script id="shop_topPicks_active" type="text/html">
  <input type="checkbox" lay-skin="switch" name="active" value="{{d.topPicksId}}" data-storeacctid="{{d.storeAcctId}}" lay-filter="shop_topPicks_active_filter" {{d.active === true
  ? 'checked' : '' }} lay-event="changeStatus">
</script>

<!-- 操作栏 -->
<script type="text/html" id="shop_topPicks_toolbar">
  <a href="javascript:;" class="layui-btn layui-btn-sm" lay-event="edit">修改</a>
  <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</a>
</script>

<!-- 添加、新增精选 -->
<script id="shop_topPicks_setPicks_tpl" type="text/html">
  <div class="layui-card">
    <div class="layui-card-body">
      <form action="" class="layui-form" id="shop_topPicks_setPicks_form">
        <div class="layui-form-item">
          <label class="layui-form-label shop_topPicks_label"><font class="fRed">*</font>精选名称</label>
          <div class="layui-input-block">
            <input type="text" class="layui-input" name="topPicksName" value="{{d.topPicksName}}" maxlength="24" oninput="shopTopPicksInputLen(this)" />
            <span>{{d.topPicksName.length}}</span>
            <span>/24</span>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label shop_topPicks_label"><font class="fRed">*</font>店铺</label>
          {{# if(d.type==='add'){ }}
          <div class="layui-input-block">
            <select name="storeAcctId" id="shop_topPicks_setPicks_storeAcctId" lay-search></select>
          </div>
          {{# }else{ }}
          <div class="layui-input-block" style="line-height: 32px;">{{d.storeAcct}}</div>
          {{# } }}
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label shop_topPicks_label">精选状态</label>
          <div class="layui-input-block"><input type="checkbox" lay-skin="switch" name="active" {{d.active && 'checked' }}></div>
        </div>
        {{# if(d.type==='add'){ }}
        <div class="layui-form-item">
          <label class="layui-form-label shop_topPicks_label">产品ID</label>
          <div class="layui-input-block">
            <textarea
              name="itemIdList"
              class="layui-textarea"
              onblur="commChangeInputVal(this.value,event)"
              placeholder="(支持填入0-8个item_id)"
              value="{{d.itemIdList}}"
            ></textarea>
          </div>
        </div>
        {{# } }}
      </form>
    </div>
  </div>
</script>

<!-- 商品列表 -->
<script id="shop_topPicks_setItems_tpl" type="text/html">
  <div class="layui-card">
    <div class="layui-card-header disflex" style="justify-content: flex-end;">
      <div class="w200 mt10">
        <input
          type="text"
          name="itemIds"
          class="layui-input"
          id="shop_topPicks_setItems_input"
          placeholder="填入itemId,多个用逗号隔开"
          onblur="commChangeInputVal(this.value,event)"
        />
      </div>
      <a href="javascript:;" class="layui-btn layui-btn-sm mt10" lay-event="edit" id="shop_topPicks_setItems_add">一键添加商品</a>
    </div>
    <div class="layui-card-body">
      <div>数量(<span id="shop_topPicks_items_total"></span>)</div>
      <table class="layui-table" id="shop_topPicks_items_table" lay-filter="shop_topPicks_items_table"></table>
    </div>
  </div>
</script>

<!--  -->
<script id="shop_topPicks_items_name" type="text/html">
  <div class="imgDiv sell-hot-iocn-box">
    <div class="findGoods epz_out" style="left: 20%;">
      {{# if(d.mainImgUrl != null){ }}
      <img class="img_show_hide shop_topPicks_imgCss lazy" data-original="{{d.mainImgUrl}}" style="display: block;" data-onerror="layui.admin.img_noFind()" /> {{# } }}
    </div>
    <div>{{d.name}}</div>
    <div>{{d.itemId}}</div>
  </div>
</script>

<script id="shop_topPicks_items_tool" type="text/html">
  <a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-danger" lay-event="delete">删除</a>
</script>

<!-- 一键listing删除失败弹窗 -->
<script id="shop_topPicks_removeItems_fail" type="text/html">
  <div class="layui-card">
    <div class="layui-card-header">数量(<span id="shop_topPicks_removeItems_fail_total">0</span>)</div>
    <div class="layui-card-body">
      <table class="layui-table" id="shop_topPicks_removeItems_fail_table" lay-filter="shop_topPicks_removeItems_fail_table"></table>
    </div>
  </div>
</script>

<script src="${ctx}/static/js/publishs/shopee/topPicks.js"></script>

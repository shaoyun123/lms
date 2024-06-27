<%@ page language="java" import="java.util.*"
contentType="text/html;charset=UTF-8" %> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>
<title>物流禁用</title>

<style>
  #shop_categoryLogisticProhibit_import {
    position: relative;
  }
  #shop_categoryLogisticProhibit_importInputBtn {
    position: absolute;
    overflow: hidden;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    opacity: 0;
  }
  .shop_categoryLogisticProhibit_smallTitle {
    color: red;
    margin-left: 10px;
    font-size: 12px;
  }
  #shop_categoryLogisticProhibit_detail_form .layui-form-label {
    width: 110px;
    padding: 9px 10px;
  }
  #shop_categoryLogisticProhibit_detail_form .layui-input-block {
    margin-left: 130px;
  }
  #shop_categoryLogisticProhibit_detail_form .flex-end {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  #shop_categoryLogisticProhibit_detail_form .box-row {
    align-items: center;
  }
  #shop_categoryLogisticProhibit_detail_form .line_wrapper {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  #shop_categoryLogisticProhibit_detail_form .del_line {
    height: 3px;
    width: 15px;
    background-color: #fff;
  }
  #shop_categoryLogisticProhibit_detail_form .del {
    background: red;
  }
  #shop_categoryLogisticProhibit_detail_form .add {
    background: green;
  }
  #shop_categoryLogisticProhibit_detail_form .add_line {
    height: 3px;
    width: 15px;
    background-color: #fff;
    position: absolute;
  }
  #shop_categoryLogisticProhibit_detail_form .add_x_line {
    left: 5px;
  }
  #shop_categoryLogisticProhibit_detail_form .add_y_line {
    transform: rotate(90deg);
    left: 5px;
  }
</style>

<div class="layui-fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <div class="layui-card">
        <div class="layui-card-body">
          <form
            action=""
            class="layui-form"
            id="shop_categoryLogisticProhibit_form"
          >
            <div class="layui-form-item layui-row">
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">站点</label>
                <div class="layui-input-block">
                  <select
                    xm-select="shop_categoryLogisticProhibit_site"
                    name="siteList"
                    xm-select-search
                    xm-select-search-type="dl" 
                    xm-select-skin="normal"
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">校验值</label>
                <div class="layui-input-block">
                  <select name="prohibitType" lay-search>
                    <option value="">请选择</option>
                    <option value="CNSC类目">CNSC类目</option>
                    <option value="外箱包装">外箱包装</option>
                    <option value="物流属性">物流属性</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">CNSC类目ID</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    name="categoryIdList"
                    class="layui-input"
                    placeholder="支持多CNSC类目ID精确查询"
                  />
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">物流ID</label>
                <div class="layui-input-block">
                  <input
                    type="text"
                    name="logisticIdList"
                    class="layui-input"
                    placeholder="支持多物流ID精确查询"
                  />
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">创建人</label>
                <div class="layui-input-block">
                  <select
                    id="shop_categoryLogisticProhibit_creator"
                    name="creator"
                    lay-search
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">修改人</label>
                <div class="layui-input-block">
                  <select
                    id="shop_categoryLogisticProhibit_modifier"
                    name="modifier"
                    lay-search
                  ></select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <label class="layui-form-label">规则状态</label>
                <div class="layui-input-block">
                  <select name="status" lay-search>
                    <option value="">全部</option>
                    <option value="1">生效中</option>
                    <option value="0">无效</option>
                  </select>
                </div>
              </div>
              <div class="layui-col-lg3 layui-col-md3">
                <div class="layui-input-block">
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm"
                    id="shop_categoryLogisticProhibit_search"
                    >查询</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm layui-btn-primary"
                    type="reset"
                    id="shop_categoryLogisticProhibit_reset"
                    >清空</a
                  >
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="layui-card">
        <div class="layui-card-body">
          <div class="layui-tab" lay-filter="shop_categoryLogisticProhibit_tab">
            <div class="disflex">
              <ul class="layui-tab-title">
                <li class="layui-this">
                  数量(<span id="shop_categoryLogisticProhibit_total">0</span>)
                </li>
              </ul>
              <div class="ml20 disFCenter layui-form" style="flex: 1">
                <div class="disflex" style="align-items: center">
                  <select
                    name="importType"
                    id="shop_categoryLogisticProhibit_importType"
                  >
                    <option value="">请选择执行操作</option>
                    <option value="add">新增禁用规则</option>
                    <option value="replace">替换选中站点禁用规则</option>
                    <option value="del">删除禁用规则</option>
                  </select>
                  <a
                    href="/lms//static/templet/ShopeeCategoryLogisticProhibitImport.xlsx"
                    target="_blank"
                    class="layui-btn layui-btn-sm ml10"
                    >下载模板</a
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm"
                    id="shop_categoryLogisticProhibit_import"
                  >
                    <input
                      type="file"
                      accept=".xls,.xlsx,"
                      id="shop_categoryLogisticProhibit_importInputBtn"
                      onchange="shop_categoryLogisticProhibit_import(this,event)"
                    />
                    导入excel</a
                  >
                  <span
                    id="shop_categoryLogisticProhibit_import_result"
                    class="ml20"
                  ></span>
                </div>
                <div>
                  <span
                    id="shop_categoryLogisticProhibit_import_resultInfo"
                    class="ml20 blue hidden"
                    data-id=""
                    >查看错误详情</span
                  >
                  <a
                    href="javascript:;"
                    class="layui-btn layui-btn-sm"
                    id="shop_categoryLogisticProhibit_add"
                    >新增物流禁用规则</a
                  >
                </div>
              </div>
            </div>
            <div class="layui-tab-content">
              <div class="layui-tab-item layui-show">
                <table
                  class="layui-table"
                  id="shop_categoryLogisticProhibit_table"
                  lay-filter="shop_categoryLogisticProhibit_table"
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
<script type="text/html" id="shop_categoryLogisticProhibit_status">
  <input type="checkbox" name="status" data-id="{{d.id}}" lay-skin="switch"
  {{d.status===true ? 'checked' :''}}
  lay-filter="shop_categoryLogisticProhibit_status">
</script>

<script type="text/html" id="shop_categoryLogisticProhibit_toolbar">
  <a href="javascript:;" class="layui-btn layui-btn-sm" lay-event="edit">
    编辑</a
  >
</script>

<!-- 详情弹窗 -->
<script type="text/html" id="shop_categoryLogisticProhibit_detail">
  <div class="layui-card">
    <div class="layui-card-body">
      <form
        action=""
        class="layui-form"
        id="shop_categoryLogisticProhibit_detail_form"
      >
        <div class="layui-form-item">
          <label class="layui-form-label"
            ><font class="fRed">*</font>站点</label
          >
          <div class="layui-input-block">
            <div class="ml20">
              <select name="salesSite" lay-search value="{{d.salesSite}}" {{d.isAdd ? "" : "disabled"}} class="{{d.isAdd ?'' : 'layui-disabled'}}"
                id="shop_categoryLogisticProhibit_detail_salesSite"
                lay-filter="shop_categoryLogisticProhibit_detail_salesSite"
              >
                <option value="">请选择</option>
                {{# layui.each(d.SiteList,function(_,a){ }}
                <option value="{{a.code}}" {{a.code==d.salesSite ? "selected" : ""}}>{{a.name}}</option>
                {{# })}}
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label"><font class="fRed">*</font>物流名称（ID）</label>
          <div class="layui-input-block">
            <div class="ml20">
              <select name="logisticsChannelId" lay-search id="shop_categoryLogisticProhibit_detail_logisticsChannelId"  {{d.isAdd ? "" : "disabled"}} class="{{d.isAdd ? "" : 'layui-disabled'}}"></select>
            </div>
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label"><font class="fRed">*</font>校验值</label>
          <div class="layui-input-block">
            <div class="ml20">
              <select name="prohibitType" lay-filter="shop_categoryLogisticProhibit_detail_prohibitType"  {{d.isAdd ? "" : 'disabled'}} class="{{d.isAdd ? "" : 'layui-disabled'}}">
                <option value="CNSC类目" {{d.prohibitType==='CNSC类目' && 'selected'}}>CNSC类目</option>
                <option value="外箱包装"  {{d.prohibitType==='外箱包装' && 'selected'}}>外箱包装</option>
                <option value="物流属性"  {{d.prohibitType==='物流属性' && 'selected'}}>物流属性</option>
              </select>
            </div>
          </div>
        </div>
        <div class="layui-form-item showCnscCate">
          <label class="layui-form-label"><font class="fRed">*</font>CNSC类目（ID）</label>
          <div class="layui-input-block">
            <div class="ml20">
              <input id="shop_categoryLogisticProhibit_detail_cnsc" name="" class="ml20">
            </div>
          </div>
        </div>
        <div class="layui-form-item showOutBoxPackage">
          <div class="layui-form-label">
            <div class="flex-end">
              <div lay-tips="外箱包装校验至子sku级别，存在子sku满足条件则商品满足禁用条件">
                <svg t="1682217595408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3545" width="15" height="15">
                  <path d="M512 888c207.66 0 376-168.34 376-376S719.66 136 512 136 136 304.34 136 512s168.34 376 376 376z m0 72C264.576 960 64 759.424 64 512S264.576 64 512 64s448 200.576 448 448-200.576 448-448 448z" fill="#5090F1" p-id="3546"></path>
                  <path d="M480 760m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z" fill="#5090F1" p-id="3547"></path><path d="M512 612v68a8 8 0 0 1-8 8h-48a8 8 0 0 1-8-8v-68c0-35.346 28.654-64 64-64 71.797 0 130-58.203 130-130S583.797 288 512 288 382 346.203 382 418H318C318 310.857 404.857 224 512 224s194 86.857 194 194-86.857 194-194 194z" fill="#5090F1" p-id="3548">
                  </path>
                </svg>
              </div>
              <font class="fRed">*</font>
              <span>外箱包装</span>
            </div>
          </div>
          <div class="layui-input-block">
          {{#  layui.each(d.outerBoxPackingConditionList,function(index,item){ }}
              <div class="disflex box-row mb10">
                <div class="w20">{{index==0 ? '':''}}</div>
               <div class="w150">
                 <select name="target" lay-filter="shop_categoryLogisticProhibit_detail_target">
                   <option value="">请选择</option>
                   <option value="任意一边长" {{item.target=='任意一边长' && 'selected'}}>任意一边长</option>
                   <option value="次长边长" {{item.target=='次长边长' && 'selected'}}>次长边长</option>
                   <option value="最短边长" {{item.target=='最短边长' && 'selected'}}>最短边长</option>
                   <option value="长+宽+高" {{item.target=='长+宽+高' && 'selected'}}>长+宽+高</option>
                   <option value="重量" {{item.target=='重量' && 'selected'}}>重量</option>
                   <option value="液体量" {{item.target=='液体量' && 'selected'}}>液体量</option>
                 </select>
               </div>
               <div class="w150 ml10">
                 <select name="operator" lay-filter="shop_categoryLogisticProhibit_detail_operator">
                   <option value="">请选择</option>
                   <option value=">" {{item.operator=='>' && 'selected'}}>&gt;</option>
                   <option value=">=" {{item.operator=='>=' && 'selected'}}>&gt;=</option>
                   <option value="<" {{item.operator=='<' && 'selected'}}>&lt;</option>
                   <option value="<=" {{item.operator=='<=' && 'selected'}}>&lt;=</option>
                   <option value="==" {{item.operator=='==' && 'selected'}}>=</option>
                 </select>
               </div>
               <div class="w150 ml10">
                 <input type="text" class="layui-input" name="value" value="{{item.value}}" placeholder="请输入" onblur="shopcategoryLogisticProhibitHanleBlur(this)">
               </div>
               <div class="unit w40 ml5">
                {{item.unit || ''}}
               </div>
               <div class="{{d.outerBoxPackingConditionList.length==1 ? 'w50 del-part hidden':'w50 del-part'}}">
                  <div class="line_wrapper del" onclick="shopcategoryLogisticProhibitHanleDel(this)"><div class="add_line"></div></div>
                </div>
                 <div class="{{d.outerBoxPackingConditionList.length-1!==index ? 'w50 hidden add-part':'w50 add-part'}}" >
                  <div class="line_wrapper add" onclick="shopcategoryLogisticProhibitHanleAdd(this)">
                    <div class="add_line add_x_line"></div>
                    <div class="add_line add_y_line"></div>
                  </div>
                </div>
              </div>
           {{# }) }}
          </div>
        </div>
        <div class="layui-form-item showLogisAttrList">
          <div class="layui-form-label">
            <div class="flex-end">
              <div lay-tips="多选时为“或”逻辑">
                <svg t="1682217595408" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3545" width="15" height="15">
                  <path d="M512 888c207.66 0 376-168.34 376-376S719.66 136 512 136 136 304.34 136 512s168.34 376 376 376z m0 72C264.576 960 64 759.424 64 512S264.576 64 512 64s448 200.576 448 448-200.576 448-448 448z" fill="#5090F1" p-id="3546"></path>
                  <path d="M480 760m-40 0a40 40 0 1 0 80 0 40 40 0 1 0-80 0Z" fill="#5090F1" p-id="3547"></path><path d="M512 612v68a8 8 0 0 1-8 8h-48a8 8 0 0 1-8-8v-68c0-35.346 28.654-64 64-64 71.797 0 130-58.203 130-130S583.797 288 512 288 382 346.203 382 418H318C318 310.857 404.857 224 512 224s194 86.857 194 194-86.857 194-194 194z" fill="#5090F1" p-id="3548">
                  </path>
                </svg>
              </div>
              <font class="fRed">*</font>
              <span>物流属性</span>
            </div>
          </div>
          <div class="layui-input-block ml20">
            <select 
              id="shop_categoryLogisticProhibit_detail_logisAttrList" 
              name="logisAttrList" 
              xm-select="shop_categoryLogisticProhibit_detail_logisAttrList" 
              xm-select-search 
              xm-select-search-type="dl" 
              xm-select-skin="normal"
            ></select>
            
          </div>
        </div>
      </form>
    </div>
  </div>
</script>

<script src="${ctx}/static/js/publishs/shopee/categoryLogisticProhibit.js"></script>

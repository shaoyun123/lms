<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>公共模板</title>
<style>
.smtpublictemplate_tree {
  position: fixed;
  height: 600px;
}
#smtpublictemplate_newAddLayer_form .layui-form-item .layui-form-checkbox{
  width: 150px;
}
#smtpublictemplate_newAddLayer_form .layui-form-item .layui-form-checkbox span {
  position: absolute;
  left: 15px;
}
#smtpublictemplate_newAddLayer_form .modifyPriceDetail.layui-table{
  width: 0;
}
#smtpublictemplate_newAddLayer_form .modifyPriceDetail td{
  width:80px;
  min-width:80px;
}

</style>
<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
          <div class="smtpublictemplate_tree">
            <ul class="layui-nav layui-nav-tree" id="smtpublictemplate_tree">
                <li class="layui-nav-item layui-this" onclick="smt_searchMember('treeBody1',this)"><a href="javascript:;">区域调价模板</a></li>
                <li class="layui-nav-item" onclick="smt_searchMember('treeBody2',this)"><a href="javascript:;">商品资质</a></li>
            </ul>
          </div>
          <div class="layui-card" style="margin-left:220px;">
            <div class="treeBody1">
            <div class="layui-card">
              <div class="layui-card-body">
                <form action="" class="layui-form" id="smtpublictemplate_form">
                  <div class="layui-form-item layui-row">
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">部门</label>
                        <div class="layui-input-block">
                            <select name="orgId" lay-filter="orgs_hp_smtpublictemplate" lay-search
                                class="orgs_hp_custom">
                                <option value=""></option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">销售员</label>
                        <div class="layui-input-block">
                            <select name="salePersonId" class="users_hp_custom" lay-search
                              data-rolelist="smt专员" lay-filter="users_hp_smtpublictemplate">
                            </select>
                        </div>
                    </div>
                    <div class="layui-col-lg4 layui-col-md4">
                        <label class="layui-form-label">店铺</label>
                        <div class="layui-input-block">
                          <select name="storeAcctIds" data-platcode="aliexpress" xm-select-search
                            id="smtpublictemplate_storeAcct_sel" lay-filter="smtpublictemplate_storeAcct_sel"
                            xm-select="smtpublictemplate_storeAcct_sel" xm-select-search-type="dl"
                            xm-select-skin="normal" class="store_hp_custom">
                            <option value=""></option>
                          </select>
                        </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                      <label class="layui-form-label">模板类型</label>
                      <div class="layui-input-block">
                        <select name="templateType">
                          <option value="">全部</option>
                          <option value="1">公共模板</option>
                          <option value="2">店铺模板</option>
                        </select>
                      </div>
                    </div>
                    <div class="layui-col-lg3 layui-col-md3">
                      <label class="layui-form-label">创建人</label>
                      <div class="layui-input-block">
                        <select name="creatorId" id="smtpublictemplate_creatorId" lay-search>
                          <option value="">请选择</option>
                        </select>
                      </div>
                    </div>
                    <div class="layui-col-lg2 layui-col-md2">
                      <div class="layui-input-block clearfix">
                          <span id="smtpublictemplate_search_submit" lay-submit
                              class="layui-btn layui-btn-sm"
                              lay-filter="smtpublictemplate_search_submit">搜索</span>
                      </div>
                  </div>
                </div>
                </form>
              </div>
            </div>
            <div class="layui-card">
              <div class="layui-card-header">
                <button class="layui-btn layui-btn-sm layui-btn-normal fr" type="button" id="smtpublictemplate_newAdd">
                  新增
                </button>
              </div>
              <div class="layui-card-body">
                <table class="layui-table" id="smtpublictemplate_table" lay-filter="smtpublictemplate_tableFilter"></table>
              </div>
            </div>
            </div>
            <div class="treeBody2 layui-row disN">
                <form class="layui-form" id="smtpublictemplate_form_prod">
                    <div class="layui-form-item" style="padding:20px 0;">
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">模板名称</label>
                            <div class="layui-input-block">
                                <input class="layui-input" name="tplName" />
                            </div>
                        </div>
                        <div class="layui-col-md3 layui-col-lg3">
                            <label class="layui-form-label">资质名称</label>
                            <div class="layui-input-block">
                                <select xm-select="prodQualifyName" id="prodQualifyName" name="key" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-lg2 layui-col-md2">
                            <div class="layui-input-block clearfix">
                            <span id="smtpublictemplate_search_prod" lay-submit class="layui-btn layui-btn-sm"
                            lay-filter="smtpublictemplate_search_prod">搜索</span>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="layui-card-body">
                    <a class="layui-btn layui-btn-sm layui-btn-normal" id="smtpublictemplate_add_prod" style="float:right">新增</a>
                    <table class="layui-table" id="smtpublictemplate_productTable" lay-filter="smtpublictemplate_productTable"></table>
                </div>
            </div>
          </div>
        </div>
    </div>
</div>

<%-- 调价方式 --%>
<script type="text/html" id="smtpublictemplate_type">
  <div>
      {{# if(d.adjustPriceType==1){  }}
        <span>百分比调价</span>
      {{#  }else{  }}
        <span>金额调价</span>
      {{#  } }}
  </div>
</script>

<%-- 调价值 --%>
<script type="text/html" id="smtpublictemplate_value">
  <div class="smtpublictemplate-value-div">
      {{# if(d.adjustPriceStrList){  }}
          <div>
            <!-- 保留三行，折叠展开 -->
            {{# layui.each(d.adjustPriceStrList, function(index, item){ }}
              {{# if(d.adjustPriceType==1){  }}
              <p class="{{index>2 ? 'myj-hide':''}}"><span>{{item.name}}:</span><span>{{item.value}}%</span></p>
              {{# }else{ }}
              <p class="{{index>2 ? 'myj-hide':''}}"><span>{{item.name}}({{item.code}}):</span><span>{{item.value}}</span></p>
              {{# } }}
          {{# }) }}
          </div>
          {{#  if(d.adjustPriceStrList.length > 3){ }}
                <a href="javascript:" class="productListSkuShow smtpublictemplate-changeColspan" style="float:right;">+ 展开</a>
          {{# } }}
      {{# } }}
  </div>
</script>

<%-- 操作按钮 --%>
<script type="text/html" id="smtpublictemplate_tableIdBar">
  <a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>
  <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>
<%-- 编辑和新增功能弹框 --%>
<script type="text/html" id="smtpublictemplate_newAddLayer">
    <div class="p20">
        <span style="color:#ff0000;padding-left:44px;display:inline-block;margin-bottom:20px;">
          注意:调价输入框如果输入正值,如6,表示增加,输入负值,如-6,表示减少;
        </span>
        <form class="layui-form" id="smtpublictemplate_newAddLayer_form">
          
        </form>
    </div>
</script>
<%-- 编辑或者新增模板代码 --%>
<script type="text/html" id="smtpublictemplate_newAddLayer_formTpl">
      {{# if(d.id){ }}
        <input type="hidden" name="id" value="{{d.id}}">
      {{# } }}
      <div class="layui-form-item">
        <div class="layui-form-label"><font color="red">*</font>模板名称</div>
        <div class="layui-input-block">
          <input type="text" class="layui-input" name="templateName" value="{{d.templateName}}" lay-verify="required">
        </div>
      </div>
      <div class="layui-form-item">
        <div class="layui-form-label">调价方式</div>
        <div class="layui-input-block">
          <select name="adjustPriceType" lay-filter="adjustPriceTypeFilter">
            {{# if(d.adjustPriceType == 1){ }}
              <option value="1" selected>按比例</option>
              <option value="2">按金额</option>
            {{# }else if(d.adjustPriceType == 2){ }}
              <option value="1">按比例</option>
              <option value="2" selected>按金额</option>
            {{# } }}
          </select>
        </div> 
      </div>
      <div class="layui-form-item">
        <div class="layui-form-label">调价区域</div>
        <div class="layui-input-block smt_checkboxes">
          {{# if(d.countries){  }}
            {{#  layui.each(d.countries, function(index, item){ }}
              {{# if(d.adjustPriceStr.indexOf(item.code)>-1){ }}
                <input type="checkbox" title="{{item.name}}" name="{{item.code}}" lay-skin="primary" checked>
              {{# }else{ }}
                <input type="checkbox" title="{{item.name}}" name="{{item.code}}" lay-skin="primary">
              {{# } }}
            {{# }) }}
          {{# } }}
        </div>
      </div>
      <div class="layui-form-item" style="margin-top:20px;margin-left:20px">
          <table class="layui-table modifyPriceDetail">
            <tbody>
              <tr id="modifyPriceDetailTr">
              {{# if(d.adjustPriceStrList){ }}
              {{# if(d.adjustPriceType == 1){ }}
              {{#  layui.each(d.adjustPriceStrList, function(index, item){ }}
              <td id="modifyPriceDetail{{item.code}}">
                <div>{{item.name}}</div>
                <div>
                  <input type="number" class="layui-input" data-name="{{item.name}}" name="{{item.code}}" value="{{item.value}}">
                  <span style="position:absolute;right:0;top:36px;">%</span>
                </div>
              </td>
              {{# }) }}
              {{# }else{ }}
              {{#  layui.each(d.adjustPriceStrList, function(index, item){ }}
              <td id="modifyPriceDetail{{item.code}}">
                <div>{{item.name}}</div>
                <div>
                  <input type="number" class="layui-input" data-name="{{item.name}}" name="{{item.code}}" value="{{item.value}}">
                </div>
              </td>
              {{# }) }}
              {{# } }}
              {{# } }}
              </tr>
            </tbody>
          </table>
      </div>
      <div class="layui-form-item">
        <div class="layui-form-label"><font color="red">*</font>模板类型</div>
        <div class="layui-input-block" name="templateTypeAll">
          <input type="radio" name="templateType" value="1" title="公共模板" lay-filter="smtpublictemplate_publicTpl" {{d.templateType != undefined && d.templateType == 1 ? 'checked' : ''}}>
          <input type="radio" name="templateType" value="2" title="店铺模板" lay-filter="smtpublictemplate_publicTpl" {{d.templateType != undefined && d.templateType == 2 ? 'checked' : ''}}>
        </div>
      </div>
      <div class="layui-form-item" id="smtpublictemplate_storeUseTpl">
        <div class="layui-form-label">使用店铺</div>
        <div class="layui-input-block">
          <textarea name="storeAcct"  placeholder="请填写店铺名,逗号分隔" class="layui-textarea"></textarea>
        </div>
      </div>
</script>

<%-- 操作按钮 --%>
<script type="text/html" id="smtpublictemplate_productTableBar">
    <a class="layui-btn layui-btn-xs" lay-event="edit">修改</a>
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>
</script>
<%-- 编辑和新增功能弹框 --%>
<script type="text/html" id="smtpublictemplate_productLayer">
    <form class="layui-form layui-row" id="smtpublictemplate_product_tableTool" style="padding:20px;">
    <input type="hidden" class="id" />
    <input type="hidden" class="label" />
    <input type="hidden" class="qualificationType" />
        <div class="layui-form-item">
            <label class="layui-form-label">模板名称</label>
            <div class="layui-input-block">
                <input class="layui-input name" />
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><font color="red">*</font>资质名称</label>
            <div class="layui-input-block">
                <select name="prodQualifyName" lay-filter="smtpublictemplate_filter_prodQualifyName" lay-search>
                <option value=""></option>
                </select>
            </div>
        </div>
        <div class="prodQualifyCon" id="smtpublictemplate_productLayer_prodQualifyCon"> </div>
    </form>
</script>
<script type="text/html" id="smtpublictemplate_productLayer_formTpl">
    <div class="layui-form-item">
        <label class="layui-form-label"><font color="red">*</font>{{d.label}}</label>
        <div class="layui-input-block qualificationitem">
            {{#if(d.qualificationType=='image'){}}
            <div class="disflex" style="align-items: center;">
                <a class="layui-btn layui-btn-primary layui-btn-sm qualification-upload">上传本地文件</a>
                <div style="width: 50px;" class="ml10">
                {{#if(d.qualificationValue){}}
                    <img width="60" height="60" src="{{d.qualificationValue}}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/>
                {{#}}}
                </div>
                <input type="hidden" class="qualification-Val" value="{{d.qualificationValue}}" />
<%--                <div class="{{d.qualificationValue ? 'fRed ml10 delteImg':'fRed ml10 delteImg hidden'}}">删除</div>--%>
            </div>
            {{#}else{}}
            <div class="disflex">
                <div class="layui-col-md9">
                    <input class="layui-input qualification-Val" data-required="{{d.required}}" value="{{d.qualificationValue || ''}}"/>
                </div>
            </div>
            {{#}}}
            <div style="color:#ff9900">{{d.tips}}</div>
        </div>
    </div>
</script>


<script src="${ctx}/static/js/publishs/aliexpress/smtpublictemplate.js"></script>

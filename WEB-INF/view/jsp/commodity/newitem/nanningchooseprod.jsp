<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>

<title>南宁仓选品</title>
<style>
  #nanningchooseprod_fluid a {
    color: #01AAED;
  }
  #nanningchooseprod_fluid a:hover {
    color: #1E9FFF;
  }
  #nanningchooseprod_fluid .align-left {
    text-align: left;
  }
  #nanningchooseprod_fluid .red {
    color: #ff0000;
    font-weight: 700;
  }
  #nanningchooseprod_fluid .green {
    color: #00CC00;
    font-weight: 700;
  }
  #nanningchooseprod_fluid .elips {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  #nanningchooseprod_fluid .elips-remark {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  #nanningchooseprod_fluid .turn-line {
    white-space: pre-wrap;
  }
  #nanningchooseprodAddAndEditLayerId .fullImg {
      position: relative;
      width: 150px;
      height: 150px;
      border: 1px dashed #ccc;
      margin-left: 110px;
  }
  #nanningchooseprodAddAndEditLayerId #nanningchooseprod_layer_img {
    width: 150px;
    height: 150px;
    object-fit: contain;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
  }
</style>

<div class="layui-fluid" id="nanningchooseprod_fluid">
  <div class="layui-row layui-col-space15">
    <div class="layui-col-lg12 layui-col-md12">
      <!-- 搜索条件 -->
      <div class="layui-card">
          <div class="layui-card-body">
            <form class="layui-form" id="nanningchooseprodForm" lay-filter="nanningchooseprodForm">
              <div class="layui-form-item">
                <div class="layui-col-md3 layui-col-lg3">
                  <div class="layui-form-label labelSel">
                      <select name="timeType">
                          <option value="1">创建时间</option>
                          <option value="2">组长审核时间</option>
                          <option value="3">主管审核时间</option>
                      </select>
                  </div>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" id="nanningchooseprod_time" name="time" readonly>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">部门</label>
                  <div class="layui-input-block">
                    <select name="organize" lay-filter="naningchooseprod_orgs_hp_devPerson" class="orgs_hp_custom" data-id="naningchooseprod_orgs_hp_devPerson" lay-search>
                      <option value=""></option>
                    </select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">
                    开发专员
                  </label>
                  <div class="layui-input-block">
                    <select name="bizzOwnerIdList" class="users_hp_custom"
                            xm-select="naningchooseprod_users_hp_devPerson"
                            xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                            lay-filter='naningchooseprod_users_hp_devPerson'
                            data-id="naningchooseprod_users_hp_devPerson" data-roleList="开发专员">
                    </select>
                  </div>
                </div>
                <div class="layui-col-lg1 layui-col-md1">
                  <div class="ml20">
                      <select name="site">
                        <option value="">站点</option>
                        <option value="越南">越南</option>
                        <option value="泰国">泰国</option>
                      </select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">创建人</label>
                  <div class="layui-input-block">
                    <select
                      name="creatorIdList"
                      xm-select="nanningchooseprod_creatorIdList"
                      id="nanningchooseprod_creatorIdList"
                      xm-select-search
                      xm-select-search-type="dl"
                      xm-select-skin="normal"
                    ></select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label labelSel">
                      <select name="personType" lay-filter="nanningchooseprod_personTypeList">
                          <option value="1" selected>销售专员</option>
                          <option value="2">销售主管</option>
                      </select>
                  </label>
                  <div class="layui-input-block">
                      <select name="personTypeList"
                      id="nanningchooseprod_personTypeList"
                      xm-select="nanningchooseprod_personTypeList"  
                      xm-select-search
                      xm-select-search-type="dl"
                      xm-select-skin="normal"></select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">父SKU</label>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" placeholder="精确查询,支持多个查询" name="prodPSkuList">
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">组长审核</label>
                  <div class="layui-input-block">
                    <select name="leaderAuditResult">
                      <option value="">请选择</option>
                      <option value="待审核">待审核</option>
                      <option value="审核成功">审核成功</option>
                      <option value="审核失败">审核失败</option>
                    </select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">主管审核</label>
                  <div class="layui-input-block">
                    <select name="managerAuditResult">
                      <option value="">请选择</option>
                      <option value="待审核">待审核</option>
                      <option value="审核成功">审核成功</option>
                      <option value="审核失败">审核失败</option>
                    </select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">采购状态</label>
                  <div class="layui-input-block">
                    <select name="purchaseStatus">
                      <option value="">请选择</option>
                      <option value="已采购">已采购</option>
                      <option value="未采购">未采购</option>
                    </select>
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2">
                  <label class="layui-form-label">排序方式</label>
                  <div class="layui-input-block">
                    <select name="orderType">
                      <option value="">请选择</option>
                      <option value="1" selected>创建时间升序</option>
                      <option value="2">创建时间倒序</option>
                    </select>
                  </div>
                </div>
                <div class="layui-col-md4 layui-col-lg2">
                  <label class="layui-form-label">选品方向</label>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" name="devWay" placeholder="单个模糊查询">
                  </div>
                </div>
                <div class="layui-col-md4 layui-col-lg2">
                  <label class="layui-form-label labelSel">
                    <select name="remarkType">
                        <option value="1">开发备注</option>
                        <option value="2">组长备注</option>
                        <option value="3">主管备注</option>
                    </select>
                  </label>
                  <div class="layui-input-block">
                      <input type="text" class="layui-input" placeholder="单个模糊查询" name="remark">
                  </div>
                </div>
                <div class="layui-col-md2 layui-col-lg2 pl20">
                  <span class="layui-btn layui-btn-sm" lay-filter="nanningchooseprodform_submit" lay-submit>查询</span>
                  <button type="reset" class="layui-btn layui-btn-primary layui-btn-sm">清空</button>
                </div>
              </div>
            </form>
          </div>
      </div>
      <!-- 搜索结果 -->
      <div class="layui-card">
        <div class="layui-card-header" style="display: flex; justify-content: space-between;align-items: center;">
          <div>
            <permTag:perm funcCode="nanningchooseprod_purchaseStatusBtnPerm">
          <span class="layui-btn layui-btn-sm layui-btn-normal" id="nanningchooseprod_purchaseStatusBtn">采购状态</span>
          </permTag:perm>
          </div>
          <div>
            <permTag:perm funcCode="nanningchooseprod_addBtnPerm">
            <span class="layui-btn layui-btn-sm" id="nanningchooseprod_addBtn">新增</span>
            </permTag:perm>
            <permTag:perm funcCode="nanningchooseprod_exportBtnPerm">
            <span class="layui-btn layui-btn-sm layui-btn-normal" id="nanningchooseprod_exportBtn">导出</span>
            </permTag:perm>
          </div>
        </div>
        <div class="layui-card-body">
          <!-- 表格的数据渲染 -->
          <table class="layui-table" id="nanningchooseprod_table" lay-filter="nanningchooseprod_table_filter"></table>
        </div>
    </div>
    </div>
  </div>
</div>

<!-- 表格-竞品图片 -->
<script type="text/html" id="nanningchooseprod_imageTpl">
  <div>
    <div class="{{d.purchaseStatus=='已采购'? 'green':'red'}}">{{d.purchaseStatus}}</div>
    <div><img width="60" height="60" src="{{d.compImgUrl||''}}" class="img_show_hide b1" onerror="layui.admin.img_noFind()"></div>
  </div>
</script>
<!-- 表格-竞品信息 -->
<script type="text/html" id="nanningchooseprod_compInfoTpl">
  <div class="align-left">
    <div><span class="layui-badge {{d.site== '泰国' ?'layui-bg-blue': 'layui-bg-green'}}">{{d.site || ''}}</span><a href="{{d.compUrl}}" target="_blank">竞品链接</a></a></div>
    <div>售价({{ d.site == '泰国' ? 'THB':'VND'}}): {{d.compPrice || ''}}</div>
    <div>30天销量: {{d.comp30sales || ''}}</div>
    <div>上架时间: {{d.compListingTime || ''}}</div>
    <div class="elips" title="{{d.shopeeCategory || ''}}">类目: <span>{{d.shopeeCategory||''}}</span></div>
  </div>
</script>
<!-- 表格-我们的品 -->
<script type="text/html" id="nanningchooseprod_ourInfoTpl">
  <div class="align-left">
    <div><a href="{{d.purchaseUrl}}" target="_blank">采购链接</a></a></div>
    <div>父SKU: {{d.pSku || ''}}</div>
    <div>采购成本(￥): {{d.purchasePrice || ''}}</div>
    <div>毛重(g): {{d.grossWeight || ''}}</div>
    <div>{{d.cnTitle || ''}}</div>
  </div>
</script>
<!-- 表格-我们定价 -->
<script type="text/html" id="nanningchooseprod_ourPriceTpl">
  <div class="align-left">
    <div>售价({{ d.site == '泰国' ? 'THB':'VND'}}): {{d.salePrice || ''}}</div>
    <div>毛利(￥): {{d.grossProfit || ''}}</div>
    <div>毛利率(%): {{d.grossRate || ''}}</div>
  </div>
</script>
<!-- 表格-人员 -->
<script type="text/html" id="nanningchooseprod_personTpl">
  <div class="align-left">
    <div>开发专员: {{d.bizzOwner || ''}}</div>
    <div>销售专员: {{d.salerNameString || ''}}</div>
    <div>销售主管: {{d.managerNameString || ''}}</div>
    <div>创建人: {{d.creator || ''}}</div>
  </div>
</script>
<!-- 表格-选品思路 -->
<script type="text/html" id="nanningchooseprod_devthinkTpl">
  <div class="align-left">
    <div>选品时间: {{Format(d.createTime || '', 'yyyy-MM-dd hh:mm:ss')}}</div>
    <div>选品方向: {{d.devWay || ''}}</div>
    <div class="elips" title="{{d.devThinking || ''}}"><span>选品思路:</span> <span class="turn-line">{{d.devThinking || ''}}</span></div>
    <div class="elips" title="{{d.devNote || ''}}"><span>开发备注:</span> <span class="turn-line">{{d.devNote || ''}}</span></div>
  </div>
</script>
<!-- 表格-组长审核结果 -->
<script type="text/html" id="nanningchooseprod_leaderAuditTpl">
  <div class="align-left">
    <div>
      {{# if(d.leaderAuditResult != '审核成功' && d.leaderAuditResult != '审核失败'){ }}
      <span>{{d.leaderAuditResult}}</span>: {{Format(d.leaderAuditTime || '', 'yyyy-MM-dd hh:mm:ss')}}
      {{# }else{  }}
      <span class="{{d.leaderAuditResult == '审核成功'? 'green':'red'}}">{{d.leaderAuditResult}}</span>: {{Format(d.leaderAuditTime || '', 'yyyy-MM-dd hh:mm:ss')}}
      {{# } }}
    </div>
    <div class="elips-remark" title="{{d.leaderNote || ''}}">组长备注: <span class="turn-line">{{d.leaderNote || ''}}</span></div>
  </div>
</script>
<!-- 表格-主管审核结果 -->
<script type="text/html" id="nanningchooseprod_managerAuditTpl">
  <div class="align-left">
    <div>
      {{# if(d.managerAuditResult != '审核成功' && d.managerAuditResult != '审核失败'){ }}
      <span>{{d.managerAuditResult}}</span>: {{Format(d.managerAuditTime || '', 'yyyy-MM-dd hh:mm:ss')}}
      {{# }else{ }}
      <span class="{{d.managerAuditResult == '审核成功'? 'green':'red'}}">{{d.managerAuditResult}}</span>: {{Format(d.managerAuditTime || '', 'yyyy-MM-dd hh:mm:ss')}}
      {{# } }}
    </div>
    <div class="elips-remark" title="{{d.managerNote || ''}}">主管备注: <span class="turn-line">{{d.managerNote || ''}}</span></div>
  </div>
</script>
<!-- 表格-操作 -->
<script type="text/html" id="nanningchooseprod__editBar">
 <div class="align-left">
  <permTag:perm funcCode="nanningchooseprod_editPerm">
  <span class="layui-btn layui-btn-xs" lay-event="edit">详情</span><br/>
  </permTag:perm>
  <permTag:perm funcCode="nanningchooseprod_leaderPerm">
  <span class="layui-btn layui-btn-xs" lay-event="leader">组长审核</span><br/>
  </permTag:perm>
  <permTag:perm funcCode="nanningchooseprod_managerPerm">
  <span class="layui-btn layui-btn-xs" lay-event="manager">主管审核</span><br/>
  </permTag:perm>
   <permTag:perm funcCode="nanningchooseprod_rePublishPerm">
     {{# if (d.leaderAuditResult === '审核失败' || d.managerAuditResult === '审核失败') {}}
   <span class="layui-btn layui-btn-xs" lay-event="rePublish">重新发布</span>
     {{# } }}
   </permTag:perm>
 </div>
</script>


<!-- 采购状态弹框 -->
<script type="text/html" id="nanningchooseprodPurchaseStatus">
  <form class="layui-form p20" autocomplete="off">
    <div class="layui-form-item">
      <label class="layui-form-label"><font color="red">*</font>采购状态</label>
      <div class="layui-input-block">
        <input type="radio" name="purchaseStatus" value="已采购" title="已采购" checked>
        <input type="radio" name="purchaseStatus" value="未采购" title="未采购">
      </div>
    </div>
  </form>
</script>

<!-- 组长审核弹框 -->
<script type="text/html" id="nanningchooseprodLeaderAudit">
  <form class="layui-form p20" autocomplete="off">
    <div class="layui-form-item">
      <label class="layui-form-label"><font color="red">*</font>审核结果</label>
      <div class="layui-input-block">
        <input type="radio" name="leaderAuditResult" value="审核成功" title="审核成功" checked>
        <input type="radio" name="leaderAuditResult" value="审核失败" title="审核失败">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label"><font color="red">*</font>组长备注</label>
      <div class="layui-input-block">
        <textarea name="leaderNote" class="layui-textarea"></textarea>
      </div>
    </div>
  </form>
</script>

<!-- 主管审核弹框 -->
<script type="text/html" id="nanningchooseprodManagerAudit">
  <form class="layui-form p20" autocomplete="off">
    <div class="layui-form-item">
      <label class="layui-form-label"><font color="red">*</font>审核结果</label>
      <div class="layui-input-block">
        <input type="radio" name="managerAuditResult" value="审核成功" title="审核成功" checked>
        <input type="radio" name="managerAuditResult" value="审核失败" title="审核失败">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">分配销售专员</label>
      <div class="layui-input-block">
        <select name="devChooseProdSalerList" id="nanningchooseprodManagerAudit_devChooseProdSalerList"  xm-select="nanningchooseprodManagerAudit_devChooseProdSalerList"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal">
        </select>
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">分配销售主管</label>
      <div class="layui-input-block">
        <select name="devChooseProdManagerList" id="nanningchooseprodManagerAudit_devChooseProdManagerList" xm-select="nanningchooseprodManagerAudit_devChooseProdManagerList"
        xm-select-search
        xm-select-search-type="dl"
        xm-select-skin="normal">
        </select>
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label"><font color="red">*</font>主管备注</label>
      <div class="layui-input-block">
        <textarea name="managerNote" class="layui-textarea"></textarea>
      </div>
    </div>
  </form>
</script>

<!-- 新增/编辑选品信息 -->
<script type="text/html" id="nanningchooseprodAddAndEditLayer">
  <form class="layui-form p20" id="nanningchooseprodAddAndEditLayerForm" autocomplete="off"></form>
</script>
<script type="text/html" id="nanningchooseprodAddAndEditLayerFormTpl">
  {{# if(d.id){ }}
  <input type="hidden" name="id" value="{{d.id}}">
  {{# } }}
  <div class="layui-form-item">
    <label class="layui-form-label"><font color="red">*</font>站点</label>
    <div class="layui-input-block">
      <input type="radio" name="site" value="泰国" title="泰国" lay-filter="nanningchooseprodAddAndEditLayerFormRadio" {{d.site=='泰国'?'checked':''}}>
      <input type="radio" name="site" value="越南" title="越南" lay-filter="nanningchooseprodAddAndEditLayerFormRadio" {{d.site=='越南'?'checked':''}}>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label"><font color="red">*</font>虾皮类目</label>
    <div class="layui-input-block">
      <input type="text" name="shopeeCategory" value="{{d.shopeeCategory||''}}" class="layui-input required">
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label"><font color="red">*</font>竞品链接</label>
    <div class="layui-input-block" style="display: flex;">
      <input type="text" name="compUrl" value="{{d.compUrl||''}}" class="layui-input required link">
      <div style="width:134px;">
        <span class="layui-btn layui-btn-sm layui-btn-normal auto-jump">跳转</span>
        <span class="layui-btn layui-btn-sm paste-info">粘贴信息</span>
      </div>
    </div>
  </div>
  <div class="layui-form-item layui-col-lg12 layui-col-mg12">
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>竞品售价(<span class="auto-currency">{{d.site=='泰国' ? 'THB' : 'VND'}}</span>)</label>
      <div class="layui-input-block">
        <input type="text" name="compPrice" value="{{d.compPrice||''}}" class="layui-input required">
      </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>竞品30天销量</label>
      <div class="layui-input-block">
        <input type="text" name="comp30sales" value="{{d.comp30sales||''}}" class="layui-input required">
      </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>竞品上架时间</label>
      <div class="layui-input-block">
        <input type="text" name="compListingTime" value="{{d.compListingTime||''}}" class="layui-input required">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label"><font color="red">*</font>竞品图片</label>
    <div class="layui-input-block fullImg">
      <div in='innerImage' style="width: 150px;height:150px;" contenteditable="true" id="nanningchooseprod_layer_img_container" src="{{d.compImgUrl || ''}}" class="img_show_hide">
      </div>
      {{# if(d.compImgUrl){ }}
      <img src="{{d.compImgUrl}}" id="nanningchooseprod_layer_img">
      {{# }else{ }}
      <img id="nanningchooseprod_layer_img">
      {{# } }}
    </div>
  </div>
  <div class="layui-form-item layui-col-lg12 layui-col-mg12">
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label">父SKU</label>
      <div class="layui-input-block">
        <input type="text" name="pSku" value="{{d.pSku||''}}" class="layui-input">
      </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>采购成本(￥)</label>
      <div class="layui-input-block">
        <input type="text" name="purchasePrice" value="{{d.purchasePrice||''}}" class="layui-input required">
      </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>毛重(g)</label>
      <div class="layui-input-block">
        <input type="text" name="grossWeight" value="{{d.grossWeight||''}}" class="layui-input required">
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label"><font color="red">*</font>采购链接</label>
    <div class="layui-input-block" style="display: flex;">
      <input type="text" name="purchaseUrl" value="{{d.purchaseUrl || ''}}" class="layui-input required link">
      <span class="layui-btn layui-btn-sm layui-btn-normal auto-jump">跳转</span>
    </div>
  </div>
  <div class="layui-form-item layui-col-lg12 layui-col-mg12">
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>我们售价(<span class="auto-currency">{{d.site=='泰国' ? 'THB' : 'VND'}}</span>)</label>
      <div class="layui-input-block" style="display: flex;">
        <input type="text" name="salePrice" value="{{d.salePrice||''}}" class="layui-input required">
        <span class="layui-btn layui-btn-sm set-price">定价</span>
      </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>毛利率(%)</label>
      <div class="layui-input-block">
        <input type="number" name="grossRate" value="{{d.grossRate||''}}" class="layui-input required">
      </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>毛利(￥)</label>
      <div class="layui-input-block">
        <input type="text" name="grossProfit" value="{{d.grossProfit||''}}" class="layui-input required">
      </div>
    </div>
  </div>
  <div class="layui-form-item layui-col-lg12 layui-col-mg12">
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>选品方向</label>
      <div class="layui-input-block">
        <input type="text" name="devWay" value="{{d.devWay||''}}" class="layui-input required">
      </div>
    </div>
    <div class="layui-col-md4 layui-col-lg4">
      <label class="layui-form-label"><font color="red">*</font>开发专员</label>
      <div class="layui-input-block">
        <select name="bizzOwnerId" class="required">
          <option value="">请选择</option>
          {{# layui.each(d.bizzOwnerList, function(index, item){ }}
          <option value="{{item.id}}" {{item.id==d.bizzOwnerId?'selected':''}}>{{item.userName}}</option>
          {{# }); }}
        </select>
      </div>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label"><font color="red">*</font>选品思路</label>
    <div class="layui-input-block">
      <textarea name="devThinking" class="layui-textarea required">{{d.devThinking || ''}}</textarea>
    </div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">开发备注</label>
    <div class="layui-input-block">
      <textarea name="devNote" class="layui-textarea">{{d.devNote || ''}}</textarea>
    </div>
  </div>
</script>

<script src="${ctx}/static/UploadImage.js"></script>
<script src="${ctx}/static/js/commodity/packspec/nanningchooseprod.js"></script>

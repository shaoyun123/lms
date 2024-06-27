<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<title>采样需求</title>
<style>
  .purchaseUrlBox {
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    word-break: break-word;
  }
  .text-tag {
    display: inline-block;
    padding: 0px 5px;
    height: 20px;
    line-height: 20px;
    background: rgb(30,144,255);
    color: #fff;
    border-radius: 4px;
    margin-right: 10px;
  }
  .text-success-tag {
    background: rgb(95, 184, 120);
  }
  .text-danger-tag {
    background: rgb(255, 87, 34);
  }
  .text-orange-tag {
    background: rgb(255, 184, 0);
  }
</style>


<div class="layui-fluid">
    <div class="layui-row layui-col-space15">
        <div class="layui-col-lg12 layui-col-md12">
            <!-- 搜索条件 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <form class="layui-form" id="purchaseDemand_form" method="post" lay-filter="purchaseDemand_form">
                        <div class="layui-form-item">
                          <div class="layui-col-md2 layui-col-lg2">
                            <label class="layui-form-label">需求时间</label>
                            <div class="layui-input-block">
                                <input type="text" class="layui-input" name="purchaseDemand_createTime"
                                       id="purchaseDemand_createTime" readonly>
                            </div>
                          </div>
                          <div class="layui-col-md2 layui-col-lg2">
                            <label class="layui-form-label">部门</label>
                            <div class="layui-input-block">
                                <select name="organize" lay-filter="productlist_orgs_hp_devPerson" class="orgs_hp_custom" data-id="productlist_orgs_hp_devPerson" lay-search>
                                    <option value=""></option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                            <label class="layui-form-label labelSel">
                                <select name="userType" lay-search>
                                    <option value="bizzOwnerIdList">开发专员</option>
                                    <option value="responsorIdList">责任人</option>
                                </select>
                            </label>
                            <div class="layui-input-block">
                                <select name="userId" class="users_hp_custom"
                                        xm-select="productlist_users_hp_devPerson"
                                        xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                        lay-filter='productlist_users_hp_devPerson'
                                        data-id="productlist_users_hp_devPerson" data-roleList="开发专员">
                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                          <div class="layui-form-label" style="padding: 0 15px">
                              <select name="searchType" lay-search>
                                <option value="pSku">父SKU</option>
                                <option value="sSku">子SKU</option>
                              </select>
                          </div>
                          <div class="layui-input-block" style="display: flex;">
                              <input name="searchValue" style="width:70%" type="text" class="layui-input" placeholder="支持10000个SKU">
                              <input name="switchSearchValue" type="checkbox" lay-skin="switch" lay-text="精确|模糊">
                          </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">组合品</label>
                          <div class="layui-input-block">
                            <select name="isCombination" lay-search>
                                <option value=""></option>
                                <option value="true">是</option>
                                <option value="false">否</option>
                            </select>
                        </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">开发备注</label>
                          <div class="layui-input-block" style="display: flex;">
                            <input
                                type="text"
                                name="samplingNoteLike"
                                id="samplingNoteLike"
                                class="layui-input"
                                style="position: absolute; z-index: 2; width: 80%"
                                placeholder="请选择"
                                autocomplete="off"
                              />
                              <select
                                name="hasSamplingNote"
                                lay-search
                                lay-filter="hasSamplingNote"
                              >
                                <option value="">请选择</option>
                                <option value="true">有</option>
                                <option value="false">无</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">采购专员</label>
                          <div class="layui-input-block">
                              <select name="buyerId"
                                  xm-select="productlist_users_hp_buyer"
                                  xm-select-search xm-select-search-type="dl" xm-select-skin="normal"
                                  lay-filter='productlist_users_hp_buyer'>
                              </select>
                          </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">商品状态</label>
                          <div class="layui-input-block">
                            <select name="ifSale" lay-search>
                              <option value=""></option>
                              <option value="true">在售</option>
                              <option value="false">停售</option>
                          </select>
                          </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">采购备注</label>
                          <div class="layui-input-block" style="display: flex;">
                            <input
                                type="text"
                                name="purchaseNoteLike"
                                id="purchaseNoteLike"
                                class="layui-input"
                                style="position: absolute; z-index: 2; width: 80%"
                                placeholder="请选择"
                                autocomplete="off"
                              />
                              <select
                                name="hasPurchaseNote"
                                lay-search
                                lay-filter="hasPurchaseNote"
                              >
                                <option value="">请选择</option>
                                <option value="true">有</option>
                                <option value="false">无</option>
                            </select>
                          </div>
                        </div>
                        <div class="layui-col-md2 layui-col-lg2">
                          <label class="layui-form-label">排序方式</label>
                          <div class="layui-input-block">
                            <select name="orderType" lay-filter="orderType" lay-search>
                                <option value="1">需求时间倒序</option>
                                <option value="2">需求时间正序</option>
                            </select>
                        </div>
                        </div>
                          <div class="layui-col-md2 layui-col-lg2">
                              <div class="layui-input-block">
                                  <span class="layui-btn layui-btn-sm keyHandle layui-btn-normal" lay-submit lay-filter="purchaseDemand_submit">查询</span>
                                  <button class="layui-btn layui-btn-sm layui-btn-primary" type="reset">清空</button>
                              </div>
                          </div>
                          <input type="hidden" name="purchaseDemand_dealType" value="待采购">
                        </div>
                    </form>
                </div>
            </div>
            <div class="layui-card">
                <div class="layui-card-header toFixedContain">
                    <div style="float:left;">
                        <ul class="layui-tab-title fl" lay-filter="purchaseDemand_Tab" id="purchaseDemand_Tab">
                            <li class="layui-this tab_purchaseDemand" data-code="待采购">待采购</li>
                            <li class="tab_purchaseDemand" data-code="已采购">已采购</li>
                            <li class="tab_purchaseDemand" data-code="无需采购">无需采购</li>
                            <li class="tab_purchaseDemand" data-code="">全部</li>
                        </ul>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" style="margin-left: 100px" type="button" id="purchaseDemand_purchase">一键采购
                        </button>
                      </div>
                      <div class="fr">
                        <button class="layui-btn layui-btn-sm layui-btn-normal" type="button" id="addSample_purchasseDemand">
                            新增采样需求
                        </button>
                        <button class="layui-btn layui-btn-sm" id="purchaseDemand_exportBtn" type="button">导出</button>
                    </div>
                </div>

                <div class="layui-card-body">
                    <table class="layui-table" id="purchaseDemandtable"
                           lay-filter="purchaseDemand_tableFilter"></table>
                </div>
            </div>
        </div>
    </div>
</div>

<script type="text/html" id="purchaseDemand_table_img">
  {{#  if(d.image){ }}
    <img width="60" height="60" class="b1 img_show_hide" src="{{d.image}}" onerror="layui.admin.img_noFind()">
  {{# } else { }}
    <img width="60" height="60" data-original="${ctx}/static/img/kong.png"  class="pointHand b1 lazy" data-onerror="layui.admin.img_noFind()"/>
    {{# } }}
</script>

<script type="text/html" id="purchaseDemand_table_sku">
  {{d.prodSSku || ''}} 
  {{# if(d.isCombination){ }}
  <span class="combination-tag"> 组 </span>
{{# } }}<br/>
  {{# if(d.prodPSku){ }}
  <span style="color: grey">父: </span>{{ d.prodPSku }}
  {{# } }}
  
</script>
<script type="text/html" id="purchaseDemand_table_sku_status">
  <input type="checkbox" lay-skin="primary" disabled {{ d.ifSale ? 'checked' : '' }}><br>
</script>

<script type="text/html" id="purchaseDemand_table_url">
  <div class="purchaseUrlBox">
    <a href="{{d.purchaseUrl}}" target="_blank" style="color:cornflowerblue">{{d.purchaseUrl || ''}}</a></div>
</script>

<script type="text/html" id="purchaseDemand_table_status">
  {{#  layui.each(d.purchaseNoAndStatus, function(index, item){ }}
    <div>
      {{item.purchaseNo}}<br>
      {{# if(item.status === '未审核'){ }}
        <span class="text-tag">未审核</span>
      {{# } }}
      {{# if(item.status === '已审核'){ }}
        <span class="text-tag text-success-tag">已审核</span>
      {{# } }}
      {{# if(item.status === '废弃'){ }}
        <span class="text-tag text-danger-tag">废弃</span>
      {{# } }}
      {{# if(item.status === '已归档'){ }}
        <span class="text-tag text-orange-tag">已归档</span>
      {{# } }}
    </div>
  {{# }) }}
</script>

<script type="text/html" id="purchaseDemand_table_time">
  {{ Format( d.createTime, "yyyy-MM-dd hh:mm:ss")}} <br/>
</script>

<%-- 工具栏 --%>
<script type="text/html" id="purchaseDemand_tableIdBar">
    {{# if(d.processStatus === '待采购'){ }}
    <a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="purchaseDemand_del">删除</a><br />
    {{#} }}
    <span>
      <a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="purchaseDemand_log">日志</a>
    </span>
</script>

<script type="text/html" id="purchaseDemand_log_tpl">
    <div style="padding:20px">
        <table class="layui-table" id="fpurchaseDemand_log_table" lay-filter="fpurchaseDemand_log_table">
        </table>
    </div>
</script>
<%-- 引入js文件 --%>
<%@ include file="/WEB-INF/view/jsp/commodity/template/addSampleInfo.jsp" %>

<script>
    //模块引入 类似于 requirejs
layui.use(['admin', 'form', 'table', 'layer', 'laydate'], function () {
    var admin = layui.admin,
      form = layui.form,
      table = layui.table,
      layer = layui.layer,
      laydate = layui.laydate
    form.render('select')
    //日期时间选择器
    laydate.render({
      elem: '#purchaseDemand_createTime',
      type: 'datetime',
      inputAuto: true,
      range: true,
      showShortcuts: true,
    })
    form.render('checkbox')
    render_hp_orgs_users("#purchaseDemand_form");
    getBuyerList()

    // 获取采购专员
    function getBuyerList() {
      commonReturnPromise({
        type: 'post',
        url: '/lms/newProductSampling/listAllBuyer',
        contentType: 'application/json'
      }).then(res => {
        appendSelect($('#purchaseDemand_form').find('select[name="buyerId"]'), res || [], 'id', 'userName')

      }).catch(err => {
          layer.msg(err || '操作失败', { icon: 2 });
      });
    }
  
    var purchaseDemandName = {
      getColByDealType: function (dealType) {
        switch (dealType) {
          case '待采购':
          case '无需采购': 
            return [{ type: 'checkbox' },
              { title: '图片', templet: '#purchaseDemand_table_img',width: 100 },
              { title: '商品SKU', templet: '#purchaseDemand_table_sku' }, 
              { title: '在售', templet: '#purchaseDemand_table_sku_status', width: 40 }, 
              { field: 'title', title: '商品名称' }, 
              { title: '采购链接', templet: '#purchaseDemand_table_url', width: 200 }, 
              { field: 'purchasePrice', title: '采购单价（￥）' }, 
              { field: 'purchaseNum', title: '采购数量（可编辑）', edit:'text' }, 
              { field: 'cost', title: '采购金额（￥）' }, 
              { field: 'samplingNote', title: '开发备注（可编辑）', edit:'text' }, 
              { field: 'devPerson', title: '开发专员' },
              { field: 'buyer', title: '采购专员' },
              { field: 'purchaseNote', title: '采购备注（可编辑）', edit:'text' }, 
              { field: 'createTime', title: '需求时间', templet: '#purchaseDemand_table_time' },
              { title: '操作', align: 'center', toolbar: '#purchaseDemand_tableIdBar', width: 80 }
            ]
          case '已采购': 
          case '':
            return [{ type: 'checkbox' },
            { title: '图片', templet: '#purchaseDemand_table_img',width: 100 },
            { title: '商品SKU', templet: '#purchaseDemand_table_sku' }, 
            { title: '在售', templet: '#purchaseDemand_table_sku_status', width: 50 }, 
            { field: 'title', title: '商品名称' }, 
            { title: '采购链接', templet: '#purchaseDemand_table_url', width: 200 }, 
            { field: 'purchasePrice', title: '采购单价（￥）' }, 
            { field: 'purchaseNum', title: '采购数量' }, 
            { field: 'cost', title: '采购金额（￥）' }, 
            { field: 'samplingNote', title: '开发备注（可编辑）', edit:'text' }, 
            { field: 'devPerson', title: '开发专员' },
            { field: 'buyer', title: '采购专员' }, 
            { field: 'purchaseNote', title: '采购备注（可编辑）', edit:'text' }, 
            { field: 'purchaseNo', title: '采购单号', width: 180, templet: '#purchaseDemand_table_status' },
            { field: 'createTime', title: '需求时间', templet: '#purchaseDemand_table_time' },
            {title: '操作', align: 'center', toolbar: '#purchaseDemand_tableIdBar', width: 80 }
          ]
        }
      },
      
      getSerachData: function(data) {
        let time = data.purchaseDemand_createTime.split(' - ')
        let obj = {
          createTimeStart: time[0] || '',
          createTimeEnd: time[1] || '',
          bizzOwnerIdList: [], // 开发专员id
          responsorIdList: [], // 责任归属人id
          processStatus: data.purchaseDemand_dealType,
          orderType: data.orderType,
          purchaseNoteLike: data.purchaseNoteLike,
          hasSamplingNote: data.hasSamplingNote,
          samplingNoteLike: data.samplingNoteLike,
          hasPurchaseNote: data.hasPurchaseNote,
          isCombination: data.isCombination,
          buyerIdList: data.buyerId ? data.buyerId?.split(',') : [],
          ifSale: data.ifSale
        } 
        if (data.organize || data.userId) {
          if (data.userId) { // 如果选了人，则只查询这个人的。
              obj[data.userType] = data.userId.split(',')
          } else { // 如果选了部门没选人，则查询整个部门的
            let userIdList = []
            let elem = $('#purchaseDemand_form').find('[name=userId]')
            if (elem.hasClass('xm-hide-input')) {
                elem = elem.closest('.xm-select-parent').prev('select[xm-select]')
                userIdList = elem.attr('user_ids').split(',')
            } else {
                let options = elem.find('option')
                let value
                for (let i = 0; i < options.length; ++i) {
                  value = options[i].getAttribute('value')
                  if (value) {
                      userIdList.push(parseInt(value))
                  }
                }
            }
            obj[data.userType] = userIdList
          }
        }
  
        let seachValueList = data.searchValue ? data.searchValue?.split(',') : []
        if (seachValueList.length > 0) {
          if (data.switchSearchValue === 'on') { // 精确
            if (data.searchType === 'sSku') {
              obj.sSkuDetailList = seachValueList
            }
            if (data.searchType === 'pSku') {
              obj.pSkuDetailList = seachValueList
            }
          } else {
            if (data.searchType === 'sSku') {
              obj.sSkuLikeList = seachValueList
            }
            if (data.searchType === 'pSku') {
              obj.pSkuLikeList = seachValueList
            }
          }
        }
        return obj
      },
  
      tableRender: function (data) {
        let _this = this
        let obj = _this.getSerachData(data)
        let cols = _this.getColByDealType(data.purchaseDemand_dealType)
        if (data.purchaseDemand_dealType === '待采购') {
          $('#purchaseDemand_purchase').show()
        } else {
          $('#purchaseDemand_purchase').hide()
        }
        table.render({
          elem: '#purchaseDemandtable',
          method: 'post',
          contentType: 'application/json',
          url: ctx + '/newProductSampling/queryPurNewProductSampling',
          where: obj,
          cols: [
            cols
          ],
          page: true,
          id: 'purchaseDemandtable',
          limits: [50, 100, 300],
          limit: 50,
          done: function () {
            //监听操作的处理按钮
            _this.watchBar()
            //表头固定
            $('#purchaseDemandtable').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
           
          }
        })
      },
  
      watchBar: function () {
        var _this = this
        // 删除
        table.on('tool(purchaseDemand_tableFilter)', function (obj) {
          if (obj.event == 'purchaseDemand_del') {
            commonReturnPromise({
              type: 'post',
              url: '/lms/newProductSampling/deletePurNewProductSampling',
              params: JSON.stringify({id: obj.data.id}),
              contentType: 'application/json'
            }).then(res => {
                layer.msg('删除成功')
                $('[lay-filter=purchaseDemand_submit]').trigger('click')
            }).catch(err => {
                layer.msg(err, { icon: 2 });
            });
          }
          if (obj.event == 'purchaseDemand_log') {
            layer.open({
              type: 1,
              title: '日志',
              area: ['700px', '450px'],
              content: $('#purchaseDemand_log_tpl').html(),
              btn: ['关闭'],
              success: function (index, layero) {
                  table.render({
                      elem: "#fpurchaseDemand_log_table",
                      id: "fpurchaseDemand_log_table",
                      method: 'post',
                      url: ctx + "/newProductSampling/queryPurNewProductSamplingLogBySamplingId",
                      where: { id: obj.data.id },
                      contentType: 'application/json',
                      cols: [
                        [
                          {
                              title: "时间",
                              width: 150,
                              templet: '<div>{{format(d.createTime, "yyyy-MM-dd hh:mm:ss")}}</div>'
                          },
                          {field: "creator", title: "操作人", width: 100 },
                          {field: "operType", title: "操作类型"},
                          {field: "operLog", title: "操作详情"}
                        ]
                      ],
                      page: false,
                      limit: 10000
                  });
              }, yes: function (index, layero) {
                  layer.close(index);
              }
          });
          }
        })
      },
  
      batchHandle: function () {
        var _this = this
        // 一键采购
        $('#purchaseDemand_purchase').on('click', function () {
          var datas = table.checkStatus('purchaseDemandtable').data
          if (!datas.length) {
            layer.msg('请先选中需要处理的数据')
            return false
          }
          var idsArr = []
          for (var i = 0; i < datas.length; i++) {
            var data = datas[i]
            idsArr.push(data.id)
          }
          commonReturnPromise({
            type: 'post',
            url: '/lms/newProductSampling/fastCreatePurOrder',
            params: JSON.stringify({idList: idsArr}),
            contentType: 'application/json'
          }).then(res => {
            layer.msg('操作成功')
            $('[lay-filter=purchaseDemand_submit]').trigger('click')
          }).catch(err => {
              layer.msg(err || '操作失败', { icon: 2 });
          });
        })
  
        // 新增采样需求
        $('#addSample_purchasseDemand').on('click', function() {
          // 同新品开发补充采样信息弹窗
          addSampleInfo('purchaseDemand')
        })
      }
    }
    
    form.on("select(hasSamplingNote)", function (data) {
      let val = data.value === 'true' ? '有' : data.value === 'false' ? '无' : ''
      $("#samplingNoteLike").val(val);
    });

    form.on("select(hasPurchaseNote)", function (data) {
      let val = data.value === 'true' ? '有' : data.value === 'false' ? '无' : ''
      $("#purchaseNoteLike").val(val);
    });
    //监听表单的提交事件
    form.on('submit(purchaseDemand_submit)', function (data) {
      var data = data.field //获取到表单提交对象
  
      let type = $('#purchaseDemand_form [name=switchSearchValue]').prop('checked')
      if (data.searchValue.includes(',') && type == false) {
        return layer.msg('多个SKU仅支持精确查询', {icon:7})
      }
      if (data.searchValue.split(",").length > 10000) {
        return layer.msg('SKU最多支持10000个', {icon:7})
      }
      loading.show()
      purchaseDemandName.tableRender(data)//渲染表格
      return false
    })

    // 修改采购数量和开发备注
    table.on('edit(purchaseDemand_tableFilter)', function(obj) {
      let value = obj.value, //得到修改后的值,
          data = obj.data, //得到所在行所有键值
          field = obj.field; //得到字段
      let ajax = new Ajax()
      let Adata = {
          id: data.id
      }
      Adata[field] = value
      if (Adata.purchaseNum === '') {
        return layer.msg('采购数量不能为空')
      }
      ajax.post({
        url: ctx + "/newProductSampling/editPurNewProductSampling",
        data: JSON.stringify(Adata),
        contentType: 'application/json',
        success: function(data) {
          if (data.code === '0000') {
            layer.msg('修改成功')
          }
          $('[lay-filter=purchaseDemand_submit]').trigger('click')
        },
        error: function(err) {
          console.log(err)
        }
      })
    })
  
    // 触发搜索按钮
    $('[lay-filter=purchaseDemand_submit]').trigger('click')
     //监听批量操作
     purchaseDemandName.batchHandle()
  
    $('.tab_purchaseDemand').click(function () {
      $('#purchaseDemand_form [name=purchaseDemand_dealType]').val(this.getAttribute('data-code'))

      $('[lay-filter=purchaseDemand_submit]').trigger('click')
    })
  
    // 导出
    $('#purchaseDemand_exportBtn').on('click', () => {
      // 获取勾选的数据
      let checkStatus = table.checkStatus('purchaseDemand_table')
      let list = checkStatus.data;
      let idList = list?.map(item => item.id)
      if (idList.length > 0) {
        tip = '确认导出选择的' + idList.length + '个采样需求信息吗?'
      } else {
        tip = '确认导出当前搜索条件下的采样需求信息?'
      }
  
      let data = serializeObject($('#purchaseDemand_form'))
      params = purchaseDemandName.getSerachData(data)
      var Confirmindex = layer.confirm(tip, { btn: ['确认', '取消'] }, function() {
        submitForm(params, ctx + '/newProductSampling/exportPurNewProductSampling', '_blank')
        layer.close(Confirmindex);
      })
    })
  })
</script>
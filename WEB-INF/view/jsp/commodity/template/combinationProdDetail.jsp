<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

  <style>
    #newdevdetail_compList_editTbody td {
      padding: 5px;
      text-align: center
    }

    #newdevdetail_detail_fbaProdTbody td {
      padding: 5px;
      text-align: center;
    }

    .lineHeight36 {
      line-height: 36px;
      padding-left: 10px;
    }

    /* 自定义禁用状态下的文字颜色 */

    #devType .layui-select-disabled .layui-select-title input,
    #devType .layui-select-disabled .layui-select-title div {
      color: #666 !important;
      /* 设置你想要的颜色值 */
    }
  </style>
  <!-- 新增组合品 -->
  <script type="text/html" id="addGroupListLayer">
  <div class="p20">
      <div class="layui-tab layui-tab-card">
          <ul class="layui-tab-title isCreateHidden">
              <li class="layui-this">详情</li>
              <li>操作日志</li>
          </ul>
          <div class="layui-tab-content">
              <div class="layui-tab-item layui-show p20">
                  <form action="" lay-filter="component-form-group" class="layui-form" id="addCombForm">
                      <div class="layui-form-item pora">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">商品父SKU</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="prodPSku" class="layui-input">
                                  <ul class="supplierUl productlistSearch"></ul>
                                  <input type="hidden" name="pId" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">开发专员</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="bizzOwner" class="layui-input" disabled
                                         placeholder="根据父关联">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">责任人</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="responsor" class="layui-input" disabled
                                         placeholder="根据父关联">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">新类目</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="newCate" class="layui-input" placeholder="根据父关联" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">旧类目</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="cate" class="layui-input" placeholder="根据父关联" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">商品标签</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="tags" class="layui-input" placeholder="根据父关联" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">开发管理类目</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="devCate" class="layui-input" placeholder="根据父关联"
                                         disabled>
                              </div>
                          </div>
                      </div>
                      <hr class="layui-bg-gray">
                      <input type="hidden" name="id">
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">组合子SKU</label>
                              <div class="layui-input-block" style="display:flex;align-items:center;">
                                  <input type="text" name="sSku" class="layui-input" maxlength="16" id="productlist_sSkuInputBind">
                                  <span><span id="productlist_inputBindCount">0</span>/16</span>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">产品简称</label>
                              <div class="layui-input-block">
                                  <input type="text" name="purchaseChannel" class="layui-input" maxlength="6" onblur="productlist_getCustomCode(this)">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">材质</label>
                              <div class="layui-input-block">
                                  <input type="text" name="material" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">海关编码</label>
                              <div class="layui-input-block">
                                  <input type="text" name="customsCode" class="layui-input">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item" notNull>
                          <div class="layui-col-md12 layui-col-lg12">
                              <label class="layui-form-label ">商品名称</label>
                              <div class="layui-input-block">
                                  <input type="text" name="title" class="layui-input">
                              </div>
                          </div>
                      </div>
                      <%--<div class="layui-form-item">--%>
                      <%--<label class="layui-form-label">商品标签</label>--%>
                      <%--<div class="layui-input-block">--%>
                      <%--<input type="text" id="tags_comb2" class="layui-input" placeholder="继承父的,值展示,无法修改">--%>
                      <%--</div>--%>
                      <%--</div>--%>
                      <hr class="layui-bg-gray">
                      <div class="layui-form-item pora" style="padding-left:25px">
                          <p>组合明细</p>
                          <p style="position:absolute;top:-5px;right:10px">
                              <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" id="addAline">
                                  添加一行
                              </button>
                          </p>
                          <table class="layui-table" id="groupTable">
                              <thead>
                              <tr>
                                  <th width="80%">商品子SKU<font color="red">*</font></th>
                                  <th>数量<font color="red">*</font></th>
                                  <th>操作</th>
                              </tr>
                              </thead>
                              <tbody>

                              </tbody>
                          </table>
                      </div>
                      <hr class="layui-bg-gray">
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">物流属性</label>
                              <div class="layui-input-block" style="width:858px" id="logisAttr_comb">
                                  <!-- <c:forEach items="${logisAttrList}" var="logisAttr">
                                      <%--<c:if test="${logisAttr.name != '普货'}">--%>
                                          <input type='checkbox' lay-skin='primary' name='logisAttrList' title='${logisAttr.name}' value='${logisAttr.name}' disabled>
                                      <%--</c:if>--%>
                                  </c:forEach> -->
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">商品净重(g)</label>
                              <div class="layui-input-block">
                                  <input type="text" name="suttleWeight" class="layui-input" placeholder="根据组合明细计算，不可修改" readonly>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label ">包装规格</label>
                              <div class="layui-input-block">
                                  <select name="packSpecification" id="packspectag_comb"
                                          lay-filter="packspectag_comb" lay-search>
                                      <option value="">请选择</option>
                                      <c:forEach items="${packSpecList}" var="packSpec">
                                          <option value='${packSpec.id}' cost='${packSpec.unitCost}'
                                                  weight='${packSpec.weight}'>${packSpec.name}</option>
                                      </c:forEach>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">含包装重量(g)</label>
                              <div class="layui-input-block">
                                  <input type="text" class="layui-input" id="totalWeight_comb" placeholder="根据组合明细计算，不可修改" readonly>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">入库要求</label>
                              <div class="layui-input-block">
                                  <input type="text" name="packDesc" class="layui-input">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">采购成本价(¥)</label>
                              <div class="layui-input-block">
                                  <input type="text" name="purchaseCostPrice" class="layui-input disAbleInp" placeholder="根据组合明细计算，不可修改" readonly>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">内包装成本(¥)</label>
                              <div class="layui-input-block">
                                  <input type="text" name="innerPackCost" class="layui-input disAbleInp" placeholder="根据组合明细计算，不可修改">
                                  <input type="hidden" name="packWeight" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">包装难度</label>
                              <div class="layui-input-block">
                                  <input type="text" name="packDifficulty" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">默认发货库</label>
                              <div class="layui-input-block">
                                  <select name="defaultDlvrWhId" id="wareHouseTag_comb" lay-search>
                                      <c:forEach items="${wareHouseList}" var="wareHouse">
<%--                                            <option value="${wareHouse.id}">${wareHouse.warehouseName}</option>--%>
                                          <option value="${wareHouse.id}" ${wareHouse.storeType ==1 and wareHouse.isDefault ? 'selected' : ''}>${wareHouse.warehouseName}</option>
                                      </c:forEach>
                                  </select>
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">销售状态</label>
                              <div class="layui-input-block">
                                  <input type="checkbox" name="isSale" lay-skin="primary" title="停售" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label ">库存状态</label>
                              <div class="layui-input-block">
                                  <input type="checkbox" name="isOutOfStock" name="like1[read]" lay-skin="primary"
                                         title="缺货" disabled>
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label">外箱长(cm)</label>
                              <div class="layui-input-block">
                                  <input name="outerBoxLength" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label">外箱宽(cm)</label>
                              <div class="layui-input-block">
                                  <input name="outerBoxWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label">外箱高(cm)</label>
                              <div class="layui-input-block">
                                  <input name="outerBoxHeight" oninput="countThrowWeight(this)"  class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label">抛重(g)</label>
                              <div class="layui-input-block">
                                  <input name="throwWeight" class="layui-input" placeholder="根据外箱长宽高计算，不可修改" readonly>
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" >
                              <label class="layui-form-label">商品长(cm)</label>
                              <div class="layui-input-block">
                                  <input name="productLength" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" >
                              <label class="layui-form-label">商品宽(cm)</label>
                              <div class="layui-input-block">
                                  <input name="productWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" >
                              <label class="layui-form-label">商品高(cm)</label>
                              <div class="layui-input-block">
                                  <input name="productHeight" oninput="countThrowWeight(this)"  class="layui-input">
                              </div>
                          </div>
                          <div class="layui-form-item">
                              <div class="layui-col-md3 layui-col-lg3">
                                  <label class="layui-form-label">万邑通长(cm)</label>
                                  <div class="layui-input-block">
                                      <input name="winitLength" class="layui-input" >
                                  </div>
                              </div>
                              <div class="layui-col-md3 layui-col-lg3">
                                  <label class="layui-form-label">万邑通宽(cm)</label>
                                  <div class="layui-input-block">
                                      <input name="winitWidth" class="layui-input" >
                                  </div>
                              </div>
                              <div class="layui-col-md3 layui-col-lg3">
                                  <label class="layui-form-label">万邑通高(cm)</label>
                                  <div class="layui-input-block">
                                      <input name="winitHeight" class="layui-input">
                                  </div>
                              </div>
                          </div>
                          <%--<div class="layui-col-md3 layui-col-lg3">--%>
                              <%--<label class="layui-form-label">压缩高(cm)</label>--%>
                              <%--<div class="layui-input-block">--%>
                                  <%--<input name="compressHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                              <%--</div>--%>
                          <%--</div>--%>
                          <%--<div class="layui-col-md3 layui-col-lg3">--%>
                              <%--<label class="layui-form-label">叠加高(cm)</label>--%>
                              <%--<div class="layui-input-block">--%>
                                  <%--<input name="superpositionHeight" oninput="countThrowWeight(this)"  class="layui-input">--%>
                              <%--</div>--%>
                          <%--</div>--%>
                      </div>
                  </form>
              </div>
              <div class="layui-tab-item p20">
                  <div class="layui-tab layui-tab-brief">
                      <div class="layui-tab-content">
                          <div class="layui-tab-item layui-show">
                              <table class="layui-table">
                                  <thead>
                                  <tr>
                                      <th>时间</th>
                                      <th>描述人</th>
                                      <th>日志</th>
                                  </tr>
                                  </thead>
                                  <tbody id="pl_combLogTbody">
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</script>

  <script>
    //新增组合品弹出框
    function openProdComDetail (data) {
      var popIndex = layer.open({
        title: '组合品详情',
        type: 1,
        area: ['1360px', '80%'],
        id: 'show_combDetailId',
        shadeClose: false,
        btn: ['关闭'],
        content: $('#addGroupListLayer').html(),
        yes: function (index, layero) {
          layer.close(popIndex)
        },
        success: function (layero, index) {
          // 子SKU  不可编辑
          $('#addCombForm [name=sSku]').attr('readonly', 'readonly')
          $('#addCombForm [name=sSku]').addClass('disAbleInp')
          // 初始化必填项
          initNotNull()

          // 监听input输入
          $('#productlist_sSkuInputBind').bind('input propertychange', function () {
            var inputLen = $('#productlist_sSkuInputBind').val().length
            $('#productlist_inputBindCount').text(inputLen)
          })

          //1.初始化父sku事件
          initPSkuEvent('#addCombForm')
          //2. 表格增删
          comb_table()

          // 复现数据
          getCombDetail(data.id)
          getProdLog('getProdOperLog', data.id, '#pl_combLogTbody')
          layui.form.render()
        }
      })
    }


    // 获取一个组合子sku行  complist为子SKU内容
    function newCombObj (complist) {
      if (!complist) {
        complist = {}
      }
      var prodDetailId = complist.prodDetailId ? complist.prodDetailId : ''
      var suttleWeight = complist.suttleWeight ? complist.suttleWeight : ''
      var purchaseCostPrice = complist.purchaseCostPrice ? complist.purchaseCostPrice : ''
      var isSale = complist.isSale != undefined ? complist.isSale : ''
      var sSku = complist.sSku ? complist.sSku : ''
      var prodDetailNums = complist.prodDetailNums ? complist.prodDetailNums : ''
      var logisAttrList = complist.logisAttrList ? complist.logisAttrList : ''
      var id = complist.id ? complist.id : ''
      var isOutOfStock = complist.isOutOfStock != undefined ? complist.isOutOfStock : ''
      var stock = complist.stock ? complist.stock : ''
      var occupyStock = complist.occupyStock ? complist.occupyStock : ''
      var availableStock = complist.availableStock ? complist.availableStock : ''
      var innerPackCost = complist.innerPackCost ? complist.innerPackCost : ''
      //html数组处理
      var tr_arr = '<tr>' +
        '<td><input type="hidden" value="' + prodDetailId + '" weight="' + suttleWeight + '" cost="' + purchaseCostPrice + '" isSale="' + isSale + '" logisAttrList="' + logisAttrList + '" isOutOfStock="' + isOutOfStock + '" stock="' + stock + '" occupyStock="' + occupyStock + '" innerPackCost="' + innerPackCost + '" availableStock="' + availableStock + '" class="layui-input">' +
        '<input type="text" oninput=searchSku(this,"ssku","#addCombForm","#groupTable")  onblur=getSSkuId(this,"#addCombForm","#groupTable") value="' + sSku + '" class="layui-input">' +
        '<ul class="supplierUl productlistSearch"></ul></td>' +
        '<td><input type="text" value="' + prodDetailNums + '" onblur="countCombWeightAndCost(\'#groupTable\',\'#addCombForm\');getTotalWeight(\'#packspectag_comb option:selected\', \'#addCombForm\', \'#totalWeight_comb\')" class="layui-input"></td>' +
        '<td><input type="hidden" value="' + id + '" class="layui-input" disabled><button type="button" class="layui-btn layui-btn-sm layui-btn-primary removeNew">移除</button></td>' +
        '</tr>'
      return tr_arr
    }
    //获取并渲染组合品详情
    function getCombDetail (id) {
      loading.show()
      $.ajax({
        type: 'post',
        url: ctx + '/product/getCombDetail.html',
        dataType: 'json',
        data: { 'id': id },
        success: function (returnData) {
          loading.hide()
          if (returnData.code == '0000') {
            getComLogisAttrList();
            var comb = returnData.data
            $('#addCombForm [data-id=prodPSku]').val(comb.parent.pSku)
            $('#addCombForm [name=pId]').val(comb.parent.id)
            $('#addCombForm [data-id=bizzOwner]').val(comb.parent.bizzOwner)
            $('#addCombForm [data-id=responsor]').val(comb.parent.responsor)
            $('#addCombForm [data-id=tags]').val(comb.parent.prodAttrList)
            $('#addCombForm [data-id=newCate]').val(comb.newCate && comb.newCate.cateName ? comb.newCate.cateName : '')
            $('#addCombForm [data-id=cate]').val(comb.cateDto.cateCnName)
            $('#addCombForm [data-id=devCate]').val(comb.cateDto.mgmtName)
            $('#addCombForm [name=\'id\']').val(comb.id)
            $('#addCombForm [name=\'sSku\']').val(comb.sSku)
            $('#productlist_inputBindCount').text(comb.sSku.length)
            $('#addCombForm [name=\'title\']').val(comb.title)
            $('#addCombForm [name=\'suttleWeight\']').val(comb.suttleWeight)
            $('#addCombForm [name=\'packDifficulty\']').val(comb.packDifficulty)
            $('#addCombForm [name=\'purchaseCostPrice\']').val(comb.purchaseCostPrice)
            $('#addCombForm [name=\'defaultDlvrWhId\']').val(comb.defaultDlvrWhId)
            $('#addCombForm [name=\'isSale\']').prop('checked', !comb.isSale)
            $('#addCombForm [name=\'packSpecification\']').val(comb.packSpecification)
            $('#addCombForm [name=\'innerPackCost\']').val(comb.innerPackCost)
            $('#addCombForm [name=\'packDesc\']').val(comb.packDesc)
            $('#addCombForm [name=\'outerBoxLength\']').val(comb.outerBoxLength)
            $('#addCombForm [name=\'outerBoxWidth\']').val(comb.outerBoxWidth)
            $('#addCombForm [name=\'outerBoxHeight\']').val(comb.outerBoxHeight)
            $('#addCombForm [name=\'productLength\']').val(comb.productLength)
            $('#addCombForm [name=\'productWidth\']').val(comb.productWidth)
            $('#addCombForm [name=\'productHeight\']').val(comb.productHeight)
            $('#addCombForm [name=\'winitLength\']').val(comb.winitLength)
            $('#addCombForm [name=\'winitWidth\']').val(comb.winitWidth)
            $('#addCombForm [name=\'winitHeight\']').val(comb.winitHeight)
            // $("#addCombForm [name='compressHeight']").val(comb.compressHeight);
            // $("#addCombForm [name='superpositionHeight']").val(comb.superpositionHeight);
            $('#addCombForm [name=\'throwWeight\']').val(comb.throwWeight)
            $('#addCombForm [name=\'purchaseChannel\']').val(comb.purchaseChannel || '')
            $('#addCombForm [name=\'customsCode\']').val(comb.customsCode || '')
            $('#addCombForm [name=\'material\']').val(comb.material || '')
            //$("#combDetailForm select[name='packSpecification']").find('opiton[value='+comb.packSpecification+']').prop('selected',true);
            $('#addCombForm select[name=\'packSpecification\']').trigger('select')
            setTimeout(() => {
              var combLogisAttrList = comb.logisAttrList.split(',')
              for (var i = 0; i < combLogisAttrList.length; i++) {
                if (combLogisAttrList.length > 1 && combLogisAttrList[i] === '普货') {
                  continue
                }
                var obj = $('#logisAttr_comb input[value=' + combLogisAttrList[i] + ']')
                obj.prop('checked', true)
                layui.form.render()
              }
            }, 500)
            $('#addCombForm input[name=\'isSale\']').prop('checked', !comb.isSale)
            if (typeof (comb.isOutOfStock) != undefined) {
              $('#addCombForm input[name=\'isOutOfStock\']').prop('checked', comb.isOutOfStock)
            }
            // 审核详情
            $('#pl_auditResult_comb').val(comb.auditStatus)
            $('#pl_auditDesc_comb').val(comb.auditDesc)
            //组合品列表
            var compList = comb.combSubProds
            // 组合品是否在售
            var combIsSale = true
            var tr_arr
            for (var i in compList) {
              var complist = compList[i]
              if (!complist.isSale) { // 有1个子商品 停售 则组合品停售
                combIsSale = false
              }
              tr_arr = newCombObj(complist)
              $('#groupTable tbody').append(tr_arr)
            }
            // 设置组合品在售状态
            $('#addCombForm [name=isSale]')[0].checked = !combIsSale
            // 初始化组合品-包装重量
            getTotalWeight('#packspectag_comb option:selected', '#addCombForm', '#totalWeight_comb')
            
            layui.form.render('select')
            layui.form.render('checkbox')
          } else {
            layer.msg(returnData.msg)
          }
        },
        error: function () {
          loading.hide()
          layer.msg('发送请求失败')
        }
      })
    }
    // 展示商品日志
    function getProdLog (url, id, selector) { //url getProdAuditLog getProdOperLog
      if (typeof (id) == undefined) {
        return
      }
      $.ajax({
        type: 'post',
        url: ctx + '/product/' + url + '.html',
        data: { 'sid': id },
        // async: false,
        dataType: 'json',
        success: function (returnData) {
          if (returnData.code != '0000') {
            layer.msg(returnData.msg, { icon: 5 })
          } else {
            var prodLogs = returnData.data
            for (var i in prodLogs) {
              var tr = '<tr>'
              prodLogs[i].operDesc = prodLogs[i].operDesc.replace(/\n/g, '<br/>')
              if (typeof (prodLogs[i].operNote) == 'undefined') {
                prodLogs[i].operNote = ''
              }
              tr += '<td>' + layui.admin.Format(prodLogs[i].operTime, 'yyyy-MM-dd hh:mm:ss') + '</td><td>' + prodLogs[i].operator + '</td><td>' + prodLogs[i].operDesc + '</td>'
              if (selector == '#pl_auditLogTbody') {
                tr += '<td>' + prodLogs[i].operNote + '</td>'
              }
              tr += '</tr>'
              $(selector).append(tr)
            }
          }
        },
        error: function () {
          layer.msg('发送请求失败')
        }
      })
    }
    /*商品父sku相关点击事件-  键入搜索父sku   获取父sku详情   新增父sku  修改父sku*/
    function initPSkuEvent (formSelector) {
      // 获得焦点 键入搜索父sku
      $(formSelector + ' [data-id=prodPSku]').on('focus propertychange input', function () {
        searchSku(this, 'psku')
      })
      // 失去焦点
      $(formSelector + ' [data-id=prodPSku]').on('blur', function () {
        let self = this
        window.setTimeout(function () {
          $(self).next().hide()
        }, 500)
      })
      // 获取父sku详情
      $(formSelector + ' [data-id=getPskuDetail]').on('click', function () {
        var pSku = $(formSelector + ' [data-id=prodPSku]').val()
        if (pSku == '') {
          layer.msg('请输入正确的父sku')
          return
        }
        $(formSelector + ' [data-id=bizzOwner]').val('')
        $(formSelector + ' [data-id=responsor]').val('')
        $(formSelector + ' [data-id=tags]').val('')
        $(formSelector + ' [data-id=cate]').val('')
        $(formSelector + ' [data-id=devCate]').val('')
        oneAjax.post({
          url: ctx + '/product/getPProd.html',
          data: { 'pSku': pSku },
          success: function (returnData) {
            if (returnData.code === '0000') {
              let obj = returnData.data
              $(formSelector + ' [data-id=bizzOwner]').val(obj.bizzOwner)
              $(formSelector + ' [data-id=responsor]').val(obj.responsor)
              $(formSelector + ' [data-id=tags]').val(obj.prodAttrList)
              $(formSelector + ' [data-id=newCate]').val(obj.prodPInfoCateOaDTO && obj.prodPInfoCateOaDTO.cateName ? obj.prodPInfoCateOaDTO.cateName : '')
              $(formSelector + ' [data-id=cate]').val(obj.prodCate.cateCnName)
              $(formSelector + ' [data-id=devCate]').val(obj.prodCate.mgmtName)
              $(formSelector + ' [data-id=baoguan_cn]').val(obj.prodCate.customsCnName)
              $(formSelector + ' [data-id=baoguan_en]').val(obj.prodCate.customsEnName)
              $(formSelector + ' [data-id=baoguan_value]').val(obj.prodCate.customsValue)
              $(formSelector + ' [name=pId]').val(obj.id)
              $(formSelector + ' [data-id=isAlonePack]').prop('checked', obj.isAlonePack)
              $(formSelector + ' [data-id=isSpecialPack]').prop('checked', obj.isSpecialPack)
              layui.form.render('checkbox')
            } else {
              layer.msg(returnData.msg)
            }
          },
          error: function () {
            layer.msg('发送请求失败')
          }
        })
      })
      let prodPSkuElem = $(formSelector + ' [data-id=prodPSku]')
      let getPSkuInfoBtnElem = $(formSelector + ' [data-id=getPskuDetail]')

      let reback = function (pSku) {
        prodPSkuElem.val(pSku)
        getPSkuInfoBtnElem.click()
      }

      // 新增父sku
      $(formSelector + ' [data-id=addParentSku]').on('click', function () {
        popToAddOrUpdProdPInfo(null, reback)
      })
      let reback2 = function (pSku) {
        getPSkuInfoBtnElem.click()
      }
      // 修改父sku
      $(formSelector + ' [data-id=editParentSku]').on('click', function () {
        let pSku = $(formSelector + ' [data-id=prodPSku]').val();
        if (!pSku) {
          layer.msg('请先填写父SKU')
          return
        }
        popToAddOrUpdProdPInfo({ pSku: pSku }, reback2)
      })
    }

    /*组合品表格的处理事件:增删*/
    function comb_table () {
      //组合品新增按钮
      $('#addAline').click(function () {
        var $tr = newCombObj()
        $('#groupTable tbody').append($tr)
      })

      //组合品移除按钮
      $('#groupTable').on('click', '.removeNew', function () {
        if ($('#groupTable tbody tr').length === 1) return
        $(this).parents('tr').remove()
        // dealCombWeightAndCost("#addCombForm");
        // 重新计算重量  和成本
        countCombWeightAndCost('#groupTable', '#addCombForm')
        getTotalWeight('#packspectag_comb option:selected', '#addCombForm', '#totalWeight_comb')
        genLogisAttrAndSale()

      })
    }
    function countCombWeightAndCost (tableSelector, formSelector) {
      combTotalWeight = 0
      combPurchaseCost = 0
      combInnerPackCost = 0
      $(tableSelector + ' tbody').find('tr').each(function () {
        var tdArr = $(this).children()
        var skucost = tdArr.eq(0).find('input[type="hidden"]').attr('cost') //采购成本
        var innerPackCost = tdArr.eq(0).find('input[type="hidden"]').attr('innerPackCost') //内包装成本
        innerPackCost = innerPackCost ? innerPackCost : 0
        var skuweight = tdArr.eq(0).find('input[type="hidden"]').attr('weight') //重量
        var skuNum = tdArr.eq(1).find('input').val()
        if (skuNum == '' || skuNum == undefined) {
          // layer.msg("请填写数量");
          return
        }
        if (skucost == '' || skuweight == '') {
          layer.msg('数据异常,无法计算重量和成本价')
          return
        }
        combTotalWeight = accAdd(combTotalWeight, accMul(parseFloat(skuweight), skuNum))
        combPurchaseCost = accAdd(combPurchaseCost, accMul(parseFloat(skucost), skuNum))
        combInnerPackCost = accAdd(combInnerPackCost, accMul(parseFloat(innerPackCost), skuNum))
      })
      $(formSelector + ' input[name=\'suttleWeight\']').val(combTotalWeight)
      $(formSelector + ' input[name=\'purchaseCostPrice\']').val(combPurchaseCost)
      $(formSelector + ' input[name=\'innerPackCost\']').val(combInnerPackCost)
    }

    // 计算含包装重量和 包装价格
    function getTotalWeight (selectedOption, formSelector, id) {
      var mm = selectedOption

      // var unitCost = $(mm).attr('cost');
      var packWeight = $(mm).attr('weight')
      if (!packWeight) { // 如果未选择包装规格，则不继续计算
        return
      }
      // $(formSelector + " input[name='innerPackCost']").val(unitCost);
      $(formSelector + ' input[name=\'packWeight\']').val(packWeight)
      var skuWeight = $(formSelector + ' input[name=\'suttleWeight\']').val()
      var totalWeight
      if (skuWeight != '') {
        totalWeight = accAdd(parseFloat(skuWeight), parseFloat(packWeight))
        $(id).val(totalWeight)
      }
    }
    
    function getComLogisAttrList() {
      let ajax = new Ajax(false)
      let Adata = { enumNameListStr: 'LogisAttrEnum' }
      ajax.post({
          url: ctx + '/enum/getLogisAttrEnum.html',
          success: function(res) {
              if (res.code === '0000') {
                  let logisAttrList = []
                  for (let i = 0; i < res.data.length; ++i) {
                    logisAttrList.push(res.data[i].name)
                  }
                  let allStr = ''
                  logisAttrList?.forEach(item => {
                      let str = '<input type="checkbox" lay-skin="primary" name="logisticAttr" title="' + item + '" value="' + item + '">'
                      allStr += str
                  })
                  $('#logisAttr_comb').html(allStr)
                  layui.form.render()
              } else {
                  layer.msg('初始化物流属性失败:' + res.msg)
              }
          }
      })
  }
    // 生成组合品的物流属性和在售状态
    function genLogisAttrAndSale () {
      var form = layui.form
      $('#logisAttr_comb [name=\'logisAttrList\']').prop('checked', false)
      $('#addCombForm [name=\'isSale\']').prop('checked', false)
      var combLogisAttr = {}
      var combIsSale = true
      var combIsOutOfStock = false
      var combSkuTrs = $('#groupTable tbody tr')
      if (!combSkuTrs) {
        return
      }
      var currentTds // 当前行的 列
      var currentLogisAttrStr // 当前行的物流属性
      var currentLogisAttrArr
      var currentIsSale // 当前行的在售状态
      var currentIsOutOfStock // 当前行的在售状态
      for (var i = 0; i < combSkuTrs.length; ++i) {
        currentTds = combSkuTrs.eq(i).find('td')
        currentLogisAttrStr = currentTds.eq(0).find('input[type="hidden"]').attr('logisAttrList') //物流属性
        currentIsSale = currentTds.eq(0).find('input[type="hidden"]').attr('isSale')
        currentIsOutOfStock = currentTds.eq(0).find('input[type="hidden"]').attr('isOutOfStock')
        if (!currentIsSale || currentIsSale == 'false') {
          combIsSale = false
        }
        if (currentIsOutOfStock == 'true') {
          combIsOutOfStock = true
        }
        if (!currentLogisAttrStr) {
          continue
        }
        currentLogisAttrArr = currentLogisAttrStr.split(',')
        for (var j = 0; j < currentLogisAttrArr.length; ++j) {
          combLogisAttr[currentLogisAttrArr[j]] = true
        }
      }

      var logisAttrCheckboxs = $('#logisAttr_comb [name=\'logisAttrList\']')

      let logisAttrNum = 0;
      for (let logistAttr in combLogisAttr) {
        logisAttrNum++
      }
      for (let logistAttr in combLogisAttr) {
        if (logisAttrNum > 1 && logistAttr === '普货') {
          continue
        }
        let attrName = logistAttr.replace(/[()>≤]/g, function (match) {
          switch (match) {
            case '(': return '\\('
            case ')': return '\\)'
            case '>': return '\\>'
            case '≤': return '\\≤'
          }
        })
        $('#logisAttr_comb [name=logisAttrList][value=' + attrName + ']')[0].checked = true
      }

      if (!combIsSale) {
        $('#addCombForm input[name=\'isSale\']').prop('checked', true)
      }
      if (combIsOutOfStock) {
        $('#addCombForm input[name=\'isOutOfStock\']').prop('checked', true)
      }
      form.render('checkbox')
    }

    function searchSku (t, type, fSelector, tSelector) {
      var that = t
      if (!($(t).val().trim())) {
        return
      }
      $.ajax({
        url: ctx + '/product/skuLikeSearch.html',
        type: 'post',
        data: { sku: $(t).val(), 'type': type },
        success: function (returnData) {
          var data = returnData.data
          if (t == document.activeElement) { // 判断鼠标是否扔聚焦于该input
            //字符串拼接
            var prodStr = ''
            for (var i = 0; i < data.length; i++) {
              var prod = data[i]
              if (type == 'psku') {
                prodStr += '<li id="' + prod.id + '" class="dimResultDivItem">' + prod.pSku + '</li>'
              } else {
                prodStr += '<li id="' + prod.id + '" class="dimResultDivItem">' + prod.sSku + '</li>'
              }
            }
            var ul = $(that).next('ul')
            ul.empty()
            ul.append(prodStr)
            //样式设置
            ul.css('display', 'block')
            var lis = $(that).next('ul').find('li')
            lis.mouseenter(function () {
              $(this).css({ backgroundColor: '#009688', color: '#fff' })
            })
            lis.mouseleave(function () {
              $(this).css({ backgroundColor: '', color: '' })
            })

            lis.on('click', function () {
              $(that).val($(this).text())
              ul.css('display', 'none')
            })
            // //li的点击事件
            // for (var j = 0; j < lis.length; j++) {
            //     var $li = $(lis[j]);
            //     $li.on('click',function() {
            //         $(that).val($(this).text());
            //         ul.css('display', 'none');
            //         ul.empty();
            //     })
            // }
            //判断input是否为空
            if ($(that).val() == '') {
              ul.empty()
            }

          }
        }
      })
    }
  </script>
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>

  <style>
    /* 弹框表单的样式调整 */
    #addSSkuForm .layui-form-label {
      padding: 9px;
    }

    .productlist_header_button {
      position: absolute;
      right: 20px;
    }

    .productlist_header_button_smallScreen {
      position: absolute;
      right: 20px;
      /* top: 36px; */
      /* z-index: 20199527; */
    }

    #opl_searchForm .layui-form-switch {
      margin-top: 5px;
    }
  </style>
  <!-- 新增商品 -->
  <script type="text/html" id="prodlist_addProductLayer">
  <div class="p20">
      <div class="layui-tab layui-tab-card">
          <ul class="layui-tab-title isCreateHidden">
              <li class="layui-this">详情</li>
              <li>操作日志</li>
          </ul>
          <div class="layui-tab-content">
              <div class="layui-tab-item layui-show p20">
                  <form class="layui-form" action="" lay-filter="component-form-group" id="addSSkuForm"
                        autocomplete="off" onsubmit="return false;">
                      <div class="layui-col-md6 layui-col-lg6">
                      <div class="layui-form-item">
                          <div class="layui-col-md6 layui-col-lg6">
                              <label class="layui-form-label w90">商品父SKU</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="prodPSku" class="layui-input" >
                                  <ul class="supplierUl productlistSearch"></ul>
                                  <input type="hidden" name="pId" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-inline" style="height:32px">
                              <button class="layui-btn layui-btn-sm" type="button" data-id="getPskuDetail">获取</button>
                          </div>
                          <div class="layui-inline" style="height:32px">
                              <label class="layui-form-label w90">独立包装</label>
                              <input id="isAlonePack_prodsDetail" type="checkbox" data-id="isAlonePack" title="" lay-skin="primary" disabled>
                          </div>
                          <div class="layui-inline" style="height:32px">
                              <label class="layui-form-label w90">特殊包装</label>
                              <input id="isSpecialPack_prodsDetail" type="checkbox" data-id="isSpecialPack" title="" lay-skin="primary" disabled>
                          </div>

                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md6 layui-col-lg6">
                              <label class="layui-form-label w90">开发专员</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="bizzOwner" class="layui-input" disabled placeholder="根据父关联">
                              </div>
                          </div>
                          <div class="layui-col-md6 layui-col-lg6">
                              <label class="layui-form-label w90">责任人</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="responsor" class="layui-input" disabled
                                         placeholder="根据父关联">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">新类目</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="newCate" class="layui-input" placeholder="根据父关联" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">旧类目</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="cate" class="layui-input" placeholder="根据父关联" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">商品标签</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="tags" class="layui-input" placeholder="根据父关联" disabled>
                              </div>
                          </div>
                          <%--<div class="layui-col-md3 layui-col-lg3">--%>
                              <%--<label class="layui-form-label">开发管理类目</label>--%>
                              <%--<div class="layui-input-block">--%>
                                  <%--<input type="text" data-id="devCate" class="layui-input" placeholder="根据父关联" disabled>--%>
                              <%--</div>--%>
                          <%--</div>--%>
                      </div>
                      </div>
                          <div class="layui-col-md4 layui-col-lg4">
                          <label class="layui-form-label"><font color='red'>*</font>图片</label>
                          <div class="layui-input-block" id="productlist_imageDiv">
                              <div class="layui-col-md6 layui-col-lg6">
                                  <div in='innerImage' class="productlist_imageEditDiv" id="image_edit0" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                  <div><span class="layui-btn layui-btn-xs searchSupply">查找货源</span></div>
                              </div>
                          </div>
                          </div>
                      <hr class="layui-bg-gray">
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">商品子SKU</label>
                              <div class="layui-input-block" style="display:flex;align-items: center;">
                                  <input type="text" name="sSku" class="layui-input" maxlength="16" id="productlist_sSkuInput">
                                  <span><span id="productlist_inputCount">0</span>/16</span>
                                  <input type="hidden" name="id" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">采购员</label>
                              <div class="layui-input-block" hp-select>
                                  <div hidden id="buyers_productlist" hp-select-data>
                                      <c:forEach items="${buyers}" var="developer">
                                          <li data-value="${developer.id}" hp-select-li>${developer.userName}</li>
                                      </c:forEach>
                                  </div>
                                  <%--<input hidden name="buyerId" hp-select-value>--%>
                                  <input class="layui-input" name="buyer" hp-select-text value="${defaultBuyer == null ? "" : defaultBuyer}">
                                  <ul hp-select-optionContain class="supplierUl productlistSearch"></ul>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">采购成本(¥)</label>
                              <div class="layui-input-block">
                                  <input name="purchaseCostPrice" readonly class="layui-input disAbleInp" min='0' placeholder="采购默认供应商报价">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">内包装成本(¥)</label>
                              <div class="layui-input-block">
                                  <input type="text" name="innerPackCost" class="layui-input disAbleInp" readonly placeholder="采购默认供应商仓库包装费">
                                  <input type="hidden" name="packWeight" class="layui-input">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">销售状态</label>
                              <div class="layui-input-block">
                                  <input type="checkbox" name="isSale" lay-skin="primary" title="停售">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90"><font color="red">*</font>停售原因</label>
                              <div class="layui-input-block">
                                  <select name="notSaleReason" id="stopSaleTag" lay-search>
                                      <option value=""></option>
                                      <c:forEach items="${offSaleReasons}" var="reason">
                                          <option value="${reason.name}">${reason.name}</option>
                                      </c:forEach>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">停售时间</label>
                              <div class="layui-input-block">
                                  <input type="text" id="notSaleTimeStr" class="layui-input disAbleInp"
                                         placeholder="停售时间,停售状态时显示" disabled>
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">库存状态</label>
                              <div class="layui-input-block">
                                  <input type="checkbox" name="isOutOfStock" lay-skin="primary" title="缺货">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">缺货备注</label>
                              <div class="layui-input-block">
                                  <input type="text" name="note" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">库位</label>
                              <div class="layui-input-block">
                                  <input type="text" name="stockLocation" class="layui-input disAbleInp" readonly="readonly" placeholder="库位">
                                  <div style="position: relative;width: 0;height: 0;left: 120px;top: -25px;">
                                      <div style="width: 200px;color:red" name="receiveAddressName"></div>
                                  </div>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">入库要求</label>
                              <div class="layui-input-block">
                                  <input type="text" name="packDesc" class="layui-input">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-block" notnull>
                              <label class="layui-form-label w90">物流属性</label>
                              <div class="layui-block" id="logisAttr">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">是否带插头</label>
                              <div class="layui-input-block">
                                  <input type="checkbox" name="ifWithPlug" lay-skin="primary" title="带插头">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md6 layui-col-lg6 pora" notNull>
                              <label class="layui-form-label w90">商品名称</label>
                              <div class="layui-input-block">
                                  <input type="text" name="title" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">产品简称</label>
                              <div class="layui-input-block">
                                  <input type="text" name="purchaseChannel" class="layui-input" placeholder=""
                                         maxlength="6" onblur="productlist_getCustomCode(this)">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">款式</label>
                              <div class="layui-input-block">
                                  <input type="text" name="style" class="layui-input">
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
<%--                          <div class="layui-col-md3 layui-col-lg3">--%>
<%--                              <label class="layui-form-label w90">品牌</label>--%>
<%--                              <div class="layui-input-block">--%>
<%--                                  <input type="text" name="brand" class="layui-input">--%>
<%--                              </div>--%>
<%--                          </div>--%>
<%--                          <div class="layui-col-md3 layui-col-lg3">--%>
<%--                              <label class="layui-form-label w90">规格</label>--%>
<%--                              <div class="layui-input-block">--%>
<%--                                  <input type="text" name="specification" class="layui-input">--%>
<%--                              </div>--%>
<%--                          </div>--%>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">材质</label>
                              <div class="layui-input-block">
                                  <input type="text" name="material" class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">默认发货库</label>
                              <div class="layui-input-block">
                                  <select name="defaultDlvrWhId" id="wareHouseTag" lay-search>
                                      <c:forEach items="${wareHouseList}" var="wareHouse">
                                          <option value="${wareHouse.id}" ${wareHouse.storeType ==1 and wareHouse.isDefault ? 'selected' : ''}>${wareHouse.warehouseName}</option>
                                      </c:forEach>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">海关编码</label>
                              <div class="layui-input-block">
                                  <input name="customsCode" class="layui-input">
                              </div>
                          </div>
<%--                          <div class="layui-col-md3 layui-col-lg3">--%>
<%--                              <label class="layui-form-label w90">型号</label>--%>
<%--                              <div class="layui-input-block">--%>
<%--                                  <input type="text" name="model" class="layui-input">--%>
<%--                              </div>--%>
<%--                          </div>--%>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">单位</label>
                              <div class="layui-input-block">
                                  <select name="unit" id="unit" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">商品净重(g)</label>
                              <div class="layui-input-block">
                                  <input name="suttleWeight" class="layui-input" min="0" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}"
                                         onblur="getTotalWeight('#packspectag option:selected', '#addSSkuForm', '#totalWeight')">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">包装规格</label>
                              <div class="layui-input-block">
                                  <select name="packSpecification" id="packspectag" lay-filter="packspectag" lay-search>
                                  </select>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">含包装重量(g)</label>
                              <div class="layui-input-block">
                                  <input type="text" class="layui-input disAbleInp" placeholder="净重+包装重量" id="totalWeight"
                                         readonly>
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                        <div class="layui-col-md3 layui-col-lg3" notNull>
                          <label class="layui-form-label w90">是否定制</label>
                          <div class="layui-input-block">
                              <select name="isSpecialMake"  lay-search>
                                  <option></option>
                                  <option value="1">是</option>
                                  <option value="0" selected="selected">否</option>
                              </select>
                          </div>
                        </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">定制产品<br>到货天数</label>
                              <div class="layui-input-block">
                                  <input type="text" name="purchaseDlvrDays" class="layui-input"  value="5">
                              </div>
                          </div>

                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label w90">定制产品<br>预警周期</label>
                              <div class="layui-input-block">
                                  <input name="stockWarnCycle" class="layui-input" placeholder="" min="0" value="5">
                              </div>
                          </div>
                      </div>

<%--                      <div class="layui-form-item">--%>
<%--                          <div class="layui-col-md3 layui-col-lg3">--%>
<%--                              <label class="layui-form-label w90">最小包装数</label>--%>
<%--                              <div class="layui-input-block">--%>
<%--                                  <input name="minPackingNums" class="layui-input" min="0">--%>
<%--                              </div>--%>
<%--                          </div>--%>
<%--                          <div class="layui-col-md3 layui-col-lg3">--%>
<%--                              <label class="layui-form-label w90">样品数量</label>--%>
<%--                              <div class="layui-input-block">--%>
<%--                                  <input name="sampleNums" class="layui-input" min="0">--%>
<%--                              </div>--%>
<%--                          </div>--%>
                          <%--<div class="layui-col-md3 layui-col-lg3">--%>
                              <%--<label class="layui-form-label w90">包装难度</label>--%>
                              <%--<div class="layui-input-block">--%>
                                  <%--<input name="packDifficulty" class="layui-input" placeholder=""--%>
                                         <%--min="0">--%>
                              <%--</div>--%>
                          <%--</div>--%>
<%--                      </div>--%>

                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">7日销量</label>
                              <div class="layui-input-block">
                                  <input name="sevenSales" class="layui-input disAbleInp" placeholder="来自普源" min="0" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">15日销量</label>
                              <div class="layui-input-block">
                                  <input name="fifteenSales" class="layui-input disAbleInp" placeholder="来自普源" min="0" disabled>
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">30日销量</label>
                              <div class="layui-input-block">
                                  <input name="thirtySales" class="layui-input disAbleInp" placeholder="来自普源" min="0" disabled>
                              </div>
                          </div>
                      </div>
                      <hr class="layui-bg-gray">
                      <div class="layui-form-item">
                          <p class="taRight">
                              <button type="button" class="layui-btn layui-btn-sm disN addsupplierBtn_productlist">新增供应商</button>
                          </p>
                          <table class="layui-table supplierRefTab_productlist">
                              <thead>
                              <tr>

                                  <th width="8%">供应商<font color="red">*</font></th>
                                  <th width="8%">采购URL<font color="red">*</font></th>
                                  <th width="5%">最小订货量</th>
                                  <th width="5%"><span title="供应商报价(不可编辑,自动计算)=供应商商品报价 + 供应商包装费用">供应商报价(¥)<font color="red">*</font><i class="layui-icon layui-icon-about" ></i></span></th>
                                  <th width="15px">货号标记</th>
                                  <th width="15px">物理分割</th>
                                  <th width="5%">货号</th>
                                  <th width="5%"><span title="一键生成1688订单时，采购数量将乘以该值，并向上取整">采购基数<font color="red">*</font><i class="layui-icon layui-icon-about" ></i></span></th>
                                  <th width="5%"><span>供应商商品报价(¥)</span><font color="red">*</font></th>
                                  <th width="5%"><span>供应商包装</span></th>
                                  <th width="5%"><span>供应商包装费用(¥)</span></th>
                                  <th width="5%"><span>仓库包装费用(¥)</span></th>
                                  <%--<th width="12%"><span title="创建采购订单时，将自动加上以'【prodSId】【商品名】【1688属性】:自动留言内容' 形式的买家留言">自动留言 <i class="layui-icon layui-icon-about" ></i></span></th>--%>
                                  <th width="8%">下单备注</th>
                                  <th width="8%"><span  title="商品对应的1688属性">1688属性<i class="layui-icon layui-icon-about"></i></span></th>
                                  <th width="15px">默认</th>
                                  <th>操作</th>
                              </tr>
                              </thead>
                              <tbody class="layui-form" lay-filter="prodSupplierRef_productlistDetailPop" style="text-align: center">
                              </tbody>
                          </table>
                          <div class="taRight">
                              <button type="button" class="layui-btn layui-btn-sm layui-btn-normal addOneLine_productlist">
                                  添加一行
                              </button>
                          </div>
                      </div>
                      <hr class="layui-bg-gray">
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label">商品长(cm)</label>
                              <div class="layui-input-block">
                                  <input min="0" name="productLength" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label">商品宽(cm)</label>
                              <div class="layui-input-block">
                                  <input min="0" name="productWidth" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label">商品高(cm)</label>
                              <div class="layui-input-block">
                                  <input min="0" name="productHeight" oninput="countThrowWeight(this)"  class="layui-input">
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
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">报关中文</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="baoguan_cn" class="layui-input disAbleInp" disabled
                                         placeholder="根据父关联">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">报关英文</label>
                              <div class="layui-input-block">
                                  <input type="text" data-id="baoguan_en" class="layui-input disAbleInp" disabled
                                         placeholder="根据父关联">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">申报价值</label>
                              <div class="layui-input-block">
                                  <input data-id="baoguan_value" class="layui-input disAbleInp" min="0" disabled placeholder="根据父关联">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label w90">原产国</label>
                              <div class="layui-input-block">
                                  <input type="text" name="origin" value="China" class="layui-input disAbleInp" readonly>
                              </div>
                          </div>
                      </div>
                      <div class="layui-form-item">
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label">外箱长(cm)</label>
                              <div class="layui-input-block">
                                  <input name="outerBoxLength" min="0" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label">外箱宽(cm)</label>
                              <div class="layui-input-block">
                                  <input name="outerBoxWidth" min="0" oninput="countThrowWeight(this)"  class="layui-input" >
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3" notNull>
                              <label class="layui-form-label">外箱高(cm)</label>
                              <div class="layui-input-block">
                                  <input name="outerBoxHeight" min="0" oninput="countThrowWeight(this)"  class="layui-input">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label">叠高(cm)</label>
                              <div class="layui-input-block">
                                  <input min="0" name="superpositionHeight" class="layui-input" onkeyup="if(this.value && ! /^\d+(\.\d+)?$/.test(this.value)){alert('只能输入正数');this.value='';}">
                              </div>
                          </div>
                          <div class="layui-col-md3 layui-col-lg3">
                              <label class="layui-form-label">抛重(g)</label>
                              <div class="layui-input-block">
                                  <input name="throwWeight" class="layui-input" readonly>
                              </div>
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
                      <%--<fieldset class="layui-elem-field layui-field-title site-demo-button">--%>
                      <%--<legend style="font-size:14px">商品状态</legend>--%>
                      <%--</fieldset>--%>

                      <div class="layui-form-item" style="display: none">
                          <div class="layui-input-block taRight">
                              <button class="layui-btn" lay-submit="" lay-filter="addSSku" id="submitSSku">提交</button>
                              <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                          </div>
                      </div>
                  </form>
              </div>
              <div class="layui-tab-item p20">
                  <div class="layui-tab layui-tab-brief">
                      <div class="layui-show">
                          <table class="layui-table">
                              <thead>
                              <tr>
                                  <th>时间</th>
                                  <th>描述人</th>
                                  <th>日志</th>
                              </tr>
                              </thead>
                              <tbody id="pl_subLogTbody">
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</script>
<script type="text/html" id="prodlist_logisAttrListLayer">
  {{# layui.each(d.logisAttrList, function(index, item) { }}
    <input type='checkbox' lay-skin='primary' name='logisAttrList' title='{{item.name}}' value='{{item.name}}'>
    {{#}) }}
</script>
  <script>
    // 初始化图片上传
    function initUploadImg () {
      new UploadImage('image_edit0', ctx + '/product/getProdBase64Img.html').upload(function (xhr) { //上传完成后的回调
        succUploadImg1(this, xhr)
      })
    }
    function succUploadImg1 (self, xhr) {
      let img = new Image('150', '150')
      let returnData = (xhr.responseText)

      if (xhr.responseText === '') {
        layer.msg('上传出错!')
      } else if (returnData !== undefined && returnData.code === '9999') {
        layer.msg('上传出错!' + xhr.responseText)
      } else {
        img.src = returnData.data + '!size=150x150'
        img.className = 'imgCss img_show_hide'
        $('#preProdEditFrom input[name=\'image\']').val(returnData.data)
        $(self).empty().html(img)
      }
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
              form.render('checkbox')
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
    }
    //新增供应商
    function newAddSupplier () {
      $('.addsupplierBtn_productlist').click(function () {
        var index = layer.open({
          title: '新增供应商',
          type: 1, //不加该属性,就会出现[object Object]
          area: ['800px', '600px'],
          id: 'addsupplierId',
          shadeClose: false,
          content: $('#addsupplierLayer').html(),
          btn: ['保存', '关闭'],
          success: function () {
            //所属类目渲染
            alertCateSelect($('#addSuppFrom #xtreeAddBtn'), $('#addSuppFrom [name=supportCateIds]'), $('#addSuppFrom #xtreeAddDiv'))
            // 初始化必填项
            initNotNull('#addSuppFrom')
            //常规用法
            laydate.render({
              elem: '#pl_UncoopTime' //指定元素
              ,
              type: 'datetime'
            })
            form.render('checkbox')
            form.render('select')
          },
          yes: function (index, layero) {
            // 校验有无选择类目
            var cateLsit = $('#addSuppFrom [name=supportCateIds]').val()
            if (!cateLsit || cateLsit.length == 0) {
              layer.msg('请选择所属类目')
              return false
            }
            // 校验必填项
            if (!checkNotNull('#addSuppFrom')) {
              return false
            }

            //处理数据
            var data = serializeObject($('#addSuppFrom'))
            data.isSupportCust = $('#isSupportCust').prop('checked')
            data.isCooperate = true
            if ($('#isCooperate').is(':checked')) {
              data.isCooperate = false
              data.uncooperativeReason = $('#uncoopReasonTag').val()
            }
            var uncooperativeTime = data['uncooperativeTime']
            if (uncooperativeTime != '') {
              uncooperativeTime = uncooperativeTime.replace(/-/g, '/')
              var d = new Date(uncooperativeTime)
              var uncoopTime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
              data['uncooperativeTime'] = uncoopTime
            }

            data.mobile == '' ? data.mobile = 'null' : '';
            data.contact == '' ? data.contact = 'null' : '';

            loading.show()
            $.ajax({
              type: 'post',
              url: ctx + '/product/addProdSupplier.html',
              dataType: 'json',
              data: data,
              success: function (returnData) {
                loading.hide()
                if (returnData.code == '0000') {
                  layer.close(index)
                  layer.msg('添加供应商成功')
                } else {
                  layer.msg(returnData.msg)
                }
              },
              error: function () {
                loading.hide()
                layer.msg('发送请求失败')
              }
            })
          },
        })
      })
    }
    //供应商移除按钮
    var removeBtn_supplier = '<button type="button" class="layui-btn layui-btn-danger layui-btn-sm ml5" onclick="supplierListRemove(this)" title="移除该供应商">移除</button>'

    var matchAli1688SkuInfo = '<button type="button" class="layui-btn layui-btn-normal layui-btn-sm" onclick="toMatch1688_productlist(this)" title="匹配1688信息">匹配</button>'

    var clearMatch = '<button type="button" class="layui-btn layui-btn-warm layui-btn-sm ml5" onclick="clearMatch_productlist(this)" title="清除匹配1688信息">清除</button>'
    var refreshAli1688SkuInfo = '<button type="button" class="layui-btn layui-btn-primary layui-btn-sm ml5" onclick="refreshAli1688SkuInfo_productlist(this)" title="更新可匹配的1688信息">更新</button>'
    var setDefaultBtn_productlistSupplier = '<button type="button" class="layui-btn layui-btn-primary layui-btn-sm ml5" onclick="setDefaultSupplier_productlist(this)" title="将该供应商设为默认供应商">设为默认</button>'
    /**
     * 新增一行供应商
     * @param sup 旧数据
     * @param ifList 是否批量修改
     * @param ifAdd 是否 新增商品操作
     */
    function addsupplierTbody (sup, ifList, ifAdd) {
      sup = sup || {}
      var tr = '<tr>'
      tr += '<input type="hidden" refId value="' + (sup.id || '') + '">'
      let provideIdentification = (sup.provideIdentification == true) ? "是" : sup.provideIdentification == false ? "否" : "";
      let ifDivision = (sup.ifDivision == true) ? "是" : sup.ifDivision == false ? "否" : "";
      if (ifList) {
        tr += '<td><div style="width:100%;position:relative">\
                       <input supplierName type="text" class="layui-input supplierInfo" value="' + (sup.supplierName || '') + '">\
                     <ul class="supplierUl productlistSearch"></ul>\
                       </div></td>\
                       <td><input purchaseUrl type="text" class="layui-input" value="' + (sup.purchaseUrl || '') + '" style="float: left;width: 99%"><span class="relativeContains"><a onclick="redirectTo(this)" target="_blank" style="height: 32px;line-height: 32px; cursor:pointer"><i style="font-size:12px" class="layui-icon layui-icon-lianjie"></i></a></span></td>\
                       <td><input minOrderNum type="text" class="layui-input" value="' + (sup.minOrderNum || '') + '"></td>\
                       <td><input quote type="text" readonly class="layui-input disAbleInp" value="' + (sup.quote || '') + '"></td>\
                       <td><input articleNo type="text" class="layui-input" value="' + (sup.articleNo || '') + '"></td>\
                       <td><input purBaseNum type="text" class="layui-input" value="' + (sup.purBaseNum || '') + '"></td>\
                       <td><input prodPrice type="text" class="layui-input" value="' + (sup.prodPrice || '') + '" onblur="productlist_calSupplierQuote(this)"></td>\
                       <td><input ifSupplierPack type="checkbox" class="layui-input" lay-skin="primary" ' + (sup.ifSupplierPack ? 'checked' : '') + ' lay-filter="productlist_supplierRefTab_ifSupplierPack"></td>\
                       <td><input supplierPackFee type="text" onblur="productlist_calSupplierQuote(this)" class="layui-input'+ (sup.ifSupplierPack ? '' : ' disAbleInp') + '" ' + (sup.ifSupplierPack ? '' : 'readonly') + ' value="' + (sup.supplierPackFee != null ? sup.supplierPackFee : '') + '"></td>\
                       <td><input stockPackFee type="text" class="layui-input'+ (sup.ifSupplierPack ? ' disAbleInp' : '') + '" ' + (sup.ifSupplierPack ? 'readonly' : '') + ' value="' + (sup.stockPackFee != null ? sup.stockPackFee : '') + '"></td>\
                       <td><input note type="text" class="layui-input" value="' + (sup.note || '') + '"></td>\
                       <td><input ifDefault type="checkbox" disabled lay-skin="primary" ' + (sup.ifDefault ? 'checked' : '') + '/></td>\
                       <td><input supplierId origin-data="' + (sup.supplierId || '') + '" type="hidden" class="layui-input" value="' + (sup.supplierId || '') + '">' + removeBtn_supplier + setDefaultBtn_productlistSupplier + '</td>'
      } else {
        tr += '<td><div style="width:100%;position:relative">\
                           <input supplierName type="text" class="layui-input supplierInfo" value="' + (sup.supplierName || '') + '">\
                           <ul class="supplierUl productlistSearch"></ul>\
                        </div>\
                   </td>\
                   <td><div title="' + ((sup.urlValid != null && sup.urlValid == false) ? '链接已经失效' : '') + '"><input purchaseUrl type="text" maxlength="1000" class="layui-input supplier_purchaseurl ' + ((sup.urlValid != null && sup.urlValid == false) ? 'fRed' : '') + '"  value="' + (sup.purchaseUrl || '') + '" style="float: left;width: 99%"><span class="relativeContains"><a onclick="redirectTo(this)" target="_blank" style="height: 32px;line-height: 32px; cursor:pointer"><i style="font-size:12px" class="layui-icon layui-icon-lianjie"></i></a></span></div></td>\
                   <td><input minOrderNum type="text" class="layui-input" value="' + (sup.minOrderNum || '') + '"></td>\
                   <td><input quote type="text" readonly class="layui-input disAbleInp" value="' + (sup.quote || '') + '"></td><td class="provideidentification">' + provideIdentification + '</td><td class="ifDivision">' + ifDivision + '</td>\
                   <td><input articleNo type="text" class="layui-input" value="' + (sup.articleNo || '') + '"></td>\
                   <td><input purBaseNum type="text" placeholder="正数" class="layui-input" value="' + (sup.purBaseNum || '') + '"></td>\
                   <td><input prodPrice type="text" placeholder="正数" class="layui-input" value="' + (sup.prodPrice || '') + '" onblur="productlist_calSupplierQuote(this)"></td>\
                   <td><input ifSupplierPack type="checkbox" class="layui-input" lay-skin="primary" ' + (sup.ifSupplierPack ? 'checked' : '') + ' lay-filter="productlist_supplierRefTab_ifSupplierPack"></td>\
                   <td><input supplierPackFee type="text" onblur="productlist_calSupplierQuote(this)"  class="layui-input'+ (sup.ifSupplierPack ? '' : ' disAbleInp') + '" ' + (sup.ifSupplierPack ? '' : 'readonly') + ' value="' + (sup.supplierPackFee != null ? sup.supplierPackFee : '') + '"></td>\
                   <td><input stockPackFee type="text" class="layui-input'+ (sup.ifSupplierPack ? ' disAbleInp' : '') + '" ' + (sup.ifSupplierPack ? 'readonly' : '') + ' value="' + (sup.stockPackFee != null ? sup.stockPackFee : '') + '"></td>\
                   <td><input note type="text" class="layui-input" maxlength="200" value="' + (sup.note || '') + '"></td>\
                   <td><input attrStr readonly type="text" class="layui-input disAbleInp" value="' + (sup.attrStr || '') + '"/><input hidden offerId value="' + (sup.offerId || '') + '"/><input hidden specId value="' + (sup.specId || '') + '"/></td>\
                   <td><input ifDefault type="checkbox" disabled lay-skin="primary" ' + (sup.ifDefault ? 'checked' : '') + '/></td>\
                   <td><input supplierId origin-data="' + (sup.supplierId || '') + '" type="hidden" class="layui-input" value="' + (sup.supplierId || '') + '">' + matchAli1688SkuInfo + refreshAli1688SkuInfo + clearMatch + removeBtn_supplier + setDefaultBtn_productlistSupplier + '</td>'
      }
      tr += '</tr>'
      $('.supplierRefTab_productlist tbody').append(tr)
      layui.form.render('checkbox', 'prodSupplierRef_productlistDetailPop')
    }
    /***供应商信息表的增删 */
    function supplierInfoTble (ifList) {
      //点击新增按钮
      $('.addOneLine_productlist').click(function () {
        addsupplierTbody(null, ifList)
      })
      //监听input获取焦点事件
      $('.supplierRefTab_productlist tbody').on('focus input propertychange', '.supplierInfo', function () {
        searchSupplier(this)
      })
      //监听input失去焦点事件
      $('.supplierRefTab_productlist tbody').on('blur', '.supplierInfo', function () {
        var self = this
        // 置空
        window.setTimeout(function () {
          let supplierIdInp = $(self).closest('tr').find('input[supplierId]')
          let originSupplierId = supplierIdInp.attr('origin-data')
          supplierIdInp.val('')
          // 找到id
          var li = $(self).next().find('li')
          var value = $(self).val()
          if (!value) {
            return
          }
          var id
          for (var i = 0; i < li.length; ++i) {
            if (li[i].innerText == value) {
              id = li[i].getAttribute('supplierid')
            }
          }

          // 隐藏可选列表
          hideSupplierUl(self)
          if (!id) {
            layer.msg('无该供应商')
            return
          }
          $(self).closest('tr').find('[supplierId]').val(id)

          // 若果更换了供应商，清空匹配信息
          if (id !== originSupplierId) {
            clearMatch_productlist(self)
          }
        }, 500);
      });
      // 监听采购url是否变更 offerId
      $('.supplierRefTab_productlist tbody').on('blur', '.supplier_purchaseurl', function () {
        let self = this
        // 获取当前行的匹配情况
        let offerId = $(self).closest('tr').find('[offerId]').val()
        if (!offerId) {
          return
        }
        // 截取offerId
        if (self.value.indexOf('https://detail.1688.com/offer/') < 0) {
          // 如果非1688链接，清除匹配信息
          clearMatch(this)
          return
        }
        let curOfferId = self.value.substring(self.value.indexOf('/offer/') + 7, self.value.indexOf('.htm'))
        console.log(curOfferId)
        // 若更换了链接，清空匹配信息
        if (curOfferId !== offerId) {
          clearMatch_productlist(self)
        }
      });
    }
    /**
         * 获取并渲染子商品详情
         * @param sSku
         * @param ifNotSetId  复制新增时， 查询商品详情，不要渲染id
         * @param ifAdd
         */
    function getSubDetail (sSku, ifNotSetId, ifAdd) {
      loading.show()
      $.ajax({
        type: 'post',
        url: ctx + '/product/getSubDetail.html',
        dataType: 'json',
        data: { 'sSku': sSku },
        success: function (returnData) {
          loading.hide()
          var obj = returnData.data
          //图片
          if (returnData.data.image) {
            let imageArr = returnData.data.image.split('||')
            for (let i = 0; i < imageArr.length; ++i) {
              $('#image_edit' + i).html('<img src=' + tplIVP + imageArr[i] + ' class=\'imgCss img_show_hide\' style=\'width:150px;height:150px;border:1px solid #f2f2f2\' />')
            }
          }

          $.each(obj, function (key) {
            if (key != 'logisAttrList' && key != 'isSale') {
              $('#addSSkuForm' + ' [name="' + key + '"]').val(obj[key])
            }
          })
          if (ifNotSetId) {
            $('#addSSkuForm [name=id]').val('')
          }
          // 记录原始值
          if (obj.buyerId != null) {
            $('#addSSkuForm [name=buyerId]').attr('originValue', obj['buyerId'])
          } else {
            $('#addSSkuForm [name=buyerId]').attr('originValue', '0')
            $('#addSSkuForm [name=buyerId]').val('0')
          }
          $('#addSSkuForm [name=buyer]').attr('originValue', obj['buyer'])
          $('#addSSkuForm [data-id=prodPSku]').attr('originValue', obj.parent.pSku)

          $('#addSSkuForm [data-id=prodPSku]').val(obj.parent.pSku)
          $('#addSSkuForm [data-id=bizzOwner]').val(obj.parent.bizzOwner)
          $('#addSSkuForm [data-id=responsor]').val(obj.parent.responsor)
          $('#addSSkuForm [data-id=tags]').val(obj.parent.prodAttrList)
          $('#addSSkuForm [data-id=newCate]').val(obj.newCate && obj.newCate.cateName ? obj.newCate.cateName : '')
          $('#addSSkuForm [data-id=cate]').val(obj.cateDto.cateCnName)
          $('#addSSkuForm [data-id=devCate]').val(obj.cateDto.mgmtName)
          $('#addSSkuForm [data-id=baoguan_cn]').val(obj.cateDto.customsCnName)
          $('#addSSkuForm [data-id=baoguan_en]').val(obj.cateDto.customsEnName)
          $('#addSSkuForm [data-id=baoguan_value]').val(obj.cateDto.customsValue)
          $('#addSSkuForm [name=\'pId\']').val(obj.parent.id)
          $('#owner,#tags,#cate,#baoguan_cn,#baoguan_en,#baoguan_value,#devCate').attr('disabled', 'disabled')
          if (!obj.isSale) {
            $('#addSSkuForm #notSaleTimeStr').val(admin.Format(obj.notSaleTime, 'yyyy-MM-dd hh:mm:ss'))
          } else {
            $('#addSSkuForm [name=notSaleReason]').val('')
          }
          $('#addSSkuForm input[name=\'isSale\']').prop('checked', !obj.isSale)
          if (typeof (obj.isOutOfStock) != undefined) {
            $('#addSSkuForm [name=\'isOutOfStock\']').prop('checked', obj.isOutOfStock)
          }
          if (obj.logisAttrList) {
            var combLogisAttrList = obj.logisAttrList.split(',')
            for (var i = 0; i < combLogisAttrList.length; i++) {
              var checkAttr = $('#logisAttr :checkbox[value=\'' + combLogisAttrList[i] + '\']')
              checkAttr.prop('checked', true)
            }
          }
          // 独立包装
          if (obj.parent.isAlonePack) {
            $('#addSSkuForm #isAlonePack_prodsDetail').attr('checked', 'checked')
          }
          // 特殊包装
          if (obj.parent.isSpecialPack) {
            $('#addSSkuForm #isSpecialPack_prodsDetail').attr('checked', 'checked')
          }
          // 是否定制
          if (obj.isSpecialMake != null && obj.isSpecialMake != undefined) {
            $('#addSSkuForm [name=isSpecialMake]').val(obj.isSpecialMake ? '1' : '0')
          }
          if (typeof (obj.ifWithPlug) != undefined) {
            $('#addSSkuForm [name=\'ifWithPlug\']').prop('checked', obj.ifWithPlug)
          }
          // 审核结果设置
          $('#pl_auditResult').val(obj.auditStatus)
          $('#pl_auditDesc').val(obj.auditDesc)

          // 库位
          if (!ifAdd) {
            $('#addSSkuForm [name=stockLocation]').val(obj.whStockWarning ? obj.whStockWarning.stockLocation : '')
            $('#addSSkuForm [name=receiveAddressName]').text(obj.receiveAddressName ? obj.receiveAddressName : '')

          }
          // 供应商列表
          var supppliers = obj.supplier
          for (var i in supppliers) {
            var sup = supppliers[i]
            if (ifNotSetId) {
              sup.offerId = ''
              sup.specId = ''
              sup.attrStr = ''
            }
            addsupplierTbody(sup, false, ifAdd)
          }
          // 初始化包装重量
          getTotalWeight('#packspectag option:selected', '#addSSkuForm', '#totalWeight')
          layui.form.render('select')
          layui.form.render('checkbox')
        },
        error: function () {
          loading.hide()
          layer.msg('发送请求失败')
        }
      })
    }
    // 计算含包装重量和 包装价格
    function getTotalWeight (selectedOption, formSelector, id) {
      var mm = selectedOption

      // var unitCost = $(mm).attr('cost');
      var packWeight = $(mm).attr('weight')
      if (!packWeight) { // 如果未选择包装规格，则不继续计算
        return
      }
      $(formSelector + ' input[name=\'packWeight\']').val(packWeight)
      var skuWeight = $(formSelector + ' input[name=\'suttleWeight\']').val()
      var totalWeight
      if (skuWeight != '') {
        totalWeight = accAdd(parseFloat(skuWeight), parseFloat(packWeight))
        $(id).val(totalWeight)
      }
    }
    // 商品列表详情
    function openProdListDetail (data) {
      var detailIndex = layer.open({
        title: '商品详情',
        type: 1, //不加该属性,就会出现[object Object]
        area: ['100%', '80%'],
        id: 'show_subDetailId1',
        shadeClose: false,
        btn: ['关闭'],
        content: $('#prodlist_addProductLayer').html(),
        yes: function (index, layero) {
          layer.close(detailIndex);
        },
        success: function (layero, index) {
          initUploadImg()
          

          // 检查是否有新增供应商权限
          if ($('#ifAddSupplier_produclist').length > 0) {
            $('.addsupplierBtn_productlist').removeClass('disN')
          }
          // 子SKU  不可编辑
          $('#addSSkuForm [name=sSku]').attr('readonly', 'readonly')
          $('#addSSkuForm [name=sSku]').addClass('disAbleInp')

          // 初始化必填项
          initNotNull()

          // 初始化自定义选择框
          initHpSelect('#addSSkuForm')

          //1.初始化父sku事件
          initPSkuEvent('#addSSkuForm')

          // 新增供应商按钮点击事件
          newAddSupplier()
          //2. 表格增删
          supplierInfoTble()
          getLogisAttrList()
          getUnitConfigList()
          //6.底部栏的代码和样式
          if ($('#ifCheck_produclist').length > 0) {
            var $target = layero.find('.layui-layer-btn.layui-layer-btn-'),
              $html = `<div class="layui-form-item layui-form" style="position:absolute;bottom:-10px;width: 80%">
                                      <div class="layui-inline" style="float: left;">
                                          <select type="text" class="layui-input" id="pl_auditResult" placeholder="审核结果" style="height:30px">
                                          <option value=""></option>
                                          <option value="3">通过</option>
                                          <option value="4">失败</option>
                                          </select>
                                      </div> 
                                      <div class="layui-inline"  style="float: left;">
                                          <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" onclick="auditSub()">审核</button>
                                      </div>
                                      <div class="layui-inline"  style="float: left; width: 60%">
                                          <input type="text" class="layui-input" placeholder="审核备注" style="height:30px" id="pl_auditDesc">
                                      </div>           
                              </div>`
            $target.append($html)
          }
          getSubDetail(data.pSku)
          getProdLog('getProdOperLog', data.id, '#pl_subLogTbody')

          //ztt20230901查找货源
          layero.on('click', '.searchSupply', function () {
            let $img = $(this).parents('.layui-col-lg6').find('.productlist_imageEditDiv>img');
            if ($img.length > 0) {
              let imgSrc = $img.attr('src');
              commonSearchGoodsComponents(imgSrc);
            } else {
              layer.msg('请先黏贴图片', { icon: 7 });
            }
          });
        }
      })
    }
    function getLogisAttrList () {
      var layer = layui.layer,
        $ = layui.$,
        laytpl = layui.laytpl;
        let ajax = new Ajax(false)
        ajax.post({
          url: ctx + '/enum/getLogisAttrEnum.html',
          success: function (res) {
            if (res.code === '0000') {
              let data = {
                logisAttrList: res.data
              }
              laytpl($("#prodlist_logisAttrListLayer").html()).render(data, function(html){
                  $('#logisAttr').html(html)
              });
              layui.form.render()
            } else {
              layer.msg('初始化物流属性失败:' + res.msg)
            }
          }
        })
      }

      function getUnitConfigList () {
        var layer = layui.layer,
          $ = layui.$,
          laytpl = layui.laytpl;
          let ajax = new Ajax(false)
          ajax.post({
            url: ctx + '/product/getProductlistConfig',
            success: function (res) {
              if (res.code === '0000') {
                commonRenderSelect('unit', res.data.unitList, {
                     name: 'name',
                     code: 'name'
                 });
                 let str = '<option value="">请选择</option>'
                 res.data.packSpecList?.forEach(item => {
                  <!-- str += `<option value="${item.id}" weight="${item.weight}">${item.name}</option>` -->
                  str += '<option value="' + item.id + '" weight="'+ item.weight +'">' + item.name + '</option>'
                })
                 $('#packspectag').html(str)
                layui.form.render()
              }
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
  </script>
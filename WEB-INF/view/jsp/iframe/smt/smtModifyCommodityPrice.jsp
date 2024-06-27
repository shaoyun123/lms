<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <title>smt仅调整待调价商品价格</title>

        <style>
            .smtModifyCommodityNoteGreen {
                color: green;
            }

            .smtModifyCommodityNoteRed {
                color: red;
            }

            .smtModifyCommodityNoteBlue {
                color: blue;
            }
        </style>

        <div class="layui-fluid">
            <div class="layui-row layui-col-space15">
                <div class="layui-col-lg12 layui-col-md12">
                    <div class="layui-card">
                        <form class="layui-form" id="smtModifyCommodityPriceForm">
                            <input type="hidden" name="storeAcctIdList">
                            <div class="layui-form-item">
                                <div class="layui-col-md2">
                                    <div style="padding:0 15px;">活动名称:<span
                                            id="smtModifyCommodityPriceForm_activityName" class="ml10"></span></div>
                                </div>
                                <div class="layui-col-md2">
                                    <div class="layui-form-label">定价公式</div>
                                    <div class="layui-input-block">
                                        <select name="shippingType">
                                            <option value="">子SKU默认定价</option>
                                            <option value="BY_RULE">Listing默认定价</option>
                                            <option value="USD5_LESS_GENERAL"><5USD 普货</option>
                                            <option value="SPECIAL">特货</option>
                                            <option value="USD5_GREATER_GENERAL">≥5USD 普货</option>
                                            <option value="GENERAL_OLD">普货（旧版）</option>
                                            <option value="USD5_USD8_GENERAL">5-8美金普货</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="layui-col-md2">
                                    <div class="layui-form-label">利润率%</div>
                                    <div class="layui-input-block">
                                        <input type="number" class="layui-input" name="grossProfitRate">
                                    </div>
                                </div>
                                <div class="layui-col-md2">
                                    <div class="layui-form-label">优惠幅度%</div>
                                    <div class="layui-input-block">
                                        <input type="number" class="layui-input" name="discountRate">
                                    </div>
                                </div>
                                <div class="layui-col-md1 pl20">
                                    <button class="layui-btn layui-btn-sm" type="button"
                                        onclick="smtModifyCommodity_getPrice()">定价</button>
                                </div>
                                <div class="layui-col-md3">
                                    <label class="layui-form-label labelSel w120">
                                        <select name="priceType">
                                            <option value="curPrice">当前刊登价($)</option>
                                            <option value="curPriceCny">当前刊登价(￥)</option>
                                            <option value="newPrice">新刊登价($)</option>
                                            <option value="newPriceCny">新刊登价(￥)</option>
                                        </select>
                                    </label>
                                    <div class="layui-input-block disflex" style="margin-left: 80px;">
                                        <div style="width: 60px;">
                                            <select name="calculateType">
                                                <option value="1"><b>+</b></option>
                                                <option value="2">-</option>
                                                <option value="3" selected>*</option>
                                                <option value="4">=</option>
                                            </select>
                                        </div>
                                        <div style="width: 100px;">
                                            <input type="number" class="layui-input" name="newPriceInput">
                                        </div>
                                        <button type="button" id="smtModifyCommodityPricenewPriceBtn"
                                            class="layui-btn layui-btn-normal layui-btn-sm">一键应用</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <form action="" class="layui-form" id="smtModifyCommodityPriceFormTwo">
                            <div class="layui-form-item">
                                <div class="layui-col-md2"></div>
                                <div class="layui-col-md3">
                                    <div class="layui-form-label labelSel w100">
                                        <select name="diffPriceType">
                                            <option value="diffPrice">差价（$）</option>
                                            <option value="diffPriceCny">差价（￥）</option>
                                        </select>
                                    </div>
                                    <div class="layui-input-block disflex">
                                        <select name="opreator">
                                            <option value="">请选择</option>
                                            <option value=">">></option>
                                            <option value="<"><</option>
                                            <option value="=">=</option>
                                        </select>
                                        <input type="number" name='diffPrice' class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-col-md2 pl20">
                                    <button class="layui-btn layui-btn-sm" type="button"
                                        onclick="smtModifyCommodity_screen()">搜索</button>
                                    <button class="layui-btn layui-btn-sm" type="reset"
                                        onclick="smtModifyCommodity_reset()">清空</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="layui-card">
                        <div class="layui-tab ">
                            <div class="fixTab" style="padding: 0 10px;">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">数量(<span id="smtModifyCommodity_listCount"></span>)</li>
                                </ul>
                                <div>
                                    <button class="layui-btn layui-btn-sm" type="button"
                                        onclick="smtModifyCommodityPrice_batchEdit()">批量修改</button>
                                </div>
                            </div>
                        </div>
                        <div class="layui-tab-content">
                            <div id="smtModifyCommodityPriceTableId"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script id="smtModifyCommodityPriceTableTpl" type="text/html">
            <form class="layui-form">
                <div class="layui-form-item">
                    <table class="layui-table" id="smtModifyCommodityPriceTable" lay-filter="smtModifyCommodityPriceTable">
                        <thead>
                            <tr>
                                <th class="w30">
                                    <input type="checkbox" lay-skin="primary" name='allchecked' lay-filter="smtModifyCommodity_allCheked">
                                </th>
                                <th>店铺</th>
                                <th>Item ID</th>
                                <th>商品子SKU</th>
                                <th>店铺子SKU</th>
                                <th>销量</th>
                                <th>当前刊登价($)</th>
                                <th>当前刊登价(￥)</th>
                                <th>新刊登价($)</th>
                                <th>新刊登价(￥)</th>
                                <th>差价($)</th>
                                <th>差价(￥)</th>
                                <th>操作结果</th>
                            </tr>
                        </thead>
                        <tbody>
                            {{# layui.each(d,function(index,item){ }}
                                <tr data-id="{{item.id}}">
                                    <td class="taCenter w30"><input type="checkbox" lay-skin="primary" name='singlechecked' lay-filter="smtModifyCommodity_sCheked"></td>  
                                    <td class="taCenter"><div name="storeAcct">{{item.storeAcct || ''}}</div></td>    
                                    <td class="taCenter hidden"><div name="storeAcctId">{{item.storeAcctId || ''}}</div></td>    
                                    <td class="taCenter hidden"><div name="listId">{{item.id || ''}}</div></td>
                                    <td class="taCenter hidden"><div name="freightTemplateId">{{item.freightTemplateId || ''}}</div></td>
                                    <td class="taCenter"><div name='itemId'>{{item.itemId || ''}}</div></td>     
                                    <td class="taCenter"><div name="prodSSku">{{item.prodSSku || ''}}</div></td> 
                                    <td class="taCenter"><div name="storeSubSku">{{item.storeSubSku || ''}}</div></td> 
                                    <td class="taCenter">
                                        {{# if(item.sevenSales!=undefined && item.sevenSales!='' ){ }}
                                            <div><span style="color: #999;">7天销量：</span>{{item.sevenSales}}</div>
                                            {{# } }}
                                        {{# if(item.thirtySales!=undefined && item.thirtySales!='' ){ }}
                                            <div><span style="color: #999;">30天销量：</span>{{item.thirtySales}}</div>
                                            {{# } }}
                                    </td> 
                                    <td class="taCenter">
                                        <div id="smtModifyCommodity_price_{{item.id}}" name="price">{{item.price || ''}}</div>
                                    </td> 
                                    <td class="taCenter">
                                        <div id="smtModifyCommodity_priceCny_{{item.id}}" name="priceCny">{{item.priceCny || ''}}</div>
                                    </td> 
                                    <td class="taCenter">
                                        <input value="{{item.newPrice || ''}}" name="newPrice" class="layui-input" 
                                            type="number" id="smtModifyCommodity_newPrice_{{item.id}}" data-id="{{item.id}}" 
                                            onblur="smtModifyCommodityPrice_blurNewP(this)"
                                        />
                                    </td>
                                    <td class="taCenter">
                                        <input value="{{item.newPriceCny || ''}}" name="newPriceCny" class="layui-input" 
                                            type="number" id="smtModifyCommodity_newPriceCny_{{item.id}}" data-id="{{item.id}}" 
                                            onblur="smtModifyCommodityPriceCny_blurNewP(this)"
                                        />
                                    </td>  
                                    <td class="taCenter">
                                        <div id="smtModifyCommodity_diffPrice_{{item.id}}" name='diffPrice'>
                                            {{item.diffPrice || ''}}
                                        </div>
                                    </td>
                                    <td class="taCenter">
                                        <div id="smtModifyCommodity_diffPriceCny_{{item.id}}" name='diffPriceCny'>
                                            {{item.diffPriceCny || ''}}
                                        </div>
                                    </td> 
                                    <td class="taCenter w200"><div id="smtModifyCommodity_result_{{item.id}}" class="{{item.result=='与原值相同不修改'?'smtModifyCommodityNoteGreen':item.result=='调价成功'?'smtModifyCommodityNoteBlue':'smtModifyCommodityNoteRed'}} w200">{{item.result || ''}}</div></td> 
                                </tr>
                            {{#  }) }}
                        </tbody>
                    </table>
                </div>
            </form>
        </script>

        <script type="text/javascript" src="${ctx}/static/js/publishs/aliexpress/smtModifyCommodityPrice.js"></script>
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
            color: #666 !important; /* 设置你想要的颜色值 */
        }
        .calItem .layui-form-label {
            width: 70px;
        }
        .expand {
            color: #438eb9;
            cursor: pointer;
            text-align: center;
        }
    </style>
    <script type="text/javascript" src="${ctx}/static/js/commodity/template/newdevdetail.js"></script>
    <script type="text/javascript" src="${ctx}/static/js/work/develop/enum.js"></script>
    <script>var prepIVP = '${prepIVP}';</script>
    <%-- 竞品链接 --%>
        <script type="text/html" id="newdevdetail_detailPop">
    <div style="padding: 20px 5px 0 0;">
        <div class="layui-tab layui-tab-card">
            <ul class="layui-tab-title" id="newdevdetail_detail_layer_tab">
                <li class="layui-this">商品详情</li>
            </ul>
            <div class="layui-tab-content">
                <div class="layui-tab-item layui-show">
                    <form class="layui-form" id="newdevDetail_preProdEditFrom" lay-filter="newdevDetail_preProdEditFrom" disabled>
                        <input type="hidden" name="id">
                        <!-- 图片 -->
                        <div class="layui-form-item">
                            <div class="layui-col-md7 layui-col-lg7">
                                <!-- 产品类目 -->
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font color='red'>*</font>新类目</label>
                                    <div class="layui-input-block">
                                        <div id="newdevdetail_xtreeDetailDiv"></div>
                                    </div>
                                </div>
                                <!-- 开发类型 -->
                                <div class="layui-form-item" id="devType">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label"><font color='red'>*</font>开发类型</label>
                                        <div class="layui-input-block">
                                            <select name="type" lay-verify="required" lay-search="" id="preProdEditFrom_devtype" lay-filter="preProdEditFrom_devtype"></select>
                                            <!-- <input class="layui-input" name="type" disabled> -->
                                        </div>
                                    </div>
                                    <!-- 适用节日 -->
                                    <!-- <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">适用节日</label>
                                        <div class="layui-input-block">
                                            <input class="layui-input" name="festival" disabled>
                                        </div>
                                    </div> -->
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">商品标签</label>
                                        <div class="layui-input-block">
                                            <select
                                                name="prodTags"
                                                xm-select="newdevelop_prodTags"
                                                id="newdevelop_prodTags"
                                                xm-select-search
                                                xm-select-search-type="dl"
                                                xm-select-skin="normal"
                                            ></select>
                                        </div>
                                    </div>
                                </div>

                                <!-- 父sku -->
                                <div class="layui-form-item">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">父SKU</label>
                                        <div class="layui-input-block">
                                            <input type="text" name="pSku" class="layui-input">
                                        </div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <label class="layui-form-label">产品库id</label>
                                        <div class="layui-input-block">
                                            <input name="prodHotSaleId" class="layui-input">
                                        </div>
                                    </div>
                                    
                                </div>
                                <!-- 中文名称 -->
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font color='red'>*</font>中文名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="cnName" lay-verify="title" placeholder="请输入中文名"
                                               class="layui-input">
                                    </div>
                                </div>
                                <!-- 英文名称 -->
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><font color='red'>*</font>英文名称</label>
                                    <div class="layui-input-block">
                                        <input type="text" name="enName" lay-verify="required" placeholder="请输入英文名"
                                               class="layui-input">
                                    </div>
                                </div>
                                <div class="layui-form-item" notNull>
                                    <label class="layui-form-label "><font color='red'>*</font>物流属性</label>
                                    <div class="layui-input-block" id="newdevelop_logisticAttr">
                                        <!-- <c:forEach items="${logisAttrList}" var="logisAttr">
                                            <input type='checkbox' lay-skin='primary' name='logisticAttr' title='${logisAttr.name}' value='${logisAttr.name}'>
                                        </c:forEach> -->
                                    </div>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <label class="layui-form-label"><font color='red'>*</font>图片</label>
                                <div class="layui-input-block" id="newdevdetail_imageDiv">
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevdetail_imageEditDiv" id="newdevdetail_image_edit0" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevdetail_imageEditDiv" id="newdevdetail_image_edit1" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevdetail_imageEditDiv" id="newdevdetail_image_edit2" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                    </div>
                                    <div class="layui-col-md6 layui-col-lg6">
                                        <div in='innerImage' class="newdevdetail_imageEditDiv" id="newdevdetail_image_edit3" style='width:150px;height:150px;border:1px solid #ccc' contenteditable="true"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <div class="layui-col-md7 layui-col-lg7">
                                <div class="layui-form-item calItem">
                                    <label class="layui-form-label">成本(￥)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="cost" class="layui-input" style="width: 120px" oninput="changeTotalValue(this)">
                                    </div>
                                    <label class="layui-form-label">重量(g)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="weight" class="layui-input" style="width: 120px" oninput="changeTotalValue(this)">
                                    </div>
                                    <label class="layui-form-label">产品价值</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="totalValue" class="layui-input" style="width: 120px">
                                    </div>
                                    <label class="layui-form-label">毛利率(%)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="grossProfitRate" id="grossProfitRateInput" class="layui-input" value="15" style="width: 120px">
                                    </div>
                                </div>
                                <div class="layui-form-item calItem">
                                    <label class="layui-form-label">外箱长(cm)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="outerBoxLength" class="layui-input" style="width: 120px">
                                    </div>
                                    <label class="layui-form-label">外箱宽(cm)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="outerBoxWidth" class="layui-input" style="width: 120px">
                                    </div>
                                    <label class="layui-form-label">外箱高(cm)</label>
                                    <div class="layui-input-inline" style="width: 120px">
                                        <input name="outerBoxHeight" class="layui-input" style="width: 120px">
                                    </div>
                                    <a class="layui-btn layui-btn-sm" style="margin-left: 5px" id="newDevCalculate">计算</a>
                                </div>
                                <div id="priceTable">
                                    <table class='layui-table'>
                                        <thead>
                                        <tr>
                                            <th>平台</th>
                                            <th>站点</th>
                                            <th>计费重(g)</th>
                                            <th>毛利率</th>
                                            <th>销售价($)</th>
                                            <th>竞品价($)</th>
                                            <th>差异(%)</th>
                                            <th>操作</th>
                                        </tr>
                                        </thead>
                                        <tbody id="priceList_Tbody" class="layui-form" lay-filter="priceList_Tbody">
            
                                        </tbody>
                                    </table>
                                    <div class="expand" onclick="expandAll()">展开所有</div>
                                </div>
                            </div>
                            <div class="layui-col-md4 layui-col-lg4">
                                <!-- 备注 -->
                                <div class="layui-form-item layui-form-text">
                                    <label class="layui-form-label">备注</label>
                                    <div class="layui-input-block">
                                        <textarea name="devNote" placeholder="开发备注" class="layui-textarea" style="height: 200px"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <fieldset class="layui-elem-field layui-field-title">
                            <legend style="font-size:14px;font-weight:700">fba定价</legend>
                        </fieldset>
                        <div>
                            <div class="layui-col-md8 layui-col-lg8">
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">总数量</label>
                                    <div class="layui-input-block lineHeight36" id="newdevdetail_totalFbaProdDeliverAmount">0</div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">总商品成本￥</label>
                                    <div class="layui-input-block lineHeight36" id="newdevdetail_totalFbaProdCost">0</div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">总运费成本￥</label>
                                    <div class="layui-input-block lineHeight36" id="newdevdetail_totalFbaFreightFee">0</div>
                                </div>
                                <div class="layui-col-md3 layui-col-lg3">
                                    <label class="layui-form-label">总成本￥</label>
                                    <div class="layui-input-block lineHeight36" id="newdevdetail_totalFbaCost">0</div>
                                </div>
                            </div>
                            <table class='layui-table'>
                                <thead>
                                <tr>
                                    <th width="100px">子sku</th>
                                    <th width="200px"><span class="fRed">*</span>款式名称</th>
                                    <th width="150px">包装方式</th>
                                    <th><span class="fRed">*</span>成本￥</th>
                                    <th><span class="fRed">*</span>重量g</th>
                                    <th><span class="fRed">*</span>发货长cm</th>
                                    <th><span class="fRed">*</span>发货宽cm</th>
                                    <th><span class="fRed">*</span>发货高cm</th>
                                    <th>发货国家</th>
                                    <th><span class="fRed">*</span>预估定价</th>
                                    <th><span class="fRed"></span>快递利润率%</th>
                                    <th>空派利润率%</th>
                                    <th>海运利润率%</th>
                                    <th><span class="fRed">*</span>发货数量</th>
                                </tr>
                                </thead>
                                <tbody id="newdevdetail_detail_fbaProdTbody" class="layui-form" lay-filter="newdevdetail_detail_fbaProdTbody">
                                </tbody>
                            </table>
                        </div>
                    </form>
                    <!-- 竞品数据 -->
                    <fieldset class="layui-elem-field layui-field-title">
                        <legend style="font-size:14px;font-weight:700">竞品数据</legend>
                    </fieldset>
                    <div>
                        <table class='layui-table'>
                            <thead>
                            <tr>
                                <th><span class="fRed">*</span>平台</th>
                                <th><span class="fRed">*</span>站点</th>
                                <th><span class="fRed">*</span>链接</th>
                                <th><span class="fRed">*</span>销量</th>
                                <th>销售额</th>
                                <th><span class="fRed">*</span>价格</th>
                                <th><span class="fRed">*</span>币种</th>
                                <th>是否相似品</th>
                                <th>评分</th>
                                <th>类目排名</th>
                                <th>上架时间</th>
                                <th>提交人</th>
                                <th>提交时间</th>
                            </tr>
                            </thead>
                            <tbody id="newdevDetail_compList_editTbody" class="layui-form" lay-filter="newdevDetail_compList_editTbody">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>

</script>
<script id="priceTableContainer1" type="text/html">
    {{# layui.each(d ||[], function(index, item){ }}
        <tr>
            <td>{{item.platCode || ''}}</td>
            <td>{{item.siteCode || ''}}</td>
            <td name="weight1">{{item.weight || ''}}</td>
            <td>
                <input type="text" name="grossProfitRate" class="layui-input" value="{{item.grossProfitRate || ''}}">
            </td>
            <td name="salePrice">{{item.price || ''}}</td>
            // 竞品价 每个平台不同
            <td>
                <input type="text" name="comPrice" class="layui-input" value="{{item.comPrice }}" oninput="changeComPrice(this)">
            </td>
            <td>{{ item.diffVal || ''}}</td>
            <td>
                <button type="button" class="layui-btn layui-btn-xs" onclick="newDevCalculateRow(this)">计算</button>
            </td>
            <td style="display: none" name="priceName">{{ item.priceName }}</td>
            <td style="display: none" name="comPriceName">{{ item.comPriceName }}</td>
            <td style="display: none" name="cost1">{{ item.cost }}</td>
        </tr>
        {{# }); }}

</script>
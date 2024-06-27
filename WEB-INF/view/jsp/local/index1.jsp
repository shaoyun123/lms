<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
    <link rel="stylesheet" href="${ctx}/static/cropper.css" />
    <style>
        .hide {
            display: none;
        }
        .title_hp{
            font-size: 20px;
            font-weight: bold;
        }
        .title_hp2{
            font-size: 18px;
            font-weight: bold;
        }

        .index1_matting_layer_btn{
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            display: flex;
            justify-content: space-between;
        }
        .matting_drag::before {
            content: "";
            width: 2px;
            height: 100%;
            position: absolute;
            top: 0;
            left: 15px;
            background: #1E9FFF;
        }
        .matting_drag {
            height:calc(100% - 17px);
            position: absolute;
            left: 0;
            top:0;
            width: 32px;
            cursor: pointer;
        }
        .fullImg {
            position: relative;
            width: 150px;
            height: 150px;
            margin: 20px 10px 0px 50px;
            border: 1px dashed #ccc;
        }
        #cropImg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        #cropImg:not([src]){
            opacity: 0;
        }
        .chooseBtn {
            position: absolute;
            bottom: 0;
            right: 0;
            /* width: 80px; */
            height: 20px;
            padding: 0 5px;
            font-size: 12px;
            line-height: 20px;
            background: rgb(241,158,75);
            color: #fff;
            cursor: pointer;
        }
        #croppingImg {
            object-fit: contain;
        }
        .image-info {
            width: 100%;
            height: 360px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 10px 45px;
            overflow-y: auto;
            box-sizing: border-box;
        }
        .info-item {
            width: 32%;
            height: 150px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            box-shadow: 1px 1px 15px 1px #e7e3e3;
        }
        .info-left {
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .info-center {
            flex: 1;
            padding: 10px;
        }
        .info-right {
            flex: 1;
            padding: 10px;
            position: relative;
        }
        .image-content {
            width: 100%;
            height: 100px;
        }
        .info-item:last-child:nth-child(3n + 2) {
            margin-right: calc((100% - 32%) / 2);
        }
        .tag-status {
            position: absolute;
            width: 60px;
            height: 20px;
            /* padding: 0 9px; */
            font-size: 12px;
            line-height: 20px;
            right: 0px;
            text-align: center;
            background-color: rgb(236, 245, 255);
            border: 1px solid rgb(217, 236, 255);
            color: rgb(64, 158, 255);
            border-radius: 4px;
        }
        #purchaseTimeout {
            display: none;
        }
        .pointHandImg {
            width:100%;
        }
        .pointHandImg img {
            width:inherit
        }
        #smallTools img{
            height: 58px;
        }
        #smallTools {
            height: 280px !important;
        }
        #index_dashboard_notice_showSearch {
            left:80px;
            right:unset;
        }
        #index_dashboard_notice .index_dashboard_notice_icon{
            margin-top: -10px;
            font-size: 20px;
            font-weight: bold;
        }
        #index_dashboard_notice .blackBtnBg{
            color: #333;
        }
        #index_dashboard_notice .layui-timeline-item{
            padding-bottom: 10px;
        }
        #index_dashboard_notice .blueBtnBg{
            color: rgb(30,149,255);
        }
        #index_dashboard_notice .layui-timeline-item:hover{
            cursor: pointer;
        }
    </style>
    <div class="layui-fluid">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-md5 layui-col-lg4">
                        <div class="layui-card">
                            <div class="layui-card-header">快捷方式</div>
                            <div class="layui-card-body">

                                <div class="layui-carousel layadmin-carousel layadmin-shortcut" id="shortcutbox">
                                    <div carousel-item>
                                        <ul class="layui-row layui-col-space10">
                                            <li class="layui-col-xs3">
                                                <a lay-href="route/commodity/process/outofstock">
                                                    <i class="layui-icon layui-icon-website"></i>
                                                    <cite>缺货流程</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a lay-href="route/commodity/template/producttpl">
                                                    <i class="layui-icon layui-icon-find-fill"></i>
                                                    <cite>基础模板</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a lay-href="route/commodity/product/productlist">
                                                    <i class="layui-icon layui-icon-loading-2"></i>
                                                    <cite>商品列表</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a lay-href="route/work/develop/newdevelop">
                                                    <i class="layui-icon layui-icon-home"></i>
                                                    <cite>新品开发</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade-web#/shopee/operate/taskcenter" target="_blank">
                                                    <span style="display: inline-block;width: 100%;background: #F8F8F8;">
                                                        <img src="${ctx}/static/img/taskcenterlogo.webp" height="60">
                                                      </span>
                                                    <cite>任务中心</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui#/eBay/operation/payments" target="_blank">
                                                    <i class="layui-icon layui-icon-tree"></i>
                                                    <cite>eBay Payments</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui#/purchase/purchase/cancelorder" target="_blank">
                                                    <i class="layui-icon layui-icon-console"></i>
                                                    <cite>采购-取消订单</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="https://chatgpt.epean.cn/" target="_blank">
                                                    <!-- <i class="layui-icon layui-icon-survey"></i> -->
                                                    <span style="display: inline-block;width: 100%;background: #10a37f;">
                                                      <img src="${ctx}/static/img/chatgpt2.png" height="60">
                                                    </span>
                                                    <cite>ChatGPT</cite>
                                                </a>
                                            </li>
                                        </ul>
                                        <ul class="layui-row layui-col-space10">
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui#/multiplatform/prod/shopeeprod" target="_blank">
                                                    <i class="layui-icon layui-icon-survey"></i>
                                                    <cite>Shopee商品</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui/#/multiplatform/deliver/shipmentplan" target="_blank">
                                                    <i class="layui-icon layui-icon-survey"></i>
                                                    <cite>货件计划</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                               <a href="/trade_ui/#/multiplatform/deliver/distributepackage" target="_blank">
                                                    <i class="layui-icon layui-icon-survey"></i>
                                                    <cite>配货包装</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui/#/multiplatform/deliver/shipmentaccess" target="_blank">
                                                    <i class="layui-icon layui-icon-survey"></i>
                                                    <cite>货件存取</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui/#/multiplatform/config/framemanage" target="_blank">
                                                    <i class="layui-icon layui-icon-survey"></i>
                                                    <cite>框号管理</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui/#/multiplatform/config/address" target="_blank">
                                                    <i class="layui-icon layui-icon-survey"></i>
                                                    <cite>收货地址</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a lay-href="route/configuration/store/joomAccount">
                                                    <i class="layui-icon layui-icon-cart-simple"></i>
                                                    <cite>joom店铺</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a href="/trade_ui#/fba/productInfo/fbaselection" target="_blank">
                                                    <i class="layui-icon layui-icon-cart-simple"></i>
                                                    <cite>FBA选品管理</cite>
                                                </a>
                                            </li>
                                        </ul>

                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="layui-card">
                            <div class="layui-card-header">小工具</div>
                            <div class="layui-card-body">
                                <div class="layui-carousel layadmin-carousel layadmin-shortcut" id="smallTools" style="height: 280px;background-color: #fff;">
                                    <div carousel-item>
                                        <ul
                                            class="layui-row layui-col-space10"
                                            style="background-color: #fff"
                                        >
                                            <li class="layui-col-xs3">
                                                <a
                                                    class="pointHand pointHandImg"
                                                    id="index1_spaceTransform"
                                                    href="/lms/#/route/virturl/tool/spacetransform"
                                                >
                                                    <img
                                                    src="${ctx}/static/img/wrapCommaConversionLogo.jpg"
                                                    />
                                                    <cite>换行逗号转换</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a class="pointHand pointHandImg" id="index1_createUCP_EAN">
                                                    <img src="${ctx}/static/img/UPC&EANGeneratorLogo.jpg" />
                                                    <cite>UCP&EAN生成器</cite>
                                                </a>
                                            </li>
                                            <!-- <li class="layui-col-xs3">
                                                <a class="pointHand pointHandImg" id="index1_queryStoreSkuPopBtn">
                                                    <img src="${ctx}/static/img/storeSkuSearchLogo.jpg" />
                                                    <cite>店铺sku查询</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a class="pointHand pointHandImg" id="index1_customerServiceSearch">
                                                    <img
                                                    src="${ctx}/static/img/saleCustomerSearchLogo.jpg"
                                                    />
                                                    <cite>销售客服查询</cite>
                                                </a>
                                            </li> -->
                                            <li class="layui-col-xs3">
                                                <a class="pointHand pointHandImg" id="index1_orderSearch">
                                                    <img src="${ctx}/static/img/orderSearchLogo.jpg" />
                                                    <cite>订单查询</cite>
                                                </a>
                                            </li>
                                            <!-- <li class="layui-col-xs3">
                                                <a class="pointHand pointHandImg" id="index1_findSource">
                                                    <img
                                                    src="${ctx}/static/img/findProductSourceLogo.jpg"
                                                    />
                                                    <cite>查找货源</cite>
                                                </a>
                                            </li> -->
                                            <li class="layui-col-xs3">
                                                <a
                                                    class="pointHand pointHandImg"
                                                    href="/lms/#/route/warehouse/check/skucheck"
                                                >
                                                    <img src="${ctx}/static/img/skuImgSearchLogo.jpg" />
                                                    <cite>SKU图片查询</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a
                                                    class="pointHand pointHandImg"
                                                    href="/lms/#/route/virturl/tool/searchimg"
                                                >
                                                    <img src="${ctx}/static/img/findImgByImgLogo.jpg" />
                                                    <cite>以图搜图</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a
                                                    class="pointHand pointHandImg"
                                                    id="index1_matting"
                                                    href="/lms/#/route/virturl/tool/mattingpic"
                                                >
                                                    <img src="${ctx}/static/img/mattingLogo.jpg" />
                                                    <cite>抠图</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a
                                                    class="pointHand pointHandImg"
                                                    href="/lms/#/route/virturl/tool/collectimg"
                                                >
                                                    <img src="${ctx}/static/img/collectImgModuleLogo.jpg" />
                                                    <cite>采集图片模块</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a class="pointHand pointHandImg link" href="javascript:void(0);" name="virturltoolbatchsearchimg">
                                                    <span style="display: inline-block;width: 100%;background: #F8F8F8;">
                                                        <img src="${ctx}/static/img/batchSearchImg.png" height="60">
                                                      </span>
                                                    <cite>批量以图搜图</cite>
                                                </a>
                                            </li>
                                            <li class="layui-col-xs3">
                                                <a
                                                    class="pointHand pointHandImg"
                                                    href="/lms/#/route/virturl/tool/setprice"
                                                >
                                                    <img src="${ctx}/static/img/priceToolLogo.jpg" />
                                                    <cite>定价工具</cite>
                                                </a>
                                            </li>
                                        </ul>
                                        <ul class="layui-row layui-col-space10">
                                            <li class="layui-col-xs3">
                                                <a class="pointHand pointHandImg" id="index1_saveSmtCookie">
                                                    <img src="${ctx}/static/img/saveSmtCookieLogo.jpg" />
                                                    <cite>保存速卖通cookie</cite>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                            <div class="layui-card">
                                <div class="layui-card-header">下载</div>
                                <div class="layui-card-body">
                            <div style="display:flex">
                                <div>
                                    <div style="padding: 10px 0;">
                                        <a href="http://47.91.141.44/epeanPrint.zip" target="_blank" lay-tips="打印插件，下载后解压缩，点开exe文件即可使用" style="color: blue;"> 打印插件下载</a>
                                        <a href="http://47.91.141.44/epeanPrint32.zip" target="_blank" lay-tips="打印插件，下载后解压缩，点开exe文件即可使用" style="color: blue;padding-left: 80px;"> 打印插件下载(32位电脑)</a>
                                    </div>
                                    <div style="padding: 10px 0;">
                                        <a href="http://47.91.141.44/epean_plugin.rar" target="_blank" lay-tips="亚马逊跟卖插件，下载后解压缩，打开chrome扩展程序导入使用" style="color: blue;"> 跟卖插件下载</a>
<%--                                        <a href="${imgHttpsAddress}/lms/package/epean-chrome-plugin.zip" target="_blank" lay-tips="信息采集插件，下载后解压缩，打开chrome扩展程序导入使用" style="color: blue;padding-left: 80px;"> 信息采集插件下载</a>--%>
                                        <a style="color: blue;padding-left: 80px;" id="instructionsUsing_informationCollectionPlugin"> 信息采集插件使用说明</a>
                                    </div>
                                </div>
                                <div style="padding: 5px 30px">
                                    <a style="padding-left:15px;" href="${ctx}/static/img/${appQrCode}" target="_blank"> <img src="${ctx}/static/img/${appQrCode}" width="50" height="50" > </a>
                                    <div>仓库APP下载</div>
                                </div>
                            </div>
                                </div>
                            </div>
                    </div>
                    <div class="layui-col-md7 layui-col-lg8">
                        <div class="layui-card">
                            <div class="layui-card-header">异常业务数据</div>
                            <div class="layui-card-body" style="height: 185px;overflow-y: auto;">
                                <span style="color: red;">listing 同步失败</span>
                                <ul class="layui-row layui-col-space10" style="padding: 10px;">
                                    <li class="layui-col-xs2 disN">
                                        <a href="javascript:linkStore('route/configuration/store/wishAccount');">
                                            wish(<span id="index_wish_fail_num"></span>)
                                        </a>
                                    </li>
                                    <li class="layui-col-xs2 disN">
                                        <a href="javascript:linkStore('route/configuration/store/ebayAccount');">
                                            ebay(<span id="index_ebay_fail_num"></span>)
                                        </a>
                                    </li>
                                    <li class="layui-col-xs2 disN">
                                        <a href="javascript:linkStore('route/configuration/store/aliexpressAccount');">
                                            aliexpress(<span id="index_aliexpress_fail_num"></span>)
                                        </a>
                                    </li>
                                    <li class="layui-col-xs2 disN">
                                        <a href="javascript:linkStore('route/configuration/store/amazonAccount');">
                                            amazon(<span id="index_amazon_fail_num"></span>)
                                        </a>
                                    </li>
                                    <li class="layui-col-xs2 disN">
                                        <a href="/trade-web#/configure/store/shopeeaccount">
                                            shopee(<span id="index_shopee_fail_num"></span>)
                                        </a>
                                    </li>
                                    <li class="layui-col-xs2 disN">
                                        <a href="javascript:linkStore('route/configuration/store/joomAccount');">
                                            joom(<span id="index_joom_fail_num"></span>)
                                        </a>
                                    </li>
                                    <li class="layui-col-xs2 disN">
                                        <a href="javascript:linkStore('route/configuration/store/lazadaAccount');">
                                            lazada(<span id="index_lazada_fail_num"></span>)
                                        </a>
                                    </li>
                                </ul>
                                <span style="color: red;">七天内到期域名</span>
                                <ul class="layui-row layui-col-space10" style="padding: 10px;" id="expiredDomainNumber">
                                </ul>
                                <span style="color: red;" id="purchaseTimeout">采购超时未处理</span>
                                <ul class="layui-row layui-col-space10" style="padding: 10px;" id="purchaseTimeoutNumber">
                                </ul>
                            </div>
                        </div>
                        <!-- <div id="index_dashboardDiv">

                        </div> -->
                        <div id="index_dashboard_notice"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script type="text/html" id="index1_store_sku_pop">
        <div class="p20">
            <form action="" lay-filter="queryStoreSkuSearchForm_index1" class="layui-form" id="queryStoreSkuSearchForm_index1">
                <div class="layui-form-item ml20">
                    <div class="layui-col-md2 layui-col-lg2">
                        <input type="radio" name="skuType" title="子SKU" value="sSku" checked lay-filter="skuType_index1">
                        <input type="radio" name="skuType" title="父SKU" value="pSku" lay-filter="skuType_index1">
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">SKU</label>
                        <div class="layui-input-block">
                            <div class="index1_search_store_sku"></div>
                        </div>
                    </div>
                    <div class="layui-col-md3 layui-col-lg3">
                        <label class="layui-form-label">销售平台</label>
                        <div class="layui-input-block">
                            <select name="platCode">
              <option value="">全部</option>
              <option value="wish">wish</option>
              <option value="ebay">ebay</option>
              <option value="joom">joom</option>
              <option value="amazon">amazon</option>
              <option value="shopee">shopee</option>
              <%--<option value="smt">smt</option>--%>
              <option value="lazada">lazada</option>
            </select>
                        </div>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2 ml20">
                        <input type="checkbox" name="ifOnlySelf" lay-skin="primary" title="仅查本人管理店铺">
                        <input type="checkbox" name="ifOnlySysGen" lay-skin="primary" title="仅查系统生成(ebay)">
                        <button type="button" class="layui-btn layui-btn-sm" id="searchStoreSkuBtn_index">查询</button>
                    </div>
                </div>
                <hr/>
                <div class="layui-form-item">
                    <label class="layui-form-label ">店铺sku:</label>
                    <div class="layui-input-block">
                        <textarea type="text" name="storeSku" class="layui-textarea" style="height: 400px" disabled></textarea>
                    </div>
                </div>

            </form>
        </div>
    </script>

    <script type="text/html" id="index1_UCP_EANcreator">
        <div class="p20">
            <form action="" lay-filter="UCP_EANcreatorForm_index1" class="layui-form" id="UCP_EANcreatorForm_index1">
                <div class="layui-form-item ml20">
                    <div class="layui-col-md2 layui-col-lg2">
                        <select name="codeType" id="codeType" lay-filter="codeType">
            <option value="0">UPC for Amazon</option>
            <option value="1">UPC for eBay</option>
            <option value="2">EAN</option>
          </select>
                    </div>
                    <div class="layui-col-md2 layui-col-lg2" style="float:right">
                        <button class="layui-btn layui-btn-sm" id="createCode">生成</button>
                    </div>

                    <div class="layui-col-md12 layui-col-lg12" style="margin-top:10px">
                        <textarea name="codetextarea" id="codetextarea" class="layui-textarea" rows="15"></textarea>
                    </div>
                </div>
            </form>
        </div>
    </script>

    <script type="text/html" id="index1_customerServiceSearchTpl">
        <div style="padding-top:20px;">
            <div class="customerServiceSearchForm">
                <div class="layui-col-md12">
                    <form id="storeAcctSalesPersonIdForm" class="layui-form" style="padding-right:20px;">
                        <div class="layui-form-item">
                            <div class="layui-col-md4">
                                <label class="layui-form-label">店铺名称</label>
                                <div class="layui-input-block">
                                    <select id="customerService_storeAcct" name="storeAcct" xm-select="customerService_storeAcct" xm-select-skin="normal" xm-select-search="${ctx}/acctPerson/queryAllStoreAcct.html">
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md4">
                                <label class="layui-form-label">销售员</label>
                                <div class="layui-input-block">
                                    <select id="customerService_salesPerson" name="salesPerson" xm-select="customerService_salesPerson" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>

                            <div class="layui-col-md4">
                                <label class="layui-form-label">客服人员</label>
                                <div class="layui-input-block">
                                    <select id="customerService_customServicer" name="customServicer" xm-select="customerService_customServicer" xm-select-search xm-select-search-type="dl" xm-select-skin="normal">
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4">
                                <label class="layui-form-label">普源别名</label>
                                <div class="layui-input-block">
                                    <input type="text" class="layui-input" id="puYuanAlias" name="puYuanAlias">
                                </div>
                            </div>
                            <div class="layui-col-md4">
                                <label class="layui-form-label">店铺状态</label>
                                <div class="layui-input-block">
                                    <select id="storeStatus" name="storeStatus">
                                        <option value=''>请选择<option>
                                        <option value='1'>启用<option>
                                        <option value='0'>停用<option>
                                    </select>
                                </div>
                            </div>
                            <div class="layui-col-md4">
                                <div class="layui-input-block">
                                    <a class="layui-btn layui-btn-sm" id="searchStoreAcctSalePersonId">搜索</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="customerServiceSearchTable" style="padding: 0 20px;">
              <table class="layui-table" id="storeAcctSalePersonId"></table>
            </div>
        </div>
    </script>
<%-- 保存速卖通cookie --%>
<script type="text/html" id="index1_saveSmtCookie_layer">
    <div style="padding: 20px;">
        <div class="layui-form-item">
            <div class="layui-form-item">
                <label class="layui-form-label">xman_us_t:</label>
                <div class="layui-input-block">
                    <textarea name="getSmtCookie" class="layui-textarea" placeholder="请输入速卖通cookie：xman_us_t"></textarea>
                </div>
            </div>
        </div>
        <div>获取cookie步骤：</br>
            1.选择谷歌账号登录成功后，鼠标右键，点击检查</br>
            2.选择应用---Cookie---https://www.aliexpress.com/---xman_us_t</br>
            <a target="_blank" style="color: #0000EE;cursor: pointer;" href="https://imghz.epean.com.cn/trade/736261793270800file-read-34153.png">图片步骤详情</a>
        </div>
    </div>
</script>

<!-- 订单查询 -->
<script type="text/html" id="index1_orderSearch_layer">
  <div style="padding: 20px;">
    <form class="layui-form">
        <div class="layui-form-item">
          <div class="layui-inline">
            <label class="layui-form-label">店铺单号</label>
            <div class="layui-input-inline">
              <input type="text" name="platOrderIdStr" autocomplete="off" class="layui-input" placeholder="多个使用逗号隔开">
            </div>
          </div>
          <div class="layui-inline">
            <label class="layui-form-label">订单编号</label>
            <div class="layui-input-inline">
              <input type="text" name="idStr" autocomplete="off" class="layui-input" placeholder="多个使用逗号隔开">
            </div>
          </div>
          <div class="layui-inline">
            <label class="layui-form-label">跟踪号</label>
            <div class="layui-input-inline">
              <input type="text" name="logisTrackingNoStr" autocomplete="off" class="layui-input" placeholder="多个使用逗号隔开">
            </div>
          </div>
          <div class="layui-inline">
            <label class="layui-form-label">
              <span class="layui-btn layui-btn-sm search">查询</span>
            </label>
          </div>
        </div>
    </form>
    <div>
      <table class="layui-table" id="index1_orderSearch_layerTable">
          
      </table>
    </div>
</div>
</script>

<!-- 公告 -->
<script type="text/html" id="index_dashboard_notice_tpl">
  {{#  if(d.isEdit){ }}
        <div class="layui-card">
            <div class="layui-card-header disFCenter">
                <div>
                    <span>公告管理</span>
                </div>
                <div id="index_dashboard_notice_switch" class="disFCenter">
                    <permTag:perm funcCode="index_dashboard_notice_auth_switch">
                        <svg t="1709697021568" class="icon pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1473" width="24" height="24"><path d="M918.429 328l13.856 24c8.837 15.305 3.594 34.876-11.711 43.712A32 32 0 0 1 904.573 400H72a8 8 0 0 1-8-8v-56a8 8 0 0 1 8-8h763.289l-106.24-184.003a16 16 0 0 1 0-16l30.023-51.998a8 8 0 0 1 13.856 0L918.428 328zM105.57 696l-13.856-24c-8.837-15.305-3.594-34.876 11.711-43.712A32 32 0 0 1 119.427 624H952a8 8 0 0 1 8 8v56a8 8 0 0 1-8 8H188.711l106.24 184.003a16 16 0 0 1 0 16l-30.023 51.998a8 8 0 0 1-13.856 0L105.572 696z" fill="#5090F1" p-id="1474"></path></svg>
                    </permTag:perm>
                </div>
            </div>
            <div class="layui-card-body">
                <div style="height: 280px;">
                    <div class="disFCenter">
                        <button type="button" class="layui-btn layui-btn-sm layui-btn-normal" id="index_dashboard_notice_management_add">新建</button>
                        <div class="disflex">
                                <input type="text" id="index_dashboard_notice_management_time" name="time" class="layui-input" style="width: 350px;" autocomplete="off" placeholder="请选择时间">
                            <div class="w50" style="flex:none">
                                <i class="layui-icon ml10 blue index_dashboard_notice_icon pointer" id="index_dashboard_notice_management_search">&#xe615;</i>
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <table class="layui-table" id="index_dashboard_notice_management_table" lay-filter="index_dashboard_notice_management_table"></table>
                </div>
            </div>
        </div>

    {{# }else{ }}
        <div class="layui-card">
            <div class="layui-card-header disFCenter">
                <div>
                    <span>系统公告</span>
                    <i class="layui-icon ml10 blue index_dashboard_notice_icon pointer" id="index_dashboard_notice_showSearch">&#xe615;</i>
                </div>
                <div id="index_dashboard_notice_switch" class="disFCenter">
                    <permTag:perm funcCode="index_dashboard_notice_auth_switch">
                        <svg t="1709697021568" class="icon pointer" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1473" width="24" height="24"><path d="M918.429 328l13.856 24c8.837 15.305 3.594 34.876-11.711 43.712A32 32 0 0 1 904.573 400H72a8 8 0 0 1-8-8v-56a8 8 0 0 1 8-8h763.289l-106.24-184.003a16 16 0 0 1 0-16l30.023-51.998a8 8 0 0 1 13.856 0L918.428 328zM105.57 696l-13.856-24c-8.837-15.305-3.594-34.876 11.711-43.712A32 32 0 0 1 119.427 624H952a8 8 0 0 1 8 8v56a8 8 0 0 1-8 8H188.711l106.24 184.003a16 16 0 0 1 0 16l-30.023 51.998a8 8 0 0 1-13.856 0L105.572 696z" fill="#5090F1" p-id="1474"></path></svg>
                    </permTag:perm>
                    
                </div>
            </div>
            <div class="layui-card-body">
                <div id="index_dashboard_notice_sys_part">
                    <form class="layui-form disN mb10" id="index_dashboard_notice_form">
                        <div class="disFCenter">
                            <div style="width:300px;flex:none">
                                <input type="text" id="index_dashboard_notice_form_time" name="time" class="layui-input" autocomplete="off" placeholder="请选择公告时间">
                            </div>
                            <input type="text" name="content" placeholder="请输入公告内容" autocomplete="off" class="layui-input ml10" id="index_dashboard_notice_form_content">
                            <div class="w50" style="flex:none">
                                <i class="layui-icon ml10 blue index_dashboard_notice_icon pointer" id="index_dashboard_notice_form_submit">&#xe615;</i>
                            </div>
                            <div class="w100 taRight" style="flex:none">
                                <input type="checkbox" name="readOnlyUnread" title="仅看未读" lay-skin="primary">
                            </div>
                        </div>
                    </form>
                    <div id="index_dashboard_notice_timeline" style="height: 280px;overflow-y: auto"></div>
                </div>
            </div>
        </div>
    {{#} }}
</script>

<!-- 表格标题 -->
<script type="text/html" id="index_dashboard_notice_management_table_title">
    {{#if(d.status!=='已发布'){ }}
        <permTag:perm funcCode="index_dashboard_notice_auth_edit">
            <div class="{{d.haveContent ? 'blueBtnBg pointer' : 'fRed pointer'}}" lay-event="editNotice">
                <div>{{Format(d.expectPublishTime,"yyyy-MM-dd hh:mm:ss")}} {{d.title || ""}}</div>
                <div>{{d.haveContent ? '':'无内容'}}</div>
            </div>
        </permTag:perm>
        <permTag:lacksPerm funcCode="index_dashboard_notice_auth_edit">
            <div class="{{d.haveContent ? '' : 'fRed'}}">
                <div>{{Format(d.expectPublishTime,"yyyy-MM-dd hh:mm:ss")}} {{d.title || ""}}</div>
                <div>{{d.haveContent ? '':'无内容'}}</div>
            </div>
        </permTag:lacksPerm>
        {{# }else{ }}
        <div class="{{d.haveContent ? '' : 'fRed'}}">
            <div>{{Format(d.expectPublishTime,"yyyy-MM-dd hh:mm:ss")}} {{d.title || ""}}</div>
            <div>{{d.haveContent ? '':'无内容'}}</div>
        </div>
        {{#} }}
</script>

<!-- 表格按钮 -->
<script type="text/html" id="index_dashboard_notice_management_toolbar">
    <input name="id" value="{{d.id}}" class="disN"/>
    {{#if(d.status!=='已发布'){ }}
        <!-- 设置权限 -->
        <permTag:perm funcCode="index_dashboard_notice_auth_edit">
            <span class="blueBtnBg ml10 pointer" lay-event="editNotice">编辑</span>
        </permTag:perm>
        {{#if(d.haveContent){ }}
        <!-- 设置权限 -->
        <permTag:perm funcCode="index_dashboard_notice_auth_publish">
            <span class="blueBtnBg ml10 pointer" lay-event="publishNotice">发布</span>
        </permTag:perm>
            {{#} }}
        {{#}else{ }}
        <!-- 设置权限 -->
        <permTag:perm funcCode="index_dashboard_notice_auth_revoke">
            <span class="redBtnBg ml10 pointer" lay-event="revokeNotice">撤回</span>
        </permTag:perm>
        {{#} }}
    <span class="greenBtnBg ml10 pointer" lay-event="logNotice">日志</span>
</script>

<!-- 已发布公告列表 -->
<script type="text/html" id="index_dashboard_notice_timeline_tpl">
    {{#if(d.length){ }}
    <ul class="layui-timeline">
        {{#layui.each(d,function(_,item){ }}
            <li class="layui-timeline-item" id="index_dashboard_notice_timeline_li_{{item.id}}"  data-id="{{item.id}}">
                <i class="{{item.isRead ? 'layui-icon layui-timeline-axis blackBtnBg' :'layui-icon layui-timeline-axis blueBtnBg'}}">&#xe63f;</i>
                <div class="layui-timeline-content layui-text" data-id="{{item.id}}">
                    <div class="disflex">
                        <h3 class="{{item.isRead ? 'layui-timeline-title blackBtnBg' :'layui-timeline-title blueBtnBg'}}">{{ layui.admin.Format(item.publishTime, "yyyy-MM-dd hh:mm:ss")}}</h3>
                        <h3  class="{{item.isRead ? 'layui-timeline-title ml10 blackBtnBg' :'layui-timeline-title ml10 blueBtnBg'}}">{{item.title}}</h3>
                    </div>
                  <div>
                    {{#if(item.sysNoticeInfoList && item.sysNoticeInfoList.length){ }}
                        {{#layui.each(item.sysNoticeInfoList,function(_,elem){ }}
                            <div>{{elem.content}}</div>
                            {{#}) }}
                            {{#} }}
                  </div>
                </div>
            </li>
            {{# }) }}
        </ul>
            {{#}else{ }}
        <div>暂无数据</div>
        {{#} }}
</script>

<script type="text/html" id="index_dashboard_notice_timeline_li_tpl">
        <i class="{{d.isRead ? 'layui-icon layui-timeline-axis blackBtnBg' :'layui-icon layui-timeline-axis blueBtnBg'}}">&#xe63f;</i>
        <div class="layui-timeline-content layui-text" data-id="{{d.id}}">
            <div class="disflex">
                <h3 class="{{d.isRead ? 'layui-timeline-title blackBtnBg' :'layui-timeline-title blueBtnBg'}}">{{ layui.admin.Format(d.publishTime, "yyyy-MM-dd hh:mm:ss")}}</h3>
                <h3  class="{{d.isRead ? 'layui-timeline-title ml10 blackBtnBg' :'layui-timeline-title ml10 blueBtnBg'}}">{{d.title}}</h3>
            </div>
            <div>
            {{#if(d.sysNoticeInfoList && d.sysNoticeInfoList.length){ }}
                {{#layui.each(d.sysNoticeInfoList,function(_,elem){ }}
                    <div>{{elem.content}}</div>
                    {{#}) }}
                    {{#} }}
            </div>
        </div>
</script>

<script type="text/html" id="index_dashboard_notice_detail_tpl">
    <div class="layui-card" id="index_dashboard_notice_detail">
        <div class="layui-card-header">{{d.title}}</div>
        <div class="layui-card-body">{{d.richTextContent ? d.richTextContent:'暂无数据'}}</div>
    </div>
</script>

<script type="text/html" id="index_dashboard_notice_log">
    <div class="layui-card-body">
        {{#layui.each(d,function(index,item){ }}
            <div class="{{index==0 ?'disFCenter':'disFCenter mt10'}}">
                <div>
                    <span>{{item.creator}}</span>
                    <span class="ml10">{{item.remark}}</span>
                </div>
                <div id="index_dashboard_notice_log_{{item.id}}"></div>
            </div>
            {{# }) }}
    </div>
</script>

<script type="text/html" id="index_dashboard_notice_editor_tpl">
    <div class="layui-card-body">
        <div>
            <form class="layui-form" lay-filter="index_dashboard_notice_editor_form" id="index_dashboard_notice_editor_form">
                <div class="layui-form-item">
                    <div class="layui-col-lg4 layui-col-md4">
                        <label class="layui-form-label" style="width: 90px;"><font class="fRed">*</font>预计上线时间</label>
                        <div class="layui-input-block"  style="margin-left: 120px;">
                           <input name="expectPublishTime" id="index_dashboard_notice_editor_expectPublishTime" class="layui-input"/>
                        </div>
                    </div>
                    <div class="layui-col-lg8 layui-col-md8">
                        <label class="layui-form-label">标题</label>
                        <div class="layui-input-block">
                            <input name="title" class="layui-input" maxlength="50" id=""/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div id="index_dashboard_notice_editor"></div>
    </div>
</script>


    <script src="${ctx}/static/layui/jszip.min.js?v=${ver}"></script>
    <script src="${ctx}/static/layui/saveFile.js"></script>
    <script src="${ctx}/static/util/downloadImage.js"></script>
    <script src="${ctx}/static/jquery-ui.min.js"></script>
    <script src="${ctx}/static/utils.js"></script>
    <script src="${ctx}/static/searchGroup.js"></script>
    <script src="${ctx}/static/Cropper.js"></script>
    <script src="${ctx}/static/jquery-cropper.js"></script>

    <script>
        //加载 controller 目录下的对应模块
        /*

          小贴士：
            这里 console 模块对应 的 console.js 并不会重复加载，
            然而该页面的视图则是重新插入到容器，那如何保证能重新来控制视图？有两种方式：
              1): 借助 layui.factory 方法获取 console 模块的工厂（回调函数）给 layui.use
              2): 直接在 layui.use 方法的回调中书写业务代码，即:
                  layui.use('console', function(){
                    //同 console.js 中的 layui.define 回调中的代码
                  });

          这里我们采用的是方式1。其它很多视图中采用的其实都是方式2，因为更简单些，也减少了一个请求数。

        */

        $.ajax({
            type: "post",
            url: ctx + "/salesplat/countPlatSyncFailStore.html", //(必填) json数组
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == "0000") {
                    for (var i = 0; i < returnData.data.length; i++) {
                        var obj = returnData.data[i];
                        var platCode = obj.plat_code;
                        var id = "index_" + platCode + "_fail_num";
                        $("#" + id).html(obj.num);
                        $("#" + id).parent().parent().show();
                    }
                } else {
                    layer.msg(returnData.msg, {
                        icon: 5
                    });
                }
            },
            error: function(e) {
                layer.msg("发送请求失败", {
                    icon: 5
                });
            }
        });

        layui.use('carousel', function() {
            var carousel = layui.carousel;
            //建造实例
            carousel.render({
                elem: '#shortcutbox',
                width: '100%', //设置容器宽度
                autoplay: false,
                // interval: 6000,
                arrow: 'none' //始终显示箭头
                    //,anim: 'updown' //切换动画方式
            });
            carousel.render({
                elem: '#smallTools',
                width: '100%', //设置容器宽度
                autoplay: false,
                arrow: 'none' //始终显示箭头
            });
            
        });

        function linkStore(href) {
            $("#LAY_app").append("<input type='hidden' id='index_sync_fail_store' value='4'></input>")
            location.hash = "#/" + href;
        }
        function linkJumpDomin(href){
            window.location.hash = '#/'+href;
        }

        function jumpAndSearch(redirectUrl, param) {
            console.log(redirectUrl)
            if (redirectUrl) {
                // 本地缓存参数以供消费
                sessionStorage.setItem('lastJumpParam', JSON.stringify(param));
                window.location.hash = '#/'+ redirectUrl;
            }
        }

        function newJumpAndSearch(redirectUrl, param, platCode){
            if (redirectUrl) {
                sessionStorage.setItem('lastJumpParam', JSON.stringify(param));
                window.location.hash = '#/'+ redirectUrl;
            }
            if(platCode && platCode != 'wish'&&platCode != 'ebay'&&platCode != 'joom'&&platCode != 'fyndiq'&&platCode != 'Shopify'&&platCode != 'Walmart'){
                if(sessionStorage.getItem("lastJumpParam") != ''&&sessionStorage.getItem("lastJumpParam") != null&&sessionStorage.getItem("lastJumpParam") != undefined){
                    setTimeout(function(){
                        $("#"+ platCode +"AcctSearchForm").append("<input name='refreshTokenExpiryTime' type='hidden'><input name='refreshTokenSevenExpiryTime' type='hidden'>");
                        $("#"+ platCode +"AcctSearchForm [name=refreshTokenExpiryTime]").val((!!JSON.parse(sessionStorage.getItem("lastJumpParam")).time?JSON.parse(sessionStorage.getItem("lastJumpParam")).time:''))
                        $("#"+ platCode +"AcctSearchForm [name=refreshTokenSevenExpiryTime]").val((!!JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime?JSON.parse(sessionStorage.getItem("lastJumpParam")).sevenDayTime:''))
                        $("#"+ platCode +"Search").trigger('click');
                        sessionStorage.clear("lastJumpParam")
                    },1000)
                }
            }
        }
        
        function setJump(obj) {
            let originText = $(obj).find('.purchaseName').text() || ''
            let params = {}
            let url = ''
            if (originText === '缺货') {
                // 缺货页面 条件 商品状态:在售 找供应商:无 有无预计到货时间：无
                params = {
                    isSale: 1,
                    findSupplyType: '0',
                    expectedArrivalTimeType: 0
                }
                url = 'route/commodity/process/outofstock'
            }
            if (originText === '不需要物流') {
                // 采购订单页面 条件 快递单号：不需要物流 未完全入库
                params = {
                    order: '不需要物流',
                    searchOrderNoType: '3'
                }
                url = 'route/purchases/purchases/purchaseOrder'
            }
            if (originText === '降价通知') {
                // 降价通知页面 条件 处理状态：未处理 商品状态：在售
                params = {
                    isSale: 1
                }
                url = 'route/purchases/purchases/loweringNotice'
            }
            if (originText === '包装费') {
                // 产品问题反馈页面 条件 单数套袋 处理状态：未处理 商品状态：在售
                params = {
                    issueType: '单数套袋',
                    isHandle: 0,
                    isSale: 'true'
                }
                url = 'route/warehouse/process/feedback'
            }
            newJumpAndSearch(url, params, '');
        }


        ;(function(){
            commonReturnPromise({
                url: ctx + '/salesplat/countPlatDomainOverTimeStore.html'
            }).then(function(result){
                var $ul =$('#expiredDomainNumber');
                var liStr = '';
                for(var i=0; i<result.length; i++){
                    var item = result[i];
                    var platCode = item.plat_code;
                    if(platCode != "lazada" && platCode !== 'aliexpress'){
                    var totalNum = item.num;
                    liStr+=`<li class="layui-col-xs2">
                        <a href="javascript:linkJumpDomin('route/configuration/store/\${platCode}Account');">
                            \${platCode}(<span>\${totalNum}</span>)
                        </a>
                    </li>`;
                    }
                }
                $ul.append(liStr);
            }).catch(function(err){
                layer.msg(err,{icon:2});
            })

            // 采购超时未处理
            commonReturnPromise({
                url: ctx + '/outofStock/getIndexHtmlOutOfStockPurchaseMsg'
            }).then(function(result){
                var $ul =$('#purchaseTimeoutNumber');
                var liStr = '';

                result?.forEach(item => {
                    liStr+=`<li class="layui-col-xs2">
                        <a href="javascript:;" onclick="setJump(this)">
                            <span class="purchaseName">\${item.name}</span>
                            <span>(\${item.num})</span>
                        </a>
                    </li>`;
                })
                if (result?.length > 0) {
                    $("#purchaseTimeout").show()
                }
                
                $ul.append(liStr);
            }).catch(function(err){
                console.log(err)
                layer.msg(err,{icon:2});
            })



            function index_queryDashboard() {
                let ajax = new Ajax()
                ajax.post({
                    url: '/dashboard/getWorkToDoMap',
                    success: function (res) {
                        // console.log(res)
                        if (res.code === '0000') {
                            index_showDashboard(res.data)
                        } else {
                            layer.msg('加载工作面板失败：' + res.msg)
                        }
                    }
                })
            }
            index_queryDashboard()

            let dashboardList = {
                '开发专员' : {
                    '新品': {
                        '待发布': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `0`,typeStr: `12,13`}'},
                        '待初审': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `11`,typeStr: `12,13`}'},
                        '待组长审核': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `21`,typeStr: `12,13`}'},
                        '待主管审核': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `31`, managerAuditStatus: `0`,typeStr: `12,13`}'},
                        '待老板审核': {redirectUrl: 'route/work/develop/newdevelop', param: '{managerAuditStatus: `1`, bossAuditStatus: `0`,typeStr: `12,13`}'},
                        '审核失败': {redirectUrl: '', param: ''},
                        '待完善采购': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `31`,typeStr: `12,13`}'},
                        '待采样': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `41`,typeStr: `12,13`}'},
                        '待提交发货需求': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `43`,requireDeliver: `false`,typeStr: `12,13`}'},
                        '待开发完成': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `61`,typeStr: `12,13`}'}
                    },
                    '商品': {
                        '待发布': {redirectUrl: 'route/commodity/product/productlist', param: '{auditStatus: `0`, devType: `亚马逊精品,亚马逊精铺`}'},
                        '待审核': {redirectUrl: 'route/commodity/product/productlist', param: '{auditStatus: `1`, devType: `亚马逊精品,亚马逊精铺`}'},
                        '审核失败': {redirectUrl: 'route/commodity/product/productlist', param: '{auditStatus: `4`, devType: `亚马逊精品,亚马逊精铺`}'},
                    },
                    '模板': {
                        '待创建': {redirectUrl: '', param: '{auditStatus: "0"}'},
                        '待发布': {redirectUrl: 'route/commodity/template/producttpl', param: '{auditStatus: `0`, devTypes: `亚马逊精品,亚马逊精铺`}'},
                        '待审核': {redirectUrl: 'route/commodity/template/producttpl', param: '{auditStatus: `1`, devTypes: `亚马逊精品,亚马逊精铺`}'},
                        '审核失败': {redirectUrl: 'route/commodity/template/producttpl', param: '{auditStatus: `4`, devTypes: `亚马逊精品,亚马逊精铺`}'},
                    },
                },
                '开发组长' : {
                    '': {
                        '新品待审核': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `11`,typeStr: `12,13`}'},
                        '商品待审核': {redirectUrl: 'route/commodity/product/productlist', param: '{auditStatus: `1`, devType: `亚马逊精品,亚马逊精铺`}'},
                    }
                },
                '开发主管' : {
                    '': {
                        '新品待审核': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `31`, managerAuditStatus: `0`,typeStr: `12,13`}'},
                    }
                },
                '初审专员' : {
                    '': {
                        '新品待审核': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `11`,typeStr: `12,13`}'},
                    }
                },
                '采购助理' : {
                    '': {
                        '待采样': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `41`,typeStr: `12,13`}'},
                        '待提交样品': {redirectUrl: 'route/work/develop/newdevelop', param: '{currentStatusStr: `43`,typeStr: `12,13`}'},
                    }
                },
                'BOSS' : {
                    '': {
                        '新品待审核': {redirectUrl: 'route/work/develop/newdevelop', param: '{managerAuditStatus: `1`, bossAuditStatus: `0`,typeStr: `12,13`}'},
                    }
                },
                'amazon主管' : {
                    '': {
                        '待分配销售': {redirectUrl: 'route/work/develop/processFbaDev', param: '{hasSales: `false`}'},
                    }
                },
                'amazon专员' : {
                    '': {
                        '待建ASIN': {redirectUrl: 'route/work/develop/processFbaDev', param: '{hasAsin: `false`,hasSales: `true`}'},
                        '待建货件计划': {redirectUrl: 'route/work/develop/processFbaDev', param: '{hasShipmentId: `false`,hasSales: `true`}'},
                        '待优化Listing': {redirectUrl: 'route/work/develop/processFbaDev', param: '{auditStatus: `0`,hasSales: `true`, tplHasAudit: `true`}'},
                        '待做CPC': {redirectUrl: 'route/work/develop/processFbaDev', param: '{hasCpc: `0`,hasSales: `true`}'},
                        'CPC未生效': {redirectUrl: 'route/work/develop/processFbaDev', param: '{cpcAmount: 0,hasSales: `true`}'},
                        'Listing审核失败': {redirectUrl: 'route/work/develop/processFbaDev', param: '{auditStatus: `3`,hasSales: `true`}'},
                    }
                },'amazon组长' : {
                    '': {
                        '待审核优化Listing': {redirectUrl: 'route/work/develop/processFbaDev', param: '{auditStatus: `1`}'},
                    }
                },'摄影专员' : {
                    '': {
                        '待摄影': {redirectUrl: 'route/commodity/process/selfphotograph', param: '{isComplete: `1`}'},
                    }
                },'美工专员' : {
                    '': {
                        '待美工': {redirectUrl: 'route/commodity/process/selfphotograph', param: '{isComplete: `2`}'},
                    }
                },'模板审核' : {
                    '': {
                        '待审核': {redirectUrl: 'route/commodity/template/producttpl', param: '{auditStatus: `1`, devTypes: `亚马逊精品,亚马逊精铺`}'},
                    }
                }
            }
            function index_showDashboard(data) {
                let containDiv = $('#index_dashboardDiv')
                let html = ''
                for (let i = 0; i < data.length; ++i) {
                    html += index_getOneDashbord(data[i])
                }
                containDiv.append(html)
            }

            function index_getOneDashbord(obj) {
                // 获取对应模块的状态map
                let subDash_statusKey = {}
                for (let i =0; i < obj.workList.length; ++i) {
                    for (let k = 0; k < obj.workList[i].statusList.length; ++k) {
                        subDash_statusKey[obj.workList[i].statusName + '_' + obj.workList[i].statusList[k].statusName] = obj.workList[i].statusList[k].num
                    }
                }
                // 角色名
                let oneCard = `<div class="layui-card">
                    <div class="layui-card">
                    <div class="layui-card-header title_hp">`+ obj.roleName +`</div>`
                // 根据角色名获取需要渲染的子模块
                let subDashboard = dashboardList[obj.roleName]
                for (let subDashboardName in subDashboard) {
                    oneCard += `<div>
                        <ul class="layui-row layui-col-space10" style="padding: 10px;">
                        <li class="layui-col-xs2 title_hp2">` + subDashboardName + `</li>`
                    for (let statusKey in subDashboard[subDashboardName]) {
                        if(statusKey=="待摄影"){
                        oneCard += `<li class="layui-col-xs2">
                            <a href="javascript:void(0);" name="commodityprocessselfphotograph" class="link">
                            <cite>${'${statusKey}'}(<span>${'${(subDash_statusKey[subDashboardName +"_"+ statusKey] || 0)}'}</span>)</cite>
                            </a>
                            </li>`
                        }else{
                        oneCard += `<li class="layui-col-xs2 `+ (subDashboard[subDashboardName][statusKey].redirectUrl && subDash_statusKey[subDashboardName +'_'+ statusKey] ? 'canClickEl' : '') +`" onclick="jumpAndSearch('`+ subDashboard[subDashboardName][statusKey].redirectUrl +`',` + subDashboard[subDashboardName][statusKey].param +`)" >`+ statusKey +`(<span>`+ (subDash_statusKey[subDashboardName +'_'+ statusKey] || 0) +`</span>)</li>`
                    }
                    }
                    oneCard += `</ul></div>`
                }
                oneCard += `</div></div></div>`
                return oneCard
            }

        })();
    </script>

<script type="text/html" id="index1_mailisShareTemplate">
    {{# if(d.storeStatus){ }}
    <div>启用</div>
    {{# }else {}}
    <div class="red">停用</div>
    {{# }}}
</script>

// 公告
<script src="${ctx}/static/js/dashboard/notice.js"></script> 
<script src="${ctx}/static/wangEditor/wangEditor.min.js"></script>
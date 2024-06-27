<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
  <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <%-- 定价工具 --%>
      <title>定价工具</title>
      <!--刊登预估价弹出框 -->
      <div class="layui-fluid" id="setPrice">
        <div class="layui-card" style="padding:20px 50px 0 20px">
          <div class="layui-tab-item layui-show">
            <form lay-filter="listingPriceForm_ptb1" class="layui-form" id="listingPriceForm_ptb1" autocomplete="false">
              <input hidden name="prodSId">
              <input hidden name="prodSTempId">
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label" lay-tips="min(采购单价，平均成本)+内包装成本">成本(￥)</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="price">
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">重量(g)</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="weight">
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">物流属性</label>
                <div class="layui-input-block">
                  <select id="logisAttrList" name="logisAttrList"></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">平台</label>
                <div class="layui-input-block">
                  <select id="platCodeList" name="setprice_platCodeList" lay-filter="setprice_platCodeList"
                    xm-select="setprice_platCodeList" xm-select-search xm-select-search-type="dl"
                    xm-select-skin="normal"></select>
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label"></label>
                <div class="layui-input-block">
                  <span class="layui-btn layui-btn-sm" onclick="reGetListingPrice()">定价</span>
                </div>
              </div>
              <div class="layui-col-md4 layui-col-lg4"></div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">外箱长(cm)</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="outerBoxLength">
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">外箱宽(cm)</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="outerBoxWidth">
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">外箱高(cm)</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="outerBoxHeight">
                </div>
              </div>
              <div class="layui-col-md2 layui-col-lg2">
                <label class="layui-form-label">毛利率(%)</label>
                <div class="layui-input-block">
                  <input type="text" class="layui-input" name="grossProfitRate" value="15" placeholder="如20%,填写20,下同">
                </div>
              </div>
            </form>

            <table class="layui-table" id="listingPriceTable_productTplButton1" style="margin-top: 20px"
              lay-filter="listingPriceTable_productTplButton1">
              </thead>
            </table>
          </div>
        </div>
      </div>
      <script type="text/html" id="grossRate_productTplButton">
        <input class="layui-input" name="grossRate">
      </script>
      <script type="text/html" id="listingPriceShow_productTplButton">
        <div name="listingPriceShow">{{d.listingPriceShow}}</div>
    </script>
      <script type="text/html" id="listingDollarShow_productTplButton">
        <div name="listingDollarShow">{{d.listingDollarShow}}</div>
    </script>
      <script type="text/html" id="listingPriceTable_productTplButton_bar">
      <span class="layui-btn layui-btn-sm" lay-event="update" >更新</span>
  </script>
      <script>
        var platPriceSort = [
          'aliexpress',
          'ebay美国国内仓', 'ebay美国虚拟仓', 'ebay加拿大国内仓', 'ebay英国国内仓', 'ebay英国虚拟仓', 'ebay澳大利亚国内仓', 'ebay澳大利亚虚拟仓', 'ebay法国国内仓', 'ebay德国国内仓', 'ebay西班牙国内仓', 'ebay意大利国内仓',
          'shopee新加坡', 'shopee马来西亚','shopee印尼', 'shopee泰国', 'shopee台湾', 'shopee菲律宾', 'shopee越南', 'shopee巴西', 'shopee墨西哥', 'shopee智利', 'shopee哥伦比亚', 'shopeecnsc', 'shopee波兰',
          'tiktok越南', 'tiktok泰国', 'tiktok马来西亚', 'tiktok新加坡', 'tiktok菲律宾', 'tiktok美国', 'tiktok全球',
          'amazon德国', 'amazon西班牙', 'amazon法国', 'amazon英国', 'amazon意大利', 'amazon荷兰', 'amazon瑞典', 'amazon波兰', 'amazon美国', 'amazon加拿大', 'amazon墨西哥', 'amazon澳大利亚', 'amazon日本',
          'lazada新加坡', 'lazada马来西亚', 'lazada印尼', 'lazada泰国', 'lazada菲律宾', 'lazada越南',
          'wish', 'walmart', 'joom', 
          'mercadoBrazil', 'mercadoMexico', 'mercadoColombia', 'mercadoChile', 'mercadoCBT',
          'daraz',
          'miravia',
          'fyndiq瑞典', 'fyndiq芬兰', 'fyndiq挪威', 'fyndiq丹麦', 'fyndiq美国',
          'temu美国'
        ]
        layui.use(['admin', 'form', 'table', 'laydate', 'upload', 'element', 'laytpl', 'formSelects'], function () {
          var $ = layui.$,
            admin = layui.admin,
            layer = layui.layer,
            laydate = layui.laydate,
            table = layui.table,
            upload = layui.upload,
            formSelects = layui.formSelects,
            form = layui.form,
            laytpl = layui.laytpl;
          form.render()
          getLogisAttrList()
          getPlatCodeAndLogisAjax().then((res) => {
            var arr = [];
            for (let i = 0; i < res.length; i++) {
              var temp = {};
              temp.name = res[i];
              temp.value = res[i];
              arr.push(temp);
            }
            formSelects.data('setprice_platCodeList', 'local', { arr: arr })
            form.render();


            layui.table.on('tool(listingPriceTable_productTplButton1)', function (obj) {
              var data = obj.data, //获得当前行数据
                layEvent = obj.event; //获得 lay-event 对应的值
              
                console.log('data', data.platCode)
              if (layEvent === 'update') {
                var Adata = {
                  price: $('#listingPriceForm_ptb1 [name=price]').val(),
                  weight: $('#listingPriceForm_ptb1 [name=weight]').val(),
                  logisAttrList: $('#listingPriceForm_ptb1 [name=logisAttrList]').val(),
                  platCodeNameList: [data.platCode],
                  grossProfitRate: $(obj.tr).find('[name=grossRate]').val() / 100,
                  siteName: data.siteName,
                  outerBoxLength: $('#listingPriceForm_ptb1 [name=outerBoxLength]').val() || 0,
                  outerBoxWidth: $('#listingPriceForm_ptb1 [name=outerBoxWidth]').val() || 0,
                  outerBoxHeight: $('#listingPriceForm_ptb1 [name=outerBoxHeight]').val() || 0
                }

                if (!Adata.price) {
                  layer.msg('请输入价格')
                  return
                }
                if (!Adata.weight) {
                  layer.msg('请输入重量')
                  return
                }
                if (!Adata.grossProfitRate) {
                  layer.msg('请输入毛利率')
                  return
                }
                loading.show()
                commonReturnPromise({
                  url:
                    ctx + "/preProdDev/getAllPirce",
                  type: "post",
                  params: JSON.stringify(Adata),
                  contentType: "application/json;charset=UTF-8",
                }).then((res) => {
                  loading.hide()
                  $(obj.tr).find('[name=listingPriceShow]').text(res[0]?.listingPriceShow)
                  $(obj.tr).find('[name=listingDollarShow]').text(res[0]?.listingDollarShow)

                }).catch(err => {
                  loading.hide()
                  layer.msg('发送请求失败')
                })
              }
            })
          })
        })
        // 平台和物流属性
        function getPlatCodeAndLogisAjax (platCode) {
          return commonReturnPromise({
            url: ctx + "/preProdDev/getAllPlatName",
          })
        }

        function getLogisAttrList () {
          let ajax = new Ajax(false)
          ajax.post({
            url: ctx + '/enum/getLogisAttrEnum.html',
            success: function (res) {
              if (res.code === '0000') {
                let logisAttrList = []
                for (let i = 0; i < res.data.length; ++i) {
                  logisAttrList.push(res.data[i].name)
                }
                commonRenderSelect('logisAttrList', logisAttrList, {
                  name: 'name',
                  code: 'name'
                });
                layui.form.render()
              } else {
                layer.msg('初始化物流属性失败:' + res.msg)
              }
            }
          })
        }

        // 更新
        function reGetListingPrice () {
          let platCodeNameList = []
          let platCodeList = $('#listingPriceForm_ptb1 [name=setprice_platCodeList]').val()
          if (platCodeList) {
            platCodeNameList = platCodeList?.split(',') || []
          } else {
            platCodeNameList = ["wish", "aliexpress", "walmart", "joom", "ebay", "shopee", "shopee_cnsc", "amazon", "lazada", "mercado", "miravia", "daraz", "fyndiq", "temu", "tiktok"]
          }
          let grossProfitRate = $('#listingPriceForm_ptb1 [name=grossProfitRate]').val()
          let grossProfitRateVal
          if (grossProfitRate === '0' || grossProfitRate) {
            grossProfitRateVal = grossProfitRate / 100
          } else {
            grossProfitRateVal = null
          }
          var data = {
            price: $('#listingPriceForm_ptb1 [name=price]').val(),
            weight: $('#listingPriceForm_ptb1 [name=weight]').val(),
            logisAttrList: $('#listingPriceForm_ptb1 [name=logisAttrList]').val(),
            platCodeNameList: platCodeNameList,
            grossProfitRate: grossProfitRateVal,
            outerBoxLength: $('#listingPriceForm_ptb1 [name=outerBoxLength]').val() || 0,
            outerBoxWidth: $('#listingPriceForm_ptb1 [name=outerBoxWidth]').val() || 0,
            outerBoxHeight: $('#listingPriceForm_ptb1 [name=outerBoxHeight]').val() || 0,
          }
          if (data.price == '' || data.weight === '') {
            return layer.msg('请输入成本和重量！')
          }

          ajaxTogetListingPrice(data)
        }

        function ajaxTogetListingPrice (data) {
          loading.show()
          commonReturnPromise({
            url:
              ctx + "/preProdDev/getAllPirce",
            type: "post",
            params: JSON.stringify(data),
            contentType: "application/json;charset=UTF-8",
          }).then((res) => {
            loading.hide()
            // 渲染表格
            if (res) {
              res.forEach(item => {
                if (item.platCode === 'daraz') {
                  item.sortIndex =  platPriceSort.indexOf(item.platCode)
                } else {
                  item.sortIndex = platPriceSort.indexOf(item.platCode + (item.siteName || '') + (item.stockLocationShow || ''))
                }
              })
              res.sort(function(a, b) {
                return a.sortIndex - b.sortIndex; // 按照 sortIndex 属性进行升序排序
              });
              let notExistSite = res.filter(item => item.sortIndex === -1)
              let existSite = res.filter(item => item.sortIndex !== -1)
              res = existSite.concat(notExistSite)
              layui.table.render({
                elem: "#listingPriceTable_productTplButton1",
                id: 'listingPriceTable_productTplButton1',
                data: res,
                cols: [
                  [
                    //标题栏
                    { field: 'platCode', title: '平台' },
                    { title: "站点", templet: '<div>{{(d.siteName || "") + (d.stockLocationShow || "")}}</div>' },
                    { title: "计费重", field: 'priceWeight' },
                    { title: "毛利率", templet: '#grossRate_productTplButton' },
                    { title: "销售价", templet: '#listingPriceShow_productTplButton' },
                    { title: "销售价($)", templet: '#listingDollarShow_productTplButton' },
                    //绑定工具条
                    { title: '操作', align: 'center', toolbar: '#listingPriceTable_productTplButton_bar', width: 100 }
                  ],
                ],
                page: false,
                limit: res.length,
                done: function () {

                }
              })
            }
          }).catch(err => {
            loading.hide()
            layer.msg('发送请求失败')
          })
        }


        function reCountListingPrice (self, platCode, site, isOverseasWh) {
          var data = {
            grossProfitRate: parseFloat($(self).parent().parent().find('.gpRate').val()) / 100,
            platCode: platCode,
            site: site + '',
            isOverseasWh: isOverseasWh,
            prodSTempId: $('#listingPriceForm_ptb1 [name=prodSTempId]').val(),
            prodSId: $('#listingPriceForm_ptb1 [name=prodSId]').val(),
            price: $('#listingPriceForm_ptb1 [name=price]').val(),
            weight: $('#listingPriceForm_ptb1 [name=weight]').val()
          }

          if (!data.price) {
            layer.msg('请输入价格')
            return
          }
          if (!data.weight) {
            layer.msg('请输入重量')
            return
          }
          if (!data.grossProfitRate) {
            layer.msg('请输入毛利率')
            return
          }
          loading.show()
          $.ajax({
            type: 'post',
            url: ctx + '/prodTpl/reCountListingPrice.html',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
              loading.hide()
              if (res.code == '0000') {
                $(self).parent().parent().find('[id$=Price]').text(res.data.listingPrice + (res.data.listingFreight ? (' + ' + res.data.listingFreight) : ''))
                $(self).parent().parent().find('[id$=USD]').text(res.data.listingUSD + (res.data.listingFreight ? (' + ' + res.data.listingFreight) : ''))
              } else {
                layer.msg(res.msg)
              }
            },
            fail: function () {
              loading.hide()
              layer.msg('服务器繁忙，请稍后再试')
            }

          })
        }
      </script>

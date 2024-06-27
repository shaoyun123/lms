var chooseRow={}
var autoAdjustPrice_platStore={}
layui.use(["admin", "form", "layer", "formSelects", "table", "element", "laydate", "laypage", "table", "laytpl", "upload"], function () {
  var admin = layui.admin,
    form = layui.form,
    layer = layui.layer,
    formSelects = layui.formSelects,
    element = layui.element,
    laydate = layui.laydate,
    laypage = layui.laypage,
    $ = layui.$,
    laytpl = layui.laytpl,
    table = layui.table,
    upload = layui.upload
  render_hp_orgs_users("#autoAdPrice_form")
  shopCategoryRequiredName = {
    init: function () {
      this.search()
      this.reset()
      this.handleTab()
      this.add()
      this.platCodeAjax().then(res => {
        this.PlatCodeEnum = res.platCodes.filter(item => item !== "shopee_cnsc")
        commonRenderSelect("autoAdPrice_form_platCode", this.PlatCodeEnum).then(() => {
          form.render()
        })
      })
      // this.getSite()
      let _this = this;
      // 平台
      form.on("select(autoAdPrice_form_platCode)", function (data) {
        _this.getSite(data)
        let salesSite = $('#autoAdPrice_form').find('[name=salesSite]').val();
        _this.getStores(data.value, salesSite);

        if(data.value == 'aliexpress'){
          $("#autoAdPrice_form .aliexpressIsShow").show()
        }else{
          $("#autoAdPrice_form .aliexpressIsShow").hide()
        }
      });
      // 站点
      form.on('select(autoAdPrice_form_salesSite)', function(obj){
        let platCode = $('#autoAdPrice_form').find('[name=platCode]').val();
        _this.getStores(platCode, obj.value);
      });

      // 监听所有的checkbox
      form.on('checkbox(fieldBox_autoAdjustPrice_checkbox_filter)', function(data){
        let storeBox_checked = ``;
        let elemDom = data.elem,elemValue = data.value,elemCheck = data.elem.checked;

        if(data.elem.checked){ // 选中 true
          $(data.elem).attr("checked",true); // 将原始dom设置为选中状态，并添加到已选择店铺
          storeBox_checked += `<div class="fieldBox_autoAdjustPrice fieldBox_autoAdjustPrice_checkbox">${elemDom.outerHTML}</div>`
          $('#matchStoreForm_autoAdjustPrice_checked').append(storeBox_checked)
          form.render('checkbox','matchStoreForm_autoAdjustPrice_checked')
        }else{
          // 将所有店铺中的选中状态改为false
          $('#matchStoreForm_autoAdjustPrice').find(`input[type=checkbox][value=${elemValue}]`).attr("checked",false);
          form.render('checkbox','matchStoreForm_autoAdjustPrice')
          // 删掉已选择店铺中的店铺
          $('#matchStoreForm_autoAdjustPrice_checked').find(`input[type=checkbox][value=${elemValue}]`).parent().remove();
          form.render('checkbox','matchStoreForm_autoAdjustPrice_checked')
        }
      });

      //匹配店铺的搜索
      form.on("submit(matchStoreForm_autoAdjustPrice_submit)",function(data){
        chooseRow["storeAcct"]=data.field.storeAcct
        $('#matchStoreForm_autoAdjustPrice .fieldBox_autoAdjustPrice_checkbox').remove()
        _this.initStore_autoAdjustPrice(chooseRow,true)
      });

      // 匹配店铺弹窗的全选/全不选
      form.on('checkbox(matchStoreForm_autoAdjustPrice_checkAll)', function(data){
        let elemDom = data.elem,elemValue = data.value,elemCheck = data.elem.checked;

        if(elemCheck){ // 全选
          $('#matchStoreForm_autoAdjustPrice').find('input[type=checkbox]').each(function(index){
            if($(this).attr("checked") === "checked"|| index === 0){  // index === 0是全选的那个checkbox
              // return false;
            }else{ // 需要添加的checkbox
              // 先设置dom全部选中
              $(this).attr("checked",true);
              $('#matchStoreForm_autoAdjustPrice_checked').append(`<div class="fieldBox_autoAdjustPrice fieldBox_autoAdjustPrice_checkbox">${$(this)[0].outerHTML}</div>`);
            }
          })
          form.render('checkbox','matchStoreForm_autoAdjustPrice_checked')
        }else{ // 取消全选
          // 循环查询的所有店铺,如果选中的店铺在这个所有店铺中，删掉选中的这个店铺
          $('#matchStoreForm_autoAdjustPrice').find('input[type=checkbox]').each(function(index,item){
            $(this).attr("checked",false);
            $('#matchStoreForm_autoAdjustPrice_checked').find(`input[type=checkbox][value=${item.value}]`).parent().remove();
          })
          form.render('checkbox','matchStoreForm_autoAdjustPrice_checked')
        }
        // 全选&反选
        $("#matchStoreForm_autoAdjustPrice input[name=storeAcctId]").prop("checked",data.elem.checked)
        form.render('checkbox','matchStoreForm_autoAdjustPrice')
      });

      //全选
      form.on('checkbox(cpf_checkAllLogis)', function(data){
        var checked = data.elem.checked;
        $(data.elem).parents(".priceTypeItem").find("input[name=logisAttr]").prop("checked",checked);
        form.render();
      });

      // 监听搜索条件平台选择， 初始化店铺选择多选组件
      form.on('select(autoAdjustPrice_platCode)',function (data) {
        let platCode = data.value
        if(platCode==='shopee_cnsc'){
          platCode='shopee'
        }
        if (!autoAdjustPrice_platStore[platCode]) {
          oneAjax.post({
            url: '/sys/liststorebyplatcode',
            data: {platCode: platCode},
            contentType: 'application/x-www-form-urlencoded',
            success: function (res) {
              if (res.code === '0000') {
                // 将当前平台的店铺数据缓存起来
                let arr = []
                let storeList = res.data
                for (let i = 0; i < storeList.length; i++) {
                  arr.push({name: storeList[i].storeAcct, value: storeList[i].id})
                }
                autoAdjustPrice_platStore[platCode] = arr
                formSelects.data( 'autoAdjustPrice_storeAcctIdList', 'local', {arr: arr})

              } else {
                layer.msg(res.msg)
              }
            }
          })
        } else {
          formSelects.data('autoAdjustPrice_storeAcctIdList', 'local',{arr: autoAdjustPrice_platStore[platCode]})
        }

        commonReturnPromise({
          url: ctx + "/enum/getSiteEnum.html?platCode=" + platCode,
          type: "post",
        }).then(res => {
          let arr = []
          for (let i = 0; i < res.length; i++) {
            arr.push({name: res[i].name, value: res[i].code})
          }
          formSelects.data( 'autoAdjustPrice_salesSite', 'local', {arr: arr})
        }).catch(function(err){
          layer.confirm(err, {
            btn: ['关闭'] //可以无限个按钮
          });
        })
      })
      // 一键复制
      $(document).off("click","[name=autoAdjustPriceCopy]").on("click","[name=autoAdjustPriceCopy]",function(){
        let autoAdjustPriceCopyArr = []
        $.each($('#matchStoreForm_autoAdjustPrice_checked input[name=storeAcctId]:checked'),function(){
          autoAdjustPriceCopyArr.push($(this).attr("title"))
        });
        copyTxtToClipboard(autoAdjustPriceCopyArr.join())
      })
    },
    // 特殊站点 用于匹配店铺
    SpecialSiteObj:{
      'TWT': 'TW',
      'MXT': 'MX'
    },
    getSite: function (data) {
      const _this = this
      // form.on("select(autoAdPrice_form_platCode)", function (data) {
        _this.siteAjax(data.value).then(res => {
          if (data.value === "ebay") {
            res = res.map(item => ({ ...item, code: item.siteName }))
          }
          if (data.value === "mercado") {
            res = res.filter(item => item.code != 'CBT')
          }
          commonRenderSelect("autoAdPrice_form_salesSite", res, { name: "name", code: "code" }).then(() => {
            form.render()
          })
        })
      // })
    },
    //联动店铺-ztt20230905
    getStores(platCode,salesSite=''){
      commonReturnPromise({
        url: ctx + "/plat/platListingPriceFormulaConfig/listStoreByPlatCode",
        type: 'post',
        contentType: 'application/json',
        params: JSON.stringify({
          salesSite: salesSite,
          platCode: platCode,
        }),
        contentType: 'application/json'
      }).then(res => {
        commonRenderSelect('public_autoAdPrice_form_storeAcctIdList', res, {name: 'storeName', code: 'id'}).then(()=> {
          formSelects.render('public_autoAdPrice_form_storeAcctIdList');
        })
      });
    },
    // 查询
    search: function () {
      let _this = this
      $("#autoAdPrice_search").click(function () {
        const formData = serializeObject($("#autoAdPrice_form"))
        formData.storeAcctIdList = formData.storeAcctId?formData.storeAcctId.split(","):[];
        _this.tableRender(formData)
      })
    },
    // 重置
    reset: function () {
      $("#autoAdPrice_reset").click(function () {
        $("#autoAdPrice_form")[0].reset()
      })
    },
    SalesSearchEnum: {
      7: "7天",
      15: "15天",
      30: "30天",
      60: "60天",
      90: "90天",
    },
    PlatCodeEnum: [],
    SalesEnum: [
      { name: "7天销量&le;", code: "7" },
      { name: "15天销量&le;", code: "15" },
      { name: "30天销量&le;", code: "30" },
      { name: "60天销量&le;", code: "60" },
      { name: "90天销量&le;", code: "90" },
    ],
    tableRender: function (formData) {
      const _this = this
      table.render({
        elem: "#autoAdPrice_table",
        id: "autoAdPrice_tableId",
        url: ctx + "/plat/autoAdjustPriceConfig/list",
        method: "post",
        contentType: "application/json;charset=UTF-8",
        where: formData,
        cols: [
          [
            { field: "status", title: "状态", templet: "#autoAdPrice_status_tpl" },
            { field: "platCode", title: "平台" },
            { field: "salesSite", title: "站点" },
            {
              field: "priceDifferenceRange",
              title: "促销价差价",
              templet: function (d) {
                let minPercent = d.priceDifferenceGte !== undefined ? `大于等于&yen;${d.priceDifferenceGte}<br>` : ""
                let maxPercent = d.priceDifferenceLte !== undefined ? `小于等于&yen;${d.priceDifferenceLte}<br>` : ""

                let min = d.priceDifferenceRangeGte!= undefined ? (d.priceDifferenceRangeGte != 0 ? `大于等于${d.priceDifferenceRangeGte*100}%<br>` : `大于等于0<br>`) : '';
                let max = d.priceDifferenceRangeLte!= undefined ? (d.priceDifferenceRangeLte!= 0 ? `小于等于${d.priceDifferenceRangeLte*100}%<br>` : `小于等于0<br>`) : '';
                return minPercent + maxPercent + min + max
              },
            },
            {
              field: "salesDay",
              title: "销量",
              templet: function (d) {
                let salesLte = d.salesLte === undefined ? "" : d.salesLte
                if (_this.SalesSearchEnum[d.salesDay] !== undefined) {
                  return `${_this.SalesSearchEnum[d.salesDay]}:${salesLte}`
                }
                return ""
              },
            },
            {
              field: "storeAcctStr",
              title: "适用店铺",
              templet: "#autoAdPrice_storeAcctStr_tpl"
            },
            {
              field: "ifDefault",
              title: "默认",
              width: 70,
              templet: "#autoAdPrice_ifDefault_tpl"
            },
            {
              field: "attributeId",
              title: "操作人",
              templet: function (d) {
                return `创建:${d.createUser || ""}<br>修改:${d.updateUser || ""}`
              },
            },
            {
              field: "attributeId",
              title: "时间",
              templet: function (d) {
                return `创建:${Format(d.createTime, "yyyy-MM-dd hh:mm:ss") || ""}<br>修改:${Format(d.updateTime, "yyyy-MM-dd hh:mm:ss") || ""}`
              },
            },
            { title: "操作", align: "center",width: 270, toolbar: "#autoAdPrice_toolbar" },
          ],
        ],
        limits: [100, 200, 500],
        limit: 100,
        page: true,
        done: function (_, _, count) {
          // table总数量
          $("#autoAdPrice_total").text(count)
          _this.tableToor()
          _this.changeStatus()
        },
      })
    },
    // table 工具栏
    tableToor: function () {
      let _this = this
      table.on("tool(autoAdPrice_table)", function (obj) {
        chooseRow = obj.data
        switch (obj.event) {
          case "edit":
            _this.editModal("update", obj.data)
            break
          case "matchStore":
            _this.matchStore(obj.data)
            break
          case "setAsDefault":
            _this.setAsDefault("update", obj.data)
            break
        }
      })
    },
    // 监听tab
    handleTab: function () {
      element.on("tab(autoAdPrice_tab)", function (data) {
        $("#autoAdPrice_search").click()
      })
    },
    // 匹配店铺
    matchStore: function (data) {
      let _this = this
      let popIndex = layer.open({
        shadeClose: false,
        type: 1,
        title: "匹配店铺(停用店铺不显示)",
        area: ["1200px", "600px"],
        btn: ['确认', '关闭'],
        content: $("#matchStorePop_autoAdjustPrice").html(),
        success: function () {
          // 初始化店铺选择
          _this.initStore_autoAdjustPrice(data)
        },
        yes: function () {
          var selectedBox = $('#matchStoreForm_autoAdjustPrice_checked [name=storeAcctId]:checked')
          var refList = []
          var ref
          for (var i = 0 ; i < selectedBox.length; ++i) {
            ref = {}
            ref.fomulaId = data.id
            ref.storeAcctId = selectedBox[i].value
            refList.push(ref)
          }
          var Adta = {
            id : data.id,
            platCode: data.platCode,
            storeAcctIdList: refList.map(item => item.storeAcctId * 1)
          }

          commonReturnPromise({
            url: `/lms/plat/autoAdjustPriceConfig/setMatchStore`,
            type: 'POST',
            contentType: 'application/json',
            params:JSON.stringify(Adta)
          }).then(function(result){
            layer.alert(result, {icon:1});
            if(result.includes("部分店铺匹配过")){
              let storeAcct = result.split("部分店铺匹配过自动调价策略：")[1]
              let storeAcctNameList = storeAcct.split(",")
              storeAcctNameList.forEach(item => {
                $('#matchStoreForm_autoAdjustPrice_checked').find(`input[type=checkbox][title="${item}"]`).next().find("span").css("color",'red');
              })
            } else {
              layer.close(popIndex)
              $("#autoAdPrice_search").click()
            }
          })
        }
      })
    },
    // 匹配店铺弹框成功渲染
    initStore_autoAdjustPrice(data,isstoreSerach=false) {
      const salesSite = this.SpecialSiteObj[data.salesSite] || data.salesSite
    var Adata = !isstoreSerach?{
      id: data.id,
      platCode: data.platCode,
      salesSite
    }:{
      id: data.id,
      platCode: data.platCode,
      storeAcctStr: data.storeAcct,
      salesSite
    }
    var ajax = new Ajax()
    ajax.post({
      url: ctx + "/plat/autoAdjustPriceConfig/getMatchStore",
      data: JSON.stringify(Adata),
      contentType: 'application/json',
      success: function (data) {
        if (data.code == '0000') {
          var list = data.data
          if (list) {
            var storeBox = ``,storeBox_checked = ``;
            var store
            for (var i =0; i < list.length; ++i) {
              store = list[i]
              store.isMatch?storeBox_checked += `<div class="fieldBox_autoAdjustPrice fieldBox_autoAdjustPrice_checkbox"><input lay-filter="fieldBox_autoAdjustPrice_checkbox_filter" name="storeAcctId" type="checkbox" checked title="`+ store.storeAcct +`" lay-skin="primary" value="`+ store.id +`" ></div>`:''
              storeBox += `<div class="fieldBox_autoAdjustPrice fieldBox_autoAdjustPrice_checkbox"><input lay-filter="fieldBox_autoAdjustPrice_checkbox_filter" name="storeAcctId" type="checkbox" ` + (store.isMatch ? `checked` : ``) + ` title="`+ store.storeAcct +`" lay-skin="primary" value="`+ store.id +`" ></div>`
            }
            if(isstoreSerach){ // 手动搜索，默认不显示
              $('#matchStoreForm_autoAdjustPrice').append(storeBox)

              $('#matchStoreForm_autoAdjustPrice_checked').find('input[type=checkbox]').each(function(){
                $('#matchStoreForm_autoAdjustPrice').find(`input[type=checkbox][value=${$(this).val()}]`).attr("checked",true);
              })

              form.render('checkbox','matchStoreForm_autoAdjustPrice')
            }else{
              $('#matchStoreForm_autoAdjustPrice_checked').append(storeBox_checked)
              form.render('checkbox','matchStoreForm_autoAdjustPrice_checked')
            }
          }
        }
      }
    })
  },
  // 设为默认
    setAsDefault: function (type, obj = {}) {
      let popIndex = layer.confirm('确认将该公式设为默认吗（同平台站点仓库的其它默认公式将取消默认）', { btn: ['确认', '取消'] },
          function() {
            commonReturnPromise({
              url: `/lms/plat/autoAdjustPriceConfig/setDefaultConfig`,
              type: 'POST',
              contentType: 'application/json',
              params:JSON.stringify({
                id: obj.id,
                platCode: obj.platCode,
                salesSite: obj.salesSite
              })
            }).then(function(result){
              layer.msg(result, {icon:1});
              layer.close(popIndex)
              $("#autoAdPrice_search").click()
            })
          },
          function() {
            layer.closeAll()
          })
    },
    // 新增
    add: function () {
      const _this = this
      $("#autoAdPrice_add").click(function () {
        _this.editModal("new")
      })
    },

    // 新增修改弹窗
    editModal: function (type, obj = {}) {
      const _this = this
      let siteList = []
      let title = {
        update: "修改调价参数",
        new: "新增调价参数",
      }
      let popIndex = layer.open({
        title: title[type],
        type: 1, //不加该属性,就会出现[object Object]
        area: ["600px", "500px"],
        content: "",
        btn: ["保存", "取消"],
        success: function (layero) {
          laytpl($("#autoAdPrice_rule_tpl").html()).render({ ...obj, type }, function (html) {
            $(layero).find(".layui-layer-content").html(html)
          })
          if (type === "new") {
            commonRenderSelect("autoAdPrice_rule_platCode", _this.PlatCodeEnum)
          } else {
            if(obj.platCode === 'shopee'){
              layero.find(".onlyShopee").show()
              layero.find(".priceDifferenceRange").text('促销价差价幅度')
            }else{
              layero.find(".onlyShopee").hide()
              layero.find(".priceDifferenceRange").text('差价幅度')
            }
            _this.siteAjax(obj.platCode).then(res => {
              if (obj.platCode === "ebay") {
                res = res.map(item => ({ ...item, code: item.siteName }))
              }
              if (obj.platCode === "mercado") {
                res = res.filter(item => item.code != 'CBT')
              }
              let salesSiteName = ""
              if (res.length && obj.salesSite) {
                salesSiteName = res.filter(item => item.code == obj.salesSite)[0].name
              } else {
                salesSiteName = "暂无站点"
              }
              layero.find("#autoAdPrice_ruleForm .salesSiteText").text(salesSiteName)
            })
            if (obj.platCode === "lazada" || obj.platCode === "daraz") {
              layero.find(".salesType").text("子SKU销量")
            }
          }
          let _salesList = _this.SalesEnum
          if (obj.platCode === "shopee" || obj.platCode === "tiktok") {
            _salesList = _this.SalesEnum.filter(item => item.code != 15)
          }
          if (obj.platCode === "mercado") {
            _salesList = _this.SalesEnum.filter(item => item.code != 7)
          }
          _this._commonRenderSelect("autoAdPrice_rule_salesDay", _salesList, { name: "name", code: "code", selected: obj.salesDay === undefined ? "7" : obj.salesDay })
          // 监听平台的选择
          form.on("select(autoAdPrice_rule_platCode)", function (data) {
            _this.siteAjax(data.value).then(res => {
              if (data.value === "ebay") {
                res = res.map(item => ({ ...item, code: item.siteName }))
              }
              if (data.value === "mercado") {
                res = res.filter(item => item.code != 'CBT')
              }
              siteList = res
              commonRenderSelect("autoAdPrice_rule_salesSite", res, { name: "name", code: "code" }).then(() => {
                form.render()
              })
              if (data.value === "shopee" || data.value === "tiktok") {
                _this._commonRenderSelect(
                  "autoAdPrice_rule_salesDay",
                  _this.SalesEnum.filter(item => item.code != 15),
                  { name: "name", code: "code" }
                )
              } else if (data.value === "mercado") {
                  _this._commonRenderSelect(
                      "autoAdPrice_rule_salesDay",
                      _this.SalesEnum.filter(item => item.code != 7),
                      { name: "name", code: "code" }
                  )
              } else {
                _this._commonRenderSelect("autoAdPrice_rule_salesDay", _this.SalesEnum, { name: "name", code: "code" })
              }
            })
            layero.find(".salesType").text(data.value !== "lazada"&&data.value !== "daraz" ? "listing销量" : "子SKU销量")
            // 只有shopee
            if(data.value === 'shopee'){
              layero.find(".onlyShopee").show()
              layero.find(".priceDifferenceRange").text('促销价差价幅度')
            }else{
              layero.find(".onlyShopee").hide()
              layero.find(".priceDifferenceRange").text('差价幅度')
            }
          })
          form.render()
        },
        yes: function (index) {
          const formObj = serializeObject($("#autoAdPrice_ruleForm"))
          if (type === "update") {
            formObj.platCode = obj.platCode
            formObj.salesSite = obj.salesSite
          }
          if (formObj.platCode === "") {
            return layer.msg("请选择平台")
          }
          if (siteList.length > 0 && formObj.salesSite === "") {
            return layer.msg("请选择站点")
          }
          if(formObj.platCode === "shopee"){
            if (formObj.priceDifferenceRangeGte === "" && formObj.priceDifferenceRangeLte === "" && formObj.salesLte === "" && formObj.priceDifferenceGte === "" && formObj.priceDifferenceLte === "") {
              return layer.msg("促销价差价幅度、促销价差价范围、销量必填1个")
            }
            formObj.priceDifferenceGte = formObj.priceDifferenceGte === "" ? null : Number(formObj.priceDifferenceGte)
            formObj.priceDifferenceLte = formObj.priceDifferenceLte === "" ? null : Number(formObj.priceDifferenceLte)
          }else{
            if (formObj.priceDifferenceRangeGte === "" && formObj.priceDifferenceRangeLte === "" && formObj.salesLte === "") {
              return layer.msg("差价幅度、销量必填1个")
            }
          }
          // 当平台选择lazada，1,则显示子SKU销量,选择其他平台，2,显示listing销量
          formObj.salesType = (formObj.platCode === "lazada"||formObj.platCode === "daraz") ? 1 : 2
          // 差价幅度、销量必填1个，如都不填，则无法保存
         
          formObj.salesDay = Number(formObj.salesDay)
          formObj.priceDifferenceRangeLte = formObj.priceDifferenceRangeLte === "" ? null : Number(formObj.priceDifferenceRangeLte)
          formObj.priceDifferenceRangeGte = formObj.priceDifferenceRangeGte === "" ? null : Number(formObj.priceDifferenceRangeGte)
          formObj.salesLte = formObj.salesLte === "" ? null : Number(formObj.salesLte)
          if (type === "update") {
            _this.updateAjax({ ...obj, ...formObj }).then(res => {
              layer.msg("操作成功", { icon: 1 })
              $("#autoAdPrice_search").click()
              layer.close(popIndex)
            })
          } else {
            _this.createAjax(formObj).then(res => {
              layer.msg("操作成功", { icon: 1 })
              $("#autoAdPrice_search").click()
              layer.close(popIndex)
            })
          }
        },
      })
    },
    _commonRenderSelect: function (id, data, opts) {
      return new Promise(function (resolve, reject) {
        var defaultOpts = Object.assign({ str: "", name: "", code: "", selected: "" }, opts)
        var dataFirst = data[0] ? data[0] : ""
        var isObject = Object.prototype.toString.call(dataFirst) === "[object Object]" ? true : false
        let optionStr = defaultOpts.str
        let selected = defaultOpts.selected
        if (isObject) {
          let $name = defaultOpts.name
          let $code = defaultOpts.code
          for (let [index, item] of data.entries()) {
            if (selected == item[$code]) {
              optionStr += `<option value="${item[$code]}" selected>${item[$name]}</options>`
            } else {
              optionStr += `<option value="${item[$code]}">${item[$name]}</options>`
            }
          }
        } else {
          for (let elem of data.values()) {
            if (selected === elem) {
              optionStr += `<option value="${elem}" selected>${elem}</options>`
            } else {
              optionStr += `<option value="${elem}">${elem}</options>`
            }
          }
        }
        $("#" + id).html(optionStr)
        resolve("渲染成功")
      })
    },

    // 更新规则状态
    changeStatus: function () {
      const _this = this
      form.on("switch(autoAdPrice_status)", function (data) {
        let id = data.value,
          status = data.elem.checked == true ? 1 : 0
        let checked = data.elem.checked
        let popIndex = layer.open({
          title: "提示",
          icon: 7,
          btn: ["确认", "取消"],
          content: "确定要修改此状态吗？",
          yes: function () {
            let curTrObj = table.cache["autoAdPrice_tableId"].filter(item => item.id == id)[0]
            delete _this.updateAjax({ ...curTrObj, status: status }).then(function (res) {
              layer.msg("操作成功", { icon: 1 })
              $("#autoAdPrice_search").click()
              layer.close(popIndex)
            })
          },
          btn2: function () {
            data.elem.checked = !checked
            form.render()
          },
          cancel: function () {
            data.elem.checked = !checked
            form.render()
          },
        })
      })
    },

    //#region 接口 start
    // 获取默认值枚举接口
    defaultValueAjax: function () {
      return commonReturnPromise({
        url: ctx + "/shopee/prodCateAttr/getDefaultValue",
      })
    },
    createAjax: function (obj) {
      return commonReturnPromise({
        url: ctx + "/plat/autoAdjustPriceConfig/new",
        type: "post",
        contentType: "application/json",
        params: JSON.stringify(obj),
      })
    },
    updateAjax: function (obj) {
      return commonReturnPromise({
        url: ctx + "/plat/autoAdjustPriceConfig/update",
        type: "put",
        contentType: "application/json",
        params: JSON.stringify(obj),
      })
    },
    platCodeAjax: function () {
      return commonReturnPromise({
        url: ctx + "/unauditorder/listenum.html",
      })
    },
    // 站点
    siteAjax: function (platCode) {
      return commonReturnPromise({
        url: ctx + "/enum/getSiteEnum.html?platCode=" + platCode,
        type: "post",
      })
    },
    //#endregion 接口 end
  }

  shopCategoryRequiredName.init()
})

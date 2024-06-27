layui.use(
  [
    "admin",
    "form",
    "layer",
    "formSelects",
    "table",
    "element",
    "laydate",
    "laytpl",
    "laypage",
  ],
  function () {
    var admin = layui.admin,
      form = layui.form,
      layer = layui.layer,
      formSelects = layui.formSelects,
      element = layui.element,
      laydate = layui.laydate,
      laytpl = layui.laytpl,
      table = layui.table,
      laypage = layui.laypage,
      $ = layui.$
    var storeAcctIdStr = ''
    var storeAllInfoRef = []

    render_hp_orgs_users("#public_listFormula_form")

    publicListFormulaName = {
      init: function () {
        this.getPlatCodeAndLogisList()
        Promise.all([
          this.getListcompanyAjax(),
          this.getListlogistypeAjax(),
          this.getCountryListAjax(),
          this.getAverCostWarehouseAjax(),
        ])
          .then((res) => {
            this.EnumList.companyList = res[0]
            this.EnumList.alllogistypeList = res[1]
            this.EnumList.logisticCountryList = res[2]
            // 目前枚举移除直邮仓群
            this.EnumList.prodWarehouseIdList = res[3].filter((item) => {
              return item.warehouseName !== '直邮仓群'
            })
          })
          .then(() => {
            $("#public_listFormula_search").removeClass("layui-btn-disabled")
            this.changePlatCode($("#public_listFormula_form"))
            this.handlePaltCodeInSearch()
            this.handleTab()
            this.search()
            this.reset()
            this.addNew()
          })
      },
      // 特殊站点 用于匹配店铺
      SpecialSiteObj:{
        'TWT': 'TW',
        'MXT': 'MX'
      },
      EnumList: {
        logisAttrs: [],
        platCodes: [],
        companyList: [],
        alllogistypeList: [],
        logisticCountryList: [],
        prodWarehouseIdList: [],
      },
      //#region 查询card
      // 平台和物流属性 下拉框
      getPlatCodeAndLogisList: function () {
        this.getPlatCodeAndLogisAjax().then((res) => {
          let { logisAttrs, platCodes } = res
          // platCodes = platCodes.filter(item=>item!=='shopee_cnsc')
          this.EnumList.logisAttrs = logisAttrs
          this.EnumList.platCodes = platCodes
          const platCodeDom = $("#public_listFormula_form").find(
            "select[name=platCode]"
          )
          this.renderSelect(platCodeDom, platCodes)
          formSelects.data("public_listFormula_form_logisAttrList", "local", {
            arr: logisAttrs.map((item) => ({ name: item, value: item })),
          })
          form.render()
        })
      },
      // 站点下拉框
      getSiteList: function (formDom, platCode = "", selected = "") {
        this.getSiteAjax(platCode).then((res) => {
          const dom = formDom.find("select[name=salesSite]")
          if(platCode==='ebay'){
            res = res.map(item=>({...item,code: item.code.toString()}))
          }else if(platCode === 'tiktok'){
            res.unshift({
              code: "GLOBAL",
              name: "全球",
              currency: "USD",
            });
          }
          this.renderSelect(dom, res, {
            name: "name",
            code: "code",
            selected: selected === "" ? "" : selected,
          })
          form.render()
        })
      },
      // 仓库类型下拉框
      getStockTypeList: function (formDom, platCode = "", selected = "") {
        const dom = formDom.find("select[name=storeWarehousesType]")
        if (platCode === "ebay"||platCode === "amazon") {
          this.getStockTypeAjax(platCode).then((res) => {
            this.renderSelect(dom, res, {
              name: "name",
              code: "code",
              selected: selected,
            })
            form.render()
          })
        } else {
          this.renderSelect(dom, [], {
            name: "name",
            code: "code",
            selected: selected,
          })
          form.render()
        }
      },
      // 账号类型下拉框
      getAcctTypeList: function (formDom, platCode = "", selected = "") {
        const dom = formDom.find("select[name=storeAcctType]")
        const acctTypeList = [{ name: "英国账号" }, { name: "非英国账号" }]
        this.renderSelect(dom, platCode === "ebay" ? acctTypeList : [], {
          name: "name",
          code: "name",
          selected: selected,
        })
        form.render()
      },
      // 联动,平台-->站点和仓库类型和账号类型
      changePlatCode: function (formDom, platCode = "") {
        this.getSiteList(formDom, platCode)
        this.getStockTypeList(formDom, platCode)
        this.getAcctTypeList(formDom, platCode)
      },
      //联动店铺-ztt20230905
      getStores(platCode,salesSite=''){
        commonReturnPromise({
          url: ctx + "/plat/platListingPriceFormulaConfig/listStoreByPlatCode",
          type: 'post',
          contentType: 'application/json',
          params: JSON.stringify({
            salesSite: this.SpecialSiteObj[salesSite] ?  this.SpecialSiteObj[salesSite] : salesSite,
            platCode: platCode,
          }),
          contentType: 'application/json'
        }).then(res => {
          commonRenderSelect('public_listFormula_form_storeAcctIdList', res, {name: 'storeName', code: 'id'}).then(()=> {
            formSelects.render('public_listFormula_form_storeAcctIdList');
          })
        });
      },
      // 选取平台后,站点和仓库类型和账号类型下拉框变化
      handlePaltCodeInSearch: function () {
        const _this = this
        form.on("select(listFormula_form_platCode)", function (data) {
          _this.changePlatCode($("#public_listFormula_form"), data.value)
          let salesSite = $('#public_listFormula_form').find('[name=salesSite]').val();
          _this.getStores(data.value, salesSite);
        });
        form.on('select(listFormula_form_salesSite)', function(obj){
          let platCode = $('#public_listFormula_form').find('[name=platCode]').val();
          _this.getStores(platCode, obj.value);
        });
      },
      //#endregion 查询card
      // 监听tab
      handleTab: function () {
        element.on("tab(public_listFormula_tab)", function (data) {
          $("#public_listFormula_search").click()
        })
      },

      // 查询
      search: function () {
        const _this = this
        $("#public_listFormula_search").click(function () {
          let formData = serializeObject($("#public_listFormula_form"))
          _this.tableRender(formData)
        })
      },
      // 重置
      reset: function () {
        const _this = this
        $("#public_listFormula_reset").click(function () {
          $("#public_listFormula_form")[0].reset()
          _this.changePlatCode($("#public_listFormula_form"))
        })
      },
      //
      tableRender: function (formData) {
        const _this = this
        formData.storeAcctIdList = formData.storeAcctIdList == '' ? []: formData.storeAcctIdList?.split(',');
        table.render({
          elem: "#public_listFormula_table",
          id: "public_listFormula_tableId",
          url:ctx +`/plat/platListingPriceFormulaConfig/listFormulaConfig`,
          method: 'post',
          contentType: "application/json;charset=UTF-8",
          where: {...formData},
          cols: [
            [
              { field: "formula", title: "定价公式名称" },
              { field: "platCode", title: "平台", width: 100 },
              { field: "siteName", title: "站点", width: 100 },
              { field: "storeWarehousesName", title: "仓库类型", width: 100 },
              // { field: "fulfillmentCenterIdType", title: "发货仓库类型", width: 70 },
              { field: "storeAcctType", title: "账号类型", width: 100 },
              { field: "logisAttrList", title: "物流属性" },
              { field: "storeAcctStr", title: "适用店铺", templet: function(d){
                return `<span class="pora copySpan showLine4">
                    <a>${d.storeAcctStr || ""}</a>
                    <button class="layui-btn layui-btn-primary layui-btn-xs copyTxt" name="copy" onclick="layui.admin.copyTxt(this)">复制</button>
                </span>`
              }},
              {
                field: "listingPrice",
                title: "定价区间(单位为各站点币种)",
                width: 100,
                templet: function (d) {
                  let str = ""
                  if (
                    d.listingPriceMin !== "" &&
                    d.listingPriceMax !== "" &&
                    d.listingPriceMin !== undefined &&
                    d.listingPriceMax !== undefined
                  ) {
                    str = `[${d.listingPriceMin},${d.listingPriceMax})`
                  }
                  return str
                },
              },
              {
                field: "listingPriceFormula",
                title: "定价公式",
                width: 200,
                templet: function (d) {
                  const str = d.listingPriceFormula.split(",").join("<br>")
                  return `${str}`
                },
              },
              {
                field: "prodWarehouse",
                title: "平均成本取值仓库",
                width: 100,
                templet: function (d) {
                  let prodWarehouse = ""
                  const curProdWarehouse =
                    _this.EnumList.prodWarehouseIdList.filter(
                      (item) => item.id == d.prodWarehouseId
                    )
                  if (curProdWarehouse.length) {
                    prodWarehouse = curProdWarehouse[0].warehouseName
                  }
                  return prodWarehouse
                },
              },
              {
                field: "logisticTypeName",
                title: "匹配物流方式",
                templet: function (d) {
                  const logisticCompany = _this.EnumList.companyList.filter(
                    (item) => item.id == d.logisticCompanyName
                  )
                  const logisticType = _this.EnumList.alllogistypeList.filter(
                    (item) => item.id == d.logisticTypeName
                  )
                  const logisticCountry =
                    _this.EnumList.logisticCountryList.filter(
                      (item) => item.en_simple_name == d.logisticChargingCountry
                    )
                  const _logisticCompany = logisticCompany.length
                    ? logisticCompany[0].cnName
                    : " "
                  const _logisticType = logisticType.length
                    ? logisticType[0].name
                    : " "
                  const _logisticCountry = logisticCountry.length
                    ? logisticCountry[0].cn_name
                    : " "

                  return `${_logisticCompany}->${_logisticType}->${_logisticCountry}`
                },
              },
              {
                field: "floatRate",
                title: "浮动区间",
                width: 70,
                templet: function (d) {
                  let str = ""
                  if (
                    d.floatRateMin !== "" &&
                    d.floatRateMax !== "" &&
                    d.floatRateMin !== undefined &&
                    d.floatRateMax !== undefined
                  ) {
                    str = `[${d.floatRateMin}%,${d.floatRateMax}%]`
                  }
                  return str
                },
              },
              { field: "priceAccuracy", title: "定价精度", width: 70 },
              { field: "remark", title: "备注", width: 100 },
              {
                title: "操作",
                toolbar: "#public_listFormula_toolbar",
                width: 130,
              },
            ],
          ],
          limits: [300, 400, 500],
          limit: 300,
          page: true,
          done: function (_, _, count) {
            // table总数量
            $("#public_listFormula_total").text(count)
            _this.tableToor()
          },
        })
      },
      // table 工具栏
      tableToor: function () {
        const _this = this
        table.on("tool(public_listFormula_table)", function (obj) {
          switch (obj.event) {
            case "edit":
              //   打开编辑弹窗
              storeAllInfoRef = []
              _this.editModal({ data: obj.data, type: "edit" })
              break
            case "matchStore":
              storeAllInfoRef = []
              _this.matchStore(obj.data)
              break
            case "del":
              layer.confirm(
                "确认删除吗？",
                {
                  title: "提示",
                  icon: 0,
                },
                function () {
                  _this.deleteFormulaConfigAjax(obj.data.id).then((res) => {
                    layer.msg(res, { icon: 1 })
                    $("#public_listFormula_search").click()
                  })
                }
              )
              break;
            case "log":
              _this.logLayer(obj.data.id);
              break;
          }
        })
      },
      //日志弹框
      logLayer(id){
        commonReturnPromise({
          url: `/lms/plat/platListingPriceFormulaConfig/getOperLog?formulaId=${id}`
        }).then(res => {
          //渲染tbody
          let tbodyRender = function(data){
            let str = '';
            for(let i=0; i<data.length;i++){
              let item = data[i];
              str += `
                <tr>
                  <td>${Format(item.createTime,"yyyy-MM-dd hh:mm:ss")}</td>
                  <td>${item.creator || ''}</td>
                  <td>${item.formula || ''}</td>
                  <td>${item.operTypeName || ''}</td>
                  <td>${item.origData || ''}</td>
                  <td>${item.newData || ''}</td>
                  <td>${item.operDesc || ''}</td>
                </tr>
              `;
            }
            $('#public_listFormula_logsTbody').empty().append(str);
          }
          if(res.length>0){
            layer.open({
              type: 1,
              title: '日志',
              area: ['80%','600px'],
              content: $('#public_listFormula_logsLayer').html(),
              id: 'public_listFormula_logsLayerId',
              success: function(layero){
                //渲染操作时间
                laydate.render({
                  elem: '#public_listFormula_logsTime',
                  type: 'datetime',
                  inputAuto: true,
                  range: true,
                  showShortcuts: true,
                });
                //默认渲染tbody
                tbodyRender(res);
                //按钮点击事件
                layero.find('.search').on('click', function(){
                  let timeVal = $('#public_listFormula_logsTime').val() == '' ? '' : $('#public_listFormula_logsTime').val();
                  if(timeVal == ''){
                    tbodyRender(res);
                  }else{
                    let startDate = timeVal.split(' - ')[0];
                    let endDate = timeVal.split(' - ')[1];
                    let startTimes = new Date(startDate).getTime();
                    let endTimes = new Date(endDate).getTime();
                    let newData = res.filter(item => {
                      return item.createTime > startTimes && item.createTime < endTimes;
                    });
                    tbodyRender(newData);
                  }
                });
              }
            })

          }else{
            layer.msg('暂无日志',{icon:7});
          }
        })
      },
      // 新增
      addNew: function () {
        const _this = this
        $("#public_listFormula_addBtn").click(function () {
          _this.editModal()
        })
      },
      // 弹窗
      editModal: function (obj = { data: { logisAttrList: "" }, type: "add" }) {
        const _this = this
        const { data, type } = obj
        let curIndex = layer.open({
          type: 1,
          title: type === "add" ? "添加" : type === "edit" ? "编辑" : "",
          btn: ["保存", "取消"],
          area: ["700px", "700px"],
          id: Date.now(),
          content: $("#public_listFormula_editModal").html(),
          success: function (layero) {
            const formDom = $("#public_listFormula_edit_form")
            _this.renderSelect(
              formDom.find("select[name=platCode]"),
              _this.EnumList.platCodes,
              { name: "name", code: "name", selected: data.platCode }
            )
            //prodWarehouseId 默认值为直邮仓群，值为66
            // task 8148 默认值改为义务仓 值为65
            _this.renderSelect(
              formDom.find("select[name=prodWarehouseId]"),
              _this.EnumList.prodWarehouseIdList,
              {
                name: "warehouseName",
                code: "id",
                selected: type === "add" ? 65 : data.prodWarehouseId,
              }
            )
            formSelects.data(
              "public_listFormula_edit_form_logisAttrList",
              "local",
              {
                arr: _this.EnumList.logisAttrs.map((item) => ({
                  name: item,
                  value: item,
                  selected: data.logisAttrList
                    .split(",")
                    .find((elem) => item == elem)
                    ? true
                    : false,
                })),
              }
            )
            _this.getSiteList(formDom, data.platCode, data.salesSite)
            _this.getStockTypeList(
              formDom,
              data.platCode,
              String(data.storeWarehousesType)
            )
            _this.getAcctTypeList(formDom, data.platCode, data.storeAcctType)
            _this.renderSelect(
              formDom.find("select[name=logisticCompanyName]"),
              _this.EnumList.companyList,
              {
                name: "cnName",
                code: "id",
                selected:
                  data.logisticCompanyName !== undefined
                    ? Number(data.logisticCompanyName)
                    : "",
              }
            )

            // 平台选择了AE半托管 定价公式增加tips
            let aeTipsContent = $('#AeTips')
            if(data.platCode === 'AE半托管'){
              aeTipsContent.text('平台物流服务费')
            }else{
              aeTipsContent.text('')
            }

            data.logisticCompanyName &&
              _this.getListlogistypeList(
                data.logisticCompanyName,
                data.logisticTypeName
              )
            data.logisticTypeName &&
              _this.getCountryList(
                data.logisticTypeName,
                data.logisticChargingCountry
              )
            $('#showMatchStore').click(function() {
              let params = {}
              if (type == 'add') {
                params.platCode = $('#list_platCode').val()
                params.salesSite = $('#list_salesSite').val()
                params.storeAcctStr = ''
                params.storeAcctIdStrRef = ''
                if (!params.platCode) {
                  return layer.msg('请先选择平台')
                }
                _this.matchStore(params, false);
              } else {
                _this.matchStore(data, false);
              }
            })

            // 赋值
            if (type === "edit") {
              let paramsObj = serializeObject(formDom);
              _this.togglePriceText(paramsObj.platCode);
              formDom.find("input[name=formula]").val(data.formula)
              formDom.find("textarea[name=remark]").val(data.remark)
              formDom
                .find("select[name=storeWarehousesType]")
                .val(data.storeWarehousesType)
              formDom
                  .find("select[name=fulfillmentCenterIdType]")
                  .val(data.fulfillmentCenterIdType)
              const priceFormulaHtml = data.listingPriceFormula.split(",").map(
                (item) => `<div class="disFCenter mb5">
                <input
                  type="text"
                  name="listingPriceFormula"
                  class="layui-input mr10"
                  style="flex: 1;"
                  value="${item}"
                  onchange="public_listFormula_change_listingPriceFormula(this)"
                />
                <a
                  href="javascript:;"
                  class="layui-btn layui-btn-sm layui-btn-normal mr10 public-listFormula-delPriceFormula-btn"
                  >删除</a
                >
                <a
                  href="javascript:;"
                  class="layui-btn layui-btn-sm layui-btn-normal mr10 public-listFormula-testPriceFormula-btn"
                  >TEST</a
                >
                <div style="width: 30px;">
                  <i
                    class="layui-icon fGreen public-listFormula-icon-size rightFormula ${
                      !item && "hidden"
                    }"
                    >&#xe605;</i
                  >
                  <i
                    class="layui-icon fRed public-listFormula-icon-size hidden wrongFormula"
                    >&#x1006;</i
                  >
                </div>
              </div>`
              )
              $("#public_listFormula_edit_priceFormula_list").prepend(
                priceFormulaHtml
              )
              let storeInfo = data.storeAcctStr?.slice(0, 20)

              storeAcctIdStr = data.storeAcctIdStrRef || ''
              if (data.storeAcctStr?.length > 20) {
                storeInfo += "...";
              }
              $('#matchStoreInfo').html(storeInfo)
              formDom
                .find("#matchStoreInfo")
                .html(data.storeAcctIdStr)
              formDom
                .find("input[name=listingPriceMin]")
                .val(data.listingPriceMin)
              formDom
                .find("input[name=listingPriceMax]")
                .val(data.listingPriceMax)
              formDom.find("input[name=floatRateMin]").val(data.floatRateMin)
              formDom.find("input[name=floatRateMax]").val(data.floatRateMax)
              formDom.find("select[name=priceAccuracy]").val(data.priceAccuracy)
            }
            form.render()
            _this.handlePaltCodeInEdit()
            _this.handlelogisticTypeByCompany()
            _this.handleCountryByCompany()
            _this.addPriceFormula()
            _this.delPriceFormula()
            _this.testPriceFormula()
          },
          yes: function (index, layero) {
            //do something
            const formDom = $("#public_listFormula_edit_form")
            let paramsObj = serializeObject(formDom)
            //#region 验证
            if (paramsObj.formula === "") return layer.msg("请填写定价方式名称")
            if (paramsObj.platCode === "") return layer.msg("请选择平台")
            // 平台为ebay，站点，仓库类型，账号类型必选
            if (paramsObj.platCode === "ebay") {
              if (paramsObj.salesSite === "") return layer.msg("请选择站点")
              if (paramsObj.storeWarehousesType === "")
                return layer.msg("请选择仓库类型")
              if (paramsObj.storeAcctType === "")
                return layer.msg("请选择账号类型")
            }
            if (paramsObj.prodWarehouseId === "")
              return layer.msg("请选择平均成本取值仓库")
            const _siteName = formDom
              .find("select[name=salesSite] option:selected")
              .text()
            paramsObj.siteName = _siteName === "请选择" ? "" : _siteName
            const _storeWarehousesName = formDom
              .find("select[name=storeWarehousesType] option:selected")
              .text()
            paramsObj.storeWarehousesName =
              _storeWarehousesName === "请选择" ? "" : _storeWarehousesName

            // 定价区间
            if (
              paramsObj.listingPriceMax !== "" ||
              paramsObj.listingPriceMin !== ""
            ) {
              if (
                paramsObj.listingPriceMin === "" ||
                paramsObj.listingPriceMax === ""
              ) {
                return layer.msg("请将定价区间填写完整或者不填")
              } else if (
                Number(paramsObj.listingPriceMax) <
                Number(paramsObj.listingPriceMin)
              ) {
                return layer.msg("请将定价区间填写正确大小")
              }
            }
            // 定价公式
            let listingPriceFormula = []
            //
            if (formDom.find(".wrongFormula:visible").length)
              return layer.msg("请将错误的定价公式填写正确")

            let isExistUnTestFormula = false
            formDom.find("input[name=listingPriceFormula]").each(function () {
              const rightFormulaDom = $(this)
                .parent()
                .find(".rightFormula:visible")
              if ($(this).val() !== "" && !rightFormulaDom.length) {
                isExistUnTestFormula = true
              }
            })
            if (isExistUnTestFormula)
              return layer.msg("请将填写的定价公式进行验证")

            formDom.find(".rightFormula:visible").each(function () {
              listingPriceFormula.push(
                $(this)
                  .parent()
                  .parent()
                  .find("input[name=listingPriceFormula]")
                  .val()
              )
            })
            // 重复性校验
            if (
              [...new Set(listingPriceFormula)].length !==
              listingPriceFormula.length
            )
              return layer.msg("已存在相同的定价公式")
            paramsObj.listingPriceFormula = listingPriceFormula.join(",")
            if (paramsObj.listingPriceFormula === "")
              return layer.msg("请填写定价公式且验证")

            // if (paramsObj.logisticCompanyName === "")
            //   return layer.msg("请选择物流商")
            // if (paramsObj.logisticTypeName === "")
            //   return layer.msg("请选择物流方式")
            // if (paramsObj.logisticChargingCountry === "")
            //   return layer.msg("请选择计费国")

            // 浮动区间
            if (
              paramsObj.floatRateMax !== "" ||
              paramsObj.floatRateMin !== ""
            ) {
              if (
                paramsObj.floatRateMin === "" ||
                paramsObj.floatRateMax === ""
              ) {
                return layer.msg("请将浮动区间填写完整或者不填")
              } else if (
                Number(paramsObj.floatRateMax) < Number(paramsObj.floatRateMin)
              ) {
                return layer.msg("请将浮动区间填写正确大小")
              }
            }
            //#endregion 验证
            if (type === "add") {
              _this.createFormulaConfigAjax([{...paramsObj, storeAcctIdStrRef: storeAcctIdStr}]).then((res) => {
                layer.msg(res, { icon: 1 })
                $("#public_listFormula_search").click()
                layer.close(index)
              })
            } else if (type === "edit") {
              _this
                .updateFormulaConfigAjax([{ ...data, ...paramsObj, storeAcctIdStrRef: storeAcctIdStr }])
                .then((res) => {
                  layer.msg(res, { icon: 1 })
                  $("#public_listFormula_search").click()
                  layer.close(index)
                })
            }
          },
        })
      },
      handlePaltCodeInEdit: function () {
        const _this = this
        form.on("select(listFormula_edit_form_platCode)", function (data) {
          _this.changePlatCode($("#public_listFormula_edit_form"), data.value)
          let platCode = data.value;
          _this.togglePriceText(platCode);
          // 平台选择了AE半托管 定价公式增加tips
          let aeTipsContent = $('#AeTips')
          if(platCode === 'AE半托管'){
            aeTipsContent.text('平台物流服务费')
          }else{
            aeTipsContent.text('')
          }
        })
      },

      togglePriceText: function(platCode) {
        let originPlat = ['tiktok', 'walmart', 'fyndiq', 'amazon', 'ebay', 'temu', 'AE全托管', 'mercado', 'wish', 'joom', 'shein自营'];
        let promotionPlat = ['shopee', 'shopee_cnsc', 'miravia', 'daraz', 'lazada', 'shein商城'];
        let allPlat = originPlat.concat(promotionPlat);
        if (originPlat.includes(platCode)) {
          $('#originPrice').show();
          $('#promotionPrice').hide();
        }
        if (promotionPlat.includes(platCode)) {
          $('#originPrice').hide();
          $('#promotionPrice').show();
        }
        if (!allPlat.includes(platCode)) {
          $('#originPrice').hide();
          $('#promotionPrice').hide();
        }
      },
     
      // 匹配店铺
      matchStore: function (obj={}, type=true) {
        const _this = this
        let popIndex = layer.open({
          shadeClose: false,
          type: 1,
          title: "匹配店铺(停用店铺不显示)",
          area: ["1200px", "600px"],
          btn: type ? ['确认', '关闭']: ['确认'],
          content: $("#public_listFormula_matchStorePop").html(),
          success: function () {
              // 初始化店铺选择
              _this.initStoreFormula(obj)
              _this.matchStoreSearch(obj)
              _this.storeCheckAll()
              _this.storeCheck()
              // 一键复制
              $('#public_listFormulaCopy').click(function(){
                let copyArr = []
                $.each($('#matchStoreForm_public_listFormula_checked input[name=storeAcctId]:checked'),function(){
                    copyArr.push($(this).attr("title"))
                });
              copyTxtToClipboard(copyArr.join())
            })
          },
          yes: function (index, layero) {
            var selectedBox = $('#matchStoreForm_public_listFormula_checked [name=storeAcctId]:checked')
            var storeAcctIdStrRef = []
            var storeAcctIdStrNameRef = []
            storeAllInfoRef = []
            selectedBox.each(function(){
              storeAcctIdStrRef.push($(this).data('id'))
              storeAcctIdStrNameRef.push($(this).val())
              let obj = {
                id: $(this).data('id'),
                storeName: $(this).val(),
                isMatch: true
              }
              storeAllInfoRef.push(obj);
            })
            if(type) {
                const params = {...obj,storeAcctIdStrRef:storeAcctIdStrRef.join(',')}
                commonReturnPromise({
                    url: ctx + `/plat/platListingPriceFormulaConfig/updateFormulaConfig`,
                    type: 'POST',
                    contentType: 'application/json',
                    params:JSON.stringify([params])
                }).then(function(result){
                    layer.msg(result, {icon:1});
                    layer.close(popIndex)
                    $("#public_listFormula_search").click()
                }).catch(function(err){
                    layer.confirm(err, {
                        btn: ['关闭'] //可以无限个按钮
                    });
                })
              } else {
                storeAcctIdStr = storeAcctIdStrRef.join(',')
                storeAcctIdStrNameRef = storeAcctIdStrNameRef.join(',')
                layer.close(index)

                let storeInfo = storeAcctIdStrNameRef.slice(0, 20)
                if (storeAcctIdStrNameRef.length > 20) {
                  storeInfo += "...";
                }
                $('#matchStoreInfo').html(storeInfo)
              }
          }
      })
      },

      matchStoreSearch: function(obj){
         //匹配店铺的搜索
        const _this = this
        form.on("submit(matchStoreForm_public_listFormula_submit)",function(data){
          obj.storeAcctStr=data.field.storeAcct
          $('#matchStoreForm_public_listFormula .fieldBox_public_listFormula_checkbox').remove()
          _this.initStoreFormula(obj,true)
        });
      },

      // 匹配店铺弹框成功渲染
    initStoreFormula: function (data,isstoreSerach=false) {
      var Adata = {
          // configId: data.id,
          salesSite: this.SpecialSiteObj[data.salesSite] ? this.SpecialSiteObj[data.salesSite] : data.salesSite,
          platCode: data.platCode,
          storeAcctStr: data.storeAcctStr,
          storeAcctIdStrRef: data.storeAcctIdStrRef
      }
      commonReturnPromise({
        url: ctx + "/plat/platListingPriceFormulaConfig/listStoreByPlatCode",
        type: 'post',
        params: JSON.stringify(Adata),
        contentType: 'application/json'
      }).then(res=>{
        if (res) {
          var storeBox = ``,storeBox_checked = ``;
          var store
          var result = storeAllInfoRef?.length > 0 && !isstoreSerach ? storeAllInfoRef : res
          for (var i =0; i < result.length; ++i) {
              store = result[i]
              store.isMatch?storeBox_checked += `<div class="fieldBox_public_listFormula fieldBox_public_listFormula_checkbox"><input lay-filter="fieldBox_public_listFormula_checkbox_filter" name="storeAcctId" type="checkbox" checked title="`+ store.storeName +`" data-id="`+ store.id +`" lay-skin="primary" value="`+ store.storeName +`" ></div>`:''
              storeBox += `<div class="fieldBox_public_listFormula fieldBox_public_listFormula_checkbox"><input lay-filter="fieldBox_public_listFormula_checkbox_filter" name="storeAcctId" type="checkbox" ` + (store.isMatch ? `checked` : ``) + ` title="`+ store.storeName +`" data-id="`+ store.id +`"  lay-skin="primary" value="`+ store.storeName +`" ></div>`
          }
          if(isstoreSerach){ // 手动搜索，默认不显示
              $('#matchStoreForm_public_listFormula').append(storeBox)

              $('#matchStoreForm_public_listFormula_checked').find('input[type=checkbox]').each(function(){
                  $('#matchStoreForm_public_listFormula').find(`input[type=checkbox][value='${$(this).val()}']`).attr("checked",true);
              })
              form.render('checkbox','matchStoreForm_public_listFormula')
          }else{
              $('#matchStoreForm_public_listFormula_checked').append(storeBox_checked)
              form.render('checkbox','matchStoreForm_public_listFormula_checked')
          }
        }
        })
    },
    // 店铺全选
    storeCheckAll:function(){
      // 匹配店铺弹窗的全选/全不选
      form.on('checkbox(matchStoreForm_public_listFormula_checkAll)', function(data){
        let elemDom = data.elem,elemValue = data.value,elemCheck = data.elem.checked;

        if(elemCheck){ // 全选
            $('#matchStoreForm_public_listFormula').find('input[type=checkbox]').each(function(index){
                if($(this).attr("checked") === "checked"|| index === 0){  // index === 0是全选的那个checkbox
                    // return false;
                }else{ // 需要添加的checkbox
                    // 先设置dom全部选中
                    $(this).attr("checked",true);
                    $('#matchStoreForm_public_listFormula_checked').append(`<div class="fieldBox_public_listFormula fieldBox_public_listFormula_checkbox">${$(this)[0].outerHTML}</div>`);
                }
            })
            form.render('checkbox','matchStoreForm_public_listFormula_checked')
        }else{ // 取消全选
            // 循环查询的所有店铺,如果选中的店铺在这个所有店铺中，删掉选中的这个店铺
            $('#matchStoreForm_public_listFormula').find('input[type=checkbox]').each(function(index,item){
                $(this).attr("checked",false);
                $('#matchStoreForm_public_listFormula_checked').find(`input[type=checkbox][value='${item.value}']`).parent().remove();
            })
            form.render('checkbox','matchStoreForm_public_listFormula_checked')
        }
        // 全选&反选
        $("#matchStoreForm_public_listFormula input[name=storeAcctId]").prop("checked",data.elem.checked)
        form.render('checkbox','matchStoreForm_public_listFormula')
      });
    },

    storeCheck:function(){
       // 监听所有的checkbox
      form.on('checkbox(fieldBox_public_listFormula_checkbox_filter)', function(data){
        let storeBox_checked = ``;
        let elemDom = data.elem,elemValue = data.value,elemCheck = data.elem.checked;
        console.log(data)

        if(data.elem.checked){ // 选中 true
            $(data.elem).attr("checked",true); // 将原始dom设置为选中状态，并添加到已选择店铺
            storeBox_checked += `<div class="fieldBox_public_listFormula fieldBox_public_listFormula_checkbox">${elemDom.outerHTML}</div>`
            $('#matchStoreForm_public_listFormula_checked').append(storeBox_checked)
            // form.render('checkbox','matchStoreForm_public_listFormula_checked')
            // 全选
            if($("#matchStoreForm_public_listFormula").find(".layui-form-checked").length >= $("#matchStoreForm_public_listFormula").find(".fieldBox_public_listFormula").length){
              $("[lay-filter=matchStoreForm_public_listFormula_checkAll]").prop("checked",true);
            }
        }else{
            // 将所有店铺中的选中状态改为false
            $('#matchStoreForm_public_listFormula').find(`input[type=checkbox][value='${elemValue}']`).attr("checked",false);
            // form.render('checkbox','matchStoreForm_public_listFormula')
            // 删掉已选择店铺中的店铺
            $('#matchStoreForm_public_listFormula_checked').find(`input[type=checkbox][value='${elemValue}']`).parent().remove();
            // form.render('checkbox','matchStoreForm_public_listFormula_checked')
            // 取消全选
            $("[lay-filter=matchStoreForm_public_listFormula_checkAll]").prop("checked",false);
        }
        form.render()
      });
    },
      //#region 物流商，物流方式，计费国联动
      // 选取物流商后,物流方式值变化
      handlelogisticTypeByCompany: function () {
        const _this = this
        form.on(
          "select(public_listFormula_editModal_logisticCompanyName)",
          function (data) {
            _this.getListlogistypeList(data.value)
            const curDom = $("#public_listFormula_edit_form").find(
              "select[name=logisticChargingCountry]"
            )
            _this.renderSelect(curDom, [], {
              name: "name",
              code: "code",
            })
            form.render()
          }
        )
      },
      // 选取物流方式后,计费国 值变化
      handleCountryByCompany: function () {
        const _this = this
        form.on(
          "select(public_listFormula_editModal_logisticTypeName)",
          function (data) {
            _this.getCountryList(data.value)
          }
        )
      },
      //物流方式
      getListlogistypeList: function (
        logisticCompanyName = "",
        selected = undefined
      ) {
        const curDom = $("#public_listFormula_edit_form").find(
          "select[name=logisticTypeName]"
        )
        if (logisticCompanyName === "") {
          this.renderSelect(curDom, [], {
            name: "name",
            code: "id",
            selected: selected === undefined ? "" : Number(selected),
          })
          form.render()
        } else {
          this.getListlogistypeAjax({ logisticCompanyName })
            .then((res) => {
              this.renderSelect(curDom, res, {
                name: "name",
                code: "id",
                selected: selected === undefined ? "" : Number(selected),
              })
              form.render()
            })
            .catch(() => {
              this.renderSelect(curDom, [], {
                name: "name",
                code: "id",
                selected: selected === undefined ? "" : Number(selected),
              })
              form.render()
            })
        }
      },
      // 计费国
      getCountryList: function (logisticTypeName = "", selected = undefined) {
        const curDom = $("#public_listFormula_edit_form").find(
          "select[name=logisticChargingCountry]"
        )
        if (logisticTypeName === "") {
          this.renderSelect(curDom, [], {
            name: "cn_name",
            code: "en_simple_name",
            selected: selected,
          })
          form.render()
        } else {
          this.getCountryListAjax(logisticTypeName)
            .then((res) => {
              this.renderSelect(curDom, res, {
                name: "cn_name",
                code: "en_simple_name",
                selected: selected,
              })
              form.render()
            })
            .catch(() => {
              this.renderSelect(curDom, [], {
                name: "cn_name",
                code: "en_simple_name",
                selected: selected,
              })
              form.render()
            })
        }
      },
      //#endregion 物流商，物流方式，计费国联动
      //#region 定价方式
      // 增加定价公式
      addPriceFormula: function () {
        const _this = this
        $("#public_listFormula_edit_addPriceFormula_btn").click(function () {
          const priceFormulaHtml = `<div class="disFCenter mb5">
            <input
              type="text"
              name="listingPriceFormula"
              class="layui-input mr10"
              style="flex: 1;"
              onchange="public_listFormula_change_listingPriceFormula(this)"
            />
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm layui-btn-normal mr10 public-listFormula-delPriceFormula-btn"
              >删除</a
            >
            <a
              href="javascript:;"
              class="layui-btn layui-btn-sm layui-btn-normal mr10 public-listFormula-testPriceFormula-btn"
              >TEST</a
            >
            <div style="width: 30px;">
              <i
                class="layui-icon fGreen public-listFormula-icon-size hidden rightFormula"
                >&#xe605;</i
              >
              <i
                class="layui-icon fRed public-listFormula-icon-size hidden wrongFormula"
                >&#x1006;</i
              >
            </div>
          </div>`
          $("#public_listFormula_edit_priceFormula_list").append(
            priceFormulaHtml
          )
        })
      },
      // 删除定价公式
      delPriceFormula: function () {
        $(document)
          .off("click", ".public-listFormula-delPriceFormula-btn")
          .on("click", ".public-listFormula-delPriceFormula-btn", function () {
            $(this).parent().remove()
          })
      },
      // 验证定价公式的正确性
      testPriceFormula: function () {
        const _this = this
        $(document)
          .off("click", ".public-listFormula-testPriceFormula-btn")
          .on("click", ".public-listFormula-testPriceFormula-btn", function () {
            const inputVal = $(this)
              .parent()
              .find("input[name=listingPriceFormula]")
              .val()
            if (inputVal === "") return layer.msg("请填写公式")
            if(!_this.checkFormulaFn(inputVal)) {
              return layer.msg('公式不合法，请检查格式是否正确！')
            }
            _this
              .checkFormulaAjax(inputVal.replaceAll("+", "%2b"))
              .then((res) => {
                layer.msg(res, { icon: 1 })
                $(this).parent().find(".rightFormula").removeClass("hidden")
                $(this).parent().find(".wrongFormula").addClass("hidden")
              })
              .catch((res) => {
                layer.msg(res, { icon: 2 })
                $(this).parent().find(".wrongFormula").removeClass("hidden")
                $(this).parent().find(".rightFormula").addClass("hidden")
              })
          })
      },

      // 对公式中的非法字符进行提示
      checkFormulaFn: function (formula) {
        // 检查括号是否成对出现
        if (formula.match(/\(|\)/g)) {
          let parentheses = 0;
          for (let i = 0; i < formula.length; i++) {
            if (formula.charAt(i) === '(') {
              parentheses++;
            } else if (formula.charAt(i) === ')') {
              if (parentheses === 0) {
                return false; // 存在不成对的括号
              }
              parentheses--;
            }
          }
          if (parentheses !== 0) {
            return false; // 存在不成对的括号
          }
        }

        // 检查是否包含百分比
        if (formula.match(/%/g)) {
          return false; // 存在百分比
        }
        // 检查是否包含字母
        if (formula.match(/[a-zA-Z]/g)) {
          return false; // 存在字母
        }

        let platCode = $('#list_platCode').val()
        let allowedVariables = []
        // 检查是否有非法字符
        allowedVariables = ['商品成本', '平均成本', '最小成本', '运费', '汇率', '毛利率', '平台提成', '最低毛利', '固定手续费', '优惠幅度', '商品价值'];

        // 半托管添加--平台物流服务费
        if(platCode === 'AE半托管'){
          allowedVariables = ['商品成本', '平均成本', '最小成本', '运费', '汇率', '毛利率', '平台提成', '最低毛利', '固定手续费', '优惠幅度', '平台物流服务费'];
        }
        // 提取公式中的变量，即去除数字和算术符号的部分
        const variables = formula.match(/[\u4e00-\u9fa5]+/g) || [];
        console.log('variables', variables)
        // 验证变量是否在允许的变量列表中
        const isValid = variables.every(variable => allowedVariables.includes(variable));
        if (!isValid) {
          return false;
        }
        return true; // 公式正确
      },
      //#endregion 定价方式
      //#region 接口start
      // 平台和物流属性
      getPlatCodeAndLogisAjax: function (platCode) {
        return commonReturnPromise({
          url: ctx + "/unauditorder/listenum.html?needFilterFake=0",
        })
      },
      // 站点
      getSiteAjax: function (platCode) {
        return commonReturnPromise({
          url: ctx + "/enum/getSiteEnum.html?platCode=" + platCode,
          type: "post",
        })
      },
      // 仓库类型
      getStockTypeAjax: function (platCode) {
        return commonReturnPromise({
          url: ctx + "/enum/getStockLocationEnum?platCode=" + platCode,
          type: "get",
        })
      },
      // 平均成本取值仓库
      getAverCostWarehouseAjax: function () {
        return commonReturnPromise({
          url: ctx + "/prodWarehouse/getAllProdWarehouse.html",
          type: "post",
        })
      },
      // 物流商
      getListcompanyAjax: function () {
        return commonReturnPromise({
          url: ctx + "/company/specialType?specialType=定价",
          type: "post",
        })
      },
      getListlogistypeAjax: function (obj = { logisticCompanyName: "" }) {
        const { logisticCompanyName } = obj
        return commonReturnPromise({
          url:
            ctx +
            `/unauditorder/listlogistype.html?agent=&logisticsCompanyId=${logisticCompanyName}&specialType=定价`,
          type: "post",
        })
      },
      getCountryListAjax: function (logiticsTypeId = "") {
        return commonReturnPromise({
          url: ctx + `/type/country/list?logiticsTypeId=${logiticsTypeId}`,
        })
      },
      checkFormulaAjax: function (formula) {
        return commonReturnPromise({
          url:
            ctx +
            `/plat/platListingPriceFormulaConfig/checkFormula?formula=${formula}`,
          contentType: "application/json;charset=UTF-8",
        })
      },
      // 新增
      createFormulaConfigAjax: function (obj) {
        return commonReturnPromise({
          url: ctx + "/plat/platListingPriceFormulaConfig/createFormulaConfig",
          params: JSON.stringify(obj),
          type: "post",
          contentType: "application/json;charset=UTF-8",
        })
      },
      // 编辑
      updateFormulaConfigAjax: function (obj) {
        return commonReturnPromise({
          url: ctx + "/plat/platListingPriceFormulaConfig/updateFormulaConfig",
          params: JSON.stringify(obj),
          type: "post",
          contentType: "application/json;charset=UTF-8",
        })
      },
      // 删除
      deleteFormulaConfigAjax: function (id) {
        return commonReturnPromise({
          url:
            ctx +
            `/plat/platListingPriceFormulaConfig/deleteFormulaConfig?id=${id}`,
        })
      },
      //#endregion 接口end
      // 渲染select，，公共是写id的，id不想写了，
      renderSelect: function (dom, data, opts) {
        var defaultOpts = Object.assign(
          {
            str: '<option value="">请选择</option>',
            name: "",
            code: "",
            selected: "",
          },
          opts
        )
        var dataFirst = data[0] ? data[0] : ""
        var isObject =
          Object.prototype.toString.call(dataFirst) === "[object Object]"
            ? true
            : false
        let optionStr = defaultOpts.str
        let selected = defaultOpts.selected
        if (isObject) {
          let $name = defaultOpts.name
          let $code = defaultOpts.code
          for (let [index, item] of data.entries()) {
            if (selected === item[$code]) {
              optionStr += `<option value="${item[$code]}" selected>${item[$name]}</options>`
            } else {
              optionStr += `<option value="${item[$code]}">${item[$name]}</options>`
            }
          }
        } else {
          for (let elem of data) {
            if (selected === elem) {
              optionStr += `<option value="${elem}" selected>${elem}</options>`
            } else {
              optionStr += `<option value="${elem}">${elem}</options>`
            }
          }
        }
        dom.html(optionStr)
      },
    }
    publicListFormulaName.init()
  }
)

function public_listFormula_change_listingPriceFormula(dom) {
  $(dom).parent().find(".rightFormula").addClass("hidden")
  $(dom).parent().find(".wrongFormula").addClass("hidden")
}

//左侧按钮enum
let ShopeeMarketCBasicList = [
  // 本来准备写促销在这个页面的，因为他本来就有了，所以后来产品决定把它去掉
  // { exportName: '导入促销信息', AddNewActivityName: '新增促销', syncName: '同步促销', discountType: "1" },
  {
    exportName: "导入优惠券信息",
    batchEndName: "终止优惠券",
    AddNewActivityName: "新增优惠券",
    syncName: "同步优惠券",
    discountType: "2",
  },
  {
    exportName: "导入捆绑销售信息",
    batchEndName: "终止捆绑销售",
    AddNewActivityName: "新增捆绑销售",
    syncName: "同步捆绑销售",
    discountType: "3",
  },
  {
    exportName: "导入加购信息",
    batchEndName: "终止加购",
    AddNewActivityName: "新增加购",
    syncName: "同步加购",
    discountType: "4",
  },
  {
    exportName: "导入关注有礼信息",
    batchEndName: "终止关注有礼",
    AddNewActivityName: "新增关注有礼",
    syncName: "同步关注有礼",
    discountType: "5",
  },
];

(function ($, layui, window, document, undefined) {
  layui.use(
    [
      "admin",
      "form",
      "layer",
      "table",
      "formSelects",
      "element",
      "upload",
      "laydate",
      "laytpl",
      "layCascader",
    ],
    function () {
      var admin = layui.admin,
        form = layui.form,
        layer = layui.layer,
        table = layui.table,
        formSelects = layui.formSelects,
        element = layui.element,
        upload = layui.upload,
        laydate = layui.laydate,
        laypage = layui.laypage,
        layCascader = layui.layCascader,
        laytpl = layui.laytpl;
      $ = layui.$;

      render_hp_orgs_users("#shopee_marketCenter");
      form.render();

      // 添加新的种类时，还需table的工具栏的进行中的对终止按钮进行判断处理
      var shopeeMarketCenterName = {
        // 当前tab
        currentTab: "upcoming", //在线
        //当前优惠类型的值
        curDiscountType: 2,
        // 币种枚举值
        siteCurrencyList: [],
        // 类目
        shopeeCateTree: null,
        // 优惠券展示类型
        DisplayChannelList: [],
        // 优惠券类型
        VoucherTypeList: [],
        // 所有店铺值
        allStore: [],
        // 接口配置
        someApiList: function (urlType, getParams = "") {
          let type = $("#shopee_marketCenter")
            .find("select[name=marketCenterType]")
            .val();
          let urlList = [
            {
              type: 2, //优惠券
              name: "voucher",
              creatorUrl: ctx + "/shopee/voucher/findAllCreatorShopeeVoucher", //创建人接口
              modifierUrl: ctx + "/shopee/voucher/findAllModifierVoucher", //修改人接口
              syncStoreUrl:
                ctx + `/shopee/voucher/syncByStoreIdList`, //同步店铺
              mainCol: this.couponCols(),
              rest: "#shopee_marketCenter_rewardType_rest", //编辑新增弹窗  的 联动 的模板id
              linkageRest: "#shopee_marketCenter_linkage_rewardType_rest", //编辑新增弹窗  的联动 的视图位置
              linkName: "rewardType", //活动优惠类型的字段
              addActivityUrl: ctx + "/shopee/voucher/add_voucher", //新增活动
              updateActivityUrl: ctx + "/shopee/voucher/update_voucher", //编辑活动
              endActivityUrl:
                ctx + `/shopee/voucher/end_voucher/${getParams.voucherId}`, //终止活动
              delActivityUrl: "",
              statusField: "voucherStatus", //状态的字段
              nameField: "voucherName", //优惠名称对应的字段
              idsField: "voucherIds", //ids 字段
              searchUrl: ctx + "/shopee/voucher/get_voucher_list", //搜索接口
              reportLogUrl: ctx + "/shopee/voucher/importVoucherOperateLog/", // 操作日志接口
              importUrl: ctx + "/shopee/voucher/importVoucherData", //导入接口
              syncUrl: ctx + "/shopee/voucher/batch/sync", //同步接口
              syncField: "voucherId", //同步字段
              downloadLogUrl: ctx + "/shopee/voucher/downloadLog?" + getParams, //操作日志  下载结果文件
              downloadTplUrl:
                ctx + "/shopee/voucher/downloadTemplate?" + getParams, //下载模板
              downloadTplFileName: "shopee优惠券模板.xlsx", //下载模板的文件名
              exportCurListUrl: ctx + "/shopee/voucher/export_voucher_list", //导出当前数据
              exportCurListName: "shopee优惠券.xlsx", //导出当前数据文件名
              batchEndUrl: ctx + "/shopee/voucher/endVoucherByVoucherIdList", //批量终止接口
              batchEndField: "voucherIdList", //批量终止字段 (需要用到voucherId，)
              autoRenewUrl: ctx + "/shopee/voucher/autoRenewSetting", //修改自动续期状态   (需要用到voucherId，)
            },
            {
              type: 3, //捆绑销售
              name: "bundleDeal",
              creatorUrl:
                ctx + "/shopee/bundleDeal/findAllCreatorShopeeBundleDeal", //创建人接口
              modifierUrl:
                ctx + "/shopee/bundleDeal/findAllModifierShopeeBundleDeal", //修改人接口
              syncStoreUrl:
                ctx +
                `/shopee/bundleDeal/syncByStoreAcctIdList`, //同步店铺
              mainCol: this.bundleDealCols(),
              rest: "#shopee_marketCenter_ruleType_rest",
              linkageRest: "#shopee_marketCenter_linkage_ruleType_rest",
              linkName: "ruleType", ////活动优惠类型的字段
              addActivityUrl: ctx + "/shopee/bundleDeal/addBundleDeal", //新增活动
              updateActivityUrl: ctx + "/shopee/bundleDeal/update_bundle_deal", //编辑活动
              endActivityUrl:
                ctx +
                `/shopee/bundleDeal/end_bundle_deal/${getParams.bundleDealId}`, //终止活动
              delActivityUrl: ctx + "/shopee/bundleDeal/delete_bundle_deal", //删除活动
              delField: "bundleDealId", //删除字段
              statusField: "timeStatus", //状态的字段
              nameField: "bundleDealName", //优惠名称对应的字段
              idsField: "bundleDealIds", //ids 字段
              searchUrl: ctx + "/shopee/bundleDeal/get_bundle_deal_list", //搜索接口
              reportLogUrl:
                ctx + "/shopee/bundleDeal/importFollowPrizeOperateLog/", // 操作日志接口
              importUrl: ctx + "/shopee/bundleDeal/importBundleDealData", //导入接口
              syncUrl: ctx + "/shopee/bundleDeal/batch/sync", //同步接口
              syncField: "bundleDealId", //同步字段
              downloadLogUrl:
                ctx + "/shopee/bundleDeal/downloadLog?" + getParams, //操作日志  下载结果文件
              downloadTplUrl:
                ctx + "/shopee/bundleDeal/downloadTemplate?" + getParams, //下载模板
              downloadTplFileName: "shopee_bundle_deal.xlsx", //下载模板的文件名
              exportCurListUrl:
                ctx + "/shopee/bundleDeal/export_bundle_deal_list", //导出当前数据
              exportCurListName: "shopee捆绑销售.xlsx", //导出当前数据文件名
              batchEndUrl:
                ctx + "/shopee/bundleDeal/endBundleDealByBundleDealIdList", //批量终止接口
              batchEndField: "bundleDealIdList", //批量终止字段
              autoRenewUrl: ctx + "/shopee/bundleDeal/autoRenewSetting", //修改自动续期状态   (需要用到bundleDealId，)
            },
            {
              type: 4, //加购
              name: "addOn",
              creatorUrl: ctx + "/shopee/voucher/findAllCreatorShopeeVoucher", //创建人接口
              modifierUrl: ctx + "/shopee/voucher/findAllCreatorShopeeVoucher", //修改人接口
              syncStoreUrl:
                ctx + `/shopee/voucher/syncByStoreId/${getParams.storeAcctId}`, //同步店铺
              mainCol: this.addOnCols(),
              rest: "#shopee_marketCenter_rewardType_rest", //编辑新增弹窗  的 联动 的模板id
              linkageRest: "#shopee_marketCenter_linkage_rewardType_rest", //编辑新增弹窗  的联动 的视图位置
              linkName: "rewardType",
              addActivityUrl: ctx + "/shopee/voucher/add_voucher", //新增活动
              updateActivityUrl: ctx + "/shopee/voucher/update_voucher", //编辑活动
              // endActivityUrl: ctx + `/shopee/voucher/end_voucher/${getParams.campaignId}`,  //终止活动
              delActivityUrl: "",
              statusField: "", //状态的字段
              nameField: "addOnDealName", //优惠名称对应的字段
              idsField: "addOnIds", //ids 字段
              searchUrl:
                "http://rap2api.taobao.org/app/mock/278291/smt/searchPromotion", //搜索接口
              reportLogUrl: ctx + "/shopee/voucher/importVoucherOperateLog/", // 操作日志接口
              importUrl: ctx + "/shopee/voucher/importVoucherData", //导入接口
              syncUrl: ctx + "/shopee/voucher/batch/sync", //同步接口
              syncField: "addOnId", //同步字段
              downloadLogUrl: ctx + "/shopee/voucher/downloadLog?" + getParams, //操作日志  下载结果文件
              downloadTplUrl:
                ctx + "/shopee/voucher/downloadTemplate?" + getParams, //下载模板
              downloadTplFileName: "shopee加购模板.xlsx", //下载模板的文件名
              exportCurListUrl: ctx + "/shopee/addon/export_addon_list", //导出当前数据
              exportCurListName: "shopee加购.xlsx", //导出当前数据文件名
              // batchEndUrl: ctx + '/shopee/bundleDeal/endBundleDealByBundleDealIdList', //批量终止接口
              // batchEndField: 'bundleDealIdList',  //批量终止字段
            },
            {
              type: 5, //关注有礼
              name: "followPrize",
              creatorUrl:
                ctx + "/shopee/followPrize/findAllCreatorShopeeFollowPrize", //创建人接口
              modifierUrl:
                ctx + "/shopee/followPrize/findAllModifierShopeeFollowPrize", //修改人接口
              syncStoreUrl:
                ctx +
                `/shopee/followPrize/syncByStoreIdList`, //同步店铺
              mainCol: this.followPrizeCols(),
              rest: "#shopee_marketCenter_rewardType_rest", //编辑新增弹窗  的 联动 的模板id
              linkageRest: "#shopee_marketCenter_linkage_rewardType_rest", //编辑新增弹窗  的联动 的视图位置
              linkName: "rewardType",
              addActivityUrl: ctx + "/shopee/followPrize/add_follow_prize", //新增活动
              updateActivityUrl:
                ctx + "/shopee/followPrize/update_follow_prize", //编辑活动
              endActivityUrl:
                ctx +
                `/shopee/followPrize/end_follow_prize/${getParams.campaignId}`, //终止活动
              delActivityUrl: "",
              statusField: "followPrizeStatus", //状态的字段
              nameField: "followPrizeName", //优惠名称对应的字段
              idsField: "campaignIds", //ids 字段
              searchUrl: ctx + "/shopee/followPrize/get_follow_prize_list", //搜索接口
              reportLogUrl:
                ctx + "/shopee/followPrize/importFollowPrizeOperateLog/", // 操作日志接口
              importUrl: ctx + "/shopee/followPrize/importFollowPrizeData", //导入接口
              syncUrl: ctx + "/shopee/followPrize/batch/sync", //同步接口
              syncField: "campaignId", //同步字段
              downloadLogUrl:
                ctx + "/shopee/followPrize/downloadLog?" + getParams, //操作日志  下载结果文件
              downloadTplUrl:
                ctx + "/shopee/followPrize/downloadTemplate?" + getParams, //下载模板
              downloadTplFileName: "shopee关注有礼模板.xlsx", //下载模板的文件名
              exportCurListUrl:
                ctx + "/shopee/followPrize/export_follow_prize_list", //导出当前数据
              exportCurListName: "shopee关注有礼.xlsx", //导出当前数据文件名
              batchEndUrl:
                ctx + "/shopee/followPrize/endFollowPrizeByCampaignIdList", //批量终止接口
              batchEndField: "campaignIdList", //批量终止字段
              autoRenewUrl: ctx + "/shopee/followPrize/autoRenewSetting", //修改自动续期状态
            },
          ];
          let result = urlList.filter((item) => item.type == type)[0][urlType];
          return result;
        },
        // 站点
        initSite: function () {
          commonReturnPromise({
            url: "/lms/shopee/onlineProductShopee/getShopeeOnlineEnum.html",
            type: "post",
          }).then(({ siteList = [] }) => {
            formSelects.data("shopee_marketCenter_site_sel", "local", {
              arr: siteList.map((item) => ({ ...item, value: item.code })),
            });
          });
        },
        initVoucherType: function () {
          const _this = this;
          commonReturnPromise({
            url: "/lms/shopee/voucher/getVoucherTypeEnum",
          })
            .then((res) => {
              _this.VoucherTypeList = res;
              // _this.searchLeftBtnLinkage(2);
            })
            .then(() => {
              _this.searchLeftBtnLinkage(2);
              _this.needRefreshFuc();
            });
        },
        initStoreTag: function () {
          // 店铺标签
          commonReturnPromise({
            url: "/lms/sysdict/getStoreTagByCode",
            type: "post",
            params: { codes: "shopee" },
          }).then((res) => {
            formSelects.data("shopee_marketCenter_storeTagList", "local", {
              arr: res.map((item) => ({ ...item, value: item.name })),
            });
          });
        },
        initCurrecyList: function () {
          commonReturnPromise({
            url: "/lms/enum/getSiteEnum.html?platCode=shopee",
          }).then((res) => {
            this.siteCurrencyList = res;
          });
        },
        initDisplayChannelList: function () {
          let _this = this;
          commonReturnPromise({
            url: "/lms/shopee/voucher/getDisplayChannelEnum",
          }).then((res) => {
            _this.DisplayChannelList = res;
            formSelects.data(
              "shopee_marketCenter_search_displayChannel",
              "local",
              {
                arr: res.map((item) => ({
                  name: item.displayChannelCn,
                  value: item.code,
                })),
              }
            );
          });
        },
        //开始时间渲染
        startTimeSearch: function (data) {
          laydate.render({
            elem: "#shopee_marketCenter_start",
            type: "datetime", //可选择：年月日时分秒
            trigger: "click", //采用click弹出
            max: !!data ? data : "2099-12-31 00:00:00",
            range: true,
          });
        },
        // 结束时间渲染
        endTimeSearch: function (data) {
          laydate.render({
            elem: "#shopee_marketCenter_end",
            type: "datetime", //可选择：年月日时分秒
            min: !!data ? "2021-9-1 00:00:00" : "1900-1-1 00:00:00",
            range: true,
          });
        },
        // 修改 创建 时间渲染
        timeTypeSearch: function (data) {
          laydate.render({
            elem: "#shopee_marketCenter_timeTypeVal",
            type: "datetime", //可选择：年月日时分秒
            min: !!data ? "2021-9-1 00:00:00" : "1900-1-1 00:00:00",
            range: true,
          });
        },
        // 监听tab点击
        tabMonitor: function () {
          var _this = this;
          element.on("tab(shopee_marketCenter_tab)", function (data) {
            _this.currentTab = $(this).attr("status");
            $("#shopee_marketCenter_search").click();
          });
        },
        // 优惠类型与左侧按钮联动、与搜索区域联动
        searchLeftBtnLinkage: function (data) {
          const _this = this;
          let operGetTpl = shopee_marketCenter_right_operation.innerHTML;
          let operView = document.getElementById(
            "shopee_marketCenter_right_linkage"
          );
          let operSearchGetTpl = shopee_marketCenter_addition_search.innerHTML;
          let operSearchView = document.getElementById(
            "shopee_marketCenter_search_linkage"
          );
          let _data = ShopeeMarketCBasicList.filter(
            (item) => item.discountType == data
          )[0];
          laytpl(operGetTpl).render(_data, function (html) {
            operView.innerHTML = html;
          });
          const paramsObj = {
            ..._data,
            voucherTypeList: _this.VoucherTypeList || [],
          };
          laytpl(operSearchGetTpl).render(paramsObj, function (html) {
            operSearchView.innerHTML = html;
            layui.formSelects.render("shopee_marketCenter_rewardTypeList");
          });
          form.render();
        },
        // 店铺同步
        syncStore: function () {
          const storeAcctIdList = layui.formSelects.value('shopee_marketCenter_store', 'val')
          if (!storeAcctIdList.length) return layer.msg("店铺同步需要选择店铺");
          layer.msg("同步店铺开始");
          this
            .syncStoreAjax(storeAcctIdList)
            .then((data) => {
              if (
                Object.prototype.toString.call(data) === "[object Object]"
              ) {
                let str = Object.keys(data).map(v=>`<div>${v}：总更新活动数量：${data[v].total || 0}</div>`).join('')
                layer.open({
                  title: "同步店铺结果",
                  id: "shopee_marketCenter_syncStore_Id",
                  area: "350px",
                  content: str,
                });
                $("#shopee_marketCenter_search").click();
              } else {
                layer.msg("同步店铺操作成功", { icon: 1 });
                $("#shopee_marketCenter_search").click();
              }
            })
            .catch((err) => {
              layer.msg(err, { icon: 2 });
            });
          
        },
        // 创建人下拉框
        creatorList: function () {
          this.creatorAjax()
            .then((data) => {
              commonRenderSelect("shopee_marketCenter_creator", data);
            })
            .then(() => form.render())
            .catch((err) => layer.msg(err, { icon: 2 }));
        },
        modifierList: function () {
          this.modifierAjax()
            .then((data) => {
              commonRenderSelect("shopee_marketCenter_creator", data);
            })
            .then(() => form.render())
            .catch((err) => layer.msg(err, { icon: 2 }));
        },
        getPersonType: function () {
          const _this = this;
          form.on("select(shopee_marketCenter_personType)", function (obj) {
            _this.getPersonList(obj.value);
          });
        },
        getPersonList: function (type) {
          if (type === "creator") {
            this.creatorList();
          } else {
            this.modifierList();
          }
        },
        allStoreList: function () {
          var _this = this;
          this.allStoreAjax()
            .then((data) => {
              _this.allStore = data;
            })
            .catch((err) => layer.msg(err, { icon: 2 }));
        },
        // 点击搜索
        voucherListSearch: function () {
          var _this = this;
          $("#shopee_marketCenter_search").click(function () {
            _this.tableRender();
          });
        },
        // 重置
        voucherListReset: function () {
          const _this = this;
          $("#shopee_marketCenter_reset").click(function () {
            $("#shopee_marketCenter")
              .find("select[name=org]")
              .next()
              .find("dl>dd:first-child")
              .click();
            setTimeout(function () {
              $("#shopee_marketCenter")
                .find("select[name=marketCenterType]")
                .val(_this.curDiscountType);
            });
          });
        },
        // 获取搜索数据
        voucherListSearchData: function () {
          var _this = this;
          let params = serializeObject($("#shopee_marketCenter"));
          // 店铺
          params.storeAcctIdList = formSelects.value('shopee_marketCenter_store', 'val')
          params.startTimeLowerBound = params.startTime
            ? params.startTime.split(" - ")[0]
            : "";
          params.startTimeUpperBound = params.startTime
            ? params.startTime.split(" - ")[1]
            : "";
          params.endTimeLowerBound = params.endTime
            ? params.endTime.split(" - ")[0]
            : "";
          params.endTimeUpperBound = params.endTime
            ? params.endTime.split(" - ")[1]
            : "";
          params[_this.someApiList("nameField")] = $("#shopee_marketCenter")
            .find("input[name=discountName]")
            .val(); //优惠名称
          if (!!params[_this.someApiList("idsField")]) {
            //id
            let _ids = params[_this.someApiList("idsField")].split(",");
            params[_this.someApiList("idsField")] = [...new Set(_ids)];
          } else {
            delete params[_this.someApiList("idsField")];
          }
          // 站点
          params.siteIdList = formSelects.value(
            "shopee_marketCenter_site_sel",
            "val"
          );
          // 创建人 修改人
          params[params.personType] = params.personName;
          // 创建时间 修改时间
          if (params.timeTypeVal) {
            if (params.timeType === "createTime") {
              params.createTimeLowerBound = params.timeTypeVal.split(" - ")[0];
              params.createTimeUpperBound = params.timeTypeVal.split(" - ")[1];
            } else {
              params.modifyTimeLowerBound = params.timeTypeVal.split(" - ")[0];
              params.modifyTimeUpperBound = params.timeTypeVal.split(" - ")[1];
            }
          }
          // 店铺标签
          params.storeTagList = formSelects.value(
            "shopee_marketCenter_storeTagList",
            "val"
          );
          //   捆绑销售查询
          let type = $("#shopee_marketCenter")
            .find("select[name=marketCenterType]")
            .val();
          //优惠券 展示类型
          if (type == 2) {
            params.displayChannelList = formSelects.value(
              "shopee_marketCenter_search_displayChannel",
              "val"
            );
            params.rewardTypeList = formSelects.value(
              "shopee_marketCenter_rewardTypeList",
              "val"
            );
          }
          if (type == 3) {
            if (_this.currentTab == "draft") {
              params.ifDraft = true;
            } else {
              params.ifDraft = false;
              let statusObj = {
                upcoming: 2,
                ongoing: 3,
                expired: 4,
              };
              params[_this.someApiList("statusField")] =
                statusObj[_this.currentTab];
            }
            params.isAllCate == "true" && (params.isAllCate = true);
            params.isAllCate == "false" && (params.isAllCate = false);
            params.cateIds = (params.cateIds || "")
              .split(",")
              .map((item) => Number(item))
              .filter((item) => !!item);
            params.ruleTypeList = formSelects.value(
              "shopee_marketCenter_ruleTypeList",
              "val"
            );
            params.tierTypeList = formSelects.value(
              "shopee_marketCenter_tierTypeList",
              "val"
            );
          } else {
            params[_this.someApiList("statusField")] = _this.currentTab; //不同类型的对应字段不同
            params.rewardTypeList = formSelects.value(
              "shopee_marketCenter_rewardTypeList",
              "val"
            );
          }

          delete params.startTime;
          delete params.endTime;
          delete params.timeTypeVal;
          delete params.timeType;
          delete params.personName;
          delete params.personType;
          delete params.marketCenterType;
          delete params.discountName;

          return params;
        },
        // 点击同步按钮
        VoucherSync: function () {
          var _this = this;
          let { data } = table.checkStatus("shopee_marketCenter_table");
          if (!data.length) return layer.msg("请选择要同步的数据");
          let idName = _this.someApiList("syncField");
          let idList = data.map((item) => Number(item[idName]));
          _this
            .VoucherSyncAjax(idList)
            .then((data) => {
              if (!data.length) {
                layer.msg("暂无同步数据", { icon: 2 });
              } else {
                let _data = data.map((item) => {
                  const arr = data.find((elem) => item[idName] == elem[idName]);
                  return {
                    ...item,
                    result: arr.result,
                    resultMsg: arr.message,
                  };
                });

                _this.VoucherSyncResult(_data);
              }
            })
            .catch((err) => layer.msg(err || err.msg, { icon: 2 }));
        },
        // 同步table的优惠券列
        syncCols: function () {
          let type = $("#shopee_marketCenter")
            .find("select[name=marketCenterType]")
            .val();
          const cols = [
            { field: "voucherName", title: "优惠券名称", type: 2 },
            { field: "bundleDealName", title: "捆绑销售名称", type: 3 },
            { field: "addOnName", title: "加购名称", type: 4 },
            { field: "followPrizeName", title: "关注有礼名称", type: 5 },
          ];

          let _col = cols.filter((item) => item.type == type)[0];
          return [
            [
              { field: _col.field, title: _col.title, width: 200 },
              { field: "storeAcct", title: "店铺", width: 200 },
              {
                field: this.someApiList("syncField"),
                title: "优惠Id",
                width: 140,
              },
              {
                field: "resultMsg",
                title: "操作结果",
                templet: "#shopee_marketCenter_sync_result_info",
              },
            ],
          ];
        },
        // 同步结果  弹窗显示
        VoucherSyncResult: function (arr) {
          var _this = this;
          layer.open({
            title: "同步结果",
            type: 1,
            maxmin: true,
            shade: false,
            id: "shopee_marketCenter_sync_resultId",
            area: ["800px", "800px"],
            content: $("#shopee_marketCenter_sync_result").html(),
            success: function (layero) {
              // 阻止弹窗整体内容滑动,让table的内容滑动
              $(layero).find(".layui-layer-content").css("overflow", "hidden");
              table.render({
                elem: "#shopee_marketCenter_sync_result_table",
                id: "shopee_marketCenter_sync_result_table_id",
                data: arr,
                limit: 999,
                cols: _this.syncCols(),
                done: function (res, curr, count) {
                  $(layero)
                    .find(".layui-card-header")
                    .find(".total")
                    .html(count);
                  // 成功id
                  _this.VoucherSyncAssign(layero, res.data, 1, "succ");
                  // 失败id
                  _this.VoucherSyncAssign(layero, res.data, 0, "fail");
                },
              });
            },
            min: function () {
              $("#shopee_marketCenter_search").click();
            },
            cancel: function () {
              $("#shopee_marketCenter_search").click();
            },
          });
        },
        // 同步结果 赋值按钮的显示以及赋值id
        VoucherSyncAssign: function (layero, data, result, status) {
          let selectList = data.filter((item) => item.result === result);
          if (selectList.length === 0) {
            $(layero).find(".layui-card-header").find(`.${status}`).hide();
          } else {
            let _selectList = selectList
              .map((item) => item[this.someApiList("syncField")])
              .join(",");
            $(layero)
              .find(".layui-card-header")
              .find(`.${status}`)
              .find("span")
              .html(_selectList);
          }
        },
        // 同步接口
        VoucherSyncAjax: function (list) {
          let _url = this.someApiList("syncUrl");
          return commonReturnPromise({
            url: _url,
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(list),
          });
        },
        // 搜索table 的 优惠券列
        couponCols: function () {
          const _this = this;
          return [
            [
              { type: "checkbox" },
              { field: "voucherId", title: "优惠券Id", width: 150 },
              { field: "voucherName", title: "优惠券名称", width: 150 },
              { field: "voucherCode", title: "折扣码"},
              {
                field: "voucherType",
                title: "优惠券类型",
                templet: (d) => {
                  let str = "";
                  let curType = _this.VoucherTypeList.filter(
                    (item) => item.code == d.voucherType
                  );
                  if (curType.length > 0) {
                    str = curType[0].type;
                  }
                  return str;
                },
              },
              {
                field: "autoRenew",
                title: "活动类型",
                templet: "#shopee_marketCenter_autoRenenw_row",
              },
              {
                field: "storeAcct",
                title: "店铺",
                templet: (d) => {
                  let tagDoms = "";
                  if (d.storeTagList && d.storeTagList.length) {
                    tagDoms = d.storeTagList
                      .map(
                        (item) =>
                          `<span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">${item}</span>`
                      )
                      .join("");
                  }
                  return `<div>${d.storeAcct}${tagDoms}</div>`;
                },
              },
              { field: "salesperson", title: "销售员" },
              {
                field: "startTime",
                title: "活动时间",
                templet:
                  "<div>{{Format(d.startTime,'yyyy-MM-dd hh:mm:ss')}}</br>{{Format(d.endTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                width: 150,
              },
              {
                field: "displayChannelListCn",
                title: "展示类型",
              },
              {
                field: "voucherType",
                title: "优惠类型",
                templet: "#shopee_marketCenter_voucherType_follow",
              },
              {
                field: "discountInfo",
                title: "优惠情况",
                width: 150,
                templet: "#shopee_marketCenter_vocherInfo",
              },
              {
                field: "quantity",
                title: "数量/使用量",
                width: 100,
                templet: "<div>{{d.usageQuantity}} / {{d.currentUsage}}</div>",
              },
              {
                field: "creator",
                title: "操作人",
                width: 100,
                templet:
                  "<div>创建:{{d.creator || ''}} <br> 修改:{{d.modifier ||''}}</div>",
              },
              {
                field: "createTime",
                title: "操作时间",
                width: 170,
                templet:
                  "<div>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss') || ''}} <br> 修改:{{Format(d.updateTime,'yyyy-MM-dd hh:mm:ss') ||''}}</div>",
              },
              {
                title: "操作",
                align: "center",
                style: "vertical-align: top;",
                toolbar: "#shopee_marketCenter_toolbar",
                width: 100,
              },
            ],
          ];
        },
        // 搜索table 的 捆绑销售列
        bundleDealCols: function () {
          return [
            [
              { type: "checkbox" },
              { field: "bundleDealId", title: "捆绑销售ID", width: 100 },
              { field: "bundleDealName", title: "名称", width: 150 },
              {
                field: "autoRenew",
                title: "活动类型",
                templet: "#shopee_marketCenter_autoRenenw_row",
              },
              {
                field: "storeAcct",
                title: "店铺",
                templet: (d) => {
                  let tagDoms = "";
                  if (d.storeTagList && d.storeTagList.length) {
                    tagDoms = d.storeTagList
                      .map(
                        (item) =>
                          `<span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">${item}</span>`
                      )
                      .join("");
                  }
                  return `<div>${d.storeAcct}${tagDoms}</div>`;
                },
              },
              { field: "salesperson", title: "销售员" },
              {
                field: "startTime",
                title: "活动时间",
                templet:
                  "<div>{{Format(d.startTime,'yyyy-MM-dd hh:mm:ss')}}<br>{{Format(d.endTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                width: 150,
              },
              {
                field: "ruleType",
                title: "优惠类型",
                // width: 150,
                templet: "#shopee_marketCentre_bundleDealType",
              },
              {
                field: "isAllCate",
                title: "CNSC类目",
                templet: function (d) {
                  let isNotAllCate = d.cateIds && d.cateIds.length;
                  return `<div>${isNotAllCate ? `指定类目` : `全部类目`}</div>`;
                },
              },
              {
                field: "listingLimit",
                title: "利润/利率/成本/重量",
                templet: (d) => {
                  let profit = "利润";
                  if (d.minProfitLte !== undefined) {
                    profit = profit + "≤" + d.minProfitLte + d.currency;
                  }
                  if (d.minProfitGte !== undefined) {
                    profit = d.minProfitGte + d.currency + "≤" + profit;
                  }
                  if (
                    d.minProfitGte === undefined &&
                    d.minProfitLte === undefined
                  ) {
                    profit = "";
                  }

                  let rate = "利率";
                  if (d.minRateLte !== undefined) {
                    rate = rate + "≤" + d.minRateLte + "%";
                  }
                  if (d.minRateGte !== undefined) {
                    rate = d.minRateGte + "%" + "≤" + rate;
                  }
                  if (
                    d.minRateLte === undefined &&
                    d.minRateGte === undefined
                  ) {
                    rate = "";
                  }

                  let cost = "成本";
                  if (d.maxCostLteCny !== undefined) {
                    cost = cost + "≤" + d.maxCostLteCny + "元";
                  }
                  if (d.maxCostGteCny !== undefined) {
                    cost = d.maxCostGteCny + "元" + "≤" + cost;
                  }
                  if (
                    d.maxCostLteCny === undefined &&
                    d.maxCostGteCny === undefined
                  ) {
                    cost = "";
                  }

                  let weight = "重量";
                  if (d.maxWeightLte !== undefined) {
                    weight = weight + "≤" + d.maxWeightLte + "g";
                  }
                  if (d.maxWeightGte !== undefined) {
                    weight = d.maxWeightGte + "g" + "≤" + weight;
                  }
                  if (
                    d.maxWeightLte === undefined &&
                    d.maxWeightGte === undefined
                  ) {
                    weight = "";
                  }
                  return `${profit}<br>${rate}<br>${cost}<br>${weight}`;
                },
              },
              {
                field: "enableAutoAddItem",
                title: "自动添加商品",
                templet: "#shopee_marketCenter_isAutoAdd",
              },
              {
                field: "fortyFiveDaysSalesCount",
                title: "销量",
                templet: "<div>45天: {{d.fortyFiveDaysSalesCount || 0}}</div>",
              },
              // { field: "creator", title: "创建人" },
              // {
              //   field: "discountInfo",
              //   title: "优惠情况",
              //   width: 100,
              //   templet: "#shopee_marketCentre_bundleDealInfo",
              // },
              {
                field: "count",
                title: "listing数量",
                width: 80,
                templet: "#shopee_marketCentre_bundleDealCount",
              },
              {
                field: "creator",
                title: "操作人",
                width: 100,
                templet:
                  "<div>创建:{{d.creator || ''}} <br> 修改:{{d.modifier ||''}}</div>",
              },
              {
                field: "createTime",
                title: "操作时间",
                width: 170,
                templet:
                  "<div>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss') || ''}} <br> 修改:{{Format(d.modifyTime,'yyyy-MM-dd hh:mm:ss') ||''}}</div>",
              },
              {
                title: "操作",
                align: "center",
                style: "vertical-align: top;",
                toolbar: "#shopee_marketCenter_toolbar",
                width: 100,
              },
            ],
          ];
        },
        // 搜索table 的 加购列
        addOnCols: function () {
          return [
            [
              { type: "checkbox" },
              { field: "addOnDealName", title: "优惠名称", width: 150 },
              {
                field: "storeAcct",
                title: "店铺",
                templet: (d) => {
                  let tagDoms = "";
                  if (d.storeTagList && d.storeTagList.length) {
                    tagDoms = d.storeTagList
                      .map(
                        (item) =>
                          `<span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">${item}</span>`
                      )
                      .join("");
                  }
                  return `<div>${d.storeAcct}${tagDoms}</div>`;
                },
              },
              { field: "salesperson", title: "销售员", width: 150 },
              {
                field: "startTime",
                title: "开始时间",
                templet:
                  "<div>{{Format(d.startTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                width: 150,
              },
              {
                field: "endTime",
                title: "结束时间",
                templet:
                  "<div>{{Format(d.endTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                width: 150,
              },
              { field: "promotionType", title: "优惠类型", width: 150 },
              { field: "discountInfo", title: "优惠情况", width: 150 },
              { field: "mainCount", title: "主商品数量", width: 150 },
              { field: "subCount", title: "副商品数量", width: 150 },
              { field: "limitpurch", title: "限购", width: 150 },
              {
                field: "creator",
                title: "操作人",
                width: 100,
                templet:
                  "<div>创建:{{d.creator || ''}} <br> 修改:{{d.modifier ||''}}</div>",
              },
              {
                field: "createTime",
                title: "操作时间",
                width: 170,
                templet:
                  "<div>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss') || ''}} <br> 修改:{{Format(d.updateTime,'yyyy-MM-dd hh:mm:ss') ||''}}</div>",
              },
              {
                title: "操作",
                align: "center",
                style: "vertical-align: top;",
                toolbar: "#shopee_marketCenter_toolbar",
                width: 100,
              },
            ],
          ];
        },
        // 搜索table 的 关注有礼 列
        followPrizeCols: function () {
          return [
            [
              { type: "checkbox" },
              { field: "campaignId", title: "优惠Id", width: 100 },
              { field: "followPrizeName", title: "优惠名称", width: 200 },
              {
                field: "autoRenew",
                title: "活动类型",
                templet: "#shopee_marketCenter_autoRenenw_row",
              },
              {
                field: "storeAcct",
                title: "店铺",
                templet: (d) => {
                  let tagDoms = "";
                  if (d.storeTagList && d.storeTagList.length) {
                    tagDoms = d.storeTagList
                      .map(
                        (item) =>
                          `<span class="hp-badge layui-bg-blue" style="width:auto;padding:0 5px!important;">${item}</span>`
                      )
                      .join("");
                  }
                  return `<div>${d.storeAcct}${tagDoms}</div>`;
                },
              },
              // { field: "creator", title: "创建人" },
              { field: "salesperson", title: "销售员" },
              {
                field: "startTime",
                title: "开始时间",
                templet:
                  "<div>{{Format(d.startTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                width: 150,
              },
              {
                field: "endTime",
                title: "结束时间",
                templet:
                  "<div>{{Format(d.endTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
                width: 150,
              },
              {
                field: "rewardType",
                title: "优惠类型",
                templet: "#shopee_marketCenter_voucherType_follow",
              },
              {
                field: "discountInfo",
                title: "优惠情况",
                width: 150,
                templet: "#shopee_marketCenter_followInfo",
              },
              {
                field: "quantity",
                title: "数量/已领取",
                width: 100,
                templet: "<div>{{d.usageQuantity}} / {{d.currentUsage}}</div>",
              },
              {
                field: "creator",
                title: "操作人",
                width: 100,
                templet:
                  "<div>创建:{{d.creator || ''}} <br> 修改:{{d.modifier ||''}}</div>",
              },
              {
                field: "createTime",
                title: "操作时间",
                width: 170,
                templet:
                  "<div>创建:{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss') || ''}} <br> 修改:{{Format(d.updateTime,'yyyy-MM-dd hh:mm:ss') ||''}}</div>",
              },
              {
                title: "操作",
                align: "center",
                style: "vertical-align: top;",
                toolbar: "#shopee_marketCenter_toolbar",
                width: 100,
              },
            ],
          ];
        },
        // 修改活动类型
        changeActyStatus: function () {
          var _this = this;
          form.on("switch(shopee_marketCenter_changeStatus)", function (data) {
            let curVal = data.elem.checked;
            let autoRenew = !!curVal ? 1 : 0;
            // 获取当前行的id
            let id = $(data.elem).data("id");
            var _index = "";
            table.cache.shopee_marketCenter_table.some((elem, index) => {
              elem.id == id && (_index = index);
              return elem.id == id;
            });
            let idParam = _this.someApiList("syncField");
            let idParamVal =
              table.cache.shopee_marketCenter_table[_index][idParam];
            // 调接口,成功后修改table.cache里的缓存
            _this
              .changeActyStatusAjax({ [idParam]: idParamVal, autoRenew })
              .then(() => {
                layer.msg("设置成功", { icon: 1 });
                table.cache.shopee_marketCenter_table[_index].autoRenew =
                  curVal;
              });
          });
        },
        // 搜索table
        tableRender: function () {
          var _this = this;

          table.render({
            elem: "#shopee_marketCenter_table",
            where: _this.voucherListSearchData(),
            method: "post",
            url: _this.someApiList("searchUrl"),
            page: true, //开启分页
            cols: _this.someApiList("mainCol"),
            contentType: "application/json",
            id: "shopee_marketCenter_table",
            limits: [20, 50, 100, 1000],
            limit: 20,
            done: function (res, curr, count) {
              theadHandle().fixTh({ id: "#shopee_marketCenter_card" });
              _this.tabCount(count);
              _this.changeActyStatus();
            },
          });
        },
        // 搜索table总数
        tabCount: function (count) {
          switch (this.currentTab) {
            case "upcoming":
              $("#shopee_marketCenter_upcoming_num_span").html(count);
              break;
            case "ongoing":
              $("#shopee_marketCenter_ongoing_num_span").html(count);
              break;
            case "expired":
              $("#shopee_marketCenter_expired_num_span").html(count);
              break;
            case "draft":
              $("#shopee_marketCenter_draft_num_span").html(count);
            default:
              break;
          }
        },
        // 监听搜索table的工具栏
        tableToolsMonitor: function () {
          var _this = this;
          table.on("tool(shopee_marketCenter_table)", function (obj) {
            let type = $("#shopee_marketCenter")
              .find("select[name=marketCenterType]")
              .val();
            switch (obj.event) {
              case "edit":
                _this.voucherActivity(type, obj.data, true, false);
                break;
              case "duplicate":
                _this.voucherActivity(type, obj.data, true, true);
                break;
              case "end":
                _this.voucherEnd(obj.data);
                break;
              case "delete":
                let _obj = {};
                _obj[_this.someApiList("idsField")] = [].concat(
                  Number(obj.data[_this.someApiList("delField")])
                );
                _this.voucherDelete(_obj);
                break;
              default:
                break;
            }
          });
        },
        // 批量终止
        batchEnd: function () {
          var _this = this;
          let paramName = _this.someApiList("batchEndField");
          let idFiled = _this.someApiList("syncField");
          var checkStatus = table.checkStatus("shopee_marketCenter_table"); //idTest 即为基础参数 id 对应的值
          if (!checkStatus.data.length) {
            return layer.msg("请选择要终止的数据", { icon: 0 });
          }
          let obj = {
            [paramName]: checkStatus.data
              .map((item) => item[idFiled])
              .join(","),
          };
          commonReturnPromise({
            url: _this.someApiList("batchEndUrl"),
            type: "post",
            params: obj,
          }).then((res) => {
            layer.msg(res, { icon: 1 });
            $("#shopee_marketCenter_search").click();
          });
        },
        // 导出当前页数据
        exportCurList: function () {
          var _this = this;
          $("#shopee_marketCenter_exportList").click(function (data) {
            transBlob({
              url: _this.someApiList("exportCurListUrl"),
              fileName: _this.someApiList("exportCurListName"),
              contentType: "application/json;charset=UTF-8",
              formData: JSON.stringify(_this.voucherListSearchData()),
            })
              .then(function (result) {
                // layer.msg(result, { icon: 1 })
              })
              .catch(function (err) {
                layer.msg(err, { icon: 2 });
              });
          });
        },
        //打开 操作日志 弹窗
        viewReportLog: function () {
          var _this = this;
          $("#shopee_marketCenter_importVoucherOperateLog").click(function (
            data
          ) {
            layer.open({
              title: "操作日志",
              type: 1,
              id: "shopee_marketCenter_report_logId",
              area: ["800px", "800px"],
              content: $("#shopee_marketCenter_report_log").html(),
              success: function (layero) {
                // 阻止弹窗整体内容滑动,让table的内容滑动
                $(layero)
                  .find(".layui-layer-content")
                  .css("overflow", "hidden");
                _this.viewReportTableRefresh(layero);
                _this.viewReportTable(layero);
                // 刷新按钮范围居中
                $(layero)
                  .find(".layui-layer-content")
                  .find("#shopee_marketCenter_report_log_refresh")
                  .find("i")
                  .css("right", "static");
              },
            });
          });
        },
        // 操作日志 弹窗 优惠券列
        logCols: function () {
          let type = $("#shopee_marketCenter")
            .find("select[name=marketCenterType]")
            .val();
          const cols = [
            { field: "type", title: "优惠券类型", type: 2 },
            { field: "voucherType", title: "优惠类型", type: 2 },
            { field: "bundleDealRuleType", title: "捆绑销售类型", type: 3 },
            { field: "addOnType", title: "加购类型", type: 4 },
            { field: "followPrizeType", title: "关注有礼类型", type: 5 },
          ];

          let _col = cols
            .filter((item) => item.type == type)
            .map((item) => ({
              title: item.title,
              field: item.field,
            }));

          return [
            [
              {
                title: "导入时间",
                field: "createDate",
                templet:
                  '<div>{{Format(d.createDate,"yyyy-MM-dd hh:mm:ss")}}</div>',
              },
              ..._col,
              // {
              //   title: _col.title,
              //   field: _col.field,
              // },
              {
                title: "操作结果",
                field: "total",
                templet: "#shopee_marketCenter_viewReport_result",
              },
              {
                title: "操作人",
                field: "creator",
              },
              {
                title: "结果文件",
                field: "filePath",
                toolbar: "#shopee_marketCenter_viewReport_filePath",
              },
            ],
          ];
        },
        // 操作日志 弹窗 table
        viewReportTable: function (layero) {
          var _this = this;
          table.render({
            elem: "#shopee_marketCenter_report_log_table",
            url: _this.someApiList("reportLogUrl"),
            cols: _this.logCols(),
            id: "shopee_marketCenter_report_log_tableId",
            limit: 20,
            page: true,
            limits: [20, 50, 100],
            done: function (res, curr, count) {
              $(layero).find(".layui-card-header").find(".total").html(count);
              _this.logTableToolsMonitor();
            },
          });
        },
        // 监听 操作日志 弹窗 table 工具栏
        logTableToolsMonitor: function () {
          var _this = this;
          table.on(
            "tool(shopee_marketCenter_report_log_table)",
            function (obj) {
              switch (obj.event) {
                case "downloadDetail":
                  _this.viewReportDownloadFile(obj.data);
                  break;
                default:
                  break;
              }
            }
          );
        },
        // 监听 操作日志 弹窗 刷新
        viewReportTableRefresh: function (layero) {
          var _this = this;
          $("#shopee_marketCenter_report_log_refresh").click(function (data) {
            _this.viewReportTable(layero);
          });
        },
        // 操作日志 弹窗 table 工具栏 之下载文件
        viewReportDownloadFile: function (data) {
          var _this = this;
          let filePath = data.filePath;
          let oldFileName = data.oldFileName;
          transBlob(
            {
              url: _this.someApiList(
                "downloadLogUrl",
                `filePath=${filePath}&oldFileName=${oldFileName}`
              ),
              fileName: oldFileName,
            },
            "get"
          )
            .then(function () {
              layer.msg("下载开始", { icon: 1 });
            })
            .catch(function (err) {
              layer.msg(err, { icon: 2 });
            });
        },
        // 导入
        voucherImport: function () {
          let _url = this.someApiList("importUrl");
          upload.render({
            elem: "#shopee_marketCenter_upload", //绑定元素
            url: _url, //上传接口
            accept: "file",
            field: "multipartFile",
            before: function () {
              loading.show();
            },
            done: function (res) {
              loading.hide();
              if (res.code == "0000") {
                layer.msg("操作成功!操作结果详见操作日志", { icon: 1 });
              } else {
                layer.msg(res.msg, { icon: 2 });
              }
              //上传完毕回调
              $("#shopee_marketCenter_search").click();
            },
            error: function (res) {
              loading.hide();
              layer.msg("上传失败", { icon: 2 });
              //请求异常回调
            },
          });
        },
        // 下载模板弹窗
        voucherDownload: function () {
          var _this = this;
          $("#shopee_marketCenter_download_type").click(function (data) {
            layer.open({
              type: 1,
              title: "选择下载类型",
              area: ["500px", "300px"],
              id: "shopee_marketCenter_download_modalId",
              content: "",
              success: function (layero) {
                laytpl($("#shopee_marketCenter_download_modal").html()).render(
                  $(data.target).attr("data-type"),
                  function (html) {
                    layero.find(".layui-layer-content").html(html);
                  }
                );
                form.render();
                _this.downLoadTpl();
              },
            });
          });
        },
        // 下载模板
        downLoadTpl: function () {
          var _this = this;
          let type = $("#shopee_marketCenter")
            .find("select[name=marketCenterType]")
            .val();
          $("#shopee_marketCenter_download_tpl").click(function () {
            let downloadType = $("#shopee_marketCenter_download")
              .find("input[name=downloadType]:checked")
              .val();
            if (!downloadType) return layer.msg("请选择下载类型", { icon: 0 });
            if (type == 2) {
              let voucherType = $("#shopee_marketCenter_download")
                .find("input[name=voucherType]:checked")
                .val();
              if (!voucherType) {
                return layer.msg("请选择优惠券类型", { icon: 0 });
              }
              // 1店铺折扣, 2店铺百分比折扣, 3 店铺百分比返还金币, 4商品折扣, 5商品百分比折扣, 6商品百分比返还金币, 
              if (voucherType == 2) {
                downloadType = Number(downloadType) + 3;
              }
              transBlob(
                {
                  url: _this.someApiList(
                    "downloadTplUrl",
                    `downloadType=${downloadType}`
                  ),
                  fileName: _this.someApiList("downloadTplFileName"),
                  contentType: "application/x-www-form-urlencoded",
                },
                "post"
              )
                .then(function (result) {
                  layer.msg(result, { icon: 1 });
                })
                .catch(function (err) {
                  layer.msg(err, { icon: 2 });
                });
            } else if (type != 3) {
              transBlob(
                {
                  url: _this.someApiList(
                    "downloadTplUrl",
                    `downloadType=${downloadType}`
                  ),
                  fileName: _this.someApiList("downloadTplFileName"),
                  contentType: "application/x-www-form-urlencoded",
                },
                "post"
              )
                .then(function (result) {
                  layer.msg(result, { icon: 1 });
                })
                .catch(function (err) {
                  layer.msg(err, { icon: 2 });
                });
            } else {
              if (downloadType == 1) {
                window.location.href =
                  ctx +
                  "/static/templet/shopee_bundle_deal_%E5%A5%97%E8%A3%85%E7%89%B9%E4%BB%B7.xlsx";
              } else if (downloadType == 2) {
                window.location.href =
                  ctx +
                  "/static/templet/shopee_bundle_deal_%E6%8A%98%E6%89%A3%E7%99%BE%E5%88%86%E6%AF%94.xlsx";
              } else if (downloadType == 3) {
                window.location.href =
                  ctx +
                  "/static/templet/shopee_bundle_deal_%E6%8A%98%E6%89%A3%E9%87%91%E9%A2%9D.xlsx";
              }
            }
          });
        },
        // 重建捆绑销售 结束状态不能重建
        resetActivity: function (type) {
          const _this = this;
          const { data } = table.checkStatus("shopee_marketCenter_table");
          if (!data.length) return layer.msg("请选择数据", { icon: 7 });
          if (_this.currentTab != "expired") {
            const bundleDealIds = data.map((item) => Number(item.bundleDealId));
            _this.resetActivityModel(type, bundleDealIds);
          } else {
            return layer.msg("结束状态不重建", { icon: 7 });
          }
        },
        // 重建捆绑销售弹窗
        resetActivityModel: function (type, bundleDealIds) {
          const obj = { type, isReset: true, isAdd: true };
          const _this = this;
          layer.open({
            type: 1,
            title: "重建捆绑销售",
            content: "加载中",
            id: Date.now(),
            area: ["600px", "600px"],
            btn: ["保存", "清空", "关闭"],
            success: function (layero, index) {
              laytpl($("#shopee_marketCenter_newActivty").html()).render(
                { currentTab: _this.currentTab, ...obj },
                function (html) {
                  $(layero).find(".layui-layer-content").html(html);
                }
              );
              // 店铺
              commonRenderSelect(
                "shopee_marketCenter_newActivty_storeAcct",
                _this.allStore,
                { name: "storeAcct", code: "id" }
              ).then(() => form.render());

              // 根据type 渲染不同数据
              let _renderType = _this.someApiList("linkName");
              let _discountType = $("#shopee_marketCenter_newActivty_form")
                .find(`input[name=${_renderType}]:checked`)
                .val();
              laytpl(
                $(`#shopee_marketCenter_${_renderType}_rest`).html()
              ).render(
                {
                  ...obj,
                  chooseType: _discountType,
                  currentTab: _this.currentTab,
                },
                function (html) {
                  $(`#shopee_marketCenter_linkage_${_renderType}_rest`).html(
                    html
                  );
                }
              );

              //开始时间默认为现在加15分钟
              const startTimeStamp = new Date().getTime() + 15 * 1000 * 60;
              const startTime = laydate.render({
                elem: "#shopee_marketCenter_newActivty_startTime",
                type: "datetime", //可选择：年月日时分秒
                min: -0, //最小日期为当前日期的前一天
                value: Format(startTimeStamp, "yyyy-MM-dd hh:mm:ss"),
                done: function (value, date, endDate) {
                  endTime.config.min = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds,
                  }; //开始日选好后，重置结束日的最小日期
                },
              });

              //   结束时间默认为开始时间加89天
              const endTimeStamp = startTimeStamp + 89 * 24 * 60 * 1000 * 60;
              const endTime = laydate.render({
                elem: "#shopee_marketCenter_newActivty_endTime",
                type: "datetime", //可选择：年月日时分秒
                trigger: "click", //采用click弹出
                value: Format(endTimeStamp, "yyyy-MM-dd hh:mm:ss"),
                done: function (value, date, endDate) {
                  startTime.config.max = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours: date.hours,
                    minutes: date.minutes,
                    seconds: date.seconds,
                  }; //结束日选好后，重置开始日的最大日期
                },
              });
              form.render();
              _this.chooseVoucherType(); //监听radio选择
              //捆绑销售 类目
              _this.chooseCate();
              //捆绑销售币种
              _this.handleStore();
              // 商品类目
              _this.initShopeeCateTree();
            },
            yes: function (index, layero) {
              let params = serializeObject(
                $("#shopee_marketCenter_newActivty_form")
              );
              params.bundleDealIds = bundleDealIds;

              // 参数验证及保存
              let _params = _this.saveCommonActivityParams(
                params,
                obj.isAdd,
                obj,
                false,
                obj.type
              );
              delete _params.storeAcctId;
              _params.endTime = new Date(_params.endTime).getTime();
              _params.startTime = new Date(_params.startTime).getTime();
              if (
                Object.prototype.toString.call(_params) === "[object Object]"
              ) {
                _this.resetActivityAjax(_params).then((res) => {
                  let _res = [];
                  if (res) {
                    _res = JSON.parse(res);
                  }
                  if (Array.isArray(_res) && _res.length) {
                    const errId = _res.join(",");
                    layer.open({
                      title: "失败的捆绑销售Id",
                      content: `${errId}`,
                    });
                  } else {
                    layer.msg("操作成功", { icon: 1 });
                    layer.close(index);
                    $("#shopee_marketCenter_search").click();
                  }
                });
              } else {
                layer.msg(_params);
              }
              return false;
            },
            btn2: function (index, layero) {
              $("#shopee_marketCenter_newActivty_form").trigger("reset");
              // _this.shopeeCateTree.checkAllNodes(false);
              return false; //开启该代码可禁止点击该按钮关闭
            },
          });
        },
        // 新增活动
        voucherActivityClick: function () {
          var _this = this;
          $("#shopeeMarketCenter_newActivty").click(function (e) {
            _this.voucherActivity(
              $(e.target).attr("data-type"),
              "",
              false,
              true
            );
          });
        },
        //新增加购  isDefaultValue是否有默认值需要反显；isAdd判断是添加(复制)还是编辑接口
        voucherActivity: function (
          type,
          obj = "",
          isDefaultValue = false,
          isAdd = true
        ) {
          var _this = this;
          if (type == 3) {
            var oldItemIds =
              !!obj.itemRefList && Array.isArray(obj.itemRefList)
                ? obj.itemRefList.map((item) => item.itemId).join()
                : "";
            obj.oldItemIds = isDefaultValue ? oldItemIds : "";
          }
          let _obj = {
            ...obj,
            isReset: false,
            type: type,
          };
          let _title = ShopeeMarketCBasicList.filter(
            (item) => item.discountType == type
          )[0].AddNewActivityName;
          layer.open({
            type: 1,
            title: !isDefaultValue
              ? _title
              : isAdd
              ? "复制" + _title.slice(2, _title.length)
              : "编辑" + _title.slice(2, _title.length),
            content: "加载中",
            id: Date.now(),
            area: [type == 2 ? "1000px" : "700px", "600px"],
            btn: isDefaultValue ? ["保存", "关闭"] : ["保存", "清空", "关闭"],
            success: function (layero, index) {
              laytpl($("#shopee_marketCenter_newActivty").html()).render(
                {
                  ..._obj,
                  isAdd: isAdd,
                  currentTab: _this.currentTab,
                  voucherTypeList: _this.VoucherTypeList,
                },
                function (html) {
                  $(layero).find(".layui-layer-content").html(html);
                }
              );
              // 店铺
              if (isAdd) {
                commonRenderSelect(
                  "shopee_marketCenter_newActivty_storeAcct",
                  _this.allStore,
                  { name: "storeAcct", code: "id" }
                ).then(() => form.render());
              }
              // 根据type 渲染不同数据
              let _renderType = _this.someApiList("linkName");
              let _discountType = $("#shopee_marketCenter_newActivty_form")
                .find(`input[name=${_renderType}]:checked`)
                .val();
              laytpl(
                $(`#shopee_marketCenter_${_renderType}_rest`).html()
              ).render(
                {
                  chooseType: _discountType,
                  ..._obj,
                  isAdd: isAdd,
                  currentTab: _this.currentTab,
                },
                function (html) {
                  $(`#shopee_marketCenter_linkage_${_renderType}_rest`).html(
                    html
                  );
                }
              );
              // 优惠券
              if (_obj.type == 2) {
                commonRenderSelect(
                  "shopee_marketCenter_displayChannel",
                  _this.DisplayChannelList,
                  {
                    name: "displayChannelCn",
                    code: "code",
                    selected: _obj.displayChannelList,
                  }
                ).then(() => {
                  form.render("select");
                });

                if (obj.itemIdList) {
                  $("#shopee_marketCenter_newActivty_form")
                    .find("textarea[name=itemIdList]")
                    .val(obj.itemIdList);
                }

                // cnsc类目
                // _this.renderValCnscCate({ isAdd, ..._obj });
                // 监听优惠券类型值的变化
                if (obj.voucherType == 1) {
                  //店铺优惠券
                  $("#shopee_marketCenter_newActivty_form_left").hide();
                }
                _this.watchVoucherType();
              }
              // 时间
              if (
                (!isAdd && _this.currentTab == "ongoing" && _obj.type == 5) ||
                (!isAdd && _obj.type == 3) ||
                (!isAdd && _this.currentTab == "ongoing" && _obj.type == 2)
              ) {
                $("#shopee_marketCenter_newActivty_startTime").val(
                  Format(obj.startTime, "yyyy-MM-dd hh:mm:ss")
                );
              } else {
                var startTime = laydate.render({
                  elem: "#shopee_marketCenter_newActivty_startTime",
                  type: "datetime", //可选择：年月日时分秒
                  min: -0, //最小日期为当前日期的前一天
                  value: Format(obj.startTime, "yyyy-MM-dd hh:mm:ss"),
                  done: function (value, date, endDate) {
                    endTime.config.min = {
                      year: date.year,
                      month: date.month - 1,
                      date: date.date,
                      hours: date.hours,
                      minutes: date.minutes,
                      seconds: date.seconds,
                    }; //开始日选好后，重置结束日的最小日期
                  },
                });
              }
              if (!isAdd && _obj.type == 3) {
                $("#shopee_marketCenter_newActivty_endTime").val(
                  Format(obj.endTime, "yyyy-MM-dd hh:mm:ss")
                );
              } else {
                var endTime = laydate.render({
                  elem: "#shopee_marketCenter_newActivty_endTime",
                  type: "datetime", //可选择：年月日时分秒
                  trigger: "click", //采用click弹出
                  value: Format(obj.endTime, "yyyy-MM-dd hh:mm:ss"),
                  done: function (value, date, endDate) {
                    startTime.config.max = {
                      year: date.year,
                      month: date.month - 1,
                      date: date.date,
                      hours: date.hours,
                      minutes: date.minutes,
                      seconds: date.seconds,
                    }; //结束日选好后，重置开始日的最大日期
                  },
                });
              }
              // 文本textarea赋值
              if (type == 3 && !isAdd) {
                $(
                  "#shopee_marketCenter_newActivty_form textarea[name=newItemIds]"
                ).val(obj.oldItemIds);
                _this.doubleCheckedCancel(
                  "shopee_marketCenter_isAddItem",
                  true
                );
                //币种
                _this.showCurrency();
              }
              form.render();
              _this.chooseVoucherType(); //监听radio选择
              //捆绑销售 类目
              if (type == 3) {
                _this.chooseCate();
                //捆绑销售币种
                _this.handleStore();
                // 商品类目
                _this.initShopeeCateTree(obj.cateIds || []);
              }
            },
            yes: function (index, layero) {
              let params = serializeObject(
                $("#shopee_marketCenter_newActivty_form")
              );
              if (!isAdd) {
                params.storeAcctId = obj.storeAcctId;
              }

              // 参数验证及保存
              let _params = _this.saveCommonActivityParams(
                params,
                isAdd,
                obj,
                isDefaultValue,
                type
              );

              if (
                Object.prototype.toString.call(_params) === "[object Object]"
              ) {
                //添加 优惠券
                isAdd &&
                  _this.voucherAddActivityAjax(_params, index, type, isAdd);
                // 修改优惠券
                !isAdd &&
                  _this.voucherUpdateActivityAjax(_params, index, type, isAdd);
              } else {
                layer.msg(_params);
              }
              return false;
            },
            btn2: isDefaultValue
              ? ""
              : function (index, layero) {
                  $("#shopee_marketCenter_newActivty_form").trigger("reset");
                  // _this.shopeeCateTree.checkAllNodes(false);
                  // type == 2 && _this.cnscCateCascaderVoucher.setValue([]);
                  return false; //开启该代码可禁止点击该按钮关闭
                },
          });
        },
        // cnscCateCascaderVoucher: null,
        // renderValCnscCate: function (obj) {
        //   // cnsc类目
        //   const _this = this;
        //   commonReturnPromise({
        //     url: "/lms/shopee/shopeeCate/cnscCategoryTree",
        //   })
        //     .then((res) => {
        //       _this.cnscCateCascaderVoucher = layCascader({
        //         elem: "#shopee_marketCenter_newActivty_cnscCate",
        //         clearable: true,
        //         filterable: true,
        //         collapseTags: true,
        //         options: res,
        //         props: {
        //           multiple: true,
        //           label: "label",
        //           value: "value",
        //           children: "children",
        //           checkStrictly: false,
        //         },
        //       });
        //     })
        //     .then(() => {
        //       if (!obj.isAdd && obj.cateIds) {
        //         const cateIds = [];
        //         _this.cnscCateCascaderVoucher.setValue(cateIds);
        //       }
        //     });
        // },
        watchVoucherType: function () {
          form.on(
            "radio(shopee_marketCenter_choose_voucherType)",
            function (data) {
              if (data.value == 2) {
                $("#shopee_marketCenter_newActivty_form_left").show();
              } else {
                $("#shopee_marketCenter_newActivty_form_left").hide();
              }
            }
          );
        },

        // 验证标红
        saveVerifyParams: function (domHtml, domName) {
          $(
            "#shopee_marketCenter_newActivty_form " +
              domHtml +
              "[name=" +
              domName +
              "]"
          )
            .addClass("layui-form-danger")
            .focus();
          setTimeout(function () {
            $(
              "#shopee_marketCenter_newActivty_form " +
                domHtml +
                "[name=" +
                domName +
                "]"
            ).removeClass("layui-form-danger");
          }, 1500);
        },
        // 验证标红 by border
        saveVerifyParamsByBorder: function (className) {
          $("#shopee_marketCenter_newActivty_form")
            .find(`${className}`)
            .css("border", "1px solid red");
          setTimeout(function () {
            $("#shopee_marketCenter_newActivty_form")
              .find(`${className}`)
              .css("border", "");
          }, 1500);
        },
        // 公共保存数据验证
        saveCommonActivityParams: function (
          params,
          isAdd,
          obj,
          isDefaultValue,
          type
        ) {
          var _this = this;
          if (!params.storeAcctId && !obj.isReset) {
            _this.saveVerifyParams("select", "storeAcctId");
            return "请选择店铺";
          }
          params.storeAcctId = Number(params.storeAcctId);
          if (!params.startTime) {
            _this.saveVerifyParams("input", "startTime");
            return "请输入开始时间";
          }
          if (
            isDefaultValue &&
            isAdd &&
            new Date(params.startTime) < new Date()
          ) {
            _this.saveVerifyParams("input", "startTime");
            return "开始时间须大于当前时间";
          }
          if (params.endTime == "") {
            _this.saveVerifyParams("input", "endTime");
            return "请输入结束时间";
          }
          if (new Date(params.endTime) <= new Date(params.startTime)) {
            _this.saveVerifyParams("input", "endTime");
            return "结束时间须大于开始时间";
          }
          if (type == 2) {
            var _params = _this.saveVoucherActivityParams(params, isAdd, obj);
          } else if (type == 3) {
            var _params = _this.saveBoundleActivityParams(params, isAdd, obj);
          } else if (type == 4) {
          } else if (type == 5) {
            var _params = _this.saveFollowPrizeActivityParams(
              params,
              isAdd,
              obj
            );
          }

          delete _params.type;
          return _params;
        },
        // 保存数据验证 优惠券
        saveVoucherActivityParams: function (params, isAdd, obj) {
          if (params.voucherName === "") {
            this.saveVerifyParams("input", "voucherName");
            return "请输入优惠券名称";
          }
          // if (params.voucherCode === "") {
          //   this.saveVerifyParams("input", "voucherCode")
          //   return "请输入折扣码"
          // }
          if (isAdd) {
            if (params.voucherType == undefined) {
              this.saveVerifyParamsByBorder(".shopee_marketCenter_voucherType");
              return "请选择优惠券类型";
            }
            if (params.autoRenew == undefined) {
              this.saveVerifyParamsByBorder(".shopee_marketCenter_autoRenenw");
              return "请选择活动类型";
            }
          } else {
            params.autoRenew = obj.autoRenew;
            params.voucherType = obj.voucherType;
          }
          // 商品优惠券
          if (params.voucherType == 2) {
            if (params.itemIdList == "") {
              this.saveVerifyParams("textarea", "itemIdList");
              return "请输入item_id";
            } else {
              params.itemIdList = params.itemIdList.split(",");
            }
            // 类目树
            // let cateIds = JSON.parse(
            //   $("#shopee_marketCenter_newActivty_cnscCate").val() || "[]"
            // );
            // params.cateIds = cateIds;
          } else {
            // 删除多余属性
            delete params.itemIdList;
            // delete params.cateIds;
          }
          // 转数字
          if (!isAdd) {
            params.voucherId = Number(obj.voucherId);
          }
          // 展示类型
          if (params.displayChannel === "") {
            this.saveVerifyParams("select", "displayChannel");
            return "请选择展示类型";
          }
          // 编辑需传状态
          !isAdd && (params.voucherStatus = obj.voucherStatus);
          !isAdd && (params.displayChannel = obj.displayChannelList);
          params.rewardType = Number(params.rewardType || obj.rewardType);

          if (isAdd && !params.rewardType) {
            this.saveVerifyParamsByBorder(".shopee_marketCenter_radioType");
            return "请选择优惠类型";
          }
          if (params.usageQuantity === "") {
            this.saveVerifyParams("input", "usageQuantity");
            return "请输入优惠券数量";
          }
          if (params.minBasketPrice === "") {
            this.saveVerifyParams("input", "minBasketPrice");
            return "请输入最低消费金额";
          }
          if (params.minBasketPrice < 0) {
            this.saveVerifyParams("input", "minBasketPrice");
            return "优惠券使用最小金额为0";
          }
          params.usageQuantity = Number(params.usageQuantity);
          params.minBasketPrice = Number(params.minBasketPrice);
          if (params.rewardType != 1) {
            if (params.percentage === "") {
              this.saveVerifyParams("input", "percentage");
              return "请输入优惠百分比";
            }
            params.percentage = Number(params.percentage);
            if (params.maxPrice !== "") {
              params.maxPrice = Number(params.maxPrice);
            }
          } else {
            if (params.discountAmount === "") {
              this.saveVerifyParams("input", "discountAmount");
              return "请输入优惠金额";
            }
            params.discountAmount = Number(params.discountAmount);
          }
          // item_id

          return params;
        },
        // 保存数据验证 捆绑销售
        saveBoundleActivityParams: function (params, isAdd, obj) {
          if (params.bundleDealName === "") {
            this.saveVerifyParams("input", "bundleDealName");
            return "请输入名称";
          }
          if (isAdd) {
            if (params.autoRenew == undefined) {
              this.saveVerifyParamsByBorder(".shopee_marketCenter_autoRenenw");
              return "请选择活动类型";
            }
          } else {
            params.autoRenew = obj.autoRenew;
          }
          // 转数字
          if (!isAdd && !obj.isReset) {
            params.bundleDealId = Number(obj.bundleDealId);
          }
          params.ruleType = Number(params.ruleType || obj.ruleType);
          if (isAdd && !params.ruleType) {
            this.saveVerifyParamsByBorder(".shopee_marketCenter_radioType");
            return "请选择优惠类型";
          }
          if (params.minAmount == "") {
            this.saveVerifyParams("input", "minAmount");
            return "第一层级必填";
          }
          params.minAmount = Number(params.minAmount);
          params.purchaseLimit = Number(params.purchaseLimit);
          if (params.ruleType == 1) {
            if (params.fixPrice === "") {
              this.saveVerifyParams("input", "fixPrice");
              return "第一层级必填";
            }
            if (
              (params.minAmountTierTwo !== "" &&
                params.fixPriceTierTwo === "") ||
              (params.minAmountTierTwo === "" && params.fixPriceTierTwo !== "")
            ) {
              params.minAmountTierTwo === "" &&
                this.saveVerifyParams("input", "minAmountTierTwo");
              params.fixPriceTierTwo === "" &&
                this.saveVerifyParams("input", "fixPriceTierTwo");
              return "请将第二层级填写完整";
            }
            if (
              (params.minAmountTierThree !== "" &&
                params.fixPriceTierThree === "") ||
              (params.minAmountTierThree === "" &&
                params.fixPriceTierThree !== "")
            ) {
              params.fixPriceTierThree === "" &&
                this.saveVerifyParams("input", "fixPriceTierThree");
              params.minAmountTierThree === "" &&
                this.saveVerifyParams("input", "minAmountTierThree");
              return "请将第三层级填写完整";
            }
            params.fixPrice = Number(params.fixPrice);
          } else if (params.ruleType == 2) {
            if (params.discountPercentage === "") {
              this.saveVerifyParams("input", "discountPercentage");
              return "第一层级必填";
            }
            params.discountPercentage = Number(params.discountPercentage);
            if (
              (params.minAmountTierTwo !== "" &&
                params.discountPercentageTierTwo === "") ||
              (params.minAmountTierTwo === "" &&
                params.discountPercentageTierTwo !== "")
            ) {
              params.discountPercentageTierTwo === "" &&
                this.saveVerifyParams("input", "discountPercentageTierTwo");
              params.minAmountTierTwo === "" &&
                this.saveVerifyParams("input", "minAmountTierTwo");
              return "请将第二层级填写完整";
            }
            if (
              (params.minAmountTierThree !== "" &&
                params.discountPercentageTierThree === "") ||
              (params.minAmountTierThree === "" &&
                params.discountPercentageTierThree !== "")
            ) {
              params.discountPercentageTierThree === "" &&
                this.saveVerifyParams("input", "discountPercentageTierThree");
              params.minAmountTierThree === "" &&
                this.saveVerifyParams("input", "minAmountTierThree");
              return "请将第三层级填写完整";
            }
          } else if (params.ruleType == 3) {
            if (params.discountValue === "") {
              this.saveVerifyParams("input", "discountValue");
              return "第一层级必填";
            }
            if (
              (params.minAmountTierTwo !== "" &&
                params.discountValueTierTwo === "") ||
              (params.minAmountTierTwo === "" &&
                params.discountValueTierTwo !== "")
            ) {
              params.discountValueTierTwo === "" &&
                this.saveVerifyParams("input", "discountValueTierTwo");
              params.minAmountTierTwo === "" &&
                this.saveVerifyParams("input", "minAmountTierTwo");
              return "请将第二层级填写完整";
            }
            if (
              (params.minAmountTierThree !== "" &&
                params.discountValueTierThree === "") ||
              (params.minAmountTierThree === "" &&
                params.discountValueTierThree !== "")
            ) {
              params.discountValueTierThree === "" &&
                this.saveVerifyParams("input", "discountValueTierThree");
              params.minAmountTierThree === "" &&
                this.saveVerifyParams("input", "minAmountTierThree");
              return "请将第三层级填写完整";
            }
            params.discountValue = Number(params.discountValue);
          }
          if (params.purchaseLimit == "") {
            this.saveVerifyParams("input", "purchaseLimit");
            return "请输入限购数量";
          }
          // 类目树
          let cateIds = JSON.parse(
            $("#shopee_marketCenter_CateTree").val() || "[]"
          );
          params.isAllCate = params.isAllCate == "true" ? true : false;
          if (params.isAllCate == false) {
            params.cateIds = cateIds;
            if (!params.cateIds.length) return "请选择类目";
          } else {
            params.cateIds = [];
          }

          if (!obj.isReset) {
            if (!isAdd) {
              const _oldCateIds = obj.cateIds ? obj.cateIds.toString() : "";
              params.bundleDealName != obj.bundleDealName ||
              params.purchaseLimit != obj.purchaseLimit ||
              params.newItemIds != obj.oldItemIds ||
              params.cateIds.toString() != _oldCateIds
                ? (params.isUpdate = true)
                : (params.isUpdate = false);
              params.isAddItem = !!params.isAddItem ? true : false;
              params.oldItemIds = obj.oldItemIds
                .split(",")
                .filter((item) => !!item && Number(item)) //去掉空字符串和非数字的
                .map((item) => Number(item)); //转为int
            }
            params.newItemIds = params.newItemIds
              .split(",")
              .filter((item) => !!item && Number(item)) //去掉空字符串和非数字的
              .map((item) => Number(item)); //转为int
          }
          return params;
        },
        // 保存数据验证 关注有礼
        saveFollowPrizeActivityParams: function (params, isAdd, obj) {
          if (params.followPrizeName === "") {
            this.saveVerifyParams("input", "followPrizeName");
            return "请输入活动名称";
          }
          if (isAdd) {
            if (params.autoRenew == undefined) {
              this.saveVerifyParamsByBorder(".shopee_marketCenter_autoRenenw");
              return "请选择活动类型";
            }
          } else {
            params.autoRenew = obj.autoRenew;
          }
          // 转数字
          if (!isAdd) {
            params.campaignId = Number(obj.campaignId);
          }
          let _startTime = new Date(params.startTime).getTime();
          let _endTime = new Date(params.endTime).getTime();
          if (_endTime - _startTime <= 86400000) {
            this.saveVerifyParams("input", "endTime");
            return "结束时间至少大于开始时间一天";
          }
          params.rewardType = Number(params.rewardType || obj.rewardType);
          if (isAdd && !params.rewardType) {
            this.saveVerifyParamsByBorder(".shopee_marketCenter_radioType");
            return "请选择优惠类型";
          }
          if (params.usageQuantity === "") {
            this.saveVerifyParams("input", "usageQuantity");
            return "请输入数量";
          }
          if (params.minSpend === "") {
            this.saveVerifyParams("input", "minSpend");
            return "请输入最低消费金额";
          }
          if (params.minSpend < 0) {
            this.saveVerifyParams("input", "minSpend");
            return "优惠券使用最小金额为0";
          }
          params.usageQuantity = Number(params.usageQuantity);
          params.minSpend = Number(params.minSpend);
          if (params.rewardType != 1) {
            if (params.percentage === "") {
              this.saveVerifyParams("input", "percentage");
              return "请输入优惠百分比";
            }
            params.percentage = Number(params.percentage);
            if (params.maxPrice !== "") {
              params.maxPrice = Number(params.maxPrice);
            }
          } else {
            if (params.discountAmount === "") {
              this.saveVerifyParams("input", "discountAmount");
              return "请输入优惠金额";
            }
            params.discountAmount = Number(params.discountAmount);
          }
          return params;
        },
        //监听类目是全选还是指定分类
        chooseCate: function () {
          form.on("radio(shopee_marketCenter_cateId)", function (data) {
            $("#shopee_marketCenter_CateTree_div").css(
              "display",
              data.value === "true" ? "none" : "block"
            );
          });
        },

        //
        handleStore: function () {
          const _this = this;
          form.on("select(shopee_marketCenter_active_store)", function () {
            _this.showCurrency();
          });
        },
        //  币种
        showCurrency: function () {
          const formDom = $("#shopee_marketCenter_newActivty_form");
          // 折扣金额和套装定价
          const ruleType = formDom.find("input[name=ruleType]:checked").val();
          const curStoreAcctId = $(
            "#shopee_marketCenter_newActivty_storeAcct"
          ).val();
          const curSite = this.allStore.filter(
            (item) => item.id == curStoreAcctId
          )[0];
          const curList = this.siteCurrencyList.filter(
            (item) => item.code === curSite.salesSite
          );
          const currency = curList[0] ? curList[0].currency || "" : "";
          $(".localcurrency").text(currency);
          if (["1", "3"].includes(ruleType)) {
            $("#shopee_marketCenter_linkage_ruleType_rest")
              .find(".layui-input-block")
              .each(function () {
                $(this).find("span:last").text(currency);
              });
          }
        },

        //初始化shopee商品类目
        initShopeeCateAjax: function () {
          return commonReturnPromise({
            url: "/lms/shopee/shopeeCate/cnscCategoryTree",
          });
        },
        cnscCateCascader: null,
        cnscCateCascaderList: [],
        initShopeeCateTree: function (cateIds = []) {
          let _this = this;
          const _isAllCateVal = $("#shopee_marketCenter_newActivty_form")
            .find("input[name=isAllCate]:checked")
            .val();
          const _isAllCate = $("#shopee_marketCenter_newActivty_form").find(
            'input[name=isAllCate][value="true"]'
          );
          const _isNotAllCate = $("#shopee_marketCenter_newActivty_form").find(
            'input[name=isAllCate][value="false"]'
          );
          commonReturnPromise({
            url: "/lms/shopee/shopeeCate/cnscCategoryTree",
          })
            .then((res) => {
              _this.cnscCateCascaderList = res;
              _this.cnscCateCascader = layCascader({
                elem: "#shopee_marketCenter_CateTree",
                clearable: true,
                filterable: true,
                collapseTags: true,
                options: res,
                props: {
                  multiple: true,
                  label: "label",
                  value: "value",
                  children: "children",
                  checkStrictly: false,
                },
              });
            })
            .then(() => {
              // 指定分类和全部分类触发
              if (_isAllCateVal === "true") {
                _isNotAllCate.prop("checked", false);
                _isAllCate.prop("checked", true);
                $("#shopee_marketCenter_CateTree_div").hide();
              } else {
                _this.cnscCateCascader.setValue(cateIds);
              }
            })
            .catch((err) => {
              layer.msg(err, { icon: 2 });
            });
        },
        // 添加接口
        voucherAddActivityAjax: function (params, index, type, isAdd) {
          var _this = this;
          commonReturnPromise({
            url: _this.someApiList("addActivityUrl"),
            type: "post",
            params: JSON.stringify(params),
            contentType: "application/json",
          })
            .then((data) => {
              if (type == 3) {
                _this.addActivityResult(data, isAdd, index);
              } else {
                layer.msg("添加成功", { icon: 1 });
                layer.close(index);
                $("#shopee_marketCenter_search").click();
              }
            })
            .catch((err) => layer.msg(err || err.msg, { icon: 2 }));
        },
        // 更新接口
        voucherUpdateActivityAjax: function (params, index, type, isAdd) {
          var _this = this;
          commonReturnPromise({
            url: _this.someApiList("updateActivityUrl"),
            type: "put",
            params: JSON.stringify(params),
            contentType: "application/json",
          })
            .then((data) => {
              if (type == 3) {
                _this.editActivityResult(data, isAdd, index);
              } else {
                layer.msg("修改成功", { icon: 1 });
                layer.close(index);
                $("#shopee_marketCenter_search").click();
              }
            })
            .catch((err) => layer.msg(err || err.msg, { icon: 2 }));
        },
        // 捆绑销售  添加活动是否成功
        addActivityResult: function (obj, isAdd, index) {
          if (typeof obj == "string") {
            layer.msg("添加成功", { icon: 1 });
            layer.close(index);
            $("#shopee_marketCenter_search").click();
          } else {
            let result = obj.resultType == 1 ? "成功" : "失败";
            layer.open({
              title: `捆绑销售活动添加${result}`,
              id: "shopee_marketCenter_add_activity_resultId",
              area: ["600px", "600px"],
              content: "",
              success: function (layero) {
                laytpl(
                  $("#shopee_marketCenter_add_activity_result").html()
                ).render(obj, function (html) {
                  $(layero).find(".layui-layer-content").html(html);
                });

                if (obj.result_type == 1 && obj.failed_list.length) {
                  table.render({
                    elem: "#shopee_marketCenter_add_activity_result_addTable",
                    id: "shopee_marketCenter_add_activity_result_addTable_id",
                    data: obj.failed_list,
                    limit: 999,
                    cols: [
                      [
                        { field: "itemId", title: "itemId" },
                        { field: "failError", title: "failError" },
                        { field: "failMessage", title: "failMessage" },
                      ],
                    ],
                  });
                }
              },
              yes: function (_index, layero) {
                layer.close(_index);
                //按钮【按钮一】的回调
                $("#shopee_marketCenter_search").click();
              },
              cancel: function () {
                $("#shopee_marketCenter_search").click();
              },
            });
          }
        },
        // 捆绑销售  修改活动是失败与否
        editActivityResult: function (obj, isAdd, index) {
          var isOpenModal =
            obj.update_bundle_deal &&
            obj.update_bundle_deal_item &&
            Object.keys(obj.update_bundle_deal_item).length;
          if (isOpenModal) {
            let result =
              obj.update_bundle_deal.resultType == 1 ? "成功" : "失败";
            layer.open({
              title: `捆绑销售活动修改${result}`,
              id: "shopee_marketCenter_edit_activity_resultId",
              area: ["600px", "600px"],
              content: "",
              success: function (layero) {
                laytpl(
                  $("#shopee_marketCenter_edit_activity_result").html()
                ).render(obj, function (html) {
                  $(layero).find(".layui-layer-content").html(html);
                });
                if (
                  !!obj.update_bundle_deal_item &&
                  !!obj.update_bundle_deal_item.add_bundle_deal_item &&
                  !!obj.update_bundle_deal_item.add_bundle_deal_item
                    .failed_list &&
                  obj.update_bundle_deal_item.add_bundle_deal_item.failed_list
                    .length
                ) {
                  table.render({
                    elem: "#shopee_marketCenter_edit_activity_result_addTable",
                    id: "shopee_marketCenter_edit_activity_result_addTable_id",
                    data: obj.update_bundle_deal_item.add_bundle_deal_item
                      .failed_list,
                    limit: 999,
                    cols: [
                      [
                        { field: "itemId", title: "itemId" },
                        { field: "failError", title: "failError" },
                        { field: "failMessage", title: "failMessage" },
                      ],
                    ],
                  });
                }
                if (
                  !!obj.update_bundle_deal_item &&
                  !!obj.update_bundle_deal_item.del_bundle_deal_item &&
                  !!obj.update_bundle_deal_item.del_bundle_deal_item
                    .failed_list &&
                  obj.update_bundle_deal_item.del_bundle_deal_item.failed_list
                    .length
                ) {
                  table.render({
                    elem: "#shopee_marketCenter_edit_activity_result_delTable",
                    id: "shopee_marketCenter_edit_activity_result_delTable_id",
                    data: obj.update_bundle_deal_item.del_bundle_deal_item
                      .failed_list,
                    limit: 999,
                    cols: [
                      [
                        { field: "itemId", title: "itemId" },
                        { field: "failError", title: "failError" },
                        { field: "failMessage", title: "failMessage" },
                      ],
                    ],
                  });
                }
              },
              yes: function (_index, layero) {
                //按钮【按钮一】的回调
                layer.close(_index);
                $("#shopee_marketCenter_search").click();
              },
              cancel: function () {
                $("#shopee_marketCenter_search").click();
              },
            });
          } else if (
            obj.update_bundle_deal &&
            obj.update_bundle_deal.resultType == 2
          ) {
            layer.msg(obj.update_bundle_deal.errMsg, { icon: 2 });
          } else {
            layer.msg("操作成功", { icon: 1 });
            layer.close(index);
            $("#shopee_marketCenter_search").click();
          }
        },
        // 活动的店铺接口
        allStoreAjax: function () {
          return commonReturnPromise({
            url: ctx + "/sys/listStoreForRenderHpStoreCommonComponent.html",
            type: "post",
            params: {
              roleNames: "shopee专员",
              platCode: "shopee",
            },
          });
        },
        // 创建人接口(后端这个接口做了配置)
        creatorAjax: function () {
          var _this = this;
          let type = $("#shopee_marketCenter")
            .find("select[name=marketCenterType]")
            .val();
          if (type == 3) {
            return commonReturnPromise({
              url: _this.someApiList("creatorUrl"),
            });
          } else {
            return commonReturnPromise({
              url: _this.someApiList("creatorUrl"),
              params: { discountType: _this.someApiList("name") },
            });
          }
        },
        // 创建人接口(后端这个接口做了配置)
        modifierAjax: function () {
          var _this = this;
          let type = $("#shopee_marketCenter")
            .find("select[name=marketCenterType]")
            .val();
          if (type == 3) {
            return commonReturnPromise({
              url: _this.someApiList("modifierUrl"),
            });
          } else {
            return commonReturnPromise({
              url: _this.someApiList("modifierUrl"),
              params: { discountType: _this.someApiList("name") },
            });
          }
        },
        // 店铺同步接口
        syncStoreAjax: function (storeAcctIdList) {
          return commonReturnPromise({
            url: this.someApiList("syncStoreUrl"),
            isLoading: false,
            type: 'post',
            contentType: 'application/json',
            params: JSON.stringify(storeAcctIdList)
          });
        },
        // 监听活动的radio选择
        chooseVoucherType: function () {
          let _this = this;
          form.on(
            "radio(shopee_marketCenter_newActivty_discountType)",
            function (data) {
              laytpl($(_this.someApiList("rest")).html()).render(
                { chooseType: data.value, isAdd: true },
                function (html) {
                  $(_this.someApiList("linkageRest")).html(html);
                  // 捆绑销售币种
                  if (_this.curDiscountType === "3") {
                    _this.showCurrency();
                  }
                }
              );
            }
          );
        },
        // 捆绑销售 适用分类
        chooseisAllCate: function () {
          form.on(
            "select(shopeeMarketCenter_bundleDeal_isAllCate)",
            function (data) {
              const curDom = $("#shopee_marketCenter").find(
                "input[name=cateIds]"
              );
              if (data.value === "true") {
                curDom.attr("disabled", true);
                curDom.val("");
                curDom.addClass("layui-disabled");
              } else {
                curDom.attr("disabled", false);
                curDom.removeClass("layui-disabled");
              }
            }
          );
        },
        // 终止接口
        voucherEnd: function (obj) {
          let _this = this;
          commonReturnPromise({
            url: _this.someApiList("endActivityUrl", obj),
            type: "delete",
          })
            .then(() => {
              layer.msg("终止成功", { icon: 1 });
              $("#shopee_marketCenter_search").click();
            })
            .catch((err) => layer.msg(err || err.msg, { icon: 2 }));
        },
        // 删除接口
        voucherDelete: function (obj) {
          let _this = this;
          commonReturnPromise({
            url: _this.someApiList("delActivityUrl"),
            type: "delete",
            params: JSON.stringify(obj),
            contentType: "application/json",
          })
            .then((data) => {
              layer.open({
                title: "删除结果",
                id: "shopee_marketCenter_del_activity_resultId",
                area: ["600px", "600px"],
                content: $("#shopee_marketCenter_del_activity_result").html(),
                success: function (layero) {
                  let succData = data.success_list
                    ? data.success_list.map((item) => ({
                        bundleDealId: item,
                        msg: "删除成功",
                        isSucc: true,
                      }))
                    : [];
                  let failData = data.fail_list
                    ? data.fail_list.map((item) => ({
                        bundleDealId: item.bundleDealId,
                        msg: item.errMsg,
                        isSucc: false,
                      }))
                    : [];
                  let _data = succData.concat(failData);
                  table.render({
                    elem: "#shopee_marketCenter_del_activity_result_Table",
                    id: "shopee_marketCenter_del_activity_result_Table_id",
                    data: _data,
                    limit: 999,
                    cols: [
                      [
                        { field: "bundleDealId", title: "id" },
                        {
                          field: "msg",
                          title: "处理结果",
                          templet:
                            "#shopee_marketCenter_del_activity_result_Table_msg",
                        },
                      ],
                    ],
                  });
                },
              });
              $("#shopee_marketCenter_search").click();
            })
            .catch((err) => layer.msg(err || err.msg, { icon: 2 }));
        },
        // 修改活动类型接口
        changeActyStatusAjax: function (params) {
          return commonReturnPromise({
            url: this.someApiList("autoRenewUrl"),
            params,
          });
        },
        //
        resetActivityAjax: function (obj) {
          return commonReturnPromise({
            url: ctx + "/shopee/bundleDeal/recreateBundleDeal",
            params: JSON.stringify(obj),
            type: "post",
            contentType: "application/json",
          });
        },
        batchOnAdd: function (status) {
          let { data } = table.checkStatus("shopee_marketCenter_table");
          if (!data.length) return layer.msg("请选择要同步的数据");
          let bundleDealIdList = data.map((item) => item.bundleDealId).join();
          commonReturnPromise({
            url: "/lms/shopee/bundleDeal/enableAutoAddItemSetting",
            type: "post",
            params: { bundleDealIdList, enableAutoAddItem: status },
          }).then((res) => {
            layer.msg(res, { icon: 1 });
            $("#shopee_marketCenter_search").click();
          });
        },
        /**
         * radio第一次点击选中两次点击取消
         * @param {string} layFilter lay-filter对应的值
         */
        doubleCheckedCancel: function (layFilter) {
          form.on("radio(" + layFilter + ")", function (data) {
            if ($(data.elem).data("doubleChecked") == true) {
              $(data.elem).prop("checked", false);
              $(data.elem).data("doubleChecked", false);
              $(
                "#shopee_marketCenter_newActivty_form textarea[name=newItemIds]"
              ).attr("readonly", true);
              $(
                "#shopee_marketCenter_newActivty_form textarea[name=newItemIds]"
              ).addClass("layui-disabled");
            } else {
              $(data.elem).prop("checked", true);
              $(data.elem).data("doubleChecked", true);
              $(
                "#shopee_marketCenter_newActivty_form textarea[name=newItemIds]"
              ).attr("readonly", false);
              $(
                "#shopee_marketCenter_newActivty_form textarea[name=newItemIds]"
              ).removeClass("layui-disabled");
            }
            form.render();
          });
        },
        needRefreshFuc: function () {
          // 导出当前数据
          shopeeMarketCenterName.exportCurList();
          // 查看操作日志
          shopeeMarketCenterName.viewReportLog();
          //导入优惠券
          shopeeMarketCenterName.voucherImport();
          // // 下载模板
          shopeeMarketCenterName.voucherDownload();
          // 新增加购
          shopeeMarketCenterName.voucherActivityClick();
          // 修改人创建人
          const personType = $("#shopee_marketCenter")
            .find("select[name=personType]")
            .val();
          shopeeMarketCenterName.getPersonList(personType);
        },
      };
      // 站点
      shopeeMarketCenterName.initSite();
      // 优惠券类型
      shopeeMarketCenterName.initVoucherType();
      // 店铺标签
      shopeeMarketCenterName.initStoreTag();
      shopeeMarketCenterName.initDisplayChannelList();
      shopeeMarketCenterName.initCurrecyList();
      // 渲染搜索的开始时间和结束时间
      shopeeMarketCenterName.startTimeSearch();
      shopeeMarketCenterName.endTimeSearch();
      shopeeMarketCenterName.timeTypeSearch();
      shopeeMarketCenterName.getPersonType();
      // shopeeMarketCenterName.searchLeftBtnLinkage(2);
      // 优惠券搜索
      shopeeMarketCenterName.voucherListSearch();
      // 清空
      shopeeMarketCenterName.voucherListReset();
      // tab监听
      shopeeMarketCenterName.tabMonitor();
      // 店铺同步
      // shopeeMarketCenterName.syncStore();
      // 函数声明
      // shopeeMarketCenterName.needRefreshFuc();
      // 新增活动的店铺list
      shopeeMarketCenterName.allStoreList();

      // 优惠券的选择类型触发事件
      form.on("select(shopee_marketCenter_discount_type)", function (data) {
        // 点击相同的不进行联动，保持原样
        if (shopeeMarketCenterName.curDiscountType != data.value) {
          shopeeMarketCenterName.searchLeftBtnLinkage(data.value);
          // 捆绑销售的专有草稿tab
          if (data.value == 3) {
            $("#shopee_marketCenter_draft_num_span").parent("li").show();
            $("#shopee_marketCenter_draft_num_span").html("");
            shopeeMarketCenterName.chooseisAllCate();
            layui.formSelects.render("shopee_marketCenter_ruleTypeList");
            layui.formSelects.render("shopee_marketCenter_tierTypeList");
          } else {
            $("#shopee_marketCenter_draft_num_span").parent("li").hide();
            // 从捆绑销售的草稿箱跳到其它优惠类型状态默认为未开始
            if (shopeeMarketCenterName.currentTab == "draft") {
              $("#shopee_marketCenter_upcoming_num_span")
                .parent("li")
                .addClass("layui-this");
              shopeeMarketCenterName.currentTab = "upcoming";
            }
            if (data.value == 2) {
              formSelects.data(
                "shopee_marketCenter_search_displayChannel",
                "local",
                {
                  arr: shopeeMarketCenterName.DisplayChannelList.map(
                    (item) => ({
                      name: item.displayChannelCn,
                      value: item.code,
                    })
                  ),
                }
              );
            }
          }
          $("#shopee_marketCenter_upcoming_num_span").html("");
          $("#shopee_marketCenter_ongoing_num_span").html("");
          $("#shopee_marketCenter_expired_num_span").html("");
          $("#shopee_marketCenter_draft_num_span").html("");

          $("#shopee_marketCenter_creator").val("");
          $("#shopee_marketCenter_search").click();
          // 函数声明
          shopeeMarketCenterName.needRefreshFuc();
          shopeeMarketCenterName.curDiscountType = data.value;
        }
      });
      // 监听table的工具栏
      shopeeMarketCenterName.tableToolsMonitor();
      form.on("switch(shopee_marketCenter_isAutoAdd)", function (data) {
        let curVal = data.elem.checked;
        let enableAutoAddItem = !!curVal ? true : false;
        // 获取当前行的id
        let id = $(data.elem).data("id");
        let bundleDealId = $(data.elem).data("bundledealid");
        commonReturnPromise({
          url: "/lms/shopee/bundleDeal/enableAutoAddItemSetting",
          type: "post",
          params: { bundleDealIdList: bundleDealId, enableAutoAddItem },
        })
          .then((res) => {
            layer.msg(res, { icon: 1 });
            table.cache.shopee_marketCenter_table.some((elem, index) => {
              if (elem.id == id) {
                table.cache.shopee_marketCenter_table[index].enableAutoAddItem =
                  enableAutoAddItem;
              }
              return elem.id == id;
            });
          })
          .catch((err) => {
            data.elem.checked = !checked;
            layer.msg(err, { icon: 2 });
            form.render();
          });
      });
      // 批量操作
      form.on("select(shopee_marketCenter_batchOperation)", function (obj) {
        const { value, elem } = obj;
        const discountType = $(elem).data("type");
        switch (value) {
          case "batchEnd":
            shopeeMarketCenterName.batchEnd();
            break;
          case "sync":
            shopeeMarketCenterName.VoucherSync();
            break;
          case "resetBuild":
            shopeeMarketCenterName.resetActivity(discountType);
            break;
          case "onAdd":
            shopeeMarketCenterName.batchOnAdd(true);
            break;
          case "offAdd":
            shopeeMarketCenterName.batchOnAdd(false);
            break;
          case 'syncStore':
            shopeeMarketCenterName.syncStore()
            break;
        }
      });
    }
  );
})(jQuery, layui, window, document);

// 复制
function shopee_marketCenter_sync_copy(obj, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  var txt = $(obj).next("span").text();
  var oInput = document.createElement("input"); //创建一个input元素
  oInput.value = txt;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand("Copy"); // 执行浏览器复制命令
  document.body.removeChild(oInput);
  layer.msg("复制成功");
  return false;
}

function shopeeMarketCenter_handleids(id, event) {
  let _id = id.replace(/，/g, ",").replace(/\s+/g, ""); //中文逗号转为英文逗号，空格全部删掉
  let ids = _id
    .split(",")
    .filter((item) => !!item && Number(item)) //去掉空字符串和非数字的
    .map((item) => Number(item))
    .join(); //转为int
  event.target.value = ids;
}

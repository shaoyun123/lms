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
        laytpl = layui.laytpl;
      $ = layui.$;

      let vm = new Vue({
        el: "#LAY_smtOnline_updateListingInfo_sku",
        data() {
          return {
            exchange_rate: null, // 汇率
            initData: [], //初始化属性数据
            lastSelectedValId: "", //下拉框下拉时,option选中的propertyValueId数据
            syncSSmtSkuDtoList: [], //table数据
            syncSSmtSkuDtoListCols: [], //table col
            basicHeaderCols: [
              {
                prop: "price",
                label: "零售价（USD）",
                width: "200",
                isShow: true,
              },
              {
                prop: "priceCny",
                label: "零售价（CNY）",
                width: "200",
                isShow: true,
              },
              {
                prop: "ipmSkuStock",
                label: "商家仓库存",
                width: "300",
                isShow: true,
              },
              {
                prop: "storeSubSku",
                label: "商品编码",
                width: "200",
                isShow: true,
              },
            ], // 基础属性的tableheader
            allRegionPriceList: [], //调价方式
            regionPriceList: [], //调价方式
            regionPriceType: "", // 调价模板
            isRegionPrice: false, // 是否区域定价
            plaPriceData: [{ deliveryPlace: "", tpl: "", propertyValueId: "" }], //发货地与区域定价模板 table
            // 估算价格
            grossProfitRate: "",
            discountRate: "",
            shippingType: "",
            shippingTypeList: [
              { value: "", label: "子SKU默认定价" },
              { value: "USD5_LESS_GENERAL", label: "<5USD 普货" },
              { value: "SPECIAL", label: "特货" },
              { value: "USD5_GREATER_GENERAL", label: "≥5USD 普货" },
              { value: "GENERAL_OLD", label: "普货（旧版）" },
              { value: "USD5_USD8_GENERAL", label: "5-8美金普货" },
            ],
            allStock: 0, //库存
            dialogVisible: false,
            newSkuStr: "", // 新增的sku
          };
        },
        mounted() {
          let storeAcctIdArr = smt_arr.map((item) => item.storeAcctId);
          commonReturnPromise({
            url: ctx + "/batchOperation/getSkuInfo",
            params: { id: smt_arr[0].id },
          })
            .then((data) => {
              this.fetchData(data); //类目属性处理
            })
            .catch((err) => layer.msg(err, { icon: 2 }));
          this.getRegionPrice(storeAcctIdArr); //定价模板
          // 获取汇率
          commonReturnPromise({
            url: "/lms/prodCommon/getRate",
            type: "post",
            params: { fromCurrency: "USD", toCurrency: "CNY" },
          }).then((res) => {
            this.exchange_rate = res;
          });
        },
        computed: {
          syncSSmtSkuDtoListShowCols() {
            return this.syncSSmtSkuDtoListCols.filter((item) => item.isShow);
          },
        },
        methods: {
          fetchData(objData) {
            // 选中数据  多维转一维
            var _chooseData = objData.syncSSmtSkuDtoList
              .map((item) => (item.aliexpressSkuPropetry || {}).aeopSkuProperty)
              .flat(Infinity);
            if (
              !objData.syncSSmtSkuDtoList ||
              !objData.syncSSmtSkuDtoList[0].aliexpressSkuPropetry
            ) {
              _chooseData = [];
            }
            // 去掉重复选中数据
            let chooseObj = {};
            var chooseData = _chooseData.reduce((cur, next) => {
              if (next.propertyValueId) {
                !!chooseObj[next.propertyValueId]
                  ? ""
                  : (chooseObj[next.propertyValueId] = true && cur.push(next));
              }
              return cur;
            }, []);
            // 如果选中的数据里有属性为发货地 200007763 ，调价table需要有对应发货地值
            var deliveryPlaceList = chooseData.filter(
              (item) => item.skuPropertyId == 200007763
            );
            if (deliveryPlaceList.length) {
              this.plaPriceData = deliveryPlaceList.map((item) => ({
                deliveryPlace: item.propertyValueDefinitionName,
                tpl: "",
                propertyValueId: item.propertyValueId,
              }));
            }

            //数据整合
            var data = objData.cateAttrInfoList.map((item) => {
              var chooseList = chooseData
                .filter((elem) => elem.skuPropertyId == item.id)
                .map((_item) => {
                  return item.customizedName && item.customizedPic
                    ? {
                        ..._item,
                        checked: true,
                        skuImage: _item.skuImage || "",
                      }
                    : { ..._item, checked: true };
                });
              item.customizedName &&
                item.customizedPic &&
                chooseList.push({
                  checked: false,
                  skuImage: "",
                  skuPropertyId: item.id,
                }); //多添加一行
              return { ...item, chooseList };
            });

            this.initData = data.map((item) => {
              if (item.chooseList.length) {
                return {
                  ...item,
                  platCateAttrValueVOList: this.matchData(
                    item.chooseList,
                    item.platCateAttrValueVOList
                  ),
                };
              } else {
                return {
                  ...item,
                  platCateAttrValueVOList: item.platCateAttrValueVOList.map(
                    (elem) => ({
                      ...elem,
                      checked: false,
                      propertyValueDefinitionName: elem.attrValue,
                    })
                  ),
                };
              }
            });

            const chooseAttrListObj = {};
            objData.cateAttrInfoList.forEach((item) => {
              chooseAttrListObj[item.id] = item;
            });
            // 若属性的propertyValueDefinitionName没值的话，自动匹配上默认值
            this.syncSSmtSkuDtoList = objData.syncSSmtSkuDtoList.map((item) => {
              if (
                item.aliexpressSkuPropetry &&
                item.aliexpressSkuPropetry &&
                item.aliexpressSkuPropetry.aeopSkuProperty.length
              ) {
                for (
                  let i = 0;
                  i < item.aliexpressSkuPropetry.aeopSkuProperty.length;
                  i++
                ) {
                  let curPropertyObj =
                    item.aliexpressSkuPropetry.aeopSkuProperty[i];
                  if (!curPropertyObj.propertyValueDefinitionName) {
                    (
                      chooseAttrListObj[curPropertyObj.skuPropertyId]
                        .platCateAttrValueVOList || []
                    ).forEach((elem) => {
                      if (elem.id === curPropertyObj.propertyValueId) {
                        curPropertyObj.propertyValueDefinitionName =
                          elem.attrValue;
                      }
                    });
                  }
                }
              }
              return item;
            });

            this.syncSSmtSkuDtoList = objData.syncSSmtSkuDtoList;
            // 属性table的header
            // 根据返回数据 判断table里面有哪些动态属性
            let hasSkuIdObj = {};
            var skuDtoList =
              (objData.syncSSmtSkuDtoList[0].aliexpressSkuPropetry || {})
                .aeopSkuProperty || [];
            if (skuDtoList.length) {
              skuDtoList.forEach((elem) => {
                hasSkuIdObj[elem.skuPropertyId] = true;
              });
            }
            // 添加所有属性到header中
            let headerCols = objData.cateAttrInfoList.map((item) => ({
              prop: item.attrName,
              label: item.attrName,
              // width: "180",
              id: item.id,
              customizedName: item.customizedName,
              customizedPic: item.customizedPic,
              isShow: hasSkuIdObj[item.id] || false,
            }));
            // 结合
            this.syncSSmtSkuDtoListCols = headerCols.concat(
              this.basicHeaderCols
            );
          },
          // 输入框的checkbox
          inputChkHandle(isChecked, obj, curChkObj) {
            var deliveryPlaces = obj.platCateAttrValueVOList.filter(
              (item) => !!item.checked
            );
            this.tableChangeRow(isChecked, obj, curChkObj, deliveryPlaces);
          },
          // 类目属性的值变化
          inputAttrNameHandle(val, curObj, curSkuObj) {
            //选中后 找到table数据中是否有对应的值,并进行修改
            if (curObj.checked) {
              // 如果没有自定义属性值，就填写平台返回的名称
              var _val =
                val ||
                curSkuObj.platCateAttrValueVOList.filter((item) => {
                  if (item.id == (curObj.propertyValueId || curObj.id)) {
                    curObj.id &&
                      (curObj.propertyValueDefinitionName = item.attrValue);
                    return true;
                  }
                })[0].attrValue;
              this.syncSSmtSkuDtoList = this.tableChangeRowSomeSku(
                curObj,
                _val,
                "propertyValueDefinitionName"
              );
            }
          },
          // 获取调价
          getRegionPrice(data) {
            commonReturnPromise({
              url: ctx + "/smtRegionPrice/getTemplateByStore",
              type: "post",
              params: JSON.stringify(data),
              contentType: "application/json",
            })
              .then((data) => {
                this.allRegionPriceList = data;
              })
              .catch((err) => layer.msg(err, { icon: 2 }));
          },
          //整合数据
          matchData(nums1, nums2) {
            const map = {};
            const obj = {};
            const ret = [];
            for (let i = 0; i < nums1.length; i++) {
              map[nums1[i].propertyValueId] = true;
              obj[nums1[i].propertyValueId] = nums1[i];
            }
            for (let i = 0; i < nums2.length; i++) {
              if (map[nums2[i].id]) {
                ret.push({
                  ...nums2[i],
                  propertyValueDefinitionName: nums2[i].attrValue,
                  checked: true,
                  ...obj[nums2[i].id],
                });
              } else {
                ret.push({
                  ...nums2[i],
                  propertyValueDefinitionName: nums2[i].attrValue,
                  checked: false,
                });
              }
            }
            return ret;
          },
          // 上传图片 那的下拉框  ,chooseObj:选中数据,curObj：当前类目属性
          selPicHandle(showbox, chooseObj, index, curObj) {
            //下拉框 隐藏时
            if (!showbox && chooseObj.propertyValueId) {
              // 数据选中的checked为true
              for (var i = 0; i < curObj.platCateAttrValueVOList.length; i++) {
                if (
                  curObj.platCateAttrValueVOList[i].id ==
                  chooseObj.propertyValueId
                ) {
                  curObj.platCateAttrValueVOList[i].checked = true;
                }
              }
              var propertyValueDefinitionName =
                curObj.platCateAttrValueVOList.filter(
                  (item) => item.id === chooseObj.propertyValueId
                )[0].attrValue;
              // 最后一项选择后，选择数据，增加一行,并且选中
              if (
                index == curObj.chooseList.length - 1 &&
                !!chooseObj.propertyValueId
              ) {
                curObj.chooseList.push({
                  checked: false,
                  skuImage: "",
                  skuPropertyId: curObj.id,
                });
                chooseObj.checked = true;
                // 添加行数据
                var curskuDtoObj = {
                  propertyValueDefinitionName:
                    chooseObj.propertyValueDefinitionName ||
                    propertyValueDefinitionName,
                  propertyValueId: chooseObj.propertyValueId,
                  skuPropertyId: curObj.id,
                  skuImage: chooseObj.skuImage || "",
                };
                if (curObj.chooseList.length == 2) {
                  // 从无到有
                  // 将当前属性对应的table header col释放出来
                  this.syncSSmtSkuDtoListCols = this.syncSSmtSkuDtoListCols.map(
                    (item) => ({
                      ...item,
                      isShow: curObj.id == item.id ? true : item.isShow,
                    })
                  );
                  this.syncSSmtSkuDtoList.length
                    ? this.syncSSmtSkuDtoList.forEach((item) => {
                        if (item.aliexpressSkuPropetry) {
                          item.aliexpressSkuPropetry.aeopSkuProperty.push(
                            curskuDtoObj
                          );
                        } else {
                          item.aliexpressSkuPropetry = {
                            aeopSkuProperty: [{ ...curskuDtoObj }],
                          };
                        }
                      })
                    : this.syncSSmtSkuDtoList.push({
                        price: "",
                        ipmSkuStock: "",
                        storeSubSku: "",
                        priceCny: "",
                        aliexpressSkuPropetry: {
                          aeopSkuProperty: [{ ...curskuDtoObj }],
                        },
                      });
                } else {
                  // 已有一行
                  // 删除本属性
                  var chooseOtherSkuList = this.syncSSmtSkuDtoList.map(
                    (item) => {
                      var _item =
                        item.aliexpressSkuPropetry.aeopSkuProperty.filter(
                          (elem) => elem.skuPropertyId != curObj.id
                        );
                      return _item;
                    }
                  );
                  // 需要去重   有问题????
                  var reduceObj = [];

                  var _chooseOtherSkuList = chooseOtherSkuList[0].length
                    ? chooseOtherSkuList.reduce((cur, next) => {
                        let isExit = reduceObj.filter((elem) =>
                          next.every((item) => !!elem[item.propertyValueId])
                        );
                        if (!isExit.length) {
                          let _reduceObj = {};
                          next.forEach((item) => {
                            _reduceObj[item.propertyValueId] = true;
                          });
                          reduceObj.push({ ..._reduceObj });
                          cur.push(next);
                        }
                        return cur;
                      }, [])
                    : [""];
                  _chooseOtherSkuList.forEach((item) => {
                    this.syncSSmtSkuDtoList.push({
                      storeSubSku: "",
                      ipmSkuStock: "",
                      price: "",
                      priceCny: "",
                      aliexpressSkuPropetry: {
                        aeopSkuProperty: item
                          ? [curskuDtoObj].concat(item)
                          : [curskuDtoObj],
                      },
                    });
                  });
                }
              } else {
                //修改table行数据
                var _propertyValueDefinitionName =
                  chooseObj.propertyValueDefinitionName ||
                  propertyValueDefinitionName;
                this.syncSSmtSkuDtoList = this.tableChangeRowSomeSku(
                  {
                    propertyValueId: this.lastSelectedValId,
                    propertyValueDefinitionName: _propertyValueDefinitionName,
                  },
                  chooseObj.propertyValueId,
                  "propertyValueId"
                );
              }
            } else {
              // 上次数据选中的checked为false
              this.lastSelectedValId = chooseObj.propertyValueId;
              for (var i = 0; i < curObj.platCateAttrValueVOList.length; i++) {
                if (
                  curObj.platCateAttrValueVOList[i].id ==
                  chooseObj.propertyValueId
                ) {
                  curObj.platCateAttrValueVOList[i].checked = false;
                }
              }
            }
          },
          //上传图片那的checkbox  没选中，删除当前行,table减少相关行（如果是当前属性唯一一个，删除一列）
          checkOptionHandle(isChecked, curSkuObj, curObj) {
            if (!isChecked) {
              // 删除列
              if (curSkuObj.chooseList.length == 2) {
                this.syncSSmtSkuDtoListCols.forEach((item) => {
                  item.isShow =
                    curObj.skuPropertyId == item.id ? false : item.isShow;
                });
                this.syncSSmtSkuDtoList = this.syncSSmtSkuDtoList.map(
                  (item) => {
                    var itemSku =
                      item.aliexpressSkuPropetry.aeopSkuProperty.filter(
                        (elem) => elem.propertyValueId != curObj.propertyValueId
                      );
                    return {
                      ...item,
                      aliexpressSkuPropetry: { aeopSkuProperty: itemSku },
                    };
                  }
                );
              } else {
                // table 减少相关行
                this.syncSSmtSkuDtoList = this.syncSSmtSkuDtoList.filter(
                  (item) => {
                    var ittem = true;
                    let itemArr = item.aliexpressSkuPropetry.aeopSkuProperty;
                    for (var i = 0; i < itemArr.length; i++) {
                      if (
                        itemArr[i].propertyValueId == curObj.propertyValueId
                      ) {
                        return (ittem = false);
                      }
                    }
                    return ittem;
                  }
                );
              }
              // 减少行
              curSkuObj.chooseList = curSkuObj.chooseList.filter(
                (item) => item.propertyValueId != curObj.propertyValueId
              );
              // 将option的这个值 的checked为false
              curSkuObj.platCateAttrValueVOList =
                curSkuObj.platCateAttrValueVOList.map((item) => ({
                  ...item,
                  checked:
                    item.id === curObj.propertyValueId ? false : item.checked,
                }));
            }
          },
          // 删除图片
          delImg(obj) {
            obj.skuImage = "";
            this.syncSSmtSkuDtoList = this.tableChangeRowSomeSku(
              obj,
              "",
              "skuImage"
            );
          },
          // 添加图片
          uploadImg(event, obj) {
            let img = event.target.files[0];
            let formData = new FormData();
            formData.append("file", img);
            formData.append("storeAcctId", smt_arr[0].storeAcctId);
            var _this = this;
            $.ajax({
              type: "post",
              url: ctx + "/batchOperation/skuImageUpload",
              data: formData,
              async: true,
              cache: false,
              contentType: false,
              processData: false,
              dataType: "json",
              beforeSend: function () {
                loading.show();
              },
              success: function (data) {
                loading.hide();
                if (data.code == "0000") {
                  // 添加图片
                  obj.skuImage = data.msg;
                  // 修改table 行
                  if (obj.checked) {
                    _this.syncSSmtSkuDtoList = _this.tableChangeRowSomeSku(
                      obj,
                      data.msg,
                      "skuImage"
                    );
                  }
                }
              },
              error: function (error) {
                loading.hide();
                layer.msg(`${error.statusText}`, { icon: 2 });
              },
            });
          },
          // uploadImgByInput(event, obj) {
          //     if (obj.checked) {
          //         this.syncSSmtSkuDtoList = this.tableChangeRowSomeSku(obj, event, 'skuImage')
          //     }
          // },
          // 发货地-调价模板联动， ，没有图片没有自定义的选中
          placeCheckHandle(isChecked, obj, curChkObj) {
            var deliveryPlaces = obj.platCateAttrValueVOList.filter(
              (item) => !!item.checked
            );
            // 只有发货地 200007763 才会跟调价模板联动
            if (obj.id == 200007763) {
              if (isChecked) {
                this.plaPriceData[0].deliveryPlace
                  ? this.plaPriceData.push({
                      deliveryPlace: curChkObj.attrValue,
                      tpl: "",
                      propertyValueId: curChkObj.id,
                    })
                  : (this.plaPriceData = [
                      {
                        deliveryPlace: curChkObj.attrValue,
                        tpl: this.plaPriceData[0].tpl,
                        propertyValueId: curChkObj.id,
                      },
                    ]);
              } else {
                let _plaPriceData = this.plaPriceData.filter(
                  (item) => item.propertyValueId != curChkObj.id
                );
                this.plaPriceData = _plaPriceData.length
                  ? _plaPriceData
                  : [{ deliveryPlace: "", tpl: "", propertyValueId: "" }];
              }
            }
            this.tableChangeRow(isChecked, obj, curChkObj, deliveryPlaces);
          },
          // table 行 部分值变化
          tableChangeRowSomeSku(obj, curval, curName) {
            var tableData = this.syncSSmtSkuDtoList.map((item) => {
              var _item = item.aliexpressSkuPropetry.aeopSkuProperty.map(
                (elem) => {
                  if (elem.propertyValueId == (obj.id || obj.propertyValueId)) {
                    //因为图片的输入框与checkbox输入框的循环体不一样
                    return {
                      ...elem,
                      propertyValueDefinitionName:
                        obj.propertyValueDefinitionName ||
                        item.propertyValueDefinitionName,
                      [curName]: curval,
                    };
                  } else {
                    return { ...elem };
                  }
                }
              );
              return {
                ...item,
                aliexpressSkuPropetry: { aeopSkuProperty: _item },
              };
            });
            return tableData;
          },
          // table添加行和删除行
          tableChangeRow(isChecked, obj, curChkObj, checkedList) {
            var curskuDtoObj = {
              propertyValueDefinitionName: curChkObj.attrValue,
              propertyValueId: curChkObj.id,
              skuPropertyId: obj.id,
            };
            //如果是 从有变成无  sku-tables删除一列
            if (!checkedList.length) {
              this.syncSSmtSkuDtoListCols = this.syncSSmtSkuDtoListCols.map(
                (item) => ({
                  ...item,
                  isShow: obj.id == item.id ? false : item.isShow,
                })
              );
              this.syncSSmtSkuDtoList.forEach((item) => {
                var skuDtoindex =
                  item.aliexpressSkuPropetry.aeopSkuProperty.findIndex(
                    (elem) => elem.skuPropertyId == obj.id
                  );
                skuDtoindex != -1 &&
                  item.aliexpressSkuPropetry.aeopSkuProperty.splice(
                    skuDtoindex,
                    1
                  );
              });
            } else if (isChecked && checkedList.length == 1) {
              // 如果是 从无变成有 增加一列
              // 增加一列
              this.syncSSmtSkuDtoListCols = this.syncSSmtSkuDtoListCols.map(
                (item) => ({
                  ...item,
                  isShow: obj.id == item.id ? true : item.isShow,
                })
              );
              obj.chooseList.push(curskuDtoObj);
              //
              if (this.syncSSmtSkuDtoList.length) {
                this.syncSSmtSkuDtoList.forEach((item) => {
                  if (item.aliexpressSkuPropetry) {
                    item.aliexpressSkuPropetry.aeopSkuProperty.push(
                      curskuDtoObj
                    );
                  } else {
                    item.aliexpressSkuPropetry = {
                      aeopSkuProperty: [{ ...curskuDtoObj }],
                    };
                  }
                });
              } else {
                this.syncSSmtSkuDtoList.push({
                  price: "",
                  ipmSkuStock: "",
                  storeSubSku: "",
                  priceCny: "",
                  aliexpressSkuPropetry: {
                    aeopSkuProperty: [{ ...curskuDtoObj }],
                  },
                });
              }
            } else {
              //增加/减少行
              //     // 删除
              if (!isChecked) {
                this.syncSSmtSkuDtoList = this.syncSSmtSkuDtoList.filter(
                  (item) => {
                    let isIncluCurSku =
                      item.aliexpressSkuPropetry.aeopSkuProperty.filter(
                        (elem) => elem.propertyValueId == curChkObj.id
                      );
                    return !isIncluCurSku.length;
                  }
                );
              } else {
                // 添加行
                // 删除本属性
                var chooseOtherSkuList = this.syncSSmtSkuDtoList.map((item) => {
                  var _item = item.aliexpressSkuPropetry.aeopSkuProperty.filter(
                    (elem) => elem.skuPropertyId != obj.id
                  );
                  return _item;
                });
                // 需要去重   写的太复杂了
                var reduceObj = [];

                var _chooseOtherSkuList = chooseOtherSkuList[0].length
                  ? chooseOtherSkuList.reduce((cur, next) => {
                      let isExit = reduceObj.filter((elem) =>
                        next.every((item) => !!elem[item.propertyValueId])
                      );
                      if (!isExit.length) {
                        let _reduceObj = {};
                        next.forEach((item) => {
                          _reduceObj[item.propertyValueId] = true;
                        });
                        reduceObj.push({ ..._reduceObj });
                        cur.push(next);
                      }
                      return cur;
                    }, [])
                  : [""];
                _chooseOtherSkuList.forEach((item) => {
                  this.syncSSmtSkuDtoList.push({
                    storeSubSku: "",
                    ipmSkuStock: "",
                    price: "",
                    priceCny: "",
                    aliexpressSkuPropetry: {
                      aeopSkuProperty: item
                        ? [curskuDtoObj].concat(item)
                        : [curskuDtoObj],
                    },
                  });
                });
              }
            }
            this.$nextTick(() => {
              this.$refs["smtOnline_updateListingInfo_table"].doLayout();
            });
          },
          // 选择调价后，调价模板数
          selregionPriceHandle(type) {
            this.regionPriceList = this.allRegionPriceList.filter(
              (item) => item.adjustPriceType == type
            );
            this.plaPriceData = this.plaPriceData.map((item) => ({
              ...item,
              tpl: "",
            }));
          },
          // 估算价格
          estimatedPrice() {
            // 商品编码不能重复且有值
            let { hasRepeatSubSku, hasSubSkuVal } = this.verfityRepeatNullSku();
            if (!hasSubSkuVal)
              return layer.msg("商品编码不能有空值", { icon: 7 });
            if (hasRepeatSubSku)
              return layer.msg("商品编码不能有重复的", { icon: 7 });
            let params = {
              grossProfitRate: this.grossProfitRate,
              discountRate: this.discountRate,
              shippingType: this.shippingType,
              skuDtoList: this.syncSSmtSkuDtoList.map((item) => ({
                freightTemplateId: smt_arr[0].freightTemplateId,
                storeAcctId: smt_arr[0].storeAcctId,
                storeSubSku: item.storeSubSku,
              })),
            };
            commonReturnPromise({
              url: ctx + "/batchOperation/updateSkuFixPrice",
              type: "post",
              params: JSON.stringify(params),
              contentType: "application/json;charset=UTF-8",
            })
              .then((data) => {
                // 赋值
                this.syncSSmtSkuDtoList = this.syncSSmtSkuDtoList.map(
                  (item) => ({
                    ...item,
                    price: this.estimatedPriceBySku(item, data).price,
                    priceCny: this.estimatedPriceBySku(item, data).priceCny,
                  })
                );
              })
              .catch((err) => layer.msg(err, { icon: 2 }));
          },
          //估算价格应用
          estimatedPriceBySku(obj, arr) {
            let price = "";
            let priceCny = "";
            for (var i = 0; i < arr.length; i++) {
              if (obj.storeSubSku == arr[i].storeSubSku) {
                price = arr[i].price;
                priceCny = arr[i].priceCny;
                break;
              }
            }
            return { price, priceCny };
          },
          // 库存
          allStockBlurHandle(value) {
            this.syncSSmtSkuDtoList = this.syncSSmtSkuDtoList.map((item) => ({
              ...item,
              ipmSkuStock: this.allStock,
            }));
          },
          // 价格
          priceHandle(rowValue) {
            if (rowValue.price === "" || rowValue.price === undefined) {
              rowValue.priceCny = undefined;
            } else {
              rowValue.priceCny = (rowValue.price * this.exchange_rate).toFixed(
                2
              );
            }
          },
          //
          priceCnyHandle(rowValue) {
            if (rowValue.priceCny === "" || rowValue.priceCny === undefined) {
              rowValue.price = undefined;
            } else {
              rowValue.price = (rowValue.priceCny / this.exchange_rate).toFixed(
                2
              );
            }
          },
          // 库存
          ipmSkuStockHandle(value) {
            // console.log('value :>> ', value);
          },
          // 商品编码
          storeSubSkuHandle(value) {
            // console.log('value :>> ', value);
          },
          tableOtherPicRow(curRowObj, id) {
            var aeopSkuPropertys =
              curRowObj.aliexpressSkuPropetry.aeopSkuProperty;
            var curAeopSkuPropertys = aeopSkuPropertys.filter(
              (item) => item.skuPropertyId == id
            );
            return `<div class="smtOnline_updateListingInfo-disfcenter" 
                    v-if="${!!(curAeopSkuPropertys[0] || {}).skuImage}">
                    <img class="img_show_hide lazy w40"
                        original="${
                          (curAeopSkuPropertys[0] || {}).skuImage || ""
                        }"
                        src="${(curAeopSkuPropertys[0] || {}).skuImage || ""}"
                        style="display: block;">
                </div>
                <div class="taCenter ml10">${
                  (curAeopSkuPropertys[0] || {}).propertyValueDefinitionName ||
                  ""
                }</div>`;
          },
          tableOtherRow(curRowObj, id, item) {
            var aeopSkuPropertys =
              curRowObj.aliexpressSkuPropetry.aeopSkuProperty;
            var curAeopSkuPropertys = aeopSkuPropertys.filter(
              (item) => item.skuPropertyId == id
            );
            if (curAeopSkuPropertys.length) {
              return curAeopSkuPropertys[0].propertyValueDefinitionName;
            }
          },
          // 商品编码不能重复且有值
          verfityRepeatNullSku() {
            let storeSubSkuObj = {};
            let hasRepeatSubSku = false;
            let hasSubSkuVal = true;
            for (var i = 0; i < this.syncSSmtSkuDtoList.length; i++) {
              if (
                this.syncSSmtSkuDtoList[i].storeSubSku &&
                storeSubSkuObj[this.syncSSmtSkuDtoList[i].storeSubSku]
              ) {
                hasRepeatSubSku = true;
                break;
              } else {
                if (!this.syncSSmtSkuDtoList[i].storeSubSku) {
                  hasSubSkuVal = false;
                  break;
                }
                storeSubSkuObj[this.syncSSmtSkuDtoList[i].storeSubSku] = true;
              }
            }
            return { hasRepeatSubSku, hasSubSkuVal };
          },
          // 高亮某table cell
          highLightCurCell({ row, column }) {
            if (row.price == 0 && column.property == "price") {
              return "cell-highLight";
            }
            if (row.priceCny == 0 && column.property == "priceCny") {
              return "cell-highLight";
            }
          },
          // #endregion sku信息
          // #region  保存
          // 保存信息
          skuInfoSubmit() {
            // 商品编码不能重复且有值
            let { hasRepeatSubSku, hasSubSkuVal } = this.verfityRepeatNullSku();
            if (!hasSubSkuVal)
              return layer.msg("商品编码不能有空值", { icon: 7 });
            if (hasRepeatSubSku)
              return layer.msg("商品编码不能有重复的", { icon: 7 });
            // 库存价格必填为0
            let submitInfo = {
              id: smt_arr[0].id,
              storeAcctId: smt_arr[0].storeAcctId,
              pricingStatus: this.isRegionPrice ? 1 : 0,
              skuList: this.syncSSmtSkuDtoList.map((item) => ({
                stock: item.ipmSkuStock,
                storeSSku: item.storeSubSku,
                price: item.price,
                priceCny: item.priceCny,
                aeopSkuPropertyList: item.aliexpressSkuPropetry ? this.removeChineseCharacters(
                  item.aliexpressSkuPropetry.aeopSkuProperty
                ) : [],
              })),
            };

            // 掉接口 先子sku再标题和描述
            commonReturnPromise({
              url: ctx + "/batchOperation/updateSku",
              type: "post",
              contentType: "application/json;charset=UTF-8",
              params: JSON.stringify(submitInfo),
            })
              .then(() => {
                layer.msg("修改子sku信息成功", { icon: 1 });
                // 区域定价 和标题描述
                this.submitPriceAdjustPrice();
              })
              .catch((err) =>
                layer.alert(err, {
                  icon: 2,
                  title: "修改子sku信息失败原因",
                })
              );
          },
          // 去掉中文字符
          // 去掉中文字符
          removeChineseCharacters(aeopSkuProperty) {
            let _aeopSkuProperty = (aeopSkuProperty || []).map((item) => ({
              ...item,
              propertyValueDefinitionName: /[\u4e00-\u9fa5]/.test(
                item.propertyValueDefinitionName
              )
                ? ""
                : item.propertyValueDefinitionName,
            }));
            return _aeopSkuProperty;
          },

          saveTitleDesc() {
            const detailData = {};
            // 标题
            detailData.title = $(".smtModifyTitleDesc_title")
              .find("input[name=shopTiele_Desc]")
              .val();
            // 手机版
            var parentDomPhone = $("#smtModifyTitleDesc_modules_phone").find(
              ".smtModifyTitleDesc-rowFlexClass"
            );
            var mobileDetail = {
              mobileDetail:
                smtModifyTitleDesc_desc_preview_deal(parentDomPhone),
              version: "1.0",
              versionNum: 1,
            };
            detailData.mobileDetail = JSON.stringify(mobileDetail);
            var pDom = $(".detail-desc-decorate-content");
            if (pDom.length) {
              pDom.each(function (index, item) {
                var newHtml = $(item)
                  .html()
                  .replace(/(\r\n|\n|\r)/gm, "<br>");
                $(item).html(newHtml);
              });
            }
            detailData.detail = smtModifyTitleDesc_simditor.txt.html(); //获取富文本的值
            commonReturnPromise({
              url: ctx + "/batchOperation/updateTitleAndDetail",
              type: "post",
              params: JSON.stringify({
                ...smtModifyTitleDesc_data,
                ...detailData,
              }),
              contentType: "application/json",
            })
              .then((data) => {
                var _data = JSON.parse(data);
                Object.keys(_data)[0] == "fail"
                  ? layui.layer.msg(
                      "修改标题和描述失败:" + Object.values(_data)[0],
                      { icon: 2 }
                    )
                  : layui.layer.msg(
                      "修改标题和描述成功:" + Object.values(_data)[0],
                      { icon: 1 }
                    );
              })
              .catch((err) =>
                layer.confirm(err, {
                  icon: 2,
                  title: "修改标题和描述失败原因",
                })
              );
          },
          saveSkuInfo(params) {
            commonReturnPromise({
              url: ctx + "/batchOperation/updateSku",
              type: "post",
              contentType: "application/json;charset=UTF-8",
              params: JSON.stringify(params.submitInfo),
            })
              .then(() => {
                // sku信息
                layer.msg("修改子sku信息成功", { icon: 1 });
                // 区域定价
                this.submitPriceAdjustPrice();
              })
              .catch((err) => {
                layer.alert(err, {
                  icon: 2,
                  title: "区域定价失败原因",
                });
              });
          },
          // 保存区域定价
          submitPriceAdjustPrice() {
            // 设置区域定价
            if (this.isRegionPrice) {
              // 调价模板id需要都有值
              let hasTemplateId = true;
              for (var i = 0; i < this.plaPriceData.length; i++) {
                if (!this.plaPriceData[i].tpl) {
                  hasTemplateId = false;
                  break;
                }
              }
              if (!hasTemplateId)
                return layer.msg("调价模板需要选值", { icon: 7 });

              let skuRegionAdjustPrice = {
                id: smt_arr[0].id,
                deliveryList: this.plaPriceData.map((item) => ({
                  deliveryPlace: item.propertyValueId || "NONE",
                  templateId: item.tpl,
                })),
              };
              commonReturnPromise({
                url: ctx + "/batchOperation/skuRegionAdjustPrice",
                type: "post",
                contentType: "application/json;charset=UTF-8",
                params: JSON.stringify(skuRegionAdjustPrice),
              })
                .then((data) => {
                  // this.$message({
                  //   message: "设置区域定价成功",
                  //   type: "success",
                  //   customClass: "smtOnline_updateListingInfo-message",
                  //   offset: 150,
                  // });
                  layer.msg("设置区域定价成功", { icon: 1 });

                  this.saveTitleDesc();
                })
                .catch((err) => {
                  layer.msg("设置区域定价失败" + err, { icon: 2 });
                });
            } else {
              this.saveTitleDesc();
            }
          },
          // #endregion  保存
          // #region 关联销售属性
          // 是否展示关联属性
          showAddSkuArea(curAttr) {
            if (this.syncSSmtSkuDtoListShowCols.length === 5) {
              const unDisableData = curAttr.platCateAttrValueVOList.filter(
                (item) => !item.checked
              );
              if (unDisableData.length) {
                return true;
              }
            }

            return false;
          },
          handleAddSku(curAttr) {
            const _this = this;
            if (!this.newSkuStr) return layer.msg("请输入sku", { icon: 7 });
            // 逗号分隔,转数组
            const newSkuList = this.newSkuStr
              .replaceAll("，", ",")
              .split(",")
              .map((item) => $.trim(item))
              .filter((item) => !!item);
            // 掉接口，判断是否侵权
            commonReturnPromiseRes({
              url: "/lms/batchOperation/addItemSkus",
              type: "post",
              contentType: "application/json",
              params: JSON.stringify({
                itemId: smt_arr[0].itemId,
                skus: newSkuList,
              }),
            })
              .then((res) => {
                // 没有侵权
                _this.addSkuAndImgattr(res.data, curAttr);
              })
              .catch((res) => {
                if (typeof res === "string" && res.includes("侵权")) {
                  layer.confirm(
                    res,
                    { icon: 7, title: "侵权提示" },
                    function (index) {
                      layer.close(index);
                      commonReturnPromise({
                        url: "/lms/batchOperation/addItemSkus",
                        type: "post",
                        contentType: "application/json",
                        params: JSON.stringify({
                          itemId: smt_arr[0].itemId,
                          skus: newSkuList,
                          isContinueAddPlatTortSku: true,
                        }),
                      }).then((res) => {
                        _this.addSkuAndImgattr(res, curAttr);
                      });
                    }
                  );
                } else {
                  layer.msg(res, { icon: 2 });
                }
                console.log("res :>> ", res);
              });
          },
          addSkuAndImgattr(newSkuList, curAttr) {
            // 添加图片属性
            const newTrSkuList = [];
            newSkuList.forEach((item) => {
              // 找到一个未被禁用的下拉选项,然后设置为选中
              let curPropertyValueId;
              for (let i = 0; i < curAttr.platCateAttrValueVOList.length; i++) {
                let elem = curAttr.platCateAttrValueVOList[i];
                if (!elem.checked) {
                  curPropertyValueId = elem.id;
                  elem.checked = true;
                  break;
                }
              }
              if (curPropertyValueId) {
                let obj = {
                  propertyValueDefinitionName: item.propertyValueDefinitionName,
                  propertyValueId: curPropertyValueId,
                  skuImage: item.skuImage,
                  skuPropertyId: curAttr.id,
                };
                curAttr.chooseList.splice(-1, 0, {
                  ...obj,
                  checked: true,
                });
                // sku信息添加一行
                if (
                  this.syncSSmtSkuDtoList.length === 1 &&
                  this.syncSSmtSkuDtoListShowCols.length === 4
                ) {
                  // 需增加一列
                  this.syncSSmtSkuDtoListCols.forEach((v) => {
                    if (curAttr.id === v.id) {
                      v.isShow = true;
                    }
                  });
                  this.syncSSmtSkuDtoList[0].aliexpressSkuPropetry = {
                    aeopSkuProperty: [obj],
                  };
                  // 库存，零售价，商品编码都需要改变
                  this.syncSSmtSkuDtoList[0].storeSubSku = item.storeSubSku;
                  this.syncSSmtSkuDtoList[0].ipmSkuStock =
                    item.ipmSkuStock || 999;
                } else {
                  this.syncSSmtSkuDtoList.push({
                    price: "",
                    ipmSkuStock: item.ipmSkuStock || 999,
                    storeSubSku: item.storeSubSku,
                    priceCny: "",
                    aliexpressSkuPropetry: {
                      aeopSkuProperty: [obj],
                    },
                  });
                }
                newTrSkuList.push(item.storeSubSku);
              }
            });

            this.estimatedNewTrPrice(newTrSkuList);
          },
          // 估算价格
          estimatedNewTrPrice(newTrSkuList) {
            const skuList = [
              ...new Set(
                this.syncSSmtSkuDtoList
                  .map((item) => item.storeSubSku)
                  .filter((item) => !!item)
              ),
            ];
            let params = {
              grossProfitRate: this.grossProfitRate,
              discountRate: this.discountRate,
              shippingType: this.shippingType,
              skuDtoList: skuList.map((item) => ({
                freightTemplateId: smt_arr[0].freightTemplateId,
                storeAcctId: smt_arr[0].storeAcctId,
                storeSubSku: item,
              })),
            };

            commonReturnPromise({
              url: ctx + "/batchOperation/updateSkuFixPrice",
              type: "post",
              params: JSON.stringify(params),
              contentType: "application/json;charset=UTF-8",
            })
              .then((data) => {
                // 赋值
                this.syncSSmtSkuDtoList.forEach((item) => {
                  if (newTrSkuList.includes(item.storeSubSku)) {
                    item.price = this.estimatedPriceBySku(item, data).price;
                    item.priceCny = this.estimatedPriceBySku(
                      item,
                      data
                    ).priceCny;
                  }
                });
                layer.msg("添加成功", { icon: 1 });
              })
              .catch((err) => layer.msg(err, { icon: 2 }));
          },
          // #endregion 关联销售属性
        },
      });
    }
  );
})(jQuery, layui, window, document);
//锚点
function smtOnline_updateListingInfo_Location(obj) {
  var $id = $(obj).data("id");
  document.getElementById($id).scrollIntoView();
}

layui.use(
  [
    "admin",
    "layer",
    "table",
    "form",
    "laytpl",
    "element",
    "laydate",
    "formSelects",
    "upload",
  ],
  function () {
    var admin = layui.admin,
      layer = layui.layer,
      $ = layui.$,
      table = layui.table,
      element = layui.element,
      upload = layui.upload,
      form = layui.form;

    form.on("checkbox(smtProductQualification_qualification)",function(data){
      let elemDom = data.elem,
          elemValue = data.value,
          elemCheck = elemDom.checked;

      if (elemCheck) {
        $("#LAY-smtProductQualification ." + elemValue).parent().show()
        // id-在线商品页父商品id，只勾选一个商品时传，多个时无法取图，直接不传
        const params = {
          qualificationKeys: [elemValue]
        }
        if(smt_arr.length === 1){
          params.id = smt_arr[0].id
        }
        commonReturnPromise({
          url: ctx + "/smtQualificationsTemplate/getDefaultQualificationImage",
          contentType: "application/json",
          params: JSON.stringify(params),
          type: "POST"
        }).then((res) => {
          if(res.length != 0){
            let resStr = `<img width="60" height="60" data-url="${res[0].qualificationValue}" src="${res[0].qualificationValue}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/><span class="colorRed" onclick="smtPQ_delete(this)">删除</span>`
            $("#LAY-smtProductQualification ." + elemValue).find(`.imgCon`).html(resStr)
          }
        })
      }else{
        $("#LAY-smtProductQualification ." + elemValue).parent().hide()
      }
    })
    const smtProductQualificationName = {
      init: function () {
        const categoryId = [
          ...new Set(smt_arr.map((item) => item.categoryId)),
        ];
        const storeAcctId = [
          ...new Set(smt_arr.map((item) => item.storeAcctId)),
        ];
        commonReturnPromise({
          url: ctx + "/aliexpress/category/getQualificationsByStoreAcctIdAndCategoryId?categoryId=" + categoryId[0] + "&storeAcctId=" + storeAcctId[0],
          type: "POST"
        }).then((res) => {
          let qualificationList = (res||[]).map(v=>({
            ...v,
            country:v.country||'未知',
            qualificationName:v.qualificationName||'未知',
            qualificationValue:''
          }))

          let str = '',html = '';
          qualificationList.forEach((i,iIndex) => {
            if(iIndex == 0 ||!(i.country == qualificationList[iIndex-1].country && i.qualificationName == qualificationList[iIndex-1].qualificationName)){
              str += `<div style="color:#000;margin:10px;">${i.country}-${i.qualificationName}</div><hr>`
            }
            str += `<div class="con_upload disN"><div class="${i.qualificationKey}"><div style="width:200px;display:inline-block;text-align: right;">`
            if(i.required){
              str += `<span class="colorRed fontSize20">*</span>`
              html += `<span class="colorRed fontSize20" style>*</span>`
            }
            str += `${i.label}</div><a style="margin:10px;" class="layui-btn layui-btn-primary layui-btn-sm upload${i.qualificationKey}">上传本地文件</a><span class="imgCon"></span></div><div style="color:#ff9900;padding:10px;margin-left:200px;">${i.tips}</div></div>`
            html += `<input type="checkbox" lay-skin="primary" name="qualification" value="${i.qualificationKey}" title="${i.label}" lay-filter="smtProductQualification_qualification">`
          })
          $("#LAY-smtProductQualification .checkboxForm").html(html)
          $("#LAY-smtProductQualification .containerData").val(JSON.stringify(qualificationList))
          $("#LAY-smtProductQualification .container").html(str)
          form.render("checkbox")

          for(let i=0;i<res.length;i++){
            let smt_uploadListIns = upload.render({
              elem: `.upload${res[i].qualificationKey}`
              // , url: ctx + '/preProdDev/getBase64Img.html' //此处配置你自己的上传接口即可
              , auto: false //选择文件后不自动上传
              , accept: 'images'
              , number: 1 // 设置同时可上传的文件数量
              // , size: 3072 //最大允许上传的文件大小 单位KB
              ,choose: function (obj) {
                loading.show()
                // 清空历史上传文件，解决choose只执行一次的问题！！！
                smt_uploadListIns.config.elem.next()[0].value = '';
                let _this = this;
                   obj.preview(function (index, file, result) {
                     $.ajax({
                       type: "POST",
                       url: "/lms/preProdDev/getBase64Img.html",
                       data: { AreaImgKey: result },
                       async: false,
                       success: function (resUrl) {
                         let resStr = `<img width="60" height="60" data-url="${resUrl}" src="${resUrl}!size=60x60" class="pointHand img_show_hide b1 lazy" data-onerror="layui.admin.img_noFind()"/><span class="colorRed" onclick="smtPQ_delete(this)">删除</span>`
                         $(_this.elem).parent().find(`.imgCon`).html(resStr)
                         loading.hide()
                         layer.msg("操作成功", { icon: 1 });
                       },
                       error: function (err) {
                         loading.hide()
                         layer.msg("操作失败", { icon: 2 });
                       },
                     });
                   })
               }
            });
          }
        });
        this.tableData();
        this.handleApply();
      },
      tableData: function () {
          table.render({
            elem: "#smtProductQualification_table",
            data: smt_arr,
            limit: 9999999,
            cols: [
              [
                { checkbox: true, width: 30 },
                {
                  field: "id",
                  title: "id",
                },
                {
                  field: "storeAcctId",
                  title: "店铺id",
                },
                {
                  field: "storeAcct",
                  title: "店铺",
                },
                {
                  field: "itemId",
                  title: "itemId",
                },
                {
                  field: "prodSSku",
                  title: "商品子SKU",
                },
                {
                  field: "storeSSku",
                  title: "店铺子SKU",
                },
                {
                  field: "result",
                  title: "操作结果",
                  templet: "#smtProductQualification_table_result_info",
                },
              ],
            ],
            done: function (res, curr, count) {
              $("#smtProductQualification_total").text(count);
            },
            id: "smtProductQualification_table",
          });
      },
      handleApply: function () {
        const that = this;
        $("#smtProductQualification_update").click(function () {
          const { data } = table.checkStatus("smtProductQualification_table");
          // 获取当前类目下所有资质
          let qualifications = JSON.parse($("#LAY-smtProductQualification .containerData").val() || []);
          // 获取调整项选中值
          let qualificationFormData = serializeObject($('#LAY-smtProductQualification .checkboxForm'))
          // 根据调整项选中值过滤数据，保存要用的
          if(qualificationFormData.qualification && qualificationFormData.qualification != ''){
            let checkQualifications = qualificationFormData.qualification.split(",")
            qualifications = qualifications.filter(i => checkQualifications.includes(i.qualificationKey))
          }else{
            return layer.msg("请选择调整项")
          }
          // 根据过滤后的数据，填url
          qualifications.forEach(i => {
            i.qualificationValue = $("#LAY-smtProductQualification ." + i.qualificationKey).find('img').data("url")
          })

          if (!data.length) {
            return layer.msg("请选择数据");
          }
          // 将选中的元素的操作结果置空
          that.chekedTrEmpty()
          let items = []
          data.forEach(item => {
            items.push({
              "storeAcctId":item.storeAcctId,
              "itemId":item.itemId,
              "categoryId":item.categoryId
            })
          })
          const params = {
            qualifications,
            items,
          };
          commonReturnPromise({
            url: `/lms/onlineProductSmt/batchUpdateProdQualification`,
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(params),
          }).then((batchNo) => {
            layer.msg("提交队列成功", { icon: 1 });
            // 通过选中数据获取批次号，然后setInterval查询结果，直到选中数据的操作结果都有值
            smtProductQualificationUnit = setInterval(function () {
              var count = that.trResultEmptyCount()
              if (count == 0) {
                clearInterval(smtProductQualificationUnit);
                return;
              }
              commonReturnPromise({
                type: "POST",
                url: ctx + "/sys/selectResult.html",
                params: { 'batchNo': batchNo },
              }).then(data => {
                that.showHandleResult(data)
              })
            }, 5000);
            // const tableDom = $("#smtProductQualification_table").next();
            // res.forEach((v) => {
            //   const trDom = tableDom
            //       .find(`input[name=itemId_${v.itemId}]`)
            //       .parents("tr");
            //   if(v.code == '9999'){
            //     trDom.find(".result").addClass("colorRed").text(v.msg);
            //   }else{
            //     trDom.find(".result").removeClass("colorRed").text(v.msg);
            //   }
            // });
            // layer.msg("操作成功", { icon: 1 });
          });
        });
      },
      chekedTrEmpty: function () {
        //获取到所有的表格元素
        var trs = $('#smtProductQualification_table').next().find('tr[data-index]');
        for (var i = 0; i < trs.length; i++) {
          var tr = trs[i];
          var checkStat = $(tr).find('td').eq(0).find('div').find('input').is(":checked");
          var trResult = $(tr).find('td[data-field=result]>div');
          // 将选中的元素的操作结果置空
          checkStat && trResult.html('');
        }
      },
      trResultEmptyCount: function () {
        var count = 0
        //获取到所有的表格元素
        var trs = $('#smtProductQualification_table').next().find('tr[data-index]');
        for (var i = 0; i < trs.length; i++) {
          var tr = trs[i];
          var checkStat = $(tr).find('td').eq(0).find('div').find('input').is(":checked");
          var trResult = $(tr).find('td[data-field=result]>div').text();
          if ((trResult == '' || trResult == null) && checkStat) {
            count++;
          }
        }
        return count
      },
      showHandleResult: function (result) {  //调用批量取消和批量修改后，将结果显示在列表中
        //获取到返回结果的属性值
        if (Object.keys(result).length) {
          var idsArr = Object.keys(result)

          //获取到所有的表格元素
          var trs = $('#smtProductQualification_table').next().find('tr[data-index]');
          //如果idsArr.length<trs.length
          for (var i = 0; i < trs.length; i++) {
            var tr = trs[i];
            var trItemId = $(tr).find('td[data-field=itemId]>div').text();
            var trResult = $(tr).find('td[data-field=result]>div');
            // trResult.html('');
            for (var j = 0; j < idsArr.length; j++) {
              let itemArr = idsArr[j].split(':')
              let itemId = itemArr[itemArr.length - 1]
              if (trItemId == itemId) {
                if(result[idsArr[j]].includes("修改成功")){
                  trResult.html(`<span>${result[idsArr[j]]}</span>`);
                }else{
                  trResult.html(`<span style="color:red">${result[idsArr[j]]}</span>`);
                }
              }
            }
          }
        }
      }
    };
    smtProductQualificationName.init();
  }
);

function smtPQ_delete(_this){
  $(_this).parents(".imgCon").html('')
}

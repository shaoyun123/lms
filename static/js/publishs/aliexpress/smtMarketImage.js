// 营销图1 market1_images  1:1  白底图  传给平台imageType:2
// 营销图2 market2_images  3:4  场景图  传给平台imageType:1
layui.use(
  [
    "admin",
    "layer",
    "table",
    "form",
    "laytpl",
    "element",
    "laydate",
    "laytpl",
    "formSelects",
    "jquery",
    "upload",
  ],
  function () {
    var $ = layui.$,
      admin = layui.admin,
      layer = layui.layer,
      $ = layui.$,
      jquery = layui.jquery,
      table = layui.table,
      laydate = layui.laydate,
      element = layui.element,
      formSelects = layui.formSelects,
      laytpl = layui.laytpl,
      upload = layui.upload,
      form = layui.form;

    const smtMarketimageName = {
      init: function () {
        this.autoFillWhiteBgImg();
        this.autoFillSceneImg();
        this.bacthUpdate();
        const itemIdList = smt_arr.map((item) => item.itemId);
        const that = this;
        commonReturnPromise({
          url: "/lms/batchOperation/listItemMarketImageInfoList",
          type: "post",
          contentType: "application/json",
          params: JSON.stringify({ itemIdList }),
        }).then((res) => {
          const dataList = res.map((item) => ({
            ...item,
            marketImageList: that.dealMarketImageList(item.marketImageList),
          }));
          this.tableRender(dataList);
        });
      },
      dealMarketImageList: function (marketImageList = []) {
        let arr = [];
        if (Array.isArray(marketImageList) && marketImageList.length == 2) {
          arr = marketImageList.sort((a, b) => b.imageType - a.imageType);
        } else if (
          Array.isArray(marketImageList) &&
          marketImageList.length == 1
        ) {
          arr = marketImageList;
          if (arr[0].imageType == 2) {
            arr.push({ imageType: 1, url: this.kongImageUrl });
          } else if (arr[0].imageType == 1) {
            arr.unshift({ imageType: 2, url: this.kongImageUrl });
          }
        } else {
          arr = [
            { imageType: 2, url: this.kongImageUrl },
            { imageType: 1, url: this.kongImageUrl },
          ];
        }
        const _arr = arr.map((elem) => ({
          ...elem,
          proportionNote: this.ProportionNoteObj[elem.imageType],
          note: this.NoteObj[elem.imageType],
        }));
        return _arr;
      },
      kongImageUrl: "/lms/static/img/kong.png",
      ProportionNoteObj: {
        1: "3:4",
        2: "1:1",
      },
      NoteObj: {
        1: "场景图",
        2: "白底图",
      },
      tableRender: function (data) {
        const that = this;
        table.render({
          elem: "#smtMarketimage_table",
          data: data,
          limit: 99999,
          cols: [
            [
              { checkbox: true, width: 40, style: "vertical-align: top;" },
              { field: "storeAcct", title: "店铺", width: 120 },
              {
                field: "itemId",
                title: "item_id",
                width: 120,
              },
              {
                field: "guideImage",
                title: "橱窗图参考",
                width: 330,
                templet: "#smtMarketimage_table_guideImage_tpl",
              },
              {
                field: "marketImage",
                title: "营销图",
                templet: "#smtMarketimage_table_marketImage_tpl",
              },
              { field: "result", title: "操作结果", width: 200 },
            ],
          ],
          done: function () {
            $("#smtMarketimage_total").text(data.length);
            $("#LAY_smtMarketimage")
              .find(".smtMarketimage_table_uploadLocal_btn")
              .each(function () {
                that.uploadLocal($(this));
              });
            that.uploadNet();
            that.uploadTpl();
            that.mattingImg();
          },
        });
      },

      uploadLocal: function ($btn) {
        const sizeObj = {
          1: {
            width: 750,
            height: 1000,
          },
          2: {
            width: 800,
            height: 800,
          },
        };
        const imageType = $btn.data("imagetype");
        const size = sizeObj[imageType];
        $btn.Huploadify({
          auto: true,
          fileTypeExts:
            "*.jpg;*.png;*.jpeg;*.JPG;*.JPEG;*.PNG;*.bmp;*.BMP;*.gif;",
          multi: false,
          formData: size || "",
          fileSizeLimit: 2048, //默认单位是KB
          buttonText: "本地图片",
          breakPoints: false,
          saveInfoLocal: false,
          showUploadedPercent: false,
          showUploadedSize: false,
          removeTimeout: 500,
          uploader: ctx + "/publish/smt/uploadPic.html",
          onSelect: function (file) {
            loading.show();
            return true;
          },
          onUploadSuccess: function (file, data, response) {
            loading.hide();
            data = $.parseJSON(data);
            if (data != null && data.code == "0000") {
              const $marketImageDom = $btn.closest(".marketImage");
              $marketImageDom.find("img").prop("src", data.msg);
            } else {
              layer.msg(data.msg);
            }
          },
          onUploadError: function () {
            loading.hide();
          },
        });
      },
      uploadNet: function () {
        const that = this;
        $("#LAY_smtMarketimage")
          .find(".smtMarketimage_table_uploadNet_btn")
          .click(function () {
            const _this = this;
            layer.open({
              type: 1,
              title: "主图网络图片",
              area: ["800px", "300px"],
              id: "mainNetImgSuccess",
              content:
                '<div class="p20 pl20"><input class="layui-input" name="netImgUrl" placeholder="请填写URL,"></input></div>',
              btn: ["确定", "关闭"],
              yes: function (index, layero) {
                var url = $.trim(layero.find("input[name=netImgUrl]").val());
                if (url == null || url == "") {
                  layer.msg("图片地址不能为空！", { icon: 5 });
                  return false;
                }
                var startHttp = new RegExp(
                  "^((https|http|ftp)+://){1}[^\\s]+$"
                );
                if (startHttp.test(url) != true) {
                  layer.alert("网址格式不正确！url必须以http或者https开头", {
                    icon: 7,
                  });
                  return false;
                }
                const $marketImageDom = $(_this).closest(".marketImage");
                $marketImageDom.find("img").prop("src", url);
                layer.close(index);
              },
            });
          });
      },
      uploadTpl: function () {
        const that = this;
        $("#LAY_smtMarketimage")
          .find(".smtMarketimage_table_uploadTpl_btn")
          .click(function () {
            const limit = 1;
            const existImgs = 0;
            const $marketImageDom = $(this).closest(".marketImage");
            const prodPIdsStr = $marketImageDom.data("prodpids");
            let prodPIdList = [];
            if (prodPIdsStr && prodPIdsStr.toString().includes(",")) {
              prodPIdList = prodPIdsStr.split(",");
            } else {
              prodPIdList.push(prodPIdsStr);
            }
            const imageType = $(this).data("imagetype");
            let param = {
              prodPIds: prodPIdList,
            };
            const params = {
              param,
              limit,
              existImgs,
              cb: function (tplUrlList) {
                if (Array.isArray(tplUrlList) && tplUrlList.length) {
                  // 场景图需要转化为3:4比例
                  if (imageType == 1) {
                    that.proportionImage(
                      $marketImageDom.find("img"),
                      tplUrlList[0]
                    );
                  } else {
                    $marketImageDom.find("img").prop("src", tplUrlList[0]);
                  }
                }
              },
            };
            comPickImageTpl(params,'aliexpress');
          });
      },
      mattingImg: function () {
        // 抠图
        $("#LAY_smtMarketimage")
          .find(".smtMarketimage_table_matting_btn")
          .click(function () {
            const imgEle = $(this).closest(".marketImage").find("img");
            var url = imgEle.prop("src");
            if (url.includes("/static/img/kong.png") > 0) {
              return layer.msg("请先上传图片");
            }
            commonMattingImg(imgEle)
            // if (url.indexOf("!size=") > 0) {
            //   url = url.substring(0, url.indexOf("!size="));
            // }
            // commonReturnPromise({
            //   url: "/lms/imageProcess/photoshopByUrl",
            //   contentType: "application/json;charset=UTF-8",
            //   type: "post",
            //   params: JSON.stringify([url]),
            // }).then((res) => {
            //   if (Array.isArray(res)) {
            //     imgEle.prop("src", res[0].imageUrl);
            //     layer.msg('操作成功', { icon: 1 });
            //   } else {
            //     layer.msg("操作失败", { icon: 2 });
            //   }
            // });
          });
      },
      proportionImage: function ($imgDom, url) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let img = new Image();
        img.src = url;
        img.setAttribute("crossOrigin", "Anonymous");
        // 场景图需要裁剪为3:4比例

        img.onload = function (e) {
          const aspectRatio = 3 / 4;
          const imgWidth = img.width;
          const imgHeight = img.height;
          canvas.width = imgWidth;
          canvas.height = imgHeight;

          const canvasAspectRatio = canvas.width / canvas.height;

          let drawWidth = imgWidth;
          let drawHeight = imgHeight;
          let x = 0;
          let y = 0;

          if (imgWidth / imgHeight > aspectRatio) {
            drawWidth = imgHeight * aspectRatio;
            x = (imgWidth - drawWidth) / 2;
          } else {
            drawHeight = imgWidth / aspectRatio;
            y = (imgHeight - drawHeight) / 2;
          }
          canvas.width = drawWidth;
          canvas.height = drawHeight;
          ctx.drawImage(
            img,
            x,
            y,
            drawWidth,
            drawHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );
          // 将 canvas 转换为新的图片文件
          const newImageURL = canvas.toDataURL("image/jpeg");

          // 将图片base64转换为图片链接
          let reg =
            /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:/@?%\s]*?)\s*$/i;
          if (reg.test(newImageURL)) {
            $.ajax({
              type: "POST",
              url: "/lms/preProdDev/getBase64Img.html",
              data: { AreaImgKey: newImageURL },
              async: false,
              success: function (res) {
                $imgDom.prop("src", res);
              },
              error: function (err) {
                console.log("err :>> ", err);
                // layer.alert(err, {icon: 2})
              },
            });
          } else {
            $imgDom.prop("src", url);
          }
        };
      },
      autoFillWhiteBgImg: function () {
        const that = this;
        $("#smtMarketimage_whiteBgImage_btn").click(function () {
          that.autoFill(2);
        });
      },
      autoFillSceneImg: function () {
        const that = this;
        $("#smtMarketimage_sceneImage_btn").click(function () {
          that.autoFill(1);
        });
      },
      autoFill: function (type) {
        const that = this;
        const imageFiledObj = {
          1: "sceneImageUrl",
          2: "whiteImageUrl",
        };
        const $checkedDom = $("#smtMarketimage_table")
          .next()
          .find("tbody tr input[name=layTableCheckbox]:checked");
        if (!$checkedDom.length) {
          return layer.msg("请选择数据", { icon: 7 });
        }
        let itemIdList = [];
        $checkedDom.each(function () {
          let $tr = $(this).closest("tr");
          const itemId = $tr.find('td[data-field="itemId"] div').text();
          itemIdList.push(itemId);
        });
        commonReturnPromise({
          url: "/lms/batchOperation/listItemMarketImageInfoList",
          type: "post",
          contentType: "application/json",
          params: JSON.stringify({ itemIdList }),
        }).then((res) => {
          let newListObj = {};
          (res || []).forEach((item) => {
            newListObj[item.itemId] = item;
          });
          $checkedDom.each(function () {
            let $tr = $(this).closest("tr");
            const itemId = $tr.find('td[data-field="itemId"] div').text();
            let imgUrl = newListObj[itemId][imageFiledObj[type]];
            if (type === 1 && imgUrl) {
              that.proportionImage(
                $tr.find(`.marketImage${type}`),
                imgUrl || that.kongImageUrl
              );
            } else {
              $tr
                .find(`.marketImage${type}`)
                .attr("src", imgUrl || that.kongImageUrl);
            }
          });
        });
      },
      bacthUpdate: function () {
        const that = this;
        $("#smtMarketimage_batchUpdate_btn").click(function () {
          const $checkedDom = $("#smtMarketimage_table")
            .next()
            .find("tbody tr input[name=layTableCheckbox]:checked");
          if (!$checkedDom.length) {
            return layer.msg("请选择数据", { icon: 7 });
          }
          let arr = [];
          let existEmptyObj = false;
          $checkedDom.each(function () {
            let $tr = $(this).closest("tr");
            let sceneImageUrl = $tr.find(`.marketImage1`).attr("src");
            let whiteImageUrl = $tr.find(`.marketImage2`).attr("src");
            const itemId = $tr.find('td[data-field="itemId"] div').text();
            const storeAcctId = $tr.find("input[name=storeAcctId]").val();
            let obj = {
              itemId: parseInt(itemId),
              storeAcctId: parseInt(storeAcctId),
              marketImageList: [
                { imageType: 2, url: whiteImageUrl },
                { imageType: 1, url: sceneImageUrl },
              ],
            };
            if (
              sceneImageUrl == that.kongImageUrl ||
              whiteImageUrl == that.kongImageUrl
            ) {
              existEmptyObj = JSON.parse(JSON.stringify(obj));
            }
            arr.push(obj);
          });
          //   如果存在kong图片，则不修改
          if (existEmptyObj.itemId) {
            return layer.msg(`itemId为${existEmptyObj.itemId},存在空图片`, {
              icon: 7,
            });
          }
          commonReturnPromise({
            url: "/lms/batchOperation/updateItemMarketImageBatch",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(arr),
          }).then((res) => {
            let newListObj = {};
            (res || []).forEach((item) => {
              newListObj[item.itemId] = item;
            });
            $checkedDom.each(function () {
              let $tr = $(this).closest("tr");
              const $result = $tr.find('td[data-field="result"] div');
              const itemId = $tr.find('td[data-field="itemId"] div').text();
              let curObj = newListObj[itemId];
              let resultHtml = `<div class="${
                curObj.success ? "fGreen" : "fRed"
              }">${curObj.operMessage}</div>`;
              $result.html(resultHtml);
            });
          });
        });
      },
    };
    smtMarketimageName.init();
  }
);

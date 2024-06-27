;(function ($, layui, window, document, undefined) {
  layui.use(["admin", "form", "layer", "table", "formSelects", "element", "upload", "laydate", "laytpl"], function () {
    var admin = layui.admin,
      form = layui.form,
      layer = layui.layer,
      table = layui.table,
      formSelects = layui.formSelects,
      element = layui.element,
      upload = layui.upload,
      laydate = layui.laydate,
      laypage = layui.laypage,
      laytpl = layui.laytpl
    $ = layui.$

    let vm = new Vue({
      el: "#LAY-smtUploadVideo",
      data() {
        return {
          itemIdList: [
            // {
            //   itemId: 1005004455594400,
            //   checkedSku: "TKDU18U09",
            //   failReason:
            //     "需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px)；需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px)；需要注意的是，运算符前后都需要保留一个空格，例如：width: calc(100% - 10px)；",
            //   name: "1005004455594400_video",
            //   videos: [
            //     {
            //       videoId: 63,
            //       sku: "TKDU18U09",
            //       videoname: "TKDU18U09.mp4",
            //       size: 708440,
            //       location: "https://imghz.epean.com.cn/lazada/video/mp4/f82baefcff808081147b.mp4",
            //       picture: "https://imghz.epean.com.cn/trade/6c9919ee2c90ff452dd4.jpg",
            //     },
            //     {
            //       videoId: 3998,
            //       sku: "TKDC23C23",
            //       videoname: "TKDC23C23.mp4",
            //       size: 2792301,
            //       location: "https://imghz.epean.com.cn/lazada/video/mp4/6289a6312c90c4356bcb.mp4",
            //       picture: "https://imghz.epean.com.cn/trade/8a9928a3679660f501679c3adf0b07fb.jpg",
            //     },
            //   ],
            // },
          ],
        }
      },
      mounted() {
        // 查询视频
        const arr = smt_arr.map(item => item.itemId)
        commonReturnPromise({
          url: "/lms/aliexpressVideo/queryAliexpressVideoInfo",
          type: "post",
          contentType: "application/json",
          params: JSON.stringify({ itemIds: arr }),
        }).then(res => {
          this.itemIdList = res.map(item => ({
            ...item,
            name: item.itemId + "_video",
          }))
          this.$nextTick(() => {
            layui.form.render()
          })
        })
      },
      methods: {
        // 上传
        handleUpload() {
          // 清除定时器
          if (smtOnlineUploadVideoUnit) {
            clearInterval(smtOnlineUploadVideoUnit)
          }
          let paramsArr = []
          this.itemIdList.forEach(item => {
            const videoFileUrl = $("#smtUploadVideo_form").find(`input[name=${item.name}]:checked`).val()
            if (videoFileUrl) {
              paramsArr.push({
                itemId: item.itemId,
                videoFileUrl,
                storeAcctId: item.storeAcctId,
              })
            }
          })
          if (!paramsArr.length) return layer.msg("请选择要上传的视频")
          commonReturnPromise({
            url: "/lms/aliexpressVideo/batchUploadAliexpressVideo",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(paramsArr),
          }).then(res => {
            layer.msg("操作成功,请稍后查询结果", { icon: 1 })
            if (smtOnlineUploadVideoUnit) {
              clearInterval(smtOnlineUploadVideoUnit)
            }
            this.selectResult(res, paramsArr)
          })
        },
        // 查询结果
        selectResult(batchNo, uploadArr) {
          smtOnlineUploadVideoUnit = setInterval(() => {
            commonReturnPromise({
              url: "/lms/sys/selectResult.html",
              type: "post",
              params: { batchNo },
            })
              .then(res => {
                if (JSON.stringify(res) !== "{}") {
                  if (Object.keys(res).length === uploadArr.length) {
                    // 如果全返回了数据，则清除定时器
                    if (smtOnlineUploadVideoUnit) {
                      clearInterval(smtOnlineUploadVideoUnit)
                    }
                  }
                  const failObj = {}
                  const successObj = {}
                  const KEY_PREFIX = "SMT_UPLOAD_VIDEO"
                  this.itemIdList.forEach(item => {
                    if (res[KEY_PREFIX + item.itemId]) {
                      if (res[KEY_PREFIX + item.itemId].includes("失败")) {
                        failObj[item.itemId] = res[KEY_PREFIX + item.itemId]
                      }
                      if (res[KEY_PREFIX + item.itemId].includes("成功")) {
                        successObj[item.itemId] = true
                      }
                    }
                  })

                  if (JSON.stringify(failObj) !== "{}") {
                    this.itemIdList = this.itemIdList.filter(item => !successObj[item.itemId]).map(item => ({ ...item, failReason: failObj[item.itemId] }))
                  } else {
                    this.itemIdList = this.itemIdList.filter(item => !successObj[item.itemId])
                    if (!this.itemIdList.length) {
                      layer.closeAll()
                      $("#smt_online_search_submit").click()
                    }
                    // 选中的全部上传成功后，再提示
                    if(Object.keys(res).length === uploadArr.length){
                      layer.msg("上传成功，日志可查看结果", { icon: 1 })
                    }
                  }
                }
              })
              .catch(err => {
                console.log("err :>> ", err)
                if (smtOnlineUploadVideoUnit) {
                  clearInterval(smtOnlineUploadVideoUnit)
                }
              })
          }, 2000)
        },
        // 取消
        handleCancel() {
          layer.closeAll()
        },
      },
    })
  })
})(jQuery, layui, window, document)

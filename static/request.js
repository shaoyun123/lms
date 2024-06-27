var request = (function () {
  var request = {}
  /**
   * ajax请求封装
   * @param url 请求的接口地址
   * @param params 传递给后端的数据
   * @param ft 响应成功后的回调函数 callback
   * @param method 请求的方式 GET/POST/PUT/DELETE/..
   * @param async 是否异步请求 async的默认方式是true,即异步方式；async设置为false时,为同步方式
   * @param contentType 默认为: application/json; charset=UTF-8
   */
  request.sendAjax = function sendAjax (url, params, ft, method, async, contentType) {
    loading.show()
    layui.jquery.ajax({
      url: ctx + url,
      cache: false,
      async: async === undefined ? true : async,
      data: params,
      type: method === undefined ? 'POST' : method,
      contentType: contentType === undefined ? 'application/json; charset=UTF-8' : contentType,
      dataType: 'json',
      success: function (res) {
        loading.hide()
        if (typeof ft == 'function') {
          switch (res.code) {
            case '0000':
              if (ft != null && ft !== undefined) {
                ft(res)
              }
              break
            default:
              if (res.msg) {
                layer.msg(res.msg, { icon: 5 })
              } else {
                layer.msg('服务异常', { icon: 5 })
              }
              break
          }
        }
      }, error: function (XMLHttpRequest, textStatus, errorThrown) {
        layui.admin.load.hide()
        if (XMLHttpRequest.status == 200) {
          layer.msg('请重新登录', { icon: 7 })
        } else {
          layer.msg('服务器错误')
        }
      }
    })
  }
  return request
})(request, window)
/**
 * time: 2018/01/02
 */
var msg_develop_all_data_person = [];
var checkPerson = [];
var remarkDataList = []
layui.use(
  ["admin", "form", "table", "layer", "laytpl", "laydate", "formSelects"],
  function () {
    var admin = layui.admin,
      form = layui.form,
      table = layui.table,
      layer = layui.layer,
      laytpl = layui.laytpl,
      formSelects = layui.formSelects,
      $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    // 当前通用常量
    HeadCodeType = {
      lmsParamConfig: "LMS_PARAM_CONFIG", //参数配置
    };

    table.render({
      elem: "#bizDictDetailTable",
      method: "post",
      url: ctx + "/sysdict/searchBizDict.html",
      initSort: { field: "sort", type: "asc" },
      cols: [
        [
          { type: "checkbox" },
          { field: "sort", title: "排序", width: 50, sort: true },
          { field: "headCode", title: "头代码", width: 150 },
          { field: "name", title: "名称", width: 150 },
          { field: "code", title: "code", width: 150 },
          { field: "extend1", title: "扩展1" },
          { field: "extend2", title: "扩展2" },
          { field: "extend3", title: "扩展3" },
          { field: "note", title: "说明" },
          { field: "modifier", title: "修改人" },
          { field: "modifyTime", title: "修改时间", templet:"<div>{{Format(d.modifyTime, 'yyyy-MM-dd hh:mm:ss')}}</div>" },
          {
            title: "操作",
            width: 130,
            align: "center",
            toolbar: "#bizDictDetailBar",
          },
        ],
      ],
      done: function (res) {
        if (res.data && res.data[0].headCode == HeadCodeType.lmsParamConfig) {
          $("#bizDictDetailTable")
            .next()
            .find('thead tr th[data-field="extend1"] span')
            .text("参数值");
        }
      },
      page: true,
      id: "bizDictDetailTable",
      limits: [20, 50, 100],
      limit: 50,
    });

    // 搜索
    var active = {
      reload: function () {
        table.reload("bizDictDetailTable", {
          page: { curr: 1 },
          where: {
            headId: searchHeadId,
          },
        });
      },
    };

    $("#bizDictSearch").click(function () {
      var type = $(this).data("type");
      active[type] ? active[type].call(this) : "";
    });

    // remark div的双击事件
    layui.$(document).on('dblclick', '#remarkDivWrapper', function() {
      if(searchHeadId !== -1){
        const curRemarkItem = remarkDataList.find((v) => v.id === searchHeadId)
        $('#remarkDivDom').hide()
        $('#remarkInputDom').val(curRemarkItem.remark).show().focus();
      }
    });

    // remark输入框的blur事件
    layui.$(document).on('blur', '#remarkInputDom', function() {
      const inputVal = $('#remarkInputDom').val().trim()
     
      commonReturnPromise({
        url: '/lms/sysdict/updateRemarkByHeadId',
        type: 'post',
        params: {
          headId: searchHeadId,
          remark: inputVal
        }
      }).then(() => {
        layer.msg('修改成功!', {icon:1});
        $('#remarkInputDom').hide()
        $('#remarkDivDom').html(inputVal).show()
        const curRemarkItem = remarkDataList.find((v) => v.id === searchHeadId)
        if(curRemarkItem){
          curRemarkItem.remark = inputVal
        }
      })
    });

    //按钮的点击事件
    $("#addBizDictDetail").click(function () {
      checkPerson = [];
      if (searchHeadId == -1) {
        layer.msg("未选中字典头!");
        return;
      }
      var index = layer.open({
        type: 1,
        title: "添加自定义字典",
        area: ["800px", "600px"],
        shadeClose: false,
        btn: ["保存", "取消"],
        content: $("#addBizDictLayer").html(),
        success: function (layero) {
          $("#addBizDictForm input[name='headCode']").val(searchHeadCode);
          var objForm = $("#addBizDictForm");
          if (isEmailCode) {
            //如果是编辑邮箱
            $("#label_dict_task_email0").html("");
            $("#label_dict_task_msg_notice").html("");
            initEmailButtonClick();
          } else {
            $("#label_dict_task_email1").html("");
            if (isMsgDevelopNoticeCode) {
              //如果是开发通知
              initMsgPersonButtonClick();
              $("#label_dict_task_email0").html("");
              $("#label_dict_task_email1").html("");
              // initEmailButtonClick();
            } else {
              $("#label_dict_task_msg_notice").html("");
            }
          }

          //  当头代码值为HeadCodeType的 ‘LMS_PARAM_CONFIG’,部分label修改
          if (searchHeadCode == HeadCodeType.lmsParamConfig) {
            $("#label_dict_task_email0").find("label").first().html("参数值"); //扩展1改名称
          }

          // 店铺标签
          if(isStoreLabelCode){
            objForm.find(".inputCode").hide()
            objForm.find(".selectCode").show()
            commonReturnPromise({
              url: '/lms/unauditorder/listenum.html'
            }).then(res=>{
              const platCodes = res.platCodes || []
              const platCodesHtml = platCodes.map(item=>`<option value="${item}">${item}</option>`).join('')
              objForm.find("select[name=code]").html(platCodesHtml)
              objForm.find("input[name=code]").attr('lay-verify','')
              form.render('select','addBizDictForm')
            })
          }

          form.render("select");
        },
        yes: function (index, layero) {
          //判断输入框中是否存在中英文逗号
          let name = layero.find('[name=name]').val();
          let code = layero.find('[name=code]').val();
          let reg = /,+/g;
          if(reg.test(name) || reg.test(code)){
            return layer.msg('名称和code不允许包含逗号', {icon:5});
          }else{
            $("#addBizDict").click();
          }
        },
      });
    });

    form.on("submit(addBizDict)", function (data) {
      if (isEmailCode) {
        //如果是编辑邮箱标签
        var extend1 = data.field.extend1;
        if (extend1 == null || $.trim(extend1) == "") {
          layer.msg("请至少输入一个邮箱", { icon: 5 });
          return false;
        }
      }
      console.log(data.field);
      if (isMsgDevelopNoticeCode) {
        //如果是开发通知
        var platCodeselect = formSelects.value("msg_plat_code");
        var platCodeArr = [];
        for (var i in platCodeselect) {
          platCodeArr.push(platCodeselect[i].value);
        }
        data.field.extend1 = platCodeArr.join(",");
        data.field.remark = msg_develop_all_data_person.join(",");
      }
      data.field.code = $("#addBizDictForm").find('input[name=code]').val()
      if(isStoreLabelCode){
        data.field.code = $("#addBizDictForm").find('select[name=code]').val()
      }
      admin.load.show();
      $.ajax({
        type: "POST",
        url: ctx + "/sysdict/addOrEditBizDict.html", //请求接口地址
        dataType: "json",
        data: data.field, //需要post的数据
        success: function (res) {
          //后台程序返回数据
          admin.load.hide();
          if (res.code == "0000") {
            layer.closeAll();
            layer.msg("操作成功", { icon: 1 });
            $("#bizDictSearch").trigger("click");
          } else {
            layer.msg(res.msg);
          }
        },
      });
      return false;
    });

    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    table.on("tool(bizDictDetailTable)", function (obj) {
      var data = obj.data, //获得当前行数据
        layEvent = obj.event; //获得 lay-event 对应的值
      if (layEvent === "edit") {
        checkPerson = [];
        layer.open({
          type: 1,
          title: "编辑字典信息",
          area: ["1000px", "800px"],
          shadeClose: false,
          content: $("#addBizDictLayer").html(),
          success: function (layero, index) {
            getBizDict(data.id);
            form.render("select");
            form.render("radio");
            form.render("checkbox");
          },
          end: function () {
            $("#addBizDictForm").trigger("reset");
            $("#addBizDictForm").find("input[name='id']").val("");
          },
          btn: ["保存", "取消"],
          yes: function (index, layero) {
            //判断输入框中是否存在中英文逗号
            let name = layero.find('[name=name]').val();
            let code = layero.find('[name=code]').val();
            let reg = /,+/g;
            if(reg.test(name) || reg.test(code)){
              return layer.msg('名称和code不允许包含逗号', {icon:5});
            }else{
              $("#addBizDict").click();
            }

          },
        });
      } else if (layEvent === "del") {
        deleteBizDict(data.id);
      }
    });
    var emai_task_orgXTree;
    // 获取字典
    function getBizDict(id) {
      $.ajax({
        type: "POST",
        url: ctx + "/sysdict/getBizDictById.html",
        data: { id: id },
        async: false,
        dataType: "json",
        success: function (returnData) {
          if (returnData.code == "0000") {
            var obj = returnData.data.detail;
            if (isEmailCode) {
              //编辑邮箱字典
              $("#label_dict_task_msg_notice").html("");
              initEmailButtonClick();
              var users = returnData.data.users;
              if (users != null && users.length > 0) {
                for (var i = 0; i < users.length; i++) {
                  var item = {
                    value: users[i].userId,
                    text: users[i].userName + " (" + users[i].userEmail + ")",
                  };
                  $("#label_dict_taskEmail_text").tagsinput("add", item);
                }
              }
            } else {
              $("#label_dict_task_email1").html("");
              if (isMsgDevelopNoticeCode) {
                //如果是开发通知
                initMsgPersonButtonClick();
                $("#label_dict_task_email0").html("");
              } else {
                $("#label_dict_task_msg_notice").html("");
              }
            }
            var objForm = $("#addBizDictForm");
            objForm.find("input[name='id']").val(obj.id);
            objForm.find("input[name='headCode']").val(obj.headCode);
            objForm.find("input[name='name']").val(obj.name);
            objForm.find("input[name='code']").val(obj.code);
            // 店铺标签
            if(isStoreLabelCode){
              objForm.find(".inputCode").hide()
              objForm.find(".selectCode").show()
              commonReturnPromise({
                url: '/lms/unauditorder/listenum.html'
              }).then(res=>{
                const platCodes = res.platCodes || []
                const platCodesHtml = platCodes.map(item=>`<option value="${item}" ${item===obj.code ? 'selected' : ''}>${item}</option>`).join('')
                objForm.find("select[name=code]").html(platCodesHtml)
                form.render('select','addBizDictForm')
              })
            }
            //  当头代码值为HeadCodeType的 ‘LMS_PARAM_CONFIG’ name和code不允许修改,部分label修改
            if (obj.headCode == HeadCodeType.lmsParamConfig) {
              objForm.find("input[name='name']").prop("disabled", true);
              objForm.find("input[name='name']").addClass("layui-disabled");
              objForm.find("input[name='code']").prop("disabled", true);
              objForm.find("input[name='code']").addClass("layui-disabled");
              $("#label_dict_task_email0").find("label").first().html("参数值"); //扩展1改名称
            }
            objForm.find("input[name='extend2']").val(obj.extend2);
            objForm.find("input[name='extend3']").val(obj.extend3);
            if (isMsgDevelopNoticeCode) {
              if (obj.extend1) {
                var arr = obj.extend1.split(",");
                setTimeout(function () {
                  layui.formSelects.value("msg_plat_code", arr);
                }, 1000);
              }
              if (obj.extend2) {
                checkPerson = obj.remark.split(",");
              }
            } else {
              objForm.find("input[name='extend1']").val(obj.extend1);
            }
            objForm.find("input[name='sort']").val(obj.sort);
            objForm.find("input[name='note']").val(obj.note);
          } else {
            layer.msg(returnData.msg, { icon: 5 });
          }
        },
        error: function () {
          layer.msg("服务器正忙");
        },
      });
    }

    function initMsgPersonButtonClick() {
      loading.show();
      //平台列表
      $.ajax({
        type: "post",
        url: ctx + "/msgDevelopmentNotice/getPlatCodeDict.html",
        dataType: "json",
        data: {},
        success: function (returnData) {
          loading.hide();
          var arr = [];
          returnData.data.forEach(function (val) {
            var obj = {};
            obj.name = val;
            obj.value = val;
            arr.push(obj);
          });
          //渲染下拉框
          formSelects.data("msg_plat_code", "local", {
            arr: arr,
          });
        },
      });
      /**
       * 人员树按钮点击事件
       */
      $("#label_dict_edit_msg_user").click(function () {
        msg_develop_all_data_person = [];
        console.log("dianji");
        loading.show();
        $.ajax({
          type: "post",
          url: ctx + "/msgDevelopmentNotice/getSkuPlatCode.html",
          dataType: "json",
          data: { prodSku: "9999" },
          success: function (returnData) {
            loading.hide();
            if (returnData.code == "0000") {
              var index = layer.open({
                type: 1,
                title: "选择销售平台人员",
                area: ["45%", "45%"],
                btn: ["保存", "关闭"],
                content: $("#label_dict_org_layer").html(),
                success: function (layero, index) {
                  emai_task_orgXTree = new layuiXtree({
                    elem: "emai_task_orgXTree", //(必填) 放置xtree的容器id，不要带#号,
                    form: form, //(必填) layui 的 from,
                    isopen: false, //加载完毕后的展开状态
                    ckall: true, //启用全选功能，默认值：false
                    data: returnData.data.orgList, //(必填) json数组
                    color: {
                      //三种图标颜色，独立配色，更改几个都可以
                      open: "#EE9A00", //节点图标打开的颜色
                      close: "#EEC591", //节点图标关闭的颜色
                      end: "#828282", //末级节点图标的颜色
                    },
                    click: function (data) {
                      //节点选中状态改变事件监听，全选框有自己的监听事件
                    },
                  });
                  emai_task_orgXTree.render();
                  if (checkPerson) {
                    for (var i in checkPerson) {
                      emai_task_orgXTree.setCheckedByValue(checkPerson[i]); // 默认勾选一选择类目
                      if (checkPerson[i].indexOf("joom") > -1) {
                        emai_task_orgXTree.setCheckedByValue("joom专员");
                      }
                      if (checkPerson[i].indexOf("ebay") > -1) {
                        emai_task_orgXTree.setCheckedByValue("ebay专员");
                      }
                      if (checkPerson[i].indexOf("shopee") > -1) {
                        emai_task_orgXTree.setCheckedByValue("shopee专员");
                      }
                      if (checkPerson[i].indexOf("wish") > -1) {
                        emai_task_orgXTree.setCheckedByValue("wish专员");
                      }
                      if (checkPerson[i].indexOf("amazon") > -1) {
                        emai_task_orgXTree.setCheckedByValue("amazon专员");
                      }
                      if (checkPerson[i].indexOf("lazada") > -1) {
                        emai_task_orgXTree.setCheckedByValue("lazada专员");
                      }
                      if (checkPerson[i].indexOf("fyndiq") > -1) {
                        emai_task_orgXTree.setCheckedByValue("fyndiq专员");
                      }
                      if (checkPerson[i].indexOf("smt") > -1) {
                        emai_task_orgXTree.setCheckedByValue("smt专员");
                      }
                    }
                  }
                },
                yes: function (index1, layero) {
                  var objForm = $("#addBizDictForm");
                  var choosePerson = [];
                  var todoPerson = [];
                  var develop_msg_select_person_dict =
                    emai_task_orgXTree.GetAllChecked();
                  console.log(develop_msg_select_person_dict);
                  if (
                    develop_msg_select_person_dict == null ||
                    develop_msg_select_person_dict.length == 0
                  ) {
                    //没有选择销售人员
                    layer.close(index);
                    objForm
                      .find("input[name='extend2']")
                      .val(choosePerson.join(","));
                    return false;
                  } else {
                    for (var i in develop_msg_select_person_dict) {
                      var title = develop_msg_select_person_dict[i].title;
                      var value =
                        develop_msg_select_person_dict[i].value ||
                        develop_msg_select_person_dict[i];
                      if (value.indexOf("user") != -1) {
                        //用户节点
                        todoPerson.push(value);
                        if (choosePerson.indexOf(title) == -1) {
                          choosePerson.push(title);
                        }
                      }
                    }
                    console.log(choosePerson);
                    objForm
                      .find("input[name='extend2']")
                      .val(choosePerson.join(","));
                    msg_develop_all_data_person = todoPerson;
                  }
                  layer.close(index);
                },
              });
            } else {
              layer.msg(returnData.msg);
            }
            loading.hide();
          },
        });
      });
    }

    function initEmailButtonClick() {
      $("#label_dict_task_email0").html("");
      $("#label_dict_taskEmail_text").tagsinput({
        itemValue: "value",
        itemText: "text",
      });
      $("#label_dict_taskEmail_text").tagsinput("removeAll");
      $("#label_dict_edit_email_user").click(function () {
        var index = layer.open({
          type: 1,
          title: "编辑定时任务邮箱人员",
          area: ["45%", "60%"],
          btn: ["保存", "关闭"],
          content: $("#label_dict_org_layer").html(),
          success: function (layero, index) {
            reloadEmailOrgTree($("#label_dict_taskEmail_text").val());
          },
          yes: function (index, layero) {
            var eamilPerson = emai_task_orgXTree.GetAllChecked();
            $("#label_dict_taskEmail_text").tagsinput("removeAll");
            var userIds = [];
            if (eamilPerson != null && eamilPerson.length > 0) {
              for (var i = 0; i < eamilPerson.length; i++) {
                var value = eamilPerson[i].value;
                if (value.indexOf("user") != -1) {
                  //用户节点
                  var user = value.split("&");
                  var userId = user[1];
                  var userEmail = user.length > 2 ? user[3] : "";
                  var item = {
                    value: userId,
                    text: user[2] + " (" + userEmail + ")",
                  };
                  $("#label_dict_taskEmail_text").tagsinput("add", item);
                  userIds.push(userId);
                }
              }
            }
            if (userIds.length > 0) {
              reloadEmailOrgTree(userIds.join(","));
            } else {
              reloadEmailOrgTree("");
            }
            layer.close(index);
          },
        });
      });
    }
    /**
     * 重新渲染组织树
     */
    function reloadEmailOrgTree(userIds) {
      $.ajax({
        type: "POST",
        url: ctx + "/sysdict/reloadEmailOrgTree.html",
        data: { userIds: userIds },
        dataType: "json",
        success: function (returnData) {
          if (returnData.code == "0000") {
            var dataOrgList = returnData.data;
            emai_task_orgXTree = new layuiXtree({
              elem: "emai_task_orgXTree", //(必填) 放置xtree的容器id，不要带#号,
              form: form, //(必填) layui 的 from,
              isopen: false, //加载完毕后的展开状态
              ckall: false, //启用全选功能，默认值：false
              data: dataOrgList, //(必填) json数组
              color: {
                //三种图标颜色，独立配色，更改几个都可以
                open: "#EE9A00", //节点图标打开的颜色
                close: "#EEC591", //节点图标关闭的颜色
                end: "#828282", //末级节点图标的颜色
              },
            });
            emai_task_orgXTree.render();
          } else {
            layer.msg(returnData.msg, { icon: 5 });
          }
        },
      });
    }
    //删除
    function deleteBizDict(id) {
      layer.confirm("是否删除此数据？", function (result) {
        if (result) {
          $.ajax({
            url: ctx + "/sysdict/delBizDict.html",
            data: { ids: id },
            dataType: "json",
            success: function (returnData) {
              if (returnData.code == "0000") {
                layer.closeAll();
                layer.msg("删除成功", { icon: 1 });
                $("#bizDictSearch").trigger("click");
              } else {
                layer.msg(returnData.msg);
              }
            },
            error: function () {
              layer.msg("服务器正忙");
            },
          });
        }
      });
    }
    //点击按钮弹出添加字典头信息弹框
    $("#addBizHeadBtn").click(function () {
      var index = layer.open({
        type: 1,
        title: "添加自定义字典头",
        shadeClose: false,
        area: ["800px", "600px"],
        content: $("#bizDictheadLayer").html(),
        success: function () {
          form.render("select");
          form.render("checkbox");
        },
        end: function () {
          //关闭时清空表格内容
          $("#addBizDictHeadForm")[0].reset();
        },
        btn: ["保存", "取消"],
        yes: function (index, layero) {
          var addBizDictHead = layero.find("#addBizDictHead");
          addBizDictHead.click();
        },
      });
    });

    //添加字典头
    form.on("submit(addBizDictHead)", function (data) {
      data.field.isFixed = false;
      data.field.isNumber = false;
      if ($("#addBizDictHeadForm input[name='isFixed']").is(":checked")) {
        data.field.isFixed = true;
      }
      if ($("#addBizDictHeadForm input[name='isNumber']").is(":checked")) {
        data.field.isNumber = true;
      }
      $.ajax({
        type: "post",
        url: ctx + "/sysdict/addBizDictHead.html",
        dataType: "json",
        data: data.field,
        success: function (returnData) {
          if (returnData.code == "0000") {
            layer.closeAll();
            active["reload"].call();
            layer.msg("添加字典头成功");
          } else {
            layer.msg(returnData.msg);
          }
        },
        error: function () {
          layer.msg("发送请求失败");
        },
      });
      return false;
    });

    //加载所有字典头
    getBizDictHeads();
    function getBizDictHeads() {
      $("#leftSearchDiv li:gt(0)").remove();
      $.ajax({
        type: "post",
        url: ctx + "/sysdict/getAllBizDictHead.html",
        dataType: "json",
        success: function (returnData) {
          if (returnData.code == "0000") {
            // 将headId和remark保存起来
            remarkDataList = returnData.data.map((v) => {
              return {
                id: v.id,
                remark: v.remark || ''
              }
            })
            var appendStr = "";
            var one;
            for (var i = 0; i < returnData.data.length; ++i) {
              one = returnData.data[i];
              appendStr +=
                `<li class="layui-nav-item">
                <a onclick="searchTag(${one.id},'${one.headCode}',this)">${one.name}</a>
                ${
                  (function(){
                      if($('.labeldict_checkAccessTokenPermExist').length){
                          return `<span class="labeldict-authBtn" data-id="${one.id}" data-name="${one.name}">授权</span>`;
                      }else{
                          return '';
                      }
                  })()
                }
                </li>`;
            }
            $("#leftSearchDiv").append(appendStr);
            form.render();
          } else {
            layer.msg(returnData.msg);
          }
        },
      });
    }
    //tbody页面
    function labeldict_authUserLayerTbody(data){
        let trStr = '';
        for(let i=0; i<data.length; i++){
          let item = data[i];
          let tr = `<tr>
          <td>${item.userName}</td>
          <td>${item.name}</td>
          <td><span class="layui-btn layui-btn-xs cancelBtn" data-id="${item.userId}">取消授权</span></td>
        </tr>`;
          trStr += tr;
        }
        return trStr;
    }
    //监听点击事件
    $(body).on('click', '.labeldict-authBtn', function(){
      let id = $(this).attr('data-id');
      let headName = $(this).attr('data-name');
      Promise.all([commonTasktimeAndDict_listAllUserAjax(), commonTasktimeAndDict_queryByResourceValAjax(id, 'BIZ_DICT_HEAD')]).then(res => {
        let userList = res[0] || [];
        let tableList = res[1] || [];
        let obj = {
          userList: userList,
          tableList: tableList
        };
        layer.open({
          type: 1,
          title: '授权用户---'+headName,
          area: ['50%', '80%'],
          content: $('#labeldict_authUserLayer').html(),
          id: 'labeldict_authUserLayerId',
          success: function(layero,index){
            let getTpl = labeldict_authUserLayerContainerTpl.innerHTML,
            view = document.getElementById('labeldict_authUserLayerContainer');
            laytpl(getTpl).render(obj, function(html) {
                view.innerHTML = html;
                formSelects.render('storeAndPlatCodeAuthLayer_xmLabeldict');
                //功能操作
                layero.on('click', '.addAuthBtn', function(){
                  let val = formSelects.value('storeAndPlatCodeAuthLayer_xmLabeldict');
                  if(val.length == 0){
                    return layer.msg('请先选择需要新增的数据', {icon:7});
                  }
                  let idsArr = val.map(item => item.val);
                  commonTasktimeAndDict_AddPermissionAjax(id, idsArr.join(','),'BIZ_DICT_HEAD').then(addRes => {
                    layer.msg(addRes || '操作成功', {icon: 1});
                    formSelects.value('storeAndPlatCodeAuthLayer_xmLabeldict', []);
                    //重新渲染表格[重新请求结果]
                    commonTasktimeAndDict_queryByResourceValAjax(id,'BIZ_DICT_HEAD').then(queryRes => {
                      let tbodyHtml = labeldict_authUserLayerTbody(queryRes);
                      layero.find('tbody').empty().html(tbodyHtml);
                    });
                  });
                });
                //取消授权
                layero.on('click', '.cancelBtn', function(){
                  let itemId = $(this).attr('data-id');
                  let that = this;
                  layer.confirm('确定取消授权吗?', {icon: 3, title:'提示'}, function(index){
                    commonTasktimeAndDict_cancelPermissionAjax(id, itemId,'BIZ_DICT_HEAD').then(cancelRes => {
                      layer.close(index);
                      layer.msg(cancelRes || '操作成功', {icon: 1});
                      //重新渲染表格[删除当前行]
                      $(that).parents('tr').remove();
                    })
                  });
                });
            });
          }
        });
      });
    });
  }
);

/*侧边栏的点击事件*/
var searchHeadId = -1;
var isEmailCode = false;
var isStoreLabelCode = false //店铺标签

var isMsgDevelopNoticeCode = false;

var searchHeadCode = "";
function searchTag(headId, headCode, t) {
  if (typeof id == undefined) {
    return;
  }
  searchHeadId = headId;
  // 点击 展示remark
  if(searchHeadId !== -1){
    const curRemarkItem = remarkDataList.find((v) => v.id === searchHeadId)
    $('#remarkDivDom').html(curRemarkItem.remark)
  }
  searchHeadCode = headCode;
  if (headCode != null && headCode == "TASK_EMAIL") {
    isEmailCode = true;
  } else {
    isEmailCode = false;
  }
  if (headCode != null && headCode == "DEVELOPMENT_NOTICE_MSG") {
    checkPerson = [];
    isMsgDevelopNoticeCode = true;
  } else {
    checkPerson = [];
    isMsgDevelopNoticeCode = false;
  }
  if(headCode != null && headCode == "STORE_LABEL"){
    isStoreLabelCode = true;
  }else{
    isStoreLabelCode = false;
  }
  $("#leftSearchDiv .layui-this").removeClass("layui-this");
  $(t).addClass("layui-this");
  $("#bizDictSearch").trigger("click");
}

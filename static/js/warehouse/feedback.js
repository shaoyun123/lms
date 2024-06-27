// console.log("feedback")
var imgArr = [];
layui.use(['admin', 'form', 'table', 'laydate', 'laytpl', 'element', 'upload'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        form = layui.form,
        upload = layui.upload,
        laytpl = layui.laytpl;
    element.render('collapse');
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');

    //远程搜索功能
    var dim = new DimSearch('#feed_searchSupplier', 'feed_supplierId');
    dim.init();
    var issueTypeList;

    /**
     * 在线下线选项卡改变
     */
    var auditStatus = 0;
    element.on('tab(feedback_tab_filter)', function(data) {
        let index = data.index;
        if (index === 1) {
            $('#main_modify_btn_f').removeClass('d-none')
        }else{
            $('#main_modify_btn_f').addClass('d-none')
        }
        if(index ===1){
            $('#feedback_main_modify_btn_cencel').addClass('d-none')
        }else{
            $('#feedback_main_modify_btn_cencel').text(index==0 ? '取消' : '转待审核')
            $('#feedback_main_modify_btn_cencel').removeClass('d-none')
        }
        // 取消状态下,部分按钮不显示
        if(index === 2 ){
            // 批量修改反馈
            $('#main_modify_btn_problem').addClass('d-none')
        }else{
            $('#main_modify_btn_problem').removeClass('d-none')
        }
        if(index===0){
            // 批量审核
            $('#fb_feedback_btn_audit').removeClass('d-none')
        }else{
            $('#fb_feedback_btn_audit').addClass('d-none')
        }
        auditStatus = $(this).attr("auditStatus");
        $("#fb_search_form").click();
    });

    //平台人员,店铺
    feedback_getPersonAndOrgsByRole();
    function feedback_getPersonAndOrgsByRole() {
      //获取到需要渲染的元素
      let formDom = $('#fb_searchForm');
      let userSelect = formDom.find('.users_hp_custom');
      let orgSelect = formDom.find('.orgs_hp_custom');
      let roleNames = userSelect.data('rolelist');
      // 发送请求获取相应人员信息及其对应组织
      $.ajax({
          type: 'post',
          url: ctx + '/sys/getPersonAndOrgsByRole.html',
          dataType: 'json',
          data: {roleNames: roleNames},
          success: function (returnData) {
              userSelect.empty();
              orgSelect.empty();
              if (returnData.code == '0000') {
                  var data
                  data = returnData.data
                  // 初始化部门
                  orgSelect.append(getAOption('', ''));
                  for (var i in data.orgTree) {
                      setOrgs(data.orgTree[i], orgSelect, 0)
                  }

                  // 初始化展示所有人员
                  var userJSON = dealUser_org(data.userList)
                  userSelect.append(getAOption('', ''));
                  for (var i = 0; i < userJSON.all.length; ++i) {
                      userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                  }
                  // 部门选择联动事件
                  form.on("select(feedbackOrganizeFilter)", function (data) {
                      //选择部门下的用户
                      userSelect.html('')
                      var orgId = data.value
                      var userList = userJSON[orgId]
                      if (orgId != '') {
                          userSelect.append(getAOption('', ''));
                          if (userList) {
                              for (var i = 0; i < userList.length; ++i) {
                                  userSelect.append(getAOption(userList[i].id, userList[i].userName))
                              }
                          }
                      } else {
                          userSelect.append(getAOption('', ''))
                          for (var i = 0; i < userJSON.all.length; ++i) {
                              userSelect.append(getAOption(userJSON.all[i].id, userJSON.all[i].userName))
                          }
                      }

                      form.render('select');
                  })
                  form.render('select');
              } else {
                  layer.msg(returnData.msg)
              }
          },
          error: function () {
              layer.msg('发送请求失败')
          }
      })
    }

     //监听iframe传参
    window.addEventListener('message', function(event){
        console.log('iframe传来的数据是', event.data)
        let { issueType, isHandle, isSale, ifManager } = event.data
        if (issueType || isHandle || isSale) {
            $("input[name='issueType']").val(issueType) 
            $('#prod_is_handle').val(isHandle)
            $('#prod_is_seales').val(isSale)

            if (ifManager == 'false') {
                var username = localStorage.getItem('lmsAppUserName');
                $("input[name='buyer_f']").val(username)
            }
            form.render()
            setTimeout(() => {
                $("#fb_search_form").click();
            }, 0)
        }
    });

    // 初始化 开发专员查询项为 当前登录人
    initPersonCondition(['开发专员'],['开发组长', '开发主管'],$('#fb_searchForm [name=feedbackDeverId]'), 'id')
    
    form.on('radio(handle_status)', function (obj) {
        if (obj.value !== '1' && obj.value !== '3') {
            $('#operateEl').hide()
        } else {
            $('#operateEl').show()
        }
    })

    //初始化下拉框数据
    $(function() {
        $.ajax({
            url: ctx + '/warehouseProblemController/selectWarehouseProblemSelect.html',
            type: 'GET',
            dataType: "json",
            success: function(returnData) {
                if (returnData.code == '0000') {
                    issueTypeList = returnData.data.issueTypeList;
                    initHpSelect('#fb_searchForm');
                    for (var i in returnData.data) {
                        append_li(i, returnData.data[i]);
                    }
                }
            }
        })
    });
    //下拉框数据填入
    function append_li(domName, obj) {
        for (var i in obj) {
            if (obj[i]) {
                if (typeof obj[i] == 'string') {
                    var $li = '<li data-value="' + i + '" hp-select-li>' + obj[i] + '</li>'
                } else if (obj[i].userName) {
                    var $li = '<li data-value="' + obj[i].id + '" hp-select-li>' + obj[i].userName + '</li>'
                } else {
                    var $li = '<li data-value="' + obj[i].id + '" hp-select-li>' + obj[i].name + '</li>'
                }
            } else {
                var $li = '<li data-value="-1" hp-select-li>没有数据</li>'
            }
            $('#' + domName).append($li);
        }
    }

    // 清空表单
    $('#fb_clean').click(function() {
        $("#fb_searchForm input").each(function(index, item) {
            if ($(item).attr('placeholder') !== "请选择") {
                $(item).val("");
            }
        });
        return false
    });

    //查询表单
    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#feedback_table_f",
        method: "POST",
        url: ctx + "/warehouseProblemController/selectWarehouseProblem.html",
        page: true,
        where: { auditStatus: auditStatus },
        limits: [10, 50, 100, 300], // 每页条数的选择项
        limit: 50, //默认显示50条
        cols: [
            [{
                type: "checkbox",
                width: "2%"
            }, {
                field: "imgUri",
                title: "缩略图",
                templet: "#fb_imageTpl",
                width: "5%"
            }, {
                field: "sku",
                title: "SKU",
                templet: "#fb_sku",
                width: "10%"
            }, {
                field: "title",
                title: "商品",
                width: "9%",
                templet: "#fb_productName_f"
            }, {
                field: "sumTotalSales",
                title: "人员",
                templet: '#fb_employee',
                width: "6%"
            }, {
                field: "sumWeeklySales",
                title: "规格",
                templet: '#fb_style',
                width: 120
            }, {
                field: "purchaseCostPrice",
                title: "成本(￥)",
                templet: '#fb_price',
                width: "6%"
            }, {
                field: "score",
                title: "销量",
                templet: '#fb_sales',
                width: "5%"
            }, {
                field: "storageNum",
                title: "采购量",
                templet: '#fb_storage_num',
                width: "5%"
            }, {
                field: "supplier",
                title: "供应商",
                templet: '#amaonz_purchase_url',

                width: "5%"
            }, {
                field: "pSku",
                title: "时间",
                templet: '#fb_time',
                width: "7%"
            }, {
                field: "issueType",
                title: "问题类型",
                width: "5%"
            }, {
                field: "devNote",
                title: "反馈图片",
                templet: '#feedback_img'
            }, {
                field: "issueRemark",
                title: "问题备注",
                width: "8%"
            }, {
                field: "handleRemark",
                title: "处理备注",
                templet: '#fb_handleRemark',
                width: "8%"
            }, {
                title: "操作",
                toolbar: '#fb_operation',
                width: "5%"
            }, ],
        ],
        id: 'feedback_table_f',
        created: function(res) {
            if (auditStatus == 0) {
                $("#feedback_notAuditNum").text(res.count);
            } else if (auditStatus == 1) {
                $("#feedback_auditNum").text(res.count);
            }else if(auditStatus == 2){
                $('#feedback_cancelNum').text(res.count)
            }
        },
        done: function(res) {
            imageLazyload();
            // console.log('测试懒加载是否生效')
            theadHandle().fixTh({ id: '#feedbackCard' });

        }
    });
    //封装搜索参数
    function searchDate() {
        var obj = {};
        obj.auditStatus = auditStatus;
        obj.prodPSkuList = [];
        obj.prodSSkuList = [];
        obj.handleStatus = "";
        obj.startTime = "";
        obj.prodSSku = "";
        obj.pSku = "";
        obj.skuSerch = [];
        obj.pSkuSerch = [];
        obj.bizzOwnerIdList = "";
        obj.buyer = "";
        obj.creator = "";
        obj.responsor = "";
        obj.handler = "";
        obj.title = "";
        obj.issueRemark = "";
        obj.handleRemark = "";
        obj.issueType = "";
        obj.endTime = "";
        obj.timeType = "";
        obj.supplierId = "";
        obj.packDesc = "";

        var skuType = $("#search_sku_type_f option:selected").val()
        var sku = $("#search_prod_sku_f").val();
        if (sku != null && sku != '') {
            if (skuType == 0) {
                //obj.prodSSku = $("#search_prod_sku_f_f").val();
                obj.prodSSkuList = $.trim(sku.split(","));
            } else if (skuType == 1) {
                //obj.pSku = $("#search_prod_sku_f_f").val();
                obj.prodPSkuList = $.trim(sku.split(","));
            } else if (skuType == 2) {
                //obj.skuSerch = $("#search_prod_sku_f_f").val();
                obj.skuSerch = $.trim(sku.split(","));
            } else if (skuType == 3) {
                //obj.pSkuSerch = $("#search_prod_sku_f_f").val();
                obj.pSkuSerch = $.trim(sku.split(","));
            }
        }
        let feedbackOrganize = $('#fb_searchForm [name=feedbackOrganize]').val();
        let feedbackDeverId = $('#fb_searchForm [name=feedbackDeverId]').val();
        if(feedbackDeverId){
          obj.bizzOwnerIdList = feedbackDeverId;
        }else{
          //循环一下获取所有的id,然后赋值给bizzOwnerIdList
          let deversIdList = []
          let options = $('#fb_searchForm [name=feedbackDeverId] option')
          let value;
          for (var i = 0; i < options.length; ++i) {
              value = options[i].getAttribute('value')
              if (value) {
                deversIdList.push(value)
              }
          }
          if(!feedbackOrganize){
            obj.bizzOwnerIdList = '';
          }else{
            obj.bizzOwnerIdList = deversIdList.join(',')
          }
        }
        obj.buyer = $("input[name='buyer_f']").val();
        obj.creator = $("input[name='creaor_f']").val();
        obj.responsor = $("input[name='responsor_f']").val();
        obj.handler = $("input[name='handler_f']").val();
        var testType = $("#search_test_type_f option:selected").val();
        if (testType == 0) {
            obj.title = $("#search_test_val_f").val();
        } else if (testType == 1) {
            obj.issueRemark = $("#search_test_val_f").val();
        } else if (testType == 2) {
            obj.handleRemark = $("#search_test_val_f").val();
        }
        obj.issueType = $("input[name='issueType']").val();
        var handle = $("#prod_is_handle option:selected").val();
        obj.handleStatus = handle;
        var timeArr = $("input[id='reqire_time']").val().split(' - ');
        if (timeArr != "" && timeArr.length > 0) {
            obj.startTime = timeArr[0] + ' 00:00:00';
            obj.endTime = timeArr[1] + ' 23:59:59';
        }
        obj.timeType = $("#search_time_type_f").val();
        obj.supplierId = $("#feed_supplierId").val(); //供应商id
        obj.sortType = $("#prod_sort_type option:selected").val(); //排序方式
        obj.isSales = $("#prod_is_seales option:selected").val(); //状态
        obj.packDesc = $("#packDesc option:selected").val(); // 入库要求
        return obj;
    }

    /**
     * 查询
     */
    $("#fb_search_form").click(function() {
        //执行重载
        table.reload('feedback_table_f', {
            page: {
                curr: 1 //从第一页开始
            },
            where: searchDate(),
        });
        return false;
    });

    lay('#reqire_time').each(function() {
        laydate.render({
            elem: this,
            trigger: 'click',
            range: true
        })
    });
    var id_arr = [];
    //监听表格复选框选择
    table.on('checkbox(feedback-table-filter)', function(obj) {
        var checkStatus = table.checkStatus('feedback_table_f'),
            date = checkStatus.data;
        id_arr = date;
        console.log(id_arr)
    });

    /**
     * 取消
     */
    $("#feedback_main_modify_btn_cencel").click(function() {
        const checkedData = table.checkStatus('feedback_table_f').data
        if (checkedData <= 0) {
            layer.msg("请选择需要处理的数据", { icon: 2 })
            return;
        }
        const targetStatusObj= {
            0: 2, // 待审核-》取消
            2: 0 // 取消-》待审核
        }
        const params = {
            idList: checkedData.map(item=>item.id),
            targetStatus: targetStatusObj[auditStatus]
        }
        // targetStatu为目标状态（0未审核、1已审核、2取消）
        commonReturnPromise({
            url: '/lms/warehouseProblemController/update/status',
            type: 'post',
            params: JSON.stringify(params),
            contentType: 'application/json',
        }).then(res=>{
            const title = auditStatus == 0 ? '取消结果：' : '转待审核结果：'
            admin.batchResultObjAlert(title, res, function () {
                //更新表格
                $("#fb_search_form").click();
            });
        })
    });
    /**
     * 批量处理
     */
    $("#main_modify_btn_f").click(function() {
        if (id_arr <= 0) {
            layer.msg("请选择需要处理的数据", { icon: 2 })
            return;
        }
        let pSku = id_arr[0]?.pSku
        // 判断是否为同一个父sku
        // let isSame = id_arr.every(item => {
        //     return item.pSku === pSku
        // })
        // if (!isSame) {
        //     layer.msg("请选择相同父SKU的数据进行处理", { icon: 2 })
        //     return;
        // }
        let data = id_arr
        layer.open({
            type: 1,
            title: "处理",
            area: ["60%", "50%"],
            btn: ['提交', '关闭'],
            shadeClose: false,
            content: $("#warehouse_feedback_handle_layer").html(),
            id: 'warehouse_feedback_handle_layerId',
            success: function() {
                var getTpl = warehouse_feedback_handle_containerTpl.innerHTML,
                    view = document.getElementById('warehouse_feedback_handle_container');
                laytpl(getTpl).render(id_arr[0], function(html) {
                    view.innerHTML = html;
                    form.render();
                    if (id_arr[0].handleStatus !== 1 && id_arr[0].handleStatus !== 3) {
                        $('#operateEl').hide()
                    } else {
                        $('#operateEl').show()
                    }
                });
            },
            yes: function(index) {
                let form = $('#warehouse_feedback_handle_form').serializeObject();
                if (form.handleStatus == 1) {
                    // 判断是否为同一个父sku
                    let isSame = id_arr.every(item => {
                        return item.pSku === pSku
                    })
                    if (!isSame) {
                        layer.msg("请选择相同父SKU的数据进行处理", { icon: 2 })
                        return;
                    }
                }
                let arr = []
                // console.log('formData', formData);
                id_arr.forEach(item => {
                    var formData = $('#warehouse_feedback_handle_form').serializeObject();
                    formData.id = item.id;
                    if (formData.handleStatus == 3) {
                        formData.isModifyHandler = true;
                    }
                    arr.push(formData)
                })
                commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: `/lms/warehouseProblemController/updateWarehouseProblemV2.html`,
                    params: {
                        obj: JSON.stringify(arr)
                    }
                }).then(res => {
                    if (res?.failNum === 0) {
                        layer.msg('保存成功', { icon: 1 });
                        layer.close(index);
                    }
                    if (res?.failNum !== 0) {
                        let str = `批量处理${res.totalNum}条数据，成功${res.successNum}条，失败${res.failNum}条。`
                        let msg = res.failResults && res.failResults.join(',')
                        layer.msg(str + msg, { icon: 2 });
                    }
                    
                    $('#fb_search_form').click();
                }).catch(err => {
                    console.log('err', err);
                    // layer.alert(err, { icon: 2 });
                })
            }
        });
        // layer.open({
        //     type: 1,
        //     title: "处理",
        //     area: ["60%", "50%"],
        //     btn: ['提交', '关闭'],
        //     shadeClose: false,
        //     content: $("#warehouse_feedback_handle_layer").html(),
        //     id: 'warehouse_feedback_handle_layerId',
        //     yes: function(index, layero) {
        //         loading.show();
        //         var data = {};
        //         data.id_arr = id_arr;
        //         data.handleStatus = $('#handle_form_f input[name="handle_state"]:checked').val();
        //         data.handleRemark = $('#handle_form_f textarea').val();
        //         data.isModifyHandler = $('#handle_form_f input[name="is_modify_handler"]:checked').val();
        //         data.extraPackingCharge = $("#extra_pack_money").val();
        //         //提交处理接口
        //         $.ajax({
        //             type: "POST",
        //             url: ctx + "/warehouseProblemController/updateMainWarehouseProblem.html",
        //             data: { 'obj': JSON.stringify(data) },
        //             async: true,
        //             dataType: "JSON",
        //             success: function(data) {
        //                 layer.msg(data.msg, { icon: 1, time: 5000 });
        //             }
        //         });
        //         loading.hide();

        //     },
        //     success: function() {
        //         form.render('radio');
        //     },
        //     end: function() {
        //         table.reload('feedback_table_f', {
        //             page: {
        //                 curr: 1 //从第一页开始
        //             },
        //             where: searchDate(),
        //         });
        //     }
        // });

    });
    /**
     * 批量修改问题反馈
     */
    $("#main_modify_btn_problem").click(function() {
        if (id_arr <= 0) {
            layer.msg("请选择需要修改的反馈", { icon: 2 })
            return;
        }
        layer.open({
            type: 1,
            title: "处理",
            area: ["60%", "50%"],
            btn: ['提交', '关闭'],
            shadeClose: false,
            content: $("#main_modify_problem").html(),
            yes: function(index, layero) {
                loading.show();
                var data = {};
                data.id_arr = id_arr;
                data.issueType = $("select[name='issue_type_main'] option:selected").text();
                data.issueRemark = $("textarea[name='issue_remark_main']").val();
                //提交处理接口
                $.ajax({
                    type: "POST",
                    url: ctx + "/warehouseProblemController/modifyMainWarehouseProblem.html",
                    data: { 'obj': JSON.stringify(data) },
                    async: true,
                    dataType: "JSON",
                    success: function(data) {
                        layer.msg(data.msg, { icon: 1, time: 5000 });
                    }
                });
                loading.hide();

            },
            success: function() {
                for (var i in issueTypeList) {
                    $("select[name='issue_type_main']").append("<option value='" + i + "'>" + issueTypeList[i].name + "</option>");
                }
                form.render('select');
            },
            end: function() {
                table.reload('feedback_table_f', {
                    page: {
                        curr: 1 //从第一页开始
                    },
                    where: searchDate(),
                });
            }
        });

    });

    /**
     * 批量审核
     */
    $("#fb_feedback_btn_audit").click(function() {
        if (id_arr <= 0) {
            layer.msg("请选择需要审核的反馈", { icon: 2 })
            return;
        }
        layer.open({
            title: '确认审核',
            content: '确认审核当前选中的' + id_arr.length + "条数据？",
            yes: function(index, layero) {

                var data = [];
                for (let i = 0; i < id_arr.length; i++) {
                    data.push(id_arr[i].id);
                }
                console.log("--------------------");
                //do something
                layer.close(index); //如果设定了yes回调，需进行手工关闭
                $.ajax({
                    method: "POST",
                    url: ctx + "/warehouseProblemController/batchAudit.html",
                    data: { "obj": JSON.stringify({ "idList": data }) },
                    success: function(response) {
                        var parse = response
                        if (parse.code === "0000") {
                            admin.batchResultObjAlert('审核结果', response.data, function () {
                                //更新表格
                                $("#fb_search_form").click();
                            });
                        } else {
                            layer.msg("审核失败-->" + parse.msg);
                        }
                    },
                    error: function(response) {
                        layer.msg("审核失败!");
                        console.error(response);
                    },
                });

            }
        });
    });

    var maxFileCount = 3; //文件上传最大数量
    var fileCount = 0; //控制文件数量
    var initCount = 0;
    var initImg = []
        //问题反馈弹框操作
    $('#fb_feedback_btn_f').click(function() {
        var timer,
            isFinished = false;
        isChoosed = false;
        imgArr.length = 0;
        layer.open({
            type: 1,
            title: "问题反馈",
            area: ["60%", "70%"],
            btn: ['提交', '关闭'],
            shadeClose: false,
            content: $("#feedback_layer_f").html(),
            success: function(layero, index) {
                imgArr.length = 0;
                clearInterval(timer);
                for (var i in issueTypeList) {
                    $("select[name='issue_type']").append("<option value='" + i + "'>" + issueTypeList[i].name + "</option>");
                }
                form.render('select');
                upload.render();
                var uploadInst = upload.render({
                    elem: '#upload_btn', //绑定元素
                    accept: 'images', //允许上传的文件类型
                    number: maxFileCount,
                    multiple: true, //允许多文件上传
                    auto: false, //选完文件后不要自动上传
                    bindAction: '.layui-layer-btn0', //指定一个按钮触发上传
                    url: ctx + '/warehouseProblemController/uploadPic.html', //上传接口
                    choose: function(obj) {
                        imgArr.length = 0;
                        isChoosed = true
                        fileCount = 0;
                        var files = obj.pushFile(); //将每次选择的文件追加到文件队列
                        //图像预览，如果是多文件，会逐个添加。(不支持ie8/9);
                        for (var index in files) {
                            fileCount++;
                        }
                        obj.preview(function(index, file, result) {
                            isFinished = false;
                            if (fileCount > maxFileCount) {
                                fileCount = maxFileCount;
                                delete files[index];
                                layer.msg('文件数量不得超过' + maxFileCount + '个', { icon: 2 });
                                imgArr.length = 0;
                                return;
                            }
                            var imgobj = new Image(); //创建新img对象
                            var oDiv = document.createElement('div');
                            var deleteIcon = document.createElement('div');
                            oDiv.className = 'img_box'
                            deleteIcon.className = 'deleteIcon';
                            deleteIcon.setAttribute('data-index', index);
                            deleteIcon.innerHTML = '×';
                            imgobj.src = result; //指定数据源
                            imgobj.className = 'ml_img';
                            oDiv.appendChild(imgobj);
                            oDiv.appendChild(deleteIcon);
                            document.getElementById("div_prev").appendChild(oDiv); //添加到预览区域
                            $('.deleteIcon').click(function() {
                                fileCount--;
                                var delindex = $(this).attr('data-index');
                                delete files[delindex];
                                $(this).parents('.img_box').remove();
                                if ($.isEmptyObject(files)) {
                                    isFinished = true;
                                }
                            });
                            imgArr.length = 0;
                        });
                    },
                    done: function(res) {
                        //上传完毕回调
                        if (res.code === "0000") {
                            imgArr.push(res.msg);
                        }
                    },
                    allDone: function(res) {
                        isFinished = true;
                    },
                    error: function() {
                        //请求异常回调
                        layer.msg("上传图片失败")
                    }
                });
            },
            yes: function(index, layero) {
                //isFinished = false;
                clearInterval(timer);
                var obj = {};
                obj.sSkuList = [];
                obj.issueType = $("select[name='issue_type'] option:selected").text();
                var skuList = $("textarea[name='sku_textarea']").val();
                obj.issueRemark = $("textarea[name='issue_remark']").val();
                if (isChoosed == false) {
                    isFinished = true;
                }
                if (skuList) {
                    loading.show();
                    obj.sSkuList = skuList.split(/[\s\n]/);
                    obj.sSkuList = obj.sSkuList.filter(function(item) {
                        return item !== ""
                    })
                    timer = setInterval(function() {
                        if (isFinished) {
                            clearInterval(timer);
                            obj.imgArr = (imgArr);
                            $.ajax({
                                type: "POST",
                                url: ctx + "/warehouseProblemController/addWarehouseProblem.html",
                                data: { 'obj': JSON.stringify(obj) },
                                async: true,
                                dataType: "JSON",
                                success: function(data) {
                                    imgArr.length = 0;
                                    if (data.code == "0000") {
                                        layer.msg(data.msg, { icon: 1, time: 10000 });
                                    } else if (data.code == "0001") {
                                        layer.confirm(data.msg, function(index) {
                                            obj.insist = "YES"
                                            $.ajax({
                                                type: "POST",
                                                url: ctx + "/warehouseProblemController/addWarehouseProblem.html",
                                                dataType: 'json',
                                                async: true,
                                                data: { 'obj': JSON.stringify(obj) },
                                                beforeSend: function() {
                                                    loading.show();
                                                },
                                                success: function(res) {
                                                    loading.hide();
                                                    layer.close(index);
                                                    if (res.code == '0000') {
                                                        layer.msg(res.msg, { icon: 1, time: 10000 });
                                                    }
                                                }
                                            });

                                        });
                                    }
                                    loading.hide();
                                }
                            });
                        }
                    }, 1000);
                } else {
                    layer.msg('请输入sku');
                }
            },
            end: function(index, layero) {
                imgArr.length = 0;
                fileCount = 0;
                clearInterval(timer);
                table.reload('feedback_table_f', {
                    page: {
                        curr: 1 //从第一页开始
                    },
                    where: searchDate(),
                });
            }
        });
    });


    var id;
    var handleStatus;
    var handleRemark;
    var issueRemark, issueType;
    var prodSSku;
    var bizzOwner;
    var bizzOwnerId;
    var extraPackingCharge;
    table.on('tool(feedback-table-filter)', function(obj) {
        var data = obj.data;
        var layEvent = obj.event;
        var tr = obj.tr;
        id = data.id;
        handleStatus = data.handleStatus;
        handleRemark = data.handleRemark;
        // issueRemark = data.issueRemark;
        issueRemark = $(tr).find("td[data-field=issueRemark]").children().text();
        issueType = $(tr).find("td[data-field=issueType]").children().text();
        // prodSSku = data.prodSSku;
        prodSSku = $(tr).find("td[data-field=sku]").children().find(".feedback_fbsku_prodSSku").text();
        bizzOwner = data.bizzOwner;
        bizzOwnerId = data.bizzOwnerId;
        extraPackingCharge = data.extraPackingCharge;
        var issueCode = data.issueCode;

        if (layEvent === 'handle') {
            warehouse_feedback_handleFn(data);
            // layer.open({
            //     type: 1,
            //     title: "处理",
            //     area: ["60%", "50%"],
            //     btn: ['提交', '关闭'],
            //     shadeClose: false,
            //     content: $("#warehouse_feedback_handle_layer").html(),
            //     id: 'warehouse_feedback_handle_layerId',
            //     yes: function(index, layero) {
            //         loading.show();
            //         var data = {};
            //         data.id = id;
            //         data.bizzOwner = bizzOwner;
            //         data.bizzOwnerId = bizzOwnerId;
            //         data.isModifyHandler = $('#handle_form_f input[name="is_modify_handler"]:checked').val();
            //         data.extraPackingCharge = $("#extra_pack_money").val();
            //         data.handleStatus = $('#handle_form_f input[name="handle_state"]:checked').val();
            //         data.handleRemark = $('#handle_form_f textarea').val();
            //         data.issueCode = issueCode;
            //         data.prodSSku = prodSSku;
            //         //提交处理接口
            //         $.ajax({
            //             type: "POST",
            //             url: ctx + "/warehouseProblemController/updateWarehouseProblem.html",
            //             data: { 'obj': JSON.stringify(data) },
            //             async: true,
            //             dataType: "JSON",
            //             success: function(data) {
            //                 layer.msg(data.msg, { icon: 1 });
            //             }
            //         });
            //         loading.hide();
            //         table.reload('feedback_table_f', {
            //             page: {
            //                 curr: 1 //从第一页开始
            //             },
            //             where: searchDate(),
            //         });
            //         layer.close(index);
            //     },
            //     success: function(layero, index) {
            //         $("textarea[name='note_text']").html(handleRemark);
            //         $("#extra_pack_money").val(extraPackingCharge);
            //         $("#is_modify_handler_no").attr("checked", true);
            //         if (handleStatus == 0) {
            //             $("#is_handle").attr("checked", true);
            //         } else if (handleStatus == 1) {
            //             $("#is_handle1").attr("checked", true);
            //         } else if (handleStatus == 2) {
            //             $("#is_handle2").attr("checked", true);
            //         }
            //         form.render('radio');
            //     }
            // });
        } else if (layEvent === 'modify') {
            var timer,
                isFinished = false;
            isChoosed = false;
            imgArr.length = 0;
            let feedbackModifyMsgCode = -1,
                feedbackissueType, feedbackissueRemark;
            layer.open({
                type: 1,
                title: "修改",
                area: ["60%", "70%"],
                btn: ['提交', '关闭'],
                shadeClose: false,
                content: $("#mofidy_layer").html(),
                success: function(layero, index) {
                    $("textarea[name='issue_remark_one']").html(issueRemark);
                    imgArr.length = 0;
                    clearInterval(timer);
                    for (var i in issueTypeList) {
                        // if (issueTypeList[i].name == data.issueType) {
                        if (issueTypeList[i].name == issueType) {
                            $("select[name='issue_type_one']").append("<option selected value='" + i + "'>" + issueTypeList[i].name + "</option>");
                        } else {
                            $("select[name='issue_type_one']").append("<option value='" + i + "'>" + issueTypeList[i].name + "</option>");
                        }
                    }
                    $("#sku_textarea").val(prodSSku);
                    form.render('select');
                    upload.render();
                    initCount = 0;
                    initImg.length = 0;
                    var Imgs = eval(data.issueImgs);
                    for (var i = 0; i < Imgs.length; i++) {
                        var oDiv = addpic(Imgs[i], data.urlPrefix + Imgs[i]);
                        initImg.push(Imgs[i]);
                        initCount++;
                        document.getElementById("div_prev_m").appendChild(oDiv); //添加到预览区域
                    }
                    $('.deleteIcon').click(function() {
                        $(this).parents('.img_box').remove();
                        var index = initImg.indexOf($(this).attr('data-index'));
                        if (index > -1) {
                            initImg.splice(index, 1);
                        }
                        initCount--;
                    });
                    var uploadInst = upload.render({
                        elem: '#upload_btn_m', //绑定元素
                        accept: 'images', //允许上传的文件类型
                        number: maxFileCount,
                        multiple: true, //允许多文件上传
                        auto: false, //选完文件后不要自动上传
                        bindAction: '.layui-layer-btn0', //指定一个按钮触发上传
                        url: ctx + '/warehouseProblemController/uploadPic.html', //上传接口
                        choose: function(obj) {
                            //   imgArr.length = 0;
                            isChoosed = true
                            fileCount = 0;
                            var files = obj.pushFile(); //将每次选择的文件追加到文件队列
                            //图像预览，如果是多文件，会逐个添加。(不支持ie8/9);
                            for (var index in files) {
                                fileCount++;
                            }
                            obj.preview(function(index, file, result) {
                                isFinished = false;
                                if ((fileCount + initCount) > maxFileCount) {
                                    fileCount = maxFileCount;
                                    delete files[index];
                                    layer.msg('文件数量不得超过' + maxFileCount + '个', { icon: 2 });
                                    imgArr.length = 0;
                                    return;
                                }
                                var oDiv = addpic(index, result);
                                document.getElementById("div_prev_m").appendChild(oDiv); //添加到预览区域
                                $('.deleteIcon').click(function() {
                                    fileCount--;
                                    var delindex = $(this).attr('data-index');
                                    delete files[delindex];
                                    $(this).parents('.img_box').remove();
                                    if ($.isEmptyObject(files)) {
                                        isFinished = true;
                                    }
                                });
                                imgArr.length = 0;
                            });
                        },
                        done: function(res) {
                            //上传完毕回调
                            if (res.code === "0000") {
                                imgArr.push(res.msg);
                                console.log('imgArr', imgArr);
                            }
                        },
                        allDone: function(res) {
                            isFinished = true;
                        },
                        error: function() {
                            //请求异常回调
                            layer.msg("上传图片失败")
                        }
                    });
                },
                yes: function(index, layero) {
                    //isFinished = false;
                    clearInterval(timer);
                    var obj = {};
                    obj.sSkuList = [];
                    obj.issueType = $("select[name='issue_type_one'] option:selected").text();
                    obj.id = id;
                    obj.issueRemark = $("textarea[name='issue_remark_one']").val();
                    feedbackissueType = $("select[name='issue_type_one'] option:selected").text();
                    feedbackissueRemark = $("textarea[name='issue_remark_one']").val();
                    if (isChoosed == false) {
                        isFinished = true;
                    }
                    loading.show();
                    timer = setInterval(function() {
                        if (isFinished) {
                            clearInterval(timer);
                            for (var i = 0; i < initImg.length; i++) {
                                imgArr.push(initImg[i]);
                            }
                            obj.imgArr = imgArr;
                            $.ajax({
                                type: "POST",
                                url: ctx + "/warehouseProblemController/modifyWarehouseProblem.html",
                                data: { 'obj': JSON.stringify(obj) },
                                async: true,
                                dataType: "JSON",
                                success: function(data) {
                                    imgArr.length = 0;
                                    feedbackModifyMsgCode = data.code;
                                    layer.msg(data.msg, { icon: 1, time: 3000 });
                                    loading.hide();
                                }
                            });
                        }
                    }, 1000);

                },
                end: function(index, layero) {
                    imgArr.length = 0;
                    fileCount = 0;
                    clearInterval(timer);
                    // table.reload('feedback_table_f', {
                    //     page: {
                    //         curr: 1 //从第一页开始
                    //     },
                    //     where: searchDate(),
                    // });
                    if (feedbackModifyMsgCode == '0000') { // 点击了提交(表格‘问题类型’和‘问题备注’会更改)
                        $(tr).find("td[data-field=issueType]").children().text(feedbackissueType);
                        $(tr).find("td[data-field=issueRemark]").children().text(feedbackissueRemark);
                    }
                    // else 没有点击提交或者提交失败，点击关闭，什么都不用做
                }
            });
        } else if (layEvent === 'modifyWarehouseFee') {
            let feedbackModifyWarehouseFeeMsgCode, feedback_input_warehouseFee, feedback_input_ProdSSku;
            let get_table_sku = $(tr).find("td[data-field=sku]").children().find(".feedback_fbsku_prodSSku").text(),
                get_table_purchaseCostPrice = $(tr).find("td[data-field=purchaseCostPrice]").children().find(".feedback_fbprice_PackageFee").text();
            layer.open({
                type: 1,
                title: "修改仓储费",
                area: ["60%", "70%"],
                btn: ['提交', '关闭'],
                shadeClose: false,
                content: $("#modify_warehouse_fee").html(),
                success: function(layero, index) {
                    // $("input[name='oldWarehouseFee']").val(data.warehousePackageFee);
                    // $("input[name='feedbackProdSSku']").val(data.prodSSku);
                    $("input[name='oldWarehouseFee']").val(get_table_purchaseCostPrice);
                    $("input[name='feedbackProdSSku']").val(get_table_sku);
                    $("#modifyWarehouseFeeId").val(data.id);
                    clearInterval(timer);
                },
                yes: function(index, layero) {
                    var data = {};
                    data.id = $("#modifyWarehouseFeeId").val();
                    data.warehouseFee = $("input[name='warehouseFee']").val();
                    feedback_input_warehouseFee = $("input[name='warehouseFee']").val();
                    feedback_input_ProdSSku = $("input[name='feedbackProdSSku']").val();
                    $.ajax({
                        type: "application/json",
                        method: "POST",
                        data: { "obj": JSON.stringify(data) },
                        url: ctx + "/warehouseProblemController/updateWarehouseFee.html",
                        success: function(response) {
                            var parse = response
                            feedbackModifyWarehouseFeeMsgCode = parse.code;
                            if (parse.code === "0000") {
                                layer.msg("修改仓储费成功!");
                            } else {
                                layer.msg("修改仓储费失败!" + parse.msg);
                            }
                        },
                        error: function(response) {
                            layer.msg("修改仓储费失败!");
                            console.error("response", response);
                        }
                    });
                },
                end: function(index, layero) {
                    // table.reload('feedback_table_f', {
                    //     page: {
                    //         curr: 1 //从第一页开始
                    //     },
                    //     where: searchDate(),
                    // });
                    if (feedbackModifyWarehouseFeeMsgCode == '0000') { // 点击了提交(表格‘子SKU’和‘成本（仓库）’会更改)
                        $(tr).find("td[data-field=sku]").children().find(".feedback_fbsku_prodSSku").text(feedback_input_ProdSSku);
                        $(tr).find("td[data-field=purchaseCostPrice]").children().find(".feedback_fbprice_PackageFee").text(feedback_input_warehouseFee);
                    }
                    // else 没有点击提交或者提交失败，点击关闭，什么都不用做
                }
            });
        }
    });
    //处理功能重写
    function warehouse_feedback_handleFn(data) {
        layer.open({
            type: 1,
            title: "处理",
            area: ["60%", "50%"],
            btn: ['提交', '关闭'],
            shadeClose: false,
            content: $("#warehouse_feedback_handle_layer").html(),
            id: 'warehouse_feedback_handle_layerId',
            success: function() {
                var getTpl = warehouse_feedback_handle_containerTpl.innerHTML,
                    view = document.getElementById('warehouse_feedback_handle_container');
                laytpl(getTpl).render(data, function(html) {
                    view.innerHTML = html;
                    form.render();
                    if (data.handleStatus !== 1 && data.handleStatus !== 3) {
                        $('#operateEl').hide()
                    } else {
                        $('#operateEl').show()
                    }
                });
            },
            yes: function(index) {
                var formData = $('#warehouse_feedback_handle_form').serializeObject();
                formData.id = data.id;
                if (formData.handleStatus == 3) {
                    formData.isModifyHandler = true;
                }
                commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: `/lms/warehouseProblemController/updateWarehouseProblemV2.html`,
                    params: {
                        obj: JSON.stringify([formData])
                    }
                }).then(res => {
                    // layer.msg(res || '保存成功', { icon: 1 });
                    // layer.close(index);

                    if (res?.failNum === 0) {
                        layer.msg('保存成功', { icon: 1 });
                        layer.close(index);
                    }
                    if (res?.failNum !== 0) {
                        let msg = res.failResults && res.failResults.join('')
                        layer.msg('处理失败！' + msg, { icon: 2 });
                    }

                    $('#fb_search_form').click();

                    
                }).catch(err => {
                    layer.alert(err, { icon: 2 });
                })
            }
        });
    }
    $("#export_matchCateBtn_f").click(function() {
            layer.confirm('确认导出当前搜索条件问题反馈？', { btn: ['确认', '取消'] }, function() {
                data = searchDate();
                submitForm(data, ctx + '/warehouseProblemController/exportWarehouseProblem.html')
                layer.closeAll('dialog'); //关闭选择框
            });
        })
        // 文件上传操作

    //添加预览区域
    function addpic(index, result) {
        var imgobj = new Image(); //创建新img对象
        var oDiv = document.createElement('div');
        var deleteIcon = document.createElement('div');
        oDiv.className = 'img_box'
        deleteIcon.className = 'deleteIcon';
        deleteIcon.setAttribute('data-index', index);
        deleteIcon.innerHTML = '×';
        imgobj.src = result; //指定数据源
        imgobj.className = 'ml_img';
        oDiv.appendChild(imgobj);
        oDiv.appendChild(deleteIcon);
        return oDiv;
    }
});
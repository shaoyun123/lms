// 动态列加载
var gatherhotCols = [
    [ {
        type: "checkbox",
        width: "2%"
    }, {
        field: "imgUri",
        title: "缩略图",
        templet: "#gh_imageTpl",
        width: "8%"
    }, {
      field: "repeatSku",
      title: "疑似重复SKU",
      templet: "#gh_repeatPSku",
      width: "8%"
  }, {
        field: "title",
        title: "标题",
        templet: "#gh_titleTpl",
        width: "20%"
    },
        {
            field: "listing_data",
            title: "listing数据",
            templet: "#gh_listing_Tpl",
            width: "6%"
        },
        {
            field: "developer",
            title: "分配开发",
            templet: "#gh_developerTpl",
            width: "6%"
        }, {
        field: "pSku",
        title: "父SKU(在售商品数)",
        templet: "#gather_hot_title_tpl",
        width: "8%"
    },
        {
            field: "productInfo",
            title: "商品信息",
            templet: "#gather_hot_productInfo_tpl",
            width: "11%"
        }, {
        field: "salesNum",
        title: "销量",
        templet: "#gh_sales_Tpl",
        width: "8%"
    }, {
        field: "devNote",
        title: "审核备注",
        templet: "#gather_hot_dev_note_tpl",
        width: "8%"
    }, {
        field: "gatherHotdevRemark",
        title: "开发备注",
        templet: "#gather_hot_dev_remark_tpl",
        width: "8%"
    },{
        field: "devFailReason",
        title: "不可开发原因",
        width: "8%"
    }, {
        field: "tortBrand",
        title: "侵权品牌",
        width: "4%"
    }, {
        field: "time",
        title: "时间",
        templet: "#gh_timeTpl",
        width: "8%"
    }, {
        title: "操作",
        toolbar: '#gh_editBar',
        width: "10%"
    },{
        field: "platCode",
        title: "平台",
        width: "0%",
    },{
        field: "prodPid",
        title: "商品ID",
        width: "0%",
    },{
        field: "prodSaleCountList",
        title: "销量列表",
        width: "0%",
    },{
        field: "cateFullName",
        title: "全类目名",
        width: "0%",
    }
    ],
];

layui.use(['admin', 'form', 'table', 'laydate', 'laytpl','element','formSelects'], function() {
    var $ = layui.$,
        admin = layui.admin,
        tabsPage = admin.tabsPage,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        table = layui.table,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        form = layui.form;
    element.render('collapse');
    form.render(null, 'component-form-element');
    form.render(null, 'component-form-group');
    var first = true;
    var listingCheckStatus;

    //监听表格寻找货源点击事件
    $('#gatherhotCard').on('click', '.searchSupply', function(){
      let picUrl = $(this).attr('data-image');
      if(!picUrl){
        return layer.msg('无图片不可查找货源', {icon: 7});
      }
      window.open('https://www.1688.com?pordUrl=' + picUrl)
    //   commonSearchGoodsComponents(picUrl);
    });
    //以图搜图
    $('#gatherhotCard').on('click', '.searchImgByImg', function(){
      let url = $(this).attr('data-image');
      let id = $(this).attr('data-id');
      if(!url){
        return layer.msg('无图片不可以图搜图', {icon: 7});
      }
      handleSearchImage('','',function (){
          $('#inputImageEl').val(url);
          let evt = $.Event('keydown', {keyCode: 13});
          $('#inputImageEl').trigger(evt);
          let searchBtn = $('#inputImageEl').parents('div.layui-col-md4').next().find('.layui-btn:first-child');
          searchBtn.trigger('click');
          //获取到元素并插入然后调用设为重复事件[不能用settimeout]
          $("#imageInfoView .image-info>.info-item").wait(function() { //等待#imageInfoView元素的加载
            let $imgItems = $('#imageInfoView .image-info>.info-item');
            console.log('等待元素加载完成');
            for(let i=0; i<$imgItems.length;i++){
              let item = $imgItems[i];
              let repeatPSku = $(item).find('.info-center a[name=psku]').text();
              //获取到按钮
              let infoRightLastBtn = $(item).find('.info-right-lastbtn');
              infoRightLastBtn.after(`<div style="width: 100%;height: 24px;position: relative;">
              <div class="oa-status-danger" onclick="commonSetImgRepeatHandle('${id}', '${repeatPSku}')">设为重复</div>
            </div>`);
            }
        });
          
          
      });
      // setTimeout(()=> {
      //   $('#inputImageEl').val(url);
      //   let evt = $.Event('keydown', {keyCode: 13});
      //   $('#inputImageEl').trigger(evt);
      //   let searchBtn = $('#inputImageEl').parents('div.layui-col-md4').next().find('.layui-btn:first-child');
      //   searchBtn.trigger('click');
      // }, 1000);
    });

    //表格渲染结果
    //展示已知数据
    table.render({
        elem: "#gh_hotTable",
        url: ctx + "/prodhotsale/list.html",
        where: serializeObject($('#gh_searchForm')),
        // height: 'full-0',
        page: true,
        limits: [50, 100, 300], // 每页条数的选择项
        limit: 50, //默认显示
        cols: gatherhotCols,
        id: "gh_hotTable",
        // height:table_height(),
        done: function (returnData){
            if(first){
                $('.add_msg_btn_class').css('display','none');
                first = false;
            }
            if(listingCheckStatus==5 || listingCheckStatus==6){
                $('.add_msg_btn_class').css('display','');
            }else{
                $('.add_msg_btn_class').css('display','none');
            }
            setField();
            load(returnData);
            $('#gh_hotTable').next().find('.layui-table-header').removeClass('toFixedContain');
            if(localStorage.getItem('scrollHeight')){
                var scrollTopDefault = localStorage.getItem('scrollHeight');
                $('.layadmin-tabsbody-item.layui-show').scrollTop(scrollTopDefault);
                localStorage.removeItem('scrollHeight');
            }
        }
    });

    //同时绑定多个日期
    lay('.test-item').each(function() {
        laydate.render({
            elem: this,
            trigger: 'click'
        })
    });
    //搜索提交时间
    $("#gh_searchBtn").click(function() {
        //执行重载
        table.reload('gh_hotTable', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: serializeObject($('#gh_searchForm')),
        });
    });
    element.on('tab(gh_hot_tab)', function(data) {
        var listingStatus = $(this).attr("data-value");
        if(listingStatus == 1){
            $('#gh_delete').css('display','inline-block');
        }else {
            $('#gh_delete').css('display','none');
        }
        listingCheckStatus = listingStatus;
        $("#gh_searchForm input[name=listingStatus]").val(listingStatus);
        $("#gh_searchBtn").trigger("click");
    });

    table.on('tool(gh_table-filter)', function(obj) {
            var layEvent = obj.event; //获得 lay-event 对应的值
            if (layEvent == "gh_examine" || layEvent == "gh_complete") {
                var scrollHeight = $('.layadmin-tabsbody-item.layui-show').scrollTop();
                localStorage.setItem('scrollHeight',scrollHeight);
                examineOrDev(obj,layEvent,null,obj.data.id.toString());
            } else if (layEvent == "gh_mergeListing") {
                layer.open({
                    type: 1,
                    title: '输入待合并的产品ID,以“,”隔开',
                    area: ["500px", "200px"],
                    btn: ["保存", "取消"],
                    content: '<div style="padding:20px"><input type="text"  class="layui-input"></div>',
                    yes: function(index, layero) {
                        var subListing = $(layero).find("input").val();
                        layui.admin.load.show();
                        $.ajax({
                            type: "post",
                            url: ctx + "/prodhotsale/mergelisting.html",
                            dataType: "json",
                            data: {
                                subListing: subListing,
                                mainId: obj.data.id
                            },
                            success: function(returnData) {
                                layui.admin.load.hide();
                                if (returnData.code != "0000") {
                                    layer.alert(returnData.msg, { icon: 2 });
                                } else {
                                    table.reload('gh_hotTable', { where: serializeObject($('#gh_searchForm')) });
                                    layer.close(index);
                                }
                            },
                        });
                    },
                });
            } else if (layEvent == "optimize") {
                optimizeAddBtn(obj.data.prodPid,obj.data.pSku);
            } else if (layEvent == "listing") {
                listing(obj.data.prodPid,obj.data.platCode);
            } else if (layEvent == "gh_allotdeveloper") {
                //分配开发
                popToAllotDeveloper([obj.data.id])
            } else if (layEvent == "gh_detail") {
                var groupId = obj.data.id;
                var index = layer.open({
                    type: 1,
                    title: '同款',
                    area: ['100%', '80%'],
                    id: 'gh_detail_layer',
                    shadeClose: false,
                    btn: ['确定', '关闭'],
                    content: $('#gh_detailLayer').html(),
                    success: function(layero, index) {
                        table.render({
                            elem: '#gh_detailTable',
                            where: { groupId: groupId },
                            url: ctx + '/prodhotsale/listsub.html', // 数据接口
                            cols: [
                                [
                                    {title: "序号", type: "numbers", width: "2%",},
                                    {field: "imgUri", title: "缩略图", templet: "#gh_imageTpl1", width: "10%",},
                                    {field: "title", title: "标题", templet: "#gh_subTitleTpl", width: "20%",},
                                    {field: "price", title: "总价($)", width: "8%",},
                                    {field: "totalSales", title: "总销量", width: "8%",},
                                    {field: "weeklySales", title: "周销量", width: "8%",},
                                    {field: "growth", title: "增幅", templet: "<div>{{d.growth}}%</div>", width: "8%",},
                                    { field: "score", title: "商品评分", width: "10%", },
                                    { field: "time", title: "时间", templet: "#gh_timeTpl", width: "16%", },
                                    { title: "操作", toolbar: '#gh_detailEditBar', width: "10%", }],
                            ],
                        });
                        table.on('tool(gh_detail_table_filter)', function(obj) {
                                var layEvent = obj.event
                                if (layEvent == 'gh_detailRemove') { //移除listing
                                    var id = obj.data.id
                                    layer.confirm('移除listing', { icon: 3, title: '移除listing' }, function(index) {
                                        layui.admin.load.show();
                                        $.ajax({
                                            type: 'post',
                                            url: ctx + '/prodhotsale/removelisting.html',
                                            dataType: 'json',
                                            data: { id: id },
                                            success: function(returnData) {
                                                layui.admin.load.hide();
                                                if (returnData.code != '0000') {
                                                    layer.alert(returnData.msg, { icon: 2 })
                                                    return
                                                }
                                                layer.msg('移除成功')
                                                table.reload('gh_detailTable', { where: { id: groupId } })
                                            }
                                        })
                                    })
                                }

                            })
                            //渲染问题
                        layui.admin.load.show();
                        log('gatherhot_operationLog',groupId);
                    },
                    yes: function(index, layero) {
                        table.reload('gh_hotTable', { where: serializeObject($('#gh_searchForm')) });
                        layer.close(index);
                    }
                });
            } else if (layEvent == 'gh_newProd') { //新增新品
                //保存到sessionStorage
                var prodHotSaleId = obj.data.id;
                sessionStorage = window.sessionStorage;
                sessionStorage.setItem("prodHotSaleId", prodHotSaleId);
                //跳转到新增新品页面
                // location.hash = '#/route/work/develop/newdevelop';
                window.parent.postMessage({ name:'workdevelopnewdevelop'},'*');
            }else if (layEvent == "gh_operLog") {
                var groupId = obj.data.id;
                var index = layer.open({
                    type: 1,
                    title: '同款',
                    area: ['100%', '80%'],
                    id: 'gh_detail_layer_2',
                    shadeClose: false,
                    btn: ['确定', '关闭'],
                    content: $('#gh_detailLayer_2').html(),
                    success: function(layero, index) {
                        //渲染问题
                        layui.admin.load.show();
                        log('gatherhot_operationLog_new',groupId);
                    },
                    yes: function(index, layero) {
                        layer.close(index);
                    }
                });
            }
    });
    function popToAllotDeveloper(idList) {
        layer.open({
            type: 1,
            title: "分配开发",
            area: ["300px", "600px"],
            btn: ["保存", "取消"],
            content: $("#allotdeveloperLayer").html(),
            success: function(layero, index) {
                form.render('select','allotdeveloperForm');
            },
            yes: function(index, layero) {
                //保存
                let developerId = $(layero).find("select").val();
                let developer = $(layero).find("select option:selected").text();
                let Adata = {
                    idList: idList,
                    developerId: developerId,
                    developer: developer
                }
                oneAjax.post({
                    url: ctx + "/prodhotsale/allotdeveloper.html",
                    data: Adata,
                    dataType: "json",
                    success: function(returnData) {
                        layui.admin.load.hide();
                        if (returnData.code !== "0000") {
                            layer.alert(returnData.msg, { icon: 2 });
                        } else {
                            layer.msg("分配成功");
                            layer.close(index);
                            table.reload('gh_hotTable', { where: serializeObject($('#gh_searchForm')) });
                        }
                    }
                })
               
            },
        });
    }

    function examineOrDev(obj,layEvent,batch,ids){
        var url; //保存url
        var index = layer.open({
            type: 1,
            title: '审核',
            area: ['50%', '90%'],
            btn: ['保存', '关闭'],
            shadeClose: false,
            content: $('#gh_examineLayer').html(),
            success: function(layero, index) {
                //启用特定的值
                url = ctx + "/prodhotsale/audit";
                if (layEvent == 'gh_examine') { //审核
                    $(layero).find("form select[name=devStatus] option[value=1]").remove();
                    $(layero).find("form select[name=devStatus] option[value=3]").remove();
                    $(layero).find("form select[name=devStatus] option[value=4]").remove();
                    $(layero).find("form textarea[name=devRemark]").parents(".layui-form-item").remove();
                } else if (layEvent == 'gh_complete') { //完成开发
                    $(layero).find("form select[name=devStatus] option[value=1]").remove();
                    $(layero).find("form select[name=devStatus] option[value=2]").remove();
                    $(layero).find("form select[name=devStatus] option[value=3]").remove();
                    $(layero).find("form select[name=devStatus] option[value=9]").remove();
                    $(layero).find("form textarea[name=devNote]").parents(".layui-form-item").remove();
                    //title
                    $(layero).parents("layui-layer").find("layui-layer-title").html("完成开发");
                }
                //设置表单初始值
                if(!batch){
                    var noExamine = (obj.data.tortStatus === undefined || obj.data.tortStatus === null || obj.data.tortStatus === '' || obj.data.tortStatus === 1)
                        && (obj.data.tortBrand === undefined || obj.data.tortBrand === null || obj.data.tortBrand === '')
                        && (obj.data.devStatus === undefined || obj.data.devStatus === null || obj.data.devStatus === '' || obj.data.devStatus === 1);
                    if(!noExamine){
                        $(layero).find("form select[name=tortStatus]").val(obj.data.tortStatus);
                        $(layero).find("form select[name=devStatus]").val(obj.data.devStatus);
                        $(layero).find("form input[name=tortBrand]").val(obj.data.tortBrand);
                        $(layero).find("form input[name=pSku]").val(obj.data.pSku);
                        $(layero).find("form select[name=devFailReason]").val(obj.data.devFailReason);
                        $(layero).find("form textarea[name=devNote]").val(obj.data.devNote);
                        $(layero).find("form textarea[name=devRemark]").val(obj.data.devRemark);
                    }
                }
                form.render('select');
                form.render('checkbox');
                form.on('switch(gatherhot_sameAsRepeatSkuFilter)', function(data){
                  if(data.elem.checked){
                    $(layero).find('form [name=pSku]').attr('disabled', true);
                  }else{
                    $(layero).find('form [name=pSku]').removeAttr('disabled');
                  }
                });
            },
            yes: function(index, layero) {
                var data = serializeObject($(layero).find('form'));
                let sameAsRepeatSku = $(layero).find('form').find('[type=checkbox]').is(':checked');
                data.sameAsRepeatSku = sameAsRepeatSku;
                if(sameAsRepeatSku){
                  delete data.psku;
                }
                data.idList = ids.split(',');
                layui.admin.load.show();
                $.ajax({
                    type: "post",
                    url: url,
                    dataType: "json",
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(returnData) {
                        layui.admin.load.hide();
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, { icon: 2 });
                            return;
                        }
                        layer.msg("保存成功");
                        layer.close(index);
                        table.reload('gh_hotTable', { where: serializeObject($('#gh_searchForm')) });
                    }
                });
            },
            end: function(index, layero) {
                $(layero).find("form").trigger('reset')
            },
            btn2: function(){
                localStorage.removeItem('scrollHeight');
            },
            cancel: function(){
                localStorage.removeItem('scrollHeight');
            }
        });
    };
        //监听表格是否固定分类修改
    form.on('switch(isFixedCateFilter)', function(obj) {
        var id = this.value;
        var isFixedCate = obj.elem.checked;
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/prodhotsale/isfixedcate.html",
            data: {
                isFixedCate: isFixedCate,
                id: id
            },
            dataType: "json",
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                    //失败后转换为原来的状态
                    obj.elem.checked = !isFixedCate;
                    form.render();
                } else {
                    layer.msg("修改成功");
                }
            }
        });
    });

    function log(logId,groupId){
        $.ajax({
            type: "post",
            url: ctx + "/prodhotsale/operlog.html",
            data: { id: groupId },
            dataType: "json",
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.alert(returnData.msg, { icon: 2 });
                } else {
                    laytpl($("#gh_operlogTpl").html()).render(returnData.data, function(html) {
                        $('#'+logId).html(html);
                    });
                }
            }
        });
    }
    //弹出框的点击事件
    //合并listing
    $('#gh_mergeBtn').click(function() {
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length < 1) {
            layer.msg("请选择需要合并的产品！");
            return;
        }
        var confirm = '合并选中listing,子lising数量最多的作为主listing';
        var title = '合并listing';
        var url = '/prodhotsale/mergelistings.html';
        var successMsg = '合并成功';
        batchOper(confirm,title,url,successMsg);
    });

    // 批量审核
    $('#gh_batchExamine').click(function() {
        var confirm = '批量审核选中的产品';
        var title = '审核';
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length < 1) {
            layer.msg("请选择需要审核的产品！");
            return;
        }
        layer.confirm(confirm + '?', {icon: 3, title: title}, function (index) {
            // var ids = '';
            // for (var i = 0; i < checkStatus.data.length; i++) {
            //     ids += ','+checkStatus.data[i].id;
            // }
            let ids = checkStatus.data.map(item => item.id);
            var scrollHeight = $('.layadmin-tabsbody-item.layui-show').scrollTop();
            localStorage.setItem('scrollHeight',scrollHeight);
            examineOrDev(null,'gh_examine','batch',ids.join(','));
        });

    });

    function batchOper(confirm,title,url,successMsg) {
        //获取选中的数据
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length > 1) {
            layer.confirm(confirm+'?', { icon: 3, title: title }, function(index) {
                var ids = [];
                for (var i = 0; i < checkStatus.data.length; i++) {
                    ids.push(checkStatus.data[i].id);
                }
                layui.admin.load.show();
                $.ajax({
                    type: "post",
                    url: ctx + url,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function(returnData) {
                        layui.admin.load.hide();
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, { icon: 2 });
                            return;
                        }
                        layer.msg(successMsg);
                        table.reload('gh_hotTable', { where: serializeObject($('#gh_searchForm')) });
                    }
                });
                layer.close(index);
            });
        }
    };
    //监听匹配类目表格是否固定分类修改
    // form.on('switch(match_is_fixed_cate_filter)', function(obj){
    //     var id = this.value;
    //     var isFixedCate = obj.elem.checked;
    //     debugger;
    // });
    //自动匹配类目
    $('#gh_matchCateBtn').click(function() {
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length < 1) {
            layer.msg("请选择需要匹配类目的产品！");
            return;
        }
        //获取选中的数据
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length > 0) {
            layer.confirm('确定对选中的Listing自动匹配类目吗?', { icon: 3, title: '匹配类目' }, function(index) {
                var ids = [];
                for (var i = 0; i < checkStatus.data.length; i++) {
                    ids.push(checkStatus.data[i].id);
                }
                layer.open({
                    type: 1,
                    title: '匹配详情',
                    area: ['100%', '100%'],
                    shadeClose: false,
                    btn: ['确认提交', '取消'],
                    content: $('#gh_matchCateLayer').html(),
                    success: function(layero, index) {
                        //发送ajax请求
                        layui.admin.load.show();
                        $.ajax({
                            type: 'post',
                            url: ctx + '/prodhotsale/matchcate.html', // 数据接口
                            data: { ids: ids.join(",") },
                            success: function(data) {
                                layui.admin.load.hide();
                                var html = template('gh_matchCateTable_tpl', data);
                                $('#gh_matchCateTable').append(html);
                                form.render('checkbox');
                                //点击全选事件
                                checkbox_switch('#gh_matchCateTable');
                            }
                        })
                    },
                    yes: function(index, layero) {
                        //获取表格checkbox以及checked
                        var checkStatus = $('#gh_matchCateTable tbody td:first-child input[type="checkbox"]:checked');
                        if (checkStatus.length == 0) {
                            layer.msg("未选中要保存的商品");
                            return;
                        }
                        var datas = [];
                        for (var i = 0; i < checkStatus.length; i++) {
                            var data = {},
                                trParent = checkStatus.eq(i).parents('tr');
                            data.id = trParent.find('td:nth-child(3)').text(); //获取id的值
                            data.isFixedCate = trParent.find('td:nth-child(5) input[type="checkbox"]').prop('checked');
                            data.cateId = trParent.find('.td_cateId').text();
                            datas.push(data);
                        }
                        layui.admin.load.show();
                        $.ajax({
                            type: "post",
                            url: ctx + "/prodhotsale/savecate.html",
                            dataType: "json",
                            data: JSON.stringify(datas),
                            contentType: "application/json",
                            success: function(returnData) {
                                layui.admin.load.hide();
                                if (returnData.code != "0000") {
                                    layer.alert(returnData.msg, { icon: 2 });
                                } else {
                                    table.reload('gh_hotTable', { where: serializeObject($('#gh_searchForm')) });
                                    layer.close(index);
                                }
                            },
                        });
                    },
                });
                layer.close(index);
            });
        }
    });
    // 预处理数据
    $('#gh_completeData').click(function () {
        var data = table.checkStatus('gh_hotTable').data;
        if (!data || data.length < 1) {
            layer.msg("请选择需要删除的产品！");
            return;
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        oneAjax.post({
            url: '/prodhotsale/completeData',
            data: idList,
            success: function (res) {
                if (res.code === '0000') {
                    layer.alert('已成功加入后台任务，等待预处理。由于需要下载外网图片，每分钟大概处理100条数据。请耐心等待')
                }
            }
        })
    })

    // 删除
    $('#gh_delete').click(function () {
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length < 1) {
            layer.msg("请选择需要删除的产品！");
            return;
        }
        if (checkStatus.data.length > 0) {
            var Confirmindex = layer.confirm('确定删除选中的产品吗？', {btn: ['确认', '取消']}, function (index) {
                var ids = [];
                for (var i = 0; i < checkStatus.data.length; i++) {
                    ids.push(checkStatus.data[i].id);
                }
                if (index) {
                    layer.close(Confirmindex);
                    $.ajax({
                        type: "post",
                        url: ctx + "/prodhotsale/delete.html",
                        dataType: "json",
                        data: {ids:ids.join(",")},
                        success: function (returnData) {
                            layui.admin.load.hide();
                            if (returnData.code != "0000") {
                                layer.alert(returnData.msg, {icon: 2});
                            } else {
                                layer.msg("删除成功！");
                                table.reload('gh_hotTable', {where: serializeObject($('#gh_searchForm'))});
                            }
                        },
                    });
                }
                layer.close(index);
            });
        }
    });

    //数据采集
    $("#gh_dataCollect").click(function() {
        layer.open({
            type: 1,
            title: '数据采集',
            area: ['70%'],
            shadeClose: false,
            content: $('#gh_dataCollectLayer').html(),
            success: function(layero, index) {
                //ajax渲染表单元素
                var siteDom = "";
                for(var key in siteData){
                    siteDom += '<option value="'+key+'">'+siteData[key]+'</option>';
                }
                $("#gh_dataCollectEbayForm select[name=siteIds]").html(siteDom);
                //默认选中第一个
                $("#gh_dataCollectEbayForm select[name=siteIds] option:first").attr("selected", "selected");
                formSelects.render();
                form.render();
                //渲染时间
                laydate.render({
                    elem: '#gh_dataCollectEbayForm input[name=timeStartStr]',
                    range: '~'
                });
                laydate.render({
                    elem: '#gh_dataCollectSmtForm input[name=time]',
                    range: '~'
                });
                //初始化采集定时器
                initRefreshCollectStatusTimer();
            },
            cancel: function(index, layero){
                clearRefreshCollectStatusTimer();
            }
        });
    });

    // 导出模板
    $('#export_template_gatherhot_pop_btn').click(function() {
        var outerIndex = layer.open({
            title: '导出模板',
            type: 1, //不加该属性,就会出现[object Object]
            area: ['1100px', '550px'],
            btn: ['确定', '关闭'],
            content: $('#export_template_gatherhot_pop_id').html(),
            success: function() {
                form.on('checkbox(export_template_gatherhot_pop_selectall)', function(data) {
                    var checked = data.elem.checked
                    $('#export_template_gatherhot_pop_form_id input[type=checkbox]:enabled').prop('checked', checked)
                    form.render('checkbox')
                })
                form.render('checkbox')
            },
            yes: function() {
                var searchParam = serializeObject($('#gh_searchForm'));
                checkNull(searchParam);

                var data = serializeObject($('#export_template_gatherhot_pop_form_id'));
                checkNull(searchParam);
                data.searchParam = JSON.stringify(searchParam);
                layer.confirm('确认导出当前搜索条件下的产品信息？', { btn: ['确认', '取消'] }, function() {
                    layer.alert('如果导出数据量大 ，需要十几分钟处理数据，请不要关闭和操作网页，后台正在进行导出文件');
                    submitForm(data, ctx + '/prodhotsale/exportTemplate.html')
                    layer.close(outerIndex);
                })
            }
        })
    });

    form.on('submit(gh_smtStop)', function(data) {
        var requestData = data.field;
        requestData.country = "CN-HK-TW";
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/crawler/newmore/stop",
            dataType: "json",
            data:requestData,
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(""+returnData.msg, { icon: 2 });
                } else {
                    layer.msg(""+returnData.msg, { icon: 1 });
                }
            }
        });
        return false;
    });

    form.on('submit(gh_ebayStop)', function(data) {
        var requestData = data.field;
        requestData.country = "CN-HK-TW";
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/crawler/votobo/stop",
            dataType: "json",
            data:requestData,
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(""+returnData.msg, { icon: 2 });
                } else {
                    layer.msg(""+returnData.msg, { icon: 1 });
                }
            }
        });
        return false;
    });
    //ebay采集
    form.on('submit(gh_ebayCollectSubmit)', function(data) {
        var requestData = data.field;
        requestData.country = "CN-HK-TW";
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/crawler/votobo",
            dataType: "json",
            data:requestData,
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(""+returnData.msg, { icon: 2 });
                } else {
                    layer.msg("已进入后台采集", { icon: 1 });
                }
                refreshCollectStatus();
            }
        });
        return false;
    });

    form.on('submit(gh_ebayCollectParam)', function(data) {
        var requestData = data.field;
        return votobo(requestData,"/crawler/votobo/params");
    });

    form.on('submit(gh_ebayCollectExecute)', function(data) {
        var requestData = data.field;
        return votobo(requestData,"/crawler/votobo/execute");
    });

    function votobo(requestData,url){
        requestData.country = "CN-HK-TW";
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + url,
            dataType: "json",
            data:requestData,
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(""+returnData.msg, { icon: 2 });
                } else {
                    layer.msg(""+returnData.msg, { icon: 1 });
                }
            }
        });
        return false;
    }
    //smt采集time
    form.on('submit(gh_smtCollectSubmit)', function(data) {
        var requestData = data.field;
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + "/crawler/newmore",
            dataType: "json",
            data:requestData,
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(""+returnData.msg, { icon: 2 });
                } else {
                    layer.msg("已进入后台采集", { icon: 1 });
                }
                refreshCollectStatus();
            }
        });
        return false;
    });

    form.on('submit(gh_smtCollectParam)', function(data) {
        var requestData = data.field;
       return smtExecute(requestData,"/crawler/newmore/params");
    });

    form.on('submit(gh_smtCollectExecute)', function(data) {
        var requestData = data.field;
       return smtExecute(requestData,"/crawler/newmore/execute");
    });

    $('#gh_allotBatch').click(function () {
        //跳转到新增新品页面
        let checkStatus = table.checkStatus('gh_hotTable'),
            data = checkStatus.data
        if (data.length === 0) {
            layer.msg('请选择需要分配的产品')
            return
        }
        let idList = []
        for (let i = 0; i < data.length; ++i) {
            idList.push(data[i].id)
        }
        popToAllotDeveloper(idList);
    })
    function smtExecute(requestData,url) {
        layui.admin.load.show();
        $.ajax({
            type: "post",
            url: ctx + url,
            dataType: "json",
            data:requestData,
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.msg(""+returnData.msg, { icon: 2 });
                } else {
                    layer.msg(""+returnData.msg, { icon: 1 });
                }
            }
        });
        return false;
    }
    //定时逻辑
    var refreshCollectStatusTimer;
    function initRefreshCollectStatusTimer(){
        //立即执行一次
        refreshCollectStatus()

        if(!refreshCollectStatusTimer){
            refreshCollectStatusTimer = setInterval(function() {
                refreshCollectStatus();
            }, 10000);
        }
    }
    function clearRefreshCollectStatusTimer(){
        if(refreshCollectStatusTimer){
            clearInterval(refreshCollectStatusTimer);
            refreshCollectStatusTimer = null;
        }
    }
    //刷新采集中状态
    function refreshCollectStatus(){
        $.ajax({
            type: "post",
            url: ctx + "/crawler/collect/status",
            dataType: "json",
            success: function(returnData) {
                if (returnData.code != "0000") {
                    layer.msg("获取采集状态失败:"+returnData.msg, { icon: 2 });
                } else {
                    //采集状态
                    var votoboCollectStatus = returnData.data.votoboCollectStatus;
                    var newmoreCollectStatus = returnData.data.newmoreCollectStatus;
                    var newmorejob = returnData.data.newmorejob;
                    var votobojob = returnData.data.votobojob;
                    if(votoboCollectStatus == 1){
                        //采集中
                        $("#gh_dataCollectEbayForm .collectStatus").css("color","red");
                        $("#gh_dataCollectEbayForm .collectStatus").html("采集中");
                        $("#gh_ebayCollectSubmit").prop("disabled", true);
                        $("#gh_ebayCollectSubmit").addClass("layui-btn-disabled");
                    }else{
                        $("#gh_dataCollectEbayForm .collectStatus").css("color","#999");
                        $("#gh_dataCollectEbayForm .collectStatus").html("未采集");
                        $("#gh_ebayCollectSubmit").prop("disabled", false);
                        $("#gh_ebayCollectSubmit").removeClass("layui-btn-disabled");
                    }
                    if(newmoreCollectStatus == 1){
                        //采集中
                        $("#gh_dataCollectSmtForm .collectStatus").css("color","red");
                        $("#gh_dataCollectSmtForm .collectStatus").html("采集中");
                        $("#gh_smtCollectSubmit").prop("disabled", true);
                        $("#gh_smtCollectSubmit").addClass("layui-btn-disabled");
                    }else{
                        $("#gh_dataCollectSmtForm .collectStatus").css("color","#999");
                        $("#gh_dataCollectSmtForm .collectStatus").html("未采集");
                        $("#gh_smtCollectSubmit").prop("disabled", false);
                        $("#gh_smtCollectSubmit").removeClass("layui-btn-disabled");
                    }
                    $("#gh_dataCollectSmtForm .lastStatus").html('');

                    if(newmorejob){
                        $("#gh_dataCollectSmtForm .job").css("font-style","italic");
                        $("#gh_dataCollectSmtForm .job").html(newmorejob);
                    }
                    if(votobojob){
                        $("#gh_dataCollectEbayForm .job").css("font-style","italic");
                        $("#gh_dataCollectEbayForm .job").html(votobojob);
                    }
                    if(returnData.data.newmoreCollectLastStatus.indexOf("success")>-1){
                        var lastSpan = "（上次执行：共采集"+returnData.data.newmoreCollectLastStatus.replace("success","个产品；执行时间")+"）" ;
                        $("#gh_dataCollectSmtForm .lastStatus").html(lastSpan);
                    }else  if(returnData.data.newmoreCollectLastStatus.indexOf("fail")>-1){
                        var lastSpan = "（上次执行：采集发生异常"+returnData.data.newmoreCollectLastStatus.replace("fail","；执行时间：")+"）" ;
                        $("#gh_dataCollectSmtForm .lastStatus").html(lastSpan);
                    }
                    $("#gh_dataCollectEbayForm .lastStatus").html('');
                    if(returnData.data.votoboCollectLastStatus.indexOf("success")>-1){
                        var lastSpan =  "（上次执行：共采集"+returnData.data.votoboCollectLastStatus.replace("success","个产品；执行时间")+"）" ;
                        $("#gh_dataCollectEbayForm .lastStatus").html(lastSpan);
                    }else  if(returnData.data.votoboCollectLastStatus.indexOf("fail")>-1){
                        var lastSpan =  "（上次执行：采集发生异常"+returnData.data.votoboCollectLastStatus.replace("fail","；执行时间：")+"）" ;
                        $("#gh_dataCollectEbayForm .lastStatus").html(lastSpan);
                    }
                }
            }
        });
    }



    //初始化页面数据
    var siteData;
    function initData(){
        //初始化站点
        console.log("初始化站点");
        $.ajax({
            type: "post",
            url: ctx + "/crawler/votobo/init",
            dataType: "json",
            success: function(returnData) {
                layui.admin.load.hide();
                if (returnData.code != "0000") {
                    layer.alert("初始化站点数据失败"+returnData.msg, { icon: 2 });
                } else {
                    //站点数据
                    // siteData = JSON.parse(returnData.data.sites);
                    siteData = (new Function(`return  ${returnData.data.sites}`))();
                }
            },
        });
    }
    initData();

    //弹出分类框
    $("#gh_prodCateBtn").click(function() {
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length < 1) {
            layer.msg("请选择需要修改类目的产品！");
            return;
        }
        admin.itemNewCate_select('layer-work-develop-gatherhot', 'LAY-work-develop-gatherhot-hidden', 'gh_prodCate',null,null,divProdCate);
    });
    $("#LAY-work-develop-gatherhot-btn1").click(function() {
        admin.itemNewCate_select('layer-work-develop-gatherhot1', 'LAY-work-develop-gatherhot-hidden1', 'LAY-work-develop-gatherhot-div1');
    });
    $("#LAY-work-develop-gatherhot-btn1_ebay").click(function() {
        admin.itemCat_select('layer-work-develop-gatherhot1_ebay', 'LAY-work-develop-gatherhot-hidden1_ebay', 'LAY-work-develop-gatherhot-div1_ebay','/prodhotsale/getEbayUKCateList.html','/prodhotsale/searchEbayUKCate.html');
    });

    $('button[type="reset"]').click(function() {
        $("#LAY-work-develop-gatherhot-div1").html('');
        $('#LAY-work-develop-gatherhot-hidden1').val('');
        $("#LAY-work-develop-gatherhot-div1_ebay").html('');
        $('#LAY-work-develop-gatherhot-hidden1_ebay').val('');
    })

    // $("#gh_setCateBtn").click(function() {
    function divProdCate() {
        var cateId = $("#LAY-work-develop-gatherhot-hidden").val();
        var cateStr = $('#gh_prodCate').text();
        if (!cateId) {
            layer.msg("未选择商品分类");
            return;
        }
        var checkStatus = table.checkStatus('gh_hotTable');
        if (checkStatus.data.length > 0) {
            layer.confirm('确定将选中的商品分配到类目:' + cateStr + '吗?', { icon: 3, title: '手动分类' }, function(index) {
                var ids = [];
                for (var i = 0; i < checkStatus.data.length; i++) {
                    ids.push(checkStatus.data[i].id);
                }
                layui.admin.load.show();
                $.ajax({
                    type: "post",
                    url: ctx + "/prodhotsale/updatecate.html",
                    dataType: "json",
                    traditional: true,
                    data: {
                        ids: ids,
                        cateId: cateId
                    },
                    success: function(returnData) {
                        layui.admin.load.hide();
                        if (returnData.code != "0000") {
                            layer.alert(returnData.msg, { icon: 2 });
                            return;
                        }
                        layer.msg("手动分类成功");
                        table.reload('gh_hotTable', { where: serializeObject($('#gh_searchForm')) });
                    }
                });
                layer.close(index);
            });
        }
    };

    function serializeObject(form) {
        var o = {};
        $.each(form.serializeArray(), function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    }
});
/**
 * 匹配类目弹框表格的全选事件,以及获取isFixedCate
 * 1.获取美化后的元素和checkbox复选框
 * 2.需要保证美化后的元素的点击选中和checked一致
 */
function checkbox_switch(tableId) {
    /*获取表头checkbox和美化后的元素*/
    var th_checkbox = $(tableId).find('#th_cb'),
        oth_checkbox = th_checkbox.next();
    /*获取表内checkbox和美化后的元素*/
    var td_checkbox = $(tableId).find('tbody td:first-child input[type="checkbox"]'),
        otd_checkbox = td_checkbox.next();
    /*全选和反全选事件*/
    oth_checkbox.click(function() {
        /*获取checkbox的状态*/
        var isChecked = th_checkbox.prop('checked');
        if (isChecked) {
            otd_checkbox.addClass('layui-form-checked');
            td_checkbox.prop('checked', true);
        } else {
            otd_checkbox.removeClass('layui-form-checked');
            td_checkbox.prop('checked', false);
        }
    });
    otd_checkbox.click(function() {
        /*获取选中的checkbox的长度*/
        var len = $(tableId).find('tbody td:first-child input[type="checkbox"]:checked').length;
        if (td_checkbox.length == len) {
            oth_checkbox.addClass('layui-form-checked');
            th_checkbox.prop('checked', true);
        } else {
            oth_checkbox.removeClass('layui-form-checked');
            th_checkbox.prop('checked', false);
        }

    });

    /*获取表头switch和美化后的元素*/
    var th_switch = $(tableId).find('#sw_cb'),
        oth_switch = th_switch.next();
    /*获取表内switch和美化后的元素*/
    var td_switch = $(tableId).find('tbody td:nth-child(5) input[type="checkbox"]'),
        otd_switch = td_switch.next();
    /*全选和反全选事件*/
    oth_switch.click(function() {
        /*获取checkbox的状态*/
        var isChecked = th_switch.prop('checked');
        if (isChecked) {
            otd_switch.addClass('layui-form-onswitch');
            td_switch.prop('checked', true);
        } else {
            otd_switch.removeClass('layui-form-onswitch');
            td_switch.prop('checked', false);
        }
    });
    otd_switch.click(function() {
        /*获取选中的checkbox的长度*/
        var len_switch = $(tableId).find('tbody td:nth-child(5) input[type="checkbox"]:checked').length;
        if (td_switch.length == len_switch) {
            oth_switch.addClass('layui-form-onswitch');
            th_switch.prop('checked', true);
        } else {
            oth_switch.removeClass('layui-form-onswitch');
            th_switch.prop('checked', false);
        }
    });
}


function setField() {
    var type = $("#gh_searchForm input[name=listingStatus]").val();
    var brandComponent = $("[data-field='tortBrand']");
    var reasonComponent = $("[data-field='devFailReason']");
    var salesNum = $("[data-field='salesNum']");
    var productInfo = $("[data-field='productInfo']");
    reasonComponent.addClass('layui-hide');
    brandComponent.addClass('layui-hide');
    salesNum.addClass('layui-hide');
    productInfo.addClass('layui-hide');
    if (type == '' || type == 4 || type == 9) {
        brandComponent.removeClass('layui-hide');
        reasonComponent.removeClass('layui-hide');
    }
    if (type == '' || type == 5 || type == 6) {
        salesNum.removeClass('layui-hide');
        productInfo.removeClass('layui-hide');
        $("[data-field='title']").each(function(index,element){
            $(element).find('div').eq(0).width(220);
        });
        $("[data-field='pSku']").each(function(index,element){
            $(element).find('div').eq(0).width(120);
        });
    }
    if (type == 1 || type == 2 || type == 3){
        $("[data-field='time']").each(function(index,element){
            $(element).find('div').eq(0).width(200);
        });
        $("[data-field='pSku']").each(function(index,element){
            $(element).find('div').eq(0).width(200);
        });
    }
    if (type == 4){
        $("[data-field='imgUri']").each(function(index,element){
            $(element).find('div').eq(0).width(110);
        });
        $("[data-field='time']").each(function(index,element){
            $(element).find('div').eq(0).width(110);
        });
    }
    if (type == ''){
        $("[data-field='productInfo']").each(function(index,element){
            $(element).find('div').eq(0).width(100);
        });
        $("[data-field='imgUri']").each(function(index,element){
            $(element).find('div').eq(0).width(100);
        });
        $("[data-field='time']").each(function(index,element){
            $(element).find('div').eq(0).width(100);
        });
    }
    if (type == 9){
        $("[data-field='imgUri']").each(function(index,element){
            $(element).find('div').eq(0).width(110);
        });
        $("[data-field='time']").each(function(index,element){
            $(element).find('div').eq(0).width(110);
        });
    }

    setExpandCols();
    hiddenCols();
}

function hiddenCols() {
    $("[data-field='platCode']").css('display', 'none');
    $("[data-field='prodPid']").css('display', 'none');
    $("[data-field='prodSaleCountList']").css('display', 'none');
    $("[data-field='cateFullName']").css('display', 'none');
}

function setExpandCols() {
    // var width = $("[data-field='devNote']").width();
    // $('.gather_hot_dev_note_table').width(width-16);
    // var devRemarkWidth = $("[data-field='gatherHotdevRemark']").width();
    // $('.gather_hot_dev_remark_table').width(devRemarkWidth-16);
}


function load(returnData) {
    // 处理物流属性 销量
    let salecountList;
    const data = returnData.data;
    if (data) {
        for (var i = 0; i < data.length; ++i) {
            salecountList = data[i].prodSaleCountList;
            if (salecountList && salecountList.length > 0) {
                for (var j = 0; j < salecountList.length; j++) {
                    switch (salecountList[j].countDays) {
                        case 7:
                            data[i].sevenSales = salecountList[j].saleNum || 0;
                            break;
                        case 15:
                            data[i].fifteenSales = salecountList[j].saleNum || 0;
                            break;
                        case 30:
                            data[i].thirtySales = salecountList[j].saleNum || 0;
                            break;
                    }
                }
            } else {
                data[i].sevenSales = 0;
                data[i].fifteenSales = 0;
                data[i].thirtySales = 0;
            }
        }
    }
    imageLazyload();
    imageLazyloadOrigin();

    setCount("gatherhotTab1",0);
    setCount("gatherhotTab2",0);
    setCount("gatherhotTab3",0);
    setCount("gatherhotTab4",0);
    setCount("gatherhotTab5",0);
    setCount("gatherhotTab6",0);
    setCount("gatherhotTab9",0);
    setCount("gatherhotTab",0);
    if(returnData.msg){
        const jsonMsg = JSON.parse(returnData.msg);
        setCount("gatherhotTab1",jsonMsg['count_1']);
        setCount("gatherhotTab2",jsonMsg['count_2']);
        setCount("gatherhotTab3",jsonMsg['count_3']);
        setCount("gatherhotTab4",jsonMsg['count_4']);
        setCount("gatherhotTab5",jsonMsg['count_5']);
        setCount("gatherhotTab6",jsonMsg['count_6']);
        setCount("gatherhotTab9",jsonMsg['count_9']);
        setCount("gatherhotTab",jsonMsg['countAll']);
    }

    $(".gatherhotCateShow").on({
        mouseenter:function(){
            var that = this;
            var cateFullName = $(that).attr("cateFullName");
            if(cateFullName && cateFullName.indexOf("undefined") === -1){
                tips =layer.tips("<span style='color:#000;'>"+cateFullName+"</span>",that,{tips:[3,'#fff'],time:0,area: 'auto',maxWidth:500});
            }else {
                tips =layer.tips("<span style='color:#000;'>其他</span>",that,{tips:[3,'#fff'],time:0,area: 'auto',maxWidth:500});
            }
        },
        mouseleave:function(){
            layer.close(tips);
        }
    });

    // theadHandle().fixTh({id:'#layui-card-gatherhot',h:150,dv1:'.layui-tab-title',dv2:'.joomPublish_table_head',dv3:'#joom_btn_show_hide',i:35});
    theadHandle().fixTh({id:'#layui-card-gatherhot',h:150,i:35});
}

function setCount(tabId,count) {
    var tab = $('#'+tabId);
    var text = tab.text();
    var trimHead = text.substr(text.indexOf('ဆ') + 1);
    var title = trimHead.substr(0, text.indexOf("（"));
    tab.text(title + "（" + nullToZero(count) + "）");
}

function nullToZero(number) {
    if(number){
        return number;
    }
    return 0;
}

function changeGatherhotDevNoteColspantable(obj) {
  changeColspantableHot(obj,'dev_note_header','myj-hide');
}

function changeColspantableHot(obj,headerclass,toggleclass) {
    $(obj).prev().find("."+toggleclass).toggle();
    var str=$(obj).html();
    if(str.indexOf("展开")>-1){
        $(obj).prev().find('.'+headerclass).css("display","none");
        $(obj).html("- 收起")
    }else{
        $(obj).prev().find('.'+headerclass).css("display","table-row");
        $(obj).html("+ 展开")
    }
}

UnifiedFixedFn('gatherhotCard');

//根据屏幕尺寸决定是否添加类名productlist_header_button
(function() {
    var screenWidth = window.screen.width
    if (screenWidth < 1600) {
        $('#LAY-work-develop-gatherhot').addClass('gatherhot_header_button_smallScreen')
        $('#LAY-work-develop-gatherhot-tools').find('button').addClass('layui-btn-xs')
        $('#LAY-work-develop-gatherhot-tools').find('button').removeClass('layui-btn-sm')
    } else {
        $('#LAY-work-develop-gatherhot').removeClass('gatherhot_header_button_smallScreen')
        $('#LAY-work-develop-gatherhot-tools').find('button').removeClass('layui-btn-xs')
        $('#LAY-work-develop-gatherhot-tools').find('button').addClass('layui-btn-sm')
    }
})()


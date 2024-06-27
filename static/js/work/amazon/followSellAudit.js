layui.use(['admin', 'form', 'table', 'layer', 'formSelects','layedit', 'element', 'laypage','laydate'], function() {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        element = layui.element,
        laydate = layui.laydate,
        admin = layui.admin,
        formSelects = layui.formSelects,
        layer = layui.layer;
       var salesSiteData;
        var followSellAudit = {
            init:function(){
                var _this = this
                followSellGetSite(function(returnData){
                    salesSiteData=returnData.data;
                    appendSelect($('#AmazonFollowSellForm').find('select[name="salesSite"]'),returnData.data,'code','name')
                })
                followSellGetOwner(function(returnData){
                    appendSelect($('#AmazonFollowSellForm').find('select[name=bizzOwnerIdList]'), returnData.data, 'id', 'userName');
                    formSelects.render('followSellAuditbizzOwnerIdInfo');
                    appendSelect($('#followSell_person_search_select'), returnData.data, 'id', 'userName');
                    formSelects.render('followSell_person_search_select');
                })
                laydate.render({
                    elem: '#AmazonFollowSellForm input[name="time"]', //渲染时间
                    range: true
                })
                _this.adminProductChoose()
                _this.searcheTrigger()
                _this.submitData()
                _this.batchUpdate()
            },
            adminProductChoose:function(){
            //弹出分类框
            $("#LAY-AmazonFollowSell-btn1").click(function() {
                admin.itemCat_select('LAY-AmazonFollowSell-producttpl', 'LAY-AmazonFollowSell-hidden1', 'LAY-AmazonFollowSell-div1')
            });
            },
            followSellTable:function(data){
                var _this = this
                table.render({
                    elem: '#followSellAudit_table',
                    data:data,
                    cols: [
                        [
                            { checkbox: true, width: 30 },
                            { title: "图片", field: "asinSrc", templet: "#followSellAuditimgtpl" },
                            { title: "ASIN", field: "asin",templet:'#followSellAuditASINtpl'},
                            { title: "品牌", field: "brand",templet:'#followSellAuditBrandInfotpl'},
                            { title: "站点", field: "salesSite"},
                            { title: "排名", field: "",templet: "#followSellAuditRanktpl"},
                            { title: "评价", field: "rateLev",templet:'#followSellAuditEvaluationtpl'},
                            { title: "商品子sku", field: "prodSSku",templet:'#followSellAuditprodSSkutpl'},
                            { title: "总成本(￥)", field: "totalCost"},
                            { title: "总重量(g)", field: "totalWeight"},
                            { title: "价格", templet: "#followSellAuditPricetpl"},
                            { title: "人员",templet: "#followSellAuditPersontpl" },
                            { title: "审核备注", field: "auditRemark"},
                            { title: "时间",templet: "#followSellAuditTimetpl",width:200},
                            { title: '操作', toolbar: "#followSellAuditTooltpl", width: 80 }
                        ]
                    ],
                    page: false,
                    limit:500,
                    id: 'followSellAudit_table',
                    created:function(res){
                    },
                    done: function(res) {

                        _this.listenOnTool()
                        _this.getProdDetail()
                        imageLazyload()
                    }
                })
            },
            followSellPage:function(data,count){
                laypage.render({
                    elem: 'followSellAudit_Page',
                    curr: data.page,
                    limit: data.limit,
                    limits: [100, 200, 500],
                    layout: ['prev', 'page', 'next', 'count','limit'],
                    count: count,
                    jump: function(obj, first) {
                        $('#AmazonFollowSellForm input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
                        $('#AmazonFollowSellForm input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
                        //首次不执行
                        if (!first) {
                            data.page = obj.curr;
                            data.limit = obj.limit;
                            $('#followSellAuditSearch').click()
                        }
                    }
                });
            },
            searcheTrigger:function(){
                element.on('tab(followSellAuditTab)', function(data) {
                    var status = data.elem.context.dataset.index
                    $('#AmazonFollowSellForm input[name="auditStatus"]').val(status)
                    $('#followSellAuditSearch').click()
                });
            },
            submitData:function(){
                var _this = this
                form.on('submit(followSellAuditSearch)',function(data){
                    var data = data.field//表单数据
                    data=getFollowSellAuditSearchData(data);
                    getFollowSellAuditList(data,function(returnData){
                        returnData.data.map(function(item){
                            item.auditStatus += ''
                            return item
                        })
                        $('#followSellAuditTab').find('.layui-this').find('span').text(returnData.count)
                        _this.followSellTable(returnData.data)
                        _this.followSellPage(data,returnData.count)
                    })
                })
            },
            listenOnTool:function(){
                var _this = this
                table.on('tool(followSellAudit_table)',function(obj){
                    var event = obj.event
                    var data = obj.data
                    if(event=="modifyProduct"){
                        _this.modifyProduct(data)
                    }else if(event=="AuditProduct"){
                        _this.auditProduct(data,'1')
                    }else if(event=="AuditProductLog"){
                        _this.followLog({salesSite:data.salesSite,asin:data.asin})
                    }
                });
            },
            auditProduct:function(data,type){
                layer.open({
                    type: 1,
                    title: '审核商品',
                    btn: ['保存','关闭'],
                    area:['30%','40%'],
                    content: $('#followSellAudit_auditProduct').html(),
                    success: function(layero, index) {
                        if(type=="1"){
                        form.val('followSellAuditauditForm',data)
                        }
                        form.render("radio");
                    },
                    yes: function(index, layero) {
                        form.on('submit(followSellAuditauditSubmit)',function(obj){
                            var submitdata = obj.field//表单数据
                            if(type=="1"){ //单个asin审核
                                auditFollowSellAudit(submitdata,function(returnData){
                                    layer.msg(returnData.msg||"已提交审核")
                                    $('#followSellAuditSearch').click()
                                    layer.close(index)
                                })
                            }else{
                                batchAudit({idList:data,auditStatus:submitdata.auditStatus,auditRemark:submitdata.auditRemark},function(returnData){
                                    layer.msg(returnData.msg||"已提交审核")
                                    $('#followSellAuditSearch').click()
                                    layer.close(index)
                                })
                            }
                        })
                        $('#followSellAuditauditSubmit').click()
                    }
                })
            },
            modifyProduct:function(data){
                var isEdit = data?true:false
                layer.open({
                    type: 1,
                    title: '修改商品',
                    btn: ['保存','关闭'],
                    area:['30%','40%'],
                    content: $('#followSellAudit_modifyProduct').html(),
                    success: function(layero, index) {
                        if(isEdit){
                            form.val('followSellAuditeditForm',data)
                        }
                    },
                    yes: function(index, layero) {
                        form.on('submit(followSellAuditeditSubmit)',function(data){
                            var data = data.field//表单数据
                            modifyFollowSellAudit(data,function(returnData){
                                layer.msg(returnData.msg||"修改成功")
                                layer.close(index)
                            })
                        })
                        $('#followSellAuditeditSubmit').click()
                    }
                })
            },
            batchUpdate:function(){
                var _this = this
                $('#followSellAuditTab').find('#followSellbatchUpdate').click(function(){
                    var data = table.checkStatus('followSellAudit_table').data
                    var sIdList = data.map(function(item){
                        return item.id
                    })
                    if(sIdList.length>0){
                        layer.confirm('确定批量更新?', {icon: 3, title:'提示'}, function(index){
                            batchUpdate({sIdList},function(returnData){
                                layer.msg(returnData.msg||'批量更新进行中')
                                layer.close(index)
                                $('#followSellAuditSearch').click()
                            })
                        });
                    }else{
                        layer.msg('请勾选要批量更新的子数据')
                    }
                })
                $('#followSellAuditTab').find('#followSellbatchAudit').click(function(){
                    var data = table.checkStatus('followSellAudit_table').data
                    var sIdList = data.map(function(item){
                        return item.id;
                    })
                    if(sIdList.length>0){
                        _this.auditProduct(sIdList,'2')
                    }else{
                        layer.msg('请勾选要批量审核的子数据',{icon:0})
                    }
                })
            },
            getProdDetail:function(){
                $('td[data-field="prodSSku"] div').click(function(){
                    var id = $(this).find('div').attr('data-id')
                    let options = {
                        showOaNewCate: $(this).attr('data-oanewcate')
                    }
                    if (!isNaN(id)) {
                        layui.admin.publicDetail(
                            function() { renderProduct(id,undefined,options) },
                            function(layero){
                                //一键下载图片
                                var downLoadImgBtn = '<button id="downLoadImgBtn" class="layui-btn layui-btn-primary layui-btn-sm"  style="float: left;">图片下载</button>'
                                $(layero).find('.layui-layer-btn a:first').before(downLoadImgBtn);
                                $('#downLoadImgBtn').click(function(){
                                    var pSku = $('.unEditProdTplForm [name=pSku]').val()
                                    console.log(pSku)
                                    $(layero).find('img').each(function(index,item){
                                        downLoadImg(item, pSku)
                                    })
                                })
                            }
                        )
                    }
                })
            },
            followLog:function(data){
                const ASIN = data.parentAsin||data.asin
                layer.open({
                    type: 1,
                    title: ASIN + '日志',
                    btn: ['关闭'],
                    area: ['100%', '100%'],
                    content: $('#followSellAuditLogPop').html(),
                    success: function(index, layero) {
                        getFollowLog(data,function(returnData){
                            table.render({
                                elem: '#followSellAuditLogTable',
                                data:returnData.data,
                                cols: [[ //取消跟卖计划
                                    { title: "时间", field: "opResult", templet: "<div>{{Format(d.opTime,'yyyy-MM-dd hh:mm')}}</div>" },
                                    { title: "操作人", field: "opUserName"},
                                    { title: "动作", field: "opType"},
                                    { title: "结果", field: "opResultDesc" },
                                    { title: "店铺", field: "storeAcct" },
                                    { title: "站点", field: "salesSite" },
                                ]],
                                page: false,
                                limit:500,
                                id: 'followSellAuditLogTable',
                                created:function(res){
                                },
                                done: function(res) {
                                }
                            })
                        })
                    }
                })
            },
        }

        followSellAudit.init()

    //页面数据请求
    // 站点枚举数据
    function followSellGetSite(func){
        initAjax('/enum/getSiteEnum.html?platCode=amazon', 'post', {}, function(returnData) {
            if (func) {
                func(returnData)
            }
        }, 'application/x-www-form-urlencoded')
    }

    //开发专员枚举数据
    function followSellGetOwner(func){
        initAjax('/sys/listAllUser.html', 'POST', {}, function(returnData) {
            if(func){
                func(returnData)
            }
    }, 'application/x-www-form-urlencoded');
    }

    //获取跟卖审核列表
    function getFollowSellAuditList(data,func){
        initAjax('/amazonFsSubProduct/queryAmazonFsSubProductPage.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //修改跟卖信息
    function modifyFollowSellAudit(data,func){
        initAjax('/amazonFsSubProduct/update.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //审核跟卖信息
    function auditFollowSellAudit(data,func){
        initAjax('/amazonFsSubProduct/audit.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }
    //批量更新
    function batchUpdate(data,func){
        initAjax('/amazonFsParentProduct/updateAsinInfo.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    //批量审核
    function batchAudit(data,func){
        initAjax('/amazonFsSubProduct/auditList.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }

    /**
     * 添加跟卖商品按钮点击
     */
    $("#followSellbatch_addFs_btn").click(function(){
        followSell_bactchAddFs();
    });

    /**
     * 获取表单搜索参数
     * @param data
     * @returns {*}
     */
   function  getFollowSellAuditSearchData(data){
        data.bizzOwnerIdList = data.bizzOwnerIdList !== "" ? data.bizzOwnerIdList.split(',') : [];
        data[data.followSell_person_search_type] = data.followSell_person_search_select !== "" ? data.followSell_person_search_select.split(',') : [];
        data[data.skuType] = data.skuValue;
        data[data.cateType+'CateRankStart'] = data.CateRankStart;
        data[data.cateType+'CateRankEnd'] = data.CateRankEnd;
        if (data.time) {
            data.startTime = Date.parse(data.time.split(" - ")[0] + " 00:00:00");
            data.endTime = Date.parse(data.time.split(" - ")[1] + " 23:59:59");
        }
        return data;
    }
    // 导出跟卖产品
    $("#followSellAudit_exportBtn").click(function () {
        var selectedData = table.checkStatus('followSellAudit_table').data;
        var idList = [];
        for (var i = 0; i < selectedData.length; ++i) {
            idList.push(selectedData[i].id)
        }
        var data = serializeObject($('#AmazonFollowSellForm'));
        data=getFollowSellAuditSearchData(data);
        data.idList = idList.join(',')
        var confirmindex = layer.confirm('确认导出当前搜索条件下的跟卖产品？', {btn: ['确认', '取消']}, function () {
            submitForm(data, ctx + '/amazonFsSubProduct/exportAmazonFsSubProductAuditInfo.html', "_blank")
            layer.close(confirmindex);
        }, function () {
            layer.close(confirmindex);
        })
    });
    /**
     * 批量添加跟卖
     */
    function followSell_bactchAddFs(){
        var index = layer.open({
            type: 1,
            title: '添加跟卖产品',
            area: ['80%', "60%"],
            btn: ["关闭"],
            content: $('#followSell_bacthAddFsLayer').html(),
            success: function() {
                /**站点下拉框*/
                appendSelect( $("#followSell_bacthAddFs_salesSite"),salesSiteData,'code','name')
                $("#followSell_asinList_search_btn").click(function() {
                    followSell_searchAsinList(); //解析跟卖asin数据
                });
                $("#followSell_addFsPool_btn").click(function () {
                    var itemData = table.checkStatus('followSell_addFsPool_table').data; //获取选择asin
                    followSell_addAsinToPool(itemData);
                });
            },
            yes: function(index, layero) {
                layer.close(index);
            },
            end: function() {
                layer.close(index);
            }
        });
    }

    /**搜索跟卖asin**/
   function  followSell_searchAsinList(){
       var formData = serializeObject($('#followSell_bacthAddForm'));
       var salesSite = formData.salesSite;
       if (salesSite == null || salesSite == '') {
           layer.msg('请选择站点', {icon: 0});
           return;
       }
       var asinList = formData.asinList;
       if (asinList == null || asinList == '') {
           layer.msg('请输入asin', {icon: 0});
           return;
       }
       asinList = asinList.replace(/，/g,',');
       var asinArray = asinList.split(",");
       if(asinArray.length>300){
           layer.msg('最多输入300个asin', {icon: 2});
           return;
       }
       var subData={salesSite:salesSite,asinListStr:asinList};
        loading.show();
        $.ajax({
            url: ctx + '/plugin/searchAsinList.html',
            data: subData,
            dataType: "json",
            type: "post",
            success: function(returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    table.render({
                        elem: '#followSell_addFsPool_table',
                        data:returnData.data,
                        cols: [
                            [
                                { checkbox: true, width: 30 },
                                { title: "图片", width: 70, field: "asinSrc", templet: "#followSellAuditimgtpl" },
                                { title: "产品标题",width: 300,  field: "title" },
                                { title: "详情", field: "asin",templet:'#followSellAuditASINtpl'},
                                { title: "商品子SKU", templet:'#followSell_addFsPool_prodSSku_tpl'},
                                { title: "多个一卖数量<div style='display: flex;align-items: center'><input class='layui-input' name='fsaInput'><a type='button' class='layui-btn layui-btn-xs' name='fsaBatchSetting'>批量设置</a></div>", templet:'#followSell_addFsPool_packNum_tpl'},
                                { title: "品牌",  templet:'#followSellAuditBrandInfotpl'},
                                { title: "排名", field: "",templet: "#followSellAuditRanktpl"},
                                { title: "购物车价", width: 70,  field: "onlineCartPrice"},
                                { title: "评价", field: "rateLev",templet:'#followSellAuditEvaluationtpl'},
                                { title: '操作', toolbar: "#followSell_addFsPool_operate_tpl", width: 80 }
                            ]
                        ],
                        page: false,
                        id: 'followSell_addFsPool_table',
                        done: function(res) {
                            imageLazyload();
                            table.on('tool(followSell_addFsPool_table)', function(obj) {
                                var data = obj.data, //获得当前行数据
                                    layEvent = obj.event; //获得 lay-event 对应的值
                                var itemData = [];
                                itemData.push(data);
                                followSell_addAsinToPool(itemData);
                            });
                        }
                    })
                } else {
                    layer.msg(returnData.msg, { icon: 5 });
                }
            },
            error: function() {
                layer.msg("服务器正忙", { icon: 5 });
            }
        });
   }

   $(document).on("click","[name=fsaBatchSetting]",function () {
       const inputVal = $("input[name=fsaInput]").val()
       if(!inputVal){
           return layer.msg("请输入需要设置的数量",{icon:2})
       }

       // layui.table.cache.followSell_addFsPool_table
       $("input[name=buyNumber]").val(inputVal)

   })

  /**加入跟卖池**/
    function  followSell_addAsinToPool(itemData){
      if (itemData == null || itemData.length < 1) {
          layer.msg("请选择要加入跟卖池的asin数据", {icon: 0});
          return;
      }
      for (var index in itemData) {
          var obj = itemData[index];
          var prodSSku = $("#followSell_sku_" + obj.asin).val();
          if (prodSSku == null || prodSSku == '') {
              layer.msg("请输入跟卖asin " + obj.asin + " 对应的商品sku", {icon: 0});
              return
          }
          obj.prodSSku = prodSSku;
          var packNum = $("#followSell_packNum_" + obj.asin).val();
          if (packNum == null || packNum == '') {
              layer.msg("请输入跟卖asin " + obj.asin + " 的多个一卖数量", {icon: 0});
              return
          }
          if (packNum < 1 || String(packNum).indexOf(".") >-1) {
              layer.msg("跟卖asin " + obj.asin + " 的多个一卖数量必须大于0的正整数", {icon: 0});
              return
          }
          obj.packNum = packNum;
      }
      loading.show();
      $.ajax({
          url: ctx + '/amazonFsSubProduct/addAmazonFsDraftList.html',
          data: JSON.stringify(itemData),
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          type: "post",
          success: function (returnData) {
              loading.hide();
              if (returnData.code == "0000") {
                  layer.msg(returnData.msg,{icon:1});
              }else{
                  layer.open({
                      title: '加入跟卖池结果:',
                      content: returnData.msg,
                      offset: '100px',
                      area: '500px',
                  });
              }
          },
          error: function () {
              loading.hide();
              layer.msg("服务器正忙", {icon: 5});
          }
      });
    }
    
    //设获取日志
    function getFollowLog(data,func){
        initAjax('/amazonFsParentProduct/listLog.html', 'post', JSON.stringify(data), function(returnData) {
            if (func) {
                func(returnData)
            }
        })
    }
    
    //填充下拉框
    function appendSelect(aDom, data, code, label, attachment) {
        aDom.empty();
        var option = '<option value="">请选择</option>'
        for (var i in data) {
            if (typeof data[i] !== 'string') {
                    data[i].code = data[i][code] || data[i].code
                data[i].label = data[i][label] || data[i].label;
            }
            option += '<option value="' + (typeof data[i].code!='undefined'?data[i].code:data[i]) + '">' + (data[i].label || data[i]) + '</option>'
        }
        aDom.append(option)
        form.render()
    }

    function initAjax(url, method, data, func, contentType) { //初始化ajax请求
        loading.show()
        $.ajax({
            type: method,
            url: ctx + url,
            dataType: 'json',
            async: true,
            data: data,
            contentType: contentType || 'application/json',
            success: function(returnData) {
                loading.hide()
                if (returnData.code == "0000") {
                    func(returnData)
                } else {
                    layer.msg(returnData.msg, { icon: 2 });
                }
            },
            error: function(returnData) {
                layui.admin.load.hide();
                if (XMLHttpRequest.status == 200) {
                    layer.msg("请重新登录", { icon: 7 });
                } else {
                    layer.msg("服务器错误");
                }
            },
        })
    }

});
;(function(){

    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','layedit','upload'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            laydate = layui.laydate,
            formSelects = layui.formSelects,
            layedit = layui.layedit,
            upload = layui.upload,
            form = layui.form;
        form.render();
        render_hp_orgs_users("#walmartpublish_searchForm");
        formSelects.render('walmartpublish_prodIsSaleStatus')
        //渲染时间walmartpublish_times
        laydate.render({
            elem: '#walmartpublish_times'
            ,range: true
        });       
        
        //tab切换
        element.on('tab(walmartpublish_tabs)', function (data) {
            var $searchType = $('#walmartpublish_searchForm').find('[name=listingStatus]');
            var $isListing = $('#walmartpublish_searchForm').find('[name=isListing]');
            var $generateBtn= $('#walmartpublish_generateProductBtn'); //生成店铺商品按钮
            var $deleteBtn = $('#walmartpublish_deleteStoreBtn'); //删除店铺商品
            var $immeBtn = $('#walmartpublish_immediatelyBtn'); //立即刊登按钮
            var $refreshBtn = $('#walmartpublish_refreshBtn'); //重新发布按钮
            var $exportBtn = $('#walmartpublish_exportBtn'); //导出按钮
            var $publishItemBtn = $('#walmartpublish_publishItemBtn') //立即刊登
            var $orderBy_0 = $('.orderBy_0');
            var $orderBy_1 = $('.orderBy_1');
            var $orderBy_2 = $('.orderBy_2');
            if(data.index == 0){ //商品
                $searchType.val(-2);
                $generateBtn.removeClass('disN');
                $deleteBtn.addClass('disN');
                $immeBtn.addClass('disN');
                $refreshBtn.addClass('disN');
                $exportBtn.addClass('disN');
                $publishItemBtn.addClass('disN')
                $orderBy_0.removeClass('disN');
                $orderBy_1.addClass('disN');
                $orderBy_2.addClass('disN');
                $isListing.val('false');
            }else if(data.index == 1){ //待刊登
                $searchType.val(0);
                $generateBtn.addClass('disN');
                $deleteBtn.removeClass('disN');
                $immeBtn.removeClass('disN');
                $refreshBtn.addClass('disN');
                $exportBtn.removeClass('disN');
                $publishItemBtn.removeClass('disN')
                $orderBy_0.addClass('disN');
                $orderBy_1.removeClass('disN');
                $orderBy_2.addClass('disN');
                $isListing.val('true');
            }else if(data.index == 2){ //刊登中
                $searchType.val(3);
                $generateBtn.addClass('disN');
                $deleteBtn.addClass('disN');
                $immeBtn.addClass('disN');
                $refreshBtn.addClass('disN');
                $exportBtn.addClass('disN');
                $publishItemBtn.addClass('disN')
                $orderBy_0.addClass('disN');
                $orderBy_1.removeClass('disN');
                $orderBy_2.addClass('disN');
                $isListing.val('true');
            }else if(data.index == 3){ //刊登成功
                $searchType.val(1);
                $generateBtn.addClass('disN');
                $deleteBtn.addClass('disN');
                $immeBtn.addClass('disN');
                $refreshBtn.addClass('disN');
                $exportBtn.addClass('disN');
                $publishItemBtn.addClass('disN')
                $orderBy_0.addClass('disN');
                $orderBy_1.addClass('disN');
                $orderBy_2.removeClass('disN');
                $isListing.val('true');
            }else if(data.index == 4){ //刊登失败
                $searchType.val(2);
                $deleteBtn.removeClass('disN');
                $generateBtn.addClass('disN');
                $immeBtn.addClass('disN');
                $refreshBtn.removeClass('disN');
                $exportBtn.addClass('disN');
                $publishItemBtn.addClass('disN')
                $orderBy_0.addClass('disN');
                $orderBy_1.addClass('disN');
                $orderBy_2.removeClass('disN');
                $isListing.val('true');
            }
            form.render('select');
            $('[lay-filter=walmartpublish_submit]').trigger('click');
        });
        var walmartpublishName = {
            //select初始化缓存
            selectCache: function(){
                var _this = this;
                var WALMART_SELECTINIT = sessionStorage.getItem('WALMART_SELECTINIT');
                var WALMART_CATE = sessionStorage.getItem('WALMART_CATE');
                if(!WALMART_SELECTINIT|| !WALMART_CATE){
                    Promise.all([_this.initAjax(),_this.walmartCateAjax()]).then(function(result){
                        _this.renderSelect(result);
                        sessionStorage.setItem('WALMART_SELECTINIT', JSON.stringify(result[0]));
                        sessionStorage.setItem('WALMART_CATE', JSON.stringify(result[1]));
                    })
                }else{
                    var WALMART_SELECTINITObj = new Function(`return ${WALMART_SELECTINIT}`)();
                    var WALMART_CATEObj = new Function(`return ${WALMART_CATE}`)();
                    _this.renderSelect([WALMART_SELECTINITObj,WALMART_CATEObj]);
                }
            },
            //渲染搜索select
            renderSelect: function(dataArr){
                //创建人
                var selectInitArr = dataArr[0] || {};
                //开发专员
                commonRenderSelect('walmartpublish_bizzOwnderIdStr', selectInitArr.bizzOwners || [], {
                    name: 'userName',
                    code: 'id'
                }).then(function(){
                    formSelects.render('walmartpublish_devPerson');
                });
                //标签
                commonRenderSelect('walmartpublish_tag', selectInitArr.tags|| [], {
                    name: 'name',
                    code: 'name'
                }).then(function(){
                    form.render('select');
                });
                //模板创建人
                commonRenderSelect('walmartpublish_modeCreatId', selectInitArr.walmartCreatMap|| [], {
                    name: 'userName',
                    code: 'id'
                }).then(function(){
                    form.render('select');
                });
                //物流属性
                commonRenderSelect('walmartpublish_logisticsAttrStr', selectInitArr.logisAttrList||[]).then(function(){
                    formSelects.render('walmartpublish_logisticsAttrStr');
                });
                //开发类型
                commonRenderSelect('walmartpublish_devTypeStr', selectInitArr.devTypes||[]).then(function(){
                    formSelects.render('walmartpublish_devTypeStr');
                });
                //渲染沃尔玛类目
                var walmart_cateData = dataArr[1] || [];
                var optStr = '<option value="">全部</option>';
                for(var i=0;i<walmart_cateData.length; i++){
                    var item = walmart_cateData[i];
                    var sonList = item.walmartList || [];
                    optStr += `<option value="${item.parentCategoryName}">${item.parentCategoryName}<option>`;
                    if(sonList.length >0) {
                        for(var j=0; j<sonList.length;j++){
                            var sonJ = sonList[j];
                            optStr +=`<option value="${sonJ.categoryName}">&nbsp;&nbsp;${sonJ.categoryName}</option>`;
                        }
                    }
                }
                $('#walmartpublish_cateName').html(optStr);
                form.render('select');
            },
            //数据处理
            dataHandle: function(data){
                if(data.times){
                    var timeArr =data.times.split(' - ');
                    data.skuTimeStart = timeArr[0];
                    data.skuTimeEnd = timeArr[1];
                }else{
                    data.skuTimeStart = '';
                    data.skuTimeEnd ='';
                }
                delete data.times;
                return data;
            },
            //表格数据渲染
            tableRender: function(data){
                var _this = this;
                table.render({
                    elem: '#walmartpublish_table',
                    method: 'post',
                    url: '/lms/walmart/listing/query.html',
                    where:  data,
                    page: true,
                    limits: [50, 100, 300],
                    limit: 100,
                    id: "walmartpublish_tableId",
                    cols: _this.colsSwitch(data),
                    done: function(res){
                        _this.watchBar();
                        imageLazyload();
                        $("[data-field=listingId]").hide()
                        $('#walmartpublish_tabs').find('li>span').html('');
                        $('#walmartpublish_tabs').find('li.layui-this>span').html(`${res.count}`);
                    }
                });
            },
            colsSwitch: function(data){
                var listingStatus = data.listingStatus;
                var cols = [];
                if(listingStatus == -2){//商品
                    var col = [
                        {type: 'checkbox', width: 30},
                        {title:'图片',field: 'image',templet:'#walmartpublish_img', width: 70},
                        {title: '英文标题', field: 'enTitle'},
                        {title: '商品名', field: 'cnTitle',width:135},
                        {title: '开发专员', field: 'bizzOwner',width:75},
                        {title: '父SKU',field:'pSku', templet: '#walmartpublish_pSku',width:160},
                        {field: "detail",unresize:true,width:400,title: `
                        <div style="display:flex;">
                            <div style="width:130px;text-align:left;font-size:12px;">子SKU</div>
                            <div style="width:60px;text-align:center;font-size:12px;">颜色</div>
                            <div style="width:60px;text-align:center;font-size:12px;">尺寸</div>
                            <div style="width:60px;text-align:center;font-size:12px;">在售</div>
                            <div style="width:80px;text-align:center;font-size:12px;">可用/在途/未派</div>
                        </div>
                        `,style:"vertical-align: top",templet:"#walmartpublish_detail"},
                        {field: 'site',title: '站点',width: 50},
                        {title: '沃尔玛类目', field: 'walmartCategoryName'},
                        {title: '公司销量',field: '', templet: function(d){
                                let str = `<div>7日：${d.sevenDaySales|| "0"}</div>
                                    <div>15日：${d.fifteenDaySales||"0"}</div>
                                    <div>30日：${d.thirtyDaySales||"0"}</div>`
                                return str
                            },width:130},
                        {title: '时间', field: 'time', templet: '#walmartpublish_time_store',width:140},
                        {title: '操作', toolbar: '#walmartpublish_toolBar',width:90}
                    ];
                    cols.push(col);
                }else if(listingStatus == 0){ //待刊登
                    var col = [
                        {type: 'checkbox', width: 30},
                        {title: 'listingId', field: 'listingId',templet:function(d){return d.listingId}},
                        {title:'图片',field: 'image',templet:'#walmartpublish_img', width: 70},
                        {title: '英文标题', field: 'enTitle'},
                        {title: '商品名', field: 'cnTitle',width:135},
                        {title: '开发专员', field: 'bizzOwner',width:75},
                        {title: '父SKU',field:'pSku', templet: '#walmartpublish_pSku',width:122},
                        {field: "detail",unresize:true,width:510,title: `
                        <div style="display:flex;">
                            <div style="width:130px;text-align:left;font-size:12px;">模板子SKU</div>
                            <div style="width:130px;text-align:left;font-size:12px;">店铺子SKU</div>
                            <div style="width:60px;text-align:center;font-size:12px;">颜色</div>
                            <div style="width:60px;text-align:center;font-size:12px;">尺寸</div>
                            <div style="width:60px;text-align:center;font-size:12px;">在售</div>
                            <div style="width:60px;text-align:center;font-size:12px;">售价(USD)</div>
                        </div>
                        `,style:"vertical-align: top",templet:"#walmartpublish_detail-1"},
                        {field: 'site',title: '站点',width: 50},
                        {title: '沃尔玛类目', field: 'walmartCategoryName'},
                        {title: '公司销量',field: '', templet: function(d){
                                let str = `<div>7日：${d.sevenDaySales|| "0"}</div>
                                    <div>15日：${d.fifteenDaySales||"0"}</div>
                                    <div>30日：${d.thirtyDaySales||"0"}</div>`
                                return str
                            },width:100},
                        {title: '时间', field: 'time', templet: '#walmartpublish_time',width:140},
                        {title: '失败原因', field: 'remark'},
                        {title: '操作', toolbar: '#walmartpublish_toolBar',width:90},
                    ];
                    cols.push(col);
                }else if(listingStatus == 1){ //刊登成功
                    var col = [
                        {type: 'checkbox', width: 30},
                        {title:'图片',field: 'image',templet:'#walmartpublish_img', width: 70},
                        {title: '英文标题', field: 'enTitle'},
                        {title: '商品名', field: 'cnTitle',width:135},
                        {title: '开发专员', field: 'bizzOwner',width:75},
                        {title: '父SKU',field:'pSku', templet: '#walmartpublish_pSku',width:122},
                        {field: "detail",unresize:true,width:610,title: `
                        <div style="display:flex;">
                            <div style="width:130px;text-align:left;font-size:12px;">模板子SKU</div>
                            <div style="width:130px;text-align:left;font-size:12px;">店铺子SKU</div>
                            <div style="width:60px;text-align:center;font-size:12px;">颜色</div>
                            <div style="width:60px;text-align:center;font-size:12px;">尺寸</div>
                            <div style="width:60px;text-align:center;font-size:12px;">在售</div>
                            <div style="width:60px;text-align:center;font-size:12px;">售价(USD)</div>
                            <div style="width:100px;text-align:center;font-size:12px;">FeedId</div>
                        </div>
                        `,style:"vertical-align: top",templet:"#walmartpublish_detail-1"},
                        {field: 'site',title: '站点',width: 50},
                        {title: '沃尔玛类目', field: 'walmartCategoryName'},
                        {title: '公司销量',field: '', templet: function(d){
                                let str = `<div>7日：${d.sevenDaySales|| "0"}</div>
                                    <div>15日：${d.fifteenDaySales||"0"}</div>
                                    <div>30日：${d.thirtyDaySales||"0"}</div>`
                                return str
                            },width:100},
                        {title: '时间', field: 'success_time', templet: '#walmartpublish_time_success_fail',width:140},
                        {title: '操作', toolbar: '#walmartpublish_toolBar',width:90}
                    ];
                    cols.push(col);
                }else if(listingStatus == 2){ //刊登失败
                    var col = [
                        {type: 'checkbox', width: 30},
                        {title:'图片',field: 'image',templet:'#walmartpublish_img', width: 70},
                        {title: '英文标题', field: 'enTitle'},
                        {title: '商品名', field: 'cnTitle',width:135},
                        {title: '开发专员', field: 'bizzOwner',width:75},
                        {title: '父SKU',field:'pSku', templet: '#walmartpublish_pSku',width:122},
                        {field: "detail",unresize:true,width:610,title: `
                        <div style="display:flex;">
                            <div style="width:130px;text-align:left;font-size:12px;">模板子SKU</div>
                            <div style="width:130px;text-align:left;font-size:12px;">店铺子SKU</div>
                            <div style="width:60px;text-align:center;font-size:12px;">颜色</div>
                            <div style="width:60px;text-align:center;font-size:12px;">尺寸</div>
                            <div style="width:60px;text-align:center;font-size:12px;">在售</div>
                            <div style="width:60px;text-align:center;font-size:12px;">售价(USD)</div>
                            <div style="width:100px;text-align:center;font-size:12px;">FeedId</div>
                        </div>
                        `,style:"vertical-align: top",templet:"#walmartpublish_detail-1"},
                        {field: 'site',title: '站点',width: 50},
                        {title: '沃尔玛类目', field: 'walmartCategoryName'},
                        {title: '公司销量',field: '', templet: function(d){
                                let str = `<div>7日：${d.sevenDaySales|| "0"}</div>
                                    <div>15日：${d.fifteenDaySales||"0"}</div>
                                    <div>30日：${d.thirtyDaySales||"0"}</div>`
                                return str
                            },width:100},
                        {title: '时间', field: 'fail_time', templet: '#walmartpublish_time_success_fail',width:140},
                        {title: '操作', toolbar: '#walmartpublish_toolBar',width:90}
                    ];
                    cols.push(col);
                }else if(listingStatus == 3){ //刊登中
                    var col = [
                        {type: 'checkbox', width: 30},
                        {title:'图片',field: 'image',templet:'#walmartpublish_img', width: 70},
                        {title: '英文标题', field: 'enTitle'},
                        {title: '商品名', field: 'cnTitle',width:135},
                        {title: '开发专员', field: 'bizzOwner',width:75},
                        {title: '父SKU',field:'pSku', templet: '#walmartpublish_pSku',width:122},
                        {field: "detail",unresize:true,width:610,title: `
                        <div style="display:flex;">
                            <div style="width:130px;text-align:left;font-size:12px;">模板子SKU</div>
                            <div style="width:130px;text-align:left;font-size:12px;">店铺子SKU</div>
                            <div style="width:60px;text-align:center;font-size:12px;">颜色</div>
                            <div style="width:60px;text-align:center;font-size:12px;">尺寸</div>
                            <div style="width:60px;text-align:center;font-size:12px;">在售</div>
                            <div style="width:60px;text-align:center;font-size:12px;">售价(USD)</div>
                            <div style="width:100px;text-align:center;font-size:12px;">FeedId</div>
                        </div>
                        `,style:"vertical-align: top",templet:"#walmartpublish_detail-1"},
                        {field: 'site',title: '站点',width: 50},
                        {title: '沃尔玛类目', field: 'walmartCategoryName'},
                        {title: '公司销量',field: '', templet: function(d){
                                let str = `<div>7日：${d.sevenDaySales|| "0"}</div>
                                    <div>15日：${d.fifteenDaySales||"0"}</div>
                                    <div>30日：${d.thirtyDaySales||"0"}</div>`
                                return str
                            },width:100},
                        {title: '时间', field: 'time', templet: '#walmartpublish_time',width:140},
                        {title: '操作', toolbar: '#walmartpublish_toolBar',width:90}
                    ];
                    cols.push(col);
                }
                return cols;
            },
            watchBar: function(){
                var _this = this;
                table.on('tool(walmartpublish_tableFilter)',function(obj){
                    var data = obj.data;
                    if(obj.event=='link'){
                        compUrl_producttpl(data.pSku,data.pId);
                    }else if(obj.event=='status'){
                        producttpl_getListingStatus(data.pId);
                    }else if(obj.event == 'detail'){
                        _this.detailRender(data,obj.tr);
                    }
                });
            },
            //详情
            detailRender: function(trdata,trDom){
                var _this = this;
                var descIndex, keyIndex;
                let { tabStatus, listingId } = trdata
                let hideBtn = tabStatus=='1' || tabStatus=='3'
                _this.detailAjax(listingId).then(function(result){
                    layer.open({
                        type: 1,
                        title: '详情',
                        btn: hideBtn ? '' : ['保存','取消'],
                        area: ['90%', '90%'],
                        id: 'walmartpublish_detailLayerId',
                        content: $('#walmartpublish_detailLayer').html(),
                        success: function(layero,index){
                            var getTpl = walmartpublish_containerTpl.innerHTML,
                            view = document.getElementById('walmartpublish_container');
                            laytpl(getTpl).render(result, function(html){
                                view.innerHTML = html;
                                form.render();
                                descIndex = layedit.build('walmartpublish_desc'); //建立编辑器
                                keyIndex = layedit.build('walmartpublish_key');
                                formSelects.render();
                                _this.addAndDelete(layero);
                                //拖拽功能
                                layero.find('.walmart_subExtraImgs').sortable({
                                    cursor: 'move',
                                    items: '.walmartp_imgContainer', //拖拽的元素
                                    opacity: 0.6,//拖拽的透明度
                                    axis: 'x', //只允许横向拖拽
                                });
                                //网络图片
                                _this.netImage(layero);
                                //移除和设为主图功能
                                _this.rmAndSet(layero);
                                //批量设置价格
                                _this.batchSetPrice(layero);
                                //新增功能
                                _this.addSku(result.storeAcctId,layero);
                                //本地图片
                                _this.localImg(layero);
                                // 模板图片
                                _this.tempImg(result.prodPId,layero)
                                // addEventTitleToggle('#walmartpublish_container')
                                commonAddEventTitleToggle($('#walmartpublish_container'));
                            });
                        },
                        yes: function(index, layero){
                            var submitData = _this.saveHandle(layero, descIndex, keyIndex);
                            console.log('提交的数据', submitData);
                            _this.saveAjax(submitData).then(function(submitResult){
                                layer.close(index);
                                layer.msg(submitResult || '保存成功!', {icon:1});
                            _this.searchAjax(serializeObject($('#walmartpublish_searchForm')))
                            .then(res=>{
                                const curTrData = res.find(item=>item.listingId ===listingId)
                                $(trDom).find('td[data-field="pSku"] .storePSku').text(`店铺父:${curTrData.storePSku || ''}`)
                                laytpl($('#walmartpublish_detail-1').html()).render(curTrData, function(html){
                                    $(trDom).find('td[data-field="detail"] div').html(html)
                                });
                                table.cache.walmartpublish_tableId.forEach((item,index) => {
                                    if(item.listingId ===listingId){
                                        table.cache.walmartpublish_tableId[index] = curTrData
                                    }
                                });
                            })
                                // $('[lay-filter=walmartpublish_submit]').trigger('click');
                            }).catch(function(submitErr){
                                layer.msg(submitErr,{icon:2});
                            });
                        }
                    })
                }).catch(function(err){
                    layer.msg(err,{icon:2});
                });
            },
            //保存的数据处理
            saveHandle: function(layero, descIndex, keyIndex){
                var _this = this;
                //必选属性
                var id = layero.find('#walmartpublish_mustBeNeed [name=id]').val();
                var listingStatus = layero.find('#walmartpublish_mustBeNeed [name=listingStatus]').val();
                var storePSku =$.trim(layero.find('[name=variantGroup]').val()); //Variant Group ID
                var title = $.trim(layero.find('[name=itemName]').val()); //Item Name
                var brand = $.trim(layero.find('[name=brand]').val()); //Brand
                var productTaxCode =$.trim(layero.find('[name=productTaxCode]').val()); //Product Tax Code
                var describeHtml = layedit.getContent(descIndex); //描述
                var keyFeature = layedit.getContent(keyIndex); //keyfeature
                if(!storePSku || !title || !brand || !keyFeature || !describeHtml){
                    return layer.msg('带*号必填属性不能为空',{icon:7});
                }

                //选填属性
                var $formItem = layero.find('#walmartpublish_optional_attr .layui-form-item');
                var attributeListArr = _this.attrHandle($formItem);

                //sku变种处理
                var subSkuWalmartList = [];
                var $trs = layero.find('#walmartpublish_tbody>tr');
                for(var j=0; j<$trs.length; j++){
                    if(j%2 ==0){
                        var $tr = $($trs[j]);
                        var $trImg = $tr.next(); //图片所在行
                        var obj = {};
                        obj.storeSSku = $tr.find('td:first-child').html() || '';//店铺子SKU
                        obj.color = $tr.find('td:nth-child(2)').find('span.color').html() || '';//颜色
                        obj.size = $tr.find('td:nth-child(2)').find('span.size').html() || '';//尺寸
                        obj.style = $tr.find('td:nth-child(2)').find('span.style').html() || '';//尺寸
                        var $tdItem = $tr.find('td:nth-child(3)').find('.layui-form-item');
                        obj.baseAttributeList = _this.attrHandleSku($tdItem); //变种属性
                        obj.upc = $tr.find('td:nth-child(4)').find('input').val() || '';//upc
                        obj.grossWeight = $tr.find('td:nth-child(5)').find('input').val() || ''; //毛重
                        obj.price = $tr.find('td:nth-child(6)').find('input').val() || ''; //价格
                        obj.quantity = $tr.find('td:nth-child(7)').find('input[name=quantity]').val() || ''; //数量
                        obj.prodPId = $tr.find('td:nth-child(7)').find('input[name=prodPId]').val() || ''; //父商品id
                        obj.prodTempId = $tr.find('td:nth-child(7)').find('input[name=prodTempId]').val() || ''; //模板
                        obj.listingStatus = $tr.find('td:nth-child(7)').find('input[name=listingStatus]').val();
                        if($tr.find('td:nth-child(7)').find('input[name=listingId]')){
                            obj.listingId = $tr.find('td:nth-child(7)').find('input[name=listingId]').val();
                        }
                        if($tr.find('td:nth-child(7)').find('input[name=id]')){
                            obj.id = $tr.find('td:nth-child(7)').find('input[name=id]').val();
                        }
                        obj.status = $tr.find('td:nth-child(7)').find('input[name=status]').val() || ''; //状态
                        //主图
                        obj.subMainImg = $trImg.find('td .walmart_subMainImg>img').attr('src');
                        //辅图
                        var sub_imgs = $trImg.find('td .walmartp_imgContainer');
                        var sub_imgsArr = [];
                        for(var k=0; k<sub_imgs.length; k++){
                            var sub_img = sub_imgs[k];
                            var imgUrl = $(sub_img).find('img').attr('src');
                            sub_imgsArr.push(imgUrl);
                        }
                        obj.extraImages = sub_imgsArr.join('|');
                        subSkuWalmartList.push(obj);
                    }
                }
                //提交结构
                var data= {
                    id: id,
                    listingStatus:listingStatus,
                    storePSku:storePSku,
                    title: title,
                    brand: brand,
                    productTaxCode: productTaxCode,
                    describeHtml: describeHtml,
                    keyFeature: keyFeature,
                    attributeList: attributeListArr,
                    subSkuWalmartList: subSkuWalmartList
                }
                return data;
            },
            //选填属性处理
            attrHandle: function($formItem){
                var attributeListArr = [];
                //选填属性数据处理
                for(var i=0;i<$formItem.length; i++){
                    var item = $formItem[i];
                    var $item = $(item);
                    var $collection = $item.find('[name=attrCollection]');
                    var $collectionStr = $collection.val() || {};
                    var $collectionObj =JSON.parse($collectionStr);
                    var $inputOrSelect = $item.find(`[name=${$collectionObj.attributeName}]`);
                    var $inputVal = $.trim($inputOrSelect.val());
                    if($collectionObj.required == 'true' && $collectionObj.displayType !='array'){
                        if(!$inputVal){
                            $inputOrSelect.addClass('layui-form-danger').focus();
                            return layer.msg(`${$collectionObj.attributeName}为必填项!`,{icon:7});
                        }else{
                            $inputOrSelect.removeClass('layui-form-danger').blur();
                        }
                    }
                    //独立出array这个结构
                    if($collectionObj.required == 'true' && $collectionObj.displayType =='array'){
                        var $DisplayP = $item.find('.arrayDisplayClass');
                        for(var k=0; k<$DisplayP.length; k++){
                            var displayP = $DisplayP[k];
                            var displayPInpt = $(displayP).find('input');
                            var displayPName = $(displayP).find('span').data('name');
                            if(!$.trim(displayPInpt.val())){
                                displayPInpt.addClass('layui-form-danger').focus();
                                return layer.msg(`${displayPName}为必填项!`,{icon:7});
                            }else{
                                displayPInpt.removeClass('layui-form-danger').blur();
                            }
                        }
                    }
                    //input+select值
                    if($collectionObj.displayType =='inputSelect'){
                        var $selVal = $item.find(`[name=${$collectionObj.attributeName}_unit]`).val();
                        if(!$inputVal){
                            $collectionObj.attributeValue = '';
                        }else{
                            $collectionObj.attributeValue = $inputVal +'&'+$selVal;
                        }

                    }
                    //array的值
                    else if($collectionObj.displayType =='array'){
                        var $parentsDisplayP = $item.find('.arrayDisplayP');
                        var parentsDisplayPArr = [];
                        for(var m=0; m<$parentsDisplayP.length; m++){
                            var parentsDisplayP = $parentsDisplayP[m];
                            let $DisplayP = $(parentsDisplayP).find('.arrayDisplayClass');
                            let obj = {}; //组装的数据对象
                            let displayData = [];
                            for(let n=0; n<$DisplayP.length; n++){
                                let displayP = $DisplayP[n];
                                let displayPInptVal = $(displayP).find('input').val();
                                let displayPName = $(displayP).find('span').data('name');
                                let displayTitle = $(displayP).find('span').html();
                                if($.trim(displayPInptVal)){
                                    obj[displayPName] = $.trim(displayPInptVal);
                                    var displayItem = {
                                        title: displayTitle,
                                        name: displayPName,
                                        value: $.trim(displayPInptVal)
                                    }
                                    displayData.push(displayItem);
                                }
                            }
                            if(!commonJudgeIsEmpty(obj)){
                                obj.infos= displayData;
                            }
                            if(!commonJudgeIsEmpty(obj)){
                                parentsDisplayPArr.push(obj);
                            }
                        }
                        $collectionObj.attributeValue = parentsDisplayPArr;
                    }
                    //select或input的值
                    else{
                        $collectionObj.attributeValue = $inputVal;
                    }
                    if($collectionObj.attributeValue && $collectionObj.attributeValue.length){
                        attributeListArr.push($collectionObj);
                    }
                }
                return attributeListArr;
            },
            //变种-选填属性处理
            attrHandleSku: function($formItem){
                var attributeListArr = [];
                //选填属性数据处理
                for(var i=0;i<$formItem.length; i++){
                    var item = $formItem[i];
                    var $item = $(item);
                    var titleName = $item.find('.layui-form-label>input').val();//名称标题
                    var attrVal = $item.find('[name=attrVal]').val(); //取值
                    var dataType = $item.find('[name=dataType]').val();//数据类型
                    var displayType = $item.find('[name=displayType]').val();//展示类型
                    var required = $item.find('[name=required]').val();//必填与否
                    if(!$.trim(titleName) && $.trim(attrVal)){
                        return layer.msg('属性值存在,属性名不能为空',{icon:7});
                    }
                    var obj = {
                        attributeName: $.trim(titleName),
                        attributeTitle: $.trim(titleName),
                        attributeValue: $.trim(attrVal),
                        dataType: dataType,
                        displayType: displayType,
                        required: required
                    };
                    attributeListArr.push(obj);
                }
                return attributeListArr;
            },
            //增加和删除
            addAndDelete: function(layero){
                $('#walmartpublish_container').on('click', '.arrayDisplayP_add', function(){
                    var $targetArr = $(this).parent('.arrayDisplayP').find('.arrayDisplayClass');
                    var domStr = '<div class="arrayDisplayP">';
                    for(var i=0; i< $targetArr.length; i++){
                        var item = $targetArr[i];
                        var title = $(item).find('span').html(); //名称
                        var name = $(item).find('span').data('name'); //属性名称
                        domStr +=  `<div class="arrayDisplayClass flexD">
                                        <span data-name="${name}">${title}</span>
                                        <input type="text" class="layui-input" value="">
                                    </div>`;
                    }
                    domStr += `<span class="layui-btn layui-btn-sm layui-btn-normal ml10 arrayDisplayP_add">+</span>
                            <span class="layui-btn layui-btn-sm layui-btn-normal ml10 arrayDisplayP_delete">-</span>
                            </div>`;
                    $(this).parent('.arrayDisplayP').after(domStr);
                });
                $('#walmartpublish_container').on('click', '.arrayDisplayP_delete', function(){
                    $(this).parents('.arrayDisplayP').remove();
                });
            },
            //网络图片
            netImage: function(layero){
                layero.find('#walmartpublish_skuAttr').on('click', '.walmartpublish_netImg', function(){
                    //辅图容器
                    var imgContainers = $(this).parents('.walmart_subExtraImgsContainer').find('.walmart_subExtraImgs');
                    //辅图数量
                    var imgLength = imgContainers.find('.walmartp_imgContainer').length;
                    if(imgLength > 7){
                        return layer.msg('辅图最多允许7张!',{icon:7});
                    }
                    var index = layer.open({
                        type: 1,
                        title: '网络图片',
                        area: ['800px', '400px'],
                        content: '<div style="padding:20px;"><textarea class="layui-textarea" placeholder="请填写URL,多个地址用回车换行"></textarea></div>',
                        btn: ['确定', '关闭'],
                        yes: function(index,layero2) {
                            //网络主图处理
                            var imgsOrigArr =layero2.find('textarea').val().split('\n');
                            var imgsArr = imgsOrigArr.filter(function(item){
                                return item;
                            });
                            var imgsArrLength = imgsArr.length;
                            var totalLength = imgsArrLength + imgLength;
                            //长度加和
                            if(totalLength>7){
                                return layer.msg(`辅图最多允许7张,现有${imgLength}张,新增${imgsArrLength}张!`,{icon:7});
                            }
                            var imgsStr = '';
                            for(var i=0; i<imgsArr.length; i++){
                                var singleUrl = imgsArr[i];
                                imgsStr += `
                                    <div class="walmartp_imgContainer" draggable="true">
                                        <img src="${singleUrl}" width="100" height="100" class="b1" onerror="layui.admin.img_noFind()">
                                        <div class="opte">
                                            <span class="setMainImg">设为主图</span>
                                            <span class="removeImg">移除</span>
                                        </div>
                                    </div>
                                `;
                            }
                            imgContainers.append(imgsStr);
                            layer.close(index);
                        }
                    });
                });
            },
            // 模板图片
            tempImg: function(prodPId,layero){
                layero.find('#walmartpublish_skuAttr').on('click', '.walmartpublish_tempImg', function(){
                    //辅图容器
                    var imgContainers = $(this).parents('.walmart_subExtraImgsContainer').find('.walmart_subExtraImgs');
                    const limit = 7
                    const existImgs =imgContainers.find('.walmartp_imgContainer').length
                    const prodPIdList = _.uniq(Array.from($("#walmartpublish_tbody tr").map((_, item) => $(item).find('input[name=prodPId]').val())))
                    let param = {
                        prodPIds: prodPIdList
                    }
                    const params = {
                        param,
                        limit,
                        existImgs,
                        cb: function (tplUrlList) {
                            if (Array.isArray(tplUrlList) && tplUrlList.length) {
                                let imgsStr = ''
                                for(var i=0; i<tplUrlList.length; i++){
                                    var singleUrl = tplUrlList[i];
                                    imgsStr += `
                                        <div class="walmartp_imgContainer" draggable="true">
                                            <img src="${singleUrl}" width="100" height="100" class="b1" onerror="layui.admin.img_noFind()">
                                            <div class="opte">
                                                <span class="setMainImg">设为主图</span>
                                                <span class="removeImg">移除</span>
                                            </div>
                                        </div>
                                    `;
                                }
                                imgContainers.append(imgsStr);
                            }
                        },
                    }
                    comPickImageTpl(params,'walmart')
                })  
            },
            //本地图片
            localImg: function(layero){
                var btns = layero.find('.walmartpublish_localImg');
                upload.render({
                    elem: btns,
                    url: ctx + "/prodTpl/uploadPic.html",
                    before: function(){
                        loading.show();
                    },
                    done: function(res){
                        loading.hide();
                      //触发上传的按钮
                      var item = this.item;
                      //获取到图片容器
                      var imgContainers = $(item[0]).parents('.walmart_subExtraImgsContainer').find('.walmart_subExtraImgs');
                      if(res.code=='0000'){
                        //图片容器内的图片数量
                        var imgLen = imgContainers.find('.walmartp_imgContainer').length;
                        if(imgLen >7){
                            return layer.msg('辅图最多7张!',{icon:7});
                        }else{
                            var str = '<div class="walmartp_imgContainer" draggable="true">'+
                                ' <img src="'+ tplIVP + res.data+'" width="100" height="100" class="b1" onerror="layui.admin.img_noFind()">'+
                                ' <div class="opte"><span class="setMainImg">设为主图</span><span class="removeImg">移除</span></div></div>';
                            imgContainers.append(str);
                        }
                      }else{
                          return layer.msg(res.msg,{icon:2});
                      }
                    }
                });

            },
            //移除和设为主图功能
            rmAndSet:function(layero){
                //移除功能
                layero.find('#walmartpublish_skuAttr').on('click', '.removeImg', function(){
                    $(this).parents('.walmartp_imgContainer').remove();
                });
                //设为主图功能
                layero.find('#walmartpublish_skuAttr').on('click', '.setMainImg', function(){
                    //当前图片
                    var nowImg = $(this).parents('.walmartp_imgContainer').find('img');
                    var nowImgUrl = nowImg.attr('src');
                    //原始主图
                    var originImg = $(this).parents('.walmart_subImgs').find('.walmart_subMainImg img');
                    var originImgUrl = originImg.attr('src');
                    //交换设置
                    originImg.attr('src', nowImgUrl);
                    nowImg.attr('src',originImgUrl);
                });
                //删除功能
                layero.find('#walmartpublish_tbody').on('click', '.layui-btn-danger', function(){
                    var $tr = $(this).parents('tr');
                    var $next = $tr.next();
                    $tr.remove();
                    $next.remove();
                });
            },
            //批量设置价格
            batchSetPrice: function(layero){
                layero.find('.walmartpublish_batchSetPriceBtn').on('click', function(){
                    var $val = layero.find('.walmartpublish_batchSetPriceInp').val();
                    if(!$.trim($val)){
                        return layer.msg('批量设置的价格不能为空!',{icon:7});
                    }
                    var $trs = layero.find('#walmartpublish_tbody>tr');
                    for(var j=0; j<$trs.length; j++){
                        if(j%2 ==0){
                            var $tr = $($trs[j]);
                            $tr.find('td:nth-child(6)').find('input').val($.trim($val)); //价格
                        }
                    }
                });
            },
            //新增sku
            addSku: function(storeAcctId,layero){
                var _this = this;
                layero.find('#walmartpublish_addSku').on('click', function(){
                    var index = layer.open({
                        type: 1,
                        title: '新增子SKU',
                        area: ['800px', '400px'],
                        content: '<div style="padding:20px;"><textarea class="layui-textarea" placeholder="多个sku用回车换行"></textarea></div>',
                        btn: ['确定', '关闭'],
                        yes: function(index,layero2){
                            var $skuArr = layero2.find('textarea').val().split('\n');
                            _this.addSkuAjax($skuArr, storeAcctId).then(function(result){
                               var trStr = '';
                               //生成新增tr
                               for(var i=0;i<result.length; i++){
                                    var item = result[i];
                                    //获取到变种属性
                                    var baseAttributeList = item.baseAttributeList || [];
                                    var baseAttrStr = '';
                                    for(var j=0; j<baseAttributeList.length; j++){
                                        var baseItem = baseAttributeList[j];
                                        baseAttrStr += `
                                        <div class="layui-form-item">
                                            <div class="layui-form-label" style="padding:0;">
                                                <input type="text" class="layui-input" value="${baseItem.attributeTitle || ''}" placeholder="属性名">
                                            </div>
                                            <div class="layui-input-block">
                                                <input type="text" class="layui-input" value="${baseItem.attributeValue || ''}" name="attrVal" placeholder="属性值">
                                                <input type="hidden" name="dataType" value="${baseItem.dataType || ''}">
                                                <input type="hidden" name="displayType" value="${baseItem.displayType || ''}">
                                                <input type="hidden" name="required" value="${item.required || 'false'}">
                                            </div>
                                        </div>`;
                                    }
                                    //获取到辅图数量
                                    var extraImages = item.extraImages || '';
                                    var extraImagesStr = '';
                                    if(extraImages){
                                        var extraImagesArr = extraImages.split('|');
                                        for(var m=0;m<extraImagesArr.length; m++){
                                            var extraItem = extraImagesArr[m];
                                            extraImagesStr +=`
                                            <div class="walmartp_imgContainer" draggable="true">
                                                <img src="${extraItem}" width="100" height="100" class="b1" onerror="layui.admin.img_noFind()">
                                                <div class="opte">
                                                    <span class="setMainImg">设为主图</span>
                                                    <span class="removeImg">移除</span>
                                                </div>
                                            </div>`;
                                        }
                                    }
                                    //生成tr结构
                                    trStr += `
                                        <tr>
                                            <td>${item.storeSSku || ''}</td>
                                            <td>
                                                颜色: <span class="color">${item.color || ''}</span><br>
                                                尺寸: <span class="size">${item.size || ''}</span><br>
                                                样式: <span class="style">${item.style || ''}</span><br>
                                            </td>
                                            <td>
                                                ${baseAttrStr}
                                            </td>
                                            <td>
                                                <input type="text" class="layui-input" value="${item.upc || ''}">
                                            </td>
                                            <td>
                                                <input type="text" class="layui-input" value="${item.grossWeight || ''}">
                                            </td>
                                            <td>
                                                <input type="text" class="layui-input" value="${item.price || ''}">
                                            </td>
                                            <td>
                                                <input type="text" class="layui-input" value="${item.quantity || ''}" name="quantity">
                                                <input type="hidden" value="${item.prodPId || ''}" name="prodPId">
                                                <input type="hidden" value="${item.prodTempId || ''}" name="prodTempId">
                                                <input type="hidden" value="${item.listingStatus}" name="listingStatus">
                                                <input type="hidden" value="${item.status || ''}" name="status">
                                            </td>
                                            <td>
                                                <span class="layui-btn layui-btn-xs layui-btn-danger">删除</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="8">
                                                <div style="display:flex;" class="walmart_subImgs">
                                                    <div style="width:200px;min-height:180px;" class="walmart_subMainImg">
                                                        <img src="${item.subMainImg}" width="150" height="150" class="img_show_hide b1" onerror="layui.admin.img_noFind()">
                                                    </div>
                                                    <div class="walmart_subExtraImgsContainer">
                                                        <div>
                                                            <span class="layui-btn layui-btn-sm walmartpublish_netImg">网络图片</span>
                                                            <span class="layui-btn layui-btn-sm walmartpublish_localImg"
                                                            id="walmartpublish_localImg_${item.upc}">本地图片</span>
                                                            <span class="layui-btn layui-btn-sm walmartpublish_tempImg">模板图片</span>
                                                        <span class="layui-btn layui-btn-sm walmartpublish_tempImg">模板图片</span>
                                                            <span>说明：可拖动图片调整顺序！子SKU辅图最多选用7张</span>
                                                        </div>
                                                        <div class="walmart_subExtraImgs">
                                                            ${extraImagesStr}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>`;
                               };
                                //父元素的tbody
                                var $tbody = layero.find('#walmartpublish_tbody');
                                $tbody.append(trStr);
                                layer.close(index);
                                //本地图片
                                _this.localImg(layero);
                                var storeSSkuArr = result.map(function(list){
                                    return list.upc;
                                });
                                for(var k=0;k<storeSSkuArr.length;k++){
                                    var imgId = 'walmartpublish_localImg_' +storeSSkuArr[k];
                                    _this.uploadImg(imgId);
                                }
                            }).catch(function(err){
                                layer.alert(err,{icon:2});
                            })
                        }
                    });
                });
            },
            //上传图片
            uploadImg: function(id){
                upload.render({
                    elem: '#'+ id,
                    url: ctx + "/prodTpl/uploadPic.html",
                    before: function(){
                        loading.show();
                    },
                    done: function(res){
                        loading.hide();
                      //触发上传的按钮
                      var item = this.item;
                      //获取到图片容器
                      var imgContainers = $(item[0]).parents('.walmart_subExtraImgsContainer').find('.walmart_subExtraImgs');
                      if(res.code=='0000'){
                        //图片容器内的图片数量
                        var imgLen = imgContainers.find('.walmartp_imgContainer').length;
                        if(imgLen >7){
                            return layer.msg('辅图最多7张!',{icon:7});
                        }else{
                            var str = '<div class="walmartp_imgContainer" draggable="true">'+
                                ' <img src="'+ tplIVP +res.data+'" width="100" height="100" class="b1" onerror="layui.admin.img_noFind()">'+
                                ' <div class="opte"><span class="setMainImg">设为主图</span><span class="removeImg">移除</span></div></div>';
                            imgContainers.append(str);
                        }
                      }else{
                          return layer.msg(res.msg,{icon:2});
                      }
                    }
                });
            },
            //生成店铺商品
            generate: function(){
                var _this = this;
                $('#walmartpublish_generateProductBtn').on('click', function(){
                    var storeAcctId= $('#walmartpublish_searchForm [name=storeAcctId]').val();//店铺
                    commonTableCksSelected('walmartpublish_tableId').then(function(result){
                        var ckedArr = [];
                        for(var i=0; i< result.length; i++){
                            var item = result[i];
                            var tempIdArr = item.sSkuInfoList.map(function(list){
                                return list.tempId
                            });
                            ckedArr.push(...tempIdArr);
                        }
                        if(!storeAcctId){
                            return layer.msg('请先选择店铺',{icon:2});
                        }
                        if(!ckedArr.length){
                            return layer.msg('选择的数据没有子SKU',{icon:2});
                        }

                        _this.generateAjax(storeAcctId, ckedArr).then(function(result){
                            layer.msg(result|| '生成店铺商品成功!',{icon:1});
                            $('[lay-filter=walmartpublish_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                });
            },
            //删除店铺商品
            delete: function(){
                var _this = this;
                $('#walmartpublish_deleteStoreBtn').on('click', function(){
                    commonTableCksSelected('walmartpublish_tableId').then(function(result){
                        var listingIdArr = result.map(function(item){
                            return item.listingId
                        });
                        var listingIdStr = listingIdArr.join();
                        _this.deleteAjax(listingIdStr).then(function(result){
                            layer.msg('删除店铺商品成功!',{icon:1});
                            // 删除对应dom和对应缓存
                            deleteCheckedData(
                                "walmartpublish_tableId",
                                listingIdArr,
                                "td[data-field=listingId]",
                                "walmartpublish_table",
                                function(){
                                    let text = $('#walmartpublish_tabs').find('li.layui-this>span').text();
                                    $('#walmartpublish_tabs').find('li.layui-this>span').text(text*1-listingIdArr.length);
                                }
                            )
                            // $('[lay-filter=walmartpublish_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                });
            },
            //立即刊登和重新发布
            immediate: function(id){
                var _this = this;
                $('#'+id).on('click', function(){
                    commonTableCksSelected('walmartpublish_tableId').then(function(result){
                        var listingIdArr = result.map(function(item){
                            return item.listingId
                        });
                        var listingIdStr = listingIdArr.join();
                        _this.reloadAjax(listingIdStr).then(function(result){
                            layer.msg(result|| '商品已经进入刊登流程，请稍后查看!',{icon:1});
                            $('[lay-filter=walmartpublish_submit]').trigger('click');
                        }).catch(function(err){
                            layer.msg(err,{icon:2});
                        })
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                });
            },
            //标记刊登成功
            markPublishSucc: function(){
                var _this = this;
                $('#walmartpublish_immediatelyBtn').on('click',function(){
                    commonTableCksSelected('walmartpublish_tableId').then(function(result){
                        var listingIdArr = result.map(function(item){
                            return item.listingId
                        });
                        var listingIdStr = listingIdArr.join();
                        _this.markPublishSuccAjax(listingIdStr).then(function(succResult){
                            layer.msg(succResult|| '标记成功',{icon:1});
                            $('[lay-filter=walmartpublish_submit]').trigger('click');
                        }).catch(function(succErr){
                            layer.msg(succErr,{icon:2});
                        })
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                })
            },
            // UPC查重不处理的导入
            importUpcHandle: function(){
                upload.render({
                    elem: "#walmartpublish_importUpcBtn", //绑定元素
                    url: "/lms/walmart/listing/filter/importExcel", //上传接口
                    accept: "file",
                    field: "file",
                    before: function () {
                      //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                      loading.show()
                    },
                    done: function (res) {
                      //上传完毕回调
                      loading.hide()
                      if (res.code === "0000") {
                        layer.msg(res.msg, { icon: 1 })
                      } else {
                        layer.open({
                          title: "导入失败数据",
                          content: res.msg,
                          icon: 2,
                        })
                      }
                    },
                    error: function () {
                      loading.hide()
                      //请求异常回调
                    },
                })
            },
            //导出export
            exportHandle: function(){
                $('#walmartpublish_exportBtn').on('click',function(){
                    commonTableCksSelected('walmartpublish_tableId').then(function(result){
                        var listingIdArr = result.map(function(item){
                            return item.listingId
                        });
                        var listingIdStr = listingIdArr.join();
                        submitForm({"listingIdStr": listingIdStr}, '/lms/walmart/listing/excel/export.html');
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                })
            },
            // 立即刊登:
            publishItem:function(){
              const _this = this
                $('#walmartpublish_publishItemBtn').on('click',function(){
                    commonTableCksSelected('walmartpublish_tableId').then(function(result){
                        var listingIdArr = result.map(function(item){
                            return item.listingId
                        });
                        _this.publishItemAjax(listingIdArr.join())
                        .then(res=>{
                          // 删除数据
                          $('#walmartpublish_table').next().find('.layui-table-main>table>tbody>tr').each(function(){
                            let checkedTr = $(this).find('input[name=layTableCheckbox]').prop('checked')
                            if(checkedTr){
                              $(this).remove()
                            }
                          })
                          table.cache.walmartpublish_tableId.forEach((item,index)=>{
                            if(listingIdArr.includes(item.listingId)){
                              table.cache.walmartpublish_tableId[index] = []
                            }
                          })
                          layer.msg('操作成功，后台队列处理中。',{icon:1})
                          // 减数量
                          let lastTotal = $('#walmartpublish_tabs').find('li.layui-this>span').html();
                          let delNum = listingIdArr.length
                          if(lastTotal == delNum){
                            $('[lay-filter=walmartpublish_submit]').trigger('click');
                          }else{
                            let curTotal = lastTotal - delNum
                            $('#walmartpublish_tabs').find('li.layui-this>span').html(curTotal)
                            $('#walmartpublishCard').find('.layui-laypage-count').text(`共 ${curTotal} 条`)
                          }
                        })
                    }).catch(function(err){
                        layer.msg(err,{icon:2});
                    });
                })
            },
            //展示tips
            showTips: function(){
                $('#walmartpublishCard').on('mouseenter', '.tortPlatListPublish', function(){
                    var platStr = $(this).data('plat') + '侵权';
                    layer.tips(platStr, $(this), {
                        tips: [1, '#0FA6D8'], //还可配置颜色
                        time: 0
                    });
                });
                $('#walmartpublishCard').on('mouseleave', '.tortPlatListPublish', function(){
                    layer.closeAll();
                });
                $('#walmartpublishCard').on('mouseenter', '.listingRemark', function(){
                    var remarkStr = $(this).data('remark');
                    layer.tips(remarkStr, $(this), {
                        tips: [1, '#0FA6D8'], //还可配置颜色
                        time: 0
                    });
                });
                $('#walmartpublishCard').on('mouseleave', '.listingRemark', function(){
                    layer.closeAll();
                });
            },
            //ajax请求
            initAjax: function(){
                return commonReturnPromise({
                    url: '/lms/mode/walmart/init.html'
                });
            },
            searchAjax: function(data){
                return commonReturnPromise({
                    url: '/lms/walmart/listing/query.html',
                    type: 'post',
                    params: data,
                });
            },
            walmartCateAjax: function(){
                return commonReturnPromise({
                    url: '/lms/cate/walmart/query/base.html'
                });
            },
            //生成店铺商品
            generateAjax: function(storeAcctId, ckedArr){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/x-www-form-urlencoded',
                    url: '/lms/walmart/listing/create.html',
                    params: {
                       prodTmpIdStr: ckedArr.join(),
                       storeAcctId: storeAcctId
                    }
                })
            },
            //删除店铺商品
            deleteAjax: function(listingIdStr){
                return commonReturnPromise({
                    url: '/lms/walmart/listing//delete.html',
                    params: {
                        listingIdStr: listingIdStr
                    }
                });
            },
            //详情接口
            detailAjax: function(id){
                return commonReturnPromise({
                    url: '/lms/walmart/listing/info/query.html',
                    params: {
                        listingId: id
                    }
                });
            },
            // 立即刊登
            publishItemAjax: function(listingIds){
              return commonReturnPromise({
                url: '/lms/walmart/listing/publishItem',
                params: { listingIds }
              });
            },
            //重新刊登和立即发布接口
            reloadAjax: function(listingIdStr){
                return commonReturnPromise({
                    url: '/lms/walmart/listing/publishItem',
                    params: {
                        listingIds: listingIdStr
                    }
                });
            },
            //详情保存接口
            saveAjax: function(obj){
                return commonReturnPromise({
                    type: 'post',
                    contentType: 'application/json',
                    url: '/lms/walmart/listing/info/save.html',
                    params: JSON.stringify(obj)
                });
            },
            //新增sku接口
            addSkuAjax: function(skuArr, storeAcctId){
                return commonReturnPromise({
                    url: '/lms/walmart/listing/sku/add.html',
                    params: {
                        storeAcctId: storeAcctId,
                        skuStr: skuArr.join()
                    }
                })
            },
            //标记刊登成功
            markPublishSuccAjax: function(listingIdStr){
                return commonReturnPromise({
                    url: '/lms/walmart/listing/update/status.html',
                    params: {
                        listingIdStr: listingIdStr,
                        listingStatus: 1
                    }
                })
            }
        };
        //数据缓存
        walmartpublishName.selectCache();
        // 下载模板
        form.on('select(walmartpublish_downloadTpl)',function({value}){
            if(value==='upcFilter'){
                transBlob({
                    fileName: 'UPC查重不处理'+Format(new Date().getTime(),'yyyy-MM-dd')+'.xlsx',
                    url: '/lms/walmart/listing/filter/downExcel' ,
                },'get').then(()=>{
                    layer.msg('操作成功',{icon:1})
                })
            }
        })
        //表单搜索事件
        form.on('submit(walmartpublish_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            let type = $("#walmartpublish_tabs").find(".layui-this").data("index")
            if(type == 1){
                data[data.orderby0.split("_")[0]] = data.orderby0.split("_")[1]
            }else if(type == 2||type == 3){
                data[data.orderby1.split("_")[0]] = data.orderby1.split("_")[1]
            }else if(type == 4||type == 5){
                data[data.orderby2.split("_")[0]] = data.orderby2.split("_")[1]
            }

            var obj = walmartpublishName.dataHandle(data);
            if(!obj.storeAcctId){
                return layer.msg('请先选择店铺!',{icon:7});
            }
            walmartpublishName.tableRender(obj);
        });
        // 重置
        $('#walmartpublish_reset').click(function(){
            $('#walmartpublish_group_sel').next().find('dd[lay-value=""]').trigger('click');
             setTimeout(() => {
                 formSelects.value('walmartpublish_prodIsSaleStatus', ['2', '1'])
             }, 100);
        })
        //生成店铺商品
        walmartpublishName.generate();
        //删除店铺商品
        walmartpublishName.delete();
        //立即刊登和重新发布
        // walmartpublishName.immediate('walmartpublish_immediatelyBtn');
        walmartpublishName.markPublishSucc();
        walmartpublishName.immediate('walmartpublish_refreshBtn');
        //展示侵权
        walmartpublishName.showTips();
        // UPC查重不处理 导入
        walmartpublishName.importUpcHandle()
        //导出
        walmartpublishName.exportHandle();
        // 立即刊登
        walmartpublishName.publishItem()
        //固定表头
        UnifiedFixedFn('walmartpublishCard');
    });//layui结束
})();
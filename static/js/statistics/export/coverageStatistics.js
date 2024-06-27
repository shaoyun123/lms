;(function(){
    layui.use(['admin','table','form','element','layer','laytpl', 'formSelects','laydate','upload'],function(){
        var admin = layui.admin,
            table = layui.table,
            element = layui.element,
            layer = layui.layer,
            laytpl = layui.laytpl,
            laydate = layui.laydate,
            formSelects = layui.formSelects,
            upload = layui.upload,
            form = layui.form;
        form.render();
        //开发组别和开发专员联动
        render_hp_orgs_users("#coverageStatistics_form");

        //渲染时间
        laydate.render({
            elem: '#coverageStatisticsTimes'
            ,range: true
        });
        $(function(){
            var endTime = new Date(new Date().getTime());
            var startTime = new Date(new Date().getTime() - 15*24*3600*1000);
            var timeStr = Format(startTime,"yyyy-MM-dd")+" - "+Format(endTime,"yyyy-MM-dd");
            $('#coverageStatisticsTimes').val(timeStr);
        });
        //监听点击事件
        element.on('tab(coverageStatistics-tabs)', function (data) {
            if(data.index == 0){ //ebay
                $('#coverageStatistics_platCode').val('ebay');
                $('[lay-filter="coverageStatistics_submit"]').trigger('click');
            }
            else if(data.index == 1){ //smt
                $('#coverageStatistics_platCode').val('aliexpress');
                $('[lay-filter="coverageStatistics_submit"]').trigger('click');
            }
            else if(data.index == 2){ //wish
                $('#coverageStatistics_platCode').val('wish');
                $('[lay-filter="coverageStatistics_submit"]').trigger('click');
            }
            else if(data.index == 3){ //amazon
                $('#coverageStatistics_platCode').val('amazon');
                $('[lay-filter="coverageStatistics_submit"]').trigger('click');
            }
            else if(data.index == 4){ //shopee
                $('#coverageStatistics_platCode').val('shopee');
                $('[lay-filter="coverageStatistics_submit"]').trigger('click');
            }
            else if(data.index == 5){ //lazada
                $('#coverageStatistics_platCode').val('lazada');
                $('[lay-filter="coverageStatistics_submit"]').trigger('click');
            }
        });
        //覆盖率统计命名空间
        var coverageStatisticsName = {
            //渲染类目
            renderCate: function(){
                alertCateSelect($('#coverageStatisticsBtn'),$('#coverageStatisticsHidden'),$('#coverageStatisticsDiv'));
            },
            //渲染表格
            tableRender: function(data,cols, way){
                var url = '';
                if(way=='cate'){
                    url = '/lms/prodPublishCoverStat/pubCoverStatByCate.html';
                }else{
                    url = '/lms/prodPublishCoverStat/pubCoverStat.html';
                }
                var _this = this;
                table.render({
                    elem: '#coverageStatistics_table',
                    method: 'post',
                    url: url,
                    where:  data,
                    page: false,
                    limits: [50, 100, 300],
                    limit: 50,
                    id: "coverageStatistics_tableId",
                    cols:cols
                })
            },
            //ebay平台表格样式
            ebayCols:function(way){
                var cols =[
                    [
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '美国-直邮', field:'usDirectPostPubNUm', templet: '#coverageStatistics_usDirect'},
                        {title: '美国-虚拟仓', field:'usVirtualWarehousePubNUm', templet: '#coverageStatistics_usVirtual'},
                        {title: '美国-真实仓', field:'usRealWarehousePubNUm', templet: '#coverageStatistics_usReal'},
                        {title: '英国-直邮', field:'ukDirectPostPubNUm', templet: '#coverageStatistics_ukDirect'},
                        {title: '英国-虚拟仓', field:'ukVirtualWarehousePubNUm',templet: '#coverageStatistics_ukVirtual'},
                        {title: '英国-真实仓', field:'ukRealWarehousePubNUm', templet: '#coverageStatistics_ukReal'},
                        {title: '德国-直邮', field:'geDirectPostPubNUm', templet: '#coverageStatistics_geDirect'},
                        {title: '德国-虚拟仓', field:'geVirtualWarehousePubNUm',templet: '#coverageStatistics_geVirtual'},
                        {title: '德国-真实仓', field:'geRealWarehousePubNUm', templet: '#coverageStatistics_geReal'},
                        {title: '澳洲-直邮', field:'auDirectPostPubNUm', templet: '#coverageStatistics_geDirect'},
                        {title: '澳洲-虚拟仓', field:'auVirtualWarehousePubNUm',templet: '#coverageStatistics_geVirtual'},
                        {title: '澳洲-真实仓', field:'auRealWarehousePubNUm', templet: '#coverageStatistics_auReal'}
                    ]
                ];
                if(way == 'cate'){
                    cols[0][0] = {title: '类目', field: 'cate'};
                }else{
                    cols[0][0] = {title: '开发专员', field: 'bizzOwner'};
                }
                return cols;
            },
            //smt平台表格样式
            aliexpressCols: function(way){
                var cols =[
                    [
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '覆盖率', field:'smtReachNum', templet: `
                            <div>
                                <span>{{(Number(d.smtReachNum/d.smtCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.smtReachNum}}/{{d.smtCanPubNum}})</span>
                            </div>
                        `},
                    ]
                ];
                if(way == 'cate'){
                    cols[0][0] = {title: '类目', field: 'cate'};
                }else{
                    cols[0][0] = {title: '开发专员', field: 'bizzOwner'};
                }
                return cols;
            },
            //wish平台表格样式
            wishCols: function(way){
                var cols =[
                    [
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '覆盖率', field:'wishCanPubNum', templet: `
                            <div>
                                <span>{{(Number(d.wishReachNum/d.wishCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.wishReachNum}}/{{d.wishCanPubNum}})</span>
                            </div>
                        `},
                    ]
                ];
                if(way == 'cate'){
                    cols[0][0] = {title: '类目', field: 'cate'};
                }else{
                    cols[0][0] = {title: '开发专员', field: 'bizzOwner'};
                }
                return cols;
            },
            //amazon平台表格样式
            amazonCols: function(way){
                var cols =[
                    [
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '美国-FBM', templet: `
                            <div>
                                <span>{{(Number(d.usFBMPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.usFBMPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},
                        {title: '美国-FBA', templet: `
                            <div>
                                <span>{{(Number(d.usFBAPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.usFBAPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},
                        {title: '英国-FBM', templet: `
                            <div>
                                <span>{{(Number(d.ukFBMPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.ukFBMPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},
                        {title: '英国-FBA', templet: `
                            <div>
                                <span>{{(Number(d.ukFBAPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.ukFBAPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},

                        {title: '德国-FBM', templet: `
                            <div>
                                <span>{{(Number(d.geFBMPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.geFBMPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},
                        {title: '德国-FBA', templet: `
                            <div>
                                <span>{{(Number(d.geFBAPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.geFBAPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},

                        {title: '加拿大-FBM', templet: `
                            <div>
                                <span>{{(Number(d.caFBMPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.caFBMPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},
                        {title: '加拿大-FBA', templet: `
                            <div>
                                <span>{{(Number(d.caFBAPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.caFBAPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},
                        {title: '日本-FBM', templet: `
                            <div>
                                <span>{{(Number(d.jpFBMPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.jpFBMPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `},
                        {title: '日本-FBA', templet: `
                            <div>
                                <span>{{(Number(d.jpFBAPubNUm/d.amazonCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.jpFBAPubNUm}}/{{d.amazonCanPubNum}})</span>
                            </div>
                        `}

                    ]
                ];
                if(way == 'cate'){
                    cols[0][0] = {title: '类目', field: 'cate'};
                }else{
                    cols[0][0] = {title: '开发专员', field: 'bizzOwner'};
                }
                return cols;
            },
            //lazada平台表格样式
            lazadaCols: function(way){
                var cols =[
                    [
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '印尼', templet: `
                            <div>
                                <span>{{(Number(d.lazadaIDPubNum/d.lazadaCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.lazadaIDPubNum}}/{{d.lazadaCanPubNum}})</span>
                            </div>
                        `},
                        {title: '马来西亚', templet: `
                            <div>
                                <span>{{(Number(d.lazadaMYPubNum/d.lazadaCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.lazadaMYPubNum}}/{{d.lazadaCanPubNum}})</span>
                            </div>
                        `},
                        {title: '菲律宾',templet: `
                            <div>
                                <span>{{(Number(d.lazadaPHPubNum/d.lazadaCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.lazadaPHPubNum}}/{{d.lazadaCanPubNum}})</span>
                            </div>
                        `},
                        {title: '新加坡',templet: `
                            <div>
                                <span>{{(Number(d.lazadaSGPubNum/d.lazadaCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.lazadaSGPubNum}}/{{d.lazadaCanPubNum}})</span>
                            </div>
                        `},
                        {title: '泰国', templet: `
                            <div>
                                <span>{{(Number(d.lazadaTHPubNum/d.lazadaCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.lazadaTHPubNum}}/{{d.lazadaCanPubNum}})</span>
                            </div>
                        `},
                        {title: '越南', templet: `
                            <div>
                                <span>{{(Number(d.lazadaVNPubNum/d.lazadaCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.lazadaVNPubNum}}/{{d.lazadaCanPubNum}})</span>
                            </div>
                        `}
                    ]
                ];
                if(way == 'cate'){
                    cols[0][0] = {title: '类目', field: 'cate'};
                }else{
                    cols[0][0] = {title: '开发专员', field: 'bizzOwner'};
                }
                return cols;
            },
            //shopee平台表格样式
            shopeeCols: function(way){
                var cols =[
                    [
                        {title: '开发专员', field: 'bizzOwner'},
                        {title: '巴西', templet: `
                            <div>
                                <span>{{(Number(d.shopeeBRPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeBRPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '印尼', templet: `
                            <div>
                                <span>{{(Number(d.shopeeIDPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeIDPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '马来西亚', templet: `
                            <div>
                                <span>{{(Number(d.shopeeMYPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeMYPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '菲律宾',templet: `
                            <div>
                                <span>{{(Number(d.shopeePHPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeePHPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '新加坡',templet: `
                            <div>
                                <span>{{(Number(d.shopeeSGPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeSGPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '泰国', templet: `
                            <div>
                                <span>{{(Number(d.shopeeTHPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeTHPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '台湾',templet: `
                            <div>
                                <span>{{(Number(d.shopeeTWPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeTWPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '越南', templet: `
                            <div>
                                <span>{{(Number(d.shopeeVNPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeVNPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `},
                        {title: '墨西哥', templet: `
                            <div>
                                <span>{{(Number(d.shopeeMXPubNum/d.shopeeCanPubNum)*100).toFixed(1)}}%</span>
                                <span>({{d.shopeeMXPubNum}}/{{d.shopeeCanPubNum}})</span>
                            </div>
                        `}
                    ]
                ];
                if(way == 'cate'){
                    cols[0][0] = {title: '类目', field: 'cate'};
                }else{
                    cols[0][0] = {title: '开发专员', field: 'bizzOwner'};
                }
                return cols;
            }
        };
        //渲染类目
        coverageStatisticsName.renderCate();
        //监听表单搜索事件
        form.on('submit(coverageStatistics_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            // console.log(data);
            var colsStr = data.platCode + 'Cols';
            coverageStatisticsName.tableRender(data, coverageStatisticsName[colsStr](data.way), data.way);
        });
        //固定表头
        UnifiedFixedFn('coverageStatisticsCard');
    });
})();
layui.use(['admin','form','table','layer','laydate','formSelects'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        element = layui.element,
        laytpl= layui.laytpl,
        formSelects=layui.formSelects,
        laydate = layui.laydate;
    form.render('select');
    //渲染部门销售员店铺三级联动
    render_hp_orgs_users("#publishstatistics_lazada_searchForm");


    (function(){
        var nowTimes = Date.now();
        var yesterdayTimes = nowTimes - 24*60*60*1000;
        var nowDays = format(nowTimes, 'yyyy-MM-dd');
        var yesterdayDays = format(yesterdayTimes, 'yyyy-MM-dd');
        var dayStr = yesterdayDays +' - '+nowDays;

        //渲染时间
        laydate.render({
            elem: '#lazada_publishstatistics_times'
            ,value: dayStr
            ,range: true
        });
    })()


    lazada_publishStatistics_initShopeeSite();
    lazada_publishstatistics_formData();

    $('[lay-filter="lazada_publishstatistics_submit"]').trigger('click');


    //初始化站点
    function lazada_publishStatistics_initShopeeSite(){
        $.ajax({
            type: "get",
            url: ctx + "/onlineProductLazada/getAllSite.html",
            dataType: "json",
            beforeSend: function(){
               loading.show();
            },
            success: function (returnData) {
                loading.hide();
                if (returnData.code == "0000") {
                    var sites=[];
                    var siteList=returnData.data;//站点
                    $(siteList).each(function () {
                        var a = {name: this.name, value: this.code};
                        sites.push(a);
                    });
                    formSelects.data('lazada_publishstatistics_site_sel', 'local', {arr: sites});
                } else {
                    layer.msg(returnData.msg);
                }
            }
        });
    }

    //初始化查询数据
    function lazada_publishstatistics_formData(){
        form.on('submit(lazada_publishstatistics_submit)', function(data){
            var data = data.field; //获取到表单提交对象
            data.roleNames = 'lazada专员';
            // console.log(data);
            if(data.lazada_publishstatistics_times){
                var timeArr =data.lazada_publishstatistics_times.split(' - ');
                data.startTime = timeArr[0];
                data.endTime = timeArr[1];
            }else{
                data.startTime = '';
                data.endTime='';
            }
            data.orderBy = 'store.salesperson_id asc';
            delete data.lazada_publishstatistics_times;
            if(!data.startTime){
                return layer.msg('必须选择刊登时间!');
             }
            lazada_publishStatistics_tableRender(data);
        });
    }

    //表格渲染
    function lazada_publishStatistics_tableRender(data){
        table.render({
            elem: '#lazada_publishstatistics_table',
            method: 'post',
            url: '/lms/listing/statistics/lazada.html',
            where:  data,
            page: true,
            id: "lazada_publishstatistics_tableId",
            limits: [500, 700, 1000],
            limit: 500,
            cols: [
                [
                  {title: '销售员', field: 'salesperson'},
                  {title: '店铺', field: 'storeAcct'},
                  {title: '时间店铺刊登数(2019.12起)', field: 'conditionAmount',sort: true},
                  {title: '店铺上月刊登数', field: 'storeLastMonthAmount',sort: true},
                  {title: '店铺本月刊登数', field: 'storeThisMonthAmount',sort: true},
                  {title: '销售上月刊登数', field: 'personLastMonthAmount',templet: '#lazada_publishstatistics_lastMonth',sort: true},
                  {title: '销售本月刊登数', field: 'personThisMonthAmount',templet: '#lazada_publishstatistics_thisMonth',sort: true},
                  {title: '上月创建模板数', field: 'modelLastMonthAmount',sort: true},
                  {title: '本月创建模板数', field: 'modelThisMonthAmount',sort: true}
                ]
            ]
        });
    }

    //表头固定
    (function(){
        $('.layadmin-tabsbody-item.layui-show').on('scroll', function(){
            var top = $(this).scrollTop();
            //layui-table-header
            var tableHeader = $('#lazada_publishstatistics_card').find('.layui-table-header');
            var cardHeaderH = $('#lazada_publishstatistics_card')[0].offsetTop;
            if(top > cardHeaderH) {
                tableHeader.css({
                    position: 'fixed',
                    zIndex: 999,
                    width: '94vw',
                    background: '#fff',
                    top: '50px'
                });
            }else {
                tableHeader.css({
                    position: 'inherit',
                    width: '100%',
                    zIndex: 111,
                    top: '0px'
                })         
            }
        })
    })()
})

function lazada_publishstatistics_show(self, saleCountList){
    var layer = layui.layer,
    table = layui.table;
    var oldId = self.getAttribute('data-tipId');
    if (oldId) {
        layer.close(oldId)
    }
    var tipsIndex = layer.open({
        type: 4,
        shade: 0,
        area: ['850px', '250px'],
        tips: [1, 'rgba(5,5,5,0.4)'],
        isOutAnim: false,
        content: [$('#lazada_publishstatistics_detail').html(), self], //数组第二项即吸附元素选择器或者DOM
        success: function() {
            table.render({
                elem: "#lazada_publishstatistics_detailTable",
                id: "lazada_publishstatistics_detailTable",
                data: JSON.parse(saleCountList),
                cols: [
                    [
                        { title: "马来西亚", templet: '<div>{{d.MY || 0}}</div>' },
                        { title: "新加坡", templet: '<div>{{d.SG || 0}}</div>' },
                        { title: "菲律宾", templet: '<div>{{d.PH || 0}}</div>' },
                        { title: "印尼", templet: '<div>{{d.ID || 0}}</div>' },
                        { title: "泰国", templet: '<div>{{d.TH || 0}}</div>' },
                        { title: "越南", templet: '<div>{{d.VN || 0}}</div>' },
                        { title: "台湾", templet: '<div>{{d.TW || 0}}</div>' }
                    ],
                ],
                page: false
            })
        }
    });
    self.setAttribute('data-tipId', tipsIndex);
}

function lazada_publishstatistics_remove(self){
    var index = $(self).attr('data-tipId')
    if (index) {
        layui.layer.close(index)
    }
}
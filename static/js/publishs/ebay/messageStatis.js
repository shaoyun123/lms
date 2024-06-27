; (function ($, layui, window, document, undefined) {
    layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'upload', 'laydate', 'laytpl'], function () {
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

        render_hp_orgs_users("#eaby_messageStatis_form");
        form.render();
        var eabyMessageStatisName = {
            // 初始化
            init: function () {
                let time = this.recentMonth()
                laydate.render({
                    elem: "#eaby_messageStatis_time",
                    range: true,
                    value:`${time.start} - ${time.end}`,
                })
            },
            // 搜索
            search: function () {
                var _this = this
                $("#eaby_messageStatis_search_submit").click(function () {
                    _this.tableRender()
                });
            },
            // 搜索数据
            getSearchData: function () {
                let param = serializeObject($("#eaby_messageStatis_form"))
                if (param.time != undefined && param.time != '') {
                    param.startTime = param.time.split(' - ')[0]
                    param.endTime = param.time.split(' - ')[1]
                }else{
                    return layer.msg('邮件接受时间必填')
                }
                delete param.time
                return param
            },
            // 渲染table
            tableRender: function () {
                var _this = this
                table.render({
                    elem: '#eaby_messageStatis_table',
                    method: 'post',
                    where: _this.getSearchData(),
                    url: ctx + '/ebayMessage/ebayMsgAnalysis',
                    cols: [[
                        { field: 'storeAcct', title: '店铺', },
                        { field: 'salesperson', title: '销售', },
                        { field: 'customServicer', title: '客服', },
                        { field: 'buyerMessageCount', title: '买家邮件数', },
                        { field: 'replyCount', title: '回复邮件数', },
                        { field: 'replyCountTwentyfourHours', title: '0-24小时内回复邮件数', },
                        { field: 'replyCountTwentyfourToFortyeightHours', title: '24-48小时内回复邮件数', },
                        { field: 'replyCountOverFortyeightHours', title: '超过48小时回复邮件数', },
                        { field: 'avergeReplyTime', title: '平均回复时间(分)', },
                    ]],
                    page: true,
                    limit: 500,
                    limits: [500, 1000, 1500],
                    id: 'platforms_replenish_rule_tableId',
                    done: function () {
                        //表头固定
                        $('#eaby_messageStatis_table').next('.layui-table-view').find('.layui-table-header').addClass('toFixedContain')
                    }
                });
            },
            // 最近一个月
            recentMonth:function(){
                var end = new Date();
                var year = end.getFullYear();
                var month = end.getMonth() + 1;//0-11表示1-12月
                var day = end.getDate();
                var dateObj = {};
                dateObj.end = year + '-' + month + '-' + day;
                var endMonthDay = new Date(year, month, 0).getDate();    //当前月的总天数
                if(month - 1 <= 0){ //如果是1月，年数往前推一年<br>　　　　
                    dateObj.start = (year - 1) + '-' + 12 + '-' + day;
                }else{
                    var startMonthDay = new Date(year, (parseInt(month) - 1), 0).getDate();
                    if(startMonthDay < day){    //1个月前所在月的总天数小于现在的天日期
                        if(day < endMonthDay){        //当前天日期小于当前月总天数
                            dateObj.start = year + '-' + (month - 1) + '-' + (startMonthDay - (endMonthDay - day));
                        }else{
                            dateObj.start = year + '-' + (month - 1) + '-' + startMonthDay;
                        }
                    }else{
                        dateObj.start = year + '-' + (month - 1) + '-' + day;
                    }
                } 
                return dateObj
            }
        }
        // 初始化
        eabyMessageStatisName.init()
        // 搜索
        eabyMessageStatisName.search()
    });
})(jQuery, layui, window, document);
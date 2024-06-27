var amazonRevenueTplPage = {};
layui.use(['table', 'form', 'element', 'layer', 'laytpl', 'formSelects','laydate'], function () {
    var form = layui.form,
        table = layui.table,
        laypage = layui.laypage,
        laydate = layui.laydate,
        formSelects = layui.formSelects;

    amazonRevenueTplPage.curr = 1;
    amazonRevenueTplPage.limit = 50
    amazonRevenueTplPage.count = 0;

        form.render();
        fillsite();
        laydate.render({
            elem: '#amazonreenue_postedDateStr'
            ,type: 'month'
        });
        render_hp_orgs_users("#amazonreenue_search_form");//渲染部门销售员店铺三级联动
        //重置的时候处理三级联动
        $('#amazonreenue_reset').on('click', function(){
            $('#amazonreenue_online_depart_sel').next().find('dd[lay-value=""]').trigger('click');
        })
        $('#amazonreenue_search_btn').click(function () {
            if ($.trim($('#amazonreenue_operateType').val()) == 0) {
                initAjax(ctx + "/amazonRevenueAnalysisController/fbmStorePage.html",
                    "amazon_revenue_store_fbm", "POST");
            } else if($.trim($('#amazonreenue_operateType').val()) == 1){
                initAjax(ctx + "/amazonRevenueAnalysisController/fbmSalesPage.html",
                    "amazon_revenue_sale_fbm", "POST");
            } else if($.trim($('#amazonreenue_operateType').val()) == 2){
                initAjax(ctx + "/amazonRevenueAnalysisController/fbaStorePage.html",
                    "amazon_revenue_store_fba", "POST");
            }else if($.trim($('#amazonreenue_operateType').val()) == 3){
                initAjax(ctx + "/amazonRevenueAnalysisController/fbaSalesPage.html",
                    "amazon_revenue_sale_fba", "POST");
            }

        })

    function initAjax(url, scriptTemplate, method) {
        $.ajax({
            url: url,
            type: method,
            data: amazonreenue_search(),
            success: function (res) {
                var $res = res
                //渲染的数据对象
                var data;
                if ($res.code === "0000") {
                    data = $res;
                } else {
                    data = {};
                    layer.msg('服务器查询错误!' + $res.msg);
                }
                // template 会获取 res 的 data字段值
                var html = template(scriptTemplate, $res);
                //页面展示
                $("#amazon_revenue_data_table").html(html);
                //分页
                // laypage.render({
                //     elem: 'amazon_revenue_page_pagination',
                //     count: $res.count,
                //     curr: amazonRevenueTplPage.curr,
                //     limit: amazonRevenueTplPage.limit,
                //     limits: [50, 100, 200],
                //     layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                //     jump: function (obj, first) {
                //         //obj包含了当前分页的所有参数，比如：
                //         amazonRevenueTplPage.curr = obj.curr;
                //         amazonRevenueTplPage.limit = obj.limit;
                //         //首次不执行
                //         if (!first) {
                //             $('#amazonreenue_search_btn').click();
                //         }
                //     }
                // });
            },
            error: function (res) {
                var html = template(scriptTemplate, {});
                //页面展示
                $("#amazon_revenue_data_table").html(html);
                layer.msg('服务器正忙!');
            }
        });
    }

        amazonreenue_search =() => {
            var data = serializeObject($('#amazonreenue_search_form'));
            data.limit = amazonRevenueTplPage.limit;
            data.page = amazonRevenueTplPage.curr;
            return data;

        }

        function fillsite() {
            $.ajax({
              url: `${ctx}/enum/getSiteEnum.html?platCode=amazon`,
              type: 'POST',
              dataType: 'json',
               success: function (returnData) {
                 var arr = [];
                 for (let i = 0; i < returnData.data.length; i++) {
                     var temp = {};
                     temp.name = returnData.data[i].name;
                     temp.value = returnData.data[i].code;
                     arr.push(temp);
                     }
                 formSelects.data('amazonreenuesiteIdList', 'local', {arr: arr})
                 }
                });
                    };        
    })



/**
 *详情查看点击事件
 * @param res 当前td列
 * @param index 下下标
 * @constructor ??
 */
RevenueDetailClick = (res, index) => {
    //获取父 tr-> 父 tbody  .........
    var tbody = $(res).parent().parent();
    //找到和当前行的为一组数据的同类行
    var $trList = tbody.find("tr[data-index =" + index + "]");
    if ($trList) {
        //是否需要行的第一列合并
        var needRowSpan = false;
        for (let i = 0; i < $trList.length; i++) {
            var $tr = $($trList[i]);
            if ($tr.attr("hidden")) {
                //代表当前行处于影藏状态;移除当前行数据的隐藏;并设置当前行的第一行隐藏
                $tr.removeAttr("hidden");
                //设置当前行的第一个td隐藏;
                $tr.find("td[first-children-td=first_" + index + "]")
                    .attr("hidden", "hidden");
                needRowSpan = true;
            } else {
                $tr.attr("hidden", "hidden");
                //移除隐藏;占位
                $tr.find("td[first-children-td=first_" + index + "]")
                    .removeAttr("hidden");
            }
        }
        if (needRowSpan) {
            $(res).prev().attr("rowspan", $trList.length + 1);
        } else {
            $(res).prev().removeAttr("rowspan");
        }
    }
}

    RevenueType = (id) =>{
        $('#amazonreenue_operateType').val(id);
        $('#amazonreenue_search_btn').trigger('click');
}
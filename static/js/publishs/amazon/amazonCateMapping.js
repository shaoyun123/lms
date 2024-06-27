layui.use(["admin", "form", "table", "layer", "laytpl",'element'], function() {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        element = layui.element;
    $ = layui.$;
    form.render("select");
    form.render("radio");
    form.render("checkbox");

    //选择分类弹框
    $('#amazonCaateMapping_item').click(function(){
        admin.itemCat_select('LAY-amazon-cate-mapping','LAY-amazon-cate-mapping-hidden','LAY-amazon-cate-mapping-div')
    });

    table.render({
        elem: "#amazonCateMappingTable",
        method: "post",
        url: ctx + "/amazonCateMapping/queryAmazonMappingCate.html",
        where:{
            salesSite:$("#amazonCateMapping_Form select[name='salesSite'] option:selected").val(),
            fillflag:$("#amazonCateMapping_Form select[name='fillflag'] option:selected").val(),
            categoryId:$("#amazonCateMapping_Form input[name='categoryId']").val()
        },
        cols: [
            [
                //标题栏
                { type: "checkbox" },
                { field: "categoryName", title: "商品类目" },
                { field: "tempFileName", title: "亚马逊模板" },
                { field: "feedProductType", title: "feed_product_type" },
                { field: "itemType", title: "item_type" },
                { field: "recommendedBrowseNode", title: "recommended_browse_node" },
                { field: "colorKeyName", title: "color" },
                { field: "sizeKeyName", title: "size" },
                { field: "colorSizeKeyName", title: "color_size" },
                { title: "bullet_points(卖点)",templet:"#bullet_points_tpl" },

                //绑定工具条
                {
                    title: "操作",
                    align: "center",
                    toolbar: "#amazonCateMappingEditBar",
                },
            ],
        ],
        id: "amazonCateMappingTable",
        page: true,
        limits: [10,50, 100, 200],
        limit: 50
    });

    //搜索
    $("#amazonCateMapping_search").click(function () {
        //执行重载
        table.reload("amazonCateMappingTable", {
            where: {
                salesSite:$("#amazonCateMapping_Form select[name='salesSite'] option:selected").val(),
                fillflag:$("#amazonCateMapping_Form select[name='fillflag'] option:selected").val(),
                categoryId:$("#amazonCateMapping_Form input[name='categoryId']").val()
            },
        });
    });

    function getFileList(data) {
        $.ajax({
            type: "POST",
            url: ctx + "/amazonCateMapping/listTempFileName.html",
            data: {salesSite: data.salesSite},
            async: false,
            dataType: "json",
            success: function (returnData) {
                // console.log(returnData);
                if (returnData.code == "0000") {
                    var resultdata = returnData.data;
                    for (var i = 0; i < resultdata.length; i++) {
                        $("#amazonCateMappingEdit_Form select[name=tempFileName]")
                            .append(`<option value="` + resultdata[i].name + `">` + resultdata[i].desc + `</option>`);
                    }
                    //回显结果
                } else {
                    layer.msg(returnData.msg);
                }
            },
            error: function () {
                layer.msg("服务器正忙");
            },
        });
    }

    table.on("tool(amazonCateMappingTable)", function(obj) {
        // console.log(123);
        var editObj=obj;
        var data = obj.data; //获得当前行数据
        layEvent = obj.event;
        if (layEvent === "edit") {
            // console.log(123);
            layer.open({
                type: 1,
                title: "编辑类目映射信息",
                area: ["1000px", "500px"],
                btn: ["保存", "关闭"],
                content: $("#amazonCateMappingEdit_Layer").html(),
                success: function(layero, index) {
                    //按站点获取获取当前站点的文件列表
                    getFileList(data);
                    //回显结果
                    $("#amazonCateMappingEdit_Form input[name=id]").val(data.id);
                    $("#amazonCateMappingEdit_Form select[name=tempFileName]").val(data.tempFileName);
                    $("#amazonCateMappingEdit_Form input[name=feedProductType]").val(data.feedProductType);
                    $("#amazonCateMappingEdit_Form input[name=itemType]").val(data.itemType);
                    $("#amazonCateMappingEdit_Form input[name=recommendedBrowseNode]").val(data.recommendedBrowseNode);
                    $("#amazonCateMappingEdit_Form input[name=colorKeyName]").val(data.colorKeyName);
                    $("#amazonCateMappingEdit_Form input[name=sizeKeyName]").val(data.sizeKeyName);
                    $("#amazonCateMappingEdit_Form input[name=colorSizeKeyName]").val(data.colorSizeKeyName);
                    if(data.bulletPoints){
                        $(".allBulletPointsClass").empty();
                        var tplReq =
                            '<div class="bullet_point_class">' +
                            '<input style="Width:750px" type="text" required lay-verify="required" value="#value#" class="layui-input bullet_point_class_input" placeholder="请输入1个bullet_point">' +
                            '<i class="layui-icon layui-icon-delete" onclick="del_bullet_point(this)" style="cursor:pointer"></i>'+
                            '</div>';
                        var bulPointList=data.bulletPoints.split("#,#");
                        for(var i=0;i<bulPointList.length;i++) {
                            if(bulPointList[i]) {
                                $(".allBulletPointsClass").append(tplReq.replace("#value#", bulPointList[i]));
                            }
                        }
                    }
                    form.render("select");
                    form.render("radio");
                    form.render("checkbox")
                },
                yes: function() {
                    console.log(101);
                    $("#updateAmazonCateMapping").trigger("click");
                },
            });
        }
    });

    form.on("submit(updateAmazonCateMapping)", function(data) {
        console.log(100);
        data.field.bulletPoints= "";
        var pointNum=0;
        $("#amazonCateMappingEdit_Form .bullet_point_class").each(function () {
            if ($(this).find('input').val().trim()) {
                pointNum++;
            } else {
                return false;
            }
            if (data.field.bulletPoints) {
                data.field.bulletPoints += "#,#" + $(this).find('input').val();
            } else {
                data.field.bulletPoints += "#,#" + $(this).find('input').val().trim();
            }
        });
            $.ajax({
                type: "POST",
                url: ctx + "/amazonCateMapping/update.html",
                dataType: "json",
                async: false,
                data: data.field,
                success: function (returnData) {
                    if (returnData.code == "0000") {
                        layer.closeAll();
                        layer.msg("保存成功");
                        $("#amazonCateMapping_search").trigger("click");
                    } else {
                        layer.msg(returnData.msg);
                    }
                },
                error: function () {
                    layer.msg("服务器正忙");
                },
            });
        return false;
    });
});

function add_bullet_point() {
    var tplReq =
        '<div class="bullet_point_class">' +
        '<input style="Width:750px" class="layui-input" type="text" required lay-verify="required" value="#value#" class="layui-input" placeholder="请输入1个bullet_point">' +
        '<i class="layui-icon layui-icon-delete" onclick="del_bullet_point(this)" style="cursor:pointer"></i>'+
        '</div>';

    $(".allBulletPointsClass").append(tplReq.replace("#value#", ""));
    console.log('点击了一次')

}
function del_bullet_point(obj) {
    $(obj).closest('.bullet_point_class').remove()
}


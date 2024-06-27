<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>商品新类目</title>

    <style>
        #LAY-iframe-itemCat .layui-col-md3,
        #LAY-iframe-itemCat .layui-col-xs3 {
            width: 24%;
            height: 305px;
            overflow-y: scroll;
            box-sizing: border-box;
            padding: 2px 10px;
            border: 1px solid #ccc;
        }
        
        #LAY-iframe-itemCat ul li {
            position: relative;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 20px
        }
        
        #LAY-iframe-itemCat .layui-col-xs12 ul li {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        #LAY-iframe-itemCat .layui-col-xs3 ul li i {
            position: absolute;
            top: 4px;
            right: 5px
        }
        
        #LAY-iframe-itemCat ul li:hover {
            background-color: #F4F6F7;
            color: #438EB9
        }
        
        #LAY-iframe-itemCat ul li.cat_active:hover {
            background-color: #6FB3E0;
            color: #fff
        }
        
        #LAY-iframe-itemCat input {
            display: inline-block;
            width: 200px;
            line-height: 1.5;
            padding: 4px 7px;
            font-size: 12px;
            border: 1px solid #dddee1;
            border-radius: 4px;
            color: #495060;
            background-color: #fff;
            background-image: none;
            position: relative;
            cursor: text;
        }
        
        #LAY-iframe-itemCat input:focus {
            outline: 0;
            box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
        }
        
        #LAY-iframe-itemCat input:focus,
        #LAY-iframe-itemCat input:hover {
            border-color: #57a3f3;
        }
        
        .cat_common {
            padding: 3px;
            margin: 3px auto;
            border: 1px solid #f8f8f8;
            box-sizing: border-box;
            font-weight: 700;
            background-color: #f8faff;
            color: #7C9EB2;
            cursor: pointer;
        }
        
        .cat_active {
            background-color: #6FB3E0;
            color: #fff
        }
    </style>

    <div class="layui-fluid" id="LAY-iframe-itemCat">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">

                <input type="text" id="itemCat_input">

                <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px">

                </div>

            </div>
        </div>
    </div>

    <script>
        var $ = layui.$,
            admin = layui.admin,
            layer = layui.layer
            //发送ajax请求获取到需要渲染到页面的数据
        var cateUrl = $("body").attr("cateUrl");
        if (!cateUrl) {
            if (window.location.hash == '#/route/work/smt/catebrand') {
                cateUrl = "/prodcate/getSmtActCateList.html";
            } else {
                cateUrl = "/prodcate/getCateList.html";
            }
        }
        var cateSearchUrl = $("body").attr("cateSearchUrl");
        if (!cateSearchUrl) {
            cateSearchUrl = "/prodcate/searchCate.html";
        }

        function iframe_itemCate(pid) {
            if (typeof(pid) == "undefined") {
                layer.msg('出错了!');
                return;
            };
            itemCat_url();

            function itemCat_url() {
                admin.req({ //等价于ajax请求
                    type: "post",
                    url: ctx + cateUrl,
                    dataType: "json",
                    data: {
                        'pCateId': pid
                    },
                    success: function(data) {
                        var arr = data.data,
                            str = '<div class="layui-col-xs3 layui-col-md3 mr10">\
                            <ul>:listr</ul></div>',
                            listr = '';
                        $.each(arr, function(i, v) {
                            listr += '<li class="cat_common" isLeaf="' + v.isLeafCate + '" cateid="' + v.id + '" onclick="iframe_cateChecked(' + v.id + ',this)">:cateCnName:cateEnName:isLeafIcon</li>';
                            if (v.cateCnName) {
                                listr = listr.replace(':cateCnName', v.cateCnName);
                            } else {
                                listr = listr.replace(':cateCnName', '');
                            }
                            if (v.cateEnName) {
                                listr = listr.replace(':cateEnName', '(' + v.cateEnName + ')');
                            } else {
                                listr = listr.replace(':cateEnName', '');
                            }
                            if (!v.isLeafCate) {
                                listr = listr.replace(':isLeafIcon', '<i class="layui-icon layui-icon-right"></i>');
                            } else {
                                listr = listr.replace(':isLeafIcon', '');
                            }
                        })
                        str = str.replace(':listr', listr);
                        $('#LAY-iframe-itemCat-getCates').append(str);
                    }
                }); //req结束
            }

        };

        //点击事件
        function iframe_cateChecked(pid, obj) {
            $(obj).siblings().removeClass('cat_active');
            $(obj).addClass('cat_active');
            $(obj).parents('.layui-col-xs3.layui-col-md3.mr10').nextAll('.layui-col-xs3.layui-col-md3.mr10').remove();
            if (typeof(pid) == undefined || $(obj).attr('isLeaf') == 'true') {
                $('#btnYes').click();
                return;
            }
            iframe_itemCate(pid);
        }
        iframe_itemCate(0);

        //enter事件
        $('#itemCat_input').keypress(function(e) {
            // e.stopPropagation();
            // e.preventDefault();
            if (e.keyCode == 13) {
                var val = $(this).val();
                if (val == '') {
                    layer.alert('搜索内容不能为空', {
                        icon: 2
                    })
                    return
                }
                layui.admin.load.show()
                admin.req({
                    type: "post",
                    url: ctx + cateSearchUrl,
                    dataType: "json",
                    data: {
                        'searchKey': val
                    },
                    success: function(data) {
                        layui.admin.load.hide();
                        var arr = data.data,
                            str = '<div class="layui-col-xs12 layui-col-md12">\
                                <ul>:listr</ul></div>',
                            listr = '';
                        if (!arr || arr.length < 1) {
                            layer.msg("未查询到分类");
                            return;
                        }
                        $.each(arr, function(i, v) {
                            listr += '<li class="cat_common" cateid="' + v.id + '" ondblclick="itemCate_addClass(this)" onclick="stopBuble(event)">' + v.cateTreeName + '</li>';
                        });
                        str = str.replace(':listr', listr);
                        $('#LAY-iframe-itemCat-getCates').html(str);
                    }
                })
            }
        });
        //点击的时候添加类名
        function itemCate_addClass(obj) {
            $(obj).siblings().removeClass('cat_active');
            $(obj).addClass('cat_active');
            console.log($(obj));
            $('#btnYes').click()
        }
    </script>
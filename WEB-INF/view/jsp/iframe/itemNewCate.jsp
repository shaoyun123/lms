<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
    <title>OA新类目</title>

    <style>
        #LAY-iframe-itemNewCate .layui-col-md3,
        #LAY-iframe-itemNewCate .layui-col-xs3 {
            width: 24%;
            height: 305px;
            overflow-y: scroll;
            box-sizing: border-box;
            padding: 2px 10px;
            border: 1px solid #ccc;
        }
        
        #LAY-iframe-itemNewCate ul li {
            position: relative;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-right: 20px
        }
        
        #LAY-iframe-itemNewCate .layui-col-xs12 ul li {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        #LAY-iframe-itemNewCate .layui-col-xs3 ul li i {
            position: absolute;
            top: 4px;
            right: 5px
        }
        
        #LAY-iframe-itemNewCate ul li:hover {
            background-color: #F4F6F7;
            color: #438EB9
        }
        
        #LAY-iframe-itemNewCate ul li.cate-active:hover {
            background-color: #6FB3E0;
            color: #fff
        }
        
        #LAY-iframe-itemNewCate input {
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
        
        #LAY-iframe-itemNewCate input:focus {
            outline: 0;
            box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
        }
        
        #LAY-iframe-itemNewCate input:focus,
        #LAY-iframe-itemNewCate input:hover {
            border-color: #57a3f3;
        }
        
        .cate-common {
            padding: 3px;
            margin: 3px auto;
            border: 1px solid #f8f8f8;
            box-sizing: border-box;
            font-weight: 700;
            background-color: #f8faff;
            color: #7C9EB2;
            cursor: pointer;
        }
        
        .cate-active {
            background-color: #6FB3E0;
            color: #fff
        }
    </style>

    <div class="layui-fluid" id="LAY-iframe-itemNewCate">
        <div class="layui-row layui-col-space15">
            <div class="layui-col-md12">

                <input type="text" id="itemNewCate_input">

                <div id="LAY-iframe-itemNewCate-getCates" style="margin-top:20px">

                </div>

            </div>
        </div>
    </div>

    <script>
        var $ = layui.$,
            admin = layui.admin,
            layer = layui.layer
            //发送ajax请求获取到需要渲染到页面的数据
        var cateUrl = "/prodCateOaMapping/searchCates";
        var cateSearchUrl = "/prodCateOaMapping/searchCates";

        function iframe_itemNewCate(pid) {
            if (typeof(pid) == "undefined") {
                layer.msg('出错了!');
                return;
            };
            itemNewCate_url();

            function itemNewCate_url() {
                let typeData = 'post', params = { pcateId: pid, cateTreeName: '', platCode: 'oa' };
                commonReturnPromise({
                  url: ctx + cateUrl,
                  type: typeData,
                  contentType: 'application/json',
                  params: JSON.stringify(params),
                }).then(res => {
                  let arr = res,
                            str = '<div class="layui-col-xs3 layui-col-md3 mr10">\
                            <ul>:listr</ul></div>',
                            listr = '';
                        $.each(arr, function(i, v) {
                            listr += '<li class="cate-common" isLeaf="' + v.isLeafCate + '" cateid="' + v.id + '" prodcateid="' + v.pCateId  + '" onclick="iframe_cateChecked(' + v.id + ', this)">:cateName:isLeafIcon</li>';
                            listr = listr.replace(':cateName', v.cateName);
                            if (!v.isLeafCate) {
                                listr = listr.replace(':isLeafIcon', '<i class="layui-icon layui-icon-right"></i>');
                            } else {
                                listr = listr.replace(':isLeafIcon', '');
                            }
                        });
                        str = str.replace(':listr', listr);
                        $('#LAY-iframe-itemNewCate-getCates').append(str);
                });
            }

        };

        //点击事件
        function iframe_cateChecked(pid, obj) {
            $(obj).siblings().removeClass('cate-active');
            $(obj).addClass('cate-active');
            $(obj).parents('.layui-col-xs3.layui-col-md3.mr10').nextAll('.layui-col-xs3.layui-col-md3.mr10').remove();
            if (typeof(pid) == undefined || $(obj).attr('isLeaf') == 1) {
                $('#btnNewYes').click();
                return;
            }
            iframe_itemNewCate(pid);
        }
        
        //首次执行
        iframe_itemNewCate('');

        //enter事件
        $('#itemNewCate_input').keypress(function(e) {
            // e.stopPropagation();
            // e.preventDefault();
            if (e.keyCode == 13) {
                var val = $(this).val();
                let params={}
                if (val == '') {
                    layer.alert('搜索内容不能为空', {
                        icon: 2
                    })
                    return
                }
                if (String(Number(val)) === 'NaN') {
                  params = { pcateId: '', cateTreeName: val, platCode: 'oa' }
                } else {
                  params = { pcateId: val, cateTreeName: '', platCode: 'oa' }
                }

                commonReturnPromise({
                  url: ctx + cateSearchUrl,
                  type: 'post',
                  contentType: 'application/json',
                  params: JSON.stringify(params),
                }).then(res => {
                  let arr = res,
                            str = '<div class="layui-col-xs12 layui-col-md12">\
                                <ul>:listr</ul></div>',
                            listr = '';
                        if (!arr || arr.length < 1) {
                            layer.msg("未查询到分类");
                            return;
                        }
                        $.each(arr, function(i, v) {
                            listr += '<li class="cate-common" cateid="' + v.id +'" prodcateid="' + v.pCateId + '" ondblclick="itemCate_addClass(this)" onclick="stopBuble(event)">' + v.cateName + '</li>';
                        });
                        str = str.replace(':listr', listr);
                        $('#LAY-iframe-itemNewCate-getCates').html(str);
                })
              
            }
        });
        //点击的时候添加类名
        function itemCate_addClass(obj) {
            $(obj).siblings().removeClass('cate-active');
            $(obj).addClass('cate-active');
            $('#btnNewYes').click();
        }
    </script>
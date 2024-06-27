<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
    <style>
        .userDl {
            background: #fff;
            /* padding: 5px; */
            box-sizing: border-box;
            /* position: absolute; */
            margin-top: 5px;
            padding: 5px;
            box-shadow: 10px 10px 5px #888;
            display: none;
        }
        
        #myTodolistDiv {
            right: 175px;
            z-index: 1000;
            height: 40px;
            line-height: 40px;
            position: fixed;
            top: 8px;
        }
        .layui-body{
            left: 0 !important;
        }
        .layui-layout-admin .layui-body {
            top: 0 !important;
        }
    </style>
    <div class="layui-layout layui-layout-admin">
            <%-- <div style="position:fixed;top:0;left:0;background: #20222a;padding: 10px 5px">
                <img src="${ctx}/static/img/${appLogo}" width='40' height='40'>
            </div> --%>
            <!-- 侧边菜单 -->
            <%-- <div class="layui-admin-myMenu">
                <script type="text/html" template lay-url="${ctx}/menu.html" lay-done="ulfunction(d);" id="TPL_layout">
                    <ul lay-shrink="all" id="LAY-system-side-menu" lay-filter="layadmin-system-side-menu">
                        {{# var path = layui.router().path , dataName = layui.setter.response.dataName; layui.each(d[dataName], function(index, item){ var hasChildren = typeof item.list === 'object' && item.list.length > 0 , classSelected = function(){ var match = path[0] ==
                        item.name || (index == 0 && !path[0]) || path.join('/') == item.jump; if(match){ return hasChildren ? 'layui-nav-itemed' : 'layui-this'; } return ''; } , url = typeof item.jump === 'string' ? item.jump : item.name; }}
                        <li data-name="{{ item.name || '' }}" data-jump="{{ item.jump || '' }}" class="{{ classSelected() }}">
                            <span {{ hasChildren ? '' : 'lay-href="'+ url + '"' }} lay-direction="2">
                             {{ item.title }}
                        </span> {{# if(hasChildren){ }}
                            <div class="layui-admin-menuMore myMenuHide" style="overflow-y:auto">
                                {{# layui.each(item.list, function(index2, item2){ var hasChildren2 = typeof item2.list == 'object' && item2.list.length > 0 ,classSelected2 = function(){ var match = path[0] == item.name && path[1] == item2.name; if(match){ return hasChildren2 ? 'layui-nav-itemed'
                                : 'layui-this'; } return ''; } ,url2 = typeof item2.jump === 'string' ? item2.jump : [item.name, item2.name, ''].join('/'); }}
                                <ul style="display:flex;justify-content: flex-start;width:720px;border-bottom:1px dashed #ccc;">
                                    <li style="width:100px;margin:0 10px;color:#000;font-weight:600;font-size:15px">
                                        <div data-name="{{ item2.name || '' }}" data-jump="{{ item2.jump || '' }}" {{ classSelected2() ? ( 'class="'+ classSelected2() + '"') : '' }}>
                                            <span {{ hasChildren2 ? '' : 'lay-href="'+ url2 + '"' }}>{{ item2.title }}</span>
                                        </div>
                                    </li>
                                    <div style="display:flex;justify-content: flex-start; flex-wrap:wrap;width:600px;">
                                        {{# if(hasChildren2){ }} {{# layui.each(item2.list, function(index3, item3){ var match = path[0] == item.name && path[1] == item2.name && path[2] == item3.name , url3 = typeof item3.jump === 'string' ? item3.jump : [item.name, item2.name, item3.name].join('/')
                                        }}
                                        <li style="width:100px;margin:0 10px">
                                            <div data-name="{{ item3.name || '' }}" data-jump="{{ item3.jump || '' }}" {{ match ? 'class="layui-this"' : '' }}>
                                                {{# if(item3.title != null && item3.title.indexOf('系统版本更新') == 0 ){ }}
                                                <a href="${ctx}/static/versionupdate.html" target="_blank">{{ item3.title }}</a>
                                                {{# }else if(item3.title != null && item3.title.indexOf('货架规划') == 0){ }}
                                                <a href="${ctx}/static/shelfplanning/index.html" target="_blank">{{ item3.title }}</a>
                                                {{# }else if(item3.title != null && item3.title.indexOf('数据可视化') == 0){ }}
                                                <a href="${ctx}/static/datavisual/index.html" target="_blank">{{ item3.title }}</a>
                                                {{# }else if(item3.title != null && item3.title.indexOf('Lazada聊天') == 0){ }}
                                                    <a href="/chatui/" target="_blank">{{ item3.title }}</a>
                                                {{# }else if(item3.title != null && item3.title.indexOf('shopee聊天') == 0){ }}
                                                <a href="/chatui/#/shopeeChat" target="_blank">{{ item3.title }}</a>
                                                {{# }else if(item3.title != null && item3.title.indexOf('amazon1') == 0){ }}
                                                    <a>{{}}</a>
                                                {{# }else{ }}
                                                   <a href="javascript:;" lay-href="route{{ item3.icon }}">{{ item3.title }}</a>
                                                 {{# } }}
                                            </div>
                                        </li>
                                        {{# }); }} {{# } }}
                                    </div>
                                </ul>
                                {{# }); }}
                            </div>
                            {{# } }}
                        </li>
                        {{# }); }}
                    </ul>
                </script>
            </div> --%>
            <%-- <li id="myTodolistDiv" class="layui-nav-item" lay-unselect>
                <a href="#/route/app/message/todo" layadmin-event="message" title="我的待办">
                    <i class="layui-icon layui-icon-notice"></i>
                    <script type="text/html" template lay-url="${ctx}/getTodoList.html">
                        {{# if(d.count > 0 ){ }}
                        <span class="layui-badge-dot"></span>
                        <dl class="layui-nav-child">
                            {{# layui.each(d.data, function(index, item){ }}
                            <dd><a href="#/route/app/message/todo">{{item.todoName}} ({{item.todoNum}})</a></dd>
                            {{# }); }}
                        </dl>
                        {{# }else{ }}
                        <dl class="layui-nav-child">
                            <dd>无</dd>
                        </dl>
                        {{# } }}
                    </script>
                </a>

            </li> --%>
            <!-- 页面标签 -->
            <%-- <script type="text/html" template lay-done="layui.element.render('nav', 'layadmin-pagetabs-nav')">
                {{# if(layui.setter.pageTabs){ }}
                <div class="layadmin-pagetabs" id="LAY_app_tabs">
                    <div style="float:left;padding:0 10px">
                        <a href="javascript:;" layadmin-event="refresh" title="刷新">
                            <i class="layui-icon layui-icon-refresh-3"></i>
                        </a>
                    </div>
                    <div class="layui-icon layadmin-tabs-control layui-icon-prev" layadmin-event="leftPage"></div>
                    <div style="position:absolute;right: 80px;top:0px;width:88px;text-align:center;z-index:9;cursor: pointer" id="lmsUserInfo">
                        <div id="lmsUsername">${user}</div>
                        <input id="lmsUserId" value="${lmsUserId}" type="hidden">
                        <dl class="userDl">
                            <dd><a href="#/route/user/modifypwd">修改密码</a></dd>
                            <dd><a href="#/route/user/modifyUserInfo">个人设置</a></dd>
                            <dd><a href="/logout">退出</a></dd>
                        </dl>
                    </div>
                    <div class="layui-icon layadmin-tabs-control layui-icon-next" layadmin-event="rightPage"></div>
                    <div class="layui-icon layadmin-tabs-control layui-icon-down">
                        <ul class="layui-nav layadmin-tabs-select" lay-filter="layadmin-pagetabs-nav">
                            <li class="layui-nav-item" lay-unselect>
                                <a href="javascript:;"></a>
                                <dl class="layui-nav-child layui-anim-fadein">
                                    <dd layadmin-event="closeOtherTabs"><a href="javascript:;">关闭其它标签页</a></dd>
                                    <dd layadmin-event="closeAllTabs"><a href="javascript:;">关闭全部标签页</a></dd>
                                </dl>
                            </li>
                        </ul>
                    </div>
                    <div class="layui-tab" lay-unauto lay-allowClose="true" lay-filter="layadmin-layout-tabs">
                        <ul class="layui-tab-title" id="LAY_app_tabsheader">
                            <li lay-id="{{ layui.setter.entry }}"><i class="layui-icon layui-icon-home"></i></li>
                        </ul>
                    </div>
                </div>
                {{# } }}
            </script> --%>


            <!-- 主体内容 -->
            <div class="layui-body" id="LAY_app_body">
                <div class="layadmin-tabsbody-item layui-show"></div>
            </div>

            <!-- 辅助元素，一般用于移动设备下遮罩 -->
            <div class="layadmin-body-shade" layadmin-event="shade"></div>

    </div>

    <script>
        var ulfunction = function(d) {
            layui.use(['admin', 'layer'], function() {
                var $ = layui.$;
                $("#LAY-system-side-menu").find("li").each(function() {
                    $(this).hover(function() {
                        $(this).find('a').css('color', '#000');
                        $(this).addClass("myMenuhover");
                        $(this).find(".layui-admin-menuMore").removeClass('myMenuHide');
                        $(this).find(".layui-admin-menuMore").css('top', '0')
                        var menuHeight = $('.layui-admin-myMenu').outerHeight()
                        var domheight = $(this).find(".layui-admin-menuMore").offset()? $(this).find(".layui-admin-menuMore").offset().top:0
                        var height = $(this).find(".layui-admin-menuMore").height()
                        // var maxheight = menuHeight-domheight
                        // $(this).find('.layui-admin-menuMore').css('max-height',maxheight)
                        $(this).find('.layui-admin-menuMore').css('max-height', menuHeight)
                        if (height + domheight > menuHeight) {
                            // 超出页面
                            if ((height -45) / 2 < domheight) {
                                $(this).find(".layui-admin-menuMore").css('top', -(height -45) / 2 + 'px')
                            } else {
                                $(this).find(".layui-admin-menuMore").css('top', -domheight + 'px')
                            }
                        }
                    }, function() {
                        $(this).find('a').css('color', '#ccc');
                        $(this).removeClass("myMenuhover");
                        $(this).find(".layui-admin-menuMore").addClass('myMenuHide');
                    })
                })
            });
            $('body').on('mouseenter', '#lmsUserInfo', function() {
                $('.userDl').show();
            });
            $('body').on('mouseleave', '#lmsUserInfo', function() {
                $('.userDl').hide();
            });
        };
    </script>
/**

 @Name：layuiAdmin 核心模块
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：GPL-2
    
 */

layui.define('view', function(exports) {
    var $ = layui.jquery,
        laytpl = layui.laytpl,
        element = layui.element,
        setter = layui.setter,
        view = layui.view,
        device = layui.device()

    , $win = $(window), $body = $('body'), container = $('#' + setter.container)

    , SHOW = 'layui-show', HIDE = 'layui-hide', THIS = 'layui-this', TEMP = 'template', APP_BODY = '#LAY_app_body', APP_FLEXIBLE = 'LAY_app_flexible', APP_SPREAD_SM = 'layadmin-side-spread-sm', TABS_BODY = 'layadmin-tabsbody-item', ICON_SHRINK = 'layui-icon-shrink-right', ICON_SPREAD = 'layui-icon-spread-left', SIDE_SHRINK = 'layadmin-side-shrink', SIDE_MENU = 'LAY-system-side-menu'

    //通用方法
    , admin = {
        v: Date.now()

        //数据的异步请求
        ,
        req: view.req

        //屏幕类型
        ,
        screen: function() {
            var width = $win.width()
            if (width >= 1200) {
                return 3; //大屏幕
            } else if (width >= 992) {
                return 2; //中屏幕
            } else if (width >= 768) {
                return 1; //小屏幕
            } else {
                return 0; //超小屏幕
            }
        }

        //侧边伸缩
        ,
        sideFlexible: function(status) {
        }

        //事件监听
        ,
        on: function(events, callback) {
            return layui.onevent.call(this, setter.MOD_NAME, events, callback);
        }

        //弹出面板
        ,
        popup: view.popup

        //右侧面板
        ,
        popupRight: function(options) {
            //layer.close(admin.popup.index);
            return admin.popup.index = layer.open($.extend({
                type: 1,
                id: 'LAY_adminPopupR',
                anim: -1,
                title: false,
                closeBtn: false,
                offset: 'r',
                shade: 0.1,
                shadeClose: true,
                skin: 'layui-anim layui-anim-rl layui-layer-adminRight',
                area: '300px'
            }, options));
        }

        //主题设置
        ,
        theme: function(options) {
            var theme = setter.theme,
                local = layui.data(setter.tableName),
                id = 'LAY_layadmin_theme',
                style = document.createElement('style'),
                styleText = laytpl([
                    //主题色
                    '.layui-side-menu,', '.layadmin-pagetabs .layui-tab-title li:after,', '.layadmin-pagetabs .layui-tab-title li.layui-this:after,', '.layui-layer-admin .layui-layer-title,', '.layadmin-side-shrink .layui-side-menu .layui-nav>.layui-nav-item>.layui-nav-child', '{background-color:{{d.color.main}} !important;}'

                    //选中色
                    , '.layui-nav-tree .layui-this,', '.layui-nav-tree .layui-this>a,', '.layui-nav-tree .layui-nav-child dd.layui-this,', '.layui-nav-tree .layui-nav-child dd.layui-this a', '{background-color:{{d.color.selected}} !important;}'

                    //logo
                    , '.layui-layout-admin .layui-logo{background-color:{{d.color.logo || d.color.main}} !important;}}'
                ].join('')).render(options = $.extend({}, local.theme, options)),
                styleElem = document.getElementById(id);

            //添加主题样式
            if ('styleSheet' in style) {
                style.setAttribute('type', 'text/css');
                style.styleSheet.cssText = styleText;
            } else {
                style.innerHTML = styleText;
            }
            style.id = id;

            styleElem && $body[0].removeChild(styleElem);
            $body[0].appendChild(style);
            $body.attr('layadmin-themealias', options.color.alias);

            //本地存储记录
            local.theme = local.theme || {};
            layui.each(options, function(key, value) {
                local.theme[key] = value;
            });
            layui.data(setter.tableName, {
                key: 'theme',
                value: local.theme
            });
        }

        //记录最近一次点击的页面标签数据
        ,
        tabsPage: {}

        //获取页面标签主体元素
        ,
        tabsBody: function(index) {
            return $(APP_BODY).find('.' + TABS_BODY).eq(index || 0);
        }

        //切换页面标签主体
        ,
        tabsBodyChange: function(index) {
            admin.tabsBody(index).addClass(SHOW).siblings().removeClass(SHOW);
            events.rollPage('auto', index);
        }

        //resize事件管理
        ,
        resize: function(fn) {
            var router = layui.router(),
                key = router.path.join('-');
            $win.off('resize', admin.resizeFn[key]);
            fn(), admin.resizeFn[key] = fn;
            $win.on('resize', admin.resizeFn[key]);
        },
        resizeFn: {},
        runResize: function() {
            var router = layui.router(),
                key = router.path.join('-');
            admin.resizeFn[key] && admin.resizeFn[key]();
        },
        delResize: function() {
            var router = layui.router(),
                key = router.path.join('-');
            $win.off('resize', admin.resizeFn[key])
            delete admin.resizeFn[key];
        }

    };

    //事件
    var events = admin.events = {
        //伸缩
        flexible: function(othis) {
            var iconElem = othis.find('#' + APP_FLEXIBLE),
                isSpread = iconElem.hasClass(ICON_SPREAD);
            admin.sideFlexible(isSpread ? 'spread' : null);
        }

        //刷新
        ,
        refresh: function() {
            layui.index.render();
        }

        //点击消息
        ,
        message: function(othis) {
           // othis.find('.layui-badge-dot').remove();
        }

        //弹出主题面板
        ,
        theme: function() {
            admin.popupRight({
                id: 'LAY_adminPopupTheme',
                success: function() {
                    view(this.id).render('route/system/theme')
                }
            });
        }

        //便签
        ,
        note: function(othis) {
            var mobile = admin.screen() < 2,
                note = layui.data(setter.tableName).note;

            events.note.index = admin.popup({
                title: '便签',
                shade: 0,
                offset: [
                    '41px', (mobile ? null : (othis.offset().left - 250) + 'px')
                ],
                anim: -1,
                id: 'LAY_adminNote',
                skin: 'layadmin-note layui-anim layui-anim-upbit',
                content: '<textarea placeholder="内容"></textarea>',
                resize: false,
                success: function(layero, index) {
                    var textarea = layero.find('textarea'),
                        value = note === undefined ? '便签中的内容会存储在本地，这样即便你关掉了浏览器，在下次打开时，依然会读取到上一次的记录。是个非常小巧实用的本地备忘录' : note;

                    textarea.val(value).focus().on('keyup', function() {
                        layui.data(setter.tableName, {
                            key: 'note',
                            value: this.value
                        });
                    });
                }
            })
        }

        //弹出关于面板
        ,
        about: function() {
            admin.popupRight({
                id: 'LAY_adminPopupAbout',
                success: function() {
                    view(this.id).render('route/system/about')
                }
            });
        }

        //弹出更多面板
        ,
        more: function() {
            admin.popupRight({
                id: 'LAY_adminPopupMore',
                success: function() {
                    view(this.id).render('system/more')
                }
            });
        }

        //返回上一页
        ,
        back: function() {
            history.back();
        }

        //主题设置
        ,
        setTheme: function(othis) {
            var theme = setter.theme,
                index = othis.data('index'),
                nextIndex = othis.siblings('.layui-this').data('index');

            if (othis.hasClass(THIS)) return;

            othis.addClass(THIS).siblings('.layui-this').removeClass(THIS);

            if (theme.color[index]) {
                theme.color[index].index = index
                admin.theme({
                    color: theme.color[index]
                });
            }
        }

        //左右滚动页面标签
        ,
        rollPage: function(type, index) {
            var tabsHeader = $('#LAY_app_tabsheader'),
                liItem = tabsHeader.children('li'),
                scrollWidth = tabsHeader.prop('scrollWidth'),
                outerWidth = tabsHeader.outerWidth(),
                tabsLeft = parseFloat(tabsHeader.css('left'));

            //右左往右
            if (type === 'left') {
                if (!tabsLeft && tabsLeft <= 0) return;

                //当前的left减去可视宽度，用于与上一轮的页标比较
                var prefLeft = -tabsLeft - outerWidth;

                liItem.each(function(index, item) {
                    var li = $(item),
                        left = li.position().left;

                    if (left >= prefLeft) {
                        tabsHeader.css('left', -left);
                        return false;
                    }
                });
            } else if (type === 'auto') { //自动滚动
                (function() {
                    var thisLi = liItem.eq(index),
                        thisLeft;

                    if (!thisLi[0]) return;
                    thisLeft = thisLi.position().left;

                    //当目标标签在可视区域左侧时
                    if (thisLeft < -tabsLeft) {
                        return tabsHeader.css('left', -thisLeft);
                    }

                    //当目标标签在可视区域右侧时
                    if (thisLeft + thisLi.outerWidth() >= outerWidth - tabsLeft) {
                        var subLeft = thisLeft + thisLi.outerWidth() - (outerWidth - tabsLeft);
                        liItem.each(function(i, item) {
                            var li = $(item),
                                left = li.position().left;

                            //从当前可视区域的最左第二个节点遍历，如果减去最左节点的差 > 目标在右侧不可见的宽度，则将该节点放置可视区域最左
                            if (left + tabsLeft > 0) {
                                if (left - tabsLeft > subLeft) {
                                    tabsHeader.css('left', -left);
                                    return false;
                                }
                            }
                        });
                    }
                }());
            } else {
                //默认向左滚动
                liItem.each(function(i, item) {
                    var li = $(item),
                        left = li.position().left;

                    if (left + li.outerWidth() >= outerWidth - tabsLeft) {
                        tabsHeader.css('left', -left);
                        return false;
                    }
                });
            }
        }

        //向右滚动页面标签
        ,
        leftPage: function() {
            events.rollPage('left');
        }

        //向左滚动页面标签
        ,
        rightPage: function() {
            events.rollPage();
        }

        //关闭其它标签页
        ,
        closeOtherTabs: function(type) {
            var TABS_REMOVE = 'LAY-system-pagetabs-remove';
            if (type === 'all') {
                $(TABS_HEADER + ':gt(0)').remove();
                $(APP_BODY).find('.' + TABS_BODY + ':gt(0)').remove();
            } else {
                $(TABS_HEADER).each(function(index, item) {
                    if (index && index != admin.tabsPage.index) {
                        $(item).addClass(TABS_REMOVE);
                        admin.tabsBody(index).addClass(TABS_REMOVE);
                    }
                });
                $('.' + TABS_REMOVE).remove();
            }
        }

        //关闭全部标签页
        ,
        closeAllTabs: function() {
            events.closeOtherTabs('all');
            location.hash = '';
        }

        //遮罩
        ,
        shade: function() {
            admin.sideFlexible();
        }
    };

    //初始
    ! function() {
        //主题初始化
        var local = layui.data(setter.tableName);
        local.theme && admin.theme(local.theme);

        //禁止水平滚动
        $body.addClass('layui-layout-body');

        //移动端强制不开启页面标签功能
        if (admin.screen() < 1) {
            delete setter.pageTabs;
        }

        //不开启页面标签时
        if (!setter.pageTabs) {
            container.addClass('layadmin-tabspage-none');
        }

        //低版本IE提示
        if (device.ie && device.ie < 10) {
            view.error('IE' + device.ie + '下访问可能不佳，推荐使用：Chrome / Firefox / Edge 等高级浏览器', {
                offset: 'auto',
                id: 'LAY_errorIE'
            });
        }

    }();

    //admin.prevRouter = {}; //上一个路由

    //监听 hash 改变侧边状态
    admin.on('hash(side)', function(router) {
        var path = router.path,
            getData = function(item) {
                return {
                    list: item.children('.layui-nav-child'),
                    name: item.data('name'),
                    jump: item.data('jump')
                }
            },
            sideMenu = $('#' + SIDE_MENU),
            SIDE_NAV_ITEMD = 'layui-nav-itemed'

        //捕获对应菜单
        , matchMenu = function(list, matchIndex) {

            list.each(function(index, item) {
                var othis = $(item),
                    data = getData(othis),
                    listChildren = data.list.children('dd')

                //得到匹配成功的选择器
                , matchSelected = function() {
                    //匹配成功的条件
                    var matched = [(
                        path[0] == data.name ||
                        (index === 0 && !path[0]) ||
                        path.join('/') == data.jump
                    ), (
                        matchMenu.data[0] && path[0] == matchMenu.data[0].name &&
                        path[1] == data.name
                    ), (
                        matchMenu.data[0] && path[0] == matchMenu.data[0].name &&
                        matchMenu.data[1] && path[1] == matchMenu.data[1].name &&
                        path[2] == data.name
                    )];

                    if (matched[matchIndex]) {
                        return data.list[0] ? SIDE_NAV_ITEMD : THIS;
                    }

                    return '';
                };

                //匹配成功
                if (matchSelected()) {
                    othis.addClass(matchSelected()).siblings().removeClass(matchSelected()); //标记选择器
                    matchMenu.data.push(data); //记录上级菜单数据
                    listChildren.length && matchMenu(listChildren, ++matchIndex); //有子菜单，则进入递归
                    return false; //跳出当前循环
                }
            });
        }

        //重置状态
        sideMenu.find('.' + THIS).removeClass(THIS);

        //移动端点击菜单时自动收缩
        if (admin.screen() < 2) admin.sideFlexible();

        //开始捕获
        matchMenu.data = [];
        matchMenu(sideMenu.children('li'), 0);
    });

    //监听侧边导航点击事件
    element.on('nav(layadmin-system-side-menu)', function(elem) {
        if (elem.siblings('.layui-nav-child')[0] && container.hasClass(SIDE_SHRINK)) {
            admin.sideFlexible('spread');
            layer.close(elem.data('index'));
        };
    });

    //监听选项卡的更多操作
    element.on('nav(layadmin-pagetabs-nav)', function(elem) {
        var dd = elem.parent();
        dd.removeClass(THIS);
        dd.parent().removeClass(SHOW);
    });

    //同步路由
    var setThisRouter = function(othis) {
            var layid = othis.attr('lay-id'),
                index = othis.index();

            admin.tabsBodyChange(index);
            location.hash = '/' + (layid === setter.entry ? '' : layid);
        },
        TABS_HEADER = '#LAY_app_tabsheader>li';

    //页面标签点击
    $body.on('click', TABS_HEADER, function() {
        var othis = $(this);
        admin.tabsPage.type = 'tab';
        admin.tabsPage.index = othis.index();
        setThisRouter(othis);

        //执行resize事件，如果存在的话
        admin.runResize();
    });

    //监听 tabspage 删除
    element.on('tabDelete(layadmin-layout-tabs)', function(obj) {
        var othis = $(TABS_HEADER + '.layui-this');
        obj.index && admin.tabsBody(obj.index).remove();
        admin.tabsPage.type = 'tab';
        admin.tabsPage.index = othis.index();
        setThisRouter(othis);
        // //移除resize事件
        admin.delResize();
    });

    //页面跳转
    $body.on('click', '*[lay-href]', function() {
        var othis = $(this),
            href = othis.attr('lay-href'),
            router = layui.router();

        admin.tabsPage.elem = othis;

        //admin.prevRouter[router.path[0]] = router.href; //记录上一次各菜单的路由信息
        location.hash = '/' + href; //执行跳转
    });

    //点击事件
    $body.on('click', '*[layadmin-event]', function() {
        var othis = $(this),
            attrEvent = othis.attr('layadmin-event');
        events[attrEvent] && events[attrEvent].call(this, othis);
    });

    //tips
    $body.on('mouseenter', '*[lay-tips]', function() {
        var othis = $(this);

        if (othis.parent().hasClass('layui-nav-item') && !container.hasClass(SIDE_SHRINK)) return;

        var tips = othis.attr('lay-tips'),
            offset = othis.attr('lay-offset'),
            direction = othis.attr('lay-direction'),
            index = layer.tips(tips, this, {
                tips: direction || 1,
                time: -1,
                success: function(layero, index) {
                    if (offset) {
                        layero.css('margin-left', offset + 'px');
                    }
                }
            });
        othis.data('index', index);
    }).on('mouseleave', '*[lay-tips]', function() {
        layer.close($(this).data('index'));
    });

    //窗口resize事件
    var resizeSystem = layui.data.resizeSystem = function() {
        //layer.close(events.note.index);
        layer.closeAll('tips');

        if (!resizeSystem.lock) {
            setTimeout(function() {
                admin.sideFlexible(admin.screen() < 2 ? '' : 'spread');
                delete resizeSystem.lock;
            }, 100);
        }

        resizeSystem.lock = true;
    }
    $win.on('resize', layui.data.resizeSystem);

    //接口输出
    exports('admin', admin);
});
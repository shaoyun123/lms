/**

 @Name：layuiAdmin 主入口
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：GPL-2
    
 */

layui
  .extend({
    setter: "config", //配置文件
    admin: "lib/admin", //核心模块
    view: "lib/view", //核心模块
  })
  .define(["setter", "admin"], function(exports) {
    var setter = layui.setter,
      element = layui.element,
      admin = layui.admin,
      tabsPage = admin.tabsPage,
      view = layui.view,
      //根据路由渲染页面
      renderPage = function() {
        var router = layui.router(),
          //path一个数组,假如url=http://127.0.0.1/#/work/develop/gatherhot,path=["work", "develop", "gatherhot"]
          path = router.path,
          tabsID = router.href || setter.entry; //以路由地址作为页签ID
        if (!path.length) path = [""];

        if (path[path.length - 1] === "") {
          path[path.length - 1] = setter.entry;
        }

        layui.config({
          base: setter.base + "controller/",
        });

        entryPage;

        //重置状态
        var reset = function(type) {
          renderPage.haveInit && layer.closeAll();
          renderPage.haveInit = true;
          $(APP_BODY).scrollTop(0);

          delete tabsPage.type; //重置页面标签的来源类型
        };

        //如果路由来自于 tab 切换，则不重新请求视图
        if (tabsPage.type === "tab") {
          //切换到非主页、或者切换到主页且主页必须有内容。方可阻止请求
          if (
            tabsID !== setter.entry ||
            (tabsID === setter.entry && admin.tabsBody().html())
          ) {
            admin.tabsBodyChange(tabsPage.index);
            return reset(tabsPage.type);
          }
        }

        //请求视图渲染
        view()
          .render(path.join("/"))
          .then(function(res) {
            //遍历页签选项卡
            var matchTo,
              tabs = $("#LAY_app_tabsheader>li");

            tabs.each(function(index) {
              var li = $(this),
                layid = li.attr("lay-id");

              if (layid === tabsID) {
                matchTo = true;
                tabsPage.index = index;
              }
            });
            // console.log(setter.pageTabs)
            // console.log(tabsID)
            // console.log(setter.entry)
            // console.log(tabsPage)

            //如果未在选项卡中匹配到，则追加选项卡
            if (setter.pageTabs && tabsID !== setter.entry) {
              if (!matchTo) {
                $(APP_BODY).append(
                  '<div class="layadmin-tabsbody-item layui-show"></div>'
                );
                tabsPage.index = tabs.length;
                element.tabAdd(FILTER_TAB_TBAS, {
                  title: "<span>" + (res.title || "新标签页") + "</span>",
                  id: router.href,
                });
              }
            }

            this.container = admin.tabsBody(tabsPage.index);

            //定位当前tabs
            element.tabChange(FILTER_TAB_TBAS, tabsID);
            admin.tabsBodyChange(tabsPage.index);
          })
          .done(function() {
            layui.use("common", layui.cache.callback.common);
            $win.on("resize", layui.data.resize);

            element.render("breadcrumb", "breadcrumb");

            //容器 scroll 事件，剔除吸附层
            admin.tabsBody(tabsPage.index).on("scroll", function() {
              var othis = $(this),
                elemDate = $(".layui-laydate"),
                layerOpen = $(".layui-layer")[0];

                // 固定表头
                toFixedTabHead(this)

              //关闭 layDate
              if (elemDate[0]) {
                elemDate.each(function() {
                  var thisElemDate = $(this);
                  thisElemDate.hasClass("layui-laydate-static") ||
                    thisElemDate.remove();
                });
                othis.find("input").blur();
              }

              //关闭 Tips 层
              layerOpen && layer.closeAll("tips");
            });
          });

        reset();
      },
      //入口页面
      entryPage = function(fn) {
        var router = layui.router(),
          container = view(setter.container);

        if (router.path.join("/") === "user/login") {
          //登入页
          container.render("user/login").done(function() {
            admin.pageType = "alone";
          });
        } else if (admin.pageType === "console") {
          //右侧主体页
          renderPage();
        } else {
          //初始控制台结构
          container.render("/layout").done(function() {
            renderPage();
            layui.element.render();

            if (admin.screen() < 2) {
              admin.sideFlexible();
            }
            admin.pageType = "console";
          });
        }
      },
      APP_BODY = "#LAY_app_body",
      FILTER_TAB_TBAS = "layadmin-layout-tabs",
      $ = layui.$,
      $win = $(window);

    //初始主体结构
    layui.link(
      setter.base + "style/admin.css?v=" + (admin.v + "-2"),
      function() {
        entryPage();
      },
      "layuiAdmin"
    );

    //监听Hash改变
    window.onhashchange = function() {
      entryPage();
      //执行 {setter.MOD_NAME}.hash 下的事件
      layui.event.call(this, setter.MOD_NAME, "hash({*})", layui.router());
    };

    //扩展 lib 目录下的其它模块
    layui.each(setter.extend, function(index, item) {
      var mods = {};
      mods[item] = "{/}" + setter.base + "lib/extend/" + item;
      layui.extend(mods);
    });

    //对外输出
    exports("index", {
      render: renderPage,
    });
  });

//计算表格所占高度
function table_height(){
    var bodyheight = $(window).height();
    var cardheight1 =  $("#LAY_app_body").find('.layui-card').eq(0).outerHeight();
    var cardheight2 =   $("#LAY_app_body").find('.layui-card').eq(1).children('.layui-card-header').outerHeight();
    console.log(bodyheight-cardheight1-cardheight2-120);
    return bodyheight-cardheight1-cardheight2-120;
}
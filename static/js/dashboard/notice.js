//  公告
layui.use(["laydate", "laytpl", "table", "layer", "form"], function () {
  const laydate = layui.laydate;
  const laytpl = layui.laytpl;
  const table = layui.table;
  const layer = layui.layer;
  const form = layui.form;
  const noticeInfo = {
    isEdit: selfRoleNameList.includes("软件测试"),
  };
  let isFirstSearchManagement = true;
  let isFirstSearchNoticeSearch = true;

  changeTab();
  openUnreadNoticeLayer();
  // 打开首页存在未读则立即打开弹窗
  function openUnreadNoticeLayer() {
    commonReturnPromise({
      url: "/lms/sys/notice/listNotice",
      contentType: "application/json",
      type: "post",
      params: JSON.stringify({ readOnlyUnread: true, page: 1, limit: 99999 }),
    }).then((res) => {
      // 打开首页存在未读则立即打开弹窗
      if (Array.isArray(res) && res.length) {
        viewUnreadNoticeInfo(res, res[0].id);
      }
    });
  }

  function changeTab() {
    const noticeTpl = $("#index_dashboard_notice_tpl").html();
    laytpl(noticeTpl).render(noticeInfo, function (html) {
      $("#index_dashboard_notice").html(html);
      //   切换视角
      $("#index_dashboard_notice_switch").click(function () {
        noticeInfo.isEdit = !noticeInfo.isEdit;
        changeTab(noticeInfo);
      });
      if (!noticeInfo.isEdit) {
        isFirstSearchNoticeSearch = true;
        laydate.render({
          elem: "#index_dashboard_notice_form_time",
          range: true,
          type: "datetime",
        });
        $("#index_dashboard_notice_timeline").on("scroll", function () {
          if (isFirstSearchNoticeSearch) {
            const scrollTop = $(this).scrollTop();
            const scrollHeight = $(this)[0].scrollHeight;
            const height = $(this).height();
            if (scrollTop + height >= scrollHeight) {
              submitDashboardNotice(99999, true, scrollTop);
            }
          }
        });

        form.render();
        submitDashboardNotice(7);
        // 点击按钮高亮为蓝色，下方展开相关查询项，再次点击收起收索框，按钮返回黑色;改变列表高度
        $("#index_dashboard_notice_showSearch").click(function () {
          if ($(this).hasClass("blue")) {
            $("#index_dashboard_notice_form").show();
            $(this).removeClass("blue");
            $("#index_dashboard_notice_timeline").css("height", "238px");
          } else {
            $("#index_dashboard_notice_form").hide();
            $(this).addClass("blue");
            $("#index_dashboard_notice_timeline").css("height", "280px");
          }
        });
        triggerDashBoardNotice();
      } else {
        laydate.render({
          elem: "#index_dashboard_notice_management_time",
          range: true,
          type: "datetime",
        });
        getManagementList();
        $("#index_dashboard_notice_management_search").click(function () {
          getManagementList();
        });
        // 新建
        $("#index_dashboard_notice_management_add").click(function () {
          editNotice(true);
        });
      }
    });
  }

  // 点击icon、回车、移除焦点位置均支持搜索
  function triggerDashBoardNotice() {
    const input = document.getElementById(
      "index_dashboard_notice_form_content"
    );
    // 添加键盘按下事件监听器
    input.addEventListener("keydown", function (event) {
      // 判断按下的键是否为回车键
      if (event.key === "Enter") {
        isFirstSearchNoticeSearch = false;
        submitDashboardNotice();
      }
    });
    input.addEventListener("blur", function (event) {
      isFirstSearchNoticeSearch = false;
      submitDashboardNotice();
    });
    $("#index_dashboard_notice_form_submit").click(function () {
      isFirstSearchNoticeSearch = false;
      submitDashboardNotice();
    });
  }

  //   查询公告
  function submitDashboardNotice(
    pageLimit = 99999,
    isScroll = false,
    scrollTop = 0
  ) {
    const formDom = $("#index_dashboard_notice_form");
    const params = {
      content: formDom.find("input[name=content]").val(),
      readOnlyUnread: formDom.find("input[name=readOnlyUnread]").is(":checked")
        ? true
        : "",
      limit: pageLimit,
      page: 1,
    };
    const time = formDom.find("input[name=time]").val();
    if (time) {
      params.startTime = time.split(" - ")[0];
      params.endTime = time.split(" - ")[1];
    }
    const timeLineTpl = $("#index_dashboard_notice_timeline_tpl").html();
    if (isScroll) {
      isFirstSearchNoticeSearch = false;
    }
    commonReturnPromise({
      url: "/lms/sys/notice/listNotice",
      contentType: "application/json",
      type: "post",
      params: JSON.stringify(params),
    }).then((data) => {
      laytpl(timeLineTpl).render(data, function (html) {
        $("#index_dashboard_notice_timeline").html(html);
        if (isScroll) {
          // 滑倒之前滚动条位置
          $("#index_dashboard_notice_timeline").scrollTop(scrollTop);
        }
        $("#index_dashboard_notice_timeline")
          .find(".layui-timeline-item")
          .click(function () {
            const id = $(this).data("id");
            viewNoticeInfo(data, id);
          });
      });
    });
  }
  // 公告详情
  function viewNoticeInfo(data, id) {
    const curObj = data.find((v) => v.id == id);
    let curObjIndex = data.findIndex((v) => v.id == id);
    layer.open({
      title: "系统公告",
      content: "",
      type: 1,
      btn: ["我已知晓", "稍后再看", "标记未读", "关闭"],
      area: ["600px", "600px"],
      success: function (layero, index) {
        // 改颜色
        const btnDoms = $(layero).find(".layui-layer-btn a");
        btnDoms.each(function (index) {
          if(index !== btnDoms.length -1){
          // 最后一个按钮关闭，不修改样式
            $(this).css({
              "border-color": "#1E9FFF",
              "background-color": "#1E9FFF",
              color: "#fff",
            });
          }
        });
        laytpl($("#index_dashboard_notice_detail_tpl").html()).render(
          curObj,
          function (html) {
            $(layero).find(".layui-layer-content").html(html);
            noticeShowBtn(curObj, $(layero));
          }
        );
      },
      // 标记未读
      btn3: function (index, layero) {
        const params = [curObj.id];
        commonReturnPromise({
          url: "/lms/sys/notice/markUnReadNotice",
          contentType: "application/json",
          type: "post",
          params: JSON.stringify(params),
        }).then((res) => {
          layer.msg(res, { icon: 1 });
          changeTreeLi(data, curObjIndex, false);
          layer.close(index);
        });
      },
      // 稍后再看
      btn2: function (index, layero) {},
      // 我已知晓
      btn1: function (index, layero) {
        const params = [data[curObjIndex].id];
        commonReturnPromise({
          url: "/lms/sys/notice/markReadNotice",
          contentType: "application/json",
          type: "post",
          params: JSON.stringify(params),
        }).then((res) => {
          layer.msg(res, { icon: 1 });
          changeTreeLi(data, curObjIndex, true);
          layer.close(index);
        });
      },
    });
  }

  //   改变节点颜色
  function changeTreeLi(data, curObjIndex, isRead) {
    data[curObjIndex].isRead = isRead;
    const _curObj = data[curObjIndex];
    laytpl($(`#index_dashboard_notice_timeline_li_tpl`).html()).render(
      _curObj,
      function (html) {
        $(`#index_dashboard_notice_timeline_li_${_curObj.id}`).html(html);
      }
    );
  }

  //   首页弹窗未读
  function viewUnreadNoticeInfo(data, id) {
    const curObj = data.find((v) => v.id == id);
    let curObjIndex = data.findIndex((v) => v.id == id);
    let title = `系统公告(${curObjIndex + 1}/${data.length})`;
    const hasDetailLayer = $("#index_dashboard_notice_detail").length;
    if (hasDetailLayer) {
      // 修改标题
      loading.show();
      const layerDom = $("#index_dashboard_notice_detail").parents(
        ".layui-layer.layui-layer-page"
      );
      const $layerTitle = layerDom.find(".layui-layer-title");
      $layerTitle.text(title);
      laytpl($("#index_dashboard_notice_detail_tpl").html()).render(
        curObj,
        function (html) {
          layerDom.find(".layui-layer-content").html(html);
          loading.hide();
        }
      );
    } else {
      layer.open({
        title,
        content: "",
        type: 1,
        btn: ["我已知晓", "稍后再看"],
        area: ["600px", "600px"],
        success: function (layero, index) {
          // 改颜色
          $(layero)
            .find(".layui-layer-btn a")
            .each(function () {
              $(this).css({
                "border-color": "#1E9FFF",
                "background-color": "#1E9FFF",
                color: "#fff",
              });
            });
          laytpl($("#index_dashboard_notice_detail_tpl").html()).render(
            curObj,
            function (html) {
              $(layero).find(".layui-layer-content").html(html);
            }
          );
        },
        // 稍后再看
        btn2: function (index, layero) {
          curObjIndex++;
          if (curObjIndex < data.length) {
            viewUnreadNoticeInfo(data, data[curObjIndex].id);
            return false;
          } else {
            layer.closeAll();
          }
        },
        // 我已知晓
        btn1: function (index, layero) {
          const params = [data[curObjIndex].id];
          commonReturnPromise({
            url: "/lms/sys/notice/markReadNotice",
            contentType: "application/json",
            type: "post",
            params: JSON.stringify(params),
          }).then(() => {
            curObjIndex++;
            if (curObjIndex < data.length) {
              viewUnreadNoticeInfo(data, data[curObjIndex].id);
              return false;
            } else {
              layer.closeAll();
            }
            // if (data.length > 1) {
            //   data.splice(curObjIndex, 1);
            //   if (data.length === curObjIndex) {
            //     curObjIndex--;
            //   }
            //   viewUnreadNoticeInfo(data, data[curObjIndex].id);
            //   return false;
            // } else {
            //   layer.closeAll();
            // }
          });
        },
        end: function () {
          submitDashboardNotice(7);
        },
      });
    }
  }
  function noticeShowBtn(curObj, layerDom) {
    if (curObj.isRead) {
      layerDom.find(".layui-layer-btn0").hide();
      layerDom.find(".layui-layer-btn1").hide();
      layerDom.find(".layui-layer-btn2").show();
      layerDom.find(".layui-layer-btn3").show();
    } else {
      layerDom.find(".layui-layer-btn0").show();
      layerDom.find(".layui-layer-btn1").show();
      layerDom.find(".layui-layer-btn2").hide();
      layerDom.find(".layui-layer-btn3").hide();
    }
  }
  // 几分钟前
  function gettimeFormat(targetTime, dom) {
    let timer = null;
    let nowTimeStamp = new Date().getTime();
    let diffTimeStamp = nowTimeStamp - targetTime;
    if (diffTimeStamp < 60 * 60 * 1000) {
      if (diffTimeStamp < 60 * 1000) {
        $(dom).text("刚刚");
      } else {
        const text = Math.floor(diffTimeStamp / 60000);
        $(dom).text(text + "分钟前");
      }
      timer = setInterval(function () {
        nowTimeStamp = new Date().getTime();
        diffTimeStamp = nowTimeStamp - targetTime;
        if (diffTimeStamp > 60 * 60 * 1000) {
          const text = Format(targetTime, "yyyy-MM-dd hh:mm:ss");
          dom.text(text);
          clearInterval(timer);
        } else {
          const text = Math.floor(diffTimeStamp / 60000);
          $(dom).text(text + "分钟前");
        }
      }, 60000);
    } else {
      const text = Format(targetTime, "yyyy-MM-dd hh:mm:ss");
      dom.text(text);
    }
  }
  function getManagementList() {
    const time = $("#index_dashboard_notice_management_time").val();
    const params = { startTime: "", endTime: "", status: "" };
    if (time) {
      params.startTime = time.split(" - ")[0];
      params.endTime = time.split(" - ")[1];
    }
    if (isFirstSearchManagement) {
      params.status = "未发布";
      isFirstSearchManagement = false;
    }
    commonReturnPromise({
      url: `/lms/sys/notice/listManagement?startTime=${params.startTime}&endTime=${params.endTime}&status=${params.status}`,
    }).then((data) => {
      table.render({
        elem: "#index_dashboard_notice_management_table",
        data: data,
        cols: [
          [
            {
              title: "发布内容",
              field: "title",
              templet: "#index_dashboard_notice_management_table_title",
              minWidth: 200,
            },
            {
              title: "最新修改",
              field: "modify",
              templet: function (d) {
                const timeId = `index_dashboard_notice_management_table_${d.id}`;
                const timer = `<span id="${timeId}">${Format(
                  d.modifyTime || d.createTime,
                  "yyyy-MM-dd hh:mm:ss"
                )}</span>`;
                const modifier = `<span class='ml10'>${
                  d.modifier || d.creator
                }</span>`;
                const remark = `<span class='ml10'>${d.remark}</span>`;
                return `<div>${timer}${modifier}${remark}</div>`;
              },
            },
            {
              title: "操作",
              templet: "#index_dashboard_notice_management_toolbar",
              width: 200,
            },
          ],
        ],
        height: 240,
        page: false,
        limit: 9999999,
        id: "index_dashboard_notice_management_table",
        done: function (res) {
          res.data.forEach((d) => {
            const timeIdDom = $(
              `#index_dashboard_notice_management_table_${d.id}`
            );
            gettimeFormat(d.modifyTime || d.createTime, timeIdDom);
          });
          tableEvents();
        },
      });
    });
  }

  function tableEvents() {
    table.on("tool(index_dashboard_notice_management_table)", function (obj) {
      const { data, event } = obj;
      if (event === "editNotice") {
        editNotice(false, data);
      } else if (event === "publishNotice") {
        commonReturnPromise({
          url: `/lms/sys/notice/publishNotice?noticeId=${data.id}`,
        }).then(() => {
          layer.msg("发布成功！", { icon: 1 });
          getManagementList();
        });
      } else if (event === "revokeNotice") {
        commonReturnPromise({
          url: `/lms/sys/notice/revokeNotice?noticeId=${data.id}`,
        }).then(() => {
          layer.msg("撤回成功！", { icon: 1 });
          getManagementList();
        });
      } else if (event === "logNotice") {
        getLogList(data);
      }
    });
  }

  function getLogList(data) {
    commonReturnPromise({
      url: `/lms/sys/notice/listLogByNoticeId?noticeId=${data.id}`,
    }).then((res) => {
      layer.open({
        title: "发布记录",
        content: "",
        offset: "100px",
        type: 1,
        // btn: ["取消"],
        area: ["300px", "400px"],
        success: function (layero, index) {
          laytpl($("#index_dashboard_notice_log").html()).render(
            res,
            function (html) {
              $(layero).find(".layui-layer-content").html(html);
              //   改变弹窗高度
              res.forEach((v) => {
                const timeIdDom = $(`#index_dashboard_notice_log_${v.id}`);
                gettimeFormat(v.createTime, timeIdDom);
              });
            }
          );
        },
      });
    });
  }
  function editNotice(isAdd = false, basicInfo = {}) {
    let noticeEditor;
    layer.open({
      title: isAdd ? "新增公告" : "编辑公告",
      content: $("#index_dashboard_notice_editor_tpl").html(),
      offset: "100px",
      type: 1,
      btn: ["保存", "取消"],
      area: ["800px", "600px"],
      success: function (layero, index) {
        noticeEditor = wangEditorRender(
          "index_dashboard_notice_editor",
          isAdd ? "" : basicInfo.richTextContent
        );
        laydate.render({
          elem: "#index_dashboard_notice_editor_expectPublishTime",
          type: "datetime",
        });
        if (!isAdd) {
          const formDom = $("#index_dashboard_notice_editor_form");
          const expectPublishTime = Format(
            basicInfo.expectPublishTime,
            "yyyy-MM-dd hh:mm:ss"
          );
          $("#index_dashboard_notice_editor_expectPublishTime").val(
            expectPublishTime
          );
          formDom.find("input[name=title]").val(basicInfo.title);
        }
        $(layero).find(".w-e-text-container").css("height", "400px");
      },
      yes: function (index, layero) {
        const sysNoticeInfoList = [];
        let noticeSort = 0;
        function getNoticeJsonloop(v, sysNoticeInfoList) {
          if (v.children && Array.isArray(v.children)) {
            v.children.forEach((item) => {
              if (typeof item == "string") {
                // 目前仅针对文字进行了提取
                const newStr = decodeEscapedCharacters(item);
                if (!!newStr.trim()) {
                  sysNoticeInfoList.push({
                    sort: noticeSort,
                    content: newStr,
                  });
                  noticeSort++;
                }
              } else {
                getNoticeJsonloop(item, sysNoticeInfoList);
              }
            });
          } else {
            if (typeof v == "string") {
              // 目前仅针对文字进行了提取
              const newStr = decodeEscapedCharacters(v);
              if (!!newStr.trim()) {
                sysNoticeInfoList.push({
                  sort: noticeSort,
                  content: newStr,
                });
                noticeSort++;
              }
            }
          }
        }
        if (Array.isArray(noticeEditor.txt.getJSON())) {
          noticeEditor.txt.getJSON().forEach((v) => {
            getNoticeJsonloop(v, sysNoticeInfoList);
          });
        }
        const formObj = serializeObject(
          $("#index_dashboard_notice_editor_form")
        );
        const richTextContent = noticeEditor.txt.html();
        const params = {
          sysNoticeInfoList,
          richTextContent:
            richTextContent === "<p><br></p>" ? "" : richTextContent,
          title: formObj.title,
          expectPublishTime: formObj.expectPublishTime,
        };
        if (!formObj.expectPublishTime) {
          return layer.msg("请填写上线时间");
        }
        if (!isAdd) {
          params.noticeId = basicInfo.id;
        }
        commonReturnPromise({
          url: "/lms/sys/notice/saveOrUpdateNotice",
          type: "post",
          params: JSON.stringify(params),
          contentType: "application/json",
        }).then(() => {
          layer.msg("操作成功", { icon: 1 });
          layer.closeAll();
          getManagementList();
        });
      },
    });
  }
  function decodeEscapedCharacters(str) {
    const _str = str
      .replaceAll("<br/>", "")
      .replaceAll("<br>", "")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&amp;;", "&")
      .replaceAll("&quot;", `"`);

    return _str;
  }
});

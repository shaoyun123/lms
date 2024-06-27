<!-- 类目预设 -->
<%@ page language="java" import="java.util.*" contentType="text/html;charset=UTF-8" %>
  <style>
    #catePresetsCard .layui-table-body {
      overflow-x: hidden;
    }
  </style>
  <script type="text/html" id="catePresets_Layer">
  <div class="layui-fluid">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-lg12 layui-col-md12">
        <div class="layui-card" id="catePresetsCard">
          <div class="layui-card-header" style="z-index: 10000;height: auto;">
            <button class="layui-btn layui-btn-normal layui-btn-sm" id="catePresets_addCateBtn">新增类目</button>
          </div>
          <div class="layui-card-body" id="catePresets_tableDiv">
            <table class="layui-hide" id="catePresets_table" lay-filter="catePresets_table"></table>
          </div>
        </div>
      </div>
    </div>
  </div>
</script>

  <script type="text/html" id="catePresets_tool">
  <div class="layui-btn-container">
    <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="edit">编辑</button>
    <button class="layui-btn layui-btn-sm layui-btn-danger" lay-event="del">删除</button>
    <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="choose">选择</button>
  </div>
</script>

  <script type="text/html" id="layer_work_common_pl">
  <div class="layui-fluid" id="LAY-iframe-itemCat">
      <div class="layui-row layui-col-space15">
          <div class="layui-col-md12">
              <input type="text" id="itemCat_input_common" />
              <div id="LAY-iframe-itemCat-getCates" style="margin-top:20px"></div>
          </div>
      </div>
  </div>
</script>

  <script>
    let currentCateOaId = ''
    let showDom = ''
    layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'laydate', 'element', 'upload', 'formSelects'], function () {
      var layer = layui.layer,
        admin = layui.admin,
        table = layui.table,
        form = layui.form,
        element = layui.element,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        $ = layui.$,
        laydate = layui.laydate
      form.render()

      // 常用类目预设
      $('.catePresetsBtn').click(function (e) {
        showDom = $(e.target).attr('data-show')
        var popIndex = layer.open({
          title: '常用类目预设',
          type: 1,
          area: ['50%', '60%'],
          id: 'catePresets',
          btn: ['关闭'],
          content: $('#catePresets_Layer').html(),
          success: async function (layero) {
            layuiOpenPop = true
            // 获取常用类目预设列表
            renderCateTable()
            // 新增类目
            $('#catePresets_addCateBtn').click(function () {
              cateLayerOpen('oa', 'layer_work_common_pl', showDom, '#itemCat_input_common', renderMapping, {}, {}, false)
            })
          },
          end: function () {
            layuiOpenPop = false
          }
        })
      })
      //工具条的监听事件,table.on(tool(表格的lay-filter的值))
      table.on('tool(catePresets_table)', function (obj) {
        var data = obj.data, //获得当前行数据
          layEvent = obj.event; //获得 lay-event 对应的值
        if (layEvent === 'edit') {
          currentCateOaId = data.cateOAId
          cateLayerOpen('oa', 'layer_work_common_pl', showDom, '#itemCat_input_common', renderMappingEdit, {}, {}, false)
        }
        if (layEvent === 'del') {
          layer.confirm('确定要删除吗？', function (index) {
            $.ajax({
              type: 'get',
              url: '/lms/prodCateOaRef/deleteCateOaRef?ids=' + data.id,
              success: function (res) {
                if (res.code == '0000') {
                  layer.msg('删除成功！');
                  renderCateTable()
                } else {
                  layer.msg(res.msg || '删除失败！', {icon: 5});
                }
              }
            });
          });
        }
        if (layEvent === 'choose') {
          $('#' + showDom).text('OA新类目：' + data.cateTreeName);
          $('#' + showDom).next('input').val(data.cateOAId)
          layer.closeAll()
        }
      });
    })

    function renderMapping (id) {
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/lms/prodCateOaRef/insertCateOaRef',
        data: {
          cateOaId: id
        },
        success: function (res) {
          console.log(res);
          if (res.code == '0000') {
            layer.msg('新增成功！');
            renderCateTable()
          } else {
            layer.msg(res.msg || '新增失败！', {icon: 5});
          }
        }
      });
    }

    function renderMappingEdit (id) {
      // 修改类目路径到表格中
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/lms/prodCateOaRef/updateCateOaRef',
        data: {
          lastCateOaId: id,
          currentCateOaId
        },
        success: function (res) {
          if (res.code == '0000') {
            layer.msg('编辑成功！');
            renderCateTable()
          } else {
            layer.msg(res.msg || '编辑失败！', {icon: 5});
          }
        }
      });
    }

    function renderCateTable () {
      layui.table.render({
        elem: '#catePresets_table',
        method: 'get',
        url: ctx + '/prodCateOaRef/queryPage',
        cols: [
          [ // 店铺销售人员列表
            {
              title: "序号",
              type: 'numbers',
              width: 100
            },
            {
              title: "类目路径",
              field: "cateTreeName"
            },
            { title: '操作', templet: '#catePresets_tool', width: 250, align: 'center' }
          ]
        ],
        page: true,
        limit: 10,
        id: 'catePresets_table',
        done: function (data) { }
      });
    }
  </script>
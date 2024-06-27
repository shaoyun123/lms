layui.use(['admin', 'layer', 'table', 'form', 'laytpl', 'jquery'], function () {
    var layer = layui.layer,
      table = layui.table,
      table1 = layui.table,
      form = layui.form,
      laytpl = layui.laytpl,
      $ = layui.$,
      admin = layui.admin;
    var checkedResId = 0;
    //*发送请求
    const requestData = {
      //查询类目树
      categoryTree() {return axios(ctx + '/prodCateOa/get/cate/tree');},
      //根据ID查询类目
      queryCategory(id) {return axios({url: ctx + '/prodCateOa/get/cate/' + id, });},
      //根据类目ID查询所有属性
      queryAttribute(cateId) {return axios({url: ctx + '/prodCateOa/get/cate/attr/all/' + cateId,});},
      //根据类目属性ID查询类目属性以及属性值
      queryAttributeValues(cateAttrId) {return axios({url: ctx + '/prodCateOa/get/cate/attr/' + cateAttrId,});},
      //根据id删除类目
      removeCategory(id) { return axios.post(ctx + '/prodCateOa/remove/cate/' + id);},
      //新增类目属性
      addAttrbute(data){
        return axios ({
          method:'post',
          url:ctx+'/prodCateOa/add/cate/attr',
          data,
        })
      },
      //修改类目属性
      editAttruibute(data) {
        return axios({
          method:'post',
          url:ctx+'/prodCateOa/update/cate/attr',
          data
        })
      },
      //复制类目
      copyCategoryRe(data) {
        return axios({
          method:'post',
          url:ctx+'/prodCateOa/copyAndUpdateOaInfo',
          data
        })
      }
    };
    //*数据仓库
    const dataWarehouse = {
      category: [],
      categoryState: '',
      attribute: [],
      attributeState: '',
      resource_editBtn: {},
    };
    createdXtree();
    //添加类目弹出框
    $('#addCategoryBtn').click(function () {
      dataWarehouse.categoryState = '添加';
      openLayer(dataWarehouse.categoryState);
    });
    //修改类目弹出框
    $('#modifyCategoryBtn').click(function () {
      dataWarehouse.categoryState = '修改';
      openLayer(dataWarehouse.categoryState);
    });
    //删除类目弹出框
    $('#removeCategoryBtn').click(function () {
      if (dataWarehouse.category.length <= 0) {
        return layer.msg('请先选择再删除');
      }
      layer.open({
        title: '删除类目',
        area: 'auto',
        content: '确定删除此类目？',
        btn: ['确定', '取消'],
        yes: async function (index, layero) {
          let { data: res } = await requestData.removeCategory(dataWarehouse.category[0].id);
          res.code === '0000' ? layer.msg('删除成功！') : layer.msg(res.msg);
          createdXtree();
        },
      });
    });
    //复制类目弹出框
    $('#copyCategoryBtn').click(function () {
      if (dataWarehouse.category.length===0||dataWarehouse.category[0].isLeafCate!==1){
        return layer.msg('请选择叶子节点复制类目')
      }
      layer.open({
        type: 1,
        title: '复制类目',
        area: ['500px','300px'],
        content: $('#copyCategory').html(),
        btn: ['复制', '取消'],
        success: function (layero, index) {
          let OAcategoryObj = dataWarehouse.category[0]
          $(layero).find('input[name=coppiedCateOaId]').val(OAcategoryObj.id)
          $(layero).find('input[name=coppiedNewCateName]').val(OAcategoryObj.cateName)
        },
        yes: async function (index, layero) {
          let OAcategoryObjInfo = serializeObject($('#copyCategory_Form'))
          if ($(layero).find('input[name=newCateOaName]').val() && $(layero).find('input[name=newCateOaName]').val().length) {
            OAcategoryObjInfo.newCateOaName = comRepEnglishQuote($(layero).find('input[name=newCateOaName]').val())
            OAcategoryObjInfo.coppiedNewCateName = comRepEnglishQuote($(layero).find('input[name=coppiedNewCateName]').val())
            OAcategoryObjInfo.coppiedCateOaId = $(layero).find('input[name=coppiedCateOaId]').val()
            try {
              let { data: res } = await requestData.copyCategoryRe(OAcategoryObjInfo);
              if (res.code == '0000') {
                layer.close(index)
                createdXtree();
                return layer.msg('复制成功！')
              }
              layer.msg(res.msg)
            }catch(err) {
              return layer.msg('请求失败')
            }
          }else {
            return layer.msg('请填写新类目名')
          }
        },
      });
    })
    //完整性检测弹出框
    // $('#integrityDetection').click(function () {});
    //新增属性弹出框
    $('#adddAttribute').click(function () {
      if (dataWarehouse.category.length===0||dataWarehouse.category[0].isLeafCate!==1){
        return layer.msg('请选择叶子节点新增属性')
      }
      dataWarehouse.attributeState = '新增';
      openAttributeLayer();
    });
    //添加/修改类目提交按钮
    form.on('submit(addBtn)', function (data) {
      let state = dataWarehouse.categoryState;
      let field = {};
      field.cateName = data.field.cateName;
      field.sort = data.field.sort;
      if (state === '添加') {
        field.pcateId = data.field.pcateId;
        addcategory('/prodCateOa/add/cate', state, field);
      } else {
        field.id = data.field.id;
        addcategory('/prodCateOa/update/cate', state, field);
      }
      return false;
    });
    //新增/修改属性提交按钮
    form.on('submit(resource_editBtn)', function (data) {
      let resource_editBtn = dataWarehouse.resource_editBtn;
      if (dataWarehouse.attributeState === '新增') {
        resource_editBtn.cateOaId = parseInt(data.field.id);
      } else {
        resource_editBtn.id = parseInt(data.field.cateOaId);
      }
      resource_editBtn.attrName = data.field.attrName;
      data.field.fill === '0' ? (resource_editBtn.isMandatory = 0) : (resource_editBtn.isMandatory = 1);
      resource_editBtn.sort = data.field.sort;
      return false;
    });
    //工具条的监听事件,table.on(tool(表格的lay-filter的值))
    let flag=true
    table.on('tool(resourceTable)', async function (obj) {
      if (obj.event === 'edit') {
        // * 根据类目id查询所有属性值
        if (flag) {
          flag=false
          dataWarehouse.attributeState = '修改';
          openAttributeLayer(obj.data.cateOaAttrId);
        }
      }
    });
    //修改属性值表格
    table1.on('tool(queryAttrRoleTable)', async function (obj) {
      if (obj.event === 'edit') {
        dataWarehouse.attribute = dataWarehouse.attribute.filter((val) => val.attrName !== obj.data.attrName);
        $(this).parents('tr').remove();
      }
    });
    //?inputNumber控制加减
   function InpNumber() {
   let number=  $('input[type=number]')
   let length=$('input[type=number]').length
   for (let index = 0; index < length; index++) {
    $(number[index]).keydown(function(e) {
      if (e.keyCode===190||e.keyCode===69||e.keyCode===189||e.keyCode===229||e.keyCode===16||e.keyCode===187) {
        return false
      }
    })
   }
   } 
    //?加载属性表格
    function attributeTable(cateId, data) {
      table.render({
        elem: '#resourceTable',
        cols: [
          [
            //标题栏
            { title: '属性名', field: 'attrName' },
            { title: '属性值', field: 'attrValues' },
            {
              title: '是否必填',
              field: 'isMandatory',templet:(data)=> data.isMandatory==1?'是':'否'
            },
            { title: '操作', toolbar: '#resourceOperBar', width: '30%' }, //toolbar-开启表格头部工具栏区域，该参数支持四种类型值：
          ],
        ],
        id: 'sysResourceTable',
        data, 
      });
    }
    //?Xtree渲染
    async function createdXtree() {
      attributeTable('', []);
      dataWarehouse.category = [];
      dataWarehouse.attribute = [];
      let res = await requestData.categoryTree();
      res=JSON.parse(res.data.data)
      var resXTree = new layuiXtree({
        elem: 'resourceMangeXTree', //(必填) 放置xtree的容器，样式参照 .xtree_contianer
        form: form, //(必填) layui 的 from
        data: cycle(res), //(必填) json数据
        elem: 'resourceMangeXTree', //(必填) 放置xtree的容器id，不要带#号,
        form: form, //(必填) layui 的 from,
        isopen: false, //加载完毕后的展开状态，默认值：true,
        isCheckOnly: true,
        // data: res.data.data, //(必填) json数组
        color: {
          //三种图标颜色，独立配色，更改几个都可以
          open: '#EE9A00', //节点图标打开的颜色
          close: '#EEC591', //节点图标关闭的颜色
          end: '#828282', //末级节点图标的颜色
        },
        click: async function (data) {
          // data.value--拿到点击的id
          dataWarehouse.category = [];
          dataWarehouse.attribute = [];
          if (data.elem.checked) {
            //* 查询类目
            let { data: res } = await requestData.queryCategory(data.value);
            dataWarehouse.category.push(res.data);
            if (res.data.isLeafCate === 0) {
              attributeTable('', []);
              resXTree.SetOtherCheckedFalse(data.value); //单选
              return;
            }
            dataWarehouse.dataValue=data.value
            // * 根据类目属性ID查询类目属性以及属性值
            let { data: result } = await requestData.queryAttribute(data.value);
           if (result.code!=='0000') {
             return layer.msg(result.msg)
           }
           attributeTable(data.value,result.data)
           resXTree.SetOtherCheckedFalse(data.value); //单选
          } else {
            attributeTable('', []);
            return (dataWarehouse.category = []);
          }
          resXTree.SetOtherCheckedFalse(data.value); //单选
        },
      });
    }
    //?处理数据添加空数组
    function cycle(array) {
      array.forEach(function (value) {
        value.title = comRepEnglishQuote(value.title)
        value.data === undefined?value.data = []:cycle(value.data)
      });
      return array;
    }
    //?打开类目弹出框
    let cateflag=true
    function openLayer(state) {
      cateflag=true
      layer.closeAll()
      if (dataWarehouse.category.length <= 0) {
        if (state === '修改') {
          return layer.msg('请选择再修改');
        }
      }
      layer.open({
        type: 1,
        title: state + '类目',
        shadeClose: false,
        area: ['750px', '350px'],
        content: $('#addLayer'),
        move: false,
        success: function (layero) {
          InpNumber()
           var mask = $('.layui-layer-shade');
          mask.appendTo(layero.parent());
          if (state === '添加') {
            if (dataWarehouse.category.length <= 0) {
              $(layero).find('input[name=parentCateName]').val('OA新类目');
              $("#addForm input[name='pcateId']").val(0);
            } else {
              $(layero).find('input[name=parentCateName]').val(dataWarehouse.category[0].cateName);
              $("#addForm input[name='pcateId']").val(dataWarehouse.category[0].id);
            }
          } else {
            $(layero).find('input[name=cateName]').val(dataWarehouse.category[0].cateName);
            $(layero).find('input[name=parentCateName]').val(dataWarehouse.category[0].parentCateName);
            $(layero).find('input[name=sort]').val(dataWarehouse.category[0].sort);
            $("#addForm input[name='id']").val(dataWarehouse.category[0].id);
          }
        },
        end: function () {
          //关闭时清空表格内容
          $('#addForm')[0].reset();
          dataWarehouse.categoryState = '';
        },
        btn: ['确定', '取消'],
        yes: function (index, layero) {
          if (cateflag) {
            let sort=$(layero).find('input[name=sort]').val()
            let cateName = comRepEnglishQuote($(layero).find('input[name=cateName]').val())
            if(cateName.trim().length<=0){
              return layer.msg('请输入属性名')
            }else if (sort.trim().length<=0) {
              return layer.msg('请输入排序')
            }else {
              cateflag=false
              $('#submitAddResource').click();
            }
          }
        },
      });
    }
    //?新增/修改属性弹出框
    function openAttributeLayer(id) {
      loading.show()
      let attrcateflag=true
      let attribute = dataWarehouse.attributeState;
      layer.open({
        type: 1,
        title: attribute + '属性',
        area: ['1000px', '800px'],
        // shade: 0, //遮罩透明度
        btn: ['确定', '关闭'],
        content: $('#newaAttribute').html(),
        success: async function () {
          flag=true
          await form.render();
          tableRender([]);
          // InpNumber()
          $("#addAttribute input[name='id']").val(dataWarehouse.category[0].id);
          if (attribute === '修改') {
            let  { data: res }  = await requestData.queryAttributeValues(id);
            if (res.code!=='0000') {
              return layer.msg(res.msg)
            }
            res=res.data
            dataWarehouse.attribute = res.prodCateOaAttrValueList;
            $("#addAttribute input[name='cateOaId']").val(res.id);
            $("#addAttribute input[name='attrName']").val(res.attrName);
            $("#addAttribute input[name='sort']").val(res.sort);
            if (res.isMandatory == 0) {
              $("#addAttribute input[value='1']").prop('checked', 'true');
              $("#addAttribute input[value='0']").prop('checked', 'false');
            } else {
              $("#addAttribute input[value='0']").prop('checked', 'true');
              $("#addAttribute input[value='1']").prop('checked', 'false');
            }
            form.render();
            tableRender(dataWarehouse.attribute);
          } else {
            dataWarehouse.attribute = [];
          }
          $('#addRow_AttrRoleTable').click(function () {
            let count = $(this).prev().children('input').val();
            let attributeVlaue = $("#attributeForm input[name='editAttruibuteValue']").map(function () {
              return $(this).val();
            }).get();
            let editAttruibute = $("#attributeForm input[name='editAttruibute']").map(function () {
              return $(this).val();
            }).get();
            let editArr=[]
            attributeVlaue.forEach((value, index) => {
              let temporary = {};
              temporary.attrValue = value||'';
              temporary.sort = editAttruibute[index]||'';
              editArr.push(temporary)
            });
            let obj = {
                attrName: '',
                attrValue: '',
                cateOaAttrId: '',
                cateOaId: '',
                id: '',
                sort: '',
              },
              dataArr = [];
            for (let i = 0; i < count; i++) {
              dataArr.push(obj);
            }
            dataWarehouse.attribute = [...editArr, ...dataArr];
            tableRender(dataWarehouse.attribute);
            form.render();
            $(this).prev().children('input').val('');
          });
          loading.hide()
        },
        yes: async function (index, layero) {
          $('#attribute').click();
          let attributeVlaue = '';
          let editAttruibute = '';
          let editAttruibuteValueEnglish = '';
          dataWarehouse.resource_editBtn.prodCateOaAttrValueList = [];
          attributeVlaue = $("#attributeForm input[name='editAttruibuteValue']").map(function () {
            return $(this).val();
          }).get();
          editAttruibute = $("#attributeForm input[name='editAttruibute']").map(function () {
            return $(this).val();
          }).get();
          editAttruibuteValueEnglish = $("#attributeForm input[name='editAttruibuteValueEnglish']").map(function () {
            return $(this).val();
          }).get();
          if ($("#addAttribute input[name='attrName']").val().trim().length<=0) {
            return layer.msg('属性名不能为空')
          }else if ($("#addAttribute input[name='attrName']").val().trim().length>50) {
            return layer.msg('请控制属性名在50个字符内')
          }else if ($("#addAttribute input[name='sort']").val().trim().length<=0) {
            return layer.msg('排序不能为空')
          }else if (attributeVlaue.length<=0||editAttruibute.length<=0) {
            return layer.msg('属性值不能为空')
          }
          attributeVlaue.forEach((value, index) => {
            let temporary = {};
            temporary.attrValue = value||'';
            temporary.sort = editAttruibute[index]||'';
            temporary.enAttrValue = editAttruibuteValueEnglish[index]||'';
            dataWarehouse.resource_editBtn.prodCateOaAttrValueList.push(temporary);
          });
          dataWarehouse.resource_editBtn.prodCateOaAttrValueList=dataWarehouse.resource_editBtn.prodCateOaAttrValueList.filter((value)=>{
            return (value.attrValue!==''||value.sort!==''||value.enAttrValue!='')
          })
          if (dataWarehouse.resource_editBtn.prodCateOaAttrValueList.length<=0) {
             return layer.msg('属性值不能为空')
          }
          let attrvalueflag = true
          // let onlyEnglish = true
          dataWarehouse.resource_editBtn.prodCateOaAttrValueList.forEach((value)=>{
            if (value.attrValue===''||value.sort===''||value.enAttrValue==='') {
              attrvalueflag=false
            }
            //不允许录入中文
            // if (/[\u4E00-\u9FA5]/i.test(value.enAttrValue)) {
            //   onlyEnglish = false
            // }
          })
          if (!attrvalueflag) {
            return layer.msg('请填写完整的属性值、属性值（英文）和属性值排序')
          }
          // if (!onlyEnglish) {
          //   return layer.msg('属性值（英文）不允许录入中文！')
          // }
          if (attrcateflag) {
            attrcateflag=false
            let res
            if (attribute === '新增') {
              res=await requestData.addAttrbute(dataWarehouse.resource_editBtn)
            } else {
              res=await requestData.editAttruibute(dataWarehouse.resource_editBtn)
            }
            if (res.data.code=='0000') {
              layer.closeAll()
              layer.msg(dataWarehouse.attributeState + '成功');
              let { data: result } = await requestData.queryAttribute(dataWarehouse.dataValue);
              if (result.code!=='0000') {
                return layer.msg(result.msg)
              }
              attributeTable('',result.data)
            }else {
              attrcateflag=true
              return layer.confirm(res.data.msg)
            }
          }
          tableRender(dataWarehouse.attribute);
        },
      });
    }
    //? 属性值表格渲染
    function tableRender(arrData) {
      table1.render({
        elem: '#queryAttrRoleTable',
        cols: [
          [
            {
              title: '属性值',
              field: 'attrValue',
              width: '30%',
              templet: (arrData) => {
                return `<input type="text" class="layui-input" required   name="editAttruibuteValue" value="${arrData.attrValue || ''}">`;
              },
            },
            {
              title: '属性值（英文）',
              field: 'enAttrValue',
              width: '30%',
              templet: (arrData) => {
                return `<input type="text" class="layui-input" required   name="editAttruibuteValueEnglish" value="${arrData.enAttrValue || ''}">`;
              },
            },
            {
              title: '排序',
              field: 'sort',
              width: '20%',
              templet: (arrData) => {
                return `<input type="number" class="layui-input" required   name="editAttruibute" value="${arrData.sort }" min='0'>`;
             
              },
            },
            { title: '操作', width: '20%', toolbar: '#removeOperBar' },
          ],
        ],
        data: arrData,
        limit:arrData.length,
        done:function () {
          InpNumber()
        }
      });
    }
    //?添加修改类目发送请求
    function addcategory(url, state, data) {
      return axios({
        url: ctx + url,
        method: 'post',
        data,
      }).then(function ({ data }) {
        if (data.code == '0000') {
          layer.closeAll();
          layer.msg(`${state}类目成功`);
          createdXtree();
        } else {
          cateflag=true
          layer.confirm(data.msg);
        }
      }).catch((err)=>{
        layer.alert(err.meg)
      }) ;
    }
  });
  
(function ($, layui, window, document, undefined){
  layui.use(['admin','form','table','layer','laydate', 'laytpl', 'laydate', 'formSelects'],function(){
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laydate = layui.date,
        laytpl = layui.laytpl,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    form.render('select');
    UnifiedFixedFn('receivegoodstransformrule_card');
    //命名空间
    let receivegoodstransformruleName = {
      trigClick(){
        $('[lay-filter=receivegoodstransformrule_submit]').trigger('click');
      },
      renderTime(){
        laydate.render({
          elem: "#receivegoodstransformrule_times",
          type: 'datetime',
          range: true,
        });
      },
      dataHandle(data){
        if (data.times) {
          let timesArr = data.times.split(" - ");
          data.startTimeStr = timesArr[0];
          data.endTimeStr = timesArr[1];
        } else {
          data.startTimeStr = "";
          data.endTimeStr = "";
        }
        data.userIdList = data.userIdList == '' ? []: data.userIdList.split(',');
        delete data.times;
        return data;
      },
      renderCreator(){
        commonReturnPromise({
          url: '/lms/sysPermissionCommon/listAllUser'
        }).then(res => {
          commonRenderSelect("receivegoodstransformrule_creatorIdList", res, {
            name: "userName",
            code: "userId",
          }).then(() => {
            formSelects.render("receivegoodstransformrule_creatorIdList");
          });
        });
      },
      tableHandle(data){
        let _this = this;
        table.render({
            elem: '#receivegoodstransformrule_table',
            method: 'post',
            contentType: 'application/json',
            url: '/lms/receiveGoodsTransformRule/queryList',
            where: data,
            height: window.innerHeight - 250,
            page: false,
            id: "receivegoodstransformrule_tableId",
            limits: [100, 200, 300],
            limit: 1000,
            cols: [
              [
                {title: '规则名称', field: 'name'},
                {title: '判断条件', field: 'judgeCondition', templet: '#receivegoodstransformrule_judgeCondition'},
                {title: '执行规则', field: 'executeRule', templet: '#receivegoodstransformrule_executeRule'},
                {title: '状态', field: 'status', templet: '#receivegoodstransformrule_status'},
                {title: '备注', field: 'remark'},
                {
                  title: '操作', 
                  field: 'modifier',
                  width:250, 
                  templet: `
                  <div>
                    <div>创建: {{d.creator || ''}}  {{Format(d.createTime, 'yyyy-MM-dd hh:mm:ss')}}</div>
                    <div>修改: {{d.modifier || ''}} {{Format(d.modifyTime, 'yyyy-MM-dd hh:mm:ss')}}</div>
                  </div>
                  `
                },
                {title: '操作',toolbar: '#receivegoodstransformrule_tableIdBar', width: 80}
              ]
            ],
            done: function(res){
              _this.watchBar();
              for(let i=0;i<res.data.length;i++){
                _this.watchSwitch(res.data[i]);
            }; 
            }
        });
      },
      watchBar(){
        let _this = this;
        //监听操作
        table.on('tool(receivegoodstransformrule_tableFilter)', function(obj) {
          let data = obj.data; //获得当前行数据
          let layEvent = obj.event; //获得 lay-event 对应的值
          if(layEvent == 'delete'){
            layer.confirm('确认删除此条识别规则?', {icon: 3, title:'提示'}, function(index){
              commonReturnPromise({
                url: `/lms/receiveGoodsTransformRule/deleteRule?id=${data.id}`,
              }).then(res => {
                layer.msg(res || '操作成功', {icon: 1});
                layer.close(index);
                receivegoodstransformruleName.trigClick();
              });
            });
          }else if(layEvent == 'edit'){
            _this.ruleLayerHandle(data, 0);
          }
        });
      },
      watchSwitch(info){
        let id = info.id;
        let _this = this;
        let filterStatus = 'receivegoodstransformrule_tableStatus'+id;
        form.on(`switch(${filterStatus})`, function(data){
            let status = data.elem.checked; //开关是否开启，true或者false
            _this.switchStatusAjax(id, status)
            .then(function(){
                layer.msg(status? '已成功开启识别规则!': '已成功关闭识别规则!',{icon:1});
                receivegoodstransformruleName.trigClick();
            })
            .catch(function(err){
                layer.msg(err, {icon:2})
            });
        }); 
      },
      switchStatusAjax(id,status){
        return commonReturnPromise({
          url: '/lms/receiveGoodsTransformRule/updateRuleStatus',
          params: {
            id: id,
            status:status
          }
        });
      },
      ruleLayerHandle(data, hType){
        console.log(hType);
        layer.open({
          type: 1,
          title: hType==1? '新增识别规则': '编辑识别规则',
          area: ['70%', '50%'],
          btn: ['保存', '关闭'],
          content: $('#receivegoodstransformrule_ruleLayer').html(),
          id: 'receivegoodstransformrule_ruleLayerId',
          success: function(layero){
            let getTpl = receivegoodstransformrule_ruleLayerFormTpl.innerHTML;
            let getUl = document.getElementById('receivegoodstransformrule_ruleLayerForm');
            laytpl(getTpl).render(data, function(html){ //渲染
                getUl.innerHTML = html;
                //判断哪个radio选中
                if(data.executeRuleDto && data.executeRuleDto.startReserveLength){
                  layero.find('input[name=ruleItems][value=2]').prop('checked', true);
                }else if(data.executeRuleDto && data.executeRuleDto.endReserveLength){
                  layero.find('input[name=ruleItems][value=3]').prop('checked', true);
                }else if(data.executeRuleDto && data.executeRuleDto.submitLengthDto && data.executeRuleDto.submitLengthDto.startSubmitLength){
                  layero.find('input[name=ruleItems][value=1]').prop('checked', true);
                }
                form.render('radio');

                //验证正整数
                layero.on('blur', 'input[type=number]',(event) => {
                  let val = event.target.value;
                  if(val == ''){

                  }else if(val <= 0){
                    layer.msg('仅允许输入正整数,请重新输入', {icon:7});
                    event.target.value = '';
                  }
                });
            });
          },
          yes: function(index, layero){
            let layerFormData = serializeObject(layero.find('form'));
            //规则名称判空
            if(!layerFormData.ruleName.trim()){
              return layer.msg('规则名称不能为空', {icon: 7});
            }
            //判断条件判空
            if(!layerFormData.startStr.trim() && 
               !layerFormData.containStr.trim() && 
               !layerFormData.endStr.trim() && 
               !layerFormData.strLength.trim()
              ){
              return layer.msg('请选择判断条件', {icon:7});
            }
            //执行规则判空
            if(!layero.find('input[name=ruleItems]').is(':checked')){
              return layer.msg('请选择执行规则', {icon:7});
            }
            if(layero.find('input[name=ruleItems]:checked').val() == 1 && 
                (
                  !layero.find('[name=startSubmitLength]').val().trim() ||
                  !layero.find('[name=endSubmitLength]').val().trim()
                )
              ){
                console.log('条件1满足');
                return layer.msg('请输入执行规则条件', {icon:7});
              }
            if(layero.find('input[name=ruleItems]:checked').val() == 2 && 
              !layero.find('[name=startReserveLength]').val().trim()
            ){
              return layer.msg('请输入执行规则条件', {icon:7});
            }
            if(layero.find('input[name=ruleItems]:checked').val() == 3 && 
              !layero.find('[name=endReserveLength]').val().trim()
            ){
              return layer.msg('请输入执行规则条件', {icon:7});
            }

            //组装数据
            let sumbitObj = {};
            if(layerFormData.id){
              sumbitObj.id = Number(layerFormData.id);
            }
            sumbitObj.name = layerFormData.ruleName;
            sumbitObj.status = type=1 ? 1: data.status;
            sumbitObj.remark = layerFormData.remark;
            sumbitObj.judgeConditionDto = {
              startStr: layerFormData.startStr.trim() || '',
              containStr: layerFormData.containStr.trim() || '',
              endStr: layerFormData.endStr.trim() || '',
              strLength:  layerFormData.strLength.trim() || ''
            }
            sumbitObj.executeRuleDto = {
              startReserveLength: layero.find('input[name=ruleItems]:checked').val() == 2 ?layerFormData.startReserveLength.trim() : '',
              endReserveLength: layero.find('input[name=ruleItems]:checked').val() == 3 ? layerFormData.endReserveLength.trim() : '',
              submitLengthDto: {
                startSubmitLength: layero.find('input[name=ruleItems]:checked').val() == 1 ? layerFormData.startSubmitLength.trim(): '',
                endSubmitLength: layero.find('input[name=ruleItems]:checked').val() == 1 ?layerFormData.endSubmitLength.trim() : ''
              }
            }
            
            let url = hType == 1 ? '/lms/receiveGoodsTransformRule/addNewRule': '/lms/receiveGoodsTransformRule/updateRule'
            commonReturnPromise({
              url: url,
              type: 'post',
              contentType: 'application/json',
              params: JSON.stringify(sumbitObj)
            }).then(res => {
              layer.msg(res || '操作成功', {icon: 1});
              layer.close(index);
              receivegoodstransformruleName.trigClick();
            });
          }
        });
      },
      addHandle(){
        let _this = this;
        $('#receivegoodstransformrule_addLayerBtn').on('click', function(){
          let data = {
            id: '',
            name: '',
            remark: '',
            judgeConditionDto: {
              startStr: '',
              containStr: '',
              endStr: '',
              strLength: ''
            },
            executeRuleDto: {
              startReserveLength: '',
              endReserveLength: '',
              submitLengthDto: {
                startSubmitLength: '',
                endSubmitLength: ''
              }
            }
          }
          _this.ruleLayerHandle(data, 1);
        });
      }
    };
    //渲染时间
    receivegoodstransformruleName.renderTime();
    //初始化创建人
    receivegoodstransformruleName.renderCreator();
    //新增识别规则
    receivegoodstransformruleName.addHandle();
    //监听表单请求
    form.on('submit(receivegoodstransformrule_submit)', function(obj){
      let data = receivegoodstransformruleName.dataHandle(obj.field);
     receivegoodstransformruleName.tableHandle(data);
    });
  });

})(jQuery, layui, window, document);
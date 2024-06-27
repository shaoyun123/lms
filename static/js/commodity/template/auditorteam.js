/**
 * time: 2018/01/02
 */
var searchMember, auditorteam_popToedit
layui.use(["admin", "form", "table", "layer", "laytpl", "laydate"], function () {
    var admin = layui.admin,
        form = layui.form,
        table = layui.table,
        layer = layui.layer,
        laytpl = layui.laytpl,
        laydate = layui.laydate,
        $ = layui.$;
    form.render('select');
    form.render('checkbox');
    // 初始化审核分组
    function initAuditorGroup() {
        oneAjax.post({
            url: '/sysuser/listAuditorTeam',
            success: function (res) {
                if (res.code === '0000') {
                    let groupUl = $('#at_leftSearchDiv')
                    let groupList = res.data
                    let html = ''
                    for (let i = 0; i < groupList.length; ++i) {
                        html  += `<li class="layui-nav-item"  onclick="searchMember('`+ groupList[i].teamName +`',this)">
                        <a>
                        <span>`+ groupList[i].teamName +`</span>
                        <div class="fr">
                        <i class="layui-icon layui-icon-edit pointHand" onclick="auditorteam_popToedit(`+ groupList[i].id +`, '`+ groupList[i].teamName +`')" style="font-size: 15px; color: cornflowerblue;" title="修改">&#xe642;</i>
                        </div></a></li>`
                    }
                    groupUl.html(html)
                    groupUl.find('li:eq(0)').click()
                }
            }
        })
    }
    initAuditorGroup()

    listAllProdDev();

    auditorteam_popToedit = function(id,originName) {
        let popIndex = layer.open({
            type: 1,
            title: '修改审核分组',
            area: ['400px', '200px'],
            btn:['保存','关闭'],
            id: 'auditorteam_addGroupLayerId', // 保证唯一性
            content: $('#auditorteam_addGroupLayer').html(),
            success: function(layero, index){
                $('#auditorteam_addGroupForm').find('[name]').val(originName)
            },
            yes: function () {
                let Adata = {
                    id: id,
                    teamName: $('#auditorteam_addGroupForm').find('[name]').val()
                }
                oneAjax.post({
                    url: '/sysuser/editOneAuditorGroup',
                    data: JSON.stringify(Adata),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('修改成功')
                            layer.close(popIndex)
                            initAuditorGroup()
                        }
                    }
                })
            }
        })
    }

    /*归属人start*/
    function listAllProdDev() {
        $("#at_membersList").html("");
        $.ajax({
            type: "post",
            url: ctx + "/sys/prodOwnerList.html",
            dataType: "json",
            success: function (returnData) {
                if (returnData.code == "0000") {
                    $(returnData.data).each(function () {
                        if(this.status==true){
                          //$("#at_membersList").append("<option value='" + this.id + "'>" + this.userName + "</option>");
                          $("#at_userCard").append('<input type="checkbox" value="'+this.id+'" lay-skin="primary" onclick="setMember(this)" lay-filter="at_checkbox" title="'+this.userName+'">');

                        }
                    });
                    form.render('checkbox');
                    // showMembers(checkedTeamName);
                } else {
                    layer.msg(returnData.msg);
                }
            }
        })
    }

    form.on('checkbox(at_checkbox)', function(data){
        console.log(data)
        $.ajax({
            type: "POST",
            url: ctx + "/prodTpl/changeTeamMember.html",  //请求接口地址
            dataType: "json",
            data: {"memberIds":data.value,"teamName":checkedTeamName,"add":data.elem.checked},  //需要post的数据
            success: function (res) {  //后台程序返回数据
                if (res.code === '0000') {
                    layer.closeAll();
                    $('#at_search').trigger("click");
                    layer.msg('操作成功');
                } else {
                    data.elem.checked = false
                    form.render('checkbox','at_userCard')
                    layer.msg(res.msg);
                }
            }
        });
    });

    $('#auditorteam_addGroupBtn').click(function () {
        let popIndex = layer.open({
            type: 1,
            title: '新增审核分组',
            area: ['400px', '200px'],
            btn:['保存','关闭'],
            id: 'auditorteam_addGroupLayerId', // 保证唯一性
            content: $('#auditorteam_addGroupLayer').html(),
            success: function(layero, index){

            },
            yes: function () {
                oneAjax.post({
                    url: '/sysuser/insertOneAuditorGroup',
                    data: JSON.stringify({teamName: $('#auditorteam_addGroupForm').find('[name]').val()}),
                    success: function (res) {
                        if (res.code === '0000') {
                            layer.msg('新增成功')
                            layer.close(popIndex)
                            initAuditorGroup()
                        }
                    }
                })
            }
        })
    })

    searchMember = function (name,t) {
        if (typeof (name) == undefined) {
            return;
        }
        divCheckedStyle(t);
        //postSearchTag(name);
        showMembers(name);
        checkedTeamName = name;
    }

    function showMembers(teamName){
        $('#at_userCard').children(':checkbox').prop('checked',false);
        $.ajax({
            type: "POST",
            url: ctx + "/sysuser/listByAuditorTeam.html",
            dataType: "json",
            data: {"team":teamName},
            success: function (res) {  //后台程序返回数据
                console.log(res);
                if (res.code == '0000') {
                    var dataList = res.data;
                    for(var i in dataList){
                        $("#at_userCard input[value='"+dataList[i].id+"']").prop('checked',true);
                    }
                    form.render('checkbox');
                } else {
                    layer.msg(res.msg);
                }
            }
        });
    }

    function divCheckedStyle(v) {
        $("#at_leftSearchDiv .layui-this").removeClass("layui-this");
        $(v).closest('li').addClass('layui-this');
    }
});


/*侧边栏的点击事件*/
var checkedTeamName = '审核1组';

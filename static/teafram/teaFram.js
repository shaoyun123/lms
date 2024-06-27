console.log('teafram');
/**
喝茶框架
定义:
其实epean系统很多功能是相似的有些功能对于
前后端严格执行规范 ,代码量出错的几率会降到最低
把一些规范定死,就可以多出很多喝茶时间


使用者需要了解使用规范并严格执行,否则千万别用,谢谢------赵敏

原因:前后端代码各写各的,乱得要死,bug还多,不想替别人找问题,也不想别人给自己制造麻烦.除了公共代码,由自己维护一套支持速写的规范框架


例如写个ajax请求还得各种考虑后端接口,隔段时间调用,就会发现请求到不了后台,浪费时间
例如公共方法由于扩展性不够,最后不得不自己实现,但下次相似场景用,之前的代码不在公共方法池子里,也不能直接拿来用
例如某些人写的公共代码明显有私用场景代码,却被整合到公共代码里,别人复制粘贴不小心就会引起不必要的麻烦
例如像下拉框初始化,有些代码非要传id才能使用,但一般写form表单,元素只要name就够了,那传入jquery对象更加准确易用(建议)
......
爱惜生命,从tea
 **/

/**
规则:
1.jsp必须显式声明teaFram.js的引用 !

2.后端接口 一律用@RequestBody 接收对象 (建议封装接收体)  ,禁止使用其他格式(上传下载文件除外) !

3.所有接口的定义都需要带版本号格式 _ver* !

4.不得修改任何已经被引用的旧接口,只可以新增版本!

5.实在要改,要改所有引用!

6.操作dom元素,方法能穿jquery对象最好(仅建议)!
 **/

/**7.使用接口必须详细阅读_ver1 接口的接口说明**/

/**8,开发新接口,有重大变化必须在_ver1 接口说明中记录**/


/**

当前计划实现的接口
索引
1. ajax封装,单行命令完成请求和结果处理
 tea_Ajax_ver1

2.ajax同步封装

4.下拉框初始化
 tea_appendSelect_ver1
 tea_appendSelectByFun_ver1
5.渲染表
 tea_renderTable_ver1
6.分页
 tea_renderPage_ver1
**/

/**
 * 最简实用方式
 * tea_Ajax_ver1("url",JSON.stringify({}),function(returnData){})
 *
 * 失败处理默认
 *
 * @param url 路径
 * @param data 参数 需要以JSON.stringify()封装
 * @param succFunc 成功后处理
 * @param async 异步
 * @param contentType 不传默认application/json
 * @param ignoreLoading 不传默认遮蔽,传true 取消遮蔽
 */
function tea_Ajax_ver1(url, data, succFunc,async ,contentType, ignoreLoading) { //初始化ajax请求
    if (!ignoreLoading) {
        loading.show();
    }
    $.ajax({
        type: "post",
        url: ctx + url,
        dataType: 'json',
        async: async||false,
        data: data,
        contentType: contentType || 'application/json',
        success: function (returnData) {
            if (!ignoreLoading) {
                loading.hide();
            }
            if (returnData.code == "0000") {
                succFunc(returnData)
            } else {
                layer.msg(returnData.msg, {icon: 2});
            }
        },
        error: function (returnData) {
            if (laodingHide) {
                loading.hide();
            }
            if (XMLHttpRequest.status == 200) {
                layer.msg("请重新登录", {icon: 7});
            } else {
                layer.msg("服务器错误");
            }
        }
    })
}






/**
 *  填充下拉框
 * @param dom dom元素
 * @param data 列表
 * @param value vaule字段
 * @param name 名称字段
 * @param selectId 名称字段
 */
function tea_appendSelect_ver1( dom, data, id, name,selectId,defaultName) {
    $(dom).empty();
    var option = '<option value="">'+ (defaultName || '请选择') +'</option>'
    for (var i in data) {
        if(selectId&& data[i][id]==selectId){
            option += '<option selected value="' + data[i][id] + '">' + data[i][name] + '</option>'
        }else {
            option += '<option value="' + data[i][id] + '">' + data[i][name] + '</option>'
        }
    }
    $(dom).append(option);
}
//填充下拉框指定组合方式
function tea_appendSelectByFun_ver1( dom, data, idFun,nameFun) {
    $(dom).empty();
    var option = '<option value="">请选择</option>'
    for (var i in data) {
        option += '<option value="' + idFun(data[i]) + '">' + nameFun(data[i]) + '</option>'
    }
    $(dom).append(option);
}

/**
 * 渲染表格 永远渲染全部参数,分页一定是提交做好的
 * @param data
 * @param tablename 表id
 * @param tableCols  表内容定义 [10,50,100]
 * @param layuiTable layui表对象
 * @param func
 */
function tea_renderTable_ver1(data, tablename,tableCols, func,height) {//
    var tableIns = layui.table.render({
        elem: '#' + tablename,
        data: data,
        cols: tableCols,
        page: false,
        limit: Number.MAX_VALUE,
        height: height || '',
        id: tablename,
        done: function (data) {
            if (func) {
                func(data);
            }
        }
    })
    return tableIns;
}


/**
 * 分页
 * @param formName 表id
 * @param pageName 页id
 * @param count 总数
 * @param current 请求页
 * @param limit 一页多少
 * @param limitArrInfo [10, 300, 500]
 * @param searchFun 查询请求
 * @param reqExcFun 请求参数的二次梳理
 * @param laypage
 */
function tea_renderPage_ver1(formName,pageName,count, current, limit, limitArrInfo,searchFun,reqExcFun) {//分页
    layui.laypage.render({
        elem: pageName,
        curr: current,
        limit: limit,
        limits: limitArrInfo||[10, 50, 100],
        layout: ['prev', 'page', 'next', 'count','limit'],
        count: count,
        jump: function (obj, first) {
            $('#'+formName+' input[name="limit"]').val(obj.limit);//保障下次的分页请求中带有的值正确
            $('#'+formName+' input[name="page"]').val(obj.curr);//保障下次的分页请求中带有的值正确
            //首次不执行
            if (!first) {
                var req = tea_getFormReqObj_ver1(formName);
                req.page = obj.curr;
                req.limit = obj.limit;
                if(reqExcFun){
                    reqExcFun(req);
                }
                searchFun(req);
            }
        }
    });
}

/**
 * 获取表单参数
 * @param formIdName
 */
function tea_getFormReqObj_ver1(formIdName) {//获取表单参数
    var d = {};
    var t = $('#' + formIdName + ' [name]').serializeArray();
    $.each(t, function () {
        d[this.name] = this.value;
    });
    return d;
}
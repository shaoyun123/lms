layui.use(
	['form', 'table', 'layer', 'element', 'laypage', 'laydate'],
	function () {
		var form = layui.form,
			table = layui.table,
			laypage = layui.laypage,
			element = layui.element,
			laydate = layui.laydate,
			layer = layui.layer

		var AmazonBrand = {
			init: function () {
				var _this = this
				_this.submitForm()
				_this.listenOnTab()
				_this.newBrand()
				_this.verifyCustom()
				_this.initDimSearch()
				//渲染时间
				laydate.render({ elem: '#amazonBrandForm_time_input', range: true })
				form.render()
			},
			submitForm: function () {
				var _this = this
				form.on('submit(AmazonBrandSearch)', function (obj) {
					var data = obj.field
					if (data.time) {
						data.startTime = Date.parse(
							data.time.split(' - ')[0].replace('-', '/') + ' 00:00:00'
						)
						data.endTime = Date.parse(
							data.time.split(' - ')[1].replace('-', '/') + ' 23:59:59'
						)
					}
					getAmazonBrand(data, function (returnData) {
						for (var i of returnData.data) {
							i.useType += ''
						}
						_this.AmazonBrandTable(returnData.data)
						_this.AmazonBrandPage(data, returnData.count)
						$('#AmazonBrandTab')
							.find('.layui-this')
							.find('span')
							.text(returnData.count)
					})
				})
			},
			listenOnTab: function () {
				element.on('tab(AmazonBrandTab)', function (data) {
					var useType = data.elem.context.dataset.index
					$('#AmazonBrandForm input[name="useType"]').val(useType)
					$('#AmazonBrandSearch').click()
				})
			},
			AmazonBrandTable: function (data) {
				var _this = this
				table.render({
					elem: '#AmazonBrand_table',
					data: data,
					cols: [
						[
							{ checkbox: true, width: 25 },
							{
								title: '品牌名',
								width: 200,
								field: 'brand',
								templet: '#AmazonBrand_brandTpl',
							},
							{ title: '投诉次数', width: 100, field: 'voteTotalTimes' },
							{ title: '产品数量', width: 100, field: 'parentAsinNum' },
							{ title: '已录入站点', width: 100, field: 'salesSiteStr' },
							{ title: '创建人', width: 100, field: 'creator' },
							{
								title: '创建时间',
								width: 200,
								field: 'createTime',
								templet:
									"<div>{{Format(d.createTime,'yyyy-MM-dd hh:mm:ss')}}</div>",
							},
							{ title: '备注', field: 'remark' },
							{ title: '操作', toolbar: '#AmazonBrand_tool', width: 100 },
						],
					],
					page: false,
					limit: Number.MAX_VALUE,
					id: 'AmazonBrand_table',
					created: function (res) {},
					done: function (res) {
						_this.listenOntool()
					},
				})
			},
			AmazonBrandPage: function (data, count) {
				laypage.render({
					elem: 'amazonBrandPage',
					curr: data.page,
					limit: data.limit,
					limits: [100, 200, 500],
					layout: ['prev', 'page', 'next', 'count', 'limit'],
					count: count,
					jump: function (obj, first) {
						$('#AmazonBrandForm input[name="limit"]').val(obj.limit) //保障下次的分页请求中带有的值正确
						$('#AmazonBrandForm input[name="page"]').val(obj.curr) //保障下次的分页请求中带有的值正确
						//首次不执行
						if (!first) {
							data.page = obj.curr
							data.limit = obj.limit
							$('#AmazonBrandSearch').click()
						}
					},
				})
			},
			listenOntool: function () {
				var _this = this
				table.on('tool(AmazonBrand_table)', function (obj) {
					var data = obj.data
					var event = obj.event
					if (event == 'amazonbrand_modify') {
						_this.modifyBrandPop(data)
					} else if ((event = 'amazonbrand_del')) {
						_this.deleteBrand(data.id)
					}
				})
			},
			newBrand: function () {
				var _this = this
				$('#LAY-AmazonBrand')
					.find('#AmazonBrandNew')
					.click(function () {
						_this.modifyBrandPop()
					})
				$('#LAY-AmazonBrand')
					.find('#AmazonBrandUpdate')
					.click(function () {
						_this.updateBrandPop()
					})
			},

			updateBrandPop: function () {
				var _this = this
                let checkData = layui.table.checkStatus('AmazonBrand_table').data
                if (checkData.length === 0) {
                    return layer.msg('请至少选择一条数据')
                }
				layer.open({
					type: 1,
					title: '批量修改',
					btn: ['提交', '关闭'],
					area: ['30%', '40%'],
					content: $('#AmazonBrand_update').html(),
					success: function (layero, index) {
						form.render()
					},
					yes: function (index, layero) {
						let updateList = []
						checkData.forEach((item) => {
							let obj = {
								useType: '',
								brand: '',
								remark: '',
								id: '',
							}
							obj.useType = $(
								'#amazonBrandUpdateForm input[name="useType"]:checked'
							).val()
							obj.brand = item.brand
							obj.remark = $('#amazonBrandUpdateForm .updateRemark').val()
							obj.id = item.id
							updateList.push(obj)
						})
						updateAmazonBrand(updateList, function (returnData) {
								if (returnData.code == '0000') {
										layer.msg(returnData.msg, { icon: 1 })
								} else {
										layer.msg(returnData.msg, { icon: 2 })
								}
								layer.close(index)
								$('#AmazonBrandSearch').click()
						})
						// $('#amazonBrandUpdateSubmit').click()
					},
				})
			},
			modifyBrandPop: function (data) {
				var _this = this
				var isEdit = data ? true : false
				var title = isEdit ? '修改品牌' : '新增品牌'
				layer.open({
					type: 1,
					title: title,
					btn: ['提交', '关闭'],
					area: ['30%', '40%'],
					content: $('#AmazonBrand_modify').html(),
					success: function (layero, index) {
						if (isEdit) {
							form.val('amazonBrandeditForm', data)
						}
						form.render()
					},
					yes: function (index, layero) {
						form.on('submit(amazonBrandeditSubmit)', function (data) {
							saveAmazonBrand(data.field, function (returnData) {
								if (returnData.code == '0000') {
									layer.msg(title + '成功', { icon: 1 })
								} else {
									layer.msg(returnData.msg, { icon: 2 })
								}
								layer.close(index)
								$('#AmazonBrandSearch').click()
							})
						})
						$('#amazonBrandeditSubmit').click()
					},
				})
			},
			deleteBrand: function (id) {
				layer.confirm('确定删除这条品牌信息?', function (index) {
					delAmazonBrand(id, function (returnData) {
						layer.msg(returnData.msg || '删除成功')
						layer.close(index)
						$('#AmazonBrandSearch').click()
					})
				})
			},
			verifyCustom: function () {
				form.verify({
					otherReq: function (value, item) {
						var $ = layui.$
						var verifyName = $(item).attr('name'),
							verifyType = $(item).attr('type'),
							formElem = $(item).parents('.layui-form'), //获取当前所在的form元素，如果存在的话
							verifyElem = formElem.find('input[name=' + verifyName + ']'), //获取需要校验的元素
							isTrue = verifyElem.is(':checked'), //是否命中校验
							focusElem = verifyElem.next().find('i.layui-icon') //焦点元素
						if (!isTrue || !value) {
							//定位焦点
							focusElem.css(
								verifyType == 'radio'
									? { color: '#FF5722' }
									: { 'border-color': '#FF5722' }
							)
							//对非输入框设置焦点
							focusElem
								.first()
								.attr('tabIndex', '1')
								.css('outline', '0')
								.blur(function () {
									focusElem.css(
										verifyType == 'radio'
											? { color: '' }
											: { 'border-color': '' }
									)
								})
								.focus()
							return '必填项不能为空'
						}
					},
				})
			},
			initDimSearch: function () {
				var dim_creatorId = new DimSearch(
					'#AmazonBrandForm_creatorId',
					'creatorId',
					{
						url: '/skuLocationTransfer/getConsigneeUserList.html',
						type: 'get',
						query: 'search',
						label: 'userName',
						isIncludeData: true,
						name: '.AmazonBrandForm_dimResultDiv',
					}
				)
				dim_creatorId.init()
			},
		}

		AmazonBrand.init()
		//页面请求
		// 获取品牌列表数据
		function getAmazonBrand(data, func) {
			initAjax(
				'/amazonFsBrand/queryPage.html',
				'post',
				JSON.stringify(data),
				function (returnData) {
					if (func) {
						func(returnData)
					}
				}
			)
		}
		//保存修改数据
		function saveAmazonBrand(data, func) {
			initAjax(
				'/amazonFsBrand/saveOrEdit.html',
				'post',
				JSON.stringify(data),
				function (returnData) {
					if (func) {
						func(returnData)
					}
				}
			)
		}
		//批量修改数据
		function updateAmazonBrand(data, func) {
			initAjax(
				'/amazonFsBrand/batchSaveOrEdit',
				'post',
				JSON.stringify(data),
				function (returnData) {
					if (func) {
						func(returnData)
					}
				}
			)
		}
		//删除品牌数据
		function delAmazonBrand(id, func) {
			initAjax(
				'/amazonFsBrand/delete.html',
				'post',
				JSON.stringify({ id: id }),
				function (returnData) {
					if (func) {
						func(returnData)
					}
				}
			)
		}
		// 页面请求

		function initAjax(url, method, data, func, contentType) {
			//初始化ajax请求
			loading.show()
			$.ajax({
				type: method,
				url: ctx + url,
				dataType: 'json',
				async: true,
				data: data,
				contentType: contentType || 'application/json',
				success: function (returnData) {
					loading.hide()
					if (returnData.code == '0000') {
						func(returnData)
					} else {
						layer.msg(returnData.msg, { icon: 2 })
					}
				},
				error: function (returnData) {
					layui.admin.load.hide()
					if (XMLHttpRequest.status == 200) {
						layer.msg('请重新登录', { icon: 7 })
					} else {
						layer.msg('服务器错误')
					}
				},
			})
		}
	}
)

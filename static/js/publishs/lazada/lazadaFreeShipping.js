layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function() {
	var form = layui.form,
		table = layui.table,
		layer = layui.layer,
		formSelects = layui.formSelects,
		laytpl = layui.laytpl,
		laydate = layui.laydate

	form.render()
	formSelects.render()
	//活动结束时间
	laydate.render({
		elem: '#lazadaFreeShippingEndTime',
		range: true,
		type: 'datetime'
	})

	//渲染部门销售员店铺三级联动
	render_hp_orgs_users('#lazadaFreeShippingSearchForm')

	//lazada站点初始化渲染
	getDatalazadaFreeShippingGetAllSite()
		.then(function(result) {
			commonRenderSelect('lazadaFreeShippingSiteIdList', result, {
				name: 'name',
				code: 'code'
			}).then(() => formSelects.render())
		})
		.catch((err) => layer.msg(err, {
			icon: 2
		}))

	// 清空查询条件
	$('#lazadaFreeShippingReset').click(() => {
		$('#lazadaFreeShippingSearchForm')[0].reset()
	})

	// 查询
	$('#lazadaFreeShippingSearch').click(() => {
		lazadaFreeShippingTableRender()
	})

	function lazadaFreeShippingTableRender() {
		// 各站点货币符号：马来是RM，印度尼西亚是Rp，新加坡是$，菲律宾是₱，泰国是฿，越南是₫
		let searchData = serializeObject($('#lazadaFreeShippingSearchForm')),
			currencySymbol = {
				"MYR": "RM",
				"IDR": "Rp",
				"SGD": "$",
				"PHP": "₱",
				"THB": "฿",
				"VND": "₫"
			}

		if (searchData.lazadaFreeShippingEndTime) {
			searchData.startTime = searchData.lazadaFreeShippingEndTime.split(' - ')[0]
			searchData.endTime = searchData.lazadaFreeShippingEndTime.split(' - ')[1]
		}

		searchData.roleNames = ["lazada专员"];
		searchData.platCode = "lazada";

		searchData.storeAcctIds == '' ? searchData.storeAcctIds = [] : searchData.storeAcctIds = searchData
			.storeAcctIds.split(',')
		searchData.salesPersonIds == '' ? searchData.salesPersonIds = [] : searchData.salesPersonIds =
			searchData.salesPersonIds.split(',')

		table.render({
			elem: '#lazadaFreeShippingTable',
			method: 'POST',
			url: ctx + '/lazadaShippingActivity/listGetByPage',
			contentType: 'application/json',
			where: searchData,
			cols: [
				[
					//表头
					{
						type: 'checkbox',
						width: 25,
						style: 'vertical-align: top;'
					},
					{
						title: '店铺',
						field: 'id',
						templet: function(d) {
							return `
                    <div>${d.storeAcct}</div><div>${d.salesPerson}</div>
                `
						}
					},
					{
						title: '优惠券名称',
						field: '',
						templet: function(d) {
							return `<div>${d.promotionName}</div><div>${d.activityId}</div>`
						}
					},
					{
						title: '活动时间',
						templet: function(d) {
							if (d.periodType == 'LONG_TERM') // 长期有效
								return `长期有效`
							else
								return `
                                    <span>从：${Format(d.periodStartTime || '', 'yyyy-MM-dd hh:mm:ss')}</span><br>
                                    <span>到：${Format(d.periodEndTime || '', 'yyyy-MM-dd hh:mm:ss')}</span>
                                `
						}
					},
					{
						title: '适用范围',
						field: '',
						templet: '<div>{{d.apply == "ENTIRE_SHOP"?"全店商品":"部分商品"}}</div>'
					},
					{
						title: '适用地区',
						field: '',
						templet: '<div>{{d.regionType == "SPECIAL_REGIONS"?d.regionValue:"全部地区"}}</div>'
					},
					{
						title: '预算使用情况',
						field: '',
						templet: function(d) {
							return `<div>${d.budgetType == "UNLIMITED_BUDGET"?"无预算上限":currencySymbol[d.currency] + d.usedBudgetValue + "/" + d.budgetValue}</div>`
						}
					},
					{
						title: '邮费补贴情况',
						field: '',
						templet: function(d) {
							if (d.dealCriteria == 'ITEM_QUANTITY_FROM_X') // 长期有效
								return `
                    <div>邮费补贴: ${d.tiersList[0]?(d.tiersList[0].tiresResult=="FULL SUBSIDY"?"全包邮":currencySymbol[d.currency] + d.tiersList[0].tiresResult):''}</div><div>当商品数量≥:${d.tiersList[0]?d.tiersList[0].tiersFilter:''}</div>
                `
							else if(d.dealCriteria == 'MONEY_VALUE_FROM_X')
                                return `
                    <div>邮费补贴: ${d.tiersList[0]?(d.tiersList[0].tiresResult=="FULL SUBSIDY"?"全包邮":currencySymbol[d.currency] + d.tiersList[0].tiresResult):''}</div><div>当订单金额≥:${currencySymbol[d.currency]}${d.tiersList[0]?d.tiersList[0].tiersFilter:''}</div>
                `
							else
                                return `
                    <div>邮费补贴: ${d.tiersList[0]?(d.tiersList[0].tiresResult=="FULL SUBSIDY"?"全包邮":currencySymbol[d.currency] + d.tiersList[0].tiresResult):''}</div>
                `
						}
					},
					{
						title: '活动状态',
						field: '',
						templet: function(d) {
							return `
                    <div>${d.activityStatus == 'NOT_START' ? '未开始' : ''}</div>
                    <div>${d.activityStatus == 'ONGOING' ? '进行中' : ''}</div>
                    <div>${d.activityStatus == 'SUSPEND' ? '暂停中' : ''}</div>
                    <div>${d.activityStatus == 'FINISH' ? '已过期' : ''}</div>
                `
						}
					},
					{
						title: '操作',
						width: 80,
						align: 'center',
						style: 'vertical-align: top;',
						toolbar: '#lazadaFreeShippingOperateTpl'
					}
				]
			],
			page: true,
			id: 'lazadaFreeShippingTable',
			limits: [50, 100, 300, 500, 700],
			limit: 50
		})
	}

	table.on('tool(lazadaFreeShippingTable)', function(obj) {
		let data = obj.data

		if (obj.event == 'edit') {
			// 编辑
			lazadaFreeShippingCreatOrEdit(1, data)
		} else if (obj.event == 'on') {
			// 开启
			lazadaFreeShippingOnOrOffFunc({
				"shippingActivityList": [{
					"id": data.id,
					"storeAcctId": data.storeAcctId,
					"activityId": data.activityId,
					"periodStartTime": data.periodStartTime,
					"activityStatus": data.activityStatus,
					"periodType": data.periodType
				}],
				"type": "BATCH_START_ACTIVITY"
			})
		} else if (obj.event == 'off') {
			// 暂停
			lazadaFreeShippingOnOrOffFunc({
				"shippingActivityList": [{
					"id": data.id,
					"storeAcctId": data.storeAcctId,
					"activityId": data.activityId,
					"periodStartTime": data.periodStartTime,
					"activityStatus": data.activityStatus,
					"periodType": data.periodType
				}],
				"type": "BATCH_CLOSE_ACTIVITY"
			})
		}
	})

	// 创建包邮
	$('#lazadaFreeShippingCreatTemplate').click(function() {
		lazadaFreeShippingCreatOrEdit(0, {})
	})

	// 监听活动时间
	form.on("radio(lazadaFreeshippingTime)", function(data) {
		if (data.value == 'LONG_TERM') { // 长期有效
			$(".lazadaFreeshippingTimeHide").hide()
		} else { // 特定时间有效
			$(".lazadaFreeshippingTimeHide").show()
		}
	})

	// 监听活动预算
	form.on("radio(lazadaFreeshippingBudget)", function(data) {
		if (data.value == 'UNLIMITED_BUDGET') { // 无预算上限
			$(".lazadaFreeshippingBudgetHide").hide()
		} else { // 有限预算
			$(".lazadaFreeshippingBudgetHide").show()
		}
	})

	// 监听使用区域
	form.on("radio(lazadaFreeshippingArea)", function(data) {
		if (data.value == 'ALL_REGIONS') { // 所有地区
			$(".lazadaFreeshippingAreaHide").hide()
			$("#lazadaFreeShippingRegionValue").val('')
		} else { // 部分地区
			$(".lazadaFreeshippingAreaHide").show()
		}

		let salesSite = $("#lazadaFreeShippingDemoForm select[name=salesSite]").val();
		// 地区
		if (data.value == "SPECIAL_REGIONS")
			getRegionForSalesSiteFunc(salesSite)
	})

	function getRegionForSalesSiteFunc(salesSite) {
		getDatalazadaFreeShippingLazadalistGetRegionForSalesSite()
			.then(function(result) {
				result = result.filter((item) => item.salesSite == salesSite)
				if (result == '') {
					$("#lazadaFreeShippingRegionValue").html('')
					form.render()
				} else {
					commonRenderSelect('lazadaFreeShippingRegionValue', result[0].regionList, {
						name: 'regionName',
						code: 'regionValue'
					}).then(() => formSelects.render("lazadaFreeShippingRegionValue")).catch(err =>
						layer.msg(err, {
							icon: 2
						}))
				}
			})
			.catch(err => layer.msg(err, {
				icon: 2
			}))
	}

	// type: 0新建1编辑
	// obj: 包邮信息，为空时代表是新建包邮
	// activityStatus ： 包邮状态 <%--未开始NOT_START--%><%--进行中ONGOING--%><%--暂停中SUSPEND--%><%--已过期FINISH--%>
	function lazadaFreeShippingCreatOrEdit(type, obj) {
		// 未开始得活动：活动预算类型，适用范围(产品)不可改，其他值可改
		// 进行中的活动：  无预算上限所有值都不能更改。有预算上限可以改预算值，且要高于原值。
		// 暂停中，已过期的活动：不允许修改。
		let popIndex = layer.open({
			title: type == 0 ? '创建包邮活动' : '编辑包邮活动',
			type: 1,
			area: ['700px', '700px'],
			btn: obj.activityStatus == 'SUSPEND' || obj.activityStatus == 'FINISH' ? ['关闭'] : ['保存',
				'关闭'
			],
			id: Date.now(),
			content: $('#lazadaFreeShippingLayerCreatAndEdit').html(),
			success: function() {
				// 获取所有站点
				Promise.all([getDatalazadaFreeShippingLazadaAllSite()])
					.then(function(result) {
						if (type == 1) {
							$('#lazadaFreeShippingCurrency').val(obj.currency) // 币种单位
							let RadioDemoObj = {
								// 优惠类型数据
								dealCriteria: obj.dealCriteria || '',
								activityStatus: obj.activityStatus || '',
								filter: obj.tiersList[0].tiersFilter || '',
								result: obj.tiersList[0].tiresResult || '',
								discountType: obj.discountType || '',
								currency: obj.currency || ''
							}
							getDatalazadaFreeShippingGetOne(obj.id).then(resGetOne => {
								$("#lazadaFreeShippingDemoForm input[name=salesSite]")
									.val(resGetOne.salesSite)
								getDatalazadaFreeShippingLazadalistGetRegionForSalesSite
									() // 根据站点匹配部分地区下拉框
									.then(function(result) {
										result = result.filter((item) => item
											.salesSite == resGetOne.salesSite)
										if (result == '') {
											$("#lazadaFreeShippingRegionValue")
												.html('')
											form.render()
										} else {
											commonRenderSelect(
												'lazadaFreeShippingRegionValue',
												result[0].regionList, {
													name: 'regionName',
													code: 'regionValue'
												}).then(() => {
												formSelects.render(
													"lazadaFreeShippingRegionValue"
													);
												formSelects.value(
													"lazadaFreeShippingRegionValue",
													obj.regionValue);
											}).catch(err => layer.msg(err, {
												icon: 2
											}))
										}
									})
									.catch(err => layer.msg(err, {
										icon: 2
									}))

								//  MY最低50MYR，ID最低10000IDR，PH最低100PHP，SG最低10SGD，TH最低10THB，VN最低11000VND
								// MY/TH/VN 有部分地区
								// if(resGetOne.salesSite == 'MY'||resGetOne.salesSite == 'TH'||resGetOne.salesSite == 'VN'){
								//     $("#lazadaFreeShippingDemoForm input[name=regionType][value=SPECIAL_REGIONS]").show()
								// }else{
								//     $("#lazadaFreeShippingDemoForm input[name=regionType][value=SPECIAL_REGIONS]").hide()
								// }
								// form.render()
							})
							let lazadaFreeShippingPeriodTime = Format(obj.periodStartTime || '',
								'yyyy-MM-dd hh:mm:ss') + ' - ' + Format(obj.periodEndTime ||
								'', 'yyyy-MM-dd hh:mm:ss')
							obj.lazadaFreeShippingPeriodTime = lazadaFreeShippingPeriodTime
							obj.regionValue == '' ?
								(obj.regionValue = []) :
								(obj.regionValue = obj.regionValue.split(','))

							laytpl($('#lazadaFreeShippingDemo').html()).render(obj, function(
								html) {
								$('#lazadaFreeShippingView').html(html)
							})

							laytpl($(`#lazadaFreeShippingRadioDemo`).html()).render(
								RadioDemoObj,
								function(html) {
									$('#lazadaFreeShippingRadioView').html(html)
								})

							if (obj.budgetType != 'UNLIMITED_BUDGET') { // 有限预算
								$(".lazadaFreeshippingBudgetHide").show()
							}

							if (obj.periodType == 'SPECIAL_PERIOD') { // 特定时间有效
								$(".lazadaFreeshippingTimeHide").show()
							}

							if (obj.regionType == 'SPECIAL_REGIONS') { // 部分地区
								$(".lazadaFreeshippingAreaHide").show()
							}
						} else {
							laytpl($('#lazadaFreeShippingDemo').html()).render(obj, function(
								html) {
								$('#lazadaFreeShippingView').html(html)
							})
						}

						//日期时间范围
						laydate.render({
							elem: '#lazadaFreeShippingPeriodTime',
							type: 'datetime',
							range: true
						})

						// 因为在option中新增了一个currency币种的属性，所以没有使用封装好的select方法渲染
						var lazadaFreeShippingSalesSite = $('#lazadaFreeShippingSalesSite')
						lazadaFreeShippingSalesSite.html(`<option></option>`)
						$(result[0]).each(function() {
							lazadaFreeShippingSalesSite.append(
								`<option value='${this.salesSite}' currency='${this.currency}'>${this.name}</option>`
							)
						})

						ladaVoucherRadioChange()
						ladaVoucherDisplayAreaEnumRadioChange()
						formSelects.render()
						form.render()
					})
					.catch(function(err) {
						layer.msg(err, {
							icon: 2
						})
					})
			},
			btn1: obj.activityStatus == 'SUSPEND' || obj.activityStatus == 'FINISH' ?
				'' :
				lms_throttle(function(index, layero) {
					let formData = serializeObject($('#lazadaFreeShippingDemoForm'))

					// 进行中,只允许修改优惠券发放数量，且新的值要比旧值大
					if (obj.activityStatus == 'ONGOING') {
						if (formData.budgetValue < obj.budgetValue) {
							layer.msg('预算金额须比修改前大', {
								icon: 2
							})
							return false
						}
					} else {
						let flag = checkFormData()
						if (flag == 0) return false
					}

					if (formData.id == '') delete formData.id
					formData.regionValue == '' ?
						(formData.regionValue = []) :
						(formData.regionValue = formData.regionValue.split(','))
					formData.storeAcctIds == '' ?
						(formData.storeAcctIds = []) :
						(formData.storeAcctIds = formData.storeAcctIds.split(','))
					if (formData.lazadaFreeShippingPeriodTime) {
						formData.periodStartTime = new Date(formData.lazadaFreeShippingPeriodTime
							.split(' - ')[0]).getTime()
						formData.periodEndTime = new Date(formData.lazadaFreeShippingPeriodTime
							.split(' - ')[1]).getTime()
					}

					formData.tiers = [{
						"filter": formData.filter,
						"result": formData.result
					}]
					formData.templateType = "MANUALLY"
					$(layero).find(".layui-layer-btn0").attr("disabled", true)
					if (type == 0) {
						// 批量创建包邮
						getDatalazadaFreeShippingBatchCreate(formData)
							.then(function(res) {
								layer.close(popIndex)
								let html = res.msg + res.data.join(",")
								layer.msg(html, {
									icon: 1
								})
								lazadaFreeShippingTableRender()
							})
							.catch(function(err) {
								layer.msg(err || 'error', {
									icon: 2
								})
							})
					} else {
						formData.activityId = obj.activityId
						// 编辑单个包邮
						getDatalazadaFreeShippingUpdateSingle(formData)
							.then(function(res) {
								layer.close(popIndex)
								let html = res.msg + res.data.join(",")
								layer.msg(html, {
									icon: 1
								})
								lazadaFreeShippingTableRender()
							})
							.catch(function(err) {
								layer.msg(err, {
									icon: 2
								})
							})
					}
					return false
				}, 2000)
		})
	}
	// 验证必填项信息
	function checkFormData() {
		let obj = serializeObject($('#lazadaFreeShippingDemoForm')),
			err = ''
		if (obj.lazadaFreeShippingPeriodTime != '' && obj.lazadaFreeShippingPeriodTime != '-') {
			let nowDate = Format(new Date(), 'yyyy-MM-dd hh:mm:ss'); // 当前时间
			let periodStartTime = obj.lazadaFreeShippingPeriodTime.split(' - ')[0]; // 活动开始时间
			let periodEndTime = obj.lazadaFreeShippingPeriodTime.split(' - ')[1]; // 活动结束时间

			getMins(periodStartTime, periodEndTime) < 10 ? err = '开始和结束时间需大于10分钟' : ''
			checkDate(periodEndTime, periodStartTime) == false ? err = '活动结束时间不能小于等于开始时间' : ''
			getDays(periodStartTime, periodEndTime) > 180 ? err = '开始和结束时间不能超过180天' : ''
			checkDate(periodStartTime, nowDate) == false ? err = '开始时间不能早于当前时间' : ''
		}

		if (obj.promotionName.length > 100) {
			err = '活动名称需在100个字符以内'
		}

		// MY最低50MYR，ID最低10000IDR，PH最低100PHP，SG最低10SGD，TH最低10THB，VN最低11000VND
		if (obj.budgetValue != '') {
			if (obj.salesSite == 'MY' && obj.budgetValue < 50) {
				err = 'MY站点最低预算50MYR'
			} else if (obj.salesSite == 'ID' && obj.budgetValue < 10000) {
				err = 'ID站点最低预算10000IDR'
			} else if (obj.salesSite == 'PH' && obj.budgetValue < 100) {
				err = 'PH站点最低预算100PHP'
			} else if (obj.salesSite == 'SG' && obj.budgetValue < 10) {
				err = 'SG站点最低预算10SGD'
			} else if (obj.salesSite == 'TH' && obj.budgetValue < 10) {
				err = 'TH站点最低预算10THB'
			} else if (obj.salesSite == 'VN' && obj.budgetValue < 11000) {
				err = 'VN站点最低预算11000VND'
			}

			if (obj.budgetValue.toString().length > 11) {
				err = '预算金额超出最大位数'
			}
		}
		if (obj.discountType == 'PARTIAL_SUBSIDY' && obj.result.toString().length > 11) {
			err = '邮费补贴详情超出最大位数'
		}

		if (obj.dealCriteria == 'ITEM_QUANTITY_FROM_X' && obj.filter > 99999) { // 满件
			err = '购买数量最大99999'
		}

		if (obj.dealCriteria == 'MONEY_VALUE_FROM_X' && obj.filter > 9999999999.99) { // 订单金额达到门槛
			err = '订单金额最大9999999999.99'
		}

		// if(obj.budgetValue && obj.budgetValue.toString().length > 11){
		// }
		for (let key in obj) {
			if (obj[key] == '' && key != 'id') {
				if ((obj.discountType == 'FULL_SUBSIDY' && obj.result == '') || (key == 'budgetValue' && obj
						.budgetType == 'UNLIMITED_BUDGET') || (key == 'lazadaFreeShippingPeriodTime' && obj
						.periodType == 'LONG_TERM') || (key == 'regionValue' && obj.regionType ==
					'ALL_REGIONS')) {} else {
					err = '必填项不能为空'
				}
			}
		}
		if (err) {
			layer.alert(err, {
				icon: 2
			})
			return 0
		}
		return 1
	}

	// 批量启用or停用
	form.on(`select(lazadaFreeShippingBatchOnOrOff)`, function(data) {
		let checkedData = table.checkStatus('lazadaFreeShippingTable').data //获取选中的数据
		let checkedStatus = data.value,
			type; // on off

		if (checkedData.length <= 0) {
			return layer.alert('请选择需要修改的数据', {
				icon: 7
			})
		}

		if (checkedStatus == 'on')
			type = "BATCH_START_ACTIVITY"
		else
			type = "BATCH_CLOSE_ACTIVITY"

		let obj = {
			"shippingActivityList": checkedData,
			"type": type
		}
		lazadaFreeShippingOnOrOffFunc(obj)
	})

	function lazadaFreeShippingOnOrOffFunc(obj) {
		getDatalazadaFreeShippingBatchOnOrOff(obj)
			.then(function(res) {
				layer.msg(res.join("") || '操作成功', {
					icon: 1
				})
				lazadaFreeShippingTableRender()
			})
			.catch(function(err) {
				layer.msg(err, {
					icon: 2
				})
			})
	}

	// 站点--店铺--币种 联动
	form.on(`select(lazadaFreeShippingSalesSite)`, function(data) {
		let site = data.value,
			currency = $(data.elem[data.elem.selectedIndex]).attr('currency') // 单位
		$('#lazadaFreeShippingCurrency').val(currency) // 币种单位
		$('.lazadaFScurrency').text(currency) // 币种单位


		if (site == '') return
		// 店铺
		getDatalazadaFreeShippingLazadaStore(site)
			.then(function(result) {
				commonRenderSelect('lazadaFreeShippingStoreIdList', result, {
					name: 'storeAcct',
					code: 'id'
				}).then(() => formSelects.render())
			})
			.catch(function(err) {
				layer.msg(err, {
					icon: 2
				})
			})

		// // MY/TH/VN 有部分地区
		// if(site == 'MY'||site == 'TH'||site == 'VN'){
		//     $("#lazadaFreeShippingDemoForm input[name=regionType][value=SPECIAL_REGIONS]").show()
		// }else{
		//     $("#lazadaFreeShippingDemoForm input[name=regionType][value=SPECIAL_REGIONS]").hide()
		// }
		// form.render()
	})

	// 优惠类型: FULL_SUBSIDY 全部包邮,PARTIAL_SUBSIDY 部分包邮
	function ladaVoucherRadioChange() {
		form.on('radio(discountTypeFilter)', function(data) {
			let radioData = data.value
			laytpl($(`#lazadaFreeShippingRadioDemo`).html()).render({
					dealCriteria: $("#lazadaFreeShippingDemoForm input[name=dealCriteria]:checked")
						.val(), // 优惠门槛
					currency: $('#lazadaFreeShippingCurrency').val(),
					discountType: radioData // 优惠类型
				},
				function(html) {
					$('#lazadaFreeShippingRadioView').html(html)
					form.render()
				}
			)
		})
	}

	// 优惠门槛: MONEY_VALUE_FROM_X 订单金额达到门槛,ITEM_QUANTITY_FROM_X 满件 ,NO_CONDITION 无门槛
	function ladaVoucherDisplayAreaEnumRadioChange() {
		form.on('radio(dealCriteriaFilter)', function(data) {
			let radioData = data.value,
				discountTypeVal = $('#lazadaFreeShippingDemoForm input[name=discountType]:checked')
				.val()

			if (discountTypeVal) {
				laytpl($(`#lazadaFreeShippingRadioDemo`).html()).render({
						dealCriteria: radioData, // 优惠门槛
						currency: $('#lazadaFreeShippingCurrency').val(),
						discountType: discountTypeVal // 优惠类型
					},
					function(html) {
						$('#lazadaFreeShippingRadioView').html(html)
						form.render()
					}
				)
			}
		})
	}

	function getLazadaMangArr() {
		let discountValue = [],
			criteriaValue = [],
			lazadaMangArr = []
		$('#lazadaFreeShippingRadioView')
			.find('input[name=criteriaValue]')
			.each((index, item) => criteriaValue.push($(item).val()))
		$('#lazadaFreeShippingRadioView')
			.find('input[name=discountValue]')
			.each((index, item) => discountValue.push($(item).val()))

		criteriaValue.forEach((item, index) =>
			lazadaMangArr.push({
				criteriaValue: item,
				discountValue: discountValue[index]
			})
		)
		return lazadaMangArr
	}


	// 获取lazada站点的接口
	function getDatalazadaFreeShippingGetAllSite() {
		return commonReturnPromise({
			url: ctx + `/onlineProductLazada/getAllSite.html`,
			type: 'GET'
		})
	}

	/*****
	 *  批量启用|停用接口
	 *  params{
	 *      ids:
	 *  }
	 * ****/
	function getDatalazadaFreeShippingBatchOnOrOff(obj) {
		return commonReturnPromise({
			url: ctx + `/lazadaShippingActivity/batchStartOrCloseActivity`,
			type: 'POST',
			params: JSON.stringify(obj),
			contentType: 'application/json'
		})
	}

	// 批量创建包邮
	function getDatalazadaFreeShippingBatchCreate(obj) {
		// return commonReturnPromise({
		//     url: ctx + `/lazada/voucher/batchCreate`,
		//     type: 'POST',
		//     contentType: 'application/json;charset=utf-8',
		//     params: JSON.stringify(obj)
		// })
		return new Promise(function(resolve, reject) {
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: ctx + `/lazadaShippingActivity/createShippingActivityByBatch`,
				contentType: 'application/json;charset=utf-8',
				data: JSON.stringify(obj),
				success: function(res) {
					if (res.code == '0000') {
						resolve(res)
					} else {
						reject(res.msg || res.extra.error)
					}
				},
				error: function(err) {
					reject(err.responseText)
				}
			})
		})
	}

	// 编辑单个包邮
	function getDatalazadaFreeShippingUpdateSingle(obj) {
		return commonReturnPromise({
			url: ctx + `/lazadaShippingActivity/updateShippingActivity`,
			type: 'POST',
			contentType: 'application/json;charset=utf-8',
			params: JSON.stringify(obj)
		})
	}

	// 获取单个包邮活动详情
	function getDatalazadaFreeShippingGetOne(shippingActivityId) {
		return commonReturnPromise({
			url: ctx + `/lazadaShippingActivity/getOne`,
			type: 'POST',
			contentType: 'application/json;charset=utf-8',
			params: JSON.stringify({
				"shippingActivityId": shippingActivityId
			})
		})
	}

	// 部分地区接口
	function getDatalazadaFreeShippingLazadalistGetRegionForSalesSite() {
		return commonReturnPromise({
			url: ctx + `/lazadaShippingActivity/listGetRegionForSalesSite`,
			type: 'GET'
		})
	}

	// 获取所有lazada站点
	function getDatalazadaFreeShippingLazadaAllSite() {
		return commonReturnPromise({
			url: ctx + `/lazada/voucher/get/lazada/site/all`,
			type: 'GET'
		})
	}

	// 根据站点查询出所有店铺和单位
	function getDatalazadaFreeShippingLazadaStore(site) {
		return commonReturnPromise({
			url: ctx + `/lazada/voucher/get/lazada/store/site/${site}`,
			type: 'GET'
		})
	}
})

function LFSPromotionName() {
	$(".lazadaFSpromotionName span").text($("#lazadaFreeShippingDemoForm input[name=promotionName]").val().length)
}

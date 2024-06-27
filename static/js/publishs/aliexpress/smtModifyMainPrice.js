/**
 * 调价
 */
var smttableIns = {};
// 汇率
let SmtModifyMainPrice_exchangeRate = null
layui.use(['admin', 'form', 'layer', 'table', 'formSelects', 'element', 'laydate'], function () {
	var admin = layui.admin,
		form = layui.form,
		layer = layui.layer,
		table = layui.table,
		formSelects = layui.formSelects,
		element = layui.element,
		laydate = layui.laydate,
		laypage = layui.laypage,
		$ = layui.$;
	render_hp_orgs_users("#smt_theShelves_searchForm");//渲染部门销售员店铺三级联动
	form.render(null, 'component-form-element');
	form.render(null, 'component-form-group');
	form.render('select');
	form.render('checkbox');
	form.render('radio');

	//表格渲染结果
	//展示已知数据

	//初始化 方法
	var smtModifyMainPriceName = {
		isNeedNewPriceLayer: false,
		countryList: [],
		// 区域定价点击是否隐藏
		showCountryCardTag: true,
		// 调整价格按钮种类和对应url
		AdjustPriceBtnType: {
			mainPrice: { // 仅调整刊登价
				name: 'mainPrice',
				url: ctx + "/batchOperation/modifyMainPrice.html",
			},
			regionPrice: {  // 仅区域调价
				name: 'regionPrice',
				url: ctx + '/batchOperation/modifyOnlineRegionPrice',
			},
			mainAndRegionPrice: { // 调整刊登价和区域价
				name: 'mainAndRegionPrice',
				url: ctx + '/batchOperation/modifyPriceAndRegionPrice',
			},
		},
		// 获取汇率
		getExchangeRate: function () {
			commonReturnPromise({
				url: '/lms/prodCommon/getRate',
				type: 'post',
				params: {fromCurrency:'USD',toCurrency:'CNY'}
			}).then(res=>{
				SmtModifyMainPrice_exchangeRate = res
			})
		},
		hideOrShowCountryCard: function () {
			var _this = this
			$('#smt-theShelves-country-header').click(function (obj) {
				_this.showCountryCardTag = !_this.showCountryCardTag
				if (_this.showCountryCardTag) {
					$('#smtadjustPriceProcess').find('.smt-theShelves-tohideIcon').show()
					$('#smtadjustPriceProcess').find('.smt-theShelves-toShowIcon').hide()
					$('#smt_theShelves_countryList').show()
				} else {
					$('#smtadjustPriceProcess').find('.smt-theShelves-tohideIcon').hide()
					$('#smtadjustPriceProcess').find('.smt-theShelves-toShowIcon').show()
					$('#smt_theShelves_countryList').hide()
				}
			})
		},
		countryThColTpl: function (obj) {
			let thTpl = `<div>${obj.name}(${obj.code})</div>
			<div>
			<select name="regionPriceFixPriceByShipType" 
			lay-filter="smt_theShelves_regionPriceFixPriceByShipType">
			<option value="GENERALECONOMY">普货-经济</option>
			<option value="GENERALSIMPLE">普货-简易</option>
			<option value="GENERALSTANDARD">普货-标准</option>
			<option value="SPECIALECONOMY">特货-经济</option>
			<option value="SPECIALSIMPLE">特货-简易</option>
			<option value="SPECIALSTANDARD">特货-标准</option>
			</select>
			<input type="checkbox" name="onlyCheckedHasVal" lay-skin="primary"  
			value="true" title="只修改已有值" checked/>
			</div>`
			return thTpl
		},
		countryTdColTpl: function (obj, d = '') {
			let val = ''
			let priceCny=''
			d && d.skuRegionPriceDataList && Array.isArray(d.skuRegionPriceDataList) && d.skuRegionPriceDataList.forEach(item => {
				if(item.shiptoCountry == obj.code ){
					val = item.price
					priceCny= item.priceCny
				}
			})
			let tdTpl = `
			<div class="flexTd">
        <div class="unit w20">$</div>
        <input class="layui-input" onchange="smtModifyPriceTable_changeRegionPriceFixPrice(this)"
					onblur="smtModifyPriceTable_areaPriceBlur(this)" type="number"
					name="smtModifyPriceTable_${obj.code}" data-code="${obj.code}" 
					data-order="${obj.order}" data-name="${obj.name}" value="${val}"/
				>
			</div>
			<div class="flexTd">
				<div class="unit w20">￥</div>
				<input class="layui-input" onchange="smtModifyPriceTable_changeRegionPriceFixPrice(this)"
					onblur="smtModifyPriceTable_areaPriceCnyBlur(this)" type="number"
					name="smtModifyPriceTable_${obj.code}_priceCny" data-code="${obj.code}" 
					data-order="${obj.order}" data-name="${obj.name}" value="${priceCny}"
				/>
			</div>
		`
			return tdTpl
		},
		initCheckedCountrys: function (data) {
			//区域国家 渲染选中的数据
			let shiptoCountrys = data.map(item =>
				Array.isArray(item.skuRegionPriceDataList) && item.skuRegionPriceDataList.map(elem =>
					elem.shiptoCountry
				)).flat(Infinity)
			let hasCountryCol = {}
			// 去重
			shiptoCountrys.reduce(function (item, next) {
				hasCountryCol[next] ? '' : hasCountryCol[next] = true && item.push(next);
				return item;
			}, []);
			// 获取选中的所有的国家
			let existCountrys = []
			this.countryList.forEach(item => !!hasCountryCol[item.code] && existCountrys.push(item))
			return existCountrys
		},
		colsHandle: function (data) {
			var _this = this
			let existCountrys = _this.initCheckedCountrys(data)
			let secondCols = existCountrys.map(item => ({
				field: item.code, width: 150, title: _this.countryThColTpl(item), templet: function (d) { return _this.countryTdColTpl(item, d) },
			}))
			var basicCols = [[
				{ type: "checkbox" },
				{ field: "id", title: "id" },
				{ field: "storeAcctId", title: "店铺id" },
				{ field: "freightTemplateId", title: "模板id" },
				{ field: "storeAcct", title: "店铺", width: 150 },
				{ field: "storeSubId", title: "storeSubId" },
				{ field: "prodSSku", title: "商品子SKU", width: 150 },
				{ field: "storeSubSku", title: "店铺子SKU", width: 150 },
				{ field: "itemId", title: "Item ID", width: 150 },
				{ field: "thirtySales", title: "30天销量", templet: '#smtModifyPriceTable_sales', width: 100 },
				{ field: "promotionName", title: "单品折扣", width: 100 },
				{ field: "shippingTypeName", title: "定价公式", width: 100 },
				{ field: "price", title: "当前刊登价", width: 100, templet:'#smtModifyPriceTable_curPrice_tpl' },
				{ field: "newPrice", title: "新刊登价", templet: '#smtModifyPriceTable_newPrice_tpl', width: 100 },
				{ field: "estimateProfit", title: "预估利润(&yen;)", templet: "<div>{{d.estimateProfit==undefined ? '' : d.estimateProfit}}</div>", width: 100 },
				{ field: "diffPrice", title: "差价", width: 100, templet:'#smtModifyPriceTable_diffPrice_tpl' },
				...secondCols,
				{ field: "result", title: '操作结果', width: 200 }
			]]

			return basicCols
		},
		//
		tableRender: function (data, isNewData = false) {
			var _this = this;
			smttableIns = table.render({
				elem: "#smtModifyPriceTable",
				cols: _this.colsHandle(data),
				page: false,
				data: data,
				height: 580,
				id: "smtModifyPriceTable",
				limit: 10000,
				done: function (res, cur, count) {
					$('#smtModifyPriceTable').next().find("[data-field='id']").css('display', 'none')
					$('#smtModifyPriceTable').next().find("[data-field='storeAcctId']").css('display', 'none')
					$('#smtModifyPriceTable').next().find("[data-field='storeSubId']").css('display', 'none')
					$('#smtModifyPriceTable').next().find("[data-field='freightTemplateId']").css('display', 'none')
					$("#tolnum_span_smt_price").text(count)
					if(isNewData && res.data.length){
						setTimeout(() => {
							$('#smtModifyPriceTable').next().find('table thead tr .laytable-cell-checkbox .layui-icon').click()
							form.render()
							$("#smt_modifyMainPrice_getPrice").click()
						}, 20);
					}
					let existCountrys = _this.initCheckedCountrys(data)
					existCountrys.forEach(item => {
						$('#smtModifyPriceTable').next().find(`[data-field='${item.code}']`)
							.attr('data-order', item.order)
							.attr('data-code', item.code)
							.attr('data-name', item.name)
					})
					form.render()
				},
			});
		},
		// 单品折扣
		fetchPromotionInfo: function (storeAcctId = '') {
			let _this = this
			_this.fetchPromotionInfoAjax(storeAcctId)
				.then(data => {
					// 去除 单品折扣的无折扣,其id为1
					let _data = data.map(item => ({ name: item.promotionName, value: item.promotionId })).filter(item => item.value != 1)
					formSelects.data('smt_modifyMainPrice_discount', 'local', { arr: _data })
				}).catch(err => layer.msg(err || err.msg, { icon: 2 }))
		},

		// 运费模板
		fetchFreightTplInfo: function (storeAcctId = '') {
			let _this = this
			_this.fetchFreightTplInfoAjax(storeAcctId)
				.then(data => {
					let _data = data.freightList.map(item => ({ name: item.templateName, value: item.templateId }))
					formSelects.data('smt_modifyMainPrice_freightTpl', 'local', { arr: _data })
				}).catch(err => layer.msg(err || err.msg, { icon: 2 }))
		},

		// 选择店铺后,运费模板和单品折扣联动
		storeLinkage: function () {
			let _this = this
			formSelects.on('smt_modifyMainPrice_store', function (id, vals) {
				let _vals = vals.map(item => item.value).join()
				_this.fetchFreightTplInfo(_vals)
				_this.fetchPromotionInfo(_vals)
			}, true)
		},

		// 区域定价国家
		fetchCountryList: function () {
			var _this = this
			commonReturnPromise({
				url: ctx + '/aliexpress/publish/regionPriceCountry'
			}).then(data => {
				let str = ''
				_this.countryList = data.map((item, index) => ({
					code: Object.keys(item)[0],
					name: Object.values(item)[0],
					order: index + 1
				}))
				_this.countryList.forEach(item => {
					str += `<div class="w150">
						<input type="checkbox" name="adjustPriceCountry" lay-skin="primary" 
						lay-filter="smt_theShelves_checkCountry" 
						value="${item.code}" title="${item.name}(${item.code})"
						data-order="${item.order}" data-code="${item.code}" 
						data-name="${item.name}" />
					</div>`
				})
				$('#smt_theShelves_countryList').html(str)
				form.render()
			})
		},
		// 全选 
		checkAllCountry: function(){
			var _this = this
			form.on('checkbox(smt_theShelves_checkAllCountry)', function (obj) {
				const checked =obj.elem.checked
				$('#smt_theShelves_countryList').find('input[name=adjustPriceCountry]').prop('checked', checked)
				// 选中按顺序添加列
				if (checked) {
					_this.countryList.forEach(dataset=>{
						let orderArr = []
						Array.from($('#smtModifyPriceTable').next().find('thead>tr>th')).forEach(item => {
							orderArr.push($(item).attr('data-order') || 0)
						})
						let th = `<th data-field="${dataset.code}" data-order="${dataset.order}" data-code="${dataset.code}"
							data-name="${dataset.name}">
							<div class="layui-table-cell w150">${_this.countryThColTpl(dataset)}</div></th>`
						let col = `<td data-field="${dataset.code}" class="taCenter" data-order="${dataset.order}">
							<div class="layui-table-cell w150">${_this.countryTdColTpl(dataset)}</div></td>`
						isExist =	orderArr.some(item=>Number(dataset.order) == Number(item))
						if(!isExist){
							let _curIndex = orderArr.findIndex(item => Number(dataset.order) < Number(item))
							if (_curIndex == -1) {
								$('#smtModifyPriceTable').next().find('thead>tr>th').last().before(th)
								$('#smtModifyPriceTable').next().find('tbody>tr').find('[data-field=result]').before(col)
							} else {
								$('#smtModifyPriceTable').next().find('thead>tr>th').eq(_curIndex).before(th);
								$('#smtModifyPriceTable').next().find(`tbody>tr :nth-child(${_curIndex + 1})`).before(col)
							}
						}
					})

					// 取消删除
				} else {
					_this.countryList.forEach(dataset=>{
						let orderArr = []
						Array.from($('#smtModifyPriceTable').next().find('thead>tr>th')).forEach(item => {
							orderArr.push($(item).attr('data-order') || 0)
						})
					let _curIndex = orderArr.findIndex(item => Number(dataset.order) == Number(item))
					if (_curIndex != -1) {
						$('#smtModifyPriceTable').next().find('thead>tr>th').eq(_curIndex).remove();
						$('#smtModifyPriceTable').next().find(`tbody>tr :nth-child(${_curIndex + 1})`).remove()
					}
				})
			}
				form.render()
				layui.stope()
				return false
			})
		},
		// 区域国家选中触发
		checkCountry: function () {
			var _this = this
			form.on('checkbox(smt_theShelves_checkCountry)', function (obj) {
				var { checked, dataset } = obj.elem
				let orderArr = []
				Array.from($('#smtModifyPriceTable').next().find('thead>tr>th')).forEach(item => {
					orderArr.push($(item).attr('data-order') || 0)
				})
				// 选中按顺序添加列
				if (checked) {
					let th = `<th data-field="${dataset.code}" data-order="${dataset.order}" data-code="${dataset.code}"
						data-name="${dataset.name}">
						<div class="layui-table-cell w150">${_this.countryThColTpl(dataset)}</div></th>`
					let col = `<td data-field="${dataset.code}" class="taCenter" data-order="${dataset.order}">
						<div class="layui-table-cell w150">${_this.countryTdColTpl(dataset)}</div></td>`
					let _curIndex = orderArr.findIndex(item => Number(dataset.order) < Number(item))
					if (_curIndex == -1) {
						$('#smtModifyPriceTable').next().find('thead>tr>th').last().before(th)
						$('#smtModifyPriceTable').next().find('tbody>tr').find('[data-field=result]').before(col)
					} else {
						$('#smtModifyPriceTable').next().find('thead>tr>th').eq(_curIndex).before(th);
						$('#smtModifyPriceTable').next().find(`tbody>tr :nth-child(${_curIndex + 1})`).before(col)
					}

					// 取消删除
				} else {
					let _curIndex = orderArr.findIndex(item => Number(dataset.order) == Number(item))
					if (_curIndex != -1) {
						$('#smtModifyPriceTable').next().find('thead>tr>th').eq(_curIndex).remove();
						$('#smtModifyPriceTable').next().find(`tbody>tr :nth-child(${_curIndex + 1})`).remove()
					}
				}
				form.render()
			})
		},

		// 区域定价调接口
		countrySelLinkage: function () {
			var _this = this
			form.on('select(smt_theShelves_regionPriceFixPriceByShipType)', function (data) {
				let onlyCheckedHasVal = $(data.othis).parents('th').find('input[name=onlyCheckedHasVal]:checked').val()
				let code = $(data.othis).parents('th').attr('data-code')
				let params = {}
				params.countryCode = code
				params.grossProfitRate = $("#smt_theShelves_searchForm").find('input[name=grossProfitRate]').val()  //折扣率
				params.discountRate = $("#smt_theShelves_searchForm").find('input[name=discountRate]').val()   //优惠幅度
				params.shipType = data.value
				var layFilterIndex = 'LAY-table-' + smttableIns.config.index;
				var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
				let checkStatus = tableContainer.find('td input[name="layTableCheckbox"]:checked'); //获取表格选中行
				if (!checkStatus.length) return layer.msg('请先选中一条数据')
				var skuList = []
				checkStatus.each(function () {
					let parentTr = $(this).parents('tr')
					let curCountryPrice = parentTr.find(`[data-field=${code}] input[name=smtModifyPriceTable_${code}]`).val()
					if ((!!curCountryPrice && !!onlyCheckedHasVal) || !onlyCheckedHasVal) {
						let listingPrice = parentTr.find('[data-field=price] div').text()
						let newPrice = parentTr.find('input[name=adjustPrice]').val()
						skuList.push({
							prodSSku: parentTr.find('[data-field=prodSSku] div').text(),
							storeSubSku: parentTr.find('[data-field=storeSubSku] div').text(),
							storeAcctId: parentTr.find(`[data-field=storeAcctId] div`).text(),
							listingPrice: newPrice != '' ? Number(newPrice) : listingPrice == '' ? null : Number(listingPrice)
						})
					}
				})
				params.skuList = skuList
				params.type = 'ONLINE'
				_this.fetchRegionPriceAjax(params)
					.then(res => {
						tableContainer.find('td input[name="layTableCheckbox"]:checked').each(function () {
							let trDom = $(this).parents('tr');
							var storeSubSku = trDom.find('td[data-field="storeSubSku"] div').text()
							var prodSSku = trDom.find('td[data-field="prodSSku"] div').text()
							let curData = res.filter(item => item.sSku == prodSSku && item.storeSubSku == storeSubSku && item.countryCode == code)
							if (curData[0] && curData[0].normal) {
								trDom.find(`td[data-field="${code}"] div input[name=smtModifyPriceTable_${code}]`).val(curData[0].price)
								trDom.find(`td[data-field="${code}"] div input[name=smtModifyPriceTable_${code}_priceCny]`).val(curData[0].priceCny)
								trDom.find(`td[data-field="${code}"]`).css('background-color', 'transparent')
							} else if (curData[0] && !curData[0].normal) {
								// 用黄色底色渲染
								trDom.find(`td[data-field="${code}"] div input[name=smtModifyPriceTable_${code}]`).val(curData[0].price)
								trDom.find(`td[data-field="${code}"] div input[name=smtModifyPriceTable_${code}_priceCny]`).val(curData[0].priceCny)
								trDom.find(`td[data-field="${code}"]`).css('background-color', 'yellow')
							}
						})
					})
			})
		},

		//  区域定价 批量估算
		batchEstimateRegionPrice: function () {
			var _this = this
			$('#smt_theShelves_batchEstimateRegionPrice').click(function () {
				let params = {}
				params.grossProfitRate = $("#smt_theShelves_searchForm").find('input[name=grossProfitRate]').val()  //折扣率
				params.discountRate = $("#smt_theShelves_searchForm").find('input[name=discountRate]').val()   //优惠幅度
				params.adjustType = $('#smt_theShelves_adjustType').val()
				var layFilterIndex = 'LAY-table-' + smttableIns.config.index;
				var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
				let checkStatus = tableContainer.find('td input[name="layTableCheckbox"]:checked'); //获取表格选中行
				if (!checkStatus.length) return layer.msg('请先选中一条数据')
				// 选中的国家
				let checkedCountryDom = $('#smt_theShelves_countryList').find('input[name=adjustPriceCountry]:checked')
				if (!checkedCountryDom.length) return layer.msg('请至少选择一个国家')
				let countryList = []
				checkedCountryDom.each(function () {
					countryList.push($(this).val())
				})
				// price为空或为0 不添加
				var skuList = []
				checkStatus.each(function () {
					let parentTr = $(this).parents('tr')
					let newPrice = parentTr.find('input[name=adjustPrice]').val()
					let listingPrice = parentTr.find('[data-field=price] div').text()
					skuList.push({
						prodSSku: parentTr.find('[data-field=prodSSku] div').text(),
						storeSubSku: parentTr.find('[data-field=storeSubSku] div').text(),
						countryList: _this.countryFiltByval(countryList, parentTr),
						storeAcctId: Number(parentTr.find('[data-field=storeAcctId] div').text()),
						listingPrice: newPrice != '' ? Number(newPrice) : listingPrice == '' ? null : Number(listingPrice)
					})
				})
				params.skuList = skuList
				params.type = 'ONLINE'
				commonReturnPromise({
					url: ctx + '/aliexpress/publish/regionPriceFixPrice',
					type: 'post',
					contentType: 'application/json;charset=UTF-8',
					// 通过type的值，在线/刊登
					params: JSON.stringify({ ...params })
				}).then(res => {
					tableContainer.find('td input[name="layTableCheckbox"]:checked').each(function () {
						let trDom = $(this).parents('tr');
						var storeSubSku = trDom.find('td[data-field="storeSubSku"] div').text()
						var prodSSku = trDom.find('td[data-field="prodSSku"] div').text()
						let curData = res.filter(item => item.sSku == prodSSku && item.storeSubSku == storeSubSku)
						if (curData[0] && curData[0].countryList && curData[0].countryList.length) {
							curData[0].countryList.forEach(item => {
								trDom.find(`td[data-field=${item.countryCode}] input[name=smtModifyPriceTable_${item.countryCode}]`).val(item.price)
								trDom.find(`td[data-field=${item.countryCode}] input[name=smtModifyPriceTable_${item.countryCode}_priceCny]`).val(item.priceCny)
								let color = item.normal ? 'transparent' : 'yellow'
								trDom.find(`td[data-field="${item.countryCode}"]`).css('background-color', color)
							})
						}
					})
					res[0] && res[0].countryList.forEach(item => {
						$('#smtModifyPriceTable').next().find('table thead').find(`th[data-code=${item.countryCode}]`).find('select[name=regionPriceFixPriceByShipType]').val(item.countryAdjustType)
					})
					form.render()
				})
			})
		},

		// 批量勾选--table --只修改已有值
		checkAllhasVal: function () {
			form.on('checkbox(smt_theShelves_checkAllhasVal)', function (data) {
				// table header 包含国家的th
				let countryTh = $('input[name=onlyCheckedHasVal]')
				if (countryTh.length) {
					countryTh.each(function () {
						$(this).prop('checked', data.elem.checked)
					})
					form.render()
				}
			})
		},

		countryFiltByval: function (countryList, parentTr) {
			// 根据是否选择  只修改以有值来做筛选
			let trDom = $('#smtModifyPriceTable').next().find('thead>tr')
			let _countryList = []
			if (trDom.length) {
				countryList.forEach(item => {
					let onlyCheckedHasVal = trDom.find(`th[data-code=${item}]`).find('input[name=onlyCheckedHasVal]').prop('checked')
					let curTrVal = parentTr.find(`td[data-field=${item}]`).find(`input[name=smtModifyPriceTable_${item}]`).val()
					if ((onlyCheckedHasVal && curTrVal != '') || !onlyCheckedHasVal) {
						_countryList.push(item)
					}
				})
			}
			return _countryList
		},

		// 定价
		fixPrice: function () {
			let _this = this
			$("#smt_modifyMainPrice_getPrice").click(function () {
				let params = {}
				let formDom = $("#smt_theShelves_searchForm")
				params.grossProfitRate = formDom.find('input[name=grossProfitRate]').val()  //折扣率
				params.discountRate = formDom.find('input[name=discountRate]').val()   //优惠幅度
				params.shippingType = formDom.find('select[name=shippingType]').val()  //定价方式
				let checkStatus = table.checkStatus('smtModifyPriceTable'); //获取表格选中行
				if (!checkStatus.data.length) return layer.msg('请先选中一条数据')
				let skuDtoList = checkStatus.data.map(item => ({
					prodSSku: item.prodSSku,  // 子sku
					storeAcctId: item.storeAcctId,   //店铺id
					freightTemplateId: item.freightTemplateId,    //物流模板id
					storeSubSku: item.storeSubSku,   //店铺子sku
				}))
				params.skuDtoList = skuDtoList
				var layFilterIndex = 'LAY-table-' + smttableIns.config.index;
				var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
				_this.fixPriceAjax(params)
					.then(res => {
						tableContainer.find('input[name="layTableCheckbox"]:checked').each(function () {
							var tr = $(this).parents('tr');
							if ($(this).parents('thead').length == 0) {
								var storeSubSku = tr.find('td[data-field="storeSubSku"] div').text()
								var freightTemplateId = tr.find('td[data-field="freightTemplateId"] div').text()
								let curData = res.filter(item => item.storeSubSku == storeSubSku && item.freightTemplateId == freightTemplateId)
								let originPrice = tr.find('td[data-field="price"] .price').text()
								let originPriceCny = tr.find('td[data-field="price"] .priceCny').text()
								let diffPrice = (curData[0].price - originPrice).toFixed(2)
								let diffPriceCny = (curData[0].priceCny - originPriceCny).toFixed(2)
								if (curData[0].price != 0) {
									tr.find('td[data-field="newPrice"] div input[name=adjustPrice]').val(curData[0].price)  //新刊登价
									tr.find('td[data-field="newPrice"] div input[name=adjustPriceCny]').val(curData[0].priceCny)  //新刊登价
									tr.find('td[data-field="shippingTypeName"] div').text(curData[0].shippingTypeName)  //定价方式
									tr.find('td[data-field="estimateProfit"] div').text(curData[0].estimateProfit)  //预估利润
									tr.find(`td[data-field="newPrice"]`).css('background-color', 'transparent')
								} else {
									// 如果是空值或者报错,用黄色底色渲染
									tr.find(`td[data-field="newPrice"]`).css('background-color', 'yellow')
									tr.find('td[data-field="newPrice"] div input[name=adjustPrice]').val('')  //新刊登价
									tr.find('td[data-field="newPrice"] div input[name=adjustPriceCny]').val('')  //新刊登价
									tr.find('td[data-field="estimateProfit"] div').text('')  //定价方式
									tr.find('td[data-field="estimateProfit"] div').text('')  //预估利润
								}
								tr.find(`[data-field="diffPrice"] .price`).text(diffPrice) //差价
								tr.find(`[data-field="diffPrice"] .priceCny`).text(diffPriceCny)//差价
							}
						});
					}).catch(err => layer.msg(err || err.msg, { icon: 2 }))
			})
		},
		// 差价查询
		diffPriceSearch: function () {
			$('#smtModifyMainPrice_search_byLocal').click(function () {
				let operator = $('#applyForm').find('select[name=opreator]').val()
				const diffPriceType = $('#applyForm').find('select[name=diffPriceType]').val()
				let diffPriceVal = $('#applyForm').find('input[name=diffPrice]').val()
				let count = 0
				$('#smtModifyPriceTable').next().find('tbody>tr').each(function (index, item) {
					let diffPrice = $(item).find(`[data-field="diffPrice"] .${diffPriceType}`).text()
					const newPriceTd = $(item).find('[data-field="newPrice"]')
					const newPriceTypeVal ={
						price: newPriceTd.find('input[name=adjustPriceCny]').val(),
						priceCny: newPriceTd.find('input[name=adjustPriceCny]').val()
					}
					if (newPriceTypeVal[diffPriceType] !== undefined && newPriceTypeVal[diffPriceType] !== '') {
						if (operator == '=') {
							Number(diffPrice) == Number(diffPriceVal).toFixed(2) ? $(item).show() && count++ : $(item).hide()
						} else if (operator == '>') {
							Number(diffPrice) - Number(diffPriceVal).toFixed(2) > 0 ? $(item).show() && count++ : $(item).hide()
						} else if (operator == '<') {
							Number(diffPrice) - Number(diffPriceVal).toFixed(2) < 0 ? $(item).show() && count++ : $(item).hide()
						}
						(operator == '=' || operator == '>' || operator == '<') && $("#tolnum_span_smt_price").text(count)
					}
				})
			})
		},
		diffPriceReset: function () {
			$('#smtModifyMainPrice_reset_byLocal').click(function () {
				let trArr = $('#smtModifyPriceTable').next().find('tbody>tr')
				trArr.each(function (index, item) {
					$(item).show()
				})
				$("#tolnum_span_smt_price").text(trArr.length)
			})
		},
		// 区域调价
		batchUpadateRegionPrice: function () {
			var _this = this
			$('#smt_theShelves_batchUpadateRegionPrice').click(function () {
				_this.batchUpdateCommon(_this.AdjustPriceBtnType.regionPrice.url, _this.AdjustPriceBtnType.regionPrice.name)
			})
		},
		// 调整刊登价和区域价 
		batchUpadateBothPrice: function () {
			var _this = this
			$('#smt_theShelves_batchUpadateBothPrice').click(function () {
				_this.batchUpdateCommon(_this.AdjustPriceBtnType.mainAndRegionPrice.url, _this.AdjustPriceBtnType.mainAndRegionPrice.name)
			})
		},
		// 仅调刊登价
		batchUpadatePrice: function () {
			var _this = this
			$('#smt_theShelves_batchUpadatePrice').click(function () {
				_this.batchUpdateCommon(_this.AdjustPriceBtnType.mainPrice.url, _this.AdjustPriceBtnType.mainPrice.name)
			});
		},
		// 查询调价后的结果
		searchBatch: function (batchNo, checkedArr, type) {
			var trObj = checkedArr
			var count = 0;
			for (var i = 0; i < trObj.length; i++) {
				var checkStat = trObj[i].find('td').eq(0).find('div input').is(":checked");
				var resultMsg = trObj[i].find('td[data-field="result"] .layui-table-cell div').text();
				if ((resultMsg == '' || resultMsg == null) && checkStat) {
					count++;
				}
			}
			if (count == 0) {
				clearInterval(smtMopriceTimeUnit);
				return;
			}

			$.ajax({
				type: "POST",
				url: ctx + "/sys/selectResult.html",
				data: { 'batchNo': batchNo },
				async: true,
				dataType: "json",
				success: function (returnData) {
					if (returnData.code == "0000") {
						var data = returnData.data;
						for (var i = 0; i < trObj.length; i++) {
							var itemId = $.trim(trObj[i].find('td[data-field="itemId"]').find('div').text());//平台商品Id
							var prodStoreSku = $.trim(trObj[i].find('td[data-field="storeSubSku"]').find('div').text());//店铺sku
							var checkStat = trObj[i].find('td').eq(0).find('div').find('input').is(":checked");
							var resultMsg = trObj[i].find('td[data-field="result"]').find('.layui-table-cell').find('div').text();

							let logMsg = '';
							// 仅调刊登价
							if (type == 'mainPrice') {
								logMsg = data['SMT_MODIFY_PRICE_PROD' + prodStoreSku + itemId];
								// 调整刊登价和区域价
							} else if (type == 'mainAndRegionPrice') {
								logMsg = data['ALIEXPRESS_PRICE_REGION_PRICE/' + batchNo + '/' + itemId]
								//  仅区域调价
							} else if (type == 'regionPrice') {
								logMsg = data['ALIEXPRESS_ABSOLUTE_REGION_PRICE/' + batchNo + '/' + itemId]
							}
							if ((resultMsg == '' || resultMsg == null) && checkStat) {
								if (logMsg == '调价成功' || logMsg == '修改成功') {
									trObj[i].find('td[data-field="result"]').find('.layui-table-cell').html("<div style='color:blue'>" + logMsg + "</div>");
								} else if (logMsg != '' && logMsg != null && logMsg != 'undefined') {
									trObj[i].find('td[data-field="result"]').find('.layui-table-cell').html("<div style='color:red'>" + logMsg + "</div>");
								}
							}
						}
					}
				},
				error: function () {
					layer.msg("服务器正忙");
					clearInterval(smtMopriceTimeUnit);
				}
			});

		},
		// type按钮种类 AdjustPriceBtnType
		batchUpdateCommon: function (url, type) {
			var _this = this
			//获取表格行对象
			var trObj = $('#smtModifyPriceTable').next().find('.layui-table-body tbody').find('tr');
			if (type == 'regionPrice' || type == 'mainAndRegionPrice') {
				// 获取选中的国家
				var countryArr = []
				$('input[name=adjustPriceCountry]:checked').each(function () {
					countryArr.push($(this).val())
				})
			}
			var arr = new Array();
			var checkedArr = new Array();
			for (var i = 0; i < trObj.length; i++) {
				// 将操作结果全部清空
				trObj.eq(i).find('td[data-field="result"]').find('.layui-table-cell').find('div').text('')
				var obj = new Object();
				obj.id = $.trim(trObj.eq(i).find('td[data-field=id]').find('div').text());//id
				obj.storeAcctId = $.trim(trObj.eq(i).find('td[data-field="storeAcctId"]').find('div').text());//店铺id
				obj.storeAcct = $.trim(trObj.eq(i).find('td[data-field="storeAcct"]').find('div').text());//店铺名称
				obj.prodSSku = $.trim(trObj.eq(i).find('td[data-field="prodSSku"]').find('div').text());//子sku
				obj.storeSubSku = $.trim(trObj.eq(i).find('td[data-field="storeSubSku"]').find('div').text());//店铺子sku
				obj.storeSubId = $.trim(trObj.eq(i).find('td[data-field="storeSubId"]').find('div').text());//storeSubId
				obj.itemId = $.trim(trObj.eq(i).find('td[data-field="itemId"]').find('div').text());//itemId
				if (type == 'mainPrice' || type == 'mainAndRegionPrice') {
					obj.price = $.trim(trObj.eq(i).find('td[data-field="price"] .price').text());//价格
					obj.newPrice = $.trim(trObj.eq(i).find('input[name=adjustPrice]').val());//新价格
					obj.priceCny = $.trim(trObj.eq(i).find('td[data-field="price"] .priceCny').text());//价格
					obj.newPriceCny = $.trim(trObj.eq(i).find('input[name=adjustPriceCny]').val());//新价格
				}
				if (type == 'regionPrice' || type == 'mainAndRegionPrice') {
					obj.countryList = []
					countryArr.forEach(elem => {
						// price为空或为0 不添加
						let price = trObj.eq(i).find(`td[data-field="${elem}"] input[name=smtModifyPriceTable_${elem}]`).val()
						let priceCny = trObj.eq(i).find(`td[data-field="${elem}"] input[name=smtModifyPriceTable_${elem}_priceCny]`).val()
						if (!!price && price != 0) {
							trObj.eq(i)
							obj.countryList.push({
								price: price,
								priceCny: priceCny,
								countryCode: elem
							})
						}
					})
				}
				var checkStat = trObj.eq(i).find('td').eq(0).find('div').find('input').is(":checked");
				if (checkStat && trObj.eq(i).css('display') != 'none') {
					if (type == 'mainPrice' && (obj.price == obj.newPrice)) {
						trObj.eq(i).find('td[data-field="result"]').find('.layui-table-cell').html("<div style='color:green'>" + "与原值相同不修改" + "</div>");
					} else if (type == 'mainPrice' && (obj.newPrice == "" || obj.newPrice == "0.00" || obj.newPrice == "0")) {
						layer.msg('新刊登价不能为空或者为零')
						return false
					} else if (type == 'mainAndRegionPrice' && (obj.newPrice == "" || obj.newPrice == "0.00" || obj.newPrice == "0") && !obj.countryList.length) {
						layer.msg('新刊登价不能为空或者为零或无区域调价数据')
						return false
					} else if ((type == 'regionPrice' && obj.countryList.length) || type != 'regionPrice') {
						arr.push(obj)
						checkedArr.push($(trObj.eq(i)))
					}
				}
			}
			if (arr == null || arr.length == 0) {
				layer.msg("没有可以改价的商品！");
				return;
			}
			if (type == 'regionPrice' && arr.every(elem => elem.countryList.length == 0)) {
				layer.msg("没有可以区域调价的数据！");
				return;
			}
			var paramsHeader
			if (type == 'mainPrice') {
				//以当前时间戳作为批次号
				var batchNo = new Date().getTime();
				paramsHeader = {
					params: { 'prodObj': JSON.stringify(arr), 'batchNo': batchNo }
				}
			} else {
				paramsHeader = {
					params: JSON.stringify(arr),
					contentType: 'application/json',
				}
			}

			commonReturnPromise({
				url: url,
				type: 'post',
				...paramsHeader,
			}).then(res => {
				clearInterval(smtMopriceTimeUnit);
				layer.msg('处理中，请稍等...')
				smtMopriceTimeUnit = setInterval(function () {
					_this.searchBatch(type == 'mainPrice' ? batchNo : res, checkedArr, type)
				}, 5000);
			})
		},
		fetchPromotionInfoAjax: function (storeAcctId = '') {
			return commonReturnPromise({
				type: 'post',
				url: ctx + "/onlineProductSmt/getPromotionInfo.html",
				params: storeAcctId ? { storeAcctId } : "",
			})
		},
		fetchFreightTplInfoAjax: function (storeAcctId = '') {
			return commonReturnPromise({
				url: ctx + "/onlineProductSmt/getMsgFreightTemplateSmtList.html",
				params: storeAcctId ? { storeAcctId } : "",
			})
		},
		fixPriceAjax: function (data) {
			return commonReturnPromise({
				url: ctx + `/batchOperation/fixPrice`,
				type: 'post',
				params: JSON.stringify(data),
				contentType: 'application/json',
			});
		},
		fetchRegionPriceAjax: function (data) {
			return commonReturnPromise({
				url: ctx + '/aliexpress/publish/regionPriceFixPriceByShipType',
				type: 'post',
				params: JSON.stringify(data),
				contentType: 'application/json;charset=UTF-8'
			})
		}
	}

	var data = new Object();
	if (smt_arr.length > 0) {
		data.idList = [];
		for (var i = 0; i < smt_arr.length; i++) {
			data.idList.push(smt_arr[i].id);
		}
		data.idList = data.idList.join(",");
	}
	if (smt_arr.length > 0) {
		tableReload(data, true);
	}
	async function tableReload (data, isNewData) {
		// 区域国家
		await smtModifyMainPriceName.fetchCountryList()
		commonReturnPromise({
			type: "post",
			url: ctx + "/batchOperation/getModifyMainPrice.html",
			params: { ...data },
		}).then(res => {
			let params = {}
			let formDom = $("#smt_theShelves_searchForm")
			params.grossProfitRate = formDom.find("input[name=grossProfitRate]").val() //折扣率
			params.discountRate = formDom.find("input[name=discountRate]").val() //优惠幅度
			params.shippingType = formDom.find("select[name=shippingType]").val() //定价方式
			params.skuDtoList = res.map(item => ({
				prodSSku: item.prodSSku, // 子sku
				storeAcctId: item.storeAcctId, //店铺id
				freightTemplateId: item.freightTemplateId, //物流模板id
				storeSubSku: item.storeSubSku, //店铺子sku
			}))
			smtModifyMainPriceName.tableRender(res, isNewData)
			//区域国家 渲染选中的数据
			let shiptoCountrys = res.map(item => Array.isArray(item.skuRegionPriceDataList) && item.skuRegionPriceDataList.map(elem => elem.shiptoCountry)).flat(Infinity)
			Array.from(new Set(shiptoCountrys)).forEach(item => {
				$("#smt_theShelves_countryList").find(`input[name=adjustPriceCountry][value="${item}"]`).prop("checked", true)
			})
			form.render()
		})
		
	}

	//初始化 
	smtModifyMainPriceName.getExchangeRate()
	smtModifyMainPriceName.fetchPromotionInfo()
	smtModifyMainPriceName.fetchFreightTplInfo()
	smtModifyMainPriceName.hideOrShowCountryCard()
	smtModifyMainPriceName.countrySelLinkage()

	// 仅刊登价
	smtModifyMainPriceName.batchUpadatePrice()
	// 区域调价
	smtModifyMainPriceName.batchUpadateRegionPrice()
	//调整刊登价和区域价
	smtModifyMainPriceName.batchUpadateBothPrice()

	//选中国家触发事件
	smtModifyMainPriceName.checkCountry()
	smtModifyMainPriceName.checkAllCountry()

	// 批量估算价格
	smtModifyMainPriceName.batchEstimateRegionPrice()

	// 批量勾选--table --只修改已有值
	smtModifyMainPriceName.checkAllhasVal()

	// 联动
	smtModifyMainPriceName.storeLinkage()

	// 定价
	smtModifyMainPriceName.fixPrice()

	// 差价查询
	smtModifyMainPriceName.diffPriceSearch()

	// 差价清空
	smtModifyMainPriceName.diffPriceReset()

	var active = {
		reload: function () {
			var data = new Object();
			data.storeAcctIdList = [];
			data.sSkuList = [];
			data.pSkuList = [];
			var logisAttrContents = formSelects.value("smt_modifyMainPrice_store");
			for (var i = 0; i < logisAttrContents.length; i++) {
				var logisAttr = logisAttrContents[i].value;
				data.storeAcctIdList.push($.trim(logisAttr));
			}
			var skuStr = $.trim($("#smt_theShelves_searchForm input[name='skuList']").val());
			if ($("#smtModPrice_is_pAnds_sku").val() == 0) {
				if (skuStr != "" && skuStr != null) {
					data.sSkuList = $.trim(skuStr.split(","));
				}
			} else {
				if (skuStr != "" && skuStr != null) {
					data.pSkuList = $.trim(skuStr.split(","));
				}
			}

			data.storeAcctIdList = $.trim(data.storeAcctIdList);
			var salepersonId = $.trim($("#smt_theShelves_searchForm select[name='saleName']").val());
			data.salepersonId = salepersonId;
			data.orgId = $.trim($("#smt_theShelves_searchForm select[name='orgId']").val());
			data.searchType = $("#smt_idEnable_skuSearchType").val();//搜索类型
			data.promotionIdList = formSelects.value('smt_modifyMainPrice_discount', 'valStr');    //单品折扣
			data.freightTemplateIdList = formSelects.value('smt_modifyMainPrice_freightTpl', 'valStr');    //运费模板
			if (!(data.pSkuList.length || data.sSkuList.length) && !data.promotionIdList && !data.freightTemplateIdList) return layer.msg('子SKU,单品折扣,运费模板这三项须有一个有值')
			tableReload(data, true);
		}
	};

	$("#smtModifyPirceSearchBtn").click(function () {
		// 将选中区域定价的国家设为未选中
		$('#smt_theShelves_countryList').find('input[name=adjustPriceCountry]').prop('checked', false)
		form.render()
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});
	$("#smtModifyPirceResetBtn").click(function () {
		$("#smt_theShelves_searchForm input[name='sSku']").val('');
		formSelects.value('selectAttr', [])
	});


	//校验价格输入不能低于0

	$('input[name="newPriceInput"]').change(function () {
		if (parseFloat($(this).val()) < 0) {
			$(this).val("");
		}
	});
	/**
	 * 一键写入价格值
	 */
	$("#newPriceBtn").click(function () {
		var checkStatus = table.checkStatus('smtModifyPriceTable');
		if (checkStatus.data.length > 0 && smttableIns) {
			var layFilterIndex = 'LAY-table-' + smttableIns.config.index;
			var tableContainer = $('div[lay-filter="' + layFilterIndex + '"]');
			var newPrice = $("#applyForm input[name='newPriceInput']").val();
			//获取表格行对象
			var calType = $("#applyForm select[name='calculateType']").val()
			var priceType= $("#applyForm select[name='priceType']").val()
			if (newPrice !== '') {
				tableContainer.find('tbody').find('input[name="layTableCheckbox"]:checked').each(function () {
					var tr = $(this).parents('tr');
					const basicPriceObj = {
						curPrice: tr.find('td[data-field="price"] .price').text(),
						curPriceCny: tr.find('td[data-field="price"] .priceCny').text(),
						newPrice: tr.find('input[name=adjustPrice]').val(),
						newPriceCny: tr.find('input[name=adjustPriceCny]').val(),
					}
					if(priceType.includes('Cny')){
						tr.find('input[name=adjustPriceCny]').val(calculatePrice(basicPriceObj[priceType],calType, newPrice))			
						smtModifyPriceTable_newPriceCnyBlur(tr.find('input[name=adjustPriceCny]'))
					}else{
						tr.find('input[name=adjustPrice]').val(calculatePrice(basicPriceObj[priceType],calType, newPrice))			
						smtModifyPriceTable_newPriceBlur(tr.find('input[name=adjustPrice]'))
					}
					// 价格联动
					
				});
				// smtModifyMainPriceName.dealData()
				smtModifyMainPriceName.isNeedNewPriceLayer && layer.msg('价格调整不得低于0');
				smtModifyMainPriceName.isNeedNewPriceLayer = false
			} else {
				layer.msg('请输入调整的价格');
			}
		} else {
			layer.msg('请选择需要调价的商品')
		}

	});
	//选自对应计算类型计算修改后的价格
	function calculatePrice(xParams,calType,yParams){
		let result = '' 
		if(calType==1){
			result = (parseFloat(xParams) + parseFloat(yParams)).toFixed(2);
		}else if(calType==2){
			result = (parseFloat(xParams) - parseFloat(yParams)).toFixed(2);
			smtModifyMainPriceName.isNeedNewPriceLayer =false
			if (+result < 0) {
				result=''
				smtModifyMainPriceName.isNeedNewPriceLayer = true
			}	
		}else if(calType==3){
			result = (parseFloat(xParams) * parseFloat(yParams)).toFixed(2);
		}else if(calType==4){
			result = parseFloat(yParams).toFixed(2);
		}
		return result		
	}
});

//#region 失焦 价格联动
// smtModifyMainPriceName.priceBlur()
function smtModifyPriceTable_newPriceBlur(dom) {
	let targetNode = $(dom).parents('tr')
	const newPriceCny = $(dom).val() ==='' ? '' :  ($(dom).val()*SmtModifyMainPrice_exchangeRate).toFixed(2)
	targetNode.find('input[name=adjustPriceCny]').val(newPriceCny)
	smtModifyPriceTable_getDiffPrice(targetNode)
	$(dom).parents('td').css('background', 'transparent')
}

function smtModifyPriceTable_newPriceCnyBlur(dom) {
	let targetNode = $(dom).parents('tr')
	const newPrice = $(dom).val() ==='' ? '' :  ($(dom).val()/SmtModifyMainPrice_exchangeRate).toFixed(2)
	targetNode.find('input[name=adjustPrice]').val(newPrice)
	smtModifyPriceTable_getDiffPrice(targetNode)
	$(dom).parents('td').css('background', 'transparent')
}

function smtModifyPriceTable_areaPriceBlur(dom){
	let targetNode = $(dom).parents('tr')
	const code = $(dom).data('code')
	const areaPriceCny = $(dom).val() ==='' ? '' :  ($(dom).val() * SmtModifyMainPrice_exchangeRate).toFixed(2)
	targetNode.find(`input[name=smtModifyPriceTable_${code}_priceCny]`).val(areaPriceCny)
}

function smtModifyPriceTable_areaPriceCnyBlur(dom){
	let targetNode = $(dom).parents('tr')
	const code = $(dom).data('code')
	const areaPrice = $(dom).val() ==='' ? '' : ($(dom).val() / SmtModifyMainPrice_exchangeRate).toFixed(2)
	targetNode.find(`input[name=smtModifyPriceTable_${code}]`).val(areaPrice)
}

// 差价 = 新刊登价 - 当前刊登价
function smtModifyPriceTable_getDiffPrice(trDom){
	// 人民币差价
	const curPriceCny = trDom.find('td[data-field=price]').find('.priceCny').text()
	const newPriceCny = trDom.find('input[name=adjustPriceCny]').val()
	const diffPriceCny = (newPriceCny - curPriceCny).toFixed(2)
	trDom.find('td[data-field=diffPrice]').find('.priceCny').text(diffPriceCny)
	// 美元差价
	const curPrice = trDom.find('td[data-field=price]').find('.price').text()
	const newPrice = trDom.find('input[name=adjustPrice]').val()
	const diffPrice = (newPrice - curPrice).toFixed(2)
	trDom.find('td[data-field=diffPrice]').find('.price').text(diffPrice)
}
 //#endregion 失焦 价格联动
//
function smtModifyPriceTable_changeRegionPriceFixPrice (dom) {
	$(dom).parents('td').css('background', 'transparent')
}
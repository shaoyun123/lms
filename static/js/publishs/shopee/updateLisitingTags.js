var shopeeUpdateListingTagsName;

layui.use(
  [
    "admin",
    "form",
    "table",
    "laydate",
    "upload",
    "element",
    "layedit",
    "formSelects",
  ],
  function () {
    var $ = layui.$,
      admin = layui.admin,
      layer = layui.layer,
      laydate = layui.laydate,
      table = layui.table,
      upload = layui.upload,
      formSelects = layui.formSelects,
      form = layui.form;
    form.render();

    // const shop_arr = [
    //   {
    //     id: 1000114364,
    //     storeAcctId: 26996,
    //     itemId: 23957738969,
    //     sid: 1000485057,
    //     variId: 194648934479,
    //     storeAcct: "80_susans.my",
    //     prodSyncSShopeeDtos: [
    //       {
    //         variId: 194648934489,
    //         prodSSku: "DZYA12A66-RG2",
    //         listingPrice: 58.13,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 5,
    //         storeSSku: "DZYA12A66-RG2*5/2HEB6",
    //         sTitle: "rose gold,Type 2-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "18.29",
    //         stockNum: 5,
    //         reservationNum: 0,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 5,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934483,
    //         prodSSku: "DZYA12A66-B3",
    //         listingPrice: 24.91,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 43,
    //         storeSSku: "DZYA12A66-B3*5/2KJF6",
    //         sTitle: "black,Type 3-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "7.84",
    //         stockNum: 43,
    //         reservationNum: 0,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 43,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934476,
    //         prodSSku: "DZYA12A66-RG2",
    //         listingPrice: 13.3,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 5,
    //         storeSSku: "DZYA12A66-RG2/BYF7J",
    //         sTitle: "rose gold,Type 2-1PC",
    //         subStock: 9999,
    //         sCurrentPrice: "4.18",
    //         stockNum: 5,
    //         reservationNum: 0,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 5,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934486,
    //         prodSSku: "DZYA12A66-B2",
    //         listingPrice: 58.13,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 15,
    //         storeSSku: "DZYA12A66-B2*5/FURWI",
    //         sTitle: "black,Type 2-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "18.29",
    //         stockNum: 15,
    //         reservationNum: 0,
    //         orderNotInNum: 20,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 35,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934480,
    //         prodSSku: "DZYA12A66-RG1",
    //         listingPrice: 24.1,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 10,
    //         storeSSku: "DZYA12A66-RG1*5/QBA0A",
    //         sTitle: "rose gold,Type 1-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "7.58",
    //         stockNum: 10,
    //         reservationNum: 0,
    //         orderNotInNum: 40,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 50,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934484,
    //         prodSSku: "DZYA12A66-G1",
    //         listingPrice: 24.91,
    //         oaAvailableStock: 8887,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 187,
    //         storeSSku: "DZYA12A66-G1*5/66Q0S",
    //         sTitle: "gold,Type 1-5PCS",
    //         subStock: 8887,
    //         sCurrentPrice: "7.84",
    //         stockNum: 193,
    //         reservationNum: 6,
    //         orderNotInNum: 840,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 1027,
    //         sellerNormalStock: 8887,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 187098727301,
    //         prodSSku: "DZYA12A66-B2",
    //         listingPrice: 13.3,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 15,
    //         storeSSku: "DZYA12A66-B2/WXXXB",
    //         sTitle: "black,Type 2-1PC",
    //         subStock: 9999,
    //         sCurrentPrice: "4.18",
    //         stockNum: 15,
    //         reservationNum: 0,
    //         orderNotInNum: 20,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 35,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934491,
    //         prodSSku: "",
    //         listingPrice: 13.3,
    //         oaAvailableStock: 0,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 0,
    //         storeSSku: "无sku",
    //         sTitle: "rose gold,Type 3-5PCS",
    //         subStock: 0,
    //         sCurrentPrice: "7.87",
    //         stockNum: 0,
    //         reservationNum: 0,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 0,
    //         sellerNormalStock: 0,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934490,
    //         prodSSku: "DZYA12A66-S2",
    //         listingPrice: 58.13,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 27,
    //         storeSSku: "DZYA12A66-S2*5/09539",
    //         sTitle: "silver,Type 2-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "18.29",
    //         stockNum: 27,
    //         reservationNum: 0,
    //         orderNotInNum: 40,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 67,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934492,
    //         prodSSku: "",
    //         listingPrice: 13.3,
    //         oaAvailableStock: 0,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 0,
    //         storeSSku: "无sku",
    //         sTitle: "bronze,Type 3-5PCS",
    //         subStock: 0,
    //         sCurrentPrice: "7.87",
    //         stockNum: 0,
    //         reservationNum: 0,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 0,
    //         sellerNormalStock: 0,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 187098727303,
    //         prodSSku: "DZYA12A66-G2",
    //         listingPrice: 13.3,
    //         oaAvailableStock: 8887,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 30,
    //         storeSSku: "DZYA12A66-G2/BEHAC",
    //         sTitle: "gold,Type 2-1PC",
    //         subStock: 8887,
    //         sCurrentPrice: "4.18",
    //         stockNum: 30,
    //         reservationNum: 0,
    //         orderNotInNum: 285,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 315,
    //         sellerNormalStock: 8887,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934477,
    //         prodSSku: "DZYA12A66-S2",
    //         listingPrice: 13.3,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 27,
    //         storeSSku: "DZYA12A66-S2/RCNAD",
    //         sTitle: "silver,Type 2-1PC",
    //         subStock: 9999,
    //         sCurrentPrice: "4.18",
    //         stockNum: 27,
    //         reservationNum: 0,
    //         orderNotInNum: 40,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 67,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 187098727302,
    //         prodSSku: "DZYA12A66-F2",
    //         listingPrice: 13.3,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 15,
    //         storeSSku: "DZYA12A66-F2/EAM8K",
    //         sTitle: "bronze,Type 2-1PC",
    //         subStock: 9999,
    //         sCurrentPrice: "4.18",
    //         stockNum: 15,
    //         reservationNum: 0,
    //         orderNotInNum: 30,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 45,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934488,
    //         prodSSku: "DZYA12A66-G2",
    //         listingPrice: 58.13,
    //         oaAvailableStock: 8887,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 30,
    //         storeSSku: "DZYA12A66-G2*5/F3076",
    //         sTitle: "gold,Type 2-5PCS",
    //         subStock: 8887,
    //         sCurrentPrice: "18.29",
    //         stockNum: 30,
    //         reservationNum: 0,
    //         orderNotInNum: 285,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 315,
    //         sellerNormalStock: 8887,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934487,
    //         prodSSku: "DZYA12A66-F2",
    //         listingPrice: 58.13,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 15,
    //         storeSSku: "DZYA12A66-F2*5/1YKX3",
    //         sTitle: "bronze,Type 2-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "18.29",
    //         stockNum: 15,
    //         reservationNum: 0,
    //         orderNotInNum: 30,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 45,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934485,
    //         prodSSku: "DZYA12A66-S1",
    //         listingPrice: 24.91,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 69,
    //         storeSSku: "DZYA12A66-S1*5/CPC5T",
    //         sTitle: "silver,Type 1-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "7.84",
    //         stockNum: 74,
    //         reservationNum: 5,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 69,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //     ],
    //     listingTagInfoList: [
    //       {
    //         id: 2078,
    //         headCode: "SHOPEE_ONLINE_LISTING_TAG",
    //         name: "商品标签4",
    //         code: "4",
    //         sort: 4,
    //         note: "测试说明",
    //         extend1: "4",
    //         extend2: "4",
    //         status: true,
    //         createTime: 1687231005000,
    //         creatorId: 1227,
    //         creator: "周恩泽",
    //         modifyTime: 1695449974000,
    //         modifierId: 1227,
    //         modifier: "周恩泽",
    //         itemId: 23957738969,
    //         tagAddTime: 1700460484000,
    //         tagAddDays: 0,
    //       },
    //     ],
    //   },
    //   {
    //     id: 10001143644,
    //     storeAcctId: 269964,
    //     itemId: 239577389649,
    //     sid: 10004850574,
    //     variId: 1946489344794,
    //     storeAcct: "80_susans.my4",
    //     prodSyncSShopeeDtos: [
    //       {
    //         variId: 194648934479,
    //         prodSSku: "DZYA12A66-G3",
    //         listingPrice: 24.0,
    //         oaAvailableStock: 8887,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 96,
    //         storeSSku: "DZYA12A66-G3*5/QDDDV",
    //         sTitle: "gold,Type 3-5PCS",
    //         subStock: 8887,
    //         sCurrentPrice: "7.55",
    //         stockNum: 96,
    //         reservationNum: 0,
    //         orderNotInNum: 110,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 206,
    //         sellerNormalStock: 8887,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934481,
    //         prodSSku: "DZYA12A66-S3",
    //         listingPrice: 23.9,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 47,
    //         storeSSku: "DZYA12A66-S3*5/JDY35",
    //         sTitle: "silver,Type 3-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "7.54",
    //         stockNum: 47,
    //         reservationNum: 0,
    //         orderNotInNum: 15,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 62,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //       {
    //         variId: 194648934482,
    //         prodSSku: "DZYA12A66-B1",
    //         listingPrice: 24.91,
    //         oaAvailableStock: 9999,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 40,
    //         storeSSku: "DZYA12A66-B1*5/QL8T6",
    //         sTitle: "black,Type 1-5PCS",
    //         subStock: 9999,
    //         sCurrentPrice: "7.84",
    //         stockNum: 45,
    //         reservationNum: 5,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 40,
    //         sellerNormalStock: 9999,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //         listingTagInfoList: [
    //           {
    //             id: 2078,
    //             headCode: "SHOPEE_ONLINE_LISTING_TAG",
    //             name: "商品标签4",
    //             code: "4",
    //             sort: 4,
    //             note: "测试说明",
    //             itemId: 23957738969,
    //             variationId: 194648934482,
    //             tagAddTime: 1700460543000,
    //             tagAddDays: 0,
    //           },
    //         ],
    //       },
    //       {
    //         variId: 194648934478,
    //         prodSSku: "DZYA12A66-F1",
    //         listingPrice: 24.1,
    //         oaAvailableStock: 8887,
    //         isOffline: false,
    //         totalReservedStock: 0,
    //         preAvailableStock: 47,
    //         storeSSku: "DZYA12A66-F1*5/OANBP",
    //         sTitle: "bronze,Type 1-5PCS",
    //         subStock: 8887,
    //         sCurrentPrice: "7.58",
    //         stockNum: 47,
    //         reservationNum: 0,
    //         orderNotInNum: 0,
    //         lackReservationNum: 0,
    //         lackUnPaiNum: 0,
    //         preAvailableStockAll: 47,
    //         sellerNormalStock: 8887,
    //         shopeeStock: 0,
    //         realCost: 0,
    //         realWeight: 0,
    //         sevenSales: 0,
    //         thirtySales: 0,
    //         sixtySales: 0,
    //         ninetySales: 0,
    //       },
    //     ],
    //   },
    // ];
    // let mergeRowIndex = 0;

    shopeeUpdateListingTagsName = new Vue({
      el: "#LAY-shopeeUpdateListingTags",
      data() {
        return {
          tableData: [],
          allCheckedProduct: true,
          allCheckedVariation: false,
          listingTagInfoList: [], // 标签枚举
          storeFilterList: [],
          itemIdFilterList: [],
          variIdFilterList: [],
          tagFilterList: [],
          afteFilterObj: {
            storeAcct: [],
            itemId: [],
            productListingTagInfoList: [],
            variId: [],
            listingTagInfoList: [],
          },
          afterFilterDataLength: 0,
          spanArr: [],
          pos: 0,
        };
      },
      mounted() {
        this.init();
      },
      methods: {
        init() {
          const tableData = [];
          // 全部item_id列默认选中&全部vari_id列默认不选中
          shop_arr.forEach((v) => {
            v.prodSyncSShopeeDtos = v.prodSyncSShopeeDtos || [];
            v.prodSyncSShopeeDtos.forEach((item, index) => {
              tableData.push({
                variId: item.variId || "",
                itemId: v.itemId,
                itemIdVariId: v.itemId.toString() + (v.variId || "").toString(),
                productListingTagInfoList: v.listingTagInfoList || [],
                listingTagInfoList: item.listingTagInfoList || [],
                storeAcct: v.storeAcct,
                storeAcctId: v.storeAcctId,
                checkedProduct: true,
                checkedVariation: false,
                prodSyncSShopeeDtosLength:
                  index === 0 ? v.prodSyncSShopeeDtos.length : 0,
              });
            });
          });
          this.tableData = tableData;
          // this.afterFilterDataLength = tableData.length;
          // this.getSpanArr(this.tableData);
          // this.filterTableData = [];
          // this.storeFilterList = _.uniqBy(
          //   shop_arr.map((v) => ({
          //     text: v.storeAcct,
          //     value: v.storeAcct,
          //   })),
          //   "value"
          // );
          // this.itemIdFilterList = _.uniqBy(
          //   shop_arr.map((v) => ({
          //     text: v.itemId,
          //     value: v.itemId,
          //   })),
          //   "value"
          // );
          // this.variIdFilterList = _.uniqBy(
          //   tableData
          //     .filter((v) => v.variId)
          //     .map((v) => ({
          //       text: v.variId,
          //       value: v.variId,
          //     })),
          //   "value"
          // );

          this.$nextTick(() => {
            commonReturnPromise({
              url: "/lms/sysdict/getShopeeListingTag",
            }).then((res) => {
              this.listingTagInfoList = res.map((v) => ({
                ...v,
                value: v.id,
              }));
              this.tagFilterList = _.uniqBy(
                res.map((v) => ({
                  text: v.name,
                  value: v.name,
                })),
                "value"
              );
              formSelects.data("shopeeUpdateListingTags_tags", "local", {
                arr: this.listingTagInfoList,
              });
            });
          });
        },
        // #region checkbox联动
        // 全选/全不选 Product; （取消）选中product，默认（取消）选中全部variation
        handleCheckedProduct(row) {
          const { checkedProduct, itemId } = row;
          this.tableData.forEach((v) => {
            if (v.itemId === itemId) {
              v.checkedVariation = checkedProduct;
            }
          });
          this.updateAllCheckbox();
        },
        handleAllCheckedProduct(value) {
          this.allCheckedVariation = value;
          this.tableData.forEach((v) => {
            v.checkedProduct = value;
            v.checkedVariation = value;
          });
        },
        updateAllCheckbox() {
          //   item_id 表头checkbox
          const isCheckAllProdcut = this.tableData.every(
            (v) => v.checkedProduct
          );
          this.allCheckedProduct = isCheckAllProdcut;
          //   Variation 表头checkbox
          const isCheckAllVariation = this.tableData
            .filter((v) => v.variId)
            .every((v) => v.checkedVariation);
          this.allCheckedVariation = isCheckAllVariation;
        },
        // 全选/全不选 Variation; 选中子s ku时，product自动选中；仅取消选中variation时无联动
        handleCheckedVariation(row) {
          this.tableData.forEach((v) => {
            if (row.itemId == v.itemId)
              v.checkedProduct = row.checkedVariation
                ? row.checkedVariation
                : v.checkedProduct;
          });
          this.updateAllCheckbox();
        },
        handleAllCheckedVariation(value) {
          this.allCheckedProduct = value ? value : this.allCheckedProduct;
          this.tableData.forEach((v) => {
            v.checkedProduct = value ? value : v.checkedProduct;
            v.checkedVariation = value;
          });
        },
        // #endregion checkbox联动

        //  #region 标签的移除添加
        handleRemoveProductTag(row, tagId) {
          // 移除product标签，variation对应的标签也需要移除
          row.productListingTagInfoList = row.productListingTagInfoList.filter(
            (v) => v.id !== tagId
          );
          this.tableData.forEach((v) => {
            if (row.itemId === v.itemId) {
              v.listingTagInfoList = v.listingTagInfoList.filter(
                (v) => v.id !== tagId
              );
            }
          });
        },

        // 移除variation标签
        handleRemoveVariationTag(row, tagId) {
          row.listingTagInfoList = row.listingTagInfoList.filter(
            (v) => v.id !== tagId
          );
        },

        // 批量添加
        handleBatchAdd() {
          // 获取选中的标签
          const tagList = formSelects.value(
            "shopeeUpdateListingTags_tags",
            "all"
          );
          const tips = this.validateData(tagList);
          if (tips) return layer.msg(tips);
          //   添加进去再去重
          this.tableData.forEach((v) => {
            if (v.checkedProduct) {
              const _productListingTagInfoList =
                v.productListingTagInfoList.concat(tagList);
              v.productListingTagInfoList = _.uniqBy(
                _productListingTagInfoList,
                "id"
              );
            }
            if (v.checkedVariation) {
              const _listingTagInfoList = v.listingTagInfoList.concat(tagList);
              v.listingTagInfoList = _.uniqBy(_listingTagInfoList, "id");
            }
          });
        },

        handleBatchRemove() {
          // 获取选中的标签
          const tagList = formSelects
            .value("shopeeUpdateListingTags_tags", "all")
            .map((v) => v.id);
          const tips = this.validateData(tagList);
          if (tips) return layer.msg(tips);
          // 若选中了variation，就不对product进行操作；对prodcut操作，只针对没有选中variation
          this.tableData.forEach((v) => {
            if (v.checkedVariation) {
              v.listingTagInfoList = v.listingTagInfoList.filter(
                (item) => !tagList.includes(item.id)
              );
            }
            if (v.checkedProduct) {
              const onlyCheckedProduct = this.tableData
                .filter((item) => item.itemId == v.itemId)
                .every((item) => !item.checkedVariation);
              if (onlyCheckedProduct) {
                v.productListingTagInfoList =
                  v.productListingTagInfoList.filter(
                    (item) => !tagList.includes(item.id)
                  );
                // product里没有的标签，variation里也需要不存在
                const productListingTagIdList = v.productListingTagInfoList.map(
                  (item) => item.id
                );
                v.listingTagInfoList = v.listingTagInfoList.filter((item) =>
                  productListingTagIdList.includes(item.id)
                );
              }
            }
          });
        },
        handleRemoveAll() {
          this.tableData.forEach((v) => {
            if (v.checkedVariation) {
              v.listingTagInfoList = [];
            }
            if (v.checkedProduct) {
              const onlyCheckedProduct = this.tableData
                .filter((item) => item.itemId == v.itemId)
                .every((item) => !item.checkedVariation);
              if (onlyCheckedProduct) {
                v.productListingTagInfoList = [];
                // product里没有的标签，variation里也需要不存在
                v.listingTagInfoList = [];
              }
            }
          });
        },
        handleAddTag(type, row) {
          const _this = this;
          let popIndex = layer.open({
            type: 1,
            title: "添加在线listing标签",
            area: ["400px", "400px"],
            content: $("#shopeeUpdateListingTags_add_tpl").html(),
            id: 'shopeeUpdateListingTags_add_tplId',
            btn: ["保存", "关闭"],
            success: function (layero, index) {
              formSelects.data("shopeeUpdateListingTagsaddTag", "local", {
                arr: _this.listingTagInfoList,
              });
            },
            yes: function (index, layero) {
              const addListingTagIdList =
                formSelects.value("shopeeUpdateListingTagsaddTag", "all") || [];
              row[type] = _.uniqBy(row[type].concat(addListingTagIdList), "id");
              if (type === "listingTagInfoList") {
                _this.tableData.forEach((v) => {
                  if (v.itemId === row.itemId) {
                    v.productListingTagInfoList = _.uniqBy(
                      v.productListingTagInfoList.concat(addListingTagIdList),
                      "id"
                    );
                  }
                });
              }
              layer.close(popIndex);
            },
          });
        },

        validateData(tagList) {
          let tips = "";
          if (!tagList.length) tips = "请选择标签";
          //   获取选中数据
          //   item_id 表头checkbox
          const hasCheckedProdcut = this.tableData.some(
            (v) => v.checkedProduct
          );
          //   Variation 表头checkbox
          const hasCheckedVariation = this.tableData.some(
            (v) => v.checkedVariation
          );
          if (!hasCheckedProdcut && !hasCheckedVariation) {
            tips = "请选择数据";
          }
          return tips;
        },
        //  #endregion 标签的移除添加

        // 保存
        handleSave() {
          // 整合数据
          const itemIdObj = {};
          this.tableData.forEach((v) => {
            if (itemIdObj[v.itemId]) {
              itemIdObj[v.itemId].variationList.push({
                variationId: v.variId,
                tagIdList: v.listingTagInfoList.map((tag) => tag.id),
              });
            } else {
              itemIdObj[v.itemId] = {
                itemId: v.itemId,
                storeAcctId: v.storeAcctId,
                tagIdList: v.productListingTagInfoList.map((v) => v.id),
                variationList: v.variId
                  ? [
                      {
                        variationId: v.variId,
                        tagIdList: v.listingTagInfoList.map((tag) => tag.id),
                      },
                    ]
                  : [],
              };
            }
          });
          const params = [];
          _.forEach(itemIdObj, function (v) {
            params.push(v);
          });
          commonReturnPromise({
            url: "/lms/shopee/onlineProductShopee/batchModifyListingTag",
            type: "post",
            contentType: "application/json",
            params: JSON.stringify(params),
          }).then((res) => {
            layer.closeAll();
            layer.msg(res, { icon: 1 });
            $("#shopee_online_search_submit").click();
          });
        },
        handleClose() {
          layer.closeAll();
        },
        // 整合数据

        // #region 筛选
        // filterHandler(value, row, column) {
        //   //   字段名
        //   const { property } = column;
        //   //   对未跨行数据不进行筛选操作
        //   const isTagColumns = [
        //     "productListingTagInfoList",
        //     "listingTagInfoList",
        //   ].includes(property);
        //   if (isTagColumns) {
        //     // 筛选存在标签的
        //     return row[property].filter((v) => v.name === value).length;
        //   } else {
        //     return row[property] === value;
        //   }
        // },
        // filterChange(filters) {
        //   const arr = [
        //     "storeAcct",
        //     "itemId",
        //     "productListingTagInfoList",
        //     "variId",
        //     "listingTagInfoList",
        //   ];
        //   arr.forEach((v) => {
        //     if (filters[v]) {
        //       this.afteFilterObj[v] = filters[v];
        //     }
        //   });
        //   const filterConditionObj = _.pickBy(
        //     this.afteFilterObj,
        //     (v) => v.length
        //   );
          // let data = this.tableData;
          // if (!_.isEmpty(filterConditionObj)) {
          //   data = this.tableData.filter((v) =>
          //     this.judgeShowRow(v, filterConditionObj)
          //   );
          // }
          
          //   this.afterFilterDataLength = data.length;
          //   this.getSpanArr(data);
        // },
        // 判断当前行是否满足
        judgeShowRow(row, filterConditionObj) {
          const isShow = _.every(filterConditionObj, (v, k) => {
            if (["storeAcct", "itemId", "variId"].includes(k)) {
              return row[k] && v.includes(row[k]);
            } else {
              const nameArr = (row[k] || []).map((item) => item.name);
              return nameArr.some((item) => v.includes(item));
            }
          });
          return isShow;
        },
        // 判断是否有variation相关的筛选条件
        judgeHasVariationFilter() {
          if (
            this.afteFilterObj.variId.length ||
            this.afteFilterObj.listingTagInfoList.length
          ) {
            return true;
          }
          return false;
        },
        // #endregion 筛选
        // getSpanArr(data) {
        //   console.log('data :>> ', data);
        //   // data就是我们从后台拿到的数据
        //   this.spanArr = [];
        //   this.pos = 0;
        //   for (var i = 0; i < data.length; i++) {
        //     if (i === 0) {
        //       this.spanArr.push(1);
        //     } else {
        //       // 判断当前元素与上一个元素是否相同
        //       if (data[i].itemId === data[i - 1].itemId) {
        //         this.spanArr[this.pos] += 1;
        //         this.spanArr.push(0);
        //       } else {
        //         this.spanArr.push(1);
        //         this.pos = i;
        //       }
        //     }
        //   }
        //   console.log("this.spanArr :>> ", this.spanArr);
        // },
        // 跨行
        objectSpanMethod({ columnIndex, row, column, rowIndex }) {
          if ([0, 1, 2].includes(columnIndex)) {
            return {
              // [0,0] 表示这一行不显示， [2,1]表示行的合并数
              rowspan: row.prodSyncSShopeeDtosLength,
              colspan: 1,
            };
          }
        },
      },
    });
  }
);

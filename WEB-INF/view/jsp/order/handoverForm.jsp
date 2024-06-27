<%@ page import="java.util.*" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="permTag" uri="/WEB-INF/tld/permTag.tld" %>
<html>
<head>
    <title>打印交接单</title>
    <style>
        #handoverApp {
            width: 600px;
            margin: 0 auto;
            overflow: hidden;
            padding: 10px;
            box-sizing: border-box;
            position: relative;
        }
        #handoverApp > h1 {
            margin: 0 auto;
            width: 200px;
            text-align: center;
            margin-bottom: 5px;
        }
        #handoverApp div {
            font-size: 22px;
        }
        #handoverApp > .deliverDate {
            display: flex;
        }
        .handoverMl20 {
            margin-left: 20px;
        }
        .handoverContain {
            line-height: 38px;
        }
        #handoverApp>.sortCode {
            font-size: 32px;
        }
        #handoverApp .batchNo{
            position: absolute;
            right: 160px;
            font-size: 32px;
            top: 360px;
        }
    </style>
</head>
<body>
<div id="handoverApp">
    <h1>交接单</h1>
    <div class="deliverDate handoverContain">
        <span>发货日期:</span>
        <span class="handoverMl20">${createTimeStr}</span>
    </div>
    <div class="logisCompany handoverContain">
        <span>物流公司:</span>
        <span class="handoverMl20">${logisCompany}</span>
    </div>
    <div class="logisWay handoverContain">
        <div class="logisWay-content">
            <img id="logisWay-jsBarcode" src="${barcode}"/>
        </div>
    </div>
    <div class="sortCode">
        <span>分拣码:</span>
        <span class="handoverMl20">${pickNumber}</span>
    </div>
    <div class="orderNum handoverContain">
        <span>包裹数量:</span>
        <span class="handoverMl20">${orderNum}</span>
    </div>
    <div class="batchNo">${failSign}</div>
    <div class="totalWeight handoverContain">
        <span>总重量:</span>
        <span class="handoverMl20">${totalWeight}</span>
    </div>
    <div class="sortMouth handoverContain">
        <span>格口号:</span>
        <span class="handoverMl20">${sortMouth}</span>
    </div>
</div>
</body>
</html>

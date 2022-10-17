"use strict";

//Ascending Comparator
function compareA(a, b) {
  let val1 = a["d__2022sale"] - a["d__2021sale"];
  let val2 = b["d__2022sale"] - b["d__2021sale"];
  return val1 - val2;
}

//Descending Comparrator
function compareD(a, b) {
  let val1 = a["d__2022sale"] - a["d__2021sale"];
  let val2 = b["d__2022sale"] - b["d__2021sale"];
  return val2 - val1;
}

var chartDom = document.getElementById("graph-container");
var myChart = echarts.init(chartDom);
var option;
let profit = document.getElementById("profitValue");
let loss = document.getElementById("lossValue");
let netVal = document.getElementById("netValue");

//Starter Function
async function app(url) {
  let res = await fetch(url);
  let dataJson = await res.json();
  let arr = dataJson["data"];
  let net = 0;
  let p = 0;
  let l = 0;

  //Calculating profit,loss,sum
  //prettier-ignore
  arr.forEach(ele=>{
    if(ele["d__2022sale"]-ele["d__2021sale"]>=0){
      p=ele["d__2022sale"]-ele["d__2021sale"];
    } else{
      l+=ele["d__2022sale"]-ele["d__2021sale"];
    }
    net+=ele["d__2022sale"]-ele["d__2021sale"];
  })

  let x = [];
  let base = [];
  let increment = [];
  let decrement = [];
  if (net >= 0) {
    arr.sort(compareD);
  } else {
    arr.sort(compareA);
  }
  //Making data array for plotting graph
  let sum = 0;
  arr.forEach(function (ele) {
    if (ele["d__2022sale"] - ele["d__2021sale"] >= 0) {
      base.push(sum);
      sum += ele["d__2022sale"] - ele["d__2021sale"];
      increment.push(ele["d__2022sale"] - ele["d__2021sale"]);
      decrement.push("-");
    } else {
      sum += ele["d__2022sale"] - ele["d__2021sale"];
      base.push(sum);
      increment.push("-");
      decrement.push(-(ele["d__2022sale"] - ele["d__2021sale"]));
    }
    x.push(ele["subcategory"]);
  });
  //Adding profit,loss,net value in side component
  profit.innerHTML = p;
  loss.innerHTML = l;
  netVal.innerHTML = net;
  if (net >= 0) {
    x.push("Net");
    base.push(0);
    increment.push(net);
    decrement.push("-");
  } else {
    x.unshift("Net");
    base.unshift(0);
    increment.push("-");
    decrement.push(net);
  }
  option = {
    legend: {},
    title: {
      text: "Accumulated Waterfall Chart",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params) {
        var tar = params[1];
        return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      splitLine: { show: false },
      data: x,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        stack: "all",
        itemStyle: {
          borderColor: "rgba(0,0,0,0)",
          color: "rgba(0,0,0,0)",
        },
        emphasis: {
          itemStyle: {
            borderColor: "rgba(0,0,0,0)",
            color: "rgba(0,0,0,0)",
          },
        },

        data: base,
      },
      {
        name: "Profit",
        type: "bar",
        stack: "all",
        data: increment,
      },
      {
        name: "Loss",
        type: "bar",
        stack: "all",
        data: decrement,
        itemStyle: {
          color: "#f33",
        },
      },
    ],
  };

  option && myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}
app("https://run.mocky.io/v3/e2ffac92-48e0-4826-a59f-bf76fc727383");

var countryNum;//0 ; 1表示威胁国家来源(全部 其他)；
var globalcountry;//
var interval;//
$(function () {
    getdatas();
    setInterval("getdatas()", 900000);
});
function getdatas() {
    getAlertMap();
}

//各节点威胁数量
function getEachThreatNum(){
	var param = JSON.stringify({});
	$.ajax({
		type: "post",
		url: "/global/eachthreatnum",
		data: {'param': param},
		dataType: 'json',
		success: function (data) {
//			console.log();
			if( data != null && data.data != null && data.data.length > 0) {
				var restr = "";
				for (var i=0;i<data.data.length;i++){
					ff = i + 1;
					var obj = data.data[i];
					var name = obj.name;
					var num = obj.number;
					restr += "<tr>"+
					"<td class='wrap'>"+ff+"</td>"+
					"<td class='wrap'>"+name+"</td>"+
					"<td class='wrap'>"+num+"</td>"+
					"</tr>";
				}
				$("#nums").html(restr);
			}else{
				$("#nums").html("<tr><td colspan='3' align='center'>暂无数据</td></tr>")
			}
		},
		error: function (data){
			alert(data.status);
		}
	});
}
function getAlertMap(){
	var myChart = echarts.init(document.getElementById('echarts-map1-chart'));
	//以下应为后台传递过来的数据
	var fromto = [
		{fromcountry:'澳大利亚',fromcoord:[133.775136,-25.274398],tocountry:'中国',tocoord:[104.195397,35.86166]},
		{fromcountry:'澳大利亚',fromcoord:[150.775136,-30.274398],tocountry:'中国',tocoord:[104.195397,35.86166]},
		{fromcountry:'美国',fromcoord:[-122,37],tocountry:'中国',tocoord:[104.195397,35.86166]},
		{fromcountry:'阿联酋',fromcoord:[53.847818,23.424076],tocountry:'中国',tocoord:[104.195397,35.86166]},
		{fromcountry:'西班牙',fromcoord:[-3.74922,40.46366700000001],tocountry:'中国',tocoord:[104.195397,35.86166]},
		{fromcountry:'日本',fromcoord:[138.252924,36.204824],tocountry:'中国',tocoord:[104.195397,35.86166]},
		{fromcountry:'南非',fromcoord:[22.937506,-30.559482],tocountry:'中国',tocoord:[104.195397,35.86166]}
	];

	var convertData = function (data) {
		var res = [];
		var fromCoord = data.fromcoord;
		var toCoord = data.tocoord;
		if(fromCoord && toCoord){
			 res.push({
				 fromName:data.fromcountry,
				 toName:data.tocountry,
				 coords:[fromCoord,toCoord]
			 });
		 }
		return res;
	};
	var markData = function (data) {
		var markres = [];
		var fromCoord = data.fromcoord;
		if(fromCoord){
			markres.push(fromCoord);
		}
	return markres;
	}
	var localData = function (data) {
		var localres = [];
		var toCoord = data=tocoord;
		if(toCoord){
			localres.push(toCoord);
		}
	return localres;
	}
	//将serise改为动态获取
	var series = [];
	fromto.forEach(function(item,i){
		series.push(//点到点连线
				{
					name: item.fromcountry,
					type: 'lines',
					zlevel: 1,
					effect: {
			            show: true,
			            period: 6,
			            trailLength: 0.8,
			            color: '#000000',
			            symbolSize: 3
			        },
			        lineStyle: {
			            normal: {
			                color: '#000000',
			                width: 0.1,
			                opacity:0,
			                curveness: 0.2//维度
			            }
			        },
			        tooltip: {
			        	trigger: 'item',
				        formatter : function (params) {
				        		return params.seriesName + ' -> 中国';
				        }
			        },
			        //修改data为动态获取
			        data: convertData(item)
				},
					//起始地标识
				{
					name: item.fromcountry,
					type: 'effectScatter',
					coordinateSystem: 'geo',
					zlevel: 2,
					rippleEffect: {
						brushType: 'stroke'
					},
					label: {
						normal: {
							show:true,
							position: 'right',
							formatter: item.fromcountry  //动态获取
						}
					},
					symbolSize: 10,
					itemStyle: {
			            normal: {
			                areaColor:'#fff',
			                color: '#f6d23b'
			            }
			        },
			        //动态获取
			        data: markData(item)
				});
	});
	series.push(
		//目的地标识
		{
			name: '中国',
			type: 'effectScatter',
			coordinateSystem: 'geo',
			zlevel: 3,
			rippleEffect: {
				brushType: 'stroke'
			},
			label: {
				normal: {
					show:true,
					position: 'right',
					formatter: '中国'  //动态获取
				}
			},
			symbolSize: 10,
			itemStyle: {
	            normal: {
	                areaColor:'#fff',
	                color: '#f6d23b'
	            }
	        },
	        //动态获取--中国经纬度
	        data: [[104.195397,35.86166]]
		});
	var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter : function (params) {
		        	if(params.seriesName != '中国'){
		        		return params.seriesName + ' -> 中国';
		        	}
		        }
		    },
		    geo: {
		    	map: 'world',
		    	label: {
					emphasis: {
						show: false
					}
				},
				roam: false,
				zoom:1.2,
				mapLocation: {
	                y : 60
	            },
				itemStyle: {
					normal: {
						areaColor: '#0099CC',
						borderColor: '#DDDDDD',
						borderWidth: 1,
					},
					emphasis: {
						areaColor: '#0099FF'
					}
				}
		    },
			series: series,
		};
	myChart.setOption(option);
	window.addEventListener("resize",function(){
        myChart.resize();
});
}

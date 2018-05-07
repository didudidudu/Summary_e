$(function() {
	getdatas();
	getdatas1(); 
});
function getdatas() {
	$.ajax({
		type : "post",
		url : "http://localhost:8080/monitor",
		data : {
			'action' : 'getclusterhealth'
		},
		dataType : 'json',
		success : function(data) {
			// alert(JSON.stringify(data));
			if (data != null && data != '') {
				var rekey = "<tr class='gradeX'>";
				var reval = "<tr class='gradeX'>";
				for ( var key in data) {
					var value = data[key];
					rekey += " <td align='center'>" + key + "</td> ";
					if (key == 'status') {
						reval += " <td align='center' bgcolor='" + value + "'>"
								+ value + "</td>";
					} else {
						reval += " <td align='center'>" + value + "</td>";
					}
				}
				reval += " </tr> ";
				rekey += " </tr> " + reval;
				$("#databody").html(rekey); 
				
			}
		},
		error : function(data) {
			//alert(data.status);
		}
	});
}
function getdatas1() {
	$.ajax({
		type : "post",
		url : "http://localhost:8080/monitor",
		data : {
			'action' : 'getliunx'
		},
		dataType : 'json',
		success : function(data) {
			 //alert(JSON.stringify(data));
			if (data != null && data != '') {
				var rekey = "<tr class='gradeX'>";
				var reval = "<tr class='gradeX'>";
				for ( var key in data) {
					var value = data[key];
					rekey += " <td align='center'>" + key + "</td> ";
					if (key == 'status') {
						reval += " <td align='center' bgcolor='" + value + "'>"
								+ value + "</td>";
					} else {
						reval += " <td align='center'>" + value + "</td>";
					}
					if(key=='cpuUsStates'){//CPU占用率
						//var xs= ['用户空间占用率','内核空间占用率','优先级进程占用率','空闲占用率','等待占用率','硬件中断','软件中断','实时'];
						var xs= ['','','','','','','',''];
						var st = value.split(":")[1].split(",");
						var array = new Array(xs.length) ;
						for(var j=0;j<xs.length;j++){
							array[j] = trim(st[j]).split(" ")[0];
						}   
						var CPU = echarts.init(document.getElementById('CPU'));
						var option = {
								title : {
									text: '',
									subtext: '',
									x:'center'
								},
								tooltip : {
									trigger: 'item',
									formatter: "{a} <br/>{b} : {c} ({d}%)"
								},
								legend: {
									orient: 'vertical',
									left: 'left',
									data: xs
								},
								series : [
									{
										name: 'CPU',
										type: 'pie',
										radius : '55%',
										center: ['50%', '60%'],
										data:[
										      {value:array[0], name:'用户空间占用率-'+array[0]+"%"},
										      {value:array[1], name:'内核空间占用率-'+array[1]+"%"},
										      {value:array[2], name:'优先级进程占用率-'+array[2]+"%"},
										      {value:array[3], name:'空闲占用率-'+array[3]+"%"},
										      {value:array[4], name:'等待占用率-'+array[4]+"%"},
										      {value:array[5], name:'硬件中断-'+array[5]+"%"},
										      {value:array[6], name:'软件中断-'+array[6]+"%"},
										      {value:array[7], name:'实时-'+array[7]+"%"}],
										itemStyle: {
											emphasis: {
												shadowBlur: 10,
												shadowOffsetX: 0,
												shadowColor: 'rgba(0, 0, 0, 0.5)'
											}
										}
									}
								]
							};
						CPU.setOption(option);
					}else if(key=='memStates'){
						var xs= ['空闲内存','使用内存','缓存内存'];
						var st = value.split(":")[1].split(",");
						var array = new Array(st.length) ;
						for(var j=0;j<st.length;j++){
							array[j] = trim(st[j]).split(" ")[0];
						}    
						var Memory = echarts.init(document.getElementById('Memory'));
						var option = {
								title : {
									text: '',
									subtext: '',
									x:'center'
								},
								tooltip : {
									trigger: 'item',
									formatter: "{a} <br/>{b} : {c} ({d}%)"
								},
								legend: {
									orient: 'vertical',
									left: 'left',
									data: xs
								},
								series : [
									{
										name: '内存',
										type: 'pie',
										radius : '55%',
										center: ['50%', '60%'],
										data:[
											{value:array[1], name:'空闲内存'},
											{value:array[2], name:'使用内存'}, 
											{value:array[3], name:'缓存内存'}
										],
										itemStyle: {
											emphasis: {
												shadowBlur: 10,
												shadowOffsetX: 0,
												shadowColor: 'rgba(0, 0, 0, 0.5)'
											}
										}
									}
								]
							};
						Memory.setOption(option);
					}else if(key=='filesSystemStates'){
						var xs= ['已使用','未使用'];
						var st = value.split(":")[1].split(","); 
						var array = new Array(st.length) ;
						for(var j=0;j<st.length;j++){ 
							array[j] = trim(st[j]).split(" ")[1];
						}     
						var disk = echarts.init(document.getElementById('disk'));
						var option = {
								title : {
									text: '',
									subtext: '',
									x:'center'
								},
								tooltip : {
									trigger: 'item',
									formatter: "{a} <br/>{b} : {c} ({d}%)"
								},
								legend: {
									orient: 'vertical',
									left: 'left',
									data: xs
								},
								series : [
									{
										name: '磁盘',
										type: 'pie',
										radius : '55%',
										center: ['50%', '60%'],
										data:[
											{value:array[1].substring(0,array[1].length-1), name:'已使用'}, 
											{value:array[2].substring(0,array[2].length-1), name:'未使用'}
										],
										itemStyle: {
											emphasis: {
												shadowBlur: 10,
												shadowOffsetX: 0,
												shadowColor: 'rgba(0, 0, 0, 0.5)'
											}
										}
									}
								]
							};
						disk.setOption(option);
					}
				}
				reval += " </tr> ";
				//rekey += " </tr> " + reval;
				$("#databody1").html(reval);
			}
		},
		error : function(data) {
			//alert(data.status);
		}
	});
} 
function trim(str) { 
  return str.replace(/(^\s*)|(\s*$)/g, ''); 
}; 

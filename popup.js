function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}



function buildPopupDom(divName, data, urlcounts) {
  var popupDiv = document.getElementById(divName);
  var tbody = document.createElement('tbody')
  var table = document.createElement("table");
  table.className = "table table-hover";
  table.appendChild(tbody);
  for (var i = 0; i < data.length; i++) {
    var site = data[i].host;
    var urlcount = data[i].count;
    var tr = document.createElement('tr');
    var siteName = document.createElement('td')
    siteName.appendChild(document.createTextNode(site));
    tr.appendChild(siteName);
    var urlNum = document.createElement('td');
    urlNum.appendChild(document.createTextNode(urlcount));
    tr.appendChild(urlNum);
    var sitePercent = document.createElement('td');
    sitePercent.appendChild(document.createTextNode((urlcount / urlcounts).toFixed(3) + " %"));
    tr.appendChild(sitePercent);
    tbody.appendChild(tr);
  }
  popupDiv.appendChild(table);
}


function createBar(datas) {
  /*
  function :
      create colum with host count array 
  param:
      datas : [{ name: host1 ,data : [host.count]}....]
  return:
      nothing
   */

  options = {
    chart: {
      renderTo: 'container',
      type: 'column'
    },
    title: {
      text: '站点访问量'
    },
    subtitle: {
      text: '统计图'
    },
    xAxis: {
      categories: ['访问数量']
    },
    yAxis: {
      min: 0,
      title: {
        text: '次'
      }
    },
    // legend: {
    //   layout: 'vertical',
    //   backgroundColor: '#FFFFFF',
    //   align: 'right',
    //   verticalAlign: 'down',
    //   // x: 200,
    //   // y: 70,
    //   floating: true,
    //   shadow: true
    // },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} 次</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 1
      }
    },
    series: datas
  };
  var chart = new Highcharts.Chart(options);

}



function createPie(datas) {

  options = {
    chart: {
      renderTo: 'piecontainer',
      plotBackgroundColor: null,
      plotBorderWidth: 1, //null,
      plotShadow: false
    },
    title: {
      text: '站点访问量占比'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        }
      }
    },
    series: [{
      type: 'pie',
      name: '浏览量百分比',
      data: datas
    }]
  };
  var chart1 = new Highcharts.Chart(options);

}

function buildTypedUrlList(divName) {

  siteInfo = {}; //object {hostname :  url_history_count }

  var getHost = function(url) {
    var host = "";
    if (typeof url == "undefined" || null == url) {
      url = window.location.href;
    }
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match) {
      host = match[1];
    }
    return host;
  }

  var hostInfo = function(hostName, vistCount) {
    this.host = hostName;
    this.count = vistCount;
  }

  var sort = function(objects) {
    var array = [];
    for (var i in objects) {
      array.push(new hostInfo(i, objects[i]));
    }
    array.sort(function(obj1, obj2) {
      return obj1.count > obj2.count ? -1 : 1
    })
    return array;
  }

  function siteInfoToBar(siteinfos) {
    var topSite = [];
    for (var i = 0; i < siteinfos.length && i < 10; i++) {
      topSite.push({
        name: siteinfos[i].host,
        data: [siteinfos[i].count]
      });
    };
    return topSite;
  }
  var urlCounts = 0;
  chrome.history.search({
      'text': '',
    },
    function(HistoryItem) {
      for (var i = 0; i < HistoryItem.length; ++i) {
        var url = HistoryItem[i].url;
        var visitCount = HistoryItem[i].visitCount;
        var host = getHost(url);
        if (host != "") {
          urlCounts += 1;
          if (!siteInfo[host]) {
            siteInfo[host] = visitCount;
          } else {
            siteInfo[host] += visitCount;
          }
        }
      }
      var sortHostInfo = sort(siteInfo);
      // buildPopupDom(divName, sortHostInfo, urlCounts);
      createBar(siteInfoToBar(sortHostInfo));
      var datas = [];
      var otherCount = 0 ;
      for (var i = 0; i < sortHostInfo.length ; i++) {
        if (i < 10) {
          datas.push({
            name: sortHostInfo[i].host,
            y: sortHostInfo[i].count
          });
        }else
        {
          otherCount += 1 ;
        }
      }
      datas.push({name: '其它' , y : otherCount});
      createPie(datas);
    }
  );



}
document.addEventListener('DOMContentLoaded', function() {
  buildTypedUrlList("show");
});
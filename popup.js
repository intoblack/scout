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


function createBar() {
  options = {
    segmentShowStroke: true,
    segmentStrokeColor: "#fff",
    segmentStrokeWidth: 2,
    animation: true,
    animationSteps: 100,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false,
    onAnimationComplete: null,
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

  }
  var data = [{
    value: 300,
    color: "#F7464A",
    highlight: "#FF5A5E",
    label: "Red"
  }, {
    value: 50,
    color: "#46BFBD",
    highlight: "#5AD3D1",
    label: "Green"
  }, {
    value: 100,
    color: "#FDB45C",
    highlight: "#FFC870",
    label: "Yellow"
  }, {
    value: 40,
    color: "#949FB1",
    highlight: "#A8B3C5",
    label: "Grey"
  }, {
    value: 120,
    color: "#4D5360",
    highlight: "#616774",
    label: "Dark Grey"
  }]
  var ctx = document.getElementById("canvas").getContext("2d");
  var myNewChart = new Chart(ctx).Pie(data, options);
}


function buildTypedUrlList(divName) {

  siteInfo = {} //object {hostname :  url_history_count }

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

  var urlCounts = 0;
  chrome.history.search({
      'text': '',
    },
    function(HistoryItem) {
      for (var i = 0; i < HistoryItem.length; ++i) {
        var url = HistoryItem[i].url;
        var visitCount = HistoryItem[i].visitCount;
        host = getHost(url);
        if (host != "") {
          urlCounts += 1;
          if (!siteInfo[host]) {
            siteInfo[host] = visitCount;
          } else {
            siteInfo[host] += visitCount;
          }
        }
      }
      buildPopupDom(divName, sort(siteInfo), urlCounts);
    }
  );



}



document.addEventListener('DOMContentLoaded', function() {
  buildTypedUrlList("show");
  createBar();
});
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
    scaleOverlay: false,
    scaleOverride: false,
    scaleSteps: null,
    scaleStepWidth: null,
    scaleStartValue: null,
    scaleLineColor: "rgba(0,0,0,.1)",
    scaleLineWidth: 1,
    scaleShowLabels: false,
    scaleLabel: "<%=value%>",
    scaleFontFamily: "'Arial'",
    scaleFontSize: 12,
    scaleFontStyle: "normal",
    scaleFontColor: "#666",
    scaleShowGridLines: true,
    scaleGridLineColor: "rgba(0,0,0,.05)",
    scaleGridLineWidth: 1,
    barShowStroke: true,
    barStrokeWidth: 2,
    barValueSpacing: 5,
    barDatasetSpacing: 1,
    animation: true,
    animationSteps: 60,
    animationEasing: "easeOutQuart",
    onAnimationComplete: null
  }
  var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,1)",
      data: [65, 59, 90, 81, 56, 55, 40]
    }, {
      fillColor: "rgba(151,187,205,0.5)",
      strokeColor: "rgba(151,187,205,1)",
      data: [28, 48, 40, 19, 96, 27, 100]
    }]
  }
  var ctx = document.getElementById("canvas").getContext("2d");
  var bar = new Chart(ctx).Bar(data , {});
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
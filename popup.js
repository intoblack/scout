function onAnchorClick(event) {
  chrome.tabs.create({
    selected: true,
    url: event.srcElement.href
  });
  return false;
}


function buildPopupDom(divName, data) {
  var popupDiv = document.getElementById(divName);
  var table = document.createElement('table');
  table.className = "table table-hover";
  for (var i = 0, ie = data.length; i < ie; ++i) {
    var tr = document.createElement('tr');
    tr.className = "info";
    var td = document.createElement('td')
    td.className = "active";

    td.appendChild(document.createTextNode(data[i]));

    tr.appendChild(td);
    var td1 = document.createElement('td');
    td1.className = "warn";
    td1.appendChild(document.createTextNode("100%"));
    tr.appendChild(td1);
    table.appendChild(tr);
  }
  popupDiv.appendChild(table);
}


function buildPopupDom1(divName, data, urlcounts) {
  var popupDiv = document.getElementById(divName);
  var tbody = document.createElement('tbody')
  var table = document.createElement("table");
  table.className = "table table-hover";
  table.appendChild(tbody);
  for (var site in data) {
    var tr = document.createElement('tr');
    var siteName = document.createElement('td')
    siteName.appendChild(document.createTextNode(site));
    tr.appendChild(siteName);
    var urlNum = document.createElement('td');
    urlNum.appendChild(document.createTextNode(data[site]));
    tr.appendChild(urlNum);
    var sitePercent = document.createElement('td');
    sitePercent.appendChild(document.createTextNode((data[site] / urlcounts).toFixed(3) + " %"));
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
    onAnimationComplete: null
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

  var beforeTime = (new Date).getTime();
  siteInfo = {}

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
  var urlCounts = 0;
  chrome.history.search({
      'text': '',
      'endTime': beforeTime,
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
      buildPopupDom1(divName, siteInfo, urlCounts);
    }
  );
}



document.addEventListener('DOMContentLoaded', function() {
  buildTypedUrlList("show");
  createBar();
});
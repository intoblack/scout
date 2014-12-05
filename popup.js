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


function buildPopupDom1(divName, data , urlcounts ) {
  var popupDiv = document.getElementById(divName);
  var table = document.createElement('table');
  table.className = "table table-hover";
  for (var site in data ) {
    var tr = document.createElement('tr');
    tr.className = "info";
    var td = document.createElement('td')
    td.className = "active";
    td.appendChild(document.createTextNode(site));
    tr.appendChild(td);
    var td1 = document.createElement('td');
    td1.className = "warn";
    td1.appendChild(document.createTextNode(data[site]));
    tr.appendChild(td1);
    var sitePercent = document.createElement('td');
    sitePercent.className = "warn";
    sitePercent.appendChild(document.createTextNode( (  data[site] / urlcounts )   +  " %" ));
    tr.appendChild(sitePercent);
    table.appendChild(tr);
  }
  popupDiv.appendChild(table);
}


function buildTypedUrlList(divName) {

  // var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 1;
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
  var urlCounts = 0 ;
  chrome.history.search({
      'text': '',
      'endTime': beforeTime,
    },
    function(HistoryItem) {
      for (var i = 0; i < HistoryItem.length; ++i) {
        var url = HistoryItem[i].url;
        var visitCount = HistoryItem[i].visitCount ;
        host = getHost(url);
        if (host != "") {
          urlCounts  += 1 ;
          if (!siteInfo[host]) {
            siteInfo[host] = visitCount;
          } else {
            siteInfo[host] += visitCount;
          }
        }
      }
      buildPopupDom1(divName, siteInfo , urlCounts );
    }
  );
}



document.addEventListener('DOMContentLoaded', function() {
  buildTypedUrlList("show");
});
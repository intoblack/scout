function onAnchorClick(event) {
   chrome.tabs.create({
     selected: true,
      url: event.srcElement.href
    });
    return false;
  }
  

  function buildPopupDom(divName, data) {
    var popupDiv = document.getElementById(divName);
  
    var ul = document.createElement('ul');
    popupDiv.appendChild(ul);
  
    for (var i = 0, ie = data.length; i < ie; ++i) {
      var a = document.createElement('a');
      a.href = data[i];
      a.appendChild(document.createTextNode(data[i]));
      a.addEventListener('click', onAnchorClick);
  
      var li = document.createElement('li');
      li.appendChild(a);
  
      ul.appendChild(li);
    }
  }
  

  function buildTypedUrlList(divName) {
  
    var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 1;
    var beforeTime = (new Date).getTime() - microsecondsPerWeek;
  
    var numRequestsOutstanding = 0;
  
    chrome.history.search({
        'text': '',            
        'startTime': beforeTime  
      },
      function(HistoryItem ) {
        for (var i = 0; i < HistoryItem .length; ++i) {
          var url = HistoryItem[i].url;
          alert(url);
          var processVisitsWithUrl = function(url) {
            return function(visitItems) {
              processVisits(url, visitItems);
            };
          };
          chrome.history.getVisits({url: url}, processVisitsWithUrl(url));
          numRequestsOutstanding++;
        }
        if (!numRequestsOutstanding) {
          onAllVisitsProcessed();
        }
      });
  
  

    var urlToCount = {};
  
  
    var processVisits = function(url, visitItems) {
      for (var i = 0, ie = visitItems.length; i < ie; ++i) {
        if (visitItems[i].transition != 'typed') {
          continue;
        }
  
        if (!urlToCount[url]) {
          urlToCount[url] = 0;
        }
  
        urlToCount[url]++;
      }

      if (!--numRequestsOutstanding) {
        onAllVisitsProcessed();
      }
    };
  
   var onAllVisitsProcessed = function() {
     urlArray = [];
     for (var url in urlToCount) {
       urlArray.push(url);
     }
     urlArray.sort(function(a, b) {
       return urlToCount[b] - urlToCount[a];
     });
 
     buildPopupDom(divName, urlArray.slice(0, 10));
   };
 }
 
 document.addEventListener('DOMContentLoaded', function () {
  
   buildTypedUrlList("history");
 });
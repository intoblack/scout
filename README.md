

编写一个chrome 插件 
================================

主要想实现的功能  
-------------------------------
+  通过图丙的方式 ， 告诉你到底花了多长时间 ， 在浏览器上 ， 可以提醒你更好的分配自己的时间 
+  时间是有限的 ，到底是那个时间加减法真的是存在 ， 还是我们同时做了很多事情？
+  时间的挖掘






注解  
------------------------
+  我发现的我惰性 ， 不敢开始一个事情 ， 时常发生 ， 现在开始编写这个空间 ；
+  控件目的是完成 ， 对我过去一段时间内的 ， 所有网站进行统计 ， 站点界别
+  用到的技术 ： chrome 插件 ， js的正则  
+  预计完成时间 ， 本周五
######1 . 开始学习控件编写 , 1.5小时内 ， 2点20点开始
######2 . 开始编写js识别历史记录部分 ， 1小时 



调试chrome 插件
-------------------
+  地址 chrome-extension://你控件的id/popup.html   

<font color="red">warning</font>
-------------
+   chrome.history.search(query , callback ) , callback 是一个回调函数 ， 所以你在这个回调函数外面处理数据的话 ， 因为延迟 ，会得不到数据

引用：
<a href="http://chrome.liuyixi.com/overview.html">chrome插件开发.官方简版</a> 
<a href="http://blog.csdn.net/xiaoxian8023/article/details/24457767">崔成龙.chrom插件开发</a>
<a href="http://open.chrome.360.cn/html/dev_history.html">360.chromeapi文档</a>
<a href="http://chrome.liuyixi.com/history.html#type-HistoryItem">chrome api 文档</a>
<a href="http://v3.bootcss.com/css/#code">bootstarp官方用例说明</a>
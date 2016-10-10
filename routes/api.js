var request = require("request");
var cheerio = require("cheerio");
var Iconv = require('iconv-lite');

//轮播图
exports.carousel = function(req, res) {
  var result = [];
  request("http://www.hltm.tv/", function(error, response, body) {
    var $ = cheerio.load(body);
    var carouselHtml = $("#divpageinfog_imgPlayer");
    carouselHtml.find("li").map(function(i, v) {
      result.push({
        img: $(v).find("img").attr("src"),
        url: $(v).find("a").attr("href"),
        title: $(v).find("img").attr("alt")
      });
    });
    res.send(result);
  });
};

//一周更新
exports.weekUpdate = function(req, res) {
  var result = [];
  request("http://www.hltm.tv/", function(error, response, body) {
    var $ = cheerio.load(body);
    var weekUpdatesHtml = $(".tlist02");
    weekUpdatesHtml.map(function(i, v) {
      var updateList = [];
      $(v).find("li").map(function(i, v) {
        updateList.push({
          updateDate: $(v).find("span").text(),
          name: $(v).find("a").text(),
          url: $(v).find("a").attr("href")
        });
      });
      var week = '';
      switch (i + 1) {
        case 1:
          week = "一";
          break;
        case 2:
          week = "二";
          break;
        case 3:
          week = "三";
          break;
        case 4:
          week = "四";
          break;
        case 5:
          week = "五";
          break;
        case 6:
          week = "六";
          break;
        case 7:
          week = "日";
          break;
      }
      result.push({
        week: week,
        list: updateList
      });
    });
    res.send(result);
  });
};

//新增,推荐动漫
exports.addRecommend = function(req, res) {
  var result = [];
  request("http://www.hltm.tv/", function(error, response, body) {
    var $ = cheerio.load(body);
    var html = $(".tabcon01 .plist01");
    html.map(function(i, v) {
      var list = [];
      $(v).find("li").map(function(i, v) {
        list.push({
          update: $(v).find("span").text(),
          name: $(v).find("p").text(),
          url: $(v).find("a").attr("href"),
          img: $(v).find("img").attr("original")
        });
      });
      var tab = {};
      switch (i) {
        case 0:
          tab.title = "新增连载动漫";
          tab.url = "http://www.hltm.tv/list/7.html";
          break;
        case 1:
          tab.title = "新增完结动漫";
          tab.url = "http://www.hltm.tv/list/18.html";
          break;
        case 2:
          tab.title = "推荐连载动漫";
          tab.url = "http://www.hltm.tv/list/7.html";
          break;
        case 3:
          tab.title = "推荐完结动漫";
          tab.url = "http://www.hltm.tv/list/18.html";
          break;
      }
      result.push({
        tab: tab,
        list: list
      });
    });
    res.send(result);
  });
};

//最近更新
exports.recentUpdate = function(req, res) {
  var result = [];
  request("http://www.hltm.tv/list/29.html", function(error, response, body) {
    var $ = cheerio.load(body);
    var html = $(".box04");
    html.find("li").map(function(i, v) {
      var name = $(v).find("h3 a").text();
      var episode = /第[0-9]*集/g.exec(name)[0];
      result.push({
        time: $(v).find("em").text(),
        sort: $(v).find("i").text(),
        type: $(v).find("strong a").text(),
        name: name.replace(episode, ""),
        url: $(v).find("h3 a").attr("href"),
        episode: episode
      });
    });
    res.send(result);
  });
};

//热门新番
exports.hotNewAnimate = function(req, res) {
  var result = [];
  request("http://www.hltm.tv/", function(error, response, body) {
    var $ = cheerio.load(body);
    var tabHtml = $(".xinfan-nav li");
    tabHtml.map(function(i, v) {
      var tabObj = {
        tab: $(v).find("a").text(),
        child: []
      };
      $("#tabxinfan_" + (i + 1)).find("li").map(function(ii, vv) {
        var childObj = {
          tab: $(vv).find("a").text(),
          list: [],
          otherList: []
        };
        $("#tabxinfan_" + (i + 1) + "_tab_" + (ii + 1) + " .plist01").find("li").map(function(iii, vvv) {
          childObj.list.push({
            url: $(vvv).find("a").attr("href"),
            img: $(vvv).find("img").attr("original"),
            episode: $(vvv).find("span").text(),
            name: $(vvv).find("p").text()
          });
        });
        $("#tabxinfan_" + (i + 1) + "_tab_" + (ii + 1) + " .tlist01").find("li").map(function(iii, vvv) {
          childObj.otherList.push({
            url: $(vvv).find("a").attr("href"),
            name: $(vvv).find("a").text()
          });
        });
        tabObj.child.push(childObj);
      });
      result.push(tabObj);
    });
    res.send(result);
  });
};

//2016年7月新番排行榜/2016年4月新番排行榜/动漫总排行榜/动漫资讯
exports.ranking = function(req, res) {
  var result = [];
  request("http://www.hltm.tv/", function(error, response, body) {
    var $ = cheerio.load(body);
    var html = $(".toplists");
    html.find("dl").map(function(i, v) {
      var tab = "";
      if ($(v).find("dt a").length == 0) {
        tab = $(v).find("dt").text().replace(/\s/g, "");
      } else {
        tab = $(v).find("dt a").eq(1).text();
      }
      var tabObj = {
        tab: tab,
        url: $(v).find("dt a").eq(1).attr("href"),
        list: []
      };
      $(v).find("dd").map(function(ii, vv) {
        tabObj.list.push({
          name: $(vv).find("a").eq(0).text(),
          url: $(vv).find("a").eq(0).attr("href"),
          episode: $(vv).find("a").eq(1).find("em").text()
        });
      });
      result.push(tabObj);
    });
    res.send(result);
  });
};

//搜索
exports.search = function(req, res) {
  var pageSize = 25;
  var result = {
    page: 1,
    pageSize: pageSize,
    totalCount: 0,
    totalPage: 1,
    list: [],
    lastPage: true,
    firstPage: true,
    ranking: []
  };
  var k = req.query.k;
  if (k) {
    var page = req.query.page || 1;
    var url = "http://www.hltm.tv/search/index.php?k=" + encodeURIComponent(k) + "&page=" + page;
    request(url, function(error, response, body) {
      var $ = cheerio.load(body);
      var count = $(".bread span em").text() || "0";
      count = parseInt(count);
      if (count > 0) {
        var list = [];
        $(".plist02").find("li").map(function(i, v) {
          var other = $(v).find("div").text().replace(/\r|\n|\r\n|\s/g, "");
          list.push({
            url: $(v).find("a").attr("href"),
            name: $(v).find("a").find("p").text(),
            lastest: $(v).find("a").find("span").text(),
            img: $(v).find("a").find("img").attr("src"),
            download: /下载：[0-9]*类型：/g.exec(other)[0].replace("下载：", "").replace("类型：", ""),
            type: /类型：.*地区：/g.exec(other)[0].replace("类型：", "").replace("地区：", ""),
            local: /地区：.*$/g.exec(other)[0].replace("地区：", "")
          });
        });
        var totalPage = 0;
        if (count % pageSize == 0) {
          totalPage = count / pageSize;
        } else {
          totalPage = parseInt(count / pageSize) + 1;
        }
        result = {
          page: page,
          pageSize: pageSize,
          totalCount: count,
          totalPage: totalPage,
          list: list,
          lastPage: page == totalPage,
          firstPage: page == 1,
          ranking: []
        };
      }
      //动漫排行
      $("#tabph").find("li").map(function(i, v) {
        var rankObj = { tab: $(v).text(), list: [] };
        $("#tabphcon_" + (i + 1)).find("li").map(function(ii, vv) {
          rankObj.list.push({
            name: $(vv).find("a").text(),
            url: $(vv).find("a").attr("href"),
            count: $(vv).find("span").text(),
            sort: $(vv).find("em").text()
          });
        });
        result.ranking.push(rankObj);
      });
      res.send(result);
    });
  } else {
    res.send({
      status: 201,
      description: "关键字不能为空"
    });
  }
};

//动漫详情
exports.detail = function(req, res) {
  var url = req.query.url;
  var result = {};
  if (url) {
    request(decodeURIComponent(url), function(error, response, body) {
      var $ = cheerio.load(body, { decodeEntities: false });
      result.name = $(".infotitle").find("h1").text();
      result.img = $(".bpic").find("img").attr("src");
      result.intro = $(".jianjie").html();
      result.opts = [];
      $(".info li").map(function(i, v) {
        result.opts.push({
          key: $(v).find("span").text(),
          value: $(v).find("p").text().replace(/\s/g, "")
        });
      });
      result.download = [];
      $("#tabxinfan_1 li").map(function(i, v) {
        var dlObj = {};
        dlObj.tab = $(v).text().replace(/\s/g, "");
        dlObj.list = [];
        $("#tabxinfan_1_tab_" + (i + 1)).find("li").map(function(ii, vv) {
          dlObj.list.push({
            name: $(vv).find("a").text(),
            url: $(vv).find("a").attr("href")
          });
        });
        result.download.push(dlObj);
      });
      result.recommend = [];
      result.editRecommend = [];
      $(".c_ph").eq(0).find("li").map(function(i, v) {
        var obj = {
          sort: $(v).find("em").text(),
          count: $(v).find("span").text(),
          name: $(v).find("a").text(),
          url: $(v).find("a").attr("href")
        };
        if ($(".phItem").eq(0).find("h2").text() == "相关推荐") {
          result.recommend.push(obj);
        } else if ($(".phItem").eq(0).find("h2").text() == "编辑推荐") {
          result.editRecommend.push(obj);
        }
      });
      $(".c_ph").eq(1).find("li").map(function(i, v) {
        var obj = {
          sort: $(v).find("em").text(),
          count: $(v).find("span").text(),
          name: $(v).find("a").text(),
          url: $(v).find("a").attr("href")
        };
        if ($(".phItem").eq(1).find("h2").text() == "相关推荐") {
          result.recommend.push(obj);
        } else if ($(".phItem").eq(1).find("h2").text() == "编辑推荐") {
          result.editRecommend.push(obj);
        }
      });
      res.send(result);
    });
  } else {
    res.send({
      status: 201,
      description: "参数不正确"
    });
  }
};

//列表
exports.list = function(req, res) {
  var ver = req.query.ver || "";
  var letter = req.query.letter || ""; //A-Z 100
  var sort = req.query.sort || ""; //""最新更新 1热门播放
  var page = req.query.page || 1;
  var tab = req.query.tab || 7; //连载动漫  18:完结动漫
  var url = "http://www.hltm.tv/list/s__$ver_$tab____$letter_$sort_$page.html";
  var pageSize = 20;
  var result = {
    page: page,
    pageSize: pageSize,
    totalCount: 0,
    totalPage: 1,
    list: [],
    lastPage: true,
    firstPage: true,
    ranking: []
  };
  url = url.replace("$ver", ver).replace("$tab", tab).replace("$letter", letter).replace("$sort", sort).replace("$page", page);
  console.log(url);
  request(url, function(error, response, body) {
    var $ = cheerio.load(body);
    var count;
    if ($(".pages").find("a").length > 0) {
      count = $(".pages").eq(0).find("a").eq(0).text().replace("条", "");
    } else {
      count = $(".plist02 li").length;
    }
    count = parseInt(count);
    var totalPage = 0;
    if (count % pageSize == 0) {
      totalPage = count / pageSize;
    } else {
      totalPage = parseInt(count / pageSize) + 1;
    }
    result.totalCount = count;
    result.totalPage = totalPage;
    result.lastPage = page == totalPage;
    result.firstPage = page == 1;
    if (count > 0) {
      $(".plist02 li").map(function(i, v) {
        result.list.push({
          url: $(v).find("a").attr("href"),
          img: $(v).find("img").attr("src"),
          name: $(v).find("p").text(),
          updateTime: $(v).find("em").eq(0).text(),
          downloadCount: $(v).find("em").eq(1).text().replace("下载次数：", "").replace(/\s/g, ""),
          episode: $(v).find("span").text()
        });
      });
    }
    //动漫排行
    $("#tabph").find("li").map(function(i, v) {
      var rankObj = { tab: $(v).text(), list: [] };
      $("#tabphcon_" + (i + 1)).find("li").map(function(ii, vv) {
        rankObj.list.push({
          name: $(vv).find("a").text(),
          url: $(vv).find("a").attr("href"),
          count: $(vv).find("span").text(),
          sort: $(vv).find("em").text()
        });
      });
      result.ranking.push(rankObj);
    });
    res.send(result);
  });
};

//新闻列表
exports.news = function(req, res) {
  var page = req.query.page || 1;
  var url = "http://www.hltm.tv/list/26.html";
  var pageSize = 15;
  page = parseInt(page);
  var result = {
    page: page,
    pageSize: pageSize,
    totalCount: 0,
    totalPage: 1,
    list: [],
    lastPage: true,
    firstPage: true,
    ranking: []
  };
  if (page > 1) {
    url = url.replace(".html", "_" + page + ".html");
  }
  request({ url: url, encoding: null }, function(error, response, body) {
    body = Iconv.decode(body, 'gb2312').toString();
    var $ = cheerio.load(body);
    var count = $(".bread span em").text() || "0";
    count = parseInt(count);
    var totalPage = 0;
    if (count % pageSize == 0) {
      totalPage = count / pageSize;
    } else {
      totalPage = parseInt(count / pageSize) + 1;
    }
    result.totalCount = count;
    result.totalPage = totalPage;
    result.lastPage = page == totalPage;
    result.firstPage = page == 1;
    if (count > 0) {
      $(".subNewsList li").map(function(i, v) {
        result.list.push({
          url: $(v).find("a").eq(0).attr("href"),
          img: $(v).find("img").attr("src"),
          title: $(v).find("a").eq(1).text(),
          description: $(v).find("span").text(),
          time: $(v).find("em").text()
        });
      });
    }
    res.send(result);
  });
};

//新闻详情
exports.newsDetail = function(req, res) {
  var url = req.query.url;
  if (url) {
    var result = {};
    request(decodeURIComponent(url), function(error, response, body) {
      var $ = cheerio.load(body, { decodeEntities: false });
      if ($(".articleTitle")) {
        result.title = $(".articleTitle h1").text();
        var subtitle = $(".articleTitle span").text();
        result.time = /时间：.*点击/.exec(subtitle)[0].replace("时间：", "").replace("点击", "");
        result.content = $(".articleContent").html();
      }
      res.send(result);
    });
  } else {
    res.send({
      status: 201,
      description: "参数不正确"
    });
  }
};

//专题
exports.topics = function(req, res) {
  var result = [];
  var url = "http://www.hltm.tv/list/27.html";
  request(url, function(error, response, body) {
    var $ = cheerio.load(body);
    $(".ztlist li").map(function(i, v) {
      result.push({
        url: $(v).find("a").eq(0).attr("href"),
        img: $(v).find("img").attr("src"),
        title: $(v).find("a").eq(1).text()
      });
    });
    res.send(result);
  });
};

//专题详情
exports.topicDetail = function(req, res) {
  var page = req.query.page || 1;
  var pageSize = 21;
  var result = {
    page: page,
    pageSize: pageSize,
    totalCount: 0,
    totalPage: 1,
    list: [],
    lastPage: true,
    firstPage: true
  };
  var url = req.query.url;
  if (url) {
    url = decodeURIComponent(url);
    if (page > 1) {
      url = url.replace(".html", "-" + page + ".html");
    }
    request(url, function(error, response, body) {
      var $ = cheerio.load(body);
      var count = $(".pages").find("a").eq(0).text().replace("条", "") || "0";
      count = parseInt(count);
      if (count > 0) {
        var totalPage = 0;
        if (count % pageSize == 0) {
          totalPage = count / pageSize;
        } else {
          totalPage = parseInt(count / pageSize) + 1;
        }
        result.totalCount = count;
        result.totalPage = totalPage;
        result.lastPage = page == totalPage;
        result.firstPage = page == 1;
        $(".plist02").find("li").map(function(i, v) {
          var other = $(v).find("div").text().replace(/\r|\n|\r\n|\s/g, "");
          result.list.push({
            url: $(v).find("a").attr("href"),
            name: $(v).find("a").find("p").text(),
            lastest: $(v).find("a").find("span").text(),
            img: $(v).find("a").find("img").attr("src"),
            download: /播放：.*类型：/g.exec(other)[0].replace("播放：", "").replace("类型：", ""),
            type: /类型：.*地区：/g.exec(other)[0].replace("类型：", "").replace("地区：", ""),
            local: /地区：.*$/g.exec(other)[0].replace("地区：", "")
          });
        });
      }
      res.send(result);
    });
  } else {
    res.send({
      status: 201,
      description: "参数不正确"
    });
  }
};

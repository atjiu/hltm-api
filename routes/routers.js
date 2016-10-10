var Index = require("./index");
var Api = require("./api");

module.exports = function (app) {

  app.get("/", Index.index);
  app.get("/resource", Index.resource);

  app.get("/carousel", Api.carousel);
  app.get("/weekUpdate", Api.weekUpdate);
  app.get("/addRecommend", Api.addRecommend);
  app.get("/recentUpdate", Api.recentUpdate);
  app.get("/hotNewAnimate", Api.hotNewAnimate);
  app.get("/ranking", Api.ranking);
  app.get("/search", Api.search);
  app.get("/detail", Api.detail);
  app.get("/list", Api.list);
  app.get("/news", Api.news);
  app.get("/newsDetail", Api.newsDetail);
  app.get("/topics", Api.topics);
  app.get("/topicDetail", Api.topicDetail);
};

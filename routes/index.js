
exports.index = function (req, res) {
  res.render("index");
};

exports.resource = function (req, res) {
  res.send({
    code: 201,
    url: 'http://hltm-api.tomoya.cn/resources/H55F9AFA1.wgt',
    size: '320kb',
    version: '1.0.1'
  });
};
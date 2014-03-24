var express = require('express');

var port = 8010;
if (process.argv.length > 2) {
  port = parseInt(process.argv[2], 10);
}

var selfie_root = __dirname + '/../selfie/sankey';

var app = express();
app.use(express.logger());
app.use('/selfie/', express.static(selfie_root));
app.get('/selfie/', function(req, res) {
  res.sendfile('main.html', { 'root': selfie_root });
});
app.listen(port);


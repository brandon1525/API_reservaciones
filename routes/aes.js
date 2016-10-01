module.exports = function(app) {
  var crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = 'd6F3Efeq';
  //res.send(place);
  encrypFn = function(req, res){
    var text = req.body.text;
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return res.json({encrypt: crypted});
  };
  dencrypFn = function(req, res){
    var text = req.body.text;
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return res.json({desencrypt: dec});
  };
  app.post('/aes/encrypt', encrypFn);
  app.post('/aes/dencrypt', dencrypFn);
};

module.exports = function(app) {
  var User        = require('../models/user');
  var config      = require('../config/database');
  var jwt         = require('jwt-simple');
  //GET - Return all users in the DB
  findAllUsers = function(req, res) {
  	User.find(function(err, users) {
  		if(!err) {
  			res.send(users);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a User with specified ID
  findById = function(req, res) {
  	User.findById(req.params.id, function(err, user) {
  		if(!err) {
        res.json(user);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new User in the DB
  addUser = function(req, res) {
  	var user = new User({
  		name : req.body.name,
  		last_name_p : req.body.last_name_p,
  		last_name_m : req.body.last_name_m,
      phone : req.body.phone,
  		sex : req.body.sex,
  		date_b : req.body.date_b,
      type_user : req.body.type_user,
      user : req.body.user,
      password : req.body.password
  	});
  	user.save(function(err) {
  		if(!err) {
  			console.log('Created');
        res.json({success: true, msg: 'Usuario creado con exito.'});
  		} else {
  			console.log('ERROR: ' + err);
        return res.json({success: false, msg: 'Usuario ya existe.'});
  		}
  	});
  	//res.send(user);
  };

  //PUT - Update a register already exists
  updateUser = function(req, res) {
  	User.findById(req.params.id, function(err, user) {
      user.name = req.body.name;
  		user.last_name_p = req.body.last_name_p;
  		user.last_name_m = req.body.last_name_m;
      user.phone = req.body.phone;
  		user.sex = req.body.sex;
  		user.date_b = req.body.date_b;
      user.type_user = req.body.type_user;
      user.user = req.body.user;
      user.password = req.body.password;
  		user.save(function(err) {
  			if(!err) {
  				console.log('Actualizado');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  			res.send(user);
  		});
  	});
  }

  //DELETE - Delete a User with specified ID
  deleteUser = function(req, res) {
  	User.findById(req.params.id, function(err, user) {
  		user.remove(function(err) {
  			if(!err) {
  				console.log('Removed');
  			} else {
  				console.log('ERROR: ' + err);
  			}
        res.send(user);
  		})
  	});
  }

  authenticateUser = function(req, res){
    User.findOne({user: req.body.user}, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.send({success: false, msg: 'Authentication failed. Usuario no encontrado.'});
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.encode(user, config.secret);
            res.json({success: true, token: 'JWT ' + token, user: user});
          } else {
            res.send({success: false, msg: 'Authentication failed. Password incorrecto.'});
          }
        });
      }
    });
  }

  //Link routes and functions
  app.get('/users', findAllUsers);
  app.get('/user/:id', findById);
  app.post('/user', addUser);
  app.post('/user/authenticate', authenticateUser)
  app.put('/user/:id', updateUser);
  app.delete('/user/:id', deleteUser);

}

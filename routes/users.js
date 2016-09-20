//File: routes/users.js

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
  		nombre : req.body.nombre,
  		apellido_p : req.body.apellido_p,
  		apellido_m : req.body.apellido_m,
      telefono : req.body.telefono,
  		sexo : req.body.sexo,
  		edad : req.body.edad,
      usuario : req.body.usuario,
      password : req.body.password
  	});
  	user.save(function(err) {
  		if(!err) {
  			console.log('Created');
        res.json({success: true, msg: 'Usuario creado con exito.'});
  		} else {
  			console.log('ERROR: ' + err);
        return res.json({success: false, msg: 'Usuario ya existe.', err: err});
  		}
  	});
  	//res.send(user);
  };

  //PUT - Update a register already exists
  updateUser = function(req, res) {
  	User.findById(req.params.id, function(err, user) {
  		user.nombre   = req.body.nombre;
  		user.apellido_p    = req.body.apellido_p;
  		user.apellido_m = req.body.apellido_m;
      user.telefono  = req.body.telefono;
  		user.sexo  = req.body.sexo;
  		user.edad = req.body.edad;

  		user.save(function(err) {
  			if(!err) {
  				console.log('Updated');
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
    User.findOne({usuario: req.body.usuario}, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.send({success: false, msg: 'Authentication failed. Usuario no encontrado.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.encode(user, config.secret);
            res.json({success: true, token: 'JWT ' + token, usuario: user});
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

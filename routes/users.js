module.exports = function(app) {
  var User        = require('../models/user');
  var Place       = require('../models/place');
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
        res.json(
          {
            success: true,
            msg: 'Usuario creado con exito.',
            user_data: {
              id: user._id,
              name: user.name,
              last_name_p: user.last_name_p,
              last_name_m: user.last_name_m,
              phone: user.phone,
              sex: user.sex,
              date_b: user.date_b,
              type_user: user.type_user,
              user: user.user
            }
          });
  		} else {
  			console.log('ERROR: ' + err);
        if(err.code==11000){
          return res.json({success: false, msg: 'Usuario ya existe.'});
        }else{
          return res.json({success: false, msg: "Error del sistema comunicate con tu administrador"});
        }
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
      user.user = req.body.user;
      if(req.body.password!=""){
        user.password = req.body.password;
      }
  		user.save(function(err) {
  			if(!err) {
  				console.log('Actualizado');
          res.json({
            success: true,
            msg: 'Usuario actualizado con exito.',
            user_data: {
              id: user._id,
              name: user.name,
              last_name_p: user.last_name_p,
              last_name_m: user.last_name_m,
              phone: user.phone,
              sex: user.sex,
              date_b: user.date_b,
              type_user: user.type_user,
              user: user.user
            }
          });
  			} else {
          res.json({
            success: false,
            msg: err
          });
  				console.log('ERROR: ' + err);
  			}
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
        res.send({success: false, msg: 'Usuario no encontrado.'});
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.encode(user, config.secret);
            var user_data = {
              id: user._id,
              name: user.name,
              last_name_p: user.last_name_p,
              last_name_m: user.last_name_m,
              phone: user.phone,
              sex: user.sex,
              date_b: user.date_b,
              type_user: user.type_user,
              user: user.user
            };
            if(user.type_user==0){
              res.json(
                {
                  success: true,
                  token: 'JWT ' + token,
                  user_data: user_data
                }
              );
            }else if(user.type_user==1){
              Place.findOne({owner: user._id}).populate('owner').exec(function (err, place) {
                if (err) {
                  console.log('ERROR: ' + err);
                  return res.json({success: false, error: 'No hay establecimiento para este usuario'});
                }else{
                  res.json(
                    {
                      success: true,
                      token: 'JWT ' + token,
                      user_data: user_data,
                      business_data: {
                        id: place._id,
                        name: place.name,
                        description: place.description,
                        total_people: place.total_people,
                        type: place.type,
                        create_at: place.create_at
                      }
                    }
                  );
                }
              });
            }
          } else {
            res.send({success: false, msg: 'Password incorrecto.'});
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

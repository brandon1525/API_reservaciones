module.exports = function(app) {
  var Reservation = require('../models/reservation');
  var QRCode      = require('qrcode');

  var server = require('https').Server(app);
  var io = require('socket.io')(server);
  server.listen(443);

  io.on('connection', function (socket) {
    console.log(socket);
    //console.log("Alguien se ha conectado con sockets");
    socket.on('Administrador_conectado',function(name){
      socket.join(name);
      console.log("Establecimiento conectado : "+name);
      socket.emit('recibido', true);
    });
    //socket.emit('notification_reservation', 'Nueva reservacion');
    /*socket.on('new_notification', function (reservacion) {
      console.log(reservacion);
      io.sockets.emit('notification_reservation', 'Nueva reservacion');
    });*/

  });

  findAllReservationsByUser = function(req, res) {
    Reservation.find({user_responsible: req.body.user_responsible}).populate('user_responsible place').sort({date_reservation: 'desc'}).exec(function (err, reservations) {
      if (err) {
        console.log('ERROR: ' + err);
        return res.json({
          success : false,
          msg : 'No hay reservaciones de este usuario',
          err : err
        });
      }else{
        res.json({
          success: true,
          reservations: reservations
        });
      }
    });
  };

  findAllReservationsByUserHours = function(req, res) {
    Reservation.find({place: req.body.place}).sort({date_reservation: 'desc'}).exec(function (err, reservations) {
      if (err) {
        console.log('ERROR: ' + err);
        return res.json({
          success : false,
          msg : 'No hay reservaciones de este usuario',
          err : err
        });
      }else{
        var hours = {};
        reservations.forEach(function(item){
          var hour = item.date_reservation.getHours();
          if(!(hour in hours)){
            hours[hour] = [];
          }
          hours[hour].push(item);
        });
        res.json({
          success: true,
          hours: hours
        });
      }
    });
  };

  //GET - Return a Reservation with specified ID
  findById = function(req, res) {
  	Reservation.findById(req.params.id, function(err, reservation) {
  		if(!err) {
        res.json(reservation);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new Reservation in the DB
  addReservation = function(req, res) {
  	var reservation = new Reservation({
  		user_responsible : req.body.user_responsible,
  		place : req.body.place,
  		date_reservation : req.body.date_reservation,
      no_people : req.body.no_people
  	});
    io.to(req.body.place).emit('notification_reservation');
  	reservation.save(function(err, reservation) {
      if(!err) {
        console.log('Created');
        QRCode.toDataURL('http://localhost:3000/reservation/checkin/'+reservation._id+'',"minimum",function(err,url){
          var qr_code = url;
          res.json({
            success : true,
            msg : 'Reservación creada con exito.',
            reservation_data : reservation,
            qr : qr_code
          });
        });
      }else{
        console.log('ERROR: ' + err);
        return res.json({
          success : false,
          msg : 'No se pudo crear la reservación comunicate con tu admin.',
          err : err
        });
      }

    });
  };

  cancelReservation = function(req, res) {
    Reservation.findOne({$and: [{_id: req.body.id_reservation},{user_responsible: req.body.user_id}]}, function(err, reservation) {
      reservation.cancel = true;
  		reservation.save(function(err) {
  			if(!err) {
  				//console.log('Actualizado');
          res.json({success: true, msg: 'Cancelada con exito.'});
  			} else {
  				console.log('ERROR: ' + err);
          return res.json({success: false, msg: 'No se pudo cancelar la reservación.', err: err});
  			}
  			//res.send(reservation);
  		});
  	});
  };

  checkinReservation = function(req, res) {
    Reservation.findOne({_id: req.params.id_reservation}, function(err, reservation) {
      reservation.registry = true;
  		reservation.save(function(err) {
  			if(!err) {
  				//console.log('Actualizado');
          res.json({success: true, msg: 'Registrada con exito.'});
  			} else {
  				console.log('ERROR: ' + err);
          return res.json({success: false, msg: 'No se pudo cancelar la reservación.', err: err});
  			}
  			//res.send(reservation);
  		});
  	});
  };

  //PUT - Update a register already exists
  updateReservation = function(req, res) {
  	Reservation.findById(req.params.id, function(err, reservation) {
      reservation.user_responsible = req.body.user_responsible;
  		reservation.place = req.body.place;
  		reservation.date_reservation = req.body.date_reservation;
      reservation.no_people = req.body.no_people;
  		reservation.qr_code = req.body.qr_code;
  		reservation.save(function(err) {
  			if(!err) {
  				//console.log('Actualizado');
          res.json({success: true, msg: 'Actualizada con exito.'});
  			} else {
  				console.log('ERROR: ' + err);
          return res.json({success: false, msg: 'No se pudo actializar la reservación.', err: err});
  			}
  			//res.send(reservation);
  		});
  	});
  }

  //DELETE - Delete a Reservation with specified ID
  deleteReservation = function(req, res) {
  	Reservation.findById(req.params.id, function(err, reservation) {
  		reservation.remove(function(err) {
  			if(!err) {
  				console.log('Removed');
          res.json({success: true, msg: 'Removida con exito.'});
  			} else {
  				console.log('ERROR: ' + err);
          return res.json({success: false, msg: 'No se pudo eliminar la reservación.', err: err});
  			}
        //res.send(reservation);
  		})
  	});
  };

  monthReservation = function(req, res){
    console.log("last_month : "+req.body.last_month);
    console.log("current_month : "+req.body.current_month);
    Reservation.find({$and : [{place: req.body.place},{date_reservation: {"$gte": req.body.last_month , "$lt": req.body.current_month}}]}).populate('user_responsible').sort({date_reservation: 'asc'}).exec(function(err, reservations){
      if (err) {
        console.log('ERROR: ' + err);
        return res.json({
          success : false,
          msg : 'Error al recuperar reservaciones del mes',
          err : err
        });
      }else{
        var days = {};
        reservations.forEach(function(item){
          var dia = item.date_reservation.getFullYear()+"/"+item.date_reservation.getMonth()+"/"+item.date_reservation.getDate();
          if(!(dia in days)){
            days[dia] = [];
          }
          days[dia].push(item);
        });
        res.json({
          success: true,
          msg : "Cargadas exitosamente meses",
          reservations: days
        });
      }
    });
  };

  dayReservation = function(req, res){
    console.log("last_day : "+req.body.last_day);
    console.log("current_day : "+req.body.current_day);
    Reservation.find({$and : [{place: req.body.place},{date_reservation: {"$gte": req.body.last_day , "$lt": req.body.current_day}}]}).populate('user_responsible').sort({date_reservation: 'asc'}).exec(function(err, reservations){
      if (err) {
        console.log('ERROR: ' + err);
        return res.json({
          success : false,
          msg : 'Error al recuperar reservaciones del dia',
          err : err
        });
      }else{
        res.json({
          success: true,
          msg : "Cargadas exitosamente dia",
          reservations: reservations
        });
      }
    });
  };



  //Link routes and functions
  app.post('/reservations/user', findAllReservationsByUser);
  app.post('/reservations/user/hours', findAllReservationsByUserHours);
  app.get('/reservation/:id', findById);
  app.post('/reservation', addReservation);
  app.post('/reservation/cancel', cancelReservation);
  app.post('/reservation/checkin/:id_reservation', checkinReservation);
  app.post('/reservations/place/month', monthReservation);
  app.post('/reservations/place/day', dayReservation);
  app.put('/reservation/:id', updateReservation);
  app.delete('/reservation/:id', deleteReservation);

}

module.exports = function(app) {
  var Reservation = require('../models/reservation');
  var QRCode      = require('qrcode');

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
  }


  //Link routes and functions
  app.post('/reservations/user', findAllReservationsByUser);
  app.get('/reservation/:id', findById);
  app.post('/reservation', addReservation);
  app.post('/reservation/cancel', cancelReservation);
  app.put('/reservation/:id', updateReservation);
  app.delete('/reservation/:id', deleteReservation);

}

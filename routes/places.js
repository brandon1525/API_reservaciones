module.exports = function(app) {
  var Place = require('../models/place');

  findAllPlaces = function(req, res) {
    Place.find({},'_id name description total_people type create_at').exec(function (err, places) {
      if (err) {
        console.log('ERROR: ' + err);
        return res.json({
          success: false,
          msg: 'no hay lugares'
        });
      }
      res.json({
        success: true,
        places: places
      });
    });
  };
  findAllPlacesGroup = function(req, res) {
    Place.find({},'_id name description total_people type create_at').exec(function (err, places) {
      if (err) {
        console.log('ERROR: ' + err);
        return res.json({
          success: false,
          msg: 'no hay lugares'
        });
      }else{
        var types = {};
        places.forEach(function(item) {
          if (!(item.type in types)) {
            types[item.type]=[];
          }
          types[item.type].push(item);
        });
        res.json({
          success: true,
          places: types
        });
      }
    });

  };

  //GET - Return a Place with specified ID
  findById = function(req, res) {
  	Place.findById(req.params.id).populate('owner').exec(function (err, place) {
      if (err) {
        console.log('ERROR: ' + err);
        return res.json(500, {error: 'no hay lugares'});
      }else{
        res.json(place);
      }
    });
  };

  //POST - Insert a new Place in the DB
  addPlace = function(req, res) {
  	var place = new Place({
  		name : req.body.name,
  		description : req.body.description,
  		total_people : req.body.total_people,
      type : req.body.type,
      owner : req.body.owner,
      payment_method: {
        number_card :  req.body.number_card,
        cvv :  req.body.cvv,
        date :  req.body.date
      },
      type_plan :  req.body.type_plan
  	});
  	place.save(function(err) {
  		if(!err) {
  			console.log('Created');
        res.json({
          success: true,
          msg: 'Negocio creado con exito.',
          business_data: place
        });
  		} else {
        if(err.code==11000){
          return res.json({success: false, msg: 'Lugar ya existe.'});
        }else{
          return res.json({success: false, msg: "Error del sistema comunicate con tu administrador"});
        }
  		}
  	});
  	//res.send(place);
  };

  //PUT - Update a register already exists
  updatePlace = function(req, res) {
  	Place.findById(req.params.id, function(err, place) {
      place.name = req.body.name;
  		place.description = req.body.description;
  		place.total_people = req.body.total_people;
      place.type = req.body.type;
      place.payment_method = req.body.payment_method;
      place.type_plan = req.body.type_plan;
  		place.save(function(err) {
  			if(!err) {
  				//console.log('Actualizado');
          res.json({success: true, msg: 'Actualizado con exito.'});
  			} else {
  				console.log('ERROR: ' + err);
          return res.json({success: false, msg: 'No se pudo actializar el establecimiento.', err: err});
  			}
  			//res.send(place);
  		});
  	});
  }

  //DELETE - Delete a Place with specified ID
  deletePlace = function(req, res) {
  	Place.findById(req.params.id, function(err, place) {
  		place.remove(function(err) {
  			if(!err) {
  				console.log('Removed');
          res.json({success: true, msg: 'Removido con exito.'});
  			} else {
  				console.log('ERROR: ' + err);
          return res.json({success: false, msg: 'No se pudo eliminar el establecimiento.', err: err});
  			}
        //res.send(place);
  		})
  	});
  }
  //Link routes and functions
  app.get('/places', findAllPlaces);
  app.get('/places/grouped', findAllPlacesGroup);
  app.get('/place/:id', findById);
  app.post('/place', addPlace);
  app.put('/place/:id', updatePlace);
  app.delete('/place/:id', deletePlace);

}

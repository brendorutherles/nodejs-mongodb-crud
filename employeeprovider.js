var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

EmployeeProvider = function() {
  var that = this;
  mongodbUri =  'mongodb+srv://brendo:brendo1996@cluster0.hb9h9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  MongoClient.connect(mongodbUri, function(err, db){
    if(err) { return console.dir(err); }
    that.db = db;
  })
};


EmployeeProvider.prototype.getCollection= function(callback) {
  this.db.collection('employees', function(error, employee_collection) {
    if( error ) callback(error);
    else callback(null, employee_collection);
  });
};

//find all employees
EmployeeProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an employee by ID
EmployeeProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        employee_collection.findOne({_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new employee
EmployeeProvider.prototype.save = function(employees, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error)
      else {
        if( typeof(employees.length)=="undefined")
          employees = [employees];

        for( var i =0;i< employees.length;i++ ) {
          employee = employees[i];
          employee.created_at = new Date();
        }

        employee_collection.insert(employees, function() {
          callback(null, employees);
        });
      }
    });
};

// update an employee
EmployeeProvider.prototype.update = function(employeeId, employees, callback) {
    this.getCollection(function(error, employee_collection) {
      if( error ) callback(error);
      else {
        employee_collection.update(
					{_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
					employees,
					function(error, employees) {
						if(error) callback(error);
						else callback(null, employees)
					});
      }
    });
};

//delete employee
EmployeeProvider.prototype.delete = function(employeeId, callback) {
	this.getCollection(function(error, employee_collection) {
		if(error) callback(error);
		else {
			employee_collection.remove(
				{_id: employee_collection.db.bson_serializer.ObjectID.createFromHexString(employeeId)},
				function(error, employee){
					if(error) callback(error);
					else callback(null, employee)
				});
			}
	});
};

exports.EmployeeProvider = EmployeeProvider;

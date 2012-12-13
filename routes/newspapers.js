var Db = require('mongodb').Db,
Connection = require('mongodb').Connection,
Server = require('mongodb').Server;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

console.log("Connecting to " + host + ":" + port);

var db = new Db('newspapers', new Server(host, port, {}), {native_parser:true});
db.open(function(err, db) {
  console.log("in db.open");
  if(err){
    console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
    populateDb();
  } else {
    db.collection('newspapers', function(err, collection) {
      collection.find().toArray(function(err, result){
        if(result.length == 0){
          console.log("Populeaaza baza de date");
          populateDb();
        }
      });
    });
    //populateDb();
    //console.log("Aparent merge")
  }
});

/*
 * GET users listing.
 */
exports.list = function(req, res){
  db.collection('newspapers', function(err, collection){
    collection.find().toArray(function(err, items) {
            res.render('newspapers', {title: "test", items: items});
    });
  });
};

exports.fin_command = function(req, res){
  cc = req.body;

  bought_newspapers = []
  for(newspaper_name in cc) {
    bought_newspapers.push({"name" : newspaper_name});
  }

  db.collection('newspapers', function(err, collection){
      newspaper = collection.find({ "$or": bought_newspapers}, function(err, cursor) {
        cursor.toArray(function(err, items) {

          selected_newspapers = []
          total_price         = 0

          for(i = 0; i < items.length; i++){
            selected_newspapers.push({"name" : items[i]["name"], "addon" : items[i]["addon"]});
            if(items[i]["addon"] == 1){
              total_price += items[i]["price"]
              total_price += items[i]["addon_price"]
            } else {
              total_price += items[i]["price"]
            }
          }

          command = {
                      "created_at" : new Date(),
                      "newspapers" : selected_newspapers,
                      "total_price" : total_price
                    }

          db.collection("commands", function(err, collection_command){
            collection_command.insert(command, {safe:true}, function(err, result) {
              res.send(JSON.stringify({'success': 1}));
            });
          });
        });
      });
  });
}

// Private functions

var populateDb = function() {

  var newspapers = [
    {
      name: "Click",
      category: "Tabloide",
      periodicity: "Cotidian",
      newspaper_type: "Platit",
      area: "National",
      addon: 1,
      price: 10,
      addon_price: 15

    },
    {
      name: "Libertatea",
      category: "Tabloide",
      periodicity: "Cotidian",
      newspaper_type: "Platit",
      area: "National",
      addon: 0,
      price: 20,
      addon_price: 0
    }
  ]

  db.collection('newspapers', function(err, collection) {
    collection.insert(newspapers, {safe:true}, function(err, result) {console.log("Added the elements")});
  });
}

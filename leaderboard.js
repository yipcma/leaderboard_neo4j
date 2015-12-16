// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

// Players = new Mongo.Collection("players");

Players = Meteor.neo4j.collection("players");

if (Meteor.isClient) {
  Players.subscribe('allPlayers', null, 'node');
  Template.leaderboard.helpers({
    players: function() {
      return Players.find({
        'metadata.labels': 'Player'
      }, {
        sort: {
          score: -1
        }
      });
    },
    selectedName: function() {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    }
  });

  Template.leaderboard.events({
    'click .inc': function() {
      Players.update({
        _id: Session.get("selectedPlayer")
      }, {
        $inc: {
          score: 5
        }
      });
    }
  });

  Template.player.helpers({
    selected: function() {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function() {
      Session.set("selectedPlayer", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Players.publish('allPlayers', function() {
    return 'MATCH (node:Player) RETURN node ORDER BY node.score DESC';
  }, function() {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
        "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"
      ];
      var players = [];
      _.each(names, function(name) {
        players.push({
          name: name,
          score: Math.floor(Random.fraction() * 10) * 5,
          __labels: ':Player' // assign cypher label to nodes
        });
      });
      Players.insert(players);
    }
  });
}

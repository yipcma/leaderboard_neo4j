/* Allow client query execution */
Meteor.neo4j.allowClientQuery = true;
/* Custom URL to Neo4j should be here */
/* CHANGE THIS LINE IN ACCORDING TO YOUR NEO4J SETTINGS */
// replace usr:pwd for testing
Meteor.neo4j.connectionURL = 'http://usr:pwd@meteortest.sb04.stations.graphenedb.com:24789';
/* But deny all writing actions on client */
Meteor.neo4j.set.deny(neo4j.rules.write);

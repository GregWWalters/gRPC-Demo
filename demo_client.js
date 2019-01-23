/*
 * Demo gRPC server
 * Capco Lunch & Learns
 * Dallas, 23 of January, 2019
 *
 * For more information, see https://grpc.io
 */

// Location of the protocol buffers file defining the service
const PROTO_PATH = __dirname + '/protos/demo.proto';

// Import gRPC
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// Define gRPC settings
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

let demo_proto = grpc.loadPackageDefinition(packageDefinition).lunchDemo;

function main() {

    // Create the RPC stub
    let client = new demo_proto.Lunch('localhost:50051', grpc.credentials.createInsecure());

    let user;
    if (process.argv.length >= 3) {
        user = process.argv[2];
    } else {
        user = 'stranger';
    }

		let restaurant;

    client.greet({name: user}, function (err, response) {
        console.log(response.message);
    });

    client.pickRestaurant({}, function (err, restaurant) {
        if (err) {
            console.log('Whoops: '+err.message);
        } else {
            console.log('You\'re going to '+restaurant.name+'!');
            console.log('Head to '+restaurant.latitude+', '+restaurant.longitude+'.');
						client.getNutrition(restaurant, function (err, response) {
								if (err) {
									console.log('Whoops: '+err.message);
								} else {
									console.log(response);
								}
						});
					}
			});


}

main();

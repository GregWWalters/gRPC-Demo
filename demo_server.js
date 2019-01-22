/*
 * Demo gRPC server
 * Capco Lunch & Learns
 * Dallas, 23 of January, 2019
 *
 * For more information, see https://grpc.io
 */

const os = require('os');

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

// Implement service methods
function greet(call, callback) {
    callback(null, {message: 'Hello from ' + os.hostname + ', ' + call.request.name});
}

function pickRestaurant(call, callback) {
    let restaurant = {
        name: 'Chick-fil-a',
        address: '1201 Elm St Ste LL06, Dallas, TX 75270',
        latitude: 32.781281,
        longitude: -96.8040127
    };
    callback(null, restaurant);
}


// Start the RPC server
function main() {
    let server = new grpc.Server();

    // Map server functions to proto services
    server.addService (
        demo_proto.Lunch.service,
        {
            greet: greet,
            pickRestaurant: pickRestaurant
        }
    );

    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('Server running on port 50051');
}

main();

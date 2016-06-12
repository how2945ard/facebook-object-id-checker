// Include the cluster module
var cluster = require('cluster');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;
    var cpuCount = Math.ceil(cpuCount * 4 / 4);

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    // cluster.on('exit', (worker) => {

    //     // Replace the dead worker, we're not sentimental
    //     console.log('Worker ' + worker.id + ' died :(');
    //     if (worker.id < 10) {
    //         cluster.fork();
    //     }

    // });

    // Code to run if we're in a worker process
} else {
    var server = require("./app")
}
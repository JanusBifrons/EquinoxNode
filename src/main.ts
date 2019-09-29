
/// <reference path="server/Server.ts" />

let cServer: FireHare.Asteroids.Server = new FireHare.Asteroids.Server();

setInterval(() => {
    cServer.update();
}, 10);

// Test

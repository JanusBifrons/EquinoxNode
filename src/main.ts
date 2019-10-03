
/// <reference path="server/Server.ts" />

let cServer: FireHare.Equinox.Server = new FireHare.Equinox.Server();

setInterval(() => {
    cServer.update();
}, 1);

// Test

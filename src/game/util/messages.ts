namespace FireHare.Equinox {
    export class Messages {
        /// MISC
        static PlayerConnected: string = "PlayerConnected";
        static PlayerDisconnected: string = "PlayerDisconnected";
        static PlayerHandshake: string = "PlayerHandshake";

        /// GAMEPLAY
        static PlayerAction: string = "PlayerAction";
        static ObjectSpawned: string = "ObjectSpawned";
        static ObjectDestroyed: string = "ObjectDestroyed";
        static ObjectDamaged: string = "ObjectDamaged";
        static ShipFired: string = "ShipFired";
        static Synchronise : string = "Synchronise";
    }
}
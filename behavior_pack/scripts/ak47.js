let AK47_ID = "inflation:ak47";
let cooldown = 10; // クールダウン時間（ティック）

let system = server.registerSystem(1, "inflation.ak47");

system.initialize = function() {
    this.listenForEvent("minecraft:item_used", (eventData) => this.onItemUsed(eventData));
};

system.onItemUsed = function(eventData) {
    let item = eventData.data.item;

    // AK47を使用した場合の処理
    if (item.__identifier__ === AK47_ID) {
        let player = eventData.data.player;
        let pos = player.getPosition();
        
        // 矢を発射
        this.spawnArrow(pos, player.getRotation());

        // サウンドを再生（爆発音）
        this.playSound(pos);

        // クールダウンを設定
        this.setCooldown(player);
    }
};

system.spawnArrow = function(position, rotation) {
    let arrow = this.createEntity("minecraft:arrow", position);
    arrow.setRotation(rotation.x, rotation.y);
    arrow.getComponent("minecraft:motion").data = {
        x: Math.cos(rotation.y * (Math.PI / 180)) * Math.cos(rotation.x * (Math.PI / 180)),
        y: Math.sin(rotation.x * (Math.PI / 180)),
        z: Math.sin(rotation.y * (Math.PI / 180)) * Math.cos(rotation.x * (Math.PI / 180))
    };

    // 矢のダメージ設定
    arrow.getComponent("minecraft:damage").damage = 11; // ダメージ設定
};

system.playSound = function(position) {
    // サウンドをプレイヤーの位置で再生（爆発音）
    this.broadcastEvent("minecraft:play_sound", {
        "sound": "minecraft:random_explode",
        "position": position
    });
};

system.setCooldown = function(player) {
    player.addTag("inflation:ak47_cooldown");
    player.getComponent("minecraft:cooldown").data.cooldown = cooldown;
};

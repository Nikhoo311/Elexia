const players_maps = require("../schemas/players_maps");
const ExploreMap = require("./ExploreMap");
const { createCanvas } = require('canvas');

module.exports = class PlayerMap {
    static model = players_maps;
    
    constructor(player, map, ressources) {
        this.player = player;
        this.map = map;
        this.remainingResources = ressources;
        this.MAP_RADIUS = this.map.MAP_RADIUS;
        this.needToBeUpdated = false;
    }
    getRessourceByCoordinate(playerQ, playerR) {
        return this.remainingResources.find(
            ressource => ressource.q === playerQ && ressource.r === playerR
        ) || null;
    }

    async generateMapView(playerQ, playerR) {
        const HEX_SIZE = ExploreMap.HEX_SIZE;
        const VIEWPORT = ExploreMap.VIEWPORT;

        const WORLD = createCanvas(2000, 2000);
        const ctx = WORLD.getContext('2d');
        const worldCenter = { x: 1000, y: 1000 };

        const tiles = this.map.generateHexCoordinates(this.MAP_RADIUS);

        // Dessin des tuiles
        for (const { q, r } of tiles) {
            const { x, y } = this.map.hexToPixel(q, r);
            this.map.drawHex(ctx, worldCenter.x + x, worldCenter.y + y, HEX_SIZE, this.map.color, `${q},${r}`);
        }

        // Dessin des ressources
        for (const { q, r, color } of this.remainingResources) {
            const { x, y } = this.map.hexToPixel(q, r);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(worldCenter.x + x, worldCenter.y + y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Dessin du joueur
        const playerPos = this.map.hexToPixel(playerQ, playerR);
        const playerX = worldCenter.x + playerPos.x;
        const playerY = worldCenter.y + playerPos.y;

        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(playerX, playerY, 10, 0, 2 * Math.PI);
        ctx.fill();

        // Découpe autour du joueur
        const cropCanvas = createCanvas(VIEWPORT, VIEWPORT);
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(
            WORLD,
            playerX - VIEWPORT / 2,
            playerY - VIEWPORT / 2,
            VIEWPORT,
            VIEWPORT,
            0,
            0,
            VIEWPORT,
            VIEWPORT
        );

        return cropCanvas.toBuffer('image/png');
    }

    makeDirty() {
        this.needToBeUpdated = true;
    }
    makeClear() {
        this.needToBeUpdated = false;
    }
};
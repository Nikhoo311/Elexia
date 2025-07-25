const map = require('../schemas/maps');
const seed = require('../schemas/seeds');
const ingredient = require('../schemas/ingredients');

module.exports = class ExploreMap {
    static HEX_SIZE = 60;
    static VIEWPORT = 512;
    static #SQRT3 = Math.sqrt(3)
    static model = map;
    constructor(color = "#fdf3a1") {
        this.MAP_RADIUS = 6; // Nombre d'hexa autour du centre
        this.color = color;
        this.ressources = null;
    }
    

    static async findAll(type = null) {
        let filters = {};
        if (type) {
            filters.type = type;
        }
        const result = await ExploreMap.model.find(filters)
        .populate('ressources.seeds')
        .populate('ressources.ingredients');
        
        return result;
    }

    static async findOne(id) {
        const result = await ExploreMap.model.findOne({ _id: id })
        .populate('ressources.seeds')
        .populate('ressources.ingredients');
        
        return result;
    }

    /**
     * Change Map radius of the map.
     * @param {Number} value Map radius number
     */
    setMapRadius(value) {
        this.MAP_RADIUS = value;
    }

    setRessources(ressources) {
        const tiles = this.generateHexCoordinates(this.MAP_RADIUS);
        const ressourcesArray = [];
        this.ressources = ressources;
        for (const ressource of this.ressources) {
            for (const { q, r } of tiles) {
                if (Math.random() < ressource.spawnRate) {
                    ressourcesArray.push({ q, r, ressource });
                }
            }
        }
        this.ressources = ressourcesArray;
        
        return this.ressources;
    }
    
    hexToPixel(q, r) {
        const x = ExploreMap.HEX_SIZE * 1.5 * q;
        const y = ExploreMap.HEX_SIZE * ExploreMap.#SQRT3 * (r + q / 2);
        return { x, y };
    }
    
    drawHex(ctx, x, y, size, fill, label = '') {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 3 * i;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
    
        if (label) {
            ctx.fillStyle = '#000';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x, y);
        }
    }
    /**
     * Retourne la liste des coordonnées hexagonales inaccessible de la carte.
     * @returns {{q: number, r: number}[]}
     */
    _getInaccessibleZones(other = []) {
        const borderHexes = [];
        const radius = this.MAP_RADIUS + 1;

        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const s = -q - r;
                const distance = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));
                if (distance === radius) {
                    borderHexes.push({ q, r });
                }
            }
        }
        if (other) {
            other.forEach(hex => {
                borderHexes.push(hex)
            });
        }

        return borderHexes;
    }

    generateHexCoordinates(radius) {
        const coords = [];
        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                coords.push({ q, r });
            }
        }
        return coords;
    }
    
}
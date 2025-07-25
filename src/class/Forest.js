const ExploreMap = require("./ExploreMap");
const map = require('../schemas/maps');

module.exports = class Forest extends ExploreMap {
    static #RADIUS = 2;
    static model = map;
    constructor(id, type, ressources = []) {
        const color = '#c0ee9f'
        super(color)
        this.setMapRadius(Forest.#RADIUS);
        this.borders = super._getInaccessibleZones();
        
        this.id = id;
        this.type = type;
        this.ressources = ressources;
    }

    serialize() {
        return JSON.stringify({
            id: this.id,
            type: this.type,
            ressources: this.ressources
        });
    }

    static deserialize(jsonString) {
        const data = JSON.parse(jsonString);
        const forest = new Forest(data.id, data.type);
        forest.ressources = data.ressources || [];
        forest.setMapRadius(Forest.#RADIUS);
        forest.borders = forest._getInaccessibleZones();
        super.setRessources?.call(forest, forest.ressources);
        return forest;
    }

    async initRessources() {
        const object = await this.#getRessources();

        const uniqueByCoords = [];
        const seenCoords = [];
        this.ressources = [...object.seeds, ...object.ingredients]

        for (const item of this.ressources) {
            const key = item.q + ',' + item.r;

            if (!seenCoords.includes(key)) {
                seenCoords.push(key);
                uniqueByCoords.push(item);
            }
        }
        this.ressources = uniqueByCoords;
        super.setRessources(this.ressources);
        
        return this;
    }

    async #getRessources() {
        const result = await ExploreMap.findOne(this.id);
        return result.ressources;
    }
}
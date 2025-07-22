export const weightClasses = {
    MMA: [
        { name: 'Flyweight', maxWeight: 125 },
        { name: 'Bantamweight', maxWeight: 135 },
        { name: 'Featherweight', maxWeight: 145 },
        { name: 'Lightweight', maxWeight: 155 },
        { name: 'Welterweight', maxWeight: 170 },
        { name: 'Middleweight', maxWeight: 185 },
        { name: 'Light Heavyweight', maxWeight: 205 },
        { name: 'Heavyweight', maxWeight: 265 },
        { name: 'Super Heavyweight', maxWeight: Infinity }
    ],
    Boxing: [
        { name: 'Flyweight', maxWeight: 112 },
        { name: 'Bantamweight', maxWeight: 118 },
        { name: 'Featherweight', maxWeight: 126 },
        { name: 'Lightweight', maxWeight: 135 },
        { name: 'Light Welterweight', maxWeight: 140 },
        { name: 'Welterweight', maxWeight: 147 },
        { name: 'Light Middleweight', maxWeight: 154 },
        { name: 'Middleweight', maxWeight: 160 },
        { name: 'Super Middleweight', maxWeight: 168 },
        { name: 'Light Heavyweight', maxWeight: 175 },
        { name: 'Cruiserweight', maxWeight: 200 },
        { name: 'Heavyweight', maxWeight: Infinity }
    ],
    MuayThai: [
        { name: 'Light Flyweight', maxWeight: 106 },
        { name: 'Flyweight', maxWeight: 112 },
        { name: 'Bantamweight', maxWeight: 118 },
        { name: 'Featherweight', maxWeight: 126 },
        { name: 'Lightweight', maxWeight: 132 },
        { name: 'Light Welterweight', maxWeight: 138 },
        { name: 'Welterweight', maxWeight: 147 },
        { name: 'Light Middleweight', maxWeight: 156 },
        { name: 'Middleweight', maxWeight: 165 },
        { name: 'Light Heavyweight', maxWeight: 175 },
        { name: 'Cruiserweight', maxWeight: 190 },
        { name: 'Heavyweight', maxWeight: 209 },
        { name: 'Super Heavyweight', maxWeight: Infinity }
    ],
    Kickboxing: [
        { name: 'Light Flyweight', maxWeight: 106 },
        { name: 'Flyweight', maxWeight: 112 },
        { name: 'Bantamweight', maxWeight: 118 },
        { name: 'Featherweight', maxWeight: 125 },
        { name: 'Lightweight', maxWeight: 132 },
        { name: 'Light Welterweight', maxWeight: 139 },
        { name: 'Welterweight', maxWeight: 147 },
        { name: 'Light Middleweight', maxWeight: 156 },
        { name: 'Middleweight', maxWeight: 165 },
        { name: 'Light Heavyweight', maxWeight: 178 },
        { name: 'Cruiserweight', maxWeight: 189 },
        { name: 'Heavyweight', maxWeight: 203 },
        { name: 'Super Heavyweight', maxWeight: Infinity }
    ],
    BJJ: [
        { name: 'Rooster', maxWeight: 122.5 },
        { name: 'Light Feather', maxWeight: 136 },
        { name: 'Feather', maxWeight: 149 },
        { name: 'Light', maxWeight: 162.5 },
        { name: 'Middle', maxWeight: 175 },
        { name: 'Medium Heavy', maxWeight: 188 },
        { name: 'Heavy', maxWeight: 202 },
        { name: 'Super Heavy', maxWeight: 215 },
        { name: 'Ultra Heavy', maxWeight: Infinity }
    ],
    Wrestling: null
};

export function getWeightClass(discipline, weightLbs) {
    const classes = weightClasses[discipline];
    if (discipline === 'Wrestling' || !weightClasses[discipline]) {
        return null;
    }

    for (let c of classes) {

        if (weightLbs <= c.maxWeight) {
            return c.name;
        }
    }

    return null; // if weight doesnt match any class
}

let canvasWidth = 640;
let canvasHeight = 480;
// input parameters
let nAgents = 900;
let nGroupIdentities = 3; // max 5
let maxSimilarityWanted = 0.5;
let maxDifferenceWanted = 0.3;
// model variables
let agents = [];
let groupIdentities = [];

// visualization variables
let agentDiameter = 10;

function setup() {
    // data
    groupIdentities = [ // all possible group identities
        {name: "A", color: color(255, 233, 0, 255)}, // (R, G, B, Alpha)
        {name: "B", color: color(255, 50, 12, 255)},
        {name: "C", color: color(255, 180, 0, 255)},
        {name: "D", color: color(255, 117, 0, 255)},
        {name: "E", color: color(255, 0, 125, 255)}
    ];
    createCanvas(canvasWidth, canvasHeight);
    // create nAgents agents with random position in canvas (without overlap) and with random group identity
    while (agents.length < nAgents) {
        let a = new Agent1(random(canvasWidth), random(canvasHeight), agentDiameter, 
            random(groupIdentities.slice(0, nGroupIdentities)), maxSimilarityWanted);
        if (!overlapped(a)) {
            agents.push(a);
        }
    }
}

function draw() {
    background(255);
    for (let i = 0; i < agents.length; i++) {
        agents[i].show();
        // if agent is unhappy, move to a new random location
        if (!agents[i].approvesNeighborhood(agents)) {
            agents[i].moveRandomly();
        }
    }
}

function overlapped(a) {
    for (let item of agents) {
        // if distance between the center of agents is less than the sum of their radius, they overlap
        let dist = sqrt(sq(a.position.x - item.position.x) + sq(a.position.y - item.position.y));
        if (dist < a.diameter/2 + item.diameter/2) {
            return true;
        }
    }
    return false;
}

function containedInCanvas(point) {
    if (point.x < 0 || point.x >= canvasWidth || point.y < 0 || point.y >= canvasHeight) {
        return false;
    }
    return true;
}
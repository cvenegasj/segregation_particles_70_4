
// Matter.Engine modules for physics
var Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;
var engine;

let canvasWidth = 640;
let canvasHeight = 480;
// input parameters
let nAgents = 70;
let nGroupIdentities = 4; // max 5
let maxSimilarityWanted = 0.5;
let maxDifferenceWanted = 0.3;
// model variables
let agents = [];
let groupIdentities = [];

// visualization variables
let agentDiameter = 10;

var leftBound, rightBound, topBound, bottomBound;

function setup() {
    // data
    groupIdentities = [ // all possible group identities
        {name: "A", color: color(255, 233, 0, 255)}, // (R, G, B, Alpha)
        {name: "B", color: color(255, 0, 125, 255)},
        {name: "C", color: color(255, 117, 0, 255)},
        {name: "D", color: color(255, 50, 12, 255)},
        {name: "E", color: color(255, 180, 0, 255)}
    ];
    createCanvas(canvasWidth, canvasHeight);
    engine = Engine.create();
    engine.world.bounds.min.x = -Infinity;
    engine.world.bounds.min.y = -Infinity;
    engine.world.bounds.max.x = Infinity;
    engine.world.bounds.max.y = Infinity;
    // Disable gravity
    engine.world.gravity.scale = 0;
    //engine.world.gravity.y = 0;

    // boundaries
    leftBound = Matter.Bodies.rectangle(0, canvasHeight/2, 30, canvasHeight, {
        isStatic: true,
        render: {
          visible: false
        }
    });

    rightBound = Matter.Bodies.rectangle(canvasWidth, canvasHeight/2, 30, canvasHeight, {
        isStatic: true,
        render: {
          visible: false
        }
    });

    bottomBound = Matter.Bodies.rectangle(canvasWidth/2, canvasHeight, canvasWidth, 30, {
        isStatic: true,
        render: {
          visible: false
        }
    });

    topBound = Matter.Bodies.rectangle(canvasWidth/2, 0, canvasWidth, 30, {
        isStatic: true,
        render: {
          visible: false
        }
    });
    var bounds = [leftBound, rightBound, topBound, bottomBound];
    World.add(engine.world, bounds);
    /**********/

    // create nAgents agents with random position in canvas (without overlap) and with random group identity
    while (agents.length < nAgents) {
        let a = new Agent1(random(canvasWidth), random(canvasHeight), agentDiameter, 
            random(groupIdentities.slice(0, nGroupIdentities)), maxSimilarityWanted);
        if (!overlapped(a)) {
            agents.push(a);
        }
    }

    // add all of the agents to the world
    World.add(engine.world, agents);
    // run Matter.js engine
    Engine.run(engine);   
}

function draw() {
    background(127);
    // Update Matter.js engine
    Engine.update(engine);

    for (let i of agents) {
        for (let j of agents) {
            if (i != j) {
                i.interact(j);
                i.show();
            }
        }
    }

    stroke(255);
    strokeWeight(1);
    fill(170);
    rectMode(CENTER);
    //rect(leftBound.position.x, leftBound.position.y, 20, canvasHeight); 
    //rect(rightBound.position.x, rightBound.position.y, 20, canvasHeight); 
    //rect(topBound.position.x, topBound.position.y, canvasWidth, 20); 
    //rect(bottomBound.position.x, bottomBound.position.y, canvasWidth, 20);
}


function overlapped(a) {
    for (let item of agents) {
        // if distance between the center of agents is less than the sum of their radius, they overlap
        let dist = sqrt(sq(a.body.position.x - item.body.position.x) + sq(a.body.position.y - item.body.position.y));
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

// Matter.Engine modules for physics
var Engine = Matter.Engine,
    //Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;
var engine;

var canvasWidth;
var canvasHeight;
// input parameters
var nAgents; // # particles
var nGroupIdentities; // # colors (max 5)
var maxSimilarityWanted = 0.5;
var maxDifferenceWanted = 0.3;
// model variables
var agents = [];
var groupIdentities = [];

// visualization variables
var agentDiameter = 10;

var leftBound, rightBound, topBound, bottomBound;

function setup() {
    // data
    /*groupIdentities = [ // colors fire
        {name: "A", color: color(255, 233, 0, 255)}, // (R, G, B, Alpha)
        {name: "B", color: color(255, 0, 125, 255)},
        {name: "C", color: color(255, 117, 0, 255)},
        {name: "D", color: color(255, 50, 12, 255)},
        {name: "E", color: color(255, 180, 0, 255)}
    ];*/
    groupIdentities = [ // all possible group identities
        {name: "A", color: color(115, 244, 255, 255)}, // cyan
        {name: "B", color: color(255, 0, 83, 255)}, // red
        {name: "C", color: color(255, 238, 0, 255)}, // yellow
        {name: "D", color: color(255, 20, 171, 255)}, // pink
        {name: "E", color: color(88, 255, 21, 255)} // green
    ];
    // parameters from URL
    let params = getURLParams();
    // if no URL parameters were provided
    if (Object.keys(params).length === 0 && params.constructor === Object) {
        nAgents = 70;
        nGroupIdentities = 4;
    } else {
        nAgents = parseInt(params.agents);
        nGroupIdentities = parseInt(params.colors);
        if (nGroupIdentities > 5) {
            nGroupIdentities = 5;
        }
    }

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight
    createCanvas(canvasWidth, canvasHeight);
    engine = Engine.create();
    engine.world.bounds.min.x = -Infinity;
    engine.world.bounds.min.y = -Infinity;
    engine.world.bounds.max.x = Infinity;
    engine.world.bounds.max.y = Infinity;
    // Disable gravity
    engine.world.gravity.scale = 0;
    //engine.world.gravity.x = 0;
    //engine.world.gravity.y = 0;

    // boundaries
    leftBound = Matter.Bodies.rectangle(0, canvasHeight/2, 1, canvasHeight, {
        isStatic: true,
        restitution: 1,
        render: {
          visible: false
        }
    });

    rightBound = Matter.Bodies.rectangle(canvasWidth, canvasHeight/2, 1, canvasHeight, {
        isStatic: true,
        restitution: 1,
        render: {
          visible: false
        }
    });

    bottomBound = Matter.Bodies.rectangle(canvasWidth/2, canvasHeight, canvasWidth, 1, {
        isStatic: true,
        restitution: 1,
        render: {
          visible: false
        }
    });

    topBound = Matter.Bodies.rectangle(canvasWidth/2, 0, canvasWidth, 1, {
        isStatic: true,
        restitution: 1,
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
    background(0);
    // Update Matter.js engine
    Engine.update(engine);

    for (let i of agents) {
        for (let j of agents) {
            if (i !== j) {
                i.interact(j);
                i.show();
            }
        }
    }

    stroke(255);
    strokeWeight(1);
    fill(170);
    rectMode(CENTER);
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

function windowResized() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight; 
    resizeCanvas(canvasWidth, canvasHeight);
    // update position of boundaries
    Matter.Body.setPosition(leftBound, {x: -15, y: canvasHeight/2});
    Matter.Body.setPosition(rightBound, {x: canvasWidth + 15, y: canvasHeight/2});
    Matter.Body.setPosition(bottomBound, {x: canvasWidth/2, y: canvasHeight + 15});
    Matter.Body.setPosition(topBound, {x: canvasWidth/2, y: 0 - 15});
  }
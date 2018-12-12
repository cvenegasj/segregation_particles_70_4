class Agent1 {

    constructor(positionX, positionY, diameter, groupIdentity, similarityWanted) {
        this.position = createVector(positionX, positionY);
        this.velocity = createVector(); //p5.Vector.random2D();
        this.diameter = diameter;
        this.groupIdentity = groupIdentity;
        this.similarityWanted = similarityWanted;
        // this.differenceWanted = differenceWanted
        this.neighbors = null;
    }

    show() {
        //console.log(this.groupIdentity.color);
        noStroke();
        fill(this.groupIdentity.color)
        ellipse(this.position.x, this.position.y, this.diameter);
    }

    approvesNeighborhood(agents) {
        var similarNeighbors = 0;
        this.neighbors = [];
        // find all neighbors and count the ones who have same groupIdentity.
        for (let item of agents) {
            if (this === item) {
                // This is me! Do not count.
                continue;
            }
            if (this.isNeighbor(item)) {
                this.neighbors.push(item);
                if (this.groupIdentity.name == item.groupIdentity.name) {
                    similarNeighbors++;
                }
            }
        }
        // check if similarity threshold is met
        return (similarNeighbors/this.neighbors.length >= this.similarityWanted);
    }

    isNeighbor(other) {
        // Distance betweeen me and other 
        //let dist = sqrt(sq(this.position.x - other.position.x) + sq(this.position.y - other.position.y));
        let dist = p5.Vector.dist(this.position, other.position);
        // Item is a neighbor if the distance from its center to mine is at most 3 times my radius.
        // All agents have same diameters in this model.
        return (dist <= 3 * other.diameter / 2);
    }
    
    moveRandomly() {
        // change direction
        // random destination
        var destinationX = this.position.x + random(-8, 8);
        var destinationY = this.position.y + random(-8, 8);
        var destination = createVector(destinationX, destinationY);

        while (!containedInCanvas(destination)) {
            destinationX = this.position.x + random(-30, 30);
            destinationY = this.position.y + random(-30, 30);
            destination = createVector(destinationX, destinationY);
        }

        this.velocity = p5.Vector.sub(destination, this.position);
        this.position = p5.Vector.add(this.position, this.velocity);
    }
}
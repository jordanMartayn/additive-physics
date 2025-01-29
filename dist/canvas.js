"use strict";
//globals
const fpsCounter = document.getElementById('fpsCounter');
let width = 800;
let height = 600;
let thisFrame = 0;
let lastFrame = 0;
let canvas = document.getElementById('myCanvas');
let ctx;
let bodies = [];
//classes
class Body {
    // Constructor to initialize properties
    constructor(rad, pos) {
        this.velocity = 0;
        this.verticleDistancePixelBank = 0;
        this.azimuth = 0;
        this.radius = rad;
        this.pos = pos;
        bodies.push(this);
    }
    // Method
    draw() {
        if (!ctx)
            return;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}
// Methods
const setUp = () => {
    if (!canvas) {
        console.error('Canvas not found');
        return false;
    }
    ctx = canvas.getContext("2d"); // Assign to global ctx
    if (!ctx) {
        console.error('Failed to get 2D context');
        return false;
    }
    return true;
};
const clearCnvs = () => {
    if (!ctx)
        return;
    ctx.clearRect(0, 0, width, height);
};
const drawBg = () => {
    if (!ctx)
        return;
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, width, height);
};
const startingBody = () => {
    new Body(20, { x: 50, y: 50 });
};
const drawBodies = () => {
    bodies.forEach((body) => {
        body.draw();
    });
};
const gravity = () => {
    //loop through bodies applying a downward force
    //s = u t + 1/2 *​ a * t^2
    //s:distance(m), u:inital-velocity(m/s), t=time(sec), a=accell(m/s^2)
    //to update velocity
    //v = u + at
    //v:final vel
    const t = (thisFrame - lastFrame) / 1000;
    const a = 9.81; // earth gravity.
    bodies.forEach((body) => {
        //I will need to find the vertical component of the velocity when I add any other forces,
        //But for now we are asuming the velocity is only verticle with positive being down
        const u = body.velocity;
        const s = (u * t) + (0.5 * a * Math.pow(t, 2));
        //s is so small i need to add each frames s together until i get 1 pixel then i need to clear and repeat
        body.verticleDistancePixelBank += s;
        //update velocity
        const v = u + (a * t);
        body.velocity = v;
        console.log('Distance: ', s);
        console.log('Final Velocity: ', v);
        if (body.verticleDistancePixelBank < 1)
            return;
        if (s < 1) {
            body.verticleDistancePixelBank -= 1;
            body.pos.y += 1;
        }
        else {
            body.verticleDistancePixelBank -= s;
            body.pos.y += s;
        }
    });
};
//animation loop
const animationFrame = (timestamp = performance.now()) => {
    //frame times
    lastFrame = thisFrame;
    thisFrame = timestamp;
    const fps = 1 / (thisFrame - lastFrame) * 1000;
    fpsCounter.innerHTML = `FPS: ${Math.round(fps)}`;
    requestAnimationFrame(animationFrame);
    clearCnvs();
    drawBg();
    drawBodies();
    gravity();
};
//Main
const main = () => {
    if (!setUp())
        return;
    startingBody();
    animationFrame();
};
//exe
document.addEventListener('DOMContentLoaded', main);

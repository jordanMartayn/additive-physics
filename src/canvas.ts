//globals
const fpsCounter = document.getElementById('fpsCounter') as HTMLParagraphElement;

let width: number = 800;    
let height: number = 600;
let thisFrame: number = 0;
let lastFrame: number = 0;

let canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let bodies: Body[] = [];

//types
type coord = { x:number, y:number };

//classes
class Body {
  // Properties
  radius: number;
  pos: coord;
  velocity: number = 0;
  verticleDistancePixelBank: number = 0;
  azimuth: number = 0;

  // Constructor to initialize properties
  constructor(rad: number, pos: coord) {
    this.radius = rad;
    this.pos = pos;
    bodies.push(this);
  }

  // Method
  draw(): void {
    if ( !ctx ) return;
    ctx.beginPath();
    ctx.arc( this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    
  }
}

// Methods
const setUp = (): boolean => {
    if ( !canvas ) {
        console.error('Canvas not found');
        return false;
    }

    ctx = canvas.getContext("2d"); // Assign to global ctx
    if (!ctx) {
        console.error('Failed to get 2D context');
        return false;
    }
    
    return true;
}

const clearCnvs = (): void => {
    if ( !ctx ) return;
    ctx.clearRect(0,0,width,height);
}

const drawBg = ():void => {
    if ( !ctx ) return;
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, width, height);
}

const startingBody = ():void => {
    new Body( 20, {x:50,y:50} );
}

const drawBodies = ():void => {
    bodies.forEach( (body) => {
        body.draw();
    })
}

const gravity = ():void => {
    //loop through bodies applying a downward force
    //s = u t + 1/2 *​ a * t^2
    //s:distance(m), u:inital-velocity(m/s), t=time(sec), a=accell(m/s^2)
    //to update velocity
    //v = u + at
    //v:final vel
    const t = (thisFrame - lastFrame) / 1000
    const a = 9.81 // earth gravity.
    bodies.forEach( (body) => {
        //I will need to find the vertical component of the velocity when I add any other forces,
        //But for now we are asuming the velocity is only verticle with positive being down
        const u = body.velocity
        const s = ( u * t ) + (0.5 * a * Math.pow(t,2));
        //s is so small i need to add each frames s together until i get 1 pixel then i need to clear and repeat
        body.verticleDistancePixelBank += s;
        //update velocity
        const v = u + (a * t);
        body.velocity = v;
        console.log('Distance: ',s)
        console.log('Final Velocity: ',v)
        if ( body.verticleDistancePixelBank < 1 ) return;
        if ( s < 1 ) {
            body.verticleDistancePixelBank -= 1;
            body.pos.y += 1;
        } else {
            body.verticleDistancePixelBank -= s;
            body.pos.y += s;
        }


    })
}

//animation loop
const animationFrame = ( timestamp: number = performance.now() ):void => {
    //frame times
    lastFrame = thisFrame;
    thisFrame = timestamp;
    const fps =  1 / ( thisFrame - lastFrame ) * 1000 ;
    fpsCounter.innerHTML = `FPS: ${Math.round(fps)}`;

    requestAnimationFrame(animationFrame)
    clearCnvs();
    drawBg();
    drawBodies();
    gravity();
}

//Main
const main = ():void => {
    if ( !setUp() ) return;
    startingBody();
    animationFrame();
}

//exe
document.addEventListener( 'DOMContentLoaded' , main );

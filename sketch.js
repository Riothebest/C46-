const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const World = Matter.World;

var myEngine, myWorld;
var player, playerImg;
var dustbin, dustbinImg;
var edges , wall;
var kicked = false, flying = true;
var bottleImg , bottle;
var ground;
var score = 0;
var sensorer, bottlecopy;

function preload()
{
  playerImg = loadImage("./assets/player.png");
  dustbinImg = loadImage("./assets/dustbin.png");
  bottleImg = loadImage("./assets/waterBottle.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  myEngine = Engine.create();
  myWorld = myEngine.world;

  player = createSprite(100,height-100);
  player.addImage(playerImg);
  player.scale = 0.25

  dustbin = createSprite(width-250,height-100);
  dustbin.addImage(dustbinImg);
  dustbin.scale = 0.5;
  dustbin.velocityX = 3;
  //dustbin.setCollider("rectangle",0,0,400,5000)
  //dustbin.debug = true;

  edges = createEdgeSprites();
  wall = createSprite(width/2,height,5,150);
  wall.visible = false;

  bottle = new Bottle(400,1,100,100);

  var ground_options ={
    isStatic : true,
  }
  ground = Bodies.rectangle(width/2,height,width,20,ground_options);
  World.add(myWorld,ground);

  sensorer = createSprite(width/2+width/4,height/2+height/4,width/2,height/2);
  sensorer.visible= false;
  bottlecopy = createSprite(bottle.body.position.x,bottle.body.position.y,100,100)
  bottlecopy.visible = false
}

function draw() {
  background(255,255,255);  
  bottlecopy.x = bottle.body.position.x
  bottlecopy.y = bottle.body.position.y;
  Engine.update(myEngine);

  if(dustbin.isTouching(edges[1]))
  {
    dustbin.velocityX = -3;
  }
  if(dustbin.isTouching(wall))
  {
    dustbin.velocityX = 3;
  }
  if(kicked && bottle !=null){
    if(collide(bottle.body,dustbin))
    {
      score += 10;
      flying = true;
    }
  }
 
 console.log(score)
 if(bottle!=null)
 {
  bottle.display();
 }

 if(bottle === null)
 {
  bottle = new Bottle(400,1,100,100);
 }

 if(bottle != null)
 {
   if(bottle.body.position.x>width)
   {
     World.remove(myWorld,bottle);
     bottle = null;
   }
   var d = dist(bottle.body.position.x,bottle.body.position.y,ground.x,ground.y)
   if(d<=100)
   {
     flying = false;
   }
   /*if(bottlecopy.isTouching(ground) && bottlecopy.isTouching(sensorer))
   {
    World.remove(myWorld,bottle);
    bottle = null;
   } */
 }

  drawSprites();
  text("Score: "+score,200,200)
}
function keyReleased()
{
  if(keyCode === 32)
  {
    if(flying)
    Matter.Body.applyForce(bottle.body,bottle.body.position,{x:0.5,y:-0.5});
    kicked = true;
    flying=false;
  }
}
function collide(body,sprite)
{
  if(body!=null)
  {
    var d = dist(body.position.x,body.position.y,sprite.x,sprite.y);
    if(d <= 120)
    {
      World.remove(myWorld,body);
      bottle = null;
      return true;
      
    }
    else{
      return false;
    }
  }
}
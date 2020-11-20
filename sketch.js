var PLAY = 1;
var END = 0;
var gameState = PLAY;

var carImage,OppCarImg,Obs1Image,Obs1;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, OppCar;
var backgroundImg;
var score=0;
var jumpSound, collidedSound;

var gameOver, car1;


function preload(){
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  backgroundImg = loadImage("RustBeltCity.png");
Obs1Image = loadImage("RustPickup.png");
  
  OppCarIm = loadImage("Opp-vroom2.jpg");
carImage= loadImage("vroom1.png");
  
  groundImage = loadImage("assets/ground.png");
  
  cloudImage = loadImage("assets/cloud.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
 car1= createSprite(400,height-60,20,50);
  
  
  car1.addImage(carImage);
  car1.setCollider('circle',0,0,50)
  car1.scale = 0.5

  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width
  ground.velocityX = -(6 + 3*score/100);
  
 /* gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  
  
  gameOver.scale = 0.5;
  

  gameOver.visible = false;
  
 */
   invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
 background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && car1.y  >= height-120) {
      jumpSound.play( )
      car1.velocityY = -22;
       touches = [];
    }
    
    car1.velocityY = car1.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    car1.collide(invisibleGround);
    spawnClouds();
   spawnObstacles();
  
    if(obstaclesGroup.isTouching(car1)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    //gameOver.visible = true;

    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    car1.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
  
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = car1.depth;
    car1.depth = car1.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(width+20,height-85,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(Obs1Image);
              break;
      case 2: obstacle.addImage(Obs1Image);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = car1.depth;
    car1.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}


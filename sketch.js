//Create variables here
var canvas;
var gameState = 0;
var dog;
var database;
var foodS, foodStock;
var doghappy,dogdown;
var bedroom,garden,washroom;
var fedTime, lastFed, foodObj;
var dogfed, dogfeed;
var readState, changeState;
function preload()
{
  dogdown = loadImage("images/dogImg1.png");
  doghappy = loadImage("images/dogImg.png");
bedroom = loadImage("images/virtualpetimages/Bed Room.png");
garden = loadImage("images/virtualpetimages/Garden.png");
washroom = loadImage("images/virtualpetimages/Wash Room.png");

	//load images here
}

function setup() {
canvas = createCanvas(500, 500);
database = firebase.database();

foodObj = new Milk();

foodStock = database.ref('Food');
foodStock.on("value",readStock);

fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState  = database.ref('gameState');
  readState.on("value",function(data){
   gameState = data.val();
    });

  dog = createSprite(250,250,30,30);
  dog.addImage(dogdown);
  dog.scale = 0.2;

dogfed = createButton("Feed the dog");
dogfed.position(700,95);
dogfed.mousePressed(feedDog);

dogfeed = createButton("Add food");
dogfeed.position(800,95);
dogfeed.mousePressed(addFoods);



}


function draw() {  
background(46,139,87);


currentTime = hour();
if(currentTime == (lastFed+1)){
update("Playing");
foodObj.garden();
} else if (currentTime==(lastFed+2)){
update("Sleeping");
foodObj.bedroom();
} else if(currentTime >(lastFed+2) && currentTime<=(lastFed+4)){
update("Bathing");
foodObj.washroom();
} else{
update("Hungry");
foodObj.display();
}

  if(gameState!= "Hungry"){
  dogfeed.hide();
  dogfed.hide();
  dog.remove();
  } else{
  dogfeed.show();
  dogfed.show();
  dog.addImage(dogdown);
  }

 

  textSize(20);
text("20",450,50);
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
  text("Last Feed:", + lastFed%12 + "PM",350,30);
  } else if(lastFed==0){
  text("last Feed: 12AM",350,30);
  } else{
  text("Last Feed:" + lastFed+ "AM", 350,30);
  }
  drawSprites();


  //add styles here

}


  
function readStock(data){
foodS = data.val();
foodObj.updateFoodStock(foodS);
}



function feedDog(){
dog.addImage(doghappy);

if(foodObj.getFoodStock()<=0){
foodObj.updateFoodStock(foodObj.getFoodStock()*0);
}
else{
foodObj.updateFoodStock(foodObj.getFoodStock()-1);
}

database.ref('/').update({
Food:foodObj.getFoodStock(),
FeedTime:hour()
})
}



function writeStock(x){
database.ref('/').update({
Food:x
})
}





function addFoods(){
foodS++;
database.ref('/').update({
Food:foodS
})
}

function update(state){
  database.ref('/').update({
  gameState:state
  });
  }

function removeFood () {
  dog.add(doghappy);
  foodS--;
  database.ref('/').update({
  Food:foodS
  })
}




// 12月27日 添加按钮（方法一）  
// 全局变量初始赋值
var backImg;
var faceImg = [];
var cardSelected = [];
var tiles = [];
var NUM_COLS = 5;
var NUM_ROWS = 4;
var numTries = 0; //翻卡片的尝试次数
var numMatches = 0; //翻卡片的匹配数
var flippedTiles = []; //存放翻转卡片的数组
var delayStartFC = null;
var btn1; // 按钮一

// 预加载图片
function preload(){
   backImg = loadImage("avatars/leaf-green.png");
   faceImg = [loadImage("avatars/leafers-seed.png"),
       loadImage("avatars/leafers-seedling.png"),
       loadImage("avatars/leafers-sapling.png"),
       loadImage("avatars/leafers-tree.png"),
       loadImage("avatars/leafers-ultimate.png"),
       loadImage("avatars/marcimus.png"),
       loadImage("avatars/mr-pants.png"),
       loadImage("avatars/mr-pink.png"),
       loadImage("avatars/old-spice-man.png"),
       loadImage("avatars/robot_female_1.png")
   ];
}

function setup() {
   createCanvas(400, 400);
   background(220);  
   frameRate(40);
  
   //创建卡片对象
   var Tile = function(x, y, face){
      this.x = x;
      this.y = y;
      this.size = 50;
      this.face = face;
      this.isFaceUp = false; //卡片正面向上的属性值
      this.isMatch = false; //卡片匹配度的属性值
   };

   //定义卡片绘制方法(通过isFaceUp判断正反面)
   Tile.prototype.draw = function(){ 
      fill(214, 247, 202);
      strokeWeight(2);
      rectMode(CORNER);
      rect(this.x, this.y, this.size, this.size, 10);
      if (this.isFaceUp) {
        image(this.face, this.x, this.y, this.size, this.size);
      } else {
        image(backImg, this.x, this.y, this.size, this.size);
      }
   }; 

  //判断鼠标与卡片相对位置的方法
  Tile.prototype.isUnderMouse = function(x, y){
      return (x >= this.x && x <= this.x + this.size && y >= this.y && y <= this.y + this.size);      
  };
  
  //创建按钮Button构造函数,config(设置)对象参数
  var Button = function(config){
      this.x = config.x || 0;
      this.y = config.y || 0;
      this.width = config.width || 80;
      this.height = config.height || 40;
      this.label = config.label || "Replay";
      this.onClick = config.onClick || function(){};
  };

  //Button的属性
  Button.prototype.draw = function(){
      rectMode(CENTER);
      fill("#8296DC");
      rect(this.x, this.y, this.width, this.height);
      textSize(15);
      fill("#1446DC");
      textAlign(CENTER, CENTER);
      text(this.label, this.x, this.y);
  };
  
  //传入mouseX 和mouseY
  Button.prototype.isMouseInside = function(x, y){
      console.log("isMouseInside(x,y)", x, y);
      return  x > (this.x - this.width / 2) && 
              x < (this.x + this.width / 2) && 
              y > (this.y - this.height / 2)&& 
              y < (this.y + this.height / 2);
  };
  
  Button.prototype.handleMouseClick = function(x, y){
      if (this.isMouseInside(x, y)){
          this.onClick();
      }
  };
  
  //创建按钮个体
  btn1 = new Button({
      x: 200,
      y: 330,
      onClick: function(){  // 卡片重置的代码是否还可优化？
          // Reset game state;
          numTries = 0; 
          numMatches = 0;
          flippedTiles = [];
          delayStartFC = null;
          
          for (let i = 0; i < tiles.length; i++) {
            tiles[i].isMatch = false;
            tiles[i].isFaceUp = false;
          }
          
          redraw();  //Immediately update the canvas
          
          //重新填充cardSelected数组 
          cardSelected = []; 
          var possibleFaces = faceImg.slice(0); 
          for (let i=0; i < (NUM_COLS * NUM_ROWS) / 2; i++){ 
            var randomInd = floor(random(possibleFaces.length)); 
            cardSelected.push(possibleFaces[randomInd]); 
            cardSelected.push(possibleFaces[randomInd]); 
            possibleFaces.splice(randomInd,1); 
          } 
          shuffleArray(cardSelected); 
          
          tiles = []; 
          for (let i = 0; i < NUM_COLS; i++) { 
            for (let j = 0; j < NUM_ROWS; j++) { 
              var tileX = i * 54 + 65; 
              var tileY = j * 54 + 40; 
              var tileFace = cardSelected.pop(); 
              tiles.push(new Tile(tileX, tileY, tileFace)); 
            } 
          }          
      }
  });
  console.log("btn1 has been created:",btn1);  
  
  //随机抽取卡片序号（0~9数组长度），且重复存入cardSelected数组）
  var possibleFaces = faceImg.slice(0);
  for (let i=0; i < (NUM_COLS * NUM_ROWS) / 2; i++){
      randomInd = floor(random(possibleFaces.length));
      cardSelected.push(possibleFaces[randomInd]);
      cardSelected.push(possibleFaces[randomInd]);
      possibleFaces.splice(randomInd,1);
  }

  //洗牌方法（打乱cardSelected数组的卡片抽取序号）
  var shuffleArray = function(array) {
      var counter = array.length;
      // While there are elements in the array
      while (counter > 0) {
          // Pick a random index
          var ind = Math.floor(Math.random() * counter);
          counter--;  // Decrease counter by 1
          // And swap the last element with it
          var temp = array[counter];
          array[counter] = array[ind];
          array[ind] = temp;
      }
  };
  shuffleArray(cardSelected);  //洗牌
  
  //按顺序从cardSelectd数组抽取卡片序号，创建卡片个体
  for (let i = 0; i < NUM_COLS; i++) {
      for (let j = 0; j < NUM_ROWS; j++) {
          var tileX = i * 54 + 65;
          var tileY = j * 54 + 40;
          var tileFace = cardSelected.pop();
          tiles.push(new Tile(tileX, tileY, tileFace));
      }
  }
  console.log("Setup finished");
} //setup结束

//判断鼠标是否位于某张卡片位置, 并判断是否有2张卡片已翻面
function mouseClicked(){
    console.log("Detected mouseClicked");
    btn1.handleMouseClick(mouseX, mouseY);
    
    for (let j = 0; j < tiles.length; j++){       
        if (tiles[j].isUnderMouse(mouseX, mouseY)){
          if (flippedTiles.length < 2 && !tiles[j].isFaceUp){
              tiles[j].isFaceUp = true;  
              console.log("Tile["+ j + "] .isFaceUp has been change to True.");
              flippedTiles.push(tiles[j]);
              if (flippedTiles.length === 2){
                  numTries++; //记录翻卡片尝试次数
                  console.log("flippedTile Number === 2, numTries added");
                  if (flippedTiles[0].face === flippedTiles[1].face){
                  console.log("匹配");
                  flippedTiles[0].isMatch = true; //存在已翻转卡片数组中的卡片属性更改
                  flippedTiles[1].isMatch = true;
                  console.log("匹配的flippedTiles:", flippedTiles);
                  numMatches++;
                  }  
                  delayStartFC = frameCount; 
                  console.log("delayStartFC 保存当前frameCount:", delayStartFC);
              }
         }
         loop();  //保持draw循环执行
      }
  }  
}

function draw(){
  btn1.draw();  //绘制按钮btn1
  
  // 判断延时条件
  if (delayStartFC && (frameCount - delayStartFC) > 30){
      console.log("延时>30,不匹配的卡片翻回背面");
      for (let k = 0; k < tiles.length; k++) {
        if (!tiles[k].isMatch){ 
          tiles[k].isFaceUp = false;  
        }
      }
      flippedTiles = [];
      delayStartFC = null;
      console.log("flippedTiles清空:",flippedTiles);
      console.log("delayStartFC赋初值:",delayStartFC);
      noLoop();  // 卡片翻回背面，draw函数不再循环，frameCount不再计数
  }

  for (let i = 0; i < tiles.length; i++) {
      tiles[i].draw();
  }

  textSize(15);
  fill("#1446DC");
  text("Click the cards to start.",200,280); // 游戏玩法的提示词
  
  // 卡片匹配完成，显示结果
  if (numMatches === tiles.length/2) {
        fill(0, 0, 0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("You found them all in " + numTries + " tries!", 200, 380);
  }
}

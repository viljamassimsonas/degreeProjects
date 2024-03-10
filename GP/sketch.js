let video;
let snapshot;
let gridWidth  = 170*2;
let gridHeight = 100*2;
let faceapi

let redThresholdSlider;
let redThreshold = 0;

let greenThresholdSlider;
let greenThreshold = 0;

let blueThresholdSlider;
let blueThreshold = 0;

let yThresholdSlider;
let yThreshold = 0;

let cbThresholdSlider;
let cbThreshold = 0;

let crThresholdSlider;
let crThreshold = 0;

let hThresholdSlider;
let hThreshold = 0;

let sThresholdSlider;
let sThreshold = 0;

let vThresholdSlider;
let vThreshold = 0;


let classifier;

let detections = 0;

let points = null;


let minX = 0; // good practice wen u need this to run on before it gets mentioned
let minY = 0;
let maxX = 0;
let maxY = 0;

//let svgTest;


function preload(){

  angrySVG     = loadImage("angry.svg");
  disgustedSVG = loadImage("disgusted.svg");
  fearfulSVG   = loadImage("fearful.svg");
  happySVG     = loadImage("happy.svg");
  neutralSVG   = loadImage("neutral.svg");
  sadSVG       = loadImage("sad.svg");
  surprisedSVG = loadImage("surprised.svg");

}


function setup() {

  createCanvas(1100, 1500);
  
  // Initialize webcam
  video = createCapture(VIDEO);
  video.size(gridWidth, gridHeight);
  video.hide(); // Hide the video element



  const faceOptions = { withLandmarks: true, withExpressions: true, withDescriptors: true, minConfidence: 0.5 };

  faceapi = ml5.faceApi(video, faceOptions, faceReady);



  // Create red threshold slider
  redThresholdSlider = createSlider(0, 255, 128);
  redThresholdSlider.position(10, 610);
  redThresholdSlider.input(updateRedThreshold); // u see input

  greenThresholdSlider = createSlider(0, 255, 128);
  greenThresholdSlider.position(360, 610);
  greenThresholdSlider.input(updateGreenThreshold);

  blueThresholdSlider = createSlider(0, 255, 128);
  blueThresholdSlider.position(710, 610);
  blueThresholdSlider.input(updateBlueThreshold);

  yThresholdSlider = createSlider(0, 255, 128);
  yThresholdSlider.position(450, 1055);
  yThresholdSlider.input(updateyThreshold);

  cbThresholdSlider = createSlider(0, 255, 128);
  cbThresholdSlider.position(450, 1077.5);
  cbThresholdSlider.input(updatecbThreshold);

  crThresholdSlider = createSlider(0, 255, 128);
  crThresholdSlider.position(450, 1100);
  crThresholdSlider.input(updatecrThreshold); // <--- MUST IMPLEMENT CALLBACK NO EFFECT OTHERWISE ON CHANGE UNLESS 
                                              // <--- crThresholdSlider is called.
  hThresholdSlider = createSlider(0, 255, 128);
  hThresholdSlider.position(800, 1055);
  hThresholdSlider.input(updatehThreshold);

  sThresholdSlider = createSlider(0, 255, 128);
  sThresholdSlider.position(800, 1077.5);
  sThresholdSlider.input(updatesThreshold);

  vThresholdSlider = createSlider(0, 255, 128);
  vThresholdSlider.position(800, 1100);
  vThresholdSlider.input(updatevThreshold); // <--- MUST IMPLEMENT CALLBACK NO EFFECT OTHERWISE ON CHANGE UNLESS 
                                              // <--- crThresholdSlider is called.



  

  ////////////////////////////


  faceFilter = createSelect(true);
  faceFilter.position(100, 1060);

  faceFilter.option("Grayscaled_Face");
  faceFilter.option("Blurred_Face");
  faceFilter.option("Colour_Converted_Face");
  faceFilter.option("Pixelated_Face");



  //////////////////////////////// 

updateRedThreshold();   // otherwuse gotta move it to get startup value 
updateGreenThreshold(); 
updateBlueThreshold();
updateyThreshold();
updatecbThreshold();
updatecrThreshold();
updatehThreshold();
updatesThreshold();
updatevThreshold();
}



function   updateRedThreshold()   {redThreshold = redThresholdSlider.value();}; // inline function
function updateGreenThreshold() {greenThreshold = greenThresholdSlider.value();};
function  updateBlueThreshold()  {blueThreshold = blueThresholdSlider.value();};
function     updateyThreshold()     {yThreshold = yThresholdSlider.value();};
function    updatecbThreshold()    {cbThreshold = cbThresholdSlider.value();};
function    updatecrThreshold()    {crThreshold = crThresholdSlider.value();};
function     updatehThreshold()     {hThreshold = hThresholdSlider.value();};
function     updatesThreshold()     {sThreshold = sThresholdSlider.value();};
function     updatevThreshold()     {vThreshold = vThresholdSlider.value();};



function draw() {

  background(255);


  textSize(14);
  noStroke();
  fill('black')


  text( '  Y',  yThresholdSlider.x +  yThresholdSlider.width,  yThresholdSlider.y +  yThresholdSlider.height);
  text('  Cb', cbThresholdSlider.x + cbThresholdSlider.width, cbThresholdSlider.y + cbThresholdSlider.height);
  text('  Cr', crThresholdSlider.x + crThresholdSlider.width, crThresholdSlider.y + crThresholdSlider.height);
  text( '  H',  hThresholdSlider.x +  hThresholdSlider.width,  hThresholdSlider.y +  hThresholdSlider.height);
  text( '  S',  sThresholdSlider.x +  sThresholdSlider.width,  sThresholdSlider.y +  sThresholdSlider.height);
  text( '  V',  vThresholdSlider.x +  vThresholdSlider.width,  vThresholdSlider.y +  vThresholdSlider.height);  
  
 
  video.loadPixels();  // Display webcam image

  image(video, 10, 10, gridWidth, gridHeight);


  restore = []

  for (let i = 0; i < video.pixels.length; i++) {restore.push(video.pixels[i]);}


 /////////////////// START GRAYSCALE FILTER ////////////////////// 

  for (let i = 0; i < video.pixels.length; i += 4) {

    let brightness = ((video.pixels[i] + video.pixels[i + 1] + video.pixels[i + 2]) / 3) * 1.2;

    brightness = constrain(brightness, 0, 255); 
    
    video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = brightness;

  }
  
    video.updatePixels();  

    image(video, 360, 10, gridWidth, gridHeight);


 /////////////////// END GRAYSCALE FILTER ////////////////////// 


    restoreVideo()

    video.updatePixels();


/////////////////// START EMOTION EMOJI EXTENSION ///////////////

    image(video, 710, 10, gridWidth, gridHeight);

    drawExpressions(detections, 710, 20, 14)



////////////////// END EMOTION EMOJI EXTENSION ///////////////////////


  restoreVideo()


//////////////////// START RED CHANNEL FILTER ///////////////////////////


  for (let i = 0; i < video.pixels.length; i += 4) {video.pixels[i + 1] = video.pixels[i + 2] = 0;};


  video.updatePixels();

  image(video, 10, 220, gridWidth, gridHeight);


////////// END RED CHANNEL FILTER //////////////////////


restoreVideo()


////////// START GREEN  CHANNEL FILTER //////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {video.pixels[i] = video.pixels[i + 2] = 0;}; 


video.updatePixels();

image(video, 360, 220, gridWidth, gridHeight);


////////// END GREEN  CHANNEL FILTER //////////////////////


restoreVideo()


////////// START BLUE  CHANNEL FILTER //////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {video.pixels[i] = video.pixels[i + 1] = 0;};


video.updatePixels();

image(video, 710, 220, gridWidth, gridHeight);


////////// END BLUE  CHANNEL FILTER //////////////////////


restoreVideo()


////////// START RED THRESHOLD FILTER //////////////////////

for (let i = 0; i < video.pixels.length; i += 4) {
        
  if (video.pixels[i] >= redThreshold) 
      
       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;
  else video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0;

}
  
  video.updatePixels();
  
  image(video, 10, 430, gridWidth, gridHeight);


///////////////// END RED THRESHOLD FILTER /////////////////////


restoreVideo()


////////////////// START GREEN THRESHOLD ///////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {
        
  if  (video.pixels[i + 1] >= greenThreshold) 
      
       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;
  else video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0;

}


video.updatePixels();

image(video, 360, 430, gridWidth, gridHeight);


////////////////// END GREEN THRESHOLD ///////////////////////


restoreVideo()


////////////////// START BLUE FILTER /////////////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {
        
  if  (video.pixels[i + 2] >= blueThreshold) 
      
       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;
  else video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0;

}


video.updatePixels();

image(video, 710, 430, gridWidth, gridHeight);


///////////////////// END BLUE FILTER //////////////////////////////////


restoreVideo()


video.updatePixels();


image(video, 10, 640, gridWidth, gridHeight);


/////////////////// SLIDER YCBCR //////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {ycbcr(i, false)};


video.updatePixels();


image(video, 360, 640, gridWidth, gridHeight);



//////////////// END NO SLIDER YCBCR//////////////////


restoreVideo()


video.updatePixels();


//////////////////// START SLIDER YCBCR /////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {ycbcr(i, true)}


video.updatePixels();


image(video, 360, 850, gridWidth, gridHeight);



///////////////////////// END SLIDER YCBCR /////////////////////////////



restoreVideo()


video.updatePixels();



//////////////////////////  HSV  FILTER NO SLIDER  ///////////////////////////////



for (let i = 0; i <video.pixels.length; i += 4) {hsv(i, false);};
     

 video.updatePixels();


 image(video, 710, 640, gridWidth, gridHeight);


 /////////////////////// HSV NO SLIDER END /////////////////////////////


 restoreVideo()


 video.updatePixels();


//////////////////////////  HSV  FILTER  ///////////////////////////////


for (let i = 0; i <video.pixels.length; i += 4) {hsv(i, true);};


video.updatePixels();


image(video, 710, 850, gridWidth, gridHeight);


//////////////////// END HSV FILTER SLIDER ////////////////////////////////



restoreVideo()

video.updatePixels();



/////////////////////// START FACE FILTERS //////////////////////////////////


if (detections.length > 0) {

      points = detections[0].landmarks.positions; // !!! MUST MAKE GLOBAL, LET ENCAPSULATES WITHIN THE 
      bounds = detections[0].detection._box;

      minX = bounds._x - 5;
      maxX = bounds._x + bounds._width  + 5;

      minY = bounds._y - 5;
      maxY = bounds._y + bounds._height + 5;

      if (faceFilter.value() ==                       0) faceBox();

      if (faceFilter.value() ==       "Grayscaled_Face") boundsHelper((x,y) => {grayscale(x,y);});

      if (faceFilter.value() == "Colour_Converted_Face") boundsHelper((x,y) => {      cmy(x,y);});
            
      if (faceFilter.value() ==          "Blurred_Face") boundsHelper((x,y) => {  blurred(x,y);});
          
      if (faceFilter.value() ==        "Pixelated_Face") pixelate();
           
  };

  video.updatePixels();

  if (faceFilter.value() != 0 && faceFilter.value() != "Pixelated_Face") 
  
      image(video, 10, 850, gridWidth, gridHeight);
 
}

/////////////////////// END FACE FILTERS //////////////////////////////////






//////////////////////// HELPER FUNCTIONS ///////////////////////////////


restoreVideo = () => {for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};};



// runs functions within the bounds provided
boundsHelper = (callback) => {

  for (let x = 0; x < gridWidth; x++) {for (let y = 0; y < gridHeight; y++) {

      if ((x >= minX & x <= maxX) && (y >= minY & y <= maxY)) {callback(x,y)};};};};  



//////////////////////// DRAW EXPRESSIONS ///////////////////////////////




function faceBox(x,y) {

  image(video, 10, 850, gridWidth, gridHeight);

  for (let i = 0; i < points.length; i++) {   // BLYATLOAD OF POINTS 
  
      stroke(161, 95, 251);                     // MAKE FACE SHAPE
      strokeWeight(4);
      point(points[i]._x + 10, points[i]._y + 850);

      if (detections.length > 0) {

        noFill();
        strokeWeight(1);
        stroke("red");
        rect(minX+10, minY+850, maxX-minX, maxY-minY);
     }
  }
}




function grayscale(x,y) {

  console.log(x,"  ",y)

  let i = ((y*gridWidth+x)*4)

  let r = video.pixels[i];
  let g = video.pixels[i + 1];
  let b = video.pixels[i + 2];

  let brightness = (r + g + b) / 3;
  brightness += 51;                           // Increase brightness by 20%
  brightness = constrain(brightness, 0, 255); // Ensure brightness stays within 0-255 range
  
  if      (brightness > 150) video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;

  else if (brightness < 125) video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0

  else                       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = brightness;

}




function ycbcr(i, hasThreshold){

  let Y  =          0.299 * video.pixels[i] + 0.587    * video.pixels[i+1] + 0.114    * video.pixels[i+2];
  let Cb = 128 - 0.168736 * video.pixels[i] - 0.331264 * video.pixels[i+1] + 0.5      * video.pixels[i+2];
  let Cr =      128 + 0.5 * video.pixels[i] - 0.418688 * video.pixels[i+1] - 0.081312 * video.pixels[i+2];

  let tY = hasThreshold ? 150 * ( yThreshold/128) : 150;
  let tB = hasThreshold ? 100 * (cbThreshold/128) : 100;
  let tR = hasThreshold ? 150 * (crThreshold/128) : 150;

  if (Y > tY && Cb > tB && Cr > tR) {

    video.pixels[i]     = 255; // Set red channel to maximum for segmentation
    video.pixels[i + 1] = 0;
    video.pixels[i + 2] = 0;

  } else {

    video.pixels[i]     =  Y; // Set back to original RGB values for non-segmented pixels
    video.pixels[i + 1] = Cb;
    video.pixels[i + 2] = Cr;
  }
}

function hsv(i, hasThreshold) {

  let r = video.pixels[i];
  let g = video.pixels[i + 1];
  let b = video.pixels[i + 2];

  //////////////////////////////////////////////////////

  max = Math.max(r, g, b)

  min = Math.min(r, g, b)

  /////////////////////////////////////////////////////

          S = (max - min) / max;
  if (!S) S = 0;

  V = max;

  //////////////////////////////////////////////////////
  
          R = ((max-r)/(max-min));
  if (!R) R = 0;

          G = ((max-g)/(max-min));
  if (!G) G = 0;

          B = ((max-b)/(max-min));
  if (!B) B = 0;

  //////////////////////////////////////////////////////////
  
  if                  (S ==   0) H =     0;
  else if  (r == max & g == min) H = 5 + B;
  else if  (r == max & g != min) H = 1 - G;
  else if  (g == max & b == min) H = R + 1;
  else if  (g == max & b != min) H = 3 - B;  
  else if             (r == max) H = 3 - B;
  else if  (r == max & g == min) H = 3 + G;
  else                           H = 5 - R;

  ///////////////////////////////////////////////////////
  video.pixels[i]     = hasThreshold ? H *  60 * (hThreshold / 128) : H *  60
  video.pixels[i + 1] = hasThreshold ? S * 360 * (sThreshold / 128) : S * 360 
  video.pixels[i + 2] = hasThreshold ?       V * (vThreshold / 128) : V
}


function cmy(x,y) {

  let i = (y*gridWidth+x)*4

  let r = video.pixels[i] / 255;
  let g = video.pixels[i + 1] / 255;
  let b = video.pixels[i + 2] / 255;
    
  // Convert RGB to CMY
  let c  = 1 - r;
  let m  = 1 - g;
  let y_ = 1 - b;
    
  // Scale values back to 0-255 range
  c  *= 255;
  m  *= 255;
  y_ *= 255;
    
  // Update pixel values with CMY
  video.pixels[i]     = c;
  video.pixels[i + 1] = m;
  video.pixels[i + 2] = y_;
}


 function blurred(x,y) {

    let sum = [0, 0, 0];
      for (let dx = -4; dx <= 4; dx++) {    // <----- KERNEL CHANGE 3x3 = -1 & -1
        for (let dy = -4; dy <= 4; dy++) {  // <----- KERNEL CHANGE 5x5 = -2 & -2
                    
          let index = 4 * ((y + dy) * gridWidth + (x + dx));
          
          for (let i = 0; i < 3; i++) {
            sum[i] += video.pixels[index + i];
          }
        }
      }
    let pixelIndex = 4 * (y * video.width + x);
    for (let i = 0; i < 3; i++) {
            video.pixels[pixelIndex + i] = sum[i] / (3*3*3*3); // <--- CORRECT THE FORMULA
    }
}



function pixelate() {

  image(video, 10, 850, gridWidth, gridHeight);

          blockSizeH = (maxY-minY)/5
          blockSizeW = (maxX-minX)/5

          daW = Math.floor(maxX-minX)
          daH = Math.floor(maxY-minY) 
          
          bro = createImage(gridWidth,gridHeight);
          bro.loadPixels();

          for  (offsetY = 0; offsetY < 5; offsetY++){
            for(offsetX = 0; offsetX < 5; offsetX++){
                    // Paint each block with the average pixel intensity
                    for   (let y = Math.floor(0 + blockSizeH * offsetY + minY); y < blockSizeH * (offsetY + 1) + minY; y++) {                            
                      average = 0
                      sum = 0
                      count = 0           
                      for (let x = Math.floor(0 + blockSizeW * offsetX + minX); x < blockSizeW * (offsetX + 1) + minX; x++) {                     
                        pixelColor = get(x+10, y+850);
                        r = red(pixelColor)
                        g = blue(pixelColor)
                        b = blue(pixelColor)
                        sum += (r + g + b) / 3
                        count++
                      }}   
                        average = sum / count;
                                // Paint each block with the average pixel intensity
                          for   (let y = Math.floor(0 + blockSizeH * offsetY + minY); y < (blockSizeH * (offsetY+1)) + minY; y++) {
                            for (let x = Math.floor(0 + blockSizeW * offsetX + minX); x < (blockSizeW * (offsetX+1)) + minX; x++) {                    
                              broIndex = ((y*gridWidth+x)*4)          
                              bro.set(x,y,average)            
                        }}  
                      }                     
                    }
                  bro.updatePixels();
                  image(bro, 10, 850, gridWidth, gridHeight);


}




function drawExpressions(detections, x, y, ySpace){

  fill('yellow');
  stroke("red");
  strokeWeight(1.75);
  text('EXTENSION', 965, 205);

//If at least 1 face is detected
  if(detections.length > 0){ 
          
   // assigns each var the value of each key in the dict
    expressions = detections[0].expressions; 


   let {angry, disgusted, fearful, happy, neutral, sad, surprised} = detections[0].expressions; 

      maxExpression = Object.keys(expressions).reduce((a,b)=>expressions[a]>expressions[b]?a:b);

   // maxExpression = Object.keys(expressions)[Math.floor(Math.random() * 7)]

      fX = x + minX - 0.5*(maxX-minX); 
      fY = y + minY - 0.5*(maxY-minY);
      wX = 2   *(maxX-minX);
      wY = 1.75*(maxY-minY);

      if      (maxExpression == "angry")     image(angrySVG,     fX, fY, wX, wY);
      else if (maxExpression == "disgusted") image(disgustedSVG, fX, fY, wX, wY);
      else if (maxExpression == "fearful")   image(fearfulSVG,   fX, fY, wX, wY);
      else if (maxExpression == "happy")     image(happySVG,     fX, fY, wX, wY);
      else if (maxExpression == "neutral")   image(neutralSVG,   fX, fY, wX, wY);
      else if (maxExpression == "sad")       image(sadSVG,       fX, fY, wX, wY);
      else if (maxExpression == "surprised") image(surprisedSVG, fX, fY, wX, wY);

      x = x + 2
      y = y + 2

      function ifMaxExpression(expression) {maxExpression == expression ? fill("red") : fill("yellow")};

      ifMaxExpression("angry");
      text("angry:       "   + nf(angry     * 100, 2, 2) + "%", x, y);

      ifMaxExpression("disgusted");
      text("disgust:     "   + nf(disgusted * 100, 2, 2) + "%", x, y + ySpace);

      ifMaxExpression("fearful");
      text("fear:          " + nf(fearful   * 100, 2, 2) + "%", x, y + ySpace * 2);

      ifMaxExpression("happy");
      text("happy:      "    + nf(happy     * 100, 2, 2) + "%", x, y + ySpace * 3);

      ifMaxExpression("neutral");
      text("neutral:     "   + nf(neutral   * 100, 2, 2) + "%", x, y + ySpace * 4);

      ifMaxExpression("sad");
      text("sad:          "  + nf(sad       * 100, 2, 2) + "%", x, y + ySpace * 5);

      ifMaxExpression("surprised");
      text("surprised: "     + nf(surprised * 100, 2, 2) + "%", x, y + ySpace * 6);
  }
}


/////// ML5 FACE API //////////////

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;

  faceapi.detect(gotFaces);
}



function faceReady() {

  console.log("MODEL LOADED")

  faceapi.detect(gotFaces);
}
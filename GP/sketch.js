let video;
let snapshot;
let gridWidth = 170*2;
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

invert = []



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
  yThresholdSlider.position(395, 1055);
  yThresholdSlider.input(updateyThreshold);

  cbThresholdSlider = createSlider(0, 255, 128);
  cbThresholdSlider.position(395, 1077.5);
  cbThresholdSlider.input(updatecbThreshold);

  crThresholdSlider = createSlider(0, 255, 128);
  crThresholdSlider.position(395, 1100);
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






  cond1 = createSelect(true);
  cond1.position(600, 1055);


  // Add color options.
  cond1.option("YCbCr");
  cond1.option("YCbCr2");
  cond1.option("YCbCr3");

  cond1.selected("YCbCr");

  cond2 = createSelect(true);
  cond2.position(100, 1060);

  

  // Add color options.
  cond2.option("Face_Detection");  
  cond2.option("Grayscaled_Face");
  cond2.option("Blurred_Face");
  cond2.option("Colour_Converted_Face");
  cond2.option("Pixelated_Face");

  cond2.selected("Face_Detection");


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


  text('  H', hThresholdSlider.x + hThresholdSlider.width, hThresholdSlider.y + hThresholdSlider.height);
  text('  S', sThresholdSlider.x + sThresholdSlider.width, sThresholdSlider.y + sThresholdSlider.height);
  text('  V', vThresholdSlider.x + vThresholdSlider.width, vThresholdSlider.y + vThresholdSlider.height);


  text('  V', vThresholdSlider.x + vThresholdSlider.width, vThresholdSlider.y + vThresholdSlider.height);
  
  
  video.loadPixels();  // Display webcam image

  image(video, 10, 10, gridWidth, gridHeight);


  
  restore = []

  for (let i = 0; i < video.pixels.length; i++) {restore.push(video.pixels[i]);}


 

  grayscale = []

  // Iterate through webcam pixels
  for (let i = 0; i < video.pixels.length; i += 4) {

    let r = video.pixels[i];
    let g = video.pixels[i + 1];
    let b = video.pixels[i + 2];

    let brightness = (r + g + b) / 3;

    brightness += 51; // Increase brightness by 20%
    brightness = constrain(brightness, 0, 255); // Ensure brightness stays within 0-255 range
    video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = brightness;

    grayscale.push(video.pixels[i])
    grayscale.push(video.pixels[i+1])
    grayscale.push(video.pixels[i+2])
    grayscale.push(video.pixels[i+3])

    

  }
  
    video.updatePixels();  


    image(video, 360, 10, gridWidth, gridHeight);


 /////////////////// END GRAYSCALE FILTER ////////////////////// 


    for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];}


    video.updatePixels();


  ///////////// START EMOTION EMOJI EXTENSION ///////////////


    image(video, 710, 10, gridWidth, gridHeight);


    if (detections.length > 0) {


        faceOutline = detections[0].landmarks
        
        drawExpressions(detections, 710, 20, 14)

    }

      fill('yellow');
      stroke("red");
      strokeWeight(1.75);

      text('EXTENSION', 965, 205);


////////////////// END EMOTION EMOJI EXTENSION ///////////////////////



//////////////////////// END CMY FILTER ////////////////////////////////


for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


//////////////////// START RED CHANNEL FILTER ///////////////////////////


  for (let i = 0; i < video.pixels.length; i += 4) {video.pixels[i + 1] = video.pixels[i + 2] = 0;};


  video.updatePixels();


  image(video, 10, 220, gridWidth, gridHeight);


////////// END RED CHANNEL FILTER //////////////////////


for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


////////// START GREEN  CHANNEL FILTER //////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {video.pixels[i] = video.pixels[i + 2] = 0;}; 


video.updatePixels();


image(video, 360, 220, gridWidth, gridHeight);


////////// END GREEN  CHANNEL FILTER //////////////////////


for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


////////// START BLUE  CHANNEL FILTER //////////////////////



for (let i = 0; i < video.pixels.length; i += 4) {video.pixels[i] = video.pixels[i + 1] = 0;};


video.updatePixels();


image(video, 710, 220, gridWidth, gridHeight);



////////// END BLUE  CHANNEL FILTER //////////////////////




for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


  
for (let i = 0; i < video.pixels.length; i += 4) {
        
  if (video.pixels[i] >= redThreshold) 
      
       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;
  else video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0;

}
  

  video.updatePixels();
  

  image(video, 10, 430, gridWidth, gridHeight);




////////////////// GREEN THRESHOLD ///////////////////////



for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};
 


for (let i = 0; i < video.pixels.length; i += 4) {
        
  if  (video.pixels[i + 1] >= greenThreshold) 
      
       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;
  else video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0;

}


video.updatePixels();


image(video, 360, 430, gridWidth, gridHeight);




///////////////////////////////////////////////////



for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];}



////////////////// START BLUE FILTER /////////////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {
        
  if  (video.pixels[i + 2] >= blueThreshold) 
      
       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;
  else video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0;

}


video.updatePixels();


image(video, 710, 430, gridWidth, gridHeight);



///////////////////// END BLUE FILTER //////////////////////////////////


for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


video.updatePixels();


image(video, 10, 640, gridWidth, gridHeight);


/////////////////// SLIDER YCBCR //////////////////////

for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


video.updatePixels();


image(video, 360, 640, gridWidth, gridHeight);


for (let i = 0; i < video.pixels.length; i += 4) {



      let Y  =          0.299 * video.pixels[i] + 0.587    * video.pixels[i+1] + 0.114    * video.pixels[i+2];
      let Cb = 128 - 0.168736 * video.pixels[i] - 0.331264 * video.pixels[i+1] + 0.5      * video.pixels[i+2];
      let Cr =      128 + 0.5 * video.pixels[i] - 0.418688 * video.pixels[i+1] - 0.081312 * video.pixels[i+2];

      let tY = 150 * 1 //( yThreshold/128);
      let tB = 100 * 1 //(cbThreshold/128);
      let tR = 150 * 1 //(crThreshold/128);
    
      if (Y > tY && Cb > tB && Cr > tR) {

        video.pixels[i]     = 255; // Set red channel to maximum for segmentation
        video.pixels[i + 1] = 0;
        video.pixels[i + 2] = 0;

      } else {

        video.pixels[i]     =  Y; // Set back to original RGB values for non-segmented pixels
        video.pixels[i + 1] = Cb;
        video.pixels[i + 2] = Cr;

      }
};



video.updatePixels();


image(video, 360, 640, gridWidth, gridHeight);



//////////////// END NO SLIDER YCBCR//////////////////



for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


video.updatePixels();



//////////////////// START SLIDER YCBCR /////////////////////


for (let i = 0; i < video.pixels.length; i += 4) {

  if (cond1.value() == "YCbCr")  {

    let Y  =          0.299 * video.pixels[i] + 0.587    * video.pixels[i+1] + 0.114    * video.pixels[i+2];
    let Cb = 128 - 0.168736 * video.pixels[i] - 0.331264 * video.pixels[i+1] + 0.5      * video.pixels[i+2];
    let Cr =      128 + 0.5 * video.pixels[i] - 0.418688 * video.pixels[i+1] - 0.081312 * video.pixels[i+2];

    let tY = 150 * ( yThreshold/128);
    let tB = 100 * (cbThreshold/128);
    let tR = 150 * (crThreshold/128);
  
    if (Y > tY && Cb > tB && Cr > tR) {

      video.pixels[i]     = 255; // Set red channel to maximum for segmentation
      video.pixels[i + 1] = 0;
      video.pixels[i + 2] = 0;

    } else {

      video.pixels[i]     =  Y; // Set back to original RGB values for non-segmented pixels
      video.pixels[i + 1] = Cb;
      video.pixels[i + 2] = Cr;
    }

  } else if (cond1.value() == "YCbCr2")  {

      X = 0.412 * video.pixels[i] + 0.358 * video.pixels[i+1] + 0.180 * video.pixels[i+2] + yThreshold
      Y = 0.213 * video.pixels[i] - 0.715 * video.pixels[i+1] + 0.072 * video.pixels[i+2] + cbThreshold
      Z = 0.019 * video.pixels[i] - 0.119 * video.pixels[i+1] + 0.950 * video.pixels[i+2] + crThreshold

      if (X <  yThreshold)     video.pixels[i] =  3.241 * X - 1.537 * Y - 0.499 * Z 
      else                     video.pixels[i] =  0
      
      if (Y < cbThreshold) video.pixels[i + 1] = -0.969 * X + 1.876 * Y + 0.042 * Z
      else                 video.pixels[i + 1] =  0

      if (Z < crThreshold) video.pixels[i + 2] =  0.056 * X - 0.204 * Y + 1.057 * Z 
      else                 video.pixels[i + 2] =  0

  } else if (cond1.value() == "YCbCr3") {

      Y  =   0.2215 * video.pixels[i] + 0.7154 * video.pixels[i+1] + 0.0721 * video.pixels[i+2] + yThreshold
      Cb =  -0.1145 * video.pixels[i] - 0.3855 * video.pixels[i+1] + 0.5000 * video.pixels[i+2] + cbThreshold
      Cr =   0.5016 * video.pixels[i] - 0.4556 * video.pixels[i+1] + 0.0459 * video.pixels[i+2] + crThreshold
    
      if ( Y >=  yThreshold) video.pixels[i]     = Y + 0.0000 * Cb + 1.5701 * Cr 
      else                   video.pixels[i]     = 255
      
      if (Cb >= cbThreshold) video.pixels[i + 1] = Y - 0.1870 * Cb - 0.4664 * Cr
      else                   video.pixels[i + 1] = 0
        
      if (Cr >= crThreshold) video.pixels[i + 2] = Y - 1.8556 * Cb + 0.0000 * Cr 
      else                   video.pixels[i + 2] = 0
}
}



video.updatePixels();


image(video, 360, 850, gridWidth, gridHeight);



///////////////////////// END SLIDER YCBCR /////////////////////////////



for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


video.updatePixels();



//////////////////////////  HSV  FILTER NO SLIDER  ///////////////////////////////



for (let i = 0; i <video.pixels.length; i += 4) {
        
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
         
         if                    (S == 0) H =     0;
         else if  (r == max & g == min) H = 5 + B;
         else if  (r == max & g != min) H = 1 - G;
         else if  (g == max & b == min) H = R + 1;
         else if  (g == max & b != min) H = 3 - B;  
         else if             (r == max) H = 3 - B;
         else if  (r == max & g == min) H = 3 + G;
         else                           H = 5 - R;

         ///////////////////////////////////////////////////////
         video.pixels[i]     = H *  60 * 1 //(hThreshold / 128);
         video.pixels[i + 1] = S * 360 * 1 //(sThreshold / 128);
         video.pixels[i + 2] =       V * 1 //(vThreshold / 128);
 }
     

 video.updatePixels();


 image(video, 710, 640, gridWidth, gridHeight);


 /////////////////////// HSV NO SLIDER END /////////////////////////////


 for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


 video.updatePixels();


//////////////////////////  HSV  FILTER  ///////////////////////////////


for (let i = 0; i <video.pixels.length; i += 4) {
        
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

  /////////////////////////////////////////
  if                    (S == 0) H = 0;
  else if  (r == max & g == min) H = 5 + B;
  else if  (r == max & g != min) H = 1 - G;
  else if  (g == max & b == min) H = R + 1;
  else if  (g == max & b != min) H = 3 - B;  
  else if             (r == max) H = 3 - B;
  else if  (r == max & g == min) H = 3 + G;
  else                           H = 5 - R;

  ///////////////////////////////////////////////////
  video.pixels[i]     = H *  60 * (hThreshold / 128);
  video.pixels[i + 1] = S * 360 * (sThreshold / 128);
  video.pixels[i + 2] =       V * (vThreshold / 128);
}



video.updatePixels();


image(video, 710, 850, gridWidth, gridHeight);



//////////////////// END HSV FILTER SLIDER ////////////////////////////////



for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


video.updatePixels();



/////////////////////// START FACE FILTERS //////////////////////////////////


if (detections.length > 0) {
 
  points = detections[0].landmarks.positions; // <------------------ !!! MUST MAKE GLOBAL, LET ENCAPSULATES WITHIN THE 

    condicion = true
    minX = points.reduce((acc, cur) => {

      if (condicion){

        acc = Number.POSITIVE_INFINITY
        condicion = false

      }
      
      return Math.min(acc, cur._x)});

      condicion = true
      minY = points.reduce((acc, cur) => {
  
        if (condicion){
  
          acc = Number.POSITIVE_INFINITY
  
          condicion = false
  
        } 
        return Math.min(acc, cur._y)});

        minY = minY-35
        minX = minX-17.5


    condicion = true
    maxX = points.reduce((acc, cur) => {

      if (condicion){

        acc = 0

        condicion = false

      }
      
      return Math.max(acc, cur._x)});

      condicion = true
      maxY = points.reduce((acc, cur) => {
  
        if (condicion){
  
          acc = 0
  
          condicion = false
  
        } 
        
        return Math.max(acc, cur._y)});


  maxX = maxX+17.5


 
  }


 for (let i = 0; i < restore.length; i++) {video.pixels[i] = restore[i];};


if(detections.length > 0) {

      console.log(cond2.value())

      if(cond2.value() == "Face_Detection") {

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

      if(cond2.value() == "Grayscaled_Face") {

        for     (let x = 0; x < gridWidth;  x++) {
            for (let y = 0; y < gridHeight; y++) {

              if ((x >= minX & x <=maxX) && (y >= minY & y <=maxY)) {

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
            }
          }  
        } 

        if(cond2.value() == "Colour_Converted_Face") {

          for (let x = 0; x < gridWidth; x++) {
      
            for (let y = 0; y < gridHeight; y++) {
        
              if ((x >= minX & x <=maxX) && (y >= minY & y <=maxY)) {

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
                  video.pixels[i] = c;
                  video.pixels[i + 1] = m;
                  video.pixels[i + 2] = y_;
              }
            }
          }  
        } 


        if(cond2.value() == "Blurred_Face") {

          for   (let x = 0; x < gridWidth;  x++) {
            for (let y = 0; y < gridHeight; y++) {
        
              if ((x >= minX & x <=maxX) && (y >= minY & y <=maxY)) {
      
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
            }
          }
        } 

        if(cond2.value() == "Pixelated_Face") {
          image(video, 10, 850, gridWidth, gridHeight);
          // BLYAT
          blockSizeH = (maxY-minY)/5
          blockSizeW = (maxX-minX)/5
          daW = Math.floor(maxX-minX)
          daH = Math.floor(maxY-minY) 
          bro = createImage(gridWidth,gridHeight);
          bro.loadPixels();
          // KURWA
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
  }
    


  video.updatePixels();
  

  if (cond2.value() != "Face_Detection" && cond2.value() != "Pixelated_Face") image(video, 10, 850, gridWidth, gridHeight);
 
  

/////////////////////// END FACE FILTERS //////////////////////////////////










}




///////////////// HELPER FUNCTIONS ///////////////////////



//////////////// DRAW EXPRESSIONS ////////////////////////

function drawExpressions(detections, x, y, ySpace){


//If at least 1 face is detected
  if(detections.length > 0){ 
          
   // assigns each var the value of each key in the dict
      let {angry, disgusted, fearful, happy, neutral, sad, surprised} = detections[0].expressions; 

      maxExpression = Object.keys(detections[0].expressions).reduce((a,b)=>detections[0].expressions[a]>detections[0].expressions[b]?a:b);

   // maxExpression = Object.keys(detections[0].expressions)[Math.floor(Math.random() * 7)]

      fX = x + minX - 0.25*(maxX-minX); 
      fY = y + minY - 0.25*(maxY-minY);
      wX = 1.5*(maxX-minX);
      wY = 1.5*(maxY-minY);

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






















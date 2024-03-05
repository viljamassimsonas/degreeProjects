let video;
let snapshot;
let gridWidth = 170*2;
let gridHeight = 100*2;


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


let classifier;

let detections = 0;

let points = null;

function setup() {
  createCanvas(1100, 1500);
  
  // Initialize webcam
  video = createCapture(VIDEO);
  video.size(gridWidth, gridHeight);
  video.hide(); // Hide the video element


  test1 = true;

  test2 = true;


  const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false };

  faceapi = ml5.faceApi(video, faceOptions, faceReady);




  // Create red threshold slider
  redThresholdSlider = createSlider(0, 255, 0);
  redThresholdSlider.position(10, 600);
  redThresholdSlider.input(updateRedThreshold);

  greenThresholdSlider = createSlider(0, 255, 0);
  greenThresholdSlider.position(400, 600);
  greenThresholdSlider.input(updateGreenThreshold);

  blueThresholdSlider = createSlider(0, 255, 0);
  blueThresholdSlider.position(800, 600);
  blueThresholdSlider.input(updateBlueThreshold);

  yThresholdSlider = createSlider(0, 255, 0);
  yThresholdSlider.position(10, 620);
  yThresholdSlider.input(updateyThreshold);

  cbThresholdSlider = createSlider(0, 255, 0);
  cbThresholdSlider.position(400, 620);
  cbThresholdSlider.input(updatecbThreshold);

  crThresholdSlider = createSlider(0, 255, 0);
  crThresholdSlider.position(800, 620);
  crThresholdSlider.input(()=>{console.log("THIS IS A CALLBACK")});



  cond = createSelect(true);
  cond.position(770, 140);

  

  // Add color options.
  cond.option(0);
  cond.option(1);
  cond.option(2);
  cond.option(3);
  cond.option(4);
  cond.option(5);





  cond1 = createSelect(true);
  cond1.position(840, 140);

  

  // Add color options.
  cond1.option(0);
  cond1.option(1);
  cond1.option(2);


}



function updateRedThreshold() {
  redThreshold = redThresholdSlider.value();
}


function updateGreenThreshold() {
  greenThreshold = greenThresholdSlider.value();
}


function updateBlueThreshold() {
  blueThreshold = blueThresholdSlider.value();
}


function updateyThreshold() {
  yThreshold = yThresholdSlider.value();
}


function updatecbThreshold() {
  cbThreshold = cbThresholdSlider.value();
}


function updatecrThreshold() {
  crThreshold = crThresholdSlider.value();
}





function draw() {


updateyThreshold() 
  
updatecbThreshold()
  
updatecrThreshold()
  

  background(255);
  
  // Display webcam image
  video.loadPixels();


  image(video, 10, 10, gridWidth, gridHeight);


  
  restore = []

  if (test1){

    console.log(video.pixels)

    test1 = false;

  }

  for (let i = 0; i < video.pixels.length; i++) {

    restore.push(video.pixels[i]);
    
  }

  if (test2){

    console.log(restore)
    
    test2 = false;

  }

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

    
// TRIPLE == EXPLAIN 3 X =

  }
  
  // Update webcam pixels
  video.updatePixels();

  image(video, 360, 10, gridWidth, gridHeight);


  for (let i = 0; i < restore.length; i++) {

    video.pixels[i] = restore[i];
    
  }


// Iterate through webcam pixels
for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract RGB values from webcam source
  let r = video.pixels[i];
  
  // Set pixels for each channel
  video.pixels[i] = r;
  video.pixels[i + 1] = 0; // Zero out G channel
  video.pixels[i + 2] = 0; // Zero out B channel

}

  // Update webcam pixels
  video.updatePixels();

  image(video, 10, 220, gridWidth, gridHeight);


  for (let i = 0; i < restore.length; i++) {

    video.pixels[i] = restore[i];
    
  }


for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract RGB values from webcam source
  let g = video.pixels[i + 1];

  video.pixels[i] = 0; // Zero out R channel
  video.pixels[i + 1] = g;
  video.pixels[i + 2] = 0; // Zero out B channel

}

video.updatePixels();

image(video, 360, 220, gridWidth, gridHeight);



for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
}


for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract RGB values from webcam source
  let b = video.pixels[i + 2];

  video.pixels[i] = 0; // Zero out R channel
  video.pixels[i + 1] = 0; // Zero out G channel
  video.pixels[i + 2] = b;
}

// Update pixels for each channel
video.updatePixels();

image(video, 710, 220, gridWidth, gridHeight);






redChannel = [];

for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
  redChannel.push(255)
}


video.updatePixels();

  
  // Iterate through webcam pixels
  for (let i = 0; i < video.pixels.length; i += 4) {
    // Extract red value from webcam source
    let r = video.pixels[i];
    
    // Apply red threshold
    if (r >= redThreshold) {
      redChannel[i] = r; // Bright red
    } else {
      redChannel[i] = 0; // Dark red
    }
    redChannel[i + 1] = 0; // Zero out G channel
    redChannel[i + 2] = 0; // Zero out B channel
  }
  

  for (let i = 0; i < redChannel.length; i++) {

    video.pixels[i] = redChannel[i];
    
  }

  // Update pixels for red channel
  video.updatePixels();
  
  // Display red channel
  image(video, 10, 430, gridWidth, gridHeight);
  


greenChannel = [];

for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
  greenChannel.push(255)
}



/////////////////////////////////////////



video.updatePixels();

 


for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract red value from webcam source
  
  let r = video.pixels[i+1];

  // Apply red threshold  
  
  greenChannel[i] = 0; // Zero out G channel

  if (r >= greenThreshold) {
    greenChannel[i+1] = r; // Bright red
  } else {
    greenChannel[i+1] = 0
  }

  greenChannel[i + 2] = 0; // Zero out B channel
}



for (let i = 0; i < greenChannel.length; i++) {

  video.pixels[i] = greenChannel[i];
  
}


// Update pixels for red channel
video.updatePixels();

// Display red channel
image(video, 360, 430, gridWidth, gridHeight);




///////////////////////////////////////////////////




blueChannel = [];

for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
  blueChannel.push(255)
}

video.updatePixels();



for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract red value from webcam source
  

  let r = video.pixels[i+2];
  
  // Apply red threshold  
  
  blueChannel[i] = 0; // Zero out G channel
 
  blueChannel[i + 1] = 0; // Zero out B channel
  

 if (r >= blueThreshold) {

    blueChannel[i+2] = r; // Bright red

  } else {

    blueChannel[i+2] = 0; // Dark red

  }

 
}



for (let i = 0; i < blueChannel.length; i++) {

  video.pixels[i] = blueChannel[i];
  
}


// Update pixels for red channel
video.updatePixels();

// Display red channel
image(video, 710, 430, gridWidth, gridHeight);


for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
}


///////////////////////////////////////////////////////////////
video.updatePixels();


invert = []

for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract RGB color channels

 
  
    c = (video.pixels[i + 1] + video.pixels[i + 2]) / (255 - video.pixels[i])
    m = (video.pixels[i]     + video.pixels[i + 2]) / (255 - video.pixels[i+1]) //
    y = (video.pixels[i]     + video.pixels[i + 1]) / (255 - video.pixels[i+2]) // overflows 255--->0++




  if(cond.value() == 3){
  
   
  video.pixels[i]     = c * 255
  video.pixels[i + 1] = m * 255
  video.pixels[i + 2] = y * 255

  } else if (cond.value() == 1) {

   video.pixels[i]      = 255 * (1-c)
    video.pixels[i + 1] = 255 * (1-m)
    video.pixels[i + 2] = 255 * (1-y)

  } else if (cond.value() == 2){

 video.pixels[i]      = video.pixels[i]     * 0.8
  video.pixels[i + 1] = video.pixels[i + 1] * 0.6
  video.pixels[i + 2] = video.pixels[i + 2] * 0.4

  


  } else if (cond.value() == 0){

    let r = video.pixels[i] / 255;
    let g = video.pixels[i + 1] / 255;
    let b = video.pixels[i + 2] / 255;
    
    // Convert RGB to CMY
    let c = 1 - r;
    let m = 1 - g;
    let y = 1 - b;
    
    // Scale values back to 0-255 range
    c *= 255;
    m *= 255;
    y *= 255;
    
    // Update pixel values with CMY
    video.pixels[i] = c;
    video.pixels[i + 1] = m;
    video.pixels[i + 2] = y;






  } else if (cond.value() == 4) {

    video.pixels[i]     = 255 - video.pixels[i]
    video.pixels[i + 1] = 255 - video.pixels[i + 1]
    video.pixels[i + 2] = 255 - video.pixels[i + 2]

  }

  else if (cond.value() == 5) {}


  invert.push(video.pixels[i])
  invert.push(video.pixels[i+1])
  invert.push(video.pixels[i+2])
  invert.push(video.pixels[i+3])

}

video.updatePixels();


image(video, 10, 640, gridWidth, gridHeight);



for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
}


video.updatePixels();



image(video, 360, 640, gridWidth, gridHeight);







for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract RGB color channels



if (cond1.value() == 2) {
  // Set new color

  Y  =   0.2215 * video.pixels[i] + 0.7154 * video.pixels[i+1] + 0.0721 * video.pixels[i+2] + yThreshold

  Cb =  -0.1145 * video.pixels[i] - 0.3855 * video.pixels[i+1] + 0.5000 * video.pixels[i+2] + cbThreshold

  Cr =   0.5016 * video.pixels[i] - 0.4556 * video.pixels[i+1] + 0.0459 * video.pixels[i+2] + crThreshold


 
 
  if (Y >= redThreshold) {
 
    video.pixels[i]     =  Y + 0.0000 * Cb + 1.5701 * Cr 

  
   } else {
  
  video.pixels[i] = 255
  
   }
  

   if (Cb >= greenThreshold) {
 
    video.pixels[i + 1] =  Y - 0.1870 * Cb - 0.4664 * Cr

    } else {

    video.pixels[i] = 0

    }



if (Cr >= blueThreshold) {
 
  video.pixels[i + 2] =  Y - 1.8556 * Cb + 0.0000 * Cr 

} else {

video.pixels[i] = 0

}
  


} else if (cond1.value() == 1)  {


  X  = 0.412 * video.pixels[i] + 0.358 * video.pixels[i+1] +  0.180 * video.pixels[i+2] + yThreshold

  Y =   0.213 * video.pixels[i] - 0.715 * video.pixels[i+1] + 0.072 * video.pixels[i+2] + cbThreshold

  Z =   0.019 * video.pixels[i]  -  0.119 * video.pixels[i+1] +  0.950 * video.pixels[i+2] + crThreshold


  
  if (X < redThreshold) {
 
    video.pixels[i] = 3.241 * X - 1.537 * Y - 0.499 * Z 

 } else {

video.pixels[i] = 0

 }

 if (Y < greenThreshold) {
 
  video.pixels[i + 1] = -0.969 * X + 1.876 * Y + 0.042 * Z

} else {

video.pixels[i] = 0

}

if (Z < blueThreshold) {
 
  video.pixels[i + 2] = 0.056 * X - 0.204 * Y + 1.057 * Z 

} else {

video.pixels[i] = 0

}



} else if (cond1.value() == 0)  {


  let Y  = 0.299 *            video.pixels[i] + 0.587    *  video.pixels[i+1] + 0.114    *  video.pixels[i+2];
  let Cb = 128  - 0.168736 *  video.pixels[i] - 0.331264 *  video.pixels[i+1] + 0.5      *  video.pixels[i+2];
  let Cr = 128  + 0.5 *       video.pixels[i] - 0.418688 *  video.pixels[i+1] - 0.081312 *  video.pixels[i+2];


  let tY = 150;
  let tB = 100;
  let tR = 150;

 
  if (Y > tY && Cb > tB && Cr > tR) {

    video.pixels[i] = 255; // Set red channel to maximum for segmentation
    video.pixels[i + 1] = 0;
    video.pixels[i + 2] = 0;

  } else {

    video.pixels[i]     = Y // Set back to original RGB values for non-segmented pixels
    video.pixels[i + 1] = Cb
    video.pixels[i + 2] = Cr

  }


}

}


video.updatePixels();


image(video, 360, 640, gridWidth, gridHeight);





for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
}

video.updatePixels();


image(video, 710, 640, gridWidth, gridHeight);


if (detections.length > 0) {
   points = detections[0].landmarks.positions; // <------------------ !!! MUST MAKE GLOBAL, LET ENCAPSULATES WITHIN THE 
  for (let i = 0; i < points.length; i++) {   // BLYATLOAD OF POINTS 
    stroke(161, 95, 251);                     // MAKE FACE SHAPE
    strokeWeight(4);
    point(points[i]._x + 710, points[i]._y + 640);
  }

    //console.log(points)




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

        console.log("\n\n\n")

  console.log("- X --->", minX); // Output: Max X: 15
  console.log("- Y --->", minY); // Output: Max Y: 30







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

        console.log("\n\n\n")

  console.log("+ X --->", maxX); // Output: Max X: 15
  console.log("+ Y --->", maxY); // Output: Max Y: 30

  if (detections.length > 0) {

    noFill();
    strokeWeight(1);
    stroke("red");
    rect(minX+710, minY+640, maxX-minX, maxY-minY);
  
    }
  }


 for (let i = 0; i < restore.length; i++) {

    video.pixels[i] = restore[i];

  }


if(detections.length > 0) {


   for (let x = 0; x < gridWidth; x++) {

      for (let y = 0; y < gridHeight; y++) {

        //console.log(x," ",y,"\n")

        if ((x >= minX & x <=maxX) && (y >= minY & y <=maxY)) {

          //console.log("LOADED")

          video.pixels[((y*gridWidth+x)*4)]   = grayscale[((y*gridWidth+x)*4)] 
          video.pixels[((y*gridWidth+x)*4)+1] = grayscale[((y*gridWidth+x)*4)+1] 
          video.pixels[((y*gridWidth+x)*4)+2] = grayscale[((y*gridWidth+x)*4)+2] 
          video.pixels[((y*gridWidth+x)*4)+3] = grayscale[((y*gridWidth+x)*4)+3] 

        }
      }
  } 
  
} 
  
  video.updatePixels();

  image(video, 10, 850, gridWidth, gridHeight);
  



    
  for (let i = 0; i < restore.length; i++) {

    video.pixels[i] = restore[i];
    
  }
  
  if(detections.length > 0) {


    for (let x = 0; x < gridWidth; x++) {
 
       for (let y = 0; y < gridHeight; y++) {
 
         //console.log(x," ",y,"\n")
 
         if ((x >= minX & x <=maxX) && (y >= minY & y <=maxY)) {
 
           //console.log("LOADED")
 
           video.pixels[((y*gridWidth+x)*4)]   = invert[((y*gridWidth+x)*4)] 
           video.pixels[((y*gridWidth+x)*4)+1] = invert[((y*gridWidth+x)*4)+1] 
           video.pixels[((y*gridWidth+x)*4)+2] = invert[((y*gridWidth+x)*4)+2] 
           video.pixels[((y*gridWidth+x)*4)+3] = invert[((y*gridWidth+x)*4)+3] 
 
         }
       }
   } 
   
 } 



  video.updatePixels();
  
  
  image(video, 360, 850, gridWidth, gridHeight);



    
  for (let i = 0; i < restore.length; i++) {

    video.pixels[i] = restore[i];



  }
  
  video.updatePixels();
  


  



  if(detections.length > 0) {


    for (let x = 0; x < gridWidth; x++) {
 
       for (let y = 0; y < gridHeight; y++) {
 
         //console.log(x," ",y,"\n")
 
         if ((x >= minX & x <=maxX) && (y >= minY & y <=maxY)) {
 
          let sum = [0, 0, 0];
          for (let dx = -3; dx <= 3; dx++) {    // <----- KERNEL CHANGE 3x3 = -1 & -1
            for (let dy = -3; dy <= 3; dy++) {  // <----- KERNEL CHANGE 5x5 = -2 & -2
              
              let index = 4 * ((y + dy) * gridWidth + (x + dx));
    
              for (let i = 0; i < 3; i++) {
                sum[i] += video.pixels[index + i];
              }
            }
          }
          let pixelIndex = 4 * (y * video.width + x);
          for (let i = 0; i < 3; i++) {
            video.pixels[pixelIndex + i] = sum[i] / (3*3*3*2); // <--- CORRECT THE FORMULA
          }
        }
 
         }
       }
   } 



    video.updatePixels();


  
  image(video, 710, 850, gridWidth, gridHeight);


  for (let i = 0; i < restore.length; i++) {

    video.pixels[i] = restore[i];



  }
  





  sum = 0

  count = 0



  if(detections.length > 0) {


  


    for (let x = 0; x < gridWidth; x++) {
 
       for (let y = 0; y < gridHeight; y++) {
  
         if ((x >= minX & x <=maxX) && (y >= minY & y <=maxY)) {
 
           //console.log("LOADED")
 
           video.pixels[((y*gridWidth+x)*4)]   = grayscale[((y*gridWidth+x)*4)] 
           video.pixels[((y*gridWidth+x)*4)+1] = grayscale[((y*gridWidth+x)*4)+1] 
           video.pixels[((y*gridWidth+x)*4)+2] = grayscale[((y*gridWidth+x)*4)+2] 
           video.pixels[((y*gridWidth+x)*4)+3] = grayscale[((y*gridWidth+x)*4)+3] 
 
         }
       }
   } 
   
 } 
   





 if(detections.length > 0) {


  blockSizeH = (gridHeight/5)/5

  blockSizeW = (gridWidth/5)/2




  for  (offsetY = 0; offsetY < 5; offsetY++){
    for(offsetX = 0; offsetX < 5; offsetX++){

      console.log("offsetX --->",offsetX)
      console.log("offsetY --->",offsetY)


            // Paint each block with the average pixel intensity
            for   (let y = 0 + blockSizeH * offsetY; y < blockSizeH * (offsetY + 1); y++) {
              for (let x = 0 + blockSizeW * offsetX; x < blockSizeW * (offsetX + 1); x++) {

                let pixelIndex = ((y*gridWidth+x)*4)

                sum += video.pixels[pixelIndex];
                count++;

              }}

        
                let average = sum / count;

                console.log(average);

                      

                        // Paint each block with the average pixel intensity
                  for   (let y = 0 + blockSizeH * offsetY; y < blockSizeH * (offsetY+1); y++) {
                    for (let x = 0 + blockSizeW * offsetX; x < blockSizeW * (offsetX+1); x++) {

                  let pixelIndex = ((y*gridWidth+x)*4)


                  video.pixels[pixelIndex]     =  (255/5)*(offsetX+1);
                  video.pixels[pixelIndex + 1] =  (255/5)*(offsetY+1);
                  video.pixels[pixelIndex + 2] =  0;
                
                }}

              }}
          
  console.log("\n\n\n END \n\n\n")

  video.updatePixels();

  image(video, 10, 1060, gridWidth, gridHeight);



  }


}





function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  console.log("NO ERROR YET?")

  detections = result;

  console.log(detections)

  faceapi.detect(gotFaces);
}




function faceReady() {

  console.log("MODEL LOADED")

  faceapi.detect(gotFaces);
}

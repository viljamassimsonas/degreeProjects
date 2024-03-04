let video;
let snapshot;
let gridWidth = 160*2;
let gridHeight = 120*2;


let redThresholdSlider;
let redThreshold = 127;

let greenThresholdSlider;
let greenThreshold = 127;

let blueThresholdSlider;
let blueThreshold = 127;


function setup() {
  createCanvas(1100, 1000);
  
  // Initialize webcam
  video = createCapture(VIDEO);
  video.size(gridWidth, gridHeight);
  video.hide(); // Hide the video element


  test1 = true;

  test2 = true;



  // Create red threshold slider
  redThresholdSlider = createSlider(0, 255, redThreshold);
  redThresholdSlider.position(10, 600);
  redThresholdSlider.input(updateRedThreshold);

  greenThresholdSlider = createSlider(0, 255, greenThreshold);
  greenThresholdSlider.position(400, 600);
  greenThresholdSlider.input(updateGreenThreshold);

  blueThresholdSlider = createSlider(0, 255, blueThreshold);
  blueThresholdSlider.position(800, 600);
  blueThresholdSlider.input(updateBlueThreshold);


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



function draw() {
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

  // Iterate through webcam pixels
  for (let i = 0; i < video.pixels.length; i += 4) {
    let r = video.pixels[i];
    let g = video.pixels[i + 1];
    let b = video.pixels[i + 2];
    let brightness = (r + g + b) / 3;
    brightness += 51; // Increase brightness by 20%
    brightness = constrain(brightness, 0, 255); // Ensure brightness stays within 0-255 range
    video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = brightness;
  }
  
  // Update webcam pixels
  video.updatePixels();

  image(video, 400, 10, gridWidth, gridHeight);


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

  image(video, 10, 300, gridWidth, gridHeight);


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

image(video, 400, 300, gridWidth, gridHeight);



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

image(video, 800, 300, gridWidth, gridHeight);






redChannel = [];

for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
  redChannel.push(i)
}


video.updatePixels();

  
  // Iterate through webcam pixels
  for (let i = 0; i < video.pixels.length; i += 4) {
    // Extract red value from webcam source
    let r = video.pixels[i];
    
    // Apply red threshold
    if (r > redThreshold) {
      redChannel[i] = r; // Bright red
    } else {
      //redChannel[i] = redThreshold; // Dark red
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
  image(video, 10, 600, gridWidth, gridHeight);
  


greenChannel = [];

for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
  greenChannel.push(i)
}



/////////////////////////////////////////



video.updatePixels();

 


for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract red value from webcam source
  

  let r = video.pixels[i+1];
  
  // Apply red threshold  
  
  greenChannel[i] = 0; // Zero out G channel

  if (r > greenThreshold) {
    greenChannel[i+1] = r; // Bright red
  } else {
    //greenChannel[i+1] = greenThreshold; // Dark red
  }

  greenChannel[i + 2] = 0; // Zero out B channel
}



for (let i = 0; i < greenChannel.length; i++) {

  video.pixels[i] = greenChannel[i];
  
}


// Update pixels for red channel
video.updatePixels();

// Display red channel
image(video, 400, 600, gridWidth, gridHeight);




///////////////////////////////////////////////////




blueChannel = [];

for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
  blueChannel.push(i)
}

video.updatePixels();



for (let i = 0; i < video.pixels.length; i += 4) {
  // Extract red value from webcam source
  

  let r = video.pixels[i+2];
  
  // Apply red threshold  
  
  blueChannel[i] = 0; // Zero out G channel
 
  blueChannel[i + 1] = 0; // Zero out B channel
  

 if (r > blueThreshold) {
    blueChannel[i+2] = r; // Bright red
  } else {
    //blueChannel[i+2] = blueThreshold; // Dark red
  }

 
}



for (let i = 0; i < blueChannel.length; i++) {

  video.pixels[i] = blueChannel[i];
  
}


// Update pixels for red channel
video.updatePixels();

// Display red channel
image(video, 800, 600, gridWidth, gridHeight);


for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
}


///////////////////////////////////////////////////////////////






  
}






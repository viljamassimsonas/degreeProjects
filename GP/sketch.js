let video;
let snapshot;
let gridWidth = 160*2;
let gridHeight = 120*2;

function setup() {
  createCanvas(1100, 1000);
  
  // Initialize webcam
  video = createCapture(VIDEO);
  video.size(gridWidth, gridHeight);
  video.hide(); // Hide the video element


  test1 = true;

  test2 = true;

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



for (let i = 0; i < restore.length; i++) {

  video.pixels[i] = restore[i];
  
}



  // Capture webcam source
  video.loadPixels();
  
  // Create separate image objects for each channel
  let redChannel = createImage(gridWidth, gridHeight);
  
  // Load pixels for red channel
  redChannel.loadPixels();
  
  // Iterate through webcam pixels
  for (let i = 0; i < video.pixels.length; i += 4) {
    // Extract red value from webcam source
    let r = video.pixels[i];
    
    // Apply red threshold
    if (r > redThreshold) {
      redChannel.pixels[i] = r; // Bright red
    } else {
      redChannel.pixels[i] = redThreshold; // Dark red
    }
    redChannel.pixels[i + 1] = 0; // Zero out G channel
    redChannel.pixels[i + 2] = 0; // Zero out B channel
  }
  
  // Update pixels for red channel
  redChannel.updatePixels();
  
  // Display red channel
  image(redChannel, 10, 500, gridWidth, gridHeight);
  
  // Rest of your code...
}






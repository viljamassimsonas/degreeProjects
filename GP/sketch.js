let gridWidth  = 340;
let gridHeight = 200;
let video;
let capture;
let restore;

let faceapi;
let detections = 0;
let points = 0;
let minX = 0; 
let minY = 0;
let maxX = 0;
let maxY = 0;

let   redThresholdSlider;
let greenThresholdSlider;
let  blueThresholdSlider;
let     yThresholdSlider;
let    cbThresholdSlider;
let    crThresholdSlider;
let     hThresholdSlider;
let     sThresholdSlider;
let     vThresholdSlider;

let   redThreshold = 0;
let greenThreshold = 0;
let  blueThreshold = 0;
let     yThreshold = 0;
let    cbThreshold = 0;
let    crThreshold = 0;
let     hThreshold = 0;
let     sThreshold = 0;
let     vThreshold = 0;

preload = () =>
{
  angrySVG     = loadImage(    "angry.svg");
  disgustedSVG = loadImage("disgusted.svg");
  fearfulSVG   = loadImage(  "fearful.svg");
  happySVG     = loadImage(    "happy.svg");
  neutralSVG   = loadImage(  "neutral.svg");
  sadSVG       = loadImage(      "sad.svg");
  surprisedSVG = loadImage("surprised.svg");
}

setup = () =>
{
    createCanvas(1060, 1145);
    
    video = createCapture(VIDEO);
    video.size(gridWidth, gridHeight);
    video.hide();

    const faceOptions = {  withLandmarks: true, 
                         withExpressions: true, 
                         withDescriptors: true, 
                           minConfidence:  0.5};

    faceapi = ml5.faceApi(video, faceOptions, () => {faceapi.detect(gotFaces);});

    faceFilter = createSelect(true);
    faceFilter.position(100, 1060);
    faceFilter.option("Grayscaled_Face");
    faceFilter.option("Blurred_Face");
    faceFilter.option("Colour_Converted_Face");
    faceFilter.option("Pixelated_Face");

    tookCapture  = false
    captureAgain = false

    captureButton = createButton('TAKE CAPTURE');
    captureButton.position(233,190);
    captureButton.mousePressed(() => 
    {
        tookCapture = true

        capture = video.get()
        capture.loadPixels()

        restore = [];
        for (let i = 0; i < capture.pixels.length; i++) restore.push(capture.pixels[i]);
    });

    redThresholdSlider   = createSlider(0, 255, 128);
    greenThresholdSlider = createSlider(0, 255, 128);
    blueThresholdSlider  = createSlider(0, 255, 128);
    yThresholdSlider     = createSlider(0, 255, 128);
    cbThresholdSlider    = createSlider(0, 255, 128);
    crThresholdSlider    = createSlider(0, 255, 128);
    hThresholdSlider     = createSlider(0, 255, 128);
    sThresholdSlider     = createSlider(0, 255, 128);
    vThresholdSlider     = createSlider(0, 255, 128);

  redThresholdSlider.input(redThresholdUpdate); 
greenThresholdSlider.input(greenThresholdUpdate);
 blueThresholdSlider.input(blueThresholdUpdate);
    yThresholdSlider.input(yThresholdUpdate);
   cbThresholdSlider.input(cbThresholdUpdate);
   crThresholdSlider.input(crThresholdUpdate); 
    hThresholdSlider.input(hThresholdUpdate);
    sThresholdSlider.input(sThresholdUpdate);
    vThresholdSlider.input(vThresholdUpdate); 

  redThresholdSlider.position(10, 610);
greenThresholdSlider.position(360, 610);
 blueThresholdSlider.position(710, 610);
    yThresholdSlider.position(450, 1055);
   cbThresholdSlider.position(450, 1077.5);
   crThresholdSlider.position(450, 1100);                                          
    hThresholdSlider.position(800, 1055);
    sThresholdSlider.position(800, 1077.5);
    vThresholdSlider.position(800, 1100);
                                              
  redThresholdUpdate();  
greenThresholdUpdate(); 
 blueThresholdUpdate();
    yThresholdUpdate();
   cbThresholdUpdate();
   crThresholdUpdate();
    hThresholdUpdate();
    sThresholdUpdate();
    vThresholdUpdate();     
};


draw = () => 
{
    background(255);

    textSize(14);
    noStroke();
    fill('black');

    text( '  Y',  yThresholdSlider.x +  yThresholdSlider.width,  yThresholdSlider.y +  yThresholdSlider.height);
    text('  Cb', cbThresholdSlider.x + cbThresholdSlider.width, cbThresholdSlider.y + cbThresholdSlider.height);
    text('  Cr', crThresholdSlider.x + crThresholdSlider.width, crThresholdSlider.y + crThresholdSlider.height);
    text( '  H',  hThresholdSlider.x +  hThresholdSlider.width,  hThresholdSlider.y +  hThresholdSlider.height);
    text( '  S',  sThresholdSlider.x +  sThresholdSlider.width,  sThresholdSlider.y +  sThresholdSlider.height);
    text( '  V',  vThresholdSlider.x +  vThresholdSlider.width,  vThresholdSlider.y +  vThresholdSlider.height);  
    
    video.loadPixels();
    image(video, 10,  10, gridWidth, gridHeight);

    if (tookCapture == false) { 

        capture = video.get();
        capture.loadPixels()

        for (let i = 0; i < capture.pixels.length; i += 4) 
            capture.pixels[i] = capture.pixels[i + 1] = capture.pixels[i + 2] = 0;

        restore = [];
        for (let i = 0; i < capture.pixels.length; i++) restore.push(capture.pixels[i]);
    
    } else restoreVideo();

    capture.updatePixels()
    image(capture, 10, 640, gridWidth, gridHeight);
    
    extension(detections, 710, 20, 14);
    runFaceFilter();

    runFilter(360, 10, (i) => {grayscale20(i);});
    runFilter(10, 220, (i) => {capture.pixels[i + 1] = capture.pixels[i + 2] = 0;});
    runFilter(360,220, (i) => {capture.pixels[i]     = capture.pixels[i + 2] = 0;});
    runFilter(710,220, (i) => {capture.pixels[i]     = capture.pixels[i + 1] = 0;});
    runFilter(10, 430, (i) => {rgbSegmentation(i, 0,   redThreshold);});
    runFilter(360,430, (i) => {rgbSegmentation(i, 1, greenThreshold);});
    runFilter(710,430, (i) => {rgbSegmentation(i, 2,  blueThreshold);});
    runFilter(360,640, (i) => {ycbcr(i, false);});
    runFilter(360,850, (i) => {ycbcr(i,  true);});
    runFilter(710,640, (i) => {hsv(i, false, capture);});
    runFilter(710,850, (i) => {hsv(i,  true, capture);});
};



  redThresholdUpdate = () =>   {redThreshold =   redThresholdSlider.value();}; 
greenThresholdUpdate = () => {greenThreshold = greenThresholdSlider.value();};
 blueThresholdUpdate = () =>  {blueThreshold =  blueThresholdSlider.value();};
    yThresholdUpdate = () =>     {yThreshold =     yThresholdSlider.value();};
   cbThresholdUpdate = () =>    {cbThreshold =    cbThresholdSlider.value();};
   crThresholdUpdate = () =>    {crThreshold =    crThresholdSlider.value();};
    hThresholdUpdate = () =>     {hThreshold =     hThresholdSlider.value();};
    sThresholdUpdate = () =>     {sThreshold =     sThresholdSlider.value();};
    vThresholdUpdate = () =>     {vThreshold =     vThresholdSlider.value();};



//////////////////////// HELPER FUNCTIONS ///////////////////////////////


/////// ML5 FACE API //////////////
gotFaces = (err, res) => {detections = res; faceapi.detect(gotFaces);}


// runs functions within the bounds provided
boundsHelper = (callback) => 
{
    for (let x = 0; x < gridWidth; x++) {for (let y = 0; y < gridHeight; y++) {

        if ((x >= minX & x <= maxX) && (y >= minY & y <= maxY)) callback(x,y);
};};};  


//
restoreVideo = () => 
{
    for (let i = 0; i < restore.length; i++) capture.pixels[i] = restore[i];
};


//
runFilter = (x,y, callback) => 
{
    for (let i = 0; i < capture.pixels.length; i += 4) callback(i);
      
    capture.updatePixels();  
    image(capture, x, y, gridWidth, gridHeight);
    
    restoreVideo();
}
      

//
rgbSegmentation = (i, colour, threshold) => 
{
    if  (capture.pixels[i + colour] >= threshold)   
         capture.pixels[i] = capture.pixels[i + 1] = capture.pixels[i + 2] = 255;
    else capture.pixels[i] = capture.pixels[i + 1] = capture.pixels[i + 2] = 0;
}


//
runFaceFilter = () => 
{
  if (detections.length > 0) 
  {
        video.updatePixels();

        points = detections[0].landmarks.positions; // !!! MUST MAKE GLOBAL, LET ENCAPSULATES WITHIN THE 
        bounds = detections[0].detection._box;

        minX = bounds._x - 5;
        minY = bounds._y - 5;
        maxX = bounds._x + bounds._width  + 5;
        maxY = bounds._y + bounds._height + 5;

        if (faceFilter.value() ==                       0) faceBox();
        if (faceFilter.value() ==       "Grayscaled_Face") boundsHelper((x,y) => {grayscale(x,y);});
        if (faceFilter.value() == "Colour_Converted_Face") boundsHelper((x,y) => {hsv((y*gridWidth+x)*4, false, video);});      
        if (faceFilter.value() ==          "Blurred_Face") boundsHelper((x,y) => {  blurred(x,y);});        
        if (faceFilter.value() ==        "Pixelated_Face") pixelate();
            
    } else image(video, 10, 850, gridWidth, gridHeight);

    video.updatePixels();

    if (faceFilter.value() != 0 && faceFilter.value() != "Pixelated_Face") 
    
        image(video, 10, 850, gridWidth, gridHeight);
  }



faceBox = (x,y) => 
{
  image(video, 10, 850, gridWidth, gridHeight);

  for (let i = 0; i < points.length; i++) 
  {     
      stroke(161, 95, 251);                     
      strokeWeight(4);
      point(points[i]._x + 10, points[i]._y + 850);

      if (detections.length > 0) 
      {
          noFill();
          strokeWeight(1);
          stroke("red");
          rect(minX+10, minY+850, maxX-minX, maxY-minY);
};};};


grayscale20 = (i) =>
{
  brightness = ((capture.pixels[i] + capture.pixels[i + 1] + capture.pixels[i + 2]) / 3) * 1.2;
  brightness = constrain(brightness, 0, 255); 
  
  capture.pixels[i] = capture.pixels[i + 1] = capture.pixels[i + 2] = brightness;
};


grayscale = (x,y) => 
{
  let i = ((y*gridWidth+x)*4);

  let r = video.pixels[i];
  let g = video.pixels[i + 1];
  let b = video.pixels[i + 2];

  let brightness = (r + g + b) / 3;
  brightness += 51;                           // Increase brightness by 20%
  brightness = constrain(brightness, 0, 255); // Ensure brightness stays within 0-255 range
  
  if      (brightness > 150) video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 255;
  else if (brightness < 125) video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = 0;
  else                       video.pixels[i] = video.pixels[i + 1] = video.pixels[i + 2] = brightness;
};


ycbcr = (i, hasThreshold) => 
{
  let Y  =          0.299 * capture.pixels[i] + 0.587    * capture.pixels[i+1] + 0.114    * capture.pixels[i+2];
  let Cb = 128 - 0.168736 * capture.pixels[i] - 0.331264 * capture.pixels[i+1] + 0.5      * capture.pixels[i+2];
  let Cr =      128 + 0.5 * capture.pixels[i] - 0.418688 * capture.pixels[i+1] - 0.081312 * capture.pixels[i+2];

  let tY = hasThreshold ? 150 * ( yThreshold/128) : 150;
  let tB = hasThreshold ? 100 * (cbThreshold/128) : 100;
  let tR = hasThreshold ? 150 * (crThreshold/128) : 150;

  if (Y > tY && Cb > tB && Cr > tR) 
  {
    capture.pixels[i]     = 255; // Set red channel to maximum for segmentation
    capture.pixels[i + 1] = 0;
    capture.pixels[i + 2] = 0;
  } 
  else 
  {
    capture.pixels[i]     =  Y; // Set back to original RGB values for non-segmented pixels
    capture.pixels[i + 1] = Cb;
    capture.pixels[i + 2] = Cr;
};};



hsv = (i, hasThreshold, source) =>
{
  let r = source.pixels[i];
  let g = source.pixels[i + 1];
  let b = source.pixels[i + 2];
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
  source.pixels[i]     = hasThreshold ? H *  60 * (hThreshold / 128) : H *  60;
  source.pixels[i + 1] = hasThreshold ? S * 360 * (sThreshold / 128) : S * 360;
  source.pixels[i + 2] = hasThreshold ?       V * (vThreshold / 128) : V;
};


blurred = (x,y) => 
{
    let sum = [0, 0, 0];
      for (let dx = -4; dx <= 4; dx++) {    // <----- KERNEL CHANGE 3x3 = -1 & -1
        for (let dy = -4; dy <= 4; dy++) {  // <----- KERNEL CHANGE 5x5 = -2 & -2
                    
          let index = 4 * ((y + dy) * gridWidth + (x + dx));
          
          for (let i = 0; i < 3; i++) {
            sum[i] += video.pixels[index + i];
      };};};

    let pixelIndex = 4 * (y * video.width + x);
    for (let i = 0; i < 3; i++) {
            video.pixels[pixelIndex + i] = sum[i] / (3*3*3*3); // <--- CORRECT THE FORMULA
};};



pixelate = () => 
{
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


extension = (detections, x, y, ySpace) =>
{
  image(video, 710, 10, gridWidth, gridHeight);

  fill('yellow');
  stroke("red");
  strokeWeight(1.75);
  text('EXTENSION', 965, 205);

  // If at least 1 face is detected
  if(detections.length > 0){ 
          
      // assigns each var the value of each key in the dict
      let  expressions = detections[0].expressions; 
      let {angry, disgusted, fearful, happy, neutral, sad, surprised} = detections[0].expressions; 
      let  maxExpression = Object.keys(expressions).reduce((a,b) => expressions[a] > expressions[b] ? a:b);

      x  = x + 2
      y  = y + 2
      fX = -0.5 * (maxX-minX) + x + minX; 
      fY = -0.5 * (maxY-minY) + y + minY;
      wX = 2    * (maxX-minX);
      wY = 1.75 * (maxY-minY);

      if      (maxExpression == "angry")     image(angrySVG,     fX, fY, wX, wY);
      else if (maxExpression == "disgusted") image(disgustedSVG, fX, fY, wX, wY);
      else if (maxExpression == "fearful")   image(fearfulSVG,   fX, fY, wX, wY);
      else if (maxExpression == "happy")     image(happySVG,     fX, fY, wX, wY);
      else if (maxExpression == "neutral")   image(neutralSVG,   fX, fY, wX, wY);
      else if (maxExpression == "sad")       image(sadSVG,       fX, fY, wX, wY);
      else if (maxExpression == "surprised") image(surprisedSVG, fX, fY, wX, wY);
      
      ifMaxExpression = (expression) => {maxExpression == expression ? fill("red") : fill("yellow")};

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
};};
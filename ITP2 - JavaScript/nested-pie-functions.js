function NestedPieFunctions() {

    var self = this;

    this.createSectorsArrays = function (marketCapData, subSectionData, colorData) {

        // CREATES SECTOR ARRAY
        this.sectorArray = [];
        for (let i = 0; i < marketCapData.length; i++) {

            // CREATES STOCKS ARRAY
            var stocksArrayCache = [];
            for (let z = 0; z < marketCapData[i].getColumnCount(); z++) {

                // PUSHES SELECTED STOCK INTO STOCK ARRAY
                stocksArrayCache.push(marketCapData[i].getColumn(z));

                // CREATES SALES ARRAY
                var salesArrayCache = [];
                for (let p = 0; p < subSectionData[i][z].getRowCount(); p++) {
                    // CREATES SALES SECTION ARRAY
                    var subSectionCache = []; // SALES SECTION ARRAY
                    // PUSHES PRODUCT NAME INTO SALES SALES SECTION
                    subSectionCache.push(subSectionData[i][z].getRow(p).get(0));
                    // PUSHES PRODUCT SALES NUMBER INTO SALES SECTION
                    subSectionCache.push(subSectionData[i][z].getRow(p).get(1));
                    // PUSHES SALES SECTION ARRAY INTO SALES ARRAY
                    salesArrayCache.push(subSectionCache);
                }
                // PUSHES SALES ARRAY INTO SELECTED STOCK
                stocksArrayCache[z].push(salesArrayCache);
            }
            // PUSHES STOCKS ARRAY INTO SECTOR ARRAY
            this.sectorArray.push(stocksArrayCache);
        }
        // CREATES PIE SECTIONS COLOR ARRAY
        this.colorArray = colorData.getColumn(0);

    };

    this.totalAngleSum = function (indexOfAngle, array) {

        //CALCULATES TOTAL SUM OF ANGLES UP TO SPECIFIC ANGLE
        var totalAngleSum = 0;
        for (let i = 0; i <= indexOfAngle; i++) {
            totalAngleSum += array[i];
        }
        // ADDS EXTRA ROTATION FROM AUTO SPIN AND MANUAL ROTATION CONTROLS
        totalAngleSum += this.extraRotation;
        return totalAngleSum;
    };


    this.makeAngleDataArrays = function (sector, extraRotation) {

        // CREATES ALL ANGLE DATA ARRAYS REQUIRED

        this.innerAngles = [];
        this.outerAngles = [];
        this.subsectionNames = [];
        this.subsectionValues = [];


        for (let i = 0; i < sector.length; i++) {

            this.total = 0;

            // CALCULATES TOTAL MARKET CAP OF SECTOR SELECTED
            for (let z = 0; z < sector.length; z++) {
                this.total += parseFloat(sector[z][1], 10);
            }

            // CREATES INNER ANGLES ARRAY OF STOCKS BASED ON THEIR SIZE IN RESPECT TO MARKET CAP
            var ratio = parseFloat(sector[i][1], 10) / this.total; // CALCULATES RATIO   
            var angle = 360 * ratio; // CALCULATES ANGLE
            this.innerAngles.push(angle); // STOCKS ANGLE DATA

            // CALCULATES TOTAL REVENUE VALUE OF EACH STOCK
            var total = 0;
            for (let z = 0; z < sector[i][2].length; z++) {
                total += parseFloat(sector[i][2][z][1], 10);
            }

            // CREATES OUTER ANGLES, NAME AND VALUE DATA WHICH REPRESENT 
            // THE REVENUE VALUE OF EACH PRODUCT OF EACH STOCK
            for (let z = 0; z < sector[i][2].length; z++) {
                let ratio = parseFloat(sector[i][2][z][1], 10) / total; // CALCULATES RATIO   
                let angle = this.innerAngles[i] * ratio; // CALCULATES ANGLE
                this.outerAngles.push(angle); // PRODUCT ANGLE DATA
                this.subsectionNames.push(sector[i][2][z][0]); // PRODUCT NAME DATA
                this.subsectionValues.push((Math.round(ratio * 100)).toString()); // PRODUCT VALUE DATA
            }
        }

        // CREATES extraRotation OBJECT PARAMETER
        this.extraRotation = extraRotation;

    };



    this.createProductDataLabels = function (font) {

        for (let i = 0; i < this.outerAngles.length; i++) {

            // CREATES FINAL ANGLE VALUE
            var finalAngleValue = this.totalAngleSum(i, this.outerAngles) - this.outerAngles[i] / 2;

            // CREATES LABEL X AND Y DISTANCES FROM CENTER RESPECTIVE TO ANGLE
            var sides  = (-cos(-2 * (finalAngleValue) + 180) + 1) / 2;
            var updown = (-cos(-2 * (finalAngleValue)) + 1) / 2;
            var x = (3000 ** updown + 1850 - 1000 * sides) / 2 + 71 ** sides;
            var y = 300 + 150 ** updown;

            // START OF LABEL AND LINE DRAWING
            strokeWeight(0.85);
            stroke(this.colorArray[i]);
            fill(this.colorArray[i]);

            // CREATES LABEL POSITION AND BOUNDARIES RESPECTIVE TO ANGLE
            var boxBounds = font.textBounds(this.subsectionNames[i] + ' ' + this.subsectionValues[i] + '%' + '              ',
                                            x * cos(finalAngleValue) - 82 * (1 - cos(finalAngleValue)) / 2,
                                            y * sin(finalAngleValue) - 14 * (1 - sin(finalAngleValue)) / 2,
                                            12);

            // DRAWS LINE USING FINAL ANGLE LABEL BOUNDARIES DATA
            line(328.6 * cos(finalAngleValue),
                 328.6 * sin(finalAngleValue),
                 boxBounds.x + boxBounds.w * ((1 - cos(finalAngleValue)) / 2),
                 boxBounds.y + boxBounds.h * ((1 - sin(finalAngleValue)) / 2));

            // DRAWS LABEL USING BOUNDARIES DATA
            rect(boxBounds.x - 3, 
                 boxBounds.y - 1, 
                 boxBounds.w + 4, 
                 boxBounds.h + 4);

            // DRAWS LABEL TEXT WHICH CONTAINS PRODUCT NAME AND VALUE
            noStroke();
            textSize(14);
            fill('white');
            text(this.subsectionNames[i] + ' ' + this.subsectionValues[i] + '%',
                                        boxBounds.x, boxBounds.y - 0.5, 550, 14);
        }

    };

    this.drawPieSections = function (arcSize, angleArray, colorOffset, distanceCircle) {

        // DRAWS PIE SECTION
        for (let i = 0; i < angleArray.length; i++) {

            fill(this.colorArray[i + colorOffset]); // SETS SECTION COLOR
            arc(0, 0, arcSize, arcSize, // SETS SIZE
                this.totalAngleSum(i - 1, angleArray), // SETS STARTING ANGLE
                this.totalAngleSum(i - 1, angleArray) + angleArray[i]); // SETS ENDING ANGLE

            // DRAWS A LINE ACROSS ENDING ANGLE FROM THE 
            // CENTER TO THE EDGE OF THE NESTED PIE
            strokeWeight(0.8);
            stroke('black');
            line(0, 0, 331 * cos(this.totalAngleSum(i, this.innerAngles)),
                       331 * sin(this.totalAngleSum(i, this.innerAngles)));
            noStroke();

        }
        // CREATES WHITE SPACING BETWEEN INNER AND OUTTER
        // SECTIONS AND DRAWS CENTER CIRCLE ON THE LAST CALL
        fill('white');
        circle(0, 0, distanceCircle);

    };

    this.drawInnerSectionsText = function (sector, color, distance, stringLetterSpacing, stringHorizontalOffset, isSymbolTheInput) {

        fill(color);  // SETS TEXT COLOR

        for (let i = 0; i < this.innerAngles.length; i++) { // -1 cuz of autorotation angle

            // CHECKS TYPE OF INPUT REQUESTED AND ASSIGNS IT
            if (isSymbolTheInput == true) {
                // ASSIGNS STOCK SYMBOL AS INPUT
                textInput = sector[i][0];
            } else {
                // ASSIGNS STOCK MARKET CAP VALUE FROM TOTAL AS INPUT
                textInput = (Math.round(parseFloat(sector[i][1], 10) / this.total * 100)).toString() + '%';
            }

            // LOOPS AROUND EVERY CHARACTER OF THE INPUT STRING
            // THIS IS DUE THE WHOLE STRING BEING RENDERED IN A
            // CIRCULAR WAY TO FOLLOW THE NESTED PIE'S CURVATURE
            for (let z = 0; z < textInput.length; z++) {

                push();

                // CREATES CHARACTER POSITION
                function positioning(mStringHorizontalOffset) {

                    // TRANSLATES CHARACTER INTO CORRECT POSITION
                    translate(distance * cos(self.totalAngleSum(i, self.innerAngles) - self.innerAngles[i] / 2 - (z * stringLetterSpacing) + stringHorizontalOffset),
                              distance * sin(self.totalAngleSum(i, self.innerAngles) - self.innerAngles[i] / 2 - (z * stringLetterSpacing) + stringHorizontalOffset));

                    // ROTATES CHARACTER CORRECTLY SO THAT IT'S TOP FACES OPPOSITE FROM THE CENTER OF THE NESTED PIE
                    rotate(self.totalAngleSum(i, self.innerAngles) - self.innerAngles[i] / 2 + 90 + 180 - (z * 10) + stringHorizontalOffset - mStringHorizontalOffset);

                }

                // CHEKS IF THE SINGLE CHARACTER EQUALS TO 'M' AND CALLS IT'S APPROPIATE POSITION
                // THIS BECAUSE CHARACTER 'M' CAUSE POSITION PROBLEMS WITH THE DEFAULT INPUT
                sector[i][0].charAt(z) == 'M' ? positioning(5) : positioning(0);

                // DRAWS SINGLE CHARACTER
                text(textInput.charAt(z), 0, 0);

                pop();
            }
        }

    };

}

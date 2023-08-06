function AustralianHeatMapFunctions() {

    this.loadMapData = function () {
        // LOADS TRANSPARENT AUSTALIA IMAGE
        this.transparentAustraliaImage = loadImage('data/australia-heatmap/transparent.png');
        // LOADS EACH COUNTY'S VERTICES DATA TO BE USED TO DRAW A SHAPE
        this.countiesVerticesData = loadTable('data/australia-heatmap/coordinates.csv', 'csv', 'header');
        // LOADS THE POSITION OF EACH COUNTY LABEL
        this.labelsPositionData = loadTable('data/australia-heatmap/bounds.csv', 'csv', 'header');
        // LOADS THE COLORS USED TO REPRESENT VALUE INTENSITY
        this.valueColor = ['#F7F7F7', '#FAE6DA', '#FBD0B9', '#F4AF8F', '#E7886C', '#D6604D', '#BF3438', '#9A1027'];

    };

    this.createDataArrays = function (sectorSelected) {

        // CREATES ARRAY OF EACH COUNTY'S SHAPE VERTICES
        this.countiesVerticesArray = [];
        for (let i = 0; i < this.countiesVerticesData.getColumnCount(); i++) {

            this.countiesVerticesArray.push(this.countiesVerticesData.getColumn(i));

            // REMOVES EMPTY STRINGS FROM ARRAY
            while (this.countiesVerticesArray[i][this.countiesVerticesArray[i].length - 1] == '') {
                   this.countiesVerticesArray[i].pop();
            }
        }
        // CREATES ARRAY OF EACH COUNTY'S DATA VALUE 
        this.countiesValueArray = [];
        for (let i = 0; i < sectorSelected.getColumnCount(); i++) {
            this.countiesValueArray.push(sectorSelected.getColumn(i)[0]);
        }
        // CREATES LABEL POSITIONING ARRAY FOR EACH COUNTY
        this.countiesLabelPositionArray = [];
        for (let i = 0; i < this.labelsPositionData.getColumnCount(); i++) {
            this.countiesLabelPositionArray.push(this.labelsPositionData.getColumn(i));
        }

    };

    this.drawCountiesColorMapping = function () {
        // GETS MAX VALUE FROM THE COUNTIES' DATA VALUE ARRAY
        var maxValue = Math.max(...this.countiesValueArray);

        // IF THE MAX VALUE IS ODD, IT ADDS 1 TO MAKE IT EVEN
        if (maxValue % 2 != 0) {
            maxValue += 1;
        }

        // CALCULATES VALUE SCALE AS THERE IS ONLY 8 COLOR INTENSITIES
        this.scale = maxValue / 8;

        stroke('black');

        // LOOPS THROUGH EACH COUNTY
        for (let i = 0; i < this.countiesVerticesArray.length; i++) {
            var totalCount = 0;
            var addedCount = totalCount + this.scale;

            // ASSIGNS APPROPIATE COLOR INTENSITY TO A GIVEN COUNTY VALUE DATA
            for (let z = 0; z < this.valueColor.length; z++) {

                if (this.countiesValueArray[i] == maxValue) {
                    this.countiesValueArray[i] -= 0.01;
                }
                if (totalCount <= this.countiesValueArray[i] &&
                    this.countiesValueArray[i] < addedCount) {

                    fill(this.valueColor[z]);
                    break;

                } else {
                    totalCount += this.scale;
                    addedCount += this.scale;
                }
            }
            // DRAWS ALL COUNTIES THAT CAN BE REPRESENTED WITH A RECTANGLE
            if (this.countiesVerticesArray[i].length == 4) {
                rect(this.countiesVerticesArray[i][0],
                     this.countiesVerticesArray[i][1],
                     this.countiesVerticesArray[i][2],
                     this.countiesVerticesArray[i][3]);

                // DRAWS NEW SOUTH WALES WHICH REQUIRES A SPECIAL SHAPE
            } else {
                beginShape();
                for (let z = 0; z < 7; z += 2) {
                    vertex(this.countiesVerticesArray[i][z],
                           this.countiesVerticesArray[i][z + 1]);
                }
                endShape(CLOSE);
            }
        }
    };

    this.drawCountiesLabel = function (font) {

        // LOOPS THROUGH EACH COUNTY
        noStroke();
        for (let i = 0; i < this.countiesLabelPositionArray.length; i++) {

            fill('black');
            // CREATES LABEL POSITION AND BOUNDARIES
            var boxBounds = font.textBounds(this.labelsPositionData.columns[i] + '       ',
                                            parseInt(this.countiesLabelPositionArray[i][0]),
                                            parseInt(this.countiesLabelPositionArray[i][1]), 
                                            12);
            // CREATES LABELS
            rect(boxBounds.x,
                 boxBounds.y - 5,
                 boxBounds.w,
                 boxBounds.h + 9);

            // CREATES LABEL TEXT
            fill('white');
            text(this.countiesVerticesData.columns[i],
                 parseInt(this.countiesLabelPositionArray[i][0]),
                 parseInt(this.countiesLabelPositionArray[i][1]));
        }
    };

    this.drawLegendValues = function () {

        // LOOPS TRHOUGH EACH SCALE VALUE, TOTAL OF 8
        var verticalOffset = 0;
        var totalCount = 0;
        for (let i = 0; i < 8; i++) {

            // DRAWS COLOR LEGEND BOX ACCORDING TO COLOR ARRAY INDEX
            stroke('black');
            fill(this.valueColor[i]);
            rect(1370, 195 + verticalOffset, 25, 25);

            // DRAWS VALUE LEGEND ACORDING INDEX AND SCALE VALUE
            var addedCount = totalCount + this.scale;

            textSize(25);
            noStroke();
            fill('black');
            text(totalCount + ' to ' + addedCount,
                       1403, 217 + verticalOffset);

            verticalOffset += 38;
            totalCount += this.scale;
        }
    };

    this.drawInfoTable = function (title) {

        translate(100, 100);

        // DRAWS TABLE
        stroke('black');
        fill('white');
        rect(1350, 150, 300, 350);

        // DRAWS LEGEND TABLE TITLE 
        fill('black');
        text(title, 1500, 180);

        // DRAWS LEGEND VALUES
        textAlign(LEFT);
        this.drawLegendValues();
    };

}
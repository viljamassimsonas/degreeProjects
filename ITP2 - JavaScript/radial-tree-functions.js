function RadialTreeFunctions() {


    this.createDataArrays = function (sector) {

        // CREATES HOLDING AND SUBSIDIARIES COMPANY 
        // NAMES ARRAY AND SUBSIDIARY TOTAL COUNT
        var totalSubsidiariesCount = 0;
        this.holdingCompanyArray = [];
        this.subsidiariesArray = [];
        for (let i = 0; i < sector.getColumnCount(); i++) {
            this.holdingCompanyArray.push(sector.columns[i]);
            this.subsidiariesArray.push(sector.getColumn(i));
            while (this.subsidiariesArray[i][this.subsidiariesArray[i].length - 1] == '') {
                   this.subsidiariesArray[i].pop();
            }
            totalSubsidiariesCount += this.subsidiariesArray[i].length;
        }

        // USES SUBSIDIARY COUNT TO CALCULATE 
        // EACH SUBSIDIARY EQUAL ANGLE SEPARATION 
        var subsidiaryAngleSize = 360 / totalSubsidiariesCount;

        // CALCULATES BRANCH ANGLE BASED ON AMOUNT
        // OF SUBSIDIARIES IT CONTAINS AND PUSHES INTO ARRAY
        this.angleArray = [];
        for (let i = 0; i < this.subsidiariesArray.length; i++) {
            this.angleArray.push(this.subsidiariesArray[i].length * subsidiaryAngleSize);
        }

        // CALCULATES BRANCH SEGMENT LENGTH
        // BASED ON ITS ANGLE SIZE AND PUSHES INTO ARRAY
        this.segmentSizeArray = [];
        for (let i = 0; i < this.angleArray.length; i++) {
            this.segmentSizeArray.push(340 * sin(this.angleArray[i]));
        }

    };

    this.drawBranchEnd = function (i) {

        noFill();
        // DRAWS BRANCH IF NUMBER OF SUBSIDIARIES IN BRANCH IS ODD
        if (this.subsidiariesArray[i].length % 2 != 0) {

            arc(0, 0, 200, 1, 180, 270);
            for (let z = 1; z <= (this.subsidiariesArray[i].length - 1) / 2; z++) {
                arc(0, 0, 200, this.segmentSizeArray[i] * z / ((this.subsidiariesArray[i].length - 1) / 2), 90, 180);
                arc(0, 0, 200, this.segmentSizeArray[i] * z / ((this.subsidiariesArray[i].length - 1) / 2), 180, 270);
            }

        // DRAWS BRANCH IF NUMBER OF SUBSIDIARIES IN BRANCH IS EVEN
        } else {

            for (let z = 1; z <= this.subsidiariesArray[i].length / 2; z++) {

                arc(0, 0, 200, this.segmentSizeArray[i] * (z * 2 / (this.subsidiariesArray[i].length - 1) - 1 / (this.subsidiariesArray[i].length - 1)), 90, 180);
                arc(0, 0, 200, this.segmentSizeArray[i] * (z * 2 / (this.subsidiariesArray[i].length - 1) - 1 / (this.subsidiariesArray[i].length - 1)), 180, 270);
            }
        // THIS IS DUE IT REQUIRES DIFFERENT FORMULAS TO MAKE IT DRAW
        // THE BRANCH SUBSIDIARES ARCS AT EQUAL DISTANCES FROM EACH OTHER
        }
    };

    this.drawSubsidiariesNames = function (i) {

        noStroke();
        fill('black');

        // LOOPS THROUGH EACH SUBSIDIARY
        for (let z = 0; z < this.subsidiariesArray[i].length; z++) {

            push();

            // ROTATES SUBSIDIARY NAME POSITION IF IT'S 
            // SITUATED ON THE LEFT SIDE BASED ON ANGLE
            // AND TRANSLATES IT
            if (this.rotationAngle % 360 > 90 && this.rotationAngle % 360 <= 270) {

                rotate(180);
                textAlign(RIGHT);
                translate(-5, -this.segmentSizeArray[i] / 2 + (this.segmentSizeArray[i] / (this.subsidiariesArray[i].length - 1)) * z + 3);

            } else {

                translate( 5, -this.segmentSizeArray[i] / 2 + (this.segmentSizeArray[i] / (this.subsidiariesArray[i].length - 1)) * z + 3);
            }
            // DRAWS SUBSIDIARY NAME
            textSize(15);
            text(this.subsidiariesArray[i][z], 0, 0);
            pop();

        }

    };

    this.drawHoldingCompanyName = function (font, i) {

        translate(-240, 0);

        // ROTATES HOLDING COMPANY NAME POSITION IF IT'S 
        // SITUATED ON THE LEFT SIDE BASED ON ANGLE
        if (this.rotationAngle % 360 > 90 && this.rotationAngle % 360 <= 270) {
            rotate(180);
            textAlign(RIGHT);
        }

        // CREATES LABEL POSITION AND DIMENSION
        var boxBounds = font.textBounds(this.holdingCompanyArray[i] + '    ', 0, 3, 12);

        // DRAWS LABELS
        rect(boxBounds.x - 8, 
             boxBounds.y - 2, 
             boxBounds.w + 16, 
             boxBounds.h + 5);

        // DRAWS COMPANY NAME ON LABEL
        fill('white');
        textSize(14);
        text(this.holdingCompanyArray[i], 0, 4);

    };

    this.drawBranches = function (font, extraRotation) {

        // LOOPS THROUGH EACH BRANCH PLUS ADDS
        // MANUAL ROTATION AND AUTO SPIN VALUES TO TOTALANGLE
        var totalAngle = 0 + extraRotation;
        for (let i = 0; i < this.angleArray.length; i++) {

            // ADDS ANGLE TO THE TOTAL
            totalAngle += this.angleArray[i];

            // CALCULATES ANGLE ROTATION -> TOTAL - ANGLE/2
            this.rotationAngle = totalAngle - this.angleArray[i] / 2;

            push();

            //ROTATES AND PLOTS BRANCH MAIN LINE
            rotate(this.rotationAngle);
            line(0, 0, 300, 0);

            // CALLS BRANCH END AND COMPANY NAME DRAWING METHODS
            translate(400, 0);
            this.drawBranchEnd(i);
            this.drawSubsidiariesNames(i);
            this.drawHoldingCompanyName(font, i);

            pop();

        }

    };


    this.drawCenterText = function (sectorName) {

        // DRAWS CENTER CIRCLE
        fill('black');
        circle(0, 0, 100);

        // DRAWS SELECTED SECTOR NAME INSIDE CIRCLE
        fill('white');
        textSize(22);
        textAlign(CENTER);
        text(sectorName, -22, -10, 50);

    };


}
function SharedFunctions() {

    var self = this;

    this.checkExcelExists = function (directory) {

        // CHECKS IF EXCEL EXISTS IN GIVEN DIRECTORY
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('HEAD', directory, false);
        httpRequest.send();

        // A 404 STATUS WILL BE VISIBLE IN THE CONSOLE,
        // IS REQUIRED TO BE ABLE TO COUNT HOW MANY EXCELS ARE IN TOTAL
        if (httpRequest.status == "404") {
            print('THIS 404 ERROR IS REQUIRED');
            return false;
        }    
    };

    this.loadExcelData = function (id, marketCap, header) {

        // COUNTS HOW MANY EXCELS IN TOTAL
        var excelCount = 0; // MARKET CAP EXCEL COUNT
        while (this.checkExcelExists('data/' + id + '/' + marketCap + excelCount.toString() + '.csv') != false) {
            excelCount += 1;
        }

        // USES ITERATION VARIABLE TO GET EXCEL FROM DIRECTORY
        // LOOPS AS MANY TIMES AS THE EXCEL COUNT PROVIDED
        this.excelData = [];
        for (let i = 0; i < excelCount; i++) { // MARKET CAP TABLE ARRAY
            this.excelData.push(loadTable('data/' + id + '/' + marketCap + i.toString() + '.csv', 'csv', header,));
        }

        // SPECIAL CONDITION FOR NESTED PIE EXCEL LOADING
        if (id == 'nested-pie') {

            // LOADS SUBSECTION DATA USING THE SAME EXCEL COUNT SYSTEM BUT REQUIRES NESTED LOOPING
            this.subSectionData = [];
            for (let i = 0; i < excelCount; i++) {
                var excelSecondCount = 0;
                while (this.checkExcelExists('data/nested-pie/' + i.toString() + excelSecondCount.toString() + '.csv') != false) {
                    excelSecondCount += 1;
                }
                var cache = [];
                for (let z = 0; z < excelSecondCount; z++) {
                    cache.push(loadTable('data/nested-pie/' + i.toString() + z.toString() + '.csv', 'csv'));
                }
                this.subSectionData.push(cache);
            }
            // LOADS SPECIFIC NESTED PIE COLOR DATA
            this.colorData = loadTable('data/nested-pie/colors.csv', 'csv');
        }
        // LOADS EXTRA NAME DATA LIKE SECTOR/DATA NAMES
        this.extraNameData = loadTable('data/' + id + '/' + 'extraNameData' + '.csv', 'csv');
        // LOADS FONT
        this.font = loadFont('font.otf');
    };

    this.createExcelSelect = function (dataArray, extraNameData, horizontalOffset) {

        // MAKES INTO PROPERTY OFFSET VALUE
        this.horizontalOffset = horizontalOffset

        // ASSIGNS SELECTED DATA AS PROPERTIES TO BE USED BY OTHER OBJECTS
        // ALLOWS MULTIPLE EXCELS TO BE USED IN THE SAME INSTANCE
        function change() {
            for (let i = 0; i < dataArray.length; i++) {
                // CHECKS WHICH OPTION SELECTED 
                if (self.select.value() == extraNameData.getColumn(1)[i]) {
                    self.dataSelected = dataArray[i]; // SETS DATA SELECTED
                    self.nameInput = extraNameData.getColumn(0)[i]; // SETS SELECTED DATA NAME
                }
            }
        }

        this.dataSelected = dataArray[0]; // SETS DEFAULT ATA SELECTED
        this.nameInput = extraNameData.getColumn(0)[0]; // SETS DEFAULT DATA NAME SELECTION

        // CREATES SELECT DROPDOWN MENU
        this.select = createSelect();
        this.select.position(1610 + horizontalOffset, 145); 

        // LOOPERS WHICH ADDS SELECT OPTIONS
        for (let i = 0; i < extraNameData.getColumn(1).length; i++) {
            this.select.option(extraNameData.getColumn(1)[i]);
        }

        // CALLS change FUNCTION WHEN SELECTION CHANGED
        this.select.changed(change);

    };


    this.createRotationControls = function () {

        // CREATES MANUAL ROTATION SLIDER
        this.slider = createSlider(0, 360 * 4, 0);
        this.slider.position(1600 + this.horizontalOffset, 75);
        
        // CREATES AUTO SPIN BUTTON 
        this.button = createButton('AUTO SPIN');
        this.button.position(1750 + this.horizontalOffset, 65);

        // INITIALISES VARIABLES USED
        // TO MAKE CONTROLS FUNCTIONAL
        this.extraRotation = 0;
        this.pressed = false;
        this.stopCount = 0;

    };

    this.destroyAll = function (isRotationUsed) {

        // REMOVES SELECT DROPDOWN MENU
        this.select.remove();

        // REMOVES MANUAL ROTATION AND AUTO SPIN CONTROLS
        if (isRotationUsed == true) {

            this.slider.remove();
            this.button.remove();

        }

    };

    this.rotationFunctionality = function () {

        // AUTOSPIN WORKS BY ADDING FRAME COUNT VALUE
        // INTO extraRotation PROPERTY WHICH IS USED
        // BY OTHER OBJECTS

        // MANUAL ROTATION VALUE FROM SLIDER ALSO GETS
        // ADDED HERE

        // CHANGES AUTO SPIN BOOLEAN VALUE WHEN PRESSED
        function press() {
            self.pressed = !self.pressed;
        }

        // WHEN AUTO SPIN IS ACTIVATED
        // IT RECORDS FRAME COUNT
        if (this.pressed == true) {
            this.extraRotation = frameCount + this.slider.value();
            this.stopCount = frameCount;

            // FORCES STOP COUNT ONTO FRAME COUNT
            // TO ALLOW RESTART FROM STOPPED POSITION
        } else {
            this.extraRotation = this.slider.value() + this.stopCount;
            frameCount = this.stopCount;
        }

        // CALLS press FUNCTION WHEN AUTO SPIN PRESSED
        this.button.mousePressed(press);

        // SLOWS DOWN AUTO SPIN SPEED
        this.extraRotation = this.extraRotation / 4;

        // ADDS DESCRIPTION TO MANUAL ROTATION SLIDER
        push();
        fill('black');
        textSize(12);
        text('ROTATE MANUALLY', 1300 + this.horizontalOffset, 65);
        pop();

    };

}



















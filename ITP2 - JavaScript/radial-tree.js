function RadialTree() {

	this.name = 'Radial Tree';

	this.id = 'radial-tree';

	// CREATES SharedFunctions OBJECT
	var SF = new SharedFunctions();
	// CREATES RadialTreeFunctions OBJECT
	var RTF = new RadialTreeFunctions();

	this.preload = function () {
		// LOADS EXCEL DATA
		SF.loadExcelData(this.id, '', 'header');

	};

	this.setup = function () {

		angleMode(DEGREES);

		// CREATES SELECT DROPDOWN MENU TO CHOOSE DESIRED SECTOR
		// WITH HORIZONTAL OFFSET TO THE LEFT
		SF.createExcelSelect(SF.excelData,
							 SF.extraNameData,-200);

		// CREATES MANUAL ROTATION AND AUTO SPIN CONTROLS
		SF.createRotationControls();

	};

	this.destroy = function () {

		// DESTROYS ALL CONTROLS AND SELECT MENU
		SF.destroyAll(true);

	};

	this.draw = function () {

		// MAKES ROTATIONAL CONTROLS FUNCTIONAL
		SF.rotationFunctionality();

		// CREATES DATA ARRAYS FROM SELECTED SECTOR
		// USED TO DRAW BRANCHES AND COMPANY NAMES 
		RTF.createDataArrays(SF.dataSelected);

		push();

		translate((width / 3) + 50, height / 2);

		scale(0.925)

		// DRAWS BRANCHES AND COMPANY NAMES 
		RTF.drawBranches(SF.font, 
						 SF.extraRotation);

		// DRAWS SELECTED SECTOR IN THE CENTRE
		RTF.drawCenterText(SF.nameInput);

		pop();

	};


}
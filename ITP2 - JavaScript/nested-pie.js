function NestedPie() {

	this.name = 'Nested Pie';

	this.id = 'nested-pie';

	// CREATES SharedFunctions OBJECT
	var SF = new SharedFunctions();
	// CREATES NestedPieFunctions OBJECT
	var NPF = new NestedPieFunctions();

	this.preload = function () {
		// LOADS EXCEL DATA
		SF.loadExcelData(this.id, 'marketCap', '');

	};

	this.setup = function () {

		angleMode(DEGREES);

		// CREATES A COMPLEX ARRAY OF ALL DATA OF ALL SECTORS
		NPF.createSectorsArrays(SF.excelData,
								SF.subSectionData,
								SF.colorData);

		// CREATES SELECT DROPDOWN MENU TO CHOOSE DESIRED SECTOR
		SF.createExcelSelect(NPF.sectorArray,
							 SF.extraNameData, 0);

		// CREATES MANUAL ROTATION AND AUTO SPIN CONTROLS						
		SF.createRotationControls(0);

	};

	this.destroy = function () {

		// DESTROYS ALL CONTROLS AND SELECT MENU
		SF.destroyAll(true);

	};

	this.draw = function () {

		// MAKES ROTATIONAL CONTROLS FUNCTIONAL
		SF.rotationFunctionality();

		// CALCULATES ANGLES AND PUSHES THEM INTO ARRAYS
		NPF.makeAngleDataArrays(SF.dataSelected,
								SF.extraRotation);

		push();

		translate((width / 3) + 100, (height / 2) + 10);

		// CREATES REVENUE DATA(OUTER ANGLE SECTIONS) LABELS AND LINES
		NPF.createProductDataLabels(SF.font);

		// DRAWS PIE SECTIONS BASED ON ANGLE ARRAY DATA
		NPF.drawPieSections(662.5, NPF.outerAngles, 0, 600);

		NPF.drawPieSections(591, NPF.innerAngles, 30, 582);

		NPF.drawPieSections(446.25, NPF.innerAngles, 30, 300);

		textSize(40);

		// DRAWS INNER SECTION STOCK SYMBOL
		NPF.drawInnerSectionsText(SF.dataSelected, 'white', 195.75, 10, 20, true);

		// DRAWS PERCENTAGE OF TOTAL MARKET CAP FOR EACH STOCK
		NPF.drawInnerSectionsText(SF.dataSelected, 'black', 270, 5.5, 10);

		textAlign(CENTER);

		// DRAWS SELECTED SECTOR NAME AND MARKET CAP IN THE CENTER
		text(SF.nameInput, -95, -27.5, 200);

		pop();

	};

}
function AustralianHeatMap() {

	this.name = 'Australia Heat Map';

	this.id = 'australia-heatmap';

	// CREATES SharedFunctions OBJECT
	var SF = new SharedFunctions();
	// CREATES AustralianHeatMapFunctions OBJECT
	var AHF = new AustralianHeatMapFunctions();

	this.preload = function () {
		// LOADS MAP DATA
		AHF.loadMapData();
		// LOADS EXCEL DATA
		SF.loadExcelData(this.id, '', 'header');

	};

	this.setup = function () {
		// CREATES SELECT DROPDOWN MENU TO SELECT THE DESIRED
		// DATA TO BE VISUALISED WITH OFFSET TO THE LEFT
		SF.createExcelSelect(SF.excelData,
							 SF.extraNameData, -205);

	};

	this.destroy = function () {
		// DESTROYS SELECT MENU
		SF.destroyAll();

	};

	this.draw = function () {

		// CREATES DATA ARRAYS USED TO MAP THE SELECTED DATA
		AHF.createDataArrays(SF.dataSelected);

		push();

		translate(-75, 0);
		scale(0.8);

		// DRAWS ALL COUNTIES WITH CORRECT COLOR VALUE
		AHF.drawCountiesColorMapping();

		// LOADS TRANSPARENT AUSTRALIA IMAGE
		image(AHF.transparentAustraliaImage, 22, 88);

		textSize(15);
		textAlign(CENTER);

		// DRAWS LABELS WHICH CONTAIN THE COUNTY'S NAME
		AHF.drawCountiesLabel(SF.font);

		// DRAWS INFO TABLE CONTAINING THE DATA NAME AND
		// THE VALUE LEGEND OF EACH COLOR INTENSITY
		AHF.drawInfoTable(SF.nameInput);

		pop();
	};
}
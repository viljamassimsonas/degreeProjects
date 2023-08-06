var counter = 0;
//ADDS DROPDOWN MENU FUNCTIONALITY USING CLICK EVENT
document.getElementsByTagName("body")[0].onclick = (event) => {
	//IF CLICK WAS OUTSIDE THE EXPAND ICON:
	if (event.target !== document.getElementById("expandImage")) {
		//HIDES DROPDOWN MENU
		document.getElementById('dropdown').style.display = 'none';
		//HIDES VIOLET BACKGROUND HIGHLIGHT FOR EXPAND ICON
		document.getElementById('expandImage').style.backgroundColor = 'transparent';
		//RESETS COUNTER
		counter = 0;
	
	//IF CLICK WAS INSIDE THE EXPAND ICON:
	} else {

		counter += 1;
		//SHOWS DROPDOWN MENU
		document.getElementById('dropdown').style.display = 'block';
		//CREATES VIOLET BACKGROUND HIGHLIGHT FOR EXPAND ICON
		document.getElementById('expandImage').style.backgroundColor = '#ff00ef';
		//CHECKS IF EXPAND ICON HAS BEEN CLICKED TWICE BEFORE OUTSIDE CLICK
		if (counter % 2 == 0) {
			//IF SO CLOSES DROPDOWN MENU BY MAKING IT DISSAPEAR
			document.getElementById('dropdown').style.display = 'none';
			//REMOVES VIOLET HIGHLIGHT
			document.getElementById('expandImage').style.backgroundColor = 'transparent';
			
		}

	}
	
};
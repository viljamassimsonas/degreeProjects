// COMPILES IMAGE CAROUSEL DATA
compiler("imageCarousel", dataInput, "target1");

// COMPILES LATEST NEWS SECTION
compiler("latestNews", dataInput, "target2");

// CREATES buildSlide() OBJECT
buildMe = new buildSlide();

// CREATES buildSlide() CONSTRUCTOR FUNCTION
function buildSlide() {

    self = this;

    //ASSIGNS VARIABLES
    this.circles = document.getElementsByClassName("indicator");
    this.moveRight = document.getElementById("moveRight");
    this.latestSection = document.getElementsByClassName("latestSection");
    this.images = document.getElementsByClassName("latestImage");

    this.selected = 0;


    //FUNCTION IN CHARGE OF HANDLING THE SLIDE CHANGE
    this.changeSlide = function (i) {
        this.latestSection[this.selected].style.display = "none";
        this.images[this.selected].style.display = "none";
        this.circles[this.selected].classList.remove("active");
        this.selected = i;
        if (this.selected == 5) { this.selected = 0; }
        this.latestSection[this.selected].style.display = "block";
        this.images[this.selected].style.display = "block";
        this.circles[this.selected].className += " active";

    };

    //METHOD INVOKED WHEN PRESSED ON INDICATOR
    //WHICH CALLS FOR SLIDE CHANGE
    this.showSelectedSlide = function (i) {
        this.changeSlide(i);

    };

    //METHOD INVOKED WHEN PRESSED ON RIGHT SLIDE BUTTON
    //WHICH CALLS FOR SLIDE CHANGE
    this.showRightSlide = function () {
        self.changeSlide(self.selected + 1);
    };


    //HIDES ALL CAROUSEL IMAGE DATA AT INIT 
    //AND CREATES EVENT LISTENER FOR EVERY INDICATOR
    for (let i = 0; i < this.images.length; i++) {

        this.latestSection[i].style.display = "none";
        this.images[i].style.display = "none";
        this.circles[i].addEventListener("click", () => { this.showSelectedSlide(i); });

    }


    //EVENT LISTEBER FOR RIGHT SLIDE BUTTON
    this.moveRight.addEventListener("click", this.showRightSlide);

    //SETS DEFAULT ACTIVE SLIDE SHOWN BASED ON SELECTED DATA
    //WHICH IS INIT AS 0 AT FIRST
    this.latestSection[this.selected].style.display = "block";
    this.images[this.selected].style.display = "block";
    this.circles[this.selected].className += " active";

    //METHOD WHICH CALL NEXT SLIDE ON INTERVAL
    this.interval = function () {
        setInterval(this.showRightSlide, 7000);
    };


}

//CALLS FOR AUTOMATIC SLIDE ON INIT
buildMe.interval();








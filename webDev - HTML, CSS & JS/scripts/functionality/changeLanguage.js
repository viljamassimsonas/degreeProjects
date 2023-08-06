var backtoEnglish = [];
var idArray = [];

function updateLanguage() {

    //FUNCTION TO REPLACE INNER HTML DATA
    function toSpanish(id, stringToReplace) {

        //PUSHES INNER HTML DATA FROM EACH ID ASSIGNED ELEMENT
        backtoEnglish.push(document.getElementById(id).innerHTML);
        
        //PUSHES EACH ID INTO ARRAY
        idArray.push(id);

        //REPLACES INNER HTML DATA WITH SPANISH DATA
        document.getElementById(id).innerHTML = stringToReplace;

    }

    if (document.getElementById("langSelect").value == "ES") {

        //CHANGES ALL INNER HTML DATA INTO SPANISH
        toSpanish("nav1translate", "HOGAR");
        toSpanish("nav2translate", "CRIPTO");
        toSpanish("nav3translate", "MERCADO");
        toSpanish("nav4translate", "TECNOLOGIA");
        toSpanish("nav5translate", "SOBRE");
        toSpanish("contractTitle", "EMAIL DE CONTACTO");      
        toSpanish("terms", "Terminos y Condiciones");

        //CONDITIONAL, RUNS ONLY IF ARTICLE PAGE
        if (typeof articleLanguage != 'undefined') {

            //SETS ARTICLE LANGUAGE TO SPANISH
            articleLanguage = "SPANISH"

            //COMPILES SPANISH ARTICLE PAGE VERSION
            buildArticle(dataInputES)

        //CONDITIONAL, RUNS ONLY IF CATEGORY PAGE
        } else if (typeof categoryArray != 'undefined') {

            //CREATES SPANISH CATEGORY BASED ARTICLE ARRAY
            dataCategory = {news:[]}
            
            console.log(categoryArray[parseFloat(document.getElementById('bridge').innerHTML)])
            
            for (let i=0; i < dataInputES.news.length; i++){
            
                if (dataInputES.news[i].category == categoryArray[categoryIndex]){
                    dataCategory.news.push(dataInputES.news[i])
                }
            
            }

            //COMPILES CATEGORY PAGE USING PREVIOUSLY CREATED ARRAY DATA
            compiler("categoryTemplate",dataCategory,"target")

        //CONDITIONAL, RUNS ONLY IF HOME PAGE
        } else if (typeof buildMe != 'undefined') {

            //COMPILES SPANISH VERSION OF IMAGE CAROUSEL DATA
            compiler("imageCarousel", dataInputES, "target1");
            
            //COMPILES SPANISH LATEST NEWS SECTION
            compiler("latestNews", dataInputES, "target2");
        
            //CREATES IMAGE CAROUSEL OBJECT
            buildMe = new buildSlide()

        }

        //CHANGES INTO SPANISH SUBSCRIBE SECTION
        toSpanish("subButton", "CONFIRMAR");

        toSpanish("subscribeTitle", "SUBSCRIBETE AL NEWSLETTER:");
        
        document.getElementById("emailInput").value = "ESCRIBE TU EMAIL";

    }

    //SAME CONDITIONALS AS PREVIOUSLY BUT FOR ENGLISH RENDERING BACK FROM SPANISH
    if (document.getElementById("langSelect").value == "EN") {

        if (typeof articleLanguage != 'undefined') {

            articleLanguage = "ENGLISH"

            buildArticle(dataInput)

        } else if (typeof categoryArray != 'undefined') {
    
            dataCategory = {news:[]}
            
            for (let i=0; i < dataInput.news.length; i++){
            
                if (dataInput.news[i].category == categoryArray[categoryIndex]){
                    dataCategory.news.push(dataInput.news[i])
                }
            
            }
        
            compiler("categoryTemplate",dataCategory,"target")

        } else if (typeof buildMe != 'undefined') {

            compiler("imageCarousel", dataInput, "target1");
            
            compiler("latestNews", dataInput, "target2");
        
            buildMe = new buildSlide()

        }

        //USES ARRAYS CREATED AT toSpanish() TO TRANSLATE
        //BACK TO ENGLISH ALL ID ELEMENTS AFFECTED
        for (let i = 0; i < idArray.length; i++) {

            document.getElementById(idArray[i]).innerHTML = backtoEnglish[i];
               
        }

        document.getElementById("emailInput").value = "ENTER EMAIL ADDRESS"

    }

}

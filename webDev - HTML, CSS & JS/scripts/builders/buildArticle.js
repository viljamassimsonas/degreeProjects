// SETS ENGLISH AS DEFAULT ARTICLE LANGUAGE
articleLanguage = "ENGLISH"

// FUNCTION TO BUILD ARTICLE ON CALL
function buildArticle(dataInputSelected) {

    this.insertArticle = function() {

        // INSERTS ARTICLE IFRAME DATA INTO ARTICLE SECTION UNDER METADATA AREA(THE AREA UNDER THE TITLE,HEADING,IMAGE,TIME)
        document.getElementById("newsAreaArticle").innerHTML = articleSource.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
        
    }

    // INSERT ARTICLE TEMPLATE IFRAME INTO ARTICLE BASE IFRAME
	document.getElementById("newsSection").innerHTML = document.getElementById("newsSectionSource").contentWindow.document.getElementsByTagName("body")[0].innerHTML;
			
    // USES THE REFERENCE INDEX PASSED FROM PARENT FRAME TO COMPILE THE ARTICLE TEMPLATE USING EITHER dataInput or dataInputES OBJECT DATA ARRAY
    compiler('newsSection',dataInputSelected.news[parseInt(document.getElementById('bridge').innerHTML)],'target')
	
    // GETS ARTICLE CONTENT FROM IFRAME FROM ARTICLE FOLDER WITH ID 'ENGLISH' OR 'SPANISH'
	articleSource =  document.getElementById(articleLanguage)

    // CALL INSERT ARTICLE FUNCTION ONCE ARTICLE IFRAME LOADS
    articleSource.addEventListener("load",this.insertArticle);

    // SETS CATEGORY HIGHLIGHT IN NAV BAR BASED ON CATEGORY OF ARTICLE
    categoryArray = ['CRYPTO', 'MARKET', 'TECH'];

    catIndex = categoryArray.indexOf(document.getElementById("catIndex").innerHTML)

    document.getElementsByClassName('navButton')[catIndex + 1].classList.add('currentPage')
}





function buildCategory() {

    // SETS INDEX VALUE THAT WAS PASSED FROM THE PARENT IFRAME
    categoryIndex = parseFloat(document.getElementById('bridge').innerHTML);

    // USES CATEGORY INDEX TO HIGHLIGHT CATEGORY IN NAV BAR
    document.getElementsByClassName('navButton')[categoryIndex + 1].classList.add('currentPage');

    categoryArray = ['CRYPTO', 'MARKET', 'TECH'];

    dataCategory = { news: [] };

    for (let i = 0; i < dataInput.news.length; i++) {

        // PUSHES ALL ALL ARTICLES THAT HAVE THE SELECTED CATEGORY VALUE
        if (dataInput.news[i].category == categoryArray[categoryIndex]) {
            dataCategory.news.push(dataInput.news[i]);
        }

    }

    // INSERT CATEGORY TEMPLATE IFRAME DATA INTO CATEGORY BASE PAGE IFRAME
    document.getElementById('categoryTemplate').innerHTML = document.getElementById('categoryTemplateSource').contentWindow.document.getElementsByTagName('body')[0].innerHTML;

    // COMPILES CATEGORY ARTICLE PAGE CONTENTS
    compiler('categoryTemplate', dataCategory, 'target');

}
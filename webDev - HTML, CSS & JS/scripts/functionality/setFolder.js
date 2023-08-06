//EXTRACTS FOLDER NAME FROM DIRECTORY PATH STRING
folder = folder.slice(folder.length - 15, folder.length - 11);

//FINDS ARTICLE REFENCE INDEX BASED ON MATCHING 
//FOLDER VALUE AND INSERTS TITLE INTO TAB BAR
for (let i = 0; i < dataInput.news.length; i++) {
    if (dataInput.news[i].folder == folder) {
        indexSelected = i;
        document.title += dataInput.news[indexSelected].title;
    }
}




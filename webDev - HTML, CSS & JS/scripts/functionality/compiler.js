//HANDLEBARS COMPILER

function compiler(templateID, dataSelected, targetLocation) {

template = document.getElementById(templateID).innerHTML

compiledTemplate = Handlebars.compile(template)

compiledData = compiledTemplate(dataSelected)

document.getElementById(targetLocation).innerHTML = compiledData

}


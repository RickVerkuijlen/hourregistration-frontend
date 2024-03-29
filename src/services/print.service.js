var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts');
const fs = require('fs');
const PdfPrinter = require('pdfmake');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const _baseFolder = "V:\\Tekeningen\\";
let printer = new PdfPrinter();

const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "october", "november", "december"];

function printWeeklyOverview(data) {
    console.log(data);
    var docDefinition = {
        content: [
            "Weekoverzicht",
            {
                table: {
                    body: [
                        ['Bureau', 'Werknummer', 'Project', 'Plaats', 'Omschrijving']
                    ]
                }
            }
        ]
    }
    pdfMake.createPdf(docDefinition).download();
}

function printMonthlyOverview(data, implementorName, month) {
    var totalHours = 0
    var edwin = 0;
    var rianne = 0;
    var ginn = 0;
    var stage = 0;
    var tableContent = {
        widths: ['auto','auto','auto','auto','auto','auto','auto','auto','auto'],
        body: [
            [{text: 'WerkNr.', style: 'header'}, {text: 'Project', style: 'header'}, {text: 'Plaats', style: 'header'}, {text: 'Omschrijving', style: 'header'}, {text: 'Edwin', style: 'header'}, {text: 'Rianne', style: 'header'}, {text: 'Ginn', style: 'header'}, {text: 'Stage', style: 'header'}, {text: 'Totale uren', style: 'header'}]
        ]
    }

    data.forEach(element => {
        var content = 
            [{text: element.projectId, bold: true}, element.name, element.city, element.description, {text: element.users[0].workedHours.toFixed(2), alignment: 'right'}, {text: element.users[1].workedHours.toFixed(2), alignment: 'right'}, {text: element.users[2].workedHours.toFixed(2), alignment: 'right'}, {text: element.users[3].workedHours.toFixed(2), alignment: 'right'}, {text: element.totalHours.toFixed(2), alignment: 'right'}]
        tableContent.body.push(content);
        totalHours += element.totalHours;
        edwin += element.users[0].workedHours;
        rianne += element.users[1].workedHours;
        ginn += element.users[2].workedHours;
        stage += element.users[3].workedHours
    });
   
    var hours = ["", "", "", "", {text: edwin.toFixed(2), alignment: 'right', bold: true}, {text: rianne.toFixed(2), alignment: 'right', bold: true}, {text: ginn.toFixed(2), alignment: 'right', bold: true}, {text: stage.toFixed(2), alignment: 'right', bold: true}, {text: totalHours.toFixed(2), alignment: 'right', bold: true}]
    tableContent.body.push(hours);

    var docDefinition = {
        info: {
            title: "Maandlijst " + month,
            subject: "Maandlijst " + month,
        },
        footer: function(currentPage, pageCount) { return {text: new Date().getDate() +"-"+ (new Date().getMonth() + 1) + "-" + new Date().getFullYear() + " \n Pagina " + currentPage.toString() + " van de " + pageCount, alignment: 'center'}},
        content: [           
            {text: "Maandlijst " + implementorName, style: 'title'},
            {text: "Maand: " + month + " (" + monthNames[month.split("-")[0] - 1] + ")", margin: [0,5,0,15], bold: true, fontSize: 15},
            {
                layout: 'lightHorizontalLines',
                table: tableContent
            }
        ],
        defaultStyle: {
            fontSize: 10
        },
        styles: {
            title: {
                fontSize: 22,
                color: "purple",
                bold: true
            },
            header: {
                fillColor: "#7d7d7d",
                color: 'white',
                bold: true
            }
        }
    }

    pdfMake.createPdf(docDefinition).download("Maandlijst-" + month + "-" + implementorName);
}

function printLetter(data, user) {
    console.log(user)

    var included = [];
    data.included.forEach(element => {
        if(element.classList.contains("highlighted")) {
            included.push({text: element.value + "\n", style: 'highlight'})
        } else {
            included.push({text: element.value + "\n"})
        }
    })

    var regarding = [];
    data.regarding.forEach(element => {
        if(element.classList.contains("highlighted")) {
            regarding.push({text: element.value + "\n", style: 'highlight'})
        } else {
            regarding.push({text: element.value + "\n"})
        }
    })

    var docDefinition = {
        content: [
            "\n\n\n\n\n\n\n\n",
            user.company,
            user.name,
            user.address,
            user.zipcode,
            "\n\n\n",
            data.writing,
            "\n\n",
            data.subject,
            "\n\n\n\n",
            {text: "Betreft: ", bold: true},
            {text: included},
            "\n",
            {text: regarding},
            "\n\n",
            data.textarea,
            {text: data.close , absolutePosition: {x:40, y:700}},
        ],
        styles: {
            highlight: {
                background: 'yellow'
            }
        }
    }

    pdfMake.createPdf(docDefinition).download(user.name + " - " + data.writing + ".pdf");
}
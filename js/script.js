// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
tei_xml = '../xml/' + tei_xml;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// Function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../xsl/Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  

// Function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../xsl/Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  documentLoader();
  statsLoader();
  // Event listener for sel1 change
  function selectHand(event) {
   var visible_mary = Array.from(
    document.getElementById("text").querySelectorAll("*:not(#PBS)")
    );
  var visible_percy = document.getElementsByClassName('#PBS');
  var allTextElements = Array.from(document.querySelectorAll('p, add, del'));
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
    if (event.target.value == 'both') {
    // A method that shows all the text written and modified by both hand (in black).
     MaryArray.forEach(function(element) {
      element.style.color = 'black';
    });
     PercyArray.forEach(function(element) {
      element.style.color = 'black';
    });
    } else if (event.target.value == 'Percy') {
     // A method that shows all the text modified (add, del) by Percy in blue and the rest in black. 
     MaryArray.forEach(function(element) {
      element.style.color = 'black';
    });
     PercyArray.forEach(function(element) {
      element.style.color = 'blue';
    });
    } else {
     // A method that shows all the text modified (add, del) by Mary in orange and the text rest in black.
     MaryArray.forEach(function(element) {
      element.style.color = 'orange';
    });
     PercyArray.forEach(function(element) {
      element.style.color = 'black';
    });
    }
  }


  // A function that will toggle the display of the deletions by clicking on a button
    function toggleDeletions(event) {
      var deletions = document.getElementsByTagName('del');
      var deletionsArray = Array.from(deletions);

    deletionsArray.forEach(function(deletion) {
      if (deletion.style.display === 'none') {
        deletion.style.display = ''
      } else {
        deletion.style.display = 'none';
      }
    });
  }


 // A function that will display the text as a reading text by clicking on a button, meaning that all the deletions and notes are removed and the additions are shown inline (not in superscript)
var isReadingMode = false;

function readingMode(event) {
  var deletions = document.getElementsByTagName('del');
  var additions = document.getElementsByClassName('supraAdd');
  var notes = document.getElementsByClassName('note');
  var metamarks = document.getElementsByClassName('metamark');

  Array.from(deletions).concat(Array.from(notes)).concat(Array.from(metamarks)).forEach(function(element) {
    element.style.display = isReadingMode ? '' : 'none';
  });

  Array.from(additions).forEach(function(addition) {
    if (isReadingMode) {
      addition.style.verticalAlign = 'super';
      addition.style.fontSize = '';
    } else {
      addition.style.verticalAlign = 'baseline';
      addition.style.fontSize = 'inherit';
    }
  });

  isReadingMode = !isReadingMode;
}



// Functions for the "Toggle deletions", "Reading mode" and "Toggle notes" buttons
document.addEventListener('DOMContentLoaded', function() {
    var toggleDeletionsButton = document.getElementById('toggleDeletionsButton');
    toggleDeletionsButton.textContent = 'Hide deletions';
    toggleDeletionsButton.classList.add('btn-success');

    toggleDeletionsButton.addEventListener('click', function() {
        var deletions = document.getElementsByTagName('del');
        var areDeletionsVisible = Array.from(deletions).some(del => del.style.display !== 'none');

        if (areDeletionsVisible) {
            Array.from(deletions).forEach(function(del) {
                del.style.display = 'none';
            });
            this.classList.remove('btn-success');
            this.classList.add('btn-secondary');
            this.textContent = 'Show deletions';
        } else {
            Array.from(deletions).forEach(function(del) {
                del.style.display = ''; // or 'block', depending on how they should be displayed
            });
            this.classList.remove('btn-secondary');
            this.classList.add('btn-success');
            this.textContent = 'Hide deletions';
        }
    });
});


document.getElementById('readingModeButton').addEventListener('click', function() {
  this.classList.toggle('btn-primary');
  this.classList.toggle('btn-success');

  if (this.classList.contains('btn-success')) {
    this.textContent = 'Reading mode';
  } else {
    this.textContent = 'Reading mode';
  }
});


document.addEventListener('DOMContentLoaded', function() {
    var toggleNotesButton = document.getElementById('toggleNotesButton');
    toggleNotesButton.textContent = 'Hide notes'; // Set initial button text
    toggleNotesButton.classList.add('btn-success'); // Set initial button class

    toggleNotesButton.addEventListener('click', function() {
        var notes = document.getElementsByClassName('note');
        var metamarks = document.getElementsByClassName('metamark');

        var isNotesVisible = Array.from(notes).some(note => note.style.display === 'block' || note.style.display === '');

        if (isNotesVisible) {
            Array.from(notes).concat(Array.from(metamarks)).forEach(function(note) {
                note.style.display = 'none';
            });
            this.classList.remove('btn-success');
            this.classList.add('btn-secondary');
            this.textContent = 'Show notes';
        } else {
            Array.from(notes).concat(Array.from(metamarks)).forEach(function(note) {
                note.style.display = 'block';
            });
            this.classList.remove('btn-secondary');
            this.classList.add('btn-success');
            this.textContent = 'Hide notes';
        }
    });
});
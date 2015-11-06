//Create the map
var metMusData = [];
var word;
var map;

//---------------------------
//AJAX CALL TO MET MUSEUM API
//---------------------------

function searchMetMuseum(word){
  // console.log(word);

  var metMusURL = 'http://scrapi.org/search/' + word;

  $.ajax({
    url: metMusURL,
    type: 'GET',
    dataType: 'json',
    error: function(data){
      
    },
    success: function(data){

      metMusData = data;

      //Make certain we got the data
      console.log(metMusData);

      createMetHTML();
    }
  });
}

//--------------
//CREATE THE MAP
//--------------

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 25.730324, lng: 32.608309},
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

//---------------------------------------------------------------
//Isolate a specific historic site by clicking name on the map -- 
//and grab the name of the site to use in museum ajax call.
//---------------------------------------------------------------

      //store the original setContent-function
      var fx = google.maps.InfoWindow.prototype.setContent;

      //override the built-in setContent-method
      google.maps.InfoWindow.prototype.setContent = function (content) {

      //when argument is a node
      if (content.querySelector) {

      //search for the address
      var name = content.querySelector('.gm-title');

      if (name) {

        word = name.textContent;
      }
    }

    //run the original setContent-method
    fx.apply(this, arguments);

    //replace word spaces with underscores
    word = word.split(' ').join('_');

    // console.log(word);
    searchMetMuseum(word);
  };
}

//-----------------------
//PUT MET RESULTS ON PAGE
//-----------------------

function createMetHTML() {

//Create bar with location info & museum attribution

word = word.split('_').join(' ');

var htmlCategoryString = '';

htmlCategoryString += '<div class="museumSearchInfo">' + 'Items from ' + '<b>' + word + '</b>' + ' in the Metropolitan Museum of Art (www.metmuseum.org)' + '</div>';

$('#museumSearchInfo').append(htmlCategoryString);

var htmlString = '';
var dataLength = metMusData.collection.items.length;

//Create museum search results

for (var i = 0; i < dataLength; i++){
htmlString += '<div class="container">';
// htmlString += '<img src=' + metMusData.collection.items[i].image_thumb + '/>';
htmlString += '<h4>' + '<a href = ' + metMusData.collection.items[i].website_href + '>' + metMusData.collection.items[i].title + '</a>';
htmlString += '<p>' + 'Accession Number: ' + metMusData.collection.items[i].accessionNumber + '</p>';
htmlString += '<p>' + 'Date: ' + metMusData.collection.items[i].dateText + '</p>';
htmlString += '<p>' + 'Medium: ' + metMusData.collection.items[i].medium + '</p>';
htmlString += '</div>';
}

$('#metMuseumResults').append(htmlString);
}


$(document).ready(function(){
  console.log("We are ready!");
  initMap();
});


//Thank you, Dr. Molle http://stackoverflow.com/questions/21486868
//for the basis of this method for grabbing historic site name. 
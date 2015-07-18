var map;
var geocoder;
function initialize() {
	geocoder = new google.maps.Geocoder();
  var mapOptions = {
    zoom: 16,
    center: new google.maps.LatLng(32.75, -97.13)
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
      '&signed_in=true&callback=initialize';
  document.body.appendChild(script);
}

window.onload = loadScript;

function sendRequest () {
   var xhr = new XMLHttpRequest();
   var query = encodeURI(document.getElementById("search").value);
   var box = map.getBounds();
   var ne = box.getNorthEast();
   nelat = ne.lat();
   nelng = ne.lng();
   var sw = box.getSouthWest();
   swlat = sw.lat();
   swlng = sw.lng();
   var bounds = nelat+","+ nelng +"|"+ swlat +","+ swlng;
   var query2 = encodeURI(bounds);
   xhr.open("GET", "proxy.php?term=" + query+"&bounds= "+ query2);
   //indian+restaurant&location=Arlington+Texas&limit=5");
   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function (){
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
          var str = JSON.stringify(json,undefined,2);
		  

		  
		  document.getElementById("output").innerHTML = " <th>Label</th><th>Name</th><th>Image-url</th><th>Rating-image-url</th><th>Snippet-text</th>";
		 
			
		for(i=0; i< 10 && i< json.businesses.length; i++)
		  {
			var mark = i+1;
			var url = json.businesses[i].url;
			var name = json.businesses[i].name;
			var image_url = json.businesses[i].image_url;
			var rating_img_url = json.businesses[i].rating_img_url;
			var snippet_text = json.businesses[i].snippet_text;
			var address = json.businesses[i].location.display_address;
			document.getElementById("output").innerHTML += "<tr> <td>"+ mark +"</td> <td> <a href= "+ url +"> " + name + "</a> </td> <td> <img src= " + image_url + " </img> </td> <td> <img src= " + rating_img_url + " </img> </td> <td> " + snippet_text + " </td> </tr> ";
			codeAddress(address,mark); 
		  }	  
       }
   };
   xhr.send(null);
   }
   
 function codeAddress(address, mark) {
	var str = JSON.stringify(address,undefined,2);
	var markstr = JSON.stringify(mark,undefined,2);
    geocoder.geocode( { 'address': str}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
			title: markstr //Marker will appear after few seconds of keeping mouse on marker
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }   


/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
      document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

      $('#back').on('click',function(){window.history.back();});

      var h = $('#descricao').outerHeight() * 2;
      $('#conteudo').css({'max-height':'calc(90% - '+h+'px)','height':'calc(90% - '+h+'px)','top':'calc(10% + '+(h/2)+'px)'});

      $('#confirm').on('click',function(){
        localStorage.setItem('NewEventLat',latitude);
        localStorage.setItem('NewEventLng',longitude);
        window.history.back();
      });

    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var latitude;
var longitude;
var watchID = null;
var geo = true;

function onSuccess(position,cord) {
  if ( geo ){
    geo = false;
    if ( position == null ){
      latitude = parseFloat(cord[0]);
      longitude = parseFloat(cord[1]);
    } else {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    }

    $('#cb').html('Latitude: '+latitude.toFixed(4)+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Longitude: '+longitude.toFixed(4));
    $('#long').html(longitude);

    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, { attribution: osmAttrib });

    map.setView(new L.LatLng(latitude, longitude), 16);
    map.addLayer(osm);

    var myIcon = L.icon({
      iconUrl: '../img/sets/ic_pin_n.png',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    var marker = L.marker([latitude, longitude],{icon: myIcon}).addTo(map);

    var popup = L.popup();
    function onMapClick(e) {
      marker.setLatLng(e.latlng);
      latitude = e.latlng.lat;
      longitude = e.latlng.lng;
      $('#cb').html('Latitude: '+latitude.toFixed(4)+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Longitude: '+longitude.toFixed(4));
    }
    map.on('click', onMapClick);
  }
}

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

var map = new L.Map('mapa');

if ( localStorage.getItem('NewEventLat') == null && localStorage.getItem('NewEventLng') == null ){
  watchID = navigator.geolocation.watchPosition(onSuccess, onError);
} else {
  onSuccess(null,[localStorage.getItem('NewEventLat'),localStorage.getItem('NewEventLng')]);
}


app.initialize();

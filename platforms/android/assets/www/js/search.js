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

      //$('#ft_perfil').html(localStorage.getItem('label'));
      $('#back').on('click',function(){window.history.back();});

      loadPage(page);

      $('#feed').on('click',function(){loadPage(0);page = 0;});
      $('#about').on('click',function(){loadPage(1);page = 1;});

      $('#conteudo').css('margin-top',$('#topo').outerHeight() + $('#barra').outerHeight());
      $('#conteudo').css('height','calc(100% - '+($('#topo').outerHeight() + $('#barra').outerHeight())+'px)');

      $('#label_topo').on('input',function(){
        v = $(this).val();
        loadSearch($(this).val(),0);
        l = 0;
      });

      document.getElementById('conteudo').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('conteudo').addEventListener('touchmove', function(evt){
        var h = handleTouchMove(evt);
        if (h == "left"){
          if ( page < 1 ){
            page++;
            loadPage(page);
          }
        } else if (h == "right"){
          if ( page > 0 ){
            page--;
            loadPage(page);
          }
        }
        return;
      }, false);
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

var l = 0;
var v = localStorage.getItem('wordSearch');

$('#label_topo').val(localStorage.getItem('wordSearch'));

var xDown = null;
var yDown = null;
var page = localStorage.getItem('pageSearch');

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
};

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
        if ( xDiff > 0 ) {
          xDown = null;
          yDown = null;
          return "left";
        } else {
          xDown = null;
          yDown = null;
          return "right";
        }
    }
    return;
};

function loadPage(i){
  $('#conteudo').html("<img src='img/sets/loading.gif' id='loading'>");
  if ( i == 0 ){
    $('#conteudo').load('search/peoples.html');
    $('#tab_barra').css('margin-left','0%');
  } else if ( i == 1 ){
    $('#conteudo').load('search/events.html');
    $('#tab_barra').css('margin-left','50%');
  }
}


$("#conteudo").scroll(function() {
  if ($(this).scrollTop() + $(this).height() == $(this).get(0).scrollHeight) {
    if ( l >= 0 ){
      l += 10;
      loadSearch(v,l);
    }
  }
});

app.initialize();

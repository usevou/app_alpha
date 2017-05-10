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

      createCalendar(mes_atual,ano_atual);

      $('#back_mes').on('click',function(){
        if ( mes_atual == (mes_agr-1) && ano_atual == ano_agr ){
          $('#back_mes').css('display','none');
          $('#mes_atual').css('margin-left','10%');
        }
        if ( mes_agr == 0 ){
          ano_agr--;
          mes_agr = 11;
        } else {
          mes_agr--;
        }
        createCalendar(mes_agr,ano_agr);
      });
      $('#next_mes').on('click',function(){
        if ( mes_atual < (mes_agr+1) && ano_atual <= ano_agr ){
          $('#back_mes').css('display','block');
          $('#mes_atual').css('margin-left','0%');
        }
        if ( mes_agr == 11 ){
          ano_agr++;
          mes_agr = 0;
        } else {
          mes_agr++;
        }
        createCalendar(mes_agr,ano_agr);
      });

      document.getElementById('mes').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('mes').addEventListener('touchmove', function(evt){
        var h = handleTouchMove(evt);
        if (h == "left"){
          if ( mes_atual < (mes_agr+1) && ano_atual <= ano_agr ){
            $('#back_mes').css('display','block');
            $('#mes_atual').css('margin-left','0%');
          }
          if ( mes_agr == 11 ){
            ano_agr++;
            mes_agr = 0;
          } else {
            mes_agr++;
          }
          createCalendar(mes_agr,ano_agr);
        } else if (h == "right"){
          if ( mes_atual == (mes_agr-1) && ano_atual == ano_agr ){
            $('#back_mes').css('display','none');
            $('#mes_atual').css('margin-left','10%');
          }
          if ( (mes_atual != mes_agr && ano_atual == ano_agr) || ano_atual != ano_agr ){
            if ( mes_agr == 0 ){
              ano_agr--;
              mes_agr = 11;
            } else {
              mes_agr--;
            }
            createCalendar(mes_agr,ano_agr);
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

var mes_atual = new Date().getMonth();
var mes_agr = mes_atual;
var ano_atual = new Date().getFullYear();
var ano_agr = ano_atual;
$('#back_mes').css('display','none');
$('#mes_atual').css('margin-left','10%');

function findDay(i,ano){
  var mes = [0,3,3,6,1,4,6,2,5,0,3,5];

  a = 1 + mes[i];
  b = Math.floor(a / 7);
  c = a - (b * 7);
  ano -= 2000;
  d = Math.floor(ano / 28);
  e = ano - d;
  f = Math.floor(ano / 4);
  g = e + f;
  if ( (i == 0 || i == 1) && (ano % 4 == 0 || ano % 400 == 0) ){
    g -= 1;
  }
  h = c + g;
  i = Math.floor(h / 7);
  j = h - (i * 7);
  if ( j == 0 ){
    j = 5;
  } else {
    j -= 2;
    if ( j < 0 ){
      j = 6;
    }
  }
  return j;
}

function createCalendar(mes,ano){
  $('#num_events').html('00');
  var meses = ["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  $('#mes_atual').html(meses[mes]+", "+ano);
  $('#mes_header').html(meses[mes]);
  $('#ano_header').html(ano);

  html = '<div class="semana_dias">'+
    '<div class="dia">S</div>'+
    '<div class="dia">T</div>'+
    '<div class="dia">Q</div>'+
    '<div class="dia">Q</div>'+
    '<div class="dia">S</div>'+
    '<div class="dia find">S</div>'+
    '<div class="dia find">D</div>'+
  '</div>';

  if ( ano % 4 == 0 || ano % 400 == 0 )
    var lim = [31,29,31,30,31,30,31,31,30,31,30,31];
  else
    var lim = [31,28,31,30,31,30,31,31,30,31,30,31];

  var ini = findDay(mes,ano);
  if ( mes == 0 ){
    var antm = 11;
    var ant = lim[11] - ini;
  } else {
    var antm = mes-1;
    var ant = lim[mes-1] - ini
  }
  var day = ant;
  var f = 1;
  var g = 1;
  while(f == 1){
    html += '<div class="semana">';
    for ( var i=0;i<7;i++ ){
      day++;
      if ( day > lim[antm] && g == 1 ){
        day = 1;
        g = 0;
      }
      if ( day > lim[mes] && f == 1 && g == 0 ){
        day = 1;
        f = 0;
      }
      if ( g == 1 || f == 0 ){
        html += '<div class="dia"></div>';
      } else {
        html += '<div class="dia" id="'+ano+'-'+((mes+1)<10?'0'+(mes+1):(mes+1))+'-'+(day<10?'0'+day:day)+'" '+
                'onclick="localStorage.setItem(\'agendaDay\','+day+');localStorage.setItem(\'agendaMonth\','+mes+');localStorage.setItem(\'agendaYear\','+ano+');window.location.href = \'day.html\'">'+day+'</div>';
      }
      if ( i == 6 && day == lim[mes] ){
        day = 1;
        f = 0;
      }
    }
    html += '</div>';
  }
  $('#tabela').html(html);
  getEvents(ano, mes);
}

var xDown = null;
var yDown = null;

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

function getEvents(ano,mes){
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/event.php",
    data: {
        'q': 'agenda',
        'idusuario': window.localStorage.getItem('IdUsu'),
        'mes': (mes+1),
        'ano': ano
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
        for(var i=0;i<json.length;i++){
          $('#'+json[i]['date']).addClass('dia_d');
        }
        $('#num_events').html((json.length<10?'0'+json.length:json.length));
      }
    },error: function(xhr,e,t){
      alert(xhr.responseText);
    }
  });
}

app.initialize();

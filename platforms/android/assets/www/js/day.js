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
      var meses = ["Janeiro","Fevereiro","Mar&ccedil;o","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
      $('#label_topo').html((day<10?'0'+day:day)+' de '+meses[mes]+' de '+ano);
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

var day = localStorage.getItem('agendaDay');
var mes = localStorage.getItem('agendaMonth');
var ano = localStorage.getItem('agendaYear');

$.ajax({
  type: "POST",
  url: "http://usevou.com/app/event.php",
  data: {
      'q': 'agenda_day',
      'idusu': window.localStorage.getItem('IdUsu'),
      'dia': day,
      'mes': (parseInt(mes)+1),
      'ano': ano
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      var html = '';
      var j = 0;
      for ( var i=0;i<json.length;i++ ){
        var ideve = json[i]["ideve"];
        var lat = json[i]["lat"];
        var lng = json[i]["lng"];
        var img = json[i]["img"];
        var dt_fim = json[i]["dt_fim"];
        var dt_ini = json[i]["dt_ini"];
        var hr_fim = json[i]["hr_fim"];
        var hr_ini = json[i]["hr_ini"];
        var nome = json[i]["nome"];
        var coins = json[i]["coins"];

        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat+','+lng + "&sensor=true";
        $.getJSON(url, function (data) {
          numero = data.results[0].address_components[0].short_name;
          rua = data.results[0].address_components[1].short_name;
          bairro = data.results[0].address_components[2].short_name;
          cidade = data.results[0].address_components[3].short_name;
          $('#c'+j).html(rua+', '+numero+' - '+bairro);
          $('#l'+j).html(cidade);
          j++;
        });

        html += '<div class="card">'+
          '<div class="card_list" style="background-image:url('+img+')" onclick="localStorage.setItem(\'viewEvent\','+ideve+');window.location.href = \'../evento.html\'">'+
            '<div class="fundo_card">'+
            (coins>0?'<div class="amigos_list"><img src="../img/sets/selo.png"></div>':'')+
              '<div class="info_list">'+
                '<div class="icon_list"><img src="../img/sets/ic_date.png"><div>'+(dt_fim==null?dt_ini:dt_ini+' - '+hr_ini)+'</div></div>'+
                '<div class="icon_list"><img src="../img/sets/ic_'+(dt_fim==null?'time':'date')+'.png"><div>'+(dt_fim==null?hr_ini:dt_fim+' - '+hr_fim)+'</div></div>'+
              '</div>'+
              '<div class="present_list">'+
                '<div class="name_event">'+nome+'</div>'+
                '<div class="name_create" id="c'+i+'"></div>'+
                '<div class="name_locale" id="l'+i+'"></div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
      }
      $('#conteudo').html(html);
    } else {
      $('#conteudo').html('<div style="float:left;text-align:center;margin:10%;font-size:1.5em;width:80%;font-family:Lato-Light;">Não há nenhum evento confirmado para este dia.</div>');
    }
  },error: function(xhr,e,t){
    alert(xhr.responseText);
  }
});

app.initialize();

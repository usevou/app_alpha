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
      $('#back').on('click',function(){
        window.history.back();
        localStorage.removeItem('viewEvent');
        localStorage.removeItem('NewEventImg');
        localStorage.removeItem('NewEventNome');
        localStorage.removeItem('NewEventLat');
        localStorage.removeItem('NewEventLng');
        localStorage.removeItem('NewEventDtIni');
        localStorage.removeItem('NewEventHrIni');
        localStorage.removeItem('NewEventDtFim');
        localStorage.removeItem('NewEventHrFim');
        localStorage.removeItem('NewEventDesc');
        localStorage.removeItem('NewEventTags');
        localStorage.removeItem('NewEventOrg');
        localStorage.removeItem('NewEventDe');
        localStorage.removeItem('NewEventAte');
        localStorage.removeItem('NewEventPri');
        localStorage.removeItem('NewEventPerm');
      });

      loadPage(0);

      $('#feed').on('click',function(){loadPage(0);page = 0;});
      $('#about').on('click',function(){loadPage(1);page = 1;});

      var p = $('#topo').css('padding-bottom');
      var pp = parseInt(p.substr(0,p.length-2));
      var total = $('#header_profile').height() - $('#topo').height() - $('#barra').height() - pp;

      $('#conteudo').css('min-height','calc(100% - '+($('#topo').height() + $('#barra').height() + pp - 2)+'px)');

      $(window).scroll(function () {
        var s = $(this).scrollTop();
        if ( s >= total ){
          $('#barra').css({'position':'fixed','top':'10.5%'});
          $('#topo').css('background','rgba(101,44,144,1)');
          $('#label_topo').css('display','block');
          $('#label_topo').css('opacity','1');
          $('#conteudo').css('margin-top','15%');
          total = $('#header_profile').height() - $('#topo').height() - pp;
        } else {
          $('#barra').css({'position':'relative','top':'0%'});
          $('#topo').css('background','rgba(101,44,144,0)');
          $('#label_topo').css('opacity','0');
          $('#label_topo').css('display','none');
          $('#conteudo').css('margin-top','0%');
          total = $('#header_profile').height() - $('#topo').height() - $('#barra').height() - pp;
        }
      });

      $('#del').on('click',function(){
        navigator.notification.confirm(
            'Você realmente deseja excluir esse evento?', // message
             function(buttonIndex){
               if(buttonIndex == 1){
                 $.ajax({
                   type: "POST",
                   url: "http://usevou.com/app/event.php",
                   data: {
                       'q': 'del',
                       'ideve': localStorage.getItem('viewEvent')
                   },
                   async: true,
                   dataType: "json",
                   success: function (json) {
                     if (json[0]['res'] == 1){
                       window.history.back();
                     }
                   },error: function(xhr,e,t){
                     alert(xhr.responseText);
                   }
                 });
               }
             },
            'Excluir evento',           // title
            ['Excluir','Cancelar']     // buttonLabels
        );
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

      $('#floating').on('click',function(){
        window.location.href = 'main_tabs/new_post.html';
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

$('#ft_perfil').height($('#ft_perfil').width());
$('#floating').width($('#floating').height());
var xDown = null;
var yDown = null;
var page = 0;
var lat = 0;
var lng = 0;

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
    $('#conteudo').load('evento/feed.html');
    $('#tab_barra').css('margin-left','0%');
  } else if ( i == 1 ){
    $('#conteudo').load('evento/about.html');
    $('#tab_barra').css('margin-left','50%');
  }
}

var id = localStorage.getItem('viewEvent');
$.ajax({
  type: "POST",
  url: "http://usevou.com/app/event.php",
  data: {
      'q': 'sel',
      'idusu': window.localStorage.getItem('IdUsu'),
      'ideve': id
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      lat = json[0]["lat"];
      lng = json[0]["lng"];
      localStorage.setItem('NewEventImg',json[0]['img']);
      localStorage.setItem('NewEventNome',json[0]['nome']);
      localStorage.setItem('NewEventLat',json[0]['lat']);
      localStorage.setItem('NewEventLng',json[0]['lng']);
      if ( json[0]['desc'] != null ){
        localStorage.setItem('NewEventDesc',json[0]['desc']);
      }


      $('#header_profile').css('background-image','url('+json[0]["img"]+')');
      if ( json[0]["pre"] > 0 ){
        $('#amigos_list').html(json[0]["pre"]+' pessoas que você segue comparecerão.');
      }
      if ( json[0]['de'] != null ){
        localStorage.setItem('NewEventDe',json[0]['de']);
        localStorage.setItem('NewEventAte',json[0]['ate']);
        var de = json[0]['de'];
        var ate = json[0]['ate'];
        if ( de >= 1000 && de < 1000000 ){
          de = parseInt(de / 1000);
          de = de+'K';
        } else if ( de >= 1000000 ){
          de = parseInt(de / 1000000);
          de = de+'Mi';
        }
        if ( ate >= 1000 && ate < 1000000 ){
          ate = parseInt(ate / 1000);
          ate = ate+'K';
        } else if ( ate >= 1000000 ){
          ate = parseInt(ate / 1000000);
          ate = ate+'Mi';
        }
        $('#faixa').html('R$'+de+' - R$'+ate);
      } else {
        $('#fx').remove();
      }
      if ( json[0]["dt_fim"] == null ){
        var ddt = json[0]["dt_ini"].substr(0,2);
        var mdt = json[0]["dt_ini"].substr(3,2);
        var adt = json[0]["dt_ini"].substr(6,4);
        $('#date').html(json[0]["dt_ini"]);
        $('#hr').html(json[0]["hr_ini"]);
        localStorage.setItem('NewEventDtIni',adt+'-'+mdt+'-'+ddt);
        localStorage.setItem('NewEventHrIni',json[0]["hr_ini"]);
      } else {
        $('#date').html(json[0]["dt_ini"]+' - '+json[0]["hr_ini"]);
        $('#hr').html(json[0]["dt_fim"]+' - '+json[0]["hr_fim"]);
        $('#img_fim').attr('src','img/sets/ic_date.png');
        $('#info_list').css('width','50%');
        $('#amigos_list').css('width','45%');
        $('.icon_list img').css('width','12%');
        var ddti = json[0]["dt_ini"].substr(0,2);
        var mdti = json[0]["dt_ini"].substr(3,2);
        var adti = json[0]["dt_ini"].substr(6,4);
        var ddtf = json[0]["dt_fim"].substr(0,2);
        var mdtf = json[0]["dt_fim"].substr(3,2);
        var adtf = json[0]["dt_fim"].substr(6,4);
        localStorage.setItem('NewEventDtIni',adti+'-'+mdti+'-'+ddti);
        localStorage.setItem('NewEventHrIni',json[0]["hr_ini"]);
        localStorage.setItem('NewEventDtFim',adtf+'-'+mdtf+'-'+ddtf);
        localStorage.setItem('NewEventHrFim',json[0]["hr_fim"]);
      }
      $('#label_topo').html(json[0]["nome"]);
      $('#name_event').html(json[0]["nome"]);
      var latlng = json[0]["lat"] + "," + json[0]["lng"];
      var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=true";
      $.getJSON(url, function (data) {
        var numero = data.results[0].address_components[0].short_name;
        var rua = data.results[0].address_components[1].short_name;
        var bairro = data.results[0].address_components[2].short_name;
        var cidade = data.results[0].address_components[3].short_name;
        $('#name_create').html(rua+', '+numero+' - '+bairro);
        $('#name_locale').html(cidade);
      });
      if ( json[0]["post"] == 0 ){
        localStorage.setItem('NewEventPerm',false);
        if ( !json[0]["adm"] && !json[0]["org"] ){
          $('#floating').hide();
        }
      } else {
        localStorage.setItem('NewEventPerm',true);
      }
      var data = new Date();

      var dia = data.getDate();
      var mes = data.getMonth()+1;
      var ano = data.getFullYear();
      var hr  = data.getHours();
      var min = data.getMinutes();
      var seg = data.getSeconds();
      var time = data.getTime();

      var ddti = parseInt(json[0]["dt_ini"].substr(0,2));
      var mdti = parseInt(json[0]["dt_ini"].substr(3,2));
      var adti = parseInt(json[0]["dt_ini"].substr(6,4));
      var hhri = parseInt(json[0]["hr_ini"].substr(0,2));
      var mhri = parseInt(json[0]["hr_ini"].substr(3,2));

      if ( json[0]["dt_fim"] != null ){
        var ddtf = parseInt(json[0]["dt_fim"].substr(0,2));
        var mdtf = parseInt(json[0]["dt_fim"].substr(3,2));
        var adtf = parseInt(json[0]["dt_fim"].substr(6,4));
        var hhrf = parseInt(json[0]["hr_fim"].substr(0,2));
        var mhrf = parseInt(json[0]["hr_fim"].substr(3,2));
      }


      var html_check = '';
      var enable_check = false;



      if ( ano == adti && mes == mdti ){
        if ( dia == ddti ){
          if ( hr == hhri && min >= mhri ){
            enable_check = true;
          } else if ( hr > hhri ){
            enable_check = true;
          }
        } else if ( json[0]["dt_fim"] != null ){
          if ( dia > ddti && dia == ddtf ){
            if ( hora == hhrf && min <= mhrf ){
              enable_check = true;
            } else if ( hora < hhrf ){
              enable_check = true;
            }
          }
        } else if ( dia == (ddti+1) ){
          if ( (hhri - 12) > hr ){
            enable_check = true;
          }
        }
      }

      if ( ano == adti && mes == mdti && ( (dia == ddti && ((hr == hhri && min >= mhri) || hr > hhri)) || dia > ddti ) ){
        html_check = '<div class="cl_conv" '+(json[0]['privado'] != 1?'style="width:50%;"':'')+'>'+
          '<div class="t_conv">Check-in</div>'+
          '<div class="n_conv" id="ch">'+json[0]['check']+'</div>'+
          '<div class="i_conv" '+(json[0]['privado'] != 1?'style="width:22%;margin-left:39%;"':'')+'><img src="img/sets/ic_checkin'+(json[0]['conf_usu']==3?'_on':'')+'.png" id="check" onclick="checkin('+enable_check+','+json[0]['conf_usu']+');"></div>'+
        '</div>';
      }

      if ( ano == adti && mes == mdti && ( (dia == ddti && ((hr == hhri && min >= mhri) || hr > hhri)) || dia > ddti ) ){
        html_check = '<div class="cl_conv" '+(json[0]['privado'] != 1?'style="width:50%;"':'')+'>'+
          '<div class="t_conv">Check-in</div>'+
          '<div class="n_conv" id="ch" onclick="localStorage.setItem(\'viewConf\',\'Check-in\');window.location.href=\'evento/conf.html\'">'+json[0]['check']+'</div>'+
          '<div class="i_conv" '+(json[0]['privado'] != 1?'style="width:22%;margin-left:39%;"':'')+'><img src="img/sets/ic_checkin'+(json[0]['conf_usu']==3?'_on':'')+'.png" id="check" onclick="checkin('+enable_check+','+json[0]['conf_usu']+');"></div>'+
        '</div>';
      }

      if ( json[0]['privado'] == 1 ){
        localStorage.setItem('NewEventPri',2);
        if ( json[0]['conf_usu'] == null ){json[0]['conf_usu'] = 0;}
        $('#conv').html(html_check+'<div class="cl_conv" '+(html_check==''?'style="width:50%;"':'')+'>'+
          '<div class="t_conv">Confirmados</div>'+
          '<div class="n_conv" id="c" onclick="localStorage.setItem(\'viewConf\',\'Confirmados\');window.location.href=\'evento/conf.html\'">'+json[0]['conf']+'</div>'+
          '<div class="i_conv" '+(html_check==''?'style="width:22%;margin-left:39%;"':'')+'><img src="img/sets/ic_confirm'+(json[0]['conf_usu']==1?'_sel':'')+'.png" id="confirm" onclick="conf(true,'+json[0]['conf_usu']+')"></div>'+
        '</div>'+
        '<div class="cl_conv" '+(html_check==''?'style="width:50%;"':'')+'>'+
          '<div class="t_conv">Convidados</div>'+
          '<div class="n_conv" onclick="localStorage.setItem(\'viewConf\',\'Convidados\');window.location.href=\'evento/conf.html\'">'+json[0]['conv']+'</div>'+
          '<div class="i_conv" '+(html_check==''?'style="width:22%;margin-left:39%;"':'')+'><img src="img/sets/ic_cancel'+(json[0]['conf_usu']==2?'_sel':'')+'.png" id="cancel" onclick="conf(false,'+json[0]['conf_usu']+')"></div>'+
        '</div>');
      } else {
        localStorage.setItem('NewEventPri',1);
        $('#conv').html(html_check+'<div class="cl_conv" '+(html_check==''?'style="width:100%;"':'style="width:50%;"')+'>'+
          '<div class="t_conv">Confirmados</div>'+
          '<div class="n_conv" id="c" onclick="localStorage.setItem(\'viewConf\',\'Confirmados\');window.location.href=\'evento/conf.html\'">'+json[0]['conf']+'</div>'+
          '<div class="i_conv" '+(html_check==''?'style="width:12%;margin-left:44%;"':'style="width:22%;margin-left:39%;"')+'><img src="img/sets/ic_confirm'+(json[0]['conf_usu']==1?'_sel':'')+'.png" id="confirm" onclick="conf(true,'+json[0]['conf_usu']+')"></div>'+
        '</div>');
      }
      if ( json[0]["adm"] ){
        $('#edit').show();
        $('#del').show();
      }

      if ( json[0]["coins"] == 1 ){
        $('#coin').show();
      }

      if ( json[0]['o'] != 0 ){
        localStorage.setItem('NewEventOrg',json[0]['o']);
      }

      if ( json[0]['t'] != 0 ){
        localStorage.setItem('NewEventTags',json[0]['t']);
      }
    } else {
      navigator.notification.alert(
        'Evento não encontrado.',  // message
        function(){
          window.history.back();
        },         // callback
        'Erro!',            // title
        'OK'                  // buttonName
      );
    }
  },error: function(xhr,e,t){
    alert(xhr.responseText);
  }
});

function conf(i,t){
  if ( t == 3 ){
    navigator.notification.confirm(
        'Você já fez seu check-in neste evento.', // message
         null,
        'Check-in já realizado!',           // title
        'OK'     // buttonLabels
    );
  } else {
    if ( i ){
      if ( t == 1 ){
        cadConf(0);
        $('#confirm').attr('src','img/sets/ic_confirm.png');
        $('#confirm').attr('onclick','conf(true,0)');
        $('#cancel').attr('src','img/sets/ic_cancel.png');
        $('#cancel').attr('onclick','conf(false,0)');
        var q = parseInt($('#c').html());
        $('#c').html(q-1);
      } else {
        cadConf(1);
        $('#confirm').attr('src','img/sets/ic_confirm_sel.png');
        $('#confirm').attr('onclick','conf(true,1)');
        $('#cancel').attr('src','img/sets/ic_cancel.png');
        $('#cancel').attr('onclick','conf(false,1)');
        var q = parseInt($('#c').html());
        $('#c').html(q+1);
      }
    } else {
      if ( t == 0 || t == 1 ){
        cadConf(2);
        $('#confirm').attr('src','img/sets/ic_confirm.png');
        $('#confirm').attr('onclick','conf(true,2)');
        $('#cancel').attr('src','img/sets/ic_cancel_sel.png');
        $('#cancel').attr('onclick','conf(false,2)');
        if ( t == 1 ){
          var q = parseInt($('#c').html());
          $('#c').html(q-1);
        }
      } else {
        cadConf(0);
        $('#confirm').attr('src','img/sets/ic_confirm.png');
        $('#confirm').attr('onclick','conf(true,0)');
        $('#cancel').attr('src','img/sets/ic_cancel.png');
        $('#cancel').attr('onclick','conf(false,0)');
      }
    }
  }
}

function cadConf(t){
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/event.php",
    data: {
        'q': 'conf',
        'idusu': window.localStorage.getItem('IdUsu'),
        'ideve': id,
        'tipo': t
    },
    async: true,
    dataType: "json",
    success: function (json) {

    },error: function(xhr,e,t){
      alert(xhr.responseText);
    }
  });
}

function checkin(e,t){
  if ( e ){
    if ( t == 3 ){
      navigator.notification.confirm(
          'Você já fez seu check-in neste evento.', // message
           null,
          'Check-in já realizado!',           // title
          'OK'     // buttonLabels
      );
    } else {
      cordova.plugin.pDialog.init({
        theme : 'HOLO_LIGHT',
        progressStyle : 'SPINNER',
        cancelable : true,
        title : 'Aguarde...',
        message : 'Fazendo check-in.'
      });

      var latitude;
      var longitude;
      var watchID = null;
      var geo = true;

      function onSuccess(position) {
        if ( geo ){
          geo = false;
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;

          if ( (latitude*-1) <= ((lat*-1)+0.0003) && (latitude*-1) >= ((lat*-1)-0.0003) && (longitude*-1) <= ((lng*-1)+0.0003) && (longitude*-1) >= ((lng*-1)-0.0003) ){
            $.ajax({
              type: "POST",
              url: "http://usevou.com/app/event.php",
              data: {
                'q': 'conf',
                'idusu': window.localStorage.getItem('IdUsu'),
                'ideve': id,
                'tipo': 3
              },
              async: true,
              dataType: "json",
              success: function (json) {
                cordova.plugin.pDialog.dismiss();
                if ( json[0]['res'] == 1 ){
                  navigator.notification.confirm(
                      'O check-in no evento foi realizado com sucesso.', // message
                       function(){
                         $('#check').attr('src','img/sets/ic_checkin_on.png');
                         $('#check').attr('onclick','checkin('+e+',3)');
                         $('#confirm').attr('src','img/sets/ic_confirm.png');
                         $('#confirm').attr('onclick','conf(true,3)');
                         $('#cancel').attr('src','img/sets/ic_cancel.png');
                         $('#cancel').attr('onclick','conf(false,3)');
                         var q = parseInt($('#ch').html());
                         $('#ch').html(q+1);
                       },
                      'Sucesso!',           // title
                      'OK'     // buttonLabels
                  );
                }
              },error: function(xhr,e,t){
                cordova.plugin.pDialog.dismiss();
                alert(xhr.responseText);
              }
            });
          } else {
            cordova.plugin.pDialog.dismiss();
            navigator.notification.confirm(
                'Você não está próximo o suficiente do evento.', // message
                 null,
                'Você está muito longe!',           // title
                'OK'     // buttonLabels
            );
          }
        }
      }

      function onError(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
      }

      watchID = navigator.geolocation.watchPosition(onSuccess, onError);
    }
  } else {
    navigator.notification.confirm(
        'Você não está no período de check-in deste evento.', // message
         null,
        'Check-in expirado ou não iniciado!',           // title
        'OK'     // buttonLabels
    );
  }
}

app.initialize();

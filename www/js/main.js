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

      $(document).on("backbutton", function(e){
         e.preventDefault();
         navigator.app.exitApp();
      });

      $("#post").scroll(function() {
        console.log('Oi');

      });

      $('.btn_filtro').on('click',function(){
        $('#filtro_lat').css('right','-90%');
        $('#fundo').css('opacity','0');
        setTimeout(function(){$('#fundo').css('display','none');},500);
        $(document).off("backbutton");
        $(document).on("backbutton", function(e){
           e.preventDefault();
           navigator.app.exitApp();
        });
      });

      $('#reset').on('click',function(){
        $('.tag').css({'font-size':'1.3em','margin-top':'0px'});
        localStorage.removeItem('filterTag');
        localStorage.removeItem('filterDtIni');
        localStorage.removeItem('filterDtFim');
        loadPageEvent(pageEvent);
      });

      $('#apl').on('click',function(){
        if ( $('#dtini').val() != '' && $('#dtfim').val() != '' ){
          if ( $('#dtini').val() < $('#dtfim').val() ){
            localStorage.setItem('filterDtIni',$('#dtini').val());
            localStorage.setItem('filterDtFim',$('#dtfim').val());
          } else {
            navigator.notification.alert(
              'A data de início está maior que a data de fim.',  // message
              null,         // callback
              'Erro!',            // title
              'OK'                  // buttonName
            );
          }
        } else {
          navigator.notification.alert(
            'Defina a data de início e fim para aplicar o filtro.',  // message
            null,         // callback
            'Erro!',            // title
            'OK'                  // buttonName
          );
        }
        loadPageEvent(pageEvent);
      });

      $('#open_menu_lat').on('click',function(){
        $('#menu_lat').css('margin-left','0%');
        $('#fundo').css('display','block');
        setTimeout(function(){$('#fundo').css('opacity','0.6');},100);
        $(document).off("backbutton");
        $(document).on("backbutton", function(e){
           e.preventDefault();
           $('#menu_lat').css('margin-left','-90%');
           $('#fundo').css('opacity','0');
           setTimeout(function(){$('#fundo').css('display','none');},500);
           $(document).off("backbutton");
           $(document).on("backbutton", function(e){
              e.preventDefault();
              navigator.app.exitApp();
           });
        });
      });

      document.getElementById('action_menu_lat').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('action_menu_lat').addEventListener('touchmove', function(evt){
        var h = handleTouchMove(evt);
        if (h == "right"){
          $('#menu_lat').css('margin-left','0%');
          $('#fundo').css('display','block');
          setTimeout(function(){$('#fundo').css('opacity','0.6');},100);
          $(document).off("backbutton");
          $(document).on("backbutton", function(e){
             e.preventDefault();
             $('#menu_lat').css('margin-left','-90%');
             $('#fundo').css('opacity','0');
             setTimeout(function(){$('#fundo').css('display','none');},500);
             $(document).off("backbutton")
             $(document).on("backbutton", function(e){
                e.preventDefault();
                navigator.app.exitApp();
             });
          });
        }
      }, false);

      document.getElementById('menu_lat').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('menu_lat').addEventListener('touchmove', function(evt){
        var h = handleTouchMove(evt);
        if (h == "left"){
          $('#menu_lat').css('margin-left','-90%');
          $('#fundo').css('opacity','0');
          setTimeout(function(){$('#fundo').css('display','none');},500);
          $(document).off("backbutton");
          $(document).on("backbutton", function(e){
             e.preventDefault();
             navigator.app.exitApp();
          });
        }
      }, false);

      document.getElementById('filtro_lat').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('filtro_lat').addEventListener('touchmove', function(evt){
        var h = handleTouchMove(evt);
        if (h == "right"){
          $('#filtro_lat').css('right','-90%');
          $('#fundo').css('opacity','0');
          setTimeout(function(){$('#fundo').css('display','none');},500);
          $(document).off("backbutton");
          $(document).on("backbutton", function(e){
             e.preventDefault();
             navigator.app.exitApp();
          });
        }
      }, false);

      $('#fundo').on('click',function(){
        $('#menu_lat').css('margin-left','-90%');
        $('#filtro_lat').css('right','-90%');
        $('#fundo').css('opacity','0');
        setTimeout(function(){$('#fundo').css('display','none');},500);
        $(document).off("backbutton");
        $(document).on("backbutton", function(e){
           e.preventDefault();
           navigator.app.exitApp();
        });
      });

      document.getElementById('fundo').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('fundo').addEventListener('touchmove', function(evt){
        var h = handleTouchMove(evt);
        if (h == "left"){
          $('#menu_lat').css('margin-left','-90%');
          $('#fundo').css('opacity','0');
          setTimeout(function(){$('#fundo').css('display','none');},500);
          $(document).off("backbutton");
          $(document).on("backbutton", function(e){
             e.preventDefault();
             navigator.app.exitApp();
          });
        } else if (h == "right"){
          $('#filtro_lat').css('right','-90%');
          $('#fundo').css('opacity','0');
          setTimeout(function(){$('#fundo').css('display','none');},500);
          $(document).off("backbutton");
          $(document).on("backbutton", function(e){
             e.preventDefault();
             navigator.app.exitApp();
          });
        }
      }, false);

      document.getElementById('conteudo').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('conteudo').addEventListener('touchmove', function(evt){
        var p = window.localStorage.getItem('pageHome');
        var h = handleTouchMove(evt);
        if ( p != 1 || pageEvent != 1 ){
          if (h == "left"){
            if ( p < 3 ){
              window.localStorage.setItem('pageHome',(parseInt(p)+1));
              loadPage(parseInt(p)+1);
            }
          } else if (h == "right"){
            if ( p > 0 ){
              window.localStorage.setItem('pageHome',(parseInt(p)-1));
              loadPage(parseInt(p)-1);
            } else {
              $('#menu_lat').css('margin-left','0%');
              $('#fundo').css('display','block');
              setTimeout(function(){$('#fundo').css('opacity','0.6');},100);
              $(document).off("backbutton");
              $(document).on("backbutton", function(e){
                 e.preventDefault();
                 $('#menu_lat').css('margin-left','-90%');
                 $('#fundo').css('opacity','0');
                 setTimeout(function(){$('#fundo').css('display','none');},500);
                 $(document).off("backbutton")
                 $(document).on("backbutton", function(e){
                    e.preventDefault();
                    navigator.app.exitApp();
                 });
              });
            }
          }
        }
        return;
      }, false);

      window.addEventListener('native.keyboardshow', keyboardShowHandler);

      function keyboardShowHandler(e){
        var key = e.keyboardHeight;
        $('#conteudo').css('height','calc(80.5% - '+key+'px)');
        $('#busca').css('height','calc(89.5% - '+key+'px)');
        $('#barra_bottom').css('bottom',key+'px');
      }

      window.addEventListener('native.keyboardhide', keyboardHideHandler);

      function keyboardHideHandler(e){
        $('#conteudo').css('height','80.5%');
        $('#busca').css('height','89.5%');
        $('#barra_bottom').css('bottom','0px');
      }

      loadPage(window.localStorage.getItem('pageHome'));

      $('#home').on('click',function(){loadPage(0);window.localStorage.setItem('pageHome',0);});
      $('#even').on('click',function(){loadPage(1);window.localStorage.setItem('pageHome',1);});
      $('#coin').on('click',function(){loadPage(2);window.localStorage.setItem('pageHome',2);});
      $('#noti').on('click',function(){loadPage(3);window.localStorage.setItem('pageHome',3);});

      $('#exit').on('click',function(){localStorage.removeItem('session');window.location.href='index.html'});

      $('#edt_pesq').on('input',function(){
        changeInputPesq($(this).val());
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

$('#foto_perfil').width($('#foto_perfil').height());
$('#floating').width($('#floating').height());
$('#open_menu_lat').width($('#open_menu_lat').height());
$('#logo_topo').css('margin-left','calc(30% - '+($('#logo_topo').width()/2)+"px)");

$('#floating').on('touchstart',function(){
  $('#floating').css('background-color','rgba(101,44,144,0.8)');
});
$('#floating').on('touchend',function(){
  $('#floating').css('background-color','#652C90');
});

var page = window.localStorage.getItem('pageHome');
if ( page == null || page < 0 ){
  page = 0;
  window.localStorage.setItem('pageHome',0);
} else if ( page > 3 ){
  page = 3;
  window.localStorage.setItem('pageHome',3);
}
var pageEvent = 1;
var pageCoins = 0;

function loadPage(i){
  $('#conteudo').html("<img src='img/sets/loading.gif' id='loading'>");
  if ( i == 0 ){
    $('#conteudo').load('main_tabs/news_feed.html');
    $('#tab_barra').css('margin-left','0%');
    $('#barra_bottom').css('margin-bottom','-18%');
    $('#conteudo').css('height','89.5%');
    $('#floating').off('click');
    $('#floating').on('click',function(){window.location.href='main_tabs/new_post.html'});
    $('#floating').css('bottom','3.5%');
    $('#floating').css('display','block');
    setTimeout(function(){$('#floating img').attr('src','img/sets/ic_publication.png');},200);
    $('#floating img').css('transform','rotate(360deg)');
  } else if ( i == 1 ){
    $('#tab_barra').css('margin-left','25%');
    $('#barra_bottom').css('margin-bottom','0px');
    $('#barra_bottom').html('<ul>'+
      '<a href="event_tabs/new_event.html"><li id="new_event">CRIAR EVENTO</li></a>'+
      '<li id="map_event" class="sel">MAPA</li>'+
      '<li id="list_event">LISTA</li>'+
      '<li id="my_event">MEUS EVENTOS</li>'+
      '</ul>');
    $('#conteudo').css('height','80.5%');
    $('#map_event').on('click',function(){loadPageEvent(1);});
    $('#list_event').on('click',function(){loadPageEvent(2);});
    $('#my_event').on('click',function(){loadPageEvent(3);});
    $('#floating').off('click');
    $('#floating').on('click',function(){
      $('#filtro_lat').css('right','0%');
      $('#fundo').css('display','block');
      setTimeout(function(){$('#fundo').css('opacity','0.6');},100);
      $(document).off("backbutton");
      $(document).on("backbutton", function(e){
         e.preventDefault();
         $('#filtro_lat').css('right','-90%');
         $('#fundo').css('opacity','0');
         setTimeout(function(){$('#fundo').css('display','none');},500);
         $(document).off("backbutton")
         $(document).on("backbutton", function(e){
            e.preventDefault();
            navigator.app.exitApp();
         });
      });
    });
    $('#floating').css('bottom','12.5%');
    $('#floating').css('display','block');
    setTimeout(function(){$('#floating img').attr('src','img/sets/ic_filter.png');},200);
    $('#floating img').css('transform','rotate(0deg)');
    loadPageEvent(pageEvent);
  } else if ( i == 2 ){
    $('#tab_barra').css('margin-left','50%');
    $('#barra_bottom').css('margin-bottom','0px');
    $('#barra_bottom').html('<ul>'+
      '<li id="conta_coins" class="sel">CONTA</li>'+
      '<li id="pay_coins"><img src="img/sets/ic_saida.png">PAGAR</li>'+
      '<li id="receive_coins"><img src="img/sets/ic_entrada.png">RECEBER</li>'+
      '</ul>');
    $('#conteudo').css('height','80.5%');
    $('#conta_coins').on('click',function(){loadPageCoins(0);});
    $('#pay_coins').on('click',function(){loadPageCoins(1);});
    $('#receive_coins').on('click',function(){loadPageCoins(2);});
    $('#floating').css('display','none');
    loadPageCoins(pageCoins);
  } else if ( i == 3 ){
    $('#conteudo').load('main_tabs/notification.html');
    $('#tab_barra').css('margin-left','75%');
    $('#barra_bottom').css('margin-bottom','-18%');
    $('#conteudo').css('height','89.5%');
    $('#floating').css('display','none');
  }
  $("#conteudo").animate({scrollTop: 0 }, 0);
}

function loadPageEvent(i){
  $('#conteudo').html("<img src='img/sets/loading.gif' id='loading'>");
  if ( i == 1 ){
    pageEvent = 1;
    $('#conteudo').load('event_tabs/map_event.html');
    $('#map_event').attr('class','sel');
    $('#list_event').attr('class','');
    $('#my_event').attr('class','');
  } else if ( i == 2 ){
    pageEvent = 2;
    $('#conteudo').load('event_tabs/list_event.html');
    $('#map_event').attr('class','');
    $('#list_event').attr('class','sel');
    $('#my_event').attr('class','');
  } else if ( i == 3 ){
    pageEvent = 3;
    $('#conteudo').load('event_tabs/my_event.html');
    $('#map_event').attr('class','');
    $('#list_event').attr('class','');
    $('#my_event').attr('class','sel');
  }
}

function loadPageCoins(i){
  $('#conteudo').html("<img src='img/sets/loading.gif' id='loading'>");
  if ( i == 0 ){
    pageCoins = 0;
    $('#conteudo').load('coins_tabs/conta_coins.html');
    $('#conta_coins').attr('class','sel');
    $('#pay_coins').attr('class','');
    $('#receive_coins').attr('class','');
  } else if ( i == 1 ){
    pageCoins = 1;
    $('#conteudo').load('coins_tabs/pay_coins.html');
    $('#conta_coins').attr('class','');
    $('#pay_coins').attr('class','sel');
    $('#receive_coins').attr('class','');
  } else if ( i == 2 ){
    pageCoins = 2;
    $('#conteudo').load('coins_tabs/receive_coins.html');
    $('#conta_coins').attr('class','');
    $('#pay_coins').attr('class','');
    $('#receive_coins').attr('class','sel');
  }
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
    } else {
      if ( yDiff > 0 ) {
        xDown = null;
        yDown = null;
        $('#topo').css('margin-top','-18%');
      } else {
        xDown = null;
        yDown = null;
        $('#topo').css('margin-top','0%');
      }
    }
    return;
};

function pesq(i){
  if ( i == 0 ){
    getHistory();
    $('#pesq').css('margin-right','85%');
    $('#pesq').css('transform','rotate(360deg)');
    $('#open_menu_lat').css('display','none');
    $('#logo_topo').css('display','none');
    $('#fundo_busca').css('display','block');
    $('#busca').css('display','block');
    $('#topo').css('z-index','6');
    $('.ft_perfil_card_pesq').height($('.ft_perfil_card_pesq').width());
  } else {
    $('#topo input').css('display','none');
    $('#topo input').val('');
    $('#fundo_busca').css('opacity','0');
    $('#busca').css('opacity','0');
    $('#pesq').css('margin-right','5%');
    $('#pesq').css('transform','rotate(0deg)');
    $('#topo').css('box-shadow','0px 0px 0px #666666');
  }
  setTimeout(function(){
    if ( i == 0 ){
      $('#topo input').css('display','block');
      $('#topo input').focus();
      $('#fundo_busca').css('opacity','0.6');
      $('#busca').css('opacity','1');
      $('#topo').css('box-shadow','0px 1px 8px #666666');
      $('#pesq').off('click');
      $('#pesq').on('click',function(){pesq(1)});
    } else {
      $('#open_menu_lat').css('display','block');
      $('#logo_topo').css('display','block');
      $('#fundo_busca').css('display','none');
      $('#busca').css('display','none');
      $('#topo').css('z-index','2');
      $('#pesq').off('click');
      $('#pesq').on('click',function(){pesq(0)});
    }
  },500);
  setTimeout(function(){
    if ( i == 0 ){
      $('#pesq img').attr('src','img/sets/ic_pesq_exit.png');
    } else {
      $('#pesq img').attr('src','img/sets/ic_pesq.png');
    }
  },250);
}

$('#pesq').on('click',function(){pesq(0)});

var login = window.localStorage.getItem('login');
$.ajax({
  type: "POST",
  url: "http://usevou.com/app/usuario.php",
  data: {
      'q': 'sel',
      'login': login
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      window.localStorage.setItem('IdUsu',json[0]['idusuario']);
      window.localStorage.setItem('NomeUsu',json[0]['nome']);
      window.localStorage.setItem('CapaUsu',json[0]['ft_capa']);
      window.localStorage.setItem('PerfilUsu',json[0]['ft_perfil']);
      window.localStorage.setItem('EmailUsu',json[0]['email']);
      window.localStorage.setItem('FoneUsu',json[0]['fone']);
      $('#header_menu_lat').css('background-image','url("'+json[0]['ft_capa']+'")');
      $('#foto_perfil').css('background-image','url("'+json[0]['ft_perfil']+'")');
      $('#open_menu_lat').css('background-image','url("'+json[0]['ft_perfil']+'")');
      $('#nome').html(json[0]['nome']);
    }
  },error: function(xhr,e,t){
    alert(xhr.responseText);
  }
});

$('#header_menu_lat').css('background-image','url("'+window.localStorage.getItem('CapaUsu')+'")');
$('#foto_perfil').css('background-image','url("'+window.localStorage.getItem('PerfilUsu')+'")');
$('#open_menu_lat').css('background-image','url("'+window.localStorage.getItem('PerfilUsu')+'")');
$('#nome').html(window.localStorage.getItem('NomeUsu'));

function changeInputPesq(v){
  $('#busca').html('<div class="card">'+
                      '<div class="title_card">Pessoas</div>'+
                      '<div id="usu"><img src="img/sets/loading.gif" id="feed_load"></div>'+
                    '</div>'+
                    '<div class="card">'+
                      '<div class="title_card">Eventos</div>'+
                      '<div id="eve"><img src="img/sets/loading.gif" id="feed_load"></div>'+
                    '</div>');
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/search.php",
    data: {
        'q': 'usu',
        'pesq': v,
        'limit': 0,
        'max': 2
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
        html = '';
        for(var i=0;i<json.length;i++){
          var array = json[i]["id"]+","+json[i]["nome"]+","+json[i]["foto"]+",0";
          html += '<div class="cabecalho_card" style="margin:0px;">'+
            '<div class="ft_perfil_card_pesq" style="background-image:url('+json[i]["foto"]+')" onclick="setHistory('+json[i]["id"]+',\''+json[i]["nome"]+'\',\''+json[i]["foto"]+'\',0);localStorage.setItem(\'viewProfile\','+json[i]['id']+');$(\'edt_pesq\').val(\'\');window.location.href = \'menu_lat/profile.html\'"></div>'+
            '<div class="info_card">'+
              '<div class="nome_card" onclick="setHistory('+json[i]["id"]+',\''+json[i]["nome"]+'\',\''+json[i]["foto"]+'\',0);localStorage.setItem(\'viewProfile\','+json[i]['id']+');$(\'edt_pesq\').val(\'\');window.location.href = \'menu_lat/profile.html\'">'+json[i]["nome"]+'</div>'+
            '</div>'+
          '</div>';
          if ( (i+1) < json.length ){
            html += '<div class="line"></div>';
          }
        }
        if ( i == 2 ){
          html += '<div class="ver_mais" id="vusu" onclick="localStorage.setItem(\'pageSearch\',0);localStorage.setItem(\'wordSearch\',\''+v+'\');$(\'edt_pesq\').val(\'\');window.location.href=\'search.html\'">Ver mais</div>';
        }
        $('#usu').html(html);
        $('.ft_perfil_card_pesq').height($('.ft_perfil_card_pesq').width());
      } else {
        $('#usu').html("Nada encontrado entre usuários.");
      }
    },error: function(xhr,e,t){
      alert(xhr.responseText);
    }
  });
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/search.php",
    data: {
        'q': 'eve',
        'pesq': v,
        'limit': 0,
        'max': 2
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
        html = '';
        for(var i=0;i<json.length;i++){
          html += '<div class="cabecalho_card" style="margin:0px;">'+
            '<div class="ft_perfil_card_pesq" style="background-image:url('+json[i]["foto"]+')" onclick="setHistory('+json[i]["id"]+',\''+json[i]["nome"]+'\',\''+json[i]["foto"]+'\',1);localStorage.setItem(\'viewEvent\','+json[i]['id']+');$(\'edt_pesq\').val(\'\');window.location.href = \'evento.html\'"></div>'+
            '<div class="info_card">'+
              '<div class="nome_card" onclick="setHistory('+json[i]["id"]+',\''+json[i]["nome"]+'\',\''+json[i]["foto"]+'\',1);localStorage.setItem(\'viewEvent\','+json[i]['id']+');$(\'edt_pesq\').val(\'\');window.location.href = \'evento.html\'">'+json[i]["nome"]+'</div>'+
            '</div>'+
          '</div>';
          if ( (i+1) < json.length ){
            html += '<div class="line"></div>';
          }
        }
        if ( i == 2 ){
          html += '<div class="ver_mais" id="veve" onclick="localStorage.setItem(\'pageSearch\',1);localStorage.setItem(\'wordSearch\',\''+v+'\');$(\'edt_pesq\').val(\'\');window.location.href=\'search.html\'">Ver mais</div>';
        }
        $('#eve').html(html);
        $('.ft_perfil_card_pesq').height($('.ft_perfil_card_pesq').width());
      } else {
        $('#eve').html("Nada encontrado entre eventos.");
      }
    },error: function(xhr,e,t){
      alert(xhr.responseText);
    }
  });
}

function setHistory(id,nome,foto,type){
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/search.php",
    data: {
        'q': 'history',
        'pesq': id+','+nome+','+foto+','+type,
        'idusu': window.localStorage.getItem('IdUsu')
    },
    async: true,
    dataType: "json",
    success: function (json) {

    },error: function(xhr,e,t){
      console.log('error');
      console.log(xhr.responseText);
    }
  });
}

function getHistory(){
  $('#busca').html('<div class="card">'+
                      '<div class="title_card">Histórico</div>'+
                      '<div id="hist"><img src="img/sets/loading.gif" id="feed_load"></div>'+
                    '</div>');
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/search.php",
    data: {
        'q': 'gethistory',
        'idusu': window.localStorage.getItem('IdUsu')
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
        html = '';
        for(var i=0;i<json.length;i++){
          var array = json[i]["conteudo"];
          var a = array.split(',');
          html += '<div class="cabecalho_card" style="margin:0px;">'+
            '<div class="ft_perfil_card_pesq" style="background-image:url('+a[2]+')" onclick="setHistory('+a[0]+',\''+a[1]+'\',\''+a[2]+'\','+a[3]+');localStorage.setItem(\''+(a[3]==0?'viewProfile':'viewEvent')+'\','+a[0]+');$(\'edt_pesq\').val(\'\');window.location.href = \''+(a[3]==0?'menu_lat/profile':'evento')+'.html\'"></div>'+
            '<div class="info_card">'+
              '<div class="nome_card" onclick="setHistory('+a[0]+',\''+a[1]+'\',\''+a[2]+'\','+a[3]+');localStorage.setItem(\''+(a[3]==0?'viewProfile':'viewEvent')+'\','+a[0]+');$(\'edt_pesq\').val(\'\');window.location.href = \''+(a[3]==0?'menu_lat/profile':'evento')+'.html\'">'+a[1]+'</div>'+
            '</div>'+
          '</div>';
          if ( (i+1) < json.length ){
            html += '<div class="line"></div>';
          }
        }
        $('#hist').html(html);
        $('.ft_perfil_card_pesq').height($('.ft_perfil_card_pesq').width());
      }
    },error: function(xhr,e,t){
      alert(xhr.responseText);
    }
  });
}

$.ajax({
  type: "POST",
  url: "http://usevou.com/app/event.php",
  data: {
      'q': 'tag_filtro'
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      html = '';
      for(var i=0;i<json.length;i++){
        html += '<div class="tag" id="t'+json[i]['id']+'" onclick="$(\'.tag\').css({\'font-size\':\'1.3em\',\'margin-top\':\'0px\'});localStorage.setItem(\'filterTag\','+json[i]['id']+');loadPageEvent('+pageEvent+');$(this).css({\'font-size\':\'1.5em\',\'margin-top\':\'-0.2em\'});" '+
                (localStorage.getItem('filterTag')==json[i]['id']?'style="font-size:1.5em;margin-top:-0.2em;"':'')+'>#'+json[i]['nome']+'</div>';
      }
      $('#tags').html(html);
      $('.tag').on('click',function(){
        $('#filtro_lat').css('right','-90%');
        $('#fundo').css('opacity','0');
        setTimeout(function(){$('#fundo').css('display','none');},500);
        $(document).off("backbutton");
        $(document).on("backbutton", function(e){
           e.preventDefault();
           navigator.app.exitApp();
        });
      });
    } else {
      $('#tags').html("Nenhuma tag encontrada.");
    }
  },error: function(xhr,e,t){
    alert(xhr.responseText);
  }
});

function insertLayout(idL, idI,val){
  $('#'+idL).on('click',function(){$('#'+idI).focus();});
  $('#'+idI).on('focus',function(){
    $('#'+idL).css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
  });
  $('#'+idI).on('focusout',function(){
    if ( $('#'+idI).val() == val ){
      $('#'+idL).css({'font-size':'1.5em','margin-top':'0%','color':'black'});
      $('#conteudo').css('height','90%');
    }
  });
}

insertLayout('lDtini','dtini','');
insertLayout('lDtfim','dtfim','');

$('#cont_filtro').height($('#filtro_lat').height()-$('#btn').height());

app.initialize();

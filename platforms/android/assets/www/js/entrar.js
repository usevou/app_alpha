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

      $('#next').on('touchstart',function(){
        $('#next').css('background-color','rgba(101,44,144,0.8)');
      });
      $('#next').on('touchend',function(){
        $('#next').css('background-color','#652C90');
      });

      $('#next').on('click',function(){
        var l = $('#login').val();
        var s = $('#senha').val();
        if ( l == "" ){
          $('#erro').html('* Digite seu usuário.');
        } else if ( s == "" ){
          $('#erro').html('* Digite sua senha.');
        } else {
          $('#erro').html('');
          login = l;
          senha = s;
          if(loginUsuario()){
            window.localStorage.setItem('session', true);
            window.localStorage.setItem('login', login);
            window.location.href = "main.html";
          } else {
            $('#erro').html('* Usuário e senha não conferem.');
          }
        }
      });

      window.addEventListener('native.keyboardshow', keyboardShowHandler);

      function keyboardShowHandler(e){
        var key = e.keyboardHeight;
        var h = $('#bottom').height();
        $('#conteudo').css('height','calc(90% - '+(key + h)+'px)');
        $('#bottom').css('bottom',key+'px');
      }

      window.addEventListener('native.keyboardhide', keyboardHideHandler);

      function keyboardHideHandler(e){
        var h = $('#bottom').height();
        $('#conteudo').css('height','calc(90% - '+h+'px)');
        $('#bottom').css('bottom','0px');
      }

      $('#login').on('focusout',getFtPerfil);

      $('#login').on('focus',function(){
        $('#conteudo').animate({
          scrollTop: 565.3125
        }, 1000);
      });

      $('#senha').on('focus',function(){
        $('#conteudo').animate({
          scrollTop: 565.3125
        }, 1000);
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

var i=0;
var login;
var senha;
$('#ft_perfil').height($('#ft_perfil').width());

$('#lLogin').on('click',function(){$('#login').focus();});
$('#lSenha').on('click',function(){$('#senha').focus();});
$('#see').on('click',function(){
  if (i == 0){
    $('#senha').attr('type','text');
    $('#see img').attr('src','img/sets/ic_see_password_sel.png');
    $('#senha').focus();
    i=1;
  } else {
    $('#senha').attr('type','password');
    $('#see img').attr('src','img/sets/ic_see_password.png');
    $('#senha').focus();
    i=0;
  }
});
insertLayout('lLogin','login','');
insertLayout('lSenha','senha','');

function insertLayout(idL, idI,val){
  $('#'+idI).on('focus',function(){
    $('#'+idL).css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
  });
  $('#'+idI).on('focusout',function(){
    if ( $('#'+idI).val() == val ){
      $('#'+idL).css({'font-size':'1.5em','margin-top':'0%','color':'black'});
    }
  });
}

function getFtPerfil(){
  var l = $('#login').val();
  if ( l != "" ){
    login = l;
    $.ajax({
      type: "POST",
      url: "http://usevou.com/app/usuario.php",
      data: {
          'q': 'ft_perfil',
          'login': login
      },
      async: true,
      dataType: "json",
      success: function (json) {
        if (json[0]['res'] == 1){
          $('#ft_perfil').css('background-image','url("'+json[0]['ft_perfil']+'")');
        }
      },error: function(xhr,e,t){
        console.log(xhr.responseText);
        alert(xhr.responseText);
      }
    });
  }
}

function loginUsuario() {
  var have = false;
  cordova.plugin.pDialog.init({
    theme : 'HOLO_LIGHT',
    progressStyle : 'SPINNER',
    cancelable : true,
    title : 'Aguarde...',
    message : 'Entrando no aplicativo.'
  });
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/usuario.php",
    data: {
        'q': 'logar',
        'login': login,
        'senha': senha
    },
    async: false,
    dataType: "json",
    success: function (json) {
      cordova.plugin.pDialog.dismiss();
      if (json[0]['res'] == 1){
        window.localStorage.setItem('IdUsu', json[0]["id"]);
        have = true;
      }
    },error: function(xhr,e,t){
      console.log(xhr.responseText);
    }
  });
  return have;
}

app.initialize();

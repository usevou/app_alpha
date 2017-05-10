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
      $('#conf').on('click',updateLogin);
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

var i=[0,0,0];

$('#lSenha_atual').on('click',function(){$('#senha_atual').focus();});
$('#lNova_senha').on('click',function(){$('#nova_senha').focus();});
$('#lRep_senha').on('click',function(){$('#rep_senha').focus();});
insertLayout('lSenha_atual','senha_atual','',0);
insertLayout('lNova_senha','nova_senha','',1);
insertLayout('lRep_senha','rep_senha','',2);

function insertLayout(idL, idI,val,j){
  $('#'+idI).on('focus',function(){
    $('#'+idL).css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
  });
  $('#'+idI).on('focusout',function(){
    if ( $('#'+idI).val() == val ){
      $('#'+idL).css({'font-size':'1.5em','margin-top':'0%','color':'black'});
    }
  });
  $('#see_'+idI).on('click',function(){
    if (i[j] == 0){
      $('#'+idI).attr('type','text');
      $('#see_'+idI+' img').attr('src','../img/sets/ic_see_password_sel.png');
      $('#'+idI).focus();
      i[j]=1;
    } else {
      $('#'+idI).attr('type','password');
      $('#see_'+idI+' img').attr('src','../img/sets/ic_see_password.png');
      $('#'+idI).focus();
      i[j]=0;
    }
  });
}

function updateLogin(){
  var s1 = $('#senha_atual').val();
  var s2 = $('#nova_senha').val();
  var s3 = $('#rep_senha').val();
  if ( s1 == "" ){
    navigator.notification.confirm(
        'A senha atual está em branco.', // message
         null,
        'Digite a senha atual!',           // title
        'OK'     // buttonLabels
    );
  } else if ( s2 == "" ){
    navigator.notification.confirm(
        'A nova senha está em branco.', // message
         null,
        'Digite a nova senha!',           // title
        'OK'     // buttonLabels
    );
  } else if ( s3 == "" ){
    navigator.notification.confirm(
        'Você precisa repetir a nova senha.', // message
         null,
        'Repita a nova senha!',           // title
        'OK'     // buttonLabels
    );
  } else if ( s2 != s3 ){
    navigator.notification.confirm(
        'A nova senha não confere com a repetição dela.', // message
         null,
        'As senhas não conferem!',           // title
        'OK'     // buttonLabels
    );
  } else if ( validarSenhaBd(s1) ){
    navigator.notification.confirm(
        'A senha atual digitada não confere com sua senha atual.', // message
         null,
        'A senha atual está errada!',           // title
        'OK'     // buttonLabels
    );
  } else if ( s1 == s2 ){
    navigator.notification.confirm(
        'A senha atual é igual a nova senha.', // message
         null,
        'As senhas são iguais!',           // title
        'OK'     // buttonLabels
    );
  } else {
    cordova.plugin.pDialog.init({
      theme : 'HOLO_LIGHT',
      progressStyle : 'SPINNER',
      cancelable : true,
      title : 'Aguarde...',
      message : 'Alterando senha.'
    });
    $.ajax({
      type: "POST",
      url: "http://usevou.com/app/usuario.php",
      data: {
          'q': 'update_senha',
          'id': window.localStorage.getItem('IdUsu'),
          'senha': s2
      },
      async: true,
      dataType: "json",
      success: function (json) {
        cordova.plugin.pDialog.dismiss();
        if (json[0]['res'] == 1){
          window.history.back();
        }
      },error: function(xhr,e,t){
        cordova.plugin.pDialog.dismiss();
        console.log(xhr.responseText);
        alert(xhr.responseText);
      }
    });
  }
}

function validarSenhaBd(senha) {
  var have = true;
  cordova.plugin.pDialog.init({
    theme : 'HOLO_LIGHT',
    progressStyle : 'SPINNER',
    cancelable : true,
    title : 'Aguarde...',
    message : 'Verificando senha atual.'
  });
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/usuario.php",
    data: {
        'q': 'logar',
        'login': window.localStorage.getItem('login'),
        'senha': senha
    },
    async: false,
    dataType: "json",
    success: function (json) {
      cordova.plugin.pDialog.dismiss();
      if (json[0]['res'] == 1){
        have = false;
      }
    },error: function(xhr,e,t){
      console.log(xhr.responseText);
    }
  });
  return have;
}

app.initialize();

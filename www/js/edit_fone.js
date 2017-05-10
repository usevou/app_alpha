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

var i=0;
var fone = window.localStorage.getItem('FoneUsu');
$("#fone").mask("(99) 99999-9999");

$('#lFone').on('click',function(){$('#fone').focus();});
insertLayout('lFone','fone','(__) _____-____');

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

function updateLogin(){
  var l = $('#fone').val();
  if ( l == "" ){
    navigator.notification.confirm(
        'O seu nome de usuário está em branco.', // message
         null,
        'Digite algo!',           // title
        'OK'     // buttonLabels
    );
  } else if ( fone != l ){
    if ( validarFoneBd(l) ){
      navigator.notification.confirm(
          'Esse nome de usuário já existe, tente outro.', // message
           null,
          'Nome de usuário exitente!',           // title
          'OK'     // buttonLabels
      );
    } else {
      fone = l;
      cordova.plugin.pDialog.init({
        theme : 'HOLO_LIGHT',
        progressStyle : 'SPINNER',
        cancelable : true,
        title : 'Aguarde...',
        message : 'Alterando o número do telefone.'
      });
      $.ajax({
        type: "POST",
        url: "http://usevou.com/app/usuario.php",
        data: {
            'q': 'update_fone',
            'id': window.localStorage.getItem('IdUsu'),
            'fone': fone
        },
        async: true,
        dataType: "json",
        success: function (json) {
          cordova.plugin.pDialog.dismiss();
          if (json[0]['res'] == 1){
            window.localStorage.setItem('FoneUsu',fone);
            window.history.back();
          }
        },error: function(xhr,e,t){
          cordova.plugin.pDialog.dismiss();
          console.log(xhr.responseText);
          alert(xhr.responseText);
        }
      });
    }
  } else {
    window.history.back();
  }
}

function validarFoneBd(fone) {
  var have = true;
  cordova.plugin.pDialog.init({
    theme : 'HOLO_LIGHT',
    progressStyle : 'SPINNER',
    cancelable : true,
    title : 'Aguarde...',
    message : 'Verificando número de celular.'
  });
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/usuario.php",
    data: {
        'q': 'fone',
        'fone': fone
    },
    async: false,
    dataType: "json",
    success: function (json) {
      cordova.plugin.pDialog.dismiss();
      if (json[0]['res'] == 0){
        have = false;
      }
    },error: function(xhr,e,t){
      console.log(xhr.responseText);
    }
  });
  return have;
}

$('#login').val(fone).focus();

app.initialize();

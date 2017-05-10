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

      $('#back').on('click',function(){
        window.location.href = '../main.html';
        localStorage.removeItem('NewEventId');
      });

      $('#btn_ok_topo').on('click',function(){
        if ( select > 0 ){
          cordova.plugin.pDialog.init({
            theme : 'HOLO_LIGHT',
            progressStyle : 'SPINNER',
            cancelable : true,
            title : 'Aguarde...',
            message : 'Convidando as pessoas.'
          });
          $.ajax({
            type: "POST",
            url: "http://usevou.com/app/event.php",
            data: {
                'q': 'convite',
                'idusu': window.localStorage.getItem('IdUsu'),
                'ideve': localStorage.getItem('NewEventId'),
                'convites': pessoa
            },
            async: true,
            dataType: "json",
            success: function (json) {
              cordova.plugin.pDialog.dismiss();
              if (json[0]['res'] == 1){
                navigator.notification.confirm(
                    'As pessoas selecionadas foram convidadas.', // message
                     function(){window.location.href = '../main.html';},
                    'Sucesso!',           // title
                    'OK'     // buttonLabels
                );
              } else {
                alert('erro');
              }
            },error: function(xhr,e,t){
              cordova.plugin.pDialog.dismiss();
              alert(xhr.responseText);
            }
          });
        } else {
          window.location.href = '../main.html';
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
        $('#bottom').css('bottom','0%');
        var h = $('#bottom').outerHeight();
        $('#conteudo').css('height','calc(90% - '+h+'px)');
      }

      $('#search').on('keyup',function(){
        pesq($(this).val());
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

var pessoa = [];
var select = 0;

$.ajax({
  type: "POST",
  url: "http://usevou.com/app/event.php",
  data: {
      'q': 'org',
      'id': window.localStorage.getItem('IdUsu')
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      html = '';
      for ( var i=0;i<json.length;i++ ){
        var id = json[i]["id"];
        var foto = json[i]["foto"];
        var nome = json[i]["nome"];
        html += '<li><img src="'+foto+'"><span>'+nome+'</span><img src="../img/sets/ic_check_off.png" id="'+id+'" onclick="changeImg(this,1)"></li>';
        p = [id,false,nome,foto];
        pessoa.push(p);
      }
      $('#loading').hide();
      $('#ul_org').html(html);
    } else {
      $('#loading').hide();
      $('#ul_org').html("<li>Você precisa seguir as pessoas para poder convidá-las.</li>");
    }
  },error: function(xhr,e,t){
    console.log(xhr.responseText);
  }
});

$('#bottom').css('bottom','0%');
var h = $('#bottom').outerHeight();
$('#conteudo').css('height','calc(90% - '+h+'px)');

function pesq(q){
  $('#loading').show();
  $('#ul_org').html('');
  html = "";
  result = 0;
  for ( var i=0;i<pessoa.length;i++ ){
    if ( pessoa[i][2].toLowerCase().indexOf(q.toLowerCase()) != -1 ){
      html += '<li><img src="'+pessoa[i][3]+'"><span>'+pessoa[i][2]+'</span><img src="../img/sets/ic_check_'+(pessoa[i][1]?'on':'off')+'.png" id="'+pessoa[i][0]+'" onclick="changeImg(this,'+(pessoa[i][1]?'0':'1')+')"></li>';
      result++;
    }
  }
  if ( result > 0 ){
    $('#loading').hide();
    $('#ul_org').html(html);
  } else {
    $('#loading').hide();
    $('#ul_org').html("<li>Nenhuma pessoa encontrada.</li>");
  }
}

function changeImg(img,i){
  if ( i == 0 ){
    $(img).attr('src','../img/sets/ic_check_off.png');
    $(img).attr('onclick','changeImg(this,1)');
    var id = $(img).attr('id');
    for ( var i=0;i<pessoa.length;i++ ){
      if ( id == pessoa[i][0] ){
        pessoa[i][1] = false;
        break;
      }
    }
    select--;
    if ( select == 0 ){
      $('#btn_ok_topo span').html('Pular');
    }
    $('#bottom').html(select+' pessoas selecionadas');
  } else {
    $(img).attr('src','../img/sets/ic_check_on.png');
    $(img).attr('onclick','changeImg(this,0)');
    var id = $(img).attr('id');
    for ( var i=0;i<pessoa.length;i++ ){
      if ( id == pessoa[i][0] ){
        pessoa[i][1] = true;
        break;
      }
    }
    select++;
    $('#btn_ok_topo span').html('Convidar');
    $('#bottom').html(select+' pessoas selecionadas');
  }
}

app.initialize();

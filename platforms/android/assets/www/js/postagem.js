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

      window.addEventListener('native.keyboardshow', keyboardShowHandler);

      function keyboardShowHandler(e){
        var key = e.keyboardHeight;
        var h = $('#adicionais').height();
        $('#conteudo').css('height','calc(90% - '+(key + h)+'px)');
        $('#adicionais').css('bottom',key+'px');
      }

      window.addEventListener('native.keyboardhide', keyboardHideHandler);

      function keyboardHideHandler(e){
        $('#adicionais').css('bottom','0%');
        var h = $('#adicionais').outerHeight();
        $('#conteudo').css('height','calc(90% - '+h+'px)');
      }

      $('.ft_perfil').height($('.ft_perfil').width());

      $('textarea').on('input',function(){
        var h = $('#adicionais').outerHeight();
        $('#conteudo').css('height','calc(90% - '+h+'px)');
      });
      var h = $('#adicionais').outerHeight();
      $('#conteudo').css('height','calc(90% - '+h+'px)');

      $('#send').on('click',function(){
        if( trim($('#coment').val()) == '' ){
          navigator.notification.alert(
            'Digite alguma coisa para poder comentar.',  // message
            null,         // callback
            'Você não escreveu nada!',            // title
            'OK'                  // buttonName
          );
        } else {
          cordova.plugin.pDialog.init({
            theme : 'HOLO_LIGHT',
            progressStyle : 'SPINNER',
            cancelable : false,
            title : 'Aguarde...',
            message : 'Realizando o comentário.'
          });
          $.ajax({
            type: "POST",
            url: "http://usevou.com/app/post.php",
            data: {
                'q': 'comentar',
                'idpost': localStorage.getItem('idpost'),
                'idusuario': window.localStorage.getItem('IdUsu'),
                'conteudo': trim($('#coment').val())
            },
            async: false,
            dataType: "json",
            success: function (json) {
              cordova.plugin.pDialog.dismiss();
              if (json[0]['res'] == 1){
                window.location.href='postagem.html';
              }
            },error: function(xhr,e,t){
              cordova.plugin.pDialog.dismiss();
              alert(xhr.responseText);
            }
          });
        }
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

var limit = 0;
var inter;
var panel = false;

function curtir(id,c){
  var num = parseInt($('#like'+id).html());
  if ( c ){
    $('#like'+id).html(''+(num-1));
    $('#imgl'+id).attr('src','img/sets/ic_like.png');
    $('#imgl'+id).attr('onclick','curtir('+id+',false)');

  } else {
    $('#like'+id).html(''+(num+1));
    $('#imgl'+id).attr('src','img/sets/ic_like_curtido.png');
    $('#imgl'+id).attr('onclick','curtir('+id+',true)');
  }
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/post.php",
    data: {
        'q': (c?'descurtir':'curtir'),
        'idusuario': window.localStorage.getItem('IdUsu'),
        'idpost': id,
        'idcomentario': null
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
      }
    },error: function(xhr,e,t){
      console.log(xhr.responseText);
    }
  });
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g,"");
}

$.ajax({
  type: "POST",
  url: "http://usevou.com/app/post.php",
  data: {
      'q': 'sel_post',
      'idpost': localStorage.getItem('idpost'),
      'idusuario': window.localStorage.getItem('IdUsu')
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      html = '<div class="card" style="margin-top:2.5%;">'+
        '<div class="cabecalho_card">'+
          '<div class="ft_perfil_card" style="background-image:url(\''+json[0]['ft_perfil']+'\')"></div>'+
          '<div class="info_card">'+
            '<div class="nome_card">'+json[0]['nome']+'</div>';
      var hor = parseInt(json[0]['diff'].substr(0,2));
      var min = parseInt(json[0]['diff'].substr(3,2));
      var seg = parseInt(json[0]['diff'].substr(6,2));
      if ( hor == 0 ){
        if ( min == 0 ){
          html += '<div class="data_card">Agora mesmo</div>';
        } else {
          html += '<div class="data_card">Há '+min+' minuto'+(min==1?'':'s')+' atrás</div>';
        }
      } else if ( hor < 24  ){
        html += '<div class="data_card">Há '+hor+' hora'+(hor==1?'':'s')+' atrás</div>';
      } else if ( hor < 96 ) {
        var t = parseInt(hor / 24);
        html += '<div class="data_card">Há '+t+' dias atrás</div>';
      } else {
        html += '<div class="data_card">'+json[0]['dt_hr']+'</div>';
      }
      html += '</div>'+
        '</div>'+
        '<div class="conteudo_card">'+
          '<p>'+json[0]['conteudo']+'</p>';
          for ( var j=0;j<json[0]['midia'];j++ ){
            html += '<img src="'+json[0]['url'+j]+'">';
          }
          html += '</div>'+
          '<div class="botoes_card">'+
            '<div class="btn_card">'+
              '<img src="img/sets/ic_like'+(json[0]['curtido']?'_curtido':'')+'.png" id="imgl'+json[0]['idpost']+'" onclick="curtir('+json[0]['idpost']+','+json[0]['curtido']+')">'+
              '<span id="like'+json[0]['idpost']+'" onclick="localStorage.setItem(\'idpost\','+json[0]['idpost']+');window.location.href = \'main_tabs/curtidas.html\'">'+json[0]['curtidas']+'</span>'+
            '</div>'+
            '<div class="btn_card">'+
              '<img src="img/sets/ic_comment.png" style="margin-left:23%;">'+
              '<span>'+json[0]['comentarios']+'</span>'+
            '</div>'+
            '<div class="btn_card">'+
              '<span style="float:right;" onclick="localStorage.setItem(\'idpost\','+json[0]['idpost']+');window.location.href = \'main_tabs/shareds.html\'">'+json[0]['compartilhar']+'</span>'+
              '<img src="img/sets/ic_shared.png" style="float:right;" onclick="shared('+json[0]['idpost']+')">'+
            '</div>'+
          '</div>'+
        '</div>'+
        '</div>'+
      '</div>';
      $('#post').html(html);
      $('.ft_perfil_card').height($('.ft_perfil_card').width());
    }
  },error: function(xhr,e,t){
    console.log('error');
    alert(xhr.responseText);
  }
});

function shared(id){
  localStorage.setItem('idpost',id);
  navigator.notification.prompt(
      'Escreva algo sobre a publicação que você deseja compartilhar.',  // message
      onShared,                  // callback to invoke
      'Compartilhar',            // title
      ['Compartilhar','Cancelar'],             // buttonLabels
      ''                 // defaultText
  );
}

function onShared(results){
  if ( results.buttonIndex == 1 ){
    var input = results.input1;
    cordova.plugin.pDialog.init({
      theme : 'HOLO_LIGHT',
      progressStyle : 'SPINNER',
      cancelable : false,
      title : 'Aguarde...',
      message : 'Compartilhando.'
    });
    $.ajax({
      type: "POST",
      url: "http://usevou.com/app/post.php",
      data: {
          'q': 'shared',
          'idpost': localStorage.getItem('idpost'),
          'idusuario': window.localStorage.getItem('IdUsu'),
          'conteudo': trim(input)
      },
      async: false,
      dataType: "json",
      success: function (json) {
        cordova.plugin.pDialog.dismiss();
        if (json[0]['res'] == 1){
          window.location.href='main.html';
        }
      },error: function(xhr,e,t){
        cordova.plugin.pDialog.dismiss();
        alert(xhr.responseText);
      }
    });
  }
}

function coments(){
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/post.php",
    data: {
        'q': 'coments',
        'idpost': localStorage.getItem('idpost'),
        'idusuario': window.localStorage.getItem('IdUsu'),
        'limit': limit
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if( limit == 0 ){
        $('#comentarios').html('');
      }
      if (json[0]['res'] == 1){
        for(var i=0;i<json.length;i++){
          html = '';
          if(i==9) {
            html += '<div id="button_plus">Ver mais comentários</div>'+
                    '<script>$(\'#button_plus\').on(\'touchstart\',function(){'+
                      '$(\'#button_plus\').css(\'background-color\',\'#D2D2D2\');'+
                    '});'+
                    '$(\'#button_plus\').on(\'touchend\',function(){'+
                      '$(\'#button_plus\').css(\'background-color\',\'white\');'+
                    '});'+
                    '$(\'#button_plus\').on(\'click\',function(){'+
                      'limit += 10;'+
                      'coments();'+
                    '});</script>';
          } else if ( (i+1) == json.length ) {
            html += '<div class="line" style="width:100%;margin-left:0%;"></div>';
          } else {
            html += '<div class="line"></div>';
          }
          idc = json[i]['idcomentario'];
          idu = json[i]['idusuario'];
          nome = json[i]['nome'];
          foto = json[i]['foto'];
          dt_hr = json[i]['dt_hr'];
          diff = json[i]['diff'];
          conteudo = json[i]['conteudo'];
          curtidas = json[i]['curtidas'];
          curtido = json[i]['curtido'];
          html += '<div class="comentario" id="'+idc+'">'+
            '<div class="header_comentario">'+
              '<div class="ft" onclick="localStorage.setItem(\'viewProfile\','+idu+');window.location.href = \'menu_lat/profile.html\'"><div class="ft_perfil" style="background-image:url('+foto+')"></div></div>'+
              '<div class="info">'+
                '<div class="nome" onclick="localStorage.setItem(\'viewProfile\','+idu+');window.location.href = \'menu_lat/profile.html\'">'+nome+'</div>';
          var hor = parseInt(diff.substr(0,2));
          var min = parseInt(diff.substr(3,2));
          var seg = parseInt(diff.substr(6,2));
          if ( hor == 0 ){
            if ( min == 0 ){
              html += '<div class="hora">Agora mesmo</div>';
            } else {
              html += '<div class="hora">Há '+min+' minuto'+(min==1?'':'s')+' atrás</div>';
            }
          } else if ( hor < 24  ){
            html += '<div class="hora">Há '+hor+' hora'+(hor==1?'':'s')+' atrás</div>';
          } else if ( hor < 96 ) {
            var t = parseInt(hor / 24);
            html += '<div class="hora">Há '+t+' dias atrás</div>';
          } else {
            html += '<div class="hora">'+dt_hr+'</div>';
          }
          html += '</div>'+
              '<div class="like">'+
                '<img src="img/sets/ic_like'+(curtido?'_curtido':'')+'.png" id="imgl'+idc+'" onclick="curtirComentario('+idc+','+curtido+')">'+
                '<div id="like'+idc+'">'+curtidas+'</div>'+
              '</div>'+
            '</div>'+
            '<div class="cont" id="cont'+idc+'">'+conteudo+'</div>';
          if ( conteudo.length > 160 ){
            html += '<div class="cont_plus" onclick="$(this).remove();$(\'#cont'+idc+'\').css(\'max-height\',\'none\')">Ver mais</div>';
          }
          html += '</div>';
          if ( window.localStorage.getItem('IdUsu') == idu ){
            html += '<script>$("#'+idc+'").on("touchstart",function(){'+
              'if( !panel ){inter = setTimeout(function(){showPanelComent('+idc+');},1000)}'+
            '});'+
            '$("#'+idc+'").on("touchend",function(){'+
              'clearTimeout(inter)'+
            '});</script>';
          }
          $('#comentarios').prepend(html);
          $('.ft_perfil').height($('.ft_perfil').width());
        }
      } else {
        if ( limit == 0 ){
          $('#comentarios').prepend('<div style="text-align:center;margin-top:10%;font-size:1.5em;width:80%;margin-left:10%;font-family:Lato-Light;">Ninguém comentou nessa publicação.</div>');
        }
      }
      if ( limit == 0 ){
        $(function(){
          var minhadiv = document.getElementById("comentarios");
              minhadiv.scrollTop = minhadiv.scrollHeight;
        });
      } else {
        $(function(){
          var minhadiv = document.getElementById("comentarios");
              minhadiv.scrollTop = $("#button_plus").offset().top - $('#topo').outerHeight() - $('#button_plus').outerHeight();
        });
        $('#button_plus').remove();
      }
    },error: function(xhr,e,t){
      alert(xhr.responseText);
    }
  });
}

function showPanelComent(id){
  $('#'+id).css('background-color','#D2D2D2');
  $('#topo').css('background-color','white');
  $('#back img').attr('src','img/sets/ic_exit.png');
  $('#back').off('click');
  $('#back').on('click',function(){hidePanelComent(id)});
  $('#del').off('click');
  $('#del').on('click',function(){
    $.ajax({
      type: "POST",
      url: "http://usevou.com/app/post.php",
      data: {
          'q': 'del_coment',
          'idcomentario': id
      },
      async: true,
      dataType: "json",
      success: function (json) {
        if (json[0]['res'] == 1){
          window.location.href='postagem.html';
        }
      },error: function(xhr,e,t){
        console.log(xhr.responseText);
      }
    });
  });
  panel = true;
}

function hidePanelComent(id){
  $('#'+id).css('background-color','white');
  $('#topo').css('background-color','#652C90');
  $('#back img').attr('src','img/sets/ic_back.png');
  $('#back').off('click');
  $('#back').on('click',function(){window.history.back();});
  $('#del').off('click');
  panel = false;
}

function curtirComentario(id,c){
  var num = parseInt($('#like'+id).html());
  if ( c ){
    $('#like'+id).html(''+(num-1));
    $('#imgl'+id).attr('src','img/sets/ic_like.png');
    $('#imgl'+id).attr('onclick','curtir('+id+',false)');

  } else {
    $('#like'+id).html(''+(num+1));
    $('#imgl'+id).attr('src','img/sets/ic_like_curtido.png');
    $('#imgl'+id).attr('onclick','curtir('+id+',true)');
  }
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/post.php",
    data: {
        'q': (c?'descurtir':'curtir'),
        'idusuario': window.localStorage.getItem('IdUsu'),
        'idpost': null,
        'idcomentario': id
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
      }
    },error: function(xhr,e,t){
      console.log(xhr.responseText);
    }
  });
}

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

autosize($('textarea'));
$('textarea').css('height','1.2em');

coments();

app.initialize();

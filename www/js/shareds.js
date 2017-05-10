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


limit = 0;

$("#conteudo").scroll(function() {
  if ($(this).scrollTop() + $(this).height() == $(this).get(0).scrollHeight) {
    if ( limit >= 0 ){
      limit += 10;
      loadCurtidas();
    }
  }
});

function loadCurtidas(){
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/post.php",
    data: {
        'q': 'quem_comp',
        'idusuario': window.localStorage.getItem('IdUsu'),
        'idpost': localStorage.getItem('idpost'),
        'limit': limit
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if ( limit == 0 )
        $('#noti').html('');
      if (json[0]['res'] == 1){
        html = '';
        for(var i=0;i<json.length;i++){
          html += '<div class="notification">'+
            '<div class="ft_perfil_noti" style="background-image:url(\''+json[i]['foto']+'\')" onclick="localStorage.setItem(\'viewProfile\','+json[i]['idusuario']+');window.location.href = \'../menu_lat/profile.html\'"></div>'+
            '<div class="content_noti" onclick="localStorage.setItem(\'viewProfile\','+json[i]['idusuario']+');window.location.href = \'../menu_lat/profile.html\'">'+json[i]['nome']+'</div>';
          if ( window.localStorage.getItem('IdUsu') != json[i]['idusuario'] ){
            html += '<div class="type_noti">'+
                (json[i]['seguindo']?'<img src="../img/sets/ic_seg.png"':'<img src="../img/sets/ic_seg_plus.png"')+
                ' onclick="seguir('+json[i]['idusuario']+','+json[i]['seguindo']+')" id="img'+json[i]['idusuario']+'">'+
              '</div>';
          }
          html += '</div><div class="line"></div>';
        }
        if ( i == 10 ){
          html += "<img src='img/sets/loading.gif' id='feed_load'>";
        } else {
          limit = -50;
        }
        $('#noti').append(html);
        $('.ft_perfil_noti').height($('.ft_perfil_noti').width());
      } else {
        $('#noti').append('<div style="text-align:center;margin-top:10%;font-size:1.5em;width:80%;margin-left:10%;font-family:Lato-Light;">Ninguém compartilhou essa publicação.</div>');
      }
    },error: function(xhr,e,t){
      alert(xhr.responseText);
    }
  });
}

function seguir(id,seg){
  if ( seg ){
    $('#img'+id).attr('src','../img/sets/ic_seg_plus.png');
    $('#img'+id).attr('onclick','seguir('+id+',false)');
    $.ajax({
      type: "POST",
      url: "http://usevou.com/app/profile.php",
      data: {
          'q': 'deseg',
          'idusuario': window.localStorage.getItem('IdUsu'),
          'idusu': id
      },
      async: true,
      dataType: "json",
      success: function (json) {

      },error: function(xhr,e,t){
        alert(xhr.responseText);
      }
    });
  } else {
    $('#img'+id).attr('src','../img/sets/ic_seg.png');
    $('#img'+id).attr('onclick','seguir('+id+',true)');
    $.ajax({
      type: "POST",
      url: "http://usevou.com/app/profile.php",
      data: {
          'q': 'seg',
          'idusuario': window.localStorage.getItem('IdUsu'),
          'idusu': id
      },
      async: true,
      dataType: "json",
      success: function (json) {

      },error: function(xhr,e,t){
        alert(xhr.responseText);
      }
    });
  }
}

loadCurtidas();

app.initialize();

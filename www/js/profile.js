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
      $('#edit').on('click',function(){$('#topo').off('click');});

      loadPage(0);

      $('#feed').on('click',function(){loadPage(0);page = 0;});
      $('#about').on('click',function(){loadPage(1);page = 1;});
      $('#galery').on('click',function(){loadPage(2);page = 2;});
      $('#events').on('click',function(){loadPage(3);page = 3;});

      var p = $('#topo').css('padding-bottom');
      var pp = parseInt(p.substr(0,p.length-2));
      var total = $('#header_profile').height() - $('#topo').height() - $('#barra').height() - pp;

      $('#conteudo').css('min-height','calc(100% - '+($('#topo').height() + $('#barra').height() + pp - 2)+'px)');

      $(window).scroll(function () {
        var s = $(this).scrollTop();
        scroll = s;
        if ( s >= total ){
          $('#barra').css({'position':'fixed','top':'10.5%'});
          $('#topo').css('background','rgba(101,44,144,1)');
          $('#label_topo').css('display','block');
          $('#label_topo').css('opacity','1');
          $('#conteudo').css('margin-top','15%');
          $('#topo').off('click');
        } else {
          $('#barra').css({'position':'relative','top':'0%'});
          $('#topo').css('background','rgba(101,44,144,0)');
          $('#label_topo').css('opacity','0');
          $('#label_topo').css('display','none');
          $('#conteudo').css('margin-top','0%');
          if ( localStorage.getItem('viewProfile') != window.localStorage.getItem('IdUsu') ){
            $('#topo').on('click',function(){
              var url = $('#header_profile').css('background-image');
              url = url.substr(5,(url.length-7));
              localStorage.setItem("clickImage",url);
              window.location.href = "../showImage.html";
            });
          } else {
            $('#topo').on('click',function(){
              var url = $('#header_profile').css('background-image');
              url = url.substr(5,(url.length-7));
              localStorage.setItem("clickImage",url);
              localStorage.setItem("type",'capa');
              $('#fundo').show();
              $('#option').show();
              setTimeout(function(){
                $('#fundo').css('opacity','0.6');
                $('#option').css('transform','scale(1)');
              },100);
            });
          }
        }
      });

      document.getElementById('conteudo').addEventListener('touchstart', handleTouchStart, false);
      document.getElementById('conteudo').addEventListener('touchmove', function(evt){
        var h = handleTouchMove(evt);
        if (h == "left"){
          if ( page < 3 ){
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

      $('#gallery').on('click',function(){
        window.location.href = '../profile/edit_ft.html';
      });

      $('#show').on('click',function(){
        window.location.href = "../showImage.html";
      });

      $('#camera').on('click',function(){

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
var xDown = null;
var yDown = null;
var page = 0;

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
  $('#conteudo').html("<img src='../img/sets/loading.gif' id='loading'>");
  if ( i == 0 ){
    $('#conteudo').load('../profile/feed.html');
    $('#tab_barra').css('margin-left','0%');
  } else if ( i == 1 ){
    $('#conteudo').load('../profile/about.html');
    $('#tab_barra').css('margin-left','25%');
  } else if ( i == 2 ){
    $('#conteudo').load('../profile/gallery.html');
    $('#tab_barra').css('margin-left','50%');
  } else if ( i == 3 ){
    $('#conteudo').load('../profile/events.html');
    $('#tab_barra').css('margin-left','75%');
  }
  $("#conteudo").animate({scrollTop: 0 }, 0);
}

$.ajax({
  type: "POST",
  url: "http://usevou.com/app/profile.php",
  data: {
      'q': 'sel',
      'idusu': localStorage.getItem('viewProfile'),
      'idusuario': window.localStorage.getItem('IdUsu')
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      if ( localStorage.getItem('viewProfile') == window.localStorage.getItem('IdUsu') ){
        window.localStorage.setItem('DataUsu',json[0]['dt_nasc']);
        window.localStorage.setItem('CidadeUsu',json[0]['cidade']);
      } else {
        localStorage.setItem('viewCidadeUsu',json[0]['cidade']);
      }
      $('#age_profile').html(json[0]['idade']+' anos');
      if ( json[0]['cidade'] != null )
        $('#locale_profile').html(json[0]['cidade']);
      else
        $('#locale_profile').html('');
      $('#seguidores').html(json[0]['seguidores']);
      $('#seguindo').html(json[0]['seguindo']);

      $('#label_topo').html(json[0]['nome']);
      $('#name_profile').html(json[0]['nome']);
      $('#header_profile').css('background-image','url("'+json[0]['capa']+'")');
      $('#ft_perfil').css('background-image','url("'+json[0]['perfil']+'")');

      if ( !json[0]['seg'] ){
        $('#seg img').attr('src','../img/sets/ic_seg_plus_white.png');
        $('#seg').attr('onclick','seguir('+localStorage.getItem('viewProfile')+',false)');
      } else {
        $('#seg').attr('onclick','seguir('+localStorage.getItem('viewProfile')+',true)');
      }
    }
  },error: function(xhr,e,t){
    alert(xhr.responseText);
  }
});

function seguir(id,seg){
  if ( seg ){
    $('#seg img').attr('src','../img/sets/ic_seg_plus_white.png');
    $('#seg').attr('onclick','seguir('+id+',false)');
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
    $('#seg img').attr('src','../img/sets/ic_seg_white.png');
    $('#seg').attr('onclick','seguir('+id+',true)');
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

if ( localStorage.getItem('viewProfile') != window.localStorage.getItem('IdUsu') ){
  $('#edit').hide();
  $('#seg').show();

  $('#ft_perfil').on('click',function(){
    var url = $('#ft_perfil').css('background-image');
    url = url.substr(5,(url.length-7));
    localStorage.setItem("clickImage",url);
    $('#fundo_profile').off('click');
    setTimeout(function(){
      $('#fundo_profile').on('click',function(){
        var url = $('#header_profile').css('background-image');
        url = url.substr(5,(url.length-7));
        localStorage.setItem("clickImage",url);
        window.location.href = "../showImage.html";
      });
    },100);
    window.location.href = "../showImage.html";
  });

  $('#fundo_profile').on('click',function(){
    var url = $('#header_profile').css('background-image');
    url = url.substr(5,(url.length-7));
    localStorage.setItem("clickImage",url);
    window.location.href = "../showImage.html";
  });

  $('#topo').on('click',function(){
    var url = $('#header_profile').css('background-image');
    url = url.substr(5,(url.length-7));
    localStorage.setItem("clickImage",url);
    window.location.href = "../showImage.html";
  });

  $('#seg').on('click',function(){
    $('#fundo_profile').off('click');
    $('#topo').off('click');
    setTimeout(function(){
      $('#fundo_profile').on('click',function(){
        var url = $('#header_profile').css('background-image');
        url = url.substr(5,(url.length-7));
        localStorage.setItem("clickImage",url);
        window.location.href = "../showImage.html";
      });
      $('#topo').on('click',function(){
        var url = $('#header_profile').css('background-image');
        url = url.substr(5,(url.length-7));
        localStorage.setItem("clickImage",url);
        window.location.href = "../showImage.html";
      });
    },100);
  });
} else {
  $('#edit').show();
  $('#seg').hide();

  $('#ft_perfil').on('click',function(){
    var url = $('#ft_perfil').css('background-image');
    url = url.substr(5,(url.length-7));
    localStorage.setItem("clickImage",url);
    localStorage.setItem("type",'perfil');
    $('#fundo_profile').off('click');
    $('#fundo').show();
    $('#option').show();
    setTimeout(function(){
      $('#fundo').css('opacity','0.6');
      $('#option').css('transform','scale(1)');
      $('#fundo_profile').on('click',function(){
        var url = $('#header_profile').css('background-image');
        url = url.substr(5,(url.length-7));
        localStorage.setItem("clickImage",url);
        $('#fundo').show();
        $('#option').show();
        setTimeout(function(){
          $('#fundo').css('opacity','0.6');
          $('#option').css('transform','scale(1)');
        },100);
      });
    },100);
  });

  $('#fundo_profile').on('click',function(){
    var url = $('#header_profile').css('background-image');
    url = url.substr(5,(url.length-7));
    localStorage.setItem("clickImage",url);
    localStorage.setItem("type",'capa');
    $('#fundo').show();
    $('#option').show();
    setTimeout(function(){
      $('#fundo').css('opacity','0.6');
      $('#option').css('transform','scale(1)');
    },100);
  });

  $('#topo').on('click',function(){
    var url = $('#header_profile').css('background-image');
    url = url.substr(5,(url.length-7));
    localStorage.setItem("clickImage",url);
    localStorage.setItem("type",'capa');
    $('#fundo').show();
    $('#option').show();
    setTimeout(function(){
      $('#fundo').css('opacity','0.6');
      $('#option').css('transform','scale(1)');
    },100);
  });

  $('#fundo').on('click',function(){
    $('#fundo').css('opacity','0');
    $('#option').css('transform','scale(0)');
    setTimeout(function(){
      $('#fundo').hide();
      $('#option').hide();
    },500);
  });

  $('#option').on('click',function(){
    $('#fundo').css('opacity','0');
    $('#option').css('transform','scale(0)');
    setTimeout(function(){
      $('#fundo').hide();
      $('#option').hide();
    },500);
  });
}

$('#seguindo').on('click',function(){
  $('#fundo_profile').off('click');
  $('#topo').off('click');
  setTimeout(function(){
    $('#fundo_profile').on('click',function(){
      var url = $('#header_profile').css('background-image');
      url = url.substr(5,(url.length-7));
      localStorage.setItem("clickImage",url);
      window.location.href = "../showImage.html";
    });
    $('#topo').on('click',function(){
      var url = $('#header_profile').css('background-image');
      url = url.substr(5,(url.length-7));
      localStorage.setItem("clickImage",url);
      window.location.href = "../showImage.html";
    });
  },100);
  localStorage.setItem('typeSeg','seguindo');
  window.location.href = '../profile/seg.html';
});

$('#seguidores').on('click',function(){
  $('#fundo_profile').off('click');
  $('#topo').off('click');
  setTimeout(function(){
    $('#fundo_profile').on('click',function(){
      var url = $('#header_profile').css('background-image');
      url = url.substr(5,(url.length-7));
      localStorage.setItem("clickImage",url);
      window.location.href = "../showImage.html";
    });
    $('#topo').on('click',function(){
      var url = $('#header_profile').css('background-image');
      url = url.substr(5,(url.length-7));
      localStorage.setItem("clickImage",url);
      window.location.href = "../showImage.html";
    });
  },100);
  localStorage.setItem('typeSeg','seguidores');
  window.location.href = '../profile/seg.html';
});

app.initialize();

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
        var h = $('#adicionais').height();
        $('#conteudo').css('height','calc(90% - '+h+'px)');
      }

      $('#camera').on('click',function(){
        navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
          destinationType: Camera.DestinationType.DATA_URL, mediaType: Camera.MediaType.VIDEO
        });
      });

      $('#video').on('click',function(){
        navigator.device.capture.captureVideo(captureSuccess, onFail, {limit:2});
      });


      var i = 0;
      var img = [];
      var local;

      function onSuccess(imageData,type) {
        if ( i < 10  ){
          img[i] = imageData;
          $('#images').append('<div class="img" id="image'+i+'"></div>');
          $('#image'+i).css('background-image',"url(" + (type == null?'data:image/jpeg;base64,':'') + imageData+")");
          $('#image'+i).height($('#image'+i).width());
          $('#image'+i).on('click',function(){
            local = $(this);
            navigator.notification.confirm(
                'Você realmente deseja excluir essa imagem?', // message
                 function(buttonIndex){
                   if(buttonIndex == 1){
                     var id = parseInt(local.attr('id').substr(5));
                     img[id] = false;
                     local.remove();
                   }
                 },
                'Excluir imagem',           // title
                ['Excluir','Cancelar']     // buttonLabels
            );
          });
          i++;
          navigator.camera.cleanup(function(){}, function(){});
        } else {
          navigator.notification.confirm(
              'Você já tem 10 imagens nessa postagem.', // message
               null,
              'Número de arquivos excedidos!',           // title
              'OK'     // buttonLabels
          );
        }
      }

      var captureSuccess = function(mediaFiles) {
          var i, path, len;
          for (i = 0, len = mediaFiles.length; i < len; i += 1) {
              path = mediaFiles[i].fullPath;
              alert(path);
          }
      };

      function onFail(message) {
        alert('Failed because: ' + message);
        navigator.camera.cleanup(function(){}, function(){});
      }

      function readFile(event) {
        if ( this.files.length < 10 ){
          for ( var i=0;i<this.files.length;i++ ){
            if (this.files && this.files[i]) {
              var FR = new FileReader();

              FR.onload = function(event) {
                onSuccess(event.target.result,'input');
              };
              FR.onerror = function(event) {
                alert(event.target.error.code);
              };

              FR.readAsDataURL( this.files[i] );
            }
          }
        } else {
          navigator.notification.confirm(
              'Você selecionou mais de 10 imagens.', // message
               null,
              'Número de arquivos excedidos!',           // title
              'OK'     // buttonLabels
          );
        }
      }

      $('#file').on('change',readFile);

      $('#btn_ok_topo').on('click',function(){
        var post = null;
        var im = [];
        var ok = false;
        var j = 0;
        for(var i=0;i<img.length;i++){
          if (img[i] != false){
            im[j] = img[i];
            ok = true;
            j++;
          }
        }
        if ( $('#post').val() == '' ){
          if ( !ok ){
            navigator.notification.confirm(
                'Digite algo e/ou adicione imagens que queira compartilhar.', // message
                 null,
                'Poste alguma coisa!',           // title
                'OK'     // buttonLabels
            );
          }
        } else {
          post = $('#post').val();
        }
        if ( post != null || im != '' ){
          cordova.plugin.pDialog.init({
            theme : 'HOLO_LIGHT',
            progressStyle : 'SPINNER',
            cancelable : false,
            title : 'Aguarde...',
            message : 'Efetuando a postagem.'
          });
          $.ajax({
            type: "POST",
            url: "http://usevou.com/app/post.php",
            data: {
                'q': 'cad',
                'post': post,
                'img': (im!=''?img:'null'),
                'idusuario': window.localStorage.getItem('IdUsu'),
                'idevento': localStorage.getItem('viewEvent'),
                'evento': false
            },
            async: true,
            dataType: "json",
            success: function (json) {
              cordova.plugin.pDialog.dismiss();
              if (json[0]['res'] == 1){
                navigator.notification.confirm(
                    'Sua postagem foi publicada com sucesso.', // message
                     function(){window.history.back();},
                    'Sucesso!',           // title
                    'OK'     // buttonLabels
                );
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

app.initialize();

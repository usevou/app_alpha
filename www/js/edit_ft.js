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
      $('#cancel').on('click',function(){window.history.back();});

      $('.image-editor').cropit({
        exportZoom: 2,
        imageBackground: true
      });

      $('#confirm').click(function() {
        var imageData = $('.image-editor').cropit('export', {
            type: 'image/jpeg',
            quality: 0.33,
            originalSize: true,
        });
        var login = window.localStorage.getItem('login');
        cordova.plugin.pDialog.init({
          theme : 'HOLO_LIGHT',
          progressStyle : 'SPINNER',
          cancelable : true,
          title : 'Aguarde...',
          message : 'Alterando a foto de '+localStorage.getItem('type')+'.'
        });
        $.ajax({
          type: "POST",
          url: "http://usevou.com/app/profile.php",
          data: {
              'q': localStorage.getItem('type'),
              'login': login,
              'foto' : imageData
          },
          async: true,
          dataType: "json",
          success: function (json) {
            cordova.plugin.pDialog.dismiss();
            if (json[0]['res'] == 1){
              if ( localStorage.getItem('type') == 'perfil' )
                window.localStorage.setItem('PerfilUsu',imageData);
              else
                window.localStorage.setItem('CapaUsu',imageData);
              window.history.back();
            }
          },error: function(xhr,e,t){
            cordova.plugin.pDialog.dismiss();
            console.log(xhr.responseText);
          }
        });
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

$('.cropit-preview').height($('.cropit-preview').width());
$('.cropit-preview').css('margin-top','calc(50% - '+($('.cropit-preview').height()/4)+'px)');
if ( localStorage.getItem('type') == 'perfil' ){
  $('.cropit-preview').css('border-radius','50%');
  $('.cropit-preview-image-container').css('border-radius','50%');
}

app.initialize();

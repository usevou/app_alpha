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
        window.history.back();
        localStorage.removeItem('NewEventImg');
        localStorage.removeItem('NewEventNome');
        localStorage.removeItem('NewEventLat');
        localStorage.removeItem('NewEventLng');
        localStorage.removeItem('NewEventDtIni');
        localStorage.removeItem('NewEventHrIni');
        localStorage.removeItem('NewEventDtFim');
        localStorage.removeItem('NewEventHrFim');
        localStorage.removeItem('NewEventDesc');
        localStorage.removeItem('NewEventTags');
        localStorage.removeItem('NewEventOrg');
        localStorage.removeItem('NewEventDe');
        localStorage.removeItem('NewEventAte');
        localStorage.removeItem('NewEventPri');
        localStorage.removeItem('NewEventPerm');
      });

      $('#confirm').on('click',function(){
        var erro = 0;
        var msg = ''
        if ( nome == '' ){
          erro++;
          msg += 'Escolha um nome.\n';
        }

        if ( lat == '' || lng == '' ){
          erro++;
          msg += 'Selecione o local.\n';
        }

        if ( dtini == '' || hrini == '' ){
          erro++;
          msg += 'Defina a data e o horário.\n';
        } else if ( dtfim != '' || hrfim != '' ){
          if ( (dtini > dtfim) || (dtini == dtfim && hrini > hrfim) ){
            erro++;
            msg += 'O fim do evento não pode ser antes do início.\n';
          } else if ( dtini == dtfim && hrini == hrfim ){
            erro++;
            msg += 'O início e o fim do evento não podem ser iguais.\n';
          }
        }

        if ( de != '' && ate != '' ){
          if ( de > ate ){
            erro++;
            msg += 'O início da faixa de preço não pode ser maior que o fim.\n';
          }
        }

        if ( erro == 0 ){
          cordova.plugin.pDialog.init({
            theme : 'HOLO_LIGHT',
            progressStyle : 'SPINNER',
            cancelable : true,
            title : 'Aguarde...',
            message : 'Criando o evento.'
          });
          $.ajax({
            type: "POST",
            url: "http://usevou.com/app/event.php",
            data: {
                'q': 'cad',
                'idusuario': window.localStorage.getItem('IdUsu'),
                'nome': nome,
                'desc': desc,
                'lat': lat,
                'lng': lng,
                'dtini': dtini,
                'hrini': hrini,
                'dtfim': dtfim,
                'hrfim': hrfim,
                'de': de,
                'ate': ate,
                'coins': false,
                'troca': false,
                'img': img,
                'priv': priv,
                'pub': pub,
                'tags': it,
                'orgs': io
            },
            async: true,
            dataType: "json",
            success: function (json) {
              cordova.plugin.pDialog.dismiss();
              if (json[0]['res'] == 1){
                navigator.notification.alert(
                  'Evento cadastrado com sucesso.',  // message
                  function(){
                    localStorage.setItem('NewEventId',json[0]['id']);
                    localStorage.removeItem('NewEventImg');
                    localStorage.removeItem('NewEventNome');
                    localStorage.removeItem('NewEventLat');
                    localStorage.removeItem('NewEventLng');
                    localStorage.removeItem('NewEventDtIni');
                    localStorage.removeItem('NewEventHrIni');
                    localStorage.removeItem('NewEventDtFim');
                    localStorage.removeItem('NewEventHrFim');
                    localStorage.removeItem('NewEventDesc');
                    localStorage.removeItem('NewEventTags');
                    localStorage.removeItem('NewEventOrg');
                    localStorage.removeItem('NewEventDe');
                    localStorage.removeItem('NewEventAte');
                    localStorage.removeItem('NewEventPri');
                    localStorage.removeItem('NewEventPerm');
                    if ( priv == 1 || priv == 0 ){
                      window.history.back();
                    } else {
                      window.location.href = 'convidarNewEvent.html';
                    }
                  },         // callback
                  'Concluído!',            // title
                  'OK'                  // buttonName
                );
              }
            },error: function(xhr,e,t){
              console.log(xhr.responseText);
              cordova.plugin.pDialog.dismiss();
              alert(xhr.responseText);
            }
          });
        } else {
          navigator.notification.alert(
            msg,  // message
            null,         // callback
            'Occoreu algum erro!',            // title
            'OK'                  // buttonName
          );
        }
      });

      window.addEventListener('native.keyboardshow', keyboardShowHandler);

      function keyboardShowHandler(e){
        var key = e.keyboardHeight;
        $('#conteudo').css('height','calc(90% - '+key+'px)');
      }

      window.addEventListener('native.keyboardhide', keyboardHideHandler);

      function keyboardHideHandler(e){
        $('#conteudo').css('height','90%');
      }

      function readFile(event) {
        for ( var i=0;i<this.files.length;i++ ){
          if (this.files && this.files[i]) {
            var FR = new FileReader();

            FR.onload = function(event) {
              $('#foto_evento').css('background-image',"url("+event.target.result+")");
              $('#button').html('Trocar imagem');
              img = event.target.result;
              localStorage.setItem('NewEventImg',img);
            };
            FR.onerror = function(event) {
              alert(event.target.error.code);
            };

            FR.readAsDataURL( this.files[i] );
          }
        }
      }

      $('#input').on('change',readFile);

      $('#priv').on('change',function(){
        if ( $(this).val() == 1 ){
          $('#t_priv').html('Este evento poderá ser visto e acessado por qualquer pessoa próxima da localidade do evento.');
        } else {
          $('#t_priv').html('Este evento apenas será visível para as pessoas que forem convidadas pelos organizadores do evento.');
        }
      });

      $('#ok').on('click',cadtag);
      $('#ok_org').on('click',cadorg);

      $('#org').on('input',function(){
        var v = $('#org').val();
        if ( o.length > 0 && v != '' ){
          $('#list_org').show();
          for ( var i=0;i<o.length;i++ ){
            if ( o[i][2].toLowerCase().indexOf(v.toLowerCase()) == -1 ){
              $('#ul_org #'+o[i][0]).hide();
            } else {
              for ( var j=0;j<io.length;j++ ){
                if ( io[j] == o[i][0] )
                  break;
              }
              if ( j == io.length )
                $('#ul_org #'+o[i][0]).show();
            }
          }
        } else {
          $('#list_org').hide();
        }
      });

      if ( localStorage.getItem('NewEventImg') != null ){
        img = localStorage.getItem('NewEventImg');
        $('#foto_evento').css('background-image',"url("+img+")");
        $('#button').html('Trocar imagem');
      }

      if ( localStorage.getItem('NewEventNome') != null ){
        nome = localStorage.getItem('NewEventNome');
        $('#nome').val(nome);
        $('#lNome').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventLat') != null && localStorage.getItem('NewEventLng') != null ){
        lat = parseFloat(localStorage.getItem('NewEventLat'));
        lng = parseFloat(localStorage.getItem('NewEventLng'));
        $('#local').val('Lat: '+lat.toFixed(4)+' & Lng: '+lng.toFixed(4));
        $('#lLocal').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventDtIni') != null ){
        dtini = localStorage.getItem('NewEventDtIni');
        $('#dtini').val(dtini);
        $('#lDtini').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventHrIni') != null ){
        hrini = localStorage.getItem('NewEventHrIni');
        $('#hrini').val(hrini);
        $('#lHrini').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventDtFim') != null ){
        $('#check').attr('checked',true);
        dtfim = localStorage.getItem('NewEventDtFim');
        $('#dtfim').val(dtfim);
        $('#lDtfim').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
        $('#dt_fim').show();
        $('#hr_fim').show();
      }

      if ( localStorage.getItem('NewEventHrFim') != null ){
        $('#check').attr('checked',true);
        hrfim = localStorage.getItem('NewEventHrFim');
        $('#hrfim').val(hrfim);
        $('#lHrfim').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
        $('#dt_fim').show();
        $('#hr_fim').show();
      }

      if ( localStorage.getItem('NewEventDesc') != null ){
        desc = localStorage.getItem('NewEventDesc');
        $('#desc').val(desc);
        $('#lDesc').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventDe') != null ){
        de = localStorage.getItem('NewEventDe');
        $('#de').val(de);
        $('#lDe').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventAte') != null ){
        ate = localStorage.getItem('NewEventAte');
        $('#ate').val(ate);
        $('#lAte').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventPri') != null ){
        priv = localStorage.getItem('NewEventPri');
        $('#priv').val(priv);
        $('#lPriv').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
      }

      if ( localStorage.getItem('NewEventPerm') != null ){
        if ( localStorage.getItem('NewEventPerm') ){
          pub = 'on';
        } else {
          pub = 'off';
        }
        $('#public').attr('checked',pub);
      }

      $('#nome').on('change',function(){
        if ( $(this).val() != '' ){
          nome = $(this).val();
          localStorage.setItem('NewEventNome',$(this).val());
        } else {
          localStorage.removeItem('NewEventNome');
        }
      });

      $('#dtini').on('change',function(){
        if ( $(this).val() != '' ){
          dtini = $(this).val();
          localStorage.setItem('NewEventDtIni',$(this).val());
        } else {
          localStorage.removeItem('NewEventDtIni');
        }
      });

      $('#hrini').on('change',function(){
        if ( $(this).val() != '' ){
          hrini = $(this).val();
          localStorage.setItem('NewEventHrIni',$(this).val());
        } else {
          localStorage.removeItem('NewEventHrIni');
        }
      });

      $('#dtfim').on('change',function(){
        if ( $(this).val() != '' ){
          dtfim = $(this).val();
          localStorage.setItem('NewEventDtFim',$(this).val());
        } else {
          localStorage.removeItem('NewEventDtFim');
        }
      });

      $('#hrfim').on('change',function(){
        if ( $(this).val() != '' ){
          hrfim = $(this).val();
          localStorage.setItem('NewEventHrFim',$(this).val());
        } else {
          localStorage.removeItem('NewEventHrFim');
        }
      });

      $('#desc').on('change',function(){
        if ( $(this).val() != '' ){
          desc = $(this).val();
          localStorage.setItem('NewEventDesc',$(this).val());
        } else {
          localStorage.removeItem('NewEventDesc');
        }
      });

      $('#de').on('change',function(){
        if ( $(this).val() != '' ){
          de = $(this).val();
          localStorage.setItem('NewEventDe',$(this).val());
        } else {
          localStorage.removeItem('NewEventDe');
        }
      });

      $('#ate').on('change',function(){
        if ( $(this).val() != '' ){
          ate = $(this).val();
          localStorage.setItem('NewEventAte',$(this).val());
        } else {
          localStorage.removeItem('NewEventAte');
        }
      });

      $('#priv').on('change',function(){
        priv = $(this).val();
        localStorage.setItem('NewEventPri',$(this).val());
      });

      $('#public').on('change',function(){
        pub = $(this).val();
        if ( $(this).val() == "on" ){
          localStorage.setItem('NewEventPerm',true);
        } else {
          localStorage.setItem('NewEventPerm',false);
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

var i=0;
var nome = '';
var lat = '';
var lng = '';
var dtini = '';
var hrini = '';
var dtfim = '';
var hrfim = '';
var desc = '';
var de = '';
var ate = '';
var priv = 0;
var pub = 0;
var img = '';
var t = [];
var tags = 0;
var it = [];
var o = [];
var io = [];
var org = 0;

autosize($('textarea'));

insertLayout('lNome','nome','');
insertLayout('lLocal','local','');
insertLayout('lDtini','dtini','');
insertLayout('lHrini','hrini','');
insertLayout('lDtfim','dtfim','');
insertLayout('lHrfim','hrfim','');
insertLayout('lDesc','desc','');
insertLayout('lTipo','tipo','');
insertLayout('lOrg','org','');
insertLayout('lDe','de','');
insertLayout('lAte','ate','');
insertLayout('lPriv','priv','');

$('#check').on('click',function(){
  if($('#check').is(':checked')){
    $('#dt_fim').show();
    $('#hr_fim').show();
  } else {
    $('#dt_fim').hide();
    $('#dt_fim').val('');
    $('#hr_fim').hide();
    $('#hr_fim').val('');
    dtfim = '';
    hrfim = '';
    localStorage.removeItem('NewEventDtFim');
    localStorage.removeItem('NewEventHrFim');
  }
});

$.ajax({
  type: "POST",
  url: "http://usevou.com/app/event.php",
  data: {
      'q': 'tag'
  },
  async: true,
  dataType: "json",
  success: function (json) {
    if (json[0]['res'] == 1){
      html = '';
      ok = false;
      if ( localStorage.getItem('NewEventTags') != null ){
        it = localStorage.getItem('NewEventTags').split(',');
        if ( it.length > 0 ){
          ok = true;
          $('#table_tags').html('');
          tags = it.length;
        }
      }
      for ( var i=0;i<json.length;i++ ){
        var id = json[i]["id"];
        var nome = json[i]["nome"];
        if ( ok ){
          for ( var j=0;j<it.length;j++ ){
            if ( it[j] == id ){
              break;
            }
          }
        } else {
          j = 0;
        }
        if ( j == it.length ){
          html += "<option value='"+nome+"' id='"+id+"'>";
        } else {
          $('#table_tags').append('<div class="tag" id="tag'+id+'"><span>#'+nome+'</span><img src="../img/sets/ic_cancel.png" onclick="removeTag('+id+',\''+nome+'\')"></div>');
        }
        var tag = [id,nome];
        t.push(tag);
      }
      $('#tags').html(html);
    }
  },error: function(xhr,e,t){
    console.log(xhr.responseText);
  }
});

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
      ok = false;
      if ( localStorage.getItem('NewEventOrg') != null ){
        io = localStorage.getItem('NewEventOrg').split(',');
        if ( io.length > 0 ){
          ok = true;
          $('#table_org').html('');
          org = io.length;
        }
      }
      for ( var i=0;i<json.length;i++ ){
        var id = json[i]["id"];
        var foto = json[i]["foto"];
        var nome = json[i]["nome"];
        if ( ok ){
          for ( var j=0;j<io.length;j++ ){
            if ( io[j] == id ){
              break;
            }
          }
        } else {
          j = 0;
        }
        if ( j == io.length ){
          html += '<li id="'+id+'" onclick="$(\'#org\').val(\''+nome+'\');$(\'#list_org\').hide()"><img src="'+foto+'"><span>'+nome+'</span></li>';
          var orga = [id,foto,nome];
          o.push(orga);
        } else {
          $('#table_org').append('<div class="organizador" id="o'+id+'"><img src="'+foto+'"><span>'+nome+'</span><img onclick="removeOrg('+id+',\''+foto+'\',\''+nome+'\')" src="../img/sets/ic_exit.png"></div>');
        }
      }
      $('#ul_org').html(html);
    }
  },error: function(xhr,e,t){
    console.log(xhr.responseText);
  }
});

function cadtag(){
  var value = $('#tipo').val();
  var id = 0;
  if ( value != '' ){
    if ( tags == 0 ){
      $('#table_tags').html('');
    }
    tags++;
    for ( var i=0;i<t.length;i++ ){
      if ( value == t[i][1]  ){
        id = t[i][0];
        break;
      }
    }
    if ( i == t.length ){
      $.ajax({
        type: "POST",
        url: "http://usevou.com/app/event.php",
        data: {
            'q': 'cadtag',
            'nome': value
        },
        async: true,
        dataType: "json",
        success: function (json) {
          if (json[0]['res'] == 1){
            $('#table_tags').append('<div class="tag" id="tag'+json[0]['id']+'"><span>#'+value+'</span><img src="../img/sets/ic_cancel.png" onclick="removeTag('+json[0]['id']+',\''+value+'\')"></div>');
            it.push(json[0]['id']);
            localStorage.setItem('NewEventTags',it);
          }
        },error: function(xhr,e,t){
          console.log(xhr.responseText);
        }
      });
    } else {
      $('#table_tags').append('<div class="tag" id="tag'+id+'"><span>#'+value+'</span><img src="../img/sets/ic_cancel.png" onclick="removeTag('+id+',\''+value+'\')"></div>');
      it.push(id);
      localStorage.setItem('NewEventTags',it);
      $('#tags #'+id).remove();
    }
    $('#tipo').val('');
  }
}

function removeTag(id, nome){
  $('#tag'+id).remove();
  $('#tags').append("<option value='"+nome+"' id='"+id+"'>");
  tags--;
  for ( var i=0;i<it.length;i++ ){
    if ( id == it[i] ){
      break;
    }
  }
  it.splice(i,1);
  localStorage.setItem('NewEventTags',it);
  if(tags == 0){
    $('#table_tags').html('Nenhuma tag adicionada.');
  }
}

function removeOrg(id, foto, nome){
  $('#o'+id).remove();
  o.push([id,foto,nome]);
  $('#ul_org').append('<li id="'+id+'" onclick="$(\'#org\').val(\''+nome+'\');$(\'#list_org\').hide()"><img src="'+foto+'"><span>'+nome+'</span></li>');
  org--;
  for ( var i=0;i<io.length;i++ ){
    if ( id == io[i] ){
      break;
    }
  }
  io.splice(i,1);
  localStorage.setItem('NewEventOrg',io);
  if(org == 0){
    $('#table_org').html('<div style="padding:5%;">Nenhum organizador adicionado</div>');
  }
}

function cadorg(){
  var value = $('#org').val();
  var id = 0;
  var foto = null;
  if ( value != '' ){
    for ( var i=0;i<o.length;i++ ){
      if ( value == o[i][2]  ){
        id = o[i][0];
        foto = o[i][1];
        break;
      }
    }
    if ( i != o.length ){
      if ( org == 0 ){
        $('#table_org').html('');
      }
      org++;
      $('#table_org').append('<div class="organizador" id="o'+id+'"><img src="'+foto+'"><span>'+value+'</span><img onclick="removeOrg('+id+',\''+foto+'\',\''+value+'\')" src="../img/sets/ic_exit.png"></div>');
      io.push(id);
      localStorage.setItem('NewEventOrg',io);
      $('#ul_org #'+id).remove();
      o.splice(i,1);
    }
    $('#org').val('');
    $('#ul_org li').show();
  }
}

$('#lPriv').css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});

function insertLayout(idL, idI,val){
  $('#'+idL).on('click',function(){$('#'+idI).focus();});
  $('#'+idI).on('focus',function(){
    $('#'+idL).css({'font-size':'1em','margin-top':'-5%','color':'#652C90'});
    if ( idI == 'nome' ){
      $('#conteudo').animate({
        scrollTop: 200
      }, 1000);
    } else if ( idI == 'local' ){
      window.location.href = "switchLocation.html";
    } else if ( idI == 'desc' ){
      var h = $('#laynome').outerHeight() + $('#laydt_ini').outerHeight() + $('#laycheck').outerHeight() + $('#dt_fim').outerHeight();
      $('#conteudo').animate({
        scrollTop: 200 + h
      }, 1000);
    } else if ( idI == 'tipo' ){
      var h = $('#laynome').outerHeight() + $('#laydt_ini').outerHeight() + $('#laycheck').outerHeight() + $('#dt_fim').outerHeight() + $('#laydesc').outerHeight();
      $('#conteudo').animate({
        scrollTop: 200 + h
      }, 1000);
    } else if ( idI == 'org' ){
      var h = $('#laynome').outerHeight() + $('#laydt_ini').outerHeight() + $('#laycheck').outerHeight() + $('#dt_fim').outerHeight() + $('#laydesc').outerHeight() + $('#laytag').outerHeight();
      $('#conteudo').animate({
        scrollTop: 200 + h
      }, 1000);
    } else if ( idI == 'de' || idI == 'ate' ){
      var h = $('#laynome').outerHeight() + $('#laydt_ini').outerHeight() + $('#laycheck').outerHeight() + $('#dt_fim').outerHeight() + $('#laydesc').outerHeight() + $('#laytag').outerHeight() + $('#layorg').outerHeight();
      $('#conteudo').animate({
        scrollTop: 200 + h
      }, 1000);
    }
  });
  $('#'+idI).on('focusout',function(){
    if ( $('#'+idI).val() == val ){
      $('#'+idL).css({'font-size':'1.5em','margin-top':'0%','color':'black'});
      $('#conteudo').css('height','90%');
      if ( idI == 'org' ){
        $('#list_org').hide();
      }
    }
  });
}

app.initialize();

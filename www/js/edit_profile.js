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
      $('#confirm').on('click',updateProfile);

      createInput('nome');
      createInput('date');
      createInput('cidade');
      createInput('rel');
      createInput('gen');
      createInput('int');
      createInput('desc');
      createInput('rede');

      window.addEventListener('native.keyboardshow', keyboardShowHandler);

      function keyboardShowHandler(e){
        var key = e.keyboardHeight;
        $('#conteudo').css('height','calc(90% - '+key+'px)');
      }

      window.addEventListener('native.keyboardhide', keyboardHideHandler);

      function keyboardHideHandler(e){
        $('#conteudo').css('height','90%');
      }
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
var perfil = window.localStorage.getItem('PerfilUsu');
var capa = window.localStorage.getItem('CapaUsu');
var nome = window.localStorage.getItem('NomeUsu');
var date = window.localStorage.getItem('DataUsu');
var cidade = window.localStorage.getItem('CidadeUsu');
var rel = "";
var idrel = null;
var genero = null;
var interesse = null;
var desc = "";
var r = [];
var c = [];
var s = [];
var ms = [];
var t = [];
var tags = 0;
var it = [];

function createRel(){
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/profile.php",
    data: {
        'q': 'rel'
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
        html = "<option value='0' id='0'></option>";
        for(var i=0;i<json.length;i++){
          html += "<option value='"+json[i]["id"]+"' id='"+json[i]["id"]+"'>"+json[i]["nome"]+"</option>";
          r[json[i]["id"]] = json[i]["nome"];
        }
        $('#rel').html(html);
      }
    },error: function(xhr,e,t){
      console.log(xhr.responseText);
    }
  });
}

function createCity(){
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/profile.php",
    data: {
        'q': 'city'
    },
    async: true,
    dataType: "json",
    success: function (json) {
      if (json[0]['res'] == 1){
        html = "";
        for(var i=0;i<json.length;i++){
          html += "<option value='"+json[i]["nome"]+"' id='"+json[i]["id"]+"'>";
          c[json[i]["id"]] = json[i]["nome"];
        }
        $('#cityname').html(html);
      }
    },error: function(xhr,e,t){
      console.log(xhr.responseText);
    }
  });
}

function createTag(){
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
        if ( it.length > 0 ){
          ok = true;
          $('#table_tags').html('');
          tags = it.length;
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
}

function cadtag(){
  var value = $('#int').val();
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
          }
        },error: function(xhr,e,t){
          console.log(xhr.responseText);
        }
      });
    } else {
      $('#table_tags').append('<div class="tag" id="tag'+id+'"><span>#'+value+'</span><img src="../img/sets/ic_cancel.png" onclick="removeTag('+id+',\''+value+'\')"></div>');
      it.push(id);
      $('#tags #'+id).remove();
    }
    $('#int').val('');
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
  if(tags == 0){
    $('#table_tags').html('Nenhuma tag adicionada.');
  }
}

$("#nome").html(nome);
$("#date").html(date);
if ( cidade != 'null' ){
  $("#cidade").html(cidade);
} else {
  cidade = null;
  $("#cidade").html("Você não declarou sua cidade.");
  $('#cidade').css("color","#828383");
}

$.ajax({
  type: "POST",
  url: "http://usevou.com/app/profile.php",
  data: {
      'q': 'about',
      'id': window.localStorage.getItem('IdUsu')
  },
  async: true,
  dataType: "json",
  success: function (json) {
    console.log(json);
    if (json[0]['res'] == 1){
      idrel = json[0]['idrelacionamento'];
      rel = json[0]['relacionamento'];
      desc = json[0]['descricao'];
      genero = json[0]['genero'];
      interesse = json[0]['t'];
      if ( rel != null ){
        $('#rel').html(rel);
      } else {
        $('#rel').html("Você não declarou seu relacionamento.");
        $('#rel').css("color","#828383");
      }
      if ( desc != null ){
        $('#desc').html(desc);
      } else {
        $('#desc').html("Adicione uma descrição sua.");
        $('#desc').css("color","#828383");
      }
      if ( genero != null ){
        if ( genero == 0 )
          $('#gen').html('Masculino');
        else if ( genero == 1 )
          $('#gen').html('Feminino');
      } else {
        $('#gen').html("Você não declarou seu gênero.");
        $('#gen').css("color","#828383");
      }
      if ( interesse != 0 ){
        it = interesse.split(',');
        var nt = json[0]['nt'].split(',');
        $('#table_tags').html('');
        tags = it.length;
        for ( var i=0;i<it.length;i++ ){
          $('#table_tags').append('<div class="tag" id="tag'+it[i]+'"><span>#'+nt[i]+'</span></div>');
          var tag = [it[i],nt[i]];
          t.push(tag);
        }
      }
      /*if ( json[0]['social'] > 0 ){
        html = "";
        for(var i=0;i<json[0]['social'];i++){
          html += "<div style='float:left;margin-bottom:5%;'><img src='../img/sets/"+json[0][i]['img']+"' class='icon_rede'><div style='margin-top:3%'>"+json[0][i]['conteudo']+"</div></div>";
        }
        $('#rede').html(html);
        for(var i=0;i<json[0]['social'];i++){
          ms[json[0][i]['id']]['conteudo'] = json[0][i]['conteudo'];
        }
      } else {
        $('#rede').html("Você não declarou suas redes sociais.");
        $('#rede').css("color","#828383");
      }*/
    }
  },error: function(xhr,e,t){
    console.log(xhr.responseText);
  }
});

function insertLayout(idI){
  $('#'+idI).on('focus',function(){
    if ( idI == 'nome' ){
      $('#conteudo').animate({
        scrollTop: 19.3125
      }, 1000);
    } else if ( idI == 'date' ){
      $('#conteudo').animate({
        scrollTop: 110.3125
      }, 1000);
    } else if ( idI == 'cidade' ){
      $('#conteudo').animate({
        scrollTop: 201.3125
      }, 1000);
    } else if ( idI == 'desc' ){
      $('#conteudo').animate({
        scrollTop: 565.3125
      }, 1000);
    }
  });
}

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

function createInput(name){
  $('#edit_'+name).on('click',function(){
    $('#cancel'+name).off('click');
    $('#confirm_'+name).off('click');
    $('#'+name).remove();
    if ( name == 'nome' ){
      $('#lay'+name).append('<input type="text" name="'+name+'" id="'+name+'" autocomplete="off">');
      $('#'+name).css({'width':'80%','padding-right':'20%'});
      insertLayout(name);
      $('#'+name).focus().val(nome);
    } else if ( name == 'date' ){
      $('#lay'+name).append('<input type="text" name="'+name+'" id="'+name+'" autocomplete="off">');
      $('#'+name).css({'width':'80%','padding-right':'20%'});
      $("#date").mask("99/99/9999");
      insertLayout(name);
      $('#'+name).focus().val(date);
    } else if ( name == 'cidade' ){
      $('#lay'+name).append('<input type="text" name="'+name+'" id="'+name+'" autocomplete="off" list="cityname"><datalist id="cityname"></datalist>');
      createCity();
      $('#'+name).css({'width':'80%','padding-right':'20%'});
      insertLayout(name);
      if ( cidade != 'null' )
        $('#'+name).focus().val(cidade);
      else {
        $('#'+name).focus();
      }
    } else if ( name == 'rel' ){
      $('#lay'+name).append('<select name="rel" id="rel"></select>');
      createRel();
      insertLayout(name);
      $('#'+name).css('width','80%');
      if ( rel != null ){
        $('#'+idrel).attr('selected','selected');
      }
    } else if ( name == 'gen' ){
      $('#lay'+name).append('<select name="gen" id="gen"><option value="null"></option><option value="0" id="gen0">Masculino</option><option value="1" id="gen1">Feminino</option></select>');
      insertLayout(name);
      $('#'+name).css('width','80%');
      if ( genero != null ){
        $('#gen'+genero).attr('selected','selected');
      }
    } else if ( name == 'int' ){
      $('#input_tag').html('<input type="text" name="int" id="int" autocomplete="off" list="tags"><datalist id="tags"></datalist>');
      createTag();
      insertLayout(name);
      $('#'+name).css({'width':'80%','padding-right':'20%'});
    } else if ( name == 'desc' ){
      $('#lay'+name).append('<textarea name="desc" id="desc"></textarea>');
      $('#'+name).css({'width':'80%','padding-right':'20%'});
      insertLayout(name);
      if ( desc != null ){
        $('#'+name).focus().val(desc);
      } else {
        $('#'+name).focus();
      }
    } else if ( name == 'rede' ){
      $('#lay'+name).append('<div id="rede_all"></div>');
      createSocial();
      insertLayout(name);
    }
    $('#see_'+name).css('width','14%');
    $('#edit_'+name).hide();
    $('#confirm_'+name).show();
    $('#cancel_'+name).show();
    $('#cancel_'+name).on('click',function(){
      $('#'+name).remove();
      $('#lay'+name).append('<div class="txt_input" id="'+name+'"></div>');
      $('#'+name).css({'width':'90%','padding-right':'10%'});
      $('#see_'+name).css('width','7%');
      $('#edit_'+name).show();
      $('#confirm_'+name).hide();
      $('#cancel_'+name).hide();
      if ( name == 'nome' ){
        $('#'+name).html(nome);
      } else if ( name == 'date' ){
        $('#'+name).html(date);
      } else if ( name == 'cidade' ){
        if ( cidade == 'null' ){
          $('#'+name).html("Você não declarou sua cidade.");
          $('#'+name).css("color","#828383");
        } else {
          $('#'+name).html(cidade);
        }
      } else if ( name == 'rel' ){
        if ( rel == null ){
          $('#'+name).html("Você não declarou seu relacionamento.");
          $('#'+name).css("color","#828383");
        } else {
          $('#'+name).html(rel);
        }
      } else if ( name == 'gen' ){
        if ( genero == null ){
          $('#'+name).html("Você não declarou seu gênero.");
          $('#'+name).css("color","#828383");
        } else {
          if ( genero == 0 )
            $('#'+name).html('Masculino');
          else if ( genero == 1 )
            $('#'+name).html('Feminino');
        }
      } else if ( name == 'int' ){
        $('#'+name).remove();
        $('.tag img').remove();
      } else if ( name == 'desc' ){
        if ( desc == null ){
          $('#'+name).html("Adicione uma descrição sua.");
          $('#'+name).css("color","#828383");
        } else {
          $('#'+name).html(desc);
        }
      }
    });
    $('#confirm_'+name).on('click',function(){
      var b = $('#'+name).val();
      if ( name == 'nome' ){
        if ( b == "" ){
          navigator.notification.alert(
            'Seu nome não pode ficar em branco.',  // message
            function(){$('#nome').focus();},         // callback
            'Ops!',            // title
            'OK'                  // buttonName
          );
        } else {
          nome = trim(b);
          $('#'+name).remove();
          $('#lay'+name).append('<div class="txt_input" id="'+name+'"></div>');
          $('#'+name).css({'width':'90%','padding-right':'10%'});
          $('#see_'+name).css('width','7%');
          $('#edit_'+name).show();
          $('#confirm_'+name).hide();
          $('#cancel_'+name).hide();
          $('#'+name).html(nome);
        }
      } else if ( name == 'date' ){
        if ( b == "" ){
          navigator.notification.alert(
            'Sua data de nascimento não pode ficar em branco.',  // message
            function(){$('#date').focus();},         // callback
            'Ops!',            // title
            'OK'                  // buttonName
          );
        } else {
          date = b;
          $('#'+name).remove();
          $('#lay'+name).append('<div class="txt_input" id="'+name+'"></div>');
          $('#'+name).css({'width':'90%','padding-right':'10%'});
          $('#see_'+name).css('width','7%');
          $('#edit_'+name).show();
          $('#confirm_'+name).hide();
          $('#cancel_'+name).hide();
          $('#'+name).html(date);
        }
      } else if ( name == 'cidade' ){
        $('#'+name).remove();
        $('#lay'+name).append('<div class="txt_input" id="'+name+'"></div>');
        $('#'+name).css({'width':'90%','padding-right':'10%'});
        $('#see_'+name).css('width','7%');
        $('#edit_'+name).show();
        $('#confirm_'+name).hide();
        $('#cancel_'+name).hide();
        if ( b == '' ){
          cidade = null;
          $('#'+name).html("Você não declarou sua cidade.");
          $('#'+name).css("color","#828383");
        } else {
          cidade = trim(b);
          $('#'+name).html(cidade);
        }
      } else if ( name == 'rel' ){
        $('#'+name).remove();
        $('#lay'+name).append('<div class="txt_input" id="'+name+'"></div>');
        $('#'+name).css({'width':'90%','padding-right':'10%'});
        $('#see_'+name).css('width','7%');
        $('#edit_'+name).show();
        $('#confirm_'+name).hide();
        $('#cancel_'+name).hide();
        if ( b == 0 ){
          idrel = null;
          rel = null;
          $('#'+name).html("Você não declarou seu relacionamento.");
          $('#'+name).css("color","#828383");
        } else {
          idrel = b;
          rel = r[b];
          $('#'+name).html(rel);
        }
      } else if ( name == 'gen' ){
        $('#'+name).remove();
        $('#lay'+name).append('<div class="txt_input" id="'+name+'"></div>');
        $('#'+name).css({'width':'90%','padding-right':'10%'});
        $('#see_'+name).css('width','7%');
        $('#edit_'+name).show();
        $('#confirm_'+name).hide();
        $('#cancel_'+name).hide();
        if ( b == 'null' ){
          genero = null;
          $('#'+name).html("Você não declarou seu gênero.");
          $('#'+name).css("color","#828383");
        } else {
          genero = b;
          if ( genero == 0 )
            $('#'+name).html('Masculino');
          else if ( genero == 1 )
            $('#'+name).html('Feminino');
        }
      } else if ( name == 'int' ){
        cadtag();
      } else if ( name == 'desc' ){
        $('#'+name).remove();
        $('#lay'+name).append('<div class="txt_input" id="'+name+'"></div>');
        $('#'+name).css({'width':'90%','padding-right':'10%'});
        $('#see_'+name).css('width','7%');
        $('#edit_'+name).show();
        $('#confirm_'+name).hide();
        $('#cancel_'+name).hide();
        if ( b == "" ){
          desc = null
          $('#'+name).html("Adicione uma descrição sua.");
          $('#'+name).css("color","#828383");
        } else {
          desc = b;
          $('#'+name).html(desc);
        }
      }
    });
  });
}

function updateProfile(){
  var d = date.substr(0,2);
  var m = date.substr(3,2);
  var y = date.substr(6,4);
  cordova.plugin.pDialog.init({
    theme : 'HOLO_LIGHT',
    progressStyle : 'SPINNER',
    cancelable : true,
    title : 'Aguarde...',
    message : 'Salvando as alterações.'
  });
  alert(it);
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/profile.php",
    data: {
        'q': 'update',
        'id': window.localStorage.getItem('IdUsu'),
        'nome': nome,
        'date': y+"-"+m+"-"+d,
        'cidade': cidade,
        'rel': idrel,
        'genero': genero,
        'interesse': interesse,
        'desc': desc,
        'tags': it
    },
    async: true,
    dataType: "json",
    success: function (json) {
      cordova.plugin.pDialog.dismiss();
      if (json[0]['res'] == 1){
        window.localStorage.setItem('NomeUsu',nome);
        navigator.notification.alert(
          'Perfil atualizado com sucesso',  // message
          function(){window.history.back();},         // callback
          'Concluído',            // title
          'OK'                  // buttonName
        );
      }
    },error: function(xhr,e,t){
      cordova.plugin.pDialog.dismiss();
      alert(xhr.responseText);
    }
  });
}

app.initialize();

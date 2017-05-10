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

      switchPage(page);
      $('#next').on('touchstart',function(){
        $('#next').css('background-color','rgba(101,44,144,0.8)');
      });
      $('#next').on('touchend',function(){
        $('#next').css('background-color','#652C90');
      });

      $('#prev').on('touchstart',function(){
        $('#prev').css('background-color','rgba(39,169,225,0.8)');
      });
      $('#prev').on('touchend',function(){
        $('#prev').css('background-color','#27A9E1');
      });

      $('#next').on('click',function(){
        switch(page){
          case 0:
            n = trim($('#nome').val());
            if ( n == "" ){
              $('#erro').html('* Digite seu nome.');
            } else if ( validarNome(n) ){
              $('#erro').html('* Contém caracteres inválidos.');
            } else {
              $('#erro').html('');
              nome = n;
              page++;
              switchPage(page,data);
            }
            break;
          case 1:
            d = trim($('#data').val());
            if ( n == "" ){
              $('#erro').html('* Digite sua data de nascimento.');
            } else if ( validarData(d) ){
              $('#erro').html('* Essa data não existe.');
            } else {
              $('#erro').html('');
              var dia = parseInt(d.substr(0,2));
              var mes = parseInt(d.substr(3,2));
              var ano = parseInt(d.substr(6,4));
              data = ano+'-'+mes+'-'+dia;
              page++;
              switchPage(page,cidade);
            }
            break;
          case 2:
            e = trim($('#cidade').val());
            if ( e != "" ){
              cidade = e;
            } else {
              cidade = null;
            }
            page++;
            switchPage(page,email);
            break;
          case 3:
            e = trim($('#email').val());
            if ( e == "" ){
              $('#erro').html('* Digite seu e-mail.');
            } else if ( validarEmail(e) ){
              $('#erro').html('* E-mail inválido.');
            } else if ( validarEmailBd(e) ){
              $('#erro').html('* E-mail já cadastrado.');
            } else {
              $('#erro').html('');
              email = e;
              page++;
              switchPage(page,fone);
            }
            break;
          case 4:
            f = trim($('#fone').val());
            if ( f == "" ){
              $('#erro').html('* Digite o número do seu celular.');
            } else if ( validarFoneBd(f) ){
              $('#erro').html('* Número de celular já cadastrado.');
            } else {
              $('#erro').html('');
              fone = f;
              page++;
              switchPage(page,login);
            }
            break;
          case 5:
            var imageData = $('.image-editor').cropit('export');
            if ( imageData != undefined ){
              foto = imageData;
            } else {
              foto = 'profile/ft_perfil/padrao.png';
            }
            page++;
            switchPage(page);
            break;
          case 6:
            l = trim($('#login').val());
            if ( l == "" ){
              $('#erro').html('* Escolha um nome de usuário.');
            } else if ( validarUsuario(l) ){
              $('#erro').html('* Contém caracteres inválidos.');
            } else {
              $('#erro').html('');
              login = l;
              page++;
              switchPage(page);
            }
            break;
          case 7:
            s1 = $('#senha1').val();
            s2 = $('#senha2').val();
            if ( s1 == "" ){
              $('#erro').html('* Escolha uma senha.');
            } else if ( s2 == "" ){
              $('#erro').html('* Repita a senha.');
            } else if ( s1 != s2 ){
              $('#erro').html('* As senhas não conferem.');
            } else {
              $('#erro').html('');
              senha = s1;
              if(cadUsuario()){
                window.localStorage.setItem('session', true);
                window.localStorage.setItem('login', login);
                window.location.href = "main.html";
              }
            }
            break;
        }
      });

      $('#prev').on('click',function(){
        switch(page){
          case 1:
            page--;
            switchPage(page,nome);
            break;
          case 2:
            page--;
            switchPage(page,data);
            break;
          case 3:
            page--;
            switchPage(page,cidade);
            break;
          case 4:
            page--;
            switchPage(page,email);
            break;
          case 5:
            page--;
            switchPage(page,fone);
            break;
          case 6:
            page--;
            switchPage(page,foto);
            break;
          case 7:
            page--;
            switchPage(page,login);
            break;
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
        var h = $('#bottom').height();
        $('#conteudo').css('height','calc(90% - '+h+'px)');
        $('#bottom').css('bottom','0px');
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

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

var page = 0;
var nome;
var data;
var cidade;
var c = [];
var email;
var fone;
var foto;
var login;
var senha;
var i1 = 0;
var i2 = 0;

function createCity(){
  $('#erro').html('Aguarde, carregando cidades.');
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/profile.php",
    data: {
        'q': 'city'
    },
    async: true,
    dataType: "json",
    success: function (json) {
      $('#erro').html('');
      if (json[0]['res'] == 1){
        html = "";
        for(var i=0;i<json.length;i++){
          html += "<option value='"+json[i]["nome"]+"' id='"+json[i]["id"]+"'>";
          c[json[i]["id"]] = json[i]["nome"];
        }
        $('#cityname').html(html);
      }
    },error: function(xhr,e,t){
      $('#erro').html('Erro ao carregar as cidades.');
      alert(xhr.responseText);
    }
  });
}

function switchPage(i,val){
  $('#conteudo').html("<img src='img/sets/loading.gif' id='loading'>");
  switch(i){
    case 0:
      $('#prev').css('display','none');
      $('#next').css('width','90%');
      $('#conteudo').html('<div class="layout_input"><div class="label_input" id="lNome">Nome</div><input type="text" name="nome" id="nome" autocomplete="off"></div><div id="erro"></div>');
      $('#lNome').on('click',function(){$('#nome').focus();});
      insertLayout('lNome','nome','');
      if (val)
        $('#nome').focus().val(val);
      break;
    case 1:
      $('#next').html('Próximo');
      $('#prev').css('display','block');
      $('#next').css('width','40%');
      $('#conteudo').html('<div class="layout_input"><div class="label_input" id="lData">Data de nascimento</div><input type="text" name="data" id="data" autocomplete="off"></div><div id="erro"></div>');
	  $('#data').mask('99/99/9999');
      $('#lData').on('click',function(){$('#data').focus();});
      insertLayout('lData','data','__/__/____');
      if (val)
        $('#data').focus().val(val);
      break;
    case 2:
      $('#next').html('Pular');
      $('#prev').css('display','block');
      $('#next').css('width','40%');
      $('#conteudo').html('<div class="layout_input"><div class="label_input" id="lCidade">Cidade</div><input type="text" name="cidade" id="cidade" autocomplete="off" list="cityname"><datalist id="cityname"></datalist></div><div id="erro"></div>');
      createCity();
      $('#cidade').keyup(function(){
        if ($('#cidade').val() == ''){
          $('#next').html('Pular');
        } else {
          $('#next').html('Próximo');
        }
      });
      $('#lCidade').on('click',function(){$('#cidade').focus();});
      insertLayout('lCidade','cidade','');
      if (val){
        $('#cidade').focus().val(val);
        $('#next').html('Próximo');
      }
      break;
    case 3:
      $('#next').html('Próximo');
      $('#conteudo').html('<div class="layout_input"><div class="label_input" id="lEmail">E-mail</div><input type="email" name="email" id="email" autocomplete="off"></div><div id="erro"></div>');
      $('#lEmail').on('click',function(){$('#email').focus();});
      insertLayout('lEmail','email','');
      if (val)
        $('#email').focus().val(val);
      break;
    case 4:
      $('#next').html('Próximo');
      $('#conteudo').css('overflow-y','auto');
      $('#conteudo').css('overflow-x','auto');
      $('#conteudo').html('<div class="layout_input"><div class="label_input" id="lFone">Celular</div><input type="text" name="fone" id="fone" autocomplete="off"></div><div id="erro"></div>');
	  $('#fone').mask('(99) 99999-9999');
      $('#lFone').on('click',function(){$('#fone').focus();});
      insertLayout('lFone','fone','(__) _____-____');
      if (val)
        $('#fone').focus().val(val);
      break;
    case 5:
      $('#next').html('Pular');
      $('#conteudo').css('overflow-y','hidden');
      $('#conteudo').css('overflow-x','hidden');
      $('#conteudo').html('<div class="image-editor">'+
                            '<label for="input" id="button">Selecionar imagem</label>'+
                            '<input type="file" class="cropit-image-input" accept="image/*" id="input">'+
                            '<div class="cropit-preview"></div>'+
                            '<input type="range" class="cropit-image-zoom-input" value="0">'+
                          '</div>');
      $('#input').on('change',function(){
        $('#next').html('Próximo');
      });
      $('.cropit-preview').height($('.cropit-preview').width());
      $('.cropit-preview').css('margin-top','calc(50% - '+($('.cropit-preview').height()/4)+'px)');
      $('.cropit-preview').css('border-radius','50%');
      $('.image-editor').cropit({
        exportZoom: 1.5,
        imageBackground: true
      });
      break;
    case 6:
      $('#next').html('Próximo');
      $('#conteudo').css('overflow-y','auto');
      $('#conteudo').css('overflow-x','auto');
      $('#conteudo').html('<div class="layout_input"><div class="label_input" id="lLogin">Usuário</div><input type="text" name="login" id="login" autocomplete="off"></div><div id="erro"></div>');
      $('#lLogin').on('click',function(){$('#login').focus();});
      insertLayout('lLogin','login','');
      if (val)
        $('#login').focus().val(val);
      break;
    case 7:
      $('#next').html('Cadastrar');
      $('#conteudo').html('<div class="layout_input"><div class="label_input" id="lSenha1">Senha</div><div class="see_pass" id="see1"><img src="img/sets/ic_see_password.png"></div><input type="password" name="senha1" id="senha1" autocomplete="off" style="padding-right:10%;width:76%;"></div>');
      $('#conteudo').append('<div class="layout_input"><div class="label_input" id="lSenha2">Repita a senha</div><div class="see_pass" id="see2"><img src="img/sets/ic_see_password.png"></div><input type="password" name="senha2" id="senha2" autocomplete="off" style="padding-right:10%;width:76%;"></div><div id="erro"></div>');
      $('#lSenha1').on('click',function(){$('#senha1').focus();});
      $('#lSenha2').on('click',function(){$('#senha2').focus();});
      $('#see1').on('click',function(){
        if (i1 == 0){
          $('#senha1').attr('type','text');
          $('#see img').attr('src','img/sets/ic_see_password_sel.png');
          $('#senha1').focus();
          i1=1;
        } else {
          $('#senha1').attr('type','password');
          $('#see img').attr('src','img/sets/ic_see_password.png');
          $('#senha1').focus();
          i1=0;
        }
      });
      $('#see2').on('click',function(){
        if (i2 == 0){
          $('#senha2').attr('type','text');
          $('#senha2').focus();
          i2=1;
        } else {
          $('#senha2').attr('type','password');
          $('#senha2').focus();
          i2=0;
        }
      });
      insertLayout('lSenha1','senha1','');
      insertLayout('lSenha2','senha2','');
      break;
  }
}

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

function validarNome(campo) {
  var regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
  if(campo.match(regex)) {
    return false;
  } else {
    return true;
  }
}

function validarUsuario(campo) {
  var regex = /^[a-zA-Z0-9._]+$/;
  console.log(campo.match(regex))
  if(campo.match(regex)) {
    return false;
  } else {
    return true;
  }
}

function validarData(campo){
  var dia = parseInt(campo.substr(0,2));
  var mes = parseInt(campo.substr(3,2));
  var ano = parseInt(campo.substr(6,4));
  if ( ano < new Date().getFullYear() ){
    switch(mes){
      case 2:
        if ( ano % 4 == 0 || ano % 400 == 0 ){
          if ( dia <= 29 ){
            return false;
          } else {
            return true;
          }
        } else {
          if ( dia <= 28 ){
            return false;
          } else {
            return true;
          }
        }
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        if ( dia <= 30 ){
          return false;
        } else {
          return true;
        }
        break;
      default:
        if ( dia <= 31 ){
          return false;
        } else {
          return true;
        }
        break;
    }
  } else {
    return true;
  }
}

function validarEmail(email){
    var exclude=/[^@\-\.\w]|^[_@\.\-]|[\._\-]{2}|[@\.]{2}|(@)[^@]*\1/;
    var check=/@[\w\-]+\./;
    var checkend=/\.[a-zA-Z]{2,3}$/;
    if(((email.search(exclude) != -1)||(email.search(check)) == -1)||(email.search(checkend) == -1)){return true;}
    else {return false;}
}

function validarEmailBd(email) {
  var have = true;
  cordova.plugin.pDialog.init({
    theme : 'HOLO_LIGHT',
    progressStyle : 'SPINNER',
    cancelable : true,
    title : 'Aguarde...',
    message : 'Veridicando e-mail.'
  });
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/usuario.php",
    data: {
        'q': 'email',
        'email': email
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

function validarLoginBd(login) {
  var have = true;
  cordova.plugin.pDialog.init({
    theme : 'HOLO_LIGHT',
    progressStyle : 'SPINNER',
    cancelable : true,
    title : 'Aguarde...',
    message : 'Verificando nome de usuário.'
  });
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/usuario.php",
    data: {
        'q': 'login',
        'login': login
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

function cadUsuario() {
  var idcidade = 0;
  var i=1;
  while(idcidade == 0){
    if ( c[i] == cidade )
      idcidade = i;
    i++;
  }
  var have = false;
  cordova.plugin.pDialog.init({
    theme : 'HOLO_LIGHT',
    progressStyle : 'SPINNER',
    cancelable : true,
    title : 'Aguarde...',
    message : 'Efetuando cadastro.'
  });
  $.ajax({
    type: "POST",
    url: "http://usevou.com/app/usuario.php",
    data: {
        'q': 'cad',
        'nome': nome,
        'data': data,
        'cidade': idcidade,
        'email': email,
        'fone': fone,
        'foto': foto,
        'login': login,
        'senha': senha,
        'key': null
    },
    async: false,
    dataType: "json",
    success: function (json) {
      cordova.plugin.pDialog.dismiss();
      if (json[0]['res'] == 1){
        have = true;
      }
    },error: function(xhr,e,t){
      cordova.plugin.pDialog.dismiss();
      alert(xhr.responseText);
    }
  });
  return have;
}

app.initialize();

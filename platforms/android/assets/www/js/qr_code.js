function createQR(){
  var d = new Date();
  var res = '[{"idusuario":"'+window.localStorage.getItem('IdUsu')+'","nome":"'+localStorage.getItem('NomeUsu')+'","valor":'+localStorage.getItem('valor')+',"time":"'+d.getTime()+'"}]';
  var options = {
    render: 'image',
    ecLevel: 'H',
    minVersion: 5,

    fill: '#000',
    background: null,

    text: res,
    size: $('#qr').width(),
    radius: 0.2,
    quiet: 1,

    mode: 4,

    mSize: 0.3,
    mPosX: 0.5,
    mPosY: 0.5,

    label: 'no label',
    fontname: 'sans',
    fontcolor: '#000',

    image: $('#img')[0]
  };

  $('#qr').empty().qrcode(options);
}
$(window).load(createQR);
setInterval(createQR,30000)
$('#back').on('click',function(){window.history.back();});
$('#nome').html(localStorage.getItem('NomeUsu'));
$('#valor').html("V$ "+localStorage.getItem('valor'));
$('#conteudo').css('height','calc(90% - '+($('#aviso').height()+($('#aviso').css('padding').substr(0,$('#aviso').css('padding').length - 2)*2))+'px)');

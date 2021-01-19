const linkServera = "http://localhost:3000";

let predmetiNiz = [];
let aktivnostiNiz = [];

$('#forma').on('submit', f => {
    f.preventDefault();
    dodajAktivnost();
})
function loudaj() {
    $.ajax({
        url: linkServera + '/v2/predmet', success: function (odgovor) {
            predmetiNiz = odgovor;
        }
    });
    $.ajax({
        url: linkServera + '/v2/aktivnost', success: function (odgovor) {
            aktivnostiNiz = odgovor;
        }
    });
}
function dodajAktivnost() {
    const forma = $('#forma').serializeArray();
    const aktivnostNova = {};
    function kreiraj(akt) {
        return $.post({
            url: linkServera + '/z3/aktivnost',
            data: akt,
        }).done((odgovor) => {
            $('#poruka-servera').html(odgovor.message);
            aktivnostiNiz.push(akt);
        }).fail((odgovor) => {
            $('#poruka-servera').html(odgovor.responseJSON.message);
        })
    }
   let i=0;
   while(i<forma.length){
      aktivnostNova[forma[i].name]=forma[i].value;
       i++;
   }
    const PostojiPredmet = predmetiNiz.findIndex(pred => pred.naziv === aktivnostNova.naziv) !== -1;
    if (!PostojiPredmet) {
        $.post({
            url: linkServera + '/v2/predmet',
            data: { naziv: aktivnostNova.naziv },
        }).done(() => {
            kreiraj(aktivnostNova).done(() => {
                predmetiNiz.push({ naziv: aktivnostNova.naziv });
            }).fail(() => {
                $.ajax({
                    url: `/v2/predmet/${aktivnostNova.naziv}`,
                    type: 'DELETE',
                    success: function () {
                        $('#poruka-servera').html("Aktivnost nije validna!");
                    }
                });
            })
        }).fail((odgovor) => {
            $('#poruka-servera').html(odgovor.responseJSON.message);
        })
    } else {
        kreiraj(aktivnostNova);
    }
}



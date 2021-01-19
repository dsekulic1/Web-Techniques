const linkServera = "http://localhost:3000";
let grupe = [];
function load() {
    $.ajax({ url: linkServera + '/v2/grupa' }).then(gr => {
        grupe = gr;

        const grupeSelect = document.getElementById("groups");
        grupeSelect.options.add(new Option("Odaberite grupu"));
        grupe.forEach(grupa => {
            grupeSelect.options.add(new Option(grupa.naziv, grupa.id));
        })
    });
}

$('#forma').on('submit', f => {
    f.preventDefault();
    dodajStudenta();
})

function dodajStudenta() {
    const forma = $('#forma').serializeArray();
    let grupaId = forma.find(polje => polje.name === "groups").value;
    let stringStudenti = forma.find(polje => polje.name === "studenti").value;
    stringStudenti = stringStudenti.split('\n');
    let studenti = [];
    for (let i = 0; i < stringStudenti.length; i++) {
        if (stringStudenti[i]) {
            let student = stringStudenti[i].split(',');
            let s = {
                ime: student[0].trim(),
                index: student[1].trim()
            };
            studenti.push(s);
        }
    }
    if (studenti.length > 0) {
        $.post({
            url: linkServera + '/v2/studenti',
            data: {
                studenti: studenti,
                grupaId: grupaId
            },
        }).then(response => {
            const poruke = response.poruke;

            if (poruke.length > 0) {
                let text = "";
                poruke.forEach(poruka => text += (poruka + '\n'));
                document.getElementById('studenti').value = text;
            }
        })
    }
}
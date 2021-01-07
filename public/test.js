window.alert=function(){};
let assert = chai.assert;
describe('raspored', function () {
  describe('iscrtajRaspored()', function () {
    it('Kreiranje raporeda od 6 redova', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
      var tabela = div.getElementsByTagName("table")[0];
      assert.equal(tabela.rows.length, 6, "Broj redova treba biti 6");
    });
    it('Prazan niz dana - greška', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, [], 8, 21);
      assert.equal(div.innerHTML, "Greška","Dani nisu dodani");
    });
    it('Teste greške za pogrešno unesene sate - prvi veći od drugog', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 12, 9);
      assert.equal(div.innerHTML, "Greška", "Sati nisu ispravni");
    });
    it('Teste greške za pogrešno unesene sate - neispravan format', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 12.3, 19);
      assert.equal(div.innerHTML, "Greška", "Sati nisu ispravni");
    });
    it('Teste greške za pogrešno unesene sate - sati manji od nule', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 12, -19);
      assert.equal(div.innerHTML, "Greška", "Sati nisu ispravni");
    });
    it('Početni sat 1', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 8, 21);
      var tabela = div.getElementsByTagName("table")[0];
      var redovi = tabela.getElementsByTagName("tr");
      assert.equal(redovi[0].cells[0].textContent, "08:00", "Početni sat se ne poklapa");
    });
    it('Početni sat 2', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 24);
      var tabela = div.getElementsByTagName("table")[0];
      var redovi = tabela.getElementsByTagName("tr");
      assert.equal(redovi[0].cells[0].textContent, "07:00", "Početni sat se ne poklapa");
    });
    it('Sat poslije neparnog prvog sata', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 24);
      var tabela = div.getElementsByTagName("table")[0];
      var redovi = tabela.getElementsByTagName("tr");
      assert.equal(redovi[0].cells[1].textContent, "08:00", "Početni sat se ne poklapa");
    });
    it('Sat kraj1', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 24);
      var tabela = div.getElementsByTagName("table")[0];
      var redovi = tabela.getElementsByTagName("tr");
      assert.equal(redovi[0].lastChild.innerHTML, "23:00", "Krajnji sat se ne poklapa");
    });
    it('Sat kraj2', function () {
      var div = document.createElement("div");
      raspored.iscrtajRaspored(div, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 23);
      var tabela = div.getElementsByTagName("table")[0];
      var redovi = tabela.getElementsByTagName("tr");
      assert.equal(redovi[0].lastChild.innerHTML, "", "Krajnji sat se ne poklapa");
    });
  });
  describe('dodajAktivnost()', function () {
    it('Alert u slučaju da nema kreiranog rasporeda', function () {
      let div1 = document.createElement("div");
      let dodaj=raspored.dodajAktivnost(div1,"WT","predavanje",9,12,"Ponedjeljak");
      assert.equal(dodaj,"Greška - raspored nije kreiran", "Kreirajte raspored prije dodavanja u njega!");
    });
    it('Pogrešno vrijeme početka rasporeda', function () {
      let div1 = document.createElement("div");
      raspored.iscrtajRaspored(div1, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 23);
      let dodaj=raspored.dodajAktivnost(div1,"WT","predavanje",6,12,"Ponedjeljak");
      assert.equal(dodaj,"Greška - aktivnost izlazi izvan okvira rasporeda", "Vrijeme početka rasporeda počinje prije početka rasporeda!");
    });
    it('Pogrešno vrijeme kraja rasporeda', function () {
      let div1 = document.createElement("div");
      raspored.iscrtajRaspored(div1, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 18);
      let dodaj=raspored.dodajAktivnost(div1,"WT","predavanje",15,19,"Ponedjeljak");
      assert.equal(dodaj,"Greška - aktivnost izlazi izvan okvira rasporeda", "Vrijeme kraja rasporeda završava poslije kraja rasporeda!");
    });
    it('Pogrešno vrijeme početka aktivnosti', function () {
      let div1 = document.createElement("div");
      raspored.iscrtajRaspored(div1, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 18);
      let dodaj=raspored.dodajAktivnost(div1,"WT","predavanje",15.3,16,"Ponedjeljak");
      assert.equal(dodaj,"Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "Vrijeme ima neispravan format!");
    });
    it('Nepostojeci dan', function () {
      let div1 = document.createElement("div");
      raspored.iscrtajRaspored(div1, ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak"], 7, 18);
      let dodaj=raspored.dodajAktivnost(div1,"WT","predavanje",12,15,"Subota");
      assert.equal(dodaj,"Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin", "Neispravan dan!");
    });
    it('Preklapanje aktivnosti - alert', function () {
      const div1 = document.createElement('div');
      raspored.iscrtajRaspored(div1, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Cetvrtak', 'Petak'], 8, 21);
      raspored.dodajAktivnost(div1, "test", "test", 10, 13, "Ponedjeljak");
      assert.equal(raspored.dodajAktivnost(div1, "test", "test", 9, 11, "Ponedjeljak"), "Greška - već postoji termin u rasporedu u zadanom vremenu","Potpuno preklapanje");
  });
    it('Aktivnost unutar aktivnosti - alert', function () {
      const div1 = document.createElement('div');
      raspored.iscrtajRaspored(div1, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Cetvrtak', 'Petak'], 8, 21);
      raspored.dodajAktivnost(div1, "test", "test", 10, 13, "Ponedjeljak");
      assert.equal(raspored.dodajAktivnost(div1, "test", "test", 11, 12, "Ponedjeljak"), "Greška - već postoji termin u rasporedu u zadanom vremenu","Potpuno preklapanje");
  });

  it('Uspjesno unesena aktivnost sa tacnim imenom', function () {
      const div1 = document.createElement('div');
      raspored.iscrtajRaspored(div1, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Cetvrtak', 'Petak'], 8, 21);
      raspored.dodajAktivnost(div1, "OOI", "Predavanje", 10, 12.5, "Ponedjeljak")
      var tabela = div1.getElementsByTagName("table")[0];
      var redovi = tabela.getElementsByTagName("tr");
      const activityCell = redovi[1].cells[5];
      assert.equal(activityCell.innerHTML, "OOI<br>Predavanje", "Nije dodana aktivnost!");
  });
  it('Uspjesno unesena aktivnost sa tacnim imenom 2', function () {
    const div1 = document.createElement('div');
    raspored.iscrtajRaspored(div1, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Cetvrtak', 'Petak'], 8, 21);
    raspored.dodajAktivnost(div1, "TP", "Predavanje", 10.5, 12.5, "Utorak")
    var tabela = div1.getElementsByTagName("table")[0];
    var redovi = tabela.getElementsByTagName("tr");
    const activityCell = redovi[2].cells[6];
    assert.equal(activityCell.innerHTML, "TP<br>Predavanje", "Nije dodana aktivnost!");
});
  it('Uspjesno unesena aktivnost sa odgovarajućim borderom', function () {
      const div1 = document.createElement('div');
      raspored.iscrtajRaspored(div1, ['Ponedjeljak', 'Utorak', 'Srijeda', 'Cetvrtak', 'Petak'], 8, 21);
      raspored.dodajAktivnost(div1, "test", "test", 10.5, 12.5, "Ponedjeljak")
      var tabela = div1.getElementsByTagName("table")[0];
      var redovi = tabela.getElementsByTagName("tr");
      const activityCell = redovi[1].cells[6];
      assert.equal('desnaIsprekidana', activityCell.className,"Pogrešan broder!");
  });
    
  
}); 
});
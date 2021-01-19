const fs = require('fs');
module.exports=function(app){
app.get('/v1/predmeti', (req, res) => {
    fs.readFile('predmeti.txt', (err, contents) => {
      if (err) {
        res.writeHead(504, {
          'Content-Type': 'application/json'
        });
        throw err;
      }
      else {
        let predmetiSpisak = contents.toString().split(/\r?\n/);
        let nizObjekata = [];
  
        for (let i = 0; i < predmetiSpisak.length; ++i) {
          if(predmetiSpisak[i]!=''){
          let objekat = {
            naziv: predmetiSpisak[i]
          };
          nizObjekata.push(objekat);
        }
        }
        res.json(nizObjekata);
      }
    });
  });
  
  app.get('/v1/aktivnosti', (req, res) => {
    fs.readFile('aktivnosti.txt', (err, contents) => {
      if (err) {
        res.writeHead(504, {
          'Content-Type': 'application/json'
        });
        throw err;
      }
      else {
        let aktivnostiSpisak = contents.toString().split(/\r?\n/);
        let nizObjekata = [];
        for (let i = 0; i < aktivnostiSpisak.length; ++i) {
          let parametri = aktivnostiSpisak[i].split(",");
          if(parametri!=''){
          let objekat = {
            naziv: parametri[0],
            tip: parametri[1],
            pocetak: Number(parametri[2]),
            kraj: Number(parametri[3]),
            dan: parametri[4]
          };
          nizObjekata.push(objekat);
        }
      }
        res.json(nizObjekata);
      }
    });
  });
  
  app.get('/v1/predmet/:naziv/aktivnost', function (req, res) {
    fs.readFile('aktivnosti.txt', (err, contents) => {
      if (err) {
        res.writeHead(504, { 'Content-Type': 'application/json' });
        throw err;
      }
      else {
        let aktivnostiSpisak = contents.toString().split(/\r?\n/);
        let nizObjekata = [];
        for (let i = 0; i < aktivnostiSpisak.length; ++i) {
          let parametri = aktivnostiSpisak[i].split(",");
          if(parametri!=''){
          let objekat = { naziv: parametri[0], tip: parametri[1], pocetak:Number(parametri[2]), kraj: Number(parametri[3]), dan: parametri[4] };
          nizObjekata.push(objekat);
          }
        }
        let finalni = nizObjekata.filter(function (parametar) {
          return parametar.naziv == req.params.naziv;
        })
        res.json(finalni);
      }
    });
  });
  
  app.post('/v1/predmet', function (req, res) {
  
    fs.readFile('predmeti.txt', (err, contents) => {
      if (err) {
        res.writeHead(504, { 'Content-Type': 'application/json' });
        throw err;
      }
      else {
        let predmetiSpisak = contents.toString().split(/\r?\n/);
        var imaPredmet = false;
        for (var i = 0; i < predmetiSpisak.length; i++) {
          if (predmetiSpisak[i] == req.body["naziv"]) {
            imaPredmet = true;
            break;
          }
        }
        if (imaPredmet == true){
          res.status(400);
          return res.json({ message: 'Naziv predmeta postoji!' });
        }
        else {
          if(predmetiSpisak!=''){
            fs.appendFile('predmeti.txt', "\n" + req.body["naziv"], function (err) {
            if (err) throw err;
          });}
          else {
            fs.appendFile('predmeti.txt', req.body["naziv"], function (err) {
              if (err) throw err;
          });}
          res.json({ message: 'Uspješno dodan predmet!' })
        }
      }
    });
  });
  function provjera(aktivnostiSpisak, pocetak, kraj, dan) {
      for (var i = 0; i < aktivnostiSpisak.length; i++){
          let akt = aktivnostiSpisak[i].toString().split(",");
          if(akt[4] == dan){
              if( ((pocetak <= akt[2]) && (kraj > akt[2]) && (kraj <= akt[3])) ||
                  ((pocetak >= akt[2]) && (pocetak < akt[3]) && (kraj >= akt[3])) ||
                  ((pocetak > akt[2]) && (kraj < akt[3])) ||
                  ((pocetak < akt[2]) && (kraj > akt[3])) ||
                  ((pocetak == akt[2]) && (kraj == akt[3]))){
                      return true;
                  }
   
          }
      }
      return false;
  }
   
  app.post('/v1/aktivnost', function (req, res) {
    var vrijemePocetak, vrijemeKraj;
    vrijemePocetak = Number(req.body["pocetak"]);
    vrijemeKraj = Number(req.body["kraj"]);
    if ((Number.isInteger(vrijemePocetak) == false && vrijemePocetak % 1 != 0.5) || (Number.isInteger(vrijemeKraj) == false && vrijemeKraj % 1 != 0.5) || vrijemePocetak >= vrijemeKraj
      || vrijemePocetak < 8 || vrijemeKraj < 8 || vrijemePocetak > 21 || vrijemeKraj > 21){
        res.status(400);
        return res.json({ message: 'Aktivnost nije validna!' });
      }
    else {
      fs.readFile('aktivnosti.txt', (err, contents) => {
        if (err) {
          res.writeHead(504, { 'Content-Type': 'application/json' });
          throw err;
        }
        else {
          let aktivnostiSpisak = contents.toString().split(/\r?\n/);
          if(provjera(aktivnostiSpisak,vrijemePocetak,vrijemeKraj,req.body["dan"])){
            res.status(400);
            return res.json({ message: 'Aktivnost nije validna!' });
          }
          else {
            if(aktivnostiSpisak!=''){
              fs.appendFile('aktivnosti.txt', "\n" + req.body["naziv"] + "," + req.body["tip"] + "," + vrijemePocetak + "," + vrijemeKraj + "," + req.body["dan"], function (err) {
                if (err) throw err;
              });
            }
            else{
              fs.appendFile('aktivnosti.txt', req.body["naziv"] + "," + req.body["tip"] + "," + vrijemePocetak + "," + vrijemeKraj + "," + req.body["dan"], function (err) {
                if (err) throw err;
              });
            }
            res.json({ message: 'Uspješno dodana aktivnost!' })
          }
        }
      
      });
    }
  });
  app.delete('/v1/aktivnost/:naziv', function (req, res) {
    fs.readFile('aktivnosti.txt', (err, contents) => {
      if (err) {
        res.writeHead(504, { 'Content-Type': 'application/json' });
        throw err;
      }
      else {
        let noveAktivnosti = contents.toString().split(/\r?\n/)
          .filter(function (ele) {
            return ele.split(",")[0] != req.params["naziv"];
          });
        let nova = "";
        noveAktivnosti.forEach(element => nova += element + "\n");
        if (noveAktivnosti.length == contents.toString().split(/\r?\n/).length)
          res.json({ message: "Greška - aktivnost nije obrisana!" });
        else {
          fs.writeFile('aktivnosti.txt', nova.toString(), function (err) {
            if (err) res.json({ message: "Greška - aktivnost nije obrisana!" });
            else res.json({ message: "Uspješno obrisana aktivnost!" });
          });
        }
      }
    });
  });
  app.delete('/v1/predmet/:naziv', function (req, res) {
    fs.readFile('predmeti.txt', (err, contents) => {
      if (err) {
        res.writeHead(504, { 'Content-Type': 'application/json' });
        throw err;
      }
      else {
        let noviPredmeti = contents.toString().split(/\r?\n/)
          .filter(function (ele) {
            return ele != req.params["naziv"];
          });
        if (noviPredmeti.length == contents.toString().split(/\r?\n/).length)
          res.json({ message: "Greška - predmet nije obrisan!" });
        else {
          fs.writeFile('predmeti.txt', noviPredmeti.toString().split(",").join("\n"), function (err) {
            if (err) res.json({ message: "Greška - predmet nije obrisan!" });
            else res.json({ message: "Uspješno obrisan predmet!" });
          })
        }
      }
    });
  });
  
  app.delete('/v1/all', function (req, res) {
    fs.truncate('predmeti.txt', 0, function (err) {
      if (err) res.json({ message: 'Greška - sadržaj datoteka nije moguće obrisati!' });
      else {
        fs.truncate('aktivnosti.txt', 0, function (err) {
          if (err) res.json({ message: 'Greška - sadržaj datoteka nije moguće obrisati!' });
          else {
            res.json({ message: 'Uspješno obrisan sadržaj datoteka!' });
          }
        })
      }
    })
  });
}
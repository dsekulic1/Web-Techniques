let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
let except = chai.expect;
chai.use(chaiHttp);
const fs = require('fs');
let zahtjevi = ["GET", "POST", "DELETE"];
let testovi = fs.readFileSync("testniPodaci.txt", 'utf8').split(/\r?\n/);
testovi.forEach((test) => {
   
    test = test.replace(/\\/gi, "");
    let obj = {};
    if (!zahtjevi.includes(test.split(",")[0])) obj = { zahjev: "", root: "", in: "", out: "" };
    else {
        let vrijednosti = test.split(",");
        obj.zahjev = vrijednosti[0];
        obj.root = vrijednosti[1];
        let ulazneIzJSONa = "";
        let izlazneIzJSONa = "";
        if (vrijednosti[0] == "POST") {
            for (let i = 2; i < vrijednosti.length - 1; i++) {
                if (i != 2) ulazneIzJSONa += ",";
                ulazneIzJSONa += vrijednosti[i];
            }
            izlazneIzJSONa = vrijednosti[vrijednosti.length - 1];
        }
        else {
            ulazneIzJSONa = vrijednosti[2];
            for (let i = 3; i < vrijednosti.length; i++) {
                if (i != 3) izlazneIzJSONa += ",";
                izlazneIzJSONa += vrijednosti[i];
            }
        }
        obj.in = JSON.parse(ulazneIzJSONa);
        obj.out = JSON.parse(izlazneIzJSONa);
    }
    if (obj.zahjev == "POST") {
        it(obj.zahjev + obj.root, function (done) {
            chai.request(server)
                .post(obj.root)
                .send(obj.in)
                .end((error, res) => {
                    if(res.status===200){
                        res.should.have.status(200);
                    }
                   else{
                    res.should.have.status(400);
                   }
                   res.body.should.have.property("message");
                        res.body.should.be.eql(obj.out);
                    done();
                });
        });
    }
    else if (obj.zahjev == "GET") {
        it(obj.zahjev + obj.root, function (done) {
            chai.request(server).get(obj.root)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.should.be.eql(obj.out);
                    done();
                });
        });
    }
    else if (obj.zahjev == "DELETE") {
        console.log(obj);
        it(obj.zahjev + obj.root, function (done) {
            chai.request(server).delete(obj.root)
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.be.eql(obj.out);
                    done();
                });
        });

    }
});
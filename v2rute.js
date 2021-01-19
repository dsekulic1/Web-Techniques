const sequelize = require('./model/sequelize');
const Predmet = sequelize.models.Predmet;
const Grupa = sequelize.models.Grupa;
const Aktivnost = sequelize.models.Aktivnost;
const Dan = sequelize.models.Dan;
const Tip = sequelize.models.Tip;
const Student = sequelize.models.Student;

module.exports = function (app) {

    app.get('/v2/predmet', async (req, res) => {
        const predmeti = await Predmet.findAll();
        return res.json(predmeti);
    });

    app.get('/v2/grupa', async (req, res) => {
        const grupe = await Grupa.findAll();
        return res.json(grupe);
    });

    app.get('/v2/aktivnost', async (req, res) => {
        const aktivnosti = await Aktivnost.findAll();
        return res.json(aktivnosti);
    });

    app.get('/v2/dan', async (req, res) => {
        const dani = await Dan.findAll();
        return res.json(dani);
    });

    app.get('/v2/tip', async (req, res) => {
        const tipovi = await Tip.findAll();
        return res.json(tipovi);
    });

    app.get('/v2/student', async (req, res) => {
        const studenti = await Student.findAll();
        return res.json(studenti);
    });

    app.get('/v2/predmet/:id', async (req, res) => {
        return Predmet.findOne({ where: { id: req.params.id } }).then((pr) => {
            if (pr) {
                return res.json(pr);
            }
            else {
                return res.json({ message: "Predmet nije pronađen!" })
            }
        });
    });

    app.get('/v2/grupa/:id', async (req, res) => {
        return Grupa.findOne({ where: { id: req.params.id } }).then((gr) => {
            if (gr) {
                return res.json(gr);
            }
            else {
                return res.json({ message: "Grupa nije pronađena!" })
            }
        });
    });

    app.get('/v2/aktivnost/:id', async (req, res) => {
        return Aktivnost.findOne({ where: { id: req.params.id } }).then((akt) => {
            if (akt) {
                return res.json(akt);
            }
            else {
                return res.json({ message: "Aktivnost nije pronađena!" })
            }
        });
    });

    app.get('/v2/dan/:id', async (req, res) => {
        return Dan.findOne({ where: { id: req.params.id } }).then((d) => {
            if (d) {
                return res.json(d);
            }
            else {
                return res.json({ message: "Dan nije pronađen!" })
            }
        });
    });

    app.get('/v2/tip/:id', async (req, res) => {
        return Tip.findOne({ where: { id: req.params.id } }).then((t) => {
            if (t) {
                return res.json(t);
            }
            else {
                return res.json({ message: "Tip nije pronađen!" })
            }
        });
    });

    app.get('/v2/student/:id', async (req, res) => {
        return Tip.findOne({ where: { id: req.params.id } }).then((st) => {
            if (st) {
                return res.json(st);
            }
            else {
                return res.json({ message: "Student nije pronađen!" })
            }
        });
    });

    app.post('/v2/predmet', async (req, res) => {
        try {
            const p = await Predmet.create(req.body);
            res.status(200);
            return res.json(p);
        }
        catch (err) {
            res.status(400);
            return res.json({ message: "Unique - vrijednost postoji u bazi" });
        }

    });

    app.post('/v2/grupa', async (req, res) => {
        return Grupa.findOne({ where: { naziv: req.body.naziv, PredmetId: req.body.PredmetId } }).then(async (gr) => {
            if (!gr) {
                try {
                    const g = await Grupa.create(req.body);
                    return res.json(g);
                } catch (error) {
                    res.status(400);
                    return res.json({ message: "FK - vrijednost ne postoji u bazi" });
                }
            }
            else {
                res.status(400);
                return res.json({ message: "Unique - vrijednost postoji u bazi" });
            }
        });
    });
    //Uradit validaciju sata pocetka i kraja
    function provjera(aktivnostiSpisak, pocetak, kraj) {
        for (var i = 0; i < aktivnostiSpisak.length; i++) {
            let p = aktivnostiSpisak[i].pocetak;
            let k = aktivnostiSpisak[i].kraj;
            if (((pocetak <= p) && (kraj > p) && (kraj <= k)) ||
                ((pocetak >= p) && (pocetak < k) && (kraj >= k)) ||
                ((pocetak > p) && (kraj < k)) ||
                ((pocetak < p) && (kraj > k)) ||
                ((pocetak == p) && (kraj == k))) {
                return true;
            }

        }
        return false;
    }
    app.post('/v2/aktivnost', async (req, res) => {
        let vrijemePocetak = parseFloat(req.body.pocetak);
        let vrijemeKraj = parseFloat(req.body.kraj);
        if ((Number.isInteger(vrijemePocetak) == false && vrijemePocetak % 1 != 0.5) || (Number.isInteger(vrijemeKraj) == false && vrijemeKraj % 1 != 0.5) || vrijemePocetak >= vrijemeKraj
            || vrijemePocetak < 8 || vrijemeKraj < 8 || vrijemePocetak > 21 || vrijemeKraj > 21) {
            res.status(400);
            return res.json({ message: 'Aktivnost nije validna!' });
        }
        const aktivnostiSpisak = await Aktivnost.findAll({ where: { DanId: req.body.DanId } });
        if (provjera(aktivnostiSpisak, req.body.pocetak, req.body.kraj)) {
            const akt = await Aktivnost.create(req.body);
            res.status(200);
            return res.json(akt);
        }
        else {
            res.status(400);
            return res.json({ message: "Unique - vrijednost postoji u bazi" });
        }
    });

    app.post('/v2/dan', async (req, res) => {
        try {
            const d = await Dan.create(req.body);
            res.status(200);
            return res.json(d);
        }
        catch (err) {
            res.status(400);
            return res.json({ message: "Unique - vrijednost postoji u bazi" });
        }
    });

    app.post('/v2/tip', async (req, res) => {
        try {
            const t = await Tip.create(req.body);
            res.status(200);
            return res.json(t);
        }
        catch (err) {
            res.status(400);
            return res.json({ message: "Unique - vrijednost postoji u bazi" });
        }
    });

    app.post('/v2/student', async (req, res) => {
        try {
            const s = await Student.create(req.body);
            res.status(200);
            return res.json(s);
        }
        catch (err) {
            res.status(400);
            return res.json({ message: "Unique - vrijednost postoji u bazi" });
        }
    });

    app.delete('/v2/predmet/:id', async (req, res) => {
        await Predmet.destroy({
            where: {
                id: req.params.id
            }
        }).then(count => {
            if (!count) {
                res.json({ message: 'ID ne postoji!' });
            }
            else
                res.json({ message: 'Predmet izbrisan!' });
        });
    });
    app.delete('/v2/predmet/:naziv', async (req, res) => {
        await Predmet.destroy({
            where: {
                naziv: req.params.naziv
            }
        }).then(count => {
            if (!count) {
                res.json({ message: 'Naziv ne postoji!' });
            }
            else
                res.json({ message: 'Predmet izbrisan!' });
        });
    });
    app.delete('/v2/grupa/:id', async (req, res) => {
        await Grupa.destroy({
            where: {
                id: req.params.id
            }
        }).then(count => {
            if (!count) {
                res.json({ message: 'ID ne postoji!' });
            }
            else
                res.json({ message: 'Grupa izbrisana!' });
        });
    });

    app.delete('/v2/aktivnost/:id', async (req, res) => {
        await Aktivnost.destroy({
            where: {
                id: req.params.id
            }
        }).then(count => {
            if (!count) {
                res.json({ message: 'ID ne postoji!' });
            }
            else
                res.json({ message: 'Aktivnost izbrisana!' });
        });
    });

    app.delete('/v2/dan/:id', async (req, res) => {
        await Dan.destroy({
            where: {
                id: req.params.id
            }
        }).then(count => {
            if (!count) {
                res.json({ message: 'ID ne postoji!' });
            }
            else
                res.json({ message: 'Dan izbrisan!' });
        });
    });


    app.delete('/v2/tip/:id', async (req, res) => {
        await Tip.destroy({
            where: {
                id: req.params.id
            }
        }).then(count => {
            if (!count) {
                res.json({ message: 'ID ne postoji!' });
            }
            else
                res.json({ message: 'Tip izbrisan!' });
        });
    });

    app.delete('/v2/student/:id', async (req, res) => {
        await Student.destroy({
            where: {
                id: req.params.id
            }
        }).then(count => {
            if (!count) {
                res.json({ message: 'ID ne postoji!' });
            }
            else
                res.json({ message: 'Student izbrisan!' });
        });
    });

    app.put('/v2/predmet/:id', async (req, res) => {
        return Predmet.findOne({ where: { id: req.params.id } }).then((pred) => {
            if (pred) {
                try {
                    pred.update(req.body).then(p => {
                        res.status(200);
                        return res.json(p);
                    })
                }
                catch (err) {
                    res.status(400);
                    return res.json({ message: "Unique - vrijednost postoji u bazi" });
                }
            }
            else {
                return res.json({ message: "Predmet nije pronađen!" });
            }
        });
    });

    app.put('/v2/grupa/:id', async (req, res) => {
        return Grupa.findOne({ where: { id: req.params.id } }).then((gr) => {
            if (gr) {
                try {
                    gr.update(req.body).then(g => {
                        res.status(200);
                        return res.json(g);
                    })
                }
                catch (err) {
                    res.status(400);
                    return res.json({ message: "Unique - vrijednost postoji u bazi" });
                }
            }
            else {
                return res.json({ message: "Grupa nije pronađena!" });
            }
        });
    });
    //uradit provjeru update aktivnosti
    app.put('/v2/aktivnost/:id', async (req, res) => {
        let vrijemePocetak = parseFloat(req.body.pocetak);
        let vrijemeKraj = parseFloat(req.body.kraj);
        if ((Number.isInteger(vrijemePocetak) == false && vrijemePocetak % 1 != 0.5) || (Number.isInteger(vrijemeKraj) == false && vrijemeKraj % 1 != 0.5) || vrijemePocetak >= vrijemeKraj
            || vrijemePocetak < 8 || vrijemeKraj < 8 || vrijemePocetak > 21 || vrijemeKraj > 21) {
            res.status(400);
            return res.json({ message: 'Aktivnost nije validna!' });
        }
        const aktivnostiSpisak = await Aktivnost.findAll({ where: { DanId: req.body.DanId } });
        if (provjera(aktivnostiSpisak, req.body.pocetak, req.body.kraj)) {
            return Aktivnost.findOne({ where: { id: req.params.id } }).then(async (akt) => {
                if (akt) {

                    akt.update(req.body).then(a => {
                        return res.json(a);
                    })

                }
                else {
                    return res.json({ message: "Aktivnost nije pronađena!" })
                }
            });
        }
    });

    app.put('/v2/dan/:id', async (req, res) => {
        return Dan.findOne({ where: { id: req.params.id } }).then((da) => {
            if (da) {
                try {
                    da.update(req.body).then(d => {
                        res.status(200);
                        return res.json(d);
                    })
                }
                catch (err) {
                    res.status(400);
                    return res.json({ message: "Unique - vrijednost postoji u bazi" });
                }
            }
            else {
                return res.json({ message: "Dan nije pronađen!" })
            }
        });
    });

    app.put('/v2/tip/:id', async (req, res) => {
        return Tip.findOne({ where: { id: req.params.id } }).then((ti) => {
            if (ti) {
                try {
                    ti.update(req.body).then(t => {
                        res.status(200);
                        return res.json(t);
                    })
                }
                catch (err) {
                    res.status(400);
                    return res.json({ message: "Unique - vrijednost postoji u bazi" });
                }
            }
            else {
                return res.json({ message: "Tip nije pronađen!" })
            }
        });
    });

    app.put('/v2/student/:id', async (req, res) => {
        return Student.findOne({ where: { id: req.params.id } }).then((st) => {
            if (st) {
                try {
                    st.update(req.body).then(s => {
                        res.status(200);
                        return res.json(s);
                    })
                }
                catch (err) {
                    res.status(400);
                    return res.json({ message: "Unique - vrijednost postoji u bazi" });
                }
            }
            else {
                return res.json({ message: "Student nije pronađen!" })
            }
        });
    });
    app.post('/z3/aktivnost', async (req, res) => {
        let vrijemePocetak = parseFloat(req.body.pocetak);
        let vrijemeKraj = parseFloat(req.body.kraj);
        if ((Number.isInteger(vrijemePocetak) == false && vrijemePocetak % 1 != 0.5) || (Number.isInteger(vrijemeKraj) == false && vrijemeKraj % 1 != 0.5) || vrijemePocetak >= vrijemeKraj
            || vrijemePocetak < 8 || vrijemeKraj < 8 || vrijemePocetak > 21 || vrijemeKraj > 21) {
            res.status(400);
            return res.json({ message: 'Aktivnost nije validna!' });
        }
        const pred = await Predmet.findOne({ where: { naziv: req.body.naziv } });
        let d, imaDan = false;
        await Dan.findOne({ where: { naziv: req.body.dan } }).then(async (ima) => {
            if (!ima) {
                d = await Dan.create({ naziv: req.body.dan });
            }
            else {
                d = ima;
                imaDan = true;
            }
        });
        const aktivnostiSpisak = await Aktivnost.findAll({ where: { DanId: d.id } });
        if (!provjera(aktivnostiSpisak, req.body.pocetak, req.body.kraj)) {
            let t;
            await Tip.findOne({ where: { naziv: req.body.tip } }).then(async (ima) => {
                if (!ima) {
                    t = await Tip.create({ naziv: req.body.tip });
                }
                else t = ima;
            });

            let g;
            await Grupa.findOne({ where: { naziv: req.body.grupa, PredmetId: pred.id } }).then(async (ima) => {
                if (!ima) {
                    g = await Grupa.create({ naziv: req.body.grupa, PredmetId: pred.id });
                }
                else g = ima;
            });

            const akt = await Aktivnost.create({ naziv: req.body.naziv, pocetak: req.body.pocetak, kraj: req.body.kraj, PredmetId: pred.id, GrupaId: g.id, DanId: d.id, TipId: t.id });
            res.status(200);
            return res.json({ message: 'Uspješno dodana aktivnost!' })
        }
        else {
            if (!imaDan) {
                await Tip.destroy({
                    where: {
                        id: d.id
                    }
                })
            };
            res.status(400);
            return res.json({ message: "Unique - vrijednost postoji u bazi" });
        }
    });
    app.post('/v2/studenti', async (req, res) => {
        let { studenti } = req.body;
        let nizStudenta = [];
        let nizPoruka = [];
        let GrupaId = Number(req.body.grupaId);
        let gr = await Grupa.findOne({ where: { id: GrupaId } });
        for (let i = 0; i < studenti.length; i++) {
            try {
                const s = await Student.create({ ime: studenti[i].ime, index: studenti[i].index, grupaId: GrupaId });
                s.addGrupa(gr);
                nizStudenta.push(s);
            }
            catch (err) {
                await Student.findOne({ where: { index: studenti[i].index } }).then(async student => {
                    //console.log(student);
                    if (student.ime === studenti[i].ime) {
                        await dodajIzmjeni(student, gr);
                    }
                    nizPoruka.push("Student " + studenti[i].ime + " nije kreiran jer postoji student " + student.ime + " sa indexom " + student.index);
                });
            }
        }
        if (nizPoruka.length === 0) {
            res.status(200);
        }

        return res.json({
            kreirani: nizStudenta,
            poruke: nizPoruka
        });
    });
    async function dodajIzmjeni(student, nova) {
        const studentGrupe = await student.getGrupe();

        for (let i = 0; i < studentGrupe.length; i++) {
            if (studentGrupe[i].PredmetId === nova.PredmetId) {
                await student.removeGrupa(studentGrupe[i])
                await student.addGrupa(nova);
                return;
            }
        }

        return student.addGrupa(nova);
    }
}

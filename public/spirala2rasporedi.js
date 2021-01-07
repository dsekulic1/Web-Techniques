let okvir=document.getElementById("okvir");
iscrtajRaspored(okvir,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],7,23);
dodajAktivnost(okvir,"WT","predavanje",9,12,"Ponedjeljak");
dodajAktivnost(okvir,"WT","vježbe",12,13.5,"Ponedjeljak");
dodajAktivnost(okvir,"RMA","predavanje",14,17,"Ponedjeljak");
dodajAktivnost(okvir,"RMA","vježbe",12.5,14,"Utorak");
dodajAktivnost(okvir,"DM","tutorijal",14,16,"Utorak");
dodajAktivnost(okvir,"DM","predavanje",16,19,"Utorak");
dodajAktivnost(okvir,"OI","predavanje",12,15,"Srijeda");
dodajAktivnost(okvir,"PWS","vježbe",15,21,"Četvrtak");
//dodajAktivnost(okvir,"ASP","tutorijal",16,18,"Četvrtak");
dodajAktivnost(okvir,"AFJ","ponavljanje",15,18,"Petak");


let okvir1=document.getElementById("okvir2");
iscrtajRaspored(okvir1,["Ponedjeljak"],7,23);

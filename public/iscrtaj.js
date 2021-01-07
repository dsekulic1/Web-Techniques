var pocetakRas, krajRas;
function toStringSate(sat) {
	if (sat < 10) return "0" + sat + ":00";
	else return sat + ":00";
}
function iscrtajRaspored(div, dani, satPocetak, satKraj) {
	pocetakRas = satPocetak;
	krajRas = satKraj;
	if (!dani || !dani.length || satPocetak >= satKraj || Number.isInteger(satPocetak) == false || Number.isInteger(satKraj) == false || satPocetak < 0 || satPocetak > 24 || satKraj > 24 || satKraj < 0)
		div.innerHTML = "Greška";
	else {
		var tbl = document.createElement('table');
		var th = document.createElement("tr");
		tbl.appendChild(th);
		var sati = pocetakRas;
		for (var a = 0; a < satKraj - satPocetak; a++) {
			var cell = document.createElement("th");
			cell.colSpan = 2;
			th.appendChild(cell);
			if (a == 0) cell.innerHTML = toStringSate(sati);
			if (sati % 2 == 0 && sati <= 12)
				cell.innerHTML = toStringSate(sati);
			else if (sati % 2 == 1 && sati > 13) cell.innerHTML = toStringSate(sati);
			sati += 1;
		}
		for (var i = 0; i < dani.length; i++) {
			var tr = tbl.insertRow();
			for (var j = 0; j < 2 * (satKraj - satPocetak) + 1; j++) {
				var td = tr.insertCell();
				if (j == 0) td.appendChild(document.createTextNode(dani[i]));
			}
		}
		div.appendChild(tbl);
	}
}
function popraviOkvir(raspored) {
	var table = raspored.getElementsByTagName("table")[0];
	var redovi = table.getElementsByTagName("tr");
	for (let red of redovi) {
		if (red.cells[0].tagName != "TH") {
			var brojac = 0;
			for (var i = 1; i < red.cells.length; i++) {
				brojac += 1;
				if (red.cells[i].colSpan != 1) brojac += red.cells[i].colSpan - 1;
				if (brojac - red.cells[i].colSpan + 1 == 1 && brojac % 2 == 0) red.cells[i].className = "objePune";
				else if (brojac % 2 == 0) red.cells[i].className = "lijevaIsprekidana";
				else red.cells[i].className = "desnaIsprekidana";
			}
		}
	}
}
function imalDana(raspored, dan) {
	var table = raspored.getElementsByTagName("table")[0];
	var redovi = table.getElementsByTagName("tr");
	var imaDan = false;
	for (let red of redovi) {
		if (red.cells[0].textContent == dan) {
			imaDan = true;
		}
	}
	return imaDan;
}
function dajPlaniranuPoziciju(raspored, vrijemePocetak, dan) {
	var table = raspored.getElementsByTagName("table")[0];
	var redovi = table.getElementsByTagName("tr");
	var planiranaPoz = 0;
	for (let red of redovi) {
		if (red.cells[0].textContent == dan) {
			planiranaPoz = 2 * (vrijemePocetak - pocetakRas) + 1;
			
			for (var i = 0; i < 2 * (vrijemePocetak - pocetakRas) + 1 && i<red.cells.length ; i++) {
				if (red.cells[i].colSpan != 1 ) {
					if(i+red.cells[i].colSpan>planiranaPoz) {
						planiranaPoz=-1;
						break;
					}
					planiranaPoz-= red.cells[i].colSpan - 1;
				}
				if (i >= planiranaPoz) break;
			}		
		}
	}
	return planiranaPoz;
}
function dodajAktivnost(raspored, naziv, tip, vrijemePocetak, vrijemeKraj, dan) {
	if (vrijemePocetak < pocetakRas || vrijemeKraj > krajRas) {
		alert("Greška - aktivnost izlazi izvan okvira rasporeda");
		return ("Greška - aktivnost izlazi izvan okvira rasporeda");
	}
	else if (!raspored || raspored.getElementsByTagName("table").length == 0) {
		alert("Greška - raspored nije kreiran");
		return ("Greška - raspored nije kreiran");
	}
	else if ((Number.isInteger(vrijemePocetak) == false && vrijemePocetak % 1 != 0.5) || (Number.isInteger(vrijemeKraj) == false && vrijemeKraj % 1 != 0.5) || vrijemePocetak >= vrijemeKraj
		|| vrijemePocetak < 0 || vrijemeKraj < 0 || vrijemePocetak > 24 || vrijemeKraj > 24) {
		alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
		return ("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
	}
	else if (imalDana(raspored, dan) == false) {
		alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
		return ("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
	}
	else {
		var table = raspored.getElementsByTagName("table")[0];
		var redovi = table.getElementsByTagName("tr");
		for (let red of redovi) {
			if (red.cells[0].textContent == dan) {
				var bilaGreska = false;
				var planiranaPoz = dajPlaniranuPoziciju(raspored, vrijemePocetak, dan);
				if(planiranaPoz==-1){
					bilaGreska = true;
					alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
					return ("Greška - već postoji termin u rasporedu u zadanom vremenu");
				}
				else{
				for (var temp = planiranaPoz; temp < (planiranaPoz + 2 * (vrijemeKraj - vrijemePocetak)); temp++)
					if (red.cells[temp].innerHTML != "") {
						bilaGreska = true;
						alert("Greška - već postoji termin u rasporedu u zadanom vremenu");
						return ("Greška - već postoji termin u rasporedu u zadanom vremenu");
					}
				}
				if (!bilaGreska) {
					var odgCell = red.cells[planiranaPoz];
					odgCell.colSpan = 2 * (vrijemeKraj - vrijemePocetak);
					odgCell.innerHTML = naziv + "<br>" + tip;
					for (var i = 0; i < 2 * (vrijemeKraj - vrijemePocetak) - 1; i++) if (planiranaPoz + 1 != krajRas) red.deleteCell(planiranaPoz + 1);
				}
			}
			popraviOkvir(raspored);
		}
	}
}

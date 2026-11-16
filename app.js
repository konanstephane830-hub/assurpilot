let clients = JSON.parse(localStorage.getItem('assur')) || [
  {nom:"Kouadio Nguessan", tel:"0700000000", montant:85000, dateExp:"2026-11-28", assureur:"NSIA"},
  {nom:"Awa Traoré", tel:"0700000000", montant:60000, dateExp:"2026-12-02", assureur:"SUNU"}
];

function afficher(){
  let q = (document.getElementById('search')?.value || "").toLowerCase();
  let html = "";
  let total = 0;
  let exp = 0;
  let today = new Date("2026-11-16");

  clients.forEach((c,i)=>{
    if(!c.nom.toLowerCase().includes(q)) return;
    total += c.montant;
    let diff = (new Date(c.dateExp) - today) / (1000*60*60*24);
    if(diff < 15) exp++;
    let badge = diff < 15 ? `<span style="background:red;color:white;padding:3px 8px;border-radius:10px;font-size:11px">🔴 ${Math.round(diff)}j</span>` : `OK`;

    html += `<div class="client">
      <div><b>${c.nom}</b> ${badge}<br><small>${c.assureur} • ${c.montant} FCFA<br>Expire: ${c.dateExp}</small></div>
      <div style="width:130px">
        <button class="btn whatsapp" onclick="wa(${i})">WhatsApp</button>
        <button class="btn wave">Payer Wave</button>
        <button class="btn orange">Orange Money</button>
        <button class="btn" style="background:#ef4444" onclick="supp(${i})">Supprimer</button>
      </div>
    </div>`;
  });
  document.getElementById('clientList').innerHTML = html;
  document.getElementById('totalClients').innerText = clients.length;
  document.getElementById('totalCom').innerText = total.toLocaleString() + " FCFA";
  document.getElementById('totalExp').innerText = exp;
}

function wa(i){
  let c = clients[i];
  window.open(`https://wa.me/225${c.tel}?text=Bonjour ${c.nom}, votre assurance ${c.assureur} de ${c.montant} FCFA expire le ${c.dateExp}. On renouvelle ? - AssurPilot`);
}
function supp(i){ if(confirm("Supprimer ?")){ clients.splice(i,1); localStorage.setItem('assur', JSON.stringify(clients)); afficher(); } }
function ajouter(){
  let nom = document.getElementById('nom').value;
  let tel = document.getElementById('tel').value;
  let montant = +document.getElementById('montant').value;
  let dateExp = document.getElementById('dateExp').value;
  let assureur = document.getElementById('assureur').value;
  if(!nom || !montant) return alert("Nom et montant obligatoires");
  clients.push({nom, tel, montant, dateExp, assureur});
  localStorage.setItem('assur', JSON.stringify(clients));
  afficher();
}
afficher();
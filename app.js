const MON_NUMERO = "0788452508";
const MON_NUMERO_INTL = "225788452508"; // pour WhatsApp

let clients = JSON.parse(localStorage.getItem('assur_v4')) || [
  {nom:"Kouadio Nguessan", tel:"0707070707", cie:"NSIA", montant:85000, date:"2026-11-28", status:"retard"},
  {nom:"Awa Traoré", tel:"0505050505", cie:"SUNU", montant:60000, date:"2026-12-02", status:"avenir"}
];

function save(){localStorage.setItem('assur_v4', JSON.stringify(clients)); render();}
function initials(n){return n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}

function render(){
  const list=document.getElementById('clientList');
  const q=(document.getElementById('search').value||"").toLowerCase();
  list.innerHTML=""; let total=0, retard=0;
  clients.filter(c=> (c.nom+c.cie+c.tel).toLowerCase().includes(q)).forEach((c,i)=>{
    total+=c.montant; if(c.status==='retard') retard++;
    let badge = c.status==='retard' ? '<span class="badge red">● En retard • 12j</span>' : '<span class="badge green">● OK • 16j restants</span>';
    let color = c.status==='retard' ? '#ef4444' : '#0ea5e9';
    list.innerHTML+=`<div class="client-row">
      <div class="client-left"><div class="client-avatar" style="background:${color}">${initials(c.nom)}</div>
      <div><b>${c.nom} ${badge}</b><br><small style="color:#64748b">${c.cie} • ${c.montant.toLocaleString()} FCFA • Expire: ${c.date} • ${c.tel}</small></div></div>
      <div class="client-actions">
        <button class="wa" onclick="relance(${i})">💬 Relancer sur WhatsApp</button>
        <button class="wave" onclick="payWave(${i})">🌊 Payer via Wave - ${MON_NUMERO}</button>
        <button class="om" onclick="payOM(${i})">🟠 Orange Money - ${MON_NUMERO}</button>
      </div></div>`;
  });
  document.getElementById('totalClients').innerText=clients.length;
  document.getElementById('totalMontant').innerText=total.toLocaleString()+" FCFA";
  document.getElementById('totalRetard').innerText=retard;
  document.getElementById('countList').innerText=clients.length+" clients";
}

function toggleForm(){let f=document.getElementById('form'); f.style.display=f.style.display==='none'?'block':'none'}

function addClient(){
  let nom=document.getElementById('nom').value, tel=document.getElementById('tel').value, cie=document.getElementById('compagnie').value, montant=parseInt(document.getElementById('montant').value)||0, date=document.getElementById('date').value;
  if(!nom||!tel) return alert('Mets nom et téléphone');
  clients.unshift({nom,tel,cie,montant,date,status:'avenir'}); save(); toggleForm();
}

// 1. RELANCE CLIENT -> envoie WhatsApp AU CLIENT
function relance(i){
  let c=clients[i]; 
  let msg=`Bonjour ${c.nom}, c'est Stéphane de AssurPilot. Votre assurance ${c.cie} de ${c.montant.toLocaleString()} FCFA expire le ${c.date}. Vous pouvez payer par Wave au ${MON_NUMERO}. Merci de confirmer.`;
  window.open(`https://wa.me/225${c.tel.slice(-10)}?text=${encodeURIComponent(msg)}`);
}

// 2. PAIEMENT WAVE -> le client paie TON numéro
function payWave(i){
  let c=clients[i];
  let msg=`Bonjour Stéphane, je suis ${c.nom}, je veux payer ma prime ${c.cie} de ${c.montant.toLocaleString()} FCFA via Wave. Mon numéro: ${c.tel}`;
  // Ouvre Wave avec ton numéro en message + ouvre WhatsApp vers toi
  alert(`Pour payer ${c.montant.toLocaleString()} FCFA:\n\n1. Ouvre Wave\n2. Envoie à: ${MON_NUMERO}\n3. Motif: ${c.nom} - ${c.cie}\n\nJe t'ouvre WhatsApp pour envoyer la preuve.`);
  window.open(`https://wa.me/${MON_NUMERO_INTL}?text=${encodeURIComponent(msg)}`);
}

// 3. ORANGE MONEY -> pareil
function payOM(i){
  let c=clients[i];
  alert(`Orange Money:\n\nCompose #144#\nEnvoie ${c.montant.toLocaleString()} FCFA au ${MON_NUMERO}\nNom: Konan Stéphane\n\nEnsuite envoie la capture sur WhatsApp.`);
  window.open(`https://wa.me/${MON_NUMERO_INTL}?text=${encodeURIComponent("Bonjour, j'ai payé via Orange Money pour "+c.nom+" - "+c.montant+" FCFA")}`);
}

function relancerTous(){let r=clients.findIndex(c=>c.status==='retard'); if(r>=0) relance(r); else alert('Aucun retard !')}
document.getElementById('search').addEventListener('input', render);
render();
// --- NAVIGATION ---
function showSection(type, el){
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  if(el) el.classList.add('active');
  if(type==='portefeuille'){
    document.getElementById('search').focus();
    document.getElementById('search').scrollIntoView({behavior:'smooth'});
    alert('Portefeuille: '+clients.length+' clients. Utilise la recherche pour filtrer.');
  }
  if(type==='encaissement'){
    let total = clients.reduce((s,c)=>s+c.montant,0);
    alert('💸 Encaissements:\nTotal à encaisser: '+total.toLocaleString()+' FCFA\n\nWave / OM: '+MON_NUMERO+'\n\nClique "Payer via Wave" sur un client pour encaisser.');
    document.getElementById('clientList').scrollIntoView({behavior:'smooth'});
  }
  if(type==='polices'){
    alert('📄 Polices:\n'+clients.map(c=>`- ${c.nom} | ${c.cie} | ${c.montant.toLocaleString()} FCFA | ${c.date}`).join('\n'));
  }
}

// --- PARAMETRES ---
function openSettings(){
  document.getElementById('settingsModal').style.display='flex';
  let saved = JSON.parse(localStorage.getItem('assur_settings')||'{}');
  if(saved.tel) document.getElementById('setTel').value=saved.tel;
  if(saved.nom) document.getElementById('setNom').value=saved.nom;
}
function closeSettings(){ document.getElementById('settingsModal').style.display='none'; }
function saveSettings(){
  let nom=document.getElementById('setNom').value;
  let tel=document.getElementById('setTel').value;
  let obj=document.getElementById('setObjectif').value;
  localStorage.setItem('assur_settings', JSON.stringify({nom,tel,obj}));
  // Met à jour partout
  MON_NUMERO = tel;
  // Change le nom affiché
  document.querySelector('.profile b').innerText=nom;
  document.querySelector('.topbar h1').innerText='Bonjour, '+nom.split(' ')[0]+' 👋';
  alert('✅ Enregistré ! Ton nouveau numéro '+tel+' est maintenant utilisé pour Wave et WhatsApp.');
  closeSettings(); render();
}
function resetData(){
  if(confirm('Effacer tous les clients ?')){
    localStorage.removeItem('assur_v4');
    clients=[]; save(); closeSettings();
  }
}
// Charger les paramètres au démarrage
(function(){
  let s=JSON.parse(localStorage.getItem('assur_settings')||'{}');
  if(s.nom){ document.querySelector('.profile b').innerText=s.nom; }
  if(s.tel){ MON_NUMERO=s.tel; }
})();
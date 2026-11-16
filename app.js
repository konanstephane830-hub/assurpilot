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
        <button class="wa" onclick="relance(${i})">💬 WhatsApp</button>
        <button class="wave" onclick="payWave(${i})">Payer Wave</button>
        <button class="om" onclick="payOM(${i})">Orange Money</button>
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
function relance(i){let c=clients[i]; let msg=`Bonjour ${c.nom}, c'est Stéphane - AssurPilot. Votre assurance ${c.cie} de ${c.montant.toLocaleString()} FCFA expire le ${c.date}. Voulez-vous payer par Wave ou Orange Money ? Merci.`; window.open(`https://wa.me/225${c.tel.slice(-10)}?text=${encodeURIComponent(msg)}`)}
function payWave(i){let c=clients[i]; alert(`Lien Wave pour ${c.nom}: ${c.montant.toLocaleString()} FCFA - Envoie ce lien au client via WhatsApp`); relance(i)}
function payOM(i){let c=clients[i]; alert(`Orange Money #144*... pour ${c.nom}: ${c.montant.toLocaleString()} FCFA`)}
function relancerTous(){let r=clients.findIndex(c=>c.status==='retard'); if(r>=0) relance(r); else alert('Aucun retard !')}
document.getElementById('search').addEventListener('input', render);
render();
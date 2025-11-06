// JavaScript para Du-Black Borracharia (estático)

// Configurações
const telefone = '5581984948307'; // número no formato internacional sem '+'
// Horários
const WORK_START = {hour:8, minute:0};
const WORK_END = {hour:18, minute:0};
const SAT_END = {hour:12, minute:0};
const MAX_PER_DAY = 10;

// utilidade
function toMinutes(hm){ return hm.hour*60 + (hm.minute||0); }
function timeStringToMinutes(t){ if(!t) return null; const [h,m] = t.split(':').map(Number); return h*60 + m; }
function isWithinBusinessHours(dateStr, timeStr){
  if(!dateStr || !timeStr) return {ok:false, reason:'Data ou hora inválida'};
  const date = new Date(dateStr + 'T00:00:00'); // local date
  const weekday = date.getDay(); // 0=Sun .. 6=Sat
  const minutes = timeStringToMinutes(timeStr);
  if(weekday === 0) return {ok:false, reason:'Atendimento indisponível aos domingos'};
  if(weekday >=1 && weekday <=5){
    if(minutes < toMinutes(WORK_START) || minutes > toMinutes(WORK_END)) return {ok:false, reason:'Horário fora do expediente (Seg-Sex 08:00-18:00)'};
  } else if(weekday === 6){
    if(minutes < toMinutes(WORK_START) || minutes > toMinutes(SAT_END)) return {ok:false, reason:'Horário fora do expediente (Sábado 08:00-12:00)'};
  }
  return {ok:true};
}

// Limitador local por dia (localStorage) - nota: client-side apenas
function countAppointmentsForDate(dateStr){
  const key = 'dublack_appointments_' + dateStr;
  const val = localStorage.getItem(key);
  return val ? parseInt(val,10) : 0;
}
function incrementAppointmentsForDate(dateStr){
  const key = 'dublack_appointments_' + dateStr;
  const current = countAppointmentsForDate(dateStr);
  localStorage.setItem(key, String(current+1));
}

// Navigation toggle
document.getElementById('menuToggle').addEventListener('click', ()=>{
  const nav = document.getElementById('navList');
  if(nav.style.display === 'flex') nav.style.display = '';
  else nav.style.display = 'flex';
});

// Top WhatsApp link
document.getElementById('topWpp').addEventListener('click', (e)=>{
  e.preventDefault();
  window.open(`https://wa.me/${telefone}`, '_blank');
});
document.getElementById('whatsappFloat').addEventListener('click', (e)=>{ e.preventDefault(); window.open(`https://wa.me/${telefone}`, '_blank'); });

// Form handler: validar horário e limite e abrir WhatsApp
document.getElementById('formContato').addEventListener('submit', function(e){
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const tel = document.getElementById('telefone').value.trim();
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;
  const serv = document.getElementById('servicoEscolhido').value;
  const obs = document.getElementById('obs').value.trim();
  const msgBox = document.getElementById('msg');

  // validações básicas
  if(!nome || !tel || !data || !hora){
    msgBox.textContent = 'Por favor, preencha todos os campos.';
    return;
  }

  // valida horário conforme regras
  const hoursCheck = isWithinBusinessHours(data, hora);
  if(!hoursCheck.ok){
    msgBox.textContent = hoursCheck.reason;
    return;
  }

  // valida limite local por dia
  const currentCount = countAppointmentsForDate(data);
  if(currentCount >= MAX_PER_DAY){
    msgBox.textContent = 'Limite de agendamentos para essa data já atingido (10).';
    return;
  }

  // prepara mensagem e abre WhatsApp
  const mensagem = `Pedido de agendamento\nNome: ${nome}\nTelefone: ${tel}\nData: ${data} ${hora}\nServico: ${serv}\nObs: ${obs}`;
  // incrementa contador local (client-side)
  incrementAppointmentsForDate(data);
  msgBox.textContent = 'Abrindo WhatsApp para confirmar seu pedido...';
  window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, '_blank');
});

// ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

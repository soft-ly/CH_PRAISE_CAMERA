
const supabaseUrl = 'https://mhjyifwfxvqvxzqlmpix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oanlpZndmeHZxdnh6cWxtcGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDgzOTgsImV4cCI6MjEwMTQ4NDM5OH0.vz-WRw1kcggRXHntuwn0cQ9sZWexTVlSHYlML-hiiOA';
let supabase;
try {
  supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
} catch (e) {
  alert('에러 발생 (Supabase 로드 실패): ' + e.message + '\n새로고침을 해보세요.');
}
const STORAGE={equipment:'saegyeol_equipment_v4',requests:'saegyeol_requests_v4',me:'saegyeol_user_v4',adminPin:'saegyeol_admin_pin_v1'};
const rawSeed=[
['A7M4','카메라','보관중','2026.02.02','₩1,800,000','7730304','베터리1, 충전기1','인록','박은총','중고구매',1],
['FX3_A','카메라','보관중','2026.02.05','₩3,000,000','5070002','베터리1, 충전기1, 탑핸들 미포함','인록','박은총','중고구매',1],
['FX3_B','카메라','보관중','-','','5070158','배터리1, 탑핸들 포함','인록','박은총','',1],
['GODOX LE300BI_A','조명','보관중','','₩299,000','','리플렉터1, 케이블, 잼볼 1','인록','박은총','',1],
['GODOX LE300BI_B','조명','보관중','','₩299,000','','리플렉터1, 케이블, 소프트박스 1','인록','박은총','',1],
['Amaran 200X','조명','보관중','','','','','인록','박은총','',1],
['A-STAND','조명','보관중','','','','3개','인록','박은총','',3],
['라이트돔 미니','조명','보관중','','','','그리드','인록','박은총','',1],
['Miliboo 비디오 삼각대','기타','보관중','','₩180,000','','','인록','인록','',1],
['Sachtler ACE','기타','보관중','','','','','인록','박은총','',1],
['Smallrig AD-80_A','기타','보관중','2026.02.07','₩307,620','','','인록','박은총','',1],
['Smallrig AD-80_B','기타','보관중','2026.02.07','₩307,620','','','인록','박은총','',1],
['Sony 70-200 GM2','렌즈','보관중','2026.02.09','₩2,400,000','1887668','박스셋','인록','박은총','중고구매',1],
['Sony 100-400 GM','렌즈','보관중','2026.02.09','₩1,700,000','5804870','','인록','박은총','중고구매',1],
['Sony 24-70 GM2','렌즈','보관중','2026.02.09','₩1,900,000','1951956','박스셋','인록','박은총','중고구매',1],
['Sony 85.4 GM_A','렌즈','보관중','2026.02.09','₩880,000','1894137','박스셋','인록','박은총','중고구매',1],
['A7S3','카메라','보관중','2026.02.09','₩2,200,000','','베터리1, 충전기1','인록','박은총','중고구매',1],
['GODOX LE300BI_C','조명','보관중','','₩299,000','','리플렉터1, 케이블','인록','박은총','',1],
['붐+ C스텐드 세트','기타','보관중','','','','','인록','박은총','',1],
['Sony 16-35 GM','렌즈','보관중','','','1828710','','인록','박은총','중고구매',1],
['Sony 50.4 GM','렌즈','보관중','2026.05.28','₩1,200,000','6830669','','인록','박은총','',1],
['Sony 85.4 GM_B','렌즈','보관중','','','1856733','','인록','박은총','',1],
['Sony 85.4 GM_C','렌즈','보관중','','','1810340','','인록','박은총','',1],
['FX3_C','카메라','보관중','2026.07.29','₩3,300,000','5075184','배터리1, 충전기','인록','박은총','중고구매',1]
];
const prefixes={카메라:'CAM',렌즈:'LENS',조명:'LIGHT',기타:'ETC'};const counters={};
const generateUUID = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
const seedEquipment=rawSeed.map(r=>{const cat=r[1];counters[cat]=(counters[cat]||0)+1;return{id:generateUUID(),name:r[0],category:cat,status:r[2],purchaseDate:r[3],price:r[4],serial:r[5],components:r[6],manager:r[7],owner:r[8],desc:r[9],qty:r[10],code:`${prefixes[cat]||'EQ'}-${String(counters[cat]).padStart(2,'0')}`}});
let equipment = [];
let requests = [];
async function loadData() {
  const { data: eqData } = await supabase.from('equipment').select('*');
  const { data: reqData } = await supabase.from('requests').select('*');
  if (!eqData || eqData.length === 0) {
    const { data: inserted } = await supabase.from('equipment').insert(seedEquipment).select();
    equipment = inserted || [];
  } else {
    equipment = eqData;
  }
  requests = (reqData || []).map(r => ({...r, start: r.start_date, end: r.end_date}));
  renderAll();
}const $=s=>document.querySelector(s);const fmt=v=>new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(v));const label={pending:'승인 대기',approved:'승인 완료',rented:'대여 중',overdue:'반납 지연',returned:'반납 완료',rejected:'반려'};function statusOf(r){return r.status==='rented'&&new Date(r.end)<new Date()?'overdue':r.status}function idsOf(r){return r.equipmentIds||[r.equipmentId].filter(Boolean)}function eqsOf(r){return idsOf(r).map(id=>equipment.find(e=>e.id===id)).filter(Boolean)}function overlap(a,b,c,d){return new Date(a)<new Date(d)&&new Date(b)>new Date(c)}function blocking(r){return ['pending','approved','rented','overdue'].includes(statusOf(r))}function unavailable(id,start,end,exclude=null){return requests.some(r=>r.id!==exclude&&idsOf(r).includes(id)&&blocking(r)&&overlap(start,end,r.start,r.end))}function ymd(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}function dayReqs(date){const s=new Date(date.getFullYear(),date.getMonth(),date.getDate()),e=new Date(s);e.setDate(e.getDate()+1);return requests.filter(r=>statusOf(r)!=='rejected'&&new Date(r.start)<e&&new Date(r.end)>s)}function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
let selected=new Set(),activeCategory='전체',calendarMonth=new Date(),selectedCalendarDate=new Date();calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1);let currentUser=localStorage.getItem(STORAGE.me)||'';
function save(){renderAll()}
function desired(){const start=$('#availabilityStart').value,end=$('#availabilityEnd').value;return{start,end,valid:!!start&&!!end&&new Date(end)>new Date(start)}}
function renderCats(){const cats=['전체',...new Set(equipment.map(e=>e.category))],counts={};equipment.forEach(e=>counts[e.category]=(counts[e.category]||0)+1);$('#categoryFilters').innerHTML=cats.map(c=>`<button class="category-chip ${c===activeCategory?'active':''}" onclick="setCat('${c}')">${c}<span>${c==='전체'?equipment.length:counts[c]}</span></button>`).join('')}
window.setCat=c=>{activeCategory=c;renderCats();renderEq()}
function renderEq(){const q=$('#searchInput').value.toLowerCase(),r=desired();const rows=equipment.filter(e=>(activeCategory==='전체'||e.category===activeCategory)&&`${e.name} ${e.serial||''} ${e.category}`.toLowerCase().includes(q));$('#equipmentGrid').innerHTML=rows.map(e=>{const bad=r.valid&&unavailable(e.id,r.start,r.end),on=selected.has(e.id),need=!r.valid;return `<article class="equipment-card selectable ${on?'selected':''} ${bad?'conflict':''}" onclick="toggleEq('${e.id}')"><div><div class="equipment-meta"><span>${e.category}</span><span>${e.code}</span></div><h3>${e.name}</h3>${e.serial?`<div class="muted">S/N ${e.serial}</div>`:''}<p>${e.components||'구성품 정보 없음'}</p></div><div class="select-footer"><span class="status ${bad?'conflict':need?'pending':'available'}">${bad?'해당 일정 예약됨':need?'일정 선택 필요':'대여 가능'}</span><button class="btn ${on?'primary':'ghost'}" ${bad||need?'disabled':''}>${on?'✓ 선택됨':bad?'선택 불가':'선택'}</button></div></article>`}).join('')||'<div class="empty">해당 장비가 없습니다.</div>';renderSelection();renderNotice()}
window.toggleEq=id=>{const r=desired();if(!r.valid)return toast('먼저 대여 일정을 선택해주세요.');if(unavailable(id,r.start,r.end))return toast('해당 일정에는 이미 예약된 장비입니다.');selected.has(id)?selected.delete(id):selected.add(id);renderEq()}
function renderSelection(){const list=[...selected].map(id=>equipment.find(e=>e.id===id)).filter(Boolean);$('#selectedCount').textContent=list.length;$('#selectedNames').textContent=list.map(e=>e.name).slice(0,4).join(' · ')+(list.length>4?` 외 ${list.length-4}개`:'');$('#selectionBar').classList.toggle('hidden',!list.length)}
function renderNotice(){const r=desired(),el=$('#availabilityNotice');el.className='availability-notice';if(!r.start&&!r.end)return el.textContent='일정을 선택하면 예약 가능 여부를 확인할 수 있습니다.';if(!r.valid){el.classList.add('warning');return el.textContent='대여 시작과 반납 예정 시간을 확인해주세요.'}const n=equipment.filter(e=>unavailable(e.id,r.start,r.end)).length;el.textContent=n?`선택한 기간에 ${n}개 장비가 이미 신청·예약되어 있습니다.`:'선택한 기간에 대여 가능한 장비를 선택하세요.';el.classList.add(n?'warning':'ok')}
function tags(r){return eqsOf(r).map(e=>`<span class="equipment-tag">${e.name}${e.serial?` · S/N ${e.serial}`:''}</span>`).join('')}
function renderRentals(){const rows=requests.filter(r=>['rented','overdue'].includes(statusOf(r)));$('#rentalSummary').innerHTML=`<div class="summary-chip"><span>대여 건수</span><strong>${rows.length}</strong></div><div class="summary-chip"><span>대여 장비</span><strong>${rows.reduce((n,r)=>n+eqsOf(r).length,0)}</strong></div>`;$('#currentRentals').innerHTML=rows.map(r=>`<div class="request-row"><div class="request-top"><div class="request-title">${r.applicant}</div><span class="status ${statusOf(r)}">${label[statusOf(r)]}</span></div><div class="request-equipment">${tags(r)}</div><div class="request-meta"><span>${fmt(r.start)} → ${fmt(r.end)}</span><span>${r.purpose}</span></div></div>`).join('')||'<div class="empty">현재 대여 중인 장비가 없습니다.</div>'}
function renderMy(){const name=($('#myNameInput').value||currentUser).trim();if(!name){$('#myRequests').innerHTML='<div class="empty">이름을 입력하면 신청 내역을 확인할 수 있습니다.</div>';return}currentUser=name;localStorage.setItem(STORAGE.me,name);$('#myNameInput').value=name;const rows=requests.filter(r=>r.applicant===name).sort((a,b)=>b.created-a.created);$('#myRequests').innerHTML=rows.map(r=>`<div class="request-row"><div class="request-top"><div class="request-title">${eqsOf(r).length}개 장비 신청</div><span class="status ${statusOf(r)}">${label[statusOf(r)]}</span></div><div class="request-equipment">${tags(r)}</div><div class="request-meta"><span>${fmt(r.start)} → ${fmt(r.end)}</span><span>${r.purpose}</span></div></div>`).join('')||'<div class="empty">신청 내역이 없습니다.</div>'}
function renderCal(){ $('#calendarTitle').textContent=`${calendarMonth.getFullYear()}년 ${calendarMonth.getMonth()+1}월`;const first=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1),start=new Date(first);start.setDate(start.getDate()-first.getDay());let h=['일','월','화','수','목','금','토'].map(x=>`<div class="calendar-weekday">${x}</div>`).join('');for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const ev=dayReqs(d).filter(r=>statusOf(r)!=='returned').slice(0,3);h+=`<div class="calendar-day ${d.getMonth()!==calendarMonth.getMonth()?'other-month':''}" onclick="selectDay('${ymd(d)}')"><div class="day-number">${d.getDate()}</div>${ev.map(r=>`<button type="button" class="calendar-event ${statusOf(r)}" onclick="tip(event,this)"><span class="calendar-event-name">${r.applicant}</span><span class="calendar-tooltip"><strong>${r.applicant}</strong><small>${fmt(r.start)} → ${fmt(r.end)}</small><span class="calendar-tooltip-list">${eqsOf(r).map(e=>`<span>• ${e.name}</span>`).join('')}</span></span></button>`).join('')}</div>`}$('#calendar').innerHTML=h;renderDay()}
window.tip=(e,el)=>{e.stopPropagation();el.classList.toggle('open')};window.selectDay=s=>{selectedCalendarDate=new Date(`${s}T12:00:00`);calendarMonth=new Date(selectedCalendarDate.getFullYear(),selectedCalendarDate.getMonth(),1);renderCal()};function renderDay(){const rows=dayReqs(selectedCalendarDate).filter(r=>statusOf(r)!=='returned');$('#daySchedule').innerHTML=rows.map(r=>`<div class="schedule-line"><span class="status ${statusOf(r)}">${label[statusOf(r)]}</span><div><div class="schedule-equipment">${eqsOf(r).map(e=>e.name).join(' · ')}</div><div class="muted">${r.applicant} · ${fmt(r.start)} → ${fmt(r.end)}</div></div></div>`).join('')||'<div class="empty">이 날짜에 일정이 없습니다.</div>'}
function renderAll(){renderCats();renderEq();renderRentals();renderMy();renderCal()}
$('.tabs').addEventListener('click',e=>{if(!e.target.classList.contains('tab'))return;document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));e.target.classList.add('active');document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));$('#'+e.target.dataset.view).classList.add('active')});$('#searchInput').addEventListener('input',renderEq);$('#availabilityStart').addEventListener('change',()=>{selected.clear();renderEq()});$('#availabilityEnd').addEventListener('change',()=>{selected.clear();renderEq()});$('#clearAvailability').onclick=()=>{$('#availabilityStart').value='';$('#availabilityEnd').value='';selected.clear();renderEq()};$('#clearSelection').onclick=()=>{selected.clear();renderEq()};$('#loadMyRequests').onclick=renderMy;$('#openBatchRental').onclick=()=>{const r=desired();if(!r.valid||!selected.size)return toast('일정과 장비를 선택해주세요.');$('#rentalSelectedList').innerHTML=[...selected].map(id=>equipment.find(e=>e.id===id)).filter(Boolean).map(e=>`<span class="equipment-tag">${e.name}</span>`).join('');$('#startDate').value=r.start;$('#endDate').value=r.end;if(currentUser)$('#applicantName').value=currentUser;$('#rentalModal').classList.remove('hidden')};document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.add('hidden'));$('#rentalForm').onsubmit=async e=>{e.preventDefault();const start=$('#startDate').value,end=$('#endDate').value,ids=[...selected];if(ids.some(id=>unavailable(id,start,end)))return toast('방금 다른 예약이 접수된 장비가 있습니다.');const applicant=$('#applicantName').value.trim();
const newReq = { equipmentIds: ids, applicant, purpose: $('#purpose').value.trim(), start_date: start, end_date: end, memo: $('#requestMemo').value.trim(), status: 'pending' };
const { data, error } = await supabase.from('requests').insert([newReq]).select();
if (error) { return toast('오류: ' + error.message); }
requests.push({...data[0], start: data[0].start_date, end: data[0].end_date});
currentUser=applicant;localStorage.setItem(STORAGE.me,applicant);selected.clear();renderAll();$('#rentalModal').classList.add('hidden');$('#rentalForm').reset();toast('대여 신청이 접수되었습니다.');};$('#prevMonth').onclick=()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);renderCal()};$('#nextMonth').onclick=()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);renderCal()};$('#todayMonth').onclick=()=>{selectedCalendarDate=new Date();calendarMonth=new Date(selectedCalendarDate.getFullYear(),selectedCalendarDate.getMonth(),1);renderCal()};loadData();

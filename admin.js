
const supabaseUrl = 'https://mhjyifwfxvqvxzqlmpix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oanlpZndmeHZxdnh6cWxtcGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDgzOTgsImV4cCI6MjEwMTQ4NDM5OH0.vz-WRw1kcggRXHntuwn0cQ9sZWexTVlSHYlML-hiiOA';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let equipment = [];
let requests = [];
async function loadData() {
  const { data: eqData } = await supabase.from('equipment').select('*');
  const { data: reqData } = await supabase.from('requests').select('*');
  equipment = eqData || [];
  requests = (reqData || []).map(r => ({...r, start: r.start_date, end: r.end_date}));
  renderAll();
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
const seedEquipment=rawSeed.map(r=>{const cat=r[1];counters[cat]=(counters[cat]||0)+1;return{id:crypto.randomUUID(),name:r[0],category:cat,status:r[2],purchaseDate:r[3],price:r[4],serial:r[5],components:r[6],manager:r[7],owner:r[8],desc:r[9],qty:r[10],code:`${prefixes[cat]||'EQ'}-${String(counters[cat]).padStart(2,'0')}`}});
const $=s=>document.querySelector(s);const fmt=v=>new Intl.DateTimeFormat('ko-KR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(v));const label={pending:'승인 대기',approved:'승인 완료',rented:'대여 중',overdue:'반납 지연',returned:'반납 완료',rejected:'반려'};function statusOf(r){return r.status==='rented'&&new Date(r.end)<new Date()?'overdue':r.status}function idsOf(r){return r.equipmentIds||[r.equipmentId].filter(Boolean)}function eqsOf(r){return idsOf(r).map(id=>equipment.find(e=>e.id===id)).filter(Boolean)}function overlap(a,b,c,d){return new Date(a)<new Date(d)&&new Date(b)>new Date(c)}function blocking(r){return ['pending','approved','rented','overdue'].includes(statusOf(r))}function unavailable(id,start,end,exclude=null){return requests.some(r=>r.id!==exclude&&idsOf(r).includes(id)&&blocking(r)&&overlap(start,end,r.start,r.end))}function ymd(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}function dayReqs(date){const s=new Date(date.getFullYear(),date.getMonth(),date.getDate()),e=new Date(s);e.setDate(e.getDate()+1);return requests.filter(r=>statusOf(r)!=='rejected'&&new Date(r.start)<e&&new Date(r.end)>s)}function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
let calendarMonth=new Date(),selectedCalendarDate=new Date();calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1);

async function unlock(pin){if(pin==='q1w2e3r4'){sessionStorage.setItem('saegyeol_admin_ok','1');showAdmin()}else toast('관리자 비밀번호가 올바르지 않습니다.')}else if(saved===h){sessionStorage.setItem('saegyeol_admin_ok','1');showAdmin()}else toast('관리자 PIN이 올바르지 않습니다.')}
function showAdmin(){$('#adminLogin').classList.add('hidden');$('#adminApp').classList.remove('hidden');loadData()}
$('#loginForm').onsubmit=e=>{e.preventDefault();unlock($('#adminPin').value)};if(sessionStorage.getItem('saegyeol_admin_ok')==='1')showAdmin();$('#logoutAdmin').onclick=()=>{sessionStorage.removeItem('saegyeol_admin_ok');location.reload()};
async function save(){ await loadData(); }
function tags(r){return eqsOf(r).map(e=>`<span class="equipment-tag">${e.name}${e.serial?` · S/N ${e.serial}`:''}</span>`).join('')}
function renderAdmin(){const filter=$('#requestFilter').value;const list=requests.filter(r=>filter==='all'||statusOf(r)===filter).sort((a,b)=>b.created-a.created);$('#adminRequests').innerHTML=list.map(r=>{const st=statusOf(r);let a='';if(st==='pending')a=`<button class="btn small primary" onclick="setReq('${r.id}','approved')">승인</button><button class="btn small ghost" onclick="setReq('${r.id}','rejected')">반려</button>`;if(st==='approved')a=`<button class="btn small primary" onclick="setReq('${r.id}','rented')">출고</button>`;if(['rented','overdue'].includes(st))a=`<button class="btn small primary" onclick="setReq('${r.id}','returned')">반납 완료</button>`;return `<div class="request-row"><div class="request-top"><div class="request-title">${r.applicant} · ${eqsOf(r).length}개 장비</div><span class="status ${st}">${label[st]}</span></div><div class="request-equipment">${tags(r)}</div><div class="request-meta"><span>${fmt(r.start)} → ${fmt(r.end)}</span><span>${r.purpose}</span></div><div class="actions">${a}<button class="btn small danger" onclick="deleteReq('${r.id}')">삭제</button></div></div>`}).join('')||'<div class="empty">신청 내역이 없습니다.</div>';
$('#adminEquipment').innerHTML=equipment.map(e=>`<div class="request-row"><div class="request-top"><div><div class="request-title">${e.name}</div><div class="muted">${e.category} · ${e.code}${e.serial?` · S/N ${e.serial}`:''}</div></div><div class="actions"><button class="btn small ghost" onclick="editEquipment('${e.id}')">수정</button><button class="btn small danger" onclick="deleteEquipment('${e.id}')">삭제</button></div></div><div class="muted">${e.components||''}${e.owner?` · 소유자 ${e.owner}`:''}</div></div>`).join('');$('#equipmentCount').textContent=`총 ${equipment.length}종 / ${equipment.reduce((n,e)=>n+(e.qty||1),0)}개`;const s={pending:0,rented:0,overdue:0,returned:0};requests.forEach(r=>{const st=statusOf(r);if(st in s)s[st]++});$('#stats').innerHTML=`<div class="stat"><span>승인 대기</span><strong>${s.pending}</strong></div><div class="stat"><span>대여 중</span><strong>${s.rented}</strong></div><div class="stat"><span>반납 지연</span><strong>${s.overdue}</strong></div><div class="stat"><span>반납 완료</span><strong>${s.returned}</strong></div>`}
window.setReq=async (id,status)=>{const r=requests.find(x=>x.id===id);if(!r)return;if(status==='approved'&&idsOf(r).some(eq=>unavailable(eq,r.start,r.end,r.id)))return toast('다른 신청과 일정이 겹쳐 승인할 수 없습니다.');
const {error} = await supabase.from('requests').update({status}).eq('id',id);
if(!error){r.status=status;renderAll();toast(label[status]||'처리 완료')}else{toast('오류: '+error.message)};
};window.deleteReq=async id=>{if(confirm('신청 기록을 삭제할까요?')){const {error} = await supabase.from('requests').delete().eq('id',id);if(!error){requests=requests.filter(r=>r.id!==id);renderAll()}else{toast('오류: '+error.message)}}};window.editEquipment=id=>{const e=equipment.find(x=>x.id===id),m={equipmentId:'id',equipmentName:'name',equipmentCode:'code',equipmentSerial:'serial',equipmentCategory:'category',equipmentQty:'qty',equipmentStatus:'status',equipmentPurchaseDate:'purchaseDate',equipmentPrice:'price',equipmentManager:'manager',equipmentOwner:'owner',equipmentComponents:'components',equipmentDesc:'desc'};Object.entries(m).forEach(([a,b])=>$('#'+a).value=e[b]||'');$('#equipmentModalTitle').textContent='장비 수정';$('#equipmentModal').classList.remove('hidden')};window.deleteEquipment=async id=>{if(confirm('이 장비를 삭제할까요?')){const {error}=await supabase.from('equipment').delete().eq('id',id);if(!error){equipment=equipment.filter(e=>e.id!==id);renderAll()}else{toast('오류: '+error.message)}}};
function renderCal(){$('#calendarTitle').textContent=`${calendarMonth.getFullYear()}년 ${calendarMonth.getMonth()+1}월`;const first=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1),start=new Date(first);start.setDate(start.getDate()-first.getDay());let h=['일','월','화','수','목','금','토'].map(x=>`<div class="calendar-weekday">${x}</div>`).join('');for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const ev=dayReqs(d).slice(0,3);h+=`<div class="calendar-day ${d.getMonth()!==calendarMonth.getMonth()?'other-month':''}" onclick="selectDay('${ymd(d)}')"><div class="day-number">${d.getDate()}</div>${ev.map(r=>`<button type="button" class="calendar-event ${statusOf(r)}"><span class="calendar-event-name">${r.applicant}</span><span class="calendar-tooltip"><strong>${r.applicant}</strong><small>${label[statusOf(r)]} · ${fmt(r.start)} → ${fmt(r.end)}</small><span class="calendar-tooltip-list">${eqsOf(r).map(e=>`<span>• ${e.name}</span>`).join('')}</span></span></button>`).join('')}</div>`}$('#calendar').innerHTML=h;renderDay()};window.selectDay=s=>{selectedCalendarDate=new Date(`${s}T12:00:00`);calendarMonth=new Date(selectedCalendarDate.getFullYear(),selectedCalendarDate.getMonth(),1);renderCal()};function renderDay(){const rows=dayReqs(selectedCalendarDate);$('#daySchedule').innerHTML=rows.map(r=>`<div class="schedule-line"><span class="status ${statusOf(r)}">${label[statusOf(r)]}</span><div><div class="schedule-equipment">${eqsOf(r).map(e=>e.name).join(' · ')}</div><div class="muted">${r.applicant} · ${fmt(r.start)} → ${fmt(r.end)} · ${r.purpose}</div></div></div>`).join('')||'<div class="empty">이 날짜에 일정이 없습니다.</div>'}
function renderAll(){renderAdmin();renderCal()}
$('.tabs').addEventListener('click',e=>{if(!e.target.classList.contains('tab'))return;document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));e.target.classList.add('active');document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));$('#'+e.target.dataset.view).classList.add('active')});$('#requestFilter').onchange=renderAdmin;$('#openAddModal').onclick=()=>{$('#equipmentForm').reset();$('#equipmentId').value='';$('#equipmentQty').value=1;$('#equipmentStatus').value='보관중';$('#equipmentModalTitle').textContent='장비 추가';$('#equipmentModal').classList.remove('hidden')};document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$('#'+b.dataset.close).classList.add('hidden'));$('#equipmentForm').onsubmit=async e=>{e.preventDefault();const id=$('#equipmentId').value,data={name:$('#equipmentName').value.trim(),code:$('#equipmentCode').value.trim(),serial:$('#equipmentSerial').value.trim(),category:$('#equipmentCategory').value.trim(),qty:Number($('#equipmentQty').value),status:$('#equipmentStatus').value.trim(),purchaseDate:$('#equipmentPurchaseDate').value.trim(),price:$('#equipmentPrice').value.trim(),manager:$('#equipmentManager').value.trim(),owner:$('#equipmentOwner').value.trim(),components:$('#equipmentComponents').value.trim(),desc:$('#equipmentDesc').value.trim()};
if(id){
  const {error}=await supabase.from('equipment').update(data).eq('id',id);
  if(error)return toast('오류: '+error.message);
}else{
  const {error}=await supabase.from('equipment').insert([data]);
  if(error)return toast('오류: '+error.message);
}
await loadData();
$('#equipmentModal').classList.add('hidden');toast('장비 정보를 저장했습니다.');};$('#prevMonth').onclick=()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);renderCal()};$('#nextMonth').onclick=()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);renderCal()};$('#todayMonth').onclick=()=>{selectedCalendarDate=new Date();calendarMonth=new Date(selectedCalendarDate.getFullYear(),selectedCalendarDate.getMonth(),1);renderCal()};

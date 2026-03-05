// ===== VIEW SWITCHER =====
function showView(view){

  document.querySelectorAll(".view-content").forEach(v=>{
    v.classList.add("hidden")
  })

  const el = document.getElementById("view-" + view)

  if(el){
    el.classList.remove("hidden")
  }

}
// scripts/app.js
(function bootstrapApp() {

  // ===== CREATE ALERT BUTTON =====
      const btnCreate = document.getElementById("btn-create-alert");

      if (btnCreate) {
        btnCreate.addEventListener("click", () => {
          const modal = document.getElementById("modal-create-alert");

          if (modal) {
            modal.classList.remove("hidden");
          }
        });
      }
  // ===== CLOSE CREATE ALERT MODAL =====
      const btnClose = document.getElementById("btn-close-create-alert");

        if (btnClose) {
          btnClose.addEventListener("click", () => {
            const modal = document.getElementById("modal-create-alert");

            if (modal) {
              modal.classList.add("hidden");
            }
          });
        }
  // ===== DISCARD BUTTON =====
      const btnDiscard = document.getElementById("btn-discard-create-alert");

      if (btnDiscard) {
        btnDiscard.addEventListener("click", () => {
          const modal = document.getElementById("modal-create-alert");

          if (modal) {
            modal.classList.add("hidden");
          }
        });
      }
  // ===== CREATE INCIDENT FORM =====
    const incidentForm = document.getElementById("create-incident-form");

    if (incidentForm) {

      function generateIncidentId() {

        const now = new Date()

        const year = now.getFullYear().toString().slice(2)
        const month = String(now.getMonth() + 1).padStart(2, "0")

        const random = String(Math.floor(Math.random()*1000)).padStart(3,"0")

        return `I${year}${month}-${random}`

      }
      incidentForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const data = {

          incidentId: generateIncidentId(),

          workType: document.getElementById("f-type").value,  

          node: document.getElementById("f-node").value,
          alarm: document.getElementById("f-alarm").value,
          detail: document.getElementById("f-detail").value,

          nocBy: "System",
          severity: "Medium",
          status: "ACTIVE",

          tickets: [
            {
              symphonyTicket: document.getElementById("f-ticket").value,
              cid: document.getElementById("f-cid").value,
              port: document.getElementById("f-port").value,

              downTime: document.getElementById("f-downTime").value,
              clearTime: document.getElementById("f-clearTime").value,

              total: "",
              pending: document.getElementById("f-pending").value,
              actualDowntime: "",

              originate: document.getElementById("f-originate").value,
              terminate: document.getElementById("f-terminate").value
            }
          ]

        };

        AlertService.createAlert(data);
          // ปิด modal
        document.getElementById("modal-create-alert").classList.add("hidden");

          // reset form
       incidentForm.reset();

      });
      }
  // ===== NAVIGATION =====
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => {
      const view = el.dataset.view;

      Store.dispatch(state => ({
        ...state,
        ui: {
          ...state.ui,
          currentView: view
        }
      }));
    });
  });

  // ===== RENDER =====
  function render(state) {

    // ซ่อนทุก view
    document.querySelectorAll('.view-content').forEach(v => {
      v.classList.add('hidden');
    });

    // ถ้าเป็นหน้า alert ให้ render table
    if (state.ui.currentView === 'alert') {
    const container = document.getElementById('alert-table-container');

    if (container) {
        container.innerHTML = '';
        container.appendChild(AlertUI.render(state));
    }
    }

    // ถ้าเป็นหน้า alert-detail ให้ render detail
    if (state.ui.currentView === 'alert-detail') {
      const container = document.getElementById('view-alert-detail');
      if (container) {
        // ใช้ข้อมูลจาก store (selectedIncident) หรือ sample ถ้าไม่มี
        const incident = state.ui.selectedIncident || getSampleIncidentData();
        AlertDetailUI.render(incident);
      }
    }
    if(state.ui.currentView === "corrective"){

    const container = document.getElementById("corrective-container")

    if(container){

    container.innerHTML=""

    container.appendChild(
    CorrectiveUI.render(state)
    )

    }

    }
    // ===== CORRECTIVE VIEW =====
    if (state.ui.currentView === "corrective") {

      const container = document.getElementById("corrective-container")

      if (container) {

        container.innerHTML = ""

        container.appendChild(
          CorrectiveUI.render(state)
        )

      }

    }
    // แสดง view ที่เลือก
    const activeView = document.getElementById(`view-${state.ui.currentView}`);

    if (activeView) {
      activeView.classList.remove('hidden');
    }

    // Highlight nav
    document.querySelectorAll('.nav-item, .sub-nav-item').forEach(nav => {
      nav.classList.remove('active');
    });

    const activeNav =
      document.querySelector(`[data-view="${state.ui.currentView}"]`);

    if (activeNav) {
      activeNav.classList.add('active');
    }
  }

  // ข้อมูลตัวอย่างสำหรับ Demo
  function getSampleIncidentData() {
    return {
      id: 'I2602-000891',
      node: 'Phahol9_02_M8',
      alarm: 'Interface Down (at distributed switch)',
      detail: 'We are observing alarm interface last mile down, require NS for investigating the cable.',
      downTime: '2026-02-08T23:52:00',
      nocBy: 'Administrator',
      severity: 'Critical',
      type: 'Network',
      status: 'active',
      createdAt: '2026-02-08T23:52:00',
      tickets: [
        {
          ticket: 'T2602-001544',
          cid: 'DI41155',
          port: 'GigabitEthernet0/5/3',
          downTime: '2026-02-08T23:52:00',
          clearTime: '2026-02-09T00:16:00',
          total: '24 นาที',
          pending: null,
          actualDowntime: '24 นาที',
          originate: 'Symphony Communication Public Company Limited',
          terminate: 'Pruksa Real Estate Public Company Limited'
        },
        {
          ticket: 'T2602-001545',
          cid: 'DI41156',
          port: 'GigabitEthernet0/5/4',
          downTime: '2026-02-08T23:55:00',
          clearTime: null,
          total: null,
          pending: 'Waiting for ISP',
          actualDowntime: 'รอดำเนินการ',
          originate: 'Symphony Communication Public Company Limited',
          terminate: 'Another Customer Co., Ltd.'
        },
        {
          ticket: 'T2602-001546',
          cid: 'DI41157',
          port: 'GigabitEthernet0/5/5',
          downTime: '2026-02-09T01:00:00',
          clearTime: '2026-02-09T01:45:00',
          total: '45 นาที',
          pending: null,
          actualDowntime: '45 นาที',
          originate: 'Symphony Communication Public Company Limited',
          terminate: 'ABC Corporation'
        }
      ]
    };
  }

  // ===== SUBSCRIBE =====
  Store.subscribe(render);

  // ===== ADD TICKET BUTTON =====

    const ticketContainer = document.getElementById("ticket-container");
    const addTicketBtn = document.getElementById("btn-add-ticket");

    if (addTicketBtn) {

      addTicketBtn.addEventListener("click", () => {

        const ticketHTML = `

        <div class="ticket-item grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

          <input placeholder="Symphony Ticket"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

          <input placeholder="Symphony CID"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

          <input placeholder="Port"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

          <input type="datetime-local"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

          <input type="datetime-local"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

          <input placeholder="Pending"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

          <input placeholder="Originate"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

          <input placeholder="Terminate"
          class="ticket-field w-full bg-slate-100 rounded-lg px-3 py-2">

        </div>

        `;

        ticketContainer.insertAdjacentHTML("beforeend", ticketHTML);

      });

    }

  // ===== INITIAL LOAD =====
    (async function init() {

    AlertService.loadFromLocal();

    // ปิด Email ก่อน
    // await AlertService.loadFromEmail();

    })();

})();
document.addEventListener("click", function(e){

if(e.target.classList.contains("btn-response")){

const modal = document.getElementById("modal-response")

modal.classList.remove("hidden")

}

})
const cancelResponse = document.getElementById("btn-cancel-response")

if(cancelResponse){

cancelResponse.addEventListener("click", ()=>{

document.getElementById("modal-response")
.classList.add("hidden")

})

}
const saveResponse = document.getElementById("btn-save-response")

if(saveResponse){

saveResponse.addEventListener("click", ()=>{

const eta = document.querySelector("input[name='eta']:checked")

if(!eta){
alert("กรุณาเลือก ETA")
return
}

alert("รับงานแล้ว ETA : " + eta.value)

document.getElementById("modal-response")
.classList.add("hidden")

})

// ===== RESPONSE MODAL =====

let currentIncidentId = null

document.addEventListener("click", function(e){

if(e.target.classList.contains("btn-response")){

currentIncidentId = e.target.dataset.id

document
.getElementById("modal-response")
.classList.remove("hidden")

}

})

// cancel
document.getElementById("btn-cancel-response").onclick = () => {

document
.getElementById("modal-response")
.classList.add("hidden")

}

// save
document.getElementById("btn-save-response").onclick = () => {

const eta = document.querySelector('input[name="eta"]:checked')

if(!eta){
alert("กรุณาเลือก ETA")
return
}

AlertService.responseAlert(responseIncidentId, eta.value)

document
.getElementById("modal-response")
.classList.add("hidden")

}
}
// ===== CORRECTIVE MENU =====

document.querySelectorAll("#corrective-submenu div").forEach(menu => {

menu.onclick = () => {

const type = menu.innerText.toLowerCase()

Store.dispatch(state => ({
...state,
ui:{
...state.ui,
currentView:"corrective",
activeCorrectiveTab:type
}
}))

}

})
let responseIncidentId = null

document.addEventListener("click",function(e){

if(e.target.classList.contains("btn-response")){

responseIncidentId = e.target.dataset.id

document
.getElementById("modal-response")
.classList.remove("hidden")

}

})

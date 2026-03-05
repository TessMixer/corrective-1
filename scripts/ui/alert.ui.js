// scripts/ui/alert.ui.js

const AlertUI = (function () {

  function renderCreateButton() {
    const btn = document.createElement('button');
    btn.textContent = '+ Create Alert';
    btn.onclick = openCreateModal;
    return btn;
  }

  function openCreateModal() {
    const form = document.createElement('form');

    form.innerHTML = `
      <label>ID <input id="id"/></label><br/>
      <label>Type 
        <select id="type">
          <option value="fiber">Fiber</option>
          <option value="equipment">Equipment</option>
          <option value="other">Other</option>
        </select>
      </label><br/>
      <label>Severity 
        <select id="severity">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="critical">Critical</option>
        </select>
      </label>
    `;

    ModalUI.open({
      title: 'Create Alert',
      content: form,
      confirmText: 'Create',
      onConfirm: () => {
        try {
        IncidentService.createAlert({
            id: form.querySelector('#id').value,
            type: form.querySelector('#type').value,
            severity: form.querySelector('#severity').value,
            openedAt: new Date().toISOString().slice(0, 10)
        });
        } catch (e) {
        alert(e.message);
        }
      }
    });
  }

  function renderStatusBadge(status) {

  const map = {
    PROCESS: 'bg-blue-100 text-blue-600',
    COMPLETE: 'bg-green-100 text-green-600',
    CANCEL: 'bg-red-100 text-red-600'
  };

  return `
    <span class="px-2 py-1 text-xs rounded-full ${map[status]}">
      ${status}
    </span>
  `;
  }

  function renderTable(alerts) {

  const table = document.createElement('table');
  table.className = 'w-full text-sm bg-white rounded-xl overflow-hidden';

  table.innerHTML = `
    <thead class="bg-slate-100 text-xs uppercase text-slate-500">
      <tr>
        <th>Incident Number</th>
        <th>Work Type</th>
        <th>Node Name</th>
        <th>Alarm</th>
        <th>Down Time</th>
        <th>Total Tickets</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
     ${alerts.map(a => `

      <tr data-detail="${a.incidentId}" class="cursor-pointer hover:bg-slate-50">

      <td class="font-semibold text-orange-600">
      ${a.incidentId}
      </td>

      <td>
      ${a.workType || "-"}
      </td>

      <td>
      ${a.node || "-"}
      </td>

      <td>
      ${a.alarm || "-"}
      </td>

      <td>
      ${a.tickets?.[0]?.downTime || "-"}
      </td>

      <td class="text-center">
      ${a.tickets ? a.tickets.length : 0}
      </td>

      <td class="flex gap-2">

      <button
      class="btn-response bg-blue-500 text-white px-3 py-1 rounded-lg"
      data-id="${a.incidentId}">
      Response
      </button>

      <button
      class="bg-red-500 text-white px-3 py-1 rounded-lg"
      data-cancel="${a.incidentId}">
      Cancel
      </button>

      </td>

      </tr>

      `).join('')}
    </tbody>
  `;

  setTimeout(() => {

    table.querySelectorAll('[data-complete]').forEach(btn => {
      btn.onclick = () => {
        AlertService.completeAlert(btn.dataset.complete);
      };
    });

    table.querySelectorAll('[data-cancel]').forEach(btn => {
      btn.onclick = () => {
        AlertService.cancelAlert(btn.dataset.cancel);
      };
    });
    table.querySelectorAll('[data-detail]').forEach(row => {
        row.onclick = () => {
            // ส่ง incident ไปเก็บใน store ก่อน แล้วค่อยเปลี่ยน view
            const alert = Store.getState().alerts
            .find(a => a.incidentId === row.dataset.detail);

            const incident = {
            id: alert.incidentId,
            node: alert.node,
            alarm: alert.alarm || 'Network Alert',
            detail: alert.detail || 'No details available',
            nocBy: alert.nocBy || 'System',
            downTime: alert.downTime || alert.actionDate,
            severity: alert.severity || 'Medium',
            type: alert.type || 'Network',
            status: alert.status === 'PROCESS' ? 'active' : 'resolved',
            createdAt: alert.actionDate || new Date().toISOString(),
            // ใช้ข้อมูล tickets จริง หรือ sample data สำหรับ demo
            tickets: alert.tickets && alert.tickets.length > 0
                ? alert.tickets
                : getSampleTickets(alert.incidentId)
            };

            // เก็บ incident ที่เลือกไว้ใน store
            Store.dispatch(state => ({
            ...state,
            ui: {
                ...state.ui,
                currentView: 'alert-detail',
                selectedIncident: incident
            }
            }));
        };
        });
  });

  return table;
}

  function render(state) {
  const container = document.createElement('div');
  container.className = 'space-y-6';

  const alerts = state.alerts || [];

  if (!alerts.length) {
    container.innerHTML = `
      <div class="glass-card p-8 text-center text-slate-400">
        ไม่มี Alert จาก Email
      </div>
    `;
    return container;
  }

  container.appendChild(renderTable(alerts));

  return container;
}   

  // ฟังก์ชันสร้าง sample tickets สำหรับ demo
  function getSampleTickets(incidentId) {
    // สร้าง tickets แบบสุ่มสำหรับ demo
    const ticketCount = Math.floor(Math.random() * 3) + 1; // 1-3 tickets
    const tickets = [];

    const companies = [
      'Symphony Communication Public Company Limited',
      'Pruksa Real Estate Public Company Limited',
      'ABC Corporation',
      'Another Customer Co., Ltd.',
      'Tech Solutions Ltd.'
    ];

    for (let i = 0; i < ticketCount; i++) {
      const baseTime = new Date();
      baseTime.setHours(baseTime.getHours() - Math.floor(Math.random() * 24));

      const downTime = baseTime.toISOString();
      const hasClear = Math.random() > 0.3;

      if (hasClear) {
        const clearTime = new Date(baseTime.getTime() + Math.random() * 3600000); // 0-1 hour later
        tickets.push({
          ticket: `T${new Date().getFullYear().toString().slice(-2)}${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          cid: `DI${Math.floor(Math.random() * 99999)}`,
          port: `GigabitEthernet0/5/${Math.floor(Math.random() * 10)}`,
          downTime: downTime,
          clearTime: clearTime.toISOString(),
          total: `${Math.floor((clearTime - baseTime) / 60000)} นาที`,
          pending: null,
          actualDowntime: `${Math.floor((clearTime - baseTime) / 60000)} นาที`,
          originate: companies[0],
          terminate: companies[Math.floor(Math.random() * companies.length) + 1]
        });
      } else {
        tickets.push({
          ticket: `T${new Date().getFullYear().toString().slice(-2)}${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
          cid: `DI${Math.floor(Math.random() * 99999)}`,
          port: `GigabitEthernet0/5/${Math.floor(Math.random() * 10)}`,
          downTime: downTime,
          clearTime: null,
          total: null,
          pending: 'Waiting for ISP',
          actualDowntime: 'รอดำเนินการ',
          originate: companies[0],
          terminate: companies[Math.floor(Math.random() * companies.length) + 1]
        });
      }
    }

    return tickets;
  }

  return { render };

})();
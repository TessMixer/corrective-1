// scripts/ui/alert-detail.ui.js

const AlertDetailUI = (function () {

  // ฟังก์ชันสำหรับจัดรูปแบบวันที่
  function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // ฟังก์ชันสำหรับคำนวณระยะเวลา
  function calculateDuration(start, end) {
    if (!start || !end) return '-';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) {
      return `${hours} ชม. ${mins} นาที`;
    }
    return `${mins} นาที`;
  }

  // ฟังก์ชันสำหรับแสดงสถานะ
  function getStatusBadge(status) {
    const statusConfig = {
      'active': { bg: 'bg-red-100', text: 'text-red-700', label: 'Active' },
      'pending': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending' },
      'resolved': { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
      'closed': { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Closed' }
    };
    const config = statusConfig[status] || statusConfig['pending'];
    return `<span class="${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-semibold">${config.label}</span>`;
  }

  // ส่วนที่ 1: Incident Summary (Outlook Email Header Style)
  function renderIncidentSummary(incident) {
    return `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Back Button & Email Header Style - Primary Info Bar -->
        <div class="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-slate-100">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <button id="btn-back-to-alert" class="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="Back to Alert Monitor">
                <i data-lucide="arrow-left" class="w-5 h-5 text-slate-600"></i>
              </button>
              <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <i data-lucide="alert-triangle" class="w-6 h-6 text-indigo-600"></i>
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800">Incident ${incident.id}</h2>
                <p class="text-sm text-slate-500">${incident.alarm || 'Network Alert'}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              ${getStatusBadge(incident.status || 'active')}
              <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Print">
                <i data-lucide="printer" class="w-5 h-5 text-slate-400"></i>
              </button>
              <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Close">
                <i data-lucide="x" class="w-5 h-5 text-slate-400"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Email Header Style - Metadata Grid -->
        <div class="px-6 py-5">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <!-- Node -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Node</label>
              <div class="flex items-center gap-2">
                <i data-lucide="server" class="w-4 h-4 text-slate-400"></i>
                <span class="text-sm font-semibold text-slate-700">${incident.node || '-'}</span>
              </div>
            </div>

            <!-- Down Time -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Down Time</label>
              <div class="flex items-center gap-2">
                <i data-lucide="clock" class="w-4 h-4 text-red-500"></i>
                <span class="text-sm font-semibold text-slate-700">${formatDateTime(incident.downTime)}</span>
              </div>
            </div>

            <!-- NOC Alert By -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NOC Alert By</label>
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  ${(incident.nocBy || 'AN').substring(0, 2).toUpperCase()}
                </div>
                <span class="text-sm font-semibold text-slate-700">${incident.nocBy || 'Administrator'}</span>
              </div>
            </div>

            <!-- Severity -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Severity</label>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">${incident.severity || 'Critical'}</span>
              </div>
            </div>

            <!-- Type -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</label>
              <div class="flex items-center gap-2">
                <span class="text-sm text-slate-700">${incident.type || 'Network'}</span>
              </div>
            </div>

            <!-- Created -->
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created</label>
              <div class="flex items-center gap-2">
                <i data-lucide="calendar" class="w-4 h-4 text-slate-400"></i>
                <span class="text-sm text-slate-700">${formatDateTime(incident.createdAt)}</span>
              </div>
            </div>
          </div>

          <!-- Detail Section -->
          <div class="mt-5 pt-5 border-t border-slate-100">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Detail</label>
            <div class="bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
              <p class="text-sm text-slate-700 leading-relaxed">${incident.detail || 'No additional details available.'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ส่วนที่ 2: Symphony Ticket Table (Excel Style)
  function renderTicketTable(incident) {
    const tickets = incident.tickets || [];
    const hasTickets = tickets.length > 0;

    return `
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <i data-lucide="ticket" class="w-5 h-5 text-orange-600"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800">Symphony Tickets</h3>
                <p class="text-xs text-slate-500">${tickets.length} ticket${tickets.length !== 1 ? 's' : ''} linked to this incident</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">Total Downtime:</span>
              <span class="text-sm font-bold text-red-600">${calculateTotalDowntime(tickets)}</span>
            </div>
          </div>
        </div>

        <!-- Excel-like Table -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1200px]">
            <!-- Table Head -->
            <thead class="bg-slate-100 text-xs uppercase text-slate-600 font-bold">
              <tr>
                <th class="px-4 py-3 text-left whitespace-nowrap bg-slate-100 sticky left-0 z-10 border-r border-slate-200">Symphony Ticket</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Symphony CID</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Port</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Down Time</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Clear Time</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Total</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Pending</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Actual Downtime</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Originate</th>
                <th class="px-4 py-3 text-left whitespace-nowrap">Terminate</th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-slate-100">
              ${hasTickets ? tickets.map((ticket, index) => renderTicketRow(ticket, index)).join('') : renderEmptyState()}
            </tbody>

            <!-- Table Footer -->
            ${hasTickets ? `
              <tfoot class="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colspan="10" class="px-4 py-3 text-xs text-slate-500 text-right">
                    Showing ${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}
                  </td>
                </tr>
              </tfoot>
            ` : ''}
          </table>
        </div>
      </div>
    `;
  }

  // แถวข้อมูล Ticket
  function renderTicketRow(ticket, index) {
    const isEven = index % 2 === 0;
    return `
      <tr class="${isEven ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/50 transition-colors">
        <td class="px-4 py-3 whitespace-nowrap sticky left-0 ${isEven ? 'bg-white' : 'bg-slate-50/50'} border-r border-slate-200 z-10">
          <div class="flex items-center gap-2">
            <span class="font-bold text-orange-600">${ticket.ticket || '-'}</span>
            <button class="p-1 hover:bg-slate-200 rounded transition-colors" title="View Details">
              <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i>
            </button>
          </div>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <span class="text-sm font-medium text-slate-700">${ticket.cid || '-'}</span>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <code class="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">${ticket.port || '-'}</code>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <span class="text-sm text-slate-600">${formatDateTime(ticket.downTime)}</span>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          ${ticket.clearTime
            ? `<span class="text-sm text-green-600">${formatDateTime(ticket.clearTime)}</span>`
            : '<span class="text-xs text-slate-400">-</span>'}
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <span class="text-sm font-semibold text-slate-700">${ticket.total || calculateDuration(ticket.downTime, ticket.clearTime)}</span>
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          ${ticket.pending
            ? `<span class="text-sm text-orange-600">${ticket.pending}</span>`
            : '<span class="text-xs text-slate-400">-</span>'}
        </td>
        <td class="px-4 py-3 whitespace-nowrap">
          <span class="text-sm font-semibold text-red-600">${ticket.actualDowntime || calculateDuration(ticket.downTime, ticket.clearTime)}</span>
        </td>
        <td class="px-4 py-3 whitespace-nowrap max-w-[200px]">
          <span class="text-sm text-slate-600 truncate block" title="${ticket.originate || ''}">${ticket.originate || '-'}</span>
        </td>
        <td class="px-4 py-3 whitespace-nowrap max-w-[200px]">
          <span class="text-sm text-slate-600 truncate block" title="${ticket.terminate || ''}">${ticket.terminate || '-'}</span>
        </td>
      </tr>
    `;
  }

  // แสดงเมื่อไม่มี Ticket
  function renderEmptyState() {
    return `
      <tr>
        <td colspan="10" class="px-4 py-12 text-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <i data-lucide="inbox" class="w-8 h-8 text-slate-300"></i>
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-600">No Symphony Tickets Found</p>
              <p class="text-xs text-slate-400 mt-1">This incident has no linked Symphony tickets</p>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  // คำนวณรวม Downtime ทั้งหมด
  function calculateTotalDowntime(tickets) {
    if (!tickets || tickets.length === 0) return '-';

    let totalMins = 0;
    tickets.forEach(ticket => {
      if (ticket.downTime && ticket.clearTime) {
        const start = new Date(ticket.downTime);
        const end = new Date(ticket.clearTime);
        totalMins += Math.floor((end - start) / 60000);
      } else if (ticket.downTime) {
        const start = new Date(ticket.downTime);
        const now = new Date();
        totalMins += Math.floor((now - start) / 60000);
      }
    });

    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours > 0) {
      return `${hours} ชม. ${mins} นาที`;
    }
    return `${mins} นาที`;
  }

  // Main render function
  function render(incident) {
    // สร้าง container หลัก
    const container = document.getElementById('view-alert-detail');
    if (!container) return;

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (!incident) {
      container.innerHTML = `
        <div class="flex items-center justify-center h-96">
          <div class="text-center">
            <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-circle" class="w-10 h-10 text-slate-300"></i>
            </div>
            <p class="text-slate-500 font-medium">No incident data available</p>
          </div>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Render ทั้งสองส่วน
    container.innerHTML = `
      <div class="space-y-6">
        ${renderIncidentSummary(incident)}
        ${renderTicketTable(incident)}
      </div>
    `;

    // Initialize icons
    lucide.createIcons();

    // Add back button event listener
    const backBtn = document.getElementById('btn-back-to-alert');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        Store.dispatch(state => ({
          ...state,
          ui: {
            ...state.ui,
            currentView: 'alert',
            selectedIncident: null
          }
        }));
      });
    }
  }

  return { render };

})();

// ==========================================
// Firebase Configuration & Initialization
// ==========================================
const firebaseConfig = {
    databaseURL: "https://amg-library-default-rtdb.firebaseio.com/"
};

// Start Firebase App Instance
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Modal Display Control Engine
window.toggleModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        setTimeout(() => { modal.classList.add('modal-active'); }, 10);
    } else {
        modal.classList.remove('modal-active');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    }
};

// ==========================================
// Operational Desk Tracker Logic
// ==========================================
let currentInsideCount = 0;
let totalVisitsToday = 0;
const capacityLimit = 15; 
let attendanceData = [];

// DOM Query Targets
const form = document.getElementById('checkin-form');
const nameInput = document.getElementById('learner-name');
const purposeInput = document.getElementById('visit-purpose');
const tableBody = document.getElementById('log-table-body');
const liveCounterEl = document.getElementById('live-counter');
const totalVisitsEl = document.getElementById('total-visits');
const alertEl = document.getElementById('capacity-alert');
const exportBtn = document.getElementById('export-btn');

const purposeStyles = {
    'Self-Study': 'bg-blue-50 text-blue-600 border-blue-200',
    'Computer Use': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Group Project': 'bg-white text-blue-700 border-blue-300',
    'Tutoring': 'bg-emerald-600 text-white border-emerald-600'
};

// 📥 FIREBASE STREAMING: Read records and auto-sync updates live
database.ref('attendance').on('value', function(snapshot) {
    tableBody.innerHTML = ''; // Reset UI view container
    attendanceData = [];
    currentInsideCount = 0;
    totalVisitsToday = 0;
    
    const data = snapshot.val();
    
    // Default state display if database node is completely empty
    if (!data) {
        tableBody.innerHTML = `
            <tr id="empty-state">
                <td colspan="4" style="text-align: center; color: #9ca3af; padding: 2rem; font-style: italic;">No learners checked in yet today.</td>
            </tr>`;
        updateDashboardMetrics();
        return;
    }

    // Loop through individual Firebase data leaves
    Object.keys(data).forEach(key => {
        const item = data[key];
        item.firebaseId = key; // Attach the database reference id key to use later during checkout updates
        attendanceData.push(item);
        
        totalVisitsToday++;
        if (item.timeOut === '-') {
            currentInsideCount++;
        }
    });

    // Keep the newest check-ins displaying cleanly at the very top of the desk log
    attendanceData.sort((a, b) => b.id - a.id);

    // Render HTML table elements live from synchronized data
    attendanceData.forEach(row => {
        const styleClass = purposeStyles[row.purpose] || 'bg-white text-slate-700 border-slate-300';
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/80 transition duration-150 border-b border-blue-50";
        
        let actionColumnHtml = '';
        if (row.timeOut === '-') {
            actionColumnHtml = `
                <button onclick="checkOut('${row.firebaseId}')" id="btn-${row.firebaseId}" class="text-xs bg-white hover:bg-emerald-50 text-blue-600 hover:text-emerald-600 py-1.5 px-3 rounded-lg border-2 border-blue-100 hover:border-emerald-300 transition duration-200 font-bold cursor-pointer">
                    Check Out
                </button>`;
        } else {
            actionColumnHtml = `<span class="text-xs text-emerald-600 font-mono font-bold bg-emerald-50 px-2 py-1 rounded">Left ${row.timeOut}</span>`;
        }

        tr.innerHTML = `
            <td class="p-4 font-bold text-slate-800">${row.name}</td>
            <td class="p-4">
                <span class="px-2.5 py-1 text-xs font-bold rounded-md border ${styleClass}">
                    ${row.purpose === 'Tutoring' ? 'Tutoring & Mentorship' : row.purpose}
                </span>
            </td>
            <td class="p-4 text-slate-500 font-mono text-xs">${row.timeIn}</td>
            <td class="p-4 text-right">${actionColumnHtml}</td>
        `;
        tableBody.appendChild(tr);
    });

    updateDashboardMetrics();
});

// 📤 FIREBASE ACTION: Record entry logs directly into your cloud terminal leaves
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const purpose = purposeInput.value;
        const timeIn = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const recordId = Date.now();

        if (!name) return;

        // Push structural item properties up to the cloud tree location
        database.ref('attendance').push({
            id: recordId,
            name: name,
            purpose: purpose,
            timeIn: timeIn,
            timeOut: '-'
        });

        nameInput.value = '';
        nameInput.focus();
    });
}

// 🔄 FIREBASE ACTION: Target single node leaves to log member departure times
window.checkOut = function(firebaseId) {
    const timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    database.ref('attendance/' + firebaseId).update({
        timeOut: timeOut
    });
};

function updateDashboardMetrics() {
    liveCounterEl.textContent = currentInsideCount;
    totalVisitsEl.textContent = totalVisitsToday;

    if (currentInsideCount >= capacityLimit) {
        alertEl.classList.remove('hidden');
    } else {
        alertEl.classList.add('hidden');
    }
}

// CSV Log Exporter
if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        if (attendanceData.length === 0) {
            alert('No metrics records logged to output yet.');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Name,Purpose of Visit,Time In,Time Out\n";

        attendanceData.forEach(function(row) {
            csvContent += `"${row.name}","${row.purpose}","${row.timeIn}","${row.timeOut}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `AMG_Library_Log_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Open the login modal window safely
window.openLoginModal = function(event) {
    if (event) event.preventDefault();
    toggleModal('login-modal');
};

// Close the login modal window safely
window.closeLoginModal = function() {
    toggleModal('login-modal');
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.reset();
};

// Form handler wrapper for authentication check-ins
window.handleLogin = function(event) {
    if (event) event.preventDefault();
    
    // For now, let's auto-unlock the portal desk directly!
    const portalEl = document.getElementById('librarian-portal');
    if (portalEl) {
        portalEl.classList.remove('hidden');
        closeLoginModal();
        portalEl.scrollIntoView({ behavior: 'smooth' });
    }
};
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
let allAttendanceData = []; // Holds all records fetched from Firebase

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

// Helper function to get today's date string (YYYY-MM-DD)
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Graphical Data Analysis Sync Engine
function updateAttendanceChart(records) {
    let morning = 0, midday = 0, afternoon = 0;

    records.forEach(record => {
        const timeStr = record.timeIn || "";
        const hour = parseInt(timeStr.split(':')[0], 10);
        const isPM = timeStr.toLowerCase().includes('pm');
        
        let standardHour = hour;
        if (isPM && hour !== 12) standardHour += 12;
        if (!isPM && hour === 12) standardHour = 0;

        if (standardHour < 12) morning++;
        else if (standardHour >= 12 && standardHour < 15) midday++;
        else afternoon++;
    });

    const total = morning + midday + afternoon || 1;

    // Update Counter Inner Strings
    const valMorning = document.getElementById('chart-val-morning');
    const valMidday = document.getElementById('chart-val-midday');
    const valAfternoon = document.getElementById('chart-val-afternoon');
    
    if (valMorning) valMorning.innerText = morning;
    if (valMidday) valMidday.innerText = midday;
    if (valAfternoon) valAfternoon.innerText = afternoon;

    // Render Clean Calculated Scale Percentages Smoothly
    const barMorning = document.getElementById('chart-bar-morning');
    const barMidday = document.getElementById('chart-bar-midday');
    const barAfternoon = document.getElementById('chart-bar-afternoon');

    if (barMorning) barMorning.style.height = `${(morning / total) * 100}%`;
    if (barMidday) barMidday.style.height = `${(midday / total) * 100}%`;
    if (barAfternoon) barAfternoon.style.height = `${(afternoon / total) * 100}%`;
}

// FIREBASE STREAMING: Read records and auto-sync updates live
database.ref('attendance').on('value', function(snapshot) {
    if (!tableBody) return;
    
    tableBody.innerHTML = ''; 
    allAttendanceData = [];
    currentInsideCount = 0;
    totalVisitsToday = 0;
    
    const data = snapshot.val();
    
    if (!data) {
        renderEmptyState();
        updateDashboardMetrics();
        updateAttendanceChart([]);
        return;
    }

    // Process all entries from Firebase
    Object.keys(data).forEach(key => {
        const item = data[key];
        item.firebaseId = key; 
        allAttendanceData.push(item);
    });

    // Filter down to ONLY today's entries for the live UI metrics and logs
    const todayStr = getTodayDateString();
    const todaysRecords = allAttendanceData.filter(row => row.date === todayStr);

    if (todaysRecords.length === 0) {
        renderEmptyState();
    } else {
        // Sort today's entries so newest is up top
        todaysRecords.sort((a, b) => b.id - a.id);

        todaysRecords.forEach(row => {
            totalVisitsToday++;
            if (row.timeOut === '-') {
                currentInsideCount++;
            }

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
                actionColumnHtml = `<span class="text-xs text-slate-400 font-medium">${row.timeOut}</span>`;
            }

            tr.innerHTML = `
                <td style="font-weight: 600; color: var(--primary-blue);">${row.name}</td>
                <td><span class="purpose-badge ${styleClass}">${row.purpose}</span></td>
                <td style="font-family: monospace; font-size: 0.85rem;">${row.timeIn}</td>
                <td style="text-align: right;">${actionColumnHtml}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    updateDashboardMetrics();
    updateAttendanceChart(todaysRecords);
});

function renderEmptyState() {
    tableBody.innerHTML = `
        <tr id="empty-state">
            <td colspan="4" style="text-align: center; color: #9ca3af; padding: 2rem; font-style: italic;">No learners checked in yet today.</td>
        </tr>`;
}

function updateDashboardMetrics() {
    if (liveCounterEl) liveCounterEl.innerText = currentInsideCount;
    if (totalVisitsEl) totalVisitsEl.innerText = totalVisitsToday;

    if (alertEl) {
        if (currentInsideCount >= capacityLimit) {
            alertEl.classList.remove('hidden');
        } else {
            alertEl.classList.add('hidden');
        }
    }
}

// SUBMIT CAPTURED CHECK-INS
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const purpose = purposeInput.value;

        if (!name) return;

        const timestamp = new Date();
        let hours = timestamp.getHours();
        const minutes = timestamp.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

        const newLogEntry = {
            id: Date.now(),
            date: getTodayDateString(), // NEW: Explicitly tracks calendar day
            name: name,
            purpose: purpose,
            timeIn: formattedTime,
            timeOut: '-'
        };

        database.ref('attendance').push(newLogEntry, function(error) {
            if (!error) {
                form.reset();
            } else {
                alert('Database submission failed. Please verify connection.');
            }
        });
    });
}

// CHECK OUT CURRENT VISITOR
window.checkOut = function(firebaseId) {
    const timestamp = new Date();
    let hours = timestamp.getHours();
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

    const targetButton = document.getElementById(`btn-${firebaseId}`);
    if (targetButton) {
        targetButton.disabled = true;
        targetButton.innerText = "Saving...";
    }

    database.ref('attendance/' + firebaseId).update({
        timeOut: formattedTime
    }).catch(function(err) {
        alert("Checkout save failed.");
        if (targetButton) {
            targetButton.disabled = false;
            targetButton.innerText = "Check Out";
        }
    });
};

// EXPORT ATTENDANCE REGISTRY FOR ANY SELECTED DAY
if (exportBtn) {
    exportBtn.addEventListener('click', function() {
        if (allAttendanceData.length === 0) {
            alert("No available records to transfer.");
            return;
        }

        // Prompt user to pick a target date
        const targetDate = prompt("Enter the date you want to export (YYYY-MM-DD):", getTodayDateString());
        if (!targetDate) return; // User cancelled

        // Filter the system array to only entries matching chosen day
        const targetRecords = allAttendanceData.filter(row => row.date === targetDate);

        if (targetRecords.length === 0) {
            alert(`No history entries found on ${targetDate}. Ensure correct format (YYYY-MM-DD).`);
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Name,Purpose of Visit,Time In,Time Out\n";

        targetRecords.forEach(function(row) {
            csvContent += `"${row.date}","${row.name}","${row.purpose}","${row.timeIn}","${row.timeOut}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `AMG_Library_Log_${targetDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Open login modal window safely
window.openLoginModal = function(event) {
    if (event) event.preventDefault();
    toggleModal('login-modal');
};

// Close login modal window safely
window.closeLoginModal = function() {
    toggleModal('login-modal');
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.reset();
};

// Form handler wrapper for authentication check-ins
window.handleLogin = function(event) {
    if (event) event.preventDefault();
    
    const portalEl = document.getElementById('librarian-portal');
    if (portalEl) {
        portalEl.classList.remove('hidden');
        closeLoginModal();
        portalEl.scrollIntoView({ behavior: 'smooth' });
    }
};

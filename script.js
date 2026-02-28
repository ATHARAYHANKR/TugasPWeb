let orders = [];
let statusFlow = ["Masuk", "Diambil", "Dicuci", "Disetrika", "Dikirim"];
let pendingDeleteIndex = null;

// Data dummy untuk contoh
const dummyOrders = [
    {
        id: "ORD-0HIF9",
        pelanggan: "Karimah",
        layanan: "Cuci Baju",
        varian: "Express",
        qty: 5,
        total: 15000,
        status: "Masuk"
    }
];

// Harga dasar per layanan dan varian
const priceMatrix = {
    "Cuci Baju": { "Reguler": 3000, "Express": 5000, "Super Express": 8000, "Kilat": 10000 },
    "Cuci Karpet": { "Reguler": 5000, "Express": 8000, "Super Express": 12000, "Kilat": 15000 },
    "Cuci Sepatu": { "Reguler": 4000, "Express": 6000, "Super Express": 9000, "Kilat": 12000 },
    "Laundry Kiloan": { "Reguler": 2500, "Express": 4000, "Super Express": 6000, "Kilat": 8000 },
    "Dry Cleaning": { "Reguler": 8000, "Express": 12000, "Super Express": 18000, "Kilat": 22000 }
};

// Load data dummy
orders = [...dummyOrders];

function renderTable() {
    const tbody = document.getElementById("orderTable");
    tbody.innerHTML = "";

    orders.forEach((o, i) => {
        tbody.innerHTML += `
        <tr>
            <td>${o.id}</td>
            <td>${o.pelanggan}</td>
            <td>${o.layanan}</td>
            <td>${o.varian}</td>
            <td>${o.qty}</td>
            <td>Rp ${Number(o.total).toLocaleString()}</td>
            <td><span class="badge ${o.status}">${o.status}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="editOrder(${i})">Edit</button>
                <button class="btn btn-primary" onclick="nextStatus(${i})">Next</button>
                <button class="btn btn-danger" onclick="showDeleteConfirm(${i})">Hapus</button>
            </td>
        </tr>`;
    });

    updateSummary();
}

function openModal(edit = false) {
    document.getElementById("orderModal").style.display = "flex";
    if (!edit) {
        document.getElementById("modalTitle").innerText = "Tambah Pesanan Baru";
        document.getElementById("orderForm").reset();
        document.getElementById("editIndex").value = "";
        document.getElementById("hargaSatuan").value = 5000;
        updateTotal();
    }
}

function closeModal() {
    document.getElementById("orderModal").style.display = "none";
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.innerHTML = '');
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
        el.classList.remove('error');
    });
}

function editOrder(index) {
    let o = orders[index];
    openModal(true);
    document.getElementById("modalTitle").innerText = "Edit Pesanan";
    document.getElementById("editIndex").value = index;
    document.getElementById("pelanggan").value = o.pelanggan;
    document.getElementById("layanan").value = o.layanan;
    document.getElementById("varian").value = o.varian;
    document.getElementById("qty").value = o.qty;
    
    // Set harga satuan berdasarkan layanan dan varian
    if (priceMatrix[o.layanan] && priceMatrix[o.layanan][o.varian]) {
        document.getElementById("hargaSatuan").value = priceMatrix[o.layanan][o.varian];
    }
    
    document.getElementById("total").value = o.total;
    document.getElementById("totalDisplay").innerText = `Rp ${Number(o.total).toLocaleString()}`;
}

function showDeleteConfirm(index) {
    pendingDeleteIndex = index;
    document.getElementById("deleteConfirmModal").style.display = "flex";
}

function closeDeleteModal() {
    document.getElementById("deleteConfirmModal").style.display = "none";
    pendingDeleteIndex = null;
}

function deleteOrder() {
    if (pendingDeleteIndex !== null) {
        orders.splice(pendingDeleteIndex, 1);
        renderTable();
        closeDeleteModal();
        showToast("Pesanan berhasil dihapus", "success");
    }
}

// Validasi form
function validateForm() {
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => el.innerHTML = '');
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
        el.classList.remove('error');
    });
    
    // Validasi pelanggan
    const pelanggan = document.getElementById("pelanggan").value.trim();
    if (!pelanggan) {
        document.getElementById("errorPelanggan").innerHTML = "Nama pelanggan harus diisi";
        document.getElementById("pelanggan").classList.add('error');
        isValid = false;
    } else if (pelanggan.length < 3) {
        document.getElementById("errorPelanggan").innerHTML = "Nama pelanggan minimal 3 karakter";
        document.getElementById("pelanggan").classList.add('error');
        isValid = false;
    }
    
    // Validasi layanan
    const layanan = document.getElementById("layanan").value;
    if (!layanan) {
        document.getElementById("errorLayanan").innerHTML = "Layanan harus dipilih";
        document.getElementById("layanan").classList.add('error');
        isValid = false;
    }
    
    // Validasi varian
    const varian = document.getElementById("varian").value;
    if (!varian) {
        document.getElementById("errorVarian").innerHTML = "Varian harus dipilih";
        document.getElementById("varian").classList.add('error');
        isValid = false;
    }
    
    // Validasi qty
    const qty = parseInt(document.getElementById("qty").value);
    if (!qty || qty < 1) {
        document.getElementById("errorQty").innerHTML = "Qty minimal 1";
        document.getElementById("qty").classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

// Update total berdasarkan qty dan harga satuan
function updateTotal() {
    const qty = parseInt(document.getElementById("qty").value) || 0;
    const hargaSatuan = parseInt(document.getElementById("hargaSatuan").value) || 0;
    const total = qty * hargaSatuan;
    
    document.getElementById("total").value = total;
    document.getElementById("totalDisplay").innerText = `Rp ${total.toLocaleString()}`;
}

// Update harga satuan berdasarkan layanan dan varian
function updateHargaSatuan() {
    const layanan = document.getElementById("layanan").value;
    const varian = document.getElementById("varian").value;
    
    if (layanan && varian && priceMatrix[layanan] && priceMatrix[layanan][varian]) {
        document.getElementById("hargaSatuan").value = priceMatrix[layanan][varian];
    } else {
        document.getElementById("hargaSatuan").value = 0;
    }
    
    updateTotal();
}

// Show toast notification
function showToast(message, type = "success") {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showToast("Mohon lengkapi form dengan benar", "error");
        return;
    }

    let index = document.getElementById("editIndex").value;
    const qty = parseInt(document.getElementById("qty").value);
    const hargaSatuan = parseInt(document.getElementById("hargaSatuan").value);
    const total = qty * hargaSatuan;

    let data = {
        id: index === "" ? "ORD-" + Math.random().toString(36).substr(2, 5).toUpperCase() : orders[index].id,
        pelanggan: document.getElementById("pelanggan").value.trim(),
        layanan: document.getElementById("layanan").value,
        varian: document.getElementById("varian").value,
        qty: qty,
        total: total,
        status: index === "" ? "Masuk" : orders[index].status
    };

    if (index === "") {
        orders.push(data);
        showToast("Pesanan berhasil ditambahkan");
    } else {
        orders[index] = data;
        showToast("Pesanan berhasil diupdate");
    }

    closeModal();
    renderTable();
});

document.getElementById("confirmDeleteBtn").addEventListener("click", deleteOrder);

// Event listeners untuk update harga
document.getElementById("layanan").addEventListener("change", updateHargaSatuan);
document.getElementById("varian").addEventListener("change", updateHargaSatuan);
document.getElementById("qty").addEventListener("input", updateTotal);

function nextStatus(i) {
    let idx = statusFlow.indexOf(orders[i].status);
    if (idx < statusFlow.length - 1) {
        orders[i].status = statusFlow[idx + 1];
        renderTable();
        showToast(`Status pesanan diubah menjadi ${orders[i].status}`);
    }
}

function updateSummary() {
    document.getElementById("countMasuk").innerText = orders.filter(o => o.status === "Masuk").length;
    document.getElementById("countDiambil").innerText = orders.filter(o => o.status === "Diambil").length;
    document.getElementById("countDiproses").innerText = orders.filter(o => o.status === "Dicuci" || o.status === "Disetrika").length;
    document.getElementById("countDikirim").innerText = orders.filter(o => o.status === "Dikirim").length;
}

// Fitur search
document.getElementById("searchInput").addEventListener("input", function(e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
        orders = [...dummyOrders];
    } else {
        orders = dummyOrders.filter(o => 
            o.pelanggan.toLowerCase().includes(searchTerm) ||
            o.id.toLowerCase().includes(searchTerm) ||
            o.layanan.toLowerCase().includes(searchTerm)
        );
    }
    renderTable();
});

// Fitur filter status
document.getElementById("filterStatus").addEventListener("change", function(e) {
    const status = e.target.value;
    if (status === "Semua") {
        orders = [...dummyOrders];
    } else {
        orders = dummyOrders.filter(o => o.status === status);
    }
    renderTable();
});

// Inisialisasi
renderTable();
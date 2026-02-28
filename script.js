let orders = [];
let statusFlow = ["Masuk","Diambil","Dicuci","Disetrika","Dikirim"];

function renderTable() {
    const tbody = document.getElementById("orderTable");
    tbody.innerHTML = "";

    orders.forEach((o,i)=>{
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
                <button class="btn btn-danger" onclick="deleteOrder(${i})">Hapus</button>
            </td>
        </tr>`;
    });

    updateSummary();
}

function openModal(edit=false){
    document.getElementById("orderModal").style.display="flex";
    if(!edit){
        document.getElementById("modalTitle").innerText="Tambah Pesanan";
        document.getElementById("orderForm").reset();
        document.getElementById("editIndex").value="";
    }
}

function closeModal(){
    document.getElementById("orderModal").style.display="none";
}

function editOrder(index){
    let o = orders[index];
    openModal(true);
    document.getElementById("modalTitle").innerText="Edit Pesanan";
    document.getElementById("editIndex").value=index;
    pelanggan.value=o.pelanggan;
    layanan.value=o.layanan;
    varian.value=o.varian;
    qty.value=o.qty;
    total.value=o.total;
}

document.getElementById("orderForm").addEventListener("submit",function(e){
    e.preventDefault();

    let index = editIndex.value;

    let data = {
        id: index==="" ? "ORD-"+Math.random().toString(36).substr(2,5).toUpperCase() : orders[index].id,
        pelanggan: pelanggan.value,
        layanan: layanan.value,
        varian: varian.value,
        qty: qty.value,
        total: total.value,
        status: index==="" ? "Masuk" : orders[index].status
    };

    if(index==="") orders.push(data);
    else orders[index]=data;

    closeModal();
    renderTable();
});

function deleteOrder(i){
    if(confirm("Hapus pesanan?")){
        orders.splice(i,1);
        renderTable();
    }
}

function nextStatus(i){
    let idx=statusFlow.indexOf(orders[i].status);
    if(idx<statusFlow.length-1)
        orders[i].status=statusFlow[idx+1];
    renderTable();
}

function updateSummary(){
    countMasuk.innerText=orders.length;
    countDiambil.innerText=orders.filter(o=>o.status==="Diambil").length;
    countDiproses.innerText=orders.filter(o=>o.status==="Dicuci"||o.status==="Disetrika").length;
    countDikirim.innerText=orders.filter(o=>o.status==="Dikirim").length;
}

renderTable();
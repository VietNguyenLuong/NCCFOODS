async function deleteSP(id) {
  if (confirm("Bạn có chắc muốn xóa không?")) {
    const res = await fetch(`/taikhoan/delete/${id}`, { method: "DELETE" });
    if (res.ok) {
      location.reload(); // load lại danh sách
    } else {
      alert("❌ Xóa thất bại");
    }
  }
}

async function toggleStatus(id) {
  if (confirm("Bạn có chắc muốn thay đổi trạng thái không?")) {
  const res = await fetch(`/taikhoan/updatestatus/${id}`, { method: "POST" });
   if (res.ok) {
      location.reload(); // load lại danh sách
    } else {
    alert("❌ Cập nhật thất bại");
  }
  }
}

function addproducts() {
  const loginModal = document.getElementById('addActionModal');
    loginModal.classList.add('show');
}

function CloseModal() {
  const loginModal = document.getElementById('addActionModal');
    loginModal.classList.remove('show');
}

async function loadData() {
  let name = document.getElementById("searchName").value.trim();
  window.location.href = `/taikhoan/getall?name=${name}`;
}

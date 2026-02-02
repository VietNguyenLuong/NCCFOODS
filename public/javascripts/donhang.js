let  donhang_id = null;
function openImageModal(imageUrl,id) {
    const modal = document.getElementById("imageModal");
    const img = document.getElementById("modalImage");
    donhang_id = id;

    img.src = imageUrl;
    modal.style.display = "flex";
  }

  function closeImageModal() {
    const modal = document.getElementById("imageModal");
    const img = document.getElementById("modalImage");
    img.src = "";
    modal.style.display = "none";
  }

  function closePaymentModal() {
  document.getElementById("imageModal").style.display = "none";
}
async function deleteSP(id) {
  if (confirm("Bạn có chắc muốn xóa không?")) {
    const res = await fetch(`/donhang/delete/${id}`, { method: "DELETE" });
    if (res.ok) {
      location.reload(); // load lại danh sách
    } else {
      alert("❌ Xóa thất bại");
    }
  }
}
async function XacNhan(status) {
  const request = {
        id: donhang_id,
        status: status,
        }
  if (confirm("Bạn có chắc muốn xác nhận không?")) {
    const res = await fetch(`/donhang/updatestatus`, { method: "POST", headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request) },);
    if (res.ok) {
      location.reload(); // load lại danh sách
    } else {
      alert("❌ Xác nhận thất bại");
    }
  }
}
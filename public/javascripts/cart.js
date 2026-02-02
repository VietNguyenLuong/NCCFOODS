async function updateQty(itemId, qty,order_id) {
  qty = parseInt(qty);

  // validate
  if (isNaN(qty) || qty < 1) {
    alert("Số lượng phải lớn hơn hoặc bằng 1");
    return;
  }

  try {
    const res = await fetch("/giohang/update-qty", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itemId: itemId,
        quantity: qty,
        order_id: order_id
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Cập nhật thất bại");
      return;
    }

    // Reload lại trang cho đơn giản
    showSuccess(data.message);
    // ❗ Nếu muốn update DOM không reload → nói mình làm tiếp
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra, vui lòng thử lại");
  }
}
async function XacNhan(status, id) {
  const request = {
        id: id,
        status: status,
        }
  
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
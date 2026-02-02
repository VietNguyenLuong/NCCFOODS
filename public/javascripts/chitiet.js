
const userChiTiet = JSON.parse(sessionStorage.getItem("user"));

function setGioHang(arr) {
  sessionStorage.setItem("giohang", JSON.stringify(arr));
}
function getGioHang() {
  return JSON.parse(sessionStorage.getItem("giohang")) || [];
}

async function ThemGioHang(id) {
  const value = document.getElementById("number_sp").value;
        const res = await fetch(`/sanpham/ThemVaoGioHang/${id}`, { method: "GET" });
        const data = await res.json(); // ⭐ QUAN TRỌNG
       
        if (userChiTiet== null) {
        if (res.ok) {
        const giohang = getGioHang();
        const index = giohang.findIndex(item => item.id === data._id);

        if (index !== -1) {
          // 👉 đã có → cộng thêm quantity
          giohang[index].quantity += Number(value);
        } else {
          // 👉 chưa có → thêm mới
          giohang.push({
            id: data._id,
            image_url: data.image_url,
            name: data.name,
            price: Number(data.price.$numberDecimal),
            quantity: Number(value),
            user_id: null
          });
        }
        setGioHang(giohang);
         showSuccess("Thêm thành công!");
    } else {
      showError("Thất bại!");
    }
}
else{
 console.log(userChiTiet)
  const resdata = await fetch(`/giohang/getbyuser/${userChiTiet._id}`, { method: "GET" });
    const data = await resdata.json();
   const index = data.findIndex(item => item.product_id === id);
if (index !== -1) {
      const request = {
    product_id: id,
    quantity: value,
    user_id: userChiTiet._id
  };

  const res = await fetch("/giohang/checkthemmoi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });
if (res.ok) {
      showSuccess("Thêm thành công!");
    } else {
      showError("Vui lòng kiểm tra lại thông tin!");
    }
}else{
    const request = {
        product_id: id,
        quantity: value,
        user_id : userChiTiet?._id
        }
    const res = await fetch("/giohang/themmoi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
  }
    if (res.ok) {
      showSuccess("Thêm thành công!");
    } else {
      showError("Vui lòng kiểm tra lại thông tin!");
    }
    }
}

function increaseQty() {
  const input = document.getElementById("number_sp");
  let value = parseInt(input.value) || 1;
  input.value = value + 1;
}

function decreaseQty() {
  const input = document.getElementById("number_sp");
  let value = parseInt(input.value) || 1;

  if (value > 1) {
    input.value = value - 1;
  }
}

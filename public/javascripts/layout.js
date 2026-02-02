const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobileMenu');
const cartbadge  = document.getElementById('cart-badge');
const arrayId = [];
const user = JSON.parse(sessionStorage.getItem("user"));

if (user) {
  document.getElementById("username_token").innerText = "Xin chào " + user.username;
}
async function loadCartBadge() {
  if(user != null){
  const res = await fetch(`/giohang/getbyuser/${user._id}`);
  const data = await res.json();
  cartbadge.innerHTML = data.length;
  }
  const rescategory = await fetch('/nhomsanpham/getall');
  const datacategory = await rescategory.json();
  renderMobileMenu(datacategory)
}
function renderMobileMenu(categories) {
  const ul = document.querySelector(".menu-mobile-list");
  if (!ul || categories.length === 0) return;

  let html = "";

  categories.forEach(item => {
    html += `
      <li>
        <a href="/sanpham/getbycategory/${item._id}">
          ${item.ten_nhom}
        </a>
      </li>
    `;
  });

  ul.insertAdjacentHTML("beforeend", html);
}
function SelectedItem(id) {
  if (arrayId.includes(id)) {
    // đã tồn tại → xóa
    const index = arrayId.indexOf(id);
    arrayId.splice(index, 1);
  
  } else {
    // chưa có → thêm
    arrayId.push(id);
  }
}
loadCartBadge();

  menuToggle.onclick = () => {
    mobileMenu.classList.add('active');
  };

  menuClose.onclick = () => {
    mobileMenu.classList.remove('active');
  };

  // Toggle submenu
  document.querySelectorAll('.menu-parent').forEach(item => {
    item.onclick = () => {
      item.parentElement.classList.toggle('open');
    };
  });
  document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartBtn");
  const cartPopup = document.getElementById("cartPopup");

  if (!cartBtn || !cartPopup) return;

  cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    cartPopup.classList.toggle("active");
  });

  // document.addEventListener("click", () => {
  //   cartPopup.classList.remove("active");
  // });
});

const loginBtn = document.getElementById('btnLogin');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.modal-close');
const overlay = document.querySelector('.modal-overlay');

loginBtn.onclick = () => {
  if (user) {
  window.location.href = `/donhang/getbyuser/${user._id}`;
}else{
  loginModal.classList.add('show');
}
};

closeBtn.onclick = overlay.onclick = () => {
  loginModal.classList.remove('show');
};

const btnAsign = document.getElementById('btnAsign');
const loginModalTaiKhoan = document.getElementById('loginModalTaiKhoan');
const closeAsign = document.querySelector('.modal-closeAsign');
const overlayAsign = document.querySelector('.modal-overlayAsign');

btnAsign.onclick = () => {
  loginModalTaiKhoan.classList.add('show');
};

closeAsign.onclick = overlayAsign.onclick = () => {
  loginModalTaiKhoan.classList.remove('show');
};
document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/taikhoan/login", {
    method: "POST",
    headers: {
  "Content-Type": "application/json"
},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    showError("Đăng nhập không thành công!");
    return;
  }
window.location.reload();
  // 🔥 LƯU TOKEN
  sessionStorage.setItem("access_token", data.access_token);

  // 🔥 LƯU USER
  sessionStorage.setItem("user", JSON.stringify(data.user));

const user = JSON.parse(sessionStorage.getItem("user"));

if (user) {
  document.getElementById("username_token").innerText = "Xin chào " + user.username;
}
loginModal.classList.remove('show');
showSuccess("Đăng nhập thành công!");
});


async function loadCart() {
  let cart = [];
  let userlayout = JSON.parse(sessionStorage.getItem("user"));
  try {
    const res = await fetch(`/giohang/getbyuser/${userlayout._id}`, { method: "GET" });
    const data = await res.json();
    if (data && data.length > 0) {
      // ✅ ƯU TIÊN CART SERVER
      cart = data;
      sessionStorage.setItem("giohang", JSON.stringify(cart));
    } else {
      // ❌ SERVER KHÔNG CÓ → LẤY LOCAL
      cart = JSON.parse(sessionStorage.getItem("giohang") || []);
    }

  } catch (err) {
    // ❌ LỖI API → FALLBACK LOCAL
    cart = JSON.parse(sessionStorage.getItem("giohang") || []);
  }
  renderCart(cart);
}


function renderCart(cart) {
  const cartList = document.querySelector(".cart-list");
  const cartTotal = document.querySelector(".cart-total strong");

  // 🔑 đảm bảo cart luôn là mảng
  cart = Array.isArray(cart) ? cart : [];

  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        <span class="icon">🛒</span>
        <p>Hiện chưa có sản phẩm</p>
      </div>
    `;
    cartTotal.innerText = "0đ";
    return;
  }

  // build html 1 lần (tối ưu)
  let html = "";

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;

    total += price * qty;

    html += `
      <div class="cart-item">
        <input type="checkbox" onclick="SelectedItem('${item._id}')" />
        <img src="${item.image_url}" />
        <div class="cart-info">
          <p class="name">${item.name}</p>
          <p class="price">
            ${price.toLocaleString('ko-KR', {
              style: 'currency',
              currency: 'KRW'
            })}
          </p>
        </div>
        <span class="qty">x${qty}</span>
        <span class="qty-delete" onclick="removeItem('${item._id}')">x</span>
      </div>
    `;
  });

  cartList.innerHTML = html;
  cartTotal.innerText = total.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
}

const modal = document.getElementById("notifyModal");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

function showSuccess(message) {
    modal.className = "modal-overlay modal-success";
    modalIcon.innerText = "✔";
    modalTitle.innerText = "Thành công";
    modalMessage.innerText = message;
    modal.style.display = "flex";
}

function showError(message) {
    modal.className = "modal-overlay modal-error";
    modalIcon.innerText = "✖";
    modalTitle.innerText = "Thất bại";
    modalMessage.innerText = message;
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

async function openPaymentModal() {
  const restongtien = await fetch("/donhang/tonghoadonmes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ arrayId })
});
const data = await restongtien.json(); // 👈 PHẢI CÓ DÒNG NÀY
const newdata = convertTextToKRW(data.text);
console.log(newdata)
const textKhongDau = removeVietnameseTones(newdata);
const total = Number(data.total.$numberDecimal)+ 4000;
  document.getElementById("notebill").value = textKhongDau + ' + 4k thecbe - Tổng: '+ total.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' });
  document.getElementById("paymentModal").style.display = "flex";
}

function closePaymentModal() {
  document.getElementById("paymentModal").style.display = "none";
}



async function Order()
{
  const username_bill = document.getElementById("username_bill").value;
  const phone_bill = document.getElementById("phone_bill").value;
  const address_bill = document.getElementById("address_bill").value;
  const cartIds = arrayId.map(id => id);
  const fileInput = document.getElementById("billFile");
 const file = fileInput.files[0]; // LẤY FILE NGAY

  const fileName = file ? file.name : "";
  if(file == undefined || fileName== undefined){
     closePaymentModal();
    showError("Chưa có bill chuyển khoản!");
    return;
  }
const restongtien = await fetch("/donhang/tinhtongtien", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ arrayId })
});
const result = await restongtien.json();
const totalMoney = result.total || 0;
console.log(totalMoney)
const formData = new FormData();

formData.append("listId", JSON.stringify(arrayId));
formData.append("quantity", totalMoney.$numberDecimal + 4000);
formData.append("user_id", user?._id);
formData.append("username", username_bill);
formData.append("phone", phone_bill);
formData.append("address", address_bill);

// file lấy từ input type="file"
formData.append("image", document.getElementById("billFile").files[0]);
const res = await fetch("/donhang/themmoi", {
  method: "POST",
  body: formData // ❌ KHÔNG set Content-Type
});
    if (!res.ok) {
    showError("Đặt hàng không thành công!");
    return;
  }else{
    sessionStorage.setItem("giohang", JSON.stringify('[]'))
    closePaymentModal();
    showSuccess("Đặt hàng thành công!");
  }
}

 document.getElementById("billFile").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById("preview");
        preview.src = e.target.result;
        preview.style.display = "block";
      }
      reader.readAsDataURL(file);
    }
  });

 async function searchProduct () {

  const value  = document.getElementById('name_product').value;
      const res = await fetch(`/?name=${encodeURIComponent(value)}`, {
    method: "GET"
  });
  }

 async function removeItem(id){
     const res = await fetch(`/giohang/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    });
     if (!res.ok) {
    showError("Xóa không thành công!");
    return;
  }else{
    sessionStorage.setItem("giohang", JSON.stringify('[]'))
    closePaymentModal();
    showSuccess("Xóa thành công!");
  }
  }

  function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
function convertTextToKRW(text) {
  return text.replace(/\((\d+)đ\)/g, (_, price) => {
    return `(${Number(price).toLocaleString("ko-KR", {
      style: "currency",
      currency: "KRW"
    })})`;
  });
}

function PostMess(){
const noteValue = document.getElementById("notebill").value;
const phone = "0355497418";

window.open(
  `https://wa.me/${phone}?text=${encodeURIComponent(noteValue)}`,
  "_blank"
);
}

function PostZalo(){
  const noteValue = document.getElementById("notebill").value;
const url = `https://zalo.me/share?url=&title=${encodeURIComponent(noteValue)}`;
window.open(url, "_blank");

}
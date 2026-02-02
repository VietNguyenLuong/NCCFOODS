const userTaiKhoan = JSON.parse(sessionStorage.getItem("user"));
document.querySelectorAll('.sidebar-menu a').forEach(menu => {
  menu.addEventListener('click', function (e) {
    e.preventDefault();

    // active menu
    document.querySelectorAll('.sidebar-menu a')
      .forEach(i => i.classList.remove('active'));
    this.classList.add('active');

    // show content
    const target = this.dataset.target;
    document.querySelectorAll('.content-section')
      .forEach(section => section.classList.remove('active'));

    document.getElementById(target).classList.add('active');
  });
});
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
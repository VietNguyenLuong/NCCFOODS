function previewImage(event) {
  const input = event.target;
  const preview = document.getElementById('preview');

  // Không có file thì thôi
  if (!input.files || !input.files[0]) {
    preview.src = '';
    preview.style.display = 'none';
    return;
  }

  const file = input.files[0];

  // Chỉ cho phép ảnh
  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file ảnh');
    input.value = '';
    preview.style.display = 'none';
    return;
  }

  // Hiển thị ảnh preview
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
}
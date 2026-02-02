const slides = document.querySelector('.slides');

const slideCount = document.querySelectorAll('.slide').length;
let index = 0;

function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
}

function nextSlide() {
  index = (index + 1) % slideCount;
  showSlide(index);
}

function prevSlide() {
  index = (index - 1 + slideCount) % slideCount;
  showSlide(index);
}

document.querySelector('.next').onclick = nextSlide;
document.querySelector('.prev').onclick = prevSlide;

setInterval(nextSlide, 4000);


// const track = document.querySelector('.partner-track');

// let offset = 0;

// setInterval(() => {
//   offset += 1;
//   track.scrollLeft += 1;
// }, 30);
load();

async function load() {
  const rescategory = await fetch('/nhomsanpham/getall');
  const datacategory = await rescategory.json();
  renderMenu(datacategory)
}
function renderMenu(categories) {
  const ul = document.querySelector(".menu-list");
  if (!ul || !Array.isArray(categories) || categories.length === 0) return;

  let html = "";

  categories.forEach(item => {
    html += `
      <li class="menu-item">
        <a href="/sanpham/getbycategory/${item._id}">
          ${item.ten_nhom}
        </a>
      </li>
    `;
  });

  ul.insertAdjacentHTML("beforeend", html);
}


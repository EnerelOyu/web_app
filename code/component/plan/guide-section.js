// Sample guides data (in real app, fetch from API)
const guides = [
  {
    id: 'g1',
    name: 'Дорж',
    phone: '+97690909909',
    rating: 4.4,
    area: 'Улаанбаатар, Төв талбай',
    photo: '../files/guide-img/zurag.jpg' 
  },
  {
    id: 'g2',
    name: 'Саран',
    phone: '+97699001122',
    rating: 5.0,
    area: 'Хангай, Баруун хэсэг',
    photo: '../files/guide-img/zurag.jpg'
  },
  {
    id: 'g3',
    name: 'Бат',
    phone: '+97688812233',
    rating: 3.8,
    area: 'Хэнтий, Зүүн бүс',
    photo: '../files/guide-img/zurag.jpg'
  }
];

// Initialize inst widget
(function initInstWidget() {
  const select = document.getElementById('guideSelect');
  const card = document.getElementById('instCard');
  const nameEl = document.getElementById('instName');
  const photoEl = document.getElementById('instPhoto');
  const ratingEl = document.getElementById('instRating');
  const areaEl = document.getElementById('instArea');
  const phoneEl = document.getElementById('instPhone');
  const contactBtn = document.getElementById('contactBtn');
  const profileBtn = document.getElementById('profileBtn');

  // populate select
  guides.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = `${g.name} — ${g.area.split(',')[0]}`;
    select.appendChild(opt);
  });

  // render star icons (read-only)
  function starsHtml(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        html += `<svg class="star" width="14" height="14" aria-hidden="true"><use href="../styles/icons.svg#icon-star-filled"></use></svg>`;
      } else if (i === full && half) {
        html += `<svg class="star" width="14" height="14" aria-hidden="true"><use href="../styles/icons.svg#icon-star-half"></use></svg>`;
      } else {
        html += `<svg class="star" width="14" height="14" aria-hidden="true"><use href="../styles/icons.svg#icon-star-unfilled"></use></svg>`;
      }
    }
    html += `<span style="margin-left:.5rem;color:#435963;font-size:.95rem">${rating.toFixed(1)}</span>`;
    return html;
  }

  // show guide info in card
  function showGuide(id) {
    const g = guides.find(x => x.id === id);
    if (!g) {
      card.hidden = true;
      return;
    }
    nameEl.textContent = g.name;
    photoEl.src = g.photo;
    areaEl.textContent = g.area;
    phoneEl.textContent = g.phone;
    phoneEl.href = `tel:${g.phone.replace(/\s+/g,'')}`;
    ratingEl.innerHTML = starsHtml(g.rating);
    card.hidden = false;
  }

  // event listeners
  select.addEventListener('change', () => {
    const id = select.value;
    showGuide(id);
  });

  contactBtn.addEventListener('click', () => {
    const id = select.value;
    const g = guides.find(x => x.id === id);
    if (!g) return alert('Хөтөч сонгоно уу.');
    // example: open phone or send booking request
    window.location.href = `tel:${g.phone.replace(/\s+/g,'')}`;
  });

  profileBtn.addEventListener('click', () => {
    const id = select.value;
    const g = guides.find(x => x.id === id);
    if (!g) return alert('Хөтөч сонгоно уу.');
    // example: navigate to profile page
    alert(`Орон нутгийн хөтөч ${g.name} -ийн профайл руу шилжих (жишээ).`);
  });

  // If a default guide is desired, uncomment:
  // showGuide(guides[0].id);
})();

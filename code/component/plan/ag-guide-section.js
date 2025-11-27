// Sample guides data
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
  }
];

// Initialize inst widget
function initInstWidget() {
  const select = document.getElementById('guideSelect');
  const card = document.getElementById('instCard');
  const instContainer = document.querySelector('.inst');
  const changeGuideBtn = document.getElementById('changeGuideBtn');
  const nameEl = document.getElementById('instName');
  const photoEl = document.getElementById('instPhoto');
  const ratingEl = document.getElementById('instRating');
  const areaEl = document.getElementById('instArea');
  const phoneEl = document.getElementById('instPhone');
  const contactBtn = document.getElementById('contactBtn');
  const profileBtn = document.getElementById('profileBtn');

  // Populate select options
  guides.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = `${g.name} — ${g.area.split(',')[0]}`;
    select.appendChild(opt);
  });

  // Render star icons
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
    html += `<span style="margin-left:.5rem;color:var(--text-color-3);font-size:.9rem">${rating.toFixed(1)}</span>`;
    return html;
  }

  // Show guide info in card
  function showGuide(id) {
    const g = guides.find(x => x.id === id);
    if (!g) {
      hideGuide();
      return;
    }
    
    nameEl.textContent = g.name;
    photoEl.src = g.photo;
    areaEl.textContent = g.area;
    phoneEl.textContent = g.phone;
    phoneEl.href = `tel:${g.phone.replace(/\s+/g,'')}`;
    ratingEl.innerHTML = starsHtml(g.rating);
    
    // Show card and hide select
    card.classList.add('show');
    instContainer.classList.add('has-guide');
    
    // Store selected guide
    instContainer.setAttribute('data-selected-guide', id);
  }

  // Hide guide and show select
  function hideGuide() {
    card.classList.remove('show');
    instContainer.classList.remove('has-guide');
    select.value = '';
    instContainer.removeAttribute('data-selected-guide');
  }

  // Event listeners
  select.addEventListener('change', () => {
    const id = select.value;
    if (id) {
      showGuide(id);
    } else {
      hideGuide();
    }
  });

  changeGuideBtn.addEventListener('click', () => {
    hideGuide();
    // Focus on select for better UX
    setTimeout(() => {
      select.focus();
    }, 100);
  });

  contactBtn.addEventListener('click', () => {
    const selectedGuideId = instContainer.getAttribute('data-selected-guide');
    const g = guides.find(x => x.id === selectedGuideId);
    if (!g) return alert('Хөтөч сонгоно уу.');
    window.location.href = `tel:${g.phone.replace(/\s+/g,'')}`;
  });

  profileBtn.addEventListener('click', () => {
    const selectedGuideId = instContainer.getAttribute('data-selected-guide');
    const g = guides.find(x => x.id === selectedGuideId);
    if (!g) return alert('Хөтөч сонгоно уу.');
    alert(`Орон нутгийн хөтөч ${g.name} -ийн профайл руу шилжих (жишээ).`);
  });

  // Check if there's a previously selected guide (for persistence)
  const savedGuide = localStorage.getItem('selectedGuide');
  if (savedGuide) {
    select.value = savedGuide;
    if (savedGuide) {
      showGuide(savedGuide);
    }
  }

  // Save selection
  select.addEventListener('change', () => {
    localStorage.setItem('selectedGuide', select.value);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initInstWidget);
// Paste the deployed Google Apps Script Web App URL here, then publish the GitHub Pages update.
const REVIEWS_API_URL = '';
const stars = [...document.querySelectorAll('.star')];
const ratingInput = document.querySelector('#rating');
stars.forEach((star) => star.addEventListener('click', () => {
  const rating = Number(star.dataset.rating);
  ratingInput.value = String(rating);
  stars.forEach((item) => item.classList.toggle('selected', Number(item.dataset.rating) <= rating));
}));

function renderReviews(items) {
  const list = document.querySelector('#reviews-list');
  if (!items.length) return;
  list.innerHTML = items.map((review) => `<article class="review-item"><div><strong>${escapeText(review.name)}</strong> <span class="rating" aria-label="Оценка ${review.rating} из 5">${'★'.repeat(Number(review.rating))}${'☆'.repeat(5 - Number(review.rating))}</span></div><p>${escapeText(review.text)}</p><small class="helper">${escapeText(review.date || '')}</small></article>`).join('');
}
function escapeText(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
if (REVIEWS_API_URL) {
  window.renderBaikalReviews = renderReviews;
  const script = document.createElement('script');
  script.src = `${REVIEWS_API_URL}${REVIEWS_API_URL.includes('?') ? '&' : '?'}callback=renderBaikalReviews`;
  script.onerror = () => { document.querySelector('#reviews-list').innerHTML = '<div class="empty">Не удалось загрузить отзывы. Попробуй позже.</div>'; };
  document.head.append(script);
}

const form = document.querySelector('#review-form');
const frame = document.querySelector('iframe[name="review-frame"]');
let submitted = false;
if (form && frame) {
  frame.addEventListener('load', () => {
    if (!submitted) return;
    const message = document.querySelector('#review-success');
    message.textContent = 'Спасибо! Отзыв принят. Он появится в списке после обновления страницы.';
    message.classList.add('show');
    form.reset(); ratingInput.value = '5'; stars.forEach((item) => item.classList.add('selected'));
    submitted = false;
  });
  form.addEventListener('submit', (event) => {
    if (!REVIEWS_API_URL) {
      event.preventDefault();
      const message = document.querySelector('#review-success');
      message.textContent = 'Форма пока не подключена. Разверни Google Apps Script по инструкции в README.';
      message.classList.add('show');
      return;
    }
    const payload = {name: form.elements.name.value.trim(), rating: Number(ratingInput.value), text: form.elements.text.value.trim()};
    document.querySelector('#review-payload').value = JSON.stringify(payload);
    form.action = REVIEWS_API_URL;
    submitted = true;
    document.querySelector('#review-success').classList.remove('show');
  });
}

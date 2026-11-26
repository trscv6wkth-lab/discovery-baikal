const REVIEWS_API_URL = 'https://script.google.com/macros/s/AKfycbzaLq6n9o69TXBzz6FGGcZyFZF26w21vK76Jrh7B1nCWSc49_hNca_zO1tqQ-CG7glgkg/exec';
const stars = [...document.querySelectorAll('.star')];
const ratingInput = document.querySelector('#rating');
stars.forEach((star) => star.addEventListener('click', () => {
  const rating = Number(star.dataset.rating);
  ratingInput.value = String(rating);
  stars.forEach((item) => item.classList.toggle('selected', Number(item.dataset.rating) <= rating));
}));
function escapeText(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function renderReviews(items) {
  const list = document.querySelector('#reviews-list');
  if (!items.length) return;
  list.innerHTML = items.map((review) => '<article class="review-item"><div><strong>' + escapeText(review.name) + '</strong> <span class="rating">' + '★'.repeat(Number(review.rating)) + '☆'.repeat(5 - Number(review.rating)) + '</span></div><p>' + escapeText(review.text) + '</p><small class="helper">' + escapeText(review.date || '') + '</small></article>').join('');
}
window.renderBaikalReviews = renderReviews;
const script = document.createElement('script');
script.src = REVIEWS_API_URL + '?callback=renderBaikalReviews';
script.onerror = () => { document.querySelector('#reviews-list').innerHTML = '<div class="empty">Не удалось загрузить отзывы. Попробуй позже.</div>'; };
document.head.append(script);
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
  form.addEventListener('submit', () => {
    const payload = {name: form.elements.name.value.trim(), rating: Number(ratingInput.value), text: form.elements.text.value.trim()};
    document.querySelector('#review-payload').value = JSON.stringify(payload);
    form.action = REVIEWS_API_URL;
    submitted = true;
    document.querySelector('#review-success').classList.remove('show');
  });
}

// Создать обработчик URL
function handleUrl(url) {
    document.querySelectorAll('a.active').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('a[href="' + url.split('#').pop() + '"]').forEach(el => el.classList.add('active'));

    alert(url);
}

// Подписаться на изменения URL
window.addEventListener('hashchange', (ev) => handleUrl(ev.newURL));

// При загрузке страницы - считать состояние и запустить обработчик
handleUrl(window.location.href);
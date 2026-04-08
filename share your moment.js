window.onload = function() {
    const saved = JSON.parse(localStorage.getItem('moments')) || [];
    saved.forEach(addMomentToDOM);
};

document.getElementById('moment-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const photoFile = document.getElementById('photo').files[0];
    const address = document.getElementById('address').value;
    const mapUrl = document.getElementById('map').value;
    const cost = document.getElementById('cost').value;

    const reader = new FileReader();
    reader.onload = function() {
        const moment = {
            image: reader.result,
            address,
            mapUrl,
            cost,
            likes: 0
        };

        const saved = JSON.parse(localStorage.getItem('moments')) || [];
        saved.unshift(moment);
        localStorage.setItem('moments', JSON.stringify(saved));

        addMomentToDOM(moment);
    };

    if (photoFile) reader.readAsDataURL(photoFile);

    this.reset();
});

function addMomentToDOM(moment) {
    const card = document.createElement('div');
    card.className = 'moment-card';

    card.innerHTML = `
        <img src="${moment.image}" class="preview-img">
        <div class="card-content">
            <p>📍 ${moment.address}</p>
            <p>💰 $${moment.cost}</p>
            <a href="${moment.mapUrl}" target="_blank">View Map</a>

            <div class="actions">
                <button class="like-btn">❤️ ${moment.likes}</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `;

    // Like feature
    card.querySelector('.like-btn').onclick = function() {
        moment.likes++;
        this.innerText = `❤️ ${moment.likes}`;
        updateStorage();
    };

    // Delete feature
    card.querySelector('.delete-btn').onclick = function() {
        card.remove();
        removeFromStorage(moment);
    };

    document.getElementById('moments-list').prepend(card);
}

function updateStorage() {
    const cards = document.querySelectorAll('.moment-card');
    const data = [];

    cards.forEach(card => {
        const img = card.querySelector('img').src;
        const text = card.querySelectorAll('p');
        const address = text[0].innerText.replace('📍 ', '');
        const cost = text[1].innerText.replace('💰 $', '');
        const mapUrl = card.querySelector('a').href;
        const likes = parseInt(card.querySelector('.like-btn').innerText.replace('❤️ ', ''));

        data.push({ image: img, address, cost, mapUrl, likes });
    });

    localStorage.setItem('moments', JSON.stringify(data));
}

function removeFromStorage(moment) {
    let saved = JSON.parse(localStorage.getItem('moments')) || [];
    saved = saved.filter(m => m.image !== moment.image);
    localStorage.setItem('moments', JSON.stringify(saved));
}
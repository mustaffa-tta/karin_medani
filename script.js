// ===================================
// كرين مدني - ملف الجافا سكريبت (للنسخة الثابتة)
// ===================================

'use strict';

// ---------- بيانات السيارات (مدمجة) ----------
function getCarsData() {
    return [
        { id: 1, make: 'تويوتا', model: 'كوريلا', year: 2007, price: 75000000, city: 'مدني', image: '2005.jpg', description: 'سيارة تويوتا كوريلا 2007، قير عادي، مكيف ممتاز، محرك اقتصادي، عداد 40000 كم.' },
        { id: 2, make: 'تويوتا', model: 'منفوخة', year: 2005, price: 60000000, city: 'مدني', image: '2007.jpg', description: 'تويوتا منفوخة 2005، قير عادي، دفع رباعي، محرك قوي، عداد 750000 كم.' },
        { id: 3, make: 'تويوتا', model: 'هايلوكس بوكس', year: 2017, price: 150000000, city: 'مدني', image: '2017.jpg', description: 'تويوتا هايلوكس بوكس 2017، قير عادي، صندوق خلفي، مناسبة للعمل والتنقل، عداد 100000 كم.' }
    ];
}

// ---------- عرض جميع السيارات في صفحة cars.html ----------
function renderAllCars() {
    const grid = document.getElementById('allCarsGrid');
    if (!grid) return;
    const cars = getCarsData();
    grid.innerHTML = cars.map(car => `
        <div class="car-card" data-city="${car.city}" data-name="${car.make} ${car.model}">
            <div class="car-card-image">
                <img src="images/${car.image}" alt="${car.make} ${car.model}" 
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\'font-size:4rem;\'>🚗</span>';" />
            </div>
            <div class="car-card-body">
                <div class="car-name">${car.make} ${car.model}</div>
                <div class="car-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${car.year}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${car.city}</span>
                </div>
                <div class="car-price">${Number(car.price).toLocaleString()} <span class="currency">ج.س</span></div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
                    <button class="btn btn-primary" onclick="openDetail(${car.id})">📋 تفاصيل</button>
                    <button class="btn btn-secondary" onclick="openBooking(${car.id}, '${car.make} ${car.model}')">📅 حجز</button>
                    <button class="btn btn-danger" onclick="showToast('هذه الميزة متاحة للمسؤول فقط.', 'info')">🗑️ حذف</button>
                </div>
            </div>
        </div>
    `).join('');

    // تعبئة فلتر المدن
    const cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        const cities = [...new Set(cars.map(c => c.city))];
        cityFilter.innerHTML = `<option value="">جميع المدن</option>` + cities.map(c => `<option value="${c}">${c}</option>`).join('');
        cityFilter.addEventListener('change', filterCars);
    }

    // البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('keyup', filterCars);
}

function filterCars() {
    const query = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const city = document.getElementById('cityFilter')?.value || '';
    document.querySelectorAll('.car-card').forEach(card => {
        const name = card.dataset.name?.toLowerCase() || '';
        const cardCity = card.dataset.city || '';
        card.style.display = (name.includes(query) && (city === '' || cardCity === city)) ? 'block' : 'none';
    });
}

// ---------- مودال التفاصيل ----------
function openDetail(id) {
    const car = getCarsData().find(c => c.id === id);
    if (!car) return showToast('السيارة غير موجودة!', 'info');
    document.getElementById('detailTitle').textContent = `${car.make} ${car.model}`;
    document.getElementById('detailContent').innerHTML = `
        <div style="text-align:center; margin-bottom:12px;">
            <img src="images/${car.image}" alt="${car.make} ${car.model}" 
                 style="max-width:100%; max-height:250px; border-radius:8px; object-fit:cover;"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size:4rem;\\'>🚗</span>';" />
        </div>
        <p><strong>الموديل:</strong> ${car.year}</p>
        <p><strong>المدينة:</strong> ${car.city}</p>
        <p><strong>السعر:</strong> ${Number(car.price).toLocaleString()} ج.س</p>
        <p><strong>الوصف:</strong> ${car.description || 'لا يوجد وصف'}</p>
        <hr style="margin:16px 0; border-color:var(--border);" />
        <button class="btn btn-primary" style="width:100%;" onclick="closeModal()">إغلاق</button>
    `;
    document.getElementById('detailModal').classList.add('active');
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// ---------- مودال الحجز ----------
function openBooking(carId, carName) {
    document.getElementById('bookingCarId').value = carId;
    document.getElementById('bookingCarTitle').textContent = carName;
    document.getElementById('bookingMessage').innerHTML = '';
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingModal').classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

// ---------- معالجة نموذج الحجز (localStorage) ----------
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('bookingSubmitBtn');
            if (btn.disabled) return;
            btn.disabled = true;
            btn.innerHTML = '⏳ جاري الإرسال...';

            const data = {
                carId: document.getElementById('bookingCarId').value,
                name: document.getElementById('visitorName').value.trim(),
                phone: document.getElementById('visitorPhone').value.trim(),
                email: document.getElementById('visitorEmail').value.trim(),
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('bookingTime').value
            };

            if (!data.name || !data.phone || !data.date || !data.time) {
                document.getElementById('bookingMessage').innerHTML = '<div style="color:#E94560;">❌ جميع الحقول مطلوبة ما عدا البريد الإلكتروني.</div>';
                btn.disabled = false;
                btn.innerHTML = '📤 تأكيد الحجز';
                return;
            }

            // تخزين في localStorage
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('bookings', JSON.stringify(bookings));

            document.getElementById('bookingMessage').innerHTML = '<div style="background:#d4edda; color:#155724; padding:12px; border-radius:8px;">✅ تم حجز موعدك بنجاح! سنتصل بك قريباً لتأكيد الموعد.</div>';
            setTimeout(() => { closeBookingModal(); showToast('✅ تم الحجز بنجاح!', 'success'); }, 2000);
            btn.disabled = false;
            btn.innerHTML = '📤 تأكيد الحجز';
        });
    }

    // معالجة نموذج التواصل (localStorage)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const msg = document.getElementById('contactMsg').value.trim();
            if (!name || !email || !msg) {
                document.getElementById('contactMessage').innerHTML = '<div style="color:#E94560;">❌ جميع الحقول مطلوبة.</div>';
                return;
            }
            let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            msgs.push({ name, email, msg, timestamp: new Date().toISOString() });
            localStorage.setItem('contactMessages', JSON.stringify(msgs));
            document.getElementById('contactMessage').innerHTML = '<div style="background:#d4edda; color:#155724; padding:12px; border-radius:8px;">✅ تم إرسال رسالتك بنجاح، سنرد عليك قريباً.</div>';
            contactForm.reset();
        });
    }

    // معالجة نموذج تسجيل الدخول (وهمي)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('loginMessage').innerHTML = '<div style="background:#d4edda; color:#155724; padding:12px; border-radius:8px;">✅ تم تسجيل الدخول بنجاح (وهمي).</div>';
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('registerMessage').innerHTML = '<div style="background:#d4edda; color:#155724; padding:12px; border-radius:8px;">✅ تم إنشاء الحساب بنجاح (وهمي).</div>';
        });
    }

    // عرض السيارات في cars.html
    if (document.getElementById('allCarsGrid')) renderAllCars();
});

// ---------- Toast ----------
function showToast(message, type = 'success') {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ---------- دوال مساعدة ----------
function showAddCarMessage() {
    showToast('هذه الميزة متاحة للمسؤول فقط.', 'info');
    // توجيه إلى add-car.html (وهمي)
    window.location.href = 'add-car.html';
}

function switchTab(tab) {
    const login = document.getElementById('loginPanel');
    const register = document.getElementById('registerPanel');
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach((t, i) => t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register')));
    login.style.display = tab === 'login' ? 'block' : 'none';
    register.style.display = tab === 'register' ? 'block' : 'none';
}

// ---------- قائمة الهاتف ----------
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('open');
            if (hamburger) hamburger.classList.remove('active');
        });
    });
});

// جعل الدوال عامة
window.openDetail = openDetail;
window.closeModal = closeModal;
window.openBooking = openBooking;
window.closeBookingModal = closeBookingModal;
window.showAddCarMessage = showAddCarMessage;
window.switchTab = switchTab;
window.showToast = showToast;
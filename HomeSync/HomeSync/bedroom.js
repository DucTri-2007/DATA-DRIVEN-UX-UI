// bedroom.js

function initBedroom() {
    // 1. Ghi đè Nhiệt độ điều hòa thành 23°C khi vào phòng
    localStorage.setItem('bedroomACTemp', 23);
    const tempEl = document.getElementById('ac-temp');
    if (tempEl) {
        tempEl.innerText = '23';
    }

    // 2. Phục hồi Màu đèn ngủ
    const savedColor = localStorage.getItem('bedroomLightColor');
    const colorPicker = document.getElementById('night-light-color');
    if (colorPicker) {
        const nightLightIcon = colorPicker.closest('.control-card').querySelector('.icon-lg');
        if (savedColor) {
            colorPicker.value = savedColor;
            if (nightLightIcon) {
                nightLightIcon.style.color = savedColor;
                nightLightIcon.style.textShadow = `0 0 10px ${savedColor}`;
            }
        }

        colorPicker.addEventListener('change', (e) => {
            const newColor = e.target.value;
            localStorage.setItem('bedroomLightColor', newColor);
            if (nightLightIcon) {
                nightLightIcon.style.color = newColor;
                nightLightIcon.style.textShadow = `0 0 10px ${newColor}`;
            }
            if (typeof window.showToast === 'function') window.showToast('Thành công', 'Đã đổi màu đèn ngủ!');
        });
    }

    // 3. Phục hồi Sliders (Đèn đọc sách và Loa thông minh)
    const sliders = [
        { id: 'read-light-brightness', key: 'bedroomReadingLight', valId: 'read-light-val', msg: 'Đã điều chỉnh mức độ!' },
        { id: 'speaker-volume', key: 'bedroomSpeakerVol', valId: 'speaker-val', msg: 'Đã điều chỉnh mức độ!' }
    ];

    sliders.forEach(config => {
        const el = document.getElementById(config.id);
        const valEl = document.getElementById(config.valId);
        if (el && valEl) {
            const savedVal = localStorage.getItem(config.key);
            if (savedVal !== null) {
                el.value = savedVal;
                valEl.innerText = savedVal + '%';
            }

            el.addEventListener('input', (e) => {
                valEl.innerText = e.target.value + '%';
            });
            el.addEventListener('change', (e) => {
                localStorage.setItem(config.key, e.target.value);
                if (typeof window.showToast === 'function') window.showToast('Thành công', config.msg);
            });
        }
    });

    // 4. Phục hồi Giờ báo thức
    const savedAlarm = localStorage.getItem('bedroomAlarmTime');
    const hourInput = document.getElementById('timer-hour');
    const minInput = document.getElementById('timer-minute');

    if (savedAlarm && hourInput && minInput) {
        const parts = savedAlarm.split(':');
        if (parts.length === 2) {
            hourInput.value = parts[0];
            minInput.value = parts[1];
        }
    }

    // 5. Phục hồi Chế độ ban đêm (Night Mode toggle)
    const nightModeToggle = document.getElementById('night-mode-toggle');
    if (nightModeToggle) {
        const savedNightMode = localStorage.getItem('bedroomNightMode');
        if (savedNightMode !== null) {
            nightModeToggle.checked = (savedNightMode === 'true');
        }
        nightModeToggle.addEventListener('change', (e) => {
            localStorage.setItem('bedroomNightMode', e.target.checked);
            if (typeof window.showToast === 'function') window.showToast('Thành công', 'Đã lưu Chế độ ban đêm!');
        });
    }

    // (Tuỳ chọn: Khôi phục các toggle thiết bị nếu không được globalState.js xử lý)
    // Các thiết bị như ac-bedroom, night-light-bedroom, read-light-bedroom 
    // đã được tự động xử lý bởi globalState.js qua thuộc tính data-device-id
    
    // 6. Tự động BẬT Điều hòa và Đèn ngủ
    let devices = JSON.parse(localStorage.getItem('homeSyncDevices') || '[]');
    const acToggle = document.querySelector('input[data-device-id="ac-bedroom"]');
    const nightLightToggle = document.querySelector('input[data-device-id="night-light-bedroom"]');
    
    if (acToggle) {
        acToggle.checked = true;
        const idx = devices.findIndex(d => d.id === 'ac-bedroom');
        if (idx !== -1) devices[idx].status = 'on';
        else devices.push({ id: 'ac-bedroom', status: 'on' });
    }
    
    if (nightLightToggle) {
        nightLightToggle.checked = true;
        const idx = devices.findIndex(d => d.id === 'night-light-bedroom');
        if (idx !== -1) devices[idx].status = 'on';
        else devices.push({ id: 'night-light-bedroom', status: 'on' });
    }
    localStorage.setItem('homeSyncDevices', JSON.stringify(devices));

    // Hiển thị Toast 1 lần khi bước vào phòng
    if (!sessionStorage.getItem('enteredBedroom')) {
        if (typeof window.showToast === 'function') {
            window.showToast('Tự động hóa', 'Đã bật Điều hòa 23°C và Đèn ngủ', 'success');
        }
        sessionStorage.setItem('enteredBedroom', 'true');
    }
}

// Xử lý nút [+] và [-] của Điều hòa
window.changeTemp = function (delta) {
    const tempEl = document.getElementById('ac-temp');
    if (!tempEl) return;

    let current = parseInt(tempEl.innerText);
    let nextTemp = current + delta;

    if (nextTemp >= 16 && nextTemp <= 30) {
        tempEl.innerText = nextTemp;
        localStorage.setItem('bedroomACTemp', nextTemp);
        if (typeof window.showToast === 'function') window.showToast('Thành công', 'Đã chỉnh nhiệt độ điều hòa!');
    }
};

// Xử lý Form Hẹn giờ
window.saveTimer = function () {
    const hourInput = document.getElementById('timer-hour').value;
    const minInput = document.getElementById('timer-minute').value;

    if (hourInput !== '' && minInput !== '') {
        const h = parseInt(hourInput);
        const m = parseInt(minInput);

        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            const formattedTime = hourInput.padStart(2, '0') + ':' + minInput.padStart(2, '0');
            localStorage.setItem('bedroomAlarmTime', formattedTime);
            if (typeof window.showToast === 'function') window.showToast('Thành công', 'Đã lưu giờ đánh thức!');
            return;
        }
    }
    if (typeof window.showToast === 'function') window.showToast('Lỗi', 'Thời gian không hợp lệ!', 'error');
};

document.addEventListener('DOMContentLoaded', () => {
    initBedroom();

    // Lắng nghe sự kiện click trên Sidebar để kích hoạt tự động hóa rời phòng
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Tự động TẮT Điều hòa và TẮT Đèn ngủ
            let devices = JSON.parse(localStorage.getItem('homeSyncDevices') || '[]');
            ['ac-bedroom', 'night-light-bedroom'].forEach(id => {
                const idx = devices.findIndex(d => d.id === id);
                if (idx !== -1) {
                    devices[idx].status = 'off';
                }
            });
            localStorage.setItem('homeSyncDevices', JSON.stringify(devices));

            // Đặt cờ báo để trang đích hiện Toast
            localStorage.setItem('leftBedroom', 'true');
            
            // Xóa cờ session để khi quay lại bằng Sidebar, Toast tự động hóa sẽ hiện lại
            sessionStorage.removeItem('enteredBedroom');

            // Chuyển trang sau 50ms
            setTimeout(() => {
                window.location.href = href;
            }, 50);
        });
    });
});

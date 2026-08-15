// living_room.js

// Khởi tạo các trạng thái khi trang load
function initLivingRoom() {
    // 1. Ghi đè Chế độ ngữ cảnh thành 'Tiếp khách' mỗi khi vào phòng
    localStorage.setItem('livingRoomMode', 'Tiếp khách');
    const sceneButtons = document.querySelectorAll('.scene-btn');

    sceneButtons.forEach(btn => {
        if (btn.innerText.trim() === 'Tiếp khách') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Ghi đè Toggle máy lọc KK thành BẬT, và Phục hồi Smart TV 
    let devices = JSON.parse(localStorage.getItem('homeSyncDevices') || '[]');
    const tvToggle = document.querySelector('input[data-device-id="tv-living"]');
    const apToggle = document.querySelector('input[data-device-id="air-purifier-living"]');

    if (tvToggle) {
        const tvData = devices.find(d => d.id === 'tv-living');
        if (tvData) tvToggle.checked = (tvData.status === 'on');
    }

    if (apToggle) {
        // Tự động BẬT máy lọc không khí
        apToggle.checked = true;
        const apIndex = devices.findIndex(d => d.id === 'air-purifier-living');
        if (apIndex !== -1) {
            devices[apIndex].status = 'on';
        } else {
            devices.push({ id: 'air-purifier-living', status: 'on' });
        }
        localStorage.setItem('homeSyncDevices', JSON.stringify(devices));
    }

    // Lắng nghe Dropdown chế độ quạt máy lọc (Ghi đè thành Tự động)
    const apSelect = document.getElementById('air-purifier-speed');
    if (apSelect) {
        localStorage.setItem('airPurifierSpeed', 'auto');
        apSelect.value = 'auto';

        apSelect.addEventListener('change', (e) => {
            localStorage.setItem('airPurifierSpeed', e.target.value);
            if (typeof window.showToast === 'function') {
                window.showToast('Thành công', 'Đã chỉnh tốc độ quạt!');
            }
        });
    }

    // 4. Phục hồi 4 thanh Slider (TV Vol, TV Bright, Ceiling Light, Curtain)
    const sliders = [
        { id: 'tv-volume-slider', key: 'tvVolume', msg: 'Đã cập nhật mức độ!', valId: 'vol-val' },
        { id: 'tv-brightness-slider', key: 'tvBrightness', msg: 'Đã cập nhật mức độ!', valId: 'bright-val' },
        { id: 'light-slider', key: 'ceilingLight', msg: 'Đã cập nhật mức độ!', valId: 'light-val' },
        { id: 'curtain-slider', key: 'curtainOpen', msg: 'Đã cập nhật mức độ!', valId: 'curtain-val' }
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

            // Lắng nghe sự kiện input (kéo real-time)
            el.addEventListener('input', (e) => {
                valEl.innerText = e.target.value + '%';
            });

            // Lắng nghe sự kiện change (khi thả chuột)
            el.addEventListener('change', (e) => {
                localStorage.setItem(config.key, e.target.value);
                if (typeof window.showToast === 'function') {
                    window.showToast('Thành công', config.msg);
                }
            });
        }
    });

    // 5. Hiển thị thông báo Tự động hóa một lần duy nhất (không hiện khi F5)
    if (!sessionStorage.getItem('livingRoomAutomated')) {
        if (typeof window.showToast === 'function') {
            window.showToast('Tự động hóa', 'Đã bật Máy lọc không khí và chuyển chế độ Tiếp khách', 'success');
        }
        sessionStorage.setItem('livingRoomAutomated', 'true');
    }
}

// Xử lý nút click Chế độ ngữ cảnh
window.setScene = function (btn) {
    // Xóa active các nút khác
    const buttons = document.querySelectorAll('.scene-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // Thêm active cho nút vừa click
    btn.classList.add('active');

    const modeName = btn.innerText.trim();
    localStorage.setItem('livingRoomMode', modeName);

    if (modeName === 'Ra ngoài') {
        // Tắt máy lọc không khí, đèn trần, TV
        const devicesToTurnOff = ['air-purifier-living', 'light-living', 'tv-living'];
        let devices = JSON.parse(localStorage.getItem('homeSyncDevices') || '[]');

        devicesToTurnOff.forEach(id => {
            const toggle = document.querySelector(`input[data-device-id="${id}"]`);
            if (toggle) toggle.checked = false;

            const deviceIndex = devices.findIndex(d => d.id === id);
            if (deviceIndex !== -1) {
                devices[deviceIndex].status = 'off';
            } else {
                devices.push({ id: id, status: 'off' });
            }
        });
        localStorage.setItem('homeSyncDevices', JSON.stringify(devices));

        // Đặt cờ báo toast xuyên trang
        localStorage.setItem('showAwayToast', 'true');

        if (typeof window.showToast === 'function') {
            window.showToast('Tự động hóa', 'Đã kích hoạt chế độ: Ra ngoài', 'success');
        }
    } else {
        if (typeof window.showToast === 'function') {
            window.showToast('Thành công', `Đã kích hoạt chế độ: ${modeName}`);
        }
    }
};

// Gọi hàm init khi DOM load xong
document.addEventListener('DOMContentLoaded', () => {
    initLivingRoom();

    // Lắng nghe sự kiện click trên Sidebar để kích hoạt tự động hóa
    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');

            // Khi rời đi, đổi mode thành 'Ra ngoài'
            localStorage.setItem('livingRoomMode', 'Ra ngoài');

            // Tắt máy lọc không khí nếu đang Bật
            let devices = JSON.parse(localStorage.getItem('homeSyncDevices') || '[]');
            const apIndex = devices.findIndex(d => d.id === 'air-purifier-living');
            if (apIndex !== -1 && devices[apIndex].status === 'on') {
                devices[apIndex].status = 'off';
                localStorage.setItem('homeSyncDevices', JSON.stringify(devices));
            }

            // Đặt cờ báo để trang đích hiện Toast
            localStorage.setItem('leftLivingRoom', 'true');

            // Xóa cờ session để khi quay lại bằng Sidebar, Toast tự động hóa sẽ hiện lại
            sessionStorage.removeItem('livingRoomAutomated');

            // Chuyển trang sau 50ms
            setTimeout(() => {
                window.location.href = href;
            }, 50);
        });
    });
});

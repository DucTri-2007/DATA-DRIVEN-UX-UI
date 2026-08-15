// globalState.js

// 1. Dữ liệu thiết bị mặc định
const defaultDevices = [
    { id: "light-living", name: "Đèn trần", location: "Phòng khách", status: "on", uptime: "4h 30m", icon: "fa-regular fa-lightbulb" },
    { id: "ac-bedroom", name: "Điều hòa", location: "Phòng ngủ", status: "off", uptime: "0h 0m", icon: "fa-solid fa-snowflake" },
    { id: "curtain-living", name: "Rèm cửa", location: "Phòng khách", status: "on", uptime: "12h 15m", icon: "fa-solid fa-person-shelter" },
    { id: "tv-living", name: "Smart TV", location: "Phòng khách", status: "on", uptime: "1h 20m", icon: "fa-solid fa-tv" },
    { id: "night-light-bedroom", name: "Đèn ngủ", location: "Phòng ngủ", status: "on", uptime: "8h 0m", icon: "fa-solid fa-moon" },
    { id: "read-light-bedroom", name: "Đèn đọc sách", location: "Phòng ngủ", status: "off", uptime: "0h 0m", icon: "fa-solid fa-book-open" },
    { id: "ap-living", name: "Máy lọc không khí", location: "Phòng khách", status: "on", uptime: "2h 30m", icon: "fa-solid fa-wind" },
    { id: "speaker-bedroom", name: "Loa thông minh", location: "Phòng ngủ", status: "off", uptime: "0h 0m", icon: "fa-solid fa-volume-high" },
    { id: "hood-kitchen", name: "Máy hút mùi", location: "Nhà bếp", status: "off", uptime: "0h 0m", icon: "fa-solid fa-fan" },
    { id: "fridge-kitchen", name: "Tủ lạnh", location: "Nhà bếp", status: "on", uptime: "99h", icon: "fa-solid fa-box" },
    { id: "sprinkler-garden", name: "Tưới cây", location: "Sân vườn", status: "off", uptime: "0h 0m", icon: "fa-solid fa-shower" },
    { id: "cam-garden", name: "Camera an ninh", location: "Sân vườn", status: "on", uptime: "24h 0m", icon: "fa-solid fa-video" }
];

// 2. Khởi tạo vào localStorage nếu chưa có
function initGlobalState() {
    let currentDevices = JSON.parse(localStorage.getItem('homeSyncDevices'));
    if (!currentDevices) {
        localStorage.setItem('homeSyncDevices', JSON.stringify(defaultDevices));
    } else {
        // Hợp nhất (Merge) thiết bị mới nếu mảng hiện tại chưa đủ
        let updated = false;
        defaultDevices.forEach(defDev => {
            const exists = currentDevices.find(d => d.id === defDev.id);
            if (!exists) {
                currentDevices.push(defDev);
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem('homeSyncDevices', JSON.stringify(existing));
        }
    }
}

// 3. Các hàm truy xuất và cập nhật trạng thái
function getAllDevices() {
    let devices = JSON.parse(localStorage.getItem('homeSyncDevices') || "[]");

    // Bản vá lỗi icon Đèn ngủ cho client đã lưu cache cũ
    let patched = false;
    devices.forEach(d => {
        if (d.icon === 'fa-solid fa-lamp') {
            d.icon = 'fa-solid fa-moon';
            patched = true;
        }
    });
    if (patched) localStorage.setItem('homeSyncDevices', JSON.stringify(devices));

    return devices;
}

function getDeviceStatus(deviceId) {
    const devices = getAllDevices();
    const device = devices.find(d => d.id === deviceId);
    return device ? device.status : null;
}

function updateDeviceStatus(deviceId, newStatus) {
    const devices = getAllDevices();
    const deviceIndex = devices.findIndex(d => d.id === deviceId);

    if (deviceIndex !== -1) {
        devices[deviceIndex].status = newStatus;
        localStorage.setItem('homeSyncDevices', JSON.stringify(devices));

        // Kích hoạt sự kiện CustomEvent để tab hiện tại biết có sự thay đổi
        window.dispatchEvent(new CustomEvent('deviceUpdated', { detail: { deviceId, newStatus } }));
        console.log(`GlobalState: Đã cập nhật [${deviceId}] -> ${newStatus}`);
    }
}

// 4. Khởi tạo UI: Quét các nút toggle có data-device-id và gán sự kiện
function initDeviceToggles() {
    const toggles = document.querySelectorAll('input[data-device-id]');

    // Cập nhật class active cho Card chứa nút bấm (giao diện)
    const updateCardStyle = (inputElement, status) => {
        const card = inputElement.closest('.device-card, .control-card');
        if (card) {
            if (status === 'on') {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        }
    };

    // Đọc trạng thái ban đầu từ localStorage và áp dụng cho input
    toggles.forEach(toggle => {
        const deviceId = toggle.getAttribute('data-device-id');
        const currentStatus = getDeviceStatus(deviceId);

        if (currentStatus) {
            toggle.checked = (currentStatus === 'on');
            updateCardStyle(toggle, currentStatus);
        }

        // Lắng nghe thao tác của người dùng
        toggle.addEventListener('change', (e) => {
            const newStatus = e.target.checked ? 'on' : 'off';
            updateDeviceStatus(deviceId, newStatus);
            updateCardStyle(e.target, newStatus);
            // Kích hoạt Toast
            if (typeof window.showToast === 'function') {
                window.showToast('Thành công', 'Cập nhật trạng thái thiết bị!');
            }
        });
    });

    // Hàm đồng bộ UI khi có sự thay đổi trạng thái (từ tab khác hoặc event khác)
    const syncUI = () => {
        toggles.forEach(toggle => {
            const deviceId = toggle.getAttribute('data-device-id');
            const status = getDeviceStatus(deviceId);
            if (status) {
                const isChecked = (status === 'on');
                if (toggle.checked !== isChecked) {
                    toggle.checked = isChecked;
                    updateCardStyle(toggle, status);
                }
            }
        });
    };

    // Lắng nghe cập nhật trong cùng 1 tab
    window.addEventListener('deviceUpdated', syncUI);

    // Lắng nghe sự kiện storage (khi đổi state từ tab khác)
    window.addEventListener('storage', (e) => {
        if (e.key === 'homeSyncDevices') {
            syncUI();
        }
    });
}

// 5. Khởi tạo UI: Quét các thanh slider (range) và gán sự kiện change
function initSliders() {
    const sliders = document.querySelectorAll('input[type="range"].custom-slider');
    sliders.forEach(slider => {
        slider.addEventListener('change', (e) => {
            // Skip global toast when element opts out
            if (slider.hasAttribute('data-no-global-toast')) return;
            if (typeof window.showToast === 'function') {
                window.showToast('Thành công', 'Cập nhật thiết bị thành công!');
            }
        });
    });
}

// 6. Cơ chế Toast Notification Toàn Cục
window.showToast = function (title, message, type = 'success') {
    // Xóa toast cũ nếu có để tránh trùng lặp DOM
    const oldToast = document.getElementById('global-toast');
    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;

    const iconClass = type === 'error' ? 'fa-solid fa-xmark' : 'fa-solid fa-check';

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-message">
                <span class="toast-title">${title}</span>
                <span class="toast-desc">${message}</span>
            </div>
        </div>
        <div class="toast-progress"></div>
    `;

    document.body.appendChild(toast);

    // Kích hoạt animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Tự động xóa khỏi DOM sau 3.4s (3s của progress bar + 0.4s fade out)
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
};

// Chạy code khi HTML đã load xong
document.addEventListener('DOMContentLoaded', () => {
    initGlobalState();
    initDeviceToggles();
    initSliders();

    // Đặt class active cho sidebar dựa trên đường dẫn hiện tại
    try {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.menu a').forEach(a => {
            const href = a.getAttribute('href');
            if (href === current) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    } catch (err) {
        // ignore if menu not present yet
    }

    // Hiển thị toast xuyên trang cho chế độ "Ra ngoài"
    if (localStorage.getItem('showAwayToast') === 'true') {
        if (typeof window.showToast === 'function') {
            window.showToast('Tự động hóa', 'Đã tắt Máy lọc không khí và Đèn vì bạn chọn chế độ Ra ngoài.', 'success');
        }
        localStorage.removeItem('showAwayToast'); // Xóa cờ để không hiện lại ở lần load sau
    }

    // Hiển thị toast xuyên trang khi rời khỏi phòng khách
    if (localStorage.getItem('leftLivingRoom') === 'true') {
        if (typeof window.showToast === 'function') {
            window.showToast('Tự động hóa', 'Đã chuyển Phòng khách sang chế độ Ra ngoài & Tắt máy lọc không khí.', 'success');
        }
        localStorage.removeItem('leftLivingRoom');
    }

    // Hiển thị toast xuyên trang khi rời khỏi phòng ngủ
    if (localStorage.getItem('leftBedroom') === 'true') {
        if (typeof window.showToast === 'function') {
            window.showToast('Tự động hóa', 'Đã tự động tắt Điều hòa và Đèn ngủ.', 'success');
        }
        localStorage.removeItem('leftBedroom');
    }
});

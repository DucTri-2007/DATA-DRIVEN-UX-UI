document.addEventListener('DOMContentLoaded', () => {
    // 1. Đổi mật khẩu
    const btnChangePassword = document.querySelectorAll('.profile-menu-item')[0];
    const passwordModal = document.getElementById('passwordModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    
    if (btnChangePassword && passwordModal) {
        btnChangePassword.addEventListener('click', (e) => {
            e.preventDefault();
            passwordModal.classList.add('active');
        });
        closePasswordModal.addEventListener('click', () => {
            passwordModal.classList.remove('active');
        });
    }

    // 2. Cài đặt thông báo
    const btnNotification = document.querySelectorAll('.profile-menu-item')[1];
    const notificationModal = document.getElementById('notificationModal');
    const closeNotificationModal = document.getElementById('closeNotificationModal');
    
    if (btnNotification && notificationModal) {
        btnNotification.addEventListener('click', (e) => {
            e.preventDefault();
            notificationModal.classList.add('active');
        });
        closeNotificationModal.addEventListener('click', () => {
            notificationModal.classList.remove('active');
        });
    }

    // 3. Đăng xuất
    const btnLogout = document.querySelectorAll('.profile-menu-item')[2];
    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?')) {
                alert('Đăng xuất thành công!');
                window.location.href = 'index.html';
            }
        });
    }
});

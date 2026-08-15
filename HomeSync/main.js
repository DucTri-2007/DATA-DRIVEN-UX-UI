document.addEventListener('DOMContentLoaded', () => {
    // Tìm tất cả các nút công tắc thiết bị có class 'device-toggle'
    const toggles = document.querySelectorAll('.device-toggle');

    // Hàm áp dụng giao diện .active cho thẻ chứa thiết bị (device-card) dựa vào trạng thái checked
    function updateCardStyle(inputElement) {
        // Tìm thẻ card gần nhất chứa nút input này
        const card = inputElement.closest('.device-card');
        if (!card) return;

        if (inputElement.checked) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    }

    toggles.forEach(toggle => {
        const id = toggle.id;

        // 1. Khôi phục trạng thái từ localStorage (nếu có)
        // localStorage lưu giá trị dưới dạng string 'true' hoặc 'false'
        const savedState = localStorage.getItem(id);

        if (savedState !== null) {
            toggle.checked = (savedState === 'true');
        }

        // Cập nhật lại giao diện CSS lúc mới load
        updateCardStyle(toggle);

        // 2. Lắng nghe sự kiện click/change để lưu lại trạng thái mới
        toggle.addEventListener('change', (event) => {
            const isChecked = event.target.checked;

            // Lưu trạng thái mới vào localStorage
            localStorage.setItem(id, isChecked);

            // Cập nhật lại giao diện (thêm/bớt class active cho device-card)
            updateCardStyle(event.target);

            console.log(`Đã lưu trạng thái thiết bị [${id}]: ${isChecked ? 'BẬT' : 'TẮT'}`);
        });
    });
});

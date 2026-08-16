document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Chú ý: Vì mỗi mục trỏ đến 1 trang HTML khác nhau, đoạn code này 
            // có thể không giữ được class 'active' sau khi load trang mới.
            // Trạng thái active đã được hardcode chuẩn ở từng file HTML.
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

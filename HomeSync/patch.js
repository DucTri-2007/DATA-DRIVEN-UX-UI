const fs = require('fs');
const files = ['index.html', 'living_room.html', 'bedroom.html', 'devices.html', 'settings.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Find the end of the bedroom link block
    const searchString = '<span>Phòng ngủ</span>\r\n                </a>';
    const searchString2 = '<span>Phòng ngủ</span>\n                </a>';

    let replacement = `<span>Phòng ngủ</span>
                </a>
                <a href="kitchen.html" class="menu-item">
                    <i class="fa-solid fa-fire-burner"></i>
                    <span>Nhà bếp</span>
                </a>
                <a href="garden.html" class="menu-item">
                    <i class="fa-solid fa-tree"></i>
                    <span>Sân vườn</span>
                </a>`;

    if (content.includes(searchString)) {
        content = content.replace(searchString, replacement.replace(/\n/g, '\r\n'));
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    } else if (content.includes(searchString2)) {
        content = content.replace(searchString2, replacement);
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    } else {
        console.log('Skipped ' + file + ' (pattern not found)');
    }
});

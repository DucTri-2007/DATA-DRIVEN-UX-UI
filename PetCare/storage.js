const mockPets = [
    { id: 1, name: 'Lulu', breed: 'Poodle', weight: '4', age: '2', avatar: '🐶' },
    { id: 2, name: 'Mimi', breed: 'Mèo Anh Lông', weight: '5', age: '3', avatar: '🐱' }
];

const getPets = () => {
    let pets = JSON.parse(localStorage.getItem('pets'));
    if (!pets || pets.length === 0) {
        pets = mockPets;
        localStorage.setItem('pets', JSON.stringify(pets));
    }
    return pets;
};

const savePet = (pet) => {
    const pets = getPets();
    pets.push(pet);
    localStorage.setItem('pets', JSON.stringify(pets));
    if (typeof renderPets === 'function') {
        renderPets();
    }
    updateDropdowns(); // Tự động cập nhật danh sách chọn
};

function updateDropdowns() {
    const select = document.getElementById('petSelect'); // ID của ô chọn thú cưng
    if (!select) return;

    const pets = getPets();
    select.innerHTML = '<option value="" disabled selected>-- Vui lòng chọn thú cưng --</option>';
    pets.forEach(pet => {
        const opt = document.createElement('option');
        opt.value = pet.name;
        opt.textContent = `${pet.name} (${pet.breed} - ${pet.weight}kg)`;
        select.appendChild(opt);
    });
}

// Gọi cập nhật dropdowns khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('petSelect')) {
        updateDropdowns();
    }
});

const mockAppointments = [
    { id: 1, service: 'spa', pet: 'Mimi', date: '2026-08-20', time: '10:00', status: 'Sắp tới' }
];

const getAppointments = () => {
    let apps = JSON.parse(localStorage.getItem('appointments'));
    if (!apps) {
        apps = mockAppointments;
        localStorage.setItem('appointments', JSON.stringify(apps));
    }
    return apps;
};

const saveAppointment = (app) => {
    const apps = getAppointments();
    apps.push(app);
    localStorage.setItem('appointments', JSON.stringify(apps));
};


function getPetAvatar(breed) {
    const lowerBreed = breed.toLowerCase();
    if (lowerBreed.includes('poodle') || lowerBreed.includes('chó') || lowerBreed.includes('dog') || lowerBreed.includes('corgi') || lowerBreed.includes('husky')) {
        return '<img src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=150&auto=format&fit=crop&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">'; 
    } else if (lowerBreed.includes('mèo') || lowerBreed.includes('cat') || lowerBreed.includes('anh lông ngắn') || lowerBreed.includes('persian')) {
        return '<img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&auto=format&fit=crop&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
    } else {
        return '<img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&auto=format&fit=crop&q=80" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
    }
}

// Đưa renderPets ra global scope để storage.js có thể gọi
function renderPets() {
    const petsContainer = document.getElementById('pets-render-container');
    if (!petsContainer) return;
    
    petsContainer.innerHTML = '';
    const pets = getPets();
    pets.forEach(pet => {
        let avatarHTML = pet.avatar.includes('<img') ? pet.avatar : `<div style="font-size: 2.5rem;">${pet.avatar}</div>`;
        petsContainer.innerHTML += `
            <div class="pet-card" style="padding: 15px; width: 100%;">
                <div class="pet-avatar" style="width: 70px; height: 70px; display:flex; align-items:center; justify-content:center; margin: 0 auto 10px;">${avatarHTML}</div>
                <h3 class="pet-name" style="font-size: 16px; margin-bottom: 5px;">${pet.name}</h3>
                <div class="pet-info" style="font-size: 11px;">
                    <p>${pet.breed}</p>
                    <p>${pet.weight}kg | ${pet.age} tuổi</p>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Render Thú cưng khi tải trang
    if (document.getElementById('pets-render-container')) {
        renderPets();
    }

    // Modal Logic
    const btnOpenAddPet = document.getElementById('btnOpenAddPet');
    const addPetModal = document.getElementById('addPetModal');
    const closePetModal = document.getElementById('closePetModal');
    const addPetForm = document.getElementById('addPetForm');

    if (btnOpenAddPet && addPetModal) {
        btnOpenAddPet.addEventListener('click', () => {
            addPetModal.classList.add('active');
        });

        closePetModal.addEventListener('click', () => {
            addPetModal.classList.remove('active');
        });

        addPetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('petName').value;
            const breed = document.getElementById('petBreed').value;
            const weight = document.getElementById('petWeight').value;
            const age = document.getElementById('petAge').value;
            const avatar = getPetAvatar(breed);

            const newPet = {
                id: Date.now(),
                name,
                breed,
                weight,
                age,
                avatar
            };

            savePet(newPet);
            
            addPetForm.reset();
            addPetModal.classList.remove('active');
        });

        // Tự động mở form nếu có tham số action=add trên URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'add') {
            addPetModal.classList.add('active');
        }
    }

    // Render Lịch hẹn
    const appointmentsContainer = document.getElementById('appointments-render-container');
    if (appointmentsContainer) {
        appointmentsContainer.innerHTML = '';
        const apps = getAppointments();
        apps.forEach(app => {
            appointmentsContainer.innerHTML += `
                <div style="background: white; border-radius: 16px; padding: 15px; box-shadow: var(--shadow-soft); margin-bottom: 15px; text-align: left; border-left: 5px solid var(--primary-color);">
                    <h4 style="margin-bottom: 8px; color: var(--text-color); font-size: 16px;">${app.service}</h4>
                    <p style="margin-bottom: 4px; color: #636e72; font-size: 13px;"><strong>Thú cưng:</strong> ${app.pet}</p>
                    <p style="margin-bottom: 8px; color: #636e72; font-size: 13px;"><strong>Thời gian:</strong> ${app.time} - ${app.date}</p>
                    <span style="display: inline-block; padding: 4px 12px; background: rgba(0, 206, 201, 0.1); color: var(--secondary-color); border-radius: 12px; font-size: 12px; font-weight: 700;">${app.status}</span>
                </div>
            `;
        });
    }
});



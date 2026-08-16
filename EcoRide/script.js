document.addEventListener('DOMContentLoaded', () => {
    // 1. Logic làm sáng mục Menu đang active (Navbar)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a, .bottom-nav a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Hàm khởi tạo và hiển thị Toast Notification (Global)
    window.showToast = function(title, message, type = 'success') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(toastContainer);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        toast.innerHTML = `
            <div class="toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Xóa toast sau 3s (cộng thêm thời gian animation mờ dần)
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // 3. Logic User Menu Dropdown & CTA
    const userAvatar = document.getElementById('userAvatar');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const userMenuWrapper = document.getElementById('userMenuWrapper');

    if (userAvatar && dropdownMenu) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        window.addEventListener('click', (e) => {
            if (userMenuWrapper && !userMenuWrapper.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    function closeDropdown() {
        if (dropdownMenu) dropdownMenu.classList.remove('show');
    }

    const menuLogout = document.getElementById('menuLogout');
    if (menuLogout) {
        menuLogout.addEventListener('click', (e) => {
            e.preventDefault();
            closeDropdown();
            if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi EcoRide không?')) {
                showToast('Đăng xuất', 'Đang đăng xuất an toàn...', 'warning');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    }

    // 4. Logic Profile Page
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileAddress = document.getElementById('profileAddress');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const displayName = document.getElementById('displayName');

    if (profileName && btnSaveProfile && displayName) {
        // Load data on start
        const savedProfile = localStorage.getItem('ecoUserProfile');
        if (savedProfile) {
            try {
                const userData = JSON.parse(savedProfile);
                if (userData.name) profileName.value = userData.name;
                if (userData.email && profileEmail) profileEmail.value = userData.email;
                if (userData.phone && profilePhone) profilePhone.value = userData.phone;
                if (userData.address && profileAddress) profileAddress.value = userData.address;
                if (userData.name) displayName.textContent = userData.name;
            } catch (e) {
                console.error('Lỗi khi đọc dữ liệu profile', e);
            }
        }

        // Save data on click
        btnSaveProfile.addEventListener('click', (e) => {
            e.preventDefault();
            
            const userData = {
                name: profileName.value,
                email: profileEmail ? profileEmail.value : '',
                phone: profilePhone ? profilePhone.value : '',
                address: profileAddress ? profileAddress.value : ''
            };
            
            localStorage.setItem('ecoUserProfile', JSON.stringify(userData));
            if (window.showToast) {
                window.showToast('Thành công', 'Đã lưu thay đổi thông tin cá nhân!', 'success');
            } else {
                alert('Đã lưu thay đổi thông tin cá nhân!');
            }
            displayName.textContent = userData.name;
        });
    }

    // 5. Logic Trip History & Detail Modal (Dynamic from localStorage)
    const tripTableBody = document.getElementById('tripTableBody');
    const tripModal = document.getElementById('tripDetailModal');
    const closeTripModal = document.getElementById('closeTripModal');

    function renderTripHistory() {
        if (!tripTableBody) return;

        // Dữ liệu mặc định nếu localStorage trống
        let userTrips = JSON.parse(localStorage.getItem('ecoUserTrips')) || [
            { id: '#ECO12345', pickup: '123 Nguyễn Huệ', dropoff: 'Sân bay Tân Sơn Nhất', carType: 'VinFast VF8', status: 'Đã hoàn thành', time: 'Hôm qua, 14:30', price: 125000, distance: 7.5 },
            { id: '#ECO12346', pickup: 'Landmark 81', dropoff: 'Thảo Điền', carType: 'Tesla Model 3', status: 'Đã hoàn thành', time: 'Hôm qua, 09:15', price: 85000, distance: 5.2 }
        ];

        tripTableBody.innerHTML = '';

        if (userTrips.length === 0) {
            tripTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="padding: 40px; text-align: center; color: #6B7280;">
                        <i class="fa-solid fa-car-side" style="font-size: 2.5rem; color: #D1D5DB; margin-bottom: 12px; display: block;"></i>
                        <p style="font-size: 1rem;">Bạn chưa có chuyến đi nào. Hãy đặt xe ngay!</p>
                    </td>
                </tr>`;
            return;
        }

        userTrips.forEach((trip, index) => {
            const isComplete = trip.status === 'Đã hoàn thành';
            const badgeBg = isComplete ? '#D1FAE5' : '#FEF3C7';
            const badgeColor = isComplete ? '#065F46' : '#92400E';

            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #E5E7EB';
            tr.style.transition = 'background-color 0.2s ease';
            tr.addEventListener('mouseenter', () => tr.style.backgroundColor = '#F9FAFB');
            tr.addEventListener('mouseleave', () => tr.style.backgroundColor = '');

            tr.innerHTML = `
                <td style="padding: 15px 20px; font-weight: 500;">${trip.id}</td>
                <td style="padding: 15px 20px;">
                    <div style="font-size: 0.9rem;"><strong>Đi:</strong> ${trip.pickup}</div>
                    <div style="font-size: 0.9rem; color: #6B7280;"><strong>Đến:</strong> ${trip.dropoff}</div>
                    ${trip.time ? `<div style="font-size: 0.8rem; color: #9CA3AF; margin-top: 4px;"><i class="fa-regular fa-clock"></i> ${trip.time}</div>` : ''}
                </td>
                <td style="padding: 15px 20px;">${trip.carType}</td>
                <td style="padding: 15px 20px;">
                    <span class="badge" style="background: ${badgeBg}; color: ${badgeColor}; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">${trip.status}</span>
                </td>
                <td style="padding: 15px 20px;">
                    <a href="#" class="view-trip-detail" data-trip-index="${index}" style="color: var(--primary-color); font-weight: 600;">Xem chi tiết</a>
                </td>
            `;
            tripTableBody.appendChild(tr);
        });

        // Gắn sự kiện cho các nút "Xem chi tiết"
        bindTripDetailEvents(userTrips);
    }

    function bindTripDetailEvents(userTrips) {
        if (!tripModal) return;

        const detailButtons = document.querySelectorAll('.view-trip-detail');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = parseInt(btn.getAttribute('data-trip-index'));
                const trip = userTrips[idx];
                if (!trip) return;

                // Đẩy dữ liệu vào Modal
                document.getElementById('modalTripId').textContent = 'Chi tiết chuyến đi ' + trip.id;
                document.getElementById('modalTripFrom').textContent = trip.pickup;
                document.getElementById('modalTripTo').textContent = trip.dropoff;
                document.getElementById('modalVehicleType').textContent = trip.carType;

                // Driver info (giả lập)
                const driverNames = ['Nguyễn Văn An', 'Trần Minh Đức', 'Lê Hoàng Nam', 'Phạm Quốc Bảo', 'Võ Thanh Tùng'];
                document.getElementById('modalDriverName').textContent = driverNames[idx % driverNames.length];
                document.getElementById('modalPlate').textContent = '51H-' + Math.floor(100 + Math.random() * 900) + '.' + Math.floor(10 + Math.random() * 90);

                const statusContainer = document.getElementById('modalTripStatus');
                if (statusContainer) {
                    const isComplete = trip.status === 'Đã hoàn thành';
                    statusContainer.textContent = trip.status;
                    statusContainer.style.cssText = `background: ${isComplete ? '#D1FAE5' : '#FEF3C7'}; color: ${isComplete ? '#065F46' : '#92400E'}; display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600;`;
                }

                tripModal.style.display = 'flex';
            });
        });

        // Ẩn modal
        const hideModal = () => { tripModal.style.display = 'none'; };

        if (closeTripModal) {
            closeTripModal.addEventListener('click', hideModal);
        }
        tripModal.addEventListener('click', (e) => {
            if (e.target === tripModal) hideModal();
        });
    }

    // Khởi chạy render khi DOM sẵn sàng
    renderTripHistory();

    // --- Global Transaction Logger ---
    window.addEcoTransaction = function(amount, type, description) {
        let transactions = JSON.parse(localStorage.getItem('ecoTransactions')) || [];
        
        const newTx = {
            id: '#TX' + Math.floor(100000 + Math.random() * 900000),
            time: 'Hôm nay, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: (type === 'deposit' ? '+' : '-') + Number(amount).toLocaleString('vi-VN') + ' đ',
            type: type,
            desc: description,
            status: 'Thành công'
        };
        
        transactions.unshift(newTx);
        localStorage.setItem('ecoTransactions', JSON.stringify(transactions));
    };

    // --- Common Functions for Wallet ---
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const renderTransactions = () => {
        const transactionTableBody = document.getElementById('transactionTableBody');
        if (!transactionTableBody) return;
        
        let txHistory = JSON.parse(localStorage.getItem('ecoTransactions'));
        
        transactionTableBody.innerHTML = '';
        
        if (!txHistory || txHistory.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td colspan="4" style="padding: 30px; text-align: center; color: #6B7280; font-size: 0.95rem;">
                    <i class="fa-solid fa-receipt" style="font-size: 2rem; color: #D1D5DB; margin-bottom: 10px;"></i>
                    <p>Chưa có giao dịch nào gần đây.</p>
                </td>
            `;
            transactionTableBody.appendChild(tr);
            return;
        }
        
        txHistory.forEach(tx => {
            const isPositive = tx.type === 'deposit' || tx.amount.startsWith('+');
            const amountColor = isPositive ? '#10B981' : '#EF4444';
            const statusDot = tx.status.includes('Thành công') ? '<i class="fa-solid fa-circle" style="font-size: 0.5rem; color: #10B981; margin-right: 6px; vertical-align: middle;"></i>' : '';
            
            // Fix undefined description
            const cleanDesc = (tx.desc && tx.desc !== 'undefined') ? tx.desc : (tx.type === 'deposit' ? 'Nạp tiền ví EcoPay' : 'Thanh toán dịch vụ EcoRide');

            const tr = document.createElement('tr');
            tr.className = 'transaction-row';
            tr.innerHTML = `
                <td style="padding: 18px 20px; font-weight: 500;">${tx.id}</td>
                <td style="padding: 18px 20px; color: #6B7280; font-size: 0.95rem;">
                    <div style="font-weight: 500; color: #374151;">${tx.time}</div>
                    <div style="font-size: 0.85rem; margin-top: 6px;">${cleanDesc}</div>
                </td>
                <td style="padding: 18px 20px; color: ${amountColor}; font-weight: 700;">${tx.amount}</td>
                <td style="padding: 18px 20px;"><span style="color: #374151; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center;">${statusDot}${tx.status}</span></td>
            `;
            transactionTableBody.appendChild(tr);
        });
    };

    // 6. Logic Wallet
    const currentBalanceEl = document.getElementById('currentBalance');
    if (currentBalanceEl) {
        let balance = parseInt(localStorage.getItem('ecoWalletBalance'));
        if (isNaN(balance)) {
            balance = 1500000;
            localStorage.setItem('ecoWalletBalance', balance);
        }
        currentBalanceEl.textContent = formatCurrency(balance) + ' đ';
        renderTransactions(); // Initial render
    }

    const btnOpenDeposit = document.getElementById('btnOpenDeposit');
    const depositModal = document.getElementById('depositModal');
    const btnCancelDeposit = document.getElementById('btnCancelDeposit');
    const btnConfirmDeposit = document.getElementById('btnConfirmDeposit');
    const depositAmountInput = document.getElementById('depositAmount');
    const depositPills = document.querySelectorAll('.btn-deposit-pill');

    if (btnOpenDeposit && depositModal) {
        const hideDepositModal = () => {
            depositModal.style.display = 'none';
            if (depositAmountInput) depositAmountInput.value = '';
        };

        btnOpenDeposit.addEventListener('click', (e) => {
            e.preventDefault();
            depositModal.style.display = 'flex';
        });

        if (btnCancelDeposit) btnCancelDeposit.addEventListener('click', hideDepositModal);

        depositModal.addEventListener('click', (e) => {
            if (e.target === depositModal) hideDepositModal();
        });

        depositPills.forEach(pill => {
            pill.addEventListener('click', () => {
                if (depositAmountInput) depositAmountInput.value = pill.getAttribute('data-amount');
            });
        });

        if (btnConfirmDeposit) {
            btnConfirmDeposit.addEventListener('click', () => {
                const amount = parseInt(depositAmountInput ? depositAmountInput.value : 0);
                if (!amount || amount <= 0) {
                    if (window.showToast) showToast('Lỗi', 'Vui lòng nhập số tiền hợp lệ!', 'warning');
                    else alert('Vui lòng nhập số tiền hợp lệ!');
                    return;
                }

                // Update balance
                let balance = parseInt(localStorage.getItem('ecoWalletBalance')) || 0;
                balance += amount;
                localStorage.setItem('ecoWalletBalance', balance);
                
                if (currentBalanceEl) currentBalanceEl.textContent = formatCurrency(balance) + ' đ';

                // Add transaction and re-render
                window.addEcoTransaction(amount, 'deposit', 'Nạp tiền vào ví EcoPay');
                renderTransactions();

                hideDepositModal();
                if (window.showToast) {
                    showToast('Thành công', 'Đã nạp thành công số tiền vào ví EcoPay!', 'success');
                } else {
                    alert('Đã nạp thành công!');
                }
            });
        }
    }

    // 7. Logic Mua Gói Eco+
    const buyPlanBtns = document.querySelectorAll('.buy-plan-btn');
    if (buyPlanBtns.length > 0) {
        buyPlanBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const planName = btn.getAttribute('data-name');
                const planPrice = parseInt(btn.getAttribute('data-price'));
                
                let balance = parseInt(localStorage.getItem('ecoWalletBalance'));
                if (isNaN(balance)) {
                    balance = 1500000;
                    localStorage.setItem('ecoWalletBalance', balance);
                }
                
                if (balance < planPrice) {
                    if (window.showToast) {
                        showToast('Thanh toán thất bại', 'Số dư ví không đủ! Vui lòng nạp thêm tiền vào ví EcoPay.', 'error');
                    } else {
                        alert('Số dư ví không đủ! Vui lòng nạp thêm tiền.');
                    }
                    setTimeout(() => {
                        if(confirm('Bạn có muốn chuyển đến trang Ví EcoPay để nạp tiền không?')) {
                            window.location.href = 'wallet.html';
                        }
                    }, 1500);
                    return;
                }
                
                balance -= planPrice;
                localStorage.setItem('ecoWalletBalance', balance);
                
                window.addEcoTransaction(planPrice, 'subscription', 'Đăng ký gói hội viên Eco+');
                // renderTransactions() is not needed here as this is on eco-plus.html where table doesn't exist
                
                if (window.showToast) {
                    showToast('Thành công', `Đã mua ${planName} thành công! Tiền đã được trừ từ ví.`, 'success');
                } else {
                    alert(`Đã mua ${planName} thành công!`);
                }
            });
        });
    }

    // 8. Logic Settings Page
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        const settingPushNotif = document.getElementById('settingPushNotif');
        const settingAutoShare = document.getElementById('settingAutoShare');
        const settingHomeAddress = document.getElementById('settingHomeAddress');
        const settingWorkAddress = document.getElementById('settingWorkAddress');
        const currentPassword = document.getElementById('currentPassword');
        const newPassword = document.getElementById('newPassword');

        // Load settings
        const loadSettings = () => {
            const savedSettings = JSON.parse(localStorage.getItem('ecoSettings'));
            if (savedSettings) {
                if (settingPushNotif) settingPushNotif.checked = savedSettings.pushNotif !== false; // default true
                if (settingAutoShare) settingAutoShare.checked = savedSettings.autoShare === true;
                if (settingHomeAddress) settingHomeAddress.value = savedSettings.homeAddress || '';
                if (settingWorkAddress) settingWorkAddress.value = savedSettings.workAddress || '';
            }
        };

        loadSettings();

        // Save settings
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newSettings = {
                pushNotif: settingPushNotif ? settingPushNotif.checked : true,
                autoShare: settingAutoShare ? settingAutoShare.checked : false,
                homeAddress: settingHomeAddress ? settingHomeAddress.value : '',
                workAddress: settingWorkAddress ? settingWorkAddress.value : ''
            };

            localStorage.setItem('ecoSettings', JSON.stringify(newSettings));

            // Mock password change
            let isPasswordChanged = false;
            if (currentPassword && currentPassword.value && newPassword && newPassword.value) {
                currentPassword.value = '';
                newPassword.value = '';
                isPasswordChanged = true;
            }

            if (window.showToast) {
                if (isPasswordChanged) {
                    window.showToast('Thành công', 'Cấu hình và mật khẩu đã được cập nhật!', 'success');
                } else {
                    window.showToast('Thành công', 'Cấu hình hệ thống đã được lưu!', 'success');
                }
            } else {
                alert('Đã lưu cấu hình!');
            }
        });
    }

    // 9. Logic Khuyến mãi (Vouchers) & Checkout Modal
    const btnSavePromos = document.querySelectorAll('.btn-save-promo');
    const btnUsePromos = document.querySelectorAll('.btn-use-promo');
    
    // Khởi tạo kho voucher nếu chưa có
    let savedPromos = JSON.parse(localStorage.getItem('ecoSavedPromos') || '[]');

    if (btnSavePromos.length > 0) {
        btnSavePromos.forEach(btn => {
            const promoId = btn.getAttribute('data-promo');
            // Check nếu đã lưu thì đổi giao diện nút luôn
            if (savedPromos.find(p => p.id === promoId)) {
                btn.textContent = 'Đã lưu';
                btn.disabled = true;
                btn.style.backgroundColor = '#E5E7EB';
                btn.style.color = '#9CA3AF';
                btn.style.borderColor = '#E5E7EB';
                btn.style.cursor = 'not-allowed';
            }

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const promoName = btn.closest('.promo-card').querySelector('h3').textContent;
                const promoDiscount = parseInt(btn.getAttribute('data-discount'));
                
                savedPromos.push({
                    id: promoId,
                    code: promoId,
                    name: promoName,
                    desc: promoName,
                    discount: promoDiscount
                });
                localStorage.setItem('ecoSavedPromos', JSON.stringify(savedPromos));
                
                btn.textContent = 'Đã lưu';
                btn.disabled = true;
                btn.style.backgroundColor = '#E5E7EB';
                btn.style.color = '#9CA3AF';
                btn.style.borderColor = '#E5E7EB';
                btn.style.cursor = 'not-allowed';

                if (window.showToast) {
                    showToast('Thành công', 'Đã lưu mã ưu đãi vào kho của bạn!', 'success');
                }
            });
        });
    }

    if (btnUsePromos.length > 0) {
        btnUsePromos.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const promoId = btn.getAttribute('data-promo');
                const promoName = btn.closest('.promo-card').querySelector('h3').textContent;
                const promoDiscount = parseInt(btn.getAttribute('data-discount'));
                
                // Tự động lưu nếu chưa lưu (cho loại VIP/HALF50)
                if (!savedPromos.find(p => p.id === promoId)) {
                    savedPromos.push({ id: promoId, code: promoId, name: promoName, desc: promoName, discount: promoDiscount });
                    localStorage.setItem('ecoSavedPromos', JSON.stringify(savedPromos));
                }

                localStorage.setItem('ecoActivePromo', promoId);
                window.location.href = 'index.html';
            });
        });
    }

    // Logic Checkout Modal trên index.html
    const btnOpenCheckout = document.getElementById('btnOpenCheckout');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const btnCancelCheckout = document.getElementById('btnCancelCheckout');
    const btnConfirmCheckout = document.getElementById('btnConfirmCheckout');
    
    if (btnOpenCheckout && checkoutModal) {
        const voucherSelect = document.getElementById('voucherSelect');
        const discountAmountEl = document.getElementById('discountAmount');
        const finalPriceEl = document.getElementById('finalPrice');
        const basePrice = 75000;
        
        const updatePrice = () => {
            const selectedOption = voucherSelect.options[voucherSelect.selectedIndex];
            const discount = parseInt(selectedOption.getAttribute('data-discount') || 0);
            
            if (discount > 0) {
                discountAmountEl.textContent = '-' + formatCurrency(discount) + ' đ';
            } else {
                discountAmountEl.textContent = '-0 đ';
            }
            
            const finalPrice = Math.max(0, basePrice - discount);
            finalPriceEl.textContent = formatCurrency(finalPrice) + ' đ';
            finalPriceEl.setAttribute('data-final', finalPrice);
        };

        const hideCheckoutModal = () => {
            checkoutModal.style.display = 'none';
        };

        btnOpenCheckout.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Populate vouchers
            if (voucherSelect.options.length <= 1) { // Chỉ có default option
                savedPromos.forEach(promo => {
                    const opt = document.createElement('option');
                    opt.value = promo.id;
                    opt.textContent = `${promo.name} (Giảm ${formatCurrency(promo.discount)}đ)`;
                    opt.setAttribute('data-discount', promo.discount);
                    voucherSelect.appendChild(opt);
                });
            }

            // Check if there is an active promo from Promos page
            const activePromo = localStorage.getItem('ecoActivePromo');
            if (activePromo) {
                voucherSelect.value = activePromo;
                localStorage.removeItem('ecoActivePromo'); // Xóa sau khi dùng
            }

            updatePrice();
            checkoutModal.style.display = 'flex';
        });

        if (voucherSelect) voucherSelect.addEventListener('change', updatePrice);

        if (closeCheckoutModal) closeCheckoutModal.addEventListener('click', hideCheckoutModal);
        if (btnCancelCheckout) btnCancelCheckout.addEventListener('click', hideCheckoutModal);
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) hideCheckoutModal();
        });

        if (btnConfirmCheckout) {
            btnConfirmCheckout.addEventListener('click', () => {
                const finalPrice = parseInt(finalPriceEl.getAttribute('data-final'));
                
                let balance = parseInt(localStorage.getItem('ecoWalletBalance'));
                if (isNaN(balance)) {
                    balance = 1500000;
                    localStorage.setItem('ecoWalletBalance', balance);
                }

                if (balance < finalPrice) {
                    if (window.showToast) {
                        showToast('Thanh toán thất bại', 'Số dư ví không đủ! Vui lòng nạp thêm tiền.', 'error');
                    } else {
                        alert('Số dư ví không đủ!');
                    }
                    return;
                }

                // Trừ tiền
                balance -= finalPrice;
                localStorage.setItem('ecoWalletBalance', balance);
                addTransaction(finalPrice, 'payment', 'Thành công (Chuyến đi)');
                
                hideCheckoutModal();
                if (window.showToast) {
                    showToast('Thành công', 'Thanh toán chuyến đi hoàn tất! Xe đang đến đón bạn.', 'success');
                } else {
                    alert('Thanh toán chuyến đi hoàn tất!');
                }
            });
        }
    }
});

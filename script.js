// Initialize data from localStorage or use defaults
let profileData = JSON.parse(localStorage.getItem('profileData')) || {
    name: 'اسم القناة',
    bio: 'مرحباً! هذه صفحة روابطي الخاصة',
    image: 'https://via.placeholder.com/120'
};

let linksData = JSON.parse(localStorage.getItem('linksData')) || [
    { icon: '🎥', text: 'قناتي على يوتيوب', url: 'https://youtube.com' },
    { icon: '📸', text: 'إنستغرام', url: 'https://instagram.com' },
    { icon: '🐦', text: 'تويتر', url: 'https://twitter.com' },
    { icon: '📘', text: 'فيسبوك', url: 'https://facebook.com' },
    { icon: '🌐', text: 'موقعي الإلكتروني', url: '#' },
    { icon: '📧', text: 'البريد الإلكتروني', url: '#' }
];

// Load data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadLinks();
    updateAdminInputs();
});

// Toggle Admin Panel
function toggleAdmin() {
    const adminPanel = document.getElementById('adminPanel');
    const overlay = document.querySelector('.overlay') || createOverlay();
    
    adminPanel.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (adminPanel.classList.contains('active')) {
        updateAdminInputs();
        updateLinksList();
    }
}

// Create overlay if it doesn't exist
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.onclick = toggleAdmin;
    document.body.appendChild(overlay);
    return overlay;
}

// Load profile data
function loadProfile() {
    document.getElementById('profileName').textContent = profileData.name;
    document.getElementById('profileBio').textContent = profileData.bio;
    document.getElementById('profileImg').src = profileData.image;
}

// Load links
function loadLinks() {
    const container = document.getElementById('linksContainer');
    container.innerHTML = '';
    
    linksData.forEach(link => {
        const linkCard = document.createElement('a');
        linkCard.className = 'link-card';
        linkCard.href = link.url;
        linkCard.target = '_blank';
        linkCard.innerHTML = `
            <span class="link-icon">${link.icon}</span>
            <span class="link-text">${link.text}</span>
        `;
        container.appendChild(linkCard);
    });
}

// Update admin input fields
function updateAdminInputs() {
    document.getElementById('nameInput').value = profileData.name;
    document.getElementById('bioInput').value = profileData.bio;
    document.getElementById('imageInput').value = profileData.image;
}

// Update links list in admin panel
function updateLinksList() {
    const linksList = document.getElementById('linksList');
    linksList.innerHTML = '';
    
    linksData.forEach((link, index) => {
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        linkItem.innerHTML = `
            <div class="link-item-info">
                <span style="font-size: 20px;">${link.icon}</span>
                <span>${link.text}</span>
            </div>
            <button onclick="deleteLink(${index})">حذف</button>
        `;
        linksList.appendChild(linkItem);
    });
}

// Add new link
function addLink() {
    const icon = document.getElementById('linkIcon').value.trim();
    const text = document.getElementById('linkText').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    
    if (!text || !url) {
        alert('الرجاء ملء جميع الحقول');
        return;
    }
    
    linksData.push({
        icon: icon || '🔗',
        text: text,
        url: url
    });
    
    // Clear inputs
    document.getElementById('linkIcon').value = '🔗';
    document.getElementById('linkText').value = '';
    document.getElementById('linkUrl').value = '';
    
    updateLinksList();
}

// Delete link
function deleteLink(index) {
    if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
        linksData.splice(index, 1);
        updateLinksList();
    }
}

// Save all changes
function saveChanges() {
    // Update profile data
    profileData.name = document.getElementById('nameInput').value.trim() || 'اسم القناة';
    profileData.bio = document.getElementById('bioInput').value.trim() || 'مرحباً! هذه صفحة روابطي الخاصة';
    profileData.image = document.getElementById('imageInput').value.trim() || 'https://via.placeholder.com/120';
    
    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(profileData));
    localStorage.setItem('linksData', JSON.stringify(linksData));
    
    // Reload UI
    loadProfile();
    loadLinks();
    
    // Close admin panel
    toggleAdmin();
    
    // Show success message
    showNotification('تم حفظ التغييرات بنجاح!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 50%;
        transform: translateX(50%);
        background: #10b981;
        color: white;
        padding: 15px 30px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

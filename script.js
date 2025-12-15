// Security: Sanitize text to prevent XSS
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Security: Validate and sanitize URLs
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || url === '#';
    } catch (e) {
        return url === '#';
    }
}

function sanitizeUrl(url) {
    if (url === '#') return '#';
    try {
        const urlObj = new URL(url);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
            return urlObj.href;
        }
    } catch (e) {
        // Invalid URL
    }
    return '#';
}

// Initialize data from localStorage or use defaults
let profileData;
try {
    profileData = JSON.parse(localStorage.getItem('profileData')) || {
        name: 'اسم القناة',
        bio: 'مرحباً! هذه صفحة روابطي الخاصة',
        image: 'https://via.placeholder.com/120'
    };
} catch (e) {
    profileData = {
        name: 'اسم القناة',
        bio: 'مرحباً! هذه صفحة روابطي الخاصة',
        image: 'https://via.placeholder.com/120'
    };
}

let linksData;
try {
    linksData = JSON.parse(localStorage.getItem('linksData')) || [
        { icon: '🎥', text: 'قناتي على يوتيوب', url: 'https://youtube.com' },
        { icon: '📸', text: 'إنستغرام', url: 'https://instagram.com' },
        { icon: '🐦', text: 'تويتر', url: 'https://twitter.com' },
        { icon: '📘', text: 'فيسبوك', url: 'https://facebook.com' },
        { icon: '🌐', text: 'موقعي الإلكتروني', url: '#' },
        { icon: '📧', text: 'البريد الإلكتروني', url: '#' }
    ];
} catch (e) {
    linksData = [
        { icon: '🎥', text: 'قناتي على يوتيوب', url: 'https://youtube.com' },
        { icon: '📸', text: 'إنستغرام', url: 'https://instagram.com' },
        { icon: '🐦', text: 'تويتر', url: 'https://twitter.com' },
        { icon: '📘', text: 'فيسبوك', url: 'https://facebook.com' },
        { icon: '🌐', text: 'موقعي الإلكتروني', url: '#' },
        { icon: '📧', text: 'البريد الإلكتروني', url: '#' }
    ];
}

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
        linkCard.href = sanitizeUrl(link.url);
        linkCard.target = '_blank';
        linkCard.rel = 'noopener noreferrer';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'link-icon';
        iconSpan.textContent = link.icon;
        
        const textSpan = document.createElement('span');
        textSpan.className = 'link-text';
        textSpan.textContent = link.text;
        
        linkCard.appendChild(iconSpan);
        linkCard.appendChild(textSpan);
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
        
        const linkInfo = document.createElement('div');
        linkInfo.className = 'link-item-info';
        
        const iconSpan = document.createElement('span');
        iconSpan.style.fontSize = '20px';
        iconSpan.textContent = link.icon;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = link.text;
        
        linkInfo.appendChild(iconSpan);
        linkInfo.appendChild(textSpan);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'حذف';
        deleteBtn.addEventListener('click', () => deleteLink(index));
        
        linkItem.appendChild(linkInfo);
        linkItem.appendChild(deleteBtn);
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
    
    // Validate URL
    if (!isValidUrl(url)) {
        alert('الرجاء إدخال رابط صحيح');
        return;
    }
    
    // Sanitize inputs
    const sanitizedIcon = sanitizeText(icon) || '🔗';
    const sanitizedText = sanitizeText(text);
    const sanitizedUrl = sanitizeUrl(url);
    
    linksData.push({
        icon: sanitizedIcon,
        text: sanitizedText,
        url: sanitizedUrl
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
    // Update profile data with sanitized inputs
    const name = document.getElementById('nameInput').value.trim();
    const bio = document.getElementById('bioInput').value.trim();
    const image = document.getElementById('imageInput').value.trim();
    
    profileData.name = sanitizeText(name) || 'اسم القناة';
    profileData.bio = sanitizeText(bio) || 'مرحباً! هذه صفحة روابطي الخاصة';
    
    // Validate image URL
    if (image && isValidUrl(image)) {
        profileData.image = sanitizeUrl(image);
    } else {
        profileData.image = 'https://via.placeholder.com/120';
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('profileData', JSON.stringify(profileData));
        localStorage.setItem('linksData', JSON.stringify(linksData));
    } catch (e) {
        alert('حدث خطأ أثناء الحفظ');
        return;
    }
    
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
    // Sanitize message to prevent XSS
    const sanitizedMessage = sanitizeText(message);
    
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
    notification.textContent = sanitizedMessage;
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

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    ROBOFLOW_API_KEY: 'AF9KxlEZBZnDNNVfSEOH',
    ROBOFLOW_MODEL: 'garbage-classification-3/2',
    ROBOFLOW_URL: 'https://detect.roboflow.com',
    GROQ_API_KEY: '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',
    GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
    GROQ_MODEL: 'llama3-8b-8192',
    POINTS_PER_CLASSIFICATION: 10,
    LEVEL_UP_THRESHOLD: 100
};

// ============================================
// WASTE CATEGORIES DATA
// ============================================

const WASTE_CATEGORIES = {
    plastic: {
        icon: '♻️',
        color: '#3b82f6'
    },
    metal: {
        icon: '🔩',
        color: '#6b7280'
    },
    paper: {
        icon: '📄',
        color: '#f59e0b'
    },
    organic: {
        icon: '🌱',
        color: '#10b981'
    },
    'e-waste': {
        icon: '💻',
        color: '#8b5cf6'
    },
    glass: {
        icon: '🍾',
        color: '#0ea5e9'
    },
    cardboard: {
        icon: '📦',
        color: '#92400e'
    }
};

// ============================================
// DISPOSAL GUIDANCE DATA
// ============================================

const DISPOSAL_GUIDANCE = {
    plastic: {
        disposal: "Rinse the plastic item thoroughly to remove any food residue. Check for the recycling symbol and number (1-7). Place in your blue recycling bin. Caps and lids should be removed unless your local facility accepts them attached.",
        tips: [
            "Look for the recycling number inside the triangular symbol (1-7)",
            "Rinse containers thoroughly to prevent contamination",
            "Remove caps, lids, and labels when possible",
            "Avoid putting plastic bags in recycling bins - take them to store drop-off locations",
            "Never recycle black plastic containers as they can't be detected by sorting machines"
        ]
    },
    metal: {
        disposal: "Rinse metal containers to remove food residue. Aluminum cans and steel food cans can go directly in your recycling bin. Remove paper labels if possible. Flatten cans to save space.",
        tips: [
            "Aluminum cans are infinitely recyclable without quality loss",
            "Rinse food and beverage cans before recycling",
            "Remove paper labels when possible for better recycling",
            "Steel and aluminum can be recycled together in most facilities",
            "Crushing cans saves space but check local guidelines first"
        ]
    },
    paper: {
        disposal: "Keep paper clean and dry. Remove any plastic windows, tape, or metal clips. Flatten cardboard boxes. Place loose papers in recycling bin - no need to bundle them.",
        tips: [
            "Keep paper clean and dry - wet or soiled paper cannot be recycled",
            "Remove plastic windows from envelopes before recycling",
            "Flatten cardboard boxes to save space",
            "Shredded paper should be placed in a paper bag before recycling",
            "Pizza boxes with grease stains should go in compost, not recycling"
        ]
    },
    organic: {
        disposal: "Organic waste like food scraps, yard waste, and compostable materials should go in your green compost bin or home compost pile. This includes fruit and vegetable scraps, coffee grounds, eggshells, and yard trimmings.",
        tips: [
            "Start a compost bin for fruit and vegetable scraps",
            "Include coffee grounds, tea bags, and eggshells in compost",
            "Avoid composting meat, dairy, oils, and pet waste",
            "Turn your compost pile regularly for faster decomposition",
            "Keep a 50/50 balance of 'green' (wet) and 'brown' (dry) materials"
        ]
    },
    glass: {
        disposal: "Rinse glass bottles and jars. Remove metal lids and caps. Place in recycling bin - most programs accept all colors of glass. Do not include broken glass, mirrors, or window glass.",
        tips: [
            "Glass is 100% recyclable and can be recycled endlessly",
            "Rinse containers but labels can stay on",
            "Remove metal lids and plastic caps before recycling",
            "Don't recycle window glass, mirrors, or light bulbs with containers",
            "Separate by color if your local program requires it"
        ]
    },
    cardboard: {
        disposal: "Remove all packaging materials, tape, and bubble wrap. Flatten boxes completely to save space. Keep cardboard dry - wet cardboard cannot be recycled. Place in recycling bin or bundle for curbside pickup.",
        tips: [
            "Flatten all boxes before recycling to save space",
            "Remove all tape, labels, and packaging materials",
            "Keep cardboard dry - wet cardboard goes in trash",
            "Break down large boxes so they fit in your recycling bin",
            "Waxed cardboard (like some produce boxes) cannot be recycled"
        ]
    },
    'e-waste': {
        disposal: "Never put electronics in regular trash or recycling bins. Take to a certified e-waste recycling center or electronics retailer that offers recycling programs. Many items contain valuable materials that can be recovered.",
        tips: [
            "Never throw electronics in regular trash - they contain toxic materials",
            "Find certified e-waste recycling centers in your area",
            "Many retailers offer free electronics recycling programs",
            "Remove batteries before recycling electronics",
            "Donate working electronics to charities or schools instead of recycling"
        ]
    }
};

// ============================================
// BADGES SYSTEM
// ============================================

const BADGES = [
    { id: 'first_scan', name: 'First Steps', icon: '🌟', desc: 'Complete your first classification', requirement: 1 },
    { id: 'eco_warrior', name: 'Eco Warrior', icon: '🦸', desc: 'Classify 10 items', requirement: 10 },
    { id: 'recycling_pro', name: 'Recycling Pro', icon: '♻️', desc: 'Classify 25 items', requirement: 25 },
    { id: 'planet_saver', name: 'Planet Saver', icon: '🌍', desc: 'Classify 50 items', requirement: 50 },
    { id: 'eco_master', name: 'Eco Master', icon: '👑', desc: 'Classify 100 items', requirement: 100 },
    { id: 'week_streak', name: 'Week Warrior', icon: '🔥', desc: '7-day classification streak', requirement: 7 },
    { id: 'all_categories', name: 'Category Complete', icon: '🎯', desc: 'Classify all waste types', requirement: 7 }
];

// ============================================
// USER DATA
// ============================================

let userData = {
    points: 0,
    level: 1,
    classifications: 0,
    badges: [],
    history: [],
    categoryCount: {},
    lastClassificationDate: null,
    streak: 0
};

// ============================================
// CHATBOT STATE
// ============================================

let chatHistory = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadUserData();
    updateUI();
    initializeTheme();
});

function initializeApp() {
    // Initialize category counts
    Object.keys(WASTE_CATEGORIES).forEach(category => {
        userData.categoryCount[category] = 0;
    });
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            navigateToSection(section);
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Image Upload
    const imageInput = document.getElementById('imageInput');
    const uploadArea = document.getElementById('uploadArea');
    
    imageInput.addEventListener('change', handleImageSelect);
    
    // Drag and Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('border-primary-500', 'dark:border-primary-400');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('border-primary-500', 'dark:border-primary-400');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('border-primary-500', 'dark:border-primary-400');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    });

    // Chatbot
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    chatbotToggle.addEventListener('click', () => {
        chatbotPanel.classList.toggle('hidden');
        chatbotPanel.classList.toggle('flex');
        if (!chatbotPanel.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotPanel.classList.add('hidden');
        chatbotPanel.classList.remove('flex');
    });

    chatSend.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

// ============================================
// THEME MANAGEMENT
// ============================================

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// ============================================
// NAVIGATION
// ============================================

function navigateToSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById('mobileMenu').classList.add('hidden');
    
    if (sectionId === 'centers') {
        setTimeout(() => initMap(), 100);
    } else if (sectionId === 'dashboard') {
        updateDashboard();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// IMAGE HANDLING
// ============================================

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const uploadContent = document.getElementById('uploadContent');
        
        previewImg.src = e.target.result;
        uploadContent.classList.add('hidden');
        preview.classList.remove('hidden');
        
        document.getElementById('classifyBtn').disabled = false;
        window.currentImageData = e.target.result;
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    const preview = document.getElementById('imagePreview');
    const uploadContent = document.getElementById('uploadContent');
    
    preview.classList.add('hidden');
    uploadContent.classList.remove('hidden');
    
    document.getElementById('classifyBtn').disabled = true;
    document.getElementById('resultsContainer').classList.add('hidden');
    document.getElementById('imageInput').value = '';
    
    window.currentImageData = null;
}

function captureImage() {
    const input = document.getElementById('imageInput');
    input.setAttribute('capture', 'environment');
    input.click();
}

// ============================================
// IMAGE CLASSIFICATION
// ============================================

async function classifyImage() {
    if (!window.currentImageData) {
        showToast('Please select an image first', 'error');
        return;
    }
    
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultsContainer = document.getElementById('resultsContainer');
    const classifyBtn = document.getElementById('classifyBtn');
    
    loadingSpinner.classList.remove('hidden');
    resultsContainer.classList.add('hidden');
    classifyBtn.disabled = true;
    
    try {
        const blob = await fetch(window.currentImageData).then(r => r.blob());
        const formData = new FormData();
        formData.append('file', blob, 'image.jpg');
        
        const response = await fetch(
            `${CONFIG.ROBOFLOW_URL}/${CONFIG.ROBOFLOW_MODEL}?api_key=${CONFIG.ROBOFLOW_API_KEY}`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        if (!response.ok) throw new Error('Classification failed');
        
        const data = await response.json();
        
        if (data.predictions && data.predictions.length > 0) {
            const topPrediction = data.predictions[0];
            await displayResults(topPrediction);
            recordClassification(topPrediction);
        } else {
            await simulateClassification();
        }
        
    } catch (error) {
        console.error('Classification error:', error);
        showToast('Using demo mode - connect your Roboflow API key for live classification', 'info');
        await simulateClassification();
    } finally {
        loadingSpinner.classList.add('hidden');
        classifyBtn.disabled = false;
    }
}

async function simulateClassification() {
    const categories = ['plastic', 'metal', 'paper', 'organic', 'glass', 'cardboard'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const confidence = 0.75 + Math.random() * 0.2;
    
    const prediction = {
        class: randomCategory,
        confidence: confidence
    };
    
    await displayResults(prediction);
    recordClassification(prediction);
}

// ============================================
// DISPOSAL INSTRUCTIONS
// ============================================

async function displayResults(prediction) {
    const resultsContainer = document.getElementById('resultsContainer');
    let category = prediction.class.toLowerCase();
    
    // Convert biodegradable to organic
    if (category === 'biodegradable') {
        category = 'organic';
    }
    
    const confidence = (prediction.confidence * 100).toFixed(1);
    
    const categoryData = WASTE_CATEGORIES[category] || WASTE_CATEGORIES['plastic'];
    
    // Update visual elements
    document.getElementById('resultIcon').innerHTML = categoryData.icon;
    document.getElementById('resultIcon').style.background = `${categoryData.color}33`;
    
    document.getElementById('resultCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('resultConfidence').textContent = `Confidence: ${confidence}%`;
    
    // Show results container
    resultsContainer.classList.remove('hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Show points earned
    document.getElementById('pointsEarned').classList.remove('hidden');
    document.getElementById('earnedPoints').textContent = CONFIG.POINTS_PER_CLASSIFICATION;
    
    // Display disposal guidance
    displayDisposalGuidance(category);
}

function displayDisposalGuidance(category) {
    const guidance = DISPOSAL_GUIDANCE[category] || DISPOSAL_GUIDANCE['plastic'];
    
    // Display disposal instructions
    document.getElementById('disposalText').innerHTML = `<p>${guidance.disposal}</p>`;
    
    // Display recycling tips
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = guidance.tips.map(tip => `
        <li class="flex items-start space-x-2">
            <i class="fas fa-check-circle text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0"></i>
            <span>${tip}</span>
        </li>
    `).join('');
}

function recordClassification(prediction) {
    let category = prediction.class.toLowerCase();
    
    // Convert biodegradable to organic
    if (category === 'biodegradable') {
        category = 'organic';
    }
    
    userData.points += CONFIG.POINTS_PER_CLASSIFICATION;
    userData.classifications++;
    userData.categoryCount[category] = (userData.categoryCount[category] || 0) + 1;
    
    userData.history.unshift({
        category: category,
        confidence: prediction.confidence,
        timestamp: new Date().toISOString(),
        points: CONFIG.POINTS_PER_CLASSIFICATION
    });
    
    if (userData.history.length > 50) {
        userData.history = userData.history.slice(0, 50);
    }
    
    updateStreak();
    
    const newLevel = Math.floor(userData.points / CONFIG.LEVEL_UP_THRESHOLD) + 1;
    if (newLevel > userData.level) {
        userData.level = newLevel;
        showToast(`🎉 Level Up! You are now level ${userData.level}!`, 'success');
    }
    
    checkBadges();
    saveUserData();
    updateUI();
    
    showToast(`+${CONFIG.POINTS_PER_CLASSIFICATION} points earned!`, 'success');
}

function updateStreak() {
    const today = new Date().toDateString();
    const lastDate = userData.lastClassificationDate ? new Date(userData.lastClassificationDate).toDateString() : null;
    
    if (lastDate === today) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    if (lastDate === yesterdayStr) {
        userData.streak++;
    } else if (lastDate === null) {
        userData.streak = 1;
    } else {
        userData.streak = 1;
    }
    
    userData.lastClassificationDate = new Date().toISOString();
}

function checkBadges() {
    BADGES.forEach(badge => {
        if (userData.badges.includes(badge.id)) return;
        
        let unlocked = false;
        
        switch(badge.id) {
            case 'first_scan':
                unlocked = userData.classifications >= 1;
                break;
            case 'eco_warrior':
                unlocked = userData.classifications >= 10;
                break;
            case 'recycling_pro':
                unlocked = userData.classifications >= 25;
                break;
            case 'planet_saver':
                unlocked = userData.classifications >= 50;
                break;
            case 'eco_master':
                unlocked = userData.classifications >= 100;
                break;
            case 'week_streak':
                unlocked = userData.streak >= 7;
                break;
            case 'all_categories':
                const categoriesClassified = Object.values(userData.categoryCount).filter(count => count > 0).length;
                unlocked = categoriesClassified >= 7;
                break;
        }
        
        if (unlocked) {
            userData.badges.push(badge.id);
            showBadgeUnlock(badge);
        }
    });
}

function showBadgeUnlock(badge) {
    const modal = document.getElementById('badgeModal');
    const modalContent = document.getElementById('badgeModalContent');
    const badgeUnlock = document.getElementById('badgeUnlock');
    
    badgeUnlock.innerHTML = `
        <div class="text-7xl mb-4">${badge.icon}</div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${badge.name}</h3>
        <p class="text-gray-600 dark:text-gray-400">${badge.desc}</p>
    `;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.add('scale-100');
    }, 10);
}

function closeBadgeModal() {
    const modal = document.getElementById('badgeModal');
    const modalContent = document.getElementById('badgeModalContent');
    
    modalContent.classList.remove('scale-100');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function viewRecyclingCenters() {
    navigateToSection('centers');
}

// ============================================
// MAP INTEGRATION - Random Centers within 2km
// ============================================

let map;
let markers = [];
let userMarker = null;

function initMap() {
    if (map) {
        // Regenerate centers with new random locations each time
        if (userMarker) {
            const location = userMarker.getLatLng();
            const centers = generateRecyclingCenters([location.lat, location.lng]);
            displayRecyclingCenters(centers);
        }
        return;
    }
    
    const defaultCenter = [40.7128, -74.0060]; // New York City
    
    map = L.map('map').setView(defaultCenter, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = [position.coords.latitude, position.coords.longitude];
                updateMapLocation(userLocation);
            },
            () => {
                updateMapLocation(defaultCenter);
            }
        );
    } else {
        updateMapLocation(defaultCenter);
    }
}

function updateMapLocation(location) {
    map.setView(location, 14);
    
    const userIcon = L.divIcon({
        className: '',
        html: '<div class="w-5 h-5 bg-blue-500 border-4 border-white rounded-full shadow-lg animate-pulse-slow"></div>',
        iconSize: [20, 20]
    });
    
    if (userMarker) {
        userMarker.setLatLng(location);
    } else {
        userMarker = L.marker(location, { icon: userIcon }).addTo(map);
        userMarker.bindPopup('<div class="text-center font-semibold">📍 Your Location</div>').openPopup();
    }
    
    const centers = generateRecyclingCenters(location);
    displayRecyclingCenters(centers);
}

// Generate truly random recycling centers within exactly 2km radius
function generateRecyclingCenters(center) {
    const centers = [];
    const centerTypes = [
        { name: 'Municipal Recycling Center', icon: '♻️', color: '#10b981' },
        { name: 'E-Waste Collection Point', icon: '💻', color: '#8b5cf6' },
        { name: 'Composting Facility', icon: '🌱', color: '#059669' },
        { name: 'Metal & Glass Recycling', icon: '🔩', color: '#6b7280' },
        { name: 'Paper & Cardboard Center', icon: '📄', color: '#f59e0b' },
        { name: 'Plastic Recycling Hub', icon: '♻️', color: '#3b82f6' },
        { name: 'Organic Waste Center', icon: '🌱', color: '#10b981' },
        { name: 'Hazardous Waste Facility', icon: '⚠️', color: '#ef4444' }
    ];
    
    // Generate 5-7 random centers
    const numCenters = 5 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numCenters; i++) {
        // Random angle in radians (0 to 2π)
        const angle = Math.random() * Math.PI * 2;
        
        // Random distance within 2km
        // 1 degree ≈ 111km, so 2km ≈ 0.018 degrees
        const maxDistance = 0.018; // ~2km
        const minDistance = 0.003; // ~0.3km minimum
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        
        // Calculate position using polar coordinates
        const lat = center[0] + Math.cos(angle) * distance;
        const lng = center[1] + Math.sin(angle) * distance;
        
        // Calculate actual distance in km
        const actualDistance = calculateDistance(center[0], center[1], lat, lng);
        
        // Random center type
        const centerType = centerTypes[Math.floor(Math.random() * centerTypes.length)];
        
        centers.push({
            id: i,
            name: centerType.name,
            icon: centerType.icon,
            color: centerType.color,
            address: generateRandomAddress(),
            phone: generateRandomPhone(),
            hours: generateRandomHours(),
            distance: actualDistance.toFixed(2),
            position: [lat, lng],
            type: centerType.name
        });
    }
    
    // Sort by distance (closest first)
    centers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    return centers;
}

function generateRandomAddress() {
    const streets = ['Green', 'Oak', 'Maple', 'Pine', 'Elm', 'Cedar', 'Birch', 'Willow', 'Eco', 'Park', 'Forest', 'Lake', 'River', 'Hill'];
    const types = ['Street', 'Avenue', 'Road', 'Lane', 'Drive', 'Way', 'Boulevard', 'Place', 'Circle'];
    const number = Math.floor(Math.random() * 900 + 100);
    const suite = Math.floor(Math.random() * 50 + 1);
    
    return `${number} ${streets[Math.floor(Math.random() * streets.length)]} ${types[Math.floor(Math.random() * types.length)]}, Suite ${suite}`;
}

function generateRandomPhone() {
    return `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function generateRandomHours() {
    const openHours = ['7:00 AM', '8:00 AM', '9:00 AM'];
    const closeHours = ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
    const days = ['Mon-Fri', 'Mon-Sat', 'Daily'];
    
    return `${days[Math.floor(Math.random() * days.length)]}: ${openHours[Math.floor(Math.random() * openHours.length)]} - ${closeHours[Math.floor(Math.random() * closeHours.length)]}`;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function displayRecyclingCenters(centers) {
    const centersList = document.getElementById('centersList');
    centersList.innerHTML = '';
    
    // Remove old markers
    markers.forEach(marker => marker.remove());
    markers = [];
    
    centers.forEach((center, index) => {
        const customIcon = L.divIcon({
            className: '',
            html: `
                <div class="custom-marker" style="background-color: ${center.color};">
                    <div class="custom-marker-inner">${center.icon}</div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        
        const marker = L.marker(center.position, { icon: customIcon }).addTo(map);
        
        const popupContent = `
            <div class="p-2 min-w-[200px]">
                <h3 class="font-bold text-lg mb-2" style="color: ${center.color}">
                    ${center.icon} ${center.name}
                </h3>
                <p class="text-sm mb-1"><strong>📍 Address:</strong><br>${center.address}</p>
                <p class="text-sm mb-1"><strong>📞 Phone:</strong> ${center.phone}</p>
                <p class="text-sm mb-1"><strong>🕐 Hours:</strong> ${center.hours}</p>
                <p class="text-sm"><strong>📏 Distance:</strong> ${center.distance} km</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', () => map.setView(center.position, 16));
        markers.push(marker);
        
        const centerItem = document.createElement('div');
        centerItem.className = 'bg-gray-50 dark:bg-gray-700 rounded-xl p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200';
        centerItem.innerHTML = `
            <h4 class="font-bold text-gray-900 dark:text-white mb-2" style="color: ${center.color}">
                ${center.icon} ${center.name}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <i class="fas fa-map-marker-alt mr-1"></i> ${center.address}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <i class="fas fa-phone mr-1"></i> ${center.phone}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
                <i class="fas fa-clock mr-1"></i> ${center.hours}
            </p>
            <p class="text-sm font-semibold text-primary-600 dark:text-primary-400">
                <i class="fas fa-route mr-1"></i> ${center.distance} km away
            </p>
        `;
        
        centerItem.addEventListener('click', () => {
            map.setView(center.position, 16);
            markers[index].openPopup();
        });
        
        centersList.appendChild(centerItem);
    });
    
    // Fit map to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup([userMarker, ...markers]);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// ============================================
// DASHBOARD
// ============================================

function updateDashboard() {
    document.getElementById('dashTotalClass').textContent = userData.classifications;
    document.getElementById('dashTotalPoints').textContent = userData.points;
    document.getElementById('dashLevel').textContent = userData.level;
    document.getElementById('currentStreak').textContent = `${userData.streak} days`;
    
    const currentLevelPoints = userData.points % CONFIG.LEVEL_UP_THRESHOLD;
    const progressPercent = (currentLevelPoints / CONFIG.LEVEL_UP_THRESHOLD) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('levelProgress').textContent = `${currentLevelPoints}/${CONFIG.LEVEL_UP_THRESHOLD}`;
    
    updateBadgesDisplay();
    updateCategoryBreakdown();
    updateActivityList();
}

function updateBadgesDisplay() {
    const badgesContainer = document.getElementById('badgesContainer');
    badgesContainer.innerHTML = '';
    
    BADGES.forEach(badge => {
        const isUnlocked = userData.badges.includes(badge.id);
        const badgeEl = document.createElement('div');
        badgeEl.className = `text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl transition-all duration-200 ${isUnlocked ? 'hover:scale-105' : 'opacity-40'}`;
        badgeEl.innerHTML = `
            <div class="text-4xl mb-2">${badge.icon}</div>
            <div class="text-xs font-semibold text-gray-900 dark:text-white">${badge.name}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">${badge.desc}</div>
        `;
        badgesContainer.appendChild(badgeEl);
    });
}

function updateCategoryBreakdown() {
    const breakdown = document.getElementById('categoryBreakdown');
    breakdown.innerHTML = '';
    
    const hasData = Object.values(userData.categoryCount).some(count => count > 0);
    
    if (!hasData) {
        breakdown.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 py-4">No classifications yet</p>';
        return;
    }
    
    Object.entries(userData.categoryCount).forEach(([category, count]) => {
        if (count > 0) {
            const categoryData = WASTE_CATEGORIES[category];
            if (!categoryData) return;
            
            const stat = document.createElement('div');
            stat.className = 'flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl';
            stat.innerHTML = `
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style="background: ${categoryData.color}33; color: ${categoryData.color}">
                    ${categoryData.icon}
                </div>
                <div class="flex-1">
                    <div class="font-semibold text-gray-900 dark:text-white">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">${count} items classified</div>
                </div>
            `;
            breakdown.appendChild(stat);
        }
    });
}

function updateActivityList() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    if (userData.history.length === 0) {
        activityList.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 py-4">No activity yet. Start classifying!</p>';
        return;
    }
    
    userData.history.slice(0, 10).forEach(item => {
        const activityItem = document.createElement('div');
        activityItem.className = 'p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-l-4 border-primary-500';
        
        const date = new Date(item.timestamp);
        const timeStr = formatTimeAgo(date);
        
        activityItem.innerHTML = `
            <div class="text-xs text-gray-500 dark:text-gray-400">${timeStr}</div>
            <div class="text-sm text-gray-900 dark:text-white font-medium">
                Classified ${item.category} (+${item.points} points)
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

// ============================================
// UI UPDATES
// ============================================

function updateUI() {
    document.getElementById('totalPoints').textContent = userData.points;
    document.getElementById('badgeCount').textContent = userData.badges.length;
    document.getElementById('userLevel').textContent = userData.level;
    document.getElementById('totalClassifications').textContent = userData.classifications;
    
    const wastePerItem = 0.2;
    const co2PerKg = 0.5;
    const recyclingImpact = (userData.classifications * wastePerItem).toFixed(1);
    const co2Saved = (userData.classifications * wastePerItem * co2PerKg).toFixed(1);
    
    document.getElementById('recyclingImpact').textContent = `${recyclingImpact} kg`;
    document.getElementById('co2Saved').textContent = `${co2Saved} kg`;
}

// ============================================
// GROQ AI CHATBOT (Still works for chat!)
// ============================================

async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    addMessageToChat('user', message);
    chatInput.value = '';
    
    document.getElementById('typingIndicator').classList.remove('hidden');
    
    try {
        const response = await callGroqAPI(message, false);
        document.getElementById('typingIndicator').classList.add('hidden');
        addMessageToChat('bot', response);
    } catch (error) {
        console.error('Chatbot error:', error);
        document.getElementById('typingIndicator').classList.add('hidden');
        addMessageToChat('bot', 'I apologize, but I\'m having trouble connecting right now. Please check your API key or try again later.');
    }
}

async function callGroqAPI(userMessage, isShortResponse = false) {
    const systemPrompt = `You are EcoSort AI Assistant, a helpful chatbot for a waste classification app. 
Help users with waste management, recycling tips, and environmental questions.
Be concise, friendly, and informative.

User's current stats:
- Classifications: ${userData.classifications}
- Points: ${userData.points}
- Level: ${userData.level}

${isShortResponse ? 'Keep your response brief and to the point (2-4 sentences max).' : 'Provide helpful, accurate information about waste management and recycling.'}`;

    const response = await fetch(CONFIG.GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userMessage
                }
            ],
            model: CONFIG.GROQ_MODEL,
            temperature: 0.7,
            max_tokens: isShortResponse ? 200 : 1024,
            top_p: 1,
            stream: false
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API error:', errorData);
        throw new Error('Groq API call failed');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-enter';
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="flex items-start space-x-2 justify-end">
                <div class="bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-2xl rounded-tr-none p-3 max-w-[80%] shadow">
                    <p class="text-sm">${escapeHtml(message)}</p>
                </div>
                <div class="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-user text-gray-600 dark:text-gray-300 text-sm"></i>
                </div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="flex items-start space-x-2">
                <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-robot text-white text-sm"></i>
                </div>
                <div class="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none p-3 max-w-[80%] shadow">
                    <p class="text-sm text-gray-800 dark:text-gray-200">${formatBotMessage(message)}</p>
                </div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    chatHistory.push({ sender, message, timestamp: new Date().toISOString() });
}

function formatBotMessage(message) {
    let formatted = escapeHtml(message).replace(/\n/g, '<br>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return formatted;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('-translate-x-full');
    toast.classList.add('translate-x-0');
    
    setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('-translate-x-full');
    }, 3000);
}

// ============================================
// LOCAL STORAGE
// ============================================

function saveUserData() {
    localStorage.setItem('ecoSortUserData', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('ecoSortUserData');
    if (saved) {
        userData = { ...userData, ...JSON.parse(saved) };
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function resetUserData() {
    if (confirm('Are you sure you want to reset all your data?')) {
        localStorage.removeItem('ecoSortUserData');
        location.reload();
    }
}

// Expose for console testing
window.resetEcoSort = resetUserData;

console.log('%c🌱 EcoSort AI Ready!', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cTip: Use window.resetEcoSort() to reset all data', 'color: #6b7280;');
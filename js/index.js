// Initialize user credentials on page load
document.addEventListener('DOMContentLoaded', () => {
  try {
    loadUserCredentials();
    
    // If no user ID, use test credentials
    if (!currentUserID) {
      logger.info('No user logged in, using test credentials');
      setUserCredentials(123456789, 'client');
    }
    
    logger.info('Index page initialized');
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'index.js DOMContentLoaded');
    logger.error('Failed to initialize page:', errorInfo);
    errorHandler.showNotification(errorInfo.userMessage, 'error');
  }
});

let lastScrollY = 0;
let isScrollingDown = false;

const logo = document.querySelector('.faberon-logo');
const searchBar = document.querySelector('.frame-21_184');
const filterBtn = document.querySelector('.frame-21_190');
const largeCard = document.querySelector('.frame-2_468');
const smallCard = document.querySelector('.frame-2_501');
const servicesGrid = document.querySelector('.services-grid');

// Начальные значения
const logoInitialTop = 50;
const logoInitialWidth = 331;
const logoInitialHeight = 61;
const largeCardInitialTop = 200; // Начальная позиция большой карты

// Минимальные значения для логотипа
const logoMinWidth = 80;
const logoMinHeight = 20;
const logoMinTop = 10;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const isAtBottom = currentScrollY >= docHeight - 10; // 10px допуска
  
  // Определяем направление скролла
  isScrollingDown = currentScrollY > lastScrollY;
  
  // Если в конце страницы - применяем состояние скролла вниз
  if (isAtBottom) {
    const scrollProgress = 1; // Полное сжатие
    
    logo.style.width = logoMinWidth + 'px';
    logo.style.height = logoMinHeight + 'px';
    logo.style.top = logoMinTop + 'px';
    
    // Скрываем поиск и фильтры
    searchBar.style.opacity = '0';
    searchBar.style.pointerEvents = 'none';
    filterBtn.style.opacity = '0';
    filterBtn.style.pointerEvents = 'none';
    
    // Скрываем большую карту, показываем маленькую
    largeCard.classList.add('hidden');
    smallCard.classList.add('visible');
    servicesGrid.classList.add('compact');
    smallCard.style.top = (logoMinTop + logoMinHeight + 20) + 'px';
  } else if (isScrollingDown && currentScrollY > 0) {
    // Скролл вниз - уменьшаем логотип
    const scrollProgress = Math.min(currentScrollY / 150, 1); // 150px - расстояние для полного сжатия
    
    const newWidth = logoInitialWidth - (logoInitialWidth - logoMinWidth) * scrollProgress;
    const newHeight = logoInitialHeight - (logoInitialHeight - logoMinHeight) * scrollProgress;
    const newTop = logoInitialTop - (logoInitialTop - logoMinTop) * scrollProgress;
    
    logo.style.width = newWidth + 'px';
    logo.style.height = newHeight + 'px';
    logo.style.top = newTop + 'px';
    
    // Скрываем поиск и фильтры
    searchBar.style.opacity = '0';
    searchBar.style.pointerEvents = 'none';
    filterBtn.style.opacity = '0';
    filterBtn.style.pointerEvents = 'none';
    
    // Переключаем карты: скрываем большую, показываем маленькую
    if (currentScrollY > 100) {
      largeCard.classList.add('hidden');
      smallCard.classList.add('visible');
      servicesGrid.classList.add('compact');
    } else {
      largeCard.classList.remove('hidden');
      smallCard.classList.remove('visible');
      servicesGrid.classList.remove('compact');
    }
  } else if (!isScrollingDown && currentScrollY < 150) {
    // Скролл вверх - возвращаем логотип в исходное состояние
    const scrollProgress = Math.min(currentScrollY / 150, 1);
    
    const newWidth = logoInitialWidth - (logoInitialWidth - logoMinWidth) * scrollProgress;
    const newHeight = logoInitialHeight - (logoInitialHeight - logoMinHeight) * scrollProgress;
    const newTop = logoInitialTop - (logoInitialTop - logoMinTop) * scrollProgress;
    
    logo.style.width = newWidth + 'px';
    logo.style.height = newHeight + 'px';
    logo.style.top = newTop + 'px';
    
    // Показываем поиск и фильтры
    searchBar.style.opacity = '1';
    searchBar.style.pointerEvents = 'auto';
    filterBtn.style.opacity = '1';
    filterBtn.style.pointerEvents = 'auto';
    
    // Плавно показываем большую карту, скрываем маленькую
    largeCard.classList.remove('hidden');
    smallCard.classList.remove('visible');
    servicesGrid.classList.remove('compact');
  } else if (!isScrollingDown && currentScrollY <= 100) {
    // Скролл вверх, но логотип уже сжат - оставляем его сжатым
    logo.style.width = logoMinWidth + 'px';
    logo.style.height = logoMinHeight + 'px';
    logo.style.top = logoMinTop + 'px';
    
    // Показываем поиск и фильтры
    searchBar.style.opacity = '1';
    searchBar.style.pointerEvents = 'auto';
    filterBtn.style.opacity = '1';
    filterBtn.style.pointerEvents = 'auto';
    
    // Показываем большую карту, скрываем маленькую
    largeCard.classList.remove('hidden');
    smallCard.classList.remove('visible');
    servicesGrid.classList.remove('compact');
  }
  
  lastScrollY = currentScrollY;
});

// QR Code Modal Functions
const qrElement = document.getElementById('2_470');
const qrElement2 = document.getElementById('2_503');
const qrModal = document.getElementById('qr-modal');
let qrLastClickTime = 0;
const QR_CLICK_DELAY = 300; // milliseconds

function openQRModal() {
  const now = Date.now();
  if (now - qrLastClickTime < QR_CLICK_DELAY) {
    return; // Prevent rapid clicks
  }
  qrLastClickTime = now;
  
  qrModal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeQRModal() {
  qrModal.classList.remove('active');
  document.body.classList.remove('modal-open');
}

// Open modal on click for both elements
qrElement.addEventListener('click', (e) => {
  e.stopPropagation();
  openQRModal();
});
qrElement2.addEventListener('click', (e) => {
  e.stopPropagation();
  openQRModal();
});

// Close modal when clicking outside
qrModal.addEventListener('click', (e) => {
  if (e.target === qrModal) {
    closeQRModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && qrModal.classList.contains('active')) {
    closeQRModal();
  }
});

// Search functionality
const searchInput = document.getElementById('21_191');
const serviceCards = document.querySelectorAll('.service-card');

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  
  serviceCards.forEach(card => {
    const serviceName = card.dataset.serviceName.toLowerCase();
    const serviceShort = card.dataset.serviceShort.toLowerCase();
    
    if (searchTerm === '') {
      // Show all cards if search is empty
      card.classList.remove('hidden');
    } else if (serviceName.includes(searchTerm) || serviceShort.includes(searchTerm)) {
      // Show card if it matches search term
      card.classList.remove('hidden');
    } else {
      // Hide card if it doesn't match
      card.classList.add('hidden');
    }
  });
});

// Service Details Modal Functions
const serviceModal = document.getElementById('service-modal');
let serviceLastClickTime = 0;
let serviceLastClickedCard = null;
const SERVICE_CLICK_DELAY = 300; // milliseconds

function openServiceModal(cardOrName, price, shortDesc, fullDesc) {
  // Support both old style (card object) and new style (parameters)
  let serviceName, servicePrice, serviceFull;
  
  if (typeof cardOrName === 'object' && cardOrName.dataset) {
    // Old style: card object passed
    const card = cardOrName;
    const now = Date.now();
    
    // Prevent rapid clicks on the same card
    if (now - serviceLastClickTime < SERVICE_CLICK_DELAY) {
      return;
    }
    
    // Prevent accidental double-clicks
    if (serviceLastClickedCard === card && now - serviceLastClickTime < 500) {
      return;
    }
    
    serviceLastClickTime = now;
    serviceLastClickedCard = card;
    
    serviceName = card.dataset.serviceName;
    servicePrice = card.dataset.servicePrice;
    serviceFull = card.dataset.serviceFull;
  } else {
    // New style: parameters passed
    serviceName = cardOrName;
    servicePrice = price;
    serviceFull = fullDesc;
  }
  
  document.getElementById('service-modal-name').textContent = serviceName;
  document.getElementById('service-modal-price').textContent = servicePrice;
  document.getElementById('service-modal-description').textContent = serviceFull;
  
  serviceModal.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeServiceModal() {
  serviceModal.classList.remove('active');
  document.body.classList.remove('modal-open');
  serviceLastClickedCard = null;
}

// Add click listeners to service cards with debounce
serviceCards.forEach(card => {
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    openServiceModal(card);
  });
});

// Close modal when clicking outside
serviceModal.addEventListener('click', (e) => {
  if (e.target === serviceModal) {
    closeServiceModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && serviceModal.classList.contains('active')) {
    closeServiceModal();
  }
});

// Navigation handled by href and onclick attributes

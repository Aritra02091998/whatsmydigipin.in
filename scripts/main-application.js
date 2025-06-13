// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const getLocationBtn = document.getElementById('getLocationBtn');
const digipinDisplay = document.getElementById('digipinDisplay');
const locationError = document.getElementById('locationError');
const copyBtn = document.getElementById('copyBtn');
const qrBtn = document.getElementById('qrBtn');
const mapBtn = document.getElementById('mapBtn');
const pdfBtn = document.getElementById('pdfBtn');
const manualLat = document.getElementById('manualLat');
const manualLon = document.getElementById('manualLon');
const manualDigipinBtn = document.getElementById('manualDigipinBtn');
const resetBtn = document.getElementById('resetBtn');
const digipinInput = document.getElementById('digipinInput');
const decodeBtn = document.getElementById('decodeBtn');
const decodeResult = document.getElementById('decodeResult');
const resultLat = document.getElementById('resultLat');
const resultLon = document.getElementById('resultLon');
const viewDecodedMap = document.getElementById('viewDecodedMap');
const qrModal = document.getElementById('qrModal');
const closeQrModal = document.getElementById('closeQrModal');
const qrDigipin = document.getElementById('qrDigipin');
const downloadQrBtn = document.getElementById('downloadQrBtn');
const qrcode = document.getElementById('qrcode');
const digipinResult = document.getElementById('digipinResult');

// State variables
let currentDigipin = null;
let currentCoords = null;

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

// Initialize theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
}

// Get Location and Generate DigiPIN
getLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                currentCoords = { lat, lon };
                
                try {
                    const digipin = getDigiPin(lat, lon);
                    currentDigipin = digipin;
                    digipinDisplay.textContent = digipin;
                    
                    // Enable buttons
                    copyBtn.disabled = false;
                    copyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    qrBtn.disabled = false;
                    qrBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    mapBtn.disabled = false;
                    mapBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    pdfBtn.disabled = false;
                    pdfBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    
                    // Show success
                    digipinResult.classList.remove('hidden');
                    locationError.classList.add('hidden');
                } catch (error) {
                    locationError.textContent = error.message;
                    locationError.classList.remove('hidden');
                }
            },
            error => {
                locationError.textContent = "Unable to access location. Please enter coordinates manually below.";
                locationError.classList.remove('hidden');
            }
        );
    } else {
        locationError.textContent = "Geolocation is not supported by this browser.";
        locationError.classList.remove('hidden');
    }
});

// Manual DigiPIN generation
manualDigipinBtn.addEventListener('click', () => {
    const lat = parseFloat(manualLat.value);
    const lon = parseFloat(manualLon.value);
    
    if (isNaN(lat)) {
        alert('Please enter a valid latitude');
        return;
    }
    
    if (isNaN(lon)) {
        alert('Please enter a valid longitude');
        return;
    }
    
    try {
        const digipin = getDigiPin(lat, lon);
        currentDigipin = digipin;
        currentCoords = { lat, lon };
        digipinDisplay.textContent = digipin;
        
        // Enable buttons
        copyBtn.disabled = false;
        copyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        qrBtn.disabled = false;
        qrBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        mapBtn.disabled = false;
        mapBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        pdfBtn.disabled = false;
        pdfBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        
        // Show success
        digipinResult.classList.remove('hidden');
        locationError.classList.add('hidden');
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'text-green-600 dark:text-green-400 mt-4';
        successMsg.innerHTML = '<i class="fas fa-check-circle mr-2"></i>DigiPIN calculated successfully!';
        manualDigipinBtn.parentElement.appendChild(successMsg);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    } catch (error) {
        locationError.textContent = error.message;
        locationError.classList.remove('hidden');
    }
});

// Reset form and clear DigiPIN
resetBtn.addEventListener('click', () => {
    // Clear input fields
    manualLat.value = '';
    manualLon.value = '';
    
    // Reset DigiPIN display
    digipinDisplay.textContent = '000-000-0000';
    currentDigipin = null;
    currentCoords = null;
    
    // Disable action buttons
    copyBtn.disabled = true;
    copyBtn.classList.add('opacity-50', 'cursor-not-allowed');
    qrBtn.disabled = true;
    qrBtn.classList.add('opacity-50', 'cursor-not-allowed');
    mapBtn.disabled = true;
    mapBtn.classList.add('opacity-50', 'cursor-not-allowed');
    pdfBtn.disabled = true;
    pdfBtn.classList.add('opacity-50', 'cursor-not-allowed');
    
    // Hide success message
    digipinResult.classList.add('hidden');
    locationError.classList.add('hidden');
});

// Copy DigiPIN to clipboard
copyBtn.addEventListener('click', () => {
    if (currentDigipin) {
        navigator.clipboard.writeText(currentDigipin).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        });
    }
});

// Show QR Code Modal
qrBtn.addEventListener('click', () => {
    if (currentDigipin) {
        qrDigipin.textContent = currentDigipin;
        qrcode.innerHTML = '';
        
        // Create QR code
        new QRCode(qrcode, {
            text: currentDigipin,
            width: 200,
            height: 200,
            colorDark: "#2563eb",
            colorLight: "#ffffff",
            correctLevel: 3 // High error correction
        });
        
        qrModal.classList.remove('hidden');
    }
});

// Close QR Modal
closeQrModal.addEventListener('click', () => {
    qrModal.classList.add('hidden');
});

// Open in Google Maps
mapBtn.addEventListener('click', () => {
    if (currentCoords) {
        const { lat, lon } = currentCoords;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
    }
});

// Download PDF
pdfBtn.addEventListener('click', () => {
  if (currentDigipin && currentCoords) {
    const { lat, lon } = currentCoords;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('India Post DigiPIN', pageWidth / 2, 20, null, null, 'center');

    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Your Digital Address Code', pageWidth / 2, 30, null, null, 'center');

    // DigiPIN
    doc.setFontSize(32);
    doc.setTextColor(37, 99, 235);
    doc.text(currentDigipin, pageWidth / 2, 50, null, null, 'center');

    // Coordinates
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Latitude: ${lat.toFixed(6)}`, pageWidth / 2, 70, null, null, 'center');
    doc.text(`Longitude: ${lon.toFixed(6)}`, pageWidth / 2, 78, null, null, 'center');

    // Generated date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Generated on ' + new Date().toLocaleDateString(),
      pageWidth / 2,
      90,
      null,
      null,
      'center'
    );

    // —————————————————————————————
    // “Generated From” link (center + underline)
    // —————————————————————————————
    const originText = 'Generated From: http://whatsmydigipin.in/';
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 255);
    // measure text
    const originWidth = doc.getTextWidth(originText);
    const originX = (pageWidth - originWidth) / 2;
    const originY = 105;
    // place link
    doc.textWithLink(originText, originX, originY, {
      url: 'http://whatsmydigipin.in/'
    });
    // draw underline
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 255);
    doc.line(originX, originY + 1, originX + originWidth, originY + 1);

    // —————————————————————————————
    // Other Projects (center + underlined links)
    // —————————————————————————————
    const projects = [
      { title: 'Gematria Calculators', url: 'https://gematriacalculators.org/' },
      { title: 'Tarot Card Generator', url: 'http://tarotcardgenerator.online/' },
      { title: 'Snow Days Calculator AI', url: 'https://www.snowdayscalculatorai.com/' }
    ];

    // Header
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text('Check out our other projects in below links:', pageWidth / 2, 140, null, null, 'center');

    // Each link
    projects.forEach((p, i) => {
      const y = 154 + i * 8;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 255);
      const w = doc.getTextWidth(p.title);
      const x = (pageWidth - w) / 2;
      // place link
      doc.textWithLink(p.title, x, y, { url: p.url });
      // underline
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 255);
      doc.line(x, y + 1, x + w, y + 1);
    });

    // Finally, save
    doc.save(`DigiPIN_${currentDigipin.replace(/-/g, '')}.pdf`);
  }
});




// Decode DigiPIN
decodeBtn.addEventListener('click', () => {
    const digipin = digipinInput.value;
    if (!digipin) {
        alert('Please enter a DigiPIN');
        return;
    }
    
    try {
        const coords = getLatLngFromDigiPin(digipin);
        resultLat.textContent = coords.latitude;
        resultLon.textContent = coords.longitude;
        currentCoords = {
            lat: parseFloat(coords.latitude),
            lon: parseFloat(coords.longitude)
        };
        decodeResult.classList.remove('hidden');
    } catch (error) {
        alert(error.message);
    }
});

// View decoded location on map
viewDecodedMap.addEventListener('click', () => {
    if (currentCoords) {
        const { lat, lon } = currentCoords;
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
    }
});

// Download QR Code
downloadQrBtn.addEventListener('click', () => {
    const canvas = document.querySelector('#qrcode canvas');
    if (canvas) {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `DigiPIN_${currentDigipin.replace(/-/g, '')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// FAQ Toggle Function
function toggleFAQ(index) {
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.querySelector(`#faq-answer-${index}`).previousElementSibling.querySelector('i');
    
    if (answer.classList.contains('open')) {
        answer.classList.remove('open');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.classList.add('open');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

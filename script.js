// Menunggu seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', function() {

    // --- Inisialisasi GSAP & ScrollTrigger ---
    gsap.registerPlugin(ScrollTrigger);

    // --- Fungsionalitas Kursor Kustom ---
    const cursor = document.getElementById('custom-cursor');
    const interactiveElements = document.querySelectorAll('.interactive-link, .interactive-button, .interactive-card');

    window.addEventListener('mousemove', e => {
        gsap.to(cursor, {
            duration: 0.2,
            x: e.clientX,
            y: e.clientY
        });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });

    // --- Animasi Pembuka (Timeline) ---
    const tl = gsap.timeline();
    
    tl.to('header', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      .to('#hero-title', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to('#hero-subtitle', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to('#hero-button', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to('#hero-illustration-wrapper', { opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.75)' }, '-=0.5');


    // --- Efek Parallax pada Ilustrasi Hero ---
    const heroSection = document.getElementById('home');
    const illustration = document.getElementById('hero-illustration');

    if (heroSection && illustration) {
        heroSection.addEventListener('mousemove', (e) => {
            let rect = heroSection.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            let lag = illustration.getAttribute('data-lag');

            gsap.to(illustration, {
                duration: 1,
                x: (x - rect.width / 2) * lag,
                y: (y - rect.height / 2) * lag,
                ease: 'power2.out'
            });
        });
    }
    
    // --- Animasi saat Scroll ---
    const sections = gsap.utils.toArray('section');
    sections.forEach(section => {
        const title = section.querySelector('.section-title');
        const subtitle = section.querySelector('.section-subtitle');
        const cards = gsap.utils.toArray(section.querySelectorAll('.interactive-card'));
        const form = section.querySelector('#booking-form');
        const info = section.querySelector('.space-y-8'); 

        const sectionTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        if (title) sectionTl.from(title, { opacity: 0, y: 50, duration: 0.6 });
        if (subtitle) sectionTl.from(subtitle, { opacity: 0, y: 50, duration: 0.6 }, '-=0.4');
        if (cards.length > 0) sectionTl.from(cards, { opacity: 0, y: 50, duration: 0.5, stagger: 0.2 }, '-=0.4');
        if (form) sectionTl.from(form, { opacity: 0, x: -50, duration: 0.8 }, '-=0.4');
        if (info) sectionTl.from(info, { opacity: 0, x: 50, duration: 0.8 }, '-=0.8');
    });


    // --- Fungsionalitas Menu Mobile (Tetap Sama) ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Fungsionalitas Form Booking dengan Integrasi WhatsApp ---
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Mencegah form submit default

            // Ganti dengan nomor WhatsApp tujuan Anda (gunakan format negara tanpa +)
            const nomorWhatsApp = '628567730001'; 

            // Mengambil nilai dari setiap input
            const nama = document.getElementById('nama').value;
            const telepon = document.getElementById('telepon').value;
            const tanggalInput = document.getElementById('tanggal').value;
            const layanan = document.getElementById('pilih-layanan').value;

            // Validasi sederhana
            if (!nama || !telepon || !tanggalInput || !layanan) {
                alert('Harap lengkapi semua field yang wajib diisi.');
                return;
            }

            // Memformat tanggal agar lebih mudah dibaca
            const tanggalObj = new Date(tanggalInput);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const tanggalFormatted = tanggalObj.toLocaleDateString('id-ID', options);

            // Membuat template pesan WhatsApp
            const pesan = `
Halo BarberEasy, saya mau booking jadwal:

*Nama:* ${nama}
*No. Telepon:* ${telepon}
*Jadwal:* ${tanggalFormatted}
*Layanan:* ${layanan}

Mohon konfirmasinya. Terima kasih!
            `;

            // Membuat URL WhatsApp
            const whatsappUrl = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan.trim())}`;
            
            // Membuka tautan WhatsApp di tab baru
            window.open(whatsappUrl, '_blank');

            // Reset form setelah berhasil
            bookingForm.reset();
        });
    }
});

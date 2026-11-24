/**
 * app.js - ระบบควบคุมเว็บแอปพลิเคชันลอยกระทงออนไลน์
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. ตั้งค่า Canvas และตัวแปรระบบพื้นฐาน
    // ==========================================
    const canvas = document.getElementById('riverCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let waterLevel = height * 0.55; // ระดับเส้นขอบฟ้า/ผิวน้ำ

    function resizeCanvas() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        waterLevel = height * 0.55;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // คลังข้อมูลจำลอง (State)
    const state = {
        krathongs: [],
        lanterns: [],
        fireworks: [],
        particles: [],
        stars: [],
        selectedType: 'banana_leaf', // banana_leaf, lotus, bread, ice
        selectedFlowerColor: '#ff69b4',
        isAudioPlaying: false,
        audioCtx: null,
        musicInterval: null
    };

    // รายการคำอธิษฐานมงคลสำหรับสุ่ม
    const sampleWishes = [
        "ขอให้ชีวิตมีความสุข ความเจริญรุ่งเรือง ลอยทุกข์ลอยโศกไปกับสายน้ำ",
        "ขอให้การงานราบรื่น ประสบความสำเร็จสมดังปรารถนาทุกประการ",
        "ขอให้สุขภาพร่างกายแข็งแรง ปราศจากโรคภัยไข้เจ็บทั้งปวง",
        "ขอให้พบเจอแต่กัลยาณมิตร และสิ่งดีๆ เข้ามาในชีวิตตลอดทั้งปี",
        "ขอให้ครอบครัวอยู่เย็นเป็นสุข ร่ำรวยเงินทองไหลมาเทมา"
    ];

    // สร้างดวงดาวบนท้องฟ้าเริ่มต้น
    function initStars() {
        state.stars = [];
        for (let i = 0; i < 80; i++) {
            state.stars.push({
                x: Math.random() * width,
                y: Math.random() * waterLevel * 0.85,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random(),
                speed: Math.random() * 0.02 + 0.005
            });
        }
    }

    // สร้างกระทงเริ่มต้นในแม่น้ำเพื่อความมีชีวิตชีวา
    function initSampleKrathongs() {
        const samples = [
            { name: "สมชาย", wish: sampleWishes[0], type: "banana_leaf", color: "#ff69b4" },
            { name: "นลินี", wish: sampleWishes[1], type: "lotus", color: "#ffd700" },
            { name: "ครอบครัวใจดี", wish: sampleWishes[4], type: "bread", color: "#ff4500" }
        ];
        samples.forEach((item, index) => {
            spawnKrathong(
                item.name,
                item.wish,
                item.type,
                item.color,
                (width * 0.2) + (index * width * 0.25),
                waterLevel + 40 + (index * 55)
            );
        });
    }

    // ==========================================
    // 2. คลาสจัดการวัตถุในฉาก (Krathong, Lantern, Firework)
 // ==========================================
   
document.addEventListener("DOMContentLoaded", () => {
    loadSavedSettings();
    hideSplashScreen();
    setupEventListeners();
});

/* *********************************| إعداد أحداث التحميل للأزرار |********************************* */
function setupEventListeners() {
    setupNavigation();
    setupBackButton();
    setupDarkModeToggle();
    setupColorChange();
    setupFontSizeChange();
    setupNotificationSettings();
    setupDeleteDataButton();
}

/* *********************************| إعداد التنقل بين الصفحات |********************************* */
function setupNavigation() {
    document.querySelectorAll(".grid-item").forEach((item) => {
        item.addEventListener("click", function () {
            const pageId = this.getAttribute("data-page");
            navigateToPage(pageId);
        });
    });
}

/* *********************************| زر العودة |********************************* */
function setupBackButton() {
    document.querySelector(".back-btn").addEventListener("click", backToHome);
}

/* *********************************| الوضع الليلي |********************************* */
function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-theme");
        updateCardColors();
        saveSettings("darkMode", this.checked);
    });
}

/* *********************************| تغيير اللون الرئيسي |********************************* */
function setupColorChange() {
    const colorCircles = document.querySelectorAll(".color-circle");
    colorCircles.forEach((circle) => {
        circle.addEventListener("click", function () {
            const color = this.getAttribute("data-color");
            document.documentElement.style.setProperty("--primary-color", color);
            saveSettings("primaryColor", color);
            updateActiveColorCircle(this);
        });
    });
}

function setupColorChange() {
    const colorCircles = document.querySelectorAll(".color-circle:not(.add-color)");
    const customColorPicker = document.getElementById("customColorPicker");
    const addColorCircle = document.querySelector(".add-color");

    // تحديث الألوان عند اختيار دائرة موجودة
    colorCircles.forEach((circle) => {
        circle.addEventListener("click", function () {
            const color = this.getAttribute("data-color");
            document.documentElement.style.setProperty("--primary-color", color);
            saveSettings("primaryColor", color);
            updateActiveColorCircle(this);
        });
    });

    // اختيار لون مخصص
    addColorCircle.addEventListener("click", () => {
        customColorPicker.click();
    });

    customColorPicker.addEventListener("input", function () {
        const customColor = this.value;
        document.documentElement.style.setProperty("--primary-color", customColor);
        saveSettings("primaryColor", customColor);
        updateActiveColorCircle(customColor);

        // تغيير خلفية الدائرة التي تحتوي على الأيقونة إلى اللون المختار
        addColorCircle.style.backgroundColor = customColor;
    });
}

// تحديث الدائرة النشطة
function updateActiveColorCircle(activeCircle) {
    const colorCircles = document.querySelectorAll(".color-circle");
    colorCircles.forEach((circle) => circle.classList.remove("active"));
    if (typeof activeCircle === "string") {
        const newCircle = document.createElement("span");
        newCircle.classList.add("color-circle");
        newCircle.style.backgroundColor = activeCircle;
        newCircle.setAttribute("data-color", activeCircle);
        document.querySelector(".color-options").prepend(newCircle);
        newCircle.addEventListener("click", () => {
            document.documentElement.style.setProperty("--primary-color", activeCircle);
            saveSettings("primaryColor", activeCircle);
        });
    } else {
        activeCircle.classList.add("active");
    }
}

// محاكاة حفظ الإعدادات
function saveSettings(key, value) {
    console.log(`Saved setting: ${key} = ${value}`);
}

// استدعاء الوظيفة
setupColorChange();


/* *********************************| تغيير حجم الخط |********************************* */
function setupFontSizeChange() {
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    fontSizeSelect.addEventListener("change", function () {
        const fontSize = this.value;
        document.documentElement.style.setProperty(
            "--font-size-multiplier",
            fontSize
        );
        saveSettings("fontSize", fontSize);
    });
}

/* *********************************| إعداد إشعارات |********************************* */
function setupNotificationSettings() {
    const lectureNotifications = document.getElementById("lectureNotifications");
    lectureNotifications.addEventListener("change", function () {
        saveSettings("lectureNotifications", this.checked);
    });

    const newsNotifications = document.getElementById("newsNotifications");
    newsNotifications.addEventListener("change", function () {
        saveSettings("newsNotifications", this.checked);
    });
}

/* *********************************| زر حذف البيانات |********************************* */
function setupDeleteDataButton() {
    document
        .querySelector(".delete-data-btn")
        .addEventListener("click", function () {
            Swal.fire({
                title: "هل أنت متأكد؟",
                text: "سيتم حذف جميع الاعدادات المحفوظة!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "نعم، احذف!",
                cancelButtonText: "إلغاء",
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.clear(); // حذف جميع البيانات المحفوظة
                    Swal.fire("تم الحذف!", "تم تعين الاعدادات الافتراضية", "success").then(
                        () => {
                            resetSettingsToDefaults(); // إعادة تعيين الإعدادات الافتراضية
                            updateMainPageUI(); // تحديث واجهة الصفحة الرئيسية مباشرة
                        }
                    );
                }
            });
        });
}

/* *********************************| إعادة تعيين الإعدادات الافتراضية |********************************* */
function resetSettingsToDefaults() {
    // الوضع الليلي
    document.getElementById("darkModeToggle").checked = false;
    document.body.classList.remove("dark-theme");

    // شريط التنقل السفلي
    document.getElementById("bottomNavToggle").checked = true;
    const bottomNav = document.getElementById("bottom-nav");
    bottomNav.style.display = "flex"; // إظهار الشريط السفلي فورًا

    // اللون الرئيسي
    document.documentElement.style.setProperty("--primary-color", "#4A90E2");
    document.querySelectorAll(".color-circle").forEach((circle) => {
        circle.classList.remove("active");
    });
    document
        .querySelector('.color-circle[data-color="#4A90E2"]')
        .classList.add("active");

    // الإشعارات
    document.getElementById("lectureNotifications").checked = false;
    document.getElementById("newsNotifications").checked = false;

    // اللغة
    document.getElementById("languageSelect").value = "ar";

    // حجم الخط
    document.getElementById("fontSizeSelect").value = "1";
    document.documentElement.style.setProperty("--font-size-multiplier", "1");
}

/* *********************************| تحديث واجهة الشاشة الرئيسية |********************************* */
function updateMainPageUI() {
    // تحديث ألوان الكروت بناءً على الوضع الحالي (ليل/نهار)
    const isDarkMode = document.body.classList.contains("dark-theme");
    const cards = document.querySelectorAll(".grid-item");
    cards.forEach((card) => {
        if (isDarkMode) {
            card.style.backgroundColor = "#2d2d2d";
            card.style.color = "#ffffff";
        } else {
            card.style.backgroundColor = "white";
            card.style.color = "#333";
        }
    });
}

/* *********************************| إخفاء شاشة البداية |********************************* */
function hideSplashScreen() {
    setTimeout(() => {
        document.getElementById("splash-screen").style.display = "none";
        showPage("home");
    }, 2000);
}

/* *********************************| دوال مساعدة |********************************* */
function showPage(pageId) {
    document.querySelectorAll(".page").forEach((page) => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}

function navigateToPage(pageId) {
    showPage(pageId);
}

function backToHome() {
    showPage("home");
}

function saveSettings(key, value) {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    settings[key] = value;
    localStorage.setItem("settings", JSON.stringify(settings));
}

function loadSavedSettings() {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");

    if (settings.darkMode) {
        document.getElementById("darkModeToggle").checked = true;
        document.body.classList.add("dark-theme");
        updateCardColors();
    }

    if (settings.primaryColor) {
        document.documentElement.style.setProperty(
            "--primary-color",
            settings.primaryColor
        );
        updateActiveColorCircle(
            document.querySelector(`[data-color="${settings.primaryColor}"]`)
        );
    }

    if (settings.fontSize) {
        const fontSize = settings.fontSize;
        document.getElementById("fontSizeSelect").value = fontSize;
        document.documentElement.style.setProperty(
            "--font-size-multiplier",
            fontSize
        );
    }

    if (settings.lectureNotifications) {
        document.getElementById("lectureNotifications").checked = true;
    }
    if (settings.newsNotifications) {
        document.getElementById("newsNotifications").checked = true;
    }
}

function updateActiveColorCircle(selectedCircle) {
    document.querySelectorAll(".color-circle").forEach((circle) => {
        circle.classList.remove("active");
    });
    if (selectedCircle) {
        selectedCircle.classList.add("active");
    }
}

function updateCardColors() {
    const isDarkMode = document.body.classList.contains("dark-theme");
    const cards = document.querySelectorAll(".grid-item");
    cards.forEach((card) => {
        if (isDarkMode) {
            card.style.backgroundColor = "#2d2d2d";
            card.style.color = "#ffffff";
        } else {
            card.style.backgroundColor = "white";
            card.style.color = "#333";
        }
    });
}

/* *********************************| وظائف إضافية للصفحات الأخرى |********************************* */
function showLectures() {
    // كود لعرض المحاضرات
}

function showVideos() {
    // كود لعرض الفيديوهات
}

function showLinks() {
    // كود لعرض الروابط
}

/* *********************************| دالة لفتح وإغلاق المحاضرات |********************************* */
function toggleLectures(header) {
    const content = header.nextElementSibling;
    const arrow = header.querySelector(".arrow");

    header.classList.toggle("active");

    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

/* *********************************| دالة  لعرض محتوى المحاضرات |********************************* */
function toggleLectures(header) {
    const content = header.nextElementSibling;
    const arrow = header.querySelector(".arrow");
    const openContents = document.querySelectorAll(".lectures-content.show");

    openContents.forEach((openContent) => {
        if (openContent !== content) {
            openContent.classList.remove("show");
            openContent.previousElementSibling.classList.remove("active");
            openContent.previousElementSibling
                .querySelector(".arrow")
                .classList.remove("rotate");
            openContent.style.maxHeight = null;
        }
    });

    header.classList.toggle("active");
    content.classList.toggle("show");
    arrow.classList.toggle("rotate");

    if (content.classList.contains("show")) {
        content.style.maxHeight = content.scrollHeight + "px";
    } else {
        content.style.maxHeight = null;
    }
}

/* *********************************| إضافة مستمع أحداث لجميع أزرار التحميل |********************************* */
document.querySelectorAll(".download-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
        e.preventDefault();
        const lectureTitle =
            this.closest(".lecture-item").querySelector("span").textContent;

        Swal.fire({
            title: "جاري التحميل...",
            text: `جاري تحميل ${lectureTitle}`,
            icon: "info",
            timer: 1500,
            showConfirmButton: false,
        });
    });
});

/* *********************************| دالة لتحديث مظهر المحاضرات في الوضع الليلي |********************************* */
function updateLecturesTheme() {
    const isDarkMode = document.body.classList.contains("dark-theme");
    const subjectItems = document.querySelectorAll(".subject-item");

    subjectItems.forEach((item) => {
        if (isDarkMode) {
            item.style.backgroundColor = "#2d2d2d";
            item.style.color = "#ffffff";
        } else {
            item.style.backgroundColor = "white";
            item.style.color = "#333";
        }
    });
}

/* *********************************| إضافة مستمع أحداث للبحث في المحاضرات |********************************* */
function searchLectures(searchTerm) {
    const lectureItems = document.querySelectorAll(".lecture-item");

    lectureItems.forEach((item) => {
        const lectureTitle = item.querySelector("span").textContent.toLowerCase();
        if (lectureTitle.includes(searchTerm.toLowerCase())) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

/* *********************************| إضافة خاصية الفرز للمحاضرات |********************************* */
function sortLectures(sortBy) {
    const lecturesContainer = document.querySelector(".lectures-content");
    const lectureItems = Array.from(
        document.query.querySelectorAll(".lecture-item")
    );

    lectureItems.sort((a, b) => {
        const titleA = a.querySelector("span").textContent;
        const titleB = b.querySelector("span").textContent;

        if (sortBy === "asc") {
            return titleA.localeCompare(titleB);
        } else {
            return titleB.localeCompare(titleA);
        }
    });

    lectureItems.forEach((item) => {
        lecturesContainer.appendChild(item);
    });
}

/* *********************************| دالة لتوسيع وإغلاق تفاصيل المحاضرات |********************************* */
function toggleBuildingDetails(row) {
    const detailsRow = row.nextElementSibling;
    detailsRow.classList.toggle("show");
    row.classList.toggle("active");
}

/* *********************************| إعداد أحداث التحميل عند تحميل الصفحة |********************************* */
document.addEventListener("DOMContentLoaded", function () {
    const gridItems = document.querySelectorAll(".grid-item");
    gridItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add("show");
        }, index * 100);
    });
});

/* *********************************| إعداد شاشة التحميل |********************************* */
window.onload = function () {
    const loadingScreen = document.getElementById("loading-screen");
    setTimeout(() => {
        loadingScreen.classList.add("animate__fadeOut");
        setTimeout(() => {
            loadingScreen.style.display = "none";
            const homePage = document.getElementById("home");
            homePage.style.display = "block";
            homePage.classList.add("animate__fadeIn");

            const gridItems = document.querySelectorAll(".grid-item");
            gridItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add("show");
                }, index * 100);
            });
        }, 500);
    }, 1200);
};

/* *********************************| دالة للتنقل بين الصفحات |********************************* */
function navigateTo(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach((page) => {
        page.style.display = "none";
        page.classList.remove("animate__fadeIn");
    });
    const activePage = document.getElementById(pageId);
    activePage.style.display = "block";
    activePage.classList.add("animate__fadeIn");
}

/* *********************************| إعداد الشريط السفلي وشاشة التحميل |********************************* */
document.addEventListener("DOMContentLoaded", () => {
    loadSavedSettings();

    const bottomNav = document.getElementById("bottom-nav");
    const bottomNavToggle = document.getElementById("bottomNavToggle");
    const loadingScreen = document.getElementById("loading-screen");

    let isHiding = false;  // متغير لتتبع حالة إخفاء الشريط السفلي

    function hideLoadingScreen() {
        loadingScreen.classList.add("animate__fadeOut");
        setTimeout(() => {
            loadingScreen.style.display = "none";
            navigateToPage("home");
        }, 500);
    }

    bottomNavToggle.addEventListener("change", function () {
        const isEnabled = this.checked;
        saveSettings("bottomNavVisible", isEnabled);
        updateBottomNavVisibility(isEnabled);
    });

    function updateBottomNavVisibility(isEnabled) {
        const isHomePage =
            document.getElementById("home").style.display === "block";

        if (isHomePage || !isEnabled) {
            if (!isHiding) {
                isHiding = true; // تعيين الحالة إلى إخفاء الشريط
                bottomNav.classList.add("slide-out-down");
                setTimeout(() => {
                    bottomNav.style.display = "none";
                    bottomNav.classList.remove("slide-out-down");
                    isHiding = false; // إعادة تعيين الحالة بعد الإخفاء
                }, 500);
            }
        } else {
            bottomNav.style.display = "flex";
        }
    }

    function navigateToPage(pageId) {
        showPage(pageId);

        const isEnabled = bottomNavToggle.checked;
        if (pageId === "home") {
            if (!isHiding) {
                isHiding = true;
                bottomNav.classList.add("slide-out-down");
                setTimeout(() => {
                    bottomNav.style.display = "none";
                    bottomNav.classList.remove("slide-out-down");
                    isHiding = false;
                }, 500);
            }
        } else {
            updateBottomNavVisibility(isEnabled);
        }
    }

    document.querySelectorAll(".grid-item").forEach((item) => {
        item.addEventListener("click", function () {
            const pageId = this.getAttribute("data-page");
            navigateToPage(pageId);
        });
    });

    document.querySelectorAll(".back-btn").forEach((button) => {
        button.addEventListener("click", () => navigateToPage("home"));
    });

    document
        .querySelector('#bottom-nav a[href="#home"]')
        .addEventListener("click", (event) => {
            event.preventDefault();
            navigateToPage("home");
        });

    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    bottomNavToggle.checked = settings.bottomNavVisible !== false;

    setTimeout(() => {
        hideLoadingScreen();
    }, 1200);
});

window.onload = function () {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        section.style.display = "block";
    });
};


/* *********************************| صفحة الفيديوهات |********************************* */

const API_KEY = "AIzaSyDGIGrDcLYPRjgQxP--KuTFL2fNDuTvl1M"; // استبدل بمفتاح API الخاص بك
const playlistSelector = document.getElementById("playlist-selector");
const mainPlayer = document.getElementById("main-player");
const defaultMessage = document.getElementById("default-message");
const videoThumbnails = document.getElementById("video-thumbnails");
const loadingOverlay = document.getElementById("loading-overlay");
const prevVideoBtn = document.getElementById("prev-video");
const nextVideoBtn = document.getElementById("next-video");
let currentVideoIndex = 0;
let videos = [];

// تحميل الفيديوهات لقائمة التشغيل
async function loadPlaylist(playlistId) {
    if (!playlistId) {
        resetPlayer();
        return;
    }

    showLoading();
    const API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlistId}&key=${API_KEY}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        videos = data.items;
        currentVideoIndex = 0;
        displayVideos(videos);
        updateNavigationButtons();
    } catch (error) {
        console.error("Error fetching playlist:", error);
    } finally {
        hideLoading();
    }
}

const apiUrl =
    "https://script.google.com/macros/s/AKfycbyRUdECuLYj17sj1pX-MqlXUmvtHmQaV3jsbS_5U3Z4-9f7e6Ruz-GyW9S4k9PQLHTXSw/exec";

// جلب البيانات وإضافتها إلى القائمة المنسدلة
fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        const selector = document.getElementById("playlist-selector");
        // التحقق من وجود البيانات
        if (data.playlists && Array.isArray(data.playlists)) {
            data.playlists.forEach((playlist) => {
                const option = document.createElement("option");
                option.value = playlist.id;
                option.textContent = playlist.name;
                selector.appendChild(option);
            });
        } else {
            console.error("البيانات غير متوفرة أو غير صحيحة.");
        }
    })
    .catch((error) => console.error("خطأ أثناء جلب البيانات:", error));

function doGet() {
    // معرف ملف Google Drive
    const fileId = "17K2kssK3rUl66k6WiNhY-jHfCK_l-v4n"; // ضع هنا معرف الملف
    try {
        // استرجاع الملف من Google Drive
        const file = DriveApp.getFileById(fileId);
        const content = file.getBlob().getDataAsString();
        const jsonData = JSON.parse(content);

        // إرجاع البيانات كـ JSON
        return ContentService.createTextOutput(
            JSON.stringify(jsonData)
        ).setMimeType(ContentService.MimeType.JSON);
    } catch (e) {
        // معالجة الأخطاء وإرجاع رسالة خطأ
        return ContentService.createTextOutput(
            JSON.stringify({ error: e.message })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

// عرض الفيديوهات
function displayVideos(videos) {
    videoThumbnails.innerHTML = "";
    if (videos.length > 0) {
        playVideo(videos[0].snippet.resourceId.videoId);
    }

    videos.forEach((video, index) => {
        const { title, thumbnails, resourceId } = video.snippet;
        const videoId = resourceId.videoId;

        const videoHTML = `
            <div class="video-item" data-video-index="${index}">
                <img src="${thumbnails.medium.url}" alt="${title}" loading="lazy">
                <div class="video-item-title">${title}</div>
            </div>
        `;
        videoThumbnails.insertAdjacentHTML("beforeend", videoHTML);
    });

    // إضافة أحداث للتشغيل
    document.querySelectorAll(".video-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            currentVideoIndex = parseInt(
                e.currentTarget.getAttribute("data-video-index"),
                10
            );
            playVideo(videos[currentVideoIndex].snippet.resourceId.videoId);
            updateNavigationButtons();
        });
    });
}

// تشغيل الفيديو
function playVideo(videoId) {
    mainPlayer.style.display = "block";
    defaultMessage.style.display = "none";
    mainPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

// إعادة تعيين المشغل
function resetPlayer() {
    mainPlayer.style.display = "none";
    defaultMessage.style.display = "block";
    mainPlayer.src = "";
    videoThumbnails.innerHTML = "";
    videos = [];
    updateNavigationButtons();
}

// تحديث أزرار التنقل
function updateNavigationButtons() {
    prevVideoBtn.disabled = currentVideoIndex <= 0;
    nextVideoBtn.disabled = currentVideoIndex >= videos.length - 1;
}

// التنقل بين الفيديوهات
prevVideoBtn.addEventListener("click", () => {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;
        playVideo(videos[currentVideoIndex].snippet.resourceId.videoId);
        updateNavigationButtons();
    }
});

nextVideoBtn.addEventListener("click", () => {
    if (currentVideoIndex < videos.length - 1) {
        currentVideoIndex++;
        playVideo(videos[currentVideoIndex].snippet.resourceId.videoId);
        updateNavigationButtons();
    }
});

// إظهار التحميل
function showLoading() {
    document.getElementById("loading-overlay").classList.add("active");
}

// إخفاء التحميل
function hideLoading() {
    document.getElementById("loading-overlay").classList.remove("active");
}

// حدث تغيير قائمة التشغيل
playlistSelector.addEventListener("change", (e) => {
    const playlistId = e.target.value;
    loadPlaylist(playlistId);
});

/* *********************************| دالة لإيقاف تشغيل الفيديو |********************************* */
function stopVideo() {
    const currentSrc = mainPlayer.src; // حفظ المصدر الحالي
    mainPlayer.src = ""; // إيقاف الفيديو مؤقتًا عن طريق إزالة المصدر
    setTimeout(() => {
        mainPlayer.src = currentSrc; // إعادة المصدر دون التشغيل التلقائي
    }, 10); // تعيين المصدر مرة أخرى بعد وقت قصير لإيقاف التشغيل
}

/* *********************************| صفحة الجدول  |********************************* */

function toggleDropdown() {
    const dropdown = document.querySelector(".dropdown");
    const dropdownContent = dropdown.querySelector(".dropdown-content");
    dropdownContent.style.display =
        dropdownContent.style.display === "block" ? "none" : "block";
    dropdown.classList.toggle("open");
}

function showImages(type) {
    // إخفاء الصور في البداية
    document.getElementById("regular-images").style.display = "none";
    document.getElementById("affiliate-images").style.display = "none";

    // إظهار الصور بناءً على النوع المختار
    if (type === "regular") {
        document.getElementById("regular-images").style.display = "flex";
    } else if (type === "affiliate") {
        document.getElementById("affiliate-images").style.display = "flex";
    }

    // إظهار خيار "إخفاء الكل"
    document.getElementById("hide-all-option").style.display = "block";

    // إغلاق القائمة بعد الاختيار
    const dropdownContent = document.querySelector(".dropdown-content");
    dropdownContent.style.display = "none";
    document.querySelector(".dropdown").classList.remove("open");
}

function hideAllImages() {
    // إخفاء كل الصور
    document.getElementById("regular-images").style.display = "none";
    document.getElementById("affiliate-images").style.display = "none";

    // إخفاء خيار "إخفاء الكل"
    document.getElementById("hide-all-option").style.display = "none";

    // إغلاق القائمة
    const dropdownContent = document.querySelector(".dropdown-content");
    dropdownContent.style.display = "none";
    document.querySelector(".dropdown").classList.remove("open");
}


function checkInternetConnection() {
    const noInternetMessage = document.getElementById("no-internet-message");
    const pages = document.querySelectorAll(".page");
    if (!navigator.onLine) {
        noInternetMessage.style.display = "flex";
        pages.forEach((page) => (page.style.display = "none"));
    } else {
        noInternetMessage.style.display = "none";
        navigateToPage("home"); // عرض الشاشة الرئيسية عند توفر الاتصال
    }
}

// استدعاء الدالة عند تحميل الصفحة وتحديثها عند تغير حالة الاتصال
window.addEventListener("load", checkInternetConnection);
window.addEventListener("online", checkInternetConnection);
window.addEventListener("offline", checkInternetConnection);



/* *********************************| صفحة عدم توفر انترنت للمحاضرات  |********************************* */
document.addEventListener('DOMContentLoaded', function () {
    const lecturesPage = document.getElementById('lectures');
    const offlineContainer = document.getElementById('offline-container-lec');
    const subjectsList = document.getElementById('subjects-list');

    // Function to handle connection status
    function updateConnectionStatus() {
        if (navigator.onLine) {
            // User is online
            offlineContainer.style.display = 'none';
            subjectsList.style.display = 'block';
        } else {
            // User is offline
            offlineContainer.style.display = 'flex';
            subjectsList.style.display = 'none';
        }
    }

    // Listen for online and offline events
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Initial check
    updateConnectionStatus();
});


/* *********************************| صفحة عدم توفر انترنت للفيديوهات  |********************************* */


document.addEventListener('DOMContentLoaded', function () {
    const videosPage = document.getElementById('videos');
    const offlineContainer = document.getElementById('offline-container');
    const mainVideoContainer = document.querySelector('.container.playlist-container');

    // Function to handle connection status
    function updateConnectionStatus() {
        if (navigator.onLine) {
            // User is online
            offlineContainer.style.display = 'none';
            mainVideoContainer.style.display = 'block';
        } else {
            // User is offline
            offlineContainer.style.display = 'flex';
            mainVideoContainer.style.display = 'none';
        }
    }

    // Listen for online and offline events
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Initial check
    updateConnectionStatus();
});



/* *********************************| صفحة استدعاء المحاضرات  |********************************* */

// المفتاح الخاص بـ API من جوجل درايف
const GOOGLE_DRIVE_API_KEY = "AIzaSyB7vGBBmmybGA_EvGsvdmhLz8qangORK0I"; // استبدل بـ API Key الخاص بك
const mainFolderId = "1CcbZMF3wjzC7tE9fstJY6F78aPcFGakJ"; // معرف المجلد الرئيسي

// دالة لاسترجاع المجلدات من جوجل درايف
async function fetchFolders(parentId) {
    const folders = [];
    let nextPageToken = null;

    do {
        const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${GOOGLE_DRIVE_API_KEY}&fields=nextPageToken,files(id,name)&orderBy=name&pageSize=100${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;
        const response = await fetch(url);
        const data = await response.json();
        folders.push(...(data.files || []));
        nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return folders;
}

// دالة لاسترجاع الملفات من جوجل درايف مع ترتيب حسب الاسم
async function fetchFiles(parentId) {
    const files = [];
    let nextPageToken = null;

    do {
        const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+mimeType!='application/vnd.google-apps.folder'&key=${GOOGLE_DRIVE_API_KEY}&fields=nextPageToken,files(id,name)&orderBy=name&pageSize=100${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;
        const response = await fetch(url);
        const data = await response.json();
        files.push(...(data.files || []));
        nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return files;
}

// دالة لتحميل المواد
async function loadSubjects() {
    const subjectsList = document.getElementById("subjects-list");
    const loadingMessage = document.getElementById("loading-message-container");
    subjectsList.innerHTML = ""; // إزالة النص الافتراضي

    // إظهار رسالة التحميل
    loadingMessage.style.display = "block";

    try {
        // Fetch جميع المواد (المجلدات) من المجلد الرئيسي
        const subjects = await fetchFolders(mainFolderId);

        if (subjects.length === 0) {
            subjectsList.innerHTML = "<p>لا توجد مواد متاحة حاليا.</p>";
        } else {
            // التكرار عبر كل مادة وجلب ملفاتها
            for (const subject of subjects) {
                const subjectItem = document.createElement("div");
                subjectItem.classList.add("subject-item");

                const subjectHeader = document.createElement("div");
                subjectHeader.classList.add("subject-header");
                subjectHeader.innerHTML = `
                    <i class="fas fa-folder"></i>
                    <span>${subject.name}</span>
                    <i class="fas fa-chevron-down arrow"></i>
                `;

                const lecturesContent = document.createElement("div");
                lecturesContent.classList.add("lectures-content");

                // جلب الملفات فورًا عند تحميل الصفحة
                const files = await fetchFiles(subject.id);
                if (files.length > 0) {
                    lecturesContent.innerHTML = files
                        .map(
                            (file) => `
                            <div class="lecture-item">
                                <span>${file.name}</span>
                                <div class="lecture-actions">
                                    <a href="https://drive.google.com/uc?export=download&id=${file.id}" download>
                                        <i class="fas fa-download"></i>
                                    </a>
                                </div>
                            </div>
                        `
                        )
                        .join("");
                } else {
                    lecturesContent.innerHTML = "<p><br>لا توجد ملفات متاحة لهذه المادة. <br> تحقق لاحقا.</p>";
                }

                // إضافة حدث النقر على العنوان لفتح/إغلاق المحتوى
                subjectHeader.onclick = () => {
                    const arrow = subjectHeader.querySelector(".arrow");
                    subjectHeader.classList.toggle("active");
                    lecturesContent.classList.toggle("show");
                };

                subjectItem.appendChild(subjectHeader);
                subjectItem.appendChild(lecturesContent);
                subjectsList.appendChild(subjectItem);
            }
        }
    } catch (error) {
        console.error("Error loading subjects:", error);
        subjectsList.innerHTML =
            "<p>حدث خطأ أثناء تحميل البيانات. حاول مرة أخرى لاحقًا.</p>";
    } finally {
        // إخفاء رسالة التحميل بعد الانتهاء
        loadingMessage.style.display = "none";
    }
}

// تحميل المواد عند تحميل الصفحة
loadSubjects();

function navigateToPage(pageId) {
    document
        .querySelectorAll(".page")
        .forEach((page) => (page.style.display = "none"));
    document.getElementById(pageId).style.display = "block";

    // إخفاء شريط التنقل السفلي عند الذهاب إلى الشاشة الرئيسية
    const bottomNav = document.getElementById("bottom-nav");
    if (pageId === "home") {
        bottomNav.style.display = "none";
    } else {
        bottomNav.style.display = "flex";
    }
}

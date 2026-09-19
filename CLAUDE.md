# مشروع: المكتب الافتراضي التفاعلي

## الستاك
- HTML + CSS + JavaScript فقط (ES Modules). لا bundler، لا npm، لا build.
- Three.js r170 من CDN عبر import map:
  "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
- التشغيل: `python -m http.server 8080` ثم http://localhost:8080

## هيكل الملفات (لا تُنشئ ملفات خارج هذا الهيكل بدون سبب)
index.html          الواجهة + import map
css/style.css       كل الأنماط
js/main.js          renderer, camera, controls, render loop, input
js/materials.js     المواد المشتركة + مولّدات الأشكال والملمس
js/room.js          الغرفة: أرضية، جدران، سقف، نافذة، إضاءة
js/furniture.js     الأثاث
js/gallery.js       اللوحات على الجدران
js/branding.js      لافتة النيون
js/cv.js            Transform Mode + عرض السيرة الذاتية
js/panel.js         لوحة التحكم + الحفظ في localStorage
js/tween.js         محرك حركة بسيط
js/data.js          المحتوى الافتراضي (البراند + السيرة)

## القواعد
- الوحدات بالمتر. الغرفة: عرض 10 × عمق 8 × ارتفاع 3.2. الأرضية عند y=0.
- كل الأشكال إجرائية من primitives (Box/Cylinder/Sphere/Plane). لا تحميل موديلات خارجية.
- المواد مشتركة عبر كائن `mats` في materials.js. لا تُنشئ مادة جديدة داخل حلقة.
- الرندر عند الطلب فقط: ارسم إطارًا عند الحركة أو التغيير، وإلا لا شيء.
- الثيم داكن: خلفية #05060a، نيون أساسي #00e5ff، نيون ثانوي #ff2bd6.
- بعد كل تعديل: افتح المتصفح وتأكد من عدم وجود أخطاء في الكونسول.
- لا تعدّل ملفًا خارج نطاق التعليمة الحالية إلا إذا كان ضروريًا، واذكر ذلك.

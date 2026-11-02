# تشغيل ونشر واجهة نَبْض الجديدة

المستودع: https://github.com/alians200a-commits/Nbd

## الخطوة المطلوبة لمرة واحدة على GitHub

1. افتح https://github.com/alians200a-commits/Nbd/settings/pages
2. من **Build and deployment** اختر **Source → GitHub Actions** (وليس Deploy from a branch).
3. لا تضف قالب نشر جديد؛ الملف `.github/workflows/deploy-student-site.yml` موجود ويبني التطبيق بالفعل.
4. افتح https://github.com/alians200a-commits/Nbd/actions/workflows/deploy-student-site.yml وشغّل **Run workflow** على الفرع `main`، أو أعد تشغيل الفحص الفاشل.
5. بعد نجاح **deploy** افتح https://alians200a-commits.github.io/Nbd/ وتحقق من الصفحة الرئيسية والأيقونات والتنقل.

## التشخيص المؤكد بتاريخ 3 تشرين الثاني 2026

- آخر بناء للتطبيق الجديد نجح، وكذلك فحوص الواجهة.
- النشر تعثّر عند خطوة `actions/deploy-pages@v4` بالرسالة `Failed to create deployment (status: 404)` وطلب GitHub صراحةً تفعيل Pages من إعدادات المستودع.
- تغيير الملفات على الفرع `main` وحده لا يعرض الواجهة على الموقع إلا بعد نجاح النشر.
- ناتج البناء جاهز ضمن Artifact باسم `nabd-student-ui-dist` في هذا التشغيل:
  https://github.com/alians200a-commits/Nbd/actions/runs/41524697713
- ملفات الرسومات الملوّنة الشفافة ضمن `public/nabd-art/` موجودة في البناء، لكن عدم ظهورها على الموقع قبل نجاح النشر لا يعني فشل تعديل الأيقونات.

هذا المستودع عام. تجنّب نشر الملفات الصوتية الأصلية الخاصة أو كتب/ملازم غير مصرح بإتاحتها للعموم.

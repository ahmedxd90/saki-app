# saki

هذا المستودع يجمع مشروع تطبيق **saki** المستخرج من الحزمة المرفقة، ويتكون من تطبيق Flutter، لوحة الإدارة، وثائق المشروع، وكود Parse Cloud.

## المكونات

| المجلد | الوظيفة |
|---|---|
| `app/` | تطبيق Flutter Android/iOS/Web، ويستخدم Parse Server وOneSignal وZEGOCLOUD وFirebase |
| `admin/` | لوحة الإدارة PHP/JavaScript |
| `cloud_code/` | وظائف Parse Cloud الخلفية |
| `docs/` | الوثائق الأصلية للمشروع |

قاعدة البيانات الحالية ليست SQLite داخل التطبيق؛ التطبيق مصمم للعمل مع **Parse Server المتوافق مع Back4App**، ويستخدم ملفات Parse مثل User وPost وStreaming وغيرها، مع تخزين الملفات عبر إعدادات Parse/الخادم. يجب إنشاء تطبيق Back4App أو Parse Server خاص بك ثم إدخال بياناته.

## إعداد المفاتيح

انسخ `app/.env.example` إلى ملف JSON محلي مثل `app/env/saki.json`، ثم ضع قيمك الحقيقية. مجلد `env/` مستثنى من Git. لا تضع مفاتيح ZEGOCLOUD السرية أو مفاتيح Firebase أو OneSignal داخل مستودع عام.

المفاتيح المطلوبة هي: Parse App ID وClient Key وServer URL وLive Query URL، وOneSignal App ID، وZEGOCLOUD App ID وApp Sign وServer Secret، إضافة إلى ملفات `google-services.json` الخاصة بتطبيق Android وملف Firebase iOS عند الحاجة. **Server Secret الخاص بـ ZEGOCLOUD لا ينبغي أن يكون داخل تطبيق الهاتف في الإنتاج**؛ الأفضل إصدار Tokens من خادم موثوق. الكود الحالي يحتفظ بتوافقه مع التدفق القديم عبر `--dart-define` إلى أن يتم نقل إصدار Tokens إلى Cloud Code.

## بناء Android

بعد تثبيت Flutter وAndroid SDK وJava 17:

```bash
cd app
flutter pub get
flutter analyze
flutter build apk --release --dart-define-from-file=env/saki.json
```

الناتج يكون في `app/build/app/outputs/flutter-apk/app-release.apk`. لإنشاء نسخة متجر موقعة، أنشئ keystore خاصًا بك وملف `app/android/key.properties` محليًا، ثم لا ترفعه إلى Git.

## الإشعارات والبث

- **OneSignal/FCM:** يلزم OneSignal App ID وملفات Firebase الرسمية المطابقة للمعرّف `com.saki.app`.
- **ZEGOCLOUD:** يلزم إنشاء مشروع ZEGOCLOUD جديد، ثم وضع App ID وApp Sign. يجب تفعيل إصدار Tokens من الخادم قبل الإنتاج.
- **Parse Cloud:** انشر `cloud_code/main.js` على خادم Parse/Back4App واضبط أسرار OneSignal في بيئة الخادم، وليس في تطبيق Flutter.

## حالة المستودع

المستودع يعاد بناؤه من الحزمة المرفقة، ولا يعتمد على تاريخ سابق للمستودع الفارغ. ملفات البناء والاعتمادات المولدة والأسرار مستثناة من Git.

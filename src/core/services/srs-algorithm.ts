import { Progress } from '../store/db';

// الثوابت الأساسية لمعامل السهولة بناءً على SM-2
const MIN_EASE = 1.3;
const INITIAL_EASE = 2.5;

/**
 * تطبيق خوارزمية التكرار المتباعد (معتمدة على SM-2 الخاصة بـ Anki)
 * @param progress كائن التقدم الحالي للكلمة
 * @param rating التقييم: 1 (أعد)، 2 (صعب)، 3 (جيد)، 4 (سهل)
 * @returns كائن Progress مُحدث
 */
export function processReview(progress: Progress, rating: 1 | 2 | 3 | 4): Progress {
    let { interval, easeFactor, repetitions, history } = progress;
    let newStatus = progress.status;

    // القيم الافتراضية للبطاليق الجديدة
    if (!easeFactor) easeFactor = INITIAL_EASE;
    if (interval === undefined) interval = 0;
    if (repetitions === undefined) repetitions = 0;

    let nextInterval = 0;

    switch (rating) {
        case 1: // Again (أعد)
            repetitions = 0;
            nextInterval = 1; // نُعيد المراجعة غداً (أو في غضون وقت قصير)
            easeFactor -= 0.20; // البطاقة صعبة، نقلل من السهولة
            newStatus = 'learning';
            break;

        case 2: // Hard (صعب)
            repetitions += 1;
            nextInterval = interval === 0 ? 1 : Math.round(interval * 1.2);
            easeFactor -= 0.15;
            newStatus = 'review';
            break;

        case 3: // Good (جيد)
            repetitions += 1;
            if (repetitions === 1) {
                nextInterval = 1; // بعد يوم
            } else if (repetitions === 2) {
                nextInterval = 6; // بعد 6 أيام
            } else {
                nextInterval = Math.round(interval * easeFactor);
            }
            newStatus = 'review';
            break;

        case 4: // Easy (سهل)
            repetitions += 1;
            if (repetitions === 1) {
                nextInterval = 4; // قفزة أولية للسهل
            } else {
                nextInterval = Math.round(interval * easeFactor * 1.3);
            }
            easeFactor += 0.15; // زيادة معامل السهولة
            break;
    }

    // منع معامل السهولة من أن ينخفض ليصبح أقل من الحد الأدنى
    if (easeFactor < MIN_EASE) {
        easeFactor = MIN_EASE;
    }

    // إذا كبرت مسافة المراجعة عن 21 يوم نفترض حفظ الكلمة "تخرجت"
    if (nextInterval > 21) {
        newStatus = 'mastered';
    }

    // تحديث سجل المراجعات
    const log = {
        date: Date.now(),
        rating,
        interval: nextInterval
    };

    // حساب موعد المراجعة القادم (تاريخ اليوم + الفاصل الزمني بالأيام)
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    return {
        ...progress,
        status: newStatus,
        interval: nextInterval,
        easeFactor,
        repetitions,
        nextReview: nextReviewDate.getTime(),
        history: [...(history || []), log]
    };
}

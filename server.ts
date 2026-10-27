import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Database file setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DB {
  users: any[];
  lessons: any[];
  keeps: any[];
  reflections: any[];
  reports: any[];
  neededReactions: any[];
}

const INITIAL_SEED_LESSONS = [
  {
    id: 'seed-1',
    userId: 'user-kyoto-71',
    text: 'زمان کمتری از آنچه می‌پندارید در اختیار دارید، و اختیاری بسیار بیش از آنچه گمان می‌برید.',
    context: 'آموخته‌شده پس از بازنشستگی از ۴۴ سال نجاری سنتی در کیوتو.',
    topics: ['Time', 'Life', 'Growth'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-04-12T10:00:00.000Z',
    createdAt: '2026-04-12T10:00:00.000Z',
    authorDisplayName: 'کنجی (Kenji)',
    authorAge: 71,
    authorCountry: 'ژاپن',
    authorCity: 'کیوتو',
    isAnonymous: false,
    neededCount: 8,
  },
  {
    id: 'seed-2',
    userId: 'user-lisbon-38',
    text: 'بخش بزرگی از عمرم را صرف تلاش برای فهمانده شدن به کسانی کردم که پیش‌تر تصمیمشان را درباره من گرفته بودند.',
    context: 'یک دهه تلاش بیهوده برای جلب رضایت و تأیید شرکای تجاری سابقم.',
    topics: ['Freedom', 'Friendship', 'Growth'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-05-18T14:20:00.000Z',
    createdAt: '2026-05-18T14:20:00.000Z',
    authorDisplayName: 'مارتا (Marta)',
    authorAge: 38,
    authorCountry: 'پرتغال',
    authorCity: 'لیسبون',
    isAnonymous: false,
    neededCount: 14,
  },
  {
    id: 'seed-3',
    userId: 'user-tehran-34',
    text: 'کسانی که تمام تلاشتان را برای تحت تأثیر قرار دادنشان می‌کنید، شاید حتی یک‌دهم آنچه تصور می‌کنید به شما فکر نمی‌کنند.',
    context: 'درک‌شده در گردهمایی فارغ‌التحصیلان دانشگاه پس از سال‌ها اضطراب خاموش.',
    topics: ['Growth', 'Life'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-06-01T08:15:00.000Z',
    createdAt: '2026-06-01T08:15:00.000Z',
    authorDisplayName: 'سارا',
    authorAge: 34,
    authorCountry: 'ایران',
    authorCity: 'تهران',
    isAnonymous: false,
    neededCount: 21,
  },
  {
    id: 'seed-4',
    userId: 'user-reyk-52',
    text: 'می‌توان کسی را از صمیم قلب دوست داشت و همچنان دانست که در کنار هم ماندن راه درستی نیست.',
    context: 'پس از شانزده سال زندگی مشترک که به فرسودگی خاموش بدل شده بود.',
    topics: ['Love', 'Loss', 'Courage'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-06-10T12:00:00.000Z',
    createdAt: '2026-06-10T12:00:00.000Z',
    authorDisplayName: 'اینار (Einar)',
    authorAge: 52,
    authorCountry: 'ایسلند',
    authorCity: 'ریکیاویک',
    isAnonymous: false,
    neededCount: 19,
  },
  {
    id: 'seed-5',
    userId: 'user-oaxaca-26',
    text: 'مشغول بودن همیشگی، بهانه‌ای فریبنده بود تا از تصمیم‌گیری درباره آنچه واقعاً از زندگی می‌خواهم طفره بروم.',
    context: 'هفتاد ساعت کار هفتگی در اوایل بیست‌سالگی صرفاً برای احساس داشتن هدف.',
    topics: ['Work', 'Time', 'Freedom'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-06-15T18:30:00.000Z',
    createdAt: '2026-06-15T18:30:00.000Z',
    authorDisplayName: 'متئو (Mateo)',
    authorAge: 26,
    authorCountry: 'مکزیک',
    authorCity: 'اوآخاکا',
    isAnonymous: false,
    neededCount: 11,
  },
  {
    id: 'seed-6',
    userId: 'user-chicago-45',
    text: 'پدر و مادرم پیش از آنکه والدین من باشند، انسان‌هایی با آرزوها و بیم‌های خود بودند. درک این نکته نگاهم را به آنان دگرگون کرد.',
    context: 'یافتن نامه‌های قدیمی مادرم در دهه بیست‌سالگی‌اش وقتی رؤیاهایش را به خاطر زندگی کنار گذاشت.',
    topics: ['Family', 'Growth', 'Life'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-06-22T09:45:00.000Z',
    createdAt: '2026-06-22T09:45:00.000Z',
    authorDisplayName: 'دیوید (David)',
    authorAge: 45,
    authorCountry: 'ایالات متحده',
    authorCity: 'شیکاگو',
    isAnonymous: false,
    neededCount: 32,
  },
  {
    id: 'seed-7',
    userId: 'user-nairobi-29',
    text: 'شکست هنگام رخ دادن هرگز شاعرانه نیست؛ تنها احساس سنگین شرم و استیصال دارد. شفافیت و حکمت سال‌ها بعد فرا می‌رسد.',
    context: 'هنگامی که نخستین پروژه نیروگاه خورشیدی‌ام پس از دو سال تمام پس‌انداز فروریخت.',
    topics: ['Failure', 'Growth', 'Courage'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-01T11:20:00.000Z',
    createdAt: '2026-07-01T11:20:00.000Z',
    authorDisplayName: 'وانجیرو (Wanjiru)',
    authorAge: 29,
    authorCountry: 'کنیا',
    authorCity: 'نایروبی',
    isAnonymous: false,
    neededCount: 16,
  },
  {
    id: 'seed-8',
    userId: 'user-oslo-64',
    text: 'پس از فقدان عزیزی نزدیک، بعدازظهرهای ساده و معمولی بسیار گرانبهاتر از بزرگ‌ترین برنامه‌ها و رؤیاها شدند.',
    context: 'پس از دست دادن برادر جوان‌ترم در زمستان ۲۰۲۲.',
    topics: ['Loss', 'Time', 'Life'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-04T16:10:00.000Z',
    createdAt: '2026-07-04T16:10:00.000Z',
    authorDisplayName: 'آسترید (Astrid)',
    authorAge: 64,
    authorCountry: 'نروژ',
    authorCity: 'اسلو',
    isAnonymous: false,
    neededCount: 27,
  },
  {
    id: 'seed-9',
    userId: 'user-buenosaires-31',
    text: 'استراحت پاداشی برای تمام کردن همه وظایف نیست. شما حق دارید پیش از ته کشیدن کامل توانتان، دست از کار بکشید.',
    context: 'فرسودگی شدید روحی و جسمی که در سال ۲۰۲۴ مرا راهی بیمارستان کرد.',
    topics: ['Work', 'Life', 'Growth'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-08T20:00:00.000Z',
    createdAt: '2026-07-08T20:00:00.000Z',
    authorDisplayName: 'ناشناس',
    authorAge: 31,
    authorCountry: 'آرژانتین',
    authorCity: 'بوئنوس آیرس',
    isAnonymous: true,
    neededCount: 42,
  },
  {
    id: 'seed-10',
    userId: 'user-seoul-22',
    text: 'عشق یعنی یافتن کسی که مشتاق است تو را در لحظاتی که در حال تظاهر و نقش بازی کردن نیستی، تماشا کند.',
    context: 'نخستین سال زندگی مستقل و چشیدن طعم روابط بی‌نقاب و زلال.',
    topics: ['Love', 'Friendship'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-12T13:40:00.000Z',
    createdAt: '2026-07-12T13:40:00.000Z',
    authorDisplayName: 'مین-جون (Min-Jun)',
    authorAge: 22,
    authorCountry: 'کره جنوبی',
    authorCity: 'سئول',
    isAnonymous: false,
    neededCount: 9,
  },
  {
    id: 'seed-11',
    userId: 'user-montreal-42',
    text: 'عشق صاعقه‌ای مهیب نیست که از آن جان به در ببری؛ تصمیمی زنده است که پیوسته در سه‌شنبه‌های معمولی تکرارش می‌کنی.',
    context: 'پانزده سال زندگی مشترک و کشف آرامش در همراهی‌های متین روزمره.',
    topics: ['Love', 'Family', 'Time'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-15T09:00:00.000Z',
    createdAt: '2026-07-15T09:00:00.000Z',
    authorDisplayName: 'کلر (Claire)',
    authorAge: 42,
    authorCountry: 'کانادا',
    authorCity: 'مونترال',
    isAnonymous: false,
    neededCount: 23,
  },
  {
    id: 'seed-12',
    userId: 'user-athens-76',
    text: 'دشوارترین بخش عشق یافتن فرد شایسته نیست؛ بلکه بدل شدن به انسانی است که توانایی دوست داشتن بدون احساس تملک را داشته باشد.',
    context: 'نگاه به پنجاه سال سکوت پرمهر و همراهی با همسر فقیدم.',
    topics: ['Love', 'Loss', 'Life'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-19T17:15:00.000Z',
    createdAt: '2026-07-19T17:15:00.000Z',
    authorDisplayName: 'نیکوس (Nikos)',
    authorAge: 76,
    authorCountry: 'یونان',
    authorCity: 'آتن',
    isAnonymous: false,
    neededCount: 38,
  },
  {
    id: 'seed-13',
    userId: 'user-berlin-36',
    text: 'یکی از دشوارترین مهارت‌های زندگی دانستن زمان رها کردن است؛ چرا که اصرار بر ماندن اغلب در نقاب وفاداری خود را جا می‌زند.',
    context: 'خروج از همکاری هنری مشترکی که دیگر هیچ روحی در کالبد هیچ‌کداممان باقی نمی‌گذاشت.',
    topics: ['Change', 'Courage', 'Freedom'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-24T14:30:00.000Z',
    createdAt: '2026-07-24T14:30:00.000Z',
    authorDisplayName: 'فلیکس (Felix)',
    authorAge: 36,
    authorCountry: 'آلمان',
    authorCity: 'برلین',
    isAnonymous: false,
    neededCount: 18,
  },
  {
    id: 'seed-14',
    userId: 'user-mumbai-58',
    text: 'هرگز ثروت مادی را با آرامش درون یکسان نگیرید. سی سال دویدم تا یکی را بیندوزم در حالی که دیگری آرام‌آرام از دستم می‌چکید.',
    context: 'فروش شرکت نساجی و کارخانه‌ام در ۵۵ سالگی.',
    topics: ['Money', 'Work', 'Regret'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-07-28T07:50:00.000Z',
    createdAt: '2026-07-28T07:50:00.000Z',
    authorDisplayName: 'راجش (Rajesh)',
    authorAge: 58,
    authorCountry: 'هند',
    authorCity: 'بمبئی',
    isAnonymous: false,
    neededCount: 25,
  },
  {
    id: 'seed-15',
    userId: 'user-istanbul-19',
    text: 'تقریباً همه اطرافیانتان در حال آزمون و خطا در میانه راه هستند. منتظر روزی نمانید که احساس کنید رسماً به یک انسان کامل تبدیل شده‌اید.',
    context: 'اولین ترم زندگی مستقل در خوابگاه دانشجویی استانبول.',
    topics: ['Growth', 'Courage', 'Life'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-08-01T15:10:00.000Z',
    createdAt: '2026-08-01T15:10:00.000Z',
    authorDisplayName: 'الیف (Elif)',
    authorAge: 19,
    authorCountry: 'ترکیه',
    authorCity: 'استانبول',
    isAnonymous: false,
    neededCount: 17,
  },
  {
    id: 'seed-16',
    userId: 'user-sydney-49',
    text: 'دوستی‌ها به ندرت در دعواها پایان می‌یابند؛ در تماس‌های بی‌پاسخی رنگ می‌بازند که همواره قصد داشتید فردا برقرار کنید.',
    context: 'درک اینکه سه سال است با صمیمی‌ترین دوست دوران کودکی‌ام هم‌کلام نشده‌ام.',
    topics: ['Friendship', 'Time', 'Regret'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-08-05T22:00:00.000Z',
    createdAt: '2026-08-05T22:00:00.000Z',
    authorDisplayName: 'لیام (Liam)',
    authorAge: 49,
    authorCountry: 'استرالیا',
    authorCity: 'سیدنی',
    isAnonymous: false,
    neededCount: 29,
  },
  {
    id: 'seed-17',
    userId: 'user-bogota-62',
    text: 'بخشش به ندرت برای طرف مقابل است؛ بخشش تصمیم به زمین گذاشتن بار خطای دیگری از روی سینه خودتان است.',
    context: 'آشتی با برادرم پس از بیست و دو سال سکوت و قهر.',
    topics: ['Family', 'Freedom', 'Growth'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-08-10T11:45:00.000Z',
    createdAt: '2026-08-10T11:45:00.000Z',
    authorDisplayName: 'کامیلا (Camila)',
    authorAge: 62,
    authorCountry: 'کلمبیا',
    authorCity: 'بوگوتا',
    isAnonymous: false,
    neededCount: 35,
  },
  {
    id: 'seed-18',
    userId: 'user-capetown-39',
    text: 'لازم نیست از هر چه مایه نشاط شماست پول بسازید. برخی چیزها تنها زمانی پاک و اصیل می‌مانند که بهایی برایشان تعیین نشود.',
    context: 'تبدیل علاقه سفالگری به فروشگاه و دو سال زمان برای به یاد آوردن اینکه چرا خاک رس را دوست داشتم.',
    topics: ['Work', 'Money', 'Freedom'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-08-14T08:30:00.000Z',
    createdAt: '2026-08-14T08:30:00.000Z',
    authorDisplayName: 'تابو (Thabo)',
    authorAge: 39,
    authorCountry: 'آفریقای جنوبی',
    authorCity: 'کیپ‌تاون',
    isAnonymous: false,
    neededCount: 22,
  },
  {
    id: 'seed-19',
    userId: 'user-dublin-83',
    text: 'در روزگار پیری، به ندرت از ریسک‌هایی که به سنگ خورد افسوس می‌خورید؛ تنها در حسرت درهایی می‌مانید که پیش رویتان گشوده بود و هرگز گامی به درون نگذاشتید.',
    context: 'اندیشیدن به گروه تئاتر کوچکی که در سال ۱۹۶۸ قصد راه‌اندازی‌اش را داشتیم و نکردیم.',
    topics: ['Courage', 'Regret', 'Time', 'Life'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-08-18T16:00:00.000Z',
    createdAt: '2026-08-18T16:00:00.000Z',
    authorDisplayName: 'پاتریک (Patrick)',
    authorAge: 83,
    authorCountry: 'ایرلند',
    authorCity: 'دوبلین',
    isAnonymous: false,
    neededCount: 48,
  },
  {
    id: 'seed-20',
    userId: 'user-singapore-27',
    text: 'مقایسه آشفتگی‌های پنهان درون خود با نماهای گلچین‌شده زندگی دیگران، شما را همواره در حسرت و عقب‌ماندگی نگه می‌دارد.',
    context: 'حذف شبکه‌های اجتماعی در دومین سال کارم در بانکداری بین‌المللی.',
    topics: ['Growth', 'Life', 'Change'],
    status: 'published',
    isCurrent: true,
    publishedAt: '2026-08-20T04:15:00.000Z',
    createdAt: '2026-08-20T04:15:00.000Z',
    authorDisplayName: 'ناشناس',
    authorAge: 27,
    authorCountry: 'سنگاپور',
    authorCity: 'سنگاپور',
    isAnonymous: true,
    neededCount: 31,
  },
  // --- HISTORICAL PREVIOUS (ARCHIVED) LESSONS ---
  {
    id: 'seed-prev-1',
    userId: 'user-lisbon-38',
    text: 'تأیید و تشویق دیگران تنها معیار سنجش ارزش واقعی کاری است که انجام می‌دهی.',
    context: 'در اوایل دوران تأسیس شرکت تبلیغاتی‌ام در لیسبون در دهه بیست‌سالگی.',
    topics: ['Work', 'Freedom', 'Growth'],
    status: 'published',
    isCurrent: false,
    publishedAt: '2016-04-10T10:00:00.000Z',
    archivedAt: '2026-05-18T14:20:00.000Z',
    createdAt: '2016-04-10T10:00:00.000Z',
    authorDisplayName: 'مارتا (Marta)',
    authorAge: 28,
    authorCountry: 'پرتغال',
    authorCity: 'لیسبون',
    isAnonymous: false,
    neededCount: 5,
  },
  {
    id: 'seed-prev-2',
    userId: 'user-kyoto-71',
    text: 'سرعت و بهره‌وری، کلید اصلی ساختن آثاری است که در یادها می‌مانند.',
    context: 'در بیست و پنجمین سال فعالیت کارگاه نجاری در کیوتو، پیش از درک اهمیت سکون و ریتم چوب.',
    topics: ['Work', 'Time', 'Life'],
    status: 'published',
    isCurrent: false,
    publishedAt: '2007-09-15T08:00:00.000Z',
    archivedAt: '2026-04-12T10:00:00.000Z',
    createdAt: '2007-09-15T08:00:00.000Z',
    authorDisplayName: 'کنجی (Kenji)',
    authorAge: 52,
    authorCountry: 'ژاپن',
    authorCity: 'کیوتو',
    isAnonymous: false,
    neededCount: 8,
  },
  {
    id: 'seed-prev-3',
    userId: 'user-tehran-34',
    text: 'اگر همیشه به کمال بی‌نقص نرسی، احترام و جایگاهت را در میان اطرافیان از دست خواهی داد.',
    context: 'در سال‌های اولیه ورود به دانشگاه و اضطراب مداوم از قضاوت دیگران.',
    topics: ['Growth', 'Life'],
    status: 'published',
    isCurrent: false,
    publishedAt: '2016-05-20T12:00:00.000Z',
    archivedAt: '2026-06-01T08:15:00.000Z',
    createdAt: '2016-05-20T12:00:00.000Z',
    authorDisplayName: 'سارا',
    authorAge: 24,
    authorCountry: 'ایران',
    authorCity: 'تهران',
    isAnonymous: false,
    neededCount: 12,
  },
  {
    id: 'seed-prev-4',
    userId: 'user-chicago-45',
    text: 'پدر و مادرها باید همیشه راهنما و تکیه‌گاه بدون نقص باشند و هر خطایی از آن‌ها غیرقابل بخشش است.',
    context: 'پیش از به دنیا آمدن فرزند خودم و لمس سنگینی بار والدگری.',
    topics: ['Family', 'Growth'],
    status: 'published',
    isCurrent: false,
    publishedAt: '2011-03-14T11:00:00.000Z',
    archivedAt: '2026-06-22T09:45:00.000Z',
    createdAt: '2011-03-14T11:00:00.000Z',
    authorDisplayName: 'دیوید (David)',
    authorAge: 30,
    authorCountry: 'ایالات متحده',
    authorCity: 'شیکاگو',
    isAnonymous: false,
    neededCount: 9,
  },
  {
    id: 'seed-prev-5',
    userId: 'user-reyk-52',
    text: 'سکوت و تحمل به هر قیمتی، بالاترین نشانه وفاداری و فداکاری در یک رابطه است.',
    context: 'در اوایل دهه نخست ازدواج با همسرم.',
    topics: ['Love', 'Courage'],
    status: 'published',
    isCurrent: false,
    publishedAt: '2010-08-01T09:30:00.000Z',
    archivedAt: '2026-06-10T12:00:00.000Z',
    createdAt: '2010-08-01T09:30:00.000Z',
    authorDisplayName: 'اینار (Einar)',
    authorAge: 36,
    authorCountry: 'ایسلند',
    authorCity: 'ریکیاویک',
    isAnonymous: false,
    neededCount: 14,
  },
  {
    id: 'seed-prev-6',
    userId: 'user-oslo-64',
    text: 'تمام ارزش روزهای زندگی در اهداف بزرگ و نقشه‌های بلندمدتی است که برای آینده ترسیم می‌کنی.',
    context: 'در میانسالی پیش از درگذشت ناگهانی برادر عزیزم.',
    topics: ['Time', 'Life', 'Loss'],
    status: 'published',
    isCurrent: false,
    publishedAt: '2010-11-12T14:00:00.000Z',
    archivedAt: '2026-07-04T16:10:00.000Z',
    createdAt: '2010-11-12T14:00:00.000Z',
    authorDisplayName: 'آسترید (Astrid)',
    authorAge: 48,
    authorCountry: 'نروژ',
    authorCity: 'اسلو',
    isAnonymous: false,
    neededCount: 11,
  },
  {
    id: 'seed-prev-7',
    userId: 'user-athens-76',
    text: 'عشق یعنی یافتن کسی که بتوانی تا ابد او را در انحصار و قلمرو امن خود نگه داری.',
    context: 'سال‌های اولیه ازدواج در آتن در دوران جوانی.',
    topics: ['Love', 'Life'],
    status: 'published',
    isCurrent: false,
    publishedAt: '1988-06-10T12:00:00.000Z',
    archivedAt: '2026-07-19T17:15:00.000Z',
    createdAt: '1988-06-10T12:00:00.000Z',
    authorDisplayName: 'نیکوس (Nikos)',
    authorAge: 38,
    authorCountry: 'یونان',
    authorCity: 'آتن',
    isAnonymous: false,
    neededCount: 20,
  }
];

function loadDB(): DB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed.lessons && parsed.lessons.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading database file, resetting to initial seed:', err);
  }

  const initialDB: DB = {
    users: [
      {
        id: 'admin-user',
        email: 'admin@onefromalife.com',
        displayName: 'Archive Guardian',
        anonymousMode: false,
        age: 40,
        country: 'Global',
        createdAt: new Date().toISOString(),
        isAdmin: true,
      }
    ],
    lessons: INITIAL_SEED_LESSONS,
    keeps: [],
    reflections: [],
    reports: [],
    neededReactions: [],
  };

  saveDB(initialDB);
  return initialDB;
}

function saveDB(db: DB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

// In-memory reference that gets synced
let db = loadDB();

// Simple Auth Token Middleware
interface AuthRequest extends Request {
  user?: any;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const user = db.users.find(u => u.id === token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  req.user = user;
  next();
}

function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = db.users.find(u => u.id === token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

// Helper to calculate Keep & Needed quotas
function getUserQuotas(userId: string) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Keeps created this month
  const keepsThisMonth = db.keeps.filter(k => {
    if (k.userId !== userId) return false;
    const d = new Date(k.createdAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  // Needed reactions created in last 7 days
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const neededThisWeek = db.neededReactions.filter(n => {
    return n.userId === userId && new Date(n.createdAt) >= oneWeekAgo;
  });

  return {
    keepsUsedThisMonth: keepsThisMonth.length,
    maxKeepsPerMonth: 3, // Configurable limit (Section 21)
    neededUsedThisWeek: neededThisWeek.length,
    maxNeededPerWeek: 1, // Configurable limit (Section 24)
  };
}

// --- AUTH ROUTES ---

app.post('/api/auth/signup', (req, res) => {
  const { email, password, displayName, age, country, city, anonymousMode } = req.body;

  if (!email || !displayName || !age || !country) {
    return res.status(400).json({ error: 'Please provide all required fields: email, display name, age, and country.' });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    email: email.trim().toLowerCase(),
    password: password || 'default-pass',
    displayName: displayName.trim(),
    anonymousMode: Boolean(anonymousMode),
    age: Number(age) || 25,
    country: country.trim(),
    city: city ? city.trim() : undefined,
    createdAt: new Date().toISOString(),
    isAdmin: email.toLowerCase().includes('admin'),
  };

  db.users.push(newUser);
  saveDB(db);

  const quota = getUserQuotas(newUser.id);
  res.json({
    user: newUser,
    token: newUser.id,
    currentLesson: null,
    quota,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  // Demo auto-account creation for frictionless exploration if requested
  if (!user) {
    user = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      email: email.trim().toLowerCase(),
      displayName: email.split('@')[0] || 'Seeker',
      anonymousMode: false,
      age: 32,
      country: 'Global',
      createdAt: new Date().toISOString(),
      isAdmin: email.toLowerCase().includes('admin'),
    };
    db.users.push(user);
    saveDB(db);
  }

  const currentLesson = db.lessons.find(l => l.userId === user.id && l.isCurrent && l.status === 'published') || null;
  const quota = getUserQuotas(user.id);

  res.json({
    user,
    token: user.id,
    currentLesson,
    quota,
  });
});

app.get('/api/auth/me', optionalAuthMiddleware, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.json({ user: null, token: null, currentLesson: null, quota: null });
  }

  const currentLesson = db.lessons.find(l => l.userId === req.user.id && l.isCurrent && l.status === 'published') || null;
  const quota = getUserQuotas(req.user.id);

  res.json({
    user: req.user,
    token: req.user.id,
    currentLesson,
    quota,
  });
});

app.post('/api/auth/update-profile', authMiddleware, (req: AuthRequest, res) => {
  const { displayName, anonymousMode, age, country, city } = req.body;
  const user = req.user;

  if (displayName !== undefined) user.displayName = displayName.trim();
  if (anonymousMode !== undefined) user.anonymousMode = Boolean(anonymousMode);
  if (age !== undefined) user.age = Number(age);
  if (country !== undefined) user.country = country.trim();
  if (city !== undefined) user.city = city.trim();

  // If user has a current lesson, update their author presentation if not anonymous
  const currentLesson = db.lessons.find(l => l.userId === user.id && l.isCurrent);
  if (currentLesson) {
    currentLesson.authorDisplayName = user.displayName;
    currentLesson.authorAge = user.age;
    currentLesson.authorCountry = user.country;
    currentLesson.authorCity = user.city;
    currentLesson.isAnonymous = user.anonymousMode;
  }

  saveDB(db);
  res.json({ user, currentLesson });
});

// --- LESSON ROUTES ---

// GET /api/lessons/one - Curated single lesson mode (Digital exhibition)
app.get('/api/lessons/one', optionalAuthMiddleware, (req: AuthRequest, res) => {
  const excludeId = req.query.exclude as string;
  const currentUserId = req.user?.id;

  let candidates = db.lessons.filter(l => l.isCurrent && l.status === 'published');
  
  if (currentUserId) {
    // Avoid showing the user's own lesson
    candidates = candidates.filter(l => l.userId !== currentUserId);
  }

  if (excludeId) {
    const withoutExclude = candidates.filter(l => l.id !== excludeId);
    if (withoutExclude.length > 0) {
      candidates = withoutExclude;
    }
  }

  if (candidates.length === 0) {
    return res.status(404).json({ error: 'No lessons available at this moment' });
  }

  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  
  // Format for public display
  const isKept = req.user ? db.keeps.some(k => k.userId === req.user.id && k.lessonId === selected.id) : false;
  const userReflection = req.user ? db.reflections.find(r => r.userId === req.user.id && r.lessonId === selected.id) : null;

  res.json({
    lesson: selected,
    isKept,
    userReflection: userReflection ? userReflection.text : null,
  });
});

// GET /api/lessons/wander - Finite discovery mode (Max 7 lessons for session limit)
app.get('/api/lessons/wander', optionalAuthMiddleware, (req: AuthRequest, res) => {
  const currentUserId = req.user?.id;
  let candidates = db.lessons.filter(l => l.isCurrent && l.status === 'published');

  if (currentUserId) {
    candidates = candidates.filter(l => l.userId !== currentUserId);
  }

  // Shuffle for healthy unpredictable diversity across ages and regions
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  // Finite batch limit: strictly max 7 per session (Section 29)
  const batch = shuffled.slice(0, 7);

  const keptIds = new Set(req.user ? db.keeps.filter(k => k.userId === req.user.id).map(k => k.lessonId) : []);
  const reflectionsMap = new Map(req.user ? db.reflections.filter(r => r.userId === req.user.id).map(r => [r.lessonId, r.text]) : []);

  const lessons = batch.map(l => ({
    ...l,
    isKept: keptIds.has(l.id),
    userReflection: reflectionsMap.get(l.id) || null,
  }));

  res.json({
    lessons,
    totalAvailable: candidates.length,
    sessionLimit: 7,
  });
});

// GET /api/lessons/explore - Structured discovery (Topic, Age, Place)
app.get('/api/lessons/explore', optionalAuthMiddleware, (req: AuthRequest, res) => {
  const { topic, ageGroup, country, city, search } = req.query;
  const currentUserId = req.user?.id;

  let results = db.lessons.filter(l => l.isCurrent && l.status === 'published');

  if (topic && typeof topic === 'string' && topic !== 'All') {
    results = results.filter(l => l.topics && l.topics.includes(topic as any));
  }

  if (ageGroup && typeof ageGroup === 'string' && ageGroup !== 'All') {
    results = results.filter(l => {
      const age = l.authorAge;
      if (ageGroup === 'Under 20') return age < 20;
      if (ageGroup === '20–29') return age >= 20 && age <= 29;
      if (ageGroup === '30–39') return age >= 30 && age <= 39;
      if (ageGroup === '40–49') return age >= 40 && age <= 49;
      if (ageGroup === '50–59') return age >= 50 && age <= 59;
      if (ageGroup === '60+') return age >= 60;
      return true;
    });
  }

  if (country && typeof country === 'string' && country !== 'All') {
    results = results.filter(l => l.authorCountry.toLowerCase() === country.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter(l => l.text.toLowerCase().includes(q) || (l.context && l.context.toLowerCase().includes(q)));
  }

  const keptIds = new Set(req.user ? db.keeps.filter(k => k.userId === req.user.id).map(k => k.lessonId) : []);
  const reflectionsMap = new Map(req.user ? db.reflections.filter(r => r.userId === req.user.id).map(r => [r.lessonId, r.text]) : []);

  // Return finite batch
  const formatted = results.slice(0, 14).map(l => ({
    ...l,
    isKept: keptIds.has(l.id),
    userReflection: reflectionsMap.get(l.id) || null,
  }));

  // Unique lists for filter options
  const allCurrent = db.lessons.filter(l => l.isCurrent && l.status === 'published');
  const availableCountries = Array.from(new Set(allCurrent.map(l => l.authorCountry))).sort();

  res.json({
    lessons: formatted,
    totalMatches: results.length,
    availableCountries,
  });
});

// GET /api/lessons/curated-collections - Signature discovery collections
app.get('/api/lessons/curated-collections', (req, res) => {
  // 1. Across Generations: Love across 22, 42, 76
  const loveYouth = db.lessons.find(l => l.id === 'seed-10');
  const loveMid = db.lessons.find(l => l.id === 'seed-11');
  const loveElder = db.lessons.find(l => l.id === 'seed-12');

  const acrossGenerations = {
    theme: 'Love',
    title: 'Across Generations on Love',
    lessons: [
      { ageRange: '22 · Seoul', lesson: loveYouth },
      { ageRange: '42 · Montreal', lesson: loveMid },
      { ageRange: '76 · Athens', lesson: loveElder },
    ].filter(i => Boolean(i.lesson)),
  };

  // 2. Two Lives, Two Lessons: Persistence vs Letting Go
  const lessonA = db.lessons.find(l => l.id === 'seed-19'); // Risking & pushing doors
  const lessonB = db.lessons.find(l => l.id === 'seed-13'); // Knowing when to let go

  const twoLives = {
    theme: 'Persistence & Letting Go',
    lessonA,
    lessonB,
  };

  // 3. People You'd Never Meet
  const farLessons = db.lessons
    .filter(l => l.isCurrent && l.status === 'published')
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  res.json({
    acrossGenerations,
    twoLives,
    peopleYoudNeverMeet: farLessons,
  });
});

// GET /api/lessons/previous - Archive of past wisdom and personal evolution
app.get('/api/lessons/previous', optionalAuthMiddleware, (req: AuthRequest, res) => {
  const { topic, ageGroup, search, userId } = req.query;

  // Filter lessons that are archived (isCurrent === false) and published
  let archivedList = db.lessons.filter(l => !l.isCurrent && l.status === 'published');

  if (userId && typeof userId === 'string') {
    archivedList = archivedList.filter(l => l.userId === userId);
  }

  if (topic && typeof topic === 'string' && topic !== 'All') {
    archivedList = archivedList.filter(l => l.topics && l.topics.includes(topic as any));
  }

  if (ageGroup && typeof ageGroup === 'string' && ageGroup !== 'All') {
    archivedList = archivedList.filter(l => {
      const age = l.authorAge;
      if (ageGroup === 'Under 20') return age < 20;
      if (ageGroup === '20–29') return age >= 20 && age <= 29;
      if (ageGroup === '30–39') return age >= 30 && age <= 39;
      if (ageGroup === '40–49') return age >= 40 && age <= 49;
      if (ageGroup === '50–59') return age >= 50 && age <= 59;
      if (ageGroup === '60+') return age >= 60;
      return true;
    });
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    archivedList = archivedList.filter(l =>
      l.text.toLowerCase().includes(q) ||
      (l.context && l.context.toLowerCase().includes(q)) ||
      l.authorDisplayName.toLowerCase().includes(q)
    );
  }

  // Sort by archived date or published date descending
  archivedList.sort((a, b) => new Date(b.archivedAt || b.publishedAt).getTime() - new Date(a.archivedAt || a.publishedAt).getTime());

  const keptIds = new Set(req.user ? db.keeps.filter(k => k.userId === req.user.id).map(k => k.lessonId) : []);
  const reflectionsMap = new Map(req.user ? db.reflections.filter(r => r.userId === req.user.id).map(r => [r.lessonId, r.text]) : []);

  // Enrich with evolution pair (matching current lesson of the same author)
  const items = archivedList.map(archivedLesson => {
    const currentLessonOfAuthor = db.lessons.find(l => l.userId === archivedLesson.userId && l.isCurrent && l.status === 'published') || null;
    return {
      ...archivedLesson,
      isKept: keptIds.has(archivedLesson.id),
      userReflection: reflectionsMap.get(archivedLesson.id) || null,
      currentEvolution: currentLessonOfAuthor,
    };
  });

  res.json({
    previousLessons: items,
    totalArchived: archivedList.length,
  });
});

// GET /api/lessons/:id - Single lesson detail
app.get('/api/lessons/:id', optionalAuthMiddleware, (req: AuthRequest, res) => {
  const lesson = db.lessons.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const isKept = req.user ? db.keeps.some(k => k.userId === req.user.id && k.lessonId === lesson.id) : false;
  const userReflection = req.user ? db.reflections.find(r => r.userId === req.user.id && r.lessonId === lesson.id) : null;

  // Find author's other/previous lessons if any
  const otherLessons = db.lessons
    .filter(l => l.userId === lesson.userId && l.id !== lesson.id && l.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  res.json({
    lesson,
    isKept,
    userReflection: userReflection ? userReflection.text : null,
    authorEvolution: otherLessons,
  });
});

// POST /api/lessons - Publish / Replace Lesson
// STRICT SERVER-SIDE INVARIANT RULES:
// 1. One current public lesson per user.
// 2. Published lessons cannot be edited or deleted.
// 3. Submitting automatically archives previous current lesson to private journey.
app.post('/api/lessons', authMiddleware, (req: AuthRequest, res) => {
  const { text, context, topics } = req.body;
  const user = req.user;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Please write what life taught you.' });
  }

  if (text.length > 700) {
    return res.status(400).json({ error: 'Please distill your lesson to within 700 characters.' });
  }

  const now = new Date().toISOString();

  // Archive any existing current lesson
  const existingCurrent = db.lessons.find(l => l.userId === user.id && l.isCurrent);
  if (existingCurrent) {
    existingCurrent.isCurrent = false;
    existingCurrent.archivedAt = now;
  }

  const newLesson = {
    id: 'lsn_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    userId: user.id,
    text: text.trim(),
    context: context && typeof context === 'string' ? context.trim() : undefined,
    topics: Array.isArray(topics) && topics.length > 0 ? topics : ['Life'],
    status: 'published',
    isCurrent: true,
    publishedAt: now,
    createdAt: now,
    authorDisplayName: user.displayName,
    authorAge: user.age,
    authorCountry: user.country,
    authorCity: user.city,
    isAnonymous: Boolean(user.anonymousMode),
    neededCount: 0,
  };

  db.lessons.unshift(newLesson);
  saveDB(db);

  res.status(201).json({
    lesson: newLesson,
    replacedPrevious: Boolean(existingCurrent),
  });
});

// --- JOURNEY (PRIVATE ARCHIVE) ROUTES ---

// GET /api/user/journey - Authenticated user's private history
app.get('/api/user/journey', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user;
  const userLessons = db.lessons
    .filter(l => l.userId === user.id)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const current = userLessons.find(l => l.isCurrent) || null;
  const archived = userLessons.filter(l => !l.isCurrent);

  res.json({
    current,
    archived,
  });
});

// --- KEEPS ("Things I Kept") ROUTES ---

// GET /api/user/keeps - Retrieve user's kept lessons
app.get('/api/user/keeps', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user;
  const userKeeps = db.keeps
    .filter(k => k.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const populated = userKeeps.map(k => {
    const lesson = db.lessons.find(l => l.id === k.lessonId);
    return {
      ...k,
      lesson,
    };
  }).filter(k => Boolean(k.lesson));

  const quota = getUserQuotas(user.id);

  res.json({
    keeps: populated,
    quota,
  });
});

// POST /api/user/keeps - Toggle Keep (Carry this one with you)
// Server-enforced quota: Max 3 per month
app.post('/api/user/keeps', authMiddleware, (req: AuthRequest, res) => {
  const { lessonId } = req.body;
  const user = req.user;

  if (!lessonId) {
    return res.status(400).json({ error: 'Lesson ID is required' });
  }

  const lesson = db.lessons.find(l => l.id === lessonId);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const existingIndex = db.keeps.findIndex(k => k.userId === user.id && k.lessonId === lessonId);

  if (existingIndex >= 0) {
    // Undo Keep (allowed without penalty)
    db.keeps.splice(existingIndex, 1);
    saveDB(db);
    const quota = getUserQuotas(user.id);
    return res.json({ kept: false, quota });
  }

  // Check quota
  const quota = getUserQuotas(user.id);
  if (quota.keepsUsedThisMonth >= quota.maxKeepsPerMonth) {
    return res.status(400).json({
      error: `You have reached your limit of ${quota.maxKeepsPerMonth} Keeps for this month. Carry each choice with care.`,
      quota,
    });
  }

  const newKeep = {
    id: 'kp_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    userId: user.id,
    lessonId,
    createdAt: new Date().toISOString(),
  };

  db.keeps.push(newKeep);
  saveDB(db);

  const updatedQuota = getUserQuotas(user.id);
  res.json({ kept: true, keep: newKeep, quota: updatedQuota });
});

// --- REFLECTION ROUTES ---

// GET /api/user/reflections - Private personal reflections
app.get('/api/user/reflections', authMiddleware, (req: AuthRequest, res) => {
  const user = req.user;
  const userReflections = db.reflections
    .filter(r => r.userId === user.id)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

  const populated = userReflections.map(r => {
    const lesson = db.lessons.find(l => l.id === r.lessonId);
    return {
      ...r,
      lesson,
    };
  });

  res.json({ reflections: populated });
});

// POST /api/user/reflections - Save / Update private reflection
app.post('/api/user/reflections', authMiddleware, (req: AuthRequest, res) => {
  const { lessonId, text } = req.body;
  const user = req.user;

  if (!lessonId) {
    return res.status(400).json({ error: 'Lesson ID is required' });
  }

  const lesson = db.lessons.find(l => l.id === lessonId);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const trimmed = (text || '').trim();
  const existing = db.reflections.find(r => r.userId === user.id && r.lessonId === lessonId);

  if (!trimmed && existing) {
    // Delete reflection if emptied
    db.reflections = db.reflections.filter(r => r.id !== existing.id);
    saveDB(db);
    return res.json({ reflection: null });
  }

  if (existing) {
    existing.text = trimmed;
    existing.updatedAt = new Date().toISOString();
    saveDB(db);
    return res.json({ reflection: existing });
  }

  const newReflection = {
    id: 'ref_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    userId: user.id,
    lessonId,
    text: trimmed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.reflections.push(newReflection);
  saveDB(db);

  res.json({ reflection: newReflection });
});

// --- "I NEEDED THIS" REACTION ROUTE ---
app.post('/api/lessons/:id/needed', authMiddleware, (req: AuthRequest, res) => {
  const lessonId = req.params.id;
  const user = req.user;

  const lesson = db.lessons.find(l => l.id === lessonId);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const quota = getUserQuotas(user.id);
  if (quota.neededUsedThisWeek >= quota.maxNeededPerWeek) {
    return res.status(400).json({
      error: 'You have already offered "I needed this" this week. Carry the sentiment quietly.',
    });
  }

  const reaction = {
    id: 'nd_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    userId: user.id,
    lessonId,
    createdAt: new Date().toISOString(),
  };

  db.neededReactions.push(reaction);
  lesson.neededCount = (lesson.neededCount || 0) + 1;
  saveDB(db);

  res.json({ success: true, neededCount: lesson.neededCount });
});

// --- REPORTING & MODERATION ---
app.post('/api/reports', authMiddleware, (req: AuthRequest, res) => {
  const { lessonId, reason, details } = req.body;
  const user = req.user;

  if (!lessonId || !reason) {
    return res.status(400).json({ error: 'Please specify the lesson and reason for report.' });
  }

  const newReport = {
    id: 'rep_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    reporterId: user.id,
    lessonId,
    reason: reason.trim(),
    details: details ? details.trim() : undefined,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  db.reports.unshift(newReport);
  saveDB(db);

  res.json({ success: true, message: 'Thank you. Our archive guardians will review this with care.' });
});

// Admin Queue
app.get('/api/admin/moderation', authMiddleware, (req: AuthRequest, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Archive guardian access required.' });
  }

  const pendingReports = db.reports.map(r => {
    const lesson = db.lessons.find(l => l.id === r.lessonId);
    return { ...r, lesson };
  });

  res.json({ reports: pendingReports });
});

app.post('/api/admin/moderation/action', authMiddleware, (req: AuthRequest, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Archive guardian access required.' });
  }

  const { reportId, action, lessonId } = req.body;

  if (lessonId && action === 'hide') {
    const lesson = db.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.status = 'hidden';
    }
  }

  if (lessonId && action === 'restore') {
    const lesson = db.lessons.find(l => l.id === lessonId);
    if (lesson) {
      lesson.status = 'published';
    }
  }

  if (reportId) {
    const report = db.reports.find(r => r.id === reportId);
    if (report) {
      report.status = action === 'dismiss' ? 'dismissed' : 'resolved';
    }
  }

  saveDB(db);
  res.json({ success: true });
});

// --- VITE / STATIC INTEGRATION ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`One From a Life server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

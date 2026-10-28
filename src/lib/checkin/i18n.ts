import type { Lang, MealId, ModeId } from "./config";

type L = Record<Lang, string>;
const t = (en: string, ru: string): L => ({ en, ru });

export const UI = {
  name: t("Your name", "Ваше имя"),
  namePh: t("First and last name", "Имя и фамилия"),
  party: t("How many are with you?", "Сколько вас всего?"),
  partyHint: t("Including you", "Считая вас"),
  phone: t("Phone number", "Номер телефона"),
  phonePh: t("(828) 555-0123", "(828) 555-0123"),
  overnight: t("Staying overnight Friday?", "Остаётесь ночевать в пятницу?"),
  yes: t("Yes", "Да"),
  no: t("No", "Нет"),
  meals: t("Which meals will you join?", "На каких приёмах пищи будете?"),
  allMeals: t("All meals", "Все"),
  checkIn: t("Check in", "Зарегистрироваться"),
  updateBtn: t("Update my check-in", "Обновить данные"),
  sending: t("Checking in…", "Отправляем…"),
  welcome: t("Welcome!", "Добро пожаловать!"),
  welcomeSub: t("You're checked in", "Вы зарегистрированы"),
  saved: t("Saved offline. We will send it when the Wi-Fi is back.", "Сохранено на планшете. Отправим, как только появится Wi-Fi."),
  people: t("people", "чел."),
  newCheckin: t("New check-in", "Следующий гость"),
  resetIn: t("Next guest in", "Следующий гость через"),
  already: t("You're already checked in", "Вы уже зарегистрированы"),
  alreadySub: t("Want to change your group size or meals?", "Хотите изменить число гостей или питание?"),
  updateYes: t("Update my details", "Изменить данные"),
  updateNo: t("No, I'm done", "Нет, всё верно"),
  updated: t("Updated!", "Обновлено!"),
  offline: t("No Wi-Fi. Check-ins are saved on this iPad and will be sent automatically.", "Нет Wi-Fi. Регистрации сохраняются на планшете и отправятся автоматически."),
  pending: t("waiting to send", "ждут отправки"),
  schedule: t("Schedule", "Программа"),
  close: t("Close", "Закрыть"),
  missingName: t("Add your name", "Укажите имя"),
  missingPhone: t("Add a 10-digit phone number", "Укажите номер из 10 цифр"),
  missingOvernight: t("Choose yes or no for overnight", "Выберите: ночуете или нет"),
  badPhone: t("Check the phone number", "Проверьте номер телефона"),
  error: t("Something went wrong. Please try again.", "Что-то пошло не так. Попробуйте ещё раз."),
  of: t("of", "из"),
  night: t("Staying overnight", "Остаётся на ночь"),
  noMeals: t("No meals", "Без питания"),
  ifEvening: t("(if staying for the evening session)", "(если остаётесь на вечернее служение)"),
} satisfies Record<string, L>;

export const MEAL_LABEL: Record<MealId, L & { icon: string }> = {
  friLunch: { ...t("Friday lunch", "Обед в пятницу"), icon: "🥪" },
  friDinner: { ...t("Friday dinner", "Ужин в пятницу"), icon: "🍲" },
  satBreakfast: { ...t("Saturday breakfast", "Завтрак в субботу"), icon: "🥞" },
  satLunch: { ...t("Saturday lunch", "Обед в субботу"), icon: "🥪" },
  satDinner: { ...t("Saturday dinner", "Ужин в субботу"), icon: "🍲" },
};

export const MODE_TITLE: Record<ModeId, L> = {
  "fri-am": t("Friday morning", "Пятница, утро"),
  "fri-pm": t("Friday evening", "Пятница, вечер"),
  "sat-am": t("Saturday morning", "Суббота, утро"),
  "sat-pm": t("Saturday evening", "Суббота, вечер"),
};

// ---------- schedule (from the camp poster) ----------
export type ScheduleRow = { time?: string; icon: string; title: L; note?: L };
export type ScheduleDay = { title: L; rows: ScheduleRow[] };

export const SCHEDULE: ScheduleDay[] = [
  {
    title: t("Day 1 · Friday", "День 1 · Пятница"),
    rows: [
      { time: "10:00", icon: "☕", title: t("Opening", "Открытие"), note: t("Coffee and cookies, announcements for the day", "Кофе и печенье, объявления на день") },
      { time: "10:20–11:10", icon: "🙏", title: t("Prayer and worship", "Молитва и прославление") },
      { time: "10:20–11:10", icon: "📖", title: t("Seminar", "Семинар") },
      { time: "11:10–11:30", icon: "💬", title: t("Q&A", "Вопросы и ответы"), note: t("20 minutes", "20 минут") },
      { icon: "☕", title: t("Break", "Перерыв") },
      { time: "12:00", icon: "🍴", title: t("Lunch", "Обед") },
      { icon: "⚽", title: t("Games and activities", "Игры и занятия") },
      { icon: "🕒", title: t("Free time", "Свободное время") },
      { time: "3:00–3:40", icon: "📖", title: t("Seminar", "Семинар") },
      { time: "3:40–4:10", icon: "💬", title: t("Q&A", "Вопросы и ответы"), note: t("about 30 minutes", "около 30 минут") },
      { icon: "🕒", title: t("Free time", "Свободное время") },
      { time: "6:00", icon: "🍴", title: t("Dinner", "Ужин") },
      {
        time: "8:00",
        icon: "🎵",
        title: t("Worship and sermon", "Прославление и проповедь"),
        note: t("“Why I serve and why He serves?” · “Why I am the church and why will He come?”", "«Почему я служу и почему служит Он?» · «Почему я Церковь и почему Он придёт?»"),
      },
      { time: "11:00", icon: "🌙", title: t("Sleep", "Отбой") },
    ],
  },
  {
    title: t("Day 2 · Saturday", "День 2 · Суббота"),
    rows: [
      { time: "8:00–9:00", icon: "🍴", title: t("Breakfast", "Завтрак") },
      { time: "9:00", icon: "🙏", title: t("Worship and prayer", "Прославление и молитва") },
      { time: "9:20–10:00", icon: "📖", title: t("Seminar", "Семинар") },
      { time: "10:00–10:30", icon: "💬", title: t("Q&A", "Вопросы и ответы") },
      { icon: "🕒", title: t("Free time", "Свободное время") },
      { time: "12:00", icon: "🍴", title: t("Lunch", "Обед") },
      { icon: "🕒", title: t("Free time", "Свободное время") },
      { icon: "🎮", title: t("Game for everybody", "Игра для всех") },
      { time: "4:00–4:45", icon: "📖", title: t("Seminar", "Семинар") },
      { time: "4:45–5:15", icon: "💬", title: t("Q&A", "Вопросы и ответы"), note: t("20–30 minutes", "20–30 минут") },
      { time: "6:00", icon: "🍴", title: t("Dinner", "Ужин") },
      { icon: "🕒", title: t("Free time", "Свободное время") },
      {
        time: "7:00",
        icon: "🎵",
        title: t("Worship, prayer and sermon", "Прославление, молитва и проповедь"),
        note: t("“He did and I will do”: obedience to the Father in all areas of life", "«Он сделал, и я сделаю»: послушание Отцу во всех сферах жизни"),
      },
      { time: "11:00", icon: "🌙", title: t("Sleep", "Отбой") },
    ],
  },
];

// ---------- staff screen ----------
export const STAFF = {
  title: t("Check-in staff", "Регистрация: персонал"),
  pin: t("Staff PIN or admin password", "ПИН персонала или пароль администратора"),
  signIn: t("Sign in", "Войти"),
  wrong: t("Wrong PIN", "Неверный ПИН"),
  tooMany: t("Too many tries. Wait a few minutes.", "Слишком много попыток. Подождите несколько минут."),
  mode: t("Active mode", "Текущий режим"),
  parties: t("Parties", "Групп"),
  people: t("People", "Человек"),
  overnight: t("Overnight", "С ночёвкой"),
  mealsTitle: t("Meal head counts", "Питание, число человек"),
  search: t("Search name or phone", "Поиск по имени или телефону"),
  copyPhones: t("Copy all phone numbers", "Скопировать все номера"),
  copied: t("Copied", "Скопировано"),
  csv: t("Download CSV", "Скачать CSV"),
  wipe: t("Delete all data", "Удалить все данные"),
  wipeAsk: t("Delete every check-in? This cannot be undone.", "Удалить все регистрации? Это нельзя отменить."),
  wipeType: t("Type DELETE to confirm", "Введите DELETE для подтверждения"),
  edit: t("Edit", "Изменить"),
  del: t("Delete", "Удалить"),
  save: t("Save", "Сохранить"),
  cancel: t("Cancel", "Отмена"),
  undo: t("Undo", "Отменить"),
  deleted: t("Deleted", "Удалено"),
  edited: t("Saved", "Сохранено"),
  signOut: t("Sign out", "Выйти"),
  kiosk: t("Kiosk link for this mode", "Ссылка киоска для режима"),
  empty: t("No check-ins yet", "Пока никого нет"),
  nameLbl: t("Name", "Имя"),
  phoneLbl: t("Phone", "Телефон"),
  modeLbl: t("Mode", "Режим"),
  time: t("Time", "Время"),
  retention: t("Delete this data after the event.", "Удалите эти данные после мероприятия."),
} satisfies Record<string, L>;

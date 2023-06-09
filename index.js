// import { Bot } from './utils/bot.js';
// import { Markup } from 'telegraf';
// import { config } from 'dotenv';
// import { getEventsData } from './moodle/moodleScraper.js';
// import { beutifyEventsMessageForTelegram, upcomingTestsMessage, redoCoursesMessage, bestTestsMessage } from './utils/textHandler.js';
// import { user } from './utils/user.js';
// import { main } from './meidanet/index.js';


// config();


// const bot = Bot();

// bot.start((ctx) => {
//     const keyboard = Markup.inlineKeyboard([
//         Markup.button.callback('הצג עבודות הגשה', 'jobs')
//     ]);
//     ctx.reply('ברוכים הבאים לבוט של שנקר', keyboard);
// });

// bot.on('callback_query', async (ctx) => {
//     console.log(`Got New Callback Query from: id: ${ctx.from.id} username: ${ctx.from.username} name: ${ctx.from.first_name}`);
//     try {
//     const userId = ctx.from.id;
//     const [type, option] = ctx.callbackQuery.data.split(":");
//     const menuKeyboard = Markup.inlineKeyboard([
//         [Markup.button.callback('בחזרה לתפריט', 'תפריט')],
//     ]);
//     if (type === 'jobs') {
//         const typingMessage = await ctx.reply('...מכינים עבודות הגשה להצגה');
//         const userData = user(ctx.from.id);
//         if (!userData) {
//             await Promise.all([
//                 ctx.telegram.deleteMessage(typingMessage.chat.id, typingMessage.message_id),
//                 ctx.reply("לא מצאתי את המשתמש שלך במערכת שנקר, נסה להגדיר משתמש חדש", menuKeyboard),
//             ]);
//             return;
//         }
//         const events = await getEventsData(userData);
//         await Promise.all([
//             ctx.telegram.deleteMessage(typingMessage.chat.id, typingMessage.message_id),
//             ctx.reply(beutifyEventsMessageForTelegram(events),  { parse_mode: "Markdown" }),
//             ctx.reply("בחזרה לתפריט", menuKeyboard),
//         ])
//     } else if (type === 'tests') {
//         console.log("tests");
//         const lookingForMessage = await ctx.reply("מחפש את המידע שביקשת...");
//         const testsData = await main(user(ctx.from.id));
//         const { best5, upcomingTests, UPCOMING_NAMES, NEED_TO_RETAKE, lastGotGrade, grades, } = testsData;
//         let testsOptions = option;
//         switch (testsOptions) {
//             case 'upcoming':
//                 await Promise.all([
//                     ctx.telegram.deleteMessage(lookingForMessage.chat.id, lookingForMessage.message_id),
//                     ctx.reply(upcomingTestsMessage(upcomingTests), { parse_mode: "Markdown" }),
//                 ]);
//                 break;
//             case 'redoCourses':
//                 await Promise.all([
//                     ctx.telegram.deleteMessage(lookingForMessage.chat.id, lookingForMessage.message_id),
//                     ctx.reply(redoCoursesMessage(NEED_TO_RETAKE), { parse_mode: "Markdown" }),
//                 ]);
//                 break;
//             case 'bestTests':
//                 await Promise.all([
//                     ctx.telegram.deleteMessage(lookingForMessage.chat.id, lookingForMessage.message_id),
//                     ctx.reply(bestTestsMessage(best5), { parse_mode: "Markdown" }),
//                 ]);
//                 break;
//             case 'avg':
//                 await Promise.all([
//                     console.log("NO AVG DATA YET"),
//                     ctx.telegram.deleteMessage(lookingForMessage.chat.id, lookingForMessage.message_id),
//                     ctx.reply("אין עדיין מידע על ממוצע", { parse_mode: "Markdown" }),
//                 ]);
//                 break;
//             default:
//                 break;
//             }
//         };
//     } catch (error) {
//         console.log(error);
//     }
//     });

// bot.on("text", (ctx) => {
//     console.log(`Got New Message from: id: ${ctx.from.id} username: ${ctx.from.username} name: ${ctx.from.first_name}`);
//     const userId = ctx.from.id;
//     const { hebrewName } = user(userId);
//     const keyboard = Markup.inlineKeyboard([
//         [Markup.button.callback('הצג עבודות הגשה', 'jobs')],
//         [Markup.button.callback('הצג מבחנים קרובים', 'tests:upcoming')],
//         [Markup.button.callback('הצג קורסים שצריך לקחת מחדש', 'tests:redoCourses')],
//         [Markup.button.callback('הצג את המבחנים הטובים ביותר', 'tests:bestTests')],
//         [Markup.button.callback('ֿממוצע', 'tests:avg')],
//     ]);
//     ctx.reply(` ${hebrewName} ברוכים הבאים לבוט של שנקר`);
//     ctx.reply("בחר מהתפריט", keyboard);
// });


// bot.launch();

// console.log("Bot is running");

const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const token = process.env.TELEGRAM_BOT_API_TOKEN;

const model = genAI.getGenerativeModel({ model: "gemini-pro"});
const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply('Вітаю.'))

bot.command('quit', async (ctx) => {
    await ctx.telegram.leaveChat(ctx.message.chat.id)
    await ctx.leaveChat()
})
bot.on('text', async (ctx) => {
    const prompt = `надішли дані продукту ${ctx.message.text} в форматі JSON за токою схемою { img: ця фотографія продукту, ingridients: склад продукту, isVegan: чи є веганським} фото бери з google пошуку`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    ctx.reply(response)
});

bot.launch()

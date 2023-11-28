const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const token = '6890052934:AAE_IKHsd09EsX_N09xyTGuXiP931O5m9M8';
const webAppUrl = 'https://main--glistening-smakager-d89994.netlify.app'
// const webAppUrl = 'https://dd61-79-139-171-121.ngrok-free.app'

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text

    if (text === '/start') {
        await bot.sendMessage(chatId,'Выберите дату', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Дата', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(chatId,'Ваши данные обновлены');
            await bot.sendMessage(chatId, `${data.name} ${data.surname} ${data.classNumber}`);

        }
        catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, name, surname, className} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Ok',
            input_message_content: {message_text: `Data saved ${name} ${surname} ${className}`}
        })
        return res.status(200).json({})
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({})
    }
})

const PORT = 8080;

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
from aiohttp import web
from aiogram import Bot
import os

BOT_TOKEN = '8190188550:AAE_Y4jwVLJqPlFh58BcB7Vg9KR05rJlO3Y'
CHAT_ID = '681648765'

bot = Bot(token=BOT_TOKEN)


async def handle_order_notification(request):
    data = await request.json()
    order = data

    text = (
        f"📦 Новый заказ #{order['id']}\n"
        f"👤 Имя: {order['name']}\n"
        f"📞 Телефон: {order['phone']}\n"
        f"🏠 Адрес: {order['address']}\n"
        f"💬 Комментарий: {order['comment']}\n"
        f"🛒 Товары:\n"
    )
    for item in order['items']:
        product = item['product']
        option = item.get('option') or '—'
        quantity = item['quantity']
        text += f"  - ID {product}, Опция: {option}, Кол-во: {quantity}\n"

    await bot.send_message(chat_id=CHAT_ID, text=text)
    return web.Response(text="OK", status=200)


def setup_webhook_app():
    app = web.Application()
    app.router.add_post("/notify-order", handle_order_notification)
    return app

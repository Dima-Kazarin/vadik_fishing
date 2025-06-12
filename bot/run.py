import asyncio
from aiogram import Bot, Dispatcher
from aiohttp import web
from app.handlers import router
from webhook import setup_webhook_app

TOKEN = '8190188550:AAE_Y4jwVLJqPlFh58BcB7Vg9KR05rJlO3Y'

async def main():
    bot = Bot(token=TOKEN)
    dp = Dispatcher()
    dp.include_router(router)

    # aiohttp сервер
    webhook_app = setup_webhook_app()
    runner = web.AppRunner(webhook_app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", 8081)  # порт для webhook'а
    await site.start()

    # Запуск aiogram
    await dp.start_polling(bot)

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Bot stopped")

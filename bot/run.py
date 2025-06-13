import asyncio
from aiogram import Bot, Dispatcher
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.enums import ParseMode
from aiohttp import web
from app.handlers import router
from webhook import setup_webhook_app

TOKEN = '8190188550:AAE_Y4jwVLJqPlFh58BcB7Vg9KR05rJlO3Y'


async def main():
    session = AiohttpSession(proxy='http://proxy.server:3128')
    bot = Bot(token=TOKEN, parse_mode=ParseMode.HTML, session=session)
    dp = Dispatcher()
    dp.include_router(router)

    await dp.start_polling(bot)


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('Exit')

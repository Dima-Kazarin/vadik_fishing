from aiogram import F, Router
from aiogram.filters import CommandStart
import aiohttp
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery

import bot.app.keyboard as kb

router = Router()


@router.message(CommandStart())
async def start(message):
    chat_id = message.chat.id
    await message.answer(f'Hello! {chat_id}', reply_markup=kb.main)


@router.message(F.text == 'Все заказы')
async def show_orders(message: Message):
    async with aiohttp.ClientSession() as session:
        async with session.get("https://kvesy.pythonanywhere.com/api/orders/") as response:
            if response.status == 200:
                orders = await response.json()
                if not orders:
                    await message.answer("Заказов нет.")
                    return

                messages = []
                for order in orders:
                    order_text = (
                        f"📦 Заказ #{order['id']}\n"
                        f"👤 Имя: {order['name']}\n"
                        f"📞 Телефон: {order['phone']}\n"
                        f"🏠 Адрес: {order['address']}\n"
                        f"💬 Комментарий: {order['comment']}\n"
                        f"🕒 Дата: {order['created_at'][:19].replace('T', ' ')}\n"
                        f"☑️ Выполнение: {'✅' if order['is_done'] else '❌'}\n"
                        f"🛒 Товары:\n"
                    )
                    for item in order["items"]:
                        product_name = f"ID {item['product']}"
                        async with session.get(f"https://kvesy.pythonanywhere.com/api/product/{item['product']}/") as prod_resp:
                            if prod_resp.status == 200:
                                product_data = await prod_resp.json()
                                product_name = product_data.get("name", product_name)

                        option_label = "—"
                        if item['option']:
                            async with session.get(
                                    f"https://kvesy.pythonanywhere.com/api/product-options/{item['option']}/") as opt_resp:
                                if opt_resp.status == 200:
                                    option_data = await opt_resp.json()
                                    option_label = option_data.get("label", option_label)

                        order_text += f"  - {product_name}, Опция: {option_label}, Количество: {item['quantity']}\n"
                    messages.append(order_text)

                    toggle_button = InlineKeyboardMarkup(inline_keyboard=[
                        [InlineKeyboardButton(
                            text="Сделать выполненным" if not order["is_done"] else "Сделать невыполненным",
                            callback_data=f"toggle_done:{order['id']}"
                        )]
                    ])

                for msg in messages:
                    await message.answer(msg, reply_markup=toggle_button)
            else:
                await message.answer(f"Ошибка при получении заказов: {response.status}")


@router.callback_query(F.data.startswith("toggle_done:"))
async def toggle_order_done(callback: CallbackQuery):
    order_id = int(callback.data.split(":")[1])

    async with aiohttp.ClientSession() as session:
        async with session.get(f"https://kvesy.pythonanywhere.com/api/orders/{order_id}/") as get_resp:
            if get_resp.status != 200:
                await callback.answer("Не удалось получить заказ", show_alert=True)
                return
            order_data = await get_resp.json()

        async with session.patch(
                f"https://kvesy.pythonanywhere.com/api/orders/{order_id}/toggle_done/"
        ) as patch_resp:
            if patch_resp.status != 200:
                await callback.answer("Ошибка при обновлении", show_alert=True)
                return

        async with session.get(f"https://kvesy.pythonanywhere.com/api/orders/{order_id}/") as updated_resp:
            if updated_resp.status != 200:
                await callback.answer("Не удалось получить обновлённый заказ", show_alert=True)
                return
            updated_order = await updated_resp.json()

        order_text = (
            f"📦 Заказ #{updated_order['id']}\n"
            f"👤 Имя: {updated_order['name']}\n"
            f"📞 Телефон: {updated_order['phone']}\n"
            f"🏠 Адрес: {updated_order['address']}\n"
            f"💬 Комментарий: {updated_order['comment']}\n"
            f"🕒 Дата: {updated_order['created_at'][:19].replace('T', ' ')}\n"
            f"☑️ Выполнение: {'✅' if updated_order['is_done'] else '❌'}\n"
            f"🛒 Товары:\n"
        )

        for item in updated_order["items"]:
            product_name = f"ID {item['product']}"
            async with session.get(f"https://kvesy.pythonanywhere.com/api/product/{item['product']}/") as prod_resp:
                if prod_resp.status == 200:
                    product_data = await prod_resp.json()
                    product_name = product_data.get("name", product_name)

            option_label = "—"
            if item['option']:
                async with session.get(
                        f"https://kvesy.pythonanywhere.com/api/product-options/{item['option']}/"
                ) as opt_resp:
                    if opt_resp.status == 200:
                        option_data = await opt_resp.json()
                        option_label = option_data.get("label", option_label)

            order_text += f"  - {product_name}, Опция: {option_label}, Количество: {item['quantity']}\n"

        toggle_button = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(
                text="Сделать выполненным ✅" if not updated_order["is_done"] else "Сделать невыполненным ❌",
                callback_data=f"toggle_done:{order_id}"
            )]
        ])

        # Обновляем сообщение
        await callback.message.edit_text(order_text, reply_markup=toggle_button)
        await callback.answer("Статус обновлён.")

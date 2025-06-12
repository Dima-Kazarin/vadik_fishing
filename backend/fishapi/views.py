from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
import aiohttp
import asyncio
from asgiref.sync import async_to_sync

from .models import Product, ProductOption, ProductImage, Order
from .serializers import ProductSerializer, ProductOptionSerializer, ProductImageSerializer, OrderSerializer


async def send_to_telegram(order_data):
    async with aiohttp.ClientSession() as session:
        await session.post("https://api.telegram.org/bot8190188550:AAE_Y4jwVLJqPlFh58BcB7Vg9KR05rJlO3Y/sendMessage", json={
            "chat_id": "681648765",
            "text": f"Новый заказ #{order_data['id']}"
        })


class ProductViewSet(viewsets.ViewSet):
    @extend_schema(responses=ProductSerializer, tags=['Product'])
    def list(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    @extend_schema(responses=ProductSerializer, tags=['Product'])
    def retrieve(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=ProductSerializer, tags=['Product'])
    def create(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=ProductSerializer, tags=['Product'])
    def update(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=ProductSerializer, tags=['Product'])
    def destroy(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


class ProductOptionViewSet(viewsets.ViewSet):
    @extend_schema(responses=ProductOptionSerializer, tags=['ProductOption'])
    def list(self, request):
        options = ProductOption.objects.all()
        serializer = ProductOptionSerializer(options, many=True)
        return Response(serializer.data)

    @extend_schema(responses=ProductOptionSerializer, tags=['ProductOption'])
    def retrieve(self, request, pk=None):
        try:
            option = ProductOption.objects.get(pk=pk)
            serializer = ProductOptionSerializer(option)
            return Response(serializer.data)
        except ProductOption.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=ProductOptionSerializer, tags=['ProductOption'])
    def create(self, request):
        serializer = ProductOptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=ProductOptionSerializer, tags=['ProductOption'])
    def update(self, request, pk=None):
        try:
            option = ProductOption.objects.get(pk=pk)
        except ProductOption.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductOptionSerializer(option, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=ProductOptionSerializer, tags=['ProductOption'])
    def destroy(self, request, pk=None):
        try:
            option = ProductOption.objects.get(pk=pk)
            option.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductOption.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


class ProductImageViewSet(viewsets.ViewSet):
    @extend_schema(responses=ProductImageSerializer, tags=['ProductImage'])
    def list(self, request):
        images = ProductImage.objects.all()
        serializer = ProductImageSerializer(images, many=True)
        return Response(serializer.data)

    @extend_schema(responses=ProductImageSerializer, tags=['ProductImage'])
    def retrieve(self, request, pk=None):
        try:
            image = ProductImage.objects.get(pk=pk)
            serializer = ProductImageSerializer(image)
            return Response(serializer.data)
        except ProductImage.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=ProductImageSerializer, tags=['ProductImage'])
    def create(self, request):
        serializer = ProductImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=ProductImageSerializer, tags=['ProductImage'])
    def update(self, request, pk=None):
        try:
            image = ProductImage.objects.get(pk=pk)
        except ProductImage.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductImageSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=ProductImageSerializer, tags=['ProductImage'])
    def destroy(self, request, pk=None):
        try:
            image = ProductImage.objects.get(pk=pk)
            image.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProductImage.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)


class OrderViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Order.objects.all().order_by('created_at')
        serializer = OrderSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def create(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()

            async_to_sync(send_to_telegram)(serializer.data)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def toggle_done(self, request, pk=None):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        order.is_done = not order.is_done
        order.save()
        return Response({'status': 'updated', 'is_done': order.is_done})

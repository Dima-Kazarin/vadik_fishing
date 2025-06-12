from django.contrib import admin

from .models import ProductImage, ProductOption, Product, Order, OrderItem


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductOptionInline(admin.TabularInline):
    model = ProductOption
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline, ProductOptionInline]


admin.site.register(Order)
admin.site.register(OrderItem)

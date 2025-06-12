from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

from fishapi import views

router = DefaultRouter()
router.register(r'api/product', views.ProductViewSet, basename='product-all')
router.register(r'api/product-options', views.ProductOptionViewSet, basename='product-option')
router.register(r'api/product-images', views.ProductImageViewSet, basename='product-image')
router.register(r'api/orders', views.OrderViewSet, basename='orders')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
] + router.urls + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

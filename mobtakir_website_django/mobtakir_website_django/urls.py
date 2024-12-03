from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include("accounts.urls",  "accounts")),
    path('', include("pages.urls", "pages" )),
    path('blog/', include("blog.urls",  "blog")),
    path('chatbot/', include("chatbot.urls",  "chatbot")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)



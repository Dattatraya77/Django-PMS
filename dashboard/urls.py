from . import views
from django.conf.urls import url


urlpatterns = [

    url(r'^$', views.SearchDashboard.as_view(), name='search_dashboard'),
    url(r'^get-timezone/$', views.GetTimeZone.as_view(), name='search'),
]
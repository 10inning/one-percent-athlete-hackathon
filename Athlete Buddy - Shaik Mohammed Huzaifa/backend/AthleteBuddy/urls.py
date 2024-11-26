from django.urls import path
from AthleteBuddy import views

urlpatterns = [
    path('ask', views.Ask, name="Ask anything"),
    path('getAthlete', views.GetAthleteProfile, name="Gets Athlete's Profile"),
    path('updateProfile', views.UpdateAthleteProfile, name="Update Athlete Details")
]
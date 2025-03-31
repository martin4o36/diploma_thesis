from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from datetime import datetime
from django.core.mail import send_mail
from django.conf import settings

def send_holiday_status_change_email(user_email, user_names, request_id, new_status, request_description):
    subject = "Welcome to our platform"
    message = "Thanks for signing up!"
    recipient_list = [user_email]

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient_list)
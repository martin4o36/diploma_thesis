from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from datetime import datetime

def send_remote_status_change_email(user_email, user_names, request_id, new_status, requested_on, request_description):
    pass
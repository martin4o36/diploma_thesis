from datetime import datetime
from django.core.mail import send_mail
from django.conf import settings

def send_remote_status_change_email(user_email, user_names, request_id, new_status, request_description=None):
    subject = f"Your Remote Work Request has been {new_status.lower()}"

    message = (
        f"Hi {user_names},\n\n"
        f"Your remote request (ID {request_id}) has been {new_status.lower()}.\n"
    )

    if request_description:
        message += f"\nDescription:\n{request_description}\n"

    message += (
        "\nYou can log in to the system to view more details about your request."
        "\n\nBest regards!\n"
    )

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email])


def send_new_remote_email_to_manager(manager_email, employee_names, request_id, start_date, end_date, request_description=None):
    subject = f"New Remote Work Request from {employee_names}"

    start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()

    message = (
        f"Hi,\n\n"
        f"{employee_names} has submitted a new holiday request (ID {request_id}).\n"
        f"Requested dates: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}.\n"
    )

    if request_description:
        message += f"\nDescription:\n{request_description}\n"

    message += (
        "\nPlease log in to the system to review and take action on the request."
        "\n\nBest regards!\n"
    )
        
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [manager_email])
FROM python:3.10-alpine
EXPOSE 8081

# ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update && \
    apk add musl-dev libpq-dev gcc

WORKDIR /backend
COPY requirements.txt /backend
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /backend

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8081"]
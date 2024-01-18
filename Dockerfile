FROM python:3.10-slim

WORKDIR /app

CMD sudo apt update && sudo apt install mkdocs

# install requirements
COPY ./requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# copy app
COPY ./docs /app/docs
COPY ./templates /app/templates
COPY ./theme /app/theme
COPY execute.py /app/
COPY mkdocs.yml /app/
COPY --chmod=0755 ./docker/docker-start.sh /app/docker-start.sh
RUN python execute.py

# run app
CMD ["/app/docker-start.sh"]
EXPOSE 8000
STOPSIGNAL SIGINT

# official python image
FROM python:3.10
# set working directory in container
WORKDIR /app
# add current directory to container
ADD . /app
# install dependencies specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
# expose port 5000
EXPOSE 5000
# define environment variable
ENV NAME World
# run app.py when container launches
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]

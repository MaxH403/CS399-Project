from fastapi import FastAPI 
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()


# mount static files directories (only for static file like css)
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/images", StaticFiles(directory="images"), name="images")

# this function does nothing yet
@app.get("/data")
async def get_data():
    # replace with actual data
    return {"message": "Test"}

# sends GET request when entering webpage and displays main webpage
@app.get("/", response_class=HTMLResponse)
async def read_root():
    # reads Wordle.html file and returns html file with status code 200
    with open(os.path.join('html', 'Wordle.html'), 'r') as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)

# sends GET request when clicking Game Description and opens new webpage
@app.get("/game_description", response_class=HTMLResponse)
async def read_description():
    with open(os.path.join("html", "Game_description.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)
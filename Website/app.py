import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from continent_mapping import continent_mapping
import json
import os


# create FastAPI instance
app = FastAPI() 

# add CORS middleware to allow cross-origin requests from any domain, allow all methods and allow all headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# mount static files directories 
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/images", StaticFiles(directory="images"), name="images")

# establish connection with MongoDB database
def get_db():
    client = MongoClient('localhost', 27017)
    db = client['game_db']
    return db

"""
Reads data from country codes in JSON format and inserts data into "countries" database collection in the MongoDB database.
"""
@app.get("/countries")
async def get_countries():
    # load country codes JSON file
    with open("country_codes.json") as json_file:
        data = json.load(json_file)
    # convert dictionary to a list of dictionaries
    countries = [{"code": code, "name": name, "continent": continent_mapping[code]} for code, name in data.items()]
    return countries

"""
reads a JSON file named country_codes.json, loads data, converts it to a list of dictionaries and returns this list.
"""
@app.get("/country_codes")
async def get_country_codes():
    db = get_db()
    # fetches documents from "countries" collection in MongoDB databaes
    country_codes = list(db['countries'].find())
    for code in country_codes:
        #converting ObjectId to string
        code["_id"] = str(code["_id"])
    return country_codes

# define root endpoint and return Wordle.html file 
@app.get("/", response_class=HTMLResponse)
async def read_root():
    # reads Wordle.html file and returns html file with status code 200
    with open(os.path.join('html', 'Flagle.html'), 'r') as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.get("/Game_description", response_class=HTMLResponse)
async def read_description():
    with open(os.path.join("html", "Game_description.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.get("/Login", response_class=HTMLResponse)
async def read_description():
    with open(os.path.join("html", "Login.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/Company", response_class=HTMLResponse)
async def read_description():
    with open(os.path.join("html", "Company.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/Contact_us", response_class=HTMLResponse)
async def read_description():
    with open(os.path.join("html", "Contact_us.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)


@app.get("/Login/CreateUser", response_class=HTMLResponse)
async def read_description():
    with open(os.path.join("html", "CreateUser.html"), "r") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content, status_code=200)


if __name__ == "__main__":
    uvicorn.run(app)

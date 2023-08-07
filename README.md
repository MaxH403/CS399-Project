# CS399-Project

# Image-Based Wordle Game
This project is an image-based guessing game inspired by the Wordle game concept where players guess country names based on the country flag. This application includes both frontend and backend components.

## Project Structure
### Backend: 
- `app.py`: The main entry point for the application. It servees country data and other game related functionalities using the `FastAPI` framework.
- `database.py` Contains functions for database interactions, including establishing a connection to a MongoDB instance and inserting country codes.
- `continent_mapping.py`: Provides a mapping of country codes to their respective continents.
- `country_codes.json`: Contains country codes and country names

### Frontend:
- `Game.js`: Contains the game logic, including functions to display scores, remaining attempts, and fetching random countries.
- `Wordle.html`: The main game interface with sections for game display, score, and attempts.

# Setup and Installation
### Requirements
- Python 3.10
- Docker

### Steps to Run Webpage
1. Clone the repository: `git clone [repository_url]`
2. Run `cd` into the `/Website` directory.
3. Build Docker image: `docker  build -t [image_name] .`
4. Run the Docker container: `docker run -p 8000:5000 [image_name]`
This will start the application and will make it accessible on `http://localhost:8000`.

### Dependencies

This application uses the following Python packages
- `fastapi`: A modern web framework for building APIs with Python.
- `uvicorn`: An ASGI server to serve FASTAPI applications.
- `pymongo`: A Python driver for MongoDB.
- `python-dotenv`: To read key-value pairs from a `.env` file.

To install these dependencies manually, run: `pip install -r requirements.txt`

### Contributors 
- Simon Zhao: https://github.com/SZSage
- Haoyang Tan: https://github.com/JeffTanChina
- Max Hermens: https://github.com/MaxH403


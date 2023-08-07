import json
from pymongo import MongoClient


# establish connection with MongoDB database
def get_db():
    client = MongoClient('localhost', 27017)
    db = client['game_db']
    return db


"""
reads data from country codes in JSON format and inserts data into "countries" database collection in the MongoDB database
"""
def insert_country_codes(db):
    with open('country_codes.json') as f:
        data = json.load(f)
        for country_code, country_name in data.items():
            db['countries'].insert_one({'code': country_code, 'name': country_name})


# fetches documents from "countries" collection in MongoDB databaes
def get_country_codes(db):
    return db['countries'].find()


if __name__ == "__main__":
    db = get_db()
    insert_country_codes(db)
    for country in get_country_codes(db):
        print(country)


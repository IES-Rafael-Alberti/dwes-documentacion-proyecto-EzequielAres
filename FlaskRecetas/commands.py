from flask import Blueprint
import requests
#import app
#from flask.cli import with_appcontext

commands = Blueprint("commands", __name__)


def recipe():
    headers = {'x-rapidapi-host': 'yummly2.p.rapidapi.com',
               'x-rapidapi-key': 'ec018f48b2mshfca3fc0ac8474f2p1a579ejsn5d7bcbd90107'}

    params = {'limit': '18', 'start': '0'}
    r = requests.get('https://yummly2.p.rapidapi.com/feeds/list',
                     params=params, headers=headers)
    r = r.json()

    recetas = []

    for i in range(0, len(r["feed"])):
        try:
            ingredientes = []

            for x in range(0, len(r["feed"][i]["content"]["ingredientLines"])):
                try:
                    ingredientes.append({
                        "nombre": r["feed"][i]["content"]["ingredientLines"][x]["ingredient"],
                        "cantidad": str(r["feed"][i]["content"]["ingredientLines"][x]["quantity"]) +
                        r["feed"][i]["content"]["ingredientLines"][x]["amount"]["metric"]["unit"]["abbreviation"]
                    })
                except KeyError:
                    continue

            recetas.append({"nombre": r["feed"][i]["content"]["details"]["name"],
                            "imagen": r["feed"][i]["display"]["images"][0],
                            "descripcion": r["feed"][i]["display"]["profiles"][0]["description"],
                            "video" : r["feed"][i]["content"]["videos"]["originalVideoUrl"],
                            "pasos": r["feed"][i]["content"]["preparationSteps"],
                            "tags": r["feed"][i]["content"]["details"]["keywords"],
                            "ingredientes": ingredientes})

        except KeyError:
            continue

    return recetas

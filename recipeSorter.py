import json
import re
import mysql.connector

# Fájlok elérési útjai
recipes_file = "./localData/recipes.json"
sorted_recipes_file = "./localData/sorted_recipes.json"

# Adatbázis konfiguráció
db_config = {
    "user":"root",
    "password":"",
    "host":"localhost",
    "database":"craftdle_db",
}

# Recipes.json beolvasása és tárolása
def load_recipes(recipes_path):
    with open(recipes_path, "r", encoding="utf-8") as file:
        return json.load(file)["data"]

# Collections item_id-k kinyerése az adatbázisból
def extract_item_ids_from_db(config):
    item_ids = []
    connection = mysql.connector.connect(**config)
    cursor = connection.cursor()
    cursor.execute("SELECT item_id FROM collections order by id")
    for (item_id,) in cursor:
        item_ids.append(item_id)
    cursor.close()
    connection.close()
    return list(dict.fromkeys(item_ids))  # Egyedi elemek sorrendben

# Recept listák rendezése az item_id-k alapján
def sort_recipes_by_item_ids(recipes_data, item_ids):
    for key in recipes_data:
        recipes_data[key].sort(key=lambda recipe: item_ids.index(recipe['id']) if recipe['id'] in item_ids else len(item_ids))

# Kulcsok rendezése az első elem alapján
def sort_keys_by_first_item(recipes_data, item_ids):
    sorted_keys = sorted(recipes_data.keys(), key=lambda k: item_ids.index(recipes_data[k][0]['id']) if recipes_data[k] and recipes_data[k][0]['id'] in item_ids else len(item_ids))
    return {key: recipes_data[key] for key in sorted_keys}

# Sorted recipes data kiírása egy JSON fájlba
def write_sorted_recipes_to_file(sorted_recipes, output_path):
    with open(output_path, "w", encoding="utf-8") as file:
        json.dump({"data": sorted_recipes}, file, ensure_ascii=False, indent=4)

# Fő futtatás
recipes_data = load_recipes(recipes_file)
item_ids = extract_item_ids_from_db(db_config)
sort_recipes_by_item_ids(recipes_data, item_ids)
sorted_recipes_data = sort_keys_by_first_item(recipes_data, item_ids)
write_sorted_recipes_to_file(sorted_recipes_data, sorted_recipes_file)

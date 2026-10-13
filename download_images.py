import urllib.request
import json
import os
import subprocess

headers = {"User-Agent": "NBARecordsWebsite/1.0 (contact: student@education.edu)"}

targets = [
    # (output_name, search_query or specific_file_title)
    ("basketball-hero", "File:Basketball ball without shadow.png"),
    ("wilt-chamberlain", "File:Wilt Chamberlain 100 Point Game 1962.jpg"),
    ("kobe-bryant", "File:Kobe Bryant 2015.jpg"),
    ("stephen-curry", "File:Stephen Curry Warriors Parade 2017 01.png"),
    ("lebron-james", "File:LeBron James 2018.jpg"),
    ("michael-jordan", "File:Michael Jordan in 1997.jpg"),
    ("nikola-jokic", "File:Nikola Jokić (cropped).jpg"),
    ("bill-russell", "File:Bill Russell 1974.jpg"),
    ("klay-thompson", "File:Klay Thompson 2016.jpg"),
    ("russell-westbrook", "File:Russell Westbrook 2015.jpg"),
    ("reggie-miller", "File:Reggie Miller 2012.jpg"),
    ("dennis-rodman", "File:Dennis Rodman.jpg"),
    ("john-stockton", "File:John Stockton 1992.jpg"),
    ("james-naismith", "File:Dr. James Naismith.jpg"),
    ("manute-bol", "File:Manute Bol.jpg"),
    ("muggsy-bogues", "File:Muggsy Bogues (cropped).jpg"),
    ("nba-arena", "File:Oracle Arena during Game 1 of the 2016 NBA Finals.jpg"),
    ("warriors-2016", "File:Golden State Warriors celebrate their 2015 NBA Championship.jpg"),
    ("lakers-1972", "File:1971-72 Los Angeles Lakers.jpg")
]

def search_if_not_found(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("query", {}).get("search", [])
            if items:
                return items[0]["title"]
    except Exception as e:
        print("Search error:", e)
    return None

def get_image_info(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size|extmetadata&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            pages = data.get("query", {}).get("pages", {})
            for pid, pdata in pages.items():
                if "imageinfo" in pdata:
                    return pdata["imageinfo"][0]
    except Exception as e:
        print("Info error:", e)
    return None

os.makedirs("speech/assets/images", exist_ok=True)
os.makedirs("assets/images", exist_ok=True)

credits_list = []

for name, target in targets:
    title = target
    info = get_image_info(title)
    if not info:
        # try searching
        print(f"Title {title} not found, searching...")
        found_title = search_if_not_found(name.replace("-", " "))
        if found_title:
            title = found_title
            info = get_image_info(title)
    
    if info:
        img_url = info["url"]
        ext = os.path.splitext(img_url)[1].lower()
        if not ext or len(ext) > 5:
            ext = ".jpg"
        out_filename = f"{name}{ext}"
        out_path1 = os.path.join("speech/assets/images", out_filename)
        out_path2 = os.path.join("assets/images", out_filename)
        
        print(f"Downloading {name} from {img_url}...")
        try:
            req = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(req) as resp, open(out_path1, "wb") as f:
                f.write(resp.read())
            # Copy to out_path2
            with open(out_path1, "rb") as src, open(out_path2, "wb") as dst:
                dst.write(src.read())
            
            # Extract credit metadata
            meta = info.get("extmetadata", {})
            artist = meta.get("Artist", {}).get("value", "Wikimedia Commons")
            license_str = meta.get("LicenseShortName", {}).get("value", "CC / Public Domain")
            credits_list.append({
                "file": out_filename,
                "title": title,
                "artist": artist,
                "license": license_str,
                "url": img_url
            })
            print(f"  -> Saved {out_filename} ({os.path.getsize(out_path1)} bytes)")
        except Exception as e:
            print(f"  -> Failed download {name}: {e}")
    else:
        print(f"COULD NOT FIND IMAGE FOR: {name}")

with open("speech/assets/images/credits.json", "w") as f:
    json.dump(credits_list, f, indent=2)
with open("assets/images/credits.json", "w") as f:
    json.dump(credits_list, f, indent=2)

print("\nDone. Total downloaded:", len(credits_list))


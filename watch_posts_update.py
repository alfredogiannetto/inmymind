import os
import json
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class PostHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.event_type in ["created", "modified", "deleted"]:
            generate_posts_json()

def generate_posts_json():
    posts_path = "_posts"
    output_json_path = "_data/posts.json"
    os.makedirs("_data", exist_ok=True)
    
    articles = []
    for post_folder in os.listdir(posts_path):
        post_folder_path = os.path.join(posts_path, post_folder)
        if os.path.isdir(post_folder_path):
            for file in os.listdir(post_folder_path):
                if file.endswith(".json"):
                    json_path = os.path.join(post_folder_path, file)
                    try:
                        with open(json_path, "r", encoding="utf-8") as f:
                            post_data = json.load(f)
                            articles.append({
                                "titolo": post_data.get("titolo", "Senza titolo"),
                                "autore": post_data.get("autore", "Anonimo"),
                                "data": post_data.get("data", "0000-00-00"),
                                "percorso": f"_posts/{post_folder}/{file}"
                            })
                    except json.JSONDecodeError:
                        print(f"Errore nella lettura di {json_path}")
    
    articles.sort(key=lambda x: x["data"], reverse=True)
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=4, ensure_ascii=False)
    
    print(f"File {output_json_path} aggiornato con {len(articles)} articoli.")

def start_watching():
    event_handler = PostHandler()
    observer = Observer()
    observer.schedule(event_handler, path="_posts", recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    generate_posts_json()
    start_watching()

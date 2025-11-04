import os
import json
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from git import Repo
import git

# Configuration explicite du chemin vers Git
git.refresh(path="C:/Program Files/Git/bin/git.exe")  # ← adapte ce chemin si besoin

# Charger la configuration depuis config.json
config_path = os.path.join("C:/Users/ale_r/Documents/GitHub/module-eval-bd", "config.json")
with open(config_path, 'r') as config_file:
    config = json.load(config_file)

WATCH_PATH = config['watch_path']
COMMIT_MESSAGE = config['commit_message']
FILE_EXTENSIONS = tuple(config['file_extensions'])

# Définir le gestionnaire d'événements
class GitAutoPushHandler(FileSystemEventHandler):
    def __init__(self, repo_path):
        self.repo = Repo(repo_path)

    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith(FILE_EXTENSIONS):
            print(f"Modification détectée : {event.src_path}")
            self.repo.git.add(A=True)
            self.repo.index.commit(COMMIT_MESSAGE)
            origin = self.repo.remote(name='origin')
            origin.push()
            print("Modifications poussées sur GitHub.")

# Lancer l'observateur
event_handler = GitAutoPushHandler(WATCH_PATH)
observer = Observer()
observer.schedule(event_handler, path=WATCH_PATH, recursive=True)

print(f"Surveillance du dossier : {WATCH_PATH}")
observer.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()
observer.join()


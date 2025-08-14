from fastapi import FastAPI, Request
from pymongo import MongoClient
from pydantic import BaseModel

app = FastAPI()

client = MongoClient('mongodb://localhost:27017/')
task_db = client['task_db']
task_collection = task_db['tasks']

class Task(BaseModel):
    title: str
    description: str
    completed: bool = False

def serialize_task(task):
    return {
        "id": str(task["_id"]),
        "title": task["title"]
    }


@app.get("/")
def home(request: Request):
    return {'hello':'world!'}

@app.get("/tasks/")
def get_tasks():
    tasks = list(task_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

@app.post("tasks/add")
def add_task(task: Task):
    result = task_collection.insert_one(task.dict())
    return {'message': 'task added'}
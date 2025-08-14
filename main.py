from fastapi import FastAPI, Request
from pymongo import MongoClient
from pydantic import BaseModel
from bson import ObjectId

app = FastAPI()

client = MongoClient('mongodb://localhost:27017/')
task_db = client['task_db']
task_collection = task_db['tasks']

class Task(BaseModel):
    title: str
    description: str
    completed: bool = False

class TaskUpdate(BaseModel):
    title: str
    description: str


@app.get("/")
def home(request: Request):
    return {'hello':'world!'}

@app.get("/tasks/")
def get_tasks():
    tasks = list(task_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

@app.post("/tasks/add")
def add_task(task: Task):
    result = task_collection.insert_one(task.dict())
    return {'message': 'task added'}

@app.put("/tasks/update/{task_id}")
def update_task(task_id: str, task: TaskUpdate):
    result = task_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"title": task.title}}
    )
    if result.modified_count == 1:
        return {"message": "Task updated"}
    else:
        return {"message": "Task not updated"}

@app.delete('/tasks/delete/{task_id}')
def delete_task(task_id: str):
    try:
        result = task_collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 1:
            return {'message': "Task deleted successfully"}
        else:
            return {'message': 'Task not found'}
    except Exception as e:
        return {"error": str(e)}
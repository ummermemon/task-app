from fastapi import FastAPI, Request, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel, Field
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from passlib.hash import bcrypt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you can restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient('mongodb://localhost:27017/')
task_db = client['task_db']
task_collection = task_db['tasks']
user_collection = task_db['users']


class User(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class Task(BaseModel):
    title: str = Field(...,min_length=5,max_length=25)
    description: str = Field(...,min_length=5,max_length=150)
    completed: bool = False

class TaskUpdate(BaseModel):
    title: str = Field(...,min_length=5,max_length=25)
    description: str = Field(...,min_length=5,max_length=150)

class TaskStatusUpdate(BaseModel):
    completed: bool

@app.post("/signup")
def signup(user: User):

    existing_user = user_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password
    hashed_password = bcrypt.hash(user.password)

    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["profile_image"] = "uploads/default.png"

    user_collection.insert_one(user_dict)
    return {"message": "User signed up successfully!"}

@app.get("/")
def home(request: Request):
    return {'hello':'world!'}

@app.get("/tasks/")
def get_tasks():
    tasks = list(task_collection.find())
    for task in tasks:
        task["_id"] = str(task["_id"])
    return tasks

@app.get('/tasks/show/{task_id}')
def show_task(task_id: str):
    task = task_collection.find_one({"_id":ObjectId(task_id)})
    if task:
        task["_id"] = str(task["_id"])
        return task
    else:
        raise HTTPException(status_code=404, detail="Task not found")

@app.post("/tasks/add")
def add_task(task: Task):
    result = task_collection.insert_one(task.dict())
    return {'message': 'task added'}

@app.put("/tasks/update/{task_id}")
def update_task(task_id: str, task: TaskUpdate):
    result = task_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"title": task.title, "description": task.description}}
    )
    if result.modified_count == 1:
        return {"message": "Task updated"}
    else:
        return {"message": "Task not updated"}

@app.put("/tasks/update/status/{task_id}")
def task_status_update(task_id: str, task: TaskStatusUpdate):
    result = task_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"completed": task.completed}}
    )
    if result.modified_count == 1:
        return {"message": "Task Status updated"}
    else:
        return {"message": "Task status not updated"}

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
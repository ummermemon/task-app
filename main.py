from fastapi import FastAPI, Request, HTTPException, Depends, Header
from pymongo import MongoClient
from pydantic import BaseModel, Field
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from passlib.hash import bcrypt
import jwt
from datetime import datetime, timedelta
from fastapi.staticfiles import StaticFiles
import os
from fastapi.security import OAuth2PasswordBearer



app = FastAPI()

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

SECRET_KEY = "UMMER_5678"
ALGORITHM = "HS256"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

class Login(BaseModel):
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@app.get("/user/me")
def read_users_me(user_id: str = Depends(get_current_user)):
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "status": True,
        "_id": user_id,
        "first_name": user["first_name"],
        "last_name": user["last_name"],
        "email": user["email"],
        "profile_image": user["profile_image"]
    }
    

@app.post("/signup")
def signup(user: User):

    existing_user = user_collection.find_one({"email": user.email})

    if existing_user:
        return {"status":False,"message": "User already exist!"}

    # Hash password
    hashed_password = bcrypt.hash(user.password)

    user_dict = user.dict()
    user_dict["role"] = "employee"
    user_dict["password"] = hashed_password
    user_dict["profile_image"] = "uploads/default.png"

    result = user_collection.insert_one(user_dict)
    
    payload = {
        "sub": str(result.inserted_id),
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"status":True,"message": "User signed up successfully!", "token":token}

@app.post("/login")
def login(login: Login):
    user = user_collection.find_one({"email": login.email})
    if not user:
        return {'status': False,'message':"Email or password is incorrect"}

    if not bcrypt.verify(login.password, user["password"]):
        return {'status': False,'message':"Email or password is incorrect"}
    
    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"status": True,"message":"Successfully logged in.", "token":token}



@app.get("/")
def home(request: Request):
    return {'hello':'world!'}

@app.get("/tasks/")
def get_tasks(user=Depends(get_current_user)):
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
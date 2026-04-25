from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from jose import JWTError, jwt
from app.db.mongo import mongo
from app.api.schemas.auth_schemas import *
from app.services.auth_service import *
from app.config import settings
from loguru import logger

router = APIRouter()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        db = mongo.get_db()
        user = await get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister):
    db = await mongo.get_or_connect_db()
    existing = await get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_dict = user.model_dump()
    user_dict["password"] = hash_password(user_dict.pop("password"))
    user_dict["farmer_profile"] = user_dict.pop("farmer_profile", None)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_active"] = True
    uid = await create_user(db, user_dict)
    return {"user_id": uid, "message": "User registered successfully"}

@router.post("/login", response_model=TokenResponse)
async def login(creds: UserLogin):
    db = await mongo.get_or_connect_db()
    user = await get_user_by_email(db, creds.email)
    if not user or not verify_password(creds.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})
    return {"access_token": token}

@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return {"id": str(user["_id"]), "email": user["email"], "role": user["role"], "full_name": user["full_name"]}

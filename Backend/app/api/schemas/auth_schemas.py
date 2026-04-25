from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum

class UserRole(str, Enum):
    farmer = "farmer"
    admin = "admin"
    expert = "expert"

class FarmerProfile(BaseModel):
    farm_size_acres: float
    soil_type: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    irrigation_type: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: UserRole = UserRole.farmer
    phone: Optional[str] = None
    farmer_profile: Optional[FarmerProfile] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SoilProfile(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    moisture: Optional[float] = None
    organic_matter: Optional[float] = None

class CropHistory(BaseModel):
    crop_name: str
    season: str
    year: int
    yield_amount: Optional[float] = None
    yield_unit: Optional[str] = "quintal"

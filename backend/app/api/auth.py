import time
from datetime import datetime
from typing import Optional, Dict, Any, Union
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from ..database.database import get_db
from ..models.models import User, Business, BrandProfile, AudienceProfile, MarketingGoal, ContentPreference
from ..schemas.schemas import UserSignup, UserLogin, Token, UserResponse
from ..core.security import verify_password, get_password_hash, create_access_token
from ..core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


@router.post("/signup", response_model=Token)
def signup(payload: UserSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = f"usr_{int(time.time()*1000)}"
    user = User(
        id=user_id,
        email=payload.email,
        name=payload.name,
        hashed_password=get_password_hash(payload.password),
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()

    # Create associated business workspace
    business_name = payload.business_name or f"{payload.name}'s Brand"
    business = Business(
        id=f"biz_{int(time.time()*1000)}",
        owner_id=user_id,
        name=business_name,
        business_type="D2C Brand",
        location="Bengaluru, India",
        description=f"Autonomous marketing workspace for {business_name}",
        is_onboarded=False,
    )
    db.add(business)
    db.commit()

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "business_id": business.id,
            "business_name": business.name,
        }
    }


@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: Session = Depends(get_db)
):
    # Parse either JSON or Form data (OAuth2 compatible)
    email = None
    password = None

    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            email = body.get("email") or body.get("username")
            password = body.get("password")
        except Exception:
            pass
    elif "application/x-www-form-urlencoded" in content_type or "multipart/form-data" in content_type:
        try:
            form = await request.form()
            email = form.get("username") or form.get("email")
            password = form.get("password")
        except Exception:
            pass
    else:
        try:
            body = await request.json()
            email = body.get("email") or body.get("username")
            password = body.get("password")
        except Exception:
            pass

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email and password are required."
        )

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    business = db.query(Business).filter(Business.owner_id == user.id).first()
    business_id = business.id if business else None
    business_name = business.name if business else None

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "business_id": business_id,
            "business_name": business_name,
        }
    }


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user
    except JWTError:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id:
            return db.query(User).filter(User.id == user_id).first()
    except JWTError:
        pass
    return None


@router.get("/me")
def get_current_user_profile(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    business = db.query(Business).filter(Business.owner_id == user.id).first()
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "business_id": business.id if business else None,
        "business_name": business.name if business else None,
    }



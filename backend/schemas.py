from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional, List
from decimal import Decimal

class OrganizationBase(BaseModel):
    name: str
    sector: Optional[str] = None
    type: Optional[str] = "NGO"
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

class ProjectBase(BaseModel):
    name: str
    organization_id: int
    code: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = "Active"

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

class LocationBase(BaseModel):
    state: str
    lga: str
    ward: Optional[str] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

class ActivityBase(BaseModel):
    project_id: int
    location_id: int
    activity_name: str
    sector: Optional[str] = None
    target_value: Optional[Decimal] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

class ReportBase(BaseModel):
    activity_id: int
    indicator_name: str
    recorded_value: Decimal
    reporting_period: date
    source_kobo_id: Optional[str] = None
    remarks: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime

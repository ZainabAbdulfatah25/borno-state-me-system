from sqlalchemy import Column, Integer, String, Text, Numeric, Date, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    sector = Column(String(100))
    type = Column(String(50), default="NGO")
    contact_name = Column(String(255))
    contact_email = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    projects = relationship("Project", back_populates="organization")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization", back_populates="projects")
    activities = relationship("Activity", back_populates="project")

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100), nullable=False)
    lga = Column(String(100), nullable=False)
    ward = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    activities = relationship("Activity", back_populates="location")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    location_id = Column(Integer, ForeignKey("locations.id"))
    activity_name = Column(Text, nullable=False)
    sector = Column(String(100))
    target_value = Column(Numeric(15, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="activities")
    location = relationship("Location", back_populates="activities")
    reports = relationship("Report", back_populates="activity")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id"))
    indicator_name = Column(String(255), nullable=False)
    recorded_value = Column(Numeric(15, 2), nullable=False)
    reporting_period = Column(Date, nullable=False)
    source_kobo_id = Column(String(100))
    remarks = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    activity = relationship("Activity", back_populates="reports")

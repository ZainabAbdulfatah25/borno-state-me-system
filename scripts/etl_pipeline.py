import requests
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime
import random

# Import backend models
from backend.models import Report, Activity, Project, Organization, Location, Base

# Configuration (Preferably via Environment Variables)
KOBO_TOKEN = os.getenv('KOBO_API_TOKEN', 'your_kobo_api_token_here')
ASSET_UID = os.getenv('KOBO_ASSET_UID', 'your_form_uid_here')
DB_URL = os.getenv('DATABASE_URL', 'sqlite:///./test_me.db')

# Kobo API Endpoints
BASE_URL = "https://kf.kobotoolbox.org/api/v2/assets/{}/data/?format=json"

def get_engine():
    return create_engine(DB_URL)

def fetch_kobo_data():
    """Extract data from Kobo API."""
    if KOBO_TOKEN == 'your_kobo_api_token_here' or ASSET_UID == 'your_form_uid_here':
        print("Kobo credentials not set. Returning mock data.")
        return generate_mock_data()

    headers = {"Authorization": f"Token {KOBO_TOKEN}"}
    response = requests.get(BASE_URL.format(ASSET_UID), headers=headers)
    
    if response.status_code == 200:
        return response.json()['results']
    else:
        print(f"Error fetching data: {response.status_code}. Returning mock data.")
        return generate_mock_data()

def generate_mock_data():
    """Generate dummy data for testing purposes."""
    mock_data = []
    for i in range(10):
        mock_data.append({
            '_id': f'mock_{i}',
            'indicator_val': random.randint(50, 500),
            'activity_ref': 1, # Assuming activity ID 1 exists
            'submission_time': datetime.now().isoformat(),
            'remarks': 'Mock data entry'
        })
    return mock_data

def clean_and_transform(raw_data):
    """Transform Kobo's nested JSON into a clean flat DataFrame."""
    if not raw_data:
        return pd.DataFrame()
        
    df = pd.DataFrame(raw_data)
    
    # Clean column names (Kobo often prefixes fields with group names)
    df.columns = [col.split('/')[-1] for col in df.columns]
    
    # Convert date strings to datetime objects
    if 'submission_time' in df.columns:
        df['submission_time'] = pd.to_datetime(df['submission_time'])
    
    # Handle missing values
    df = df.fillna(0)
    
    # Mapping field names from Kobo to DB schema
    transformed_df = df.rename(columns={
        '_id': 'source_kobo_id',
        'indicator_val': 'recorded_value',
        'activity_ref': 'activity_id'
    })
    
    # Ensure reporting_period is set
    if 'submission_time' in transformed_df.columns:
        transformed_df['reporting_period'] = transformed_df['submission_time'].dt.date
    else:
        transformed_df['reporting_period'] = datetime.now().date()
        
    # Keep only relevant columns for the 'reports' table
    relevant_cols = ['activity_id', 'indicator_name', 'recorded_value', 'reporting_period', 'source_kobo_id', 'remarks']
    
    # Add indicator_name if missing (in mock data it might be)
    if 'indicator_name' not in transformed_df.columns:
        transformed_df['indicator_name'] = 'General Indicator'
        
    return transformed_df[transformed_df.columns.intersection(relevant_cols + ['reporting_period'])]

def load_to_postgres(df):
    """Load the cleaned data into the central database using SQLAlchemy models."""
    if df.empty:
        print("No data to load.")
        return

    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        for _, row in df.iterrows():
            # Check if record already exists by source_kobo_id
            existing = session.query(Report).filter_by(source_kobo_id=row['source_kobo_id']).first()
            if not existing:
                report = Report(
                    activity_id=row['activity_id'],
                    indicator_name=row['indicator_name'],
                    recorded_value=row['recorded_value'],
                    reporting_period=row['reporting_period'],
                    source_kobo_id=row['source_kobo_id'],
                    remarks=row.get('remarks')
                )
                session.add(report)
        
        session.commit()
        print(f"Successfully synced {len(df)} records to database.")
    except Exception as e:
        session.rollback()
        print(f"Error loading to database: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    print("Starting ETL Process...")
    
    # Initialize base data for prototype
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Create a mock organization if none exists
        org = session.query(Organization).first()
        if not org:
            org = Organization(name="Sample NGO", sector="Health", type="NGO")
            session.add(org)
            session.commit()
            print("Created mock organization.")
        
        # Create a mock project
        proj = session.query(Project).first()
        if not proj:
            proj = Project(organization_id=org.id, name="Health Support 2026", code="HS26")
            session.add(proj)
            session.commit()
            print("Created mock project.")
            
        # Create a mock location
        loc = session.query(Location).first()
        if not loc:
            loc = Location(state="Borno", lga="Maiduguri", ward="Ward A")
            session.add(loc)
            session.commit()
            print("Created mock location.")
            
        # Create a mock activity
        act = session.query(Activity).first()
        if not act:
            act = Activity(project_id=proj.id, location_id=loc.id, activity_name="Food Distribution", sector="Nutrition")
            session.add(act)
            session.commit()
            print("Created mock activity.")
            
        # Update mock data to use the actual activity ID
        data = fetch_kobo_data()
        if data:
            for item in data:
                item['activity_ref'] = act.id
                
            cleaned_data = clean_and_transform(data)
            load_to_postgres(cleaned_data)
    except Exception as e:
        print(f"Error during initialization: {e}")
    finally:
        session.close()

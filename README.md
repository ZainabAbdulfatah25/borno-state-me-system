# Monitoring & Evaluation (M&E) System Prototype

This repository contains the core components for a centralized M&E Management Information System.

## Project Structure

- **/sql**: Database schema for PostgreSQL.
- **/scripts**: Automation tools (e.g., Kobo ETL pipeline).
- **/docs**: System architecture diagrams, web portal strategy, and meeting consultation notes.

## Getting Started

1. **Database**: Run the script in `/sql/schema.sql` on a PostgreSQL instance.
2. **ETL Sync**: Update the credentials in `/scripts/etl_pipeline.py` and run it to sync data from KoboToolbox.
3. **Review**: Check `/docs` for the system architecture and strategic roadmap to present to leadership.

## Next Steps

- Implement the React/FastAPI Web Portal for partner management.
- Connect Power BI to the PostgreSQL 'Reports' view.

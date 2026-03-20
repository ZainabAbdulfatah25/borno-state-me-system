# ETL Pipeline Notes

This script provides a foundation for automating M&E data integration from KoboToolbox to PostgreSQL.

## Setup Instructions

1. **API Token**: Obtain your token from Kobo Account Settings > Interface > API Token.
2. **Asset UID**: Find this in the URL of your Kobo form (e.g., `aH3...`).
3. **Environment**: Ensure `pandas`, `requests`, and `sqlalchemy` are installed.
4. **Automation**: This script can be scheduled via Cron (Linux) or Windows Task Scheduler to run daily.

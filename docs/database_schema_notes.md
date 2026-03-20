# Database Schema Notes

The M&E Database Schema is designed to handle multi-partner reporting, project tracking, and indicator monitoring.

## Benefits

- **Relational Integrity**: Ensures every report is linked to a valid project and organization.
- **Traceability**: `source_kobo_id` allows for auditing data back to the original submission.
- **Flexibility**: The `reports` table handles various indicator types without schema changes.

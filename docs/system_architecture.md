# M&E System Architecture

This diagram illustrates the flow of data from field collection to executive dashboards, ensuring a centralized and standardized reporting process.

```mermaid
graph TD
    subgraph "Data Collection Layer"
        P1["Partner A (Field)"] --> K1["KoboToolbox Form"]
        P2["Partner B (Field)"] --> K2["KoboToolbox Form"]
        P3["Partner C (Field)"] --> K3["KoboToolbox Form"]
    end

    subgraph "ETL & Integration Layer (Python)"
        K1 & K2 & K3 --> API["Kobo API (JSON/CSV)"]
        API --> ETL["Python ETL Pipeline"]
        ETL --> CV["Cleaning & Validation"]
        CV --> SM["Schema Mapping"]
    end

    subgraph "Storage Layer"
        SM --> DB[("PostgreSQL Database")]
        DB --> ORG["Organizations Registry"]
        DB --> PROJ["Projects & Activities"]
        DB --> IND["Indicators & Results"]
    end

    subgraph "Analytics & Visualization"
        DB --> PBI["Power BI Dashboard"]
        PBI --> RP["Real-time Reports"]
        PBI --> MAP["Geographic Mapping (LGA/Ward)"]
    end

    subgraph "Advanced: Web Portal (React/FastAPI)"
        DB <--> WP["M&E Web Portal"]
        WP --> AUTH["Role-Based Access Control"]
        WP --> PV["Partner Data Validation"]
    end

    style DB fill:#f9f,stroke:#333,stroke-width:4px
    style ETL fill:#bbf,stroke:#333,stroke-width:2px
    style PBI fill:#dfd,stroke:#333,stroke-width:2px
```

## Key Components

1. **KoboToolbox**: The primary tool for field data collection (offline-ready).
2. **Python ETL**: Automates retrieval, standardizes disparate partner data, and handles schema mapping.
3. **PostgreSQL**: A robust relational database acting as the "Single Source of Truth."
4. **Power BI**: Provides interactive, drill-down analytics for decision-makers.
5. **Web Portal (Optional)**: A custom interface for organizations to manage projects and validate reports directly.

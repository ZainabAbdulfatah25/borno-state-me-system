import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from etl_pipeline import clean_and_transform

class TestETLPipeline(unittest.TestCase):
    def setUp(self):
        # Sample raw data from Kobo API
        self.mock_raw_data = [
            {
                "_id": "12345",
                "group_info/indicator_val": 150,
                "group_info/activity_ref": 1,
                "submission_time": "2023-10-27T10:00:00Z",
                "other_field": "test"
            },
            {
                "_id": "67890",
                "group_info/indicator_val": 200,
                "group_info/activity_ref": 2,
                "submission_time": "2023-10-28T11:00:00Z",
                "other_field": "test2"
            }
        ]

    def test_transformation_logic(self):
        """Test if the transformation correctly handles Kobo's nested/prefixed names."""
        df = clean_and_transform(self.mock_raw_data)
        
        # Check if renaming logic was applied (prefixes removed and mapped to DB schema)
        
        # Check renaming logic
        self.assertIn('source_kobo_id', df.columns) # Renamed from _id
        self.assertIn('recorded_value', df.columns) # Renamed from indicator_val
        self.assertIn('activity_id', df.columns)    # Renamed from activity_ref
        
        # Check values
        self.assertEqual(df.iloc[0]['recorded_value'], 150)
        self.assertEqual(df.iloc[1]['source_kobo_id'], "67890")
        
        # Check date conversion
        self.assertIn('reporting_period', df.columns)
        self.assertEqual(df.iloc[0]['reporting_period'].year, 2023)

if __name__ == '__main__':
    unittest.main()

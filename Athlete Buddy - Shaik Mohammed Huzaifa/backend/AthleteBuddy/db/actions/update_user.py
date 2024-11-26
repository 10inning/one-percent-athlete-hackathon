import os
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch database credentials from environment variables
ENDPOINT = os.getenv("AWS_RDS_ENDPOINT")
USER = os.getenv("AWS_RDS_USER")
PASSWORD = os.getenv("AWS_RDS_PASSWORD")
DATABASE = os.getenv("AWS_RDS_DATABASE")
PORT = 3306

def updateAthleteDetailsInDB(details):
    connection = pymysql.connect(
        host=ENDPOINT,
        user=USER,
        password=PASSWORD,
        database=DATABASE,
        port=PORT,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )

    cursor = connection.cursor()

    # Extract values from the JSON object
    email = details.get("email")
    full_name = details.get("full_name", "")
    age = details.get("age", None)
    gender = details.get("gender", "")
    phone_number = details.get("phone_number", None)
    sport_discipline = details.get("sport_discipline", "")
    position_role = details.get("position_role", None)
    skill_level = details.get("skill_level", "")
    training_days_per_week = details.get("training_days_per_week", None)
    training_duration_per_session = details.get("training_duration_per_session", None)
    competitive_level = details.get("competitive_level", "")
    height_cm = details.get("height_cm", None)
    weight_kg = details.get("weight_kg", None)
    body_fat_percentage = details.get("body_fat_percentage", None)
    injuries_medical_conditions = details.get("injuries_medical_conditions", "")

    try:
        if not email:
            raise ValueError("Email is required to update athlete details.")

        # Dynamically build the SET clause for fields that are not empty or None
        update_fields = []
        update_values = []

        if full_name:
            update_fields.append("full_name = %s")
            update_values.append(full_name)
        if age is not None:
            update_fields.append("age = %s")
            update_values.append(age)
        if gender:
            update_fields.append("gender = %s")
            update_values.append(gender)
        if phone_number:
            update_fields.append("phone_number = %s")
            update_values.append(phone_number)
        if sport_discipline:
            update_fields.append("sport_discipline = %s")
            update_values.append(sport_discipline)
        if position_role is not None:
            update_fields.append("position_role = %s")
            update_values.append(position_role)
        if skill_level:
            update_fields.append("skill_level = %s")
            update_values.append(skill_level)
        if training_days_per_week is not None:
            update_fields.append("training_days_per_week = %s")
            update_values.append(training_days_per_week)
        if training_duration_per_session is not None:
            update_fields.append("training_duration_per_session = %s")
            update_values.append(training_duration_per_session)
        if competitive_level:
            update_fields.append("competitive_level = %s")
            update_values.append(competitive_level)
        if height_cm is not None:
            update_fields.append("height_cm = %s")
            update_values.append(height_cm)
        if weight_kg is not None:
            update_fields.append("weight_kg = %s")
            update_values.append(weight_kg)
        if body_fat_percentage is not None:
            update_fields.append("body_fat_percentage = %s")
            update_values.append(body_fat_percentage)
        if injuries_medical_conditions:
            update_fields.append("injuries_medical_conditions = %s")
            update_values.append(injuries_medical_conditions)

        if not update_fields:
            raise ValueError("No fields to update.")

        # Add email for WHERE clause
        update_values.append(email)

        # Generate SQL query dynamically
        query = f"UPDATE athlete_details SET {', '.join(update_fields)} WHERE email = %s"

        # Execute the query
        cursor.execute(query, update_values)

        # Commit the transaction to save changes
        connection.commit()

        return {"status": "success", "email": email}

    except Exception as e:
        return {"status": "error", "message": str(e)}

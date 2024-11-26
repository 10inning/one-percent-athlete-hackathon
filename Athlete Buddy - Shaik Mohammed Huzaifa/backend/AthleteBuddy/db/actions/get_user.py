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

def getAthleteDetailsFromDB(full_name, email):
    connection = pymysql.connect(
        host=ENDPOINT,
        user=USER,
        password=PASSWORD,
        database=DATABASE,
        port=PORT,
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor,
    )
    try:
        # Use a context manager for the cursor
        with connection.cursor() as cursor:
            # Check if the athlete already exists
            cursor.execute("SELECT * FROM athlete_details WHERE email = %s", (email,))
            athlete = cursor.fetchone()

            if athlete:
                return athlete

            # Insert a new athlete if not found
            cursor.execute(
                """
                INSERT INTO athlete_details 
                (full_name, email, age, gender, phone_number, sport_discipline, position_role, skill_level, training_days_per_week, 
                 training_duration_per_session, competitive_level, height_cm, weight_kg, body_fat_percentage, injuries_medical_conditions)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    full_name, 
                    email, 
                    0,  # Replaced `date_of_birth` with `age`
                    "Other",  # Default gender
                    None,  # Default phone_number
                    "",  # Default sport_discipline
                    None,  # Default position_role
                    "Beginner",  # Default skill_level
                    None,  # Default training_days_per_week
                    None,  # Default training_duration_per_session
                    "Amateur",  # Default competitive_level
                    None,  # Default height_cm
                    None,  # Default weight_kg
                    None,  # Default body_fat_percentage
                    None,  # Default injuries_medical_conditions
                ),
            )

            connection.commit()

            # Retrieve the newly inserted athlete
            cursor.execute("SELECT * FROM athlete_details WHERE email = %s", (email,))
            return cursor.fetchone()

    except pymysql.MySQLError as e:
        print(f"Database error: {e}")
        raise

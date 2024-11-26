athlete_profile = """CREATE TABLE athlete_details (
    athlete_id INT AUTO_INCREMENT PRIMARY KEY,   -- Unique ID for each athlete
    full_name VARCHAR(100) NOT NULL,             -- Athlete's full name
    date_of_birth DATE NOT NULL,                 -- Athlete's date of birth
    gender ENUM('Male', 'Female', 'Other') NOT NULL,  -- Athlete's gender
    email VARCHAR(255) UNIQUE NOT NULL,          -- Athlete's email (unique and required)
    phone_number VARCHAR(15),                    -- Athlete's phone number (optional)
    sport_discipline VARCHAR(50) NOT NULL,       -- Sport/discipline
    position_role VARCHAR(50),                   -- Position/role (if applicable)
    skill_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Professional') NOT NULL,  -- Skill level
    training_days_per_week INT,                  -- Days of training per week
    training_duration_per_session DECIMAL(5,2),  -- Training duration in hours per session
    competitive_level ENUM('School', 'College', 'Amateur', 'Semi-Professional', 'Professional') NOT NULL,  -- Competitive level
    height_cm DECIMAL(5,2),                      -- Height in centimeters
    weight_kg DECIMAL(5,2),                      -- Weight in kilograms
    body_fat_percentage DECIMAL(5,2),            -- Body fat percentage (optional)
    injuries_medical_conditions TEXT,            -- Injuries/medical conditions (optional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Record update timestamp
);
"""
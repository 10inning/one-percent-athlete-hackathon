import re
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from .llm_service import LLM
from datetime import datetime
import pymysql
import os

# Get the current date
current_date = datetime.now()
# Format to YYYY-MM-DD
formatted_date = current_date.strftime("%Y-%m-%d")

ENDPOINT = os.getenv("AWS_RDS_ENDPOINT")
USER = os.getenv("AWS_RDS_USER")
PASSWORD = os.getenv("AWS_RDS_PASSWORD")
DATABASE = os.getenv("AWS_RDS_DATABASE")
PORT = 3306


connection = pymysql.connect(
    host=ENDPOINT,
    user=USER,
    password=PASSWORD,
    database=DATABASE,
    port=PORT,
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)


template = """
    You are a MySQL Query Generator that produces MySQL queries based on user parameters. You will be provided with the schema containing table details, and you will only generate queries for these specified tables. Do not generate table creation, deletion, or modification queries. Your response should contain only one MySQL query in plain text format based on the user query provided—no additional text, descriptions, explanations, or code formatting. The response should be a single line in plain text without any special characters or quotes around the query.

**Example of Expected Output Format:**
- Correct: SELECT * FROM athlete_details";
- Incorrect: SELECT * FROM athlete_details;
- Incorrect: ```SELECT * FROM athlete_details```

Schemas: These are the tables we have and their schemas are listed

- ** Athlete Details **
Table Name = athlete_details
athlete_id	b'int'	NO	PRI	NULL	auto_increment
full_name	b'varchar(100)'	NO		NULL	
age	b'int'	NO		NULL	
gender	b'varchar(20)'	NO		NULL	
email	b'varchar(255)'	NO	UNI	NULL	
phone_number	b'varchar(15)'	YES		NULL	
sport_discipline	b'varchar(50)'	NO		NULL	
position_role	b'varchar(50)'	YES		NULL	
skill_level	b'varchar(50)'	NO		NULL	
training_days_per_week	b'int'	YES		NULL	
training_duration_per_session	b'decimal(5,2)'	YES		NULL	
competitive_level	b'varchar(50)'	NO		NULL	
height_cm	b'decimal(5,2)'	YES		NULL	
weight_kg	b'decimal(5,2)'	YES		NULL	
body_fat_percentage	b'decimal(5,2)'	YES		NULL	
injuries_medical_conditions	b'text'	YES		NULL	
created_at	b'timestamp'	YES		b'CURRENT_TIMESTAMP'	DEFAULT_GENERATED
updated_at	b'timestamp'	YES		b'CURRENT_TIMESTAMP'	DEFAULT_GENERATED on update CURRENT_TIMESTAMP

Here are the options the athlete may select

export const athlete_details =
  gender: [
     value: "Male", label: "Male" ,
     value: "Female", label: "Female" ,
     value: "Other", label: "Other" ,
  ],
  skill_level: [
     value: "Beginner", label: "Beginner" ,
     value: "Intermediate", label: "Intermediate" ,
     value: "Advanced", label: "Advanced" ,
     value: "Professional", label: "Professional" ,
  ],
  competitive_level: [
     value: "School", label: "School" ,
     value: "College", label: "College" ,
     value: "Amateur", label: "Amateur" ,
     value: "Semi-Professional", label: "Semi-Professional" ,
     value: "Professional", label: "Professional" ,
  ],
  sport_discipline: [
     value: "Soccer", label: "Soccer" ,
     value: "Basketball", label: "Basketball" ,
     value: "Tennis", label: "Tennis" ,
     value: "Running", label: "Running" ,
     value: "Swimming", label: "Swimming" ,
    etc...
  ],
  training_days_per_week: [
     value: 1, label: "1 Day" ,
     value: 2, label: "2 Days" ,
     value: 3, label: "3 Days" ,
     value: 4, label: "4 Days" ,
     value: 5, label: "5 Days" ,
     value: 6, label: "6 Days" ,
     value: 7, label: "7 Days" ,
  ],
  training_duration_per_session: [
     value: 0.5, label: "0.5 Hours" ,
     value: 1.0, label: "1 Hour" ,
     value: 1.5, label: "1.5 Hours" ,
     value: 2.0, label: "2 Hours" ,
     value: 2.5, label: "2.5 Hours" ,
     value: 3.0, label: "3 Hours" ,
     value: 3.5, label: "3.5 Hours" ,
     value: 4.0, label: "4 Hours" ,
  ],




and what where is the query limit of the selection should be 3 entries. Even if the user query is to list all or select all

try to use ALike so that it does keyword matching

Today's date {current_date} if any query needs it 
User Query: {Query}
"""


prompt = ChatPromptTemplate.from_template(template=template)

output_retreiver = StrOutputParser()


def data_fetching(query):
    cursor = connection.cursor()

    table_name_match = re.search(r"FROM\s+(\w+)", query, re.IGNORECASE)
    table_name = table_name_match.group(1) if table_name_match else "Unknown"

    cursor.execute(query)
    data = cursor.fetchall()
    return data, table_name


def db_data_retriever(query):
    llm_instance = LLM(token_limit=30, model="gpt-4o-mini")
    llm = llm_instance.get_llm()

    chain = prompt | llm | output_retreiver
    print(query)
    response = chain.invoke({"Query": query, "current_date": formatted_date})
    print(response)
    data = data_fetching(response)

    return data

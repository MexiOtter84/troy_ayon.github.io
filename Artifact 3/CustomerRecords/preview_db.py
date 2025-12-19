import sqlite3


# Connect to database
conn = sqlite3.connect('databases/customer_records.db')

# Create cursor
cursor = conn.cursor()

# Create table in database with multiline string
# Keeping this commented so that I can use this in the future. My plan is to make it so this program can also create
# new databases and connect to specific ones depending on the user's choice.

cursor.execute("""CREATE TABLE data(
first_name text, 
last_name text,
address text,
city text,
state text,
zipcode text)""")


# Commit changes
conn.commit()

# Close connection
conn.close()


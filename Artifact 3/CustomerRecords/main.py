# Troy Ayon
# Python script for customer information database application

######## Imports ########

import keyboard
from tkinter import *
from tkinter import ttk
from tkinter import messagebox
from ttkthemes import ThemedTk
import customtkinter
import sqlite3
import os
import re

# Information for window that will be displayed in application

# Set up for the color themes using customtkinter
customtkinter.set_appearance_mode("dark") 
customtkinter.set_default_color_theme("blue")

# Set up for program window name and size utilizing tkinter
root = customtkinter.CTk()
root.title('Customer Information Database')
screen_width = root.winfo_screenwidth()
screen_height = root.winfo_screenheight()
print("Screen width:", screen_width)
print("Screen height:", screen_height)
root.geometry('800x550+350+150')
root.maxsize(900,650)

# Sets the window so it can't be resized
root.resizable(False, False)

######## Functions ########

# Validation and Sanitization Functions
#
# Validation Rules:
# - First Name: Required, 2-100 characters, letters/spaces/hyphens/apostrophes only
# - Last Name: Required, 2-100 characters, letters/spaces/hyphens/apostrophes only
# - Address: Optional, max 100 characters
# - City: Optional, letters/spaces/hyphens/apostrophes only if provided
# - State: Optional, 2-letter code (e.g., CA, NY, TX) if provided
# - Zipcode: Optional, 5 digits or 5+4 format (12345 or 12345-6789) if provided
#
# All inputs are trimmed of leading/trailing whitespace
# State codes are automatically converted to uppercase

def sanitize_input(text):
	"""Remove leading/trailing whitespace and limit length"""
	if text:
		return text.strip()[:100]  # Limit to 100 characters
	return ""

def validate_required(value, field_name):
	"""Check if required field is not empty"""
	if not value or value.strip() == "":
		messagebox.showerror("Validation Error", f"{field_name} is required.")
		return False
	return True

def validate_name(value, field_name):
	"""Validate name fields (letters, spaces, hyphens, apostrophes only)"""
	if not value:
		return True  # Allow empty if not required

	# Check for invalid characters
	if not re.match(r"^[a-zA-Z\s\-'\.]+$", value):
		messagebox.showerror("Validation Error", f"{field_name} can only contain letters, spaces, hyphens, and apostrophes.")
		return False

	# Check length
	if len(value) < 2:
		messagebox.showerror("Validation Error", f"{field_name} must be at least 2 characters long.")
		return False

	return True

def validate_zipcode(value):
	"""Validate zipcode format (5 digits or 5+4 format)"""
	if not value:
		return True  # Allow empty zipcode

	# Accept 5 digits or 5+4 format (12345 or 12345-6789)
	if not re.match(r"^\d{5}(-\d{4})?$", value):
		messagebox.showerror("Validation Error", "Zipcode must be 5 digits (12345) or 5+4 format (12345-6789).")
		return False

	return True

def validate_state(value):
	"""Validate state code (2 letters)"""
	if not value:
		return True  # Allow empty state

	if not re.match(r"^[a-zA-Z]{2}$", value):
		messagebox.showerror("Validation Error", "State must be a 2-letter code (e.g., CA, NY, TX).")
		return False

	return True

def validate_customer_data(first, last, addr, city, st, zipcode):
	"""Validate all customer data before saving"""
	# Sanitize inputs
	first = sanitize_input(first)
	last = sanitize_input(last)
	addr = sanitize_input(addr)
	city = sanitize_input(city)
	st = sanitize_input(st).upper()  # Convert state to uppercase
	zipcode = sanitize_input(zipcode)

	# Validate required fields
	if not validate_required(first, "First Name"):
		return None
	if not validate_required(last, "Last Name"):
		return None

	# Validate name formats
	if not validate_name(first, "First Name"):
		return None
	if not validate_name(last, "Last Name"):
		return None
	if not validate_name(city, "City"):
		return None

	# Validate state
	if not validate_state(st):
		return None

	# Validate zipcode
	if not validate_zipcode(zipcode):
		return None

	# Return sanitized data
	return {
		'first': first,
		'last': last,
		'address': addr,
		'city': city,
		'state': st,
		'zipcode': zipcode
	}

# Following function obtains the ID number of a selected item in the customer information database
# The following allows it so that we can delete and update items within the customer database
def obtainID():
	global selected_item
	global id_number
	global create_list

	# Check if anything is selected
	selection = tree.selection()
	if not selection:
		return False

	# Pulls ID number of the selected customer record
	selected_item = selection[0]
	current_item = tree.focus()

	# Creates a dictionary that has values for the data record
	create_dict = tree.item(current_item)

	# Converts the dictionary value into a list
	create_list = create_dict.get('values')

	# Check if values exist
	if not create_list or len(create_list) < 7:
		return False

	# Locates the ID number from the newly created list
	id_number = create_list[6]
	return True

# Creates the delete button function
def delete():
	# Call function that is utilized to obtain the ID number of the customer record
	if not obtainID():
		messagebox.showerror("Error", "Please select a record to delete.")
		return

	# Message popup that asks if the user really wants to delete the selected item
	answer = messagebox.askquestion(title="Are you absolutely sure?", message=f"Are you sure you would like to delete the customer record for {create_list[0]}?")

	# If user cancels, return early
	if answer != 'yes':
		return

	try:
		# Connects to the database for customer records
		conn = sqlite3.connect(dbname_combo.get())
		cursor = conn.cursor()

		# Delete the customer record from the database
		cursor.execute("DELETE FROM data WHERE oid = ?", (id_number,))

		# Changes are committed to the database
		conn.commit()

		# Delete from treeview
		tree.delete(selected_item)

		# Clear all text boxes after deletion
		f_name.delete(0, END)
		l_name.delete(0, END)
		address.delete(0, END)
		city.delete(0, END)
		state.delete(0, END)
		zipcode.delete(0, END)

		# Show success message
		messagebox.showinfo("Success", "Record deleted successfully!")

		# Calls the query function to update the customer record database
		query()

	except sqlite3.Error as e:
		messagebox.showerror("Database Error", f"An error occurred: {e}")
	finally:
		# Always close the connection
		if 'conn' in locals():
			conn.close()

# Creates the add record button function which allows for changes to be committed to the database
def submit():
	# Validate and sanitize input data
	validated_data = validate_customer_data(
		f_name.get(),
		l_name.get(),
		address.get(),
		city.get(),
		state.get(),
		zipcode.get()
	)

	# If validation failed, return early
	if validated_data is None:
		return

	try:
		# Connects to the database for customer records
		conn = sqlite3.connect(dbname_combo.get())
		cursor = conn.cursor()
		cursor.execute("INSERT INTO data VALUES (:f_name, :l_name, :address, :city, :state, :zipcode)",
			{
				'f_name': validated_data['first'],
				'l_name': validated_data['last'],
				'address': validated_data['address'],
				'city': validated_data['city'],
				'state': validated_data['state'],
				'zipcode': validated_data['zipcode']
			})

		# Changes are committed to the database
		conn.commit()

		# Clears all boxes for customer records after the add record button is pressed
		f_name.delete(0, END)
		l_name.delete(0, END)
		address.delete(0, END)
		city.delete(0, END)
		state.delete(0, END)
		zipcode.delete(0, END)

		# Show success message
		messagebox.showinfo("Success", "Record added successfully!")

		# Calls the query function to update the customer record database
		query()

	except sqlite3.Error as e:
		messagebox.showerror("Database Error", f"An error occurred: {e}")
	finally:
		# Always close the connection
		if 'conn' in locals():
			conn.close()

# Creates the query function that allows us to view the data that is currently in the customer records database within that view
def query():
	try:
		# Connects to the database for customer records
		conn = sqlite3.connect(dbname_combo.get())
		cursor = conn.cursor()

		# Query command to the customer records database
		cursor.execute("SELECT *, oid FROM data")
		records = cursor.fetchall()
		print(records)

		# Clears the customer record view when the update button is pressed from the user
		for item in tree.get_children():
			tree.delete(item)

		# Updates and adds the customer information record into the view
		for record in records:
			tree.insert("", 'end', text='', values=record)
			print(record)

	except sqlite3.Error as e:
		messagebox.showerror("Database Error", f"An error occurred: {e}")
	finally:
		# Always close the connection
		if 'conn' in locals():
			conn.close()

# Creates an update function that allows us to update customer records
def update():
	# Obtains the customer ID records so we know which record to update
	if not obtainID():
		messagebox.showerror("Error", "Please select a record to update.")
		return

	# Validate and sanitize input data
	validated_data = validate_customer_data(
		f_name.get(),
		l_name.get(),
		address.get(),
		city.get(),
		state.get(),
		zipcode.get()
	)

	# If validation failed, return early
	if validated_data is None:
		return

	try:
		# Connects to the database for customer records
		conn = sqlite3.connect(dbname_combo.get())
		cursor = conn.cursor()
		cursor.execute("""UPDATE data SET
						first_name = :first,
						last_name = :last,
						address = :address,
						city = :city,
						state = :state,
						zipcode = :zipcode
						WHERE oid = :oid""",
						{
							'first': validated_data['first'],
							'last': validated_data['last'],
							'address': validated_data['address'],
							'city': validated_data['city'],
							'state': validated_data['state'],
							'zipcode': validated_data['zipcode'],
							'oid': id_number
						})

		# Changes are committed to the database
		conn.commit()

		# Clear all text boxes after update
		f_name.delete(0, END)
		l_name.delete(0, END)
		address.delete(0, END)
		city.delete(0, END)
		state.delete(0, END)
		zipcode.delete(0, END)

		# Show success message
		messagebox.showinfo("Success", "Record updated successfully!")

		# Calls the query function to update the customer record database
		query()

	except sqlite3.Error as e:
		messagebox.showerror("Database Error", f"An error occurred: {e}")
	finally:
		# Always close the connection
		if 'conn' in locals():
			conn.close()

# Updates the text boxes to become filled with data when an option in the customer records view is selected
def fill_text(event):
	# Check if anything is selected
	selection = tree.selection()
	if not selection:
		# Clear all text boxes if nothing is selected
		f_name.delete(0, END)
		l_name.delete(0, END)
		address.delete(0, END)
		city.delete(0, END)
		state.delete(0, END)
		zipcode.delete(0, END)
		return

	# Get the selected item
	selected = selection[0]

	# Get the values from the selected row
	values = tree.item(selected, 'values')

	# Verify we have data
	if not values or len(values) < 6:
		return

	# Clears data within data fields
	f_name.delete(0, END)
	l_name.delete(0, END)
	address.delete(0, END)
	city.delete(0, END)
	state.delete(0, END)
	zipcode.delete(0, END)

	# Updates the records fields with the data input
	f_name.insert(0, values[0])  # First Name
	l_name.insert(0, values[1])  # Last Name
	address.insert(0, values[2])  # Address
	city.insert(0, values[3])     # City
	state.insert(0, values[4])    # State
	zipcode.insert(0, values[5])  # Zipcode

# Clears all text entry fields
def clear_fields():
	# Clear all text boxes
	f_name.delete(0, END)
	l_name.delete(0, END)
	address.delete(0, END)
	city.delete(0, END)
	state.delete(0, END)
	zipcode.delete(0, END)

	# Deselect any selected items in the treeview
	tree.selection_remove(tree.selection())

# Creates the updates to the customer records database from combo list
def update_dblist():
	databasees = []

	# Locates the databases available in the given folder location
	for root_val, dirs, files in os.walk(r"databases"):
		print(files)
		for file in files:
			if file.endswith(".db"):
				# Adds each database file to the list
				databasees.append(os.path.join(file))

	# Returns database list to the combo list
	return databasees

# Function that is used when the combo box is clicked on and allows the user to switch back and forth between databases
def selected_combo(event):
	try:
		print(f"{dbname_combo.get()} has been selected in the messagebox")
		conn = sqlite3.connect(dbname_combo.get())
		cursor = conn.cursor()
		cursor.execute('SELECT * FROM data')
		names = list(map(lambda x: x[0], cursor.description))
		print(names)

		# Refresh the query view with the new database
		query()

	except sqlite3.Error as e:
		messagebox.showerror("Database Error", f"An error occurred: {e}")
	finally:
		# Always close the connection
		if 'conn' in locals():
			conn.close()

######## Text Boxes ########
#Create Text Boxes for customer records data entry
f_name = customtkinter.CTkEntry(root, width=150, placeholder_text="Required")
f_name.grid(row=1, column=1, padx=20, sticky="we")
l_name = customtkinter.CTkEntry(root, width=150, placeholder_text="Required")
l_name.grid(row=2, column=1, padx=20, sticky="we")
address = customtkinter.CTkEntry(root, width=150, placeholder_text="123 Main St")
address.grid(row=3, column=1, padx=20, sticky="we")
city = customtkinter.CTkEntry(root, width=150, placeholder_text="City name")
city.grid(row=4, column=1, padx=20, sticky="we")
state = customtkinter.CTkEntry(root, width=150, placeholder_text="CA")
state.grid(row=5, column=1, padx=20, sticky="we")
zipcode = customtkinter.CTkEntry(root, width=150, placeholder_text="12345")
zipcode.grid(row=6, column=1, padx=20, sticky="we")

######## Labels ########

# Labels to show which database the user is currently in the customer records
db_label = customtkinter.CTkLabel(root, text="Database:")
db_label.grid(row=0, column=0)

# Database combo boxes
dbname_combo = customtkinter.CTkComboBox(root, values=update_dblist(), command=selected_combo)
dbname_combo.grid(row=0, column=1, padx=20)

# Labels for the text boxes that are used for the customer records input fields
# Asterisk (*) indicates required field
f_name_label = customtkinter.CTkLabel(root, text="First Name *")
f_name_label.grid(row=1, column=0)
l_name_label = customtkinter.CTkLabel(root, text="Last Name *")
l_name_label.grid(row=2, column=0)
address_label = customtkinter.CTkLabel(root, text="Address")
address_label.grid(row=3, column=0)
city_label = customtkinter.CTkLabel(root, text="City")
city_label.grid(row=4, column=0)
state_label = customtkinter.CTkLabel(root, text="State")
state_label.grid(row=5, column=0)
zipcode_label = customtkinter.CTkLabel(root, text="Zipcode")
zipcode_label.grid(row=6, column=0)

######## Treeview Widget Information ########

#Styling for Treeview Widget
style = ttk.Style(root)
style.theme_use("clam")
style.configure("Treeview", background="#2b2b2b", fieldbackground="#2b2b2b", foreground="white", font=('Helvetica', 11), rowheight=25)

#Styling information for heading
style.configure("Treeview.Heading", background="#1f538d", foreground="white", font=('Helvetica', 12, 'bold'))

# Create treeview widget to hold the data
tree = ttk.Treeview(root, selectmode='browse', show='tree headings')
tree.grid(row=7, column=0, columnspan=6, padx=15, pady=15, sticky="nsew")

# Columns are setup for treeview widget data information
tree['columns'] = ('first_name', 'last_name', 'address', 'city', 'state', 'zipcode')
tree.column('#0', width=0, stretch=False)
tree.column('first_name', width=120, minwidth=100)
tree.column('last_name', width=120, minwidth=100)
tree.column('address', width=250, minwidth=200)
tree.column('city', width=110, minwidth=90)
tree.column('state', width=80, minwidth=60)
tree.column('zipcode', width=90, minwidth=80)

# Heading information for the treeview widget data
tree.heading('first_name', text='First Name')
tree.heading('last_name', text='Last Name')
tree.heading('address', text='Address')
tree.heading('city', text='City')
tree.heading('state', text='State')
tree.heading('zipcode', text='ZipCode')

######## Button Information ########

# Creation of a submit button
submit_btn = customtkinter.CTkButton(root, text="Add Record", command=submit)
submit_btn.grid(row=1, column=2, columnspan=1, rowspan=2, pady=10, padx=0, ipadx=10, ipady=10)

# Creation of a delete button
delete_btn = customtkinter.CTkButton(root, text="Delete Record", command=delete)
delete_btn.grid(row=3, column=2, columnspan=1, rowspan=2, pady=10, padx=0, ipadx=10, ipady=10)

# Creation of a update button
update_btn = customtkinter.CTkButton(root, text="Update Record", command=update)
update_btn.grid(row=5, column=2, columnspan=1, rowspan=2, pady=10, padx=0, ipadx=10, ipady=10)

# Creation of a clear button
clear_btn = customtkinter.CTkButton(root, text="Clear Fields", command=clear_fields)
clear_btn.grid(row=1, column=3, columnspan=1, rowspan=2, pady=10, padx=10, ipadx=10, ipady=10)

# When user clicks on part of the treeview widget the data will auto populate in the customer records section
tree.bind("<<TreeviewSelect>>", fill_text)

######## MISC Programming Options ########

query()

# Keyboard shortcuts for common operations
keyboard.on_press_key("enter", lambda _: query())
keyboard.on_press_key("del", lambda _: delete())
keyboard.on_press_key("esc", lambda _: clear_fields())

root.mainloop()









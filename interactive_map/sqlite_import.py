#!/usr/bin/python

import sqlite3
import csv

input_name = 'usa_hotels.csv'
delimiter = '\t'

conn = sqlite3.connect('test.db')

c = conn.cursor()

reader = csv.reader(file(input_name), delimiter=delimiter)
header = reader.next()

create = 'CREATE TABLE hotels (id INTEGER PRIMARY KEY ASC,' + ','.join(header[1:]) + ')'

c.execute('DROP TABLE IF EXISTS hotels')
c.execute(create)

for row in reader:
  c.execute('INSERT INTO hotels (' + ','.join(header[1:]) + ') VALUES ("' + '","'.join(row[1:]) + '")')

conn.commit()
conn.close()


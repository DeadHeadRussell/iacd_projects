#!/usr/bin/python

import csv

input_name = 'usa_hotels.csv'

columns = ['id', 'latitude', 'longitude']
delimiter = '\t'

reader = csv.reader(file(input_name), delimiter=delimiter)

header = reader.next()
column_ids = []
id = 0
for row in header:
  if row in columns:
    column_ids.append(id)
  id += 1

print delimiter.join(columns)

for row in reader:
  new_row = []
  for id in column_ids:
    if id < len(row):
      new_row.append(row[id])
  print delimiter.join(new_row)


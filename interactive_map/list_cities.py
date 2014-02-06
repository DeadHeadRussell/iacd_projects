#!/usr/bin/python

import csv
import sys
import time

reader = csv.reader(sys.stdin, delimiter = ',')

header = reader.next()
look_for = 'TOR_LENGTH'

index = 0

for column in header:
  if column == look_for:
    break
  index += 1

if index == len(header):
  print "Could not find '" + look_for + "' header"
  exit()

cities = {}

now = time.time()

progress = 0
for row in reader:
  if len(row) > index:
    cities[row[index]] = True
  progress += 1
  if (progress % 50000 == 0):
    print progress

length = time.time() - now

print cities
print len(cities)
print length


#!/usr/bin/python

import csv
import sys
import time

def main():
  storm_headers = ['BEGIN_LOCATION', 'END_LOCATION']

  storm_cities = parse('Stormdata_1998.csv', storm_headers, ',')
  hotels_cities = parse('usa_hotels.csv', ['cityName'], '~')
  cities = storm_cities & hotels_cities
  deaths = finddeaths('Stormdata_1998.csv', cities, storm_headers, 'DEATHS_DIRECT', ',')
  print deaths

def parse(filename, headers, delimiter):
  reader = csv.reader(open(filename), delimiter = delimiter)
  indeces = findheaders(reader.next(), headers)
  if len(indeces) != len(headers):
    print "Could not find all headers for '" + filename + "'"
    exit()
  return findcities(reader, indeces)

def findheaders(header_row, headers):
  indeces = []
  current_index = 0
  for column in header_row:
    if column in headers:
      indeces.append(current_index)
    current_index += 1
  return indeces

def findcities(reader, indeces):
  cities = {}
  for row in reader:
    for index in indeces:
      if len(row) > index:
        city_name = row[index].lower().replace(' ', '')
        cities[city_name] = True
  return set(cities.keys())

def finddeaths(filename, from_set, from_headers, to_header, delimiter):
  reader = csv.reader(open(filename), delimiter = delimiter)
  header_row = reader.next()
  from_indeces = findheaders(header_row, from_headers)
  to_index = findheaders(header_row, [to_header])[0]
  deaths = {}
  for row in reader:
    cities = set()
    for index in from_indeces:
      if len(row) > index and len(row) > to_index:
        city_name = row[index].lower().replace(' ', '')
        if city_name in cities:
          continue
        cities = cities | set([city_name])
        tally = deaths.get(city_name, 0)
        deaths[city_name] = tally + int(row[to_index])

  keys = set(from_set) & set(deaths.keys())
  return {k:deaths[k] for k in keys if deaths[k] > 0}

main()


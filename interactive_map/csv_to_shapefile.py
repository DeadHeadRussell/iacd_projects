#!/usr/bin/python

import csv
from shapely.geometry import Point, mapping
from fiona import collection

schema = { 'geometry': 'Point', 'properties': { 'name': 'str', 'city': 'str' } }
output = collection('usa_hotels.shp', 'w', 'ESRI Shapefile', schema)

reader = csv.DictReader('usa_hotels.csv', delimiter='\t')
for row in reader:
  if 'latitude' not in row or 'longitude' not in row:
    continue

  point = Point(float(row['latitude']), float(row['longitude']))
  output.write({
    'properties': {
      'name': row['hotelName'],
      'city': row['cityName']
    },
    'geometry': mapping(point)
  })


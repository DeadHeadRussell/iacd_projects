#!/usr/bin/python

import csv

populations = {
    'California': 38041430,
    'Texas': 26059203,
    'New York': 19570261,
    'Florida': 19317568,
    'Illinois': 12875255,
    'Pennsylvania': 12763536,
    'Ohio': 11544225,
    'Georgia': 9919945,
    'Michigan': 9883360,
    'North Carolina': 9752073,
    'New Jersey': 8864590,
    'Virginia': 8185867,
    'Washington': 6897012,
    'Massachusetts': 6646144,
    'Arizona': 6553255,
    'Indiana': 6537334,
    'Tennessee': 6456243,
    'Missouri': 6021988,
    'Maryland': 5884563,
    'Wisconsin': 5726398,
    'Minnesota': 5379139,
    'Colorado': 5187582,
    'Alabama': 4822023,
    'South Carolina': 4723723,
    'Louisiana': 4601893,
    'Kentucky': 4380415,
    'Oregon': 3899353,
    'Oklahoma': 3814820,
    'Connecticut': 3590347,
    'Iowa': 3074186,
    'Mississippi': 2984926,
    'Arkansas': 2949131,
    'Kansas': 2885905,
    'Utah': 2855287,
    'Nevada': 2758931,
    'New Mexico': 2085538,
    'Nebraska': 1855525,
    'West Virginia': 1855413,
    'Idaho': 1595728,
    'Hawaii': 1392313,
    'Maine': 1329192,
    'New Hampshire': 1320718,
    'Rhode Island': 1050292,
    'Montana': 1005141,
    'Delaware': 917092,
    'South Dakota': 833354,
    'Alaska': 731449,
    'North Dakota': 699628,
    'Vermont': 626011,
    'Wyoming': 576412,
    'District of Columbia': 632323
}

reader = csv.DictReader(open('usa_hotels.csv', 'r'), delimiter='\t')

states = {}

for row in reader:
  if 'stateName' in row:
    name = row['stateName']
    states[name] = states.get(name, 0) + 1

min = 10000
max = 0
for state in states:
  states[state] = states[state] / float(populations[state])
  if states[state] > max:
    max = states[state]
  if states[state] < min:
    min = states[state]

min_r = 0x70
min_g = 0x70
min_b = 0xFF

max_r = 0xFF
max_g = 0x59
max_b = 0x59

colors = {}

for state in states:
  value = states[state]
  percent = (value - min) / (float(max) - min)
  print percent
  colors[state] = {
    'red': min_r + (max_r - min_r) * percent,
    'green': max_g + (min_g - max_g) * (1 - percent),
    'blue': max_b + (min_b - max_b) * (1 - percent)
  }

f = open('state_capita.txt', 'w')
f.write('[NAME_0 = \'United States of America\'] {\n')
for state in states:
  color = colors[state]
  f.write('  [NAME_1 = \'' + state + '\'] {\n')
  f.write('    polygon-fill: rgb(' + str(color['red']) + ', ' + str(color['green']) + ', ' + str(color['blue']) + ');\n')
  f.write('  }\n\n')
f.write('}\n')
f.close()


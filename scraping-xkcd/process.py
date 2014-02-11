#!/usr/bin/python

import string

count = {}

f = open('titles.txt', 'r')
for line in f:
  for p in string.punctuation:
    line = line.replace(p, ' ')
  line = line.replace('\n', '')
  words = line.lower().split(' ')
  for word in words:
    count[word] = count.get(word, 0) + 1
f.close()

f = open('dict.txt', 'w')
f.write('word,count\n')
for k in count:
  f.write(k + ',' + str(count[k]) + '\n')
f.close()


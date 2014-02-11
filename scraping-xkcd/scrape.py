#!/usr/bin/python

from BeautifulSoup import BeautifulSoup 
import urllib
import time

texts = []

last = 1328
numbers = range(847, last + 1)
for num in numbers:
  print 'Scraping: ' + str(num) + ' / ' + str(last)
  url = 'http://xkcd.com/' + str(num)
  req = urllib.urlopen(url)
  page = req.read()
  req.close()

  soup = BeautifulSoup(page)
  comic = soup.find(id='comic')
  if not comic:
    print 'Failed\n' + soup.prettify()
    continue

  img = comic.find('img')

  if img:
    f = open('titles.txt', 'a')
    try:
      f.write(img['title'] + '\n')
    except:
      pass
    f.close()
  else:
    print 'No title: ' + str(comic)

  time.sleep(1)



#!/usr/bin/python

import sqlite3

conn = sqlite3.connect('test.db')

c = conn.cursor()

print (c.execute('SELECT * FROM hotels LIMIT 2')).next()


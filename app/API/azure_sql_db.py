# -*- coding: utf-8 -*-
"""
Created on Thu Mar 21 21:28:23 2019

@author: Jinfeng
"""

import pyodbc
import pandas as pd

server = 'team55-server.database.windows.net'
database = 'team55-DB'
username = 'team55'
password = 'cse6242@project'
driver= '{ODBC Driver 11 for SQL Server}'

cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()
df = pd.read_sql_query("SELECT TOP 10 annual_inc from  ProjectTable", cnxn)
print(df)

#row = cursor.fetchall()
#print(row)
#while row:
#    print (str(row[0]) + " " + str(row[1]))
#    row = cursor.fetchone()
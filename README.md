#Housing Assistance Matters
Data:
Source data files from UI researchers should not be modified, stored in data/source
Build aggregate csv of all years with cleaner column headers by running:
```
python reshape_data.py
```

Shapefiles stored in data/geo/
Join shapefiles with csv data by running
```
topojson \
  -e data/HAI_all_years.csv \
  --id-property +FIPS\
  -p \
  -o data/data.json \
  -- data/geo/UScounties.shp
```

Points of contact:
Code: Ben Chartoff (@bchartoff)
Design: Christina Baird (@madebychristina)